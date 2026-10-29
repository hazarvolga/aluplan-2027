# ALLPLAN Civil — canlı sayfa içerik envanteri

- **URL:** `https://www.allplan.com/products/allplan-civil/`
- **DOM başlığı:** `ALLPLAN Civil`
- **Çıkarım:** 29.10.2026, render edilmiş DOM; görsel sıralama (y) ekrandaki yer
  bilgisidir. Footer (y≥19829) kapsam dışıdır.
- **Gizli karusel içeriği:** zorluk karuseli (4 slayt) ve başarı hikâyeleri
  karuseli ekranın dışında (x<0 veya x>1000) konumlanır; içerikleri birebir
  kaydedilmiştir. Müşteri sözü karuseli 3 kartlık bir şerittir.
- **Görseller ve videolar:** `media/allplan-civil/` — 58 görsel indirildi
  (hero, ikonlar, ürün görselleri, müşteri portreleri, başarı kartları).
  Manifest: `media/manifest.md`.

`EN` sütunu canlı sayfadan **birebir** alınmıştır — kaynaktaki yazım
hataları dahil (bkz. "Kaynak notları"). `TR` kolonu **taslaktır**.

---

## Hero

| ID | Rol | Konum | EN (birebir) | TR (taslak) |
|---|---|---|---|---|
| `live.civ.hero.eyebrow` | Eyebrow | y754 | ALLPLAN Civil | ALLPLAN Civil |
| `live.civ.hero.title` | H1 | y782 | FOR ADVANCED INFRASTRUCTURE DESIGN TO BUILD WORKFLOWS | İLERİ ALTYAPI TASARIM-YAPIM İŞ AKIŞLARI İÇİN |
| `live.civ.hero.cta` | CTA | y944 | free trial → `https://www.allplan.com/trial-or-subscription/` (canlıda düğme etiketi "free trial") | Ücretsiz deneme |
| `live.civ.hero.image` | Görsel | y161 | `images/csm_2025_Header_Civil_1440x580_6de5a86993.jpg` | — |

## "What is ALLPLAN Civil?"

| ID | Rol | Konum | EN (birebir) | TR (taslak) |
|---|---|---|---|---|
| `live.civ.what.title` | Bölüm başlığı | y1135 | What is ALLPLAN Civil? | ALLPLAN Civil nedir? |
| `live.civ.what.body` | Bölüm metni | y1185 | ALLPLAN Civil is the ultimate solution from ALLPLAN for advanced infrastructure design to build workflows that supports the complete process of design and construction in multi-disciplinary and civil engineering consultancies, building and civil engineering contracting companies. | ALLPLAN Civil, çok disiplinli ve sivil mühendislik müşavirlik firmalarında, bina ve sivil mühendislik yüklenicilerinde tasarım ve inşaatın tüm sürecini destekleyen, ileri altyapı tasarım-yapım iş akışlarına yönelik ALLPLAN'ın flagman çözümüdür. |
| `live.civ.what.plus` | Alt metin | y1301 | All features of ALLPLAN Ultimate plus: | ALLPLAN Ultimate'ın tüm özellikleri artı: |
| `live.civ.what.bullet-1` | Madde | y1357 | Integrated bridge structural analysis | Bütünleşik köprü statik çözümü |
| `live.civ.what.bullet-2` | Madde | y1387 | Reinforcement design and code checking | Donatı tasarımı ve norm kontrolü |
| `live.civ.what.cta-1` | CTA | y1438 | View editions → `/package-overview/` | Sürümleri görün |
| `live.civ.what.cta-2` | CTA | y1508 | Workflows for bridge engineering → `/industry-solutions/bridge-engineering-software/` | Köprü mühendisliği iş akışları |
| `live.civ.what.cta-3` | CTA | y1508 | Workflows for civil engineering → `/industry-solutions/civil-engineering-software/` | Sivil mühendislik iş akışları |

## Zorluk karuseli (4 slayt, yatay bant)

| ID | Rol | Konum | EN (birebir) | TR (taslak) |
|---|---|---|---|---|
| `live.civ.chal.title` | Bölüm başlığı | y2291 | DO YOU CONSTANTLY STRUGGLE WITH THE FOLLOWING CHALLENGES? | SİZ DE ŞU ZORLUKLARLA SÜREKLİ MÜCADELE EDİYOR MUSUNUZ? |
| `live.civ.chal-1` | Slayt / h3 | bant (x110) | Constantly re-entering the same data over and over again in your projects taking up your design time. | Aynı verileri projelerinizde sürekli defalarca yeniden girmek tasarım zamanınızı alıyor. |
| `live.civ.chal-2` | Slayt / h3 | bant (x525) | Inconsistent design data from different data sources and formats from different parties involved. | Farklı taraflardan gelen farklı veri kaynak ve formatlarından tutarsız tasarım verisi. |
| `live.civ.chal-3` | Slayt / h3 | bant (x940) | Numerous time-consuming design modifications lead to inconsistencies and poor design quality. | Sayısız, zaman alan tasarım değişikliği tutarsızlığa ve zayıf tasarım kalitesine yol açıyor. |
| `live.civ.chal-4` | Slayt / h3 | bant (x1355) | Due to lack of time, bridge designers can't create as many design variants as they would need to find the best solution. | Zaman eksikliği nedeniyle köprü tasarımcıları en iyi çözümü bulmak için ihtiyaç duydukları kadar çok tasarım varyantı oluşturamıyor. |

**Not:** slayt 5-7 DOM'da karusel klonu olarak aynı metinleri tekrar eder
(x1770+); chaque slaytın görselinde metin işlenmiş — ayrıca kayıt gerekmiyor.

## "HOW ALLPLAN BENEFITS YOUR BUSINESS" (istatistik bandı)

| ID | Rol | Konum | EN (birebir) | TR (taslak) |
|---|---|---|---|---|
| `live.civ.stat.title` | Bölüm başlığı | y2653 | HOW ALLPLAN BENEFITS YOUR BUSINESS | ALLPLAN İŞİNİZE NASIL FAYDA SAĞLAR |
| `live.civ.stat-1.value` | İstatistik | y2713 | 100%ConsistentData | **kaynak hatası:** boşluk yok — %100 tutarlı veri |
| `live.civ.stat-1.body` | İstatistik metni | y2773 | because everything is accomplished with one software solution – the common data environment minimizes unnecessary data exchange and re-entry between different solutions. | çünkü her şey tek bir yazılım çözümüyle yapılır – ortak veri ortamı farklı çözümler arasındaki gereksiz veri alışverişini ve yeniden girişi en aza indirir. |
| `live.civ.stat-2.value` | İstatistik | y2713 | 63%MoreTime | **kaynak hatası:** boşluk yok — %63 daha az zaman (metin "More Time" der ama içerik zamanı azaltmadır) |
| `live.civ.stat-2.body` | İstatistik metni | y2773 | time saving through adaption of project templates and model modifications that occur throughout the entire design phase that are made quickly, easily and reliably. | proje şablonlarının uyarlanması ve tüm tasarım evresi boyunca ortaya çıkan, hızlı, kolay ve güvenilir yapılan model değişiklikleriyle zaman tasarrufu. |
| `live.civ.stat-3.value` | İstatistik | y2853 | 100%MorePrecise | **kaynak hatası:** boşluk yok — %100 daha kesin |
| `live.civ.stat-3.body` | İstatistik metni | y2912 | precise modeling due to modeling techniques which are tailored for bridges and workflows for different bridge types, such as precast girder bridges. | köprüler için özelleştirilmiş modelleme teknikleri ve öndökümlü kiriş köprü gibi farklı köprü türlerine uygun iş akışları sayesinde kesin modelleme. |
| `live.civ.stat-4.value` | İstatistik | y2853 | 100%MoreEfficiency | **kaynak hatası:** boşluk yok — %100 daha fazla verimlilik |
| `live.civ.stat-4.body` | İstatistik metni | y2912 | reuse of data as a result of the parametric model description - modeled bridge elements, e.g. a pier, can be saved as template and reused in subsequent projects. | parametrik model tanımının sonucunda verinin yeniden kullanımı – modellenen köprü öğeleri (ör. mesnet ayak) şablon olarak kaydedilip sonraki projelerde tekrar kullanılabilir. |

