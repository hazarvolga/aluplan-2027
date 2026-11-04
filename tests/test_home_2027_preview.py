from pathlib import Path
import json
import unittest


ROOT = Path(__file__).resolve().parents[1]
PREVIEW_PAGE = ROOT / "src/app/preview/home-2027/page.tsx"
PREVIEW_VIEW = ROOT / "src/components/sections/Homepage2027PreviewView.tsx"


class Home2027PreviewContractTests(unittest.TestCase):
    def test_release_homepage_heading_does_not_show_cloud_services_link(self):
        data = json.loads((ROOT / 'src/data/homepage.json').read_text(encoding='utf-8'))
        self.assertIn(['ALLPLAN CLOUD Hizmetleri', '/products/allplan-cloud-services'], data['quickLinks'])
        home = (ROOT / 'src/components/sections/HomepageView.tsx').read_text(encoding='utf-8')
        self.assertNotIn('cloudLink', home)
        self.assertIn('<HomepageProductHeading />', home)

    def test_preview_route_reuses_the_current_homepage_without_copying_content(self):
        self.assertTrue(PREVIEW_PAGE.is_file(), "2027 homepage preview route is missing")
        self.assertTrue(PREVIEW_VIEW.is_file(), "2027 homepage preview view is missing")
        route_source = PREVIEW_PAGE.read_text(encoding="utf-8")
        view_source = PREVIEW_VIEW.read_text(encoding="utf-8")

        self.assertIn("import { Homepage2027PreviewView }", route_source)
        self.assertIn("<Homepage2027PreviewView />", route_source)
        self.assertNotIn("HomepageView", route_source)
        self.assertIn("import { HomepageView }", view_source)
        self.assertIn("<HomepageView previewMaxHero />", view_source)
        self.assertNotIn("getHomepageData", route_source + view_source)
        self.assertNotIn("buildPageJsonLd", route_source + view_source)

    def test_preview_route_is_explicitly_non_indexable(self):
        self.assertTrue(PREVIEW_PAGE.is_file(), "2027 homepage preview route is missing")
        source = PREVIEW_PAGE.read_text(encoding="utf-8")

        self.assertIn("robots:", source)
        self.assertIn("index: false", source)
        self.assertIn("follow: false", source)
        self.assertIn("nocache: true", source)
        self.assertIn("!isLocalPreviewEnabled()", source)
        self.assertIn("notFound()", source)

    def test_preview_route_is_not_published_in_sitemap_or_navigation(self):
        sitemap = (ROOT / "src/app/sitemap.ts").read_text(encoding="utf-8")
        navigation = (ROOT / "src/data/navigation.json").read_text(encoding="utf-8")
        pages = (ROOT / "src/data/pages.json").read_text(encoding="utf-8")

        self.assertNotIn("/preview/home-2027", sitemap)
        self.assertNotIn("/preview/home-2027", navigation)
        self.assertNotIn("/preview/home-2027", pages)

    def test_primary_homepage_contract_remains_the_public_authority(self):
        source = (ROOT / "src/app/page.tsx").read_text(encoding="utf-8")

        self.assertIn("buildPageMetadata('/')", source)
        self.assertIn("buildPageJsonLd(page)", source)
        self.assertIn("<HomepageView />", source)


if __name__ == "__main__":
    unittest.main()
