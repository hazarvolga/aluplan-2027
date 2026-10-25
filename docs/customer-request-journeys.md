# Teklif, deneme ve eğitim kullanıcı yolları

> Güncel durum: Next.js kısa form yaklaşımı kullanıcıca kabul edildi. Aşağıdaki karşılaştırma tarihsel gerekçedir; güncel alan ve kapsam planı [sözleşmede](request-forms-contract.md). Kod/entegrasyon onayı değildir.

22.10.2026 — Karşılaştırma ve öneri; onaylanmış form mimarisi veya uygulama değildir. Kullanıcı bu yolları baştan planlamayı istedi. Mevcut içerik kanıt olarak korunur; mevcut formun doğruluğu varsayılmaz. Yeni URL, form, entegrasyon veya JSON-LD oluşturulmadı. Bu hedefli UX planı, tüm Faz 1 analizinin tamamlanması anlamına gelmez.

## Dayanak ve problem

[Yönetici incelemesi](00-inventory/form-admin-2026-10-22.md) mevcut formda14bölüm/24soru ve koşullu yolları kaydetti. Her ziyaretçi24soruyu görmez; toplam uzunluk tek başına kullanıcı yükü ölçümü değildir. Ancak teklif, öğrenci başvurusu, indirme ve eklenti niyetleri aynı yapıda; firma ve duyum kaynağı gibi alanlar ortak demografik adımda zorunlu. Scalypso dalı kendi bölümünü atlıyor. [Kullanıcı açıklaması](00-inventory/user-decisions.md) eski CDS hedeflerinin hata olduğunu, Eğitim'in dönemsel webinar/arşiv ve özel talep olduğunu belirtiyor. Form terk/dönüşüm ölçümü yok; aşağıdaki faydalar test edilecek hipotezlerdir.

## Seçenek karşılaştırması

İki bağımsız karar ekseni var: ziyaretçinin gördüğü form yapısı ve taleplerin arkada nasıl yönetildiği. Tek form da ayrı formlar da ortak kayıt sözleşmesi kullanabilir.

| Ziyaretçi deneyimi | Tek koşullu form | Niyete özel kısa formlar |
|---|---|---|
| Giriş | Genel girişte niyet seçimi; sayfadan bağlam aktarılırsa seçim atlanabilir | Teklif, deneme yardımı ve eğitim CTA'sı ilgili alanları doğrudan açar |
| Alan yükü | İyi dallanırsa kısa; ortak zorunlu alanlar gereksiz yük yaratabilir | Her niyet için gerekli alanlar belirgin; aynı ortak bileşenler kullanılabilir |
| Bakım | Tek görünüm; dallanma ve regresyon karmaşıklığı artabilir | Birkaç görünüm; ortak alan tanımı kullanılmazsa kopyalar ayrışabilir |
| Belirsiz niyet | Genel girişte yönlendirme kolay | Genel iletişimde basit bir niyet seçici gerekebilir |
| Ölçüm | Dallar ayrı etiketlenmeli | Ayrı girişler aynı olay sözlüğüne bağlanmalı |
| Schema | Form sayısı varlık sayısı değildir | Ayrı form ayrı ürün/hizmet değildir |

| Operasyon | Ortak kayıt/teslimat sözleşmesi | Bağımsız kayıt/teslimat |
|---|---|---|
| Takip | Niyet ve ekip etiketleriyle tutarlı kayıt | Ekip bazında bağımsızlık; merkezî raporlama/tekrar kayıt riski |
| Bakım | Ortak alanlar ve hata takibi; ortak hata birden fazla yolu etkileyebilir | Yerel değişiklikler bağımsız; ortak değişiklik birkaç yerde gerekebilir |
| Yıllık sürüm | Ürün/sürüm kaynağı bir kez güncellenebilir | Ortak ürün kaynağı yine kullanılabilir; kullanılmazsa senkronizasyon işi doğar |
| Maliyet | Başlangıç sözleşme işi; yeni CRM/backend şart değil | Mevcut ekip araçlarıyla hızlı olabilir; toplam takip maliyeti ayrıca ölçülmeli |

**Öneri: niyete özel kısa girişler + ortak kayıt/teslimat sözleşmesi.** Ziyaretçi teklif, deneme desteği ve özel eğitim için kendi amacını görsün; ortak alanlar tek tanımdan yönetilsin. Bu üç bağımsız yazılım geliştirmek değildir. Tek koşullu form da geçerli bir alternatif olarak kalır. Microsoft Forms'u korumak, farklı Forms oluşturmak veya Next.js arayüzü kullanmak sonraki altyapı değerlendirmesidir. Mevcut araçların bağlam aktarımı, dallanma, teslimat ve ölçüm yetenekleri henüz doğrulanmadı; kesin maliyet sıralaması verilmiyor.

