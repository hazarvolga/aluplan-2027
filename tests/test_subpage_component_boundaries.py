"""Architectural contracts for progressively splitting the large subpage renderer."""

from pathlib import Path
import json
import re
import unittest


ROOT = Path(__file__).resolve().parents[1]


def read(relative: str) -> str:
    return (ROOT / relative).read_text(encoding="utf-8")


class SubpageComponentBoundaryTests(unittest.TestCase):
    def test_video_library_hub_has_a_dedicated_render_boundary(self):
        component = read("src/components/sections/VideoLibraryHubSection.tsx")
        parent = read("src/components/sections/SubpageView.tsx")

        self.assertNotIn("'use client'", component)
        self.assertIn("import { getAllPlaylists }", component)
        for marker in [
            "const VIDEO_LIBRARY_ITEMS",
            "const playlistByUrl",
            "VIDEO_LIBRARY_ITEMS.map",
            "alu-yt-banner",
            "alu-yt-grid",
            "alu-yt-card--internal",
            "matchedPlaylist.count",
            "Allplan Türkiye YouTube Kanalına Abone Olun",
            'target={isExternal ? \'_blank\' : undefined}',
            "rel={isExternal ? 'noopener noreferrer' : undefined}",
        ]:
            with self.subTest(marker=marker):
                self.assertIn(marker, component)

        self.assertIn("import { VideoLibraryHubSection } from './VideoLibraryHubSection';", parent)
        self.assertIn("isVideoLibraryHub && <VideoLibraryHubSection />", parent)
        self.assertNotIn("VIDEO_LIBRARY_ITEMS", parent)
        self.assertNotIn("playlistByUrl", parent)
        self.assertNotIn("alu-yt-banner", parent)
        self.assertNotIn("alu-yt-grid", parent)

    def test_video_library_hub_preserves_all_22_source_targets(self):
        component = read("src/components/sections/VideoLibraryHubSection.tsx")
        items_source = component.split("const VIDEO_LIBRARY_ITEMS", 1)[1].split("];", 1)[0]
        pairs = re.findall(
            r"\{\s+title: '([^']+)',\s+description: '.*?',\s+url: '([^']*)'\s+\}",
            items_source,
            flags=re.DOTALL,
        )
        expected_pairs = [
            ("Allplan 2026", "https://youtube.com/playlist?list=PLowC-ZFUywGMotfHSyzqoNZCQYWl_6G1x&si=BSEJvgjsQWgbIwVe"),
            ("Youtube Allplan English", "https://www.youtube.com/@ALLPLANEnglish"),
            ("Youtube Allplan Global", "https://www.youtube.com/@ALLPLANglobal"),
            ("Youtube Allplan Precast", "https://www.youtube.com/c/AllplanPrecast"),
            ("Allplan ile Tanışın: Tüm Disiplinler İçin Temel Eğitim Videoları", "/solutions-v2/training/video-library/hello-allplan-2024"),
            ("Allplan Add On Geometry Tools", "/solutions-v2/training/video-library/addon-geometry"),
            ("AX3000 - MEP & Enerji", "/solutions-v2/training/video-library/ax3000"),
            ("Youtube CDS Allplan Add-On", "#"),
            ("Allplan Road Design Workflow", "/solutions-v2/training/video-library/road-design"),
            ("Allplan Bridge Workflows", "/solutions-v2/training/video-library/bridge-workflows"),
            ("Campus Tutorials (Deutsch)", "/solutions-v2/training/video-library/campus-de"),
            ("Campus Tutorials (English)", "/solutions-v2/training/video-library/campus-en"),
            ("Allplan Bridge", "#"),
            ("Allplan Bridge Tutorials", "#"),
            ("SDS2 Detaylandırma", "/solutions-v2/training/video-library/sds2-intro"),
            ("Konut İnşaatı İş Akışları", "/solutions-v2/training/video-library/konut-insaati"),
            ("Bridge Workflow 2022", "/solutions-v2/training/video-library/bridge-workflow-2022"),
            ("Otomatik Donatı (PythonPart)", "/solutions-v2/training/video-library/otomatik-donati"),
            ("ALLPLAN QuickStart: Buildings", "/solutions-v2/training/video-library/quickstart-buildings"),
            ("ALLPLAN for Reinforcement", "/solutions-v2/training/video-library/allplan-reinforcement"),
            ("Allplan Campus Tutorials 2019-2022", "/solutions-v2/training/video-library/campus-tutorials-2019-2022"),
            ("ALLPLAN Pythonparts Youtube Kanalı", "#"),
        ]

        self.assertEqual(pairs, expected_pairs)

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

    def test_split_callouts_have_a_shared_interactive_render_boundary(self):
        component = read("src/components/sections/SplitCalloutSection.tsx")
        parent = read("src/components/sections/SubpageView.tsx")

        self.assertTrue(component.startswith("'use client';"))
        self.assertIn("import type { StructuredSplitCallout }", component)
        for marker in [
            "callouts.map",
            "itemKeyPrefix",
            "callout.reverse ?? index % 2 === 1",
            "https://img.youtube.com/vi/",
            "callout.videoSrc",
            "poster={callout.imageSrc || undefined}",
            "muted",
            "playsInline",
            'preload="metadata"',
            "role={hasVideo || thumbSrc ? 'button' : undefined}",
            "event.key === 'Enter' || event.key === ' '",
            "event.preventDefault()",
            "youtubeId: callout.youtubeId",
            "videoSrc: callout.videoSrc",
            "src: thumbSrc",
            "callout.paragraphs && callout.paragraphs.length > 0",
            "callout.description",
            "bullet.replace(/^•\\s*/, '')",
            "POPUP VİDEO",
            "target={callout.external ? '_blank' : undefined}",
            "rel={callout.external ? 'noopener noreferrer' : undefined}",
        ]:
            with self.subTest(marker=marker):
                self.assertIn(marker, component)

        self.assertIn("import { SplitCalloutSection } from './SplitCalloutSection';", parent)
        self.assertIn('itemKeyPrefix="callout-top"', parent)
        self.assertIn('itemKeyPrefix="callout-bottom"', parent)
        self.assertIn("callout.title !== 'Lisans ve Gereksinimler'", parent)
        self.assertIn("callout.title === 'Lisans ve Gereksinimler'", parent)
        self.assertNotIn("alu-scia-callout", parent)
        self.assertNotIn("callout.youtubeId", parent)
        self.assertNotIn("callout.videoSrc", parent)

    def test_structured_split_callout_data_is_complete_and_assets_exist(self):
        pages = json.loads(read("src/data/pages.json"))
        callout_routes = set()
        totals = {
            "all": 0,
            "primary": 0,
            "bottom": 0,
            "youtube": 0,
            "mp4": 0,
            "image": 0,
        }

        for route, page in pages.items():
            callouts = (page.get("structuredLayout") or {}).get("splitCallouts") or []
            if callouts:
                callout_routes.add(route)

            for callout in callouts:
                totals["all"] += 1
                self.assertTrue(callout.get("title"), route)
                is_bottom = (
                    callout["title"] == "Lisans ve Gereksinimler"
                    or "SCIA Engineer" in callout["title"]
                )
                totals["bottom" if is_bottom else "primary"] += 1
                totals["youtube"] += bool(callout.get("youtubeId"))
                totals["mp4"] += bool(callout.get("videoSrc"))
                totals["image"] += bool(callout.get("imageSrc"))

                for field in ["imageSrc", "videoSrc"]:
                    media_path = callout.get(field)
                    if media_path and media_path.startswith("/"):
                        self.assertTrue(
                            (ROOT / "public" / media_path.lstrip("/")).is_file(),
                            media_path,
                        )

        self.assertEqual(len(callout_routes), 22)
        self.assertEqual(
            totals,
            {"all": 62, "primary": 52, "bottom": 10, "youtube": 27, "mp4": 5, "image": 30},
        )


if __name__ == "__main__":
    unittest.main()
