# Çözüm merkezleri: içerik, bağlantı ve adres taşıma taslağı

Durum: **taslak; adresler ve 301 yönlendirmeleri onay ve uygulama bekliyor**. Bu envanter 3 Kasım 2026 tarihli `src/data/navigation.json`, `src/data/homepage.json` ve `src/data/pages.json` verilerine dayanır; canlı site, mevcut indeksleme ve önerilen adreslerin tüm olası altyapı çakışmaları doğrulanmadı.

## Ana sayfa, footer ve önerilen yönlendirmeler

| Ana sayfa kartı | Alt başlık | Açıklama | Buton | Kaynak görsel | Mevcut hedef | Önerilen hedef |
|---|---|---|---|---|---|---|
| BİNA TASARIMI | Mimari & Mühendislik | Tasarım, Strüktürel Analiz, MEP ve Endüstriyel çözümler. | Çözümleri İncele | /assets/solutions/architecture-hero.jpg | /solutions-v2/building-design | /cozumler/bina-tasarimi |
| ALTYAPI TASARIMI | Yol & Köprü | Köprü, Tünel ve Yol projeleri için parametrik modelleme. | Keşfet | /assets/solutions/infrastructure-hero.jpg | /solutions-v2/infrastructure | /cozumler/altyapi-tasarimi |
| İNŞAAT PLANLAMASI | Prekast & Çelik | Üretimden şantiyeye kesintisiz veri akışı. | Detaylar | /assets/solutions/precast-hero.jpg | /solutions-v2/construction | /cozumler/insaat-planlamasi |
| EKLENTİLER | Add-ons & Tools | Özelleştirilmiş eklentiler ve araçlar. | İncele | /assets/product-engineering.jpg | /solutions-v2/addons | /eklentiler |
| DİĞER ÇÖZÜMLERİMİZ | Bimplus & More | İşbirliği ve tamamlayıcı ürünler. | Göz At | /assets/solutions/architecture-hero.jpg | /solutions-v2/other | /cozumler/diger-urunler |

Ana sayfada `HomepageView.tsx`, kaynak görsellerin yerine aşağıdaki önizleme görsellerini kullanır:

| Merkez | Ekranda kullanılan görsel |
|---|---|
| Bina Tasarımı | `/assets/previews/solutions/building-web.jpg` |
| Altyapı Tasarımı | `/assets/previews/solutions/infrastructure-web.jpg` |
| İnşaat Planlaması | `/assets/previews/solutions/construction-web.jpg` |
| Eklentiler | `/assets/previews/solutions/addons-web.jpg` |
| Diğer Çözümlerimiz | `/assets/previews/solutions/other-web.jpg` |

Öneri: yukarıdaki mevcut hedeflerden aynı satırdaki yeni hedefe **tek adımda HTTP 301**. Bunlar henüz uygulanmadı; `solutions-v2` altındaki diğer rehber ve lisans sayfaları bu haritanın kapsamı dışındadır. Footer çözüm bağlantıları aynı beş eski hedefe gider; üst çözümler menüsü grup adları altında doğrudan aşağıdaki kart hedeflerine gider, hub adreslerine gitmez.

## Kaynak hub kartları ve katalog karşılaştırması

Hub kartları `SolutionHubSection` üzerinden `hubItems` listesini kullanır; Bina Tasarımı örneği ortak katalog sunumunu, diğerleri `SolutionDirectoryCard` kullanır. Bina örneğinde mevcut dört metin ve hedef korunarak, eşleşen katalog görselleri gösterilir. Aşağıda hub kartlarının gerçek değerleri korunmuştur: mevcut 21 hub kartında `image` alanı yoktur. Katalog görseli ve açıklamaları ayrı `catalogItems` verisidir; bunların huba aktarımı tasarım kararı olarak ele alınmalıdır. Dış bağlantı yeni sekmede açılır.

### BİNA TASARIMI — `/solutions-v2/building-design`

Mevcut sayfa H1: **BİNA TASARIMI**. SEO başlığı: Bina Tasarımı Çözümleri — Mimari, Yapısal ve MEP BIM | Aluplan. Meta açıklaması: BİNA TASARIMI: Mimari, Strüktürel ve MEP disiplinleri için entegre tasarım araçları. Mevcut canonical: `https://aluplan.com.tr/solutions-v2/building-design`.

