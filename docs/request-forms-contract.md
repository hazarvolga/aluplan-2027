> **26.10.2026 güncel karar:** Aşağıdaki Next.js kısa form sözleşmesi gelecek aday plandır ve şimdilik ertelenmiştir. Kullanıcı mevcut tek Microsoft Forms ile devam etmeyi seçti. Uygulamada ortak talep hedefi `https://forms.office.com/r/hXhnKAG912`; yerel talep modalı kaldırılmış, sahte başarı veren POST adresleri 410 ile emekliye ayrılmıştır. Lisans yöneticisi formu, deklarasyon PDF'si, destek ve resmî deneme indirmesi ayrı görevlerdir. S04 kanıtı: `docs/verification/stabilization-2026-10-26/forms-after.json`.

# Next.js kısa formlar: alan ve takip sözleşmesi

22.10.2026 — Kullanıcı **Next.js içinde niyete özel kısa formlarla ilerlemeyi onayladı**. Bu belge bu yön için planlanan alanları, kayıt akışını ve schema sınırlarını netleştirir. Kod yazma, mevcut formu değiştirme, CRM seçme veya yayın izni değildir. Önceki [platform karşılaştırması](form-platform-comparison.md) tarihsel gerekçedir; araç seçimi artık açık soru değildir.

## Kapsam ve karar durumu

- Kabul edilmiş yön: teklif, deneme ve eğitim için kısa Next.js girişleri; ortak takip yaklaşımı.
- Bu belgenin teknik planı: ortak alan sözleşmesi, üç niyet, kalıcı kayıt ve bildirim ayrımı, durum geçişleri, schema ilişkileri. Alan sınırları uygulama öncesi sözleşme taslağıdır; kullanıcıya onaylanmış ticari koşul gibi sunulmaz.
- Açık işletim kararları: deneme formu indirmeden önce zorunlu mu; takip kaydının tutulacağı araç, gerçek sorumlular; kişisel veri saklama/aydınlatma metni. Bunlar uygulama öncesinde kapanır.
- Bu tur yok: müşteri hesabı, dosya yükleme, ödeme, otomatik teklif fiyatı, rezervasyon, yeni CRM/yönetim paneli veya Microsoft Forms'a gizli gönderim.

## Giriş sayısı ile ürün seçeneklerinin ayrımı

Kullanıcı, mevcut formdaki üç kategori altında çok sayıda seçenek bulunduğunu hatırlattı. “Üç kısa giriş” üç ürün, üç bağımsız backend veya bütün seçenekleri üçe azaltma kararı değildir. Mevcut kök kategoriler **Teklif / Download / Eklenti**, önerilen kullanıcı amaçları ise **ticari bilgi-teklif / deneme yardımı / eğitim ihtiyacı**dır. Bunlar bire bir aynı sınıflandırma değildir. Eklenti bir ürün ailesidir; o eklenti için teklif veya deneme niyeti olabilir. Eğitim ise mevcut kök formda olmayan, kullanıcının korunmasını istediği talep ihtiyacıdır.

Yeni görünüm önce niyeti ve sayfadan gelen ürün bağlamını kullanır, yalnız ilgili ek alanları açar. Giriş sayısı ve ekran sayısı bu sözleşmeyle dondurulmaz; mevcut seçenekleri gösteren aşağıdaki kapsam eşlemesi esastır. Genel girişte “Ne istediğimden emin değilim” üzerinden yönlendirme yapılabilir.

