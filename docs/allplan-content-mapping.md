# ALLPLAN içerik eşlemesi ve yıllık yayın çalışma tablosu

21.10.2026 — Dokümantasyon taslağı; kod, yeni URL, içerik değişikliği veya entegrasyon yapılmadı.

Bu çalışma [uzun vadeli stratejiyi](long-term-web-strategy.md) mevcut içerik üzerinde sınar. Kaynak: 19.10.2026 tarihli [canlı içerik kaydı](00-inventory/content-inventory.json), [URL eşleme tablosu](00-inventory/url-map.csv), [kullanıcı kararları](00-inventory/user-decisions.md) ve 21.10.2026 tarihinde salt-okunur incelenen `../aluplan-2026` kök uygulaması. Canlı durum bu belge hazırlanırken yeniden taranmadı; aşağıdaki HTTP sonuçları önceki kayıtların sonuçlarıdır. Kaynakta bulunması, ticari iddianın veya paket kapsamının bağımsız doğrulanması değildir.

## 1. Sayfa ile ürün kaydını ayıran eşleme

Aşağıdaki kimlikler uygulama öncesi öneridir. Aynı ürünü anlatan iki sayfa ayrı `pageId` taşıyabilir; bu iki ayrı ürün yaratmayı veya URL'leri birleştirmeyi gerektirmez. Bu tablodaki tüm sayfa URL'leri önceki parite kaydında 200 dönmüştür.

| İçerik / aday kayıt | Korunacak mevcut URL | Kaynak ve eşleme gerekçesi | Açık sınır |
|---|---|---|---|
| Kalıcı ürün ailesi `allplan` | https://aluplan.com.tr/products/allplan | `app/products/allplan/page.tsx`; metadata açıklaması “ALLPLAN ana ürün: AEC için entegre BIM platformu”, `ANA ÜRÜN` etiketi | İçindeki üç paket listesi bütün katalog kabul edilmez |
| Aynı ürün ailesinin ayrı anlatım sayfası | https://aluplan.com.tr/products/allplan-aec | `app/products/allplan-aec/page.tsx`; canlı H1 “ALLPLAN”, “ALLPLAN NEDİR?” bölümü | `/products/allplan` ile hangi anlatımın ana giriş olacağı açık; birleştirme/301 kararı yok |
| Paket adayı `allplan-basic` | https://aluplan.com.tr/products/allplan-basic | `app/products/allplan-basic/page.tsx`; canlı “ALLPLAN Basic nedir?” | Kapsamı tüm yıllarda aynı varsayılmaz |
| Paket adayı `allplan-concept` | https://aluplan.com.tr/products/allplan-concept | `app/products/allplan-concept/page.tsx`; ana sayfa paket listesinde de var | Ana ürün sayfasındaki üçlü listede bulunmaması kaldırılma kanıtı değildir |
| Paket adayı `allplan-professional` | https://aluplan.com.tr/products/allplan-professional | `app/products/allplan-professional/page.tsx`; paket listelerinde var | Özellik ve destek koşulları ayrıca doğrulanacak |
| Paket adayı `allplan-ultimate` | https://aluplan.com.tr/products/allplan-ultimate | `app/products/allplan-ultimate/page.tsx`; paket listelerinde var | Başka yazılım bileşenleri ve yıldızlı koşullar korunacak |
| Uzmanlaşmış paket/çözüm adayı `allplan-civil` | https://aluplan.com.tr/products/civil | `app/products/civil/page.tsx`; ana sayfanın aynı karşılaştırma alanında “CIVIL” | Ticari edition/bundle tanımı üretici/Türkiye kapsamıyla doğrulanmadan kesinleştirilmez |
| Uzmanlaşmış paket/çözüm adayı `allplan-precast` | https://aluplan.com.tr/products/precast | `app/products/precast/page.tsx`; ana sayfanın aynı karşılaştırma alanında “PRECAST” | `/products/precast-detail` ve `/solutions/precast` ayrı sayfalar olarak korunur |
| Karşılaştırma sayfası | https://aluplan.com.tr/package-overview | `app/package-overview/page.tsx`; canlı H1 “Paket Karşılaştırması” | Sürüm arşivi sanılmamalı; mevcut bağlantı etiketi aşağıda açık bulgu |
| Yıllık sürüm `allplan-2026`, teknik yenilik sayfası | https://aluplan.com.tr/products/allplan-2026 | `app/products/allplan-2026/page.tsx`; “YENİ ÖZELLİKLER” ve paket etiketleri | 2027 bilgisiyle ezilmez; bu sayfa kalıcı ürünün yerine geçmez |
| Aynı sürüme bağlı ikinci içerik sayfası | https://aluplan.com.tr/products/allplan-2026-yenilikler | `app/products/allplan-2026-yenilikler/page.tsx`; “ALLPLAN 2026 – ANA ÖZELLİKLER VE GELİŞTİRMELER” | Aynı sürüme bağlı iki sayfa; aynı metin veya gereksiz tekrar olduğu varsayılmaz |
| İlişkili bulut içeriği | https://aluplan.com.tr/products/allplan-cloud-services ve https://aluplan.com.tr/solutions/allplan-bulut-hizmetleri | İki ayrı kayıt `url-map.csv` içinde mevcut | Her ALLPLAN paketine otomatik dahil edilmez; ürün/hizmet sınıflaması açık |
| İlişkili BIMPLUS ürünü/servisi | https://aluplan.com.tr/products/allplan-bimplus | `app/products/allplan-bimplus/page.tsx`; canlı H1 BIMPLUS iş birliği anlatımı | ALLPLAN'ın yıllık sürümü veya paketi olarak otomatik modellenmez |

