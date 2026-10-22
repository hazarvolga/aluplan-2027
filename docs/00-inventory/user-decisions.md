# Kullanıcı teyitleri ve açık kararlar

19 Ekim 2026 — Bu sohbetin doğrudan kullanıcı yanıtları. Araştırma notları bağımsız doğrulama yerine geçmez.

## Kaynak önceliği
- Kullanıcı güncel yerel kök uygulama ile canlı siteyi biraz önce aynı sürüme güncellediğini teyit etti.
- Esas: https://aluplan.com.tr. Yalnız yerelde bulunan içerik ayrıca kullanıcı onayına sunulur.
- `live-versiyon/` eski kopyası ayrı kayıt tutulur; içeriği otomatik güncel siteye eklenmez.

## Şirket, içerik ve varlık koruma
- Aluplan Program Sistemleri distribütör/çözüm ortağı olarak anlatılır; yazılım üreticisi olarak anlatılmaz. Kullanıcı gözlemi: 1995'ten beri Allplan Türkiye distribütörü; İstanbul Ataşehir merkez, Türkiye geneli hizmet, hafta içi 09:00–18:00.
- “29+ yıl”, “500+ aktif müşteri”, “50+ uzman kadro”, “10K+ proje” ifadelerini içerik olarak aynen koru; değiştirme/yeniden yorumlama. Korunması, bağımsız doğrulama yapıldığı anlamına gelmez.
- MİMAR / MÜHENDİS / PREKAST segmentasyonunu koru ve geliştir.
- Menü, sosyal medya, üç telefon, adres/harita, yasal sayfalar, hero videosu, PDF'ler korunur.
- Footer “Design & Develop by Hazar Volga Ekiz” kredisi korunur.
- ALLPLAN üretici logosu ve “A NEMETSCHEK COMPANY” ibaresi değiştirilmez, yeniden renklendirilmez.

## Gözlemlenen kitle ve CTA'lar
- Birincil kitle: mimarlık ofisleri, inşaat/yapı mühendisleri, mühendislik ofisleri, prekast/prefabrik üreticileri, yol/köprü/tünel proje ekipleri, müteahhitler ve büyük inşaat firmaları.
- İkincil: belediyeler, üniversiteler. Mevcut kullanıcılar eğitim, destek, sertifika ve sürüm bilgisi için gelir.
- Satış CTA'sı: Teklif Talep Formu → https://forms.office.com/r/hXhnKAG912.
- Deneme CTA'sı: ALLPLAN deneme sayfası. Kullanıcı gözlemi 14 gün; bazı yerel içerikte 30 gün bulunması bir içerik çelişkisidir. Süreleri otomatik değiştirme; güncel üretici koşulunu doğrulayıp değişikliği ayrıca onaya sun.
- Diğer hedefler: iletişim, eğitim takvimi/video, paket PDF, ürün/yenilik/bulut, BIMFlex.
- Harici Teams, aluplan.net.tr, aluplan.info ve ALLPLAN partner bağlantıları korunur; kardeş proje dosyaları kapsam dışı kalır.

## Marka kaynakları
- Sonraki kullanıcı yönlendirmesiyle `docs/BRAND-GUIDELINES.md` okundu: v1.0 TASLAK / ONAY BEKLİYOR. Artık bir taslak mevcut; onaylı kılavuz henüz yok. Farklar: `docs/brand/current-identity.md`.
- Kaynak logo SVG'leri ve mevcut tasarım varlıkları esas alınır.
- Kaynak font/renk değerleri `existing-design-tokens.json` ve `existing-design-tokens.md` içinde belgelenir; yeni tasarım kararı değildir.
- Kullanıcının Nemetschek/Roboto araştırma notu Aluplan için bağlayıcı değildir; yeni font kararı olarak kullanılmaz.

