#!/usr/bin/env python3
"""Verify reviewed source evidence against generated structured page data.

The committed fixture is the CI authority. The sibling 2026 checkout is never
required and is never written. Passing ``--base-url`` additionally verifies that
each structured source id is present in the server-rendered HTML.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import sys
import urllib.error
import urllib.parse
import urllib.request
from html.parser import HTMLParser
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[1]
CONTRACT_PATH = ROOT / "tests/fixtures/structured_source_contracts.json"
PAGES_PATH = ROOT / "src/data/pages.json"


def load_json(path: Path) -> dict[str, Any]:
    return json.loads(path.read_text(encoding="utf-8"))


def flatten_units(blocks: list[dict[str, Any]]) -> list[dict[str, Any]]:
    units: list[dict[str, Any]] = []
    for block in blocks:
        content = block.get("content")
        if isinstance(content, dict):
            items = content.get("items")
            if isinstance(items, list):
                units.extend(item for item in items if isinstance(item, dict))
            actions = content.get("actions")
            if isinstance(actions, list):
                units.extend(item for item in actions if isinstance(item, dict))
        elif isinstance(content, list):
            units.extend(item for item in content if isinstance(item, dict))

        items = block.get("items")
        if isinstance(items, list):
            units.extend(item for item in items if isinstance(item, dict))
    return units


def validate_base_url(base_url: str) -> str:
    parsed = urllib.parse.urlparse(base_url)
    if (
        parsed.scheme not in {"http", "https"}
        or parsed.hostname not in {"127.0.0.1", "localhost", "::1"}
        or parsed.username
        or parsed.password
        or parsed.path not in {"", "/"}
        or parsed.params
        or parsed.query
        or parsed.fragment
    ):
        raise ValueError("--base-url must be an HTTP(S) loopback origin")
    return base_url.rstrip("/")


class HtmlNode:
    def __init__(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        self.tag = tag
        self.attrs = {key: value or "" for key, value in attrs}
        self.children: list[HtmlNode] = []
        self.text_parts: list[str] = []

    def text(self) -> str:
        parts = list(self.text_parts)
        for child in self.children:
            parts.append(child.text())
        return " ".join(" ".join(parts).split())

    def descendant_attributes(self, name: str) -> list[str]:
        values = [self.attrs[name]] if name in self.attrs else []
        for child in self.children:
            values.extend(child.descendant_attributes(name))
        return values


class ContractHtmlParser(HTMLParser):
    VOID_TAGS = {"area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "source", "track", "wbr"}

    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.root = HtmlNode("document", [])
        self.stack = [self.root]

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        node = HtmlNode(tag, attrs)
        self.stack[-1].children.append(node)
        if tag not in self.VOID_TAGS:
            self.stack.append(node)

    def handle_startendtag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        self.stack[-1].children.append(HtmlNode(tag, attrs))

    def handle_endtag(self, tag: str) -> None:
        for index in range(len(self.stack) - 1, 0, -1):
            if self.stack[index].tag == tag:
                del self.stack[index:]
                return

    def handle_data(self, data: str) -> None:
        if data.strip():
            self.stack[-1].text_parts.append(data)

    def source_nodes(self) -> dict[str, list[HtmlNode]]:
        nodes: dict[str, list[HtmlNode]] = {}

        def visit(node: HtmlNode) -> None:
            source_id = node.attrs.get("data-source-id")
            if source_id:
                nodes.setdefault(source_id, []).append(node)
            for child in node.children:
                visit(child)

        visit(self.root)
        return nodes


def validate_generated(
    contracts: dict[str, Any], pages: dict[str, Any]
) -> list[dict[str, str]]:
    failures: list[dict[str, str]] = []

    def fail(route: str, pointer: str, message: str) -> None:
        failures.append({"route": route, "pointer": pointer, "message": message})

    for route, contract in contracts.items():
        source_path = ROOT / contract["sourceFile"]
        digest = hashlib.sha256(source_path.read_bytes()).hexdigest()
        if digest != contract["sourceSha256"]:
            fail(route, "/sourceSha256", f"source evidence changed: {digest}")

        layout = (pages.get(route) or {}).get("structuredLayout") or {}
        blocks = layout.get("contentBlocks") or []
        canonical_blocks = json.dumps(
            blocks,
            ensure_ascii=False,
            sort_keys=True,
            separators=(",", ":"),
        ).encode("utf-8")
        blocks_digest = hashlib.sha256(canonical_blocks).hexdigest()
        if blocks_digest != contract.get("contentBlocksSha256"):
            fail(
                route,
                "/contentBlocksSha256",
                f"structured content contract changed: {blocks_digest}",
            )
        block_ids = [block.get("sourceId") for block in blocks]
        if contract.get("blockOrder") and block_ids != contract["blockOrder"]:
            fail(route, "/contentBlocks", f"block order mismatch: {block_ids}")

        units_list = flatten_units(blocks)
        unit_ids = [
            unit["sourceId"]
            for unit in units_list
            if unit.get("sourceId") is not None
        ]
        units = {unit.get("sourceId"): unit for unit in units_list}

        if None in block_ids or len(block_ids) != len(set(block_ids)):
            fail(route, "/contentBlocks", "block source ids must be present and unique")
        if len(unit_ids) != len(set(unit_ids)):
            fail(route, "/contentBlocks/*/items", "unit source ids must be unique")

        expected_units = list(contract.get("units") or [])
        expected_units.extend(contract.get("callouts") or [])
        expected_units.extend(contract.get("gallery") or [])
        for expected in expected_units:
            source_id = expected["sourceId"]
            actual = units.get(source_id)
            if actual is None:
                fail(route, f"/{source_id}", "missing structured source unit")
                continue
            for key, expected_value in expected.items():
                if key == "hrefs":
                    actual_value = [link.get("href") for link in actual.get("links") or []]
                else:
                    actual_value = actual.get(key)
                if actual_value != expected_value:
                    fail(
                        route,
                        f"/{source_id}/{key}",
                        f"expected {expected_value!r}, got {actual_value!r}",
                    )

            image_src = actual.get("imageSrc")
            if isinstance(image_src, str) and image_src.startswith("/assets/"):
                if not (ROOT / "public" / image_src.lstrip("/")).is_file():
                    fail(route, f"/{source_id}/imageSrc", f"missing asset: {image_src}")

        for required_id in contract.get("requiredUnitIds") or []:
            if required_id not in units:
                fail(route, f"/{required_id}", "missing required structured source unit")

    return failures


def validate_rendered(
    base_url: str, contracts: dict[str, Any], pages: dict[str, Any]
) -> list[dict[str, str]]:
    failures: list[dict[str, str]] = []
    base_url = validate_base_url(base_url)
    for route, contract in contracts.items():
        url = f"{base_url}{route}"
        try:
            with urllib.request.urlopen(url, timeout=15) as response:
                html = response.read().decode("utf-8", errors="replace")
        except (urllib.error.URLError, TimeoutError) as error:
            failures.append({"route": route, "pointer": "/html", "message": str(error)})
            continue

        parser = ContractHtmlParser()
        parser.feed(html)
        source_nodes = parser.source_nodes()
        blocks = pages[route]["structuredLayout"].get("contentBlocks") or []
        expected_ids = [block["sourceId"] for block in blocks]
        expected_ids.extend(
            unit["sourceId"]
            for unit in flatten_units(blocks)
            if unit.get("sourceId") is not None
        )
        for source_id in expected_ids:
            count = len(source_nodes.get(source_id, []))
            if count != 1:
                failures.append(
                    {
                        "route": route,
                        "pointer": f"/{source_id}",
                        "message": f"expected one rendered marker, found {count}",
                    }
                )

        expected_units = list(contract.get("units") or [])
        expected_units.extend(contract.get("callouts") or [])
        expected_units.extend(contract.get("gallery") or [])
        for expected in expected_units:
            source_id = expected["sourceId"]
            nodes = source_nodes.get(source_id) or []
            if len(nodes) != 1:
                continue
            node = nodes[0]
            rendered_text = node.text()
            for field in ("title", "description", "text"):
                expected_text = expected.get(field)
                if expected_text and " ".join(expected_text.split()) not in rendered_text:
                    failures.append(
                        {
                            "route": route,
                            "pointer": f"/{source_id}/{field}",
                            "message": "expected source text is absent from rendered unit",
                        }
                    )

            expected_hrefs = list(expected.get("hrefs") or [])
            if expected.get("href"):
                expected_hrefs.append(expected["href"])
            rendered_hrefs = node.descendant_attributes("href")
            for href in expected_hrefs:
                if href not in rendered_hrefs:
                    failures.append(
                        {
                            "route": route,
                            "pointer": f"/{source_id}/href",
                            "message": f"expected rendered href is absent: {href}",
                        }
                    )

            expected_src = expected.get("imageSrc") or expected.get("iconSrc")
            if expected_src and expected_src not in node.descendant_attributes("src"):
                failures.append(
                    {
                        "route": route,
                        "pointer": f"/{source_id}/src",
                        "message": f"expected rendered image is absent: {expected_src}",
                    }
                )

        route_text = parser.root.text()
        for expected_text in contract.get("renderedTexts") or []:
            if " ".join(expected_text.split()) not in route_text:
                failures.append(
                    {
                        "route": route,
                        "pointer": "/renderedTexts",
                        "message": f"expected route text is absent: {expected_text}",
                    }
                )
        route_hrefs = parser.root.descendant_attributes("href")
        for href in contract.get("renderedHrefs") or []:
            if href not in route_hrefs:
                failures.append(
                    {
                        "route": route,
                        "pointer": "/renderedHrefs",
                        "message": f"expected route href is absent: {href}",
                    }
                )
        route_image_srcs = parser.root.descendant_attributes("src")
        for image_src in contract.get("renderedImageSrcs") or []:
            if image_src not in route_image_srcs:
                failures.append(
                    {
                        "route": route,
                        "pointer": "/renderedImageSrcs",
                        "message": f"expected route image is absent: {image_src}",
                    }
                )
    return failures


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--base-url", help="Optional local production server URL")
    parser.add_argument("--json", action="store_true", help="Emit machine-readable output")
    args = parser.parse_args()

    contracts = load_json(CONTRACT_PATH)
    pages = load_json(PAGES_PATH)
    failures = validate_generated(contracts, pages)
    if args.base_url:
        failures.extend(validate_rendered(args.base_url, contracts, pages))

    result = {
        "routes": len(contracts),
        "status": "pass" if not failures else "fail",
        "failures": failures,
    }
    if args.json:
        print(json.dumps(result, ensure_ascii=False, indent=2))
    elif failures:
        for failure in failures:
            print(
                f"FAIL {failure['route']} {failure['pointer']}: {failure['message']}",
                file=sys.stderr,
            )
    else:
        print(f"Structured source contract passed for {len(contracts)} routes.")
    return 1 if failures else 0


if __name__ == "__main__":
    raise SystemExit(main())
