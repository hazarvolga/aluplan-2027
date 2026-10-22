# Kaynak etkileşim kayıtları — 22.10.2026

D01 için salt-okunur kaynak kanıtı. Bu kayıt **canlı etkileşim kabulü değildir**. Kod kurulmadı, çalıştırılmadı veya değiştirilmedi; API/`.env` dosyası okunmadı. Bütün çıktılar 2027 altında.

## Yöntem ve kapsam

- Kaynaktaki 100 `app/**/page.tsx` girişi tarandı; 65 girişte doğrudan veya import zincirinde etkileşim işareti bulundu. Bunlar 65 bağımsız canlı/çalışan özellik anlamına gelmez. Eski envanterdeki 103 rota sayısı başka yöntem/tarihe aittir; bu tarama onun yerine geçmez.
- Route group `(public)` URL'den çıkarıldı. `[playlistId]` dinamik kalıbı ve 14 bilinen slug ayrı kaydedildi.
- JSON her rota için giriş dosyasını, public import zincirini, JSX kontrol işaretlerini ve satırlarını tutar. `files` altında SHA-256, exact quoted `raw_literal`, JSX `raw_text` ve **199 ham array payload** bulunur. Bunlar kaynak yazımıdır; JSX expression/HTML entity çözülmüş tarayıcı metni değildir.
- `interaction-source-evidence/` altında 161 public kaynak/veri dosyasının eksiksiz, hash'li kopyası bulunur. JSX gövdeleri, şartlar, prop'lar, spread'ler, video ID'leri ve CTA hedefleri kısaltılmadan korunur. Bu arşiv uygulamaya kopyalanacak kod önerisi değildir.
- Import/JSX taraması TypeScript AST değerlendirmesi değildir. Opsiyonel bir bileşenin import edilmesi o dalın her tüketicide etkin olduğunu kanıtlamaz. Route tablosu **inceleme kaydı** olarak kullanılmalı, otomatik tamamlandı işareti verilmemelidir.
- `data/auto-search-index.json` 191 public arama kaydı içerir; `searchIndex.ts` birleştirme/filtreleme işlemi kaynakta korunur, çalıştırılmadı.

## Doğrulanmış durum kümeleri ve istisnalar

| Alan | Kaynaktaki durumlar / veri ilişkisi | Kapanış sınırı |
|---|---|---|
| Eğitim ana sayfa | 6 kategori; 4 teklif modalı girişi Temel/İleri Seviye/Özel/BIM | Diğer iki giriş quick-start/video-library hedefidir; hepsi form değildir |
| Eğitim detayları | Online, classroom, events, individual, webinar → konu prop'u ile ContactModal | Başarılı teslim kanıtı yok; individual mevcut URL olarak korunur, stratejide ayrı hizmet değildir |
| E-learning | `ctaLink=https://learnnow.allplan.com/course/search.php` | TrainingDetailTemplate var ama CTA modal açmaz; harici sayfa açar |
| FAQ | 5 sekme /25 yanıt | Root tarayıcı kanıtı ayrı dosyada |
| Quick-start | Mimari/Mühendislik/Altyapı/Prekast; Mimari3 +Mühendislik2 akordeon | Ana sekmelerin tümü gerekir; salt3 akordeon kabulü yetersiz |
| References | Tümü +9 kategori=10 sekme | Tam müşteri adı listesi kaynakta; canlı listesinin eşliği ayrı |
| Precast | Structural Precast/Walls/Slabs; her biri5 alt panel=15; lightbox | Üç ana sekmeye bakmak15paneli kapsamıyor |
| Products | Basic/Concept/Professional/Ultimate/Civil/Precast=6 normal düğme | ARIA tab taraması kaçırabilir; innovationData exact array payload'ları korunur |
| 2026 yenilikler | Architecture/Engineering/Infrastructure/Prefabrication & Construction=4 RegulaTabs düğmesi | JSX içerik blokları ve video şartları tam snapshot'ta |
| Civil ve Ultimate | Her birinde3 SSS; ayrıca video özellik/opsiyonları | SSS kabulü video oynatma kabulü değildir |
| Lisans atama | how-to-assign3 akordeon | Kaynak ve açılan durumlar eşlenmeli |
| Lisans etkinleştirme |5adım; ilk İleri gerçek POST `/api/send-activation-email` | Adım2–5 kaynak kanıtıdır; read-only turda gönderim yapılmaz |
| Webinar |13kayıt;12boş youtubeId;1numeric placeholder `1623090584242` | Placeholder yorumu kaynakta; çalışan13video iddiası yok |
| SketchUp converter | Export/Import2sekme | Her ikisi ayrı içerik |
| Arama | Boş/sonuçlu/sonuçsuz; Türkçe normalizasyon, URL q ve geri dönüş | Sınırsız sorgu kombinasyonu yerine veri kayıt eşliği +temsilî davranış |

