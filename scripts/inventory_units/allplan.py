"""ALLPLAN core pages: product page, the four editions, Bimplus."""

from __future__ import annotations

from .core import Page, Unit, ref, shared_unit

ED = "allplan--new-text-and-images-allplan-edition-pages"
HOME = "allplan--allplan-home-page-slide"
BIMPLUS = "allplan--new-text-bimplus-page"

PAGES = [
    Page(
        slug="allplan-home",
        title="ALLPLAN ürün sayfası",
        routes=("/products/allplan",),
        summary=(
            "2027 lansmanının ana ALLPLAN sayfası. Kaynak iki dosyaya bölünmüş: "
            "ana sayfa slaytı (hero) ve edition sayfaları dosyasının ürün sayfası "
            "bölümü (yenilikler paragrafı)."
        ),
        open_questions=(
            "`/products/allplan` sayfasındaki mevcut ALLPLAN platform anlatımı korunacak mı, "
            "yoksa 2027 hero metniyle mi değiştirilecek?",
        ),
    ),
    Page(
        slug="allplan-editions",
        title="ALLPLAN sürüm sayfaları (Basic / Concept / Professional / Ultimate)",
        routes=(
            "/products/allplan-basic",
            "/products/allplan-concept",
            "/products/allplan-professional",
            "/products/allplan-ultimate",
        ),
        summary=(
            "Dört sürümün her biri aynı şablonu izler: giriş paragrafı, `VERSION 2027` "
            "üst etiketi, bölüm başlığı ve üç yenilik metni. Aynı metin birden fazla "
            "sürümde geçtiğinde tek satır tanımlanır ve sürümler ona referans verir."
        ),
        open_questions=(
            "Özellik görselleri kaynakta boş (`FEATURE n IMAGE`); hangi ekran görüntüsü "
            "hangi özelliğe gidecek?",
            "Allplan Max her sürümde ilk yenilik olarak tekrarlanıyor; Max'in kendi "
            "sayfası açılırsa buradaki tekrar korunacak mı?",
        ),
    ),
    Page(
        slug="allplan-bimplus",
        title="BIMPLUS sayfası",
        routes=("/products/allplan-bimplus",),
        summary=(
            "Kaynak, BIMPLUS sayfasının hero altındaki ilk bölümünde mevcut madde "
            "işaretlerinin **değiştirilmesini** söyleyen bir talimat içeriyor. "
            "Aşağıdaki üç madde o değişikliğin metnidir."
        ),
        open_questions=(
            "Değiştirilecek mevcut maddeler hangileri? Kaynak yalnızca yeni metni veriyor.",
        ),
    ),
]

SHARED = {
    # --- edition feature texts, reused across editions ---------------------- #
    "allplan.max-feature": shared_unit(
        "allplan.max-feature",
        "feature-body",
        ED,
        "b18",
        "Allplan Max, mühendislere Allplan'ı ekiplerinin gerçekten çalıştığı biçime göre "
        "özelleştirme konusunda daha fazla güç ve özgürlük verir; yapay zekâ rehberliğinden "
        "otomatik iş akışlarına ve proje içgörüsüne kadar.",
    ),
    "allplan.tooltips": shared_unit(
        "allplan.tooltips",
        "feature-body",
        ED,
        "b21",
        "BIM'e hazır ipuçları, önemli nesne bilgilerini fareyle üzerine gelindiğinde göstererek "
        "ekiplerin model verisini daha hızlı denetlemesine ve karmaşık BIM projelerinde kontrolü "
        "elde tutmasına yardımcı olur.",
    ),
    "allplan.mark-numbering": shared_unit(
        "allplan.mark-numbering",
        "feature-body",
        ED,
        "b24",
        "Mark Numbering 2.0, modeller değiştikçe tanımlayıcıların tutarlı kalmasını sağlar; "
        "metrajların, listelerin ve dokümantasyonun daha az elle yeniden numaralandırmayla "
        "uyumlu kalmasına yardımcı olur.",
    ),
    "allplan.cloud-bim-manager": shared_unit(
        "allplan.cloud-bim-manager",
        "feature-body",
        ED,
        "b40",
        "Cloud BIM Manager, ekiplerin BIM verilerini ve metrajlarını incelemesine, filtrelemesine, "
        "düzenlemesine ve değerlendirmesine yardımcı olur; model bilgisini kullanılabilir proje "
        "içgörüsüne dönüştürür.",
    ),
    "allplan.reinforcement-feature": shared_unit(
        "allplan.reinforcement-feature",
        "feature-body",
        ED,
        "b59",
        "Donatı iş akışının daha büyük bölümünü otomatikleştirin: daha akıllı düzenleme, daha "
        "güçlü kiriş ve duvar donatısı, yapay zekâ destekli etiket yerleştirme ve gruplanmış "
        "çakışma yönetimi.",
    ),
    "allplan.cloud-mark": shared_unit(
        "allplan.cloud-mark",
        "feature-body",
        ED,
        "b62",
        "Cloud BIM Manager ve Mark Numbering 2.0, ekiplerin BIM verilerini, metrajlarını ve "
        "dokümantasyonunu daha yüksek hız, tutarlılık ve güvenle yönetmesine yardımcı olur.",
    ),
}

