# Mükerrer ve varyant analizi

Bu dosya `scripts/build_content_inventory.py` tarafından üretilir.

## 1. Birebir aynı içerik belgeleri (SHA-256)

Toplam 5 hash grubu, 15 dosya.
Bunlar aynı belgenin kopyalarıdır; biri kaynak, diğerleri tekrar sayılır.

| # | Dosya sayısı | Boyut | Yollar |
|---|---|---|---|
| 1 | 4 | 69.1 KB | `Allplan 2027 Marketing Materials/FRILO 2027 Launch - Product Marketing Materials/Messaging/Product Launch Messaging Brief - FRILO 2027 - Czech.docx`<br>`Allplan 2027 Marketing Materials/FRILO 2027 Launch - Product Marketing Materials/Messaging/Product Launch Messaging Brief - FRILO 2027 - French.docx`<br>`Allplan 2027 Marketing Materials/FRILO 2027 Launch - Product Marketing Materials/Messaging/Product Launch Messaging Brief - FRILO 2027 - Italian.docx`<br>`Allplan 2027 Marketing Materials/FRILO 2027 Launch - Product Marketing Materials/Messaging/Product Launch Messaging Brief - FRILO 2027 - Spanish.docx` |
| 2 | 4 | 51.4 KB | `Allplan 2027 Marketing Materials/FRILO 2027 Launch - Product Marketing Materials/Messaging/Product Messaging Brief - FRILO - Czech.docx`<br>`Allplan 2027 Marketing Materials/FRILO 2027 Launch - Product Marketing Materials/Messaging/Product Messaging Brief - FRILO - French.docx`<br>`Allplan 2027 Marketing Materials/FRILO 2027 Launch - Product Marketing Materials/Messaging/Product Messaging Brief - FRILO - Italian.docx`<br>`Allplan 2027 Marketing Materials/FRILO 2027 Launch - Product Marketing Materials/Messaging/Product Messaging Brief - FRILO - Spanish.docx` |
| 3 | 3 | 45.2 KB | `Allplan 2027 Marketing Materials/SDS2 2027 Launch - Product Marketing Materials/Messaging/Product Messaging Brief - SDS2 - French.docx`<br>`Allplan 2027 Marketing Materials/SDS2 2027 Launch - Product Marketing Materials/Messaging/Product Messaging Brief - SDS2 - German.docx`<br>`Allplan 2027 Marketing Materials/SDS2 2027 Launch - Product Marketing Materials/Messaging/Product Messaging Brief - SDS2 - Spanish.docx` |
| 4 | 2 | 68.8 KB | `Allplan 2027 Marketing Materials/SCIA 2027 Launch - Product Marketing Materials/Messaging/Product Messaging Brief - SCIA - German.docx`<br>`Allplan 2027 Marketing Materials/SCIA 2027 Launch - Product Marketing Materials/Messaging/Product Messaging Brief - SCIA - Italian.docx` |
| 5 | 2 | 270.2 KB | `public/docs/V2026_paket-karsilastirma-Q3-2026_R01.pdf`<br>`public/docs/V2026_paket-karsilastirme-Q3-2026_R01.pdf` |

### Çevrilmemiş dil varyantları

Aynı bayt içeriği taşıdığı hâlde dosya adında farklı dil etiketi olan
belgeler. Bunlar **çevrilmemiştir**; yalnızca adı değiştirilmiştir.
Site metni üretilirken bu dillerde kaynak yok sayılmalıdır.

