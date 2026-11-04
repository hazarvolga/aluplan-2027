"""Industry package cards preserve their source data in the shared overview."""
import json
import subprocess
import unittest
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
NODE_RENDER = r'''
const fs = require('fs'), ts = require('typescript'), React = require('react');
const {renderToStaticMarkup} = require('react-dom/server');
function load(path) {
  const code = ts.transpileModule(fs.readFileSync(path, 'utf8'), {compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX,esModuleInterop:true}}).outputText;
  const mod = {exports:{}};
  function req(id) {
    if (id === 'react' || id === 'react/jsx-runtime') return require(id);
    if (id === 'next/link') return {__esModule:true,default:({children,...props})=>React.createElement('a',props,children)};
    if (id === 'next/image') return {__esModule:true,default:({fill,priority,...props})=>React.createElement('img',props)};
    if (id.endsWith('.module.css')) return {__esModule:true,default:new Proxy({}, {get:(_, key)=>String(key)})};
    if (id === './DebugComponentLabel') return {DebugComponentLabel:({name,children})=>React.createElement('div',{'data-debug-label':name},children)};
    if (id === './useFirstVisible') return {useFirstVisible:()=>({ref:null,hasAppeared:false,finish:()=>{}})};
    if (id === './MediaGridSection') return {MediaGridSection:({grid})=>React.createElement('div',{'data-media-grid':grid.title})};
    if (id === './SectionHeader') return {SectionHeader:({kicker,title,lead})=>React.createElement('header',null,kicker,React.createElement('h2',null,title),lead)};
    if (id.startsWith('./')) {
      const candidate = 'src/components/sections/' + id.slice(2) + '.tsx';
      if (fs.existsSync(candidate)) return load(candidate);
    }
    return new Proxy({}, {get:()=>()=>null});
  }
  new Function('require','module','exports',code)(req,mod,mod.exports);
  return mod.exports;
}
const page=JSON.parse(fs.readFileSync('src/data/pages.json','utf8'))['/solutions/allplan-industry'];
const block=page.structuredLayout.contentBlocks.find(b=>b.sourceId==='industry-products');
const component=load('src/components/sections/StructuredContentBlocks.tsx').StructuredContentBlocks;
const render=(blocks)=>renderToStaticMarkup(React.createElement(component,{blocks,onVideo:()=>{},onImage:()=>{}}));
const other={...block,sourceId:'another-media-grid',content:{...block.content,title:'Başka medya'}};
const calls=[];
const tree=component({blocks:[block],onVideo:()=>{},onImage:(image)=>calls.push(image)});
const buttons=[];
function visit(node) {
  if (Array.isArray(node)) { node.forEach(visit); return; }
  if (!React.isValidElement(node)) return;
  if (typeof node.type === 'function') { visit(node.type(node.props)); return; }
  if (node.type === 'button' && node.props.onClick) buttons.push(node);
  visit(node.props.children);
}
visit(tree);
buttons.forEach(button=>button.props.onClick());
process.stdout.write(JSON.stringify({industry:render([block]),other:render([other]),zoomCalls:calls}));
'''

class CardParser(HTMLParser):
    def __init__(self):
        super().__init__(); self.articles=[]; self.current=None; self.text=[]; self.labels=[]
    def handle_starttag(self,tag,attrs):
        attrs=dict(attrs)
        if attrs.get('data-debug-label'): self.labels.append(attrs['data-debug-label'])
        if tag=='article': self.current={'class':attrs.get('class',''),'sourceId':attrs.get('data-source-id'),'text':'','images':[],'links':[],'buttons':[]}
        if self.current is not None and tag=='a': self.current['links'].append((attrs.get('href'),attrs.get('aria-label')))
        if self.current is not None and tag=='img': self.current['images'].append((attrs.get('src'),attrs.get('alt')))
        if self.current is not None and tag=='button': self.current['buttons'].append(attrs.get('aria-label'))
    def handle_endtag(self,tag):
        if tag=='article' and self.current is not None: self.articles.append(self.current); self.current=None
    def handle_data(self,data):
        self.text.append(data)
        if self.current is not None: self.current['text']+=data

class IndustryProductsOverviewTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.output=json.loads(subprocess.run(['node','-e',NODE_RENDER],cwd=ROOT,capture_output=True,text=True,check=True).stdout)
        cls.parser=CardParser(); cls.parser.feed(cls.output['industry'])
        page=json.loads((ROOT/'src/data/pages.json').read_text())['/solutions/allplan-industry']
        cls.grid=next(b['content'] for b in page['structuredLayout']['contentBlocks'] if b['sourceId']=='industry-products')

    def test_all_package_data_and_section_copy_are_preserved(self):
        grid=self.grid; text=' '.join(self.parser.text)
        for copy in (grid['kicker'],grid['title'],grid['subtitle']): self.assertIn(copy,text)
        expected=sorted(grid['items'],key=lambda item: item['title']!='ALLPLAN Ultimate')
        self.assertEqual(len(self.parser.articles),len(expected))
        for card,item in zip(self.parser.articles,expected):
            with self.subTest(item=item['title']):
                self.assertIn(item['title'],card['text']); self.assertIn(item['description'],card['text'])
                self.assertIn(item['ctaText'],card['text']); self.assertEqual(card['sourceId'],item['sourceId'])
                self.assertEqual(card['links'],[(item['href'],f"{item['ctaText']}: {item['title']}")])
                self.assertIn((item['imageSrc'],item['title']),card['images'])
                self.assertEqual(card['buttons'],[f"{item['title']} görselini büyüt"])
        self.assertEqual(self.output['zoomCalls'],[{'src':item['imageSrc'],'title':item['title']} for item in expected])

    def test_ultimate_is_featured_as_square_in_shared_overview(self):
        self.assertIn('ProductsOverview',self.parser.labels)
        card=self.parser.articles[0]
        self.assertIn('ALLPLAN Ultimate',card['text'])
        self.assertIn('featured',card['class'])
        self.assertIn('featuredSquare',card['class'])
        css=(ROOT/'src/components/sections/ProductsOverview.module.css').read_text()
        self.assertRegex(css,r'\.featuredSquare\s+\.media\s*\{[^}]*aspect-ratio\s*:\s*1\s*/\s*1')

    def test_other_media_grid_is_not_replaced(self):
        self.assertIn('data-media-grid="Başka medya"',self.output['other'])
        self.assertNotIn('data-debug-label="ProductsOverview"',self.output['other'])

if __name__ == '__main__': unittest.main()
