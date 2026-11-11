"""Site search ranks title matches first and filters by scope (all / akademi / site)."""

from pathlib import Path
import json
import subprocess
import unittest


ROOT = Path(__file__).resolve().parents[1]


def rank(query: str, scope: str = "all"):
    result = subprocess.run(["node", "tests/search_rank_runtime.mjs", query, scope],
                            cwd=ROOT, check=True, capture_output=True, text=True)
    return json.loads(result.stdout)


class SearchRankTests(unittest.TestCase):
    def test_title_match_ranks_first(self):
        self.assertEqual(rank("duvar"), ["/a", "/akademi/y", "/akademi/x"])

    def test_scope_akademi_filters_site(self):
        self.assertEqual(rank("duvar", "akademi"), ["/akademi/y", "/akademi/x"])

    def test_scope_site(self):
        self.assertEqual(rank("duvar", "site"), ["/a"])

    def test_empty_query_respects_scope(self):
        self.assertEqual(rank("", "akademi"), ["/akademi/x", "/akademi/y"])

    def test_turkish_and_case_insensitive(self):
        self.assertEqual(rank("PARAPET"), ["/akademi/x"])
        self.assertEqual(rank("Zelle Definieren"), ["/akademi/y"])


if __name__ == "__main__":
    unittest.main()