## ONAY GEREKLİ — Faz 3 PRD açık sorularına taşınacak
1. Ticari segmentlerin öncelik sırası ve karar vericiler kim?
2. Tek bir birincil dönüşüm seçilecek mi; teklif mi deneme mi?
3. Microsoft Forms aynen mi kalacak, özel altyapıya mı taşınacak? Şimdilik hedef aynen korunur.
4. Yeni tasarımda mevcut Aluplan renk/font kimliği korunacak mı, yenilenecek mi?
5. ALLPLAN distribütör marka kullanım dokümanı var mı?

## Mimari gereksinim — 19.10.2026
- Hedef uygulama Next.js ile kurulacak. Kesin Next.js sürümü geliştirme başlangıcında güncel kararlı sürüm ve bağımlılık uyumluluğu doğrulanarak kilitlenecek.
- İçerik, bileşen ve tema birbirinden ayrı katmanlar olacak.
- İçerikler yapılandırılmış veri/modül katmanından beslenecek; sunum bileşenlerine uzun metin, URL veya ürün verisi gömülmeyecek.
- Bileşenler yalnız semantik design token kullanacak. Renk, tipografi, boşluk, radius, gölge, breakpoint, grid ve motion değerleri bileşenlerde sabit yazılmayacak.
- Tema/token seti değiştirildiğinde içerik ve bileşen yapısı değiştirilmeden tüm görsel sistem güncellenebilmeli.
- Açık/koyu tema aynı semantik token sözleşmesini kullanacak; marka tokenları ile bileşen tokenları ayrı katmanlarda tutulacak.
- Bu karar design system kurulum onayı değildir. Uygulama ayrıntıları PRD onayından sonra Faz 4'te üretilecek ve otomatik kontrollerle korunacak.

Bu sorular henüz cevaplanmış sayılmaz; envanter yapılmasını engellemez. PRD bu fazda yazılmadı.

## Faz 2 için kullanıcı notları
/about canonical ve OG alanlarını tüm sayfalarla karşılaştır; ALLPLAN/Allplan/Aluplan başlık tutarlılığını incele. Bu oturumun `content-inventory.json` kayıtları mevcut meta değerlerini içerir; SEO etkisi ve iyileştirme Faz 2'de değerlendirilir.

## Stratejik öncelikler — 21.10.2026
- Kullanıcının en önemli sorunları: her yıl siteyi yeniden yapma yükü ve ürünleri doğru anlatmak.
- Önce uzun vadeli web stratejisi hazırlanacak; kalıcı içerik, yıllık sürüm güncellemeleri ve müşteri kazanımı birlikte ele alınacak. Henüz tasarıma geçilmeyecek.
- `../long-term-web-strategy.md` v0.1 bu isteğe yanıt veren taslaktır. Tek devam eden kod tabanı, yayın işletimi, pilot ve ölçüm önerileri henüz kullanıcı tarafından onaylanmış kararlar değildir.
- Segment, CTA, marka, form ve üretici izinleri hakkındaki açık sorular geçerliliğini korur.

## CMS ve schema planı — 21.10.2026
- Kullanıcı CMS eklemeyi şimdilik erteledi. İçerik modeli CMS'den bağımsız tasarlanacak; bu karar kalıcı CMS yasağı değildir.
- Schema skilli ve güncel Google kurallarıyla ürün, paket ve yıllık sürüm ilişkilerinin stratejiye eklenmesi ve dokümanların commit edilmesi istendi; kod yazılması istenmedi.
- `../long-term-web-strategy.md` bölüm 10 içerik ilişkilerini, tür seçimini, Google uygunluk sınırlarını ve gelecekteki doğrulamayı tanımlar; henüz JSON-LD uygulanmadı.
- Kullanıcı sağlam design system gereksinimini yineledi; bu dokümantasyon tamamlandıktan sonra kendi sorusuyla konuyu açacak. Bu aşamada design system kurulumuna geçilmez.


## 21.10.2026 — Profesyonel Hizmetler önceliği

