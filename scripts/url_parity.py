#!/usr/bin/env python3
"""Compare the read-only Aluplan 2026 App Router surface with live URLs."""

from __future__ import annotations

import csv
import json
import re
import subprocess
import unicodedata
import urllib.error
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET
from collections import Counter
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime
from html.parser import HTMLParser
from pathlib import Path
from zoneinfo import ZoneInfo


PROJECT_ROOT = Path(__file__).resolve().parents[1]
SOURCE_ROOT = PROJECT_ROOT.parent / "aluplan-2026"
APP_ROOT = SOURCE_ROOT / "app"
OUTPUT_ROOT = PROJECT_ROOT / "docs" / "00-inventory"
BASE_URL = "https://aluplan.com.tr"
MAX_BODY_BYTES = 4 * 1024 * 1024
MAX_CRAWL_URLS = 400
MAX_CRAWL_ROUNDS = 8
MAX_IN_FLIGHT_REQUESTS = 16
USER_AGENT = "Aluplan-2027-URL-Parity/1.0 (read-only migration audit)"


def normalize_path(raw: str) -> str:
    parsed = urllib.parse.urlsplit(raw)
    path = urllib.parse.unquote(parsed.path or "/")
    path = unicodedata.normalize("NFC", path)
    path = re.sub(r"/{2,}", "/", path)
    if not path.startswith("/"):
        path = "/" + path
    if path != "/":
        path = path.rstrip("/")
    return path


def encode_http_url(raw: str) -> str:
    parsed = urllib.parse.urlsplit(raw)
    return urllib.parse.urlunsplit(
        (
            parsed.scheme,
            parsed.netloc.encode("idna").decode("ascii"),
            urllib.parse.quote(urllib.parse.unquote(parsed.path), safe="/%:@[]!$&'()*+,;=-._~"),
            urllib.parse.quote_plus(urllib.parse.unquote_plus(parsed.query), safe="=&/:?"),
            "",
        )
    )


def origin_key(raw: str) -> tuple[str, str, int | None]:
    parsed = urllib.parse.urlsplit(raw)
    scheme = parsed.scheme.lower()
    default_port = 443 if scheme == "https" else 80 if scheme == "http" else None
    return scheme, (parsed.hostname or "").lower(), parsed.port or default_port


def query_signature(raw: str) -> str:
    parsed = urllib.parse.urlsplit(raw)
    keys = sorted({key for key, _ in urllib.parse.parse_qsl(parsed.query, keep_blank_values=True)})
    query = "&".join(urllib.parse.quote(key, safe="") for key in keys)
    return urllib.parse.urlunsplit((parsed.scheme, parsed.netloc, parsed.path, query, ""))


def csv_cell(value):  # noqa: ANN001
    if isinstance(value, str) and value.startswith(("=", "+", "-", "@")):
        return "'" + value
    return value


def route_from_page(page: Path, app_root: Path) -> str:
    parts = []
    for part in page.parent.relative_to(app_root).parts:
        if part.startswith("(") and part.endswith(")"):
            continue
        if part.startswith("@"):
            continue
        parts.append(part)
    return "/" + "/".join(parts) if parts else "/"


def path_matches_pattern(path: str, pattern: str) -> bool:
    if pattern == "/":
        return path == "/"

    regex_parts = ["^"]
    for segment in pattern.strip("/").split("/"):
        if segment.startswith("[[...") and segment.endswith("]]"):
            regex_parts.append("(?:/.+)?")
        elif segment.startswith("[...") and segment.endswith("]"):
            regex_parts.append("/.+")
        elif segment.startswith("[") and segment.endswith("]"):
            regex_parts.append("/[^/]+")
        else:
            regex_parts.append("/" + re.escape(segment))
    regex_parts.append("$")
    return re.fullmatch("".join(regex_parts), path) is not None


