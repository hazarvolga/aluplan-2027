"""Every visual used on the 2027 pages has a provenance row in the asset license log."""

from pathlib import Path
import unittest


ROOT = Path(__file__).resolve().parents[1]
LOG = ROOT / "docs/brand/assets-license-log.md"
PROJECT_GENERATED = [
    "public/assets/previews/allplan-civil-2027/civil-hero.jpg",
    "public/assets/previews/frilo/frilo-hero.jpg",
    *(f"public/assets/previews/solutions/{name}-web.jpg" for name in ("building", "infrastructure", "construction", "addons", "other")),
    *(f"public/assets/previews/workflow/{name}-web.jpg" for name in ("architecture", "engineering", "precast")),
    "public/opengraph-image.jpg",
]
MANUFACTURER = [
    *(f"public/assets/previews/scia/capability-{n}.jpg" for n in range(1, 5)),
    *(f"public/assets/previews/scia/story-{n}.jpg" for n in range(1, 7)),
]


def rows() -> list[str]:
    return [line for line in LOG.read_text(encoding="utf-8").splitlines() if line.startswith("| `")]


class AssetLicenseLogTests(unittest.TestCase):
    def test_project_generated_assets_are_logged_as_project_owned(self):
        for path in PROJECT_GENERATED:
            matches = [row for row in rows() if path in row]
            with self.subTest(path=path):
                self.assertTrue(matches, "missing row")
                self.assertIn("Project-generated", matches[0])
                self.assertIn("Owner-confirmed", matches[0])

    def test_manufacturer_assets_are_logged_with_pending_permission(self):
        for path in MANUFACTURER:
            matches = [row for row in rows() if path in row]
            with self.subTest(path=path):
                self.assertTrue(matches, "missing row")
                self.assertIn("Manufacturer image", matches[0])
                self.assertIn("Rights-holder permission not established", matches[0])

    def test_logged_paths_exist(self):
        for path in PROJECT_GENERATED + MANUFACTURER:
            with self.subTest(path=path):
                self.assertTrue((ROOT / path).is_file())


if __name__ == "__main__":
    unittest.main()
