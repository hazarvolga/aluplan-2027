# Ana sayfa içerik blokları ve koruma planı

22.10.2026 — Tasarım öncesi plan; metin, URL, uygulama veya schema değişikliği yapılmadı. [Bilgi mimarisi](site-information-architecture.md) ile birlikte okunur. Bu belge içerik yerine geçmez: tam metinler, medya referansları ve hedefler aşağıdaki kaynak snapshotlarında korunur.

## Kanıt ve kapsam

[Mevcut ana sayfa](<00-inventory/interaction-source-evidence/app/(public)/page.tsx>) sekiz bileşeni şu sırayla çağırıyor: HeroV2 → HeroQuickLinks → BimflexAnnouncement → BentoGrid → PathwayProductSystem → InnovationsTeaser → TechSpecsTable → ServicesV2. [Global kaynak incelemesi](00-inventory/global-state-source-review-2026-10-22.md) Header/Footer, rol durumları ve 20 hizmet kaydı için dayanak. Yeni canlı tarama yapılmadı.

Aşağıdaki yerleşim önerisi sekiz bileşenin içerik sorumluluğunu kapsar; canlı UI, her metin/görselin yeni uygulamada birebir taşındığı veya responsive/erişilebilirlik testlerinin geçtiği iddiası değildir. Bu kontroller uygulama sonrasında yapılacak.

## Önerilen sıra ve mevcut blok eşlemesi

| Yeni blok | Mevcut kaynak ve gerçek içerik | Korunacak eylem / medya | Gereksinim ve karar sınırı |
|---|---|---|---|
| H01 — Giriş ve kimlik | [HeroV2](00-inventory/interaction-source-evidence/components/homepage-v2/HeroV2.tsx): `/ ALLPLAN 2026`; “DAHA İYİ BİR GELECEK / İNŞA ETMEK İÇİN TASARLANDI”; AEC/otomasyon/bulut alt metni | `/videos/hero-bim.mp4`, `/images/hero-poster.jpg`, 14 teknik etiket | Aluplan distribütör kimliği görünür olmalı; yeni slogan/metin burada onaylanmıyor. 2026 etiketi otomatik 2027 olmaz. Hareket azaltma, oynatma kontrolü ve medya hatası davranışı tasarım gereksinimi |
| H02 — Hızlı erişimler | [HeroQuickLinks](00-inventory/interaction-source-evidence/components/homepage-v2/HeroQuickLinks.tsx): beş bağlantı | Yenilikleri İncele → `/products/allplan-2026-yenilikler`; ALLPLAN 2026 İncele → `/products/allplan-2026`; ALLPLAN CLOUD VE Genel Geliştirmeler → `/solutions/allplan-bulut-hizmetleri`; ALLPLAN CLOUD Hizmetleri → `/products/allplan-cloud-services`; Eğitim Videoları → `/solutions-v2/training/video-library` | Dördü ürün/sürüm, biri öğrenme erişimi. Görsel sunum değişebilir; kalıcı bulut ile sürüm yeniliği birleştirilmez |
| H03 — Rol ve ürün seçimi | [PathwayProductSystem](00-inventory/interaction-source-evidence/components/homepage-v2/PathwayProductSystem.tsx): “ROLÜNÜZÜ SEÇİN”; MİMAR/Özgür Tasarım, MÜHENDİS/Hassas Analiz, PREKAST/Akıllı Üretim; altı ürün kartı | “Bu Akışı Detaylı İncele” → sırasıyla `/products/architecture`, `/products/allplan-aec`, `/products/precast`; Basic/Concept/Professional/Ultimate/Civil/Precast mevcut ürün hedefleri | Rolü olmayan ziyaretçi de ürünleri görebilmeli. Mevcut vurgulama tüm kartları erişilebilir tutuyor; görünürlük filtresi gibi yeniden yorumlanmaz. Kaynakta bulunan özellik maddeleri ve tüm açıklamalar taşınacak |
| H04 — Çözüm alanları | [BentoGrid](00-inventory/interaction-source-evidence/components/homepage-v2/BentoGrid.tsx): “TEK PLATFORM. TÜM DİSİPLİNLER.”; beş kart | BİNA TASARIMI → `/solutions-v2/building-design`; ALTYAPI TASARIMI → `/solutions-v2/infrastructure`; İNŞAAT PLANLAMASI → `/solutions-v2/construction`; EKLENTİLER → `/solutions-v2/addons`; DİĞER ÇÖZÜMLERİMİZ → `/solutions-v2/other` | Rol ile çözüm aynı sınıflandırma değildir. Alt başlıklar, açıklamalar ve beş ayrı CTA korunacak. Mevcut dört import görsel korunur: architecture-hero, infrastructure-hero, precast-hero, product-engineering; tekrar kullanım silme gerekçesi değil |
| H05 — Paket karşılaştırmasına erişim | [TechSpecsTable](00-inventory/interaction-source-evidence/components/homepage-v2/TechSpecsTable.tsx): “TEKNİK ÖZELLİKLER”; altı paket tanıtımı | Başlık CTA'sı ve **altı kartın tamamı** `/docs/V2026_paket-karsilastirme-Q3-2026_R01.pdf` dosyasına gider | Bu blok çalışan HTML özellik matrisi değildir. H03 ürün kartlarıyla hedefleri farklıdır; birleştirirken PDF erişimi kaybolamaz. Yeni HTML karşılaştırma ayrı öneri, fiyat gösterimi yok |
| H06 — Profesyonel Hizmetler | [ServicesV2](00-inventory/interaction-source-evidence/components/homepage-v2/ServicesV2.tsx): `professional-services` anchorı; Hizmetler/Allplan Connect/Bilgi Merkezi | Aşağıdaki 20 kayıt; Eğitim gerçek render hedefi `/solutions-v2/training` | Ana sayfada güçlü konum; Eğitim ve destek eylemleri sekme arkasına bağımlı kalmasın. Aynı görevlerin üst yardımcı menüde bulunması bu alanı kaldırma gerekçesi değil |
| H07 — BIMFlex ortaklık duyurusu | [BimflexAnnouncement](00-inventory/interaction-source-evidence/components/homepage-v2/BimflexAnnouncement.tsx): “FlexSoft x Aluplan satış ortaklığı”; “Allplan için BIM uyumlu yapı elemanları donatısı” | “BIMFlex detaylarını incele” → `/solutions/bimflex`; FlexSoft logosu, kolon/kiriş/döşeme boşluk modeli PNG'leri ve alt metinleri | Kaynaktaki “sunulabilecektir” gelecek zamanını mevcut satış kesinliği yapma. “Saatlerden saniyelere” iddiası kanıt bekler; sessizce yeniden yazılmaz. ALLPLAN'ın kendi ürünü/paketi gibi modelleme |
| H08 — Sürüm yenilikleri | [InnovationsTeaser](00-inventory/interaction-source-evidence/components/homepage-v2/InnovationsTeaser.tsx): “ALLPLAN 2026 Yenilikleri”; AI Görselleştirme, Donatıdan Şantiyeye, Birleşik Arazi Modeli | “Tüm Yenilikleri İncele” mevcut hedef **`/products`**; üç kartın açıklama/rozet/ikonları | Etiket–hedef uyumsuzluğu inceleme adayı; bu planda hedef değiştirilmez. 2026 kartları yeni sürüm kaydıyla ezilmez |

