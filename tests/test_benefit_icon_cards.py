"""The shared benefits card group keeps package content and variant behaviour."""
from html.parser import HTMLParser
from pathlib import Path
import json
import re
import subprocess
import unittest

ROOT = Path(__file__).resolve().parents[1]
NODE_RENDER = r'''
const fs=require('fs'), vm=require('vm'), ts=require('typescript');
const React=require('react'), {renderToStaticMarkup}=require('react-dom/server');
function load(path) {
  const source=fs.readFileSync(path,'utf8');
  const code=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX}}).outputText;
  const mod={exports:{}};
  function req(id) {
    if(id==='react'||id==='react/jsx-runtime') return require(id);
    if(id==='@/components/ui/AluIcon') return {AluIcon:({name})=>React.createElement('svg',{'data-icon':name,'aria-hidden':'true'})};
    if(id.endsWith('.module.css')) return new Proxy({}, {get:(_,key)=>String(key)});
    if(id==='./DebugComponentLabel') return {DebugComponentLabel:({name,children})=>React.createElement('div',{'data-debug-label':name},children)};
    if(id==='./SectionHeader') return {SectionHeader:({title})=>React.createElement('h2',null,title)};
    if(id.startsWith('./')) return load('src/components/sections/'+id.slice(2)+'.tsx');
    throw Error('Unexpected import: '+id);
  }
  vm.runInThisContext('(function(exports,require,module){'+code+'})',{filename:path})(mod.exports,req,mod);
  return mod.exports;
}
const page=JSON.parse(fs.readFileSync('src/data/pages.json','utf8'))['/products/allplan-ultimate'];
const {BenefitsSection}=load('src/components/sections/BenefitsSection.tsx');
const benefits=page.structuredLayout.benefits;
const category={title:'Category',items:[{title:'Category title',subtitle:'Category subtitle',iconSrc:'/icon.png',description:'First • Second'}]};
const categoryWithIcon={...category,items:category.items.map(item=>({...item,iconName:'boxes'}))};
process.stdout.write(JSON.stringify({benefits,default:renderToStaticMarkup(React.createElement(BenefitsSection,{benefits})),category:renderToStaticMarkup(React.createElement(BenefitsSection,{benefits:category,variant:'category-list'})),categoryWithIcon:renderToStaticMarkup(React.createElement(BenefitsSection,{benefits:categoryWithIcon,variant:'category-list'})),empty:renderToStaticMarkup(React.createElement(BenefitsSection,{benefits:{title:'Empty',items:[]}}))}));
'''

class CardsParser(HTMLParser):
    def __init__(self):
        super().__init__(); self.cards=[]; self.current=None; self.labels=[]; self.classes=[]
    def handle_starttag(self,tag,attrs):
        attrs=dict(attrs)
        if attrs.get('data-debug-label'): self.labels.append(attrs['data-debug-label'])
        self.classes.extend(attrs.get('class','').split())
        if tag=='article': self.current={'text':'','images':[]}; self.cards.append(self.current)
        if tag=='img' and self.current is not None: self.current['images'].append((attrs.get('src'),attrs.get('alt')))
    def handle_data(self,text):
        if self.current is not None: self.current['text']+=text
    def handle_endtag(self,tag):
        if tag=='article': self.current=None

class BenefitIconCardsTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        result=subprocess.run(['node','-e',NODE_RENDER],cwd=ROOT,capture_output=True,text=True,check=True)
        cls.render=json.loads(result.stdout)

    def parse(self,key):
        p=CardsParser(); p.feed(self.render[key]); return p

    def test_ultimate_content_icons_and_order_are_preserved(self):
        p=self.parse('default'); items=self.render['benefits']['items']
        self.assertEqual(len(p.cards),len(items)); self.assertIn('alu-benefits-grid--cols-4',p.classes)
        for card,item in zip(p.cards,items):
            self.assertIn(item['title'],card['text']); self.assertIn(item['description'],card['text'])
            if item.get('subtitle'): self.assertIn(item['subtitle'],card['text'])
            self.assertEqual(card['images'],[(item['iconSrc'],'')])

    def test_category_list_variant_preserves_list_and_hides_icons(self):
        p=self.parse('category'); self.assertEqual(len(p.cards),1)
        self.assertIn('Category subtitle',p.cards[0]['text']); self.assertIn('First',p.cards[0]['text']); self.assertIn('Second',p.cards[0]['text'])
        self.assertEqual(p.cards[0]['images'],[]); self.assertIn('alu-benefits-grid--cols-3',p.classes)

    def test_card_group_has_its_own_debug_label(self):
        p=self.parse('default'); self.assertIn('BenefitIconCards',p.labels)

    def test_category_can_render_a_library_icon_without_replacing_content(self):
        html=self.render['categoryWithIcon']
        self.assertIn('data-icon="boxes"',html)
        self.assertIn('aria-hidden="true"',html)
        self.assertIn('First',html); self.assertIn('Second',html)

    def test_sds2_categories_all_have_distinct_library_icons(self):
        page=json.loads((ROOT / 'src/data/pages.json').read_text(encoding='utf-8'))['/products/sds2-home']
        titles=[item['title'] for item in page['structuredLayout']['benefits']['items']]
        source=(ROOT / 'src/components/sections/StructuredPageLayoutSection.tsx').read_text(encoding='utf-8')
        mapping=source.split('const SDS2_CATEGORY_ICONS:',1)[1].split('};',1)[0]
        icons=re.findall(r":\s*'([a-z-]+)'", mapping)
        self.assertEqual(len(titles),5); self.assertEqual(len(icons),len(titles)); self.assertEqual(len(set(icons)),len(titles))
        for title in titles:
            self.assertRegex(mapping,rf"(?:'{re.escape(title)}'|\b{re.escape(title)})\s*:")

if __name__=='__main__': unittest.main()
