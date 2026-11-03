"""2027 news of the five FRILO editions on the FRILO page: inventory drafts and Images-for-web screenshots."""

from pathlib import Path
import json
import subprocess
import sys
import unittest


ROOT = Path(__file__).resolve().parents[1]
PAGE = ROOT / "src/app/products/frilo/page.tsx"
IMAGES = ROOT / "src/lib/frilo-geo-images.ts"
PUBLIC = ROOT / "public/assets/previews/frilo/2027"
KEYS = ["concept", "professional-concrete", "professional-steel", "professional-timber", "ultimate"]
MAX_BYTES = 450_000


def content() -> dict:
    script = (
        "import fs from 'node:fs'; import ts from 'typescript';"
        "const src = fs.readFileSync('src/data/frilo-editions-2027.ts', 'utf8');"
        "const code = ts.transpileModule(src, {compilerOptions: {module: ts.ModuleKind.CommonJS}}).outputText;"
        "const m = {exports: {}}; new Function('module', 'exports', code)(m, m.exports);"
        "process.stdout.write(JSON.stringify(m.exports.friloEditionNews));"
    )
    result = subprocess.run(["node", "--input-type=module", "-e", script], cwd=ROOT, check=True, capture_output=True, text=True)
    return json.loads(result.stdout)


def inventory():
    sys.path.insert(0, str(ROOT / "scripts"))
    from inventory_units import MODULES

    module = next(m for m in MODULES if m.__name__.endswith("frilo"))
    return module, {unit.id: unit for unit in module.UNITS}, {key: label for key, label, *_ in module.EDITIONS}


class EditionNewsContentTests(unittest.TestCase):
    def test_text_is_identical_to_the_inventory_turkish_drafts(self):
        module, units, names = inventory()
        data = content()
        self.assertEqual([e["name"] for e in data], [names[k] for k in KEYS])
        for edition, key in zip(data, KEYS):
            with self.subTest(edition=key):
                self.assertEqual(edition["newsTitle"], units[f"frilo.{key}.section-title"].tr)
                expected = []
                for number in (1, 2, 3):
                    title = module.SHARED[units[f"frilo.{key}.feature-{number}.title"].shared].tr
                    body = module.SHARED[units[f"frilo.{key}.feature-{number}.body"].shared].tr
                    expected.append({"title": title, "text": body})
                self.assertEqual(edition["features"], expected)


class EditionNewsImageTests(unittest.TestCase):
    def test_every_feature_has_a_web_derivative(self):
        for key in KEYS:
            for number in (1, 2, 3):
                path = PUBLIC / f"{key}-feature-{number}.jpg"
                with self.subTest(image=path.name):
                    self.assertTrue(path.is_file())
                    self.assertLessEqual(path.stat().st_size, MAX_BYTES)

    def test_names_map_to_slugs(self):
        source = IMAGES.read_text(encoding="utf-8")
        for key, name in zip(KEYS, ("FRILO Concept", "FRILO Professional Concrete", "FRILO Professional Steel", "FRILO Professional Timber", "FRILO Ultimate")):
            self.assertIn(f"'{name}': '{key}'", source)

    def test_page_lists_the_editions_under_the_2027_section_with_images(self):
        source = PAGE.read_text(encoding="utf-8")
        self.assertIn("friloEditionNews.map((edition, index) =>", source)
        self.assertIn("friloNewsImage(edition.name, featureIndex)", source)

    def test_images_are_logged(self):
        log = (ROOT / "docs/brand/assets-license-log.md").read_text(encoding="utf-8")
        for key in KEYS:
            self.assertIn(f"`FRILO-{key}`", log)


class EditionNewsRenderTests(unittest.TestCase):
    def test_built_page_shows_titles_and_images(self):
        html = ROOT / ".next/server/app/products/frilo.html"
        if not html.is_file():
            self.skipTest("build output missing")
        text = html.read_text(encoding="utf-8")
        for edition in content():
            self.assertIn(edition["newsTitle"].replace("'", "&#x27;"), text)
        for key in KEYS:
            self.assertIn(f"/assets/previews/frilo/2027/{key}-feature-1.jpg", text)


if __name__ == "__main__":
    unittest.main()
