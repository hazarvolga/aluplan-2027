"""Shared workflow ribbon keeps page links and safety attributes."""
from html.parser import HTMLParser
import json
import re
from pathlib import Path
import subprocess
import unittest

ROOT = Path(__file__).resolve().parents[1]
RENDER = r'''
const fs=require('fs'),ts=require('typescript'),React=require('react');
const {renderToStaticMarkup}=require('react-dom/server');
function load(path){
 const code=ts.transpileModule(fs.readFileSync(path,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX,esModuleInterop:true}}).outputText;
 const mod={exports:{}};
 function req(id){
  if(id==='react'||id==='react/jsx-runtime')return require(id);
  if(id==='next/link')return {__esModule:true,default:({children,...props})=>React.createElement('a',props,children)};
  if(id==='@/components/ui/AluIcon')return {AluIcon:({name})=>React.createElement('i',{'data-icon':name})};
  if(id==='@/data/sds2-2027-features')return {sds2Features2027:{}};
  if(id==='@/lib/grid-groups')return {gridGroupFor:()=>null};
  if(id==='./DebugComponentLabel')return {DebugComponentLabel:({name,children})=>React.createElement('div',{'data-debug-label':name},children)};
  if(id.endsWith('.module.css'))return {__esModule:true,default:new Proxy({},{get:(_,key)=>String(key)})};
  if(id==='./WorkflowRibbon')return load('src/components/sections/WorkflowRibbon.tsx');
  if(id.startsWith('./'))return new Proxy({},{get:()=>()=>null});
  throw Error('Unexpected import: '+id);
 }
 new Function('require','module','exports',code)(req,mod,mod.exports);return mod.exports;
}
const pages=JSON.parse(fs.readFileSync('src/data/pages.json','utf8'));
const component=load('src/components/sections/StructuredPageLayoutSection.tsx').StructuredPageLayoutSection;
const result={};
function render(links){return renderToStaticMarkup(React.createElement(component,{layout:{workflowLinks:links},pagePath:'/test',activeReferenceCategoryId:'',referenceSearchQuery:'',onReferenceCategoryChange:()=>{},onReferenceSearchQueryChange:()=>{},onVideo:()=>{},onImage:()=>{}}));}
for(const [path,page] of Object.entries(pages)){
 const links=page.structuredLayout?.workflowLinks;
 if(links?.length)result[path]=render(links);
}
result.empty=render([]);
result.synthetic=render([{text:'Dış bağlantı Şİ',href:'https://example.com/docs',external:true,accentKey:'package'},{text:'İç sayfa',href:'/products/civil',accentKey:'engineer'}]);
process.stdout.write(JSON.stringify(result));
'''

class RibbonParser(HTMLParser):
    def __init__(self):
        super().__init__(); self.labels=[]; self.regions=[]; self.links=[]; self.current=None
    def handle_starttag(self, tag, attrs):
        attrs=dict(attrs)
        if attrs.get('data-debug-label'): self.labels.append(attrs['data-debug-label'])
        if tag=='section': self.regions.append(attrs.get('aria-label'))
        if tag=='a': self.current={'attrs':attrs,'text':'','has_dot':False,'icon':None}
        if self.current is not None and 'alu-workflow-pill__dot' in attrs.get('class','').split(): self.current['has_dot']=True
        if self.current is not None and attrs.get('data-icon'): self.current['icon']=attrs['data-icon']
    def handle_data(self,data):
        if self.current is not None:self.current['text']+=data
    def handle_endtag(self,tag):
        if tag=='a' and self.current is not None:
            self.links.append(self.current);self.current=None

class WorkflowRibbonTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.pages=json.loads((ROOT/'src/data/pages.json').read_text())
        cls.output=json.loads(subprocess.run(['node','-e',RENDER],cwd=ROOT,text=True,capture_output=True,check=True).stdout)

    def test_all_existing_ribbons_keep_order_text_urls_and_show_diagonal_arrows(self):
        expected={p:v['structuredLayout']['workflowLinks'] for p,v in self.pages.items() if (v.get('structuredLayout') or {}).get('workflowLinks')}
        self.assertEqual(len(expected),6)
        for route,items in expected.items():
            with self.subTest(route=route):
                parser=RibbonParser();parser.feed(self.output[route])
                self.assertIn('WorkflowRibbon',parser.labels)
                self.assertEqual(parser.regions,['Hızlı İş Akışı Bağlantıları'])
                self.assertEqual(len(parser.links),len(items))
                for actual,item in zip(parser.links,items):
                    self.assertEqual(actual['text'].strip(),item['text'])
                    self.assertEqual(actual['attrs']['href'],item['href'])
                    self.assertFalse(actual['has_dot'])
                    self.assertEqual(actual['icon'],'arrow-up-right')
                    if item.get('external'):
                        self.assertEqual(actual['attrs'].get('target'),'_blank')
                        self.assertEqual(set(actual['attrs'].get('rel','').split()),{'noopener','noreferrer'})
                    else:self.assertNotIn('target',actual['attrs'])

    def test_empty_and_synthetic_external_link(self):
        empty=RibbonParser();empty.feed(self.output['empty'])
        self.assertEqual(empty.links,[]);self.assertNotIn('WorkflowRibbon',empty.labels)
        parser=RibbonParser();parser.feed(self.output['synthetic'])
        self.assertEqual([link['text'].strip() for link in parser.links],['Dış bağlantı Şİ','İç sayfa'])
        self.assertTrue(all(not link['has_dot'] and link['icon']=='arrow-up-right' for link in parser.links))
        self.assertEqual(parser.links[0]['attrs']['target'],'_blank')
        self.assertEqual(set(parser.links[0]['attrs']['rel'].split()),{'noopener','noreferrer'})
        self.assertNotIn('target',parser.links[1]['attrs'])

    def test_ribbon_is_flush_and_does_not_lift_or_shadow_on_hover(self):
        css=(ROOT/'src/styles/application.css').read_text()
        def rule(selector):
            match=re.search(rf'(?m)^{re.escape(selector)}\s*\{{([^{{}}]*)\}}',css)
            self.assertIsNotNone(match,selector)
            return match.group(1)
        self.assertRegex(rule('.alu-workflow-ribbon-section'),r'(?m)^\s*padding-block\s*:\s*0\s*;')
        self.assertRegex(rule('.alu-workflow-ribbon'),r'(?m)^\s*gap\s*:\s*0\s*;')
        hover=rule('.alu-workflow-pill:hover')
        self.assertNotRegex(hover,r'(?m)^\s*(?:transform|box-shadow)\s*:\s*(?!none\s*;)')
        self.assertNotRegex(rule('.alu-workflow-pill'),r'(?m)^\s*outline\s*:\s*(?:none|0)\s*;')

if __name__=='__main__': unittest.main()
