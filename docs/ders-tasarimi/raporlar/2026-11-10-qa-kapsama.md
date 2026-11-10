# Q&A Kapsama Denetimi — "Derinleşmek için" kartı ↔ "Derinlemesine"

Tarih: 2026-11-10 · Kapsam: 42 ders, 183 kart maddesi · Yöntem: her kart maddesi için
sınıflandırma (Soru/Cevap mı, stub mı) + Derinlemesine'ye yedirilmiş mi (görsel örtüşmesi +
başlık/anahtar eşleşmesi) + şüphelilerin ELLE doğrulanması.

## Sonuç (net)

**99 Soru/Cevap maddesinin tamamı Derinlemesine'ye yedirilmiş durumda.** Son kalan 1 gerçek
boşluk (TM 05 `de_10634` beyaz dolgu DWG aktarımı) bu turda dolduruldu; `de_10869` (lejant Çelik
Listesi) lejant 07/09'da zaten vardı, tutarlılık için 08'e de eklendi.

Yedirilmeyen 2 madde ise bilinçli DIŞARIDA (Soru/Cevap değil):
- `de_3307` (TM 03 "Nesneleri seçme ve etkinleştirme") — içerik tipi `explainer_video`, metin
  gövdesi yok, üstelik **Bim Explorer** (Allplan ana ürünü değil). Metin dersi modeline uymaz.
- `de_12714` (Arazi 01 "Add-On Baugrube - Mimarlar İçin") — eklenti tanıtımı, Soru/Cevap değil.

## "Pek çok yedirilmemiş" algısının gerçek sebebi

İçerik eksik değil; iki UX sorunu "yedirilmemiş gibi" gösteriyor:
1. **Başlık eşleşmemesi.** Derinlemesine alt-bölüm başlıklarını yeniden yazdım; kart makale
   başlığıyla birebir aynı değil. Örnekler (kart → Derinlemesine):
   - "Çatı - Kat - Ara döşeme oluşturma" → "Çatı Katında Eğimli Çatıya Uyan Ara Döşeme Oluşturma"
   - "Eşit kazı ve dolgu kullanarak hesaplamalar" → "Yaklaşık Eşit Kazı ve Dolgu ile Kazı Çukuru…"
   - "DGM - Ortho-Foto als Textur" → "Arazi Animasyonu İçin Ortofotoyu Doku Olarak Kullanmak"
   - "Legenden - Stahlliste mit festem Büronamen" → "Sabit Büro Adıyla Çelik Listesi Oluşturmak"
   Kullanıcı kart ↔ Derinlemesine karşılaştırınca eşleşmeyi bulamıyor, "yok" sanıyor.
2. **Çift bölüm.** Aynı içerik hem çevrilmiş (Derinlemesine) hem ham (kart) olarak yan yana
   görünüyor; ham kart, işin yapılmamış gibi durmasına yol açıyor.

## Sayılar

| | Adet |
|---|---|
| Toplam kart maddesi | 183 |
| Soru/Cevap maddesi | 99 |
| Yedirilmiş | 99 (tamamı) |
| Soru/Cevap olmayan (stub/video/eklenti/duyuru) | 84 |

## Öneri (kart kararı)

İçerik tam yedirildiğine göre eski "Derinleşmek için" kartı artık **çift içerik**. Seçenekler:
- **(a) Kartı kaldır** — migrate edilen (deepDive'ı olan) 35 derste kartı gizle; çakışma ve
  "yok" algısı biter. (Renderer'da tek koşul.) Önerilen.
- **(b) Başlıkları eşle** — Derinlemesine alt-bölüm başlıklarını kart başlıklarıyla birebir yap;
  kartı tut ama tekrarı kabul et.
- **(a)+(b)** — kartı kaldır, başlıkları da kart terimine yaklaştır (arama/eşleşme için).

Soru/Cevap olmayan 2 madde (de_3307 video, de_12714 eklenti) Derinlemesine'ye uygun değil; kart
kaldırılırsa bu iki içerik "Destekleyici kaynak" (video linki / eklenti notu) olarak ayrıca
sunulabilir — küçük ayrı iş.
