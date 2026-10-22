# Envanter kapsamı ve kabul durumu — 22.10.2026

Bu kayıt kullanıcıya teknik kontrolleri devretmez. Kanıt toplama ve teknik kabul proje ekibinin sorumluluğundadır; kullanıcı yalnız içerik/ticari tercih ve faz kararlarını verir. **Faz 0 henüz tam kapanmış sayılmaz.**

## Tamamlanan sonlu kontroller

- Önceki 57 duruma ek olarak 179 canlı durum kaydı; toplam 236 kayıt. Bunlar başarılı test sayısı veya tüm durumların kapsama yüzdesi değildir.
- Precast 15; Mimari 23; Strüktürel 15; Altyapı 15; MEP 11; Yol 10; Şantiye 8; Precast Detail 15 içerik paneli açılıp kaydedildi.
- Ürün seçimi6, sürüm yenilikleri4, Drive Curve6, Steel Components7, SketchUp2 ve lisans rehberi3 durum; eğitim koleksiyonlarının14 adresi ve listedeki metin/medya hedefleri kaydedildi.
- Eğitim teklif girişleri, okul/öğrenci dahil, boş modal ve konu alanıyla kontrol edildi. Harici lisans/CDS formları ve ana teklif formunun erişilebilir dalları ayrıca kaydedildi; gönderim yapılmadı.
- Bilinen503 hashli görselin tamamı HTTP200 ve kaynakla eşit;1364 kaynak dosya yeniden hash edildi. Tam sınıflandırma medya raporunda.
- 100 page.tsx girişi tarandı;65 aday rotanın import/etkileşim kaydı ve161 tam public kaynak snapshotı saklandı. Kaynak kopyaları canlı render eşliği değildir.

## Kanıtlar

- [Canlı durumlar](browser-complete-2026-10-22/states.json), [boş form alanları](browser-complete-2026-10-22/forms.json), [harici form durumları](browser-complete-2026-10-22/external-forms.json).
- [Medya eşleşmeleri ve dış kaynak ek kontrolü](media-complete-2026-10-22.md).
- [Kaynak etkileşim matrisi](interaction-register-2026-10-22.md) ve [form sözleşmeleri](form-state-register-2026-10-22.md).
- [Makine okunur kapsam matrisi](inventory-coverage-2026-10-22.json).

## Bulunan farklar — onarım uygulanmadı

| Bulgu | Kanıt | İşlem / sorumlu |
|---|---|---|
| Video kütüphanesinde Youtube CDS Allplan Add-On, Allplan Bridge, Allplan Bridge Tutorials ve ALLPLAN Pythonparts Youtube Kanalı kartları yalnız `#` hedefine gidiyor | Video-library catalog durumundaki links | Ertelenmiş hedef listesine ekle; Hazar daha sonra hedef/kaldırma kararını verir |
| Webinar Takvimine Göz At ve Etkinlik Takvimi düğmeleri takvim yerine bilgi talep modalı açıyor | Canlı boş modal + readonly subject | Mevcut davranış korunur; UX etiket/görev önerisini biz hazırlarız |
| Lisans yöneticisi harici formunda müşteri no isteğe bağlı, kullanılmayan yerel modalda zorunlu | Harici form AX + kaynak | Harici gerçek form esas; kullanılmayan modal gereksinim olarak taşınmaz |
| Pythonpart/Scalypso başvuruları CDS Add On başlıklı forma gidiyor | Kaynak hedefi + harici form başlık/seçenekleri | Niyet/hedef uyumu sonraki karar; yeni form üretilmedi |
| Webinarın tek Hemen İzle düğmesi 1623090584242 iframe hedefine gidiyor | Canlı dialog host DOM + kaynak placeholder | Çalışan video kabulü yok; teknik ekip doğru hedefi kanıtlayacak |
| Lisans rehberindeki addon.aluplan.com.tr görseli DNS çözümleme hatası verdi | Medya ek kontrol JSON | 404 değil; erişim/alternatif kaynak düzeltme listesinde |
| Eğitim formu kaynakta teslim etmeden başarı gösteriyor; aktivasyon ilk adımda gönderiyor | Form durum raporu | Gerçek teslimat ve güvenlik ayrı uygulama/yayın kabulü; otomatik taşıma yok |

## Kalan teknik işler ve sınırlar