Bu tablo tüm ALLPLAN ilişkili sayfaların veya özelliklerin eksiksiz envanteri değildir. Bridge, eğitim, eklentiler ve diğer ürünlerin tam ilişkileri Faz 0 kayıtları üzerinden genişletilecek; AX3000/BIMFlex/SDS2 gibi portföy içerikleri ALLPLAN paketleri altına otomatik taşınmayacak.

## 2. Ürün–paket–sürüm kapsamının somut örneği

Önerilen içerik ilişkisi: `productId` → bağımsız `editionId` ve `releaseId`; kapsam kaydı `editionId + releaseId + market + capabilityId` birleşimiyle belirlenir. Özellik adı veya sayfa URL'si kararlı kimlik yerine geçmez. `source`, `sourceLocator`, `verifiedAt`, `verificationStatus` ve metnin aynen korunacağı alan ayrıca tutulur.

Mevcut kayıtta görülen ilişki örnekleri:

| Sayfa | Kaynaktaki özellik başlığı | Kaynaktaki paket işareti | Kaydedilebilecek bilgi / doğrulanamayan sonuç |
|---|---|---|---|
| `/products/allplan-2026` | Georeferans Noktaları ile Kesin Konumlandırma | `Dahil Olduğu Paket:` ve `#Concept` | 2026 sayfası bu ilişkiyi söylüyor; diğer paketlerde yok sonucu çıkarılamaz |
| `/products/allplan-2026` | Import buildingSMART Data Dictionary (BSDD) İçe Aktarma | `Dahil Olduğu Paket:` ve `#Professional` | İçerik gözlemi kaydedilir; Türkiye lisans koşulu ayrıca doğrulanır |
| `/products/allplan-2026-yenilikler` | Geliştirilmiş Serbest Şekilli Merdiven Modelleyicisi | `Dahil Olduğu Paket: #Concept` | Aynı ürünün 2026 sürümüyle ilişkilendirilir; gelecek sürüme otomatik kopyalanmaz |

Bunlar yeni pazarlama metni veya onaylı kapsam tablosu değildir. Tam açıklamalar [canlı içerik kaydında](00-inventory/content-inventory.json) ve [metin dökümünde](00-inventory/page-content.md) korunur; burada yalnız kaydı bulmaya yarayan başlık ve ilişki gösterilmiştir. Bölge doğrulanmadıysa `market=TR` ile doğrulanmış satış kapsamı oluşturulmaz; doğrulama bekleyen içerik gözlemi olarak tutulur. Eksik kapsam satırı “yok” anlamına gelmez.