def classify_path(
    *,
    path: str,
    final_status: int | None,
    redirect_chain: list[dict],
    local_match: str | None,
    in_sitemap: bool,
) -> str:
    if redirect_chain:
        if 200 <= (final_status or 0) < 300:
            return "redirect_to_valid_2xx"
        if final_status is None:
            return "redirect_unverified"
        return "redirect_to_error"
    if 200 <= (final_status or 0) < 300:
        return "both_live_valid" if local_match else "live_only_valid"
    if in_sitemap and final_status == 404 and not local_match:
        return "sitemap_only_stale"
    if local_match and final_status == 404:
        return "local_only_candidate"
    if local_match and final_status is None:
        return "local_unverified"
    return "live_error_or_missing"


def is_rewrite_alias_path(path: str) -> bool:
    canonical = "/solutions/imar-yonetmeligi-bim-eklentisi"
    lowered = normalize_path(path).lower()
    return (
        lowered != canonical
        and lowered.startswith("/solutions/imar-")
        and "yonet" in lowered
        and "bim" in lowered
        and "eklentisi" in lowered
    )


class PageParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.links: list[str] = []
        self.canonical: str | None = None
        self.title_parts: list[str] = []
        self.in_title = False

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        attributes = dict(attrs)
        if tag == "a" and attributes.get("href"):
            self.links.append(attributes["href"] or "")
        elif tag == "link" and "canonical" in (attributes.get("rel") or "").split():
            self.canonical = attributes.get("href")
        elif tag == "title":
            self.in_title = True

    def handle_endtag(self, tag: str) -> None:
        if tag == "title":
            self.in_title = False

    def handle_data(self, data: str) -> None:
        if self.in_title:
            self.title_parts.append(data)

    @property
    def title(self) -> str:
        return "".join(self.title_parts).strip()


class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):  # noqa: ANN001
        return None


OPENER = urllib.request.build_opener(NoRedirect)


def fetch_path(path: str) -> dict:
    current_url = urllib.parse.urljoin(BASE_URL, path)
    chain: list[dict] = []
    body = b""
    headers = {}
    status = None
    error = None
    final_url = current_url

    base_origin = origin_key(BASE_URL)
    completed = False
    for _ in range(8):
        request = urllib.request.Request(encode_http_url(current_url), headers={"User-Agent": USER_AGENT})
        try:
            with OPENER.open(request, timeout=30) as response:
                status = response.status
                headers = dict(response.headers.items())
                body = response.read(MAX_BODY_BYTES + 1)
                final_url = response.url
                completed = True
                break
        except urllib.error.HTTPError as exc:
            status = exc.code
            headers = dict(exc.headers.items())
            location = exc.headers.get("Location")
            if 300 <= exc.code < 400 and location:
                next_url = urllib.parse.urljoin(current_url, location)
                chain.append(
                    {"status": exc.code, "from": current_url, "location": location, "to": next_url}
                )
                if origin_key(next_url) != base_origin:
                    error = "external_redirect_not_fetched"
                    final_url = next_url
                    status = None
                    completed = True
                    break
                current_url = next_url
                final_url = next_url
                continue
            body = exc.read(MAX_BODY_BYTES + 1)
            error = str(exc)
            final_url = current_url
            completed = True
            break
        except Exception as exc:  # Network evidence must remain reportable.
            error = f"{type(exc).__name__}: {exc}"
            final_url = current_url
            completed = True
            break

    if not completed:
        error = "redirect_limit_exceeded"
        status = None

    content_type = headers.get("Content-Type", "")
    truncated = len(body) > MAX_BODY_BYTES
    body = body[:MAX_BODY_BYTES]
    parser = PageParser()
    if "text/html" in content_type and body:
        parser.feed(body.decode("utf-8", errors="replace"))

    return {
        "path": normalize_path(path),
        "requested_url": urllib.parse.urljoin(BASE_URL, path),
        "final_url": final_url,
        "final_path": normalize_path(final_url),
        "final_status": status,
        "redirect_chain": chain,
        "content_type": content_type,
        "title": parser.title,
        "canonical": query_signature(parser.canonical) if parser.canonical else None,
        "links": parser.links,
        "truncated": truncated,
        "error": error,
        "body": body,
    }


