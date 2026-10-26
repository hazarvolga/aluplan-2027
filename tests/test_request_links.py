import importlib.util
from pathlib import Path
import unittest

SPEC = importlib.util.spec_from_file_location('request_links', Path(__file__).resolve().parents[1] / 'scripts/request_links.py')
policy = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(policy)


class RequestLinksTests(unittest.TestCase):
    def test_only_retired_demand_url_changes_in_a_fresh_tree(self):
        original = {'contentLinks': [{'href': policy.LEGACY_DEMAND_FORM}],
                    'structuredLayout': {'ctaHref': policy.LEGACY_DEMAND_FORM + '/'},
                    'text': 'Eski hedef: ' + policy.LEGACY_DEMAND_FORM}
        result = policy.normalize_request_links(original)
        self.assertEqual(result['contentLinks'][0]['href'], policy.MAIN_REQUEST_FORM)
        self.assertEqual(result['structuredLayout']['ctaHref'], policy.MAIN_REQUEST_FORM)
        self.assertEqual(original['contentLinks'][0]['href'], policy.LEGACY_DEMAND_FORM)
        self.assertEqual(result['text'], original['text'])

    def test_operational_destinations_are_preserved(self):
        urls = ['https://forms.office.com/r/HSrhvAkYmb',
                'https://www.allplan.com/trial-or-subscription/',
                'https://allplan.net.tr/tr', 'https://teams.microsoft.com/meet/example',
                'mailto:info@aluplan.com.tr', 'tel:+902162258441']
        self.assertEqual(policy.normalize_request_links(urls), urls)

    def test_generated_data_has_no_retired_demand_target(self):
        import json
        root = Path(__file__).resolve().parents[1]
        pages = json.loads((root / 'src/data/pages.json').read_text())
        self.assertNotIn(policy.LEGACY_DEMAND_FORM, json.dumps(pages))
        self.assertIn('https://forms.office.com/r/HSrhvAkYmb', json.dumps(pages))
