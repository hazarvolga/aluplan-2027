# Kaynak kodu: davranış, entegrasyon ve içerik bulguları

> Kullanıcı teyidi (19 Ekim 2026): Bu rapordaki sayı ve iddia doğrulama notları metin değiştirme izni değildir. 29+/500+/50+/10K+ dahil tüm mevcut metinler aynen korunur. Canlı esas alınır; yerel fazlalıklar ayrıca onaya sunulur. Detay: user-decisions.md.

Tarih: 19 Ekim 2026. Kaynak kökü: `../aluplan-2026`. Aşağıdaki yollar bu köke göredir. İnceleme salt okunurdur; kaynakta komut çalıştırma/build, bağımlılık kurulumu, form gönderimi veya canlı sisteme erişim yapılmadı. `.env` ve sır olabilecek dosyaların içerikleri okunmadı. Bu rapor kod kanıtıdır; canlı servis, teslimat veya hukuki uygunluk doğrulaması değildir.

## Formlar ve hedefler

| Akış | Alanlar ve doğrulama | Kodda gerçekleşen davranış / kanıt |
|---|---|---|
| Genel teklif talebi | Harici Microsoft Forms alanları yerel koddan bilinmiyor | `https://forms.office.com/r/hXhnKAG912`; header ve ürün şablonlarında tekrarlanır: `components/layout/Header.tsx:251`, `components/templates/ProductPageTemplate.tsx:249`; iletişim sayfası da aynı hedefe gider: `app/contact/ClientPage.tsx:64-72`. |
| Eğitim / bağlamsal iletişim modalı | Ad soyad, e-posta, mesaj `required`; firma, telefon, meslek/unvan, sektör opsiyonel; konu salt okunur. HTML email tipi dışında şema doğrulaması yok. | Form verisini konsola yazar, 1 saniye bekleyip başarı gösterir; API çağrısı yok. `components/layout-v2/ContactModal.tsx:28-40,67-121`. Eğitim bağlamında kullanılır: `components/templates/TrainingDetailTemplate.tsx:162`, `app/solutions-v2/training/page.tsx:482`. |
| Lisans yönetici modalı | Firma, telefon, lisans yöneticisi adı, e-posta, müşteri no zorunlu; e-posta tipi var; müşteri no için C300 açıklaması var fakat desen kontrolü yok. | 1,5 saniyelik simülasyon sonrası “sistemimize kaydedilmiştir” der. Gerçek kayıt yok; inputlarda name yok. `components/layout-v2/LicenseManagerModal.tsx:19-27,46-48,75-139`. Bileşenin varlığı kullanıcıya açık bağlantısını kanıtlamaz. |
| Contact servisi / API | Servis tipi name/email/message, opsiyonel phone/company içerir | `services/contact.ts:3-14` → `api/contact`; taban URL `NEXT_PUBLIC_API_URL` veya aynı origin (`lib/api.ts:12-27`). Yerel API JSON okur, 1 saniye bekler ve 200 döner; doğrulama, kalıcılık, gerçek gönderim yok: `app/api/contact/route.ts:3-9`. |
| Lisans aktivasyon beyanı | firstName/lastName/email boş olmamalı; belge indirmeden önce agreed işareti gerekir | Birinci adım `/api/send-activation-email` POST eder; başarılı yanıt sonrası ikinci adıma geçer (`app/solutions-v2/connect-license/activation/ActivationWizard.tsx:20-55`). Son adım onayla PDF indirme: aynı dosya `:263-305`. Lisans numarası/talep nedeni/imza ara adımları rehber içeriktir, bu POST'un alanları değildir. |
| Aktivasyon arka ucu | Sunucuda yalnızca truthy alan kontrolü; tür, e-posta formatı, uzunluk şeması görünmüyor | Opsiyonel `GOOGLE_SHEETS_WEBHOOK_URL` POST ve Nodemailer SMTP; yönetici `info@aluplan.com.tr` + kullanıcı adresine gönderim. `app/api/send-activation-email/route.ts:6-29,32-44,46-84`. Webhook HTTP sonucunu kontrol etmez, hata olsa da e-postaya devam eder. SMTP sertifika doğrulaması `rejectUnauthorized:false`; kullanıcı verisi HTML içine kaçışsız yerleştirilir. Rate limit/CSRF/idempotency bu route ve middleware içinde görünmüyor. Canlı SMTP/env durumu bilinmiyor. |
| Diğer harici formlar | Alanlar yerelde tanımlı değil | Lisans yönetim formu `https://forms.office.com/r/HSrhvAkYmb` (`app/solutions-v2/connect-license/page.tsx:304`); PythonPart/Scalypso hedefi `https://forms.office.com/r/XLQm9JPTSR` (`app/solutions/pythonpart/ClientPage.tsx:172`, `app/solutions/scalypso/ClientPage.tsx:238`). |

