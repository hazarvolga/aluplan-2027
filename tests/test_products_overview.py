"""The products overview remains a complete, ordered rendering of its data."""
import json
import subprocess
import unittest
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


class ProductsOverviewTests(unittest.TestCase):
    def test_only_first_product_is_observed_for_entry_motion(self):
        overview = (ROOT / 'src/components/sections/ProductsOverview.tsx').read_text()
        self.assertIn('useFirstVisible()', overview)
        self.assertIn('index === 0 ? ref : undefined', overview)
        self.assertIn('hasAppeared', overview)

    def test_product_entry_animation_is_consumed_after_playback_or_reduced_motion(self):
        hook = (ROOT / 'src/components/sections/useFirstVisible.ts').read_text()
        overview = (ROOT / 'src/components/sections/ProductsOverview.tsx').read_text()
        self.assertIn("matchMedia('(prefers-reduced-motion: reduce)')", hook)
        self.assertIn("addEventListener('change'", hook)
        self.assertIn("removeEventListener('change'", hook)
        self.assertIn('onAnimationEnd={index === 0 ? finish : undefined}', overview)
        css = (ROOT / 'src/components/sections/ProductsOverview.module.css').read_text()
        self.assertIn('min-width: 768px', css)

    def test_innovations_match_source_for_every_package(self):
        actual = json.loads((ROOT / 'src/data/products-innovations.json').read_text())
        self.assertEqual(['basic', 'concept', 'professional', 'ultimate', 'civil', 'precast'], [group['id'] for group in actual])
        self.assertEqual([5, 9, 8, 6, 4, 3], [len(group['items']) for group in actual])
        self.assertEqual('Georeferans Konumlandırma', actual[0]['items'][0]['title'])
        self.assertEqual('Özelleştirilebilir Metraj', actual[-1]['items'][-1]['title'])

    def test_product_tab_actions_have_product_specific_accessible_names(self):
        source = (ROOT / 'src/components/sections/ProductTabs.tsx').read_text()
        self.assertIn('aria-label={`${actionLabel}: ${product.name}`}', source)

    def test_each_product_card_has_only_the_image_action_and_keeps_its_target(self):
        script = r'''
const fs = require('fs'), ts = require('typescript');
const React = require('react'), { renderToStaticMarkup } = require('react-dom/server');
const source = fs.readFileSync('src/components/sections/ProductsOverview.tsx', 'utf8');
const code = ts.transpileModule(source, {compilerOptions: {module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true}}).outputText;
const mod = {exports: {}};
function load(id) {
  if (id === 'react/jsx-runtime') return require(id);
  if (id === 'next/link') return {__esModule: true, default: ({children, ...props}) => React.createElement('a', props, children)};
  if (id === 'next/image') return {__esModule: true, default: ({...props}) => React.createElement('img', props)};
  if (id === './useFirstVisible') return {useFirstVisible: () => ({ref: null, hasAppeared: false, finish: () => {}})};
  if (id.endsWith('.module.css')) return {__esModule: true, default: new Proxy({}, {get: (_, key) => String(key)})};
  throw Error('Unexpected import: ' + id);
}
new Function('require', 'module', 'exports', code)(load, mod, mod.exports);
const page = JSON.parse(fs.readFileSync('src/data/pages.json', 'utf8'))['/products'];
const fallback = {href:'/module-without-image',title:'Görselsiz modül',description:'Açıklama'};
process.stdout.write(JSON.stringify({
  page: renderToStaticMarkup(React.createElement(mod.exports.ProductsOverview, {page})),
  fallback: renderToStaticMarkup(React.createElement(mod.exports.ProductsOverview, {items:[fallback],headingLevel:3})),
}));
'''
        rendered = json.loads(subprocess.run(['node', '-e', script], cwd=ROOT, capture_output=True, text=True, check=True).stdout)

        class Links(HTMLParser):
            def __init__(self):
                super().__init__(); self.links = []; self.current = None
            def handle_starttag(self, tag, attrs):
                attrs = dict(attrs)
                if tag == 'a': self.current = {'href': attrs.get('href'), 'name': attrs.get('aria-label'), 'class': attrs.get('class', ''), 'text': '', 'image': False}
                if tag == 'img' and self.current is not None: self.current['image'] = True
            def handle_endtag(self, tag):
                if tag == 'a' and self.current is not None:
                    self.links.append(self.current); self.current = None
            def handle_data(self, data):
                if self.current is not None: self.current['text'] += data

        parser = Links(); parser.feed(rendered['page'])
        sections = json.loads((ROOT / 'src/data/pages.json').read_text())['/products']['sections']
        products = [section for section in sections if section.get('link') and section.get('image')]
        self.assertEqual(len(products), len(parser.links))
        for link, product in zip(parser.links, products):
            self.assertEqual(product['link']['href'], link['href'])
            self.assertTrue(link['image'])
            self.assertEqual(f"İncele: {product['heading']}", link['name'])
            self.assertEqual(1, link['text'].count('İncele ↗'))
            self.assertNotIn('Detayları Görüntüle', link['text'])

        fallback = Links(); fallback.feed(rendered['fallback'])
        self.assertEqual(1, len(fallback.links))
        link = fallback.links[0]
        self.assertEqual('/module-without-image', link['href'])
        self.assertEqual('İncele: Görselsiz modül', link['name'])
        self.assertFalse(link['image'])
        self.assertIn('noMedia', link['class'].split())
        self.assertIn('Açıklama', link['text'])
        self.assertEqual(1, link['text'].count('İncele ↗'))
        css = (ROOT / 'src/components/sections/ProductsOverview.module.css').read_text()
        self.assertRegex(css, r'\.productLink\.noMedia\s*\{[^}]*grid-template-columns:\s*1fr')

    def test_page_uses_its_own_ordered_content_renderer(self):
        view = (ROOT / 'src/components/sections/SubpageView.tsx').read_text()
        overview = (ROOT / 'src/components/sections/ProductsOverview.tsx').read_text()
        self.assertIn("page.path === '/products'", view)
        self.assertIn('<ProductsOverview page={page}', view)
        self.assertIn('products.map(', overview)

    def test_innovations_are_separately_identified_with_accessible_tabs(self):
        source = (ROOT / 'src/components/sections/ProductsInnovations.tsx').read_text()
        self.assertIn('innovations.map(', source)
        self.assertIn('role="tablist"', source)
        self.assertIn('role="tab"', source)
        self.assertIn('role="tabpanel"', source)
        self.assertIn('aria-selected={index === active}', source)
        self.assertIn('handleStructuredTabKey', source)
        owners = '\n'.join((ROOT / 'src/components/sections' / name).read_text() for name in ('ProductsOverview.tsx', 'SubpageView.tsx'))
        self.assertIn('<ProductsInnovations', owners)
        self.assertIn('name="ProductsInnovations"', owners)

    def test_built_page_contains_all_section_content_and_links_in_order(self):
        html = ROOT / '.next/server/app/products.html'
        if not html.exists():
            self.skipTest('production build output missing')
        from html.parser import HTMLParser
        class Text(HTMLParser):
            def __init__(self):
                super().__init__(); self.parts = []; self.in_main = False; self.hrefs = []
            def handle_starttag(self, tag, attrs):
                if tag == 'main': self.in_main = True
                if self.in_main and tag == 'a': self.hrefs.append(dict(attrs).get('href'))
            def handle_endtag(self, tag):
                if tag == 'main': self.in_main = False
            def handle_data(self, data):
                if self.in_main: self.parts.append(data)
        parser = Text(); parser.feed(html.read_text()); text = ' '.join(parser.parts)
        sections = json.loads((ROOT / 'src/data/pages.json').read_text())['/products']['sections']
        offset = 0
        for section in (section for section in sections if section.get('link') and section.get('image')):
            offset = text.index(section['heading'], offset) + len(section['heading'])
            self.assertIn(section['items'][0], text)
            if section.get('link'): self.assertIn(section['link']['href'], parser.hrefs)
        for item in json.loads((ROOT / 'src/data/products-innovations.json').read_text())[0]['items']:
            self.assertIn(item['title'], text)
            self.assertIn(item['description'], text)
        for href in ['/products/allplan-2026-yenilikler', '/products/allplan-2026', '/solutions/allplan-bulut-hizmetleri']:
            self.assertIn(href, parser.hrefs)
