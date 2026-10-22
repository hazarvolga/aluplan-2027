# Aluplan kalıcı bilgi mimarisi — karar taslağı

22.10.2026. Kullanıcının onayladığı çalışma: menü/sayfa haritası, sayfa görevleri, mevcut URL eşlemesi ve kullanıcı yolları. Bu belge öneridir; tasarım, metin değişikliği, yeni URL, yönlendirme veya uygulama onayı değildir.

## 1. Temel kararlar ve kanıt

Amaç her yıl siteyi yeniden kurmak yerine kalıcı ürün/çözüm/hizmet yapısını yaşatmak; yeni sürümü kendi tarihsel kaydıyla eklemek. ALLPLAN üretici, Aluplan Türkiye distribütörü/çözüm ortağıdır. Diğer markalar ALLPLAN paketi gibi sınıflandırılmaz.

Kullanıcı kararları: fiyat yayımlanmaz; Next.js içinde niyete göre kısa girişler ve ortak takip planlanır; CMS ertelenir; Eğitim tek başlıktır, dönemsel webinarlar/YouTube arşivi ve özel eğitim taleplerini kapsar; Teams ve allplan.net.tr mevcut destek kanallarıdır. Antrasit tema tercihi içerik ve schema ilişkilerini değiştirmez.

Dayanaklar: [aktif menü ve 20 hizmet kaydı](00-inventory/global-state-source-review-2026-10-22.md), [kullanıcı kararları](00-inventory/user-decisions.md), [23 sayfalık görev pilotu](page-responsibilities.md), [üretici araştırması](allplan-information-architecture.md), [paket kaynak çelişkileri](package-comparison-decisions.md), [form sözleşmesi](request-forms-contract.md), [22 Ekim schema incelemesi](form-schema-review-2026-10-22.md). Bu tur yeni canlı kontrol veya Google doğrulaması yapılmadı; mevcut tarihli kanıtlar kullanıldı.

## 2. Önerilen navigasyon

Mevcut altı ana başlığı koruyup **Eğitim ve Destek için sürekli görünür yardımcı giriş** ekleyelim. Böylece yedinci bir geniş ürün menüsü yaratmadan mevcut müşteriyi ana sayfanın altındaki sekmelere bağımlı bırakmayız. Mobil menüde bu giriş ilk düzeyde görünür olmalı. Bu yerleşim kullanıcı değerlendirmesine sunulan öneridir.

| Giriş | Görevi ve alt gruplar | Mevcut hedefler / geçiş sınırı |
|---|---|---|
| Çözümler | İş ihtiyacı: bina, yapı mühendisliği, altyapı, prekast, çelik, şantiye; ilgili ürünlere geçiş | Mevcut `/solutions/...` ve `/solutions-v2/...` yolları korunur; benzer sayfalar otomatik birleştirilmez |
| Ürünler | Marka/ürün bilen ziyaretçi; ALLPLAN, paketleri, Civil/Precast, bulut; diğer ürünler ve eklentiler | `/products`, `/products/allplan`, mevcut ürün/eklenti yolları. Ürün URL'si `/solutions/` altında olsa da ürün olarak bulunabilir |
| Kaynaklar | Belgeler, sürüm yenilikleri, rehberler, sistem gereksinimleri; Eğitim/Destek'e çapraz erişim | Bugün `/#professional-services`. Öneri: mevcut hedefi koruyan menü içinde kaynak grupları; yeni `/resources` adresi varsayılmaz |
| Referanslar | Mevcut proje/müşteri kanıtları | `/references`; doğrulanmamış yeni başarı sayısı eklenmez |
| Hakkımızda | Aluplan'ın rolü, ekip/şirket ve yerel hizmet değeri | `/about` |
| İletişim | Firma iletişimi, genel sorular ve danışmanlık bağlamı | `/contact`; satış formuyla destek talebi aynı işlem değildir |
| Eğitim ve Destek — yardımcı giriş | Eğitim, webinar arşivi, Teams, Destek Platformu; lisans/Connect ve sertifika erişimi | Eğitim `/solutions-v2/training`; diğer mevcut hedeflere doğrudan bağlantılar. Yeni destek hub URL'si gerektirmez |

Arama `/search`, tema seçimi, sosyal/yasal bağlantılar, iletişim bilgileri ve footer kredisi korunur. İngilizce site veya yeni dil kapsamı varsayılmaz. Teklif/deneme eylemleri menü kategorisi değildir; sayfa bağlamına göre görünür. Site genelinde birincil ticari CTA önceliği henüz kesinleştirilmedi.

