"""Runtime checks for the site-wide debug overlay controller."""
import json
from pathlib import Path
import subprocess
import unittest

ROOT = Path(__file__).resolve().parents[1]


class DebugOverlayTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        result = subprocess.run(
            ['node', 'tests/debug_overlay_runtime.mjs'], cwd=ROOT,
            check=True, capture_output=True, text=True,
        )
        cls.data = json.loads(result.stdout)

    def test_command_toggles_and_persists(self):
        self.assertEqual(self.data['initial'], {'active': None, 'stored': None})
        self.assertEqual(self.data['enabled'], {'active': '1', 'stored': '1'})
        self.assertEqual(self.data['toggledOff'], {'active': None, 'stored': '0'})
        self.assertEqual(self.data['restored'], {'active': '1', 'stored': '1'})

    def test_storage_events_sync_other_tabs(self):
        self.assertIsNone(self.data['synchronizedOff']['active'])
        self.assertEqual(self.data['synchronizedOn']['active'], '1')
        self.assertEqual(self.data['ignored']['active'], '1')

    def test_wrapper_keeps_children_and_hides_debug_text_from_accessibility_tree(self):
        self.assertTrue(self.data['wrapperChildPreserved'])
        self.assertTrue(self.data['labelHidden'])
        self.assertTrue(self.data['cleanedUp'])


if __name__ == '__main__':
    unittest.main()