| Hub kartı / menü adı | Hedef | Hub açıklaması | Hub görseli |
|---|---|---|---|
| Mimari | `/solutions/architecture` | Profesyonel çözüm paketi. | Yok |
| Strüktürel Mühendislik | `/solutions/structural` | Profesyonel çözüm paketi. | Yok |
| MEP | `/solutions/mep` | Profesyonel çözüm paketi. | Yok |
| ALLPLAN ENDÜSTRİ ÇÖZÜMLERİ | `/solutions/allplan-industry` | Profesyonel çözüm paketi. | Yok |

`/solutions` kataloğundaki ilgili kayıtlar (sıra ve yazım kendi verisindeki gibidir):

| Katalog adı | Hedef | Açıklama | Görsel (alt metni) |
|---|---|---|---|
| Mimari | `/solutions/architecture` | Yaratıcı vizyonunuzu kusursuz bir şekilde gerçeğe dönüştüren, tasarım özgürlüğü ve hassasiyeti bir arada sunan kapsamlı BIM çözümü. | `/assets/solutions/architecture-hero.jpg` (Mimari) |
| Strüktürel Mühendislik | `/solutions/structural` | Karmaşık yapısal analizlerden detaylandırmaya kadar, güvenli ve optimize edilmiş yapılar için güçlü mühendislik araçları. | `/assets/solutions/structural-hero.jpg` (Strüktürel Mühendislik) |
| MEP | `/solutions/mep` | Mekanik, elektrik ve sıhhi tesisat sistemlerinin entegre tasarımı ve koordinasyonu için gelişmiş modelleme yetenekleri. | `/assets/solutions/mep-hero.jpg` (MEP) |
| ALLPLAN Endüstri Çözümleri | `/solutions/allplan-industry` | Endüstriyel tesisler ve özel yapılar için özelleştirilmiş, yüksek performanslı tasarım ve detaylandırma çözümleri. | `/assets/solutions/architecture-hero.jpg` (ALLPLAN Endüstri Çözümleri) |

### ALTYAPI TASARIMI — `/solutions-v2/infrastructure`

Mevcut sayfa H1: **ALTYAPI TASARIMI**. SEO başlığı: Altyapı Tasarımı — Köprü, Yol, Tünel ve Geoteknik BIM | Aluplan. Meta açıklaması: ALTYAPI TASARIMI: Yol, köprü ve tünel projeleri için parametrik modelleme çözümleri. Mevcut canonical: `https://aluplan.com.tr/solutions-v2/infrastructure`.

| Hub kartı / menü adı | Hedef | Hub açıklaması | Hub görseli |
|---|---|---|---|
| Altyapı Mühendisliği | `/solutions/infrastructure` | Profesyonel çözüm paketi. | Yok |
| Yol ve Demiryolu Tasarımı | `/solutions/road-railway` | Profesyonel çözüm paketi. | Yok |
| Köprü Tasarımı | `/solutions/bridge-design` | Profesyonel çözüm paketi. | Yok |

`/solutions` kataloğundaki ilgili kayıtlar (sıra ve yazım kendi verisindeki gibidir):

| Katalog adı | Hedef | Açıklama | Görsel (alt metni) |
|---|---|---|---|
| Altyapı Mühendisliği | `/solutions/infrastructure` | Karmaşık altyapı projeleri, tüneller ve yeraltı yapıları için hassas modelleme ve planlama araçları. | `/assets/solutions/infrastructure-hero.jpg` (Altyapı Mühendisliği) |
| Yol ve Demiryolu Tasarımı | `/solutions/road-railway` | Parametrik yol ve demiryolu tasarımı ile güzergah planlamasından detaylı kesitlere kadar eksiksiz çözüm. | `/assets/solutions/road-railway-hero.jpg` (Yol ve Demiryolu Tasarımı) |
| Köprü Tasarımı | `/solutions/bridge-design` | Parametrik modelleme ile her türlü köprü tipini verimli bir şekilde tasarlayın, analiz edin ve detaylandırın. | `/assets/solutions/bridge-hero.jpg` (Köprü Tasarımı) |

### İNŞAAT PLANLAMASI — `/solutions-v2/construction`

Mevcut sayfa H1: **İNŞAAT PLANLAMASI**. SEO başlığı: İnşaat Planlaması, Prekast, Çelik ve Şantiye Çözümleri | Aluplan. Meta açıklaması: İNŞAAT PLANLAMASI: Prekast ve çelik üretimi için detaylandırma ve şantiye yönetimi. Mevcut canonical: `https://aluplan.com.tr/solutions-v2/construction`.

