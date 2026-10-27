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
