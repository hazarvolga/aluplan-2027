// Turkish text of the four edition sections of the "New Text and Images – ALLPLAN - Edition Pages" launch document, taken from the content inventory drafts in scripts/inventory_units/allplan.py.
// tests/test_allplan_2027_pages.py keeps this file identical to those drafts. The feature labels are the product names each source sentence starts with.
export interface AllplanEdition2027 {
  slug: string;
  name: string;
  path: string;
  productPath: string;
  eyebrow: string;
  title: string;
  intro: string;
  features: readonly { label: string; text: string }[];
}

export interface Release2027Band {
  title: string;
  href: string;
}

export const editions: readonly AllplanEdition2027[] = [
  {
    "slug": "basic",
    "name": "Allplan Basic",
    "path": "/2027/allplan-basic",
    "productPath": "/products/allplan-basic",
    "eyebrow": "SÜRÜM 2027",
    "title": "Allplan Basic'teki Yenilikler",
    "intro": "Allplan Basic, güvenilir 2B çizime, temel 3B modellemeye ve bulut tabanlı iş birliğine ihtiyaç duyan ekipler için giriş seviyesi CAD çözümüdür. Çizim oluşturmak, teslim dokümanları üretmek ve proje verisini verimli biçimde paylaşmak için temel araçları sunar. İleri düzey mimari BIM iş akışları, kaliteli metrajlar ve parametrik yapı bileşenleri için Allplan Concept veya üst sürümlerini inceleyin.",
    "features": [
      {
        "label": "Allplan Max",
        "text": "Allplan Max, mühendislere Allplan'ı ekiplerinin gerçekten çalıştığı biçime göre özelleştirme konusunda daha fazla güç ve özgürlük verir; yapay zekâ rehberliğinden otomatik iş akışlarına ve proje içgörüsüne kadar."
      },
      {
        "label": "BIM'e hazır ipuçları",
        "text": "BIM'e hazır ipuçları, önemli nesne bilgilerini fareyle üzerine gelindiğinde göstererek ekiplerin model verisini daha hızlı denetlemesine ve karmaşık BIM projelerinde kontrolü elde tutmasına yardımcı olur."
      },
      {
        "label": "Mark Numbering 2.0",
        "text": "Mark Numbering 2.0, modeller değiştikçe tanımlayıcıların tutarlı kalmasını sağlar; metrajların, listelerin ve dokümantasyonun daha az elle yeniden numaralandırmayla uyumlu kalmasına yardımcı olur."
      }
    ]
  },
  {
    "slug": "concept",
    "name": "Allplan Concept",
    "path": "/2027/allplan-concept",
    "productPath": "/products/allplan-concept",
    "eyebrow": "SÜRÜM 2027",
    "title": "Allplan Concept'teki Yenilikler",
    "intro": "Allplan Concept, erken tasarımdan teslimata kadar güvenilir modelleme, görselleştirme ve dokümantasyona ihtiyaç duyan mimari ekipler için bir BIM çözümüdür. Binalar için eksiksiz mimari tasarım sürecini destekler; sezgisel BIM iş akışlarını, doğru metrajları ve yüksek kaliteli dokümantasyonu tek bir entegre platformda birleştirir.",
    "features": [
      {
        "label": "Allplan Max",
        "text": "Allplan Max, mühendislere Allplan'ı ekiplerinin gerçekten çalıştığı biçime göre özelleştirme konusunda daha fazla güç ve özgürlük verir; yapay zekâ rehberliğinden otomatik iş akışlarına ve proje içgörüsüne kadar."
      },
      {
        "label": "Cloud BIM Manager",
        "text": "Cloud BIM Manager, ekiplerin BIM verilerini ve metrajlarını incelemesine, filtrelemesine, düzenlemesine ve değerlendirmesine yardımcı olur; model bilgisini kullanılabilir proje içgörüsüne dönüştürür."
      },
      {
        "label": "Mark Numbering 2.0",
        "text": "Mark Numbering 2.0, modeller değiştikçe tanımlayıcıların tutarlı kalmasını sağlar; metrajların, listelerin ve dokümantasyonun daha az elle yeniden numaralandırmayla uyumlu kalmasına yardımcı olur."
      }
    ]
  },
  {
    "slug": "professional",
    "name": "Allplan Professional",
    "path": "/2027/allplan-professional",
    "productPath": "/products/allplan-professional",
    "eyebrow": "SÜRÜM 2027",
    "title": "Allplan Professional'daki Yenilikler",
    "intro": "Allplan Professional, yüksek performanslı modelleme, detaylandırma ve otomasyona ihtiyaç duyan mimari ve mühendislik ekipleri için güçlü bir BIM çözümüdür. Binalar, yollar ve altyapı yapıları için eksiksiz tasarım ve detaylandırma sürecini destekler; hassasiyeti, hızı ve esnekliği tek bir entegre platformda birleştirir.",
    "features": [
      {
        "label": "Allplan Max",
        "text": "Allplan Max, mühendislere Allplan'ı ekiplerinin gerçekten çalıştığı biçime göre özelleştirme konusunda daha fazla güç ve özgürlük verir; yapay zekâ rehberliğinden otomatik iş akışlarına ve proje içgörüsüne kadar."
      },
      {
        "label": "Donatı iş akışı otomasyonu",
        "text": "Donatı iş akışının daha büyük bölümünü otomatikleştirin: daha akıllı düzenleme, daha güçlü kiriş ve duvar donatısı, yapay zekâ destekli etiket yerleştirme ve gruplanmış çakışma yönetimi."
      },
      {
        "label": "Cloud BIM Manager ve Mark Numbering 2.0",
        "text": "Cloud BIM Manager ve Mark Numbering 2.0, ekiplerin BIM verilerini, metrajlarını ve dokümantasyonunu daha yüksek hız, tutarlılık ve güvenle yönetmesine yardımcı olur."
      }
    ]
  },
  {
    "slug": "ultimate",
    "name": "Allplan Ultimate",
    "path": "/2027/allplan-ultimate",
    "productPath": "/products/allplan-ultimate",
    "eyebrow": "SÜRÜM 2027",
    "title": "Allplan Ultimate'teki Yenilikler",
    "intro": "Allplan Ultimate, tasarımdan inşaya uzanan uçtan uca iş akışları için nihai BIM çözümüdür. Ekiplerin karmaşık bina ve altyapı projelerini tasarlamasını, detaylandırmasını ve teslim etmesini; ileri modelleme, ön üretim ve inşaat iş akışlarını birleştiren tek bir entegre platformda mümkün kılar.",
    "features": [
      {
        "label": "Allplan Max",
        "text": "Allplan Max, mühendislere Allplan'ı ekiplerinin gerçekten çalıştığı biçime göre özelleştirme konusunda daha fazla güç ve özgürlük verir; yapay zekâ rehberliğinden otomatik iş akışlarına ve proje içgörüsüne kadar."
      },
      {
        "label": "Donatı iş akışı otomasyonu",
        "text": "Donatı iş akışının daha büyük bölümünü otomatikleştirin: daha akıllı düzenleme, daha güçlü kiriş ve duvar donatısı, yapay zekâ destekli etiket yerleştirme ve gruplanmış çakışma yönetimi."
      },
      {
        "label": "Cloud BIM Manager ve Mark Numbering 2.0",
        "text": "Cloud BIM Manager ve Mark Numbering 2.0, ekiplerin BIM verilerini, metrajlarını ve dokümantasyonunu daha yüksek hız, tutarlılık ve güvenle yönetmesine yardımcı olur."
      }
    ]
  }
];

// Existing (2026) product pages that link to their 2027 news page from a band under the hero.
export const release2027Bands: Record<string, Release2027Band> = {
  "/products/allplan-basic": {
    "title": "Allplan Basic'teki Yenilikler",
    "href": "/2027/allplan-basic"
  },
  "/products/allplan-concept": {
    "title": "Allplan Concept'teki Yenilikler",
    "href": "/2027/allplan-concept"
  },
  "/products/allplan-professional": {
    "title": "Allplan Professional'daki Yenilikler",
    "href": "/2027/allplan-professional"
  },
  "/products/allplan-ultimate": {
    "title": "Allplan Ultimate'teki Yenilikler",
    "href": "/2027/allplan-ultimate"
  },
  "/products/civil": {
    "title": "Allplan Civil'deki Yenilikler",
    "href": "/2027/civil"
  }
};
