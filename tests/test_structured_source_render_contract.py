import hashlib
import json
import unittest
from pathlib import Path

from scripts.verify_structured_source_contract import validate_base_url


ROOT = Path(__file__).resolve().parents[1]
CONTRACTS = json.loads(
    (ROOT / "tests/fixtures/structured_source_contracts.json").read_text(encoding="utf-8")
)
PAGES = json.loads((ROOT / "src/data/pages.json").read_text(encoding="utf-8"))


def flatten_units(blocks):
    units = []
    for block in blocks:
        content = block.get("content") or {}
        if isinstance(content, dict):
            units.extend(item for item in content.get("items") or [] if isinstance(item, dict))
            units.extend(item for item in content.get("actions") or [] if isinstance(item, dict))
        elif isinstance(content, list):
            units.extend(item for item in content if isinstance(item, dict))
        units.extend(item for item in block.get("items") or [] if isinstance(item, dict))
    return units


class StructuredSourceRenderContractTest(unittest.TestCase):
    def test_render_audit_only_accepts_loopback_origins(self):
        self.assertEqual(validate_base_url("http://127.0.0.1:3001"), "http://127.0.0.1:3001")
        self.assertEqual(validate_base_url("https://localhost:3001/"), "https://localhost:3001")
        for unsafe in (
            "https://aluplan.com.tr",
            "file:///tmp/site",
            "http://user:pass@127.0.0.1:3001",
            "http://127.0.0.1:3001/private",
        ):
            with self.subTest(unsafe=unsafe), self.assertRaises(ValueError):
                validate_base_url(unsafe)

    def test_source_evidence_hashes_are_stable(self):
        for route, contract in CONTRACTS.items():
            source_path = ROOT / contract["sourceFile"]
            digest = hashlib.sha256(source_path.read_bytes()).hexdigest()
            self.assertEqual(digest, contract["sourceSha256"], route)

    def test_industry_block_order_and_units_match_source_contract(self):
        layout = PAGES["/solutions/allplan-industry"]["structuredLayout"]
        blocks = layout.get("contentBlocks") or []
        self.assertEqual(
            [block.get("sourceId") for block in blocks],
            CONTRACTS["/solutions/allplan-industry"]["blockOrder"],
        )

        units = {unit.get("sourceId"): unit for unit in flatten_units(blocks)}
        for expected in CONTRACTS["/solutions/allplan-industry"]["units"]:
            actual = units.get(expected["sourceId"])
            self.assertIsNotNone(actual, expected["sourceId"])
            for key, value in expected.items():
                if key == "hrefs":
                    self.assertEqual([link["href"] for link in actual.get("links", [])], value)
                else:
                    self.assertEqual(actual.get(key), value, expected["sourceId"])

    def test_industry_card_images_are_local_and_resolve(self):
        layout = PAGES["/solutions/allplan-industry"]["structuredLayout"]
        units = flatten_units(layout.get("contentBlocks") or [])
        visual_units = [
            unit
            for unit in units
            if unit.get("sourceId", "").startswith("industry-")
            and (unit.get("imageSrc") or unit.get("iconSrc"))
        ]
        self.assertTrue(visual_units)
        for unit in visual_units:
            asset_path = unit.get("imageSrc") or unit.get("iconSrc")
            self.assertTrue(asset_path.startswith("/assets/"), unit["sourceId"])
            self.assertTrue((ROOT / "public" / asset_path.lstrip("/")).is_file(), unit["sourceId"])

    def test_ax3000_solution_keeps_all_ten_source_features(self):
        layout = PAGES["/solutions/ax3000"]["structuredLayout"]
        units = {unit.get("sourceId") for unit in flatten_units(layout.get("contentBlocks") or [])}
        self.assertTrue(
            set(CONTRACTS["/solutions/ax3000"]["requiredUnitIds"]).issubset(units)
        )

    def test_ax3000_product_keeps_two_source_callouts_separate(self):
        layout = PAGES["/products/ax3000"]["structuredLayout"]
        units = {unit.get("sourceId"): unit for unit in flatten_units(layout.get("contentBlocks") or [])}
        for expected in CONTRACTS["/products/ax3000"]["callouts"]:
            actual = units.get(expected["sourceId"])
            self.assertIsNotNone(actual, expected["sourceId"])
            self.assertEqual(actual.get("title"), expected["title"])
            self.assertEqual(actual.get("imageSrc"), expected["imageSrc"])

    def test_ax3000_vr_keeps_all_six_gallery_images(self):
        layout = PAGES["/solutions/ax3000-virtual-reality"]["structuredLayout"]
        units = {unit.get("sourceId"): unit for unit in flatten_units(layout.get("contentBlocks") or [])}
        for expected in CONTRACTS["/solutions/ax3000-virtual-reality"]["gallery"]:
            actual = units.get(expected["sourceId"])
            self.assertIsNotNone(actual, expected["sourceId"])
            self.assertEqual(actual.get("title"), expected["title"])
            self.assertEqual(actual.get("imageSrc"), expected["imageSrc"])

    def test_all_content_block_and_unit_ids_are_unique(self):
        for route in CONTRACTS:
            blocks = PAGES[route]["structuredLayout"].get("contentBlocks") or []
            block_ids = [block.get("sourceId") for block in blocks]
            unit_ids = [
                unit["sourceId"]
                for unit in flatten_units(blocks)
                if unit.get("sourceId") is not None
            ]
            self.assertNotIn(None, block_ids, route)
            self.assertEqual(len(block_ids), len(set(block_ids)), route)
            self.assertEqual(len(unit_ids), len(set(unit_ids)), route)


if __name__ == "__main__":
    unittest.main()
