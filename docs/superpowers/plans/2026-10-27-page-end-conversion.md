# Page-End Conversion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace every automatic related-links block and the generic trial banner with one page-family-aware conversion section immediately before the footer.

**Architecture:** A pure route policy maps a `PageRecord` to a conversion view model or `null`. A stateless `PageEndConversion` component renders that model with existing semantic classes and tokens; `SubpageView` owns the single integration point, while structured and generic page bodies stop rendering `contentLinks`.

**Tech Stack:** Next.js 16.4.2, React, TypeScript, generated JSON data, Python `unittest`, Node/TypeScript runtime contract tests.

**Spec:** `docs/superpowers/specs/2026-10-27-page-end-conversion-design.md`

## Global Constraints

- Preserve `MAIN_QUOTE_FORM_URL`, `TRIAL_CTA_URL`, and `SUPPORT_PORTAL_URL` exactly as defined in `src/lib/site-data.ts`.
- Do not delete or rewrite generated `contentLinks`; remove only their automatic UI rendering.
- Do not change JSON-LD/schema builders, generated data, public routes, navigation, header, footer, or the live site.
- Use existing semantic design tokens and component classes; add no raw color, spacing, radius, shadow, or breakpoint literals.
- Render zero or one page-end conversion section per subpage; homepage, contact, search, health, and legal pages render none.
- External links remain ordinary outbound anchors with `target="_blank"` and `rel="noopener noreferrer"`; no hidden form submission or personal-data query parameters.

## Review Focus

- Training playlist routes use section `video-library`, but must still resolve to the training conversion through their `/solutions-v2/training` path.
- Support routes must win before the broader `/solutions-v2` commercial match.
- `/package-overview` and `/paket-karsilastirma` are section `corporate`, but must resolve to the commercial conversion.
- `/contact`, `/search`, `/health`, and all `legal` records must resolve to `null` without an empty section.
- Structured and generic pages must not retain either old related-links render path or the old generic trial band.

---

### Task 1: Page-family conversion policy

**Files:**
- Create: `src/components/sections/page-end-conversion-policy.ts`
- Create: `tests/page_end_conversion_runtime.mjs`
- Create: `tests/test_page_end_conversion.py`

**Interfaces:**
- Consumes: `PageRecord`, `MAIN_QUOTE_FORM_URL`, `TRIAL_CTA_URL`, and `SUPPORT_PORTAL_URL` from `src/lib/site-data.ts`.
- Produces: `PageEndConversionModel`, `PageEndConversionAction`, and `getPageEndConversion(page: Pick<PageRecord, 'path' | 'section'>): PageEndConversionModel | null`.

- [ ] **Step 1: Write the failing runtime policy tests**

Test these exact route outcomes using real records from `src/data/pages.json`:

- `/products/allplan-professional` and `/solutions/road-railway` → `commercial`, actions `Teklif İste` then `Ücretsiz Deneme`.
- `/package-overview` and `/paket-karsilastirma` → `commercial`.
- `/solutions-v2/training`, `/solutions-v2/training/webinar`, and `/solutions-v2/training/video-library/road-design` → `training`, actions `Eğitim Talebi` then `Teklif İste`.
- `/solutions-v2/connect-license`, `/solutions-v2/connect-license/activation`, `/solutions-v2/connect-login`, and `/solutions-v2/faq` → `support`, one `Destek Platformuna Git` action.
- `/about` and `/references` → `corporate`, one `Teklif İste` action.
- `/`, `/contact`, `/search`, `/health`, `/kvkk`, `/gizlilik-politikasi`, and `/kullanim-sartlari` → `null`.
- Every action URL equals one of the three exported approved URL constants.

- [ ] **Step 2: Run the policy test and verify RED**

Run: `python3 -m unittest tests.test_page_end_conversion -v`

Expected: FAIL because `page-end-conversion-policy.ts` does not exist.

- [ ] **Step 3: Implement the pure policy**

Create these types and function:

```ts
export type PageEndConversionKind = 'commercial' | 'training' | 'support' | 'corporate';
export interface PageEndConversionAction { label: string; href: string; emphasis: 'primary' | 'secondary'; }
export interface PageEndConversionModel { kind: PageEndConversionKind; kicker: string; title: string; description: string; actions: PageEndConversionAction[]; }
export function getPageEndConversion(page: Pick<PageRecord, 'path' | 'section'>): PageEndConversionModel | null;
```

Classification order: hidden routes/sections → training path prefix → support exact/prefix routes → about/references → products, solutions, solutions-v2 and package paths → `null`.

- [ ] **Step 4: Run the policy tests and verify GREEN**

Run: `python3 -m unittest tests.test_page_end_conversion -v`

Expected: all policy cases pass.

- [ ] **Step 5: Commit the policy slice**

```bash
git add src/components/sections/page-end-conversion-policy.ts tests/page_end_conversion_runtime.mjs tests/test_page_end_conversion.py
git commit -m "feat: define page-end conversion policy"
```

### Task 2: Single conversion component and render boundary

**Files:**
- Create: `src/components/sections/PageEndConversion.tsx`
- Modify: `src/components/sections/SubpageView.tsx`
- Modify: `src/components/sections/StructuredPageLayoutSection.tsx`
- Modify: `tests/test_subpage_component_boundaries.py`
- Modify: `tests/test_page_end_conversion.py`

