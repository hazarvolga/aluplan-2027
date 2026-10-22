# Microsoft Forms veya Next.js formu

> Güncel durum: Next.js kısa form yaklaşımı kullanıcıca kabul edildi. Aşağıdaki karşılaştırma tarihsel gerekçedir; güncel alan ve kapsam planı [sözleşmede](request-forms-contract.md). Kod/entegrasyon onayı değildir.

22.10.2026 — Planlama karşılaştırması; altyapı seçimi ve uygulama onayı değildir. [Kullanıcı yolları](customer-request-journeys.md) temel alınır. Kullanıcı niyete özel kısa girişler ve ortak takibi mantıklı buldu; araç, alanlar ve zorunlu lead adımı kesinleşmedi.

## Sonuç önerisi

Aluplan'ın tokenlarla yönetilen uzun ömürlü sitesi için **Next.js içinde niyete özel formlar + mevcut operasyon aracına ortak teslimat** daha uyumlu hedef. Bunun karşılığında kalıcı kayıt, spam önleme, hata/yeniden deneme ve bakım sorumluluğunu üstlenmemiz gerekir. Bu sorumluluk için bütçe/kapasite ayrılmayacaksa Microsoft Forms daha gerçekçi tercih olur.

Forms kullanmak mevcut karmaşık formu aynen sürdürmek değildir: aynı platformda kısa girişler/dallar tasarlanabilir. Next.js kullanmak da yeni CRM, yönetim paneli veya CMS kurmak anlamına gelmez. Başlangıç için ayrı bir CRM geliştirmeyi önermiyorum. Henüz seçim yapılmadı.

## Aynı kapsamla karşılaştırma

Kapsam: teklif, isteğe bağlı deneme yardımı, özel eğitim talebi; herkese açık erişim, ortak kayıt alanları, sorumlu ekip, bildirim ve takip. Dosya yükleme, hesap açma, ödeme, rezervasyon ve yeni CRM kapsam dışı önerilmiştir.

| Başlık | Microsoft Forms | Next.js içinde form |
|---|---|---|
| İlk kurulum | Mevcut hesap ve araç bilgisi avantaj; form sadeleştirme, alan eşleme ve otomasyon yine iş gerektirir | Arayüz yanında güvenli sunucu işlemi, kayıt, bildirim ve hata davranışı geliştirilir |
| Lisans/abonelik | Uygun Microsoft365planlarında dahil olabilir; mevcut tenant planı/otomasyon hakları doğrulanmadı | Framework için Forms benzeri koltuk lisansı yok; hosting, veri, e-posta ve bakım maliyeti var |
| Görsel kimlik | Microsoft'un sunduğu tema ve yerleşim sınırları; harici gömmenin içini site CSS tokenlarıyla yönetmeyi varsaymayız | Siteyle aynı tokenlar/bileşenler, mobil ve erişilebilirlik sözleşmesi kullanılabilir |
| Ürün bağlamı | Form seçimi/ön doldurma/URL aktarımı yetenekleri tasarıma göre ayrıca doğrulanır | Ürün kaydından görünür ve değiştirilebilir bağlam; sunucuda doğrulama gerekir |
| İçerik bakımı | Yetkililer panelden değiştirir; kontrolsüz değişiklik alan eşlemesini/akışı bozabilir | Alan sözleşmesi Git ile gözden geçirilir; CMS yokken değişiklik geliştiriciye bağlı |
| Yıllık sürüm | Formdaki ürün/sürüm listeleri ayrı yönetiliyorsa senkronizasyon gerekir | Ortak içerik kaynağıyla güncellenebilir; geçmiş talepte o zamanki bağlam korunur |
| Kayıt | Microsoft yanıtları saklar, Excel dışa aktarımı var | Kalıcı depolama ve erişim politikası ayrıca tasarlanır; yalnız e-posta yetersiz |
| Ortak takip | Power Automate ile yanıtlar ortak liste/uygun mevcut hedefe aktarılabilir; bağlantılar ve lisans kontrol edilir | Aynı operasyon hedefine server-side adaptörle aktarılabilir; desteklenen API/izinler doğrulanır |
| Hata | Yanıt kaydı oluşup otomasyon başarısız olabilir; başarısız akış ve eksik aktarım izlenmeli | Kayıt/bildirim ayrımı, yeniden deneme ve çift gönderim kontrolü bizim sorumluluğumuz |
| Ölçüm | Yanıt raporları var; site çıkış tıklaması form tamamlanması değildir. Cross-origin iframe iç olayları otomatik okunamaz | Başlatma, doğrulama, kalıcı kayıt ve hata olayları doğrudan ölçülebilir; kişisel veri analitiğe gitmez |
| Güvenlik/operasyon | Form barındırma Microsoft'ta; hesap, paylaşım, sahiplik ve otomasyon sürekliliği yine Aluplan'da | Public endpoint abuse/rate limit, doğrulama, sır yönetimi, güncelleme, yedek ve izleme bizde |
| Hosting etkisi | Site statik olsa da dış form çalışabilir | Server Action/API için sunucu çalışma ortamı gerekir; yalnız static export yeterli değildir |
| Taşınabilirlik | Yanıt dışa aktarımı mümkün; soru kimliği/otomasyon bağımlılıkları taşınırken eşlenir | Uygun kayıt sözleşmesiyle arayüz/hedef değişebilir; bakım bağımlılığı geliştiricide |