## Video kitaplığı — kesin kaynak eşlemesi

Aşağıdaki her slug için tam `{id,title}` listesi JSON `playlist_map[].videos` içinde ayrıca yer alır. `video_collections` tekil koleksiyonları tutar; kaynak dosyaları da aynen korunur. Oynatma, thumbnail erişimi veya telif hakkı doğrulanmış sayılmaz. Bilinmeyen slug kaynakta `hello-allplan-2024` koleksiyonuna düşer.

| Slug | Koleksiyon | Kayıt |
|---|---|---|
| `hello-allplan-2024` | `helloAllplan2024Data` | 39 |
| `road-design` | `roadDesignData` | 12 |
| `bridge-workflows` | `bridgeWorkflowsData` | 15 |
| `campus-de` | `campusDeData` | 26 |
| `campus-en` | `campusEnData` | 26 |
| `addon-geometry` | `addonGeometryData` | 14 |
| `ax3000` | `ax3000Data` | 34 |
| `sds2-intro` | `sds2Data` | 2 |
| `konut-insaati` | `konutInsaatiData` | 4 |
| `bridge-workflow-2022` | `bridgeWorkflow2022Data` | 8 |
| `otomatik-donati` | `otomatikDonatiData` | 9 |
| `quickstart-buildings` | `quickStartBuildingsData` | 9 |
| `allplan-reinforcement` | `allplanReinforcementData` | 18 |
| `campus-tutorials-2019-2022` | `campusDeData` | 26 |

## Ortak bileşen kuralları

- `WorkflowTabsTemplate`: kategori → alt panel → isteğe bağlı image lightbox/video modal. Architecture/structural/infrastructure/MEP/road-railway/site-planning/precast-detail veri kümeleri ayrıdır.
- `RegulaTabs`: normal button seçimiyle yalnız seçilen içerik render edilir. 2026yenilikler, steel-components, parametric-terrain ve drive-curve bu nedenle ilk HTML metniyle kapanmaz.
- `ImageGallery`: `hideCategoryFilter`, `hideModalMeta` vb. prop'lar davranışı değiştirir. Her tüketicide filtre/meta görünür diye varsayılmaz.
- `ProductPageTemplate`, `SideImageSection`, `ModuleCard`: video/workflow alanları opsiyoneldir; girişteki prop değeri kanıttır. JSON transitive marker'ları koşulu çözmüş sayılmaz.
- Global layout ayrı kayıtlıdır: gerçek `components/layout/Header`, CookieConsent, CopyProtection, tema/arama/mobil navigasyon; kullanılmayan layout-v2 bileşenleri üzerinden kabul yapılmaz.
- Background animation, AnimatedCounter ve salt hover state gizli içerik paneli olarak sayılmaz. `FeatureList`, `PackageSelector`, `LicenseManagerModal` kullanım zinciri kanıtlanmadan aktif sayfa özelliği sayılmaz.

## Route → kaynak kanıt indeksi

Her satırın JSON kaydı tam import zincirini ve kontrol konumlarını içerir. “İşaret” şartlı şablon kullanımını da kapsar; canlı test gerektiren gerçek durum sayısı değildir.

