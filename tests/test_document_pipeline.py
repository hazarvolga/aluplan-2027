"""Original-document copy contract. All mutations are isolated temporary fixtures."""
import hashlib
import importlib.util
import io
import tempfile
import unittest
import zipfile
from pathlib import Path


MODULE_PATH = Path(__file__).resolve().parents[1] / "scripts" / "document_assets.py"
SPEC = importlib.util.spec_from_file_location("document_assets", MODULE_PATH)
document_assets = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(document_assets)


ORIGINALS = (
    "public/docs/V2026_paket-karsilastirme-Q3-2026_R01.pdf",
    "public/docs/V2026_Paket_Karsilastirma-Q4-2025_R01.pdf",
    "public/docs/Declaration_Allplan_2021-06-01.pdf",
    "public/docs/ifc_aktarim_el_kitabi_ifc_4.0_ifc_4.3_2026.pdf",
    "assets/documents/ax3000/ax3000-brochure-de.pdf",
    "assets/documents/ax3000/ax3000-brochure-en.pdf",
    "assets/documents/ax3000/ax3000-brochure-en-alternative.pdf",
    "assets/documents/ax3000/ax3000-functions-en.pdf",
    "assets/documents/ax3000/ax3000-functions-en.docx",
    "assets/documents/ax3000/ax3000-functions-hexagon-en.docx",
)
ALIAS = "public/docs/V2026_paket-karsilastirma-Q3-2026_R01.pdf"
EXPECTED = {
    source: source.replace("assets/documents/ax3000/", "public/docs/ax3000/")
    for source in ORIGINALS
}
EXPECTED_PAIRS = set(EXPECTED.items()) | {(ORIGINALS[0], ALIAS)}


def docx_bytes(include_document=True):
    output = io.BytesIO()
    with zipfile.ZipFile(output, "w") as archive:
        archive.writestr("[Content_Types].xml", '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"/>')
        if include_document:
            archive.writestr("word/document.xml", '<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"/>')
    return output.getvalue()


def snapshot(root):
    return {
        str(path.relative_to(root)): (path.read_bytes(), path.stat().st_mtime_ns)
        for path in root.rglob("*") if path.is_file()
    }


class DocumentPipelineTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        base = Path(self.temp.name)
        self.root = base / "new"
        self.source = base / "old"
        self.root.mkdir()
        self.source.mkdir()
        for index, relative in enumerate(ORIGINALS):
            path = self.source / relative
            path.parent.mkdir(parents=True, exist_ok=True)
            body = docx_bytes() if path.suffix == ".docx" else f"%PDF-1.4\noriginal-{index}\n%%EOF\n".encode()
            path.write_bytes(body)

    def seed_targets(self):
        for target in {target for _, target in EXPECTED_PAIRS}:
            path = self.root / target
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_bytes(b"existing-target-must-survive-preflight-error")
        return snapshot(self.root)

    def test_copies_exact_originals_and_preserves_existing_url_alias(self):
        original_snapshot = snapshot(self.source)
        manifest = document_assets.sync_documents(self.root, self.source)
        self.assertEqual({(entry["source"], entry["target"]) for entry in manifest}, EXPECTED_PAIRS)
        self.assertEqual(len(manifest), 11)
        for entry in manifest:
            with self.subTest(target=entry["target"]):
                original = (self.source / entry["source"]).read_bytes()
                self.assertEqual((self.root / entry["target"]).read_bytes(), original)
                self.assertEqual(entry["sha256"], hashlib.sha256(original).hexdigest())
                self.assertEqual(entry["bytes"], len(original))
        self.assertEqual(snapshot(self.source), original_snapshot)

    def test_repeat_sync_is_idempotent_and_preserves_unrelated_files(self):
        unrelated = self.root / "public/docs/keep-me.txt"
        unrelated.parent.mkdir(parents=True)
        unrelated.write_bytes(b"unrelated user file")
        first = document_assets.sync_documents(self.root, self.source)
        after_first = snapshot(self.root)
        second = document_assets.sync_documents(self.root, self.source)
        self.assertEqual(second, first)
        self.assertEqual(snapshot(self.root), after_first)
        self.assertEqual(unrelated.read_bytes(), b"unrelated user file")

    def test_preflight_uses_committed_documents_when_source_checkout_is_absent(self):
        records = document_assets.sync_documents(self.root, self.source)
        document_assets.write_manifest(self.root, records)

        source_available = document_assets.preflight_documents(
            self.root,
            Path(self.temp.name) / "unavailable-source",
        )

        self.assertFalse(source_available)

    def test_preflight_rejects_invalid_committed_documents_without_source_checkout(self):
        records = document_assets.sync_documents(self.root, self.source)
        document_assets.write_manifest(self.root, records)
        (self.root / records[0]["target"]).write_bytes(b"tampered")

        with self.assertRaises(ValueError):
            document_assets.preflight_documents(
                self.root,
                Path(self.temp.name) / "unavailable-source",
            )

    def test_missing_source_fails_before_overwriting_any_target(self):
        before = self.seed_targets()
        (self.source / ORIGINALS[-1]).unlink()
        with self.assertRaises((FileNotFoundError, ValueError)):
            document_assets.sync_documents(self.root, self.source)
        self.assertEqual(snapshot(self.root), before)

    def test_invalid_pdf_fails_before_overwriting_any_target(self):
        before = self.seed_targets()
        (self.source / ORIGINALS[7]).write_bytes(b"not a PDF")
        with self.assertRaises(ValueError):
            document_assets.sync_documents(self.root, self.source)
        self.assertEqual(snapshot(self.root), before)

    def test_pdf_disguised_as_docx_is_rejected(self):
        before = self.seed_targets()
        (self.source / ORIGINALS[-1]).write_bytes(b"%PDF-1.4\nwrong type\n%%EOF")
        with self.assertRaises(ValueError):
            document_assets.sync_documents(self.root, self.source)
        self.assertEqual(snapshot(self.root), before)

    def test_zip_without_word_document_is_not_accepted_as_docx(self):
        before = self.seed_targets()
        (self.source / ORIGINALS[-1]).write_bytes(docx_bytes(include_document=False))
        with self.assertRaises(ValueError):
            document_assets.sync_documents(self.root, self.source)
        self.assertEqual(snapshot(self.root), before)

    def test_same_or_nested_source_and_target_roots_are_rejected(self):
        for root, source in (
            (self.source, self.source),
            (self.source / "nested", self.source),
            (self.source, self.source / "nested"),
        ):
            with self.subTest(root=root, source=source):
                with self.assertRaises(ValueError):
                    document_assets.sync_documents(root, source)

    def test_symlinked_destination_directory_cannot_escape_root(self):
        outside = Path(self.temp.name) / "outside"
        outside.mkdir()
        (self.root / "public").mkdir()
        (self.root / "public/docs").symlink_to(outside, target_is_directory=True)
        with self.assertRaises(ValueError):
            document_assets.sync_documents(self.root, self.source)
        self.assertEqual(list(outside.iterdir()), [])

    def test_symlinked_destination_file_cannot_overwrite_outside_file(self):
        outside = Path(self.temp.name) / "outside.pdf"
        outside.write_bytes(b"outside preserved")
        target = self.root / EXPECTED[ORIGINALS[0]]
        target.parent.mkdir(parents=True)
        target.symlink_to(outside)
        with self.assertRaises(ValueError):
            document_assets.sync_documents(self.root, self.source)
        self.assertEqual(outside.read_bytes(), b"outside preserved")

    def test_symlinked_source_cannot_import_outside_file(self):
        before = self.seed_targets()
        outside = Path(self.temp.name) / "outside.pdf"
        outside.write_bytes(b"%PDF-1.4\noutside\n%%EOF")
        source = self.source / ORIGINALS[7]
        source.unlink()
        source.symlink_to(outside)
        with self.assertRaises(ValueError):
            document_assets.sync_documents(self.root, self.source)
        self.assertEqual(snapshot(self.root), before)


if __name__ == "__main__":
    unittest.main()


class ManifestValidationTests(unittest.TestCase):
    def test_invalid_manifest_shapes_are_reported(self):
        import json
        with tempfile.TemporaryDirectory() as folder:
            root = Path(folder)
            target = root / document_assets.MANIFEST
            target.parent.mkdir(parents=True)
            for value in [{}, [None], [{}], [{'source': 'a', 'target': 2}], 'bad']:
                with self.subTest(value=value):
                    target.write_text(json.dumps(value))
                    self.assertTrue(document_assets.verify_documents(root))
