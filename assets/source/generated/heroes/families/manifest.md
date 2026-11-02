# Hero Family Asset Manifest

**Created:** 29.10.2026
**Generation mode:** OpenAI built-in `image_gen`; one call per new family candidate
**Prompt source:** `docs/hero-visual-prompt-briefs.md`

High-resolution PNG originals are retained in this folder. JPEG desktop and deterministic mobile derivatives are stored under `public/assets/heroes/families/`. No family derivative is connected to a production route at this stage.

The machine-readable crop and encoding contract is `crop-recipes.json`. Crop
coordinates are expressed in source pixels with a top-left origin; every mobile
crop is full-height and right-anchored (`x + width = source width`).

## Source originals

| ID | File | Dimensions | Bytes | SHA-256 | Review state |
|---|---|---:|---:|---|---|
| `VF-00` | `vf-00-ecosystem-overview-original.png` | 1983×793 | 2,558,309 | `2a7c4f89d5b78b848e845b0d55d3db7ec564b448d616aa3f409b5f45b2a154dd` | Candidate accepted for contact sheet |
| `VF-01` | `vf-01-building-design-original.png` | 1672×941 | 2,400,718 | `7f22f72d170fc70f40ff15ace22c1399c015d31deb6e9395b1f99f75c3f3dfea` | Existing approved reference copied into family archive |
| `VF-02` | `vf-02-infrastructure-civil-original.png` | 1672×941 | 2,644,193 | `3e3978a9f4e8f8fceecedda2ba216bf0738671db7015ed1eba8507ad8bc5ce70` | Candidate accepted for contact sheet |
| `VF-03` | `vf-03-construction-fabrication-original.png` | 1672×941 | 2,574,103 | `697475101e0ffb6928bd39e486f772e3f137d1e2879fea9c4a455ad3d84d25ee` | Candidate accepted for contact sheet |
| `VF-04` | `vf-04-addons-technical-tools-original.png` | 1672×941 | 2,534,666 | `5fc2762c66c783f1c65dd102110792a40a04e1eeda26d6e8adf079631f62b887` | Candidate accepted for contact sheet |
| `VF-05` | `vf-05-complementary-cloud-original.png` | 1983×793 | 2,469,291 | `c60e24c8c2a1c8d154525711960d2f6553272ab3c6c0ebbd0e1a33968b3084bd` | Contact-sheet review required: possible visual overlap with `VF-07` |
| `VF-06` | `vf-06-training-support-knowledge-original.png` | 1672×941 | 2,032,824 | `c96980b1c73fe0a4b547f448c729b6d310f6586c2dc0ea35771e254998837b2b` | Candidate accepted for contact sheet |
| `VF-07` | `vf-07-allplan-product-platform-original.png` | 1672×941 | 2,599,060 | `252761eb374fe44352e653c0644be228273e3329d307b26c83fc7485587fc36b` | Candidate accepted for contact sheet |

## Desktop derivatives

| ID | Public file | Dimensions | Bytes | SHA-256 |
|---|---|---:|---:|---|
| `VF-00` | `vf-00-ecosystem-overview.jpg` | 1410×793 | 443,427 | `5ae78ee3abc82f427b599d6ab3e54d12346f6c61183fe89cc843ddcdedfdd4e6` |
| `VF-01` | `vf-01-building-design.jpg` | 1672×941 | 502,430 | `0aef85779f99fd5dc7798a0ea8640bee3475ebb5271fd4f8ae5bf1f40b490ebd` |
| `VF-02` | `vf-02-infrastructure-civil.jpg` | 1672×941 | 546,038 | `8d6084a3634db68a59523d8dd5ed9dbe187b26703741365b6c1d24d3308d629e` |
| `VF-03` | `vf-03-construction-fabrication.jpg` | 1672×941 | 580,112 | `8b925969eb5454f4c54b5dd9daf2e9034c355d7feb724d7559011e987f7fbe11` |
| `VF-04` | `vf-04-addons-technical-tools.jpg` | 1672×941 | 515,633 | `cf1ff6bf12653c6cd762553a7eed100809ba30530828d94676c91eb414adc19e` |
| `VF-05` | `vf-05-complementary-cloud.jpg` | 1410×793 | 428,217 | `f7e1c7fe93cc35675a5c32e596bc40f30fea7928d6d350dfae0fd586c85de68a` |
| `VF-06` | `vf-06-training-support-knowledge.jpg` | 1672×941 | 366,115 | `2e3f48938d57e55eeee15095274ec0877707d3da4b64fe6dea79cf24b90fe1e0` |
| `VF-07` | `vf-07-allplan-product-platform.jpg` | 1672×941 | 577,625 | `62191b9968457b36a6b1297166830f327344052892b4c36f4480ebcffaebb516` |

## Mobile derivatives

Mobile derivatives use the approved full-height, right-anchored 4:5 crop. The wider `VF-00` and `VF-05` outputs are first cropped to a right-anchored 16:9 master, then receive the same 4:5 crop rule.

| ID | Public file | Dimensions | Bytes | SHA-256 |
|---|---|---:|---:|---|
| `VF-00` | `vf-00-ecosystem-overview-mobile.jpg` | 634×793 | 240,030 | `548ede82676f0e46220918b22b3ec3a5e8899f84b232df53f5bf002f9d3386eb` |
| `VF-01` | `vf-01-building-design-mobile.jpg` | 753×941 | 311,898 | `37e86e17eb92c16ca0f6d071d84a51c56904d92db6b73446d6564bf5141e4f2a` |
| `VF-02` | `vf-02-infrastructure-civil-mobile.jpg` | 753×941 | 349,031 | `1819f1de7572eb361142d4953c32765faf8dd86665ec1c1cb2a12bf9e8bfe722` |
| `VF-03` | `vf-03-construction-fabrication-mobile.jpg` | 753×941 | 336,060 | `11da82e4eb874749c8fd43829fa04c0e1d475d58b14c6e152ef15f42054f8318` |
| `VF-04` | `vf-04-addons-technical-tools-mobile.jpg` | 753×941 | 364,285 | `1ba75ac98e446ac9cad380b4eb3e8bf9339b491c63462d1d7ac8457f55cb0350` |
| `VF-05` | `vf-05-complementary-cloud-mobile.jpg` | 634×793 | 230,782 | `e1880955dbffa091c7514e14bedc5658e1d1de208197c32e8ceb3ec90c635a8e` |
| `VF-06` | `vf-06-training-support-knowledge-mobile.jpg` | 753×941 | 229,959 | `906306c8918233b57e7ac0c9953d52f996d286ab291ac2ee9dd4dc624c67726e` |
| `VF-07` | `vf-07-allplan-product-platform-mobile.jpg` | 753×941 | 353,742 | `3ecdda939cc1416d7895edb92d390f2e6a475ca8a9527a0b073663ac0c446bb0` |

## Generation assessment

- All seven new first-call candidates satisfy the no-logo, no-readable-text and no-software-UI constraints.
- `VF-00`, `VF-02`, `VF-03`, `VF-04`, `VF-06` and `VF-07` are semantically distinct at first review.
- `VF-05` is technically valid but may be too visually close to the building/product-platform families. It remains an approval decision; no automatic second generation was used.
- Contact-sheet preview: `docs/previews/hero-family-contact-sheet/index.html`.
