"""Package introductions use one reusable component without losing source content."""
from html.parser import HTMLParser
import json
from pathlib import Path
import subprocess
import unittest

ROOT = Path(__file__).resolve().parents[1]
ROUTES = ['/products/allplan-basic', '/products/allplan-concept', '/products/allplan-professional', '/products/allplan-ultimate', '/products/civil']
OTHER = '/products/sds2-home'

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
  if(id==='@/components/ui/ConsentEmbed')return {ConsentEmbed:({src,title})=>React.createElement('iframe',{src,title})};
  if(id==='@/data/sds2-2027-features')return {sds2Features2027:{}};
  if(id==='@/lib/grid-groups')return {gridGroupFor:()=>null};
  if(id==='./DebugComponentLabel')return {DebugComponentLabel:({name,children})=>React.createElement('div',{'data-debug-label':name},children)};
  if(id.endsWith('.module.css'))return {__esModule:true,default:new Proxy({},{get:(_,key)=>String(key)})};
  if(id==='./StructuredIntroSection')return load('src/components/sections/StructuredIntroSection.tsx');
  if(id.startsWith('./'))return new Proxy({},{get:()=>()=>null});
  throw Error('Unexpected import: '+id);
 }
 new Function('require','module','exports',code)(req,mod,mod.exports);return mod.exports;
}
const pages=JSON.parse(fs.readFileSync('src/data/pages.json','utf8'));
const component=load('src/components/sections/StructuredPageLayoutSection.tsx').StructuredPageLayoutSection;
const routes=['/products/allplan-basic','/products/allplan-concept','/products/allplan-professional','/products/allplan-ultimate','/products/civil','/products/sds2-home'];
const result={};
for(const pagePath of routes){
 const layout={intro:pages[pagePath].structuredLayout.intro};
 result[pagePath]=renderToStaticMarkup(React.createElement(component,{layout,pagePath,activeReferenceCategoryId:'',referenceSearchQuery:'',onReferenceCategoryChange:()=>{},onReferenceSearchQueryChange:()=>{},onVideo:()=>{},onImage:()=>{}}));
}
process.stdout.write(JSON.stringify(result));
'''

class IntroParser(HTMLParser):
    def __init__(self):
        super().__init__(); self.text=[]; self.labels=[]; self.lists=[]; self.iframes=[]; self.icons=[]
    def handle_starttag(self, tag, attrs):
        attrs=dict(attrs)
        if attrs.get('data-debug-label'): self.labels.append(attrs['data-debug-label'])
        if tag=='ul': self.lists.append(attrs.get('class','').split())
        if tag=='iframe': self.iframes.append((attrs.get('src'),attrs.get('title')))
        if attrs.get('data-icon'): self.icons.append(attrs['data-icon'])
    def handle_data(self, data): self.text.append(data)

class StructuredIntroSectionTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.pages=json.loads((ROOT/'src/data/pages.json').read_text())
        cls.html=json.loads(subprocess.run(['node','-e',RENDER],cwd=ROOT,text=True,capture_output=True,check=True).stdout)

    def test_package_content_and_shared_debug_boundary(self):
        for route in ROUTES:
            with self.subTest(route=route):
                intro=self.pages[route]['structuredLayout']['intro']
                parser=IntroParser(); parser.feed(self.html[route]); text=' '.join(parser.text)
                self.assertIn('StructuredIntroSection',parser.labels)
                self.assertIn(intro['title'],text)
                for paragraph in intro.get('paragraphs',[]): self.assertIn(paragraph,text)
                for bullet in intro['bullets']: self.assertIn(bullet,text)
                self.assertEqual(parser.icons.count('check'),len(intro['bullets']))
                self.assertIn((intro['videoEmbedUrl'],intro['title']),parser.iframes)
                self.assertEqual(len(parser.lists),1)
                self.assertIn('compactBullets',parser.lists[0])

    def test_other_intro_is_not_given_package_style(self):
        parser=IntroParser(); parser.feed(self.html[OTHER])
        self.assertIn('StructuredIntroSection',parser.labels)
        self.assertEqual(len(parser.lists),1)
        self.assertNotIn('compactBullets',parser.lists[0])

    def test_compact_style_removes_circle_and_reduces_size(self):
        css=(ROOT/'src/components/sections/StructuredIntroSection.module.css').read_text()
        self.assertIn('--type-application-small-body-size',css)
        self.assertIn('--type-body-sm-size',css)
        self.assertRegex(css,r'border\s*:\s*(?:0|none)')
        self.assertRegex(css,r'background\s*:\s*transparent')

if __name__=='__main__': unittest.main()
