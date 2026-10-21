# Aluplan uzun vadeli web stratejisi

Tarih: 21.10.2026 · Sürüm: 0.2 · Durum: kullanıcı değerlendirmesine sunulan strateji taslağı. CMS'nin şimdilik ertelenmesi kullanıcı kararıdır; aşağıdaki schema modeli uygulama öncesi plandır.

Bu belge PRD, onaylı site haritası veya tasarım değildir. Kullanıcının kesinleştirdiği öncelikler: yıllık siteyi yeniden yapma yükünü azaltmak ve ürünleri doğru anlatmak. Kalıcı içerik, yıllık sürümler ve müşteri kazanımı birlikte planlanır. Aşağıdaki işletim modeli, önceliklendirme ve kabul ölçütleri öneridir; ticari segment sıralaması, tek birincil dönüşüm, marka ve form altyapısı kararları açık kalır.

## 1. Stratejik yön

Aluplan sitesi, her yeni ALLPLAN sürümünde yeniden yapılan bir tanıtım sitesi yerine, ürün seçimini ve kullanımını kolaylaştıran, içerik biriktiren bir hizmet ve satış kanalı olarak işletilsin. Yeni sürüm, bu yapıya eklenen ve ilgili kayıtları güncelleyen bir yayın olsun.

Önerilen başarı sırası:
1. Yeni sürümü mevcut şablonlarla ve kontrollü içerik güncellemesiyle yayınlayabilmek.
2. Ziyaretçinin ihtiyacını doğru çözüm, ürün ve paketle ilişkilendirmesini kolaylaştırmak.
3. Bu açıklığın nitelikli satış taleplerine katkısını ölçmek.

Aluplan'ın Türkiye distribütörü/çözüm ortağı kimliği esas alınır. Diğer markalar da aynı içerik modelinde yer bulur. Üretici özelliklerinin aktarımına, doğrulanmış yerel açıklama, ürün seçimi desteği ve mevcut eğitim/destek yolları eşlik eder. Mevcut kapsamda doğrulanmayan yeni danışmanlık veya hizmet vaadi oluşturulmaz.

`aluplan-2027` çalışma klasörü korunur. İsmindeki yıl, sitenin bir yıl ömrü olduğu veya sonraki yıl yeni depo açılacağı anlamına gelmez. Öneri: tek devam eden kod tabanı, içerik sürümleri ve yayın geçmişi. Framework bakımı ürün lansman takviminden ayrı yürütülür.

## 2. Dayanaklar ve henüz bilinmeyenler

- [Kullanıcı kararları](00-inventory/user-decisions.md): canlı site esas; içerik, URL, CTA, dosya ve üretici kimlikleri korunacak; hedef Next.js, mevcut yaklaşım CMS'siz.
- [URL karşılaştırması](00-inventory/url-parity.md): 19.10.2026 örnekleminde 131 yol kontrol edildi; 116 doğrudan 2xx ve 4 başarılı yönlendirme görüldü. Bu, içerik veya tüm URL yüzeyinin eksiksizlik kanıtı değildir.
- [ALLPLAN referans analizi](allplan-information-architecture.md): ürün, paket, çözüm ve iş akışı farklı kavramlar olarak incelendi. Aluplan envanteriyle ayrıntılı karşılaştırma henüz tamamlanmadı.
- [Marka kılavuzu](BRAND-GUIDELINES.md): taslak; yeni görsel kimlik onaylanmış değil.

Mevcut trafik, sorgu, teklif kalitesi, satışa dönüşüm, yıllık bakım saati ve kullanıcı araştırması verileri bu stratejide doğrulanmış değildir. Satış artışı, arama sıralaması veya belirli bir bakım tasarrufu vaat edilmez. Sektör öncelikleri mevcut MİMAR/MÜHENDİS/PREKAST gruplarından otomatik çıkarılmaz.

## 3. Kalıcı içerik ve değişen bilgi

“Kalıcı” içerik hiç değişmeyen metin değildir; adresi ve amacı süreklidir, doğrulanmış bilgiyle güncellenir.

| İçerik türü | Kalıcı görevi | Güncelleme tetikleyicisi |
|---|---|---|
| Kurum/iletişim | Aluplan kimliği ve erişim | Doğrulanmış kurumsal değişiklik |
| Çözüm | Kullanıcının işi, problemi ve beklediği çıktı | İş akışı veya çözüm kapsamı değişikliği |
| Ürün ailesi | Yazılımın ne yaptığı, kime uygun olduğu | Yetenek, entegrasyon veya konumlandırma değişikliği |
| Paket/edition | Hangi özelliklerin hangi kapsamda sunulduğu | Üreticinin paket veya lisans değişikliği |
| Sürüm | Belirli yayının yenilik ve uyumluluk bilgileri | Yeni sürüm veya doğrulanmış düzeltme |
| Eğitim/destek | Kullanıcının bir işi yapması veya sorun çözmesi | Arayüz, sürüm, yöntem veya hizmet değişikliği |
| Referans | Gerçek kullanım örneği ve kanıt | İzinli yeni proje veya doğrulanmış düzeltme |
| Dosya/medya | İlgili içeriğin indirilebilir kanıtı | Yeni dosya revizyonu veya kullanım izni değişikliği |
| Kampanya | Belirli süreli ticari iletişim | Başlangıç/bitiş ve onaylı koşul değişikliği |

