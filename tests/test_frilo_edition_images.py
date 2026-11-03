"""FRILO edition cards display the ten approved manufacturer shop images."""
from pathlib import Path
import unittest

ROOT = Path(__file__).resolve().parents[1]
SLUGS = ('frilo-concept', 'frilo-professional-concrete', 'frilo-professional-steel',
         'frilo-professional-timber', 'frilo-ultimate', 'frilo-geotechnics-concept',
         'frilo-geotechnics-professional-pit', 'frilo-geotechnics-professional-retaining',
         'frilo-geotechnics-ultimate', 'frilo-geotechnics-soil-mechanics')

class EditionImageTests(unittest.TestCase):
    def test_all_images_are_present_and_optimized(self):
        for slug in SLUGS:
            with self.subTest(slug=slug):
                image = ROOT / f'public/assets/previews/frilo/editions/{slug}.jpg'
                self.assertTrue(image.is_file())
                self.assertLessEqual(image.stat().st_size, 450_000)
                self.assertEqual(image.read_bytes()[:3], b'\xff\xd8\xff')

    def test_both_bands_use_images_and_cards_render_them(self):
        page = (ROOT / 'src/app/products/frilo/page.tsx').read_text()
        cards = (ROOT / 'src/components/sections/EditionCards.tsx').read_text()
        self.assertIn('image: friloEditionImage(edition.title)', page)
        self.assertIn('image: friloEditionImage(edition.name)', page)
        self.assertIn('variant === \'cards\' && edition.image', cards)
        self.assertIn('alt={edition.image.alt}', cards)

    def test_card_images_have_responsive_fixed_aspect_ratio(self):
        css = (ROOT / 'src/components/sections/EditionCards.module.css').read_text()
        rule = css.split('.cardImage{', 1)[1].split('}', 1)[0]
        self.assertIn('height:auto', rule)
        self.assertIn('aspect-ratio:16/9', rule)

    def test_built_page_renders_ten_distinct_images(self):
        html = ROOT / '.next/server/app/products/frilo.html'
        if not html.is_file():
            self.skipTest('build output missing')
        page = html.read_text()
        for slug in SLUGS:
            with self.subTest(slug=slug):
                self.assertTrue(f'/assets/previews/frilo/editions/{slug}.jpg' in page, slug)
