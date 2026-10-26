import importlib.util
from pathlib import Path
import unittest

SPEC = importlib.util.spec_from_file_location('content_policy', Path(__file__).resolve().parents[1] / 'scripts/content_policy.py')
policy = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(policy)


class ContentPolicyTests(unittest.TestCase):
    def test_only_approved_contact_trial_sentence_changes_without_mutation(self):
        sentence = "30 gün boyunca Allplan'ı ücretsiz deneyin. Kredi kartı bilgisi gerekmez."
        original = {'/contact': {'bodyNodes': [{'text': sentence}], 'sections': [sentence]},
                    '/other': {'description': sentence}}
        result = policy.apply_approved_content_policy(original)
        self.assertEqual(result['/contact']['bodyNodes'][0]['text'], sentence.replace('30 gün', '14 gün'))
        self.assertEqual(result['/contact']['sections'][0], sentence.replace('30 gün', '14 gün'))
        self.assertEqual(result['/other'], original['/other'])
        self.assertEqual(original['/contact']['sections'][0], sentence)

    def test_unrelated_durations_and_partial_strings_are_preserved(self):
        value = {'/contact': {'description': '30 gün destek; 14 gün eklenti denemesi.'}}
        self.assertEqual(policy.apply_approved_content_policy(value), value)

    def test_generated_contact_uses_approved_trial_duration(self):
        import json
        pages = json.loads((Path(__file__).resolve().parents[1] / 'src/data/pages.json').read_text())
        contact = json.dumps(pages['/contact'], ensure_ascii=False)
        self.assertNotIn(policy.OLD_TRIAL_SENTENCE, contact)
        self.assertIn(policy.CURRENT_TRIAL_SENTENCE, contact)
