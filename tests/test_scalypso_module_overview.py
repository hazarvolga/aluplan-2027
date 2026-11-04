"""Scalypso module cards keep their source content and navigation."""
import json
import subprocess
import unittest
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
MODULES = [
    ('Converter', 'CONVERTER', '/solutions/scalypso/converter'),
    ('Modeler', 'MODELER', '/solutions/scalypso/modeler'),
    ('Mobile', 'MOBILE', '/solutions/scalypso/mobile'),
    ('Viewer', 'VIEWER', '/solutions/scalypso/viewer'),
    ('Videolar', 'VİDEOLAR', '/solutions/scalypso/videos'),
]
NODE_RENDER = r'''
const fs = require('fs'), ts = require('typescript'), React = require('react');
const {renderToStaticMarkup} = require('react-dom/server');
function load(path) {
  const src = fs.readFileSync(path, 'utf8');
  const code = ts.transpileModule(src, {compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX,esModuleInterop:true}}).outputText;
  const mod = {exports:{}};
  function req(id) {
    if (id === 'react' || id === 'react/jsx-runtime') return require(id);
    if (id === 'next/link') return {__esModule:true,default:({children,...props})=>React.createElement('a',props,children)};
    if (id === 'next/image') return {__esModule:true,default:({fill,priority,...props})=>React.createElement('img',props)};
    if (id.endsWith('.module.css')) return {__esModule:true,default:new Proxy({}, {get:(_, key)=>String(key)})};
    if (id === './DebugComponentLabel') return {DebugComponentLabel:({children})=>children};
    if (id === './useFirstVisible') return {useFirstVisible:()=>({ref:null,hasAppeared:false,finish:()=>{}})};
    if (id === './ProductsOverview') return load('src/components/sections/ProductsOverview.tsx');
    if (id === './SectionHeader') return {SectionHeader:({title})=>React.createElement('h2',null,title)};
    return new Proxy({}, {get:()=>()=>null});
  }
  new Function('require','module','exports',code)(req,mod,mod.exports);
  return mod.exports;
}
const page=JSON.parse(fs.readFileSync('src/data/pages.json','utf8'))['/solutions/scalypso'];
const Component=load('src/components/sections/ScalypsoPageContent.tsx').ScalypsoPageContent;
process.stdout.write(renderToStaticMarkup(React.createElement(Component,{page})));
'''


class PageParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.links = []
        self.current = None
        self.text = []
        self.nav_labels = []

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == 'nav': self.nav_labels.append(attrs.get('aria-label'))
        if tag == 'a': self.current = {'href': attrs.get('href'), 'text': '', 'images': []}
        if tag == 'img' and self.current is not None:
            self.current['images'].append((attrs.get('src'), attrs.get('alt')))

    def handle_endtag(self, tag):
        if tag == 'a' and self.current is not None:
            self.links.append(self.current)
            self.current = None

    def handle_data(self, data):
        self.text.append(data)
        if self.current is not None: self.current['text'] += data


class ScalypsoModuleOverviewTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        html = subprocess.run(['node', '-e', NODE_RENDER], cwd=ROOT, capture_output=True, text=True, check=True).stdout
        cls.parser = PageParser()
        cls.parser.feed(html)
        cls.page = json.loads((ROOT / 'src/data/pages.json').read_text())['/solutions/scalypso']

    def test_scalypso_modules_use_shared_products_overview(self):
        source = (ROOT / 'src/components/sections/ScalypsoPageContent.tsx').read_text()
        self.assertIn('<ProductsOverview', source)
        self.assertIn('name="ProductsOverview"', source)

    def test_module_section_and_all_five_cards_preserve_source_content(self):
        sections = {section['heading']: section for section in self.page['sections']}
        text = ' '.join(self.parser.text)
        self.assertIn('Scalypso Modülleri', text)
        for item in sections['Scalypso Modülleri']['items']:
            self.assertIn(item, text)
        self.assertIn('Scalypso modülleri', self.parser.nav_labels)
        actual = [link for link in self.parser.links if link['href'] in {href for _, _, href in MODULES}]
        self.assertEqual([href for _, _, href in MODULES], [link['href'] for link in actual])
        for link, (name, key, _) in zip(actual, MODULES):
            with self.subTest(module=name):
                section = sections[key]
                self.assertIn(name, link['text'])
                self.assertIn(section['items'][0], link['text'])
                self.assertIn((section['image']['src'], section['image']['alt']), link['images'])


if __name__ == '__main__':
    unittest.main()
