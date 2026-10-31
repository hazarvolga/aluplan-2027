# Tasarım tutarlılığı ve ortak bileşen envanteri — 29.10.2026

## Kapsam ve yöntem

Yerel `src/data/pages.json` içindeki 110 kayıt ve bileşen kaynakları statik incelendi; 53 kayıtta boş olmayan structuredLayout mevcut. Bu, 110 rotanın tarayıcıda tek tek görsel, mobil ve etkileşim kabulünden geçtiği anlamına gelmez. Önizlemeler bu 110 kayıt dışında ayrıca değerlendirildi. `contentBlocks` yolunu kullanan sayfalarda aşağıdaki alan sayıları bileşen kullanımının tam sayısı değildir.

## Tekrar kullanımı ve farklar

| Alan | Mevcut uygulama | Civil önizlemesi | Karar / dikkat |
|---|---|---|---|
| Hero | `SubpageHeroSection` ve `subpage-hero-presentation` | Ayrı hero/CSS | Mevcut sunum modeline bağlamadan önce hero verisi ve açık/koyu kontrastı doğrula. |
| Giriş + video | `StructuredPageLayoutSection` içindeki `alu-intro-split` | Aynı CSS sınıfları; markup ayrı | Çıkarılabilir sunum bileşeni; metin, liste ve medya isteğe bağlı olmalı. |
| Metrikler | `alu-hero-metrics` sınıfları; yapılandırılmış ve diğer bloklarda farklı markup | Aynı sınıflar, ayrı markup | Paylaşılan MetricsSection adayı; 3/4 sütun ve küçük ekranı test et. |
| Zorluklar | `alu-challenges-band` / `alu-challenge-card` | Aynı sınıflar; 4 öğe için yerel kolon kuralı | Paylaşılan ChallengesSection adayı; 3 ve 4 öğe düzenlerini koru. |
| Avantajlar | `BenefitsSection` (`StructuredPageLayoutSection`, `StructuredContentBlocks`) | `BenefitsSection` doğrudan kullanılıyor | Aynı bileşen; kaynak ikonları doğrulanmadığından Civil için üretilmedi. |
| Özellikler | `MediaGridSection`, görsel/video modal callbackleri ve kaynak kimlikleri | Ayrı `Catalogue`: görselsiz metin/video kartları | Öğe modelini eşleştir; eksik görselleri uydurma, modal hedef ve odak davranışını koru. |
| SSS | `FAQSection` kategori dizini; başka noktalarda native details | Ayrı native details | Tek genel şablon varsayma: kategorili ve basit SSS varyantları gerekir. |
| Kapanış | `PageEndConversion` + policy; üç önizlemede `PreviewClosingSection` | PreviewClosingSection | İki model birleşmeden önce farklı başlık/paragraf/CTA yapılarını koruyacak sözleşme çıkar. |
| Hareket | semantic motion tokenları ve kısmi reduced-motion kuralları | Bazı önizlemelerde yerel CSS | Önce ortak hareket politikası; reduced motion, modal ve akordiyon testleri. |

## Öncelikli bulgular

1. Civil özellik kataloğu mevcut MediaGridSection yerine ayrı Catalogue kullanıyor; 28 özelliğin medya eşleşmesi eksik olduğundan yalnız biçimi değiştirip eşleşmiş gibi göstermek yanlış olur.
2. Avantajlar düzeltmesi bu analizden hemen önce tamamlandı; Civil sekiz avantaj için BenefitsSection kullanıyor, kaynak metinler ve üç ilgili bağlantı korunuyor.
3. Hero, giriş, metrik ve zorluklarda ortak CSS sınıfları bile tek başına ortak veri/bileşen sözleşmesi anlamına gelmiyor.
4. Önizleme kapanış bileşeni ile mevcut PageEndConversion ayrı; hemen birleştirmek diğer sayfalarda metin ve CTA hedeflerini etkileyebilir.
5. Civil kaynak metinlerinin bir kısmı önceki denetimde kısaltılmış bulundu; kaynak sadakati ve üretici görsellerinin/haklarının kontrolü tasarım işinden ayrı açık işler.
6. Alt çizgi yasağı ortak stillere işlendi; paragraf içi bağlantıların renk dışı ayrışması, klavye odağı ve tüm sayfalardaki farklı durumlar ayrıca gerçek tarayıcıda değerlendirilmeli.

