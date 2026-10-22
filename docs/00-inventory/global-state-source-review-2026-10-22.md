# Global durumların kaynak envanteri — 22.10.2026

Kullanıcının kaynak-öncelikli kontrol tercihiyle, güncel `aluplan-2026` yalnız okunmuştur. Bu çalışma uygulama veya tekrar eden tarayıcı testi değildir. Aşağıdaki durumların tam kaynak metni mevcut hashli snapshotlarda korunur; yeni yayın içeriği üretilmez. **Kaynak envanteri kaydı ile canlı çalışma/erişilebilirlik kabulü ayrı tutulur.**

## Kaynak eşliği

Aşağıdaki 13 dosyanın mevcut kaynak baytları ve önceden arşivlenmiş kopyaları yeniden karşılaştırıldı:

| Tam kaynak kaydı | Snapshot SHA eşliği |
|---|---|
| [app/layout.tsx](interaction-source-evidence/app/layout.tsx) | Eşit |
| [app/(public)/page.tsx](<interaction-source-evidence/app/(public)/page.tsx>) | Eşit |
| [components/layout/Header.tsx](interaction-source-evidence/components/layout/Header.tsx) | Eşit |
| [components/layout/MegaMenu.tsx](interaction-source-evidence/components/layout/MegaMenu.tsx) | Eşit |
| [data/solutionsMenu.ts](interaction-source-evidence/data/solutionsMenu.ts) | Eşit |
| [components/layout/CookieConsent.tsx](interaction-source-evidence/components/layout/CookieConsent.tsx) | Eşit |
| [components/layout/ThemeToggle.tsx](interaction-source-evidence/components/layout/ThemeToggle.tsx) | Eşit |
| [components/search/CommandMenu.tsx](interaction-source-evidence/components/search/CommandMenu.tsx) | Eşit |
| [components/homepage-v2/PathwayProductSystem.tsx](interaction-source-evidence/components/homepage-v2/PathwayProductSystem.tsx) | Eşit |
| [components/homepage-v2/ServicesV2.tsx](interaction-source-evidence/components/homepage-v2/ServicesV2.tsx) | Eşit |
| [components/specialized-ui/ImageGallery.tsx](interaction-source-evidence/components/specialized-ui/ImageGallery.tsx) | Eşit |
| [components/templates/WorkflowTabsTemplate.tsx](interaction-source-evidence/components/templates/WorkflowTabsTemplate.tsx) | Eşit |
| [components/sections/CopyProtection.tsx](interaction-source-evidence/components/sections/CopyProtection.tsx) | Eşit |

## Global kabuk ve navigasyon

Aktif `app/layout.tsx` Header, Footer, CopyProtection ve CookieConsent kullanır; `layout-v2` eski alternatifleri bu global durumların yerine geçirilmez. Header durumları: `isMenuOpen` kapalı/açık; `expandedMobileMenu` boş/solutions/products; `activeMegaMenu` boş/solutions/products; `isSearchOpen` kapalı/açık. Desktop ve mobile aynı `productsMenu`/`solutionsMenu` dizilerini okur; mobil için ayrı içerik listesi yoktur. Mobil alt bağlantıya tıklamak iki menü durumunu da kapatır. Desktop açılması hover ile bağlıdır; klavye açılma davranışı ayrı erişilebilirlik bulgusudur.

Ana navigasyon: Çözümler ve Ürünler menü açar; Kaynaklar → `/#professional-services`; Referanslar → `/references`; Hakkımızda → `/about`; İletişim → `/contact`. Logo → `/`. Sosyal bağlantıların beşi ve `mailto:info@aluplan.com.tr` tam Header snapshotında bulunur.

Dil başlangıcı `tr`; TR/EN etiket alternatifleri kaynakta var fakat dil değiştirme düğmesi JSX yorumunda. Dolayısıyla ikinci yayın dili/İngilizce URL envanteri olarak sayılmaz. ThemeToggle yalnız dark/light değiştirir; etiketi `Toggle theme`. Tema ile yeni metin/URL kümesi oluşturulmaz.

Her iki ekran düzeninde `Ücretsiz Deneme` → `https://www.allplan.com/trial-or-subscription/`; `Teklif Talep Formu` → `https://forms.office.com/r/hXhnKAG912`. Mobil aç/kapat erişilebilir etiketleri `Menüyü aç` / `Menüyü kapat`.

