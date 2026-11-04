"""Shared heading semantics and the nested Scalypso requirements heading."""
from html.parser import HTMLParser
from pathlib import Path
import json
import subprocess
import unittest

ROOT = Path(__file__).resolve().parents[1]
NODE_RENDER = r'''
const fs = require('fs'), vm = require('vm'), ts = require('typescript');
const React = require('react'), {renderToStaticMarkup} = require('react-dom/server');
function load(path) {
  const source = fs.readFileSync(path, 'utf8');
  const code = ts.transpileModule(source, {compilerOptions: {module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX}}).outputText;
  const module = {exports: {}};
  function req(id) {
    if (id === './DebugComponentLabel') return {DebugComponentLabel: ({children}) => children};
    if (id === 'react/jsx-runtime' || id === 'react') return require(id);
    if (id === 'next/link') return {__esModule: true, default: ({children, ...props}) => React.createElement('a', props, children)};
    if (id === 'next/image') return {__esModule: true, default: ({fill, ...props}) => React.createElement('img', props)};
    if (id === '@/components/ui/AluIcon') return {AluIcon: () => null};
    if (id.endsWith('.module.css')) return new Proxy({}, {get: (_, key) => String(key)});
    if (id === './HeroBottomLine') return {HeroBottomLine: () => null};
    if (id === './SolutionOverviewCards') return {SolutionOverviewCards: () => null};
    if (id === './CompactSpecList') return {CompactSpecList: () => null};
    if (id.startsWith('./')) return load('src/components/sections/' + id.slice(2) + '.tsx');
    throw Error('Unexpected import: ' + id);
  }
  vm.runInThisContext('(function(exports, require, module){'+code+'})', {filename:path})(module.exports, req, module);
  return module.exports;
}
const {SectionHeader} = load('src/components/sections/SectionHeader.tsx');
const {ScalypsoPageContent} = load('src/components/sections/ScalypsoPageContent.tsx');
const page = JSON.parse(fs.readFileSync('src/data/pages.json', 'utf8'))['/solutions/scalypso'];
const render = (props) => renderToStaticMarkup(React.createElement(SectionHeader, props));
process.stdout.write(JSON.stringify({
  default: render({title:'Varsayılan'}),
  h1: render({as:'h1',title:'Sayfa'}),
  h3: render({as:'h3',title:'Gereksinimler',id:'requirements'}),
  page: renderToStaticMarkup(React.createElement(ScalypsoPageContent,{page})),
}));
'''

class HeadingParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.stack = []
        self.headings = []
        self.current = None

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag in ('h1', 'h2', 'h3'):
            self.current = {'tag': tag, 'class': attrs.get('class'), 'id': attrs.get('id'),
                            'parent_class': self.stack[-1][1].get('class') if self.stack else None, 'text': ''}
        if tag not in ('img', 'br', 'hr', 'input', 'meta', 'link', 'source'):
            self.stack.append((tag, attrs))

    def handle_data(self, data):
        if self.current is not None:
            self.current['text'] += data

    def handle_endtag(self, tag):
        if self.current is not None and tag == self.current['tag']:
            self.headings.append(self.current)
            self.current = None
        if self.stack and self.stack[-1][0] == tag:
            self.stack.pop()

class CompactSectionHeaderTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        result = subprocess.run(['node', '-e', NODE_RENDER], cwd=ROOT, capture_output=True, text=True, check=True)
        cls.markup = json.loads(result.stdout)

    def headings(self, key):
        parser = HeadingParser()
        parser.feed(self.markup[key])
        return parser.headings

    def test_heading_levels_preserve_existing_defaults_and_compact_h3(self):
        self.assertEqual((self.headings('default')[0]['tag'], self.headings('default')[0]['class']), ('h2', 'alu-h2'))
        self.assertEqual((self.headings('h1')[0]['tag'], self.headings('h1')[0]['class']), ('h1', 'alu-h1'))
        compact = self.headings('h3')[0]
        self.assertEqual((compact['tag'], compact['class'], compact['id']), ('h3', 'alu-h3', 'requirements'))
        self.assertEqual(compact['parent_class'], 'alu-section-header')

    def test_scalypso_requirements_is_a_shared_nested_heading(self):
        headings = self.headings('page')
        requirements = [item for item in headings if item['text'] == 'Gereksinimler']
        self.assertEqual(len(requirements), 1)
        self.assertEqual((requirements[0]['tag'], requirements[0]['class'], requirements[0]['parent_class']),
                         ('h3', 'alu-h3', 'alu-section-header'))
        cad = next(item for item in headings if item['text'] == 'Desteklenen CAD Yazılımları')
        scanners = next(item for item in headings if item['text'] == 'Desteklenen Tarayıcılar')
        self.assertEqual(scanners['tag'], 'h2')
        self.assertEqual((cad['tag'], cad['class'], cad['parent_class']),
                         ('h3', 'alu-h3', 'alu-section-header'))
        self.assertLess(headings.index(scanners), headings.index(cad))
        self.assertLess(headings.index(cad), headings.index(requirements[0]))

if __name__ == '__main__':
    unittest.main()
