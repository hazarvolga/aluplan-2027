"""The on-site quote form: one catalog drives every product line and its rules."""

from pathlib import Path
import json
import subprocess
import unittest


ROOT = Path(__file__).resolve().parents[1]


def run_runtime():
    result = subprocess.run(
        ["node", "tests/quote_form_runtime.mjs"],
        cwd=ROOT,
        check=True,
        capture_output=True,
        text=True,
    )
    return json.loads(result.stdout)


class QuoteFormTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.data = run_runtime()
        cls.results = cls.data["results"]

    def errors(self, name):
        result = self.results[name]
        self.assertFalse(result["ok"], name)
        return result["errors"]

    def value(self, name):
        result = self.results[name]
        self.assertTrue(result["ok"], f"{name}: {result.get('errors')}")
        return result["value"]

    def test_catalog_covers_every_agreed_product_line(self):
        self.assertEqual(
            self.data["lineIds"],
            [
                "allplan",
                "frilo-scia",
                "sds2",
                "ax3000",
                "bimx5",
                "bimflex",
                "cds-addon",
                "pythonpart",
                "scalypso",
                "aluplan-bim-eklentisi",
                "ogrenci",
            ],
        )

    def test_catalog_includes_allplan_max_and_bimplus(self):
        self.assertIn("allplan-max", self.data["productIds"])
        self.assertIn("bimplus", self.data["productIds"])

    def test_unreleased_products_stay_out_of_the_catalog(self):
        for hidden in ("allplan-parametric", "allplan-rebar"):
            self.assertNotIn(hidden, self.data["productIds"])

    def test_product_ids_are_unique_across_lines(self):
        ids = self.data["productIds"]
        self.assertEqual(len(ids), len(set(ids)))

    def test_valid_allplan_request_is_normalised(self):
        value = self.value("validAllplan")
        self.assertEqual(value["line"], "allplan")
        self.assertEqual(value["products"], ["allplan-max", "allplan-civil"])
        self.assertEqual(value["requestTypes"], ["fiyat-teklifi"])
        self.assertEqual(value["phone"], "05320000000")

    def test_empty_submission_reports_line_and_contact_fields(self):
        errors = self.errors("emptySubmission")
        for field in ("line", "fullName", "email", "phone", "company", "city", "workArea", "heardFrom", "consent"):
            self.assertIn(field, errors)

    def test_unknown_line_is_rejected(self):
        self.assertIn("line", self.errors("unknownLine"))

    def test_product_from_another_line_is_rejected(self):
        self.assertIn("products", self.errors("foreignProduct"))

    def test_multi_product_line_needs_at_least_one_product(self):
        self.assertIn("products", self.errors("noProducts"))

    def test_request_type_is_required_on_quote_lines(self):
        self.assertIn("requestTypes", self.errors("noRequestType"))

    def test_single_product_line_selects_its_product_automatically(self):
        self.assertEqual(self.value("singleProductLine")["products"], ["bimflex"])

    def test_sds2_accepts_a_known_job_title(self):
        self.assertEqual(self.value("sds2WithJobTitle")["jobTitle"], "steel-detailer")

    def test_sds2_rejects_an_unknown_job_title(self):
        self.assertIn("jobTitle", self.errors("sds2BadJobTitle"))

    def test_scalypso_needs_trial_or_quote_choice(self):
        self.assertIn("scalypsoMode", self.errors("scalypsoNoMode"))
        self.assertEqual(self.value("scalypsoTrial")["scalypsoMode"], "deneme")

    def test_bim_addon_needs_customer_number(self):
        self.assertIn("customerNumber", self.errors("bimAddonNoCustomerNumber"))
        self.assertEqual(self.value("bimAddonValid")["customerNumber"], "C300 000 000 0")

    def test_student_needs_document_acknowledgement(self):
        self.assertIn("documentAck", self.errors("studentMissingAck"))

    def test_student_work_area_is_always_student(self):
        value = self.value("studentValid")
        self.assertEqual(value["workArea"], "ogrenci")
        self.assertEqual(value["department"], "mimarlik")

    def test_contact_rules(self):
        self.assertIn("email", self.errors("badEmail"))
        self.assertIn("phone", self.errors("badPhone"))
        self.assertIn("consent", self.errors("noConsent"))
        self.assertIn("heardFrom", self.errors("noHeardFrom"))

    def test_filled_honeypot_is_rejected_without_field_errors(self):
        result = self.results["honeypotFilled"]
        self.assertFalse(result["ok"])
        self.assertEqual(result["errors"], {"form": "spam"})

    def test_preselection_from_url_slug(self):
        preselect = self.data["preselect"]
        self.assertEqual(preselect["line"], {"line": "sds2", "products": ["sds2"]})
        self.assertEqual(preselect["product"], {"line": "allplan", "products": ["allplan-max"]})
        self.assertEqual(preselect["unknown"], {"line": None, "products": []})
        self.assertEqual(preselect["empty"], {"line": None, "products": []})

    def test_student_download_points_to_the_vendor_page(self):
        self.assertEqual(
            self.data["studentDownloadUrl"],
            "https://info.allplan.com/en/demo-download/cad-software-v2.html",
        )


if __name__ == "__main__":
    unittest.main()
