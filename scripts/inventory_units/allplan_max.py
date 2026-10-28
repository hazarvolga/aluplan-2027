"""Allplan Max — AI features bundled with every 2027 product."""

from __future__ import annotations

from .core import Page, Unit, ref, shared_unit

SRC = "allplan-max--allplan-max-web-page"
SLIDE = "allplan-max--allplan-max-home-page-slide-copy"

PAGES = [
    Page(
        slug="allplan-max",
        title="Allplan Max sayfası (yeni)",
        routes=("/products/allplan-max",),
        summary=(
            "Allplan Max ayrı bir sürüm değil: her 2027 ürününe dahil olan yapay zekâ özellikleri "
            "seti. Sayfa üç mesaj sütunu ve dokuz özellikten oluşuyor. Mevcut bilgi mimarisinde "
            "rota yok; Max bugün yalnızca sürüm sayfalarında tek bir yenilik olarak geçiyor."
        ),
        open_questions=(
            "Allplan Max kendi sayfasını alacak mı, yoksa her sürüm sayfasında bir bölüm olarak mı "
            "kalacak? Kaynak iki seçeneği de destekliyor.",
            "Kaynaktaki dokuz özellik görseli `XXXXX` yer tutucusu; hangi görseller kullanılacak?",
            "Sayfadaki üç anket iddiası (%18, %21, %24) Türkiye'de yayımlanabilir mi?",
        ),
    ),
]

SHARED = {
    "max.stat-label": shared_unit(
        "max.stat-label", "note", SRC, "b26", "Erken Kullanıcı Anket Sonuçları:"
    ),
}

# Tablo satırları: (satır no, ad, açıklama çevirisi)
FEATURES = [
    (
        1,
        "Feature Builder (MCP)",
        "Her firmanın iş akışı farklıdır, dolayısıyla her firmanın özelleştirilmiş ürün "
        "özelliklerine ihtiyacı vardır. Allplan'ı nasıl değiştirmek istediğinizi yapay zekâya "
        "anlatın, gerçeğe dönüştüren tak-çalıştır kodunu alın. Allplan'a dahildir",
    ),
    (
        2,
        "Workflow Builder (MCP)",
        "En üst düzey iş akışı kontrolü için Allplan'ı firmanızın hâlihazırda kullandığı yapay zekâ "
        "araçlarına bağlayın. Ajan tabanlı otomasyonlar kurun, yeni ürün entegrasyonları geliştirin "
        "ve proje bilgilerini alın. Allplan'a dahildir",
    ),
    (
        3,
        "AI Formula Writer",
        "Modellerinizi özelleştirin. Öznitelikler, etiketler veya nesne verileri arasında istediğiniz "
        "ilişkiyi tarif edin, anında bir Allplan formülü alın. Allplan'a dahildir",
    ),
    (
        4,
        "AI BIM Analyst",
        "Model sizin, dolayısıyla sorularınızı ona sorabilmelisiniz. Nesneleri bulun, öznitelikleri "
        "denetleyin, metraj hesaplayın ve özel tablolar veya raporlar oluşturun. Allplan ve SDS2'ye "
        "dahildir",
    ),
    (
        5,
        "AI Structural Analyst",
        "Özel gereksinimlerinize göre hazırlanmış bir mühendislik raporu alın. Yazmaya daha az, "
        "incelemeye ve karar vermeye daha çok zaman ayırın. SCIA ve FRILO'ya dahildir",
    ),
    (
        6,
        "AI Drafter",
        "BIM modellerinden üretilen 2B çizimlerde üst üste binen açıklamaları ve etiketleri otomatik "
        "olarak taşıyın. Son sürümün kontrolü sizde kalır, ancak yapay zekâ süreyi yarıya indirir. "
        "Allplan ve SDS2'ye dahildir",
    ),
    (
        7,
        "AI BIM Modeler",
        "[Beta] Dakikalar içinde ilk taslak BIM modeli oluşturun ve son sürümü hazırlamak için "
        "gereken süreyi azaltın. Allplan'a dahildir",
    ),
    (
        8,
        "AI Visualizer",
        "Bir eskizi, fotoğrafı veya basit 3B modeli etkileyici bir görsele dönüştürün. Müşteri "
        "değişiklik mi istedi? Hemen teslim edin. Allplan'a dahildir.",
    ),
    (
        9,
        "AI Coach",
        "İşlevler, özellikler ve iş akışları için en iyi uygulamalar hakkında anında yanıt ve tavsiye "
        "alın. Daha hızlı oryantasyon. Anında destek. Tüm ürünlere dahildir",
    ),
]

