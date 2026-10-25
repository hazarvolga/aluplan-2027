# FAZ 3 — Ürün Gereksinimleri Dokümanı (`PRD.md`)

**Proje:** Aluplan 2027 Web Yeniden İnşası (`aluplan.com.tr`)  
**Tarih:** 25.10.2026  
**Durum:** v1.0 — Onay Bekliyor (Faz 3 Çıktısı)  
**Temel Kaynaklar:** [MASTER-PROMPT.md](MASTER-PROMPT.md), [user-decisions.md](00-inventory/user-decisions.md), [ux-audit.md](ux-audit.md), [baseline-report.md](baseline-report.md), [long-term-web-strategy.md](long-term-web-strategy.md), [site-information-architecture.md](site-information-architecture.md), [page-template-requirements.md](page-template-requirements.md), [homepage-block-plan.md](homepage-block-plan.md), [request-forms-contract.md](request-forms-contract.md), [schema-final-review-2026-10-22.md](schema-final-review-2026-10-22.md), [BRAND-GUIDELINES.md](BRAND-GUIDELINES.md).

---

## 1. Özet, Vizyon ve Hedefler (Ölçülebilir KPI'larla)

### 1.1 Yönetici Özeti ve Vizyon
Aluplan Program Sistemleri, 1995'ten bu yana ALLPLAN'ın Türkiye distribütörü ve AEC/BIM ekosisteminin (AX3000, SDS2, Scalypso, BIMFlex, PythonPart, OSKA/Poz Kataloğu) uzman çözüm ortağıdır. Mevcut `aluplan-2026` sitesi; her yıl yeni ALLPLAN sürümü çıktığında sitenin baştan yapılması yükünü taşımakta, teknik SEO hataları (%96,4 yanlış canonical, %51,8 kopya başlık) barındırmakta ve 14 bölümlü tek form / sahte başarı döndüren simülasyon modalları nedeniyle dönüşüm kaybı yaşamaktadır.

**Aluplan 2027 Vizyonu:** Mevcut sitedeki tüm içerikleri, URL yapısını, medyaları ve kurumsal hafızayı **%100 kayıpsız** koruyarak; **içerik, bileşen ve tema katmanlarını birbirinden tamamen ayıran**, her yıl yeniden tasarım gerektirmeden yalnız sürüm/veri kaydı eklenerek güncellenebilen, yüksek performanslı, erişilebilir (WCAG 2.2 AA) ve güvenli bir kurumsal B2B web platformu kurmaktır.

### 1.2 Ölçülebilir Başarı Kriterleri (KPI Tablosu)

| Alan | Metrik | Mevcut ("Önce" Baseline) | Hedef ("Sonra" KPI) | Ölçüm Yöntemi |
| :--- | :--- | :--- | :--- | :--- |
| **İçerik & URL Paritesi** | Aktif URL, metin, PDF/DOCX ve medya koruma oranı | 116 aktif 2xx + 4 sağlam 308 (131 gözlemlenen yol) | **%100 parite** (Onaylı 301/308 haritası dahil sıfır kayıp) | `scripts/url_parity.py` + otomatik parite testi |
| **Teknik SEO** | Self-referencing canonical ve tekil `<title>` / `description` oranı | Canonical: **%3,6** (4/112); Tekil Title: **%48,2** (54/112) | **%100** (Tüm indekslemesi açık sayfalarda tekil title/desc ve doğru canonical) | Build-time SEO denetimi + HTML tarayıcı |
| **Performans (CWV)** | LCP / INP / CLS ve TTFB | Medyan TTFB: **541 ms**; Hero video: **19,81 MiB**; Render-blocking `@import` font | **LCP < 2,5 sn**, **INP < 200 ms**, **CLS < 0,1**, **TTFB < 200 ms**, **Lighthouse ≥ 90** | Lighthouse CI + Web Vitals saha/lab ölçümü |
| **GEO / Yapılandırılmış Veri** | Geçerli Schema.org varlık kapsama oranı ve `/llms.txt` | Yalnız `BreadcrumbList` (111 sayfa); `/llms.txt` yok | `/llms.txt` aktif + `Organization`, `WebSite`, `SoftwareApplication`/`Product`, `Service`, `VideoObject` **0 hata** | Schema Markup Validator + Rich Results Test |
| **Erişilebilirlik** | WCAG 2.2 AA kontrast, klavye ve dokunma alanı uyumu | Sosyal ikonlar 28×28 px; MegaMenü/VideoModal klavyesiz; `CopyProtection` engeli | **0 kontrast hatası**, **≥ 44×44 px** dokunma alanı, %100 klavye/ARIA erişimi | Otomatik token kontrast testi + Playwright axe-core |
| **Dönüşüm & Güvenilirlik** | Simülasyon/sahte başarı oranı ve deneme/teklif akışı netliği | 3 simülasyon uç noktası (`ContactModal`, `LicenseManagerModal`, `/api/contact`); 14/30 gün çelişkisi | **%0 sahte başarı** (yalnız gerçek kayıt/teslimatta onay); doğrudan `trial-or-subscription` deneme hedefi | E2E form teslimat ve hedef doğrulama testi |
| **Yıllık Bakım Yükü** | Yeni ALLPLAN sürümü (ör. 2027/2028) ekleme süresi | Tüm sitenin/sayfaların yeniden kodlanması | Şablonlara dokunmadan yalnız veri/sürüm kaydı (`ReleaseRecord`) ile güncelleme | İçerik kayıt sözleşmesi (`content-record-contract.md`) |

---

## 2. Kapsam ve Kapsam Dışı

