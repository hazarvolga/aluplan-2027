# Yerleşimden tasarım sistemi bileşenlerine eşleme

22.10.2026 — Kullanıcı geçici kabul edilen yerleşimin tasarım sistemiyle eşlemesine devam edilmesini istedi. Bu belge hazırlık planıdır; indirilmiş paket, önizleme, içerik, schema ve Next.js uygulaması değiştirilmedi.

## Esas alınan sürümler

- Yerleşim: [ana sayfa blok planı](homepage-block-plan.md) ve `docs/previews/homepage-wireframe/`; geçici kabul, nihai tasarım değildir.
- Bileşen kaynağı: proje kökündeki `Aluplan Design System/components/`. Kaynak incelemesi bu tur yapıldı.
- Antrasit referans: `docs/previews/anthracite-demo/`. İndirilen paketin koyu lacivert değerleri doğrudan kullanılmamalı.
- [V3 incelemesi](reviews/design-v3-review/README.md): indirilen pakette breakpoint export drift'i, ayrı kopyada mekanik düzeltme ve antrasit delta var. 28/28 token,13/13 içerik ve188 kontrast sonuçları önceki inceleme kanıtıdır; bu tur tekrar çalıştırılmadı.
- Eski [paket raporundaki](design-system-package-review.md) Tabs ve ReleaseTag bulguları tarihsel: mevcut kaynakta enabled fallback ve unknown statüsü var. Düzelmiş bulgular yeniden açık hata sayılmaz; çalışma zamanı kabulü yine ayrı yapılır.

Paketin örnek ürünleri, karşılaştırma hücreleri, demo metinleri ve `ui_kits` ekranları Aluplan içerik kaynağı değildir. Hazır UI kit sayfası gerçek ana sayfanın yerine geçirilmez.

## H01–H08 bileşen haritası

Bileşen adları paket içindeki gerçek export adlarıdır. “Uyarlama” şimdi yapılan değişiklik değil, sonraki tasarım/geliştirme gereksinimidir.

| Blok | Kullanılacak adaylar | Gerekli uyarlama / sınır | Kabul kanıtı |
|---|---|---|---|
| H01 Giriş | Container, Stack, CtaGroup, BrandLogo | Özel hero bileşimi; gerçek video/poster, oynatma kontrolü, hareket azaltma ve metin kontrastı. Üretici/Aluplan kimliği ayrımı | Logo oranı; video kapalı/hatalı durumda okunurluk; gerçek CTA hedefleri |
| H02 Hızlı erişimler | Grid, Link veya Button ile sade bağlantı listesi | Beş mevcut bağlantı, uzun Türkçe etiket; kart seçimi görsel denemede. Bulut yeniliği ve kalıcı bulut ayrı | Beş hedefin eşliği, mobil taşma olmaması |
| H03 Rol ve ürün | RoleSelector, ProductCard, Grid, CtaGroup | Seçim ürünleri gizleyen filtre olmayacak. Üç rol açıklaması ve altı ürün; rol ilişkisi içerik kaydından gelir | Her rolde altı ürün; native radyo klavyesi; doğru rol CTA'sı |
| H04 Çözümler | Grid, Card, Heading, Text, Link | Çözüm kartına ürün/lisans anlamı yüklenmez; beş kaynak kartı ve medya. Gerekirse yeni SolutionCard bileşimi | Beş başlık/açıklama/hedef ve mevcut görsellerin eşliği |
| H05 Paket/PDF | ResourceCard, Grid, CtaGroup | Mevcut altı kart aynı PDF'ye gider. PackageComparison bu bloğun yerine otomatik konulmaz; HTML karşılaştırma ayrı kapsam | Altı kart + başlık PDF eylemi; fiyatsız anlatım |
| H06 Hizmetler | SupportCard, Card, Grid, Stack; PDF/video için ResourceCard | Eğitim ve iki destek kanalı ilk görünümde; kalan17kayıt görev gruplarıyla erişilebilir. Tabs zorunlu değil | 20kayıt, açıklama/CTA eşliği; gerçek Eğitim render hedefi; ticket/Teams ayrımı |
| H07 BIMFlex | Container, Grid, CtaGroup, BrandLogo yalnız uygun marka varlığı için | Özel duyuru bileşimi; gerçek FlexSoft/BIMFlex medya; koşullu kaynak anlatımı korunur | Ortaklık üreticilik iddiasına dönüşmez; üç model görseli/alt metinler |
| H08 Yenilikler | ReleaseTag, ReleaseNotes veya kart bileşimi | Üç gerçek yenilik; sürüm statüsü doğrulanır. Tarihsel2026kaydı yeni yıl diye güncel ilan edilmez | Gerçek metinler ve mevcut `/products` hedefi; değişiklik önerisi ayrı |