| Kalan | Sorumlu | Kapanış kanıtı |
|---|---|---|
| Canlı gözlemle eşlenmemiş koşullu içerik, image/video dialogları ve global mobil/cookie durumları | Teknik ekip | Aşağıdaki kaynak kayıtlarını rota/durum bazında tamamlamak; kullanıcıya elle kontrol görevi verilmez |
| AX-only kayıtlardaki görsel URL eşlemesi ve tüm dinamik medya ilişkileri | Teknik ekip | DOM img/src/poster ile kaynak eşliği;503 statik kümenin başarısı bunu otomatik kapatmaz |
| 31 aday ve345 referans kanıtı bulunmayan kaynak yolunun yayın kapsamı | Teknik ekip öneri hazırlar; yalnız gerçekten yeni içerikse Hazar karar verir | Silmeden korunur; aynı hashli kopyalar ayrı yeni içerik sayılmaz |
| Ana formun görülmeyen8. ve kişisel alanlardan sonra gelen14. sayfası; gerçek teslim/hata | Teknik ekip + yetkili form sahibi | Yönetici tarafından paylaşılacak form yapısı veya ayrıca yetkili test; sahte/kişisel veri girilmedi |
| Ticari iddialar ve hizmet koşulları | Aluplan ürün/hizmet sorumlusu | Kanıtlı kapsam; fiyat/SLA/sertifika icat edilmez |

Uygulama testleri bu envanter turunun çıktısı değildir. Canlı video akışlarının tamamı oynatılmadı. Bir video dialogu gözlendi; uzun toplu tarayıcı işlemi zaman aşımına uğradığından kaydedilmeyen ara sonuçlar kabul sayısına alınmadı. Kayıtlar her tamamlanan alt gruptan sonra diske yazıldı. Üçüncü taraf video önerileri envanter kapsamı değildir.

## Rota bazında izleme

Sayılar yalnız bu iki JSONdaki kayıtlardır. Sıfır önceki homepage kanıtını geçersiz kılmaz. Dinamik playlist rota sayısı14adresin toplamıdır.

