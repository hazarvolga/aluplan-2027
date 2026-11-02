"""ALLPLAN Civil — 2027 yenilikleri ve ana sayfa slaytı."""

from __future__ import annotations

from .core import Page, Unit

SRC = "allplan-civil--new-text-and-images-civil-page"
SLIDE = "allplan-civil--home-page-slides"

PAGES = [
    Page(
        slug="allplan-civil",
        title="ALLPLAN Civil sayfası",
        routes=(
            "/products/civil",
            "/solutions/infrastructure",
            "/solutions/road-railway",
            "/solutions/bridge-design",
        ),
        summary=(
            "Civil 2027'nin ana yeniliği Parametrik Grid. Kaynakta bir de ana sayfa slaytı var; "
            "iki dosya aynı hedef sayfalara akar. Slayt metni \"50% faster\" iddiası taşır ve "
            "yayın iznine bağlıdır."
        ),
        open_questions=(
            "\"Deliver infrastructure projects up to 50% faster\" iddiasının Türkiye'de "
            "yayımlanma izni var mı?",
            "Yenilikler hangi sayfaya gidiyor: `/products/civil`, `/solutions/infrastructure` "
            "yoksa her ikisi mi?",
        ),
    ),
]

SHARED: dict[str, Unit] = {}

UNITS = [
    Unit(id="civil.slide.hero.title", page="allplan-civil", role="hero-title", source=SLIDE,
         block="b3", tr="Altyapı projelerini %50'ye kadar daha hızlı teslim edin",
         note="Sayısal iddia; yayın izni gerekiyor. Kaynak bu metni etiket tipinde tutuyor."),
    Unit(
        id="civil.slide.hero.body",
        page="allplan-civil",
        role="hero-body",
        source=SLIDE,
        block="b4",
        tr="Allplan Civil, parametrik iş akışları, bağlantılı modeller ve yeniden kullanılabilir "
        "şablonlarla karmaşık altyapıyı daha hızlı tasarlamanıza yardımcı olur.",
    ),
    Unit(id="civil.features.eyebrow", page="allplan-civil", role="eyebrow", source=SRC, block="b5",
         tr="SÜRÜM 2027"),
    Unit(id="civil.features.section-title", page="allplan-civil", role="section-title", source=SRC,
         block="b7", tr="Allplan Civil'deki Yenilikler"),
    Unit(
        id="civil.features.intro",
        page="allplan-civil",
        role="whats-new",
        source=SRC,
        block="b9",
        tr="Allplan Civil'in yeni Parametrik Grid'i, tekrarlayan öğeleri ekseniniz boyunca kesin ve "
        "tutarlı aralıklarla yerleştirir. Saatler süren modelleme artık dakikalar alıyor, tasarım "
        "değişiklikleri saniyeler sürüyor.",
    ),
    # Özellik metinleri kaynakta başlık ve gövde tek blokta; head/tail ile bölünür.
    Unit(
        id="civil.features.feature-1.title",
        page="allplan-civil",
        role="feature-title",
        source=SRC,
        block="b11",
        part="head",
        tr="Otomatik Parametrik Eksen Gridi",
    ),
    Unit(
        id="civil.features.feature-1.body",
        page="allplan-civil",
        role="feature-body",
        source=SRC,
        block="b11",
        part="tail",
        tr="Kesitte parametrik eksen gridleri tanımlayın ve hizalama boyunca ekstrüde edin. Öğeler "
        "tam konumlara yakalanır ve tek bir aralık değişikliği tüm yapıyı anında günceller.",
    ),
    Unit(
        id="civil.features.feature-2.title",
        page="allplan-civil",
        role="feature-title",
        source=SRC,
        block="b14",
        part="head",
        tr="Esnek Dağıtım ve İstasyonlama",
    ),
    Unit(
        id="civil.features.feature-2.body",
        page="allplan-civil",
        role="feature-body",
        source=SRC,
        block="b14",
        part="tail",
        tr="Öğeleri tanıdık istasyonlar, ofsetler ve hizalama değerleriyle aralığa veya sayıya göre "
        "dağıtın. Elle hesaplama ya da zaman alan veri hazırlığı olmadan hemen modellemeye başlayın.",
    ),
    Unit(
        id="civil.features.feature-3.title",
        page="allplan-civil",
        role="feature-title",
        source=SRC,
        block="b17",
        part="head",
        tr="Yeniden Kullanılabilir Seri Elemanlar",
    ),
    Unit(
        id="civil.features.feature-3.body",
        page="allplan-civil",
        role="feature-body",
        source=SRC,
        block="b17",
        part="tail",
        tr="Karmaşık bir kafes açıklığını, galeri alanını veya istasyon çatısı modülünü bir kez "
        "oluşturun, ardından akıllı bir seri eleman olarak dağıtın. Saatler süren tekrarlayan "
        "detaylandırmayı dakikalar süren akıllı modellemeye dönüştürün.",
    ),
]
