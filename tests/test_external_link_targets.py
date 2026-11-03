"""The global YouTube channel uses the link allplan.com publishes; both handle URLs return 404."""

from pathlib import Path
import json
import unittest


ROOT = Path(__file__).resolve().parents[1]
WORKING_CHANNEL = "https://www.youtube.com/c/AllplanInternational"
BROKEN_SOURCE_CHANNEL = "youtube.com/@AllplanInternational"
BROKEN_CHANNEL = "@ALLPLANglobal"


class YoutubeChannelTests(unittest.TestCase):
    def test_generated_data_has_no_broken_channel(self):
        for path in (ROOT / "src/data").glob("*.json"):
            with self.subTest(path=path.name):
                self.assertNotIn(BROKEN_CHANNEL, path.read_text(encoding="utf-8"))

    def test_video_library_global_channel_uses_manufacturer_link(self):
        library = json.loads((ROOT / "src/data/video-library.json").read_text(encoding="utf-8"))
        text = json.dumps(library, ensure_ascii=False)
        self.assertIn(WORKING_CHANNEL, text)
        self.assertNotIn(BROKEN_SOURCE_CHANNEL, text)

    def test_generator_does_not_rewrite_source_channel(self):
        generator = (ROOT / "scripts/generate_site_data.py").read_text(encoding="utf-8")
        self.assertNotIn(BROKEN_CHANNEL, generator)


if __name__ == "__main__":
    unittest.main()
