# İ.M6 — Çelik Yapı Tasarımı ve SDS2

**Seviye / Modül:** İleri · Prefabrik-Çelik / M6 · **Süre:** 8 saat (Temas ~2 · Uygulama ~5 · Bireysel ~1)
**Ön koşul dersler:** Seviye 2 tamamlanmış · **Sürekli proje adımı:** Bu derste sürekli projeye
çelik bir ara kat/çatı iskeleti (kolon, kiriş, bağlantı) eklenir.

## Öğrenme kazanımları
Bu modülün sonunda katılımcı:
1. Çelik yapı elemanlarını (profil, kolon, kiriş) doğru kesit ve kalite ile **modeller**. [K-İ6.1]
2. Çelik bağlantıları (birleşim, levha, bulon) **oluşturur** ve detaylandırır. [K-İ6.2]
3. SDS2 entegrasyonu ile üretim/detay aktarım akışını **tanımlar**. [K-İ6.3] `[SDS2 entegrasyonunu sürüme göre doğrula]`

## Temel kavramlar ve terimler
| Terim | Açıklama | İngilizce |
|---|---|---|
| Çelik profil | Standart kesitli (I, H, boru, lama) taşıyıcı eleman | Steel profile / section |
| Çelik kolon | Düşey taşıyıcı çelik eleman | Steel column |
| Çelik kiriş | Yatay taşıyıcı çelik eleman | Steel beam / girder |
| Bağlantı | İki elemanı birleştiren levha + bulon + kaynak düzeni | Connection / joint |
| Bulon | Elemanları birleştiren sökülebilir cıvata | Bolt |
| SDS2 | Çelik detay ve üretim yazılımı; model aktarım köprüsü | SDS2 (steel detailing) |

## Ders akışı (dakika bazlı — çok oturumlu modül; bir oturum örneği)
| Süre | Aşama | Eğitmen yapar | Katılımcı yapar | Materyal |
|---|---|---|---|---|
| 0–5 | Dikkat çekme | Betonarme vs. çelik iskelet karşılaştırması | Farkı söyler | Slayt 1 |
| 5–15 | Hedef + ön bilgi | Kazanımlar; Seviye 2 metrajı bağlar | Isınma sorusu | Diyagram |
| 15–40 | Demonstrasyon | Profil kütüphanesinden kolon + kiriş yerleştirir | İzler | Örnek proje |
| 40–95 | Rehberli uygulama | Katılımcılarla çelik çerçeve kurar | Elemanları yerleştirir | Adım kartı A3 |
| 95–130 | Bağımsız görev | Dolaşır, bağlantıları denetler | Bağlantı + bulon ekler | Görev A3 |
| 130–140 | Değerlendirme | Kontrol listesi + mini quiz | Quiz-İ6'yı çözer | Quiz-İ6 |

## Adım adım uygulama yönergesi
1. Çelik profil kütüphanesinden (profile library) uygun kesiti seçin; malzeme kalitesini (örn. S235) girin.
   **Neden?** Kesit ve kalite, hem statik hem metraj çıktısını doğrudan belirler. `[sürüme göre doğrula]`
2. Çelik kolonları akslara yerleştirin. **Neden?** Akslara bağlı eleman, değişiklikte tüm sisteme
   tutarlı yansır.
3. Kolonlar arasına çelik kirişleri geçirin ve uç kotlarını hizalayın. **Neden?** Kot uyumsuzluğu,
   bağlantı modelini ve üretim verisini hatalı yapar.
4. Kolon-kiriş birleşimlerine bağlantı elemanlarını (levha, bulon) ekleyin. **Neden?** Bağlantı,
   çelik yapının taşıma ve montaj mantığını tanımlar; detay ve üretim buradan türer. `[sürüme göre doğrula]`
5. Modeli SDS2 aktarımı için hazırlayın (eleman adlandırma, kesit eşlemesi kontrolü).
   **Neden?** Üretim yazılımına temiz veri gitmezse detay ve CNC çıktısı bozulur. `[SDS2 entegrasyonunu sürüme göre doğrula]`
6. Çelik elemanların metraja ve ağırlık listesine doğru yansıdığını kontrol edin.

## Sık yapılan hatalar ve çözümleri
| Hata | Belirti | Çözüm |
|---|---|---|
| Yanlış profil kesiti seçme | Statik ve ağırlık hatalı | Kütüphaneden doğru kesiti yeniden atayın |
| Kiriş uç kotunu hizalamama | Bağlantı modeli boşlukta | Uç kotlarını kolon aksına hizalayın |
| Bağlantı elemanını atlama | Montaj ve detay çıkmıyor | Birleşime levha + bulon ekleyin |
| SDS2 için adlandırma tutarsızlığı | Aktarımda eleman eşleşmiyor | Adlandırma/kesit eşlemesini aktarımdan önce düzeltin `[sürüme göre doğrula]` |

## Farklılaştırma
- **Hızlı ilerleyenler:** İkinci bir açıklıkta farklı profil kesitiyle çerçeve türetir ve bağlantıları varyantlar.
- **Desteğe ihtiyaç duyanlar:** Yalnızca tek açıklıklı kolon + kiriş çerçevesi; bağlantı detayı bir sonraki oturumda.

## Ödev / bireysel çalışma
Sürekli projeye tek açıklıklı çelik çerçeve ekleyin: kolonlar, kirişler ve en az iki kolon-kiriş bağlantısı.
**Teslim:** Proje dosyası + 3B görünüm + ağırlık listesi · **Süre:** ~60 dk · **Ölçüt:** Doğru kesit/kalite,
akslara hizalı elemanlar, tanımlı bağlantılar.

## Ders sonu kontrol (Quiz-İ6, 8 soru)
1. Çelik profil seçerken neden kalite (örn. S235) de belirtilir?
2. Çelik kolon neden aksa oturtulur?
3. [Senaryo] Bağlantı modeli boşlukta görünüyor; olası neden?
4. Bağlantı elemanı (levha + bulon) hangi bilgiyi tanımlar?
5. [Sıralama] Çelik çerçeve modelleme sırası nasıl olmalı?
6. SDS2 aktarımından önce neden adlandırma/kesit eşlemesi kontrol edilir? `[sürüme göre doğrula]`
7. [Hata bulma] Verilen modelde yanlış profil atamasını bulun.
8. Çelik elemanın ağırlık listesine çıkması neden önemlidir? (metraj/üretim)

## Ek kaynaklar
Başlangıç ve bitmiş çelik çerçeve dosyası (kurum kaynağı eklenecek), profil/kesit kütüphane tablosu
ve SDS2 aktarım kontrol listesi `[sürüme göre doğrula]`.
