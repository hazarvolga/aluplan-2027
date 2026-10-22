# Form sözleşmesi schema son kontrolü

22.10.2026 — İncelenen belge: [request-forms-contract.md](request-forms-contract.md), kontrol öncesi commit402806c. `schema` v2.0.0 skilli okundu; Google ve Schema.org birincil belgeleri yeniden açıldı. Bu bir plan incelemesidir, üretilmiş JSON-LD'nin doğrulaması değildir. Kod, canlı içerik veya form değiştirilmedi.

## Sonuç

**Mevcut sözleşmede doğrudan Google kural ihlali saptanmadı.** Fiyat/puan uydurmama, talepleri satın alma saymama ve kişisel yanıtları schema dışında tutma doğru. Ancak aşağıdaki açıklıklar giderilmezse uygulama yanlış schema üretebilir. Zengin sonuç uygunluğu henüz sağlanmış sayılmaz; bu durum şema türünün semantik olarak kullanılamaz olduğu anlamına gelmez.

| ID / sınıf | Sözleşmedeki durum | Risk ve netleştirme |
|---|---|---|
| S01 — Google uygunluk sınırı | Ürün/paket/sürüm ilişkisi iç modelde; ProductGroup yasağı yeni sözleşmede açık tekrarlanmıyor | Google'ın variesBy destek listesi color,size,suggestedAge,suggestedGender,material,pattern. Yazılım yılı/edition bu listede yok. İç editionRefs veya releaseRefs otomatik Google varyant markup'ına çevrilmeyecek; Schema.org'un genel ifade kapasitesiyle Google özelliği karıştırılmayacak [G1] |
| S02 — İç model eksikliği | sourceReleaseRef var; Aluplan BIM2023/2024gibi açık sürüm seçimi için ayrı alan belirtilmemiş | Kaynak sayfanın sürümü kullanıcının tercih ettiği sürüm değildir. Gereken alt yollarda seçim kaydına requestedReleaseRefs eklenebilir; genel satış formunda zorunlu değil. İç referans JSON-LD özelliği değildir. softwareVersion yalnız betimlenen SoftwareApplication'ın gerçek sürümü; site yılı/PDF revizyonu değil [S1] |
| S03 — Sayfa amacı açıklığı | Eğitim sayfası mainEntity→Service ifadesi bütün alt sayfalara okunabilir | Hizmet tanıtımı Service; genel arşiv CollectionPage/ItemList adayı; gerçek tek video sayfası görünür içeriğine göre video. Bunlar ayrı bağlamlar. Her arşive Service mainEntity veya her videoya Course zorlanmaz. about ilgili konuyu, mainEntity sayfanın başlıca varlığını anlatır [G2,S2,S3] |
| S04 — Google uygunluğu henüz yok | Teklif formu var, doğrulanmış fiyat/değerlendirme yok | SoftwareApplication sonucu name+offers.price+review/aggregateRating ister. Product snippet name yanında offers/review/aggregateRating seçeneklerinden en az birini ister. Form bağlantısı bu alanları karşılamaz. İşaretleme doğru olsa bile rich result garantisi yok [G2,G3,G4] |
| S05 — Paket hakkı değil ilgi | Çoklu ürün/paket/modül seçimi korunuyor | Birlikte seçmek bundle/hasVariant/Offer veya lisans kapsamı kanıtı değildir. Her seçim kendi productRef altında kalır; pazar/lisans/sürüm kapsamı kanıtlı içerik modelinde çözülür. Üçüncü taraf ürünler ALLPLAN paketi yapılmaz [G1,G2] |
| S06 — Eğitim semantiği uygun | Tek Eğitim Service, Aluplan provider ve hizmet kanalı | availableChannel→ServiceChannel, providesService→Service, serviceUrl→URL ilişkileri doğru. Google Service için ayrı bir rich result vaadi verilmez. Türkçe genel talep formu, İngilizce Course list koşullarını veya gerçek kurs içeriğini sağlamaz [G5,S4,S5,S6] |
| S07 — Özel veri ayrımı uygun | İletişim ve takip durumları public schema dışında | requestId, quotePurposes, requestedReleaseRefs, CRM durumları iç alanlardır; uydurma schema.org özellikleri olarak yayımlanmaz. Kullanıcı “Eğitim istiyorum” dedi diye CourseInstance/Reservation oluşmaz [G2] |

