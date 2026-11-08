# Aluplan Akademi Yeniden Tasarım — Uygulama Planı

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Akademi'yi kendi hafif kabuğu (ince header + sol müfredat sidebar + minimal footer), mimari/editoryal tasarım dili ve paylaşılan bileşen kitiyle odaklı bir eğitim portalına dönüştürmek — site hiç bozulmadan.

**Architecture:** App Router route grubu: tüm site sayfaları `(site)/`'a iner ve `SiteShell`'i orada alır; `/akademi` grubun dışında kalıp kendi layout'unu alır. Dark/light ve çerez onayı kök ortak sağlayıcılara çıkarılır. Akademi bileşenleri token-only CSS, semantik HTML, token-motion + yalnız imza an için lazy GSAP.

**Tech Stack:** Next.js 16 (App Router, standalone), React 19, TypeScript, CSS Modules + tasarım token'ları, GSAP (yalnız lazy/signature), Python unittest + `.mjs` runtime + typecheck + styles:check (renk guard).

**Spec:** [docs/superpowers/specs/2026-11-08-akademi-redesign-design.md](../specs/2026-11-08-akademi-redesign-design.md)

## Global Constraints

- Yalnız CSS token'ları; literal renk/ölçü yasak (`scripts/check_component_colors.py` → `pnpm styles:check`).
- Akademi tüm sayfaları `isAkademiEnabled()` arkasında; `robots: { index:false, follow:false }`; sitemap/navigation.json/search-index/llms.txt dışında.
- Seviye rotaları: `generateStaticParams` üretimde `[]`, `export const dynamicParams = false`.
- `ALUPLAN_SHOW_AKADEMI` Dockerfile ve `.github/workflows/ci.yml`'de TANIMLANMAZ.
- Her sayfa tam **bir** `<main>` landmark'ı içerir (`tests/test_review_findings.py`).
- Yeni runtime bağımlılığı yalnız **gsap**; yalnız `dynamic import` ile, reduced-motion'da devre dışı. Lenis/React Bits YOK.
- Türkçe içerik; anti-slop (gradyan/candy renk/pill yığını yok). Mono = IBM Plex Mono kod/metadata.
- Her task sonunda test geçer + commit. Task grupları test sonrası main'e birleştirilir; başlamadan restore tag.

## Review Focus

- **Site regresyonu:** `(site)` taşınması sonrası mevcut URL'ler (`/`, `/products`, `/kaynaklar`, `/2027` vb.) hâlâ 200 ve SiteShell'li, tek `<main>`. → Task 3 testleri.
- **Dark/light iki grupta:** ThemeModeProvider çıkarımı sonrası hem site hem Akademi mod'u okur/değiştirir, localStorage anahtarı (`aluplan-theme-mode`) ve ilk-render dark varsayılanı korunur. → Task 1 testleri.
- **Çerez onayı Akademi'de:** banner SiteShell'den çıkınca Akademi sayfalarında da görünür. → Task 2 testleri.
- **Üretimde Akademi sızıntısı:** redesign sonrası da seviye HTML'i üretim build'inde üretilmez; `/akademi` 404/noindex. → Task 8 + genel build doğrulaması.
- **Mobil sidebar erişilebilirliği:** çekmece route değişince kapanır, Esc kapatır, odak tuzaklanmaz/geri döner. → Task 5 testleri + dev doğrulama.

---

### Task 1: ThemeModeProvider (tema state'ini köke çıkar)

**Files:**
- Create: `src/components/theme/ThemeModeProvider.tsx`
- Modify: `src/components/shell/SiteShell.tsx` (mode state/localStorage/setAttribute/toggleMode'u kaldır, provider'dan tüket)
- Test: `tests/akademi_theme_runtime.mjs`, `tests/test_theme_provider.py`

**Interfaces:**
- Produces: `ThemeModeProvider` (client component, `children`), `useThemeMode(): { mode: 'dark'|'light'; toggleMode: () => void }`. İlk render'da SSR güvenli ('dark' varsayılan); mount'ta `localStorage('aluplan-theme-mode')` okunur ve `document.documentElement.setAttribute('data-mode', mode)` uygulanır.
- Consumes: `localStorage` anahtarı `aluplan-theme-mode` (mevcut, değişmez).