Forms'un niyete özel görünüm sağlayabilmesi ile site tokenlarına tam uyum aynı şey değildir. Bu karşılaştırma lisans veya API erişimi varmış gibi entegrasyon sözü vermez.

## Maliyet modeli

Kesin TL/ay vermek için mevcut abonelikler, hedef sistem, hacim ve geliştirici maliyeti bilinmiyor. Kamu liste fiyatını mevcut hesabın ek maliyeti gibi kullanmıyoruz.

**12 aylık ek maliyet = kurulum işçiliği + ek lisanslar + ek barındırma/veri/e-posta + bakım işçiliği + olay/onarım payı.** Mevcut web sitesinin ortak hosting maliyeti iki seçeneğe de tekrar yüklenmez; sadece formlar nedeniyle artan pay karşılaştırılır.

| Planlama girdisi | Forms | Next.js |
|---|---|---|
| İlk iş yükü tahmini | 2–4 mühendis iş günü | 5–10 mühendis iş günü |
| Düzenli teknik bakım rezervi | Ayda1–2saat | Ayda2–4saat |
| Koşul | Lisanslı hesap ve erişilebilir ortak takip hedefi hazır | Aynı hedef hazır; mevcut Next.js uygulama/deploy altyapısı hazır |
| Dahil işler | Üç niyet, alan eşleme, temel otomasyon, hata bildirimi ve kontrollü kabul | Ortak form bileşeni, sunucu doğrulama, kalıcı kayıt, bildirim/yeniden deneme, spam önleme ve kritik kabul |

Bu aralıklar çalışma varsayımıdır; ölçülmüş süre, teklif veya takvim taahhüdü değildir. Aluplan2027uygulaması henüz kurulmadığı için Next.js site temelinin kurulması bu forma özel tahmine dahil değildir. CRM/premiumconnector, karmaşık izinler, veri göçü, tasarım değişimi veya yeni panel gerekirse ayrıca hesaplanır. İşletme ekibinin taleplere dönüş zamanı her iki seçenekte de gerekir, bu rezervlere dahil değildir.

Forms tenantta dahilse yalnız form kullanımının ek lisans bedeli sıfır olabilir; bütün otomasyonun ücretsiz olduğu sonucu çıkmaz. Next.js mevcut sunucuda çalışırsa ek compute düşük olabilir; Free Tier kapasitesi, yedek, e-posta kotası ve bakım bedeli sıfır varsayılmaz.

## Takip mimarisi: e-posta ile kayıt aynı değildir

**Forms adayı:** kısa form → Microsoft yanıt kaydı → Power Automate → ortak takip kaydı + ekip bildirimi. Kaynak kimliği `formId + responseId`; yeniden çalıştırma aynı kaydı çoğaltmamalı. Birden çok formun yanıt ekranı kendiliğinden birleşmez; ortak alan eşleme gerekir. Alan/soru değişikliklerinden sonra akış kabulü tekrarlanır. Kişisel çalışana bağlı sahiplik/bağlantıların ayrılma veya izin değişimi durumunda devri planlanır.

**Next.js adayı:** kısa form → sunucu doğrulama → kalıcı talep kaydı → bildirimi/harici aktarımı yeniden denenebilir iş olarak yürütme → aynı takip hedefi. Başarı mesajı kalıcı kaydı ifade eder, e-posta okunmasını veya satış dönüşünü değil. Yeni yönetim paneli yerine mevcut uygun liste/CRM kullanılabilir; herhangi bir CRM'nin hazır olduğu varsayılmaz.

Ortak hedefte asgari alanlar: talep kimliği, niyet, ürün referansı, oluşturma zamanı, sorumlu ekip/kişi, durum, son işlem zamanı ve sonraki takip. İletişim verisine yalnız yetkili ekip erişir. Durum adayları: yeni, atandı, iletişime geçildi, kapandı; bunlar onaylı operasyon değildir.

Microsoft Forms bağlayıcısı belgelenmiş yeni yanıt tetikleyicisi ve yanıt detayı okuma akışını destekler. Next.js arayüzünden gizli/tersine mühendislik Forms gönderim uçlarına POST ederek Forms'u görünmez backend yapmak önerilmez; bu karşılaştırmada destekli bir yanıt yazma API'si doğrulanmadı. Microsoft operasyon araçlarını kullanmak ile Forms'un yanıt veritabanına yazmak farklıdır.

