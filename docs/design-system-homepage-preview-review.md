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

## 22.10.2026 — H05, H07 ve H08 tamamlaması

Kullanıcının keskin kart dilini kabul etmesinin ardından kalan üç kaynak bloğu aynı ayrı önizlemeye eklendi:

- H05 `TEKNİK ÖZELLİKLER`: altı paket kartı ve bölüm eylemi mevcut `V2026_paket-karsilastirma-Q3-2026_R01.pdf` hedefine gider; fiyat veya yeni paket hakkı eklenmez.
- H07 BIMFlex: FlexSoft tarafından geliştirilen çözüm ve Aluplan satış ortaklığı olarak gösterilir. Kaynaktaki koşullu `sunulabilecektir` anlatımı ve dört özgün medya varlığı korunur. ALLPLAN ürünü/paketi gibi sınıflandırılmaz.
- H08 `ALLPLAN 2026 Yenilikleri`: üç kaynak kart ve mevcut `/products` hedefi korunur. 2026 etiketi kaynak sürümüdür; `current` statüsü atanmaz.

İçerik kayıtları `docs/previews/homepage-wireframe/data.js`, görünüm `HomepagePreview.jsx` ve `preview.css` içindedir. Form, JSON-LD/schema, Next.js ve canlı site değiştirilmedi. `saatlerden saniyelere` ifadesi kaynak iddiası olarak aynen kaldı; yayın öncesi kanıt gerektirir. `/products` hedefinin yenilik CTA'sıyla zayıf eşleşmesi önceki URL karar listesinde kalır.

Doğrulama: homepage sözleşmesi 9/9, token 28/28, içerik 13/13, kontrast 188/188. Tarayıcıda yedi PDF bağlantısı tek hedefte, dört BIMFlex görseli yüklenmiş, üç yenilik kartı görünür, tek `h1`, kart radius'u `0px` ve 390 px görünümde yatay taşma `0` olarak ölçüldü. Konsolda hata yok; yalnız React/Babel geliştirme önizlemesinin beklenen bilgi/uyarıları var. Bağımsız code review ilk turda tanımsız spacing tokenını yüksek öncelikli buldu; `--space-stack-xl` ile düzeltildi, CSS token sözleşmesi testine eklendi ve ikinci incelemede engel kapandı.

Görsel kanıt: `docs/previews/anthracite-homepage-complete.png`. Türetilmiş paket Git dışında kalır; içerik veri dosyası, ikili varlıkları da taşıyan yeniden üretilebilir patch, doğrulama kaydı, bu rapor ve görsel kanıt commit kapsamındadır.