| Mevcut bölüm / seçenekler | Planlanan yer | Koruma / açık kapsam |
|---|---|---|
| 1: Teklif, Download, Eklenti | Genel yönlendirme veya ürün sayfasından doğrudan ilgili niyet | Eski seçenekler kanıtta korunur; yeni navigasyon metni henüz yayınlanmaz |
| 2–3: ALLPLAN; teknik bilgi/fiyat; Basic, Concept, Professional, Ultimate, Civil, Precast, License Server | Teklif girişinde ürün + isteğe bağlı paket/ek bileşen | Teknik bilgi ihtiyacı “ürün bilgisi” seçeneğiyle açıkça korunur; paketi bilmek şart değil |
| 3: SDS2, FRILO Editions, FRILO Geotechnics, SCIA Engineer Editions | Teklif girişinde ayrı ürün kayıtları | ALLPLAN paketi gibi modellenmez; mevcut formdaki toplu başlık doğru taksonomi kanıtı değil |
| 4: AX3000 MEP; Havalandırma, Isıtma, Soğutma, Sıhhi Tesisat, Elektrik | AX3000 seçilince ilgili modül çoklu seçimi | Mevcut parantezli kapsam açıklamaları kaynak kaydında tam korunur; doğrulanmadan yeni lisans hakkı ilan edilmez |
| 5: BIMX5; Oska e-Hakediş Pro, 2B DWG Converter, İmar Yönetmeliği, Kurumlar Raporları | BIMX5/ilgili çözüm bağlamında birden fazla ilgi seçimi | Ticari paket ilişkisi ayrıca doğrulanır; seçenekler kaybolmaz |
| 6–7: CDS; Sürüş Eğrisi, Rampa, Geometri Araçları, Parametrik Arazi, Çelik Profil Bileşenleri, 3B Ölçülendirme, 2B DWG Converter, SketchUp Dönüştürücü, Grafiksel Yazı | Eklenti kataloğundan teklif/ürün bilgisi; ilgili ürün seçimleri | Eski yanlış bağımsız CDS form hedefi taşınmaz; yeni hedef geçişi ayrıca hazırlanır |
| 6/8: Scalypso deneme talebi | Ürün bağlamı Scalypso olan deneme/ürün bilgisi girişi | ALLPLAN indirme adresine otomatik gitmez. Doğru temin hedefi/işletim doğrulanacak; bölüm6Scalypso seçiminin8i atlayıp13e gitmesi yeni akışa otomatik kopyalanmaz;8→13bölüm çıkışı ayrı ve normal bir geçiştir |
| 9: Aluplan BIM Eklentisi2023/2024; müşteri no | Mevcut müşteri eklenti talebi alt yolu | Tarihli seçenekler korunur; güncel hak/temin ve müşteri no gerekliliği doğrulanmadan sıradan satış lead'ine indirgenmez |
| 10: Allto PythonPart12seçenek +5bedelsiz ürün açıklaması | Allto ürün ilgisi/temin talebi alt yolu | Tam adlar yönetici JSONunda korunur; bedelsiz içerik temini için form zorunluluğu ayrıca değerlendirilecek |
| 6: SDS2 Ultimate | SDS2 ürün bağlamlı teklif/ürün bilgisi | Eklenti başlığı altında bulunması yeni modelde ALLPLAN eklentisi demek değildir |
| 11–12: Ticari deneme / Öğrenci versiyonu, belge bilgileri, bölüm | Ticari deneme ayrı; öğrenci lisansı için ayrı yönlendirme alt yolu | Öğrenci süreci üç satış/eğitim formundan birine zorla sokulmaz. Üretici başvuru yolu ve Aluplan'ın rolü doğrulanana kadar ayrı kapsam kaydı |
| 13: Demografik bilgiler | Ortak iletişim alanları; niyete göre gerekli bilgiler | Eski zorunluluklar aynen kopyalanmaz; şehir/duyum kaynağını ilk adımdan çıkarmak öneridir, kaynakta silinmez |
| 14: Gizlilik / kullanım bağlantıları | Ortak aydınlatma ve hukuken onaylı gönderim bölümü | Eski metni var diye yeni hukuki yeterlilik varsayılmaz |
| Özel eğitim (mevcut kök formda ayrı seçenek yok) | Eğitim talebi girişi | Kullanıcı isteğiyle planlanır; mevcut formda varmış gibi gösterilmez |

