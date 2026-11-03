#!/usr/bin/env python3
"""Verify committed live inventory against generated site data.

This verifier intentionally does not import generator helpers. Its normalizers
form an independent contract so a generator regression cannot validate itself.
"""

from __future__ import annotations

import argparse
from collections import Counter
import hashlib
import json
from pathlib import Path
import re
from typing import Optional
import unicodedata
from urllib.parse import parse_qs, unquote, urlsplit


BASE_URL = "https://aluplan.com.tr"
GLOBAL_TEXT = {
    "İçeriğe geç",
    "info@aluplan.com.tr",
    "[email protected]",
    "Çözümler",
    "Ürünler",
    "Kaynaklar",
    "Referanslar",
    "Hakkımızda",
    "İletişim",
    "Toggle theme",
    "Ücretsiz Deneme",
    "Teklif Talep Formu",
}
GLOBAL_HEADING_TEXT = {
    "Ürünler",
    "ÇÖZÜMLER",
    "İletişim",
    "ALLPLAN'ı ücretsiz deneyin",
    "DAHA İYİ YARINLAR İNŞA ETMEK İÇİN TASARIM",
}
FOOTER_MARKER = (
    "1995'ten beri Türkiye'nin güvenilir Allplan distribütörü. Mimari ve "
    "mühendislik projeleriniz için profesyonel BIM çözümleri."
)
CTA_MARKER = "DAHA İYİ YARINLAR İNŞA ETMEK İÇİN TASARIM"
WILDCARD_CHARS = {"*", "?", "[", "]", "{", "}"}


def clean_text(value: object) -> str:
    text = unicodedata.normalize("NFC", str(value or ""))
    text = text.replace("[email\u00a0protected]", "info@aluplan.com.tr")
    return re.sub(r"\s+", " ", text).strip()


def route_for_url(url: str) -> str:
    path = urlsplit(url).path.rstrip("/")
    return path or "/"


def _rename_route(route: str, policy: dict) -> str:
    return policy.get("routeRenames", {}).get(route, route)


def load_policy(path: Path) -> dict:
    policy = json.loads(path.read_text(encoding="utf-8"))
    validate_policy(policy)
    return policy


def validate_policy(policy: dict) -> None:
    default_evidence = clean_text(policy.get("defaultEvidence"))
    for override in policy.get("exactOverrides", []):
        required = {"route", "dimension", "source", "generated", "reason"}
        missing = required - set(override)
        if missing:
            raise ValueError(f"Exact override is missing {sorted(missing)}")
        route = str(override["route"])
        if any(char in route for char in WILDCARD_CHARS):
            raise ValueError(f"Wildcard route is not allowed: {route}")
        if not clean_text(override["reason"]):
            raise ValueError(f"Exact override needs evidence: {route}")
        if not clean_text(override.get("evidence")) and not default_evidence:
            raise ValueError(f"Exact override needs an evidence pointer: {route}")

    for old, new in policy.get("routeRenames", {}).items():
        if any(char in old + new for char in WILDCARD_CHARS):
            raise ValueError(f"Wildcard route rename is not allowed: {old}")

    for key in ("excludedRoutes", "linkReplacements", "textReplacements", "imageReplacements"):
        for item in policy.get(key, []):
            if not clean_text(item.get("reason")):
                raise ValueError(f"{key} item needs a reason")
            if not clean_text(item.get("evidence")) and not default_evidence:
                raise ValueError(f"{key} item needs an evidence pointer")
            for value in item.values():
                if isinstance(value, str) and any(char in value for char in WILDCARD_CHARS):
                    raise ValueError(f"Wildcard policy value is not allowed: {value}")


def _replace_link(href: str, policy: dict, route: str = "") -> str:
    value = href.strip()
    parsed = urlsplit(value)
    if parsed.netloc == "aluplan.com.tr":
        value = parsed.path or "/"
        if parsed.query:
            value += f"?{parsed.query}"
        if parsed.fragment:
            value += f"#{parsed.fragment}"
    if value.rstrip("/") == "https://www.allplan.com/trial-or-subscription":
        value = "https://www.allplan.com/trial-or-subscription/"
    if value.startswith("/cdn-cgi/l/email-protection"):
        value = "mailto:info@aluplan.com.tr"
    base = value.split("#")[0].split("?")[0]
    renamed = _rename_route(base.rstrip("/") or "/", policy)
    if renamed != (base.rstrip("/") or "/"):
        value = renamed + value[len(base):]
    for replacement in policy.get("linkReplacements", []):
        if (
            (not replacement.get("route") or replacement["route"] == route)
            and value.rstrip("/") == str(replacement["source"]).rstrip("/")
        ):
            return str(replacement["generated"])
    return value


