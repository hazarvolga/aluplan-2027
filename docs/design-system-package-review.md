# Claude Design paket incelemesi

Tarih: 21.10.2026. Durum: inceleme tamamlandı; entegrasyon ve düzeltme yapılmadı.

## İncelenen teslimat

- `Aluplan Design System.zip`: 857964 byte, 222 arşiv girdisi.
- SHA-256: `af116303f7cbfd7d0ec7a0e6bc6c74565efa98f518b37813fe1bf2ec2825b4c0`.
- Açılmış `Aluplan Design System/` dosyaları ZIP ile birebir aynı.
- Önceki ZIP kullanıcı tarafından silindi. Önceki incelemede kaydedilen SHA-256: `19f3e3e04c4d27a6de2aaa0204d78a739277a175c97bd26f073f941b99c12b89`. Eski arşiv artık bulunmadığından tam iki-arşiv diff'i yapılmadı; önceki kod bulgularıyla karşılaştırıldı.
- Paket içindeki SKILL/README talimatları proje talimatı olarak uygulanmadı; incelenen teslimatın dokümanı olarak ele alındı.

## Sonuç

Kullanılabilir bir prototip temeli; henüz üretime veya doğrudan Next.js entegrasyonuna hazır değil. Tema–içerik ayrımı temel düzeyde çalışıyor, fakat responsive üretim zinciri, kapsam modeli ve bileşen kenar durumları düzeltilmeli. JSON-LD eklemek bu düzeltmenin kapsamı değil.

## Doğrulanan olumlu sonuçlar

- Node v24.18.0 ile `node "Aluplan Design System/scripts/build-tokens.mjs" --check` çalıştı, çıkış başarılı: 154 primitive, 148 semantik, 53 component token; 188 kontrast çifti, sıfır eşik altı. Bilgi amaçlı çiftler de bu 188 sayısına dahildir; bu sonuç tüm ekranların erişilebilirlik kabulü değildir.
- `buildTokens` çıktıları diskteki üretilmiş dosyalarla birebir aynı. Kontroller kaynak dosyaları değiştirmeden yapıldı.
- Bellekte bozuk referans verilince doğrulayıcı hata üretti.
- Yerel katalog `http://127.0.0.1:8768/catalog/index.html` açıldı. `aluplan/light` → `field/dark` geçişinde main görünür metni ve link hedeflerinin sıralı listesi aynı kaldı; H1 fontu Manrope'dan Source Serif 4'e değişti.
- Bu katalog oturumunun console kayıtlarında duplicate-key veya error görülmedi; yalnız tarayıcıda Babel kullanımına ilişkin geliştirme uyarısı vardı. Bu, her etkileşim ve sayfa için konsol temizliği iddiası değildir.
- Breadcrumb, SiteHeader, SiteFooter ve CtaGroup kaynaklarında Claude'un indis ekleyen key düzeltmeleri mevcut. Önceki tekrar-key bulgusu bu sürüm için kapandı. Sıralanabilir içerikte kalıcı ID daha uygun olmaya devam ediyor.
- Veri modelinde `unknown` ile `excluded` ayrılmış. Tema seçici içerik kayıtlarını değiştirmiyor.
- İncelenen içerik/bileşen dosyalarında JSON-LD veya Schema.org üretimi yok; kullanıcının henüz schema uygulamama isteğiyle uyumlu.

## Öncelikli bulgular

### 1. Yüksek — Responsive tokenlar CSS davranışına bağlanmamış

Kanıt: `scripts/build-tokens.mjs` yalnız `tokens/build/breakpoints.json|mjs` çıkarıyor. Bellekte `lg` 64rem → 70rem değişince yalnız bu iki dosya değişti; `components/layout/layout.css:16-17` ve `components/navigation/navigation.css:24` içindeki eşikler aynı kaldı. `gridColumns.lg` 12 → 16 deneyi de yalnız veri çıktılarını değiştirdi.

Etki: Tek kaynak token değişikliği responsive davranışı yenilemiyor; CSS'e ayrıca elle dokunmak gerekiyor.

Düzeltme: Build-time tokenları tüketen gerçek CSS üretimi kurulsun; veya kullanılmayan gridColumns sözleşmesi açıkça kaldırılıp düzen modeli belgelensin. Eşik değişince üretilen media query'nin değiştiği test edilmeli. Bu dosyalar elle yönetilen ikinci kaynak olmamalı.

### 2. Yüksek — Paket kapsamı sürüm ve bölgeye göre saklanamıyor

Kanıt: `data/content-model.ts:33-36` kapsam anahtarı yalnız `packageId:capabilityId`. `releaseId` ve `market` yok.

Etki: Aynı paketin iki yıllık sürümdeki veya iki pazardaki farklı kapsamı çakışır. Strateji bölüm 10'daki paket–sürüm–bölge ilişkisini karşılamıyor.