| Rota | Giriş dosyası | İşaret türleri |
|---|---|---|
| `/` | [app/(public)/page.tsx](interaction-source-evidence/app/(public)/page.tsx) | stateful-click-controls, tab-trigger, tabs |
| `/products/allplan-2026-yenilikler` | [app/products/allplan-2026-yenilikler/page.tsx](interaction-source-evidence/app/products/allplan-2026-yenilikler/page.tsx) | button-tabs, dialog, dialog-trigger, module-video-conditional, nested-workflow-tabs, section-video-conditional, stateful-click-controls, tab-trigger, tabs |
| `/products/allplan-2026` | [app/products/allplan-2026/page.tsx](interaction-source-evidence/app/products/allplan-2026/page.tsx) | dialog, dialog-trigger, stateful-click-controls |
| `/products/allplan-aec` | [app/products/allplan-aec/page.tsx](interaction-source-evidence/app/products/allplan-aec/page.tsx) | dialog, dialog-trigger, module-video-conditional, nested-workflow-tabs, stateful-click-controls, tab-trigger, tabs |
| `/products/allplan-basic` | [app/products/allplan-basic/page.tsx](interaction-source-evidence/app/products/allplan-basic/page.tsx) | cloud-video-collection, dialog, stateful-click-controls, video-dialog |
| `/products/allplan-bimplus` | [app/products/allplan-bimplus/page.tsx](interaction-source-evidence/app/products/allplan-bimplus/page.tsx) | dialog, dialog-trigger, module-video-conditional, nested-workflow-tabs, stateful-click-controls, tab-trigger, tabs |
| `/products/allplan-cloud-services` | [app/products/allplan-cloud-services/page.tsx](interaction-source-evidence/app/products/allplan-cloud-services/page.tsx) | dialog, dialog-trigger, module-video-conditional, nested-workflow-tabs, section-video-conditional, stateful-click-controls, tab-trigger, tabs |
| `/products/allplan-concept` | [app/products/allplan-concept/page.tsx](interaction-source-evidence/app/products/allplan-concept/page.tsx) | cloud-video-collection, dialog, stateful-click-controls, video-dialog |
| `/products/allplan-professional` | [app/products/allplan-professional/page.tsx](interaction-source-evidence/app/products/allplan-professional/page.tsx) | cloud-video-collection, dialog, stateful-click-controls, video-dialog |
| `/products/allplan-ultimate` | [app/products/allplan-ultimate/page.tsx](interaction-source-evidence/app/products/allplan-ultimate/page.tsx) | accordion, accordion-trigger, cloud-video-collection, dialog, stateful-click-controls, video-dialog |
| `/products/allplan` | [app/products/allplan/page.tsx](interaction-source-evidence/app/products/allplan/page.tsx) | dialog, dialog-trigger, module-video-conditional, nested-workflow-tabs, stateful-click-controls, tab-trigger, tabs |
| `/products/architecture` | [app/products/architecture/page.tsx](interaction-source-evidence/app/products/architecture/page.tsx) | dialog, dialog-trigger, module-video-conditional, nested-workflow-tabs, stateful-click-controls, tab-trigger, tabs |
| `/products/ax3000` | [app/products/ax3000/page.tsx](interaction-source-evidence/app/products/ax3000/page.tsx) | dialog, dialog-trigger, module-video-conditional, nested-workflow-tabs, stateful-click-controls, tab-trigger, tabs |
| `/products/civil` | [app/products/civil/page.tsx](interaction-source-evidence/app/products/civil/page.tsx) | accordion, accordion-trigger, cloud-video-collection, dialog, stateful-click-controls, video-dialog |
| `/products` | [app/products/page.tsx](interaction-source-evidence/app/products/page.tsx) | package-button-tabs, stateful-click-controls |
| `/products/precast-detail` | [app/products/precast-detail/page.tsx](interaction-source-evidence/app/products/precast-detail/page.tsx) | dialog, dialog-trigger, module-video-conditional, nested-workflow-tabs, stateful-click-controls, tab-trigger, tabs |
| `/products/precast` | [app/products/precast/page.tsx](interaction-source-evidence/app/products/precast/page.tsx) | dialog, stateful-click-controls, tab-trigger, tabs |
| `/products/sds2-home` | [app/products/sds2-home/page.tsx](interaction-source-evidence/app/products/sds2-home/page.tsx) | dialog, dialog-trigger, module-video-conditional, nested-workflow-tabs, stateful-click-controls, tab-trigger, tabs |
| `/references` | [app/references/page.tsx](interaction-source-evidence/app/references/page.tsx) | tab-trigger, tabs |
| `/search` | [app/search/page.tsx](interaction-source-evidence/app/search/page.tsx) | form |
| `/solutions-v2/connect-license/activation` | [app/solutions-v2/connect-license/activation/page.tsx](interaction-source-evidence/app/solutions-v2/connect-license/activation/page.tsx) | activation-wizard, stateful-click-controls |
| `/solutions-v2/connect-license/how-to-assign` | [app/solutions-v2/connect-license/how-to-assign/page.tsx](interaction-source-evidence/app/solutions-v2/connect-license/how-to-assign/page.tsx) | accordion, accordion-trigger |
| `/solutions-v2/faq` | [app/solutions-v2/faq/page.tsx](interaction-source-evidence/app/solutions-v2/faq/page.tsx) | accordion, accordion-trigger, tab-trigger, tabs |
| `/solutions-v2/training/classroom` | [app/solutions-v2/training/classroom/page.tsx](interaction-source-evidence/app/solutions-v2/training/classroom/page.tsx) | contact-form, dialog, form, stateful-click-controls, training-cta-conditional |
| `/solutions-v2/training/e-learning` | [app/solutions-v2/training/e-learning/page.tsx](interaction-source-evidence/app/solutions-v2/training/e-learning/page.tsx) | contact-form, dialog, form, stateful-click-controls, training-cta-conditional |
| `/solutions-v2/training/events` | [app/solutions-v2/training/events/page.tsx](interaction-source-evidence/app/solutions-v2/training/events/page.tsx) | contact-form, dialog, form, stateful-click-controls, training-cta-conditional |
| `/solutions-v2/training/individual` | [app/solutions-v2/training/individual/page.tsx](interaction-source-evidence/app/solutions-v2/training/individual/page.tsx) | contact-form, dialog, form, stateful-click-controls, training-cta-conditional |
| `/solutions-v2/training/online` | [app/solutions-v2/training/online/page.tsx](interaction-source-evidence/app/solutions-v2/training/online/page.tsx) | contact-form, dialog, form, stateful-click-controls, training-cta-conditional |
| `/solutions-v2/training` | [app/solutions-v2/training/page.tsx](interaction-source-evidence/app/solutions-v2/training/page.tsx) | contact-form, dialog, form, stateful-click-controls, tab-trigger, tabs |
| `/solutions-v2/training/quick-start` | [app/solutions-v2/training/quick-start/page.tsx](interaction-source-evidence/app/solutions-v2/training/quick-start/page.tsx) | accordion, accordion-trigger, guide-tabs-accordion, stateful-click-controls, tab-trigger, tabs |
| `/solutions-v2/training/video-library/[playlistId]` | [app/solutions-v2/training/video-library/[playlistId]/page.tsx](interaction-source-evidence/app/solutions-v2/training/video-library/[playlistId]/page.tsx) | stateful-click-controls |
| `/solutions-v2/training/webinar` | [app/solutions-v2/training/webinar/page.tsx](interaction-source-evidence/app/solutions-v2/training/webinar/page.tsx) | contact-form, dialog, form, stateful-click-controls, training-cta-conditional |
| `/solutions/addons/drive-curve` | [app/solutions/addons/drive-curve/page.tsx](interaction-source-evidence/app/solutions/addons/drive-curve/page.tsx) | button-tabs, gallery-lightbox, stateful-click-controls |
| `/solutions/addons` | [app/solutions/addons/page.tsx](interaction-source-evidence/app/solutions/addons/page.tsx) | stateful-click-controls |
| `/solutions/addons/parametric-terrain` | [app/solutions/addons/parametric-terrain/page.tsx](interaction-source-evidence/app/solutions/addons/parametric-terrain/page.tsx) | button-tabs, gallery-lightbox, stateful-click-controls |
| `/solutions/addons/ramp` | [app/solutions/addons/ramp/page.tsx](interaction-source-evidence/app/solutions/addons/ramp/page.tsx) | gallery-lightbox, stateful-click-controls |
| `/solutions/addons/sketchup-converter` | [app/solutions/addons/sketchup-converter/page.tsx](interaction-source-evidence/app/solutions/addons/sketchup-converter/page.tsx) | tab-trigger, tabs |
| `/solutions/addons/steel-components` | [app/solutions/addons/steel-components/page.tsx](interaction-source-evidence/app/solutions/addons/steel-components/page.tsx) | button-tabs, gallery-lightbox, stateful-click-controls |
| `/solutions/addons/three-dimensioning` | [app/solutions/addons/three-dimensioning/page.tsx](interaction-source-evidence/app/solutions/addons/three-dimensioning/page.tsx) | gallery-lightbox, stateful-click-controls |
| `/solutions/allplan-bulut-hizmetleri` | [app/solutions/allplan-bulut-hizmetleri/page.tsx](interaction-source-evidence/app/solutions/allplan-bulut-hizmetleri/page.tsx) | dialog, dialog-trigger, stateful-click-controls |
| `/solutions/allplan-industry` | [app/solutions/allplan-industry/page.tsx](interaction-source-evidence/app/solutions/allplan-industry/page.tsx) | dialog, dialog-trigger, stateful-click-controls |
| `/solutions/architecture` | [app/solutions/architecture/page.tsx](interaction-source-evidence/app/solutions/architecture/page.tsx) | dialog, nested-workflow-tabs, stateful-click-controls, tab-trigger, tabs |
| `/solutions/ax3000-virtual-reality` | [app/solutions/ax3000-virtual-reality/page.tsx](interaction-source-evidence/app/solutions/ax3000-virtual-reality/page.tsx) | gallery-lightbox, stateful-click-controls |
| `/solutions/ax3000-yapi-fizigi` | [app/solutions/ax3000-yapi-fizigi/page.tsx](interaction-source-evidence/app/solutions/ax3000-yapi-fizigi/page.tsx) | gallery-lightbox, stateful-click-controls |
| `/solutions/bimx5` | [app/solutions/bimx5/page.tsx](interaction-source-evidence/app/solutions/bimx5/page.tsx) | stateful-click-controls |
| `/solutions/bridge-design` | [app/solutions/bridge-design/page.tsx](interaction-source-evidence/app/solutions/bridge-design/page.tsx) | stateful-click-controls |
| `/solutions/features-allplan-bridge` | [app/solutions/features-allplan-bridge/page.tsx](interaction-source-evidence/app/solutions/features-allplan-bridge/page.tsx) | stateful-click-controls |
| `/solutions/imar-yonetmeligi-bim-eklentisi` | [app/solutions/imar-yonetmeligi-bim-eklentisi/page.tsx](interaction-source-evidence/app/solutions/imar-yonetmeligi-bim-eklentisi/page.tsx) | stateful-click-controls |
| `/solutions/infrastructure` | [app/solutions/infrastructure/page.tsx](interaction-source-evidence/app/solutions/infrastructure/page.tsx) | dialog, nested-workflow-tabs, stateful-click-controls, tab-trigger, tabs |
| `/solutions/mep` | [app/solutions/mep/page.tsx](interaction-source-evidence/app/solutions/mep/page.tsx) | dialog, nested-workflow-tabs, stateful-click-controls, tab-trigger, tabs |
| `/solutions/modeling-of-precast-girder-bridges` | [app/solutions/modeling-of-precast-girder-bridges/page.tsx](interaction-source-evidence/app/solutions/modeling-of-precast-girder-bridges/page.tsx) | stateful-click-controls |
| `/solutions/oska` | [app/solutions/oska/page.tsx](interaction-source-evidence/app/solutions/oska/page.tsx) | dialog, dialog-trigger, section-video-conditional |
| `/solutions/precast` | [app/solutions/precast/page.tsx](interaction-source-evidence/app/solutions/precast/page.tsx) | stateful-click-controls |
| `/solutions/pythonpart` | [app/solutions/pythonpart/page.tsx](interaction-source-evidence/app/solutions/pythonpart/page.tsx) | stateful-click-controls |
| `/solutions/rebar-engineering` | [app/solutions/rebar-engineering/page.tsx](interaction-source-evidence/app/solutions/rebar-engineering/page.tsx) | stateful-click-controls |
| `/solutions/road-railway` | [app/solutions/road-railway/page.tsx](interaction-source-evidence/app/solutions/road-railway/page.tsx) | dialog, nested-workflow-tabs, stateful-click-controls, tab-trigger, tabs |
| `/solutions/scalypso/converter` | [app/solutions/scalypso/converter/page.tsx](interaction-source-evidence/app/solutions/scalypso/converter/page.tsx) | stateful-click-controls |
| `/solutions/scalypso/mobile` | [app/solutions/scalypso/mobile/page.tsx](interaction-source-evidence/app/solutions/scalypso/mobile/page.tsx) | stateful-click-controls |
| `/solutions/scalypso/modeler` | [app/solutions/scalypso/modeler/page.tsx](interaction-source-evidence/app/solutions/scalypso/modeler/page.tsx) | stateful-click-controls |
| `/solutions/scalypso` | [app/solutions/scalypso/page.tsx](interaction-source-evidence/app/solutions/scalypso/page.tsx) | dialog, dialog-trigger, module-video-conditional, stateful-click-controls |
| `/solutions/scalypso/videos` | [app/solutions/scalypso/videos/page.tsx](interaction-source-evidence/app/solutions/scalypso/videos/page.tsx) | stateful-click-controls |
| `/solutions/scalypso/viewer` | [app/solutions/scalypso/viewer/page.tsx](interaction-source-evidence/app/solutions/scalypso/viewer/page.tsx) | stateful-click-controls |
| `/solutions/site-planning` | [app/solutions/site-planning/page.tsx](interaction-source-evidence/app/solutions/site-planning/page.tsx) | dialog, nested-workflow-tabs, stateful-click-controls, tab-trigger, tabs |
| `/solutions/steel` | [app/solutions/steel/page.tsx](interaction-source-evidence/app/solutions/steel/page.tsx) | stateful-click-controls |
| `/solutions/structural` | [app/solutions/structural/page.tsx](interaction-source-evidence/app/solutions/structural/page.tsx) | dialog, nested-workflow-tabs, stateful-click-controls, tab-trigger, tabs |

## D01 kapanışı için kullanım

1. Kaynak kayıtlarını mevcut 2026→2027 içerik eşleme tablosuna bağla; tam metin/medya/CTA değişimi fark kaydıyla yönetilsin.
2. Root'un browser-closure kanıtlarıyla gözlenen durumları eşle; aynı kaydı kullanıcıya elle kontrol ettirme. Kaynakta bulunmasıyla canlıda görünmesini ayır.
3. Tam oynatma, teslimat veya kimlik doğrulama gerektiren kontrolleri ayrı kabul adımına bırak; olmayan canlı kanıtını varmış gibi işaretleme.
4. Yeni kaynak değişikliği olduğunda SHA farkıyla yalnız etkilenen kayıtları tekrar incele. Tarihsel snapshot'ları değiştirme.

Bu belge uygulama veya faz geçişi izni üretmez. Mevcut site içeriği, schema, tema ve URL'ler değiştirilmedi.
