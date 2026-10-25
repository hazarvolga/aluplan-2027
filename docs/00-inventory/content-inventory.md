# Faz 0 — İçerik envanteri

Tarih: 2026-10-19T16:17:11.464333+03:00

**Durum: ilk kapsamlı tarama; eksiksizlik kabulü henüz yapılmadı.** Faz 1–6 başlatılmadı. Kaynak: `../aluplan-2026` (salt-okunur), canlı: https://aluplan.com.tr. Canlı ve kök uygulamanın son güncellemeyle aynı olduğu kullanıcı tarafından teyit edildi; deployment SHA doğrulaması yapılmadı. Canlı site esas, yalnız yerelde bulunanlar ayrıca onaya sunulacak.

## Kapsam ve sayılar

| Kayıt | Sayı |
|---|---|
| Yerel app rotası (sayfa + endpoint) | 103 |
| Canlı sorgulanan URL | 125 |
| HTTP sonuçları | {200: 112, 404: 11, 308: 2} |
| Kaynak metin belgesi (tam metin) | 49 |
| Dosya / medya kaydı | 2701 |
| Güncel kök altında medya / dosya | 1364 |
| live-versiyon arşivinde medya / dosya | 1337 |
| links (tekrarlar dahil HTML öğeleri) | 5351 |
| buttons (tekrarlar dahil HTML öğeleri) | 1029 |
| headings (tekrarlar dahil HTML öğeleri) | 2252 |
| images (tekrarlar dahil HTML öğeleri) | 1367 |
| media (tekrarlar dahil HTML öğeleri) | 8 |
| embeds (tekrarlar dahil HTML öğeleri) | 205 |

Bu sayılar benzersiz kullanıcı içeriği veya tamamlanma yüzdesi değildir. Menü/footer tekrarları dahildir. HTML form sayısının sıfır olması form akışı bulunmadığı anlamına gelmez: istemci modalları ve harici formlar kaynak raporunda yer alır.

## Teslim dosyaları

- `content-inventory.json`: sayfa başına başlıklar, metin düğümleri, buton/link nitelikleri ve konumları, görseller/alt, video/embed, meta/canonical/OG/Twitter/schema, tarama sonucu.
- `page-content.md`: HTML metinlerinin sayfa bazında kısaltılmamış dökümü ve başlık yapısı.
- `url-map.csv`: URL, korunacak hedef, kaynak, başlık, derinlik ve URL dizini üstü; bilgi mimarisinin editoryal ebeveyni ayrıca teyit edilmelidir.
- `asset-inventory.json`: dosya adı/yolu, byte, SHA-256, kaynak referans adayları, kesin public URL eşleşmeleri.
- `source-content-texts.json`: 49 kaynak .txt belgesi aynen; arama indeksine giren eski metinler dahildir.
- `source-references.json`: dinamik JSX ve bileşenlerdeki link, başlık, buton ve meta kaynak satırları; render sonucunun yerine geçmez.
- `source-findings.md`: formlar/alanlar/doğrulamalar/entegrasyonlar, izleme/çerez, hosting ve içerik katmanı kanıtları.
- `browser-home-*.txt`: ana sayfa varsayılan, mühendis/prekast, Connect/Bilgi Merkezi, ürün/çözüm menüleri tarayıcı kanıtları.
- `existing-design-tokens.md/json`: mevcut CSS/Tailwind font ve renkleri.
- `existing-redirects.csv`: kaynakta zaten bulunan yönlendirmeler; yeni URL değişikliği önerilmedi.
- `local-only-review.json`: yerel/arşiv ve eşlemesi belirsiz varlık adayları; hiçbir dosya otomatik elenmez.
- `user-decisions.md`: kullanıcı teyitleri, korunacak iddialar ve PRD açık soruları.

## Sayfa ağacı