def _replace_text(route: str, value: str, policy: dict) -> str:
    result = value
    for replacement in policy.get("textReplacements", []):
        if replacement["route"] == route and result == replacement["source"]:
            result = replacement["generated"]
    return result


def _source_body_nodes(route: str, page: dict, policy: dict) -> list[str]:
    nodes = [clean_text(item) for item in page.get("text_nodes", []) if clean_text(item)]
    start = 0
    while start < min(len(nodes), 14) and nodes[start] in GLOBAL_TEXT:
        start += 1
    if start < len(nodes) and nodes[start] == "Ana Sayfa":
        start += 2
        if start < len(nodes) and nodes[start] == "Ana Sayfaya Dön":
            start += 1

    end = len(nodes)
    if FOOTER_MARKER in nodes:
        end = nodes.index(FOOTER_MARKER)
    if route != "/" and CTA_MARKER in nodes[:end]:
        marker = nodes[:end].index(CTA_MARKER)
        end = marker - 1 if marker and nodes[marker - 1] == "ALLPLAN" else marker
    return [_replace_text(route, item, policy) for item in nodes[start:end]]


def normalize_native_video_src(src: str) -> str:
    path = urlsplit(src).path
    prefix = "/_next/static/chunks/assets/"
    if path.startswith(prefix):
        relative = path[len(prefix) :]
        relative = re.sub(r"\.[0-9a-f]{16}(?=\.mp4$)", "", relative)
        return f"/assets/{relative}"
    return path


def _unwrap_image(src: str) -> str:
    parsed = urlsplit(src)
    if parsed.path == "/_next/image":
        wrapped = parse_qs(parsed.query).get("url", [""])[0]
        return unquote(wrapped)
    return src


def _source_image_hashes(media_inventory: dict) -> dict[str, str]:
    hashes = {
        str(item["url"]): f"sha256:{item['sha256']}"
        for item in media_inventory.get("image_results", [])
        if item.get("url") and item.get("sha256")
    }
    for item in media_inventory.get("root_assets", []):
        current = item.get("current") or {}
        sha = current.get("sha256")
        path = str(item.get("path") or "")
        if not sha or not path:
            continue
        public_path = f"/{path[len('public/'):]}" if path.startswith("public/") else f"/{path}"
        hashes[public_path] = f"sha256:{sha}"
        if item.get("old_public_url"):
            hashes[str(item["old_public_url"])] = f"sha256:{sha}"
    return hashes


def _source_image_identity(src: str, hashes: dict[str, str], root: Optional[Path] = None) -> str:
    unwrapped = _unwrap_image(src)
    if unwrapped.startswith("/"):
        absolute = f"{BASE_URL}{unwrapped}"
        if absolute in hashes:
            return hashes[absolute]
        if unwrapped in hashes:
            return hashes[unwrapped]
        return unwrapped
    return hashes.get(unwrapped, unwrapped)


def _replace_image(src: str, policy: dict, root: Optional[Path]) -> str:
    for replacement in policy.get("imageReplacements", []):
        if src == replacement["source"]:
            return _generated_image_identity(replacement["generated"], root) if root else replacement["generated"]
    return src


def _generated_image_identity(src: str, root: Path) -> str:
    if not src.startswith("/"):
        return src
    target = (root / "public" / src.lstrip("/")).resolve()
    public = (root / "public").resolve()
    if public not in target.parents or not target.is_file():
        return src
    return f"sha256:{hashlib.sha256(target.read_bytes()).hexdigest()}"


