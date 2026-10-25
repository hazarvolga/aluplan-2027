# FAZ 2 — Teknik Analiz (Baseline) Raporu (`baseline-report.md`)

**Tarih:** 25.10.2026  
**Kapsam:** Salt-okunur kaynak (`../aluplan-2026`), canlı site (`https://aluplan.com.tr`) tarama kayıtları (`docs/00-inventory/content-inventory.json`, `url-parity.json`, `asset-inventory.json`) ve sunucu/kod yapılandırmaları (`next.config.js`, `middleware.ts`, `package.json`, `app/layout.tsx`, `app/sitemap.ts`, `app/robots.ts`).  
**Durum:** Onay bekliyor (Faz 2 çıktısı).  
**Yöntem ve Kanıt Sınırı:** Bu rapordaki tüm metrikler gerçek dosya baytlarından, canlı HTTP yanıt kayıtlarından ve kaynak kod denetiminden üretilmiştir. Tarayıcı tabanlı sentetik Lighthouse/CWV skorları ortam/ağ dalgalanmasına duyarlı olduğundan, ölçülen gerçek ağ/bayt/DOM değerleri ile Faz 3/6'da uygulanacak **Performans Bütçesi Hedefleri** ("Önce" vs. "Hedef") net biçimde ayrılmıştır.

---

## 1. Performans Analizi (CWV Riskleri, TTFB, Sayfa/Medya Ağırlığı ve JS/Font Yükü)

### 1.1 Ölçülen "Önce" (Baseline) Değerleri ve Hedefler

| Metrik / Gösterge | Mevcut "Önce" (Baseline) Değeri | Kanıt Kaynağı | Faz 3/6 Hedef Bütçesi |
| :--- | :--- | :--- | :--- |
| **Canlı TTFB / HTML Yanıt Süresi (Medyan)** | **541 ms** (Min: ~380 ms, Maks: **869 ms** — `/solutions-v2/training/video-library/bridge-workflows`) | `content-inventory.json` (112 HTTP 200 sayfası `seconds` alanı) | **< 200 ms** (Statik/SSG + CDN önbelleği) |
| **İlk HTML Doküman Boyutu (Maksimum)** | **306.781 bayt (~300 KB)** (`/references`), **208.062 bayt** (`/solutions`), **181.021 bayt** (`/products/civil`) | `content-inventory.json` (`bytes` alanı) | **< 100 KB** (Büyük veri dizilerinin parçalanması ve sayfalama/lazy-hydration) |
| **Ana Sayfa Hero Videosu (`hero-bim.mp4`)** | **20.769.094 bayt (~19,81 MiB)** (`autoPlay`, `loop`, masaüstü/mobilde aynı MP4 kaynağı) | `asset-inventory.json`, `components/homepage-v2/HeroV2.tsx:40-56` | Optimize WebM/MP4 (< 4–6 MiB), poster önceliği (`fetchpriority="high"`), `prefers-reduced-motion` kontrolü |
| **Ürün/Çözüm Sayfa İçi MP4 Videoları** | **12.614.102 bayt (~12,03 MiB)** × 2 kopya (`2024-header.mp4`), **9.607.679 bayt** (`09_Structural...mp4`), **7.065.114 bayt** (`11_Further...mp4`) | `asset-inventory.json` (`assets/products/allplan-aec/hero/`, `assets/solutions/bridge/features/`) | Tekil (deduplicated) medya havuzu, poster + görünürlükte (IntersectionObserver) yükleme |
| **Sayfa Başına Script İsteği (Ana Sayfa)** | **23 harici `<script>` chunk'ı** + Google Tag Manager (`gtag/js`) | `content-inventory.json` (`/` kaydı `scripts` dizisi) | Server Components öncelikli mimari; minimal client adacıkları |
| **Ağır Üçüncü Parti / Animasyon Paketleri** | `framer-motion` (`^12.23.25`), `gsap` (`^3.14.2`), `three` (`0.181.2`), `@react-three/fiber`, `@react-three/drei`, `recharts` | `../aluplan-2026/package.json:45-70` | Üretimde kullanılmayan 3D (`three`, `r3f`) ve `gsap` (`CopyProtection`) paketlerinin tamamen çıkarılması |
| **Font Yükleme Stratejisi** | `next/font` devre dışı bırakılmış (`app/layout.tsx:16-34`); `styles/globals.css:1` üzerinden Google Fonts CSS `@import` (`Inter 100–900`, `Space Grotesk 300–700`, `IBM Plex Mono 400–600`) | `app/layout.tsx:16-34`, `docs/00-inventory/existing-design-tokens.md:8` | Self-hosted WOFF2 (`latin` + `latin-ext`), `font-display: swap`, toplam ≤ 6 font dosyası (< 90 KB) |
| **Core Web Vitals (LCP / INP / CLS)** | **Riskli (Kod/Varlık Kanıtlı):** Render-blocking `@import` fontlar (LCP/CLS riski), 19,8 MiB hero video, her sayfada çalışan `CopyProtection` GSAP/event dinleyicileri ve 14 sonsuz Framer Motion parçacığı (INP/ana iş parçacığı yükü) | `HeroV2.tsx:78-101`, `CopyProtection.tsx:40-100`, `app/layout.tsx:16-34` | **LCP < 2,5 sn**, **INP < 200 ms**, **CLS < 0,1**, **Lighthouse ≥ 90** |

