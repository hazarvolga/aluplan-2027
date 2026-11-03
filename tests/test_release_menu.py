"""Release-only pages are listed in the products menu only while the 2027 release content is on."""

from pathlib import Path
import json
import unittest


ROOT = Path(__file__).resolve().parents[1]
SHELL = (ROOT / "src/components/shell/SiteShell.tsx").read_text(encoding="utf-8")
RELEASE_ITEMS = {
    "ALLPLAN Rebar": "/products/allplan-rebar",
    "ALLPLAN Parametric": "/products/allplan-parametric",
}


def allplan_group() -> list[dict]:
    navigation = json.loads((ROOT / "src/data/navigation.json").read_text(encoding="utf-8"))
    return next(group for group in navigation["productsMenu"] if group["title"] == "ALLPLAN")["items"]


class ReleaseMenuTests(unittest.TestCase):
    def test_rebar_and_parametric_follow_the_four_editions_and_are_release_only(self):
        items = allplan_group()
        names = [item["name"] for item in items]
        self.assertEqual(names[:6], ["ALLPLAN Basic", "ALLPLAN Concept", "ALLPLAN Professional", "ALLPLAN Ultimate", "ALLPLAN Rebar", "ALLPLAN Parametric"])
        for item in items:
            if item["name"] in RELEASE_ITEMS:
                self.assertEqual(item["href"], RELEASE_ITEMS[item["name"]])
                self.assertIs(item.get("releaseOnly"), True)
            else:
                self.assertNotIn("releaseOnly", item)

    def test_shell_hides_release_only_items_in_the_desktop_and_mobile_menus(self):
        self.assertIn("releaseOnly", SHELL)
        self.assertEqual(SHELL.count("visibleItems(sec.items)"), 2)
        self.assertNotIn("sec.items.map", SHELL)


if __name__ == "__main__":
    unittest.main()
