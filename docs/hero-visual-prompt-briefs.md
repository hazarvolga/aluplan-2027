# Hero Visual Prompt Briefs

**Date:** 29.10.2026

**Status:** Prompt briefs prepared for review. No image-generation calls have been made in this phase.

**Execution mode after approval:** OpenAI built-in `image_gen`, one call per family asset. The CLI/API fallback is not part of this plan.

## Production objective

Produce the seven missing shared hero-family assets defined in `docs/hero-visual-family-plan.md`. The existing approved `VF-01` Architecture hero is the visual-quality and composition baseline. The outputs must work as long-lived family imagery rather than annual campaign artwork.

## Shared art direction

All seven prompts use the following invariant visual grammar:

- Use case: `stylized-concept`
- Asset: full-bleed website hero background
- Canvas: very wide 16:9 landscape
- Composition: left 45% calm, dark and low-detail for white page copy and CTA controls; primary subject in the center-right/right third
- Crop behavior: important subject must remain recognizable in desktop and mobile crops
- Style: cinematic architectural visualization with photoreal materials and restrained BIM/digital-twin overlays
- Mood: precise, confident, technical and calm; serious European AEC quality
- Palette: deep anthracite, graphite, cool neutral materials and restrained teal-cyan technical accents
- Lighting: controlled blue-hour or dark studio illumination with realistic depth
- No embedded text, logos, trademarks, software UI, laptops, interface panels or watermarks
- No neon cyberpunk treatment, saturated blue wash, impossible geometry, generic stock-photo staging or foreground safety-helmet clichés
- Technical overlays must be integrated into the physical subject, never appear as fake UI
- The left-side transparency transition remains a CSS presentation concern; the image itself should only provide quiet negative space and must not contain a baked-in hard gradient edge

### Responsive presentation contract

The generated image and CSS presentation are reviewed together. “Mobile-safe” is not accepted as an unmeasured prompt claim.

| Target | Preview frame | Asset/presentation rule | Focal and fade rule |
|---|---:|---|---|
| Desktop | `1440×520` | Use the 16:9 master with `background-size: contain`, `background-position: 100% 50%` | Primary subject stays inside source `x=58–96%`, `y=8–92%`; CSS horizontal mask uses the approved `0/28/82/100%` progression |
| Tablet | `1024×520` | Use the same 16:9 master with `background-size: cover` | Per-family focal X starts at `82%`; CSS mask and scrim are previewed before implementation and may be tuned only as presentation tokens |
| Mobile | `390×640` | First create a deterministic `4:5` derivative from the same approved high-resolution original; use the full source height and the right-anchored crop box `x=55–100%`, `y=0–100%`, then resize without changing aspect ratio; do not spend another generation call | Visual occupies the upper hero region with a CSS-owned vertical fade into the page surface; body copy remains below the focal subject rather than covering it |

If the deterministic mobile derivative cannot keep the subject recognizable, that family fails review. A separately generated mobile composition requires a new explicit approval; it is not an automatic extra call.

### Prompt assembly contract

Every built-in `image_gen` call uses the complete family prompt block below. Each block repeats the critical no-gradient/no-UI/no-brand constraints and is self-contained; shared art-direction prose is not assumed to be passed implicitly.

## VF-00 — Ecosystem overview

### Purpose

Shared hero for `/solutions` and `/products`. It must communicate an integrated AEC ecosystem without suggesting that one discipline or product is the primary subject.

### Production prompt

```text
Use case: stylized-concept
Asset type: full-bleed website hero background for an integrated BIM product and solutions ecosystem
Primary request: create a premium multidisciplinary AEC digital-twin scene that connects building design, structural engineering, infrastructure, construction planning and fabrication as one coherent professional ecosystem
Scene/backdrop: one carefully composed master environment where a contemporary building, a restrained transport alignment, structural geometry and a small fabrication/construction zone belong to the same plausible project context; subtle data relationships connect the disciplines without diagrams or interface panels
Subject: the connected project ecosystem rather than one dominant product or discipline
Style/medium: cinematic architectural visualization with photoreal materials and restrained BIM wireframe and parametric overlays, matching the approved Aluplan architecture hero's visual maturity
Composition/framing: very wide 16:9 landscape; keep the left 45 percent calm, dark and low-detail for white webpage copy; place the integrated project model and strongest detail in the center-right and right third; avoid a busy collage; preserve safe desktop and mobile crops
Lighting/mood: controlled blue-hour light, calm technical confidence, realistic atmospheric depth
Color palette: deep anthracite, graphite, cool neutral concrete and glass, restrained teal-cyan technical accents
Materials/textures: believable concrete, steel, glass, terrain and subtle fabrication materials
Text: none
Constraints: one coherent environment, no separated card collage, no hierarchy that makes one discipline look like the only offering, no logos, no trademarks, no software UI, no screens, no readable labels, no watermark; no baked-in gradient, scrim or vignette, natural scene lighting only, CSS owns all fades
Avoid: generic smart-city concept art, neon data network, floating icons, impossible infrastructure, crowded montage, stock-photo people, saturated colors
```

