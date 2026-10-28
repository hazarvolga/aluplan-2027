"""FRILO — product page, 5 structural and 5 geotechnics edition pages.

Ten editions share a small set of feature texts (AI assistance, Eurocodes,
CLT, Schöck, connections, soil layers). Each shared text is defined once and
referenced by every edition that uses it, so a wording change happens in one
place and the per-edition tables stay readable.
"""

from __future__ import annotations

from .core import Page, Unit, ref, shared_unit

SRC = "frilo--new-text-and-images-frilo-edition-pages-copy"

PAGES = [
    Page(
        slug="frilo-editions",
        title="FRILO sürüm sayfaları (5 strüktürel + 5 geoteknik)",
        routes=("/products/frilo",),
        summary=(
            "Tek belgede on sürüm. Strüktürel sürümler ortak ürün tanıtım paragrafını; "
            "geoteknik sürümler kendi paragrafını kullanır. Mevcut bilgi mimarisinde FRILO "
            "sayfası hiç yok; burada yeni rota önerilir."
        ),
        open_questions=(
            "FRILO için hangi rota yapısı: tek `/products/frilo` sayfası mı, sürüm başına "
            "sayfa mı (`/products/frilo-concept` …)?",
            "Geotechnics Ultimate bölüm başlığı kaynakta hatalı (Retaining metni taşınmış); "
            "üreticiye sorulmalı mı, düzeltilmesi varsayılabilir mi?",
        ),
    ),
]

SHARED = {
    "frilo.eyebrow": shared_unit("frilo.eyebrow", "eyebrow", SRC, "b16", "SÜRÜM 2027"),
    # Özellik başlık + gövde çiftleri
    "frilo.ai.title": shared_unit("frilo.ai.title", "feature-title", SRC, "b20",
                                  "Entegre Yapay Zekâ Desteği"),
    "frilo.ai.body": shared_unit(
        "frilo.ai.body",
        "feature-body",
        SRC,
        "b21",
        "Tanıdık FRILO ortamınızdan ayrılmadan yapay zekâ desteğinden tam olarak yararlanın. Entegre "
        "AI Center, 7/24 sohbet tabanlı uzman desteği sunarak oryantasyon süresini ve kılavuzlara, "
        "geçici yardıma bağımlılığı azaltır.",
    ),
    "frilo.clt-model.title": shared_unit("frilo.clt-model.title", "feature-title", SRC, "b25",
                                         "CLT panellerin gerçekçi modellenmesi"),
    "frilo.clt-model.body": shared_unit(
        "frilo.clt-model.body",
        "feature-body",
        SRC,
        "b26",
        "Kullanıcılar, tanıdık kat kat GEO iş akışında kalarak ahşap ve hibrit binalar için daha "
        "doğru analiz elde eder. Bu, mükerrer modelleme işini azaltır ve global bina analizini CLT "
        "tasarımıyla kesintisiz bir iş akışında birleştirir.",
    ),
    "frilo.eurocodes.title": shared_unit("frilo.eurocodes.title", "feature-title", SRC, "b30",
                                         "2. nesil Eurocode'lara hazır olun"),
    "frilo.eurocodes.body": shared_unit(
        "frilo.eurocodes.body",
        "feature-body",
        SRC,
        "b31",
        "Çelik, geoteknik ve seçili betonarme iş akışları için yeni yönetmelikleri zorunlu hâle "
        "gelmeden önce keşfedin ve değerlendirin. Yeni yönetmelikler zorunlu olduğunda zaman "
        "kaybetmeyin ve rakiplerinizin önünde kalın.",
    ),
    "frilo.schock.title": shared_unit("frilo.schock.title", "feature-title", SRC, "b55",
                                      "Güncellenmiş Schöck Isokorb entegrasyonu"),
    "frilo.schock.body": shared_unit(
        "frilo.schock.body",
        "feature-body",
        SRC,
        "b56",
        "Schöck diyaloğu ve API arayüzü yeni ürünleri ve ülkeye özel yerelleştirmeyi içerir. "
        "Mühendisler, güncel ürün verilerine, yönetmelik ayarlarına ve dil seçeneklerine erişerek "
        "Schöck Isokorb ısı yalıtım çözümlerini doğrudan tasarlayabilir.",
    ),
    "frilo.connections.title": shared_unit("frilo.connections.title", "feature-title", SRC, "b70",
                                           "Birleşik Bağlantı Tasarımı"),
    "frilo.connections.body": shared_unit(
        "frilo.connections.body",
        "feature-body",
        SRC,
        "b71",
        "FRILO 2027, farklı bağlantı tipleriyle çalışmayı basitleştirir ve hızlandırır. Bağımsız "
        "araçlar arasında geçiş yapmayı ortadan kaldırarak zaman kazandırır ve mühendislerin "
        "kesintisiz tek bir tasarım iş akışında daha etkili çalışmasını sağlar.",
    ),
    "frilo.clt-slab.title": shared_unit("frilo.clt-slab.title", "feature-title", SRC, "b95",
                                        "CLT döşemeler için özel 2B tasarım"),
    "frilo.clt-slab.body": shared_unit(
        "frilo.clt-slab.body",
        "feature-body",
        SRC,
        "b96",
        "Kullanıcılar, tanıdık bir iş akışında kalarak ahşap ve hibrit binalar için daha doğru "
        "analiz elde eder. Bu, mükerrer modelleme işini azaltır ve global bina analizini doğru CLT "
        "tasarımıyla kesintisiz bir iş akışında birleştirir.",
    ),
    "frilo.scia-export.title": shared_unit("frilo.scia-export.title", "feature-title", SRC, "b105",
                                           "FRILO Framework'ten SCIA'ya aktarım"),
    "frilo.scia-export.body": shared_unit(
        "frilo.scia-export.body",
        "feature-body",
        SRC,
        "b106",
        "Belirli bir proje için daha karmaşık, tam 3B analiz gerekiyorsa strüktür mühendisleri "
        "modelleri yeniden modellemeden FRILO Framework'ten SCIA Engineer'a aktarabilir. Aktarım "
        "hatasızdır ve zaman kazandırır.",
    ),
    "frilo.soil.title": shared_unit("frilo.soil.title", "feature-title", SRC, "b160",
                                    "Entegre zemin katmanı modelleme"),
    "frilo.soil.body": shared_unit(
        "frilo.soil.body",
        "feature-body",
        SRC,
        "b161",
        "Allplan kullanıcıları sondaj girdisini Allplan'da tanımlayabilir, arka planda geoteknik "
        "hesaplamayı tetikleyebilir ve modellenen zemin katmanlarını 3B geometri olarak geri "
        "alabilir. Bu, zaman kazandırır ve ayrı geoteknik araçlara ve modellere ihtiyaç duymayı "
        "ortadan kaldırır.",
    ),
}

