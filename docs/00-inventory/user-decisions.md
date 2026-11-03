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

## 22.10.2026 — Kullanıcının form, eğitim ve deneme açıklaması

- Mevcut site işletiminin kullanıcı açıklamasına göre hedefi ana Aluplan Teklif & Talep Formu: `https://forms.office.com/r/hXhnKAG912`. Kullanıcı tüm sitede bu tek forma geçildiğini, Pythonpart/Scalypso'nun ayrı CDS formuna gitmesinin hatalı olduğunu teyit etti. Yanlış hedefler düzeltme listesinde; bu tur link değiştirilmedi. Bu geçmiş/mevcut kullanım bilgisidir; 2027 için tek form mimarisi kararı değildir. Destek ticket/Teams, üretici indirme ve mevcut lisans işlemleri bu açıklamayla satış formuna yönlendirilmez.
- Eğitim fiilen dönemsel webinarlar ve YouTube üzerinden yayımlanan geçmiş webinar listesidir. Düzenli eğitim takvimi veya sürekli kurs kataloğu varsayılmayacak. Özel eğitim talepleri de alınabilmeli; tek Eğitim başlığı korunur, ayrı hizmet sayfası oluşturma kararı yok. Fiyat, sertifika, süre veya kesin program taahhüdü eklenmez.
- Paket hakları ve deneme koşullarını Aluplan yetkilileri takip ediyor; belirli kişi adı bildirilmedi. Türkiye koşulları ve14/30gün çelişkisi bu sorumluluk açıklamasıyla doğrulanmış sayılmaz.
- Deneme indirmesi Almanya/ALLPLAN'ın resmî sayfasında gerçekleşir. Türkiye'den yönlendirilen talepleri kısa bilgilendirme/lead formuyla toplamak ayrı ticari amaçtır; ana formun Bölüm11 Download Formları bu niyeti taşır. Lead kaydı indirme, lisans aktivasyonu veya satın alma tamamlandı anlamına gelmez.
- Henüz açık uygulama tercihi: lead adımı indirme öncesinde zorunlu mu, isteğe bağlı mı olacak? Kullanıcı bu sırayı/zorunluluğu belirtmedi. Öneri: indirmeyi engellemeyen kısa bilgi/takip talebi; henüz kabul edilmiş karar değildir. Özel eğitim niyetinin seçilecek form yapısında nasıl kaydedileceği ve teslimat sorumlusu da planlamada belirlenir; mevcut formda özel eğitim alanı varmış gibi davranılmaz.

### 22.10.2026 — Form mimarisi kararının düzeltilmesi

Kullanıcı yeni site için tek teklif formu kullanma kararının henüz verilmediğini açıkça belirtti. Tek form, niyete özel birden fazla form veya ortak veri/operasyon merkezine bağlı farklı girişler ayrıntılı olarak karşılaştırılıp planlanacak. Mevcut ana form ve yanlış CDS hedefleri envanter gerçeğidir; gelecekte aynı formu kullanma zorunluluğu değildir. Form sayısı, arayüz, altyapı, teslimat ve indirme öncesi lead zorunluluğu henüz açık. Uygulama veya hedef değişikliği yapılmadı.

## 22.10.2026 — Next.js yönü kabul edildi; seçenek kapsamı korunuyor

Kullanıcı Next.js içinde kısa formlarla ilerlemeyi onayladı; henüz kod yazılmayacak. Önceki platform seçimi açık notları tarihsel olarak aşıldı. [Alan, takip ve schema sözleşmesi](../request-forms-contract.md) güncel plandır. Kullanıcı mevcut formun üç kategorisi altında çok sayıda seçenek olduğunu hatırlattı: üç çekirdek niyet ürün/eklenti seçeneklerini azaltmaz veya ekran sayısını dondurmaz. Bölüm1–14kapsam eşlemesi eklendi; öğrenci lisansı ve mevcut müşteri eklenti temini ayrı alt yol olarak korunur. Çoklu ürün/modül ilgisi kaybolmaz. Deneme formunun zorunluluğu, gerçek takip hedefi/sorumluları ve hukuki metinler henüz açık; yeni CRM veya site/form/schema uygulaması yok.

## 22.10.2026 — Fiyat yayımlamama ve bilgi mimarisi çalışması

Kullanıcı sitede hiç fiyat belirtilmediğini açıkladı. Yeni plan fiyat yayımlamayı veya schema için sıfır fiyat üretmeyi gerektirmez; paket karşılaştırması işlev/kapsam odaklı, fiyat bilgisi teklif sürecindedir. Kullanıcı menü/sayfa görevleri, URL eşlemesi ve müşteri yolları taslağının hazırlanmasını kabul etti. [Bilgi mimarisi](../site-information-architecture.md) öneridir; menü, sayfa, form, URL veya kod değişikliği onayı değildir.