### 1.2 Öncelikli Performans Bulguları
1. **`PERF-01` (Yüksek) — Render-Blocking Google Fonts `@import` Kullanımı:** `app/layout.tsx:16` içinde `"Fonts disabled for Docker build - loaded via CDN in globals.css"` yorumuyla `next/font/google` kapatılmış ve `styles/globals.css` başında `@import` kullanılmıştır. CSS `@import` tarayıcının stil dosyasını indirdikten sonra seri olarak ikinci bir bağlantı kurmasına yol açar, LCP'yi geciktirir ve font geçişinde CLS üretir.
2. **`PERF-02` (Yüksek) — 19,81 MiB Hero Videosu ve Çift Kopyalı 12,03 MiB MP4 Varlıkları:** `public/videos/hero-bim.mp4` (20,77 MB) sıkıştırılmadan doğrudan sunulmaktadır. Ayrıca `2024-header.mp4` (12,61 MB) hem `assets/products/allplan-aec/hero/` hem de `assets/solutions/bridge/features/` altında birebir aynı SHA-256 ile iki kez yer almaktadır (`asset-inventory.json`).
3. **`PERF-03` (Yüksek) — Gereksiz JS Kütüphaneleri (`gsap`, `three`, `@react-three/*`):** `gsap` yalnızca her sayfaya yüklenen `CopyProtection` yürüyen adam animasyonu için, `three` / `@react-three/*` ise yalnız test/deneme rotaları (`/hero-3d`, `/test-webgl`) için bağımlılıklarda tutulmaktadır (`package.json:45-47, 54, 70`).
4. **`PERF-04` (Orta) — Çok Büyük İlk HTML Çıktıları:** `/references` (306 KB HTML) ve `/solutions` (208 KB HTML) sayfalarında tüm veri ve bileşen ağacı tek seferde serialize edilmektedir.

---

## 2. Teknik SEO Analizi

### 2.1 Ölçülen "Önce" (Baseline) SEO Tablosu (112 HTTP 200 Sayfası)

