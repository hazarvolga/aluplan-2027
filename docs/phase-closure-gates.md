# Tasarım, uygulama ve yayın öncesi kapanış tablosu

22.10.2026 — Belge temelli durum değerlendirmesi. Faz 0 devam ediyor; bu tablo faz geçişi veya uygulama izni değildir. Tarihler kanıtların gözlem tarihidir. D01–D03 için 22 Ekim hedefli kontroller eklendi; bütün site doğrulanmış değildir.

## Nasıl kullanılacak?

**D:** Tasarıma geçmeden kapanır. Mevcut faz sırası korunur: Faz 0 envanter → Faz 1 UX → Faz 2 baseline → Faz 3 PRD onayı → Faz 4 tasarım sistemi → Faz 5 ana sayfa tasarımı → Faz 6 geliştirme. Onaylanan antrasit demo bu sırayı tamamlamış sayılmaz.

**U:** Uygulama başlamadan karar ve sözleşmesi kapanır. Taslak tasarım, bu bilgiyi uydurmadan belirsiz durumunu gösterebilir. **Y:** Yayından önce çalışan uygulama üzerinde kanıtlanır. Bir satırın sonraki eşikte olması, aynı konunun erken analizini ertelemez.

Durumlar: **Açık** = kapanış kanıtı yok; **Kısmi** = bazı kanıtlar var; **Karar kayıtlı** = kavramsal karar var, uygulama kabulü değil. “Biz”: kullanıcı Hazar + proje teknik/içerik ekibi. Sorumlular rol önerisidir; Aluplan adına kişi atanmadı, taahhüt alınmadı. Satırlar tamamlanma yüzdesi üretmek için kullanılmaz.

## Mevcut kabul edilmiş kararlar

- Antrasit koyu tema uygun; açık tema veya tüm marka kılavuzu otomatik onaylanmadı.
- Kalıcı ürün, paket, yıllık sürüm ve dosya revizyonu ayrı; içerik/tema/schema katmanları bağımsız.
- Tek **Eğitim** hizmeti. Teknik Destek için çalışan Teams bağlantısı ve ayrı ticket sistemi var; yeni destek altyapısı kurulmuyor. Ticket alan adı kullanıcı düzeltmesiyle **allplan.net.tr**.
- CMS ertelendi; hedef Next.js. Kesin sürüm ve deployment sözleşmesi uygulama öncesi seçilecek.
- Canlı içerik esas; salt-okunur 2026 korunur. URL/form hedefi değişimi açık fark kararıyla ele alınır; bu tablo bunları değiştirmez.

## D — Tasarım öncesi

