# Faz 5 — Ana Sayfa Tasarımı ve 3 Tasarım Yönü Karşılaştırması

- **Tarih:** 25.10.2026
- **Durum:** Onay Bekliyor (Faz 5 Teslimatı)
- **Tasarım Sistemi Kaynağı:** [design-system/](../design-system/README.md) (`tokens/tokens.json`, `styles.css`, `_ds_bundle.js`)
- **Ana Sayfa Prototip Çıktısı:** [design-system/ui_kits/homepage/index.html](../design-system/ui_kits/homepage/index.html) ([HomepagePreview.jsx](../design-system/ui_kits/homepage/HomepagePreview.jsx), [preview.css](../design-system/ui_kits/homepage/preview.css), [homepage-data.js](../design-system/data/homepage-data.js))
- **İlgili Belgeler:** [docs/PRD.md](PRD.md), [docs/homepage-block-plan.md](homepage-block-plan.md), [docs/design-system-homepage-preview-review.md](design-system-homepage-preview-review.md)

---

## 1. Üç Farklı Ana Sayfa Tasarım Yönünün Karşılaştırması

`docs/MASTER-PROMPT.md` Faz 5 kuralları uyarınca, mevcut içeriklerin tamamını koruyarak çalışılan **3 farklı ana sayfa tasarım yönü** aşağıda karşılaştırılmıştır:

| Kriter | Yön 1 — Keskin Hatlı Antrasit Mühendislik Sistemi *(Önerilen & Seçilen Yön)* | Yön 2 — Yapısal İndeks / Kompakt Wireframe Düzeni | Yön 3 — Mimari Pafta / Teknik Çizim Konsepti |
|---|---|---|---|
| **Prototip Konumu** | [design-system/ui_kits/homepage/index.html](../design-system/ui_kits/homepage/index.html) | [docs/previews/homepage-wireframe/index.html](previews/homepage-wireframe/index.html) | [architectural-sheet-concept/](../architectural-sheet-concept/README.md) |
| **Görsel Karakter & Yüzey Dili** | **Antrasit Koyu & Açık Mod** (`#181A1B` sayfa, `#202324` kart, `#272A2C` yükseltilmiş panel), **keskin `0px` kart köşeleri (`radius.surface = 0px`)**, `1px` teknik sınır çizgileri (`#414749`) ve **Alu Teal** (`#2DD4BF` / `#0F766E`) vurgu. | Düz koyu indeks ızgarası, numara etiketli (`01 / GİRİŞ`..`08 / SÜRÜM`) sade kutular, minimum görsel hiyerarşi. | Mimari pafta kodları (`A-000`..`A-801`), kesit/aks çizgileri, antet kutusu ve turuncu (`Orange 500/800`) vurgu. |
| **Tipografi & Yoğunluk** | `Manrope` (Başlık) + `IBM Plex Sans` (Gövde) + `IBM Plex Mono` (Teknik etiket). Semantik iç boşluk: **16 px** (kompakt özellik), **24 px** (standart kart), **32 px** (büyük rol/hero/BIMFlex paneli). | Tek tip sistem/mono ağırlıklı yoğun liste görünümü; hızlı tarama sağlar ancak kurumsal ürün derinliği sınırlıdır. | `Manrope` + `IBM Plex Mono`; çizim/antet metaforu içerik okunabilirliğinin önüne geçebilmektedir. |
| **Bileşen & Token Sözleşmesi** | Faz 4'te onaylanan `design-system/` bileşenlerini (`SiteHeader`, `CtaGroup`, `RoleSelector`, `ProductCard`, `ResourceCard`, `SupportCard`, `Card`, `Badge`, `SiteFooter`) **%100 semantik tokenlarla** tüketir. | Ham HTML/JS önizlemesidir; tasarım sistemi bileşen kütüphanesini doğrudan kullanmaz. | Ayrı `sheet` tema varyantı ve özel SVG çizim bileşenleri gerektirir; kullanıcı değerlendirmesinde görsel olarak duraklatılmıştır. |
| **Erişilebilirlik & Kontrast** | **188/188 kontrast çifti WCAG 2.2 AA uyumlu (0 hata)**, klavye odak halkası (`--focus-ring`), tek `<h1>`, semantik `<details>` gruplama, **Koyu (`dark`) ve Açık (`light`) mod** geçişi. | Temel HTML erişilebilirliği var; tam tasarım sistemi durum/odak katmanı yok. | Kontrast testleri geçerli ancak görsel karmaşıklık ve yüksek framework JS yükü (`179 KB` gzip) mevcut. |
| **Karar & Durum** | **ÖNERİLEN VE SEÇİLEN ANA YÖN** — Kullanıcının *"Antrasit tasarım sistemi üzerinden ilerle"* ve keskin `0px` kart dili kararlarıyla tam uyumludur. | Yerleşim ve içerik sırası doğrulaması için referans katmanı olarak tamamlandı. | Kullanıcı geri bildirimiyle (*"görsel olarak içine sinmediği"* için) duraklatıldı; arşivde korunur. |

