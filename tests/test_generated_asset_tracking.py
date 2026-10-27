"""Ensure generated local asset URLs survive a fresh Git checkout."""

import json
from pathlib import Path
import subprocess
import unittest


ROOT = Path(__file__).resolve().parents[1]
GENERATED_DATA = (
    "src/data/pages.json",
    "src/data/homepage.json",
    "src/data/navigation.json",
    "src/data/video-library.json",
    "src/data/playlists.json",
)
LOCAL_ASSET_SUFFIXES = {
    ".avif",
    ".docx",
    ".gif",
    ".jpeg",
    ".jpg",
    ".mp4",
    ".pdf",
    ".png",
    ".svg",
    ".webm",
    ".webp",
}


def string_values(value):
    if isinstance(value, dict):
        for key, item in value.items():
            # Inventory provenance can intentionally preserve a missing legacy URL;
            # only renderable asset fields must resolve in a fresh checkout.
            if key == "sourceImageSrc":
                continue
            yield from string_values(item)
    elif isinstance(value, list):
        for item in value:
            yield from string_values(item)
    elif isinstance(value, str):
        yield value


class GeneratedAssetTrackingTests(unittest.TestCase):
    def test_existing_local_assets_referenced_by_generated_data_are_tracked(self):
        tracked = set(
            subprocess.check_output(
                ["git", "ls-files", "-z", "public"], cwd=ROOT
            )
            .decode()
            .rstrip("\0")
            .split("\0")
        )
        referenced = set()
        for relative in GENERATED_DATA:
            data = json.loads((ROOT / relative).read_text(encoding="utf-8"))
            for value in string_values(data):
                if not value.startswith("/"):
                    continue
                local_path = value.split("?", 1)[0].split("#", 1)[0]
                if Path(local_path).suffix.lower() not in LOCAL_ASSET_SUFFIXES:
                    continue
                referenced.add("public/" + local_path.lstrip("/"))

        absent = sorted(candidate for candidate in referenced if not (ROOT / candidate).is_file())
        missing = sorted(referenced - tracked)
        self.assertEqual(
            absent,
            [],
            "Generated data references missing local files:\n" + "\n".join(absent),
        )
        self.assertEqual(
            missing,
            [],
            "Generated data references local files omitted from Git:\n"
            + "\n".join(missing),
        )


if __name__ == "__main__":
    unittest.main()