| Dosya sayısı | Diller | Dosyalar |
|---|---|---|
| 4 | cs, es, fr, it | `Product Launch Messaging Brief - FRILO 2027 - Czech.docx`<br>`Product Launch Messaging Brief - FRILO 2027 - French.docx`<br>`Product Launch Messaging Brief - FRILO 2027 - Italian.docx`<br>`Product Launch Messaging Brief - FRILO 2027 - Spanish.docx` |
| 4 | cs, es, fr, it | `Product Messaging Brief - FRILO - Czech.docx`<br>`Product Messaging Brief - FRILO - French.docx`<br>`Product Messaging Brief - FRILO - Italian.docx`<br>`Product Messaging Brief - FRILO - Spanish.docx` |
| 2 | de, it | `Product Messaging Brief - SCIA - German.docx`<br>`Product Messaging Brief - SCIA - Italian.docx` |
| 3 | de, es, fr | `Product Messaging Brief - SDS2 - French.docx`<br>`Product Messaging Brief - SDS2 - German.docx`<br>`Product Messaging Brief - SDS2 - Spanish.docx` |

## 2. Varlık mükerrerleri — klasör kümeleri

Toplam 582 hash grubu, 2053 dosya.
`Fazla` kolonu, tekrar eden kopyaların kapladığı gereksiz alandır.

| Klasörler | Grup | Dosya | Fazla |
|---|---|---|---|
| `Allplan 2027 Marketing Materials` | 102 | 218 | 320.5 MB |
| `public` | 229 | 576 | 23.5 MB |
| `Aluplan Design System` ↔ `design-system` ↔ `docs` ↔ `public` | 44 | 292 | 3.9 MB |
| `docs` ↔ `public` | 6 | 16 | 3.8 MB |
| `design-system` ↔ `docs` ↔ `public` | 5 | 20 | 3.4 MB |
| `Aluplan Design System` ↔ `design-system` ↔ `docs` | 140 | 697 | 1.4 MB |
| `Aluplan Design System` ↔ `docs` | 38 | 143 | 1.0 MB |
| `Aluplan Design System` ↔ `architectural-sheet-concept` ↔ `design-system` ↔ `docs` ↔ `public` | 7 | 57 | 551.0 KB |
| `design-system` ↔ `docs` | 5 | 10 | 145.6 KB |
| `Aluplan Design System` ↔ `architectural-sheet-concept` ↔ `docs` | 3 | 15 | 89.7 KB |
| `(root file)` ↔ `architectural-sheet-concept` | 1 | 2 | 19.0 KB |
| `docs` | 1 | 5 | 400 B |
| `architectural-sheet-concept` ↔ `docs` | 1 | 2 | 261 B |

## 3. Dil / sürüm varyantı grupları

Aynı kaynak belgenin dil veya sürüm kopyaları. Gruplama dosya adındaki
dil ve sürüm işaretleri temizlenerek yapılır; içerik doğrulaması Aşama B'de.

Toplam 39 grup, 190 dosya.

