# Canlı ve yerel URL parite raporu

Tarih: 2026-10-19T21:22:05.812378+03:00

Canlıda gözlemlenen ve doğrulanan doğrudan 2xx yollar 2027 migration URL kümesidir. Canlı yönlendirme kaynakları ayrıca korunur. Yalnız yerelde bulunan hiçbir rota otomatik taşınmaz; kullanıcı incelemesine bırakılır.

## Kaynak durumu

- Kaynak Git HEAD: `d126e901b1f641b394a1725c50f031914da10307` (`main`).
- Kaynak çalışma ağacı giriş farkı: 1; Git dirty-state kontrolünde yalnız dosya yolları kaydedildi. Rota keşfi için route/sitemap/config kaynakları salt okunur incelendi.
- Yerel statik sayfa rotası: 99.
- Yerel dinamik rota şablonu: 1.
- Canlı sitemap yolu: 75.
- Canlı taranan benzersiz yol: 131.
- Gözlemlenen canlı doğrudan 2xx yolu: 116.
- Canlı HTML içerik sayfası: 113.
- Dinamik şablona eşlenen somut canlı URL: 14.

## Sonuçlar

| Sınıf | Sayı | 2027 kararı |
|---|---:|---|
| `both_live_valid` | 115 | Aynı URL ile uygula |
| `live_alias_200` | 1 | Canlı 200 alias; 301 değişikliği ayrıca onaylanmalı |
| `live_error_or_missing` | 4 | Doğrula |
| `redirect_to_valid_2xx` | 4 | Başarılı yönlendirme davranışını koru |
| `sitemap_only_stale` | 7 | Yeni sitemap'e alma; sorun kaydı olarak tut |

## Farklar

### Canlıda geçerli, birebir yerel sayfa/pattern eşleşmesi yok

- Yok.

### Canlıda 200 dönen rewrite alias

- `/solutions/imar-yonetmliği-bim-eklentisi` — HTTP 200; bağlantı kaynağı: /solutions/imar-yonetmliği-bim-eklentisi

### Yalnız yerelde aday

- Yok.

### Canlı sitemap'te eski/404 kayıt

- `/products/bimplus-signup` — HTTP 404
- `/products/partner-solutions` — HTTP 404
- `/products/sds2-detail` — HTTP 404
- `/products/sds2-load` — HTTP 404
- `/products/tim` — HTTP 404
- `/solutions/addon-channel` — HTTP 404
- `/solutions/bimplus` — HTTP 404; bağlantı kaynağı: /solutions

### Geçerli canlı yönlendirme kaynakları

- `/solutions/PlanliAlanlar` — HTTP 308 → HTTP 200 https://aluplan.com.tr/solutions/imar-yonetmeligi-bim-eklentisi
- `/solutions/addons/drive-curvev` — HTTP 308 → HTTP 200 https://aluplan.com.tr/solutions/addons/drive-curve
- `/solutions/extra-modules` — HTTP 308 → HTTP 200 https://aluplan.com.tr/solutions/addons
- `/solutions/industry` — HTTP 308 → HTTP 200 https://aluplan.com.tr/solutions/steel; bağlantı kaynağı: /solutions

### Hatalı hedefe yönlendiren kaynaklar

- Yok.

### Doğrulanamayan yönlendirme kaynakları

- Yok.

### Canlı hata veya eksik

- `/allplan-2021-features` — HTTP 404; bağlantı kaynağı: /solutions/oska
- `/allplan-2026nin-ozellikleri` — HTTP 404; bağlantı kaynağı: /solutions/allplan-bulut-hizmetleri
- `/solutions-v2` — HTTP 404; bağlantı kaynağı: /solutions-v2/addons, /solutions-v2/building-design, /solutions-v2/connect-license, /solutions-v2/connect-license/activation, /solutions-v2/connect-license/how-to-assign, /solutions-v2/connect-login, /solutions-v2/construction, /solutions-v2/faq, /solutions-v2/infrastructure, /solutions-v2/other, /solutions-v2/training, /solutions-v2/training/classroom, /solutions-v2/training/e-learning, /solutions-v2/training/events, /solutions-v2/training/individual, /solutions-v2/training/online, /solutions-v2/training/quick-start, /solutions-v2/training/video-library, /solutions-v2/training/video-library/addon-geometry, /solutions-v2/training/video-library/allplan-reinforcement, /solutions-v2/training/video-library/ax3000, /solutions-v2/training/video-library/bridge-workflow-2022, /solutions-v2/training/video-library/bridge-workflows, /solutions-v2/training/video-library/campus-de, /solutions-v2/training/video-library/campus-en, /solutions-v2/training/video-library/campus-tutorials-2019-2022, /solutions-v2/training/video-library/hello-allplan-2024, /solutions-v2/training/video-library/konut-insaati, /solutions-v2/training/video-library/otomatik-donati, /solutions-v2/training/video-library/quickstart-buildings, /solutions-v2/training/video-library/road-design, /solutions-v2/training/video-library/sds2-intro, /solutions-v2/training/webinar
- `/try-free` — HTTP 404; bağlantı kaynağı: /products/allplan-2026

## Ayrı tutulan rota yüzeyleri

- Dinamik rota şablonları somut canlı URL'lerle eşleştirilir; sınırsız slug üretilmez.
- API endpointleri GET ile denenmedi; form gönderimi yapılmadı.
- Catch-all resource rotaları sayfa URL'si sayılmadı.
- `public/` dosyalarının içerik/hash paritesi asset envanterinde yürütülür.
- Middleware iç rewrite desenleri 301 olarak sınıflandırılmaz.

## Sınırlar

Keşif; canlı sitemap, yerel App Router rotaları, kaynak yönlendirmeleri ve başarılı HTML sayfalardaki bağlantılarla sınırlıdır. En fazla 8 tur ve 400 yol taranır. Client-side üretilen yollar, form action hedefleri, script içindeki URL'ler ve sorgu varyantları bu sayıların dışında kalabilir. Bu nedenle rapor tek başına canlı URL yüzeyinin eksiksiz olduğunu kanıtlamaz.

Bu rapor HTTP ve dosya-rotası paritesidir; her sayfanın metin/medya/form içerik eşitliğini tek başına kanıtlamaz. İçerik paritesi Faz 0'ın ayrı kabul kapısıdır.