## Aluplan için seçim ölçütü

- En az geliştirme sorumluluğu ve yetkililerin kodsuz alan düzenlemesi ağır basıyorsa **Forms**.
- Token bütünlüğü, ürün bağlamı, kontrollü kısa akış, ayrıntılı hata/ölçüm ve uzun vadeli içerik modeline uyum ağır basıyorsa, bakım sahibiyle birlikte **Next.js**.
- Niyete özel girişleri kabul etmek otomatik Next.js onayı değildir. Her iki seçenek aynı kullanıcı yoluyla değerlendirilmeli; Forms'a eski uzun formu, Next.js'e ideal yeni formu vererek haksız kıyas yapılmamalı.

Benim önerim Next.js'i uzun vadeli aday tutmak; bakım yükünü azaltmak için üç ayrı sistem yerine ortak form/kayıt sözleşmesi ve mevcut uygun operasyon hedefi kullanmak. Eğer bu iş için düzenli teknik bakım ayrılmayacaksa sadeleştirilmiş Forms daha sürdürülebilir olacaktır. Önce Forms kurup sonra mutlaka taşımak önerilmiyor; iki kez maliyet yaratmadan mevcut haklar ve takip hedefiyle seçim yapılmalı.

## Schema etkisi

Araç seçimi ürün/paket/sürüm/Eğitim kimliklerini değiştirmez. Harici Forms veya yerel form hizmete erişim kanalı olabilir; ayrı form yeni Service değildir. Form girişleri fiyat, lisans hakkı, gerçekleşmiş indirme veya satın alma kanıtı değildir. Özel talep verileri JSON-LD'ye konmaz. Forms tercih edilse de web sitesindeki schema, sitede görünür doğrulanmış içerikten üretilir; Microsoft sayfasındaki markup'ı kontrol ettiğimiz varsayılmaz. Önceki [schema planı](schema-inventory-impact-2026-10-22.md) geçerlidir; bu tur yeni schema uygulaması yok.

## Seçimden önce gereken dar kontrol

1. Mevcut Microsoft365/Power Automate hakları ve ortak hedefteki connector sınıfı/izinler — tenant yetkilisiyle, satın alma yapmadan.
2. Taleplerin gerçekten takip edileceği mevcut araç ve sorumlu — yeni CRM varsaymadan.
3. Teknik bakım sorumluluğu ve yıllık bütçe — iki seçenek için aynı kapsamla.

Bu kontroller tamamlanınca platform kararı ve ayrıntılı maliyet çıkarılır. Canlı form düzenlenmedi; uygulama kurulmadı, bağlantı/API yetkisi verilmedi, satın alma veya test gönderimi yapılmadı.

## Resmî dayanaklar — 22.10.2026

- [Microsoft Forms hizmet tanımı](https://learn.microsoft.com/en-us/office365/servicedescriptions/microsoft-forms-service-description): uygun planlar, yanıt analizi ve Excel dışa aktarımı.
- [Microsoft Forms bağlayıcısı](https://learn.microsoft.com/en-us/connectors/microsoftforms/): Standard sınıfı, kurumsal hesap koşulu ve belgelenmiş işlemler. Bir connector'ın Standard olması bütün çözümün lisanssız olduğu anlamına gelmez.
- [Power Automate lisans türleri](https://learn.microsoft.com/en-us/power-platform/admin/power-automate-licensing/types): Microsoft365ile gelen sınırlı haklar ve ek yetenekler.
- [Forms ile otomasyon senaryoları](https://learn.microsoft.com/power-automate/forms/popular-scenarios): yanıta göre bildirim ve iş akışları.
- [Next.js form rehberi](https://nextjs.org/docs/app/guides/forms): Server Actions, sunucu tarafı işlem ve doğrulama. CRM, e-posta teslimatı veya kalıcı kayıt kendiliğinden sağlanmaz; bunlar mimari sorumluluk değerlendirmemizdir.

## 22.10.2026 — Next.js yönü kabul edildi; seçenek kapsamı korunuyor

Kullanıcı Next.js içinde kısa formlarla ilerlemeyi onayladı; henüz kod yazılmayacak. Önceki platform seçimi açık notları tarihsel olarak aşıldı. [Alan, takip ve schema sözleşmesi](request-forms-contract.md) güncel plandır. Kullanıcı mevcut formun üç kategorisi altında çok sayıda seçenek olduğunu hatırlattı: üç çekirdek niyet ürün/eklenti seçeneklerini azaltmaz veya ekran sayısını dondurmaz. Bölüm1–14kapsam eşlemesi eklendi; öğrenci lisansı ve mevcut müşteri eklenti temini ayrı alt yol olarak korunur. Çoklu ürün/modül ilgisi kaybolmaz. Deneme formunun zorunluluğu, gerçek takip hedefi/sorumluları ve hukuki metinler henüz açık; yeni CRM veya site/form/schema uygulaması yok.