| URL | Başlık | HTTP | Derinlik |
|---|---|---|---|
| https://aluplan.com.tr/ | ALLPLAN Türkiye \| Profesyonel BIM Yazılımları \| Aluplan | 200 | 0 |
| https://aluplan.com.tr/about | Hakkımızda - Aluplan \| Aluplan | 200 | 1 |
| https://aluplan.com.tr/contact | İletişim - Aluplan \| Aluplan | 200 | 1 |
| https://aluplan.com.tr/gizlilik-politikasi | Aluplan - Premium Mühendislik Çözümleri | 200 | 1 |
| https://aluplan.com.tr/health | Health \| Aluplan | 200 | 1 |
| https://aluplan.com.tr/hero-3d | Aluplan - Premium Mühendislik Çözümleri | 200 | 1 |
| https://aluplan.com.tr/kullanim-sartlari | Aluplan - Premium Mühendislik Çözümleri | 200 | 1 |
| https://aluplan.com.tr/kvkk | Aluplan - Premium Mühendislik Çözümleri | 200 | 1 |
| https://aluplan.com.tr/package-overview | Aluplan - Premium Mühendislik Çözümleri | 200 | 1 |
| https://aluplan.com.tr/paket-karsilastirma | ALLPLAN Paket Karşılaştırma Rehberi (2026 Q3 PDF) \| ALUPLAN \| Aluplan | 200 | 1 |
| https://aluplan.com.tr/products | ALLPLAN Ürünleri \| Aluplan \| Aluplan | 200 | 1 |
| https://aluplan.com.tr/products/allplan | Allplan - Aluplan | 200 | 2 |
| https://aluplan.com.tr/products/allplan-2026 | ALLPLAN Ürünleri \| Aluplan \| Aluplan | 200 | 2 |
| https://aluplan.com.tr/products/allplan-2026-yenilikler | ALLPLAN Ürünleri \| Aluplan \| Aluplan | 200 | 2 |
| https://aluplan.com.tr/products/allplan-aec | ALLPLAN Ürünleri \| Aluplan \| Aluplan | 200 | 2 |
| https://aluplan.com.tr/products/allplan-basic | ALLPLAN Ürünleri \| Aluplan \| Aluplan | 200 | 2 |
| https://aluplan.com.tr/products/allplan-bimplus | Allplan Bimplus - Aluplan | 200 | 2 |
| https://aluplan.com.tr/products/allplan-cloud-services | ALLPLAN Ürünleri \| Aluplan \| Aluplan | 200 | 2 |
| https://aluplan.com.tr/products/allplan-concept | ALLPLAN Ürünleri \| Aluplan \| Aluplan | 200 | 2 |
| https://aluplan.com.tr/products/allplan-professional | ALLPLAN Ürünleri \| Aluplan \| Aluplan | 200 | 2 |
| https://aluplan.com.tr/products/allplan-ultimate | ALLPLAN Ürünleri \| Aluplan \| Aluplan | 200 | 2 |
| https://aluplan.com.tr/products/architecture | Allplan Architecture - Aluplan | 200 | 2 |
| https://aluplan.com.tr/products/ax3000 | AX3000 Ürünleri - Aluplan | 200 | 2 |
| https://aluplan.com.tr/products/ax3000/dokumanlar | AX3000 Dokümanları | 200 | 3 |
| https://aluplan.com.tr/products/bimplus-signup |  | 404 | 2 |
| https://aluplan.com.tr/products/civil | ALLPLAN Ürünleri \| Aluplan \| Aluplan | 200 | 2 |
| https://aluplan.com.tr/products/partner-solutions |  | 404 | 2 |
| https://aluplan.com.tr/products/precast | ALLPLAN Ürünleri \| Aluplan \| Aluplan | 200 | 2 |
| https://aluplan.com.tr/products/precast-detail | Precast Detail - Aluplan | 200 | 2 |
| https://aluplan.com.tr/products/sds2-detail |  | 404 | 2 |
| https://aluplan.com.tr/products/sds2-home | SDS2 Home - Aluplan | 200 | 2 |
| https://aluplan.com.tr/products/sds2-load |  | 404 | 2 |
| https://aluplan.com.tr/products/tim |  | 404 | 2 |
| https://aluplan.com.tr/references | Aluplan - Premium Mühendislik Çözümleri | 200 | 1 |
| https://aluplan.com.tr/search | Arama Sonuçları \| Aluplan \| Aluplan | 200 | 1 |
| https://aluplan.com.tr/solutions | ALLPLAN Çözümleri \| Tüm Çözümler \| Aluplan | 200 | 1 |
| https://aluplan.com.tr/solutions-v2/addons | Aluplan - Premium Mühendislik Çözümleri | 200 | 2 |
| https://aluplan.com.tr/solutions-v2/building-design | Aluplan - Premium Mühendislik Çözümleri | 200 | 2 |
| https://aluplan.com.tr/solutions-v2/connect-license | Aluplan - Premium Mühendislik Çözümleri | 200 | 2 |
| https://aluplan.com.tr/solutions-v2/connect-license/activation | Deklarasyon Formu - Aluplan \| Aluplan | 200 | 3 |
| https://aluplan.com.tr/solutions-v2/connect-license/how-to-assign | Aluplan - Premium Mühendislik Çözümleri | 200 | 3 |
| https://aluplan.com.tr/solutions-v2/connect-login | Aluplan - Premium Mühendislik Çözümleri | 200 | 2 |
| https://aluplan.com.tr/solutions-v2/construction | Aluplan - Premium Mühendislik Çözümleri | 200 | 2 |
| https://aluplan.com.tr/solutions-v2/faq | Aluplan - Premium Mühendislik Çözümleri | 200 | 2 |
| https://aluplan.com.tr/solutions-v2/infrastructure | Aluplan - Premium Mühendislik Çözümleri | 200 | 2 |
| https://aluplan.com.tr/solutions-v2/other | Aluplan - Premium Mühendislik Çözümleri | 200 | 2 |
| https://aluplan.com.tr/solutions-v2/training | Aluplan - Premium Mühendislik Çözümleri | 200 | 2 |
| https://aluplan.com.tr/solutions-v2/training/classroom | Aluplan - Premium Mühendislik Çözümleri | 200 | 3 |
| https://aluplan.com.tr/solutions-v2/training/e-learning | Aluplan - Premium Mühendislik Çözümleri | 200 | 3 |
| https://aluplan.com.tr/solutions-v2/training/events | Aluplan - Premium Mühendislik Çözümleri | 200 | 3 |
| https://aluplan.com.tr/solutions-v2/training/individual | Aluplan - Premium Mühendislik Çözümleri | 200 | 3 |
| https://aluplan.com.tr/solutions-v2/training/online | Aluplan - Premium Mühendislik Çözümleri | 200 | 3 |
| https://aluplan.com.tr/solutions-v2/training/quick-start | Aluplan - Premium Mühendislik Çözümleri | 200 | 3 |
| https://aluplan.com.tr/solutions-v2/training/video-library | Aluplan - Premium Mühendislik Çözümleri | 200 | 3 |
| https://aluplan.com.tr/solutions-v2/training/webinar | Aluplan - Premium Mühendislik Çözümleri | 200 | 3 |
| https://aluplan.com.tr/solutions/addon-channel |  | 404 | 2 |
| https://aluplan.com.tr/solutions/addons | Eklentiler - Aluplan \| Aluplan | 200 | 2 |
| https://aluplan.com.tr/solutions/addons/2d-dwg-converter | 2D DWG Converter - Aluplan \| Aluplan | 200 | 3 |
| https://aluplan.com.tr/solutions/addons/drive-curve | Drive Curve - Aluplan \| Aluplan | 200 | 3 |
| https://aluplan.com.tr/solutions/addons/geometry-tools | Geometry Tools - Aluplan \| Aluplan | 200 | 3 |
| https://aluplan.com.tr/solutions/addons/graphical-text | Graphical Text - Aluplan \| Aluplan | 200 | 3 |
| https://aluplan.com.tr/solutions/addons/parametric-terrain | Parametric Terrain - Aluplan \| Aluplan | 200 | 3 |
| https://aluplan.com.tr/solutions/addons/ramp | Ramp - Aluplan \| Aluplan | 200 | 3 |
| https://aluplan.com.tr/solutions/addons/sketchup-converter | SketchUp Converter - Aluplan \| Aluplan | 200 | 3 |
| https://aluplan.com.tr/solutions/addons/steel-components | Steel Components - Aluplan \| Aluplan | 200 | 3 |
| https://aluplan.com.tr/solutions/addons/three-dimensioning | Three Dimensioning - Aluplan \| Aluplan | 200 | 3 |
| https://aluplan.com.tr/solutions/allplan-bulut-hizmetleri | ALLPLAN Bulut Hizmetleri - Aluplan \| Aluplan | 200 | 2 |
| https://aluplan.com.tr/solutions/allplan-industry | Aluplan - Premium Mühendislik Çözümleri | 200 | 2 |
| https://aluplan.com.tr/solutions/architecture | Aluplan - Premium Mühendislik Çözümleri | 200 | 2 |
| https://aluplan.com.tr/solutions/ax3000 | Aluplan - Premium Mühendislik Çözümleri | 200 | 2 |
| https://aluplan.com.tr/solutions/ax3000-mekanik-tesisat | AX3000 Mekanik Tesisat - Aluplan \| Aluplan | 200 | 2 |
| https://aluplan.com.tr/solutions/ax3000-virtual-reality | AX3000 VR - Aluplan \| Aluplan | 200 | 2 |
| https://aluplan.com.tr/solutions/ax3000-yapi-fizigi | AX3000 Yapı Fiziği - Aluplan \| Aluplan | 200 | 2 |
| https://aluplan.com.tr/solutions/ax3000/elektrik | AX3000 Elektrik - Aluplan \| Aluplan | 200 | 3 |
| https://aluplan.com.tr/solutions/ax3000/havalandirma | AX3000 Havalandırma - Aluplan \| Aluplan | 200 | 3 |
| https://aluplan.com.tr/solutions/ax3000/isitma | AX3000 Isıtma - Aluplan \| Aluplan | 200 | 3 |
| https://aluplan.com.tr/solutions/ax3000/konut-havalandirma | AX3000 Konut Havalandırma - Aluplan \| Aluplan | 200 | 3 |
| https://aluplan.com.tr/solutions/ax3000/sihhi-tesisat | AX3000 Sıhhi Tesisat - Aluplan \| Aluplan | 200 | 3 |
| https://aluplan.com.tr/solutions/ax3000/sprinkler | AX3000 Sprinkler - Aluplan \| Aluplan | 200 | 3 |
| https://aluplan.com.tr/solutions/bimflex | BIMFlex Allplan Eklenti Paketi \| Aluplan | 200 | 2 |
| https://aluplan.com.tr/solutions/bimplus |  | 404 | 2 |
| https://aluplan.com.tr/solutions/bimx5 | Aluplan - Premium Mühendislik Çözümleri | 200 | 2 |
| https://aluplan.com.tr/solutions/bridge-design | Aluplan - Premium Mühendislik Çözümleri | 200 | 2 |
| https://aluplan.com.tr/solutions/cds-addon | Aluplan - Premium Mühendislik Çözümleri | 200 | 2 |
| https://aluplan.com.tr/solutions/features-allplan-bridge | Aluplan - Premium Mühendislik Çözümleri | 200 | 2 |
| https://aluplan.com.tr/solutions/imar-yonetmeligi-bim-eklentisi | Aluplan - Premium Mühendislik Çözümleri | 200 | 2 |
| https://aluplan.com.tr/solutions/industry |  | 308 | 2 |
| https://aluplan.com.tr/solutions/infrastructure | Aluplan - Premium Mühendislik Çözümleri | 200 | 2 |
| https://aluplan.com.tr/solutions/mep | Aluplan - Premium Mühendislik Çözümleri | 200 | 2 |
| https://aluplan.com.tr/solutions/modeling-of-precast-girder-bridges | Prefabrik Kirişli Köprü Modelleme - Aluplan \| Aluplan | 200 | 2 |
| https://aluplan.com.tr/solutions/oska | Aluplan - Premium Mühendislik Çözümleri | 200 | 2 |
| https://aluplan.com.tr/solutions/poz-catalog | Aluplan - Premium Mühendislik Çözümleri | 200 | 2 |
| https://aluplan.com.tr/solutions/precast | Aluplan - Premium Mühendislik Çözümleri | 200 | 2 |
| https://aluplan.com.tr/solutions/pythonpart | Aluplan - Premium Mühendislik Çözümleri | 200 | 2 |
| https://aluplan.com.tr/solutions/rebar-engineering | Aluplan - Premium Mühendislik Çözümleri | 200 | 2 |
| https://aluplan.com.tr/solutions/road-railway | Aluplan - Premium Mühendislik Çözümleri | 200 | 2 |
| https://aluplan.com.tr/solutions/scalypso | Scalypso - Aluplan \| Aluplan | 200 | 2 |
| https://aluplan.com.tr/solutions/scalypso/converter | Scalypso Converter - Aluplan \| Aluplan | 200 | 3 |
| https://aluplan.com.tr/solutions/scalypso/mobile | Scalypso Mobile - Aluplan \| Aluplan | 200 | 3 |
| https://aluplan.com.tr/solutions/scalypso/modeler | Scalypso Modeler - Aluplan \| Aluplan | 200 | 3 |
| https://aluplan.com.tr/solutions/scalypso/videos | Scalypso Eğitim Videoları - Aluplan \| Aluplan | 200 | 3 |
| https://aluplan.com.tr/solutions/scalypso/viewer | Scalypso Viewer - Aluplan \| Aluplan | 200 | 3 |
| https://aluplan.com.tr/solutions/site-planning | Aluplan - Premium Mühendislik Çözümleri | 200 | 2 |
| https://aluplan.com.tr/solutions/steel | Aluplan - Premium Mühendislik Çözümleri | 200 | 2 |
| https://aluplan.com.tr/solutions/structural | Aluplan - Premium Mühendislik Çözümleri | 200 | 2 |
| https://aluplan.com.tr/test-webgl | Aluplan - Premium Mühendislik Çözümleri | 200 | 1 |
| https://aluplan.com.tr/allplan-2021-features/ |  | 308 | 1 |
| https://aluplan.com.tr/allplan-2026nin-ozellikleri |  | 404 | 1 |
| https://aluplan.com.tr/cdn-cgi/l/email-protection |  | 404 | 3 |
| https://aluplan.com.tr/solutions-v2 |  | 404 | 1 |
| https://aluplan.com.tr/solutions-v2/training/video-library/addon-geometry | Aluplan - Premium Mühendislik Çözümleri | 200 | 4 |
| https://aluplan.com.tr/solutions-v2/training/video-library/allplan-reinforcement | Aluplan - Premium Mühendislik Çözümleri | 200 | 4 |
| https://aluplan.com.tr/solutions-v2/training/video-library/ax3000 | Aluplan - Premium Mühendislik Çözümleri | 200 | 4 |
| https://aluplan.com.tr/solutions-v2/training/video-library/bridge-workflow-2022 | Aluplan - Premium Mühendislik Çözümleri | 200 | 4 |
| https://aluplan.com.tr/solutions-v2/training/video-library/bridge-workflows | Aluplan - Premium Mühendislik Çözümleri | 200 | 4 |
| https://aluplan.com.tr/solutions-v2/training/video-library/campus-de | Aluplan - Premium Mühendislik Çözümleri | 200 | 4 |
| https://aluplan.com.tr/solutions-v2/training/video-library/campus-en | Aluplan - Premium Mühendislik Çözümleri | 200 | 4 |
| https://aluplan.com.tr/solutions-v2/training/video-library/campus-tutorials-2019-2022 | Aluplan - Premium Mühendislik Çözümleri | 200 | 4 |
| https://aluplan.com.tr/solutions-v2/training/video-library/hello-allplan-2024 | Aluplan - Premium Mühendislik Çözümleri | 200 | 4 |
| https://aluplan.com.tr/solutions-v2/training/video-library/konut-insaati | Aluplan - Premium Mühendislik Çözümleri | 200 | 4 |
| https://aluplan.com.tr/solutions-v2/training/video-library/otomatik-donati | Aluplan - Premium Mühendislik Çözümleri | 200 | 4 |
| https://aluplan.com.tr/solutions-v2/training/video-library/quickstart-buildings | Aluplan - Premium Mühendislik Çözümleri | 200 | 4 |
| https://aluplan.com.tr/solutions-v2/training/video-library/road-design | Aluplan - Premium Mühendislik Çözümleri | 200 | 4 |
| https://aluplan.com.tr/solutions-v2/training/video-library/sds2-intro | Aluplan - Premium Mühendislik Çözümleri | 200 | 4 |
| https://aluplan.com.tr/try-free |  | 404 | 1 |

