import type { ProductEditionContent } from './product-edition-content';

// Turkish text of the "ALLPLAN Rebar - Edition Web Page" launch document, taken from the content inventory drafts in scripts/inventory_units/.
// tests/test_rebar_parametric_pages.py keeps this file identical to those drafts.
export const content: ProductEditionContent = {
  "path": "/products/allplan-rebar",
  "name": "Allplan Rebar",
  "tagline": "Donatı detaylandırma için BIM yazılımı",
  "lead": "Allplan Rebar, donatı tasarımını, detaylandırmayı, dokümantasyonu, metrajı ve proje koordinasyonunu tek bir odaklı BIM çözümünde bir araya getirir. Çubuk, hasır ve BAMTEC donatısı oluşturun; yapay zekâ destekli ve otomatik detaylandırma iş akışlarını kullanın; koordineli donatı çizimleri ve bilgileri teslim edin.",
  "tags": [
    "Donatı Detaylandırma",
    "Otomatik Donatı",
    "Donatı Dokümantasyonu",
    "Metraj",
    "OpenBIM Koordinasyon"
  ],
  "overviewTitle": "Donatı Detaylandırma için Odaklı BIM Çözümü",
  "overview": [
    {
      "label": "Donatılandır",
      "title": "Donatıyı Detaylandırın",
      "text": "Kendine ait bir donatı iş akışında çubuk donatı, hasır donatı ve BAMTEC halıları oluşturun ve detaylandırın. Donatı işlevselliğini eğriler ve yüzeyler için temel 3B modelleme araçlarıyla ve etkileyici, öz ve ayrıntılı çizimler için kapsamlı 2B çizimle birleştirin."
    },
    {
      "label": "Otomatikleştir",
      "title": "Düzenleyin ve Otomatikleştirin",
      "text": "Çubuklar, gruplar, hasırlar ve etiketler için 13 donatı düzenleme paleti kullanın. Varsayılan öznitelik güdümlü yerleştirme temel BIM bilgisini otomatik sağlar; iyileştirilmiş otomatik kiriş ve duvar donatısı daha zengin etriye, çubuk, kenetlenme, bindirme ve mesnet tanıma seçenekleriyle esnek detaylandırmayı destekler."
    },
    {
      "label": "Dokümante Et",
      "title": "Akıllı Dokümantasyon",
      "text": "Otomatik donatı etiketi yerleştirme, etiketlerin ve ölçü çizgilerinin yapay zekâ destekli yeniden konumlandırılması, ilişkisel metin okları ve görünümler ile kesitlerde yapılandırılabilir nesne gösterimiyle daha net çizimler hazırlayın. Dinamik konturlar ve yakalama, karmaşık eğrisel 3B nesnelerin daha doğru ele alınmasını sağlar."
    },
    {
      "label": "Koordine Et",
      "title": "Koordine Edin ve Teslim Edin",
      "text": "Bilgiyi ve metrajları Cloud BIM Manager üzerinden yönetin, bağlam içinde koordinasyon için çakışma denetimini ve IFC Xref'lerini kullanın, verileri standart arayüzler üzerinden paylaşın. Abonelik bulut hizmetleri BIM iş birliğini, proje ve ofis ekip çalışmasını, çizim dağıtımını ve paylaşılan proje kaynaklarını destekler."
    }
  ],
  "benefitsTitle": "Neden Allplan Rebar?",
  "benefits": [
    {
      "title": "Daha Hızlı Donatı Detaylandırma",
      "text": "Donatı işine göre tasarlanmış iş akışlarıyla çubuk, hasır ve BAMTEC donatısı oluşturun. Özel düzenleme paletleri, iyileştirilmiş otomatik kiriş ve duvar donatısı ve Donatı AI Drafter, model geliştirme ve çizim hazırlığı sırasında tekrarlayan düzenlemeyi ve elle açıklamayı azaltır."
    },
    {
      "title": "Daha Eksiksiz BIM Bilgisi",
      "text": "Filtreleme, analiz, koordinasyon, raporlama ve dışa aktarma için temel BIM bilgisini kullanılabilir kılmak üzere donatı yerleştirme sırasında varsayılan öznitelikleri uygulayın. Cloud BIM Manager, BIM verilerinin ve metrajlarının incelenmesini, filtrelenmesini ve düzenlenmesini merkezileştirir."
    },
    {
      "title": "Daha Net ve Daha Uyarlanabilir Dokümantasyon",
      "text": "Otomatik ilişkisel metin okları, görünümlerde ve kesitlerde yapılandırılabilir nesne gösterimi ve karmaşık eğrisel nesneler için dinamik konturlarla desteklenen kesin 2B çizimler oluşturun. AI Drafter, daha temiz plan yerleşimlerini desteklemek için etiketleri ve ölçü çizgilerini otomatik olarak yeniden konumlandırır."
    },
    {
      "title": "Bağlantılı OpenBIM Teslimi",
      "text": "Donatıyı referans IFC modelleri bağlamında koordine edin, jeoreferanslamayı tek yerde yönetin ve iyileştirilmiş IFC4 içe aktarmayı kullanın. Dosya arayüzleri, çakışma yönetimi, metraj ve abonelik bulut hizmetleri, detaylandırmadan plan dağıtımına kadar bağlantılı proje teslimini destekler."
    }
  ],
  "featuresTitle": "Donatı Detaylandırmayı Güçlendiren Teknoloji",
  "featureGroups": [
    {
      "label": "Detaylandır",
      "items": [
        {
          "title": "Donatı Tasarımı",
          "text": "Çubuk donatı, hasır donatı ve BAMTEC halıları oluşturun."
        },
        {
          "title": "Donatı Düzenleme",
          "text": "Çubukları, grupları, hasırları ve etiketleri düzenlemek için 13 özel palet kullanın."
        },
        {
          "title": "Varsayılan Donatı Öznitelikleri",
          "text": "Donatı yerleştirme sırasında temel BIM bilgisini otomatik olarak uygulayın."
        },
        {
          "title": "Otomatik Kiriş Donatısı",
          "text": "İyileştirilmiş mesnet tanıma, kenetlenme ve bindirme yönetimi ile daha zengin etriye ve çubuk seçeneklerini kullanın."
        },
        {
          "title": "Otomatik Duvar Donatısı",
          "text": "Otomatik duvar donatısı için girdi olarak 3B gövdeleri kullanın."
        }
      ]
    },
    {
      "label": "Dokümante Et",
      "items": [
        {
          "title": "Donatı AI Drafter",
          "text": "Elle açıklama işini azaltmak için donatı etiketi yerleştirmeyi otomatikleştirin."
        },
        {
          "title": "AI Drafter",
          "text": "Çakışmaları vurgulayın ve etiketleri ve ölçü çizgilerini otomatik olarak yeniden konumlandırın."
        },
        {
          "title": "2B Çizim",
          "text": "Kesin, öz ve ayrıntılı çizimler oluşturun."
        },
        {
          "title": "İlişkisel Metin Okları",
          "text": "Metin oklarını görünümlerde ve kesitlerde değişen geometriye bağlı tutun."
        },
        {
          "title": "Dinamik Konturlar",
          "text": "Karmaşık eğrisel 3B nesneler için görünüme bağlı konturlar ve yakalama kullanın."
        }
      ]
    },
    {
      "label": "Yönet",
      "items": [
        {
          "title": "Cloud BIM Manager",
          "text": "BIM verilerini ve metrajlarını bulut destekli tek bir bilgi yönetimi ortamında inceleyin, filtreleyin ve düzenleyin."
        },
        {
          "title": "Mark Numaralandırma",
          "text": "Yapılandırılabilir, yeniden kullanılabilir numaralandırma şemalarıyla öğeleri ortak özelliklerine göre tarayın, gruplayın ve numaralandırın."
        },
        {
          "title": "BIM'e Hazır İpuçları",
          "text": "Nesne adı, malzeme ve özel özellikler dahil seçili BIM özniteliklerini doğrudan fareyle üzerine gelindiğinde gösterin."
        },
        {
          "title": "Referans Öznitelikleri",
          "text": "Referans ID ve Referans Adı'nı hesaplanan öznitelik olarak kullanın."
        },
        {
          "title": "Açıklık Katmanları",
          "text": "Açıklık katmanlarını hem Nesne Paleti'nde hem Bilgi Paleti'nde görüntüleyin ve düzenleyin."
        }
      ]
    },
    {
      "label": "Koordine Et",
      "items": [
        {
          "title": "Çakışma Denetimi",
          "text": "Yumuşak ve sert çakışmaları belirleyin."
        },
        {
          "title": "Gruplanmış Donatı Çakışmaları",
          "text": "Karmaşık modellerin daha net incelenmesini desteklemek için donatı çakışmalarını gruplayın."
        },
        {
          "title": "Kesitlerde ve Görünümlerde IFC Xref'leri",
          "text": "IFC harici referanslarını tam içe aktarma yapmadan görünümlerde ve kesitlerde gösterin."
        },
        {
          "title": "IFC4 İçe Aktarma",
          "text": "IFC4 verilerini iyileştirilmiş sınıflandırma ve jeoreferanslama desteğiyle içe aktarın."
        },
        {
          "title": "Merkezî Jeoreferanslama",
          "text": "Baz noktayı, ölçüm noktasını ve Allplan orijinini tek bir Özellik Paleti'nde yönetin."
        }
      ]
    },
    {
      "label": "Bağla ve Otomatikleştir",
      "items": [
        {
          "title": "Dosya Arayüzleri",
          "text": "IFC, BCF, PDF, RVT, 3DM, SKP, OBJ, DWG, DGN, SAF ve daha fazlası dahil arayüzler üzerinden veri paylaşın."
        },
        {
          "title": "PythonPart Sürümleme",
          "text": "Özel betikli nesnelerin güncellemelerini daha fazla kontrolle yönetin."
        },
        {
          "title": "Python API Olayları",
          "text": "Önemli Allplan ve proje olaylarında eylemleri otomatikleştirin."
        },
        {
          "title": "Python Baskı Düzeni Otomasyonu",
          "text": "Python API üzerinden baskı düzeni işlemlerini ve 2B çizim üretimini otomatikleştirin."
        },
        {
          "title": "Abonelik Bulut Hizmetleri",
          "text": "Abonelik lisanslarıyla Bimplus iş birliğini, proje ekip çalışmasını, ofis ekip çalışmasını, plan dağıtımını ve bulut destekli proje kaynaklarını kullanın."
        }
      ]
    },
    {
      "label": "Yapay Zekâ Desteği",
      "items": [
        {
          "title": "AI BIM Analyst",
          "text": "İstemlere ve proje bağlamına göre BIM verilerini filtreleyin, seçin ve çıkarın."
        },
        {
          "title": "AI BIM Modeler",
          "text": "LCA ve maliyet tahminleri için 2B kat planlarından basit Allplan 3B BIM modelleri oluşturun."
        },
        {
          "title": "AI Formula Writer",
          "text": "Düz dilde açıklamaları kullanıma hazır Allplan formüllerine dönüştürün."
        },
        {
          "title": "AI Coach",
          "text": "Yapay zekâ tabanlı bir bilgi asistanı aracılığıyla Allplan, FRILO, SCIA ve SDS2 sorularına yanıt alın."
        },
        {
          "title": "AI Visualizer",
          "text": "Fotoğraflardan, BIM ekran görüntülerinden, eskizlerden ve metin istemlerinden tasarım görselleştirmeleri oluşturun."
        }
      ]
    }
  ]
};
