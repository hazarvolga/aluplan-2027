# HTML tasarım örneği — 01

19.10.2026: Kullanıcının “html bir örnek tasarım göster” isteğiyle hazırlanmış bağımsız görsel önizleme. Faz 0 sürerken yalnız örnek üretimine verilen izin; PRD/design system veya ana sayfa kabulü değildir. Tam içerik paritesi iddiası yok; seçilmiş ana sayfa bölümleri gösterilir.

- Açılış: `index.html` veya `http://127.0.0.1:8767/`.
- Sunucu: proje kökünde `python3 -m http.server 8767 --bind 127.0.0.1 --directory docs/previews`.
- Tema ve rol değişimi tarayıcıda doğrulandı. Mobil CSS mevcut; tam cihaz/E2E kabulü yapılmadı.
- Bağlantılar mevcut canlı hedeflere gider. Form gönderimi, izleme, backend yok.
- `assets/hero-bg.jpg`, logo SVG'leri ve üç çözüm görseli yalnız `../aluplan-2026/assets/` kaynağından kopyalandı. Kaynak değişmedi. Üretici varlıklarının lisans/izin kontrolü açık; bu örnek kamuya yayınlanmadı.
- Manrope 700 ve IBM Plex Sans 400/600 Google Fonts'tan indirilip yerel sunuluyor; OFL metinleri assets içinde. Tarayıcı font CDN'ine bağlanmaz. Bu örnekte TTF kullanıldı; üretim WOFF2/latin-ext optimizasyonu sonraki onaylı fazın işidir.
- `preview.png`: kontrol edilen masaüstü görünümü.
- Mevcut logo aynen kullanıldı. Teal/Ink taslak yönü ve yeni fontlar henüz onaylanmış marka kararı değildir.

## Özel sunucu kökü kullanan önizlemeler

- `hero-family-contact-sheet/` canonical web türevlerini `public/` altından tekrar
  kullanır. Bu önizleme `docs/previews` köküyle değil, proje kökünde
  `python3 -m http.server 8772 --bind 127.0.0.1` komutuyla açılır. Ayrıntılı URL
  ve gerekçe alt klasördeki `README.md` dosyasındadır.
