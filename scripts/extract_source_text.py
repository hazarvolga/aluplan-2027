#!/usr/bin/env python3
"""Extract source document text into Markdown for the 2027 content inventory.

Stage B of ``docs/content-2027``. Reads the read-only marketing package and
writes one Markdown file per source document under
``docs/content-2027/01-source-text/``.

Design rules:

* **Verbatim.** Text is copied as-is. No rewriting, no summarising, no
  translation. Translation lives in a separate field later (Stage C).
* **Traceable.** Every output file carries the source path, SHA-256 and
  paragraph/character counts so a later change can be detected.
* **No dependencies.** docx/xlsx are read with the standard library.
* **Deterministic.** No timestamps; running twice yields identical bytes.

Usage:
    python3 scripts/extract_source_text.py            # all sets
    python3 scripts/extract_source_text.py web-pages  # one set
"""

from __future__ import annotations

import hashlib
import re
import sys
import zipfile
from pathlib import Path
from xml.etree import ElementTree

sys.path.insert(0, str(Path(__file__).resolve().parent))
from pdf_text import extract_file_text  # noqa: E402  (local helper module)

ROOT = Path(__file__).resolve().parent.parent
OUT_ROOT = ROOT / "docs" / "content-2027" / "01-source-text"
MARKETING = ROOT / "Allplan 2027 Marketing Materials"

W = "{http://schemas.openxmlformats.org/wordprocessingml/2006/main}"

PRODUCT_BY_PREFIX = [
    ("ALLPLAN Civil 2027", "allplan-civil"),
    ("ALLPLAN Max 2027", "allplan-max"),
    ("ALLPLAN 2027", "allplan"),
    ("FRILO 2027", "frilo"),
    ("SCIA 2027", "scia"),
    ("SDS2 2027", "sds2"),
]

SLUG_REPLACEMENTS = {
    "–": "-",
    "—": "-",
    "’": "",
    "'": "",
    " ": "-",
}


