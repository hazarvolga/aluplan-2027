"""Runtime theme contract: role accents belong to tokens, never content records."""
import json
from pathlib import Path
import unittest

ROOT = Path(__file__).resolve().parents[1]


class ThemeContractTests(unittest.TestCase):
    def test_role_accents_exist_in_every_theme_mode(self):
        tokens = json.loads((ROOT / 'design-system/tokens/tokens.json').read_text())
        roles = ['architect', 'engineer', 'fabricator']
        for theme in tokens['$meta']['themes']:
            for mode in tokens['$meta']['modes']:
                for role in roles:
                    reference = tokens['themes'][theme]['modes'][mode]['role'][role]['$value']
                    self.assertTrue(reference.startswith('{primitive.'))
                    value = tokens
                    for key in reference[1:-1].split('.'):
                        value = value[key]
                    self.assertIn('$value', value)

    def test_homepage_only_selects_role_tokens(self):
        component = (ROOT / 'src/components/sections/DisciplineWorkflowSection.tsx').read_text()
        for role in ['architect', 'engineer', 'fabricator']:
            self.assertIn('var(--role-' + role + ')', component)
        for color in ['#3B82F6', '#10B981', '#F59E0B']:
            self.assertNotIn(color, component)