**Kapsam sınırı:** Üç çekirdek niyet bu belgeyle tarif edilir; öğrenci lisansı ve mevcut müşteriye hak/eklentinin teslimi gibi işlemler ayrı alt yol gerektirebilir. Bunları tamamlanmış tasarım veya ticari teklif alt türü saymıyoruz. Önce doğru işletim ayrımı; ardından kaç ekran/form varyantı gerektiği belirlenir. Bütün mevcut alan/seçeneklerin tam metin kanıtı [yönetici kaydındadır](00-inventory/form-admin-2026-10-22.json); bu eşleme orijinal içeriğin yerine geçen kısaltılmış yayın metni değildir.

## Ortak alan sözleşmesi

| Alan / iç ad | Durum ve sınır | Davranış |
|---|---|---|
| Ad soyad / fullName | Zorunlu, boşluklar temizlendikten sonra 1–120 karakter | İki kelime/yalnız Türkçe harf şartı yok |
| E-posta / email | Zorunlu, en fazla254karakter; sunucuda biçim kontrolü | Kişisel alan adı kabul edilir. Biçim kontrolü sahiplik/teslimat kanıtı değildir |
| Firma / company | İsteğe bağlı, en fazla160karakter | Bireysel/öğrenci başvurusunu engellemez |
| Telefon / phone | İsteğe bağlı; telefonla dönüş seçildiyse zorunlu, en fazla40karakter | Metin alanı; + ve baştaki0korunur, ülke biçimleri desteklenir; tamsayı değil |
| Dönüş tercihi / contactPreference | Varsayılan e-posta; e-posta veya telefon | İletişim izni ya da pazarlama aboneliği yerine geçmez |
| Ek açıklama / message | İsteğe bağlı, en fazla2000karakter | Hassas belge/şifre istenmez; HTML çalıştırılmaz |

Alan etiketleri ve yardım metinleri içerik katmanında; renk/boşluk/hata görünümü tokenlarda; zorunluluk, seçenekler ve sunucu kuralları ayrı form sözleşmesinde tutulur. Tema değiştirmek alan zorunluluğunu veya takip hedefini değiştiremez.

Aydınlatma bağlantısı gönderim çevresinde görünür olur. Gerekli hukuki metin/işaret kutusu kararı yetkili incelemesiyle belirlenir; “pazarlama izni vermeden talep gönderemezsin” yaklaşımı varsayılmaz. İlk kapsamda bülten aboneliği önerilmiyor. Hukuki dayanak veya saklama süresi burada icat edilmez.

## 1. Teklif / çözüm seçimi — quote

Başlık: **Teklif veya ürün seçimi için bize ulaşın**. Gönderim: **Talebimi gönder**. Paket bilmek zorunlu değildir.

| Ek alan | Durum | Değer / kaynak |
|---|---|---|
| Talep konusu / quotePurposes | En az bir seçim; çoklu seçim | Fiyat teklifi; ürün hakkında teknik bilgi; uygun çözümü seçmek için yardım. Teknik bilgi ve fiyat birlikte istenebilir |
| Ürün / productSelection | Zorunlu; “Henüz bilmiyorum” geçerli | Yayımlanması onaylı ürün kayıtlarından; ana ürün sonrası ilgili modül/eklentiler çoklu seçilebilir; birden fazla ürün ilgisi kayıpsız taşınır |
| Paket / editionRefs | İsteğe bağlı | Her ürün için kendi geçerli paketleri; birden çok ilgi kaydedilebilir, “Karar vermedim” mümkün |

Ürün sayfasından gelen seçim görünür ve değiştirilebilir. Ürün değişirse uyumsuz paket temizlenir; sessizce farklı pakete çevrilmez. Tarihi sürüm sayfası yalnız kaynak bağlamıdır, kullanıcı adına sürüm tercihi yapılmaz. Koltuk sayısı, bütçe, satın alma tarihi, şehir ve “bizi nereden duydunuz” ilk temasın zorunlu alanı değildir; takipte ihtiyaç halinde sorulur.

