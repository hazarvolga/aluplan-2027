# S05 — Kaynak, veri ve gösterim denetimi

26.10.2026. Durum: **ilk denetim raporu hazır; içerik kabulü tamamlanmadı.** Bu adım uygulama içeriğini, schema veya tasarımı değiştirmez. Kaynak snapshotları S01'de güncel 2026 dosyalarıyla 161/161 bayt eşit bulunmuştu; 2026 uygulaması çalıştırılmadı.

## Kanıt kapsamı

- S04 üretim derlemesinde 110 veri rotasının tamamı yerel HTTP 200; hepsinde tek H1. 0 erişim hatası, 0 yönlendirme. `render-audit.json` istenen/son adresleri ve HTML hashlerini içerir.
- Script/style/RSC yükleri metin karşılaştırmasına dahil edilmedi. 16 rotada 303 uzun yapısal metin kaydı ilk HTML'de bulunmadı. **303 kanıtlanmış içerik kaybı değildir.** Aynı metin farklı alanlarda tekrarlanabilir; sekme içerikleri sonradan görünür olabilir.
- Veri kaydı veya public dosyası olmayan yerel anchor hedefi bulunmadı. Bu; fragment, onclick, harici hedef veya bütün tarihsel URL'lerin kontrol edildiği anlamına gelmez.
- Altı isimli yapısal bölümde boş items listesi bulundu: Basic, Concept, Professional, Civil bulut bölümleri; Geometry Tools ve Steel Components video galerileri. İlk dört bölümde kaynak çıkarım hatası var; son iki galeri için kaynak teyidi hâlâ gerekli.
- Canlı Professional ve Contact doğrudan GET ile ayrıca kontrol edildi; sonuçlar `targeted-live-check.json` içinde. Site genelinde canlı tarama yapılmadı.

## Doğrulanmış açıklar ve düzeltme sırası

Kaynak yolları aksi belirtilmedikçe `docs/00-inventory/interaction-source-evidence/` altındadır.

| Kimlik / önem | Bulgu ve kanıt | Önerilen düzeltme / sorumlu | Karar |
| --- | --- | --- | --- |
| C01 / yüksek | `components/sections/CloudServicesSection.tsx:31` defaultCloudServices, `:44` civilCloudServices tanımlar. `scripts/extract_structured_pages.py:225` yanlış defaultServices/civilServices adlarını arar; dört ürünün bulut listeleri boş. Professional kaynak `app/products/allplan-professional/page.tsx:222` bileşeni kullanır; canlı Professional da bölümü içerir. Varsayılan 9 kart ve 3 video yapısal gösterimden eksik. | Çıkarıcı adlarını düzelt; iki dizinin kart/metin/video eşliğini test et; dört rotayı yeniden üret ve tarayıcıda doğrula. Teknik ekip. | Kaynaktan birebir geri yükleme; yeni ticari karar gerektirmez. |
| C02 / yüksek | `app/solutions-v2/training/page.tsx:67`–125 varsayılan dışı Temel, İleri Seviye, Özel ve BIM sekmelerini içerir. ALLPLAN Dünyasına Giriş!, ALLPLAN Uzmanı Olma Yolunda!, Özel Konularda Derin Bilgi!, BIM Üzerine Uzmanlık! başlık/açıklamaları güncel veride yok. interactiveStates boş, structuredLayout null. | Tüm kaynak sekmelerini çıkar; gösterimini ve hedeflerini doğrula. Teknik ekip. | Kullanıcının onayladığı ana ad Eğitim korunur; yeni ücretli eğitim/takvim vaadi üretilmez. |
| C03 / orta | Yenilikler kaynak `app/products/allplan-2026-yenilikler/page.tsx:736`–740 iki uzun genel bakış paragrafı içerir. Flat sections içinde var, structured intro'da yok; structured gösterim genel sections'ı atlar. `src/components/sections/SubpageView.tsx` intro gösterimi açıklamaları basmıyor. Hero SEO açıklaması modernizasyon, noktasında kesiliyor. | Genel bakış paragraflarını yapılandırılmış veriye ve gösterime birebir taşı; SEO açıklamasını gövde yerine kullanma sorununu ayrıca çöz. Teknik ekip. | İçeriği kısaltmadan geri yükle. |
| C04 / orta | BIMFlex kaynak `app/solutions/bimflex/page.tsx:191`–194 Aluplan satış ortaklığı cümlesi flat veride korunmuş; parse_bimflex_page yapısal veriye taşımıyor. Hero description da bu cümleyi içermiyor. | Ortaklık cümlesini kaynak konumuna uygun gösterime geri koy. Teknik ekip. | Üretici/distribütör ayrımı korunur; yeni ortaklık iddiası eklenmez. |
| C05 / içerik kararı | Canlı Contact aynı sayfada hem 30 hem 14 gün deneme ifadesi taşıyor; Professional 14 gün içeriyor. Yerelde Contact kaynak gövdesi 30 gün. Canlıda bulunması doğruluğunu kanıtlamaz. | Güncel Türkiye koşulunu Aluplan ürün/satış yetkilisi doğrulasın; sonrasında ilgili tüm metinler birlikte güncellensin. | 26.10.2026 kullanıcı onayı + resmî kaynak: 14 gün. Karar kapandı; 2027 metin düzeltmesi ve regresyon kontrolü bekliyor. |

