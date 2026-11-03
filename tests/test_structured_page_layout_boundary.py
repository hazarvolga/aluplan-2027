"""Contracts for the extracted structured-page rendering boundary."""

from pathlib import Path
import json
import unittest


ROOT = Path(__file__).resolve().parents[1]


def read(relative: str) -> str:
    return (ROOT / relative).read_text(encoding="utf-8")


class StructuredPageLayoutBoundaryTests(unittest.TestCase):
    def test_structured_layout_data_counts_are_preserved(self):
        pages = json.loads(read("src/data/pages.json"))
        layouts = [
            page["structuredLayout"]
            for page in pages.values()
            if page.get("structuredLayout")
            and not page["structuredLayout"].get("trainingTabs")
        ]

        self.assertEqual(len(layouts), 51)
        self.assertEqual(sum(bool(layout.get("intro")) for layout in layouts), 29)
        self.assertEqual(sum(bool(layout.get("workflowLinks")) for layout in layouts), 6)
        self.assertEqual(
            sum(len(layout.get("workflowLinks") or []) for layout in layouts), 24
        )
        self.assertEqual(sum(bool(layout.get("stats")) for layout in layouts), 11)
        self.assertEqual(sum(len(layout.get("stats") or []) for layout in layouts), 34)
        self.assertEqual(
            sum(len(layout.get("challenges") or []) for layout in layouts), 32
        )
        self.assertEqual(sum(bool(layout.get("faq")) for layout in layouts), 2)
        self.assertEqual(
            sum(len((layout.get("faq") or {}).get("items") or []) for layout in layouts),
            6,
        )
        self.assertEqual(
            sum(bool(layout.get("referencesDirectory")) for layout in layouts), 1
        )
        self.assertEqual(sum(bool(layout.get("faqDirectory")) for layout in layouts), 2)
        self.assertEqual(
            sum(
                len(page.get("contentLinks") or [])
                for page in pages.values()
                if page.get("structuredLayout")
                and not page["structuredLayout"].get("trainingTabs")
            ),
            270,
        )

    def test_structured_layout_has_a_dedicated_controlled_component(self):
        component = read("src/components/sections/StructuredPageLayoutSection.tsx")
        parent = read("src/components/sections/SubpageView.tsx")

        for marker in [
            "layout: StructuredPageLayout",
            "activeReferenceCategoryId: string",
            "referenceSearchQuery: string",
            "onReferenceCategoryChange",
            "onReferenceSearchQueryChange",
            "onVideo",
            "onImage",
            'className="alu-structured-page"',
        ]:
            with self.subTest(marker=marker):
                self.assertIn(marker, component)

        self.assertNotIn("ContentLink", component)
        self.assertNotIn("contentLinks:", component)

        self.assertIn("<StructuredPageLayoutSection", parent)
        for marker in [
            'className="alu-structured-page"',
            "sl.intro",
            "sl.workflowLinks",
            "sl.stats",
            "sl.faq",
        ]:
            with self.subTest(marker=marker):
                self.assertNotIn(marker, parent)
        self.assertLess(len(parent.splitlines()), 800)


if __name__ == "__main__":
    unittest.main()
