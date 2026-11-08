"""Regression coverage for the translated bridge workflow and metric grids."""
import json
from pathlib import Path
import unittest

ROOT = Path(__file__).resolve().parents[1]
ROUTE = '/solutions/modeling-of-precast-girder-bridges'

class BridgeWorkflowTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.page = json.loads((ROOT / 'src/data/pages.json').read_text())[ROUTE]

    def test_turkish_workflow_retains_all_media(self):
        self.assertEqual(self.page['h1'], 'PREFABRİK KİRİŞLİ KÖPRÜLERİN MODELLENMESİ')
        steps = self.page['structuredLayout']['splitCallouts']
        self.assertEqual(len(steps), 8)
        self.assertEqual([s.get('youtubeId') for s in steps[:7]], [
            '2uFnK6J2GsU', 'dwnGswjBZBg', 'ZRqoMOCb11U', 'LBIEi0bhOeQ',
            'LFTDg95kvH4', 'rqv66ghmUpk', 'oqLafh87vYI',
        ])
        self.assertIn('LandXML', steps[0]['description'])
        self.assertIn('tendonları', steps[7]['description'])
        self.assertEqual(self.page['canonical'], 'https://aluplan.com.tr' + ROUTE)

    def test_metric_grids_have_no_inline_column_override(self):
        for name in ('SubpageView.tsx', 'StructuredPageLayoutSection.tsx'):
            content = (ROOT / 'src/components/sections' / name).read_text()
            self.assertIn("'--hero-metric-columns'", content)
            self.assertNotIn('gridTemplateColumns: `repeat(', content)
        css = (ROOT / 'src/styles/application.css').read_text()
        self.assertIn('grid-template-columns: repeat(var(--hero-metric-columns, 4), minmax(0, 1fr))', css)
        self.assertIn('.alu-hero-metrics,\n  .alu-products-showcase', css)

if __name__ == '__main__':
    unittest.main()