H07'nin bugünkü üçüncü sıradan ilerideki konuma alınması editoryal öneridir; ortaklığın ticari önceliği farklıysa sıra değiştirilebilir. H06'nın öne alınması kullanıcının hizmet alanına verdiği önemi yansıtır. İçerik sırası token seçimine bağlanmaz.

## Profesyonel Hizmetler — 20 kaydın yeni görev yeri

Tam açıklama, CTA metni ve hedeflerin koruma kaynağı [20 satırlık global kanıt tablosudur](00-inventory/global-state-source-review-2026-10-22.md#profesyonel-hizmetler-üç-sekme-ve-20-kayıt). Aşağıdaki adlar yeni pazarlama metni değil, kayıt eşlemesidir.

| Grup önerisi | Kayıtlar (tam kapsam) | Eylem sınırı |
|---|---|---|
| Öğren ve yardım al — 5 | Eğitim; Teknik Destek; Danışmanlık; Sertifika; Destek Platformu | Eğitim → mevcut eğitim sayfası; Teams → mevcut görüşme bağlantısı; danışmanlık → `/contact`; sertifika → aluplan.info; ticket → allplan.net.tr. Destek satış talebi değildir |
| Yazılım ve lisans işlemleri — 5 | Download; Connect: Giriş; Admin Lisans : Lisans Yöneticisi Bilgi Formu; CodeMeter WebDepot; Deklarasyon Formu | Connect/lisans hedefleri korunur. Deklarasyondaki 2023/2024 kapsamı otomatik güncellenmez. Download, Aluplan lead kaydıyla eşitlenmez |
| Bilgi ve güncellemeler — 9 | ALLPLAN FAQ; Blog Global; Canlı Webinarlar; BIM Rehberi; OPENBIM; Sistem Gereksinimleri; Tüm Gereksinimler; Sürüm Notları; IFC Export El Kitabı | Dış üretici etkinliği Aluplan takvimi olarak sunulmaz. “Tüm Gereksinimler” bugün 2025 URL'sine bağlıdır; yeniden kapsamlandırma ayrı karar. IFC PDF hedefi korunur |
| Partner erişimi — 1 | Partner | Üreticinin partner başvurusu; Aluplan'ın kendi hizmet paketi değildir |

Bu 5+5+9+1 yapı dört sekme kararı değildir. Görsel tasarımda kart/liste/sekme seçilebilir; 20 kaydın açıklama ve hedefleri erişilebilir kalmalı. Eğitim Takvimi etiketi için eski metin korunarak yeni “Eğitim” stratejisine uygun değişiklik önerisi ayrıca kaydedilecek; gerçekte olmayan sürekli program üretilmeyecek.

## Global kabuk ve önerilen yeni blok ayrımı

[Layout snapshotı](00-inventory/interaction-source-evidence/app/layout.tsx) Header, Breadcrumb, GlobalTrialCTA, Footer, CookieConsent, ScrollToTopButton, SkipLink ve CopyProtection kullanıyor. Bunlar sekiz gövde bileşeninden ayrı değerlendirilir. Header/Footer için [global kanıt](00-inventory/global-state-source-review-2026-10-22.md) esas alınır: mevcut menüler, logo, arama, tema, teklif/deneme hedefleri, altı ürün ve beş çözüm footer bağlantısı, üç telefon, e-posta/adres, beş sosyal hesap, üç yasal sayfa ve “Design & Develop by Hazar Volga Ekiz” kredisi korunacak. Kullanıcının onayladığı form yönü geçişi uygulanana kadar mevcut hedefler tarihsel gerçek olarak kalır. GlobalTrialCTA ile hero teklif/deneme önceliği aynı işlevi gereksiz yere çoğaltmamalı; kesin CTA hiyerarşisi açık.

Önceki IA omurgasındaki **referans/kanıtlar** için ayrı ana sayfa bileşeni bu sekizli kaynakta bulunmuyor. Referanslar menü hedefi `/references` mevcuttur. Ana sayfaya referans bloğu eklemek **yeni öneridir**, taşınmış mevcut blok olarak sayılmaz; hangi gerçek kayıtların kullanılacağı ayrıca eşlenecek. Aynı şekilde 29+/500+/50+/10K+ rakamları bu planda yeni ana sayfa istatistikleri yapılmaz. İletişim bilgileri footerda bulunur; yeni bağımsız iletişim bölümü oluşturma kararı yok.

## Veri ve schema sınırı

Hero/rol/çözüm/ürün/paket/hizmet blokları sunum katmanıdır; ürün kimliği veya lisans hakkı kaydı yaratmaz. H03 ve H05 aynı paket kayıtlarına referans verebilir, fakat farklı mevcut eylemlerini korur. Sürüm kartı ürünün kendisi değildir. Eğitim hizmeti, video listesi ve video ayrı içerik amaçları taşır. Teams/ticket hizmet kanallarıdır; iki yeni ticari ürün oluşturmaz.

[22 Ekim schema incelemesindeki](form-schema-review-2026-10-22.md) sınırlar geçerlidir: fiyat uydurma, tüm paketleri otomatik ProductGroup yapma, talep kişisel verisini JSON-LD'ye koyma. Bu tur Google kuralları yeniden taranmadı; yeni schema iddiası veya JSON-LD üretilmedi.

## Tasarım öncesi kontrol ve açık işler

- Kaynak sekiz bileşenin sekizi yeni blok sorumluluğuna eşlendi; 20 hizmet kaydı 20/20 olarak listelendi.
- Hedef düzeyinde kritik farklar açık: HeroQuickLinks yenilikler hedefi ile InnovationsTeaser `/products` hedefi aynı değil; TechSpecs altı kartı ürün detayına değil aynı PDF'ye gider; Eğitim ham `/contact` yerine render'da eğitim sayfasına gider.
- Tam metin/görsel/CTA paritesi **henüz tamamlanmış değil**: yeni uygulama bulunmuyor. Bu belge kaynakları işaretleyen blok gereksinimidir; üretim öncesi otomatik ve tarayıcı kontrolü yapılmalı.
- İçerik iddiaları için mevcut çelişki kayıtları geçerli: “sıfır hata”, “kesintisiz”, sertifika kapsamı, performans/süre vaatleri yeni doğrulanmış vaat olmaz.
- Yeni referans bloğu ve BIMFlex duyurusunun nihai sırası kullanıcı değerlendirmesine sunulabilir; geri kalan teknik eşleme kontrolünü proje ekibi üstlenir.