## 3. Sayfa aileleri ve bilgi sahipliği

| Sayfa ailesi | Yanıtladığı soru | Ana bilgi | Sonraki adım önerisi |
|---|---|---|---|
| Ana sayfa `/` | Aluplan bana hangi konuda yardımcı olur? | Yerel konumlandırma, rol yolları, ürün/hizmet özeti, mevcut kanıtlar | Çözüm inceleme; Eğitim/Destek'e doğrudan erişim |
| Çözüm sayfası | İş akışım için hangi araçlar uygun? | Problem, süreç, ilgili ürünler ve mevcut örnekler | İlgili ürün; seçim konusunda yardım |
| Kalıcı ürün `/products/allplan` | Ürün ne yapar, kimler kullanır? | Ürün kimliği, kalıcı yetenekler; ilgili paket/sürüm kayıtlarına bağlantı | Paket inceleme, teklif veya resmî deneme |
| AEC/uzmanlık ayrıntısı | Belirli iş akışı nasıl karşılanır? | `/products/allplan-aec`, Civil, Precast ve ayrıntılar | İlgili paket/ürün, bağlamı koruyan talep |
| Paket ayrıntıları | Bu kapsam ihtiyacıma uygun mu? | Basic/Concept/Professional/Ultimate; kanıtlı sürüm/pazar/lisans kapsamı | Karşılaştırma veya teklif; paket seçimi zorunlu değil |
| HTML karşılaştırma `/package-overview` | Paketlerin işlevsel farkları ne? | Tek kaynaktan yetenek/kapsam karşılaştırması; mevcut sayfa placeholder, henüz çalışan özellik değil | Paket ayrıntısı, seçim yardımı |
| PDF erişimi `/paket-karsilastirma` | Hangi tarihli belgeyi indirebilirim? | Dosya, kaynak revizyonu, ilgili ürün/sürüm | Belge indirme ve ilgili ürün; HTML tablonun ikinci elle tutulan kopyası değil |
| Yıllık yenilikler | Benim sürümümden ne değişti? | `/products/allplan-2026`, `...-yenilikler` ve mevcut ilgili sayfalar; kapsamları ayrı | Kalıcı ürün, kaynak belge, sürüm bağlamlı bilgi talebi |
| Diğer ürünler/eklentiler | Bu ürünün görevi ve sağlayıcısı ne? | AX3000, SDS2, TIM, Scalypso, Pythonpart, BIMFlex vb. kendi kimliğiyle | İlgili ürün/modül seçimi; çoklu ilgi korunur |
| Eğitim | Nasıl öğrenebilirim? | Duyurulmuş webinar, geçmiş kayıtlar, eğitim talebi; sürekli takvim taahhüdü yok | Videoyu izle veya eğitim ihtiyacını bildir |
| Video arşivi | İlgili konu/sürüm kaydı nerede? | `/solutions-v2/training/video-library` ve mevcut alt sayfalar | Doğrudan izleme; kayıt formu zorunlu değil |
| Destek kanalları | Sorunum için nereye gitmeliyim? | Teams görüşme kanalı ve allplan.net.tr talep/takip sistemi | Mevcut dış hedefe geç; yeni destek sistemi kurma |
| Lisans/Connect | Mevcut lisansımı nasıl yönetirim? | Mevcut Connect, aktivasyon, lisans atama, öğrenci/eklenti hak yolu | İlgili işlem; teklif/deneme kaydıyla karıştırma |
| Kurumsal/yasal | Kiminle çalışıyorum, koşullar neler? | Mevcut şirket, referans, iletişim ve yasal içerikler | İletişim veya ilgili bilgi |

**Fiyat tablosu önerilmiyor.** Paket karşılaştırması yetenek, iş akışı ve doğrulanmış kullanım hakkı farklarını açıklar. Fiyat alınması için teklif yolu sunulur. Sırf schema alanını doldurmak için fiyat veya ücretsiz ürün iddiası üretilmez.

## 4. Profesyonel Hizmetler alanı

Alan ana sayfada görünür kalmalı; yalnız footer bağlantılarına indirgenmemeli. Mevcut 20 kayıt korunarak kullanıcı göreviyle gruplanması önerilir:

| Görev grubu | Mevcut kayıtlar |
|---|---|
| Öğren ve yardım al | Eğitim, Teknik Destek, Destek Platformu, Danışmanlık, Sertifika |
| Yazılım ve lisans işlemleri | Download, Connect: Giriş, Admin Lisans, CodeMeter WebDepot, Deklarasyon Formu |
| Bilgi ve güncellemeler | ALLPLAN FAQ, Blog Global, Canlı Webinarlar, BIM Rehberi, OPENBIM, Sistem Gereksinimleri, Tüm Gereksinimler, Sürüm Notları, IFC Export El Kitabı |
| Partner erişimi | Mevcut üretici partner başvurusu; Aluplan hizmet satışı gibi sunulmaz |

Bu 5+5+9+1 kayıt eşlemesidir; dört yeni sekme zorunluluğu değildir. Eğitim ve iki destek eylemi sekme açmadan bulunabilmeli; geri kalan kayıtların görsel düzeni tasarımda ele alınır. Üretici webinarı ile Aluplan webinarı sağlayıcı etiketiyle ayrılır. Eski içerikteki “kesintisiz” veya sertifika kapsamı gibi iddialar kaynakta korunur ancak yeni doğrulanmış vaat sayılmaz.

## 5. Üç ana kullanıcı yolu

### A — Paket adını bilmeyen yeni müşteri

Ana sayfa rolü/Çözümler → iş ihtiyacı → ilgili ürün → işlevsel paket karşılaştırması veya doğrudan seçim yardımı → kısa teklif girişi → kayıt alındı ve takip bilgisi.

Paket bilmek form şartı olmaz. Birden fazla ürün/modül seçilebilir. Çözüm sayfasından gelmek kullanıcının kesin satın alma tercihi değildir; kaynak bağlamıyla açık tercih ayrı tutulur.

### B — Denemek isteyen ziyaretçi

Ürün → resmî deneme hedefi ve Aluplan'dan yardım alma seçeneği → ALLPLAN resmî sayfası. Yardım isteyen için kısa talep ve ortak takip.

Öneri indirmeyi engellemeyen isteğe bağlı yardım girişidir; zorunlu lead kapısı kararı açık. Resmî siteye tıklama başarılı indirme veya lisans aktivasyonu değildir. Başka ürünlerin hedefi/koşulu ALLPLAN'dan türetilmez; süre çelişkisi doğrulanmadan yeni süre vaadi yazılmaz.

### C — Mevcut müşteri

Sürekli Eğitim ve Destek girişi → ihtiyaca göre ayrım:
- Öğrenme: Eğitim → konu/sürümle ilgili video veya gerçekten duyurulmuş webinar; özel ihtiyaçta eğitim talebi.
- Sorun çözme: Destek Platformu → talep/takip; Teams → mevcut görüşme kanalı. Zorunlu kanal sırası veya SLA varsayılmaz.
- Lisans işlemi: Connect/lisans rehberi → mevcut işlem hedefi. Öğrenci/eklenti kullanım hakkı alt yolları korunur.

Bu ziyaretçi tekrar satış formunu doldurmaya zorlanmaz. Destek başvurusu satış lead'i gibi sayılmaz.

## 6. Ana sayfanın içerik omurgası

Önerilen mantıksal sıra: Aluplan'ın rolü ve mevcut hero → Mimar/Mühendis/Prekast yolları → ürün/çözüm keşfi ve paket seçimine yardım → Profesyonel Hizmetler → mevcut referans/kanıtlar → sürüm ve kaynak erişimi → iletişim/footer. Bu sıralama görsel tasarım veya mevcut bölümleri silme talimatı değildir. Nihai bölüm eşlemesinde her mevcut metin, medya ve CTA için yer gösterilecek; henüz onaylı metin kısaltması yok.

## 7. URL ve içerik geçişi

[131 satırlık eşleme](site-architecture-route-map.csv) kaynak URL tablosunun bütün satırlarını ve özgün sütunlarını korur. [Kapsam notları](site-architecture-route-map-notes.md) sınıflandırma ve ertelenen hedefleri açıklar. Bu sayı 131 pazarlama sayfası veya tüm dış bağlantı/medya kapsamı demek değildir.

