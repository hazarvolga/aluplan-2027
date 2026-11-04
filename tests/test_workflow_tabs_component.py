"""Workflow tabs retain their accessible relationships and content across the split."""
from html.parser import HTMLParser
from pathlib import Path
import json
import subprocess
import unittest

ROOT = Path(__file__).resolve().parents[1]
RENDER = r'''
const fs=require('fs'),ts=require('typescript'),React=require('react');
const {renderToStaticMarkup}=require('react-dom/server');
function load(path){
 const js=ts.transpileModule(fs.readFileSync(path,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX,esModuleInterop:true}}).outputText;
 const mod={exports:{}};
 function req(id){
  if(id==='react'||id==='react/jsx-runtime')return require(id);
  if(id==='@/components/ui/AluIcon')return {AluIcon:()=>null};
  if(id==='./DebugComponentLabel')return {DebugComponentLabel:({name,children})=>React.createElement('div',{'data-debug-label':name},children)};
  if(id==='./structured-tab-key')return {handleStructuredTabKey:()=>{}};
  if(id==='./SectionHeader')return {SectionHeader:({title})=>React.createElement('h2',null,title)};
  if(id==='./WorkFlowTabs')return load('src/components/sections/WorkFlowTabs.tsx');
  if(id.endsWith('.module.css'))return {__esModule:true,default:{}};
  throw Error('Unexpected import: '+id);
 }
 new Function('require','module','exports',js)(req,mod,mod.exports);return mod.exports;
}
const Component=load('src/components/sections/WorkflowSection.tsx').WorkflowSection;
const pages=JSON.parse(fs.readFileSync('src/data/pages.json','utf8'));
const result={};
for(const path of ['/products/allplan-aec','/products/allplan-bimplus','/solutions/architecture']){
 const data=pages[path].structuredLayout.workflowTabs;
 result[path]=renderToStaticMarkup(React.createElement(Component,{content:data,onVideo:()=>{},onImage:()=>{}}));
}
process.stdout.write(JSON.stringify(result));
'''

class Parser(HTMLParser):
    def __init__(self):
        super().__init__(); self.labels=[]; self.headings=[]; self.tabs=[]; self.panels=[]; self.buttons=[]; self.text=[]; self.images=[]
    def handle_starttag(self, tag, attrs):
        a=dict(attrs)
        if a.get('data-debug-label'): self.labels.append(a['data-debug-label'])
        if tag in ('h2','h3'): self.headings.append(a)
        if a.get('role')=='tab': self.tabs.append(a)
        if a.get('role')=='tabpanel': self.panels.append(a)
        if a.get('role')=='button' or tag=='button': self.buttons.append(a)
        if tag=='img': self.images.append(a)
    def handle_data(self,data): self.text.append(data)

class WorkflowTabsComponentTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.pages=json.loads((ROOT/'src/data/pages.json').read_text())
        cls.html=json.loads(subprocess.run(['node','-e',RENDER],cwd=ROOT,text=True,capture_output=True,check=True).stdout)

    def test_all_pages_preserve_heading_first_category_and_relationships(self):
        for route,html in self.html.items():
            with self.subTest(route=route):
                data=self.pages[route]['structuredLayout']['workflowTabs']; first=data['categories'][0]
                parser=Parser(); parser.feed(html); visible=' '.join(parser.text)
                self.assertIn(data['title'],visible)
                self.assertIn('WorkFlowTabs',parser.labels)
                category_tabs=parser.tabs[:len(data['categories'])]
                item_tabs=parser.tabs[len(data['categories']):]
                self.assertEqual(len(category_tabs),len(data['categories']))
                self.assertEqual(len(item_tabs),len(first['items']))
                for category in data['categories']: self.assertIn(category['label'],visible)
                for item in first['items']: self.assertIn(item['title'],visible)
                self.assertEqual(category_tabs[0]['aria-selected'],'true')
                self.assertEqual(item_tabs[0]['aria-selected'],'true')
                for tab in category_tabs: self.assertEqual(tab['aria-controls'],'workflow-category-panel')
                for tab in item_tabs: self.assertEqual(tab['aria-controls'],'workflow-item-panel')
                panels={p['id']:p for p in parser.panels}
                self.assertEqual(panels['workflow-category-panel']['aria-labelledby'],category_tabs[0]['id'])
                self.assertEqual(panels['workflow-item-panel']['aria-labelledby'],item_tabs[0]['id'])
                first_item=first['items'][0]
                self.assertIn(first_item['description'],visible)
                if first_item.get('imageSrc'):
                    self.assertTrue(any(image.get('src')==first_item['imageSrc'] and image.get('alt')==first_item['title'] for image in parser.images))

    def test_category_tabs_align_left_only_within_workflow_tabs(self):
        component=ROOT/'src/components/sections/WorkFlowTabs.tsx'
        css=ROOT/'src/components/sections/WorkFlowTabs.module.css'
        self.assertTrue(component.exists(), 'WorkFlowTabs bileşeni eksik')
        self.assertTrue(css.exists(), 'WorkFlowTabs stil modülü eksik')
        self.assertIn('styles.tabs',component.read_text())
        self.assertRegex(css.read_text(), r'\.tabs\s+:global\(\.alu-wf-cats\)\s*\{\s*justify-content:\s*flex-start\s*;')
        faq=(ROOT/'src/components/sections/FAQSection.tsx').read_text()
        self.assertIn('className="alu-wf-cats"',faq)
        self.assertNotIn('styles.tabs',faq)

    def test_keyboard_and_media_handlers_remain_in_reusable_component(self):
        path=ROOT/'src/components/sections/WorkFlowTabs.tsx'
        if not path.exists(): self.fail('WorkFlowTabs bileşeni eksik')
        source=path.read_text()
        self.assertGreaterEqual(source.count('handleStructuredTabKey('),2)
        self.assertIn('onVideo({',source)
        self.assertIn('onImage({',source)
        self.assertIn("e.key === 'Enter' || e.key === ' '",source)
        self.assertIn('tabIndex={isCatActive ? 0 : -1}',source)
        self.assertIn('tabIndex={isSubActive ? 0 : -1}',source)

if __name__=='__main__': unittest.main()
