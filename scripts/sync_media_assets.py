#!/usr/bin/env python3
"""
Read-only media & video asset synchronizer for Aluplan 2027.
Reads verified assets from read-only ../aluplan-2026 (without ever writing to or modifying ../aluplan-2026)
and copies them into aluplan-2027/public/ so all 503+ live images, 8 MP4 videos, and partner/product visuals are served locally.
"""

import json
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SOURCE_ROOT = ROOT.parent / "aluplan-2026"
PUBLIC_DIR = ROOT / "public"
MEDIA_COMPLETE_PATH = ROOT / "docs/00-inventory/media-complete-2026-10-22.json"

MEDIA_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".svg", ".gif", ".mp4", ".ico"}


def main():
    if not SOURCE_ROOT.exists():
        raise SystemExit(f"Read-only source directory not found: {SOURCE_ROOT}")

    mc = json.loads(MEDIA_COMPLETE_PATH.read_text(encoding="utf-8"))
    copied_count = 0
    total_bytes = 0

    for asset in mc["root_assets"]:
        rel_path = asset["path"]
        ext = Path(rel_path).suffix.lower()
        if ext not in MEDIA_EXTENSIONS:
            continue

        # Only copy from public/, assets/, and src/assets/ (never from archive/untracked folders)
        if rel_path.startswith("public/"):
            dest_rel = rel_path[len("public/") :]
        elif rel_path.startswith("src/assets/"):
            dest_rel = rel_path[len("src/") :]
        elif rel_path.startswith("assets/"):
            dest_rel = rel_path
        else:
            continue

        src_file = SOURCE_ROOT / rel_path
        dest_file = PUBLIC_DIR / dest_rel
        if not src_file.is_file():
            continue

        dest_file.parent.mkdir(parents=True, exist_ok=True)
        if not dest_file.exists() or dest_file.stat().st_size != src_file.stat().st_size:
            shutil.copy2(src_file, dest_file)
        copied_count += 1
        total_bytes += dest_file.stat().st_size

    print(f"Synchronized {copied_count} media/video files ({total_bytes / (1024 * 1024):.2f} MB) into {PUBLIC_DIR}")


if __name__ == "__main__":
    main()