def _source_snapshot(
    inventory: dict,
    policy: dict,
    image_hashes: Optional[dict[str, str]] = None,
    root: Optional[Path] = None,
) -> dict[str, dict]:
    image_hashes = image_hashes or {}
    excluded = {item["route"] for item in policy.get("excludedRoutes", [])}
    snapshot: dict[str, dict] = {}
    for page in inventory.get("pages", []):
        if page.get("status") != 200:
            continue
        route = route_for_url(page["url"])
        if route in excluded:
            continue
        route = _rename_route(route, policy)
        headings = [
            clean_text(item.get("text"))
            for item in page.get("headings", [])
            if clean_text(item.get("text"))
            and clean_text(item.get("text")) not in GLOBAL_HEADING_TEXT
        ]
        h1 = next(
            (
                clean_text(item.get("text"))
                for item in page.get("headings", [])
                if item.get("level") == 1 and clean_text(item.get("text"))
            ),
            "",
        )
        links = []
        for item in page.get("links", []):
            if item.get("location") in {"header", "nav", "footer"}:
                continue
            href = str((item.get("attributes") or {}).get("href") or "")
            if not href or href in {"#main", "#main-content"} or "nitrocdn.com" in href:
                continue
            if href == "#" and route != "/products/precast-detail":
                continue
            links.append(_replace_link(href, policy, route))
        images = []
        for item in page.get("images", []):
            if item.get("location") != "content":
                continue
            attrs = item.get("attributes") or {}
            images.append(
                {
                    "src": _replace_image(
                        _source_image_identity(str(attrs.get("src") or ""), image_hashes, root),
                        policy,
                        root,
                    ),
                    "alt": clean_text(attrs.get("alt")),
                }
            )
        videos = {
            normalize_native_video_src(str((item.get("attributes") or {}).get("src") or ""))
            for item in page.get("media", [])
            if item.get("tag") in {"video", "source"}
            and (item.get("attributes") or {}).get("src")
        }
        embeds = {
            str((item.get("attributes") or {}).get("src") or "")
            for item in page.get("embeds", [])
            if (item.get("attributes") or {}).get("src")
        }
        snapshot[route] = {
            "h1": h1,
            "headings": headings,
            "bodyText": _source_body_nodes(route, page, policy),
            "links": sorted(set(links)),
            "images": images,
            "videos": sorted(videos),
            "embeds": sorted(embeds),
        }
    return snapshot


def _generated_snapshot(pages: dict, root: Optional[Path] = None) -> dict[str, dict]:
    snapshot: dict[str, dict] = {}
    for route, page in pages.items():
        raw_images = [
            {"src": str(item.get("src") or ""), "alt": clean_text(item.get("alt"))}
            for item in page.get("images", [])
        ]
        images = [
            {
                "src": _generated_image_identity(item["src"], root) if root else item["src"],
                "alt": item["alt"],
            }
            for item in raw_images
        ]
        snapshot[route] = {
            "h1": clean_text(page.get("h1")),
            "headings": [clean_text(page.get("h1"))]
            + [clean_text(item.get("text")) for item in page.get("headings", []) if clean_text(item.get("text"))],
            "bodyText": [clean_text(item) for item in page.get("bodyNodes", [])],
            "links": sorted(
                {
                    str(item.get("href"))
                    for item in page.get("contentLinks", [])
                    if item.get("href") and item.get("href") != "#"
                }
            ),
            "images": images,
            "videos": sorted(
                {normalize_native_video_src(str(item.get("src") or "")) for item in page.get("videos", [])}
            ),
            "embeds": sorted({str(item.get("src") or "") for item in page.get("embeds", [])}),
        }
    return snapshot


def _is_subsequence(expected: list[str], actual: list[str]) -> bool:
    position = 0
    for value in actual:
        if position < len(expected) and value == expected[position]:
            position += 1
    return position == len(expected)


def _approved(route: str, dimension: str, source: object, generated: object, policy: dict) -> bool:
    return any(
        item["route"] == route
        and item["dimension"] == dimension
        and item["source"] == source
        and item["generated"] == generated
        for item in policy.get("exactOverrides", [])
    )


def _finding(route: str, dimension: str, kind: str, expected: object, actual: object, pointer: str) -> dict:
    return {
        "route": route,
        "dimension": dimension,
        "kind": kind,
        "expected": expected,
        "actual": actual,
        "pointer": pointer,
    }


