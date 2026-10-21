# İki gerçek içerik üzerinde değişiklik kaydı taslağı

21.10.2026 · Kaynak uygulama salt-okunur incelendi; canlı site bu tur yeniden taranmadı. Önceki 19/21 Ekim tarayıcı/HTML kanıtları kullanıldı. Yalnız öneri metinleri. Mevcut siteye, kaynak uygulamaya ve form hedeflerine uygulanmadı. Kaynak metinler silinmedi veya kısaltılmadı; aşağıdaki alıntılar tek tek incelenen atomik alanlardır, tam sayfanın yerine geçmez.

## Örnek 1 — Ultimate / SCIA ilişkisi

| Alan | Kayıt |
|---|---|
| changeId | ultimate-scia-entitlement-review |
| Mevcut URL | https://aluplan.com.tr/products/allplan-ultimate |
| Mevcut ifade A | “SCIA Concept ile yapısal analiz*” |
| Mevcut ifade B | “ALLPLAN Ultimate Aboneliğine Dahil Olarak: Scia Concept” |
| Kaynak konumu | `app/products/allplan-ultimate/page.tsx:160,216`; 21 Ekim W07 canlı HTML gözlemi |
| Karşılaştırma dayanağı | P1 s.1 SCIA Concept satırı Ultimate yıldız: yalnız abonelik; P2 s.1 SCIA bölümü bulunmuyor. [Kanıt tablosu K04](package-comparison-decisions.md) |
| Çelişki | Kaynak revizyonları arasında kapsam açıklaması farklı; yeni belgede satır bulunmaması ticari hakkın kaldırıldığına kanıt değil |
| Kayıt modeli | Ultimate edition → SCIA ürününe ilişkin ScopeClaim; release=2026, sourceRevision=P1/P2 ayrı; TR kapsamı ve ticari yürürlük doğrulama bekliyor |
| Durum | disputed; öneri taslak; yayın onayı yok |

**Bilgi mimarisi önerisi:** SCIA'yı ALLPLAN'ın yerleşik tek bir özelliği gibi değil, koşullu ilişkili uygulama/hak olarak sunmak. Bu ayrımı proje ekibi belirleyebilir; dahil olma koşulunu kanıtsız belirleyemez.

**Doğrulama beklerken değerlendirilecek metin önerisi:** “SCIA Engineer Concept kapsamı için Türkiye lisans koşullarını Aluplan ile doğrulayın.”

Bu cümle mevcut dahil olma taahhüdünü kendiliğinden kaldırmak için uygulanmaz. Doğrulanmış güncel belge gelirse kesin metin edition/sürüm/bölge/lisans/süre kapsamını açıkça ifade eder. Bir yıldız veya PDF eksikliği üzerinden “artık dahil değil” yazılmaz.

**CTA:** Mevcut SCIA karşılaştırma bağlantısı ve diğer mevcut teklif/deneme hedefleri korunur. Yeni form veya URL önerilmedi.

**Karar sorumluluğu:** İçerik sınıflandırması proje ekibinde; ticari hakkı Aluplan/üretici doğrular. Kabul: görünür metin, karşılaştırma ve kaynak koşulları çelişmemeli; onay öncesi schema'ya kesin dahil olma ilişkisi yazılmamalı.

## Örnek 2 — Profesyonel Hizmetler / Eğitim girişi

| Alan | Kayıt |
|---|---|
| changeId | professional-services-training-entry |
| Mevcut konum | Ana sayfa `/#professional-services` → Hizmetler → Eğitim |
| Mevcut açıklama | “Online ve yüz yüze profesyonel ALLPLAN eğitimleri ile uzmanlaşın.” |
| Mevcut CTA | “Eğitim Takvimi” |
| Kaynakta tanımlanan hedef | services veri öğesinde `/contact` |
| Render edilen gerçek hedef | `resolvedHref` özel koşulu ile `/solutions-v2/training` |
| Kanıt | `components/homepage-v2/ServicesV2.tsx`, services Eğitim öğesi ve renderGrid resolvedHref; mevcut browser-home kayıtları |
| Hedef sayfa kanıtı | Eğitim kaynağında Temel/İleri Seviye/Özel/BIM başlıkları; “Özel Konularda Derin Bilgi!” ifadesi. Bu, kuruma özel eğitim paketinin tüm ticari koşullarını kanıtlamaz |
| Sorun | CTA takvim vaat ediyor; hedef eğitim ana sayfası. Bunun kullanıcıyı yanlış yönlendirdiği görev testiyle ölçülmedi; isim/hedef beklentisi farklılığı var |
| Kayıt modeli | Service(training) → EntryPoint(home-training); PageComposition(training landing). Takvim, konu bazlı eğitim ve kuruma özel hizmet ayrı ilişkilerle tanımlanmalı |
| Durum | observed; anlatım önerisi proposed; kaynakta değişiklik yok |

**Önerilen CTA metni:** “Eğitimleri İncele”. **Hedef önerisi:** mevcut `/solutions-v2/training` aynen korunur. Açıklama bu örnekte aynen kalır; henüz hizmet taahhüdü değiştirilmez.

**Özelleştirilmiş eğitim için ayrı görev:** Eğitim sayfası kullanıcının genel eğitim mi, konuya özel eğitim mi, kurum ihtiyacına göre çalışma mı aradığını ayırabilmeli. Yeni “kuruma özel” paket adı, süre, ücret, sertifika veya takvim uydurulmaz. Kullanıcının hizmetin stratejik önemine dair notu kayıtlıdır; mevcut sayfa kapsamının tamamı ve ticari koşullar ayrıca doğrulanacak.

**Karar sorumluluğu:** CTA'nın hedefi doğru anlatması ve kayıt/yerleşim modeli proje ekibi kararıdır. Eğitim biçimi, kuruma özel program, takvim ve taahhütler Aluplan doğrulaması gerektirir.

**Kabul:** Eğitim kartı aynı hedefe gider; kullanıcı karttan eğitim seçeneklerine, varsa doğrulanmış takvim/kuruma özel talep yoluna ulaşabilir. Mobil/klavye ile üç hizmet sekmesinin erişimi ayrı test edilir. Form gönderimi, eğitim rezervasyonu veya kişisel veri girişi yapılmaz.

## Uygulama öncesi ortak kontrol

Her örnekte orijinal metin/CTA/hedef referansı korunacak; değişiklik listesi ayrı gözden geçirilecek. Ticari doğrulama bekleyen alan otomatik yayına alınmayacak. Bu çalışma iki içerik atomunu sınar; tam sayfa taşıması veya tüm hizmet alanının optimizasyonu tamamlanmış değildir.
