"""S04 regressions: requests use Forms; retired local endpoints never claim delivery.

These source contracts complement production HTTP/browser acceptance. They do not
submit data to Microsoft or claim that an external form has received a request.
"""
import re
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
FORM_URL = "https://forms.office.com/r/hXhnKAG912"


def read(relative):
    return (ROOT / relative).read_text(encoding="utf-8")


def special_view(text, route):
    """Get a route-specific JSX view up to the next top-level section comment."""
    start = text.index("{page.path === '" + route + "' && (")
    end = text.find("\n      {/*", start)
    return text[start:] if end == -1 else text[start:end]


class ExternalRequestChannelTests(unittest.TestCase):
    def test_single_common_request_destination_remains_the_existing_form(self):
        data = read("src/lib/site-data.ts")
        self.assertRegex(data, rf"MAIN_QUOTE_FORM_URL\s*=\s*['\"]{re.escape(FORM_URL)}['\"]")

    def test_topbar_request_is_an_external_link_not_a_local_submit(self):
        shell = read("src/components/shell/SiteShell.tsx")
        start = shell.index("{/* Top Bar */}")
        end = shell.index("{/* Main Header", start)
        topbar = shell[start:end]
        self.assertIn("href={MAIN_QUOTE_FORM_URL}", topbar)
        self.assertIn('target="_blank"', topbar)
        self.assertIn('rel="noopener noreferrer"', topbar)
        for retired in ["requestModalOpen", "handleRequestSubmit", "setRequestIntent", "'/api/request'", "Talebiniz kaydedildi"]:
            self.assertNotIn(retired, shell)

    def test_contact_offers_common_requests_and_preserves_direct_contact(self):
        text = read("src/components/sections/SubpageView.tsx")
        contact = special_view(text, "/contact")
        self.assertIn("href={MAIN_QUOTE_FORM_URL}", contact)
        self.assertIn("mailto:", contact)
        self.assertIn("tel:", contact)
        self.assertNotRegex(contact, r"<form\b|onSubmit=|handleContactSubmit")

    def test_activation_preserves_document_and_support_without_sales_misrouting(self):
        text = read("src/components/sections/SubpageView.tsx")
        activation = special_view(text, "/solutions-v2/connect-license/activation")
        self.assertIn("/docs/Declaration_Allplan_2021-06-01.pdf", activation)
        self.assertIn("mailto:", activation)
        self.assertTrue("SUPPORT_PORTAL_URL" in activation or "https://allplan.net.tr/tr" in activation)
        self.assertNotIn("MAIN_QUOTE_FORM_URL", activation)
        self.assertNotIn(FORM_URL, activation)
        self.assertNotRegex(activation, r"<form\b|onSubmit=|handleActivationSubmit|productKey")

    def test_page_components_have_no_retired_post_or_false_success(self):
        for relative in ["src/components/shell/SiteShell.tsx", "src/components/sections/SubpageView.tsx"]:
            with self.subTest(component=relative):
                text = read(relative)
                self.assertNotRegex(text, r"fetch\(['\"]/api/(request|contact|send-activation-email)['\"]")
                for claim in ["Talebiniz kaydedildi", "Mesajınız alındı", "Deklarasyon kaydınız alındı"]:
                    self.assertNotIn(claim, text)


class RetiredLocalEndpointTests(unittest.TestCase):
    def test_retired_posts_return_gone_without_reading_personal_data(self):
        for name in ["request", "contact", "send-activation-email"]:
            with self.subTest(endpoint=name):
                text = read(f"src/app/api/{name}/route.ts")
                self.assertRegex(text, r"export\s+(?:async\s+)?function\s+POST\b")
                self.assertRegex(text, r"status\s*:\s*410\b")
                self.assertRegex(text, r"\berror\s*:")
                self.assertNotRegex(text, r"\.(?:json|formData|text)\(\)|\bok\s*:\s*true|status\s*:\s*20[01]\b")
                for marker in ["requestId", "referenceId", "Date.now", "productKey"]:
                    self.assertNotIn(marker, text)


if __name__ == "__main__":
    unittest.main()