Ürün menüsünün ve çözüm menüsünün bütün kayıtları, aşağıda kaynaktaki yazımlarıyla:

| Menü | Ad | Hedef |
|---|---|---|
| Ürünler | ALLPLAN Basic | `/products/allplan-basic` |
| Ürünler | ALLPLAN Concept | `/products/allplan-concept` |
| Ürünler | ALLPLAN Professional | `/products/allplan-professional` |
| Ürünler | ALLPLAN Ultimate | `/products/allplan-ultimate` |
| Ürünler | ALLPLAN Cloud Services | `/products/allplan-cloud-services` |
| Ürünler | CIVIL | `/products/civil` |
| Ürünler | PRECAST | `/products/precast` |
| Ürünler | Allplan - AEC Endüstrisi için BIM | `/products/allplan-aec` |
| Ürünler | Allplan Bridge - Köprü Tasarımı | `/solutions/bridge-design` |
| Ürünler | AX3000 - Enerji Simülasyonu | `/products/ax3000` |
| Ürünler | AX3000 - Mekanik Tesisat | `/solutions/ax3000-mekanik-tesisat` |
| Ürünler | Allplan Precast - Prekast Detaylandırma | `/products/precast-detail` |
| Ürünler | Tim - Prekast İş Planlaması | `https://www.allplan.com/products/tim/` |
| Ürünler | SDS2 - Çelik Detaylandırma ve İmalatı | `https://www.allplan.com/products/sds2-detailing-fabrication/` |
| Ürünler | SDS2 - Çelik Yük Planlaması | `https://www.allplan.com/products/sds2-load-planning/` |
| Ürünler | SDS2 - Aluplan | `/products/sds2-home` |
| Ürünler | Allplan Ortak Çözümleri | `https://www.allplan.com/allplan-partner-solutions/` |
| Ürünler | ALLPLAN BIMPLUS | `/products/allplan-bimplus` |
| Çözümler | Mimari | `/solutions/architecture` |
| Çözümler | Strüktürel Mühendislik | `/solutions/structural` |
| Çözümler | MEP | `/solutions/mep` |
| Çözümler | ALLPLAN ENDÜSTRİ ÇÖZÜMLERİ | `/solutions/allplan-industry` |
| Çözümler | Altyapı Mühendisliği | `/solutions/infrastructure` |
| Çözümler | Yol ve Demiryolu Tasarımı | `/solutions/road-railway` |
| Çözümler | Köprü Tasarımı | `/solutions/bridge-design` |
| Çözümler | Prekast Üretimi | `/solutions/precast` |
| Çözümler | Çelik Detaylandırma & İmalat | `/solutions/steel` |
| Çözümler | Şantiye Planlaması | `/solutions/site-planning` |
| Çözümler | CDS Add-On | `/solutions/cds-addon` |
| Çözümler | Allto PytonPart Generator | `https://allplantools.com/` |
| Çözümler | Allto PytonPart | `/solutions/pythonpart` |
| Çözümler | AX3000 MEP | `/solutions/ax3000` |
| Çözümler | Scalypso | `/solutions/scalypso` |
| Çözümler | BIMFlex | `/solutions/bimflex` |
| Çözümler | Donatı Mühendisliği | `/solutions/rebar-engineering` |
| Çözümler | İmar Yönetmeliği BIM Eklentisi | `/solutions/imar-yonetmeligi-bim-eklentisi` |
| Çözümler | BIMX5 | `/solutions/bimx5` |
| Çözümler | Allplan Oska İşbirliği | `/solutions/oska` |
| Çözümler | Allplan Poz Kataloğu | `/solutions/poz-catalog` |

## Profesyonel Hizmetler: üç sekme ve 20 kayıt

Başlık `PROFESYONEL HİZMETLER`; açıklama `Sadece yazılım değil, başarınız için kapsamlı bir ekosistem sunuyoruz.` Varsayılan `Hizmetler`; diğer sekmeler `Allplan Connect`, `Bilgi Merkezi`. Filtreler sırasıyla 6, 4 ve 10 kaydı kapsar. Bütün mevcut kayıtlar `active`; koşullu `Yakında` metni mevcut veride etkin değil. **Eğitim kaydının ham href'i /contact olsa da render'daki resolvedHref /solutions-v2/training'dir.** Taşımada gerçek çözümlenmiş hedef korunur.