def compare_snapshots(source: dict, generated: dict, policy: dict) -> list[dict]:
    findings: list[dict] = []
    for route in sorted(set(source) - set(generated)):
        findings.append(_finding(route, "route", "missing-route", True, False, f"/{route.lstrip('/')}"))
    for route in sorted(set(generated) - set(source)):
        findings.append(_finding(route, "route", "unexpected-route", False, True, f"/{route.lstrip('/')}"))

    for route in sorted(set(source) & set(generated)):
        expected = source[route]
        actual = generated[route]
        if expected["h1"] != actual["h1"] and not _approved(
            route, "h1", expected["h1"], actual["h1"], policy
        ):
            findings.append(_finding(route, "h1", "mismatch", expected["h1"], actual["h1"], "/h1"))

        expected_headings = list(expected["headings"])
        if expected_headings and _approved(
            route, "h1", expected["h1"], actual["h1"], policy
        ):
            expected_headings[0] = actual["h1"]
        headings_approved = _approved(
            route, "headings", expected_headings, actual["headings"], policy
        )
        if not headings_approved and not _is_subsequence(expected_headings, actual["headings"]):
            findings.append(
                _finding(route, "headings", "order-or-value-mismatch", expected_headings, actual["headings"], "/headings")
            )

        for dimension in ("bodyText", "links", "videos", "embeds"):
            missing = list((Counter(expected[dimension]) - Counter(actual[dimension])).elements())
            unexpected = list((Counter(actual[dimension]) - Counter(expected[dimension])).elements())
            if missing:
                findings.append(_finding(route, dimension, "missing", missing, [], f"/{dimension}"))
            if unexpected:
                findings.append(_finding(route, dimension, "unexpected", [], unexpected, f"/{dimension}"))

        expected_images = {(item["src"], item["alt"]) for item in expected["images"]}
        actual_images = {(item["src"], item["alt"]) for item in actual["images"]}
        missing_images = sorted(expected_images - actual_images)
        unexpected_images = sorted(actual_images - expected_images)
        if missing_images:
            findings.append(_finding(route, "images", "missing", missing_images, [], "/images"))
        if unexpected_images:
            findings.append(_finding(route, "images", "unexpected", [], unexpected_images, "/images"))
    return findings


def _local_asset_findings(root: Path, generated: dict) -> list[dict]:
    findings = []
    public = (root / "public").resolve()
    for route, page in generated.items():
        for dimension in ("images", "videos"):
            for index, item in enumerate(page[dimension]):
                src = item["src"] if isinstance(item, dict) else item
                if not src.startswith("/"):
                    continue
                target = (public / src.lstrip("/")).resolve()
                if public not in target.parents or not target.is_file():
                    findings.append(
                        _finding(route, "localAssets", "missing-or-outside-public", src, False, f"/{dimension}/{index}/src")
                    )
    return findings


def structured_integrity_findings(
    pages: dict, source: dict, root: Path, policy: dict
) -> list[dict]:
    """Reject unsafe/unproven structured URLs and broken structured assets."""
    findings: list[dict] = []
    public = (root / "public").resolve()

    def walk(route: str, value: object, pointer: str) -> None:
        if isinstance(value, list):
            for index, item in enumerate(value):
                walk(route, item, f"{pointer}/{index}")
            return
        if not isinstance(value, dict):
            return
        for key, child in value.items():
            child_pointer = f"{pointer}/{key}"
            if isinstance(child, str) and key in {
                "href",
                "ctaHref",
                "imageSrc",
                "iconSrc",
                "videoSrc",
                "videoEmbedUrl",
            }:
                if child.startswith("/") and key in {"imageSrc", "iconSrc", "videoSrc"}:
                    target = (public / child.lstrip("/")).resolve()
                    if public not in target.parents or not target.is_file():
                        findings.append(
                            _finding(route, "structuredLayout", "missing-or-outside-public", child, False, child_pointer)
                        )
                elif child.startswith(("http://", "https://")):
                    host = urlsplit(child).netloc.lower()
                    source_urls = set(source.get(route, {}).get("links", [])) | set(
                        source.get(route, {}).get("embeds", [])
                    ) | {item["src"] for item in source.get(route, {}).get("images", [])}
                    normalized = _replace_link(child, policy, route)
                    canonical_child = (
                        f"{urlsplit(child).scheme}://{host}{urlsplit(child).path}"
                        if host in {"youtube.com", "www.youtube.com"}
                        and urlsplit(child).path.startswith("/embed/")
                        else child
                    )
                    canonical_source_urls = {
                        f"{urlsplit(item).scheme}://{urlsplit(item).netloc.lower()}{urlsplit(item).path}"
                        if urlsplit(item).netloc.lower() in {"youtube.com", "www.youtube.com"}
                        and urlsplit(item).path.startswith("/embed/")
                        else item
                        for item in source_urls
                    }
                    approved = _approved(route, "structuredUrl", "", child, policy)
                    if (
                        not approved
                        and host != "img.youtube.com"
                        and normalized not in source_urls
                        and child not in source_urls
                        and canonical_child not in canonical_source_urls
                    ):
                        findings.append(
                            _finding(route, "structuredLayout", "unexpected-external-url", sorted(source_urls), child, child_pointer)
                        )
            walk(route, child, child_pointer)

    for route, page in pages.items():
        walk(route, page.get("structuredLayout") or {}, "/structuredLayout")
    return findings


