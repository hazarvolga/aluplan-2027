"""Findings of the all-pages review: contrast, minimum text size and one main landmark per page."""

from pathlib import Path
import json
import os
import re
import unittest


ROOT = Path(__file__).resolve().parents[1]
CSS = (ROOT / "src/styles/application.css").read_text(encoding="utf-8")
TOKENS = json.loads((ROOT / "design-system/tokens/tokens.json").read_text(encoding="utf-8"))
MIN_REM = 0.75


def rule(selector: str) -> str:
    match = re.search(r"\n\." + re.escape(selector) + r" \{(.*?)\n\}", CSS, re.S)
    assert match, selector
    return match.group(1)


class ContrastTests(unittest.TestCase):
    def test_video_badge_text_has_its_own_token_that_reads_on_the_dark_badge(self):
        self.assertIn("color: var(--visual-media-badge-text);", rule("alu-media-card__video-badge"))
        self.assertEqual(TOKENS["primitive"]["color"]["visual"]["mediaBadgeText"]["$value"], "#2DD4BF")
        for theme in ("aluplan", "field"):
            for mode in ("light", "dark"):
                visual = TOKENS["themes"][theme]["modes"][mode]["visual"] if "visual" in TOKENS["themes"][theme]["modes"][mode] else None
                if visual is not None:
                    self.assertIn("mediaBadgeText", visual, f"{theme}/{mode}")

    def test_active_reference_tab_uses_the_primary_action_colour_pair(self):
        self.assertIn("background: var(--action-primary-bg);", rule("alu-ref-tab--active"))
        self.assertIn("color: var(--action-primary-fg);", rule("alu-ref-tab--active"))
        self.assertIn("color: var(--action-primary-fg);", rule("alu-ref-tab--active .alu-ref-tab__count"))
        self.assertNotIn("visual-on-emphasis", rule("alu-ref-tab--active"))

    def test_pathway_role_badge_text_is_mixed_toward_the_text_colour(self):
        self.assertIn("color: color-mix(in srgb, var(--role-accent, var(--role-architect)) 45%, var(--text-primary));", rule("alu-pathway-role-badge"))


class TextSizeTests(unittest.TestCase):
    def test_micro_text_sizes_are_at_least_twelve_pixels(self):
        sizes = TOKENS["primitive"]["font"]["size"]
        for name in ("applicationMicroLabel", "applicationMicroCompact", "applicationMicro"):
            with self.subTest(token=name):
                value = float(sizes[name]["$value"].removesuffix("rem"))
                self.assertGreaterEqual(value, MIN_REM)


class LandmarkTests(unittest.TestCase):
    def test_max_page_does_not_nest_a_second_main(self):
        source = (ROOT / "src/components/sections/AllplanMaxPreviewPage.tsx").read_text(encoding="utf-8")
        self.assertNotIn("<main", source)

    def test_every_built_page_has_exactly_one_main_landmark(self):
        app = ROOT / ".next/server/app"
        if not (app / "index.html").is_file():
            self.skipTest("build output missing")
        offenders = []
        for base, _, files in os.walk(app):
            for name in files:
                path = Path(base) / name
                relative = str(path.relative_to(app))
                # local-only routes (preview, archive) answer 404 in production and are not part of the site
                if name.endswith(".html") and "/_" not in str(path) and not relative.startswith(("preview/", "archive/")):
                    count = len(re.findall(r"<main[ >]", path.read_text(encoding="utf-8")))
                    if count != 1:
                        offenders.append((relative, count))
        self.assertEqual(offenders, [])


if __name__ == "__main__":
    unittest.main()
