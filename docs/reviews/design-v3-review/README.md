# V3 yeniden inceleme ve antrasit önizleme

22.10.2026 — Yalnız bağımsız yerel önizleme; Next.js entegrasyonu, canlı yayın ve marka onayı yok.

## Teslimat ve karar

Claude tamamladı; ilk ZIP eski bundle içerdiği için yenilemesi istendi. Yenilenen dosya proje köküne `Aluplan Design System-reviewed-v3-refreshed.zip` olarak indirildi. SHA-256 ve sonuçlar `verification.json` içinde. 268 ZIP girdisi; eski dosyanın üzerine yazılmadı.

**Ayrı önizleme için uygun, doğrudan üretim kabulü değil.** Yerel Node 24.18.0 üzerinde orijinal paketin içerik testleri 13/13, token testleri 27/28: `tokens/build/breakpoints.mjs` üreticinin beklediği export anahtarlarını içermiyor. `build-tokens.mjs --check` bu farkı doğru tespit ediyor. Önizleme kopyasında üretici çalıştırılarak mekanik drift giderildi; indirilen paket değiştirilmedi.

## Kullanıcı tercihi ve yapılan değişiklik

İlk istek yalnız Aluplan website (demo) ana BG rengiydi. Kullanıcı header/kartların da lacivert kaldığını belirterek kapsamı tüm koyu yüzeylere genişletti. Son durum: altı antrasit primitive, yalnız `aluplan/dark` içinde 19 alias değişikliği. Ana/marka zemin #181A1B; kart #202324; raised #272A2C; muted #303436; çizgiler #414749. Teal eylemler ve anlam taşıyan durum renkleri korundu. Açık ve field temaları aynı.

Kaynak kopya: `../design-v3-refreshed/Aluplan Design System/`.
Önizleme: `../../previews/anthracite-demo/` (yerel türetilmiş paket).
URL: http://127.0.0.1:8769/ui_kits/website/index.html?theme=aluplan&mode=dark#product

Tam değişiklik `anthracite-preview.patch` içinde. Yeniden üretim: ZIP'i ayrı klasöre aç, kökünde `git apply` ile bu patch'i uygula; `node scripts/build-tokens.mjs --check`, `node scripts/token-tests.mjs`, `node scripts/content-tests.mjs` çalıştır. HTTP sunucusunu paket kökünde başlat. Prototip React/Babel CDN kaynaklarına ihtiyaç duyar; çevrimdışı/Next.js uygulaması değildir. Yerel ZIP ve açılmış paketler Git'e eklenmedi; delta ve kanıtlar commit edildi.

## Logo

Paket içindeki uploads orijinali ve assets/logo/aluplan-logo-white.svg bayt eşit. Beyaz varyantta 33 path özniteliği/viewBox/geometri aynı; metadata hariç kök fill değişikliği var. Ancak kullanıcının Documents klasöründe bugün bulunan SVG ile paket orijinali bayt eşit değil: yerel dosyada beyaz stil var; paket kopyasında stil yok ve metadata var. Hangi aşamada farklılaştığı bilinmiyor. Bu nedenle “kullanıcının orijinali eksiksiz korundu” kabulü verilmedi. Önizlemede beyaz logo görünür; logo dosyaları değiştirilmedi.

## İçerik ve schema

Ürün ekranı editöryal veriyi content.pages, etiketleri UI, kapsamı selector üzerinden okuyor. İncelenen components/data/ui_kits kaynaklarında JSON-LD/schema.org/microdata üretimi bulunmadı. Önizlemedeki bütün veri, bileşen, UI kit, bundle ve logo dosyaları yenilenen paketle bayt eşit; yalnız 7 token/üretilmiş dosya farklı. Schema katmanı oluşturulmadı veya değiştirilmedi.

## Doğrulama ve sınırlar

- Önizleme build/check: geçti, 0 hata.
- Token testleri: 28/28; içerik: 13/13; kontrast: 188 kontrol, 0 başarısız.
- Ayrı kaynak incelemesi: kapsamla uyumlu, engelleyici bulgu yok.
- IAB tarayıcı önizlemesi açıldı; koyu ana zemin, header, logo ve görünen kartlar görsel kontrol edildi. Görsel: `../../previews/anthracite-demo-preview.png`.
- Claude'un bundle testi 10/10 beyanı bağımsız yerel tarayıcı test paketi sonucu değildir. Yerelde tüm klavye/dialog/mobile matrisi, ekran okuyucu, Next.js build ve tam erişilebilirlik kabulü yapılmadı. Token kontrast testleri bunların yerine geçmez.

Sonraki adım: kullanıcının antrasit palet görsel değerlendirmesi; entegrasyon ayrıca onay gerektirir.