- [ ] **Step 1: Write the failing test** — `tests/test_theme_provider.py`: ThemeModeProvider dosyası `aluplan-theme-mode` ve `setAttribute('data-mode'` içerir; `SiteShell.tsx` artık `useState<'dark' | 'light'>` ile mode TANIMLAMAZ, bunun yerine `useThemeMode(` çağırır.
- [ ] **Step 2: Run test to verify it fails** — `python3 -m unittest tests.test_theme_provider -v` → FAIL (dosya yok).
- [ ] **Step 3: Implement `ThemeModeProvider` + `useThemeMode`** — mode state + `useEffect` ile localStorage/documentElement senkronu (SiteShell satır 81,93-98,122-127'deki mantığın birebir taşınması), context ile sağla.
- [ ] **Step 4: Refactor SiteShell** — kendi mode state'ini kaldır; `const { mode, toggleMode } = useThemeMode()`; `logoSrc` ve `data-mode={mode}` (satır 137,140) ve toggle butonu (246-249) provider'dan gelen değerle çalışsın.
- [ ] **Step 5: Runtime test** — `tests/akademi_theme_runtime.mjs`: provider'ın toggle'ının 'dark'↔'light' döndürdüğünü ve varsayılanın 'dark' olduğunu doğrula. Run: `node tests/akademi_theme_runtime.mjs` → PASS.
- [ ] **Step 6: Verify** — `pnpm typecheck` ve `python3 -m unittest tests.test_theme_provider -v` → PASS.
- [ ] **Step 7: Commit** — `git commit -m "refactor: lift theme mode state into ThemeModeProvider"`

---

### Task 2: Paylaşılan ConsentBanner (SiteShell'den köke)

**Files:**
- Create: `src/components/shell/ConsentBanner.tsx`
- Modify: `src/components/shell/SiteShell.tsx` (banner markup'ını kaldır, satır ~506-531)
- Test: `tests/test_consent_banner.py` (veya mevcut `tests/test_consent*.py` genişlet)

**Interfaces:**
- Produces: `ConsentBanner` (client; kendi içinde `useCookieConsent()`, `useConsentReady()`, `writeConsent()`; onay `null` iken görünür). `@/lib/consent` API'si değişmez.
- Consumes: `@/lib/consent` (`useCookieConsent`, `useConsentReady`, `writeConsent`).

- [ ] **Step 1: Failing test** — `tests/test_consent_banner.py`: `ConsentBanner.tsx` `useConsentReady(` ve `writeConsent(` içerir; `SiteShell.tsx` artık inline banner'ı (`handleConsent`/`cookieConsent === null` bloğu) İÇERMEZ.
- [ ] **Step 2: Fails** — `python3 -m unittest tests.test_consent_banner -v` → FAIL.
- [ ] **Step 3: Extract** — banner JSX'ini `ConsentBanner.tsx`'e taşı (token-only, mevcut sınıflar korunur); SiteShell'den çıkar.
- [ ] **Step 4: Passes** — test + `pnpm typecheck` + `pnpm styles:check` → PASS.
- [ ] **Step 5: Commit** — `git commit -m "refactor: extract ConsentBanner from SiteShell"`

---

### Task 3: `(site)` route grubu + ince kök layout

**Files:**
- Create: `src/app/(site)/layout.tsx`
- Move: `src/app/{2027,[...slug],archive,egitim-merkezlerimiz,health,kaydedilmis-webinarlar,kaynaklar,paket-karsilastirma,preview,product-lifecycle,products,video-kutuphanesi}/` ve `page.tsx`, `not-found.tsx` → `src/app/(site)/` altına
- Keep at root: `api/`, `robots.ts`, `sitemap.ts`, `llms.txt/`, `akademi/`
- Modify: `src/app/layout.tsx` (SiteShell+SearchIndexProvider çıkar; ThemeModeProvider + ConsentBanner + DebugOverlayController kalır; `data-mode` sabitini kaldır)
- Test: `tests/test_route_group_shell.py`

**Interfaces:**
- Consumes: Task 1 `ThemeModeProvider`, Task 2 `ConsentBanner`.
- Produces: `(site)/layout.tsx` → `<SearchIndexProvider showRelease=…><SiteShell>{children}</SiteShell></SearchIndexProvider>`. Route grupları URL'i değiştirmez.

- [ ] **Step 1: Failing test** — `tests/test_route_group_shell.py`: kök `layout.tsx` artık `SiteShell` import ETMEZ; `(site)/layout.tsx` `SiteShell` ve `SearchIndexProvider` İÇERİR; kök `layout.tsx` `ThemeModeProvider` ve `ConsentBanner` İÇERİR. (Kök `<html>` FOUC'u önlemek için SSR varsayılanı `data-mode="dark"`'ı KORUR; provider mount'ta günceller.)
- [ ] **Step 2: Fails** — `python3 -m unittest tests.test_route_group_shell -v` → FAIL.
- [ ] **Step 3: Create `(site)/layout.tsx`** — SiteShell + SearchIndexProvider sarmalını buraya taşı.
- [ ] **Step 4: Move site routes** — yukarıdaki klasörleri `git mv` ile `(site)/` altına taşı (api/robots/sitemap/llms/akademi hariç). `not-found.tsx` ve kök `page.tsx` da `(site)/`'a.
- [ ] **Step 5: Slim root layout** — kök `layout.tsx`: `<html lang="tr" data-theme="aluplan" data-mode="dark">` (SSR varsayılanı korunur) → `<body>` içinde `ThemeModeProvider > { DebugOverlayController, children, ConsentBanner }`. Mod mount'ta provider'dan güncellenir.
- [ ] **Step 6: Verify no regression** — `pnpm typecheck`; dev server'da `/`, `/products`, `/kaynaklar`, `/2027`, `/paket-karsilastirma` 200 ve SiteShell görünür (read_page ile tek `<main>`).
- [ ] **Step 7: Full gate** — `pnpm test` → PASS (landmark/parity dahil).
- [ ] **Step 8: Commit** — `git commit -m "refactor: move site routes into (site) group; slim root layout"`

---

### Task 4: Akademi kabuğu — ince header + footer + main + tema toggle

**Files:**
- Create: `src/app/akademi/layout.tsx`, `src/components/akademi/AkademiShell.tsx`, `AkademiHeader.tsx`, `AkademiFooter.tsx` + `.module.css`
- Test: `tests/test_akademi_shell.py`

**Interfaces:**
- Consumes: Task 1 `useThemeMode`.
- Produces: `akademi/layout.tsx` → `<AkademiShell>{children}</AkademiShell>`. `AkademiShell` kendi `<main>`'ini render eder, `data-theme="aluplan" data-mode={mode}` sarmalı, header (logo→`/`, "ALLPLAN'ı keşfet"→`/products`, tema toggle), minimal footer (KVKK/yasal + ana siteye tek dönüş). Sidebar Task 5'te eklenecek (slot bırak).

- [ ] **Step 1: Failing test** — `tests/test_akademi_shell.py`: `AkademiShell.tsx` tek `<main` içerir; header'da `href="/products"` ve `href="/"` ve `useThemeMode(` var; footer'da KVKK linki var; dosyalar literal renk içermez.
- [ ] **Step 2: Fails** — `python3 -m unittest tests.test_akademi_shell -v` → FAIL.
- [ ] **Step 3: Implement** — AkademiShell + Header + Footer (token-only, semantik `<header>/<nav>/<footer>/<main>`), `akademi/layout.tsx` sarar.
- [ ] **Step 4: Verify** — `pnpm typecheck`, `pnpm styles:check`, test → PASS; dev `/akademi` ince header + tema toggle (dark **ve** light) çalışır, SiteShell yok, tek `<main>`.
- [ ] **Step 5: Commit** — `git commit -m "feat: akademi shell (slim header, footer, theme toggle)"`

---

### Task 5: Akademi sol sidebar (müfredat gezinmesi, sticky + mobil çekmece)

**Files:**
- Create: `src/components/akademi/AkademiSidebar.tsx` + `.module.css`
- Modify: `src/components/akademi/AkademiShell.tsx` (sidebar slotunu doldur), `src/data/akademi.ts` (gerekirse sidebar nav türevi — mevcut `akademiLevels`/`slug`'tan üretilebilir)
- Test: `tests/test_akademi_sidebar.py`, `tests/akademi_sidebar_runtime.mjs`

**Interfaces:**
- Consumes: `akademiLevels`, `akademiLevelSlugs`, `getAkademiLevel`.
- Produces: `AkademiSidebar` — `<nav aria-label="Müfredat">`; 4 seviye → modül kodları; `usePathname()` ile aktif seviye vurgulanır (wayfinding aksanı). Masaüstü sticky; mobil `<details>`/çekmece, route değişince kapanır, Esc kapatır.

- [ ] **Step 1: Failing test** — `tests/test_akademi_sidebar.py`: `AkademiSidebar.tsx` `<nav` + `aria-label` + `usePathname(` içerir; dört `seviye-` slug'ına link; literal renk yok.
- [ ] **Step 2: Fails** → FAIL.
- [ ] **Step 3: Implement sidebar** — seviye+modül listesi, aktif vurgulama (tek aksan token'ı).
- [ ] **Step 4: Mobil davranış** — çekmece aç/kapa; route değişince kapanış (`usePathname` effect), Esc ve dış tık ile kapanış, odak yönetimi. `akademi_sidebar_runtime.mjs` ile kapanış mantığını doğrula.
- [ ] **Step 5: Verify** — dev masaüstü sticky + aktif vurgulama; mobil (≤390px) çekmece; a11y (Esc, route-change). `pnpm styles:check` + typecheck.
- [ ] **Step 6: Commit** — `git commit -m "feat: akademi curriculum sidebar"`

---

### Task 6: Paylaşılan bileşen kiti (mimari dil)

**Files:**
- Create: `src/components/akademi/kit/ModuleCard.tsx`, `LevelCard.tsx`, `MetaRow.tsx`, `SectionRule.tsx`, `Timeline.tsx`, `Callout.tsx`, `DistributionBar.tsx` (+ her biri `.module.css`), `src/components/akademi/kit/index.ts`
- Test: `tests/test_akademi_kit.py`

**Interfaces:**
- Consumes: `AkademiModule`, `AkademiLevel` (`src/data/akademi.ts`), `AluIcon`.
- Produces (imzalar, kod step'lerinde gövde yazılacak):
  - `ModuleCard({ module, showHours }: { module: AkademiModule; showHours?: boolean })` — kod küçük ayrı etiket, başlık serbest, kazanım checklist. `showHours=false` iken saat gizlenir (tek-modüllü kolda tekrarı önlemek için).
  - `LevelCard({ level, active }: { level: AkademiLevel; active?: boolean })` — iri mono numara, etiket, istatistik, CTA; `active` → wayfinding aksanı.
  - `MetaRow({ items }: { items: readonly { k: string; v: string }[] })`, `DistributionBar({ segments })`, `Timeline({ steps })`, `Callout({ label, children })`, `SectionRule({ label })`.

- [ ] **Step 1: Failing test** — `tests/test_akademi_kit.py`: her kit dosyası var, literal renk yok (yalnız token), `ModuleCard` `showHours` prop'u destekler (tek-modüllü kolda saat tekrarı önlenir), kod etiketi başlık `<h_>`'ın İÇİNDE DEĞİL (ayrı eleman).
- [ ] **Step 2: Fails** → FAIL.
- [ ] **Step 3: Implement kit** — mimari dil (mono kod etiket, hairline, gri-ton dağılım). Her dosya <800 satır, tek sorumluluk.
- [ ] **Step 4: Verify** — `pnpm typecheck`, `pnpm styles:check` (renk guard), test → PASS.
- [ ] **Step 5: Commit** — `git commit -m "feat: akademi architectural component kit"`

---

### Task 7: Genel bakış sayfasını kitle yeniden tasarla

**Files:**
- Modify: `src/components/sections/AkademiOverview.tsx` (+ module.css), gerekirse `src/data/akademi.ts` (giriş yolu adımlarına seviye slug'ı)
- Test: `tests/test_akademi_page.py` (genişlet)

**Interfaces:**
- Consumes: Task 6 kit (`LevelCard`, `ModuleCard`, `SectionRule`, `Callout`).
- Produces: overview artık kit bileşenlerini kullanır; "Nereden başlamalısınız?" kartları/adımları seviye sayfalarına link.

- [ ] **Step 1: Failing test** — `test_akademi_page.py`: overview `LevelCard`/kit kullanır (eski inline `.module`/`.level` markup'ı değil); giriş yolu kartlarında `/akademi/seviye-` linki var.
- [ ] **Step 2: Fails** → FAIL.
- [ ] **Step 3: Implement** — overview'ı kitle yeniden kur; giriş yolları seviyelere bağlanır; tek `<main>` korunur (shell sağlar).
- [ ] **Step 4: Verify** — dev `/akademi` dark+light+mobil; typecheck + styles:check + `python3 -m unittest tests.test_akademi_page`.
- [ ] **Step 5: Commit** — `git commit -m "feat: redesign akademi overview with kit"`

---

### Task 8: Seviye sayfalarını kitle yeniden tasarla

**Files:**
- Modify: `src/components/sections/AkademiLevelDetail.tsx` (+ module.css)
- Test: `tests/test_akademi_page.py` (`AkademiLevelPageTests` genişlet)

**Interfaces:**
- Consumes: Task 6 kit, `getAkademiLevel`.
- Produces: seviye detayda kit kullanımı; tek-modüllü kolda saat **tek kez** (`ModuleCard showHours={false}` + kol toplamı), çok-modüllü kolda modül saatleri + toplam; aktif seviye wayfinding aksanı; önceki/sonraki `<nav>`.

- [ ] **Step 1: Failing test** — saat tekrarı testi: tek-modüllü kol render'ında saat metni bir kez; kit bileşenleri kullanılır; `<main>` tek (shell).
- [ ] **Step 2: Fails** → FAIL.
- [ ] **Step 3: Implement** — LevelDetail'i kitle kur; saat tekrarını gider.
- [ ] **Step 4: Verify üretim güvenliği** — ayrı worktree'de `ALUPLAN_SHOW_2027=1 pnpm build`; `.next/server/app/akademi/[seviye]` altında `seviye-*.html` ÜRETİLMEZ; `pnpm test` tüm yeşil.
- [ ] **Step 5: Commit** — `git commit -m "feat: redesign akademi level pages with kit"`

---

### Task 9: Motion (token CSS + lazy GSAP imza anı)

**Files:**
- Create: `src/components/akademi/motion/useSignatureReveal.ts` (dynamic import gsap), ilgili `.module.css` motion token kullanımları
- Modify: Package: `gsap` ekle (yalnız burada, dynamic import)
- Test: `tests/test_akademi_motion.py`

**Interfaces:**
- Produces: `useSignatureReveal(ref)` — mount'ta `await import('gsap')`, `prefers-reduced-motion` ise hiçbir şey yapmaz; yalnız 1 imza an (öneri: seviye zaman çizelgesi / hero başlık reveal).

- [ ] **Step 1: Failing test** — `tests/test_akademi_motion.py`: gsap yalnız `import('gsap')` (dynamic) olarak geçer, statik `import ... from 'gsap'` YOK; motion hook `matchMedia('(prefers-reduced-motion`) kontrolü içerir.
- [ ] **Step 2: Fails** → FAIL.
- [ ] **Step 3: Implement** — lazy GSAP reveal + reduced-motion guard; CSS token motion birincil.
- [ ] **Step 4: Verify** — `pnpm typecheck`; dev'de reveal çalışır, reduced-motion'da kapalı; ilk bundle'a gsap girmez (dynamic).
- [ ] **Step 5: Commit** — `git commit -m "feat: lazy GSAP signature motion for akademi"`

---

### Task 10: SEO/GEO temeli (yapısal veri + semantik doğrulama)

**Files:**
- Create: `src/components/akademi/AkademiJsonLd.tsx` (Course/ItemList JSON-LD; launch'a kadar render edilebilir ama noindex korunur)
- Test: `tests/test_akademi_seo.py`

**Interfaces:**
- Produces: `AkademiJsonLd({ level? })` — geçerli `Course`/`ItemList` JSON-LD; sayfa yine de noindex.

- [ ] **Step 1: Failing test** — `tests/test_akademi_seo.py`: JSON-LD geçerli tip (`"@type":"Course"`/`"ItemList"`) içerir; sayfalar hâlâ `robots index:false`; başlık hiyerarşisi tek `<h1>`; sidebar `<nav aria-label>`.
- [ ] **Step 2: Fails** → FAIL.
- [ ] **Step 3: Implement** — JSON-LD bileşenini overview/level'e ekle (noindex korunur).
- [ ] **Step 4: Verify** — test + typecheck + tam `pnpm test`; dev'de JSON-LD DOM'da, `robots noindex` korunuyor.
- [ ] **Step 5: Commit** — `git commit -m "feat: akademi structured data + SEO foundation"`

---

## Yürütme notları

- Görsel/davranışsal doğrulama bu projede birim test yerine **dev server + build-çıktısı + typecheck + styles:check** ile yapılır; adımlardaki "Verify" bunu kasteder.
- Task 1–3 (kabuk refactor'ü) bir grup: bittiğinde restore tag + tam `pnpm test` + ayrı worktree production build + main'e birleştir. Task 4–10 ikinci grup, aynı disiplin.
- Her main'e birleştirme öncesi: `restore/…` tag, `pnpm test` yeşil, üretim build'inde Akademi sızıntısı yok.
