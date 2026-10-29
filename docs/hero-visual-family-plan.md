# Hero Visual Family Plan

**Date:** 29.10.2026

**Status:** Family strategy approved and route table reviewed. The `VF-01` prototype is implemented only on the reference route; seven-family production and sitewide family mapping have not started.

**Scope:** Routes in `src/data/pages.json` whose `section` is `products`, `solutions`, `solutions-v2`, `training` or `video-library`, plus the corresponding navigation families in `src/data/navigation.json`.

**Coverage check:** All **99** routes in scope are explicitly assigned to a visual family; missing route count is `0`.

## Objective

Use a small, durable set of hero visuals instead of producing a different image for every route. A route inherits the visual of its product or solution family. A route-specific image is produced only after a documented exception decision.

This policy changes presentation only. Page content, schema, URLs, CTA targets and information architecture remain independent.

## Approved presentation baseline

- Reference route: `/solutions/architecture`
- Presentation: full hero background, right-aligned focal subject, left-to-right transparency mask, no framed media card.
- The high-resolution source and web derivative remain separate.
- This baseline is currently implemented only on the reference route. The routes below are planning assignments, not active code mappings.

## Visual families

| ID | Visual family | Visual direction | Solution usage | Product usage | New generated visual |
|---|---|---|---|---|---|
| `VF-00` | Ecosystem overview | Disciplines connected through one restrained BIM ecosystem | `/solutions` | `/products` | Yes |
| `VF-01` | Building design | Contemporary building plus BIM/digital-twin transition | Building Design hub and descendants | ALLPLAN architecture/design platform pages | Existing approved prototype is the starting asset |
| `VF-02` | Infrastructure and Civil | Terrain, road/rail alignment and bridge infrastructure in one wide composition | Infrastructure hub and descendants | ALLPLAN Civil | Yes |
| `VF-03` | Construction and fabrication | Construction planning joined with precast and steel fabrication | Construction Planning hub and descendants | Precast and SDS2 | Yes |
| `VF-04` | Add-ons and technical tools | Modular technical tool ecosystem; geometry, MEP and point-cloud cues | Add-ons hub, CDS, PythonPart, AX3000 and Scalypso | AX3000 | Yes |
| `VF-05` | Complementary and cloud services | Connected project data, collaboration and complementary services | Other Solutions hub and cloud-related solution pages | Bimplus and Cloud Services | Yes |
| `VF-06` | Training, support and knowledge | Expert guidance, learning and digital support without generic classroom stock imagery | Training, Connect, FAQ and guidance routes | Technical document hubs | Yes |
| `VF-07` | ALLPLAN product platform | A neutral multidisciplinary model representing the permanent ALLPLAN package system | — | ALLPLAN platform, AEC, Basic, Concept, Professional and Ultimate | Yes |
| `VF-08` | Annual release | Release-specific official content; not a timeless family illustration | — | Annual release and release-feature routes | No initial generation; preserve official/source media until the 2027 material decision |

Initial asset target: **8 family assets** (`VF-00`–`VF-07`): **1 existing approved starting asset** (`VF-01`) and **7 new assets to generate**. `VF-08` initially uses approved official/source assets, so it does not add image-generation cost.

## Route assignment — Solutions

| Family | Routes | Policy |
|---|---|---|
| `VF-00` Ecosystem overview | `/solutions` | Shared directory visual |
| `VF-01` Building design | `/solutions-v2/building-design`, `/solutions/architecture`, `/solutions/structural`, `/solutions/mep`, `/solutions/allplan-industry` | One shared family visual. `/solutions/architecture` remains the approved reference implementation. |
| `VF-02` Infrastructure and Civil | `/solutions-v2/infrastructure`, `/solutions/infrastructure`, `/solutions/road-railway`, `/solutions/bridge-design`, `/solutions/features-allplan-bridge`, `/solutions/modeling-of-precast-girder-bridges` | One shared family visual by default. Bridge pages are exception candidates only if the shared composition proves semantically insufficient. |
| `VF-03` Construction and fabrication | `/solutions-v2/construction`, `/solutions/precast`, `/solutions/steel`, `/solutions/site-planning` | One shared construction/fabrication visual |
| `VF-04` Add-ons and technical tools | `/solutions-v2/addons`, `/solutions/cds-addon`, `/solutions/pythonpart`, `/solutions/ax3000`, `/solutions/ax3000-mekanik-tesisat`, `/solutions/ax3000-virtual-reality`, `/solutions/ax3000-yapi-fizigi`, `/solutions/ax3000/elektrik`, `/solutions/ax3000/havalandirma`, `/solutions/ax3000/isitma`, `/solutions/ax3000/konut-havalandirma`, `/solutions/ax3000/sihhi-tesisat`, `/solutions/ax3000/sprinkler`, `/solutions/scalypso`, `/solutions/scalypso/converter`, `/solutions/scalypso/mobile`, `/solutions/scalypso/modeler`, `/solutions/scalypso/videos`, `/solutions/scalypso/viewer`, `/solutions/addons`, `/solutions/addons/2d-dwg-converter`, `/solutions/addons/drive-curve`, `/solutions/addons/geometry-tools`, `/solutions/addons/graphical-text`, `/solutions/addons/parametric-terrain`, `/solutions/addons/ramp`, `/solutions/addons/sketchup-converter`, `/solutions/addons/steel-components`, `/solutions/addons/three-dimensioning` | One modular tools visual initially. AX3000 and Scalypso are review candidates, not automatic exceptions. |
| `VF-05` Complementary and cloud services | `/solutions-v2/other`, `/solutions/bimflex`, `/solutions/rebar-engineering`, `/solutions/imar-yonetmeligi-bim-eklentisi`, `/solutions/bimx5`, `/solutions/oska`, `/solutions/poz-catalog`, `/solutions/allplan-bulut-hizmetleri` | Shared ecosystem/service visual |
| `VF-06` Training, support and knowledge | `/solutions-v2/connect-license`, `/solutions-v2/connect-license/activation`, `/solutions-v2/connect-license/how-to-assign`, `/solutions-v2/connect-login`, `/solutions-v2/faq`, `/solutions-v2/training`, `/solutions-v2/training/classroom`, `/solutions-v2/training/e-learning`, `/solutions-v2/training/events`, `/solutions-v2/training/individual`, `/solutions-v2/training/online`, `/solutions-v2/training/quick-start`, `/solutions-v2/training/video-library`, `/solutions-v2/training/webinar` and all video playlist routes listed below | Shared expertise visual for heroes. Form, FAQ, tabs, playlist thumbnails and other body behaviors remain unchanged. |

