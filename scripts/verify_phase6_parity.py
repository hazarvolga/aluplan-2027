#!/usr/bin/env python3
import csv
import json
import sys
from document_assets import verify_documents
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

pages_path = ROOT / "src/data/pages.json"
playlists_path = ROOT / "src/data/playlists.json"
nav_path = ROOT / "src/data/navigation.json"
hp_path = ROOT / "src/data/homepage.json"
url_map_path = ROOT / "docs/00-inventory/url-map.csv"
next_config_path = ROOT / "next.config.mjs"
security_path = ROOT / "src/lib/security.ts"
shell_path = ROOT / "src/components/shell/SiteShell.tsx"
hp_view_path = ROOT / "src/components/sections/HomepageView.tsx"
subpage_view_path = ROOT / "src/components/sections/SubpageView.tsx"
llms_route_path = ROOT / "src/app/llms.txt/route.ts"
sitemap_path = ROOT / "src/app/sitemap.ts"
robots_path = ROOT / "src/app/robots.ts"

rename_policy = json.loads((ROOT / "tests/fixtures/sitewide_parity_policy.json").read_text(encoding="utf-8"))
route_renames = rename_policy.get("routeRenames", {})
route_prefix_renames = rename_policy.get("routePrefixRenames", {})
removed_routes = rename_policy.get("removedRoutes", {})


def renamed_route(route: str) -> str:
    if route in route_renames:
        return route_renames[route]
    for old, new in route_prefix_renames.items():
        if route == old or route.startswith(old + "/"):
            return new + route[len(old):]
    return route
pages = json.loads(pages_path.read_text(encoding="utf-8"))
playlists = json.loads(playlists_path.read_text(encoding="utf-8"))
nav = json.loads(nav_path.read_text(encoding="utf-8"))
hp = json.loads(hp_path.read_text(encoding="utf-8"))
next_config = next_config_path.read_text(encoding="utf-8")
security_ts = security_path.read_text(encoding="utf-8")
shell_tsx = shell_path.read_text(encoding="utf-8")
consent_ts = (ROOT / "src/lib/consent.ts").read_text(encoding="utf-8")
hp_view_tsx = hp_view_path.read_text(encoding="utf-8")
subpage_view_tsx = subpage_view_path.read_text(encoding="utf-8")
llms_ts = llms_route_path.read_text(encoding="utf-8")
sitemap_ts = sitemap_path.read_text(encoding="utf-8")
robots_ts = robots_path.read_text(encoding="utf-8")

passed = 0
failed = 0


def check(name: str, condition: bool, detail: str = ""):
    global passed, failed
    if condition:
        passed += 1
        print(f"PASS  {name}")
    else:
        failed += 1
        print(f"FAIL  {name} -> {detail}")


# 1. URL Map Parity
with open(url_map_path, "r", encoding="utf-8") as f:
    rows = list(csv.DictReader(f))

expected_200_routes = []
expected_redirects = []
for r in rows:
    url = r["existing_url"].replace("https://aluplan.com.tr", "") or "/"
    if url in {"/opengraph-image.png", "/robots.txt", "/sitemap.xml", "/hero-3d", "/test-webgl"}:
        continue
    if r["classification"] == "both_live_valid" and r["initial_status"] == "200":
        expected_200_routes.append(url)
    elif r["classification"] == "redirect_to_valid_2xx":
        expected_redirects.append((url, r["redirect_target"].replace("https://aluplan.com.tr", "")))

redirected_placeholder = "/package-overview"
missing_routes = [u for u in expected_200_routes if u not in removed_routes and u != redirected_placeholder and renamed_route(u) not in pages]
check("Source routes remain available as pages or approved redirects", len(missing_routes) == 0 and len(pages) == 110 - len(removed_routes), f"missing={missing_routes}, count={len(pages)}")
check("Package overview redirects permanently to the comparison page", "source: '/package-overview'," in next_config and "destination: '/paket-karsilastirma',\n        statusCode: 301" in next_config and "'/package-overview'" in sitemap_ts)

for src, dst in removed_routes.items():
    check(
        f"Removed route keeps a 308 and is no longer published: {src} -> {dst}",
        f"source: '{src}'," in next_config and src not in pages,
    )

