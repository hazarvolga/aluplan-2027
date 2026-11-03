"""Allplan Civil 2027 new features on /2027/civil (Civil launch web page document)."""

from pathlib import Path
import json
import subprocess
import sys
import unittest


ROOT = Path(__file__).resolve().parents[1]
BUILT = ROOT / ".next/server/app/2027/civil.html"
COMPONENT = ROOT / "src/components/sections/AllplanCivilPreview.tsx"
IMAGES = [
    "public/assets/previews/allplan-civil-2027/new-2027-axis-grid.png",
    "public/assets/previews/allplan-civil-2027/new-2027-stationing.png",
    "public/assets/previews/allplan-civil-2027/new-2027-serial-elements.png",
]


def grid() -> dict:
    script = (
        "import fs from 'node:fs'; import ts from 'typescript';"
        "const src = fs.readFileSync('src/data/allplan-civil-2027-news.ts', 'utf8');"
        "const code = ts.transpileModule(src, {compilerOptions: {module: ts.ModuleKind.CommonJS}}).outputText;"
        "const m = {exports: {}}; new Function('module', 'exports', code)(m, m.exports);"
        "process.stdout.write(JSON.stringify(m.exports.civilNews2027));"
    )
    result = subprocess.run(["node", "--input-type=module", "-e", script], cwd=ROOT, check=True, capture_output=True, text=True)
    return json.loads(result.stdout)


def inventory() -> dict[str, str]:
    sys.path.insert(0, str(ROOT / "scripts"))
    from inventory_units import MODULES

    return {unit.id: unit.tr for module in MODULES for unit in module.UNITS}


class CivilNewsContentTests(unittest.TestCase):
    def test_text_is_identical_to_the_inventory_turkish_drafts(self):
        tr = inventory()
        data = grid()
        self.assertEqual(data["kicker"], "/ " + tr["civil.features.eyebrow"])
        self.assertEqual(data["title"], tr["civil.features.section-title"])
        self.assertEqual(data["subtitle"], tr["civil.features.intro"])
        self.assertEqual(data["columns"], 3)
        self.assertEqual(len(data["items"]), 3)
        for number, item in enumerate(data["items"], 1):
            with self.subTest(feature=number):
                self.assertEqual(item["title"], tr[f"civil.features.feature-{number}.title"])
                self.assertEqual(item["description"], tr[f"civil.features.feature-{number}.body"])
                self.assertEqual(item["imageSrc"], "/" + IMAGES[number - 1].removeprefix("public/"))

    def test_images_from_the_launch_document_are_in_the_project(self):
        for path in IMAGES:
            with self.subTest(path=path):
                self.assertTrue((ROOT / path).is_file())

    def test_section_sits_right_after_the_overview_and_uses_the_shared_media_grid(self):
        source = COMPONENT.read_text(encoding="utf-8")
        self.assertIn("MediaGridWithViewer", source)
        self.assertIn("civilNews2027", source)
        self.assertLess(source.index('aria-labelledby="civil-overview-title"'), source.index("civilNews2027}"))
        self.assertLess(source.index("civilNews2027}"), source.index("alu-challenges-band"))


class CivilNewsRenderTests(unittest.TestCase):
    def test_built_page_shows_the_new_features(self):
        if not BUILT.is_file():
            self.skipTest("build output missing")
        html = BUILT.read_text(encoding="utf-8")
        data = grid()
        for text in [data["title"], data["subtitle"], *(i["title"] for i in data["items"]), *(i["description"] for i in data["items"])]:
            with self.subTest(text=text[:40]):
                self.assertIn(text.replace("&", "&amp;").replace("'", "&#x27;"), html)


if __name__ == "__main__":
    unittest.main()