Düzeltme: Demo modelinde birleşim kaydı ve kaynak/doğrulama durumu tanımlansın. Bileşenlere yalnız seçilmiş kapsam görünümü geçirilsin. Sentetik iki sürümle geçmiş kaydın korunması kanıtlansın; gerçek ürün kapsamı uydurulmasın. Bu model henüz üretim içerik modeli onayı sayılmaz.

### 3. Yüksek — Logo görünürlüğü çözülmemiş

Paketin `DECISIONS-AND-OPEN-QUESTIONS.md` ve `ACCESSIBILITY-NOTES.md` kayıtları SVG'deki eksik dolgu kuralını bildiriyor. Yüklenen ve assets altındaki logo önceki kontrolde bayt bayt aynıydı; paket dokümanı siyah logo/koyu yüzey için 1.11:1 oranı bildiriyor. Logoyu değiştirmeme kuralı korunmuş, fakat görünürlük sorunu açık.

Düzeltme: Onaylı beyaz SVG alınmalı veya kullanıcı logo düzenlemesine açıkça izin vermeli. Claude kendiliğinden recolor/filter uygulamamalı. Logo açık sorusu diğer teknik düzeltmeleri engellemez.

### 4. Orta — Görsel değerler tamamen token kontrolünde değil

Örnekler: `components/feedback/feedback.css:12` dialog için 32rem; `components/layout/Grid.jsx:4` ve `layout.css:14` 16rem; `navigation.css:26` footer 12rem; `patterns/patterns.css:4,23,28` 13rem/36rem/11rem/16rem; `patterns.css:15` sabit stroke-width. Dialog scrim fallback'i ham rgba kullanıyor.

Düzeltme: Görsel olarak değişmesi gereken ölçüleri semantik/component tokenlara taşı. Sıfır, yüzde tabanlı yapısal değerler ve visually-hidden gibi erişilebilirlik sabitlerini körlemesine tokenlaştırma; istisna listesini yaz. Preview toolbar'ın sabit stilleri ürün tasarımından ayrı tutulabilir.

### 5. Orta — İkon ve logo tokenları yanlış bağlanmış

Kanıt: `components/base.css:15` büyük ikonun yüksekliği `--logo-height-sm`; `:21` küçük logonun yüksekliği `--icon-size-lg`.

Etki: Logo ölçüsünü değiştirmek ikon oranlarını etkileyebilir; ikon değişimi küçük logoyu etkiler.

Düzeltme: İkon en/boyunu ikon tokenlarına, logo yüksekliğini logo tokenlarına bağla; bağımsız değişim testi ekle.

### 6. Orta — Doğrulayıcının kapsamı ve hata sınıflandırması yetersiz

`--check` iki uyarı veriyor: 36rem ve 11rem. Bunlar media query değil; `patterns.css:23,28` normal `min-width` değerleri. Regex her min-width'i media query sanıyor. Lint ham hex/primitive arıyor, rgba ve diğer sabit görsel değerleri kapsamıyor. Kontrast geçiş kararı yuvarlanmış oranla veriliyor; sınır altı bir değer yuvarlanarak geçebilir.

Düzeltme: Media query bağlamını doğru ayır, tanımsız CSS değişkenlerini ve gerekli ham değer sınıflarını kontrol et. Kontrast eşik kararını yuvarlamadan ver, yalnız rapor gösterimini yuvarla. Eksik alias, döngü, tema eksikliği ve üretilmiş dosya drift'i için negatif testler ekle.

### 7. Orta — Tabs ilk disabled öğeyi aktif seçebiliyor

Kanıt: `components/disclosure/Tabs.jsx:6,10,26`. İlk öğe disabled olduğunda bu öğe aktif, diğer etkin sekmeler tabIndex=-1 kalabiliyor. Aktif kayıt silinince fallback yok.

Düzeltme: İlk etkin kayda güvenli başlangıç ve controlled/uncontrolled seçim normalizasyonu; boş liste, tümü disabled, aktif öğenin silinmesi ve klavye testleri.

### 8. Orta — Eksik sürüm statüsü “güncel” sayılıyor

Kanıt: `components/patterns/product/ReleaseTag.jsx:5` varsayılan `status='current'`.

Düzeltme: Statü zorunlu veya güvenli `placeholder/unknown` olmalı. Doğrulanmış güncellik tasarım bileşeninin varsayımı olmamalı.

### 9. Orta — İçerik ve Next.js uyarlaması henüz tamamlanmış değil

