"""2027 release routes carry their own indexable metadata, JSON-LD and sitemap entries."""

from pathlib import Path
import json
import subprocess
import unittest


ROOT = Path(__file__).resolve().parents[1]
ORIGIN = "https://aluplan.com.tr"
SITE_DESCRIPTION_PREFIX = "1995'ten beri Türkiye'nin güvenilir ALLPLAN distribütörü"
RELEASE_PATHS = ["/2027/features", "/2027/max", "/2027/civil", "/2027/frilo", "/2027/scia", "/paket-karsilastirma", "/product-lifecycle"]
PRODUCT_NAMES = {
    "/2027/features": "ALLPLAN 2027",
    "/2027/max": "Allplan Max",
    "/2027/civil": "ALLPLAN Civil",
    "/2027/frilo": "FRILO",
    "/2027/scia": "SCIA",
}


def run_runtime() -> dict:
    result = subprocess.run(
        ["node", "tests/release_routes_runtime.mjs"], cwd=ROOT, check=True, capture_output=True, text=True
    )
    return json.loads(result.stdout)


def graph_types(json_ld: dict) -> dict:
    return {entity["@type"]: entity for entity in json_ld["@graph"]}


class ReleaseRouteSourceTests(unittest.TestCase):
    def test_no_preview_labels(self):
        sources = [
            *(ROOT / "src/app/2027").rglob("page.tsx"),
            ROOT / "src/app/product-lifecycle/page.tsx",
            ROOT / "src/lib/release-2027-routes.ts",
        ]
        offenders = [
            str(p.relative_to(ROOT))
            for p in sources
            if "Yerel inceleme" in p.read_text(encoding="utf-8") or "Yerel Önizleme" in p.read_text(encoding="utf-8")
        ]
        self.assertEqual(offenders, [])

    def test_pages_use_release_metadata_and_escaped_json_ld(self):
        for route in RELEASE_PATHS:
            source = (ROOT / f"src/app{route}/page.tsx").read_text(encoding="utf-8")
            with self.subTest(route=route):
                self.assertIn(f"buildRelease2027Metadata('{route}')", source)
                self.assertIn(f"serializeJsonLd(buildRelease2027JsonLd('{route}'))", source)

    def test_product_lifecycle_moved_out_of_preview(self):
        self.assertFalse((ROOT / "src/app/preview/product-lifecycle").exists())
        home = (ROOT / "src/components/sections/Homepage2027PreviewView.tsx").read_text(encoding="utf-8")
        self.assertIn('href="/product-lifecycle"', home)
        self.assertNotIn("/preview/product-lifecycle\"", home)
        config = (ROOT / "next.config.mjs").read_text(encoding="utf-8")
        self.assertRegex(
            config,
            r"source: '/preview/product-lifecycle',\s*destination: '/product-lifecycle',\s*permanent: true",
        )

    def test_compare_has_no_internal_review_note(self):
        source = (ROOT / "src/app/paket-karsilastirma/page.tsx").read_text(encoding="utf-8")
        self.assertNotIn("Bu yerel inceleme, uluslararası üretici sayfasına dayanır.", source)
        self.assertNotIn("Türkiye paket kapsamı ve koşulları doğrulanmalıdır.", source)
        self.assertIn("Sürüm bağlantıları mevcut yerel ürün sayfalarına gider.", source)

    def test_llms_txt_lists_release_routes_from_registry(self):
        source = (ROOT / "src/app/llms.txt/route.ts").read_text(encoding="utf-8")
        self.assertIn("RELEASE_2027_ROUTES", source)
        self.assertIn("isReleaseContentEnabled()", source)

    def test_existing_json_ld_call_sites_escape(self):
        for path in ("src/app/page.tsx", "src/app/[...slug]/page.tsx"):
            source = (ROOT / path).read_text(encoding="utf-8")
            with self.subTest(path=path):
                self.assertNotIn("JSON.stringify(jsonLd)", source)
                self.assertIn("serializeJsonLd(jsonLd)", source)


class ReleaseRouteRuntimeTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.data = run_runtime()

    def test_metadata_shape(self):
        for route in RELEASE_PATHS:
            metadata = self.data["live"]["metadata"][route]
            with self.subTest(route=route):
                self.assertEqual(metadata["alternates"]["canonical"], ORIGIN + route)
                self.assertTrue(metadata["title"].endswith(" | Aluplan"))
                self.assertFalse(metadata["description"].startswith(SITE_DESCRIPTION_PREFIX))
                self.assertEqual(metadata["robots"], {"index": True, "follow": True})
                self.assertTrue(metadata["openGraph"]["images"][0]["url"].startswith(ORIGIN + "/"))

    def test_review_environment_blocks_indexing(self):
        self.assertEqual(self.data["review"]["robots"], {"index": False, "follow": False})

    def test_descriptions_are_unique(self):
        descriptions = [self.data["live"]["metadata"][r]["description"] for r in RELEASE_PATHS]
        self.assertEqual(len(set(descriptions)), len(descriptions))

    def test_jsonld_product_name(self):
        for route, name in PRODUCT_NAMES.items():
            with self.subTest(route=route):
                self.assertEqual(graph_types(self.data["live"]["jsonLd"][route])["SoftwareApplication"]["name"], name)

    def test_compare_jsonld_has_no_software_application(self):
        for route in ("/paket-karsilastirma", "/product-lifecycle"):
            with self.subTest(route=route):
                self.assertNotIn("SoftwareApplication", graph_types(self.data["live"]["jsonLd"][route]))

    def test_jsonld_breadcrumb_ends_at_route(self):
        for route in RELEASE_PATHS:
            crumbs = graph_types(self.data["live"]["jsonLd"][route])["BreadcrumbList"]["itemListElement"]
            with self.subTest(route=route):
                self.assertEqual(crumbs[0]["item"], ORIGIN)
                self.assertEqual(crumbs[-1]["item"], ORIGIN + route)

    def test_sitemap_includes_release_routes(self):
        for route in RELEASE_PATHS:
            self.assertIn(ORIGIN + route, self.data["live"]["sitemap"])

    def test_sitemap_omits_release_routes_on_rollback(self):
        self.assertFalse([url for url in self.data["rollback"]["sitemap"] if "/2027/" in url])

    def test_jsonld_escaped(self):
        self.assertNotIn("<", self.data["escaped"])
        self.assertEqual(json.loads(self.data["escaped"]), {"value": "</script><script>"})


if __name__ == "__main__":
    unittest.main()
