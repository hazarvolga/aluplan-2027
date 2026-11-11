# Akademi Araması Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Akademi derslerini site aramasına ders düzeyinde ekle; sonuçları sırala, kapsam seçimi sun ve aramayı Akademi'de de aç.

**Architecture:** Derleme zamanında `scripts/build_akademi_search_index.mjs` ders JSON'larından `src/data/search-akademi-index.json` üretir (commit'li, `--check` ile denetlenir). `SearchIndexProvider` bu dizini yalnız Akademi bayrağı açıkken tembel yükler. `src/lib/search.ts`'e saf `rankSearchEntries` eklenir; arama penceresi `SiteShell`'den `SearchDialog` bileşenine taşınır ve `AkademiHeader` de kullanır.

**Tech Stack:** Next.js 16 App Router, TypeScript, Node 24 betikleri (`typescript` transpile), Python unittest + `tests/*_runtime.mjs` deseni.

**Spec:** `docs/superpowers/specs/2026-11-11-akademi-search-design.md`

## Global Constraints

- Ders düzeyi: her ders/modül/seviye/seri sayfası dizinde tek kayıt; adım/paragraf kaydı yok.
- `SearchEntry` biçimi değişmez (`path, title, seoTitle, section, description, keywords`); Akademi kayıtlarında `section` = `'Akademi'`.
- Bayrak kapalıyken (`isAkademiEnabled()` false) Akademi dizini yüklenmez.
- Ek npm bağımlılığı yok, harici servis yok.
- Kayıt başına `keywords` üst sınırı 1.500 karakter, tekilleştirilmiş.
- Puan: başlık +3, açıklama +2, anahtar kelime/yol/seoTitle +1 (sorgu kelimesi başına); eşit puanda giriş sırası korunur.
- Kapsam değerleri: `'all' | 'akademi' | 'site'`. SiteShell varsayılanı `'all'`, AkademiHeader varsayılanı `'akademi'`.
- Kod stili: tek tırnak, `alu-*` sınıfları, CSS'te yalnız token renkleri.

## Review Focus

1. Boş sorgu + kapsam "Akademi": yalnız Akademi kayıtlarından ilk 8'i gösterilmeli, site kayıtları değil (Task 1 testi).
2. Büyük/küçük harf ve Türkçe karakter: "PARAPET", "parapet", "Zelle Definieren" aynı dersi bulmalı (Task 1 ve Task 2 testleri).
3. Akademi'de Cmd+K: pencere açılmalı (bugün SiteShell erken döndüğü için açılmıyor) (Task 3 kaynak testi + tarayıcı).
4. Bayrak kapalı derleme: `search-akademi-index.json` import'u çalışmamalı (Task 2 kaynak testi).
5. Dizinde var olmayan sayfa yolu (yeniden adlandırılan slug): betik `--check` yolların `_index.json` ile eşleştiğini doğrulamalı (Task 2 testi).

---

### Task 1: Sıralama ve kapsam (`rankSearchEntries`)

**Files:**
- Modify: `src/lib/search.ts`
- Create: `tests/search_rank_runtime.mjs`
- Test: `tests/test_search_rank.py`