| SEO Kontrol Kalemi | Mevcut "Önce" Durumu (112 Sayfa) | Kanıt (`content-inventory.json` / Kaynak Kod) | Öncelik |
| :--- | :--- | :--- | :--- |
| **Self-Referencing Canonical Doğruluğu** | **Yalnızca 4 / 112 sayfa (%3,6) doğru!** (`/` , `/products`, `/products/ax3000/dokumanlar`, `/solutions/bimflex`) | **92 alt sayfa** `https://aluplan.com.tr` (ana sayfa) canonical'ına; **16 ürün alt sayfası** ise `https://aluplan.com.tr/products` canonical'ına işaret ediyor (`app/layout.tsx:53-55`, `app/products/layout.tsx`) | **Kritik / Yüksek** |
| **OpenGraph `og:url` Doğruluğu** | **Yalnızca 3 / 112 sayfa doğru!** | **93 sayfa** `og:url="https://aluplan.com.tr"`, **18 sayfa** `og:url="https://aluplan.com.tr/products"`, **1 sayfa** `/solutions/bimflex` döndürüyor (`app/layout.tsx:59`) | **Yüksek** |
| **Sayfa Başlığı (`<title>`) Tekilliği** | **58 / 112 sayfa (%51,8) aynı varsayılan başlığı kullanıyor!** | `"Aluplan - Premium Mühendislik Çözümleri"` başlığı `/references`, `/kvkk`, `/gizlilik-politikasi`, `/package-overview` ve tüm `/solutions-v2/*` sayfalarında birebir tekrarlanıyor | **Kritik / Yüksek** |
| **Meta Description Tekilliği** | **59 / 112 sayfa (%52,7) aynı varsayılan açıklamayı kullanıyor!** | `"Mimarlık, mühendislik ve inşaat sektörü için premium yazılım çözümleri, BIM danışmanlığı ve eğitim hizmetleri."` (`app/layout.tsx:47`) 59 sayfada kopya | **Yüksek** |
| **Marka Yazım Tutarlılığı (`<title>`)** | **92 sayfa** yalnız `Aluplan`, **15 sayfa** `ALLPLAN ... \| Aluplan`, **4 sayfa** `Allplan ... \| Aluplan`, **1 sayfa** markasız | Ürün sayfalarında `ALLPLAN` (tam büyük harf) ve `Allplan` (Baş harf büyük) karışık kullanılıyor | **Orta** |
| **H1 Başlık Yapısı** | **94 sayfa** tek `<h1>`, **14 sayfa** çift `<h1>`, **4 sayfa** `<h1>` yok | Video kütüphanesi alt sayfalarının tamamında (`/solutions-v2/training/video-library/[playlistId]`) **2 adet `<h1>`** var; `/search`, `/solutions-v2/connect-license/activation`, `/hero-3d`, `/test-webgl` sayfalarında **`<h1>` yok** | **Orta** |
| **`sitemap.xml` Doğruluğu** | **Hatalı ve Eksik** (`app/sitemap.ts`) | Sitemap içinde **7 adet HTTP 404 dönen URL** (`/products/bimplus-signup`, `/products/partner-solutions`, `/products/sds2-detail`, `/products/sds2-load`, `/products/tim`, `/solutions/bimplus`, `/solutions/addon-channel`) ve **1 adet sistem rotası (`/health`)** var. Buna karşılık `/references`, `/products`, `/products/allplan-2026`, `/solutions-v2/training`, `/solutions-v2/faq` ve 14 video oynatma listesi **sitemap'te hiç yok!** Ayrıca `lastModified: new Date()` her build'de tüm sayfaları yeni değişmiş gibi gösteriyor | **Kritik / Yüksek** |
| **İç Link ve Yönlendirme Sağlığı** | **11 benzersiz HTTP 404**, **4 sağlam HTTP 308**, **1 kırık 308→404 zinciri** (`/allplan-2021-features/`), **112 sayfada `/cdn-cgi/l/email-protection` 404 linki** | `docs/00-inventory/url-closure-2026-10-22.md`, `content-inventory.md:180-191` | **Yüksek** |