## 3. Dosya ve revizyon ilişkisi

Mevcut hedef aynen korunur:

`https://aluplan.com.tr/docs/V2026_paket-karsilastirme-Q3-2026_R01.pdf`

Ana sayfa canlı kaydında “Karşılaştırma Tablosunu İndir (PDF)” ve altı paket kartı aynı PDF'ye gider. Kaynak karşılığı `components/homepage-v2/TechSpecsTable.tsx:65,80`.

Dosya adı 2026/Q3/R01 bağlamını gösterir; PDF içeriği bu çalışma kapsamında okunmadı. Dosya adından paket kapsamı, yayın tarihi veya Türkiye geçerliliği çıkarılmadı. Öneri: mevcut dosyayı ayrı `assetId` ile saklamak, kaynak doğrulaması sonrasında 2026 sürümü ve geçerli kapsam kayıtlarına bağlamak. Sonraki revizyon yeni kayıt/dosya olur; eski URL sessizce başka dosyayla değiştirilmez.

## 4. Mevcut anlatımdaki karar gerektiren noktalar

| Bulgu | Kanıt | Etkisi ve önerilen karar |
|---|---|---|
| Ana ürün sayfası üç paket; ana sayfa karşılaştırması altı seçenek gösteriyor | `app/products/allplan/page.tsx:25–46`: Basic/Professional/Ultimate; `components/homepage-v2/TechSpecsTable.tsx:10–41`: Basic/Concept/Professional/Ultimate/Civil/Precast; canlı HTML'de de gözlendi | Katalog tamlığı belirsiz. Seçili örnek mi, eski liste mi? Kullanıcı kararı ve üretici kapsam kaynağı gerekli; mevcut içerik silinmez |
| “Sürümleri Görüntüle” paket karşılaştırmasına gidiyor | Basic kaynak satır 139, Civil satır 226 → `/package-overview`; hedef H1 “Paket Karşılaştırması” | Sürüm–edition ayrımı kullanıcı için bulanık olabilir. Etiket değişikliği ayrı onaya sunulur; hedef korunur |
| Deneme süresi çelişkisi | `app/products/allplan/page.tsx:59`: “30 gün ücretsiz deneme”; kullanıcı gözlemi 14 gün, `user-decisions.md` | Güncel üretici koşulu ve bağlama göre teyit; toplu otomatik düzeltme yapılmaz |
| Ürün sayfasındaki destek/eğitim paket vaatleri | `app/products/allplan/page.tsx` paket `features` alanları | Yazılım özelliğiyle Aluplan hizmet koşulu aynı kapsam sanılmamalı. Üretici ve yerel hizmet sorumluluğu ayrı doğrulanır |
| İki yıllık yenilik sayfası ve iki kalıcı ürün anlatımı var | Bölüm 1 URL'leri | İçerik amacı/örtüşme karşılaştırması gerekli; tek sayfaya indirme veya canonical birleştirmesi henüz önerilmiş karar değildir |
| 2026 özellikleri için hatalı alternatif bağlantı var | `url-map.csv`: `/allplan-2026nin-ozellikleri` önceki ölçümde 404 | Geçerli iki 2026 sayfasından hangisine bağlanacağı kaynak bağlamıyla onaylanmalı; yeni URL uydurulmaz |

### Formdaki ürün–paket ayrımı için yeni gözlem

21.10.2026 tarayıcı incelemesinde teklif formunun ALLPLAN dalındaki abonelik seçeneklerinde Basic, Concept, Professional, Ultimate, Civil, Precast ve License Server yanında SDS2, FRILO Editions, FRILO GEOTECHNICS ve SCIA Engineer Editions da görüldü. Kanıt ve gözlem sınırı: [form gözlemi](00-inventory/form-observation-2026-10-21.md). Bu adlar aynı form adımında sunuluyor diye hepsi ALLPLAN edition kaydı yapılmamalı; üretici/ürün/paket/lisans bileşeni ilişkileri ayrı doğrulanmalı. Mevcut form hedefi ve seçenekler korunur. İnceleme sırasında kişisel veri girilmedi ve form gönderilmedi.

