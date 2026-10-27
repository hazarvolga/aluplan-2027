"""Runtime contracts for JSON-LD emitted by the TypeScript schema builder."""

from pathlib import Path
import json
import subprocess
import unittest


ROOT = Path(__file__).resolve().parents[1]


def render_schema(route: str) -> dict:
    result = subprocess.run(
        ["node", "tests/schema_runtime.mjs", route],
        cwd=ROOT,
        check=True,
        capture_output=True,
        text=True,
    )
    return json.loads(result.stdout)


def graph_entity(schema: dict, entity_type: str) -> dict:
    return next(
        entity
        for entity in schema["@graph"]
        if entity.get("@type") == entity_type
        or entity_type in entity.get("@type", [])
    )


def visible_faq_answer(item: dict) -> str:
    parts = [item["answer"]]
    parts.extend(item.get("bullets", []))
    table = item.get("table")
    if table:
        parts.extend(table.get("headers", []))
        parts.extend(cell for row in table.get("rows", []) for cell in row)
    if item.get("note"):
        parts.append(item["note"])
    return " ".join(part for part in parts if part)


class SchemaRuntimeTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.pages = json.loads((ROOT / "src/data/pages.json").read_text(encoding="utf-8"))

    def test_faq_schema_matches_all_visible_questions_in_order(self):
        page = self.pages["/solutions-v2/faq"]
        expected_items = [
            item
            for category in page["structuredLayout"]["faqDirectory"]["categories"]
            for item in category["items"]
        ]
        faq_page = graph_entity(render_schema(page["path"]), "FAQPage")

        self.assertEqual(len(faq_page["mainEntity"]), 25)
        self.assertEqual(
            [entry["name"] for entry in faq_page["mainEntity"]],
            [item["question"] for item in expected_items],
        )
        self.assertEqual(
            [entry["acceptedAnswer"]["text"] for entry in faq_page["mainEntity"]],
            [visible_faq_answer(item) for item in expected_items],
        )

    def test_service_schema_uses_unique_canonical_entity_ids(self):
        service_pages = [
            page for page in self.pages.values() if page["schemaType"] == "Service"
        ]
        service_ids = [
            graph_entity(render_schema(page["path"]), "Service")["@id"]
            for page in service_pages
        ]

        self.assertEqual(len(service_pages), 8)
        self.assertEqual(
            service_ids,
            [f'{page["canonical"]}#service' for page in service_pages],
        )
        self.assertEqual(len(set(service_ids)), len(service_ids))

    def test_organization_schema_uses_generated_site_identity(self):
        navigation = json.loads(
            (ROOT / "src/data/navigation.json").read_text(encoding="utf-8")
        )
        identity = navigation["siteIdentity"]
        organization = graph_entity(render_schema("/contact"), "Organization")

        self.assertEqual(organization["name"], identity["name"])
        self.assertEqual(organization["description"], identity["description"])
        self.assertEqual(organization["foundingDate"], identity["foundingDate"])
        self.assertEqual(organization["email"], identity["email"])
        self.assertEqual(organization["telephone"], identity["telephone"])
        self.assertEqual(organization["address"], identity["address"])
        self.assertEqual(organization["sameAs"], identity["sameAs"])


if __name__ == "__main__":
    unittest.main()