UNITS = [
    # ------------------------------------------------------------------ home
    Unit(
        id="allplan.home.hero.title",
        page="allplan-home",
        role="hero-title",
        source=HOME,
        block="b4",
        tr="Gücü ve kontrolü mühendislerin eline vermek",
    ),
    Unit(
        id="allplan.home.hero.body",
        page="allplan-home",
        role="hero-body",
        source=HOME,
        block="b6",
        tr="Allplan 2027, mühendislik ekiplerine daha fazlasını sunuyor: yapay zekâ ile kontrol "
        "ve özelleştirme, güçlü donatı detaylandırma ve sorunsuz teslim için esnek BIM araçları.",
    ),
    Unit(
        id="allplan.home.whats-new",
        page="allplan-home",
        role="whats-new",
        source=ED,
        block="b6",
        tr="Allplan 2027, mühendislik ekiplerine daha fazla kontrol veriyor. Yapay zekâ, firmaların "
        "Allplan'ı kendi iş akışlarına göre özelleştirmesini ve tekrarlayan görevleri "
        "otomatikleştirmesini sağlıyor. Yeni BIM iş akışları, ekiplerin proje verisini daha yüksek "
        "hız, tutarlılık ve güvenle yönetmesine yardımcı oluyor.",
    ),
    # -------------------------------------------------------------- editions
    # Allplan Basic
    Unit(
        id="allplan.basic.intro",
        page="allplan-editions",
        role="intro",
        source=ED,
        block="b11",
        tr="Allplan Basic, güvenilir 2B çizime, temel 3B modellemeye ve bulut tabanlı iş birliğine "
        "ihtiyaç duyan ekipler için giriş seviyesi CAD çözümüdür. Çizim oluşturmak, teslim "
        "dokümanları üretmek ve proje verisini verimli biçimde paylaşmak için temel araçları sunar. "
        "İleri düzey mimari BIM iş akışları, kaliteli metrajlar ve parametrik yapı bileşenleri için "
        "Allplan Concept veya üst sürümlerini inceleyin.",
    ),
    Unit(id="allplan.basic.eyebrow", page="allplan-editions", role="eyebrow", source=ED, block="b14",
         tr="SÜRÜM 2027"),
    Unit(id="allplan.basic.section-title", page="allplan-editions", role="section-title", source=ED,
         block="b16", tr="Allplan Basic'teki Yenilikler"),
    ref("allplan.basic.feature-1", "allplan-editions", "feature-body", "allplan.max-feature"),
    ref("allplan.basic.feature-2", "allplan-editions", "feature-body", "allplan.tooltips"),
    ref("allplan.basic.feature-3", "allplan-editions", "feature-body", "allplan.mark-numbering"),
    # Allplan Concept
    Unit(
        id="allplan.concept.intro",
        page="allplan-editions",
        role="intro",
        source=ED,
        block="b30",
        tr="Allplan Concept, erken tasarımdan teslimata kadar güvenilir modelleme, görselleştirme ve "
        "dokümantasyona ihtiyaç duyan mimari ekipler için bir BIM çözümüdür. Binalar için eksiksiz "
        "mimari tasarım sürecini destekler; sezgisel BIM iş akışlarını, doğru metrajları ve yüksek "
        "kaliteli dokümantasyonu tek bir entegre platformda birleştirir.",
    ),
    Unit(id="allplan.concept.eyebrow", page="allplan-editions", role="eyebrow", source=ED, block="b33",
         tr="SÜRÜM 2027"),
    Unit(id="allplan.concept.section-title", page="allplan-editions", role="section-title", source=ED,
         block="b35", tr="Allplan Concept'teki Yenilikler"),
    ref("allplan.concept.feature-1", "allplan-editions", "feature-body", "allplan.max-feature"),
    ref("allplan.concept.feature-2", "allplan-editions", "feature-body", "allplan.cloud-bim-manager"),
    ref("allplan.concept.feature-3", "allplan-editions", "feature-body", "allplan.mark-numbering"),
    # Allplan Professional
    Unit(
        id="allplan.professional.intro",
        page="allplan-editions",
        role="intro",
        source=ED,
        block="b49",
        tr="Allplan Professional, yüksek performanslı modelleme, detaylandırma ve otomasyona ihtiyaç "
        "duyan mimari ve mühendislik ekipleri için güçlü bir BIM çözümüdür. Binalar, yollar ve "
        "altyapı yapıları için eksiksiz tasarım ve detaylandırma sürecini destekler; hassasiyeti, "
        "hızı ve esnekliği tek bir entegre platformda birleştirir.",
    ),
    Unit(id="allplan.professional.eyebrow", page="allplan-editions", role="eyebrow", source=ED,
         block="b52", tr="SÜRÜM 2027"),
    Unit(id="allplan.professional.section-title", page="allplan-editions", role="section-title",
         source=ED, block="b54", tr="Allplan Professional'daki Yenilikler"),
    ref("allplan.professional.feature-1", "allplan-editions", "feature-body", "allplan.max-feature"),
    ref("allplan.professional.feature-2", "allplan-editions", "feature-body",
        "allplan.reinforcement-feature"),
    ref("allplan.professional.feature-3", "allplan-editions", "feature-body", "allplan.cloud-mark"),
    # Allplan Ultimate
    Unit(
        id="allplan.ultimate.intro",
        page="allplan-editions",
        role="intro",
        source=ED,
        block="b68",
        tr="Allplan Ultimate, tasarımdan inşaya uzanan uçtan uca iş akışları için nihai BIM "
        "çözümüdür. Ekiplerin karmaşık bina ve altyapı projelerini tasarlamasını, detaylandırmasını "
        "ve teslim etmesini; ileri modelleme, ön üretim ve inşaat iş akışlarını birleştiren tek bir "
        "entegre platformda mümkün kılar.",
    ),
    Unit(id="allplan.ultimate.eyebrow", page="allplan-editions", role="eyebrow", source=ED, block="b71",
         tr="SÜRÜM 2027"),
    Unit(id="allplan.ultimate.section-title", page="allplan-editions", role="section-title", source=ED,
         block="b73", tr="Allplan Ultimate'teki Yenilikler"),
    ref("allplan.ultimate.feature-1", "allplan-editions", "feature-body", "allplan.max-feature"),
    ref("allplan.ultimate.feature-2", "allplan-editions", "feature-body",
        "allplan.reinforcement-feature"),
    ref("allplan.ultimate.feature-3", "allplan-editions", "feature-body", "allplan.cloud-mark"),
    # --------------------------------------------------------------- bimplus
    Unit(
        id="bimplus.new.label",
        page="allplan-bimplus",
        role="section-subtitle",
        source=BIMPLUS,
        block="b4",
        tr="2027'de Yeni:",
        note="Kaynak, bu metnin mevcut madde işaretlerinin yerine geçmesini istiyor.",
    ),
    Unit(
        id="bimplus.new.bcf",
        page="allplan-bimplus",
        role="bullet",
        source=BIMPLUS,
        block="b5",
        tr="BCF 3.0 alışverişi: Daha akıcı koordinasyon ve daha güçlü birlikte çalışabilirlik için "
        "sorunları içe ve dışa aktarın.",
    ),
    Unit(
        id="bimplus.new.reviews",
        page="allplan-bimplus",
        role="bullet",
        source=BIMPLUS,
        block="b6",
        tr="Odaklı model incelemeleri: Kaplamaları kırpın ve 2B çizimleri 3B modellerle hizalayın. "
        "Ortografik görünümleri sorunlarda, sahnelerde ve slayt gösterilerinde kaydedin.",
    ),
    Unit(
        id="bimplus.new.excel",
        page="allplan-bimplus",
        role="bullet",
        source=BIMPLUS,
        block="b7",
        tr="Excel destekli BIM verisi: Seçili nesneleri dinamik olarak inceleyin ve içe aktarma "
        "sırasında eksik temel metrajları otomatik hesaplayın.",
    ),
]
