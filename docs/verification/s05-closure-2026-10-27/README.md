# S05 kalan aday ve etkileşim denetimi — 27.10.2026

## Doğrulanan sonuç

Önceki rapordaki303ilkHTML adayı statik pointer/renderer eşliğiyle sınıflandırıldı:35kayıt ilk workflow kategorisindeki seçili olmayan öğe,227kayıt seçili olmayan workflow kategorisi,41kayıt seçili olmayanFAQkategorisi. Hiçbiri varsayılan aktif(0/0) dalında değil; bu kümede hiç render edilmeyen alan bulunmadı. Alan sayıları: workflow179description/58title/25subtitle;FAQ18question/17answer/4subtitle/2title. Bu sonuç başka kaynak içeriklerinin eksik olmadığı garantisi değildir.

Tarayıcıda15workflowrotası/195durum gerçekten seçildi; title/subtitle/description DOMmetni beklenen veriyle eşleşti,0hata. CSSuppercase Türkçe subtitle harflerini dönüştürdüğünden eşlik DOMtextContent ile, panel gösterimi ayrıca seçilerek incelendi. SSS5kategori/25yanıt açıldı ve answer metinleri eşleşti. Eğitim6sekmesi açıldı; Home/End odağı ve seçimi doğru, BIMtalep linki mevcutMSForms.

Workflowüst sekmelerine yatay, alt sekmelere dikey yön/klavye, rovingtabIndex, ID/aria-controls/tabpanels eklendi. FAQkategori sekmelerine aynı ilişkiler eklendi. Yeni üretim build sonrası Yenilikler'de kategoriEnd ve altöğeEnd, FAQHome gerçek klavye ile doğrulandı. Panelaria-labelledby aktif düğme ID'siyle eşleşti. Bütün195durum taraması erişilebilirlik düzeltmesinden önceki507ec8düretiminde yapıldı; içerik/tıklama mantığı değişmedi, yeni klavye örnekleri yeni buildüzerindedir.

Yenilikler'in yarım SEO/hero açıklaması, mevcut kaynak genel bakış paragrafının ilk tam cümlesine dönüştürüldü. Yeni cümle yazılmadı; güncelleme yalnız bu rota ve arama kaydına yansır. Kaynak2026, schema türleri ve dosya hedefleri değişmedi.

57birim testi,36mevcutparite, productionbuild/TypeScript ve188kontrast kontrolü geçti. Kod incelemesi kritik/yüksek/orta bulgu vermedi. Bunlar canlı yayın veya bağımsız görsel tasarım kabulü değildir.

## Dar ekran

390×844viewport talep edildi; tarayıcının gözlenen CSSgenişliği354px, documentscrollWidth354px. EğitimBIMpaneli görünür, yatay taşma yok; sekmeler satırlara yerleşiyor. `training-mobile.png` incelenen ekran görüntüsüdür. Bu tek örnek tüm mobil sayfaların kabulü değildir. Override sıfırlandı.

## Açık varlıklar ve sınırlar

Kaynak2026public ve2027public altında bulunmayan5görsel:

- /images/training-interest.jpg
- /images/training-basic.jpg
- /images/training-advanced.jpg
- /images/training-special.jpg
- /images/training-bim.jpg

sourceImageSrc yolları veride korunur; imageSrc:null panelleri görselsiz gösterir, kırık istek üretmez. Bu5görselin temini veya görselsiz kalmasının nihai kabulü açıktır. Başka bir görselle otomatik değiştirilmedi.

Seçili olmayan workflow/FAQiçeriği ilkHTML'de tutulmuyor; tarayıcı etkileşiminde erişilebilir. SSR/SEOstratejisi yayın öncesi ayrı kabul maddesidir. Uzaktan video oynatımı, tüm kart/galeri modal akışları ve tüm sitenin görsel kabulü bu tarama kapsamında tamamlanmış değildir. Referans gibi diğer sekme aileleri için genel erişilebilirlik kabulü iddia edilmez. S05adaymetin taraması kapandı; bütün S05kabulü açık varlık/medya/görsel maddeleri nedeniyle hâlâ açıktır. S06başlamadı, push/deploy yapılmadı.

Makine okunur kanıt: browser-checks.json. Geçici üretim sunucusu3001kapatıldı; kullanıcının sunucusuna dokunulmadı.

## Yerel medya ve responsive kontrolü — 27.10.2026 devamı