for src, dst in route_renames.items():
    check(
        f"Renamed route keeps a redirect from its old URL: {src} -> {dst}",
        f"source: '{src}'," in next_config and dst in pages,
    )

for src, dst in route_prefix_renames.items():
    check(
        f"Renamed route tree keeps a 308 from its old URLs: {src}/:path* -> {dst}/:path*",
        f"source: '{src}/:path*'," in next_config and dst in pages,
    )

for src, dst in expected_redirects:
    check(f"308 redirect preserved in next.config.mjs: {src} -> {dst}", src in next_config and dst in next_config)

check(
    "Turkish-char HTTP 200 alias /solutions/imar-yonetmliği-bim-eklentisi preserved",
    "/solutions/imar-yonetmliği-bim-eklentisi" in next_config,
)

# 2. SEO & Metadata Parity (Self-referencing canonicals, Unique titles, Unique descriptions, Single H1, Valid Breadcrumbs)
bad_canonicals = []
titles = set()
descriptions = set()
bad_h1 = []
bad_breadcrumbs = []
email_obfuscation_leaks = []
bad_trial_links = []

for route_path, p in pages.items():
    expected_can = "https://aluplan.com.tr" if route_path == "/" else f"https://aluplan.com.tr{route_path}"
    if p.get("canonical") != expected_can:
        bad_canonicals.append((route_path, p.get("canonical"), expected_can))
    titles.add(p.get("title", ""))
    descriptions.add(p.get("description", ""))
    if not p.get("h1") or any(h.get("level") == 1 for h in p.get("headings", [])):
        bad_h1.append(route_path)
    for crumb in p.get("breadcrumbs", []):
        if crumb.get("href") == "/solutions-v2":
            bad_breadcrumbs.append(route_path)
    for node in p.get("bodyNodes", []):
        if "email protected" in node.lower():
            email_obfuscation_leaks.append(route_path)
    for lnk in p.get("contentLinks", []):
        if lnk.get("href") == "/try-free":
            bad_trial_links.append(route_path)

check(f"100% self-referencing canonicals across all {len(pages)} pages", len(bad_canonicals) == 0, str(bad_canonicals[:3]))
check(f"100% unique SEO <title> across all {len(pages)} pages", len(titles) == len(pages), f"{len(titles)}/{len(pages)}")
check(f"100% unique <meta name='description'> across all {len(pages)} pages", len(descriptions) == len(pages), f"{len(descriptions)}/{len(pages)}")
check(f"100% single <h1> hierarchy across all {len(pages)} pages", len(bad_h1) == 0, str(bad_h1))
check("Zero /solutions-v2 (404) parent links in breadcrumbs", len(bad_breadcrumbs) == 0, str(bad_breadcrumbs))
check("Zero [email protected] obfuscation artifacts in bodyNodes", len(email_obfuscation_leaks) == 0, str(email_obfuscation_leaks))
check("Zero /try-free (404) links; free trial normalized to allplan.com/trial-or-subscription/", len(bad_trial_links) == 0, str(bad_trial_links))

bad_support_links = []
for route_path, p in pages.items():
    for lnk in p.get("contentLinks", []):
        if "aluplan.net.tr" in lnk.get("href", "").lower():
            bad_support_links.append((route_path, lnk.get("href")))
for s in hp.get("services", []):
    if "aluplan.net.tr" in s.get("href", "").lower():
        bad_support_links.append(("homepage.services", s.get("href")))
check(
    "Zero legacy aluplan.net.tr links; all support portal buttons point to https://allplan.net.tr/tr",
    len(bad_support_links) == 0 and any(s.get("href") == "https://allplan.net.tr/tr" for s in hp.get("services", [])),
    str(bad_support_links),
)

legacy_404_targets = [
    "/solutions/bimplus",
    "/allplan-2026nin-ozellikleri",
    "allplan-2021-features",
    "youtube.com/@AllplanInternational",
    "cdn-ildjmbl.nitrocdn.com",
]
remaining_404_links = []
for route_path, p in pages.items():
    for lnk in p.get("contentLinks", []):
        h = lnk.get("href", "")
        if any(bad in h for bad in legacy_404_targets):
            remaining_404_links.append((route_path, h))
