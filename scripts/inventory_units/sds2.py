"""SDS2 — ana sayfa ve 2027 yenilikleri."""

from __future__ import annotations

from .core import Page, Unit

HOME = "sds2--2027-home-page-information"
FEATURES = "sds2--new-text-and-images-sds2-page"

PAGES = [
    Page(
        slug="sds2",
        title="SDS2 sayfası",
        routes=("/products/sds2-home", "/solutions/steel"),
        summary=(
            "SDS2 2027'nin üç yeniliği (AI BIM Analyst, Model Synced Erection Drawings, "
            "Advanced Connection Group Reporting) ve ana banner metni. Kaynaktaki proje adı ve "
            "firma bilgisi maskelendi; görsel seçimi ayrı karar."
        ),
        open_questions=(
            "Ana banner görseli (`Keyvisual2027_RelatedContent_SDS2.jpg`) kullanılacak mı; "
            "kaynakta adı ve firması maskelenmiş referans nasıl gösterilecek?",
            "\"5× faster\" ve \"20–50%\" iddialarının Türkiye'de yayımlanma izni var mı?",
        ),
    ),
]

SHARED: dict[str, Unit] = {}

UNITS = [
    Unit(
        id="sds2.home.title",
        page="sds2",
        role="hero-title",
        source=HOME,
        block="b3",
        tr="Zaman Kazanın, Daha Fazla İş Yapın",
        note="Kaynak satırı `Title: …` biçiminde; EN hücresinde önek korunur, yayında yalnızca "
             "başlığın kendisi kullanılır.",
    ),
    Unit(
        id="sds2.home.sentence-form",
        page="sds2",
        role="note",
        source=HOME,
        block="b4",
        tr="Zaman kazan ve daha fazla iş yap",
        note="Kaynak, headline için alternatif tümce biçimini tutuyor; tasarım seçer.",
    ),
    Unit(
        id="sds2.home.body",
        page="sds2",
        role="hero-body",
        source=HOME,
        block="b5",
        tr="SDS2 2027, ekibinize her iş akışında üretkenliği artıran, zaman kazandıran ve elle "
        "yapılan işi azaltan güçlü araçlar verir.",
    ),
    Unit(id="sds2.features.eyebrow", page="sds2", role="eyebrow", source=FEATURES, block="b5",
         tr="SÜRÜM 2027"),
    Unit(id="sds2.features.section-title", page="sds2", role="section-title", source=FEATURES,
         block="b7", tr="SDS2'deki Yenilikler"),
    Unit(id="sds2.features.feature-1.title", page="sds2", role="feature-title", source=FEATURES,
         block="b9", tr="AI BIM Analyst"),
    Unit(
        id="sds2.features.feature-1.body",
        page="sds2",
        role="feature-body",
        source=FEATURES,
        block="b10",
        tr="Doğal dil istemleriyle model bilgilerini bulur, nesneleri seçer ve raporlar oluşturur. "
        "Proje bilgisine erişimde ve raporlamada 5 kata kadar daha hızlı sonuç; ekibiniz daha "
        "verimli çalışır.",
        note="\"5×\" iddiası; yayın izni gerekiyor.",
    ),
    Unit(id="sds2.features.feature-2.title", page="sds2", role="feature-title", source=FEATURES,
         block="b14", tr="Model ile Senkronize Montaj Çizimleri"),
    Unit(
        id="sds2.features.feature-2.body",
        page="sds2",
        role="feature-body",
        source=FEATURES,
        block="b15",
        tr="Montaj çizimlerini yeniden üretim gerektirmeden model değişiklikleriyle uyumlu tutun. "
        "Çizim temizleme süresinin Tahmini %20–50'sinden tasarruf edin ve tamamlanmış çizim işini "
        "koruyun.",
        note="\"20–50%\" aralığı; yayın izni gerekiyor.",
    ),
    Unit(id="sds2.features.feature-3.title", page="sds2", role="feature-title", source=FEATURES,
         block="b19", tr="Gelişmiş Bağlantı Grubu Raporlaması"),
    Unit(
        id="sds2.features.feature-3.body",
        page="sds2",
        role="feature-body",
        source=FEATURES,
        block="b20",
        tr="Tasarım paketi incelemeleri sırasında mühendislere ilgili bağlantıların proje "
        "genelindeki net görünümünü sunar. Ayrıntılı Excel raporları, bağlantı tasarım paketlerini "
        "verimli biçimde incelemeyi kolaylaştırır; zaman kazandırır ve proje maliyetlerinin "
        "düşmesine yardımcı olur.",
    ),
]
