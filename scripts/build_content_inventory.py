#!/usr/bin/env python3
"""Build the 2027 content inventory census.

Reads the repository tree (read-only) and writes deterministic inventory
artefacts under ``docs/content-2027/00-census/``:

* ``root-folder-census.md``  - per top-level folder file/type/size summary
* ``file-index.csv``         - one row per tracked file with sha256 and role
* ``duplicates.md``          - exact duplicates and language-variant groups
* ``authority-map.md``       - which source wins when two files disagree

No file outside ``docs/content-2027/`` is written. No third-party dependency
is required: docx/pptx/xlsx inspection uses the standard library only.

Usage:
    python3 scripts/build_content_inventory.py
"""

from __future__ import annotations

import csv
import hashlib
import os
import re
import sys
from collections import Counter, defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT_DIR = ROOT / "docs" / "content-2027" / "00-census"

MARKETING_DIR = "Allplan 2027 Marketing Materials"

# Folders that never belong to the content inventory.
SKIP_DIR_NAMES = {
    ".git",
    "node_modules",
    ".next",
    ".tmp",
    "__pycache__",
    ".venv",
    "venv",
}

SKIP_FILE_NAMES = {
    ".DS_Store",
    ".BridgeSort",
    "tsconfig.tsbuildinfo",
}

# Top-level folders are scanned; anything else at root is treated as a root file.
TOP_FOLDERS = [
    MARKETING_DIR,
    "docs",
    "design-system",
    "Aluplan Design System",
    "architectural-sheet-concept",
    "src",
    "public",
    "scripts",
    "tests",
    ".github",
    ".superpowers",
]

EXT_KIND = {
    ".md": "documentation",
    ".docx": "content-document",
    ".pptx": "presentation",
    ".xlsx": "spreadsheet",
    ".pdf": "pdf",
    ".url": "external-link",
    ".json": "data",
    ".csv": "data",
    ".ts": "code",
    ".tsx": "code",
    ".js": "code",
    ".jsx": "code",
    ".mjs": "code",
    ".cjs": "code",
    ".py": "code",
    ".css": "design-source",
    ".scss": "design-source",
    ".html": "markup",
    ".png": "image",
    ".jpg": "image",
    ".jpeg": "image",
    ".webp": "image",
    ".avif": "image",
    ".ico": "image",
    ".svg": "image",
    ".psd": "image-source",
    ".gif": "animation",
    ".mp4": "video",
    ".mov": "video",
    ".webm": "video",
    ".woff": "font",
    ".woff2": "font",
    ".ttf": "font",
    ".otf": "font",
    ".zip": "archive",
    ".txt": "text",
    ".yml": "config",
    ".yaml": "config",
    ".mjs": "code",
    ".mts": "code",
    ".lock": "config",
}

PRODUCT_PREFIXES = [
    ("ALLPLAN Civil 2027", "allplan-civil"),
    ("ALLPLAN Max 2027", "allplan-max"),
    ("ALLPLAN 2027", "allplan"),
    ("FRILO 2027", "frilo"),
    ("SCIA 2027", "scia"),
    ("SDS2 2027", "sds2"),
]

LOCALE_WORDS = {
    "german": "de",
    "deutsch": "de",
    "french": "fr",
    "italian": "it",
    "spanish": "es",
    "czech": "cs",
    "dutch": "nl",
    "slovak": "sk",
    "english": "en",
}

LOCALE_CODE_MAP = {
    "DE": "de",
    "FR": "fr",
    "IT": "it",
    "ES": "es",
    "CZ": "cs",
    "CS": "cs",
    "NL": "nl",
    "SK": "sk",
    "EN": "en",
}

CONTENT_KINDS = {"content-document", "presentation", "spreadsheet", "pdf"}

# Markers stripped when grouping language variants of the same document.
VARIANT_NOISE = [
    r"\(1\)",
    r"\(2\)",
    r"\bCopy1?\b",
    r"\bRAW\b",
    r"RAW-NEM02-NqKvhItcH",
    r"\bFINAL\b",
    r"\bNOT FINAL\b",
    r"\bVALIDATED\b",
    r"\bValidated\b",
    r"_validiert",
    r"\bbearbeitet\b",
    r"\bTeil\s*1\b",
    r"\bDeep Dive\b",
    r"\bINTERNAL\b",
    r"\bWIP\b",
    r"\bnew\b",
    r"\bnew29thsep\._1080p\b",
]

