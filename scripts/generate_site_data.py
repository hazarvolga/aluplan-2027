#!/usr/bin/env python3
import json
import os
import re
import struct
import sys
from pathlib import Path
from urllib.parse import urlparse, parse_qs, unquote

sys.path.insert(0, str(Path(__file__).resolve().parent))
from extract_structured_pages import build_all_structured_pages
from document_assets import preflight_documents, sync_documents, write_manifest
from request_links import normalize_request_links
from content_policy import apply_approved_content_policy
from source_card_links import apply_source_card_links

STRUCTURED_LAYOUTS = build_all_structured_pages()

ROOT = Path(__file__).resolve().parent.parent
PUBLIC_DIR = ROOT / "public"

# One explicit domain contract drives the desktop/mobile solution menu, footer hubs,
# five hub directories, and the 22-card /solutions catalog. The two surfaces have
# intentional differences (for example BIMPLUS is catalog-only and AX3000 has a
# more specific catalog target), so those differences are represented as data
# instead of inferred later from section text or generic contentLinks.
SOLUTION_DIRECTORY_SOURCE = (
    {
        "title": "BİNA TASARIMI",
        "hubPath": "/solutions-v2/building-design",
        "items": (
            {
                "hubOrder": 1,
                "catalogOrder": 1,
                "hubTitle": "Mimari",
                "catalogTitle": "Mimari",
                "hubHref": "/solutions/architecture",
                "catalogHref": "/solutions/architecture",
            },
            {
                "hubOrder": 2,
                "catalogOrder": 2,
                "hubTitle": "Strüktürel Mühendislik",
                "catalogTitle": "Strüktürel Mühendislik",
                "hubHref": "/solutions/structural",
                "catalogHref": "/solutions/structural",
            },
            {
                "hubOrder": 3,
                "catalogOrder": 3,
                "hubTitle": "MEP",
                "catalogTitle": "MEP",
                "hubHref": "/solutions/mep",
                "catalogHref": "/solutions/mep",
            },
            {
                "hubOrder": 4,
                "catalogOrder": 4,
                "hubTitle": "ALLPLAN ENDÜSTRİ ÇÖZÜMLERİ",
                "catalogTitle": "ALLPLAN Endüstri Çözümleri",
                "hubHref": "/solutions/allplan-industry",
                "catalogHref": "/solutions/allplan-industry",
            },
        ),
    },
    {
        "title": "ALTYAPI TASARIMI",
        "hubPath": "/solutions-v2/infrastructure",
        "items": (
            {
                "hubOrder": 1,
                "catalogOrder": 1,
                "hubTitle": "Altyapı Mühendisliği",
                "catalogTitle": "Altyapı Mühendisliği",
                "hubHref": "/solutions/infrastructure",
                "catalogHref": "/solutions/infrastructure",
            },
            {
                "hubOrder": 2,
                "catalogOrder": 2,
                "hubTitle": "Yol ve Demiryolu Tasarımı",
                "catalogTitle": "Yol ve Demiryolu Tasarımı",
                "hubHref": "/solutions/road-railway",
                "catalogHref": "/solutions/road-railway",
            },
            {
                "hubOrder": 3,
                "catalogOrder": 3,
                "hubTitle": "Köprü Tasarımı",
                "catalogTitle": "Köprü Tasarımı",
                "hubHref": "/solutions/bridge-design",
                "catalogHref": "/solutions/bridge-design",
            },
        ),
    },
    {
        "title": "İNŞAAT PLANLAMASI",
        "hubPath": "/solutions-v2/construction",
        "items": (
            {
                "hubOrder": 1,
                "catalogOrder": 1,
                "hubTitle": "Prekast Üretimi",
                "catalogTitle": "Prekast Üretimi",
                "hubHref": "/solutions/precast",
                "catalogHref": "/solutions/precast",
            },
            {
                "hubOrder": 2,
                "catalogOrder": 2,
                "hubTitle": "Çelik Detaylandırma & İmalat",
                "catalogTitle": "Çelik Detaylandırma & İmalat",
                "hubHref": "/solutions/steel",
                "catalogHref": "/solutions/steel",
            },
            {
                "hubOrder": 3,
                "catalogOrder": 3,
                "hubTitle": "Şantiye Planlaması",
                "catalogTitle": "Şantiye Planlaması",
                "hubHref": "/solutions/site-planning",
                "catalogHref": "/solutions/site-planning",
            },
        ),
    },
    {
        "title": "EKLENTİLER",
        "hubPath": "/solutions-v2/addons",
        "items": (
            {
                "hubOrder": 1,
                "catalogOrder": 1,
                "hubTitle": "CDS Add-On",
                "catalogTitle": "CDS Add-On",
                "hubHref": "/solutions/cds-addon",
                "catalogHref": "/solutions/cds-addon",
            },
            {
                "hubOrder": 2,
                "catalogOrder": 2,
                "hubTitle": "Allto PytonPart Generator",
                "catalogTitle": "Allto PythonPart Generator",
                "hubHref": "https://allplantools.com/",
                "catalogHref": "https://allplantools.com/",
            },
            {
                "hubOrder": 3,
                "catalogOrder": 3,
                "hubTitle": "Allto PytonPart",
                "catalogTitle": "Allto PythonPart",
                "hubHref": "/solutions/pythonpart",
                "catalogHref": "/solutions/pythonpart",
            },
            {
                "hubOrder": 4,
                "catalogOrder": 4,
                "hubTitle": "AX3000 MEP",
                "catalogTitle": "AX3000 MEP",
                "hubHref": "/solutions/ax3000",
                "catalogHref": "/solutions/ax3000-mekanik-tesisat",
            },
            {
                "hubOrder": 5,
                "catalogOrder": 5,
                "hubTitle": "Scalypso",
                "catalogTitle": "Scalypso",
                "hubHref": "/solutions/scalypso",
                "catalogHref": "/solutions/scalypso",
            },
        ),
    },
    {
        "title": "DİĞER ÜRÜNLER",
        "hubPath": "/solutions-v2/other",
        "items": (
            {
                "hubOrder": 1,
                "catalogOrder": 1,
                "hubTitle": "BIMFlex",
                "catalogTitle": "BIMFlex",
                "hubHref": "/solutions/bimflex",
                "catalogHref": "/solutions/bimflex",
            },
            {
                "hubOrder": None,
                "catalogOrder": 2,
                "catalogTitle": "Allplan BIMPLUS",
                "catalogHref": "/products/allplan-bimplus",
            },
            {
                "hubOrder": 4,
                "catalogOrder": 3,
                "hubTitle": "BIMX5",
                "catalogTitle": "BIMX5",
                "hubHref": "/solutions/bimx5",
                "catalogHref": "/solutions/bimx5",
            },
            {
                "hubOrder": 2,
                "catalogOrder": 4,
                "hubTitle": "Donatı Mühendisliği",
                "catalogTitle": "Donatı Mühendisliği",
                "hubHref": "/solutions/rebar-engineering",
                "catalogHref": "/solutions/rebar-engineering",
            },
            {
                "hubOrder": 3,
                "catalogOrder": 5,
                "hubTitle": "İmar Yönetmeliği BIM Eklentisi",
                "catalogTitle": "İmar Yönetmeliği BIM Eklentisi",
                "hubHref": "/solutions/imar-yonetmeligi-bim-eklentisi",
                "catalogHref": "/solutions/imar-yonetmeligi-bim-eklentisi",
            },
            {
                "hubOrder": 5,
                "catalogOrder": 6,
                "hubTitle": "Allplan Oska İşbirliği",
                "catalogTitle": "Allplan Oska İşbirliği",
                "hubHref": "/solutions/oska",
                "catalogHref": "/solutions/oska",
            },
            {
                "hubOrder": 6,
                "catalogOrder": 7,
                "hubTitle": "Allplan Poz Kataloğu",
                "catalogTitle": "Allplan Poz Kataloğu",
                "hubHref": "/solutions/poz-catalog",
                "catalogHref": "/solutions/poz-catalog",
            },
        ),
    },
)


def build_solution_directory(pages):
    def is_external(href: str) -> bool:
        return href.startswith(("http://", "https://"))

    solution_page = pages["/solutions"]
    catalog_sections = {
        section["heading"]: section
        for section in solution_page["sections"]
    }
    intro_section = catalog_sections[solution_page["h1"]]

    def catalog_source_content(item):
        section = catalog_sections[item["catalogTitle"]]
        description = next(
            text
            for text in section["items"]
            if text not in {"Detayları İncele", "Siteyi Ziyaret Et"}
        )
        return description, section["image"]

    def build_catalog_item(item):
        description, image = catalog_source_content(item)
        return {
            "title": item["catalogTitle"],
            "href": item["catalogHref"],
            "description": description,
            "image": image,
            "external": is_external(item["catalogHref"]),
        }

    groups = []
    for source_group in SOLUTION_DIRECTORY_SOURCE:
        hub_sections = {
            section["heading"]: section
            for section in pages[source_group["hubPath"]]["sections"]
        }
        hub_items = [
            {
                "title": item["hubTitle"],
                "href": item["hubHref"],
                "description": hub_sections[item["hubTitle"]]["items"][0],
                "external": is_external(item["hubHref"]),
            }
            for item in sorted(
                (candidate for candidate in source_group["items"] if candidate.get("hubOrder") is not None),
                key=lambda candidate: candidate["hubOrder"],
            )
        ]
        catalog_items = [
            build_catalog_item(item)
            for item in sorted(source_group["items"], key=lambda candidate: candidate["catalogOrder"])
        ]
        groups.append(
            {
                "title": source_group["title"],
                "hubPath": source_group["hubPath"],
                "hubItems": hub_items,
                "catalogItems": catalog_items,
            }
        )
    return {
        "catalogIntro": {
            "kicker": intro_section["items"][0],
            "title": intro_section["heading"],
            "description": intro_section["items"][-1],
        },
        "groups": groups,
    }