---

## 2. Seçilen Ana Sayfa Tasarımının (`Yön 1`) Blok ve İçerik Eşlemesi (`H01–H08` + Global Kabuk)

Ana sayfa tasarımı, `aluplan-2026` kaynağındaki aktif 8 gövde bileşeninin ve global Header/Footer kabuğunun **bütün metinlerini, URL hedeflerini, medya referanslarını ve 20 profesyonel hizmet kaydını** eksiksiz korur:

### Global Üst Kabuk (`PreviewHeader` / `SiteHeader`)
- **Logo:** `aluplan-logo-white-filled.svg` (`--surface-brand` üzerinde garantili kontrast).
- **Ana Gezinme (7 Öğe):** `Çözümler` (`#solutions`), `Ürünler` (`#products`), `Kaynaklar` (`#services`), `Referanslar` (`/references`), `Hakkımızda` (`/about`), `İletişim` (`/contact`), `Eğitim ve Destek` (`#services`).
- **Sadeleştirilmiş Header Kararı:** Kullanıcının onayı doğrultusunda `Teklif İste` ve `Ücretsiz Deneme` butonları Hero alanında birincil odak olarak yer aldığı için Header'da tekrarlanmaz; Header gezinme odaklıdır.
- **Tema Geçişi (Dark / Light):** Üst kontrol şeridindeki düğme ile `data-mode="dark"` (Antrasit Koyu) ve `data-mode="light"` (Açık Teknik Kağıt) modları anlık olarak değiştirilebilir; içerik ve DOM yapısı değişmez.