Kullanıcı ana sayfanın Profesyonel Hizmetler sekmeli alanının Aluplan yetkilileri için önemli olduğunu, yapıyı yıllar içinde geliştirdiğini ve hâlâ optimum bulmadığını belirtti. Özelleştirilmiş eğitim, destek ve ilişkili hizmetler ayrı konumlandırma değerlendirmesinde ele alınacak. Bu not alanı kaldırma, sekmeleri değiştirme veya yeni hizmet taahhüdü üretme izni değildir. Kayıt şablonları/iki gerçek değişiklik örneği çalışması kabul edildi; uygulamaya geçilmedi.

## 21.10.2026 — Eğitim hizmetinin sadeleştirilmesi

Kullanıcı hizmet matrisini hazırlamayı kabul etti; ardından “Bireysel & Kurumsal Özel Eğitim sayfasını göz ardı et, Eğitim olarak sadeleştir” talimatı verdi. Konumlandırma tek Eğitim başlığıyla ilerleyecek. Özelleştirme ayrı hizmet/pazarlama dalı olarak sunulmayacak; ihtiyaç bağlamı olarak ele alınabilir. Bu tur mevcut sayfa/URL, içerik veya form değiştirme yok. Matris: `../service-positioning-matrix.md`.

## 21.10.2026 — Destek adresi kullanıcı düzeltmesi

Kullanıcı Teams üzerinden desteğin ve ayrı ticket sisteminin çalıştığını teyit etti. Ticket adresini **allplan.net.tr** olarak düzeltti; önceki kaynak/envanterde `aluplan.net.tr` bulunuyor. Kullanıcının bildirdiği adres planlama için esas alınır; eski gözlem kaydı silinmez. Bu tur bağlantı erişimi bağımsız doğrulanmadı ve site değiştirilmedi. Yeni destek altyapısı gerekmiyor; çalışma saati, SLA veya kanal sırası varsayılmıyor.

## 22.10.2026 — Antrasit kabulü ve schema son kontrol

Kullanıcı antrasit temayı uygun buldu; schema skilliyle ürün/paket/sürüm ve Eğitim/Destek ilişkilerinin son belge kontrolünü istedi. `docs/schema-final-review-2026-10-22.md` (proje köküne göre) güncel resmî kaynakları, karar matrisini ve eksikleri içerir. Tek Eğitim, tek destek hizmeti/iki kanal, Course list–Course Info ayrımı netleştirildi; eski ayrı özel eğitim aday notu kaldırıldı. Fiyat/yorum, TR lisans kapsamı, müşteri destek giriş URL'si ve hizmet koşulları açık. Kod/schema/site/tema değiştirilmedi; Rich Results Test ve URL Inspection yapılmadı. Sıradaki adım raporun kullanıcı değerlendirmesi ve uygulama öncesi kanıt açıklarının kapanmasıdır.

## 22.10.2026 — Eksik hedefleri kaydet, onarımı ertele

Kullanıcı 404 ve eksik hedefleri liste olarak korumamızı, gerekli düzeltmeleri sonra ele almamızı istedi. İçeriği yeniden oluşturma veya tamamen iptal etme seçenekleri açık; satır bazında seçim yapılmadı. Liste: [URL kapanış kaydı](url-closure-2026-10-22.md). Şimdi URL, içerik, link veya schema değiştirilmez; bilinen onarım ihtiyacı envanter ilerlemesini durdurmaz. Yayın öncesi karar ve doğrulama gereklidir.

## 22.10.2026 — Teknik kontrol sorumluluğu

Kullanıcı kalan envanter işlerini onayladı; sonunda tüm öğeleri kendisinin tek tek denetlemek zorunda kalmamasını istedi. Teknik ekip kaynak/canlı eşlemesini, kanıt toplamayı ve doğrulamayı üstlenir; kullanıcıya yalnız gerçek tercih, kapsam ve ticari kararlar sunulur. Eksik teknik kanıt tamamlanmış gibi gösterilmez. Mevcut onarım erteleme ve faz sınırları korunur.
