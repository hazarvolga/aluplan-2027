"""Client components must not pull the full page dataset into the browser bundle."""

from pathlib import Path
import re
import unittest


ROOT = Path(__file__).resolve().parents[1]
CHUNKS = ROOT / ".next/static/chunks"
MAX_CHUNK_BYTES = 600_000
RUNTIME_SITE_DATA_IMPORT = re.compile(r"import\s+(?!type\b)\{[^}]*\}\s+from\s+'@/lib/site-data'|import\s+\w+\s+from\s+'@/lib/site-data'")


def client_files():
    for folder in ("src/components", "src/app"):
        for path in (ROOT / folder).rglob("*.tsx"):
            text = path.read_text(encoding="utf-8")
            if text.lstrip().startswith("'use client'"):
                yield path, text
    # Components without the directive and helper modules are still pulled into client graphs.
    for pattern in ("*.ts", "*.tsx"):
        for path in (ROOT / "src/components").rglob(pattern):
            text = path.read_text(encoding="utf-8")
            if not text.lstrip().startswith("'use client'"):
                yield path, text


class ClientBundleDataTests(unittest.TestCase):
    def test_client_components_only_type_import_site_data(self):
        offenders = [
            str(path.relative_to(ROOT))
            for path, text in client_files()
            if RUNTIME_SITE_DATA_IMPORT.search(text)
        ]
        self.assertEqual(offenders, [])

    def test_shared_module_has_no_page_dataset(self):
        shared = (ROOT / "src/lib/site-shared.ts").read_text(encoding="utf-8")
        self.assertNotIn("pages.json", shared)
        self.assertNotIn("playlists.json", shared)

    def test_built_client_chunks_exclude_page_bodies(self):
        if not CHUNKS.is_dir():
            self.skipTest("production build output missing")
        heavy = [(p.name, p.stat().st_size) for p in CHUNKS.glob("*.js") if p.stat().st_size > MAX_CHUNK_BYTES]
        with_bodies = [p.name for p in CHUNKS.glob("*.js") if '"bodyNodes"' in p.read_text(encoding="utf-8", errors="ignore")]
        self.assertEqual(heavy, [])
        self.assertEqual(with_bodies, [])


if __name__ == "__main__":
    unittest.main()