**Interfaces:**
- Produces: `export type SearchScope = 'all' | 'akademi' | 'site';`
  `export function rankSearchEntries(entries: SearchEntry[], query: string, scope?: SearchScope): SearchEntry[]` (varsayılan `'all'`).
  Boş sorguda kapsama uyan kayıtları sırasıyla döndürür (çağıran ilk 8'i keser). `searchEntries` aynen kalır.

- [ ] **Step 1: Failing test.** `tests/search_rank_runtime.mjs`, `tests/embeds_runtime.mjs` desenindeki gibi `src/lib/search.ts`'i transpile edip `rankSearchEntries`'i şu girişle çalıştırır ve sonuç yollarını JSON basar:
  entries = `[{path:'/a',title:'Duvar',section:'Site',description:'',seoTitle:'',keywords:''},{path:'/akademi/x',title:'Kapı',section:'Akademi',description:'Duvara kapı',seoTitle:'',keywords:'parapet'},{path:'/akademi/y',title:'Duvar Oluşturma',section:'Akademi',description:'',seoTitle:'',keywords:'zelle definieren'}]`.
  Python testleri: `test_title_match_ranks_first` → sorgu `duvar`, `all` → `['/a','/akademi/y','/akademi/x']`; `test_scope_akademi_filters_site` → `duvar`, `akademi` → `['/akademi/y','/akademi/x']`; `test_scope_site` → `duvar`, `site` → `['/a']`; `test_empty_query_respects_scope` → `''`, `akademi` → `['/akademi/x','/akademi/y']`; `test_turkish_and_case_insensitive` → `PARAPET` → `['/akademi/x']`, `Zelle Definieren` → `['/akademi/y']`.
- [ ] **Step 2:** `python3 -m unittest tests.test_search_rank` → FAIL (`rankSearchEntries` yok).
- [ ] **Step 3:** `rankSearchEntries` ve `SearchScope`'u yaz (mevcut `normalize` kullanılır; kapsam `section === 'Akademi'`).
- [ ] **Step 4:** Test → PASS; `npx tsc --noEmit` temiz.
- [ ] **Step 5:** Commit `feat(search): sıralama ve kapsam (rankSearchEntries)`.

### Task 2: Akademi dizini (betik + yükleme + bayrak)

**Files:**
- Create: `scripts/build_akademi_search_index.mjs`, `src/data/search-akademi-index.json`
- Modify: `package.json` (`search:index` ve `search:check` zincirine eklenir), `src/components/shell/SearchIndexProvider.tsx`, `src/app/layout.tsx`
- Test: `tests/test_akademi_search_index.py`

**Interfaces:**
- Consumes: ders JSON'ları (`src/data/<seri>/NN.json`: `slug,title,objectives[],steps[].heading,commands[].name/menu,deepDive.blocks[type=heading].text`), `src/data/<seri>/_index.json`, `src/data/akademi-content/M*.json` (`slug,levelSlug,title,summary,outcomes`).
- Produces: `search-akademi-index.json` = `SearchEntry[]`; `SearchIndexProvider` prop `showAkademi: boolean`.

- [ ] **Step 1: Failing tests** (`tests/test_akademi_search_index.py`):
  `test_every_series_lesson_has_one_entry` (her `_index.json` dersi için `/akademi/<seri>/<slug>` tam bir kez);
  `test_every_module_level_and_series_page_has_an_entry` (`/akademi/<levelSlug>/<slug>` her M*.json; `/akademi/temel|orta|ileri|uzman`; 8 seri giriş yolu);
  `test_entries_are_akademi_section_and_capped` (`section == 'Akademi'`, `len(keywords) <= 1500`);
  `test_lesson_keywords_carry_original_command_names` (`/akademi/lejant/mimari-lejant-hucresi-tanimlama` kaydının keywords'ünde normalleştirilmiş `zelle definieren`);
  `test_index_is_current` (`node scripts/build_akademi_search_index.mjs --check` çıkış 0);
  `test_provider_loads_akademi_index_only_behind_flag` (kaynakta `showAkademi ? import('@/data/search-akademi-index.json')` ve `layout.tsx`'te `showAkademi={isAkademiEnabled()}`).
- [ ] **Step 2:** Testler FAIL.
- [ ] **Step 3:** Betiği yaz. Seri adları: Temel Modelleme Eğitimi, Arazi Modelleme Eğitimi, Lejant Oluşturma Eğitimi, Donatı Detaylandırma, Çelik Yapı ve SDS2, Prekast Yapı Elemanları, Otomasyon ve Visual Scripting, OpenBIM ve IFC (sidebar ile aynı). Seviye adları: temel→Temeller, orta→Üretim ve Dokümantasyon, ileri→Disiplin Uzmanlığı, uzman→BIM Yönetimi ve Otomasyon. `seoTitle` = `${title} | Aluplan Akademi`. Ders `description` = `objectives[0]`. Anahtar kelime sırası: seri adı, seviye adı, kalan hedefler, komut adı+menü, adım başlıkları, Derinlemesine başlıkları; `**` temizlenir, tekilleştirilir, 1.500'de kesilir. `--check` modu `build_search_extra_index.mjs` ile aynı. `package.json` zincirine ekle; JSON'u üret.
- [ ] **Step 4:** `SearchIndexProvider`'a `showAkademi` ekle (Promise.all'a koşullu import, `mergeSearchIndex` sonrası eklenir); `layout.tsx` geçir. Testler PASS, `pnpm search:check` 0.
- [ ] **Step 5:** Commit `feat(search): Akademi ders dizini (bayrak arkasında)`.

### Task 3: Ortak `SearchDialog` + Akademi başlığı + `/search`

**Files:**
- Create: `src/components/shell/SearchDialog.tsx`
- Modify: `src/components/shell/SiteShell.tsx` (pencere ve Cmd+K dinleyicisi çıkar), `src/components/akademi/AkademiHeader.tsx` (+ `.module.css`), `src/components/sections/SearchPageSection.tsx`
- Test: `tests/test_search_dialog.py`

**Interfaces:**
- Consumes: `rankSearchEntries`, `SearchScope` (Task 1); `useSearchIndex()` (`entries` Akademi kayıtlarını içerir, Task 2).
- Produces: `export function SearchDialog({ defaultScope, showScopes, trigger }: { defaultScope: SearchScope; showScopes: boolean; trigger: (open: () => void) => ReactNode }): ReactElement` — Cmd+K/Esc dinleyicisini kendisi kurar, `MediaDialog` + mevcut pencere işaretlemesini kullanır; kapsam düğmeleri `aria-pressed` ile.

- [ ] **Step 1: Failing tests** (`tests/test_search_dialog.py`): SiteShell'de `<SearchDialog` ve `defaultScope="all"`, artık `Ürün, Çözüm ve Eğitim Arama` metni SiteShell'de değil SearchDialog'da; AkademiHeader'da `<SearchDialog` ve `defaultScope="akademi"`; SearchDialog'da `rankSearchEntries(`, `aria-pressed`, `'metaKey'`/`ctrlKey` dinleyicisi; SearchPageSection'da `rankSearchEntries(`.
- [ ] **Step 2:** FAIL.
- [ ] **Step 3:** Taşı ve bağla. Kapsam etiketleri: Tümü / Akademi / Site; `showScopes` = Akademi bayrağı (SiteShell `useSearchIndex` ya da prop ile). Akademi başlığında düğme: `search` ikonu + "Ara" metni (≤640px yalnız ikon), `aria-label="Akademi'de ara"`. Boş sorguda ilk 8 kayıt.
- [ ] **Step 4:** Testler PASS; `npx tsc --noEmit`; tarayıcıda: ana sitede ve `/akademi/temel-modelleme/kapi-pencere`'de Cmd+K açılır; "parapet" ve "Zelle definieren" ilgili Akademi dersini ilk sıralarda getirir; kapsam değişimi sonucu değiştirir; mobilde başlık taşmaz.
- [ ] **Step 5:** Tam doğrulama: `ALUPLAN_SHOW_2027=1 ALUPLAN_SHOW_AKADEMI=1 pnpm build` ve `pnpm test` yeşil. Commit `feat(search): ortak arama penceresi, Akademi başlığında arama`.
