# S06 closure plan

Date: 27.10.2026

Branch: `codex/s06-metrics-tokens`

Authority: `HANDOFF.md`, `docs/PRD.md`, generated content contracts, and the user decision to complete the remaining local workflow without intermediate approval.

## Scope

Finish the local S06 token/component hardening without changing live systems, pushing, deploying, or using `Allplan 2027 Marketing Materials/`. Preserve the source-derived content, URL, media, form, and document contracts.

## Global constraints

- `../aluplan-2026` remains read-only.
- `DEVOPS MASTER WORKFLOW.md` is user-owned and remains untracked.
- Generated data changes must originate in `scripts/generate_site_data.py`; generated JSON is never the sole source edit.
- Every code change follows RED → GREEN, full validation, review, and an atomic Conventional Commit.
- `next-env.d.ts` is restored to its development imports after production builds.
- Local HTTP/render checks are not presented as live deployment proof.

## Tasks

### 1. Correct schema/data relationships

- Emit `/solutions-v2/faq` `FAQPage.mainEntity` from the 25 visible FAQ records, in visible order.
- Give every training `Service` entity a canonical route-specific `@id`.
- Centralize organization/contact identity so visible contact data and Organization JSON-LD share one typed source.
- Tests: FAQ entity count/content/order, unique service IDs, identity parity, schema/theme dependency boundaries.

### 2. Complete content/presentation separation

- Move homepage hero/release/service-group content and service icon keys into generated typed homepage data.
- Move the video-library catalog/subscription content into the generated data layer.
- Derive visible service counts from data rather than hard-coded `20` copy.
- Extract `ProfessionalServicesSection`; keep only page orchestration in `HomepageView`.
- Tests: generator determinism, group membership/counts, catalog target order, data/render boundary contracts.

### 3. Close remaining design-bearing literals

- Replace generated workflow raw colors with semantic accent keys resolved through design tokens.
- Replace numeric JSX z-index with a semantic layer token.
- Classify remaining CSS/TSX literals into tokenized design decisions or exact structural allowlist entries.
- Produce a machine-readable audit and a negative guard that rejects new unclassified design-bearing literals.
- Preserve four theme/mode resolved values.

### 4. Extract the final oversized subpage boundary

- Move the complete structured product/solution renderer into `StructuredPageLayoutSection`.
- Keep modal and reference state controlled in `SubpageView`.
- Preserve DOM order, callout partitioning, content links, URLs, and modal callbacks.
- Acceptance: `SubpageView` below 800 lines plus representative HTML parity.

### 5. Complete keyboard and accessible-name contracts

- Add shared roving-tab keyboard behavior to homepage role tabs, homepage service tabs, references tabs, and legacy subpage tabs.
- Add stable tab/panel relationships and accessible names without changing visible copy.
- Add an accessible name to the search input.
- Tests: helper unit tests plus DOM/source contracts; browser interaction acceptance when an available browser surface permits it.

### 6. Final local acceptance and closure

- Run `pnpm styles:check`, `pnpm test`, `pnpm typecheck`, and `pnpm build`.
- Re-run representative HTML/URL/document checks and all-route audit.
- Obtain one independent whole-branch code review and fix Critical/Important findings once under RED → GREEN.
- Record browser evidence if the Work browser is available. If platform settings still block it, record the exact external acceptance gate rather than fabricating a pass.
- Update this verification record and `HANDOFF.md`; mark S06 locally complete only when all code-controlled gates pass.

## Rulings

- `HomepageView` and `SiteShell` do not require arbitrary line-count splitting. Only the cohesive Professional Services state/content boundary is extracted.
- The S06 literal target is zero **unclassified design-bearing literals**, not zero numeric CSS syntax. Structural zero/percent/auto/aspect-ratio/fr values remain only through a documented allowlist.
- Browser-disabled infrastructure cannot be repaired by product code. It may remain an explicit S07/operator gate after every locally controllable acceptance check is complete.