## Benefits of ALLPLAN Civil (8 hücre)

| ID | Rol | Konum | EN (birebir) | TR (taslak) |
|---|---|---|---|---|
| `live.civ.ben.title` | Bölüm başlığı | y3071 | Benefits of ALLPLAN Civil | ALLPLAN Civil'in faydaları |
| `live.civ.ben.road.label` | Hücre başlığı | y3131 | Parametric Road Modeling | Parametrik yol modelleme |
| `live.civ.ben.road.body` | Hücre metni | y3196 | Powerful and easy-to-use modeling functions for the integration of road designs in your building and infrastructure projects. | Yol tasarımlarını bina ve altyapı projelerinize entegre eden güçlü ve kullanımı kolay modelleme işlevleri. |
| `live.civ.ben.rebar.label` | Hücre başlığı | y3131 | Precise3D Reinforcement | **kaynak hatası:** boşluk yok — Kesin 3B donatı |
| `live.civ.ben.rebar.body` | Hücre metni | y3200 | Automated solutions for the rapid design and detailing of reinforcement requirements, saving significant time and ensuring quality. | Donatı gereksinimlerinin hızlı tasarımı ve detaylandırılması için otomatik çözümler; önemli zaman kazandırır, kaliteyi sağlar. |
| `live.civ.ben.onesolution.label` | Hücre başlığı | y3280 | OneSolution for All Tasks | **kaynak hatası:** boşluk yok — Tüm görevler için tek çözüm |
| `live.civ.ben.onesolution.body` | Hücre metni | y3344 | Work with a single solution from parametric model creation with a high level of detail, including prestressing, to integration of the construction process and structural analysis of the bridge model, including reinforcement design and code checking. | Preload dahil yüksek detaylı parametrik model oluşturmaktan inşaat sürecinin entegrasyonuna ve donatı tasarımı ile norm kontrolü dahil köprü modelinin statik çözümüne kadar tek bir çözümle çalışın. |
| `live.civ.ben.variants.label` | Hücre başlığı | y3280 | Quickly CreateVariants and Templates | **kaynak hatası:** boşluk yok — Hızlı varyant ve şablon oluşturma |
| `live.civ.ben.variants.body` | Hücre metni | y3340 | The 3D parametric model description considers the road layout, bridge alignment and required cross-sections, making model configuration and variation fast and easy. This can be done either directly in the software or even via scripting. | 3B parametrik model tanımı yol düzenini, köprü güzergâhını ve gerekli kesitleri hesaba katar; model yapılandırma ve varyasyon hızlı ve kolaydır. Bu doğrudan yazılımda veya betiklemeyle yapılabilir. |
| `live.civ.ben.analysis.label` | Hücre başlığı | y3424 | Integrated Structural Analysis | Bütünleşik statik çözüm |
| `live.civ.ben.analysis.body` | Hücre metni | y3490 | ALLPLAN automatically generates the analysis model from the geometrical model and all the calculation actions from the defined construction sequence. This greatly reduces the amount of work and susceptibility to errors. | ALLPLAN geometrik modelden çözüm modelini ve tanımlı inşaat dizisinden tüm hesap eylemlerini otomatik üretir. İş miktarını ve hata duyarlılığını büyük ölçüde azaltır. |
| `live.civ.ben.code.label` | Hücre başlığı | y3424 | Code-based Design | Norm tabanlı tasarım |
| `live.civ.ben.code.body` | Hücre metni | y3500 | All permanent and variable loads are combined between each other into a final envelope. This envelope is used to perform reinforcement design and code checking. | Tüm sabit ve değişken yükler birbirleriyle birleştirilerek son zarfa kaydedilir. Bu zarf donatı tasarımı ve norm kontrolünde kullanılır. |
| `live.civ.ben.changes.label` | Hücre başlığı | y3580 | Easily Implement Changes | Değişiklikleri kolay uygula |
| `live.civ.ben.changes.body` | Hücre metni | y3648 | The entire 4D model adjusts in the event of any change, such as in relation to the alignment. Hence, if the geometry of an axis changes, the entire bridge model is adjusted automatically. | Güزهğâh değişikliği gibi herhangi bir değişiklikte tüm 4B model uyarlanır. Böylece bir eksenin geometrisi değiştiğinde tüm köprü modeli otomatik düzelir. |
| `live.civ.ben.deliverables.label` | Hücre başlığı | y3580 | MoreAccurate Deliverables | **kaynak hatası:** boşluk yok — Daha kesin çıktılar |
| `live.civ.ben.deliverables.body` | Hücre metni | y3653 | From initial plans through to materials, quantities, and final general arrangement and reinforcement drawings, quality and accuracy to rely on. | İlk planlardan malzemeye, metraje ve son genel düzenleme ile donatı çizimlerine kadar güvenebileceğiniz kalite ve kesinlik. |
| `live.civ.ben.more.title` | Alt başlık | y3733 | View more benefits on the included ALLPLAN Ultimate: | Dahil olan ALLPLAN Ultimate'ın diğer faydalarını görün: |
| `live.civ.ben.more.cta` | CTA | y3793 | to ALLPLAN Ultimate → `/editions/allplan-ultimate/` | ALLPLAN Ultimate sayfasına |
| `live.civ.ben.thumbs.image-1` | Görsel | y4153 | `images/Parametric_Modeling.jpg` / `images/Allplan_Bridge_Querformat_v2-700x400.png` (Ultimate tanıtım çifti) | — |
| `live.civ.ben.thumbs.image-2` | Görsel | y4759 | `images/SCIA_CIVIl_700x400.jpg` | — |

## CTA bandı (abonelik)

| ID | Rol | Konum | EN (birebir) | TR (taslak) |
|---|---|---|---|---|
| `live.civ.cta-1` | CTA | y3949 | See subscription benefits → `/subscription-faq/` | Abonelik avantajlarını görün |
| `live.civ.cta-2` | CTA | y3949 | Get offer → `https://www.allplan.com/en-contact-form/` | Teklif alın |

