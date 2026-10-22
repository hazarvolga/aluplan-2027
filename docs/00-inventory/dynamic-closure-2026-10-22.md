# D01 — Dinamik içerik kontrolü

22.10.2026 — Canlı masaüstü tarayıcı gözlemi ve salt-okunur kaynak incelemesi. **Kısmi; tam site etkileşim paritesi değil.** Formlara veri girilmedi, gönderim yapılmadı. Kaynak, uygulama ve tema değiştirilmedi.

## Kaydedilen canlı durumlar

Tam erişilebilirlik ağacı kayıtları: [states.json](browser-closure-2026-10-22/states.json). 57 kayıt, altı sayfa; kayıt sayısı test başarı yüzdesi değildir. Her sekme/akordeon açıldıktan sonra metin ve bağlantılar kaydedildi. Bu kayıtlar birebir kaynak metni karşılaştırması, mobil görünüm veya erişilebilirlik kabulü değildir.

| Sayfa | Gözlenen durum | Kayıt |
|---|---|---:|
| `/solutions-v2/training` | İlgi Duyanlar, Video Kütüphanesi, Temel, İleri Seviye, Özel, BIM; BIM teklif modalı | 7 |
| `/solutions-v2/faq` | Genel & Abonelik 7, Cloud Hizmetleri 5, Lisans Dönüşümü 4, Workgroup & İşbirliği 3, Ürün Yaşam Döngüsü 6 yanıt | 25 |
| `/references` | Tümü ve dokuz müşteri kategorisi; her filtrelenmiş liste | 10 |
| `/solutions-v2/training/quick-start` | Mimari/Mühendislik/Altyapı/Prekast; Mimari üç, Mühendislik iki akordeon | 9 |
| `/products/civil` | Üç ürün SSS yanıtı | 3 |
| `/products/allplan-ultimate` | Üç ürün SSS yanıtı | 3 |

Eğitim ilk iki sekmesi Hızlı Başlangıç ve Video Kütüphanesi bağlantılarını; kalan dört sekme İletişim Formu eylemini sunuyor. BIM modalında görünen konu: **Eğitim Teklifi: BIM Üzerine Uzmanlık!**. Modal iptal edildi. Diğer üç teklif modalının konu varyasyonları bu turda açılmadı.

Gözlenen boş form alanları: Ad Soyad, Firma, E-posta, Telefon, Meslek / Unvan, Sektör, Konu, Mesajınız. DOM incelemesinde ad, e-posta ve mesaj zorunlu; konu salt-okunur; diğer alanlar isteğe bağlıydı. Kaynak `components/layout-v2/ContactModal.tsx:28–40` gönderimde yalnız console kaydı, bekleme ve başarı durumu içeriyor. Bu **kaynak bulgusudur**; canlı teslimat denenmedi. Satış Microsoft Forms akışıyla karıştırılmaz.

## Sayfa içi bağlantılar

[fragments.json](browser-closure-2026-10-22/fragments.json): beş bağlantı gerçekten tıklandı. Tarayıcı ham href sonundaki boşluğu normalleştiriyor. `#introduction`, `#pro-tips`, `#modules`, `#features-2026` için DOM hedefi var; **`#interface` yok**. Dört bağlantı için hedef varlığı doğrulandı; piksel bazında kaydırma/odak kabulü yapılmadı. Eksik hedefi hangi içerikle eşleyeceğimiz kullanıcı kararına sunulmalı.

## Kalan kaynak temelli kontrol matrisi

Aşağıdaki kaynak yolları `../aluplan-2026/` içindedir. Kaynakta etkileşim bulunması canlıda doğrulandığı anlamına gelmez. Bu liste önceki envantere eklenen, somut olarak bulunan işlerdir; tüm kullanım grafiği tamamlandı iddiası değildir.

