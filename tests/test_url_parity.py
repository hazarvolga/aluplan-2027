import importlib.util
import unittest
from pathlib import Path


MODULE_PATH = Path(__file__).resolve().parents[1] / "scripts" / "url_parity.py"
SPEC = importlib.util.spec_from_file_location("url_parity", MODULE_PATH)
url_parity = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(url_parity)


class NormalizePathTests(unittest.TestCase):
    def test_normalizes_origin_query_fragment_trailing_slash_and_unicode(self):
        self.assertEqual(
            url_parity.normalize_path(
                "https://aluplan.com.tr/solutions/imar-yo%CC%88netimlig%CC%86i/?x=1#detail"
            ),
            "/solutions/imar-yönetimliği",
        )

    def test_keeps_root(self):
        self.assertEqual(url_parity.normalize_path("/"), "/")

    def test_encodes_unicode_for_http_without_losing_path_identity(self):
        encoded = url_parity.encode_http_url(
            "https://aluplan.com.tr/solutions/imar-yönetmliği-bim-eklentisi"
        )
        self.assertIn("%C3%B6", encoded)
        self.assertIn("%C4%9F", encoded)
        self.assertEqual(
            url_parity.normalize_path(encoded),
            "/solutions/imar-yönetmliği-bim-eklentisi",
        )

    def test_origin_key_normalizes_default_ports(self):
        self.assertEqual(
            url_parity.origin_key("https://aluplan.com.tr"),
            url_parity.origin_key("https://aluplan.com.tr:443/path"),
        )
        self.assertNotEqual(
            url_parity.origin_key("https://aluplan.com.tr"),
            url_parity.origin_key("http://aluplan.com.tr/path"),
        )

    def test_query_signature_keeps_keys_but_not_values(self):
        signature = url_parity.query_signature(
            "https://aluplan.com.tr/download?token=secret&lang=tr"
        )
        self.assertEqual(signature, "https://aluplan.com.tr/download?lang&token")
        self.assertNotIn("secret", signature)

    def test_page_parser_canonical_can_be_redacted(self):
        parser = url_parity.PageParser()
        parser.feed(
            '<link rel="canonical" href="https://aluplan.com.tr/about?token=secret">'
        )
        self.assertEqual(
            url_parity.query_signature(parser.canonical),
            "https://aluplan.com.tr/about?token",
        )

    def test_csv_cell_neutralizes_formula_prefixes(self):
        self.assertEqual(url_parity.csv_cell("=HYPERLINK(1)"), "'=HYPERLINK(1)")
        self.assertEqual(url_parity.csv_cell("normal"), "normal")


class LocalRouteTests(unittest.TestCase):
    def test_route_group_does_not_create_url_segment(self):
        app_root = Path("/tmp/app")
        page = app_root / "(public)" / "kvkk" / "page.tsx"
        self.assertEqual(url_parity.route_from_page(page, app_root), "/kvkk")

    def test_dynamic_route_is_preserved_as_pattern(self):
        app_root = Path("/tmp/app")
        page = app_root / "training" / "[playlistId]" / "page.tsx"
        self.assertEqual(
            url_parity.route_from_page(page, app_root),
            "/training/[playlistId]",
        )

    def test_dynamic_pattern_matches_one_segment(self):
        self.assertTrue(
            url_parity.path_matches_pattern(
                "/training/hello-allplan-2024", "/training/[playlistId]"
            )
        )

    def test_sitemap_literal_parser_ignores_non_inventory_prefixes(self):
        source = '''
        const mainPages = ["/", "/about"];
        const productPages = ["/products/basic"];
        const allPaths = [...mainPages, ...productPages];
        priority: path.startsWith("/products/") ? 0.9 : 0.8;
        '''
        self.assertEqual(
            url_parity.extract_sitemap_literal_paths(source),
            {"/", "/about", "/products/basic"},
        )
        self.assertFalse(
            url_parity.path_matches_pattern(
                "/training/one/two", "/training/[playlistId]"
            )
        )

    def test_catch_all_requires_at_least_one_segment(self):
        self.assertTrue(url_parity.path_matches_pattern("/docs/one/two", "/docs/[...slug]"))
        self.assertFalse(url_parity.path_matches_pattern("/docs", "/docs/[...slug]"))

    def test_optional_catch_all_matches_base_and_nested_paths(self):
        self.assertTrue(url_parity.path_matches_pattern("/docs", "/docs/[[...slug]]"))
        self.assertTrue(url_parity.path_matches_pattern("/docs/one/two", "/docs/[[...slug]]"))

    def test_api_paths_are_never_crawlable(self):
        self.assertFalse(url_parity.is_crawlable_page("/api"))
        self.assertFalse(url_parity.is_crawlable_page("/api/contact"))
        self.assertTrue(url_parity.is_crawlable_page("/contact"))


