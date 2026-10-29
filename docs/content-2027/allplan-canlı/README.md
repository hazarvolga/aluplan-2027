# Canlı site içerik envanteri (`allplan-canlı/`)

Üretici sitesinden (allplan.com) canlı sayfa içerik envanteri. Bu klasördeki
kayıtlar ekrandan okunan **birebir metinlerdir**: yazar notu veya düzeltme
içermez; TR kolonu yalnızca taslaktır.

## Yöntem

- Tarayıcı ile gerçek sayfa açılır (render edilmiş DOM), `display:none` /
  `visibility:hidden` / `aria-hidden` öğeleri atlanır.
- Metin blokları **görsel sıraya** (sayfa konumu y) dizilir; header menüsü
  ve footer kapsam dışıdır, içerik bandı en alt CTA'ya kadar alınır.
- CTA'lar için `href`, videolar için `<source src>`, görseller için
  `<img src>` kaynağı ayrıca kaydedilir.
- Çıkarım tarihi: **29.10.2026**.

## Dosyalar

| Dosya | Sayfa | URL |
|---|---|---|
| [`allplan-max.md`](allplan-max.md) | Allplan Max (canlı) | `https://www.allplan.com/allplan-max/` |

## Kapsam dışı

- Header mega menü ve footer (Home / About ALLPLAN / sosyal ikonlar / yasal
  bağlantılar / © ALLPLAN Deutschland GmbH / Nemetschek notu): site genel
  kalıp, ürün içeriği değil. İstenirse ayrı dosyada toplanır.
- Cookie banner ve "View video"/"Request Demo" düğmelerinin modal davranışı
  (envanterde ayrı tutulur).

## Bu klasörün kuralları

Canlı içerik envanteri Aşama C envanteriyle aynı ilkeleri izler: EN birebir,
TR taslak, satır başına tek metin alanı. Kaynak dosya yerine **canlı URL**
gösterilir ve sayfa konumu (y) bilgisi içerir.
