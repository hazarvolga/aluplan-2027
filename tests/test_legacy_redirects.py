"""Old WordPress-era URLs that Search Console reported as 404 (2026-11-11) redirect permanently
to the closest current page, so their remaining traffic and links are not lost."""

from pathlib import Path
import unittest


ROOT = Path(__file__).resolve().parents[1]
LEGACY = {
    "/add/allplan-lisans-server": "/solutions-v2/connect-license",
    "/download_center/:path*": "/kaynaklar",
    "/index.php": "/",
    "/allplan-ogrenci-versiyonu": "/akademi",
    "/allplan-aec-2024-features": "/products/allplan-2026-yenilikler",
    "/allplan-egitim-videolari-oynatma-listeleri": "/video-kutuphanesi",
    "/wp-sitemap.xml": "/sitemap.xml",
    "/user": "/",
    "/user/:path*": "/",
    "/buildability-2": "/cozumler/insaat-planlamasi",
    "/allplan-structural-engineering-2022": "/solutions/structural",
    "/allplan-bimplus-open-bim-paketler-fiyatlar": "/products/allplan-bimplus",
}


class LegacyRedirectTests(unittest.TestCase):
    def test_every_reported_404_redirects_permanently(self):
        config = (ROOT / "next.config.mjs").read_text(encoding="utf-8")
        for source, destination in LEGACY.items():
            with self.subTest(source=source):
                self.assertIn(f"{{ source: '{source}', destination: '{destination}', statusCode: 301 }}", config)


if __name__ == "__main__":
    unittest.main()
