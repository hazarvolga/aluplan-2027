"""The shared solution-style group preserves every industry category and link."""
import json
from html.parser import HTMLParser
from pathlib import Path
import subprocess
import unittest

ROOT = Path(__file__).resolve().parents[1]
RENDER = r'''
const fs = require('fs'), vm = require('vm'), ts = require('typescript');
const React = require('react'), {renderToStaticMarkup} = require('react-dom/server');
function load(path) {
  const source = fs.readFileSync(path, 'utf8');
  const code = ts.transpileModule(source, {compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX}}).outputText;
  const m = {exports:{}};
  function req(id) {
    if (id === './DebugComponentLabel') return {DebugComponentLabel: ({children}) => children};
    if (id === 'react/jsx-runtime' || id === 'react') return require(id);
    if (id === '@/components/ui/AluIcon') return {AluIcon:()=>null};
    if (id === 'next/link') return {__esModule:true,default:({children,...props})=>React.createElement('a',props,children)};
    if (id.endsWith('.module.css')) return new Proxy({}, {get:(_,key)=>String(key)});
    if (id.startsWith('./')) return load('src/components/sections/'+id.slice(2)+'.tsx');
    throw new Error('Unexpected import: '+id);
  }
  vm.runInThisContext('(function(exports,require,module){'+code+'})',{filename:path})(m.exports,req,m);
  return m.exports;
}
const page=JSON.parse(fs.readFileSync('src/data/pages.json','utf8'))['/solutions/allplan-industry'];
const grid=page.structuredLayout.contentBlocks.find(block=>block.sourceId==='industry-explore').content;
const section=load('src/components/sections/LinkGroupGridSection.tsx');
process.stdout.write(renderToStaticMarkup(React.createElement(section.LinkGroupGridSection,{grid})));
'''

class Content(HTMLParser):
    def __init__(self):
        super().__init__(); self.links=[]; self.images=[]; self.text=[]; self.articles=[]
    def handle_starttag(self, tag, attrs):
        attrs=dict(attrs)
        if tag=='a': self.links.append(attrs.get('href'))
        if tag=='img': self.images.append((attrs.get('src'),attrs.get('alt')))
        if tag=='article': self.articles.append(attrs.get('data-source-id'))
    def handle_data(self, text): self.text.append(text)

class IndustryLinkGroupTests(unittest.TestCase):
    def test_three_groups_keep_every_image_and_destination(self):
        pages=json.loads((ROOT/'src/data/pages.json').read_text())
        grid=next(b['content'] for b in pages['/solutions/allplan-industry']['structuredLayout']['contentBlocks'] if b['sourceId']=='industry-explore')
        html=subprocess.run(['node','-e',RENDER],cwd=ROOT,text=True,capture_output=True,check=True).stdout
        result=Content(); result.feed(html)
        self.assertEqual(result.articles,[item['sourceId'] for item in grid['items']])
        self.assertEqual(result.images,[(item['imageSrc'],item['title']) for item in grid['items']])
        self.assertEqual(result.links,[link['href'] for item in grid['items'] for link in item['links']])
        for item in grid['items']:
            self.assertIn(item['title'],result.text)
            for link in item['links']: self.assertIn(link['text'],result.text)
        self.assertIn(grid['title'],result.text)
        self.assertIn(grid['subtitle'],result.text)

if __name__=='__main__': unittest.main()
