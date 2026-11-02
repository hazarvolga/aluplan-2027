"""Attach source card destinations to the generated directory-card sections.

Each card's title, destination and CTA label come from the typed array in the
read-only 2026 source snapshot. Cards are matched to sections in source order by
exact heading, so a repeated heading outside the card grid stays unlinked.
"""

from dataclasses import dataclass
from pathlib import Path

from extract_structured_pages import (
    EV_DIR,
    find_const_array,
    get_prop_str,
    split_top_level_objects,
)


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


def apply_source_card_links(pages: dict) -> dict:
    updated = dict(pages)
    for spec in CARD_SOURCES:
        page = updated[spec.route]
        updated[spec.route] = {**page, "sections": link_sections(page["sections"], extract_cards(spec), spec.route)}
    return updated