## 22.10.2026 — Sayfa şablonu/blok planına ilerleme

Kullanıcının “ok go” yanıtı, bilgi mimarisi taslağından sayfa şablonları ve ana sayfa içerik blokları planına ilerleme izni olarak işlendi. Bu yanıt deneme lead zorunluluğu, ticari kapsam, yeni referans bloğu veya tüm menü ayrıntıları için ayrı kesin karar sayılmadı. Kod ve entegrasyon yapılmaz; sonraki çıktı plan değerlendirmesine sunulur.

## 22.10.2026 — Ana sayfa yerleşiminin geçici kabulü

Kullanıcı bağımsız ana sayfa önizlemesini “şu an için uygun” buldu; daha sonra değişiklik yapılabileceğini belirtti. `docs/previews/homepage-wireframe/` içindeki mevcut bölüm sırası ve sunum, sonraki çalışmalara geçici yerleşim referansıdır. Bu karar nihai görsel tasarım, tam içerik paritesi, ticari iddialar, form zorunluluğu, PRD/faz kapanışı veya üretim entegrasyonu onayı değildir. Bu tur önizleme değiştirilmedi. Sıradaki öneri: kabul edilen yerleşimin tasarım sistemi bileşenleriyle eşlemesini planlamak; yeni uygulama çalışması için kullanıcı yönlendirmesini beklemek.

## 22.10.2026 — Tasarım sistemi bileşen eşlemesi

Kullanıcı devam talebiyle kabul edilen yerleşimi tasarım sistemi bileşenlerine eşleme planı hazırlandı: `docs/design-system-component-mapping.md`. H01–H08, kabuk, token zinciri, veri/schema ayrımı ve uyarlama sırası kaydedildi. Kaynak incelemesi: RoleSelector kullanılabilir fakat demo ürün filtresi altı kartı koruyan homepage davranışıyla aynı değil; Header düz menü, çok seviyeli gezinme/arama/tema uyarlaması gerekiyor; demo içerik sözleşmesi proje sözleşmesinin yerine geçmez. Tabs/ReleaseTag eski bulguları güncel kaynakta düzelmiş; runtime kabulü ayrı. İndirilen paket, antrasit kopya, wireframe ve uygulama değiştirilmedi. Sıradaki öneri: ayrı görsel önizlemede header/hero/rol-ürün/hizmet bloklarını gerçek design system ile hazırlamak; entegrasyon yapılmadı.

## 22.10.2026 — Tasarım sistemi kesitine ilerleme

Kullanıcının “ok go” yanıtı, geçici kabul edilen yerleşimin ayrı tasarım sistemi önizlemesinde header, hero, rol/ürün ve hizmet alanlarına uygulanması için ilerleme iznidir. Bu yanıt nihai görsel tasarım, mega menü davranışı, CTA önceliği, ürün iddiaları veya Next.js entegrasyonu kabulü değildir. Önizleme ve doğrulama kaydı: `../design-system-homepage-preview-review.md`.

## 22.10.2026 — Header CTA kararı

Kullanıcı CTA etiketini `Teklif İste` olarak kabul etti. Teklif ve ücretsiz deneme hero'da bulunduğundan header'da bu iki butona gerek olmadığına karar verdi. Planlama ve önizleme kuralı: header gezinme odaklı; ana sayfa hero'sunda `Teklif İste` ve `Ücretsiz Deneme` bulunur. Bu karar canlı link veya uygulama değişikliği değildir.

## 25.10.2026 — Faz 0 kapanışı ve ücretsiz deneme hedefi kararı

- **Faz 0 (İçerik ve Envanter Çıkarımı) Kapanışı:** Kullanıcı Faz 0 envanter çalışmasının kapatılmasını onayladı. Kaynak ve canlı site envanteri, medya/hash eşlemeleri, 161 kaynak snapshot'ı, Microsoft Forms 14 bölüm/24 soru yapısı ve ertelenen 404/hedef onarım listesi (`url-closure-2026-10-22.md`) Faz 0 kapanış kanıtı olarak kabul edildi.
- **Ücretsiz Deneme (14/30 Gün) Çelişkisinin Kapatılması:** Kullanıcı, yeni sitede ücretsiz deneme bağlantılarının doğrudan ALLPLAN'ın resmî **`https://www.allplan.com/trial-or-subscription/`** adresine verileceğini kararlaştırdı. Deneme süresi ve koşulları doğrudan üretici sayfasında yönetildiği için eski kaynaklardaki 14 gün / 30 gün çelişkisi yeni sitede gün sayısı vaadi kullanılmadan doğrudan resmî hedefe yönlendirilerek kapatılır. (Eski 2026 kaynak dosyaları salt-okunur olarak değişmeden kalır.)


## 26.10.2026 — ALLPLAN deneme süresi doğrulandı

