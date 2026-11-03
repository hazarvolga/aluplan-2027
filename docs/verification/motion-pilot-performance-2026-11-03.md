# Hareket pilotu — yerel üretim karşılaştırması

Tarih: 03.11.2026. Durum: laboratuvar incelemesi; saha ölçümü veya gerçek mobil cihaz testi değildir.

## Yöntem

Aynı mevcut yerel kaynakların iki ayrı kopyası üretim modunda derlendi (`ALUPLAN_SHOW_2027=1`, `ALUPLAN_BLOCK_INDEXING=1`). Önceki kopyada yalnız hero/kart hareket pilotu çıkarıldı; sonraki kopya mevcut pilotu içerdi. İkisi aynı yerel varlıkları sundu. Tarayıcıda önbellek kapalı, 355 CSS px görünüm genişliğinde, localhost üzerinden dönüşümlü üçer yükleme yapıldı. LCP ve yükleme sırasındaki CLS PerformanceObserver ile, JS aktarımı script kaynaklarının transferSize toplamıyla alındı. Gözlem yükleme sonrasında yaklaşık 1,2 saniyeyle sınırlıdır.

## Sonuçlar

| Sayfa | Ölçüm | Pilot öncesi | Pilot sonrası |
| --- | --- | --- | --- |
| Ana sayfa | LCP, medyan | 100 ms | 108 ms |
| Ana sayfa | CLS, üç ölçümün aralığı | 0,00013–0,00013 | 0,00002–0,00013 |
| Ana sayfa | JS aktarımı | 219.698 bayt | 220.074 bayt |
| Ürünler | LCP, medyan | 92 ms | 96 ms |
| Ürünler | CLS, üç ölçümün aralığı | 0–0,00039 | 0–0,00039 |
| Ürünler | JS aktarımı | 227.778 bayt | 228.155 bayt |

Tekil LCP değerleri: ana sayfa öncesi 172/100/100 ms, sonrası 92/108/108 ms; ürünler öncesi 124/92/68 ms, sonrası 96/92/124 ms. Değişkenlik farkların yorumlanmasını sınırlar. Aktarım farkı sırasıyla 376 ve 377 bayt; yalnız script kaynaklarını kapsar.

## Sınırlar ve karar

- Localhost, bu bilgisayar ve üç tekrar; yavaş ağ, CPU kısıtı ve gerçek mobil cihazı temsil etmez. Bu verilerle saha LCP/CLS hedefinin karşılandığı veya performans regresyonunun olmadığı söylenemez.
- INP gerçek kullanıcı etkileşimiyle ölçülmedi. Gözlem süresi tüm olası sonraki kaymaları kapsamaz. Ürün kartı giriş hareketi sayfa aşağısında tetiklendiğinden yukarıdaki yükleme LCP'si kart animasyonunu performans açısından ayrı ölçmez.
- Bu sınırlı deneyde belirgin ek yük görülmedi; hero hareketinin ve kart etkileşiminin düşük güçlü cihazda ayrıca ölçülmesi ve görsel kabul gerekir. Site genelinde sayfa geçişi bu ölçümle onaylanmış değildir.

## Yavaş mobil ağ ve işlemci benzetimi — 03.11.2026

Kullanıcının isteğiyle yeni hero ve ilk kartın dekoratif giriş efektleri 768 CSS px altında kapatıldı. Önceden mevcut diğer animasyonlar bu değişikliğin kapsamında değil. Güncel pilotlu ve pilotsuz iki üretim derlemesi, aynı tarayıcıda 355 CSS px, 4× CPU yavaşlatma, 150 ms gecikme, yaklaşık 1,6 Mbit/sn indirme ve önbellek kapalı koşullarda ikişer kez dönüşümlü yüklendi. Sayfanın load olayı beklendikten sonra buffered PerformanceObserver sonuçları alındı; yerel bağlantının ve benzetimin gerçek mobil cihaz/şebeke olmadığı unutulmamalıdır.

| Sayfa | LCP öncesi (ms) | LCP sonrası (ms) | CLS öncesi → sonrası | JS aktarımı öncesi → sonrası |
| --- | --- | --- | --- | --- |
| Ana sayfa | 7.100 / 7.864 | 7.112 / 7.112 | 0,000016 → 0,000016 | 219.698 → 220.112 bayt |
| Ürünler | 2.576 / 2.628 | 2.548 / 2.608 | 0,000286 → 0,000286 | 227.778 → 228.193 bayt |

Ana sayfadaki LCP adayı hero görseliydi; 268.054 baytlık görsel bu koşullarda yaklaşık 6,8–7,6 saniyede tamamlandı. Ağ koşulları ve diğer kaynaklarla rekabet etkili olabilir; bu ölçüm tek başına kök nedeni kanıtlamaz. İki tekrar regresyon yokluğunu ispatlamaz. INP ve gerçek cihaz performansı ölçülmedi. Tarayıcıda 355 px'de hero ve kart animasyonu `none`, 773 px'de hero animasyonu etkin; mobilde yatay taşma yoktu.

Karar: genel sayfa geçişi henüz eklenmez. Önce ana sayfanın LCP yükleme yolu ve görsel önceliği incelenip iyileştirme ayrı değerlendirilmelidir; ardından sayfa geçişi küçük bir denemeyle karşılaştırılabilir.

## Hero yükleme iyileştirmesi — 03.11.2026