| Hub kartı / menü adı | Hedef | Hub açıklaması | Hub görseli |
|---|---|---|---|
| Prekast Üretimi | `/solutions/precast` | Profesyonel çözüm paketi. | Yok |
| Çelik Detaylandırma & İmalat | `/solutions/steel` | Profesyonel çözüm paketi. | Yok |
| Şantiye Planlaması | `/solutions/site-planning` | Profesyonel çözüm paketi. | Yok |

`/solutions` kataloğundaki ilgili kayıtlar (sıra ve yazım kendi verisindeki gibidir):

| Katalog adı | Hedef | Açıklama | Görsel (alt metni) |
|---|---|---|---|
| Prekast Üretimi | `/solutions/precast` | Otomatikleştirilmiş prekast tasarım ve üretim süreçleri ile verimliliği artırın ve hataları en aza indirin. | `/assets/solutions/precast-hero.jpg` (Prekast Üretimi) |
| Çelik Detaylandırma & İmalat | `/solutions/steel` | SDS2 entegrasyonu ile çelik yapıların detaylandırılması ve imalat verilerinin otomatik oluşturulması. | `/assets/solutions/steel-hero.jpg` (Çelik Detaylandırma & İmalat) |
| Şantiye Planlaması | `/solutions/site-planning` | Şantiye sahasını 3B olarak planlayın, vinç konumlarını optimize edin ve lojistik süreçlerini simüle edin. | `/assets/solutions/site-planning-hero.jpg` (Şantiye Planlaması) |

### EKLENTİLER — `/solutions-v2/addons`

Mevcut sayfa H1: **EKLENTİLER**. SEO başlığı: ALLPLAN Eklenti Kataloğu ve Üretkenlik Modülleri | Aluplan. Meta açıklaması: EKLENTİLER: Projenize güç katan özel modüller ve araçlar. Mevcut canonical: `https://aluplan.com.tr/solutions-v2/addons`.

| Hub kartı / menü adı | Hedef | Hub açıklaması | Hub görseli |
|---|---|---|---|
| CDS Add-On | `/solutions/cds-addon` | Profesyonel çözüm paketi. | Yok |
| Allto PytonPart Generator | `https://allplantools.com/` (dış) | Profesyonel çözüm paketi. | Yok |
| Allto PytonPart | `/solutions/pythonpart` | Profesyonel çözüm paketi. | Yok |
| AX3000 MEP | `/solutions/ax3000` | Profesyonel çözüm paketi. | Yok |
| Scalypso | `/solutions/scalypso` | Profesyonel çözüm paketi. | Yok |

`/solutions` kataloğundaki ilgili kayıtlar (sıra ve yazım kendi verisindeki gibidir):

| Katalog adı | Hedef | Açıklama | Görsel (alt metni) |
|---|---|---|---|
| CDS Add-On | `/solutions/cds-addon` | Kablo ve boru sistemleri için eklenti çözümü. Tesisat projelerinizde hız kazanın. | `/assets/solutions/mep-hero.jpg` (CDS Add-On) |
| Allto PythonPart Generator | `https://allplantools.com/` (dış) | Kod yazmadan kendi parametrik PythonPart nesnelerinizi oluşturun ve iş akışlarınızı otomatikleştirin. | `/assets/solutions/architecture-hero.jpg` (Allto PythonPart Generator) |
| Allto PythonPart | `/solutions/pythonpart` | Python tabanlı parametrik nesneler ile tekrarlayan görevleri otomatikleştirin ve tasarım hızınızı artırın. | `/assets/solutions/architecture-hero.jpg` (Allto PythonPart) |
| AX3000 MEP | `/solutions/ax3000-mekanik-tesisat` | Entegre enerji analizi ve tesisat hesaplamaları ile sürdürülebilir bina sistemleri tasarlayın. | `/assets/solutions/mep-hero.jpg` (AX3000 MEP) |
| Scalypso | `/solutions/scalypso` | Nokta bulutu verilerini işleyin ve mevcut yapıları hassas bir şekilde BIM modellerine dönüştürün. | `/assets/solutions/site-planning-hero.jpg` (Scalypso) |

### DİĞER ÜRÜNLER — `/solutions-v2/other`

