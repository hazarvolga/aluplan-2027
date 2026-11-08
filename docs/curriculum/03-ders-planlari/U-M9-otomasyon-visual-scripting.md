# U.M9 — Otomasyon, Visual Scripting ve PythonParts

**Seviye / Modül:** Uzman / M9 · **Süre:** 12 saat (Temas ~3 · Uygulama ~7 · Bireysel ~2)
**Ön koşul dersler:** Seviye 3'ten en az bir kol · **Sürekli proje adımı:** Bu derste sürekli
projede tekrar eden işler (tekrarlı eleman dizileri, sayısal güncellemeler, liste üretimi) görsel
programlama ve PythonParts ile otomatikleştirilir.

## Öğrenme kazanımları
Bu modülün sonunda katılımcı:
1. Görsel programlama (visual scripting — bloklarla kurulan görsel kod akışı) ile parametrik bir iş
   akışını **kurgular**. [K-U9.1] `[sürüme göre doğrula]`
2. PythonParts (ALLPLAN'ın Python tabanlı özel parametrik obje çatısı) ile özel bir parametrik
   obje/otomasyon **geliştirir**. [K-U9.2] `[sürüme göre doğrula]`

## Temel kavramlar ve terimler
| Terim | Açıklama | İngilizce |
|---|---|---|
| Görsel programlama | Kod yazmadan, blokları bağlayarak kurulan parametrik akış | Visual Scripting |
| Düğüm | Akışta tek bir işlem yapan blok (girdi–işlem–çıktı) | Node |
| Parametre | Dışarıdan değiştirilen değer (sayı, mesafe, adet) | Parameter |
| PythonPart | Python ile tanımlanan özel parametrik obje | PythonPart |
| PYP dosyası | PythonPart'ın arayüz/parametre tanımını tutan dosya | .pyp file |
| Otomasyon | Tekrar eden bir işin tek komutla üretilmesi | Automation |

## Ders akışı (dakika bazlı — çok oturumlu modül; bir oturum örneği)
| Süre | Aşama | Eğitmen yapar | Katılımcı yapar | Materyal |
|---|---|---|---|---|
| 0–5 | Dikkat çekme | Elle 50 kolon vs. tek akışla 50 kolon | Farkı söyler | Slayt 1 |
| 5–15 | Hedef + ön bilgi | Kazanımlar; parametrik mantığı bağlar | Isınma sorusu | Diyagram |
| 15–40 | Demonstrasyon | Basit bir görsel akış kurar (dizi üretir) | İzler | Örnek akış |
| 40–95 | Rehberli uygulama | Katılımcılarla akışı parametrik hale getirir | Düğümleri bağlar | Adım kartı A3 |
| 95–150 | Bağımsız görev | Dolaşır, akışı ve PythonPart'ı denetler | Kendi otomasyonunu kurar | Görev A3 |
| 150–165 | Değerlendirme | Kontrol listesi + mini quiz | Quiz-U9'u çözer | Quiz-U9 |

## Adım adım uygulama yönergesi
1. Otomatikleştirilecek tekrar eden işi tanımlayın (ör. aks boyunca kolon dizisi).
   **Neden?** Otomasyon ancak işin kuralı net olduğunda doğru sonuç verir; önce kural, sonra akış.
2. Görsel programlama ortamını açın ve girdi parametrelerini (adet, aralık, yükseklik) tanımlayın.
   **Neden?** Parametreler dışarıdan değişince akış yeniden çizilmeden güncellenir. `[sürüme göre doğrula]`
3. Düğümleri sırayla bağlayın: girdi → geometri üretimi → yerleştirme. **Neden?** Her düğüm tek
   iş yaptığında akış okunur kalır ve hatayı bulmak kolaylaşır.
4. Akışı farklı parametre değerleriyle çalıştırıp çıktıyı doğrulayın. **Neden?** Otomasyonun
   güvenilirliği, sınır değerlerde (0, çok büyük adet) test edilerek anlaşılır.
5. Tekrarlı özel bir obje için basit bir PythonPart iskeleti oluşturun; parametreleri PYP
   arayüzünden girin. **Neden?** PythonPart, görsel akışın yetmediği özel geometri ve kuralları
   kodla tanımlamayı sağlar. `[sürüme göre doğrula]`
6. PythonPart'ı sürekli projeye yerleştirip parametre değişiminde modelin güncellendiğini
   denetleyin. **Neden?** Amaç tek seferlik geometri değil, yeniden kullanılabilir bir araçtır.

## Sık yapılan hatalar ve çözümleri
| Hata | Belirti | Çözüm |
|---|---|---|
| Kuralı netleştirmeden akışa başlama | Akış çalışır ama yanlış dizer | Önce girdi/çıktı kuralını yazın |
| Değeri akışa gömme (hardcode) | Parametre değişince güncellenmez | Değeri girdi parametresine taşıyın |
| Düğümleri yanlış sırada bağlama | Boş veya hatalı çıktı | Girdi→işlem→çıktı sırasını izleyin |
| PYP arayüzü ile kodun uyuşmaması | Parametre girildiği halde etkisiz | PYP parametre adını kodla eşleyin `[sürüme göre doğrula]` |
| Sınır değerleri test etmeme | Uçlarda çöküş/boş sonuç | 0 ve büyük değerlerle deneyin |

## Farklılaştırma
- **Hızlı ilerleyenler:** Akışa koşul (ör. kat yüksekliğine göre farklı eleman) ekleyip
  PythonPart'a ikinci bir parametre katar.
- **Desteğe ihtiyaç duyanlar:** Yalnızca hazır bir görsel akışı parametre değiştirerek çalıştırır;
  PythonPart bir sonraki oturuma bırakılır.

## Ödev / bireysel çalışma
Sürekli projede tekrar eden bir işi (ör. merdiven basamakları veya cephe bölme dizisi) görsel
programlama ile otomatikleştirin ve en az bir parametresi dışarıdan değişen küçük bir PythonPart
üretin. **Teslim:** Akış dosyası + PythonPart + 3B görünüm · **Süre:** ~120 dk · **Ölçüt:**
Parametre değişiminde modelin doğru güncellenmesi, gömülü değer bulunmaması.

## Ders sonu kontrol (Quiz-U9, 8 soru)
1. Görsel programlama ile elle modellemenin temel farkı nedir?
2. Bir düğüm (node) ne yapar? (tek işlem: girdi–işlem–çıktı)
3. [Senaryo] Parametre değişince akış güncellenmiyor; olası neden? (değer gömülü)
4. PythonPart hangi durumda görsel akışa tercih edilir?
5. [Sıralama] Bir otomasyon akışını kurma adımları nasıl olmalı?
6. PYP dosyası neyi tanımlar? (parametre/arayüz)
7. [Hata bulma] Verilen akışta yanlış bağlanan düğümü bulun.
8. Otomasyonu neden sınır değerlerde test ederiz?

## Ek kaynaklar
Örnek görsel akış ve PythonPart iskelet dosyası (kurum kaynağı eklenecek), ALLPLAN Python API
referansı ve parametre tablosu `[sürüme göre doğrula]`.
