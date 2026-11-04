"""The building-design catalog uses shared cards without losing catalog data."""
import json
import os
import subprocess
import unittest
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
NODE_RENDER = r'''
const fs = require('fs'), ts = require('typescript'), React = require('react');
const {renderToStaticMarkup} = require('react-dom/server');
function load(path) {
  const src=fs.readFileSync(path,'utf8');
  const code=ts.transpileModule(src,{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX,esModuleInterop:true}}).outputText;
  const mod={exports:{}};
  function req(id) {
    if (id==='react' || id==='react/jsx-runtime') return require(id);
    if (id==='next/link') return {__esModule:true,default:({children,...props})=>React.createElement('a',props,children)};
    if (id==='next/image') return {__esModule:true,default:({fill,priority,...props})=>React.createElement('img',props)};
    if (id.endsWith('.module.css')) return {__esModule:true,default:new Proxy({}, {get:(_,k)=>String(k)})};
    if (id==='./DebugComponentLabel') return {DebugComponentLabel:({name,children})=>React.createElement('div',{'data-debug-name':name},children)};
    if (id==='./useFirstVisible') return {useFirstVisible:()=>({ref:null,hasAppeared:false,finish:()=>{}})};
    if (id==='./SectionHeader') return {SectionHeader:({title,id})=>React.createElement('h2',{id},title)};
    if (id.startsWith('./')) return load('src/components/sections/'+id.slice(2)+'.tsx');
    throw new Error('Unexpected import '+id);
  }
  new Function('require','module','exports',code)(req,mod,mod.exports); return mod.exports;
}
const directory=JSON.parse(fs.readFileSync('src/data/navigation.json','utf8')).solutionDirectory;
if (process.env.TEST_EXTERNAL_BUILDING_CARD === '1') {
  directory.groups[0].catalogItems[0] = {...directory.groups[0].catalogItems[0], href:'https://example.org/building', external:true};
}
const Component=load('src/components/sections/SolutionCatalogSection.tsx').SolutionCatalogSection;
process.stdout.write(renderToStaticMarkup(React.createElement(Component,{directory})));
'''


class CatalogParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.groups = {i: {'links': [], 'labels': [], 'text': []} for i in range(5)}
        self.group = None
        self.current = None
        self.page_text = []

    def handle_starttag(self, tag, attributes):
        attrs = dict(attributes)
        if tag == 'section' and attrs.get('aria-labelledby', '').startswith('solution-group-'):
            self.group = int(attrs['aria-labelledby'].removeprefix('solution-group-'))
        if self.group is None: return
        if attrs.get('data-debug-name'): self.groups[self.group]['labels'].append(attrs['data-debug-name'])
        if tag == 'a': self.current = {'href': attrs.get('href'), 'text': '', 'images': [], 'target': attrs.get('target'), 'rel': attrs.get('rel')}
        if tag == 'img' and self.current is not None:
            self.current['images'].append((attrs.get('src'), attrs.get('alt')))

    def handle_endtag(self, tag):
        if self.group is None: return
        if tag == 'a' and self.current is not None:
            self.groups[self.group]['links'].append(self.current)
            self.current = None
        if tag == 'section': self.group = None

    def handle_data(self, data):
        self.page_text.append(data)
        if self.group is None: return
        self.groups[self.group]['text'].append(data)
        if self.current is not None: self.current['text'] += data


class SolutionCatalogProductsOverviewTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        result = subprocess.run(['node','-e',NODE_RENDER],cwd=ROOT,capture_output=True,text=True,check=True)
        cls.parser = CatalogParser()
        cls.parser.feed(result.stdout)
        cls.directory = json.loads((ROOT/'src/data/navigation.json').read_text())['solutionDirectory']

    def test_only_building_group_uses_products_overview_label(self):
        self.assertIn('ProductsOverview', self.parser.groups[0]['labels'])
        for group in range(1,5):
            self.assertNotIn('ProductsOverview', self.parser.groups[group]['labels'])

    def test_building_external_card_retains_safe_new_tab_semantics(self):
        result = subprocess.run(['node','-e',NODE_RENDER],cwd=ROOT,capture_output=True,text=True,check=True,
                                env={**os.environ, 'TEST_EXTERNAL_BUILDING_CARD': '1'})
        parser = CatalogParser()
        parser.feed(result.stdout)
        first = parser.groups[0]['links'][0]
        self.assertEqual(first['href'], 'https://example.org/building')
        self.assertEqual(first['target'], '_blank')
        self.assertEqual(first['rel'], 'noopener noreferrer')

    def test_all_groups_preserve_ordered_names_descriptions_images_and_destinations(self):
        for value in self.directory['catalogIntro'].values():
            self.assertIn(value, ' '.join(self.parser.page_text))
        for index, group in enumerate(self.directory['groups']):
            actual = self.parser.groups[index]
            with self.subTest(group=group['title']):
                self.assertIn(group['title'], ' '.join(actual['text']))
                self.assertEqual([i['href'] for i in group['catalogItems']], [a['href'] for a in actual['links']])
                for item, link in zip(group['catalogItems'], actual['links']):
                    self.assertIn(item['title'], link['text'])
                    self.assertIn(item['description'], link['text'])
                    self.assertIn((item['image']['src'], item['image']['alt']), link['images'])
                    if item['external']:
                        self.assertEqual(link['target'], '_blank')
                        self.assertEqual(link['rel'], 'noopener noreferrer')

if __name__ == '__main__': unittest.main()