class ClassificationTests(unittest.TestCase):
    def test_live_200_and_local_route_is_both(self):
        self.assertEqual(
            url_parity.classify_path(
                path="/about",
                final_status=200,
                redirect_chain=[],
                local_match="/about",
                in_sitemap=True,
            ),
            "both_live_valid",
        )

    def test_live_200_without_local_route_is_live_only(self):
        self.assertEqual(
            url_parity.classify_path(
                path="/new-live-page",
                final_status=200,
                redirect_chain=[],
                local_match=None,
                in_sitemap=True,
            ),
            "live_only_valid",
        )

    def test_redirect_source_is_preserved_separately(self):
        self.assertEqual(
            url_parity.classify_path(
                path="/old",
                final_status=200,
                redirect_chain=[{"status": 308, "location": "/new"}],
                local_match=None,
                in_sitemap=False,
            ),
            "redirect_to_valid_2xx",
        )

    def test_redirect_to_error_is_not_treated_as_valid(self):
        self.assertEqual(
            url_parity.classify_path(
                path="/old",
                final_status=404,
                redirect_chain=[{"status": 308, "location": "/missing"}],
                local_match=None,
                in_sitemap=False,
            ),
            "redirect_to_error",
        )

    def test_redirect_without_verified_target_is_unverified(self):
        self.assertEqual(
            url_parity.classify_path(
                path="/old",
                final_status=None,
                redirect_chain=[{"status": 308, "location": "https://example.com"}],
                local_match=None,
                in_sitemap=False,
            ),
            "redirect_unverified",
        )

    def test_dynamic_match_keeps_template_source_file(self):
        templates = [
            {
                "path": "/training/[playlistId]",
                "source_file": "app/training/[playlistId]/page.tsx",
            }
        ]
        record = url_parity.local_record_for(
            "/training/[playlistId]", {}, templates
        )
        self.assertEqual(record["source_file"], "app/training/[playlistId]/page.tsx")

    def test_sitemap_404_is_stale(self):
        self.assertEqual(
            url_parity.classify_path(
                path="/stale",
                final_status=404,
                redirect_chain=[],
                local_match=None,
                in_sitemap=True,
            ),
            "sitemap_only_stale",
        )

    def test_local_404_is_local_only_candidate(self):
        self.assertEqual(
            url_parity.classify_path(
                path="/local-only",
                final_status=404,
                redirect_chain=[],
                local_match="/local-only",
                in_sitemap=False,
            ),
            "local_only_candidate",
        )

    def test_typo_rewrite_path_is_recognized_as_live_alias(self):
        self.assertTrue(
            url_parity.is_rewrite_alias_path(
                "/solutions/imar-yonetmliği-bim-eklentisi"
            )
        )
        self.assertFalse(
            url_parity.is_rewrite_alias_path(
                "/solutions/imar-yonetmeligi-bim-eklentisi"
            )
        )


if __name__ == "__main__":
    unittest.main()
