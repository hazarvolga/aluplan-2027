# Aluplan 2027 — Faz 6 Final Önce / Sonra (Before / After) ve Kabul Raporu

**Tarih:** 25 Ekim 2026  
**Proje:** `aluplan-2027` (`https://aluplan.com.tr` Yeniden Yapılandırma)  
**Karşılaştırma Bazı:** `docs/baseline-report.md` (Faz 2 Teknik Baseline) & `docs/PRD.md` (Faz 3 PRD Hedefleri)  
**Tasarım Sistemi:** Onaylı Antrasit Mühendislik Tasarım Sistemi (`design-system/` — `radius.surface = 0px`, `1px` sınır, `Manrope` / `IBM Plex Sans` / `IBM Plex Mono`)

---

## 1. Yönetici Özeti

Faz 0–5 boyunca envanteri çıkarılan, UX ve teknik borçları tespit edilen, PRD ile sözleşmeye bağlanan ve Antrasit tasarım sistemiyle tasarlanan yeni **Aluplan 2027 (`src/`)** Next.js uygulaması tamamlanmıştır. Eski sitedeki tüm içerikler, URL'ler, 308 yönlendirmeleri, 14 eğitim video serisi (`216` tekil / `242` toplam video), 20 profesyonel hizmet kaydı, indirilebilir PDF/DOCX belgeleri, iletişim bilgileri ve geliştirici kredisi (`"Design & Develop by Hazar Volga Ekiz"`) **%100 pariteyle** korunmuş; Faz 2'de belgelenen SEO, GEO, erişilebilirlik, performans ve güvenlik açıkları giderilmiştir.

---

## 2. Faz 2 Baseline ile Faz 6 Son Durum Karşılaştırması (Önce / Sonra)

### 2.1 SEO ve İndekslenebilirlik Metrikleri

| Metrik / Kontrol Kalemi | Faz 2 Baseline (Eski Site) | Faz 6 Son Durum (`aluplan-2027`) | Durum |
|---|---|---|---|
| **Self-Referencing Canonical Doğruluğu** | **4 / 112 (%3,6)** — 92 sayfa `/` köküne, 16 ürün sayfası `/products`'a işaret ediyordu (`SEO-01`) | **110 / 110 (%100)** — Her aktif sayfa kendi kanonik URL'sine (`https://aluplan.com.tr<path>`) işaret eder | ✅ Çözüldü |
| **Benzersiz `<title>` Oranı** | **54 / 112 (%48,2)** — 58 sayfada aynı jenerik başlık tekrarlanıyordu (`SEO-02`) | **110 / 110 (%100)** — Tüm 110 sayfada sayfa konusu ve hiyerarşisine özgü tekil Türkçe `<title>` | ✅ Çözüldü |
| **Benzersiz `<meta name="description">`** | **53 / 112 (%47,3)** — 59 sayfada aynı jenerik açıklama tekrarlanıyordu (`SEO-02`) | **110 / 110 (%100)** — Tüm 110 sayfada sayfa içeriğinden üretilmiş benzersiz meta açıklama | ✅ Çözüldü |
| **Tekil `<h1>` Hiyerarşisi** | **94 / 112 (%83,9)** — 14 video sayfasında çift `<h1>`, 4 sayfada `0` adet `<h1>` (`SEO-04`) | **110 / 110 (%100)** — Her sayfada tam 1 adet semantik `<h1>`, alt başlıklar `<h2>–<h4>` | ✅ Çözüldü |
| **`sitemap.xml` Doğruluğu** | **79 URL** — İçinde 7 adet `404` URL ve `/health` vardı; `/references`, `/solutions-v2/training` ve 14 video serisi eksikti (`SEO-03`) | **108 İndekslenebilir HTTP 200 URL** — Tüm aktif ürün, çözüm, eğitim, referans ve 14 video serisi eklendi; `404` ve `/health` çıkarıldı | ✅ Çözüldü |
| **Breadcrumb `404` Ara Düğümü** | `/solutions-v2/*` sayfalarının tamamında ara kırıntı `/solutions-v2` (`HTTP 404`) üretiyordu (`SEO-05`) | **0 Hatalı Ara Düğüm** — Üst kategori kırıntıları geçerli `/solutions` ve `/solutions-v2/training` rotalarına bağlandı | ✅ Çözüldü |
| **Cloudflare `[email protected]` Sızıntısı** | İletişim ve alt sayfa metin düğümlerinde `[email protected]` görünüyordu | **0 Sızıntı** — Tüm metin ve bağlantılarda `info@aluplan.com.tr` doğrudan ve temiz sunuldu | ✅ Çözüldü |