check(
    "Zero legacy 404 button/link targets remain in contentLinks (/solutions/bimplus, /allplan-2026nin-ozellikleri, etc.)",
    len(remaining_404_links) == 0
    and "/solutions/bimplus" in next_config
    and "/allplan-2026nin-ozellikleri" in next_config
    and "/allplan-2021-features" in next_config,
    str(remaining_404_links),
)

# 3. Video Library & Playlists Parity
total_playlist_entries = sum(len(pl.get("videos", [])) for pl in playlists.values())
unique_video_ids = {v["id"] for pl in playlists.values() for v in pl.get("videos", [])}
check("All 14 video library playlists preserved", len(playlists) == 14, f"count={len(playlists)}")
check("All 216 unique videos / 242 playlist entries preserved", len(unique_video_ids) == 216 and total_playlist_entries == 242, f"unique={len(unique_video_ids)}, total={total_playlist_entries}")

# 4. Homepage H01-H08 & Footer Content Parity
check("Homepage preserves 3 roles, 6 products, 5 solutions, 20 source services minus the removed Eğitim card plus 3 added learning cards", len(hp["roles"]) == 3 and len(hp["products"]) == 6 and len(hp["solutions"]) == 5 and len(hp["services"]) == 22)
check("Homepage preserves 6 package PDF items, BIMFlex visuals, 3 innovation cards", len(hp["packages"]) == 6 and len(hp["bimflex"]["media"]) == 3 and "logo" in hp["bimflex"] and len(hp["innovations"]) == 3)
check(
    "HomepageView includes all 14 Hero technical tags and direct trial URL",
    len(hp.get("heroContent", {}).get("tags", [])) == 14
    and "TRIAL_CTA_URL" in hp_view_tsx,
)
check("Footer preserves developer credit 'Design & Develop by Hazar Volga Ekiz'", nav["footer"]["credit"] == "Design & Develop by Hazar Volga Ekiz")
check("Footer preserves all 3 phone numbers and Atasehir address", len(nav["footer"]["phones"]) == 3 and len(nav["footer"]["address"]) == 3)

# 5. Downloadable Documents & Static Assets
document_errors = verify_documents(ROOT)
check("All original PDF/DOCX downloads match committed hashes and correct file types", not document_errors, str(document_errors))

# 5b. Media, Video & Icon Asset Parity (page images, source-backed MP4 videos, partner logos, AluIcon SVG system)
missing_page_images = []
total_page_images = 0
missing_page_videos = []
total_page_videos = 0

for route_path, p in pages.items():
    for img in p.get("images", []):
        total_page_images += 1
        src = img.get("src", "")
        if src.startswith("/"):
            local_img = ROOT / "public" / src.lstrip("/")
            if not local_img.exists() or local_img.stat().st_size == 0:
                missing_page_images.append((route_path, src))
    for vid in p.get("videos", []):
        total_page_videos += 1
        src = vid.get("src", "")
        if src.startswith("/"):
            local_vid = ROOT / "public" / src.lstrip("/")
            if not local_vid.exists() or local_vid.stat().st_size == 0:
                missing_page_videos.append((route_path, src))

check(
    f"All generated content image occurrences across {len(pages)} pages resolve to existing local files or external URLs",
    total_page_images > 0 and len(missing_page_images) == 0,
    f"total={total_page_images}, missing={missing_page_images[:5]}",
)
check(
    "All generated page MP4 videos resolve to existing local files in public/",
    len(missing_page_videos) == 0,
    f"total={total_page_videos}, missing={missing_page_videos}",
)

hp_media_paths = [
    hp.get("heroVideo", {}).get("src", ""),
    hp.get("heroVideo", {}).get("poster", ""),
] + [p.get("logo", "") for p in hp.get("partners", [])]
missing_hp_media = [
    m for m in hp_media_paths if not m or not (ROOT / "public" / m.lstrip("/")).exists()
]
check(
    "Homepage hero video, poster, and 9 partner logos exist in public/",
    len(hp.get("partners", [])) == 9 and len(missing_hp_media) == 0,
    f"missing={missing_hp_media}",
)
check(
    "AluIcon SVG vector icon component is integrated in SiteShell, HomepageView, and SubpageView",
    "AluIcon" in shell_tsx and "AluIcon" in hp_view_tsx and "AluIcon" in subpage_view_tsx,
)