Teknik sorunu olan mevcut kullanıcı için Teams/ticket yolu açıkça gösterilir; bu üç form destek sisteminin yerine geçmez. Başarı metni taslağı: **Talebiniz kaydedildi. Başvuru numaranız: …** Fiyatın hazır olduğu veya belirli sürede dönüş yapılacağı söylenmez.

## 2. Deneme ve Türkiye yardımı — trial_assistance

Form başlığı: **ALLPLAN denemesi için bilgi veya yardım isteyin**. Gönderim: **Yardım talebimi gönder**. Üreticiye giden bağlantı ayrı: **Resmî deneme sayfasına git**. “İndir” etiketli düğme beklenmedik bir satış formu göndermez.

| Ek alan | Durum | Değer / kaynak |
|---|---|---|
| Yardım konusu / assistanceTopic | Zorunlu | Denemeye başlama; kurulum konusunda yönlendirme; uygun ürünü seçme; diğer |
| Ürün bağlamı | İlgili ürün form başlığında görünür; bu ilk örnek ALLPLAN | Scalypso gibi başka ürünlerde doğrulanmış hedef/operasyon gerekir; otomatik ALLPLAN hedefi atanmaz |

Ortak ad/e-posta alanları zorunlu; firma ve telefon varsayılan isteğe bağlı. Mevcut müşteri teknik arızası ayrı Destek yoluna yönlendirilir. Öğrenci lisansı farklı üretici sürecidir; bu formda öğrenci belgesi toplanmaz.

**Önerilen akış:** resmî indirme bağlantısı açık; Aluplan yardımı isteğe bağlı. Kullanıcı Next.js'i seçti, bu zorunluluk kararını henüz vermedi. Zorunlu model seçilirse de form tamamlanması indirme gerçekleşti anlamına gelmez; üreticide yeniden bilgi istenebileceği açıkça belirtilir. Üretici hedefi mevcut doğrulanmış URL kaydından alınır, bu belge yeni adres üretmez.

Talep başarısı sonrası üretici bağlantısı gösterilebilir; otomatik indirme/aktivasyon sözü yok. Deneme süresi14/30gün çelişkisi ticari kaynakla kapanmadan yeni metinde kesin süre kullanılmaz. İsteğe bağlı modelde form hatası üretici bağlantısını engellemez.

## 3. Özel eğitim ihtiyacı — training_request

Tek **Eğitim** hizmeti altında özel ihtiyaç girişi. Başlık: **Eğitim ihtiyacınızı paylaşın**. Gönderim: **Eğitim talebimi gönder**. Bu bir rezervasyon değildir.

| Ek alan | Durum | Değer / sınır |
|---|---|---|
| Eğitim ihtiyacı / trainingNeed | Zorunlu, 1–1000karakter | “Neyi öğrenmek veya geliştirmek istiyorsunuz?”; hazır kurs seçmek zorunlu değil |
| İlgili ürün / productSelection | İsteğe bağlı | Onaylı katalog; “Emin değilim” mümkün |
| Deneyim / experienceLevel | İsteğe bağlı | Yeni başlıyorum; kullanıyorum; ekipte farklı seviyeler var |
| Katılımcı sayısı / participantCount | İsteğe bağlı, verilirse pozitif tamsayı | Kapasite taahhüdü değildir; operasyon güvenliği için teknik üst sınır10000, hizmet kapasitesi değil |
| Format tercihi / formatPreference | İsteğe bağlı | Çevrim içi; yüz yüze görüşülsün; fark etmez. Tercih, sunulan hizmet garantisi değildir |
| Zaman tercihi / preferredPeriod | İsteğe bağlı, en fazla160karakter | Serbest tercih; tarih/saat rezervasyonu yok |

Bu formda `trainingNeed` açıklama ihtiyacını karşıladığı için ortak `message` ikinci bir metin kutusu olarak gösterilmez. Böylece aynı ihtiyaç iki kere sorulmaz. Ayrıntılar isteğe bağlı bölümde sunulur; ilk görünümde ad, e-posta ve ihtiyaç yeterlidir.

