"""Attach source card destinations to the generated directory-card sections.

Each card's title, destination and CTA label come from the typed array in the
read-only 2026 source snapshot. Cards are matched to sections in source order by
exact heading, so a repeated heading outside the card grid stays unlinked.
"""

import html
import re
from dataclasses import dataclass

from extract_structured_pages import (
    EV_DIR,
    PUBLIC_DIR,
    extract_balanced_block,
    find_const_array,
    get_prop_str,
    split_top_level_objects,
)

AX3000_DOCS_ROUTE = "/products/ax3000/dokumanlar"
AX3000_DOCS_SOURCE = "app/products/ax3000/dokumanlar/documents.ts"
AX3000_DOCS_PUBLIC = "/docs/ax3000/"
DOCUMENT_FIELDS = ("title", "language", "format", "detail", "size", "badge", "description", "filename")


@dataclass(frozen=True)
class CardSource:
    route: str
    source_file: str
    array_name: str
    href_prop: str = "href"
    label: str = ""
    label_prop: str = ""


CARD_SOURCES: tuple[CardSource, ...] = (
    CardSource("/products", "app/products/page.tsx", "products", label="Detayları Görüntüle"),
    CardSource("/solutions-v2/training", "app/solutions-v2/training/page.tsx", "formats", label="Detayları Gör"),
    CardSource("/solutions/addons", "app/solutions/addons/ClientPage.tsx", "items", label_prop="buttonText"),
    CardSource("/solutions/cds-addon", "app/solutions/cds-addon/ClientPage.tsx", "addonsCards", label_prop="buttonText"),
    CardSource(
        "/solutions/ax3000-mekanik-tesisat",
        "app/solutions/ax3000-mekanik-tesisat/ClientPage.tsx",
        "modules",
        href_prop="link",
        label="Devamını Oku",
    ),
)


@dataclass(frozen=True)
class ActionSource:
    route: str
    source_file: str
    start_marker: str


AX3000_MODULE_SLUGS = ("elektrik", "havalandirma", "isitma", "konut-havalandirma", "sihhi-tesisat", "sprinkler")

ACTION_SOURCES: tuple[ActionSource, ...] = (
    ActionSource("/solutions-v2/connect-license", "app/solutions-v2/connect-license/page.tsx", "{/* Final CTA */}"),
    ActionSource("/solutions/ax3000-mekanik-tesisat", "app/solutions/ax3000-mekanik-tesisat/ClientPage.tsx", 'key="ekb"'),
    ActionSource("/solutions/ax3000-mekanik-tesisat", "app/solutions/ax3000-mekanik-tesisat/ClientPage.tsx", 'key="documents"'),
    *(
        ActionSource(f"/solutions/ax3000/{slug}", f"app/solutions/ax3000/{slug}/ClientPage.tsx", 'className="space-y-3"')
        for slug in AX3000_MODULE_SLUGS
    ),
)

JSX_LINK = re.compile(r'<(?:Link|a)\s+href="([^"]+)"[^>]*>([^<{]+)')
JSX_HEADING = re.compile(r"<h[1-6][^>]*>([^<{]+)</h[1-6]>")


def read_source(relative: str) -> str:
    path = EV_DIR / relative
    if not path.is_file():
        raise FileNotFoundError(f"source snapshot missing: {path}")
    return path.read_text(encoding="utf-8")


def extract_cards(spec: CardSource) -> list[dict]:
    text = read_source(spec.source_file)
    objects = split_top_level_objects(find_const_array(text, spec.array_name))
    if not objects:
        raise ValueError(f"{spec.source_file}: array {spec.array_name!r} not found")
    if spec.label and spec.label not in text:
        raise ValueError(f"{spec.source_file}: CTA label {spec.label!r} not in source")
    cards = []
    for obj in objects:
        title = get_prop_str(obj, "title")
        href = get_prop_str(obj, spec.href_prop)
        label = get_prop_str(obj, spec.label_prop) if spec.label_prop else spec.label
        if not (title and href and label):
            raise ValueError(f"{spec.source_file}: incomplete card {obj[:80]!r}")
        cards.append({"title": title, "href": href, "label": label})
    return cards