Ürün ailesi → paket → sürüm ilişkisi açık tutulur. ALLPLAN 2026 bir sürüm bağlamıdır; 2027 site projesi adıyla veya Ultimate paket adıyla eşitlenmez. Farklı üreticilerin sürüm tarihleri tek bir küresel “güncel yıl” değişkenine bağlanmaz.

Her kayıt için önerilen alanlar: kararlı kimlik, içerik türü, mevcut URL, kaynak, ilgili ürün/paket/sürüm kimlikleri, editöryal durum, son doğrulama tarihi, sorumlu rol ve yeniden inceleme tetikleyicisi. Güncel ürün/paket kapsamı gerekirse sürüme ve bölgeye göre farklı kayıtlarla tutulur. Bir özellik değişince ilgili karşılaştırma ve kartlar aynı doğrulanmış kaynaktan beslenir.

### İçeriği koruma ve iyileştirme sınırı

İlk taşıma tam kaynak içeriği korur; kullanıcı onayı olmadan özetleme, silme veya yeni iddia yoktur. Daha anlaşılır anlatım önerileri ayrı değişiklik listesinde eski metin, önerilen metin, gerekçe ve kaynakla sunulur. Şablonların kurulması mevcut metinleri otomatik yeniden yazma yetkisi vermez.

### URL ve arşiv politikası önerisi

- Mevcut geçerli URL'ler korunur. Yeni bilgi mimarisi, önce içerik ilişkileri ve erişim yollarıyla değerlendirilir; toplu URL değiştirme projesi başlatılmaz.
- Mevcut `/products/allplan-2026` gibi sürüm sayfası gelecek yılın içeriğiyle sessizce değiştirilmez. İlgili sürüm bilgisi kalır; onaylanırsa güncel sürüme açıklayıcı bağlantı eklenir.
- Yeni sürüm sayfasının kesin URL'si envanter ve PRD sırasında belirlenir. Bu belge yeni rota oluşturmaz.
- Eski sürüm sayfası, anlamlı özgün içeriği varsa otomatik yönlendirilmez veya noindex yapılmaz. Aynı olmayan iki sürümün canonical'ı yalnız “eskidi” diye birleştirilmez.
- Eski PDF/video dosyası aynı adla farklı içerikle ezilmez. Yeni revizyon ayrı kayıt olur; mevcut bağlantılar korunur. Kullanım izni veya güvenlik nedeniyle erişim değişikliği gerekirse ayrı onay ve kayıt gerekir.
- İçerik durumu `current/previous/archived` gibi yönetilebilir. Bu durumlar üreticinin destek süresini ifade etmez; destek bilgisi ayrıca kaynakla doğrulanır.
- Zorunlu adres değişikliği ancak onaylı birebir 301 haritası, iç bağlantı/canonical/sitemap kontrolü ve yayın sonrası izlemeyle yapılır.

Google, URL değişimlerinde eşleme, kalıcı yönlendirme ve izlemeyi; kapsamlı değişiklikleri mümkünse ayırmayı önerir. Bu stratejide URL sürekliliği tercihimiz yeniden taşıma işini azaltmayı amaçlar; sıralama garantisi değildir. [Google taşıma rehberi](https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes)

## 4. Ürünleri anlatmak için ortak editöryal yapı

Her ürün sayfası aşağıdaki sorulara cevap verecek şekilde değerlendirilsin. Bu bir görsel sayfa taslağı değil, içerik kontrol listesidir:

1. Bu ürün nedir; üretici ve Aluplan'ın rolü nedir?
2. Hangi işi yapan kullanıcıya, hangi durumda uygundur?
3. Hangi iş akışını ve çıktıyı destekler?
4. İlgili pakette neler vardır; ayrıca alınan veya doğrulanması gereken neler vardır?
5. Hangi sürüm, sistem ve entegrasyon bilgileri geçerlidir?
6. Hangi kanıtlı proje, eğitim veya teknik açıklama daha fazla bilgi sağlar?
7. Kullanıcı nasıl teklif alır, dener veya destek bulur?

