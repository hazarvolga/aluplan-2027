# ALLPLAN sayfa görevleri ve üreticiye hizalama

21.10.2026 — Planlama kararı / uygulanmadı. Kullanıcı üreticiye hizalama yaklaşımını kabul etti. Mevcut içerik ve URL'ler değiştirilmedi. Bu tablo pilot kapsamdır; tüm site envanteri veya Faz 0 kapanışı değildir.

## Karar ve kaynak sınırı

Ürün gerçekleri ALLPLAN'ın resmî kaynaklarına, Türkiye satış/hizmet koşulları doğrulanmış bölgesel bilgiye, anlatım ve kullanıcı yolları proje ekibinin stratejisine dayanacak. Üreticinin her metni, iddiası, fiyatı, görseli veya site yapısı otomatik kopyalanmaz. Aluplan bağımsız distribütör/çözüm ortağıdır; diğer markalar ALLPLAN altında eritilmez.

Kanıtlar: [19 Ekim envanteri](00-inventory/content-inventory.json), [19 Ekim üretici mimarisi araştırması](allplan-information-architecture.md), [21 Ekim canlı paket sayfaları](00-inventory/package-web-evidence-2026-10-21.md), [PDF/web karar tablosu](package-comparison-decisions.md). Bu tur yeni canlı tarama yapılmadı; aşağıdaki referanslar önceki araştırmada erişilen sayfalardır. Referans ilişkisi, birebir kapsam eşitliği veya aktarım izni değildir.

İşlem sınıfları: **Koru** = içerik ve hedefi muhafaza et; **Hizala** = farkı kaynakla doğrula, eski/yeni metin değişikliğini ayrı kaydet; **Yerelleştir** = yalnız doğrulanmış Türkiye/Aluplan hizmet bilgisini ekle; **Tarihsel tut** = geçmiş sürüm/belge kaydını ezme. Bir satır birden fazla sınıf taşıyabilir. İşlem sınıfı hemen düzenleme veya silme izni değildir.

## Üretici referans dizini

