"""Architectural contracts for progressively splitting the large subpage renderer."""

from pathlib import Path
import json
import unittest


ROOT = Path(__file__).resolve().parents[1]


def read(relative: str) -> str:
    return (ROOT / relative).read_text(encoding="utf-8")


class SubpageComponentBoundaryTests(unittest.TestCase):
    def test_about_editorial_has_a_dedicated_render_boundary(self):
        component = read("src/components/sections/AboutEditorialSection.tsx")
        parent = read("src/components/sections/SubpageView.tsx")

        self.assertIn("import type { PageRecord }", component)
        self.assertNotIn("'use client'", component)
        for marker in [
            "alu-about-editorial",
            "Kurumsal Göstergeler",
            "Hikayemiz",
            "Değerlerimiz",
            "Ofisimiz",
            "29+",
            "500+",
            "50+",
            "10K+",
            'href="/contact"',
            'href="/references"',
            "mapEmbed.src",
            'loading="lazy"',
            'referrerPolicy="no-referrer-when-downgrade"',
        ]:
            with self.subTest(marker=marker):
                self.assertIn(marker, component)

        self.assertIn("import { AboutEditorialSection } from './AboutEditorialSection';", parent)
        self.assertIn("page.path === '/about' && <AboutEditorialSection page={page} />", parent)
        self.assertNotIn("alu-about-editorial", parent)

    def test_structured_benefits_have_a_dedicated_render_boundary(self):
        component = read("src/components/sections/BenefitsSection.tsx")
        parent = read("src/components/sections/SubpageView.tsx")

        self.assertIn("import type { StructuredPageLayout }", component)
        self.assertNotIn("'use client'", component)
        for marker in [
            "alu-section-header-center",
            "alu-benefits-grid",
            "alu-benefits-grid--cols-4",
            "alu-benefits-grid--cols-3",
            "benefits.kicker",
            "benefits.title",
            "benefits.items.map",
            "benefit.subtitle",
            "benefit.iconSrc",
            "benefit.description",
            'loading="lazy"',
        ]:
            with self.subTest(marker=marker):
                self.assertIn(marker, component)

        self.assertIn("import { BenefitsSection } from './BenefitsSection';", parent)
        self.assertIn("<BenefitsSection benefits={sl.benefits} />", parent)
        self.assertNotIn("alu-benefits-grid", parent)
        self.assertNotIn("alu-benefit-card", parent)

    def test_structured_benefit_data_is_complete_and_local_icons_exist(self):
        pages = json.loads(read("src/data/pages.json"))
        benefit_routes = []

        for route, page in pages.items():
            benefits = (page.get("structuredLayout") or {}).get("benefits")
            if not benefits:
                continue

            benefit_routes.append(route)
            self.assertTrue(benefits.get("title"), route)
            self.assertTrue(benefits.get("items"), route)
            for item in benefits["items"]:
                self.assertTrue(item.get("title"), route)
                self.assertTrue(item.get("description"), route)
                icon_src = item.get("iconSrc")
                if icon_src and icon_src.startswith("/"):
                    self.assertTrue((ROOT / "public" / icon_src.lstrip("/")).is_file(), icon_src)

        self.assertEqual(len(benefit_routes), 28)

    def test_media_grids_have_a_dedicated_interactive_render_boundary(self):
        component = read("src/components/sections/MediaGridSection.tsx")
        parent = read("src/components/sections/SubpageView.tsx")

        self.assertTrue(component.startswith("'use client';"))
        self.assertIn("import type { StructuredMediaGridSection }", component)
        for marker in [
            "grid.columns || 3",
            "grid.items.map",
            "itemKeyPrefix",
            "onVideo",
            "onImage",
            "https://img.youtube.com/vi/",
            'role="button"',
            "tabIndex={0}",
            "event.key === 'Enter' || event.key === ' '",
            "event.preventDefault()",
            "youtubeId: item.youtubeId",
            "src: resolvedThumbSrc",
            'loading="lazy"',
            "b.replace(/^•\\s*/, '')",
            'target="_blank"',
            'rel="noopener noreferrer"',
        ]:
            with self.subTest(marker=marker):
                self.assertIn(marker, component)

        self.assertIn("import { MediaGridSection } from './MediaGridSection';", parent)
        self.assertIn('itemKeyPrefix="core-features"', parent)
        self.assertIn("key={`extra-grid-${gridIndex}`}", parent)
        self.assertIn("itemKeyPrefix={`extra-grid-${gridIndex}`}", parent)
        self.assertNotIn("renderMediaGrid", parent)
        self.assertNotIn("alu-media-grid", parent)
        self.assertNotIn("StructuredMediaGridSection", parent)

    def test_structured_media_grid_data_is_complete_and_assets_exist(self):
        pages = json.loads(read("src/data/pages.json"))
        media_routes = set()
        core_grid_count = 0
        extra_grid_count = 0
        card_count = 0

        for route, page in pages.items():
            structured = page.get("structuredLayout") or {}
            grids = []
            core_grid = structured.get("coreFeatures")
            if core_grid and core_grid.get("items"):
                core_grid_count += 1
                grids.append(core_grid)
            for extra_grid in structured.get("extraGrids") or []:
                if extra_grid.get("items"):
                    extra_grid_count += 1
                    grids.append(extra_grid)

            if grids:
                media_routes.add(route)
            for grid in grids:
                self.assertTrue(grid.get("title"), route)
                self.assertTrue(grid.get("items"), route)
                for item in grid["items"]:
                    card_count += 1
                    self.assertTrue(item.get("title"), route)
                    self.assertTrue(item.get("description"), route)
                    image_src = item.get("imageSrc")
                    if image_src and image_src.startswith("/"):
                        self.assertTrue((ROOT / "public" / image_src.lstrip("/")).is_file(), image_src)

        self.assertEqual(len(media_routes), 29)
        self.assertEqual(core_grid_count, 8)
        self.assertEqual(extra_grid_count, 46)
        self.assertEqual(card_count, 362)


if __name__ == "__main__":
    unittest.main()
