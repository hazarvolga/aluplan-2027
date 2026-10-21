# ALLPLAN paket karşılaştırması: kanıt, çelişki ve karar

21.10.2026 — Analiz ve strateji kararı; uygulama, site metni, form veya schema çıktısı değiştirilmedi.

## Kaynaklar ve yöntem

- **P1**: [Q4-2025 PDF](https://aluplan.com.tr/docs/V2026_Paket_Karsilastirma-Q4-2025_R01.pdf), sayfa 1; basılı tarih 23.10.2025. SHA-256 `a5dae7878a9e6e889d3a46b5b0adf2b979aff84e969465935cf453611408a333`.
- **P2**: [Q3-2026 PDF](https://aluplan.com.tr/docs/V2026_paket-karsilastirme-Q3-2026_R01.pdf), sayfa 1; basılı tarih 1.7.2026. SHA-256 `567ce14a65f8012cb1f69b1e97dfff2badf089504a4b23a72e1a3f81a0147405`.
- İki dosya bu turda canlı GET/200 ve hash ile yeniden doğrulandı; salt-okunur kaynak kopyaları incelendi. Tarihler belge üzerindeki tarihtir; ticari yürürlük tarihi olduğu varsayılmaz.
- **W**: [10 canlı web sayfası ve kaynak kanıtları](00-inventory/package-web-evidence-2026-10-21.md).
- PDF metin çıkarımı sütunları birleştirdiği için hücre işaretleri görsel ve koordinatlarla kontrol edildi; ikinci bağımsız inceleme ile kritik farklar doğrulandı. [P1 görseli](00-inventory/pdf-evidence/q4-2025-1.png), [P2 görseli](00-inventory/pdf-evidence/q3-2026-1.png). Ham metin kanonik ürün metni değildir.

## Kaynak–çelişki–karar tablosu

| ID | Kanıt / fark | Yanlış çıkarım riski | Strateji kararı ve kalan doğrulama |
|---|---|---|---|
| K01 | P1 ve P2 aynı ALLPLAN 2026 için; tarihler farklı | Yazılım sürümüyle katalog revizyonunu karıştırmak | Aynı release altında iki bağımsız kaynak revizyonu tutulacak. P2 daha yeni belge; otomatik ticari yürürlük üstünlüğü yok |
| K02 | P1: Basic, Concept, Professional, Ultimate, Civil, Precast Slabs, Precast Walls, Precast; P2: ilk beş + Precast | Slabs/Walls satıştan kalktı demek | Altı güncel sunum adayı, sekiz tarihsel sütun korunacak; eski paketlerin satış durumu ayrıca doğrulanacak |
| K03 | P1 dolu kare kalıcı/abonelik, yıldız yalnız abonelik; P2 dolu kare abonelik | Aynı sembolü aynı hak sanmak | Kapsam kaydı lisans modeli ve belge revizyonuyla okunacak; ham hücre ve lejant birlikte korunacak |
| K04 | P1 SCIA Concept: Ultimate yıldız, Precast kare; SCIA Ultimate: Civil kare. P2 SCIA bölümü yok; W Ultimate/Civil sayfaları hâlâ SCIA dahil olma iddiası taşıyor | SCIA kaldırıldı veya hâlâ dahil diye otomatik karar | İki ayrı kaynak iddiası; güncel TR kapsamı teyit edilene kadar dahil/yok hükmü verilmez |
| K05 | P1 BIM²form ücretli seçenek: Ultimate/Civil/Slabs/Walls/Precast; P2 satır yok | Satır yokluğunu satıştan kaldırılma saymak | Eklenti ilişkisi ürün kimliğinden ayrı; kaynakta belirtilmiyor durumu tutulacak |
| K06 | P2 TIM ücretli seçenek: Ultimate/Precast; dipnot bu edition'lardan birini gerektiriyor. P1 satır yok | TIM'i pakete dahil özellik sanmak | Satın alınabilir ek ürün ve ön koşul ilişkisi; included ve purchasable ayrı alanlar |
| K07 | Her iki PDF'de Basic/Concept AI hücresi boş; ortak diğer dört sütun işaretli. Veras ayrı lisans dipnotu her ikisinde var | Entegrasyonu üçüncü taraf lisans hakkı sanmak | Entegrasyon, özellik erişimi ve üçüncü taraf lisans koşulu ayrı gösterilecek |
| K08 | P1 bulut yalnız abonelik; P2 kare abonelik ama dipnot “Tüm lisanslara dahildir” | Kalıcı lisanslara da kapsıyor diye genişletmek | P2'nin dipnotunun hangi lisans evrenini kastettiği ticari doğrulama sorusu |
| K09 | Eleman Planı → Shop Drawing; açıklama/ortak işaretler benzer | Ad değişimini yeni özellik saymak | Kaynak etiketleri korunur; kararlı capability kimliği için eşanlam eşlemesi gözden geçirilir |
| K10 | PDF'lerde AALLPLAN / Professianal yazım hataları | Ham etiketlerden farklı ürün kayıtları yaratmak | Kaynak alıntısı aynen; kimlik/ad sözlüğü ayrı. Site metni henüz düzeltilmez |
| K11 | W: ana ürün listesi üç; ana sayfa/P2 altı seçenek | Concept veya uzman seçeneklerin yok sanılması | Tek katalog kaynağı; sayfalar amacına göre görünüm seçer, seçili liste açıkça etiketlenir |
| K12 | W: “Sürümleri Görüntüle” → /package-overview, içerik hazırlanıyor; /paket-karsilastirma PDF sunuyor | HTTP200'ü tamamlanmış müşteri yolu saymak | Karşılaştırma yolu öncelikli düzeltme adayı. Mevcut URL'ler korunarak amaç/etiket düzeltmesi tasarlanacak |
| K13 | W: ürün paket listesinde e-posta/premium destek, eğitim/danışmanlık | Üretici yazılım kapsamıyla Aluplan hizmetlerini karıştırmak | Yazılım kapsamı ve yerel hizmet teklifi ayrı kayıt/başlık; hizmet taahhüdünün kapsamı doğrulanacak |
| K14 | Kaynakta 30 günlük kullanılmayan CTA prop'u; canlı CTA 14 gün | Eski kaynak değerini canlı hata diye sunmak | Güncel render kanıtı esas; 30 gün kaynak temizliği adayı, şu anda canlı 30 gün iddiası yok |

Ek karşılaştırma: W09'daki 12 aylık Solibri Inside hakkı P1/P2'de ayrı satır olarak bulunmuyor. Bu web/PDF kapsam farkı satış hakkının yokluğunu kanıtlamaz; süreli üçüncü taraf entitlement olarak ayrı kaynak ve süreyle doğrulanmalı. W06'daki “Concept plus” metninden yeni paket oluşturulmaz.

Ortak işlev omurgası iki PDF'de benzer kademelenir: ilk altı temel işlev tüm sütunlarda; yapı bileşenleri/metraj gibi grup Concept'ten; donatı/gelişmiş görselleştirme/yol Professional'dan; kazı/parametrik modelleme grubu Ultimate ve uzman seçeneklerde görünür. Bu özet hücre/dipnotların yerini almaz; boş hücreyi kesin yok veya tüm tarihleri kapsayan satış kuralı olarak kullanmayız.

## Resmî ALLPLAN kaynağıyla çapraz kontrol

21 Ekim'de resmî sitede [2026 genel edition karşılaştırması](https://www.allplan.com/package-overview/compare-allplan-features-2026/), [Civil karşılaştırması](https://www.allplan.com/package-overview/compare-allplan-civil-features-2026/) ve [Precast karşılaştırması](https://www.allplan.com/package-overview/compare-allplan-precast-features-2026/) erişildi. Bunlar uluslararası İngilizce HTML kaynaklarıdır; Türkiye ticari koşulu olarak kabul edilmez.

Bu üç sayfanın okunabilen bağlantılarında indirilebilir PDF bulunmadı. Resmî alan adıyla 2026/2027 paket PDF araması güncel bir karşılaştırma PDF'sini doğrulamadı; eski 2022 dosyaları güncel kanıt olarak kullanılmadı. Dolayısıyla “en güncel resmî PDF bulundu” iddiası yok. Güncel erişilebilir resmî HTML tabloları referans setine alındı. Genel, Civil ve Precast için ayrı karşılaştırma yolları bulunması uzman seçenekleri tek doğrusal üst paket sıralamasına zorlamama kararını destekliyor. Tüm uluslararası hücrelerin TR ile birebir eşliği bu turda doğrulanmadı.

## Karar yetkisi ve sunuma gidecek strateji

Kullanıcı uzun yıllardır hizmet verdiği firma için strateji kararlarında sorumluluk üstlenmek istediğini belirtti. Her ayrıntı firma onayına bırakılmayacak. Bu proje için çalışma kararlarımız:

1. Ürün, paket, yıllık sürüm, belge revizyonu ve Aluplan hizmeti ayrı içerik kavramlarıdır.
2. Bir doğrulanmış kapsam kaynağından farklı sayfa görünümleri üretilecek; elle yinelenen paket listeleri hedef yapı değildir.
3. Kullanıcıya ihtiyacına göre kısa girişler, içeride tek talep takibi önerilecek.
4. Karşılaştırma sayfasının işe yaraması ve paket farklarının anlaşılması görsel yenilikten önce gelir.
5. Ticari gerçekler karar tercihi değildir: fiyat, lisans hakları, bölgesel kapsam, üretici izni ve hizmet taahhüdü kanıt gerektirir.

Sunum omurgası: **gözlenen problem → kaynak ekranı/PDF satırı → kullanıcıya etkisi hipotezi → kararımız → doğrulama → başarı ölçümü**. Örnek: boş karşılaştırma hedefi → K12 → seçim yolunun kesilmesi riski → işlevsel karşılaştırma → görev testi → doğru paketi bulma başarısı ve talep tamamlama ölçümü. Ölçülmüş kayıp/gelir artışı olmadığı için yüzdeli vaat yok. Bu belge sunumun kanıt dosyasıdır; final sunum henüz hazırlanmadı.

## Schema ve CMS'siz içerik modeline etkisi

Kullanılan skill: `skill://schema/SKILL.md`. Doğruluk/görünür içerikle eşlik ilkesi uygulandı; skillin kısa zorunlu alan tabloları güncel Google belgeleriyle düzeltildi. 21.10.2026 kontrolü:

| Katman / tür | Karar | Kaynak |
|---|---|---|
| İç kayıt modeli | `editionId + releaseId + market + licenseModel + capabilityId + sourceRevisionId` bağlamında kaynak iddiası; ayrıca observedAt, documentDate, varsa doğrulanmış effectiveFrom/effectiveTo, ham işaret ve dipnot. Tarihleri PDF isminden yürürlük olarak türetme | P1/P2 farkları; bu bizim model kararımız |
| Kalıcı ürün | Uygun sayfada WebPage.mainEntity → SoftwareApplication; üretici ALLPLAN, site yayıncısı/dağıtıcı Aluplan ayrı | [Google yazılım](https://developers.google.com/search/docs/appearance/structured-data/software-app) |
| Paket | İç modelde edition ilişkisi kesin tutulabilir; dış schema türü gerçek varlığa göre seçilir. Her paket otomatik ayrı uygulama veya ProductGroup varyantı değildir | [Google ürün varyantları](https://developers.google.com/search/docs/appearance/structured-data/product-variants) |
| Yazılım yılı / belge revizyonu | softwareVersion yazılım örneğinin sürümüdür. Q3/R01 katalog revizyonu softwareVersion olmaz; kaynak belge kaydında tutulur | [Schema.org softwareVersion](https://schema.org/softwareVersion) |
| Sürüm ilişkisi | isBasedOn yalnız gerçek türeme/uyarlama ilişkisi varsa kullanılabilir; paket üyeliğini göstermek için zorlanmaz | [Schema.org isBasedOn](https://schema.org/isBasedOn) |
| Karşılaştırma sayfası | Bir liste/karşılaştırma sayfasıdır; altı paketi tek satılabilir ürün gibi sunma. Sayfa–ürün ilişkileri ve breadcrumbs görünür yapıyla uyumlu olmalı | [Google genel kurallar](https://developers.google.com/search/docs/appearance/structured-data/sd-policies) |
| Yazılım rich result | name, offers.price ve review veya aggregateRating gerekir. Gerçek görünür fiyat/değerlendirme doğrulanmadı; uygunluk sözü yok. Ücretsiz deneme, ücretli yazılıma sıfır fiyat yazma gerekçesi değildir | [Google yazılım](https://developers.google.com/search/docs/appearance/structured-data/software-app) |
| Product snippet | name yanında review/aggregateRating/offers seçeneklerinden biri gerekir; fiyatlı Offer'ın ayrıca fiyat şartı vardır. “Teklif iste” metni fiyat değildir | [Google Product snippet](https://developers.google.com/search/docs/appearance/structured-data/product-snippet) |
| ProductGroup | Google'ın desteklediği varyant boyutlarından edition/yıl için otomatik uygunluk çıkarılmayacak; paket farkları renk/beden varyantına benzetilmez | [Google varyantları](https://developers.google.com/search/docs/appearance/structured-data/product-variants) |
| Next.js | Onaylı içerik kayıtları görünür sayfa ve ayrı JSON-LD üreticisini besler; tema tokenları ikisini değiştirmez. Güvenli serileştirme ve sayfa/layout düzeyinde çıktı uygulama aşamasında ele alınır | [Next.js JSON-LD rehberi](https://nextjs.org/docs/app/guides/json-ld) |

PDF'de yer alan ama webde henüz görünür olmayan bir kapsam iddiası yalnız schema'ya eklenmeyecek. Dahil, ücretli seçenek, ön koşul, entegrasyon ve kaynakta belirtilmemiş durumları birbirinden ayrılacak. İç modelin tüm ilişkilerini JSON-LD'ye taşımak zorunlu değildir. Ürün ailesinin kararlı kimliği belge revizyonuyla değişmez; yıllık kaynaklar geçmiş kaydı ezmez.

JSON-LD üretilmedi; Rich Results Test veya Search Console testi yapılmadı. Bu plan teknik uygunluğu veya arama sonucunda görünmeyi garanti etmez.