| ID / durum | Eksik ve mevcut kanıt | Sorumlu | Bizim alabileceğimiz karar | Kapanış ölçütü |
|---|---|---|---|---|
| D01 Karar kayıtlı (Faz 0 kapandı) | 357 canlı gözlem durumu, 65 aday rota kaynak analizi ve Microsoft Forms 14 bölüm/24 soru yapısı tamamlandı. [E1,E12,E13,E14] | Teknik ekip; içerik değerlendirmesi kullanıcı | Ekran/durum kontrol matrisi tamamlandı; runtime/teslimat testi Y03/Y04'te | Mevcut her sayfa/etkileşimin içerik ve hedef eşlemesi kayıtlı; Faz 0 kullanıcı onayıyla kapatıldı (25.10.2026) |
| D02 Karar kayıtlı (Faz 0 kapandı) | 6 PDF, 503 hashli görsel ve 2 DOCX SHA-256 eşliği doğrulandı; 376 referanssız/arşiv medya yolu koruma altında sınıflandırıldı. [E1,E12,E13,E14] | Teknik ekip + kullanıcı; hak bilgisi Aluplan | Aynı dosyaları tek kayıtta izleme; arşivi güncel içerikten ayırma | Kullanılan dosya–sayfa eşleşmeleri ve arşiv ayrımı kayıtlı; silme yok (25.10.2026) |
| D03 Karar kayıtlı (Onarım ertelendi) | 11 benzersiz 404 yol ve bir eksik #interface hedefi kayıtlı; dört fragment hedefi mevcut. Kullanıcı onarımı erteledi; hedef başına karar açık. [E12] | Teknik ekip + kullanıcı | Kaynak/hedef fark listesi; URL koruma planı | Bilinen hatalar ve karar seçenekleri listeli; onarımın ertelenmesi kayıtlı. Tüm hedef kapsamı ve satır bazında karar izlenir; düzeltme/yayın testi Y01'de |
| D04 Kısmi | 23 URL görev matrisi var; karşılaştırma, PDF erişimi, yıllık yenilik ve kalıcı ürün görevleri ayrıldı. [E2,E3] | İçerik/UX ekibi + kullanıcı | Menüyü ve sayfa görevlerini gerekçelendirme; ALLPLAN'a kavramsal hizalama | Sayfa görev matrisi PRD'ye kabul edilmiş; üçlü/altılı listelerin seçki mi tam katalog mu olduğu açık; mevcut içerik kaybolmuyor |
| D05 Kısmi | Ücretsiz deneme hedefi `https://www.allplan.com/trial-or-subscription/` olarak doğrudan üreticiye bağlandı (14/30 gün çelişkisi kapandı, 25.10.2026). Ticari segment önceliği açık. [E4,E5] | Kullanıcı + UX ekibi; ticari veri Aluplan | Sayfa niyetine göre CTA önceliği önerisi; deneme doğrudan üreticiye, teklif Next.js kısa form sözleşmesine | Ana sayfa, ürün ve hizmet için birincil/ikincil sonraki adım kullanıcıca kabul; ticari öncelik varsayılmıyor |
| D06 Kısmi | Eğitim tek başlık; Teams/ticket mevcut. Hizmet kapsamı ve başlık/hedef tutarlılığı açık. [E6] | İçerik ekibi + kullanıcı; hizmet sorumlusu Aluplan | Eğitim/destek/danışmanlık görev ayrımı; iki destek kanalı için açık etiketler | Hizmet girişlerinin görevleri/korunacak metinleri belirli; bilinmeyen kapsam U03'e taşınmış; ayrı özel eğitim hizmeti icat edilmiyor |
| D07 Karar kayıtlı (Antrasit Design System) | Kullanıcı Antrasit tasarım sistemi üzerinden ilerlenmesini onayladı (25.10.2026); `design-system/` altında 188/188 kontrast doğrulamalı token, bileşen, WOFF2 font ve logo yapısı kuruldu. [E7,E8] | Kullanıcı + tasarım/teknik ekip; üretici hakları Aluplan | Antrasit token paleti, mevcut geometrinin korunması ve güvenli logo kaynak seçimi | Kullanılacak logo dosyası ve türetme kaydı belirli; font/görsel yön kabul edilmiş; üretici varlık izin belirsizlikleri listeli (Y06) |
| D08 Karar kayıtlı (Faz 1–2 tamamlandı) | Faz 1 UX (`docs/ux-audit.md`) ve Faz 2 teknik baseline (`docs/baseline-report.md`) 25.10.2026'da kullanıcı onayıyla tamamlandı. [E9] | UX + teknik ekip | Görev bazlı UX bulguları, performans/erişilebilirlik/SEO öncelikleri | Mevcut site ölçümü ve ekran bulguları tarih/araç/yöntemle kayıtlı; ölçülmeyenler açık, yeni tasarımın hedefleri tanımlı |
| D09 Karar kayıtlı (Faz 3–4 onaylandı, Faz 5 hazır) | `docs/PRD.md` (Faz 3) ve `design-system/` (Faz 4) 25.10.2026'da kullanıcı tarafından onaylandı; Faz 5 ana sayfa tasarımı (`docs/homepage-design-proposal.md` + `design-system/ui_kits/homepage/`) sunuldu. [E9] | Proje ekibi hazırlığı; kullanıcı kabulü | D01–D08 sonuçlarını kapsam, kabul, risk ve fazlara dönüştürme | Faz 0/1/2/3/4 çıktıları kullanıcı onayıyla tamamlandı; Faz 5 kullanıcı onayını bekliyor |

**D04 için sınır:** SCIA gibi doğrulanmamış lisans hakkını çözmeden sayfanın işlevini tasarlayabiliriz. Ancak bunun nasıl gösterileceği belirli olmalı; kaynak metin sessizce silinmez, uydurma kesinlikle doldurulmaz. Ticari karar U02/Y05'te ayrı izlenir.