Yavaş mobil benzetimde istek zaman çizelgesi, hero ile birlikte sayfanın daha aşağısındaki ürün sekmesi görseli (382.510 bayt), rol görseli (264.356 bayt) ve FlexSoft logosunun (206.325 bayt) otomatik ön yüklemeyle aynı anda yüklendiğini gösterdi. Hero yüksek fetch önceliğine rağmen bu kaynaklarla bant genişliğini paylaşıyordu. Yalnız üç alt bölüm görselini lazy yapma denemesinde LCP 7.860 → 5.492 ms oldu (ikişer ölçüm); bu, rekabetin bu koşullarda önemli bir etken olduğunu destekler, tüm ortamlarda tek neden olduğunu kanıtlamaz.

Son değişiklikte aynı 1774×887 hero JPEG'den (268.054 bayt) tam çözünürlüklü WebP (105.794 bayt) üretildi; JPEG `<picture>` geri dönüşü olarak korundu. Üç alt bölüm görseli lazy yüklendi; logo için 512×512 doğal ölçüler belirtildi. İki ayrı üretim derlemesi; 355 CSS px, 4× CPU, 150 ms gecikme, yaklaşık 1,6 Mbit/sn, önbellek kapalı, yükleme tamamlandıktan sonra buffered PerformanceObserver ile üçer kez dönüşümlü ölçüldü:

| Ölçüm | Önce | Sonra |
| --- | --- | --- |
| LCP (ms) | 7.836 / 7.852 / 7.844 | 3.036 / 3.048 / 3.040 |
| Medyan LCP | 7.844 ms | 3.040 ms |
| CLS | 0,000016 her ölçümde | 0,000016 her ölçümde |
| Hero aktarımı | 268.054 bayt | 105.794 bayt |
| Script aktarımı | 220.115 bayt | 220.167 bayt |

Bu sonuç yerel ağ/CPU benzetimidir; gerçek mobil saha verisi değildir ve sonrasındaki 3,04 saniye bile proje LCP hedefinin altına indiği anlamına gelmez. INP ölçülmedi. Mobil ve masaüstü hero görüntüsü ve normal bağlantıda Civil ürün sekmesi ile mühendis rolü görselleri kontrol edildi; WebP `currentSrc` ve JPEG fallback niteliği doğrulandı, WebP desteklemeyen gerçek tarayıcıda fallback ayrıca test edilmedi. Gerçek cihaz, yavaş bağlantıda sekme geçişleri ve uzun gezinmede CLS ayrıca değerlendirilmelidir.

## SCIA ve Eklentiler — site genelinde örneklem

SCIA'nın ilk ekrandan uzaktaki yetenek ve proje görselleri eager ön yükleniyordu (58.939 ve 127.875 bayt); bunlar lazy yapıldı, 1536×864 boyutları korundu. 355 CSS px / 4× CPU / 150 ms / yaklaşık 1,6 Mbit/sn, önbellek kapalı, iki ayrı üretim derlemesinde üçer dönüşümlü yükleme: önce LCP 6.080 / 6.072 / 6.076 ms, sonra 4.764 / 4.744 / 4.780 ms; CLS tüm örneklerde 0. Hero CSS arka planı LCP adayıydı. Normal bağlantıda mobil akordeon ve sonraki proje görselleri yüklendi; yavaş ağda hızlı seçim ayrıca doğrulanmadı. Bu sonuç yalnız SCIA için laboratuvar kanıtıdır.

Eklentiler sayfasının bir üretim denemesinde, aynı benzetimde ortak Next.js görsel optimizasyonundan gelen 108.510 baytlık hero LCP adayıydı; LCP 3.128 ms, CLS 0,000286. Tek ölçüm olup saha verisi değildir. Ortak alt sayfa hero'ları zaten duyarlı ve öncelikli olduğundan tüm sayfalarda tek tip lazy/WebP dönüşümü uygulanmadı.

## Ortak sayfa giriş işareti — 03.11.2026

Kullanıcı onaylı, CSS ile uygulanan dekoratif çizgi ve kare tüm sayfa kabuğuna eklendi. Aynı koşullarda, `/solutions-v2/addons` için iki üretim derlemesi ve ikişer dönüşümlü mobil yükleme: LCP önce 3.108/3.116 ms, sonra 3.144/3.132 ms; CLS her ölçümde 0,000286; script aktarımı 220.172 → 220.329 bayt. 355 CSS px, 4× CPU, 150 ms ve yaklaşık 1,6 Mbit/sn benzetimi, önbellek kapalı. Ölçümden sonra işaretin header altında görünürlüğü için CSS konumu 2 px ayarlandı; bu son görsel düzeltme ayrıca performans ölçümünden geçirilmedi. Mobilde dekoratif işaret görünmez; bu küçük örnek farkların anlamlılığını veya gerçek mobil performansını kanıtlamaz. INP ölçülmedi.

Üretim sunucusunda `pages.json` içindeki 102 doğrudan 200 rotanın tamamında işaretin sunucu HTML'sinde bulunduğu doğrulandı. Masaüstünde Eklentiler ve Kaynaklar, mobilde Kaynaklar, reduced-motion, JS kapalı içerik, istemciyle rota değiştirme ve aynı sayfa hash bağlantısı kontrol edildi. Tüm rotalar ayrı ayrı görsel incelenmedi.
