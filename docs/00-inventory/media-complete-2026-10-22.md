# D02 — Bilinen medya kümesinin tamamlanan kontrolü

Tarih: 22.10.2026. **19 Ekim HTML envanterindeki 503 benzersiz hash'li görsel URL'sinin tamamı kontrol edildi: 503 HTTP 200 ve 503 mevcut kaynak SHA-256 eşleşmesi.** Bu sonlu medya kontrolü tamamlandı; bütün sitenin dinamik kullanımı veya aktarımın tamamlanması anlamına gelmez.

## Kapsam ve yöntem

- Önceki rapordaki 86 görsel sonucu tekrar kullanıldı; kalan **417 URL** dört eşzamanlı GET, 25 saniye süre ve 12 MB/dosya sınırıyla kontrol edildi. Önceki iki DOCX kanıtı da korundu.
- Kaynak envanterindeki **1.364 dosyanın tamamı yeniden hash edildi**. Eksik dosya veya eski envantere göre hash değişikliği yok.
- Görselin sayfayla ilişkisi **19 Ekim HTML kaydına**; özgün dosyanın erişimi ve bayt eşitliği **22 Ekim** kontrolüne dayanır. Next.js optimize URL içinden özgün dosya hedefi çözüldü; optimize görüntü baytlarıyla kaynak dosya kıyaslanmadı.
- `app`, `components`, `lib`, `data`, `styles` içindeki TS/TSX/JS/JSX/CSS/SCSS/JSON sabit medya yolları ve CSS URL ifadeleri tarandı. Bu bir AST veya tüm dinamik bağımlılık grafiği değildir.
- Önceki altı PDF'nin **21 Ekim canlı hash kanıtı** yeniden kullanıldı; ilişkili kaynak dosyalarının hash'leri 22 Ekim'de aynı. PDF'ler tekrar indirilmedi.
- Kaynak salt okunur kaldı. Medya bellekte hash edildi; dosya taşıma/silme, build, kurulum, canlı değişiklik, entegrasyon veya commit yok.

Makinece incelenebilir kanıt: [media-complete-2026-10-22.json](media-complete-2026-10-22.json). Önceki sınırlı geçiş: [media-closure-2026-10-22.md](media-closure-2026-10-22.md).

## 1.364 kök dosyanın sınıflandırması

| Sınıf | Dosya yolu sayısı | Anlamı |
|---|---:|---|
| 22 Ekim canlı hash eşleşmesi | 707 | 503 görsel ve iki DOCX'in kaynak eşleri; aynı baytlara sahip kopyalar dahil |
| Önceki canlı PDF kanıtıyla eşleşme | 12 | Altı PDF'nin kaynak eşleri; canlı21Ekim/kaynak22Ekim |
| Yalnız kesin statik kaynak yolu referansı | 269 | Kaynakta literal yol bulundu; bu kontrol canlı kullanımını ispatlamıyor |
| Yalnız önceki referans adayı | 31 | Basename/literal adaylığı var; kesin kullanım kanıtı yok |
| Taranan kapsamda referans kanıtı yok | 345 | Kullanılmıyor demek değildir; tam liste aşağıda |
| **Toplam** | **1.364** | Birbirini dışlayan sınıflar |

`live_hash_match`, aynı baytların canlı dosyada bulunduğunu ispatlar; aynı hash'e sahip her kaynak kopyasının ayrı ayrı runtime'da kullanıldığını ispatlamaz. 345 dosya otomatik silinmeyecek. 31 aday da kayıpsız korunacak. Teknik ekip eşleme kanıtını üretir; yalnız yerel içeriğin yayın kapsamına alınması Hazar'ın kararıdır. Kullanıcıdan tek tek dosya ayıklaması istenmesi gerekmez.

## Kaynak referans taramasında ayrıştırılan durumlar

İlk taramadaki 82 çözülemeyen adayın 59'u medya dosyasına giden yol değildi: YouTube başlıklarında `.mp4` yazımı, download dosya adları, harita anahtarları, JS ifadeleri, SVG fragmenti veya açıklama metni. Bunlar eksik dosya sayılmadı. İki `/opengraph-image.png` referansı Next.js dosya kuralıyla **`app/opengraph-image.png`** dosyasına çözülür; public altında yokluğu hata değildir. Bu dosya eski 1.364 varlık listesinde zaten bulunur. İki layout referansı Next.js dosya kuralıyla çözüldü; sınıfı aday referanstan kesin kaynak referansına düzeltildi.

Kalan **21 literal referans** aşağıdadır. Bunlar kaynak bulgularıdır; tarayıcıda görüntülenen tüm sayfalarda hata olduğu iddia edilmez.

