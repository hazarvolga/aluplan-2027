"""Independent source-inventory to generated-data parity contract."""

import json
from pathlib import Path
import tempfile
import unittest

from scripts.verify_sitewide_source_parity import (
    _source_body_nodes,
    compare_snapshots,
    load_policy,
    structured_integrity_findings,
    validate_policy,
    verify_sitewide_source_parity,
)


ROOT = Path(__file__).resolve().parents[1]
POLICY = ROOT / "tests/fixtures/sitewide_parity_policy.json"


class SitewideSourceParityUnitTests(unittest.TestCase):
    def test_explicit_text_removal_is_exact_route_scoped_and_does_not_hide_other_losses(self):
        policy = {'textReplacements': [{'route': '/about', 'source': '29+', 'generated': '', 'reason': 'Approved removal'}]}
        page = {'text_nodes': ['29+', 'Yıllık Tecrübe', 'Other retained sentence']}
        self.assertEqual(_source_body_nodes('/about', page, policy), ['Yıllık Tecrübe', 'Other retained sentence'])
        self.assertEqual(_source_body_nodes('/other', page, policy), page['text_nodes'])
        expected = {'/about': {**self.source['/sample'], 'bodyText': _source_body_nodes('/about', page, policy)}}
        actual = {'/about': {**expected['/about'], 'bodyText': ['Other retained sentence']}}
        findings = compare_snapshots(expected, actual, {'exactOverrides': []})
        self.assertTrue(any(item['kind'] == 'missing' and item['expected'] == ['Yıllık Tecrübe'] for item in findings))

    def test_approved_removal_does_not_hide_a_second_matching_occurrence(self):
        policy = {'textReplacements': [{'route': '/about', 'source': '29+', 'generated': '', 'reason': 'Approved removal'}]}
        page = {'text_nodes': ['29+', 'Unrelated text', '29+']}
        expected_nodes = _source_body_nodes('/about', page, policy)
        self.assertEqual(expected_nodes, ['Unrelated text', '29+'])
        expected = {'/about': {**self.source['/sample'], 'bodyText': expected_nodes}}
        actual = {'/about': {**expected['/about'], 'bodyText': ['Unrelated text']}}
        findings = compare_snapshots(expected, actual, {'exactOverrides': []})
        self.assertTrue(any(item['kind'] == 'missing' and item['expected'] == ['29+'] for item in findings))

    def setUp(self):
        self.source = {
            "/sample": {
                "h1": "Sample",
                "headings": ["Sample", "Details"],
                "bodyText": ["Kept sentence"],
                "links": ["/target"],
                "images": [{"src": "/assets/sample.png", "alt": "Sample image"}],
                "videos": [],
                "embeds": ["https://www.youtube.com/embed/source"],
            }
        }
        self.generated = json.loads(json.dumps(self.source))

    def test_detects_every_contract_dimension_with_actionable_pointers(self):
        actual = {
            "/sample": {
                "h1": "Wrong",
                "headings": ["Details", "Sample"],
                "bodyText": [],
                "links": [],
                "images": [{"src": "/assets/sample.png", "alt": "Wrong alt"}],
                "videos": ["/assets/unproven.mp4"],
                "embeds": [],
            }
        }
        findings = compare_snapshots(self.source, actual, {"exactOverrides": []})
        dimensions = {item["dimension"] for item in findings}
        self.assertTrue(
            {"h1", "headings", "bodyText", "links", "images", "videos", "embeds"}
            <= dimensions
        )
        self.assertTrue(all(item["route"] == "/sample" for item in findings))
        self.assertTrue(all(item["pointer"].startswith("/") for item in findings))

    def test_detects_missing_and_unexpected_routes(self):
        findings = compare_snapshots(
            self.source,
            {"/unexpected": self.generated["/sample"]},
            {"exactOverrides": []},
        )
        kinds = {item["kind"] for item in findings}
        self.assertEqual(kinds, {"missing-route", "unexpected-route"})

    def test_rejects_generated_only_content_link_and_image(self):
        actual = json.loads(json.dumps(self.generated))
        actual["/sample"]["bodyText"].append("Injected marketing claim")
        actual["/sample"]["links"].append("https://tracker.invalid/collect")
        actual["/sample"]["images"].append(
            {"src": "https://tracker.invalid/pixel.png", "alt": "Tracking image"}
        )
        findings = compare_snapshots(self.source, actual, {"exactOverrides": []})
        unexpected = {
            item["dimension"]
            for item in findings
            if item["kind"] == "unexpected"
        }
        self.assertEqual(unexpected, {"bodyText", "links", "images"})

    def test_rejects_wrong_image_source_even_when_alt_matches(self):
        actual = json.loads(json.dumps(self.generated))
        actual["/sample"]["images"][0]["src"] = "/assets/wrong.png"
        findings = compare_snapshots(self.source, actual, {"exactOverrides": []})
        image_findings = [item for item in findings if item["dimension"] == "images"]
        self.assertEqual({item["kind"] for item in image_findings}, {"missing", "unexpected"})

    def test_rejects_unproven_external_url_inside_structured_layout(self):
        pages = {
            "/sample": {
                "structuredLayout": {
                    "extraGrids": [
                        {"items": [{"title": "Injected", "href": "https://tracker.invalid/collect"}]}
                    ]
                }
            }
        }
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            (root / "public").mkdir()
            findings = structured_integrity_findings(
                pages,
                self.source,
                root,
                {"exactOverrides": []},
            )
        self.assertEqual(len(findings), 1)
        self.assertEqual(findings[0]["kind"], "unexpected-external-url")

    def test_exact_override_suppresses_only_the_named_difference(self):
        actual = json.loads(json.dumps(self.generated))
        actual["/sample"]["h1"] = "Approved replacement"
        actual["/sample"]["headings"][0] = "Approved replacement"
        policy = {
            "exactOverrides": [
                {
                    "route": "/sample",
                    "dimension": "h1",
                    "source": "Sample",
                    "generated": "Approved replacement",
                    "reason": "Explicit fixture decision",
                }
            ]
        }
        self.assertEqual(compare_snapshots(self.source, actual, policy), [])

    def test_policy_rejects_wildcards_and_missing_evidence(self):
        with self.assertRaises(ValueError):
            validate_policy(
                {
                    "exactOverrides": [
                        {
                            "route": "/solutions/*",
                            "dimension": "h1",
                            "source": "x",
                            "generated": "y",
                            "reason": "too broad",
                        }
                    ]
                }
            )
        with self.assertRaises(ValueError):
            validate_policy(
                {
                    "exactOverrides": [
                        {
                            "route": "/sample",
                            "dimension": "h1",
                            "source": "x",
                            "generated": "y",
                        }
                    ]
                }
            )


class SitewideSourceParityIntegrationTests(unittest.TestCase):
    def test_real_dataset_has_102_routes_and_no_unapproved_findings(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            report = verify_sitewide_source_parity(
                root=ROOT,
                policy=load_policy(POLICY),
                output_dir=Path(temp_dir),
            )
        # 102 source routes minus /products/architecture (removed 2026-11-11, see removedRoutes).
        self.assertEqual(report["summary"]["sourceRoutes"], 101)
        self.assertEqual(report["summary"]["generatedRoutes"], 101)
        self.assertEqual(report["summary"]["failures"], 0, report["findings"][:10])
        self.assertEqual(len(report["routeResults"]), 101)
        self.assertTrue(
            all(item["status"] in {"pass", "approved_difference"} for item in report["routeResults"])
        )


if __name__ == "__main__":
    unittest.main()