ROLE_BY_SEGMENT = {
    "Web Pages": "web-page-copy",
    "Messaging": "messaging-brief",
    "Sales Enablement Assets": "sales-enablement",
    "Screenshots": "screenshot",
    "Videos": "video",
    "Additional Images": "social-image",
    "Allplan Max Launch Packet": "launch-packet",
}


def sha256_of(path: Path, chunk: int = 1 << 20) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        while True:
            block = handle.read(chunk)
            if not block:
                break
            digest.update(block)
    return digest.hexdigest()


def product_of(rel: Path) -> str:
    parts = rel.parts
    if parts and parts[0] == MARKETING_DIR and len(parts) > 1:
        for prefix, slug in PRODUCT_PREFIXES:
            if parts[1].startswith(prefix):
                return slug
        return "unknown"
    return "aluplan-site"


def locale_of(rel: Path, kind: str) -> str:
    """Detect the language marker in a filename.

    Word-based markers win (``- Czech.docx``), then bracketed codes
    (``(DE)``), then underscore/dash codes (``_DE``, ``– FR``). The order
    matters: a naive substring match turns ``FRILO`` into French.
    """
    name = rel.name
    lowered = name.lower()

    for word, code in LOCALE_WORDS.items():
        if re.search(rf"\b{word}\b", lowered):
            return code

    bracketed = re.search(r"[\(\[]\s*(DE|FR|IT|ES|CZ|CS|NL|SK)\s*[\)\]]", name)
    if bracketed:
        return LOCALE_CODE_MAP[bracketed.group(1)]

    suffixed = re.search(
        r"(?:^|[_\-\s–])(DE|FR|IT|ES|CZ|CS|NL|SK)(?=$|[_\-\s.–])", name
    )
    if suffixed:
        return LOCALE_CODE_MAP[suffixed.group(1)]

    if "_validiert" in lowered or "bearbeitet" in lowered:
        return "de"

    # Unmarked marketing documents are the English source text.
    if kind in CONTENT_KINDS and rel.parts and rel.parts[0] == MARKETING_DIR:
        return "en"
    return "und"


def role_of(rel: Path) -> str:
    for part in rel.parts:
        if part in ROLE_BY_SEGMENT:
            return ROLE_BY_SEGMENT[part]
    if rel.parts and rel.parts[0] == MARKETING_DIR:
        return "marketing-other"
    return "site-source"


def authority_of(rel: Path) -> str:
    text = str(rel)
    name = rel.name
    if name.endswith(".url"):
        return "external-link-missing"
    if "RAW files" in text:
        return "archive-raw"
    if "Templates" in text:
        return "template"
    if "NOT FINAL" in text or "WORK IN PROGRESS" in text:
        return "draft-not-final"
    if "INTERNAL" in text:
        return "internal-only"
    if "Competitive" in text or "Competition" in text:
        return "internal-only"
    if "Proof Points" in text or "Usable Quotes" in text:
        return "pii-restricted"
    if re.search(r"\b(Copy|Kopie)\d?\b", name, re.IGNORECASE) or re.search(r"\(\d\)", name):
        return "duplicate-candidate"
    if rel.parts and rel.parts[0] == "Aluplan Design System":
        return "superseded-copy"
    if rel.parts and rel.parts[0] == "architectural-sheet-concept":
        return "concept-prototype"
    if rel.parts and rel.parts[0] == "docs":
        return "process-record"
    return "source-authoritative"