## "This is includeD in ALLPLAN Civil"

| ID | Rol | Konum | EN (birebir) | TR (taslak) |
|---|---|---|---|---|
| `live.civ.incl.title` | Bölüm başlığı | y4103 | This is includeD in ALLPLAN Civil | **kaynak hatası:** "includeD" harf kasası — Bunlar ALLPLAN Civil'e dahildir |
| `live.civ.incl.ult.label` | Sütun üst metni | y4434 | ALLPLAN Ultimate for | … için ALLPLAN Ultimate |
| `live.civ.incl.ult.title` | Sütun başlığı | y4466 | Infrastructure Modeling | Altyapı modelleme |
| `live.civ.incl.ult.li-1` | Madde | y4500 | Parametric modeling including pre-stressing tendons | Preload kabloları dahil parametrik modelleme |
| `live.civ.incl.ult.li-2` | Madde | y4530 | Parametric road design | Parametrik yol tasarımı |
| `live.civ.incl.ult.li-3` | Madde | y4560 | Groundworks and excavation tools | Zemin işleri ve kazı araçları |
| `live.civ.incl.ult.li-4` | Madde | y4590 | Parametric reinforcement | Parametrik donatı |
| `live.civ.incl.ult.cta` | CTA | y4630 | Learn more on ALLPLAN Ultimate → `/editions/allplan-ultimate/` | ALLPLAN Ultimate hakkında daha fazlası |
| `live.civ.incl.wf.label` | Sütun üst metni | y4434 | Workflows for | … için iş akışları |
| `live.civ.incl.wf.title` | Sütun başlığı | y4466 | Bridge Analysis & Design | Köprü çözüm ve tasarımı |
| `live.civ.incl.wf.li-1` | Madde | y4500 | Integrated bridge structural analysis with reinforcement design and code checking | Donatı tasarımı ve norm kontrolüyle bütünleşik köprü statik çözümü |
| `live.civ.incl.wf.cta-1` | CTA | y4601 | See bridge workflows → `/workflows/bridge-workflow/` | Köprü iş akışlarını görün |
| `live.civ.incl.wf.cta-2` | CTA | y4633 | See workflow for girder bridges → `https://www.allplan.com/workflows/precast-girder-bridge` | Kiriş köprü iş akışını görün |
| `live.civ.incl.wf.link-scia-flow` | Bant CTA | y5031 | Learn more about the Workflow between ALLPLAN & SCIA → `/allplan-scia-bim-workflow/` | ALLPLAN & SCIA iş akışı hakkında daha fazlası |

## SCIA bölümü

| ID | Rol | Konum | EN (birebir) | TR (taslak) |
|---|---|---|---|---|
| `live.civ.scia.label` | Şerit üst metni | y5080 | Workflows for | … için iş akışları |
| `live.civ.scia.title` | Sütun başlığı | y5111 | Structural analysis | Statik çözüm |
| `live.civ.scia.li-1` | Madde | y5146 | SCIA Engineer Ultimate for all types of building, industrial and civil structures. | Her tür bina, sanayi ve sivil yapı için SCIA Engineer Ultimate. |
| `live.civ.scia.li-2` | Madde | y5205 | Multi-material structural analysis software and design tool for all kinds of structures. | Her tür yapı için çoklu malzemeli statik çözüm yazılımı ve tasarım aracı. |
| `live.civ.scia.cta-1` | CTA | y5278 | Learn more (SCIA website) → `https://www.scia.net/en` | Daha fazla bilgi (SCIA sitesi) |
| `live.civ.scia.cta-2` | CTA | y5391 | Learn more about the Workflow between ALLPLAN & SCIA → `/allplan-scia-bim-workflow/` | ALLPLAN & SCIA iş akışı hakkında daha fazlası |
| `live.civ.scia.image` | Görsel | y4759 | `images/SCIA_CIVIl_700x400.jpg` (kaynak dosya adında Çİ harf kasası: CIVIl) | — |

## Özellikler — "Features ALLPLAN Civil Functionality At a glance"

13 satır × 2 kolon; her hücrede başlık + metin; bazı hücrelerde "Watch
Video" YouTube gömesi. Göme bağlantıları hücreye yakınlıkla eşleştirildi
(y konumuyla).

