# Oturum devri

## Güncelleme tarihi ve oturum no
21.10.2026 — Uzun vadeli strateji çalışması (Europe/Istanbul).

## Faz durumu tablosu
| Faz | Durum |
|---|---|
| 0 — İçerik envanteri | Devam ediyor |
| 1 — UI/UX analizi | Başlanmadı |
| 2 — Teknik baseline | Başlanmadı |
| 3 — PRD | Başlanmadı |
| 4 — Design system | Başlanmadı |
| 5 — Ana sayfa tasarımı | Başlanmadı |
| 6 — Geliştirme | Başlanmadı |

## Bu oturumda yapılanlar
- `AGENTS.md` oturum/koruma kuralları ve `docs/MASTER-PROMPT.md` eksiksiz başlangıç talimatı oluşturuldu.
- `docs/00-inventory/content-inventory.md/json` ve `url-map.csv` üretildi: 103 yerel app rotası, 125 canlı URL, 112 HTTP 200 / 11 HTTP 404 / 2 HTTP 308.
- `asset-inventory.json`: 2701 dosya (1364 kök kaynak, 1337 live-versiyon arşivi), byte/SHA-256/referans adayları. Bunlar 2701 yayında kullanılan dosya anlamına gelmez.
- `source-content-texts.json`: 49 tam metin; `page-content.md`: taranan HTML metinlerinin kısaltılmamış dökümü.
- `source-findings.md`: form alanları/entegrasyonlar/çerez/analitik/hosting kaynak kanıtları.
- `browser-home-*.txt`: ana sayfa rol seçenekleri, Connect/Bilgi Merkezi, ürün/çözüm menüleri tarayıcı gözlemleri. Form gönderilmedi.
- `existing-design-tokens.md/json`: mevcut font ve renkler kaynaktan çıkarıldı.
- Kullanıcının `docs/BRAND-GUIDELINES.md` dosyası okundu; değiştirilmedi. `docs/brand/current-identity.md` mevcut/taslak farklarını ve açık kararları kaydeder.
- `collect_inventory.py` salt-okunur envanter aracı gözden geçirildi; form değerleri/script içerikleri dışarıda bırakıldı, gövde sınırı işaretlendi, sitemap ve hassas içerik dışlama durumları görünür kaydedildi. Sentetik form ayrıştırma testi geçti. Bu uygulama testi değildir.
- Canlı/yerel URL parite katmanı `scripts/url_parity.py` ve `tests/test_url_parity.py` ile yeniden üretilebilir hale getirildi. 131 gözlemlenen yol içinde 116 doğrudan 2xx, 4 başarılı 308 yönlendirme, 7 sitemap 404 ve 4 bağlantı kaynaklı 404 bulundu. 14 somut video URL'si dinamik şablon kaynak dosyasına bağlandı. Ayrıntı: `docs/00-inventory/url-parity.md/json/csv` ve yetkili migration tablosu `url-map.csv`.

## Alınan kararlar ve gerekçeleri
- Kullanıcı: canlı ile yerel kökü biraz önce aynı sürüme güncelledi; canlı site esas, yalnız yerel içerik ayrı onaya sunulur. Çalışan SHA bağımsız doğrulanmadı.
- Hedef teknoloji Next.js; kesin sürüm ve tasarım kararları açık. Kaynak Next.js 14/React 18/TypeScript/Tailwind 3 sürüm aralıkları içerir. Docker/Coolify belgesi mevcut; üretim sağlayıcısı bağımsız doğrulanmadı.
- Kılavuz v1.0 TASLAK / ONAY BEKLİYOR. Aluplan ayrı distribütör/çözüm ortağı kimliğiyle ele alınacak; yeni palet/font/slogan henüz uygulanmaz.
- 29+/500+/50+/10K+ metinleri, mevcut CTA hedefleri, üretici logoları, hero video, PDF'ler ve geliştirici kredisi korunur. İnceleme notları değiştirme izni değildir.
- Eski projede build/dev/install çalıştırılmadı, yazma yapılmadı. Kardeş projeler incelenmedi. `.env` içerikleri okunmadı/kopyalanmadı.
- Kullanıcı hedef teknoloji olarak Next.js'i seçti. Kesin sürüm geliştirme başlangıcında güncel kararlı sürümden doğrulanıp kilitlenecek; mevcut fazda scaffold kurulmayacak.
- İçerik, bileşen ve tema ayrı katmanlar olacak. Tüm görsel değerler semantik design token sözleşmesinden beslenecek; yalnız token seti değiştirilerek sitenin tamamı yeniden temalanabilir olacak. Bu gereksinim PRD ve Faz 4 kabul kriterlerine bağlanacak.
- `../aluplan-2026` kaynak Git HEAD'i URL parite çalışması başında `d126e901b1f641b394a1725c50f031914da10307`, dalı `main` idi. Kaynakta izlenmeyen `AX3000_For Hazar/` klasörü bulundu; canlı/kök eşitliği iddiasına otomatik dahil edilmeyecek ve ayrı yerel içerik adayı olarak tutulacak.

