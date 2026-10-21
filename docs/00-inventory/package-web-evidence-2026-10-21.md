# Paket web kanıtları — 21.10.2026

## Kapsam ve yöntem

Canlı ana sayfa, `/products/allplan`, `/package-overview`, `/paket-karsilastirma`, `/products/allplan-basic`, `/products/allplan-concept`, `/products/allplan-professional`, `/products/allplan-ultimate`, `/products/civil`, `/products/precast` HTTP GET ile yeniden okundu; on hedef de 200 döndü. İlk HTML'de script/style dışındaki görünür metin düğümleri ve ilgili href değerleri incelendi. Kaynak `../aluplan-2026` salt-okunur kontrol edildi. Form gönderimi, kaynak değişikliği, uygulama veya entegrasyon yok.

Bu belge iki PDF'nin içerik karşılaştırması değildir; PDF çalışmasına bağlanacak web kanıtıdır. Tablodaki kapsam ifadeleri sitenin beyanıdır, üreticinin güncel lisans koşullarının bağımsız teyidi değildir. Kapalı akordeonlar, istemci animasyonları ve tüm etkileşim durumları bu GET incelemesinde kapsanmadı.

## Kaynak ve karar tablosu

| ID | Kaynak / yer | Gözlem | Çelişki veya belirsizlik | Önerilen karar ve yetki |
|---|---|---|---|---|
| W01 | [Ana ürün](https://aluplan.com.tr/products/allplan), Paketler; kaynak `app/products/allplan/page.tsx:25–46` | Ana listede Basic, Professional, Ultimate var | [Ana sayfa](https://aluplan.com.tr/) teknik özellikler ve [PDF giriş sayfası](https://aluplan.com.tr/paket-karsilastirma) altı seçenek içeriyor: Concept, Civil, Precast da var | Tek katalog kaydından tüm yüzeyleri beslemek bizim mimari kararımız olabilir. Hangi seçeneklerin satıldığı ve kesin ticari sınıfı kaynakla teyit edilir |
| W02 | [Paket overview](https://aluplan.com.tr/package-overview), H1 sonrası; `app/package-overview/page.tsx:14` | “İçerik hazırlanıyor...” yer tutucusu var | Paket detaylarındaki “Sürümleri Görüntüle” bu sayfaya gidiyor; çalışan bir karşılaştırma sunmuyor | Kullanıcıya tamamlanmış karşılaştırma yolu sağlamak stratejik öncelik; mevcut URL korunacak. Etiket/bağlantı düzeni uygulama aşamasında ayrı değişiklik olarak kaydedilir |
| W03 | Basic kaynak139, Concept166, Professional191, Ultimate172, Civil226 | Aynı “Sürümleri Görüntüle” etiketi paket karşılaştırması bağlamında kullanılıyor | Yıllık yazılım sürümüyle paket/edition kavramı karışıyor | Sürüm ve paket sözcüklerinin anlamını sözlükte ayırmak bizim editoryal kararımız. Ticari paket adlarını yeniden adlandırmayız |
| W04 | [Ana ürün](https://aluplan.com.tr/products/allplan), Paketler | Basic listesinde “Email destek”; Professional listesinde “Öncelikli destek”; Ultimate listesinde “Öncelikli premium destek”, “Eğitim ve danışmanlık”, “Özel entegrasyonlar” | Yazılım yetenekleri ve Aluplan/üretici hizmet seviyeleri aynı özellik listesinde; hizmet sağlayıcısı, süre, dahil/ek ücret koşulu belirtilmiyor | Ayrı yazılım kapsamı ve yerel hizmet kayıtları kullanmak bizim model kararımız. Hizmet vaatlerinin doğruluğu/süresi Aluplan ticari teyidi gerekir |
| W05 | [Basic](https://aluplan.com.tr/products/allplan-basic), Özellikleri → Arayüzler/Görselleştirme; [ana ürün](https://aluplan.com.tr/products/allplan), Professional kartı | Basic detayında IFC ve render araçları var; ana ürün özetinde IFC/render Professional kartına yazılmış | Özet kartı “yalnız bu pakette” demiyor; doğrudan yokluk çelişkisi ilan edilemez. Fark belirten özelliklerle ortak özellikler ayrılmamış | Ortak ve ayırt edici yetenekleri ayrı göstermek bizim sunum kararımız; PDF satırı + dipnot ile kapsam teyidi gerekir |
| W06 | [Professional](https://aluplan.com.tr/products/allplan-professional), Nedir?; `app/products/allplan-professional/page.tsx:158` | “ALLPLAN Concept plus” ifadesi geçiyor | Altılı katalogda Concept var; ayrı Concept plus paketi yok | Yeni paket kaydı yaratma. Çeviri/ürün adı doğrulaması gereken terim olarak işaretle; üretici dayanağı gelmeden değiştirme |
| W07 | [Ultimate](https://aluplan.com.tr/products/allplan-ultimate), Nedir? ve Yapısal Analiz bölümü; kaynak160,216 | Professional kapsamına ek SCIA Concept iddiası var; ilk yerde yıldız işareti bulunuyor | Ayrı markalı uygulama dahil etme koşulu, ülke, lisans süresi ve yıldızın anlamı açıklanmadan düz özellik gibi yayılmamalı | Ultimate'ı yalnız tek uygulama özellik listesine indirgemeyen paket bileşeni modeli; ticari dahil olma kararı PDF/dipnot/resmî dayanakla |
| W08 | [Civil](https://aluplan.com.tr/products/civil), Nedir? ve “ALLPLAN Civil Aboneliğine Dahil Olarak: SCIA Ultimate”; kaynak210–214,329–334 | Ultimate kapsamına ek köprü analizi/kod kontrolü ve SCIA Ultimate anlatılıyor | Civil ayrı yıllık sürüm değildir; çok ürünlü abonelik/bundle ihtimali var | Ürün ailesi, paket ve ilişkili uygulama ayrı kayıtlar. Bir uygulamanın üreticisi diğerine devredilmez |
| W09 | Basic/Concept/Professional/Ultimate detayları, ALLPLAN Bulut Hizmetleri → Tasarım Kontrolü | 12 aylık Solibri Inside aboneliğinin ALLPLAN aboneliğiyle dahil olduğu ifadesi mevcut | Zaman sınırlı hak, kalıcı yazılım özelliği gibi kaydedilemez. PDF revizyonuna/abonelik koşuluna bağlı olabilir | Hak süresi, koşul ve kaynak revizyonu ayrı alanlar; bütün sürümlere otomatik taşıma yok |
| W10 | Basic/Concept/Professional/Ultimate/Civil detayları → Satın Alınabilir Seçenekler | License Server, ek Bimplus Pro ve bulut depolama seçenekleri ayrı listeleniyor | “Bulut hizmetleri” bölümündeki temel erişimle ek lisans/depolama kapsamı karışabilir | Dahil, ek satın alınabilir ve doğrulanmamış durumlarını birbirinden ayır. Eksik kayıt “yok” değildir |
| W11 | [Precast](https://aluplan.com.tr/products/precast), Özellikler | Structural Precast, Precast Walls ve Precast Slabs sekmeleri var | Diğer paketler gibi tek artan özellik zinciri varsaymak için yeterli kanıt yok; kapalı sekmelerin tamamı görülmedi | Precast iç modüllerini kaynakla doğrulamadan bağımsız satın alınabilir paket veya sürüm diye modelleme |
| W12 | [Paket PDF giriş sayfası](https://aluplan.com.tr/paket-karsilastirma), üst rozet ve indirme | Q3-2026 “güncel/resmî” olarak etiketleniyor; altı ürün kartı var | Başlık iddiası dosyanın üretici tarafından hâlâ güncel olduğunu tek başına kanıtlamaz | Yayınlanan revizyonu kaynak tarihiyle görünür tut; “güncel” işareti doğrulama kaydından beslensin |

## PDF hedefinin güncel yazımı

Bu turda canlı ana sayfanın yedi PDF bağlantısı ve `/paket-karsilastirma` sayfasındaki sekiz PDF bağlantısı şu hedefe gidiyor:

`/docs/V2026_paket-karsilastirme-Q3-2026_R01.pdf`

**`karsilastirme` sonundaki e harfi önemlidir.** Önceki bazı açıklama dokümanlarında `/docs/V2026_paket-karsilastirma-Q3-2026_R01.pdf` biçiminde a ile aktarılmıştı; önceki makine okunur link kanıtı da e hedefini içeriyor. Bu bir aktarım/yazım düzeltmesidir, canlı URL değişikliği kanıtı değildir. Ana incelemede e hedefi GET 200 ve önceki SHA-256 ile aynı; a hedefi 404 olarak doğrulandı. Kaynak karşılıkları: `components/homepage-v2/TechSpecsTable.tsx:65,80`, `app/paket-karsilastirma/page.tsx:16–17`. Mevcut e hedefi korunur.

Basic/Professional üst “Paket Karşılaştırma” bağlantısı `/paket-karsilastirma` hedefine giderken gövdedeki “Sürümleri Görüntüle” `/package-overview` hedefine gidiyor. Dolayısıyla kullanıcı iki farklı karşılaştırma deneyimine ulaşabiliyor.

## 14/30 gün için önceki bulgunun hassaslaştırılması

Canlı `/products/allplan` HTML'sinde ortak CTA **14 gün** diyor; aynı ifade diğer incelenen detay sayfalarında da görüldü. Kaynak `app/products/allplan/page.tsx:56` içinde `ctaDescription` prop'u 30 gün içeriyor; `components/templates/ProductPageTemplate.tsx:134` varsayılanı da 30 gün. Ancak bu turda okunan canlı metinde 30 gün görünmedi. Ortak `components/sections/TrialCTA.tsx:42` 14 gün metnini içeriyor.

Bu nedenle “canlı ana ürün sayfası 30 gün söylüyor” sonucu kullanılmamalı. Doğru bulgu: **kaynakta eski/işlenmeyen 30 gün metni ile canlı 14 gün metni var.** Üreticinin güncel deneme koşulu ayrıca teyit edilmeden ticari politika kararı verilmez.

## Sunuma taşınabilecek sonuç

Kanıtlar yalnız görsel yenileme ihtiyacını değil, aynı ticari bilginin farklı sayfalarda farklı kapsam ve etiketlerle tekrar üretildiğini gösteriyor. Çözüm önerisi: tek doğrulanmış katalog → paket/sürüm/ülke kapsam kayıtları → farklı kullanıcı ihtiyaçlarına göre sunum. Bu önerinin bakım maliyetini azaltacağı bir tasarım gerekçesidir; ölçülmüş tasarruf yüzdesi veya dönüşüm artışı iddiası değildir.

Kapsam doğruluğu, lisans/hizmet taahhütleri ve şartlar ticari kanıt ister. Kayıt modeli, terminoloji ayrımı, karşılaştırma deneyimi ve yıllık güncelleme sürecini biz gerekçeli stratejik karar olarak belirleyebiliriz. Mevcut site metni, linki veya kodu bu belgeyle değiştirilmedi.