| ID | Rol | Konum | EN (birebir) | TR (taslak) |
|---|---|---|---|---|
| `live.civ.feat.title` | Bölüm başlığı | y5665 | Features ALLPLAN Civil Functionality At a glance | Özellikler — ALLPLAN Civil işlevselliği tek bakışta |
| `live.civ.feat.paramodel.title` | Hücre başlığı | y6071 | Parametric Modeling | Parametrik modelleme |
| `live.civ.feat.paramodel.body` | Hücre metni | y6127 | Specialized solution for the four-dimensional parametric modeling and detailing of civil structures like bridges, tunnels, retaining walls, noise barries, including special bridge types like precast girder bridges. | **kaynak hatası:** "noise barries" (doğrusu barriers) — Köprüler, tüneller, istinat duvarları, gürültü perdeleri de dahil sivil yapıların dört boyutlu parametrik modelleme ve detaylandırması için özel çözüm; öndökümlü kirişli köprü gibi özel köprü türleri dahil. |
| `live.civ.feat.prestr.title` | Hücre başlığı | y6071 | Parametric Prestressing | Parametrik preload |
| `live.civ.feat.prestr.body` | Hücre metni | y6127 | Modeling of prestressing tendons. | Preload kablosu modelleme. |
| `live.civ.feat.bsanalys.title` | Hücre başlığı | y6610 | Bridge Structural Analysis | Köprü statik çözümü |
| `live.civ.feat.bsanalys.body` | Hücre metni | y6666 | Specialized solution for the structural analysis of bridges. | Köprü statik çözümü için özel çözüm. |
| `live.civ.feat.bcode.title` | Hücre başlığı | y6610 | Bridge Code-based Design | Köprü norm tabanlı tasarım |
| `live.civ.feat.bcode.body` | Hücre metni | y6666 | Design and checks according to Eurocode with national annexes and AASHTO LRFD. | Ulusal ekler ve AASHTO LRFD ile Eurocode'a göre tasarım ve kontroller. |
| `live.civ.feat.bcode.video` | Video düğmesi | y7083 (x808) | Watch Video → `youtube.com/embed/LF6p7dQASR8` | Videoyu izleyin |
| `live.civ.feat.ifc.title` | Hücre başlığı | y7090 | Interfaces | Arayüzler |
| `live.civ.feat.ifc.body` | Hücre metni | y7146 | All relevant file interfaces for smooth data exchange, including ifc, bcf, pdf, rvt, 3dm, skp, obj, LandXML, dwg, dgn, c4d, stl, wrl, saf and many others. Software interfaces (e.g. Python API and Visual Scripting) enable automated workflows. | Ifc, bcf, pdf, rvt, 3dm, skp, obj, LandXML, dwg, dgn, c4d, stl, wrl, saf dahil sorunsuz veri alışverişi için tüm ilgili dosya arayüzleri ve çok daha fazlası. Yazılım arayüzleri (ör. Python API ve Visual Scripting) otomatik iş akışlarını mümkün kılar. |
| `live.civ.feat.gis.title` | Hücre başlığı | y7090 | External Data Sources | Dış veri kaynakları |
| `live.civ.feat.gis.body` | Hücre metni | y7146 | GIS Connector and Content Connector to import GIS information, 3D content and textures. | GIS bilgisi, 3B içerik ve doku içe aktarmak için GIS Connector ve Content Connector. |
| `live.civ.feat.model3d.title` | Hücre başlığı | y7659 | 3D Modeling | 3B modelleme |
| `live.civ.feat.model3d.body` | Hücre metni | y7716 | High performance 3D modeling, even for the most complex and challenging geometry. The modeling functionality is powered by the Siemens Parasolid modeling kernel. | En karmaşık ve zorlu geometri için bile yüksek performanslı 3B modelleme. Modelleme işlevi Siemens Parasolid çekirdeğiyle çalışır. |
| `live.civ.feat.model3d.video` | Video düğmesi | y7653 (x323) | Watch Video → `youtube.com/embed/kxDkWW01hRY` | Videoyu izleyin |
| `live.civ.feat.drafting2d.title` | Hücre başlığı | y7659 | 2D Drafting | 2B çizgi |
| `live.civ.feat.drafting2d.body` | Hücre metni | y7716 | Comprehensive functionality for precise 2D drafting for attractive, concise and detailed drawings. | Etkileyici, öz ve detaylı çizimler için kesin 2B çizgi işlevselliği. |
| `live.civ.feat.drafting2d.video` | Video düğmesi | y7653 (x808) | Watch video → `youtube.com/embed/_b6Z-1U8Ri4` | Videoyu izleyin |
| `live.civ.feat.viz.title` | Hücre başlığı | y8199 | Visualization | Görselleştirme |
| `live.civ.feat.viz.body` | Hücre metni | y8255 | Wide variety of visualization capabilities based on latest technologies like Vulkan. Includes the Real-time Render and CineWare, live links to Lumion and Twinmotion. | Vulkan gibi en son teknolojilere dayanan geniş görselleştirme olanakları. Real-time Render ve CineWare; Lumion ve Twinmotion'a canlı bağlantılar dahil. |
| `live.civ.feat.viz.video` | Video düğmesi | y8192 (x323) | Watch video → `youtube.com/embed/IqNuiMaveas` | Videoyu izleyin |
| `live.civ.feat.advviz.title` | Hücre başlığı | y8199 | Advanced Visualization | İleri görselleştirme |
| `live.civ.feat.advviz.body` | Hücre metni | y8255 | High performant GPU accelerated Redshift renderer from MAXON | **kaynak hatası:** "High performant" — MAXON'ın yüksek performanslı, GPU hızlandırmalı Redshift render motoru |
| `live.civ.feat.clash.title` | Hücre başlığı | y8709 | Clash detection | Çakışma tespiti |
| `live.civ.feat.clash.body` | Hücre metni | y8765 | Tool to identify soft and hard collisions. | Yumuşak ve sert çarpışmaları belirleme aracı. |
| `live.civ.feat.clash.video` | Video düğmesi | y8702 (x323) | Watch Video → `youtube.com/embed/gZuNqBEX4GA` | Videoyu izleyin |
| `live.civ.feat.bimeasy.title` | Hücre başlığı | y8709 | CONTENT PACKAGE BIM EASY | BIM EASY İÇERİK PAKETİ |
| `live.civ.feat.bimeasy.body` | Hücre metni | y8765 | Predefined yet customizable company standard. Ensures a consistent way of working when creating models and drawings through comprehensive wizards. Eases getting started, increases productivity and ensures well-structured data exchange, especially in openBIM projects. | Öntanımlı ama özelleştirilebilir şirket standardı. Kapsamlı sihirbazlarla model ve çizim oluşturmada tutarlı çalışma biçimi sağlar. Başlamayı kolaylaştırır, verimliliği artırır ve onaylı veri alışverişini iyi yapılandırır, özellikle openBIM projelerde. |
| `live.civ.feat.bimeasy.video` | Video düğmesi | y8702 (x808) | Watch Video → `youtube.com/embed/RyUl97kMQ88` | Videoyu izleyin |
| `live.civ.feat.components.title` | Hücre başlığı | y9308 | Building Components | Bina bileşenleri |
| `live.civ.feat.components.body` | Hücre metni | y9365 | Flexible building components such as walls, slabs, beams, columns, foundations, stairs, roofs, windows, doors and facades. | Duvarlar, döşemeler, kirişler, kolonlar, temeller, merdivenler, çatılar, pencereler, kapılar ve cepheler gibi esnek bina bileşenleri. |
| `live.civ.feat.components.video` | Video düğmesi | y9302 (x323) | Watch Video → `youtube.com/embed/DX7oODCOgeI` | Videoyu izleyin |
| `live.civ.feat.terrain.title` | Hücre başlığı | y9308 | Terrain Model | Arazi modeli |
| `live.civ.feat.terrain.body` | Hücre metni | y9364 | Powerful terrain modeling based on survey points or point clouds. | Ölçüm noktaları veya nokta bulutlarına dayanan güçlü arazi modelleme. |
| `live.civ.feat.urban.title` | Hücre başlığı | y9818 | Urban and Landscape Design | Kentsel ve peyzaj tasarımı |
| `live.civ.feat.urban.body` | Hücre metni | y9874 | Functions for mass models, urban and site design as well as planting plans. | Kütle modelleri, kentsel ve saha tasarımı ve dikim planları için işlevler. |
| `live.civ.feat.sewer.title` | Hücre başlığı | y9818 | Sewerage and Utilities | Kanalizasyon ve altyapı |
| `live.civ.feat.sewer.body` | Hücre metni | y9874 | Routing of services such as water, sewage, electricity, internet, natural gas or district heating. | Su, kanalizasyon, elektrik, internet, doğalgaz veya bölge ısıtması gibi servislerin güzergâhlandırılması. |
| `live.civ.feat.qto.title` | Hücre başlığı | y10298 | Quantity Take-Off and Costing | Metraj ve maliyet |
| `live.civ.feat.qto.body` | Hücre metni | y10384 | Precise, verifiable quantity takeoff and costing of modeled and non modeled objects. | Modellenen ve modellenmeyen nesnelerin kesin, doğrulanabilir metrajı ve maliyeti. |
| `live.civ.feat.qto.video` | Video düğmesi | y10292 (x323) | Watch Video → `youtube.com/embed/toZosw6NtMQ` | Videoyu izleyin |
| `live.civ.feat.rebar.title` | Hücre başlığı | y10298 | Reinforcement | Donatı |
| `live.civ.feat.rebar.body` | Hücre metni | y10354 | Extremely powerful reinforcement functionality, including bar reinforcement, mesh reinforcement and BAMTEC carpets. | Demet donatı, hasır donatı ve BAMTEC halıları dahil son derece güçlü donatı işlevselliği. |
| `live.civ.feat.rebar.video` | Video düğmesi | y10292 (x808) | Watch Video → `youtube.com/embed/SB-ULI92gKY` | Videoyu izleyin |
| `live.civ.feat.steel.title` | Hücre başlığı | y10808 | Steel Connections | Çelik bağlantılar |
| `live.civ.feat.steel.body` | Hücre metni | y10864 | Tools for bolted and welded steel connections. | Cıvatalı ve kaynaklı çelik bağlantılar için araçlar. |
| `live.civ.feat.steel.video` | Video düğmesi | y10802 (x323) | Watch Video → `youtube.com/embed/JnxPHPvNG_M` | Videoyu izleyin |
| `live.civ.feat.roads.title` | Hücre başlığı | y10808 | Roads | Yollar |
| `live.civ.feat.roads.body` | Hücre metni | y10864 | Fully parametric road design, including intersections, traffic circles and vehicle swept path analysis. | Kavşaklar, döner kavşaklar ve taşıt çalkantı yolu analizi dahil tam parametrik yol tasarımı. |
| `live.civ.feat.roads.video` | Video düğmesi | y10802 (x808) | Watch Video → `youtube.com/embed/PGTnLKV0OPE` | Videoyu izleyin |
| `live.civ.feat.siteprep.title` | Hücre başlığı | y11288 | Construction Site Preparation | Şantiye alanı hazırlığı |
| `live.civ.feat.siteprep.body` | Hücre metni | y11344 | Cranes, containers, site fences and other equipment for planning the construction site layout. | Vinçler, konteynerler, şantiye çitleri ve şantiye düzenini planlamak için diğer ekipmanlar. |
| `live.civ.feat.groundworks.title` | Hücre başlığı | y11288 | Groundworks | Zemin işleri |
| `live.civ.feat.groundworks.body` | Hücre metni | y11344 | Intelligent excavation shoring such as bored pile, soldier pile walls and ground anchors. | Beton kazık, kazıklı duvar ve zemin ankrajı gibi akıllı kazı tahkimi. |
| `live.civ.feat.groundworks.video` | Video düğmesi | y11282 (x808) | Watch Video → `youtube.com/embed/pAKk-3RHhXo` | Videoyu izleyin |
| `live.civ.feat.excavation.title` | Hücre başlığı | y11768 | Excavation | Kazı |
| `live.civ.feat.excavation.body` | Hücre metni | y11824 | Tools to model excavations and create excavation drawings. | Kazıları modellemek ve kazı çizimleri oluşturmak için araçlar. |
| `live.civ.feat.excavation.video` | Video düğmesi | y11761 (x323) | Watch video → `youtube.com/embed/YYC94jU_pvg` | Videoyu izleyin |
| `live.civ.feat.precast.title` | Hücre başlığı | y11768 | Precast Design and Detailing | Öndöküm tasarım ve detaylandırma |
| `live.civ.feat.precast.body` | Hücre metni | y11854 | Intelligent precast concrete components such as beams, columns, stairs etc. | Kirişler, kolonlar, merdivenler vb. akıllı öndökümlü beton bileşenler. |
| `live.civ.feat.precast.video` | Video düğmesi | y11762 (x808) | Watch Video → `youtube.com/embed/jECn0KjKgmY` | Videoyu izleyin |
| `live.civ.feat.elementplan.title` | Hücre başlığı | y12278 | Element Plan | Öğe planı |
| `live.civ.feat.elementplan.body` | Hücre metni | y12334 | Automated, template-based generation of detailed drawings of individual elements. | Tekil öğelerin ayrıntılı çizimlerinin otomatik, şablon tabanlı üretimi. |
| `live.civ.feat.axisgrid.title` | Hücre başlığı | y12274 | Automatic Parametric Axis Grid | Otomatik parametrik eksen ızgarası |
| `live.civ.feat.axisgrid.body` | Hücre metni | y12330 | Define parametric axis grids in the cross-section and extrude them along the alignment. Elements snap into exact positions, and one spacing change updates the entire structure instantly. | Parametrik eksen ızgarasını kesitte tanımlayın ve güzergâh boyunca ekstrüde edin. Öğeler kesin konumlara çakışır; tek aralık değişikliği tüm yapıyı anında günceller. |
| `live.civ.feat.axisgrid.image` | Görsel | y12021 | `images/csm_1.WEB_NEW-Automatic_Parametric_Axis_Grid_-_Kopie_ea43deb285.png` | — |
| `live.civ.feat.distr.title` | Hücre başlığı | y12810 | Flexible Distribution and Stationing | Esnek dağıtım ve kilometraj |
| `live.civ.feat.distr.body` | Hücre metni | y12866 | Distribute elements by spacing or number using familiar stations, offsets and alignment values. Start modeling immediately, without manual calculations or time-consuming data preparation. | Öğeleri tanıdık kilometraj, ofset ve güzergâh değerleriyle aralığa veya sayıya göre dağıtın. Elle hesaplama veya zaman alan veri hazırlığı olmadan hemen modellemeye başlayın. |
| `live.civ.feat.distr.image` | Görsel | y12556 | `images/csm_2.WEB_NEW-Arrange_stations_-_Kopie_d609a21dc0.png` | — |
| `live.civ.feat.serial.title` | Hücre başlığı | y12810 | Reusable Serial Elements | Yeniden kullanılabilir seri öğeler |
| `live.civ.feat.serial.body` | Hücre metni | y12866 | Create a complex truss bay, gallery field or station-roof module once, then distribute it as an intelligent serial element. Turn hours of repetitive detailing into minutes of smart modeling. | Karmaşık bir kafes gözü, galeri alanı veya istasyon çatı modülünü bir kez oluşturun, sonra akıllı bir seri öğe olarak dağıtın. Saatler süren tekrarlayan detaylandırmayı dakikalar süren akıllı modellemeye dönüştürün. |
| `live.civ.feat.serial.image` | Görsel | y12556 | `images/csm_3.WEB_NEW-Reusable_Serial_Elements_-_Kopie_9b200303b8.png` | — |

