"""ALLPLAN Rebar — new edition page for 2027."""

from __future__ import annotations

from .core import Page, Unit

SRC = "allplan--allplan-rebar-edition-web-page"

PAGES = [
    Page(
        slug="allplan-rebar",
        title="ALLPLAN Rebar sayfası (yeni)",
        routes=("/products/allplan-rebar",),
        summary=(
            "2027'de ayrı bir sürüm olarak çıkan ALLPLAN Rebar, donatı detaylandırmaya odaklanıyor. "
            "Mevcut bilgi mimarisinde rota yok; donatı içeriği bugün "
            "`/solutions/rebar-engineering` ve `/solutions/structural` sayfalarına dağılmış durumda."
        ),
        open_questions=(
            "`/products/allplan-rebar` yeni rota mı olacak, yoksa `/solutions/rebar-engineering` "
            "adresi 301 ile buraya mı taşınacak?",
            "Sayfadaki 30 özellik ile AI Assistance bölümü aynı sayfada mı kalacak?",
        ),
    ),
]

SHARED: dict[str, Unit] = {}

FEATURES = [
    ("Detail", "b40", "b41"),
    ("Detail", "b42", "b43"),
    ("Detail", "b44", "b45"),
    ("Detail", "b46", "b47"),
    ("Detail", "b48", "b49"),
    ("Document", "b51", "b52"),
    ("Document", "b53", "b54"),
    ("Document", "b55", "b56"),
    ("Document", "b57", "b58"),
    ("Document", "b59", "b60"),
    ("Manage", "b62", "b63"),
    ("Manage", "b64", "b65"),
    ("Manage", "b66", "b67"),
    ("Manage", "b68", "b69"),
    ("Manage", "b70", "b71"),
    ("Coordinate", "b73", "b74"),
    ("Coordinate", "b75", "b76"),
    ("Coordinate", "b77", "b78"),
    ("Coordinate", "b79", "b80"),
    ("Coordinate", "b81", "b82"),
    ("Connect and Automate", "b84", "b85"),
    ("Connect and Automate", "b86", "b87"),
    ("Connect and Automate", "b88", "b89"),
    ("Connect and Automate", "b90", "b91"),
    ("Connect and Automate", "b92", "b93"),
    ("AI Assistance", "b95", "b96"),
    ("AI Assistance", "b97", "b98"),
    ("AI Assistance", "b99", "b100"),
    ("AI Assistance", "b101", "b102"),
    ("AI Assistance", "b103", "b104"),
]

