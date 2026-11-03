"""Repeated controls get distinct accessible names that start with their visible label."""

from pathlib import Path
import unittest


ROOT = Path(__file__).resolve().parents[1]
EXPECTED = {
    "src/components/sections/MediaGridSection.tsx": "aria-label={`${item.ctaText || 'Videoyu İzle'}: ${item.title}`}",
    "src/components/sections/SplitCalloutSection.tsx": "aria-label={`Videoyu İzle: ${callout.title}`}",
    "src/app/2027/compare/page.tsx": "aria-label={`Sürümü incele: ALLPLAN ${e.name}`}",
    "src/app/2027/compare/ComparisonTable.tsx": "aria-label={`Sürümü incele: ALLPLAN ${e.name}`}",
    "src/components/sections/AllplanMaxPreviewPage.tsx": "aria-label={`Demo talep edin: ${text(`3feat.${key}.title`)}`}",
    "src/components/sections/DocumentGroupsSection.tsx": "aria-label={`${downloadLabel}: ${doc.title} (${doc.language})`}",
}


class AccessibleNameTests(unittest.TestCase):
    def test_repeated_controls_name_their_target(self):
        for path, marker in EXPECTED.items():
            with self.subTest(path=path):
                self.assertIn(marker, (ROOT / path).read_text(encoding="utf-8"))

    def test_external_actions_announce_new_tab(self):
        source = (ROOT / "src/components/sections/SectionLinks.tsx").read_text(encoding="utf-8")
        self.assertIn('<span className="alu-visually-hidden"> (yeni sekmede açılır)</span>', source)


if __name__ == "__main__":
    unittest.main()