def discover_local_pages() -> tuple[dict[str, dict], list[dict]]:
    pages: dict[str, dict] = {}
    templates: list[dict] = []
    for page in sorted(APP_ROOT.rglob("page.tsx")):
        route = route_from_page(page, APP_ROOT)
        record = {
            "path": route,
            "source_file": page.relative_to(SOURCE_ROOT).as_posix(),
            "route_type": "dynamic_template" if "[" in route else "static_page",
        }
        if "[" in route:
            templates.append(record)
        else:
            pages[route] = record
    return pages, templates


def discover_api_and_resource_routes() -> list[dict]:
    routes = []
    for route_file in sorted(APP_ROOT.rglob("route.ts")):
        route = route_from_page(route_file.with_name("page.tsx"), APP_ROOT)
        text = route_file.read_text(errors="replace")
        methods = re.findall(r"export\s+async\s+function\s+(GET|POST|PUT|PATCH|DELETE)", text)
        routes.append(
            {
                "path": route,
                "source_file": route_file.relative_to(SOURCE_ROOT).as_posix(),
                "methods": methods,
                "route_type": "resource_route" if "[..." in route else "api_endpoint",
            }
        )
    return routes


def discover_source_sitemap_paths() -> set[str]:
    text = (APP_ROOT / "sitemap.ts").read_text(errors="replace")
    return extract_sitemap_literal_paths(text)


def extract_sitemap_literal_paths(text: str) -> set[str]:
    paths = set()
    for body in re.findall(r"const\s+\w+Pages\s*=\s*\[(.*?)\]\s*;", text, re.DOTALL):
        paths.update(
            normalize_path(value)
            for value in re.findall(r"[\"'](/[^\"']*)[\"']", body)
        )
    return paths


def discover_metadata_routes() -> dict[str, dict]:
    candidates = {
        "/robots.txt": APP_ROOT / "robots.ts",
        "/sitemap.xml": APP_ROOT / "sitemap.ts",
        "/opengraph-image.png": APP_ROOT / "opengraph-image.png",
    }
    return {
        path: {
            "path": path,
            "source_file": source.relative_to(SOURCE_ROOT).as_posix(),
            "route_type": "metadata_route",
        }
        for path, source in candidates.items()
        if source.exists()
    }


def discover_redirects() -> list[dict]:
    text = (SOURCE_ROOT / "next.config.js").read_text(errors="replace")
    pattern = re.compile(
        r"source:\s*['\"]([^'\"]+)['\"]\s*,\s*"
        r"destination:\s*['\"]([^'\"]+)['\"]\s*,\s*"
        r"permanent:\s*true",
        re.MULTILINE,
    )
    return [
        {"source": normalize_path(source), "destination": normalize_path(destination), "permanent": True}
        for source, destination in pattern.findall(text)
    ]


def git_source_state() -> dict:
    def run(*args: str) -> str:
        return subprocess.check_output(
            ["git", "-C", str(SOURCE_ROOT), *args], text=True
        ).strip()

    status_lines = [line for line in run("status", "--porcelain=v1").splitlines() if line]
    return {
        "head": run("rev-parse", "HEAD"),
        "branch": run("branch", "--show-current"),
        "dirty_entry_count": len(status_lines),
        "dirty_paths": [line[3:] for line in status_lines],
        "note": "Paths only; file contents were not read by this state check.",
    }


def parse_sitemap(body: bytes) -> set[str]:
    root = ET.fromstring(body.decode("utf-8", errors="replace"))
    return {
        normalize_path(node.text or "")
        for node in root.iter()
        if node.tag.split("}")[-1] == "loc" and node.text
    }


def is_crawlable_page(path: str) -> bool:
    if path == "/api" or path.startswith(("/api/", "/cdn-cgi/")) or "[" in path:
        return False
    suffix = Path(path).suffix.lower()
    return not suffix or suffix in {".html", ".htm", ".txt", ".xml", ".png"}


