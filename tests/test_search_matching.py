import subprocess
import unittest
import json
import ast
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


class SearchMatchingTests(unittest.TestCase):
    def test_page_and_dynamic_content_coverage(self):
        data = ROOT / 'src/data'
        pages = json.loads((data / 'pages.json').read_text())
        index = json.loads((data / 'search-index.json').read_text())
        release = json.loads((data / 'search-release-index.json').read_text())
        extras = json.loads((data / 'search-extra-index.json').read_text())
        by_path = {entry['path']: entry for entry in index}
        release_paths = {entry['path'] for entry in release}
        missing_paths = {'/2027/features', '/products/allplan-max', '/2027/civil', '/products/frilo', '/products/scia', '/2027/allplan-basic', '/2027/allplan-concept', '/2027/allplan-professional', '/2027/allplan-ultimate', '/product-lifecycle', '/kaynaklar', '/egitim-merkezlerimiz', '/kaydedilmis-webinarlar'}
        self.assertTrue(missing_paths <= release_paths)
        self.assertNotIn('/products/allplan-rebar', release_paths)
        self.assertNotIn('/products/allplan-parametric', release_paths)
        self.assertNotIn('/package-overview', by_path)
        self.assertNotIn('Ürün Yaşam Döngüsü', by_path['/faq']['keywords'])
        self.assertIn('Workgroup', by_path['/faq']['keywords'])
        self.assertIn('Gelişmiş Yapı Bileşenleri', by_path['/products/allplan-aec']['keywords'])
        self.assertIn('Paletler', by_path['/video-kutuphanesi/hello-allplan-2024']['keywords'])
        by_release = {entry['path']: entry for entry in release}
        self.assertIn('coğrafi referans', by_release['/2027/features']['keywords'].lower())
        self.assertIn('Worgroup Manager', by_release['/product-lifecycle']['keywords'])
        self.assertIn('FRILO Concept', by_release['/products/frilo']['keywords'])
        extra_text = lambda path: ' '.join(e['keywords'] for e in extras if e['path'] == path)
        self.assertIn('düşük maliyetle teslim etme baskısı', extra_text('/products/sds2-home'))
        self.assertIn('Ürün Ailesindeki Yenilikler', by_path['/products']['keywords'])
        self.assertIn('Georeferans Konumlandırma', extra_text('/products'))
        self.assertNotIn('düşük maliyetle teslim etme baskısı', extra_text('/products/allplan-aec'))
        self.assertEqual(set(by_path), set(pages) - {'/package-overview'})

    def test_base_index_matches_current_structured_and_playlist_data(self):
        data = ROOT / 'src/data'
        pages = json.loads((data / 'pages.json').read_text())
        playlists = json.loads((data / 'playlists.json').read_text())
        index = json.loads((data / 'search-index.json').read_text())
        tree = ast.parse((ROOT / 'scripts/generate_site_data.py').read_text())
        function = next(node for node in tree.body if isinstance(node, ast.FunctionDef) and node.name == 'searchable_text')
        namespace = {}
        exec(compile(ast.Module(body=[function], type_ignores=[]), 'searchable_text', 'exec'), namespace)
        extract = namespace['searchable_text']
        for entry in index:
            page = pages[entry['path']]
            content = extract(page['structuredLayout']) if page.get('structuredLayout') else [*(heading['text'] for heading in page['headings']), *page.get('bodyNodes', []), *extract(page.get('sections'))]
            expected = ' '.join([*content, *extract(playlists.get(page.get('playlistId')))])
            self.assertEqual(entry['keywords'], expected, entry['path'])

    def test_turkish_case_diacritics_and_multiple_words(self):
        code = """
import assert from 'node:assert/strict';
import { searchEntries, mergeSearchIndex } from './src/lib/search.ts';
const entries = [{ path: '/civil', title: 'İnşaat mühendisliği', seoTitle: '', description: 'Köprü tasarımı', keywords: 'Donatı detaylandırma', section: 'Ürünler' }];
for (const query of ['insaat kopru', 'DONATI', '  mühendisliği   KÖPRÜ ']) {
  assert.equal(searchEntries(entries, query).length, 1, query);
}
assert.equal(searchEntries(entries, 'köprü olmayan').length, 0);
assert.equal(searchEntries(entries, '  ').length, 1);
const release = [{...entries[0], path:'/2027/features'}];
const extras = [{path:'/civil', keywords:'legacy', legacyOnly:true}, {path:'/civil', keywords:'yenilik', releaseOnly:true}];
assert.deepEqual(mergeSearchIndex(entries, release, extras, false).map(x => x.path), ['/civil']);
assert.ok(mergeSearchIndex(entries, release, extras, false)[0].keywords.includes('legacy'));
assert.ok(!mergeSearchIndex(entries, release, extras, false)[0].keywords.includes('yenilik'));
assert.ok(mergeSearchIndex(entries, release, extras, true).some(x => x.path === '/2027/features'));
assert.ok(mergeSearchIndex(entries, release, extras, true)[0].keywords.includes('yenilik'));
"""
        subprocess.run(["node", "--input-type=module", "-e", code], cwd=ROOT, check=True, capture_output=True, text=True)

    def test_video_endpoint_collects_titles_and_deduplicates_requests(self):
        code = """
import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';
const source = fs.readFileSync('src/app/api/search-video-sources/route.ts', 'utf8');
const code = ts.transpileModule(source, {compilerOptions:{module:ts.ModuleKind.CommonJS, target:ts.ScriptTarget.ES2022}}).outputText;
let calls = 0;
const modules = {
  '@/lib/video-sources': {VIDEO_SOURCES: {demo: {title:'Demo', description:'Video', channelId:'UC123'}}},
  '@/lib/youtube-feed': {getChannelVideosWithStatus: async () => { calls++; await new Promise(r => setTimeout(r, 5)); return [{title:'Özel video başlığı'}]; }}
};
const mod = {exports:{}};
new Function('require','module','exports',code)((name) => modules[name], mod, mod.exports);
const [one, two] = await Promise.all([mod.exports.GET(), mod.exports.GET()]);
const body = await one.json();
assert.equal(calls, 1);
assert.equal(body.partial, false);
assert.equal(body.entries[0].keywords, 'Özel video başlığı');
assert.equal((await two.json()).entries[0].path, '/video-kutuphanesi/kaynak/demo');
const failing = {exports:{}};
modules['@/lib/youtube-feed'].getChannelVideosWithStatus = async () => null;
new Function('require','module','exports',code)((name) => modules[name], failing, failing.exports);
const partial = await failing.exports.GET();
assert.equal((await partial.json()).partial, true);
assert.equal(partial.headers.get('cache-control'), 'no-store');
"""
        subprocess.run(["node", "--input-type=module", "-e", code], cwd=ROOT, check=True, capture_output=True, text=True)
