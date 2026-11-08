# İ.M3B — İleri Mimari Modelleme ve Sunum

**Seviye / Modül:** İleri · Mimari / M3B *(önerilen)* · **Süre:** 16 saat (Temas ~3 · Uygulama ~9 · Bireysel ~4)
**Ön koşul:** Seviye 2 tamamlanmış · **Sürekli proje adımı:** Bu derste sürekli projenin mimari
kolunda cephe (façade) detayı modellenir ve görselleştirme (render) çıktısı alınır.

## Öğrenme kazanımları
Bu modülün sonunda katılımcı:
1. Karmaşık geometri ile cephe ve giydirme cephe (curtain wall) sistemlerini **modeller**. [K-İ3B.1] `[sürüme göre doğrula]`
2. Tasarım varyantlarını (design variants) ve görselleştirme çıktısını **oluşturur**. [K-İ3B.2]

## Temel kavramlar ve terimler
| Terim | Açıklama | İngilizce |
|---|---|---|
| Cephe | Binanın dış yüzeyini oluşturan yapı katmanı | Façade / Fassade |
| Giydirme cephe | Taşıyıcı olmayan, panel ve profillerden oluşan dış kabuk | Curtain wall |
| Serbest geometri | Standart elemanlara sığmayan, modelle oluşturulan biçim | Freeform / Solid |
| Tasarım varyantı | Aynı projenin karşılaştırılabilir alternatif çözümü | Design variant |
| Görselleştirme | Modelden gerçekçi ışıklı görsel üretme | Rendering |
| Malzeme/kaplama | Yüzeye atanan görsel ve fiziksel doku | Material / Surface |

## Ders akışı (dakika bazlı — çok oturumlu modül; bir oturum örneği)
| Süre | Aşama | Eğitmen yapar | Katılımcı yapar | Materyal |
|---|---|---|---|---|
| 0–5 | Dikkat çekme | Düz duvar vs. giydirme cephe örneği | Farkı söyler | Slayt 1 |
| 5–15 | Hedef + ön bilgi | Kazanımlar; Seviye 2 modelini bağlar | Isınma sorusu | Diyagram |
| 15–40 | Demonstrasyon | Cephe gridini ve panel sistemini kurar | İzler | Örnek proje |
| 40–95 | Rehberli uygulama | Katılımcılarla cephe modelini oluşturur | Grid + panel yerleştirir | Adım kartı A3 |
| 95–130 | Bağımsız görev | Dolaşır, geometriyi denetler | Varyant + malzeme ekler | Görev A3 |
| 130–145 | Görselleştirme | Kamera, ışık, render ayarını gösterir | Render alır | Render ön ayarı |
| 145–155 | Değerlendirme | Kontrol listesi + mini quiz | Quiz-İ3B'yi çözer | Quiz-İ3B |

## Adım adım uygulama yönergesi
1. Cephe için bir referans yüzey veya grid (grid / ızgara) tanımlayın. **Neden?** Panel ve profiller
   gride bağlanınca ölçü değişikliği tüm cepheye tutarlı yansır. `[sürüme göre doğrula]`
2. Giydirme cephe panellerini ve taşıyıcı profilleri yerleştirin. **Neden?** Panel bir nesnedir;
   cam/dolgu alanı ve profil metrajı otomatik üretilir.
3. Standart elemana sığmayan bölümleri serbest geometri (freeform) ile modelleyin. **Neden?**
   Karmaşık biçim çizgiyle değil katı/yüzey nesnesiyle kurulursa düzenlenebilir kalır.
4. Yüzeylere malzeme ve kaplama atayın. **Neden?** Malzeme hem görselleştirmeyi hem de yüzey
   metrajını besler.
5. İkinci bir tasarım varyantı türetin (örneğin farklı panel bölüntüsü). **Neden?** Varyantlar
   karşılaştırmayı kolaylaştırır; ana model bozulmadan alternatif denenir. `[sürüme göre doğrula]`
6. Kamera açısı, ışık ve render ön ayarını tanımlayıp görsel çıktı alın. **Neden?** Sabit kamera ve
   ışık, varyantların adil karşılaştırılmasını sağlar.

## Sık yapılan hatalar ve çözümleri
| Hata | Belirti | Çözüm |
|---|---|---|
| Panelleri gride bağlamama | Ölçü değişince cephe dağılıyor | Panelleri referans gride yakalatın |
| Serbest geometriyi çizgiyle kurma | Biçim düzenlenemiyor | Katı/yüzey nesnesi olarak modelleyin |
| Malzeme atanmaması | Render gri/boş görünüyor | Yüzeylere malzeme/kaplama atayın |
| Varyantı ana modele yazma | Alternatif denerken proje bozuluyor | Varyantı ayrı katman/kopya üzerinde kurun |
| Her varyantta farklı kamera | Görseller karşılaştırılamıyor | Ortak kamera ve ışık ön ayarı kullanın |

## Farklılaştırma
- **Hızlı ilerleyenler:** Üçüncü bir varyant ve gece/gündüz iki ışık senaryosuyla render seti üretir.
- **Desteğe ihtiyaç duyanlar:** Tek düzlemli giydirme cephe + tek malzeme + tek kamera ile başlar;
  serbest geometri bir sonraki oturuma bırakılır.

## Ödev / bireysel çalışma
Sürekli projenin bir cephesini giydirme cephe olarak modelleyin, iki tasarım varyantı türetin ve her
varyant için aynı kameradan bir render alın.
**Teslim:** Proje dosyası + 2 render görseli · **Süre:** ~120 dk · **Ölçüt:** Gride bağlı paneller,
atanmış malzemeler, ortak kameradan karşılaştırılabilir görseller.

## Ders sonu kontrol (Quiz-İ3B, 8 soru)
1. Giydirme cephe ile standart duvarın farkı nedir?
2. Panelleri gride bağlamanın avantajı nedir?
3. [Senaryo] Render gri çıkıyor; olası neden?
4. Serbest geometri neden çizgiyle değil nesneyle kurulur?
5. [Sıralama] Cephe modelleme sırası nasıl olmalı?
6. Tasarım varyantı ne işe yarar?
7. [Hata bulma] Verilen iki görselin neden karşılaştırılamadığını bulun.
8. Malzeme ataması hangi iki çıktıyı birlikte besler? (görselleştirme + metraj)

## Ek kaynaklar
Başlangıç ve bitmiş cephe dosyası (kurum kaynağı eklenecek), malzeme/kaplama kütüphanesi ve render
ön ayar tablosu `[sürüme göre doğrula]`.