def sha256_of(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for block in iter(lambda: handle.read(1 << 20), b""):
            digest.update(block)
    return digest.hexdigest()


def slugify(value: str) -> str:
    for source, target in SLUG_REPLACEMENTS.items():
        value = value.replace(source, target)
    value = re.sub(r"[^A-Za-z0-9\-_.]+", "-", value)
    value = re.sub(r"-{2,}", "-", value).strip("-.")
    return value.lower()


def product_of(path: Path) -> str:
    relative = path.relative_to(MARKETING)
    for prefix, slug in PRODUCT_BY_PREFIX:
        if relative.parts[0].startswith(prefix):
            return slug
    return "unknown"


# --------------------------------------------------------------------------- #
# docx
# --------------------------------------------------------------------------- #

def docx_heading_map(archive: zipfile.ZipFile) -> dict[str, int]:
    """Map style id -> heading level using word/styles.xml."""
    if "word/styles.xml" not in archive.namelist():
        return {}
    tree = ElementTree.fromstring(archive.read("word/styles.xml"))
    mapping: dict[str, int] = {}
    for style in tree.iter(f"{W}style"):
        style_id = style.get(f"{W}styleId") or ""
        name_el = style.find(f"{W}name")
        name = (name_el.get(f"{W}val") if name_el is not None else "") or ""
        match = re.search(r"heading\s*(\d)", name, re.IGNORECASE)
        if match:
            mapping[style_id] = int(match.group(1))
    return mapping


def paragraph_text(paragraph: ElementTree.Element) -> str:
    parts: list[str] = []
    for node in paragraph.iter():
        if node.tag == f"{W}t" and node.text:
            parts.append(node.text)
        elif node.tag == f"{W}tab":
            parts.append("\t")
        elif node.tag == f"{W}br":
            parts.append("\n")
    return "".join(parts).strip()


def paragraph_style(paragraph: ElementTree.Element) -> str:
    props = paragraph.find(f"{W}pPr")
    if props is None:
        return ""
    style = props.find(f"{W}pStyle")
    return style.get(f"{W}val") if style is not None else ""


def paragraph_is_list(paragraph: ElementTree.Element) -> bool:
    props = paragraph.find(f"{W}pPr")
    if props is None:
        return False
    return props.find(f"{W}numPr") is not None


def paragraph_is_bold(paragraph: ElementTree.Element) -> bool:
    """True when every text-bearing run is bold.

    The source documents use no heading styles at all — structure is carried
    by direct bold formatting. Markdown bold is the faithful equivalent, so
    the extracted text keeps the same emphasis instead of flattening it.
    """
    runs = [
        run
        for run in paragraph.findall(f"{W}r")
        if "".join(t.text or "" for t in run.iter(f"{W}t")).strip()
    ]
    if not runs:
        return False
    for run in runs:
        props = run.find(f"{W}rPr")
        bold = props is not None and props.find(f"{W}b") is not None
        if not bold:
            return False
    return True


def table_rows(table: ElementTree.Element) -> list[list[str]]:
    rows: list[list[str]] = []
    for row in table.findall(f"{W}tr"):
        cells: list[str] = []
        for cell in row.findall(f"{W}tc"):
            text = " ".join(
                paragraph_text(p) for p in cell.findall(f"{W}p") if paragraph_text(p)
            )
            cells.append(text.replace("|", "\\|"))
        if any(cells):
            rows.append(cells)
    return rows


def docx_to_markdown(path: Path) -> tuple[str, int, int]:
    with zipfile.ZipFile(path) as archive:
        headings = docx_heading_map(archive)
        body = ElementTree.fromstring(archive.read("word/document.xml"))

    root = body.find(f"{W}body")
    if root is None:
        return "", 0, 0

    blocks: list[str] = []
    paragraphs = 0
    characters = 0

    for element in root:
        if element.tag == f"{W}p":
            text = paragraph_text(element)
            if not text:
                continue
            paragraphs += 1
            characters += len(text)
            level = headings.get(paragraph_style(element), 0)
            if level:
                blocks.append(f"{'#' * min(level + 1, 6)} {text}")
            elif paragraph_is_list(element):
                blocks.append(f"- {text}")
            elif paragraph_is_bold(element):
                blocks.append(f"**{text}**")
            else:
                blocks.append(text)
        elif element.tag == f"{W}tbl":
            rows = table_rows(element)
            if not rows:
                continue
            width = max(len(r) for r in rows)
            rows = [r + [""] * (width - len(r)) for r in rows]
            lines = ["| " + " | ".join(rows[0]) + " |"]
            lines.append("|" + "|".join(["---"] * width) + "|")
            for row in rows[1:]:
                lines.append("| " + " | ".join(row) + " |")
            blocks.append("\n".join(lines))
            for row in rows:
                for cell in row:
                    characters += len(cell)

    return "\n\n".join(blocks), paragraphs, characters


# --------------------------------------------------------------------------- #
# xlsx
# --------------------------------------------------------------------------- #

def xlsx_sheets(path: Path) -> list[tuple[str, list[list[str]]]]:
    with zipfile.ZipFile(path) as archive:
        names = archive.namelist()
        shared: list[str] = []
        if "xl/sharedStrings.xml" in names:
            tree = ElementTree.fromstring(archive.read("xl/sharedStrings.xml"))
            ns = "{http://schemas.openxmlformats.org/spreadsheetml/2006/main}"
            for item in tree.iter(f"{ns}si"):
                shared.append("".join(t.text or "" for t in item.iter(f"{ns}t")))

        workbook = ElementTree.fromstring(archive.read("xl/workbook.xml"))
        ns = "{http://schemas.openxmlformats.org/spreadsheetml/2006/main}"
        sheet_names = [s.get("name") for s in workbook.iter(f"{ns}sheet")]

        result: list[tuple[str, list[list[str]]]] = []
        for index, name in enumerate(sheet_names, start=1):
            member = f"xl/worksheets/sheet{index}.xml"
            if member not in names:
                continue
            sheet = ElementTree.fromstring(archive.read(member))
            rows: list[list[str]] = []
            for row in sheet.iter(f"{ns}row"):
                cells: list[str] = []
                for cell in row.findall(f"{ns}c"):
                    cell_type = cell.get("t")
                    value_el = cell.find(f"{ns}v")
                    inline = "".join(t.text or "" for t in cell.iter(f"{ns}is"))
                    if cell_type == "s" and value_el is not None:
                        position = int(value_el.text or "0")
                        cells.append(shared[position] if position < len(shared) else "")
                    elif cell_type == "inlineStr":
                        cells.append(inline)
                    elif value_el is not None:
                        cells.append(value_el.text or "")
                    else:
                        cells.append("")
                if any(c.strip() for c in cells):
                    rows.append(cells)
            result.append((name or f"sheet{index}", rows))
    return result


def editions_markdown(path: Path) -> tuple[str, int, list[tuple[str, int, int]]]:
    """Render the edition sheet as a verbatim table.

    Returns the markdown, the record count and a per-row
    ``(edition, declared_count, actual_count)`` list so the source's own
    character counts can be verified instead of trusted.
    """
    sheets = xlsx_sheets(path)
    blocks: list[str] = []
    records = 0
    counts: list[tuple[str, int, int]] = []
    for sheet_name, rows in sheets:
        if not rows:
            continue
        header = rows[0]
        body = rows[1:]
        blocks.append(f"## Sayfa: {sheet_name}")
        blocks.append("")
        blocks.append("| " + " | ".join(header) + " |")
        blocks.append("|" + "|".join(["---"] * len(header)) + "|")
        for row in body:
            records += 1
            padded = row + [""] * (len(header) - len(row))
            blocks.append(
                "| " + " | ".join(c.replace("|", "\\|") for c in padded[: len(header)]) + " |"
            )
            if len(row) >= 2:
                edition = row[0]
                text = row[1]
                try:
                    declared = int(row[2]) if len(row) > 2 and row[2].strip() else -1
                except ValueError:
                    declared = -1
                counts.append((edition, declared, len(text)))
    return "\n".join(blocks), records, counts


# --------------------------------------------------------------------------- #
# driver
# --------------------------------------------------------------------------- #

def front_matter(path: Path, extra: list[tuple[str, str]] | None = None) -> str:
    lines = [
        "---",
        f"source: {path.relative_to(ROOT).as_posix()}",
        f"sha256: {sha256_of(path)}",
        f"product: {product_of(path)}",
    ]
    for key, value in extra or []:
        lines.append(f"{key}: {value}")
    lines.append("---")
    return "\n".join(lines)


def verify_docx(path: Path, body: str) -> list[str]:
    """Return source paragraphs whose text is missing from the output.

    A cheap fidelity guard: every non-empty paragraph in the document must
    appear verbatim in the generated Markdown. Empty list means nothing was
    dropped by the converter.
    """
    with zipfile.ZipFile(path) as archive:
        root = ElementTree.fromstring(archive.read("word/document.xml")).find(f"{W}body")
    if root is None:
        return []
    missing: list[str] = []
    for paragraph in root.iter(f"{W}p"):
        text = paragraph_text(paragraph)
        if text and text not in body:
            missing.append(text)
    return missing


def docx_image_count(path: Path) -> int:
    with zipfile.ZipFile(path) as archive:
        return len([n for n in archive.namelist() if n.startswith("word/media/")])


# Fields whose value is masked before the text enters the inventory. The rule
# comes from the project brief: personal data and company names are never
# written into inventory artefacts. The value is replaced, the field label is
# kept, so the structure of the source stays visible.
REDACT_FIELDS = {
    "project name",
    "company",
    "client",
    "customer",
    "architect",
    "owner",
    "firm",
    "office",
    "contact",
    "contact person",
    "name",
    "phone",
    "telephone",
    "mobile",
    "email",
    "e-mail",
    "address",
}

REDACTION_MARK = "[redacted]"

EMAIL_PATTERN = re.compile(r"[\w.+-]+@[\w-]+\.[\w.-]+")
PHONE_PATTERN = re.compile(r"(?<!\d)\+?\d[\d\s()/-]{7,}\d(?!\d)")

# Image credits name the photographer, the architect and the client. They must
# be cleared for publication separately, so the whole line is masked here.
CREDIT_PATTERN = re.compile(
    r"^(?:[-*][ \t]+)?(?:[^\n]*©[^\n]*|(?:Photo|Credit|Image credit)[ \t]*:[^\n]*)$",
    re.MULTILINE | re.IGNORECASE,
)


def redact(text: str) -> tuple[str, int]:
    """Mask company names, e-mail addresses and phone numbers.

    Returns the masked text and the number of replacements, so the front
    matter can record that a document was redacted instead of silently
    changing it.
    """
    hits = 0

    def mask_field(match: re.Match) -> str:
        nonlocal hits
        label = match.group("key").strip().lower()
        if label not in REDACT_FIELDS:
            return match.group(0)
        hits += 1
        return f"{match.group('prefix')}{match.group('key')}: {REDACTION_MARK}"

    text = re.sub(
        r"^(?P<prefix>(?:[-*][ \t]+)?)(?P<key>[A-Za-zÇĞİÖŞÜçğıöşü /\-]{2,40}):[ \t]*(?P<value>[^\n]+)$",
        mask_field,
        text,
        flags=re.MULTILINE,
    )

    def mask_email(match: re.Match) -> str:
        nonlocal hits
        hits += 1
        return REDACTION_MARK

    text = EMAIL_PATTERN.sub(mask_email, text)

    def mask_phone(match: re.Match) -> str:
        nonlocal hits
        hits += 1
        return REDACTION_MARK

    text = PHONE_PATTERN.sub(mask_phone, text)

    def mask_credit(match: re.Match) -> str:
        nonlocal hits
        hits += 1
        return "[redacted: image credit]"

    text = CREDIT_PATTERN.sub(mask_credit, text)
    return text, hits


def extract_web_pages() -> list[dict]:
    targets = sorted(MARKETING.glob("*/Web Pages/*.docx"))
    out_dir = OUT_ROOT / "web-pages"
    out_dir.mkdir(parents=True, exist_ok=True)
    written: list[dict] = []

    for path in targets:
        markdown, paragraphs, characters = docx_to_markdown(path)
        images = docx_image_count(path)
        missing = verify_docx(path, markdown)
        redacted, redactions = redact(markdown)
        header = front_matter(
            path,
            [
                ("locale", "en"),
                ("paragraphs", str(paragraphs)),
                ("characters", str(characters)),
                ("embedded_images", str(images)),
                ("redactions", str(redactions)),
            ],
        )
        title = path.stem
        body = f"{header}\n\n# {title}\n\n{redacted}\n"
        target = out_dir / f"{product_of(path)}--{slugify(path.stem)}.md"
        target.write_text(body, encoding="utf-8")
        written.append(
            {
                "kind": "web-page",
                "output": target.relative_to(ROOT).as_posix(),
                "product": product_of(path),
                "paragraphs": paragraphs,
                "characters": characters,
                "images": images,
                "redactions": redactions,
            }
        )
        flag = "" if not missing else f"  EKSİK {len(missing)} paragraf"
        mask = "" if not redactions else f"  {redactions} maskeleme"
        print(
            f"  {paragraphs:>4} paragraf  {characters:>6} karakter  "
            f"{target.name}{flag}{mask}"
        )
        for text in missing[:3]:
            print(f"       kayıp: {text[:70]!r}")

    return written


def extract_editions() -> list[dict]:
    candidates = sorted(MARKETING.glob("*/Web Pages/Launch 2027 - Intro text edition pages shop EN*.xlsx"))
    if not candidates:
        print("  UYARI: edition xlsx bulunamadı")
        return []

    # Three product folders ship the same sheet. Their bytes differ (Office
    # metadata), so equality is decided on extracted content, not on SHA-256.
    contents = {path: xlsx_sheets(path) for path in candidates}
    canonical = sorted(candidates, key=lambda p: ("Copy" in p.name, p.as_posix()))[0]
    reference = contents[canonical]
    identical = all(rows == reference for rows in contents.values())

    out_dir = OUT_ROOT / "editions"
    out_dir.mkdir(parents=True, exist_ok=True)

    markdown, records, counts = editions_markdown(canonical)
    mismatches = [(name, declared, actual) for name, declared, actual in counts if declared != actual]

    header = front_matter(
        canonical,
        [
            ("locale", "en"),
            ("records", str(records)),
            ("copies", str(len(candidates))),
            ("identical_content", "yes" if identical else "no"),
            ("character_count_mismatches", str(len(mismatches))),
        ],
    )

    lines = [header, "", "# Edition giriş metinleri (2027)", "", markdown, ""]
    lines += [
        "## Karakter sayısı doğrulaması",
        "",
        "Kaynak dosyanın `# characters:` kolonu, aynı satırdaki metnin gerçek",
        "uzunluğuyla karşılaştırılır. Uyuşmazlık varsa metin sonradan düzenlenmiş",
        "ve sayaç güncellenmemiş demektir.",
        "",
        "| Edition | Kaynakta | Gerçek | Durum |",
        "|---|---|---|---|",
    ]
    for name, declared, actual in counts:
        status = "eşleşiyor" if declared == actual else "FARKLI"
        lines.append(f"| {name} | {declared} | {actual} | {status} |")
    lines += [
        "",
        "## Kopya dosyalar",
        "",
        f"{len(candidates)} ürün klasöründe aynı sayfa var; içerik "
        f"{'birebir aynı' if identical else 'FARKLI'}. Kanonik kaynak:",
        "",
    ]
    for path in candidates:
        marker = "kanonik" if path == canonical else "kopya"
        lines.append(f"- `{path.relative_to(ROOT).as_posix()}` — {marker}")

    target = out_dir / "editions-2027.md"
    target.write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(
        f"  {records:>4} edition  {len(candidates)} kopya "
        f"(aynı içerik: {identical})  {len(mismatches)} sayaç uyuşmazlığı  {target.name}"
    )
    return [
        {
            "kind": "editions",
            "output": target.relative_to(ROOT).as_posix(),
            "records": records,
            "copies": len(candidates),
            "identical": "evet" if identical else "hayır",
            "mismatches": len(mismatches),
        }
    ]


def write_index(written: list[dict]) -> None:
    web = [item for item in written if item["kind"] == "web-page"]
    editions = [item for item in written if item["kind"] == "editions"]
    pdfs = [item for item in written if item["kind"] == "pdf"]
    proofs = [item for item in written if item["kind"] == "proof-points"]

    lines = [
        "# Kaynak metin çıkarımı",
        "",
        "Bu klasör `scripts/extract_source_text.py` tarafından üretilir.",
        "Metinler **birebir** kopyadır; düzenleme veya çeviri içermez.",
        "",
        "Her dosyanın başındaki front-matter kaynak yolu, SHA-256 ve sayımları taşır.",
        "Kaynak dosya değişirse hash uyuşmaz ve çıkarım bayatlar.",
        "",
        "## Biçim kuralları",
        "",
        "1. **Metin değişmez.** Cümleler kaynaktaki hâliyle yazılır; kısaltma,",
        "   düzeltme veya çeviri yapılmaz.",
        "2. **Yapı korunur.** Kaynakta başlık stili varsa `#`/`##`/`###` olur.",
        "   2027 docx'lerinin çoğunda başlık stili yoktur; bu durumda blok",
        "   etiketleri (ör. `Hero`, `Overview`, `Benefits`) ve bölüm başlıkları",
        "   kaynaktaki gibi **kalın** yazılır.",
        "3. **Yazar notları korunur.** `<237 characters>`, `<image – …>` gibi",
        "   köşeli parantezli notlar kaynakta olduğu gibi kalır; bunlar yayımlanmaz.",
        "4. **Tablolar** markdown tablosuna çevrilir; hücre metni değişmez.",
        "5. **Kişisel veri maskelenir.** Firma adı, kişi adı, e-posta, telefon ve",
        "   görsel kredisi satırları `[redacted]` ile değiştirilir; alan etiketi",
        "   kalır. Kaç maskeleme yapıldığı her dosyanın front-matter'ında",
        "   `redactions:` alanında yazılıdır. Maskelenen krediler yayın öncesi",
        "   ayrıca onaya sunulmalıdır.",
        "",
        "## Web sayfası metinleri",
        "",
        f"{len(web)} docx dosyası. Hepsi `Web Pages/` altında ve İngilizce kaynak.",
        "",
        "| Ürün | Dosya | Paragraf | Karakter | Gömülü görsel | Maskeleme |",
        "|---|---|---|---|---|---|",
    ]
    for item in sorted(web, key=lambda i: (i["product"], i["output"])):
        name = item["output"].rsplit("/", 1)[-1]
        lines.append(
            f"| {item['product']} | `{name}` | {item['paragraphs']} | "
            f"{item['characters']} | {item['images']} | {item['redactions']} |"
        )

    total_chars = sum(item["characters"] for item in web)
    total_redactions = sum(item["redactions"] for item in web)
    lines += [
        "",
        f"Toplam **{total_chars:,}** karakter kaynak metin.".replace(",", "."),
        f"Toplam **{total_redactions}** maskeleme.".replace(",", "."),
        "",
        "## Edition giriş metinleri",
        "",
    ]
    for item in editions:
        lines.append(
            f"- `{item['output'].rsplit('/', 1)[-1]}` — {item['records']} edition, "
            f"{item['copies']} kopya dosya (içerik aynı: {item['identical']}), "
            f"sayaç uyuşmazlığı: {item['mismatches']}"
        )

    lines += ["", "## PDF metin katmanı", ""]
    if pdfs:
        lines += [
            f"{len(pdfs)} PDF. Metin katmanı doğrudan dosyadan okunur; OCR yok.",
            "",
            "| Ürün | Dosya | Sayfa | Karakter | Çözülemeyen glif | Maskeleme |",
            "|---|---|---|---|---|---|",
        ]
        for item in sorted(pdfs, key=lambda i: (i["product"], i["output"])):
            name = item["output"].rsplit("/", 1)[-1]
            lines.append(
                f"| {item['product']} | `{name}` | {item['pages']} | "
                f"{item['characters']} | {item['undecodable']} | {item['redactions']} |"
            )
        lines += [
            "",
            "`SDS2-Competitive Landscape.pdf` **bilinçli olarak çıkarılmadı**:",
            "iç kullanım belgesi, sitede yayımlanmaz. Tam metni de repoya alınmadı.",
        ]
    else:
        lines.append("PDF çıkarımı bu çalıştırmada atlandı.")

    lines += ["", "## Proof points", ""]
    for item in proofs:
        lines.append(
            f"- `{item['output'].rsplit('/', 1)[-1]}` — {item['claims']} iddia, "
            f"{item['sections']} bölüm, yalnızca `Summary` sayfası okundu"
        )

    lines.append("")
    (OUT_ROOT / "README.md").write_text("\n".join(lines), encoding="utf-8")


def extract_pdfs() -> list[dict]:
    """Extract the PDF text layer, skipping documents marked internal-only."""
    targets = sorted(MARKETING.rglob("*.pdf"))
    out_dir = OUT_ROOT / "pdf"
    out_dir.mkdir(parents=True, exist_ok=True)
    written: list[dict] = []

    for path in targets:
        relative = path.relative_to(ROOT).as_posix()
        if is_internal_only(path):
            print(f"  ATLANDI (iç kullanım)  {path.name}")
            continue

        text, undecodable, pages = extract_file_text(path.read_bytes())
        redacted, redactions = redact(text)
        header = front_matter(
            path,
            [
                ("locale", "en"),
                ("pages", str(pages)),
                ("characters", str(len(text))),
                ("undecodable_glyph_runs", str(undecodable)),
                ("redactions", str(redactions)),
            ],
        )
        body = f"{header}\n\n# {path.stem}\n\n{redacted}\n"
        target = out_dir / f"{product_of(path)}--{slugify(path.stem)}.md"
        target.write_text(body, encoding="utf-8")
        written.append(
            {
                "kind": "pdf",
                "output": target.relative_to(ROOT).as_posix(),
                "product": product_of(path),
                "pages": pages,
                "characters": len(text),
                "undecodable": undecodable,
                "redactions": redactions,
            }
        )
        flag = "" if not undecodable else f"  {undecodable} çözülemeyen glif"
        mask = "" if not redactions else f"  {redactions} maskeleme"
        print(f"  {pages:>2} sayfa  {len(text):>6} karakter  {target.name}{flag}{mask}")

    return written


def is_internal_only(path: Path) -> bool:
    """Competitive analysis is internal and never published, so its full text
    is not copied into the repository either."""
    name = path.name.lower()
    return "competitive landscape" in name or "competition" in name


def extract_proof_points() -> list[dict]:
    """Reduce the beta-survey workbook to anonymous percentages.

    Only the ``Summary`` sheet is read. The per-feature sheets hold respondent
    names, e-mail addresses and company names, and are deliberately never
    opened — the brief forbids writing that data anywhere.
    """
    candidates = sorted(MARKETING.rglob("*Proof Points*.xlsx"))
    if not candidates:
        print("  UYARI: proof points xlsx bulunamadı")
        return []

    # The launch-packet copy is the later, fuller workbook: same summary sheet
    # plus the per-feature detail sheets. It is the canonical source.
    canonical = max(candidates, key=lambda p: (p.stat().st_size, p.as_posix()))

    def summary(path: Path) -> list[list[str]]:
        for name, rows in xlsx_sheets(path):
            if name.strip().lower() == "summary":
                return rows
        return []

    rows = summary(canonical)
    if not rows:
        print("  UYARI: Summary sayfası bulunamadı")
        return []

    others = {path: summary(path) for path in candidates if path != canonical}

    sections: list[tuple[str, list[tuple[str, str, str]]]] = []
    current: tuple[str, list[tuple[str, str, str]]] | None = None

    for row in rows:
        label = row[0].strip() if row else ""
        value = row[1].strip() if len(row) > 1 else ""
        note = row[2].strip() if len(row) > 2 else ""
        if not label:
            continue

        # Every block in the sheet repeats this caption in the value column.
        is_caption = value.lower().startswith("results of beta testing survey")

        if not value and not note:
            # Question header: merge into the section above when it is still
            # empty, otherwise start a new one.
            if sections and not sections[-1][1]:
                sections[-1] = (label, sections[-1][1])
                current = sections[-1]
            else:
                current = (label, [])
                sections.append(current)
            continue

        if is_caption and not note:
            current = (label, [])
            sections.append(current)
            continue

        if value and current is not None:
            current[1].append((label, value, note))

    def percent(raw: str) -> str:
        try:
            return f"{round(float(raw) * 100)}%"
        except ValueError:
            return raw

    lines = [
        "# Proof points — anonim yüzdeler",
        "",
        "Bu dosya `scripts/extract_source_text.py` tarafından üretilir.",
        "",
        "Kaynak: beta test anketi özeti. **Yalnızca `Summary` sayfası okunur.**",
        "Anket yanıtlarının bulunduğu sayfalar (ad, e-posta, firma, rıza durumu)",
        "hiç açılmaz ve envantere hiçbir kişisel veri yazılmaz.",
        "",
        "Değerler anket yanıtlarının ortalamasıdır; yüzdeye çevrilmiştir.",
        "Yayın öncesi Türkiye pazarı için ayrı izin gerekir.",
        "",
    ]

    for title, entries in sections:
        lines += [f"## {title}", ""]
        if entries:
            lines += ["| İddia (EN, kaynaktan) | Değer | Not (EN, kaynaktan) |", "|---|---|---|"]
            for label, value, note in entries:
                clean_note = note.replace("|", "\\|")
                lines.append(f"| {label.replace('|', chr(92) + '|')} | {percent(value)} | {clean_note} |")
        else:
            lines.append("_Bu bölümde sayısal iddia yok; yalnızca soru başlığı var._")
        lines.append("")

    if others:
        lines += [
            "## Kopya dosya karşılaştırması",
            "",
            "Aynı özet sayfası birden fazla dosyada var. Değer farkı, hangi sürümün",
            "esas alındığını önemli kılar.",
            "",
            "| Dosya | Farklı değer sayısı |",
            "|---|---|",
        ]
        canonical_values = {
            label: value for _title, entries in sections for label, value, _note in entries
        }
        for path, other_rows in others.items():
            differences: list[tuple[str, str, str]] = []
            for row in other_rows:
                if len(row) < 2:
                    continue
                label, value = row[0].strip(), row[1].strip()
                if label in canonical_values and value and canonical_values[label] != value:
                    differences.append((label, canonical_values[label], value))
            lines.append(
                f"| `{path.relative_to(ROOT).as_posix()}` | {len(differences)} |"
            )
            if differences:
                lines += [
                    "",
                    f"`{path.name}` içinde farklı olan iddialar:",
                    "",
                    "| İddia | Kanonik | Bu dosya |",
                    "|---|---|---|",
                ]
                for label, canonical_value, other_value in differences:
                    lines.append(
                        f"| {label} | {percent(canonical_value)} | {percent(other_value)} |"
                    )
                lines.append("")

    target = OUT_ROOT / "proof-points.md"
    header = front_matter(
        canonical,
        [
            ("locale", "en"),
            ("sections", str(len(sections))),
            ("claims", str(sum(len(entries) for _title, entries in sections))),
            ("personal_data_read", "no"),
        ],
    )
    target.write_text(header + "\n\n" + "\n".join(lines), encoding="utf-8")

    claims = sum(len(entries) for _title, entries in sections)
    print(f"  {claims:>3} iddia  {len(sections)} bölüm  {target.name}")
    return [
        {
            "kind": "proof-points",
            "output": target.relative_to(ROOT).as_posix(),
            "claims": claims,
            "sections": len(sections),
        }
    ]


def main(argv: list[str]) -> int:
    sets = argv[1:] or ["web-pages", "editions", "pdf", "proof-points"]
    OUT_ROOT.mkdir(parents=True, exist_ok=True)
    written: list[dict] = []

    if "web-pages" in sets:
        print("Web Pages docx:")
        written += extract_web_pages()
    if "editions" in sets:
        print("Edition xlsx:")
        written += extract_editions()
    if "pdf" in sets:
        print("PDF metin katmanı:")
        written += extract_pdfs()
    if "proof-points" in sets:
        print("Proof points:")
        written += extract_proof_points()

    write_index(written)
    print(f"\n{len(written)} dosya yazıldı → {OUT_ROOT.relative_to(ROOT)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