inv_path = ROOT / "docs/00-inventory/content-inventory.json"
mc_path = ROOT / "docs/00-inventory/media-complete-2026-10-22.json"
ir_path = ROOT / "docs/00-inventory/interaction-register-2026-10-22.json"
closure_states_path = ROOT / "docs/00-inventory/browser-closure-2026-10-22/states.json"
complete_states_path = ROOT / "docs/00-inventory/browser-complete-2026-10-22/states.json"
final_states_path = ROOT / "docs/00-inventory/browser-final-2026-10-22.json"
module_states_path = ROOT / "docs/00-inventory/browser-modules-final-2026-10-22.json"
# Fail before producing data if any original download is missing or invalid.
SOURCE_ROOT = ROOT.parent / "aluplan-2026"
SOURCE_AVAILABLE = preflight_documents(ROOT, SOURCE_ROOT)

with open(inv_path, "r", encoding="utf-8") as f:
    inv = json.load(f)

with open(mc_path, "r", encoding="utf-8") as f:
    mc = json.load(f)

with open(ir_path, "r", encoding="utf-8") as f:
    ir = json.load(f)


def to_public_url(rel_path: str) -> str:
    if rel_path.startswith("public/"):
        return "/" + rel_path[len("public/") :]
    if rel_path.startswith("src/assets/"):
        return "/" + rel_path[len("src/") :]
    return "/" + rel_path.lstrip("/")


url_to_public = {}
for item in mc.get("image_results", []):
    u = item["url"].replace("https://aluplan.com.tr", "")
    matches = item.get("current_source_sha_matches") or item.get("inventory_sha_matches") or []
    if matches:
        preferred = sorted(
            matches,
            key=lambda p: (
                0 if p.startswith("public/") else 1 if p.startswith("assets/") else 2 if p.startswith("src/assets/") else 3,
                len(p),
            ),
        )[0]
        url_to_public[u] = to_public_url(preferred)

basename_to_public = {}
for asset in mc.get("root_assets", []):
    rel = asset["path"]
    if rel.startswith(("public/", "assets/", "src/assets/")):
        bname = Path(rel).name.lower()
        basename_to_public.setdefault(bname, to_public_url(rel))

WP_FALLBACKS = {
    "2023-solutions-building-design-allplan-turkey-370x275.png": "/assets/solutions/architecture-hero.jpg",
    "solutions-infrastructure-design-370x275.png": "/assets/solutions/infrastructure-hero.jpg",
    "2023-prefabrication-product-allplan-turkey-370x270.png": "/assets/solutions/precast-hero.jpg",
    "structural-engineering-allplan-turkey-work_way_want.png": "/assets/solutions/industry/reasons/work_way_want.png",
    "structural-engineering-allplan-turkey-powerful_modeling.png": "/assets/solutions/industry/reasons/powerful_modeling.png",
    "allplan-connect_logo.png": "/assets/logo/aluplan-logo-white-filled.svg",
    "sifre-1-1024x570.jpg": "/images/client-id-sample.jpg",
    "gelenmail-1024x642.jpg": "/images/allplan-lisans-numarasi.png",
    "sifre-2-1024x666.jpg": "/images/Declaration_Allplan_2021-06-01.jpg",
}


def resolve_media_src(raw_src: str) -> str:
    if not raw_src:
        return ""
    s = raw_src.strip()
    if s.startswith("/_next/image"):
        qs = parse_qs(urlparse(s).query)
        if "url" in qs:
            s = unquote(qs["url"][0])
    if s.startswith("https://aluplan.com.tr"):
        s = s.replace("https://aluplan.com.tr", "")
    if "Lisans.jpg" in s or "lisans.jpg" in s:
        return "/assets/solutions/cds/ramp/lisans.jpg"
    if s.startswith(("http://", "https://")):
        return s
    if s in url_to_public:
        return url_to_public[s]
    if (PUBLIC_DIR / s.lstrip("/")).is_file():
        return s
    bname = Path(s).name
    parts = bname.split(".")
    if len(parts) >= 3 and len(parts[-2]) in (8, 16):
        unhashed_name = ".".join(parts[:-2] + [parts[-1]]).lower()
        if unhashed_name in basename_to_public:
            return basename_to_public[unhashed_name]
    low_name = bname.lower()
    if low_name in WP_FALLBACKS:
        return WP_FALLBACKS[low_name]
    if low_name in basename_to_public:
        return basename_to_public[low_name]
    return s


def get_image_dimensions(src: str):
    if not src or not src.startswith("/"):
        return None
    fp = PUBLIC_DIR / src.lstrip("/")
    if not fp.is_file():
        return None
    try:
        data = fp.read_bytes()
        ext = fp.suffix.lower()
        if ext == ".png" and data[:8] == b"\x89PNG\r\n\x1a\n":
            w, h = struct.unpack(">II", data[16:24])
            return (w, h)
        if ext in {".jpg", ".jpeg"}:
            i = 2
            while i < len(data):
                while i < len(data) and data[i] != 0xFF:
                    i += 1
                while i < len(data) and data[i] == 0xFF:
                    i += 1
                if i >= len(data):
                    break
                marker = data[i]
                i += 1
                if marker in (0xD8, 0xD9):
                    continue
                if i + 2 > len(data):
                    break
                length = struct.unpack(">H", data[i : i + 2])[0]
                if marker in (0xC0, 0xC1, 0xC2, 0xC3):
                    h, w = struct.unpack(">HH", data[i + 3 : i + 7])
                    return (w, h)
                i += length
    except Exception:
        return None
    return None


def is_icon_image(src: str) -> bool:
    if not src:
        return False
    low = src.lower()
    if low.endswith(".svg"):
        return True
    if any(seg in low for seg in ["/icons/", "/reasons/", "/benefits/", "/partners/", "logo", "1470399"]):
        return True
    dims = get_image_dimensions(src)
    if dims and (dims[0] <= 260 or dims[1] <= 260):
        return True
    return False


# Extract animated stats from source evidence so SSR '0' '%' placeholders are replaced with real values
route_stats = {}
ev_app_dir = ROOT / "docs/00-inventory/interaction-source-evidence/app"
if ev_app_dir.exists():
    for tsx_path in ev_app_dir.rglob("*.tsx"):
        txt = tsx_path.read_text(encoding="utf-8", errors="ignore")
        rel = "/" + str(tsx_path.parent.relative_to(ev_app_dir)).replace("\\", "/")
        rel = rel.replace("/(public)", "") or "/"
        matches = re.findall(
            r"value:\s*[\"']([^\"']+)[\"']\s*,\s*label:\s*[\"']([^\"']+)[\"']",
            txt,
        )
        if matches:
            route_stats.setdefault(rel, {})
            for val, lbl in matches:
                route_stats[rel][lbl.strip().upper()] = val.strip()


