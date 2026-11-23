import re
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent


class TestReleaseNotes2027(unittest.TestCase):
    def test_hero_has_2027_features_and_version_buttons(self):
        hero = (ROOT / 'src/components/sections/HomepageMaxPreviewHero.tsx').read_text(encoding='utf-8')
        self.assertIn('href="/2027/features"', hero)
        self.assertIn('ALLPLAN 2027 Yenilikleri', hero)
        self.assertIn('href="/2027/surum-notlari/2027-0-0"', hero)
        self.assertIn('Allplan 2027-0-0 Yenilikler', hero)

    def test_release_notes_routes_and_data_exist(self):
        data = (ROOT / 'src/data/release-notes-2027.ts').read_text(encoding='utf-8')
        self.assertIn("version: '2027-0-0'", data)
        self.assertIn('Allplan 2027 (28.10.2026)', data)
        self.assertIn('Allplan AI MAX – Yapay zekâ destekli platform', data)
        self.assertIn('Allplan Cowork', data)
        self.assertIn('Project Space', data)
        self.assertNotIn('t3://page', data)

        self.assertTrue((ROOT / 'src/app/2027/surum-notlari/page.tsx').is_file())
        self.assertTrue((ROOT / 'src/app/2027/surum-notlari/[version]/page.tsx').is_file())

    def test_release_notes_media_assets_exist(self):
        data = (ROOT / 'src/data/release-notes-2027.ts').read_text(encoding='utf-8')
        paths = re.findall(r"(?:image|video|poster):\s*'(/assets/[^']+)'", data)
        self.assertGreaterEqual(len(paths), 20)
        for asset_path in paths:
            target = ROOT / 'public' / asset_path.lstrip('/')
            self.assertTrue(target.is_file(), f'Missing media asset: {asset_path}')

    def test_release_notes_routes_registered_in_metadata(self):
        routes = (ROOT / 'src/lib/release-2027-routes.ts').read_text(encoding='utf-8')
        self.assertIn("path: '/2027/surum-notlari'", routes)
        self.assertIn("path: '/2027/surum-notlari/2027-0-0'", routes)


if __name__ == '__main__':
    unittest.main()