| # | Ürün | Ortak ad | Kopya | Diller |
|---|---|---|---|---|
| 1 | scia | `scia 2027 whats presentation` | 8 | cs, de, en, es, fr, nl |
| 2 | scia | `scia sales presentation` | 8 | cs, de, en, es, fr, nl |
| 3 | allplan-max | `allplan max sales presentation` | 7 | cs, de, en, es, fr, it, sk |
| 4 | allplan | `edition comparison allplan 2027` | 7 | cs, de, en, es, fr, it, sk |
| 5 | allplan | `product launch messaging allplan 2027` | 7 | cs, de, en, es, fr, it |
| 6 | allplan | `product messaging brief allplan` | 7 | cs, de, en, es, fr, it |
| 7 | scia | `scia 2027 whats flyer` | 7 | cs, de, en, es, fr, nl |
| 8 | allplan | `allplan flyer` | 6 | cs, de, en, es, fr, it |
| 9 | allplan | `allplan sales presentation` | 6 | cs, de, en, es, fr, it |
| 10 | allplan | `allplan what's presentation` | 6 | cs, de, en, es, fr, it |
| 11 | allplan-max | `product launch messaging allplan max` | 6 | cs, de, en, es, fr, it |
| 12 | allplan-civil | `product launch messaging brief allplan civil 2027` | 6 | cs, de, es, fr, it |
| 13 | scia | `product launch messaging brief scia 2027` | 6 | cs, de, es, fr, it |
| 14 | allplan-civil | `product messaging brief allplan civil` | 6 | cs, de, es, fr, it |
| 15 | scia | `scia flyer` | 6 | cs, en, fr, nl |
| 16 | allplan | `what's for 2027 allplan flyer` | 6 | cs, de, en, es, fr, it |
| 17 | allplan-civil | `allplan civil flyer` | 5 | cs, en, es, fr, it |
| 18 | scia | `edition comparison scia 2027` | 5 | cs, en, es, fr, nl |
| 19 | frilo | `product launch messaging brief frilo 2027` | 5 | cs, de, es, fr, it |
| 20 | sds2 | `product launch messaging brief sds2 2027` | 5 | cs, de, es, fr, it |
| 21 | frilo | `product messaging brief frilo` | 5 | cs, de, es, fr, it |
| 22 | scia | `product messaging brief scia` | 5 | cs, de, es, fr, it |
| 23 | sds2 | `product messaging brief sds2` | 5 | cs, de, es, fr, it |
| 24 | allplan-civil | `sales presentation allplan civil` | 5 | cs, en, es, fr, it |
| 25 | sds2 | `sds2 flyer` | 5 | cs, de, en, it |
| 26 | allplan-civil | `what's for 2027 allplan civil flyer` | 5 | cs, en, es, fr, it |
| 27 | allplan-civil | `what's presentation allplan civil 2027` | 5 | cs, en, es, fr, it |
| 28 | sds2 | `2027 sds2 sales presentation` | 4 | cs, de, en, it |
| 29 | sds2 | `2027 sds2 what's presentation` | 3 | en |
| 30 | sds2 | `2027 sds2 whats presentation` | 3 | cs, de, it |
| 31 | sds2 | `edition comparison sds2 2027` | 3 | cs, de, it |
| 32 | sds2 | `whats for 2027 sds2 flyer` | 3 | cs, de, it |
| 33 | aluplan-site | `aluplan web strategy draft` | 2 | und |
| 34 | aluplan-site | `ax3000 functions en` | 2 | und |
| 35 | frilo | `edition comparison frilo geotechnics 2027` | 2 | de, en |
| 36 | frilo | `frilo flyer` | 2 | de, en |
| 37 | frilo | `frilo sales presentation` | 2 | de, en |
| 38 | frilo | `what's for 2027 frilo flyer` | 2 | de, en |
| 39 | sds2 | `what's for 2027 sds2 flyer` | 2 | en |

## 4. Tek kopya içerik belgeleri

Varyantı olmayan docx/xlsx dosyaları — bunlar tekil içerik taşıyor olabilir,
Aşama B'de tam metin çıkarımına alınır.