## Doğru kalan ilişkiler

- Ürün kimliği, edition, yıllık sürüm, belge revizyonu ayrı. Aluplan distribütör/hizmet sağlayıcısı; üretici kimliği ayrıca korunur. Formun yazarı ürün üreticisi değildir.
- Deneme formu indirme/aktivasyon kanıtı değildir. Bedelsiz deneme bağlantısı ücretli lisans için price0gerekçesi olmaz. Doğrulanmış gerçekten ücretsiz ayrı yazılım varsa kendi kapsamıyla ayrıca değerlendirilebilir; genel ücretsiz yazılım yasağı konmuyor.
- Genel form sayfası varsa ContactPage/WebPage adayı; ürün sayfasında modal açılması bütün sayfanın türünü değiştirmez. Modal için sahte canonical/URL oluşturulmaz.
- Aluplan BIM geçmiş sürüm ve öğrenci alt yolları korunur; öğrenci formu Course değildir. Hak/uygunluk, kullanıcının kutu seçmesiyle ispatlanmaz.
- Form alanı/tema değişimi kararlı ürün ve hizmet kimliklerini değiştirmez. Schema yalnız yayımlanmış, doğrulanmış görünür veriden üretilir; özel başvuru verisinden değil.

## Skilldeki kısa özetlere ilişkin düzeltme

Skillin SoftwareApplication için yalnız name/offers özeti Google'ın değerlendirme şartını eksik bırakır. Product için her durumda image+offers zorunlu demesi Product snippet ve merchant listing ayrımını yapmaz. “Only use markup Google supports” ifadesi genel Schema.org semantiğine yasak olarak okunmamalı; Service gibi bir tür geçerli olabilir, ayrı Google zengin sonucu olmayabilir. Bu raporda resmî kılavuzlar esas alındı. Skill dosyası değiştirilmedi.

## Uygulamada kontrol edilecekler

1. Sayfa türü → ana varlık → görünür alan kaynağı eşlemesi; global layout'a alakasız Product veya bütün form seçeneklerini basmama.
2. Seçim/sayfa bağlamı ayrımı; ürün–paket–sürüm referanslarının geçerliliği ve kararlı @id planı.
3. Gerçek form URL'leri belirlendiğinde ServiceChannel erişimi; taranabilir kamu içeriği ile özel teşekkür/takip verisinin ayrımı.
4. Üretilen JSON-LD için Schema.org Validator; hedeflenen Google özellikleri için Rich Results Test; yayın sonrası Search Console. Bu tur üçü de çalıştırılmadı.

Bu bulgular yeni bir ticari kullanıcı kararı gerektirmiyor. Deneme formu zorunluluğu ve operasyon aracı ayrı açık kararlar; schema bunların seçimini zorunlu kılmaz.

## Birincil kaynaklar

- G1 [Google Product variants](https://developers.google.com/search/docs/appearance/structured-data/product-variants) — desteklenen variesBy boyutları.
- G2 [Google genel kurallar](https://developers.google.com/search/docs/appearance/structured-data/sd-policies) — doğruluk, görünür içerik ve sonuç garantisi sınırı.
- G3 [Google SoftwareApplication](https://developers.google.com/search/docs/appearance/structured-data/software-app) — zorunlu alanlar.
- G4 [Google Product snippet](https://developers.google.com/search/docs/appearance/structured-data/product-snippet) — snippet koşulları; merchant listing ile aynı değil.
- G5 [Google Course list](https://developers.google.com/search/docs/appearance/structured-data/course) — İngilizce sonuç ve gerçek kurs koşulları.
- S1 [softwareVersion](https://schema.org/softwareVersion).
- S2 [mainEntity](https://schema.org/mainEntity), S3 [about](https://schema.org/about).
- S4 [availableChannel](https://schema.org/availableChannel), S5 [providesService](https://schema.org/providesService), S6 [provider](https://schema.org/provider).

G1–G5 ve S1 bu tur, S2–S6 aynı gün önceki form planı doğrulamasında açıldı. Yeni kapsam yalnız form sözleşmesi; önceki FAQ/Event/video hükümleri bu tur site genelinde tekrar denetlenmiş sayılmaz.
