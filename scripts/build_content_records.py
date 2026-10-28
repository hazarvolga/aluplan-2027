#!/usr/bin/env python3
"""Stage D — emit the machine-readable content record layer.

Consumes the same inventory units as the Stage C builder and resolves each
unit's English text once, then writes ``docs/content-2027/03-data/
content-records.json``: one record per publishable text field, with source
file, block locator and source hash for staleness tracing.

Every output value is derived from committed inputs; the script is
deterministic (identical tree → identical JSON, key-sorted, 2-space indent).

Usage
-----
    python3 scripts/build_content_records.py         # write content-records.json
    python3 scripts/build_content_records.py --check # verify, write nothing
"""

from __future__ import annotations

import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

import inventory_units as units  # noqa: E402
from build_web_inventory import OUT_ROOT, ROLE_LABELS, resolve  # noqa: E402
import source_blocks  # noqa: E402

ROOT = Path(__file__).resolve().parent.parent
OUT_PATH = OUT_ROOT.parent / "03-data" / "content-records.json"

SCHEMA_VERSION = "1.0"

STATUS_TR_DRAFT = "tr-draft"
STATUS_READY_FIELD = "bodyTr"


def build(docs: dict[str, source_blocks.SourceDocument]) -> dict:
    pages: list[dict] = []
    records: list[dict] = []

    for page in units.PAGES:
        page_records = []
        for unit in units.UNITS:
            if unit.page != page.slug:
                continue
            row = resolve(unit, docs)
            document = docs[row["source"]]
            locator = f"{row['source']}#{row['block']}"
            if row.get("part"):
                locator += f"@{row['part']}"
            page_records.append(
                {
                    "id": row["id"],
                    "page": page.slug,
                    "role": row["role"],
                    "roleLabel": ROLE_LABELS.get(row["role"], row["role"]),
                    "sourceFile": document.meta.get("source", ""),
                    "sourceLocator": locator,
                    "sourceHash": document.meta.get("sha256", ""),
                    "bodyEn": row["en"],
                    "bodyTr": row["tr"],
                    "trStatus": "draft",
                    "note": row["note"] or "",
                }
            )
        pages.append(
            {
                "id": page.slug,
                "title": page.title,
                "routes": list(page.routes),
                "summary": page.summary,
                "openQuestions": list(page.open_questions),
                "recordCount": len(page_records),
            }
        )
        records.extend(page_records)

    return {
        "schemaVersion": SCHEMA_VERSION,
        "localeSource": "en",
        "localeTarget": "tr",
        "status": STATUS_TR_DRAFT,
        "statusNote": "bodyTr alanları taslak; editör onayı bekler.",
        "sourceCount": len(docs),
        "recordCount": len(records),
        "pages": pages,
        "records": records,
    }


def main(argv: list[str]) -> int:
    check_only = "--check" in argv
    docs = source_blocks.load_all()
    data = build(docs)

    payload = json.dumps(data, ensure_ascii=False, indent=2, sort_keys=True) + "\n"

    if check_only:
        if OUT_PATH.exists():
            existing = OUT_PATH.read_text(encoding="utf-8")
            if existing == payload:
                print("content-records.json güncel.")
                return 0
            print("content-records.json bayat: yeniden üretin.", file=sys.stderr)
            return 1
        print("content-records.json yok: önce üretmelisiniz.", file=sys.stderr)
        return 1

    OUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUT_PATH.write_text(payload, encoding="utf-8")
    print(f"content-records.json yazıldı: {data['recordCount']} kayıt, "
          f"{len(data['pages'])} sayfa, {OUT_PATH.relative_to(ROOT)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