## 1. Teklif / uygun çözüm seçimi

**Niyet:** “Bana uygun ürünü ve ticari koşulları öğrenmek istiyorum.” Paketini bilmeyen kişi de başvurabilmeli.

Ürün/çözüm/paket sayfası veya genel iletişim → bağlamı görünür kısa talep → teslimat doğrulaması → satış ekibinin takibi.

| Alan | Önerilen durum | Gerekçe |
|---|---|---|
| Ad soyad | Zorunlu | Muhatap |
| E-posta | Zorunlu; kurumsal adres şartı yok | Yanıt kanalı |
| İhtiyaç / ilgilenilen çözüm | Zorunlu seçim; “Seçim için yardım istiyorum” mümkün | Paketi bilme zorunluluğu olmadan yönlendirme |
| Firma | İsteğe bağlı ilk temas | Bireysel başvuruyu engellemez; satış takibinde tamamlanabilir |
| Telefon | İsteğe bağlı; kullanıcı telefonla dönüş seçerse gerekli | Gereksiz zorunluluğu azaltır |
| Kısa açıklama | İsteğe bağlı | Proje bağlamı; ilk aşamada dosya yükleme yok |

Geldiği sayfanın ürün/paket bilgisi görünür ve değiştirilebilir öneri olur. Sürüm zorunlu seçilmez; tarihi bir sayfadan geliş satın alma tercihi sayılmaz. Teknik destek ihtiyacı belirirse mevcut Teams/ticket girişleri gösterilir; satış talebi destek bileti gibi işlenmez. “Teklif alındı” ancak kalıcı kayıt sonrası gösterilir; otomatik fiyat veya yanıt süresi vaat edilmez.

## 2. Deneme indirme ve Türkiye takibi

**İki ayrı başarı:** üreticinin sayfasına ulaşmak ve Aluplan'dan yardım istemek. Dış bağlantı tıklaması gerçek yazılım indirmesi değildir.

Deneme CTA → Aluplan'ın rolünü ve resmî indirme hedefini açıklayan kısa geçiş → **Resmî denemeye git**. Aynı yerde isteğe bağlı **Türkiye'de kurulum/ürün seçimi için yardım iste** girişi önerilir. Yeni ara sayfa URL'si veya zorunlu adım henüz kararlaştırılmadı; açıklama mevcut sayfada da sunulabilir.

| Yaklaşım | Kazanç hipotezi | Bedel / sınır |
|---|---|---|
| İndirme öncesi zorunlu lead | Daha fazla iletişim kaydı | Üretici formunda tekrar bilgi verme, terk ve düşük niyetli kayıt riski; gerçek indirme yine bilinmez |
| İsteğe bağlı yardım talebi — öneri | Yardım isteyenleri ayırır; üreticiye erişim sürer | İletişim bilgisi bırakmadan gidenler olacaktır |
| Doğrudan dış bağlantı | En az adım | Aluplan'ın yerel takip imkânı sınırlı |

Yardım formu: ad ve e-posta zorunlu; yardım konusu kısa seçim; telefon/firma isteğe bağlı. Ürün bağlamı mevcutsa tekrar sorulmaz. Öğrenci lisansı ticari denemeden ayrı niyettir; belge toplama varsayılmaz, güncel üretici öğrenci süreci ayrıca doğrulanır. Bölüm11 mevcut niyetin kanıtıdır, yeni akışın şablonu değildir. Deneme süresi doğrulanmadan14veya30gün seçilmez. Lead servisi çalışmazsa üreticiye gitme bağlantısı çalışmaya devam etmelidir.

## 3. Eğitim: öğren, izle, özel talep bırak

Tek Eğitim girişi altında üç ayrı görev:

1. **Geçmiş webinarı izle:** konu/ürün bazında arşiv → YouTube kaydı; lead formu zorunlu değil. Eski sürüm bilgisi görünür kalır, yeni sürümle etiketlenmez.
2. **Yaklaşan webinarı incele:** yalnız gerçek duyuru varsa tarih/konu ve doğrulanmış katılım hedefi. Program yokken aktif takvim veya kayıt vaadi yok; arşiv ve özel talep görünür kalır.
3. **Özel eğitim talep et:** konu/ihtiyaç, ad ve e-posta zorunlu; seviye, katılımcı sayısı, tercih edilen zaman/format, firma ve telefon isteğe bağlı. İlk adım rezervasyon veya kesin hizmet satışı değil, değerlendirme talebidir.

Aluplan'ın uygunluk değerlendirmesi sonrası kapsam, tarih ve koşullar konuşulur. Her eğitim için sertifika, sabit ücret, sürekli sınıf programı veya cevap süresi türetilmez. Geçmiş kayıtları izlemek, yeni webinar kaydı ve özel eğitim talebi aynı form olayına indirgenmez.