## Kırık ve yönlenen URL kanıtları

404 sonuçları tek ölçüm anına aittir. 308 bir yönlendirmedir, kırıklık kanıtı değildir; urllib istemcisi bu yanıtları takip etmedi.

| URL | Sonuç | Konum | Gelen link bulunan sayfa sayısı |
|---|---|---|---|
| https://aluplan.com.tr/products/bimplus-signup | 404 | — | 0 |
| https://aluplan.com.tr/products/partner-solutions | 404 | — | 0 |
| https://aluplan.com.tr/products/sds2-detail | 404 | — | 0 |
| https://aluplan.com.tr/products/sds2-load | 404 | — | 0 |
| https://aluplan.com.tr/products/tim | 404 | — | 0 |
| https://aluplan.com.tr/solutions/addon-channel | 404 | — | 0 |
| https://aluplan.com.tr/solutions/bimplus | 404 | — | 1 |
| https://aluplan.com.tr/solutions/industry | 308 | /solutions/steel | 1 |
| https://aluplan.com.tr/allplan-2021-features/ | 308 | /allplan-2021-features | 1 |
| https://aluplan.com.tr/allplan-2026nin-ozellikleri | 404 | — | 1 |
| https://aluplan.com.tr/cdn-cgi/l/email-protection | 404 | — | 112 |
| https://aluplan.com.tr/solutions-v2 | 404 | — | 33 |
| https://aluplan.com.tr/try-free | 404 | — | 1 |

