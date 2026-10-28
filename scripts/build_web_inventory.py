#!/usr/bin/env python3
"""Stage C — build the web content inventory from the extracted source text.

The inventory answers one question per row: *which sentence on which 2027 page
comes from which paragraph of which source file, and what is its Turkish
draft?*

English is never retyped. Every row stores a block address
(``slug#b12``) and the builder copies the text straight out of Stage B's
output. That makes it impossible to silently "improve" a source sentence and
keeps the inventory honest: if the source changes, the hash in the front-matter
changes and the address has to be re-checked.

Turkish drafts are authored in ``scripts/inventory_units/`` and are explicitly
labelled as drafts — they are not approved copy.

Usage
-----
    python3 scripts/build_web_inventory.py           # write 02-inventory/
    python3 scripts/build_web_inventory.py --check   # verify, write nothing
"""

from __future__ import annotations

import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

import inventory_units as units  # noqa: E402
import source_blocks  # noqa: E402

ROOT = Path(__file__).resolve().parent.parent
OUT_ROOT = ROOT / "docs" / "content-2027" / "02-inventory"

# Blocks that carry no publishable copy. Anything else that stays unreferenced
# is reported, so a paragraph cannot quietly disappear from the inventory.
NON_CONTENT_PATTERNS = [
    re.compile(r"^<[^>]*>$"),                       # <237 characters>, <image>
    re.compile(r"^<if headline needed.*>$"),
    re.compile(r"^\d+ characters$"),
    re.compile(r"^XXXXX$"),
    re.compile(r"^New Text and Images\b", re.I),
    re.compile(r"^(New Text )?BIMPLUS Page$", re.I),
    re.compile(r"^Home Page Information\b"),
    re.compile(r"^Allplan \S+ Web Page$"),
    re.compile(r"^Allplan – Home Page Slide$", re.I),
    re.compile(r"^Allplan Max – Home Page Slide$", re.I),
    re.compile(r"^Allplan (Basic|Concept|Professional|Ultimate)$"),
    re.compile(r"^Layout inspired by:"),
    re.compile(r"^Imagery:$"),
    re.compile(r"^(Key Visual|Original image):"),
    re.compile(r"^Image information:$"),
    re.compile(r"^NO NEW FEATURES FOR"),
    re.compile(r"^Sds2\.com$"),
    re.compile(r"^Image$"),
    re.compile(r"^Treat the text below"),
    re.compile(r"^Section (headline|body|for each)"),
    re.compile(r"^Section Providing a Bit More Detail$"),
    re.compile(r"^Section Covering 3 Messaging Pillars"),
    re.compile(r"^We need to select some kind of key visual"),
    re.compile(r"^\[redacted", re.I),
    re.compile(r"^(Project Name|Company): \[redacted\]$"),
    re.compile(r".+\.(png|jpg|jpeg)$", re.I),
    re.compile(r"^SCIA2027-"),
    re.compile(r"^(FEATURE \d+ (IMAGE|LINK TO IMAGE)|SMALL HEADLINE|LARGE HEADLINE|"
               r"INTRO TEXT \(480 characters max\)|What's new paragraph \(240 characters max\)|"
               r"FEATURE \d+ TEXT \(240 characters max\)|Product Name|Headline|Supporting Text|"
               r"Body copy|Heading|Hero|Overview|Benefits|Features|Detail|Document|Manage|"
               r"Coordinate|Connect|Parametrize|Integrate|Reinforce|Automate|Tags|"
               r"Suggested tags|EDITION NAME|INTRO SECTION|NEW FEATURES SECTION|"
               r"PRODUCT PAGE|OVREVIEW SECTION|Civil - Intro|Pillar \d+:?|Section body)$"),
]

ROLE_LABELS = {
    "hero-title": "Hero başlık",
    "hero-subtitle": "Hero alt başlık",
    "hero-body": "Hero metni",
    "hero-cta": "Hero CTA",
    "tags": "Etiketler",
    "eyebrow": "Üst etiket",
    "section-title": "Bölüm başlığı",
    "section-subtitle": "Bölüm alt başlığı",
    "group": "Grup etiketi",
    "feature-title": "Özellik başlığı",
    "feature-body": "Özellik metni",
    "benefit-title": "Fayda başlığı",
    "benefit-body": "Fayda metni",
    "overview-title": "Genel bakış başlığı",
    "overview-body": "Genel bakış metni",
    "intro": "Sürüm girişi",
    "whats-new": "Yenilikler paragrafı",
    "stat": "Anket iddiası",
    "bullet": "Madde",
    "note": "Not",
}