def _policy_applications(inventory: dict, route: str, policy: dict) -> list[dict]:
    source_route = next((old for old, new in policy.get("routeRenames", {}).items() if new == route), route)
    page = next(
        (
            item
            for item in inventory.get("pages", [])
            if item.get("status") == 200 and route_for_url(item.get("url", "")) == source_route
        ),
        {},
    )
    serialized = json.dumps(page, ensure_ascii=False)
    applied = []
    for category in ("exactOverrides", "linkReplacements", "textReplacements", "imageReplacements"):
        for index, item in enumerate(policy.get(category, [])):
            if item.get("route") and item["route"] != route:
                continue
            source_value = item.get("source")
            if category == "exactOverrides" or (
                isinstance(source_value, str) and source_value in serialized
            ):
                applied.append(
                    {
                        "id": f"{category}:{index}",
                        "reason": item["reason"],
                        "evidence": item.get("evidence") or policy.get("defaultEvidence"),
                    }
                )
    return applied


def verify_sitewide_source_parity(root: Path, policy: dict, output_dir: Optional[Path] = None) -> dict:
    validate_policy(policy)
    inventory = json.loads((root / "docs/00-inventory/content-inventory.json").read_text(encoding="utf-8"))
    media_inventory = json.loads(
        (root / "docs/00-inventory/media-complete-2026-10-22.json").read_text(encoding="utf-8")
    )
    pages = json.loads((root / "src/data/pages.json").read_text(encoding="utf-8"))
    source = _source_snapshot(inventory, policy, _source_image_hashes(media_inventory), root)
    generated = _generated_snapshot(pages, root)
    findings = compare_snapshots(source, generated, policy)
    findings.extend(_local_asset_findings(root, generated))
    findings.extend(structured_integrity_findings(pages, source, root, policy))
    applications = {
        route: _policy_applications(inventory, route, policy)
        for route in sorted(set(source) | set(generated))
    }
    report = {
        "summary": {
            "sourceRoutes": len(source),
            "generatedRoutes": len(generated),
            "failures": len(findings),
        },
        "findings": findings,
        "routeResults": [
            {
                "route": route,
                "checkedDimensions": [
                    "h1",
                    "headings",
                    "bodyText",
                    "links",
                    "images",
                    "videos",
                    "embeds",
                    "localAssets",
                ],
                "status": (
                    "failure"
                    if any(item["route"] == route for item in findings)
                    else "approved_difference"
                    if applications[route]
                    else "pass"
                ),
                "appliedPolicies": applications[route],
            }
            for route in sorted(set(source) | set(generated))
        ],
    }
    if output_dir:
        output_dir.mkdir(parents=True, exist_ok=True)
        (output_dir / "source-data-report.json").write_text(
            json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
        )
    return report


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--root", type=Path, default=Path(__file__).resolve().parents[1])
    parser.add_argument("--policy", type=Path)
    parser.add_argument("--output", type=Path)
    args = parser.parse_args()
    policy_path = args.policy or args.root / "tests/fixtures/sitewide_parity_policy.json"
    output = args.output or args.root / "docs/verification/sitewide-parity-2026-10-28"
    report = verify_sitewide_source_parity(args.root, load_policy(policy_path), output)
    print(json.dumps(report["summary"], ensure_ascii=False))
    if report["findings"]:
        for finding in report["findings"][:20]:
            print(json.dumps(finding, ensure_ascii=False))
    return 1 if report["summary"]["failures"] else 0


if __name__ == "__main__":
    raise SystemExit(main())