### Acceptance signal

The image reads as “one connected AEC ecosystem” within two seconds and remains neutral enough for both Product and Solution directory pages.

## VF-02 — Infrastructure and Civil

### Purpose

Shared hero for infrastructure, road/rail, bridge and ALLPLAN Civil routes.

### Production prompt

```text
Use case: stylized-concept
Asset type: full-bleed website hero background for infrastructure and civil engineering solutions
Primary request: create a premium civil-infrastructure digital-twin scene showing terrain-aware road and rail alignment connected to a contemporary bridge and engineered landscape
Scene/backdrop: a plausible large-scale terrain corridor with a road and railway following surveyed topography, a bridge crossing in the middle distance, and subtle cut-and-fill and alignment geometry integrated into the landscape
Subject: the coordinated relationship between terrain, transport alignment and bridge engineering
Style/medium: cinematic civil-engineering visualization with photoreal terrain and structures plus restrained survey, alignment and parametric BIM overlays
Composition/framing: very wide 16:9 landscape; keep the left 45 percent calm, dark and low-detail for copy; place the bridge, alignment curves and strongest engineering detail in the center-right and right third; ensure the scene still reads as infrastructure when cropped on mobile
Lighting/mood: controlled blue-hour atmosphere, precise and dependable, subtle depth through terrain layers
Color palette: deep anthracite, graphite rock and asphalt, cool concrete, restrained teal-cyan survey and alignment accents
Materials/textures: credible terrain, concrete, steel, ballast, asphalt and vegetation with realistic scale
Text: none
Constraints: engineering geometry must be plausible; road, railway and bridge must belong to one landscape; no logos, no trademarks, no software UI, no maps with readable labels, no vehicles as the main subject, no watermark; no baked-in gradient, scrim or vignette, natural scene lighting only, CSS owns all fades
Avoid: futuristic megacity, impossible bridge spans, glowing neon roads, generic aerial stock photo, excessive traffic, saturated blue wash
```

### Acceptance signal

The scene represents the entire Infrastructure family, not only Bridge or only Road Design.

## VF-03 — Construction and fabrication

### Purpose

Shared hero for construction planning, precast, steel/SDS2 and site-planning routes.

### Production prompt

```text
Use case: stylized-concept
Asset type: full-bleed website hero background for construction planning and fabrication solutions
Primary request: create a premium constructability and fabrication digital-twin scene connecting site planning, precast production and structural-steel assembly
Scene/backdrop: a plausible organized construction environment where a building frame is assembled from steel and precast elements, with a controlled logistics zone and subtle sequence geometry showing the transition from fabrication data to site installation
Subject: coordinated planning from fabricated component to site assembly
Style/medium: cinematic construction visualization with photoreal steel, concrete and site materials plus restrained BIM sequencing and fabrication overlays
Composition/framing: very wide 16:9 landscape; keep the left 45 percent calm and dark for copy; place the primary frame, precast elements and logistics cues in the center-right/right third; keep cranes and equipment secondary; preserve safe mobile crops
Lighting/mood: controlled early-evening work light, ordered and efficient rather than dramatic or hazardous
Color palette: deep anthracite, graphite steel, neutral precast concrete, restrained teal-cyan technical accents, minimal warm work light
Materials/textures: credible galvanized and painted steel, cast concrete, lifting points, temporary works and ground surfaces
Text: none
Constraints: realistic construction logic and scale; no unsafe work depiction; no logos, no trademarks, no software UI, no readable signage, no foreground workers, no watermark; no baked-in gradient, scrim or vignette, natural scene lighting only, CSS owns all fades
Avoid: generic hard-hat stock photo, chaotic site, sparks and heavy industry drama, oversized cranes, orange-dominated palette, sci-fi factory, impossible connections
```