C01–C04 düzeltildikten sonra kalan rotalar ve etkileşimler incelenmeli; bu tablo başka kayıp bulunmadığı garantisi değildir. Eğitim'deki kaynak Özel sekmesini geri kazanmak, eski ayrı Bireysel & Kurumsal Özel Eğitim sayfasını yeniden oluşturma kararı değildir.

## Etkileşim ve erişilebilirlik

Yerel üretim tarayıcısında Yenilikler sayfasının Gelişmiş Çok Katmanlı Döşeme Yönetimi alt sekmesi ve Engineering (Mühendislik) ana sekmesi açıldı; ilgili açıklama/başlıklar görünür oldu. Böylece ilk HTML karşılaştırmasının bazı kayıtları etkileşim nedeniyle işaretlediği doğrulandı. Bu iki örnek diğer tüm sekmelerin testi değildir. Aynı sayfada role=tabpanel sayısı 0: sekme/panel erişilebilirlik sözleşmesi uygulama kabulünden önce tamamlanmalı. İlk HTML dışında kalan içeriklerin arama motoru erişimi de ayrı SEO kabul maddesidir; kayıp içerikle aynı bulgu sayılmaz.

Yenilikler'in 27 SideImageSection başlığı, 16 bölüm videosu ve genel bakış videosu veride eşleşti. BIMFlex'in 7 modülü ve 6 video kimliği korunmuş. Bu dar olumlu örnekler eksik giriş/ortaklık metinlerini telafi etmez.

## Schema planına etkisi

Bu aşamada yeni Google kuralı doğrulaması veya schema uygulaması yapılmadı. Mevcut plan açısından: kaynakta olup gösterilmeyen kart/metinler schema ile telafi edilmemeli; görünür içerik kabulü tamamlanmadan ilgili özellik ve Eğitim ilişkileri için tamlık iddiası yapılmamalı. Eğitim sekmelerinin geri kazanılması yeni Course/Event üretme veya düzenli takvim varmış gibi modelleme gerekçesi değildir. Deneme süresi çelişkisi çözülmeden süre/koşul eklenmez. Ürün–paket–sürüm kimlikleri ve mevcut schema bu tur değişmedi.

## Kanıtların sınırları ve devam

`historical-text-candidates.json` uzun tarihsel metinlerin güncel JSON'a literal karşılaştırmasıdır; parçalanmış metin, yeniden düzenleme, ortak site kabuğu veya ana sayfa kapsam farkı aday üretebilir. Tek başına içerik kaybı/kabul kararı değildir. `render-audit.json` yeniden çalıştırılabilir yerel HTML taramasıdır:

```sh
python3 scripts/audit_render_parity.py --base-url http://127.0.0.1:3001 --output docs/verification/stabilization-2026-10-26/render-audit.json
```

Önce C01–C04 kaynak sadakati düzeltmeleri, ardından tüm sekme/medya/hedeflerin sistematik kontrolü; en son S05 kabulü. S06 tasarım token refaktörüne henüz geçilmedi. Canlıya push/deploy yapılmadı; pazarlama materyalleri kullanılmadı.


### C05 karar güncellemesi — 26.10.2026

Kullanıcı geçerli deneme süresinin14gün olduğunu teyit etti. https://www.allplan.com/trial-or-subscription/ aynı gün kontrol edildi; sayfa14gün ücretsiz denemeyi açıkça belirtiyor. Dolayısıyla firma yanıtı bekleme şartı kalktı. Önceki tabloda ve kanıtlardaki14/30çelişkisi tarihsel bulgu olarak korunur; yalnız2027uygulama metinleri sonraki düzeltme adımında14güne hizalanır. Schema'ya yeni süre/Offer eklenmedi; fiyat varsayımı yapılmadı.
