"""Akademi content protection: lesson screenshots carry a visible source watermark, images
are not draggable / saveable via the context menu (text stays copyable), and pages show a
copyright notice."""

from pathlib import Path
import subprocess
import unittest


ROOT = Path(__file__).resolve().parents[1]


def read(path: str) -> str:
    return (ROOT / path).read_text(encoding="utf-8")


class AkademiContentProtectionTests(unittest.TestCase):
    def test_every_lesson_image_is_watermarked(self):
        # The manifest records the sha256 of each watermarked file; --check fails on any new,
        # replaced or unprocessed image under public/akademi.
        result = subprocess.run(["node", "scripts/watermark_akademi_images.mjs", "--check"], cwd=ROOT)
        self.assertEqual(result.returncode, 0)

    def test_lesson_images_are_not_draggable_or_context_saveable(self):
        src = read("src/components/akademi/kit/LessonImage.tsx")
        self.assertIn("draggable={false}", src)
        self.assertIn("onContextMenu", src)

    def test_text_stays_copyable(self):
        # Students copy command names and formulas into ALLPLAN: no global copy/selection block.
        for path in ("src/components/akademi/AkademiShell.tsx", "src/components/sections/TmLessonDetail.tsx",
                     "src/components/akademi/kit/LessonImage.module.css"):
            with self.subTest(file=path):
                src = read(path)
                self.assertNotIn("user-select:none", src.replace(" ", ""))
                self.assertNotIn("onCopy", src)

    def test_footer_carries_copyright_notice(self):
        src = read("src/components/akademi/AkademiFooter.tsx")
        self.assertIn("© ", src)
        self.assertIn("izinsiz çoğaltılamaz", src)


if __name__ == "__main__":
    unittest.main()