Kullanıcı canlıya alınmayacağını açıkça belirtti. Tüm işlemler2027yerel checkout'ta kaldı; deploy/push yapılmadı.

Masaüstü110ve dar ekran110rotası tarayıcıda açıldı. Son taramalarda yatay taşma0, tekH1sayısı110/110; o anda yüklenmiş görsellerde hata0. Bu, tüm lazy görsellerin yüklendiği veya her sayfanın editöryal tasarım kabulü değildir. İlk mobil taramada Contact354pxekranda368pxgenişliyordu; gridmin22rem ekranı aşıyordu. minmax(min(100%,22rem),1fr) ile düzeltilip son110rota taramasında taşma0doğrulandı. Kanıt responsive-desktop-after.json, responsive-mobile-after.json ve contact-mobile-after.png.

53yapısal rota ziyaret edildi; mevcut medyatürlerinden rota başına en fazla1video+1görsel seçilerek69modal örneği açıldı/kapatıldı. Seçili örneklerin tümü medyaURL'si ve bodykaydırma kilidi sağladı. Bu69örnek bütün kartları/sekme durumlarını veya tüm YouTubevideolarının oynatılabilirliğini test etmez. media-route-samples.json her rotanın mevcut tetikleyici sayısını ve seçili örneklerini ayırır. İki uzun toplu çağrı süre aşımına ulaştı; tamamlanmış rota sonuçları dosyaya artımlı kaydedildi, eksik rotalar küçük gruplarla tamamlandı.

Video ve görsel modalları, site aramasıyla birlikte paylaşılan MediaDialog native dialog bileşenine taşındı. showModalarka planı etkileşime kapatır; açılışodağı kapatma düğmesine (aramada input), kapanışodağı tetikleyiciye döner, bodyoverflow önceki değeriyle geri yüklenir. Escape ve kapatma kontrol edildi. Medya açıkkenCtrlKikinci arama diyaloğu açıyordu; koruma eklendi ve1modal kaldığı doğrulandı. AramadanBIMFlexnavigasyonu sonrası0dialog/normaloverflow doğrulandı. Uzun başlıklar sarılır, modal ekran yüksekliğiyle sınırlanıp gerektiğinde kendi içinde kayar; yatay mobil örnekte kapatma kontrolü ekran içindeydi. Native tekdüğmeliTabodağının tarayıcı araç çubuğuna gitmesini önlemek için ayrıca açıkTabdöngüsü eklendi. Cross-originiframe içindeki tuş olaylarının React'e yayılacağı iddia edilmez.

YerelMP4örneği readyState4/pausedfalse/currentTime7.69sile oynadı; local-video-check.json/video-modal-after.png. HariciYouTubehedefleri modaliframe'e doğru bağlandı; her harici videonun erişimi/yaş-bölge sınırlaması doğrulanmış değildir. KaynakURL'ler korunur.

Beş eksik Eğitim görseli için çalışma kararı: kaynak dosya bulunana kadar görselsiz, metinveCTA'ları tam paneller korunur. Bu bir kayıp dosyayı geri getirme iddiası değildir; sourceImageSrcdenetim izi korunur. Bu beş varlık gelecekte temin edilebilir; mevcut yerel kullanımda kırık istek üretmedikleri doğrulandı. Uydurma/başka ürün görseli kullanılmadı.

Yerel S05tekniği bu kapsam ve istisnalarla doğrulandı; tüm sitenin nihai tasarım kabulü ve seçili olmayanworkflow/FAQiçeriğininSSR/SEOkararı sonraki tasarım/yayın öncesi kontrol kapsamındadır. Canlı yayın planlanmıyor. S06token/bileşen sağlamlaştırma henüz başlamadı.

Son doğrulama: Tab ve Shift+Tab son build üzerinde tek kapatma düğmesinde kaldı; modal-behavior.json önceki hatayı ve düzeltme sonucunu birlikte saklar. 57 birim testi, 36 parite kontrolü ve üretim derlemesi geçti.

İnceleme düzeltmesi: Yerel video/ses kontrollerinin kendi Tab sırasını atlamamak için aktif öğe video/audio/iframe olduğunda açık sarma uygulanmaz; native dialog izolasyonu korunur. Tek DOM kapatma düğmesi için açık sarma aktiftir. Her tarayıcının tüm yerel medya kontrol sırası test edildiği iddia edilmez.