### 2.1 Kapsam İçi (In-Scope)
1. `https://aluplan.com.tr` ve `../aluplan-2026` içindeki tüm aktif sayfaların, metinlerin, sayısal iddiaların (`29+ yıl`, `500+ aktif müşteri`, `50+ uzman kadro`, `10K+ proje`), görsellerin (503 hashli görsel), videoların (hero video + 14 oynatma listesindeki 216 video kaydı) ve indirilebilir dosyaların (6 PDF + 2 AX3000 DOCX) yeni mimariye eksiksiz taşınması.
2. İçerik (`data/content`), sunum bileşenleri (`components`) ve semantik tasarım tokenlarının (`tokens`) birbirinden bağımsız üç katman olarak kurulması.
3. Ana sayfada **Teklif İste** (Next.js kısa form sözleşmesi) ve **Ücretsiz Deneme** (`https://www.allplan.com/trial-or-subscription/` doğrudan bağlantısı) odaklı dönüşüm mimarisi.
4. Tek **Eğitim** başlığı altında dönemsel webinarlar, formsuz izlenebilen YouTube geçmiş webinar/video arşivi ve özel eğitim talebi akışı; iki kanallı **Teknik Destek** (`Microsoft Teams` ve `https://allplan.net.tr` ticket sistemi) erişimi.
5. Faz 1 (`ux-audit.md`) ve Faz 2 (`baseline-report.md`) raporlarında tespit edilen tüm SEO, GEO, performans, erişilebilirlik ve güvenlik sorunlarının giderilmesi.

