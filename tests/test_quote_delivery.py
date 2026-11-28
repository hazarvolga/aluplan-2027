"""Delivery of a quote request: configuration, rate limit, disk journal and mail hand-off."""

from pathlib import Path
import json
import subprocess
import unittest


ROOT = Path(__file__).resolve().parents[1]


def run_runtime():
    result = subprocess.run(
        ["node", "tests/quote_delivery_runtime.mjs"],
        cwd=ROOT,
        check=True,
        capture_output=True,
        text=True,
    )
    return json.loads(result.stdout)


class QuoteDeliveryTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.data = run_runtime()

    def test_config_is_read_from_environment(self):
        config = self.data["configs"]["full"]
        self.assertEqual(config["smtp"]["host"], "mail.example.test")
        self.assertEqual(config["smtp"]["port"], 587)
        self.assertEqual(config["from"], "teklif@example.test")
        self.assertEqual(config["recipients"], ["a@example.test", "b@example.test"])
        self.assertEqual(config["journalDir"], "/data/quotes")
        self.assertFalse(config["sendCustomerMail"])

    def test_incomplete_config_disables_delivery(self):
        self.assertIsNone(self.data["configs"]["missingPassword"])
        self.assertIsNone(self.data["configs"]["noRecipients"])

    def test_customer_mail_is_opt_in(self):
        self.assertTrue(self.data["configs"]["customerMailOn"])

    def test_rate_limit_is_per_key_and_resets_after_the_window(self):
        self.assertEqual(self.data["rate"], [True, True, False, True, True])

    def test_journal_keeps_the_request_until_removed(self):
        journal = self.data["journal"]
        self.assertTrue(journal["idIsSafe"])
        self.assertEqual(journal["afterSave"], 1)
        self.assertEqual(journal["storedName"], "Deneme Kullanıcı")
        self.assertEqual(journal["afterRemove"], 0)

    def test_journal_purges_entries_older_than_the_retention_window(self):
        journal = self.data["journal"]
        self.assertEqual(journal["pending"], 1)
        self.assertEqual(journal["afterPurge"], 1)

    def test_missing_journal_directory_has_no_pending_entries(self):
        self.assertEqual(self.data["journal"]["missingDir"], [])

    def test_staff_mail_goes_to_every_recipient_with_reply_to_requester(self):
        mails = self.data["mails"]
        self.assertEqual(mails["staffOnly"], 1)
        staff = mails["staff"]
        self.assertEqual(staff["to"], ["a@example.test", "b@example.test"])
        self.assertEqual(staff["from"], "Aluplan Teklif Formu <teklif@example.test>")
        self.assertEqual(staff["replyTo"], "deneme@example.com")
        self.assertEqual(staff["subject"], "Deneme Kullanıcı / ALLPLAN Max")

    def test_customer_mail_is_sent_only_when_enabled(self):
        mails = self.data["mails"]
        self.assertEqual(mails["total"], 3)
        self.assertEqual(mails["customer"]["to"], ["deneme@example.com"])
        self.assertEqual(mails["customer"]["subject"], "Talebiniz bize ulaştı | Aluplan")

    def test_send_failure_is_reported_to_the_caller(self):
        self.assertEqual(self.data["failure"], "smtp down")


if __name__ == "__main__":
    unittest.main()