## Ortak operasyon sözleşmesi — altyapı seçimi değil

Her talep için `requestId`, `intent`, `productRefs`, isteğe bağlı `editionRef/releaseRef`, `sourcePage`, `createdAt`, iletişim alanları, yönlendirilen ekip ve durum kaydı önerilir. Bunlar iç veri alanlarıdır; schema.org özelliği değildir. Talep sahibinin yazdığı metinler URL'ye, analitik olayına veya JSON-LD'ye taşınmaz. Kaynak sayfa bağlamı izin/hak veya kullanıcının açık ürün tercihi yerine geçmez.

- Teklif → satış; deneme yardım talebi → ürün/kurulum ön değerlendirme; özel eğitim → eğitim koordinasyonu. Bunlar önerilen sorumluluk rolleridir; mevcut personel/CRM ataması değildir.
- E-posta bildirimi ile kalıcı kaydı ayır: kayıt var/bildirim başarısız durumda talebi kaybetmeden yeniden dene. Kullanıcıya başarısızlığı gizleyen sahte başarı gösterme.
- Çift tıklama/yeniden denemede aynı talep çoğaltılmasın; doğrulama ve spam önleme erişilebilir olmalı. Detaylar uygulama sözleşmesinde test edilir.
- Aydınlatma görünür olsun; pazarlama aboneliği istenirse talebe yanıt verme amacından ayrı tasarlansın. Hukuki dayanak/saklama süresi yetkili incelemesine bağlıdır; burada hukuk kararı verilmiyor.
- İlk hedef yeni CRM kurmak değil, takip kaybını önleyen en küçük çözümü mevcut araçlarla değerlendirmek. Destek sistemine satış/eğitim talebi gönderme veya müşteri CRM'siyle entegrasyon kararı yok.

## Schema ve içerik ilişkileri

Form mimarisi içerik/tema/schema ayrımını değiştirmez. Kalıcı ürün, paket, yıllık sürüm ve Eğitim hizmeti kimlikleri aynı kalır; form seçeneği yeni ürün veya lisans hakkı yaratmaz.

| Yol | İçerik/schema önerisi | Yapılmayacak çıkarım |
|---|---|---|
| Teklif | Kaynak ürün sayfasının ana varlığı ürün/yazılım; genel talep sayfası ContactPage/WebPage olarak amacıyla ele alınabilir. İlgili ürün ilişkisi kanıtlı içerikten | Fiyat yokken formu Offer/fiyat gibi göstermek; talebi PurchaseAction başarısı saymak |
| Deneme | Resmî yazılım/üretici hedefi ve Aluplan yardım kanalı ayrı; ürün kimliği ve sürüm bağlamı korunur | Lead gönderimini indirme/aktivasyon saymak; denemeyi ücretli ürün için fiyat=0 yapmak |
| Eğitim | Tek Service, provider Aluplan; eğitim sayfası mainEntity ile hizmete, about ile ilgili ürüne bağlanabilir. Gerçek erişim kanalı ServiceChannel/serviceUrl ile açıklanabilir | Her kısa formu yeni Service/Course saymak |
| Webinar arşivi | Gerçek videolar görünür içerik ve doğrulanmış metadata ile ayrı değerlendirilir; önceki video/schema planı geçerli | Her kaydı Course veya her arşiv sayfasını video watch page saymak |

`EntryPoint` veya `potentialAction` zorunlu değildir; ilk kapsam için doğru sayfa/varlık/kanal ilişkisi yeterli adaydır. Gelecekte eklenirse yalnız gerçekten yapılabilen işlemi anlatır. Bütün ziyaretçi formlarını tek global JSON-LD içinde ürün olarak yayımlama yok. Form yanıtları ve müşteri bilgileri halka açık schema değildir.