FEATURE_KEYS = [
    ("clt-model", ("frilo.clt-model.title", "frilo.clt-model.body")),
    ("eurocodes", ("frilo.eurocodes.title", "frilo.eurocodes.body")),
    ("ai", ("frilo.ai.title", "frilo.ai.body")),
    ("schock", ("frilo.schock.title", "frilo.schock.body")),
    ("connections", ("frilo.connections.title", "frilo.connections.body")),
    ("clt-slab", ("frilo.clt-slab.title", "frilo.clt-slab.body")),
    ("scia-export", ("frilo.scia-export.title", "frilo.scia-export.body")),
    ("soil", ("frilo.soil.title", "frilo.soil.body")),
]

EDITIONS = [
    # (anahtar, Türkçe ad, girişbloğu, başlık bloğu, özellik sırası, not)
    ("concept", "FRILO Concept", "b12", "b18", ["ai", "clt-model", "eurocodes"], ""),
    ("professional-concrete", "FRILO Professional Concrete", "b37", "b43",
     ["ai", "eurocodes", "schock"], ""),
    ("professional-steel", "FRILO Professional Steel", "b62", "b68",
     ["connections", "ai", "eurocodes"], ""),
    ("professional-timber", "FRILO Professional Timber", "b87", "b93",
     ["clt-slab", "ai", "scia-export"], ""),
    ("ultimate", "FRILO Ultimate", "b112", "b118", ["connections", "clt-model", "ai"], ""),
    ("geotech-concept", "FRILO Geotechnics Concept", "b142", "b148", ["ai", "eurocodes", "soil"], ""),
    ("geotech-pit", "FRILO Geotechnics Professional Pit", "b167", "b173",
     ["ai", "eurocodes", "soil"], ""),
    ("geotech-retaining", "FRILO Geotechnics Professional Retaining", "b192", "b198",
     ["ai", "eurocodes", "soil"], ""),
    ("geotech-ultimate", "FRILO Geotechnics Ultimate", "b217", "b223", ["ai", "eurocodes", "soil"],
     "Kaynakta başlık yanlış: \"… Professional Retaining\" metni Ultimate bölümüne taşınmış. "
     "TR çeviri amalanan başlığa göre yapıldı."),
    ("soil-mechanics", "FRILO Geotechnics Soil Mechanics", "b242", "", [], ""),
]

