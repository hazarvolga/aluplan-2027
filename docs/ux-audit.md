# FAZ 1 — UI/UX Analizi Raporu (`ux-audit.md`)

**Tarih:** 25.10.2026  
**Kapsam:** Salt-okunur kaynak (`../aluplan-2026`), canlı site (`https://aluplan.com.tr`) ve Faz 0 envanter/etkileşim kanıtları (`docs/00-inventory/`).  
**Durum:** Onay bekliyor (Faz 1 çıktısı).  
**Kural Notu:** Bu rapordaki tüm bulgu ve öneriler kanıt temellidir. Mevcut içerikleri, sayıları (`29+`, `500+`, `50+`, `10K+`), URL yapısını, buton hedeflerini ve dosyaları silme veya kısaltma izni değildir; onaylı yeni tasarımda bilginin nasıl sunulacağını, erişilebilirlik ve dönüşüm engellerinin nasıl giderileceğini tanımlar.

---

## 1. Bilgi Mimarisi, Navigasyon, Kullanıcı Akışları ve Dönüşüm Yolları

### Güçlü Yönler
- **Disiplin ve Rol Odaklı Keşif:** Ana sayfadaki `PathwayProductSystem` (`components/homepage-v2/PathwayProductSystem.tsx:27-77`) ziyaretçiyi doğrudan **MİMAR / MÜHENDİS / PREKAST** rollerine göre karşılayıp 6 temel ürün paketini (`Basic`, `Concept`, `Professional`, `Ultimate`, `Civil`, `Precast`) silmeden vurgular.
- **Zengin Eko-Sistem Kapsamı:** `ServicesV2` (`components/homepage-v2/ServicesV2.tsx`) altında 3 sekmede (`Hizmetler`, `Allplan Connect`, `Bilgi Merkezi`) toplam **20 operasyonel ve bilgi kaynağı** (Teams uzaktan destek, ticket sistemi `allplan.net.tr`, sertifika `aluplan.info`, IFC el kitabı PDF, lisans yönetimi vb.) tek merkezde toplanmıştır.
- **Hızlı Arama (`Cmd/Ctrl+K`):** `CommandMenu` (`components/search/CommandMenu.tsx:21-63`) ve `/search` sayfası Türkçe karakter normalizasyonu ile ürün, çözüm ve içerik araması sunar.

### Sorunlar ve Kanıtlar