def crawl_live(initial_paths: set[str]) -> tuple[dict[str, dict], set[str], dict[str, set[str]]]:
    pending = {normalize_path(path) for path in initial_paths if is_crawlable_page(path)}
    visited: dict[str, dict] = {}
    observed_query_urls: set[str] = set()
    incoming_pages: dict[str, set[str]] = {}

    for _ in range(MAX_CRAWL_ROUNDS):
        batch = sorted(pending - set(visited))[: MAX_CRAWL_URLS - len(visited)]
        if not batch:
            break
        for offset in range(0, len(batch), MAX_IN_FLIGHT_REQUESTS):
            request_batch = batch[offset : offset + MAX_IN_FLIGHT_REQUESTS]
            with ThreadPoolExecutor(max_workers=4) as pool:
                for result in pool.map(fetch_path, request_batch):
                    path = result["path"]
                    visited[path] = result
                    if 200 <= (result["final_status"] or 0) < 300:
                        for href in result.pop("links"):
                            absolute = urllib.parse.urljoin(result["final_url"], href)
                            parsed = urllib.parse.urlsplit(absolute)
                            if parsed.netloc != urllib.parse.urlsplit(BASE_URL).netloc:
                                continue
                            if parsed.query:
                                observed_query_urls.add(query_signature(absolute))
                            discovered = normalize_path(absolute)
                            incoming_pages.setdefault(discovered, set()).add(path)
                            if is_crawlable_page(discovered) and len(visited | {p: {} for p in pending}) < MAX_CRAWL_URLS:
                                pending.add(discovered)
                    result["final_url"] = query_signature(result["final_url"])
                    for hop in result.get("redirect_chain", []):
                        hop["location"] = query_signature(hop["location"])
                        hop["from"] = query_signature(hop["from"])
                        hop["to"] = query_signature(hop["to"])
                    result.pop("body", None)
    return visited, observed_query_urls, incoming_pages


def local_match_for(path: str, local_pages: dict[str, dict], templates: list[dict]) -> str | None:
    if path in local_pages:
        return path
    for template in templates:
        if path_matches_pattern(path, template["path"]):
            return template["path"]
    return None


def local_record_for(
    local_match: str | None,
    local_routes: dict[str, dict],
    templates: list[dict],
) -> dict:
    if not local_match:
        return {}
    return local_routes.get(local_match) or next(
        (item for item in templates if item["path"] == local_match),
        {},
    )


def decision_for(classification: str, path: str) -> str:
    if path in {"/hero-3d", "/test-webgl"}:
        return "review_nonpublic_before_migration"
    return {
        "both_live_valid": "implement_in_2027_same_url",
        "live_only_valid": "implement_in_2027_same_url_missing_local_source",
        "redirect_to_valid_2xx": "preserve_redirect_behavior",
        "redirect_to_error": "repair_or_remove_only_after_user_approval",
        "redirect_unverified": "investigate_before_migration",
        "sitemap_only_stale": "exclude_from_2027_sitemap_keep_as_issue",
        "local_only_candidate": "do_not_migrate_automatically_user_review_required",
        "local_unverified": "investigate_before_migration",
        "live_error_or_missing": "investigate_before_migration",
        "live_alias_200": "preserve_until_redirect_change_is_approved",
    }[classification]


