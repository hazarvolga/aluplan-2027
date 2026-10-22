# D02 — Medya ve import eşleştirme kapanış kontrolü

Tarih: 22.10.2026. Durum: **Kısmi doğrulama; D02 bütünü kapanmadı.**

Bu çalışma yalnız kanıt üretir. Kaynak `../aluplan-2026` salt okunur incelendi; dosya taşıma, silme, içerik değiştirme, build, bağımlılık kurulumu veya entegrasyon yapılmadı. Önceki envanterler korunmuştur. Ayrıntılı kayıt: [media-closure-2026-10-22.json](media-closure-2026-10-22.json).

## 1. İki AX3000 DOCX belgesinin durumu netleşti

21 Ekim kapanış incelemesinde canlı eşitliği doğrulanmamış iki belge **canlı sayfada zaten sunuluyor**. Bunları yalnız yerelde bulunan yeni içerik olarak değerlendirmek gerekmez.

| Belge | Kaynak uygulama dosyası | 22 Ekim canlı dosya | Sonuç |
|---|---|---|---|
| MEP Fonksiyon Açıklamaları — Word | `assets/documents/ax3000/ax3000-functions-en.docx` | [DOCX](https://aluplan.com.tr/_next/static/chunks/assets/documents/ax3000/ax3000-functions-en.508479409f5423ec.docx) | HTTP 200; 2.257.537 bayt; kaynakla SHA-256 eşit |
| MEP Fonksiyon Açıklamaları — Hexagon | `assets/documents/ax3000/ax3000-functions-hexagon-en.docx` | [DOCX](https://aluplan.com.tr/_next/static/chunks/assets/documents/ax3000/ax3000-functions-hexagon-en.7fafa1bd61a37026.docx) | HTTP 200; 2.261.592 bayt; kaynakla SHA-256 eşit |

Canlı bağlantılar, 22 Ekim'de yeniden alınan [AX3000 Dokümanlar](https://aluplan.com.tr/products/ax3000/dokumanlar) HTML'inden çıkarıldı. Dosya yanıtları yeniden indirildi, bellekte hash hesaplandı ve mevcut yerel kaynak dosyaları yeniden hash edilerek karşılaştırıldı.

SHA-256 değerleri:

- Word: `33650e8dfe037cfbd3167243140016e9244009d5bc1154aa4f76e2fa6abb815a`
- Hexagon: `3f62a3b0bb0462b649d7040ac10bbb3d421e97af6a38ae3488c66ab2059f20cc`

Kaynak kullanım zinciri:

1. `app/products/ax3000/dokumanlar/documents.ts:5–6` dosyaları import ediyor; aynı dosyanın 51 ve 57. satırlarında `href` ve indirme dosya adları tanımlı.
2. `ClientPage.tsx:8` belge gruplarını alıyor; 23/31. satırlarda grupları işliyor; 59. satırda `href={doc.href}` ve `download={doc.filename}` ile bağlantıyı oluşturuyor.
3. `page.tsx` bu istemci bileşenini kullanıyor. Kaynak webpack kuralı PDF/DOCX/MP4 için `asset/resource` içeriyor.

`AX3000_For Hazar/Function description_EN.docx` ve `AX3000_For Hazar/Function description_Hexagon 22-10-20_final.docx`, yukarıdaki iki uygulama dosyasıyla sırasıyla aynı hash'e sahip. **Dört yol, iki ayrı belge içeriği** söz konusu. Bu eşitlik silme yetkisi veya içerik/lisans onayı değildir; kopyalar korunmuştur.

## 2. Hash'li görseller: sınırlı ama doğrudan kanıt

Eski envanterde 1.364 kök varlığın yalnız 5'inde `live_pages_exact` vardı. Bu alanın boşluğu, bir varlığın canlıda kullanılmadığını göstermez; Next.js hash'li URL'ler nedeniyle doğrudan yol eşleşmesi yetersizdir.

| Ölçüm | Sonuç | Kapsam |
|---|---:|---|
| Kök envanter varlığı | 1.364 | Arşiv varyantı hariç |
| 19 Ekim HTML kayıtlarından çıkan benzersiz hash'li görsel URL'si | 503 | Optimize URL içindeki özgün dosya hedefi çözüldü |
| Seçilen sayfalardaki özgün görsel URL'si | 86 | Aşağıdaki sekiz sayfanın eski HTML kaydı |
| Yeni doğrulanan DOCX URL'si | 2 | 22 Ekim güncel AX3000 HTML'i |
| Toplam seçili dosya GET | 88 | Hepsi HTTP 200 |
| Mevcut kaynakla aynı SHA-256 veren dosya | 88 | Kaynak adayları yeniden hash edildi |
| Bu hash'lerle eşleşen kök dosya yolu | 169 | Aynı baytları taşıyan kopyalar dahil |

Seçilen sayfalar: `/`, `/products/ax3000/dokumanlar`, `/products/allplan`, `/products/allplan-basic`, `/products/allplan-concept`, `/products/allplan-professional`, `/products/allplan-ultimate`, `/solutions-v2/training`.

**Kanıt tarihi ayrımı:** Görsellerin bu sayfalarda bulunması 19 Ekim HTML kaydına dayanır; dosya erişimi ve bayt eşitliği 22 Ekim'de doğrulandı. Bu sekiz sayfanın tamamının güncel görünümü veya mobil davranışı yeniden test edilmedi. Yalnız AX3000 doküman sayfasının HTML'i güncel olarak yeniden alındı. Optimize görsel çıktısı ile özgün kaynak dosyasının bayt eşitliği iddia edilmez; hash kontrolü özgün dosyaya yapıldı.

İstekler dört eşzamanlı işlem, 25 saniye zaman aşımı ve dosya başına 12 MB sınırıyla yürütüldü. Ağdan alınan medya diske kaydedilmedi. İlk standart istemci AX3000 sayfasında 403 verdi; tarayıcı User-Agent içeren curl ile aynı sayfa 200 döndü. Bu erişim yöntemi farkı, kırık URL olarak sınıflandırılmadı.

## 3. Açık import hedefi bulgusu

`app`, `components`, `lib`, `data` altında TS/TSX/JS/JSX dosyalarındaki tek satırlı, varsayılan `@/...` medya importları tarandı. **974 import ilişkisi** kaydedildi; **bir hedef kaynakta bulunamadı**:

| Kaynak | Import | Kanıt / yorum |
|---|---|---|
| `app/solutions/page.tsx:11` | `imgIndustry` → `assets/solutions/industry/hero.jpg` | Hedef dosya yok. `imgIndustry` import satırı dışında kullanılmıyor; endüstri kartı `imgArchitecture` fallback kullanıyor. |

Bu, kaynak tutarlılığı bulgusudur. Build çalıştırılmadığı için build hatası, canlı görsel kaybı veya canlı sürümde aynı import bulunduğu iddia edilmez. Bizim alabileceğimiz karar: 2027 uygulamasında var olmayan dosya yolunu taşımamak; mevcut canlı endüstri görselini kesin eşleştirmeyle belirlemek. Kaynak dosyaya müdahale edilmedi.

Tarama tam bir bağımlılık grafiği değildir. Dinamik URL'ler, CSS `url()`, alternatif import sözdizimleri, re-export ve bileşen erişilebilirliği ayrıca kontrol edilmelidir. Import bulunması tek başına canlı kullanım kanıtı değildir.

## 4. D02 kapanış kararı ve kalan işler

| Alt konu | Durum | Sorumlu | Kapanış kanıtı / sonraki adım |
|---|---|---|---|
| İki DOCX'in canlı/kaynak ilişkisi | **Doğrulandı** | Teknik ekip / Hazar | Güncel HTML bağlantıları, HTTP 200, yeniden hesaplanan hash eşitliği. Mevcut içerik olarak korunabilir. |
| Seçili hash'li görseller | **86 URL doğrulandı** | Teknik ekip | JSON'da sayfa, URL, hash ve mevcut kaynak eşleşmeleri bulunur. |
| Kalan hash'li görsel URL'leri | Açık | Teknik ekip | 503 URL'nin 417'si bu geçişte kontrol edilmedi. Aynı yöntemle kalan eşleşmeler tamamlanmalı. |
| Kalan kök dosya yolları | Açık | Teknik ekip; yalnız yerel içerik kararında Hazar | 1.195 yol bu geçişin 169 eşleşmesi dışında. Bunlar kullanılmıyor veya canlıda yok demek değildir; önceki PDF kanıtları bu sayıya dahil olabilir. |
| Eksik import hedefi | Açık kaynak tutarsızlığı | Teknik ekip | Canlı endüstri görseli/2027 eşlemesi belirlenmeli; otomatik silme yapılmamalı. |
| Medya kullanım grafiği | Açık | Teknik ekip | URL dizeleri, CSS, dinamik kullanım ve sayfa/bileşen ilişkileri tamamlanmalı. |
| Video/harici gömme | Bu çalışmanın dışında | Teknik ekip | Tam akış, gömme, mobil oynatma ve uygun poster kontrolü ayrıca yapılmalı. |
| Kopyalar/arşiv | Korundu | Hazar; teknik ekip kanıt sağlar | Hash eşitliği silme/eleme kararı yerine geçmez. |

Önceki altı PDF eşleşmesi bu turda tekrar doğrulanmadı; 21 Ekim kanıtı olarak kalır. Bu belge DOCX belirsizliğini kapatır ve görsel eşleşmelerini ilerletir; **eksiksiz aktarım, tüm medya kontrolü veya tasarım fazının tamamlanması onayı değildir.**