Özellik anlatımı için öneri: **kullanıcının işi → karşılaştığı sorun → doğrulanmış yetenek → elde edilen çıktı → kapsam/sürüm → kaynak**. İşe katkı açıklanabilir; kaynakta olmayan hız, maliyet, mevzuat uyumu veya rekabet üstünlüğü iddiası eklenmez.

Paket karşılaştırması tek kaynaktan üretilecek aday modeldir. Aynı özellik için farklı sayfalarda çelişen açıklama oluşmaması hedeflenir. “Var”, “yok”, “ek seçenek” ve “doğrulanmadı” ayrımı korunmalı; bilinmeyen özellik yok sayılmamalı. Her farklı markayı ALLPLAN'ın paket hiyerarşisine zorlamak yerine ürün ve ilişki modeli markadan bağımsız olmalı.

İlk pilot önerisi: bir ürün ailesi, ilgili paketler ve mevcut bir çözüm sayfası. Pilot seçimi ticari veri/ekip ihtiyacına göre yapılır; segment önceliği bu belgede seçilmez. Değerlendirmede kullanıcıdan uygun ürünü bulması, paket farkını açıklaması ve sonraki adımı seçmesi istenir. Yanlış anlamalar kaydedilir; iç ekip görüşü müşteri testi yerine sunulmaz.

## 5. Yıllık sürüm güncelleme iş akışı

Amaç: standart bir yeni sürümü, yeni site/kod tabanı veya tasarım gerektirmeden yayınlamak. Yeni bir etkileşim gerçekten gerekiyorsa bileşen işi ayrı kapsam olarak açılır.

| Adım | İş ve çıktı | Kontrol / sorumlu rol önerisi |
|---|---|---|
| 1. Kaynağı topla | Üretici sürüm notu, paket tablosu, dosyalar, bölgesel şartlar | Ürün bilgisi sorumlusu; kaynak ve tarih kaydı |
| 2. Farkı çıkar | Eski–yeni özellik, paket, uyumluluk, dosya ve CTA fark listesi | Teknik içerik doğrulayan kişi |
| 3. Taslağı hazırla | Sürüm kaydı ve yalnız etkilenen içerik kayıtları | Geliştirici/içerik editörü |
| 4. Tarihsel bilgiyi koru | Önceki sürüm/dosyaların ilişkilerini kontrol et | Editöryal inceleme |
| 5. Preview ve doğrulama | Etkilenen sayfalar, linkler, dosyalar, meta/schema, responsive görünüm | Geliştirici; hedefli otomatik ve manuel kontroller |
| 6. İş onayı | Ürün anlatımı, teklif koşulları, yayın tarihi | Aluplan adına yetkili kişi |
| 7. Yayın ve geri dönüş | Onaylı sürüm, commit, önceki çalışan yayın kaydı | Yayın yetkilisi; ayrı canlı onayı |
| 8. Sonuç kontrolü | Açılan sayfa, CTA hedefi, dosya erişimi ve izleme | Geliştirici + talep takibini yapan kişi |

Bir kişi birden fazla rolü üstlenebilir; isim ataması yapılmadı. En azından ürün doğruluğu kararıyla teknik yayın kontrolü ayrı kontrol maddeleri olarak kaydedilmeli.

**Tekrarlanabilirlik deneyi:** Uygulama aşamasında, gerçek gelecek sürüm iddiası üretmeden, yalnız yerel test verisiyle bir sonraki sürüm ekleme provası yapılması önerilir. Başarı: mevcut şablonlarla yeni kayıt gösterilir, eski sürüm ve dosyalar erişilebilir kalır, paket farkları doğru yansır, URL/CTA paritesi korunur. Bu prova yeni sürüm pazarlama içeriği yayınlama izni değildir.

Lansman tamamlanınca kısa kayıt tutulur: harcanan süre, değişen kayıtlar, değişen bileşenler ve en çok zaman alan sorun. Sonraki iyileştirme bu darboğaza göre seçilir.

## 6. Müşteri kazanım modeli

Önerilen yol: **ihtiyaçla keşif → uygun çözümü anlama → ürün/paket değerlendirme → mevcut teklif veya deneme hedefi → satışın değerlendirmesi**. Kullanıcı her aşamada teknik destek ve eğitim yolunu da bulabilmeli.

| Niyet | İçerik cevabı | Mevcut hedeflerle sonraki adım |
|---|---|---|
| İşime uygun yazılım arıyorum | Çözüm ve iş akışı; ilgili ürün ilişkisi | İlgili ürün/paket sayfası |
| Ürünleri/paketleri karşılaştırıyorum | Kapsam, fark, uyumluluk ve kanıt | Mevcut paket PDF'si veya teklif formu |
| Satın almadan değerlendireceğim | Doğrulanmış deneme bilgisi ve gerekli hazırlık | Mevcut ALLPLAN deneme URL'si |
| Teklif istiyorum | Ürün bağlamı ve mevcut iletişim seçenekleri | Mevcut Microsoft Forms hedefi |
| Ürünü zaten kullanıyorum | Sürüme uygun eğitim ve destek | Mevcut eğitim, Teams/ticket/sertifika hedefleri |