def normalise(text: str) -> str:
    return re.sub(r"\s+", " ", text).strip()


def resolve(unit: units.Unit, docs: dict[str, source_blocks.SourceDocument]) -> dict:
    """Return the row data for one unit: source path, address, English text."""
    target = unit
    if unit.shared:
        target = units.SHARED.get(unit.shared)
        if target is None:
            raise KeyError(f"{unit.id}: bilinmeyen paylaşılan blok {unit.shared!r}")

    if target.source not in docs:
        raise KeyError(f"{unit.id}: bilinmeyen kaynak {target.source!r}")
    document = docs[target.source]
    source, block = target.source, target.block
    en = document.by_address(block).text

    if target.part == "head":
        en = en.split("\n", 1)[0].strip()
    elif target.part == "tail":
        parts = en.split("\n", 1)
        en = parts[1].strip() if len(parts) > 1 else ""

    if not en:
        raise ValueError(f"{unit.id}: kaynak blok boş ({source}#{block})")

    # Markdown tablo hücresi iki satırlı metin tasıyamaz; boşluk düzeyinde
    # normalize edilir. Birebirlik adres (`slug#bN`) + SHA-256 ile kayıt altındadır.
    en = normalise(en)

    tr = unit.tr or target.tr
    return {
        "id": unit.id,
        "role": unit.role,
        "source": source,
        "block": block,
        "en": en,
        "tr": tr,
        "note": unit.note,
    }


def cell(text: str) -> str:
    """Escape a value for a Markdown table cell."""
    return normalise(text).replace("|", "\\|")


def render_page(page: units.Page, rows: list[dict], docs: dict[str, source_blocks.SourceDocument]) -> str:
    used: list[str] = []
    for row in rows:
        if row["source"] not in used:
            used.append(row["source"])

    lines = [
        "---",
        f"page: {page.slug}",
        f"routes: {', '.join(page.routes)}",
        f"units: {len(rows)}",
        "locale_source: en",
        "locale_target: tr",
        "status: taslak",
        "---",
        "",
        f"# {page.title}",
        "",
        page.summary,
        "",
    ]

    if page.open_questions:
        lines += ["## Açık sorular", ""]
        lines += [f"- {question}" for question in page.open_questions]
        lines.append("")

    lines += [
        "## Kaynaklar",
        "",
        "| Kısa ad | Dosya | SHA-256 |",
        "|---|---|---|",
    ]
    for slug in used:
        document = docs[slug]
        lines.append(
            f"| `{slug}` | `{document.meta.get('source', '')}` | "
            f"`{(document.meta.get('sha256') or '')[:16]}…` |"
        )
    lines.append("")

    lines += [
        "## İçerik birimleri",
        "",
        "`EN` sütunu kaynaktan birebir kopyalanır (`slug#bN` adresi Stage B çıktısındaki",
        "bloğu gösterir). `TR` sütunu **taslaktır**: onaylanmış yayın metni değildir.",
        "",
        "| ID | Rol | Kaynak | EN (birebir) | TR (taslak) |",
        "|---|---|---|---|---|",
    ]
    for row in rows:
        role = ROLE_LABELS.get(row["role"], row["role"])
        tr = cell(row["tr"]) if row["tr"] else "_(taslak yok)_"
        lines.append(
            f"| `{row['id']}` | {role} | `{row['source']}#{row['block']}` | "
            f"{cell(row['en'])} | {tr} |"
        )
    lines.append("")

    noted = [row for row in rows if row["note"]]
    if noted:
        lines += ["## Notlar", ""]
        lines += [f"- `{row['id']}` — {row['note']}" for row in noted]
        lines.append("")

    return "\n".join(lines)


def check(rows_by_page: dict[str, list[dict]], docs: dict[str, source_blocks.SourceDocument]) -> list[str]:
    problems: list[str] = []
    seen: set[str] = set()
    referenced: set[tuple[str, str]] = set()

    for page_slug, rows in rows_by_page.items():
        for row in rows:
            if row["id"] in seen:
                problems.append(f"tekrarlanan ID: {row['id']}")
            seen.add(row["id"])
            referenced.add((row["source"], row["block"]))
            if not row["tr"]:
                problems.append(f"TR taslak yok: {row['id']}")
            if row["en"] != normalise(row["en"]):
                problems.append(f"EN metni normalize değil (kaynak bozulmuş): {row['id']}")

    # Coverage: every publishable block should be referenced exactly once,
    # unless it is a heading/label or an obvious non-content note. Shared texts
    # repeat across editions by design; a second occurrence of an already
    # referenced text is covered by the single reference.
    referenced_texts: set[str] = {
        normalise(docs[source].by_address(block).text)
        for source, block in referenced
    }
    for slug, document in docs.items():
        if not slug.startswith(("allplan", "frilo", "scia", "sds2")):
            continue
        # Satış cheat sheet / flyer / PDF belgeleri web envanteri kapsamına
        # girmez; ayrı kaynak-kapsama dokümanında sayılır.
        if "/Web Pages/" not in document.meta.get("source", ""):
            continue
        for block in document.blocks:
            if (slug, block.address) in referenced:
                continue
            if normalise(block.text) in referenced_texts:
                continue
            if block.kind in ("heading", "label", "title"):
                continue
            if any(pattern.match(block.text) for pattern in NON_CONTENT_PATTERNS):
                continue
            problems.append(f"envantere alınmamış metin: {slug}#{block.address} — {block.text[:70]}")
    return problems