def variant_key(rel: Path) -> str:
    key = rel.stem
    for pattern in VARIANT_NOISE:
        key = re.sub(pattern, " ", key, flags=re.IGNORECASE)
    for word in LOCALE_WORDS:
        key = re.sub(rf"\b{word}\b", " ", key, flags=re.IGNORECASE)
    key = re.sub(r"[\(\[]\s*(DE|FR|IT|ES|CZ|CS|NL|SK)\s*[\)\]]", " ", key, flags=re.IGNORECASE)
    key = re.sub(
        r"(?:^|[_\-\s–])(DE|FR|IT|ES|CZ|CS|NL|SK)(?=$|[_\-\s.–])", " ", key, flags=re.IGNORECASE
    )
    key = re.sub(r"[\s_\-–]+", " ", key).strip().lower()
    return key


def iter_files() -> list[Path]:
    files: list[Path] = []
    for top in TOP_FOLDERS:
        base = ROOT / top
        if not base.exists():
            continue
        for dirpath, dirnames, filenames in os.walk(base):
            dirnames[:] = sorted(d for d in dirnames if d not in SKIP_DIR_NAMES)
            for filename in sorted(filenames):
                if filename in SKIP_FILE_NAMES:
                    continue
                files.append(Path(dirpath, filename).relative_to(ROOT))
    for entry in sorted(ROOT.iterdir()):
        if entry.is_file() and entry.name not in SKIP_FILE_NAMES:
            files.append(Path(entry.name))
    return sorted(set(files), key=lambda p: str(p))


def human_bytes(value: int) -> str:
    size = float(value)
    for unit in ("B", "KB", "MB", "GB"):
        if size < 1024 or unit == "GB":
            return f"{size:.1f} {unit}" if unit != "B" else f"{int(size)} B"
        size /= 1024
    return f"{size:.1f} GB"


def build_rows(files: list[Path]) -> list[dict]:
    rows: list[dict] = []
    for rel in files:
        absolute = ROOT / rel
        try:
            size = absolute.stat().st_size
        except OSError:
            continue
        digest = sha256_of(absolute) if size < 600 * 1024 * 1024 else "skipped-large"
        ext = rel.suffix.lower()
        rows.append(
            {
                "path": str(rel),
                "top_folder": rel.parts[0] if len(rel.parts) > 1 else "(root file)",
                "extension": ext.lstrip("."),
                "kind": EXT_KIND.get(ext, "other"),
                "bytes": size,
                "sha256": digest,
                "product": product_of(rel),
                "locale": locale_of(rel, EXT_KIND.get(ext, "other")),
                "role": role_of(rel),
                "authority": authority_of(rel),
            }
        )
    return rows


def write_csv(rows: list[dict]) -> None:
    fields = [
        "path",
        "top_folder",
        "extension",
        "kind",
        "bytes",
        "sha256",
        "product",
        "locale",
        "role",
        "authority",
    ]
    target = OUT_DIR / "file-index.csv"
    with target.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=fields, lineterminator="\n")
        writer.writeheader()
        for row in rows:
            writer.writerow(row)


