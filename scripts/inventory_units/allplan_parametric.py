"""ALLPLAN Parametric — new edition page for 2027."""

from __future__ import annotations

from .core import Page, Unit

SRC = "allplan--allplan-parametric-edition-web-page"

PAGES = [
    Page(
        slug="allplan-parametric",
        title="ALLPLAN Parametric sayfası (yeni)",
        routes=("/products/allplan-parametric",),
        summary=(
            "2027'de ayrı bir sürüm olarak çıkan ALLPLAN Parametric, altyapı yapılarının "
            "dört boyutlu parametrik modellenmesine odaklanıyor. Mevcut bilgi mimarisinde "
            "bu ürün için rota yok; sayfa yapısı hero + genel bakış + faydalar + özellikler."
        ),
        open_questions=(
            "`/products/allplan-parametric` rotası onaylanıyor mu, yoksa mevcut "
            "`/solutions/features-allplan-bridge` sayfası mı genişletilecek?",
            "Kaynakta 30 özellik tek sayfaya sığıyor; hepsi yayımlanacak mı, yoksa "
            "sekme/akordeon ile mi bölünecek?",
        ),
    ),
]

SHARED: dict[str, Unit] = {}

FEATURES = [
    # (grup, başlık bloğu, gövde bloğu)
    ("Parametrize", "b34", "b35"),
    ("Parametrize", "b36", "b37"),
    ("Parametrize", "b38", "b39"),
    ("Parametrize", "b40", "b41"),
    ("Parametrize", "b42", "b43"),
    ("Detail", "b45", "b46"),
    ("Detail", "b47", "b48"),
    ("Detail", "b49", "b50"),
    ("Detail", "b51", "b52"),
    ("Detail", "b53", "b54"),
    ("Document", "b56", "b57"),
    ("Document", "b58", "b59"),
    ("Document", "b60", "b61"),
    ("Document", "b62", "b63"),
    ("Document", "b64", "b65"),
    ("Manage", "b67", "b68"),
    ("Manage", "b69", "b70"),
    ("Manage", "b71", "b72"),
    ("Manage", "b73", "b74"),
    ("Manage", "b75", "b76"),
    ("Coordinate", "b78", "b79"),
    ("Coordinate", "b80", "b81"),
    ("Coordinate", "b82", "b83"),
    ("Coordinate", "b84", "b85"),
    ("Coordinate", "b86", "b87"),
    ("Connect", "b89", "b90"),
    ("Connect", "b91", "b92"),
    ("Connect", "b93", "b94"),
    ("Connect", "b95", "b96"),
    ("Connect", "b97", "b98"),
]

