"""Shared akademi component kit in the architectural language: token-only, code as a
separate label (not inside the heading), ModuleCard can hide repeated hours."""

from pathlib import Path
import re
import unittest


ROOT = Path(__file__).resolve().parents[1]
KIT = "src/components/akademi/kit"


def read(path: str) -> str:
    return (ROOT / path).read_text(encoding="utf-8")


class AkademiKitTests(unittest.TestCase):
    components = ("ModuleCard", "LevelCard", "MetaRow", "SectionRule", "Callout",
                  "DistributionBar", "Timeline")

    def test_every_component_and_index_exist(self):
        for name in self.components:
            with self.subTest(component=name):
                self.assertTrue((ROOT / f"{KIT}/{name}.tsx").is_file())
        self.assertTrue((ROOT / f"{KIT}/index.ts").is_file())

    def test_index_reexports_the_kit(self):
        idx = read(f"{KIT}/index.ts")
        for name in self.components:
            with self.subTest(component=name):
                self.assertIn(name, idx)

    def test_module_card_can_hide_repeated_hours(self):
        src = read(f"{KIT}/ModuleCard.tsx")
        self.assertIn("showHours", src)

    def test_module_card_code_is_separate_from_the_heading(self):
        src = read(f"{KIT}/ModuleCard.tsx")
        self.assertIn("{module.code}", src)
        self.assertIn("{module.title}", src)
        # The code must not be rendered inside a heading element.
        self.assertNotRegex(src, r"<h[1-6][^>]*>\s*\{module\.code\}")

    def test_distribution_bar_is_grayscale_not_accent(self):
        # The duration bar is a neutral data mark; the single akademi accent is reserved
        # for wayfinding, so the bar uses only neutral text/surface tokens.
        css = read(f"{KIT}/DistributionBar.module.css")
        self.assertNotIn("--accent-akademi", css)
        self.assertRegex(css, r"var\(--(text|surface|border)-")

    def test_distribution_bar_and_timeline_consume_the_content_types(self):
        bar = read(f"{KIT}/DistributionBar.tsx")
        timeline = read(f"{KIT}/Timeline.tsx")
        self.assertIn("DurationSlice", bar)
        self.assertIn("SessionStep", timeline)

    def test_kit_styles_use_tokens_not_literal_colors(self):
        for name in self.components:
            css = f"{KIT}/{name}.module.css"
            with self.subTest(file=css):
                text = read(css)
                self.assertNotRegex(text, r"#[0-9a-fA-F]{3,8}\b")
                self.assertNotRegex(text, r"\brg?ba?\(")


if __name__ == "__main__":
    unittest.main()
