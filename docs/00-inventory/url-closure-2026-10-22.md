# D03 — Hedefli URL kapanış kontrolü

Tarih: 22.10.2026, 07:34–07:36 Europe/Istanbul. Durum: **kanıt güncellendi; URL kararları ve uygulama açık**.

Ham istek, zaman, her yönlendirme adımı, son durum, seçili canlı kaynak bağlantıları ve salt-okunur dosya referansları: [url-closure-2026-10-22.json](./url-closure-2026-10-22.json).

## Kapsam ve yöntem

Önceki kapanış/parite envanterindeki 11 hatalı yol, dört yapılandırılmış 308 ve eski sürüm bağlantısının slash biçimi yeniden kontrol edildi. Ayrıca yalnızca herkese açık `https://allplan.net.tr/` başlangıcı incelendi. GET kullanıldı; en fazla beş izinli alan adı yönlendirmesi, 18 saniye zaman aşımı ve HTML okumada 2 MiB sınırı uygulandı. Teams, oturum açma, yönetim paneli, özel bilet veya form gönderimi yapılmadı.

Altı seçili canlı kaynak sayfası ayrıca GET ile kontrol edildi; hepsi 200 döndü. İlk varsayılan istemci denemesi hata verdiğinden, bağlantı kontrolünde kullanılan açık audit User-Agent ile tek tekrar yapıldı. İkinci sonuçlar JSON'dadır. Bu, tam site taraması veya tarayıcı etkileşim testi değildir. Önceki envanterler değiştirilmedi; önceki `incoming_pages` verileri JSON'da açıkça eski snapshot olarak etiketlendi.

## Hatalı hedefler ve kaynakları

Aşağıdaki yollar `https://aluplan.com.tr` köküne göredir. Dosya referansları salt-okunur `../aluplan-2026/` içindedir.

| Hedef | Güncel HTTP | Kanıtlanan giriş / kaynak | Kapanış için gerekli karar |
|---|---|---|---|
| `/allplan-2021-features` | 404 | Canlı `/solutions/oska`: “Yenilikleri incele” slash biçimine gider; `app/solutions/oska/ClientPage.tsx:61` | Eski sürüm bağlamı korunarak geri getirilecek içerik veya onaylı karşılık belirlenmeli |
| `/allplan-2026nin-ozellikleri` | 404 | Canlı `/solutions/allplan-bulut-hizmetleri`: “ALLPLAN 2026 Özellikleri”; `components/solutions/AllplanBulutContent.tsx:460` | Sürüm içeriğiyle hedef eşleştirilmeli |
| `/products/bimplus-signup` | 404 | `app/sitemap.ts:30` | Kaynak sitemap kaydının amacı ve gerçek hedefi doğrulanmalı |
| `/products/partner-solutions` | 404 | `app/sitemap.ts:32` | Aynı |
| `/products/sds2-detail` | 404 | `app/sitemap.ts:35` | Aynı |
| `/products/sds2-load` | 404 | `app/sitemap.ts:37` | Aynı |
| `/products/tim` | 404 | `app/sitemap.ts:38` | Aynı |
| `/solutions-v2` | 404 | Canlı `/solutions-v2/training`: “Çözümler” breadcrumb; `components/ui/breadcrumb.tsx:39–48,82–84` | Geçerli üst sayfa ve breadcrumb ilişkisi onaylanmalı |
| `/solutions/addon-channel` | 404 | `app/sitemap.ts:58` | Kaynak sitemap kaydının amacı ve gerçek hedefi doğrulanmalı |
| `/solutions/bimplus` | 404 | Canlı `/solutions`: “Allplan BIMPLUS”; `app/solutions/page.tsx:156`, `app/sitemap.ts:57` | Ürün/çözüm konumu ve gerçek hedef eşleştirilmeli |
| `/try-free` | 404 | Canlı `/products/allplan-2026`: “Ücretsiz Deneyin”; `app/products/allplan-2026/page.tsx:155` | Deneme CTA'sı mevcut onaylı hedef kayıtlarıyla eşleştirilmeli; yeni hedef uydurulmamalı |

Sitemap referansı, güncel yerel kaynak dosyasında doğrulandı; bu kontrol canlı sitemap XML'inin yeniden tarandığı anlamına gelmez. Seçili sayfalarda bulunmayan bağlantılar için “sitede hiç bağlantı yok” sonucu çıkarılamaz.

## Yönlendirme zincirleri

| İstenen yol | Zincir | Değerlendirme |
|---|---|---|
| `/solutions/PlanliAlanlar` | 308 → `/solutions/imar-yonetmeligi-bim-eklentisi` → 200 | Bu kontrolde sağlam |
| `/solutions/addons/drive-curvev` | 308 → `/solutions/addons/drive-curve` → 200 | Bu kontrolde sağlam |
| `/solutions/extra-modules` | 308 → `/solutions/addons` → 200 | Bu kontrolde sağlam |
| `/solutions/industry` | 308 → `/solutions/steel` → 200 | Bu kontrolde sağlam; canlı `/solutions` hâlâ ilk yolu kullanıyor |
| `/allplan-2021-features/` | 308 → `/allplan-2021-features` → 404 | **Sağlam yönlendirme değil; yalnızca slash normalizasyonu** |

Son satır önceki yalnız başlangıç durumuna dayalı 308 kaydını netleştirir: 308 almak hedefin çalıştığını kanıtlamaz. Dört sağlam zincirin korunması teknik öneridir; yeni bir URL veya yönlendirme kararı alınmadı.

## Fragment bağlantıları: ayrı tarayıcı kanıtı