FEATURE_TR = [
    ("Donatı Tasarımı", "Çubuk donatı, hasır donatı ve BAMTEC halıları oluşturun."),
    ("Donatı Düzenleme",
     "Çubukları, grupları, hasırları ve etiketleri düzenlemek için 13 özel palet kullanın."),
    ("Varsayılan Donatı Öznitelikleri",
     "Donatı yerleştirme sırasında temel BIM bilgisini otomatik olarak uygulayın."),
    ("Otomatik Kiriş Donatısı",
     "İyileştirilmiş mesnet tanıma, kenetlenme ve bindirme yönetimi ile daha zengin etriye ve "
     "çubuk seçeneklerini kullanın."),
    ("Otomatik Duvar Donatısı", "Otomatik duvar donatısı için girdi olarak 3B gövdeleri kullanın."),
    ("Donatı AI Drafter", "Elle açıklama işini azaltmak için donatı etiketi yerleştirmeyi otomatikleştirin."),
    ("AI Drafter", "Çakışmaları vurgulayın ve etiketleri ve ölçü çizgilerini otomatik olarak yeniden konumlandırın."),
    ("2B Çizim", "Kesin, öz ve ayrıntılı çizimler oluşturun."),
    ("İlişkisel Metin Okları",
     "Metin oklarını görünümlerde ve kesitlerde değişen geometriye bağlı tutun."),
    ("Dinamik Konturlar",
     "Karmaşık eğrisel 3B nesneler için görünüme bağlı konturlar ve yakalama kullanın."),
    ("Cloud BIM Manager",
     "BIM verilerini ve metrajlarını bulut destekli tek bir bilgi yönetimi ortamında inceleyin, "
     "filtreleyin ve düzenleyin."),
    ("Mark Numaralandırma",
     "Yapılandırılabilir, yeniden kullanılabilir numaralandırma şemalarıyla öğeleri ortak "
     "özelliklerine göre tarayın, gruplayın ve numaralandırın."),
    ("BIM'e Hazır İpuçları",
     "Nesne adı, malzeme ve özel özellikler dahil seçili BIM özniteliklerini doğrudan fareyle "
     "üzerine gelindiğinde gösterin."),
    ("Referans Öznitelikleri", "Referans ID ve Referans Adı'nı hesaplanan öznitelik olarak kullanın."),
    ("Açıklık Katmanları",
     "Açıklık katmanlarını hem Nesne Paleti'nde hem Bilgi Paleti'nde görüntüleyin ve düzenleyin."),
    ("Çakışma Denetimi", "Yumuşak ve sert çakışmaları belirleyin."),
    ("Gruplanmış Donatı Çakışmaları",
     "Karmaşık modellerin daha net incelenmesini desteklemek için donatı çakışmalarını gruplayın."),
    ("Kesitlerde ve Görünümlerde IFC Xref'leri",
     "IFC harici referanslarını tam içe aktarma yapmadan görünümlerde ve kesitlerde gösterin."),
    ("IFC4 İçe Aktarma",
     "IFC4 verilerini iyileştirilmiş sınıflandırma ve jeoreferanslama desteğiyle içe aktarın."),
    ("Merkezî Jeoreferanslama",
     "Baz noktayı, ölçüm noktasını ve Allplan orijinini tek bir Özellik Paleti'nde yönetin."),
    ("Dosya Arayüzleri",
     "IFC, BCF, PDF, RVT, 3DM, SKP, OBJ, DWG, DGN, SAF ve daha fazlası dahil arayüzler üzerinden "
     "veri paylaşın."),
    ("PythonPart Sürümleme",
     "Özel betikli nesnelerin güncellemelerini daha fazla kontrolle yönetin."),
    ("Python API Olayları", "Önemli Allplan ve proje olaylarında eylemleri otomatikleştirin."),
    ("Python Baskı Düzeni Otomasyonu",
     "Python API üzerinden baskı düzeni işlemlerini ve 2B çizim üretimini otomatikleştirin."),
    ("Abonelik Bulut Hizmetleri",
     "Abonelik lisanslarıyla Bimplus iş birliğini, proje ekip çalışmasını, ofis ekip çalışmasını, "
     "plan dağıtımını ve bulut destekli proje kaynaklarını kullanın."),
    ("AI BIM Analyst", "İstemlere ve proje bağlamına göre BIM verilerini filtreleyin, seçin ve çıkarın."),
    ("AI BIM Modeler",
     "LCA ve maliyet tahminleri için 2B kat planlarından basit Allplan 3B BIM modelleri oluşturun."),
    ("AI Formula Writer", "Düz dilde açıklamaları kullanıma hazır Allplan formüllerine dönüştürün."),
    ("AI Coach",
     "Yapay zekâ tabanlı bir bilgi asistanı aracılığıyla Allplan, FRILO, SCIA ve SDS2 sorularına "
     "yanıt alın."),
    ("AI Visualizer",
     "Fotoğraflardan, BIM ekran görüntülerinden, eskizlerden ve metin istemlerinden tasarım "
     "görselleştirmeleri oluşturun."),
]