## Yetim ve tekrar adayları

Tarama kapsamındaki HTML bağlantılarında gelen linki görünmeyen URL’ler aşağıdadır. Açılır menü/arama/istemci durumu nedeniyle eksik kenarlar olabilir; bunlar kesin yetim sayfa kararı değildir.

- https://aluplan.com.tr/products/bimplus-signup
- https://aluplan.com.tr/products/partner-solutions
- https://aluplan.com.tr/products/sds2-detail
- https://aluplan.com.tr/products/sds2-load
- https://aluplan.com.tr/products/tim
- https://aluplan.com.tr/solutions/addon-channel

Tam HTML metin düğümü eşitliğiyle tekrar grubu bulunmadı. Yakın anlamsal tekrar, ortak bileşen tekrarı ve eski kaynak metniyle çakışma ayrıca incelenmelidir.

## Erken bulgular ve korunacak davranışlar

- `/about` canlı canonical: `https://aluplan.com.tr`; kayıt içindeki metadata_links ile doğrulandı. Faz 2 değerlendirmesine taşınacak; henüz değişiklik yok.
- Kök app kaynak kodunda bazı formlar gerçek gönderim/kayıt yapmadan başarı döndürüyor. Canlı e-posta gönderimi denenmedi. Kanıt: `source-findings.md`.
- Mevcut metrik/idda metinleri kullanıcı talimatıyla aynen korunur. Doğrulama ihtiyacı içerik silme veya yeniden yazma izni değildir.
- Kaynakta 30 gün, kullanıcı gözleminde 14 gün deneme süresi var. Kaynak içerik değiştirilmedi; uyuşmazlık ayrı onaya sunulacak.
- Hedef teknoloji ve yeni tasarım kararı verilmedi. Docker/Coolify belgeleri kurulum niyetinin kanıtıdır; çalışan sağlayıcı/container/SHA kanıtı değildir.