Hero, çözüm düzeni ve ortaklık duyurusu için paket tek başına hazır sayfa sunmuyor; temel bileşenlerle sayfa bileşimi gerekecek. Bu durum yeni ürün veya yeni içerik üretme ihtiyacı değildir.

### Demo davranışı ve veri sözleşmesi için iki kritik sınır

`ui_kits/website/ProductsScreen.jsx` rol seçimine göre ürünleri filtreliyor. Kabul edilen ana sayfada altı ürün görünür kalır; yalnız vurgu/ilgili açıklama değişir. RoleSelector bileşeni kullanılabilir, bu demo ekranının filtreleme mantığı taşınmaz.

`data/content-model.ts` demo sözleşmesidir: stratejideki licenseModel, ayrı SourceRevision, çelişkili/önkoşullu kapsam ve Service–ServiceChannel ilişkileri tam karşılanmıyor. Cta.kind quote/trial ile sınırlı; eğitim, öğrenci ve mevcut müşteri yollarının nihai modeli değildir. Proje içerik/form sözleşmeleri esas alınır. ResourceCard PDF/video etiketli kaynaklar için adaydır; sıradan ürün/çözüm veya portal bağlantısını yanlış kaynak türüne zorlamak yerine Card/Link kullanılır.

## Global kabuk

| Parça | Kaynak / uygunluk | Tasarım öncesi yapılacak iş |
|---|---|---|
| Header | `components/navigation/SiteHeader.jsx`: düz navItems + actions, mobil disclosure, Escape ile kapanma | Mevcut çok seviyeli Çözümler/Ürünler, arama, tema seçimi ve yardımcı Eğitim/Destek için genişletme planı. Mobilde menü sırası ve odak dönüşü korunur |
| Footer | SiteFooter + BrandLogo | Tam ürün/çözüm linkleri, üç telefon, adres, sosyal/yasal hedefler ve krediyle besle; demo sütunları içerik kabulü değildir |
| Breadcrumb | Breadcrumb | URL/hiyerarşi kayıtlarından gelir; CSS veya görünen etiket kimlik kaynağı olmaz |
| Logo | BrandLogo | Beyaz varyant koyu yüzeyde. Paket/geometri ve kullanıcı orijinali arasındaki önceki eşlik belirsizliği kapanmadan orijinal dosya koruması tamamlandı denmez |
| Eylemler | Button, IconButton, CtaGroup | Teklif/deneme önceliği açık; disabled/loading/focus ve dış bağlantı açıklaması. DemoCTA hedefleri taşınmaz |
| Form alanları | Input, Select, Checkbox; Dialog gerekirse | Alan sözleşmesiyle eşleştirilir; niyet girişleri, çoklu ürün/modül ve hata durumları ayrı kompozisyon ister. Paket alan bileşeni teslimat altyapısı değildir |

Header'ın düz bağlantı olması hata değil, mevcut site ihtiyaçlarına göre kapsam açığıdır. `SiteHeader` kaynakta client boundary taşır; eski “hiç client boundary yok” notu güncel pakete genellenmez. Next.js uyarlamasında etkileşimli adalar ve sunucuda içerik üretimi ayrıca planlanır; global ALU/Babel/CDN demo çalışma düzeni üretime kopyalanmaz.

## Token sözleşmesi

