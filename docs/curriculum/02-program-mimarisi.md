# 02 — Program Mimarisi

> Aluplan Akademi · ALLPLAN Türkçe Eğitim Programı · Taslak 2026-11-08

Bu dosya seviye → modül → ders yapısını, süre hesabını ve takvimi tanımlar. Modül saatleri
`src/data/akademi.ts` ile aynıdır ve müfredat fazında yeniden hesaplanır. Süreler **taslaktır**.

## Süre modeli

- Bir **ders saati** = 50 dk uygulama/anlatım + 10 dk mola.
- Her ders üç iş yükü bileşenine ayrılır: **temas** (eğitmenli/video), **rehberli uygulama**,
  **bağımsız çalışma**. Web akademide "temas", video + yazılı adımlarla karşılanır.
- Seviye içi önerilen dağılım (beceri temelli olduğu için uygulama ağırlıklı):
  **%20 anlatım · %45 rehberli uygulama · %20 bağımsız proje · %15 öz değerlendirme**.
- Akademik kredi (AKTS) verilmez; iş yükü yalnızca planlama ve şeffaflık için gösterilir.

## Program mimarisi tablosu

Kolon "Saat", `akademi.ts`'teki modül toplam saatidir (temas + rehberli uygulama). Bağımsız
çalışma bunun ~%40'ı kadar ayrıca önerilir.

| Kod | Seviye | Modül | Saat | Kazanım kodları | Öz değerlendirme |
|---|---|---|---|---|---|
| B.M1 | Temel | Arayüz ve temel gezinme | 8 | K-B1.1–1.3 | Quiz-B1 |
| B.M2 | Temel | Proje yapısı, yapı yapısı ve çizim dosyaları | 12 | K-B2.1–2.3 | Quiz-B2 |
| B.M3 | Temel | Parametrik mimari elemanlar ve hacimler | 16 | K-B3.1–3.3 | Quiz-B3 + Seviye 1 pratik |
| O.M4 | Orta | 2B dokümantasyon, kesitler ve pafta düzeni | 12 | K-O4.1–4.3 | Quiz-O4 |
| O.M4B | Orta | Kütüphane, özellikler ve metraj *(önerilen)* | 12 | K-O4B.1–4B.3 | Quiz-O4B + Seviye 2 pratik |
| İ.M3B | İleri · Mimari | İleri mimari modelleme ve sunum *(önerilen)* | 16 | K-İ3B.1–3B.2 | Kol pratik |
| İ.M5 | İleri · Betonarme | Betonarme yapılarda 3B donatı | 16 | K-İ5.1–5.2 | Kol pratik |
| İ.M6 | İleri · Prefabrik-Çelik | Çelik yapı tasarımı ve SDS2 | 8 | K-İ6.1 | — |
| İ.M7 | İleri · Prefabrik-Çelik | Prefabrik elemanlar ve üretim verisi | 8 | K-İ7.1 | Kol pratik |
| İ.M8 | İleri · Altyapı | ALLPLAN Civil ve Bridge ile altyapı | 16 | K-İ8.1–8.2 | Kol pratik |
| U.M9 | Uzman | Otomasyon, Visual Scripting ve PythonParts | 12 | K-U9.1–9.2 | Quiz-U9 |
| U.M10 | Uzman | openBIM, IFC 4.3, IDS ve CDE koordinasyonu | 10 | K-U10.1–10.3 | Quiz-U10 + Bitirme projesi |

## Seviye süre özeti

| Seviye | Ortak mı? | Modüller | Toplam saat |
|---|---|---|---|
| Seviye 1 — Temel | Evet | M1 + M2 + M3 | 36 |
| Seviye 2 — Orta | Evet | M4 + M4B | 24 |
| Seviye 3 — İleri | Hayır (kol seçilir) | Her kol **16** (eşit) | 16 |
| Seviye 4 — Uzman | Evet | M9 + M10 | 22 |
| **Bir öğrencinin tam yolu** | | 1 + 2 + (1 kol) + 4 | **98** |

> Seviye 3'te dört kolun da toplamı 16 saattir: Mimari (M3B 16), Betonarme (M5 16),
> Prefabrik-Çelik (M6 8 + M7 8), Altyapı (M8 16). Eşit ağırlık, kullanıcı kararıdır.

## Sürekli proje (Running Project)

Program boyunca **tek bir bina projesi** geliştirilir; her ders bu projeye bir katman ekler. Bu,
motivasyonu ve bilgi transferini en çok artıran tekniktir.

- **Proje:** 4–5 katlı, betonarme, karma kullanımlı bir bina.
- **Altyapı kolu ek projesi:** Prefabrik kirişli küçük bir köprü.

| Seviye | Projeye eklenen katman |
|---|---|
| Seviye 1 | Akslar, katlar, temel mimari model (duvar/döşeme/kolon/kiriş, kapı/pencere) |
| Seviye 2 | Kesitler, görünüşler, paftalar ve metraj |
| Seviye 3 | Kola göre: mimari detay / 3B donatı / prefabrik-çelik / köprü |
| Seviye 4 | IFC teslimi, kural denetimi ve otomasyon |

## Ders yapısı (her ders aynı düzende)

Her ders Gagné/5E iskeletini izler ve dört parçadan oluşur (web akademide bir ders sayfası):

1. **Kısa anlatım** — dersin neden önemli olduğu ve temel kavramlar.
2. **Video ve adımlar** — her adımın yanında "neden?" notuyla uygulama.
3. **Öz değerlendirme** — ders sonu quizi; açıklamalı cevaplarla.
4. **Ders dosyaları** — başlangıç ve tamamlanmış proje dosyaları (geride kalan yetişir).

## Takvim örnekleri

Format seçimine göre iki örnek:

- **Asenkron (web, kendi hızında):** Haftada ~4 saat ile bir öğrencinin tam yolu (98 saat) ≈ 24–26 hafta.
- **Eğitmenli yoğun (sınıf):** Seviye başına 1 hafta yoğun kamp (5 gün × ~7 saat) modeli;
  Seviye 3'te kol seçimiyle paralel sınıflar.

## Kapsam dışı / ileri program

Bu sürümde kapsanmayan, ileri bir programa bırakılan alanlar (skill §4 A–F taramasına göre):

- Enerji/gün ışığı analizi ve LCA'ya veri hazırlama (sürdürülebilirlik derinliği)
- Nokta bulutu / Scan-to-BIM
- Dijital ikiz ve FM'e veri teslimi (COBie)
- 4D/5D derin uygulama (model hazırlığı M10'da temel düzeyde anılır)
- Gerçek zamanlı render motorları ile ileri görselleştirme

## Açık uçlar (doğrulanacak)

- ALLPLAN arayüz terimleri güncel sürüme göre doğrulanacak (`[sürüme göre doğrula]` işaretli yerler).
- M6/M7 (prefabrik-çelik) saatleri PRD'de 10+10 iken burada 8+8; eşit kol kuralı için 8+8 tutuldu.
- M8 (altyapı) saati PRD'de 14 iken burada 16; eşit kol kuralı için 16 tutuldu.
- SDS2 ve ALLPLAN Bridge entegrasyon kapsamı sürüme göre netleştirilecek.

## Sonraki dosyalar (üretim sırası)

→ `03-ders-planlari/` — her ders için ayrı plan · → `04-olcme-degerlendirme.md` → `05-soru-bankasi.md`
→ `06-bitirme-projesi.md` → `07-sertifikasyon.md` → `08-egitmen-rehberi.md` → `09-kaynaklar-ve-ortam.md`
→ `10-kalite-ve-guncelleme.md`
