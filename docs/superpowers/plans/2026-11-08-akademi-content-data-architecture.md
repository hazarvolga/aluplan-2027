# Aluplan Akademi İçerik Veri Mimarisi — Uygulama Planı

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Tüm akademi sayfalarını tek bir yapılandırılmış içerik kaynağından beslemek ve her modül için zengin "Ders Bilgi Kartı" detay sayfaları eklemek.

**Architecture:** Modül rich içeriği commit'li per-modül JSON (`src/data/akademi-content/<code>.json`); program/seviye taksonomisi + tipler + loader `src/data/akademi-content.ts`'de (statik import, build adımı yok); Python stdlib doğrulayıcı `pnpm test`'te. Yeni modül detay rotaları tam semantik URL ile. `akademi.ts` emekliye ayrılır.

**Tech Stack:** Next.js 16 (App Router, standalone), React 19, TypeScript, CSS Modules + tasarım token'ları (`--accent-akademi`), Python stdlib doğrulayıcı, Python unittest + typecheck + styles:check.

**Spec:** [docs/superpowers/specs/2026-11-08-akademi-content-data-architecture-design.md](../specs/2026-11-08-akademi-content-data-architecture-design.md)

## Global Constraints

- **Sıfır yeni bağımlılık** (npm veya Python); doğrulayıcı Python **stdlib** (json, re, pathlib).
- Yalnız CSS token'ları (`check_component_colors.py`); aksan `var(--accent-akademi)`.
- Akademi tüm sayfaları `isAkademiEnabled()` arkasında; `robots noindex`; sitemap/navigation.json/search-index/llms.txt dışında.
- Modül detay rotası: `generateStaticParams` üretimde `[]` (flag kapalı), `export const dynamicParams = false`.
- `ALUPLAN_SHOW_AKADEMI` Dockerfile ve ci.yml'de TANIMLANMAZ. (2026-11-11 güncellemesi: yayına hazırlıkla Dockerfile'a varsayılanı kapalı `ARG ALUPLAN_SHOW_AKADEMI=0` eklendi; Coolify 1 verince yayınlanır.)
- Her sayfa tam **bir** `<main>` (shell sağlar; akademi shell'i).
- URL: tam semantik — seviye `temel/orta/ileri/uzman`; modül slug açıklayıcı (başlıktan, seviye içinde benzersiz); `/allplan` prefix YOK.
- Türkçe içerik; anti-slop; kod `--font-mono`.
- Her task sonunda test geçer + commit. Grup sonunda ayrı worktree production build (akademi sızıntısı yok). Restore tag alındı: `restore/pre-akademi-content-20261108`.

## Review Focus

- **Seviye slug değişimi regresyonu:** `seviye-1..4` → `temel/..` sonrası sidebar aktiflik, overview "detay" linkleri, mevcut testler yeni slug'a göre geçer. → Task 2.
- **Üretim sızıntısı:** modül detay (`/akademi/[seviye]/[modul]`) üretimde HTML üretmez; `/akademi/*` noindex + flag-gated. → Task 5 + grup build.
- **Eksik/yanlış içerik:** zorunlu alan eksik, slug çakışması, süre toplamı tutmayan modül JSON → doğrulayıcı yakalar. → Task 1.
- **Track altı modül çözümü:** L3 modülü (`tracks[].moduleCodes`) için `(seviye, modul-slug)` doğru modüle çözülür; track breadcrumb'da. → Task 5.
- **Tek `<main>`:** modül detay sayfası akademi shell içinde tek main; sidebar detay sayfalarında görünür. → Task 5.

---

### Task 1: İçerik veri modeli — tipler, loader, doğrulayıcı, 12 modül JSON

**Files:**
- Create: `src/data/akademi-content.ts` (tipler + program/seviye taksonomisi + loader), `src/data/akademi-content/<code>.json` × 12 (M1,M2,M3,M4,M4B,M3B,M5,M6,M7,M8,M9,M10), `scripts/validate_akademi_content.py`
- Test: `tests/test_akademi_content.py`

**Interfaces:**
- Produces:
  - Tipler: `Outcome { text; bloom; code }`, `Concept { term; desc; en }`, `SessionStep { time; phase; instructor; participant; material }`, `DurationSlice { label; minutes }`, `ContentModule { code; slug; title; levelSlug; trackTitle?; hours; format; prerequisite; summary; outcomes: Outcome[]; concepts?: Concept[]; sessionFlow: SessionStep[]; durationSplit: DurationSlice[]; runningProjectStep; homework?; assessment?; materials?: string[]; proposed?; lessons?: unknown[] }`, `ContentLevel { number; slug; title; role; shared; summary; modules?: ContentModule[]; tracks?: { title; summary; modules: ContentModule[] }[] }`, `AkademiProgram { hero; entryPaths; runningProject; lessonParts; certificate; knowledgeBase; progressNote; levels: ContentLevel[] }`.
  - `akademiProgram: AkademiProgram` (loader modül JSON'larını levellara statik import ile bağlar).
  - `getLevelBySlug(slug: string): ContentLevel | undefined`, `getModuleBySlug(levelSlug: string, moduleSlug: string): ContentModule | undefined`, `levelSlugs: readonly string[]`, `moduleRouteParams(): { seviye: string; modul: string }[]`.
- Consumes: modül içerikleri `docs/curriculum/03-ders-planlari/*.md`'den transcribe edilir (durationSplit 4 etiketle elle; sessionFlow dakika tablosundan).

- [ ] **Step 1: Write the failing test** — `tests/test_akademi_content.py`: doğrulayıcı script var ve stdlib (import yaml/zod YOK); her modül JSON'u zorunlu alanları (code, slug, title, levelSlug, hours, outcomes[], sessionFlow[], durationSplit[], runningProjectStep) içerir; slug'lar seviye içinde benzersiz; durationSplit etiketleri {anlatım,uygulama,ölçme,bireysel}; 12 JSON mevcut.
- [ ] **Step 2: Run** `python3 -m unittest tests.test_akademi_content -v` → FAIL.
- [ ] **Step 3: Implement doğrulayıcı** `scripts/validate_akademi_content.py` (stdlib; şema kontrolü; CLI: `python3 scripts/validate_akademi_content.py` → hata→exit 1).
- [ ] **Step 4: Author 12 modül JSON** — `docs/curriculum/03-ders-planlari/`'den transcribe (kazanımlar K-kodlu + Bloom; sessionFlow; durationSplit 4 etiket; sürekli proje; ödev; ölçme; materyaller). Slug = başlıktan türetilmiş (ör. `arayuz-ve-temel-gezinme`).
- [ ] **Step 5: Implement `akademi-content.ts`** — tipler + program/seviye taksonomisi (akademi.ts'ten taşınan hero/entryPaths/levels/tracks) + modül JSON statik import/birleştirme + export edilen loader fonksiyonları.
- [ ] **Step 6: Verify** — `python3 -m unittest tests.test_akademi_content` + `pnpm typecheck` → PASS.
- [ ] **Step 7: Commit** — `git commit -m "feat: akademi structured content model + 12 module JSON + validator"`

---

### Task 2: Semantik seviye slug'ları (seviye-1..4 → temel/orta/ileri/uzman)

**Files:**
- Modify: `src/data/akademi-content.ts` (level.slug semantik), `src/components/akademi/sidebar-nav.ts`, `src/components/akademi/AkademiSidebar.tsx`, `src/app/akademi/[seviye]/page.tsx`
- Test: `tests/test_akademi_page.py`, `tests/test_akademi_sidebar.py` (güncelle)

**Interfaces:**
- Consumes: Task 1 `levelSlugs`, `getLevelBySlug`.
- Produces: seviye rotaları `/akademi/temel|orta|ileri|uzman`; `generateStaticParams` bu dört slug'ı üretir (flag açıkken).

- [ ] **Step 1: Failing test** — `test_akademi_page`: `levelSlugs` = {temel,orta,ileri,uzman}; `test_akademi_sidebar`: sidebar linkleri `/akademi/temel` vb.
- [ ] **Step 2: Fails** → FAIL (hâlâ seviye-N).
- [ ] **Step 3: Implement** — slug'ları semantik yap; sidebar/route/isActive güncelle.
- [ ] **Step 4: Verify** — testler + typecheck; dev `/akademi/temel` 200, sidebar aktiflik doğru.
- [ ] **Step 5: Commit** — `git commit -m "feat: semantic akademi level slugs"`

---

### Task 3: Overview + LevelDetail'i yeni modelden besle; akademi.ts emekli

**Files:**
- Modify: `src/components/sections/AkademiOverview.tsx`, `AkademiLevelDetail.tsx`, `src/components/akademi/kit/*` (veri tipi importları), `src/components/akademi/AkademiJsonLd.tsx`
- Delete: `src/data/akademi.ts` (tüm tüketiciler yeni modele geçince)
- Test: `tests/test_akademi_page.py` (güncelle)

**Interfaces:**
- Consumes: Task 1 `akademiProgram`, `getLevelBySlug`, `ContentLevel/ContentModule`.
- Produces: Overview/LevelDetail/JsonLd yalnız `akademi-content.ts`'ten okur; `akademi.ts` kaldırılır.

- [ ] **Step 1: Failing test** — `test_akademi_page`: Overview/LevelDetail `@/data/akademi-content`'ten import eder, `@/data/akademi`'den ETMEZ; `src/data/akademi.ts` artık YOK.
- [ ] **Step 2: Fails** → FAIL.
- [ ] **Step 3: Implement** — tüketicileri yeni modele geçir; kit tipleri `ContentModule`/`ContentLevel`'e bağla; `akademi.ts` sil.
- [ ] **Step 4: Verify** — `pnpm test` (search:check/source-contract/parity akademi.ts'e bağlı değilse yeşil kalır) + typecheck + styles:check; dev `/akademi` ve `/akademi/temel` birebir çalışır.
- [ ] **Step 5: Commit** — `git commit -m "refactor: akademi pages read the content model; retire akademi.ts"`

---

### Task 4: Kit — DistributionBar + Timeline

**Files:**
- Create: `src/components/akademi/kit/DistributionBar.tsx` + `.module.css`, `src/components/akademi/kit/Timeline.tsx` + `.module.css`; Modify `kit/index.ts`
- Test: `tests/test_akademi_kit.py` (genişlet)

**Interfaces:**
- Consumes: `DurationSlice[]`, `SessionStep[]` (Task 1).
- Produces: `DistributionBar({ segments }: { segments: readonly DurationSlice[] })` — gri-ton segmentli çubuk + legend; `Timeline({ steps }: { steps: readonly SessionStep[] })` — hairline dikey zaman çizelgesi (time + phase + what).

- [ ] **Step 1: Failing test** — `test_akademi_kit`: iki dosya var, index re-export eder, literal renk yok; DistributionBar gri-ton (candy renk yok).
- [ ] **Step 2: Fails** → FAIL.
- [ ] **Step 3: Implement** — token-only, editoryal dil.
- [ ] **Step 4: Verify** — test + typecheck + styles:check.
- [ ] **Step 5: Commit** — `git commit -m "feat: akademi DistributionBar + Timeline kit"`

---

### Task 5: Modül detay sayfası + LessonInfoCard + Course JSON-LD

**Files:**
- Create: `src/app/akademi/[seviye]/[modul]/page.tsx`, `src/components/sections/AkademiModuleDetail.tsx` (+ module.css)
- Modify: `src/components/akademi/AkademiJsonLd.tsx` (modül → Course)
- Test: `tests/test_akademi_module_page.py`

**Interfaces:**
- Consumes: Task 1 `getModuleBySlug`, `moduleRouteParams`; Task 4 `DistributionBar`, `Timeline`; mevcut `MetaRow`, `Callout`, `SectionRule`.
- Produces: `/akademi/[seviye]/[modul]` — flag-gated, noindex, `dynamicParams=false`, `generateStaticParams`=moduleRouteParams (flag açıkken 12). `AkademiModuleDetail({ module, level })` zengin kartı çizer: breadcrumb (seviye→modül), başlık+kod etiketi, MetaRow (toplam süre/format/ön koşul/kazanım sayısı), DistributionBar, kazanımlar (Bloom+kod), Timeline (örnek oturum), sürekli proje Callout, ölçme/ödev/materyaller; önceki/sonraki modül `<nav>`.

- [ ] **Step 1: Failing test** — `tests/test_akademi_module_page.py`: `[seviye]/[modul]/page.tsx` `isAkademiEnabled` + `notFound` + `robots index:false` + `dynamicParams = false` + `generateStaticParams`'da `moduleRouteParams`; üretimde boş döner; `AkademiModuleDetail` tek `<main` İÇERMEZ (shell sağlar), DistributionBar+Timeline kullanır.
- [ ] **Step 2: Fails** → FAIL.
- [ ] **Step 3: Implement** — sayfa + LessonInfoCard düzeni + modül Course JSON-LD.
- [ ] **Step 4: Verify üretim güvenliği** — ayrı worktree `ALUPLAN_SHOW_2027=1 pnpm build`; `.next/server/app/akademi/[seviye]/[modul]` altında modül HTML'i ÜRETİLMEZ; dev'de `/akademi/temel/arayuz-ve-temel-gezinme` zengin kart, tek main, noindex, dark+light+mobil.
- [ ] **Step 5: Commit** — `git commit -m "feat: akademi module detail pages (rich info card)"`

---

### Task 6: Modülleri detaya bağla — linkler + breadcrumb + nav

**Files:**
- Modify: `src/components/sections/AkademiLevelDetail.tsx` (modül → detay linki), `AkademiModuleDetail.tsx` (breadcrumb + prev/next modül), gerekirse `AkademiSidebar.tsx` (modül kodları → ilgili detay/çapa)
- Test: `tests/test_akademi_module_page.py` (genişlet)

**Interfaces:**
- Consumes: Task 1 (modül komşuları), Task 5 `AkademiModuleDetail`.
- Produces: seviye sayfasındaki her modül, `/akademi/[seviye]/[modul]`'e linkli; detayda breadcrumb (Akademi → seviye → modül) + aynı seviyedeki önceki/sonraki modül `<nav>`.

- [ ] **Step 1: Failing test** — LevelDetail modül kartlarında `/akademi/${level.slug}/${module.slug}` linki; ModuleDetail'de breadcrumb + `<nav` prev/next.
- [ ] **Step 2: Fails** → FAIL.
- [ ] **Step 3: Implement.**
- [ ] **Step 4: Verify** — dev gezinme akışı: seviye → modül → önceki/sonraki; typecheck + styles:check + `pnpm test`.
- [ ] **Step 5: Commit** — `git commit -m "feat: link modules to detail pages + breadcrumb/nav"`

---

## Yürütme notları
- Görsel/davranışsal doğrulama: dev server + build-çıktısı + typecheck + styles:check.
- Grup sonunda (Task 6 sonrası): tam `pnpm test` + ayrı worktree production build (akademi/modül sızıntısı yok) + taze reviewer + main'e birleştir.
- `akademi.ts` silinince: search:check/source-contract/parity'nin ona dokunmadığını Task 3'te doğrula; dokunuyorsa ruling + güncelle.
