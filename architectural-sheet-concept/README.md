# Aluplan — Architectural Sheet Concept

22.10.2026 — Ayrı tasarım alternatifi. Aşama 1: tasarım gerekçesi ve kompozisyon önerisi; kullanıcı onayı bekleniyor. Henüz uygulama veya yeni Next.js kurulumu yok. Önceki antrasit önizleme korunur.

## Tasarım gerekçesi

Mimari pafta, sayfa süsü yerine gezinme ve bilgi gruplama sistemi olur. Her bölümün açık adı, kararlı anchor kimliği ve pafta numarası vardır. Teknik işaretlerin yanında herkesin anlayacağı Ürünler, Çözümler, Eğitim ve Destek etiketleri korunur. Asimetri ve çizgi hiyerarşisi bilgi önceliğini gösterir; içerik eşit kart kutularına bölünmez.

## Kompozisyon önerisi

| Pafta | Kompozisyon | İçerik ve davranış |
|---|---|---|
| A-000 Kapak | Solda asimetrik başlık, sağda hafif özgün SVG yapı çizimi, alt sağda antet | Tek Teklif İste CTA'sı. Ücretsiz deneme ürün bağlamında erişilebilir. Üreticiye ait proje/model sanılmayacak soyut çizim. |
| A-101 Vaziyet | Geniş cevap paragrafı ve ince çizgilerle ayrılan görev satırları | Aluplan'ın distribütör/çözüm ortağı rolü, Türkiye hizmet alanı; kaynaklı tanım. Yeni başarı sayısı veya slogan iddiası yok. |
| A-201 Ürünler | Sol düşey ürün indeksi, sağ geniş bilgi paftası | Altı ürünün tüm içeriği ilk HTML'de; erişilebilir tabs, klavye ve hash bağlantısı. Paket PDF'si bu bölümde. Yeni ürün/paket hakkı türetilmez. |
| A-301 Çözümler | Yatay kesit satırları, sıra numarası, disiplin ve açıklama | Kaynak çözüm alanları, mevcut hedefler. BIMFlex açık FlexSoft ortaklık detayı olarak bu paftaya bağlı. |
| A-401 Teknik detaylar | Numaralı detay çağrıları ve native details/summary | Kanıtlı teknik gereksinim, lisans ve entegrasyon içeriği; eksik koşullar uydurulmaz. |
| A-501 Referanslar | Fotoğraf/çizim ağırlıklı asimetrik proje dizini | Yalnız gerçek kaynak kayıtları. Ölçek, yıl, kullanılan yazılım bilinmiyorsa eklenmez. Veri yeterli değilse örnek gerçek proje üretimi yerine bölüm kapsamı açık bırakılır. |
| A-601 Eğitim ve Destek | Üstte görünür görev satırları, altta kaynak indeksi | Webinar/video arşivi, eğitim talebi, Teams ve ticket erişimi. Mevcut hizmet/kaynak kayıtları kaybolmaz; düzenli kurs takvimi varsayılmaz. |
| A-701 Revizyonlar | Gerçek table: sürüm, doğrulanmış tarih, açıklama ve bağlantı | Kaynak ALLPLAN 2026 yenilikleri; tarihsiz kayıt için tarih icat edilmez. Görsel revizyon metaforu ürün yaşam döngüsü statüsü üretmez. |
| A-801 İletişim / Antet | Firma, iletişim, pafta dizini ve yasal bağlantılar için çizgili büyük antet | Mevcut iletişim bilgileri, sosyal hedefler ve geliştirici kredisi. Gerçek ölçeği olmayan web görünümünde ölçek: uygulanmaz. Mobilde ana iletişim görünür, ikincil antet ayrıntıları açılabilir. |

Hero altındaki mevcut beş bağlantıdan oluşan serbest link şeridi bu alternatifte kullanılmaz. Hedefler ürün, revizyon ve Eğitim paftalarındaki bağlamlarına taşınır; içerik/URL silinmez. Pafta indeksi anchor gezinmesidir; yeni public URL kararı değildir.

## Token eşlemesi ve önerilen ekler

Tek doğruluk kaynağı mevcut tasarım sisteminin tokens/tokens.json dosyasıdır. Bu çalışma ayrı kopya/tema varyantı kullanacaktır; kabul edilen önizleme değişmez.