FEATURE_TR = [
    ("Parametrik Modelleme", "Altyapı yapıları için özel dört boyutlu modelleme ve detaylandırma."),
    ("Köprü Modelleme", "Ön üretimli kiriş köprüleri dahil köprüleri modelleyin ve detaylandırın."),
    ("Tünel Modelleme", "Parametrik altyapı iş akışında tünel yapılarını modelleyin ve detaylandırın."),
    ("İstinat Duvarları ve Gürültü Bariyerleri",
     "İstinat duvarlarını ve gürültü bariyerlerini modelleyin ve detaylandırın."),
    ("Parametrik Ön Gerilme", "Ön gerilme tendonlarını doğrudan proje modelinde modelleyin."),
    ("Donatı Tasarımı", "Çubuk donatı, hasır donatı ve BAMTEC halıları oluşturun."),
    ("Donatı Düzenleme",
     "Çubukları, grupları, hasırları ve etiketleri düzenlemek için 13 özel palet kullanın."),
    ("Varsayılan Donatı Öznitelikleri",
     "Donatı yerleştirme sırasında temel BIM bilgisini uygulayın."),
    ("Otomatik Kiriş Donatısı",
     "İyileştirilmiş mesnet tanıma, kenetlenme ve bindirme yönetimi ile daha zengin etriye ve "
     "çubuk seçeneklerini kullanın."),
    ("Otomatik Duvar Donatısı", "Otomatik duvar donatısı için girdi olarak 3B gövdeleri kullanın."),
    ("2B Çizim", "Kesin, öz ve ayrıntılı çizimler oluşturun."),
    ("Donatı AI Drafter", "Elle açıklama işini azaltmak için donatı etiketi yerleştirmeyi otomatikleştirin."),
    ("İlişkisel Metin Okları",
     "Metin oklarını görünümlerde ve kesitlerde değişen geometriye bağlı tutun."),
    ("Dinamik Konturlar",
     "Karmaşık eğrisel 3B nesneler için görünüme bağlı konturlar ve yakalama kullanın."),
    ("Görünümlerde Nesne Gösterimi",
     "SmartSymbols, PythonParts ve SmartParts'ın yatay görünümlerde ve kesitlerde nasıl "
     "görüneceğini kontrol edin."),
    ("Cloud BIM Manager",
     "BIM verilerini ve metrajlarını bulut destekli tek bir bilgi yönetimi ortamında inceleyin, "
     "filtreleyin ve düzenleyin."),
    ("Mark Numaralandırma",
     "Yapılandırılabilir, yeniden kullanılabilir numaralandırma şemalarıyla öğeleri ortak "
     "özelliklerine göre tarayın, gruplayın ve numaralandırın."),
    ("Metraj ve Maliyetlendirme",
     "Modellenen ve modellenmeyen nesneler için kesin, doğrulanabilir metraj ve maliyetlendirme "
     "oluşturun."),
    ("BIM'e Hazır İpuçları",
     "Nesne adı, malzeme ve özel özellikler dahil seçili BIM özniteliklerini doğrudan fareyle "
     "üzerine gelindiğinde gösterin."),
    ("Referans Öznitelikleri", "Referans ID ve Referans Adı'nı hesaplanan öznitelik olarak kullanın."),
    ("Bilgi Modelleme ve Yönetimi",
     "Model bilgisini Bilgi Paleti ile, referans belgeleri Xref Manager ile yönetin."),
    ("Çakışma Denetimi", "Yumuşak ve sert çakışmaları belirleyin."),
    ("Gruplanmış Donatı Çakışmaları",
     "Karmaşık modellerin daha net incelenmesini desteklemek için donatı çakışmalarını gruplayın."),
    ("Kesitlerde ve Görünümlerde IFC Xref'leri",
     "IFC harici referanslarını tam içe aktarma yapmadan görünümlerde ve kesitlerde gösterin."),
    ("IFC4 İçe Aktarma",
     "IFC4 verilerini iyileştirilmiş sınıflandırma ve jeoreferanslama desteğiyle içe aktarın."),
    ("Harici Veri Kaynakları",
     "GIS bilgisini, 3B içeriği ve dokuları GIS Connector ve Content Connector üzerinden içe aktarın."),
    ("Dosya Arayüzleri",
     "IFC, BCF, PDF, RVT, 3DM, SKP, OBJ, LandXML, DWG, DGN, SAF ve daha fazlası dahil arayüzler "
     "üzerinden veri paylaşın."),
    ("Merkezî Jeoreferanslama",
     "Baz noktayı, ölçüm noktasını ve Allplan orijinini tek bir Özellik Paleti'nde yönetin."),
    ("Abonelik Bulut Hizmetleri",
     "Abonelik lisanslarıyla Bimplus bulut tabanlı BIM iş birliğini, proje ekip çalışmasını, "
     "ofis ekip çalışmasını, plan dağıtımını ve bulut destekli proje kaynaklarını kullanın."),
    ("Tasarım Denetimi", "Solibri Inside ile Allplan içinde model denetimleri çalıştırın."),
]