Webinar arşivi → YouTube izleme yolu bu formdan bağımsızdır. Gerçek yaklaşan webinar varsa doğrulanmış kayıt hedefi ayrıca gösterilir; bu form otomatik webinar kaydı yapmaz. Sertifika, ücret, süre ve takvim uydurulmaz.

## İç kayıt: kullanıcı verisi ve sayfa bağlamı ayrımı

| Grup | Alanlar | Güven sınırı |
|---|---|---|
| Kayıt kimliği | requestId, intent, formContractVersion, createdAt | Sunucu üretir/doğrular; saat istemciden alınmaz |
| Açık tercih | primaryProductRef ve ürün başına selections (productRef, moduleRefs, editionRefs, gerektiğinde requestedReleaseRefs), forma özgü alanlar | Sunucuda katalog ve niyetle uyum kontrolü; bir ürünün paketi başka ürüne taşınmaz |
| Geliş bağlamı | sourcePageRef, sourceProductRef, sourceReleaseRef | Kullanıcı tercihi değildir; geçerli yerel kayıt listesiyle doğrulanır |
| Açık sürüm tercihi | Gereken alt yollarda requestedReleaseRefs; genel formda zorunlu değil | Kullanıcının açık seçimi; sourceReleaseRef ile karıştırılmaz |
| Tarihsel iz | Seçimin o andaki adı, içerik revizyonu | Yıllık katalog değişiminde eski talep başka ürüne dönüşmez |
| Operasyon | ownerTeam, assignee, status, nextFollowUpAt, outcome | Yalnız yetkili operasyon; istemci bunları belirleyemez |
| Teslimat | notificationState, integrationState, attempts, lastErrorCode | Kişisel veri içermeyen hata kodları; talep durumundan ayrı |

İletişim alanları ve talep içeriği erişim kontrollü kayıt alanında tutulur. İç talep kimliği public schema `@id` değildir. Analitiğe e-posta, telefon, serbest metin, tam referrer/query veya talep kimliği gönderilmez. Kaynak sayfa için kişisel veri içermeyen kayıt anahtarı kullanılır; kampanya ölçümü daha sonra izinli alan sözleşmesiyle tanımlanır.

İlk model bir talebin bir ana niyetini taşır. Aynı kişinin iki ayrı ihtiyacı iki kayıt olabilir; yalnız e-posta eşit diye kayıtlar birleştirilmez. Aynı gönderimin tekrarını ayırmak için niyet ve içerikle bağlı idempotency anahtarı kullanılır; aynı anahtarla değişen içerik sessizce eski başarıya çevrilmez. Saklama süresi/anahtar ömrü altyapı tasarımında kesinleştirilir.

## Ortak takip akışı

1. **Kontrol:** gerekli alanlar, boyut, katalog ilişkisi ve kötüye kullanım kontrolleri sunucuda yapılır. Hatalı alan yanında açıklama; yazılmış değerler aynı oturumda korunur.
2. **Kayıt:** talep ve gönderilecek bildirim/entegrasyon işi aynı güvenilir kayıt sınırında saklanır. Kalıcı kayıt yoksa başarı gösterilmez.
3. **Alındı:** kayıt kimliği gösterilir. E-posta bildiriminin başarısı, bu kaydın varlığından ayrı takip edilir.
4. **Yönlendirme:** quote→satış, trial_assistance→ürün/kurulum ön değerlendirme, training_request→eğitim koordinasyonu. Gerçek kişi ve ortak takip aracı henüz seçilmedi.
5. **İş takibi:** atama, ilk iletişim ve sonraki adım görünür; yeni kaydın bildirim hatası nedeniyle sahipsiz kalması izlenir.
6. **Kapanış:** sonuç kodu ve kısa iç not; gerekirse yeniden açma. Deneme indirildi/satış yapıldı gibi sonuçlar kanıt veya yetkili operasyon kaydı olmadan otomatik işaretlenmez.