## CTA bandı — sorgu

| ID | Rol | Konum | EN (birebir) | TR (taslak) |
|---|---|---|---|---|
| `live.civ.q.cta-1` | CTA | y13041 | Questions? Get in Touch → `/consulting-sale/consulting-sale-overview/` | Sorunuz mu var? İletişime geçin |
| `live.civ.q.cta-2` | CTA | y13041 | Get offer → `https://www.allplan.com/en-contact-form/` | Teklif alın |

## ALLPLAN CLOUD SERVICES

| ID | Rol | Konum | EN (birebir) | TR (taslak) |
|---|---|---|---|---|
| `live.civ.cloud.title` | Bölüm başlığı | y13195 | ALLPLAN CLOUD SERVICES | ALLPLAN BULUT HİZMETLERİ |
| `live.civ.cloud.collab.image` | Görsel | y13255 | `images/14_CLOUD-BASED_COLLABORATION_2.jpg` / `images/15_PROJECT_TEAMWORKING_2_01.jpg` | — |
| `live.civ.cloud.collab.video` | Video düğmesi | y13506 (x323) | Watch Video → `youtube.com/embed/7xzpEhLQhEI??rel=0…` (**kaynak hatası:** `??rel=0` çift soru işareti) | Videoyu izleyin |
| `live.civ.cloud.collab.title` | Hücre başlığı | y13513 | Cloud-based Collaboration | Bulut tabanlı iş birliği |
| `live.civ.cloud.collab.body` | Hücre metni | y13569 | Bimplus Pro cloud-based BIM collaboration platform. | Bimplus Pro bulut tabanlı BIM iş birliği platformu. |
| `live.civ.cloud.team.title` | Hücre başlığı | y13512 | Project Teamworking | Proje takım çalışması |
| `live.civ.cloud.team.body` | Hücre metni | y13569 | ALLPLAN Share enables teamwork across a company network, ideal also for team members working remotely. | ALLPLAN Share, şirket ağınızdaki takım çalışmasını mümkün kılar; uzaktan çalışan takım üyeleri için de idealdir. |
| `live.civ.cloud.exchange.title` | Hücre başlığı | y13992 | Drawing and Plan Distribution | Çizim ve plan dağıtımı |
| `live.civ.cloud.exchange.body` | Hücre metni | y14048 | Web-based plan distribution tool, ALLPLAN Exchange, specifically designed to manage the creation and distribution of various plan formats and provide automatic change notifications via email groups. | Web tabanlı plan dağıtım aracı ALLPLAN Exchange; çeşitli plan formatlarının oluşturulmasını ve dağıtımını yönetmek ve e-posta gruplarıyla otomatik değişiklik bildirimleri sağlamak üzere tasarlanmıştır. |
| `live.civ.cloud.analytical.title` | Hücre başlığı | y13992 | Analytical Model Generation | Analitik model üretimi |
| `live.civ.cloud.analytical.body` | Hücre metni | y14048 | Smart conversion, via AutoConverter, of geometrical models to analytical models that can directly be used by structural analysis solutions like Frilo Statics, Scia Engineer and many others. | AutoConverter üzerinden geometrik modellerin; Frilo Statics, Scia Engineer ve diğer birçok statik çözüm yazılımının doğrudan kullanabildiği analitik modellere akıllı dönüşümü. |
| `live.civ.cloud.wgm.image` | Görsel | y14274 | `images/Allplan-WorkgroupManager.jpg` / `images/CLOUD-ENABLED_PROJECT_RESOURCES_Filter_01.jpg` | — |
| `live.civ.cloud.office.title` | Hücre başlığı | y14531 | Office Teamworking | Ofis takım çalışması |
| `live.civ.cloud.office.body` | Hücre metni | y14588 | Through ALLPLAN Workgroup Manager facilitate efficient teamwork within a local company network. | ALLPLAN Workgroup Manager üzerinden yerel şirket ağı içinde etkin takım çalışması sağlayın. |
| `live.civ.cloud.resources.title` | Hücre başlığı | y14531 | Cloud-enabled Project Resources | Bulut tabanlı proje kaynakları |
| `live.civ.cloud.resources.body` | Hücre metni | y14588 | Cloud office resources allow full cloud based distribution of ALLPLAN project resources. | Bulut ofis kaynakları ALLPLAN proje kaynaklarının tamamen bulut tabanlı dağıtımını sağlar. |
| `live.civ.cloud.viewer.title` | Hücre başlığı | y15011 | ALLPLAN Model Viewer | ALLPLAN Model Görüntüleyici |
| `live.civ.cloud.viewer.body` | Hücre metni | y15067 | To quickly preview a new file, view, and check IFC models visually before fully uploading and creating a revision in Bimplus. (Available with ALLPLAN Subscription or though Bimplus Professional purchase only.) | Yeni dosyayı hızlıca önizlemek, görüntülemek ve Bimplus'ta tam yükleme ve revizyon oluşturmadan önce IFC modellerini görsel olarak kontrol etmek için. (Yalnız ALLPLAN Aboneliği veya Bimplus Professional satın alımıyla kullanılabilir.) |
| `live.civ.cloud.viewer.image` | Görsel | y14754 | `images/ALLPLAN_Model_Viewer_700x400.jpg` / `images/ALLPLAN_BLUEBEAM_Connection_700x400_01.jpg` | — |
| `live.civ.cloud.bluebeam.title` | Hücre başlığı | y15011 | ALLPLAN - Bluebeam Connection | ALLPLAN - Bluebeam bağlantısı |
| `live.civ.cloud.bluebeam.body` | Hücre metni | y15097 | Enhanced workflows – to aid the digital delivery process we will connect with Bluebeam. The users will be able to bring 2D documentation into the ALLPLAN workflows from within the Bluebeam Studio Project environment. | Geliştirilmiş iş akışları – süreç teslim sürecine yardımcı olmak için Bluebeam'la bağlantı kursak. Kullanıcılar, Bluebeam Studio Project ortamından 2B dokümantasyonu ALLPLAN iş akışlarına getirebilecek. |
| `live.civ.cloud.bluebeam.video` | Video düğmesi | y15005 (x808) | Watch video → `youtube.com/embed/u4GZUL7WdQU` | Videoyu izleyin |
| `live.civ.cloud.learnmore` | Alt bağlantı | y15323 | Learn more / Benefit from instant access to tools boosting your collaboration to the next level. / ALLPLAN Cloud Services || Daha fazla bilgi / İş birliğinizi bir üst seviyeye taşıyan araçlara anında erişimden yararlanın. / ALLPLAN Cloud Services |
| `live.civ.cloud.ai.title` | Hücre başlığı | y15580 | AI-Based Visualization | Yapay zekâ tabanlı görselleştirme |
| `live.civ.cloud.ai.body` | Hücre metni | y15637 | Connections for creating inspiring, detailed AI driven visualizations. Includes Nemetschek AI Visualizer and integration to EvolveLab's Veras AI Visualizer. | Etkileyici, ayrıntılı yapay zekâ sürümü görselleştirmeler oluşturmak için bağlantılar. Nemetschek AI Visualizer ve EvolveLab'ın Veras AI Visualizer entegrasyonu dahil. |
| `live.civ.cloud.ai.video` | Video düğmesi | y15574 (x323) | Watch video → `youtube.com/embed/ldc4IjJDlwc` | Videoyu izleyin |
| `live.civ.cloud.ai.image` | Görsel | y15323 | `images/AI_Based_Viz.jpg` | — |

