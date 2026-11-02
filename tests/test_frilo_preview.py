import pathlib
import unittest

ROOT = pathlib.Path(__file__).resolve().parents[1]

class FriloPreviewContract(unittest.TestCase):
    def test_source_sections_and_preview_isolation(self):
        page = (ROOT / 'src/app/2027/frilo/page.tsx').read_text()
        self.assertIn("!isReleaseContentEnabled()", page)
        self.assertIn("buildRelease2027Metadata('/2027/frilo')", page)
        for anchor in ('frilo-overview', 'frilo-capabilities', 'frilo-stories', 'frilo-faq'):
            self.assertIn(f'id="{anchor}"', page)
        for asset in ('03.jpg', '04.png', '05.png', '06.png', '07.png', '08.jpg', '09.jpg', '10.jpg'):
            self.assertTrue((ROOT / 'public/assets/previews/frilo/source' / asset).is_file(), asset)
        self.assertNotIn('ADD TO CART', page)
        self.assertNotIn('$119', page)
        self.assertIn('friloCapabilities', page)
        self.assertIn('friloFaq', page)

if __name__ == '__main__':
    unittest.main()