def safe_read_json(p: Path):
    try:
        with open(p, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return None


def clean_text(val) -> str:
    if not val:
        return ""
    s = str(val)
    s = re.sub(r"\[email[\s\u00a0]*protected\]", "info@aluplan.com.tr", s, flags=re.IGNORECASE)
    s = re.sub(r"https?://(?:www\.)?aluplan\.net\.tr/?", "https://allplan.net.tr/tr", s, flags=re.IGNORECASE)
    s = re.sub(r"\baluplan\.net\.tr\b", "allplan.net.tr/tr", s, flags=re.IGNORECASE)
    s = s.replace("GüvenilirBIM", "Güvenilir BIM")
    s = s.replace("\u00a0", " ").strip()
    return s


interactive_by_path = {}


def add_interactive_state(route_path: str, label: str, texts: list):
    if not route_path or not isinstance(texts, list) or not texts:
        return
    clean_p = route_path.replace("https://aluplan.com.tr", "") or "/"
    if clean_p not in interactive_by_path:
        interactive_by_path[clean_p] = []
    existing = interactive_by_path[clean_p]
    cleaned_texts = [
        clean_text(t)
        for t in texts
        if len(clean_text(t)) > 2 and not clean_text(t).startswith("İçeriğe geç")
    ]
    if cleaned_texts and not any(x["label"] == label for x in existing):
        existing.append({"label": label or f"Durum {len(existing) + 1}", "texts": cleaned_texts[:30]})


def ingest_state_obj(obj):
    if not obj:
        return
    if isinstance(obj, list):
        for item in obj:
            ingest_state_obj(item)
        return
    if isinstance(obj, dict):
        url_or_path = obj.get("url") or obj.get("path") or obj.get("route")
        if url_or_path and (obj.get("added_texts") or obj.get("texts") or obj.get("headings")):
            label = str(obj.get("action") or obj.get("label") or obj.get("state") or obj.get("tab") or "Etkileşimli Sekme")
            texts = obj.get("added_texts") or obj.get("texts") or obj.get("headings") or []
            if isinstance(texts, list):
                add_interactive_state(str(url_or_path), label, texts)
        for k, v in obj.items():
            if isinstance(k, str) and k.startswith("/") and isinstance(v, list):
                for st in v:
                    if isinstance(st, dict):
                        lbl = str(st.get("label") or st.get("action") or st.get("name") or "Detay")
                        txts = st.get("added_texts") or st.get("texts") or []
                        if isinstance(txts, list):
                            add_interactive_state(k, lbl, txts)
            elif isinstance(v, (dict, list)):
                ingest_state_obj(v)


for p in [closure_states_path, complete_states_path, final_states_path, module_states_path]:
    ingest_state_obj(safe_read_json(p))

HEADER_EXACT = {
    "İçeriğe geç",
    "info@aluplan.com.tr",
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

FOOTER_START_MARKER = "1995'ten beri Türkiye'nin güvenilir Allplan distribütörü. Mimari ve mühendislik projeleriniz için profesyonel BIM çözümleri."
GLOBAL_CTA_START_MARKER = "DAHA İYİ YARINLAR İNŞA ETMEK İÇİN TASARIM"

GENERIC_TITLES = {
    "Aluplan - Premium Mühendislik Çözümleri",
    "ALLPLAN Ürünleri | Aluplan | Aluplan",
    "Allplan - Aluplan",
}

GENERIC_DESCRIPTIONS = {
    "Mimarlık, mühendislik ve inşaat sektörü için premium yazılım çözümleri, BIM danışmanlığı ve eğitim hizmetleri.",
    "Mimari, mühendislik ve inşaat projeleriniz için en kapsamlı BIM ve CAD çözümlerini keşfedin. ALLPLAN AEC, Civil, Precast ve daha fazlası.",
    "Aluplan hakkında bilgi",
    "Bizimle iletişime geçin",
}

ROUTE_LABELS = {
    "/": "ALLPLAN Türkiye | Profesyonel BIM Yazılımları",
    "/about": "Hakkımızda — Türkiye’nin Güvenilir BIM Çözüm Ortağı",
    "/contact": "İletişim ve Teknik Danışmanlık",
    "/gizlilik-politikasi": "Gizlilik Politikası ve Veri Güvenliği",
    "/kullanim-sartlari": "İnternet Sitesi Kullanım Şartları",
    "/kvkk": "KVKK Kişisel Verilerin İşlenmesi Aydınlatma Metni",
    "/health": "Sistem Durumu ve Servis Sağlığı (Health Check)",
    "/package-overview": "ALLPLAN Paket Genel Bakış ve Sürüm Rehberi",
    "/paket-karsilastirma": "ALLPLAN 2026 Paket Karşılaştırma Rehberi (Q3 2026 PDF)",
    "/products": "ALLPLAN Ürün Ailesi ve Mühendislik Yazılımları",
    "/products/allplan": "ALLPLAN Platformu — Disiplinlerarası BIM Çözümü",
    "/products/allplan-2026": "ALLPLAN 2026 Sürümü — Geleceği İnşa Eden BIM Platformu",
    "/products/allplan-2026-yenilikler": "ALLPLAN 2026 Yenilikleri ve Öne Çıkan Özellikler",
    "/products/allplan-aec": "ALLPLAN AEC — Mimari, Mühendislik ve İnşaat için BIM",
    "/products/allplan-basic": "ALLPLAN Basic — 2B/3B Tasarım, Görüntüleme ve İş Birliği",
    "/products/allplan-bimplus": "ALLPLAN Bimplus — Bulut Tabanlı OpenBIM İş Birliği Platformu",
    "/products/allplan-cloud-services": "ALLPLAN Cloud Services — Bulut Tabanlı BIM İş Akışları",
    "/products/allplan-concept": "ALLPLAN Concept — 3B Modelleme, Dokümantasyon ve Metraj",
    "/products/allplan-professional": "ALLPLAN Professional — Profesyonel BIM, Donatı ve Detaylandırma",
    "/products/allplan-ultimate": "ALLPLAN Ultimate — Kapsamlı Çok Disiplinli BIM ve Mühendislik",
    "/products/architecture": "ALLPLAN Architecture — Mimari BIM Tasarım Yazılımı",
    "/products/ax3000": "AX3000 MEP & Enerji Simülasyonu Ürün Ailesi",
    "/products/ax3000/dokumanlar": "AX3000 Teknik Broşürler ve Fonksiyon Dokümanları",
    "/products/civil": "ALLPLAN Civil — Altyapı, Yol ve Köprü Mühendisliği Paketi",
    "/products/precast": "ALLPLAN Precast — Prefabrik Beton Tasarım ve Üretim Paketi",
    "/products/precast-detail": "ALLPLAN Precast Detail — Prekast Detaylandırma ve İmalat",
    "/products/sds2-home": "SDS2 — Çelik Detaylandırma, Bağlantı Tasarımı ve İmalat",
    "/references": "Referanslarımız ve BIM Odaklı İş Ortaklarımız",
    "/search": "Site İçi Arama — Ürün, Çözüm ve Eğitim Kütüphanesi",
    "/solutions": "ALLPLAN Mühendislik, Mimari ve İnşaat Çözümleri",
    "/solutions-v2/addons": "ALLPLAN Eklenti Kataloğu ve Üretkenlik Modülleri",
    "/solutions-v2/building-design": "Bina Tasarımı Çözümleri — Mimari, Yapısal ve MEP BIM",
    "/solutions-v2/connect-license": "ALLPLAN Connect Lisans Yönetimi ve Kurulum Rehberi",
    "/solutions-v2/connect-license/activation": "ALLPLAN Lisans Deklarasyon ve Aktivasyon Formu",
    "/solutions-v2/connect-license/how-to-assign": "ALLPLAN Lisans Atama ve Kullanıcı Yetkilendirme Rehberi",
    "/solutions-v2/connect-login": "ALLPLAN Connect Portal Giriş ve Hesap Rehberi",
    "/solutions-v2/construction": "İnşaat Planlaması, Prekast, Çelik ve Şantiye Çözümleri",
    "/solutions-v2/faq": "Sıkça Sorulan Sorular (SSS) ve Teknik Bilgi Bankası",
    "/solutions-v2/infrastructure": "Altyapı Tasarımı — Köprü, Yol, Tünel ve Geoteknik BIM",
    "/solutions-v2/other": "Tamamlayıcı BIM Çözümleri, Maliyet ve Eklenti Ailesi",
    "/solutions-v2/training": "ALLPLAN Eğitim, Webinar ve Teknik Gelişim Merkezi",
    "/solutions-v2/training/classroom": "Sınıf İçi (Yüz Yüze) ALLPLAN BIM Eğitim Programları",
    "/solutions-v2/training/e-learning": "E-Learning — Kendi Hızınızda Çevrim İçi ALLPLAN Eğitimi",
    "/solutions-v2/training/events": "ALLPLAN Etkinlikler, Seminerler ve Sektör Buluşmaları",
    "/solutions-v2/training/individual": "Bireysel ve Kuruma Özel Özelleştirilmiş ALLPLAN Eğitimi",
    "/solutions-v2/training/online": "Canlı Online ALLPLAN Eğitimleri ve Uzaktan Atölyeler",
    "/solutions-v2/training/quick-start": "ALLPLAN Quick Start — 7 Adımda Hızlı Başlangıç Rehberi",
    "/solutions-v2/training/video-library": "ALLPLAN Video Kütüphanesi ve Eğitim Oynatma Listeleri",
    "/solutions-v2/training/webinar": "ALLPLAN Teknik Webinarlar ve Canlı Kayıt Arşivi",
    "/solutions/addons": "ALLPLAN Eklentileri (Add-Ons) ve Gelişmiş Araçlar",
    "/solutions/addons/2d-dwg-converter": "2B DWG Converter — Akıllı CAD/DWG Dönüştürme Eklentisi",
    "/solutions/addons/drive-curve": "Drive Curve — Araç Dönüş Yörüngesi ve Süpürme Analizi",
    "/solutions/addons/geometry-tools": "Geometry Tools — Gelişmiş 3B Geometri ve Arazi Araçları",
    "/solutions/addons/graphical-text": "Graphical Text — 3B Vektörel ve Parametrik Yazı Eklentisi",
    "/solutions/addons/parametric-terrain": "Parametric Terrain — Parametrik Arazi ve Kazı/Dolgu Modelleme",
    "/solutions/addons/ramp": "Ramp Add-On — Parametrik Helisel ve Doğrusal Rampa Tasarımı",
    "/solutions/addons/sketchup-converter": "SketchUp Converter — Çift Yönlü SKP/ALLPLAN Veri Aktarımı",
    "/solutions/addons/steel-components": "Steel Components — Parametrik Çelik Profil ve Birleşim Bileşenleri",
    "/solutions/addons/three-dimensioning": "3B Ölçülendirme (Three Dimensioning) — İzometrik ve 3B Ölçü",
    "/solutions/allplan-bulut-hizmetleri": "ALLPLAN Bulut Hizmetleri — Ortak Veri Ortamı (CDE) ve Paylaşım",
    "/solutions/allplan-industry": "ALLPLAN Endüstriyel Tesis ve Fabrika Tasarım Çözümleri",
    "/solutions/architecture": "Mimari BIM Çözümleri — Konseptten Uygulama Projesine ALLPLAN",
    "/solutions/ax3000": "AX3000 MEP — ALLPLAN Entegre Mekanik, Elektrik ve Enerji BIM",
    "/solutions/ax3000-mekanik-tesisat": "AX3000 Mekanik Tesisat — HVAC, Sıhhi Tesisat ve Enerji",
    "/solutions/ax3000-virtual-reality": "AX3000 Virtual Reality (VR) — MEP ve Mimari Sanal Gerçeklik",
    "/solutions/ax3000-yapi-fizigi": "AX3000 Yapı Fiziği ve Enerji Kimlik Belgesi Simülasyonu",
    "/solutions/ax3000/elektrik": "AX3000 Elektrik Tesisatı — BIM Tabanlı Kuvvetli ve Zayıf Akım",
    "/solutions/ax3000/havalandirma": "AX3000 Havalandırma — 3B Kanal Tasarımı ve Basınç Kaybı Hesabı",
    "/solutions/ax3000/isitma": "AX3000 Isıtma Tesisatı — Isı Yükü, Radyatör ve Yerden Isıtma",
    "/solutions/ax3000/konut-havalandirma": "AX3000 Konut Havalandırma — Kontrollü Mekanik Havalandırma",
    "/solutions/ax3000/sihhi-tesisat": "AX3000 Sıhhi Tesisat — Temiz Su, Atık Su ve Yağmur Suyu BIM",
    "/solutions/ax3000/sprinkler": "AX3000 Sprinkler — Yangın Söndürme ve Hidrolik Hesap Çözümü",
    "/solutions/bimflex": "BIMFlex Allplan Eklenti Paketi — Otomatik Betonarme Donatı",
    "/solutions/bimx5": "BIMX5 — 5B Metraj, Keşif ve BIM Maliyet Yönetimi",
    "/solutions/bridge-design": "ALLPLAN Bridge — Parametrik Köprü Modelleme ve Analiz",
    "/solutions/cds-addon": "CDS Add-On Paketi — İsviçre Mühendislik ve Üretkenlik Eklentileri",
    "/solutions/features-allplan-bridge": "ALLPLAN Bridge Özellikleri — 4B Köprü BIM ve Öngerme Analizi",
    "/solutions/imar-yonetmeligi-bim-eklentisi": "Planlı Alanlar İmar Yönetmeliği BIM Denetim Eklentisi",
    "/solutions/infrastructure": "Altyapı Mühendisliği — Yol, Köprü, Tünel ve Arazi BIM Çözümü",
    "/solutions/mep": "MEP Mühendisliği — Mekanik, Elektrik ve Tesisat BIM Koordinasyonu",
    "/solutions/modeling-of-precast-girder-bridges": "Prefabrik Kirişli Köprülerin Parametrik BIM Modellemesi",
    "/solutions/oska": "ALLPLAN & Oska e-Hakediş Pro — Yaklaşık Maliyet ve İhale",
    "/solutions/poz-catalog": "ALLPLAN Poz Kataloğu — Çevre ve Şehircilik Birim Fiyat Entegrasyonu",
    "/solutions/precast": "Prekast Beton Üretimi — Otomatik Pafta ve ERP/MES Entegrasyonu",
    "/solutions/pythonpart": "Allto PythonPart — Parametrik Betonarme Donatı Otomasyonu",
    "/solutions/rebar-engineering": "Donatı Mühendisliği — 3B Betonarme Detaylandırma ve Metraj",
    "/solutions/road-railway": "Yol ve Demiryolu Tasarımı — Parametrik Koridor ve Altyapı BIM",
    "/solutions/scalypso": "Scalypso — 3B Lazer Tarama ve Nokta Bulutu (Point Cloud) BIM",
    "/solutions/scalypso/converter": "Scalypso Converter — Lazer Tarama Veri Formatı Dönüştürücü",
    "/solutions/scalypso/mobile": "Scalypso Mobile — Mobil Haritalama ve Nokta Bulutu İşleme",
    "/solutions/scalypso/modeler": "Scalypso Modeler — Nokta Bulutundan Doğrudan 3B BIM Elemanı Üretimi",
    "/solutions/scalypso/videos": "Scalypso Eğitim Videoları ve Nokta Bulutu Uygulama Örnekleri",
    "/solutions/scalypso/viewer": "Scalypso Viewer — Yüksek Yoğunluklu Nokta Bulutu Görüntüleyici",
    "/solutions/site-planning": "Şantiye Planlaması — Vinç, İskele ve İş Güvenliği 4B BIM",
    "/solutions/steel": "Çelik Detaylandırma ve İmalat — ALLPLAN & SDS2 Entegre İş Akışı",
    "/solutions/structural": "Strüktürel Mühendislik — Betonarme, Çelik ve Analiz BIM Çözümü",
}

playlist_by_id = {}
for pm in ir.get("playlist_map", []):
    pid = pm["slug"]
    videos = pm.get("videos") or (ir.get("video_collections") or {}).get(pm.get("collection"), [])
    playlist_by_id[pid] = {
        "id": pid,
        "url": f"/solutions-v2/training/video-library/{pid}",
        "key": pm.get("collection") or pid,
        "title": pm["title"],
        "subtitle": pm.get("subtitle", ""),
        "count": pm.get("video_count") or len(videos),
        "videos": videos,
    }


def classify_section(route_path: str) -> str:
    if route_path == "/":
        return "home"
    if route_path.startswith("/products"):
        return "products"
    if route_path.startswith("/solutions-v2/training/video-library/"):
        return "video-library"
    if route_path.startswith("/solutions-v2/training"):
        return "training"
    if route_path.startswith("/solutions-v2"):
        return "solutions-v2"
    if route_path.startswith("/solutions"):
        return "solutions"
    if route_path in {"/gizlilik-politikasi", "/kullanim-sartlari", "/kvkk"}:
        return "legal"
    if route_path in {"/about", "/contact", "/references", "/paket-karsilastirma", "/package-overview"}:
        return "corporate"
    return "utility"


def build_breadcrumbs(route_path: str, page_h1: str) -> list:
    if route_path == "/":
        return [{"label": "Ana Sayfa", "href": "/"}]
    crumbs = [{"label": "Ana Sayfa", "href": "/"}]
    if route_path == "/solutions-v2/faq":
        crumbs.append({"label": "Sıkça Sorulan Sorular", "href": route_path})
        return crumbs
    if route_path.startswith("/products/ax3000/"):
        crumbs.extend([
            {"label": "Ürünler", "href": "/products"},
            {"label": "AX3000", "href": "/products/ax3000"},
            {"label": page_h1, "href": route_path},
        ])
        return crumbs
    if route_path.startswith("/products/"):
        crumbs.extend([
            {"label": "Ürünler", "href": "/products"},
            {"label": page_h1, "href": route_path},
        ])
        return crumbs
    if route_path.startswith("/solutions/addons/"):
        crumbs.extend([
            {"label": "Çözümler", "href": "/solutions"},
            {"label": "Eklentiler", "href": "/solutions/addons"},
            {"label": page_h1, "href": route_path},
        ])
        return crumbs
    if route_path.startswith("/solutions/ax3000/"):
        crumbs.extend([
            {"label": "Çözümler", "href": "/solutions"},
            {"label": "AX3000 MEP", "href": "/solutions/ax3000"},
            {"label": page_h1, "href": route_path},
        ])
        return crumbs
    if route_path.startswith("/solutions/scalypso/"):
        crumbs.extend([
            {"label": "Çözümler", "href": "/solutions"},
            {"label": "Scalypso", "href": "/solutions/scalypso"},
            {"label": page_h1, "href": route_path},
        ])
        return crumbs
    if route_path.startswith("/solutions/"):
        crumbs.extend([
            {"label": "Çözümler", "href": "/solutions"},
            {"label": page_h1, "href": route_path},
        ])
        return crumbs
    if route_path.startswith("/solutions-v2/training/video-library/"):
        crumbs.extend([
            {"label": "Video Kütüphanesi", "href": "/solutions-v2/training/video-library"},
            {"label": page_h1, "href": route_path},
        ])
        return crumbs
    if route_path.startswith("/solutions-v2/training/"):
        crumbs.append({"label": page_h1, "href": route_path})
        return crumbs
    if route_path.startswith("/solutions-v2/connect-license/"):
        crumbs.extend([
            {"label": "Çözümler", "href": "/solutions"},
            {"label": "Lisans Yönetimi", "href": "/solutions-v2/connect-license"},
            {"label": page_h1, "href": route_path},
        ])
        return crumbs
    if route_path.startswith("/solutions-v2/"):
        crumbs.extend([
            {"label": "Çözümler", "href": "/solutions"},
            {"label": page_h1, "href": route_path},
        ])
        return crumbs
    crumbs.append({"label": page_h1, "href": route_path})
    return crumbs


def determine_schema_type(route_path: str) -> str:
    if route_path == "/about":
        return "AboutPage"
    if route_path == "/contact":
        return "ContactPage"
    if route_path == "/solutions-v2/faq":
        return "FAQPage"
    if route_path.startswith("/solutions-v2/training/video-library"):
        return "VideoGallery"
    if route_path in {"/products", "/solutions", "/solutions/addons", "/solutions-v2/addons"}:
        return "CollectionPage"
    if route_path.startswith("/products/") and route_path != "/products/ax3000/dokumanlar":
        return "SoftwareApplication"
    return "WebPage"


def normalize_href(href: str) -> str:
    if not href:
        return "#"
    trimmed = str(href).strip()
    if "aluplan.net.tr" in trimmed.lower() or "allplan.net.tr" in trimmed.lower():
        return "https://allplan.net.tr/tr"
    if (
        trimmed == "/try-free"
        or "allplan.com/trial-or-subscription" in trimmed
        or trimmed == "https://www.allplan.com/tr/deneme-veya-abonelik/"
    ):
        return "https://www.allplan.com/trial-or-subscription/"
    if trimmed.startswith("/cdn-cgi/l/email-protection"):
        return "mailto:info@aluplan.com.tr"
    if trimmed in {"/solutions/bimplus", "https://aluplan.com.tr/solutions/bimplus"}:
        return "/products/allplan-bimplus"
    if trimmed in {"/allplan-2026nin-ozellikleri", "https://aluplan.com.tr/allplan-2026nin-ozellikleri"}:
        return "/products/allplan-2026-yenilikler"
    if "allplan-2021-features" in trimmed:
        return "/products/allplan-2026-yenilikler"
    if trimmed in {"/solutions/industry", "https://aluplan.com.tr/solutions/industry"}:
        return "/solutions/steel"
    if "youtube.com/@AllplanInternational" in trimmed:
        return "https://www.youtube.com/c/AllplanInternational"
    if "assets/documents/ax3000/ax3000-brochure-de" in trimmed:
        return "/docs/ax3000/ax3000-brochure-de.pdf"
    if "assets/documents/ax3000/ax3000-brochure-en-alternative" in trimmed:
        return "/docs/ax3000/ax3000-brochure-en-alternative.pdf"
    if "assets/documents/ax3000/ax3000-brochure-en" in trimmed:
        return "/docs/ax3000/ax3000-brochure-en.pdf"
    if "assets/documents/ax3000/ax3000-functions-en" in trimmed and trimmed.endswith(".docx"):
        return "/docs/ax3000/ax3000-functions-en.docx"
    if "assets/documents/ax3000/ax3000-functions-en" in trimmed and trimmed.endswith(".pdf"):
        return "/docs/ax3000/ax3000-functions-en.pdf"
    if "assets/documents/ax3000/ax3000-functions-hexagon-en" in trimmed:
        return "/docs/ax3000/ax3000-functions-hexagon-en.docx"
    return trimmed


EXCLUDED_DEV_PATHS = {"/hero-3d", "/test-webgl"}
SKIP_HEADING_TEXTS = {
    "Ürünler",
    "ÇÖZÜMLER",
    "İletişim",
    "ALLPLAN'ı ücretsiz deneyin",
    "DAHA İYİ YARINLAR İNŞA ETMEK İÇİN TASARIM",
}

pages_data = {}
used_titles = set()
used_descriptions = set()

raw_200_pages = sorted(
    [p for p in inv["pages"] if p.get("status") == 200],
    key=lambda x: x["url"],
)

for raw_page in raw_200_pages:
    route_path = raw_page["url"].replace("https://aluplan.com.tr", "") or "/"
    if route_path in EXCLUDED_DEV_PATHS:
        continue

    raw_headings = [
        {"level": int(h["level"]), "text": clean_text(h["text"])}
        for h in raw_page.get("headings", [])
        if clean_text(h.get("text")) and clean_text(h.get("text")) not in SKIP_HEADING_TEXTS
    ]

    h1_text = ""
    body_headings = []

    if route_path.startswith("/solutions-v2/training/video-library/") and route_path != "/solutions-v2/training/video-library":
        pid = route_path.split("/")[-1]
        pl = playlist_by_id.get(pid)
        h1_text = f"{pl['title']} — Eğitim Video Serisi" if pl else ROUTE_LABELS.get(route_path, pid)
        for h in raw_headings:
            if h["text"] == "Video Kütüphanesi":
                continue
            body_headings.append({
                "level": 2 if h["level"] == 1 else h["level"],
                "text": h["text"],
            })
    else:
        found_first_h1 = False
        for h in raw_headings:
            if h["level"] == 1 and not found_first_h1:
                h1_text = h["text"]
                found_first_h1 = True
            else:
                body_headings.append({
                    "level": 2 if h["level"] == 1 else h["level"],
                    "text": h["text"],
                })
        if not h1_text:
            h1_text = ROUTE_LABELS.get(route_path) or (raw_headings[0]["text"] if raw_headings else "Aluplan Mühendislik ve BIM Çözümleri")

    raw_nodes = [clean_text(t) for t in raw_page.get("text_nodes", []) if clean_text(t)]
    start_idx = 0
    while start_idx < min(len(raw_nodes), 14) and raw_nodes[start_idx] in HEADER_EXACT:
        start_idx += 1
    if start_idx < len(raw_nodes) and raw_nodes[start_idx] == "Ana Sayfa":
        start_idx += 2
        if start_idx < len(raw_nodes) and raw_nodes[start_idx] == "Ana Sayfaya Dön":
            start_idx += 1

    end_idx = len(raw_nodes)
    for i in range(len(raw_nodes) - 1, -1, -1):
        if raw_nodes[i] == FOOTER_START_MARKER:
            end_idx = i
            break
    if route_path != "/":
        for i in range(end_idx - 1, -1, -1):
            if raw_nodes[i] == GLOBAL_CTA_START_MARKER:
                end_idx = i - 1 if (i > 0 and raw_nodes[i - 1] == "ALLPLAN") else i
                break

    body_nodes = [n for n in raw_nodes[start_idx:end_idx] if n]

    heading_set = {h["text"] for h in body_headings}
    sections = []
    current_section = {"heading": h1_text, "level": 2, "items": []}

    SSR_NOISE_NODES = {"0", "%", "Previous slide", "Next slide"}

    for node in body_nodes:
        if node == h1_text or node in SSR_NOISE_NODES:
            continue
        if node in heading_set:
            if current_section["heading"] == node:
                continue
            if current_section["items"] or not sections:
                sections.append(current_section)
            matched_h = next((h for h in body_headings if h["text"] == node), None)
            current_section = {
                "heading": node,
                "level": matched_h["level"] if matched_h else 2,
                "items": [],
            }
        else:
            if not current_section["items"] or current_section["items"][-1] != node:
                current_section["items"].append(node)
    if current_section["items"] or not sections:
        sections.append(current_section)

    content_links = []
    seen_links = set()
    for l in raw_page.get("links", []):
        if l.get("location") in {"header", "nav", "footer"}:
            continue
        raw_href = (l.get("attributes") or {}).get("href", "")
        if not raw_href or raw_href in {"#main", "#main-content"} or "cdn-ildjmbl.nitrocdn.com" in raw_href:
            continue
        if route_path == "/products/precast-detail" and raw_href == "#":
            raw_href = "https://info.allplan.com/en/precast/construction-trend.html"
        href = normalize_href(raw_href)
        text = clean_text(l.get("text") or (l.get("attributes") or {}).get("aria-label") or href)
        key = f"{href}::{text}"
        if key not in seen_links:
            seen_links.add(key)
            content_links.append({
                "href": href,
                "text": text or href,
                "external": href.startswith("http") and not href.startswith("https://aluplan.com.tr"),
            })

    buttons = []
    seen_btns = set()
    for b in raw_page.get("buttons", []):
        if b.get("location") in {"nav", "header", "footer"}:
            continue
        text = clean_text(b.get("text") or (b.get("attributes") or {}).get("aria-label") or "")
        if text and text not in {"Çözümler", "Ürünler", "Arama", "Toggle theme"} and text not in seen_btns:
            seen_btns.add(text)
            buttons.append(text)

    images = []
    seen_imgs = set()
    img_by_alt = {}
    for img in raw_page.get("images", []):
        if img.get("location") in {"nav", "header", "footer"}:
            continue
        raw_src = (img.get("attributes") or {}).get("src", "")
        src = resolve_media_src(raw_src)
        alt = clean_text((img.get("attributes") or {}).get("alt") or h1_text)
        if not src:
            continue
        im_obj = {
            "src": src,
            "alt": alt or h1_text,
            "isIcon": is_icon_image(src),
        }
        norm_alt = re.sub(r"\s+", " ", (alt or h1_text).strip().upper())
        img_by_alt.setdefault(norm_alt, im_obj)
        # Preserve distinct source image roles even when cards reuse one asset.
        # Rendering may de-duplicate gallery photos by src, but the data layer
        # must retain each source alt/role for semantic parity.
        image_identity = (src, alt or h1_text)
        if image_identity not in seen_imgs:
            seen_imgs.add(image_identity)
            images.append(im_obj)

    # Attach matched iconSrc, high-res image, and statValue to each section
    page_stat_map = route_stats.get(route_path, {})

    for sec in sections:
        norm_h = re.sub(r"\s+", " ", sec["heading"].strip().upper())
        if norm_h in page_stat_map:
            sec["statValue"] = page_stat_map[norm_h]
        matched_im = img_by_alt.get(norm_h)
        if matched_im and norm_h != re.sub(r"\s+", " ", h1_text.strip().upper()):
            if matched_im.get("isIcon"):
                sec["iconSrc"] = matched_im["src"]
            else:
                sec["image"] = {"src": matched_im["src"], "alt": matched_im["alt"]}

    videos = []
    seen_vids = set()
    pending_poster = ""
    pending_autoplay = False
    for m in raw_page.get("media", []):
        tag = m.get("tag")
        attrs = m.get("attributes") or {}
        if tag == "video":
            if attrs.get("poster"):
                pending_poster = resolve_media_src(attrs["poster"])
            if "autoplay" in attrs:
                pending_autoplay = True
            if attrs.get("src"):
                vsrc = resolve_media_src(attrs["src"])
                if vsrc and vsrc not in seen_vids:
                    seen_vids.add(vsrc)
                    videos.append({
                        "src": vsrc,
                        "poster": pending_poster or None,
                        "title": clean_text(attrs.get("aria-label") or Path(vsrc).stem.replace("_", " ")),
                        "controls": "controls" in attrs,
                        "autoplay": "autoplay" in attrs,
                    })
                    pending_poster = ""
                    pending_autoplay = False
        elif tag == "source" and attrs.get("src"):
            vsrc = resolve_media_src(attrs["src"])
            if vsrc and vsrc not in seen_vids:
                seen_vids.add(vsrc)
                videos.append({
                    "src": vsrc,
                    "poster": pending_poster or None,
                    "title": h1_text,
                    "controls": not pending_autoplay,
                    "autoplay": pending_autoplay,
                })
                pending_poster = ""
                pending_autoplay = False

    embeds = []
    for emb in raw_page.get("embeds", []):
        src = (emb.get("attributes") or {}).get("src") or emb.get("src") or ""
        if src:
            embeds.append({
                "src": src,
                "title": clean_text((emb.get("attributes") or {}).get("title") or h1_text),
            })

    raw_title = clean_text(raw_page.get("title"))
    if route_path == "/":
        seo_title = "ALLPLAN Türkiye | Profesyonel BIM Yazılımları | Aluplan"
    elif route_path in ROUTE_LABELS:
        seo_title = f"{ROUTE_LABELS[route_path]} | Aluplan"
    elif raw_title and raw_title not in GENERIC_TITLES:
        seo_title = raw_title if raw_title.endswith("| Aluplan") else f"{raw_title} | Aluplan"
    else:
        seo_title = f"{h1_text} | Aluplan BIM Çözümleri"
    if seo_title in used_titles:
        seo_title = f"{h1_text} ({route_path}) | Aluplan"
    used_titles.add(seo_title)

    meta_desc_obj = next((m for m in raw_page.get("meta", []) if isinstance(m, dict) and m.get("name") == "description"), None)
    raw_desc = clean_text(meta_desc_obj.get("content") if meta_desc_obj else "")
    if raw_desc and raw_desc not in GENERIC_DESCRIPTIONS and raw_desc not in used_descriptions:
        seo_description = raw_desc
    else:
        meaningful = [n for n in body_nodes if len(n) > 35 and n != h1_text]
        snippet = " ".join(meaningful[:2])[:155]
        if snippet:
            seo_description = f"{h1_text}: {snippet}"
        else:
            seo_description = f"{h1_text} — Aluplan Program Sistemleri tarafından Türkiye'de sunulan ALLPLAN BIM yazılım, eğitim ve mühendislik çözümü ({route_path})."
    if seo_description in used_descriptions:
        seo_description = f"{seo_description} [{route_path}]"
    used_descriptions.add(seo_description)

    canonical = "https://aluplan.com.tr" if route_path == "/" else f"https://aluplan.com.tr{route_path}"
    section_type = classify_section(route_path)
    short_label = (ROUTE_LABELS.get(route_path, h1_text).split("—")[0]).strip()
    breadcrumbs = build_breadcrumbs(route_path, short_label)
    schema_type = determine_schema_type(route_path)
    pid = (
        route_path.split("/")[-1]
        if route_path.startswith("/solutions-v2/training/video-library/") and route_path != "/solutions-v2/training/video-library"
        else None
    )

    pages_data[route_path] = {
        "path": route_path,
        "section": section_type,
        "title": seo_title,
        "description": "Otomatik çelik detaylandırma yazılımı" if route_path == "/products/sds2-home" else seo_description,
        "canonical": canonical,
        "h1": "Çelik detaylandırma ve imalat için kapsamlı BIM çözümü" if route_path == "/products/sds2-home" else h1_text,
        "eyebrow": section_type.upper(),
        "breadcrumbs": breadcrumbs,
        "headings": body_headings,
        "bodyNodes": body_nodes,
        "sections": sections,
        "contentLinks": content_links,
        "buttons": buttons,
        "images": images,
        "videos": videos,
        "embeds": embeds,
        "playlistId": pid,
        "interactiveStates": interactive_by_path.get(route_path, []),
        "schemaType": schema_type,
        "structuredLayout": STRUCTURED_LAYOUTS.get(route_path),
    }

# Only the retired CDS/PythonPart/Scalypso demand form is remapped.
# License manager forms, support and official trial destinations remain distinct.
pages_data = apply_source_card_links(apply_approved_content_policy(normalize_request_links(pages_data)))

# The user explicitly directs all buttons with this label to release notes.
def update_release_notes_links(value):
    if isinstance(value, dict):
        if value.get("text") == "Sürümleri Görüntüle" and "href" in value:
            value["href"] = "https://www.allplan.com/system/releasenotes/"
            value["external"] = True
        for child in value.values():
            update_release_notes_links(child)
    elif isinstance(value, list):
        for child in value:
            update_release_notes_links(child)

update_release_notes_links(pages_data)

# Source routes that the 2027 site publishes under a different slug. Extraction and per-route
# policy above still use the source route; the rename is applied to the finished data only.
ROUTE_RENAMES = {"/solutions-v2/faq": "/faq"}
# A prefix rename moves a page and everything below it (the video library hub and its playlists).
ROUTE_PREFIX_RENAMES = {"/solutions-v2/training/video-library": "/video-kutuphanesi"}
SITE_URL_ORIGIN = "https://aluplan.com.tr"


def rename_route_value(value: str) -> str:
    for prefix in ("", SITE_URL_ORIGIN):
        for old, new in ROUTE_RENAMES.items():
            if value == prefix + old or value.startswith((prefix + old + "#", prefix + old + "?")):
                return prefix + new + value[len(prefix + old):]
        for old, new in ROUTE_PREFIX_RENAMES.items():
            if value == prefix + old or value.startswith((prefix + old + "/", prefix + old + "#", prefix + old + "?")):
                return prefix + new + value[len(prefix + old):]
    return value


def rename_routes(value):
    if isinstance(value, dict):
        return {rename_route_value(key): rename_routes(child) for key, child in value.items()}
    if isinstance(value, list):
        return [rename_routes(child) for child in value]
    if isinstance(value, str):
        return rename_route_value(value)
    return value


pages_data = rename_routes(pages_data)

# Pages the 2027 site no longer publishes; their URLs redirect (see next.config.mjs).
REMOVED_ROUTES = (
    "/solutions-v2/training",
    "/solutions-v2/training/webinar",
    "/solutions-v2/training/online",
    "/solutions-v2/training/classroom",
    "/solutions-v2/training/events",
    "/solutions-v2/training/individual",
    "/solutions-v2/training/e-learning",
    "/solutions-v2/training/quick-start",
)
pages_data = {path: page for path, page in pages_data.items() if path not in REMOVED_ROUTES}

data_dir = ROOT / "src/data"
data_dir.mkdir(parents=True, exist_ok=True)

with open(data_dir / "pages.json", "w", encoding="utf-8") as f:
    json.dump(pages_data, f, ensure_ascii=False, indent=2)

with open(data_dir / "playlists.json", "w", encoding="utf-8") as f:
    json.dump(rename_routes(playlist_by_id), f, ensure_ascii=False, indent=2)

site_identity = {
    "name": "Aluplan Program Sistemleri",
    "alternateName": "Aluplan Türkiye",
    "description": "1995'ten beri Türkiye'nin güvenilir ALLPLAN distribütörü. Mimari ve mühendislik projeleriniz için profesyonel BIM çözümleri.",
    "foundingDate": "1995",
    "email": "info@aluplan.com.tr",
    "telephone": "+90-216-225-84-41",
    "displayPhones": ["(+90) 216 225 84 41", "(+90) 543 211 94 42", "(+90) 549 499 73 79"],
    "phoneLinks": ["+902162258441", "+905432119442", "+905494997379"],
    "address": {
        "@type": "PostalAddress",
        "streetAddress": "Quick Tower – Workinton, İçerenköy Mah. Topçu İbrahim Sok. 8/10D No: 5",
        "addressLocality": "Ataşehir",
        "addressRegion": "İstanbul",
        "postalCode": "34752",
        "addressCountry": "TR",
    },
    "displayAddress": "Quick Tower – Workinton, İçerenköy Mah. Topçu İbrahim Sok. 8/10D No: 5, 34752 Ataşehir / İstanbul",
    "sameAs": [
        "https://www.facebook.com/Allplan.Turkey",
        "https://twitter.com/Allplan_Turkey",
        "https://www.linkedin.com/company/allplan-turkey/",
        "https://www.instagram.com/allplan_turkey/",
        "https://www.youtube.com/c/AllplanTurkey",
    ],
}

solution_directory = build_solution_directory(pages_data)

navigation_data = {
    "siteIdentity": site_identity,
    "solutionDirectory": solution_directory,
    "topBar": {
        "email": site_identity["email"],
        "phones": site_identity["displayPhones"],
        "socialLinks": [
            {"label": label, "href": href}
            for label, href in zip(
                ["Facebook", "Twitter", "LinkedIn", "Instagram", "YouTube"],
                site_identity["sameAs"],
            )
        ],
    },
    "productsMenu": [
        {
            "title": "ALLPLAN",
            "items": [
                {"name": "ALLPLAN Basic", "href": "/products/allplan-basic"},
                {"name": "ALLPLAN Concept", "href": "/products/allplan-concept"},
                {"name": "ALLPLAN Professional", "href": "/products/allplan-professional"},
                {"name": "ALLPLAN Ultimate", "href": "/products/allplan-ultimate"},
                {"name": "ALLPLAN Rebar", "href": "/products/allplan-rebar", "releaseOnly": True},
                {"name": "ALLPLAN Parametric", "href": "/products/allplan-parametric", "releaseOnly": True},
                {"name": "ALLPLAN Cloud Services", "href": "/products/allplan-cloud-services"},
                {"name": "CIVIL", "href": "/products/civil"},
                {"name": "PRECAST", "href": "/products/precast"},
            ],
        },
        {
            "title": "BİNA VE ALTYAPI",
            "items": [
                {"name": "Allplan - AEC Endüstrisi için BIM", "href": "/products/allplan-aec"},
                {"name": "Allplan Bridge - Köprü Tasarımı", "href": "/solutions/bridge-design"},
                {"name": "AX3000 - Enerji Simülasyonu", "href": "/products/ax3000"},
                {"name": "AX3000 - Mekanik Tesisat", "href": "/solutions/ax3000-mekanik-tesisat"},
            ],
        },
        {
            "title": "İNŞAAT PLANLAMASI",
            "items": [
                {"name": "Allplan Precast - Prekast Detaylandırma", "href": "/products/precast-detail"},
                {"name": "Tim - Prekast İş Planlaması", "href": "https://www.allplan.com/products/tim/", "external": True},
                {"name": "SDS2 - Çelik Detaylandırma ve İmalatı", "href": "https://www.allplan.com/products/sds2-detailing-fabrication/", "external": True},
                {"name": "SDS2 - Çelik Yük Planlaması", "href": "https://www.allplan.com/products/sds2-load-planning/", "external": True},
                {"name": "SDS2 - Aluplan", "href": "/products/sds2-home"},
            ],
        },
        {
            "title": "ORTAK ÇÖZÜMLER",
            "items": [
                {"name": "Allplan Ortak Çözümleri", "href": "https://www.allplan.com/allplan-partner-solutions/", "external": True},
            ],
        },
        {
            "title": "İŞBİRLİĞİ YAZILIMI",
            "items": [
                {"name": "ALLPLAN BIMPLUS", "href": "/products/allplan-bimplus"},
            ],
        },
    ],
    "solutionsMenu": [
        {
            "title": group["title"],
            "items": [
                {
                    "name": item["title"],
                    "href": item["href"],
                    **({"external": True} if item["external"] else {}),
                }
                for item in group["hubItems"]
            ],
        }
        for group in solution_directory["groups"]
    ],
    "footer": {
        "description": "1995'ten beri Türkiye'nin güvenilir Allplan distribütörü. Mimari ve mühendislik projeleriniz için profesyonel BIM çözümleri.",
        "products": [
            {"label": "ALLPLAN Basic", "href": "/products/allplan-basic"},
            {"label": "ALLPLAN Concept", "href": "/products/allplan-concept"},
            {"label": "ALLPLAN Professional", "href": "/products/allplan-professional"},
            {"label": "ALLPLAN Ultimate", "href": "/products/allplan-ultimate"},
            {"label": "CIVIL", "href": "/products/civil"},
            {"label": "PRECAST", "href": "/products/precast"},
        ],
        "solutions": [
            {"label": group["title"], "href": group["hubPath"]}
            for group in solution_directory["groups"]
        ],
        "address": [
            "Quick Tower – Workinton",
            "İçerenköy Mah. Topçu İbrahim Sok.",
            "8/10D No: 5, 34752 Ataşehir / İstanbul",
        ],
        "phones": site_identity["displayPhones"],
        "email": site_identity["email"],
        "legal": [
            {"label": "Gizlilik Politikası", "href": "/gizlilik-politikasi"},
            {"label": "Kullanım Şartları", "href": "/kullanim-sartlari"},
            {"label": "KVKK", "href": "/kvkk"},
        ],
        "copyright": "© 2026 Aluplan Program Sistemleri.",
        "credit": "Design & Develop by Hazar Volga Ekiz",
    },
}

with open(data_dir / "navigation.json", "w", encoding="utf-8") as f:
    json.dump(navigation_data, f, ensure_ascii=False, indent=2)

# Parse docs/previews/homepage-wireframe/data.js into src/data/homepage.json
hp_js = (ROOT / "docs/previews/homepage-wireframe/data.js").read_text(encoding="utf-8")
json_start = hp_js.index("{")
json_end = hp_js.rindex("}") + 1
homepage_data = json.loads(hp_js[json_start:json_end])
if "bimflex" in homepage_data:
    if "logo" in homepage_data["bimflex"]:
        homepage_data["bimflex"]["logo"]["src"] = "/" + homepage_data["bimflex"]["logo"]["src"].lstrip("/")
    for m in homepage_data["bimflex"].get("media", []):
        m["src"] = "/" + m["src"].lstrip("/")

homepage_data["heroVideo"] = {
    "src": "/videos/hero-bim.mp4",
    "poster": "/images/hero-poster.jpg",
}
homepage_data["releaseLabel"] = "ALLPLAN 2026"
homepage_data["packageMatrixLabel"] = "Q3 2026 MATRİSİ"
homepage_data["heroContent"] = {
    "distributorLabel": "1995'ten beri Yetkili Distribütör",
    "title": "DAHA İYİ BİR GELECEK İNŞA ETMEK İÇİN TASARLANDI",
    "description": "Yenilikçi AEC iş akışları, parametrik donatı ve çelik otomasyonu ile bulut tabanlı OpenBIM iş birliği sayesinde tasarım aşamasından şantiyeye kadar hatasız projeler.",
    "tags": [
        "CLOUD NATIVE", "BIM LEVEL 3", "PARAMETRIC", "AUTOMATION",
        "INTEROPERABILITY", "AX3000", "PYTHONPARTS", "OPENBIM",
        "REAL-TIME", "PRECAST", "CIVIL", "BRIDGE", "@CONNECTION", "DATA_NODE",
    ],
    "monitorLabel": "BIM ENGINE",
    "monitorProtocol": "IFC 4.3 · OPENBIM",
    "monitorDisciplines": "MİMARİ · MÜHENDİSLİK · ALTYAPI · PREKAST",
    "monitorDescription": "Disiplinler arası BIM koordinasyonu ve yerel mühendislik desteği için tek platform.",
}

ROLE_ENRICH = {
    "architect": {"icon": "building-2", "image": "/assets/solutions/architecture-hero.jpg"},
    "engineer": {"icon": "ruler", "image": "/assets/product-engineering.jpg"},
    "precast": {"icon": "boxes", "image": "/assets/solutions/precast-hero.jpg"},
}
for r in homepage_data.get("roles", []):
    extra = ROLE_ENRICH.get(r["id"], {})
    r["icon"] = extra.get("icon", "layers")
    r["image"] = extra.get("image", "/assets/solutions/architecture-hero.jpg")

PRODUCT_IMAGES = {
    "basic": "/assets/products/allplan-basic/2d-drafting.jpg",
    "concept": "/assets/products/allplan-concept/clash-detection.jpg",
    "professional": "/assets/products/allplan-professional/3d-modeling.jpg",
    "ultimate": "/assets/allplan-ultimate/core/parametric-modeling.jpg",
    "civil": "/assets/products/civil/3d-modeling.jpg",
    "precast": "/assets/allplan-ultimate/core/precast-design-and-detailing.jpg",
}
for p in homepage_data.get("products", []):
    p["image"] = PRODUCT_IMAGES.get(p["id"], "/assets/products/allplan-professional/3d-modeling.jpg")

SOLUTION_IMAGES = {
    "/solutions-v2/building-design": "/assets/solutions/architecture-hero.jpg",
    "/solutions-v2/infrastructure": "/assets/solutions/infrastructure-hero.jpg",
    "/solutions-v2/construction": "/assets/solutions/precast-hero.jpg",
    "/solutions-v2/addons": "/assets/product-engineering.jpg",
    "/solutions-v2/other": "/assets/solutions/architecture-hero.jpg",
}
for s in homepage_data.get("solutions", []):
    s["image"] = SOLUTION_IMAGES.get(s["href"], "/assets/solutions/architecture-hero.jpg")

INNOVATION_IMAGES = {
    "ai-visualization": "/assets/allplan-ultimate/core/ai-based-viz.jpg",
    "rebar-to-site": "/assets/allplan-ultimate/core/reinforcement.jpg",
    "unified-terrain": "/assets/allplan-ultimate/core/terrain-model.jpg",
}
for inv_card in homepage_data.get("innovations", []):
    inv_card["image"] = INNOVATION_IMAGES.get(inv_card["id"], "/assets/allplan-ultimate/core/ai-based-viz.jpg")

homepage_data["partners"] = [
    {"name": "Bluebeam", "logo": "/images/partners/bluebeam.jpg"},
    {"name": "Enscape", "logo": "/images/partners/enscape.png"},
    {"name": "FRILO", "logo": "/images/partners/frilo.png"},
    {"name": "Lumion", "logo": "/images/partners/lumion.png"},
    {"name": "SCIA Engineer", "logo": "/images/partners/scia.png"},
    {"name": "Solibri", "logo": "/images/partners/solibri.png"},
    {"name": "Tekla", "logo": "/images/partners/tekla.svg"},
    {"name": "Trimble", "logo": "/images/partners/trimble.png"},
    {"name": "Twinmotion", "logo": "/images/partners/twinmotion.png"},
]

for s in homepage_data.get("services", []):
    if "aluplan.net.tr" in s.get("href", "").lower() or "allplan.net.tr" in s.get("href", "").lower():
        s["href"] = "https://allplan.net.tr/tr"

# 2027 additions to the learning group; the source homepage does not carry them.
# Copy and destinations are provisional until the user supplies the final ones.
ADDED_SERVICES = [
    {
        "title": "Video Kütüphanesi",
        "description": "ALLPLAN eğitim videolarını ve oynatma listelerini izleyin.",
        "status": "active",
        "href": "/video-kutuphanesi",
        "cta": "İzle",
    },
    {
        "title": "Kaydedilmiş Webinarlar",
        "description": "Kaçırdığınız veya tekrar izlemek istediğiniz webinarlarımıza buradan ulaşabilirsiniz.",
        "status": "active",
        "href": "/kaydedilmis-webinarlar",
        "cta": "İncele",
    },
    {
        "title": "Eğitim Merkezleri",
        "description": "Eğitim merkezlerimiz ve eğitim olanakları hakkında bilgi alın.",
        "status": "active",
        "href": "/egitim-merkezlerimiz",
        "cta": "İncele",
    },
]
REMOVED_SERVICES = ("Eğitim",)
homepage_data["services"] = [
    *(service for service in homepage_data.get("services", []) if service["title"] not in REMOVED_SERVICES),
    *ADDED_SERVICES,
]

SERVICE_ICONS = {
    "Teknik Destek": "life-buoy", "Destek Platformu": "life-buoy",
    "Danışmanlık": "users", "Sertifika": "award", "Download": "download", "Connect: Giriş": "key",
    "Admin Lisans : Lisans Yöneticisi Bilgi Formu": "shield", "CodeMeter WebDepot": "key",
    "Deklarasyon Formu": "file-text", "ALLPLAN FAQ": "circle-help", "Blog Global": "globe",
    "Canlı Webinarlar": "video", "BIM Rehberi": "book-open", "OPENBIM": "boxes",
    "Sistem Gereksinimleri": "cpu", "Tüm Gereksinimler": "layers", "Sürüm Notları": "sparkles",
    "IFC Export El Kitabı": "file-text", "Partner": "users",
    "Video Kütüphanesi": "circle-play", "Kaydedilmiş Webinarlar": "video", "Eğitim Merkezleri": "map-pin",
}
for service in homepage_data.get("services", []):
    service["icon"] = SERVICE_ICONS.get(service["title"], "layers")

homepage_data["serviceGroups"] = [
    {"title": "Öğren ve yardım al", "serviceTitles": ["Video Kütüphanesi", "Kaydedilmiş Webinarlar", "Eğitim Merkezleri", "Teknik Destek", "Destek Platformu", "Danışmanlık", "Sertifika"]},
    {"title": "Yazılım ve lisans işlemleri", "serviceTitles": ["Download", "Connect: Giriş", "Admin Lisans : Lisans Yöneticisi Bilgi Formu", "CodeMeter WebDepot", "Deklarasyon Formu"]},
    {"title": "Bilgi ve güncellemeler", "serviceTitles": ["ALLPLAN FAQ", "Blog Global", "Canlı Webinarlar", "BIM Rehberi", "OPENBIM", "Sistem Gereksinimleri", "Tüm Gereksinimler", "Sürüm Notları", "IFC Export El Kitabı"]},
    {"title": "Partner erişimi", "serviceTitles": ["Partner"]},
]

with open(data_dir / "homepage.json", "w", encoding="utf-8") as f:
    json.dump(rename_routes(homepage_data), f, ensure_ascii=False, indent=2)

video_library_data = {
    "hero": {
        "kicker": "GÖRSEL EĞİTİM",
        "title": "Video Kütüphanesi",
        "lead": "İhtiyacınız olan bilgiye görsel olarak ulaşın.",
    },
    "kicker": "GÖRSEL EĞİTİM · VİDEO KÜTÜPHANESİ",
    "title": "Önerilen Oynatma Listeleri ve Kanallar",
    "description": "Sizin için derlediğimiz en popüler ve faydalı video kaynak liste ve kanalları.",
    "subscribe": {
        "badge": "Resmi Kanal",
        "title": "Allplan Türkiye YouTube Kanalına Abone Olun",
        "description": "En yeni eğitim videoları, ipuçları, webinar kayıtları ve sektörel gelişmelerden anında haberdar olmak için kanalımıza abone olmayı unutmayın.",
        "href": "https://www.youtube.com/@AllplanTurkey?sub_confirmation=1",
        "label": "ABONE OL",
    },
    "items": [
        {"title": "Allplan 2026", "description": "Allplan 2026 sürümü için hazırlanmış kapsamlı eğitim videoları ve yenilikler.", "url": "https://youtube.com/playlist?list=PLowC-ZFUywGMotfHSyzqoNZCQYWl_6G1x&si=BSEJvgjsQWgbIwVe"},
        {"title": "Youtube Allplan English", "description": "Allplan global İngilizce içerikleri, uluslararası örnekler ve eğitimler.", "url": "https://www.youtube.com/@ALLPLANEnglish"},
        {"title": "ALLPLAN YouTube Kanalı", "description": "Dünya genelinden Allplan kullanıcı hikayeleri ve küresel etkinlikler.", "url": "https://www.youtube.com/c/AllplanInternational"},
        {"title": "Youtube Allplan Precast", "description": "Prekast beton tasarımı ve üretimi üzerine özelleşmiş Almanca/İngilizce içerikler.", "url": "https://www.youtube.com/c/AllplanPrecast"},
        {"title": "Allplan ile Tanışın: Tüm Disiplinler İçin Temel Eğitim Videoları", "description": "Allplan 2024 sürümü ile gelen tüm yeniliklerin Türkçe anlatımı.", "url": "/solutions-v2/training/video-library/hello-allplan-2024"},
        {"title": "Allplan Add On Geometry Tools", "description": "Topografik ve geometrik düzenleme araçları, arazi modelleme eğitimleri.", "url": "/solutions-v2/training/video-library/addon-geometry"},
        {"title": "AX3000 - MEP & Enerji", "description": "Mekanik, Elektrik, Tesisat ve Enerji Kimlik Belgesi (EKB) eğitimleri.", "url": "/solutions-v2/training/video-library/ax3000"},
        {"title": "Youtube CDS Allplan Add-On", "description": "CDS (Campus Delivery System) ve eklenti geliştirmeleri üzerine videolar.", "url": "#"},
        {"title": "Allplan Road Design Workflow", "description": "Yol tasarımı iş akışları ve yol modülü eğitim videoları.", "url": "/solutions-v2/training/video-library/road-design"},
        {"title": "Allplan Bridge Workflows", "description": "Köprü tasarımı süreçleri ve BIM entegrasyonu.", "url": "/solutions-v2/training/video-library/bridge-workflows"},
        {"title": "Campus Tutorials (Deutsch)", "description": "Öğrenciler için detaylı Almanca eğitim serisi.", "url": "/solutions-v2/training/video-library/campus-de"},
        {"title": "Campus Tutorials (English)", "description": "Öğrenciler için kapsamlı İngilizce eğitim serisi.", "url": "/solutions-v2/training/video-library/campus-en"},
        {"title": "Allplan Bridge", "description": "Allplan Bridge modülünün genel tanıtımı ve özellikleri.", "url": "#"},
        {"title": "Allplan Bridge Tutorials", "description": "Adım adım köprü modelleme ve analiz rehberleri.", "url": "#"},
        {"title": "SDS2 Detaylandırma", "description": "SDS2 ürün tanıtımı ve lansman videoları.", "url": "/solutions-v2/training/video-library/sds2-intro"},
        {"title": "Konut İnşaatı İş Akışları", "description": "Konut proje teslimi, tasarım ve şantiye planlama süreçleri.", "url": "/solutions-v2/training/video-library/konut-insaati"},
        {"title": "Bridge Workflow 2022", "description": "2022 Köprü tasarımı ve iş akışları eğitim serisi.", "url": "/solutions-v2/training/video-library/bridge-workflow-2022"},
        {"title": "Otomatik Donatı (PythonPart)", "description": "Otomatik donatılandırma ve PythonPart araçları kullanımı.", "url": "/solutions-v2/training/video-library/otomatik-donati"},
        {"title": "ALLPLAN QuickStart: Buildings", "description": "Allplan ile bina modellemeye hızlı başlangıç rehberi (9 Ders).", "url": "/solutions-v2/training/video-library/quickstart-buildings"},
        {"title": "ALLPLAN for Reinforcement", "description": "Betonarme detaylandırma, donatı modelleme ve raporlama eğitimleri (18 Video).", "url": "/solutions-v2/training/video-library/allplan-reinforcement"},
        {"title": "Allplan Campus Tutorials 2019-2022", "description": "Öğrenciler için kapsamlı Almanca eğitim serisi (2019-2022).", "url": "/solutions-v2/training/video-library/campus-tutorials-2019-2022"},
        {"title": "ALLPLAN Pythonparts Youtube Kanalı", "description": "PythonParts ile parametrik obje geliştirme ve script örnekleri.", "url": "#"},
    ],
}
with open(data_dir / "video-library.json", "w", encoding="utf-8") as f:
    json.dump(rename_routes(video_library_data), f, ensure_ascii=False, indent=2)

# Build search-index.json
search_entries = [
    {
        "path": p["path"],
        "title": p["h1"],
        "seoTitle": p["title"],
        "section": p["section"],
        "description": p["description"],
        "keywords": " ".join(h["text"] for h in p["headings"][:8]),
    }
    for p in pages_data.values()
]
with open(data_dir / "search-index.json", "w", encoding="utf-8") as f:
    json.dump(search_entries, f, ensure_ascii=False, indent=2)


# Original binary documents only; never manufacture PDFs or DOCX placeholders.
# CI and fresh clones verify the committed copies without requiring the read-only source checkout.
if SOURCE_AVAILABLE:
    write_manifest(ROOT, sync_documents(ROOT, SOURCE_ROOT))

print(f"Generated {len(pages_data)} routes in src/data/pages.json")
print(f"Generated {len(playlist_by_id)} playlists in src/data/playlists.json")
print(f"Unique titles: {len({page['title'] for page in pages_data.values()})} / {len(pages_data)}")
print(f"Unique descriptions: {len({page['description'] for page in pages_data.values()})} / {len(pages_data)}")