| ID | Bulgu / Sorun | Kanıt (Dosya Yolu / URL) | Öncelik |
| :--- | :--- | :--- | :--- |
| **IA-01** | **Ürün, Paket ve Yıllık Sürüm Kavramlarının Karışması:** Navigasyon ve sayfa ağacında kalıcı ürün (`/products/allplan`), ticari paketler (`/products/allplan-basic`..`ultimate`), disiplin çözümleri (`/products/allplan-aec`, `/solutions/bridge-design`) ve yıllık sürüm sayfaları (`/products/allplan-2026`, `/products/allplan-2026-yenilikler`) aynı düzlemde sunuluyor. Ziyaretçi hangi paketin hangi yılda neyi kapsadığını ayırt etmekte zorlanıyor. | `components/layout/Header.tsx:35-79`, `docs/allplan-content-mapping.md`, `docs/page-responsibilities.md` | **Yüksek** |
| **IA-02** | **Eğitim ve Teknik Destek Girişlerinin "Kaynaklar" Anchor'ı Arkasında Gizlenmesi:** Üst menüde `Kaynaklar` öğesi `/#professional-services` anchor'ına kaydırır (`Header.tsx:83-119, 130`). Ana sayfa dışındaki bir alt sayfada (`pathname !== "/"`) kullanıcıya doğrudan Eğitim veya Destek menüsü sunmak yerine ana sayfa ortasına yönlendirme yapılır; `Allplan Connect` ve `Bilgi Merkezi` ise varsayılan kapalı sekmelerdedir. | `components/layout/Header.tsx:87-118`, `components/homepage-v2/ServicesV2.tsx` | **Yüksek** |
| **IA-03** | **Çok Adımlı Harici Satış Formu Sürtünmesi ve Yanlış Form Hedefleri:** Birincil satış CTA'sı 14 bölüm ve 24 sorudan oluşan harici Microsoft Forms'a (`https://forms.office.com/r/hXhnKAG912`) gider. Ayrıca `PythonPart` ve `Scalypso` sayfalarındaki başvuru butonları hatalı olarak `CDS Add-On` formuna (`https://forms.office.com/r/XLQm9JPTSR`) yönlenir; ana formda ise Scalypso seçimi Bölüm 8 yerine Bölüm 13'e atlar. | `docs/00-inventory/form-admin-2026-10-22.md`, `app/solutions/pythonpart/ClientPage.tsx:172`, `app/solutions/scalypso/ClientPage.tsx:238` | **Yüksek** |
| **IA-04** | **Sahte Başarı Döndüren Yerel Modallar (Simülasyon Riski):** Eğitim sayfalarındaki `ContactModal` (`components/layout-v2/ContactModal.tsx:28-40`) ve `LicenseManagerModal` (`components/layout-v2/LicenseManagerModal.tsx:46-48`) yanında `/api/contact` (`app/api/contact/route.ts:3-9`) gerçek bir veri kaydı veya e-posta gönderimi yapmadan `setTimeout` sonrası kullanıcıya "başarıyla gönderildi" mesajı gösterir. Ziyaretçi talebinin Aluplan'a ulaştığını sanır. | `docs/00-inventory/source-findings.md:12-14`, `components/layout-v2/ContactModal.tsx:28-40` | **Yüksek** |
| **IA-05** | **CTA Etiketi ve Hedef Uyumsuzlukları:** (1) Ana sayfadaki `InnovationsTeaser` bileşeninde "Tüm Yenilikleri İncele" butonu `/products/allplan-2026-yenilikler` yerine genel `/products` kataloğuna gider. (2) `TechSpecsTable` içindeki 6 paket kartı ürün detayına değil, aynı PDF dosyasına (`/docs/V2026_paket-karsilastirme-Q3-2026_R01.pdf`) gider. (3) Eğitim sayfasındaki "Webinar Takvimine Göz At" / "Etkinlik Takvimi" butonları takvim yerine bilgi talep modalı açar. | `docs/homepage-block-plan.md:19-22`, `docs/00-inventory/inventory-coverage-2026-10-22.md:26` | **Orta** |
| **IA-06** | **Kırık (404) ve Boş (`#`) Hedefler:** Sitemap ve sayfa içi bağlantılarda `/solutions-v2` (breadcrumb üst yolu, 33 referans), `/try-free`, `/allplan-2026nin-ozellikleri` dahil 11 benzersiz 404 rota; video kütüphanesinde `#` hedefine giden 4 YouTube kanal kartı ve `#interface` eksik fragment hedefi mevcuttur. | `docs/00-inventory/url-closure-2026-10-22.md`, `docs/00-inventory/inventory-coverage-2026-10-22.md:25` | **Orta** *(Onarımı uygulama aşamasına ertelendi)* |
| **IA-07** | **Ücretsiz Deneme Süresi Çelişkisi (14 Gün vs. 30 Gün):** Canlı CTA'larda 14 gün gözlenirken `/contact` (`app/contact/ClientPage.tsx:55`) ve `/products/allplan` kaynaklarında 30 gün ifadesi yer alır. | `app/contact/ClientPage.tsx:55`, `docs/00-inventory/inventory-coverage-2026-10-22.md:130` | **Kapatıldı (25.10.2026)** |

