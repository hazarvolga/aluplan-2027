"""Critical web fonts are preloaded so the first paint uses them and text does not reflow
(the font swap was the measured cause of CLS 0.12 on product/solution pages)."""

from pathlib import Path
import unittest


ROOT = Path(__file__).resolve().parents[1]
CRITICAL = (
    "/assets/fonts/Manrope-400_800-normal-latin.woff2",
    "/assets/fonts/Manrope-400_800-normal-latin-ext.woff2",
    "/assets/fonts/IBMPlexSans-400-normal-latin.woff2",
    "/assets/fonts/IBMPlexSans-400-normal-latin-ext.woff2",
)


class FontLoadingTests(unittest.TestCase):
    def test_root_layout_preloads_critical_fonts(self):
        layout = (ROOT / "src/app/layout.tsx").read_text(encoding="utf-8")
        self.assertIn("preload(", layout)
        for href in CRITICAL:
            with self.subTest(font=href):
                self.assertIn(href, layout)
                self.assertTrue((ROOT / "public" / href.lstrip("/")).exists())

    def test_preload_is_crossorigin_woff2(self):
        layout = (ROOT / "src/app/layout.tsx").read_text(encoding="utf-8")
        self.assertIn("as: 'font'", layout)
        self.assertIn("type: 'font/woff2'", layout)
        self.assertIn("crossOrigin: 'anonymous'", layout)


if __name__ == "__main__":
    unittest.main()