| Durum | Geçiş ve gerekli bilgi |
|---|---|
| new | Kalıcı kayıtta oluşur; henüz kişi atanmayabilir |
| assigned | Yetkili kişi atanır; atanan kişi boşsa bu durum kullanılamaz |
| in_progress | Yetkili kişi değerlendirmeye/iletişime başlar |
| waiting_customer | Beklenen bilgi ve takip tarihi kayıtlıdır |
| closed | Sonuç: yanıtlandı, teklife aktarıldı, uygun değil, müşteri vazgeçti, mükerrer veya spam; kod niyete uygun olmalı |

`waiting_customer → in_progress`, `in_progress → assigned` (devir) ve `closed → in_progress` (yeniden açma) yetkili kişi, zaman ve gerekçeyle izlenir. İlk iletişim zamanı ayrı alan; yalnız durumu değiştirmek müşteriye yanıt verildiği anlamına gelmez. SLA süresi bu belgeyle taahhüt edilmez.

Bildirim ve entegrasyon için ayrı `pending/succeeded/retry_pending/failed` durumları kullanılır. En fazla5otomatik deneme ve artan bekleme plan taslağıdır; kalıcı4xx/izin hataları körlemesine tekrarlanmaz. Tükenen işler yetkili yeniden işlem kuyruğuna alınır. Mevcut araç bunu nasıl sağlayacak, uygulama öncesi doğrulanır. Kullanıcıya açık sorgulama ekranı veya sadece requestId bilenin kaydı görmesi planlanmıyor.

## Hata ve kabul örnekleri

- Geçersiz alan veya spam sınırı: başarı yok, erişilebilir hata/tekrar yolu var; dış deneme bağlantısı isteğe bağlı modelde açık kalır.
- Veritabanı/kayıt başarısız: talep kaydedildi denmez; içerik ekranda korunur, güvenli tekrar sunulur.
- Kayıt başarılı/bildirim başarısız: aynı talep kalır; teslimat yeniden denenir. Tekrar tıklama ikinci talep yaratmaz.
- Entegrasyon zaman aşımı: kaynak kayıt kaybolmaz; ortak hedefte requestId ile mükerrer önlenir. Kaynak ve hedef arasında eşlenmemiş kayıtlar denetlenir.
- Ürün/paket güncellenmiş: uyumsuz seçenek açıklanır; kullanıcının onayı olmadan başka paket gönderilmez.
- Dar ekran, klavye, ekran okuyucu: etiket, hata özeti, odak ve gönderiliyor durumu doğrulanır; sadece renkle hata anlatılmaz.

Build/test henüz yok; bunlar ileride uygulanacak kabul senaryolarıdır. Hangi veri deposu, e-posta sağlayıcısı veya operasyon aracının kullanılacağı seçilmedi. Yalnız e-postaya dayalı, kayıt izi olmayan teslimat kabul edilmeyecek.

## Schema ilişkileri — form sözleşmesinden bağımsız

| Sayfa/niyet | İlişki | Sınır |
|---|---|---|
| Ürün/paket/sürüm içinden teklif | Kaynak sayfanın mevcut mainEntity/about modeli korunur. Form ürün başına productRef/editionRefs ilişkisini iç kayıtta taşır | Yeni form yeni Product değildir; form alanı fiyat/Offer kanıtı değildir |
| Genel talep sayfası varsa | Amacına uygun ContactPage veya WebPage; site/kuruluş ilişkileri | Yeni URL henüz yok; sırf form var diye tüm sayfalara ContactPage uygulanmaz |
| Deneme yardımı | ALLPLAN yazılım kimliği ve üretici indirme hedefi ayrı; yerel yardım sağlayıcısı Aluplan | Form başarısı DownloadAction/PurchaseAction başarısı değil; ücretli ürüne fiyat0yazılmaz |
| Eğitim hizmet tanıtım sayfası | mainEntity→tek Eğitim Service; Service.provider→Aluplan; WebPage.about→ilgili ürün | Özel talep yeni Course, rezervasyon veya ayrı Service yaratmaz |
| Eğitim erişim kanalı | Service.availableChannel→ServiceChannel; providesService→aynı Eğitim Service; serviceUrl→gerçek onaylı form/hedef | Üç farklı niyet aynı erişim URL'sini kullansa bile hizmet/ürün kimlikleri birleştirilmez |
| Webinar arşivi | Gerçek video kayıtları önceki metadata sözleşmesiyle ilişkilendirilir | Talep formu VideoObject/Course metadata kaynağı değildir |

