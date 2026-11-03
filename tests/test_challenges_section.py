"""The challenges band must remain an independent section for every structured solution page."""
from html.parser import HTMLParser
from pathlib import Path
import json
import subprocess
import unittest

ROOT = Path(__file__).resolve().parents[1]
ROUTES = [f'/solutions/{name}' for name in (
    'architecture', 'bridge-design', 'infrastructure', 'mep', 'precast',
    'road-railway', 'site-planning', 'steel', 'structural',
)]
NODE_RENDER = r'''
const fs = require('fs'), vm = require('vm'), ts = require('typescript');
const React = require('react'), {renderToStaticMarkup} = require('react-dom/server');
function load(path) {
  const src = fs.readFileSync(path, 'utf8');
  const code = ts.transpileModule(src, {compilerOptions: {module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX}}).outputText;
  const module = {exports:{}};
  function req(id) {
    if (id === 'react/jsx-runtime' || id === 'react') return require(id);
    if (id === 'next/link') return {__esModule:true, default:({children, ...props})=>React.createElement('a',props,children)};
    if (id === '@/components/ui/AluIcon') return {AluIcon:()=>null};
    if (id === '@/components/ui/ConsentEmbed') return {ConsentEmbed:()=>null};
    if (id === '@/data/sds2-2027-features') return {sds2Features2027:{}};
    if (id === '@/lib/grid-groups') return {gridGroupFor:()=>null};
    if (id === './ChallengesBand' || id === './SectionHeader' || id === './StructuredContentBlocks') return load('src/components/sections/' + id.slice(2) + '.tsx');
    if (id.endsWith('.module.css')) return new Proxy({}, {get:(_, key)=>String(key)});
    if (id.startsWith('./')) return new Proxy({}, {get:()=>()=>null});
    throw Error('Unexpected import: ' + id);
  }
  vm.runInThisContext('(function(exports, require, module){'+code+'})', {filename:path})(module.exports,req,module);
  return module.exports;
}
const pages = JSON.parse(fs.readFileSync('src/data/pages.json', 'utf8'));
const {StructuredPageLayoutSection} = load('src/components/sections/StructuredPageLayoutSection.tsx');
const paths = ['/solutions/architecture','/solutions/bridge-design','/solutions/infrastructure','/solutions/mep','/solutions/precast','/solutions/road-railway','/solutions/site-planning','/solutions/steel','/solutions/structural'];
function render(layout,path){return renderToStaticMarkup(React.createElement(StructuredPageLayoutSection, {layout,pagePath:path,activeReferenceCategoryId:'',referenceSearchQuery:'',onReferenceCategoryChange:()=>{},onReferenceSearchQueryChange:()=>{},onVideo:()=>{},onImage:()=>{}}));}
const output={};
for(const path of paths) output[path]=render(pages[path].structuredLayout,path);
output.industry=render(pages['/solutions/allplan-industry'].structuredLayout,'/solutions/allplan-industry');
output.sds=render(pages['/products/sds2-home'].structuredLayout,'/products/sds2-home');
output.noStats=render({stats:[],challenges:['Birinci zorluk','İkinci zorluk']},'/solutions/example');
output.noChallenges=render({stats:[{value:'1',label:'Metrik',description:'Açıklama'}],challenges:[]},'/solutions/example');
process.stdout.write(JSON.stringify(output));
'''

class SectionParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.sections = []
        self.stack = []
        self.void = {'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr'}

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == 'section':
            self.sections.append({'label':attrs.get('aria-label'), 'text':'', 'classes':[], 'nested':any(t == 'section' for t, _ in self.stack)})
            self.stack.append((tag, len(self.sections)-1))
        elif tag not in self.void:
            self.stack.append((tag, None))
        for _, idx in self.stack:
            if idx is not None and attrs.get('class'):
                self.sections[idx]['classes'] += attrs['class'].split()

    def handle_endtag(self, tag):
        for i in range(len(self.stack)-1,-1,-1):
            if self.stack[i][0] == tag:
                del self.stack[i:]
                break

    def handle_data(self, data):
        for _, idx in self.stack:
            if idx is not None:
                self.sections[idx]['text'] += data

class ChallengesSectionTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.pages = json.loads((ROOT / 'src/data/pages.json').read_text(encoding='utf-8'))
        result = subprocess.run(['node','-e',NODE_RENDER],cwd=ROOT,capture_output=True,text=True,check=True)
        cls.markup = json.loads(result.stdout)

    def parse(self, key):
        parser = SectionParser()
        parser.feed(self.markup[key])
        return parser.sections

    def test_each_source_route_has_one_independent_band_after_metrics_with_all_items(self):
        for route in ROUTES:
            with self.subTest(route=route):
                sections = self.parse(route)
                challenges = [s for s in sections if s['label'] == 'Sektörel Zorluklar']
                metrics = [s for s in sections if s['label'] == 'Performans Göstergeleri']
                self.assertEqual(len(challenges),1)
                self.assertEqual(len(metrics),1)
                self.assertFalse(challenges[0]['nested'])
                self.assertIn('alu-challenges-band', challenges[0]['classes'])
                self.assertLess(sections.index(metrics[0]),sections.index(challenges[0]))
                self.assertNotIn('alu-challenges-band', metrics[0]['classes'])
                self.assertIn('Günümüz Projelerinde Karşılaşılan Temel Zorluklar',challenges[0]['text'])
                for item in self.pages[route]['structuredLayout']['challenges']:
                    self.assertIn(item,challenges[0]['text'])
                    self.assertEqual(challenges[0]['text'].count(item),1)

    def test_existing_industry_and_sds2_bands_are_not_duplicated(self):
        for key in ('industry', 'sds'):
            with self.subTest(page=key):
                self.assertEqual(self.markup[key].count('class="alu-challenges-band"'), 1)

    def test_challenges_render_without_metrics_and_empty_challenges_are_omitted(self):
        without_stats = self.parse('noStats')
        self.assertFalse(any(s['label'] == 'Performans Göstergeleri' for s in without_stats))
        challenges = [s for s in without_stats if s['label'] == 'Sektörel Zorluklar']
        self.assertEqual(len(challenges),1)
        self.assertIn('Birinci zorluk',challenges[0]['text'])
        self.assertIn('İkinci zorluk',challenges[0]['text'])
        without_challenges = self.parse('noChallenges')
        self.assertFalse(any(s['label'] == 'Sektörel Zorluklar' for s in without_challenges))
        self.assertTrue(any(s['label'] == 'Performans Göstergeleri' for s in without_challenges))

if __name__ == '__main__':
    unittest.main()