| Kaynak:satır | Çözülen hedef | Durum |
|---|---|---|
| `app/solutions/page.tsx:11` | `assets/solutions/industry/hero.jpg` | Kaynakta hedef yok |
| `app/solutions-v2/training/page.tsx:64` | `public/images/training-interest.jpg` | Kaynakta hedef yok |
| `app/solutions-v2/training/page.tsx:76` | `public/images/webinars/bimx5-youtube.jpeg` | Kaynakta hedef yok |
| `app/solutions-v2/training/page.tsx:88` | `public/images/training-basic.jpg` | Kaynakta hedef yok |
| `app/solutions-v2/training/page.tsx:100` | `public/images/training-advanced.jpg` | Kaynakta hedef yok |
| `app/solutions-v2/training/page.tsx:112` | `public/images/training-special.jpg` | Kaynakta hedef yok |
| `app/solutions-v2/training/page.tsx:124` | `public/images/training-bim.jpg` | Kaynakta hedef yok |
| `app/brc/asset/[...slug]/route.ts:10` | `src/assets/products/allplan-basic/3d-modeling.jpg` | Kaynakta hedef yok |
| `app/brc/asset/[...slug]/route.ts:11` | `src/assets/products/allplan-basic/visualization.jpg` | Kaynakta hedef yok |
| `app/brc/asset/[...slug]/route.ts:13` | `src/assets/products/allplan-professional/precise-3d-reinforcement.png` | Kaynakta hedef yok |
| `app/brc/asset/[...slug]/route.ts:14` | `src/assets/products/precast/wall-reinforcement.jpg` | Kaynakta hedef yok |
| `app/brc/asset/[...slug]/route.ts:15` | `src/assets/products/allplan-professional/steel-connections.jpg` | Kaynakta hedef yok |
| `app/brc/asset/[...slug]/route.ts:16` | `src/assets/products/allplan-ultimate/parametric-modeling.jpg` | Kaynakta hedef yok |
| `app/brc/asset/[...slug]/route.ts:18` | `src/assets/products/allplan-professional/terrain-model.jpg` | Kaynakta hedef yok |
| `app/brc/asset/[...slug]/route.ts:19` | `src/assets/products/allplan-ultimate/parametric-road-modeling.png` | Kaynakta hedef yok |
| `app/brc/asset/[...slug]/route.ts:20` | `src/assets/products/allplan-professional/sewerage-utilities.jpg` | Kaynakta hedef yok |
| `app/brc/asset/[...slug]/route.ts:22` | `src/assets/products/allplan-ultimate/bim-2field.png` | Kaynakta hedef yok |
| `components/homepage/TrustBadges.tsx:4` | `public/images/partners/nemetschek.svg` | Kaynakta hedef yok |
| `components/homepage/TrustBadges.tsx:5` | `public/images/partners/buildingsmart.svg` | Kaynakta hedef yok |
| `components/homepage/TrustBadges.tsx:6` | `public/images/partners/ifc.svg` | Kaynakta hedef yok |
| `components/homepage/TrustBadges.tsx:7` | `public/images/partners/iso27001.svg` | Kaynakta hedef yok |

`app/solutions/page.tsx:11` içindeki eksik `imgIndustry` importu kullanılmıyor; kart `imgArchitecture` kullanıyor. Eğitim sayfasındaki altı görsel alanının dinamik/gerçek kullanım kontrolü, sadece veri nesnesinde yol bulunmasından ayrı tutulmalıdır. TrustBadges bileşeninin dört logo hedefi de bileşenin canlıda erişilebilirliği doğrulanmadan canlı hata sayılmaz.

`app/brc/asset/[...slug]/route.ts` içindeki on `src/assets/...` yolu `path.join(process.cwd(), mapped)` ile çözülüyor. Kaynakta bu yollar yok; route dosya okuma hatasında şeffaf PNG döndüren fallback içeriyor. Bu nedenle yalnız HTTP 200 kontrolü ilgili route'un doğru görsel verdiğini kanıtlamaz. Yeni uygulamada bu route taşınırsa içerik/bayt doğrulaması gereklidir; mevcut canlı route davranışı bu çalışmada ayrıca çağrılmadı.

## Dinamik tarayıcı durumlarından ek görsel kontrolü

`browser-complete-2026-10-22/states.json` içindeki179 durumun44'ünde `images.src` dizileri bulunur. Bunlardan çözülen **304 benzersiz özgün görsel URL'sinin86'sı** zaten503 kümesindedir; yeniden indirilmedi. **218 yeni URL'nin tamamı dış kaynaktır:**216YouTube thumbnail ve iki lisans görseli. Yeni dahili hash'li URL çıkmadı.135yalnız AX kaydı görsel URL'lerini tam vermediği için tüm dinamik medyanın kapsandığı iddia edilmez.

Ek218 hedefe boundedGET: **217 HTTP200**, bir DNS çözümleme hatası (curl6; tekrar denemede de aynı). YouTube thumbnail erişimi videonun oynatılabildiğini veya mevcut olduğunu tek başına kanıtlamaz.

- `addon.aluplan.com.tr/wp-content/uploads/2023/02/Lisans.jpg`: SketchUp Import/Export durumlarında görüldü; bu ortamda DNS çözümlenemedi. HTTP404 veya küresel erişilemezlik hükmü verilmedi.
- NitroCDN üzerindeki Lisans.jpg:200ve kaynakta beş dosyayla aynı SHA-256. Bunlar JSON'da `supplemental_live_hash_urls` ile ilişkilendirildi; önceki kök sınıfların toplamı değişmedi.

Bu ek kontrol orijinal503 kümesinden ayrı tutulur. Dosya baytları kaydedilmedi; URL, durum, hash ve route/state kanıtı JSON'dadır. Herhangi bir hedef otomatik değiştirilmedi.

## Kapanış ve sonraki teknik kontrol

**Kapandı:** Bilinen503 hash'li görselin HTTP/hash eşlemesi;1.364 eski kök envanter dosyasının mevcut bayt kontrolü ve kanıta göre sınıflandırılması; iki DOCX'in canlı kaynak eşitliği.

**Açık kapsam:** Canlı istemciyle oluşan ve19Ekim HTML'inde bulunmayan medya; video akışı/harici gömme; tüm CSS/dinamik üretim ve transitif import ilişkileri; yeni siteye gerçek taşıma ve rendered UI kontrolü. Arşiv varyantı bu kök sayısına dahil değildir. Bu sınırlar nedeniyle D02'nin tüm gereklilikleri veya Faz0 otomatik kapatılmaz.

Karar: Kesin eşleşen dosyalar koruma eşlemesine alınabilir. Yalnız kaynakta görülen veya açıklanamayanlar da güvenli kapsamda korunur; yayın kapsamına yeni içerik eklenmez ve silme yapılmaz. Eksik yolların2027 karşılıkları canlı kanıtla belirlenir. Schema veya içerik değiştirilmedi.

## Yalnız aday referansı bulunan31 yol