## 5. Mevcut CTA'larla müşteri yolları

Bu tablo önerilen niyet eşlemesidir; bütün adımların mevcut arayüzde birbirine bağlı veya kullanılabilirliği test edilmiş olduğu iddia edilmez. Hedefler canlı envanterden alınmıştır; yeni dönüşüm önceliği belirlenmedi.

| Niyet | Mevcut içerik durakları | Korunacak sonraki hedef | Ayrı değerlendirme |
|---|---|---|---|
| Mimarlık iş akışına uygun çözümü bulmak | `/solutions/architecture` → ilgili ürün/paket sayfaları | Teklif veya deneme | Hangi paketin önerileceği gerçek ihtiyaç/kapsamla doğrulanır |
| Yapı mühendisliği ihtiyacını değerlendirmek | `/solutions/structural`, `/solutions/rebar-engineering` | İlgili ürün/paket, ardından teklif veya deneme | Segmentin ticari önceliği açık |
| Altyapı veya prekast ihtiyacı | `/solutions/infrastructure`, `/solutions/precast`; `/products/civil`, `/products/precast` | Teklif veya deneme | Çözüm sayfası ile ticari kapsam kaydı ayrılır |
| Paket karşılaştırmak | `/package-overview` ve mevcut PDF | https://forms.office.com/r/hXhnKAG912 | PDF/HTML kapsam uyuşması henüz doğrulanmadı |
| Ürünü denemek | Ürün/paket sayfalarındaki mevcut CTA | https://www.allplan.com/trial-or-subscription/ | Çıkış tıklaması indirme veya kayıt tamamlanması değildir |
| Teklif almak / soru sormak | Ürün/paket sayfası | https://forms.office.com/r/hXhnKAG912 veya https://aluplan.com.tr/contact | Forms aynen korunur; yeni form/CRM kararı yok |
| Yeni sürümü anlamak | `/products/allplan-2026`, `/products/allplan-2026-yenilikler` | İlgili paket ve mevcut eğitim içeriği | Sürüm yükseltme koşulu veya ücret uydurulmaz |
| Mevcut ürünü öğrenmek | https://aluplan.com.tr/solutions-v2/training ve https://aluplan.com.tr/solutions-v2/training/video-library | Mevcut eğitim detayları | Eğitimlerin uyumlu olduğu sürümler ayrıca doğrulanır |
| Destek / sertifika | Ana sayfa hizmet alanı | Mevcut Teams hedefi (tam hedef envanterde), https://aluplan.net.tr, https://aluplan.info/ | Destek talebi yeni satış talebi sayılmaz; oturum/form gönderilmedi |

Teklif ve deneme hedefleri kaynakta `components/templates/ProductPageTemplate.tsx:244–249` ve `components/layout/Header.tsx:245–251` içinde de görülür. Eğitim/destek/sertifika kaynak karşılığı `components/homepage-v2/ServicesV2.tsx` dosyasıdır.

## 6. Her yıllık sürümde kullanılacak kontrol listesi

Bu liste mevcut sistemde çalıştırılmış bir yayın veya test değildir; gelecekteki işletim sözleşmesidir.

