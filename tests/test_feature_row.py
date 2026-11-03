"""Design phase 4: alternating media/text feature rows share one FeatureRow component."""

from pathlib import Path
import re
import unittest


ROOT = Path(__file__).resolve().parents[1]
SECTIONS = ROOT / "src/components/sections"
COMPONENT = SECTIONS / "FeatureRow.tsx"
COMPONENT_CSS = SECTIONS / "FeatureRow.module.css"
USERS = {
    "subpage": SECTIONS / "SubpageView.tsx",
    "frilo": ROOT / "src/app/products/frilo/page.tsx",
    "max": SECTIONS / "AllplanMaxPreviewPage.tsx",
}
OLD_MARKUP = {
    "subpage": "alu-feature-row",
    "frilo": "hero.capability",
    "max": "styles.feature}",
}


def read(path: Path) -> str:
    return path.read_text(encoding="utf-8")


class FeatureRowComponentTests(unittest.TestCase):
    def test_component_exports_row_and_list(self):
        source = read(COMPONENT)
        self.assertIn("export function FeatureRow(", source)
        self.assertIn("export function FeatureRowList(", source)

    def test_index_badge_is_decorative(self):
        self.assertRegex(read(COMPONENT), r'className=\{styles\.index\} aria-hidden="true"')

    def test_rows_alternate_and_use_card_tokens(self):
        css = read(COMPONENT_CSS)
        self.assertIn(".reverse .media{order:2}", css)
        row = re.search(r"\.row\{[^}]*\}", css).group(0)
        self.assertIn("var(--card-bg)", row)
        self.assertIn("var(--card-border)", row)
        self.assertIn("min-height:var(--layout-application-feature-media-min-height)", css)


class FeatureRowUsageTests(unittest.TestCase):
    def test_every_feature_row_page_uses_the_component(self):
        for name, path in USERS.items():
            source = read(path)
            with self.subTest(page=name):
                self.assertIn("<FeatureRow", source)
                self.assertNotIn(OLD_MARKUP[name], source)

    def test_old_row_styles_are_removed(self):
        self.assertNotIn(".alu-feature-row", read(ROOT / "src/styles/application.css"))
        self.assertNotRegex(read(SECTIONS / "ProductPage.module.css"), r"\.capability(List|Text)?\{")
        self.assertNotRegex(read(SECTIONS / "AllplanMaxPreviewPage.module.css"), r"\.(featureList|feature|featureText|featureClip)\{")


if __name__ == "__main__":
    unittest.main()