22 Ekim doğrulaması: Google işaretlemenin görünür içeriği temsil etmesini ister ve zengin sonuç garantisi vermez; SoftwareApplication sonucu için fiyat/değerlendirme şartları önceki planda izlenir. ServiceChannel bir hizmete erişim yoludur; form sayısı ile hizmet sayısı eşitlenmez. Kaynaklar: [Google genel kuralları](https://developers.google.com/search/docs/appearance/structured-data/sd-policies), [SoftwareApplication](https://developers.google.com/search/docs/appearance/structured-data/software-app), [ServiceChannel](https://schema.org/ServiceChannel), [ContactPage](https://schema.org/ContactPage), [mainEntity](https://schema.org/mainEntity), [about](https://schema.org/about). Diğer türlerin ayrıntılı mevcut kararı: [schema envanter etkisi](schema-inventory-impact-2026-10-22.md). Yeni rich-result testi yapılmadı.

## Başarı ölçümü ve kabul senaryoları

Ölçümler öneridir; henüz araç kurulmadı veya baz oran yok. `request_start`, `request_validation_error`, `request_persisted`, `request_delivery_failed`, `trial_outbound_click`, `webinar_outbound_click` ayrı olaylar olsun. Niyet/sayfa bazında tamamlanma ve hata oranı, satış ekibince nitelikli talep oranı ve takip süresi izlenir. E-posta, telefon, serbest metin olay parametresi olmaz. Üretici geri bildirimi yoksa deneme indirmesi/aktivasyonu ölçüldü denmez; deneysel kazanç yüzdesi uydurulmaz.

Uygulama öncesi akış kabul örnekleri:

- Paket bilmeyen ziyaretçi teklif isteyebilir; kaydı doğru niyeti taşır.
- Ürün bağlamı değiştirilebilir; eski sürüm sayfasından geliş güncel lisans tercihi sayılmaz.
- Lead bırakmayan kişi, isteğe bağlı model kabul edilirse resmî denemeye erişebilir.
- Yaklaşan webinar yoksa arşiv erişilebilir; hayalî takvim gösterilmez.
- Özel eğitim talebi rezervasyon gibi onaylanmaz; gerçek kayıt ve takip hedefi vardır.
- Form/teslimat hatası, çift gönderim, dar ekran ve klavye kullanımında veri kaybı veya sahte başarı oluşmaz.

## Karar için önerilen paket

1. Niyete özel üç kısa giriş ve ortak kayıt/teslimat sözleşmesi; araç seçimini sonra yapma.
2. Deneme indirmesini isteğe bağlı Aluplan yardım talebinden bağımsız tutma.
3. Eğitim arşivini formsuz izleme; gerçek webinar duyurusu varsa kendi kayıt yolu; özel eğitim için kısa değerlendirme talebi.

Bu üç madde **öneridir**. Kullanıcı kabulü sonrası alanlar ve operasyon hedefleri kesinleştirilip mevcut araçlarla uygulanabilirlik/maliyet karşılaştırılır. Sonra somut form/URL geçiş haritası hazırlanır; eski hedefler kendiliğinden kaldırılmaz. Kullanıcının yalnız bu planı istemesi uygulama izni değildir.

## 22.10.2026 — Form platformu karşılaştırması

Kullanıcı niyete özel kısa girişler/ortak takibi mantıklı buldu ve Forms–Next.js karşılaştırmasını istedi. [Platform değerlendirmesi](form-platform-comparison.md) kurulum, lisans/altyapı, bakım, kayıt/teslimat, ölçüm ve schema etkisini aynı kapsamla karşılaştırır. Uzun vadeli aday Next.js + mevcut uygun operasyon hedefi; teknik bakım ayrılmayacaksa Forms daha sürdürülebilir alternatif. Bu bir seçim değildir. Tahmini iş yükleri planlama aralığıdır; mevcut Microsoft lisansı, connector hakları, takip hedefi ve kapasite bilinmeden kesin ücret yok. Yeni CRM/Forms'a gizli POST/uygulama kurulumu önerilmiyor. Sıradaki adım mevcut haklar, takip hedefi ve bakım sorumluluğuyla platform seçimini netleştirmek. Kod, canlı form veya JSON-LD değiştirilmedi.

## 22.10.2026 — Next.js yönü kabul edildi; seçenek kapsamı korunuyor

Kullanıcı Next.js içinde kısa formlarla ilerlemeyi onayladı; henüz kod yazılmayacak. Önceki platform seçimi açık notları tarihsel olarak aşıldı. [Alan, takip ve schema sözleşmesi](request-forms-contract.md) güncel plandır. Kullanıcı mevcut formun üç kategorisi altında çok sayıda seçenek olduğunu hatırlattı: üç çekirdek niyet ürün/eklenti seçeneklerini azaltmaz veya ekran sayısını dondurmaz. Bölüm1–14kapsam eşlemesi eklendi; öğrenci lisansı ve mevcut müşteri eklenti temini ayrı alt yol olarak korunur. Çoklu ürün/modül ilgisi kaybolmaz. Deneme formunun zorunluluğu, gerçek takip hedefi/sorumluları ve hukuki metinler henüz açık; yeni CRM veya site/form/schema uygulaması yok.

## 25.10.2026 — Ücretsiz deneme hedefi kararı

Kullanıcı, yeni sitede ücretsiz deneme CTA'larının doğrudan **`https://www.allplan.com/trial-or-subscription/`** adresine yönlendirileceğini kararlaştırdı. Bu kararla birlikte 14/30 gün deneme süresi çelişkisi kapanmış ve doğrudan üretici sayfasına bağlantı esas alınmıştır.
