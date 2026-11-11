"""Home page product slides carry the Allplan 2027 slide headline and body from the inventory drafts."""

from pathlib import Path
import json
import sys
import unittest


ROOT = Path(__file__).resolve().parents[1]
HEADLINES = {
    "ALLPLAN": "allplan.home.hero.title",
    "ALLPLAN Max": "max.slide.headline",
    "ALLPLAN Civil": "civil.slide.hero.title",
    "SDS2": "sds2.home.title",
}


def inventory() -> dict[str, str]:
    sys.path.insert(0, str(ROOT / "scripts"))
    from inventory_units import MODULES

    return {unit.id: unit.tr for module in MODULES for unit in module.UNITS}


class HomeSlideTests(unittest.TestCase):
    def setUp(self):
        data = json.loads((ROOT / "src/data/homepage-2027-preview.json").read_text(encoding="utf-8"))
        self.links = {link["name"]: link for link in data["productLinks"]}
        self.tr = inventory()

    def test_slide_headlines_come_from_the_inventory_drafts(self):
        for name, source_id in HEADLINES.items():
            with self.subTest(product=name):
                self.assertEqual(self.links[name]["headline"], self.tr[source_id])
                self.assertEqual(self.links[name]["headlineSourceId"], source_id)

    def test_slide_bodies_stay_identical_to_the_inventory_drafts(self):
        for name, link in self.links.items():
            if link["sourceId"] in self.tr:
                with self.subTest(product=name):
                    self.assertEqual(link["detail"], self.tr[link["sourceId"]])

    def test_products_without_a_slide_keep_the_product_name_as_heading(self):
        for name in ("FRILO", "SCIA"):
            self.assertNotIn("headline", self.links[name])

    def test_panel_uses_the_slide_headline_when_present(self):
        source = (ROOT / "src/components/sections/ProductTabs.tsx").read_text(encoding="utf-8")
        self.assertIn("product.headline ?? product.name", source)

    def test_scia_concept_visual_exists_and_is_used(self):
        source = (ROOT / "src/components/sections/HomepageProductPreviewTabs.tsx").read_text(encoding="utf-8")
        self.assertIn("SCIA: '/assets/previews/home-2027/scia-analysis-concept.jpg'", source)
        image = ROOT / "public/assets/previews/home-2027/scia-analysis-concept.jpg"
        self.assertTrue(image.is_file())
        self.assertLess(image.stat().st_size, 450_000)

    def test_homepage_hero_points_to_existing_solutions_section(self):
        hero = (ROOT / 'src/components/sections/HomepageMaxPreviewHero.tsx').read_text(encoding='utf-8')
        page = (ROOT / 'src/components/sections/HomepageView.tsx').read_text(encoding='utf-8')
        self.assertIn('<h1 id="hero-title"', hero)
        self.assertIn('Mühendislik yeniden tanımlanıyor', hero)
        self.assertIn('href="#solutions"', hero)
        self.assertIn('href="#products"', hero)
        self.assertIn('Ürünleri keşfedin', hero)
        self.assertIn('Çözümleri keşfedin', hero)
        self.assertIn('id="solutions"', page)
        self.assertIn('DisciplineWorkflowSection id="products"', page)
        self.assertIn('MAIN_QUOTE_FORM_URL', hero)

    def test_hero_motion_is_decorative_and_respects_motion_preference(self):
        hero = (ROOT / 'src/components/sections/HomepageMaxPreviewHero.tsx').read_text()
        css_path = ROOT / 'src/components/sections/HomepageMaxPreviewHero.module.css'
        self.assertTrue(css_path.exists())
        css = css_path.read_text()
        self.assertIn('styles.imageMotion', hero)
        self.assertIn('<HeroBottomLine />', hero)
        self.assertIn('prefers-reduced-motion: no-preference', css)
        self.assertIn('min-width: 768px', css)
        self.assertNotIn('styles.imageMotion} alu-h2', hero)

    def test_home_hero_uses_optimized_image_with_original_fallback(self):
        hero = (ROOT / 'src/components/sections/HomepageMaxPreviewHero.tsx').read_text()
        optimized = ROOT / 'public/assets/previews/home-2027/allplan-max-ai-concept-q75.webp'
        previous = ROOT / 'public/assets/previews/home-2027/allplan-max-ai-concept.webp'
        original = ROOT / 'public/assets/previews/home-2027/allplan-max-ai-concept.jpg'
        self.assertTrue(optimized.exists())
        self.assertLess(optimized.stat().st_size, original.stat().st_size)
        self.assertLess(optimized.stat().st_size, previous.stat().st_size * 0.8)
        self.assertIn('type="image/webp"', hero)
        self.assertIn('/assets/previews/home-2027/allplan-max-ai-concept-q75.webp', hero)
        self.assertIn('/assets/previews/home-2027/allplan-max-ai-concept.jpg', hero)
        self.assertIn('fetchPriority="high"', hero)

    def test_below_fold_homepage_images_defer_loading(self):
        tabs = (ROOT / 'src/components/sections/ProductTabs.tsx').read_text()
        workflow = (ROOT / 'src/components/sections/DisciplineWorkflowSection.tsx').read_text()
        home = (ROOT / 'src/components/sections/HomepageView.tsx').read_text()
        self.assertRegex(tabs, r'<img[^>]*src=\{product\.image\}[^>]*loading="lazy"')
        self.assertRegex(workflow, r'<img[^>]*workflowImage\(activeRole\.image\)[^>]*loading="lazy"')
        self.assertRegex(home, r'homepageImage\(data\.bimflex\.logo\.src\)[^>]*loading="lazy"')
        self.assertRegex(home, r'homepageImage\(data\.bimflex\.logo\.src\)[^>]*width=\{512\}[^>]*height=\{512\}')

    def test_home_product_image_uses_smaller_webp(self):
        tabs = (ROOT / 'src/components/sections/HomepageProductPreviewTabs.tsx').read_text()
        optimized = ROOT / 'public/assets/previews/home-2027/allplan-max-generated-v2-q80.webp'
        original = ROOT / 'public/assets/previews/home-2027/allplan-max-generated-v2.jpg'
        self.assertTrue(optimized.exists())
        self.assertLess(optimized.stat().st_size, original.stat().st_size * 0.4)
        self.assertIn('/assets/previews/home-2027/allplan-max-generated-v2-q80.webp', tabs)

    def test_homepage_section_scroll_respects_motion_preferences(self):
        css = (ROOT / 'src/components/sections/HomepageSectionIntro.module.css').read_text(encoding='utf-8')
        self.assertIn('prefers-reduced-motion:no-preference', css)
        self.assertIn('scroll-behavior:smooth', css)
        self.assertIn('prefers-reduced-motion:reduce', css)
        self.assertIn('scroll-behavior:auto', css)
        self.assertIn(':global(#products)', css)
        self.assertIn('scroll-margin-top:8rem', css)

    def test_product_heading_precedes_tabs_and_2026_band_is_removed(self):
        page = (ROOT / 'src/components/sections/HomepageView.tsx').read_text(encoding='utf-8')
        heading = (ROOT / 'src/components/sections/HomepageProductHeading.tsx').read_text(encoding='utf-8')
        self.assertIn('Her iş akışı için doğru araç', heading)
        self.assertIn('2027', heading)
        self.assertIn('aria-hidden="true"', heading)
        self.assertIn('<h2', heading)
        self.assertNotIn('GroupHeader', heading)
        self.assertLess(page.index('<HomepageProductHeading'), page.index('<HomepageProductPreviewTabs'))
        self.assertNotIn('<Homepage2026Links', page)
        self.assertIn('/products/allplan-2026', (ROOT / 'src/data/pages.json').read_text(encoding='utf-8'))


    def test_bimflex_logo_sits_right_of_the_badges(self):
        home = (ROOT / "src/components/sections/HomepageView.tsx").read_text(encoding="utf-8")
        self.assertIn('className="preview-bimflex__head"', home)
        css = (ROOT / "src/styles/application.css").read_text(encoding="utf-8")
        self.assertIn(".preview-bimflex__head{display:flex;align-items:center;justify-content:space-between", css)


if __name__ == "__main__":
    unittest.main()
