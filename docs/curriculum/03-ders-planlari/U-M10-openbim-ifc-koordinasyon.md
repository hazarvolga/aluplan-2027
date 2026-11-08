# U.M10 — openBIM, IFC 4.3, IDS ve CDE Koordinasyonu

**Seviye / Modül:** Uzman / M10 · **Süre:** 10 saat (Temas ~3 · Uygulama ~5 · Bireysel ~2)
**Ön koşul dersler:** U.M9 · **Sürekli proje adımı:** Bu derste sürekli proje IFC olarak teslim
edilir, veri kaybı denetlenir ve referans modelle koordinasyon (kural denetimi, sorun yönetimi)
yürütülür.

## Öğrenme kazanımları
Bu modülün sonunda katılımcı:
1. IFC (Industry Foundation Classes — açık BIM veri formatı) dışa/içe aktarımını **yapar** ve veri
   kaybını **denetler**. [K-U10.1] `[IFC 4.3 / sürüme göre doğrula]`
2. BCF (BIM Collaboration Format — model üstü sorun/yorum paylaşım formatı) ile sorun yönetimini ve
   referans model koordinasyonunu **yürütür**. [K-U10.2]
3. IDS (Information Delivery Specification — bilgi teslim şartnamesi), CDE (Common Data Environment —
   ortak veri ortamı) ve ISO 19650 temel kavramlarını teslim akışına **uygular**. [K-U10.3]

## Temel kavramlar ve terimler
| Terim | Açıklama | İngilizce |
|---|---|---|
| openBIM | Açık formatlarla, markadan bağımsız BIM iş birliği | openBIM |
| IFC | Disiplinler arası açık model veri formatı | Industry Foundation Classes |
| MVD | IFC'nin hangi alt kümesinin aktarılacağını belirleyen görünüm | Model View Definition |
| BCF | Model üstünde sorun ve yorum paylaşım formatı | BIM Collaboration Format |
| Referans model | Başka disiplinin koordinasyon için eklenen modeli | Reference model |
| IDS | Hangi bilginin nasıl teslim edileceğini tanımlayan şartname | Information Delivery Specification |
| CDE | Projedeki tüm verinin toplandığı ortak ortam | Common Data Environment |
| ISO 19650 | BIM ile bilgi yönetimi uluslararası standardı | ISO 19650 |

## Ders akışı (dakika bazlı — çok oturumlu modül; bir oturum örneği)
| Süre | Aşama | Eğitmen yapar | Katılımcı yapar | Materyal |
|---|---|---|---|---|
| 0–5 | Dikkat çekme | Aynı proje, iki yazılım: IFC ile aktarım | Soruyu yanıtlar | Slayt 1 |
| 5–15 | Hedef + ön bilgi | Kazanımlar; openBIM mantığını bağlar | Isınma sorusu | Diyagram |
| 15–40 | Demonstrasyon | IFC dışa aktarır, veri kaybını gösterir | İzler | Örnek proje |
| 40–90 | Rehberli uygulama | Katılımcılarla referans model + BCF kurar | Sorun oluşturur | Adım kartı A3 |
| 90–135 | Bağımsız görev | Dolaşır, IDS/teslimi denetler | IFC teslimini hazırlar | Görev A3 |
| 135–150 | Değerlendirme | Kontrol listesi + mini quiz | Quiz-U10'u çözer | Quiz-U10 |

## Adım adım uygulama yönergesi
1. Teslim şartını (IDS) ve hedef görünümü (MVD) belirleyin; hangi bilginin aktarılacağını
   kararlaştırın. **Neden?** IFC "her şeyi" değil, şartnameye uygun bilgiyi taşımalıdır; önce
   şartname, sonra aktarım. `[sürüme göre doğrula]`
2. Modeli IFC olarak dışa aktarın; doğru IFC sürümünü ve görünümünü seçin. **Neden?** Yanlış sürüm
   veya görünüm, karşı tarafta eksik/okunamayan model demektir. `[IFC 4.3 / sürüme göre doğrula]`
