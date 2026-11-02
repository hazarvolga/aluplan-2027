# Kök klasör envanteri

Bu dosya `scripts/build_content_inventory.py` tarafından üretilir.
Elle düzenlenmez; kaynak ağacı değiştiğinde betik yeniden çalıştırılır.

Toplam taranan dosya: **3965**
Toplam boyut: **8.3 GB**

## Klasör özeti

| Klasör | Dosya | Boyut | İçerik belgesi | Görsel | Video | Kod | Rol |
|---|---|---|---|---|---|---|---|
| `(root file)` | 10 | 2.0 MB | 0 | 0 | 0 | 2 | Kök seviye yapılandırma ve devir dosyaları |
| `.github` | 1 | 1.3 KB | 0 | 0 | 0 | 0 | CI yapılandırması |
| `.superpowers` | 3 | 1.5 KB | 0 | 0 | 0 | 0 | Ajan oturum kayıtları |
| `Allplan 2027 Marketing Materials` | 916 | 8.0 GB | 232 | 496 | 174 | 0 | 2027 lansman paketi — yeni web içeriğinin birincil kaynağı |
| `Aluplan Design System` | 238 | 1.7 MB | 0 | 34 | 0 | 133 | ZIP'ten açılmış ikinci kopya — otorite değil |
| `architectural-sheet-concept` | 37 | 516.0 KB | 0 | 2 | 0 | 16 | Ayrı konsept prototip (referans) |
| `design-system` | 222 | 3.0 MB | 0 | 39 | 0 | 114 | Onaylı tasarım sistemi (token, bileşen, test) |
| `docs` | 1076 | 37.3 MB | 2 | 138 | 0 | 577 | Mevcut site metinleri, PRD/IA, tasarım ve doğrulama kayıtları |
| `public` | 1375 | 206.0 MB | 11 | 1331 | 10 | 0 | Yayımlanan medya ve dokümanlar |
| `scripts` | 13 | 374.3 KB | 0 | 0 | 0 | 13 | Veri üretim ve doğrulama hattı |
| `src` | 51 | 2.8 MB | 0 | 0 | 0 | 44 | Uygulama kaynağı ve üretilmiş site verisi |
| `tests` | 23 | 154.3 KB | 0 | 0 | 0 | 22 | Parite ve sözleşme testleri |

## Dosya türü dağılımı

| Uzantı | Adet | Boyut | Tür |
|---|---|---|---|
| `.jpg` | 812 | 181.3 MB | image |
| `.png` | 689 | 256.5 MB | image |
| `.webp` | 309 | 30.4 MB | image |
| `.md` | 276 | 1.9 MB | documentation |
| `.svg` | 211 | 1.9 MB | image |
| `.tsx` | 194 | 1.4 MB | code |
| `.jsx` | 187 | 394.4 KB | code |
| `.ts` | 180 | 166.0 KB | code |
| `.html` | 179 | 716.6 KB | markup |
| `.mp4` | 166 | 4.5 GB | video |
| `.pptx` | 138 | 2.0 GB | presentation |
| `.json` | 118 | 23.3 MB | data |
| `.woff2` | 100 | 3.2 MB | font |
| `.css` | 99 | 1.1 MB | design-source |
| `.docx` | 84 | 14.0 MB | content-document |
| `.txt` | 43 | 273.7 KB | text |
| `.py` | 33 | 525.9 KB | code |
| `.mjs` | 31 | 211.3 KB | code |
| `.gif` | 18 | 929.7 MB | animation |
| `.js` | 18 | 785.6 KB | code |
| `.pdf` | 18 | 43.8 MB | pdf |
| `.url` | 14 | 3.8 KB | external-link |
| `(uzantısız)` | 10 | 5.9 KB | other |
| `.psd` | 10 | 330.2 MB | image-source |
| `.jpeg` | 8 | 190.9 KB | image |
| `.csv` | 5 | 1.1 MB | data |
| `.xlsx` | 5 | 107.2 KB | spreadsheet |
| `.ttf` | 3 | 493.6 KB | font |
| `.yaml` | 2 | 38.1 KB | config |
| `.ico` | 1 | 19.9 KB | image |
| `.log` | 1 | 6.7 KB | other |
| `.patch` | 1 | 1.5 MB | other |
| `.yml` | 1 | 1.3 KB | config |
| `.zip` | 1 | 1.8 MB | archive |

## Pazarlama paketi — ürün kırılımı

| Ürün | Dosya | Boyut | docx | pptx | xlsx | pdf | görsel | video/gif |
|---|---|---|---|---|---|---|---|---|
| allplan | 256 | 1.1 GB | 19 | 31 | 1 | 0 | 138 | 64 |
| allplan-civil | 78 | 323.3 MB | 15 | 24 | 0 | 1 | 29 | 7 |
| allplan-max | 106 | 2.9 GB | 12 | 11 | 2 | 1 | 45 | 32 |
| frilo | 147 | 218.9 MB | 11 | 12 | 1 | 1 | 116 | 4 |
| scia | 203 | 2.5 GB | 13 | 38 | 1 | 1 | 114 | 34 |
| sds2 | 126 | 1.0 GB | 12 | 21 | 0 | 4 | 54 | 33 |

## Dil dağılımı

| Dil | Dosya |
|---|---|
| `und` | 3722 |
| `en` | 82 |
| `de` | 42 |
| `cs` | 31 |
| `fr` | 26 |
| `it` | 26 |
| `es` | 25 |
| `nl` | 9 |
| `sk` | 2 |

`und` = dosya adında dil işareti yok: görsel, video, kod ve Türkçe süreç
belgeleri. Pazarlama paketinde işaretsiz **içerik belgeleri** İngilizce
kaynak metin sayılır ve `en` olarak işaretlenir.

## Otorite dağılımı

| Durum | Dosya |
|---|---|
| `source-authoritative` | 2543 |
| `process-record` | 1076 |
| `superseded-copy` | 238 |
| `duplicate-candidate` | 40 |
| `concept-prototype` | 37 |
| `external-link-missing` | 14 |
| `template` | 5 |
| `draft-not-final` | 4 |
| `archive-raw` | 3 |
| `internal-only` | 3 |
| `pii-restricted` | 2 |
