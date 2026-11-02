"""Data model for the Stage C content inventory.

Every inventory row is a :class:`Unit`. The unit never stores the English text:
it stores a source document slug plus a block address, and
``build_web_inventory.py`` copies the text out of Stage B's output. Turkish
drafts live here because they are editorial work, not extraction.
"""

from __future__ import annotations

from dataclasses import dataclass, field


@dataclass(frozen=True)
class Page:
    """One target page of the 2027 site."""

    slug: str
    title: str
    routes: tuple[str, ...]
    summary: str
    open_questions: tuple[str, ...] = field(default_factory=tuple)


@dataclass(frozen=True)
class Unit:
    """One text field on a page."""

    id: str
    page: str
    role: str
    source: str = ""
    block: str = ""
    tr: str = ""
    shared: str = ""
    part: str = ""
    note: str = ""


def shared_unit(id: str, role: str, source: str, block: str, tr: str, part: str = "") -> Unit:
    """A block that appears on more than one page; defined once, referenced by id."""
    return Unit(id=id, page="_shared", role=role, source=source, block=block, tr=tr, part=part)


def ref(id: str, page: str, role: str, shared: str, note: str = "") -> Unit:
    """A page row that reuses a shared block."""
    return Unit(id=id, page=page, role=role, shared=shared, note=note)
