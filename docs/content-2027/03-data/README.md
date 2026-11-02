# Makine okunur içerik kayıtları (Aşama D)

`content-records.json`, Aşama C envanterinin makine okunur katmanıdır:
**394 kayıt**, her biri sayfada tek bir metin alanına karşılık gelir.

Üretim: `python3 scripts/build_content_records.py` (deterministik;
`--check` mevcut dosyanın bayt-eşliğini doğrular).

## Kayıt sözleşmesi

| Alan | Anlamı |
|---|---|
| `id` | Kaynağı eşsiz kimliği (ör. `sds2.features.feature-1.body`) |
| `page`, `role`, `roleLabel` | Sayfa kimliği ve rol (TR etiketi) |
| `sourceFile` | Kaynak `.docx` dosyasının yolu |
| `sourceLocator` | `belge-slug#bN[@part]` biçiminde blok adresi |
| `sourceHash` | Kaynak belgenin SHA-256 değeri (bayatlama izleme) |
| `bodyEn` | EN metin, kaynaktan birebir kopyalanır — elle yazılmaz |
| `bodyTr` | Türkçe çeviri **taslağı**; onaylanmış yayın metni değildir |
| `trStatus` | `draft` = editör onayı bekliyor |
| `note` | Sense özel not (yayın izni, kaynak hatası vb.) |

## Tüketim kuralları

1. Herhangi bir fiyat/yayın akışı `bodyEn`'i **değiştirmemelidir**;
   kaynak değişiminde `sourceHash` bayatlanır ve üretim yeniden yapılır.
2. TR metnine yalnız `bodyTr` alanında, taslak işaretini kaldırmadan
   düzenleme yapılır; onay sonrası `trStatus` → `approved` olur.
3. Yayımlama, `source-coverage.md`'deki kapsam kurallarıyla uyumlu;
   PDF/cheat sheet kaynakları bu katmana girmez.