UNITS = [
    Unit(id="max.hero.product", page="allplan-max", role="hero-title", source=SRC, block="b6",
         tr="Allplan Max"),
    Unit(id="max.hero.headline", page="allplan-max", role="hero-subtitle", source=SRC, block="b8",
         tr="Mühendisler için yapay zekâ."),
    Unit(
        id="max.hero.body",
        page="allplan-max",
        role="hero-body",
        source=SRC,
        block="b10",
        tr="Allplan Max, güçlü yapay zekâ araçlarını sizin kontrolünüze verir. Bir eklenti ya da "
        "ayrı bir paket değildir. Her 2027 ürününe dahildir.",
    ),
    Unit(id="max.slide.headline", page="allplan-max", role="hero-subtitle", source=SLIDE, block="b4",
         tr="Mühendisler için yapay zekâ. Sadece otomatikleştirmeyin. Yenilik üretin.",
         note="Alternatif ana sayfa slaytı; kaynakta ana görsel henüz seçilmemiş."),
    Unit(id="max.slide.body", page="allplan-max", role="hero-body", source=SLIDE, block="b6",
         tr="Allplan Max, yapay zekâ araçlarını her çözüme entegre eder. Firmalar kendi iş "
         "akışlarını tasarlama, özel özellikler geliştirme, tekrarlayan işleri otomatikleştirme ve "
         "her soruya anında yanıt alma özgürlüğüne kavuşur."),
    # ------------------------------------------------------- detail section
    Unit(id="max.detail.headline", page="allplan-max", role="section-title", source=SRC, block="b13",
         tr="Allplan Max: kontrolü size veren yapay zekâ."),
    Unit(
        id="max.detail.body",
        page="allplan-max",
        role="section-subtitle",
        source=SRC,
        block="b15",
        tr="Ekipleriniz zaten iyi projeler tasarlamayı, analiz etmeyi ve teslim etmeyi biliyor. "
        "Allplan Max ile kendi iş akışlarınızı tasarlama, özel özellikler geliştirme, tekrarlayan "
        "işleri otomatikleştirme ve her soruya anında yanıt alma özgürlüğüne sahip olursunuz.",
    ),
    Unit(id="max.detail.list-title", page="allplan-max", role="group", source=SRC, block="b16",
         tr="Herkes için yapay zekâ"),
    Unit(
        id="max.detail.bullet-1",
        page="allplan-max",
        role="bullet",
        source=SRC,
        block="b17",
        tr="Yazılımınıza dahil: Allplan Max her 2027 ürünüyle birlikte gelir. Ekstra bir kayıt "
        "yapmanız gerekmez.",
    ),
    Unit(
        id="max.detail.bullet-2",
        page="allplan-max",
        role="bullet",
        source=SRC,
        block="b18",
        tr="2026'da sınırsız kullanım: Aylık token sınırını dert etmeden yapay zekâyı denemeyi ve "
        "sizin için en iyi çalışma biçimlerini bulmayı hak ediyorsunuz.",
        note="Kaynak 2026 yılından söz ediyor; 2027 lansmanı için yıl teyidi gerekiyor.",
    ),
    # ------------------------------------------------------------- pillar 1
    Unit(id="max.pillar-1.heading", page="allplan-max", role="benefit-title", source=SRC,
         block="b22", tr="Yapay zekâyı sizin için çalıştırın."),
    Unit(
        id="max.pillar-1.body",
        page="allplan-max",
        role="benefit-body",
        source=SRC,
        block="b24",
        tr="İş akışlarınız rekabet avantajınızın bir parçasıdır. Allplan Max, ekiplerinize yazılımı "
        "çalışma biçiminize uyarlama gücü verir; tersi değil.",
    ),
    ref("max.pillar-1.stat-label", "allplan-max", "note", "max.stat-label"),
    Unit(id="max.pillar-1.stat", page="allplan-max", role="stat", source=SRC, block="b27",
         tr="Özelleştirilebilirlik sayesinde %18 daha fazla kapasite"),
    # ------------------------------------------------------------- pillar 2
    Unit(id="max.pillar-2.heading", page="allplan-max", role="benefit-title", source=SRC,
         block="b32", tr="Yapay zekâ hızında mühendislik."),
    Unit(
        id="max.pillar-2.body",
        page="allplan-max",
        role="benefit-body",
        source=SRC,
        block="b34",
        tr="Her firma daha fazlasını daha hızlı teslim etme baskısı altında. Allplan Max, model "
        "analizi ve metrajdan çizim temizliğine, raporlamaya, görselleştirmelere ve erken BIM "
        "modellemeye kadar zaman alan, tekrarlayan görevleri otomatikleştirir.",
        note="Kaynakta \"model analysis and quantity takeoffs and model analysis\" ifadesi "
             "tekrarlanıyor; yayın öncesi düzeltilmeli.",
    ),
    ref("max.pillar-2.stat-label", "allplan-max", "note", "max.stat-label"),
    Unit(id="max.pillar-2.stat", page="allplan-max", role="stat", source=SRC, block="b37",
         tr="Yapay zekâ otomasyonu sayesinde %21 hız artışı"),
    # ------------------------------------------------------------- pillar 3
    Unit(id="max.pillar-3.heading", page="allplan-max", role="benefit-title", source=SRC,
         block="b42", tr="7/24 erişilebilen kişisel koç"),
    Unit(
        id="max.pillar-3.body",
        page="allplan-max",
        role="benefit-body",
        source=SRC,
        block="b44",
        tr="İleri düzey kullanıcıların bile ürünle ilgili soruları olur. Ancak kimsenin "
        "dokümantasyonu baştan sona okumaya ya da desteğe başvurmaya zamanı yok. Allplan Max, "
        "uzman ürün bilgisine ve AEC geçmişine sahip bir AI Coach içerir.",
    ),
    ref("max.pillar-3.stat-label", "allplan-max", "note", "max.stat-label"),
    Unit(id="max.pillar-3.stat", page="allplan-max", role="stat", source=SRC, block="b47",
         tr="AI Coach sayesinde %24 verimlilik artışı"),
    # ------------------------------------------------------------- features
    Unit(
        id="max.features.headline",
        page="allplan-max",
        role="section-title",
        source=SRC,
        block="b52",
        tr="Allplan Max'i daha yakından keşfedin. Daha fazlasını kendi yolunuzla yapmanıza yardımcı "
        "olan yapay zekâ.",
    ),
]

for row, name, description in FEATURES:
    UNITS.append(
        Unit(
            id=f"max.features.item-{row:02d}.name",
            page="allplan-max",
            role="feature-title",
            source=SRC,
            block="b54",
            part=f"row:{row}:name",
            tr=name,
        )
    )
    UNITS.append(
        Unit(
            id=f"max.features.item-{row:02d}.body",
            page="allplan-max",
            role="feature-body",
            source=SRC,
            block="b54",
            part=f"row:{row}:desc",
            tr=description,
        )
    )
