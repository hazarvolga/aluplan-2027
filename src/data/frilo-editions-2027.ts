// Turkish 2027 news of the five FRILO editions from the "FRILO - Edition Pages" launch document, taken from the content inventory drafts in scripts/inventory_units/frilo.py.
// tests/test_frilo_edition_news.py keeps this file identical to those drafts.
export interface FriloEditionNews {
  name: string;
  newsTitle: string;
  features: readonly { title: string; text: string }[];
}

export const friloEditionNews: readonly FriloEditionNews[] = [
  {
    "name": "FRILO Concept",
    "newsTitle": "FRILO Concept'teki Yenilikler",
    "features": [
      {
        "title": "Entegre Yapay Zekâ Desteği",
        "text": "Tanıdık FRILO ortamınızdan ayrılmadan yapay zekâ desteğinden tam olarak yararlanın. Entegre AI Center, 7/24 sohbet tabanlı uzman desteği sunarak oryantasyon süresini ve kılavuzlara, geçici yardıma bağımlılığı azaltır."
      },
      {
        "title": "CLT panellerin gerçekçi modellenmesi",
        "text": "Kullanıcılar, tanıdık kat kat GEO iş akışında kalarak ahşap ve hibrit binalar için daha doğru analiz elde eder. Bu, mükerrer modelleme işini azaltır ve global bina analizini CLT tasarımıyla kesintisiz bir iş akışında birleştirir."
      },
      {
        "title": "2. nesil Eurocode'lara hazır olun",
        "text": "Çelik, geoteknik ve seçili betonarme iş akışları için yeni yönetmelikleri zorunlu hâle gelmeden önce keşfedin ve değerlendirin. Yeni yönetmelikler zorunlu olduğunda zaman kaybetmeyin ve rakiplerinizin önünde kalın."
      }
    ]
  },
  {
    "name": "FRILO Professional Concrete",
    "newsTitle": "FRILO Professional Concrete'teki Yenilikler",
    "features": [
      {
        "title": "Entegre Yapay Zekâ Desteği",
        "text": "Tanıdık FRILO ortamınızdan ayrılmadan yapay zekâ desteğinden tam olarak yararlanın. Entegre AI Center, 7/24 sohbet tabanlı uzman desteği sunarak oryantasyon süresini ve kılavuzlara, geçici yardıma bağımlılığı azaltır."
      },
      {
        "title": "2. nesil Eurocode'lara hazır olun",
        "text": "Çelik, geoteknik ve seçili betonarme iş akışları için yeni yönetmelikleri zorunlu hâle gelmeden önce keşfedin ve değerlendirin. Yeni yönetmelikler zorunlu olduğunda zaman kaybetmeyin ve rakiplerinizin önünde kalın."
      },
      {
        "title": "Güncellenmiş Schöck Isokorb entegrasyonu",
        "text": "Schöck diyaloğu ve API arayüzü yeni ürünleri ve ülkeye özel yerelleştirmeyi içerir. Mühendisler, güncel ürün verilerine, yönetmelik ayarlarına ve dil seçeneklerine erişerek Schöck Isokorb ısı yalıtım çözümlerini doğrudan tasarlayabilir."
      }
    ]
  },
  {
    "name": "FRILO Professional Steel",
    "newsTitle": "FRILO Professional Steel'deki Yenilikler",
    "features": [
      {
        "title": "Birleşik Bağlantı Tasarımı",
        "text": "FRILO 2027, farklı bağlantı tipleriyle çalışmayı basitleştirir ve hızlandırır. Bağımsız araçlar arasında geçiş yapmayı ortadan kaldırarak zaman kazandırır ve mühendislerin kesintisiz tek bir tasarım iş akışında daha etkili çalışmasını sağlar."
      },
      {
        "title": "Entegre Yapay Zekâ Desteği",
        "text": "Tanıdık FRILO ortamınızdan ayrılmadan yapay zekâ desteğinden tam olarak yararlanın. Entegre AI Center, 7/24 sohbet tabanlı uzman desteği sunarak oryantasyon süresini ve kılavuzlara, geçici yardıma bağımlılığı azaltır."
      },
      {
        "title": "2. nesil Eurocode'lara hazır olun",
        "text": "Çelik, geoteknik ve seçili betonarme iş akışları için yeni yönetmelikleri zorunlu hâle gelmeden önce keşfedin ve değerlendirin. Yeni yönetmelikler zorunlu olduğunda zaman kaybetmeyin ve rakiplerinizin önünde kalın."
      }
    ]
  },
  {
    "name": "FRILO Professional Timber",
    "newsTitle": "FRILO Professional Timber'daki Yenilikler",
    "features": [
      {
        "title": "CLT döşemeler için özel 2B tasarım",
        "text": "Kullanıcılar, tanıdık bir iş akışında kalarak ahşap ve hibrit binalar için daha doğru analiz elde eder. Bu, mükerrer modelleme işini azaltır ve global bina analizini doğru CLT tasarımıyla kesintisiz bir iş akışında birleştirir."
      },
      {
        "title": "Entegre Yapay Zekâ Desteği",
        "text": "Tanıdık FRILO ortamınızdan ayrılmadan yapay zekâ desteğinden tam olarak yararlanın. Entegre AI Center, 7/24 sohbet tabanlı uzman desteği sunarak oryantasyon süresini ve kılavuzlara, geçici yardıma bağımlılığı azaltır."
      },
      {
        "title": "FRILO Framework'ten SCIA'ya aktarım",
        "text": "Belirli bir proje için daha karmaşık, tam 3B analiz gerekiyorsa strüktür mühendisleri modelleri yeniden modellemeden FRILO Framework'ten SCIA Engineer'a aktarabilir. Aktarım hatasızdır ve zaman kazandırır."
      }
    ]
  },
  {
    "name": "FRILO Ultimate",
    "newsTitle": "FRILO Ultimate'teki Yenilikler",
    "features": [
      {
        "title": "Birleşik Bağlantı Tasarımı",
        "text": "FRILO 2027, farklı bağlantı tipleriyle çalışmayı basitleştirir ve hızlandırır. Bağımsız araçlar arasında geçiş yapmayı ortadan kaldırarak zaman kazandırır ve mühendislerin kesintisiz tek bir tasarım iş akışında daha etkili çalışmasını sağlar."
      },
      {
        "title": "CLT panellerin gerçekçi modellenmesi",
        "text": "Kullanıcılar, tanıdık kat kat GEO iş akışında kalarak ahşap ve hibrit binalar için daha doğru analiz elde eder. Bu, mükerrer modelleme işini azaltır ve global bina analizini CLT tasarımıyla kesintisiz bir iş akışında birleştirir."
      },
      {
        "title": "Entegre Yapay Zekâ Desteği",
        "text": "Tanıdık FRILO ortamınızdan ayrılmadan yapay zekâ desteğinden tam olarak yararlanın. Entegre AI Center, 7/24 sohbet tabanlı uzman desteği sunarak oryantasyon süresini ve kılavuzlara, geçici yardıma bağımlılığı azaltır."
      }
    ]
  }
];
