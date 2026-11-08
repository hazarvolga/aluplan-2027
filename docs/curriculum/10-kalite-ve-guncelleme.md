# 10 — Kalite Güvencesi ve Güncelleme

> Aluplan Akademi · ALLPLAN Türkçe Eğitim Programı · Taslak 2026-11-08

## Program değerlendirme — Kirkpatrick 4 düzey

| Düzey | Ölçtüğü | Araç |
|---|---|---|
| 1. Tepki | Memnuniyet | Ders/seviye sonu kısa anket, NPS |
| 2. Öğrenme | Bilgi/beceri kazancı | Ön test – son test farkı, pratik görev |
| 3. Davranış | İş yerinde kullanım | 3 ay sonra takip anketi/görüşme |
| 4. Sonuç | Kurumsal etki | ALLPLAN kullanıcı sayısı, ofis verimliliği, hata azalması |

Birincil amaç (ALLPLAN kullanıcı sayısını artırmak) 4. düzeyde izlenir.

## KPI'lar

- Tamamlama oranı (seviye/ders bazında)
- Quiz geçme ve ön-son test kazancı
- NPS (tavsiye skoru)
- Web: ziyaretçi → ders başlatan → seviye tamamlayan dönüşümü
- Eğitmenli: sertifika sonrası kullanım/terfi

## Soru (madde) analizi

Quiz verisinden (web'de anonim/toplu, eğitmenli'de notlu):
- **Madde güçlüğü:** Çok kolay (>%90 doğru) veya çok zor (<%30 doğru) sorular revize edilir.
- **Ayırt edicilik:** Başarılı ve başarısız katılımcıyı ayırmayan soru değiştirilir.

## Sürüm güncelleme döngüsü

ALLPLAN her yeni sürümde araç/menü değiştirir. Müfredatın **sürüm-bağımsız kavramsal çekirdeği**
(nesne tabanlı modelleme, openBIM, otomasyon mantığı) korunur; değişen yalnızca arayüz adımlarıdır.

**Her yeni sürümde:**
1. Değişen araçları listele.
2. Etkilenen ders planlarını işaretle (`[sürüme göre doğrula]` notları buraya bakar).
3. Video/adım görsellerini güncelle.
4. Rozet/sertifika yenileme modülü hazırla.

## Değişiklik günlüğü

| Sürüm | Tarih | Değişiklik |
|---|---|---|
| 0.1 (taslak) | 2026-11-08 | İlk müfredat temeli (00–02), ders planları (03), ölçme–kalite (04–10) |

## Açık uçlar (program geneli)

- ALLPLAN güncel sürüm arayüz terimleri doğrulanacak (tüm `[sürüme göre doğrula]` notları).
- Resmî ALLPLAN sertifika adı/kapsamı doğrulanacak.
- M6/M7 (8+8) ve M8 (16) saatleri PRD'den (10+10, 14) farklı; eşit-kol kuralıyla tutuldu.
- Türkiye yerel yönetmelik/teslim kuralları ilgili derslere eklenecek (güncel hâli doğrulanarak).

## Program dosya haritası (tamamlandı)

```
docs/curriculum/
├── 00-program-kimligi.md
├── 01-kazanimlar-ve-hizalama.md
├── 02-program-mimarisi.md
├── 03-ders-planlari/  (README + 12 modül: M1,M2,M3,M4,M4B,M3B,M5,M6,M7,M8,M9,M10)
├── 04-olcme-degerlendirme.md
├── 05-soru-bankasi.md
├── 06-bitirme-projesi.md
├── 07-sertifikasyon.md
├── 08-egitmen-rehberi.md
├── 09-kaynaklar-ve-ortam.md
└── 10-kalite-ve-guncelleme.md
```