İlk kapsamda form gönderimi için `potentialAction` zorunlu değil ve önerilmiyor. Talep kayıtları, durumları, kişi bilgileri ve serbest metin JSON-LD'ye taşınmaz. Kalıcı ürün/paket/yıllık sürüm ve kaynak revizyonu içerik modelinde kalır; form seçimi lisans hakkı üretmez. Eğitim formu açılır pencere olursa ayrı indekslenebilir sayfa varmış gibi URL/schema uydurulmaz.

Dayanak: aynı tarihli [schema kontrolü](schema-inventory-impact-2026-10-22.md), [Google genel kuralları](https://developers.google.com/search/docs/appearance/structured-data/sd-policies), [Service](https://schema.org/Service), [ServiceChannel](https://schema.org/ServiceChannel). Schema geçerliliği, Google zengin sonuç uygunluğu ve gerçek teslimat üç ayrı kabul konusudur. JSON-LD/Rich Results Test çalıştırılmadı.

## Uygulama öncesinde işletimden beklenenler

1. Deneme yardımı isteğe bağlı mı? Öneri evet; Next.js onayı bunu tek başına kararlaştırmaz.
2. Ortak takip nerede tutulacak, üç niyet hangi gerçek ekibe/kişiye atanacak? Yeni CRM kurmak varsayılmıyor.
3. Aydınlatma, saklama ve ilgili erişim sorumluluğu kimde? Şimdi süre veya izin metni uydurulmayacak.

Alanları ve teknik hata durumlarını kullanıcıya tek tek test ettirmek yerine ekip bu sözleşmeyle doğrulayacak. Mevcut Microsoft formu ve eski URL'ler yeni akış kabul edilip geçiş haritası hazırlanmadıkça kaldırılmayacak.

## 22.10.2026 schema kontrolüyle netleştirme

[Son inceleme](form-schema-review-2026-10-22.md): doğrudan Google ihlali yok; üç uygulama belirsizliği netleştirildi. Paket/yıl alanları otomatik ProductGroup/variesBy yapılmayacak; Google yazılım yılı/edition boyutunu destek listesinde saymıyor. requestedReleaseRefs açık kullanıcı tercihini, sourceReleaseRef geliş sayfasını anlatır; ikisi de iç alanlardır. softwareVersion yalnız gerçek yazılım sürümünü anlatır. Eğitim hizmet sayfasının Service ana varlığı, arşiv ve tek video sayfasına otomatik uygulanmaz. Genel arşiv CollectionPage/ItemList adayıdır; nihai seçim görünür içerikle yapılır. Form sayısı ürün veya hizmet sayısı değildir. Fiyat/değerlendirme kanıtı olmadan Google yazılım/ürün rich result uygunluğu ilan edilmez. Kod/JSON-LD üretilmedi.

## 25.10.2026 — Ücretsiz deneme hedefi kararı

Kullanıcı kararıyla yeni sitede ücretsiz deneme bağlantıları doğrudan ALLPLAN'ın resmî **`https://www.allplan.com/trial-or-subscription/`** adresine yönlendirilecektir. Böylece 14 gün / 30 gün süre çelişkisi kapatılmıştır; doğrudan üretici deneme sayfasına geçiş engellenmez.
