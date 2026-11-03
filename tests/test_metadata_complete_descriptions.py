import json
from pathlib import Path
import unittest

ROOT = Path(__file__).resolve().parents[1]

class CompleteDescriptionsTests(unittest.TestCase):
    def test_selected_descriptions_are_full_source_sentences(self):
        pages = json.loads((ROOT / 'src/data/pages.json').read_text())
        for route in ('/solutions/cds-addon', '/solutions/allplan-industry', '/products/civil'):
            with self.subTest(route=route):
                desc = pages[route]['description']
                self.assertTrue(desc.endswith('.'))
                self.assertTrue(any(desc in node for node in pages[route]['bodyNodes']))

if __name__ == '__main__': unittest.main()
