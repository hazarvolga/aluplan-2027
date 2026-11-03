"""Guards for design-bearing values that belong in the token layer."""

from pathlib import Path
import json
import re
import unittest


ROOT = Path(__file__).resolve().parents[1]


def read(relative: str) -> str:
    return (ROOT / relative).read_text(encoding="utf-8")


class DesignLiteralContractTests(unittest.TestCase):
    def test_generated_workflow_links_use_semantic_accent_keys(self):
        pages = json.loads(read("src/data/pages.json"))
        workflow_groups = [
            links
            for page in pages.values()
            if (links := (page.get("structuredLayout") or {}).get("workflowLinks"))
        ]
        workflow_links = [link for links in workflow_groups for link in links]

        self.assertEqual(len(workflow_groups), 6)
        self.assertEqual(len(workflow_links), 24)
        for links in workflow_groups:
            self.assertEqual(
                [link.get("accentKey") for link in links],
                ["package", "architect", "engineer", "fabricator"],
            )
        self.assertTrue(all("color" not in link for link in workflow_links))
        self.assertNotRegex(
            json.dumps(workflow_links),
            r"#[0-9a-fA-F]{3,8}\b|\b(?:rgb|rgba|hsl|hsla|oklch|color)\(",
        )

    def test_component_inline_styles_do_not_use_numeric_z_index(self):
        violations = []
        for path in (ROOT / "src/components").rglob("*.tsx"):
            if re.search(r"\bzIndex\s*:\s*-?\d+", path.read_text(encoding="utf-8")):
                violations.append(str(path.relative_to(ROOT)))

        self.assertEqual(violations, [])

    def test_application_css_uses_semantic_z_index_tokens(self):
        application_css = read("src/styles/application.css")

        self.assertNotRegex(application_css, r"\bz-index\s*:\s*-?\d+")
        for token in [
            "--z-background",
            "--z-scrim",
            "--z-base",
            "--z-content",
            "--z-sticky-context",
            "--z-dialog-top",
        ]:
            with self.subTest(token=token):
                self.assertIn(f"z-index: var({token})", application_css)

    def test_preview_css_is_inside_the_token_contract(self):
        preview_css = read("design-system/ui_kits/homepage/preview.css")
        audit = json.loads(read("docs/verification/s06-2026-10-27/raw-literal-audit.json"))

        self.assertIn(
            "design-system/ui_kits/homepage/preview.css",
            audit["scope"],
        )
        self.assertNotRegex(
            preview_css,
            r"#[0-9a-fA-F]{3,8}\b|\b(?:rgba?|hsla?|hwb|lab|lch|oklab|oklch|color)\(",
        )
        self.assertNotRegex(preview_css, r"\bz-index\s*:\s*-?\d+")
        self.assertNotRegex(
            preview_css,
            r"@media[^\{]*\b(?:min|max)-width\s*:\s*[\d.]",
        )
        for token in [
            "--space-preview-hero-padding",
            "--size-preview-grid-pattern",
            "--size-preview-hero-media",
            "--type-preview-hero-mark-size",
            "--z-scrim",
        ]:
            with self.subTest(token=token):
                self.assertIn(f"var({token})", preview_css)


if __name__ == "__main__":
    unittest.main()
