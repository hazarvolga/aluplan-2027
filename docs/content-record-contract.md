# İçerik kayıt sözleşmesi — çalışma şablonları

21.10.2026 · Dokümantasyon taslağı. Uygulama şeması, veri dosyası veya site metni değildir. [Sayfa görevleri](page-responsibilities.md) ve [kanıt/karar tablosu](package-comparison-decisions.md) temel alınır.

## Ortak alanlar

| Alan | Kural |
|---|---|
| id / recordType | Kararlı ve benzersiz; görünen başlık veya URL değişince kimlik değişmez |
| displayName | Görünür ad; kaynak yazım hatası ayrıca rawLabel'da korunur |
| sourceReferences | Kaynak URL/dosya, sayfa/satır/bölüm konumu, varsa hash, observedAt ve sourceDate |
| verificationStatus | observed / needs_verification / verified / disputed; gözlemlenmiş olması ticari doğruluğu doğrulamaz |
| decisionStatus | proposed / accepted_for_planning / approved_for_publication; strateji kabulü yayın onayı değildir |
| ownerRole | Önerilen içerik/teknik/ticari sorumluluk; atanmış kişi yoksa unassigned |
| originalContent | Tam metin, CTA, medya ve konum referansı; eski içerik ezilmez |
| relatedIds / pageRefs | İç kayıt ilişkileri ve mevcut sayfalarda kullanım; ilişki yeni URL üretmez |
| changeHistory | Eski değer, yeni öneri, gerekçe, kaynak, karar tarihi ve karar veren |

Bilinmeyen değer açıkça unknown/null olarak tutulur; boş string, sıfır veya false ile yanlış kesinlik oluşturulmaz. Belge tarihi, gözlem tarihi, ticari yürürlük ve web yayın tarihi farklıdır. Kişisel müşteri bilgileri bu katalog kayıtlarına girmez.

## Şablonlar

| Kayıt | Zorunlu kavramsal alanlar | İlişki ve sınır |
|---|---|---|
| Product | id, displayName, producerRef, originalDescription, pageRefs, sources | ALLPLAN ürün kimliği yıllık site adıyla değişmez. Aluplan üretici yapılmaz |
| Edition | id, displayName, productRef, classificationStatus, pageRefs | Basic/Concept gibi kapsam seçeneği. Civil/Precast ticari sınıfı ayrıca doğrulanır; bundle ihtimali korunur |
| Release | id, productRef, releaseLabel, sourceRefs | 2026 bir yazılım sürümü; Q3/R01 katalog revizyonu değil. releaseDate doğrulanmadıysa bilinmiyor |
| Capability | id, displayName, originalDescription, sourceRefs | Özellik adının değişmesi otomatik yeni özellik demek değil; alias ve eski etiket korunur |
| ScopeClaim | id, editionRef, releaseRef, capabilityRef veya relatedProductRef, market, licenseModel, sourceRevisionRef, rawCell, rawFootnote, claimState | Dahil / ücretli seçenek / ön koşullu / kaynakta belirtilmemiş ayrı. Aynı bağlamda çelişen kaynaklar birlikte saklanır; son kayıt eskisini ezmez |
| SourceRevision / Asset | id, sourceUrl, originalFilename, sourceDate, observedAt, hash, locator, language, regionEvidence | Belge revizyonu ve erişim kaydı. Hash dosya eşliği kanıtlar, lisans hakkı veya güncellik değil |
| Service | id, providerRef, serviceType, audience, originalDescription, entryPointRefs, relatedProductRefs, applicableReleaseRefs, channelRefs, termsStatus, sourceRefs | Aluplan eğitim/destek/danışmanlık taahhütleri yazılım özelliklerinden ayrı. SLA, süre, fiyat, sertifika kapsamı kanıt gerektirir |
| ServiceChannel | id, serviceRef, channelType, customerEntryUrl, sourceRefs, verificationStatus | Teams ve ticket aynı Teknik Destek hizmetine erişim yolları; bu iç kayıt yalnız görünür/doğrulanmış alanlarıyla Schema.org ServiceChannel adayıdır |
| Resource / ExternalDestination | id, resourceType, destination, providerStatus, language, applicableReleaseRefs, lastCheckedAt | Üretici portalı, lisans aracı, webinar, rehber ve dosya hizmet taahhüdü gibi modellenmez |
| EntryPoint | id, label, destination, purpose, relatedRecordRef, originalLocation | Aynı hizmete birden fazla giriş olabilir. Mevcut CTA hedefi, kaynakta hesaplanan gerçek hedefle kaydedilir |
| PageComposition | pageId, existingUrl, responsibility, recordRefs, originalBlockRefs | İçeriğin hangi sayfada gösterildiği. Tema tokenı, fiyat ve schema türü bu kaydın pazarlama metnine karıştırılmaz |

## Kapsam ve yayın kuralları

1. ScopeClaim için edition + release + market + licenseModel + capability/relatedProduct + sourceRevision bağlamı saklanır. Ticari yürürlük ancak dayanak varsa eklenir.
2. PDF'de boş hücre veya satır yokluğu “satılmıyor” kararına dönüştürülmez. Kaynak A ve B farklı iddialarsa disputed durumuyla görünür bir karar kaydı açılır.
3. Hizmet sağlayıcı, portal sahibi ve ürün üreticisi farklı rollerdir. Teknik destek kanalı olması kesintisiz hizmet/SLA kanıtı değildir.
4. Kullanıcının 21.10.2026 kararıyla tek Eğitim hizmet kimliği kullanılır; özelleştirme talep bağlamıdır, ayrı hizmet değildir. Seviye/format etiketi otomatik Course oluşturmaz.
5. Kaynakta href ile render edilen hedef farklıysa ikisi de saklanır; migration için kullanıcıya sunulan gerçek hedef esas alınır.
6. Her kaynak dosyası ve metin korunur. Hizalama değişikliği eski→dayanak→öneri→karar zinciriyle değerlendirilir.
7. Tema verisi bu alanları değiştirmez. Schema yalnız görünür, doğrulanmış içerikten ayrı üretim katmanında türetilir; her iç ilişki JSON-LD'ye çevrilmez. İlk sözleşme hazırlanırken Google araştırması yapılmadı; 22.10.2026 doğrulaması bağlantılı son kontrol raporundadır. JSON-LD üretilmedi.

## Şablonun doğrulanacağı senaryolar

- Aynı 2026 için iki PDF revizyonu birlikte tutulabiliyor mu?
- SCIA ilişkisi kaynaktan kaynağa değişirken önceki kayıt kayboluyor mu? Kaybolmamalı.
- Eğitim kartı ve eğitim sayfası aynı hizmete bağlanabiliyor, ama kendi özgün metinleri korunuyor mu?
- “Takvim”, “genel eğitim” ve “kuruma özel eğitim” vaatleri birbirinden ayırt edilebiliyor mu?
- Her dış hedefin sağlayıcısı, erişim amacı ve dil/sürüm sınırı tanımlı mı?
- Yeni tema açıldığında metin, URL, kaynak ve schema kimlikleri değişmeden kalıyor mu?

Bunlar kabul taslağıdır; çalışan yazılım testi değildir. Sonraki adım gerçek içeriklerin bu sözleşmeye tam ve kayıpsız eşlenmesidir.

22.10.2026 son kontrol: [Schema eksik/karar raporu](schema-final-review-2026-10-22.md). İlişki alanları içerik sözleşmesidir; JSON-LD uygulaması değildir.
