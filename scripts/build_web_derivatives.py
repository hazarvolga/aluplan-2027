#!/usr/bin/env python3
"""Build web JPEG derivatives for heavy homepage imagery and the default share image.

Usage:
  python3 scripts/build_web_derivatives.py          # (re)generate with macOS sips
  python3 scripts/build_web_derivatives.py --check  # validate committed derivatives
"""

import struct
import subprocess
import sys
from dataclasses import dataclass
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PUBLIC = ROOT / "public"
JPEG_QUALITY = "75"
MAX_WIDTH = 1200
MAX_DERIVATIVE_BYTES = 450_000
OG_SIZE = (1200, 630)
MAX_OG_BYTES = 300_000


@dataclass(frozen=True)
class Derivative:
    source: str
    target: str


HOMEPAGE_DERIVATIVES = tuple(
    Derivative(f"assets/previews/{group}/{name}-original.png", f"assets/previews/{group}/{name}-web.jpg")
    for group, names in (
        ("solutions", ("building", "infrastructure", "construction", "addons", "other")),
        ("workflow", ("architecture", "engineering", "precast")),
    )
    for name in names
)
OG_SOURCE = "assets/heroes/families/vf-00-ecosystem-overview.jpg"
OG_TARGET = "opengraph-image.jpg"


def run_sips(*args: str) -> None:
    subprocess.run(["sips", *args], check=True, capture_output=True)


def png_size(path: Path) -> tuple[int, int]:
    return struct.unpack(">II", path.read_bytes()[16:24])


def jpeg_size(path: Path) -> tuple[int, int]:
    data = path.read_bytes()
    index = 2
    while index < len(data):
        marker, length = data[index + 1], struct.unpack(">H", data[index + 2:index + 4])[0]
        if 0xC0 <= marker <= 0xCF and marker not in (0xC4, 0xC8, 0xCC):
            height, width = struct.unpack(">HH", data[index + 5:index + 9])
            return width, height
        index += 2 + length
    raise ValueError(f"no SOF marker in {path}")


def generate() -> None:
    for item in HOMEPAGE_DERIVATIVES:
        run_sips("-s", "format", "jpeg", "-s", "formatOptions", JPEG_QUALITY, "--resampleWidth", str(MAX_WIDTH),
                 str(PUBLIC / item.source), "--out", str(PUBLIC / item.target))
    source_w, _ = jpeg_size(PUBLIC / OG_SOURCE)
    crop_h = round(source_w * OG_SIZE[1] / OG_SIZE[0])
    run_sips("-s", "format", "jpeg", "-s", "formatOptions", JPEG_QUALITY, "--cropToHeightWidth", str(crop_h), str(source_w),
             str(PUBLIC / OG_SOURCE), "--out", str(PUBLIC / OG_TARGET))
    run_sips("--resampleHeightWidth", str(OG_SIZE[1]), str(OG_SIZE[0]), str(PUBLIC / OG_TARGET))


def problems() -> list[str]:
    found = []
    for item in HOMEPAGE_DERIVATIVES:
        target = PUBLIC / item.target
        if not target.is_file():
            found.append(f"missing {item.target}")
            continue
        src_w, src_h = png_size(PUBLIC / item.source)
        out_w, out_h = jpeg_size(target)
        if target.stat().st_size >= MAX_DERIVATIVE_BYTES:
            found.append(f"{item.target} is {target.stat().st_size} bytes")
        if out_w > MAX_WIDTH or abs(out_w / out_h - src_w / src_h) > (src_w / src_h) * 0.01:
            found.append(f"{item.target} is {out_w}x{out_h}, source {src_w}x{src_h}")
    og = PUBLIC / OG_TARGET
    if not og.is_file() or jpeg_size(og) != OG_SIZE or og.stat().st_size >= MAX_OG_BYTES:
        found.append(f"{OG_TARGET} must be a {OG_SIZE[0]}x{OG_SIZE[1]} JPEG under {MAX_OG_BYTES} bytes")
    return found


def main() -> int:
    if "--check" not in sys.argv:
        generate()
    issues = problems()
    for issue in issues:
        print(issue)
    return 1 if issues else 0


if __name__ == "__main__":
    sys.exit(main())
