"""The products overview remains a complete, ordered rendering of its data."""
import json
import unittest
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

    def test_product_cards_keep_source_action_label_visible(self):
        source = (ROOT / 'src/components/sections/ProductsOverview.tsx').read_text()
        self.assertIn('{section.link!.label}', source)

    def test_page_uses_its_own_ordered_content_renderer(self):
        view = (ROOT / 'src/components/sections/SubpageView.tsx').read_text()
        overview = (ROOT / 'src/components/sections/ProductsOverview.tsx').read_text()
        self.assertIn("page.path === '/products'", view)
        self.assertIn('<ProductsOverview page={page}', view)
        self.assertIn('products.map(', overview)
        self.assertIn('innovations.map(', overview)
        self.assertIn('aria-label={`İncele: ${section.heading} — ${section.link!.label}`}', overview)
        self.assertIn('role="tablist"', overview)

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
