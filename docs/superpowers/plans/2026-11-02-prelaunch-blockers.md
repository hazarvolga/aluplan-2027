# Yayın Öncesi Engeller (E1–E5) Uygulama Planı

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 2027 içeriğini gerçek alan adında indekslenebilir biçimde yayınlanabilir hale getirmek ve içerik paritesindeki kayıp bağlantı, indirme ve formları geri getirmek.

**Architecture:** Tek önizleme bayrağı iki bağımsız karara ayrılır: içerik görünürlüğü ve indeks engeli. Bu kararlar tek bir modülden okunur. 2027 rotaları kendi metadata ve JSON-LD kaydına bağlanır. Kayıp kart, indirme ve lisans bağlantıları, metin benzerliğiyle değil, salt-okunur 2026 kaynağındaki tipli dizilerden üretim hattında çıkarılır ve tipli alanlarla render edilir. Bu, 28.10.2026'da çözüm hub'larında uygulanan modelin devamıdır.

**Tech Stack:** Next.js 16.4.2, React 19.3.1, TypeScript, Python 3 (stdlib) veri hattı, `unittest`, Node runtime testleri.

**Spec:** Bağımsız inceleme raporu, bulgular E1–E5 (https://claude.ai/artifact/LaTTqWNx5BR7Ws1wRhES96) ve `docs/verification/prelaunch-independent-review-prompt.md`.

## Global Constraints

- `../aluplan-2026` salt-okunurdur. Yalnız okunur; build, dev veya kurulum komutu çalıştırılmaz.
- İçerik, URL, buton hedefi ve dosyalar korunur. Metin uydurulmaz, özetlenmez, kısaltılmaz. Yeni metin yalnız kullanıcı onaylı karar K3'ten gelir.
- Yeni npm bağımlılığı eklenmez. Python betikleri yalnız stdlib kullanır.
- CSS'te ham renk, ölçü veya süre yazılmaz; yalnız design-system token'ları kullanılır.
- Kod, dosya ve değişken adları İngilizce; arayüz metni Türkçe.
- `pnpm data:generate` deterministik kalır. İki kez çalıştırıldığında `git diff --exit-code src/data` temiz olmalıdır.
- Her `pnpm build` sonrasında `next-env.d.ts` build öncesi haline geri alınır. Bu dosyadaki mevcut yerel değişiklik ve takip edilmeyen `.claude/` korunur.
- Commit biçimi `<type>: <description>`. Push, merge, deploy ve Vercel ortam değişkeni değişikliği kullanıcı onayı olmadan yapılmaz.
- Her task sonunda `pnpm test` ve `pnpm typecheck` geçmelidir.

## Kararlar: uygulamadan önce kullanıcı onayı gerekir

| No | Karar | Öneri |
|---|---|---|
| K1 | `/2027/{features,max,civil,frilo,scia,compare}` kalıcı ve indekslenecek URL'ler mi? Canonical bu URL'lere sabitlenecek. (`open-decisions.md` 1–3 ile ilişkili) | Evet; inceleme ortamında kullanılan yapı korunur, `/products/allplan` mevcut rota olarak kalır |
| K2 | Ortam değişkenleri: `ALUPLAN_2027_PREVIEW` kaldırılıp yerine `ALUPLAN_SHOW_2027` ve `ALUPLAN_BLOCK_INDEXING` gelir. Vercel'de Preview: `1/1`, Production (inceleme dönemi): `1/1`. | Evet; Vercel değişikliğini kullanıcı yapar veya ayrıca onaylar |
| K3 | Altı 2027 rotasının `title` ve `description` metinleri, ayrıca `/2027/features` için ana sayfadan farklı bir H1. Metinler `docs/content-2027/allplan-canlı/*.md` TR taslaklarından önerilir. | Task 2 başında tablo olarak onaya sunulur |
| K4 | `/preview/*` rotaları production'da 404 olsun; silinmesin, yalnız yerel geliştirmede açık kalsın. | Evet |
| K5 | `ALUPLAN_SHOW_2027=0` durumunda eski `HomepageView` geri dönüş yolu olarak korunsun. | Evet |

## Review Focus

1. **Gerçek alan adı ayarı (`SHOW=1`, `BLOCK=0`):** Header, `robots.txt` ve altı 2027 rotasının meta etiketlerinin hiçbirinde `noindex` kalmamalı; canonical `https://aluplan.com.tr/2027/...` olmalı. Test Task 1 ve Task 2'de.
2. **Geri dönüş ayarı (`SHOW=0`):** `/2027/*` 404 vermeli ve sitemap'te olmamalı; ana sayfa eski görünümde 200 dönmeli. Test Task 1'de.
3. **Kart metninin iki kez görünmesi:** Yeni kart ızgarası eklendiğinde eski bağlantısız metin bölümü de render edilirse başlıklar iki kez çıkar. Her kart başlığı `<main>` içinde tam bir kez görünmeli. Test Task 3'te.
4. **Mevcut render sözleşmesinin bağlantıları yakalamaması:** Mevcut sözleşme bu kayıpları yakalamadı. Yeni test, kaynaktaki her `href` değerinin render edilmiş `<main>` içinde bulunduğunu doğrulamalı. Test Task 3, 4 ve 5'te.
5. **Kaynak sözleşmesi:** `verify_structured_source_contract.py` hash'leri yalnız bilinçli olarak güncellenmeli; başka rotalarda veri farkı olmamalı. Kontrol Task 3'ün doğrulama adımında.

---

### Task 1: Yayın bayraklarını ayır

**Files:**
- Create: `src/lib/release-flags.ts`
- Modify: `next.config.mjs:47-56`, `src/app/robots.ts:7`, `src/app/page.tsx:10,15`, `src/app/sitemap.ts`, `src/components/sections/SubpageHeroSection.tsx:131`, `src/app/2027/{features,compare,scia}/page.tsx`, `src/app/preview/*/page.tsx` (6 dosya)
- Create: `src/app/2027/{max,civil,frilo}/page.tsx` sahiplenme. Re-export yönü tersine döner: `preview/*` → `2027/*`. FRILO'nun `hero.module.css` ve `content.ts` dosyaları `src/app/2027/frilo/` altına taşınır; `2027/scia` buradan import eder.
- Test: `tests/test_release_flags.py`, `tests/release_flags_runtime.mjs`; güncellenecek: `tests/test_home_2027_preview.py`

**Interfaces:**
- Produces:
  - `isReleaseContentEnabled(): boolean`: `NODE_ENV !== 'production' || process.env.ALUPLAN_SHOW_2027 === '1'`
  - `isIndexingBlocked(): boolean`: `process.env.ALUPLAN_BLOCK_INDEXING === '1'`
  - `isLocalPreviewEnabled(): boolean`: `NODE_ENV !== 'production'` (K4)

- [ ] **Step 1: Failing testleri yaz.** `tests/test_release_flags.py`:
  - `test_legacy_flag_removed`: `src/` ve `next.config.mjs` içinde `ALUPLAN_2027_PREVIEW` geçmez.
  - `test_env_reads_centralized`: `process.env.ALUPLAN_` yalnız `src/lib/release-flags.ts` ve `next.config.mjs` içinde geçer.
  - `test_release_routes_own_pages`: `src/app/2027/*/page.tsx` dosyalarının hiçbiri `@/app/preview` import etmez.
  - `test_runtime_matrix`: `node tests/release_flags_runtime.mjs` çıktısını okur. Şu üç ayar için robots kuralı ve ana sayfa varyantı doğrulanır:
    - `{SHOW:1, BLOCK:1}` → `disallow:'/'`, varyant `2027`
    - `{SHOW:1, BLOCK:0}` → `allow:'/'` ve `sitemap` dolu, varyant `2027`
    - `{SHOW:0, BLOCK:0}` → varyant `legacy`
  - Runtime betiği, `tests/schema_runtime.mjs` kalıbıyla ortamı ayarlayıp modülleri çağırır.
- [ ] **Step 2: Testi çalıştır ve başarısız olduğunu gör.** `python3 -m unittest tests.test_release_flags -v` → FAIL.
- [ ] **Step 3: Uygula.**
  - `release-flags.ts` dosyasını oluştur.
  - Tüm çağrı yerlerini bu modüle bağla.
  - `next.config.mjs` içindeki `env` iki yeni değişkeni istemciye açar. `X-Robots-Tag` header'ı yalnız `ALUPLAN_BLOCK_INDEXING === '1'` olduğunda eklenir.
  - `/preview/*` sayfaları `isLocalPreviewEnabled()` ile korunur; `/2027/*` sayfaları `isReleaseContentEnabled()` ile.
  - Ana sayfa `metadata` ve gövdesi için `isReleaseContentEnabled()` kullanılır. Bu task'ta 2027 ana sayfasının başlığı geçici olarak `buildPageMetadata('/')` olur, robots değeri `isIndexingBlocked()` değerine göre belirlenir.
- [ ] **Step 4: Testleri çalıştır ve geçtiğini gör.** `python3 -m unittest tests.test_release_flags tests.test_home_2027_preview -v` → PASS. `test_home_2027_preview.py` içindeki production guard beklentileri yeni modüle göre güncellenir; korunan davranış: production'da `/preview/home-2027` 404 verir.
- [ ] **Step 5: Build matrisiyle doğrula.**
  - `ALUPLAN_SHOW_2027=1 ALUPLAN_BLOCK_INDEXING=0 pnpm build && pnpm start` çalıştır, ardından `curl -sI http://127.0.0.1:3000/` çıktısında `x-robots-tag` olmamalı.
  - `curl -s .../robots.txt` çıktısında `Disallow: /` yalnız `DISALLOW_PATHS` kapsamında olmalı.
  - `curl -o /dev/null -w '%{http_code}' .../preview/home-2027` → `404`.
  - Ardından `next-env.d.ts` dosyasını geri al.
- [ ] **Step 6: Commit.** `refactor: split release visibility and indexing flags`

### Task 2: 2027 rotalarına gerçek metadata, JSON-LD ve sitemap

**Files:**
- Create: `src/lib/release-2027-routes.ts`
- Modify: `src/lib/schema.ts` (`serializeJsonLd` ekle), `src/app/page.tsx`, `src/app/[...slug]/page.tsx:46`, `src/app/sitemap.ts`, `src/app/2027/*/page.tsx` (6 dosya), `src/app/llms.txt` (2027 bölümü)
- Test: `tests/test_release_2027_routes.py`, `tests/schema_runtime.mjs` (2027 rotası desteği)

**Interfaces:**
- Consumes: `isIndexingBlocked()` ve `isReleaseContentEnabled()` (Task 1); `SITE_ORIGIN` (`src/lib/site-data.ts`).
- Produces:
  - `interface Release2027Route { path: string; title: string; description: string; productName: string; ogImage: string }`
  - `RELEASE_2027_ROUTES: readonly Release2027Route[]` (6 kayıt)
  - `buildRelease2027Metadata(path: string): Metadata`
  - `buildRelease2027JsonLd(path: string): object`: `@graph` içinde `WebPage`, `BreadcrumbList` ve `SoftwareApplication` (`name = productName`). `compare` rotası için `SoftwareApplication` yerine yalnız `WebPage`.
  - `serializeJsonLd(data: unknown): string`: `JSON.stringify` sonucunda `<` karakterini `<` ile değiştirir.

- [ ] **Step 1: K3 onayını al.** Altı rotanın önerilen `title`, `description` ve `/2027/features` H1 metinlerini envanter TR taslaklarından kaynak satır ID'leriyle tablo halinde kullanıcıya sun. Onaysız metin yazma.
- [ ] **Step 2: Failing testleri yaz.** `tests/test_release_2027_routes.py`:
  - `test_no_preview_labels`: `src/app/2027` ve `src/lib/release-2027-routes.ts` içinde `Yerel inceleme` ve `Yerel Önizleme` geçmez.
  - `test_metadata_shape`: runtime çıktısında her rota için `alternates.canonical == "https://aluplan.com.tr" + path`, `openGraph.images[0].url` rotaya özgü, `description` sitenin genel açıklamasından farklı.
  - `test_jsonld_product_name`: `/2027/max` için `SoftwareApplication.name == "Allplan Max"`.
  - `test_sitemap_includes_release_routes`: `SHOW=1` iken 6 rota sitemap'te, `SHOW=0` iken hiçbiri yok.
  - `test_jsonld_escaped`: `serializeJsonLd({a:'</script>'})` sonucu `<` içermez.
  - `test_features_h1_unique`: `/2027/features` H1 metni ana sayfa H1'inden farklı.
- [ ] **Step 3: Testi çalıştır ve başarısız olduğunu gör.** `python3 -m unittest tests.test_release_2027_routes -v` → FAIL.
- [ ] **Step 4: Uygula.**
  - Her `/2027/*` sayfası `generateMetadata` içinde `buildRelease2027Metadata(path)` döndürür ve `serializeJsonLd(buildRelease2027JsonLd(path))` çıktısını basar.
  - Robots değeri `isIndexingBlocked()` değerinden gelir.
  - Ana sayfanın 2027 varyantı mevcut `buildPageJsonLd(getPageData('/'))` çıktısını basar.
  - Mevcut iki `JSON.stringify` çağrı yeri `serializeJsonLd` ile değiştirilir.
  - `og:image` olarak her rotanın mevcut hero görseli kullanılır, yeni görsel üretilmez.
  - `llms.txt` dosyasına 6 rota eklenir ve "29+ yıllık" ifadesi düzeltilir.
- [ ] **Step 5: Testleri çalıştır ve geçtiğini gör.** `pnpm test` → PASS.
- [ ] **Step 6: Commit.** `feat: add indexable metadata for 2027 routes`

### Task 3: Kaynak kaynaklı kart dizinleri

**Files:**
- Create: `scripts/source_card_links.py`, `src/components/sections/CardDirectorySection.tsx`
- Modify: `scripts/generate_site_data.py` (kayda `cardDirectory` alanını ekler), `src/lib/site-data.ts:298` (`PageRecord`), `src/components/sections/SubpageView.tsx` (`specSections` render bloğu, yaklaşık 357–380. satırlar), `src/data/pages.json` (üretilmiş)
- Test: `tests/test_card_directory.py`

**Interfaces:**
- Produces (TypeScript, `site-data.ts`):
  - `interface DirectoryCard { title: string; subtitle?: string; description?: string; href: string; image?: string; ctaLabel: string }`
  - `interface CardDirectory { sectionHeading: string; cards: DirectoryCard[] }`
  - `PageRecord.cardDirectory?: CardDirectory | null`
- Produces (Python, `source_card_links.py`):
  - `extract_card_directory(route: str) -> dict | None`. `extract_structured_pages.py` içindeki `find_const_array`, `split_top_level_objects`, `get_prop_str` ve `resolve_asset` yardımcılarını import eder.
  - Kaynak eşlemesi:

| Rota | Kaynak dosya | Dizi | Alanlar |
|---|---|---|---|
| `/products` | `app/products/page.tsx` | `products` | title, description, href, image |
| `/solutions-v2/training` | `app/solutions-v2/training/page.tsx` | `formats` | title, description, href |
| `/solutions/addons` | `app/solutions/addons/ClientPage.tsx` | `items` | title, subtitle, buttonText, href, image |
| `/solutions/cds-addon` | `app/solutions/cds-addon/ClientPage.tsx` | `ResourceCardGrid`'e verilen dizi | aynı alanlar |
| `/solutions/ax3000-mekanik-tesisat` | `app/solutions/ax3000-mekanik-tesisat/ClientPage.tsx` | `modules` | `link` alanı `href` olarak alınır, `ctaLabel` "Devamını Oku" |

  - 6 AX3000 alt sayfası (`/solutions/ax3000/*`, `/solutions/ax3000-yapi-fizigi`): her `ClientPage.tsx` içindeki modül bağlantı dizisi aynı yöntemle alınır. Dizi yoksa rota tabloya eklenmez ve rapora yazılır.
  - `sectionHeading`, kartların ait olduğu mevcut `sections[].heading` değeridir. Bulunamazsa betik hata verir.

- [ ] **Step 1: Failing testleri yaz.** `tests/test_card_directory.py`:
  - `test_products_cards`: `/products` için 7 kart; hedefler kaynak sırasıyla `/products/allplan-aec`, `allplan-ultimate`, `civil`, `allplan-professional`, `allplan-concept`, `precast-detail`, `allplan-basic`.
  - `test_addons_cards`: `/solutions/addons` ve `/solutions/cds-addon` için 9'ar kart; `sketchup-converter` dahil.
  - `test_training_formats`: 6 hedef: `online`, `webinar`, `classroom`, `events`, `individual`, `e-learning`.
  - `test_ax3000_modules`: mekanik tesisat sayfasındaki 6 `/solutions/ax3000/*` hedefi.
  - `test_every_card_href_resolves`: her iç `href` için `pages.json` içinde bir kayıt var.
  - `test_rendered_once`: production build HTML'inde (`.next/server/app/<route>.html`) her kart başlığı `<main>` içinde tam bir kez geçer ve her kart hedefi `<a href>` olarak bulunur. Build gerektiren test `pnpm build` sonrası çalışır; build yoksa `skipTest`.
- [ ] **Step 2: Testi çalıştır ve başarısız olduğunu gör.** `python3 -m unittest tests.test_card_directory -v` → FAIL.
- [ ] **Step 3: Veri hattını uygula.** `generate_site_data.py`, eşlenen rotalar için `cardDirectory` alanını yazar. Diğer rotalarda bu alan `null` olur.
- [ ] **Step 4: Render'ı uygula.**
  - `CardDirectorySection({ directory, headingLevel })`, her kartı tek bağlantı olarak render eder ve `SolutionDirectoryCard` ile aynı sınıfları kullanır. İç hedefler `next/link` ile, dış hedefler `target="_blank" rel="noopener noreferrer"` ile verilir.
  - `SubpageView`, `heading === cardDirectory.sectionHeading` olan `specSection` yerine bu bileşeni render eder.
- [ ] **Step 5: Determinizmi ve sözleşmeleri doğrula.**
  - `pnpm data:generate` iki kez çalıştır, ardından `git diff --stat src/data` yalnız ilk çalıştırmadaki değişiklikleri göstermeli.
  - `pnpm test:source-contract` başarısız olursa yalnız bu rotaların hash'lerini bilinçli güncelle ve diff'te başka rota olmadığını doğrula.
  - `pnpm build`, ardından `python3 -m unittest tests.test_card_directory -v` → PASS. `next-env.d.ts` dosyasını geri al.
- [ ] **Step 6: Kalan farkları raporla.** İnceleme sırasında tespit edilen 132 eksik iç hedeften bu task'ta kapanmayanları `docs/verification/main-link-gap-2026-11-02.md` dosyasına rota, hedef ve kaynak satırıyla yaz. Bunlar onaylı karar mı, eksik mi; sınıflandırma kullanıcıya bırakılır.
- [ ] **Step 7: Commit.** `fix: restore source card links on directory pages`

### Task 4: AX3000 doküman indirmeleri

**Files:**
- Modify: `scripts/source_card_links.py` (`extract_document_groups`), `scripts/generate_site_data.py`, `src/lib/site-data.ts`, `src/components/sections/SubpageView.tsx`
- Create: `src/components/sections/DocumentGroupsSection.tsx`
- Test: `tests/test_card_directory.py` (yeni test sınıfı)

**Interfaces:**
- Consumes: Task 3'teki `source_card_links.py` yardımcıları.
- Produces:
  - `interface DownloadDocument { title: string; language: string; format: string; description: string; meta: string; href: string; filename: string }`
  - `interface DocumentGroup { id: string; title: string; documents: DownloadDocument[] }`
  - `PageRecord.documentGroups?: DocumentGroup[] | null`
  - Kaynak `app/products/ax3000/dokumanlar/documents.ts` içindeki `documentGroups` dizisidir. Import edilen asset adı `/docs/ax3000/<filename>` yoluna eşlenir.

- [ ] **Step 1: Failing test yaz.** `test_ax3000_documents`: 2 grup (`brosurler`, `teknik-dokumanlar`), toplam 6 doküman, `href` değerleri `/docs/ax3000/ax3000-brochure-en.pdf`, `ax3000-brochure-de.pdf`, `ax3000-brochure-en-alternative.pdf`, `ax3000-functions-en.pdf`, `ax3000-functions-en.docx`, `ax3000-functions-hexagon-en.docx`. Build HTML'inde her biri `<a ... download>` olarak bulunur ve `aria-label="{title} ({language}, {format}) indir"` taşır.
- [ ] **Step 2: Testi çalıştır ve başarısız olduğunu gör.**
- [ ] **Step 3: Uygula.** Veri çıkarımı ve `DocumentGroupsSection` eklenir. `SubpageView`, bu doküman kartlarını gösteren mevcut bağlantısız bölümlerin yerine bunu render eder. Eşleşme Task 3'teki `sectionHeading` kuralıyla, grup başlığı üzerinden yapılır.
- [ ] **Step 4: Doğrula.** `pnpm data:generate`, `pnpm build`, ardından test → PASS. Dosyaların gerçekten indiğini kontrol et: `curl -sI .../docs/ax3000/ax3000-functions-en.docx` → `200`. `next-env.d.ts` dosyasını geri al.
- [ ] **Step 5: Commit.** `fix: restore ax3000 document downloads`

### Task 5: Lisans operasyon bağlantıları

**Files:**
- Modify: `scripts/source_card_links.py` (`extract_action_links`), `scripts/generate_site_data.py`, `src/lib/site-data.ts`, `src/components/sections/SubpageView.tsx`
- Create: `src/components/sections/ActionLinksSection.tsx`
- Test: `tests/test_request_links.py` (genişletilir)

**Interfaces:**
- Produces:
  - `interface ActionLink { label: string; href: string; external: boolean }`
  - `PageRecord.actionLinks?: { sectionHeading: string; links: ActionLink[] } | null`
  - Kaynak `app/solutions-v2/connect-license/page.tsx` dosyasının 290–310. satırlarındaki üç bağlantıdır; etiket metinleri kaynaktan aynen alınır.

- [ ] **Step 1: Failing test yaz.** `test_connect_license_operational_links`: `/solutions-v2/connect-license` için `actionLinks.links` hedefleri sırasıyla `https://connect2.allplan.com/`, `/solutions-v2/connect-license/how-to-assign`, `https://forms.office.com/r/HSrhvAkYmb`. Build HTML'inde üçü de `<a href>` olarak bulunur. Dış hedefler `rel="noopener noreferrer"` taşır. Operasyonel lisans formu `MAIN_QUOTE_FORM_URL` ile değiştirilmemiş olmalı.
- [ ] **Step 2: Testi çalıştır ve başarısız olduğunu gör.**
- [ ] **Step 3: Uygula.** Bağlantılar, düz metin olarak duran üç bağlantının yerine tek bir `ActionLinksSection` içinde `alu-button` sınıflarıyla render edilir.
- [ ] **Step 4: Doğrula.** `pnpm test`, `pnpm build`, ardından test → PASS. `next-env.d.ts` dosyasını geri al.
- [ ] **Step 5: Commit.** `fix: restore connect license operational links`

### Task 6: Uçtan uca kabul ve devir kaydı

**Files:**
- Modify: `HANDOFF.md`
- Create: `docs/verification/prelaunch-blockers-2026-11-02.md`

- [ ] **Step 1: Tam kapıları çalıştır.** `pnpm test`, `pnpm typecheck`, `pnpm build`, `pnpm audit --prod` → hepsi geçmeli. `next-env.d.ts` dosyasını geri al.
- [ ] **Step 2: İki ayarla yerel production kabulü yap.**
  - `SHOW=1, BLOCK=1`: E1–E5 kapsamındaki tüm rotalar 200 döner ve `noindex` vardır.
  - `SHOW=1, BLOCK=0`: `noindex` yoktur, canonical doğrudur, sitemap 2027 rotalarını içerir.
  - Gerçek tarayıcıda masaüstü ve 375 px'de `/products`, `/solutions/addons`, `/solutions-v2/training`, `/products/ax3000/dokumanlar` ve `/solutions-v2/connect-license` sayfalarında kart tıklama, klavye Tab ile `:focus-visible` görünürlüğü, yatay taşma yokluğu ve konsol hatası yokluğu kontrol edilir.
- [ ] **Step 3: Kanıtı ve devir kaydını yaz.** Komutları, çıktıları ve kalan açık kararları kanıt dosyasına yaz. `HANDOFF.md` en üstüne tarihli kayıt ekle. Vercel ortam değişkeni geçişi (K2), deploy ve push için kullanıcı onayı beklendiğini açıkça belirt.
- [ ] **Step 4: Commit.** `docs: record prelaunch blocker verification`
