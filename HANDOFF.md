# Oturum devri

## 03.11.2026 — Rota adları, S.S.S. menüsü ve AX3000 dokümanları (yerel, commitlenmedi)

- `/paket-karsilastirma` artık 2027 karşılaştırma sayfası (`src/app/paket-karsilastirma/`). `/2027/compare` ve PDF adresleri 308 ile buraya gider. Sürüm bayrağı kapalıyken aynı adres eski sayfayı sunar; sitemap'te tek kayıt var.
- `/solutions-v2/faq` → `/faq` (308). Yeniden adlandırma `scripts/generate_site_data.py` içindeki `ROUTE_RENAMES` ile üretim sonrası uygulanır; kaynak envanter karşılaştırmaları `tests/fixtures/sitewide_parity_policy.json` içindeki `routeRenames` ile eşlenir. Menüde "S.S.S." Hakkımızda ile İletişim arasında (`SiteShell.tsx`, masaüstü ve mobil).
- AX3000 dokümanları sayfasında hero altındaki iki kart gizlendi; Yapı Fiziği ve Virtual Reality sayfalarına doküman bağlantısı eklendi (`SubpageView.tsx`).
- Kapılar: `pnpm test` (302 unit test, 37/37 parite, 45/45 token), typecheck, iki bayrak ayarında build. Dev sunucusunda tüm sayfalar ve mobil menü doğrulandı.
- Açık: FAQ sayfasının kırıntısı hâlâ "Ana Sayfa > Çözümler > SSS"; `llms.txt` karşılaştırma satırı hâlâ "PDF" diyor.

## 03.11.2026 — D4: istemci paketinden sayfa verisinin çıkarılması (yerel, commitlenmedi)

- `codex/prelaunch-decisions` dalında yarım kalan D4 tamamlandı. İstemci bileşenleri ve onların içe aktardığı yardımcı modüller artık `@/lib/site-data`'yı yalnız tip için içe aktarıyor. Sabitler, navigasyon, ana sayfa ve arama dizini `src/lib/site-shared.ts` modülünden; oynatma listeleri ve video kütüphanesi `src/lib/playlist-data.ts` modülünden geliyor. `site-data.ts` hepsini aynı adlarla dışa aktarmayı sürdürüyor; sunucu tarafı değişmedi.
- Sonuç: en büyük istemci chunk'ı 1,73 MB'tan 229 KB'a indi; istemci chunk'larında `bodyNodes` (sayfa gövdesi) kalmadı.
- Test: `tests/test_client_bundle_data.py`; artık `src/components` altındaki direktifsiz bileşenleri ve `.ts` yardımcılarını da tarıyor. `tests/site_data_runtime_loader.mjs`, `schema_runtime.mjs` ve `page_end_conversion_runtime.mjs` harness'larının ortak yükleyicisi oldu. `test_forms_transition.py`, form adresini yeni konumunda (`site-shared.ts`) doğruluyor; adres değişmedi.
- Kapılar: `pnpm test` (292 unit test, kaynak sözleşmesi, 36/36 parite, stil kontrolü, 45/45 token), typecheck ve bayraklı production build geçti. Dev sunucusunda ana sayfa, video kütüphanesi, arama ve SSS sayfaları konsol hatası olmadan render edildi.
- Commit ve push kullanıcı onayı bekliyor.

## 03.11.2026 — Yayın öncesi sağlamlaştırma (16 geliştirme maddesi)

