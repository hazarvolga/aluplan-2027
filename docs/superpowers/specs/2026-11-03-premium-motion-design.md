# Aluplan hareket dili — tasarım taslağı

Durum: Kullanıcı tasarımı 03.11.2026 tarihinde onayladı. Pilot uygulama planı ayrıca incelenecektir; bağımlılık kurulumu veya site geneline yayılım onaylanmış değildir.

## Amaç ve kapsam

Sitenin tamamında sakin, akıcı ve tutarlı bir his oluşturmak; ana sayfa ve seçilmiş ürün sunumlarında daha belirgin hareketle vurgu yapmak. Kullanıcı geçici önizlemede **C · Etkileyici** seçeneğini seçti. Bu seçim, önizlemedeki hareket karakterini ifade eder; bütün sayfalara aynı animasyonun uygulanması veya herhangi bir kütüphanenin onaylanması anlamına gelmez.

İlk çalışma yalnızca ana sayfa hero görseli ve bir temsilî ürün kartı için yerel pilot olarak önerilir. Pilotun görsel kabulü ve ölçümünden sonra diğer sayfalara yayılım ayrıca değerlendirilir. Geçici önizleme uygulama kodu değildir.

## Alternatifler ve karar

- **Sakin:** Kısa ve neredeyse fark edilmeyen görsel geçiş.
- **Dengeli:** Ölçülü görsel yaklaşması ve çizgi hareketi.
- **Etkileyici (seçilen C):** Daha belirgin görsel yaklaşması ve çizgi hareketi; metin hemen görünür. Önizlemedeki hero hareketi yaklaşık 1,2 saniye sürer. Nihai süre pilot incelemesinde ayarlanabilir.

Genel yön, ortak etkileşimlerde sakin hareket ile seçilmiş sahnelerde C karakterinin birleşimidir.

## Önerilen sayfa haritası

| Alan | Öneri | Durum |
| --- | --- | --- |
| Ana sayfa hero | Başlık ve eylemler hemen görünür; yalnız dekoratif görsel ve çizgide C karakteri. | İlk pilot adayı |
| Temsilî ürün kartı | Yalnız öne çıkan kartın görseli ekrana ilk geldiğinde bir kez kısa ve ölçülü hareket eder; metin ve bağlantı hemen görünür. Diğer kartlarda giriş animasyonu yoktur; etkileşimde hafif görsel tepki kullanılır. Mobil ve klavye deneyimi dahil. | İlk pilot adayı |
| Ana sayfa ürün sekmeleri | Mevcut görsel geçişinin metin ve seçili durumla eşzamanlılığını gözden geçir. | Sonraki aday |
| Ürünler ve çözümler listeleri | Ortak kartlarda tutarlı kısa geri bildirim; uzun listelerde tekrarlı giriş animasyonu yok. | Sonraki aday |
| Ürün/çözüm detayları | Seçilen medya ve sekme geçişleri; gerektiğinde sınırlı vurgu sahnesi. | Sonraki aday |
| Referanslar | Kullanıcının kontrol ettiği anlaşılır görsel geçişleri. | Sonraki aday |
| SSS, kaynaklar, iletişim ve formlar | Sade etkileşim ve durum geri bildirimi; okunmayı veya işlemi geciktiren hareket yok. | Sonraki aday |

## Tüm sayfalar için hafif giriş — yeni kapsam taslağı

Kullanıcı 03.11.2026'da tüm sayfalarda hafif giriş hareketi ve aynı anda başlayan hareketlerin zamanlanmasını istedi; bu taslağı uygulama için onayladı.

- Kullanıcının sonraki düzeltmesiyle, hero bulunan sayfalarda giriş çizgisi hero alt sınırında tam genişlikte gösterilir; 768 CSS px ve üzerinde soldan sağa çizilir ve kalır. Mobilde ve azaltılmış hareket tercihinde animasyonsuz statik çizgi görünür. Hero'suz Referanslar gibi sayfalar bu çizgiyi kullanmaz.
- Metin, bağlantı, form ve ana görsel okunabilir/kullanılabilir durumda kalır; yüklenmeyi veya gezinmeyi animasyon bekletmez. İçeriğin görünürlüğü JavaScript'e bağlı değildir.
- Aynı ekranda birden fazla dekoratif hareket varsa tek bir kısa zaman çizelgesi kullanılır: ana vurgu önce, ikincil işaret kısa bir aralıkla sonra. Bölüm/kart listelerinin tümünü geciktiren kademeli zincir yapılmaz; etkileşim kaynaklı sekme ve modal yanıtları bağımsız ve anlık kalır.
- Ortak görünüm bileşenleri üzerinden uygulanır; site çapında ağır kütüphane kurulmaz. Temsilî ana sayfa, çözüm, ürün, kaynak ve form sayfalarında masaüstü/tablet, mobil, klavye, reduced-motion, JS yokluğu, geri/ileri gezinmesi ve performans kontrolü gerekir.
- Bu, rota değişiminde eski ve yeni sayfa arasında geçiş ekleme kararı değildir; o konu için ayrı değerlendirme devam eder.

