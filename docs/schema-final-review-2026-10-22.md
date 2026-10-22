# Schema stratejisi son kontrolü — 22.10.2026

Durum: uygulama öncesi belge incelemesi. JSON-LD, uygulama kodu, canlı site veya tema değiştirilmedi. Kullanıcı antrasit temayı uygun buldu; bu karar schema uygulama/entegrasyon onayı değildir.

## Sonuç

Kalıcı ürün → paket → yıllık sürüm → bölge/lisans/kaynak revizyonuna bağlı kapsam modeli korunmalı. Eğitim tek hizmet kimliğiyle, Teknik Destek ise Teams ve ticket erişim kanallarıyla modellenmeli. Google zengin sonuç uygunluğu ile Schema.org semantiği ayrı değerlendirilmelidir. Plan tutarlı; aşağıdaki kanıt ve yayın kapıları kapanmadan uygulama tamamlandı sayılamaz.

İncelenen yerel belgeler: long-term-web-strategy.md bölüm 10, content-record-contract.md, service-positioning-matrix.md, professional-services-positioning.md, package-comparison-decisions.md. Schema skilli `skill://schema/SKILL.md` okundu. Skilldeki hızlı alan tabloları ve FAQ/HowTo/search-box örnekleri güncel Google ürün desteğinin yerine geçmez. Bu kontrol canlı Aluplan taraması değildir; Google/Schema.org/Next.js belgeleri yeniden açıldı.

## Varlık ve ilişki kararı

| Varlık | İçerik ilişkisi | Schema planı / sınır |
|---|---|---|
| Aluplan | Site yayıncısı, yerel hizmet sağlayıcı | Ayrı Organization; ALLPLAN ile sameAs veya parentOrganization kurulmaz. Ürün üreticisi yapılmaz |
| Kalıcı ALLPLAN | Üretici kaydına bağlı ürün kimliği | Ürün sayfası WebPage.mainEntity → SoftwareApplication; ürün ailesine otomatik 2027 sürümü atanmaz |
| Paket | Edition.productRef; her sürüm/pazar/lisans kapsamı ayrı | Önce gerçek edition mı bundle mı doğrulanır. Otomatik ProductGroup/hasVariant veya ayrı SoftwareApplication üretilmez |
| Yıllık sürüm | Release.productRef; edition ile ScopeClaim üzerinden | Sürüme özel yazılım örneğinde softwareVersion; yenilik yazısında WebPage/uygunsa Article.about. Aynı varlığı iki farklı kimlikle çoğaltma |
| Kapsam iddiası | edition + release + market + licenseModel + capability/relatedProduct + sourceRevision | İç ilişki; tüm alanlar için Schema.org özelliği icat edilmez. Çelişkili ticari iddia doğrulanmış dahil/haric olarak yayınlanmaz |
| Eğitim | Tek Service kimliği; ürün/sürüm uygunluğu yalnız kanıt varsa | Eğitim sayfası mainEntity → Service, provider → Aluplan. Seviye, format ve ekip ihtiyacı ayrı veri alanları; ayrı özel eğitim hizmeti yok |
| Teknik Destek | Tek hizmet, iki kanal | Service.provider → Aluplan; availableChannel → Teams ve ticket için iki ServiceChannel; serviceUrl gerçek müşteri erişim hedefi |
| Destek Platformu | Ticket kanalının görünen adı | allplan.net.tr kullanıcı tarafından düzeltildi. Ayrı yazılım ürünü veya ikinci destek hizmeti gibi çoğaltılmaz; yönetim dashboard'u müşteri giriş hedefi kabul edilmez |
| Rehber / yardım içeriği | İlgili ürüne ve doğrulanmış sürüme bağlı kaynak | Gerçek yardım dokümanı varsa SoftwareApplication.softwareHelp → CreativeWork; Teams görüşmesi veya ticket Service nesnesi bu alana konmaz |

