"""next/image serves AVIF first (WebP fallback): the hero background is the LCP element and
AVIF is typically 20-30% smaller than WebP at the same visual quality."""

from pathlib import Path
import unittest


ROOT = Path(__file__).resolve().parents[1]


class ImageFormatTests(unittest.TestCase):
    def test_next_image_prefers_avif_then_webp(self):
        config = (ROOT / "next.config.mjs").read_text(encoding="utf-8")
        self.assertIn("formats: ['image/avif', 'image/webp']", config)


if __name__ == "__main__":
    unittest.main()
