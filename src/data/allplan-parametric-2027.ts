import type { ProductEditionContent } from './product-edition-content';

// Turkish text of the "ALLPLAN Parametric – Edition Web Page" launch document, taken from the content inventory drafts in scripts/inventory_units/.
// tests/test_rebar_parametric_pages.py keeps this file identical to those drafts.
export const content: ProductEditionContent = {
  "path": "/products/allplan-parametric",
  "name": "Allplan Parametric",
  "tagline": "Parametrik altyapı yapıları için BIM yazılımı",
  "lead": "Allplan Parametric, altyapı yapılarının dört boyutlu parametrik modellenmesi ve detaylandırılması için özel işlevler sunar. Köprüleri, tünelleri, istinat duvarlarını, gürültü bariyerlerini ve ön üretimli kiriş köprülerini modelleyin; ardından parametrik modellemeyi ön gerilme, donatı, dokümantasyon, metraj ve koordineli bilgi yönetimiyle birleştirin.",
  "tags": [
    "Parametrik Altyapı Tasarımı",
    "Köprü Modelleme",
    "Parametrik Ön Gerilme",
    "Donatı Detaylandırma",
    "OpenBIM Koordinasyon"
  ],
  "overviewTitle": "Parametrik Altyapı Yapıları için Özel BIM Çözümü",
  "overview": [
    {
      "label": "Parametrikleştir",
      "title": "Altyapı Yapılarını Parametrikleştirin",
      "text": "Köprüler, tüneller, istinat duvarları, gürültü bariyerleri ve ön üretimli kiriş köprüleri dahil altyapı yapıları için özel dört boyutlu parametrik modelleme ve detaylandırma kullanın. Altyapı geometrisini kendine ait bir parametrik iş akışında geliştirirken modelleme ve detaylandırma faaliyetlerini aynı BIM proje ortamında tutun."
    },
    {
      "label": "Entegre Et",
      "title": "Ön Gerilmeyi ve Donatıyı Modelleyin",
      "text": "Ön gerilme tendonlarını doğrudan proje modelinde modelleyin; çubuk donatı, hasır donatı ve BAMTEC halıları oluşturun. Bağlantılı strüktürel detaylandırma iş akışlarını desteklemek için özel donatı düzenleme paletlerini, varsayılan öznitelik güdümlü yerleştirmeyi ve iyileştirilmiş otomatik kiriş ve duvar donatısını kullanın."
    },
    {
      "label": "Koordine Et",
      "title": "Bilgiyi Yönetin ve Veriyi Teslim Edin",
      "text": "Model bilgisini Bilgi Paleti üzerinden, referans belgeleri Xref Manager üzerinden yönetin. Bağlantılı BIM bilgi iş akışlarını ve proje teslimini desteklemek için Cloud BIM Manager, metraj ve maliyetlendirme, çakışma denetimi, IFC koordinasyonu, harici veri kaynakları ve standart dosya arayüzlerini birleştirin."
    }
  ],
  "benefitsTitle": "Neden Allplan Parametric?",
  "benefits": [
    {
      "title": "Altyapıya Özel Parametrik Modelleme",
      "text": "Köprüleri, tünelleri, istinat duvarlarını, gürültü bariyerlerini ve ön üretimli kiriş köprülerini özel dört boyutlu parametrik işlevlerle modelleyin ve detaylandırın. Allplan Parametric bu altyapı yapısı kapsamını temel 3B modelleme, 2B çizim, yapı bileşenleri ve koordineli dokümantasyonla bir araya getirir."
    },
    {
      "title": "Daha Verimli Modelleme ve Dokümantasyon",
      "text": "Esnek yapı bileşenlerini, temel 3B modellemeyi ve kapsamlı 2B çizimi tek bir BIM iş akışında birleştirin. Dinamik konturlar, ilişkisel metin okları ve görünümler ile kesitlerde yapılandırılabilir nesne gösterimi, elle çizim tekrarını azaltırken net ve ayrıntılı dokümantasyon oluşturmaya yardımcı olur."
    },
    {
      "title": "Bağlantılı Bilgi ve Metrajlar",
      "text": "BIM verilerini ve metrajlarını incelemek, filtrelemek ve düzenlemek için Cloud BIM Manager'ı kullanın. Modellenen ve modellenmeyen nesneler için kesin, doğrulanabilir metraj ve maliyetlendirme oluşturun; tutarlı bilgi yönetimini desteklemek için yapılandırılabilir mark numaralandırması ve hesaplanan öznitelikleri kullanın."
    },
    {
      "title": "Açık ve Koordineli Teslim",
      "text": "Verileri standart dosya arayüzleri üzerinden paylaşın, GIS bilgisini, 3B içeriği ve dokuları içe aktarın; görünümlerde ve kesitlerde IFC referanslarıyla koordine olun. İyileştirilmiş IFC4 içe aktarma, merkezî jeoreferanslama, çakışma denetimi ve abonelik tabanlı bulut hizmetleri bağlantılı proje iş akışlarını destekler."
    }
  ],
  "featuresTitle": "Parametrik Altyapı Tasarımını Güçlendiren Teknoloji",
  "featureGroups": [
    {
      "label": "Parametrikleştir",
      "items": [
        {
          "title": "Parametrik Modelleme",
          "text": "Altyapı yapıları için özel dört boyutlu modelleme ve detaylandırma."
        },
        {
          "title": "Köprü Modelleme",
          "text": "Ön üretimli kiriş köprüleri dahil köprüleri modelleyin ve detaylandırın."
        },
        {
          "title": "Tünel Modelleme",
          "text": "Parametrik altyapı iş akışında tünel yapılarını modelleyin ve detaylandırın."
        },
        {
          "title": "İstinat Duvarları ve Gürültü Bariyerleri",
          "text": "İstinat duvarlarını ve gürültü bariyerlerini modelleyin ve detaylandırın."
        },
        {
          "title": "Parametrik Ön Gerilme",
          "text": "Ön gerilme tendonlarını doğrudan proje modelinde modelleyin."
        }
      ]
    },
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
          "text": "Donatı yerleştirme sırasında temel BIM bilgisini uygulayın."
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
          "title": "2B Çizim",
          "text": "Kesin, öz ve ayrıntılı çizimler oluşturun."
        },
        {
          "title": "Donatı AI Drafter",
          "text": "Elle açıklama işini azaltmak için donatı etiketi yerleştirmeyi otomatikleştirin."
        },
        {
          "title": "İlişkisel Metin Okları",
          "text": "Metin oklarını görünümlerde ve kesitlerde değişen geometriye bağlı tutun."
        },
        {
          "title": "Dinamik Konturlar",
          "text": "Karmaşık eğrisel 3B nesneler için görünüme bağlı konturlar ve yakalama kullanın."
        },
        {
          "title": "Görünümlerde Nesne Gösterimi",
          "text": "SmartSymbols, PythonParts ve SmartParts'ın yatay görünümlerde ve kesitlerde nasıl görüneceğini kontrol edin."
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
          "title": "Metraj ve Maliyetlendirme",
          "text": "Modellenen ve modellenmeyen nesneler için kesin, doğrulanabilir metraj ve maliyetlendirme oluşturun."
        },
        {
          "title": "BIM'e Hazır İpuçları",
          "text": "Nesne adı, malzeme ve özel özellikler dahil seçili BIM özniteliklerini doğrudan fareyle üzerine gelindiğinde gösterin."
        },
        {
          "title": "Referans Öznitelikleri",
          "text": "Referans ID ve Referans Adı'nı hesaplanan öznitelik olarak kullanın."
        }
      ]
    },
    {
      "label": "Koordine Et",
      "items": [
        {
          "title": "Bilgi Modelleme ve Yönetimi",
          "text": "Model bilgisini Bilgi Paleti ile, referans belgeleri Xref Manager ile yönetin."
        },
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
        }
      ]
    },
    {
      "label": "Bağla",
      "items": [
        {
          "title": "Harici Veri Kaynakları",
          "text": "GIS bilgisini, 3B içeriği ve dokuları GIS Connector ve Content Connector üzerinden içe aktarın."
        },
        {
          "title": "Dosya Arayüzleri",
          "text": "IFC, BCF, PDF, RVT, 3DM, SKP, OBJ, LandXML, DWG, DGN, SAF ve daha fazlası dahil arayüzler üzerinden veri paylaşın."
        },
        {
          "title": "Merkezî Jeoreferanslama",
          "text": "Baz noktayı, ölçüm noktasını ve Allplan orijinini tek bir Özellik Paleti'nde yönetin."
        },
        {
          "title": "Abonelik Bulut Hizmetleri",
          "text": "Abonelik lisanslarıyla Bimplus bulut tabanlı BIM iş birliğini, proje ekip çalışmasını, ofis ekip çalışmasını, plan dağıtımını ve bulut destekli proje kaynaklarını kullanın."
        },
        {
          "title": "Tasarım Denetimi",
          "text": "Solibri Inside ile Allplan içinde model denetimleri çalıştırın."
        }
      ]
    }
  ]
};
