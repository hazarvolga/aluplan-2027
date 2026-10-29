import hashlib
import json
import re
import struct
import subprocess
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SOURCE_DIR = ROOT / "assets/source/generated/heroes/families"
PUBLIC_DIR = ROOT / "public/assets/heroes/families"
MANIFEST = SOURCE_DIR / "manifest.md"
RECIPES = SOURCE_DIR / "crop-recipes.json"
CONTACT_SHEET = ROOT / "docs/previews/hero-family-contact-sheet/index.html"
CONTACT_SHEET_README = CONTACT_SHEET.with_name("README.md")

FAMILIES = {
    "VF-00": "vf-00-ecosystem-overview",
    "VF-01": "vf-01-building-design",
    "VF-02": "vf-02-infrastructure-civil",
    "VF-03": "vf-03-construction-fabrication",
    "VF-04": "vf-04-addons-technical-tools",
    "VF-05": "vf-05-complementary-cloud",
    "VF-06": "vf-06-training-support-knowledge",
    "VF-07": "vf-07-allplan-product-platform",
}


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def png_dimensions(path: Path) -> tuple[int, int]:
    data = path.read_bytes()[:24]
    if data[:8] != b"\x89PNG\r\n\x1a\n" or data[12:16] != b"IHDR":
        raise AssertionError(f"Invalid PNG signature: {path}")
    return struct.unpack(">II", data[16:24])


def jpeg_dimensions(path: Path) -> tuple[int, int]:
    data = path.read_bytes()
    if not data.startswith(b"\xff\xd8") or not data.endswith(b"\xff\xd9"):
        raise AssertionError(f"Invalid JPEG signature: {path}")

    offset = 2
    while offset < len(data):
        if data[offset] != 0xFF:
            offset += 1
            continue
        while offset < len(data) and data[offset] == 0xFF:
            offset += 1
        marker = data[offset]
        offset += 1
        if marker in {0xD8, 0xD9}:
            continue
        length = struct.unpack(">H", data[offset : offset + 2])[0]
        if marker in {0xC0, 0xC1, 0xC2, 0xC3, 0xC5, 0xC6, 0xC7,
                      0xC9, 0xCA, 0xCB, 0xCD, 0xCE, 0xCF}:
            height, width = struct.unpack(">HH", data[offset + 3 : offset + 7])
            return width, height
        offset += length
    raise AssertionError(f"JPEG dimensions not found: {path}")


class HeroFamilyAssetContractTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.manifest = MANIFEST.read_text(encoding="utf-8")
        cls.contact_sheet = CONTACT_SHEET.read_text(encoding="utf-8")
        cls.recipes = json.loads(RECIPES.read_text(encoding="utf-8"))
        cls.manifest_assets = {}
        pattern = re.compile(
            r"^\| `VF-\d{2}` \| `([^`]+)` \| (\d+)×(\d+) \| "
            r"([\d,]+) \| `([0-9a-f]{64})` \|",
            re.MULTILINE,
        )
        for name, width, height, byte_count, digest in pattern.findall(cls.manifest):
            cls.manifest_assets[name] = {
                "dimensions": (int(width), int(height)),
                "bytes": int(byte_count.replace(",", "")),
                "sha256": digest,
            }

    def test_all_family_sources_and_derivatives_are_valid(self):
        for family_id, basename in FAMILIES.items():
            source = SOURCE_DIR / f"{basename}-original.png"
            desktop = PUBLIC_DIR / f"{basename}.jpg"
            mobile = PUBLIC_DIR / f"{basename}-mobile.jpg"

            with self.subTest(family=family_id):
                self.assertTrue(source.is_file())
                self.assertTrue(desktop.is_file())
                self.assertTrue(mobile.is_file())
                self.assertGreater(source.stat().st_size, 1_000_000)
                self.assertLess(desktop.stat().st_size, 1_000_000)
                self.assertLess(mobile.stat().st_size, 1_000_000)

                source_width, source_height = png_dimensions(source)
                desktop_width, desktop_height = jpeg_dimensions(desktop)
                mobile_width, mobile_height = jpeg_dimensions(mobile)
                self.assertGreater(source_width, source_height)
                self.assertGreater(desktop_width, desktop_height)
                self.assertAlmostEqual(mobile_width / mobile_height, 0.8, delta=0.001)

                for asset, dimensions in (
                    (source, (source_width, source_height)),
                    (desktop, (desktop_width, desktop_height)),
                    (mobile, (mobile_width, mobile_height)),
                ):
                    row = self.manifest_assets.get(asset.name)
                    self.assertIsNotNone(row, asset.name)
                    self.assertEqual(row["dimensions"], dimensions, asset.name)
                    self.assertEqual(row["bytes"], asset.stat().st_size, asset.name)
                    self.assertEqual(row["sha256"], sha256(asset), asset.name)

    def test_contact_sheet_contains_each_family_and_both_derivatives(self):
        for family_id, basename in FAMILIES.items():
            with self.subTest(family=family_id):
                self.assertIn(f"'{family_id}'", self.contact_sheet)
                self.assertIn(f"'{family_id}':'{basename}'", self.contact_sheet)
        self.assertIn("${name}.jpg", self.contact_sheet)
        self.assertIn("${name}-mobile.jpg", self.contact_sheet)
        self.assertIn("separation-review", self.contact_sheet)

        preview_paths = re.findall(
            r"url\('(/public/assets/heroes/families/\$\{name\}[^']*)'\)",
            self.contact_sheet,
        )
        self.assertEqual(
            preview_paths,
            [
                "/public/assets/heroes/families/${name}.jpg",
                "/public/assets/heroes/families/${name}-mobile.jpg",
            ],
        )
        for basename in FAMILIES.values():
            for suffix in (".jpg", "-mobile.jpg"):
                served_path = preview_paths[0 if suffix == ".jpg" else 1].replace(
                    "${name}", basename
                )
                self.assertTrue((ROOT / served_path.lstrip("/")).is_file(), served_path)

        readme = CONTACT_SHEET_README.read_text(encoding="utf-8")
        self.assertIn("python3 -m http.server 8772 --bind 127.0.0.1", readme)
        self.assertIn("/docs/previews/hero-family-contact-sheet/", readme)

    def test_crop_recipes_are_full_height_and_right_anchored(self):
        self.assertEqual(self.recipes["version"], 1)
        self.assertEqual(self.recipes["jpegQuality"], 84)
        self.assertEqual(set(self.recipes["families"]), set(FAMILIES))

        for family_id, basename in FAMILIES.items():
            source_size = png_dimensions(SOURCE_DIR / f"{basename}-original.png")
            desktop_size = jpeg_dimensions(PUBLIC_DIR / f"{basename}.jpg")
            mobile_size = jpeg_dimensions(PUBLIC_DIR / f"{basename}-mobile.jpg")
            recipe = self.recipes["families"][family_id]

            with self.subTest(family=family_id):
                for variant, expected_size in (
                    ("desktop", desktop_size),
                    ("mobile", mobile_size),
                ):
                    crop = recipe[variant]
                    self.assertEqual((crop["width"], crop["height"]), expected_size)
                    self.assertEqual(crop["height"], source_size[1])
                    self.assertEqual(crop["y"], 0)
                    self.assertEqual(crop["x"] + crop["width"], source_size[0])

    def test_asset_package_is_tracked_by_git(self):
        expected = [MANIFEST, RECIPES, CONTACT_SHEET, CONTACT_SHEET_README]
        for basename in FAMILIES.values():
            expected.extend(
                [
                    SOURCE_DIR / f"{basename}-original.png",
                    PUBLIC_DIR / f"{basename}.jpg",
                    PUBLIC_DIR / f"{basename}-mobile.jpg",
                ]
            )

        for path in expected:
            relative = path.relative_to(ROOT)
            with self.subTest(path=str(relative)):
                tracked = subprocess.run(
                    ["git", "ls-files", "--error-unmatch", str(relative)],
                    cwd=ROOT,
                    capture_output=True,
                    text=True,
                    check=False,
                )
                self.assertEqual(tracked.returncode, 0, tracked.stderr)

    def test_manifest_has_exactly_three_rows_per_family(self):
        for family_id in FAMILIES:
            rows = re.findall(rf"^\| `{re.escape(family_id)}` \|", self.manifest, re.MULTILINE)
            self.assertEqual(len(rows), 3, family_id)


if __name__ == "__main__":
    unittest.main()