### 2.2 Kritik SEO Kök Neden Analizi
1. **`SEO-01` (Kritik) — Kök Layout Canonical Mirası (`app/layout.tsx:53-55`):** Next.js App Router'da kök `layout.tsx` içinde `alternates: { canonical: '/' }` tanımlandığında, kendi `generateMetadata` veya `metadata.alternates.canonical` değerini tanımlamayan tüm alt rotalar (`"use client"` olan veya metadata export etmeyen 92 sayfa) `<link rel="canonical" href="https://aluplan.com.tr"/>` etiketi üretmektedir. Benzer şekilde `app/products/layout.tsx` içindeki tanım nedeniyle 16 ürün detay sayfası `/products` dizinine canonical vermektedir. Bu durum Google'a sitenin **%96,4'ünün (108/112 sayfa)** kopya olduğu sinyalini gönderir ve indekslemeyi doğrudan baltalar.
2. **`SEO-02` (Kritik) — `"use client"` Sayfalarında Metadata Eksikliği (58 Sayfa):** `/references`, `/solutions-v2/training/*`, `/solutions-v2/faq`, `/kvkk` gibi sayfalar doğrudan istemci bileşeni olarak yazıldığı veya üst Server Component'te `metadata` export edilmediği için kök layout'un genel `<title>` ve `<meta name="description">` değerlerini kopyalamaktadır.
3. **`SEO-03` (Yüksek) — Sitemap (`app/sitemap.ts`) ve Kırık Breadcrumb (`/solutions-v2`):** `app/sitemap.ts` elle yazılmış statik bir dizi kullanmaktadır; 404 dönen eski rotaları ve `/health` uç noktasını arama motorlarına sunarken `/references` ve `/solutions-v2/training` gibi ana sayfaları dışarıda bırakmaktadır. Ayrıca `components/ui/breadcrumb.tsx` URL parçalarından otomatik `/solutions-v2` ara düğümü üreterek hem görsel ekmek kırıntısında hem de `BreadcrumbList` JSON-LD içinde **404 dönen URL** yayınlamaktadır.

---

## 3. GEO (Generative Engine Optimization / AI Arama Görünürlüğü)

| GEO Kriteri | Mevcut "Önce" Durumu | Kanıt | Faz 3/6 Hedefi |
| :--- | :--- | :--- | :--- |
| **AI Crawler Erişimi (`robots.txt`)** | `User-agent: * / Allow: /` (`app/robots.ts:1-11`). Engelleme yok ancak AI botları (`GPTBot`, `OAI-SearchBot`, `ClaudeBot`, `PerplexityBot`, `Google-Extended`) için açık izin ve `/api/*`, `/health`, `/hero-3d`, `/test-webgl` için `Disallow` kuralı tanımlı değil. | `../aluplan-2026/app/robots.ts` | AI arama botlarına açık erişim; iç/test/API rotalarına `Disallow` |
| **`/llms.txt` ve `/llms-full.txt`** | **Yok (404).** | `../aluplan-2026/public/` dizin kontrolü | Aluplan'ın distribütör kimliğini, ALLPLAN ürün/paket/sürüm hiyerarşisini, AX3000/BIMFlex/SDS2 çözümlerini ve resmî iletişim/destek kanallarını özetleyen standart `/llms.txt` |
| **Yapılandırılmış Veri (`Schema.org` JSON-LD)** | **Yalnızca `BreadcrumbList` (111 sayfada).** Sitede `Organization`, `WebSite`, `SoftwareApplication`, `Product`, `Service`, `VideoObject` veya `CollectionPage` şeması **hiç yok (0 adet)**. | `content-inventory.json` (`schema` alanı analizi) | [schema-final-review-2026-10-22.md](./schema-final-review-2026-10-22.md) sözleşmesine göre kanıtlı, fiyatsız/uydurmasız JSON-LD varlık grafiği (`@id` tabanlı) |
| **JS Olmadan (SSR) İçerik Görünürlüğü** | İlk HTML'de ana metinler mevcut ancak çok sekmeli sayfalarda (`WorkflowTabsTemplate`, `ServicesV2`, `PathwayProductSystem`) yalnızca varsayılan ilk sekme/kategori DOM'da render ediliyor; diğer sekmeler JS tıklamasına bağımlı. | `components/templates/WorkflowTabsTemplate.tsx`, `components/homepage-v2/ServicesV2.tsx` | Kritik ürün/hizmet açıklamalarının ilk HTML'de (Server Components) taranabilir olması; sekmelerin yalnız görünürlük/sunum katmanını yönetmesi |
| **Varlık (Entity) Netliği ve Cevap Odaklılık** | Aluplan (Türkiye distribütörü ve hizmet sağlayıcı) ile ALLPLAN GmbH / Nemetschek (yazılım üreticisi) varlık sınırları metin ve meta düzeyinde iç içe geçmiş durumda. | `docs/allplan-content-mapping.md`, `docs/page-responsibilities.md` | Her sayfa başında net varlık tanımı (Üretici: ALLPLAN / Türkiye Distribütörü ve Çözüm Ortağı: Aluplan Program Sistemleri) |

