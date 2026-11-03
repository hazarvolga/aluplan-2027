"""Route-wide media provenance contract for generated page videos."""

import json
from pathlib import Path
import re
import unittest
from urllib.parse import urlsplit


ROOT = Path(__file__).resolve().parents[1]
INVENTORY = json.loads(
    (ROOT / "docs/00-inventory/content-inventory.json").read_text(encoding="utf-8")
)
PAGES = json.loads((ROOT / "src/data/pages.json").read_text(encoding="utf-8"))
EXCLUDED_ROUTES = {"/hero-3d", "/test-webgl"}
RENAME_POLICY = json.loads((ROOT / "tests/fixtures/sitewide_parity_policy.json").read_text(encoding="utf-8"))
ROUTE_RENAMES = RENAME_POLICY.get("routeRenames", {})
ROUTE_PREFIX_RENAMES = RENAME_POLICY.get("routePrefixRenames", {})


def renamed_route(route: str) -> str:
    if route in ROUTE_RENAMES:
        return ROUTE_RENAMES[route]
    for old, new in ROUTE_PREFIX_RENAMES.items():
        if route == old or route.startswith(old + "/"):
            return new + route[len(old):]
    return route


def route_for_url(url: str) -> str:
    path = urlsplit(url).path.rstrip("/")
    return path or "/"


def normalize_native_video_src(src: str) -> str:
    """Normalize live Next asset URLs to their stable public asset identity."""
    path = urlsplit(src).path
    next_asset_prefix = "/_next/static/chunks/assets/"
    if path.startswith(next_asset_prefix):
        relative = path[len(next_asset_prefix) :]
        relative = re.sub(r"\.[0-9a-f]{16}(?=\.mp4$)", "", relative)
        return f"/assets/{relative}"
    return path


def source_native_videos() -> dict[str, set[str]]:
    result: dict[str, set[str]] = {}
    for page in INVENTORY["pages"]:
        if page.get("status") != 200:
            continue
        route = route_for_url(page["url"])
        if route in EXCLUDED_ROUTES:
            continue
        result[renamed_route(route)] = {
            normalize_native_video_src((item.get("attributes") or {}).get("src", ""))
            for item in page.get("media", [])
            if item.get("tag") in {"video", "source"}
            and (item.get("attributes") or {}).get("src")
        }
    return result


class SitewideMediaProvenanceTests(unittest.TestCase):
    def test_generated_page_videos_exactly_match_native_source_evidence(self):
        source_by_route = source_native_videos()
        self.assertEqual(set(PAGES), set(source_by_route))

        mismatches = {}
        for route, page in PAGES.items():
            actual = {
                normalize_native_video_src(video["src"])
                for video in page.get("videos", [])
            }
            expected = source_by_route[route]
            if actual != expected:
                mismatches[route] = {
                    "missing": sorted(expected - actual),
                    "unexpected": sorted(actual - expected),
                }

        self.assertEqual(mismatches, {})

    def test_bridge_and_aec_keep_source_intro_embeds_without_editorial_fallbacks(self):
        expected = {
            "/solutions/bridge-design": "https://www.youtube.com/embed/SeA6ncaqUhY",
            "/products/allplan-aec": "https://www.youtube.com/embed/tFnwOyX7ncI",
        }
        for route, embed_url in expected.items():
            with self.subTest(route=route):
                page = PAGES[route]
                self.assertEqual(page.get("videos"), [])
                self.assertEqual(
                    page["structuredLayout"]["intro"]["videoEmbedUrl"], embed_url
                )
                source_page = next(
                    item
                    for item in INVENTORY["pages"]
                    if route_for_url(item["url"]) == route
                )
                source_embeds = {
                    (item.get("attributes") or {}).get("src")
                    for item in source_page.get("embeds", [])
                }
                self.assertIn(embed_url, source_embeds)

    def test_bridge_feature_page_preserves_all_five_native_source_videos(self):
        route = "/solutions/features-allplan-bridge"
        expected = source_native_videos()[route]
        actual = {
            normalize_native_video_src(video["src"])
            for video in PAGES[route].get("videos", [])
        }
        self.assertEqual(len(expected), 5)
        self.assertEqual(actual, expected)


if __name__ == "__main__":
    unittest.main()