## U — Uygulama öncesi

| ID / durum | Eksik ve mevcut kanıt | Sorumlu | Bizim alabileceğimiz karar | Kapanış ölçütü |
|---|---|---|---|---|
| U01 Kısmi | Prototip Next.js uygulaması değil. Paket drift'i önizlemede build ile giderildi; tam bileşen kabulü yok. [E7] | Teknik ekip | Kararlı desteklenen Next.js sürümü, paket yöneticisi, SSR/client sınırları, token üretim zinciri | PRD onaylı stack ve bağımlılık kararı; taşınacak/taşınmayacak prototip listesi; klavye/dialog/dar ekran kontrol planı ve kritik kusurların kapatılması |
| U02 Kısmi | Edition/bundle sınıfı, TR lisans ve kaynak revizyonları çelişkili. [E3,E10] | İçerik mimarisi biz; lisans gerçeği Aluplan/üretici | ScopeClaim boyutları, unknown/disputed yönetimi ve kaynak önceliği | Veri sözleşmesi çelişkileri kayıpsız taşıyor; her belirsiz iddia sahibine atanmış; yayımlanacak kesin kapsam için kanıt gerekiyor |
| U03 Açık | Eğitim konusu/formatı/ücreti/sertifika ve destek SLA koşulları tam doğrulanmış değil. [E6] | Aluplan eğitim/destek sorumlusu; editoryal çerçeve biz | Bilinmeyen alanları boş/unknown tutma; mevcut kanalları kullanma | Hangi alanların yayınlanacağı ve veri kaynağı belirli; fiyat/süre/SLA zorunlu değil, doğrulanmamış vaat yayımlanmayacak |
| U04 Kısmi | Eğitim ContactModal kaynağı gönderimi simüle ediyor; Forms satış formu ayrı. [E6] | Teknik ekip + Aluplan operasyon | Mevcut hedefi koruma veya alternatif form için somut seçenek ve maliyet önerisi | Her formun gerçek teslim hedefi, sorumlusu ve hata davranışı kabul edilmiş; URL değişikliği varsa kullanıcı kararı. Çalışan teslimat kanıtı Y03'te |
| U05 Kısmi — schema | Entity @id ve sayfa bazında son tür seçimi henüz PRD'de değil. [E10,E11] | Teknik/içerik ekibi | Tek kimlik kayıt sistemi; sayfa–varlık ayrımı; ProductGroup'u otomatik kullanmama | Her pilot sayfa için mainEntity/about/provider ilişkisi ve schema alan kaynağı belirli; global layout'ta alakasız ürün verisi yok |
| U06 Karar kayıtlı — schema | Tek Eğitim Service; tek Destek ve iki ServiceChannel. allplan.net.tr → /tr herkese açık giriş sayfası doğrulandı; oturum açma ve müşteri akışı test edilmedi. [E6,E10,E12] | Teknik ekip + kullanıcı; kanal işleyişi Aluplan | İç relatedProductRefs/applicableReleaseRefs; gerçek kanal hedefini ilişkilendirme | Doğru müşteri URL'si kontrol edilmiş; özel ticket/CRM verisi schema'ya girmiyor; sürüm/hizmet hakkı varsayılmıyor |
| U07 Kısmi — schema | Fiyat/review kanıtı yok; Google yazılım/ürün rich result koşulları sağlanmış sayılmaz. Türkçe Eğitim için Course list hedefi uygun değil. [E10] | Teknik/içerik ekibi; ticari veri Aluplan | Rich result hedefini bekletip doğrulanmış temel semantik model seçme | Her sayfa için hedeflenen/ertelenen Google sonucu ve eksik gerekçesi kayıtlı; sırf test geçsin diye fiyat=0/puan/kurs oluşturulmuyor |
| U08 Açık | Ölçüm, dağıtım, bakım ve rollback planı PRD'ye bağlanmadı. [E5,E9] | Teknik ekip + kullanıcı; operasyon Aluplan | Düşük maliyetli deployment seçenekleri, olay sözlüğü, yıllık güncelleme takvimi | Ortamlar, yayın sorumlusu, içerik sahibi, ölçüm yöntemi ve geri alma planı kabul; sağlayıcı ve kişisel veri işleme varsayılmıyor |