3. Dışa aktarılan IFC'yi boş bir ortamda tekrar içe aktarıp veri kaybını denetleyin (geometri,
   özellik, sınıflandırma). **Neden?** Veri kaybı ancak bağımsız kontrolle görülür; kaynak modele
   bakmak yanıltır.
4. Başka bir disiplinin referans modelini projeye ekleyin ve çakışmaları gözleyin. **Neden?**
   Koordinasyon, modellerin aynı ortamda karşılaştırılmasıyla yapılır.
5. Bulunan sorunları BCF ile oluşturun; konum, açıklama ve sorumlu bilgisini girin. **Neden?** BCF,
   sorunu modelden bağımsız ama konuma bağlı taşır; e-postadan farklı olarak iz bırakır.
6. Teslim paketini CDE/teslim akışına uygun adlandırma ve durum bilgisiyle düzenleyin. **Neden?**
   ISO 19650, bilginin kim tarafından, hangi durumda teslim edildiğinin izlenmesini ister.

## Sık yapılan hatalar ve çözümleri
| Hata | Belirti | Çözüm |
|---|---|---|
| Şartnamesiz (IDS'siz) IFC aktarımı | Karşı taraf bilgi eksik diyor | Önce IDS/MVD belirleyin |
| Yanlış IFC sürümü/görünümü seçme | Model eksik veya açılamıyor | Hedefe uygun sürüm/MVD seçin `[sürüme göre doğrula]` |
| Veri kaybını denetlememe | Teslimden sonra eksik fark edilir | IFC'yi boş ortamda içe aktarıp kontrol edin |
| Sorunu e-posta ile bildirme | İz kalmıyor, konum belirsiz | BCF ile konuma bağlı sorun açın |
| Adlandırma/durum kuralsız teslim | CDE'de dosya karışıyor | ISO 19650 adlandırma ve durumu uygulayın |

## Farklılaştırma
- **Hızlı ilerleyenler:** IDS'e göre otomatik kural denetimi kurar ve BCF sorunlarını referans
  modelde kapatıp yeniden denetler.
- **Desteğe ihtiyaç duyanlar:** Yalnızca IFC dışa aktarımı + veri kaybı kontrolü; BCF ve CDE
  kavramları sonraki oturumda uygulanır.

## Ödev / bireysel çalışma
Sürekli projeyi IDS'e uygun biçimde IFC olarak dışa aktarın, veri kaybını denetleyin ve bir
referans model üzerinde en az iki BCF sorunu oluşturun. **Teslim:** IFC dosyası + denetim notu +
BCF paketi · **Süre:** ~120 dk · **Ölçüt:** Doğru IFC görünümü, belgelenmiş veri kaybı kontrolü,
konuma bağlı anlamlı BCF sorunları.

## Ders sonu kontrol (Quiz-U10, 8 soru)
1. openBIM ve kapalı (tek yazılım) iş akışının farkı nedir?
2. IFC dışa aktarımında MVD neden önemlidir?
3. [Senaryo] Teslim edilen modelde özellikler eksik; olası neden? (yanlış görünüm/sürüm)
4. Veri kaybı en güvenilir nasıl denetlenir? (boş ortamda içe aktarma)
5. BCF'in e-posta ile bildirime göre avantajı nedir?
6. IDS neyi tanımlar? (hangi bilgi, nasıl teslim edilir)
7. [Sıralama] IFC teslim akışının adımları nasıl olmalı?
8. ISO 19650 teslimde neyi izlemeyi ister? (kim, hangi durumda)

## Ek kaynaklar
Örnek IFC dosyası, IDS şablonu ve BCF paketi (kurum kaynağı eklenecek), buildingSMART IFC/BCF
referansları ve ISO 19650 özet notu `[sürüme göre doğrula]`.