def write_census(rows: list[dict]) -> None:
    by_folder: dict[str, list[dict]] = defaultdict(list)
    for row in rows:
        by_folder[row["top_folder"]].append(row)

    role_notes = {
        MARKETING_DIR: "2027 lansman paketi — yeni web içeriğinin birincil kaynağı",
        "docs": "Mevcut site metinleri, PRD/IA, tasarım ve doğrulama kayıtları",
        "design-system": "Onaylı tasarım sistemi (token, bileşen, test)",
        "Aluplan Design System": "ZIP'ten açılmış ikinci kopya — otorite değil",
        "architectural-sheet-concept": "Ayrı konsept prototip (referans)",
        "src": "Uygulama kaynağı ve üretilmiş site verisi",
        "public": "Yayımlanan medya ve dokümanlar",
        "scripts": "Veri üretim ve doğrulama hattı",
        "tests": "Parite ve sözleşme testleri",
        ".github": "CI yapılandırması",
        ".superpowers": "Ajan oturum kayıtları",
        "(root file)": "Kök seviye yapılandırma ve devir dosyaları",
    }

    lines = [
        "# Kök klasör envanteri",
        "",
        "Bu dosya `scripts/build_content_inventory.py` tarafından üretilir.",
        "Elle düzenlenmez; kaynak ağacı değiştiğinde betik yeniden çalıştırılır.",
        "",
        f"Toplam taranan dosya: **{len(rows)}**",
        f"Toplam boyut: **{human_bytes(sum(r['bytes'] for r in rows))}**",
        "",
        "## Klasör özeti",
        "",
        "| Klasör | Dosya | Boyut | İçerik belgesi | Görsel | Video | Kod | Rol |",
        "|---|---|---|---|---|---|---|---|",
    ]

    for folder in sorted(by_folder):
        items = by_folder[folder]
        size = sum(i["bytes"] for i in items)
        docs = sum(1 for i in items if i["kind"] in {"content-document", "presentation", "spreadsheet", "pdf"})
        images = sum(1 for i in items if i["kind"] in {"image", "image-source"})
        videos = sum(1 for i in items if i["kind"] in {"video", "animation"})
        code = sum(1 for i in items if i["kind"] in {"code", "design-source", "markup"})
        lines.append(
            f"| `{folder}` | {len(items)} | {human_bytes(size)} | {docs} | {images} | {videos} | {code} | "
            f"{role_notes.get(folder, '—')} |"
        )

    lines += [
        "",
        "## Dosya türü dağılımı",
        "",
        "| Uzantı | Adet | Boyut | Tür |",
        "|---|---|---|---|",
    ]
    by_ext: dict[str, list[dict]] = defaultdict(list)
    for row in rows:
        by_ext[row["extension"]].append(row)
    for ext in sorted(by_ext, key=lambda e: (-len(by_ext[e]), e)):
        items = by_ext[ext]
        label = f".{ext}" if ext else "(uzantısız)"
        lines.append(
            f"| `{label}` | {len(items)} | {human_bytes(sum(i['bytes'] for i in items))} | "
            f"{items[0]['kind']} |"
        )

    marketing = by_folder.get(MARKETING_DIR, [])
    if marketing:
        lines += [
            "",
            "## Pazarlama paketi — ürün kırılımı",
            "",
            "| Ürün | Dosya | Boyut | docx | pptx | xlsx | pdf | görsel | video/gif |",
            "|---|---|---|---|---|---|---|---|---|",
        ]
        by_product: dict[str, list[dict]] = defaultdict(list)
        for row in marketing:
            by_product[row["product"]].append(row)
        for product in sorted(by_product):
            items = by_product[product]
            lines.append(
                "| {p} | {n} | {size} | {docx} | {pptx} | {xlsx} | {pdf} | {img} | {vid} |".format(
                    p=product,
                    n=len(items),
                    size=human_bytes(sum(i["bytes"] for i in items)),
                    docx=sum(1 for i in items if i["extension"] == "docx"),
                    pptx=sum(1 for i in items if i["extension"] == "pptx"),
                    xlsx=sum(1 for i in items if i["extension"] == "xlsx"),
                    pdf=sum(1 for i in items if i["extension"] == "pdf"),
                    img=sum(1 for i in items if i["kind"] in {"image", "image-source"}),
                    vid=sum(1 for i in items if i["kind"] in {"video", "animation"}),
                )
            )

    lines += [
        "",
        "## Dil dağılımı",
        "",
        "| Dil | Dosya |",
        "|---|---|",
    ]
    by_locale = Counter(row["locale"] for row in rows)
    for locale, count in sorted(by_locale.items(), key=lambda kv: (-kv[1], kv[0])):
        lines.append(f"| `{locale}` | {count} |")

    lines += [
        "",
        "`und` = dosya adında dil işareti yok: görsel, video, kod ve Türkçe süreç",
        "belgeleri. Pazarlama paketinde işaretsiz **içerik belgeleri** İngilizce",
        "kaynak metin sayılır ve `en` olarak işaretlenir.",
    ]

    lines += [
        "",
        "## Otorite dağılımı",
        "",
        "| Durum | Dosya |",
        "|---|---|",
    ]
    by_authority = Counter(row["authority"] for row in rows)
    for authority, count in sorted(by_authority.items(), key=lambda kv: (-kv[1], kv[0])):
        lines.append(f"| `{authority}` | {count} |")

    lines.append("")
    (OUT_DIR / "root-folder-census.md").write_text("\n".join(lines), encoding="utf-8")


