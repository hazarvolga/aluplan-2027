"""FRILO Geotechnics editions on the FRILO page (FRILO 2027 launch document, geotechnics part)."""

from pathlib import Path
import json
import subprocess
import sys
import unittest


ROOT = Path(__file__).resolve().parents[1]
PAGE = ROOT / "src/app/products/frilo/page.tsx"
BUILT = ROOT / ".next/server/app/products/frilo.html"
GEOTECH_KEYS = ["geotech-concept", "geotech-pit", "geotech-retaining", "geotech-ultimate", "soil-mechanics"]


def content() -> dict:
    script = (
        "import fs from 'node:fs'; import ts from 'typescript';"
        "const src = fs.readFileSync('src/data/frilo-geotechnics-2027.ts', 'utf8');"
        "const code = ts.transpileModule(src, {compilerOptions: {module: ts.ModuleKind.CommonJS}}).outputText;"
        "const m = {exports: {}}; new Function('module', 'exports', code)(m, m.exports);"
        "process.stdout.write(JSON.stringify(m.exports.geotechnics));"
    )
    result = subprocess.run(["node", "--input-type=module", "-e", script], cwd=ROOT, check=True, capture_output=True, text=True)
    return json.loads(result.stdout)


def inventory():
    sys.path.insert(0, str(ROOT / "scripts"))
    from inventory_units import MODULES

    module = next(m for m in MODULES if m.__name__.endswith("frilo"))
    units = {unit.id: unit for unit in module.UNITS}
    names = {key: label for key, label, *_ in module.EDITIONS}
    return module, units, names


def expected_features(module, units, key):
    """Shared feature texts of one geotechnics edition, in the order of the launch document."""
    features = []
    number = 1
    while f"frilo.{key}.feature-{number}.title" in units:
        title_ref = units[f"frilo.{key}.feature-{number}.title"].shared
        body_ref = units[f"frilo.{key}.feature-{number}.body"].shared
        features.append({"title": module.SHARED[title_ref].tr, "text": module.SHARED[body_ref].tr})
        number += 1
    return features


class GeotechnicsContentTests(unittest.TestCase):
    def test_text_is_identical_to_the_inventory_turkish_drafts(self):
        module, units, names = inventory()
        data = content()
        self.assertEqual(data["lead"], units["frilo.geotech.whats-new"].tr)
        self.assertEqual([e["name"] for e in data["editions"]], [names[k] for k in GEOTECH_KEYS])
        for edition, key in zip(data["editions"], GEOTECH_KEYS):
            with self.subTest(edition=key):
                self.assertEqual(edition["intro"], units[f"frilo.{key}.intro"].tr)
        for edition, key in zip(data["editions"], GEOTECH_KEYS):
            with self.subTest(news=key):
                features = expected_features(module, units, key)
                title = units.get(f"frilo.{key}.section-title")
                self.assertEqual(edition.get("newsTitle"), title.tr if title else None)
                self.assertEqual(edition["features"], features)

    def test_every_edition_but_soil_mechanics_has_its_own_news_section(self):
        data = content()
        self.assertEqual([len(e["features"]) for e in data["editions"]], [3, 3, 3, 3, 0])

    def test_page_shows_the_geotechnics_sections_with_the_shared_cards(self):
        source = PAGE.read_text(encoding="utf-8")
        self.assertIn("frilo-geotechnics-2027", source)
        self.assertIn('id="frilo-geotechnics"', source)
        self.assertIn('href="#frilo-geotechnics"', source)
        self.assertIn("EditionCards", source)
        self.assertIn("edition.newsTitle", source)
        self.assertNotIn("Dahil olduğu sürümler", source)


class GeotechnicsRenderTests(unittest.TestCase):
    def test_built_page_shows_every_edition_and_feature(self):
        if not BUILT.is_file():
            self.skipTest("build output missing")
        html = BUILT.read_text(encoding="utf-8")
        data = content()
        for text in [data["lead"], *(e["name"] for e in data["editions"]), *(e["intro"] for e in data["editions"]), *(e["newsTitle"] for e in data["editions"] if e.get("newsTitle")), *(f["title"] for e in data["editions"] for f in e["features"])]:
            with self.subTest(text=text[:40]):
                self.assertIn(text.replace("&", "&amp;").replace("'", "&#x27;"), html)


if __name__ == "__main__":
    unittest.main()
