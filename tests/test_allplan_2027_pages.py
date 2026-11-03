"""Allplan edition 2027 news pages and the 2027 band under the hero of the existing product pages."""

from pathlib import Path
import json
import subprocess
import sys
import unittest


ROOT = Path(__file__).resolve().parents[1]
EDITIONS = ["basic", "concept", "professional", "ultimate"]
BAND_PATHS = {
    "/products/allplan-basic": "/2027/allplan-basic",
    "/products/allplan-concept": "/2027/allplan-concept",
    "/products/allplan-professional": "/2027/allplan-professional",
    "/products/allplan-ultimate": "/2027/allplan-ultimate",
    "/products/civil": "/2027/civil",
}


def content() -> dict:
    script = (
        "import fs from 'node:fs'; import ts from 'typescript';"
        "const src = fs.readFileSync('src/data/allplan-2027-editions.ts', 'utf8');"
        "const code = ts.transpileModule(src, {compilerOptions: {module: ts.ModuleKind.CommonJS}}).outputText;"
        "const m = {exports: {}}; new Function('module', 'exports', code)(m, m.exports);"
        "process.stdout.write(JSON.stringify({editions: m.exports.editions, bands: m.exports.release2027Bands}));"
    )
    result = subprocess.run(["node", "--input-type=module", "-e", script], cwd=ROOT, check=True, capture_output=True, text=True)
    return json.loads(result.stdout)


def inventory():
    sys.path.insert(0, str(ROOT / "scripts"))
    from inventory_units import MODULES

    units = {unit.id: unit for module in MODULES for unit in module.UNITS}
    shared = {key: unit for module in MODULES for key, unit in getattr(module, "SHARED", {}).items()}
    return units, shared


class EditionContentTests(unittest.TestCase):
    def test_text_is_identical_to_the_inventory_turkish_drafts(self):
        units, shared = inventory()
        editions = content()["editions"]
        self.assertEqual([e["slug"] for e in editions], EDITIONS)
        for edition in editions:
            slug = edition["slug"]
            with self.subTest(edition=slug):
                self.assertEqual(edition["eyebrow"], units[f"allplan.{slug}.eyebrow"].tr)
                self.assertEqual(edition["title"], units[f"allplan.{slug}.section-title"].tr)
                self.assertEqual(edition["intro"], units[f"allplan.{slug}.intro"].tr)
                self.assertEqual(edition["path"], f"/2027/allplan-{slug}")
                self.assertEqual(edition["productPath"], f"/products/allplan-{slug}")
                self.assertEqual(len(edition["features"]), 3)
                for number, feature in enumerate(edition["features"], 1):
                    self.assertEqual(feature["text"], shared[units[f"allplan.{slug}.feature-{number}"].shared].tr)
                    self.assertTrue(feature["label"].strip())

    def test_bands_point_every_existing_product_page_to_its_2027_page(self):
        bands = content()["bands"]
        self.assertEqual({path: band["href"] for path, band in bands.items()}, BAND_PATHS)
        units, _ = inventory()
        for slug in EDITIONS:
            self.assertEqual(bands[f"/products/allplan-{slug}"]["title"], units[f"allplan.{slug}.section-title"].tr)
        self.assertEqual(bands["/products/civil"]["title"], units["civil.features.section-title"].tr)

    def test_pages_are_flag_guarded_and_registered(self):
        for slug in EDITIONS:
            source = (ROOT / f"src/app/2027/allplan-{slug}/page.tsx").read_text(encoding="utf-8")
            route = f"/2027/allplan-{slug}"
            with self.subTest(page=slug):
                self.assertIn("isReleaseContentEnabled()", source)
                self.assertIn("MAIN_QUOTE_FORM_URL", source)
                self.assertIn(f"buildRelease2027Metadata('{route}')", source)
                self.assertIn(f"serializeJsonLd(buildRelease2027JsonLd('{route}'))", source)
                self.assertIn(f"path: '{route}'", (ROOT / "src/lib/release-2027-routes.ts").read_text(encoding="utf-8"))

    def test_band_is_shown_under_the_hero_only_while_release_content_is_on(self):
        view = (ROOT / "src/components/sections/SubpageView.tsx").read_text(encoding="utf-8")
        self.assertIn("Release2027Band", view)
        self.assertIn("isReleaseContentEnabled()", view)
        hero = view.index("<SubpageHeroSection")
        band = view.index("<Release2027Band")
        layout = view.index("<StructuredPageLayoutSection")
        self.assertLess(hero, band)
        self.assertLess(band, layout)


class RenderTests(unittest.TestCase):
    def test_built_pages_show_the_band_and_the_news(self):
        built = ROOT / ".next/server/app"
        if not (built / "2027/allplan-basic.html").is_file():
            self.skipTest("build output missing")
        data = content()
        for path, band in data["bands"].items():
            html = (built / (path.lstrip("/") + ".html")).read_text(encoding="utf-8")
            with self.subTest(page=path):
                self.assertIn(f'href="{band["href"]}"', html)
                self.assertIn(band["title"].replace("'", "&#x27;"), html)
        for edition in data["editions"]:
            html = (built / f"2027/allplan-{edition['slug']}.html").read_text(encoding="utf-8")
            with self.subTest(page=edition["path"]):
                self.assertEqual(html.count("<h1"), 1)
                for text in [edition["intro"], edition["title"], *(f["text"] for f in edition["features"])]:
                    self.assertIn(text.replace("&", "&amp;").replace("'", "&#x27;"), html)


if __name__ == "__main__":
    unittest.main()
