# Aluplan Akademi ve Bilgi Bankası: kararlar ve yol haritası

**Durum:** Taslak, beyin fırtınası çıktısı (08.11.2026). Tam tasarım belgesi henüz yazılmadı ve onaylanmadı. Bu belge şu ana kadar alınan kararları kaydeder.

## Amaç
- Türkçe ALLPLAN kaynağı oluşturmak. ALLPLAN Learn Now'da Türkçe dil seçeneği yok (08.11.2026 kontrolü).
- Aluplan'ı arama (SEO) ve yapay zekâ yanıt motorlarında (GEO) öne çıkarmak.
- İlk hedef: ALLPLAN kullanıcı sayısını artırmak. Başarı ölçütü toplanan e-posta sayısı değil, akademiden öğrenci lisansı, deneme sürümü ve Aluplan eğitimine giden kişi sayısıdır.

## Alınan kararlar
1. **Yer:** `aluplan.com.tr` altında iki bölüm: `/akademi` (müfredat) ve `/bilgi-bankasi` (Learn Now'dan Türkçeleştirilmiş makaleler). Ayrı domain veya alt alan adı kullanılmaz. Diğer domainler (`allplan.tr`, `allplan.com.tr`, `aluplan.tr` vb.) yalnızca yönlendirme için kalır.
2. **İzin:** ALLPLAN içerik kullanımına sözlü olarak olumlu yanıt verdi. Yazılı izin kullanıcı tarafından alınacak. Bilgi bankası yayını yazılı izinle başlar.
3. **İçerik açık:** Dersler ve makaleler e-posta duvarı arkasına konmaz (SEO/GEO için şart).
4. **Sertifika sitede verilmez.** Sitedeki quizler öz değerlendirmedir ve sertifika olarak adlandırılmaz. Sertifika Aluplan'ın eğitmenli eğitimlerinde verilir; doğrulama için mevcut `aluplan-sertifka-sorgulama` projesi değerlendirilir.
5. **Quiz ilerlemesi:** İlk aşamada yalnızca kullanıcının tarayıcısında tutulur (hesap yok, kişisel veri sunucuya gitmez). İlerlemeyi dosya olarak indirip geri yükleme seçeneği düşünülür.
6. **Hesap ve bülten (sonraki aşama):** E-posta yalnızca quiz sonuçlarını cihazlar arasında takip etmek isteyenlerden alınır. Bülten için ayrı, işaretsiz gelen ve hesaba şart koşulmayan bir onay kutusu olur. Asgari veri: e-posta, isteğe bağlı ad. Coolify güvenlik bakımı ve hukuki teyit (KVKK aydınlatma, İYS gerekliliği) tamamlanmadan kişisel veri tutulmaz.
7. **Müfredat:** `bim-egitim-mufredati` skill'inin önerilerine göre hizalanır; temel olarak mevcut PRD (4 seviye, 10 modül, 120 saat) alınır.
   - Seviye 1 ve 2 ortak çekirdek; Seviye 3'te eşit süreli disiplin kolları (mimari, betonarme ve 3B donatı, prekast ve çelik, altyapı ve köprü); Seviye 4 ortak (openBIM, IFC/IDS, otomasyon).
   - Disiplin ağırlığı eşit, çünkü pazar araştırması verisi yok. Kol seçimleri analitik onayı verenlerde ölçülerek ileride veriyle ayarlanır.
   - Öğrenci ve profesyonel aynı seviyelere farklı yerlerden girer: seviye belirleme quizi ve kısa bir "Revit'ten ALLPLAN'a" geçiş modülü.
   - Sürekli proje: 4-5 katlı betonarme karma kullanımlı bina; altyapı kolu için küçük prekast kirişli köprü projesi.
   - Kazanımlar Bloom fiilleriyle kodlanır (`B1.M1.D1`, `K-B1.1`, `S-...`). Emin olunmayan ALLPLAN araç adları `[sürüme göre doğrula]` ile işaretlenir.
8. **Tek kaynak, iki görünüm:** Her ders bir kez yapılandırılmış olarak yazılır; aynı kaynaktan sitede öğrenci sayfası ve eğitmenli eğitim için yazdırılabilir ders planı üretilir.
9. **İçerik yönetimi:** İçerik `aluplan-2027` deposunda `content/akademi/` altında düz Markdown ve YAML olarak tutulur. CMS şimdilik yok; ileride aynı dosyaların üstüne git tabanlı görsel editör eklenebilir.
10. **İş akışı:** Her iş test edilip main'e birleştirilir; yayın öncesi `restore/` etiketi alınır.

## Proje sırası
1. **Müfredat:** program kimliği, kodlu kazanımlar ve hizalama matrisi, program mimarisi; ardından ders planları, soru bankası, eğitmen rehberi.
2. **Akademi altyapısı:** `/akademi` bölümü, içerik yapısı ve kontrol testleri, öğrenci sayfası, eğitmen yazdırma görünümü, tarayıcıda quiz ilerlemesi, yayın bayrağı.
3. **Bilgi bankası:** seçilmiş başlangıç grubu, görsellerin kendi sunucumuza alınması, kaynak notu, aşamalı yayın.
4. **Hesap ve bülten:** güvenlik bakımı ve hukuki teyitten sonra.

## Açık konular
- `tr` klasöründeki düzeltmelerin (`tr/fixes`) son kontrolünün tamamlandığı doğrulanmadı.
- Arayüz terimleri ALLPLAN 2020 Türkçe arayüzünden; güncel sürümde doğrulanmalı.
- Türkiye'de BIM zorunluluğuna dair "Dijital Proje Hazırlama Yönetmeliği" iddiası resmî kaynaktan doğrulanmadı.
- PRD'deki seviye-modül eşleşmesi kendi içinde tutarsız (Seviye 2'de donatı modülü); müfredat aşamasında düzeltilecek.
- Resmî ALLPLAN online sertifikasının adı ve içeriği doğrulanmadı.
