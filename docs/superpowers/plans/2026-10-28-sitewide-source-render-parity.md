# Sitewide source-data-render parity plan

## Spec

- User requirement: fix the proven Bridge/AEC media-role defect and run the same evidence-led parity analysis across every public route.
- Authority: committed live inventory in `docs/00-inventory/content-inventory.json`; copied 2026 source evidence in `docs/00-inventory/interaction-source-evidence/`; approved decisions in existing project docs.
- Boundary: `../aluplan-2026` is read-only. Existing dirty/untracked inventory work is out of scope and must not be edited or committed.
- No push, deploy, or live mutation.

## Global constraints

- Use TDD for every behavior change.
- Regenerate `src/data/*.json`; do not hand-edit generated data.
- Every parity difference must be either a failure or an exact, documented policy exception. No wildcard exceptions.
- Static/data coverage and interactive browser coverage are separate claims.
- Preserve `src/app/next-env.d.ts`.

## Task 1: remove unproven page-video fallbacks

### RED

Create `tests/test_sitewide_media_provenance.py` and prove across all public routes that each top-level page video has native `<video>`/`<source>` evidence in the committed live inventory. Assert Bridge and AEC have no top-level editorial MP4 and retain their correct structured YouTube intro embeds. Assert the five genuine Bridge feature MP4s remain.

Expected command:

```bash
python3 -m unittest tests.test_sitewide_media_provenance -v
```

Expected RED: Bridge and AEC contain generated-only `2024-header.mp4` entries.

### GREEN

- Remove only the two route-specific fallback blocks from `scripts/generate_site_data.py`.
- Run `pnpm data:generate`.
- Confirm the generated diff removes only the two unsupported video records.
- Run the focused test and full `pnpm test`.

Commit: `fix: remove unproven page video fallbacks`

## Task 2: add a 110-route source-to-data contract

### RED

Create:

- `scripts/verify_sitewide_source_parity.py`
- `tests/test_sitewide_source_parity.py`
- `tests/fixtures/sitewide_parity_policy.json`

Tests must exercise controlled fixtures and then the real 110-route dataset. Required dimensions: route set, H1, ordered headings, body text, content links, images/alt, native videos, embeds, local assets, and exact approved transformations. Failures must identify route, dimension, and value/JSON pointer.

Expected command:

```bash
python3 -m unittest tests.test_sitewide_source_parity -v
```

### GREEN

- Implement independent inventory and generated snapshots without importing generator normalization helpers.
- Cover 110 generated routes; classify `/hero-3d` and `/test-webgl` as explicit excluded demo routes.
- Run the verifier and write machine-readable findings under `docs/verification/sitewide-parity-2026-10-28/`.
- Fix only source/live-proven data gaps; record content-decision differences without inventing content.

Commit: `test: add sitewide source data parity contract`

## Task 3: upgrade render audit and verify all routes

### RED

Extend `tests/test_render_audit.py` first. Tests must prove detection of:

- wrong heading order;
- missing source text/link/media/embed;
- unexpected editorial video;
- source intro embed preceded by an unsupported generic gallery;
- non-loopback base URL or redirect;
- missing/duplicate route records.

Expected command:

```bash
python3 -m unittest tests.test_render_audit -v
```

### GREEN

- Upgrade `scripts/audit_render_parity.py` to emit per-route `pass`, `approved_difference`, or `failure` with ordered heading and media evidence.
- Run a local production server and audit all 110 routes.
- Correct every source/live-proven failure by root-cause family, with a new RED test before each implementation fix.
- Produce `render-audit.json` and `README.md` under `docs/verification/sitewide-parity-2026-10-28/`.

Commit: `test: enforce sitewide rendered content parity`

## Task 4: browser acceptance, review, and handoff

- Verify all 110 routes: HTTP 200, one H1, no internal 404, no broken loaded media, expected embed/video identity, and no horizontal overflow at desktop and 390 px.
- Re-run representative interaction contracts: workflow tabs, training tabs, FAQ, references, playlist, media modal/lightbox, theme/mobile menu.
- Run:

```bash
pnpm data:generate
python3 scripts/verify_sitewide_source_parity.py
pnpm test
pnpm typecheck
pnpm build
pnpm audit --prod --audit-level high
```

- Dispatch fresh whole-change code and security reviews. Fix Critical/Important findings with RED-GREEN tests.
- Update `HANDOFF.md` with exact coverage, failures, approved differences, report paths, and remaining human visual acceptance.

Commit: `docs: record sitewide parity verification`

## Review focus

- Source-derived hero/background assets must never appear as editorial content without source evidence.
- The verifier must not validate generated data against expectations derived by the same generator logic.
- URL and asset normalization must be explicit and deterministic.
- Loopback audit must reject external redirects and path traversal.
- Passing build/asset-existence checks must not be reported as semantic content parity.

## Completion contract

- 110/110 public generated routes have a source-data result.
- 110/110 public routes have a render-audit result.
- Bridge and AEC contain the correct intro/YouTube content and no fake generic MP4 gallery.
- Unapproved missing/extra content, link, media, embed, and internal target failures are zero, or are explicitly listed as unresolved user decisions rather than hidden.
- All focused and full verification commands pass.
- No source checkout, remote, or live-site mutation occurred.