## Açık sorular ve onay bekleyen konular
- Segmentlerin ticari önceliği ve karar vericiler.
- Tek birincil dönüşüm: teklif/deneme; Microsoft Forms aynen mi kalacak? Şimdilik korunur.
- Marka kılavuzu palet/font/logo/slogan onayı; ALLPLAN üretici kullanım kuralları ve dosya bazında izinler; title/hero/sosyal kimlik onayı.
- Kullanıcı gözleminde 14 gün, kaynakta bazı yerlerde 30 gün deneme. İçerik değişmeden çelişki korunur, dayanak ve onay gerekir.
- PRD henüz yazılmadı; bu sorular Faz 3 Açık Sorular bölümüne taşınacak. Yeni tasarımı bu cevaplar varsayılarak kurma.

## Bilinen sorunlar ve riskler
- Envanter **kısmi**: tüm alt sayfa dinamik durumları, harici form alanları, dış link/dosya erişimleri, fragmentler ve hashli medya eşlemesi henüz tam doğrulanmadı. Ayrıntılı kapanış listesi `docs/00-inventory/content-inventory.md` sonunda.
- Güncel URL parite aracı aynı-origin 308 hedeflerini izler ve yalnız 2xx hedefe ulaşan yönlendirmeleri geçerli migration girdisi sayar. Harici hedefler otomatik GET edilmez. Bulgular tek tarama anı kanıtıdır.
- URL keşfi sitemap, yerel rotalar, kaynak yönlendirmeleri ve HTML bağlantılarıyla; 8 tur/400 yol sınırıyla çalışır. Client-side yollar, form action, script içi URL ve sorgu varyantları için ayrı Faz 0 kapanış matrisi gereklidir; mevcut sayı eksiksizlik iddiası değildir.
- /about canlı canonical ana sayfaya işaret ediyor; meta kayıtlarında kanıt var. Teknik etkisi Faz 2'de analiz edilecek.
- Kaynakta bazı form akışları simülasyon; canlı gönderim/kalıcılık testi yapılmadı. Güvenlik ve çerez bulguları kod kanıtı, canlı/hukuki uygunluk kararı değil.
- Asset basename eşlemeleri aday; kesin kullanım kanıtı değil. `live-versiyon` arşivi güncel içeriğe karıştırılmaz.
- Marka kılavuzunun üretici izinleri hakkındaki ifadeleri resmî izin belgesi yerine geçmez; benzerlik kontrolü henüz yapılmadı.

## Sıradaki adım
Önce `docs/long-term-web-strategy.md` taslağını kullanıcıyla değerlendir. Yön onayının ardından Faz 0 içinde içerik/medya/form/link kapanış matrisini ve asset paritesini tamamla; tamamlanan envanteri ALLPLAN referans analiziyle sonraki analiz aşamasında karşılaştır. Tasarıma geçme.

## Uzun vadeli web stratejisi — 21.10.2026
- Kullanıcı yıllık yeniden yapım yükünü ve ürünlerin doğru anlatılmasını temel sorunlar olarak belirtti; kalıcı içerik, yıllık sürümler ve müşteri kazanımını birlikte planlamayı istedi.
- `docs/long-term-web-strategy.md` v0.1 taslağı oluşturuldu: kalıcı ürün/çözüm kayıtları, ayrı paket/sürüm ilişkileri, yıllık yayın süreci, mevcut CTA'larla müşteri yolları, CMS'siz içerik işletimi ve ölçüm önerileri.
- Tek devam eden kod tabanı ve içerik güncellemeleri önerildi. Ürün/segment pilotu, ticari hedefler, sorumlular ve sayısal başarı hedefleri kullanıcı değerlendirmesine açık.
- Google'ın URL taşıma ve kullanıcı odaklı içerik belgeleri incelendi ve taslakta kaynak gösterildi. Canlı site yeniden taranmadı; envanter sayıları önceki tarihli gözlemlerdir.
- Yalnız dokümantasyon değişti. Tasarım, uygulama, schema, içerik/URL değişikliği veya yayın yapılmadı; Faz 0 sürüyor.

