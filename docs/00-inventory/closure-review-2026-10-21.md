# Faz 0 kapanış kontrolü — 21.10.2026

Durum: **Kısmi kapanış; Faz 0 tamamlanmadı.** Bu çalışma tasarım sistemi beklenirken kullanıcı onayıyla yapılan envanter doğrulaması ve strateji hazırlığıdır. Kaynak uygulama değişmedi, yeni siteye entegrasyon yapılmadı.

## Yeni erişim kanıtı

19 Ekim HTML envanterindeki linkler fragmentleri ayrılarak tekilleştirildi. 180 HTTP(S) hedefinde HEAD kontrolü: 151 HTTP 200, 2 HTTP 308, 7 HTTP 404, 11 HTTP 403, 3 HTTP 405, 6 bağlantı hatası/zaman aşımı. Bu sayı tüm internet bağlantılarının veya tüm istemci durumlarının eksiksiz tarandığı anlamına gelmez. Teams toplantı ve SharePoint erişim bağlantıları otomatik çağrılmadı; mailto/tel ve form gönderimleri yapılmadı.

Kanıt: `link-recheck-2026-10-21.json`. Dosya kaynak sayfayı, etiketi, konumu, HTTP sonucunu ve seçili hedefler için GET doğrulamasını tutar. 403/405 ve bağlantı hataları kırık link olarak sınıflandırılmaz. Özellikle ana Forms hedefi HEAD 405 dönerken tarayıcıda açıldı.

GET ile de 404 görülen dahili hedefler: `/allplan-2026nin-ozellikleri`, `/solutions-v2`, `/solutions/bimplus`, `/try-free`. Bunlara yeni hedef otomatik atanmadı. `/cdn-cgi/l/email-protection` ayrı altyapı/koruma bağlantısıdır; normal içerik sayfası gibi taşınmaz ve e-posta çözümlemesi ayrıca doğrulanır. Bir harici logo URL'si ve YouTube @AllplanInternational hedefi de GET 404 verdi; harici erişim sonuçları tek ölçüm anıdır.

308 yanıtları `/solutions/industry` → `/solutions/steel` ve `/allplan-2021-features/` → `/allplan-2021-features` yönlerini bildiriyor. Eski parite dosyasındaki yol/yönlendirme ayrımı korunur; bu kontrol 301 değişikliği önermez.

## Fragment kontrolü

112 hedef sayfanın ilk HTML'si 200 ile okundu; 123 benzersiz sayfa/fragment çiftinden 118'i id/name ile eşleşti. Kalan beşi `/solutions-v2/training/quick-start` üzerindeki `introduction `, `pro-tips `, `interface `, `modules ` ve `features-2026 ` değerleri: envanterde href sonunda boşluk var. Bu, ham öznitelik eşleşme bulgusudur; tarayıcının URL boşluk normalizasyonu ve kaydırma davranışı kontrol edilmeden kırık link denmez. Kanıt: `fragment-recheck-2026-10-21.json`. İstemciyle sonradan oluşan hedefler bu yöntemle tam kapsanmaz.

## Dosya eşliği — kapatılan alt kapsam

Altı PDF canlıdan GET ile okundu; SHA-256 eşliği hem mevcut envanterle hem 21 Ekim salt-okunur kaynak dosya baytlarıyla doğrulandı. Dosyalar diske yeniden indirilmedi; karşılaştırma bellekte yapıldı.

| Canlı dosya | Yerel eşleşme | Sonuç |
|---|---|---|
| Hashli ax3000-brochure-de PDF | assets/documents/ax3000/ax3000-brochure-de.pdf | Tam bayt eşliği |
| Hashli ax3000-brochure-en-alternative PDF | assets/documents/ax3000/ax3000-brochure-en-alternative.pdf | Tam bayt eşliği |
| Hashli ax3000-brochure-en PDF | assets/documents/ax3000/ax3000-brochure-en.pdf | Tam bayt eşliği |
| Hashli ax3000-functions-en PDF | assets/documents/ax3000/ax3000-functions-en.pdf | Tam bayt eşliği |
| /docs/V2026_Paket_Karsilastirma-Q4-2025_R01.pdf | public/docs/V2026_Paket_Karsilastirma-Q4-2025_R01.pdf | Tam bayt eşliği |
| /docs/V2026_paket-karsilastirme-Q3-2026_R01.pdf | public/docs/V2026_paket-karsilastirme-Q3-2026_R01.pdf | Tam bayt eşliği |