- Mevcut semantic surface, text, font, spacing, radius, breakpoint ve motion tokenları yeniden kullanılır.
- Aluplan antrasit yüzeyleri ve radius.surface=0 korunur. Mevcut yerel Manrope, IBM Plex Sans ve IBM Plex Mono kullanılır; yeni font ailesi gerekmez.
- Turuncu için mevcut palette uygun marka skalası bulunmadı; amber warning tokenı marka aksanı olarak yeniden kullanılmaz. Öneri: primitive orange 100/400/500/700 ve ayrı sheet tema semantic accent/action/focus eşlemeleri. Prompttaki hex değerleri adaydır; kontrast testinden sonra kesinleşir.
- Pafta çizgileri için semantic sheet.line.hairline/default/emphasis önerilir. 0.25/0.5/1 px adayları cihaz/render okunabilirliği ve etkileşimli sınır kontrastı testinden sonra seçilir. İnce dekoratif aks ile etkileşimli sınır ayrılır.
- Grid ölçüleri, çizim geometrisi ve SVG viewBox koordinatları içerik/kompozisyon verisidir; renk, çizgi, boşluk ve hareket kararları tokenlardan gelir.
- Süreler mevcut 150/200/300 ms motion tokenlarına bağlanır. Eksik hareket mesafesi veya pafta ölçüsü gerekiyorsa gerekçeli semantic ek olarak önce belgelenir.

Turuncu yalnız CTA, focus, aktif sekme ve sınırlı kesit işaretlerinde kullanılır. Hedef görünür alanın %8'inden azıdır; henüz ölçülmüş kabul değildir. Gövde metni nötrdür. Taslak marka kılavuzundaki turuncu yasağıyla fark, kullanıcının yeni alternatif talebi kapsamında bu konsepte özgü öneridir; genel marka kararı değildir.

## Önceki stratejiyi koruyan uygulama sınırları

- Prompttaki /urunler/[slug] vb. yollar otomatik uygulanmaz; mevcut public URL'ler esas kalır. Değişiklik gerekirse ayrı 301 karar listesi hazırlanır.
- Organization/LocalBusiness, SoftwareApplication/Product, Course/Event ve FAQPage her sayfaya topluca eklenmez. Mevcut schema stratejisi sayfa amacı, görünür içerik ve kanıta göre esas alınır. Fiyat, yorum, etkinlik tarihi veya kurs verisi üretilmez. FAQ akordiyonu rich result garantisi değildir.
- Sonraki ürün detay örneği, doğrulanmış içerik ve hedefe sahip mevcut bir ürün üzerinden seçilir. Gerçek JSON-LD ancak schema planı ve örnek uygulama kapsamı onaylandığında hazırlanır.
- Teknik alt sınırlar, performans ve font bütçeleri önce hedef olarak kaydedilir. Lighthouse laboratuvar sonucu, gerçek kullanıcı CWV veya INP kanıtı diye sunulmaz. Font yüklemek tek başına CLS=0 garantisi değildir. JS bütçesi Next.js framework dahil üretim çıktısından ölçülür.
- Çizgi çizilmesi stroke-dashoffset gerektirirken prompt yalnız transform/opacity animasyonu istiyor. Öneri: sabit SVG çizgisini transform ile açılan maske içinde göstererek aynı görsel etkiyi üretmek; layout animasyonu ve ağır scroll kütüphanesi yok.
- llms.txt ve GEO metinleri sıralama/alıntılanma garantisi olarak sunulmaz.

## Aşama durumu

1. Brif ve kompozisyon: hazır, onay bekliyor.
2. Token eşlemesi ve pafta bileşenleri: henüz uygulanmadı.
3. Ana sayfa ve ürün detay örneği: henüz uygulanmadı.

Bu aşamada yayınlanan JS: 0 bayt; yalnız doküman üretildi. Client component: yok. İleride yalnız tabs, mobil menü ve gerekiyorsa hareket enhancement adacığı client olur; içerik Server Components içinde kalır. Kod yazılmadığı için Lighthouse, CWV, SSR, kontrast, reduced-motion ve Rich Results Test kabulü henüz ölçülmedi.

## Aşama 2 — Bileşen sistemi hazır

Kullanıcının `uyguun` onayıyla ayrı Next.js App Router/TypeScript strict örneği oluşturuldu. Bu aşamada `/` ana sayfa yerine bileşen kataloğudur. Ana sayfa ve ürün detayı aşama 3'te hazırlanacak.

