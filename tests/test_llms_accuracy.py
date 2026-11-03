"""Machine-readable discovery links describe their actual destinations."""
from pathlib import Path
import unittest

ROOT = Path(__file__).resolve().parents[1]

class LlmsAccuracyTests(unittest.TestCase):
    def test_each_addon_source_has_its_own_corresponding_page(self):
        text = (ROOT / "src/app/llms.txt/route.ts").read_text(encoding="utf-8")
        self.assertIn("[CDS Eklentileri](https://aluplan.com.tr/solutions/addons)", text)
        self.assertIn("[Allto PythonPart](https://aluplan.com.tr/solutions/pythonpart)", text)
        self.assertIn("[Scalypso](https://aluplan.com.tr/solutions/scalypso)", text)
        self.assertNotIn("CDS Add-On & Allto PythonPart & Scalypso", text)

    def test_training_points_to_existing_resources(self):
        text = (ROOT / "src/app/llms.txt/route.ts").read_text(encoding="utf-8")
        self.assertNotIn("/solutions-v2/training/quick-start", text)
        self.assertNotIn("/solutions-v2/training/individual", text)
        self.assertIn("https://aluplan.com.tr/video-kutuphanesi/quickstart-buildings", text)

if __name__ == "__main__":
    unittest.main()