## PURCHASABLE OPTIONS

| ID | Rol | Konum | EN (birebir) | TR (taslak) |
|---|---|---|---|---|
| `live.civ.opts.title` | Bölüm başlığı | y15912 | PURCHASABLE OPTIONS | SATIN ALINABİLİR SEÇENEKLER |
| `live.civ.opts.formwork.title` | Hücre başlığı | y16230 | BIM²form Add On - Formwork | BIM²form eklenti - kalıp |
| `live.civ.opts.formwork.body` | Hücre metni | y16316 | Tools to place formwork. | Kalıp yerleştirmek için araçlar. |
| `live.civ.opts.formwork.video` | Video düğmesi | y16223 (x323) | Watch Video → `youtube.com/embed/s-NKwOU0XAw` | Videoyu izleyin |
| `live.civ.opts.license.title` | Hücre başlığı | y16229 | License Server | Lisans sunucusu |
| `live.civ.opts.license.body` | Hücre metni | y16285 | Facilitates optimal use of existing licenses by multiple users. License usage outside the office is possible. | Mevcut lisansların birden fazla kullanıcı tarafından en uygun kullanımını kolaylaştırır. Ofis dışında lisans kullanımı mümkündür. |
| `live.civ.opts.bimplus.title` | Hücre başlığı | y16709 | Bimplus Pro | Bimplus Pro |
| `live.civ.opts.bimplus.body` | Hücre metni | y16766 | Additional Bimplus Pro licenses to expand your cloud collaboration capacity. | Bulut iş birliği kapasitenizi genişletmek için ek Bimplus Pro lisansları. |
| `live.civ.opts.storage.title` | Hücre başlığı | y16709 | ALLPLAN Cloud Storage | ALLPLAN bulut deposu |
| `live.civ.opts.storage.body` | Hücre metni | y16766 | Additional storage to enable your projects to continue without interruption. | Projelerinizin kesintisiz devam edebilmesi için ek depolama. |

