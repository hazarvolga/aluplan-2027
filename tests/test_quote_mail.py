"""Mails built from a quote request: one for the sales team, one for the requester."""

from pathlib import Path
import html
import json
import re
import subprocess
import unittest


ROOT = Path(__file__).resolve().parents[1]
DATA_BLOCK = re.compile(r"\[\[ALUPLAN-TALEP\]\](.*?)\[\[/ALUPLAN-TALEP\]\]", re.S)


def run_runtime():
    result = subprocess.run(
        ["node", "tests/quote_mail_runtime.mjs"],
        cwd=ROOT,
        check=True,
        capture_output=True,
        text=True,
    )
    return json.loads(result.stdout)


class QuoteMailTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.mails = run_runtime()

    def test_staff_subject_is_requester_name_then_requested_products(self):
        self.assertEqual(
            self.mails["allplan"]["staff"]["subject"],
            "Deneme Kullanıcı / ALLPLAN Max, ALLPLAN Civil",
        )
        self.assertEqual(
            self.mails["student"]["staff"]["subject"],
            "Deneme Kullanıcı / Allplan Öğrenci Versiyonu",
        )

    def test_staff_reply_goes_to_the_requester(self):
        self.assertEqual(self.mails["allplan"]["staff"]["replyTo"], "deneme@example.com")

    def test_staff_mail_lists_products_and_contact_details(self):
        body = self.mails["allplan"]["staff"]["html"]
        for expected in (
            "ALLPLAN Max",
            "ALLPLAN Civil",
            "Fiyat teklifi talep ediyorum",
            "Deneme Kullanıcı",
            "deneme@example.com",
            "05320000000",
            "Google, Referans",
            "/teklif?urun=allplan-max",
        ):
            self.assertIn(expected, body)

    def test_staff_mail_carries_a_machine_readable_row(self):
        for part in ("html", "text"):
            match = DATA_BLOCK.search(self.mails["allplan"]["staff"][part])
            self.assertIsNotNone(match, part)
            row = json.loads(html.unescape(match.group(1)))
            self.assertEqual(row["urunAilesi"], "ALLPLAN")
            self.assertEqual(row["urunler"], "ALLPLAN Max, ALLPLAN Civil")
            self.assertEqual(row["eposta"], "deneme@example.com")
            self.assertEqual(row["tarih"], "2026-11-28T09:30:00.000Z")

    def test_user_text_is_escaped_in_html(self):
        for kind in ("staff", "customer"):
            body = self.mails["hostile"][kind]["html"]
            self.assertNotIn("<script>", body)
            self.assertNotIn("<b>Yapı</b>", body)
        staff = self.mails["hostile"]["staff"]["html"]
        self.assertIn("&lt;script&gt;alert(1)&lt;/script&gt;", staff)
        self.assertIn("A &amp; B &lt;b&gt;Yapı&lt;/b&gt;", staff)

    def test_subject_cannot_be_split_by_line_breaks(self):
        for name in self.mails:
            for kind in ("staff", "customer"):
                self.assertNotRegex(self.mails[name][kind]["subject"], r"[\r\n]")

    def test_customer_mail_confirms_receipt_with_products(self):
        mail = self.mails["allplan"]["customer"]
        self.assertEqual(mail["subject"], "Talebiniz bize ulaştı | Aluplan")
        self.assertIn("ALLPLAN Max", mail["html"])
        self.assertIn("Deneme Kullanıcı", mail["html"])

    def test_customer_mail_does_not_repeat_contact_details(self):
        body = self.mails["allplan"]["customer"]["html"]
        self.assertNotIn("05320000000", body)
        self.assertNotIn("deneme@example.com", body)

    def test_student_mails_use_the_student_wording(self):
        staff = self.mails["student"]["staff"]
        customer = self.mails["student"]["customer"]
        self.assertIn("Mimarlık", staff["html"])
        self.assertIn("https://info.allplan.com/en/demo-download/cad-software-v2.html", customer["html"])
        self.assertIn("kabul edilmez", customer["html"])
        self.assertIn("Öğrenci Kimlik Kartı", customer["html"])

    def test_plain_text_versions_have_no_markup(self):
        # "hostile" is left out: plain text carries the requester's own characters unchanged.
        for name in ("allplan", "student"):
            for kind in ("staff", "customer"):
                text = DATA_BLOCK.sub("", self.mails[name][kind]["text"])
                self.assertTrue(text.strip())
                self.assertNotRegex(text, r"<[a-zA-Z/]")


if __name__ == "__main__":
    unittest.main()
