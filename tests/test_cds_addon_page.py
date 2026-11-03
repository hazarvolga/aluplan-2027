"""CDS Add-On redesign preserves the source's visible content and destinations."""
from html.parser import HTMLParser
from pathlib import Path
import json
import subprocess
import unittest

ROOT = Path(__file__).resolve().parents[1]
ROUTE = '/solutions/cds-addon'

# Render actual server components without relying on a running dev server or stale build output.
NODE_RENDER = r'''
const fs = require('fs'), vm = require('vm'), ts = require('typescript');
const React = require('react'), {renderToStaticMarkup} = require('react-dom/server');
function load(path) {
  const src = fs.readFileSync(path, 'utf8');
  const code = ts.transpileModule(src, {compilerOptions: {module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX}}).outputText;
  const m = {exports:{}};
  function req(id) {
    if (id === 'react/jsx-runtime') return require(id);
    if (id === '@/components/ui/AluIcon') return {AluIcon: () => null};
    if (id === 'next/link') return {__esModule: true, default: ({children, ...props}) => React.createElement('a', props, children)};
    if (id.endsWith('.module.css')) return new Proxy({}, {get: (_, key) => String(key)});
    if (id.startsWith('./')) return load('src/components/sections/' + id.slice(2) + '.tsx');
    throw new Error('Unexpected runtime import: ' + id);
  }
  vm.runInThisContext('(function(exports, require, module){'+code+'})', {filename:path})(m.exports, req, m);
  return m.exports;
}
const page = JSON.parse(fs.readFileSync('src/data/pages.json', 'utf8'))['/solutions/cds-addon'];
const component = load('src/components/sections/CdsAddonPageContent.tsx');
process.stdout.write(renderToStaticMarkup(React.createElement(component.CdsAddonPageContent, {page})));
'''

class HtmlInfo(HTMLParser):
    def __init__(self):
        super().__init__()
        self.text = []
        self.hrefs = []
        self.images = []
        self.heading_levels = []

    def handle_starttag(self, tag, attrs):
        attributes = dict(attrs)
        if tag == 'a':
            self.hrefs.append(attributes.get('href'))
        if tag == 'img':
            self.images.append((attributes.get('src'), attributes.get('alt')))
        if tag in ('h1', 'h2', 'h3'):
            self.heading_levels.append(tag)

    def handle_data(self, data):
        self.text.append(data)


class CdsAddonPageTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.pages = json.loads((ROOT / 'src/data/pages.json').read_text(encoding='utf-8'))
        cls.page = cls.pages[ROUTE]
        cls.sections = [section for section in cls.page['sections'] if section.get('link')]
        result = subprocess.run(['node', '-e', NODE_RENDER], cwd=ROOT, capture_output=True, text=True, check=True)
        cls.rendered = HtmlInfo()
        cls.rendered.feed(result.stdout)
        cls.text = ' '.join(cls.rendered.text)

    def test_all_nine_cards_keep_title_text_image_and_destination(self):
        self.assertEqual(len(self.sections), 9)
        for section in self.sections:
            with self.subTest(title=section['heading']):
                self.assertIn(section['heading'], self.text)
                for text in section['items']:
                    if text != section['link']['label']:
                        self.assertIn(text, self.text)
                self.assertIn((section['image']['src'], section['image']['alt']), self.rendered.images)
                self.assertEqual(self.rendered.hrefs.count(section['link']['href']), 1)
        self.assertEqual(self.rendered.hrefs, [section['link']['href'] for section in self.sections])
        self.assertEqual(self.rendered.heading_levels.count('h3'), 9)

    def test_original_intro_copy_remains_visible_without_second_page_h1(self):
        for section in self.page['sections']:
            if section['level'] == 2:
                with self.subTest(title=section['heading']):
                    self.assertIn(section['heading'], self.text)
                    for text in section['items']:
                        self.assertIn(text, self.text)
        self.assertNotIn('h1', self.rendered.heading_levels)

    def test_existing_cds_collection_and_its_destinations_remain_distinct(self):
        collection = self.pages['/solutions/addons']
        self.assertNotEqual(collection['path'], self.page['path'])
        for section in self.sections:
            self.assertIn(section['link']['href'], self.pages)


if __name__ == '__main__':
    unittest.main()
