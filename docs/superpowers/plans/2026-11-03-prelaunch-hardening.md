# Yayın Öncesi Sağlamlaştırma (16 geliştirme maddesi) Uygulama Planı

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Yayın öncesi incelemedeki açık geliştirme maddelerini kapatmak: Y1–Y5, O2, O3, O6, O7, O9, O10, D2, D3, D5, D9 ve D12.

**Architecture:** Çerez onayı tek bir istemci deposunda toplanır (`src/lib/consent.ts`). GA4, Vercel ölçümleri ve üçüncü taraf gömmeler (YouTube, Google Maps) bu depoya bağlanır. Gömmeler tek bir `ConsentEmbed` bileşeninden geçer; bu, bileşen indeksindeki VideoPlayer/MediaFrame birleşmesinin ilk adımıdır. Ağır görseller `sips` ile üretilen deterministik JPEG türevleriyle değiştirilir. Diğer maddeler yerinde, küçük düzeltmelerle kapanır.

**Tech Stack:** Next.js 16.4.2, React 19.3.1, TypeScript, Python 3 stdlib, macOS `sips`. Yeni npm bağımlılığı yok.

**Spec:** Bağımsız inceleme raporu (https://claude.ai/artifact/LaTTqWNx5BR7Ws1wRhES96), Y/O/D bulguları; durum tablosu bu oturumda verildi.

## Global Constraints

- `../aluplan-2026` salt-okunur. İçerik, URL ve hedefler korunur; yeni metin yalnız K-kararlarındaki arayüz etiketleriyle sınırlı.
- Yeni npm bağımlılığı yok. Ham CSS değeri yok; yalnız token kullanılır.
- Her task sonunda `pnpm test` ve `pnpm typecheck` geçmeli. Her `pnpm build` sonrasında `next-env.d.ts` build öncesi haline geri alınır.
- Commit biçimi `<type>: <description>`. Dal `codex/prelaunch-hardening`, `codex/prelaunch-blockers` üzerinden açılır. Push ve PR yalnız onayla yapılır.
- `prefers-reduced-motion` ve klavye erişimi korunur.

## Kararlar: onay gerekir (varsayılan öneriyle)

| No | Konu | Öneri |
|---|---|---|
| H1 | GA4 | Canlı site ve kaynaktaki `G-DQYT0D9MQ5` korunur, ancak yalnız çerez bandında "Kabul" seçildikten sonra yüklenir. Kaynak sitede onaysız yükleniyordu. |
| H2 | YouTube / Harita | Onay yoksa gömme yerine kapak gösterilir; tıklayınca o gömme yüklenir. YouTube her yerde `youtube-nocookie.com` kullanır. Yeni etiketler: "Videoyu oynat" ve "Haritayı göster". |
| H3 | Node sürümü | `package.json` `engines.node: "24.x"`, `.nvmrc` 24, CI `node-version: 24`. Vercel `engines` alanını izler. |
| H4 | Statik dosya önbelleği | `/assets`, `/docs`, `/videos`, `/images` için `public, max-age=604800, stale-while-revalidate=86400` (7 gün). Dosya adları içerik karmalı olmadığı için `immutable` kullanılmaz. |
| H5 | İzleme | Vercel Web Analytics ve Speed Insights betikleri paket eklemeden, onay sonrası yüklenir. Vercel panelinden **sizin** etkinleştirmeniz gerekir. Hata takibi (Sentry vb.) yeni hesap ve bağımlılık gerektirdiği için kapsam dışı. |
| H6 | D2 CSP `unsafe-inline` ve D3 `access-control-allow-origin: *` | **Kabul edilen risk, kod değişmez.** Nonce tabanlı CSP 118 statik sayfayı dinamik render'a zorlar. HTML herkese açık ve kimlik bilgisi taşımıyor. Gerekçe doğrulama belgesine yazılır. |
| H7 | O7 BIMFlex videosu (`Qyy_hRNkOtY`) | YouTube'da gömme kapalı (oEmbed 403, küçük resim 404); sorun canlıda da var. Kart korunur; gömme yerine YouTube'a dış bağlantı verilir, kırık küçük resim yerine sayfadaki BIMFlex görseli kullanılır. |
| H8 | `/2027/max` medya | Özellik klipleri yalnız ekrana girince ve en az 768 px genişlikte otomatik oynar, `preload="none"`. Tanıtım videosu `preload="none"` olur, mevcut hero görseli poster olarak kullanılır. |

## Review Focus

1. **Onaysız ziyaretçi:** Hiçbir sayfada `googletagmanager`, `youtube.com/embed`, `youtube-nocookie.com/embed` veya `google.com/maps` isteği olmamalı. Test Task 3 ve Task 4'te.
2. **Onay sonrası:** Sayfa yeniden yüklenmeden GA ve gömmeler çalışmalı; "Reddet" sonrası hiçbiri yüklenmemeli. Test Task 3'te.
3. **Optimize görseller:** Ana sayfadaki görseller görsel olarak aynı kadrajda kalmalı (en-boy oranı korunur). Test Task 1'de.
4. **Hareket ve medya:** Hareket azaltma açıkken hiçbir klip otomatik oynamamalı. Test Task 2'de.
5. **Önbellek:** `_next/static` için mevcut `immutable` davranışı ve HTML'nin `max-age=0` davranışı bozulmamalı. Test Task 6'da.

---

### Task 1: Ana sayfa görsel optimizasyonu (Y1)

**Files:** Create `scripts/build_web_derivatives.py`, `public/assets/previews/{solutions,workflow}/*-web.jpg`, `public/opengraph-image.jpg`. Modify `src/components/sections/HomepageView.tsx:19-23, 146`, `src/lib/metadata.ts`, `src/lib/release-2027-routes.ts` (`DEFAULT_OG_IMAGE`). Test `tests/test_web_derivatives.py`.

**Interfaces:** Produces `build_web_derivatives.py --check`: 8 PNG'den 1600 px genişlikte, `sips` JPEG kalite 80 türev üretir; OG görselinden 1200×630 JPEG üretir. `--check` dosyaların varlığını, JPEG imzasını, en-boy oranını (±%1) ve 450 KB üst sınırını doğrular. Orijinal PNG'ler silinmez.

- [ ] Failing test: `test_homepage_references_web_derivatives` (HomepageView'da `-original.png` geçmez), `test_derivatives_are_small_jpegs` (her türev < 450 KB ve JPEG imzalı), `test_aspect_ratio_preserved`, `test_no_manual_png_preload`.
- [ ] RED'i doğrula → betiği yaz, türevleri üret, referansları değiştir → GREEN.
- [ ] `pnpm test` ve build; ana sayfanın tam kaydırma sonrası aktarım boyutunu tarayıcıda ölç (önce/sonra).
- [ ] Commit: `perf: serve web derivatives for homepage imagery`

### Task 2: `/2027/max` medya yükü (Y2)

**Files:** Modify `src/components/sections/AllplanMaxFeatureClip.tsx`, `src/components/sections/AllplanMaxPreviewPage.tsx:33`. Test `tests/test_max_media_loading.py` (kaynak sözleşmesi) ve tarayıcı ölçümü.

- [ ] Failing test: klipte `preload="none"`, `IntersectionObserver` ve `(min-width: 768px)` koşulu bulunur; tanıtım videosunda `preload="none"` ve `poster` bulunur.
- [ ] Uygula: klip `src`'si ekrana girene kadar atanmaz; otomatik oynatma yalnız hareket azaltma kapalıyken ve en az 768 px genişlikte yapılır.
- [ ] Tarayıcıda 375 px'de `/2027/max` etkileşimsiz aktarım < 1,5 MB; masaüstünde klipler görünür olunca oynuyor.
- [ ] Commit: `perf: defer allplan max clips until visible`

### Task 3: Çerez onayı deposu ve GA4 (Y3, H1)

**Files:** Create `src/lib/consent.ts`, `src/components/shell/ConsentScripts.tsx`. Modify `src/components/shell/SiteShell.tsx:28-80`, `src/app/layout.tsx`. Test `tests/test_consent.py`, `tests/consent_runtime.mjs`.

**Interfaces:** Produces:
- `type ConsentState = 'accepted' | 'rejected' | null`
- `readConsent(): ConsentState`
- `writeConsent(state: Exclude<ConsentState, null>): void`: `localStorage['cookie-consent']` yazar ve `aluplan-consent-change` olayını yayar.
- `useCookieConsent(): ConsentState`: `useSyncExternalStore` kullanır.
- `ConsentScripts`: onay `accepted` ise GA4 (`G-DQYT0D9MQ5`) ve Vercel ölçüm betiklerini `next/script` `afterInteractive` ile yükler.

- [ ] Failing test: runtime betiği depo geçişlerini doğrular; build HTML'inde `googletagmanager` geçmez; `SiteShell` `writeConsent` kullanır.
- [ ] Uygula; CSP'ye `/_vercel/insights` ve `/_vercel/speed-insights` için `'self'` yeterli olduğunu doğrula.
- [ ] Tarayıcı: onaysız ağ isteği 0; "Kabul" sonrası `gtag` tanımlı ve GA isteği var; "Reddet" sonrası yok.
- [ ] Commit: `feat: gate analytics behind cookie consent`

### Task 4: `ConsentEmbed` ve gömme taşıması (Y4, D12, H2, H7)

**Files:** Create `src/components/ui/ConsentEmbed.tsx`. Modify the 9 iframe users: `AllplanCivilPreview`, `SubpageView`, `ContactMap`, `CivilFeatureGrid`, `AboutEditorialSection`, `AllplanMaxVideo`, `StructuredContentBlocks`, `VideoPlaylistSection`, `StructuredPageLayoutSection`. Test `tests/test_consent_embeds.py`.

**Interfaces:**
- Consumes `useCookieConsent()` (Task 3).
- Produces `ConsentEmbed({ kind: 'youtube' | 'map', src, title, poster? })`: onay varsa iframe'i doğrudan render eder; yoksa kapak ve buton gösterir, tıklamayla yalnız o gömmeyi yükler.
- YouTube `src` değeri `youtube-nocookie.com`'a normalize edilir. `allow` listesinde `web-share` bulunmaz (D12).

- [ ] Failing test: `src/components` içinde `<iframe` yalnız `ConsentEmbed.tsx`'te geçer; `youtube.com/embed` hiçbir yerde geçmez; build HTML'lerinde `<iframe` yoktur (onaysız varsayılan).
- [ ] Uygula; BIMFlex `Qyy_hRNkOtY` kaydını dış bağlantı ve yerel görsele çevir (H7).
- [ ] Tarayıcı: Scalypso, Max ve `/contact` sayfalarında kapak → tıklama → oynatma/harita; Escape ve odak davranışı korunur; konsolda `web-share` uyarısı yok.
- [ ] Commit: `feat: load third-party embeds only after consent`

### Task 5: YouTube kanal bağlantısı (Y5)

**Files:** Modify `scripts/generate_site_data.py:814-815, 1409`, `src/data/*` (üretilmiş). Test `tests/test_external_link_targets.py`.

- [ ] Failing test: üretilmiş verilerde `@ALLPLANglobal` geçmez; video kütüphanesi kanal bağlantısı `https://www.youtube.com/@AllplanInternational` (kaynak değeri).
- [ ] Yanlış yeniden yazımı kaldır, veriyi yeniden üret, tarayıcıda kanal sayfasının açıldığını doğrula.
- [ ] Commit: `fix: restore source youtube channel link`

### Task 6: Önbellek başlıkları ve Node sürümü (O2, O3, H3, H4)

**Files:** Modify `next.config.mjs` (`headers()`), `package.json` (`engines`), `.github/workflows/ci.yml:36`. Create `.nvmrc`. Test `tests/test_release_flags.py` (yapılandırma yükleme deseniyle `headers()` çıktısı).

- [ ] Failing test: `headers()` `/assets/:path*` için `public, max-age=604800, stale-while-revalidate=86400` döndürür; `/:path*` güvenlik başlıkları aynen korunur; `engines.node == "24.x"`; CI ve `.nvmrc` 24.
- [ ] Uygula; production'da `curl -I` ile görsel, PDF, HTML ve `_next/static` başlıklarını karşılaştır.
- [ ] Commit: `chore: cache static assets and pin node 24`

### Task 7: Küçük erişilebilirlik ve SEO düzeltmeleri (O9, O10, D5, D9)

**Files:** Modify `scripts/generate_site_data.py:569` (`/contact` başlığı → "İletişim ve Teknik Danışmanlık | Aluplan"), the token used by the homepage "İncele" label (tarayıcıda ölçülerek bulunur), `src/app/2027/compare/ComparisonTable.tsx`. Test `tests/test_small_a11y_fixes.py`.

- [ ] Failing test: hiçbir sayfa başlığında "Aluplan | Aluplan" geçmez; karşılaştırma tablosunda sembol hücreleri görsel olarak gizli metin taşır (`aria-label`'lı rolsüz `span` yok); tooltip butonunda `aria-controls` var.
- [ ] O9: tarayıcıda "İncele" kontrastını ölç, 4,5:1 sağlayan mevcut token'a geçir ve token kontrastı testine ekle.
- [ ] D5: `/solutions/architecture` sayfasındaki 13 `alt=""` görselin `alu-benefit-icon` içindeki dekoratif ikonlar olduğunu doğrula. Değilse kaynak alt metnini bağla.
- [ ] Commit: `fix: tidy contact title, comparison table semantics and label contrast`

### Task 8: Kabul ve devir

**Files:** Create `docs/verification/prelaunch-hardening-2026-11-03.md`. Modify `HANDOFF.md`.

- [ ] `pnpm test`, `pnpm typecheck`, iki bayrak ayarıyla build ve `pnpm audit --prod`.
- [ ] Tarayıcıda (masaüstü ve 375 px) Review Focus 1–5'i kontrol et; ana sayfa ile `/2027/max` aktarım boyutunu önce/sonra tablosuyla kaydet.
- [ ] D2/D3 kabul gerekçesini, H5 için Vercel panel adımını ve kalan karar maddelerini belgeye yaz.
- [ ] Commit: `docs: record prelaunch hardening verification`
