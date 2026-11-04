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
            if label == 'semantic.css':
                content = ':root { --shadow-application-header: none; --elevation-raised: none; }\n'
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

    def test_preview_design_literals_are_rejected_before_output_changes(self):
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp)
            self.fixture(root)
            styles.sync_styles(root)
            output = root / styles.OUTPUT
            before = output.read_bytes()
            preview = root / 'design-system/ui_kits/homepage/preview.css'
            for declaration in [
                'color:#123456',
                'z-index:-1',
                'padding:4rem',
                'min-height:22rem',
                'background-size:48px',
            ]:
                preview.write_text('.preview {' + declaration + ';}')
                with self.subTest(declaration=declaration), self.assertRaises(ValueError):
                    styles.sync_styles(root)
                self.assertEqual(output.read_bytes(), before)

    def test_preview_literal_width_media_query_is_rejected(self):
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp)
            self.fixture(root)
            preview = root / 'design-system/ui_kits/homepage/preview.css'
            preview.write_text('@media(max-width:64rem){.preview{display:block}}')
            with self.assertRaisesRegex(ValueError, 'width media query'):
                styles.sync_styles(root)

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
            '.alu-hero-monitor__dot': {'width': '--size-application-monitor-dot', 'height': '--size-application-monitor-dot'},
            '.alu-pathway-tab__icon': {'width': '--size-application-pathway-tab-icon', 'height': '--size-application-pathway-tab-icon'},
            '.alu-pathway-tab__dot': {'width': '--size-application-pathway-dot', 'height': '--size-application-pathway-dot'},
            '.alu-product-card__pulse-dot': {'width': '--size-application-product-pulse-dot', 'height': '--size-application-product-pulse-dot'},
            '.alu-product-card__box-icon': {'width': '--size-application-product-box-icon', 'height': '--size-application-product-box-icon'},
            '.alu-product-card__status-dot': {'width': '--size-application-product-status-dot', 'height': '--size-application-product-status-dot'},
            '.alu-benefit-icon': {'width': '--size-application-benefit-icon', 'height': '--size-application-benefit-icon'},
            '.alu-benefit-icon img': {'width': '--size-application-benefit-image', 'height': '--size-application-benefit-image'},
            '.alu-playlist-item__playing-badge': {'width': '--size-application-playlist-playing-badge', 'height': '--size-application-playlist-playing-badge'},
            '.alu-intro-split__bullet-icon': {'width': '--size-application-bullet-icon', 'height': '--size-application-bullet-icon'},
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

    def test_content_widths_use_their_semantic_tokens(self):
        source = (ROOT / 'src/styles/application.css').read_text(encoding='utf-8')
        expected = {
            '.alu-modal': ('width', 'min(100%, var(--container-application-modal))'),
            '.alu-cookie-banner': ('max-width', 'var(--container-application-cookie-banner)'),
            '.alu-hero-stage__title': ('max-width', 'var(--container-application-hero-title)'),
            '.alu-hero-stage__lead': ('max-width', 'var(--container-application-hero-lead)'),
            '.alu-pathway-tab': ('min-width', 'var(--container-application-pathway-tab)'),
            '.alu-pathway-split__desc': ('max-width', 'var(--container-application-pathway-description)'),
            '.alu-bento-card__bottom': ('max-width', 'var(--container-application-bento-copy)'),
            '.alu-playlist-item__thumb': ('width', 'var(--container-application-playlist-thumbnail)'),
            '.alu-intro-split--single': ('max-width', 'var(--container-application-intro-single)'),
            '.alu-faq-list': ('max-width', 'var(--container-application-faq-list)'),
            '.alu-video-modal__dialog': ('width', 'min(100%, var(--container-application-video-dialog))'),
            '.alu-video-modal__dialog--image': ('width', 'min(100%, var(--container-application-image-dialog))'),
            '.alu-ref-search': ('max-width', 'var(--container-application-reference-search)'),
            '.alu-faq-stage': ('max-width', 'var(--container-application-faq-stage)'),
            '.alu-about-office__contact-list dt': ('min-width', 'var(--container-application-contact-label)'),
        }
        for selector, (prop, value) in expected.items():
            match = re.search(re.escape(selector) + r'\s*\{([^{}]*)\}', source)
            self.assertIsNotNone(match, selector)
            with self.subTest(selector=selector):
                self.assertRegex(match.group(1), rf'(?m)^\s*{re.escape(prop)}\s*:\s*{re.escape(value)};')

    def test_structural_layout_dimensions_use_semantic_tokens(self):
        source = (ROOT / 'src/styles/application.css').read_text(encoding='utf-8')

        def assert_property_values(blocks, prop, expected_value):
            values = [value.strip() for block in blocks for value in re.findall(
                rf'(?m)^\s*{re.escape(prop)}\s*:\s*([^;]+);', block
            )]
            self.assertEqual(values, [expected_value])

        expected = {
            '.alu-site-header__inner': ('min-height', '--layout-application-header-min-height'),
            '.alu-modal': ('max-height', '--layout-application-modal-max-height'),
            '.alu-bento-card--1': ('min-height', '--layout-application-bento-feature-min-height'),
            '.alu-service-pill': ('min-height', '--layout-application-service-pill-min-height'),
            '.alu-video-modal__dialog': ('max-height', '--layout-application-video-dialog-max-height'),
            '.alu-video-modal__image-viewport': ('max-height', '--layout-application-image-viewport-max-height'),
            '.alu-video-modal__image-viewport img': ('max-height', '--layout-application-image-max-height'),
            '.alu-about-office__map': ('min-height', '--layout-application-map-min-height'),
        }
        for selector, (prop, token) in expected.items():
            matches = re.findall(re.escape(selector) + r'\s*\{([^{}]*)\}', source)
            self.assertTrue(matches, selector)
            with self.subTest(selector=selector):
                pattern = rf'(?m)^\s*{re.escape(prop)}\s*:\s*var\({re.escape(token)}\);'
                self.assertTrue(any(re.search(pattern, declarations) for declarations in matches), f'{selector}: {prop} -> {token}')
                assert_property_values(matches, prop, f'var({token})')

        media_end = source.index('@media (max-width: 40rem) {')
        media_start = source.rindex('@media (max-width: 64rem) {', 0, media_end)
        desktop_source = source[:media_start]
        compact_source = source[media_start:media_end]
        desktop_playlist = re.search(r'\.alu-playlist-sidebar\s*\{([^{}]*)\}', desktop_source)
        compact_playlist = re.search(r'\.alu-playlist-sidebar\s*\{([^{}]*)\}', compact_source)
        self.assertIsNotNone(desktop_playlist)
        self.assertIsNotNone(compact_playlist)
        self.assertRegex(desktop_playlist.group(1), r'(?m)^\s*height\s*:\s*var\(--layout-application-playlist-height\);')
        self.assertRegex(compact_playlist.group(1), r'(?m)^\s*height\s*:\s*var\(--layout-application-playlist-height-compact\);')
        assert_property_values([desktop_playlist.group(1)], 'height', 'var(--layout-application-playlist-height)')
        assert_property_values([compact_playlist.group(1)], 'height', 'var(--layout-application-playlist-height-compact)')

        bento_group = re.search(
            r'\.alu-bento-card--1,\s*\.alu-bento-card--2,\s*\.alu-bento-card--3,\s*'
            r'\.alu-bento-card--4,\s*\.alu-bento-card--5\s*\{([^{}]*)\}', compact_source
        )
        self.assertIsNotNone(bento_group)
        self.assertRegex(bento_group.group(1), r'(?m)^\s*min-height\s*:\s*var\(--layout-application-bento-responsive-min-height\);')
        assert_property_values([bento_group.group(1)], 'min-height', 'var(--layout-application-bento-responsive-min-height)')

        count_rule = re.search(r'\.alu-ref-tab__count\s*\{([^{}]*)\}', source)
        self.assertIsNotNone(count_rule)
        self.assertRegex(count_rule.group(1), r'(?m)^\s*min-width\s*:\s*var\(--layout-application-reference-count-min-width\);')
        self.assertRegex(count_rule.group(1), r'(?m)^\s*height\s*:\s*var\(--layout-application-reference-count-height\);')
        assert_property_values([count_rule.group(1)], 'min-width', 'var(--layout-application-reference-count-min-width)')
        assert_property_values([count_rule.group(1)], 'height', 'var(--layout-application-reference-count-height)')

    def test_decorative_dimensions_use_semantic_tokens(self):
        source = (ROOT / 'src/styles/application.css').read_text(encoding='utf-8')
        expected = {
            '.alu-hero-metrics__item::before': {
                'width': '--size-application-metric-rule-width',
                'height': '--size-application-metric-rule-height',
            },
            '.alu-pathway-glow': {
                'width': '--size-application-pathway-glow',
                'height': '--size-application-pathway-glow',
            },
            '.alu-about-office__divider': {
                'height': '--size-application-office-divider',
            },
        }
        for selector, properties in expected.items():
            matches = re.findall(rf'(?m)^[\t ]*{re.escape(selector)}[\t ]*\{{([^{{}}]*)\}}', source)
            self.assertEqual(len(matches), 1, selector)
            for prop, token in properties.items():
                with self.subTest(selector=selector, prop=prop):
                    values = re.findall(rf'(?m)^\s*{re.escape(prop)}\s*:\s*([^;]+);', matches[0])
                    self.assertEqual(values, [f'var({token})'])

        # Percentages, zero and auto remain structural; any alphabetic CSS length unit is a raw literal.
        raw_dimension_pattern = re.compile(
            r'^\s*(?:min-|max-)?(?:width|height)\s*:\s*[^;]*(?<![\w.-])-?(?:\d*\.)?\d+[a-z]+\b',
            re.I | re.M,
        )
        raw_dimensions = raw_dimension_pattern.findall(source)
        self.assertEqual(raw_dimensions, [])
        for raw in ['width:2svw;', 'height:2dvw;', 'width:2vmin;', 'height:2lh;', 'width:2pt;', 'height:2REM;']:
            with self.subTest(raw=raw):
                self.assertRegex(raw, raw_dimension_pattern)

    def test_repeated_interaction_transforms_use_semantic_tokens(self):
        source = (ROOT / 'src/styles/application.css').read_text(encoding='utf-8')
        expected = {
            '.alu-pathway-tab:hover': '--motion-transform-lift-subtle',
            '.alu-techspec-item:hover': '--motion-transform-lift-subtle',
            '.alu-service-card:hover': '--motion-transform-lift-subtle',
            '.alu-ref-card:hover': '--motion-transform-lift-subtle',
            '.alu-bento-card:hover': '--motion-transform-lift-moderate',
            '.alu-about-value-item:hover': '--motion-transform-lift-subtle',
            '.alu-product-card--highlighted:hover': '--motion-transform-lift-strong',
            '.alu-benefit-card:hover': '--motion-transform-lift-subtle',
            '.alu-media-card:hover': '--motion-transform-lift-subtle',
            '.alu-megamenu__item:hover': '--motion-transform-nudge-subtle',
            '.alu-workflow-pill:hover .alu-workflow-pill__arrow': '--motion-transform-nudge-subtle',
            '.alu-pathway-cta:hover .alu-pathway-cta__arrow': '--motion-transform-nudge-strong',
        }
        for selector, token in expected.items():
            matches = re.findall(rf'(?m)^[\t ]*{re.escape(selector)}[\t ]*\{{([^{{}}]*)\}}', source)
            self.assertTrue(matches, selector)
            values = [value for declarations in matches for value in re.findall(
                r'(?m)^\s*transform\s*:\s*([^;]+);', declarations
            )]
            with self.subTest(selector=selector):
                self.assertEqual(values, [f'var({token})'])

    def test_subpage_hero_does_not_zoom_its_background(self):
        source = (ROOT / 'src/styles/application.css').read_text(encoding='utf-8')
        background = re.search(r'(?m)^\.alu-subpage-hero__bg \{([^{}]*)\}', source).group(1)
        self.assertNotRegex(background, r'(?m)^\s*transform\s*:')
        self.assertIn('object-fit: contain;', source)

    def test_remaining_visual_transforms_use_role_specific_tokens(self):
        source = (ROOT / 'src/styles/application.css').read_text(encoding='utf-8')
        expected = {
            '.alu-card:hover .alu-card__media img': '--motion-transform-media-generic-zoom',
            '.alu-pathway-tab--active': '--motion-transform-pathway-tab-active',
            '.alu-pathway-split:hover .alu-pathway-visual-frame img': '--motion-transform-media-detail-zoom',
            '.alu-product-card--highlighted': '--motion-transform-product-highlighted',
            '.alu-product-card--dimmed': '--motion-transform-product-dimmed',
            '.alu-product-card--dimmed:hover': '--motion-transform-product-dimmed-hover',
            '.alu-product-card:hover .alu-product-card__media img': '--motion-transform-card-media-zoom',
            '.alu-product-card__cta': '--motion-transform-product-cta-rest',
            '.alu-product-card:hover .alu-product-card__cta': '--motion-transform-product-cta-hover',
            '.alu-bento-card:hover .alu-bento-card__bg': '--motion-transform-card-media-zoom',
            '.alu-innovation-card:hover .alu-innovation-card__media img': '--motion-transform-card-media-zoom',
            '.alu-media-card:hover .alu-media-card__thumb img': '--motion-transform-media-showcase-zoom',
            '.alu-scia-callout__media--interactive:hover img,\n.alu-scia-callout__media--interactive:hover video': '--motion-transform-media-detail-zoom',
            '.alu-scia-callout__media--interactive:hover .alu-media-card__play-circle': '--motion-transform-play-control-zoom',
        }
        for selector, token in expected.items():
            matches = re.findall(rf'(?m)^[\t ]*{re.escape(selector)}[\t ]*\{{([^{{}}]*)\}}', source)
            self.assertTrue(matches, selector)
            values = [value for declarations in matches for value in re.findall(
                r'(?m)^\s*transform\s*:\s*([^;]+);', declarations
            )]
            with self.subTest(selector=selector):
                self.assertEqual(values, [f'var({token})'])

        play_group = re.search(
            r'(?m)^\.alu-media-card:hover \.alu-media-card__play-circle,\n'
            r'\.alu-wf-detail__media:hover \.alu-media-card__play-circle\s*\{([^{}]*)\}', source
        )
        self.assertIsNotNone(play_group)
        self.assertEqual(
            re.findall(r'(?m)^\s*transform\s*:\s*([^;]+);', play_group.group(1)),
            ['var(--motion-transform-play-control-zoom)'],
        )

        keyframes = {
            'aluPathwaySlideIn': {
                'from': '--motion-transform-pathway-slide-from',
                'to': '--motion-transform-pathway-slide-to',
            },
            'aluPathwayFeatureIn': {
                'from': '--motion-transform-pathway-feature-from',
                'to': '--motion-transform-pathway-feature-to',
            },
        }
        for name, steps in keyframes.items():
            match = re.search(rf'@keyframes {name}\s*\{{(.*?)\n\}}', source, re.S)
            self.assertIsNotNone(match, name)
            for step, token in steps.items():
                block = re.search(rf'\b{step}\s*\{{([^{{}}]*)\}}', match.group(1))
                self.assertIsNotNone(block, f'{name}:{step}')
                self.assertEqual(
                    re.findall(r'(?m)^\s*transform\s*:\s*([^;]+);', block.group(1)),
                    [f'var({token})'],
                )

        raw = [value.strip() for value in re.findall(
            r'(?m)^\s*transform\s*:\s*([^;]+);', source
        ) if not value.strip().startswith('var(')]
        self.assertEqual(sorted(raw), ['rotate(180deg)', 'translate(-50%, -50%)'])
        literal_contracts = {
            '.alu-pathway-glow': 'translate(-50%, -50%)',
            '.alu-faq-item[open] .alu-faq-item__chevron': 'rotate(180deg)',
        }
        for selector, expected_value in literal_contracts.items():
            blocks = re.findall(rf'(?m)^[\t ]*{re.escape(selector)}[\t ]*\{{([^{{}}]*)\}}', source)
            values = [value.strip() for block in blocks for value in re.findall(
                r'(?m)^\s*transform\s*:\s*([^;]+);', block
            )]
            self.assertEqual(values, [expected_value], selector)

    def test_application_transform_guard_rejects_new_raw_visual_values(self):
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp)
            self.fixture(root)
            app = root / 'src/styles/application.css'
            app.write_text('.card {transform:var(--motion-transform-card-media-zoom)}')
            styles.sync_styles(root)
            for value in ['scale(1.02)', 'translateY(-2px)', 'rotate(90deg)',
                          'translateX(2px) rotate(var(--angle))', 'rotate(180deg)']:
                app.write_text(f'.card {{transform:{value}}}')
                with self.subTest(value=value), self.assertRaisesRegex(ValueError, 'Raw application transform'):
                    styles.sync_styles(root)

    def test_filter_and_backdrop_filter_values_use_semantic_tokens(self):
        source = (ROOT / 'src/styles/application.css').read_text(encoding='utf-8')
        expected = {
            '.alu-site-header': {
                'backdrop-filter': '--filter-backdrop-header',
                '-webkit-backdrop-filter': '--filter-backdrop-header',
            },
            '.alu-hero-stage__bg-video': {'filter': '--filter-application-hero-video'},
            '.alu-pathway-glow': {'filter': '--filter-application-pathway-glow'},
            '.alu-product-card--highlighted': {'filter': '--filter-application-product-highlighted'},
            '.alu-product-card--dimmed': {'filter': '--filter-application-product-dimmed'},
            '.alu-product-card--dimmed:hover': {'filter': '--filter-application-product-dimmed-hover'},
            '.alu-bento-card__bg': {'filter': '--filter-application-bento-media-default'},
            '.alu-bento-card:hover .alu-bento-card__bg': {'filter': '--filter-application-bento-media-hover'},
            '.alu-subpage-hero__bg': {'filter': '--filter-application-subpage-hero-background'},
            '.alu-media-card__video-badge': {'backdrop-filter': '--filter-backdrop-media-badge'},
            '.alu-video-modal': {'backdrop-filter': '--filter-backdrop-modal'},
        }
        for selector, properties in expected.items():
            blocks = re.findall(rf'(?m)^[\t ]*{re.escape(selector)}[\t ]*\{{([^{{}}]*)\}}', source)
            self.assertTrue(blocks, selector)
            for prop, token in properties.items():
                values = [value.strip() for block in blocks for value in re.findall(
                    rf'(?m)^\s*{re.escape(prop)}\s*:\s*([^;]+);', block
                )]
                with self.subTest(selector=selector, prop=prop):
                    self.assertEqual(values, [f'var({token})'])

        raw = []
        for prop, value in re.findall(
            r'(?m)^\s*((?:-webkit-)?backdrop-filter|filter)\s*:\s*([^;]+);', source
        ):
            if not value.strip().startswith('var('):
                raw.append((prop, value.strip()))
        self.assertEqual(raw, [])

    def test_application_filter_guard_rejects_raw_and_mixed_values(self):
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp)
            self.fixture(root)
            app = root / 'src/styles/application.css'
            for prop in ['filter', 'backdrop-filter', '-webkit-backdrop-filter']:
                app.write_text(f'.card {{{prop}:var(--filter-backdrop-header)}}')
                styles.sync_styles(root)
                for value in ['blur(2px)', 'blur(2px) var(--filter-backdrop-header)',
                              'var(--filter-backdrop-header) blur(2px)', 'var(--text-primary)']:
                    app.write_text(f'.card {{{prop}:{value}}}')
                    with self.subTest(prop=prop, value=value), self.assertRaisesRegex(ValueError, 'Raw application filter'):
                        styles.sync_styles(root)

    def test_application_shadows_use_semantic_tokens(self):
        source = (ROOT / 'src/styles/application.css').read_text(encoding='utf-8')
        expected = {
            '.alu-site-header': '--shadow-application-header',
            '.alu-megamenu': '--shadow-application-mega-menu',
            '[data-mode="light"] .alu-site-header': '--shadow-application-header-light',
            '[data-mode="light"] .alu-megamenu': '--shadow-application-mega-menu-light',
            '.alu-hero-monitor': '--shadow-application-hero-monitor',
            '.alu-hero-monitor__dot': '--shadow-application-monitor-status-glow',
            '.alu-pathway-tab--active': '--shadow-application-pathway-tab-active',
            '.alu-pathway-tab--active .alu-pathway-tab__dot': '--shadow-application-pathway-dot-glow',
            '.alu-pathway-cta:hover': '--shadow-application-pathway-cta-hover',
            '.alu-product-card--highlighted': '--shadow-application-product-highlighted',
            '.alu-product-card--highlighted:hover': '--shadow-application-product-highlighted-hover',
            '.alu-product-card--dimmed': '--shadow-application-product-dimmed',
            '.alu-product-card__pulse-dot': '--shadow-application-product-pulse-glow',
            '.alu-product-card__status-dot--active': '--shadow-application-product-status-glow',
            '.alu-media-card__play-circle': '--shadow-application-media-play-control',
            '.alu-video-modal__dialog': '--shadow-application-modal-dialog',
            '.alu-ref-tab--active': '--shadow-application-reference-tab-active',
        }
        for selector, token in expected.items():
            blocks = re.findall(rf'(?m)^[\t ]*{re.escape(selector)}[\t ]*\{{([^{{}}]*)\}}', source)
            self.assertTrue(blocks, selector)
            values = [re.sub(r'\s+', ' ', value).strip() for block in blocks for value in re.findall(
                r'(?ms)^\s*box-shadow\s*:\s*(.*?);', block
            )]
            with self.subTest(selector=selector):
                self.assertEqual(values.count(f'var({token})'), 1)
                self.assertEqual(values[-1], f'var({token})')

        raw = [value for value in re.findall(r'(?ms)^\s*box-shadow\s*:\s*(.*?);', source)
               if not re.fullmatch(r'var\(--(?:shadow|elevation)-[\w-]+\)', value.strip())]
        self.assertEqual(raw, [])

    def test_application_shadow_guard_rejects_raw_wrong_namespace_and_mixed_values(self):
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp)
            self.fixture(root)
            app = root / 'src/styles/application.css'
            for value in ['var(--shadow-application-header)', 'var(--elevation-raised)']:
                app.write_text(f'.card {{box-shadow:{value}}}')
                styles.sync_styles(root)
            for value in ['0 1px 2px black', 'none', 'var(--text-primary)',
                          'var(--shadow-application-header) 0 1px 2px black',
                          'var(--shadow-does-not-exist)', 'var(--elevation-does-not-exist)']:
                app.write_text(f'.card {{box-shadow:{value}}}')
                with self.subTest(value=value), self.assertRaisesRegex(ValueError, 'Raw application shadow'):
                    styles.sync_styles(root)
            app.write_text('.card { /* note */ box-shadow: var(--shadow-application-header) 0 1px 2px black; }')
            with self.assertRaisesRegex(ValueError, 'Raw application shadow'):
                styles.sync_styles(root)
            component = root / 'design-system/components/base.css'
            component.write_text('.only-inside-component { --shadow-local-only: none; }')
            app.write_text('.card {box-shadow:var(--shadow-local-only)}')
            with self.assertRaisesRegex(ValueError, 'Raw application shadow'):
                styles.sync_styles(root)
