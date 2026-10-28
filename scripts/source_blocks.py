#!/usr/bin/env python3
"""Split the extracted 2027 source texts into addressable blocks.

Stage B wrote one Markdown file per source document with the text verbatim.
Stage C needs to point at individual pieces of that text — a headline, an
intro paragraph, one feature — so every inventory row can say exactly where
it came from. This module does the splitting and nothing else.

A *block* is the smallest unit the source documents actually distinguish:

``title``    the ``# <document name>`` line Stage B adds
``heading``  a ``##``/``###``/``####`` heading (``### PRODUCT PAGE``)
``label``    a whole-line bold run (``**FEATURE 1 TEXT (240 characters max)**``)
``table``    a contiguous run of ``| … |`` rows
``item``     one ``- `` bullet
``para``     one paragraph

Blocks keep their document order and get a stable 1-based number, written as
``<slug>#b12``. Numbers are stable because Stage B is deterministic and the
front-matter hash pins the source.
"""

from __future__ import annotations

import re
from dataclasses import dataclass
from pathlib import Path

SOURCE_ROOT = Path(__file__).resolve().parent.parent / "docs" / "content-2027" / "01-source-text"

FRONT_MATTER_RE = re.compile(r"\A---\n(.*?)\n---\n", re.DOTALL)
HEADING_RE = re.compile(r"^(#{2,4})\s+(.*)$")
LABEL_RE = re.compile(r"^\*\*(.+?)\*\*$")
BULLET_RE = re.compile(r"^[-*]\s+(.*)$")


@dataclass
class Block:
    number: int
    kind: str
    text: str

    @property
    def address(self) -> str:
        return f"b{self.number}"


@dataclass
class SourceDocument:
    slug: str
    path: Path
    meta: dict[str, str]
    blocks: list[Block]

    def block(self, number: int) -> Block:
        for block in self.blocks:
            if block.number == number:
                return block
        raise KeyError(f"{self.slug}#b{number} yok")

    def by_address(self, address: str) -> Block:
        if not address.startswith("b"):
            raise KeyError(f"geçersiz blok adresi: {address}")
        return self.block(int(address[1:]))


def read_front_matter(text: str) -> tuple[dict[str, str], str]:
    match = FRONT_MATTER_RE.match(text)
    if not match:
        return {}, text
    meta: dict[str, str] = {}
    for line in match.group(1).splitlines():
        if ":" not in line:
            continue
        key, value = line.split(":", 1)
        meta[key.strip()] = value.strip()
    return meta, text[match.end():]


def split_blocks(body: str) -> list[Block]:
    """Turn a Stage B body into numbered blocks."""
    blocks: list[Block] = []
    paragraph: list[str] = []
    table: list[str] = []
    number = 0

    def flush_paragraph() -> None:
        nonlocal number, paragraph
        if not paragraph:
            return
        text = "\n".join(paragraph).strip()
        if text:
            number += 1
            blocks.append(Block(number, "para", text))
        paragraph = []

    def flush_table() -> None:
        nonlocal number, table
        if not table:
            return
        number += 1
        blocks.append(Block(number, "table", "\n".join(table)))
        table = []

    for raw in body.splitlines():
        line = raw.rstrip()
        stripped = line.strip()

        if not stripped:
            flush_paragraph()
            flush_table()
            continue

        if stripped.startswith("|"):
            flush_paragraph()
            table.append(stripped)
            continue
        flush_table()

        heading = HEADING_RE.match(stripped)
        if heading:
            flush_paragraph()
            number += 1
            blocks.append(Block(number, "heading", heading.group(2).strip()))
            continue

        label = LABEL_RE.match(stripped)
        if label:
            flush_paragraph()
            number += 1
            blocks.append(Block(number, "label", label.group(1).strip()))
            continue

        bullet = BULLET_RE.match(stripped)
        if bullet:
            flush_paragraph()
            number += 1
            blocks.append(Block(number, "item", bullet.group(1).strip()))
            continue

        if stripped.startswith("# "):
            flush_paragraph()
            number += 1
            blocks.append(Block(number, "title", stripped[2:].strip()))
            continue

        paragraph.append(stripped)

    flush_paragraph()
    flush_table()
    return blocks


def load_document(path: Path) -> SourceDocument:
    text = path.read_text(encoding="utf-8")
    meta, body = read_front_matter(text)
    return SourceDocument(slug=path.stem, path=path, meta=meta, blocks=split_blocks(body))


def load_all(root: Path = SOURCE_ROOT) -> dict[str, SourceDocument]:
    documents: dict[str, SourceDocument] = {}
    for path in sorted((root / "web-pages").glob("*.md")):
        document = load_document(path)
        documents[document.slug] = document
    for path in sorted((root / "pdf").glob("*.md")):
        document = load_document(path)
        documents[document.slug] = document
    return documents


def dump_maps(documents: dict[str, SourceDocument]) -> str:
    """Human-readable block map, used when authoring inventory rows."""
    lines: list[str] = []
    for slug, document in documents.items():
        lines.append(f"## {slug}")
        lines.append("")
        lines.append(f"`{document.meta.get('source', '')}`")
        lines.append("")
        for block in document.blocks:
            text = block.text.replace("\n", " ⏎ ")
            if len(text) > 110:
                text = text[:107] + "…"
            lines.append(f"- `{block.address}` **{block.kind}** — {text}")
        lines.append("")
    return "\n".join(lines)


if __name__ == "__main__":
    docs = load_all()
    total = sum(len(d.blocks) for d in docs.values())
    print(f"{len(docs)} belge, {total} blok")
    print(dump_maps(docs))