### 2.2 Kapsam Dışı (Out-of-Scope)
1. Salt-okunur `../aluplan-2026` klasöründe veya kardeş projelerde (`aluplan-sertifka-sorgulama`, `aluplan-support-desk-v02` vb.) herhangi bir dosya değişikliği, silme veya derleme yapılması.
2. Harici bir Headless CMS (Strapi, Contentful, Sanity vb.) kurulumu (Kullanıcı kararıyla şimdilik ertelendi; dosya tabanlı tip güvenli içerik modeli CMS'e geçişe hazır kimliklerle kurgulanacaktır).
3. Yeni bir destek ticket sistemi veya uzaktan bağlantı yazılımı geliştirilmesi (`allplan.net.tr` ve `Teams` mevcut haliyle kullanılacaktır).
4. Ürünler için sitede fiyat yayınlanması, e-ticaret/sepet modülü veya doğrulanmamış müşteri yorumu/puanı (`AggregateRating`) üretilmesi.

---

## 3. Kullanıcı Tipleri (Persona) ve Temel Senaryolar

Detaylı kanıtları [ux-audit.md Bölüm 6](ux-audit.md#6-persona-ve-temel-kullanıcı-hedefleri) içinde yer alan 5 temel persona ve ana senaryoları:

1. **P1 — Mimar / Tasarım Ofisi Karar Vericisi:**
   - *Senaryo:* Ana sayfada `MİMAR` rolünü seçer → `ALLPLAN Basic / Concept / Professional` vurgusunu görür → Paket karşılaştırma tablosunu (HTML + PDF) inceler → `Teklif İste` ile ilgilendiği paketi seçerek kısa formu doldurur veya `Ücretsiz Deneme` ile doğrudan `https://www.allplan.com/trial-or-subscription/` sayfasına geçer.
2. **P2 — İnşaat / Yapı / Altyapı Mühendisi:**
   - *Senaryo:* `MÜHENDİS` rolünden veya `Çözümler` menüsünden Köprü (`Allplan Bridge`), Altyapı (`Civil`), Yapı Fiziği/Tesisat (`AX3000`) veya deprem/donatı eklentisi (`BIMFlex`) sayfasına gider → Teknik iş akışı sekmelerini ve AX3000 DOCX/PDF dokümanlarını inceler → Birden fazla modül/eklenti seçebildiği teklif formunu iletir.
3. **P3 — Prekast / Çelik Üretim ve Planlama Yöneticisi:**
   - *Senaryo:* `PREKAST` rolünden `Allplan Precast`, `Precast Detail`, `TIM` ve `SDS2` çözümlerini inceler → Kurumsal BIM geçiş danışmanlığı veya ürün teklifi için uzman ekiple iletişime geçer.
4. **P4 — Mevcut Lisanslı Kullanıcı / BIM Yöneticisi:**
   - *Senaryo:* Üst yardımcı menüden veya ana sayfa `Profesyonel Hizmetler` bloğundan doğrudan `Teknik Destek` (Teams canlı bağlantı veya `allplan.net.tr` ticket), `Lisans Yönetimi / Aktivasyon` (`CodeMeter WebDepot`, Deklarasyon Formu), `Sistem Gereksinimleri` veya `ALLPLAN FAQ` sayfasına tek tıkla ulaşır.
5. **P5 — Öğrenci / Akademisyen ve Kamu / Belediye Ekibi:**
   - *Senaryo:* `Eğitim` ve `Video Kütüphanesi` üzerinden form doldurmadan eğitim videolarını izler; öğrenci lisansı talebini ilgili alt yoldan iletir; kamu/belediye kullanıcısı `İmar Yönetmeliği BIM Eklentisi` ve `buildingSMART Türkiye IFC Aktarım El Kitabı (PDF)` dokümanına erişir.

---

## 4. Bilgi Mimarisi ve Sayfa Envanteri (URL'ler Korunarak)

Tam rota listesi [site-information-architecture.md](site-information-architecture.md) ve [site-architecture-route-map.csv](site-architecture-route-map.csv) (131 satır) içinde kayıtlıdır.

### 4.1 Global Navigasyon Yapısı
- **Birincil Gezinme (Header):**
  1. `Çözümler` (Disiplin ve eklenti odaklı MegaMenü — 21 kayıt)
  2. `Ürünler` (ALLPLAN paketleri, Bina/Altyapı, İnşaat Planlaması, Ortak Çözümler, İşbirliği — 18 kayıt)
  3. `Kaynaklar` (Eğitim, Video Kütüphanesi, SSS, Bilgi Merkezi ve Belge İndirmeleri)
  4. `Referanslar` (`/references`)
  5. `Hakkımızda` (`/about`)
  6. `İletişim` (`/contact`)
- **Yardımcı Erişim ve Araçlar (Header):**
  - `Arama` (`Cmd/Ctrl+K` modal + `/search`)
  - `Tema Seçici` (Açık / Antrasit Koyu)
  - *Karar Notu:* `Teklif İste` ve `Ücretsiz Deneme` butonları ana sayfa hero alanında yer aldığı için Header'da tekrar edilmez ([user-decisions.md](00-inventory/user-decisions.md#L126-L128)).

### 4.2 Kavramsal Varlık ve Sayfa Görev Ayrımı ([page-responsibilities.md](page-responsibilities.md))
- **Kalıcı Ürün Sayfaları (`/products/allplan`, `/products/allplan-aec`, `/products/civil`, `/products/precast`, `/products/ax3000`, `/products/sds2-home`):** Ürünün temel yeteneklerini ve disiplin değerini anlatır; her yıl URL değiştirmez.
- **Paket (Edition) Sayfaları (`/products/allplan-basic`, `concept`, `professional`, `ultimate`):** Paket kapsamını, lisans modelini ve karşılaştırma bağlantısını sunar.
- **İşlev Karşılaştırma ve Belge Sayfaları (`/package-overview`, `/paket-karsilastirma`):** Fiyat içermeyen kapsam karşılaştırmasını ve resmi PDF kataloglarını (`/docs/V2026_paket-karsilastirme-Q3-2026_R01.pdf`) sunar.
- **Yıllık Sürüm Sayfaları (`/products/allplan-2026`, `/products/allplan-2026-yenilikler`):** İlgili sürüm yılının yeniliklerini anlatır; kalıcı ürün sayfasının yerine geçmez.

---

## 5. İçerik Koruma ve Geçiş Stratejisi (İçerik Eşleme ve 301/308 Haritası)

### 5.1 İçerik ve Varlık Koruma Kuralları
1. **Tam Metin Koruma:** `docs/00-inventory/source-content-texts.json` ve `page-content.md` içindeki tüm metinler, başlıklar ve kurumsal sayılar (`29+`, `500+`, `50+`, `10K+`) kısaltılmadan ve özetlenmeden taşınır.
2. **Fark Kaydı İlkesi ([content-change-examples.md](content-change-examples.md)):** Zorunlu etiket/hedef düzeltmeleri (ör. `"Eğitim Takvimi"` → `"Eğitimleri İncele"` veya `14/30 gün` yerine doğrudan `https://www.allplan.com/trial-or-subscription/`) yalnız kayıtlı fark tablosuyla uygulanır.
3. **Medya ve Doküman Paritesi:** 6 PDF (`/docs/V2026_paket-karsilastirme-Q3-2026_R01.pdf`, `/docs/ifc_aktarim_el_kitabi_ifc_4.0_ifc_4.3_2026.pdf`, `/docs/Declaration_Allplan_2021-06-01.pdf` ve AX3000 PDF'leri), 2 AX3000 DOCX dosyası ve 503 görsel aynı kamusal erişilebilirlikle korunur.

### 5.2 Mevcut Yönlendirme (308/301) ve Ertelenen 404 Haritası ([url-map.csv](00-inventory/url-map.csv), [url-closure-2026-10-22.md](00-inventory/url-closure-2026-10-22.md))

| Kaynak Yol | Mevcut Durum | Yeni Sitedeki Davranış / Karar |
| :--- | :--- | :--- |
| `/solutions/PlanliAlanlar` | 308 → `/solutions/imar-yonetmeligi-bim-eklentisi` (200) | Kalıcı yönlendirme (301/308) olarak aynen korunur. |
| `/solutions/imar-yonetmliği-bim-eklentisi` | Rewrite/308 → `/solutions/imar-yonetmeligi-bim-eklentisi` (200) | Kalıcı yönlendirme olarak aynen korunur. |
| `/solutions/addons/drive-curvev` | 308 → `/solutions/addons/drive-curve` (200) | Kalıcı yönlendirme olarak aynen korunur. |
| `/solutions/extra-modules` | 308 → `/solutions/addons` (200) | Kalıcı yönlendirme olarak aynen korunur. |
| `/solutions/industry` | 308 → `/solutions/steel` (200) | Kalıcı yönlendirme korunur; iç linkler doğrudan `/solutions/steel` hedefine güncellenir. |
| **11 Benzersiz 404 Yolu** (`/solutions-v2`, `/try-free`, `/allplan-2026nin-ozellikleri`, `/allplan-2021-features`, `/solutions/bimplus`, `/products/tim`, `/products/sds2-detail`, `/products/sds2-load`, `/products/bimplus-signup`, `/products/partner-solutions`, `/solutions/addon-channel`) | Canlıda HTTP 404 (`url-closure-2026-10-22.md`) | Kullanıcı kararıyla onarımı Faz 6 uygulama/geçiş aşamasına ertelendi; yayın öncesi her satır için "içerik oluştur / 301 ile uygun hedefe bağla / sitemap'ten çıkar" kararı uygulanacaktır. |

---

## 6. Tasarım İlkeleri ve Design System Gereksinimleri

Detaylı kurallar [BRAND-GUIDELINES.md](BRAND-GUIDELINES.md), [design-system-component-mapping.md](design-system-component-mapping.md) ve [design-system-homepage-preview-review.md](design-system-homepage-preview-review.md) belgelerine dayanır.

1. **Üç Katmanlı Token Mimarisi (`Primitive → Semantic → Component`):**
   - Bileşen dosyalarında sabit renk (`#hex`, `rgb`, `hsl`), sabit yazı tipi veya sabit piksel yuvarlama yazılması yasaktır.
   - Yalnızca semantik token seti değiştirilerek tüm site (Açık / Antrasit Koyu veya alternatif tema) içerik ve bileşen koduna dokunulmadan yeniden temalanabilir olmalıdır.
2. **Renk ve Tema Sistemi (Onaylı Antrasit Koyu & Açık Tema):**
   - **Antrasit Koyu Yüzeyler:** Ana zemin, header ve kart yüzeylerinde derin antrasit/mürekkep tonları, `1px` ince teknik sınır çizgileri ve yüksek kontrastlı metin hiyerarşisi.
   - **Aksan ve Anlamsal Renkler:** Birincil vurgu/aksan (`accent`), ikincil bağlantı (`Blueprint`), durum renkleri (`Success`, `Warning`, `Error` — renk tek başına anlam taşımaz, ikon + metinle desteklenir).
   - **Marka Ayrışması:** ALLPLAN / Nemetschek kurumsal kimliği taklit edilmez; üretici logoları ve `"A NEMETSCHEK COMPANY"` ibaresi değiştirilmeden, yalnızca ilgili ürün/ortaklık bağlamında kullanılır.
3. **Keskin Kart Dili ve Yoğunluk Normalizasyonu (Kabul Edilen Karar — 22.10.2026):**
   - Yüzey ve kart köşeleri keskindir: **`radius.surface = 0px`** (ürün, çözüm, hizmet, rol ve medya panelleri `0px` köşe + `1px` sınır kullanır).
   - Form kontrolleri ve butonlar `4px`, durum/kategori rozetleri (`Badge`) pill anatomisinde kalır.
   - İç boşluk (padding) yoğunluğu semantik tokenlardan üretilir: **16 px** (kompakt / mobil dar görünüm), **24 px** (standart kart), **32 px** (büyük panel). Aynı satırdaki kartlar eşit yüksekliğe bağlanır.
4. **Tipografi (Self-Hosted WOFF2, Türkçe `latin-ext` Zorunlu):**
   - **Başlıklar (`--font-head`):** `Manrope` (600 / 700 / 800)
   - **Gövde (`--font-body`):** `IBM Plex Sans` (400 / 500 / 600) — gövde metni asla `16px` altına inmez.
   - **Teknik Meta / Kod / Sürüm (`--font-mono`):** `IBM Plex Mono` (400 / 500)
   - `html[lang="tr"]` ile Türkçe `İ/I/i/ı` büyük-küçük harf dönüşümü doğrulanır.
5. **Grid, Kırılımlar ve Hareket (Motion):**
   - **Grid:** 12 sütun, maksimum içerik genişliği `1200–1280 px`, `4px` tabanlı boşluk skalası.
   - **Kırılımlar:** `480px`, `768px`, `1024px`, `1280px`, `1536px` (390 CSS px mobil referans görünümde yatay taşma `0`).
   - **Hareket:** `150–300 ms`, `cubic-bezier(0.2, 0, 0, 1)`. `prefers-reduced-motion: reduce` durumunda tüm dekoratif animasyonlar ve arka plan video otomatik oynatması durdurulur.

---

## 7. Sayfa ve Bileşen Bazlı Fonksiyonel Gereksinimler

### 7.1 Ana Sayfa Blokları (`H01–H08` — [homepage-block-plan.md](homepage-block-plan.md))
- **`H01` Hero:** `/videos/hero-bim.mp4` + `/images/hero-poster.jpg`, 14 teknik etiket (düzenli teknik şerit olarak, okunurluğu bozmadan), H1 başlığı, birincil CTA **`Teklif İste`** ve ikincil CTA **`Ücretsiz Deneme`** (`https://www.allplan.com/trial-or-subscription/`).
- **`H02` Hızlı Erişimler:** 5 mevcut hızlı bağlantı (`/products/allplan-2026-yenilikler`, `/products/allplan-2026`, `/solutions/allplan-bulut-hizmetleri`, `/products/allplan-cloud-services`, `/solutions-v2/training/video-library`).
- **`H03` Rol ve Ürün Seçimi:** `MİMAR`, `MÜHENDİS`, `PREKAST` rol seçici; seçilen role göre açıklama ve `"Bu Akışı Detaylı İncele"` hedefi değişirken **6 ürün paketi kartının tamamı erişilebilir kalır** (filtrelenip gizlenmez).
- **`H04` Çözüm Alanları:** 5 disiplin kartı (`Bina Tasarımı`, `Altyapı Tasarımı`, `İnşaat Planlaması`, `Eklentiler`, `Diğer Çözümlerimiz`) ve mevcut görselleri/hedefleri.
- **`H05` Paket Karşılaştırmasına Erişim:** 6 paket tanıtımı ve resmi karşılaştırma PDF'ine (`/docs/V2026_paket-karsilastirme-Q3-2026_R01.pdf`) + HTML karşılaştırma görünümüne erişim (fiyat gösterimi yoktur).
- **`H06` Profesyonel Hizmetler:** `Hizmetler` (6), `Allplan Connect` (4) ve `Bilgi Merkezi` (10) altındaki **20 kaydın tamamı**; Eğitim (`/solutions-v2/training`) ve Teknik Destek (`Teams` + `allplan.net.tr`) sekme arkasına gizlenmeden doğrudan görünür.
- **`H07` BIMFlex Ortaklık Alanı:** FlexSoft × Aluplan satış ortaklığı duyurusu, 4 teknik görsel ve `/solutions/bimflex` hedefi.
- **`H08` Sürüm Yenilikleri:** ALLPLAN 2026 yenilik kartları (AI Görselleştirme, Donatıdan Şantiyeye, Birleşik Arazi Modeli).

### 7.2 12 Sayfa Şablonu Ailesi (`T01–T12` — [page-template-requirements.md](page-template-requirements.md))
- `T01` Ana Sayfa, `T02` Katalog (`/products`, `/solutions`), `T03` Çözüm/İş Akışı (`WorkflowTabsTemplate` — klavye ve mobil uyumlu), `T04` Kalıcı Ürün Ayrıntısı, `T05` Paket Ayrıntısı (`Basic`..`Ultimate`), `T06` İşlev Karşılaştırması (`/package-overview`), `T07` Yıllık Sürüm/Yenilik, `T08` Belge/Kaynak İndirme (`/paket-karsilastirma`, `/products/ax3000/dokumanlar`), `T09` Eğitim Ana Sayfası (`/solutions-v2/training`), `T10` Video Kütüphanesi ve Oynatma Listeleri (14 playlist, 216 video), `T11` Kullanıcı İşlemi / Yardım (`FAQ`, `Connect`, `ActivationWizard`), `T12` Kurumsal / Referans / İletişim / Yasal (`/about`, `/references`, `/contact`, `/kvkk`, `/gizlilik-politikasi`, `/kullanim-sartlari`).

### 7.3 Talep ve Dönüşüm Formları ([request-forms-contract.md](request-forms-contract.md))
- Mevcut Microsoft Forms (`https://forms.office.com/r/hXhnKAG912`) içindeki 14 bölüm / 24 soruluk ürün ve eklenti kapsamı kayıpsız korunarak Next.js içinde niyete özel kısa form akışlarıyla sunulur:
  1. **Teklif & Ürün/Eklenti Talebi** (Çoklu ürün/modül seçimi, mevcut müşteri eklenti temini ve öğrenci lisansı alt yolları dahil),
  2. **Ücretsiz Deneme** (`https://www.allplan.com/trial-or-subscription/` doğrudan bağlantısı + isteğe bağlı yerel kurulum/danışmanlık talebi),
  3. **Özel Eğitim Talebi** (`Eğitim` bağlamından gelen talepler).
- **Kabul Kuralı:** Hiçbir form sahte başarı döndüremez (`IA-04` yasağı); sunucu tarafı doğrulama ve gerçek teslimat/kayıt onayı olmadan başarı ekranı gösterilmez.

---

## 8. Fonksiyonel Olmayan Gereksinimler (NFR)

1. **Performans Bütçesi:**
   - **LCP:** < 2,5 saniye
   - **INP:** < 200 milisaniye
   - **CLS:** < 0,1
   - **TTFB:** < 200 milisaniye (statik/SSG sayfalar için)
   - **Lighthouse Skorları:** Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 95, SEO = 100.
   - **Font Bütçesi:** Maksimum 6 yerel WOFF2 dosyası, toplam < 90 KB.
2. **Erişilebilirlik (WCAG 2.2 Level AA):**
   - Normal metin kontrastı ≥ 4.5:1, büyük metin ve etkileşimli sınır kontrastı ≥ 3:1.
   - Minimum dokunma alanı **44×44 CSS px**.
   - Tüm etkileşimli öğelerde görünür odak halkası (`2px`), tam klavye navigasyonu (`Tab`, `Arrow`, `Enter`, `Escape`), doğru ARIA nitelikleri ve `prefers-reduced-motion` desteği.
   - Metin kopyalamayı ve sağ tıkı engelleyen `CopyProtection` bileşeni **kullanılmayacaktır**.
3. **Teknik SEO ve GEO:**
   - %100 self-referencing canonical ve doğru `og:url`.
   - Her sayfada tekil `<title>`, tekil `<meta name="description">` ve tam olarak **1 adet `<h1>`**.
   - Yalnızca HTTP 200 dönen kamusal rotaları içeren otomatik doğrulamalı `sitemap.xml`.
   - Standart `/llms.txt` dosyası ve `@id` tabanlı, görünür içerikle %100 uyumlu JSON-LD (`Organization`, `WebSite`, `BreadcrumbList`, `SoftwareApplication`/`Product`, `Service`, `VideoObject`).
4. **Güvenlik ve KVKK/GDPR Uyumluluğu:**
   - Tek merkezli katı CSP (`'unsafe-eval'` kapalı), `HSTS`, `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy`.
   - API rotalarında `zod` şema doğrulaması, HTML sanitizasyonu/escape, `rejectUnauthorized: true` ile güvenli SMTP TLS, CSRF/Origin kontrolü ve IP bazlı rate limiting.
   - Google Analytics / Tag Manager ve üçüncü taraf çerezlerinin yalnızca açık kullanıcı rızasıyla (`cookie-consent === "accepted"`) yüklenmesi; footer'da `"Çerez Tercihleri"` kontrolü.
5. **Tarayıcı ve Cihaz Desteği:**
   - Son 2 ana sürüm: Chrome, Safari (macOS & iOS), Firefox, Edge.
   - 360px / 390px mobil ekranlardan 1920px+ masaüstü ekranlara kadar sıfır yatay taşma.

---

## 9. Önerilen Teknoloji Yığını ve Gerekçesi (Karşılaştırmalı)

### 9.1 Seçilen Yığın (Kullanıcı Kararıyla Onaylı Yön: Next.js)
- **Framework:** **Next.js (App Router, güncel kararlı LTS — ör. 15.x / 16.x)** + **React 19** + **TypeScript (strict mode)**. *(Kesin sürüm Faz 6 başında kilitlenecektir.)*
- **Render Stratejisi:** **SSG / Statik Öncelikli (Static-First Server Components)** + yalnızca etkileşimli adacıklarda (MegaMenü, Rol/Sekme geçişi, Arama modalı, Formlar, Video/Görsel Lightbox) minimal Client Components.
- **Stil ve Token Katmanı:** Build-time JSON → CSS Custom Properties (`tokens.css`) üretim zinciri + Tailwind CSS / CSS Modules (yalnız semantik token değişkenlerini tüketen yapı).
- **Form Doğrulama ve Güvenlik:** `zod` + Server Actions / Route Handlers + Rate Limiter.
- **Test Araçları:** Node `unittest` / Vitest (birim ve token/veri sözleşmesi testleri) + Playwright (E2E, erişilebilirlik, responsive ve URL parite testleri).

### 9.2 Alternatiflerle Karşılaştırma

| Kriter | **Next.js (App Router — SSG Öncelikli)** *(Seçilen)* | Astro (Statik + Adacık Mimarisi) | Mevcut Yapı (Next.js 14 `"use client"` Ağırlıklı) |
| :--- | :--- | :--- | :--- |
| **Mevcut Kaynak ve Ekip Uyumu** | **Çok Yüksek:** Mevcut 103 rota, şablonlar ve Docker/Coolify dağıtım yapısı doğrudan uyumlu. | Orta: Tüm JSX bileşenlerinin ve dinamik arama/form akışlarının `.astro` yapısına yeniden yazılması gerekir. | Yüksek ancak teknik borçlu (`ignoreDuringBuilds`, canonical/metadata mirası hatası). |
| **SEO / GEO / İlk HTML** | **Çok Yüksek:** Server Components + `generateMetadata` ile %100 doğru canonical, title ve JSON-LD üretimi. | Çok Yüksek: Sıfır varsayılan JS ile hızlı statik HTML. | Düşük: 58 sayfada `"use client"` yüzünden kopya title ve 92 sayfada yanlış canonical. |
| **Dinamik Form ve API İhtiyacı** | **Çok Yüksek:** Kısa teklif/eğitim/aktivasyon API'leri aynı repo ve tip güvenliği içinde çalışır. | Orta: Sunucu uç noktaları için ek SSR adaptörü gerektirir. | Orta: Mevcut API'lerde güvenlik ve simülasyon sorunları var. |
| **Bakım ve Uzun Vadeli Sürdürülebilirlik** | **Çok Yüksek:** Tip güvenli içerik kayıtları + semantik token zinciriyle yıllık güncelleme kolaylığı. | Yüksek | Düşük |

---

## 10. DevOps Planı

1. **Repo Yapısı ve Katman İzolasyonu (`aluplan-2027/`):**
   ```text
   aluplan-2027/
     docs/                  # Envanter, UX, Baseline, PRD, Strateji ve Kanıt Belgeleri
     design-system/         # Faz 4 Semantik Tokenlar (tokens.json -> tokens.css), Bileşenler ve Stil Rehberi
     src/
       content/             # Tip güvenli ürün, paket, sürüm, hizmet, video ve sayfa kayıtları
       components/          # Semantik token tüketen Server/Client UI bileşenleri
       app/                 # Next.js App Router rotaları, generateMetadata ve JSON-LD adaptörleri
       lib/                 # Doğrulama (Zod), güvenlik, SEO/schema ve yardımcı modüller
     scripts/               # URL parite, token build/check ve SEO/kontrast doğrulama araçları
     tests/                 # Birim, sözleşme, erişilebilirlik ve E2E testleri
   ```
2. **Branch Stratejisi:**
   - `main`: Her zaman derlenebilir, tüm otomatik kapılardan geçmiş kararlı dal.
   - Faz ve özellik dalları (`feat/phase-4-design-system`, `feat/phase-5-homepage`, `feat/phase-6-migration`) üzerinden atomik commitlerle ilerleme.
3. **CI/CD Hattı (Kalite Kapıları — Quality Gates):**
   Her commit ve PR'da sırasıyla şu kontroller zorunludur (`ignoreDuringBuilds` kesinlikle yasaktır):
   1. `tokens:check` (Token JSON → CSS senkronizasyonu ve sabit renk/font yasağı kontrolü)
   2. `contrast:check` (Tüm tema × mod çiftlerinde WCAG 2.2 AA kontrast doğrulaması)
   3. `typecheck` (`tsc --noEmit`) ve `lint` (ESLint)
   4. `test:unit` (Veri sözleşmesi, SEO/canonical ve URL parite birim testleri)
   5. `build` (Next.js üretim derlemesi — tüm statik rotaların hatasız üretimi)
   6. `test:e2e` & `lighthouse-ci` (Kritik rotalarda erişilebilirlik, kırık link, 390px taşma ve CWV kontrolü)
4. **Ortamlar, Dağıtım (Docker / Coolify) ve Önbellek:**
   - **Ortamlar:** `local` (geliştirme), `staging` (önizleme ve parite kabul ortamı), `production` (`aluplan.com.tr`).
   - **Container:** Çok aşamalı (multi-stage), deterministik (`pnpm install --frozen-lockfile` veya `npm ci`), `non-root` kullanıcılı Node 20/22 Alpine `standalone` Docker imajı.
   - **CDN & Önbellek:** `/_next/static/*` ve hashli medya varlıkları için `Cache-Control: public, max-age=31536000, immutable`; statik HTML/belgeler için `stale-while-revalidate`.
5. **İzleme, Yedekleme ve Geri Alma (Rollback) Planı:**
   - **Healthcheck:** `/api/health` (veya `/health` — `robots.txt` ve `sitemap.xml` dışında tutularak) üzerinden container sağlık kontrolü.
   - **Geri Alma (Rollback):** Geçiş anında mevcut `aluplan-2026` container imajı ve DNS/reverse-proxy yapılandırması sıcak yedekte tutulur; kritik bir üretim hatasında Coolify/proxy üzerinden **< 2 dakika** içinde önceki kararlı imaja geri dönülür.

---

## 11. Test Stratejisi

1. **İçerik ve URL Parite Testi (`scripts/url_parity.py` + `tests/test_url_parity.py`):**
   - `docs/00-inventory/url-map.csv` içindeki tüm korunacak URL'lerin, 308/301 yönlendirmelerinin, PDF/DOCX dosyalarının ve CTA hedeflerinin yeni uygulamada birebir karşılandığını otomatik doğrular.
2. **SEO ve Schema Sözleşme Testi:**
   - Her kamusal sayfada: (a) `canonical === kendi URL'si`, (b) `og:url === kendi URL'si`, (c) tekil `<title>` ve `description`, (d) tam olarak 1 adet `<h1>`, (e) geçerli JSON-LD (`@id` çakışması ve 404 hedef olmadan) bulunduğunu build çıktısı üzerinde otomatik test eder.
3. **Erişilebilirlik (WCAG 2.2 AA) ve Kontrast Testi:**
   - Tüm semantik token çiftleri için otomatik kontrast hesaplaması.
   - Playwright + `@axe-core/playwright` ile klavye gezinmesi (`MegaMenu`, `Tabs`, `Dialog`, `Details`), odak görünürlüğü, form hata mesajları ve `prefers-reduced-motion` doğrulaması.
4. **Görsel Regresyon ve Cross-Browser / Responsive Testi:**
   - Masaüstü (`1440×900`), Tablet (`768×1024`) ve Mobil (`390×844`) görünümlerde hem Açık hem Antrasit Koyu temada yatay taşma (`scrollWidth <= clientWidth`) ve ekran görüntüsü karşılaştırması.
5. **Güvenlik Testi:**
   - Yanıt başlıklarının (`CSP`, `HSTS`, `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`) doğrulanması.
   - Form uç noktalarında XSS/HTML payload, geçersiz şema ve rate-limit sınır testleri.

---

## 12. Yayına Geçiş (Cutover) Planı ve SEO Kaybını Önleme Kontrol Listesi

### 12.1 Yayına Geçiş (Cutover) Adımları
1. **Staging Dağıtımı ve Parite Denetimi:** Yeni uygulamanın staging ortamına kurulması ve `url_parity.py` ile tüm 131 yolun, 6 PDF'in, 2 DOCX'in ve 503 görselin doğrulanması.
2. **SEO & Schema Ön Kabulü:** Staging üzerinde tüm sayfaların `<title>`, `description`, `canonical`, `og:url`, `sitemap.xml`, `robots.txt` ve `/llms.txt` çıktılarının otomatik script ile %100 geçer not alması.
3. **Form ve Destek Kanalı Doğrulaması:** Teklif/Eğitim/Aktivasyon formlarının yetkili test alıcısına gerçek teslimatının, `https://www.allplan.com/trial-or-subscription/` deneme linkinin, `Teams` ve `https://allplan.net.tr` destek bağlantılarının doğrulanması.
4. **Canlı Geçiş (Zero-Downtime Switch):** Sıcak yedek (`aluplan-2026` container) korunarak yeni container'ın devreye alınması.
5. **Geçiş Sonrası İlk 24–72 Saat İzleme:** Canlı HTTP durum kodları, 301/308 yönlendirmeleri, Google Search Console `sitemap.xml` gönderimi, URL Inspection ve sunucu hata loglarının izlenmesi.

### 12.2 SEO Kaybını Önleme Kontrol Listesi (Pre-Launch SEO Checklist)
- [ ] Kök `layout.tsx` içinde alt sayfaları ezen sabit `canonical: '/'` yok; tüm alt sayfalar kendi URL'sine canonical veriyor.
- [ ] Hiçbir kamusal sayfada `"Aluplan - Premium Mühendislik Çözümleri"` kopya varsayılan başlığı kalmadı.
- [ ] `sitemap.xml` içinde 404 dönen URL veya `/health`, `/hero-3d`, `/test-webgl` yok; tüm aktif ürün, çözüm, eğitim ve kurumsal sayfalar mevcut.
- [ ] Mevcut 4 sağlam 308 yönlendirmesi ve ertelenen 11 adet 404 için onaylanan yönlendirme/içerik kararları aktif.
- [ ] `BreadcrumbList` JSON-LD içinde 404 dönen `/solutions-v2` düğümü yok.
- [ ] Sayfa içi H1–H6 hiyerarşisi ve Türkçe metin içerikleri korunmuş durumda.

---

## 13. Fazlar, Çıktılar, Kabul Kriterleri, Riskler ve Açık Sorular

### 13.1 Fazlar ve Kabul Kriterleri

| Faz | Temel Çıktı | Kabul Kriteri | Durum |
| :--- | :--- | :--- | :--- |
| **Faz 0 — Envanter** | `docs/00-inventory/*`, `url-map.csv` | Sayfa, URL, medya, PDF/DOCX ve form dallarının eksiksiz envanteri | **Tamamlandı (25.10.2026)** |
| **Faz 1 — UI/UX Analizi** | `docs/ux-audit.md` | IA, dönüşüm, görsel hiyerarşi, mobil, WCAG 2.2 AA ve persona analizi | **Tamamlandı (25.10.2026)** |
| **Faz 2 — Teknik Baseline** | `docs/baseline-report.md` | Performans, SEO, GEO, güvenlik ve KVKK "önce" ölçümleri | **Tamamlandı (25.10.2026)** |
| **Faz 3 — PRD Dokümanı** | `docs/PRD.md` | 13 bölümlü kapsamlı ürün, mimari, DevOps ve geçiş spesifikasyonu | **Onay Bekliyor** |
| **Faz 4 — Design System** | `design-system/` | Semantik tokenlar (`tokens.json`/`tokens.css`), temel bileşenler (tüm durumlarıyla), kontrast doğrulaması ve canlı stil rehberi | Başlanmadı |
| **Faz 5 — Ana Sayfa Tasarımı** | Ana sayfa (`H01–H08`) tasarım & önizleme | Tüm mevcut ana sayfa içeriğini ve linklerini koruyan masaüstü/tablet/mobil ana sayfa tasarımının kullanıcı onayı | Başlanmadı *(Ön çalışmalar `anthracite-demo` ve `architectural-sheet-concept` içinde hazırlandı)* |
| **Faz 6 — Geliştirme & Geçiş** | `src/`, testler ve son karşılaştırma raporu | Tüm sayfaların geliştirilmesi, SEO/GEO/güvenlik/performans iyileştirmeleri, %100 parite testi ve "Önce/Sonra" raporu | Başlanmadı |

### 13.2 Riskler ve Azaltma (Mitigation) Planı
1. **R1 — Üretici (ALLPLAN / Nemetschek) Marka ve Varlık İzin Riski:**
   - *Azaltma:* Aluplan bağımsız çözüm ortağı/distribütör kimliğiyle sunulur; ALLPLAN logoları değiştirilmez; dosya bazlı kaynak/izin kaydı tutulur ve footer'da tescilli marka notu yer alır ([BRAND-GUIDELINES.md](BRAND-GUIDELINES.md#L16-L27)).
2. **R2 — Paket Karşılaştırma Belgelerindeki Tarihsel Farklar (Q4 2025 vs. Q3 2026 PDF):**
   - *Azaltma:* `SCIA Engineer`, `BIM²form` ve `TIM` önkoşulu gibi belge revizyon farkları veri modelinde `SourceRevision` ile izlenir; ticari teyit olmadan hiçbir hak silinmez veya uydurulmaz ([package-comparison-decisions.md](package-comparison-decisions.md)).
3. **R3 — Harici Medya / İframe Erişim Hataları (`addon.aluplan.com.tr` DNS hatası, `1623090584242` webinar ID):**
   - *Azaltma:* Yerel yedek (fallback) görsel/durum bileşeni kullanılır ve ertelenen onarım listesinde (`url-closure-2026-10-22.md`) yayın öncesi kapatılır.

### 13.3 Açık Sorular ve Karar Durumu Özeti

| # | Konu | Durum / Karar |
| :--- | :--- | :--- |
| **1** | **Ücretsiz Deneme Süresi (14/30 Gün) ve Hedefi** | **KAPATILDI (25.10.2026):** Yeni sitede tüm deneme CTA'ları gün vaadi olmadan doğrudan `https://www.allplan.com/trial-or-subscription/` adresine yönlendirilecek. |
| **2** | **Header CTA Yerleşimi** | **KAPATILDI (22.10.2026):** Header gezinme odaklı tutulacak; `Teklif İste` ve `Ücretsiz Deneme` ana sayfa hero alanında yer alacak. |
| **3** | **Form Platformu Seçimi** | **KAPATILDI (22.10.2026):** Next.js içinde niyete özel kısa formlar (14 bölümlü kapsamı koruyarak) kullanılacak. Gerçek e-posta/webhook teslimat alıcısı Faz 6'da bağlanacak. |
| **4** | **Eğitim ve Destek Konumlandırması** | **KAPATILDI (21–22.10.2026):** Tek `Eğitim` başlığı (dönemsel webinar + YouTube arşivi + özel eğitim talebi) ve iki kanallı `Teknik Destek` (`Teams` + `allplan.net.tr`). |
| **5** | **Görsel Tasarım Yönü (Faz 4 & Faz 5 Girişi)** | **AÇIK (Faz 4/5 başında netleşecek):** Keskin hatlı (`radius: 0px`) Antrasit tasarım sistemi önizlemesi (`anthracite-demo`) ile duraklatılan `architectural-sheet-concept` arasındaki görsel tercih ve açık tema/slogan detayları. |
| **6** | **11 Adet 404 Rotanın Satır Bazlı Onarım Kararı** | **ERTELİ (Faz 6 öncesi):** `docs/00-inventory/url-closure-2026-10-22.md` içindeki 11 rotanın hangilerinin yeniden oluşturulacağı veya 301 ile yönlendirileceği. |
| **7** | **Paket Kapsamında TR Ticari Doğrulaması** | **AÇIK (İçerik verisi):** Q3 2026 PDF ile eski web metinleri arasındaki `SCIA` / `BIM²form` farklarının Aluplan yetkililerince teyidi (metinler o zamana kadar kayıpsız korunur). |