---

### 2.2 GEO (Generative Engine Optimization) ve Yapısal Veri (Schema.org)

| Metrik / Kontrol Kalemi | Faz 2 Baseline (Eski Site) | Faz 6 Son Durum (`aluplan-2027`) | Durum |
|---|---|---|---|
| **`/llms.txt` Desteği** | **Yok (`HTTP 404`)** (`GEO-01`) | **Aktif (`GET /llms.txt` — `200 OK`)** — Kurumsal kimlik, ALLPLAN paketleri, çözümler, eğitim ve iletişim özetini Markdown olarak sunar | ✅ Çözüldü |
| **AI Bot Erişimi (`robots.txt`)** | Yalnızca `*` tanımlıydı (`GEO-03`) | `GPTBot`, `OAI-SearchBot`, `ChatGPT-User`, `ClaudeBot`, `PerplexityBot`, `Google-Extended` açıkça yetkilendirildi | ✅ Çözüldü |
| **JSON-LD `@graph` Varlık Ağı** | Yalnızca tekil `BreadcrumbList` vardı; `Organization`, `WebSite`, `SoftwareApplication`, `Service`, `FAQPage`, `VideoObject` **0 adet** (`GEO-02`) | Tüm sayfalarda `@id` bağlantılı `Organization` (`#organization`), `WebSite` (`#website`), `BreadcrumbList` (`#breadcrumb`) ve sayfa tipine göre `SoftwareApplication`, `Service`, `FAQPage`, `CollectionPage`/`VideoObject` (uydurma fiyat/puan olmadan) | ✅ Çözüldü |

---

### 2.3 Güvenlik, Gizlilik ve KVKK Uyumluluğu

| Metrik / Kontrol Kalemi | Faz 2 Baseline (Eski Site) | Faz 6 Son Durum (`aluplan-2027`) | Durum |
|---|---|---|---|
| **Güvenlik Başlıkları (CSP / HSTS)** | `next.config.js` ve `middleware.ts` arasında çakışan çift CSP (`'unsafe-eval'` açık) (`SEC-01`) | `next.config.mjs` içinde tek merkezli `CSP` (`'unsafe-eval'` kaldırıldı), `HSTS`, `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy`, `Permissions-Policy` | ✅ Çözüldü |
| **API HTML Injection & TLS Güvenliği** | `/api/send-activation-email` içinde ham HTML birleştirme, `ciphers: 'SSLv3'` ve `rejectUnauthorized: false` (`SEC-02`, `SEC-03`) | `src/lib/security.ts` ile tüm girdilerde `escapeHtml()`, sunucu tarafı sabit alıcı, IP bazlı rate-limit ve `minVersion: 'TLSv1.2'` + `rejectUnauthorized: true` | ✅ Çözüldü |
| **Test/Geliştirme Rotaları (`/hero-3d`, `/test-webgl`)** | Canlı ortamda `200 OK` olarak açık kalmıştı (`SEC-05`) | Üretim rotalarından ve `sitemap.xml`'den kaldırıldı, `robots.txt` ile engellendi | ✅ Çözüldü |
| **KVKK Çerez Rızası (`CookieConsent`)** | Rıza reddedilse bile Google Analytics (`GT-5TQ6VQ4` / `G-DQYT0D9MQ5`) koşulsuz yükleniyordu (`SEC-06`) | `SiteShell.tsx` içinde açık `Tümünü Kabul Et` / `Yalnız Zorunlu Çerezler` seçimi; analitik yalnız `cookie-consent === 'accepted'` durumunda devreye girer | ✅ Çözüldü |

---

### 2.4 UI/UX, Erişilebilirlik (WCAG 2.2 AA) ve Performans

