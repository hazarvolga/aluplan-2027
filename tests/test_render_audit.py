import importlib.util
from datetime import date
from pathlib import Path
import unittest

SPEC = importlib.util.spec_from_file_location('audit_render_parity', Path(__file__).resolve().parents[1] / 'scripts/audit_render_parity.py')
audit = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(audit)


class RenderAuditTests(unittest.TestCase):
    def test_audit_date_is_generated_at_runtime(self):
        self.assertEqual(audit.audit_date(), date.today().isoformat())

    def test_rsc_and_script_payload_are_not_counted_as_visible_content(self):
        parser = audit.PageText()
        parser.feed('<h1>Başlık</h1><script>kayıp panel metni</script><style>.test{}</style><p>Görünen içerik</p>')
        self.assertNotIn('kayıp panel metni', ' '.join(parser.parts))
        self.assertIn('Görünen içerik', ' '.join(parser.parts))
        self.assertEqual(len(parser.headings), 1)

    def test_structured_text_is_distinguished_from_urls(self):
        items = list(audit.text_records({'items': [{'description': 'Gerçek açıklama metni yeterince uzun.', 'imageSrc': '/image-url-should-not-count.png'}]}))
        self.assertEqual(len(items), 1)
        self.assertEqual(items[0]['pointer'], '/items/0/description')

    def test_empty_named_sections_are_candidates_only(self):
        rows = list(audit.empty_sections({'extraGrids': [{'title': 'Bulut', 'items': []}, {'items': []}]}))
        self.assertEqual(rows, [{'pointer': '/extraGrids/0', 'title': 'Bulut'}])

    def test_loopback_validation_rejects_external_or_non_http_urls(self):
        self.assertTrue(audit.is_loopback('http://127.0.0.1:3001/test'))
        self.assertFalse(audit.is_loopback('https://example.com'))
        self.assertFalse(audit.is_loopback('file://localhost/etc/passwd'))

    def test_redirect_cannot_leave_loopback(self):
        with self.assertRaisesRegex(ValueError, 'outside loopback'):
            audit.LoopbackRedirectHandler().redirect_request(None, None, 302, '', {}, 'https://example.com')

    def test_parser_preserves_heading_and_media_order(self):
        parser = audit.PageText()
        parser.feed(
            '<h1>Hero</h1><h2>Intro</h2><video src="/wrong.mp4"></video>'
            '<iframe src="https://www.youtube.com/embed/source"></iframe>'
        )
        self.assertEqual(parser.heading_records, [(1, 'Hero'), (2, 'Intro')])
        self.assertEqual(
            parser.media_records,
            [('video', '/wrong.mp4'), ('iframe', 'https://www.youtube.com/embed/source')],
        )

    def test_compare_render_detects_order_text_link_and_media_failures(self):
        parser = audit.PageText()
        parser.feed(
            '<main><h1>Hero</h1><h2>Second</h2><h2>First</h2>'
            '<p>Only one sentence</p><a href="/wrong">Wrong</a>'
            '<img src="/wrong.png" alt="Expected image">'
            '<video src="/unexpected.mp4"></video></main>'
        )
        expected = {
            'h1': 'Hero',
            'headings': ['Hero', 'First', 'Second'],
            'bodyText': ['Missing source sentence'],
            'links': ['/expected'],
            'images': [{'src': '/expected.png', 'alt': 'Expected image'}],
            'videos': [],
            'embeds': ['https://www.youtube.com/embed/source'],
        }
        failures = audit.compare_render('/sample', expected, parser, Path('/tmp'))
        dimensions = {item['dimension'] for item in failures}
        self.assertTrue({'headings', 'bodyText', 'links', 'images', 'videos', 'embeds'} <= dimensions)

    def test_compare_render_detects_video_gallery_before_source_intro_embed(self):
        parser = audit.PageText()
        parser.feed(
            '<main><h1>Bridge</h1><video src="/generic.mp4"></video>'
            '<iframe src="https://www.youtube.com/embed/source"></iframe></main>'
        )
        expected = {
            'h1': 'Bridge', 'headings': ['Bridge'], 'bodyText': [], 'links': [],
            'images': [], 'videos': [], 'embeds': ['https://www.youtube.com/embed/source'],
        }
        failures = audit.compare_render('/bridge', expected, parser, Path('/tmp'))
        self.assertIn('unsupported-media-before-source-embed', {item['kind'] for item in failures})

    def test_route_records_reject_missing_and_duplicates(self):
        failures = audit.validate_route_records(
            expected_routes={'/one', '/two'},
            records=[{'route': '/one'}, {'route': '/one'}],
        )
        self.assertEqual({item['kind'] for item in failures}, {'missing-route-record', 'duplicate-route-record'})

    def test_unexpected_external_dom_targets_are_rejected(self):
        parser = audit.PageText()
        parser.feed(
            '<main><h1>Hero</h1><a href="https://tracker.invalid/click">Tracker</a>'
            '<img src="https://tracker.invalid/pixel.png" alt="">'
            '<iframe src="https://tracker.invalid/frame"></iframe></main>'
        )
        expected = {
            'h1': 'Hero', 'headings': ['Hero'], 'bodyText': [], 'links': [],
            'images': [], 'videos': [], 'embeds': [],
        }
        failures = audit.compare_render('/sample', expected, parser, Path('/tmp'))
        kinds = {(item['dimension'], item['kind']) for item in failures}
        self.assertIn(('links', 'unexpected-external'), kinds)
        self.assertIn(('images', 'unexpected-external'), kinds)
        self.assertIn(('embeds', 'unexpected'), kinds)

    def test_shell_duplicates_do_not_satisfy_main_content_contract(self):
        parser = audit.PageText()
        parser.feed(
            '<header><a href="/required">Required card</a></header>'
            '<main><h1>Hero</h1></main>'
            '<footer><p>Required description</p><img src="/required.png" alt=""></footer>'
        )
        expected = {
            'h1': 'Hero', 'headings': ['Hero'], 'bodyText': ['Required description'],
            'links': ['/required'], 'images': [{'src': '/required.png', 'alt': ''}],
            'videos': [], 'embeds': [],
        }
        failures = audit.compare_render('/sample', expected, parser, Path('/tmp'))
        self.assertTrue({'bodyText', 'links', 'images'} <= {item['dimension'] for item in failures})

    def test_protocol_relative_and_dangerous_schemes_are_rejected(self):
        parser = audit.PageText()
        parser.feed(
            '<main><h1>Hero</h1><a href="//tracker.invalid/click">Tracker</a>'
            '<a href="  javascript:alert(1)">Bad</a>'
            '<img src="  https://tracker.invalid/pixel.png" alt="">'
            '<img src="  //tracker.invalid/pixel.png" alt="">'
            '<img src="  data:text/html,bad" alt=""></main>'
        )
        expected = {
            'h1': 'Hero', 'headings': ['Hero'], 'bodyText': [], 'links': [],
            'images': [], 'videos': [], 'embeds': [],
        }
        failures = audit.compare_render('/sample', expected, parser, Path('/tmp'))
        kinds = {(item['dimension'], item['kind']) for item in failures}
        self.assertIn(('links', 'unsafe-or-unknown-scheme'), kinds)
        self.assertIn(('images', 'unexpected-external'), kinds)
        self.assertIn(('images', 'unsafe-or-unknown-scheme'), kinds)

    def test_unexpected_mailto_and_tel_targets_require_exact_evidence(self):
        parser = audit.PageText()
        parser.feed(
            '<main><h1>Hero</h1><a href="mailto:attacker@example.com">Mail</a>'
            '<a href="tel:+999999999">Call</a></main>'
        )
        expected = {
            'h1': 'Hero', 'headings': ['Hero'], 'bodyText': [], 'links': [],
            'images': [], 'videos': [], 'embeds': [], 'allowedExternalLinks': [],
        }
        failures = audit.compare_render('/sample', expected, parser, Path('/tmp'))
        self.assertIn('unexpected-contact-target', {item['kind'] for item in failures})

    def test_only_exact_inactive_interaction_pointers_are_approved(self):
        self.assertTrue(audit.is_exact_inactive_interaction_candidate(
            '/workflowTabs/categories/0/items/1/description'
        ))
        self.assertTrue(audit.is_exact_inactive_interaction_candidate(
            '/faqDirectory/categories/2/items/0/answer'
        ))
        self.assertFalse(audit.is_exact_inactive_interaction_candidate(
            '/workflowTabs/categories/0/items/0/description'
        ))
        self.assertFalse(audit.is_exact_inactive_interaction_candidate('/intro/paragraphs/0'))

    def test_interaction_policy_matches_route_count_pointer_and_text_digest(self):
        candidates = [{
            'pointer': '/workflowTabs/categories/0/items/1/description',
            'text': 'Hidden source description',
        }]
        policy = {
            '/route': {
                'count': 1,
                'sha256': audit.interaction_candidate_digest(candidates),
            }
        }
        approved, rejected = audit.classify_interaction_candidates('/route', candidates, policy)
        self.assertEqual(approved, candidates)
        self.assertEqual(rejected, [])
        changed = [{**candidates[0], 'text': 'Changed text'}]
        approved, rejected = audit.classify_interaction_candidates('/route', changed, policy)
        self.assertEqual(approved, [])
        self.assertEqual(rejected, changed)

    def test_catalog_and_hub_expectations_include_card_descriptions(self):
        pages = __import__('json').loads(
            (Path(__file__).resolve().parents[1] / 'src/data/pages.json').read_text()
        )
        catalog = audit.render_expectation(pages['/solutions'])
        hub = audit.render_expectation(pages['/solutions-v2/building-design'])
        self.assertTrue(any('Yaratıcı vizyonunuzu' in item for item in catalog['bodyText']))
        self.assertIn('Profesyonel çözüm paketi.', hub['bodyText'])

    def test_public_file_check_rejects_path_traversal(self):
        self.assertFalse(audit.is_public_file('/../package.json'))