U05–U07 plan kararlarıdır; bu tablo JSON-LD üretmez. Güncel Google şartlarının dayanağı 22.10.2026 tarihli E10'dur; bu tur yeniden internet taraması yapılmadı.

## Y — Yayın öncesi

| ID / durum | Eksik ve mevcut kanıt | Sorumlu | Bizim alabileceğimiz karar | Kapanış ölçütü |
|---|---|---|---|---|
| Y01 Açık | Yeni uygulamada içerik/URL/dosya paritesi henüz test edilemez. [E1,E2] | Teknik ekip + kullanıcı | Parite kontrolü ve onaylı farkların takibi | Sayfa/etkileşim/metin/CTA/dosya eşliği; onaylı redirect ve hedef değişimleri; 404/yetim sayfa ve istemci durumları doğrulanmış |
| Y02 Açık — schema/SEO | /about canonical ve meta sorunları baseline'a taşınacak; uygulama/schema yok. [E9,E10] | Teknik ekip | Sayfa özelinde canonical/meta, doğru schema, güvenli serileştirme | Schema Validator + hedefli Rich Results Test + görünür içerik/HTML eşliği. Login/noindex/crawl kuralları ve sitemap doğru. Search Console URL Inspection yayın sonrası ayrıca izlenir |
| Y03 Açık | Gerçek form gönderimi, teslim ve hata akışları test edilmedi. [E4,E6] | Teknik ekip + Aluplan operasyon | Kontrollü test senaryosu ve sahte başarı engeli | Yetkili testte teslim/kalıcılık, hata ve tekrar davranışı görülmüş; Teams/ticket müşteri girişi doğrulanmış; gerçek müşteri verisi gereksiz kullanılmıyor |
| Y04 Kısmi | Token 28/28, içerik 13/13 ve 188 kontrast kontrolü yalnız prototip için başarılı. [E7] | Teknik/erişilebilirlik ekibi | Risk bazlı tarayıcı, klavye, mobil ve performans test kapsamı | Gerçek site üzerinde kritik yollar, dialog/odak, büyütme, responsive, içerik-tema-schema değişmezliği; baseline hedefleriyle ölçüm. Prototip sonucu site kabulü sayılmaz |
| Y05 Açık | Ticari kapsam, hizmet vaatleri ve schema alanları hâlâ kanıt gerektiriyor. [E3,E6,E10] | Aluplan ürün/hizmet sorumluları; kullanıcı editoryal kabul | Yayınlanacak doğrulanmış metni ve açık fark listesini hazırlama | Çelişkili haklar kesinmiş gibi sunulmuyor; eski metin ile öneri değişimi açıkça kabul edilmiş. Gerçek fiyat/yorum yoksa ilgili rich result kapsam dışı; siteyi sırf bu nedenle bekletme |
| Y06 Açık | Üretici varlık izinleri, hukuki metinler, form/veri/çerez koşulları kapanmadı. [E8,E9] | Aluplan yetkilisi/hukuk; teknik uygulama biz | Dosya bazlı izin kaydı ve asgari veri yaklaşımı | Onaylı varlık/hukuki metin; gerçek altyapıya uygun güvenlik, spam ve veri işleme kontrolleri. Taslak marka kılavuzu izin belgesi değildir |
| Y07 Açık | Yeni site için operasyon/yayın kanıtı yok. [E5,E9] | Teknik ekip + kullanıcı | Yedek, rollback, health/izleme ve ölçüm planını uygulama aşamasında hazırlama | Staging kabulü, geri alma hazırlığı ve açık yayın onayı; yayın sonrası HTTP/kritik yol/schema indeksleme izleme. Yerel commit yayın kanıtı değildir |

## Yetki sınırı

**Biz karar verebiliriz:** sayfa görevleri, kavram ayrımı, token ve veri sözleşmesi, tekrarların tek kaynaktan yönetimi, kanıt toplama sırası, doğrulanmamış rich result hedefini kapsam dışında bırakma ve gerekçeli CTA/etiket önerileri. Son kullanıcı onayları ve faz sınırları korunur.