| Sekme | Başlık | Tam açıklama | CTA | Çözümlenmiş hedef |
|---|---|---|---|---|
| Hizmetler | Eğitim | Online ve yüz yüze profesyonel ALLPLAN eğitimleri ile uzmanlaşın. | Eğitim Takvimi | `/solutions-v2/training` |
| Hizmetler | Teknik Destek | Microsoft Teams üzerinden uzaktan bağlantı ile kesintisiz teknik destek sağlıyoruz. | Destek Al | `https://teams.microsoft.com/meet/39783115346098?p=wIo7WWYLZwqoHtjq3Y` |
| Hizmetler | Danışmanlık | Şirketinize özel BIM implementasyon ve süreç danışmanlığı. | İletişim | `/contact` |
| Hizmetler | Sertifika | Uluslararası geçerliliği olan ALLPLAN Uzman sertifikası. | Görüntüle | `https://aluplan.info/` |
| Hizmetler | Destek Platformu | Ticket sistemi üzerinden destek taleplerinizi oluşturun ve süreçlerinizi kolayca takip edin. | Talep Oluştur | `https://allplan.net.tr/` |
| Hizmetler | Partner | ALLPLAN çözüm ortağı ağımıza katılın, birlikte büyüyelim. | Başvuru Yap | `https://www.allplan.com/allplan-partner-solutions/` |
| Allplan Connect | Download | Güncel yazılım sürümlerini ve deneme sürümlerini indirin. | İndir | `https://connect2.allplan.com/` |
| Bilgi Merkezi | ALLPLAN FAQ | Sıkça sorulan sorular ve çözüm veri tabanı. | İncele | `/solutions-v2/faq` |
| Allplan Connect | Connect: Giriş | Allplan Connect portalına giriş yapın veya şifrenizi sıfırlayın. | Giriş Yap | `/solutions-v2/connect-login` |
| Allplan Connect | Admin Lisans : Lisans Yöneticisi Bilgi Formu | Lisanslarınızı yönetin, transfer edin veya güncelleyin. | Yönet | `/solutions-v2/connect-license` |
| Bilgi Merkezi | Blog Global | En son ALLPLAN haberleri, başarı hikayeleri ve sektör trendleri. | Okumaya Başla | `https://www.allplan.com/blog/` |
| Bilgi Merkezi | Canlı Webinarlar | Uzmanların sunumuyla canlı eğitimler ve ürün tanıtımları. | Kayıt Ol | `https://www.allplan.com/events/events/?` |
| Bilgi Merkezi | BIM Rehberi | BIM süreçleri ve uygulamaları için kapsamlı rehberler. | İncele | `https://www.allplan.com/bim/bim-guides/` |
| Bilgi Merkezi | OPENBIM | Açık standartlarla işbirliği, IFC ve veri değişimi hakkında her şey. | Keşfet | `https://www.allplan.com/us_en/bim/openbim/` |
| Bilgi Merkezi | Sistem Gereksinimleri | ALLPLAN performansı için önerilen donanım ve yazılım özellikleri. | Kontrol Et | `https://www.allplan.com/us_en/system/system-requirements/` |
| Allplan Connect | Tüm Gereksinimler | Geçmişten günümüze tüm sürümler için detaylı sistem bilgileri. | Listele | `https://connect.allplan.com/support/sysinfo/2025.html` |
| Bilgi Merkezi | Sürüm Notları | Her yeni güncelleme ile gelen, iyileştirmeler ve düzeltmeler. | Oku | `https://www.allplan.com/tr/system/releasenotes/?no_cache=1` |
| Bilgi Merkezi | IFC Export El Kitabı | Sektör paydaşlarının birlikte çalışabilme potansiyelini artırmak, openBIM kültürünü tanıtmak ve yaygınlaştırmak amacıyla buildingSMART Türkiye tarafından hazırlanan IFC Aktarım El Kitabı. | İndir | `/docs/ifc_aktarim_el_kitabi_ifc_4.0_ifc_4.3_2026.pdf` |
| Bilgi Merkezi | CodeMeter WebDepot | CodeMeter License Central WebDepot'a hoş geldiniz. Lisanslarınızı bu WebDepot'u kullanarak CmContainer'ınıza aktarabilirsiniz. | Lisansları Aktar | `https://lc.codemeter.com/59885/depot/index.php` |
| Bilgi Merkezi | Deklarasyon Formu | Yeni Allplan lisansınızın etkinleştirilmesi için talep ve beyan formu. ALLPLAN 2023 ve ALLPLAN 2024 versiyonları için geçerlidir. | Görüntüle | `/solutions-v2/connect-license/activation` |