- Menüdeki grup değişimi URL/canonical değişikliği anlamına gelmez. `/solutions/` altında ürün olması tek başına adres taşıma gerekçesi değildir.
- `/solutions-v2/` temizliği bu çalışmanın ön şartı değildir. Yeni temiz adresler üretilmedi.
- Mevcut redirect/alias kanıtları tarihsel durumdur; yeni 301 onayı değildir.
- 404/eksik hedefler listede kalır. Yeniden oluşturma, iptal veya alternatif hedef kararı yayın öncesinde ayrı alınır; hiçbiri sessizce menüden/envanterden düşmez.
- 2026 içerikleri site adı 2027 diye yeni sürüm iddiasına çevrilmez. Yeni sürüm kendi kanıtı ve kayıtlarıyla eklenir; kalıcı ürün kimliği değişmez.
- Tek kanonik ürün kaydı farklı sayfalarda sunulabilir; bu, o sayfaların HTML canonical'larının aynı URL olacağı anlamına gelmez.

## 8. İçerik, schema ve tema sınırı

İç model ürün → paket/kapsam → sürüm → kaynak revizyonu ilişkilerini taşır; sayfalar bu kayıtlara başvurur. Eğitim/Destek Aluplan hizmetleri, Teams/ticket destek kanallarıdır. Kaynak belge yayın tarihi otomatik sürüm veya yürürlük tarihi değildir.

22 Ekim schema raporu burada esas alınır: kalıcı ürün ve yıllık sayfa ayrı sayfa amaçlarıdır; yazılım paket/yılı otomatik Google ProductGroup varyantına çevrilmez. Eğitim ana hizmet anlatımı, video listesi ve tek video aynı ana varlık değildir. Form kişisel verileri JSON-LD'ye girmez. Fiyat yayımlamayan site için sahte Offer/price=0 eklenmez; semantik modelin amacı rich result garantisi değildir.

Tema tokenları renk/boşluk/tipografiyi yönetir; ürün ilişkileri, URL'ler, form tercihleri ve schema kaydı tokenlara bağlanmaz. Antrasit değişimi bu veri katmanlarını etkilememelidir.

## 9. Kararlar ve bir sonraki kabul

| Konu | Bu aşamadaki öneri/durum | Karar sahibi |
|---|---|---|
| Navigasyon | Altı mevcut ana başlık + görünür Eğitim ve Destek yardımcı girişi | Kullanıcı; öneri onayı |
| Kalıcı ürün / yıllık sürüm | Ayrı bilgi görevleri, mevcut URL'ler korunur | Proje ekibi; stratejiyle uyumlu taslak |
| Paket karşılaştırması | Fiyatsız, kanıtlı işlev/kapsam tablosu | Proje ekibi; ticari kapsamı Aluplan doğrular |
| Deneme lead kapısı | İsteğe bağlı yardım önerisi; zorunluluk hâlâ açık | Kullanıcı / Aluplan |
| Form takip hedefi ve sorumlusu | Sonraki operasyon planı; tasarımda teslimat sözü uydurulmaz | Aluplan operasyon + teknik ekip |
| Eksik hedef onarımları | Ertelendi; liste korunur | Kullanıcıyla yayın öncesi kapsam kararı |

Kullanıcıdan şimdi gereken ana değerlendirme navigasyon ve üç yolun uygunluğudur. Teknik satırların tek tek kontrolü kullanıcıya bırakılmaz. Kabulden sonra sıradaki çıktı sayfa şablonları için içerik/blok gereksinimleri ve gerçek içerikle ana sayfa iskeleti planıdır; uygulamaya geçiş ayrıca onaylanır.

Gelecek kabul ölçütleri: bütün eski içerik/CTA'ların hedef şablonu bulunmalı; her sayfa birincil görevini açıklamalı; eğitim/destek ana sayfa altına bağımlı kalmamalı; bilinmeyen paketle talep yolu tamamlanabilmeli; arşiv izlemek talep formuna bağlanmamalı; URL/schema ilişkileri tema değişiminden bağımsız olmalı. Bunlar henüz çalıştırılmış test sonuçları değildir.

## 22.10.2026 — Şablon planı hazırlandı

Kullanıcı sonraki planlama adımına geçmeyi kabul etti. [Şablon gereksinimleri](page-template-requirements.md) ve [kaynak ana sayfa blok planı](homepage-block-plan.md) bu belgenin devamıdır. Bölüm6'daki referans/kanıt alanı mevcut homepage bileşeni değildir; yeni öneri olarak ayrılmıştır. Gerçek sekiz bileşen ve20hizmet kayıtları eşlenmiştir; tam içerik paritesi uygulamada ayrıca doğrulanır.