İletişim sayfasında deneme `https://www.allplan.com/trial-or-subscription/`, destek ise `https://aluplan.net.tr` (`app/contact/ClientPage.tsx:57,81`). Aktivasyon e-postasında destek `https://www.allplan.net.tr` (`app/api/send-activation-email/route.ts:73`). Alan adları birbirinden farklı; hedef eşitliği veya yönlendirme zinciri canlı doğrulanmadı. “30 gün” deneme iddiası yerel içerikte var, güncel sağlayıcı koşulu olarak doğrulanmadı (`app/contact/ClientPage.tsx:55`).

## Çerez, analitik, gömülü içerik

- CookieConsent 1,5 saniye sonra görünür; kabul/ret yalnızca localStorage `cookie-consent` değerini değiştirir (`components/layout/CookieConsent.tsx:12-29`). Kategori seçimi, süre veya geri alma arayüzü bu bileşende yok.
- Google tag ve Analytics `afterInteractive` ile koşulsuz eklenir (`app/layout.tsx:102-114`); consent değeri burada okunmaz. Kimlikler uygulamanın analitik yapılandırmasıdır; analitiğin gerçekten çalıştığı kanıtlanmadı.
- CSP iki ayrı yerde yazılır: `next.config.js:81-96` ve `middleware.ts:21-36`. İkisinin script listesinde Google Tag Manager alan adı yok; kaynak yapılandırması analitik yüklemesiyle uyumsuz. Tarayıcıda etkili header ve bloklama ayrıca kontrol edilmelidir. Next config Google Maps frame alanını da listelemiyor; middleware frame-src https: kullanıyor; nihai davranış yalnız kaynak metninden kesinleştirilemez.
- Video modalı YouTube iframe/autoplay açar (`components/specialized-ui/VideoModal.tsx:25-60`); BIMflex sayfası youtube-nocookie kullanır (`app/solutions/bimflex/page.tsx:332`). Google Maps iletişim sayfasında doğrudan iframe (`app/contact/ClientPage.tsx:91-100`). Bu örneklerde çerez tercihine bağlı yükleme kontrolü yok.
- Banner “KVKK ve GDPR süreçlerine uygun” iddiası taşır (`components/layout/CookieConsent.tsx:52-56`); bu ifade kaynak iddiasıdır, uygunluk kanıtı değildir.

## Etkileşimler ve erişilebilirlik borcu

- Cmd/Ctrl+K komut menüsünü açar; tüm sonuçlar `/search?q=` rotasına taşınır (`components/search/CommandMenu.tsx:21-30,46-63`). Arama tarayıcı içinde `searchIndex` üzerinde Türkçe karakter normalize ederek tüm kelimeleri eşleştirir (`app/search/SearchPageClient.tsx:5,19-68`).
- Ana sayfa role göre ürün seçimi içerir; mimar/mühendis/prekast segmentleri ve ürün ilişkileri kodda tanımlı (`components/homepage-v2/PathwayProductSystem.tsx:27-77`). Menü ürün, bina-altyapı, inşaat planlaması, ortak çözümler, işbirliği gruplarına ayrılır (`components/layout/Header.tsx:35-79`).
- Tema sağlayıcı varsayılan dark, sistem tercihi açık; global breadcrumb, trial CTA, footer, cookie banner, yukarı kaydırma bulunur (`app/layout.tsx:115-129`).
- CopyProtection global sağ tık, kopyalama, Cmd/Ctrl+C ve geliştirici araçları kısayollarını engeller (`components/sections/CopyProtection.tsx:49-62`); root layout her sayfaya koyar (`app/layout.tsx:127`). Bu gerçek içerik güvenliği sağlamaz, kullanıcı erişimini zorlaştırır; yeni sürüme otomatik taşınmamalı.
- Video açma tetikleyicisi onClick verilen div; kapatma düğmesi yalnız ikon (`components/specialized-ui/VideoModal.tsx:25-27,44-48`). Klavye erişimi ve erişilebilir isim borcu olarak ele alınmalı; browser/a11y testi yapılmadı.