| Öncelik | Rota / kaynak | Kalan iş / sınır |
|---|---|---|
| P1 | `/products/precast`, `app/products/precast/page.tsx` | 3 ana ×5 alt sekme, 15 panel ve görsel modalı |
| P1 | `/products`, `components/sections/ProductInnovations.tsx` | Paket düğmeleriyle değişen yenilik kartları; ARIA tab taraması yeterli değil |
| P1 | `/products/allplan-2026-yenilikler`, `RegulaTabs` / `SideImageSection` | Düğme panelleri ve video dialogları |
| P1 | `/products/allplan-2026`, Civil/Ultimate/Basic/Concept/Professional | Ürün ve ortak CloudServicesSection video modalları; bu tur yalnız Civil/Ultimate SSS kapandı |
| P1 | `/solutions-v2/connect-license/activation`, `ActivationWizard.tsx:29–60` | İlk İleri gerçek POST `/api/send-activation-email` yapıyor; beş adımın 2–5'i kaynak envanteriyle izlenmeli, canlı geçiş yetkili teslim testine ayrılmalı |
| P1 | `/solutions-v2/connect-license/how-to-assign` | Üç akordeon |
| P1 | `/solutions-v2/training/{online,classroom,events,individual,e-learning,webinar}` | Altı ortak teklif modalı ve sayfaya özgü konu; tek Eğitim kararı mevcut URL'leri envanterden düşürmez |
| P2 | `/solutions-v2/training/video-library/[playlistId]` | 14 slug, 13 farklı koleksiyon; video seçimleri ve iframe hedefleri. campus-tutorials-2019-2022 ile campus-de aynı koleksiyon; bilinmeyen slug fallback'i ayrıca kaydedilmeli |
| P2 | `/solutions-v2/training/webinar` | 13 kaynak kaydı: 12 boş youtubeId, bir sayısal placeholder. Çalışan 13 video kabulü yapılmaz |
| P2 | `/solutions/addons/sketchup-converter` | Export / Import sekmeleri |
| P2 | `/search` | Boş/sonuçlu/sonuçsuz sorgu, Türkçe harfler ve q parametresi |
| P2 | `WorkflowTabsTemplate` tüketicileri | architecture, structural, infrastructure, mep, road-railway, site-planning çözüm rotaları ve products/precast-detail: her rotanın kategori/alt panel/görsel/video kayıtları |
| P2 | `RegulaTabs` / galeri | solutions/addons/steel-components, parametric-terrain, drive-curve (altı panel) |
| P2 | `ImageGallery` | solutions/addons/three-dimensioning, ramp, solutions/ax3000-virtual-reality, ax3000-yapi-fizigi; opsiyonel filtreler prop bazında |
| P2 | `AllplanBulutContent` | `/solutions/allplan-bulut-hizmetleri` video/görsel dialogları |
| P2 | `ProductPageTemplate` | allplan, allplan-aec, architecture, ax3000, allplan-bimplus, sds2-home, allplan-cloud-services, precast-detail, allplan-2026-yenilikler ürün rotalarında kullanılan opsiyonel durumlar |
| P2 | Ortak layout | Gerçek Header/menü/arama/mobil/tema/cookie durumları önceki browser-home kayıtlarıyla eşlenmeli; kullanılmayan bileşenler canlı kabul edilmemeli |
| P1 | Harici Microsoft Forms | 21 Ekim ALLPLAN dalı kaydı mevcut; diğer dallar açık, gönderim bu çalışmanın dışında |

Sorumlu: teknik ekip kanıt toplar; Hazar içerik/hedef farklarını karara bağlar. Ücret, lisans, sertifika ve SLA gerçekleri Aluplan sorumlusunca doğrulanır. Video oynatma, form teslimi ve özel müşteri işlemleri ayrı kabul kapsamıdır.

## Schema etkisi

SSS metinlerinin görünür durumlarını kaydetmek schema üretmek veya Google rich result uygunluğu sağlamak değildir. Eğitim tek Service, destek tek Service/iki kanal planı korunur. Güncel Google değerlendirmesi [22 Ekim schema raporunda](../schema-final-review-2026-10-22.md); bu tur yeniden kural araştırması yapılmadı. Ürün SSS'lerindeki kapsam ifadeleri kaynaksız ticari hak veya Offer olarak aktarılmaz.
