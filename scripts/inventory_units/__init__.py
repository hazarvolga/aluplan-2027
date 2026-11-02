"""Stage C content inventory: shared definitions plus per-product units.

Every module below defines ``PAGES``, ``UNITS`` and (optionally) ``SHARED``.
The builder resolves each unit's English text straight from Stage B output, so
the source documents stay authoritative.
"""

from __future__ import annotations

from .core import Page, Unit  # noqa: F401  (re-exported for module authors)

from . import allplan, allplan_civil, allplan_max, allplan_parametric, allplan_rebar, frilo, scia, sds2

MODULES = (allplan, allplan_parametric, allplan_rebar, allplan_max, allplan_civil, frilo, scia, sds2)

PAGES = [page for module in MODULES for page in module.PAGES]
UNITS = [unit for module in MODULES for unit in module.UNITS]

_SHARED: dict[str, Unit] = {}
for module in MODULES:
    for key, unit in getattr(module, "SHARED", {}).items():
        if key in _SHARED:
            raise KeyError(f"paylaşılan blok iki kez tanımlandı: {key}")
        _SHARED[key] = unit

VALID_PAGES = {page.slug for page in PAGES}
VALID_PAGES.add("_shared")
for unit in UNITS:
    if unit.page not in VALID_PAGES:
        raise KeyError(f"{unit.id}: bilinmeyen sayfa {unit.page!r}")

SHARED = _SHARED
