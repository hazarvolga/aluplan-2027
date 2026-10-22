# Tasarım sistemi ana sayfa kesiti — kontrol kaydı

22.10.2026 — Kullanıcının devam talebiyle, geçici kabul edilen yerleşimin ilk tasarım kesiti gerçek Aluplan Design System bileşenleriyle ayrı yerel önizlemede hazırlandı. Next.js entegrasyonu, nihai ana sayfa veya yayın değildir.

## Kapsam

- Yerel önizleme: `docs/previews/anthracite-demo/ui_kits/homepage/`
- Gösterilen alanlar: header temsili, hero, beş hızlı erişim, üç rol, altı ürün, beş çözüm, 20 hizmet/kaynak ve footer.
- Kullanılan paket bileşenleri: `SiteHeader`, `CtaGroup`, `RoleSelector`, `ProductCard`, `SupportCard`, `SiteFooter` ve temel layout/typography bileşenleri.
- Görsel temel: daha önce kullanıcı tarafından uygun bulunan antrasit önizleme tokenları.

## Doğrulama

- Tarayıcıda Mühendis rolü seçildi; açıklama, özellikler ve ilgili ürün vurgusu değişti.
- Altı ürün rol değişiminden sonra erişilebilir kaldı.
- 20 hizmet/kaynak DOM içinde mevcut; Eğitim, Teams ve Destek Platformu ilk görünümde.
- Tarayıcı console error kaydı boş.
- Bağımsız code review kritik veya yüksek öncelikli sorun bulmadı.
- Harici bağlantılar yeni sekme/`noopener noreferrer` davranışını tasarım sistemi bileşeninden alıyor.
- Form gönderimi, API/backend, izleme veya JSON-LD yok.

Bu kontroller tam mobil, ekran okuyucu, performans, Next.js build veya içerik paritesi kabulü değildir. Header'ın mega menü, arama ve tema kontrolü bu kesitte bulunmuyor ve görünür şeritte açıklanıyor. Hero video alanı temsilidir.

## Üretime taşınacak not

Önizlemedeki hizmet bulma işlemi görünen başlığa dayanıyor. Üretim uyarlamasında başlık değişikliğinin sayfayı düşürmemesi için hizmetler kararlı `id` ile bulunmalı ve eksik kayıt açık hata durumuyla gösterilmelidir. Demo React/Babel/CDN yapısı Next.js'e kopyalanmaz.

## 22.10.2026 — Header CTA kararı

Kullanıcı `Teklif İste` etiketini kabul etti ve teklif/deneme eylemleri hero'da bulunduğu için header'dan kaldırılmasını istedi. Önizlemede header yalnız gezinme taşır; hero'da `Teklif İste` birincil ve `Ücretsiz Deneme` ikincil eylem olarak kalır. Bu karar mevcut canlı siteyi veya Next.js uygulamasını değiştirmez.

## 22.10.2026 — Kart geometrisi ve yoğunluk normalizasyonu

Kullanıcı kararıyla ana sayfa önizlemesindeki kart ve panel yüzeyleri keskin köşeli, ince çizgili teknik dile döndürüldü. Bu son yön, önceki 6/8 px ara önerisini geçersiz kılar: `aluplan` tema katmanında `radius.surface = 0`; buton/kontrol radius'u ve pill rozet anatomisi ayrı kalır.

- Küçük özellik kartı: 16 px iç boşluk.
- Standart ürün/çözüm/hizmet kartı: 24 px iç boşluk.
- Büyük rol anlatısı ve hero medya paneli: 32 px iç boşluk.
- Dar görünümde kart/panel yoğunluğu 16 px'e iner.
- Ürün kartı sarmalayıcıları aynı satırda eşit yüksekliğe bağlandı.

Değerler önizleme CSS'inde primitive tokenlarla sabitlenmedi; `tokens/tokens.json` içindeki `aluplan` semantic tema override'larından üretilir. `build-tokens --check`, token testleri 28/28, içerik testleri 13/13 ve 188 kontrast kontrolü geçti. Masaüstü tarayıcı ölçümü standart kartlarda `radius: 0px / padding: 24px`, özellik kartlarında `0px / 16px`, büyük panelde `0px / 32px`; ilk ürün satırında üç kart da 228 px olarak doğrulandı. İçerik, URL, schema, form ve Next.js katmanları değiştirilmedi.

Görsel kanıt: `docs/previews/anthracite-homepage-cards-normalized.png`.

Önizleme, önceki antrasit tasarım sistemi kopyasının içinde yerel değerlendirme çıktısı olarak tutulur. Bu türetilmiş paket daha önce alınan kararla Git dışında kalır; bu kontrol kaydı ve devir durumu commit edilir.
