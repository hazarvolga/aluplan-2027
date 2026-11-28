"""Mails built from a quote request: one for the sales team, one for the requester."""

from pathlib import Path
import base64
import json
import re
import subprocess
import unittest


ROOT = Path(__file__).resolve().parents[1]
DATA_BLOCK = re.compile(r"\[\[ALUPLAN-TALEP\]\]([A-Za-z0-9+/=]+)\[\[/ALUPLAN-TALEP\]\]")


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

    def read_row(self, name, part):
        match = DATA_BLOCK.search(self.mails[name]["staff"][part])
        self.assertIsNotNone(match, part)
        return json.loads(base64.b64decode(match.group(1)).decode("utf-8"))

    def test_staff_mail_carries_a_spreadsheet_row_keyed_by_column_header(self):
        for part in ("html", "text"):
            data = self.read_row("allplan", part)
            self.assertEqual(data["tablo"], "Talepler")
            row = data["satir"]
            self.assertEqual(
                list(row),
                ["Tarih", "Ürün Ailesi", "Ürünler", "Talep Türü", "Ad Soyad", "Firma", "E-posta", "GSM", "Şehir",
                 "Çalışma Alanı", "Nereden Duydu", "Scalypso", "İş Tanımı", "Müşteri No", "Notlar", "Kaynak Sayfa"],
            )
            self.assertEqual(row["Ürün Ailesi"], "ALLPLAN")
            self.assertEqual(row["Ürünler"], "ALLPLAN Max, ALLPLAN Civil")
            self.assertEqual(row["E-posta"], "deneme@example.com")

    def test_spreadsheet_row_date_is_turkish_local_time(self):
        # 09:30 UTC is 12:30 in Istanbul; the sortable form keeps month counting simple in the workbook.
        self.assertEqual(self.read_row("allplan", "html")["satir"]["Tarih"], "2026-11-28 12:30")

    def test_student_row_goes_to_the_student_table(self):
        data = self.read_row("student", "html")
        self.assertEqual(data["tablo"], "Ogrenci")
        self.assertEqual(
            list(data["satir"]),
            ["Tarih", "Ad Soyad", "Üniversite", "Bölüm", "E-posta", "GSM", "Şehir", "Nereden Duydu", "Notlar"],
        )
        self.assertEqual(data["satir"]["Bölüm"], "Mimarlık")

    def test_spreadsheet_row_survives_markup_in_user_text(self):
        self.assertEqual(self.read_row("hostile", "html")["satir"]["Firma"], "A & B <b>Yapı</b>")

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