| Ürün | Dosya | Rol |
|---|---|---|
| allplan | `Allplan 2027 Marketing Materials/ALLPLAN 2027 Launch - Product Marketing Materials/Web Pages/ALLPLAN Parametric – Edition Web Page.docx` | web-page-copy |
| allplan | `Allplan 2027 Marketing Materials/ALLPLAN 2027 Launch - Product Marketing Materials/Web Pages/ALLPLAN Rebar - Edition Web Page.docx` | web-page-copy |
| allplan | `Allplan 2027 Marketing Materials/ALLPLAN 2027 Launch - Product Marketing Materials/Web Pages/Allplan – Home Page Slide.docx` | web-page-copy |
| allplan | `Allplan 2027 Marketing Materials/ALLPLAN 2027 Launch - Product Marketing Materials/Web Pages/Launch 2027 - Intro text edition pages shop EN Copy1.xlsx` | web-page-copy |
| allplan | `Allplan 2027 Marketing Materials/ALLPLAN 2027 Launch - Product Marketing Materials/Web Pages/New Text BIMPLUS Page.docx` | web-page-copy |
| allplan | `Allplan 2027 Marketing Materials/ALLPLAN 2027 Launch - Product Marketing Materials/Web Pages/New Text and Images – ALLPLAN - Edition Pages.docx` | web-page-copy |
| allplan-civil | `Allplan 2027 Marketing Materials/ALLPLAN Civil 2027 Launch - Product Marketing Materials/Sales Enablement Assets/Competitive Landscape – ALLPLAN Civil.docx` | sales-enablement |
| allplan-civil | `Allplan 2027 Marketing Materials/ALLPLAN Civil 2027 Launch - Product Marketing Materials/Web Pages/Home Page Slides.docx` | web-page-copy |
| allplan-civil | `Allplan 2027 Marketing Materials/ALLPLAN Civil 2027 Launch - Product Marketing Materials/Web Pages/New Text and Images – Civil Page.docx` | web-page-copy |
| allplan-max | `Allplan 2027 Marketing Materials/ALLPLAN Max 2027 Launch - Product Marketing Materials/ALLPLAN Max Proof Points and Usable Quotes.xlsx` | marketing-other |
| allplan-max | `Allplan 2027 Marketing Materials/ALLPLAN Max 2027 Launch - Product Marketing Materials/Allplan Max Launch Packet/Engineering Max - Positioning and Messaging.docx` | launch-packet |
| allplan-max | `Allplan 2027 Marketing Materials/ALLPLAN Max 2027 Launch - Product Marketing Materials/Allplan Max Launch Packet/Engineering Max ICP and Segmentation.docx` | launch-packet |
| allplan-max | `Allplan 2027 Marketing Materials/ALLPLAN Max 2027 Launch - Product Marketing Materials/Allplan Max Launch Packet/Engineering Max Proof Points and Usable Quotes.xlsx` | launch-packet |
| allplan-max | `Allplan 2027 Marketing Materials/ALLPLAN Max 2027 Launch - Product Marketing Materials/Allplan Max Launch Packet/NOT FINAL - ALLPLAN_2027_Launch_Blog_-_Draft_24-09-26.docx` | launch-packet |
| allplan-max | `Allplan 2027 Marketing Materials/ALLPLAN Max 2027 Launch - Product Marketing Materials/Messaging/Product Messaging Brief - ALLPLAN Max (DE).docx` | messaging-brief |
| allplan-max | `Allplan 2027 Marketing Materials/ALLPLAN Max 2027 Launch - Product Marketing Materials/Web Pages/Allplan Max Web Page.docx` | web-page-copy |
| allplan-max | `Allplan 2027 Marketing Materials/ALLPLAN Max 2027 Launch - Product Marketing Materials/Web Pages/Allplan Max – Home Page Slide - Copy.docx` | web-page-copy |
| frilo | `Allplan 2027 Marketing Materials/FRILO 2027 Launch - Product Marketing Materials/Web Pages/Launch 2027 - Intro text edition pages shop EN.xlsx` | web-page-copy |
| frilo | `Allplan 2027 Marketing Materials/FRILO 2027 Launch - Product Marketing Materials/Web Pages/New Text and Images – FRILO - Edition Pages Copy.docx` | web-page-copy |
| scia | `Allplan 2027 Marketing Materials/SCIA 2027 Launch - Product Marketing Materials/Messaging/Product Messaging Brief - SCIA 2027 (DE).docx` | messaging-brief |
| scia | `Allplan 2027 Marketing Materials/SCIA 2027 Launch - Product Marketing Materials/Web Pages/Launch 2027 - Intro text edition pages shop EN.xlsx` | web-page-copy |
| scia | `Allplan 2027 Marketing Materials/SCIA 2027 Launch - Product Marketing Materials/Web Pages/New Text and Images – SCIA Pages.docx` | web-page-copy |
| sds2 | `Allplan 2027 Marketing Materials/SDS2 2027 Launch - Product Marketing Materials/Web Pages/2027 Home Page Information.docx` | web-page-copy |
| sds2 | `Allplan 2027 Marketing Materials/SDS2 2027 Launch - Product Marketing Materials/Web Pages/New Text and Images – SDS2 Page.docx` | web-page-copy |
| aluplan-site | `public/docs/ax3000/ax3000-functions-hexagon-en.docx` | site-source |