- `ui_kits/website/ProductDetailScreen.jsx:23-29,53-60` editöryal metin ve Q&A JSX içinde. Genel UI etiketleri sözlükte kalabilir; ürün metinleri fixture katmanına alınmalı.
- Hook kullanan SiteHeader/Tabs/Dialog kaynaklarında client entry boundary tanımlı değil. Bunlar uygun client boundary altından kullanılabilir; README'nin doğrudan kopyalama önerisi tek başına yeterli değil.
- UI kit `window`, global ALU ve tarayıcı Babel/CDN kullanıyor. Bu bir prototip çalıştırma biçimi; Next.js sunucu bileşenlerine doğrudan taşınamaz.
- Font family tokenını değiştirmek yeni font dosyası/@font-face kaydını otomatik üretmiyor. Yeni font onboarding'i ile mevcut font seçimi ayrı belgelenmeli.

Düzeltme: İçerik/sunum/SEO sözleşmesini dokümante et; Next client/server girişlerini ve gerekli uyarlamayı açıkla. Şu anda Next.js uygulaması kurma veya schema üretme.

### 10. Orta — Font lisans metinleri ve kabul testleri eksik

`ASSET-LICENSES.md` font lisans metinlerinin dahil edilmediğini açıkça söylüyor. Paket içinde font OFL/LICENSE dosyası yok. Ekran okuyucu, gerçek cihaz, 320px reflow, forced-colors ve sistematik etkileşim kontrolleri yapılmamış. Kontrast token raporu bunların yerine geçmez.

Düzeltme: Kullanılan her fontun doğru copyright/lisans metnini ekle; ölçülmeyen testleri açık tut. Token değişimiyle metin/link/semantik yapı korunumu, 320/360px, büyütülmüş metin, klavye ve dialog için tekrarlanabilir kabul adımları oluştur.

## Düzeltme sırası ve kabul

1. Token build zinciri, yanlış token bağları ve validator düzeltmeleri.
2. Paket–sürüm–bölge demo sözleşmesi ve içerik ayrımı.
3. Tabs ve sürüm etiketi güvenli varsayımları; key değişimini koru.
4. Lisans dosyaları, sürüm manifesti ve tekrar üretilebilir kaynak paketi.
5. Logo kararı ayrı; görsel/mobil/klavye kabulü.

Yeni teslimatta kaynaklar ve `_ds_bundle.js` aynı sürümden yeniden üretilmeli. Manifest/CHANGELOG ve gerçek indirilebilir ZIP verilmeli. Yalnız doğrulanan testler başarılı sayılmalı. Projeye entegrasyon için ayrıca kullanıcı kararı gerekir.

## İnceleme sınırları

Kaynak okuma, paket eşliği, token build/check, bellekte token değişim deneyleri ve bir yerel katalog tema geçişi yapıldı. Tam Next build, tüm bileşen E2E, ekran okuyucu, tüm viewport matrisi ve Google schema testleri yapılmadı. Paket kaynakları değiştirilmedi; siteye entegrasyon yapılmadı.

## Claude düzeltme durumu — 21.10.2026

Claude Design sohbeti tarayıcıdan kontrol edildi. Son yanıt kullanım sınırına ulaşıldığını, işin kısmen tamamlandığını ve `Aluplan Design System-reviewed-v3.zip` dosyasının henüz oluşturulmadığını açıkça belirtiyor. Yeni paket indirilmedi; önceki yerel ZIP değiştirilmedi. Aşağıdakiler Claude beyanıdır, bağımsız kaynak/test doğrulaması değildir:

- Responsive CSS üretimi, görsel sabitlerin tokenlaştırılması, ikon/logo token bağları ve validator düzeltildi; token testleri sandbox JavaScript ortamında 28/28 olarak bildirildi. Node doğrulaması bekliyor.
- Paket × sürüm × bölge × yetenek modeli, kaynak/doğrulama alanları ve sentetik S1/S2 verileri eklendi; içerik testleri aynı ortamda 13/13 olarak bildirildi.
- Orijinal SVG'nin bayt bayt korunduğu, ayrı beyaz varyanta yalnız `.cls-1{fill:#FFFFFF}` kuralı eklendiği ve UI kit header/footer'ın bunu kullandığı bildirildi. Dosya karşılaştırması ve görsel doğrulama bekliyor; BrandLogo varsayılanı, kartlar ve katalog henüz güncellenmemiş.
- Font OFL metinleri eklendiği bildirildi.
- Tabs kenar durumları, ReleaseTag güvenli varsayılanı, kararlı kimlikler/client sınırları, editöryal JSX kopyalarının kaldırılması, tarayıcı testleri ve doküman/CHANGELOG güncellemeleri tamamlanmamış.

Yeni ZIP olmadığı için logo/token/içerik-schema ayrımı yeniden kabul edilmedi. Claude'un devam edip kaynak ve bundle tutarlılığını sağlayarak v3 ZIP'i üretmesinden sonra bağımsız yeniden inceleme yapılacak. Entegrasyon yapılmadı.
