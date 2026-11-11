"""Lesson files (ALLPLAN GmbH PDFs and sample projects) are not offered until publishing
rights are cleared, but every file stays mapped to its lessons and archive source."""

from pathlib import Path
import json
import unittest


ROOT = Path(__file__).resolve().parents[1]
MAP = ROOT / "docs/akademi/ders-dosyalari-haritasi.md"


def read(path: str) -> str:
    return (ROOT / path).read_text(encoding="utf-8")


class LessonFilesTests(unittest.TestCase):
    def test_overview_does_not_promise_lesson_files(self):
        self.assertNotIn("Ders dosyaları", read("src/data/akademi-content.ts"))

    def test_lesson_page_does_not_list_unlinked_files(self):
        src = read("src/components/sections/TmLessonDetail.tsx")
        self.assertNotIn("tm-indir", src)
        self.assertNotIn("lesson.media.pdfs", src)

    def test_every_lesson_file_is_in_the_file_map(self):
        doc = MAP.read_text(encoding="utf-8")
        for path in (ROOT / "src/data").glob("*/[0-9][0-9].json"):
            media = json.loads(path.read_text(encoding="utf-8")).get("media", {})
            for name in [*media.get("pdfs", []), *media.get("samples", [])]:
                with self.subTest(lesson=str(path.relative_to(ROOT)), file=name):
                    self.assertIn(name, doc)


if __name__ == "__main__":
    unittest.main()