Ana çalışma tarafından kaydedilen [fragment tarayıcı kanıtı](./browser-closure-2026-10-22/fragments.json), sonlarında boşluk bulunan beş ham href değerinin tarayıcı tarafından normalize edildiğini gösterir. Beş bağlantı tıklanmış; dört hedef ID mevcut, yalnız `#interface` hedefi eksiktir. Bunlar **beş kırık bağlantı** olarak sınıflandırılmamalıdır. HTTP yol kontrolü fragment hedefinin varlığını kanıtlamaz; bu ayrım D03 kapanışında korunur. Eksik `#interface` için içerik niyeti doğrulandıktan sonra hedef veya bağlantı düzeltmesi kararı gerekir.

## Destek Platformu

- Herkese açık kök: `https://allplan.net.tr/` → **307** → `https://allplan.net.tr/tr` → **200**.
- Açılış başlığı: “Aluplan Destek Platformuna Hoş Geldiniz”; “Giriş Yap” eylemi mevcut.
- Canlı Aluplan ana sayfasındaki “Destek Platformu / Talep Oluştur” bağlantısı güncel kontrolde **`https://allplan.net.tr/`**.
- Salt-okunur kaynak da `components/homepage-v2/ServicesV2.tsx:67` üzerinde aynı hedefi içeriyor. Önceki belgelerdeki `aluplan.net.tr` kaydı önceki snapshot'a aittir; **bugünkü kaynakta devam eden yazım hatası olarak raporlanmamalı**.
- “Giriş Yap” istemci eyleminin varış URL'si bu HTML kontrolünde doğrulanmadı. Oturum açma, müşteri rolü ve talep oluşturma akışı test edilmedi. Kullanıcının sistemin çalıştığı beyanı ile bu kontrolün teknik kapsamı ayrı tutulur.

## Schema ve kapanış etkisi

`components/ui/breadcrumb.tsx` URL segmentlerinden hem görsel breadcrumb hem `BreadcrumbList` öğeleri türetiyor. Bu nedenle 404 olan `/solutions-v2` yalnız görsel gezinme sorunu değildir: aynı mekanizma geçersiz ara öğeyi schema'ya da taşıyabilir. Canlı eğitim sayfasındaki görsel bağlantı doğrulandı; bu çalışmada canlı JSON-LD içeriği yeniden çıkarılmadı. Yeni yapıda onaylı içerik ilişkilerinden breadcrumb üretimi ve her öğenin gerçek URL doğrulaması kabul kriteri olmalı. Bu bir uygulama önerisidir; schema değişikliği yapılmadı.

## Karar, sorumlu ve kalan işler

| İş | Sorumlu | Bizim alabileceğimiz karar / sınır | Durum |
|---|---|---|---|
| Dört mevcut 308 zincirini korunacak regresyon listesine almak | Hazar + geliştirme | Kanıtlanmış davranışı test planına almak | Öneri hazır |
| 11 adet 404 için içerik niyeti ve hedef tablosu | Hazar + içerik çalışması | Kanıtları sınıflandırabiliriz; içerik silme veya yeni hedefi bu raporla onaylanmış sayamayız | Açık |
| `/solutions-v2` üst sayfa ve schema ilişkisi | Hazar + bilgi mimarisi | Teknik üretim ilkesini belirleyebiliriz; URL değişikliği varsa yönlendirme haritasına alınır | Tasarım öncesi açık |
| Destek kök alan adı | Kullanıcı kararı + canlı/kaynak kanıtı | `allplan.net.tr` doğrulandı; yeni ticket uygulaması gerektirmez | Alan adı belirsizliği kapandı |
| Destek müşteri giriş varışı | Yetkili müşteri akışı sahibi + QA | Herkese açık giriş yönünü ayrıca kontrol etmek; özel paneli web sitesi hedefi yapmamak | Yayın öncesi açık |
| Canlı sitemap ve tüm giriş bağlantılarının tam regresyonu | Geliştirme + QA | Onaylı hedeflerden sonraki uygulama/yayın kapısı | Bu kapsamda yapılmadı |

Hiçbir kaynak, URL, içerik, tema veya schema kodu değiştirilmedi. Bu belge yalnız kapanış kanıtıdır; uygulama onayı yerine geçmez.

## Kullanıcı kararı — düzeltmeler ertelendi

22.10.2026: Kullanıcı eksik hedeflerin ve 404'lerin listelenmesini, düzeltmelerin sonra yapılmasını istedi. Yukarıdaki **11 benzersiz 404 yolu** (2021 slash biçimi aynı hedefin yönlendirme zinciridir) ve **bir eksik fragment** karar listesinde korunur. Her satırın nihai işlemi henüz seçilmedi:

- İçeriği yeniden oluşturmak;
- Kanıtlanmış uygun hedefe bağlamak (URL değişirse onaylı yönlendirme planıyla);
- İlgili bağlantı/içerik ihtiyacını kaldırmak.

Bu seçenekler toplu silme veya uygulama izni değildir. Teknik ekip kanıtı korur; Hazar satır bazında kararı verir. D03'ün bilinen hata listesi kayıt altındadır; onarım envanter çalışmasını durdurmaz. Yayın öncesinde karar ve uygulama doğrulanmalıdır. Sitemap, görünür bağlantı ve BreadcrumbList etkisi birlikte değerlendirilir. Schema'da 404 ara hedef bırakılması yayın kabulü değildir.

## Aynı gün eklenen dinamik hedef bulguları

[Envanter kapsam raporunda](inventory-coverage-2026-10-22.md) video kütüphanesindeki dört yalnız `#` kartı, niyet/form başlığı farkları, webinar placeholder iframe ve lisans görselinin DNS hatası ayrıca listelendi. Bunlar önceki11HTTP404+bir eksikfragment sayısına eklenip404 diye gösterilmez. Kullanıcının onarımı erteleme kararı bunlar için de korunur; hiçbir hedef değiştirilmedi.