- `assets/documents/Data_exchange_formats_Allplan_2025_EN_GmbH.pdf`
- `assets/hero-bg.jpg`
- `assets/products/allplan-aec/features/structural/csm_09_Precast_1345b6c8b9.png`
- `assets/products/allplan-aec/hero/2024-header.mp4`
- `assets/products/allplan-basic/bluebeam-connection.jpg`
- `assets/solutions/allplan-bulut-hizmetleri/autoconverter.jpg`
- `assets/solutions/allplan-bulut-hizmetleri/bimplus.jpg`
- `assets/solutions/allplan-bulut-hizmetleri/exchange.jpg`
- `assets/solutions/bridge/features/2024-header.mp4`
- `assets/solutions/cds/drive-curve/17.webp`
- `assets/solutions/cds/drive-curve/18.webp`
- `assets/solutions/cds/drive-curve/19.webp`
- `assets/solutions/cds/drive-curve/23.webp`
- `assets/solutions/scalypso/2023/01/logo.png`
- `assets/solutions/scalypso/2025/01/alplan-logo-2020-beyaz.png`
- `assets/solutions/scalypso/logo.png`
- `assets/solutions/structural/workflows/detailing/shuttering-plans.jpg`
- `assets/solutions/structural/workflows/model-analysis/change-management.png`
- `assets/solutions/structural/workflows/model-analysis/structural-analysis.jpg`
- `assets/solutions/structural/workflows/modeling/precast-design.jpg`
- `public/assets/allplan-ultimate/cloud/connexis.jpg`
- `public/assets/allplan-ultimate/core/advanced-visualization.jpg`
- `public/assets/allplan-ultimate/core/element-plan.jpg`
- `public/assets/allplan-ultimate/core/excavation.jpg`
- `public/assets/allplan-ultimate/core/groundworks.jpg`
- `public/assets/allplan-ultimate/core/interfaces.jpg`
- `public/assets/allplan-ultimate/core/parametric-modeling.jpg`
- `public/assets/allplan-ultimate/core/parametric-prestressing.jpg`
- `public/assets/allplan-ultimate/core/sewerage-utilities.jpg`
- `public/assets/allplan-ultimate/core/terrain-model.jpg`
- `public/assets/allplan-ultimate/core/urban-landscape.jpg`

## Taranan kapsamda referans kanıtı bulunmayan345 yol

Bu liste “kullanılmayan dosyalar” listesi değildir. Önceki PDF kanıtıyla çözülen kopyalar listeden çıkarılmıştır.