## FAQ ALLPLAN Civil

| ID | Rol | Konum | EN (birebir) | TR (taslak) |
|---|---|---|---|---|
| `live.civ.faq.title` | Bölüm başlığı | y17011 | FAQ ALLPLAN Civil | SSS ALLPLAN Civil |
| `live.civ.faq.q1` | Soru | y17066 | DOES ALLPLAN CIVIL REPLACE ALLPLAN BRIDGE? | ALLPLAN CIVIL, ALLPLAN BRIDGE'İN YERİNİ ALIR MI? |
| `live.civ.faq.a1` | Yanıt | y17120 | Yes, from the release of the ALLPLAN 2025 version, ALLPLAN Civil edition replaces the subscription ALLPLAN Bridge configuration. | Evet, ALLPLAN 2025 sürümünün yayınlanmasıyla ALLPLAN Civil sürümü, abonelik tabanlı ALLPLAN Bridge yapılandırmasının yerini aldı. |
| `live.civ.faq.q2` | Soru | y17125 | IS ALLPLAN CIVIL FOR INFRASTRUCTURE WORK? | ALLPLAN CIVIL ALTYAPI İŞLERİ İÇİN Mİ? |
| `live.civ.faq.a2` | Yanıt | y17179 | Yes, ALLPLAN Civil is our ultimate solution for infrastructure design and construction companies. It is a solution for advanced infrastructure design to build workflows that supports the complete process of design and construction, containing specialised tools for bridges and civil structures, prefabrication and construction workflows. | Evet, ALLPLAN Civil altyapı tasarım ve inşaat firmalarına yönelik flagman çözümümüz. Köprüler ve sivil yapılar için özelleştirilmiş araçlar, prefabrikasyon ve inşaat iş akışları dahil, tasarım ve inşaatın tüm sürecini destekleyen ileri altyapı tasarım-yapım iş akışlarına yönelik bir çözümdür. |

## Müşteri sözü karuseli ("About ALLPLAN", 3 kart)

| ID | Rol | Konum | EN (birebir) | TR (taslak) |
|---|---|---|---|---|
| `live.civ.testi.title` | Kart üst başlığı | bant | About ALLPLAN | ALLPLAN hakkında |
| `live.civ.testi-1.quote` | Söz | bant (x-351 / 2559 / 5469) | "Bring your design to build supply chain together leveraging our innovative workflows!" | Benzersiz iş akışlarımızı kullanarak tasarım-yapım tedarik zincirinizi bir araya getirin! |
| `live.civ.testi-1.video` | Video düğmesi | bant | Watch Video → `https://event.allplanplus.com/c/allplan/planning/UGxhbm5pbmdfMTk5MjYzNQ==` | Videoyu izleyin |
| `live.civ.testi-1.image` | Görsel | bant | `images/AEC_Campaign_AFruehauf_1240x700_blanko.jpg` — *eşleştirme tahminidir; canlı sayfada ad görünmez* | — |
| `live.civ.testi-2.quote` | Söz | bant (x619 / 3529) | "Welcome the automation of infrastructure projects. Let me show you how!" | Altyapı projelerinin otomasyonuna hoş geldiniz. Nasıl olduğunu göstereyim! |
| `live.civ.testi-2.video` | Video düğmesi | bant | Watch Video → `https://event.allplanplus.com/c/allplan/planning/UGxhbm5pbmdfMTk5MjYxNQ==` | Videoyu izleyin |
| `live.civ.testi-2.image` | Görsel | bant | `images/AEC_Campaign_MMikus_1240x700_blanko.jpg` | — |
| `live.civ.testi-3.quote` | Söz | bant (x1589 / 4499) | "Stay ahead in architectural design with innovative software technologies." | Yenilikçi yazılım teknolojileriyle mimari tasarımda bir adım önde kalın. |
| `live.civ.testi-3.video` | Video düğmesi | bant | Watch Video → `https://event.allplanplus.com/c/allplan/planning/UGxhbm5pbmdfMTk5MjU0Nw==` | Videoyu izleyin |
| `live.civ.testi-3.image` | Görsel | bant | `images/AEC_Campaign_ZDevedzic_1240x700.jpg` | — |

**Not:** söz–portre eşlemesi kart sırasına göre tahminidir; canlı sayfada
isim unvanı görüntülenmediği için kesin eşleşme teyit gerektirir.

## Başarı hikâyeleri