def write_duplicates(rows: list[dict]) -> None:
    lines = [
        "# Mükerrer ve varyant analizi",
        "",
        "Bu dosya `scripts/build_content_inventory.py` tarafından üretilir.",
        "",
    ]

    by_hash: dict[str, list[dict]] = defaultdict(list)
    for row in rows:
        if row["sha256"] not in {"skipped-large", ""} and row["bytes"] > 0:
            by_hash[row["sha256"]].append(row)
    exact = {h: items for h, items in by_hash.items() if len(items) > 1}

    # Design/process markdown copies are covered by the authority decision
    # (`Aluplan Design System/` vs `design-system/`), so they stay in the asset
    # cluster table instead of the content-document table.
    content_kinds = {"content-document", "presentation", "spreadsheet", "pdf"}
    content_dupes = {
        digest: items
        for digest, items in exact.items()
        if any(item["kind"] in content_kinds for item in items)
    }
    asset_dupes = {
        digest: items for digest, items in exact.items() if digest not in content_dupes
    }

    lines += [
        "## 1. Birebir aynı içerik belgeleri (SHA-256)",
        "",
        f"Toplam {len(content_dupes)} hash grubu, "
        f"{sum(len(v) for v in content_dupes.values())} dosya.",
        "Bunlar aynı belgenin kopyalarıdır; biri kaynak, diğerleri tekrar sayılır.",
        "",
    ]
    if content_dupes:
        lines += ["| # | Dosya sayısı | Boyut | Yollar |", "|---|---|---|---|"]
        for index, (_digest, items) in enumerate(
            sorted(content_dupes.items(), key=lambda kv: (-len(kv[1]), kv[1][0]["path"])), start=1
        ):
            shown = "<br>".join(f"`{i['path']}`" for i in items)
            lines.append(f"| {index} | {len(items)} | {human_bytes(items[0]['bytes'])} | {shown} |")

        # Identical bytes but different language labels means the localisation was
        # never done: the file was renamed, not translated.
        fake_locales = [
            items for items in content_dupes.values() if len({i["locale"] for i in items}) > 1
        ]
        lines += [
            "",
            "### Çevrilmemiş dil varyantları",
            "",
            "Aynı bayt içeriği taşıdığı hâlde dosya adında farklı dil etiketi olan",
            "belgeler. Bunlar **çevrilmemiştir**; yalnızca adı değiştirilmiştir.",
            "Site metni üretilirken bu dillerde kaynak yok sayılmalıdır.",
            "",
        ]
        if fake_locales:
            lines += ["| Dosya sayısı | Diller | Dosyalar |", "|---|---|---|"]
            for items in sorted(fake_locales, key=lambda v: v[0]["path"]):
                locales = ", ".join(sorted({i["locale"] for i in items}))
                names = "<br>".join(f"`{Path(i['path']).name}`" for i in items)
                lines.append(f"| {len(items)} | {locales} | {names} |")
        else:
            lines.append("Çevrilmemiş varyant bulunmadı.")
    else:
        lines.append("Birebir aynı içerik belgesi bulunmadı.")

    # Asset duplicates are dominated by design-system/font/icon copies. Instead of
    # listing every path, group them by the folders they span.
    clusters: dict[tuple[str, ...], dict] = {}
    for _digest, items in asset_dupes.items():
        folders = tuple(sorted({i["top_folder"] for i in items}))
        entry = clusters.setdefault(folders, {"groups": 0, "files": 0, "bytes": 0})
        entry["groups"] += 1
        entry["files"] += len(items)
        entry["bytes"] += items[0]["bytes"] * (len(items) - 1)

    lines += [
        "",
        "## 2. Varlık mükerrerleri — klasör kümeleri",
        "",
        f"Toplam {len(asset_dupes)} hash grubu, "
        f"{sum(len(v) for v in asset_dupes.values())} dosya.",
        "`Fazla` kolonu, tekrar eden kopyaların kapladığı gereksiz alandır.",
        "",
        "| Klasörler | Grup | Dosya | Fazla |",
        "|---|---|---|---|",
    ]
    for folders, entry in sorted(
        clusters.items(), key=lambda kv: (-kv[1]["bytes"], kv[0])
    ):
        lines.append(
            f"| {' ↔ '.join(f'`{f}`' for f in folders)} | {entry['groups']} | "
            f"{entry['files']} | {human_bytes(entry['bytes'])} |"
        )

    # Language variants of the same source document.
    groups: dict[tuple[str, str], list[dict]] = defaultdict(list)
    for row in rows:
        if row["kind"] not in {"content-document", "presentation", "spreadsheet", "pdf"}:
            continue
        rel = Path(row["path"])
        groups[(row["product"], variant_key(rel))].append(row)

    variant_groups = {
        key: items for key, items in groups.items() if len(items) > 1
    }

    lines += [
        "",
        "## 3. Dil / sürüm varyantı grupları",
        "",
        "Aynı kaynak belgenin dil veya sürüm kopyaları. Gruplama dosya adındaki",
        "dil ve sürüm işaretleri temizlenerek yapılır; içerik doğrulaması Aşama B'de.",
        "",
        f"Toplam {len(variant_groups)} grup, {sum(len(v) for v in variant_groups.values())} dosya.",
        "",
        "| # | Ürün | Ortak ad | Kopya | Diller |",
        "|---|---|---|---|---|",
    ]
    for index, ((product, key), items) in enumerate(
        sorted(variant_groups.items(), key=lambda kv: (-len(kv[1]), kv[0][1])), start=1
    ):
        locales = sorted({i["locale"] for i in items})
        lines.append(
            f"| {index} | {product} | `{key}` | {len(items)} | {', '.join(locales)} |"
        )

    singles = [
        (key, items)
        for key, items in groups.items()
        if len(items) == 1 and items[0]["kind"] in {"content-document", "spreadsheet"}
    ]
    lines += [
        "",
        "## 4. Tek kopya içerik belgeleri",
        "",
        "Varyantı olmayan docx/xlsx dosyaları — bunlar tekil içerik taşıyor olabilir,",
        "Aşama B'de tam metin çıkarımına alınır.",
        "",
        "| Ürün | Dosya | Rol |",
        "|---|---|---|",
    ]
    for (_product, key), items in sorted(singles, key=lambda kv: kv[1][0]["path"]):
        item = items[0]
        lines.append(f"| {item['product']} | `{item['path']}` | {item['role']} |")

    lines.append("")
    (OUT_DIR / "duplicates.md").write_text("\n".join(lines), encoding="utf-8")


