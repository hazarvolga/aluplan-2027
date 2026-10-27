"""The app stylesheet must follow canonical DS sources in an explicit cascade order."""
import importlib.util
from pathlib import Path
import re
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

    def test_application_literal_color_is_rejected_before_output_changes(self):
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp)
            self.fixture(root)
            styles.sync_styles(root)
            output = root / styles.OUTPUT
            before = output.read_bytes()
            (root / 'src/styles/application.css').write_text('.card { color: #123456; }')
            with self.assertRaisesRegex(ValueError, 'Raw application color'):
                styles.sync_styles(root)
            self.assertEqual(output.read_bytes(), before)

    def test_application_color_guard_ignores_comments_but_rejects_color_functions(self):
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp)
            self.fixture(root)
            app = root / 'src/styles/application.css'
            app.write_text('/* Historical #123456 */ .card {color:var(--text-primary)}')
            styles.sync_styles(root)
            for raw in ['rgba(0,0,0,.5)', 'hsl(0 0% 0%)', 'oklch(0.2 0 0)', 'color(display-p3 1 0 0)', 'hwb(0 0% 0%)', 'RGB(12, 23, 34)', 'HSL(0 0% 0%)']:
                app.write_text('.card {background:' + raw + '}')
                with self.subTest(raw=raw), self.assertRaises(ValueError):
                    styles.sync_styles(root)

    def test_application_design_metrics_must_use_tokens(self):
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp)
            self.fixture(root)
            app = root / 'src/styles/application.css'
            app.write_text('.card {padding:0;gap:var(--space-stack-sm);font-size:var(--type-body-size)}')
            styles.sync_styles(root)
            before = (root / styles.OUTPUT).read_bytes()
            for declaration in ['font-size:1rem', 'font-weight:700', 'line-height:1.5',
                                'letter-spacing:.02em', 'border-radius:4px', 'gap:clamp(1rem,2vw,3rem)',
                                'padding:0 1rem', 'transition:opacity 200ms ease']:
                app.write_text('.card {' + declaration + ';}')
                with self.subTest(declaration=declaration), self.assertRaisesRegex(ValueError, 'Raw application metric'):
                    styles.sync_styles(root)
                self.assertEqual((root / styles.OUTPUT).read_bytes(), before)

    def test_application_border_widths_must_use_tokens(self):
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp)
            self.fixture(root)
            app = root / 'src/styles/application.css'
            app.write_text('.card {border:var(--border-width-default) solid var(--border-default)}')
            styles.sync_styles(root)
            before = (root / styles.OUTPUT).read_bytes()
            for declaration in ['border:1px solid var(--border-default)',
                                'border:solid 1px var(--border-default)',
                                'border-top:2px solid var(--border-strong)',
                                'border-left:3px solid var(--accent-border)',
                                'border-left:4px solid var(--accent-border)',
                                'border-block-start:solid 2px var(--border-strong)',
                                'border-inline-start-width:1px',
                                'border-image-width:1px',
                                'border-image-width:10%',
                                'border:1pt solid var(--border-default)']:
                app.write_text('.card {' + declaration + '}')
                with self.subTest(declaration=declaration), self.assertRaisesRegex(ValueError, 'Raw application metric'):
                    styles.sync_styles(root)
                self.assertEqual((root / styles.OUTPUT).read_bytes(), before)

    def test_fixed_application_offsets_must_use_tokens(self):
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp)
            self.fixture(root)
            app = root / 'src/styles/application.css'
            app.write_text('.card {top:var(--space-inset-sm);left:42%;bottom:0}')
            styles.sync_styles(root)
            before = (root / styles.OUTPUT).read_bytes()
            for selector, declaration in [('.card', 'top:1rem'), ('.card', 'right:-0.75rem'),
                                          ('.card', 'bottom:12px'), ('.card', 'left:2em'),
                                          ('.other', 'left:-9999px')]:
                app.write_text(selector + ' {' + declaration + '}')
                with self.subTest(declaration=declaration), self.assertRaisesRegex(ValueError, 'Raw application metric'):
                    styles.sync_styles(root)
                self.assertEqual((root / styles.OUTPUT).read_bytes(), before)
            app.write_text('.alu-skip-link {left:-9999px}')
            self.assertTrue(styles.sync_styles(root))

    def test_application_margins_must_use_tokens(self):
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp)
            self.fixture(root)
            app = root / 'src/styles/application.css'
            app.write_text('.card {margin:0 auto;margin-top:var(--space-application-jsx-tight);margin-left:10%}')
            styles.sync_styles(root)
            before = (root / styles.OUTPUT).read_bytes()
            for declaration in ['margin:0 0 0.75rem 0', 'margin-top:1rem', 'margin-inline-start:-4px']:
                app.write_text('.card {' + declaration + '}')
                with self.subTest(declaration=declaration), self.assertRaisesRegex(ValueError, 'Raw application metric'):
                    styles.sync_styles(root)
                self.assertEqual((root / styles.OUTPUT).read_bytes(), before)

    def test_tokenized_component_sizes_have_no_raw_dimensions(self):
        source = (ROOT / 'src/styles/application.css').read_text(encoding='utf-8')
        expected = {
            '.alu-video-play-badge': {'width': '--size-application-video-play-badge', 'height': '--size-application-video-play-badge'},
            '.alu-partner-strip__item': {'height': '--size-application-partner-item-height'},
            '.alu-partner-strip__item img': {'max-height': '--size-application-partner-logo-max-height'},
            '.alu-hero-monitor__dot': {'width': '--size-application-monitor-dot', 'height': '--size-application-monitor-dot'},
            '.alu-pathway-tab__icon': {'width': '--size-application-pathway-tab-icon', 'height': '--size-application-pathway-tab-icon'},
            '.alu-pathway-tab__dot': {'width': '--size-application-pathway-dot', 'height': '--size-application-pathway-dot'},
            '.alu-pathway-feature-card__icon': {'width': '--size-application-pathway-feature-icon', 'height': '--size-application-pathway-feature-icon'},
            '.alu-product-card__pulse-dot': {'width': '--size-application-product-pulse-dot', 'height': '--size-application-product-pulse-dot'},
            '.alu-product-card__box-icon': {'width': '--size-application-product-box-icon', 'height': '--size-application-product-box-icon'},
            '.alu-product-card__status-dot': {'width': '--size-application-product-status-dot', 'height': '--size-application-product-status-dot'},
            '.alu-benefit-icon': {'width': '--size-application-benefit-icon', 'height': '--size-application-benefit-icon'},
            '.alu-benefit-icon img': {'width': '--size-application-benefit-image', 'height': '--size-application-benefit-image'},
            '.alu-yt-banner__badge-icon': {'width': '--size-application-youtube-banner-icon', 'height': '--size-application-youtube-banner-icon'},
            '.alu-yt-card__icon': {'width': '--size-application-youtube-card-icon', 'height': '--size-application-youtube-card-icon'},
            '.alu-playlist-item__playing-badge': {'width': '--size-application-playlist-playing-badge', 'height': '--size-application-playlist-playing-badge'},
            '.alu-intro-split__bullet-icon': {'width': '--size-application-bullet-icon', 'height': '--size-application-bullet-icon'},
            '.alu-workflow-pill__dot': {'width': '--size-application-workflow-dot', 'height': '--size-application-workflow-dot'},
            '.alu-media-card__play-circle': {'width': '--size-application-media-play-control', 'height': '--size-application-media-play-control'},
            '.alu-media-card__zoom-hint': {'width': '--size-application-media-zoom-control', 'height': '--size-application-media-zoom-control'},
            '.alu-video-modal__close': {'width': '--size-application-modal-close-control', 'height': '--size-application-modal-close-control'},
            '.alu-ref-card__icon': {'width': '--size-application-reference-icon', 'height': '--size-application-reference-icon'},
            '.alu-about-value-item__icon': {'width': '--size-application-about-value-icon', 'height': '--size-application-about-value-icon'},
        }
        for selector, properties in expected.items():
            match = re.search(re.escape(selector) + r'\s*\{([^{}]*)\}', source)
            self.assertIsNotNone(match, selector)
            declarations = match.group(1)
            with self.subTest(selector=selector):
                for prop, token in properties.items():
                    self.assertRegex(declarations, rf'(?m)^\s*{re.escape(prop)}\s*:\s*var\({re.escape(token)}\);')