- [ ] Üretici sürüm notunu, paket tablosunu, Türkiye koşullarını ve dosya izinlerini kaynak/tarih/sorumluyla kaydet.
- [ ] Yeni `releaseId` oluştur; site klasörü/yılıyla eşitleme. Eski sürüm kaydını ve eski kaynak metinlerini koru.
- [ ] Her değişen paket için yeni sürüm/bölge kapsamını ayrı kaydet. Önceki yıl satırını ezme; bilinmeyeni “yok” yapma.
- [ ] Kalıcı ürün açıklamasının gerçekten değişen bölümlerini eski/yeni metin ve dayanakla ayrı onaya sun.
- [ ] Yeni dosya revizyonunu ayrı kaydet; eski PDF/video URL'leri ve dosya bütünlüğü korunsun.
- [ ] Etkilenen tüm sayfaları ilişki tablosundan çıkar: ürün, paket, karşılaştırma, sürüm, çözüm, eğitim ve CTA bağlamı.
- [ ] Mevcut URL'leri koru; yeni sürüm URL'sini envanter/PRD kararıyla belirle. Zorunlu değişiklik varsa onaylı 301 eşlemesi hazırla.
- [ ] Sayfa başlığı, canonical, görünür sürüm etiketi ve kaynak tarihi aynı içeriği temsil etsin.
- [ ] Schema görünür içerikten ve aynı kayıt kimliklerinden beslensin. Yazılım sürümü site yılına çevrilmesin; fiyat/değerlendirme üretilmesin. Ayrıntı için strateji bölüm 10 esas alınsın.
- [ ] Önizlemede eski/yeni sürüm ayrımı, paket kapsamı, tema değişiminde içerik/URL/schema korunumu, dosya ve CTA erişimi kontrol edilsin.
- [ ] Ürün doğruluğu ve yayın için ayrı onay kaydı, commit ve geri dönüş noktası olsun.
- [ ] Yayın sonrası erişim/CTA/dosya kontrolleri ve harcanan çalışma süresi kaydedilsin; tasarım yenileme otomatik yıllık iş sayılmasın.

## 7. İçerik, tema ve schema sınırı

İçerik kayıtları ürün adı, tam metin, URL, dosya ve kaynak ilişkilerini taşır. Tema yalnız görsel tokenları taşır. Schema üretimi onaylı içerik kayıtlarından ayrı katmanda yapılır; tema seçimi `@id`, URL, ürün/paket/sürüm ilişkisi veya görünür metni değiştiremez. Tasarım paketindeki sentetik S1/S2 verileri gerçek ALLPLAN envanteriyle karıştırılmaz.

Bu çalışma Google kurallarını yeniden araştırmaz; [stratejinin 21.10.2026 doğrulamalı schema planına](long-term-web-strategy.md#10-schema-ve-kalıcı-içerik-ilişkileri) dayanır. `SoftwareApplication`, `Product` veya `ProductGroup` türü sırf tabloda paket/yıl bulunduğu için otomatik seçilmez. Uygulama öncesinde sayfa anlamı ve güncel uygunluk yeniden kontrol edilecek.

## 8. Kabul ve açık kararlar

Tamamlanan: mevcut ALLPLAN sayfa/dosya/CTA yüzeyleri için ilk somut ilişki taslağı, tutarsızlık listesi ve yıllık yayın kontrol listesi. Henüz tamamlanmayan: tam paket özellik matrisi, PDF içerik doğrulaması, tüm dinamik sekmeler/medya, müşteri kullanılabilirlik testi ve tüm ilişkili içeriklerin eksiksiz eşlemesi.

Kullanıcı/ürün sorumlusundan karar gerekenler: üçlü/altılı katalog farkı; Civil/Precast ticari sınıflaması; sayfaların örtüşen rollerinin nasıl açıklanacağı; sürüm/paket bağlantı etiketi; doğrulanmış deneme süresi; ürün doğruluğu onay sorumlusu; tek birincil CTA ve segment öncelikleri. Bu kararlar gelene kadar kaynak içerik ve hedefler korunur. Faz 0 kapanışı bu belgenin varlığıyla tamamlanmış sayılmaz.

21.10.2026 ek doğrulama: Q3 PDF adındaki `karsilastirma` yazımı rapor aktarım hatasıydı; doğru `karsilastirme` hedefi 200, hatalı yazım 404. Canlı URL değişikliği değildir. Güncel paket/PDF ve canlı CTA değerlendirmesi: [karar tablosu](package-comparison-decisions.md).