## Teknik kararlar ve sınırlar

- Mevcut CSS ve ortak bileşenler basit hareketler için ilk seçenek. GSAP yalnız pilot sahnede somut değer sağlıyorsa değerlendirilir; React yaşam döngüsünde temizleme ve ekran/hareket tercihi değişiklikleri yönetilir.
- Lenis ancak ayrı karşılaştırmalı deneme ve kullanıcı kabulünden sonra değerlendirilir; doğal kaydırma mevcut varsayılandır. İç bağlantı hedefleri, sabit başlık boşluğu, geri/ileri, menü, modal, klavye ve dokunmatik kullanım test edilir.
- React Bits bir kaynak olarak ele alınır; seçilen örneğin lisansı, erişilebilirliği, bağımlılıkları ve maliyeti tek tek doğrulanmadan ürüne alınmaz.
- Başlık, metin, bağlantı ve formlar JavaScript veya animasyon çalışmadığında da görünür ve işlevsel kalır. `prefers-reduced-motion` tercihinde dekoratif hareket kaldırılır; klavye odağı, seçili durum ve içerik anlaşılır kalır.
- Kullanıcının 03.11.2026 tercihi: pilotun hero ve kart giriş efektleri 768 CSS pikselin altında kapalı; tablet ve masaüstünde hareket tercihine bağlı olarak kullanılabilir.
- Öne çıkan kart hareketi her görünür oluşta tekrarlanmaz; aynı sayfa ziyaretinde en fazla bir kez çalışır. Kart ekranda zaten görünürse gecikmeden başlar, daha sonra görünürse ilk görünüşünde çalışır. Azaltılmış hareket tercihinde çalışmaz. Sekme veya bağlantı kullanımı animasyonun tamamlanmasına bağlı değildir.
- Performans için aynı koşullarda öncesi/sonrası LCP, CLS, INP ve istemci JS aktarımı ölçülür. Projenin LCP <2,5 sn, INP <200 ms, CLS <0,1 hedefleri saha hedefleridir; tek laboratuvar ölçümü saha verisi olarak sunulmaz. Kötüleşme veya kullanım sorunu varsa pilot geri alınır.
- Mobil, masaüstü, açık/koyu tema, dokunma, klavye ve azaltılmış hareket test edilir. Mevcut 5:2 görsel kırpmasında anlamlı içeriğin kaybı ayrıca incelenir. Mevcut metinler, bağlantılar ve medya korunur.

## İnceleme karar günlüğü

| İtiraz | Karar ve gerekçe |
| --- | --- |
| Uzun kataloglarda tekrar eden giriş animasyonları yorucu olabilir. | Kabul: liste genelinde giriş animasyonu yok; yalnız pilotta öne çıkan tek kart bir kez hareket eder. |
| Hover mobil ve klavye kullanıcıları için yeterli değildir. | Kabul: odak, dokunma ve statik durumlar ayrıca değerlendirilir. |
| Hero ve sekme hareketleri dikkati dağıtabilir veya içeriği yanlış görselle eşleştirebilir. | Kabul: içerik hemen görünür; hızlı sekme değişimi ve eşleşme pilotta kontrol edilir. |
| Lenis doğal gezinme, modal ve bağlantıları bozabilir. | Kabul: ayrı deneme ve karşılaştırma olmadan genel kullanıma alınmaz. |
| GSAP ve Lenis riskleri nedeniyle tamamen dışlanmalı. | Reddedildi: sınırlı deneyin faydası ve maliyeti ölçülmeden kesin karar verilmez. |
| 5:2 mobil görseller içerik kırpabilir. | Kabul: görselin anlaşılırlığı oran ölçümünden ayrı incelenir. |

Sıralı çoklu incelemede taslak kullanıcı değerlendirmesine koşullu uygun bulundu; kullanıcı tasarımı onayladı. Henüz performans ölçümü veya pilot uygulama yoktur.