### Acceptance signal

Precast, steel fabrication and construction sequencing are all visible without the result becoming a collage.

## VF-04 — Add-ons and technical tools

### Purpose

Shared hero for CDS tools, PythonPart, AX3000, Scalypso and the Add-ons family.

### Production prompt

```text
Use case: stylized-concept
Asset type: full-bleed website hero background for BIM add-ons, automation and technical tools
Primary request: create a refined parametric building-detail scene that communicates modular BIM tools, geometry automation, MEP coordination and point-cloud-to-model workflows without displaying software interfaces
Scene/backdrop: one architectural and engineering model fragment where parametric geometry, a restrained MEP network and a subtle point-cloud layer resolve into accurate buildable components
Subject: extensible technical capability added to a core BIM model
Style/medium: premium technical visualization with photoreal component materials, precise geometric construction and restrained digital-twin overlays
Composition/framing: very wide 16:9 landscape; keep the left 45 percent calm, dark and low-detail for copy; place the model fragment and layered technical detail in the center-right and right third; maintain a clean silhouette for mobile crops
Lighting/mood: dark controlled studio environment, precise and quietly innovative
Color palette: deep anthracite, graphite, cool aluminium and concrete, restrained teal-cyan geometry accents
Materials/textures: machined metal, ducts and pipes, concrete, point-cloud particles used sparingly, crisp parametric edges
Text: none
Constraints: no software UI, no code text, no node-editor diagram, no floating app icons, no logos, no trademarks, no screens, no watermark; all technical layers must belong to one model; no baked-in gradient, scrim or vignette, natural scene lighting only, CSS owns all fades
Avoid: holographic dashboard, neon cyberpunk, random glowing cubes, dense particle fog, consumer-tech advertising, impossible MEP routing
```

### Acceptance signal

The image communicates “specialized tools extending BIM” without becoming AX3000-only, Scalypso-only or generic software imagery.

## VF-05 — Complementary and cloud services

### Purpose

Shared hero for complementary solutions, Bimplus, cloud services, BIMFlex, rule/cost/catalog and collaboration routes.

### Production prompt

```text
Use case: stylized-concept
Asset type: full-bleed website hero background for connected BIM services and complementary solutions
Primary request: create a premium federated-project digital-twin scene showing coordinated model information, cloud collaboration and complementary services around one authoritative building model
Scene/backdrop: a sophisticated building and project model on the right, surrounded by a very restrained set of spatial data relationships representing coordination, quantities, rules and shared project information; no screens or dashboards
Subject: one trusted model connected to complementary project services and distributed collaboration
Style/medium: cinematic architectural visualization with photoreal model materials and subtle data-flow and coordination overlays
Composition/framing: very wide 16:9 landscape; keep the left 45 percent calm and dark for copy; place the authoritative model and connection detail in the center-right/right third; connections must remain readable after mobile crop without looking like a network infographic
Lighting/mood: controlled blue-hour/studio hybrid, calm, reliable and connected
Color palette: deep anthracite, graphite, cool neutral model surfaces, restrained teal-cyan connection accents
Materials/textures: believable architectural materials combined with subtle translucent coordination layers
Text: none
Constraints: no cloud icons, no floating documents, no software UI, no laptops, no readable data, no logos, no trademarks, no watermark; convey collaboration spatially rather than through stock-office imagery; no baked-in gradient, scrim or vignette, natural scene lighting only, CSS owns all fades
Avoid: generic cloud-computing stock art, glowing globe, handshake, floating app cards, blockchain aesthetic, neon network overload
```

### Acceptance signal

The image represents collaboration and complementary services while remaining grounded in an actual AEC project model.

## VF-06 — Training, support and knowledge

### Purpose

Shared hero for training, webinar, FAQ, Connect, licensing, support guidance and video-library routes.

### Production prompt