**Interfaces:**
- Consumes: `PageEndConversionModel` and `getPageEndConversion(...)` from Task 1.
- Produces: `PageEndConversion({ model }: { model: PageEndConversionModel }): ReactElement` and one `data-page-end-conversion={model.kind}` section.

- [ ] **Step 1: Write failing component-boundary tests**

Assert:

- `PageEndConversion.tsx` accepts only `model`, renders the kicker/title/description/actions, maps emphasis to existing button classes, and secures external links.
- `SubpageView.tsx` computes `const pageEndConversion = getPageEndConversion(page)` and renders `<PageEndConversion model={pageEndConversion} />` only when non-null.
- `SubpageView.tsx` contains no `global-trial-heading`, no special `training-request-heading`, no `page.contentLinks.map`, and none of the two removed related-links headings.
- `StructuredPageLayoutSection.tsx` no longer accepts/imports `ContentLink`, no longer receives `contentLinks`, and contains none of the removed related-links headings.
- The integration contains exactly one `PageEndConversion` render call.

- [ ] **Step 2: Run component tests and verify RED**

Run: `python3 -m unittest tests.test_page_end_conversion tests.test_subpage_component_boundaries -v`

Expected: FAIL because the component is absent and legacy blocks remain.

- [ ] **Step 3: Implement `PageEndConversion` with existing design-system classes**

Reuse the existing `alu-trial-banner`, `alu-trial-banner__inner`, `alu-stack`, `alu-cluster`, `alu-button`, badge, and icon patterns. Do not add CSS unless an existing class cannot express the approved layout; if CSS is unavoidable, add only semantic-token declarations in `src/styles/application.css` and extend the literal guard test.

- [ ] **Step 4: Replace legacy render paths in `SubpageView`**

Remove:

- The training-only request section.
- The generic page `contentLinks` banner.
- The global trial banner.
- Imports/state derived only for those removed blocks.

Add the single page-end conversion after all visible page body sections and before modal-only DOM. Preserve contact, license declaration, playlist, gallery, modal, schema, and page-data behavior.

- [ ] **Step 5: Remove the structured-page related-links boundary**

Delete the `contentLinks` prop and block from `StructuredPageLayoutSection`; update its caller without touching the structured content order.

- [ ] **Step 6: Run focused tests and typecheck**

Run:

```bash
python3 -m unittest tests.test_page_end_conversion tests.test_subpage_component_boundaries tests.test_forms_transition tests.test_structured_page_layout_boundary -v
pnpm typecheck
```

Expected: all tests and typecheck pass.

- [ ] **Step 7: Commit the component slice**

```bash
git add src/components/sections/PageEndConversion.tsx src/components/sections/SubpageView.tsx src/components/sections/StructuredPageLayoutSection.tsx tests/test_page_end_conversion.py tests/test_subpage_component_boundaries.py
git commit -m "feat: add contextual page-end conversion"
```

### Task 3: Regression, browser acceptance, and handoff

**Files:**
- Modify: `HANDOFF.md`
- Modify only if test evidence requires it: `docs/superpowers/specs/2026-10-27-page-end-conversion-design.md`

**Interfaces:**
- Consumes: completed policy and component from Tasks 1–2.
- Produces: verified local preview and recorded acceptance evidence; no deployment.

- [ ] **Step 1: Run the full local quality gate**

Run:

```bash
pnpm data:generate
git diff --exit-code -- src/data
pnpm test
pnpm typecheck
pnpm build
pnpm audit --prod --audit-level high
```

Expected: generated data unchanged; 120+ unit tests, 36 parity checks, 45 token tests, 188 contrast checks, typecheck, 118-route build, and audit pass.

- [ ] **Step 2: Restore generated Next.js declaration imports if build rewrites them**

Verify `next-env.d.ts` retains:

```ts
import "./.next/dev/types/routes.d.ts";
import "./.next/dev/types/root-params.d.ts";
```

Expected: `git diff --exit-code -- next-env.d.ts` passes.

- [ ] **Step 3: Verify representative routes in the local browser**

Inspect desktop and mobile widths for:

- `/products/allplan-professional` → commercial two-CTA band.
- `/solutions/road-railway` → commercial two-CTA band.
- `/solutions-v2/training` and one playlist → training two-CTA band.
- `/solutions-v2/connect-license` → support single-CTA band.
- `/about` → corporate single-CTA band.
- `/contact` and `/kvkk` → no band.

For every route, verify the related-links headings are absent, the conversion section is directly before the footer in visible flow, links/labels are correct, keyboard focus is visible, and console has no hydration/runtime errors.

- [ ] **Step 4: Update the handoff with implementation and validation evidence**

Record the restore tag, commit IDs, route policy, test counts, browser findings, and explicit no-deployment status.

- [ ] **Step 5: Run independent code and security review**

Review the full branch for route misclassification, duplicate conversion bands, unsafe external links, form/schema drift, and raw design literals. Resolve every Critical/High/Medium finding and rerun affected tests.

- [ ] **Step 6: Commit the verified handoff**

```bash
git add HANDOFF.md
git commit -m "docs: record page-end conversion verification"
```

- [ ] **Step 7: Present the local preview for user acceptance**

Keep the local server running at `http://127.0.0.1:3001/`. Do not push, merge, or deploy until the user has inspected the result and explicitly requests the next delivery step.