- `codex/prelaunch-hardening` dalında (PR #3 dalının üzerinde) kullanıcının onayladığı H1–H8 kararlarıyla 16 madde ele alındı.
  - Ana sayfanın referans verdiği toplam boyut 20,1 MB'tan 5,6 MB'a indi.
  - `/2027/max` sayfasında mobilde video indirmesi 0'a indi.
  - GA4, Vercel ölçümleri ve YouTube/Maps gömmeleri çerez onayına bağlandı. CSP, GA4 veri gönderimine izin verecek şekilde düzeltildi.
  - Kırık YouTube kanal bağlantısı, allplan.com'un verdiği adresle değiştirildi.
  - Statik dosyalara 7 gün önbellek eklendi; Node sürümü her yerde 24.
  - Erişilebilirlik düzeltmeleri: kontrast, tablo ARIA, iletişim başlığı.
- Plan: `docs/superpowers/plans/2026-11-03-prelaunch-hardening.md`. Kanıt: `docs/verification/prelaunch-hardening-2026-11-03.md`.
- D2 (CSP `unsafe-inline`) ve D3 (`access-control-allow-origin: *`) kod değişmeden kabul edilen risk olarak belgelendi.
- **Kullanıcı kararı bekleyenler:**
  - BIMFlex videosu YouTube'da özel; kart kaldırılsın mı?
  - YouTube kartının metni.
  - Onayı geri çekme arayüzü.
  - AI görsellerinin hakları.
  - Vercel Analytics'in panelden etkinleştirilmesi.
- Push, PR ve deploy kullanıcı onayı bekliyor.

## 02.11.2026 — Yayın öncesi engeller E1–E5 kapatıldı (yerel)

- Bağımsız inceleme raporundaki beş yayın engeli `codex/prelaunch-blockers` dalında kapatıldı: önizleme bayrağı `ALUPLAN_SHOW_2027` ve `ALUPLAN_BLOCK_INDEXING` olarak ayrıldı; 2027 rotalarına canonical, OG ve JSON-LD eklendi, rotalar sitemap'e girdi; ürün, eklenti, eğitim ve AX3000 kart bağlantıları, AX3000 doküman indirmeleri ve lisans operasyon bağlantıları kaynaktan geri getirildi.
- Plan: `docs/superpowers/plans/2026-11-02-prelaunch-blockers.md`. Kanıt: `docs/verification/prelaunch-blockers-2026-11-02.md`. Kalan bağlantı farkları: `docs/verification/main-link-gap-2026-11-02.md`.
- Kapılar: 224 unit test, 36/36 parite, 45/45 token, typecheck, iki bayrak ayarında production build ve `pnpm audit --prod` geçti. Yerel production'da masaüstü ve 375 px tarayıcı kabulü yapıldı.
- **Deploy öncesi zorunlu:** Vercel'de Preview ve Production için `ALUPLAN_SHOW_2027=1` ve `ALUPLAN_BLOCK_INDEXING=1` tanımlanmalı, ardından `ALUPLAN_2027_PREVIEW` kaldırılmalı. Eski değişken tek başına kalırsa `next.config.mjs` build'i bilerek durdurur. Vercel'de Preview ortamında bayrak tanımlı olmadığı için PR önizlemesi eski ana sayfayı gösteriyor (Vercel önizlemeyi kendi `noindex` başlığı ve kimlik doğrulamasıyla koruyor).
- 03.11.2026: PR https://github.com/hazarvolga/aluplan-2027/pull/3 açıldı (`main` hedefli, 3/3 kontrol geçti, birleştirilebilir). Merge, deploy ve Vercel ortam değişikliği kullanıcıda.
- 03.11.2026: kullanıcı kararıyla `/2027/compare` sayfasındaki "Bu yerel inceleme… doğrulanmalıdır." notu kaldırıldı; "Sürüm bağlantıları mevcut yerel ürün sayfalarına gider." cümlesi kullanıcı kararıyla korundu.
- 03.11.2026: kullanıcı kararıyla ürün yaşam döngüsü sayfası `/product-lifecycle` adresine taşındı (eski `/preview/product-lifecycle` 308 yönleniyor); indekslenebilir metadata, JSON-LD ve sitemap kaydı eklendi.
- Açık kararlar: 2027 başlık/açıklama metinleri (K3), `/2027/features` H1'i, bağlantı farkı D bölümü, AI/FRILO OG görselleri.

## 02.11.2026 — Ara verme ve bağımsız yayın öncesi inceleme

- Proje, Vercel üzerinde firma içerik incelemesine açıktır: https://aluplan-2027.vercel.app/. Bu adres gerçek alan adına geçiş anlamına gelmez; 02.11.2026 kontrolünde ana sayfa HTTP 200 ve `X-Robots-Tag: noindex, nofollow` döndürdü. `aluplan.com.tr` üzerinde yeni sürümün yayına alındığı doğrulanmadı.
- Yerel çalışma dalı `codex/page-end-conversion-design` son commit `2103e3b`; yerel `origin/main` referansı `04680a4` ve bu commit çalışma dalını içeriyor. Bu tespit yerel Git referansına aittir; bu oturumda uzak sunucudan fetch ve Vercel deployment–commit eşlemesi yapılmadı.
- Ana sayfa hero ve ALLPLAN ürün sekmesi `/2027/features` hedefine yönelir; mevcut `/products/allplan` rotası korunmuştur. Önceki tarihli, sekmenin başka hedefe gittiğini söyleyen notlar tarihsel kayıttır. Karşılaştırma butonları ve üretim bayrağı dahil tüm hedefler bağımsız olarak yeniden taranmalıdır.
- Vercel'de ana sayfanın altı ürün sekmesinin görselleri masaüstü tarayıcıda yüklendi ve sekme geçişleri gözlendi. Bu, tüm cihazlarda görsel kabul veya bütün sayfaların kaynakla eşleştiği anlamına gelmez.
- Son kayıtlara göre 189 test, typecheck ve bayraklı build geçti; bunlar önceki oturumun sonuçlarıdır, bu dokümantasyon güncellemesinde yeniden çalıştırılmadı. Max videolarının tamamının oynatılması, kaynak içerik/medya eşleşmesi ve kullanım hakları, form ve CTA hedefleri, SEO/indexleme ve gerçek alan adı yayın planı ayrıca doğrulanmalı.
- Çalışma ağacında daha önceden var olan `next-env.d.ts` değişikliği ve takip edilmeyen `.claude/` bulunuyor; inceleyen ajan bunları korumalı. Bu oturumda handoff ve inceleme istemi dışında kod değişikliği yapılmadı. Bu belge güncellemeleri henüz commitlenmedi veya push edilmedi.
- Sıradaki adım: `docs/verification/prelaunch-independent-review-prompt.md` istemiyle salt-okunur bağımsız inceleme yaptırmak; bulguları değerlendirip düzeltmeleri ve gerçek yayın adımlarını ayrıca planlamak.

## 29.10.2026 — ALLPLAN Max hero önizleme taslağı

- Partner kategorisi kaldırılırken hot reload ile eski seçili sekme indeksi korunabildiği için oluşan `serviceTitles` runtime hatası giderildi: geçersiz seçim ilk görünür gruba güvenle düşer ve boş grup durumu kontrol edilir.
- Kullanıcı isteğiyle Profesyonel Hizmetler alanında Partner erişimi kategorisi ve tek listedeki Partner kaydı yalnız 2027 önizlemesinde kaldırıldı; kalan 19 kaynağın sayacı güncellendi, mevcut ana sayfa korunur.
- Kullanıcının isteğiyle 2027 ana sayfa önizlemesindeki “Teknik Özellikler / Q3 2026 Matrisi” bölümü gizlendi. Mevcut ana sayfadaki bölüm, kaynak veriler ve PDF dosyası korunuyor.
- Kullanıcı yuvarlatılmış buton istemediğini tüm site için netleştirdi. `semantic.radius.button` sıfır değerli bağımsız token olarak tanımlandı; ortak buton aliası ve uygulamadaki buton kontrolleri bunu kullanır. Form input radiusu ve dekoratif noktalar ayrı kalır.
- Kullanıcı isteğiyle 2027 hero butonları daha kompakt ölçüye alındı, köşeleri sıfırlandı; asgari etkileşim hedefi korunur. Değişiklik yalnız önizleme hero'sunu etkiler.
- Kullanıcının isteğiyle 2027 hero'nun en üstündeki “2027 YENİLİKLERİ” ve “ALLPLAN 2027” kutulu etiketleri kaldırıldı; üst başlık ve ana başlık korunur.
- Kullanıcı tekrarlanan MAX odağı yerine genel ALLPLAN 2027 yeniliklerinin hero'da anlatılmasını onayladı. Başlık ve açıklama `allplan-2027-features.md` giriş bandındaki TR taslaktan alınarak önizlemeye taşındı; FRILO kullanıcı kapsamı gereği çıkarıldı. MAX alt sekmede varsayılan açık kalır; yenilikler CTA'sı yerel sayfa hazır olana kadar kullanıcının verdiği üretici URL'sine yönlenir.
- Hero altındaki beş ürün bandı sekmelere dönüştürüldü; ALLPLAN Max varsayılan açık, panel içinde envanter kaynak ID'li açıklamalar ve geçerli keşif bağlantıları bulunur. Klavye ile sekme geçişi ve hareket azaltma desteği eklenmiştir. Yalnız önizleme varyantında çalışır.
- Kullanıcının verdiği ALLPLAN hero altı bant örneği, FRILO hariç beş ürün ve Türkçe açıklamalarıyla yalnız önizlemede uygulandı. ALLPLAN, Civil ve SDS2 mevcut yerel rotalara; Max ve SCIA yerel sayfaları hazır olana kadar mevcut resmî üretici adreslerine gider. Ürün rota/IA kararları hâlen açıktır.
- MAX önizleme başlığı daha küçük `--type-h2-size` ölçeğine alındı ve mevcut hero'nun 14ch genişlik sınırı önizlemede genişletildi; masaüstünde iki satır hedeflenir, dar ekranlarda metin doğal kırılır.
- Kullanıcı ilk üretilen görseli yoğun buldu; daha sade bina/dijital ikiz görseli üretildi. Yeni orijinal `assets/source/generated/heroes/max/allplan-max-hero-v2-original.png`, web türevi `public/assets/previews/home-2027/allplan-max-generated-v2.jpg`. Hero sağa yaslanıp sola maskeyle karışır; üst satır büyütüldü, H1 küçültülüp iki satıra ayrıldı. İlk görsel korunuyor, görsel/mobil kabul bekliyor.
- Kullanıcı hero metnini ikiye ayırdı: üst satır “Mühendislik için yapay zekâ”, H1 “Sadece otomatikleştirmeyin, yenilik geliştirin”. Önizlemeye özel yeni köprü/dijital ikiz görseli built-in imagegen ile üretildi; yüksek çözünürlüklü orijinal `assets/source/generated/heroes/max/allplan-max-hero-v1-original.png`, web türevi `public/assets/previews/home-2027/allplan-max-generated-v1.jpg`. Önceki üretici dosyaları silinmedi. Görsel tasarım onayı bekler; AI görseli gerçek proje veya mühendislik doğruluğu iddiası değildir.
- Kullanıcının 29.10.2026'da paylaştığı ALLPLAN ana sayfa MAX hero ekran görüntüsündeki başlık ve açıklama, mühendislik terminolojisiyle Türkçeye çevrilerek önizlemeye işlendi. Kaynak, ürün detay sayfasındaki hero metninden farklıdır; CTA hedefleri korunmuştur.
- Kullanıcı, 2027 ana sayfasında altı slayt yerine tek Allplan Max hero yönünü seçti. Başlık ve açıklama `docs/content-2027/allplan-canlı/allplan-max.md` dosyasındaki `live.max.hero.*` TR taslak satırlarından alınarak `src/data/homepage-2027-preview.json` içinde tutuldu.
- `Homepage2027PreviewView` yalnız önizlemeye özel hero varyantını açar; ana `/` mevcut hero'yu korur. MAX keşif CTA'sı yerel ürün sayfası hazır olana kadar üreticinin `https://www.allplan.com/allplan-max/` sayfasına, teklif CTA'sı mevcut Microsoft Forms hedefine gider.
- Üretici envanterindeki masaüstü ve mobil hero görselleri yerel önizlemede kullanıldı; SHA-256 ve izin durumu `docs/brand/assets-license-log.md` içinde kayıtlı. Yayın izni doğrulanmadı. "Her 2027 ürününe dahildir" üreticinin envanterdeki iddiasıdır; Türkiye'deki ticari kapsam yayın öncesi doğrulanmalıdır.
- Kullanıcının tespit ettiği hero katman sorunu, önizleme içeriği `--z-content` ve dekoratif karartma `--z-scrim` seviyesine açıkça yerleştirilerek düzeltildi; karartma işaretçi olaylarını da almıyor.
- Sıradaki adım kullanıcıyla yerel hero görseli ve metnini gözden geçirmek; MAX detay sayfası henüz oluşturulmadı.

## 29.10.2026 — Yerel 2027 ana sayfa önizleme rotası

- Mevcut `/` ana sayfası değiştirilmeden restore ref oluşturuldu: `restore/pre-home-2027-preview-20261029` → `77bfccf`.
- Yeni yerel önizleme rotası `src/app/preview/home-2027/page.tsx` altında kuruldu. Rota, sonraki 2027 değişikliklerini public görünümden ayıran `Homepage2027PreviewView` giriş noktasını kullanır; bu sınır şimdilik mevcut `HomepageView` bileşenini ve mevcut tek veri kaynağını yeniden kullanır. JSX, homepage verisi veya JSON-LD kopyası üretmez.
- `/preview/home-2027` geliştirme ortamında ana sayfayla aynı 8 bölüm, aynı H1 ve aynı 97 bağlantıyı render eder. Metadata `noindex, nofollow, nocache`; rota navigation, `pages.json` ve sitemap dışında tutulur.
- Production ortamında rota `notFound()` ile içerik sunmaz. Yerel production server kabulünde `/` → HTTP 200, `/preview/home-2027` → HTTP 404 ve preview HTML içinde ana sayfa H1'i yoktur.
- TDD sözleşmesi `tests/test_home_2027_preview.py`: önizleme izolasyonu, noindex/production guard, sitemap/navigation/data dışılığı ve ana `/` otoritesinin korunmasını doğrular.
- Tam kapılar: 186 unit test, 4 kaynak sözleşmesi, 36/36 faz paritesi, 45 token testi, 188 kontrast kontrolü, typecheck ve 119 sayfalık production build geçti. In-app browser Work ayarlarında devre dışı olduğundan görsel tarayıcı otomasyonu kullanılamadı; çalışan dev HTML paritesi gerçek HTTP yanıtları üzerinden doğrulandı.
- Önizleme adresi: `http://127.0.0.1:3001/preview/home-2027`. Kullanıcı değişiklik listesini iletene kadar içerik, bölüm sırası ve tasarım değiştirilmemiştir. Push/deploy/canlı değişikliği yoktur.

## 29.10.2026 — Hero aileleri 99 route üzerinde yerel olarak entegre edildi

- Kullanıcının temas sayfasında onayladığı `VF-00`–`VF-08` görsel ailesi, içerik ve schema katmanlarından bağımsız `src/components/sections/subpage-hero-presentation.ts` politikasıyla uygulandı. Kapsamdaki **99/99** route açıkça eşlenir; yinelenen route modül yüklenirken hata verir ve bağımsız fixture uygulamadaki route haritasıyla birebir karşılaştırılır.
- `VF-00`–`VF-07` için masaüstü ve mobil türevler responsive `<picture>` ile seçilir. `VF-08` yıllık sürüm rotaları mevcut resmî/kaynak görsellerini korur. Kapsam dışındaki Hakkımızda ve yasal sayfalar framed fallback sunumunu sürdürür.
- Hero bileşeninde yalnız sunum değişti; H1, breadcrumb, açıklama, CTA hedefleri, kaynak içerik kaydı, URL ve JSON-LD/schema verisi değiştirilmedi. Eski kaynak hero, background-only rotalarda ikinci ağ isteği oluşturmaması için DOM'a gizli `<img>` olarak basılmaz; parite veri/test katmanında korunur. Responsive aile görselleri Next.js `getImageProps()` ile optimize `srcSet` üretir.
- Yerel CDP taraması 99 masaüstü + 99 mobil görünümde aile kimliği, doğru `currentSrc`, tek H1, kırık görsel yokluğu ve yatay taşma yokluğunu doğruladı; hata `0`. Temsilî masaüstü görsel kontrolü Mimari, Altyapı, Diğer Çözümler ve Eğitim rotalarında; mobil kontrol Mimari rotasında yapıldı. Kanıt: `docs/verification/hero-family-browser-audit-2026-10-29.json`.
- Tam kapılar: 182 unit test, 4 kaynak sözleşmesi, 36/36 faz paritesi, 45 token testi, 188 kontrast kontrolü, typecheck ve 118 sayfalık production build geçti. Build canlıya alınmadı; push/deploy/canlı değişikliği yoktur.
- Code/security re-review blocking bulgu vermedi. Non-blocking bakım notu: interaktif 99×2 CDP kabul döngüsünü ileride repo-owned script haline getirmek ve uzun route dizilerini yalnız okunabilirlik amacıyla çok satırlı biçime taşımak.
- Sıradaki insan kabulü, yerel sitede aile bazlı görsel dilin son kontrolüdür. Yeni istisna görsel yalnız semantik temsil, responsive kırpma, erişilebilirlik veya dönüşüm gerekçesi belgelenirse açılmalıdır.

## 29.10.2026 — Hero aile görselleri üretildi; rota entegrasyonu onay bekliyor

- Onaylanan aile planındaki yedi eksik görsel (`VF-00`, `VF-02`–`VF-07`) built-in `image_gen` ile aile başına tek çağrıda üretildi. Mevcut onaylı mimari prototip `VF-01` olarak aynı arşiv yapısına kopyalandı; toplam sekiz aile adayı hazırdır.
- Yüksek çözünürlüklü PNG orijinaller `assets/source/generated/heroes/families/`, masaüstü ve deterministik sağa yaslı `4:5` mobil JPEG türevleri `public/assets/heroes/families/` altında saklanır. Orijinaller başka işlerde yeniden üretim gerektirmeden kullanılabilir.
- Boyut, dosya büyüklüğü ve SHA-256 kayıtları `assets/source/generated/heroes/families/manifest.md`; sağlayıcı, kullanım amacı, hak/lisans dayanağı ve yayın durumu `docs/brand/assets-license-log.md` içinde tutulur. Hak/şart doğrulaması ve site geneli yayın onayı beklemededir.
- Karşılaştırmalı masaüstü/mobil önizleme `docs/previews/hero-family-contact-sheet/index.html` altında hazırlandı. `VF-05` teknik olarak geçerli olmakla birlikte bina-merkezli kompozisyonu nedeniyle `VF-07` ile görsel ayrışma kontrolüne açık bırakıldı; otomatik ikinci üretim yapılmadı.
- Asset sözleşmesi sekiz PNG orijinali, on altı JPEG türevi, dosya imzalarını, responsive en-boy oranlarını, manifest hash eşliğini, temas sayfası kapsamını ve Git takibini doğrular (`tests/test_hero_family_assets.py`).
- Makine-okunur `crop-recipes.json`, her türevin kaynak-piksel koordinatını ve JPEG kalite ayarını kaydeder; test mobil kırpmaların tam yükseklik ve sağa yaslı olduğunu doğrular. Son kontrol: 177 unit test, 36 faz paritesi, 45 token testi, 188 kontrast kontrolü ve typecheck geçti. Code/security re-review Critical/High/Medium bulgu vermedi.
- Bu fazda route eşleme, içerik, schema veya hero bileşeni değiştirilmedi. Sıradaki karar temas sayfasındaki sekiz ailenin görsel onayıdır; onaydan sonra aile–route sunum politikası ayrı fazda uygulanacaktır.

## 29.10.2026 — Yedi hero ailesi için prompt briefleri

- Kullanıcı route–görsel ailesi tablosunu onayladı; sonraki adım olarak yalnız prompt-brief fazına geçildi. `imagegen` skillinin prompt sözleşmesine göre `docs/hero-visual-prompt-briefs.md` hazırlandı.
- Ortak sanat yönetimi: 16:9 geniş kadraj, solda %45 sakin/koyu metin güvenli alanı, sağda ana konu, antrasit/graphite temel, kontrollü teal-cyan teknik vurgu, gerçekçi AEC malzemeleri ve sahte UI/logo/metin yasağı.
- Art-direction review sonrası responsive sözleşme somutlaştırıldı: masaüstü `1440×520` mevcut `contain/right` sunumu ve `0/28/82/100%` maskeyi; tablet `1024×520` focal-X kontrollü `cover` sunumunu; mobil `390×640` ise aynı orijinalden tam yükseklik ve sağa yaslı `x=55–100%, y=0–100%` kırpma ile üretilen deterministik `4:5` türevi ve CSS-owned dikey fade'i test eder. Mobil türev başarısızsa ayrı üretim otomatik yapılmaz, yeniden onay gerekir.
- Her yedi prompt bloğu artık tek başına çalışacak şekilde logo/trademark/UI/metin ve baked gradient/scrim/vignette yasağını tekrarlar. Fade yalnız CSS katmanında üretilir.
- Marka kılavuzundaki kaynak/lisans izi için `docs/brand/assets-license-log.md` oluşturuldu ve mevcut `VF-01` prototipi ilk kayıt olarak işlendi; kaynak/provider alanlarından ayrı hak/lisans dayanağı ve doğrulama durumu tutulur. Yeni ailelerde manifest ile birlikte bu kayıt zorunludur.
- Yedi eksik aile için ayrı üretim promptu ve kabul sinyali tanımlandı: `VF-00`, `VF-02`, `VF-03`, `VF-04`, `VF-05`, `VF-06`, `VF-07`. Mevcut onaylı `VF-01` görsel kalite ve kompozisyon referansıdır.
- Üretim sırası maliyet ve tekrar azaltacak şekilde aile başına tek built-in `image_gen` çağrısıdır; başarısız aile yalnız hedefli tek değişiklikle yeniden denenir. CLI/API fallback planlanmadı.
- Henüz yeni görsel üretilmedi, asset taşınmadı ve site geneli route eşleme kodu yazılmadı. Sıradaki karar prompt setinin görsel üretim için onayıdır.

## 29.10.2026 — Hero görsel aile planı

- Kullanıcı, her route için ayrı görsel yerine üst çözüm ve ürün aileleri altında ortak hero görselleri kullanılmasını onayladı. Plan `docs/hero-visual-family-plan.md` dosyasına kaydedildi.
- Güncel `src/data/pages.json` içinde `section` değeri `products`, `solutions`, `solutions-v2`, `training` veya `video-library` olan rotaların **99/99** adedi ortak görsel ailesine açıkça atandı; eksik rota `0`.
- İlk varlık kapsamı sekiz ortak görsel ailesidir: ekosistem, bina tasarımı, altyapı/Civil, inşaat/imalat, eklentiler/teknik araçlar, tamamlayıcı/bulut hizmetleri, eğitim/destek ve ALLPLAN ürün platformu. Bina tasarımı için onaylı prototip hazırdır; bu nedenle **1 mevcut + 7 yeni üretim** planlanır. Yıllık sürüm ailesi resmî/onaylı 2027 materyali gelene kadar mevcut kaynak medyayı korur.
- Bridge, AX3000, Scalypso ve benzeri rotalar başlangıçta üst aile görselini kullanır; yalnız semantik temsil, responsive kırpma, erişilebilirlik veya dönüşüm gerekçesi kanıtlanırsa özel görsel istisnası açılır.
- Video playlist rotaları da varsayılan Eğitim/Destek ailesine dahildir; gövde içindeki playlist thumbnail'ları korunur, özel hero kararı otomatik verilmez.
- Hero aile planının onayından sonra yedi eksik aile için henüz üretim yapılmadı; mevcut onaylı `VF-01` mimari prototipi başlangıç varlığıdır. Rota eşleme kodu henüz yazılmadı. Sıradaki adım yedi eksik aile için ortak sanat yönetimiyle prompt brieflerini hazırlayıp görsel üretimine geçmektir.

## 29.10.2026 — Mimari hero background-only prototipi

- Kullanıcı isteğiyle yalnız `/solutions/architecture` rotasında sağdaki tekrarlı hero görsel kartı kaldırıldı; diğer rotalar `framed` sunumu korur. Sunum kararı içerik/schema katmanından ayrı `subpage-hero-presentation.ts` politikasındadır.
- Yeni hero, `Architecture & Space` stil kütüphanesiyle built-in `image_gen` üzerinden üretildi. Web türevi `/assets/solutions/architecture-hero-v2.jpg`; 1672×941 yüksek çözünürlüklü PNG orijinali ve tam promptu `assets/source/generated/heroes/` altında arşivlendi.
- Kullanıcı görsel geri bildirimiyle metin alanındaki çizgi, arka plan ve padding tamamen kaldırıldı. Görsel `contain`, sağ-orta konum ve tekrarsız sunumla küçültülerek mimari/dijital ikiz anlatımı okunur hale getirildi. İlk maskenin gerçek görsel başlangıcında kısa kalması üzerine rota kapsamlı geçiş hero genişliğinin `%28–%82` aralığına yayıldı; sol taraf transparanlaşarak antrasit zeminle yumuşak birleşiyor, sağdaki mimari odak tam görünür kalıyor.
- H1, breadcrumb, açıklama, CTA hedefleri, schema ve generated content değişmedi. Mimari hero’da görünür media kartı `0`; kontrol rotası `/solutions/structural` kartlı düzeni `1` olarak koruyor.
- Yeni dosya sözleşmesi JPEG/PNG imzası, boyut, 1672×941 kaynak ölçüsü ve Git takibini test eder. Son doğrulama: 172 test, 36 faz paritesi, 45 token, 188 kontrast, typecheck ve 110 rota render audit; hata `0`. Code/security review Critical/High/Medium bulgu olmadan onaylandı.
- Bu prototip diğer hero rotalarına yayılmadı. Site geneline uygulama, kullanıcı görsel onayından sonra ayrı fazdır. Push/deploy/canlı değişiklik yoktur.

## 29.10.2026 — Üç ürün sayfasının canlı envanteri (features / civil / SDS2) tamamlandı

- **Yeni envanter dosyaları** (`docs/content-2027/allplan-canlı/`): `allplan-2027-features.md` (121 görünür + 55 gizli karusel bloğu), `allplan-civil.md` (203 blok + zorluk/müşteri sözü/başarı hikâyesi kartları), `allplan-sds2-detailing-fabrication.md` (hero "SOLUTIONFOR" dahil tüm bantlar; VERSION 2027 üç yenilik; 3 söz; Deloitte/Dow/Winter Olympic hikâyeleri; explore/training/partner). EN birebir (kaynak hatalı birleşik yazımlar "Kaynak notları"nda), TR taslak.
- **Medya:** her sayfaya ayrı klasör, toplam **94 görsel (~9,8 MB)** indirildi ve `file` tipi denetimi temiz: features 16 (2,8 MB), civil 58 (~3,7 MB), sds2 20 (~3,3 MB). `media/manifest.md` artık dört sayfayı kapsar (SHA-256 ilk 16 hane + boyut + görev).
- **Bozuk kaynak:** features sayfasındaki gizli Civil slayt videosu `Editable_Stationing.mp4` canlı sunucuda **HTTP 404** — image ve video başlıklarıyla iki kez denendi, indirilemedi; manifest ve envanterde notlu.
- **Video/embed politikası:** YouTube gömeleri yalnız referans (civil 18 benzersiz göme, features hiç yok, sds2 hiç yok); civil müşteri sözü videoları `event.allplanplus.com` oturum bağlantıları (base64 encoded) olarak kayıtlı. Takip pikselleri (bat.bing/adsct) indirilmedi.
- **Kaynak quirks envanterde belgelendi:** SDS2 İtalalyan URL'leri (`/it/soluzioni-per-settore/…`, "Steel Fabrication" `it/it` çift kodu), Civil `7xzpEhLQhEI??rel=0` çift soru işareti, "Success StoriesCUSTOMER", "Midlands, Michigan" (doğrusu Midland), "View all training" href artık `?`, boşluksuz stat/benefit etiketleri, sözlerde ad/unvan yok.
- **Commit:** `7f1a69d` — 99 dosya (3 envanter + manifest + README tablosu + 94 görsel). Push/merge/deploy yok.
- **Sıradaki adım:** kullanıcı onayıyla dört canlı envanter Aşama C'ye (02-inventory sayfaları) işlenecek; öncelikle features sayfasındaki gizli karusel içeriklerinin C katmanına nasıl bağlanacağı kararı.
- **Kullanıcı kararı (29.10.2026):** canlı envanter ve üretim yalnız **EN + TR**; SDS2 İtalyan URL'leri gibi diğer dil kaçışları envanterde kayıtlı kalır ama üretimde EN/TR karşılıklarıyla çözülür (`docs/00-inventory/user-decisions.md` eki).
- **Geçici çınlar:** `/tmp/acookies.txt`, `/tmp/dl_urls.txt` vs. envanter dalında kalıcı değildir; DOM'dan yeniden üretilebilir.

## 29.10.2026 — Canlı Allplan Max sayfa envanteri ve medya arşivi (allplan-canlı/)

- **Yeni klasör:** `docs/content-2027/allplan-canlı/`. Canlı `https://www.allplan.com/allplan-max/` sayfasının render edilmiş DOM'undan içerik envanteri çıkarıldı: görsel sıra (y konumu) ile tüm metin blokları; EN **birebir** (kaynaktaki yazım hataları dahil, "Kaynak notları" bölümlerinde belgelendi), ayrı TR **taslak** kolonu.
- **Medya:** `media/` altına 13 varlık indirildi — 9 görsel (~1,4 MB) + 4 video (~37 MB: hero tanıtım 25,4 MB ve 3 özellik videosu). `media/manifest.md` SHA-256, boyut ve canlı konum içerir. Takip istekleri (bat.bing, adsct) indirilmedi; 7 YouTube gömesi yalnız referans olarak envanterde kayıtlı (`[in Beta]` AI BIM Modeler dahil).
- **Yöntem notu:** Akamai bot koruması, curl'a gezgin başlık seti (UA, Accept, Accept-Language, Referer, Sec-Fetch-*) + sayfa çerezleri verilerek aşıldı; çerez dosyası geçici, DOM'dan yeniden üretilebilir.
- **Canlı–docx farkları ve 5 açık soru** envanterin sonunda kayıtlı (alıntı öznitelikleri boş, "Video ansehen" Almanca kaçışı, AI BIM Modeler eksik `Included in` etiketi, %18/%21/%24 yayın izni, kaynak metin tekrarları).
- **Kullanıcı kararı:** canlı envanter Aşama C/D makine katmanına (`content-records.json`) bağlanmadı; üretici referansı olarak ayrı durur.
- **Commit:** canlı envanter klasörü tek committe kayıt altına alındı; push/merge/deploy yok.

## 28.10.2026 — Sitewide kaynak/veri/render ve tarayıcı paritesi kapandı

- Bridge ve AEC sayfalarına kaynakta bulunmadığı halde eklenen genel MP4 fallback kaldırıldı; Bridge `SeA6ncaqUhY`, AEC `tFnwOyX7ncI` üretici YouTube içeriği korundu (`83ec79e`). `/solutions/allplan-industry` içindeki altı ürün kartı, Professional ve Ultimate dahil, ana içerikte doğrulandı.
- Kaynak → generated data sözleşmesi 110/110 route için başlık, metin, link, görsel rolü/SHA-256, video/embed ve yerel dosya paritesini doğruluyor; onaysız fark yok (`2396e88`).
- Generated data → yalnız `<main>` render sözleşmesi 110/110 HTTP 200, 110/110 tek H1, 94 tam geçiş, 16 exact-policy etkileşim farkı ve `0` failure verdi (`0d806e4`). 16 fark, varsayılan olmayan tab/FAQ kategorilerindeki 303 metindir; route + sayı + pointer/metin digest değişirse denetim fail olur.
- Gerçek headless browser kabulünde 110 route × masaüstü/mobil = 220 kontrol yapıldı: navigasyon, H1, yatay taşma ve yüklenemeyen görünür görsel hatalarının tümü `0`. Workflow klavye seçimi, mobil menü, tema, lightbox, FAQ, eğitim tabı, referans filtre/arama ve playlist seçimi ayrıca gerçek tarayıcıda çalıştı; sekiz sonucun rota/eylem/beklenen/gözlenen kaydı `browser-interaction-audit.json` içinde tutulur.
- Tam doğrulama: `pnpm test` 170 test, 36 faz paritesi, 45 token, 188 kontrast; `pnpm typecheck`; 118 route production build; production dependency audit bulgusuz. Bağımsız code ve security review Critical/High/Medium bulgu vermedi.
- Kanıtlar `docs/verification/sitewide-parity-2026-10-28/` altındadır. Otomatik kontroller statik içerik/kart/medya/link kaybı için sayfa sayfa manuel karşılaştırma gereksinimini ortadan kaldırır. Etkileşim kabulü sekiz temsilî akışla sınırlıdır; tüm etkileşimlerin editoryal, görsel ve davranışsal son onayı insan kontrolüdür.
- Canlı sistem, kaynak 2026 ve deploy durumu değiştirilmedi; push/deploy yapılmadı. Yerel `:3001` geliştirme sunucusu kullanıcı incelemesi için açık bırakıldı.

## 28.10.2026 — Aşama C onayı ve Aşama D tamamlandı (makine okunur içerik katmanı)

- **Onay:** kullanıcı Aşama C çıktılarını onayladı; FRILO/SCIA/Max rota yapısı, sayısal iddia yayın izinleri ve görsel atamaları hâlâ `02-inventory/open-decisions.md`'de bekliyor.
- **Yeni betik:** `scripts/build_content_records.py`. Envanter birimlerini aynı çözümleyici ile makine okunur kayıtlara döker ve `docs/content-2027/03-data/content-records.json` yazır. Deterministik (`--check` bayt eşliği doğrular), üçüncü parti bağımlılık yok.
- **Çıktı:** 394 kayıt / 10 sayfa; alanlar `id`, `page`, `role*`, `sourceFile`, `sourceLocator` (`slug#bN[@part]`), `sourceHash` (SHA-256), `bodyEn` (birebir), `bodyTr` (taslak), `trStatus: draft`, `note`. Sözleşme: `03-data/README.md`.
- **Commitler:** Aşama A/B/C çıktıları ve hattın betikleri farklı commitlerde kayıt altına alındı; push/merge/deploy yok.

## Oturum kapanışı — 28.10.2026

- Kullanıcı: "böylece kalsın sonra devam ederiz". Genel durum: Aşama A–D tamamlandı ve commit'li; statik durum/to-do sayfası `docs/content-2027/status.html` yayında önizlenebilir (Review pane).
- **Sıradaki oturum açılışı:** `docs/MASTER-PROMPT.md` → bu dosyanın üst kayıtları → `docs/content-2027/02-inventory/open-decisions.md` (15 açık karar) → kullanıcı kararları.
- **Bekleyen:** B3 (14 İngilizce brief indirme, kullanıcı), B4 (pptx kapsam kararı, kullanıcı), TR taslak editör turu, FRILO/SCIA/Max/Parametric/Rebar rota kararları, görsel atamaları, yayın izinleri.
- Push/merge/deploy yok; çalışmada önceki oturuma ait parite dosyaları (sitewide parity) bilinçli olarak dokunulmadan bırakıldı.

## Güncelleme tarihi ve oturum no
28.10.2026 — 2027 içerik envanteri Aşama A–C, B5, B6 ve D tamamlandı: 10 sayfa / 394 içerik birimi, `content-records.json` üretildi ve check temiz. B3 (İngilizce brief indirme) ve B4 (pptx kapsamı) karar bekliyor.

## 28.10.2026 — 2027 içerik envanteri, Aşama C (web içeriği envanteri + TR taslak)

- **Kapsam:** tüm kök klasörlerden 10 hedef sayfa × 394 içerik birimi; her kayıt `slug#bN` blok adresi + birebir EN metin + ayrı TR **taslak** kolonu. Kişisel veri, görüntü kredisi ve maskeli satırlar envantere girmedi.
- **Yeni betikler:** `scripts/source_blocks.py` (Stage B yüzeyinden blok adresleri üretir; 20 belge / 775 blok), `scripts/build_web_inventory.py` (satır çözümü, Markdown render, `--check` kapsama/TR/ID denetimi), `scripts/inventory_units/` (sayfa bazlı içerik birimi modülleri: allplan, allplan-parametric, allplan-rebar, allplan-max, allplan-civil, frilo, scia, sds2).
- **Çıktılar:** `docs/content-2027/02-inventory/pages/*.md` (10 dosya), `README.md`, `routes.md` (110 mevcut rota + 5 yeni rota önerisi), `open-decisions.md` (15 açık karar), `source-coverage.md` (13 web docx / 761 blok kapsama tablosu).
- **Bire birlik garantisi:** EN hücresi elle yazılmaz; betik Stage B çıktısındaki bloktan kopyalar. Tekrar eden metinler (FRILO/SCIA özellikleri, sürüm `VERSION 2027` etiketleri, Max anket etiketi) bir kez tanımlanıp `ref()` ile referanslanır; `--check` aynı metnin ikinci tekrarını kapsamış sayar.
- **Denetim:** `build_web_inventory.py --check` → "Sorun yok. 10 sayfa, 394 içerik birimi". Kapsam kuralı: web sayfası olmayan belgeler (7 sales PDF/cheat sheet web sürümü) kapsam dışı; NON_CONTENT desenleri satış notlarını saymaz.
- **Açık sorunlar 02-inventory/open-decisions.md içinde:** FRILO/SCIA rota yapısı, Max ile sürüm sayfaları çakışması, Parametric/Rebar yeni rotaların kararı, sayısal iddia yayın izinleri, SDS2/Max ana görselleri, Bimplus değişiklik hedefi ve kaynak metin hataları (Max pillar-2 tekrarı, FRILO Geotechnics Ultimate başlığı).
- **Bekleyen girdiler:** B3 (14 İngilizce messaging brief, SharePoint indirilmesi) ve B4 (pptx kapsam kararı). Aşama D (makine okunur `content-records.json`) onay sonrası.
- Push/merge/deploy/canlı değişiklik yapılmadı.

## 28.10.2026 — Header/footer sosyal bağlantıları ikon-only

- Header topbar ve footer sosyal bağlantılarındaki görünür kanal adları kaldırıldı; Facebook, Twitter/X, LinkedIn, Instagram ve YouTube yalnız ikonla gösteriliyor.
- `aria-label`, hedef URL, yeni sekme davranışı ve `noopener noreferrer` korundu. DOM kabulünde 10 bağlantının görünür metni boş, erişilebilir adı ve tek ikonu mevcut.
- Erişilebilirlik regresyon testi eklendi; `pnpm test` toplam 147 birim testi, 36 parite ve 45 token testiyle geçti. Push/deploy/canlı değişikliği yapılmadı.

## 28.10.2026 — 2027 içerik envanteri, Aşama B1–B2 (metin çıkarımı)

- **Yeni betik:** `scripts/extract_source_text.py`. Yalnız `docs/content-2027/01-source-text/` altına yazar, stdlib dışında bağımlılık yok, deterministik (iki çalıştırmada bayt-eş çıktı doğrulandı).
- **Çıktı:** 13 dosya `01-source-text/web-pages/`, 1 dosya `01-source-text/editions/editions-2027.md`, indeks `01-source-text/README.md`. Toplam 49.070 karakter kaynak metin.
- **Birebirlik kanıtı:** her docx için `verify_docx()` kaynaktaki her paragrafın çıktıda aynen bulunduğunu doğrular — 13/13 dosyada kayıp paragraf 0. Edition sayfasında kaynak `# characters:` kolonu gerçek uzunlukla karşılaştırılır — 18/18 eşleşiyor.
- **Biçim kararı:** 2027 docx'lerinde başlık stili yok (yalnız `Normal`); yapı doğrudan kalın biçimlendirmeyle taşınıyor. Bu yüzden tamamen kalın paragraflar `**…**` olarak yazılır. `Home Page Slides`, `FRILO Edition Pages` gibi başlık stili olan dosyalarda `#`/`##`/`###` kullanılır.
- **Düzeltilen varsayım:** üç `Launch 2027 - Intro text edition pages shop EN*.xlsx` **bayt düzeyinde farklı** (Office metadata) ama **içerik birebir aynı**. Eşitlik SHA-256 ile değil, çıkarılan hücrelerle karşılaştırılır. Kanonik kaynak: FRILO kopyası (`Copy1` işareti olmayan ilk dosya).
- **Yeni bulgular:**
  1. `Allplan Max Web Page.docx` tablosunda 9 özellik satırının görsel adı **`XXXXX`** — yer tutucu, yayına çıkmadan çözülmeli.
  2. FRILO ve Civil docx'lerinde yazar notları metnin içinde: `<237 characters>`, `<image – GEO / CLT preferably>` (toplam 42 not). Bunlar kaynakta korunur, sitede yayımlanmaz.
  3. `Allplan Max Web Page` 9 AI özelliğini tek tabloda veriyor: Feature Builder (MCP), Workflow Builder (MCP), AI Formula Writer, AI BIM Analyst, AI Structural Analyst, AI Drafter, AI BIM Modeler (Beta), AI Visualizer, AI Coach.
  4. **3 maskeleme yapıldı** (kişisel veri kuralı): SDS2 home page'de referans proje adı ve müşteri firma adı (2), Civil home page slide'da görsel kredisi — mimar firma + fotoğrafçı adı (1). Maskelenen değerler repoya yazılmadı; yayın öncesi ayrı onay gerekiyor.
- **Yapılmayanlar:** messaging brief çıkarımı (B3, İngilizce kaynak yok), pptx metni (B4, kapsam kararı bekliyor), PDF metni, proof points, TR çeviri, rota/URL önerisi. Push/merge/deploy yok.

## 28.10.2026 — 2027 içerik envanteri, Aşama A (dosya envanteri)

- **Kapsam kararı (kullanıcı):** envanter yalnız pazarlama paketini değil **tüm kök klasörleri** kapsar; belgelerden **tam metin** çıkarılır; içerik **EN kaynak aynen + ayrı TR taslak** kolonuyla tutulur.
- **Yeni betik:** `scripts/build_content_inventory.py`. Yalnız `docs/content-2027/00-census/` altına yazar, üçüncü parti bağımlılık yok, deterministik. Çalıştırma: `python3 scripts/build_content_inventory.py`.
- **Çıktılar:** `root-folder-census.md` (klasör/tür/dil/otorite özeti), `file-index.csv` (3.965 satır; yol, tür, boyut, SHA-256, ürün, dil, rol, otorite), `duplicates.md` (birebir kopya, çevrilmemiş dil varyantı, dil/sürüm grupları), `authority-map.md` (sınıflandırma + çakışma kararları + eksik kaynak listesi). Kapsam ve ilkeler: `docs/content-2027/README.md`.
- **Doğrulanan sayılar:** pazarlama paketi 916 dosya / 8,0 GB (Git dışı); 232 içerik belgesi (84 docx, 138 pptx, 5 xlsx, 8 pdf); 496 görsel, 174 video/gif. Depo toplamı 3.965 dosya / 8,3 GB.
- **Kritik bulgular:**
  1. İngilizce messaging brief'ler ve `ALLPLAN Edition Table - ALL FEATURES.xlsx` yalnız SharePoint `.url` kısayolu (14 dosya); yerel kaynak yok.
  2. FRILO (cs/es/fr/it), SDS2 (de/es/fr) ve SCIA (de/it) messaging brief'leri birebir aynı dosya — çevrilmemiş, yalnız yeniden adlandırılmış.
  3. `Aluplan Design System/` klasörü `design-system/`'in ikinci kopyası; 24 dosyada fark var. Otorite `design-system/`.
  4. `Proof Points and Usable Quotes.xlsx` kişisel veri ve `Consent: None` satırları içeriyor; envantere yalnız anonim yüzdeler alınacak.
  5. 2027'de yeni ürünler var ve mevcut IA'da rota yok: ALLPLAN Parametric, ALLPLAN Rebar, Allplan Max.
- **Yapılmayanlar:** metin çıkarımı, TR çeviri, yeni rota/URL önerisi, `HANDOFF.md` dışında mevcut doküman değişikliği. Push/merge/deploy yok.

## 28.10.2026 — Yapılandırılmış sayfa kaynak/render paritesi

- **Kök neden:** eski düz veri alanları sayfa içindeki kaynak sırasını ve iç içe bağlantı gruplarını temsil edemiyordu; bu nedenle canlıda bulunan kartlar veri üretiminde kayboluyor veya render edilmeden kalıyordu.
- **Çözüm:** sıralı ve tipli `contentBlocks` modeli ile tek renderer eklendi. Eski rotalar için geriye uyumlu fallback korunurken `/solutions/allplan-industry`, `/solutions/ax3000`, `/products/ax3000` ve `/solutions/ax3000-virtual-reality` kaynak blok düzenine geçirildi.
- **Geri yüklenen kritik içerik:** Endüstri sayfasında 3 keşif kartı / 10 alt bağlantı, 6 özellik kartı, Design-to-Build bölümü ve 6 ürün kartı; AX3000 giriş/özellik/modül ilişkileri; VR sayfasında kaynak metinleri, 5 avantaj ve 6 galeri görseli. Endüstri kartlarındaki 9 eski ve artık 404 dönen WordPress görsel URL'si, depoda bulunan semantik yerel asset karşılıklarıyla değiştirildi ve regresyon testiyle korumaya alındı.
- **Otomatik koruma:** kaynak dosya hash'i, tam `contentBlocks` hash'i, blok sırası, kaynak birim kimlikleri ve render edilmiş metin/link/görseller için sözleşme fixture'ı ve doğrulayıcı eklendi. `pnpm test` bu sözleşmeyi zorunlu olarak çalıştırır.
- **Doğrulama:** 145 birim testi, 4 rota kaynak sözleşmesi, 36 Faz 6 parite kontrolü, 45 token testi, 188 kontrast kontrolü, tip kontrolü, 118 sayfalık production build ve loopback production HTML denetimi geçti. Dört rota 390 px mobilde yatay taşma ve console/hydration hatası olmadan doğrulandı.
- **Sınır:** yalnız bu dört yüksek riskli rota sıralı modele taşındı; diğer rotalar mevcut fallback ile çalışıyor. Push/deploy/canlı değişikliği yapılmadı.

## 28.10.2026 — Çözüm katalog/hub navigasyonu düzeltmesi

- Beş footer hub'ı ile header mega menüsünü aynı açık tipli `solutionDirectory` sözleşmesi besliyor. Hub'larda 21/21 kanonik detay hedefi; `/solutions` kataloğunda kaynakta bulunan 22 kart ve iki bilinçli hedef istisnası (BIMPLUS, AX3000) korunuyor.
- Generic `sections + contentLinks` metin benzerliği eşleştirmesi yapılmadı. `SolutionHubSection`, `SolutionCatalogSection` ve tam kartı tek bağlantı yapan `SolutionDirectoryCard` eklendi; iç hedefler Next.js `Link`, tek harici AllplanTools hedefi güvenli yeni sekme davranışını kullanıyor.
- Kod incelemesinde özel katalog render yolunun kaynak giriş bloğunu ve görselleri atladığı HIGH bulgusu yakalandı. Generator artık `/solutions` kaynak `sections` verisinden giriş metnini, kart açıklamalarını ve 22 kart görselini sözleşmeye taşıyor; ikinci `catalogDescription` içerik otoritesi kaldırıldı.
- Related-links alanı geri getirilmedi. Sayfa ailesine göre çalışan tek sayfa-sonu dönüşüm bandı korundu; schema üretimi, canonical/URL sözleşmesi ve CTA hedefleri değiştirilmedi.
- TDD: `tests/test_solution_directory.py` beş hub'ın 21 kartını, katalogdaki 22 kartı, header/footer türetimini, kaynak metin-görsel paritesini, iç hedef varlığını ve harici link güvenliğini doğruluyor.
- Yerel kapılar geçti: 138 unit test, 36 parite kontrolü, 188 kontrast kontrolü, 45 token testi, `pnpm typecheck`, `pnpm build` (118 statik rota) ve production audit (bilinen güvenlik açığı yok). `next-env.d.ts` build sonrası zorunlu `.next/dev/types` biçimine geri alındı.
- Gerçek tarayıcı kabulü: `/solutions` üzerinde 22 kart/22 görsel, kaynak giriş paragrafı, tek dönüşüm bandı ve sıfır related-links; beş hub'da sırasıyla 4/3/3/5/6 kart ve tek dönüşüm bandı doğrulandı. 390×844 emülasyonda yatay taşma yok (`scrollWidth = clientWidth = 390`); konsol warning/error kaydı yok.
- Push, merge, deploy veya canlı değişikliği yapılmadı.

## 27.10.2026 — Sayfa sonu dönüşüm alanı

- Restore point: `restore/pre-page-end-conversion-20261027` → `862ebb15e328c6eee47755d6070f8d333a4125b9`.
- Tasarım ve plan: `docs/superpowers/specs/2026-10-27-page-end-conversion-design.md` ve `docs/superpowers/plans/2026-10-27-page-end-conversion.md` kullanıcı tarafından onaylandı.
- Politika commit'i: `d68ac09` (`feat: define page-end conversion policy`). Bileşen commit'i: `81847a1` (`feat: add contextual page-end conversion`).
- Yeni tek sınır `PageEndConversion`: ürün/paket/ticari çözüm sayfalarında **Teklif İste + Ücretsiz Deneme**; eğitim/webinar/video kütüphanesinde **Eğitim Talebi + Teklif İste**; lisans/destek/SSS sayfalarında **Destek Platformuna Git**; Hakkımızda/Referanslar'da **Teklif İste**. Ana sayfa, İletişim, Arama, Sağlık ve yasal sayfalarda ek bant yok.
- `contentLinks` kaynak verisi ve schema üretimi korunuyor; yalnız otomatik UI render yolları kaldırıldı. Eski iki related-links bölümü, eğitim kökündeki mükerrer talep bölümü ve genel deneme bandı artık render edilmiyor.
- Tam yerel kapı: `pnpm data:generate` ile 110 rota/14 playlist deterministik; `src/data` değişmedi. `pnpm test`: 128 unit test, 36 parite kontrolü, 188 kontrast kontrolü ve 45 token testi geçti. `pnpm typecheck`, `pnpm build` ve `pnpm audit --prod --audit-level high` geçti; bilinen güvenlik açığı yok.
- `next-env.d.ts` build sonrası proje kuralındaki iki `.next/dev/types` importuna geri alındı ve diff temizliği doğrulandı.
- Gerçek tarayıcı kabulü: sekiz temsilî rota (`/products/allplan-professional`, `/solutions/road-railway`, eğitim kökü ve playlist, `/solutions-v2/connect-license`, `/about`, `/contact`, `/kvkk`) doğru 0/1 bant, CTA sırası/hedefi, related-links yokluğu ve footer komşuluğu açısından geçti. Konsol/hydration hatası görülmedi.
- Mobil Chrome 390×844 emülasyonunda ürün ve eğitim bantları yatay taşmasız (`documentWidth = viewportWidth = 390`) ve CTA'lar viewport içinde doğrulandı. Klavye Tab kontrolünde CTA `:focus-visible` halkası solid olarak göründü.
- Yerel önizleme `http://127.0.0.1:3001/` üzerinde açık bırakıldı. Push, merge, deploy veya canlı değişikliği yapılmadı.

## 27.10.2026 — Çözüm katalog/hub navigasyonu regresyonu (tarihsel tespit kaydı)

- **Durum:** Bu bölüm 27.10.2026 tarihli tespit kaydıdır. Regresyon 28.10.2026 tarihinde üstteki kabul paketiyle giderildi. Çalışma dalı `codex/page-end-conversion-design`; push, merge, deploy veya canlı değişikliği yapılmadı.
- **Belirti ve bilgi mimarisi:** Header mega menüsü 21 doğrudan `/solutions/*` detayına, footer ise beş `/solutions-v2/*` kategori hub'ına gidiyor. Bu farklı rol uygundur; hata, `/solutions` kataloğu ile hub kartlarının hedef detay URL'lerine bağlı olmamasıdır.
- **Doğrulanmış kapsam:** `/solutions`, `/solutions-v2/building-design`, `/solutions-v2/infrastructure`, `/solutions-v2/construction`, `/solutions-v2/addons` ve `/solutions-v2/other`.
- **Veri kanıtı:** Beş hub'da tanımlı toplam 21 hedef, header `solutionsMenu` içindeki 21 hedefle 21/21 eşleşiyor. Yirmi yerel hedef mevcut; bir hedef `https://allplantools.com/`. URL veya içerik eksik değil, render ilişkisi eksik.
- **Runtime kanıtı:** Yerel `/solutions-v2/other` sayfasındaki çözüm kartlarında bağlantı sayısı `0`; `/solutions` kataloğunda `/solutions/*` ayrıntı bağlantısı yok. Bu yerel tarayıcı kanıtıdır, canlı davranış iddiası değildir.
- **Kök neden:** `scripts/generate_site_data.py` kart metinlerini `sections`, hedefleri ayrı `contentLinks` koleksiyonunda üretir. Generic `src/components/sections/SubpageView.tsx`, `specSections` öğelerini bağlantısız `<article>` olarak render eder ve bu iki veri koleksiyonunu ilişkilendirmez.
- **Kaynak paritesi:** Salt-okunur 2026 kaynağındaki `app/solutions-v2/construction/page.tsx`, `solutionsMenu` öğelerini `CardV2 href={item.href}` ile üretir; `components/layout-v2/CardV2.tsx` kartın tamamını `Link` ile sarar. Mevcut 2027 davranışı kaynak paritesi regresyonudur.
- **Son değişiklik ilişkisi:** Related-links alanının kaldırılması kart bağlantısı kusurunu oluşturmadı; önceden var olan kusurun sayfa sonundaki dolaylı/yedek hedef görünümünü kaldırdı. Kullanıcının kaldırma kararı korunacak; generic related-links alanı geri getirilmeyecek.
- **Risk:** UX/bilgi mimarisi riski yüksek, SEO bağlamsal iç bağlantı riski orta. Hedef URL'ler kırık değil; navigasyon ilişkileri eksik.
- **Onaylanan çözüm yönü:** Tek kanonik `solutionsMenu` kaynağından açık tipli `solutionHub.items` veya eşdeğer `directoryItems` üretilecek. Beş hub için özel `SolutionHubSection`, genel katalog için `SolutionCatalogSection` kullanılacak. Metin benzerliğiyle `sections + contentLinks` heuristic join yapılmayacak.
- **Ayrı IA kararı:** Masaüstü header'a “Tüm Çözümler” bağlantısı eklenmesi otomatik düzeltme kapsamına alınmayacak; ayrıca değerlendirilecek.

### Yarınki düzeltmenin kabul ölçütleri

1. Beş hub'daki 21 kart hedefi header `solutionsMenu` ile 21/21 eşleşir.
2. `/solutions` kataloğundaki çözüm kartları gerçek detay hedeflerine bağlanır.
3. Her kart tek, erişilebilir bağlantıdır; klavye odağı ve `:focus-visible` durumu doğrulanır.
4. İç hedefler Next.js `Link`; harici hedef `target="_blank"` ve `rel="noopener noreferrer"` kullanır.
5. Related-links alanı geri dönmez; sayfa sonu dönüşüm bandı ve sayfa ailesi politikası korunur.
6. Generated data deterministik kalır; içerik, schema, URL ve görünür metinler değiştirilmez.
7. Unit/parite testleri, typecheck ve build yanında gerçek tarayıcıda masaüstü/mobil tıklama, klavye ve console/hydration kabulü tamamlanır.

**Tamamlanan güvenli adım (28.10.2026):** Kanonik, açık tipli hub/katalog veri kontratı test-first yazıldı; özel render bileşenleriyle kart bağlantıları geri getirildi ve yukarıdaki kabul paketi çalıştırıldı.

## Güncel öncelik — 26.10.2026 sağlamlaştırma planı

Kullanıcı aşağıdaki yol haritasını onayladı ve önce kayda alınıp çalışmaya başlanmasını istedi. Önceki “Faz 6 tamamlandı / %100 parite” ifadeleri geliştirme kaydıdır; yayın kabulü değildir. Form teslimatı, gerçek belge paritesi, üretim hattı ve token bütünlüğü açık olduğu için güncel durum **Faz 6 — sağlamlaştırma ve kabul doğrulaması devam ediyor** olarak ele alınır.

### Kabul edilen kararlar
- `Allplan 2027 Marketing Materials/` Git'e alınmaz; sonraki yıl içerik çalışmasına ayrılır, bu denetimin kaynak kümesine karıştırılmaz.
- Şimdilik talepler mevcut tek Microsoft Forms (`https://forms.office.com/r/hXhnKAG912`) üzerinden alınır. Niyete özel Next.js form geliştirme planı ertelenmiştir; sahte kayıt/teslim başarısı gösteren yerel akış korunmaz.
- Deneme indirme hedefi ALLPLAN resmî sayfasıdır; destek Teams/ticket kanalları korunur. İletişim ve lisans deklarasyonu satış formuna otomatik bağlanmaz; mevcut görev/hedef eşlemesi ayrıca doğrulanır.
- Görünüm korunarak token bütünlüğü ve büyük bileşenlerin bakım yapısı düzeltilebilir. Yeni görsel tasarım veya ticari iddia üretimi bu çalışma kapsamında değildir.
- Kaynak odaklı denetim: güncel `../aluplan-2026` salt-okunur içerik/etkileşim kaynağı, yerel 2027 render doğrulama hedefi; canlı site yayın farkı/gerçek URL/hedef doğrulaması için kullanılır. Çelişkide canlı esas. Snapshot eşliği doğrulanmadan güncel kaynak diye kabul edilmez.

### Sıralı yol haritası
| Adım | Kapsam | Kabul ölçütü | Durum |
|---|---|---|---|
| S01 | Güvenli başlangıç kaydı ve pazarlama klasörünü hariç tutma | HEAD, üretilmiş veri, gerçek dosya türleri, belge hashleri ve kaynak snapshot eşliği kayıtlı; materyal klasörü ignored | Tamamlandı |
| S02 | Tek yetkili veri üretim hattı | Güncel Python hattı tek giriş; pnpm komutları doğru; eski JS üretici devre dışı; tekrar üretim deterministik, veri kaybı yok | Tamamlandı |
| S03 | PDF/DOCX kaynak paritesi | Temsili PDF üretimi kaldırılır; orijinal belgeler kaynak/URL eşlemesi, SHA-256 ve tür kontrolüyle korunur | Tamamlandı |
| S04 | Microsoft Forms yönlendirmesi | Talep CTA'ları ortak forma bağlı; sahte yerel başarı yok; destek/deneme/özel lisans görevleri karıştırılmaz | Tamamlandı |
| S05 | İçerik/etkileşim paritesi | Kaynak→veri→render bazında eksik/fazla/değişmiş/yanlış eşleşmiş kayıtlar; hedefli canlı doğrulama | Yerel teknik kontrol tamamlandı; kayıtlı istisnalar ve nihai görsel kabul ayrı |
| S06 | Token ve bileşen sağlamlaştırma | Sabit görsel kararlar tokenlara taşınır; büyük bileşenler ayrılır; görsel karşılaştırma görünümü korur | Devam ediyor — S06-A/B/C token katmanları, S06-D SSS ayrımı, S06-E JSX ölçüleri, S06-F kenarlıklar, S06-G konum/margin, S06-H1–H4 width/height, S06-I1–I2 transform ve S06-J1–J2 filter/shadow tamamlandı |
| S07 | Yayın öncesi kabul | Çalışan test komutları, typecheck/build, tarayıcı etkileşimleri, schema/performance doğrulaması ve açık riskler | Bekliyor |

S02 ve S03 bağımlıdır: iki mevcut üretici de gerçek belge adlarına temsili PDF yazar. Başlangıç kaydı alınmadan üretici çalıştırma. Tekleştirme sırasında belge yazma güvenliği sağlanmadan yeni üretim komutunu kullanım için serbest bırakma. Her adım dar kapsamlı commit ve devir kaydıyla kapanır; faz geçişinde kullanıcı onayı beklenir. Push/deploy/canlı değişikliği yetkisi verilmedi.

## Faz durumu tablosu
| Faz | Durum |
|---|---|
| 0 — İçerik envanteri | Tamamlandı (25.10.2026 kullanıcı onayıyla) |
| 1 — UI/UX analizi | Tamamlandı (25.10.2026 kullanıcı onayıyla — `docs/ux-audit.md`) |
| 2 — Teknik baseline | Tamamlandı (25.10.2026 kullanıcı onayıyla — `docs/baseline-report.md`) |
| 3 — PRD | Tamamlandı (25.10.2026 kullanıcı onayıyla — `docs/PRD.md`) |
| 4 — Design system | Tamamlandı (25.10.2026 kullanıcı onayıyla — `design-system/`) |
| 5 — Ana sayfa tasarımı | Tamamlandı (25.10.2026 kullanıcı onayıyla — `design-system/ui_kits/homepage/` ve `docs/homepage-design-proposal.md`) |
| 6 — Geliştirme | Sağlamlaştırma/kabul doğrulaması devam ediyor — önceki aktarım kaydı: 110 rota, 1.298 medya varlığı, 52 yapılandırılmış ürün/çözüm/eklenti sayfası, eşleştirilmiş pop-up video modalları, `/references` (228 firma), `/about` kurumsal profil ve 404 link onarımları doğrulandı (`36/36 PASS`) |

## Tasarım beklerken envanter ve içerik modeli — 21.10.2026
- Kullanıcı envanter kapanışı, ALLPLAN içerik eşlemesi, müşteri yolları ve yıllık güncelleme planını kabul etti. Uygulama/entegrasyon izni değil, analiz kapsamıdır.
- `docs/00-inventory/closure-review-2026-10-21.md`: 180 hedef HEAD kontrolü ve seçili GET kontrolleri; altı PDF'nin canlı/yerel SHA-256 eşliği doğrulandı. AX3000 klasöründeki dört PDF zaten canlı içerikle aynı; iki DOCX kullanım kararı açık.
- `link-recheck-2026-10-21.json` ve `fragment-recheck-2026-10-21.json` yeni kanıtlardır; önceki tarama dosyaları üzerine yazılmadı. 112 HTML/123 fragment çiftinde 118 eşleşme, beş trailing-space adayı; tarayıcı davranışı ayrıca kontrol edilmeli.
- Ana teklif formunun ALLPLAN dalı kişisel veri/gönderim olmadan incelendi; `form-observation-2026-10-21.md`. Kullanıcı form karmaşasının bilinen işletim sorunu olduğunu bildirdi. Niyete göre kısa girişler/tek operasyon merkezi önerisi kaydedildi; mevcut hedef korunur.
- `docs/allplan-content-mapping.md`: gerçek URL'lerle ürün/paket/sürüm/dosya eşlemesi, müşteri yolları ve yıllık kontrol listesi. Üçlü/altılı paket listesi, sürüm/paket etiketi ve deneme süresi açık kararlar.
- Faz 0 kısmi; tüm dinamik durumlar, diğer form dalları, medya ve paket kapsamı henüz kapanmadı. Kaynak ve indirilen design system paketleri değiştirilmedi.

## Paket PDF/web karşılaştırması — 21.10.2026
- `docs/package-comparison-decisions.md`: iki tek sayfalı PDF görsel/koordinat incelemesi, güncel 10 web sayfası kanıtı, 14 karar satırı ve schema etkisi. Kanıt görselleri/metinleri `docs/00-inventory/pdf-evidence/` içinde.
- Aynı 2026 için 23.10.2025 ve 1.7.2026 katalogları; 8→6 sütun, farklı lisans lejantı, SCIA/BIM²form satırlarının yokluğu ve TIM ön koşulu belge farkıdır, otomatik ticari kaldırılma değildir.
- Resmî ALLPLAN 2026 genel/Civil/Precast HTML karşılaştırmaları bulundu. Güncel resmî karşılaştırma PDF'si doğrulanamadı; eski PDF güncel diye kullanılmadı.
- Schema skilli ve güncel Google/Schema.org/Next.js belgeleri okundu. İç model sourceRevision ve licenseModel ile genişletildi; JSON-LD/kod yok.
- Canlı CTA14 gün; kaynakta kullanılmayan30 gün prop'u var. Q3 PDF doğru yazımı karsilastirme; önceki dokümanlardaki a/e aktarım hatası düzeltildi, URL değişikliği değil.
- Kullanıcı stratejik kararları ekibin üstlenebileceğini belirtti. Karar yetkisi ve kanıt temelli ikna sunumu omurgası kaydedildi; final sunum henüz yok. Faz geçişi ve entegrasyon yapılmadı.

## Yönetim sunumu taslağı — 21.10.2026
- Kullanıcı kanıtları yetkililere sunulabilecek strateji taslağına dönüştürmeyi istedi; uygulama yok.
- `docs/presentations/aluplan-strategy/aluplan-web-strategy-draft.pptx`: 13 düzenlenebilir slayt, her slaytta konuşmacı notu. PDF önizlemesi ve `companion.md` konuşmacı/kaynak rehberi birlikte hazırlandı.
- Anlatı: gözlenen sorunlar → kaynak revizyonu → müşteri akışı → tek katalog → yıllık süreç → içerik/tema/schema → karar yetkisi → pilot ve ölçüm → toplantı kararları.
- PPTX yapı doğrulaması geçti, PDF13 sayfa ve PPTX13 not kontrol edildi. Sunum görsel dili marka onayı değildir; final sunum kullanıcı geri bildirimini bekliyor.
- Sıradaki sunum adımı: kullanıcının hedef toplantı ve ton geri bildirimine göre taslağı sonlandırmak. Faz0 açıkları, ticari doğrulama ve design system incelemesi ayrı işlerdir.

## Sayfa görevleri ve üreticiye hizalama — 21.10.2026
- Kullanıcı sunum taslağını uygun buldu; uygulama izni verilmedi. Sonrasında sayfa görev tablosunu ve ALLPLAN referansı/Aluplan ek değeri ayrımını kabul etti.
- `docs/page-responsibilities.md`: 23 mevcut URL için görev, ana kayıt, üretici referansı, yerel değer, sonraki adım ve koru/hizala/yerelleştir/tarihsel tut sınıfları.
- Kararlar: kalıcı ALLPLAN girişi ile AEC iş akışı anlatımı; paket karşılaştırması ile belge indirme; kalıcı bulut hizmetleri ile 2026 bulut yenilikleri ayrı görevler. Yeni URL/canonical/redirect kararı yok.
- Kaynaklar 19/21 Ekim araştırma kayıtlarıdır; bu tur canlı tarama yenilenmedi. Resmî sürüm notu satır eşliği ve TR ticari kapsamı açık.
- İçerik koruma ile hizalama için eski metin/dayanak/öneri fark kaydı tanımlandı; site metni, kod ve schema çıktısı değiştirilmedi.
- Bir sonraki öneri: kayıt şablonları ve iki gerçek içerik üzerinde fark kaydı. Faz0 tamamlandı sayılmaz.

## İçerik sözleşmesi ve hizmet alanı notu — 21.10.2026
- Kullanıcı kayıt şablonları ve iki gerçek fark örneğini kabul etti. Ana sayfa Profesyonel Hizmetler sekmelerinin yetkililer için önemli, yıllar içinde geliştirilmiş ama iyileştirmeye açık olduğunu özellikle belirtti. Özelleştirilmiş eğitim/destek konumlandırması ayrı değerlendirme başlığıdır.
- `docs/content-record-contract.md`: ürün, edition, release, kapsam iddiası, kaynak revizyonu, hizmet, kaynak/hedef ve sayfa kayıtları için kavramsal alanlar; uygulama şeması değildir.
- `docs/content-change-examples.md`: Ultimate–SCIA ticari doğrulaması ve Eğitim Takvimi→Eğitimleri İncele CTA önerisi. Mevcut metinler/CTA'lar uygulanarak değiştirilmedi.
- `docs/professional-services-positioning.md`: hizmet sekmeleri için ayrı kanıt/konumlandırma değerlendirmesi. Eğitim kartında ham /contact hedefi render koşuluyla /solutions-v2/training olur; taşımada gerçek hedef korunmalı.
- Kaynak salt-okunur; bu tur yeni canlı tarama, schema üretimi, tasarım entegrasyonu veya uygulama yok. Faz0 ve hizmet alanının tam etkileşim kabulü açık.

## Eğitim odaklı hizmet matrisi — 21.10.2026
- `docs/service-positioning-matrix.md` oluşturuldu: Eğitim, destek kanalları, danışmanlık, sertifika ve partner için ihtiyaç/kanıt/konum/hedef/açık bilgi ayrımı.
- Kullanıcı bireysel/kurumsal özel eğitim sayfasını konumlandırmada göz ardı edip tek **Eğitim** başlığıyla sadeleştirmeyi istedi. Bu planlama kararı; mevcut sayfa/URL silme veya değiştirme yok.
- Eğitim sayfası kaynak kategorileri ve formatları ayrı boyutlar olarak ele alındı. Web aracı eğitim ana sayfasında üç hafta önceki tarama kaydını döndürdü; güncel etkileşim doğrulaması sayılmadı.
- ContactModal kaynakta simülasyon/console kaydı sonrası başarı gösteriyor. Canlı teslim testi yapılmadı; satış Microsoft Forms akışına genellenmez.
- Kod, schema, canlı site ve design ZIP değişmedi. Matris kullanıcı değerlendirmesini; hizmet koşulları işletim doğrulamasını bekliyor.

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
- Tek birincil dönüşüm: teklif/deneme ağırlığı; teklif için Next.js kısa form sözleşmesi onaylandı (`docs/request-forms-contract.md`), gerçek teslimat/operasyon hedefi açık.
- Antrasit koyu tema onaylı; marka kılavuzunun kalan açık tema/font/logo/slogan kararları; ALLPLAN üretici kullanım kuralları ve dosya bazında izinler; title/hero/sosyal kimlik onayı.
- **Kapatıldı (25.10.2026):** 14 gün / 30 gün ücretsiz deneme süresi çelişkisi kullanıcı kararıyla kapatıldı. Yeni sitede ücretsiz deneme bağlantıları doğrudan `https://www.allplan.com/trial-or-subscription/` adresine yönlendirilecek.
- PRD henüz yazılmadı; kalan açık sorular Faz 3 Açık Sorular bölümüne taşınacak. Yeni tasarımı bu cevaplar varsayılarak kurma.

## Bilinen sorunlar ve riskler
- **Faz 0 Envanteri tamamlandı (25.10.2026):** Alt sayfa dinamik durumları, harici form alanları (14 bölüm/24 soru), dış link/dosya erişimleri, fragmentler ve hashli medya eşlemesi tamamlanıp `docs/00-inventory/content-inventory.md` ve `docs/00-inventory/inventory-coverage-2026-10-22.md` altında kapatıldı. 11 benzersiz 404 ve eksik hedeflerin onarımı (`url-closure-2026-10-22.md`) kullanıcı kararıyla uygulama/geçiş aşamasına ertelendi.
- Güncel URL parite aracı aynı-origin 308 hedeflerini izler ve yalnız 2xx hedefe ulaşan yönlendirmeleri geçerli migration girdisi sayar. Harici hedefler otomatik GET edilmez. Bulgular tek tarama anı kanıtıdır.
- URL keşfi sitemap, yerel rotalar, kaynak yönlendirmeleri ve HTML bağlantılarıyla; 8 tur/400 yol sınırıyla çalışır.
- /about canlı canonical ana sayfaya işaret ediyor; meta kayıtlarında kanıt var. Teknik etkisi Faz 2'de analiz edilecek.
- Kaynakta bazı form akışları simülasyon; canlı gönderim/kalıcılık testi yapılmadı. Güvenlik ve çerez bulguları kod kanıtı, canlı/hukuki uygunluk kararı değil.
- Asset basename eşlemeleri aday; kesin kullanım kanıtı değil. `live-versiyon` arşivi güncel içeriğe karıştırılmaz.
- Marka kılavuzunun üretici izinleri hakkındaki ifadeleri resmî izin belgesi yerine geçmez; benzerlik kontrolü henüz yapılmadı.

## Sıradaki adım
`design-system/ui_kits/homepage/` ve `docs/homepage-design-proposal.md` (Faz 5 — Ana Sayfa Tasarımı) için kullanıcı onayını beklemek; onay sonrası **Faz 6 — Geliştirme (`src/`)** aşamasına geçmek.

Claude v3 indirildi ve ayrı antrasit önizleme kullanıcı tarafından uygun bulundu. Teknik entegrasyon kabulü değildir; aşağıdaki eski Claude durum kayıtları tarihsel notlardır.

## Claude Design paket incelemesi — 21.10.2026
- Son tarayıcı kontrolünde Claude kullanım sınırında durmuş; v3 ZIP henüz üretilmemiş. Yeni indirme veya yeniden paket kabulü yapılmadı. Kısmi düzeltme beyanları ve kalan işler inceleme raporunun son bölümünde kayıtlı; bunlar bağımsız doğrulama değildir.
- Kullanıcı ayrı beyaz dolgulu logo varyantına açık onay verdi ve talimat Claude'a gönderildi: orijinal korunacak, geometri/oranlar değişmeyecek. Bu izin yeniden logo tasarımı veya site entegrasyonu değildir.
- Kullanıcı Claude Design taslağını oluşturmayı yönettirdi; ardından ZIP'i proje köküne indirip yenisiyle değiştirdi. Son ZIP SHA-256: `af116303f7cbfd7d0ec7a0e6bc6c74565efa98f518b37813fe1bf2ec2825b4c0`; açılmış klasör ZIP ile aynı.
- Rapor: `docs/design-system-package-review.md`. Son key düzeltmeleri var. Node --check geçti, 188 kontrast kontrolünde eşik altı yok; iki yanlış sınıflandırılmış min-width uyarısı var.
- Responsive token üretimi, sürüm/bölge kapsam modeli, görsel sabitler, ikon/logo token eşlemesi, Tabs kenar durumu, güncel sürüm varsayımı, font lisansları açık.
- Yerel katalog 8768'de açıldı (server session 56227). Bir tema/mod geçişinde metin ve linkler korundu, font değişti. Tam E2E/Next build yapılmadı.
- ZIP ve açılmış kaynaklar kullanıcı dosyalarıdır; değiştirilmedi, commit'e alınmadı. Yalnız inceleme dokümanları kaydedildi. Bu taslak Faz 4 veya site entegrasyonu onayı değildir.

## Schema stratejisi ve CMS kararı — 21.10.2026
- CMS kullanıcı kararıyla şimdilik ertelendi. Sağlam design system gereksinimi yinelendi; henüz kurulum onayı yok.
- Schema skilli yeniden okundu; Google SoftwareApplication, Product snippet, Product variants, genel kurallar, Organization, Article ve Breadcrumb belgeleri; Schema.org alanları ve Next.js JSON-LD rehberi canlı doğrulandı.
- Strateji bölüm 10: ürün/paket/sürüm ve bölgesel kapsam kayıtları, kararlı kimlikler, sayfa–varlık ayrımı, semantik türler ve zengin sonuç şartları eklendi. Yazılım paketleri/yılları otomatik ProductGroup varyantı sayılmaz; fiyat veya değerlendirme uydurulmaz.
- Önceki ALLPLAN analizi yeniden tarama olarak sunulmadı; yeni plan o belgeye bağlandı. Önceki diğer türlerin araştırma tarihi korunur.
- Yalnız dokümanlar değişti; kod, schema çıktısı, design system veya yayın yok. Uygulama testleri, Rich Results Test ve URL Inspection çalıştırılmadı.

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

## 21.10.2026 — Destek adresi kullanıcı düzeltmesi

Kullanıcı Teams üzerinden desteğin ve ayrı ticket sisteminin çalıştığını teyit etti. Ticket adresini **allplan.net.tr** olarak düzeltti; önceki kaynak/envanterde `aluplan.net.tr` bulunuyor. Kullanıcının bildirdiği adres planlama için esas alınır; eski gözlem kaydı silinmez. Bu tur bağlantı erişimi bağımsız doğrulanmadı ve site değiştirilmedi. Yeni destek altyapısı gerekmiyor; çalışma saati, SLA veya kanal sırası varsayılmıyor.

## 22.10.2026 — V3 kontrolü ve antrasit önizleme

- Claude tamamladı; eski bundle uyarısı nedeniyle ZIP yeniletildi ve `Aluplan Design System-reviewed-v3-refreshed.zip` indirildi.
- Rapor: `docs/reviews/design-v3-review/README.md`; yeniden üretilebilir patch ve verification.json yanında.
- Kullanıcı yalnız ana BG isteğini header/kartlar dahil tüm koyu yüzeylere genişletti. `docs/previews/anthracite-demo/` ayrı yerel kopyada aluplan/dark antrasit yapıldı; açık tema, içerik, bileşen ve logolar aynı.
- Orijinal ZIP token drift nedeniyle 27/28; türetilmiş önizlemede üreticiyle giderildi, 28/28 token +13/13 içerik +188 kontrast başarılı. Logo paket içi eşliği var; kullanıcının güncel Documents SVG'siyle bayt eşliği yok.
- Önizleme: http://127.0.0.1:8769/ui_kits/website/index.html?theme=aluplan&mode=dark#product — loopback sunucu, session 93934. Ekran görüntüsü docs/previews/anthracite-demo-preview.png.
- ZIP/açılmış paketler yerel ve untracked; yalnız değişiklik patch'i, rapor ve ekran görüntüsü commit edilir. Kullanıcı görsel değerlendirmesi sıradaki adım; siteye entegrasyon yok.

## 22.10.2026 — Antrasit kabulü ve schema son kontrol

Kullanıcı antrasit temayı uygun buldu; schema skilliyle ürün/paket/sürüm ve Eğitim/Destek ilişkilerinin son belge kontrolünü istedi. `docs/schema-final-review-2026-10-22.md` (proje köküne göre) güncel resmî kaynakları, karar matrisini ve eksikleri içerir. Tek Eğitim, tek destek hizmeti/iki kanal, Course list–Course Info ayrımı netleştirildi; eski ayrı özel eğitim aday notu kaldırıldı. Fiyat/yorum, TR lisans kapsamı, müşteri destek giriş URL'si ve hizmet koşulları açık. Kod/schema/site/tema değiştirilmedi; Rich Results Test ve URL Inspection yapılmadı. Sıradaki adım raporun kullanıcı değerlendirmesi ve uygulama öncesi kanıt açıklarının kapanmasıdır.

## 22.10.2026 — Üç eşikli kapanış tablosu

`docs/phase-closure-gates.md` tasarım (D01–D09), uygulama (U01–U08) ve yayın (Y01–Y07) öncesi açıkları kanıt, sorumlu rol, ekibin karar yetkisi ve kapanış ölçütleriyle toplar. Schema U05–U07/Y02 ve ticari kanıt Y05 içinde izlenir. Rol sahipleri öneridir, kişi ataması yapılmadı. Yeni tarama/test, kod, JSON-LD veya entegrasyon yok; Faz 0 tamamlandı sayılmaz. Eski sıradaki adım ve 14/30 gün notu güncel kanıtla düzeltildi.

## 22.10.2026 — D01–D03 hedefli kanıt ve onarım erteleme kararı

- `docs/00-inventory/closure-review-2026-10-22.md` sonuç dizini; dinamik, medya, URL raporları ve JSON kanıtları yanında.
- Altı sayfada 57 canlı durum kaydedildi. Eğitim/SSS/Referanslar/rehber/Civil/Ultimate kapsamı raporda; kalan ortak şablonlar ve form/video dalları açık. Aktivasyon İleri gerçek POST yapıyor; gönderimsiz gözlem sınırı korunur.
- İki AX3000 DOCX canlıda bulundu, kaynakla hash eşit; artık local-only aday değil. 86 görsel+2DOCX eşliği doğrulandı. Medya kullanım grafiği ve kalan dosyalar tamamlanmadı.
- 11 benzersiz404, dört sağlam308, 2021 slash→404; beş fragment'ten yalnız interface hedefi eksik. Destek canlı/kaynak bağlantısı artık allplan.net.tr, root→/tr200; özel müşteri akışı denenmedi.
- Kullanıcı eksik hedeflerin listelenmesini ve onarımın sonraya bırakılmasını istedi. Yeniden oluştur/uygun hedefe bağla/kaldır seçenekleri açık; satır bazında karar yok. Bu, toplu silme veya uygulama izni değil.
- Kaynak, canlı, içerik/schema ve tasarım paketi değiştirilmedi. Eski snapshot'lar korunur. Faz0 sürüyor; uygulama build/test komutları henüz yok. İndirilen ZIP/açılmış paket ve ayrı antrasit demo untracked olarak korunuyor; yalnız yeni rapor/kanıt ve devir belgeleri commit kapsamındadır.

## 22.10.2026 — Genişletilmiş içerik ve medya kontrolü

- Kullanıcı kalan envanter işlerini onayladı ve teknik kontrolleri sonunda kendisinin tek tek yapmak zorunda kalmamasını istedi. Teknik kanıt/kabul sorumluluğu ekipte; kullanıcıya yalnız gerçek içerik/ticari/faz kararları sunulacak.
- `docs/00-inventory/inventory-coverage-2026-10-22.md/json` güncel kapsam dizini. Önceki57+yen179=236 canlı durum;65kaynak aday rotası için kanıt durumu. Sayılar tam runtime kabulü değildir.
- `media-complete-2026-10-22.md/json`:503bilinen hashli görselin tamamı200/SHA eşit;1364kaynak dosya yeniden hash edildi.31aday ve345referansı kanıtlanmayan yol korunur. Yeni218dış görselden217HTTP200, biri tekrarlananDNS hatası;404 olarak sayılmadı.
- `interaction-register-2026-10-22.md/json` ve `interaction-source-evidence/`:100page girişi,65aday rota,161public kaynak snapshotı;14playlist/13koleksiyonun tüm216video kaydı saklandı (slug tekrarlarıyla242). Kaynak kaydı canlı eşlik kanıtı değildir.
- `form-state-register-2026-10-22.md/json`:harici lisans/CDS formları, ana teklif dalları ve eğitim konu varyasyonları canlıda veri/gönderim olmadan incelendi. Ana form8gözlenmedi,14kişisel alanlardan dolayı açılmadı. Aktivasyon POST/teslim/simülasyon ve güvenlik açıkları belgeli.
- Yeni hedef adayları: eğitim kütüphanesinin dört#kartı; yanlış niyetli CDS başvuru hedefleri; webinar placeholder iframe; DNS hatalı lisans görseli. Onarım ertelenmiş; hiçbir hedef değiştirilmedi.
- Kalan iş: koşullu canlı durum/medya eşleşmeleri, harici formun erişilemeyen bölümleri ve ayrı yetkili teslim/runtime testleri. Faz0 kapanışı veya sonraki faz onayı yok. Kullanıcıya teknik listeyi elle doğrulama görevi verilmez.
- Tarayıcıda iki toplu işlem zaman aşımına uğradı; diske kaydedilmeyen ara sonuçlar kabul sayılmadı. Üçüncü taraf YouTube frame alt içerikleri çıkarıldı; host içerik ve frame kimliği korundu.
- Çıktılar doküman/kanıt kapsamındadır;2026kaynağa, canlıya, tasarım paketine, içerik/schema uygulamasına dokunulmadı. Untracked design paketleri/demo commit dışında kalır.

## 22.10.2026 — Kaynak odaklı son envanter kontrolü

- Kullanıcı tekrarlı canlı kontroller yerine güncel aluplan-2026 kodunun kullanılmasını istedi. Kalan içerik/durum/hedef çözümlemesi kaynak üzerinden; canlı yalnız yayın farkları ve belirsiz hedefler için. Kaynak kanıtı canlı çalışma kabulü değildir.
- remaining-source-checks-2026-10-22.md/json:65aday rota sınıflandı,22gizli dal yok,1harici CTA,42etkileşimli.376medya yolu ayrıldı ve korunuyor; yayın/silme kararı verilmedi. global-state-source-review-2026-10-22.md ortak bileşen kaynak kayıtlarını tamamlar.
- browser-final90 + browser-modules-final31 ek durum; önceki236ile357gözlem. Tekrarlı canlı tarama durduruldu, geçici sekmeler kapatıldı. Bu sayı başarılı test veya tam runtime kapsamı değildir.
- schema skilliyle güncel resmî kurallar yeniden doğrulandı: docs/schema-inventory-impact-2026-10-22.md stratejiye bağlandı. Webinar Event rich result, video yayın tarihi/üretici ve formdan hak türetmeme sınırları eklendi. /products/allplan kaynağındaki30gün iddiası ortak çelişki kaydına bağlandı.
- docs/00-inventory/inventory-decision-brief-2026-10-22.md yalnız dört operasyon/ticari kararı ayırır.404onarımı zaten erteli. Harici Forms8/14içeriği yetkili yapı olmadan hâlâ bilinmiyor; bunu kaynak kontrolüyle kapatmadık. Faz0tam kapanışı/sonraki faz/uygulama onayı yok.
- Önce sonraki faza geçmeden dış form kanıtını veya açık istisna kararını ele al; sonra faz kapanışını sun. Teknik testleri kullanıcıya tek tek devretme. Kaynak/site/tasarım/schema uygulaması değişmedi; yalnız kanıt/doküman. İndirilen design paketleri/demo commit dışında korunur.

## 22.10.2026 — Kullanıcının Forms yönetici bağlantısı

Kullanıcı düzenleme bağlantısını paylaştı; mevcut oturumla yalnız alanlar ve dallanma görüntülendi. docs/00-inventory/form-admin-2026-10-22.md/json14bölüm/24soruyu ve13dal gözlemini kaydeder. Önceki8/14içerik açığı kapandı:8Scalypso deneme onayı,14gizlilik/kullanım onayı. Scalypso seçimi8i atlayıp13e gidiyor. Yanıtlar okunmadı, form değiştirilmedi veya gönderilmedi. Yönetici URLsi rapora alınmadı. İçerik/schema/site kodu değişmedi. Önceki form yapısı bekleme adımı artık gerekli değil; sonraki adım kalan operasyon kararlarıyla faz kapanışını değerlendirmek. Faz geçişi otomatik değil.

## 22.10.2026 — Kullanıcının form, eğitim ve deneme açıklaması

- Mevcut site işletiminin kullanıcı açıklamasına göre hedefi ana Aluplan Teklif & Talep Formu: `https://forms.office.com/r/hXhnKAG912`. Kullanıcı tüm sitede bu tek forma geçildiğini, Pythonpart/Scalypso'nun ayrı CDS formuna gitmesinin hatalı olduğunu teyit etti. Yanlış hedefler düzeltme listesinde; bu tur link değiştirilmedi. Bu geçmiş/mevcut kullanım bilgisidir; 2027 için tek form mimarisi kararı değildir. Destek ticket/Teams, üretici indirme ve mevcut lisans işlemleri bu açıklamayla satış formuna yönlendirilmez.
- Eğitim fiilen dönemsel webinarlar ve YouTube üzerinden yayımlanan geçmiş webinar listesidir. Düzenli eğitim takvimi veya sürekli kurs kataloğu varsayılmayacak. Özel eğitim talepleri de alınabilmeli; tek Eğitim başlığı korunur, ayrı hizmet sayfası oluşturma kararı yok. Fiyat, sertifika, süre veya kesin program taahhüdü eklenmez.
- Paket hakları ve deneme koşullarını Aluplan yetkilileri takip ediyor; belirli kişi adı bildirilmedi. Türkiye koşulları ve14/30gün çelişkisi bu sorumluluk açıklamasıyla doğrulanmış sayılmaz.
- Deneme indirmesi Almanya/ALLPLAN'ın resmî sayfasında gerçekleşir. Türkiye'den yönlendirilen talepleri kısa bilgilendirme/lead formuyla toplamak ayrı ticari amaçtır; ana formun Bölüm11 Download Formları bu niyeti taşır. Lead kaydı indirme, lisans aktivasyonu veya satın alma tamamlandı anlamına gelmez.
- Henüz açık uygulama tercihi: lead adımı indirme öncesinde zorunlu mu, isteğe bağlı mı olacak? Kullanıcı bu sırayı/zorunluluğu belirtmedi. Öneri: indirmeyi engellemeyen kısa bilgi/takip talebi; henüz kabul edilmiş karar değildir. Özel eğitim niyetinin seçilecek form yapısında nasıl kaydedileceği ve teslimat sorumlusu da planlamada belirlenir; mevcut formda özel eğitim alanı varmış gibi davranılmaz.

Güncel kısa karar özeti: docs/00-inventory/inventory-decision-brief-2026-10-22.md. Önceki açık soruların tekrar sorulması yerine bu açıklama esas alınır. Uygulamaya geçilmedi.

### 22.10.2026 — Form mimarisi kararının düzeltilmesi

Kullanıcı yeni site için tek teklif formu kullanma kararının henüz verilmediğini açıkça belirtti. Tek form, niyete özel birden fazla form veya ortak veri/operasyon merkezine bağlı farklı girişler ayrıntılı olarak karşılaştırılıp planlanacak. Mevcut ana form ve yanlış CDS hedefleri envanter gerçeğidir; gelecekte aynı formu kullanma zorunluluğu değildir. Form sayısı, arayüz, altyapı, teslimat ve indirme öncesi lead zorunluluğu henüz açık. Uygulama veya hedef değişikliği yapılmadı.

## 22.10.2026 — Üç kullanıcı yolunun yeniden planlanması

[Teklif, deneme ve eğitim planı](docs/customer-request-journeys.md) tek koşullu form, bağımsız kısa formlar ve ortak kayıt sözleşmesine bağlı niyet girişlerini karşılaştırır. Öneri: niyete özel kısa girişler, isteğe bağlı deneme yardımı, formsuz webinar arşivi ve özel eğitim talebi. Bunlar kullanıcı kararı değildir; form sayısı/araç/altyapı henüz seçilmedi. Alanlar, teslimat-hata davranışı, ölçüm sınırları ve schema ilişkileri belgelendi. Kullanıcı mevcut yapının doğruluğunu varsaymadan yeniden planlama istedi; bu hedefli UX çalışması bütün Faz1'in tamamlandığı anlamına gelmez. Kod/form/URL/schema uygulaması yok. Sıradaki adım önerilen üç akışın kullanıcı değerlendirmesi; ardından araç/maliyet ve hedef geçiş planı.

## 22.10.2026 — Form platformu karşılaştırması

Kullanıcı niyete özel kısa girişler/ortak takibi mantıklı buldu ve Forms–Next.js karşılaştırmasını istedi. [Platform değerlendirmesi](docs/form-platform-comparison.md) kurulum, lisans/altyapı, bakım, kayıt/teslimat, ölçüm ve schema etkisini aynı kapsamla karşılaştırır. Uzun vadeli aday Next.js + mevcut uygun operasyon hedefi; teknik bakım ayrılmayacaksa Forms daha sürdürülebilir alternatif. Bu bir seçim değildir. Tahmini iş yükleri planlama aralığıdır; mevcut Microsoft lisansı, connector hakları, takip hedefi ve kapasite bilinmeden kesin ücret yok. Yeni CRM/Forms'a gizli POST/uygulama kurulumu önerilmiyor. Sıradaki adım mevcut haklar, takip hedefi ve bakım sorumluluğuyla platform seçimini netleştirmek. Kod, canlı form veya JSON-LD değiştirilmedi.

## 22.10.2026 — Next.js yönü kabul edildi; seçenek kapsamı korunuyor

Kullanıcı Next.js içinde kısa formlarla ilerlemeyi onayladı; henüz kod yazılmayacak. Önceki platform seçimi açık notları tarihsel olarak aşıldı. [Alan, takip ve schema sözleşmesi](docs/request-forms-contract.md) güncel plandır. Kullanıcı mevcut formun üç kategorisi altında çok sayıda seçenek olduğunu hatırlattı: üç çekirdek niyet ürün/eklenti seçeneklerini azaltmaz veya ekran sayısını dondurmaz. Bölüm1–14kapsam eşlemesi eklendi; öğrenci lisansı ve mevcut müşteri eklenti temini ayrı alt yol olarak korunur. Çoklu ürün/modül ilgisi kaybolmaz. Deneme formunun zorunluluğu, gerçek takip hedefi/sorumluları ve hukuki metinler henüz açık; yeni CRM veya site/form/schema uygulaması yok.

## 22.10.2026 — Yeni form sözleşmesi schema kontrolü

Schema v2.0.0 skill okundu, Google ürün varyantları/yazılım/ürün snippet/kurs/genel kurallar ve softwareVersion yeniden doğrulandı. docs/form-schema-review-2026-10-22.md raporu: doğrudan ihlal yok; otomatik ProductGroup, kaynak sürümü–açık sürüm tercihi ve Eğitim hizmeti–arşiv sayfa amacı ayrımı netleştirildi. docs/request-forms-contract.md açıklamaları güncellendi. Fiyat/yorum olmadan rich result uygunluğu yok; semantik tür geçerliliği ayrı. Kod, schema veya canlı form değişmedi; Validator/RRT/Search Console çalıştırılmadı. Önceki operasyon kararları açık; bu inceleme yeni ticari karar gerektirmiyor.

## 22.10.2026 — Kalıcı bilgi mimarisi taslağı

[Menü, sayfa görevleri ve kullanıcı yolları](docs/site-information-architecture.md) hazırlandı. Öneri: altı ana menüyü koruyup Eğitim ve Destek için görünür yardımcı giriş; kalıcı ürün/paket ile yıllık yenilikleri ayırmak; fiyat yayımlamadan kapsam karşılaştırması ve teklif yolu. 131 satırlık route eşlemesi özgün URL kanıtını korur; eksik hedefler ertelenen karar listesinde kalır. Eğitim önceki “takvim” adaylarından farklı olarak dönemsel webinar, video arşivi ve eğitim talebi üzerinden planlanır. Bu hedefli analiz Faz0/1 kapanışı veya uygulama onayı değildir. Yeni canlı tarama, kod, JSON-LD ya da tasarım entegrasyonu yok. Sıradaki adım: navigasyon ve kullanıcı yollarını kullanıcı değerlendirmesine sunmak; onay sonrası sayfa şablonu/blok gereksinimlerini hazırlamak.

## 22.10.2026 — Sayfa şablonları ve gerçek ana sayfa blokları

Kullanıcı bilgi mimarisi sonrasında şablon/blok planına ilerlemeyi kabul etti. `docs/page-template-requirements.md`: 12 şablon ailesi, ortak blok sözleşmesi, veri/sunum/schema/talep sınırı, durumlar, yıllık bakım ve kabul kriterleri. `docs/homepage-block-plan.md`: kaynakta aktif sekiz gövde bileşeninin 8/8 eşlemesi, 20/20 hizmet kaydı ve global kabuk. Referans bloğu kaynakta yok; yeni öneri olarak ayrıldı. TechSpecs altı kartın aynı PDF hedefi, InnovationsTeaser /products hedefi ve Eğitim render hedefi kaydedildi; değiştirilmedi. Tam metin/UI paritesi veya erişilebilirlik testi tamamlandı iddiası yok. Kod, canlı site, form, schema ve design system entegrasyonu yapılmadı. Sıradaki adım: blok planını kullanıcıya sunmak; kabul sonrası mevcut içerikle düşük ayrıntılı ana sayfa yerleşim önizlemesi için ilerlemek. Faz0/PRD/uygulama sınırları korunur.

## 22.10.2026 — Bağımsız ana sayfa yerleşim önizlemesi

Kullanıcının “ok görelim” talebiyle `docs/previews/homepage-wireframe/` altında kaynak içerikle bağımsız statik önizleme hazırlanıyor. Antrasit sunum; içerik verisi, tema tokenları ve yerleşim ayrı dosyalarda. Aktif uygulama/Next.js, schema veya form altyapısına entegre edilmez. Yerel sunucu: proje kökünden `python3 -m http.server 8770 --bind 127.0.0.1`; önizleme `/docs/previews/homepage-wireframe/`. Bu izin görsel yerleşimi görmek içindir; ürün iddiaları ve tüm fazların kabulü değildir. Sonuç: rol değişimi tarayıcıda doğrulandı; Mühendis seçilince ilgili içerik/hedef değişiyor ve altı ürün erişilebilir kalıyor. Sekiz bölüm ve20hizmet erişilebilirlik ağacında görüldü; antrasit görünüm kontrol edildi, tarayıcı error logu boş. Bağımsız code-review kritik/yüksek sorun bulmadı. Tam mobil/erişilebilirlik veya içerik paritesi kabulü değildir. Hero/BIMFlex medya alanları temsilidir; bazı sabit metinler HTML içindedir. Sıradaki adım kullanıcıdan bölüm sırası ve hizmet görünürlüğü geri bildirimi.

## 22.10.2026 — Ana sayfa yerleşiminin geçici kabulü

Kullanıcı bağımsız ana sayfa önizlemesini “şu an için uygun” buldu; daha sonra değişiklik yapılabileceğini belirtti. `docs/previews/homepage-wireframe/` içindeki mevcut bölüm sırası ve sunum, sonraki çalışmalara geçici yerleşim referansıdır. Bu karar nihai görsel tasarım, tam içerik paritesi, ticari iddialar, form zorunluluğu, PRD/faz kapanışı veya üretim entegrasyonu onayı değildir. Bu tur önizleme değiştirilmedi. Sıradaki öneri: kabul edilen yerleşimin tasarım sistemi bileşenleriyle eşlemesini planlamak; yeni uygulama çalışması için kullanıcı yönlendirmesini beklemek.

## 22.10.2026 — Tasarım sistemi bileşen eşlemesi

Kullanıcı devam talebiyle kabul edilen yerleşimi tasarım sistemi bileşenlerine eşleme planı hazırlandı: `docs/design-system-component-mapping.md`. H01–H08, kabuk, token zinciri, veri/schema ayrımı ve uyarlama sırası kaydedildi. Kaynak incelemesi: RoleSelector kullanılabilir fakat demo ürün filtresi altı kartı koruyan homepage davranışıyla aynı değil; Header düz menü, çok seviyeli gezinme/arama/tema uyarlaması gerekiyor; demo içerik sözleşmesi proje sözleşmesinin yerine geçmez. Tabs/ReleaseTag eski bulguları güncel kaynakta düzelmiş; runtime kabulü ayrı. İndirilen paket, antrasit kopya, wireframe ve uygulama değiştirilmedi. Sıradaki öneri: ayrı görsel önizlemede header/hero/rol-ürün/hizmet bloklarını gerçek design system ile hazırlamak; entegrasyon yapılmadı.

## 22.10.2026 — Gerçek tasarım sistemiyle ana sayfa kesiti

Kullanıcının “ok go” talebiyle `docs/previews/anthracite-demo/ui_kits/homepage/` altında ayrı prototip hazırlandı; kontrol özeti `docs/design-system-homepage-preview-review.md`. Gerçek paket bileşenleri ve antrasit tokenlarıyla header temsili, hero, hızlı erişimler, rol/altı ürün, çözümler ve 20 hizmet gösterildi. Rol değişimi ve altı ürünün korunması tarayıcıda doğrulandı; console error yok. Code review kritik/yüksek bulgu vermedi. Mega menü/arama/tema bu kesitte yok; hero medya alanı temsilî. Form, backend, izleme, schema ve Next.js entegrasyonu yok. Türetilmiş antrasit paket önceki karar gereği Git dışında; rapor/devir commit kapsamındadır. Sıradaki adım kullanıcı görsel değerlendirmesi; kabul edilirse aynı dilin H05/H07/H08 ayrıntılarına genişletilmesi.

## 22.10.2026 — Header eylemleri sadeleştirildi

Kullanıcı `Teklif İste` etiketini kabul etti; teklif ve ücretsiz deneme zaten hero'da bulunduğu için ikisinin de header'dan kaldırılmasını istedi. Ayrı tasarım sistemi önizlemesi buna göre güncellendi: header gezinme odaklı, hero `Teklif İste` + `Ücretsiz Deneme`. Canlı site/Next.js/form hedefi değiştirilmedi. Sıradaki adım güncel önizlemenin görsel kontrolü ve kullanıcı değerlendirmesi.

## 22.10.2026 — Keskin kart dili ve padding normalizasyonu

Kullanıcı yuvarlatılmış kartları reddetti ve önceki keskin, ince çizgili kart dilini seçti. Önizlemede `aluplan` semantic tema tokenı `radius.surface = 0` yapıldı; ürün, çözüm, hizmet, rol ve hero medya panelleri 0 px köşe ve mevcut 1 px sınır tokenını kullanır. Kontroller 4 px, rozetler kendi pill anatomisinde kalır. Yoğunluk semantic tokenlardan 16 px kompakt / 24 px standart / 32 px büyük panel olarak üretilir; dar görünüm 16 px'tir. Ürün kartları aynı satırda eşit yüksekliğe bağlandı.

İlk kod incelemesi primitive tokenların önizleme CSS'inde doğrudan kullanılmasını yüksek öncelikli buldu; değerler `tokens/tokens.json` içindeki tema semantic override'larına taşındı ve engel kapandı. Son incelemedeki 6/8 px uyarısı, kullanıcının daha sonraki açık 0 px tercihiyle geçersizdir. `build-tokens --check`, 28/28 token, 13/13 içerik ve 188/188 kontrast kontrolü geçti; patch temiz kaynakta `git apply --check` ile doğrulandı. Tarayıcıda 0/16, 0/24 ve 0/32 ölçüleri ile 228/228/228 ürün kartı yüksekliği doğrulandı. İçerik, URL, schema, form, canlı site ve Next.js değiştirilmedi. Sıradaki adım bu keskin kart dilinin kullanıcı görsel değerlendirmesi; kabul edilmeden H05/H07/H08 ayrıntılarına veya entegrasyona geçme.

## 22.10.2026 — Kalan ana sayfa blokları önizlemede tamamlandı

Kullanıcı keskin `radius: 0` kart dilini kabul edip devam etti. Ayrı antrasit tasarım sistemi önizlemesine H05 paket/PDF erişimi, H07 BIMFlex ortaklık alanı ve H08 ALLPLAN 2026 yenilikleri eklendi. Sıra H04 çözümler → H05 paketler → H06 profesyonel hizmetler → H07 BIMFlex → H08 yeniliklerdir. `docs/previews/homepage-wireframe/data.js` içerik katmanıdır; görünüm ayrı paket kopyasındadır. Form, schema/JSON-LD, Next.js ve canlı siteye dokunulmadı.

H05'te altı kart ve bölüm CTA'sı aynı mevcut PDF hedefine gider; fiyat yoktur. BIMFlex, FlexSoft çözümü/Aluplan satış ortaklığı olarak tutulur; dört kaynak medya varlığı patch'e ikili olarak eklendi. Kaynaktaki kanıtsız `saatlerden saniyelere` iddiası güçlendirilmedi ve yayın öncesi doğrulama bekler. H08 üç kaynak kartı ve mevcut `/products` hedefini korur; 2026 için güncel sürüm statüsü üretilmez.

Testler: homepage sözleşmesi 9/9, token 28/28, içerik 13/13, kontrast 188/188; temiz kaynakta patch apply check geçti. Tarayıcı kabulü: yedi PDF bağlantısı tek hedef, dört BIMFlex görseli yüklü/doğru alt, üç yenilik kartı, tek `h1`, radius `0px`, 390 px yatay taşma `0`, console error `0`. Code review'un bulduğu tanımsız spacing tokenı ve Badge/figcaption uyarıları düzeltildi; ikinci inceleme onaylandı. Kanıt: `docs/previews/anthracite-homepage-complete.png`; ayrıntı: `docs/design-system-homepage-preview-review.md`; patch: `docs/reviews/design-v3-review/anthracite-preview.patch`.

Bu tamamlanma yalnız görsel önizleme kapsamındadır. Türetilmiş paket Git dışında kalır. Sıradaki adım kullanıcı görsel değerlendirmesidir; yeni uygulama kurulumu, entegrasyon veya faz geçişi için ayrıca onay gerekir.

## 22.10.2026 — Ayrı mimari pafta konsepti, aşama 1

Kullanıcı mevcut önizlemenin korunmasını ve kökte ayrı klasörde ek prompta göre yeni örnek hazırlanmasını istedi. `architectural-sheet-concept/` oluşturuldu; özgün talimat `USER-PROMPT.md`, tasarım gerekçesi/kompozisyon/token önerisi `README.md` içinde. Prompt çalışma sırası 1 açıkça koddan önce onay beklemeyi istediği için bu adımda uygulama kurulmadı. Sonraki adım kompozisyon ve konsepte özel turuncu token eklerinin kullanıcı onayı; sonra token/pafta bileşenleri. Önceki önizleme değiştirilmedi. Public URL ve schema stratejisi korunur; prompttaki otomatik Türkçe rota ve toplu schema adayları uygulama kararı sayılmaz. Performans hedefleri ölçülmüş sonuç değildir.

## 22.10.2026 — Mimari pafta konsepti aşama 2

Kullanıcı aşama 1 kompozisyon/turuncu yönünü `uyguun` ile onayladı. Ayrı `architectural-sheet-concept/` içinde Next.js 16.4.2/React19.3.1/TypeScript strict temel, sheet token teması ve server-rendered pafta bileşen kataloğu oluşturuldu; önceki antrasit önizleme korunur. Yerel production preview http://127.0.0.1:8771/ (session 66247). Ana sayfa henüz yapılmadı; `/` bileşen kataloğu. Komutlar ve dosya ayrımı klasör README'sinde.

Kontroller: 6/6 test, TypeScript/production build, 282 kontrast çiftinde 0 hata; fonts58.728bayt; masaüstü ve390CSSpx yatay taşma0; native details JS kapalı çalıştı; reduced-motion scroll auto/animation none; font semantic override runtime doğrulandı; konsol0hata/uyarı. Kod incelemesi semantic font bypass/root scope ve accessible heading/motion uyarılarını kapattı, onaylandı. Kanıt `architectural-sheet-concept/evidence/verification.json` ve `components-preview.png`.

Açık performans kabulü: framework dahil ilk HTML'nin harici script gzip toplamı179.860bayt; <90KB hedefi sağlanmadı (inline hariç alt sınır, gerçek transfer ölçümü değildir). Lighthouse/CWV/INP ve turuncu oranı ölçülmedi. Ana sayfa/ürün detayı/tablar/schema henüz yok. Promptun her adım sonu değerlendirme kuralına göre sıradaki adım kullanıcı bileşen yönünü değerlendirdikten sonra aşama3 ana sayfa örneğidir. Mevcut ana site entegrasyonu veya yayın yapılmadı.

## 22.10.2026 — Kullanıcı isteğiyle ara / tasarım değerlendirmesi açık

**Güncel durum: çalışma duraklatıldı.** Kullanıcı mimari pafta önizlemesinin tasarım olarak içine sinmediğini, eksik bir şeyler hissettiğini belirtti ve ara verilmesini istedi. Bileşenlerin teknik kontrolü görsel tasarım kabulü değildir. Önceki kompozisyon onayı son render'ın kabul edildiği şeklinde yorumlanmaz. Ana sayfa/ürün detayına otomatik ilerleme.

Son uygulama commit'i `0659d86` (mimari pafta bileşen sistemi); önceki antrasit ana sayfa `a1f0025`, yeni konsept brifi `a72876b`. İki alternatif de korunur: eski önizleme http://127.0.0.1:8770/docs/previews/anthracite-demo/ui_kits/homepage/?v=6 ; ayrı pafta kataloğu http://127.0.0.1:8771/ . Portlar yerel süreçlere bağlıdır; sonraki oturumda erişim yeniden doğrulanır. Uygulama kurulumu/komutları `architectural-sheet-concept/README.md` içindedir.

Son doğrulama: 6/6 test, TypeScript ve build geçti; 282 kontrast çifti, mobil/JS kapalı/native details/reduced-motion kontrolleri kayıtlı. Bu ara turunda yalnız dokümantasyon değişti, testler yeniden çalıştırılmadı. Açık teknik konu: framework dahil ilk harici JS gzip179.860bayt,90KB hedefinin üstünde; Lighthouse/CWV ölçülmedi. Görsel yön kabul bekliyor; eksiklikler kullanıcı tarafından henüz tek tek tarif edilmedi.

Git dışında kullanıcı ZIP'i, `Aluplan Design System/`, `docs/previews/anthracite-demo/`, `docs/reviews/design-v3-initial/` ve `docs/reviews/design-v3-refreshed/` korunur. Önceki karar gereği bu paketler commit'e eklenmedi; antrasit değişiklikleri yeniden üretilebilir patch'te, yeni pafta kodu ve varlıkları ise `0659d86` içinde takip edilir. Kaynak2026/canlı site değiştirilmedi; push veya deploy yapılmadı.

**Güvenli devam sırası:** başlangıç belgelerini oku → Git ve mevcut önizlemeleri doğrula → kullanıcının tasarımda eksik bulduğu noktaları ve beğendiği referansları konuş → görsel yönü yeniden netleştir → ancak sonra yeni tasarım revizyonuna ilerle. Sıradaki adım kod yazmak değil, tasarım yönünü kullanıcıyla yeniden değerlendirmektir.

## 25.10.2026 — Faz 0 (İçerik Envanteri) kapanışı ve ücretsiz deneme hedefi kararı

- Kullanıcı **Faz 0 — İçerik Envanteri** aşamasının kapatılmasını onayladı.
- Eski kaynaklarda yer alan **14 gün / 30 gün ücretsiz deneme süresi çelişkisi** kullanıcı kararıyla kapatıldı: Yeni sitede tüm ücretsiz deneme CTA'ları doğrudan ALLPLAN resmî sayfasına (**`https://www.allplan.com/trial-or-subscription/`**) yönlendirilecek ve süre/koşul üretici sayfasında yönetileceği için sitede çelişkili gün sayısı vaadi yer almayacak.
- Güncellenen dosyalar: `HANDOFF.md`, `docs/00-inventory/user-decisions.md`, `docs/00-inventory/content-inventory.md`, `docs/00-inventory/inventory-coverage-2026-10-22.md`, `docs/00-inventory/inventory-decision-brief-2026-10-22.md`, `docs/phase-closure-gates.md`, `docs/request-forms-contract.md`, `docs/customer-request-journeys.md`.
- **Sıradaki adım:** Faz 0 tamamlandığı için kullanıcı onayıyla **Faz 1 — UI/UX Analizi (`docs/ux-audit.md`)** aşamasına geçmek.

## 25.10.2026 — Faz 1 (UI/UX Analizi) tamamlandı (`docs/ux-audit.md`)

- Kullanıcı onayıyla Faz 1 çalışması yürütüldü ve `docs/ux-audit.md` oluşturuldu.
- Rapor; bilgi mimarisi ve dönüşüm (`IA-01`..`IA-07`), görsel hiyerarşi ve marka algısı (`VH-01`..`VH-04`), mobil deneyim ve dokunma hedefleri (`MB-01`..`MB-04`), WCAG 2.2 AA erişilebilirlik borcu (`A11Y-01`..`A11Y-05`), mikro-metin ve durum yönetimi (`CR-01`..`CR-04`), 5 temel persona (`P1–P5`) ve ekran bazlı bulgu/öneri matrisini dosya/satır kanıtlarıyla kapsar.
- **Sıradaki adım:** `docs/ux-audit.md` (Faz 1) için kullanıcı onayı; onaylandıktan sonra **Faz 2 — Teknik Analiz (`docs/baseline-report.md`)** aşamasına geçmek.

## 25.10.2026 — Faz 1 onayı, ayrı commitler ve Faz 2 (`docs/baseline-report.md`) tamamlanması

- Kullanıcı Faz 1 (`docs/ux-audit.md`) raporunu onayladı ve her faz/bulgu adımının kaybolmaması için ayrı ayrı commitlenmesini istedi.
- Commitler: `7daf574` (`docs: close phase 0 inventory and resolve trial CTA target`) ve `d3cf14e` (`docs: complete phase 1 ux audit report`).
- Faz 2 çalışması yürütülerek `docs/baseline-report.md` üretildi:
  - **Performans:** Medyan TTFB 541 ms (maks 869 ms), maks HTML 306 KB (`/references`), 19,81 MiB hero video (`hero-bim.mp4`), çift kopyalı 12,03 MiB MP4 varlıkları, 23 script chunk'ı, render-blocking Google Fonts CSS `@import`, gereksiz `three`/`r3f`/`gsap` bağımlılıkları.
  - **SEO:** 112 HTTP 200 sayfasının yalnızca **4 tanesinde (%3,6)** self-referencing canonical doğru (92 sayfa `/` köküne, 16 ürün sayfası `/products`'a işaret ediyor); **58 sayfada (%51,8)** aynı varsayılan `<title>` ve **59 sayfada** aynı `<meta name="description">`; `sitemap.ts` içinde 7 adet 404 URL + `/health` varken `/references` ve `/solutions-v2/training` eksik; 14 video sayfasında çift `<h1>`, 4 sayfada `<h1>` yok.
  - **GEO:** `/llms.txt` yok; 111 sayfada yalnız `BreadcrumbList` JSON-LD var (`Organization`, `WebSite`, `SoftwareApplication`, `Product`, `Service`, `VideoObject` 0 adet).
  - **Güvenlik & Uyumluluk:** `next.config.js` ve `middleware.ts` arasında çakışan çift CSP (`'unsafe-inline'` / `'unsafe-eval'`), `/api/send-activation-email` içinde HTML injection + `SSLv3` + `rejectUnauthorized: false` + rate-limit/CSRF eksikliği, açık kalan `/hero-3d` ve `/test-webgl` rotaları, rıza tercihini okumadan yüklenen Google Analytics (`GT-5TQ6VQ4` / `G-DQYT0D9MQ5`).
- **Sıradaki adım:** `docs/baseline-report.md` (Faz 2) için kullanıcı onayı; onaylandıktan sonra **Faz 3 — PRD Dokümanı (`docs/PRD.md`)** aşamasına geçmek.

## 25.10.2026 — Faz 2 onayı ve Faz 3 (`docs/PRD.md`) tamamlanması

- Kullanıcı Faz 2 (`docs/baseline-report.md` — commit `b377f6c`) raporunu onayladı.
- Faz 3 çalışması yürütülerek 13 bölümlü kapsamlı `docs/PRD.md` oluşturuldu:
  1. Vizyon ve ölçülebilir KPI hedefleri (%100 içerik/URL paritesi, %100 doğru canonical/title, LCP < 2.5s, INP < 200ms, CLS < 0.1, TTFB < 200ms, Lighthouse 90+, WCAG 2.2 AA).
  2. Kapsam içi / kapsam dışı sınırları.
  3. 5 temel persona (`P1–P5`) ve kullanıcı senaryoları.
  4. Bilgi mimarisi (131 rota, kalıcı ürün/paket/sürüm ayrımı, gezinme odaklı Header).
  5. İçerik koruma, fark kaydı ilkesi ve 308/301 yönlendirme + 11 adet ertelenmiş 404 haritası.
  6. Semantik token zinciri (`Primitive → Semantic → Component`), keskin kart dili (`radius.surface = 0px`), Antrasit koyu & açık tema ve yerel WOFF2 fontlar (`Manrope`, `IBM Plex Sans`, `IBM Plex Mono`).
  7. Ana sayfa `H01–H08` blokları, `T01–T12` sayfa şablonları ve Next.js kısa talep formları + doğrudan `https://www.allplan.com/trial-or-subscription/` deneme hedefi.
  8. NFR (Performans, WCAG 2.2 AA, SEO, GEO `/llms.txt` + `@id` JSON-LD, güvenlik ve KVKK rıza yönetimi).
  9. Next.js (App Router, SSG öncelikli Server Components) teknoloji yığını ve alternatif karşılaştırması.
  10. DevOps planı, CI/CD kalite kapıları, Docker/Coolify dağıtımı ve < 2 dk geri alma (rollback) planı.
  11. Otomatik parite, SEO, kontrast, erişilebilirlik ve güvenlik test stratejisi.
  12. Yayına geçiş (cutover) adımları ve SEO kaybını önleme kontrol listesi.
  13. Faz kabul kriterleri, riskler ve açık kararların durumu.
- **Sıradaki adım:** `docs/PRD.md` (Faz 3) için kullanıcı onayı; onaylandıktan sonra **Faz 4 — Design System (`design-system/`)** aşamasına geçmek.

## 25.10.2026 — Faz 3 (PRD) onayı ve Faz 4 (`design-system/` — Antrasit Tasarım Sistemi) kurulumu

- Kullanıcı Faz 3 (`docs/PRD.md` — commit `ffead59`) dokümanını onayladı ve **Antrasit tasarım sistemi** üzerinden ilerlenmesini kararlaştırdı.
- `design-system/` dizini altında resmi Faz 4 çıktı yapısı oluşturuldu:
  - `design-system/tokens/`: `tokens.json` (171 primitive, 161 semantic, 66 component alias token), üretilmiş `primitives.css`, `semantic.css`, `component-aliases.css`, `fonts.css` ve `tokens/build/` (`CONTRAST-REPORT.md` — 188/188 WCAG 2.2 AA kontrast doğrulaması, 0 hata; `breakpoints.json|mjs`).
  - `design-system/components/`: Temel ve Aluplan kalıp bileşenleri (`actions`, `brand`, `disclosure`, `feedback`, `forms`, `layout`, `navigation`, `patterns`, `surfaces`, `typography`) + `base.css` ve `responsive.template.css` / `responsive.generated.css`.
  - `design-system/assets/`: Yerel WOFF2 fontlar (`Manrope`, `IBM Plex Sans`, `IBM Plex Mono` + OFL lisansları), logolar (`aluplan-logo-white.svg`, `aluplan-logo-white-filled.svg`, `aluplan-logo-black.svg`) ve 31 ikonluk Lucide alt kümesi.
  - `design-system/catalog/index.html`: Canlı etkileşimli stil rehberi.
  - `design-system/ui_kits/homepage/index.html` + `design-system/data/homepage-data.js`: Keskin kart dili (`radius.surface = 0px`, `16/24/32 px` yoğunluk) ve `H01–H08` ana sayfa kesiti.
  - Doğrulama: `node design-system/scripts/build-tokens.mjs --check` → `0 errors` (`contrastChecks: 188, contrastFails: 0`).
- **Sıradaki adım:** `design-system/` (Faz 4) için kullanıcı onayı; onaylandıktan sonra **Faz 5 — Ana Sayfa Tasarımı** aşamasına geçmek.

## 25.10.2026 — Faz 4 onayı ve Faz 5 (Ana Sayfa Tasarımı) tamamlanması

- Kullanıcı Faz 4 (`design-system/` — commit `bdcacda`) çalışmasını onayladı.
- Faz 5 kapsamında:
  - `design-system/ui_kits/homepage/HomepagePreview.jsx` ve `preview.css` üzerinde tam içerik paritesi tamamlandı: Hero 14 teknik etiketi, Koyu/Açık (`dark`/`light`) mod geçiş kontrolü, `H01–H08` sekiz ana sayfa bloğu, 20 profesyonel hizmet kaydı, 6 ürün ve 5 çözüm bağlantısı, Ataşehir/İstanbul adresi, 3 telefon numarası, `info@aluplan.com.tr`, 5 sosyal medya hesabı, 3 yasal sayfa bağlantısı ve `"Design & Develop by Hazar Volga Ekiz"` geliştirici kredisi eksiksiz yer alıyor.
  - `docs/homepage-design-proposal.md` oluşturularak 3 ana sayfa tasarım yönü (*Yön 1: Keskin Hatlı Antrasit Mühendislik Sistemi [Seçilen]*, *Yön 2: Yapısal İndeks / Wireframe*, *Yön 3: Mimari Pafta Konsepti*) karşılaştırıldı ve `H01–H08` blok eşlemesi ile responsive kırılımlar belgelendi.
  - Doğrulama: `homepage-preview-tests.mjs` (9/9), `token-tests.mjs` (28/28, 188/188 kontrast), `content-tests.mjs` (13/13) eksiksiz geçti.
- **Sıradaki adım:** Faz 5 (`docs/homepage-design-proposal.md` ve `design-system/ui_kits/homepage/index.html`) için kullanıcı onayı; onaylandıktan sonra **Faz 6 — Geliştirme (`src/`)** aşamasına geçmek.

## 25.10.2026 — Faz 5 onayı ve Faz 6 (`src/` Next.js Uygulaması & `docs/final-comparison-report.md`) tamamlanması

- Kullanıcı Faz 5 (`f7c7a21`) çalışmasını onayladı.
- Faz 6 kapsamında (`../aluplan-2026` klasörüne hiçbir şekilde dokunulmadan ve yalnızca `aluplan-2027/docs/00-inventory/` içindeki yerel envanter kullanılarak):
  - **Veri ve İçerik Katmanı (`src/data/` & `scripts/generate_site_data.py`):** 110 aktif HTTP 200 rotasının tamamı (`src/data/pages.json`), 14 eğitim video oynatma listesi / 216 tekil video (`src/data/playlists.json`), gezinme menüleri (`src/data/navigation.json`), `H01–H08` ana sayfa verisi (`src/data/homepage.json`), arama dizini (`src/data/search-index.json`) ve 10 indirilebilir PDF/DOCX belgesi (`public/docs/`) üretildi.
  - **Next.js App Router Uygulaması (`src/app/`, `src/components/`, `src/lib/`):**
    - Onaylı Antrasit tasarım sistemi (`src/styles/globals.css`, `radius.surface = 0px`, `1px` sınır, Koyu/Açık mod, yerel WOFF2 fontlar) entegre edildi.
    - Gezinme odaklı Header (`MegaMenu`, `CommandMenu` arama `Ctrl+K`, Koyu/Açık mod geçişi), niyete özel kısa Next.js talep modalı (`quote` / `trial_assistance` / `training_request`), KVKK çerez rıza banner'ı (`CookieConsent`) ve `"Design & Develop by Hazar Volga Ekiz"` kredili Footer (`SiteShell.tsx`) kuruldu.
    - Tüm 110 rotada %100 self-referencing canonical, %100 benzersiz `<title>` ve `<meta name="description">`, %100 tekil `<h1>`, `@id` bağlantılı JSON-LD (`Organization`, `WebSite`, `BreadcrumbList`, `SoftwareApplication`, `Service`, `FAQPage`, `VideoObject`), temiz `sitemap.ts`, AI bot uyumlu `robots.ts` ve GEO `/llms.txt` (`src/app/llms.txt/route.ts`) sağlandı.
    - 4 kalıcı `308` yönlendirme ve `/solutions/imar-yonetmliği-bim-eklentisi` alias'ı `next.config.mjs` içine tanımlandı; `/api/request`, `/api/contact` ve `/api/send-activation-email` uç noktaları `escapeHtml()`, IP rate-limit ve `TLSv1.2+` ile güçlendirildi.
  - **Doğrulama:** `python3 scripts/verify_phase6_parity.py` (**27/27 PASS, 0 hata**) ve `python3 -m unittest tests/test_url_parity.py` (**5/5 OK**) geçti.
  - **Final Raporu:** `docs/final-comparison-report.md` içinde Faz 2 baseline ile Faz 6 son durumunun Önce/Sonra karşılaştırması belgelendi.
- **Sıradaki adım:** Faz 6 çıktılarının ve `docs/final-comparison-report.md` raporunun kullanıcı tarafından son onayı.

## 25.10.2026 — Faz 6 Görsel, Video, İkon ve CSP/CSS Tamamlaması

- Kullanıcının yerel önizleme (`http://localhost:3000`) geri bildirimi üzerine:
  1. **CSP `eval()` ve CSS/Font eşleme düzeltmesi (`next.config.mjs`, `src/styles/globals.css`):**
     - `next.config.mjs` içinde `script-src` yalnız geliştirme ortamında (`NODE_ENV !== 'production'`) React/Turbopack hata yığını için `'unsafe-eval'` içerecek şekilde koşullandırıldı; üretim derlemesinde kapalı tutuldu.
     - `src/styles/globals.css` içindeki WOFF2 `@font-face` dosya adları (`Manrope-400_800-normal-latin.woff2` vb.) ve `.alu-button`, `.alu-cluster`, `.alu-display`/`.alu-h1`..`.alu-h4`, `.alu-site-header__inner`, `.alu-site-nav__link`, `.alu-card__media` sınıfları eksiksiz eşlendi.
  2. **Tüm Görsel ve Video Varlıklarının Aktarımı (`scripts/sync_media_assets.py` → `public/`):**
     - `../aluplan-2026` klasörüne hiçbir şekilde yazma/değişiklik yapılmadan (salt-okunur kopyalama ile) **1.298 adet görsel ve video dosyası (159,74 MB)** `aluplan-2027/public/` altına aktarıldı (`/videos/hero-bim.mp4`, `/images/hero-poster.jpg`, 5 adet ALLPLAN Bridge `.mp4` özellik videosu, 2 adet `2024-header.mp4`, 9 adet OpenBIM partner logosu ve tüm ürün/çözüm/eklenti ekran görüntüleri).
  3. **Veri Katmanı ve Görsel/Video Eşlemesi (`scripts/generate_site_data.py`, `src/data/`):**
     - 110 sayfadaki **975 içerik görselinin tamamı (`0` eksik dosya)** ve **8 yerel `.mp4` videosu** `src/data/pages.json` içinde yerel `public/` yollarına çözümlendi.
     - `src/data/homepage.json` içine Hero video/poster, 3 rol ikonu ve görseli, 6 ürün görseli, 5 Bento çözüm görseli, 3 yenilik görseli ve 9 OpenBIM partner logosu eklendi.
  4. **Vektörel SVG İkon Sistemi (`src/components/ui/AluIcon.tsx`) ve Bileşen Entegrasyonu:**
     - Lucide tasarım sistemi ikonları ve sosyal medya/hizmet SVG ikonlarını içeren `AluIcon.tsx` oluşturularak `SiteShell.tsx`, `HomepageView.tsx` ve `SubpageView.tsx` bileşenlerine entegre edildi.
     - Alt sayfalarda (`SubpageView.tsx`) sayfa başlığı yanına Hero görseli, yerel `.mp4` video oynatıcıları, bölüm görselleri, tüm kalan ekran görüntüleri için Görsel Galeri ızgarası ve 14 eğitim serisindeki 216 video kartına YouTube küçük resimleri (`hqdefault.jpg`) + oynatma ikonu eklendi.
  5. **Doğrulama:** `python3 scripts/verify_phase6_parity.py` (**31/31 PASS, 0 hata**) ve `python3 -m unittest tests/test_url_parity.py` (**23/23 OK**) geçti.

## 25.10.2026 — Destek Portalı Hizalaması, Amiral Gemisi UI Sahnesi ve İkon/İstatistik Düzeltmesi

- Kullanıcının geri bildirimleri doğrultusunda 3 kritik iyileştirme tamamlandı:
  1. **Destek Merkezi Bağlantılarının `https://allplan.net.tr/tr` Adresine Hizalanması (Commit `c5a338f`):**
     - `scripts/generate_site_data.py`, `src/lib/site-data.ts`, `src/components/sections/SubpageView.tsx`, `src/app/llms.txt/route.ts`, `src/data/pages.json`, `src/data/homepage.json` ve `design-system/data/homepage-data.js` içinde kalan tüm eski `aluplan.net.tr` bağlantıları `https://allplan.net.tr/tr` olarak normalize edildi; `scripts/verify_phase6_parity.py` içine kalıcı kontrol (#12) eklendi (**32/32 PASS**).
  2. **Wireframe Hissinin Kaldırılması — Amiral Gemisi (Flagship) Üretim Görsel Sahnesi (Commit `4c0d1df`):**
     - `HomepageView.tsx`, `SubpageView.tsx` ve `src/styles/globals.css` güncellenerek: tam genişlikli atmosferik BIM video sahnesi (`.alu-hero-stage`), canlı BIM monitörü (`.alu-hero-monitor`), anıtsal 4'lü istatistik bandı (`.alu-hero-metrics`), hızlı komut şeridi (`.alu-quick-ribbon`), bölünmüş etkileşimli rol vitrini (`.alu-role-stage`), 12 sütunlu asimetrik Bento çözüm ızgarası (`.alu-bento-grid`), alt sayfalarda sağ/sol dönüşümlü vitrin satırları (`.alu-feature-rows`), numaralı mimari şartname kartları (`.alu-spec-grid`) ve etkileşimli modül sekmeleri (`.alu-module-tabs`) devreye alındı.
  3. **Alt Sayfa İkonlarının Büyütülme Sorunu ve Sayaç İstatistiklerinin Düzeltilmesi:**
     - `scripts/generate_site_data.py` içine PNG/JPEG piksel boyutu okuma (`get_image_dimensions` ve `is_icon_image`) eklendi: `width <= 260` veya `height <= 260` olan ya da `/icons/`, `/reasons/`, `/benefits/`, `/partners/` dizinlerindeki **76 adet küçük PNG ikon (`52×48`, `52×52`, `128×128` px)** `isIcon: true` olarak işaretlendi ve başlıkla birebir eşleşen ikonlar `sec.iconSrc` alanına, yalnızca yüksek çözünürlüklü gerçek fotoğraflar `sec.image` alanına atandı.
     - `SubpageView.tsx` içinde `heroImage`, `.alu-feature-row` (büyük sol/sağ görsel vitrinleri) ve `.alu-gallery-grid` yalnızca `isIcon: false` olan yüksek çözünürlüklü ekran görüntülerini/fotoğrafları kullanacak şekilde filtrelendi; küçük ikonlar ise `.alu-spec-card__header` içinde `52×52px` `.alu-benefit-icon` rozeti (`32×32px` `object-fit: contain`) olarak kendi doğal boyutunda ve netliğinde gösterildi.
     - Kaynak şablonlarda `statsVariant="animated"` nedeniyle SSR'da `"0"` ve `"%"` olarak yakalanan sayaç yer tutucuları temizlendi ve `docs/00-inventory/interaction-source-evidence/app/**/*.tsx` kaynaklarından gerçek istatistik değerleri (`50% DAHA KESİN`, `70% DAHA VERİMLİ`, `30% DAHA ÜRETKEN`, `93% ZAMAN TASARRUFU`, `100% TUTARLI VERİ` vb.) çekilerek `.alu-hero-metrics` performans bandında gösterildi.
  4. **Canlı Sitedeki `ROLÜNÜZÜ SEÇİN` (`PathwayProductSystem`) Sekme, Koşullu Vurgulama ve Akıcı Geçiş Efektlerinin Uygulanması:**
     - `HomepageView.tsx` (`H03 — Disiplininize Özel BIM İş Akışı`) ve `src/styles/globals.css` içine canlı sitedeki `PathwayProductSystem.tsx` etkileşim mimarisi birebir uygulandı:
       - Rol bazlı dinamik vurgu renkleri (`MİMAR`: `#3B82F6` Mavi, `MÜHENDİS`: `#10B981` Zümrüt Yeşili, `PREKAST`: `#F59E0B` Kehribar) ve arka planda `700ms` akıcı renk geçişli `.alu-pathway-glow` ambiyans ışığı.
       - Aktif sekmede büyüyen (`scale(1.05)`), rol renginde ışıldayan nokta ve ikon rozetine sahip `.alu-pathway-tabs` (`MİMAR`, `MÜHENDİS`, `PREKAST`).
       - Sekme değiştiğinde soldan kayarak beliren (`aluPathwaySlideIn 420ms`) rol başlığı (`Özgür Tasarım` / `Hassas Analiz` / `Akıllı Üretim`) ve sağda kademeli gecikmeyle (`0ms`, `85ms`, `170ms`, `255ms` — `aluPathwayFeatureIn`) açılan 4 özellik kartı + disiplin görseli.
       - 6 adet `ALLPLAN` ürün kartında (`Basic`, `Concept`, `Professional`, `Ultimate`, `Civil`, `Precast`) koşullu vurgulama ve sönümleme: seçili role ait paketler (`.alu-product-card--highlighted`) tam opaklık (`opacity: 1`), `scale(1)`, tam renk, rol renginde aktif durum noktası ve `"ÖNERİLEN"` rozetiyle öne çıkarken; diğer paketler (`.alu-product-card--dimmed`) `450ms cubic-bezier(0.22, 1, 0.36, 1)` geçişle `opacity: 0.3`, `scale(0.975)` ve `grayscale(100%)` olarak geri plana çekilir (üzerine gelindiğinde ise anında netleşerek erişilebilir kalır).
  5. **Ana Sayfa Hero Bölümünden `29+ / 500+ / 50+ / 10K+` Kartlarının Kaldırılması:**
     - Kullanıcı talebi doğrultusunda ana sayfa Hero alanındaki 4'lü istatistik kartları (`29+ Yıllık Tecrübe`, `500+ Aktif Müşteri`, `50+ Uzman Kadro`, `10K+ Tamamlanan Proje`) `HomepageView.tsx` içerisinden tamamen kaldırıldı.
  6. **Video Kütüphanesi (`/solutions-v2/training/video-library` ve `[playlistId]`) Canlı Site Hizalaması:**
     - Canlı sitedeki `video-library/page.tsx` ve `video-library/[playlistId]/page.tsx` yapısı `SubpageView.tsx` ve `src/styles/globals.css` içine birebir uygulandı:
       - `/solutions-v2/training/video-library` sayfasına kırmızı/koyu geçişli **YouTube Abone Ol Banner'ı (`.alu-yt-banner`)** (`Resmi Kanal`, `Allplan Türkiye YouTube Kanalına Abone Olun`, filigran YouTube ikonu ve `ABONE OL` butonu) ve canlıdaki **22 adet Oynatma Listesi & Kanal Kartı (`.alu-yt-grid`)** (kırmızı YouTube rozeti, hover'da kırmızı dolgu ve sağ üstte beliren oynat ikonu, `İzleme Listesini İncele` bağlantısı) eklendi; alt kısımda oluşan mükerrer düz metin kartları kaldırıldı.
       - 14 adet oynatma listesi detay sayfasına (`/solutions-v2/training/video-library/[playlistId]`) canlı sitedeki **2/3 Ana Video Oynatıcı + 1/3 Sabit Kaydırılabilir Oynatma Listesi Kenar Çubuğu (`.alu-playlist-stage`)** mimarisi (`Oynatma Listesi 1 / N` sayacı, küçük resimli ve aktif oynatma işaretli ders satırları) entegre edildi.
  7. **Doğrulama:** `python3 scripts/verify_phase6_parity.py` (**32/32 PASS**) ve `python3 -m unittest tests/test_url_parity.py` (**23/23 OK**) geçti.

## 26.10.2026 — Tüm Ürün/Çözüm Yapısal Sayfaları, `/references`, `/about`, Açık Tema Header/Footer ve Mobil Menü Düzeltmesi

- Kullanıcının geri bildirimleri doğrultusunda tamamlanan ve atomik olarak commit edilen geliştirmeler:
  1. **30 Ürün, Çözüm, Eklenti ve Destek Sayfasının Yapısal Bileşen Mimarisi (`7927be1`, `ba1f9ce`):**
     - `scripts/extract_structured_pages.py` ile 30 zengin şablonlu sayfa (`ProductPageTemplate`, `SolutionHero`, `BenefitsGrid`, `WorkflowLinks`, `ChallengerSection`, `RegulatedIndustryTemplate`, `/references`, `/solutions-v2/faq`, `/solutions-v2/connect-license/how-to-assign`, `/solutions/sketchup-converter`, `/solutions-v2/training/quick-start`) yapısal olarak `structuredLayout` şemasına aktarıldı.
     - 91+ YouTube video kartı için sinema modunda açılan **Global Video Popup Modal (`.alu-video-modal`)** ve yüksek çözünürlüklü ekran görüntüleri için **Global Image Lightbox Modal** eklendi.
     - `/references` sayfasına canlı sitedeki **10 Sekmeli Kategori Filtresi (`Tümü (228)`, `Kamu (59)`, `Üniversiteler (13)`, `Üstyapı (32)`, `İnşaat (29)`, `Mimari (24)`, `Yol - Köprü (52)` vb.)**, anlık arama kutusu ve 3 sütunlu **228 Kurum/Firma Referans Kartı Izgarası (`.alu-ref-grid`)** uygulandı.
     - `/solutions-v2/faq` sayfasına 5 sekmeli (`Sistem Gereksinimleri`, `Kurulum & Aktivasyon`, `Lisans Yönetimi`, `Sürüm Karşılaştırma Tablosu`, `Sorun Giderme`) etkileşimli SSS dizini eklendi.
  2. **Eski Siteden Kalan Kırık (404) Buton ve Link Hedeflerinin Onarımı (`3be57da`):**
     - `scripts/generate_site_data.py` içinde eski sitede 404 veren 6 adet iç link (`/solutions/bimplus` → `/products/allplan-bimplus`, `/allplan-2026nin-ozellikleri` → `/products/allplan-2026-yenilikler`, `/solutions/scalys` → `/solutions/addons/scalypso`, `/solutions/ax3000` → `/products/ax3000`, `/downloads#...` → `/solutions-v2/other` / `/products/allplan-bimplus`) canlı karşılıklarına yönlendirildi.
  3. **Açık Tema (Light Mode) Header, Topbar, MegaMenu ve Footer Uyumlaması (`5f88fce`):**
     - `src/styles/globals.css` içine `[data-mode="light"]` ve `[data-theme="aluplan"][data-mode="light"]` token ve bileşen kuralları eklendi; `SiteShell.tsx` içinde Footer logosunun da Header logosu gibi açık temada siyah logoya (`/assets/logo/aluplan-logo-black.svg`) geçmesi sağlandı.
  4. **Hakkımızda (`/about`) Sayfası İçin Kurumsal Editöryal Profil Yerleşimi (`1f5cd09`):**
     - `/about` sayfası ürün/çözüm şartname kartları (`01..09`) yerine; üstte **4'lü Kurumsal Gösterge Bandı (`29+ Yıllık Tecrübe`, `500+ Aktif Müşteri`, `50+ Uzman Kadro`, `10K+ Tamamlanan Proje`)**, asimetrik **Hikayemiz & Kronoloji** anlatısı, Romen rakamlı **2×2 Kurumsal Değerlerimiz Manifestosu (`Misyonumuz`, `Müşteri Odaklılık`, `Kalite ve Uzmanlık`, `Sürekli İnovasyon`)** ve **Ataşehir Merkez Ofis + Etkileşimli Google Harita** bölümüyle kurumsal kimlik sayfası olarak yeniden tasarlandı.
  5. **Header Masaüstü Navigasyon ve Mobil Hamburger Menü Ayrımı (`d3d8810`):**
     - Masaüstü görünümde (`> 64rem` / `1024px`) normal navigasyon (`.alu-site-nav`) açıkken yanında ikinci bir `Menü` (hamburger) butonunun görünmesi engellendi (`.alu-mobile-menu-toggle { display: none }`). `<= 64rem` mobil/tablet görünümde ise normal navigasyon gizlenip yalnızca hamburger menü butonu gösterilecek şekilde duyarlı (responsive) hale getirildi.
  6. **Doğrulama:** `./node_modules/.bin/tsc --noEmit` (`0` hata) ve `python3 scripts/verify_phase6_parity.py` (**36/36 PASS, 0 hata**) geçti.
  7. **`/about` Kurumsal Profil İyileştirmesi ve CSP Google Maps İzni (`ffdb894`):**
     - `src/styles/globals.css` içine eksik semantik CSS değişken takma adları (`--font-display`, `--font-sans`, `--accent-primary`, `--accent-subtle`, `--accent-soft`, `--text-muted`, `--surface-overlay`) eklendi; `.alu-about-values` 2×2 editöryal kart ızgarasına dönüştürüldü; `/about` Hero bölümünden yazılım ürün CTA butonları (`Teklif Talep Formu` / `Ücretsiz Deneme`) kaldırıldı; `next.config.mjs` CSP `frame-src` yönergesine `https://www.google.com https://maps.google.com` eklenerek Google Maps haritasının sorunsuz yüklenmesi sağlandı.
  8. **`/solutions/modeling-of-precast-girder-bridges` ve 21 Çözüm/Eklenti Sayfasında Eşleştirilmiş Metin + Popup Video Modal Mimarisi (`4c53d2b`):**
     - Canlı sitedeki `InfoMediaTwoColumn` (metin ve ilgili videonun yan yana eşleştiği iki sütunlu yapı) ve video kartı şablonları taranarak `/solutions/modeling-of-precast-girder-bridges` (8 YouTube videosu: 3 akış + 5 teknik özellik adımı), `/solutions/features-allplan-bridge` (7 YouTube + 5 yerel `.mp4` videosu), `/solutions/bimx5`, `/solutions/imar-yonetmeligi-bim-eklentisi`, `/solutions/rebar-engineering`, `/solutions/pythonpart`, `/solutions/bimflex`, `/solutions/poz-catalog`, `/solutions/scalypso/videos`, `/solutions/scalypso/converter`, 8 adet CDS eklenti sayfası (`/solutions/addons/2d-dwg-converter`, `drive-curve`, `geometry-tools`, `graphical-text`, `parametric-terrain`, `ramp`, `steel-components`, `three-dimensioning`), 3 adet AX3000 çözüm sayfası ve `/solutions/allplan-industry` dahil toplam **52 yapısal rota** `structuredLayout` şemasına bağlandı.
     - Tüm videolar (hem YouTube hem yerel `.mp4` videoları) kendi başlık ve açıklamalarının tam yanında konumlandırıldı ve tıklandığında **Sinema Video Popup Modal (`.alu-video-modal`)** içinde otomatik oynatılacak şekilde entegre edildi.


## 26.10.2026 — S01 başlangıç kaydı tamamlandı

Plan önce `91f6da7` ile commit edildi. `docs/verification/stabilization-2026-10-26/baseline.json` beş üretilmiş JSON'un ve10belgenin SHA-256/boyut/tür kaydını içerir.10/10orijinal belge 2026kaynağında bulundu; mevcut hedeflerde0/10hash eşliği ve ikiDOCX'tePDF imzası doğrulandı.161TSX snapshotının güncel2026kaynağıyla161/161bayt eşliği var; önceki snapshot eskimesi şüphesi bu kümede giderildi. Tüm kaynak/render/canlı paritesi henüz kanıtlanmadı.

`/Allplan 2027 Marketing Materials/` .gitignore'a eklendi, git check-ignore ile doğrulandı; klasör içeriği açılmadı/değiştirilmedi. Kaynak/veri/belgeler değiştirilmedi, üreticiler çalıştırılmadı. S01 yalnız doküman/Git ignore adımıdır; uygulama testleri tekrarlanmadı. Sıradaki adım S02 tek veri üreticisi ve komut sözleşmesi; belge yazma güvenliği sağlanmadan üreticiyi çalıştırma. Bu aşama sonunda kullanıcıya kanıt özeti sunulur.


## 26.10.2026 — S02/S03 tek veri hattı ve gerçek belge kopyaları tamamlandı

Kullanıcı PDF/diğer dosyaların mutlaka2027'ye kopyalanmasını ve kırık link kabul edilmemesini istedi. `scripts/generate_site_data.py` tek üretici yapıldı; pnpm veri/test komutları düzeltildi, eski JS üretici aynı Python girişine yönlendiren sarmalayıcıya dönüştürüldü. Temsili PDF üretimi kaldırıldı; `scripts/document_assets.py` 10özgün PDF/DOCX'i salt-okunur2026kaynağından2027public/docs'a kopyalıyor. Ana sayfanın yazım farklı PDF hedefini koruyan11.adres de aynı özgün dosyayı sunar. Kaynak/hedef/tür/SHAmanifesti `src/data/documents-manifest.json` içinde; parite artık dosya varlığı yerine tür/boyut/hash kontrol eder. Eksik/bozuk kaynak ve path/symlink kaçışları önkontrolde durdurulur.

34birim testi +36parite kontrolü, typecheck/build ve188kontrast çifti geçti.11/11belge URL'si yerel productionHTTP200 ve orijinal gövde hash eşliğiyle doğrulandı. Veri içindeki10benzersiz yerel indirme hedefi geçerli dosya döndürdü. Beş mevcut içerikJSON'u S01ile aynı; altıJSON tekrarlı üretimde aynı.161kaynak snapshotı değişmedi. İnceleme kritik/yüksek bulgu vermedi; manifest şekil kontrolü önerisi testle kapandı. Kanıt/komutlar `docs/verification/stabilization-2026-10-26/README.md` ve `documents-after.json` içinde.

Bu adım form/tasarım/schema içeriğini değiştirmedi, canlıya yayın yapılmadı. Kaynak2026salt-okunur kaldı, pazarlama materyalleri ignored. Sıradaki adım S04Microsoft Forms tek talep kanalı ve sahte yerel başarı akışlarının kaldırılması; özel lisans/iletişim akışını satış formuna otomatik karıştırma. S05tam içerik/etkileşim paritesi veS06token refaktörü hâlâ açıktır.


## 26.10.2026 — S04 mevcut Microsoft Forms talep kanalı tamamlandı

`SiteShell` yerel kısa form modalı ve /api/request çağrısı kaldırıldı; Hızlı Talep Oluştur gerçek harici link olarak ortak `https://forms.office.com/r/hXhnKAG912` hedefini açar. İletişimde ortak talep formu + mevcut e-posta/telefon, Eğitim ana sayfasında doğrudan eğitim talep linki sunuldu. PythonPart/Scalypso ailesindeki kullanıcı tarafından hatalı olduğu teyit edilen XLQm9JPTSR CDS hedefi yalnız tam URL eşleşmesiyle içerik ve structuredLayout katmanında ortak forma hizalandı. HSrhvAkYmb lisans yöneticisi formu, Teams/ticket ve resmî deneme URL'si korunur.

Lisans aktivasyonu bölümünde çalışmayan ürün anahtarı/kişisel veri toplama alanları yerine çevrimiçi gönderim yapılmadığı açıklandı; özgün deklarasyon PDF'si, ticket ve info e-postası korunur. Lisans işlemi satış formuna bağlanmadı. Üç eski POST endpoint'i gövdeyi okumadan, saklamadan veya yönlendirmeden410/error/no-store döndürür; sahte başarı/başvuru no üretilmez. Bu, gerçek bir SMTP/aktivasyon teslimatı kurulduğu anlamına gelmez; mevcut uygulamada bu teslimat desteklenmiyor. Eski alanlar kaynak snapshotlarında korunur, yeni çalışan form varmış gibi sunulmaz.

43birim testi +36parite, typecheck ve production build geçti; yerel üretim tarayıcısında iletişimde0form, güvenli ortak form linki; eğitim talep hedefi doğru; aktivasyon bölümünde0kişisel alan ve yalnız PDF/ticket/mail doğrulandı. ÜçPOST'a bozukJSON ile yerel test410döndürdü; gerçek form gönderimi/kişisel veri iletimi yapılmadı. Kod ve güvenlik incelemelerinde kritik/yüksek bulgu yok. Kanıt `forms-after.json` / `forms-contact.png`; `docs/request-forms-contract.md` başına erteleme kararı eklendi. Form testleri mevcut URL politikası ve sahte başarı regresyonunu kapsar; tüm uygulama kabulü değildir.

S05notu: tarayıcıda /contact kaynak gövdesinde hâlâ30gün deneme ifadesi var. Önceki rapordaki süre çelişkisinin tamamen kapandığı iddiası doğrulanmıyor; içerik denetiminde kanıt/karar farkı olarak ele alınacak, bu tur metin değiştirilmedi. Sıradaki adım S05kaynak→veri→render içerik/etkileşim karşılaştırması. Canlı siteye deploy/push yok,2026kaynağı değişmedi,2027materyalleri ignored.


## 26.10.2026 — S05 ilk içerik denetimi; kabul henüz açık

110 yerel üretim rotası HTTP200/tekH1; erişim hatası ve yönlendirme yok. Bu kontrol tam içerik paritesi değildir. 16 rotadaki303 uzun yapısal kayıt ilk HTML'de yok; iki Yenilikler sekmesi tarayıcıda açıldığında metinleri görüldü. Aday kayıtlar otomatik kayıp sayılmaz. Altı boş bölümün dört bulut listesinde yanlış kaynak değişkeni nedeniyle gerçek çıkarım hatası bulundu; iki video galerisi ayrıca teyit bekliyor.

Dört somut açık: Basic/Concept/Professional/Civil bulut kartları; Eğitim'in varsayılan dışı sekme metinleri; Yenilikler genel bakış paragrafları; BIMFlex Aluplan ortaklık cümlesi. Son iki metin flat veride var fakat structured gösterimde yok. Canlı Contact doğrudan kontrolünde14/30gün çelişkisi doğrulandı; süreyi Aluplan ürün/satış yetkilisi doğrulamadan değiştirme. Yenilikler sekmelerinde panel rolü eksikliği uygulama kabulüne not edildi.

Kanıt ve sorumlular `docs/verification/stabilization-2026-10-26/S05-content-findings.md`, `render-audit.json`, `historical-text-candidates.json`, `targeted-live-check.json` içindedir. Yeni tarama aracı yalnız loopback HTTP(S) adreslerine izin verir, dış yönlendirmeyi reddeder, erişim/parse hatasında başarısız çıkar; script/style/RSC içeriğini gösterilen metin saymaz. Kod incelemesinin iki orta önerisi (yönlendirme sınırı ve hata özeti) eklendi. Bu tur app/veri/schema/tasarım değiştirilmedi; kaynak2026salt-okunur, canlıya push/deploy yok. S05tamamlandı işaretlenmedi. Sıradaki adım rapordaki C01–C04 kaynak sadakati düzeltmeleri ve etkileşimlerin genişletilmiş doğrulaması; S06henüz başlamadı.

S05 denetim aracının 5 testi dahil toplam48 birim testi ve36 mevcut parite kontrolü geçti; bu başarı rapordaki içerik açıklarını kapatmaz. Uygulama değişmediği için build tekrarlanmadı; S04 başarılı üretim derlemesi denetlendi. Geçici3001 sunucusu ve denetim sekmesi kapatıldı.


## 26.10.2026 — Deneme süresi kararı kapandı

Kullanıcı geçerli ALLPLAN ücretsiz deneme süresini14gün olarak kesinleştirdi ve resmî https://www.allplan.com/trial-or-subscription/ kaynağını verdi. Aynı gün sayfada “14 DAY FREE TRIAL” / “Limited to 14 days only.” doğrulandı. S05 C05 için ek firma onayı beklenmez; Contact'taki30gün ifadesi2027üretim/gösterim hattında14güne düzeltilecek, kaynak2026ve tarihsel kanıtlar korunacak. user-decisions.md ve S05raporu güncellendi; bu commit doküman kararıdır, uygulama değişmedi. Sıradaki adım C01–C04 içerik geri kazanımı ile C05 süre düzeltmesini test ederek tamamlamak.


## 26.10.2026 — S05 kaynak sadakati düzeltmeleri uygulandı

Kullanıcı onayıyla C01–C05ve ek C06kapandı: dört ürünün9'ar bulut kartı, Eğitim6sekmesi, Yenilikler2paragrafı, BIMFlex ortaklık paragrafı, Geometry Tools17/Steel Components26video galerisi geri yüklendi. Contact30gün cümlesi yalnız bu rota/tam metin için üretim politikasında14güne çevrildi; tarihsel veri ve kaynak2026değişmedi. Schema/fiyat/deneme hedefi değiştirilmedi. Eğitim modal talepleri mevcut ortakMSForms'a gider; genel eğitim gövdesi korunur.

56birim testi +36parite kontrolü; typecheck/build ve188kontrast kontrolü geçti. ProductionHTML110/110HTTP200/tekH1,0boş yapısal bölüm;11hedefli rota testi geri yüklenen metin/kart/video başlıklarını doğruladı. Yeni Eğitim6tab/6panelSSR'de mevcut. Kanıt render-after-s05.json/s05-targeted-after.json. Tarayıcı Work ayarlarında kapalı: yeni görsel/klavye kabulü bekliyor. Kod inceleme ajanı politika değişikliğinde sorun bulmadı; bütün diffin son ajan incelemesi kullanım limitiyle tamamlanamadı, ana ajan diffi ayrıca inceledi; tam bağımsız inceleme iddiası yok.

Kalanlar: kaynakta da olmayan5traininggörseli (sourceImageSrc kaydı, imageSrc:null; kırık istek yok),16rotadaki303ilkHTML adayının etkileşim denetimi, kırpılmış Yenilikler SEO/hero açıklaması ve diğer sekmelerin panel erişilebilirliği. Bunlar kapanmadan S05tamamlandı sayılmayacak. S06henüz başlamadı. Push/deploy yok. Sonraki oturumda tarayıcı erişimi varsa yeni Eğitim sekmelerini gerçek etkileşimle doğrula; kalan adayları kaynak eşliğiyle ayır.

Ek kapsam doğrulaması: ortak bulut düzeltmesi Ultimate rotasına da yansır; mevcut ek kartıyla10bulut kartı korunur. Böylece5ürün rotası etkilenir. Son bağımsız kod incelemesi yeniden denendi ve tamamlandı: kritik/yüksek/orta bulgu yok; kaynak eşliği ve genel Eğitim gövdesinin korunması doğrulandı. Önceki kullanım limiti nedeniyle eksik inceleme notu bu sonuçla aşılmıştır.

Geçici3001üretim sunucusu kapatıldı; kullanıcının mevcut geliştirme sunucusuna müdahale edilmedi.

## 27.10.2026 — S05 kalan303aday ve tarayıcı kontrolü

Tarayıcı erişimi yeniden çalıştı.303ilkHTMLadayı statik incelemede35workflowaltöğe+227workflowkategori+41FAQkategori olarak sınıflandırıldı; hiç render edilmeyen alan bulunmadı. Tarayıcıda15rotanın195workflowdurumu veFAQ5kategori/25yanıtı seçilerek metin eşliği doğrulandı,0hata. Eğitim6sekmesi veHome/Endkontrolü geçti. Workflow/FAQklavye, rovingtabIndex, aria-controls/tabpanels eklendi; yeni buildsonrası YeniliklerEnd/FAQHomekontrolü geçti. Yeni panel değişikliği içerik veya görsel karar değiştirmiyor.

YeniliklerSEO/hero'nun kesilmiş açıklaması, kaynak genel bakış paragrafının ilk tam cümlesine hizalandı; yalnız bu rota ve arama kaydı değişti.57birim testi+36parite, productionbuild/tip/188kontrast kontrolü geçti; bağımsız kod incelemesi önemli bulgu vermedi. Dar Eğitimekranında gözlenen354CSSpx genişlikte yatay taşma yok; screenshot ve browser-checks.json kanıtları docs/verification/s05-closure-2026-10-27/ altında.

303aday için etkileşim doğrulaması kapandı. S05genel kabulü hâlâ açık: kaynakta olmayan5traininggörseli temin/nihai görselsiz kabul bekliyor; uzaktanvideo/galerimodal akışlarının tümü ve sitegeneli görsel kabul tamamlanmadı. Seçili olmayanworkflow/FAQiçeriğinin ilkHTMLerişimi SEOyayın kabulünde ayrıca değerlendirilecek. S06başlamadı. Kaynak2026salt-okunur kaldı, pazarlama klasörü kullanılmadı, push/deploy yok. Sıradaki adım eksikvarlık ve medyamodal/görsel kabul tablosunu kapatmak; tokenrefaktörüne atlama.


## 27.10.2026 — Yayınsız yerel medya ve responsive kapanışı

Kullanıcı açıkça canlıya alınmayacağını belirtti; tüm çalışma yerel2027'de kaldı. S05kalan yerel kontroller tamamlandı:110masaüstü+110dar ekranrotası tarayıcıda açıldı; son durumda yataytaşma0, o anda yüklenen görselhatası0. Contactgridindeki22remminimumun354CSSpxekranda368pxtaşırdığı tespit edilip min(100%,22rem)ile düzeltildi. Bu mekanik kontrol bütün lazygörsellerin yüklendiği veya editöryal görsel tasarımın kabul edildiği anlamına gelmez.

53yapısalrotada69video/görselmodal örneği açılıp kapandı; hepsinde medyaURL'si ve scrollkilidi doğrulandı. Her rotanın varsa1video+1görsel türü seçildi; tüm kartların ve hariciYouTubeoynatımının tektek testi değildir. YerelMP4örneği readyState4/pausedfalse/time7.69sile oynadı. MediaDialog native showModalile medya ve arama odağı/arka plan izolasyonu/scrollkilidi/geri dönüşünü ortaklaştırır. MedyaCtrlK ikinciarama çakışması engellendi. TekdüğmeliTab/ShiftTabkenarında odak dışarı gittiği tarayıcıda yakalandı, açıkTabdöngüsü eklenip iki yöndeodak içeride kaldığı doğrulandı. AramadanBIMFlexnavigasyonu0dialog/normaloverflowile geçti. Uzunbaşlık/yataymobil örneğinde kapatma düğmesi ekran içindeydi.

57birimtesti+36parite, productionbuild/TypeScript ve188kontrast kontrolü geçti. Bağımsız kod incelemesi tamamlandı; sonTabdöngüsü ekince yeniden inceleme istendi. Kanıtlar docs/verification/s05-closure-2026-10-27/ altındaki responsive-*-after.json, media-route-samples.json, modal-behavior.json, local-video-check.json ve screenshotlar. Geçici3001sunucusu kapatıldı, kullanıcının sunucusuna dokunulmadı.

Beş kaynakTraininggörseli hâlâ fiziksel olarak yoktur; mevcut çalışma kararı görselsizpanelleri kullanmaktır. Metin/CTA'lar tam, sourceImageSrcizleri kayıtlı, kırıkistek yok. Eksikdosyaları geri kazanmış gibi sunma. Kaynaktemini ileride yapılabilir; bu durum yerel teknik çalışmayı durdurmaz. S05yerel teknik adımı bu sınırlı kapsam ve açıkistisnalarla tamamlandı; tüm kaynak içeriğin yüzde100paritesi, tümharicivideoların kullanılabilirliği veya nihai tasarımkabulü iddia edilmez. SSR/SEOsekmeleri ve genel görsel kabul sonrakiS06/S07çalışmasında ele alınır. S06token/bileşen sağlamlaştırma henüz başlamadı; fazonayı olmadan atlama. Push/deploy yok.

Son bağımsız inceleme de tamamlandı: önemli bulgu yok. Yerel media/iframe odaktayken özel Tab sarması uygulanmaz; tarayıcının oynatıcı iç kontrol sırası korunur. Bu son değişiklik sonrası production build ve TypeScript tekrar geçti.


## 27.10.2026 — S06-A kanonik stil hattı ve ilk ayrım

Kullanıcı S06devamını onayladı. globals.css içindeki kanonikDSkopyaları scripts/build_app_styles.py ile17girdiden üretilen tekçıktı yapıldı; uygulamaözelkuralları src/styles/application.css içinde. pnpm styles:generate önce tokenlarısonraCSS'yi üretir; styles:check saltokunurdrift kontrolüdür, test/buildiçinde zorunlu. globals.csselle değiştirilmez. KanonikfontsCSS'si publicURL'lere dönüştürülür. Mimar/mühendis/prekast3renk tokena taşındı; önceki değerler aynı, JSXrenksabitleri ve23fallback kaldırıldı. Palettestleri gelecekteki geçerli tokeneditlerini kilitlemez; pertheme/mode mutationtesti eklendi.

WorkflowSection ve structured-tab-key parenttan çıkarıldı; SubpageView2972→2738satır. JSXnormalize eşliği/callbacks aynı.64Python+36parite+29token testi, build/TypeScript/188kontrast geçti.110yerelrota200/tekH1,0boşyapısalbölüm;303aday değişmedi. CSSnormalize(rol eklerini geri çevirerek)HEADile aynı. Kanıt docs/verification/s06-2026-10-27/ altında. Yeni kod incelemesi önemli bulgu vermedi; ilk paletkilitleme önerisi düzeltildi.

Tarayıcı bu tur Workayarlarında kapalı: yeni görsel/etkileşim kabulü yapılmadı. HTTPvekaynak eşliği bunu ikame etmez. BuS06-Atemeladımıdır, S06tamamlanmadı. Sonraki adım application.css99hamrenkkullanımının anlamlıtema tokenlarına taşınması, lightheader/footer overrideların tokenkatmanına alınması; ölçü/tipografi/hareket ve büyükbileşen ayrımı devamı. İçerik/schema/dataJSONdeğişmedi, kaynak2026saltokunur, pazarlamaklasörü kullanılmadı, push/deploy yok. S07'ye atlama.


## 27.10.2026 — S06-B renk ve tema override katmanı

Kullanıcıdevam onayıyla application.css99hamrenk0'a indirildi.65visualrolü+8chrome değeri tokens.json'a taşındı; dört tema/modda önceki değerler korunur. Header/footer7alias artık component→semanticchrome; hover için yalnız modebağımsıztoken→tokencompatibilityalias kaldı. Renk değeri CSS'de değil tokens.json'dadır. Eski lightonbrandhover/beyazfg kombinasyonunun olası düşük kontrastı korunup riskolarak kaydedildi;188kanoniktokenkontrastını geçmesi bu renderaliasını doğrulamaz. Yeni tasarım/renkdeğişikliği yapılmadı.

Üretim application.css içindeki doğrudanHEX/RGB/HSL/HWB/Lab/LCH/OKLab/OKLCH/color()yazımını büyük/küçükharf bağımsız reddeder; negatif testler mevcutçıktının hatahalinde korunmasını doğrular. Overlay/header modeizolasyonu mutationtesti eklendi.66Python+36parite+30token testi, stylescheck, build/TypeScript/188kontrast geçti.110HTTProta200/tekH1/0boşyapısalbölüm;303aday değişmedi. color-migration.json65×4visual+8×4chrome eşliği ve tersCSSnormalizehash eşliğini kayıtlar. Kodincelemesi önemli bulguvermedi; case-insensitiveguardönerisi kapatıldı.

TarayıcıWorkayarında kapalı; yeni görsel/piksel kabulü yok. İçerik/schema/data/TSXdeğişmedi, kaynak2026saltokunur, pazarlamaklasörü kullanılmadı, push/deploy yok. Geçici3001sunucusu kapatıldı. S06devam ediyor: ölçü/boşluk/köşe/tipografi/hareket değerleri ve büyükbileşen ayrımı sıradakiadım; tarayıcıerişimi açıldığında yeni temakatmanı görselkontrolü yapılmalı. S07'yegeçilmedi.


## 27.10.2026 — GitHub repo ve workflow konumu

Kullanıcıboşrepo https://github.com/hazarvolga/aluplan-2027 adresini bildirdi. Connectorpublic/defaultmain/size0vegitls-remoteheadsboşsonuç doğruladı. Önceorigin yoktu, yereloriginbuHTTPSadreseeklendi. AGENTSkurallarıyenidenokunup mainüzerindeçalışmayıengelleyen yeniworkflowgereği codex/s06-metrics-tokensbranch'iaçıldı. KullanıcısonraAGENTS'eskihalinegetirdi; yenikurallar kökte DEVOPS MASTER WORKFLOW.md(1131satır)dosyasında. Bu dosyayı sonrakioturumlardaAGENTSilebirlikteoku. Dosya kullanıcıyaait, değiştirilmedi veS06commitinedahiledilmedi; untrackedkorunuyor. AGENTSşuanki46satırlıkhaliHEADileaynı. Push/PR/CI/mergeyapılmadı; canlıyayınzatenyasak. KullanıcıaçıkuzakteslimtalebivermedenyerelbaşarıyıGitHubbaşarısıdiyeanlatma.

## 27.10.2026 — S06-C445metrikdeklarasyonu

445applicationCSSdeklarasyonu semanticmetriklerebağlandı;120yenirol, dört tema/moddanormalharekette445/445eşlik ve0fark. Hedefhammetrik445→0:font-size/weight/line-height/letter-spacing/radius/gap/paddingve transition/animation süre/gecikme/easing. Varolanscalereuseyalnız4kapsamdaeşiolduğunda; fielddeğerlerikorundu. motion.durationaltındakiyenisüre/gecikmelerreducedmotionüretiminde0msolur; buöncedenrawsürelerikapanmayanreducekullanıcılarıiçinkasıtlıiyileştirme, tümpreferencespikseleşliğideğil.

Compositormetrikguard/negatiftestler eklendi.32token testi tema-yerelmetrikoverride ve reducedmotionsüre/gecikme kapanmasınıtesteder.67Python+36parite+32token, stylescheck, typecheck/build/188kontrastgeçti.110yerelrota200/tekH1,0boşyapısalbölüm,303adaydeğişmedi. Kodincelemesibağımsız4scopeçözümüteyitetti, önemlibulguyok. Kanıtmetrics-migration.json/render-after-metrics.jsonvedocs/verification/s06-2026-10-27/README.md. TarayıcıWorkayarlarındakapalı; yenigörsel/etkileşimkabulüyok. İçerik/schema/data/TSXdeğişmedi. Geçici3001sunucusukapatıldı.

S06tamamlanmadı: TSXinlineölçüler, diğerwidth/height/margin/transformtasarımdeğerleri ve büyükbileşenayrımıdevamedecek. S07'yeatlama. Kaynak2026saltokunurkaldı; push/deploy/remoteCIyok. Lint: DS/tokenlintPASS; ESLintkomuturepodayok(N/A). Gitdurumundakullanıcıworkflowdosyasınınuntrackedolmasıbeklenir; workingtreetümüylenettemizdiyeiddiaetme.

## 27.10.2026 — S06-D SSS dizini bileşen ayrımı

`SubpageView` içindeki çok kategorili SSS dizini `FAQSection` bileşenine çıkarıldı; kategori seçimi state'i bu bileşene taşındı. `DirectoryCategoryIcon` ayrı ortak dosyaya alındı ve referans/SSS alanları tarafından kullanılıyor. `StructuredFaqDirectory` sözleşmesi değişmedi; soru-yanıt, maddeler, tablolar, notlar ve dış CTA aynı kayıtlardan gösteriliyor. Sekme klavye davranışı, roving tabindex, aria bağlantıları ve ilk SSS öğesinin açık gelmesi korundu.

`pnpm typecheck`, 67 Python birim testi, 36 faz parite kontrolü, 32 token testi, `pnpm styles:check` ve `pnpm build` geçti. Önceki commit ile yeni bileşen arasındaki FAQ JSX ağacı biçim boşlukları normalize edilerek birebir eşleşti. Bağımsız kod incelemesinde kritik/yüksek/orta bulgu yok. Build'in değiştirdiği `next-env.d.ts` geri alınıp commit dışında tutuldu. Tarayıcı erişimi Work ayarlarında kapalı olduğundan yeni görsel/etkileşim kabulü yapılamadı. S06 devam ediyor: TSX inline ölçüler ve kalan büyük bileşen ayrımları sırada. İçerik/schema/URL/veri ve kaynak 2026 değiştirilmedi. Kullanıcıya ait `DEVOPS MASTER WORKFLOW.md` untracked kalacak ve commit kapsamına alınmayacak. Push/PR/deploy/canlı değişikliği yok.

## 27.10.2026 — S06-E inline ölçülerin token kaynağına alınması

Altı ana uygulama bileşenindeki sabit inline gap/padding/margin, metin genişliği, özel panel/görsel ölçüsü ve About satır aralığı değerleri semantik tokenlara taşındı. Directory kategori ikonunun çizgi kalınlığı ve özellik kartlarının `0/85/170/255ms` stagger adımları da token oldu; stagger `nth-child` CSS kurallarıyla uygulanıyor, reduced-motion'da tüm adımlar kapanıyor. Yüzde, `auto`, aspect ratio ve veri kaynaklı yerleşimler yapısal/dinamik bırakıldı.

`docs/verification/s06-2026-10-27/inline-style-migration.json`, önceki commit `8f50d5e31e6970725abde512831343c2d688c381` ile yeni JSX stil ağacını token değerleri aluplan/field × light/dark için çözerek karşılaştırır: 162/162 kalan stil nesnesi dört kapsamda aynı değeri verir. Eski dinamik stagger formülünün dört indeksi ayrıca yeni token karşılıklarıyla eşleştirildi. Token testine de yeni ölçü rollerinin tüm kapsamlar için eşit çözülmesi ve stagger/reduced-motion kontrolü eklendi.

`pnpm test` (67 Python + 36 faz parite + 34 token), `pnpm typecheck` ve `pnpm build` geçti. DS doğrulaması 188 kontrast çiftini geçti. Bağımsız incelemede kritik/yüksek/orta bulgu yok. `next-env.d.ts` build değişikliği geri alındı. Tarayıcı kullanımı Work ayarlarında kapalı olduğundan görsel kabul yapılmadı. S06 sürüyor: kalan görsel literal adayları, büyük bileşen ayrımı ve tarayıcı karşılaştırması. İçerik/schema/veri/URL ve kaynak 2026 değişmedi. Push/deploy/canlı işlem yok.

## 27.10.2026 — S06-F kenarlık kalınlığı tokenları

Uygulama stilindeki 125 sabit border shorthand kalınlığı (`1–4px`) `border.width.default/strong/accent/heavy` semantik tokenlarına taşındı. Görsel çizgiler aynı kalınlıkta; uygulama CSS üreticisi artık `border`, yönlü ve mantıksal border özelliklerindeki sayısal kalınlıkları (sıra ve CSS biriminden bağımsız) reddediyor. Sıfır/reset durumları ve renk fonksiyonları içindeki yüzdeler kabul edilir; `border-image-width` için yüzde kalınlıkları da ölçü olarak yakalanır.

Test öncelikle kırmızıya dönerek eski korumanın border genişliklerini yakalamadığını gösterdi; ardından sıra/unit varyasyonları ve mantıksal özellikler için negatif fixture'lar, dört kalınlık sınıfı için token kapsam testi eklendi. Güncel doğrulama: 68 Python birim testi, 36 faz parite kontrolü, 35 token testi, typecheck ve production build geçti; 188 kontrast kontrolünde hata yok. Build kaynaklı `next-env.d.ts` değişikliği geri alındı. Yeni browser kontrolü yapılmadı. S06 devam ediyor; boyut, offset, transform ve shadow sayılarını kullanım bağlamına göre inceleyeceğiz. İçerik/schema/veri/URL, kaynak 2026, canlı ve remote repo değişmedi.

## 27.10.2026 — S06-G sabit konum tokenları

Uygulama CSS'inde sabit konum rolüne sahip kart rozetleri, medya kontrolü, üç sticky alan ve 15 margin ölçüsü semantic space tokenlarına bağlandı. Var olan değerler korunur; offset ve optik hizalama tokenları dört tema/modda aynı sonucu verir. Yüzde tabanlı merkezleme ve sıfır/auto margin'ler yapısal olarak kaldı; klavye skip-link için `left:-9999px` istisnası yalnız `.alu-skip-link` seçicisine tanındı. Negatif testler token dışı `rem/px/em` konum ve margin değerlerini reddeder.

Güncel doğrulama: 70 Python birim testi, 36 faz parite kontrolü, 36 token testi, typecheck ve production build geçti; 188 kontrast kontrolünde hata yok. `next-env.d.ts` build değişikliği geri alındı. Tarayıcıda görsel kabul yapılmadı. S06 sürüyor; kalan width/height, transform, shadow ve blur adayları içerik yapısı ile etkileşim davranışından ayrıştırılarak ele alınacak. İçerik/schema/veri/URL, kaynak 2026, canlı ve remote repo değişmedi.

## 27.10.2026 — S06-H1 bileşen ölçüsü tokenları

Uygulama CSS'indeki 22 görsel bileşenin sabit width/height ölçüleri ayrı semantic rollerle tokenlaştırıldı: oynatma/zoom/kapatma kontrolleri, partner öğesi/logo yüksekliği, durum noktaları, pathway/product ikonları, benefit ve YouTube ikonları, playlist rozeti, workflow noktası, referans ve hakkımızda ikonları. Aynı sayısal değeri kullanan farklı bileşenler bağımsız semantic rollerde tutuldu; böylece gelecekte tek bir bileşenin ölçüsü diğerlerini etkilemeden değiştirilebilir. Altı yeni primitive yalnız mevcut ölçü skalasında karşılığı olmayan değerleri taşır.

TDD kaydı: tokenlar eklenmeden önce 22 rol dört tema/modda `undefined` döndü ve seçici testi 22 ham ölçüyü yakaladı; uygulama sonrasında ikisi de geçti. İçerik genişlikleri (`ch`), modal/viewport sınırları ve responsive minimum yükseklikler bu committe değiştirilmedi; bunlar H2 yerleşim sınıflandırmasına aittir. `pnpm test` (71 Python + 36 faz parite + 37 token), `pnpm typecheck` ve `pnpm build` geçti; 118 rota üretildi ve 188 kontrast kontrolünde hata yok. Tarayıcı görsel kabulü hâlâ açık; içerik/schema/veri/URL ve canlı sistem değişmedi.

## 27.10.2026 — S06-H2 içerik ve container ölçüleri

On altı semantic container rolü oluşturuldu ve 16 seçicideki içerik genişlikleri bunlara bağlandı: standart modal, cookie/YouTube banner'ları, hero başlık/açıklama satır uzunluğu, pathway sekmesi/açıklaması, bento metni, playlist thumbnail, intro/FAQ içerik kolonları, video/görsel modalı, referans araması, SSS sahnesi ve iletişim etiketi. Aynı ölçüyü paylaşan ama bağımsız değişmesi gereken cookie/YouTube ve intro/FAQ alanları ayrı semantic rollerde tutuldu. `min(100%, …)`, `min-width` ve `max-width` davranışları aynen korundu. Eksik rem ölçüleri primitive `size.measure` skalasına eklendi; okuma uzunlukları semantic `ch` kararları olarak tutuldu.

TDD kaydı: uygulamadan önce container tokenları dört tema/modda `undefined` döndü ve 16 seçici eski ham değerlerle testi kırdı; token bağlantılarından sonra iki test de geçti. Viewport yükseklikleri, responsive min-height değerleri, dekoratif glow ve çizgi ölçüleri bu adımın parçası değildir. `pnpm test` (72 Python + 36 faz parite + 38 token), `pnpm typecheck` ve `pnpm build` geçti; 118 rota üretildi ve 188 kontrast kontrolünde hata yok. Bağımsız review'da engelleyici bulgu çıkmadı; ortak semantic rol notu alanları ayırarak kapatıldı. İçerik/schema/veri/URL ve canlı sistem değişmedi.

## 27.10.2026 — S06-H3 yapısal layout ölçüleri

Header minimum yüksekliği, modal viewport sınırı, bento/servis/özellik medya minimum yükseklikleri, playlist desktop ve compact yükseklikleri, video/görsel modal viewport sınırları, referans sayacı ve harita yüksekliği 14 bağımsız `layout.application.*` rolüne taşındı. Desktop/mobile playlist değerleri ayrı tokenlarla aynı media-query davranışını korur. Tüm bento kartlarında 64rem altında kullanılan değer `bentoResponsiveMinHeight` adıyla gerçek kapsamını açıkça belirtir. `calc(100dvh...)` formülü token içinde aynen tutulur; responsive kural veya viewport mantığı değiştirilmedi.

TDD kaydı: uygulamadan önce 14 token dört tema/modda `undefined` ve selector sözleşmeleri ham değerler nedeniyle kırmızıydı; uygulama sonrasında desktop/mobile tekrarları dahil geçti. Dekoratif glow, metric rule ve divider ölçüleri H4 için kapsam dışında kaldı. `pnpm test` (73 Python + 36 faz parite + 39 token), `pnpm typecheck` ve `pnpm build` geçti; 118 rota üretildi ve 188 kontrast kontrolünde hata yok. Bağımsız review'daki bento rol adı ve media-context test boşlukları kapatıldı; son review engelleyici bulgu olmadan onaylandı. İçerik/schema/veri/URL ve canlı sistem değişmedi.

## 27.10.2026 — S06-H4 dekoratif ölçüler ve width/height kapanışı

Hero metric çizgisi, pathway glow ve ofis ayırıcısının altı width/height deklarasyonu dört bağımsız semantic size rolüne bağlandı. Glow için eksik `52rem` primitive measure eklendi; çizgi/ayırıcı kalınlıkları mevcut border-width primitive'lerinden beslenir. Repository testi artık `application.css` genelinde ham sayısal `width/height/min/max` deklarasyonu kalmadığını ve üç seçicide doğru property→token bağlantısını doğrular.

TDD kaydı: tokenlar eklenmeden önce dört rol `undefined`, üç seçici eski ölçülerle kırmızı ve genel tarama altı ham deklarasyon buluyordu; uygulama sonrasında testler geçti. Bu adımla width/height literal sınıfı kapanır. `pnpm test` (74 Python + 36 faz parite + 40 token), `pnpm typecheck` ve `pnpm build` geçti; 118 rota üretildi ve 188 kontrast kontrolünde hata yok. Bağımsız review'daki selector override ve CSS unit tarama açıkları kapatıldı; son review bulgusuz onaylandı. S06'da transform, shadow/blur ile büyük bileşen ayrımı ve tarayıcı görsel kabulü devam eder. İçerik/schema/veri/URL ve canlı sistem değişmedi.

## 27.10.2026 — S06-I1 ortak etkileşim transformları

On beş tekrarlanan hover hareketi beş ortak motion rolüne taşındı: `liftSubtle/Moderate/Strong` ile `nudgeSubtle/Strong`. Bunlar bileşen ölçüsü değil, site genelinde birlikte ayarlanması amaçlanan etkileşim yoğunluğu kararlarıdır. Eski `translateY(-2/-3/-4px)` ve `translateX(3/5px)` değerleri dört tema/modda aynen korunur. Pathway merkezleme geometrisi, FAQ chevron dönüşü, keyframe girişleri, component-state dönüşümleri, medya zoom ve statik dekoratif scale değerleri bu küçük commitin dışında bırakıldı.

TDD kaydı: uygulamadan önce repository testi 15 selectorın ham transform değerini, token testi ise beş rolü `undefined` olarak raporladı; uygulama sonrasında iki test de geçti. Exact-selector koruması aynı selectorın birden fazla blokta bulunmasını destekler, tüm bloklardaki transformları toplar ve prefixed selectorları yanlış eşleştirmez. `pnpm test` (75 Python + 36 faz parite + 41 token), `pnpm typecheck` ve `pnpm build` geçti; 118 rota üretildi ve 188 kontrast kontrolünde hata yok. Bağımsız code review kritik/yüksek/orta bulgu olmadan onayladı. S06-I sonraki küçük commitlerde medya zoom, component state, keyframe ve dekoratif transformları ayrı anlamlarla ele alacak; ardından kontrollü raw-transform guard kapanışı değerlendirilecek. İçerik/schema/veri/URL, kaynak 2026 ve canlı sistem değişmedi; push/deploy yapılmadı.

## 27.10.2026 — S06-I2 transform sınıfı kapanışı

Kalan 23 görsel transform 19 role ayrıldı: altı medya/control zoom pattern'i, altı bağımsız component state'i, dört pathway keyframe adımı ve üç statik dekoratif scale. Dekoratif değerler `semantic.transform.decorative` altında motion davranışından ayrıldı. Aynı sayısal scale değerleri primitive seviyede tekrar kullanılabilirken pathway active state, card media ve subpage overscan ayrı semantic rollerle yönetilir. Pathway merkezleme geometrisi ile FAQ disclosure chevron dönüşü işlevsel literal olarak bırakıldı.

Raw-transform guard yalnız tam `var(--semantic-token)` kullanımını kabul eder; mixed literal+var bileşimlerini reddeder. İki işlevsel literal hem toplam sayı hem exact selector/value sözleşmesiyle korunur; `transform-origin` guard kapsamına girmez. İlk bağımsız review üç orta bulgu verdi: mixed bypass, selector-bağımsız whitelist ve pathway/product primitive coupling. Üçü kapatıldı; delta review kritik/yüksek/orta bulgu olmadan onaylandı. `pnpm test` (77 Python + 36 faz parite + 42 token), `pnpm typecheck` ve `pnpm build` geçti; 118 rota ve 188 kontrast kontrolü doğrulandı. Transform literal sınıfı kapanmıştır. S06'da shadow/blur sınıfları, büyük bileşen ayrımı ve tarayıcı görsel kabulü devam eder. İçerik/schema/veri/URL, kaynak 2026 ve canlı sistem değişmedi; push/deploy yapılmadı.

## 27.10.2026 — S06-J1 filter ve backdrop blur tokenları

Sekiz `filter` ve dört standart/WebKit `backdrop-filter` deklarasyonu 11 bağımsız semantic role taşındı. Hero video tonu, pathway glow, üç ürün state'i, iki bento medya state'i, alt sayfa atmosferi ile header/media badge/modal backdrop blur değerleri ayrı tutuldu. Header ve WebKit yolu aynı semantic role bağlıdır; mevcut görsel değerler dört tema/modda aynen korunur. Blur veya filter yoğunluğu değiştirilmedi.

Compositor artık `filter`, `backdrop-filter` ve `-webkit-backdrop-filter` için yalnız tam `var(--filter-*)` kabul eder; raw değer, yanlış namespace ve raw+var/var+raw bileşimleri reddedilir. Transition içindeki `filter` kelimesi ve diğer property'ler etkilenmez. RED aşamasında 12 raw deklarasyon ve 11 `undefined` token yakalandı; GREEN sonrasında exact selector ve dört-mod testleri geçti. İlk review yanlış token namespace'inin kabul edildiğini buldu; guard ve negatif testler daraltıldı, delta review bulgusuz onaylandı. `pnpm test` (79 Python + 36 faz parite + 43 token), `pnpm typecheck` ve `pnpm build` geçti; 118 rota ve 188 kontrast kontrolü doğrulandı. S06-J2'de 19 ham shadow geometrisi ve `none` reset ele alınacak. İçerik/schema/veri/URL, kaynak 2026 ve canlı sistem değişmedi; push/deploy yapılmadı.

## 27.10.2026 — S06-J2 shadow tokenları

On dokuz ham `box-shadow` kompozisyonu ve ürün dimmed state'indeki `none` reset, 20 bağımsız `shadow.application.*` rolüne taşındı. Gölge ölçüleri `primitive.shadowGeometry` altında, bileşen anlamı ve dinamik tema/rol renkleri semantic katmanda tutulur. Aynı `0 24px 64px` geometrisini kullanan mega menu ile hero monitor farklı semantic rollere sahiptir. Selected-role ring kalınlığı doğrudan `primitive.borderWidth.1` bağıntısını korur; mevcut `elevation` token kullanımları değiştirilmedi.

Compositor yalnız kanonik `semantic.css`/`component-aliases.css` içinde tanımlı `--shadow-*` veya `--elevation-*` değişkenlerini tam değer olarak kabul eder. Raw, `none`, yanlış namespace, undefined token, mixed değer, yorumlu bypass ve component-local custom property reddedilir. Multiline shadowlar tek semantic değişkene indirildi; duplicate selector testleri beklenen rolün tek olmasını ve cascade'deki son/effective değer olmasını zorunlu tutar. İlk review bir yüksek ve üç orta, ilk delta bir orta bulgu verdi; tümü kapatıldı ve final review bulgusuz onaylandı. `pnpm test` (81 Python + 36 faz parite + 44 token), `pnpm typecheck` ve `pnpm build` geçti; 118 rota ve 188 kontrast kontrolü doğrulandı. Filter/shadow literal sınıfı kapanmıştır. S06'da büyük bileşen ayrımı ve tarayıcı görsel kabulü devam eder. İçerik/schema/veri/URL, kaynak 2026 ve canlı sistem değişmedi; push/deploy yapılmadı.

## 27.10.2026 — S06-K `/about` editoryal bileşen ayrımı

`SubpageView` içindeki yalnız `/about` rotasına ait 237 satırlık kurumsal editoryal görünüm `AboutEditorialSection` bileşenine çıkarıldı. Parent koşulu ve `PageRecord` veri sözleşmesi aynı kaldı; yeni bileşen hook, browser API veya yeni `'use client'` sınırı eklemez. Kurumsal metrikler, hikâye, değerler, ofis, bağlantılar, harita iframe özellikleri, DOM sırası ve CSS sınıfları korunur. `SubpageView` 2402 satırdan 2167 satıra indi.

TDD kaydı: extraction sözleşmesi önce yeni dosya bulunmadığı için RED verdi; uygulama sonrasında kritik içerik/URL/iframe işaretleri, parent importu ve tek `/about` render sınırı GREEN oldu. Dev sunucusundan alınan önce/sonra `/about` HTML çıktıları aynı 59.733 bayttır; görünür 126 metin düğümü, 15 başlık ve 43 link birebir eşleşir. Tam dosya hash'i Turbopack modül/chunk kimliği değiştiği için farklıdır ve görsel eşlik kanıtı olarak kullanılmaz.

`pnpm test` (82 Python + 36 faz parite + 44 token), `pnpm typecheck` ve `pnpm build` geçti; 118 rota üretildi ve 188 kontrast kontrolünde hata yok. Bağımsız inceleme kritik/yüksek/orta bulgu olmadan onayladı. Work ayarlarında yerel tarayıcı erişimi kapalı olduğundan gerçek masaüstü/mobil görsel kabul ve console/hydration kontrolü yapılmadı; bu açık kapı olarak kalır. İçerik/schema/veri/URL, kaynak 2026, canlı ve remote repo değişmedi. Kullanıcıya ait `DEVOPS MASTER WORKFLOW.md` untracked bırakıldı; push/deploy yok. S06 devam ediyor: kalan büyük `SubpageView`/`HomepageView` ayrımları ve tarayıcı kabulü sıradadır.

## 27.10.2026 — S06-L Benefits bileşen ayrımı

Yapılandırılmış ürün/çözüm sayfalarının ortak benefits kart alanı `BenefitsSection` bileşenine çıkarıldı. Parenttaki `benefits && items.length > 0` koruması, 8 veya 12+ öğede dört kolon ve diğer durumda üç kolon seçimi, DOM sırası, sınıflar, başlıklar, dekoratif ikon özellikleri ve lazy loading aynen korunur. Bileşen `StructuredPageLayout['benefits']` tipinden türetilir; yeni veri kopyası, hook veya `'use client'` sınırı eklenmedi. `SubpageView` 2167 satırdan 2130 satıra indi.

TDD'de yeni bileşen bulunmadığı için extraction testi önce RED verdi; uygulama sonrası GREEN oldu. Ek veri sözleşmesi 28 benefits rotasında bölüm başlığı, en az bir öğe, öğe başlık/açıklaması ve yerel ikon dosyalarını doğrular. `/products/allplan-ultimate` önce/sonra çıktısı 178.111 bayt; script/RSC ayrıntıları çıkarıldığında HTML birebir aynıdır. 263 görünür metin düğümü, 59 link, 12 benefit kartı ve 12 kart başlığı/sırası eşleşir.

`pnpm test` (84 Python + 36 faz parite + 44 token), `pnpm typecheck` ve `pnpm build` geçti; 118 rota ve 188 kontrast kontrolü doğrulandı. Bağımsız review önemli bulgu vermedi. Work ayarlarında tarayıcı erişimi kapalı olduğundan gerçek responsive/screenshot/console kabulü yapılmadı. İçerik/schema/veri/URL, kaynak 2026, canlı ve remote repo değişmedi; push/deploy yok. S06 devam ediyor.

## 27.10.2026 — S06-M Media grid bileşen ayrımı

`SubpageView` içindeki ortak `renderMediaGrid` fonksiyonu etkileşimli `MediaGridSection` bileşenine çıkarıldı. Parent yalnız grid verisini, kart key prefix'ini ve video/görsel modal callbacklerini geçirir. Extra-grid React `key` değeri component üzerinde; kart anahtarındaki önceki prefix ayrı `itemKeyPrefix` propuyla korunur. Default kolon, YouTube thumbnail fallback, badge/subtitle/açıklama/bullet sırası, video ve görsel aria metinleri, Enter/Space, `preventDefault`, internal `Link`, external `_blank`/`noopener noreferrer`, footer CTA ve lazy image davranışı aynıdır. Component açık `'use client'` sınırına sahiptir; parent zaten client olduğu için bundle sınırı genişlemez. Lazy/Suspense eklenmedi ve ilk HTML/SEO davranışı değiştirilmedi. `SubpageView` 2130 satırdan 1987 satıra indi.

TDD'de component dosyası bulunmadığı için mimari test RED, uygulama sonrasında GREEN oldu. Veri sözleşmesi 29 rotada 8 core + 46 extra = 54 grid, 362 kart, zorunlu başlık/açıklamalar ve yerel görsel dosyalarını doğrular. `/products/allplan-ultimate` önce/sonra çıktısı 178.111 bayt; script/RSC ayrıntıları çıkarıldığında HTML birebir aynıdır. 263 görünür metin düğümü, 59 link, 3 grid, 38 kart, 38 etkileşimli thumbnail, aria sözleşmesi ve kart başlık sırası eşleşir.

`pnpm test` (86 Python + 36 faz parite + 44 token), `pnpm typecheck` ve `pnpm build` geçti; 118 rota ve 188 kontrast kontrolü doğrulandı. Bağımsız review kritik/yüksek/orta bulgu olmadan onayladı. Work tarayıcı erişimi kapalı olduğu için gerçek click/Enter/Space modal, responsive screenshot ve console/hydration kabulü yapılmadı; kaynak/HTML kanıtı bunların yerine geçmez. İçerik/schema/veri/URL, kaynak 2026, canlı ve remote repo değişmedi; push/deploy yok. S06 devam ediyor.

## 27.10.2026 — S06-N Split callout bileşen ayrımı

Primary ve bottom konumlarında iki kez yinelenen split-callout JSX'i ortak `SplitCalloutSection` client bileşenine çıkarıldı. İki filtre ve bölüm sırası parentta ayrı konumlarda kaldı: `Lisans ve Gereksinimler`/`SCIA Engineer` bottom, diğerleri primary. Bileşen filtrelenmiş diziyi map ettiği için `reverse ?? index % 2` alternasyonu ve `callout-top`/`callout-bottom` key prefix'leri aynı kaldı. YouTube→thumbnail fallback, yerel MP4/poster/muted/playsInline/preload, image lightbox, click/Enter/Space, `preventDefault`, aria/role/tabIndex, paragraph fallback, bullet temizliği, video CTA ve external link güvenlik özellikleri korundu. Lazy/Suspense veya CTA `Link` dönüşümü yapılmadı. `SubpageView` 1987 satırdan 1626 satıra indi.

TDD'de component dosyası bulunmadığı için mimari test RED, extraction sonrası GREEN oldu. Veri testi 22 rota, 62 callout, 52 primary, 10 bottom, 27 YouTube, 5 MP4, 30 image ve tüm yerel dosyaları doğrular. Önce/sonra sabit HTML üç rotada birebir aynıdır: `/solutions/addons/geometry-tools` 2 callout ve primary+bottom; `/solutions/features-allplan-bridge` 12 callout/5 native video; `/products/allplan-ultimate` 1 bottom callout. Görünür metin, link hedef/target/rel sırası, reverse dizisi, media aria sözleşmesi ve video attributeları eşleşir.

`pnpm test` (88 Python + 36 faz parite + 44 token), `pnpm typecheck` ve `pnpm build` geçti; 118 rota ve 188 kontrast kontrolü doğrulandı. Bağımsız review kritik/yüksek/orta bulgu olmadan onayladı. Gerçek tarayıcı click/Enter/Space modal, responsive screenshot ve console/hydration kabulü Work ayarı nedeniyle açık kalır. İçerik/schema/veri/URL, kaynak 2026, canlı ve remote repo değişmedi; push/deploy yok. S06 devam ediyor.

## 27.10.2026 — S06-O Video Library Hub bileşen ayrımı

Video kütüphanesi ana görünümü stateless `VideoLibraryHubSection` bileşenine çıkarıldı. 22 kaynak kartı, sıraları, açıklamaları, hedefleri ve playlist video sayısı eşlemesi aynı kaldı: 14 yerel playlist, 4 dış kanal ve daha sonra karara bağlanacak 4 adet `#` hedef. Abonelik banner'ı, internal/external link davranışı ve güvenlik attributeları değiştirilmedi. Yeni client boundary, lazy veya Suspense eklenmedi. `SubpageView` 1626→1405 satıra indi.

Extraction kontratları önce dosya bulunmadığı için RED, uygulama sonrasında GREEN oldu. Yerel video hub `<main>` çıktısı önce/sonra 42.221 bayt ve SHA-256 `a0e340ad055b577e0746f4f13b51354f8779c2d415ea61edb7115231fe8306f5` ile birebir aynıdır; 22 kart, 1 banner ve 23 ilgili hedef aynı sıradadır. Bağımsız review'ın tam URL sırası bulgusu 22 başlık–URL çiftini kilitleyen testle kapatıldı. `pnpm test` (90 Python + 36 parite + 44 token), `pnpm typecheck`, `pnpm build`, 118 rota ve 188 kontrast kontrolü geçti. Gerçek tarayıcı etkileşim/görsel/console kabulü Work ayarı nedeniyle açık kalır. İçerik/schema/veri/URL ve canlı sistem değişmedi; `#` hedefler önceki açık karar listesinde kalır. Push/deploy yok; S06 devam ediyor.

## 27.10.2026 — S06-P Referans dizini bileşen ayrımı

`/references` sayfasındaki 10 kategorili filtre, canlı arama, sayaç, 228 kart ve boş durum görünümü `ReferencesDirectorySection` client bileşenine çıkarıldı. Catch-all rota geçişlerinde mevcut filtre/arama state'inin korunması için iki state parentta bırakıldı ve bileşen kontrollü props/callbacklerle bağlandı. Arama `trim().toLowerCase()` davranışı, kategori+arama birleşimi, `✕` ile yalnız arama temizliği ve boş durum düğmesiyle iki state'in sıfırlanması aynıdır. Yeni debounce, locale dönüşümü veya klavye davranışı eklenmedi. `SubpageView` 1405→1266 satıra indi.

Mimari kontrat dosya yokken RED, extraction sonrası GREEN oldu. Veri testi 10 kategori, 228 benzersiz kategori–isim çifti ve `228/59/13/32/29/24/52/3/9/7` sayaçlarını hem bildirim hem gerçek veri üzerinden doğrular. Yerel `/references` `<main>` çıktısı önce/sonra 198.256 bayt ve SHA-256 `6ae415f04c01e26bcc245a8b56e491a9f0dd39f8b7902633fce9c1a6663473fd` ile birebir aynıdır; 10 sekme, 228 kart, başlangıç seçimi ve kart sırası değişmedi. `pnpm test` (92 Python + 36 parite + 44 token), `pnpm typecheck`, `pnpm build`, 118 rota ve 188 kontrast kontrolü geçti; bağımsız review engelleyici bulgu vermedi. Work tarayıcı ayarı kapalı olduğu için kategori/arama/temizleme/boş durum gerçek tıklama E2E kabulü açık kalır. İçerik/schema/veri/URL ve canlı sistem değişmedi; push/deploy yok, S06 devam ediyor.

## 27.10.2026 — S06-Q Video playlist bileşen ayrımı

14 eğitim playlist rotasının oynatıcı, bilgi alanı ve video listesi `VideoPlaylistSection` client bileşenine çıkarıldı. `activeVideoId` parentta bırakıldı ve controlled prop/callback ile bağlandı; böylece ortak video ID'lerine sahip playlistler arasındaki mevcut catch-all rota geçiş davranışı değişmedi. İlk video fallback'i, indeks hesabı, iframe ve YouTube hedefi, açıklama fallback'i, iki sayaç, aktif kart/playing badge, thumbnail alt/lazy özellikleri korunur. Lazy, Suspense veya `key={playlist.id}` eklenmedi. `SubpageView` 1266→1147 satıra indi.

Boundary kontratı bileşen dosyası yokken RED, uygulama sonrasında GREEN oldu. Veri testi 14 playlist, 242 kayıt, 216 benzersiz global video ID'si, playlist içi benzersizlik, rota ilişkileri, tam playlist sayıları ve 14 ilk-video ID sırasını doğrular. `hello-allplan-2024` yerel `<main>` çıktısı önce/sonra 59.854 bayt ve SHA-256 `a5d0111757ec46680f4600e530fbf976c8cfa7553c0a51a8010e4ebe65e90695` ile birebir aynıdır; 39 öğe, tek aktif kart ve ilk iframe korunur. `pnpm test` (94 Python + 36 parite + 44 token), `pnpm typecheck`, `pnpm build`, 118 rota ve 188 kontrast kontrolü geçti; bağımsız review engelleyici bulgu vermedi. Work tarayıcı ayarı kapalı olduğundan video seçimi sonrası iframe/link/sayaç/aktif sınıf gerçek tıklama E2E kabulü açık kalır. İçerik/schema/veri/URL ve canlı sistem değişmedi; push/deploy yok, S06 devam ediyor.

## 27.10.2026 — S06-R Arama sayfası bileşen ayrımı

`/search` görünümü ve beş alanlı filtreleme `SearchPageSection` controlled client bileşenine çıkarıldı. `searchQuery` parentta bırakıldı; catch-all navigasyon/geri dönüşte mevcut state yaşam döngüsü korunur. Statik 110 kayıtlı indeks child modülünde okunur. `query.trim()` yalnız filtreyi açan koşuldur; eşleşme değeri mevcut davranış gibi trim edilmeden `toLowerCase()` uygulanır. Title/SEO title/description/path/keywords OR sırası, kaynak sırası, kart/link markup'ı ve anlık filtreleme değişmedi; debounce/lazy/Suspense eklenmedi. `SubpageView` 1147→1104 satıra indi.

Boundary kontratı dosya yokken RED, veri kontratı baştan GREEN ve extraction sonrası tümü GREEN oldu. Veri testi 110 benzersiz path'i `pages.json` sırasıyla, içerik alanlarıyla ve temsili sorgularla doğrular: boş/boşluk 110, `allplan` 79, `BIMFlex` 2, `Köprü` 9, `Prekast` 4, eşleşmeyen 0 ve mevcut trim edilmeyen ` bimflex ` davranışı 1 sonuç. Yerel `/search` `<main>` çıktısı önce/sonra 86.909 bayt ve SHA-256 `64f0a28ae881dbe891285f46e074049dfc64825c5a1e6bf7251107341437efb5` ile birebir aynıdır; 110 kart, başlık ve ilk/son rota korunur. `pnpm test` (96 Python + 36 parite + 44 token), `pnpm typecheck`, `pnpm build`, 118 rota ve 188 kontrast kontrolü geçti; bağımsız review engelleyici bulgu vermedi. Input'un önceden var olan görünür label/aria-label eksikliği erişilebilirlik iyileştirme maddesi olarak açık, bu extraction regresyonu değildir. Work tarayıcı ayarı kapalı olduğundan gerçek yazma/sonuç/link/Back E2E kabulü açık kalır. İçerik/schema/veri/URL ve canlı sistem değişmedi; push/deploy yok, S06 devam ediyor.

## 27.10.2026 — S06-S Alt sayfa hero bileşen ayrımı

Ortak breadcrumb, bölüm badge'i, H1/açıklama, teklif/deneme/PDF CTA'ları ve opsiyonel hero görseli stateless `SubpageHeroSection` bileşenine çıkarıldı. `isLegalPage`, dedupe edilmiş `photoImages`, `heroImage` ve `sectionBadgeLabel` parentta kaldı; bunlar galeri/spec akışıyla ortak kullanıldığı için yeniden türetilmedi. Yeni client boundary, wrapper, Next Image, lazy veya Suspense eklenmedi. Legal ve `/about` CTA istisnası, 18 `/products*` rotasındaki PDF koşulu, breadcrumb son öğe `aria-current` davranışı ve figcaption koşulu korunur. `SubpageView` 1104→1013 satıra indi.

Boundary kontratı bileşen yokken RED, veri dal testi baştan GREEN ve extraction sonrası tümü GREEN oldu. Veri testi 109 alt sayfa, 69 hero görselli rota, dört CTA'sız rota (`/about` + üç legal), 18 ürün rotası ve kaynak PDF dosyasını doğrular. İlk temsilî parity kontrolü iki benzer PDF adı nedeniyle `karsilastirma`/kaynak `karsilastirme` farkını yakaladı; component ve test kaynak hedefe geri döndürüldü. Son durumda ürün, about, legal, search ve playlist olmak üzere beş hero `outerHTML` çıktısı byte/hash düzeyinde aynıdır; link, görsel ve CTA dalları değişmedi. `pnpm test` (98 Python + 36 parite + 44 token), `pnpm typecheck`, `pnpm build`, 118 rota ve 188 kontrast kontrolü geçti. Work tarayıcı ayarı kapalı olduğundan responsive görsel/console kabulü açık kalır. İçerik/schema/veri/URL ve canlı sistem değişmedi; push/deploy yok, S06 devam ediyor.


## 27.10.2026 — S06 yerel teknik kapanış

Kullanıcının ara onay beklemeden kalan yerel adımları tamamlama talebiyle `docs/verification/s06-2026-10-27/closure-plan.md` uygulandı. S06'nın kod-kontrollü işleri tamamlandı; S07 tarayıcı/operatör kabulü ve yayın hazırlığına otomatik geçilmedi.

- Schema/veri: görünür 25 SSS kaydı `FAQPage` ile; sekiz eğitim hizmeti canonical benzersiz `Service.@id` ile eşleşir. Contact ve Organization aynı generated `siteIdentity` kaynağını kullanır.
- İçerik/presentation: homepage yıllık etiketleri, hero, hizmet grupları/ikon anahtarları ve video kataloğu generated data katmanındadır. `ProfessionalServicesSection` ayrıldı; yıllık Search/llms metinleri merkezi veriye bağlandı.
- Design system: workflow renkleri semantic accent key, bütün application z-index değerleri semantic token oldu. Üretim `preview.css` girdisindeki renk/ölçü/z-index kararları semantic tokenlara, 40/64rem responsive sınırları build-time breakpoint üretimine taşındı. Yapısal literal allowlist ve negatif guard `raw-literal-audit.json`/`test_design_literal_contract.py` içinde.
- Component mimarisi: 52 structured rota `StructuredPageLayoutSection` tarafından controlled props ile render edilir; `SubpageView` 723 satırdır. 273 related content link ve bütün bölüm sayıları testle kilitlidir.
- Erişilebilirlik: beş tab ailesinde ortak Arrow/Home/End, roving focus, kalıcı tab/panel ilişkisi; Search accessible name. Klavye helper'ı gerçek runtime testinde wrap/select/focus davranışıyla çalıştırılır.
- Yerel kabul: final tam paket 117 Python birim testi, typecheck, build, 36 parite, 45 token, 188 kontrast ve 118 build rotasıyla başarılıdır. `render-final.json` 110/110 HTTP 200, 110/110 tek H1, 0 fetch hatası, 0 bozuk yerel hedef, 0 boş structured section gösterir. İlk HTML'de görünmeyen 16 rota/303 etkileşim metni önceki baseline ile aynıdır.
- İnceleme: whole-branch review'ın bulduğu tek HIGH (`preview.css` token kapsamı) test-first kapatıldı. Son code review ve ayrı güvenlik review'u Critical/High/Medium bulgu olmadan onayladı.
- Browser kabulü açık: Codex yüzeyi `Browsers: Error: Local browser use is disabled in Work settings` verdi. Click/type, responsive, console/hydration ve dört tema/mod screenshot kabulü yapılmış sayılmaz; S07/operator kapısıdır.
- Kaynak 2026 salt-okunur kaldı; marketing materials, canlı sistem ve remote değiştirilmedi. Push/PR/merge/deploy yok. Kullanıcıya ait izlenmeyen `DEVOPS MASTER WORKFLOW.md` korunur.

Sıradaki güvenli adım: browser erişimi açıldığında S07 gerçek etkileşim + responsive + theme/console kabulü; ardından kullanıcı kararıyla branch push/PR veya yerel merge. Canlı yayın ayrıca açık onay gerektirir.

## 27.10.2026 — GitHub teslim hazırlığı

Kullanıcı boş `hazarvolga/aluplan-2027` remote'una tam GitHub teslim zincirini uygulama onayı verdi. Kök `DEVOPS MASTER WORKFLOW.md` takip altına alındı (`597b65d`). PR ve `main` pushlarında generated-data drift, 117 test, 36 parite, 45 token testi, typecheck, production build ve production dependency audit çalıştıran minimum `contents: read` yetkili CI eklendi (`ea87df7`). Action bağımlılıkları tam commit SHA ile sabittir; Node `20.20.2`, pnpm `10.24.0` kullanılır. Yerel doğrulama ve bağımsız code review başarılıdır.

Public-repo güvenlik incelemesinin üçüncü taraf ALLPLAN/AX3000 varlıkları için açtığı durdurma kapısı kullanıcı kararıyla private repository üzerinden kapatıldı; GitHub repository görünürlüğü `PRIVATE` olarak doğrulandı. İlk push öncesinde tüm `main` ve çalışma dalı commitlerinin author/committer e-postası GitHub noreply adresine çevrildi, izlenen dokümanlardaki mutlak kullanıcı yolları göreli veya taşınabilir referanslarla değiştirildi. Geçmiş yeniden yazımı öncesi doğrulanmış bundle `/tmp/aluplan-2027-pre-github-rewrite-20261027.bundle` altında yalnız yerel kurtarma amacıyla tutulur; repoya eklenmez. İlk push öncesi remote boştu; aşağıdaki kayıt teslim zincirinin kapanış durumunu verir. Canlı deploy yoktur.

İlk GitHub Actions çalışması `40526513349`, bağımsız runner'da `../aluplan-2026` checkout'u bulunmadığı için belge hazırlama adımında fail-fast oldu. Veri üretim ön kontrolü TDD ile taşınabilir hale getirildi: salt-okunur kaynak checkout mevcutsa önceki sıkı kaynak doğrulama/senkronizasyonu korunur; checkout yoksa commitlenmiş manifest ve belge kopyaları allowlist, boyut, SHA-256, dosya yapısı ve symlink/path güvenliğiyle doğrulanır, kopyalama veya sentetik belge üretimi yapılmaz. İki fallback testi eklendi. Yerel tekrar doğrulamada 119 test, 36 parite, 45 token ve 188 kontrast kontrolü, typecheck, 118 rota production build'i ve production dependency audit geçti. Bağımsız code/security review engelleyici bulgu bildirmedi. PR CI tekrarının başarılı olması hâlâ merge kapısıdır.

İkinci GitHub Actions çalışması `40527172999`, belge ön kontrolünü geçti ancak macOS global `Icon?` ignore kuralının yerelde 45 adet `icons/` PNG dosyasını sessizce Git dışında bırakması nedeniyle generated-data drift kapısında durdu. Temiz Linux clone aynı adlı tracked fallback dosyalarını seçerken yerel üretim kaynak-faithful fakat untracked yolları kullanıyordu. Repo `.gitignore` kuralı yalnız `public/assets/**/icons/*.png` kapsamını açıkça geri dahil edecek biçimde daraltıldı; kaynak 2026 ile SHA-256 eşleşmesi doğrulanan 45 küçük PNG takip altına alındı. Yeni guard testi render edilen generated-data asset URL'lerinin hem mevcut hem Git tracked olmasını zorunlu kılar; eksik olduğu zaten envanterde korunan `sourceImageSrc` provenance değerleri render hedefi sayılmaz. `pages.json` içeriği ve SHA-256 değeri değişmedi. PR CI başarılı olmadan merge yoktur.

Teslim kapandı: [PR #1](https://github.com/hazarvolga/aluplan-2027/pull/1) başarılı üçüncü PR CI çalışması `40528881783` sonrasında merge commit `136e0c2c4d16b59789126083e538014696ceb83a` ile `main` dalına alındı. `main` push CI çalışması `40529150402` da generated-data, 120 test, parite, token/kontrast, typecheck, production build ve dependency audit adımlarının tamamında başarılı oldu. Yerel `main` bu merge commitine fast-forward edildi; post-merge `pnpm test`, `pnpm typecheck` ve `pnpm build` tekrar geçti. GitHub Actions, Node 20 tabanlı action runtime'larını runner üzerinde Node 24'e zorladığına dair engelleyici olmayan bir deprecation uyarısı veriyor; action sürüm yükseltmesi ayrı bakım işi olarak izlenmelidir. Canlıya yayın yapılmadı; S07 browser kabulü ve ayrı deployment onayı açık kalır.

## 27.10.2026 — Sayfa sonu dönüşüm alanı tasarım kararı

Kullanıcı otomatik “İlgili Bağlantılar, Modüller ve Dokümanlar” bölümünün sayfa mesajını böldüğünü belirtti; sayfa sonunun önceliğini teklif/deneme dönüşümü olarak seçti. Mevcut temiz `main` (`862ebb15e328c6eee47755d6070f8d333a4125b9`) için `restore/pre-page-end-conversion-20261027` annotated tag'i oluşturulup GitHub'a gönderildi. Seçilen yaklaşım tek bileşenin sayfa ailesine göre CTA üretmesidir: ürün/çözüm teklif + deneme, eğitim eğitim talebi + teklif, destek destek platformu, legal hiçbir band. Kısa tasarım `docs/superpowers/specs/2026-10-27-page-end-conversion-design.md` ile onaylandı; test-first uygulama planı `docs/superpowers/plans/2026-10-27-page-end-conversion.md` içinde son kullanıcı kontrolünü bekler. Ürün kodu, veri, schema ve canlı site henüz değiştirilmedi.

## 29.10.2026 — ALLPLAN Max yerel önizleme

Kullanıcı 2027 ana sayfasını şimdilik yeterli bulup ALLPLAN Max sayfasını istedi. `/preview/allplan-max` yalnız geliştirmede çalışan, noindex yerel taslaktır; ana sayfa 2027 önizlemesindeki MAX bağlantısı buraya gider. İçerik `docs/content-2027/allplan-canlı/allplan-max.md` envanterinden EN/TR veri olarak ayrıldı; kaynak video ve özellik görselleri yerel preview varlıklarına kopyalandı. Üretim URL'si, schema, sitemap ve yayın güncellenmedi. Typecheck ve HTTP 200/noindex kontrolü geçti; tarayıcıda görsel ve etkileşim kabulü henüz yapılmadı. Üretici medyasının yayın kullanım izni, 2027 ürün kapsamı, 2026 sınırsız kullanım ifadesinin geçerliliği ve anket iddialarının kullanım koşulları yayın öncesi doğrulanmalı. YouTube iframe'leri kapalı details içinde de oluşturuluyor; etkileşim öncesi ağ isteği kontrolü ve gerekiyorsa tıklamayla yükleme tamamlanmalı. Çalışma ağacındaki önceki taslaklar korunmuştur; commit/push/deploy yapılmadı.

29.10.2026: Kullanıcı isteğiyle ALLPLAN Max anket bandı, Mimari sayfasındaki ortak `alu-hero-metrics` kart düzenine uyarlandı; üç anket metni ve değerleri korundu. Typecheck ve yerel sayfada üç kartın render kontrolü yapıldı. Taslak için kullanıcı görsel değerlendirmesi bekleniyor.

29.10.2026: ALLPLAN Max video düğmeleri mevcut MediaDialog ile açılan pencerelere taşındı; iframe yalnız pencere açıldığında yüklenir ve kapanınca kaldırılır. ALLPLAN canlı sayfası yeniden kontrol edilerek dokuz güncel video ID'si kullanıldı; Formula Writer ve BIM Modeler video bağlantıları eklendi. Typecheck ve Feature Builder modal açma/Escape/odak dönüşü tarayıcıda doğrulandı; video oynatma ve diğer sekiz modal ayrı ayrı doğrulanmadı. Ana özellik satırlarının görsel düzeni kullanıcı incelemesine açıktır. Yayın ve commit yapılmadı.

29.10.2026: ALLPLAN Max canlı sayfası tekrar incelendi; önceki envanter ile son gözlem farkları `docs/content-2027/allplan-canlı/allplan-max.md` sonuna tarihsel kayıt korunarak eklendi. Preview'da AI BIM Modeler Allplan kapsamı ve üç görüşün canlıda görülen isim/meslekleri gösteriliyor; dokuz video hedefinin veri kayıtları canlı gözleme hizalandı. Farkların üretici güncellemesi veya önceki DOM görünürlüğünden hangisi nedeniyle oluştuğu bilinmiyor. Diğer üretici dokümanları bu turda yeniden incelenmedi. Typecheck ve sayfa HTML içerik kontrolü yapıldı; ticari koşullar ve medya kullanım izni yayın öncesi açık.

29.10.2026: Kullanıcının bildirdiği ALLPLAN Max video görünümü incelendi. Marketing Materials içindeki dosya ile preview varlığının SHA-256 değerleri aynı; dosya zaten yerel asset altında mevcut. `preload="none"` ve ayrılmış en-boy oranı bulunmaması nedeniyle oynatıcı başlangıçta ince, boş şerit halinde görünüyordu. Önizlemede metadata ön yükleme ve 16:9 alan eklendi. Tarayıcıda video 1920×1080, 60,01 sn olarak yüklendi ve oynatma doğrulandı; typecheck geçti. Canlıya yayın yapılmadı.

29.10.2026: ALLPLAN Max ana özelliklerinin canlı sayfadaki sunumu yeniden incelendi: üç bölümde açıklama yanında sessiz döngülü kaynak klip, metinde tam videoyu modal açan bağlantı bulunuyor. Preview'a üç yerel üretici klibi ve dönüşümlü iki sütun düzeni eklendi; bağlantı modal açıyor, reduced-motion seçeneği ve mobil düzen dikkate alındı. Typecheck, yerel medya yüklemesi ve Feature Builder modal açma/Escape doğrulandı; üç klibin eşzamanlı yükleme maliyeti ve üretici medya izni yayın öncesi değerlendirilmeli.

29.10.2026: ALLPLAN Max diğer özellikler kartlarında ürün kapsamı metinleri token tabanlı şerit olarak düzenlendi. Kullanıcının Marketing Materials klasörüne indirdiği Feature Builder, Workflow Builder ve BIM Analyst önizleme klipleri ile mevcut preview assetleri SHA-256 bakımından birebir eşleşiyor; tekrarlı kopya oluşturulmadı. Typecheck ve önizleme içerik kontrolü yapıldı.

29.10.2026: Kullanıcı isteğiyle ALLPLAN Max diğer özellik kartlarında video bağlantıları kapsam şeridinin üstüne taşındı, şeritler flex düzeniyle kartların altına hizalandı. Typecheck geçti; tarayıcıda altı şeridin kart altına aynı uzaklıkta olduğu doğrulandı.

29.10.2026: Kullanıcı, video izleme gibi metin biçimindeki bağlantılarda alt çizgi istemediğini belirtti. ALLPLAN Max önizlemesindeki ortak video tetikleyicisinin normal ve hover durumlarından alt çizgi kaldırıldı; klavye odağı göstergesi korunuyor. Bu tercih benzer bağlantı tasarımlarında da dikkate alınacak.

29.10.2026: ALLPLAN Max müşteri görüşleri kullanıcı isteğiyle daha kompakt, ince ayraçlı bir düzene alındı; yorum, isim, meslek ve kaynak bilgisi ayrıştırıldı. Geniş ekranda başlığın tek satır olduğu ve üç atfın render edildiği yerel tarayıcıda kontrol edildi; typecheck geçti. Kullanıcı görsel değerlendirmesi bekleniyor.

29.10.2026: Kullanıcı isteğiyle ALLPLAN Max giriş alanı ayrı, kompakt ince çizgili bölüme dönüştürüldü ve yorum başlığı yanındaki ALLPLAN etiketi kaldırıldı. Site genelinde URL bağlantılarının normal ve hover alt çizgileri kaynak stillerden kaldırıldı; görünür klavye odağı korundu, paragraf içi bağlantılar kalınlıkla ayrıştırıldı. Link design-system notu güncellendi. Typecheck, stil üretimi ve 188 kontrast kontrolü geçti; tüm sayfalarda görsel/erişilebilirlik kabulü henüz yapılmadı.

29.10.2026: ALLPLAN Max ana video bölümünde görünür kaynak etiketi kullanıcı isteğiyle kaldırıldı ve üst/alt padding sıfırlandı; kaynak bilgisi envanterde korunuyor. Typecheck ve tarayıcıda hesaplanan padding değerleri doğrulandı.

29.10.2026: ALLPLAN Max kapanış CTA alanı kullanıcının isteğiyle daha kompakt ve ince ayraçlı iki sütun olarak yeniden düzenlendi; demo ve deneme bağlantıları ve içerik korundu. Typecheck ve yerel tarayıcıda tek satırlı başlık ile CTA içerikleri kontrol edildi; kullanıcı görsel değerlendirmesi bekleniyor.

29.10.2026: Kullanıcı ALLPLAN 2027 yenilikler sayfasının önceki envantere dayanılmadan doğrudan canlı üretici sayfasından hazırlanmasını istedi. `/preview/allplan-2027-features` geliştirme-only noindex taslağı beş ürün grubu, 15 ana özellik ve 34 detay (31 ALLPLAN + 3 SCIA) içerir; kaynak görsellerinin 14 yerel kopyası ile Civil videosu eklendi. Ana sayfa 2027 önizlemesinin yenilikler CTA'sı bu taslağa bağlandı. Kaynakta sekmeler vardır; taslakta bölüm içi bağlantılar kullanıldı, tasarım kabulü açık. FRILO yalnız ana sayfa bandından çıkarıldığı için kaynak sayfa kapsamında tutuldu. Üreticinin Buy Now CTA'sı Türkiye satış hedefi kararı olmadığı için kullanılmadı; mevcut teklif ve deneme bağlantıları korundu. IFC4 için buildingSMART sertifikasyonunun incelemede olduğu bilgisi korunur. Typecheck, dört homepage preview testi, noindex/HTTP ve DOM'da kapsam/IFC açılır açıklaması doğrulandı. Ana özelliklerin İngilizce kaynak metninin veri katmanında kaydı, teknik çeviri/editoryal inceleme, medya hakları ve mobil/video kabulü açık; canlı yayın yok.

29.10.2026: Kullanıcı ALLPLAN 2027 yeniliklerinin uzun tek liste halinde incelenmesinin zor olduğunu belirtti; önizleme beş ürün sekmesine çevrildi. Varsayılan ALLPLAN, diğer paneller seçildiğinde yalnız seçilen içerik render edilir; mevcut klavye helper'ı ve mobil yatay kaydırma kullanılır. Typecheck ve HTTP/SSR kontrolünde beş tab/panel ve tek seçili tab doğrulandı. Work tarayıcı erişimi bu turda kapalı olduğundan etkileşim ve mobil görsel kontrolü yapılamadı.

29.10.2026: ALLPLAN 2027 önizleme özellik satırları kullanıcı isteğiyle kompakt, ince çizgili, kapsam şeritli ve dönüşümlü görselli düzene güncellendi. İçerikler ve sekmeler korundu; tip kontrolü ve HTTP 200 geçti. Görsel/mobil kullanıcı kabulü bekleniyor.

29.10.2026: ALLPLAN 2027 önizlemesindeki diğer iyileştirmeler akordiyonları ince çizgili kompakt satırlara dönüştürüldü; açık/kapalı göstergesi ve klavye odak stili eklendi, içerikler ile native details/summary korundu. Typecheck ve HTTP 200 kontrolü geçti; mobil ve tarayıcı etkileşim incelemesi açık.

29.10.2026: ALLPLAN 2027 önizlemesindeki sekme paneli ve akordiyonlara mevcut motion tokenlarıyla hafif giriş/geçiş efektleri eklendi; reduced-motion tercihinde animasyon kapalı. Native details korundu; akordiyon yüksekliği/kapanışı animasyonlu değildir. Typecheck ve HTTP geçti, tarayıcı görsel/azaltılmış hareket testi açık. Site geneline yaygınlaştırma bu turda yapılmadı; önizleme kullanıcı değerlendirmesinde.

29.10.2026: 2027 yenilikler kapanış alanı kompakt ince çizgili düzene taşındı. İki önizlemenin daha önce ayrı kapanış markup'ı `PreviewClosingSection` sunum bileşeninde birleştirildi; içerik ve CTA hedefleri ayrı veriliyor. Mevcut üretim `PageEndConversion` ve politikası değiştirilmedi. Typecheck, iki önizlemede HTTP 200 ve code review geçti; mobil/görsel kabul açık.

29.10.2026 — Tasarım kararı: Kullanıcı kompakt, ince çizgili, keskin köşeli ve ortak şablon kullanan tasarım dilinin yeni sayfalarda varsayılan uygulanmasını onayladı. Önceden oluşturulan sayfalardaki tekrarlanan ortak alanlar da sonradan aynı dilde değerlendirilecek; kapsam/sayfa ve görsel kabul ayrı takip edilecek, bu not toplu değişikliğin tamamlandığı anlamına gelmez.

29.10.2026: Kullanıcı kompakt tasarımın yeni sayfalarda varsayılan olması ve eski ortak alanların daha sonra değerlendirilmesi kararını verdi. `/preview/allplan-civil-2027` yalnız geliştirmede/noindex yerel taslak açıldı; güncel https://www.allplan.com/products/allplan-civil/ kaynak alındı. 28 özellik, 9 cloud, 4 opsiyon, 2 SSS, 3 uzman/3 referans, kaynak video hedefleri ve kapanış CTA yer alıyor. Üç kapsam ve üç referans görseli dosya adı eşleştirilerek eklendi (uzak dosya hash doğrulaması yok); hero, katalog ve diğer kaynak görselleri eksik. Bazı çeviriler kısaltılmış/parafraz; kaynakla eksiksiz eşleşme iddia edilmez ve satır bazlı editoryal inceleme gereklidir. Abonelik/ref bağlantıları ve üst video eklendi. Türkiye paket koşulları, nicel iddialar ve medya hakları doğrulanmalı. Typecheck, HTTP 200 ve noindex kontrolü geçti; tarayıcı/mobil/video oynatma kabulü yapılmadı, yayın yok.

29.10.2026: ALLPLAN Civil metrikleri, diğer sayfalarda kullanılan ortak alu-hero-metrics düzenine geçirildi; dört değer ve açıklamaları korundu. Typecheck ve sunulan HTML'de dört metrik doğrulandı; tarayıcı erişimi devre dışı olduğundan görsel/mobil kabul açık.

29.10.2026: Civil önizleme hero'su kullanıcı isteğiyle yeni üretilen altyapı/köprü görseli ve sola doğru yüzey rengine karışan arka planla güncellendi. Yüksek çözünürlüklü orijinal assets/source/generated/heroes/civil/allplan-civil-hero-original.png, web kopyası public/assets/previews/allplan-civil-2027/civil-hero.jpg. Typecheck ve görsel HTTP 200 geçti; tarayıcıda açık/koyu ve mobil görsel kabul henüz yapılmadı.

29.10.2026: Kullanıcı Civil sayfasının tümünde kompakt tasarımın tutarlı uygulanmasını ve hero metninin görselle çakışmamasını istedi. Civil preview CSS'de hero başlığı sınırlandırıldı, görsele soldan maske eklendi; zorluklar, katalog, kapsam, referans ve SSS alanları token tabanlı ince çizgili kompakt düzene taşındı. Metrikler mevcut alu-hero-metrics ve kapanış PreviewClosingSection kullanıyor; diğer kataloglar henüz ortak React bileşenlerine taşınmadı. Typecheck ve HTTP 200 başarılı; tarayıcı/mobil/tema görsel kontrolü açık. Kaynak içerik ve medya eksikleri önceki notlarda devam ediyor.

29.10.2026: Kullanıcı Mimari sayfasındaki giriş ve sektörel zorluk düzenlerini Civil için örnek gösterdi. Civil girişinde metin ve kapsam solda, video sağda olacak biçimde ortak alu-intro-split sınıfları kullanıldı. Dört zorluk ortak alu-challenges-band/grid/card stillerine geçirildi; Civil içeriği ve bağlantıları korundu. Typecheck ve HTTP 200 doğrulandı; tarayıcıda görsel ve responsive kabul açık.

29.10.2026: Kullanıcı site genelinde tasarım tutarlılığı ve ortak bileşen envanteri istedi; Civil avantajları önceki yetkili düzeltme olarak BenefitsSection'a taşındı (8 metin ve bağlantılar korundu). Statik rota/bileşen denetimi docs/verification/design-consistency-audit-2026-10-29.md içinde; 110 veri kaydı/53 structuredLayout incelendi, tüm rotalarda görsel tarayıcı kabulü yapılmadı. Özellikler için MediaGridSection ile Civil Catalogue farkı ve eksik kaynak görselleri, ortaklaştırma planının ilk maddesidir. Analiz aşamasında site genelinde toplu tasarım değişikliğine gidilmedi.

29.10.2026: Kullanıcının onayıyla Civil özellik kataloğu için kaynak–yerel medya fark kaydı docs/verification/civil-feature-media-audit-2026-10-29.md oluşturuldu. Preview'da CivilFeatureGrid adaptörü mevcut MediaGridSection'ı ve MediaDialog'u kullanıyor: 28 kart ve 14 video düğmesi HTML'de doğrulandı, typecheck ve HTTP 200 geçti. Videolu kartların küçük görseli YouTube kaynağından otomatik gelir; kaynağın özgün görsel eşleşmesi değildir. Kaynak görselleri, bazı kısaltılmış Türkçe metinler, medya izinleri ve 14 videonun gerçek oynatımı açık; tarayıcı etkileşim/mobil kabul yapılmadı. Shared production MediaGridSection değiştirilmedi.

30.10.2026: Civil önizlemesinde sekiz avantaj ikonu ve 28 özellik görseli, mevcut ALLPLAN Civil medya envanterindeki yerel dosyalardan asset dizinine alınıp ortak bileşenlere bağlandı. Görselsiz/video olmayan kartlar için görsel modalı eklendi, videolu kartlarda mevcut video modalı korunuyor; dört sütun kullanıldı. Kaynak URL/dosya hash karşılaştırması ve görsel uygunluğu tüm 28 öğede henüz doğrulanmadı; kaynak medya yayın izinleri açık. Typecheck ve yerel asset dosya kontrolü yapıldı; tarayıcı etkileşim/mobil kabul açık.

30.10.2026: Civil satın alınabilir seçenekler alanı mevcut MediaGridSection ve CivilFeatureGrid adaptörünün options varyantıyla dört sütunlu medya kartlarına geçirildi; dört metin, BIM²form video hedefi ve yerel envanter görselleri korundu. Typecheck ve HTTP kontrolü geçti. Üretici medya hakları, bölgesel ticari uygunluk ve tarayıcıda etkileşim/görsel kabul açık.

30.10.2026: Civil uzman görüşleri alanı kullanıcı isteğiyle ALLPLAN Max yorum bölümünün mevcut CSS düzenini kullanacak şekilde yenilendi; üç uzman adı, görevi, alıntısı ve video URL'si korundu. Typecheck ve HTTP 200 geçti; görsel/mobil tarayıcı kabulü açık. Paylaşılan React bileşeni değil, ortak CSS modülü kullanılıyor.

30.10.2026: Civil uzmanlar bölümü ALLPLAN Max yorum düzeninin CSS modülüyle; Cloud Services ise mevcut MediaGridSection adaptörüyle yeniden düzenlendi. Dokuz hizmetin metinleri, video hedefleri ve yerel envanter görselleri ile Cloud Services bağlantısı korundu. Typecheck ve HTTP 200 geçti; tarayıcıda görsel/etkileşim kabulü ve medya hakları açık.

30.10.2026: Kullanıcı firma geri bildirimiyle FRILO'nun kapsamda olduğunu bildirdi; önceki ana sayfa bandından dışlama kararı güncellenmeli. Üreticinin https://www.allplan.com/shop/products/frilo sayfasından /preview/frilo dev-only noindex ilk taslak oluşturuldu. Beş paket ve temel özellikler özet düzeydedir; kaynak sayfadaki tüm paket detayları, capability, referans, SSS ve görseller henüz aktarılmadı. Türkiye ürün/paket koşulları ve 14 gün FRILO denemesi için bölgesel geçerlilik doğrulanmalı; FRILO deneme CTA üreticiye işaret eder. Ana sayfa bandına FRILO henüz eklenmedi. Typecheck/HTTP 200 doğrulandı; yayın ve görsel kabul yapılmadı.

30.10.2026: Kullanıcı FRILO sayfasında fiyat gösterilmeyeceğini teyit etti. /preview/frilo taslağına canlı üretici sayfasındaki beş yetenek, iki proje ve beş SSS'nin Türkçe özetleri eklendi; fiyat eklenmedi. Typecheck ve HTTP 200 geçti. Sayfa hâlâ eksik: beş paketin tüm ayrıntılı maddeleri ve kaynak proje bağlantıları/görselleri aktarılmadı, 2027 ana sayfa bandında FRILO yok, tüm çeviriler ve Türkiye kapsam koşulları doğrulanmadı; bu durum tamamlanmış kaynak paritesi sayılmaz.

30.10.2026: FRILO preview için yapı mühendisliği temalı üretilmiş hero eklendi. Orijinal assets/source/generated/heroes/frilo/frilo-hero-original.png; optimize web kopyası public/assets/previews/frilo/frilo-hero.jpg. Metin solda, görsel sağda ve soldan maskeli. Typecheck/HTTP 200 geçti; açık/koyu ve mobil görsel kabul yapılmadı. FRILO içerik eksikleri önceki notta açık.

30.10.2026: Kullanıcı gelecek sayfalarda ortak bileşen ve kompakt tasarım denetimini istedi. FRILO preview hero dışındaki gereksiz kapsayıcı boşluğu kaldırıldı, metin genişliği sınırlandı, yinelenen FRILO ile çalışın alanı kaldırıldı, beş sürüm duyarlı ızgaraya alındı ve iki gerçek ALLPLAN proje bağlantısı eklendi; kapanış ortak bileşeni tam genişliğe taşındı. Typecheck ve HTTP 200 geçti. Bu bir kısmi iyileştirmedir: paketlerin ayrıntılı kaynak maddeleri, proje görselleri, SSS ortaklaştırması, mobil/tema görsel kontrolü ve içerik/medya hakları doğrulaması açık. Yeni sayfada başlamadan tasarım bileşeni, içerik/URL/medya paritesi, mobil ve erişilebilirlik kontrolü yapılmalıdır.

### 30.10.2026 — FRILO kaynak sayfası içerik kontrolü
- Kaynak: https://www.allplan.com/shop/products/frilo ; yerel hedef `/preview/frilo`. Beş sürümün her birindeki beş kapsam maddesi Türkçe olarak eklendi; genel bakış, beş yetenek açıklaması, proje ve 14 günlük deneme koşulları kaynakla karşılaştırılarak genişletildi. Fiyat ve sepet eklenmedi.
- Kaynak sayfadaki bölüm gezinmesi, ürün/kabiliyet ve proje görselleri ile pakete özel detay sayfası bağlantıları henüz uygulanmadı; paket bağlantıları fiyat gösteren mağazaya gider. Kaynakta pazara özgü satış/ödeme ve destek vaatleri Türkiye için doğrulanmadan aktarılmadı. Kaynak metin web aracıyla görüldü; kaynak görsel ve etkileşimlerinin tarayıcı doğrulaması yapılamadı.
- `pnpm typecheck` başarılı; yerel önizleme HTTP 200 ve seçili içerik sunucu çıktısında doğrulandı. Görsel kabul ve teknik terimlerin nihai kontrolü açık.

- FRILO önizlemesine dört sekmeli gezinme eklendi: Genel bakış, Yetenekler, Başarı hikâyeleri ve Sık sorulan sorular. Mevcut klavye sekme yardımcısı kullanıldı; `pnpm typecheck` ve sunucu çıktısında 4 sekme/4 panel kontrolü başarılı. Tarayıcı erişimi olmadığından tıklama, klavye ve görsel davranış henüz tarayıcıda doğrulanmadı.

- FRILO gezinmesi kullanıcı düzeltmesine göre gizleyen sekmelerden dört sayfa içi bağlantıya dönüştürüldü; tüm bölümler görünür. Sürüm kartları yeniden kullanılabilir EditionCards bileşenine taşındı ve FAQ kompakt akordeon stiline uyarlandı. Typecheck ve dört bağlantı hedefinin sunucu çıktısı doğrulandı; tarayıcıda görsel/etkileşim kontrolü henüz yapılmadı.

- FRILO önizlemesinde sürüm kartları, FRILO’ya genel bakış ve sayfa içi gezinme ayrı bölümlere ayrıldı. Mevcut metinler ve bağlantı hedefleri korundu. Typecheck ve yerel HTTP 200 / bölüm sıralaması doğrulandı; tarayıcıda görsel kontrol yapılmadı.

- FRILO preview 30.10.2026: yetenekler kompakt numaralı satırlara, başlıklar token tabanlı dile güncellendi; kullanıcının kaynak ekranında görülen FRILO Connections, CLT+ ve AI Coach 2027 özetleri eklendi; mevcut 2027 önizleme envanterindeki üç ilgili görsel yeniden kullanıldı. Kaynak web aracı önbelleği eski metin döndürüyor; doğrudan ALLPLAN kaynak ve görsel isteği HTTP 403. Bu yüzden istenen özgün FRILO overview/yetenek/proje görselleri indirilemedi; tüm güncel içeriğin eksiksizliği ve medya hakları doğrulanmadı. Fiyat eklenmedi. `pnpm typecheck` ve HTTP 200 başarılı; görsel/etkileşim tarayıcı kabulü açık.


### 30.10.2026 — FRILO kaynak envanteri (Ego Lite)
- Kullanıcı isteğiyle ALLPLAN FRILO mağaza sayfası Ego Lite üzerinden incelendi. Ana içerik metni, DOM metni, 22 başlık, 18 bağlantı ve 10 görsel kaynağı `docs/content-2027/allplan-canlı/frilo-shop-source-2026-10-30.json` dosyasına kaydedildi. Kaynak uluslararası/ABD mağaza görünümüdür; fiyatlar yalnız kaynak kaydındadır ve Türkiye fiyatı değildir.
- Sayfadaki 10 görsel `docs/content-2027/allplan-canlı/media/frilo-shop/images/` içine indirildi; kaynak adresleri ve SHA-256 değerleri aynı dizindeki `manifest.json` dosyasında. Yayın/kullanım izinleri doğrulanmadı.
- Bu bir kaynak envanteridir; FRILO önizlemesine içerik veya görsel aktarımı yapılmadı. Dinamik varyantlar ve bağlantılı ürün detay sayfaları bu tek sayfa kaydının kapsamı dışındadır.

- FRILO kaynak kontrolü genişletildi: `docs/content-2027/allplan-canlı/frilo-shop-structured-2026-10-30.json` sayfa sıralı 150 öğe ve tüm 5 yetenek + 5 SSS akordeonunun tam metnini içerir; 10 yanıtın boş olmadığı kontrol edildi. Tam sayfa ekran görüntüsü `docs/content-2027/allplan-canlı/media/frilo-shop/frilo-source-full-page.png`. Bu kayıt ABD/uluslararası görünümün o andaki durumudur; diğer ülke/süre varyantları ve bağlantılı sayfalar incelenmedi. Görsel hakları ve Türkiye ticari şartları açık; önizleme güncellenmedi.


### 30.10.2026 — FRILO önizleme içerik ve tasarım güncellemesi
- Kaynak genel bakış, dört hero faydası, beş yetenek ve beş SSS açıklaması genişletildi; genel bakış, beş yetenek ve iki proje için kaynak görselleri eklendi. Proje anlatımları genişletildi, Connections raporlama bilgisi eklendi. Çeviri ve ticari kapsam doğrulaması açık.
- Ortak `EditionCards` ve `PreviewClosingSection` korundu. Görsel/metin düzeni, sade proje kartları ve azaltılmış hareket tercihine saygılı hover geçişleri uygulandı. Fiyat ve sepet yok; fiyat gösteren kaynak sürüm detay bağlantıları eklenmedi.
- `python3 -m unittest tests/test_frilo_preview.py`, `pnpm typecheck` geçti. Ego Lite ile masaüstü ve 390px yatay taşma kontrolü, dört bölüm hedefi, iki proje görselinin yüklenmesi ve SSS klavye açılması doğrulandı. Kullanıcı görsel kabulü, diğer tema ve kapsamlı erişilebilirlik kontrolleri açık. Medya izni doğrulanmadı; yalnız dev önizleme.

- Kullanıcı geri bildirimiyle FRILO sayfa içi gezinmesi genel bakış bölümünün önüne taşındı. İçerik ve bağlantı hedefleri korundu; typecheck ve tarayıcıda bölüm sırası kontrolü geçti.


### 30.10.2026 — Yerel 2027 site gezintisi
- Kullanıcının isteğiyle geliştirme ortamında `/` 2027 ana sayfasını gösterir; üretimde önceki ana sayfa ve metadata/schema korunur. Eski ana sayfa geliştirme ortamında `/archive/home` rotasında, noindex olarak erişilebilir.
- Ana ürün bandına FRILO eklendi; Max, Civil, FRILO ve 2027 yenilikleri sırasıyla `/2027/max`, `/2027/civil`, `/2027/frilo`, `/2027/features` üzerinden bağlandı. Eski preview rotaları uyumluluk için duruyor. Bu yeni rotalar üretimde 404 ve noindex; canlı dağıtım yapılmadı. Mevcut `/products/civil` değiştirilmedi.
- Typecheck ve 7 ilgili birim kontrolü geçti. Ego Lite ile ana sayfadan üç ürün sekmesi, 2027 yenilikleri ve arşiv kontrol edildi. Teknik matris ve Partner erişimi yeni ana sayfa varyantında gizli; içerik, URL, lisans ve Türkiye koşullarının yayın onayı açık. Production build ve HTTP kabulü bu adımda çalıştırılmadı.

- Kullanıcı isteğiyle 2027 ana sayfasındaki altı ürün sekmesi üç sütun ve iki satır olarak düzenlendi; diğer hızlı bağlantı alanları etkilenmedi. Stil kaynakları yeniden üretildi; `pnpm styles:check` ve Ego Lite üzerinden masaüstü/390 px üç sütun, iki satır ve yatay taşma kontrolü geçti.
- Mobil okunabilirlik için 480 px ve altında ürün bandı iki sütuna geçer; masaüstünde üçe üç düzen korunur. 320 px kontrolde ürün bandı taşmaz; sayfanın mevcut yenilik kartlarında bağımsız 16 px yatay taşma gözlendi.

- ALLPLAN Max giriş bölümü yeniden kullanılabilir `src/components/sections/IntroSplitSection.tsx` bileşenine taşındı; içerik ve stil korunarak başlık, açıklama, bilgi satırları ve isteğe bağlı bağlantı parametreleştirildi. Typecheck ve Ego Lite masaüstü/390 px bölüm yerleşimi doğrulandı.

- ALLPLAN Max müşteri yorumları `CustomerTestimonials`, hero bölümü `ProductHero` ortak bileşenlerine taşındı. İçerik ve bağlantılar korundu; typecheck ve tarayıcıda başlık, üç yorum ve iki hero bağlantısı doğrulandı. Civil mevcut yorum stillerini kullanmaya devam ediyor.

- Ana sayfa ürün sekmeleri veriyle beslenen `ProductTabs` ortak bileşenine ayrıldı; ana sayfa adaptörü mevcut içeriği sağlar. Varsayılan Max seçimi, FRILO bağlantısı ve sekme-panel ilişkisi tarayıcıda; tip kontrolü pnpm ile doğrulandı.

- FRILO sayfa içi bağlantılarına yumuşak kaydırma eklendi; azaltılmış hareket tercihinde normal kaydırma korunur. Tarayıcıda smooth/auto ve bağlantı hedefi, typecheck doğrulandı.

- SCIA için `/2027/scia` dev-only noindex ilk taslak oluşturuldu; ana sayfa SCIA sekmesi yerel sayfaya bağlandı. Üç sürüm, dört yetenek, altı proje bağlantısı ve dört SSS eklendi. Kaynak envanteri `docs/content-2027/allplan-canlı/scia-shop-source.json`. Kaynak görselleri, hero fayda maddeleri, bölüm navigasyonu ve tam çeviri/kaynak paritesi açık; hero geçici FRILO görseli kullanır. Türkiye deneme koşulları ve medya hakları doğrulanmadı. Typecheck, tarayıcıda ana sayfa bağlantısı ve 390 px taşma kontrolü geçti.

- SCIA sayfasına FRILO ile aynı sayfa içi gezinme düzeni eklendi: Yetenekler, Başarı hikâyeleri, SSS. Bağlantılar yumuşak kaydırır ve azaltılmış hareket tercihine uyar; üç hedef ve 390 px genişlik tarayıcıda, typecheck doğrulandı. Kaynak görselleri ve tam içerik paritesi hâlâ açık.

- SCIA sayfa içi gezinmenin başına kullanıcı düzeltmesiyle SCIA bağlantısı eklendi; sayfa girişine kaydırır. Typecheck ve tarayıcıda hedef doğrulandı.

- SCIA yetenekleri kullanıcı düzeltmesiyle ortak `CapabilityAccordion` bileşenine taşındı: solda tek açık açıklama, sağda seçime bağlı dört kaynak görseli. Kaynak adresleri `docs/content-2027/allplan-canlı/scia-capability-media.json`; yayın izinleri doğrulanmadı. Typecheck, seçim/görsel değişimi ve 390 px taşma kontrolü geçti.

- SCIA proje alanı tam genişlikte, altı görselli ve manuel kontrollü ortak `ProjectCarousel` bileşenine taşındı. Altı görsel kaynak ve SHA-256 kaydı `docs/content-2027/allplan-canlı/scia-story-media.json` içinde; yayın izni doğrulanmadı. Typecheck, önceki/sonraki ve gösterge seçimi, görsel yükleme ve 390 px taşma kontrolü yapıldı.

- ProjectCarousel yüksekliği azaltıldı; görseller oranlarını koruyan contain ile gösterilir. Proje değişiminde fade uygulanır, azaltılmış hareket tercihinde animasyon kapalıdır. Typecheck ve tarayıcıda seçim/animasyon kontrolleri geçti.

- ProjectCarousel daha kompakt yapıldı; görseller üst üste kalıcı katmanlarla 600 ms opacity geçişi yapar, reduced-motion kapatır. Önceki hydration uyarısı eski istemci ve yeni sunucu rol metinlerinin uyuşmazlığına işaret ediyor; yeni oturumda davranış kontrol edildi, mevcut metinler sabit. Typecheck ve geçiş/reduced-motion tarayıcı kontrolü geçti.

- ProjectCarousel görselleri oranları korunarak sağa hizalandı; tarayıcıda object-position doğrulandı.

- ProjectCarousel görsel alanı bölümün içerik genişliği içine alındı; masaüstünde sağa hizalı %65 genişlikte, mobilde tam genişlikte. Tarayıcı ve typecheck kontrolü geçti.

- ProjectCarousel bilgi kartı kullanıcı isteğiyle sağa genişletildi; masaüstünde görselin üzerine taşar, metin genişliği sınırlandı. 390 px yatay taşma kontrolü ve typecheck geçti.

- Kullanıcının verdiği 2027 SDS2 metni Türkçeye çevrilerek giriş paragrafı ve üç madde olarak veri üretim kaynağına işlendi; hero etiketi SDS2 by ALLPLAN ve başlığı çelik detaylandırma/imalat BIM çözümü olarak güncellendi. Eski içerik envanteri korunur. Üretici kaynaklı “piyasadaki tek” iddiası yayın öncesi doğrulanmalı. Typecheck, structured source contract ve tarayıcı metin kontrolü yapıldı.

- SDS2 hero açıklamasındaki İngilizce kaynak meta metni, kullanıcı geri bildirimiyle “Otomatik çelik detaylandırma yazılımı” olarak çevrildi; veri üretimi, typecheck ve tarayıcı kontrolü geçti.

- SDS2 girişinden sonra üretici 2027 kaynağındaki üç zorluk Türkçe taslakla eklendi; mimari sayfasındaki zorluk kartları `ChallengesBand` ortak bileşenine taşındı. Tarayıcıda SDS2 bölüm sırası ve mimari sayfasında üç kart, typecheck doğrulandı.

- SDS2 zorlukların ardından 2021 SDS2 ROI anketindeki %93/%86/%71 bulguları, tam kaynak notuyla eklendi. Mimari istatistik kartı `MetricCards` ortak bileşenine ayrıldı; bölüm sırası, 390 px ve typecheck kontrol edildi. Üretici anket iddiaları bağımsız doğrulanmadı.

- SDS2 istatistik başlığı etiket, h2 ölçeği ve kartlardan ayrılan boşlukla güçlendirildi; masaüstü ve 390 px kontrolü ile typecheck geçti.

- SDS2 istatistik bandının altına üretici 2027 envanterindeki altı fayda, `BenefitsSection` ve eşleşen kaynak ikonlarla eklendi. Kaynak ikonların yayın izni doğrulanmadı; çeviriler taslaktır. Typecheck, sıralama, altı ikon ve 390 px taşma kontrolü geçti.

- SDS2 fayda kartları incelemesi tamamlandı; “tam doğrulanmış” ifadesi düzeltildi, altı ikon için kaynak/SHA-256 ve izin durumu kaydedildi. Typecheck geçti. Bu bölüm mevcut SDS2 rotasında üretim derlemesine dahil olur; yayın izni doğrulanmadan dağıtılmadı.

- Kullanıcı 30.10.2026 tarihinde altı SDS2 fayda ikonunun kullanım iznini teyit etti. Dosyalar `public/assets/previews/sds2/icons/` altında projede bulunuyor; kaynak ve SHA-256 envanteri güncellendi.

- SDS2 fayda ikonlarında koyu tema kontrastı ve opak beyaz zeminli `icon-02.png` için tema uyumlu gösterim düzeltildi; kaynak dosyaları korunur. Açık/koyu CSS davranışı, styles:check ve typecheck doğrulandı.

- SDS2 Fonksiyonellik Hızlı Bakış kartlarında ikonlar ve yinelenen beyaz başlıklar kaldırıldı; turkuaz kategori başlıkları korundu, içerikler semantik liste olarak gösterildi. Ortak BenefitsSection için SDS2’ye özel varyant kullanıldı; typecheck ve beş kart/listenin tarayıcı kontrolü geçti.

- SDS2 hero hemen altına 2027 kaynağındaki üç yenilik, ortak MediaGridSection ile eklendi; envanterdeki metin ve daha önce yerel olan görseller kullanıldı. Typecheck, bölüm sırası ve 390px taşma kontrolü geçti. 5 kat ve %20–50 iddiaları üretici kaynaklı, bağımsız doğrulanmadı; medya izinleri yayın öncesi kontrol edilmeli.

- Kullanıcı isteğiyle SDS2 2027 yenilikleri hero altından SDS2 tanıtımının hemen sonrasına taşındı; tarayıcıda bölüm sırası ve typecheck doğrulandı.


### 31.10.2026 — ALLPLAN 2027 sürüm karşılaştırma taslağı
- Kullanıcı isteğiyle `/2027/compare` dev-only noindex sayfası hazırlandı; Basic, Concept, Professional, Ultimate için üreticinin uluslararası sayfasındaki 48 özellik/seçenek satırı ve durumları Türkçeye çevrildi. Kaynak: https://www.allplan.com/package-overview/compare-allplan-features-2027/ (31.10.2026 tarayıcı karşılaştırması). Türkiye ticari kapsamı doğrulanmadı.
- Üretici özellik bilgi balonlarının açıklamaları henüz aktarılmadı; mevcut yerel ürün sayfaları 2027 kapsamını doğrulamaz. Sayfa paritesi tamamlanmış sayılmaz, yayın yapılmadı. Typecheck ve kullanıcı arayüzü tarayıcıda kontrol edildi; mobil yatay kaydırma alanı doğrulandı.

- ALLPLAN 2027 karşılaştırmasında 48 özellik için üretici data-hover açıklamaları Türkçeye çevrilerek klavye/tıklama ile açılan bilgi alanlarına eklendi; 48 alan ve boş açıklama yokluğu, klavye açma ve 390 px kontrolü doğrulandı. Çeviriler ve Türkiye paket kapsamı yayın öncesi gözden geçirilmeli.

- Karşılaştırma bilgi ikonları 18 px görsel/44 px etkileşim alanına alındı; aynı grupta tek açık açıklama ve azaltılmış hareket tercihini gözeten 220 ms fade eklendi. Tarayıcıda iki ardışık seçim, ikon alanı ve reduced-motion doğrulandı.

- 2027 karşılaştırmada bilgi ikonlarına fareyle gelince açıklama görünür; tıklama/klavye ve dokunmatik kullanım korunur. Başka açık bilgi üzerine hover durumunda yalnız ilgili balon görünür; fade reduced-motion ile uyumludur. Tarayıcıda hover doğrulandı.

- Karşılaştırma bilgi ikonu projenin ortak AluIcon info SVG’siyle değiştirildi; tablo satırları sıklaştırıldı. Masaüstü 49 px satır/16 px ikon, mobil 44 px hedef ve hover tarayıcıda doğrulandı; typecheck geçti.

- Karşılaştırma bilgi alanı React durumu ile gerçek hover, klavye ve dokunmaya uyarlandı; aynı anda tek açıklama, fade ve Escape desteği var. Ego tarayıcısında hover, başka ikona geçiş, açıklamanın üzerine gelme, Escape ve 390 px dokunmatik aç/kapat doğrulandı; typecheck geçti. Çeviri ve paket kapsamı yayın öncesi gözden geçirilmeli.

### Yayına hazırlık — rota değerlendirmesi (31.10.2026)
- `/2027/max`, `/2027/civil`, `/2027/frilo`, `/2027/scia`, `/2027/features`, `/2027/compare` üretimde kapalı ve noindex. Ana sayfa geliştirmede yeni, üretimde mevcut eski görünümü kullanıyor.
- `/products/civil`, `/products/sds2-home` ve `/paket-karsilastirma` mevcut URL'lerdir; eski adresleri koruma ve yeni slug/olası 301 eşlemeleri kullanıcı onayı gerektirir. SDS2 değişiklikleri mevcut üretim rotasındadır.
- Yayına geçişte rota kararlarının yanında üretim korumaları, dahili bağlantılar, canonical metadata, sitemap ve mevcut URL paritesi birlikte ele alınmalı; içerik/çeviri, medya ve Türkiye paket kapsamı doğrulanmalı. Kirli çalışma ağacının yayın kapsamı belirlenmeli; derleme ve üretim modunda kontrol ile tarayıcı kabulü tamamlanmadan yayın hazır sayılmaz. Canlıya dağıtım yapılmadı.

### 31.10.2026 — Ürün yaşam döngüsü önizlemesi
- Kullanıcı isteğiyle ALLPLAN ürün yaşam döngüsü politikası `/preview/product-lifecycle` altında Türkçe yerel önizleme olarak hazırlandı. Kaynak: https://www.allplan.com/product-lifecycle/ (31.10.2026). Politika kapsamı, bakım/sürüm aşamaları, Kasım 2024 örneği, tarih tablosu ve sekiz SSS ile hizmet tabloları içerilir. Kaynağın tarihli örneği güncel sürüm tablosu olarak sunulmaz.
- Rota production'da kapalı ve noindex; kaynak hero ve grafik görselleri izin teyidi olmadığından alınmadı. Yerel tarayıcıda SSS ve 390 px taşma kontrolü, typecheck ve içerik incelemesi yapıldı. Türkçe metinler ve güncel üretici politikası yayımlamadan önce doğrulanmalı; kalıcı URL ve navigasyon onayı bekler.

- Kullanıcı isteğiyle ana sayfadaki OpenBIM ve teknoloji iş ortakları şeridi kaldırıldı; 2027 ana sayfa önizlemesinin footer öncesine ürün yaşam döngüsü önizleme bağlantısı eklendi. Typecheck, bağlantı hedefi ve 390 px taşma tarayıcıda doğrulandı. Bağlantı üretimde kapalı önizlemeye gittiğinden yalnız geliştirme görünümünde yer alır.

- Kullanıcı açıklamasıyla, 2027 ana sayfa önizlemesinde footer öncesine mevcut `/products/allplan-2026-yenilikler` sayfasına ayrı bir butonlu bölüm eklendi; `/products/allplan-2026` farklı sayfa olarak korundu. Yerel tarayıcıda hedef ve 390 px taşma kontrolü ile typecheck geçti.

- Ana sayfa önizlemesindeki 2026 yenilikler bölümüne kullanıcı isteğiyle `/products/allplan-2026` için ayrı buton eklendi; mevcut yenilikler bağlantısı korundu. Tarayıcıda hedef ve mobil taşma, typecheck ile kontrol edildi.

- Ana sayfadaki eski `#innovations` kart bölümü kullanıcı isteğiyle gösterimden kaldırıldı; tasarımı ve kart yapısı yeniden kullanılabilir `InnovationsSection` bileşenine aktarıldı. İçerik verisi ve stiller korundu; 2026 sayfalarına footer öncesindeki ayrı bağlantılar yerinde. Typecheck ve ana sayfa kontrolü yapıldı.

### Devam durumu
- 2026 bağlantı bandı ürün sekmeleri sonrasına taşındı, yüzeyi hafifçe ayrıldı; BIMFlex medya boyutları küçültülüp dış kartın arka planı ve çerçevesi kaldırıldı. Typecheck ve styles:check geçti.
- Açık işler: disiplin iş akışı bölümünü ortak ve kompakt bileşene dönüştürme isteği önceki oturumda kesildi; tamamlanmadı. `/products` sayfasını canlı kaynakla karşılaştırıp eksikleri giderme isteği de bekliyor. Önceki incelemedeki bağlantı kayıpları ile test başarısızlıkları çözülmedi.

- Disipline özel BIM iş akışı `DisciplineWorkflowSection` ortak bileşenine taşındı; rol sekmeleri ve ürün bağlantıları korunarak kompakt sekme, şeffaf kart ve yüzey düzeni uygulandı. Typecheck, rol geçişi, klavye ve 390 px taşma yerel tarayıcıda kontrol edildi.

- Disiplin iş akışı özellikleri kullanıcı isteğiyle kartlardan kompakt semantik listeye dönüştürüldü; rol değişimi ve mobil taşma tarayıcıda, typecheck doğrulandı.

- Disiplin iş akışı bölümünün başlığı ve açıklaması diğer sayfa başlıklarıyla uyumlu biçimde sola hizalandı; tarayıcı hizası ve typecheck doğrulandı.

- Disiplin seçimi butonları başlığın sağına dikey üç satır olarak taşındı; mobilde başlığın altında sıralanır. Dikey klavye gezinmesi, masaüstü konumu, mobil taşma ve typecheck doğrulandı.

- Disiplin iş akışı başlık ve rol seçimi satırına üst boşluk eklendi.

- Disiplin iş akışı ürün kartlarının görselleri kaldırıldı; rol seçimine göre vurgu ve önerilen etiketi korundu. Tarayıcıda farklı rol seçimi ve typecheck kontrol edildi.

- Disiplin seçimi ürün kartları yalnız seçili role ait ürünleri gösterir; masaüstünde aynı satırda, dar ekranda uyarlanır. Üç rol ve 390px tarayıcıda, typecheck kontrol edildi.

- Mimar, mühendis ve prekast iş akışları için AI ile üç yeni illüstratif görsel üretildi; orijinal PNG dosyaları `public/assets/previews/workflow/` altında saklandı ve yalnız 2027 ana sayfa önizlemesine bağlandı. Üç rol için görsel yüklenmesi ve typecheck doğrulandı.

- Kullanıcı isteğiyle “Sürümleri Görüntüle” bağlantıları ALLPLAN sürüm notlarına (`https://www.allplan.com/system/releasenotes/`) yönlendirildi; veri üretim kuralı da güncellendi. İlgili altı ürün sayfası ve typecheck kontrol edildi.

- Çözüm ekosisteminin beş kartı için konuya uygun AI görselleri üretildi; orijinal PNG'ler `public/assets/previews/solutions/` altında saklandı ve 2027 ana sayfa önizlemesine bağlandı. 110 sayfalık veri envanterinde “Sürümleri Görüntüle” bağlantıları tarandı; eşleşmeler altı ürün sayfasında sürüm notlarını gösteriyor. Typecheck, görsel yükleme ve mobil taşma kontrol edildi.

- Ürün hero alanındaki “Paket Karşılaştırma PDF” bağlantısı geliştirme görünümünde “Paketleri karşılaştırın” etiketiyle `/2027/compare` sayfasına bağlandı. Karşılaştırma rotası production'da kapalı olduğundan üretim görünümünde mevcut PDF bağlantısı korunur; rota yayınlandığında geçiş tamamlanmalı. PDF ve diğer doğrudan indirme bağlantıları saklandı. Typecheck ve üç ürün hero kontrol edildi.

- Ortak `PageEndConversion` bölümü tüm kullanım yerleri için kompakt, çerçevesiz yerleşime dönüştürüldü; ticari, eğitim, destek ve kurumsal içerik/eylem politikası korundu. Typecheck ve 7 dönüşüm testi geçti; ticari, destek ve eğitim sayfaları ve mobil taşma tarayıcıda kontrol edildi.

- İletişim sayfasındaki Google Maps gömüsü video alanından ayrılarak `ContactMap` ile tam konteyner genişliğinde ve kompakt yükseklikte sunuldu; mevcut Google Maps adresi korundu. Typecheck, boyut ve 390 px taşma kontrol edildi.

- Scalypso ana sayfası canlı kaynaktaki başlık sırası, beş modül bağlantısı, beş uygulama alanı ve 11 görselle yeniden düzenlendi. Önceden onaylanmış form yönlendirme politikası gereği yerel başvuru bağlantısı ana talep formunu kullanır; canlı kaynak eski formu kullanmaktadır. Typecheck, başlık/bağlantı/görsel sayısı ve 390px taşma kontrol edildi.

- Scalypso Modeler/Mobile/Viewer alt sayfaları kaynak sıralamasına yaklaştırıldı; Scalypso ana sayfa ve Microsoft Forms başvuru bağlantıları, Modeler'ın dört modül bağlantısı gösterildi. Converter ve videolar sayfalarına da aynı gezinme/form bağlantıları eklendi. Beş rota ve 390px taşma, typecheck kontrol edildi; önceden onaylı ana talep formu kullanılır.

- Scalypso Modeler sayfası kompakt hero, iki sütunlu giriş, CAD listesi ve dört modül kartıyla yeniden düzenlendi. Kaynak metinler, modül bağlantıları ve onaylı Microsoft Forms hedefi korundu. Tarayıcı ve 390px taşma, typecheck kontrol edildi.

- Referanslar sayfasında tekrarlanan ve kesilmiş genel hero kaldırıldı; tam başlık ve açıklama referans dizininde tek H1 olarak korundu. 228 referans listesi ve filtreler korunur; typecheck ve tarayıcı kontrolü yapıldı.

### Ara verme durumu — 31.10.2026
- Dal `codex/page-end-conversion-design`; 494f6dc sonrasındaki işler konu bazlı ayrı yerel commitlere ayrıldı: 4f89ade yaşam döngüsü, 1a0fe62 ana sayfa bağlantıları, a4cee39 BIMFlex, f43f21c kapanış, 567843c sürüm notları, d93e2a4 karşılaştırma linki, 81a6c9e ana sayfa iş akışı/görseller, 77bebc5 harita, 9eefe41 Scalypso, 7cf65e8 referanslar. Bu commitler henüz push edilmedi.
- Doğrulama: `pnpm typecheck`, `pnpm styles:check` ve `python3 -m unittest tests/test_page_end_conversion.py` geçti. `pnpm test` 189 testte 11 başarısızlıkla duruyor: token ölçümleri, kaynak link/içerik paritesi, sayfa sonu render sınırı, benefits sınırı, taşınan rol sekmesi sözleşmesi ve tema kontratı. Tam test yeşil değil; failures test beklentisi veya gerçek regresyon açısından ayrı ayrı incelenmeli.
- Açık işler: `/products` sayfası canlı kaynakla eksik içerik karşılaştırması; Scalypso video oynatımının doğrulanması; önceden raporlanan connect-login ve SketchUp Converter bağlantı kayıpları; 2027 sayfalarının üretim rotaları/noindex/sitemap kararı. Karşılaştırma bağlantısı yalnız geliştirmede 2027 tablosuna gider; üretimde PDF korunur. Yayın yapılmadı.
- `.claude/launch.json` yerel, izlenmeyen geliştirme ayarı olarak bırakıldı. Mevcut eski siteden ve geçmişteki onaylı form yönlendirmesinden sapmalar ayrıca incelenmeli.

### 02.11.2026 — Testler ve GitHub düzeni
- `architectural-sheet-concept/` GitHub main dalından kaldırıldı (d7fa308); yerel dosyalar korundu ve .gitignore ile yerel tutuluyor. Çalışma dalında da takipten çıkarıldı (3864aa7).
- 189 Python testi, kaynak sözleşmesi, parite, stil ve token kontrolleri ile `pnpm build` ve typecheck geçti. Yetkilendirilmiş sürüm notu ve SDS2 başlık değişiklikleri parite politikasına yol bazında işlendi; rol sekmesi testleri ortak bileşene uyarlandı.
- `next-env.d.ts` Next build tarafından üretim route tipleri için değiştirildi; kullanıcı dosyası korunarak commit dışı bırakıldı. `.claude/launch.json` da yerel izlenmeyen ayar olarak kalır. Dev server 127.0.0.1:3001 üzerinde çalışıyor.
- Karşılaştırma ve diğer 2027 önizlemeleri production guard altında kalıyor; testlerin geçmesi yayın/kaynak-medya kabulünün tamamlandığı anlamına gelmez. Scalypso video oynatımı ve önceki kayıp bağlantı bulguları ayrıca incelenmeli.

### 02.11.2026 — Vercel inceleme yayını hazırlığı
- `ALUPLAN_2027_PREVIEW=1` yalnız Vercel projesi production ayarında kullanıldığında 2027 ana sayfası ve önizleme rotaları görünür; `X-Robots-Tag: noindex, nofollow` ve robots disallow uygulanır. Bayrak yokken mevcut production davranışı korunur. 189 test ve bayraklı production build, 8 rota ve header yerel doğrulandı.
- Bu bir inceleme yayınıdır; gerçek alan adına geçişten önce bayrak, indexleme, kalıcı adresler, sitemap ve içerik kabulü tekrar değerlendirilmeli.

### 02.11.2026 — Ürün sekmeleri, Max denetimi ve karşılaştırma bağlantısı
- Ana sayfa ürün sekmelerine seçilen ürüne göre sağdan görseller yerel olarak eklendi; altı görsel/sekme ve mobil taşma kontrol edildi. Vercel'e henüz gönderilmedi.
- ALLPLAN Max kaynak sayfa ile Vercel ve yerel karşılaştırıldı: ana bölümler, 3 özellik, 3 yorum ve 6 diğer özellik mevcut; yerel ve Vercel metni eşleşiyor ve 494f6dc commitinde. 4 yerel MP4 HTTP 206; ilk video düğmesi YouTube iframe açtı, gerçek oynatma ve diğer videolar henüz doğrulanmadı. Kaynaktaki video indirme bağlantısı eksik; anket başlığı yerelde h2 yerine etiket. İçerik tercümesi ve üretici medya hakları yayın öncesi kontrol edilmeli.
- Vercel'de PDF bağlantısının kalmasının nedeni preview environment değişkeninin client bundle'da bulunmamasıydı; next.config içinde yalnız gizli olmayan ALUPLAN_2027_PREVIEW değeri build'e aktarıldı. Bayraklı production build ve tarayıcıda `/products/allplan-basic` hedefi `/2027/compare` doğrulandı; değişiklik henüz deploy edilmedi. 189 test geçti.
- `/products/allplan` mevcut ürün sayfasıdır; üreticinin 2027 yenilikler sayfası için yerel `/2027/features` hazırlanmıştır. Ürün sekmesi mevcutta `/products/allplan` adresine, hero butonu `/2027/features` adresine gider; rota kararı kullanıcıyla netleştirilmeli.
- Max denetimindeki video indirme yedeği ve anket başlığının h2 semantiği yerelde eklendi; güncel 189 test ve typecheck geçti. Bu düzeltmeler henüz Vercel'de değil.

- 02.11.2026 hizalama: kullanıcı isteğiyle Connect parola sıfırlama ve SketchUp Converter kurulum kılavuzu bağlantıları geri getirildi; Setup bağlantısı zaten mevcuttu. Altı ürün sekmesi görseli yerel tarayıcıda; Max ilk video modalı ve 4 MP4 erişimi kontrol edildi. Tüm videoların tam oynatılması, 2027 içerik/doğruluk ve kaynak medya izinleri hâlâ yayın öncesi inceleme gerektirir. Önizleme bayrağı client bundle'a iletilerek PDF sorunu düzeltildi; typecheck, 189 test ve bayraklı build geçti.

- Ana sayfadaki ALLPLAN ürün sekmesinin bağlantısı kullanıcı düzeltmesiyle `/2027/features` olarak değiştirildi; hero ile aynı 2027 yenilik sayfasına gider. Önceki `/products/allplan` mevcut URL korunur. Navigasyon testi ve tarayıcıda sekme/hedef kontrol edildi.
