"""The approved solution-hub URLs preserve content and 301 compatibility."""
import ast
import json
import subprocess
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
MIGRATIONS = {
    '/solutions-v2/building-design': '/cozumler/bina-tasarimi',
    '/solutions-v2/infrastructure': '/cozumler/altyapi-tasarimi',
    '/solutions-v2/construction': '/cozumler/insaat-planlamasi',
    '/solutions-v2/addons': '/eklentiler',
    '/solutions-v2/other': '/cozumler/diger-urunler',
}


def load(path):
    return json.loads((ROOT / path).read_text(encoding='utf-8'))


class SolutionHubMigrationTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.pages = load('src/data/pages.json')
        cls.navigation = load('src/data/navigation.json')
        cls.homepage = load('src/data/homepage.json')
        cls.search = load('src/data/search-index.json')
        output = subprocess.check_output(
            ['node', '-e', "import('./next.config.mjs').then(async m => console.log(JSON.stringify(await m.default.redirects())))"],
            cwd=ROOT, text=True,
        )
        cls.redirects = json.loads(output)

    def test_each_legacy_route_is_a_single_explicit_301(self):
        for old, new in MIGRATIONS.items():
            with self.subTest(old=old):
                matches = [r for r in self.redirects if r['source'] == old]
                self.assertEqual(len(matches), 1)
                self.assertEqual(matches[0]['destination'], new)
                self.assertEqual(matches[0].get('statusCode'), 301)
                self.assertNotIn('permanent', matches[0])
                self.assertFalse(any(r['source'] == new for r in self.redirects))

    def test_hubs_have_new_self_canonical_and_preserved_source_content(self):
        for old, new in MIGRATIONS.items():
            with self.subTest(old=old):
                self.assertFalse(old in self.pages, old)
                page = self.pages[new]
                self.assertEqual(page['path'], new)
                self.assertEqual(page['canonical'], 'https://aluplan.com.tr' + new)
                self.assertTrue(page['title'])
                self.assertTrue(page['description'])
                self.assertTrue(page['sections'])

    def test_directory_homepage_footer_and_search_use_new_routes(self):
        directory = self.navigation['solutionDirectory']['groups']
        self.assertEqual([g['hubPath'] for g in directory], list(MIGRATIONS.values()))
        self.assertEqual(sum(len(g['hubItems']) for g in directory), 21)
        self.assertEqual([g['href'] for g in self.navigation['footer']['solutions']], list(MIGRATIONS.values()))
        homepage_routes = {item['href'] for item in self.homepage['solutions']}
        self.assertTrue(set(MIGRATIONS.values()).issubset(homepage_routes))
        search_routes = {item['path'] for item in self.search}
        self.assertTrue(set(MIGRATIONS.values()).issubset(search_routes))
        self.assertTrue(set(MIGRATIONS).isdisjoint(search_routes))

    def test_ax3000_hub_and_catalog_keep_their_distinct_targets(self):
        group = next(g for g in self.navigation['solutionDirectory']['groups'] if g['hubPath'] == '/eklentiler')
        hub = next(i for i in group['hubItems'] if i['title'] == 'AX3000 MEP')
        catalog = next(i for i in group['catalogItems'] if i['title'] == 'AX3000 MEP')
        self.assertEqual(hub['href'], '/solutions/ax3000')
        self.assertEqual(catalog['href'], '/solutions/ax3000-mekanik-tesisat')
        self.assertTrue(catalog.get('image'))

    def test_generator_route_normalization_is_repeatable_and_preserves_unrelated_paths(self):
        source = (ROOT / 'scripts/generate_site_data.py').read_text(encoding='utf-8')
        tree = ast.parse(source)
        names = {'ROUTE_RENAMES', 'ROUTE_PREFIX_RENAMES', 'SITE_URL_ORIGIN'}
        nodes = [node for node in tree.body if (
            isinstance(node, ast.Assign) and any(isinstance(t, ast.Name) and t.id in names for t in node.targets)
        ) or (isinstance(node, ast.FunctionDef) and node.name in {'rename_route_value', 'rename_routes'})]
        namespace = {}
        exec(compile(ast.fix_missing_locations(ast.Module(body=nodes, type_ignores=[])), '<generator-routes>', 'exec'), namespace)
        rename = namespace['rename_routes']
        for old, new in MIGRATIONS.items():
            with self.subTest(old=old):
                source_data = {old: [old, old + '?ref=1#section', 'https://aluplan.com.tr' + old]}
                expected = {new: [new, new + '?ref=1#section', 'https://aluplan.com.tr' + new]}
                self.assertEqual(rename(source_data), expected)
                self.assertEqual(rename(expected), expected)
                self.assertEqual(rename(old + '/child'), old + '/child')
        self.assertEqual(rename('/solutions/addons/drive-curve'), '/solutions/addons/drive-curve')

    def test_cds_collection_and_nine_children_remain_independent(self):
        self.assertIn('/solutions/addons', self.pages)
        self.assertEqual(len([p for p in self.pages if p.startswith('/solutions/addons/')]), 9)
        self.assertNotEqual(self.pages['/solutions/addons']['path'], self.pages['/eklentiler']['path'])


if __name__ == '__main__':
    unittest.main()