| Rota | Kaynak kaydı | Bu iki JSONda canlı durum |
|---|---|---|
| `/` | `app/(public)/page.tsx` | 0 |
| `/products/allplan-2026-yenilikler` | `app/products/allplan-2026-yenilikler/page.tsx` | 4 |
| `/products/allplan-2026` | `app/products/allplan-2026/page.tsx` | 0 |
| `/products/allplan-aec` | `app/products/allplan-aec/page.tsx` | 0 |
| `/products/allplan-basic` | `app/products/allplan-basic/page.tsx` | 0 |
| `/products/allplan-bimplus` | `app/products/allplan-bimplus/page.tsx` | 0 |
| `/products/allplan-cloud-services` | `app/products/allplan-cloud-services/page.tsx` | 0 |
| `/products/allplan-concept` | `app/products/allplan-concept/page.tsx` | 0 |
| `/products/allplan-professional` | `app/products/allplan-professional/page.tsx` | 0 |
| `/products/allplan-ultimate` | `app/products/allplan-ultimate/page.tsx` | 3 |
| `/products/allplan` | `app/products/allplan/page.tsx` | 0 |
| `/products/architecture` | `app/products/architecture/page.tsx` | 0 |
| `/products/ax3000` | `app/products/ax3000/page.tsx` | 0 |
| `/products/civil` | `app/products/civil/page.tsx` | 3 |
| `/products` | `app/products/page.tsx` | 6 |
| `/products/precast-detail` | `app/products/precast-detail/page.tsx` | 15 |
| `/products/precast` | `app/products/precast/page.tsx` | 15 |
| `/products/sds2-home` | `app/products/sds2-home/page.tsx` | 0 |
| `/references` | `app/references/page.tsx` | 10 |
| `/search` | `app/search/page.tsx` | 6 |
| `/solutions-v2/connect-license/activation` | `app/solutions-v2/connect-license/activation/page.tsx` | 0 |
| `/solutions-v2/connect-license/how-to-assign` | `app/solutions-v2/connect-license/how-to-assign/page.tsx` | 3 |
| `/solutions-v2/faq` | `app/solutions-v2/faq/page.tsx` | 25 |
| `/solutions-v2/training/classroom` | `app/solutions-v2/training/classroom/page.tsx` | 1 |
| `/solutions-v2/training/e-learning` | `app/solutions-v2/training/e-learning/page.tsx` | 1 |
| `/solutions-v2/training/events` | `app/solutions-v2/training/events/page.tsx` | 1 |
| `/solutions-v2/training/individual` | `app/solutions-v2/training/individual/page.tsx` | 1 |
| `/solutions-v2/training/online` | `app/solutions-v2/training/online/page.tsx` | 1 |
| `/solutions-v2/training` | `app/solutions-v2/training/page.tsx` | 11 |
| `/solutions-v2/training/quick-start` | `app/solutions-v2/training/quick-start/page.tsx` | 9 |
| `/solutions-v2/training/video-library/[playlistId]` | `app/solutions-v2/training/video-library/[playlistId]/page.tsx` | 15 |
| `/solutions-v2/training/webinar` | `app/solutions-v2/training/webinar/page.tsx` | 3 |
| `/solutions/addons/drive-curve` | `app/solutions/addons/drive-curve/page.tsx` | 6 |
| `/solutions/addons` | `app/solutions/addons/page.tsx` | 0 |
| `/solutions/addons/parametric-terrain` | `app/solutions/addons/parametric-terrain/page.tsx` | 1 |
| `/solutions/addons/ramp` | `app/solutions/addons/ramp/page.tsx` | 1 |
| `/solutions/addons/sketchup-converter` | `app/solutions/addons/sketchup-converter/page.tsx` | 2 |
| `/solutions/addons/steel-components` | `app/solutions/addons/steel-components/page.tsx` | 7 |
| `/solutions/addons/three-dimensioning` | `app/solutions/addons/three-dimensioning/page.tsx` | 1 |
| `/solutions/allplan-bulut-hizmetleri` | `app/solutions/allplan-bulut-hizmetleri/page.tsx` | 0 |
| `/solutions/allplan-industry` | `app/solutions/allplan-industry/page.tsx` | 0 |
| `/solutions/architecture` | `app/solutions/architecture/page.tsx` | 23 |
| `/solutions/ax3000-virtual-reality` | `app/solutions/ax3000-virtual-reality/page.tsx` | 1 |
| `/solutions/ax3000-yapi-fizigi` | `app/solutions/ax3000-yapi-fizigi/page.tsx` | 1 |
| `/solutions/bimx5` | `app/solutions/bimx5/page.tsx` | 0 |
| `/solutions/bridge-design` | `app/solutions/bridge-design/page.tsx` | 0 |
| `/solutions/features-allplan-bridge` | `app/solutions/features-allplan-bridge/page.tsx` | 0 |
| `/solutions/imar-yonetmeligi-bim-eklentisi` | `app/solutions/imar-yonetmeligi-bim-eklentisi/page.tsx` | 0 |
| `/solutions/infrastructure` | `app/solutions/infrastructure/page.tsx` | 15 |
| `/solutions/mep` | `app/solutions/mep/page.tsx` | 11 |
| `/solutions/modeling-of-precast-girder-bridges` | `app/solutions/modeling-of-precast-girder-bridges/page.tsx` | 0 |
| `/solutions/oska` | `app/solutions/oska/page.tsx` | 0 |
| `/solutions/precast` | `app/solutions/precast/page.tsx` | 0 |
| `/solutions/pythonpart` | `app/solutions/pythonpart/page.tsx` | 0 |
| `/solutions/rebar-engineering` | `app/solutions/rebar-engineering/page.tsx` | 0 |
| `/solutions/road-railway` | `app/solutions/road-railway/page.tsx` | 10 |
| `/solutions/scalypso/converter` | `app/solutions/scalypso/converter/page.tsx` | 0 |
| `/solutions/scalypso/mobile` | `app/solutions/scalypso/mobile/page.tsx` | 0 |
| `/solutions/scalypso/modeler` | `app/solutions/scalypso/modeler/page.tsx` | 0 |
| `/solutions/scalypso` | `app/solutions/scalypso/page.tsx` | 0 |
| `/solutions/scalypso/videos` | `app/solutions/scalypso/videos/page.tsx` | 0 |
| `/solutions/scalypso/viewer` | `app/solutions/scalypso/viewer/page.tsx` | 0 |
| `/solutions/site-planning` | `app/solutions/site-planning/page.tsx` | 8 |
| `/solutions/steel` | `app/solutions/steel/page.tsx` | 0 |
| `/solutions/structural` | `app/solutions/structural/page.tsx` | 15 |

## Belge doğrulaması

JSON dosyaları ayrıştırıldı;161kaynak snapshotının SHA eşliği yeniden doğrulandı. Bağımsız belge incelemesi sayıları ve kapsam sınırlarını; kaynak güvenlik incelemesi form bulgularını kontrol etti. Snapshotlarda mevcut kaynaktan gelen trailing whitespace/EOF boş satırları var: byte/hash eşliğini bozmamak için düzeltilmedi. Yeni yazılan raporlar ve JSONlar snapshot dizini hariç `git diff --check` ile kontrol edilir. Snapshotlar çalıştırılabilir yeni uygulama değil, tarihli kanıt kopyalarıdır. Uygulama build/test çalıştırılmadı.