UNITS = [
    Unit(id="rebar.hero.title", page="allplan-rebar", role="hero-title", source=SRC, block="b4",
         tr="Allplan Rebar"),
    Unit(id="rebar.hero.subtitle", page="allplan-rebar", role="hero-subtitle", source=SRC, block="b5",
         tr="Donatı detaylandırma için BIM yazılımı"),
    Unit(
        id="rebar.hero.body",
        page="allplan-rebar",
        role="hero-body",
        source=SRC,
        block="b6",
        tr="Allplan Rebar, donatı tasarımını, detaylandırmayı, dokümantasyonu, metrajı ve proje "
        "koordinasyonunu tek bir odaklı BIM çözümünde bir araya getirir. Çubuk, hasır ve BAMTEC "
        "donatısı oluşturun; yapay zekâ destekli ve otomatik detaylandırma iş akışlarını kullanın; "
        "koordineli donatı çizimleri ve bilgileri teslim edin.",
    ),
    Unit(id="rebar.hero.tag-1", page="allplan-rebar", role="tags", source=SRC, block="b8",
         tr="Donatı Detaylandırma"),
    Unit(id="rebar.hero.tag-2", page="allplan-rebar", role="tags", source=SRC, block="b9",
         tr="Otomatik Donatı"),
    Unit(id="rebar.hero.tag-3", page="allplan-rebar", role="tags", source=SRC, block="b10",
         tr="Donatı Dokümantasyonu"),
    Unit(id="rebar.hero.tag-4", page="allplan-rebar", role="tags", source=SRC, block="b11",
         tr="Metraj"),
    Unit(id="rebar.hero.tag-5", page="allplan-rebar", role="tags", source=SRC, block="b12",
         tr="OpenBIM Koordinasyon"),
    # ------------------------------------------------------------- overview
    Unit(id="rebar.overview.title", page="allplan-rebar", role="section-title", source=SRC,
         block="b14", tr="Donatı Detaylandırma için Odaklı BIM Çözümü"),
    Unit(id="rebar.overview.group-1", page="allplan-rebar", role="group", source=SRC, block="b15",
         tr="Donatılandır"),
    Unit(id="rebar.overview.item-1.title", page="allplan-rebar", role="overview-title", source=SRC,
         block="b16", tr="Donatıyı Detaylandırın"),
    Unit(
        id="rebar.overview.item-1.body",
        page="allplan-rebar",
        role="overview-body",
        source=SRC,
        block="b17",
        tr="Kendine ait bir donatı iş akışında çubuk donatı, hasır donatı ve BAMTEC halıları "
        "oluşturun ve detaylandırın. Donatı işlevselliğini eğriler ve yüzeyler için temel 3B "
        "modelleme araçlarıyla ve etkileyici, öz ve ayrıntılı çizimler için kapsamlı 2B çizimle "
        "birleştirin.",
    ),
    Unit(id="rebar.overview.group-2", page="allplan-rebar", role="group", source=SRC, block="b18",
         tr="Otomatikleştir"),
    Unit(id="rebar.overview.item-2.title", page="allplan-rebar", role="overview-title", source=SRC,
         block="b19", tr="Düzenleyin ve Otomatikleştirin"),
    Unit(
        id="rebar.overview.item-2.body",
        page="allplan-rebar",
        role="overview-body",
        source=SRC,
        block="b20",
        tr="Çubuklar, gruplar, hasırlar ve etiketler için 13 donatı düzenleme paleti kullanın. "
        "Varsayılan öznitelik güdümlü yerleştirme temel BIM bilgisini otomatik sağlar; "
        "iyileştirilmiş otomatik kiriş ve duvar donatısı daha zengin etriye, çubuk, kenetlenme, "
        "bindirme ve mesnet tanıma seçenekleriyle esnek detaylandırmayı destekler.",
    ),
    Unit(id="rebar.overview.group-3", page="allplan-rebar", role="group", source=SRC, block="b21",
         tr="Dokümante Et"),
    Unit(id="rebar.overview.item-3.title", page="allplan-rebar", role="overview-title", source=SRC,
         block="b22", tr="Akıllı Dokümantasyon"),
    Unit(
        id="rebar.overview.item-3.body",
        page="allplan-rebar",
        role="overview-body",
        source=SRC,
        block="b23",
        tr="Otomatik donatı etiketi yerleştirme, etiketlerin ve ölçü çizgilerinin yapay zekâ "
        "destekli yeniden konumlandırılması, ilişkisel metin okları ve görünümler ile kesitlerde "
        "yapılandırılabilir nesne gösterimiyle daha net çizimler hazırlayın. Dinamik konturlar ve "
        "yakalama, karmaşık eğrisel 3B nesnelerin daha doğru ele alınmasını sağlar.",
    ),
    Unit(id="rebar.overview.group-4", page="allplan-rebar", role="group", source=SRC, block="b24",
         tr="Koordine Et"),
    Unit(id="rebar.overview.item-4.title", page="allplan-rebar", role="overview-title", source=SRC,
         block="b25", tr="Koordine Edin ve Teslim Edin"),
    Unit(
        id="rebar.overview.item-4.body",
        page="allplan-rebar",
        role="overview-body",
        source=SRC,
        block="b26",
        tr="Bilgiyi ve metrajları Cloud BIM Manager üzerinden yönetin, bağlam içinde koordinasyon "
        "için çakışma denetimini ve IFC Xref'lerini kullanın, verileri standart arayüzler üzerinden "
        "paylaşın. Abonelik bulut hizmetleri BIM iş birliğini, proje ve ofis ekip çalışmasını, "
        "çizim dağıtımını ve paylaşılan proje kaynaklarını destekler.",
    ),
    # ------------------------------------------------------------- benefits
    Unit(id="rebar.benefits.title", page="allplan-rebar", role="section-subtitle", source=SRC,
         block="b28", tr="Neden Allplan Rebar?"),
    Unit(id="rebar.benefits.item-1.title", page="allplan-rebar", role="benefit-title", source=SRC,
         block="b29", tr="Daha Hızlı Donatı Detaylandırma"),
    Unit(
        id="rebar.benefits.item-1.body",
        page="allplan-rebar",
        role="benefit-body",
        source=SRC,
        block="b30",
        tr="Donatı işine göre tasarlanmış iş akışlarıyla çubuk, hasır ve BAMTEC donatısı oluşturun. "
        "Özel düzenleme paletleri, iyileştirilmiş otomatik kiriş ve duvar donatısı ve Donatı AI "
        "Drafter, model geliştirme ve çizim hazırlığı sırasında tekrarlayan düzenlemeyi ve elle "
        "açıklamayı azaltır.",
    ),
    Unit(id="rebar.benefits.item-2.title", page="allplan-rebar", role="benefit-title", source=SRC,
         block="b31", tr="Daha Eksiksiz BIM Bilgisi"),
    Unit(
        id="rebar.benefits.item-2.body",
        page="allplan-rebar",
        role="benefit-body",
        source=SRC,
        block="b32",
        tr="Filtreleme, analiz, koordinasyon, raporlama ve dışa aktarma için temel BIM bilgisini "
        "kullanılabilir kılmak üzere donatı yerleştirme sırasında varsayılan öznitelikleri "
        "uygulayın. Cloud BIM Manager, BIM verilerinin ve metrajlarının incelenmesini, "
        "filtrelenmesini ve düzenlenmesini merkezileştirir.",
    ),
    Unit(id="rebar.benefits.item-3.title", page="allplan-rebar", role="benefit-title", source=SRC,
         block="b33", tr="Daha Net ve Daha Uyarlanabilir Dokümantasyon"),
    Unit(
        id="rebar.benefits.item-3.body",
        page="allplan-rebar",
        role="benefit-body",
        source=SRC,
        block="b34",
        tr="Otomatik ilişkisel metin okları, görünümlerde ve kesitlerde yapılandırılabilir nesne "
        "gösterimi ve karmaşık eğrisel nesneler için dinamik konturlarla desteklenen kesin 2B "
        "çizimler oluşturun. AI Drafter, daha temiz plan yerleşimlerini desteklemek için etiketleri "
        "ve ölçü çizgilerini otomatik olarak yeniden konumlandırır.",
    ),
    Unit(id="rebar.benefits.item-4.title", page="allplan-rebar", role="benefit-title", source=SRC,
         block="b35", tr="Bağlantılı OpenBIM Teslimi"),
    Unit(
        id="rebar.benefits.item-4.body",
        page="allplan-rebar",
        role="benefit-body",
        source=SRC,
        block="b36",
        tr="Donatıyı referans IFC modelleri bağlamında koordine edin, jeoreferanslamayı tek yerde "
        "yönetin ve iyileştirilmiş IFC4 içe aktarmayı kullanın. Dosya arayüzleri, çakışma yönetimi, "
        "metraj ve abonelik bulut hizmetleri, detaylandırmadan plan dağıtımına kadar bağlantılı "
        "proje teslimini destekler.",
    ),
    # ------------------------------------------------------------- features
    Unit(id="rebar.features.title", page="allplan-rebar", role="section-title", source=SRC,
         block="b38", tr="Donatı Detaylandırmayı Güçlendiren Teknoloji"),
    Unit(id="rebar.features.group-detail", page="allplan-rebar", role="group", source=SRC,
         block="b39", tr="Detaylandır"),
    Unit(id="rebar.features.group-document", page="allplan-rebar", role="group", source=SRC,
         block="b50", tr="Dokümante Et"),
    Unit(id="rebar.features.group-manage", page="allplan-rebar", role="group", source=SRC,
         block="b61", tr="Yönet"),
    Unit(id="rebar.features.group-coordinate", page="allplan-rebar", role="group", source=SRC,
         block="b72", tr="Koordine Et"),
    Unit(id="rebar.features.group-connect", page="allplan-rebar", role="group", source=SRC,
         block="b83", tr="Bağla ve Otomatikleştir"),
    Unit(id="rebar.features.group-ai", page="allplan-rebar", role="group", source=SRC, block="b94",
         tr="Yapay Zekâ Desteği"),
]

for index, ((_group, title_block, body_block), (title_tr, body_tr)) in enumerate(
    zip(FEATURES, FEATURE_TR), start=1
):
    UNITS.append(
        Unit(
            id=f"rebar.features.item-{index:02d}.title",
            page="allplan-rebar",
            role="feature-title",
            source=SRC,
            block=title_block,
            tr=title_tr,
        )
    )
    UNITS.append(
        Unit(
            id=f"rebar.features.item-{index:02d}.body",
            page="allplan-rebar",
            role="feature-body",
            source=SRC,
            block=body_block,
            tr=body_tr,
        )
    )