## Güvenli sıra

1. Özellik/medya için Civil 28 kayıt → kaynak medya ve URL eşlemesi → MediaGridSection yetenek fark tablosu.
2. Temsili sayfalarda ortak giriş, metrik, zorluk ve avantaj sözleşmeleri; içerik ve görsel öncesi/sonrası karşılaştırması.
3. Farklı SSS, sekme ve kapanış modelleri için varyantları kararlaştır; prod sayfalara toplu geçişten önce dar pilot.
4. Tema, mobil, klavye, reduced motion, modal ve görsel regresyonu; kullanıcı kabulü sonrası site geneline kademeli uygulama.

## Kaynak veri alanları — rota listeleri

Bu listeler `structuredLayout` alanındaki doğrudan alan varlığını gösterir; contentBlocks ve diğer renderer yolları nedeniyle eksiksiz bileşen kullanım sayıları değildir.

### Giriş (29)

- `/products/allplan-2026-yenilikler`
- `/products/allplan-aec`
- `/products/allplan-basic`
- `/products/allplan-bimplus`
- `/products/allplan-cloud-services`
- `/products/allplan-concept`
- `/products/allplan-professional`
- `/products/allplan-ultimate`
- `/products/ax3000`
- `/products/civil`
- `/products/precast`
- `/products/precast-detail`
- `/products/sds2-home`
- `/solutions-v2/training/quick-start`
- `/solutions/addons/sketchup-converter`
- `/solutions/allplan-industry`
- `/solutions/architecture`
- `/solutions/ax3000`
- `/solutions/bimflex`
- `/solutions/bridge-design`
- `/solutions/infrastructure`
- `/solutions/mep`
- `/solutions/modeling-of-precast-girder-bridges`
- `/solutions/precast`
- `/solutions/pythonpart`
- `/solutions/road-railway`
- `/solutions/site-planning`
- `/solutions/steel`
- `/solutions/structural`

### Metrikler (11)

- `/solutions/allplan-industry`
- `/solutions/architecture`
- `/solutions/bridge-design`
- `/solutions/imar-yonetmeligi-bim-eklentisi`
- `/solutions/infrastructure`
- `/solutions/mep`
- `/solutions/precast`
- `/solutions/road-railway`
- `/solutions/site-planning`
- `/solutions/steel`
- `/solutions/structural`

### Zorluklar (10)

- `/solutions/allplan-industry`
- `/solutions/architecture`
- `/solutions/bridge-design`
- `/solutions/infrastructure`
- `/solutions/mep`
- `/solutions/precast`
- `/solutions/road-railway`
- `/solutions/site-planning`
- `/solutions/steel`
- `/solutions/structural`

### Avantajlar (29)

- `/products/allplan-aec`
- `/products/allplan-basic`
- `/products/allplan-bimplus`
- `/products/allplan-concept`
- `/products/allplan-professional`
- `/products/allplan-ultimate`
- `/products/ax3000`
- `/products/civil`
- `/products/precast`
- `/products/precast-detail`
- `/products/sds2-home`
- `/solutions/addons/2d-dwg-converter`
- `/solutions/addons/drive-curve`
- `/solutions/addons/geometry-tools`
- `/solutions/addons/steel-components`
- `/solutions/addons/three-dimensioning`
- `/solutions/allplan-industry`
- `/solutions/architecture`
- `/solutions/ax3000`
- `/solutions/bimflex`
- `/solutions/bimx5`
- `/solutions/bridge-design`
- `/solutions/infrastructure`
- `/solutions/mep`
- `/solutions/precast`
- `/solutions/road-railway`
- `/solutions/site-planning`
- `/solutions/steel`
- `/solutions/structural`

### Ana özellikler (8)

- `/products/allplan-basic`
- `/products/allplan-cloud-services`
- `/products/allplan-concept`
- `/products/allplan-professional`
- `/products/allplan-ultimate`
- `/products/civil`
- `/solutions/bimflex`
- `/solutions/pythonpart`

### Kategorili SSS (2)

- `/solutions-v2/connect-license/how-to-assign`
- `/solutions-v2/faq`