```text
Use case: stylized-concept
Asset type: full-bleed website hero background for professional BIM training, support and technical knowledge
Primary request: create a premium AEC knowledge-transfer scene showing expert guidance around a physical-digital building model, without resembling a generic classroom or call center
Scene/backdrop: a calm professional design studio or technical workshop where two or three specialists on the right review a detailed architectural/engineering model and its restrained digital-twin overlay; faces are not the focal point and no screen content is readable
Subject: practical expert guidance, shared understanding and technical confidence
Style/medium: cinematic editorial architectural visualization with realistic people and materials, restrained BIM overlays and serious professional tone
Composition/framing: very wide 16:9 landscape; keep the left 45 percent calm, dark and low-detail for copy; keep the small expert group and model in the center-right/right third; ensure the scene still reads as guidance and learning in a mobile crop
Lighting/mood: warm-neutral focused studio light within an anthracite environment, approachable but technically rigorous
Color palette: deep anthracite and graphite, cool neutral model materials, restrained teal-cyan technical accents, minimal warm skin and task-light tones
Materials/textures: believable architectural model, drawings without readable text, concrete/wood/metal studio surfaces, natural clothing texture
Text: none
Constraints: authentic professional interaction; no presenter pointing at a blank whiteboard, no call-center headset, no graduation imagery, no branded clothing, no software UI, no interface panels, no readable screens, no logos, no trademarks, no watermark; no baked-in gradient, scrim or vignette, natural scene lighting only, CSS owns all fades
Avoid: generic corporate training stock photo, staged smiling group, classroom rows, customer-service headset, oversized hologram, casual consumer laptop scene
```

### Acceptance signal

The visual can credibly support both Training and Technical Support without suggesting a school, call center or specific event.

## VF-07 — ALLPLAN product platform

### Purpose

Shared permanent hero for ALLPLAN, AEC, Basic, Concept, Professional and Ultimate product routes.

### Production prompt

```text
Use case: stylized-concept
Asset type: full-bleed website hero background for a permanent multidisciplinary BIM product platform
Primary request: create a premium end-to-end building digital twin that communicates progression from concept geometry through architecture, structure, building services and construction-ready detail without using product logos or interface screenshots
Scene/backdrop: one sophisticated building model on the right transitioning through restrained layers: conceptual massing, architectural envelope, structural frame, coordinated MEP and precise buildable detail; all layers belong to the same plausible project
Subject: one scalable multidisciplinary BIM platform supporting increasing levels of project capability
Style/medium: cinematic architectural visualization with photoreal completed materials and carefully integrated technical model layers
Composition/framing: very wide 16:9 landscape; keep the left 45 percent calm, dark and low-detail for product copy; place the layered building model in the center-right/right third; do not divide the image into package tiers or panels; preserve safe desktop and mobile crops
Lighting/mood: controlled blue-hour lighting, mature, dependable and premium
Color palette: deep anthracite, graphite, cool neutral glass/concrete/steel and restrained teal-cyan technical accents
Materials/textures: believable façade, structural steel and concrete, subtle service systems and crisp technical geometry
Text: none
Constraints: no ALLPLAN or Aluplan logo, no trademarks, no package names, no software UI, no laptop, no comparison chart, no floating badges, no readable annotations, no watermark; no baked-in gradient, scrim or vignette, natural scene lighting only, CSS owns all fades
Avoid: feature collage, tiered pricing visual, generic software box art, neon cyberpunk, impossible building geometry, excessive glowing lines
```

### Acceptance signal

The image supports every permanent ALLPLAN package without visually claiming a feature that belongs to only one package.

## Generation and review protocol

1. Generate one candidate for each missing family in this order: `VF-02`, `VF-03`, `VF-04`, `VF-05`, `VF-06`, `VF-07`, `VF-00`.
2. Inspect every candidate for subject accuracy, left copy-safe area, mobile crop and prohibited artifacts before generating the next family.
3. Save every selected high-resolution original under `assets/source/generated/heroes/families/` and record prompt, model/provider, dimensions and SHA-256 in the family manifest.
4. Create optimized web derivatives under `public/assets/heroes/families/`; do not overwrite the originals.
5. Add every selected source and derivative to `docs/brand/assets-license-log.md` with its generated-source status, provider/model, creation date, intended usage and publication-approval state.
6. Build a single local contact-sheet preview showing the existing `VF-01` plus the seven new candidates in the exact desktop, tablet and mobile frames from the responsive presentation contract.
7. Do not connect any new family asset to routes until the contact sheet is approved.
8. If a candidate fails, revise only that family's prompt with one targeted change; do not regenerate unaffected families.

## Review gate

These briefs are ready for art-direction review. Image generation remains blocked until the user approves this prompt set.