Teklif mi deneme mi birincil olacak sorusu açık kalır. İlk öneri, sayfa niyetine göre mevcut hedefleri anlaşılır sunmak; ortak bir birincil CTA kararını satış süreci ve veriyle vermektir. Yeni form veya CRM kurulumu varsayılmıyor.

### İçerikle talep oluşturma

Önce mevcut ürün ve çözüm açıklamaları iyileştirilir; ardından müşterilerin gerçek seçim sorularına dayanan az sayıda kalıcı rehber hazırlanması değerlendirilir. Örneğin paket seçimi, mevcut iş akışından geçiş, sistem hazırlığı ve sürüm farkları birer konu adayıdır; yazılacak metinler ve iddialar henüz onaylı değildir. Yayın takvimi sayfa sayısı doldurmak için kurulmaz.

Özgün değer, doğrulanmış yerel deneyim ve soruya tam cevap vermektir. Üreticinin metnini çevirmek tek başına içerik stratejisi sayılmaz. Google'ın kullanıcı odaklı içerik rehberi de özgün katkı ve uzmanlığı vurgular. [Google içerik rehberi](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)

Dağıtım için öneri: onaylı yeni sürüm/rehber, mevcut sosyal ve müşteri iletişim kanallarında ilgili kalıcı sayfaya bağlansın. Bu belge mesaj, e-posta, reklam veya otomatik takip gönderimi yetkisi vermez. Yeni ücretli kanal bütçesi ancak ölçüm ve satış kapasitesi netleşince tartışılır.

### Talebin satışa devri

Talep alındığında sorumlu kişi; ihtiyaç, ilgili ürün, sonraki adım ve sonuç durumunu mevcut iş akışında kaydeder. “Nitelikli talep” için önerilen başlangıç tanımı: gerçek bir kuruluş/kişi, anlaşılabilir kullanım ihtiyacı ve takip edilebilir iletişim; kesin ölçütü satış yetkilisi belirler. Destek başvuruları yeni satış talebi sayılmaz. Yanıt süresi hedefi, sorumlu ve kapasite belirlenmeden kamuya açık vaat oluşturulmaz.

Harici forma/denemeye tıklama, formun tamamlanması, yazılımın indirilmesi veya satış gerçekleşmesi değildir. Microsoft Forms ve üretici deneme platformundan sonuç erişimi yoksa yalnız çıkış tıklaması raporlanır. Teyitli talepler erişim yetkisi olan satış kaydıyla ayrı sayılır; eşleştirilemeyen kaynağa tahmini atıf yapılmaz. İsim/e-posta veya form metni analytics olaylarına gönderilmez; ölçüm ve izin gereksinimleri uygulama öncesi ayrıca değerlendirilir.

## 7. Tek geliştirici için işletim modeli

CMS'siz başlangıç: tip kontrollü dosya kayıtları + ortak şablonlar + Git üzerinden inceleme + yerel/özel preview. Başlangıçta genel amaçlı sayfa oluşturucu, özel CMS, CRM veya büyük otomasyon projesi önerilmiyor. Görsel değişiklik tokenlardan, içerik değişikliği kayıtlardan, yeni davranış bileşenlerden yapılır. Token değiştirmek içerik hiyerarşisini veya yeni işlevi kendiliğinden değiştirmez.

Önerilen kontroller: zorunlu alanlar, kırık içerik ilişkileri, tekrar eden kimlikler, onaysız iddialar, URL/CTA değişiklikleri, dosya bütünlüğü, sürüm–paket tutarlılığı ve uygun schema verisi. Kontroller ürün doğrulayan insanın yerini almaz. AI araçları fark çıkarma ve taslak hazırlamada kullanılabilir; üretici koşullarını doğrulanmadan yayınlayamaz.

| Ritim önerisi | Asgari inceleme | Beklenen karar |
|---|---|---|
| Yeni içerik/sürüm yayını | Kaynak, hedef, görünüm, izin, geri dönüş | Yayınla / düzelt |
| Aylık | Kırık kritik linkler, gelen talepler, tekrar sorulan sorular, bakım süresi | En önemli bir sonraki iyileştirme |
| Üç aylık | Ürün anlatımı, eskiyen içerik, müşteri yolları, bağımlılık/bakım durumu | Öncelik listesini yenile |
| Yıllık sürüm | Bölüm 5 süreci | İçerik sürümünü yayınla; yeniden tasarım otomatik iş değildir |