def write_authority_map(rows: list[dict]) -> None:
    by_authority: dict[str, list[dict]] = defaultdict(list)
    for row in rows:
        by_authority[row["authority"]].append(row)

    rules = [
        ("`source-authoritative`", "Yayımlanabilir kaynak. Metin birebir alınır."),
        ("`external-link-missing`", "SharePoint kısayolu; dosya depoda yok. İndirilmeden kullanılamaz."),
        ("`draft-not-final`", "Taslak. Sitede kullanılmaz; yalnızca yön bilgisi."),
        ("`internal-only`", "İç kullanım (rekabet, iç eğitim). Sitede yayımlanmaz."),
        ("`pii-restricted`", "Kişisel veri içerir. Envantere yalnızca anonim özet alınır."),
        ("`template`", "Boş şablon. İçerik kaynağı değil."),
        ("`archive-raw`", "Ham çalışma dosyası. Düzenlenmiş sürüm esas alınır."),
        ("`duplicate-candidate`", "Ad `Copy`/`(1)` içeriyor. Otorite değil."),
        ("`superseded-copy`", "`Aluplan Design System/` kopyası. `design-system/` otorite."),
        ("`concept-prototype`", "Konsept prototip. Üretim içeriği değil."),
        ("`process-record`", "Süreç/karar kaydı. Site içeriği değil, referans."),
    ]

    lines = [
        "# Otorite haritası",
        "",
        "> Karma dosya: sınıflandırma kuralları, sayımlar ve eksik kaynak listesi",
        "> `scripts/build_content_inventory.py` tarafından üretilir; çakışma",
        "> kararları ve açık sorular elle yazılır. Kararlar değiştiğinde betikteki",
        "> ilgili bölüm güncellenir.",
        "",
        "İki dosya aynı konuyu anlattığında hangisinin esas alınacağını tanımlar.",
        "Kural: **canlı site ve üreticinin son sürümü esastır**; taslak, kopya ve",
        "iç kullanım belgeleri içerik kaynağı sayılmaz.",
        "",
        "## 1. Sınıflandırma kuralları",
        "",
        "| Sınıf | Anlamı | Dosya |",
        "|---|---|---|",
    ]
    for name, description in rules:
        key = name.strip("`")
        count = len(by_authority.get(key, []))
        lines.append(f"| {name} | {description} | {count} |")

    lines += [
        "",
        "## 2. Çakışma kararları",
        "",
        "### `design-system/` ile `Aluplan Design System/`",
        "",
        "`Aluplan Design System/` klasörü `Aluplan Design System-reviewed-v3-refreshed.zip`",
        "dosyasının açılmış hâlidir. İçerik olarak `design-system/` ile büyük ölçüde aynıdır",
        "ancak iki klasör arasında farklar vardır.",
        "",
        "**Karar:** `design-system/` otoritedir (token testleri, `pnpm tokens:check` ve",
        "parite kapıları bu klasöre bakar). `Aluplan Design System/` yalnızca kaynak",
        "paketin referans kopyasıdır; düzenlenmez.",
        "",
        "### `RAW files/`, `Templates/`, `Copy1`",
        "",
        "SCIA klasöründeki `RAW files/` ve `Templates/` ham/şablon çalışma dosyalarıdır.",
        "Düzenlenmiş, dili belirtilmiş sürümler esas alınır. `Copy1` ekli dosyalar",
        "mükerrer adayıdır; `Web Pages` altındaki üç `Launch 2027 - Intro text edition",
        "pages shop EN.xlsx` dosyası **birebir aynıdır** ve tek kaynak sayılır.",
        "",
        "### İngilizce messaging brief'ler",
        "",
        "Altı ürünün İngilizce `Messaging Brief` ve `Product Launch Messaging`",
        "belgeleri depoda **yoktur**; yalnızca SharePoint `.url` kısayolu vardır.",
        "Yerelde DE/FR/IT/ES/CZ sürümleri bulunur. İngilizce metin gerekiyorsa",
        "kaynak indirilmelidir; bu envanter bunları `external-link-missing` olarak",
        "kaydeder ve DE sürümünden çıkarım yapıldığını ayrıca işaretler.",
        "",
        "### Çevrilmemiş dil varyantları",
        "",
        "Bazı dosyalar farklı dil etiketiyle kaydedilmiş ama içeriği birebir aynıdır:",
        "FRILO (cs/es/fr/it), SDS2 (de/es/fr) ve SCIA (de/it) messaging brief'leri.",
        "Bunlar çeviri değil, yeniden adlandırmadır. Ayrıntı: `duplicates.md` →",
        "“Çevrilmemiş dil varyantları”. Site metni üretilirken bu diller için kaynak",
        "yok kabul edilir.",
        "",
        "### İç kullanım belgeleri",
        "",
        "`Competitive Landscape` (SDS2, ALLPLAN Civil), `INTERNAL` etiketli sunumlar ve",
        "`NOT FINAL` taslaklar sitede yayımlanmaz. Rekabet karşılaştırması Aluplan'ın",
        "kendi konumlandırmasıdır, üreticinin kamuya açık iddiası değildir.",
        "",
        "### Kişisel veri",
        "",
        "`Proof Points and Usable Quotes.xlsx` beta anketi yanıtlarını ad, e-posta ve",
        "firma bilgisiyle içerir; bazı satırlarda `Consent: None` yazar. Bu dosyadan",
        "envantere **yalnızca anonim yüzdeler** alınır. Alıntı metinleri, izin durumu",
        "`full` olanlar dışında kullanılmaz.",
        "",
        "## 3. Eksik kaynak listesi",
        "",
        "| Dosya | Ürün | Durum |",
        "|---|---|---|",
    ]

    for row in by_authority.get("external-link-missing", []):
        lines.append(f"| `{row['path']}` | {row['product']} | SharePoint kısayolu — yerel dosya yok |")

    lines += [
        "",
        "## 4. Karar bekleyen otorite soruları",
        "",
        "1. İngilizce messaging brief'ler indirilecek mi, DE sürümüyle mi ilerlenecek?",
        "2. `ALLPLAN Edition Table - ALL FEATURES.xlsx` tam özellik matrisi olmadan",
        "   edition karşılaştırma sayfası üretilebilir mi?",
        "3. `Aluplan Design System/` klasörü arşive taşınacak mı, yoksa yerinde mi kalacak?",
        "",
    ]
    (OUT_DIR / "authority-map.md").write_text("\n".join(lines), encoding="utf-8")