| ID | Rol | Konum | EN (birebir) | TR (taslak) |
|---|---|---|---|---|
| `live.civ.story.title` | Bölüm başlığı | y18228 | Success Stories CUSTOMER PROJECTS DESIGNED AND BUILT WITH ALLPLAN | Başarı hikâyeleri — ALLPLAN İLE TASARLANIP İNŞA EDİLEN MÜŞTERİ PROJELERİ |
| `live.civ.story.viewall` | CTA | y18310 | VIEW ALL SUCCESS STORIES → `/references/bridge-engineering/` | TÜM BAŞARI HİKÂYELERİNİ GÖRÜN |
| `live.civ.story.rize.title` | Kart başlığı | bant (x-552) | Rize-Artvin Airport Bridge | Rize-Artvin Havalimanı Köprüsü |
| `live.civ.story.rize.place` | Yer | bant | Turkey | Türkiye |
| `live.civ.story.rize.body` | Kart metni | bant | As part of the works, the airport required a new cast in-situ, post-tensioned bridge to connect to the existing roads between the towns of Rize and Artvin. ­Spanning 444 meters, the bridge deck will reach a variable thickness of 120 to 180 cm and contain 13 spans along the length when construction is finished. | **kaynak notu:** EN metinde "Spanning" kelimesinden önce görünmez bir yumuşak tire (U+00AD) var — İşlerin kapsamında havalimanı, Rize ile Artvin kasabaları arasındaki mevcut yollara bağlanmak için yeni bir yerinde döküm, preload'lı köprü gerektirdi. 444 metre açıklıklı köprü tabliyesi, inşaat tamamlandığında 120-180 cm değişken kalınlığa ulaşacak ve uzunluk boyunca 13 açıklık içerecek. |
| `live.civ.story.rize.cta` | CTA | bant | Read More → `/fileadmin/user_upload/shared-files/references/Interim_On24/EN_Bridge/Case_Study_Rize_Artvin_Airport_Bridge_EN_GmbH.pdf` | Daha fazla oku |
| `live.civ.story.rize.image` | Görsel | bant | `images/csm_Rize_artvin_Bridge_1fe1e80ccc.jpg` | — |
| `live.civ.story.queens.title` | Kart başlığı | y18704 | Queensferry Crossing | Queensferry Crossing |
| `live.civ.story.queens.place` | Yer | y18738 | Edinburgh, Scotland (GB) | Edinburgh, İskoçya (GB) |
| `live.civ.story.queens.body` | Kart metni | y18795 | The Queensferry Crossing near Edinburgh in Scotland is a cablestayed bridge with three pylons over 200 m in height. It is one of the largest infrastructure projects in Europe and benefitted from ultramodern reinforcement planning in 3D. | **kaynak hatası:** "cablestayed" birleşik yazılmıştır — Edinburgh yakınlarındaki Queensferry Crossing; üç piramidiyle 200 m yükseklikte bir ipli asma köprüdür. Avrupa'nın en büyük altyapı projelerinden biri olup 3B’de ultramodern donatı planlamasından yararlandı. |
| `live.civ.story.queens.cta` | CTA | y18945 | Read More → `/fileadmin/…/Case_Study_Queensferry_Crossing_EN_GmbH.pdf` | Daha fazla oku |
| `live.civ.story.queens.image` | Görsel | y18399 | `images/csm_Bridge-Eng_Queensferry_17724cf5dd.jpg` | — |
| `live.civ.story.alt.title` | Kart başlığı | bant (x692) | Altglienicker Bridge | Altglienicker Köprüsü |
| `live.civ.story.alt.place` | Yer | bant | Berlin, Germany | Berlin, Almanya |
| `live.civ.story.alt.body` | Kart metni | bant | The unique arch shape between the pavement and the road enables optimal load transfer with the smallest possible dimensions. A low construction height is achieved via a small cross-girder span, which, on the one hand, overcomes the narrow conditions in the watercourse area, and on the other hand, uses less material. A lateral arch overhang – which absorbs the transverse bending and provides stability – can also be used as a lighting strip. structure. | **kaynak hatası:** metnin sonunda kopuk "structure." kelimesi var — Kaldırım ile yol arasındaki özgün kemer biçimi, mümkün olan en küçük kesitlerle en uygun yük aktarımını sağlar. Küçük çapraz kiriş açıklığıyla düşük inşaat yüksekliğine ulaşılır; bu bir yandan su yolu bölgesindeki dar koşulları aşar, öte yandan daha az malzeme kullanır. Enine eğilme ve kararlılığı karşılayan yan kemer çıkıntısı aynı zamanda aydınlatma şeridi olarak da kullanılabilir. "structure." |
| `live.civ.story.alt.cta` | CTA | bant | Read More → `/fileadmin/…/Case_Study_Altglienicker_Bridge_EN.pdf` | Daha fazla oku |
| `live.civ.story.alt.image` | Görsel | bant | `images/csm_Altglienicker_Bridge_cc52b4f317.jpg` | — |

### Ücretsiz deneme bandı

| ID | Rol | Konum | EN (birebir) | TR (taslak) |
|---|---|---|---|---|
| `live.civ.trial.title` | Bölüm başlığı | y19253 | Bim Software for the AEC Industry | AEC sektörü için Bim yazılımı |
| `live.civ.trial.cta.title` | Kart başlığı | y19364 | FreeTrial | **kaynak hatası:** boşluk yok — ÜCRETSİSİZ DENEME |
| `live.civ.trial.parts` | Şartlar | y19419-19533 | for / 0 € / 14 days | için / 0 € / 14 gün |
| `live.civ.trial.cta` | CTA | y19590/19604 | Download → `https://www.allplan.com/trial-or-subscription/` | İndirin |
| `live.civ.trial.faq` | Alt bağlantı | y19770 | Subscription terms and FAQS → `/subscription-faq/` | Abonelik koşulları ve SSS |

---

## Kaynak notları (canlı hatalar ve teyit gereksinimleri)

1. **Boşluksuz birleşik statüler:** stat-etiketleri "100%ConsistentData",
   "63%MoreTime", "100%MorePrecise", "100%MoreEfficiency" ve
   faydalarda "Precise3D Reinforcement", "OneSolution for All Tasks",
   "Quickly CreateVariants and Templates", "MoreAccurate Deliverables" ve
   "FreeTrial" — % işareti/kelimeler arasındaki boşluk CSS ile eklenebilir, DOM
   metni boşluksuzdur. Üretimde başlık/alt başlık ayrımına dikkat gerekir.
2. **"63% More Time" paradoks:** metin "More Time" der fakat gövde zaman
   tasarrufunu anlatır — muhtemelen "63% less time" olması gerekmektedir.
3. **"noise barries"** (doğrusu "noise barriers") — Parametric Modeling gövdesi.
4. **"This is includeD in ALLPLAN Civil"** — "includeD" harf kasası (D Büyük).
5. **Rize metninde yumuşak tire:** "­Spanning" içinde U+00AD karakteri canlı DOM'da
   mevcut; copy sayfa kontrolünde görsel görünmez.
6. **Altglieniker metninde kopuk cümle sonları:** …"lighting strip. structure." —
   "structure." kopuk/kalan bir cümle kalıntısı gibi duruyor. Üretici kontrolü
   gerekir.
7. **Cloud video URL kusuru:** `youtube.com/embed/7xzpEhLQhEI??rel=0…` — `?`
   karakteri çift yazılmış.
8. **SCIA görsel dosya adı:** `SCIA_CIVIl_700x400.jpg` (küçük L) — dosya adındaki
   kasa hatası (içerik etkisi yok).
9. **SCIA yanıt metni:** canlı DOM'da soru metni tek ve tutarlıdır; y17179
   satırındaki çeviri tamdır, ayrıca teyit gerekmez.
10. **Müşteri sözleri kişisizdir:** ad/unvan satırı canlı DOM'da yok; söz–portre
    eşleştirmesi y konumuna göre tahminidir.
11. **"Watch Video" gömeleri:** Allplan Max sayfasındaki 6 özellik kartında olduğu
    gibi videolar YouTube'da barındırılır; indirme kararı ayrıca ve kullanıcıya
    aittir.

## Medya

Ayrıntılar ve SHA-256: `media/manifest.md`.
- 58 görsel indirildi: hero ×1, bölüm ikonu ×8, Ultimate/SCIA tanıtım görselleri ×3, özellik satırlarının görselleri ×28 (14 çift), özellik kartı görselleri ×3 (axis grid, stations, serial elements), WorkgroupManager/Cloud Storage Filter ×2, AI_Based_Viz ×1, formwork/License Server/Bimplus Pro/BIMPLUS ×4, AEC kampanya portreleri ×3, başarı hikâyesi kartı görselleri ×3.
- Yerel video yok; 18 "Watch Video" YouTube gömesi envantere kayıtlı ve
  3 müşteri sözü video bağlantısı event.allplanplus.com'a işaret eder.
