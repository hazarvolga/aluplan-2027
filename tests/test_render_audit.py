import importlib.util
from pathlib import Path
import unittest

SPEC = importlib.util.spec_from_file_location('audit_render_parity', Path(__file__).resolve().parents[1] / 'scripts/audit_render_parity.py')
audit = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(audit)


class RenderAuditTests(unittest.TestCase):
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