def write_outputs(payload: dict) -> None:
    OUTPUT_ROOT.mkdir(parents=True, exist_ok=True)
    json_path = OUTPUT_ROOT / "url-parity.json"
    csv_path = OUTPUT_ROOT / "url-parity.csv"
    md_path = OUTPUT_ROOT / "url-parity.md"
    map_path = OUTPUT_ROOT / "url-map.csv"
    json_path.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n")

    fields = [
        "path",
        "classification",
        "decision",
        "local_match",
        "local_source_file",
        "in_live_sitemap",
        "in_source_sitemap",
        "final_status",
        "initial_status",
        "final_url",
        "redirect_chain",
        "canonical",
        "title",
        "content_type",
        "error",
        "incoming_pages",
    ]
    with csv_path.open("w", newline="") as stream:
        writer = csv.DictWriter(stream, fieldnames=fields, lineterminator="\n")
        writer.writeheader()
        for row in sorted(payload["url_records"], key=lambda item: item["path"]):
            output = {key: row.get(key, "") for key in fields}
            output["redirect_chain"] = json.dumps(output["redirect_chain"], ensure_ascii=False)
            output["incoming_pages"] = json.dumps(output["incoming_pages"], ensure_ascii=False)
            writer.writerow({key: csv_cell(value) for key, value in output.items()})

    map_fields = [
        "existing_url",
        "proposed_url",
        "classification",
        "migration_action",
        "source_file",
        "initial_status",
        "final_status",
        "final_url",
        "redirect_target",
        "canonical",
        "title",
        "approval_required",
    ]
    with map_path.open("w", newline="") as stream:
        writer = csv.DictWriter(stream, fieldnames=map_fields, lineterminator="\n")
        writer.writeheader()
        for row in sorted(payload["url_records"], key=lambda item: item["path"]):
            classification = row["classification"]
            migrates = classification in {
                "both_live_valid",
                "live_only_valid",
                "live_alias_200",
                "redirect_to_valid_2xx",
            }
            chain = row.get("redirect_chain", [])
            output = {
                    "existing_url": BASE_URL + row["path"],
                    "proposed_url": BASE_URL + row["path"] if migrates else "",
                    "classification": classification,
                    "migration_action": row["decision"],
                    "source_file": row.get("local_source_file") or "",
                    "initial_status": row.get("initial_status") or "",
                    "final_status": row.get("final_status") or "",
                    "final_url": row.get("final_url") or "",
                    "redirect_target": chain[-1]["to"] if chain else "",
                    "canonical": row.get("canonical") or "",
                    "title": row.get("title") or "",
                    "approval_required": "yes"
                    if classification in {"live_alias_200", "local_only_candidate"}
                    else "no",
                }
            writer.writerow({key: csv_cell(value) for key, value in output.items()})

    summary = payload["summary"]
    lines = [
        "# Canlı ve yerel URL parite raporu",
        "",
        f"Tarih: {payload['captured_at']}",
        "",
        "Canlıda gözlemlenen ve doğrulanan doğrudan 2xx yollar 2027 migration URL kümesidir. "
        "Canlı yönlendirme kaynakları ayrıca korunur. Yalnız yerelde bulunan hiçbir rota otomatik "
        "taşınmaz; kullanıcı incelemesine bırakılır.",
        "",
        "## Kaynak durumu",
        "",
        f"- Kaynak Git HEAD: `{payload['source_state']['head']}` (`{payload['source_state']['branch']}`).",
        f"- Kaynak çalışma ağacı giriş farkı: {payload['source_state']['dirty_entry_count']}; "
        "Git dirty-state kontrolünde yalnız dosya yolları kaydedildi. Rota keşfi için "
        "route/sitemap/config kaynakları salt okunur incelendi.",
        f"- Yerel statik sayfa rotası: {summary['local_static_pages']}.",
        f"- Yerel dinamik rota şablonu: {summary['local_dynamic_templates']}.",
        f"- Canlı sitemap yolu: {summary['live_sitemap_paths']}.",
        f"- Canlı taranan benzersiz yol: {summary['checked_paths']}.",
        f"- Gözlemlenen canlı doğrudan 2xx yolu: {summary['live_direct_2xx_paths']}.",
        f"- Canlı HTML içerik sayfası: {summary['live_html_pages']}.",
        f"- Dinamik şablona eşlenen somut canlı URL: {summary['live_dynamic_concrete_paths']}.",
        "",
        "## Sonuçlar",
        "",
        "| Sınıf | Sayı | 2027 kararı |",
        "|---|---:|---|",
    ]
    decisions = {
        "both_live_valid": "Aynı URL ile uygula",
        "live_only_valid": "Yerel kaynak eksiğini çöz, aynı URL ile uygula",
        "redirect_to_valid_2xx": "Başarılı yönlendirme davranışını koru",
        "redirect_to_error": "Bozuk hedef; otomatik migration kümesine alma",
        "redirect_unverified": "Doğrulanamadı; otomatik migration kümesine alma",
        "sitemap_only_stale": "Yeni sitemap'e alma; sorun kaydı olarak tut",
        "local_only_candidate": "Otomatik taşıma; kullanıcı incelemesi",
        "local_unverified": "Doğrula",
        "live_error_or_missing": "Doğrula",
        "live_alias_200": "Canlı 200 alias; 301 değişikliği ayrıca onaylanmalı",
    }
    for classification, count in sorted(summary["classifications"].items()):
        lines.append(f"| `{classification}` | {count} | {decisions[classification]} |")

    lines.extend(["", "## Farklar", ""])
    for heading, classification in [
        ("Canlıda geçerli, birebir yerel sayfa/pattern eşleşmesi yok", "live_only_valid"),
        ("Canlıda 200 dönen rewrite alias", "live_alias_200"),
        ("Yalnız yerelde aday", "local_only_candidate"),
        ("Canlı sitemap'te eski/404 kayıt", "sitemap_only_stale"),
        ("Geçerli canlı yönlendirme kaynakları", "redirect_to_valid_2xx"),
        ("Hatalı hedefe yönlendiren kaynaklar", "redirect_to_error"),
        ("Doğrulanamayan yönlendirme kaynakları", "redirect_unverified"),
        ("Canlı hata veya eksik", "live_error_or_missing"),
    ]:
        lines.extend([f"### {heading}", ""])
        selected = [row for row in payload["url_records"] if row["classification"] == classification]
        if not selected:
            lines.append("- Yok.")
        else:
            for row in selected:
                chain = row.get("redirect_chain", [])
                if chain:
                    suffix = f"HTTP {chain[0]['status']} → HTTP {row.get('final_status')} {row['final_url']}"
                else:
                    suffix = f"HTTP {row.get('final_status')}"
                incoming = row.get("incoming_pages", [])
                evidence = f"; bağlantı kaynağı: {', '.join(incoming)}" if incoming else ""
                lines.append(f"- `{row['path']}` — {suffix}{evidence}")
        lines.append("")

    lines.extend(
        [
            "## Ayrı tutulan rota yüzeyleri",
            "",
            "- Dinamik rota şablonları somut canlı URL'lerle eşleştirilir; sınırsız slug üretilmez.",
            "- API endpointleri GET ile denenmedi; form gönderimi yapılmadı.",
            "- Catch-all resource rotaları sayfa URL'si sayılmadı.",
            "- `public/` dosyalarının içerik/hash paritesi asset envanterinde yürütülür.",
            "- Middleware iç rewrite desenleri 301 olarak sınıflandırılmaz.",
            "",
            "## Sınırlar",
            "",
            f"Keşif; canlı sitemap, yerel App Router rotaları, kaynak yönlendirmeleri ve başarılı "
            f"HTML sayfalardaki bağlantılarla sınırlıdır. En fazla {MAX_CRAWL_ROUNDS} tur ve "
            f"{MAX_CRAWL_URLS} yol taranır. Client-side üretilen yollar, form action hedefleri, "
            "script içindeki URL'ler ve sorgu varyantları bu sayıların dışında kalabilir. Bu nedenle "
            "rapor tek başına canlı URL yüzeyinin eksiksiz olduğunu kanıtlamaz.",
            "",
            "Bu rapor HTTP ve dosya-rotası paritesidir; her sayfanın metin/medya/form içerik "
            "eşitliğini tek başına kanıtlamaz. İçerik paritesi Faz 0'ın ayrı kabul kapısıdır.",
            "",
        ]
    )
    md_path.write_text("\n".join(lines))


