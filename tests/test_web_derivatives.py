"""Homepage imagery and the default share image are served as small JPEG derivatives."""

from pathlib import Path
import struct
import subprocess
import unittest


ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public"
MAX_DERIVATIVE_BYTES = 450_000
MAX_OG_BYTES = 300_000
DERIVATIVES = [
    *(f"assets/previews/solutions/{name}" for name in ("building", "infrastructure", "construction", "addons", "other")),
    *(f"assets/previews/workflow/{name}" for name in ("architecture", "engineering", "precast")),
]
OG_IMAGE = "opengraph-image.jpg"


def png_size(path: Path) -> tuple[int, int]:
    with path.open("rb") as handle:
        header = handle.read(24)
    return struct.unpack(">II", header[16:24])


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


class WebDerivativeTests(unittest.TestCase):
    def test_homepage_references_web_derivatives(self):
        source = (ROOT / "src/components/sections/HomepageView.tsx").read_text(encoding="utf-8")
        self.assertNotIn("-original.png", source)
        for name in DERIVATIVES:
            self.assertIn(f"/{name}-web.jpg", source)

    def test_derivatives_are_small_jpegs(self):
        for name in DERIVATIVES:
            path = PUBLIC / f"{name}-web.jpg"
            with self.subTest(path=name):
                self.assertTrue(path.is_file())
                self.assertEqual(path.read_bytes()[:3], b"\xff\xd8\xff")
                self.assertLess(path.stat().st_size, MAX_DERIVATIVE_BYTES)

    def test_aspect_ratio_preserved(self):
        for name in DERIVATIVES:
            src_w, src_h = png_size(PUBLIC / f"{name}-original.png")
            out_w, out_h = jpeg_size(PUBLIC / f"{name}-web.jpg")
            with self.subTest(path=name):
                self.assertLessEqual(out_w, 1200)
                self.assertAlmostEqual(out_w / out_h, src_w / src_h, delta=(src_w / src_h) * 0.01)

    def test_default_share_image_is_1200x630_jpeg(self):
        path = PUBLIC / OG_IMAGE
        self.assertTrue(path.is_file())
        self.assertEqual(jpeg_size(path), (1200, 630))
        self.assertLess(path.stat().st_size, MAX_OG_BYTES)

    def test_metadata_uses_jpeg_share_image(self):
        for source in ("src/lib/metadata.ts", "src/lib/release-2027-routes.ts"):
            text = (ROOT / source).read_text(encoding="utf-8")
            with self.subTest(source=source):
                self.assertIn("/opengraph-image.jpg", text)
                self.assertNotIn("/opengraph-image.png", text)

    def test_derivative_script_check_passes(self):
        result = subprocess.run(
            ["python3", "scripts/build_web_derivatives.py", "--check"], cwd=ROOT, capture_output=True, text=True
        )
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)


if __name__ == "__main__":
    unittest.main()