### Video playlist routes

The following routes belong to `VF-06` by default. Their video/playlist thumbnails remain content inside the page body; this does not make the hero a route-specific exception. A special hero can be retained only after a separate exception decision:

- `/solutions-v2/training/video-library/addon-geometry`
- `/solutions-v2/training/video-library/allplan-reinforcement`
- `/solutions-v2/training/video-library/ax3000`
- `/solutions-v2/training/video-library/bridge-workflow-2022`
- `/solutions-v2/training/video-library/bridge-workflows`
- `/solutions-v2/training/video-library/campus-de`
- `/solutions-v2/training/video-library/campus-en`
- `/solutions-v2/training/video-library/campus-tutorials-2019-2022`
- `/solutions-v2/training/video-library/hello-allplan-2024`
- `/solutions-v2/training/video-library/konut-insaati`
- `/solutions-v2/training/video-library/otomatik-donati`
- `/solutions-v2/training/video-library/quickstart-buildings`
- `/solutions-v2/training/video-library/road-design`
- `/solutions-v2/training/video-library/sds2-intro`

## Route assignment — Products

| Family | Routes | Policy |
|---|---|---|
| `VF-00` Ecosystem overview | `/products` | Shared product-directory visual |
| `VF-01` Building design | `/products/architecture` | Reuse Building Design family visual |
| `VF-02` Infrastructure and Civil | `/products/civil` | Reuse Infrastructure family visual |
| `VF-03` Construction and fabrication | `/products/precast`, `/products/precast-detail`, `/products/sds2-home` | Reuse Construction/Fabrication family visual |
| `VF-04` Add-ons and technical tools | `/products/ax3000` | Reuse Add-ons family visual |
| `VF-05` Complementary and cloud services | `/products/allplan-bimplus`, `/products/allplan-cloud-services` | Reuse Complementary/Cloud family visual |
| `VF-06` Training, support and knowledge | `/products/ax3000/dokumanlar` | Use the expertise family for the document hub; document covers remain content assets, not hero-family assets |
| `VF-07` ALLPLAN product platform | `/products/allplan`, `/products/allplan-aec`, `/products/allplan-basic`, `/products/allplan-concept`, `/products/allplan-professional`, `/products/allplan-ultimate` | One shared permanent-product visual |
| `VF-08` Annual release | `/products/allplan-2026`, `/products/allplan-2026-yenilikler` | Preserve source/official release media now. Replace the family assignment only when approved 2027 materials are introduced. |

## Exception rule

A route receives a unique hero visual only when at least one condition is documented:

1. The shared family image materially misrepresents the page subject.
2. The page is a strategic product/release landing page with approved official campaign assets.
3. The page needs a demonstrably different visual for conversion or comprehension.
4. The shared image fails responsive cropping or accessibility requirements on that route.

Product name alone is not sufficient reason for a unique image.

## Target asset and implementation contract

- At sitewide rollout, high-resolution originals: `assets/source/generated/heroes/families/`
- At sitewide rollout, web derivatives: `public/assets/heroes/families/`
- Every family asset records prompt, model, dimensions and SHA-256 in a local manifest.
- Before sitewide rollout, the approved `VF-01` prototype is moved from its current prototype paths into the family asset structure and its references are updated atomically. The current files are not moved during planning.
- A route-to-family policy module will own presentation mapping; content records and schema will not contain visual-theme decisions.
- Hero layout remains one shared component. Route policy supplies only family ID and asset path.
- Mobile crops, dark/light modes, reduced motion, contrast and loading behavior are verified before family-wide rollout.
- No route receives the family visual until its contact-sheet preview is approved.

## Production order

1. Create prompt briefs for the seven missing families (`VF-00`, `VF-02`–`VF-07`) using one shared art-direction grammar and document how the approved `VF-01` fits that grammar.
2. Generate one high-resolution candidate for each of the seven missing families.
3. Build a contact-sheet preview with desktop and mobile hero crops.
4. Obtain visual approval or mark a family for one revision.
5. Implement the central route-to-family policy.
6. Run route coverage, render parity and browser checks across all assigned routes.

## Current state

The approved family strategy and its 99-route table have passed technical review. **No new family image generation, route mapping code or sitewide hero change has been performed by this document update.** The next phase is prompt-brief preparation for the seven missing family assets.