**Biz doğruluk üretemeyiz:** üretici lisans hakkı, fiyat, TR ticari kapsam, eğitim programı/sertifika, destek SLA'sı, marka kullanım izni veya hukuki onay. Bu bilgiler belirsiz kalırsa tasarımda kanıtsız vaat yerine açık durum tasarlanır; yayındaki metin değiştirilmeden fark kararı alınır.

**Kapanmış sayılmayanlar:** doküman yazılmasıyla işin tamamlanması, kullanıcı ekran görüntüsüyle tüm destek akışının testi, HTTP200 ile form teslimi, token testiyle tam erişilebilirlik, geçerli schema ile Google görünüm garantisi.

## Kanıt dizini

- E1 — [21 Ekim kapanış kontrolü](00-inventory/closure-review-2026-10-21.md); bağlı link/fragment JSON kanıtları. Önceki “PDF henüz karşılaştırılmadı” notu E3 ile tarihsel olarak aşılmıştır.
- E2 — [Sayfa görevleri](page-responsibilities.md), [URL paritesi](00-inventory/url-parity.md).
- E3 — [Paket PDF/web karar tablosu](package-comparison-decisions.md), 21.10.2026.
- E4 — [Form gözlemi](00-inventory/form-observation-2026-10-21.md); yalnız gözlenen ALLPLAN dalı, gönderim yok.
- E5 — [Uzun vadeli strateji](long-term-web-strategy.md); öneriler ve kabul edilen kararlar ayrıdır.
- E6 — [Hizmet matrisi](service-positioning-matrix.md), [hizmet konumlandırması](professional-services-positioning.md), kullanıcı destek kanalı düzeltmeleri.
- E7 — [Yenilenmiş v3 incelemesi](reviews/design-v3-review/README.md), verification.json; antrasit kabulü kullanıcı kararı, 22.10.2026.
- E8 — [Marka kılavuzu](BRAND-GUIDELINES.md); taslak, bütün maddeleri onaylı değil.
- E9 — [HANDOFF](../HANDOFF.md); faz durumu, baseline/canonical ve açık işler.
- E10 — [22 Ekim schema son kontrolü](schema-final-review-2026-10-22.md); resmî kaynak bağlantıları ve uygulama sınırları.
- E11 — [İçerik kayıt sözleşmesi](content-record-contract.md).

- E12 — [22 Ekim hedefli kapanış özeti](00-inventory/closure-review-2026-10-22.md); dinamik durum, medya ve URL kanıtları.

- E13 — [Genişletilmiş kapsam ve teknik sorumluluk](00-inventory/inventory-coverage-2026-10-22.md); tam kaynak snapshotları, medya ve form durum kayıtları.

## Önerilen sıradaki çalışma

Kaynak odaklı ek kontrol tamamlandı; [son kapsam eki](00-inventory/inventory-coverage-2026-10-22.md) ve [karar özeti](00-inventory/inventory-decision-brief-2026-10-22.md) esas alınır. Kaynakta kayıtlı her tekrarı canlıda yeniden açmak envanter şartı değildir. Harici formun görünmeyen8/14bölümleri için yetkili yapı kanıtı veya açık istisna kararı gerekir. D03onarımı ertelenmiştir. Faz geçişi ayrıca değerlendirilir; uygulamaya geçilmedi.

## Son kontrol eki

E14 — [Kaynak kalan kontrolü](00-inventory/remaining-source-checks-2026-10-22.md) ve [global durumlar](00-inventory/global-state-source-review-2026-10-22.md). D01/D02 kaynak kayıt kapsamı genişledi;376medya yolu sınıflandı ve korunuyor. Yukarıdaki ara durumların canlıda her koşulu tekrar açma beklentisi, kullanıcının kaynak odaklı yönlendirmesiyle değişti. Runtime kabulü ayrı kalır; dış Forms içeriği bilinmiyor.

E15 — [Schema envanter etkisi](schema-inventory-impact-2026-10-22.md). Bu ek için Google kuralları yeniden doğrulandı; U05–U07/Y02 değerlendirmesinde önceki raporla birlikte kullanılır. Kod/schema uygulanmadı.