## Eksiksizlik için kalan işler (22–25.10.2026 itibarıyla tamamlandı)

1. Alt sayfalardaki sekme, akordeon, video modalı, arama ve mobil menü durumları canlı (`browser-complete-2026-10-22/`, `browser-final-2026-10-22.json`) ve kaynak odaklı (`remaining-source-checks-2026-10-22.md`, `global-state-source-review-2026-10-22.md`) olarak envantere alındı.
2. Harici Microsoft Forms alanları ve tüm 14 bölüm / 24 soru dallanmaları salt-okunur incelenip `form-admin-2026-10-22.md` içinde belgelendi.
3. Hashli Next medya URL’leri (503 görsel), 6 PDF ve 2 AX3000 DOCX dosyasının SHA-256 eşliği `media-complete-2026-10-22.md` içinde doğrulandı; 376 referanssız/arşiv medya yolu koruma altında sınıflandırıldı.
4. Tüm iç/dış linkler, yönlendirme zincirleri ve fragment hedefleri `url-closure-2026-10-22.md` ile doğrulandı; 11 benzersiz 404 ve eksik hedeflerin onarımı kullanıcı kararıyla uygulama/geçiş aşamasına ertelendi.
5. Deneme süresi (14 gün / 30 gün) çelişkisi 25.10.2026 tarihli kullanıcı kararıyla kapatıldı: yeni sitede deneme CTA'ları doğrudan `https://www.allplan.com/trial-or-subscription/` adresine yönlendirilecek.

**Faz 0 (İçerik ve Envanter Çıkarımı) 25.10.2026 itibarıyla kullanıcı onayıyla tamamlanmış ve kapatılmıştır.**