- Önizleme: http://127.0.0.1:8771/
- Teknoloji: Next.js 16.4.2, React 19.3.1, pnpm kilit dosyası; sürümler kurulum anında registry'den doğrulandı.
- Kaynak: `tokens/tokens.json`; primitive → semantic → component zinciri korunur. `tokens/provenance.json` önceki sistemin salt okunur kaynak hashlerini ve yerel farkları kaydeder.
- Yeni `sheet` teması ayrı tutulur. Orange 500/400 koyu tema eylemleri, Orange 800 açık tema metin/buton kontrastı içindir. İlk Orange 700 açık tema adayının 3,79:1 sonucu yetersiz bulundu; 800'e düzeltildi. Durum/warning renkleri marka aksanına dönüştürülmedi.
- `sheet.line.hairline/fine/outline`, pafta rail/title/drawing ölçüleri ve drawing/hatch opaklıkları gerekçeli yeni tokenlardır. Responsive CSS, mevcut 30/48/64/80 rem build-time breakpointlerinden üretilir.
- Başlık/gövde mevcut Manrope ailesine, meta mevcut IBM Plex Mono'ya bağlandı. Yalnız bu iki ailenin Latin/Latin-ext dosyaları taşındı: toplam 58.728 bayt. IBM Plex Sans ek yükü alınmadı. Next yerel font değişkenleri html üzerinde primitive font adapter'ına bağlanır; bileşen CSS'i yalnız semantic fontları tüketir. Yeni font ailesi yok.
- `components/sheet.tsx`: AxisGrid, DimensionLine, SectionMarker, DetailCallout, TitleBlock, HatchPattern, ScaleBar, NorthArrow ve kompozisyon yardımcıları. Hepsi Server Component; özel client bileşeni yok.
- Katalog metni `content/specimen.ts` ve page içindeki teknik açıklamalardır; ürün içerik modeli/schema değiştirilmez. SVG çizim özgün, şematik ve dekoratif olarak işaretlidir. SVG id'si useId ile izole edilir.

### Komutlar

Bu klasörde:

```sh
pnpm install --frozen-lockfile
pnpm tokens
pnpm test
pnpm typecheck
pnpm build
pnpm start
```

`pnpm dev` aynı 8771 portunda geliştirme sunucusu açar; çalışan production preview ile aynı anda başlatılmaz. `pnpm tokens:check` üretilmiş CSS drift'ini de doğrular. `public/fonts/` içinde OFL lisansları vardır.

### Doğrulama ve açık kabul maddeleri

- Testler 6/6, TypeScript ve üretim build geçti; rota statik önceden render edildi.
- 282 kontrast çifti / 0 başarısız (3 tema × 2 mod; sheet için 94 çift). Bu yalnız kayıtlı token çiftlerini doğrular; tam WCAG denetimi değildir.
- Masaüstü ve gerçek 390 CSS px görünümde yatay taşma 0. Test tarayıcısı %110 zoom kullandığı için cihaz genişliği ile CSS viewport ölçüsü ayrı denetlendi.
- Tek h1; dekoratif SVG'ler aria-hidden. Native details, script execution kapalıyken AX tıklamasıyla açıldı ve içerik erişilebilirlik ağacında görüldü. Reduced-motion'da scroll auto, animation none.
- Tarayıcıda semantic font override'ı başlık ailesini Next sans → monospace → Next sans değiştirdi. İncelemede ilk font bypass ve html/body scope hataları düzeltildi; ikinci kontrol onaylandı.
- Console warning/error 0; ekran görüntüsü `evidence/components-preview.png`.
- Framework dahil başlangıç harici script gzip toplamı **179.860 bayt**. Prompttaki <90.000 bayt hedefi **sağlanmadı**. Ölçüm soğuk önbellekte ilk HTML'nin script src kayıtlarını tek tek gzip eder; inline bootstrap/RSC dahil değildir. Gerçek network transfer ve toplam yürütme maliyetiyle eşit sayılmaz. Sıfır özel client component, sıfır framework JS demek değildir.
- Lighthouse/CWV/INP ölçülmedi; hedefler kabul edilmiş sonuç sayılmıyor. Turuncu kaplama oranı %8 eşiği sayısal olarak ölçülmedi. Ana sayfa, ürün tabları, JSON-LD/Rich Results Test ve animasyon aşama 3 kapsamında; henüz tamamlandı işaretlenmez.

Önceki önizleme korunur. Bu bileşen adımının ardından, kullanıcı değerlendirmesiyle gerçek Aluplan ana sayfa kompozisyonuna geçilir.

Teknik kaynak: https://nextjs.org/docs/app/getting-started/installation (22.10.2026 erişimi).