Service.availableChannel ve ServiceChannel.serviceUrl bu ilişkiyi doğrudan karşılar. ContactPoint, kuruluşun iletişim noktalarını tanımlamak için kullanılabilir; kanalın kendisiyle karıştırılmaz. Hizmetin ürünle ilişkisini öncelikle iç relatedProductRefs/applicableReleaseRefs üzerinden tutarız. Görünür eğitim/destek sayfasında WebPage.about ilgili yazılımı, mainEntity ilgili Service'i gösterebilir; Service üzerine tanımsız productId/releaseId alanları basılmaz. [Service](https://schema.org/Service), [ServiceChannel](https://schema.org/ServiceChannel), [ContactPoint](https://schema.org/ContactPoint), [softwareHelp](https://schema.org/softwareHelp)

softwareVersion PDF revizyonu veya site yılı değildir. isBasedOn yalnız gerçek türeme ilişkisi varsa kullanılır; sürümler arası genel bağlantı amacıyla zorlanmaz. [softwareVersion](https://schema.org/softwareVersion), [isBasedOn](https://schema.org/isBasedOn)

## Güncel Google koşulları

| Konu | 22.10.2026 kontrolü | Aluplan kararı |
|---|---|---|
| SoftwareApplication zengin sonucu | name, offers.price ve review veya aggregateRating gerekir | Doğrulanmış görünür fiyat ve uygun değerlendirme bulunmadan uygunluk iddiası yok. Deneme yazılımı ücretli lisans için fiyat=0 gerekçesi olmaz. [Google](https://developers.google.com/search/docs/appearance/structured-data/software-app) |
| Product snippet | name ve offers/review/aggregateRating seçeneklerinden en az biri; Offer yolunda gerçek fiyat | Teklif formu fiyat değildir. Karşılaştırma sayfası otomatik tek Product değildir; puan veya teklif uydurulmaz. [Google](https://developers.google.com/search/docs/appearance/structured-data/product-snippet) |
| ProductGroup | Ürün varyantlarına ilişkin ayrı kimlik, gruplama ve merchant listing koşulları var | Paket adları/yıllar otomatik desteklenen varyant boyutu sayılmaz. Mevcut bekletme kararı korunur. [Google](https://developers.google.com/search/docs/appearance/structured-data/product-variants) |
| Genel Eğitim hizmeti | Service için özel bir Google zengin sonuç özelliği güncel galeride belgelenmiyor | Service semantik tanım olabilir; arama görünümü garantisi değildir. [Desteklenen özellikler](https://developers.google.com/search/docs/appearance/structured-data/search-gallery) |
| Course list | İngilizce içerik için; en az üç gerçek kurs, liste/carousel ve kurs koşulları gerekir | Türkçe genel Eğitim sayfası için bu sonucu hedeflemiyoruz. Üç kurs şartını doldurmak için Temel/İleri/Online gibi etiketlerden kurs icat edilmez. [Google Course list](https://developers.google.com/search/docs/appearance/structured-data/course) |
| Course Info | 2025'te kaldırılan ayrı özellik | Course list ile karıştırılmaz; zengin sonuç hedefi değil. Gerçek öğrenme programı ileride varsa Course/CourseInstance semantiği ayrıca değerlendirilebilir. [Google duyurusu](https://developers.google.com/search/blog/2025/06/simplifying-search-results) |
| FAQ | Google günlüğü 7 Mayıs 2026'dan itibaren FAQ rich result gösterilmediğini belirtiyor | Eğitim/destek soruları kullanıcı içeriği olarak korunabilir; FAQ zengin sonucu vaat edilmez. [Google güncellemesi](https://developers.google.com/search/updates) |

Schema.org'da bir türün var olması, Google'ın ona özel sonuç sunması anlamına gelmez. Görünür ve doğru bilgi, güncellik ve taranabilirlik şartları korunur. Giriş gerektiren destek paneli/ticket metinleri halka açık pazarlama sayfasının schema verisine taşınmaz. Gerçek bir destek hizmetine erişim için login gerekmesi, kamuya açık hizmet açıklamasını kullanmaya engel değildir; panelin kendisini indekslenebilir içerik saymayız. [Google genel kuralları](https://developers.google.com/search/docs/appearance/structured-data/sd-policies)

## Eksikler ve uygulama öncesi karar kapıları

| Öncelik | Eksik / risk | Gerekli işlem ve sorumlu |
|---|---|---|
| Yüksek | Stratejinin ana kapsam tablosu yalnız edition/release/market diyordu; sonraki notta lisans/revizyon vardı | Ana tablo licenseModel + sourceRevisionRef + claim öğesiyle aynı hale getirildi; proje ekibi |
| Yüksek | İçerik sözleşmesinde ayrı özelleştirilmiş eğitim adayı kalmıştı | Son kullanıcı kararıyla tek Eğitim kaydına düzeltildi; yeni kurs/hizmet iddiası üretilmedi |
| Yüksek | Paket kapsamı ve TR lisans ilişkileri, özellikle SCIA gibi çelişkiler açık | Kaynak çelişkilerini resolved/verified olmadan schema'ya kesin hak olarak taşımama; ticari doğrulama |
| Yüksek | Fiyat ve uygun review/rating kanıtı yok | Software/Product rich result hedefini beklet; temel sayfa/kuruluş/gezinme ve doğrulanmış semantik verilerle başla |
| Yüksek | aluplan.net.tr eski kaynak hedefi, kullanıcı allplan.net.tr diye düzeltti | Ham kaydı koru, onaylı hedefi ayrı tut; müşteri giriş URL'sini uygulama öncesi doğrula. Teams URL'sini özel parametreleriyle rapora kopyalama |
| Orta | Service ürün/sürüm uygunluğu ve kanal ayrımı sözleşmede açık alan değildi | İç modelde ilişkiler ve ServiceChannel kaydı belgelendi; her sürüme otomatik destek/eğitim hakkı verme |
| Orta | Tek paket için edition/bundle sınıfı kesin değil | Sayfa bazında tür karar defteri; ürün kimliği ve pazarlama paketi ayrımı |
| Orta | Entity @id sözleşmesi, canonical ve sayfa sorumlulukları henüz uygulamada sınanmadı | Tek kimlik kaydı; /about canonical bulgusu dahil baseline kapanışı; yeni URL üretmeden planla |
| Orta | Eğitim takvimi, kapsam, ücret, sertifika ve destek saatleri/SLA belirsiz | Onaylı hizmet bilgisi; Event/CourseInstance/Offer, ücretsiz hizmet veya SLA üretme |
| Orta | Eğitim modalı kaynakta simülasyon | Gerçek teslimat kabulü ayrı; schema doğru form altyapısının yerini tutmaz |

## CMS'siz Next.js yayın sözleşmesi

Doğrulanmış içerik kayıtları → sayfaya uygun görünüm modeli → görünür içerik ve ayrı schema üreticisi. Tema tokenlarından bu akışa veri okunmaz. Aynı Service/ürün farklı sayfalarda aynı @id ile referanslanır; global layout bütün ürün/kursları her sayfaya basmaz. Dahili unknown/disputed alanlar kullanıcıya gereken açıklamayı besleyebilir; schema'da yanlış kesinliğe çevrilmez.

Next.js rehberi JSON-LD'yi ilgili page/layout içinde sunmayı ve güvenli serileştirmeyi anlatıyor; yalnız JSON.stringify güvenlik garantisi sayılmıyor. Rehberdeki örnek alanları kopyalamak Google uygunluğunu kendiliğinden sağlamaz. [Next.js](https://nextjs.org/docs/app/guides/json-ld)

İleride kabul senaryoları: tema değişiminde aynı varlık/URL/schema anlamı; yeni release eklenince eski kapsamın korunması; tek Eğitim ve tek Destek kimliği; iki doğru kanal; başka pazar/lisans kapsamının karışmaması; fiyat/yorum bilinmiyorsa uydurulmaması. Schema Validator tür/alan tutarlılığını, Rich Results Test yalnız destekli sonuç uygunluğunu, görünür içerik karşılaştırması gerçeğe uygunluğu kontrol edecek. Yayında Search Console ayrı izinli doğrulama adımıdır.

## Bu turun sınırı

Resmî belge araştırması ve strateji tutarlılığı incelemesi yapıldı. Rich Results Test, Schema Validator ve Search Console çalıştırılmadı; uygulama veya JSON-LD üretilmedi. Destek sistemi, eğitim sayfası ve üretici lisansları yeniden canlı denetlenmedi. Faz 0 ve ticari doğrulama açıkları kapanmış sayılmaz.
