"""The shared media-card grid preserves Basic's content and interactions."""
import json
import subprocess
import unittest
from html.parser import HTMLParser
from pathlib import Path

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
    if(id==='@/components/ui/AluIcon')return {AluIcon:()=>null};
    if(id==='./DebugComponentLabel')return {DebugComponentLabel:({name,children})=>React.createElement('div',{'data-debug-label':name},children)};
    if(id.endsWith('.module.css'))return {__esModule:true,default:new Proxy({},{get:(_,key)=>String(key)})};
    if(id.startsWith('./')){const file='src/components/sections/'+id.slice(2)+'.tsx'; if(fs.existsSync(file))return load(file);}
    throw Error('Unexpected import: '+id);
  }
  new Function('require','module','exports',code)(req,mod,mod.exports);return mod.exports;
}
const grid=JSON.parse(fs.readFileSync('src/data/pages.json','utf8'))['/products/allplan-basic'].structuredLayout.coreFeatures;
const C=load('src/components/sections/MediaGridSection.tsx').MediaGridSection;
const imageCalls=[],videoCalls=[];
const props={grid,itemKeyPrefix:'basic',onImage:x=>imageCalls.push(x),onVideo:x=>videoCalls.push(x)};
const html=renderToStaticMarkup(React.createElement(C,props));
function visit(node,key){
 if(Array.isArray(node)){node.forEach(child=>visit(child,key));return;}
 if(!React.isValidElement(node))return;
 if(typeof node.type==='function'){visit(node.type(node.props),key);return;}
 if(node.props.role==='button'){
   if(key) node.props.onKeyDown({key,preventDefault:()=>prevented++});
   else if(node.props.onClick)node.props.onClick();
 }
 visit(node.props.children,key);
}
let prevented=0;
visit(C(props));
const clicks={imageCalls:[...imageCalls],videoCalls:[...videoCalls]};
imageCalls.length=0; videoCalls.length=0;
visit(C(props),'Enter');
const enter={imageCalls:[...imageCalls],videoCalls:[...videoCalls],prevented};
imageCalls.length=0; videoCalls.length=0; prevented=0;
visit(C(props),' ');
const space={imageCalls:[...imageCalls],videoCalls:[...videoCalls],prevented};
process.stdout.write(JSON.stringify({html,...clicks,enter,space}));
'''

class Cards(HTMLParser):
    def __init__(self):
        super().__init__(); self.cards=[]; self.current=None; self.labels=[]; self.text=[]
    def handle_starttag(self, tag, attrs):
        attrs=dict(attrs)
        if attrs.get('data-debug-label'): self.labels.append(attrs['data-debug-label'])
        if tag=='article': self.current={'text':'','images':[],'buttons':[],'links':[],'classes':[],'native_buttons':[]}
        if self.current is not None:
            self.current['classes'].extend(attrs.get('class','').split())
            if tag=='img': self.current['images'].append((attrs.get('src'),attrs.get('alt')))
            if attrs.get('role')=='button': self.current['buttons'].append((attrs.get('aria-label'),attrs.get('tabindex')))
            if tag=='button': self.current['native_buttons'].append(attrs.get('aria-label'))
            if tag=='a': self.current['links'].append(attrs.get('href'))
    def handle_endtag(self,tag):
        if tag=='article' and self.current is not None: self.cards.append(self.current); self.current=None
    def handle_data(self,data):
        self.text.append(data)
        if self.current is not None: self.current['text']+=data

class FuncsGridCarsTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.grid=json.loads((ROOT/'src/data/pages.json').read_text())['/products/allplan-basic']['structuredLayout']['coreFeatures']
        cls.result=json.loads(subprocess.run(['node','-e',RENDER],cwd=ROOT,text=True,capture_output=True,check=True).stdout)
        cls.parser=Cards(); cls.parser.feed(cls.result['html'])

    def test_basic_six_cards_and_image_or_video_actions_are_preserved(self):
        self.assertEqual(len(self.parser.cards),len(self.grid['items']))
        self.assertEqual(len(self.parser.cards),6)
        for card,item in zip(self.parser.cards,self.grid['items']):
            with self.subTest(title=item['title']):
                self.assertIn(item['title'],card['text']); self.assertIn(item['description'],card['text'])
                src=item.get('imageSrc') or f"https://img.youtube.com/vi/{item['youtubeId']}/hqdefault.jpg"
                self.assertIn((src,item['title']),card['images'])
                self.assertIn((f"{item['title']} " + ('videosunu pop-up pencerede oynat' if item.get('youtubeId') else 'görselini büyüt'), '0'),card['buttons'])
                if item.get('href'): self.assertIn(item['href'],card['links'])
        self.assertEqual(self.result['videoCalls'],[{'youtubeId':i['youtubeId'],'title':i['title']} for i in self.grid['items'] if i.get('youtubeId')])
        self.assertEqual(self.result['imageCalls'],[{'src':i['imageSrc'],'title':i['title']} for i in self.grid['items'] if i.get('imageSrc') and not i.get('youtubeId')])
        for key in ('enter','space'):
            self.assertEqual(self.result[key]['videoCalls'],self.result['videoCalls'])
            self.assertEqual(self.result[key]['imageCalls'],self.result['imageCalls'])
            self.assertEqual(self.result[key]['prevented'],6)

    def test_video_cards_show_only_one_play_indicator(self):
        for card,item in zip(self.parser.cards,self.grid['items']):
            if not item.get('youtubeId'): continue
            with self.subTest(title=item['title']):
                self.assertEqual(card['classes'].count('alu-media-card__play'),1)
                self.assertNotIn('alu-media-card__video-badge',card['classes'])
                self.assertNotIn('alu-media-card__video-btn',card['classes'])
                self.assertEqual(card['native_buttons'],[])
                self.assertEqual(len(card['buttons']),1)

    def test_grid_has_its_own_debug_label_and_component_boundary(self):
        self.assertIn('FuncsGridCars',self.parser.labels)
        section=(ROOT/'src/components/sections/MediaGridSection.tsx').read_text()
        self.assertIn('<FuncsGridCars',section)

if __name__=='__main__': unittest.main()