Bu ifadeler mevcut içerik kanıtıdır; `kesintisiz`, `Uluslararası geçerliliği` gibi vaatlerin doğruluğu bu kaynak okumasıyla onaylanmış değildir. Sertifika/ücret/SLA veya paket dahil hizmet hakkı olarak schema'ya aktarılmaz.

## Rol seçimi

`ROLÜNÜZÜ SEÇİN` / `Size en uygun iş akışını ve ürün paketini keşfedin.` Varsayılan MİMAR. Üç rolün CTA etiketi `Bu Akışı Detaylı İncele`. Rol değişimi 6 paket kartını silmez; yalnız ilişkili kartın görünümünü vurgular. Soluk kartlar hâlâ Link'tir; kaynakta devre dışı değiller.

| Rol | Başlık | Tam açıklama | Özellikler | Hedef |
|---|---|---|---|---|
| MİMAR | Özgür Tasarım | Sınırsız modelleme yetenekleri ve entegre görselleştirme ile tasarım vizyonunuzu kısıtlamadan gerçeğe dönüştürün. | "Parametrik Modelleme", "Entegre Rendering", "AI Görselleştirme", "Konsept Tasarım" | `/products/architecture` |
| MÜHENDİS | Hassas Analiz | Tek model üzerinden yapısal analiz, donatı detaylandırma ve metraj. Hatasız projeler, optimize edilmiş maliyetler. | "Otomatik Donatı", "FEM Analizi", "Çakışma Kontrolü", "Maliyet Hesabı" | `/products/allplan-aec` |
| PREKAST | Akıllı Üretim | Modelden doğrudan fabrikaya veri aktarımı. Prekast ve çelik üretiminde maksimum verimlilik ve sıfır hata. | "CAM Veri Çıktısı", "Lojistik Planlama", "Stok Yönetimi", "Montaj Planları" | `/products/precast` |

Paket vurgusu: MİMAR → Basic, Concept; MÜHENDİS → Professional, Ultimate, Civil; PREKAST → Ultimate, Precast. Altı kartın tam title/description/href/relatedRoles dizisi PathwayProductSystem snapshotında korunur. Bu editoryal öneri ilişkisi, tek başına lisans hakkı veya resmî ürün varyant ilişkisi değildir. `sıfır hata` / `Hatasız projeler` ifadeleri de doğrulanmış teknik garanti sayılmaz.

## Çerez bildirimi ve arama

CookieConsent tam metni: `Çerez Kullanımı ve Gizlilik`; `Deneyiminizi iyileştirmek için çerezleri kullanıyoruz. KVKK ve GDPR süreçlerine uygun olarak kişisel verileriniz işlenmektedir.` Bağlantılar `KVKK Aydınlatma Metni` → `/kvkk`, `Gizlilik Politikası` → `/gizlilik-politikasi`. Seçim yoksa 1500ms sonra gösterilir; `Reddet` → localStorage `cookie-consent=declined`, `Kabul Et` → `accepted`; ikisi de bildirimi gizler. Kaynakta geri açma/tercih ayrıntı ekranı yoktur.

`app`, `components`, `lib`, `data` içinde `cookie-consent` araması yalnız bu bileşeni buldu. Bu bileşende üçüncü taraf yüklemelerini seçime bağlayan kod yoktur. Bu, hukuki uygunluk veya gerçek ağ/cookie davranışı hakkında sonuç değildir; sonraki teknik baseline/yayın kontrolüne konudur. Hukuki metni bu tur değiştirme kararı verilmedi.