def main() -> None:
    local_pages, templates = discover_local_pages()
    metadata_routes = discover_metadata_routes()
    service_routes = discover_api_and_resource_routes()
    source_sitemap_paths = discover_source_sitemap_paths()
    redirects = discover_redirects()
    source_state = git_source_state()

    sitemap_result = fetch_path("/sitemap.xml")
    if sitemap_result["final_status"] != 200:
        raise SystemExit(f"Live sitemap could not be read: {sitemap_result['final_status']}")
    live_sitemap_paths = parse_sitemap(sitemap_result["body"])

    local_url_routes = {**local_pages, **metadata_routes}
    initial_paths = set(live_sitemap_paths) | set(local_url_routes) | {"/"}
    initial_paths |= {record["source"] for record in redirects}
    initial_paths |= {record["destination"] for record in redirects}
    live_results, observed_query_urls, incoming_pages = crawl_live(initial_paths)

    all_paths = set(live_results) | set(local_url_routes) | live_sitemap_paths
    records = []
    for path in sorted(all_paths):
        live = live_results.get(path, {})
        local_match = local_match_for(path, local_url_routes, templates)
        local_record = local_record_for(local_match, local_url_routes, templates)
        classification = classify_path(
            path=path,
            final_status=live.get("final_status"),
            redirect_chain=live.get("redirect_chain", []),
            local_match=local_match,
            in_sitemap=path in live_sitemap_paths,
        )
        if (
            classification == "live_only_valid"
            and is_rewrite_alias_path(path)
        ):
            classification = "live_alias_200"
        records.append(
            {
                "path": path,
                "classification": classification,
                "decision": decision_for(classification, path),
                "local_match": local_match,
                "local_source_file": local_record.get("source_file"),
                "in_live_sitemap": path in live_sitemap_paths,
                "in_source_sitemap": path in source_sitemap_paths,
                "initial_status": (
                    live.get("redirect_chain", [{}])[0].get("status")
                    if live.get("redirect_chain")
                    else live.get("final_status")
                ),
                "incoming_pages": sorted(incoming_pages.get(path, set())),
                **{key: value for key, value in live.items() if key not in {"path", "requested_url"}},
            }
        )

    classifications = Counter(record["classification"] for record in records)
    live_direct_2xx = [
        record
        for record in records
        if record["classification"] in {"both_live_valid", "live_only_valid", "live_alias_200"}
    ]
    payload = {
        "captured_at": datetime.now(ZoneInfo("Europe/Istanbul")).isoformat(),
        "authority": "Observed live 2xx URLs form the verified migration set; successful redirects are preserved separately.",
        "source_state": source_state,
        "summary": {
            "local_static_pages": len(local_pages),
            "local_dynamic_templates": len(templates),
            "local_metadata_routes": len(metadata_routes),
            "source_sitemap_paths": len(source_sitemap_paths),
            "live_sitemap_paths": len(live_sitemap_paths),
            "checked_paths": len(live_results),
            "live_direct_2xx_paths": len(live_direct_2xx),
            "live_html_pages": sum(
                "text/html" in (record.get("content_type") or "")
                for record in live_direct_2xx
            ),
            "live_dynamic_concrete_paths": sum(
                bool(record.get("local_match") and "[" in record["local_match"])
                for record in live_direct_2xx
            ),
            "classifications": dict(sorted(classifications.items())),
        },
        "url_records": records,
        "local_dynamic_templates": templates,
        "api_and_resource_routes": service_routes,
        "configured_permanent_redirects": redirects,
        "rewrite_alias_patterns": [
            {
                "pattern": "/solutions/imar-* containing yonet + bim + eklentisi",
                "destination": "/solutions/imar-yonetmeligi-bim-eklentisi",
                "behavior": "internal middleware rewrite; not a 301",
            }
        ],
        "observed_internal_query_urls": sorted(observed_query_urls),
        "notes": [
            "page.old.tsx is excluded because only exact page.tsx files are routes.",
            "Public asset URL/hash parity remains in asset-inventory.json and the content-parity gate.",
            "No API endpoint or external form was submitted.",
        ],
    }
    write_outputs(payload)
    print(json.dumps(payload["summary"], ensure_ascii=False))


if __name__ == "__main__":
    main()
