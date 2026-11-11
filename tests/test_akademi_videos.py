"""Akademi videos: Turkish 'Hello Allplan! 2024' clips are placed as supporting material
and every lesson video loads only through the consent-aware embed."""

from pathlib import Path
import json
import unittest


ROOT = Path(__file__).resolve().parents[1]
NOCOOKIE = "https://www.youtube-nocookie.com/embed/"


def read(path: str) -> str:
    return (ROOT / path).read_text(encoding="utf-8")


def module_videos():
    for path in sorted((ROOT / "src/data/akademi-content").glob("M*.json")):
        found = []

        def walk(node):
            if isinstance(node, dict):
                if isinstance(node.get("video"), dict):
                    found.append(node["video"])
                for value in node.values():
                    walk(value)
            elif isinstance(node, list):
                for value in node:
                    walk(value)

        walk(json.loads(path.read_text(encoding="utf-8")))
        yield path.name, found


class AkademiVideoTests(unittest.TestCase):
    def test_lesson_video_components_use_consent_embed(self):
        for path in ("src/components/akademi/kit/LessonVideo.tsx", "src/components/sections/TmLessonDetail.tsx"):
            with self.subTest(file=path):
                src = read(path)
                self.assertIn("ConsentEmbed", src)
                self.assertNotIn("<iframe", src)

    def test_module_video_slots_hold_a_nocookie_youtube_url(self):
        for name, videos in module_videos():
            for video in videos:
                with self.subTest(module=name, title=video.get("title")):
                    self.assertFalse(video.get("placeholder", False))
                    self.assertTrue(video.get("url", "").startswith(NOCOOKIE))

    def test_interface_lesson_offers_the_turkish_interface_and_palette_videos(self):
        lesson = json.loads(read("src/data/temel-modelleme/03.json"))
        ids = {v.get("youtubeId") for v in lesson["media"]["videos"]}
        self.assertTrue({"oPceAhBaKYs", "kfvKZmgZzvc"} <= ids)

    def test_every_placed_video_is_listed_in_the_video_map(self):
        doc = read("docs/akademi/hello-allplan-video-map.md")
        for path in (ROOT / "src/data").glob("*/[0-9][0-9].json"):
            for video in json.loads(path.read_text(encoding="utf-8"))["media"]["videos"]:
                if video.get("note", "").startswith("Türkçe"):
                    with self.subTest(file=path.name, video=video["youtubeId"]):
                        self.assertIn(video["youtubeId"], doc)


if __name__ == "__main__":
    unittest.main()