Takvim otomasyonu kurulmadı. Ekipte teknik olmayan kişiler düzenli içerik düzenlemeye başladığında, Git süreci gerçek bir darboğaz olduğunda veya yayın onayı/zamanlaması ihtiyacı oluştuğunda CMS yeniden değerlendirilir. Tek başına yeni yılın gelmesi CMS veya framework değişimi gerekçesi değildir.

Yayın altyapısı geliştirme fazında netleşir. Düşük işletim yükü, geri dönüş, yedek ve preview önceliklidir; yıllık içerik lansmanı hosting taşımasıyla zorunlu olarak birleştirilmez.

## 8. Başarı ölçümü ve başlangıç verisi

Sayısal hedefler henüz belirlenmedi. Öneri: erişilebilen eski iş kayıtlarından baseline çıkar; yoksa ilk kontrollü güncellemeyi ölç. Sonuçları aynı kapsam ve dönem koşullarıyla karşılaştır; düşük trafik/az talepte yüzdeleri kesin sonuç diye sunma.

| Ölçüt | Tanım / nasıl toplanır | Yanlış yorumdan kaçınma |
|---|---|---|
| Sürüm güncelleme emeği | Kaynak toplama, içerik, teknik iş, inceleme saatleri ayrı | İlk yeniden kurulum maliyeti sonraki içerik yayınıyla aynı iş değildir |
| Güncellemede kod bağımlılığı | Standart sürüm yayını için değişen bileşen/şablon sayısı | Yeni işlev gereksinimleri ayrıca etiketlenir |
| Ürün anlatım başarısı | Pilot görevde doğru ürün/paket seçimi ve yanlış anlama notları | Öznel memnuniyet tek başına doğruluk değildir |
| Kritik içerik hataları | Yanlış paket/sürüm/CTA/dosya, kaynak ve çözüm kaydı | Aynı hatayı her sayfada ayrı başarı gibi sayma |
| Ürün değerlendirme davranışı | İlgili çözüm→ürün, karşılaştırma ve CTA tıklamaları | Tıklama lead veya satış değildir |
| Teyitli nitelikli talepler | Satış tarafından tanımı karşılayan benzersiz talepler | Spam, tekrar, destek ve kaynağı belirsiz kayıtları ayır |
| Satış ilerlemesi | Teyitli talep→görüşme/teklif/sonuç; veri varsa | Eksik izleme alanında oran üretme |

Başlangıçta gerekli bilgiler: önceki lansmanın yaklaşık iş yükü, en sık yanlış anlaşılan ürün/paket soruları, erişilebilir talep/satış kayıtları, içerik doğrulayan kişi ve aylık bakım kapasitesi. Bu bilgiler gelene kadar strateji taslağı kullanılabilir; KPI hedefleri ve pilot seçimi kesinleşmez.

## 9. Uygulama sırası ve kapsam sınırı

| Aşama | Somut çıktı | Geçiş koşulu |
|---|---|---|
| Stratejiyi değerlendir | Bu belge ve açık kararlar | Kullanıcının yön onayı |
| Faz 0'ı tamamla | İçerik/medya/form/link tamlık ve fark listesi | Envanter onayı; yerel adayların kararı |
| Faz 1–2 | Aluplan–ALLPLAN karşılaştırması, kullanıcı yolları, teknik baseline | Bulguların değerlendirilmesi |
| Faz 3 | URL'leri koruyan içerik modeli, pilot, ölçüm ve yayın gereksinimli PRD | PRD onayı |
| Faz 4–6 | Design system, tasarım ve Next.js uygulaması | Her fazın kendi onayı ve kontrolleri |
| Yayın sonrası | İçerik işletimi, sürüm provası sonuçları, ölçüm | Ayrı yayın onayı; veriye göre iyileştirme |

Başlangıç kabul hedefi önerileri: onaysız içerik/URL kaybı olmaması; standart bir sürüm kaydının uygulamayı yeniden kurmadan eklenebilmesi; ürün–paket–sürüm farklarının izlenebilir olması; mevcut CTA ve dosyaların çalışması; önceki yayın sürümüne dönüşün belgelenmesi. Bunlar şu an sağlanmış sonuçlar değildir.

### Karar bekleyenler

- İlk pilot ürün/çözüm ve ticari segment önceliği.
- Ürün bilgilerinin iş onayını verecek kişi; satış talebini takip edecek kişi.
- Teklif/deneme önceliği ve nitelikli talep tanımı.
- Erişilebilir ölçüm verisi, aylık bakım kapasitesi ve buna göre hedefler.
- Özel form ihtiyacı açık; mevcut hedefler korunur. CMS şimdilik ertelendi; yeniden değerlendirme koşulları bölüm 7'de.
- Önceki sürüm sayfalarının görünür arşiv sunumu ve yeni sürüm rota düzeni.
- Marka/üretici izinleri ve içerik değişikliği onayları mevcut açık kararlar olarak devam eder.