UNITS = [
    Unit(id="parametric.hero.title", page="allplan-parametric", role="hero-title", source=SRC,
         block="b4", tr="Allplan Parametric"),
    Unit(id="parametric.hero.subtitle", page="allplan-parametric", role="hero-subtitle", source=SRC,
         block="b5", tr="Parametrik altyapı yapıları için BIM yazılımı"),
    Unit(
        id="parametric.hero.body",
        page="allplan-parametric",
        role="hero-body",
        source=SRC,
        block="b6",
        tr="Allplan Parametric, altyapı yapılarının dört boyutlu parametrik modellenmesi ve "
        "detaylandırılması için özel işlevler sunar. Köprüleri, tünelleri, istinat duvarlarını, "
        "gürültü bariyerlerini ve ön üretimli kiriş köprülerini modelleyin; ardından parametrik "
        "modellemeyi ön gerilme, donatı, dokümantasyon, metraj ve koordineli bilgi yönetimiyle "
        "birleştirin.",
    ),
    Unit(
        id="parametric.hero.tags",
        page="allplan-parametric",
        role="tags",
        source=SRC,
        block="b8",
        tr="Parametrik Altyapı Tasarımı · Köprü Modelleme · Parametrik Ön Gerilme · Donatı "
        "Detaylandırma · OpenBIM Koordinasyon",
    ),
    Unit(
        id="parametric.hero.cta",
        page="allplan-parametric",
        role="hero-cta",
        source=SRC,
        block="b9",
        tr="CTA: Allplan Parametric'i deneyin\nCTA: Uzmanla görüşün",
        note="İki CTA tek blokta; hedef URL'ler kaynakta yok.",
    ),
    # ------------------------------------------------------------- overview
    Unit(
        id="parametric.overview.title",
        page="allplan-parametric",
        role="section-title",
        source=SRC,
        block="b11",
        tr="Parametrik Altyapı Yapıları için Özel BIM Çözümü",
    ),
    Unit(id="parametric.overview.group-1", page="allplan-parametric", role="group", source=SRC,
         block="b12", tr="Parametrikleştir"),
    Unit(id="parametric.overview.item-1.title", page="allplan-parametric", role="overview-title",
         source=SRC, block="b13", tr="Altyapı Yapılarını Parametrikleştirin"),
    Unit(
        id="parametric.overview.item-1.body",
        page="allplan-parametric",
        role="overview-body",
        source=SRC,
        block="b14",
        tr="Köprüler, tüneller, istinat duvarları, gürültü bariyerleri ve ön üretimli kiriş "
        "köprüleri dahil altyapı yapıları için özel dört boyutlu parametrik modelleme ve "
        "detaylandırma kullanın. Altyapı geometrisini kendine ait bir parametrik iş akışında "
        "geliştirirken modelleme ve detaylandırma faaliyetlerini aynı BIM proje ortamında tutun.",
    ),
    Unit(id="parametric.overview.group-2", page="allplan-parametric", role="group", source=SRC,
         block="b15", tr="Entegre Et"),
    Unit(id="parametric.overview.item-2.title", page="allplan-parametric", role="overview-title",
         source=SRC, block="b16", tr="Ön Gerilmeyi ve Donatıyı Modelleyin"),
    Unit(
        id="parametric.overview.item-2.body",
        page="allplan-parametric",
        role="overview-body",
        source=SRC,
        block="b17",
        tr="Ön gerilme tendonlarını doğrudan proje modelinde modelleyin; çubuk donatı, hasır donatı "
        "ve BAMTEC halıları oluşturun. Bağlantılı strüktürel detaylandırma iş akışlarını "
        "desteklemek için özel donatı düzenleme paletlerini, varsayılan öznitelik güdümlü "
        "yerleştirmeyi ve iyileştirilmiş otomatik kiriş ve duvar donatısını kullanın.",
    ),
    Unit(id="parametric.overview.group-3", page="allplan-parametric", role="group", source=SRC,
         block="b18", tr="Koordine Et"),
    Unit(id="parametric.overview.item-3.title", page="allplan-parametric", role="overview-title",
         source=SRC, block="b19", tr="Bilgiyi Yönetin ve Veriyi Teslim Edin"),
    Unit(
        id="parametric.overview.item-3.body",
        page="allplan-parametric",
        role="overview-body",
        source=SRC,
        block="b20",
        tr="Model bilgisini Bilgi Paleti üzerinden, referans belgeleri Xref Manager üzerinden "
        "yönetin. Bağlantılı BIM bilgi iş akışlarını ve proje teslimini desteklemek için Cloud BIM "
        "Manager, metraj ve maliyetlendirme, çakışma denetimi, IFC koordinasyonu, harici veri "
        "kaynakları ve standart dosya arayüzlerini birleştirin.",
    ),
    # ------------------------------------------------------------- benefits
    Unit(id="parametric.benefits.title", page="allplan-parametric", role="section-subtitle",
         source=SRC, block="b22", tr="Neden Allplan Parametric?"),
    Unit(id="parametric.benefits.item-1.title", page="allplan-parametric", role="benefit-title",
         source=SRC, block="b23", tr="Altyapıya Özel Parametrik Modelleme"),
    Unit(
        id="parametric.benefits.item-1.body",
        page="allplan-parametric",
        role="benefit-body",
        source=SRC,
        block="b24",
        tr="Köprüleri, tünelleri, istinat duvarlarını, gürültü bariyerlerini ve ön üretimli kiriş "
        "köprülerini özel dört boyutlu parametrik işlevlerle modelleyin ve detaylandırın. Allplan "
        "Parametric bu altyapı yapısı kapsamını temel 3B modelleme, 2B çizim, yapı bileşenleri ve "
        "koordineli dokümantasyonla bir araya getirir.",
    ),
    Unit(id="parametric.benefits.item-2.title", page="allplan-parametric", role="benefit-title",
         source=SRC, block="b25", tr="Daha Verimli Modelleme ve Dokümantasyon"),
    Unit(
        id="parametric.benefits.item-2.body",
        page="allplan-parametric",
        role="benefit-body",
        source=SRC,
        block="b26",
        tr="Esnek yapı bileşenlerini, temel 3B modellemeyi ve kapsamlı 2B çizimi tek bir BIM iş "
        "akışında birleştirin. Dinamik konturlar, ilişkisel metin okları ve görünümler ile "
        "kesitlerde yapılandırılabilir nesne gösterimi, elle çizim tekrarını azaltırken net ve "
        "ayrıntılı dokümantasyon oluşturmaya yardımcı olur.",
    ),
    Unit(id="parametric.benefits.item-3.title", page="allplan-parametric", role="benefit-title",
         source=SRC, block="b27", tr="Bağlantılı Bilgi ve Metrajlar"),
    Unit(
        id="parametric.benefits.item-3.body",
        page="allplan-parametric",
        role="benefit-body",
        source=SRC,
        block="b28",
        tr="BIM verilerini ve metrajlarını incelemek, filtrelemek ve düzenlemek için Cloud BIM "
        "Manager'ı kullanın. Modellenen ve modellenmeyen nesneler için kesin, doğrulanabilir metraj "
        "ve maliyetlendirme oluşturun; tutarlı bilgi yönetimini desteklemek için yapılandırılabilir "
        "mark numaralandırması ve hesaplanan öznitelikleri kullanın.",
    ),
    Unit(id="parametric.benefits.item-4.title", page="allplan-parametric", role="benefit-title",
         source=SRC, block="b29", tr="Açık ve Koordineli Teslim"),
    Unit(
        id="parametric.benefits.item-4.body",
        page="allplan-parametric",
        role="benefit-body",
        source=SRC,
        block="b30",
        tr="Verileri standart dosya arayüzleri üzerinden paylaşın, GIS bilgisini, 3B içeriği ve "
        "dokuları içe aktarın; görünümlerde ve kesitlerde IFC referanslarıyla koordine olun. "
        "İyileştirilmiş IFC4 içe aktarma, merkezî jeoreferanslama, çakışma denetimi ve abonelik "
        "tabanlı bulut hizmetleri bağlantılı proje iş akışlarını destekler.",
    ),
    # ------------------------------------------------------------- features
    Unit(id="parametric.features.title", page="allplan-parametric", role="section-title", source=SRC,
         block="b32", tr="Parametrik Altyapı Tasarımını Güçlendiren Teknoloji"),
    Unit(id="parametric.features.group-parametrize", page="allplan-parametric", role="group",
         source=SRC, block="b33", tr="Parametrikleştir"),
    Unit(id="parametric.features.group-detail", page="allplan-parametric", role="group", source=SRC,
         block="b44", tr="Detaylandır"),
    Unit(id="parametric.features.group-document", page="allplan-parametric", role="group", source=SRC,
         block="b55", tr="Dokümante Et"),
    Unit(id="parametric.features.group-manage", page="allplan-parametric", role="group", source=SRC,
         block="b66", tr="Yönet"),
    Unit(id="parametric.features.group-coordinate", page="allplan-parametric", role="group",
         source=SRC, block="b77", tr="Koordine Et"),
    Unit(id="parametric.features.group-connect", page="allplan-parametric", role="group", source=SRC,
         block="b88", tr="Bağla"),
]

for index, ((_group, title_block, body_block), (title_tr, body_tr)) in enumerate(
    zip(FEATURES, FEATURE_TR), start=1
):
    UNITS.append(
        Unit(
            id=f"parametric.features.item-{index:02d}.title",
            page="allplan-parametric",
            role="feature-title",
            source=SRC,
            block=title_block,
            tr=title_tr,
        )
    )
    UNITS.append(
        Unit(
            id=f"parametric.features.item-{index:02d}.body",
            page="allplan-parametric",
            role="feature-body",
            source=SRC,
            block=body_block,
            tr=body_tr,
        )
    )
