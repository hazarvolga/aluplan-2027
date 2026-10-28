"""SCIA Engineer — product page and three edition pages."""

from __future__ import annotations

from .core import Page, Unit, ref, shared_unit

SRC = "scia--new-text-and-images-scia-pages"

PAGES = [
    Page(
        slug="scia-editions",
        title="SCIA sürüm sayfaları (Concept / Professional / Ultimate)",
        routes=("/products/scia",),
        summary=(
            "Üç sürüm ve ürün sayfası yenilikler paragrafı. Özellik metinleri üç sürümde "
            "büyük ölçüde aynı; tek satır tanımlanır ve sürümler referans verir. Bu ürün için "
            "de mevcut mimaride rota yok."
        ),
        open_questions=(
            "SCIA için yeni rota yapısı nedir (`/products/scia`, `/products/scia-concept` …)?",
            "Kaynakta görsel dosya adları uzantısız (`SCIA2027-AI-Center-04`); hangi görseller "
            "yayında kullanılacak?",
        ),
    ),
]

SHARED = {
    "scia.eyebrow": shared_unit("scia.eyebrow", "eyebrow", SRC, "b16", "SÜRÜM 2027"),
    "scia.ai.title": shared_unit("scia.ai.title", "feature-title", SRC, "b20",
                                 "Yol boyunca yapay zekâ desteği"),
    "scia.ai.body": shared_unit(
        "scia.ai.body",
        "feature-body",
        SRC,
        "b22",
        "AI Coach, deneyimsiz kullanıcılara rehberlik ederek zaman kazandırır ve dış desteğe "
        "bağımlılıklarını azaltır. AI Structural Analyzer, ham sonuçları otomatik olarak yorumlar, "
        "kritik noktaları işaretler ve mühendislerin daha hızlı karar vermesine yardımcı olur.",
    ),
    "scia.load.title": shared_unit("scia.load.title", "feature-title", SRC, "b27", "Yük indirgeme"),
    "scia.load.body": shared_unit(
        "scia.load.body",
        "feature-body",
        SRC,
        "b29",
        "Mühendislerin yük yollarını hızla belirlemesini, yapıyı anlamasını ve temel tasarımı ile "
        "geoteknik için doğru veri sağlamasını sağlar. Özellikle projenin erken aşamalarında zaman "
        "kazandırır ve modelleme hatalarının ortadan kaldırılmasına yardımcı olur.",
    ),
    "scia.concrete.title": shared_unit("scia.concrete.title", "feature-title", SRC, "b34",
                                       "Betonarme 2. Nesil Eurocode'lar 1D - EN 1992-1-1"),
    "scia.concrete.body": shared_unit(
        "scia.concrete.body",
        "feature-body",
        SRC,
        "b36",
        "Betonarme için 2. nesil Eurocode'ların zorunlu kabulünden önce sunulması, mevcut 2. nesil "
        "yeteneklerini genişletir. Mühendislerin yeni yönetmelikleri önceden keşfetmesine ve "
        "değerlendirmesine olanak tanıyarak erken benimsemeyi mümkün kılar.",
    ),
    "scia.tda.title": shared_unit("scia.tda.title", "feature-title", SRC, "b89",
                                  "Zamana bağlı analiz"),
    "scia.tda.body": shared_unit(
        "scia.tda.body",
        "feature-body",
        SRC,
        "b91",
        "Özellikle köprüler ve geniş açıklıklı yapılar için kritik olan entegre TDA, uzun vadeli "
        "olguların harici araçlarda değerlendirilmesi ihtiyacını ortadan kaldırır. Uzun vadeli "
        "etkileri dikkate alan doğru sonuçlar, güvenli ve ekonomik tasarımı garanti eder.",
    ),
}

EDITIONS = [
    ("concept", "SCIA Concept", "b12", "b18", [("ai", 1, 1), ("load", 2, 2), ("concrete", 3, 3)], ""),
    ("professional", "SCIA Professional", "b43", "b49",
     [("ai", 1, 1), ("load", 2, 2), ("concrete", 3, 3)], ""),
    ("ultimate", "SCIA Ultimate", "b74", "b80",
     [("ai", 1, 1), ("tda", 2, 2), ("load", 3, 3)], ""),
]