## İçerik katmanları ve sürüm ayrımı

- Ana kaynak homepage: `app/(public)/page.tsx:19-29`, HeroV2, HeroQuickLinks, BimflexAnnouncement, BentoGrid, PathwayProductSystem, InnovationsTeaser, TechSpecsTable, ServicesV2 kullanır.
- `live-versiyon` bağımsız package ve app kopyası içerir (`live-versiyon/package.json:1-14`). Onun homepage'inde HeroQuickLinks/BimflexAnnouncement yok (`live-versiyon/app/(public)/page.tsx:17-25`). “live” klasör adı canlı sunucunun bu içeriği çalıştırdığını kanıtlamaz; bu incelemede canlı SHA/sunum doğrulanmadı.
- `content/homepage.txt:1-10` SAYFA/BAŞLIK/HERO/BUTON alanlarıyla eski sayfa içerik kaynağını taşır; `:25-33` legacy bağlantılar içerir. Bunlar güncel React render ağacıyla birebir aynı değildir.
- content dizini yalnız arşiv değildir: build script `.txt` dosyalarını okuyup arama indeksi üretir (`scripts/build-search-index.js:112-155`); build komutu bunu çağırır (`package.json:7-8`). Taşınacak route ve arama indeksi birlikte eşlenmelidir; eski metinler aramada yanlış güncel iddia üretebilir.
- Dosya adları taramasında `live-versiyon` içinde sır/erişim betiği çağrışımlı adlar gözlendi. İçerikleri açılmadı. Toplu kopya yerine izinli kaynak/asset seçimi kullanılmalı; bu gözlem gerçek anahtar bulunduğu veya ifşa olduğu iddiası değildir.

## Marka, hedef kitle ve iddia denetimi

- Metadata ALLPLAN Türkiye, profesyonel BIM, mimarlar/mühendisler/müteahhitler ve tasarımdan üretime akışı anlatır (`app/(public)/page.tsx:11-16`).
- Hakkımızda Aluplan Program Sistemleri, 1995, Allplan Türkiye distribütörlüğü, eğitim/danışmanlık/teknik destek ve mimarlık, inşaat mühendisliği, köprü, prekast alanlarını belirtir (`app/about/ClientPage.tsx:25-30,52-54`). Bunlar kaynakta bulunan anlatılardır; sözleşmesel unvan ve tarih dışarıdan doğrulanmadı.
- Müşteri kitlesi belediyeler, üniversiteler, özel mimarlık/mühendislik ofisleri, büyük inşaat firmaları olarak anlatılır (`app/about/ClientPage.tsx:54`). Rol selector mimar/mühendis/prekast üreticisine odaklanır (`components/homepage-v2/PathwayProductSystem.tsx:27-54`).
- “29+ yıl”, “500+ aktif müşteri”, “50+ uzman”, “10K+ proje” hardcoded (`app/about/ClientPage.tsx:8-12`). “Sıfır hata”, “hatasız projeler” gibi mutlak sonuç iddiaları vardır (`components/homepage-v2/PathwayProductSystem.tsx:41,50`). Bağımsız dayanak yok; doğrulanmadan yeni siteye iddia olarak aktarılmamalı. 1995/29+ zaman uyumu da editoryal kontrol ister.

## Hosting kanıtı ve sınırı

- Next standalone ayarı (`next.config.js:4`), Node 20 Alpine çok aşamalı Dockerfile, non-root nextjs kullanıcısı, 3000 portu, server.js başlatma vardır (`Dockerfile:1,24,34-56`). Dockerfile npm install kullanır; kilitli deterministik kurulum değildir (`Dockerfile:10-11`).
- npm start 8090, dev 8083, Docker 3000 ayrımı bilinmeli (`package.json:6,10`; `Dockerfile:50-56`).
- Coolify rehberi VPS + Dockerfile + GitHub projesi + aluplan.com.tr domain örneği verir (`docs/COOLIFY_DEPLOYMENT.md:3-9,36-55`). Bu kurulum niyetini kanıtlar; mevcut sunucu sağlayıcısı, Oracle kaynağı, DNS, TLS, çalışan container, deploy SHA, yedekler ve sağlık durumu bu dosyadan kanıtlanamaz.
- Kaynak build ESLint hatalarını görmezden gelir (`next.config.js:8-10`). Yeni projenin doğrulama kapısı olarak kopyalanmamalı.