def link_sections(sections: list[dict], cards: list[dict], route: str) -> list[dict]:
    linked = list(sections)
    cursor = 0
    for card in cards:
        index = next(
            (i for i in range(cursor, len(linked)) if linked[i].get("heading") == card["title"]),
            None,
        )
        if index is None:
            raise ValueError(f"{route}: no section for card {card['title']!r}")
        linked[index] = {**linked[index], "link": {"href": card["href"], "label": card["label"]}}
        cursor = index + 1
    return linked


def extract_document(obj: str) -> dict:
    document = {field: get_prop_str(obj, field) for field in DOCUMENT_FIELDS}
    missing = [field for field, value in document.items() if not value]
    if missing:
        raise ValueError(f"{AX3000_DOCS_SOURCE}: document missing {missing}: {obj[:80]!r}")
    href = AX3000_DOCS_PUBLIC + document["filename"]
    if not (PUBLIC_DIR / href.lstrip("/")).is_file():
        raise FileNotFoundError(f"public document missing: {href}")
    return {**document, "href": href}


def extract_document_groups() -> list[dict]:
    text = read_source(AX3000_DOCS_SOURCE)
    groups = []
    for group in split_top_level_objects(find_const_array(text, "documentGroups")):
        start = group.find("documents:")
        documents = extract_balanced_block(group, group.index("[", start), "[", "]") if start != -1 else ""
        header = group[:start] if start != -1 else group
        groups.append({
            "id": get_prop_str(header, "id"),
            "title": get_prop_str(header, "title"),
            "description": get_prop_str(header, "description"),
            "documents": [extract_document(obj) for obj in split_top_level_objects(documents)],
        })
    if not groups or not all(g["id"] and g["title"] and g["documents"] for g in groups):
        raise ValueError(f"{AX3000_DOCS_SOURCE}: documentGroups incomplete")
    return groups


def clean_jsx_text(raw: str) -> str:
    return " ".join(html.unescape(raw).split())


def extract_action_block(spec: ActionSource) -> tuple[str, list[dict]]:
    text = read_source(spec.source_file)
    start = text.find(spec.start_marker)
    if start == -1:
        raise ValueError(f"{spec.source_file}: marker {spec.start_marker!r} not found")
    end = text.find("</section>", start)
    block = text[start:end]
    inner = JSX_HEADING.findall(block)
    preceding = JSX_HEADING.findall(text[:start])
    headings = inner or preceding[-1:]
    if not headings:
        raise ValueError(f"{spec.source_file}: no heading for block {spec.start_marker!r}")
    actions = [
        {"label": clean_jsx_text(label), "href": href, "external": href.startswith("http")}
        for href, label in JSX_LINK.findall(block)
    ]
    if not actions:
        raise ValueError(f"{spec.source_file}: no links in block {spec.start_marker!r}")
    return clean_jsx_text(headings[0]), actions


def attach_actions(sections: list[dict], heading: str, actions: list[dict], route: str) -> list[dict]:
    index = next((i for i, s in enumerate(sections) if s.get("heading") == heading), None)
    if index is None:
        raise ValueError(f"{route}: no section {heading!r} for action links")
    updated = list(sections)
    updated[index] = {**updated[index], "actions": actions}
    return updated


def apply_source_card_links(pages: dict) -> dict:
    updated = dict(pages)
    for spec in CARD_SOURCES:
        page = updated[spec.route]
        updated[spec.route] = {**page, "sections": link_sections(page["sections"], extract_cards(spec), spec.route)}
    for action_spec in ACTION_SOURCES:
        heading, actions = extract_action_block(action_spec)
        page = updated[action_spec.route]
        updated[action_spec.route] = {**page, "sections": attach_actions(page["sections"], heading, actions, action_spec.route)}
    updated[AX3000_DOCS_ROUTE] = {**updated[AX3000_DOCS_ROUTE], "documentGroups": extract_document_groups()}
    return updated