### Öneriler ve Alınan Kararlar
1. **Header CTA Sadeleştirmesi ve Doğrudan Deneme Hedefi (Kabul Edildi):** Header gezinme odaklı tutulacak; ana sayfa hero alanında birincil **`Teklif İste`** ve ikincil **`Ücretsiz Deneme`** (`https://www.allplan.com/trial-or-subscription/` doğrudan bağlantısı, gün sayısı vaadi olmadan) yer alacak ([user-decisions.md](./00-inventory/user-decisions.md#L126-L135)).
2. **Niyete Özel Next.js Kısa Formları (Kabul Edildi):** 14 bölümlü tek form karmaşası yerine ürün/eklenti kapsamını kaybetmeyen, niyete özel kısa Next.js girişleri (Teklif, Deneme Yardımı, Eğitim + Öğrenci/Mevcut Müşteri alt yolları) kullanılacak; simülasyon modalları kaldırılıp yalnızca gerçek kayıt oluştuğunda başarı gösterilecek ([request-forms-contract.md](./request-forms-contract.md)).
3. **Görünür Eğitim ve Destek Erişimi:** Üst yardımcı menüde ve ana sayfada sekme arkasına gizlenmeden Eğitim ve Teknik Destek (Teams + `allplan.net.tr` ticket) doğrudan erişilebilir olacak ([site-information-architecture.md](./site-information-architecture.md)).

---

## 2. Görsel Hiyerarşi, Tipografi, Renk, Boşluk, Tutarlılık ve Marka Algısı

### Güçlü Yönler
- **Mühendislik ve Teknik Atmosfer:** Koyu zemin (`--background: 0 0% 2%` / `#0a0e27`), teknik ızgara (`bg-technical-grid`) ve monospace etiketler (`IBM Plex Mono`) AEC/BIM yazılım dünyasına uygun ciddi bir teknik zemin oluşturuyor.
- **Açık / Koyu Tema Desteği:** `ThemeProvider` ve CSS değişkenleri (`styles/globals.css:18-90`) ile iki modlu altyapı mevcut.

### Sorunlar ve Kanıtlar

| ID | Bulgu / Sorun | Kanıt (Dosya Yolu / URL) | Öncelik |
| :--- | :--- | :--- | :--- |
| **VH-01** | **Aluplan ile ALLPLAN Kurumsal Kimliklerinin Ayrışmaması:** Sayfa başlıkları (`ALLPLAN Türkiye`), hero etiketi (`/ ALLPLAN 2026`) ve ürün odaklı anlatım, Aluplan'ı bağımsız bir uzman çözüm ortağı/distribütör yerine doğrudan üreticinin kendi sitesi gibi konumlandırıyor. | `app/(public)/page.tsx:11-16`, `components/homepage-v2/HeroV2.tsx:113`, `docs/BRAND-GUIDELINES.md:5-27` | **Yüksek** |
| **VH-02** | **Hero Alanında Görsel Gürültü ve Hareket Yükü:** `HeroV2` (`HeroV2.tsx:6-21, 78-101`) arka plan videosunun üzerine 3 katmanlı kaplama ve sürekli yanıp sönen **14 adet rastgele boyutlu İngilizce kelime parçacığı** (`CLOUD NATIVE`, `OPENBIM text-9xl`, `DATA_NODE` vb.) bindiriyor. Ayrıca `h1` başlığı `mix-blend-screen` ve `text-[6.5vw] leading-[0.9]` kullandığı için okunabilirlik ve odak dağılıyor. | `components/homepage-v2/HeroV2.tsx:6-21, 79-100, 117` | **Yüksek** |
| **VH-03** | **Bileşenlerde Sabit (Hardcoded) Renk ve Yuvarlama Tutarsızlıkları:** Global tokenlar tanımlı olmasına rağmen bileşenlerde `#3B82F6` (`MegaMenu.tsx:39`), `#151515`, `#DC0026` (`CopyProtection.tsx:73, 86`), `rounded-sm`, `rounded-lg`, `rounded-full` gibi birbirinden kopuk değerler doğrudan yazılmış. | `components/layout/MegaMenu.tsx:39`, `styles/globals.css:12-16`, `docs/00-inventory/existing-design-tokens.md` | **Orta** |
| **VH-04** | **Harici Google Fonts CSS Import ve Geniş Ağırlık Yükü:** `styles/globals.css:1` üzerinden Inter (100–900), Space Grotesk (300–700) ve IBM Plex Mono (400–600) üçüncü taraf Google Fonts CDN'inden çekiliyor. Bu durum hem ilk yükleme (LCP/CLS) hem de KVKK/gizlilik açısından dezavantaj yaratıyor. | `docs/00-inventory/existing-design-tokens.md:8`, `docs/brand/current-identity.md:13` | **Orta** |

### Öneriler
1. **Semantik Design Token ve Keskin Kart Dili (`radius: 0px`):** Kullanıcı tarafından önizlemede kabul edilen **Antrasit koyu tema**, `radius.surface = 0` keskin ve ince çizgili (`1px`) kart dili ve normalize edilmiş boşluk sistemi (`16px` kompakt / `24px` standart / `32px` büyük panel) tüm bileşenlere semantik token katmanı üzerinden uygulanmalı; bileşen içinde sabit hex veya keyfi radius kullanılmamalı ([HANDOFF.md](file://./HANDOFF.md#L264-L268)).
2. **Self-Hosted Tipografi:** Türkçe (`latin-ext`) tam destekli, yerel (`woff2`) barındırılan `Manrope` (başlık), `IBM Plex Sans` (gövde) ve `IBM Plex Mono` (teknik etiket/meta) eşleşmesi ile üçüncü taraf font bağımlılığı kaldırılmalı ([BRAND-GUIDELINES.md](./BRAND-GUIDELINES.md#L72-L83)).
3. **Hero Odaklanması:** Arka plan videosu ve 14 teknik etiket içeriği korunurken, okunurluğu bozan rastgele ekran üstü yüzen kelime animasyonları yerine düzenli teknik etiket/meta şeridi ve net H1 + çift CTA (`Teklif İste` / `Ücretsiz Deneme`) hiyerarşisi kurulmalı.

---

## 3. Mobil Öncelikli (Mobile-First) Deneyim, Responsive Kırılımlar ve Dokunma Hedefleri

### Güçlü Yönler
- **Tek Kaynaklı Mobil Menü:** Masaüstü ve mobil navigasyon aynı `productsMenu` ve `solutionsMenu` veri yapısını okur (`Header.tsx:269-360`); mobilde içerik kaybı yaşanmaz.
- **Responsive Grid Yapıları:** Tailwind kırılımları (`sm`, `md`, `lg`, `xl`) genel sayfa iskeletinde mevcuttur.

### Sorunlar ve Kanıtlar

| ID | Bulgu / Sorun | Kanıt (Dosya Yolu / URL) | Öncelik |
| :--- | :--- | :--- | :--- |
| **MB-01** | **44×44 px Altında Kalan Dokunma Hedefleri (Touch Targets):** Üst bardaki 5 sosyal medya ikonu `h-7 w-7` (**28×28 px**, `Header.tsx:168`) boyutundadır ve aralarında yalnızca `space-x-2` (8 px) vardır. Mobil menü açma butonu `p-2` + `h-6 w-6` (**40×40 px**, `Header.tsx:261-263`) ile WCAG 2.2 AA / mobil ergonomik 44×44 px hedefinin altındadır. | `components/layout/Header.tsx:168, 261-263` | **Yüksek** |
| **MB-02** | **576 px (`sm`) Altında Kaybolan Birincil Dönüşüm Butonları:** Header içindeki `Ücretsiz Deneme` ve `Teklif Talep Formu` butonları `hidden sm:inline-flex` (`Header.tsx:244, 250`) sınıfına sahip olduğu için 640 px altındaki telefon ekranlarında üst çubuktan tamamen kaybolur; kullanıcı yalnız hamburger menüyü açarsa alt kısımda görebilir. | `components/layout/Header.tsx:244-254` | **Orta** *(Yeni kararla CTA'lar zaten hero'ya taşındı)* |
| **MB-03** | **Çok Sekmeli ve Uzun İçerik Panellerinde Dikey Kaydırma Yükü:** Mimari (23 panel), Precast (15 panel), Precast Detail (15 panel), Strüktürel (15 panel) ve Altyapı (15 panel) sayfalarında (`WorkflowTabsTemplate`) mobilde kategori ve alt öğe geçişleri uzun dikey kaydırma gerektiriyor. | `docs/00-inventory/inventory-coverage-2026-10-22.md:8`, `components/templates/WorkflowTabsTemplate.tsx` | **Orta** |
| **MB-04** | **Paket Karşılaştırma Bilgisinin Mobilde Yalnız PDF'e Bağımlı Olması:** Ana sayfadaki `TechSpecsTable` ve `/paket-karsilastirma` mobilde okunabilir bir HTML karşılaştırma tablosu sunmak yerine tek sayfalık geniş tablolu PDF'i (`/docs/V2026_paket-karsilastirme-Q3-2026_R01.pdf`) indirmeye zorluyor. | `docs/homepage-block-plan.md:19`, `docs/package-comparison-decisions.md` | **Orta** |

### Öneriler
1. Tüm etkileşimli buton, ikon ve menü tetikleyicilerinde minimum **44×44 px** dokunma alanı zorunlu tutulmalı.
2. Mobil görünümlerde (390 px referans kırılımı dahil) yatay taşma (`overflow-x: 0`) otomatik test kapısına bağlanmalı; çok panelli ürün/çözüm sayfalarında mobilde yapışkan kategori seçici veya akordeon düzeni kullanılmalı.
3. PDF indirme bağlantıları korunurken, paket karşılaştırması mobilde başlık-hücre ilişkisini koruyan HTML görünümüyle desteklenmeli.

---

## 4. Erişilebilirlik (WCAG 2.2 AA)

### Güçlü Yönler
- **Temel Semantik Elemanlar:** `SkipLink` (`app/layout.tsx`), mobil menüde `aria-label="Menüyü aç" / "Menüyü kapat"` (`Header.tsx:259`), arama butonunda `aria-label="Arama"` (`Header.tsx:237`) ve görsellerin büyük kısmında `alt` metinleri mevcuttur.

### Sorunlar ve Kanıtlar

| ID | Bulgu / Sorun | Kanıt (Dosya Yolu / URL) | Öncelik |
| :--- | :--- | :--- | :--- |
| **A11Y-01** | **Global `CopyProtection` Bileşeninin Klavye ve Yardımcı Teknolojileri Engellemesi:** `app/layout.tsx:127` üzerinden tüm sayfalara yüklenen `CopyProtection.tsx` (`:49-63`), sağ tıklamayı (`contextmenu`), metin kopyalamayı (`copy`, `Ctrl/Cmd+C`) ve `F12` / `Ctrl+Shift+I` kısayollarını engeller. Teknik bir B2B sitede kullanıcıların ürün adını, sistem gereksinimini, telefon numarasını veya e-posta adresini kopyalamasını engellemek ciddi bir kullanılabilirlik ve erişilebilirlik ihlalidir. | `components/sections/CopyProtection.tsx:49-63`, `app/layout.tsx:127` | **Yüksek** |
| **A11Y-02** | **Masaüstü MegaMenülerin Yalnızca Fare (`onMouseEnter`) ile Açılması:** `Header.tsx:194, 206-213` içinde `Çözümler` ve `Ürünler` butonları `<button>` olmasına rağmen `onClick`, `onKeyDown`, `aria-expanded` veya `aria-controls` içermez; açılma yalnızca kapsayıcı `div` üzerindeki `onMouseEnter` ve kapanma `header` üzerindeki `onMouseLeave` ile çalışır. Klavye (`Tab` / `Enter` / `Space` / `Escape`) kullanıcıları masaüstünde alt menülere erişemez. | `components/layout/Header.tsx:136-152, 194-215` | **Yüksek** |
| **A11Y-03** | **Video Tetikleyicisinin `<div onClick>` Olması ve İsimsiz Kapatma Butonu:** `VideoModal.tsx:25-28` video açma tetikleyicisini `tabIndex`, `role="button"` veya klavye dinleyicisi olmayan bir `<div onClick={() => setIsOpen(true)}>` olarak render eder. Ayrıca modal içindeki kapatma `<button>` öğesinde (`VideoModal.tsx:44-49`) yalnızca `<X />` ikonu vardır; `aria-label="Videoyu kapat"` bulunmaz. | `components/specialized-ui/VideoModal.tsx:25-28, 44-49` | **Yüksek** |
| **A11Y-04** | **`prefers-reduced-motion` Desteğinin Eksikliği:** `HeroV2.tsx` içindeki otomatik oynatılan arka plan videosu (`:40-57`), sürekli dönen 14 Framer Motion parçacığı (`:80-100`) ve `Header.tsx:97-113` içindeki 1500 ms'lik özel `requestAnimationFrame` kaydırma döngüsü kullanıcının işletim sistemi hareket azaltma (`prefers-reduced-motion: reduce`) tercihini kontrol etmez. | `components/homepage-v2/HeroV2.tsx:40-100`, `components/layout/Header.tsx:97-113` | **Yüksek** |
| **A11Y-05** | **Altyazı (`<track>`) Kaynağının Boş Olması ve Yabancı Dil Etiketleri:** `HeroV2.tsx:56` içinde `<track kind="captions" srcLang="tr" label="Türkçe" />` etiketi `src` niteliği olmadan bırakılmıştır. `ThemeToggle` bileşeninin erişilebilir etiketi Türkçe sayfada İngilizce (`Toggle theme`) olarak kalmıştır. | `components/homepage-v2/HeroV2.tsx:56`, `docs/00-inventory/global-state-source-review-2026-10-22.md:31` | **Orta** |

### Öneriler
1. `CopyProtection` bileşeni yeni sitede aktif kullanıcı deneyimine taşınmamalı; kullanıcılar teknik metinleri, iletişim bilgilerini ve kod/sürüm adlarını serbestçe kopyalayabilmeli.
2. MegaMenü, Sekmeler (`Tabs`), Akordeonlar ve Video/Görsel Modalları klavye ile tam erişilebilir (`Enter`/`Space` ile açma, `Escape` ile kapatma, `aria-expanded`, `aria-controls`, odak tuzağı ve görünür `2px` odak halkası) olarak inşa edilmeli.
3. `prefers-reduced-motion: reduce` etkin olduğunda arka plan videosu durdurulmalı (veya poster gösterilmeli) ve tüm dekoratif animasyonlar kapatılmalı.
4. Tüm renk token çiftleri otomatik WCAG 2.2 AA kontrast testinden (normal metin ≥ 4.5:1, büyük metin ve etkileşimli sınırlar ≥ 3:1) geçirilmeli.

---

## 5. İçerik Okunabilirliği, Mikro-Metinler ve Durum Yönetimi (Hata / Boş / Yükleme)

### Güçlü Yönler
- **Arama Boş Durumu ve Yönlendirmesi:** `CommandMenu` içinde arama sonucu olmadığında `"Sonuç bulunamadı."` mesajı ve `"{inputValue}" için tüm sonuçlarda ara →` eylemi net biçimde sunulur (`global-state-source-review-2026-10-22.md:126`).
- **Zengin Teknik Açıklamalar:** Ürün ve çözüm sayfalarında disiplin bazlı özellik açıklamaları, görsel galerileri ve Türkçe teknik dokümanlar (IFC El Kitabı, AX3000 DOCX/PDF rehberleri) kapsamlıdır.

### Sorunlar ve Kanıtlar

| ID | Bulgu / Sorun | Kanıt (Dosya Yolu / URL) | Öncelik |
| :--- | :--- | :--- | :--- |
| **CR-01** | **Eğitim Alanında "Sürekli Kurs Takvimi" Yanılsaması:** Hizmet kartında ve eğitim sayfasında `"Eğitim Takvimi"` / `"Webinar Takvimine Göz At"` mikro-metinleri kullanılmasına rağmen gerçekte düzenli bir kurs takvimi yoktur; eğitim hizmeti dönemsel webinarlar, YouTube geçmiş webinar arşivi ve özel eğitim talebinden oluşmaktadır. | `docs/00-inventory/user-decisions.md:93`, `docs/content-change-examples.md` | **Yüksek** |
| **CR-02** | **Doğrulanmamış Mutlak Vaatler ve Güncellik Farkları:** `PathwayProductSystem.tsx:41, 50` içinde `"Hatasız projeler"`, `"sıfır hata"`; `ServicesV2.tsx` içinde `"kesintisiz"`, `"Uluslararası geçerliliği olan"` ve Deklarasyon Formu açıklamasında `"ALLPLAN 2023 ve ALLPLAN 2024 versiyonları için geçerlidir"` gibi mutlak veya eski sürümde kalmış ifadeler mevcuttur. Ayrıca `Tüm Gereksinimler` kartı `2025.html` URL'sine gider. | `docs/00-inventory/global-state-source-review-2026-10-22.md:100-106, 115-118` | **Orta** |
| **CR-03** | **Bozuk Medya ve Video Yedek (Fallback) Durumları:** (1) Webinar sayfasındaki tek `"Hemen İzle"` butonu gerçek bir YouTube ID'si yerine `1623090584242` placeholder iframe hedefine gidiyor. (2) Lisans atama rehberindeki (`/solutions-v2/connect-license/how-to-assign`) `addon.aluplan.com.tr` kaynaklı görsel DNS çözümleme hatası veriyor ve kırık görsel durumu üretiyor. | `docs/00-inventory/inventory-coverage-2026-10-22.md:29-30` | **Orta** |
| **CR-04** | **Çerez Bildiriminin Geri Alınamaz ve İşlevsiz Olması:** `CookieConsent.tsx:12-29` 1,5 saniye sonra açılır; `Kabul Et` ve `Reddet` yalnız `localStorage` yazar ancak `app/layout.tsx:102-114` içindeki Google Analytics ve sayfalardaki YouTube/Google Maps iframe'leri bu tercihi okumadan koşulsuz yüklenir. Ayrıca kullanıcı tercihini sonradan değiştirebileceği bir footer bağlantısı yoktur. | `docs/00-inventory/source-findings.md:23-27`, `components/layout/CookieConsent.tsx:12-29` | **Yüksek** |

### Öneriler
1. Mevcut metinler koruma kuralı gereği silinmez; ancak `"Eğitim Takvimi"` gibi yanlış beklenti yaratan CTA etiketleri için fark kaydıyla (`docs/content-change-examples.md`) `"Eğitimleri İncele"` / `"Webinar Arşivi ve Eğitim Talebi"` netleştirmesi uygulanmalı.
2. Formlarda, video oynatıcılarda ve harici görsellerde gerçek **yükleniyor (loading)**, **doğrulama hatası (alan altı ikonlu mesaj)** ve **erişilemeyen medya yedek (fallback)** durumları tasarlanmalı.

---

## 6. Persona ve Temel Kullanıcı Hedefleri

Aşağıdaki personalar doğrudan mevcut site içeriğinden (`app/about/ClientPage.tsx:52-54`, `PathwayProductSystem.tsx:27-77`, `ServicesV2.tsx`, `form-admin-2026-10-22.md`) çıkarılmıştır. İçerikte doğrudan kanıtı olmayan ticari ağırlık noktaları **[Varsayım / Açık Karar]** olarak işaretlenmiştir.

| Persona | Kaynak Kanıtı | Temel Hedefleri (Jobs-to-be-Done) | Mevcut Sürtünme Noktası | Yeni Tasarım Çözümü |
| :--- | :--- | :--- | :--- | :--- |
| **P1 — Mimar / Tasarım Ofisi Karar Vericisi** | `PathwayProductSystem.tsx` (MİMAR), `/solutions/architecture`, `/products/allplan-concept` | Parametrik modelleme, görselleştirme, IFC/OpenBIM uyumu ve ofis ölçeğine uygun paketi (`Basic` / `Concept` / `Professional`) hızlıca karşılaştırıp teklif veya deneme almak. | Paket farkları yalnız PDF'te; 14 bölümlü form uzun; deneme süresinde 14/30 gün çelişkisi vardı. | Rol seçimiyle vurgulanan paketler, HTML+PDF kapsam karşılaştırması, doğrudan `trial-or-subscription` deneme linki ve kısa teklif formu. |
| **P2 — İnşaat / Yapı / Altyapı Mühendisi** | `PathwayProductSystem.tsx` (MÜHENDİS), `/solutions/structural`, `/solutions/bridge-design`, `/products/civil`, `BIMFlex`, `AX3000` | Donatı detaylandırma, köprü/yol/altyapı modelleme, metraj (OSKA/Poz Kataloğu), yapı fiziği/MEP (AX3000) ve deprem/donatı eklentilerini (`BIMFlex`) incelemek. | Ürünler ile eklentiler (`Add-On`) ve iş akışı sayfaları menüde iç içe; PythonPart/Scalypso yanlış CDS formuna gidiyor. | Kalıcı ürün, paket ve eklenti ayrımı; çoklu modül seçimine izin veren doğru teklif akışı. |
| **P3 — Prekast / Çelik Üretim ve Planlama Yöneticisi** | `PathwayProductSystem.tsx` (PREKAST), `/products/precast`, `/products/precast-detail`, `TIM`, `SDS2` | Fabrika/CAM veri çıktısı, prekast detaylandırma, iş/yük planlaması (`TIM`, `SDS2`) ve kurumsal BIM geçiş danışmanlığı için doğrudan uzmanla görüşmek. | `TIM` ve bazı `SDS2` linkleri haber vermeden İngilizce dış siteye (`allplan.com`) atıyor; `/products/tim` ve `/products/sds2-detail` yetim/404 durumunda. | Dış üretici bağlantılarında açık dış link ikonu/belirteci; yerel özet ve doğrudan danışmanlık/teklif girişi. |
| **P4 — Mevcut Lisanslı Kullanıcı / BIM Yöneticisi** | `ServicesV2.tsx` (`Allplan Connect`, `Bilgi Merkezi`), `/solutions-v2/connect-license`, `FAQ` | Teams üzerinden canlı destek almak, `allplan.net.tr` üzerinden ticket açmak, lisans atamak/aktarmak (`CodeMeter`), sürüm yeniliklerini ve sistem gereksinimlerini kontrol etmek, webinar videolarını izlemek. | Destek ve lisans araçları ana sayfa ortasındaki sekmelerin içinde gizli; eğitim modalları simülasyon yapıyor. | Header yardımcı alanında ve hizmet bloğunda doğrudan `Teknik Destek (Teams / Ticket)` ve `Video Kütüphanesi` erişimi. |
| **P5 — Öğrenci / Akademisyen ve Kamu/Belediye Ekibi** | `app/about/ClientPage.tsx:54`, `form-admin-2026-10-22.md` (Öğrenci lisansı dalı), `/solutions/imar-yonetmeligi-bim-eklentisi` | Öğrenci lisansı/eğitim materyallerine ulaşmak; belediye/kamu için İmar Yönetmeliği BIM eklentisi ve IFC standartlarını (`IFC Export El Kitabı`) incelemek. | Öğrenci lisansı talebi genel satış formunun alt dallarında gizli; eğitim sayfasındaki bireysel/kurumsal ayrımı kafa karıştırıcı. | Tek `Eğitim` çatısı altında formsuz video arşivi ve talep formunda açık `Öğrenci / Akademik` alt yolu. |

> **[Varsayım / Açık Karar Notu]:** P1, P2 ve P3 segmentlerinin Aluplan cirosu içindeki ticari öncelik sırası ve satın alma karar vericilerinin unvan dağılımı kaynak koddan çıkarılamaz; Faz 3 PRD açık sorularında Aluplan yönetiminin teyidine tabidir.

---

## 7. Ekran ve Şablon Bazlı Bulgular Özeti

1. **Global Kabuk (`Header`, `MegaMenu`, `Footer`, `CookieConsent`, `CopyProtection`):**
   - *Sorunlar:* Klavye ile açılamayan MegaMenü (`A11Y-02`), 28×28 px sosyal ikonlar (`MB-01`), kopyalama engelleyici `CopyProtection` (`A11Y-01`), işlevsiz çerez tercihi (`CR-04`).
   - *Çözüm:* Gezinme odaklı sade Header, klavye/ARIA uyumlu MegaMenü, minimum 44×44 px dokunma alanları, `CopyProtection` kaldırılması, gerçek rıza yönetimli çerez katmanı ve korunan footer bilgileri (3 telefon, adres, sosyal linkler, yasal sayfalar ve `"Design & Develop by Hazar Volga Ekiz"` kredisi).
2. **Ana Sayfa (`/` — 8 Blok: `H01`..`H08`):**
   - *Sorunlar:* Hero'da 14 hareketli kelime parçacığı (`VH-02`), `InnovationsTeaser` butonunun `/products`'a gitmesi (`IA-05`), `TechSpecsTable` kartlarının yalnız PDF indirmesi (`MB-04`), 20 hizmetin sekme arkasında kalması (`IA-02`).
   - *Çözüm:* [homepage-block-plan.md](./homepage-block-plan.md) içindeki `H01–H08` blok sırası, Hero'da `Teklif İste` + doğrudan `Ücretsiz Deneme` (`https://www.allplan.com/trial-or-subscription/`), 6 ürün kartını koruyan rol seçici ve görünür Profesyonel Hizmetler yapısı.
3. **Ürün ve Paket Detay Sayfaları (`/products/*`):**
   - *Sorunlar:* Kalıcı ürün ile yıllık sürüm (`2026`) ve paket (`Basic`..`Ultimate`) sınırlarının belirsizliği (`IA-01`), `/products/allplan` içinde 30 gün deneme ifadesi (`IA-07`), `VideoModal` klavye/etiket eksikliği (`A11Y-03`).
   - *Çözüm:* [page-template-requirements.md](./page-template-requirements.md) içindeki `T04` (Kalıcı Ürün), `T05` (Paket), `T06` (İşlev Karşılaştırması) ve `T07` (Yıllık Sürüm) şablon ayrımı.
4. **Çözüm ve Eklenti Sayfaları (`/solutions/*`, `WorkflowTabsTemplate`, `ImageGallery`):**
   - *Sorunlar:* 15–23 panelli iş akışı sekmelerinde mobil kaydırma yükü (`MB-03`), PythonPart/Scalypso yanlış CDS form hedefi (`IA-03`).
   - *Çözüm:* Mobil uyumlu sekme/akordeon geçişi, klavye destekli `ImageGallery` lightbox ve ürün bağlamını koruyan teklif bağlantısı.
5. **Eğitim, Video Kütüphanesi ve Lisans/Yardım Sayfaları (`/solutions-v2/*`):**
   - *Sorunlar:* `/solutions-v2` kök yolunun 404 dönmesi (`IA-06`), `ContactModal` sahte başarı simülasyonu (`IA-04`), `#` hedefli 4 YouTube kartı, `1623090584242` bozuk webinar videosu ve DNS hatalı lisans görseli (`CR-03`).
   - *Çözüm:* Tek **Eğitim** başlığı altında formsuz izlenebilen video/webinar arşivi (`T09`, `T10`), gerçek teslimatlı eğitim talep formu ve adım adım lisans/yardım şablonu (`T11`).
6. **Kurumsal, Referanslar ve İletişim (`/about`, `/references`, `/contact`):**
   - *Sorunlar:* `/about` sayfasının canlı canonical etiketinin `/` ana sayfaya işaret etmesi (Faz 2'de teknik olarak ele alınacak), `/contact` sayfasında 30 gün deneme metni ve `aluplan.net.tr` eski destek adresi (`source-findings.md:19`).
   - *Çözüm:* Doğrulanmış destek adresi (`allplan.net.tr`), doğrudan `trial-or-subscription` deneme bağlantısı ve tüm kurumsal metriklerin (`29+`, `500+`, `50+`, `10K+`) eksiksiz korunması (`T12`).

---

## 8. Önceliklendirilmiş UX İyileştirme Matrisi (Özet)

| Öncelik | Kapsam | Eylem Özeti |
| :--- | :--- | :--- |
| **Yüksek** | Dönüşüm & Formlar | Sahte başarı döndüren simülasyon modallarını kaldırmak (`IA-04`); Teklif için Next.js kısa form sözleşmesini, Ücretsiz Deneme için doğrudan `https://www.allplan.com/trial-or-subscription/` hedefini uygulamak (`IA-03`, `IA-07`). |
| **Yüksek** | Erişilebilirlik (WCAG 2.2 AA) | `CopyProtection` engelini kaldırmak (`A11Y-01`); MegaMenü ve `VideoModal` klavye/ARIA desteğini sağlamak (`A11Y-02`, `A11Y-03`); `prefers-reduced-motion` ve 44×44 px dokunma hedeflerini uygulamak (`A11Y-04`, `MB-01`). |
| **Yüksek** | Bilgi Mimarisi & Marka | Aluplan distribütör/çözüm ortağı kimliğini netleştirmek (`VH-01`); kalıcı ürün, paket ve yıllık sürüm katmanlarını ayırmak (`IA-01`); Eğitim ve Destek erişimini görünür kılmak (`IA-02`, `CR-01`). |
| **Orta** | Görsel Sistem & Mobil | Keskin hatlı (`radius: 0px`) antrasit token sistemini ve yerel WOFF2 fontları (`Manrope`, `IBM Plex Sans`, `IBM Plex Mono`) uygulamak (`VH-02`..`VH-04`); çok sekmeli sayfaları ve paket karşılaştırmasını mobilde optimize etmek (`MB-03`, `MB-04`). |
| **Orta / Erteli** | Bozuk Hedefler & Medya | Ertelenen 11 adet 404 rotayı (`/solutions-v2` dahil), `#` hedefli video kartlarını, bozuk webinar iframe'ini ve DNS hatalı görseli uygulama/geçiş fazında onarmak (`IA-05`, `IA-06`, `CR-03`). |