def write_external_sources(rows: list[dict]) -> None:
    """List every `.url` shortcut with its decoded target and download hint."""
    from urllib.parse import unquote, urlparse

    links = [row for row in rows if row["authority"] == "external-link-missing"]

    parsed = []
    for row in links:
        path = ROOT / row["path"]
        url = ""
        for encoding in ("utf-16", "utf-8", "latin-1"):
            try:
                text = path.read_text(encoding=encoding)
            except (UnicodeDecodeError, UnicodeError):
                continue
            match = re.search(r"^URL=(.+)$", text, re.MULTILINE)
            if match:
                url = match.group(1).strip()
                break
        target = urlparse(url).path
        filename = unquote(target.rsplit("/", 1)[-1]) if target else ""
        parsed.append(
            {
                "product": row["product"],
                "path": row["path"],
                "url": url,
                "filename": filename,
                "download": f"{url}&download=1" if "?" in url else f"{url}?download=1",
            }
        )

    parsed.sort(key=lambda item: (item["product"], item["filename"]))

    lines = [
        "# İndirilmesi gereken dış kaynaklar",
        "",
        "Bu dosya `scripts/build_content_inventory.py` tarafından üretilir.",
        "",
        f"Depoda olmayan, yalnızca SharePoint kısayolu olarak bulunan **{len(parsed)}** belge.",
        "Bu dosyalar indirilmeden İngilizce kaynak metin ve tam edition özellik matrisi",
        "envantere alınamaz.",
        "",
        "> Erişim: `onenemetschek.sharepoint.com` — Nemetschek grup hesabı gerekir.",
        "> `İndirme` kolonu SharePoint'in `download=1` parametresiyle doğrudan indirme",
        "> bağlantısıdır; tarayıcı oturumu yoksa yine oturum açmanız istenir.",
        "",
        "## Liste",
        "",
        "| # | Ürün | Belge | Tür | Kısayol | İndirme |",
        "|---|---|---|---|---|---|",
    ]
    for index, item in enumerate(parsed, start=1):
        extension = item["filename"].rsplit(".", 1)[-1].upper() if "." in item["filename"] else "—"
        lines.append(
            f"| {index} | {item['product']} | `{item['filename']}` | {extension} | "
            f"[kısayol]({item['url']}) | [indir]({item['download']}) |"
        )

    lines += [
        "",
        "## Tam bağlantılar",
        "",
        "Kopyala-yapıştır için düz metin:",
        "",
        "```text",
    ]
    for item in parsed:
        lines.append(item["url"])
    lines += ["```", ""]

    (OUT_DIR / "external-sources.md").write_text("\n".join(lines), encoding="utf-8")


def main() -> int:
    if not (ROOT / "package.json").exists():
        print("HATA: proje kökü bulunamadı.", file=sys.stderr)
        return 1
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    files = iter_files()
    print(f"Taranan dosya: {len(files)}")
    rows = build_rows(files)
    print(f"Kaydedilen satır: {len(rows)}")

    write_csv(rows)
    write_census(rows)
    write_duplicates(rows)
    write_authority_map(rows)
    write_external_sources(rows)

    total = sum(r["bytes"] for r in rows)
    print(f"Toplam boyut: {human_bytes(total)}")
    print(f"Çıktı: {OUT_DIR.relative_to(ROOT)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