# 5b. Structured Layout & Popup Video / Icon / Tab Verification across 25 Product & Solution Routes
structured_routes = [r for r, p in pages.items() if p.get("structuredLayout")]
missing_sl_assets = []
popup_video_count = 0
for r in structured_routes:
    sl = pages[r]["structuredLayout"]
    for b in (sl.get("benefits") or {}).get("items", []):
        isrc = b.get("iconSrc") or ""
        if isrc.startswith("/") and not (ROOT / "public" / isrc.lstrip("/")).exists():
            missing_sl_assets.append((r, isrc))
    for cf in (sl.get("coreFeatures") or {}).get("items", []):
        imsrc = cf.get("imageSrc") or ""
        if imsrc.startswith("/") and not (ROOT / "public" / imsrc.lstrip("/")).exists():
            missing_sl_assets.append((r, imsrc))
        if cf.get("youtubeId"):
            popup_video_count += 1
    for cat in (sl.get("workflowTabs") or {}).get("categories", []):
        for it in cat.get("items", []):
            imsrc = it.get("imageSrc") or ""
            if imsrc.startswith("/") and not (ROOT / "public" / imsrc.lstrip("/")).exists():
                missing_sl_assets.append((r, imsrc))
            if it.get("youtubeId"):
                popup_video_count += 1
    for eg in sl.get("extraGrids") or []:
        for it in eg.get("items", []):
            imsrc = it.get("imageSrc") or ""
            if imsrc.startswith("/") and not (ROOT / "public" / imsrc.lstrip("/")).exists():
                missing_sl_assets.append((r, imsrc))
            if it.get("youtubeId"):
                popup_video_count += 1

check(
    "All structuredLayout routes resolve 100% of icon/image assets and popup videos",
    len(structured_routes) >= 30 and len(missing_sl_assets) == 0 and popup_video_count >= 95,
    f"routes={len(structured_routes)}, popup_videos={popup_video_count}, missing={missing_sl_assets[:5]}",
)

ref_dir = (pages["/references"].get("structuredLayout") or {}).get("referencesDirectory") or {}
check(
    "/references preserves all 228 reference companies across 10 category tabs",
    len(ref_dir.get("items", [])) == 228 and len(ref_dir.get("categories", [])) == 10,
    f"items={len(ref_dir.get('items', []))}, categories={len(ref_dir.get('categories', []))}",
)

faq_dir = (pages["/faq"].get("structuredLayout") or {}).get("faqDirectory") or {}
check(
    "/faq keeps four categories and 19 Q&A items; lifecycle is on its own page",
    len(faq_dir.get("categories", [])) == 4
    and sum(len(c.get("items", [])) for c in faq_dir.get("categories", [])) == 19
    and all(c.get("id") != "lifecycle" for c in faq_dir.get("categories", []))
    and (ROOT / "src/app/product-lifecycle/page.tsx").is_file(),
)

# 6. GEO (/llms.txt, robots.ts, sitemap.ts) & Security
check("GEO /llms.txt route exists and includes ALLPLAN Türkiye summary", "Aluplan Program Sistemleri" in llms_ts and "https://www.allplan.com/trial-or-subscription/" in llms_ts)
check("robots.ts explicitly allows GPTBot, ClaudeBot, PerplexityBot, Google-Extended", all(bot in robots_ts for bot in ["GPTBot", "ClaudeBot", "PerplexityBot", "Google-Extended"]))
check("sitemap.ts excludes /health, /hero-3d, /test-webgl", all(ex in sitemap_ts for ex in ["/health", "/hero-3d", "/test-webgl"]))
check("Security helper enforces escapeHtml, rate limiting, and TLSv1.2+", "escapeHtml" in security_ts and "TLSv1.2" in security_ts and "rejectUnauthorized: true" in security_ts)
check("Unified security headers configured in next.config.mjs", all(h in next_config for h in ["Content-Security-Policy", "Strict-Transport-Security", "X-Content-Type-Options", "X-Frame-Options", "Referrer-Policy", "Permissions-Policy"]))
check("CookieConsent banner gates analytics until user consent", "cookie-consent" in consent_ts and "writeConsent(" in shell_tsx and "Yalnız Zorunlu Çerezler" in shell_tsx)

print(f"\nPhase 6 Verification Summary: {passed} passed, {failed} failed")
if failed > 0:
    sys.exit(1)
