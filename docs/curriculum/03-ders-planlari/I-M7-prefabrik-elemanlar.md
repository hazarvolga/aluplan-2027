# İ.M7 — Prefabrik Elemanlar ve Üretim Verisi

**Seviye / Modül:** İleri · Prefabrik-Çelik / M7 · **Süre:** 8 saat (Temas ~2 · Uygulama ~5 · Bireysel ~1)
**Ön koşul dersler:** İ.M6 · **Sürekli proje adımı:** Bu derste sürekli projenin bir bölümü prefabrik
(önüretimli) elemanlara dönüştürülür ve üretim verisi hazırlanır.

## Öğrenme kazanımları
Bu modülün sonunda katılımcı:
1. Prefabrik (precast) elemanları (panel, kiriş, döşeme plağı) doğru parametrelerle **oluşturur**. [K-İ7.1]
2. Elemanları üretim mantığına göre parçalara (segment) **ayırır** ve kodlar. [K-İ7.2]
3. Üretim verisini (production data) ve eleman listelerini **hazırlar**. [K-İ7.3] `[sürüme göre doğrula]`

## Temel kavramlar ve terimler
| Terim | Açıklama | İngilizce |
|---|---|---|
| Prefabrik eleman | Fabrikada önceden üretilip sahada montajlanan parça | Precast element |
| Panel | Prefabrik duvar/cephe plağı | Precast panel |
| Segment | Üretim/taşıma için ayrılmış tekil parça | Segment / unit |
| Eleman kodu | Her prefabrik parçaya verilen benzersiz kimlik | Element mark / ID |
| Üretim verisi | Fabrikaya giden ölçü, donatı, gömülü parça bilgisi | Production data |
| Gömülü parça | Elemana dökülen bağlantı/kaldırma ankrajı | Embedded part / insert |

## Ders akışı (dakika bazlı — çok oturumlu modül; bir oturum örneği)
| Süre | Aşama | Eğitmen yapar | Katılımcı yapar | Materyal |
|---|---|---|---|---|
| 0–5 | Dikkat çekme | Yerinde döküm vs. prefabrik üretim | Farkı söyler | Slayt 1 |
| 5–15 | Hedef + ön bilgi | Kazanımlar; M6 çelik mantığını bağlar | Isınma sorusu | Diyagram |
| 15–40 | Demonstrasyon | Bir panel/kirişi prefabrik elemana çevirir | İzler | Örnek proje |
| 40–95 | Rehberli uygulama | Katılımcılarla elemanları segmentlere ayırır | Parçalar + kod verir | Adım kartı A3 |
| 95–130 | Bağımsız görev | Dolaşır, üretim verisini denetler | Eleman listesi + veri üretir | Görev A3 |
| 130–140 | Değerlendirme | Kontrol listesi + mini quiz | Quiz-İ7'yi çözer | Quiz-İ7 |

## Adım adım uygulama yönergesi
1. Modeldeki bir mimari/taşıyıcı elemanı prefabrik elemana dönüştürün (panel, kiriş veya döşeme plağı).
   **Neden?** Prefabrik eleman, üretim ve montaj verisini taşıyan ayrı bir nesnedir. `[sürüme göre doğrula]`
2. Elemanı üretim ve taşıma sınırlarına göre segmentlere ayırın. **Neden?** Fabrika kapasitesi ve
   taşıma boyutu, parçanın büyüklüğünü sınırlar.
3. Her segmente benzersiz eleman kodu (mark) verin. **Neden?** Kod, üretim ve sahada montajın takibini sağlar.
4. Gömülü parçaları (kaldırma ankrajı, bağlantı plakası) ekleyin. **Neden?** Üretim ve montaj bu
   parçalar olmadan yapılamaz; veride görünmelidir. `[sürüme göre doğrula]`
5. Üretim verisini ve eleman listesini üretin (ölçü, donatı, gömülü parça özeti). **Neden?** Fabrika
   bu çıktıyla üretir; model ile liste tutarlı olmalıdır.
6. Eleman kodları ile listeyi karşılaştırıp eksik/çakışan kod olmadığını kontrol edin.

## Sık yapılan hatalar ve çözümleri
| Hata | Belirti | Çözüm |
|---|---|---|
| Segment sınırını taşıma boyutuna göre vermemek | Parça üretilemez/taşınamaz | Segmenti üretim/taşıma limitine göre bölün |
| Eleman kodunu tekrarlı vermek | Listede çakışan kod | Benzersiz kodlama şemasını uygulayın |
| Gömülü parçayı atlamak | Üretim verisinde ankraj yok | Elemana gömülü parçaları ekleyin |
| Model ile liste tutarsızlığı | Üretim verisi yanlış | Listeyi modelden yeniden üretip eşleştirin `[sürüme göre doğrula]` |

## Farklılaştırma
- **Hızlı ilerleyenler:** Birden çok panel tipini kopyalayıp parametrik farklarla türetir ve toplu kod verir.
- **Desteğe ihtiyaç duyanlar:** Tek bir prefabrik panel; segment ayırma ve kodlama bir sonraki oturumda.

## Ödev / bireysel çalışma
Sürekli projenin bir cephe/kat bölümünü prefabrik elemanlara dönüştürün: en az iki panel/eleman,
segment ayrımı, eleman kodları ve üretim verisi listesi.
**Teslim:** Proje dosyası + eleman listesi · **Süre:** ~60 dk · **Ölçüt:** Doğru segment, benzersiz
kodlar, model ile tutarlı üretim verisi.

## Ders sonu kontrol (Quiz-İ7, 8 soru)
1. Prefabrik eleman ile yerinde döküm arasındaki temel fark nedir?
2. Segment sınırını ne belirler? (üretim/taşıma limiti)
3. [Senaryo] Listede çakışan eleman kodu var; olası neden?
4. Gömülü parça neden modele eklenir?
5. [Sıralama] Bir elemanı prefabriğe çevirme sırası nasıl olmalı?
6. Üretim verisi neden model ile tutarlı olmalıdır? `[sürüme göre doğrula]`
7. [Hata bulma] Verilen modelde eksik gömülü parçayı bulun.
8. Eleman kodu (mark) ne işe yarar? (üretim/montaj takibi)

## Ek kaynaklar
Başlangıç ve bitmiş prefabrik eleman dosyası (kurum kaynağı eklenecek), eleman kodlama şeması ve
üretim verisi/liste şablonu `[sürüme göre doğrula]`.