INTRO_TR = {
    "concept": "FRILO Concept, günlük yapı projeleri için bileşen odaklı tasarıma pratik bir "
               "giriştir. Yük aktarımı, yaygın bileşenler, çatı tasarımı, yığma ve ahşap duvar "
               "kontrolleri için temel modülleri, verimli ve yönetmelikle uyumlu çalışma için "
               "tasarlanmış tek bir sürümde birleştirir. FRILO 2027 tasarımı bir üst seviyeye "
               "taşır: CLT panellerin analizi ve yönetmelik kontrolleri tek ve tutarlı bir iş "
               "akışında yapılır; yapay zekâ desteği ise aracın içinde anında, sohbet tabanlı "
               "destek sunar.",
    "professional-concrete": "FRILO Professional Concrete, FRILO Concept'in pratik iş akışını "
                             "kaybetmeden daha derin betonarme tasarıma ihtiyaç duyan ofisler için "
                             "geliştirilmiştir. Daha zorlu kontroller, daha ayrıntılı detaylandırma "
                             "görevleri ve daha güçlü BIM bağlantılı iş akışları için ileri "
                             "betonarme ve yığma yetenekleri ekler. FRILO 2027 ile hâlihazırda "
                             "uygulanmış 2. nesil Eurocode'larla bir adım önde olur, entegre yapay "
                             "zekâ desteğinin anında ve sohbet tabanlı yardımıyla zaman kazanırsınız.",
    "professional-steel": "FRILO Professional Steel, Concept iş akışını elemanlar, çerçeveler, "
                          "stabilite kontrolleri ve bağlantılar için özel çelik tasarım "
                          "araçlarıyla genişletir. Düzenli olarak çelik yapı tasarlayan ve BIM "
                          "bağlantılı destekle pratik, yönetmelikle uyumlu doğrulama yapması "
                          "gereken ofisleri hedefler. FRILO 2027 ile hâlihazırda uygulanmış 2. "
                          "nesil Eurocode'larla bir adım önde olur, entegre yapay zekâ desteğinin "
                          "araç içinde sunduğu anında ve sohbet tabanlı yardımla zaman kazanırsınız.",
    "professional-timber": "FRILO Professional Timber, kanıtlanmış Concept iş akışına daha derin "
                           "bir ahşap yapı odağı katar. Mühendislik ofislerine ahşap elemanlar, "
                           "çerçeve sistemleri, CLT ve lamine ahşap uygulamaları ile yaygın ahşap "
                           "birleşim doğrulamaları için özel araçlar sunar. FRILO 2027 tasarımı "
                           "bir üst seviyeye taşır: CLT panellerin analizi ve yönetmelik "
                           "kontrolleri tek ve tutarlı bir iş akışında yapılır; yapay zekâ desteği "
                           "ise aracın içinde anında, sohbet tabanlı destek sunar.",
    "ultimate": "FRILO Ultimate, tüm strüktürel FRILO kapsamını tek bir sürümde sunar; betonarme, "
                "çelik, ahşap, yığma, ileri çerçeve sistemleri, BIM bağlantılı iş akışları ve "
                "birleşik raporlamayı bir araya getirir. Malzemeler, proje tipleri ve "
                "karmaşıklık düzeyleri arasında azami esneklik isteyen ofisler için "
                "tasarlanmıştır. FRILO 2027 tasarımı bir üst seviyeye taşır: CLT döşemelerin "
                "analizi tek ve tutarlı bir iş akışında yapılır; yapay zekâ desteği anında, "
                "sohbet tabanlı destek sunar.",
    "geotech-concept": "FRILO Geotechnics Concept, standart temeller ve zemin işleri için pratik "
                       "bir giriş noktası sunar. Geoteknik mühendislerine ve strüktür "
                       "tasarımcılarına yaygın temel doğrulamaları, zemin basıncı kontrolleri, "
                       "oturma tahmini ve net geoteknik dokümantasyon için odaklı bir araç seti "
                       "verir. 2027 sürümü, hâlihazırda uygulanmış 2. nesil Eurocode'larla bir "
                       "adım önde olmanıza yardımcı olur. Entegre AI Center'ın sunduğu anında ve "
                       "sohbet tabanlı destekle zaman kazanırsınız.",
    "geotech-pit": "FRILO Geotechnics Professional Pit, kazı çukurlarını ve destek sistemlerini "
                   "düzenli olarak tasarlayan ve doğrulayan ofisler için uyarlanmıştır. Concept "
                   "kapsamını çukur stabilitesi, yapım aşamaları, zemin basınçları ve güvenli, "
                   "ekonomik geçici iş tasarımı için daha derin araçlarla genişletir. FRILO 2027 "
                   "ile hâlihazırda uygulanmış 2. nesil Eurocode'larla bir adım önde olur, entegre "
                   "yapay zekâ desteğinin anında ve sohbet tabanlı yardımıyla zaman kazanırsınız.",
    "geotech-retaining": "FRILO Geotechnics Professional Retaining sürümü, standart temel "
                         "kontrollerinin ötesinde özel istinat duvarı doğrulamasına ihtiyaç duyan "
                         "firmalar için tasarlanmıştır. Concept kapsamını konsol ve ağırlık "
                         "istinat duvarları, zemin basıncı yüklemesi ve stabilite değerlendirmesi "
                         "için odaklı araçlarla genişletir. FRILO 2027 ile hâlihazırda uygulanmış "
                         "2. nesil Eurocode'larla bir adım önde olur, entegre yapay zekâ "
                         "desteğinin anında ve sohbet tabanlı yardımıyla zaman kazanırsınız.",
    "geotech-ultimate": "FRILO Geotechnics Ultimate, temeller, zemin işleri, çukurlar, istinat "
                        "yapıları ve zemin mekaniği için tüm geoteknik sürüm kapsamını tek bir "
                        "pakette birleştirir. Zemin araştırmasına dayalı analizden koordineli ve "
                        "incelemeye hazır tasarım çıktısına kadar en geniş geoteknik iş akışına "
                        "ihtiyaç duyan ofisler için geliştirilmiştir. FRILO 2027 ile hâlihazırda "
                        "uygulanmış 2. nesil Eurocode'larla bir adım önde olun; entegre AI "
                        "Center'ın sunduğu anında ve sohbet tabanlı destekle zaman kazanın.",
    "soil-mechanics": "FRILO Geotechnics Soil Mechanics, zemin altı araştırmalarının dijital "
                      "değerlendirmesi ve dokümantasyonu için program grubudur: arazi ve "
                      "laboratuvar deneylerinden sondaj loglarına ve araştırma noktalarının GIS "
                      "tabanlı yönetimine kadar. 2027 sürümü, 7/24 sohbet tabanlı uzman desteği "
                      "sunarak oryantasyon süresini ve kılavuzlara, geçici yardıma bağımlılığı "
                      "azaltır. Soruları anında yanıtlayarak eğitim maliyetlerini ve destek "
                      "taleplerini düşürür.",
}

