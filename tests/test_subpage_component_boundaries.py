"""Architectural contracts for progressively splitting the large subpage renderer."""

from pathlib import Path
import json
import re
import unittest


ROOT = Path(__file__).resolve().parents[1]


def read(relative: str) -> str:
    return (ROOT / relative).read_text(encoding="utf-8")


class SubpageComponentBoundaryTests(unittest.TestCase):
    def test_page_end_conversion_has_one_shared_render_boundary(self):
        parent = read("src/components/sections/SubpageView.tsx")
        structured = read("src/components/sections/StructuredPageLayoutSection.tsx")

        self.assertIn(
            "import { PageEndConversion } from './PageEndConversion';",
            parent,
        )
        self.assertIn(
            "import { getPageEndConversion } from './page-end-conversion-policy';",
            parent,
        )
        self.assertIn("const pageEndConversion = getPageEndConversion(page)", parent)
        self.assertIn(
            "{pageEndConversion && <PageEndConversion model={pageEndConversion} />}",
            parent,
        )
        self.assertEqual(parent.count("<PageEndConversion "), 1)

        removed_markers = [
            "global-trial-heading",
            "training-request-heading",
            "page.contentLinks.map",
            "İLGİLİ BAĞLANTILAR, MODÜLLER VE DOKÜMANLAR",
            "Bu Sayfayla İlgili Hızlı Geçişler ve İndirmeler",
        ]
        for marker in removed_markers:
            with self.subTest(file="SubpageView.tsx", marker=marker):
                self.assertNotIn(marker, parent)
            with self.subTest(file="StructuredPageLayoutSection.tsx", marker=marker):
                self.assertNotIn(marker, structured)

        self.assertNotIn("ContentLink", structured)
        self.assertNotIn("contentLinks:", structured)
        self.assertNotIn("contentLinks={page.contentLinks}", parent)
    def test_video_library_hub_has_a_dedicated_render_boundary(self):
        component = read("src/components/sections/VideoLibraryHubSection.tsx")
        parent = read("src/components/sections/SubpageView.tsx")

        self.assertNotIn("'use client'", component)
        self.assertIn("import { getAllPlaylists, getVideoLibraryData }", component)
        for marker in [
            "const videoLibrary = getVideoLibraryData()",
            "const playlistByUrl",
            "videoLibrary.items.map",
            "alu-yt-banner",
            "alu-yt-grid",
            "alu-yt-card--internal",
            "matchedPlaylist.count",
            "videoLibrary.subscribe.title",
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
        catalog = json.loads(read("src/data/video-library.json"))
        pairs = [(item["title"], item["url"]) for item in catalog["items"]]
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

    def test_references_directory_has_a_dedicated_interactive_render_boundary(self):
        component = read("src/components/sections/ReferencesDirectorySection.tsx")
        parent = read("src/components/sections/SubpageView.tsx")
        layout_component = read("src/components/sections/StructuredPageLayoutSection.tsx")

        self.assertTrue(component.startswith("'use client';"))
        self.assertIn("import type { StructuredReferencesDirectory }", component)
        for marker in [
            "activeCategoryId: string",
            "searchQuery: string",
            "onCategoryChange: (categoryId: string) => void",
            "onSearchQueryChange: (query: string) => void",
            "const q = searchQuery.trim().toLowerCase()",
            "item.name.toLowerCase().includes(q)",
            "item.category.toLowerCase().includes(q)",
            "matchesCategory && matchesSearch",
            'role="tablist"',
            'role="tab"',
            "aria-selected={isActive}",
            'role="tabpanel"',
            "onSearchQueryChange('')",
            "onCategoryChange('all')",
            "Tüm Referansları Göster",
            "DirectoryCategoryIcon",
        ]:
            with self.subTest(marker=marker):
                self.assertIn(marker, component)

        self.assertIn("import { ReferencesDirectorySection } from './ReferencesDirectorySection';", layout_component)
        self.assertIn("directory={layout.referencesDirectory}", layout_component)
        self.assertIn("activeCategoryId={activeReferenceCategoryId}", layout_component)
        self.assertIn("searchQuery={referenceSearchQuery}", layout_component)
        self.assertIn("onCategoryChange={onReferenceCategoryChange}", layout_component)
        self.assertIn("onSearchQueryChange={onReferenceSearchQueryChange}", layout_component)
        self.assertIn("activeReferenceCategoryId={activeRefCatId}", parent)
        self.assertIn("referenceSearchQuery={refSearchQuery}", parent)
        self.assertIn("onReferenceCategoryChange={setActiveRefCatId}", parent)
        self.assertIn("onReferenceSearchQueryChange={setRefSearchQuery}", parent)
        self.assertIn("useState<string>('all')", parent)
        self.assertIn("useState<string>('')", parent)
        self.assertNotIn("alu-ref-", parent)
        self.assertNotIn("DirectoryCategoryIcon", parent)

    def test_references_directory_data_preserves_categories_and_counts(self):
        pages = json.loads(read("src/data/pages.json"))
        directory = pages["/references"]["structuredLayout"]["referencesDirectory"]
        expected_counts = {
            "all": 228,
            "Mimari Ofis": 59,
            "Mühendislik Ofisi (Alt Yapı)": 13,
            "Mühendislik Ofisi (Üst Yapı)": 32,
            "İnşaat Şirketleri": 29,
            "Müteahhit": 24,
            "Kamu Kurumları": 52,
            "Meslek Odaları": 3,
            "Prefabrik": 9,
            "Universite": 7,
        }

        self.assertEqual(len(directory["categories"]), 10)
        self.assertEqual(len(directory["items"]), 228)
        self.assertEqual(
            len({(item["category"], item["name"]) for item in directory["items"]}),
            228,
        )
        self.assertEqual(
            {category["id"]: category["count"] for category in directory["categories"]},
            expected_counts,
        )
        actual_counts = {
            category_id: (
                len(directory["items"])
                if category_id == "all"
                else sum(item["category"] == category_id for item in directory["items"])
            )
            for category_id in expected_counts
        }
        self.assertEqual(actual_counts, expected_counts)

    def test_video_playlist_has_a_dedicated_controlled_render_boundary(self):
        component = read("src/components/sections/VideoPlaylistSection.tsx")
        parent = read("src/components/sections/SubpageView.tsx")

        self.assertTrue(component.startswith("'use client';"))
        self.assertIn("import type { PlaylistRecord }", component)
        for marker in [
            "playlist: PlaylistRecord",
            "activeVideoId: string",
            "onVideoChange: (videoId: string) => void",
            "playlist.videos.find",
            "playlist.videos[0]",
            "Math.max(",
            "playlist.videos.findIndex",
            "onClick={() => onVideoChange(video.id)}",
            "https://www.youtube.com/embed/",
            "https://www.youtube.com/watch?v=",
            "https://img.youtube.com/vi/",
            "alu-playlist-item--active",
            "Bölüm {currentIdx + 1} / {playlist.videos.length}",
            "Video Kütüphanesine Dön",
            'target="_blank"',
            'rel="noopener noreferrer"',
            'loading="lazy"',
        ]:
            with self.subTest(marker=marker):
                self.assertIn(marker, component)

        self.assertIn("import { VideoPlaylistSection } from './VideoPlaylistSection';", parent)
        self.assertIn("playlist={playlist}", parent)
        self.assertIn("activeVideoId={activeVideoId}", parent)
        self.assertIn("onVideoChange={setActiveVideoId}", parent)
        self.assertIn("playlist?.videos?.[0]?.id || ''", parent)
        self.assertNotIn("alu-playlist-", parent)

    def test_video_playlist_data_preserves_routes_counts_and_first_video_order(self):
        playlists = json.loads(read("src/data/playlists.json"))
        pages = json.loads(read("src/data/pages.json"))
        playlist_records = list(playlists.values())
        expected_counts = [39, 12, 15, 26, 26, 14, 34, 2, 4, 8, 9, 9, 18, 26]
        expected_first_video_ids = [
            "oMTdIgee5zk",
            "dNGuW4DfGXQ",
            "tM2ECw1jAoQ",
            "HcbHXEc6R4o",
            "iG-e7_fjbc8",
            "krrdOMuHAPo",
            "vqLnGDJpJOA",
            "ZMy00xdK_Zw",
            "yRZUdIfqqTg",
            "qrWbcV0WUJI",
            "pbrLQHEgmbE",
            "DnR6gPrkykw",
            "qhAwHkMm2yU",
            "HcbHXEc6R4o",
        ]

        self.assertEqual(len(playlist_records), 14)
        self.assertEqual([record["count"] for record in playlist_records], expected_counts)
        self.assertEqual(
            [record["videos"][0]["id"] for record in playlist_records],
            expected_first_video_ids,
        )
        self.assertEqual(sum(len(record["videos"]) for record in playlist_records), 242)
        self.assertEqual(
            len({video["id"] for record in playlist_records for video in record["videos"]}),
            216,
        )

        for playlist_id, record in playlists.items():
            with self.subTest(playlist_id=playlist_id):
                self.assertEqual(record["id"], playlist_id)
                self.assertTrue(record["videos"])
                self.assertEqual(record["count"], len(record["videos"]))
                self.assertEqual(
                    len({video["id"] for video in record["videos"]}),
                    len(record["videos"]),
                )
                self.assertEqual(pages[record["url"]]["playlistId"], playlist_id)

    def test_search_page_has_a_dedicated_controlled_render_boundary(self):
        component = read("src/components/sections/SearchPageSection.tsx")
        parent = read("src/components/sections/SubpageView.tsx")

        self.assertTrue(component.startswith("'use client';"))
        self.assertRegex(
            component,
            r"import \{[^}]*\bgetHomepageData\b[^}]*\bgetSearchIndex\b[^}]*\}",
        )
        for marker in [
            "query: string",
            "onQueryChange: (query: string) => void",
            "const searchIndex = getSearchIndex()",
            "query.trim()",
            "const normalizedQuery = query.toLowerCase()",
            "item.title.toLowerCase().includes(normalizedQuery)",
            "item.seoTitle.toLowerCase().includes(normalizedQuery)",
            "item.description.toLowerCase().includes(normalizedQuery)",
            "item.path.toLowerCase().includes(normalizedQuery)",
            "item.keywords.toLowerCase().includes(normalizedQuery)",
            "Tüm Sayfa, Ürün ve Çözümlerde Ara",
            "filteredResults.map",
            "item.section.toUpperCase()",
            "Sayfaya Git",
        ]:
            with self.subTest(marker=marker):
                self.assertIn(marker, component)

        self.assertIn("import { SearchPageSection } from './SearchPageSection';", parent)
        self.assertIn("page.path === '/search'", parent)
        self.assertIn("query={searchQuery}", parent)
        self.assertIn("onQueryChange={setSearchQuery}", parent)
        self.assertIn("const [searchQuery, setSearchQuery] = useState('')", parent)
        self.assertNotIn("getSearchIndex", parent)
        self.assertNotIn("filteredResults", parent)
        self.assertNotIn("alu-services-grid", parent)

    def test_search_index_preserves_all_page_records_and_order(self):
        search_index = json.loads(read("src/data/search-index.json"))
        pages = json.loads(read("src/data/pages.json"))

        def filter_paths(query: str):
            if not query.strip():
                return [item["path"] for item in search_index]
            normalized_query = query.lower()
            return [
                item["path"]
                for item in search_index
                if any(
                    normalized_query in item[field].lower()
                    for field in ["title", "seoTitle", "description", "path", "keywords"]
                )
            ]

        self.assertEqual(len(search_index), 110)
        self.assertEqual(len({item["path"] for item in search_index}), 110)
        self.assertEqual(
            [item["path"] for item in search_index],
            list(pages.keys()),
        )
        self.assertEqual(search_index[0]["path"], "/")
        self.assertEqual(search_index[-1]["path"], "/solutions/structural")
        self.assertEqual(
            {item["path"] for item in search_index if not item["keywords"]},
            {"/health", "/package-overview", "/references", "/search"},
        )
        for item in search_index:
            with self.subTest(path=item["path"]):
                self.assertIn(item["path"], pages)
                page = pages[item["path"]]
                self.assertEqual(item["title"], page["h1"])
                self.assertEqual(item["seoTitle"], page["title"])
                self.assertEqual(item["section"], page["section"])
                self.assertEqual(item["description"], page["description"])

        self.assertEqual(len(filter_paths("")), 110)
        self.assertEqual(len(filter_paths(" ")), 110)
        self.assertEqual(len(filter_paths("allplan")), 79)
        self.assertEqual(
            filter_paths("BIMFlex"),
            ["/solutions-v2/other", "/solutions/bimflex"],
        )
        self.assertEqual(len(filter_paths("Köprü")), 9)
        self.assertEqual(len(filter_paths("Prekast")), 4)
        self.assertEqual(filter_paths("__none__"), [])
        self.assertEqual(filter_paths(" bimflex "), ["/solutions/bimflex"])

    def test_subpage_hero_has_a_dedicated_stateless_render_boundary(self):
        component = read("src/components/sections/SubpageHeroSection.tsx")
        parent = read("src/components/sections/SubpageView.tsx")

        self.assertNotIn("'use client'", component)
        self.assertIn("import type { ContentImage, PageRecord }", component)
        for marker in [
            "page: PageRecord",
            "heroImage: ContentImage | null",
            "sectionBadgeLabel: string",
            "isLegalPage: boolean",
            "alu-subpage-hero",
            'aria-labelledby="page-h1"',
            "page.breadcrumbs.map",
            'aria-current="page"',
            "sectionBadgeLabel",
            "page.h1",
            "page.description",
            "!isLegalPage && page.path !== '/about'",
            "href={MAIN_QUOTE_FORM_URL}",
            "href={TRIAL_CTA_URL}",
            "page.path.startsWith('/products')",
            'href="/docs/V2026_paket-karsilastirme-Q3-2026_R01.pdf"',
            "backgroundImage: `url(${heroImage.src})`",
            "alt={heroImage.alt || page.h1}",
            "heroImage.alt &&",
        ]:
            with self.subTest(marker=marker):
                self.assertIn(marker, component)

        self.assertIn("import { SubpageHeroSection } from './SubpageHeroSection';", parent)
        for marker in [
            "const isLegalPage = page.section === 'legal'",
            "const heroImage = !isLegalPage && photoImages.length > 0 ? photoImages[0] : null",
            "const sectionBadgeLabel = SECTION_LABELS[page.section] || page.eyebrow",
            "<SubpageHeroSection",
            "page={page}",
            "heroImage={heroImage}",
            "sectionBadgeLabel={sectionBadgeLabel}",
            "isLegalPage={isLegalPage}",
        ]:
            with self.subTest(marker=marker):
                self.assertIn(marker, parent)
        self.assertNotIn("alu-subpage-hero", parent)
        self.assertNotIn("alu-breadcrumb", parent)

    def test_subpage_hero_data_preserves_route_specific_branches_and_pdf(self):
        pages = json.loads(read("src/data/pages.json"))
        subpages = [page for path, page in pages.items() if path != "/"]

        hero_image_routes = [
            page["path"]
            for page in subpages
            if page["section"] != "legal"
            and any(image.get("src") and not image.get("isIcon") for image in page.get("images") or [])
        ]
        no_cta_routes = [
            page["path"]
            for page in subpages
            if page["section"] == "legal" or page["path"] == "/about"
        ]
        product_routes = [page["path"] for page in subpages if page["path"].startswith("/products")]

        self.assertEqual(len(subpages), 109)
        self.assertEqual(len(hero_image_routes), 69)
        self.assertEqual(no_cta_routes, ["/about", "/gizlilik-politikasi", "/kullanim-sartlari", "/kvkk"])
        self.assertEqual(len(product_routes), 18)
        self.assertTrue(
            (ROOT / "public/docs/V2026_paket-karsilastirme-Q3-2026_R01.pdf").is_file()
        )

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
        parent = read("src/components/sections/StructuredPageLayoutSection.tsx")

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
        self.assertIn("<BenefitsSection benefits={layout.benefits} />", parent)
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
        parent = read("src/components/sections/StructuredPageLayoutSection.tsx")

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
        parent = read("src/components/sections/StructuredPageLayoutSection.tsx")

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