Görsel kaynak zinciri: `tokens/tokens.json` → primitive → semantic → component aliases → bileşen CSS. Üretilmiş CSS elle yamalanmaz. Antrasit delta ve breakpoint üretimi aynı kaynaktan yeniden üretilebilir olmalı.

Başlıca yüzey ilişkileri: `surface-brand` → header/footer; `surface-default` → kart/input; `surface-raised` → üst yüzey/dialog; `text-primary`, `text-secondary`, `border-default` → ortak kontrast. `site-header-bg`, `site-footer-bg`, `card-bg` alias'ları aynı semantik zinciri izler. Sadece body arka planını değiştirmek kabul değildir.

İçerik verisinde renk/sütun sayısı tutulmaz; sayfa bileşiminde ürün/rol/hizmet referansları bulunur. Şablon sırası ve davranış değişiklikleri token kapsamı dışında kalır. Font ailesi tokenı yeni font dosyasını kendiliğinden sağlamaz; Türkçe karakter/font yükü ve lisans kaydı ayrıca kontrol edilir. Wireframe'in küçük `tokens.css` dosyası nihai design system yerine kullanılmaz.

## İçerik ve schema sınırı

Bileşenler görünür metin, medya, eylem ve kararlı kimlik alır; edition/release/market/licenseModel/sourceRevision ilişkileri içerik modelinde kalır. Fiyat/yorum eklenmez; eğitim video listesi hizmetle aynı ana varlık yapılmaz. Schema adaptörü UI kit'ten veya tema tokenlarından türetilmez. Bu çalışma mevcut schema planını değiştirmez ve yeni Google uygunluğu iddiası taşımaz.

PackageComparison bilinmeyeni hariçten ayırıyor; mevcut varsayılan durumları included/excluded/optional/unknown. Aluplan'ın önkoşullu/çelişkili kaynak bilgisi gerektiğinde `states`/not sunumu uyarlanmalı, yeni ticari sonuç çıkarılmamalı. Paket tablosunun çalışması TR lisans kapsamının doğrulandığını göstermez.

## Hazırlık ve doğrulama sırası

1. **Paket temeli:** onaylı antrasit delta, üretim drift'i ve logo kaynağını çözümleyip hangi dosyaların taşınacağını sabitle. İndirilen orijinali koru.
2. **Kabuk ve temel bileşenler:** header/footer, tipografi, butonlar, yüzeyler; açık/koyu ve mobil/klavye durumları.
3. **İçerikle blok kompozisyonu:** H01–H08, mevcut başlık/medya/hedeflerle; 20hizmeti koru. Yeni referans bloğu eklenmez.
4. **Kabul:** 320/360px ve geniş ekran, büyük metin, klavye, rol radyo grubu, mobil menü Escape/odak, video hareket azaltma, uzun Türkçe etiketler.
5. **Katman bağımsızlığı:** yalnız tema değiştiğinde DOM metni, href, içerik kimlikleri ve gelecekteki JSON-LD aynı kalmalı; geometri/logo oranı ve odak görünürlüğü ayrıca incelenmeli.

Bu listedeki gelecek testler çalıştırılmış değildir. Bu tur kanıtı kaynak okuma ve belge eşlemesidir; yeni UI veya performans/erişilebilirlik kabulü yok.

## Sonuç ve sonraki somut çıktı

Temel bileşenler kullanılabilir aday; header, hero, hizmet düzeni ve içerik bağlama doğrudan kopyalanabilir bitmiş çözüm değildir. Eksik teknik kararların sorumluluğu proje ekibindedir; kullanıcıdan 20kartı tekrar tek tek denetlemesi istenmez.

Önerilen sonraki çıktı: **ayrı görsel önizlemede önce header + hero + rol/ürün + hizmetler** üzerinde gerçek tasarım sistemini denemek; kalan blokları aynı dilde tamamlamak. Bu plan bir sonraki çalışma için öneridir; burada önizleme veya uygulama değiştirilmedi. Deneme lead zorunluluğu, ticari iddialar ve paket kapsamı kararları açık kalır; görsel çalışmada yeni vaat üretilmez.