| Kod | Resmî kaynak | Araştırma bağlamı |
|---|---|---|
| R1 | [Paket ve ürün seçimi](https://www.allplan.com/package-overview/) | 19 Ekim; ürün/edition/uzman seçeneklerin ayrımı |
| R2 | [2026 genel edition karşılaştırması](https://www.allplan.com/package-overview/compare-allplan-features-2026/) | 21 Ekim; uluslararası HTML, TR sözleşmesi değil |
| R3 | [Civil](https://www.allplan.com/products/allplan-civil/) ve [2026 Civil tablosu](https://www.allplan.com/package-overview/compare-allplan-civil-features-2026/) | 19/21 Ekim; uzman ürün ve kapsam |
| R4 | [Precast](https://www.allplan.com/products/allplan-precast/) ve [2026 Precast tablosu](https://www.allplan.com/package-overview/compare-allplan-precast-features-2026/) | 19/21 Ekim; uzman ürün ve kapsam |
| R5 | [Mimarlık çözümü](https://www.allplan.com/industry-solutions/architecture-software/) | 19 Ekim; iş akışından ürüne geçiş |
| R6 | [Prekast çözümü](https://www.allplan.com/industry-solutions/precast-design-planning-software/) | 19 Ekim; üretim ihtiyacı |
| R7 | [Partner çözümleri](https://www.allplan.com/allplan-partner-solutions/) | 19 Ekim; entegrasyon/eklenti ayrımı |
| R8 | [Teknik destek](https://www.allplan.com/help/technical-support/) | 19 Ekim; satış sonrası yol ayrımı |

Yeni sürüm notları, bulut alt hizmetleri ve Türkiye ticari koşulları için satır düzeyinde resmî kaynak eşliği henüz tamamlanmadı. Bu boşluklar tahminî URL veya uydurulmuş haklarla doldurulmaz.

## Sayfa görev tablosu

Tüm göreli yollar `https://aluplan.com.tr` altında mevcut URL'lerdir. “Sonraki adım” hedef deneyim önerisidir; bugün ilgili bağlantının bulunduğu/çalıştığı iddiası değildir. Mevcut CTA etiket/hedefleri ayrıca korunur; yeni bağlantı veya etiket değişiklikleri uygulama öncesi değişiklik listesine alınır.

| Mevcut URL | Kullanıcının sorusu / sayfanın görevi | İçeriğin ana kaydı | ALLPLAN referansı | Aluplan'ın ek değeri | Sonraki adım / işlem |
|---|---|---|---|---|---|
| `/` | Hangi ihtiyacım için nereye gitmeliyim? Portföye ve hizmete giriş | Navigasyon, rol ve ürün referansları; ana teknik kapsam burada yazılmaz | R1/R5/R6 yaklaşımı | Türkiye portföyü, eğitim ve destek erişimi | Çözüm/ürün seçimi; Koru + Yerelleştir |
| `/products` | Hangi yazılımlar sunuluyor? | Çok markalı katalog | R1/R7 yalnız ALLPLAN ilişkileri için | Diğer markaları ve Aluplan rolünü açık sunmak | İlgili ürün; Koru + Hizala |
| `/products/allplan` | ALLPLAN nedir, hangi seçenekleri var? Kalıcı ana ürün girişi | ALLPLAN ürün kimliği; paket listesi ortak katalogdan | R1/R2 | Türkiye'de değerlendirme, eğitim ve destek bağlamı | Paket/uzman seçenek seçimi; Koru + Hizala + Yerelleştir |
| `/products/allplan-aec` | AEC işlerinde nasıl değer sağlar? Ayrıntılı iş akışı anlatımı | Aynı ürün kimliği + ayrı sayfa metni | R5; birebir özellik eşliği açık | Yerel proje ihtiyaçlarını üretici yeteneğiyle ilişkilendirme | Paket seçimi; Koru + Hizala. Ana ürün sayfasının ikinci katalog kopyası olmayacak |
| `/products/allplan-basic` | Basic işime yeter mi? | Basic edition, doğrulanmış sürüm/lisans kapsamı | R2 Basic sütunu | Başlangıç danışmanlığı; hizmetler ayrı | Karşılaştırma / teklif / deneme; Koru + Hizala |
| `/products/allplan-concept` | Concept hangi işlere uygun, farkı ne? | Concept edition; aynı ortak kapsam verisi | R2 Concept sütunu | İhtiyaca göre açıklama; ek satış hakkı üretmez | Karşılaştırma / teklif / deneme; Koru + Hizala |
| `/products/allplan-professional` | Professional ne ekliyor? | Professional edition; koşullu özellikler ayrı | R2 Professional sütunu | İş ihtiyacını kapsamla eşleme | Karşılaştırma / teklif / deneme; Koru + Hizala |
| `/products/allplan-ultimate` | Ultimate ve ilişkili haklar ne sunuyor? | Ultimate edition; SCIA vb. ayrı bileşen/hak iddiaları | R2 ve K04 | TR paket/hizmet koşulunu açık belirtme | Karşılaştırma / teklif; Koru + Hizala + Yerelleştir |
| `/products/civil` | Altyapı/köprü ihtiyacım için kapsam nedir? | Civil ürün/edition ilişkisi; ticari sınıf doğrulanacak | R3 | Yerel ihtiyaç ve kapsam danışmanlığı | Uzman karşılaştırma / teklif; Koru + Hizala |
| `/products/precast` | Üretim için hangi kapsam gerekiyor? | Precast ve doğrulanmış modül ilişkileri | R4 | İşletmenin üretim ihtiyacına uygun seçim | Ayrıntılı iş akışı / teklif; Koru + Hizala |
| `/products/precast-detail` | Precast günlük üretim akışında nasıl kullanılır? | Aynı Precast kimliği; ayrı iş akışı/kaynak metinleri | R4/R6 | Uygulama ve eğitim bağlamı | `/products/precast` ve ilgili kaynaklar; Koru + Hizala |
| `/package-overview` | Seçenekler arasından nasıl karar veririm? Etkileşimli karşılaştırma görevi | Tek doğrulanmış paket kapsamı; özellik/koşul/revizyon | R1/R2/R3/R4 | Paketini bilmeyene danışmanlık yolu | Paket detayı veya teklif; görev ataması. Bugün yer tutucu, karşılaştırma henüz uygulanmadı |
| `/paket-karsilastirma` | Karşılaştırma belgesini nereden alırım, hangi revizyon? | Dosya kimliği, hash, belge tarihi, doğrulama kaydı | R2/R3/R4 çapraz kontrol; yerel PDF kanıtları P1/P2 | Türkçe belge ve kapsam açıklaması | Mevcut PDF / detaylı karşılaştırma; Koru + Hizala. HTML tablosunun elle ikinci kopyası olmaz |
| `/products/allplan-2026` | 2026 bilgi modelleme ve birlikte çalışabilirlik tarafında ne değişti? | 2026 release; ilgili yenilik kayıtları | Kesin sürüm notu eşliği bekliyor; R2 tek başına yenilik kaynağı değil | Türkçe teknik açıklama ve ilgili eğitim | Diğer 2026 yenilikleri / kapsam; Koru + Hizala + Tarihsel tut |
| `/products/allplan-2026-yenilikler` | 2026 modelleme ve tasarım iş akışında ne değişti? | Aynı 2026 release; merdiven/döşeme vb. ayrı kayıtlar | Kesin sürüm notu eşliği bekliyor | Disipline göre anlaşılır anlatım | Teknik yenilikler / ilgili paket; Koru + Hizala + Tarihsel tut |
| `/products/allplan-cloud-services` | Bulut araçları ne işe yarar, koşulları nedir? Kalıcı hizmet anlatımı | Bulut hizmeti kimlikleri, hak ve lisans koşulları | R2 bulut bölümü; alt hizmet kaynakları tamamlanacak | Ekip kurulumu/kullanım desteği; taahhüt ayrıca doğrulanır | İlgili hizmet/kapsam / danışmanlık; Koru + Hizala |
| `/solutions/allplan-bulut-hizmetleri` | 2026 genel ve bulut işlevlerinde ne değişti? | 2026 yenilikleri + ilgili bulut hizmetine referans | Satır düzeyinde sürüm kaynağı bekliyor | Türkçe değişiklik ve mevcut kullanıcı yönlendirmesi | Kalıcı bulut sayfası / eğitim; Koru + Hizala + Tarihsel tut |
| `/products/allplan-bimplus` | BIMPLUS hangi işbirliği ihtiyacını karşılar? | Ayrı ürün/hizmet kimliği; temel/ek kapasite ilişkisi | R2 ve doğrulanacak BIMPLUS kaynakları | Kurulum ve kullanım danışmanlığı | İlgili paket/ek seçenek; Koru + Hizala |
| `/solutions/architecture` | Mimarlık işimde nerede kullanırım? | Rol/iş akışı → ürün/yetenek ilişkisi | R5 | Yerel ofis ihtiyaçları; kanıtlı örnekler | İlgili ürün ve paketler; Koru + Hizala + Yerelleştir |
| `/solutions/precast` | Üretim sürecindeki ihtiyacımı nasıl çözerim? | İş akışı → Precast/ilgili ürün ilişkileri | R6 | Üretim bağlamında danışmanlık | Precast ayrıntısı / teklif; Koru + Hizala + Yerelleştir |
| `/solutions-v2/training` | Nasıl öğrenirim? | Eğitim kaydı, içerik/sürüm uyumu | R8 sadece hizmet ayrımı; Aluplan eğitim kaynağı esas | Türkçe eğitim ve mevcut takvim | Mevcut eğitim detayları; Koru + Yerelleştir |
| `/solutions-v2/training/video-library` | Belirli işi nasıl yaparım? | Video/playlist kaydı; desteklenen sürüm | İlgili üretici eğitim kaynağı dosya bazında | Türkçe erişim ve görev odaklı bulma | Mevcut somut video yolları; Koru; tüm alt kayıtların eşliği açık |
| `/contact` | Kiminle görüşmeliyim? | Doğrulanmış Aluplan iletişim bilgisi | Üretici sayfası bu bilgide otorite değil | Yerel erişim, doğru hizmete yönlendirme | Mevcut iletişim/teklif kanalları; Koru + Yerelleştir |

## Tek kaynak sahipliği: sayfa sahipliğiyle karıştırma

| Bilgi | Ana kayıt ve doğrulama sorumluluğu | Tüketen yüzeyler |
|---|---|---|
| Ürün adı / üretici / amaç | Ürün kaydı; resmî üretici kaynağı | Ürün girişi, AEC anlatımı, çözüm sayfaları |
| Dahil / ücretli / ön koşullu kapsam | Edition + release + market + licenseModel + sourceRevision; TR ticari doğrulaması | Paket detayı, karşılaştırma, seçili ana sayfa alanları |
| Yıllık değişiklik | Release + yenilik + kaynak konumu; üretici sürüm notu | 2026'nın üç konu sayfası ve ilgili eğitim |
| PDF / indirme | Asset kaydı, dosya hash'i, belge tarihi; yürürlük ayrı | Belge sayfası, karşılaştırma ve ilgili CTA'lar |
| Aluplan hizmet taahhüdü | Hizmet kaydı; Aluplan ticari sorumlusu | Ürün yanında ayrı hizmet bölümü, eğitim/destek |
| CTA hedefi | Mevcut envanterdeki hedef; değişiklik ayrı kayda tabi | İlgili tüm sayfalar |

Bir sayfayı ana giriş seçmek SEO canonical kararı değildir. Birden çok sayfa aynı entity kaydına başvurabilir; URL birleştirme, redirect veya otomatik canonical değişimi yapılmaz. İçerik katmanı görünür metni ve schema'yı besler; tema bu kimlikleri değiştirmez. Google kuralları bu tur yeniden araştırılmadı; mevcut [schema planı](package-comparison-decisions.md#schema-ve-cmssiz-içerik-modeline-etkisi) esas alınır.

## Kararlaştırdığımız ayrımlar

1. `/products/allplan` kalıcı katalog girişi; `/products/allplan-aec` iş akışı anlatımı. İkisi ayrı ürün değildir.
2. `/package-overview` paket seçme/karşılaştırma; `/paket-karsilastirma` belge ve revizyon erişimi. Her ikisi korunur; boş sayfanın doldurulması sonraki uygulama kapsamıdır.
3. İki 2026 ürün sayfası ve solutions altındaki bulut yenilikleri aynı release'e bağlanır, konu grupları farklıdır. Biri diğerinin yerine otomatik kaldırılmaz.
4. Civil/Precast uzman kullanıcı yolları ayrı anlaşılır kalır; üretici ticari sınıfı doğrulanmadan “Ultimate'ın bir üst basamağı” denmez.
5. Ürün sayfalarındaki yerel hizmet, yazılım yeteneğinden ayrı açıklanır. Fiyat ve hak kapsamı stratejik tercih diye değiştirilemez.

## İçerik koruma ve hizalama iş akışı

Önce orijinal tam metin, URL, CTA, medya ve kaynak konumu korunur. Ardından içerik parçasına görev/sahiplik ve işlem sınıfı atanır. Hizalanacak kayıt için eski metin, resmî dayanak, bölge/tarih, önerilen yeni metin, gerekçe ve doğrulama durumu ayrı fark kaydı olur. Bu aşamada yeni metin yazılmadı; kaldırılacak blok listesi üretilmedi.

Eski sürüm içeriği erişilebilir tarihsel kayıt olarak korunur. Eksik veya çelişkili ticari bilgi “yok” diye tamamlanmaz. Uluslararası fiyat/koşullar Türkiye'ye otomatik taşınmaz. Tam içerik-parite kontrolü ve gerekli onaylar olmadan yayınlanmaz.

## Pilot için kabul soruları

- Paketini bilmeyen ziyaretçi kalıcı ürün girişinden karşılaştırma veya danışmanlığa ulaşabiliyor mu?
- İki paket karşılaştırılırken aynı sürüm, belge revizyonu ve lisans bağlamı açık mı?
- 2026 yenilikleri kalıcı ürün tanımından ayrılıyor; eski URL ve metinler korunuyor mu?
- PDF indiren kişi belge revizyonunu ve kapsam sınırını görebiliyor mu?
- Mevcut müşteri eğitim/desteğe satış formunu doldurmadan ulaşabiliyor mu?
- Tema değiştiğinde metin, dosya, CTA hedefi ve schema kimlikleri aynı kalıyor mu?

Bunlar test senaryosu taslağıdır; henüz çalıştırılmış kullanıcı testi veya geliştirme kabulü değildir.

## Açık işler ve bir sonraki çıktı

Bu tablo sayfa görevlerini belirler; 23 URL'lik pilot yüzey tüm site değildir. Diğer çözüm/ürün sayfaları, tüm eğitim alt rotaları, kaynak bazında lisans izinleri ve dinamik içerik durumları Faz 0 içinde sürer. Öncelikli ticari boşluklar: SCIA, süreli Solibri hakkı, bulut lisans evreni, Civil/Precast ilişkisi ve yerel hizmet taahhütleri.

Sıradaki önerilen çıktı: bu görev tablosundan türeyen ürün/paket/sürüm/kaynak/hizmet kayıt şablonları ve iki gerçek içerik parçası üzerinde eski→dayanak→öneri fark kaydı. Uygulama başlamadan bu şablonlar değerlendirilecek.


## 21.10.2026 hizmet alanı ve şablon eki

Kullanıcının öncelik notuyla ana sayfa Profesyonel Hizmetler alanı ayrı değerlendirilir: [konumlandırma notu](professional-services-positioning.md). Üç sekme ve 20 hedef korunur; bölüm yalnız ürün sayfası uzantısı değildir. [Kayıt sözleşmesi](content-record-contract.md) hizmet/portal/kaynak ayrımını; [iki gerçek örnek](content-change-examples.md) ticari doğrulama ve editoryal karar farkını gösterir. İçerik işlemleri uygulanmadı.

## 22.10.2026 — Kalıcı bilgi mimarisi taslağı

[Menü, sayfa görevleri ve kullanıcı yolları](site-information-architecture.md) hazırlandı. Öneri: altı ana menüyü koruyup Eğitim ve Destek için görünür yardımcı giriş; kalıcı ürün/paket ile yıllık yenilikleri ayırmak; fiyat yayımlamadan kapsam karşılaştırması ve teklif yolu. 131 satırlık route eşlemesi özgün URL kanıtını korur; eksik hedefler ertelenen karar listesinde kalır. Eğitim önceki “takvim” adaylarından farklı olarak dönemsel webinar, video arşivi ve eğitim talebi üzerinden planlanır. Bu hedefli analiz Faz0/1 kapanışı veya uygulama onayı değildir. Yeni canlı tarama, kod, JSON-LD ya da tasarım entegrasyonu yok. Sıradaki adım: navigasyon ve kullanıcı yollarını kullanıcı değerlendirmesine sunmak; onay sonrası sayfa şablonu/blok gereksinimlerini hazırlamak.
