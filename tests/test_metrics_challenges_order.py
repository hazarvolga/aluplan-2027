"""Metrics precede challenges without changing the source content."""
import json
import subprocess
import unittest

from tests.test_challenges_section import NODE_RENDER, ROOT, ROUTES, SectionParser


class MetricsChallengesOrderTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.pages = json.loads((ROOT / 'src/data/pages.json').read_text(encoding='utf-8'))
        cls.markup = json.loads(subprocess.run(
            ['node', '-e', NODE_RENDER], cwd=ROOT, capture_output=True, text=True, check=True
        ).stdout)

    def test_industry_and_nine_solution_pages_put_metrics_first(self):
        for key in [*ROUTES, 'industry']:
            with self.subTest(page=key):
                parser = SectionParser()
                parser.feed(self.markup[key])
                metrics = [i for i, s in enumerate(parser.sections) if s['label'] == 'Performans Göstergeleri']
                challenges = [i for i, s in enumerate(parser.sections) if 'alu-challenges-band' in s['classes']]
                self.assertEqual(len(metrics), 1)
                self.assertEqual(len(challenges), 1)
                self.assertLess(metrics[0], challenges[0])
                path = '/solutions/allplan-industry' if key == 'industry' else key
                for item in self.pages[path]['structuredLayout']['challenges']:
                    self.assertIn(item, parser.sections[challenges[0]]['text'])


if __name__ == '__main__':
    unittest.main()