Mevcut sayfa H1: **DİĞER ÇÖZÜMLERİMİZ**. SEO başlığı: Tamamlayıcı BIM Çözümleri, Maliyet ve Eklenti Ailesi | Aluplan. Meta açıklaması: DİĞER ÇÖZÜMLERİMİZ: İşbirliği platformları ve tamamlayıcı mühendislik araçları. Mevcut canonical: `https://aluplan.com.tr/solutions-v2/other`.

| Hub kartı / menü adı | Hedef | Hub açıklaması | Hub görseli |
|---|---|---|---|
| BIMFlex | `/solutions/bimflex` | Profesyonel çözüm paketi. | Yok |
| Donatı Mühendisliği | `/solutions/rebar-engineering` | Profesyonel çözüm paketi. | Yok |
| İmar Yönetmeliği BIM Eklentisi | `/solutions/imar-yonetmeligi-bim-eklentisi` | Profesyonel çözüm paketi. | Yok |
| BIMX5 | `/solutions/bimx5` | Profesyonel çözüm paketi. | Yok |
| Allplan Oska İşbirliği | `/solutions/oska` | Profesyonel çözüm paketi. | Yok |
| Allplan Poz Kataloğu | `/solutions/poz-catalog` | Profesyonel çözüm paketi. | Yok |

`/solutions` kataloğundaki ilgili kayıtlar (sıra ve yazım kendi verisindeki gibidir):

| Katalog adı | Hedef | Açıklama | Görsel (alt metni) |
|---|---|---|---|
| BIMFlex | `/solutions/bimflex` | FlexSoft ve Aluplan satış ortaklığı kapsamında Aluplan tarafından da sunulabilen Allplan donatı otomasyonu eklenti paketi. | `/assets/solutions/bimflex/kolon-model.png` (BIMFlex) |
| Allplan BIMPLUS | `/products/allplan-bimplus` | Bulut tabanlı BIM işbirliği platformu ile tüm proje paydaşlarını tek bir merkezde buluşturun. | `/assets/solutions/architecture-hero.jpg` (Allplan BIMPLUS) |
| BIMX5 | `/solutions/bimx5` | İhale, Metraj, Hakediş ve BIM modellemesi için nihai çözüm. Allplan ve 2b dwg Converter hızıyla. | `/assets/solutions/oska/bimx5-section.jpg` (BIMX5) |
| Donatı Mühendisliği | `/solutions/rebar-engineering` | Otomatik donatı detaylandırma ve metraj raporlama araçları ile betonarme projelerinde hız kazanın. | `/assets/solutions/structural-hero.jpg` (Donatı Mühendisliği) |
| İmar Yönetmeliği BIM Eklentisi | `/solutions/imar-yonetmeligi-bim-eklentisi` | Projelerinizin Planlı Alanlar İmar Yönetmeliğine uygunluğunu otomatik olarak kontrol edin ve raporlayın. | `/assets/solutions/planli-alanlar/planla-hesapla.png` (İmar Yönetmeliği BIM Eklentisi) |
| Allplan Oska İşbirliği | `/solutions/oska` | Allplan metraj verilerini Oska yaklaşık maliyet ve hakediş yazılımlarına doğrudan aktarın. | `/assets/solutions/oska/hero-banner.jpg` (Allplan Oska İşbirliği) |
| Allplan Poz Kataloğu | `/solutions/poz-catalog` | Türkiye poz birim fiyat kataloğu entegrasyonu ile keşif ve maliyet hesaplamalarınızı otomatikleştirin. | `/assets/solutions/architecture-hero.jpg` (Allplan Poz Kataloğu) |

## Ayrı CDS sayfası

`/solutions/addons` mevcut ayrı bir CDS eklentileri koleksiyonudur; H1: **CDS Eklentiler**. Meta açıklaması: Allplan için güçlü eklenti çözümleri. `https://aluplan.com.tr/solutions/addons` canonical adresine sahiptir. Aşağıdaki dokuz içerik ve alt adres bu taslaktaki `/solutions-v2/addons` → `/eklentiler` yönlendirmesiyle birleştirilmez veya silinmez. Birebir taşıma ya da ek yönlendirmeler ayrıca değerlendirilmelidir.

