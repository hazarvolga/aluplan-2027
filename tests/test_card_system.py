"""Every card family draws from the canonical card tokens and one title scale."""

from pathlib import Path
import re
import unittest


ROOT = Path(__file__).resolve().parents[1]
CSS = (ROOT / "src/styles/application.css").read_text(encoding="utf-8")
SECTIONS = ROOT / "src/components/sections"
FAMILIES = ["alu-benefit-card", "alu-media-card", "alu-spec-card", "alu-service-card", "alu-ref-card", "alu-about-value-item"]
PADDED = ["alu-benefit-card", "alu-spec-card", "alu-service-card", "alu-about-value-item"]
TITLE_SIZE = "var(--type-application-body-intro-size)"


def rule(selector: str) -> str:
    match = re.search(r"\n\." + re.escape(selector) + r" \{(.*?)\n\}", CSS, re.S)
    assert match, selector
    return match.group(1)


def hover(selector: str) -> str:
    match = re.search(r"\n\." + re.escape(selector) + r":hover \{(.*?)\n\}", CSS, re.S)
    assert match, selector
    return match.group(1)


class CardFamilyTests(unittest.TestCase):
    def test_surface_border_shadow_and_radius_come_from_the_card_tokens(self):
        for name in FAMILIES:
            body = rule(name)
            with self.subTest(card=name):
                self.assertIn("background: var(--card-bg);", body)
                self.assertIn("border: var(--border-width-default) solid var(--card-border);", body)
                self.assertIn("box-shadow: var(--elevation-raised);", body)  # the value of --card-shadow
                self.assertIn("border-radius: var(--card-radius);", body)
                self.assertNotIn("var(--surface-default)", body)

    def test_text_cards_share_one_padding(self):
        for name in PADDED:
            with self.subTest(card=name):
                self.assertIn("padding: var(--card-padding);", rule(name))

    def test_directory_style_cards_share_one_accent_top_border(self):
        for name in ("alu-spec-card", "alu-service-card", "alu-about-value-item"):
            with self.subTest(card=name):
                self.assertIn("border-top: var(--border-width-strong) solid var(--accent-border);", rule(name))

    def test_cards_share_one_hover_lift(self):
        for name in ("alu-benefit-card", "alu-media-card", "alu-service-card", "alu-about-value-item", "alu-ref-card"):
            with self.subTest(card=name):
                self.assertIn("transform: var(--motion-transform-lift-subtle);", hover(name))
                self.assertIn("border-color: var(--accent-border);", hover(name))

    def test_card_titles_share_one_size(self):
        self.assertIn(f"font-size: {TITLE_SIZE};", rule("alu-benefit-card__title"))
        self.assertIn(f"font-size: {TITLE_SIZE};", rule("alu-media-card__title"))
        self.assertIn(f"font-size: {TITLE_SIZE};", rule("alu-about-value-item__title"))
        self.assertRegex(CSS, r"\.alu-spec-card \.alu-h3 \{[^}]*font-size: " + re.escape(TITLE_SIZE))

    def test_module_cards_use_the_same_tokens_and_title_size(self):
        edition = (SECTIONS / "EditionCards.module.css").read_text(encoding="utf-8")
        product = (SECTIONS / "ProductPage.module.css").read_text(encoding="utf-8")
        self.assertIn("background:var(--card-bg)", edition)
        self.assertIn(TITLE_SIZE, re.search(r"\.card h3\{[^}]*\}", edition).group(0))
        update = re.search(r"\.updateCard\{[^}]*\}", product).group(0)
        self.assertIn("var(--card-bg)", update)
        self.assertIn("var(--card-border)", update)
        self.assertIn("var(--card-shadow)", update)
        self.assertIn(TITLE_SIZE, re.search(r"\.updateCard h3\{[^}]*\}", product).group(0))


if __name__ == "__main__":
    unittest.main()