Bu belgeyi onaylamak canlı yayın, URL değişikliği, içerik yeniden yazımı veya tasarım başlatma onayı değildir. Bir sonraki değerlendirme, önerilen işletim modelinin kullanıcının gerçek iş yüküne uygunluğudur.

## 10. Schema ve kalıcı içerik ilişkileri

Doğrulama tarihi: 21.10.2026. Kullanıcının istediği `schema` skilli okundu; Google uygunluğu için güncel Search Central belgeleri, alan anlamları için Schema.org, üretim yaklaşımı için Next.js resmî belgesi esas alındı. Bu bölüm kod veya yayınlanmış JSON-LD değildir. ALLPLAN sitesinin yeniden tarandığı anlamına gelmez.

### 10.1 Üç ayrı sözleşme

1. **İçerik modeli:** Ürün, paket, sürüm ve kaynak ilişkilerini bizim sistemimiz yönetir.
2. **Schema.org sözlüğü:** Bu ilişkilerin yalnız uygun bölümünü makine tarafından anlaşılır biçimde dışarı verir.
3. **Google zengin sonuç uygunluğu:** Belirli türler için ayrıca zorunlu alanlar ve içerik koşulları vardır. Geçerli Schema.org verisi otomatik uygunluk veya görünüm garantisi değildir. Görünür içeriği temsil etmeyen, yanıltıcı veya güncel olmayan işaretleme kullanılmaz. [Google genel kuralları](https://developers.google.com/search/docs/appearance/structured-data/sd-policies)

Skilldeki kısa zorunlu alan tabloları birebir uygulanmayacak: Google `Organization` ve `Article` için zorunlu alan belirtmiyor; ilgili önerilen alanlar gerçek veriden doldurulur. `Product` ile `SoftwareApplication` koşulları da farklıdır. [Organization](https://developers.google.com/search/docs/appearance/structured-data/organization), [Article](https://developers.google.com/search/docs/appearance/structured-data/article)

### 10.2 CMS'siz içerik modeli

Kimlikler URL, tema ve dosya konumundan bağımsızdır. Aşağıdaki alan isimleri plan sözleşmesidir; henüz dosya şeması oluşturulmadı.

| Kayıt | Kimlik / ilişkiler | Saklanan gerçek |
|---|---|---|
| Üretici | `manufacturerId` | Doğrulanmış üretici kimliği; Aluplan'dan ayrı |
| Kalıcı ürün | `productId`, `manufacturerId` | Ürün ailesinin adı, amacı, kalıcı açıklaması |
| Paket | `editionId`, `productId` | Paket kimliği; tüm yıllarda aynı kapsamı taşıdığı varsayılmaz |
| Yıllık sürüm | `releaseId`, `productId`, `versionLabel` | Doğrulanmış sürüm, yenilikler, uyumluluk ve kaynak |
| Paket–sürüm kapsamı | `editionId` + `releaseId` + `market` | O sürüm ve bölgedeki özellikler, seçenekler ve koşullar |
| İçerik sayfası | `pageId`, mevcut `canonicalUrl`, ilgili kayıt kimlikleri | Sayfanın amacı ve görünür içeriği |
| Dosya / kanıt | `assetId`, ilgili kayıt kimlikleri, kaynak ve doğrulama tarihi | PDF/video revizyonu ve hangi kapsama ait olduğu |

Ürün birden çok paket ve sürüme bağlanabilir. Paket ile sürüm çoktan çoğa ilişkilidir: her paket her yılda var kabul edilmez. Kapsam, bu ikisinin birleşim kaydında tutulur. Aynı paket adıyla sunulan yeni kapsam eski kaydı ezmez. Başka markanın modeli bu hiyerarşiye uymuyorsa ayrı ilişki tanımlanır; sahte paket üretilmez.

Örnek yalnız ilişki mantığıdır: ALLPLAN kalıcı kaydı → doğrulanmış paket kaydı ve 2026 sürüm kaydı → Türkiye için doğrulanmış paket–2026 kapsamı. Gelecek sürüm yayımlandığında yeni sürüm ve kapsam kayıtları eklenir. Gelecek yılın özellikleri, fiyatı veya paket eşleşmeleri şimdiden varsayılmaz.

### 10.3 Sayfa ve Schema.org eşlemesi

| Sayfa / varlık | Planlanan semantik eşleme | Sınır |
|---|---|---|
| Aluplan kimliği | Ayrı `Organization`; site `publisher` ilişkisi Aluplan'a | Distribütörlük, üreticiyle `sameAs` veya `parentOrganization` ilişkisi değildir |
| Kalıcı yazılım ürün sayfası | `WebPage.mainEntity` → `SoftwareApplication` | Ürün ailesine tek bir yıllık `softwareVersion` zorla atanmaz |
| Tek paket ayrıntısı | Gerçek bir yazılım edition'ıysa ayrı `SoftwareApplication`; ticari ürün olarak tanımlanması gerekiyorsa `Product` ayrıca değerlendirilir | Her pazarlama paketi otomatik ayrı uygulama değildir; salt hizmet/lisans bileşimi önce içerikten doğrulanır |
| Sürüme özel yazılım ayrıntısı | Ayrı uygulama örneği kimliği, `SoftwareApplication.softwareVersion` | Alan yazılım sürümüdür; site yılı veya içerik güncelleme tarihi değildir |
| Yenilik yazısı | Gerçek editöryal yazıysa `Article`/`BlogPosting`; `about` ilgili yazılım örneğine | Makale ve yazılım aynı varlık değildir; sırf URL'de yıl var diye Article seçilmez |
| Paket karşılaştırması / sürüm dizini | `CollectionPage` ve gerekirse görünür listeyi yansıtan `ItemList` | Genel ürün karşılaştırmasına özel Google zengin sonuç garantisi yoktur |
| Sayfa hiyerarşisi | Görünür gezinmeyle tutarlı `BreadcrumbList` | Ürün bağımlılık grafiği breadcrumb yerine kullanılmaz. [Google Breadcrumb](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb) |

`softwareVersion`, Schema.org'da `SoftwareApplication` alanıdır. Yazılımın sürüme veya edition'a özel örneği temel uygulamadan türemişse ve bu ilişki doğrulanmışsa `isBasedOn` ile temel kayda bağlanabilir; bu, Google'a özel bir sürüm özelliği değildir. Sadece paket üyeliğini göstermek için türeme ilişkisi uydurulmaz. İç modeldeki her ilişkiyi JSON-LD'ye birebir aktarmak zorunda değiliz. [softwareVersion](https://schema.org/softwareVersion), [isBasedOn](https://schema.org/isBasedOn)

Sayfa kimliği ile anlattığı varlığın kimliği ayrı tutulur. `@id` için onaylı site adresi altında kararlı mutlak URI sözleşmesi PRD'de belirlenir; sayfa URL'si değişse bile varlık kimliğinin korunması hedeflenir. Bu karar yeni rota oluşturmaz. `WebPage.mainEntity` ve gerektiğinde ters `mainEntityOfPage` ilişkisiyle sayfa–varlık bağlanır. Aynı varlık başka sayfada anıldığında aynı kimlik kullanılır; yalnız sayfayla ilgili ve görünür gerçekler yayınlanır. `sameAs` yıllık sürümleri veya paketleri birbirine bağlamak için kullanılmaz.

### 10.4 Google uygunluk kararları

| Hedef | Güncel koşul / bizim kararımız |
|---|---|
| Yazılım zengin sonucu | `name`, `offers.price` ve `review` veya `aggregateRating` gerekir. Doğrulanmış görünür fiyat ve uygun değerlendirme yoksa bu hedefe uygunluk iddia edilmez. Sınırlı ücretsiz deneme, ücretli yazılımın fiyatını sıfır yazma gerekçesi değildir. [Google SoftwareApplication](https://developers.google.com/search/docs/appearance/structured-data/software-app) |
| Ürün snippet'i | `name` ve `offers`, `review`, `aggregateRating` alanlarından en az biri gerekir; seçilen alanın kendi koşulları da sağlanmalıdır. Offer yolunda gerçek fiyat gerekir. Teklif formu fiyat verisi değildir. `AggregateOffer` paket listesi yerine kullanılamaz. [Google Product snippet](https://developers.google.com/search/docs/appearance/structured-data/product-snippet) |
| Paket / yıllık sürüm varyantı | `ProductGroup` ve `hasVariant` otomatik kullanılmayacak. Google varyant yaklaşımı merchant listing bağlamında ek ürün/kimlik/varyant şartları taşır; yazılım edition'ı ve yılını bu modele uygun kabul etmiyoruz. İleride gerçek satış modeli ve Google'ın desteklediği boyutlar doğrulanırsa yeniden değerlendirilir. `isVariantOf`, genel amaçlı SoftwareApplication ilişkisi değildir. [Google ürün varyantları](https://developers.google.com/search/docs/appearance/structured-data/product-variants), [Schema.org isVariantOf](https://schema.org/isVariantOf) |
| Fiyat/değerlendirme olmayan sayfa | Gerçekleri anlatan semantik kayıt tutulabilir; Google zengin sonuç eksikleri başarı gibi raporlanmaz. Uygulama öncesi sayfa bazında yalnız temel WebPage/Organization/Breadcrumb veya ek semantik yazılım kaydı seçimi belgelenir. |

Aluplan sitenin yayıncısıdır; yazılımın üreticisi olarak işaretlenmez. Gerçek bir Offer yayınlanacaksa satıcı kimliği ayrıca doğrulanır. Bilinmeyen fiyat, puan, yorum, stok veya lisans kapsamı doldurulmaz. Mevcut diğer türler ve kaldırılan Google özellikleri için [ALLPLAN analizinin 6.C bölümü](allplan-information-architecture.md#c-google-kurallarıyla-doğrulama--19102026) önceki tarihli araştırma olarak korunur; bu çalışmanın yeniden doğruladığı kapsam yukarıdaki türlerdir.

### 10.5 Next.js üretim planı ve design system sınırı

Akış: **doğrulanmış dosya kayıtları → ilişki çözümleme → sayfa içerik modeli → görünür içerik + metadata + JSON-LD**. CMS şimdilik ertelendi. İleride bir CMS eklense bile kimlik ve ilişki sözleşmesi korunur; veri okuma katmanı değişebilir.

JSON-LD, sunucuda sayfaya uygun üretilip ilgili `page`/`layout` çıktısında yer alacak; sayfa özelindeki ürün verisi global layout üzerinden her sayfaya basılmayacak. Script çıktısı güvenli serileştirilecek; yalnız `JSON.stringify` XSS önlemi sayılmayacak. Bu yaklaşım Next.js'in resmî rehberiyle uyumludur. [Next.js JSON-LD](https://nextjs.org/docs/app/guides/json-ld)

Design system bu veriyi tüketen ayrı sunum katmanıdır. Renk, font, boşluk ve diğer görsel token değişiklikleri ürün kimliğini, paket kapsamını, URL'yi, CTA hedefini veya schema anlamını değiştirmemeli. Tema değişimi ve yeni sürüm ekleme ayrı doğrulama senaryoları olacak. Sağlam design system gereksinimi korunuyor; token sözleşmesi ve bileşen uygulaması bu çalışmada başlatılmadı.

### 10.6 Uygulama öncesi ve yayın kabul listesi

- İçerik kontrolü: benzersiz kimlikler; var olan ürün/paket/sürüm referansları; doğrulanmış bölgesel kapsam; kaynak ve onay durumu.
- Sayfa kontrolü: görünür ürün adı, sürüm, paket kapsamı ve CTA ile JSON-LD tutarlılığı; eski sürümlere yeni kapsamın sızmaması.
- Semantik kontrol: Schema.org Validator ile alan/tür ilişkileri; Google Rich Results Test ile yalnız hedeflenen destekli sonuçların uygunluğu. Bu iki test aynı şeyi ölçmez.
- Teknik kontrol: güvenli serileştirme, yinelenen/çelişen varlıklar, canonical ve taranabilir HTML. Yayından sonra izinli Search Console URL Inspection ve ilgili raporlar.
- İşletim kontrolü: her yıllık yayında etkilenen kayıtlar ve Google kuralları yeniden incelenir; tema değişikliğinde içerik/SEO çıktısının anlamının korunduğu doğrulanır.

Bu oturumda validator, Rich Results Test veya canlı URL Inspection çalıştırılmadı; henüz test edilecek uygulama yok. Kaynak doğrulama ve doküman kontrolü yapıldı. Sonraki PRD'de pilot sayfaların gerçek alanlarıyla nihai tür seçimi yapılacak.


## 21.10.2026 paket kanıtıyla model güncellemesi

[PDF/web karar tablosu](package-comparison-decisions.md) aynı 2026 sürümünde farklı katalog revizyonları ve lisans lejantları bulunduğunu doğruladı. Bölüm 10 kapsam modeli kaynak revizyonu ve lisans modeliyle genişletilmelidir; belge tarihi ticari yürürlük tarihi değildir. Ürün/paket/sürüm kararlı kimlikleri korunur; revizyon iddiası geçmişi ezmez. Bu bir dokümantasyon kararıdır, uygulama yapılmadı.

Kullanıcı strateji kararlarında yetki üstleniyor: bilgi mimarisi, kavram ayrımı, tekrarların tek kaynaktan yönetilmesi ve müşteri akışı için proje ekibi gerekçeli karar oluşturabilir. Fiyat, üretici lisans hakkı, TR kapsamı ve hizmet taahhüdü doğrulanacak gerçeklerdir. Nihai sunum kanıt → problem → karar → ölçüm zincirini kullanacak; ölçülmemiş gelir/dönüşüm iddiası üretmeyecek.
