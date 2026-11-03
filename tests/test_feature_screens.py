"""Product screenshots of the Allplan 2027 launch package on the Rebar, Parametric and Allplan 2027 pages."""

from pathlib import Path
import json
import struct
import subprocess
import unittest


ROOT = Path(__file__).resolve().parents[1]

def rebar_and_parametric_are_held() -> bool:
    """Held until ALLPLAN publishes them: the production build renders them as 404 (user-decisions.md, 03.11.2026)."""
    routes = (ROOT / "src/lib/release-2027-routes.ts").read_text(encoding="utf-8")
    return "heldUntilManufacturerRelease: true" in routes
SCREENS_DIR = ROOT / "public/assets/previews/allplan-2027-screens"
LOG = ROOT / "docs/brand/assets-license-log.md"
BUILT = ROOT / ".next/server/app"
MAX_BYTES = 450 * 1024
MAX_WIDTH = 1600


def node_exports(path: str, names: list[str]) -> dict:
    script = (
        "import fs from 'node:fs'; import ts from 'typescript';"
        f"const src = fs.readFileSync('{path}', 'utf8');"
        "const code = ts.transpileModule(src, {compilerOptions: {module: ts.ModuleKind.CommonJS}}).outputText;"
        "const m = {exports: {}}; new Function('module', 'exports', code)(m, m.exports);"
        f"process.stdout.write(JSON.stringify({{{', '.join(f'{n}: m.exports.{n}' for n in names)}}}));"
    )
    result = subprocess.run(["node", "--input-type=module", "-e", script], cwd=ROOT, check=True, capture_output=True, text=True)
    return json.loads(result.stdout)


def jpeg_width(path: Path) -> int:
    data = path.read_bytes()
    index = 2
    while index < len(data):
        marker = data[index + 1]
        if marker in (0xC0, 0xC1, 0xC2):
            return struct.unpack(">H", data[index + 7:index + 9])[0]
        index += 2 + struct.unpack(">H", data[index + 2:index + 4])[0]
    raise AssertionError("no SOF marker")


def screens() -> dict:
    return node_exports("src/data/allplan-2027-screens.ts", ["screens", "featureScreens", "editionScreens"])


def page_content(slug: str) -> dict:
    return node_exports(f"src/data/allplan-{slug}-2027.ts", ["content"])["content"]


class ScreenAssetTests(unittest.TestCase):
    def test_every_screen_is_a_web_sized_jpeg_in_the_project(self):
        data = screens()["screens"]
        self.assertGreaterEqual(len(data), 15)
        for screen_id, screen in data.items():
            path = ROOT / "public" / screen["src"].lstrip("/")
            with self.subTest(screen=screen_id):
                self.assertTrue(path.is_file())
                self.assertEqual(path.suffix, ".jpg")
                self.assertLessEqual(path.stat().st_size, MAX_BYTES)
                self.assertLessEqual(jpeg_width(path), MAX_WIDTH)
        files = sorted(p.name for p in SCREENS_DIR.iterdir())
        self.assertEqual(files, sorted(Path(s["src"]).name for s in data.values()))

    def test_every_screen_has_a_pending_manufacturer_row_in_the_license_log(self):
        rows = [line for line in LOG.read_text(encoding="utf-8").splitlines() if line.startswith("| `")]
        for screen_id, screen in screens()["screens"].items():
            matches = [row for row in rows if f"`public{screen['src']}`" in row]
            with self.subTest(screen=screen_id):
                self.assertTrue(matches, "missing row")
                self.assertIn("Manufacturer image", matches[0])
                self.assertIn("Rights-holder permission not established", matches[0])
                self.assertIn("Pending", matches[0])

    def test_mappings_point_at_existing_screens_and_real_feature_titles(self):
        data = screens()
        ids = set(data["screens"])
        titles = {item["title"] for slug in ("rebar", "parametric") for group in page_content(slug)["featureGroups"] for item in group["items"]}
        for title, screen_id in data["featureScreens"].items():
            with self.subTest(title=title):
                self.assertIn(title, titles)
                self.assertIn(screen_id, ids)
        editions = node_exports("src/data/allplan-2027-editions.ts", ["editions"])["editions"]
        labels = {feature["label"] for edition in editions for feature in edition["features"]}
        self.assertEqual(set(data["editionScreens"]), labels)
        for label, screen_id in data["editionScreens"].items():
            self.assertIn(screen_id, ids, label)


class ScreenComponentTests(unittest.TestCase):
    def test_feature_text_and_screenshot_share_one_card_and_news_pages_use_the_media_grid(self):
        view = (ROOT / "src/components/sections/ProductEditionView.tsx").read_text(encoding="utf-8")
        self.assertIn("MediaGridWithViewer", view)
        self.assertIn("productFeatureGroups", view)
        self.assertNotIn("Ekran görüntüleri", view)
        self.assertNotIn("productScreenItems", view)
        news = (ROOT / "src/components/sections/AllplanEditionNewsView.tsx").read_text(encoding="utf-8")
        self.assertIn("MediaGridWithViewer", news)
        self.assertNotIn("EditionCards", news)


class ScreenRenderTests(unittest.TestCase):
    def test_built_pages_show_their_screens(self):
        if rebar_and_parametric_are_held():
            self.skipTest("Rebar and Parametric are held until ALLPLAN publishes them")
        if not (BUILT / "products/allplan-rebar.html").is_file():
            self.skipTest("build output missing")
        data = screens()
        for slug in ("rebar", "parametric"):
            html = (BUILT / f"products/allplan-{slug}.html").read_text(encoding="utf-8")
            titles = {item["title"] for group in page_content(slug)["featureGroups"] for item in group["items"]}
            expected = {title: data["screens"][sid]["src"] for title, sid in data["featureScreens"].items() if title in titles}
            self.assertGreaterEqual(len(expected), 8)
            self.assertNotIn("Ekran görüntüleri", html)
            cards = html.split("<article")
            features = {item["title"]: item["text"] for group in page_content(slug)["featureGroups"] for item in group["items"]}
            for title, src in expected.items():
                card = next(c for c in cards if f'alu-media-card__title">{title.replace("&", "&amp;").replace(chr(39), "&#x27;")}<' in c)
                with self.subTest(page=slug, feature=title):
                    self.assertIn(src, card)
                    self.assertIn(features[title].replace("&", "&amp;").replace("'", "&#x27;"), card)
        editions = node_exports("src/data/allplan-2027-editions.ts", ["editions"])["editions"]
        for edition in editions:
            html = (BUILT / f"2027/allplan-{edition['slug']}.html").read_text(encoding="utf-8")
            for feature in edition["features"]:
                src = data["screens"][data["editionScreens"][feature["label"]]]["src"]
                with self.subTest(page=edition["slug"], src=src):
                    self.assertIn(src, html)


if __name__ == "__main__":
    unittest.main()