Arama `Arama` düğmesi veya Ctrl/Cmd+K ile açılır. Placeholder `Arama yapın... (Örn: BIM, Mimari, Bulut)`; boş sonuç `Sonuç bulunamadı.`; sorgu için `"{inputValue}" için tüm sonuçlarda ara →` ve `Tüm sonuçlarda ara: "{inputValue}"` yolları `/search?q=${encodeURIComponent(inputValue)}` hedefini kullanır. Sabit öneri/ürün/çözüm/genel kayıtlarının tüm etiketleri ve hedefleri CommandMenu snapshotında; arama verileri ve temsilî canlı durumlar önceki kayıtlarda saklıdır. Her olası sorgunun tekrar denenmesi envanter şartı değildir.

## Galeri ve iş akışı pencereleri

ImageGallery kartı ve büyük pencere **aynı** image kaydını kullanır: `src`, `alt`, `title`, `description`, `category`. Büyük pencere için ayrı dosya veya gizli açıklama veri kaynağı yoktur. Şartlar: `hideModalMeta` başlık/açıklama/kategoriyi pencerede gizler; `hideOverlayText`, `hideCardFooter`, `hideCategoryBadge` kart sunumunu değiştirir. `hideCTA` parametresi kullanılmıyor, ek CTA üretmiyor. Filtre görünürse `Tümü` + benzersiz kategori değerleri vardır; incelenen gerçek ImageGallery tüketicilerinin tümü `hideCategoryFilter` geçiriyor. Steel Components üç galeride ayrıca `hideModalMeta` geçiriyor; kaynak title/description korunur ama görünür pencere içeriği sayılmaz.

Tüketiciler: Drive Curve, Steel Components (3 galeri), Three Dimensioning, Ramp, Parametric Terrain (4 galeri), AX3000 Virtual Reality, AX3000 Yapı Fiziği (2 galeri). Tüm ClientPage kaynakları ve image dizileri 161 dosyalık arşivde bulunur. Seçilen resim, overlay veya kapatma düğmesiyle temizlenir; klavye/focus/Escape davranışı kodda ayrıca doğrulanmalıdır, içerik kayıt eksikliği değildir.

WorkflowTabsTemplate: kategori başlığı ve item title/description/image/videoUrl tüketici prop'undan gelir. Başlangıç ilk kategori ve onun ilk kaydıdır. Büyük resim aynı item.image, alt ve görünür başlık item.title; yeni içerik yaratmaz. `videoUrl` varsa `Videoyu İzle` gösterilir; YouTube içeren kaynak son `/` parçası ile embed URL'ye çevrilir, diğerleri olduğu gibi kullanılır. Dönüşümün watch?v= biçimleri için sağlamlığı ayrı teknik kontrol konusudur. Tüm ham URL ve kategori dizileri snapshotlarda korunmuştur; yalnız canlıda pencereleri açmak kaynak tamlığını artırmaz.

## Global CopyProtection durumları

Aktif layout bu bileşeni yükler; şu mevcut mesajlar da envanterdedir:

- Sağ tık: `Sağ tık yok, ama kahve var! ☕` + `İçeriklerimiz koruma altındadır.`
- Copy olayı: `Kopyalamak yerine ilham almayı deneyin! 😉` + `Bizimle iletişime geçin.`
- Ctrl/Cmd+C: `Kopyalamak yok! 😎`
- F12 veya Ctrl+Shift+I: `Kodları kurcalama! 🔒`

Tam animasyon ve koşullar snapshotta saklıdır; bu davranışın yeni tasarımda korunması teknik gereklilik olarak otomatik kabul edilmez. Kullanılabilirlik/erişilebilirlik değerlendirmesi Faz 1/2'de yapılır; bu tur davranış değiştirilmedi.

## Kapanış sınırı

Bu görevde incelenen global/kabuk/rol/hizmet/galeri/iş akışı durumlarının **kaynak içerik ve hedef kaydı tamamdır**; ek saklanmamış public veri kaynağı saptanmadı. Bu sonuç tüm site runtime paritesi veya Faz 0 otomatik kapanışı değildir. Harici Microsoft Forms'un görünmeyen dalları yerel kaynaktan çözülemez. Gerçek mobil görünüm, klavye/focus, video oynatma, çerez ağı ve gönderim testi baseline/uygulama/yayın kabulüdür; kaynak envanteri tamamlamak için bütün sayfalarda tekrar edilmez. Teknik kontroller kullanıcıya tek tek kontrol görevi olarak devredilmez.
