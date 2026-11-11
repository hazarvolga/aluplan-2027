"""Architectural contracts for progressively splitting the large subpage renderer."""

from pathlib import Path
import json
import re
import struct
import subprocess
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
        self.assertRegex(parent, r'\{pageEndConversion\s*&&\s*<DebugComponentLabel\s+name="PageEndConversion">\s*<PageEndConversion model=\{pageEndConversion\}\s*/>\s*</DebugComponentLabel>\}')
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
            "styles.banner",
            "styles.tiles",
            "const isInternal = effectiveUrl.startsWith('/')",
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
            ("ALLPLAN YouTube Kanalı", "https://www.youtube.com/c/AllplanInternational"),
            ("Youtube Allplan Precast", "https://www.youtube.com/c/AllplanPrecast"),
            ("Allplan ile Tanışın: Tüm Disiplinler İçin Temel Eğitim Videoları", "/video-kutuphanesi/hello-allplan-2024"),
            ("Allplan Add On Geometry Tools", "/video-kutuphanesi/addon-geometry"),
            ("AX3000 - MEP & Enerji", "/video-kutuphanesi/ax3000"),
            ("Youtube CDS Allplan Add-On", "#"),
            ("Allplan Road Design Workflow", "/video-kutuphanesi/road-design"),
            ("Allplan Bridge Workflows", "/video-kutuphanesi/bridge-workflows"),
            ("Campus Tutorials (Deutsch)", "/video-kutuphanesi/campus-de"),
            ("Campus Tutorials (English)", "/video-kutuphanesi/campus-en"),
            ("Allplan Bridge", "#"),
            ("Allplan Bridge Tutorials", "#"),
            ("SDS2 Detaylandırma", "/video-kutuphanesi/sds2-intro"),
            ("Konut İnşaatı İş Akışları", "/video-kutuphanesi/konut-insaati"),
            ("Bridge Workflow 2022", "/video-kutuphanesi/bridge-workflow-2022"),
            ("Otomatik Donatı (PythonPart)", "/video-kutuphanesi/otomatik-donati"),
            ("ALLPLAN QuickStart: Buildings", "/video-kutuphanesi/quickstart-buildings"),
            ("ALLPLAN for Reinforcement", "/video-kutuphanesi/allplan-reinforcement"),
            ("Allplan Campus Tutorials 2019-2022", "/video-kutuphanesi/campus-tutorials-2019-2022"),
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
            "https://www.youtube-nocookie.com/embed/",
            "https://www.youtube.com/watch?v=",
            "https://img.youtube.com/vi/",
            "alu-playlist-item--active",
            "{itemPrefix} {currentIdx + 1} / {playlist.videos.length}",
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
        self.assertIn('useSearchIndex', component)
        for marker in [
            "query: string",
            "onQueryChange: (query: string) => void",
            "entries: searchIndex, loading, error, videoPartial, load, retryVideos",
            "rankSearchEntries(searchIndex, query)",
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

        self.assertEqual(len(search_index), len(pages) - 1)
        self.assertEqual(len({item["path"] for item in search_index}), len(search_index))
        self.assertEqual(
            [item["path"] for item in search_index],
            [path for path in pages if path != "/package-overview"],
        )
        self.assertEqual(search_index[0]["path"], "/")
        self.assertEqual(search_index[-1]["path"], "/solutions/structural")
        self.assertEqual(
            {item["path"] for item in search_index if not item["keywords"]},
            {path for path, page in pages.items() if path != "/package-overview" and not page["headings"] and not page["bodyNodes"]},
        )
        for item in search_index:
            with self.subTest(path=item["path"]):
                self.assertIn(item["path"], pages)
                page = pages[item["path"]]
                self.assertEqual(item["title"], page["h1"])
                self.assertEqual(item["seoTitle"], page["title"])
                self.assertEqual(item["section"], page["section"])
                self.assertEqual(item["description"], page["description"])

        self.assertEqual(len(filter_paths("")), len(search_index))
        self.assertEqual(len(filter_paths(" ")), len(search_index))
        self.assertIn("/solutions/bimflex", filter_paths("BIMFlex"))
        self.assertEqual(filter_paths("__none__"), [])

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
            "sectionBadgeLabel",
            "page.h1",
            "page.description",
            "!isLegalPage && page.path !== '/about'",
            "href={MAIN_QUOTE_FORM_URL}",
            "href={scalypsoTrial ?? TRIAL_CTA_URL}",
            "page.path.startsWith('/products')",
            'href="/docs/V2026_paket-karsilastirme-Q3-2026_R01.pdf"',
            '<picture className="alu-subpage-hero__bg" aria-hidden="true">',
            "import { getImageProps } from 'next/image'",
            '<source media="(max-width: 40rem)" srcSet={responsiveBackground.mobileSrcSet}',
            'srcSet={responsiveBackground.desktopSrcSet}',
            "loading: 'eager'",
            'fetchPriority="high"',
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
        breadcrumb = read("src/components/sections/PageBreadcrumb.tsx")
        self.assertIn("import { PageBreadcrumb } from './PageBreadcrumb';", parent)
        self.assertIn("page.breadcrumbs.length > 1 && <PageBreadcrumb items={page.breadcrumbs} />", parent)
        self.assertIn("items.map", breadcrumb)
        self.assertIn('aria-current="page"', breadcrumb)
        self.assertIn('aria-label="Sayfa yolu"', breadcrumb)
        self.assertNotIn("page.breadcrumbs", component)

    def test_subpage_hero_uses_sitewide_family_background_presentation(self):
        policy = read("src/components/sections/subpage-hero-presentation.ts")
        component = read("src/components/sections/SubpageHeroSection.tsx")
        parent = read("src/components/sections/SubpageView.tsx")
        styles = read("src/styles/application.css")

        for marker in [
            "export type SubpageHeroPresentation = 'framed' | 'background-only'",
            "'VF-00': 'vf-00-ecosystem-overview'",
            "'VF-07': 'vf-07-allplan-product-platform'",
            "'/solutions/architecture'",
            "'/products/allplan-2026'",
            "presentation: 'background-only'",
            "assetKind: 'family'",
            "assetKind: 'official-release'",
            "presentation: 'framed'",
        ]:
            with self.subTest(policy_marker=marker):
                self.assertIn(marker, policy)

        for marker in [
            "presentation: SubpageHeroPresentation",
            "background: HeroBackgroundSources | null",
            "familyId: HeroVisualFamilyId | null",
            "assetKind: HeroVisualAssetKind",
            "const showFramedMedia = Boolean(heroImage) && presentation === 'framed'",
            "alu-subpage-hero--background-only",
            '<picture className="alu-subpage-hero__bg" aria-hidden="true">',
            "getImageProps({",
            '<source media="(max-width: 40rem)" srcSet={responsiveBackground.mobileSrcSet}',
            'srcSet={responsiveBackground.desktopSrcSet}',
            'data-hero-family={familyId || undefined}',
            'data-hero-source={assetKind}',
            "showFramedMedia &&",
            "alu-subpage-hero__content-panel",
        ]:
            with self.subTest(component_marker=marker):
                self.assertIn(marker, component)
        self.assertNotIn('className="alu-visually-hidden"', component)

        for marker in [
            "getSubpageHeroPresentation(page.path, heroImage?.src || null)",
            "presentation={heroPresentation.presentation}",
            "background={heroPresentation.background}",
            "familyId={heroPresentation.familyId}",
            "assetKind={heroPresentation.assetKind}",
        ]:
            with self.subTest(parent_marker=marker):
                self.assertIn(marker, parent)

        self.assertIn(".alu-subpage-hero--background-only", styles)
        self.assertIn(".alu-subpage-hero--background-only .alu-subpage-hero__bg", styles)
        self.assertIn(".alu-subpage-hero--background-only .alu-subpage-hero__scrim", styles)
        self.assertIn(
            ".alu-subpage-hero--background-only .alu-subpage-hero__content-panel",
            styles,
        )
        self.assertIn(".alu-subpage-hero__bg img", styles)
        self.assertIn("object-fit: contain", styles)
        self.assertIn("object-position: center right", styles)
        self.assertIn("object-fit: cover", styles)
        image_rules = re.findall(
            r"\.alu-subpage-hero--background-only \.alu-subpage-hero__bg img \{([^}]*)\}",
            styles, re.DOTALL,
        )
        self.assertGreaterEqual(len(image_rules), 2)
        desktop_image, mobile_image = image_rules[0], image_rules[-1]
        desktop_mask = "linear-gradient(90deg, transparent 0%, var(--surface-page) 60%)"
        self.assertIn(f"mask-image: {desktop_mask};", desktop_image)
        self.assertIn(f"-webkit-mask-image: {desktop_mask};", desktop_image)
        self.assertIn("mask-image: none;", mobile_image)
        self.assertIn("-webkit-mask-image: none;", mobile_image)
        mobile_section = styles[styles.index('@media (max-width: 40rem) {', styles.index(desktop_image)):]
        mobile_backdrop = re.search(
            r"\.alu-subpage-hero--background-only \.alu-subpage-hero__bg \{([^}]*)\}",
            mobile_section, re.DOTALL,
        )
        self.assertIsNotNone(mobile_backdrop)
        mobile_mask = "linear-gradient(180deg, var(--surface-page) 0%, var(--surface-page) 46%, transparent 88%, transparent 100%)"
        self.assertIn(f"mask-image: {mobile_mask};", mobile_backdrop.group(1))
        self.assertIn(f"-webkit-mask-image: {mobile_mask};", mobile_backdrop.group(1))
        panel_rule = re.search(
            r"\.alu-subpage-hero--background-only \.alu-subpage-hero__content-panel \{([^}]*)\}",
            styles,
            re.DOTALL,
        )
        self.assertIsNotNone(panel_rule)
        self.assertNotIn("background:", panel_rule.group(1))
        self.assertNotIn("padding:", panel_rule.group(1))

    def test_architecture_hero_generated_assets_are_valid_and_tracked(self):
        web_relative = Path("public/assets/solutions/architecture-hero-v2.jpg")
        source_relative = Path(
            "assets/source/generated/heroes/architecture-hero-v2-original.png"
        )
        web_asset = ROOT / web_relative
        source_asset = ROOT / source_relative

        self.assertTrue(web_asset.is_file())
        self.assertTrue(source_asset.is_file())
        self.assertGreater(web_asset.stat().st_size, 100_000)
        self.assertLess(web_asset.stat().st_size, 1_000_000)
        self.assertGreater(source_asset.stat().st_size, web_asset.stat().st_size)

        web_bytes = web_asset.read_bytes()
        self.assertTrue(web_bytes.startswith(b"\xff\xd8"))
        self.assertTrue(web_bytes.endswith(b"\xff\xd9"))

        source_bytes = source_asset.read_bytes()
        self.assertEqual(source_bytes[:8], b"\x89PNG\r\n\x1a\n")
        self.assertEqual(source_bytes[12:16], b"IHDR")
        width, height = struct.unpack(">II", source_bytes[16:24])
        self.assertEqual((width, height), (1672, 941))

        for relative in (web_relative, source_relative):
            with self.subTest(tracked=str(relative)):
                tracked = subprocess.run(
                    ["git", "ls-files", "--error-unmatch", str(relative)],
                    cwd=ROOT,
                    capture_output=True,
                    text=True,
                    check=False,
                )
                self.assertEqual(tracked.returncode, 0, tracked.stderr)

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

        self.assertEqual(len(subpages), 100)  # /products/architecture removed 2026-11-11
        self.assertEqual(len(hero_image_routes), 67)
        self.assertEqual(no_cta_routes, ["/about", "/gizlilik-politikasi", "/kullanim-sartlari", "/kvkk"])
        self.assertEqual(len(product_routes), 17)
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
            "Hikayemiz",
            "Değerlerimiz",
            "Ofisimiz",
            'href="/contact"',
            'href="/references"',
            "<ConsentEmbed src={mapEmbed.src}",
        ]:
            with self.subTest(marker=marker):
                self.assertIn(marker, component)

        for marker in ["Kurumsal Göstergeler", "29+", "500+", "50+", "10K+"]:
            self.assertNotIn(marker, component)

        about = json.loads(read('src/data/pages.json'))['/about']
        original = "İstanbul Ataşehir'deki ofisimizden Türkiye geneline hizmet veren uzman kadromuz, müşterilerimizin projelerinde başarılı olmalarını sağlamak için özveriyle çalışmaktadır. Belediyeler, üniversiteler, özel mimarlık ve mühendislik ofisleri ile büyük ölçekli inşaat firmalarına hizmet vermekteyiz."
        story = next(section for section in about['sections'] if section['heading'] == 'Hikayemiz')
        self.assertIn(original, story['items'])
        self.assertIn(original, about['bodyNodes'])
        for marker in ['29+', '500+', '50+', '10K+', "50'den fazla uzman"]:
            self.assertNotIn(marker, json.dumps(about, ensure_ascii=False))

        self.assertIn("import { AboutEditorialSection } from './AboutEditorialSection';", parent)
        self.assertRegex(parent, r"page\.path === '/about'\s*&&\s*<DebugComponentLabel\s+name=\"AboutEditorialSection\">\s*<AboutEditorialSection page=\{page\}\s*/>\s*</DebugComponentLabel>")
        self.assertNotIn("alu-about-editorial", parent)

    def test_structured_benefits_have_a_dedicated_render_boundary(self):
        component = read("src/components/sections/BenefitsSection.tsx")
        cards = read("src/components/sections/BenefitIconCards.tsx")
        parent = read("src/components/sections/StructuredPageLayoutSection.tsx")

        self.assertIn("import type { StructuredPageLayout }", component)
        self.assertNotIn("'use client'", component)
        self.assertIn("<SectionHeader", component)
        self.assertIn("benefits.kicker", component)
        self.assertIn("benefits.title", component)
        self.assertIn("import { BenefitIconCards } from './BenefitIconCards';", component)
        self.assertIn('<BenefitIconCards items={benefits.items} variant={variant}', component)
        self.assertIn('<DebugComponentLabel name="BenefitIconCards">', cards)
        self.assertIn("alu-section-header", read("src/components/sections/SectionHeader.tsx"))
        for marker in [
            "alu-benefits-grid",
            "alu-benefits-grid--cols-4",
            "alu-benefits-grid--cols-3",
            "items.map",
            "benefit.subtitle",
            "benefit.iconSrc",
            "benefit.description",
            'loading="lazy"',
        ]:
            with self.subTest(marker=marker):
                self.assertIn(marker, cards)

        self.assertIn("import { BenefitsSection } from './BenefitsSection';", parent)
        self.assertIn("<BenefitsSection benefits=", parent)
        self.assertIn("layout.benefits.items.map", parent)
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
                if item.get("sourceId") == "ax-product-feature-plan-preview":
                    self.assertEqual(item.get("description"), "", route)
                else:
                    self.assertTrue(item.get("description"), route)
                icon_src = item.get("iconSrc")
                if icon_src and icon_src.startswith("/"):
                    self.assertTrue((ROOT / "public" / icon_src.lstrip("/")).is_file(), icon_src)

        self.assertEqual(len(benefit_routes), 29)

    def test_media_grids_have_a_dedicated_interactive_render_boundary(self):
        component = read("src/components/sections/MediaGridSection.tsx")
        cards = read("src/components/sections/FuncsGridCars.tsx")
        parent = read("src/components/sections/StructuredPageLayoutSection.tsx")

        self.assertTrue(component.startswith("'use client';"))
        self.assertIn("import type { StructuredMediaGridSection }", component)
        self.assertIn("import { FuncsGridCars } from './FuncsGridCars';", component)
        self.assertIn('<DebugComponentLabel name="FuncsGridCars"><FuncsGridCars', component)
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
                self.assertIn(marker, cards)

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
                    if str(item.get("sourceId", "")).startswith("ax-vr-slide-"):
                        self.assertEqual(item.get("description"), "", route)
                    else:
                        self.assertTrue(item.get("description"), route)
                    image_src = item.get("imageSrc")
                    if image_src and image_src.startswith("/"):
                        self.assertTrue((ROOT / "public" / image_src.lstrip("/")).is_file(), image_src)

        self.assertEqual(len(media_routes), 29)
        self.assertEqual(core_grid_count, 8)
        self.assertEqual(extra_grid_count, 44)
        self.assertEqual(card_count, 348)

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

        self.assertEqual(len(callout_routes), 23)
        self.assertEqual(
            totals,
            {"all": 67, "primary": 57, "bottom": 10, "youtube": 27, "mp4": 5, "image": 31},
        )


if __name__ == "__main__":
    unittest.main()