- `assets/documents/AX3000_Brosur_V2022.pdf`
- `assets/logo-black.png`
- `assets/logo-white.png`
- `assets/marketing/bimflex/bimflex-mail-header-text.png`
- `assets/marketing/bimflex/bimflex-mail-header.png`
- `assets/products/allplan-basic/design-checking.jpg`
- `assets/products/allplan-concept/remote/cloud/bluebeam_connection.jpg`
- `assets/products/allplan-concept/remote/cloud/design_checking.jpg`
- `assets/products/civil/workflow-bridge.jpg`
- `assets/products/civil/workflow-structural.jpg`
- `assets/solutions/addon-channel/islevi/3d.jpg`
- `assets/solutions/addon-channel/islevi/berechnung.jpg`
- `assets/solutions/addon-channel/islevi/beschriftung.jpg`
- `assets/solutions/addon-channel/islevi/darstellung.jpg`
- `assets/solutions/addon-channel/islevi/druckleitung.png`
- `assets/solutions/addon-channel/islevi/knotenpunkt-1.jpg`
- `assets/solutions/addon-channel/islevi/massstab.jpg`
- `assets/solutions/addon-channel/islevi/mischwasser.png`
- `assets/solutions/addon-channel/islevi/profilschnitt-1.png`
- `assets/solutions/addon-channel/islevi/schachtdarstellung.png`
- `assets/solutions/addon-channel/islevi/tauchbogen.png`
- `assets/solutions/addon-channel/yenilikler/attribute.jpg`
- `assets/solutions/addon-channel/yenilikler/gleichartig.jpg`
- `assets/solutions/addon-channel/yenilikler/griffe.jpg`
- `assets/solutions/addon-channel/yenilikler/limitierung.jpg`
- `assets/solutions/addon-channel/yenilikler/lizenz.jpg`
- `assets/solutions/addon-channel/yenilikler/offset.jpg`
- `assets/solutions/addon-channel/yenilikler/reports-1.jpg`
- `assets/solutions/addon-channel/yenilikler/rohrsohle.jpg`
- `assets/solutions/addon-channel/yenilikler/text.jpg`
- `assets/solutions/addon-channel/yenilikler/zeiger.jpg`
- `assets/solutions/allplan-bulut-hizmetleri/share.png`
- `assets/solutions/allplan-bulut-hizmetleri/solibri.jpg`
- `assets/solutions/allplan-bulut-hizmetleri/workgroup_manager.png`
- `assets/solutions/architecture-hero-bg.png`
- `assets/solutions/ax3000/features/1470399594_Web_Design-1.png`
- `assets/solutions/ax3000/features/1470399607_Illustration-1.png`
- `assets/solutions/cds/drive-curve/16.webp`
- `assets/solutions/cds/drive-curve/20.webp`
- `assets/solutions/cds/drive-curve/21.webp`
- `assets/solutions/cds/drive-curve.jpg`
- `assets/solutions/cds/geometry-tools/2000_657ace0a93d8e-150x150.webp`
- `assets/solutions/cds/geometry-tools/2000_657ace0a93d8e-300x257.webp`
- `assets/solutions/cds/geometry-tools/2000_657ace0a93d8e-768x658.webp`
- `assets/solutions/cds/geometry-tools/2000_657ace0a93d8e-930x620.webp`
- `assets/solutions/cds/steel-components.jpeg`
- `assets/solutions/cds/terrain.jpg`
- `assets/solutions/collaboration-hero.jpg`
- `assets/solutions/scalypso/2020/10/bg-001-free-img-1024x576.png`
- `assets/solutions/scalypso/2020/10/bg-001-free-img-150x150.png`
- `assets/solutions/scalypso/2020/10/bg-001-free-img-1536x864.png`
- `assets/solutions/scalypso/2020/10/bg-001-free-img-300x169.png`
- `assets/solutions/scalypso/2020/10/bg-001-free-img-768x432.png`
- `assets/solutions/scalypso/2020/10/bg-001-free-img.png`
- `assets/solutions/scalypso/2020/11/bg-0002-free-img-1024x575.jpg`
- `assets/solutions/scalypso/2020/11/bg-0002-free-img-150x150.jpg`
- `assets/solutions/scalypso/2020/11/bg-0002-free-img-1536x863.jpg`
- `assets/solutions/scalypso/2020/11/bg-0002-free-img-300x169.jpg`
- `assets/solutions/scalypso/2020/11/bg-0002-free-img-768x432.jpg`
- `assets/solutions/scalypso/2020/11/bg-0002-free-img.jpg`
- `assets/solutions/scalypso/2020/11/bg-003-free-img-150x150.png`
- `assets/solutions/scalypso/2020/11/bg-003-free-img-225x300.png`
- `assets/solutions/scalypso/2020/11/bg-003-free-img.png`
- `assets/solutions/scalypso/2020/11/bg-04-free-img-150x150.png`
- `assets/solutions/scalypso/2020/11/bg-04-free-img-276x1024.png`
- `assets/solutions/scalypso/2020/11/bg-04-free-img-81x300.png`
- `assets/solutions/scalypso/2020/11/bg-04-free-img.png`
- `assets/solutions/scalypso/2020/11/bg-05-free-img-150x150.png`
- `assets/solutions/scalypso/2020/11/bg-05-free-img-242x300.png`
- `assets/solutions/scalypso/2020/11/bg-05-free-img.png`
- `assets/solutions/scalypso/2020/11/bg-06-free-img-1024x575.jpg`
- `assets/solutions/scalypso/2020/11/bg-06-free-img-150x150.jpg`
- `assets/solutions/scalypso/2020/11/bg-06-free-img-1536x863.jpg`
- `assets/solutions/scalypso/2020/11/bg-06-free-img-300x169.jpg`
- `assets/solutions/scalypso/2020/11/bg-06-free-img-768x432.jpg`
- `assets/solutions/scalypso/2020/11/bg-06-free-img.jpg`
- `assets/solutions/scalypso/2020/11/bg-07-free-img-1024x575.jpg`
- `assets/solutions/scalypso/2020/11/bg-07-free-img-150x150.jpg`
- `assets/solutions/scalypso/2020/11/bg-07-free-img-1536x863.jpg`
- `assets/solutions/scalypso/2020/11/bg-07-free-img-300x169.jpg`
- `assets/solutions/scalypso/2020/11/bg-07-free-img-768x432.jpg`
- `assets/solutions/scalypso/2020/11/bg-07-free-img.jpg`
- `assets/solutions/scalypso/2020/11/bg-08-free-img-1024x575.jpg`
- `assets/solutions/scalypso/2020/11/bg-08-free-img-150x150.jpg`
- `assets/solutions/scalypso/2020/11/bg-08-free-img-1536x863.jpg`
- `assets/solutions/scalypso/2020/11/bg-08-free-img-300x169.jpg`
- `assets/solutions/scalypso/2020/11/bg-08-free-img-768x432.jpg`
- `assets/solutions/scalypso/2020/11/bg-08-free-img.jpg`
- `assets/solutions/scalypso/2020/11/bg-09-free-img-1024x575.jpg`
- `assets/solutions/scalypso/2020/11/bg-09-free-img-150x150.jpg`
- `assets/solutions/scalypso/2020/11/bg-09-free-img-1536x863.jpg`
- `assets/solutions/scalypso/2020/11/bg-09-free-img-300x169.jpg`
- `assets/solutions/scalypso/2020/11/bg-09-free-img-768x432.jpg`
- `assets/solutions/scalypso/2020/11/bg-09-free-img.jpg`
- `assets/solutions/scalypso/2020/11/cropped-favicon-free-img-150x150.png`
- `assets/solutions/scalypso/2020/11/cropped-favicon-free-img-300x300.png`
- `assets/solutions/scalypso/2020/11/cropped-favicon-free-img.png`
- `assets/solutions/scalypso/2020/11/favicon-free-img-150x150.png`
- `assets/solutions/scalypso/2020/11/favicon-free-img-300x300.png`
- `assets/solutions/scalypso/2020/11/favicon-free-img.png`
- `assets/solutions/scalypso/2020/11/gallery-01-free-img-150x150.jpg`
- `assets/solutions/scalypso/2020/11/gallery-01-free-img-300x125.jpg`
- `assets/solutions/scalypso/2020/11/gallery-01-free-img-768x320.jpg`
- `assets/solutions/scalypso/2020/11/gallery-01-free-img.jpg`
- `assets/solutions/scalypso/2020/11/gallery-02-free-img-150x150.jpg`
- `assets/solutions/scalypso/2020/11/gallery-02-free-img-180x300.jpg`
- `assets/solutions/scalypso/2020/11/gallery-02-free-img.jpg`
- `assets/solutions/scalypso/2020/11/gallery-03-free-img-150x150.jpg`
- `assets/solutions/scalypso/2020/11/gallery-03-free-img-180x300.jpg`
- `assets/solutions/scalypso/2020/11/gallery-03-free-img.jpg`
- `assets/solutions/scalypso/2020/11/gallery-04-free-img-150x150.jpg`
- `assets/solutions/scalypso/2020/11/gallery-04-free-img-300x125.jpg`
- `assets/solutions/scalypso/2020/11/gallery-04-free-img-768x320.jpg`
- `assets/solutions/scalypso/2020/11/gallery-04-free-img.jpg`
- `assets/solutions/scalypso/2020/11/logo-001-free-img-150x150.png`
- `assets/solutions/scalypso/2020/11/logo-001-free-img-300x300.png`
- `assets/solutions/scalypso/2020/11/logo-001-free-img.png`
- `assets/solutions/scalypso/2020/11/logo-002-free-img-150x150.png`
- `assets/solutions/scalypso/2020/11/logo-002-free-img-300x300.png`
- `assets/solutions/scalypso/2020/11/logo-002-free-img.png`
- `assets/solutions/scalypso/2020/11/logo-003-free-img-150x150.png`
- `assets/solutions/scalypso/2020/11/logo-003-free-img-300x300.png`
- `assets/solutions/scalypso/2020/11/logo-003-free-img.png`
- `assets/solutions/scalypso/2020/11/logo-004-free-img-150x150.png`
- `assets/solutions/scalypso/2020/11/logo-004-free-img-300x300.png`
- `assets/solutions/scalypso/2020/11/logo-004-free-img.png`
- `assets/solutions/scalypso/2020/11/logo-005-free-img-150x150.png`
- `assets/solutions/scalypso/2020/11/logo-005-free-img-300x300.png`
- `assets/solutions/scalypso/2020/11/logo-005-free-img.png`
- `assets/solutions/scalypso/2020/11/logo-006-free-img-150x150.png`
- `assets/solutions/scalypso/2020/11/logo-006-free-img-300x300.png`
- `assets/solutions/scalypso/2020/11/logo-006-free-img.png`
- `assets/solutions/scalypso/2020/11/logo-regular-free-img-150x32.png`
- `assets/solutions/scalypso/2020/11/logo-regular-free-img.png`
- `assets/solutions/scalypso/2020/11/logo-retina-free-img-150x63.png`
- `assets/solutions/scalypso/2020/11/logo-retina-free-img-300x57.png`
- `assets/solutions/scalypso/2020/11/logo-retina-free-img.png`
- `assets/solutions/scalypso/2020/11/pic-001-free-img-150x150.jpg`
- `assets/solutions/scalypso/2020/11/pic-001-free-img-300x300.jpg`
- `assets/solutions/scalypso/2020/11/pic-001-free-img.jpg`
- `assets/solutions/scalypso/2020/11/pic-002-free-img-150x150.jpg`
- `assets/solutions/scalypso/2020/11/pic-002-free-img-300x300.jpg`
- `assets/solutions/scalypso/2020/11/pic-002-free-img.jpg`
- `assets/solutions/scalypso/2020/11/pic-03-free-img-150x150.jpg`
- `assets/solutions/scalypso/2020/11/pic-03-free-img-300x300.jpg`
- `assets/solutions/scalypso/2020/11/pic-03-free-img.jpg`
- `assets/solutions/scalypso/2020/11/signature-01-free-img.png`
- `assets/solutions/scalypso/2020/11/team-01-free-img-150x150.jpg`
- `assets/solutions/scalypso/2020/11/team-01-free-img-300x300.jpg`
- `assets/solutions/scalypso/2020/11/team-01-free-img.jpg`
- `assets/solutions/scalypso/2020/11/team-02-free-img-150x150.jpg`
- `assets/solutions/scalypso/2020/11/team-02-free-img-300x300.jpg`
- `assets/solutions/scalypso/2020/11/team-02-free-img.jpg`
- `assets/solutions/scalypso/2020/11/team-03-free-img-150x150.jpg`
- `assets/solutions/scalypso/2020/11/team-03-free-img-300x300.jpg`
- `assets/solutions/scalypso/2020/11/team-03-free-img.jpg`
- `assets/solutions/scalypso/2020/12/demo-screenshot-1024x538.jpg`
- `assets/solutions/scalypso/2020/12/demo-screenshot-150x150.jpg`
- `assets/solutions/scalypso/2020/12/demo-screenshot-300x158.jpg`
- `assets/solutions/scalypso/2020/12/demo-screenshot-768x403.jpg`
- `assets/solutions/scalypso/2020/12/demo-screenshot.jpg`
- `assets/solutions/scalypso/2023/01/Modeler-1-2048x1122-1-1024x561.jpg`
- `assets/solutions/scalypso/2023/01/Modeler-1-2048x1122-1-150x150.jpg`
- `assets/solutions/scalypso/2023/01/Modeler-1-2048x1122-1-1536x842.jpg`
- `assets/solutions/scalypso/2023/01/Modeler-1-2048x1122-1-300x164.jpg`
- `assets/solutions/scalypso/2023/01/Modeler-1-2048x1122-1-768x421.jpg`
- `assets/solutions/scalypso/2023/01/Modeler-1-2048x1122-1.jpg`
- `assets/solutions/scalypso/2023/01/Murga-Zusammen_70-1-scaled-1-1024x632.jpg`
- `assets/solutions/scalypso/2023/01/Murga-Zusammen_70-1-scaled-1-150x150.jpg`
- `assets/solutions/scalypso/2023/01/Murga-Zusammen_70-1-scaled-1-1536x949.jpg`
- `assets/solutions/scalypso/2023/01/Murga-Zusammen_70-1-scaled-1-2048x1265.jpg`
- `assets/solutions/scalypso/2023/01/Murga-Zusammen_70-1-scaled-1-300x185.jpg`
- `assets/solutions/scalypso/2023/01/Murga-Zusammen_70-1-scaled-1-768x474.jpg`
- `assets/solutions/scalypso/2023/01/Murga-Zusammen_70-1-scaled-1.jpg`
- `assets/solutions/scalypso/2023/01/Strasse_Ansicht_4-1-1024x640.jpg`
- `assets/solutions/scalypso/2023/01/Strasse_Ansicht_4-1-150x150.jpg`
- `assets/solutions/scalypso/2023/01/Strasse_Ansicht_4-1-1536x961.jpg`
- `assets/solutions/scalypso/2023/01/Strasse_Ansicht_4-1-300x188.jpg`
- `assets/solutions/scalypso/2023/01/Strasse_Ansicht_4-1-768x480.jpg`
- `assets/solutions/scalypso/2023/01/Strasse_Ansicht_4-1.jpg`
- `assets/solutions/scalypso/2023/01/architecture_1900_600-1024x323.jpg`
- `assets/solutions/scalypso/2023/01/architecture_1900_600-150x150.jpg`
- `assets/solutions/scalypso/2023/01/architecture_1900_600-1536x485.jpg`
- `assets/solutions/scalypso/2023/01/architecture_1900_600-300x95.jpg`
- `assets/solutions/scalypso/2023/01/architecture_1900_600-768x243.jpg`
- `assets/solutions/scalypso/2023/01/architecture_1900_6002-1024x323.jpg`
- `assets/solutions/scalypso/2023/01/architecture_1900_6002-150x150.jpg`
- `assets/solutions/scalypso/2023/01/architecture_1900_6002-1536x485.jpg`
- `assets/solutions/scalypso/2023/01/architecture_1900_6002-300x95.jpg`
- `assets/solutions/scalypso/2023/01/architecture_1900_6002-768x243.jpg`
- `assets/solutions/scalypso/2023/01/bridge_1900x600-1024x323.jpg`
- `assets/solutions/scalypso/2023/01/bridge_1900x600-150x150.jpg`
- `assets/solutions/scalypso/2023/01/bridge_1900x600-1536x485.jpg`
- `assets/solutions/scalypso/2023/01/bridge_1900x600-300x95.jpg`
- `assets/solutions/scalypso/2023/01/bridge_1900x600-768x243.jpg`
- `assets/solutions/scalypso/2023/01/converter-202004-en-150x150.jpg`
- `assets/solutions/scalypso/2023/01/converter-202004-en-300x217.jpg`
- `assets/solutions/scalypso/2023/01/industry2_1900_600-1024x323.jpg`
- `assets/solutions/scalypso/2023/01/industry2_1900_600-150x150.jpg`
- `assets/solutions/scalypso/2023/01/industry2_1900_600-1536x485.jpg`
- `assets/solutions/scalypso/2023/01/industry2_1900_600-300x95.jpg`
- `assets/solutions/scalypso/2023/01/industry2_1900_600-768x243.jpg`
- `assets/solutions/scalypso/2023/01/industry_1900_600-1024x323.jpg`
- `assets/solutions/scalypso/2023/01/industry_1900_600-150x150.jpg`
- `assets/solutions/scalypso/2023/01/industry_1900_600-1536x485.jpg`
- `assets/solutions/scalypso/2023/01/industry_1900_600-300x95.jpg`
- `assets/solutions/scalypso/2023/01/industry_1900_600-768x243.jpg`
- `assets/solutions/scalypso/2023/01/logo-150x90.png`
- `assets/solutions/scalypso/2023/01/logo-282x85.png`
- `assets/solutions/scalypso/2023/01/modeler_color_01-1024x603.jpg`
- `assets/solutions/scalypso/2023/01/modeler_color_01-150x150.jpg`
- `assets/solutions/scalypso/2023/01/modeler_color_01-1536x905.jpg`
- `assets/solutions/scalypso/2023/01/modeler_color_01-300x177.jpg`
- `assets/solutions/scalypso/2023/01/modeler_color_01-768x453.jpg`
- `assets/solutions/scalypso/2023/01/scalypso_logo-150x45.png`
- `assets/solutions/scalypso/2023/01/scalypso_logo-300x41.png`
- `assets/solutions/scalypso/2023/01/scalypso_logo-beyaz-150x45.png`
- `assets/solutions/scalypso/2023/01/scalypso_logo-beyaz-300x41.png`
- `assets/solutions/scalypso/2023/01/scalypso_logo-beyaz.png`
- `assets/solutions/scalypso/2023/01/scalypso_logo.png`
- `assets/solutions/scalypso/2023/01/ship_1900_600-1024x323.jpg`
- `assets/solutions/scalypso/2023/01/ship_1900_600-150x150.jpg`
- `assets/solutions/scalypso/2023/01/ship_1900_600-1536x485.jpg`
- `assets/solutions/scalypso/2023/01/ship_1900_600-300x95.jpg`
- `assets/solutions/scalypso/2023/01/ship_1900_600-768x243.jpg`
- `assets/solutions/scalypso/2025/01/alplan-logo-2020-beyaz-150x86.png`
- `assets/solutions/scalypso/2025/01/alplan-logo-2020-beyaz-282x82.png`
- `assets/solutions/scalypso/Modeler-1-2048x1122-1-1024x561.jpg`
- `assets/solutions/scalypso/Modeler-1-2048x1122-1-150x150.jpg`
- `assets/solutions/scalypso/Modeler-1-2048x1122-1-1536x842.jpg`
- `assets/solutions/scalypso/Modeler-1-2048x1122-1-300x164.jpg`
- `assets/solutions/scalypso/Modeler-1-2048x1122-1-768x421.jpg`
- `assets/solutions/scalypso/Modeler-1-2048x1122-1.jpg`
- `assets/solutions/scalypso/Murga-Zusammen_70-1-scaled-1-1024x632.jpg`
- `assets/solutions/scalypso/Murga-Zusammen_70-1-scaled-1-150x150.jpg`
- `assets/solutions/scalypso/Murga-Zusammen_70-1-scaled-1-1536x949.jpg`
- `assets/solutions/scalypso/Murga-Zusammen_70-1-scaled-1-2048x1265.jpg`
- `assets/solutions/scalypso/Murga-Zusammen_70-1-scaled-1-300x185.jpg`
- `assets/solutions/scalypso/Murga-Zusammen_70-1-scaled-1-768x474.jpg`
- `assets/solutions/scalypso/Murga-Zusammen_70-1-scaled-1.jpg`
- `assets/solutions/scalypso/Strasse_Ansicht_4-1-1024x640.jpg`
- `assets/solutions/scalypso/Strasse_Ansicht_4-1-150x150.jpg`
- `assets/solutions/scalypso/Strasse_Ansicht_4-1-1536x961.jpg`
- `assets/solutions/scalypso/Strasse_Ansicht_4-1-300x188.jpg`
- `assets/solutions/scalypso/Strasse_Ansicht_4-1-768x480.jpg`
- `assets/solutions/scalypso/Strasse_Ansicht_4-1.jpg`
- `assets/solutions/scalypso/architecture_1900_600-1024x323.jpg`
- `assets/solutions/scalypso/architecture_1900_600-150x150.jpg`
- `assets/solutions/scalypso/architecture_1900_600-1536x485.jpg`
- `assets/solutions/scalypso/architecture_1900_600-300x95.jpg`
- `assets/solutions/scalypso/architecture_1900_600-768x243.jpg`
- `assets/solutions/scalypso/architecture_1900_6002-1024x323.jpg`
- `assets/solutions/scalypso/architecture_1900_6002-150x150.jpg`
- `assets/solutions/scalypso/architecture_1900_6002-1536x485.jpg`
- `assets/solutions/scalypso/architecture_1900_6002-300x95.jpg`
- `assets/solutions/scalypso/architecture_1900_6002-768x243.jpg`
- `assets/solutions/scalypso/bridge_1900x600-1024x323.jpg`
- `assets/solutions/scalypso/bridge_1900x600-150x150.jpg`
- `assets/solutions/scalypso/bridge_1900x600-1536x485.jpg`
- `assets/solutions/scalypso/bridge_1900x600-300x95.jpg`
- `assets/solutions/scalypso/bridge_1900x600-768x243.jpg`
- `assets/solutions/scalypso/converter-202004-en-150x150.jpg`
- `assets/solutions/scalypso/converter-202004-en-300x217.jpg`
- `assets/solutions/scalypso/elementor/google-fonts/fonts/lato-s6u-w4bmutphjxsipx-mpclq7a.woff2`
- `assets/solutions/scalypso/elementor/google-fonts/fonts/lato-s6u-w4bmutphjxsipx-opci.woff2`
- `assets/solutions/scalypso/elementor/google-fonts/fonts/lato-s6u8w4bmutphh30aui-qjcy.woff2`
- `assets/solutions/scalypso/elementor/google-fonts/fonts/lato-s6u8w4bmutphh30axc-q.woff2`
- `assets/solutions/scalypso/elementor/google-fonts/fonts/lato-s6u8w4bmutphjxsaui-qjcy.woff2`
- `assets/solutions/scalypso/elementor/google-fonts/fonts/lato-s6u8w4bmutphjxsaxc-q.woff2`
- `assets/solutions/scalypso/elementor/google-fonts/fonts/lato-s6u9w4bmutphh50xswapgr_p.woff2`
- `assets/solutions/scalypso/elementor/google-fonts/fonts/lato-s6u9w4bmutphh50xswipgq.woff2`
- `assets/solutions/scalypso/elementor/google-fonts/fonts/lato-s6u9w4bmutphh6uvswapgr_p.woff2`
- `assets/solutions/scalypso/elementor/google-fonts/fonts/lato-s6u9w4bmutphh6uvswipgq.woff2`
- `assets/solutions/scalypso/elementor/google-fonts/fonts/lato-s6u9w4bmutphh7usswapgr_p.woff2`
- `assets/solutions/scalypso/elementor/google-fonts/fonts/lato-s6u9w4bmutphh7usswipgq.woff2`
- `assets/solutions/scalypso/elementor/google-fonts/fonts/lato-s6u_w4bmutphjxsi3wi_fqft1dw.woff2`
- `assets/solutions/scalypso/elementor/google-fonts/fonts/lato-s6u_w4bmutphjxsi3wi_gwft.woff2`
- `assets/solutions/scalypso/elementor/google-fonts/fonts/lato-s6u_w4bmutphjxsi5wq_fqft1dw.woff2`
- `assets/solutions/scalypso/elementor/google-fonts/fonts/lato-s6u_w4bmutphjxsi5wq_gwft.woff2`
- `assets/solutions/scalypso/elementor/google-fonts/fonts/lato-s6u_w4bmutphjxsi9w2_fqft1dw.woff2`
- `assets/solutions/scalypso/elementor/google-fonts/fonts/lato-s6u_w4bmutphjxsi9w2_gwft.woff2`
- `assets/solutions/scalypso/elementor/google-fonts/fonts/lato-s6uyw4bmutphjx4wxg.woff2`
- `assets/solutions/scalypso/elementor/google-fonts/fonts/lato-s6uyw4bmutphjxawxjeu.woff2`
- `assets/solutions/scalypso/elementor/google-fonts/fonts/roboto-kfo5cnqeu92fr1mu53zec9_vu3r1gihoszmkahkawzu.woff2`
- `assets/solutions/scalypso/elementor/google-fonts/fonts/roboto-kfo5cnqeu92fr1mu53zec9_vu3r1gihoszmkankawzu.woff2`
- `assets/solutions/scalypso/elementor/google-fonts/fonts/roboto-kfo5cnqeu92fr1mu53zec9_vu3r1gihoszmkbnka.woff2`
- `assets/solutions/scalypso/elementor/google-fonts/fonts/roboto-kfo5cnqeu92fr1mu53zec9_vu3r1gihoszmkbxkawzu.woff2`
- `assets/solutions/scalypso/elementor/google-fonts/fonts/roboto-kfo5cnqeu92fr1mu53zec9_vu3r1gihoszmkc3kawzu.woff2`
- `assets/solutions/scalypso/elementor/google-fonts/fonts/roboto-kfo5cnqeu92fr1mu53zec9_vu3r1gihoszmkchkawzu.woff2`
- `assets/solutions/scalypso/elementor/google-fonts/fonts/roboto-kfo5cnqeu92fr1mu53zec9_vu3r1gihoszmkcnkawzu.woff2`
- `assets/solutions/scalypso/elementor/google-fonts/fonts/roboto-kfo5cnqeu92fr1mu53zec9_vu3r1gihoszmkcxkawzu.woff2`
- `assets/solutions/scalypso/elementor/google-fonts/fonts/roboto-kfo5cnqeu92fr1mu53zec9_vu3r1gihoszmkenkawzu.woff2`
- `assets/solutions/scalypso/elementor/google-fonts/fonts/roboto-kfo7cnqeu92fr1me7ksn66agldtyluama3-ubgee.woff2`
- `assets/solutions/scalypso/elementor/google-fonts/fonts/roboto-kfo7cnqeu92fr1me7ksn66agldtyluama3cubgee.woff2`
- `assets/solutions/scalypso/elementor/google-fonts/fonts/roboto-kfo7cnqeu92fr1me7ksn66agldtyluama3gubgee.woff2`
- `assets/solutions/scalypso/elementor/google-fonts/fonts/roboto-kfo7cnqeu92fr1me7ksn66agldtyluama3iubgee.woff2`
- `assets/solutions/scalypso/elementor/google-fonts/fonts/roboto-kfo7cnqeu92fr1me7ksn66agldtyluama3kubgee.woff2`
- `assets/solutions/scalypso/elementor/google-fonts/fonts/roboto-kfo7cnqeu92fr1me7ksn66agldtyluama3oubgee.woff2`
- `assets/solutions/scalypso/elementor/google-fonts/fonts/roboto-kfo7cnqeu92fr1me7ksn66agldtyluama3yuba.woff2`
- `assets/solutions/scalypso/elementor/google-fonts/fonts/roboto-kfo7cnqeu92fr1me7ksn66agldtyluamawcubgee.woff2`
- `assets/solutions/scalypso/elementor/google-fonts/fonts/roboto-kfo7cnqeu92fr1me7ksn66agldtyluamaxkubgee.woff2`
- `assets/solutions/scalypso/elementor/google-fonts/fonts/robotoslab-bngmuxzytxpivibgjjsb6ufa5qw54a.woff2`
- `assets/solutions/scalypso/elementor/google-fonts/fonts/robotoslab-bngmuxzytxpivibgjjsb6ufb5qw54a.woff2`
- `assets/solutions/scalypso/elementor/google-fonts/fonts/robotoslab-bngmuxzytxpivibgjjsb6ufc5qw54a.woff2`
- `assets/solutions/scalypso/elementor/google-fonts/fonts/robotoslab-bngmuxzytxpivibgjjsb6ufd5qw54a.woff2`
- `assets/solutions/scalypso/elementor/google-fonts/fonts/robotoslab-bngmuxzytxpivibgjjsb6ufj5qw54a.woff2`
- `assets/solutions/scalypso/elementor/google-fonts/fonts/robotoslab-bngmuxzytxpivibgjjsb6ufn5qu.woff2`
- `assets/solutions/scalypso/elementor/google-fonts/fonts/robotoslab-bngmuxzytxpivibgjjsb6ufo5qw54a.woff2`
- `assets/solutions/scalypso/industry2_1900_600-1024x323.jpg`
- `assets/solutions/scalypso/industry2_1900_600-150x150.jpg`
- `assets/solutions/scalypso/industry2_1900_600-1536x485.jpg`
- `assets/solutions/scalypso/industry2_1900_600-300x95.jpg`
- `assets/solutions/scalypso/industry2_1900_600-768x243.jpg`
- `assets/solutions/scalypso/industry_1900_600-1024x323.jpg`
- `assets/solutions/scalypso/industry_1900_600-150x150.jpg`
- `assets/solutions/scalypso/industry_1900_600-1536x485.jpg`
- `assets/solutions/scalypso/industry_1900_600-300x95.jpg`
- `assets/solutions/scalypso/industry_1900_600-768x243.jpg`
- `assets/solutions/scalypso/logo-150x90.png`
- `assets/solutions/scalypso/logo-282x85.png`
- `assets/solutions/scalypso/modeler_color_01-1024x603.jpg`
- `assets/solutions/scalypso/modeler_color_01-150x150.jpg`
- `assets/solutions/scalypso/modeler_color_01-1536x905.jpg`
- `assets/solutions/scalypso/modeler_color_01-300x177.jpg`
- `assets/solutions/scalypso/modeler_color_01-768x453.jpg`
- `assets/solutions/scalypso/scalypso_logo-150x45.png`
- `assets/solutions/scalypso/scalypso_logo-300x41.png`
- `assets/solutions/scalypso/scalypso_logo-beyaz-150x45.png`
- `assets/solutions/scalypso/scalypso_logo-beyaz-300x41.png`
- `assets/solutions/scalypso/scalypso_logo-beyaz.png`
- `assets/solutions/scalypso/scalypso_logo.png`
- `assets/solutions/scalypso/ship_1900_600-1024x323.jpg`
- `assets/solutions/scalypso/ship_1900_600-150x150.jpg`
- `assets/solutions/scalypso/ship_1900_600-1536x485.jpg`
- `assets/solutions/scalypso/ship_1900_600-300x95.jpg`
- `assets/solutions/scalypso/ship_1900_600-768x243.jpg`
- `assets/solutions/structural/workflows/detailing/precast-element-planning.jpg`
- `assets/solutions/structural/workflows/detailing/reinforcement-drawings.png`
- `public/assets/allplan-ultimate/cloud/analytical-model-generation.jpg`
- `public/assets/allplan-ultimate/cloud/cloud-enabled-project-resources.jpg`
- `public/assets/allplan-ultimate/cloud/drawing-and-plan-distribution.jpg`
- `public/assets/allplan-ultimate/core/construction-site-preparation.jpg`
- `public/assets/allplan-ultimate/core/precast-design-and-detailing.jpg`
- `public/assets/allplan-ultimate/core/quantity-takeoff-and-costing.jpg`
- `public/images/client-id-sample.jpg`
