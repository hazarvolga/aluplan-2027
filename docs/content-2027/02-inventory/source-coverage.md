# Kaynak kapsama (Aşama C)

2027 lansman kümesinin envantere girip girmeyen her dosyasının durumu.
Web sayfaları belgeleri `02-inventory/pages/*.md`'de satır satır örülür;
girişteki sayısal rakamlar `build_web_inventory.py --check` ile doğrulanır.

## Web sayfaları belgeleri (envantere girdi)

13 docx, 761 blok; metinleri `docs/content-2027/01-source-text/web-pages/`
altında toplanmıştır (Stage B) ve envanter satırları o metinlerden
`slug#bN` blok adresleriyle kopyalanır.

| Belge | Blok | Envanter |
|---|---:|---|
| `allplan--allplan-home-page-slide` | 6 | `allplan-home` (b4, b6) |
| `allplan--allplan-parametric-edition-web-page` | 98 | `allplan-parametric` (tam kapsam) |
| `allplan--allplan-rebar-edition-web-page` | 104 | `allplan-rebar` (tam kapsam) |
| `allplan--new-text-and-images-allplan-edition-pages` | 82 | `allplan-home` (b6), `allplan-editions` (tümü) |
| `allplan--new-text-bimplus-page` | 7 | `allplan-bimplus` (b3–b7) |
| `allplan-civil--home-page-slides` | 5 | `allplan-civil` (b3, b4) |
| `allplan-civil--new-text-and-images-civil-page` | 18 | `allplan-civil` (tam kapsam) |
| `allplan-max--allplan-max-home-page-slide-copy` | 8 | `allplan-max` (b4, b6) |
| `allplan-max--allplan-max-web-page` | 54 | `allplan-max` (tam kapsam) |
| `frilo--new-text-and-images-frilo-edition-pages-copy` | 245 | `frilo-editions` (tümü) |
| `scia--new-text-and-images-scia-pages` | 101 | `scia-editions` (tümü) |
| `sds2--2027-home-page-information` | 11 | `sds2` (b3–b5) |
| `sds2--new-text-and-images-sds2-page` | 22 | `sds2` (tam kapsam) |

Toplam: **10 hedef sayfa, 394 içerik birimi.**

## Web envanteri dışında kalan kaynaklar

| Kaynak | Durum |
|---|---|
| `editions/editions-2027.xlsx` (10 FRILO sekmesi + 5 SCIA + 5 ALLPLAN sürüm tablosu) | Web envanterine girmez; fiyat/paket içeriği ayrı iş akışına ait. |
| 7 PDF (5 ürün için sales cheat sheet + 2 SDS2 flyer) | Satış belgesi; metin katmanı `01-source-text/pdf/` altında çıkartıldı, yayımlanacak web metni taşımıyor. |
| `proof-points.md` (anonim kullanım kanıtları) | Çeviri değil; üretime doğrudan girmez. |
| Competitive Landscape / INTERNAL içerikli belgeler | Yayımlanmaz ve tam metni repoya alınmaz. |
| 14 İngilizce messaging brief (B3, SharePoint) | İndirme bekleniyor; geldiğinde `messaging/` altına eklenir. |
| pptx sunum külliyatı (B4) | Kapsam kararını kullanıcı verecek. |

## Doğrulama komutları

```bash
python3 scripts/build_web_inventory.py --check   # kapsam + TR + ID denetimi
python3 scripts/source_blocks.py > /tmp/blockmap.md   # blok haritası girdisi
```

Kapsam kuralı: her web sayfası bloğu ya
(a) bir envanter satırıyla referans edilir,
(b) NON_CONTENT deseniyle atlanır (görsel yer tutucusu, maskeli veri, `<…>`
   uzunluk notu vb.),
(c) paylaşılan bir metnin ikinci tekrarıdır (aynı metin zaten referanslı),
(d) başlık/etiket tipindedir.
Hangisiyle açıklandığında `--check` sorun üretmez; açıklanamayan her blok
hatadır.