Kullanıcı ALLPLAN ücretsiz deneme süresini **14 gün** olarak kesinleştirdi. Resmî kaynak: https://www.allplan.com/trial-or-subscription/ (26.10.2026 kontrolü: “14 DAY FREE TRIAL” ve “Limited to 14 days only.”). Önceki 14/30 gün açık sorusu bu kararla kapanmıştır; Contact'taki 30 gün ifadesi güncel koşula aykırıdır ve 2027 veri üretim/gösterim hattında 14 güne düzeltilecektir. Kaynak 2026 ve tarihsel kanıtlar değiştirilmez. Bu karar diğer üreticilerin/eklentilerin deneme koşullarına otomatik uygulanmaz. Resmî deneme hedefi ve mevcut Microsoft Forms talep kanalı korunur. Bu kayıt yalnız kararı kesinleştirir; uygulama düzeltmesi ve doğrulaması sonraki S05 adımındadır.

## 29.10.2026 — Canlı envanterde yalnız EN + TR (diğer diller kapsam dışı)

Kullanıcı, 2027 içerik çalışmasında yalnızca **İngilizce (birebir EN)** ve
**Türkçe (taslak TR)** içerikle çalışılmasını kararlaştırdı; diğer dillerle
(açık örnek: SDS2 sayfasındaki İtalyan bağlantı URL'leri, Almanca
"Video ansehen" kaçışı) vakit kaybedilmeyecek.

Sonuçları:
- Canlı envanter dosyalarındaki birebir EN/TR kayıtları geçerlidir; kayıtta
  "kaynak hatası" olarak geçen İtalyan URL'ler envanterin parçası olmaya
  devam eder (canlı durumun doğru kaydı), ancak üretimde bu hedefler
  **EN/TR karşılıklarıyla** çözülecek: canlı sayfanın EN sürümündeki
  bağlantı hedefi esas alınır, TR gerekirse TR sürümünden alınır.
- Almanca/İtalyanca metin kaçışları için ayrıca düzeltme, araştırma veya
  çeviri yapılmayacak; üretici diliyle ilgilenilmez.
- Bu karar diğer dillerdeki ücret/plan/izin sorularını kapatmaz; yalnız
  envanter ve üretim dil kapsamını sınırlar (EN + TR).

## 03.11.2026 — Yayın öncesi açık maddeler için kararlar

Kullanıcı, yayın öncesi kalan maddeler listesinde aşağıdaki kararları verdi:

- **B2 (`/2027/features` H1):** Sayfa başlığı ve giriş metni, kullanıcının verdiği üretici metninin Türkçesi olur. Üst satır: “2027 yenilikleri: Allplan, Allplan Civil, FRILO, SCIA, SDS2”; H1: “Her mühendislik iş akışı için kapsamlı çözümler”. Ana sayfa H1'iyle çakışma, üst satır H1'e alınarak giderilir (uygulama notu doğrulama belgesinde).
- **B3 (BIMFlex özel video):** Kullanıcı videonun bulunduğu sayfayı istedi; karar sonraya kaldı.
- **B4:** “Youtube Allplan Global” kartının başlığı bağlandığı kanala uygun hale getirilir.
- **B5:** `<main>` bağlantı farklarının D bölümü kullanıcıyla tek tek gözden geçirilecek.
- **B6:** “Sürümleri Görüntüle” hedefi (`allplan.com/system/releasenotes/`) korunur.
- **B7:** Eski paket karşılaştırma PDF'leri `/2027/compare` sayfasına kalıcı yönlendirilir.
- **C1 (doğrulanmamış iddialar):** Kullanıcı üreticiden bilgi alacak; iddialar şimdilik değiştirilmez. **Açık takip maddesi.**
- **C2:** Projede üretilen görseller (AI üretimi hero aileleri, OG, Max posteri) kullanıcıya/projeye aittir; lisans kaydı buna göre tamamlanır.
- **C3:** Çerez tercihlerini sonradan değiştirmek için arayüz eklenir.
- **D1:** Ürün sayfalarının yapılandırılmış verisi ve paylaşım etiketleri SEO uyumlu hale getirilir.
- **D2, D4, D6, D7, D8:** Erişilebilir adlar, JS paketi, indirme bağlantısı adları, AX3000 doküman başlıkları ve harita/türev betiği düzeltmeleri yürütücüye bırakıldı.
- **E1–E3:** Ortak bileşen taşıması, premium hareket ve mobil video sonraki fazlar olarak kabul edildi.
- **Yeni sayfa (Kaynaklar):** Ana menüdeki “Kaynaklar” bağlantısının gittiği ana sayfa bölümü (“Profesyonel Hizmetler ve Destek Merkezi”, 19 kaynak) şimdilik kalır. Aynı bilgileri daha derli toplu sunan yeni bir sayfa kullanıcıyla birlikte tasarlanacak; kullanıcı onayından sonra bölüm kaldırılıp menü yeni sayfaya bağlanacak.
