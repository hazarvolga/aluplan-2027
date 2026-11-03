"""/2027/civil shows only the Allplan Civil 2027 new features (Civil launch web page document)."""

from pathlib import Path
import json
import subprocess
import sys
import unittest


ROOT = Path(__file__).resolve().parents[1]
BUILT = ROOT / ".next/server/app/2027/civil.html"
VIEW = ROOT / "src/components/sections/CivilNewsView.tsx"
PAGE = ROOT / "src/app/2027/civil/page.tsx"
REMOVED = [
    "src/components/sections/AllplanCivilPreview.tsx",
    "src/components/sections/AllplanCivilPreview.module.css",
    "src/components/sections/CivilFeatureGrid.tsx",
    "src/data/allplan-civil-2027-preview.ts",
]
OLD_HEADINGS = ["ALLPLAN Civil nedir?", "Bu zorluklarla sık sık karşılaşıyor musunuz?", "ALLPLAN işinize nasıl katkı sağlar?", "ALLPLAN Civil’in avantajları", "ALLPLAN Civil özellikleri", "Satın alınabilir seçenekler", "ALLPLAN Civil hakkında sık sorulan sorular"]
IMAGES = [
    "public/assets/previews/allplan-civil-2027/new-2027-axis-grid.png",
    "public/assets/previews/allplan-civil-2027/new-2027-stationing.png",
    "public/assets/previews/allplan-civil-2027/new-2027-serial-elements.png",
]


def exports() -> dict:
    script = (
        "import fs from 'node:fs'; import ts from 'typescript';"
        "const src = fs.readFileSync('src/data/allplan-civil-2027-news.ts', 'utf8');"
        "const code = ts.transpileModule(src, {compilerOptions: {module: ts.ModuleKind.CommonJS}}).outputText;"
        "const m = {exports: {}}; new Function('module', 'exports', code)(m, m.exports);"
        "process.stdout.write(JSON.stringify({grid: m.exports.civilNews2027, hero: m.exports.civilNewsHero}));"
    )
    result = subprocess.run(["node", "--input-type=module", "-e", script], cwd=ROOT, check=True, capture_output=True, text=True)
    return json.loads(result.stdout)


def grid() -> dict:
    return exports()["grid"]


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

    def test_hero_uses_the_civil_slide_body_from_the_inventory_drafts(self):
        tr = inventory()
        hero = exports()["hero"]
        self.assertEqual(hero["eyebrow"], tr["civil.features.eyebrow"])
        self.assertEqual(hero["title"], "ALLPLAN Civil")
        self.assertEqual(hero["description"], tr["civil.slide.hero.body"])

    def test_images_from_the_launch_document_are_in_the_project(self):
        for path in IMAGES:
            with self.subTest(path=path):
                self.assertTrue((ROOT / path).is_file())

    def test_page_is_the_news_only_view_with_the_shared_media_grid_and_a_link_back(self):
        view = VIEW.read_text(encoding="utf-8")
        self.assertIn("MediaGridWithViewer", view)
        self.assertIn("civilNews2027", view)
        self.assertIn("quoteUrl", view)
        self.assertIn("MAIN_QUOTE_FORM_URL", PAGE.read_text(encoding="utf-8"))
        self.assertIn("isReleaseContentEnabled()", PAGE.read_text(encoding="utf-8"))
        self.assertIn('href: "/products/civil"', view.replace("'", '"'))
        self.assertIn("CivilNewsView", PAGE.read_text(encoding="utf-8"))

    def test_the_full_product_page_code_is_gone(self):
        for path in REMOVED:
            with self.subTest(path=path):
                self.assertFalse((ROOT / path).exists())
        self.assertEqual(sorted(p.name for p in (ROOT / "public/assets/previews/allplan-civil-2027").iterdir()), sorted(["civil-hero.jpg", *(Path(i).name for i in IMAGES)]))


class CivilNewsRenderTests(unittest.TestCase):
    def test_built_page_shows_the_new_features(self):
        if not BUILT.is_file():
            self.skipTest("build output missing")
        html = BUILT.read_text(encoding="utf-8")
        data = grid()
        for text in [exports()["hero"]["description"], data["title"], data["subtitle"], *(i["title"] for i in data["items"]), *(i["description"] for i in data["items"])]:
            with self.subTest(text=text[:40]):
                self.assertIn(text.replace("&", "&amp;").replace("'", "&#x27;"), html)
        for heading in OLD_HEADINGS:
            with self.subTest(heading=heading):
                self.assertNotIn(heading, html)
        self.assertEqual(html.count("<h1"), 1)


if __name__ == "__main__":
    unittest.main()