TITLE_TR = {
    "concept": "FRILO Concept'teki Yenilikler",
    "professional-concrete": "FRILO Professional Concrete'teki Yenilikler",
    "professional-steel": "FRILO Professional Steel'deki Yenilikler",
    "professional-timber": "FRILO Professional Timber'daki Yenilikler",
    "ultimate": "FRILO Ultimate'teki Yenilikler",
    "geotech-concept": "FRILO Geotechnics Concept'teki Yenilikler",
    "geotech-pit": "FRILO Geotechnics Professional Pit'teki Yenilikler",
    "geotech-retaining": "FRILO Geotechnics Professional Retaining'deki Yenilikler",
    # Kaynak başlığı hatalı; amaçlanan Ultimate başlığına göre çevrildi.
    "geotech-ultimate": "FRILO Geotechnics Ultimate'teki Yenilikler",
}


UNITS = [
    Unit(
        id="frilo.product.whats-new",
        page="frilo-editions",
        role="whats-new",
        source=SRC,
        block="b6",
        tr="FRILO 2027 birkaç büyük yenilik getiriyor. FRILO Connections tüm bağlantı tiplerini "
        "zaman kazandıran raporlamayla tek ve tutarlı bir araçta birleştiriyor. CLT+, CLT "
        "döşemeleri için özel 2B tasarım ekliyor. AI Coach anında, sohbet tabanlı destek sunuyor.",
    ),
    Unit(
        id="frilo.geotech.whats-new",
        page="frilo-editions",
        role="whats-new",
        source=SRC,
        block="b136",
        tr="FRILO 2027 birkaç yenilik getiriyor. Bu son sürümle hâlihazırda uygulanmış 2. nesil "
        "Eurocode'larla bir adım önde olur, entegre yapay zekâ desteğinin araç içinde sunduğu "
        "anında ve sohbet tabanlı yardımla zaman kazanırsınız.",
    ),
]

for key, _label, intro_block, title_block, features, note in EDITIONS:
    UNITS.append(
        Unit(
            id=f"frilo.{key}.intro",
            page="frilo-editions",
            role="intro",
            source=SRC,
            block=intro_block,
            tr=INTRO_TR[key],
        )
    )
    if title_block:
        UNITS.append(ref(f"frilo.{key}.eyebrow", "frilo-editions", "eyebrow", "frilo.eyebrow"))
        UNITS.append(
            Unit(
                id=f"frilo.{key}.section-title",
                page="frilo-editions",
                role="section-title",
                source=SRC,
                block=title_block,
                tr=TITLE_TR[key],
                note=note or "",
            )
        )
    for order, feature in enumerate(features, start=1):
        title_shared, body_shared = dict(FEATURE_KEYS)[feature]
        UNITS.append(
            ref(
                f"frilo.{key}.feature-{order}.title",
                "frilo-editions",
                "feature-title",
                title_shared,
            )
        )
        UNITS.append(
            ref(
                f"frilo.{key}.feature-{order}.body",
                "frilo-editions",
                "feature-body",
                body_shared,
            )
        )
