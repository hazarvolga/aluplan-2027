"""Source-faithful coverage for the four confirmed S05 extraction gaps."""
import importlib.util
from pathlib import Path
import re
import unittest

ROOT = Path(__file__).resolve().parents[1]
SPEC = importlib.util.spec_from_file_location('s05_extractor', ROOT / 'scripts/extract_structured_pages.py')
extractor = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(extractor)


class StructuredContentParityTests(unittest.TestCase):
    def test_cloud_variants_retain_all_source_cards_and_video_ids(self):
        variants = extractor._load_cloud_services()
        self.assertEqual(len(variants['default']), 9)
        self.assertEqual(len(variants['civil']), 9)
        self.assertEqual({x['youtubeId'] for x in variants['default'] if x['youtubeId']},
                         {'7xzpEhLQhEI', 't4axrE0TWO4', 'u4GZUL7WdQU'})
        self.assertEqual({x['youtubeId'] for x in variants['civil'] if x['youtubeId']},
                         {'7xzpEhLQhEI', 'u4GZUL7WdQU', 'ldc4IjJDlwc'})
        self.assertFalse(any(x['title'] == 'Tasarım Kontrolü' for x in variants['civil']))

    def test_every_training_category_text_feature_and_destination_is_preserved(self):
        result = extractor.parse_training_page()['trainingTabs']['tabs']
        source = (extractor.EV_DIR / 'app/solutions-v2/training/page.tsx').read_text()
        objects = extractor.split_top_level_objects(extractor.find_const_array(source, 'trainingCategories'))
        self.assertEqual(len(result), 6)
        for actual, original in zip(result, objects):
            self.assertEqual(actual['key'], extractor.get_prop_str(original, 'value'))
            self.assertEqual(actual['title'], extractor.get_prop_str(original, 'title'))
            self.assertEqual(actual['paragraphs'], [extractor.get_prop_str(original, 'description')])
            self.assertEqual(actual['features'], extractor.split_top_level_strings(
                extractor.extract_balanced_block(original, original.index('features:'))))
            target = ('https://forms.office.com/r/hXhnKAG912'
                      if extractor.get_prop_str(original, 'action') == 'modal'
                      else extractor.get_prop_str(original, 'link'))
            self.assertEqual(actual['href'], target)
            if actual['imageSrc']:
                self.assertTrue((ROOT / 'public' / actual['imageSrc'].lstrip('/')).is_file())

    def test_innovation_intro_contains_complete_source_paragraphs(self):
        source = (extractor.EV_DIR / 'app/products/allplan-2026-yenilikler/page.tsx').read_text()
        actual = extractor.parse_allplan_2026_yenilikler()['intro']['paragraphs']
        for text in actual:
            self.assertIn(text, re.sub(r'\s+', ' ', source))
        self.assertEqual(len(actual), 2)
        self.assertIn('Bu yeni sürümler;', actual[0])
        self.assertTrue(actual[1].endswith('güvence altına alır.'))

    def test_bimflex_intro_retains_complete_partnership_statement(self):
        actual = extractor.parse_bimflex_page()['intro']['paragraphs']
        source = (extractor.EV_DIR / 'app/solutions/bimflex/page.tsx').read_text()
        self.assertEqual(len(actual), 1)
        self.assertIn(actual[0], re.sub(r'\s+', ' ', source))
        self.assertIn('satış ortaklığı kapsamında Aluplan tarafından da kullanıcılara sunulabilecektir.', actual[0])

    def test_both_inline_video_galleries_retain_source_titles_and_video_ids(self):
        cases = [
            ('geometry-tools', extractor.parse_cds_geometry_tools, 17),
            ('steel-components', extractor.parse_cds_steel_components, 26),
        ]
        for slug, parse, count in cases:
            with self.subTest(slug=slug):
                source = (extractor.EV_DIR / f'app/solutions/addons/{slug}/ClientPage.tsx').read_text()
                block = source[source.index('<MasonryVideoGrid'):]
                originals = re.findall(r'titleTR:\s*"([^"]+)".*?videoUrl:\s*"https://www.youtube.com/embed/([^"]+)"', block)
                gallery = next(x for x in parse()['extraGrids'] if x['title'] == 'Video Galerisi')
                self.assertEqual(len(gallery['items']), count)
                self.assertEqual([(x['title'], x['youtubeId']) for x in gallery['items']], originals)
