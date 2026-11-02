# Web içeriği envanteri

Bu klasör `scripts/build_web_inventory.py` tarafından üretilir.

Her satır bir **içerik birimidir**: sayfada tek bir metin alanı. `EN` sütunu
kaynaktan birebir kopyalanır, `TR` sütunu çeviri **taslağıdır** ve yayın
onayı almamıştır.

| Sayfa | Hedef rota | Birim |
|---|---|---|
| [`pages/allplan-home.md`](pages/allplan-home.md) | `/products/allplan` | 3 |
| [`pages/allplan-editions.md`](pages/allplan-editions.md) | `/products/allplan-basic`, `/products/allplan-concept`, `/products/allplan-professional`, `/products/allplan-ultimate` | 24 |
| [`pages/allplan-bimplus.md`](pages/allplan-bimplus.md) | `/products/allplan-bimplus` | 4 |
| [`pages/allplan-parametric.md`](pages/allplan-parametric.md) | `/products/allplan-parametric` | 91 |
| [`pages/allplan-rebar.md`](pages/allplan-rebar.md) | `/products/allplan-rebar` | 97 |
| [`pages/allplan-max.md`](pages/allplan-max.md) | `/products/allplan-max` | 41 |
| [`pages/allplan-civil.md`](pages/allplan-civil.md) | `/products/civil`, `/solutions/infrastructure`, `/solutions/road-railway`, `/solutions/bridge-design` | 11 |
| [`pages/frilo-editions.md`](pages/frilo-editions.md) | `/products/frilo` | 84 |
| [`pages/scia-editions.md`](pages/scia-editions.md) | `/products/scia` | 28 |
| [`pages/sds2.md`](pages/sds2.md) | `/products/sds2-home`, `/solutions/steel` | 11 |

Toplam **394** içerik birimi, **10** hedef sayfa.

## Kurallar

1. **EN değişmez.** Bir satırın `EN` hücresi kaynak dosyadaki blokla bayt
   düzeyinde aynıdır; elle yazılmaz, `slug#bN` adresinden çözülür.
2. **TR taslaktır.** Türkçe metinler editör onayı bekler; sayısal iddialar
   (yüzdeler, "5×", "50% faster") kaynaktaki değeriyle korunur.
3. **Yazar notları girmez.** `<237 characters>`, `<image – …>`, `XXXXX` gibi
   yayımlanmayacak notlar envanter satırı olmaz; `--check` bunları sayar.
4. **Tekrar eden metin paylaşılır.** FRILO ve SCIA'da aynı özellik metni
   birden fazla sürümde geçer; tek satır tanımlanır, sürümler ona referans verir.

## Doğrulama

```bash
python3 scripts/build_web_inventory.py --check
```

Komut üç şeyi denetler: her kaynak bloğunun envantere girip girmediği,
her birimin TR taslağı olup olmadığı ve ID'lerin benzersizliği.
