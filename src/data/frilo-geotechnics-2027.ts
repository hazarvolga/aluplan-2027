// Turkish text of the FRILO geotechnics part of the "FRILO - Edition Pages" launch document, taken from the content inventory drafts in scripts/inventory_units/frilo.py.
// tests/test_frilo_geotechnics.py keeps this file identical to those drafts.
export interface FriloGeotechnicsEdition {
  name: string;
  intro: string;
  newsTitle?: string;
  features: readonly { title: string; text: string }[];
}

export interface FriloGeotechnics {
  lead: string;
  editions: readonly FriloGeotechnicsEdition[];
}

export const geotechnics: FriloGeotechnics = {
  "lead": "FRILO 2027 birkaç yenilik getiriyor. Bu son sürümle hâlihazırda uygulanmış 2. nesil Eurocode'larla bir adım önde olur, entegre yapay zekâ desteğinin araç içinde sunduğu anında ve sohbet tabanlı yardımla zaman kazanırsınız.",
  "editions": [
    {
      "name": "FRILO Geotechnics Concept",
      "intro": "FRILO Geotechnics Concept, standart temeller ve zemin işleri için pratik bir giriş noktası sunar. Geoteknik mühendislerine ve strüktür tasarımcılarına yaygın temel doğrulamaları, zemin basıncı kontrolleri, oturma tahmini ve net geoteknik dokümantasyon için odaklı bir araç seti verir. 2027 sürümü, hâlihazırda uygulanmış 2. nesil Eurocode'larla bir adım önde olmanıza yardımcı olur. Entegre AI Center'ın sunduğu anında ve sohbet tabanlı destekle zaman kazanırsınız.",
      "newsTitle": "FRILO Geotechnics Concept'teki Yenilikler",
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
          "title": "Entegre zemin katmanı modelleme",
          "text": "Allplan kullanıcıları sondaj girdisini Allplan'da tanımlayabilir, arka planda geoteknik hesaplamayı tetikleyebilir ve modellenen zemin katmanlarını 3B geometri olarak geri alabilir. Bu, zaman kazandırır ve ayrı geoteknik araçlara ve modellere ihtiyaç duymayı ortadan kaldırır."
        }
      ]
    },
    {
      "name": "FRILO Geotechnics Professional Pit",
      "intro": "FRILO Geotechnics Professional Pit, kazı çukurlarını ve destek sistemlerini düzenli olarak tasarlayan ve doğrulayan ofisler için uyarlanmıştır. Concept kapsamını çukur stabilitesi, yapım aşamaları, zemin basınçları ve güvenli, ekonomik geçici iş tasarımı için daha derin araçlarla genişletir. FRILO 2027 ile hâlihazırda uygulanmış 2. nesil Eurocode'larla bir adım önde olur, entegre yapay zekâ desteğinin anında ve sohbet tabanlı yardımıyla zaman kazanırsınız.",
      "newsTitle": "FRILO Geotechnics Professional Pit'teki Yenilikler",
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
          "title": "Entegre zemin katmanı modelleme",
          "text": "Allplan kullanıcıları sondaj girdisini Allplan'da tanımlayabilir, arka planda geoteknik hesaplamayı tetikleyebilir ve modellenen zemin katmanlarını 3B geometri olarak geri alabilir. Bu, zaman kazandırır ve ayrı geoteknik araçlara ve modellere ihtiyaç duymayı ortadan kaldırır."
        }
      ]
    },
    {
      "name": "FRILO Geotechnics Professional Retaining",
      "intro": "FRILO Geotechnics Professional Retaining sürümü, standart temel kontrollerinin ötesinde özel istinat duvarı doğrulamasına ihtiyaç duyan firmalar için tasarlanmıştır. Concept kapsamını konsol ve ağırlık istinat duvarları, zemin basıncı yüklemesi ve stabilite değerlendirmesi için odaklı araçlarla genişletir. FRILO 2027 ile hâlihazırda uygulanmış 2. nesil Eurocode'larla bir adım önde olur, entegre yapay zekâ desteğinin anında ve sohbet tabanlı yardımıyla zaman kazanırsınız.",
      "newsTitle": "FRILO Geotechnics Professional Retaining'deki Yenilikler",
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
          "title": "Entegre zemin katmanı modelleme",
          "text": "Allplan kullanıcıları sondaj girdisini Allplan'da tanımlayabilir, arka planda geoteknik hesaplamayı tetikleyebilir ve modellenen zemin katmanlarını 3B geometri olarak geri alabilir. Bu, zaman kazandırır ve ayrı geoteknik araçlara ve modellere ihtiyaç duymayı ortadan kaldırır."
        }
      ]
    },
    {
      "name": "FRILO Geotechnics Ultimate",
      "intro": "FRILO Geotechnics Ultimate, temeller, zemin işleri, çukurlar, istinat yapıları ve zemin mekaniği için tüm geoteknik sürüm kapsamını tek bir pakette birleştirir. Zemin araştırmasına dayalı analizden koordineli ve incelemeye hazır tasarım çıktısına kadar en geniş geoteknik iş akışına ihtiyaç duyan ofisler için geliştirilmiştir. FRILO 2027 ile hâlihazırda uygulanmış 2. nesil Eurocode'larla bir adım önde olun; entegre AI Center'ın sunduğu anında ve sohbet tabanlı destekle zaman kazanın.",
      "newsTitle": "FRILO Geotechnics Ultimate'teki Yenilikler",
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
          "title": "Entegre zemin katmanı modelleme",
          "text": "Allplan kullanıcıları sondaj girdisini Allplan'da tanımlayabilir, arka planda geoteknik hesaplamayı tetikleyebilir ve modellenen zemin katmanlarını 3B geometri olarak geri alabilir. Bu, zaman kazandırır ve ayrı geoteknik araçlara ve modellere ihtiyaç duymayı ortadan kaldırır."
        }
      ]
    },
    {
      "name": "FRILO Geotechnics Soil Mechanics",
      "intro": "FRILO Geotechnics Soil Mechanics, zemin altı araştırmalarının dijital değerlendirmesi ve dokümantasyonu için program grubudur: arazi ve laboratuvar deneylerinden sondaj loglarına ve araştırma noktalarının GIS tabanlı yönetimine kadar. 2027 sürümü, 7/24 sohbet tabanlı uzman desteği sunarak oryantasyon süresini ve kılavuzlara, geçici yardıma bağımlılığı azaltır. Soruları anında yanıtlayarak eğitim maliyetlerini ve destek taleplerini düşürür.",
      "features": []
    }
  ]
};
