"""The app stylesheet must follow canonical DS sources in an explicit cascade order."""
import importlib.util
from pathlib import Path
import tempfile
import unittest

ROOT = Path(__file__).resolve().parents[1]
SPEC = importlib.util.spec_from_file_location('app_styles', ROOT / 'scripts/build_app_styles.py')
styles = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(styles)


class AppStylesTests(unittest.TestCase):
    def fixture(self, root):
        for index, (label, relative) in enumerate(styles.SOURCES):
            target = root / relative
            target.parent.mkdir(parents=True, exist_ok=True)
            content = f'.source-{index} {{ color: var(--text-primary); }}\n'
            if label == 'fonts.css':
                content = "@font-face { src: url('../assets/fonts/test.woff2'); }\n"
            target.write_text(content)

    def test_canonical_sources_and_app_rules_keep_the_explicit_cascade_order(self):
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp)
            self.fixture(root)
            result = styles.build_styles(root)
            offsets = [result.index(f'/* === {label} === */') for label, _ in styles.SOURCES]
            self.assertEqual(offsets, sorted(offsets))
            self.assertIn("url('/assets/fonts/test.woff2')", result)
            self.assertNotIn('../assets/fonts/', result)
            self.assertNotIn('@import', result)

    def test_repeated_generation_is_identical_and_check_is_read_only(self):
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp)
            self.fixture(root)
            styles.sync_styles(root)
            output = root / styles.OUTPUT
            first = output.read_bytes()
            stamp = output.stat().st_mtime_ns
            styles.sync_styles(root)
            self.assertEqual(output.read_bytes(), first)
            self.assertEqual(output.stat().st_mtime_ns, stamp)
            self.assertTrue(styles.sync_styles(root, check=True))
            self.assertEqual(output.stat().st_mtime_ns, stamp)

    def test_canonical_token_change_is_detected_then_flows_into_app(self):
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp)
            self.fixture(root)
            styles.sync_styles(root)
            output = root / styles.OUTPUT
            original = output.read_bytes()
            source = root / 'design-system/tokens/semantic.css'
            source.write_text(':root { --surface-page: #222222; }\n')
            self.assertFalse(styles.sync_styles(root, check=True))
            self.assertEqual(output.read_bytes(), original)
            styles.sync_styles(root)
            self.assertIn('--surface-page: #222222', output.read_text())

    def test_missing_source_fails_before_replacing_existing_output(self):
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp)
            self.fixture(root)
            styles.sync_styles(root)
            output = root / styles.OUTPUT
            original = output.read_bytes()
            (root / styles.SOURCES[-1][1]).unlink()
            with self.assertRaises(FileNotFoundError):
                styles.sync_styles(root)
            self.assertEqual(output.read_bytes(), original)

    def test_repository_generated_styles_have_no_drift(self):
        self.assertTrue(styles.sync_styles(ROOT, check=True))