Tam URL/hash/byte ve diğer eş kopyalar JSON kanıtındadır. PDF'nin erişilebilir ve aynı olması paket kapsamının güncelliğini veya ticari doğruluğunu kanıtlamaz. PDF içerik tablosu henüz karşılaştırılmadı.

## Yalnız yerel adayları için düzeltilmiş karar listesi

Eski `local-only-review.json` ham aday listesidir; tek başına taşıma/silme kararı verdirmez.

| Aday | Kanıt ve sınıflandırma | Karar ihtiyacı |
|---|---|---|
| /solutions/industry | Canlı yönlendirme; yalnız yerel sayfa sayılmaz | Mevcut yönlendirmeyi koru |
| video-library/[playlistId] | Dinamik şablon; 19 Ekim paritesinde 14 somut canlı yol var | Şablonu hatalı URL diye eleme |
| AX3000_For Hazar içindeki 4 PDF | Canlı hashli PDF'lerle aynı baytlar | Yeni/yalnız yerel içerik sayma; kaynak kopyalarını silme |
| AX3000_For Hazar/Function description_EN.docx | Bu turda canlı eşliği doğrulanmadı | Yayınlanacak kaynak belge mi, çalışma dosyası mı? Açık |
| AX3000_For Hazar/Function description_Hexagon 22-10-20_final.docx | Bu turda canlı eşliği doğrulanmadı | Yayın/izin/amaç kararı açık |
| 1337 live-versiyon snapshot varlığı | Arşiv envanteri; bazı baytlar canlı dosyayla aynı | Arşivin tamamını yeni içerik sayma; toplu taşıma/silme yok |
| Diğer eşlenmemiş kaynak varlıkları | live_pages_exact eksikliği kullanılmama kanıtı değil | Import zinciri ve canlı bayt eşliği tamamlanmalı |

## Form ve bilgi mimarisi

Ana teklif formunun ALLPLAN dalı tarayıcıda 1→2→3→13 yolu ile incelendi. Zorunlu alanlar, seçenekler ve sınırlar `form-observation-2026-10-21.md` içindedir. Kişisel bilgi girilmedi; gönderim yok. ALLPLAN dalında diğer markaların ürünlerinin görünmesi ürün/paket sınıflandırması için açık bulgudur.

İlk ALLPLAN ilişki tablosu: `../allplan-content-mapping.md`. Kalıcı ürün, paket, yıllık sürüm ve revizyonlu dosyalar ayrı kayıtlar olarak önerilir; URL'ler değişmez. Bu çalışma mevcut metinlerin yerine geçmez.

## Kalan kapanış işleri

- Tüm alt sayfa sekme/akordeon/video/modal ve mobil durumlarını render edilmiş içerikle eşlemek.
- Diğer form dalları, son sayfa ve doğrulama kurallarını kişisel veri/gönderim olmadan tamamlamak.
- Kalan medya/import zincirlerini ve hashli dosyaları kesin eşlemek; bu tur yalnız altı PDF kapandı.
- Harici erişim engellerini gerçek tarayıcıyla hedef bazında değerlendirmek; erişilebilirliği dönüşüm tamamlanması saymamak.
- HTML fragment kontrolünü istemci durumlarıyla tamamlamak; başarısız GET veya ilk HTML'de bulunmama kırık anchor kanıtı değildir.
- Paket PDF içeriğini, üçlü/altılı paket listelerini ve yıllık sürüm metinlerinin örtüşmesini ürün sorumlusuyla doğrulamak.

Bu kalan maddeler kapanmadan Faz 1'e geçilmez. Tasarım paketi veya bu dokümanların varlığı üretim kabulü değildir.

21.10.2026 ek doğrulama: Q3 PDF adındaki `karsilastirma` yazımı rapor aktarım hatasıydı; doğru `karsilastirme` hedefi 200, hatalı yazım 404. Canlı URL değişikliği değildir. Güncel paket/PDF ve canlı CTA değerlendirmesi: [karar tablosu](../package-comparison-decisions.md).
