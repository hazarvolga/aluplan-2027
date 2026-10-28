# Rota haritası (Aşama C)

Kaynak: `src/data/pages.json` (110 canlı rota; envanter doğrulaması 28.10.2026).
Bu doküman envanterin hedef rota kararı ile yeni rota önerilerini tutar.

## 2027 içeriği etkilenen mevcut rotalar

| Rota | 2027 envanter kaynağı |
|---|---|
| `/products/allplan` | `allplan-home`, `allplan-editions` (ürün bölümü) |
| `/products/allplan-basic` | `allplan-editions` |
| `/products/allplan-concept` | `allplan-editions` |
| `/products/allplan-professional` | `allplan-editions` |
| `/products/allplan-ultimate` | `allplan-editions` |
| `/products/allplan-bimplus` | `allplan-bimplus` |
| `/products/civil` | `allplan-civil` |
| `/products/sds2-home` | `sds2` |
| `/solutions/infrastructure` | `allplan-civil` (slayt + yeni metin) |
| `/solutions/road-railway` | `allplan-civil` (slayt) |
| `/solutions/bridge-design` | `allplan-civil` (slayt) |
| `/solutions/steel` | `sds2` (slayt) |
| `/` | `allplan-home` / `allplan-max` / `allplan-civil` / `sds2` slaytlarından hero seçilir |
| `/products` | yeni ürün rotalarının menüye eklenmesi |
| `/solutions/features-allplan-bridge` | `allplan-parametric` ile çakışma kararı gerekir |
| `/solutions/rebar-engineering` | `allplan-rebar` ile çakışma kararı gerekir |
| `/solutions/structural` | `allplan-rebar` ile çakışma kararı gerekir |

## Önerilen yeni rotalar

| Rota | Envanter | Mevcut karşılık |
|---|---|---|
| `/products/allplan-parametric` | `allplan-parametric` | yok (yeni) |
| `/products/allplan-rebar` | `allplan-rebar` | yok (yeni) |
| `/products/allplan-max` | `allplan-max` | yok (yeni; sürüm sayfalarındaki Max bölümü ile çakışma) |
| `/products/frilo` | `frilo-editions` | yok — FRILO bugün hiç yok |
| `/products/scia` | `scia-editions` | yok — SCIA bugün hiç yok |

Not: FRILO/SCIA için tek sayfa mı, sürüm başına sayfa mı açık karardır;
bkz. `open-decisions.md`.

## Etkilenmeyen mevcut rotalar

Kalan **93** rota 2027 lansman içeriğinden etkilenmez:

`/about`, `/contact`, `/gizlilik-politikasi`, `/health`, `/kullanim-sartlari`, `/kvkk`, `/package-overview`, `/paket-karsilastirma`, `/products/allplan-2026`, `/products/allplan-2026-yenilikler`, `/products/allplan-aec`, `/products/allplan-cloud-services`, `/products/architecture`, `/products/ax3000`, `/products/ax3000/dokumanlar`, `/products/precast`, `/products/precast-detail`, `/references`, `/search`, `/solutions`, `/solutions-v2/addons`, `/solutions-v2/building-design`, `/solutions-v2/connect-license`, `/solutions-v2/connect-license/activation`, `/solutions-v2/connect-license/how-to-assign`, `/solutions-v2/connect-login`, `/solutions-v2/construction`, `/solutions-v2/faq`, `/solutions-v2/infrastructure`, `/solutions-v2/other`, `/solutions-v2/training`, `/solutions-v2/training/classroom`, `/solutions-v2/training/e-learning`, `/solutions-v2/training/events`, `/solutions-v2/training/individual`, `/solutions-v2/training/online`, `/solutions-v2/training/quick-start`, `/solutions-v2/training/video-library`, `/solutions-v2/training/video-library/addon-geometry`, `/solutions-v2/training/video-library/allplan-reinforcement`, `/solutions-v2/training/video-library/ax3000`, `/solutions-v2/training/video-library/bridge-workflow-2022`, `/solutions-v2/training/video-library/bridge-workflows`, `/solutions-v2/training/video-library/campus-de`, `/solutions-v2/training/video-library/campus-en`, `/solutions-v2/training/video-library/campus-tutorials-2019-2022`, `/solutions-v2/training/video-library/hello-allplan-2024`, `/solutions-v2/training/video-library/konut-insaati`, `/solutions-v2/training/video-library/otomatik-donati`, `/solutions-v2/training/video-library/quickstart-buildings`, `/solutions-v2/training/video-library/road-design`, `/solutions-v2/training/video-library/sds2-intro`, `/solutions-v2/training/webinar`, `/solutions/addons`, `/solutions/addons/2d-dwg-converter`, `/solutions/addons/drive-curve`, `/solutions/addons/geometry-tools`, `/solutions/addons/graphical-text`, `/solutions/addons/parametric-terrain`, `/solutions/addons/ramp`, `/solutions/addons/sketchup-converter`, `/solutions/addons/steel-components`, `/solutions/addons/three-dimensioning`, `/solutions/allplan-bulut-hizmetleri`, `/solutions/allplan-industry`, `/solutions/architecture`, `/solutions/ax3000`, `/solutions/ax3000-mekanik-tesisat`, `/solutions/ax3000-virtual-reality`, `/solutions/ax3000-yapi-fizigi`, `/solutions/ax3000/elektrik`, `/solutions/ax3000/havalandirma`, `/solutions/ax3000/isitma`, `/solutions/ax3000/konut-havalandirma`, `/solutions/ax3000/sihhi-tesisat`, `/solutions/ax3000/sprinkler`, `/solutions/bimflex`, `/solutions/bimx5`, `/solutions/cds-addon`, `/solutions/imar-yonetmeligi-bim-eklentisi`, `/solutions/mep`, `/solutions/modeling-of-precast-girder-bridges`, `/solutions/oska`, `/solutions/poz-catalog`, `/solutions/precast`, `/solutions/pythonpart`, `/solutions/scalypso`, `/solutions/scalypso/converter`, `/solutions/scalypso/mobile`, `/solutions/scalypso/modeler`, `/solutions/scalypso/videos`, `/solutions/scalypso/viewer`, `/solutions/site-planning`

Sayım notu: yukarıdaki tablo ve yeni rota
listesi dışında hiçbir rota değişmiyor; benzersiz mevcut rota sayısı 110.