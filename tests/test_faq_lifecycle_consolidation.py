"""Lifecycle content lives on its existing page while other FAQ answers stay intact."""

import hashlib
import json
from pathlib import Path
import unittest

ROOT = Path(__file__).resolve().parents[1]
PAGES = ROOT / 'src/data/pages.json'
EXPECTED_CATEGORIES = {
    'subscription': '9278ce052a4f66665268bef333a9586570e67e2f45eb06d4c7e92c51bce40478',
    'cloud': 'c87807827d8f8c18c8c100b1c7e713b9010ae70c984513641b1f9a19070bca03',
    'conversion': 'd446e633cb7f287ccdd7dd8b31c8cfc6ffd111023c14bc75df0cdff6c3a0ad87',
    'workgroup': '87c6392ffbfc4b498560be371a78df2c6a0226d790fb2cc50c512007506c3e1e',
}


class LifecycleConsolidationTests(unittest.TestCase):
    def test_faq_keeps_all_other_questions_and_answers_unchanged(self):
        faq = json.loads(PAGES.read_text(encoding='utf-8'))['/faq']['structuredLayout']['faqDirectory']
        categories = faq['categories']
        self.assertEqual([category['id'] for category in categories], list(EXPECTED_CATEGORIES))
        self.assertEqual(sum(len(category['items']) for category in categories), 19)
        for category in categories:
            content = json.dumps(category, ensure_ascii=False, sort_keys=True, separators=(',', ':')).encode()
            self.assertEqual(hashlib.sha256(content).hexdigest(), EXPECTED_CATEGORIES[category['id']])

    def test_homepage_still_links_to_the_canonical_lifecycle_page(self):
        home = (ROOT / 'src/components/sections/Homepage2027PreviewView.tsx').read_text(encoding='utf-8')
        self.assertIn('href="/product-lifecycle"', home)
        self.assertNotIn('/faq?category=lifecycle', home)

    def test_lifecycle_page_retains_policy_service_tables_and_product_dates(self):
        page = (ROOT / 'src/app/product-lifecycle/page.tsx').read_text(encoding='utf-8')
        data = (ROOT / 'src/app/product-lifecycle/data.ts').read_text(encoding='utf-8')
        for phrase in ('13 Ocak 2025', 'Ürün bakım yaşam döngümüz', 'Sürüm destek yaşam döngümüz',
                       'Ürün bakım tarihleri', 'ALLPLAN Serviceplus (SSA)', 'Ekim 2029',
                       'Ana sürüm nedir?', 'Ara sürüm nedir?', 'https://www.allplan.com/product-lifecycle/'):
            with self.subTest(phrase=phrase):
                self.assertIn(phrase, page)
        self.assertIn('yalnızca ALLPLAN, SDS2 ve SCIA ENG için', data)
        self.assertIn('desteklenen sürümler için düşük önceliklidir', data)


if __name__ == '__main__':
    unittest.main()
