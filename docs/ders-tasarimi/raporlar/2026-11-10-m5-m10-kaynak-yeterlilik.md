# M5–M10 İçerik Kaynak Yeterlilik Değerlendirmesi

**Tarih:** 2026-11-10
**Soru:** İleri/Uzman modüller (M5 donatı, M6 çelik, M7 prekast, M9 otomasyon, M10 openBIM)
derslerini çıkarmak için elimizdeki kaynaklar yeterli mi?
**Kaynak:** LearnNow Bilgi Çekirdeği — `aluplan_core.db` (2.996 kaynak, 3.410 RAG parçası,
5.615 görsel, 10 müfredat modülü). Kaynaklar modül kimliğine (`curriculum_module_id`) zaten
etiketli, bu yüzden sayımlar doğrudan okunabildi.

## Modül başına kapsam (ölçüldü)

| Modül | Konu | Kaynak | Dolu içerik (md>400) | Görsel | Konu-FTS isabeti | Verdict |
|---|---|---:|---:|---:|---:|---|
| **M5** | Betonarme 3B donatı + büküm şeması | 76 | 63 | 182 | 88 (Bewehrung/donatı/rebar) | **Yeterli** |
| **M6** | Çelik yapı + SDS2 + NC otomasyon | 436 | 359 | 1.330 | 447 (Stahlbau/SDS2/steel) | **Fazlasıyla yeterli** |
| **M7** | Prekast elemanlar + üretim otomasyonu | 68 | 25 | 116 | 79 (Fertigteil/prekast) | **İyi** (giriş-orta) |
| **M9** | Visual Scripting + PythonParts + ADM API | 23 | 16 | 40 | 23 (PythonParts/VS/ADM) | **Sınırda** |
| **M10** | OpenBIM / IFC 4.x / IDS / Bimplus CDE | 131 | 87 | 183 | 350 IFC · 132 IDS | **Yeterli** |

## Yorum

**Dört modül rahat üretilir (M5, M6, M7, M10).** Dersin omurgası metin + ekran görüntüsü +
uygulama/quiz; bu modüllerde hem gerçek (özgün başlıklı, Almanca/Fransızca kaynaktan) dolu
içerik hem bol görsel var. Özellikle M6 (359 dolu kaynak, 1.330 görsel) ve M10 (IFC 350 + IDS
132 isabet) güçlü. M7'de dolu kaynak sayısı düşük (25) ama konu-FTS (79) ve görsel (116) ders
üretimine yeter; derin "endüstriyel üretim otomasyonu" alt başlığı için 1–2 noktada ek
doğrulama gerekebilir.

**M9 en zayıf halka — ama giriş düzeyi için yeterli.** 16 dolu kaynak (~1.860 karakter ort.,
toplam ~30 KB) + 40 görsel; içerik gerçek: ADM API (Python/C#), VisualScripting node kurulumu,
SmartStairConverter PythonPart örneği, Excel komut sözdizimi. Bu, **PythonParts/Visual
Scripting'e giriş + temel ADM API** dersleri için yeterli. Yetmediği yer: ileri/uzman düzey
bağımsız PythonPart geliştirme, hata ayıklama, paketleme gibi derinlik. Not: M9 kaynaklarının
8'inde Türkçe başlık `"Allplan Teknik Kaynak (Modül 9)"` placeholder'ı; gerçek başlık
`title_original`'de — ders yazımında bu başlıkların Türkçeleştirilmesi gerekir.

## Sonuç

**Evet, çoğu için yeterli.** Üretim sırası önerisi (kaynak gücüne göre):
1. **M6 Çelik** ve **M10 OpenBIM** — en zengin, önce bunlar.
2. **M5 Donatı** — güçlü, betonarme rolü için kritik.
3. **M7 Prekast** — iyi; derin otomasyon alt başlığında kaynak doğrulaması yaparak.
4. **M9 Otomasyon** — en sona; "giriş" kapsamıyla başla, ileri API dersleri için kaynak
   takviyesi (resmî ALLPLAN SDK/ADM dokümantasyonu) planla.

Her modülün dersleri, mevcut uygulamalı seriler (temel-modelleme, arazi, lejant) gibi
`build_series.py` + TmLesson modeliyle bu çekirdeğe dayanarak yazılabilir. Teknik adımlar
`aluplan_core.db`'den doğrulanır; doğrulanamayan her araç adı `[doğrulanmadı]` işaretlenir.

---

## DÜZELTME (2026-11-10, içerik incelemesi sonrası)

Yukarıdaki sayımlar ham `curriculum_module_id` etiketine dayanıyordu; içerik açılınca
tablo iyimser çıktı. Gerçek durum:

1. **`markdown_tr` çevrilmemiş.** Alan, DE/EN orijinal metni taşıyor. Başlığı
   Türkçeleştirilmiş sananların çoğu da yarım: İngilizce gövdeye birkaç terim
   (örn. "Çizim Dosyası") gömülmüş, gerçek çeviri değil.
2. **Dil ağırlığı DE/EN.** Dolu içerikte Türkçe oranı çok düşük: M5 (35 DE / 26 EN),
   M6 (257 EN / 100 DE; yalnız 33 TR başlık), M7 (12 DE / 10 EN), M9 (5 EN / 4 IT / 4 DE),
   M10 (42 DE / 22 EN).
3. **Kısmen hedef dışı.** M6'nın en dolu kayıtları ALLPLAN çelik değil **SCIA Engineer**
   (ayrı ürün, yapısal analiz); M5'in en dolu DE kaydı **"Hotletter 2023" kurulum notu**.
   Ham etiket, komşu/ilgisiz içeriği de modüle çekmiş.

**Düzeltilmiş sonuç:** Kaynak **var ama derse hazır değil.** Çekirdek; ham, çok dilli
(ağırlıkla DE/EN), çevrilmemiş, kısmen hedef-dışı bir bilgi bankası. Buradan gerçek ders
üretmek üç ek iş gerektirir: **(a) küratörlük** (SCIA, kurulum/hotletter, ürün-dışı
kayıtları ele), **(b) DE/EN→TR çeviri** (`insaat-teknik-ceviri`), **(c) didaktik yazım +
araç adı doğrulama**. Yani otomatik "script dökümü" değil, küratörlü içerik üretimi; aksi
hâlde çok dilli/hedef-dışı çıktı oluşur. Üretim stratejisi ve ders derinliği kullanıcı
onayıyla belirlenecek.
