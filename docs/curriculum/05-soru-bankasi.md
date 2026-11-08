# 05 — Soru Bankası

> Aluplan Akademi · ALLPLAN Türkçe Eğitim Programı · Taslak 2026-11-08

Her soru bir kazanım koduna bağlıdır; cevap anahtarı ve açıklama içerir. Açıklamalar, web
akademide quiz sonrası **geri bildirim** olarak gösterilir (her çeldiricinin neden yanlış olduğu
dahil). Zorluk dağılımı hedefi: ~%30 kolay, %50 orta, %20 zor. Olumsuz kök ("hangisi **değildir**")
az kullanılır ve kalın yazılır; "hepsi/hiçbiri" seçeneğinden kaçınılır.

Soru türleri: çoktan seçmeli (ÇS), senaryo (SEN), görsel (GÖR), sıralama (SIR), hata bulma (HAT),
pratik görev (PRA). Bu dosya her seviye için **temsilî** sorular içerir; tam bankaya ders planı
quizleri eklenir.

---

## Seviye 1 — Temel

**S-B1.1 · ÇS · Bloom: Anlama · Zorluk: Kolay · Kazanım: K-B1.3**
BIM'i geleneksel CAD'den ayıran temel özellik nedir?
A) Daha hızlı çizim yapması
B) Nesnelerin geometriyle birlikte veri taşıması
C) Sadece 3B çizmesi
D) Renkli çıktı vermesi
**Doğru cevap:** B
**Açıklama:** BIM'de bir duvar yalnızca çizgi değil; kalınlık, malzeme, yükseklik gibi veriyi de
taşır. A yanlış: hız bir sonuç, tanım değil. C yanlış: BIM 2B de üretir. D yanlış: çıktı rengiyle
ilgisizdir.

**S-B2.1 · SIR · Bloom: Uygulama · Zorluk: Orta · Kazanım: K-B2.2**
Bir katı modellemeye başlarken doğru sıralamayı yapın:
1) Elemanları yerleştir · 2) Aks sistemini kur · 3) Kat kotlarını tanımla
**Doğru sıra:** 3 → 2 → 1
**Açıklama:** Önce kat tanımı (elemanların düzlemi), sonra akslar (hizalama referansı), en son
elemanlar gelir. Tersi sıra yeniden çalışma doğurur.

**S-B3.1 · SEN · Bloom: Analiz · Zorluk: Orta · Kazanım: K-B3.2**
Bir katılımcı kapı ekledi ama kapı metraj listesinde görünmüyor. En olası neden nedir?
A) Kapı yanlış renkte
B) Kapı, duvar elemanına bağlı bir açıklık olarak değil, bağımsız çizgi olarak eklendi
C) Metraj listesi bozuk
D) Kat kotu yanlış
**Doğru cevap:** B
**Açıklama:** Kapı/pencere, duvara bağlı bir nesne olmalıdır; bağımsız çizildiğinde metraja
yansımaz. Diğer seçenekler metrajda görünmemeyi açıklamaz.

**S-B3.2 · HAT · Bloom: Değerlendirme · Zorluk: Zor · Kazanım: K-B3.3**
`[Görsel: kiriş-kolon birleşiminde kiriş kolonu kesiyor]` Verilen modelde birleşim hatasını ve
çözümünü açıklayın.
**Beklenen cevap:** Birleşim önceliği yanlış; kolon önceliği kirişten yüksek olmalı. Öncelik
değerleri düzeltilir.

---

## Seviye 2 — Orta

**S-O4.1 · ÇS · Bloom: Uygulama · Zorluk: Kolay · Kazanım: K-O4.1**
Modelden bir kesit üretildiğinde model değişirse kesit ne olur?
A) Elle yeniden çizilmelidir
B) Modelle ilişkili olduğu için güncellenir
C) Silinir
D) Değişmez
**Doğru cevap:** B
**Açıklama:** BIM'de kesit modelden türetilir; model değişince kesit de güncellenir. Bu, BIM'in
dokümantasyondaki en büyük avantajıdır.

**S-O4B.1 · SEN · Bloom: Analiz · Zorluk: Orta · Kazanım: K-O4B.3**
Mahal listesinde bazı odalar eksik çıkıyor. İlk kontrol edilecek nedir?
A) Oda/mahal nesnelerinin tanımlı olup olmadığı
B) Pafta ölçeği
C) Çıktı rengi
D) Kat sayısı
**Doğru cevap:** A
**Açıklama:** Mahal listesi, tanımlı oda nesnelerinden beslenir; tanımsız mekân listeye girmez.

---

## Seviye 3 — İleri (kola göre)

**S-İ5.1 · ÇS · Bloom: Uygulama · Zorluk: Orta · Kazanım: K-İ5.1**
3B donatı modellemenin 2B donatı çizimine göre temel avantajı nedir?
A) Daha az dosya
B) Çakışma ve birleşim kontrolü ile otomatik donatı listesi
C) Daha hızlı internet
D) Renk seçenekleri
**Doğru cevap:** B
**Açıklama:** 3B donatı, elemanlar arası çakışmayı görünür kılar ve listeler otomatik türetilir.

**S-İ8.1 · SEN · Bloom: Analiz · Zorluk: Zor · Kazanım: K-İ8.2**
Prefabrik kirişli köprüde kiriş tipleri sık değişiyor. Hangi yaklaşım yeniden çalışmayı en aza
indirir?
A) Her kirişi elle çizmek
B) Parametrik köprü/kiriş nesnesi kullanmak `[sürüme göre doğrula]`
C) Köprüyü 2B çizmek
D) Her değişiklikte dosyayı kopyalamak
**Doğru cevap:** B
**Açıklama:** Parametrik nesne, tip değişikliğini tek yerden yayar; manuel yöntemler hata ve
tekrar üretir.

---

## Seviye 4 — Uzman

**S-U9.1 · ÇS · Bloom: Değerlendirme · Zorluk: Orta · Kazanım: K-U9.1**
Bir işi otomatikleştirmeden önce sorulacak en doğru soru hangisidir?
A) Bu iş yeterince sık tekrarlanıyor ve kurallı mı?
B) En yeni araç hangisi?
C) Kod uzun mu?
D) Renk teması ne?
**Doğru cevap:** A
**Açıklama:** Otomasyon, sık tekrarlanan ve kurallaştırılabilen işlerde değer üretir; tek seferlik
işlerde maliyeti faydasından yüksek olabilir.

**S-U10.1 · SEN · Bloom: Analiz · Zorluk: Zor · Kazanım: K-U10.1**
IFC dışa aktarımından sonra alıcı ekip bazı özelliklerin kaybolduğunu bildiriyor. İlk kontrol?
A) Dışa aktarım eşlemesi (mapping) ve MVD/IFC sürümü
B) Monitör çözünürlüğü
C) Dosya adı
D) Katman rengi
**Doğru cevap:** A
**Açıklama:** IFC'de veri kaybı çoğunlukla yanlış eşleme veya uyumsuz sürüm/MVD'den kaynaklanır.

---

## Kullanım notları
- Ders sonu quiz: 5–10 soru / 10–15 dk. Modül sınavı: 20–30 soru + pratik görev.
- Her yeni ders planı, quiz sorularını buraya kodlu ekler (ör. Quiz-B1 → S-B1.*).
- Madde analizi (`10-kalite-ve-guncelleme.md`): çok kolay/çok zor sorular revize edilir.

## Sonraki dosya
→ [06-bitirme-projesi.md](06-bitirme-projesi.md)
