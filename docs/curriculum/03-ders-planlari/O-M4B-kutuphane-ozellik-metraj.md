# O.M4B — Kütüphane, Özellikler ve Metraj Listeleri *(önerilen)*

**Seviye / Modül:** Orta / M4B *(önerilen)* · **Süre:** 12 saat (Temas ~3 · Uygulama ~7 · Bireysel ~2)
**Ön koşul dersler:** O.M4 · **Sürekli proje adımı:** Bu derste sürekli projenin elemanlarına
özellikler atanır ve modelden metraj, kapı/pencere çizelgesi ile mahal listesi üretilir.

## Öğrenme kazanımları
Bu modülün sonunda katılımcı:
1. Kütüphane elemanlarını ve özel parametrik objeleri **yönetir**. [K-O4B.1] `[sürüme göre doğrula]`
2. Elemanlara özellik (attribute) **atar** ve sınıflandırma mantığını **uygular**. [K-O4B.2]
3. Metraj, kapı/pencere çizelgesi ve mahal listesi **üretir**. [K-O4B.3]

## Temel kavramlar ve terimler
| Terim | Açıklama | İngilizce |
|---|---|---|
| Kütüphane | Hazır obje ve sembollerin saklandığı kaynak | Library |
| Parametrik obje | Değerle değişen, yeniden kullanılabilir akıllı eleman | Parametric object / SmartPart |
| Özellik (attribute) | Elemana iliştirilen veri alanı (ad, malzeme, kod) | Attribute / property |
| Sınıflandırma | Elemanları ortak koda göre gruplayan sistem | Classification |
| Metraj | Model verisinden üretilen miktar/alan/adet listesi | Quantity take-off |
| Mahal listesi | Odaların alan ve işlev dökümü | Room schedule |

## Ders akışı (dakika bazlı — çok oturumlu modül; bir oturum örneği)
| Süre | Aşama | Eğitmen yapar | Katılımcı yapar | Materyal |
|---|---|---|---|---|
| 0–5 | Dikkat çekme | Elle sayılan metraj vs. modelden metraj | Farkı söyler | Slayt 1 |
| 5–15 | Hedef + ön bilgi | Kazanımlar; M4 dokümanını veriye bağlar | Isınma sorusu | Diyagram |
| 15–35 | Demonstrasyon | Özellik atar, kütüphaneden obje yerleştirir | İzler | Örnek proje |
| 35–85 | Rehberli uygulama | Katılımcılarla özellik + sınıflandırma uygular | Elemanları etiketler | Adım kartı A3 |
| 85–120 | Bağımsız görev | Dolaşır, listeleri denetler | Metraj + çizelge üretir | Görev A3 |
| 120–130 | Değerlendirme | Kontrol listesi + mini quiz | Quiz-O4B'yi çözer | Quiz-O4B |

## Adım adım uygulama yönergesi
1. Kütüphaneden gerekli objeleri (mobilya, kapı/pencere tipleri) modele yerleştirin. **Neden?** Hazır
   kütüphane tekrar eden çizimi önler ve objeler metraja otomatik yansır. `[sürüme göre doğrula]`
2. Bir özel parametrik objeyi parametreleriyle düzenleyin. **Neden?** Aynı obje, ölçü değiştirilerek
   farklı yerlerde yeniden kullanılır; tek tanım çok varyant verir.
3. Elemanlara özellik (attribute) atayın: ad, malzeme, poz/kod. **Neden?** Metraj ve çizelge bu veri
   alanlarından beslenir; veri yoksa liste de boş çıkar.
4. Sınıflandırma mantığını uygulayın (ör. duvarları işleve göre gruplama). **Neden?** Sınıflandırma,
   listeleri derli toplu ve filtrelenebilir yapar. `[sürüme göre doğrula]`
5. Modelden metraj listesini (alan/hacim/adet) üretin. **Neden?** Miktarlar modelden türediği için
   model değişince liste güncellenir; elle sayım hatası ortadan kalkar.
6. Kapı/pencere çizelgesini ve mahal listesini oluşturun. **Neden?** Bu çizelgeler hem dokümanın hem
   de keşif/maliyet çalışmasının temelini oluşturur.

## Sık yapılan hatalar ve çözümleri
| Hata | Belirti | Çözüm |
|---|---|---|
| Elemana özellik atamama | Metrajda isim/kod boş çıkıyor | Eksik attribute alanlarını doldurun |
| Sınıflandırmayı atlama | Liste karışık, filtrelenemiyor | Elemanları ortak koda göre sınıflandırın |
| Kütüphane objesini çizgiyle taklit etme | Obje metrajda görünmüyor | Gerçek kütüphane objesi kullanın |
| Mahal sınırını eksik tanımlama | Oda alanı hatalı/çıkmıyor | Mahal (oda) elemanını kapalı tanımlayın |
| Listeyi dışa aktarmadan bırakma | Veri paylaşılamıyor | Çizelgeyi tablo/çıktı olarak dışa aktarın |

## Farklılaştırma
- **Hızlı ilerleyenler:** Ofis için standart bir özellik (attribute) ve poz/kod şablonu taslağı hazırlar.
- **Desteğe ihtiyaç duyanlar:** Yalnızca kapı/pencere çizelgesiyle başlar; metraj ve mahal sonraki oturumda.

## Ödev / bireysel çalışma
Sürekli projede duvar ve kapı/pencerelere özellik atayın; bir metraj listesi ve bir kapı/pencere
çizelgesi üretin. **Teslim:** Çizelge çıktısı + proje dosyası · **Süre:** ~120 dk · **Ölçüt:** Dolu
özellik alanları, doğru miktarlar, filtrelenebilir sınıflandırma.

## Ders sonu kontrol (Quiz-O4B, 8 soru)
1. Metraj neden elle sayım yerine modelden üretilir?
2. Özellik (attribute) ne işe yarar?
3. [Senaryo] Metrajda kapı adı boş çıkıyor; olası neden? (atanmamış attribute)
4. Sınıflandırmanın listeye katkısı nedir?
5. [Sıralama] Özellik → metraj → çizelge adımları nasıl sıralanır?
6. Kütüphane objesi kullanmanın çizgiye göre avantajı nedir?
7. [Hata bulma] Verilen modelde mahal alanının neden çıkmadığını bulun.
8. Mahal listesi neyi dökümler? (oda alanı/işlev)

## Ek kaynaklar
Özellik atanmış örnek proje dosyası (kurum kaynağı eklenecek), attribute ve poz/kod şablonu tablosu
`[sürüme göre doğrula]`.
