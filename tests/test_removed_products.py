"""/products/architecture is not an ALLPLAN product (decision 2026-11-11): the page is removed
and its URL redirects permanently to the architecture solution page, so links and search
results that still point at it keep working."""

from pathlib import Path
import json
import unittest


ROOT = Path(__file__).resolve().parents[1]
REMOVED = "/products/architecture"


def read(path: str) -> str:
    return (ROOT / path).read_text(encoding="utf-8")


class RemovedProductTests(unittest.TestCase):
    def test_page_is_not_generated(self):
        self.assertNotIn(REMOVED, json.loads(read("src/data/pages.json")))
        self.assertIn(f'"{REMOVED}"', read("scripts/generate_site_data.py").split("REMOVED_ROUTES = (")[1].split(")")[0])

    def test_url_redirects_permanently_to_the_solution_page(self):
        config = read("next.config.mjs")
        self.assertIn(f"{{ source: '{REMOVED}', destination: '/solutions/architecture', statusCode: 301 }}", config)

    def test_nothing_links_or_indexes_the_removed_page(self):
        for path in ("src/data/navigation.json", "src/data/homepage.json", "src/data/search-index.json",
                     "src/lib/schema.ts", "src/components/sections/subpage-hero-presentation.ts"):
            with self.subTest(file=path):
                self.assertNotIn(REMOVED, read(path))


if __name__ == "__main__":
    unittest.main()