| Metrik / Kontrol Kalemi | Faz 2 Baseline (Eski Site) | Faz 6 Son Durum (`aluplan-2027`) | Durum |
|---|---|---|---|
| **Tasarım Sistemi ve Görsel Dil** | Dağınık Tailwind sınıfları, yuvarlatılmış/tutarsız kartlar, 30+ satır inline CSS değişkeni | Onaylı **Antrasit Tasarım Sistemi** (`#181A1B` zemin, `#202324` kart, `radius.surface = 0px` keskin köşe, `1px` `#414749` sınır, `#2DD4BF`/`#0F766E` Alu Teal vurgu) | ✅ Çözüldü |
| **WCAG 2.2 AA Kontrast Doğrulaması** | Alt metinlerde ve rozetlerde düşük kontrast | **188 / 188 (%100)** otomatik kontrast kontrolü (`design-system/tokens/build/CONTRAST-REPORT.md`, `0` hata) | ✅ Çözüldü |
| **Font Yükleme Stratejisi** | Render-blocking harici Google Fonts `@import` (`Syne`, `Plus Jakarta Sans`, `JetBrains Mono`) | Yerel self-hosted WOFF2 (`Manrope`, `IBM Plex Sans`, `IBM Plex Mono`, `font-display: swap`), sıfır dış font isteği | ✅ Çözüldü |
| **Ücretsiz Deneme CTA Tutarlılığı** | 14 gün / 30 gün çelişkisi ve kırık `/try-free` (`404`) bağlantıları | Kullanıcı kararıyla (`25.10.2026`) tüm ücretsiz deneme butonları doğrudan **`https://www.allplan.com/trial-or-subscription/`** adresine bağlandı; süre çelişkisi kaldırıldı | ✅ Çözüldü |
| **Header Eylem Sadeleştirmesi** | Üst bar, MegaMenu ve Hero'da mükerrer CTA karmaşası | Gezinme odaklı Header (`Çözümler`, `Ürünler`, `Kaynaklar`, `Referanslar`, `Hakkımızda`, `İletişim`, `Arama Ctrl+K`, `Koyu/Açık Mod`) + Hero'da net `Teklif İste` ve `Ücretsiz Deneme` | ✅ Çözüldü |
| **İstemci Tarafı 3B / Animasyon Yükü** | Kullanılmayan `three`, `@react-three/fiber`, `@react-three/drei`, `gsap` paketleri ve 19,81 MiB otomatik başlayan video | Sıfır gereksiz 3B/GSAP bağımlılığı; temiz SSG HTML + semantik CSS token mimarisi | ✅ Çözüldü |

---

## 3. Otomatik Parite ve Kalite Kapısı Sonuçları

Aşağıdaki otomatik doğrulama betikleri çalıştırılmış ve tamamı **0 hata** ile geçmiştir:

1. `python3 scripts/generate_site_data.py`:
   - `110 / 110` aktif HTTP 200 rotası `src/data/pages.json` içine üretildi.
   - `14 / 14` video oynatma listesi (`216` tekil / `242` toplam video) `src/data/playlists.json` içine üretildi.
   - `10 / 10` indirilebilir PDF/DOCX belgesi `public/docs/` altına üretildi.
2. `python3 scripts/verify_phase6_parity.py`:
   - **27 / 27 kontrol (`PASS`)** — URL haritası paritesi, 4 adet `308` yönlendirme, Türkçe karakterli `/solutions/imar-yonetmliği-bim-eklentisi` alias korunumu, %100 self-referencing canonical, %100 benzersiz `<title>` ve `<meta name="description">`, %100 tekil `<h1>`, sıfır `/solutions-v2` (404) breadcrumb hatası, sıfır `[email protected]` kalıntısı, sıfır `/try-free` (404) hatası, `H01–H08` ana sayfa ve Footer geliştirici kredisi paritesi, `/llms.txt`, `robots.ts`, `sitemap.ts` ve güvenlik katmanı doğrulandı.
3. `python3 -m unittest tests/test_url_parity.py`:
   - Mevcut URL parite birim testleri geçti.

---

## 4. Yayına Geçiş (Cutover) Öncesi Operasyonel Kontrol Listesi

Teknik uygulama tamamlanmış olup, canlı DNS/sunucu geçişi öncesinde işletim ekibinin (`Aluplan Yetkilileri`) aşağıdaki operasyonel anahtarları ortam değişkenlerine (`.env.production`) tanımlaması yeterlidir:
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` (TLSv1.2+ destekli kurumsal SMTP bilgileri).
- Canlı geçiş anında `https://aluplan.com.tr/sitemap.xml` adresinin Google Search Console'a yeniden gönderilmesi.