INTRO_TR = {
    "concept": "SCIA Concept, günlük yapı projeleri için güvenilir modelleme ve analize ihtiyaç "
               "duyan mühendisler için erişilebilir bir strüktürel analiz ve tasarım çözümüdür. "
               "Strüktürel modeller oluşturun, temel analizi yapın ve tasarımları akıcı bir "
               "mühendislik ortamında verimli biçimde doğrulayın. 2027 sürümünde eklenen entegre "
               "yapay zekâ, yönlendirmeli başlangıçtan sonuçların destekli değerlendirmesine "
               "kadar zamanınızı kazandırır ve mühendislik uzmanlığınıza tam olarak odaklanmanıza "
               "yardımcı olur.",
    "professional": "SCIA Professional, günlük bina ve altyapı projelerinde çalışan mühendisler "
                    "için güçlü bir strüktürel analiz ve tasarım çözümüdür. Güvenilir tasarım ve "
                    "BIM tabanlı iş akışları için kurulmuş, mühendis odaklı tek bir ortamda "
                    "verimli çalışın. 2027 sürümüyle yük yollarını daha iyi anlayabilir ve 2. "
                    "nesil Eurocode'ları önceden benimseyebilirsiniz. Yerleşik AI Centre, tam "
                    "olarak mühendislik uzmanlığınıza odaklanmanıza ve güvenle karar vermenize "
                    "yardımcı olur.",
    "ultimate": "SCIA Ultimate, günlük yapılardan ömürde bir kez karşılaşılan projelere kadar her "
                "ölçekte çalışan mühendisler için güçlü, çok malzemeli bir strüktürel analiz ve "
                "tasarım çözümüdür. Karmaşık yapıları tek bir entegre, mühendis odaklı ortamda "
                "doğru biçimde analiz edin, tasarlayın ve doğrulayın. Yeni eklenen zamana bağlı "
                "analiz, yük yollarının erken belirlenmesi ve entegre yapay zekâ desteği, "
                "mühendislik uzmanlığınıza tam olarak odaklanmanıza ve tam bir güvenle karar "
                "vermenize yardımcı olur.",
}

TITLE_TR = {
    "concept": "SCIA Concept'teki Yenilikler",
    "professional": "SCIA Professional'daki Yenilikler",
    "ultimate": "SCIA Ultimate'teki Yenilikler",
}

UNITS = [
    Unit(
        id="scia.product.whats-new",
        page="scia-editions",
        role="whats-new",
        source=SRC,
        block="b6",
        tr="SCIA Engineer 2027, zamanınızı kazandıran yapay zekâ ekliyor. Zamana bağlı analiz, "
        "geniş açıklıklı yapıları tek platformda ele alarak veri aktarımından kaynaklanan hataları "
        "ortadan kaldırıyor. Yük indirgeme, temel tasarımı için hızlı girdi sağlıyor.",
    ),
]

for key, _label, intro_block, title_block, features, note in EDITIONS:
    UNITS.append(
        Unit(
            id=f"scia.{key}.intro",
            page="scia-editions",
            role="intro",
            source=SRC,
            block=intro_block,
            tr=INTRO_TR[key],
        )
    )
    UNITS.append(ref(f"scia.{key}.eyebrow", "scia-editions", "eyebrow", "scia.eyebrow"))
    UNITS.append(
        Unit(
            id=f"scia.{key}.section-title",
            page="scia-editions",
            role="section-title",
            source=SRC,
            block=title_block,
            tr=TITLE_TR[key],
            note=note,
        )
    )
    for feature, order, _index in features:
        UNITS.append(
            ref(f"scia.{key}.feature-{order}.title", "scia-editions", "feature-title",
                f"scia.{feature}.title")
        )
        UNITS.append(
            ref(f"scia.{key}.feature-{order}.body", "scia-editions", "feature-body",
                f"scia.{feature}.body")
        )
