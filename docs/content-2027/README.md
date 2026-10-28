# 2027 içerik envanteri

Aluplan 2027 web sitesi için içerik kaynağı envanteri. Amaç, üreticiden gelen
2027 lansman paketini ve depodaki diğer dokümanları **kaynağına kadar izlenebilir**
biçimde kaydetmek; böylece sayfa metni yazılırken her cümlenin hangi dosyadan
geldiği gösterilebilir.

## Durum

| Aşama | Kapsam | Durum |
|---|---|---|
| A | Dosya envanteri (tüm kök klasörler) | Tamamlandı |
| B1 | Web sayfası docx metni (13 dosya) | Tamamlandı |
| B2 | Edition giriş metinleri (18 kayıt) | Tamamlandı |
| B3 | Messaging brief'ler | İngilizce kaynak indirilmesi bekliyor |
| B4 | Sunum desteleri (pptx) | Kapsam kararı bekliyor |
| B5 | PDF metin katmanı (7 belge) | Tamamlandı |
| B6 | Proof points (anonim yüzdeler) | Tamamlandı |
| C | Web içeriği envanteri (10 sayfa, 394 birim, TR taslak) | Tamamlandı |
| D | Makine okunur veri katmanı (`content-records.json`) | Bekliyor |

## İlkeler

1. **Kaynak değişmez.** Üretici metni birebir korunur; düzenleme yalnızca ayrı
   `bodyTr` alanında yapılır.
2. **Tek otorite.** Aynı konuyu anlatan birden fazla dosya varsa
   `00-census/authority-map.md` hangisinin esas alınacağını söyler.
3. **İzlenebilirlik.** Her kayıt `sourceFile` + `sourceLocator` + `sourceHash`
   taşır. Hash, kaynak dosya değiştiğinde envanterin bayatladığını gösterir.
4. **Kişisel veri girmez.** Anket yanıtlarındaki ad, e-posta ve firma bilgisi
   envantere yazılmaz; yalnızca anonim yüzdeler alınır.
5. **İç kullanım ayrıdır.** Rekabet analizi ve `INTERNAL` sunumlar sitede
   yayımlanmaz.

## Klasörler

```
00-census/       Dosya sayımı, hash dizini, mükerrer analizi, otorite haritası
01-source-text/  Belgelerin birebir metin çıkarımı (Aşama B)
02-inventory/    Web sayfası bazlı içerik envanteri ve kararlar (Aşama C)
03-data/         Makine okunur kayıtlar (Aşama D)
```

## Üretim

```bash
python3 scripts/build_content_inventory.py   # Aşama A — 00-census/
python3 scripts/extract_source_text.py       # Aşama B — 01-source-text/
python3 scripts/source_blocks.py             # Aşama B — blok haritası girdisi
python3 scripts/build_web_inventory.py       # Aşama C — 02-inventory/
python3 scripts/build_web_inventory.py --check   # Aşama C — kapsam denetimi
```

Betikler yalnızca `docs/content-2027/` altına yazar, üçüncü parti bağımlılık
kullanmaz ve deterministiktir: aynı ağaçta aynı çıktıyı üretir.

## Kaynaklar

| Kaynak | Konum | Not |
|---|---|---|
| 2027 lansman paketi | `Allplan 2027 Marketing Materials/` | 916 dosya, 8,0 GB; Git'e alınmaz |
| Mevcut site içeriği | `docs/00-inventory/` | Faz 0'da kapatıldı |
| Üretilmiş site verisi | `src/data/` | 118 rota |
| Tasarım sistemi | `design-system/` | Otorite |
| Konsept prototip | `architectural-sheet-concept/` | Referans |

## Açık kararlar

1. İngilizce messaging brief'ler ve `ALLPLAN Edition Table - ALL FEATURES.xlsx`
   yalnızca SharePoint kısayolu olarak mevcut; indirilecek mi?
2. ALLPLAN Parametric, ALLPLAN Rebar ve Allplan Max için yeni rota açılacak mı?
3. Sayısal iddiaların (%18/%21/%24, "50% faster", "5×") Türkiye'de yayımlanma
   izni var mı?
4. `Aluplan Design System/` kopyası arşive taşınacak mı?
