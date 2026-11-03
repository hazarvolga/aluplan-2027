"""Links that share an accessible name must lead to the same place (WCAG 2.4.4)."""

from collections import defaultdict
from html.parser import HTMLParser
from pathlib import Path
import re
import unittest


ROOT = Path(__file__).resolve().parents[1]
BUILD_APP = ROOT / ".next/server/app"


class MainLinks(HTMLParser):
    def __init__(self):
        super().__init__()
        self.in_main = False
        self.open_links: list[dict] = []
        self.links: list[tuple[str, str]] = []

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == "main":
            self.in_main = True
        if self.in_main and tag == "a":
            self.open_links.append({"href": attrs.get("href", ""), "label": attrs.get("aria-label"), "text": ""})

    def handle_endtag(self, tag):
        if tag == "main":
            self.in_main = False
        if tag == "a" and self.open_links:
            link = self.open_links.pop()
            name = re.sub(r"\s+", " ", link["label"] or link["text"]).strip()
            name = name.replace("(yeni sekmede açılır)", "").strip()
            self.links.append((name, link["href"]))

    def handle_data(self, data):
        if self.open_links:
            self.open_links[-1]["text"] += data


def ambiguous_names() -> dict[str, list[str]]:
    problems: dict[str, list[str]] = {}
    for html in sorted(BUILD_APP.rglob("*.html")):
        parser = MainLinks()
        parser.feed(html.read_text(encoding="utf-8"))
        destinations: dict[str, set[str]] = defaultdict(set)
        for name, href in parser.links:
            if name and href and not href.startswith("#"):
                destinations[name].add(href)
        clashes = sorted(name for name, hrefs in destinations.items() if len(hrefs) > 1)
        if clashes:
            problems[str(html.relative_to(BUILD_APP))] = clashes
    return problems


class LinkNameTests(unittest.TestCase):
    def test_no_page_has_one_link_name_for_different_destinations(self):
        if not BUILD_APP.is_dir():
            raise unittest.SkipTest("production build output missing")
        self.assertEqual(ambiguous_names(), {})


if __name__ == "__main__":
    unittest.main()