| Ad | Açıklama | Hedef | Görsel |
|---|---|---|---|
| Sürüş Eğrisi | Drive Curve | `/solutions/addons/drive-curve` | `/assets/solutions/cds/surus-egirisi.webp` (Sürüş Eğrisi) |
| Çelik Profil Bileşenleri | Çelik konstrüksiyon – Vidalar – Levhalar | `/solutions/addons/steel-components` | `/assets/solutions/cds/celik-profil-bilesenleri.webp` (Çelik Profil Bileşenleri) |
| Parametrik Arazi | Kazıdan fazlası | `/solutions/addons/parametric-terrain` | `/assets/solutions/cds/parametrik-arazi.webp` (Parametrik Arazi) |
| Rampa | Ramp | `/solutions/addons/ramp` | `/assets/solutions/cds/ramp.webp` (Rampa) |
| Geometri Araçları | Geometry Tools | `/solutions/addons/geometry-tools` | `/assets/solutions/cds/geometri-araclari.webp` (Geometri Araçları) |
| 2B DWG Converter | 2B elemanların hızlı dönüşümü | `/solutions/addons/2d-dwg-converter` | `/assets/solutions/cds/2b-dwg-converter.webp` (2B DWG Converter) |
| 3B Ölçülendirme | Serbest 3B Ölçülendirme | `/solutions/addons/three-dimensioning` | `/assets/solutions/cds/3d-dimensioning.jpeg` (3B Ölçülendirme) |
| Grafiksel Yazı | Vektörleştirilmiş ve 3B metinler | `/solutions/addons/graphical-text` | `/assets/solutions/cds/graphic-text.jpeg` (Grafiksel Yazı) |
| SketchUp Dönüştürücü | Dokularla Allplan import, Lumion export, vb. | `/solutions/addons/sketchup-converter` | `/assets/solutions/cds/sketchup-converter.jpg` (SketchUp Dönüştürücü) |

## İnceleme ve uygulama bağımlılıkları

- BIMPLUS, `/solutions` diğer ürünler kataloğunda `/products/allplan-bimplus` ile bulunuyor; altı kartlı diğer ürünler hubında ve çözümler menüsünün bu grubunda yok. Ana sayfa alt başlığı “Bimplus & More”; ürünler menüsünde ayrı mevcut. İçerik birleştirilirse kapsam kaybı engellenmeli, yeni bir içerik uydurulmamalı.
- AX3000 MEP hub ve çözümler menüsünde `/solutions/ax3000`, katalogda ve ürünler menüsünün mekanik tesisat satırında `/solutions/ax3000-mekanik-tesisat`; `/products/ax3000` ürünler menüsünde enerji simülasyonu olarak ayrı. Eşdeğerlik ve gerçek hedefler ayrıca doğrulanmadan bu adresler birleştirilmemeli.
- Hub `Allto PytonPart` yazımları ile katalog `Allto PythonPart` yazımları farklıdır; envanterde aynen korunmuştur. Düzenleme içerik kararı gerektirir.
- Yeni adresler, catch-all çözümlemesi ve olası statik/dinamik rota çakışmaları; her eski URL için gerçek HTTP **301** ve tek atlamalı `Location`; query string ve fragment davranışı, sonsuz döngü, hedeflerin 200 yanıtı, bağlantılar ve yönlendirme zincirleri test edilmeli. Next.js kalıcı yönlendirme seçeneği 308 döndürebilir; 301 varsayılmamalı.
- Ana sayfa, footer, üst menü, breadcrumb, iç bağlantılar, canonical, Open Graph, yapılandırılmış veri, sitemap, robots/noindex ve üretim ortamı birlikte kontrol edilmeli. Değişiklik sonrası yalnız yeni canonical adresler indekslenmeli; mevcut dış bağlantılar ve alt sayfalar korunmalı.
- Canlı kaynak URL, içerik, görsel hakları, arama konsolu ve mevcut trafik/indeks durumu henüz bu doküman kapsamında doğrulanmadı. Adreslerin SEO faydası garanti değildir; mevcut URL değerini korumak için gerçek canlı rota ve bağlantı envanteri ile karşılaştırılmalı.
- Yeniden tasarım için örnek Bina Tasarımı sayfasında mevcut hub kartlarının dört hedefi ve menü bağlantıları korunmalı; katalogdaki görseller/açıklamalar kullanılırsa kaynak metinler eksiksiz ve doğrulanarak taşınmalı. Ortak bileşen, mobil, erişilebilirlik ve azaltılmış hareket kontrolleri yapılmalı.