### `H01` — Giriş ve Kimlik (`Hero`)
- **Üst Etiket (Kicker):** `/ ALLPLAN 2026 · Giriş ve kimlik` (`IBM Plex Mono`, `--accent-fg`).
- **Ana Başlık (`<h1>`):** `DAHA İYİ BİR GELECEK İNŞA ETMEK İÇİN TASARLANDI`
- **Alt Metin:** `Yenilikçi AEC iş akışları, otomasyon ve bulut tabanlı iş birliği ile daha başarılı projeler.`
- **Birincil & İkincil CTA (`CtaGroup`):**
  1. `Teklif İste` → `https://forms.office.com/r/hXhnKAG912` (Faz 6'da onaylı Next.js kısa form sözleşmesiyle `/iletisim` / ilgili niyet akışına bağlanacak; mevcut hedef korunur).
  2. `Ücretsiz Deneme` → **`https://www.allplan.com/trial-or-subscription/`** *(25.10.2026 kullanıcı kararıyla 14/30 gün çelişkisi olmadan doğrudan ALLPLAN resmî sayfasına yönlendirilir).*
- **14 Teknik Etiket:** `CLOUD NATIVE`, `BIM LEVEL 3`, `PARAMETRIC`, `AUTOMATION`, `INTEROPERABILITY`, `AX3000`, `PYTHONPARTS`, `OPENBIM`, `REAL-TIME`, `PRECAST`, `CIVIL`, `BRIDGE`, `@CONNECTION`, `DATA_NODE`.
- **Hero Medya Alanı:** `hero-bim.mp4` ve `hero-poster.jpg` için `radius: 0px`, `1px` güçlü kenarlıklı (`--border-strong`) teknik medya çerçevesi.

### `H02` — Hızlı Erişim Şeridi (`QuickLinks`)
Beş doğrudan erişim bağlantısı:
1. `Yenilikleri İncele` → `/products/allplan-2026-yenilikler`
2. `ALLPLAN 2026 İncele` → `/products/allplan-2026`
3. `ALLPLAN CLOUD VE Genel Geliştirmeler` → `/solutions/allplan-bulut-hizmetleri`
4. `ALLPLAN CLOUD Hizmetleri` → `/products/allplan-cloud-services`
5. `Eğitim Videoları` → `/solutions-v2/training/video-library`

### `H03` — Rol ve Ürün Seçimi (`RolesProducts`)
- **Rol Seçici (`RoleSelector` — 3 Rol):**
  - **MİMAR (`Özgür Tasarım`):** `/products/architecture` — *Parametrik Modelleme, Entegre Rendering, AI Görselleştirme, Konsept Tasarım* → İlgili paket vurgusu: `ALLPLAN Basic`, `ALLPLAN Concept`.
  - **MÜHENDİS (`Hassas Analiz`):** `/products/allplan-aec` — *Otomatik Donatı, FEM Analizi, Çakışma Kontrolü, Maliyet Hesabı* → İlgili paket vurgusu: `ALLPLAN Professional`, `ALLPLAN Ultimate`, `ALLPLAN Civil`.
  - **PREKAST (`Akıllı Üretim`):** `/products/precast` — *CAM Veri Çıktısı, Lojistik Planlama, Stok Yönetimi, Montaj Planları* → İlgili paket vurgusu: `ALLPLAN Ultimate`, `ALLPLAN Precast`.
- **6 Ürün Kartı (`ProductCard`):** Rol değiştiğinde hiçbir ürün kartı gizlenmez; 6 ürünün tamamı (`Basic`, `Concept`, `Professional`, `Ultimate`, `Civil`, `Precast`) her zaman görünür ve erişilebilir kalır, yalnızca seçili role uygun olanlar `--accent-border` ile vurgulanır. Satır içi kart yükseklikleri eşittir.

### `H04` — Çözüm Alanları (`SolutionsLink`)
- **Başlık:** `Tek platform. Tüm disiplinler.`
- **5 Disiplin Kartı (`Card` — `outlined`, `0px` köşe):**
  1. `BİNA TASARIMI` (*Mimari & Mühendislik*) → `/solutions-v2/building-design` (`Çözümleri İncele`)
  2. `ALTYAPI TASARIMI` (*Yol & Köprü*) → `/solutions-v2/infrastructure` (`Keşfet`)
  3. `İNŞAAT PLANLAMASI` (*Prekast & Çelik*) → `/solutions-v2/construction` (`Detaylar`)
  4. `EKLENTİLER` (*Add-ons & Tools*) → `/solutions-v2/addons` (`İncele`)
  5. `DİĞER ÇÖZÜMLERİMİZ` (*Bimplus & More*) → `/solutions-v2/other` (`Göz At`)

### `H05` — Paket Karşılaştırmasına Erişim (`Packages`)
- **Başlık:** `DETAYLI ANALİZ` / `TEKNİK ÖZELLİKLER`
- **Bölüm CTA'sı ve 6 Paket Kartı (`ResourceCard`):** `ALLPLAN Basic`, `ALLPLAN Concept`, `ALLPLAN Professional`, `ALLPLAN Ultimate`, `CIVIL`, `PRECAST` kartlarının tamamı ve üst buton mevcut `/docs/V2026_paket-karsilastirma-Q3-2026_R01.pdf` (`Karşılaştırma Tablosunu İndir (PDF)`) hedefine bağlanır. Uydurma fiyat veya doğrulanmamış lisans matrisi içermez.

### `H06` — Profesyonel Hizmetler (`Services` — 20/20 Kayıt)
- **İlk Görünümde Öne Çıkan 3 Ana Hizmet (`SupportCard`):**
  1. `Eğitim` (`Eğitim Takvimi` → `/solutions-v2/training`)
  2. `Teknik Destek` (`Destek Al` → Microsoft Teams bağlantısı)
  3. `Destek Platformu` (`Talep Oluştur` → `https://allplan.net.tr/`)
- **Görev Bazlı Açılır Gruplar (`<details>` — Kalan 17 Kayıt):**
  - *Öğren ve yardım al (2 kayıt):* `Danışmanlık` (`/contact`), `Sertifika` (`https://aluplan.info/`).
  - *Yazılım ve lisans işlemleri (5 kayıt):* `Download` (`https://connect2.allplan.com/`), `Connect: Giriş` (`/solutions-v2/connect-login`), `Admin Lisans : Lisans Yöneticisi Bilgi Formu` (`/solutions-v2/connect-license`), `CodeMeter WebDepot`, `Deklarasyon Formu` (`/solutions-v2/connect-license/activation`).
  - *Bilgi ve güncellemeler (9 kayıt):* `ALLPLAN FAQ` (`/solutions-v2/faq`), `Blog Global`, `Canlı Webinarlar`, `BIM Rehberi`, `OPENBIM`, `Sistem Gereksinimleri`, `Tüm Gereksinimler`, `Sürüm Notları`, `IFC Export El Kitabı` (`/docs/ifc_aktarim_el_kitabi_ifc_4.0_ifc_4.3_2026.pdf`).
  - *Partner erişimi (1 kayıt):* `Partner` (`https://www.allplan.com/allplan-partner-solutions/`).

### `H07` — BIMFlex Ortaklık Duyurusu (`Bimflex`)
- **Kimlik & İlişki:** `FlexSoft x Aluplan satış ortaklığı` / `FlexSoft AR-GE x Aluplan` / `FlexSoft tarafından geliştirilen çözüm`.
- **Başlık & İddia:** `Allplan için BIM uyumlu yapı elemanları donatısı` — `Donatı modellemesini saatlerden saniyelere indirin`
- **Açıklama:** Kaynaktaki *"sunulabilecektir"* ifadesi ve kapsamı aynen korunur.
- **Medya (4 Görsel):** `flexsoft-logo.png`, `kolon-model.png` (*BIMFlex kolon donatısı modeli*), `kiris-model.png` (*BIMFlex kiriş donatısı modeli*), `doseme-bosluk-model.png` (*BIMFlex döşeme boşluk donatısı modeli*).
- **Hedef:** `BIMFlex detaylarını incele` → `/solutions/bimflex`.

### `H08` — Sürüm Yenilikleri (`Innovations`)
- **Üst Bilgi:** `YENİ SÜRÜM · ALLPLAN 2026` — `ALLPLAN 2026 Yenilikleri`
- **Bölüm CTA'sı:** `Tüm Yenilikleri İncele` → `/products`
- **3 Yenilik Kartı:**
  1. `AI Görselleştirme` (`ALLPLAN CONCEPT`)
  2. `Donatıdan Şantiyeye` (`ALLPLAN PROFESSIONAL`)
  3. `Birleşik Arazi Modeli` (`ALLPLAN ULTIMATE`)

### Global Alt Kabuk (`Footer` / `SiteFooter`)
- **Kurumsal Tanım:** `1995'ten beri Türkiye'nin güvenilir Allplan distribütörü. Mimari ve mühendislik projeleriniz için profesyonel BIM çözümleri.`
- **Sütun 1 — Ürünler (6 Bağlantı):** `ALLPLAN Basic`, `ALLPLAN Concept`, `ALLPLAN Professional`, `ALLPLAN Ultimate`, `ALLPLAN Civil`, `ALLPLAN Precast`.
- **Sütun 2 — Çözümler (5 Bağlantı):** `BİNA TASARIMI`, `ALTYAPI TASARIMI`, `İNŞAAT PLANLAMASI`, `EKLENTİLER`, `DİĞER ÜRÜNLER`.
- **Sütun 3 — İletişim & Kurumsal:** Quick Tower – Workinton Ataşehir/İstanbul adresi, 3 telefon numarası (`+90 216 225 84 41`, `+90 543 211 94 42`, `+90 549 499 73 79`), `info@aluplan.com.tr`, `Referanslar`, `Hakkımızda`.
- **Sütun 4 — Yasal & Sosyal Medya:** `Gizlilik Politikası` (`/gizlilik-politikasi`), `Kullanım Şartları` (`/kullanim-sartlari`), `KVKK` (`/kvkk`), 5 sosyal medya hesabı (`Facebook`, `Twitter`, `LinkedIn`, `Instagram`, `YouTube`) ve zorunlu geliştirici kredisi: **`Design & Develop by Hazar Volga Ekiz`** (`https://hazarvolga.com.tr`).

---

## 3. Duyarlı (Responsive) Kırılımlar ve Etkileşim Kuralları

- **Masaüstü (`> 64rem / 1024px`):**
  - Hero 2 sütunlu asimetrik ızgara (`1.25fr` metin + `0.75fr` medya paneli).
  - Rol anlatısı 2 sütunlu (`1fr` açıklama + `1fr` 4'lü özellik ızgarası); altında 3x2 eşit yükseklikli ürün kartları.
  - BIMFlex 2 sütunlu (`0.9fr` içerik + `1.1fr` 3'lü asimetrik görsel kolajı).
  - Kart iç boşlukları: küçük özellik `16px`, standart kart `24px`, büyük panel `32px`.
- **Tablet (`<= 64rem / 1024px`):**
  - `SiteHeader` gezinme öğeleri erişilebilir açılır menüye (`aria-expanded`, `Escape` ile kapanma) taşınır.
  - Hero, rol anlatısı, bölüm başlıkları ve BIMFlex tek sütuna düşer; tüm içerik sırası korunur.
- **Mobil (`<= 40rem / 640px`, `390px` / `360px` dahil):**
  - Kart ve panel iç boşlukları `--space-inset-sm` (`16px`) değerine iner; yatay taşma (`horizontal overflow`) `0px`'tir.
  - BIMFlex görsel kolajı tek sütunlu `16:10` oranlı akışa geçer; bölüm eylem butonları tam genişlik (`width: 100%`) alır.
- **Hareket Azaltma (`prefers-reduced-motion: reduce`):**
  - Kaydırma ve geçiş animasyonları otomatik olarak devre dışı bırakılır.

---

## 4. Otomatik Sözleşme ve Kalite Doğrulaması

Faz 5 ana sayfa prototipi üzerinde çalıştırılan doğrulama testleri:
- `node design-system/scripts/homepage-preview-tests.mjs` → **9/9 geçti** (6 paket kaydı, PDF hedefi, BIMFlex 3 görsel/alt metni ve ortaklık metni, 3 yenilik kartı, blok sırası `Packages → Services → Bimflex → Innovations`, tanımsız CSS tokenı `0`).
- `node design-system/scripts/token-tests.mjs` → **28/28 geçti** (`contrastChecks: 188, contrastFails: 0`, CSS lint hatası `0`, medya sorgusu ve token drift `0`).
- `node design-system/scripts/content-tests.mjs` → **13/13 geçti** (referans bütünlüğü, kararlı ID'ler, tokenlarda içerik sızıntısı `0`).