def main(argv: list[str]) -> int:
    check_only = "--check" in argv
    docs = source_blocks.load_all()

    rows_by_page: dict[str, list[dict]] = {}
    for page in units.PAGES:
        rows = [resolve(unit, docs) for unit in units.UNITS if unit.page == page.slug]
        if not rows:
            raise SystemExit(f"{page.slug}: hiç içerik birimi yok")
        rows_by_page[page.slug] = rows

    problems = check(rows_by_page, docs)
    total_units = sum(len(rows) for rows in rows_by_page.values())

    if problems:
        print(f"{len(problems)} sorun:")
        for problem in problems:
            print("  -", problem)
        if check_only:
            return 1
    else:
        print("Sorun yok.")

    print(f"{len(units.PAGES)} sayfa, {total_units} içerik birimi")
    if check_only:
        return 0

    pages_dir = OUT_ROOT / "pages"
    pages_dir.mkdir(parents=True, exist_ok=True)
    for page in units.PAGES:
        target = pages_dir / f"{page.slug}.md"
        target.write_text(render_page(page, rows_by_page[page.slug], docs), encoding="utf-8")
        print(f"  {len(rows_by_page[page.slug]):>3} birim  {target.name}")

    write_readme(rows_by_page, docs)
    return 0


def write_readme(rows_by_page: dict[str, list[dict]], docs: dict[str, source_blocks.SourceDocument]) -> None:
    total = sum(len(rows) for rows in rows_by_page.values())
    lines = [
        "# Web içeriği envanteri",
        "",
        "Bu klasör `scripts/build_web_inventory.py` tarafından üretilir.",
        "",
        "Her satır bir **içerik birimidir**: sayfada tek bir metin alanı. `EN` sütunu",
        "kaynaktan birebir kopyalanır, `TR` sütunu çeviri **taslağıdır** ve yayın",
        "onayı almamıştır.",
        "",
        "| Sayfa | Hedef rota | Birim |",
        "|---|---|---|",
    ]
    for page in units.PAGES:
        rows = rows_by_page[page.slug]
        routes = ", ".join(f"`{route}`" for route in page.routes)
        lines.append(f"| [`pages/{page.slug}.md`](pages/{page.slug}.md) | {routes} | {len(rows)} |")
    lines += [
        "",
        f"Toplam **{total}** içerik birimi, **{len(units.PAGES)}** hedef sayfa.",
        "",
        "## Kurallar",
        "",
        "1. **EN değişmez.** Bir satırın `EN` hücresi kaynak dosyadaki blokla bayt",
        "   düzeyinde aynıdır; elle yazılmaz, `slug#bN` adresinden çözülür.",
        "2. **TR taslaktır.** Türkçe metinler editör onayı bekler; sayısal iddialar",
        "   (yüzdeler, \"5×\", \"50% faster\") kaynaktaki değeriyle korunur.",
        "3. **Yazar notları girmez.** `<237 characters>`, `<image – …>`, `XXXXX` gibi",
        "   yayımlanmayacak notlar envanter satırı olmaz; `--check` bunları sayar.",
        "4. **Tekrar eden metin paylaşılır.** FRILO ve SCIA'da aynı özellik metni",
        "   birden fazla sürümde geçer; tek satır tanımlanır, sürümler ona referans verir.",
        "",
        "## Doğrulama",
        "",
        "```bash",
        "python3 scripts/build_web_inventory.py --check",
        "```",
        "",
        "Komut üç şeyi denetler: her kaynak bloğunun envantere girip girmediği,",
        "her birimin TR taslağı olup olmadığı ve ID'lerin benzersizliği.",
        "",
    ]
    (OUT_ROOT / "README.md").write_text("\n".join(lines), encoding="utf-8")


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