---

## 4. Güvenlik Analizi (Headers, TLS, API/Form, Bağımlılıklar ve Açık Dosyalar)

### 4.1 Güvenlik Başlıkları ve Yapılandırma (`next.config.js` vs. `middleware.ts`)

| Güvenlik Alanı | Mevcut "Önce" Durumu ve Bulgular | Kanıt (Dosya / Satır) | Öncelik |
| :--- | :--- | :--- | :--- |
| **SEC-01 — Çift ve Çelişkili CSP (Content-Security-Policy) Tanımı** | CSP hem `next.config.js:81-97` hem de `middleware.ts:25-37` içinde tanımlanmıştır. `middleware.ts` tüm rotalarda (`/:path*`) çalıştığı için `next.config.js` içindeki CSP'yi ezer (`overwrite`). Üstelik: (1) Her iki CSP'de de `'unsafe-inline'` (ve `next.config.js`'de üretimde dahi `'unsafe-eval'`) açıktır; bu XSS korumasını büyük ölçüde etkisizleştirir. (2) `app/layout.tsx:103` `https://www.googletagmanager.com/gtag/js` yüklerken `next.config.js` `script-src` listesinde `googletagmanager.com` yoktur. (3) `middleware.ts` `frame-src https:` ve `connect-src 'self' https:` diyerek tüm HTTPS kaynaklarına izin verirken `frame-ancestors` ve `form-action` direktiflerini düşürmektedir. | `../aluplan-2026/next.config.js:81-97`, `../aluplan-2026/middleware.ts:21-37` | **Yüksek** |
| **SEC-02 — Aktivasyon API'sinde HTML Injection ve Güvensiz TLS (`rejectUnauthorized: false`)** | `/api/send-activation-email/route.ts` uç noktasında: (1) Kullanıcıdan alınan `firstName`, `lastName` ve `email` alanları hiçbir HTML escape veya şema doğrulamasından geçirilmeden doğrudan yönetici ve kullanıcı e-posta HTML şablonlarına (`<h2>Merhaba ${firstName} ${lastName},</h2>`, `:50-76`) gömülmektedir (**HTML/Phishing Injection**). (2) `email` alanı doğrudan `to: email` olarak kullanıldığı için **açık e-posta rölesi / spam suistimali (Email Relay Abuse)** riski taşır. (3) Nodemailer yapılandırmasında `tls: { ciphers: "SSLv3", rejectUnauthorized: false }` (`:40-43`) kullanılarak eski/güvensiz `SSLv3` şifrelemesi ve **sertifika doğrulamasını devre dışı bırakma (MITM riski)** uygulanmıştır. | `../aluplan-2026/app/api/send-activation-email/route.ts:7-11, 40-43, 50-77` | **Kritik** |
| **SEC-03 — API Uç Noktalarında Rate Limiting, CSRF ve Bot Koruması Eksikliği** | `/api/send-activation-email` ve `/api/contact` (`app/api/contact/route.ts:3-9`) uç noktalarında IP bazlı hız sınırlaması (rate limiting), Origin/CSRF kontrolü, honeypot/CAPTCHA veya Zod şema doğrulaması yoktur. | `../aluplan-2026/app/api/send-activation-email/route.ts`, `../aluplan-2026/app/api/contact/route.ts`, `../aluplan-2026/middleware.ts` | **Yüksek** |
| **SEC-04 — Üretimde Açık Kalan Test/Geliştirme Rotaları** | Canlı sitede `https://aluplan.com.tr/hero-3d`, `https://aluplan.com.tr/test-webgl` ve `https://aluplan.com.tr/health` (ayrıca `/health` `sitemap.ts:11` içinde!) herkese açık olarak HTTP 200 dönmekte ve indekslenmektedir. | `content-inventory.json`, `../aluplan-2026/app/sitemap.ts:11` | **Orta** |
| **SEC-05 — Derleme ve Docker Güvenlik Borçları** | (1) `next.config.js:8-10` içinde `eslint: { ignoreDuringBuilds: true }` aktiftir; kod kalitesi ve güvenlik lint kuralları build sırasında atlanmaktadır. (2) `Dockerfile:10-11` kilitli `npm ci` yerine `npm install` kullanmaktadır. (3) Kaynak klasörde bulunan `live-versiyon/` kopyası içinde erişim/betik çağrışımlı arşiv dosyaları gözlenmiştir (`source-findings.md:43`). | `../aluplan-2026/next.config.js:8-10`, `docs/00-inventory/source-findings.md:43, 54-57` | **Orta** |
| **SEC-06 — Mevcut Olumlu Güvenlik Başlıkları (Korunacaklar)** | `poweredByHeader: false` (`X-Powered-By` gizli), `Strict-Transport-Security` (`max-age=63072000; includeSubDomains; preload`), `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy: camera=(), microphone=(), geolocation=()` tanımlıdır. | `../aluplan-2026/next.config.js:7, 52-75` | **Korunacak** |

---

## 5. Uyumluluk Analizi (KVKK / GDPR, Çerez İzni ve Yasal Sayfalar)

| Uyumluluk Kalemi | Mevcut "Önce" Durumu | Kanıt | Öncelik |
| :--- | :--- | :--- | :--- |
| **COMP-01 — Rıza Olmadan Yüklenen Analitik ve Üçüncü Taraf Çerezleri** | `app/layout.tsx:102-114` içindeki Google Tag (`GT-5TQ6VQ4`) ve Google Analytics (`G-DQYT0D9MQ5`) `strategy="afterInteractive"` ile sayfa açılır açılmaz, kullanıcının `CookieConsent` tercihine bakılmaksızın yüklenmektedir. `CookieConsent.tsx:12-29` yalnız `localStorage.setItem("cookie-consent", "accepted" \| "declined")` yazar; kod tabanının hiçbir yerinde bu değer okunup analitik veya YouTube/Google Maps iframe yüklemesi engellenmez. | `app/layout.tsx:102-114`, `components/layout/CookieConsent.tsx:12-29`, `docs/00-inventory/global-state-source-review-2026-10-22.md:122-124` | **Yüksek** |
| **COMP-02 — Çerez Tercihini Sonradan Değiştirme / Geri Alma Mekanizması Yok** | Kullanıcı çerez bildirimi üzerinde bir kez `Kabul Et` veya `Reddet` seçtiğinde banner kapanır; footer veya gizlilik sayfasında çerez tercihlerini yeniden açacak veya güncelleyecek bir düğme bulunmaz. Ayrıca kategori bazlı (Zorunlu / Analitik / Pazarlama) ayrım yoktur. | `components/layout/CookieConsent.tsx:12-58` | **Orta** |
| **COMP-03 — Yasal Sayfaların Varlığı ve Korunması** | `/kvkk` (KVKK Aydınlatma Metni), `/gizlilik-politikasi` (Gizlilik Politikası) ve `/kullanim-sartlari` (Kullanım Şartları) sayfaları canlıda HTTP 200 olarak mevcuttur ve içerikleri tamdır. Ancak her üç sayfa da `SEO-01` ve `SEO-02` nedeniyle ana sayfa canonical'ına ve genel `"Aluplan - Premium Mühendislik Çözümleri"` başlığına sahiptir. Ayrıca `/kullanim-sartlari` `app/sitemap.ts` içinde yer almamaktadır. | `content-inventory.json`, `app/sitemap.ts:7-15` | **Orta** |
| **COMP-04 — Formlarda Açık KVKK Onay Kutusu ve Veri Minimizasyonu** | Yerel `ContactModal` ve `ActivationWizard` içinde gönderim öncesi açık KVKK aydınlatma/onay bağlantısı ve sunucu tarafı veri saklama/işleme kaydı standartlaştırılmamıştır. | `docs/00-inventory/source-findings.md:12-16`, `docs/request-forms-contract.md` | **Yüksek** |

---

## 6. Önceliklendirilmiş Teknik İyileştirme Yol Haritası (Faz 3 PRD ve Faz 6 Geliştirme Girdisi)

### P0 — Kritik (Mimari ve Yayın Öncesi Zorunlu)
1. **Tekil ve Doğru Metadata / Canonical Mimarisi (`SEO-01`, `SEO-02`):** Kök `layout.tsx` içinden sabit `alternates.canonical: '/'` ve `openGraph.url` miras hatası kaldırılacak; her rota kendi tekil `title`, `description`, `canonical` ve `og:url` değerini Server Component `metadata` / `generateMetadata` katmanından üretecek (112/112 sayfada %100 self-referencing canonical).
2. **Form ve API Güvenliği (`SEC-02`, `SEC-03`):** Aktivasyon ve yeni Next.js kısa talep formlarında sunucu tarafı `zod` şema doğrulaması, HTML escape, alıcı adresi kısıtlaması, `rejectUnauthorized: true` (TLS 1.2/1.3), CSRF/Origin doğrulaması ve IP/istek hız sınırlaması (rate limiting) uygulanacak; sahte başarı döndüren simülasyon uç noktaları kaldırılacak.
3. **Gerçek Çerez Rıza Yönetimi (`COMP-01`, `COMP-02`):** Google Analytics / Tag Manager ve üçüncü taraf gömülü içerikler yalnızca kullanıcı açıkça analitik/üçüncü taraf çerezlerine onay verdiğinde (`cookie-consent === "accepted"`) yüklenecek; footer'a `"Çerez Tercihleri"` geri açma bağlantısı eklenecek.

### P1 — Yüksek (Performans, Sitemap, GEO ve Güvenlik Başlıkları)
4. **Dinamik ve Doğrulanmış `sitemap.ts` + Breadcrumb Düzeltmesi (`SEO-03`):** Sitemap yalnızca HTTP 200 dönen gerçek kamusal sayfaları ve gerçek içerik revizyon tarihlerini içerecek; 404 dönen 7 URL ve `/health` çıkarılacak, eksik `/references`, `/products`, `/solutions-v2/training`, `/solutions-v2/faq` ve video koleksiyonları eklenecek. Breadcrumb bileşeni 404 dönen `/solutions-v2` ara yolunu üretmeyecek.
5. **Self-Hosted WOFF2 Fontlar ve Medya/Paket Temizliği (`PERF-01`..`PERF-03`):** Google Fonts CSS `@import` kaldırılarak `next/font/local` ile WOFF2 (`Manrope`, `IBM Plex Sans`, `IBM Plex Mono`) kullanılacak; `three`, `@react-three/*` ve `gsap` paketleri kaldırılacak; hero ve ürün videoları optimize edilip çift kopyalar tekilleştirilecek.
6. **Tek Kaynaklı Nonce/Strict CSP (`SEC-01`):** `next.config.js` ve `middleware.ts` arasındaki çelişkili çift CSP kaldırılıp tek merkezden (`middleware.ts` veya `next.config.js`) `'unsafe-eval'` içermeyen, izinli kaynakları açıkça tanımlanmış güvenlik başlıkları sunulacak.
7. **GEO ve `@id` Tabanlı Schema.org Varlık Grafiği (`GEO`):** `/llms.txt` oluşturulacak; `robots.txt` içinde AI arama botlarına açık erişim ve test/API rotalarına `Disallow` tanımlanacak; sadece `BreadcrumbList` olan mevcut yapı, [schema-final-review-2026-10-22.md](./schema-final-review-2026-10-22.md) sözleşmesine uygun `Organization`, `WebSite`, `SoftwareApplication`/`Product` (fiyat uydurmadan), `Service` (Eğitim ve iki kanallı Teknik Destek) ve `VideoObject` şemalarıyla zenginleştirilecek.

### P2 — Orta (Temizlik ve DevOps Kapıları)
8. **Test Rotalarının Kapatılması ve Derleme Kapıları (`SEC-04`, `SEC-05`):** `/hero-3d` ve `/test-webgl` üretim derlemesinden çıkarılacak; `ignoreDuringBuilds: true` kaldırılarak CI/CD hattında TypeScript, ESLint, birim test, URL parite testi ve kontrast kontrolü zorunlu kapı (gate) yapılacak.
