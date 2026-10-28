# Kaynak metin çıkarımı

Bu klasör `scripts/extract_source_text.py` tarafından üretilir.
Metinler **birebir** kopyadır; düzenleme veya çeviri içermez.

Her dosyanın başındaki front-matter kaynak yolu, SHA-256 ve sayımları taşır.
Kaynak dosya değişirse hash uyuşmaz ve çıkarım bayatlar.

## Biçim kuralları

1. **Metin değişmez.** Cümleler kaynaktaki hâliyle yazılır; kısaltma,
   düzeltme veya çeviri yapılmaz.
2. **Yapı korunur.** Kaynakta başlık stili varsa `#`/`##`/`###` olur.
   2027 docx'lerinin çoğunda başlık stili yoktur; bu durumda blok
   etiketleri (ör. `Hero`, `Overview`, `Benefits`) ve bölüm başlıkları
   kaynaktaki gibi **kalın** yazılır.
3. **Yazar notları korunur.** `<237 characters>`, `<image – …>` gibi
   köşeli parantezli notlar kaynakta olduğu gibi kalır; bunlar yayımlanmaz.
4. **Tablolar** markdown tablosuna çevrilir; hücre metni değişmez.
5. **Kişisel veri maskelenir.** Firma adı, kişi adı, e-posta, telefon ve
   görsel kredisi satırları `[redacted]` ile değiştirilir; alan etiketi
   kalır. Kaç maskeleme yapıldığı her dosyanın front-matter'ında
   `redactions:` alanında yazılıdır. Maskelenen krediler yayın öncesi
   ayrıca onaya sunulmalıdır.

## Web sayfası metinleri

13 docx dosyası. Hepsi `Web Pages/` altında ve İngilizce kaynak.

| Ürün | Dosya | Paragraf | Karakter | Gömülü görsel | Maskeleme |
|---|---|---|---|---|---|
| allplan | `allplan--allplan-home-page-slide.md` | 5 | 247 | 0 | 0 |
| allplan | `allplan--allplan-parametric-edition-web-page.md` | 97 | 6234 | 0 | 0 |
| allplan | `allplan--allplan-rebar-edition-web-page.md` | 103 | 6229 | 0 | 0 |
| allplan | `allplan--new-text-and-images-allplan-edition-pages.md` | 81 | 5120 | 0 | 0 |
| allplan | `allplan--new-text-bimplus-page.md` | 6 | 539 | 0 | 0 |
| allplan-civil | `allplan-civil--home-page-slides.md` | 4 | 299 | 1 | 1 |
| allplan-civil | `allplan-civil--new-text-and-images-civil-page.md` | 17 | 1208 | 3 | 0 |
| allplan-max | `allplan-max--allplan-max-home-page-slide-copy.md` | 7 | 376 | 0 | 0 |
| allplan-max | `allplan-max--allplan-max-web-page.md` | 52 | 4663 | 0 | 0 |
| frilo | `frilo--new-text-and-images-frilo-edition-pages-copy.md` | 244 | 16718 | 0 | 0 |
| scia | `scia--new-text-and-images-scia-pages.md` | 100 | 5909 | 0 | 0 |
| sds2 | `sds2--2027-home-page-information.md` | 10 | 423 | 0 | 2 |
| sds2 | `sds2--new-text-and-images-sds2-page.md` | 21 | 1105 | 0 | 0 |

Toplam **49.070** karakter kaynak metin.
Toplam **3** maskeleme.

## Edition giriş metinleri

- `editions-2027.md` — 18 edition, 3 kopya dosya (içerik aynı: evet), sayaç uyuşmazlığı: 0

## PDF metin katmanı

7 PDF. Metin katmanı doğrudan dosyadan okunur; OCR yok.

| Ürün | Dosya | Sayfa | Karakter | Çözülemeyen glif | Maskeleme |
|---|---|---|---|---|---|
| allplan-civil | `allplan-civil--allplan_civil_2027_sales_cheat_sheetdone.md` | 1 | 3769 | 0 | 0 |
| allplan-max | `allplan-max--allplan_max_2027_sales_cheat_sheet_final.md` | 1 | 3960 | 0 | 0 |
| frilo | `frilo--frilo2027salescheatsheetnew.md` | 1 | 4145 | 0 | 0 |
| scia | `scia--sciaengineer2027salescheatsheetnew.md` | 1 | 4326 | 0 | 0 |
| sds2 | `sds2--sds2-flyer.md` | 2 | 1420 | 0 | 0 |
| sds2 | `sds2--sds22027salescheatsheetnew.md` | 1 | 4106 | 0 | 0 |
| sds2 | `sds2--whats-new-for-2027-sds2-flyer.md` | 2 | 1060 | 0 | 0 |

`SDS2-Competitive Landscape.pdf` **bilinçli olarak çıkarılmadı**:
iç kullanım belgesi, sitede yayımlanmaz. Tam metni de repoya alınmadı.

## Proof points

- `proof-points.md` — 17 iddia, 3 bölüm, yalnızca `Summary` sayfası okundu
