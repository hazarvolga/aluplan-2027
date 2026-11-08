# 09 — Kaynaklar ve Öğrenme Ortamı

> Aluplan Akademi · ALLPLAN Türkçe Eğitim Programı · Taslak 2026-11-08

## Donanım ve yazılım gereksinimleri

`[sürüme göre doğrula]` — ALLPLAN'ın güncel sürümünün resmî sistem gereksinimleriyle teyit edilecek.

| | Minimum | Önerilen |
|---|---|---|
| İşletim sistemi | ALLPLAN'ın desteklediği güncel Windows | Aynı |
| İşlemci | Çok çekirdekli | Yüksek saat hızlı çok çekirdekli |
| RAM | 16 GB | 32 GB+ |
| Ekran kartı | OpenGL destekli | Profesyonel GPU |
| Depolama | SSD | NVMe SSD |

> Web akademi yalnızca tarayıcı gerektirir; ALLPLAN uygulaması katılımcının kendi kurulumudur.

## Örnek dosya seti

Her ders iki dosyayla gelir:
- **Başlangıç dosyası:** O dersin başladığı nokta (önceki dersin çıktısı).
- **Bitmiş dosya:** Dersin tamamlanmış hâli (geride kalan katılımcı buradan devam eder).

Ayrıca: ofis şablonu, kütüphane örnekleri, isimlendirme/katman standardı dosyaları.

## LMS / web akademi yapısı

Her ders sayfası dört parçadan oluşur (bkz. `02-program-mimarisi.md`):
1. Kısa anlatım (metin)
2. Video + yazılı adımlar ("neden?" notlu)
3. Öz değerlendirme quizi (anında açıklamalı)
4. Ders dosyaları (indirilebilir)

İlerleme takibi web'de **yalnızca tarayıcıda** (localStorage) tutulur; hesap gerekmez. Quiz
sonuçlarını cihazlar arası senkronlamak isteyen için (opsiyonel, sonraki faz) e-posta ile hesap
önerilir — bu, aynı zamanda bülten kitlesi oluşturur (KVKK için ayrı açık rıza).

## Mikro-öğrenme ve erişilebilirlik (UDL)

- 3–7 dakikalık kısa videolar; her videonun yazılı adım karşılığı.
- Kısayol kartları (indirilebilir PDF).
- Video altyazısı (Türkçe), renk körlüğüne duyarlı görseller.
- Farklı hızlara uygun ek görevler (farklılaştırma).

## Oyunlaştırma (opsiyonel)

Rozetler, seviye tamamlama göstergeleri, haftalık meydan okuma. Web'de rozetler yereldir
(sertifika değildir).

## Terimler sözlüğü (Türkçe–İngilizce, örnek)

| Türkçe | İngilizce |
|---|---|
| Yapı yapısı | Building structure |
| Çizim dosyası | Document / Teilbild |
| Açıklık | Opening |
| Donatı | Reinforcement |
| Giydirme cephe | Curtain wall |
| Çakışma kontrolü | Clash detection |
| Ortak Veri Ortamı | Common Data Environment (CDE) |

> Tam sözlük, ders planlarındaki "Temel kavramlar" tablolarından derlenir.

## Sonraki dosya
→ [10-kalite-ve-guncelleme.md](10-kalite-ve-guncelleme.md)
