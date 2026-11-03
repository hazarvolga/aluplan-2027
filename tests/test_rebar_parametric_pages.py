"""Allplan Rebar and Allplan Parametric edition pages (2027 launch web page documents)."""

from pathlib import Path
import re
import subprocess
import json
import sys
import unittest


ROOT = Path(__file__).resolve().parents[1]
BUILT = ROOT / ".next/server/app/products"
PAGES = {
    "rebar": {"route": "/products/allplan-rebar", "name": "Allplan Rebar", "tags": 5, "overview": 4, "benefits": 4, "groups": 6, "items": 30},
    "parametric": {"route": "/products/allplan-parametric", "name": "Allplan Parametric", "tags": 5, "overview": 3, "benefits": 4, "groups": 6, "items": 30},
}


def content(slug: str) -> dict:
    script = (
        "import fs from 'node:fs'; import ts from 'typescript';"
        f"const src = fs.readFileSync('src/data/allplan-{slug}-2027.ts', 'utf8');"
        "const code = ts.transpileModule(src, {compilerOptions: {module: ts.ModuleKind.CommonJS}}).outputText;"
        "const m = {exports: {}}; new Function('module', 'exports', code)(m, m.exports);"
        "process.stdout.write(JSON.stringify(m.exports.content));"
    )
    result = subprocess.run(["node", "--input-type=module", "-e", script], cwd=ROOT, check=True, capture_output=True, text=True)
    return json.loads(result.stdout)


def inventory(slug: str) -> dict[str, str]:
    sys.path.insert(0, str(ROOT / "scripts"))
    from inventory_units import MODULES

    module = next(m for m in MODULES if m.__name__.endswith(f"allplan_{slug}"))
    return {unit.id: unit.tr for unit in module.UNITS}


class EditionContentTests(unittest.TestCase):
    def test_text_is_identical_to_the_inventory_turkish_drafts(self):
        for slug in PAGES:
            data = content(slug)
            tr = inventory(slug)
            with self.subTest(page=slug):
                self.assertEqual(data["tagline"], tr[f"{slug}.hero.subtitle"])
                self.assertEqual(data["lead"], tr[f"{slug}.hero.body"])
                self.assertEqual(data["overviewTitle"], tr[f"{slug}.overview.title"])
                self.assertEqual(data["benefitsTitle"], tr[f"{slug}.benefits.title"])
                self.assertEqual(data["featuresTitle"], tr[f"{slug}.features.title"])
                for number, item in enumerate(data["overview"], 1):
                    self.assertEqual(item["label"], tr[f"{slug}.overview.group-{number}"])
                    self.assertEqual(item["title"], tr[f"{slug}.overview.item-{number}.title"])
                    self.assertEqual(item["text"], tr[f"{slug}.overview.item-{number}.body"])
                for number, item in enumerate(data["benefits"], 1):
                    self.assertEqual(item["title"], tr[f"{slug}.benefits.item-{number}.title"])
                    self.assertEqual(item["text"], tr[f"{slug}.benefits.item-{number}.body"])
                features = [item for group in data["featureGroups"] for item in group["items"]]
                for number, item in enumerate(features, 1):
                    self.assertEqual(item["title"], tr[f"{slug}.features.item-{number:02d}.title"])
                    self.assertEqual(item["text"], tr[f"{slug}.features.item-{number:02d}.body"])

    def test_content_mirrors_the_launch_document_structure(self):
        for slug, expected in PAGES.items():
            data = content(slug)
            with self.subTest(page=slug):
                self.assertEqual(data["name"], expected["name"])
                self.assertEqual(len(data["tags"]), expected["tags"])
                self.assertEqual(len(data["overview"]), expected["overview"])
                self.assertEqual(len(data["benefits"]), expected["benefits"])
                self.assertEqual(len(data["featureGroups"]), expected["groups"])
                self.assertEqual(sum(len(g["items"]) for g in data["featureGroups"]), expected["items"])

    def test_every_text_is_filled_in(self):
        for slug in PAGES:
            data = content(slug)
            texts = [data["tagline"], data["lead"], *data["tags"]]
            texts += [t for o in data["overview"] for t in (o["label"], o["title"], o["text"])]
            texts += [t for b in data["benefits"] for t in (b["title"], b["text"])]
            texts += [t for g in data["featureGroups"] for i in g["items"] for t in (i["title"], i["text"])]
            with self.subTest(page=slug):
                self.assertTrue(all(t.strip() for t in texts))

    def test_pages_state_the_quote_goal(self):
        for slug in PAGES:
            route = PAGES[slug]["route"]
            source = (ROOT / f"src/app{route}/page.tsx").read_text(encoding="utf-8")
            with self.subTest(page=slug):
                self.assertIn("MAIN_QUOTE_FORM_URL", source)
                self.assertIn(f"buildRelease2027Metadata('{route}')", source)
                self.assertIn(f"serializeJsonLd(buildRelease2027JsonLd('{route}'))", source)
                self.assertIn("isReleaseContentEnabled()", source)


class RouteTests(unittest.TestCase):
    def test_pages_live_under_products_like_the_other_edition_pages_and_data_paths_match(self):
        for slug, expected in PAGES.items():
            with self.subTest(page=slug):
                self.assertEqual(content(slug)["path"], expected["route"])
                self.assertFalse((ROOT / "src/app/2027" / slug).exists())


class RenderedPageTests(unittest.TestCase):
    def test_built_pages_show_every_feature_title(self):
        for slug in PAGES:
            built = BUILT / f"allplan-{slug}.html"
            if not built.is_file():
                self.skipTest("build output missing")
            html = built.read_text(encoding="utf-8")
            data = content(slug)
            with self.subTest(page=slug):
                self.assertIn(data["name"], html)
                self.assertEqual(len(re.findall(r"<h1[ >]", html)), 1)
                for group in data["featureGroups"]:
                    for item in group["items"]:
                        self.assertIn(item["title"].replace("&", "&amp;"), html)


if __name__ == "__main__":
    unittest.main()
