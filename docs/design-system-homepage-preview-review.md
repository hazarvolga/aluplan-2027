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

Önizleme, önceki antrasit tasarım sistemi kopyasının içinde yerel değerlendirme çıktısı olarak tutulur. Bu türetilmiş paket daha önce alınan kararla Git dışında kalır; bu kontrol kaydı ve devir durumu commit edilir.
