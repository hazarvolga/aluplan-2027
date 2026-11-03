from pathlib import Path
import json
import unittest

ROOT = Path(__file__).resolve().parents[1]

class LocalNavigationTests(unittest.TestCase):
    def test_new_home_is_development_only_and_old_home_has_archive(self):
        home = (ROOT / 'src/app/page.tsx').read_text()
        archive = (ROOT / 'src/app/archive/home/page.tsx').read_text()
        self.assertIn("getHomepageVariant() === 'release-2027'", home)
        self.assertIn('<Homepage2027PreviewView />', home)
        self.assertIn('<HomepageView />', archive)
        self.assertIn("process.env.NODE_ENV === 'production'", archive)

    def test_product_links_resolve_to_guarded_local_routes(self):
        data = json.loads((ROOT / 'src/data/homepage-2027-preview.json').read_text())
        links = {p['name']: p['href'] for p in data['productLinks']}
        self.assertEqual(links['ALLPLAN'], '/2027/features')
        self.assertEqual(data['primaryHref'], links['ALLPLAN'])
        self.assertEqual(links['FRILO'], '/products/frilo')
        self.assertEqual(links['ALLPLAN Civil'], '/2027/civil')
        for route in ('products/frilo', '2027/civil', 'products/allplan-max', '2027/features'):
            source = (ROOT / f'src/app/{route}/page.tsx').read_text()
            self.assertIn("!isReleaseContentEnabled()", source)

if __name__ == '__main__': unittest.main()
