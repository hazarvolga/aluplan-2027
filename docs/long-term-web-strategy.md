# Aluplan uzun vadeli web stratejisi

Tarih: 21.10.2026 · Sürüm: 0.1 · Durum: kullanıcı değerlendirmesine sunulan strateji taslağı.

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
- Özel form/CMS ihtiyacı: mevcut hedefler korunur; ihtiyaç kanıtlanmadan kapsam açılmaz.
- Önceki sürüm sayfalarının görünür arşiv sunumu ve yeni sürüm rota düzeni.
- Marka/üretici izinleri ve içerik değişikliği onayları mevcut açık kararlar olarak devam eder.

Bu belgeyi onaylamak canlı yayın, URL değişikliği, içerik yeniden yazımı veya tasarım başlatma onayı değildir. Bir sonraki değerlendirme, önerilen işletim modelinin kullanıcının gerçek iş yüküne uygunluğudur.