## Kullanıcı isteğiyle bağımsız ALLPLAN referans araştırması
- 19.10.2026: `docs/allplan-information-architecture.md` oluşturuldu. International görünümde ürün/çözüm/paket ayrımı, sayfa sunum desenleri, kullanıcı yolları ve dokuz sayfanın ilk HTML schema işaretleri incelendi; ABD bölgesel farkları ayrıca belirtildi.
- İlk altı HTML örneğinde TYPO3 kaynak işareti doğrulandı. Aluplan CMS kullanmıyor; Next.js içerik, ilişkiler, navigasyon, tema ve SEO katmanları için dosya tabanlı model yalnız aday olarak belgelendi. CMS kurulumu kararlaştırılmadı.
- Dokuz örneğin ilk HTML'sinde JSON-LD/itemtype bulunmadı; JS sonrası DOM, mağaza ve site geneli için yokluk iddiası yapılmadı. İç CMS veri modeli bilinmiyor.
- Aluplan karşılaştırması henüz yapılmadı; referans araştırması faz geçişi veya tasarım/URL/içerik değişikliği onayı değildir.
- Schema skillinin kullanıcı tarafından istenmesi üzerine `docs/allplan-information-architecture.md` bölüm 6.C, 19.10.2026 tarihinde Google Search Central ve Next.js resmî belgeleriyle doğrulandı. FAQ rich result'ın Mayıs 2026'da kaldırılması, HowTo/search-box desteğinin kaldırılması ve skilldeki zorunlu alan özetlerinin düzeltmeleri kaydedildi. CMS'siz Next.js için tür/uygunluk matrisi eklendi; kod veya JSON-LD uygulanmadı, ALLPLAN yeniden taranmadı, Rich Results Test çalıştırılmadı.

## Önemli dosyalar ve komutlar
- Başlangıç sırası: `docs/MASTER-PROMPT.md` → `HANDOFF.md` → `docs/BRAND-GUIDELINES.md` → 3–5 satır özet ve kullanıcı onayı.
- Kullanıcı kararları: `docs/00-inventory/user-decisions.md`.
- Envanter: `docs/00-inventory/content-inventory.md`, `.json`, `url-map.csv`.
- URL doğrulama: `python3 scripts/url_parity.py`; birim test: `python3 -m unittest tests/test_url_parity.py`.
- Kaynak marka farkları: `docs/brand/current-identity.md`.
- Envanter aracını yeniden çalıştırma: `python3 docs/00-inventory/collect_inventory.py` (canlı GET trafiği üretir; otomatik JSON/CSV'yi yeniler; elle eklenen public_url/live_pages_exact eşlemelerini yeniden eklemek gerekir).
- Yeni uygulama kurulmadı: build/test/lint/dev komutları tanımlı değil. `design-system/` boş; `src/` geliştirme fazından önce oluşturulmadı.

## Aynı oturum ek işi — Kullanıcı isteğiyle HTML örneği
- Kullanıcı açıkça HTML tasarım örneği istedi; yalnız bu önizleme için `docs/previews/index.html` ve yerel assets oluşturuldu. Tam site/design system geliştirmesine geçilmedi; Faz 0 devam ediyor.
- Önizleme: http://127.0.0.1:8767/ (yalnız loopback, Python static server; terminal oturumu 92812).
- Kaynak görseller/logolar değiştirilmeden yeni projeye kopyalandı. Fontlar yerel, lisans metinleri kayıtlı. Kapsam ve font formatı sınırı `docs/previews/README.md` içinde.
- Tarayıcıda rol metni/URL değişimi ve tema geçişi doğrulandı; `docs/previews/preview.png` kaydedildi. Statik kod incelemesinde kritik/yüksek bulgu yok. Tam mobil/E2E veya içerik paritesi kabulü yapılmadı.
- Tasarım örneği kullanıcı geri bildirimini bekler; PRD veya marka kılavuzu onayı verilmiş sayılmaz.
