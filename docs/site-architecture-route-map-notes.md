# Site mimarisi — mevcut URL eşleme notları

22.10.2026 — Planlama çıktısı; uygulama ve yayın onayı değildir.

[URL görev matrisi](site-architecture-route-map.csv), [özgün URL envanterindeki](00-inventory/url-map.csv) **131 satırın tamamını, aynı sırayla ve özgün 12 sütununu değiştirmeden** taşır. Ek sekiz `ia_*` / görev sütunu yeni bilgi mimarisi önerisini gösterir. Özgün `proposed_url` ve `migration_action` alanları tarihsel kanıttır; yeni öneri için `ia_proposed_url` ve `ia_url_treatment` okunmalıdır. Eski `exclude_from_2027_sitemap_keep_as_issue` değeri bu çalışma ile yeniden onaylanmaz.

## Kaynak ve güncellik sınırı

- URL/status/canonical/title kanıtı: 19.10.2026 envanter snapshotı. Bugünkü HTTP sonucu değildir; bu tur canlı yeniden tarama yapılmadı.
- Anlamsal görevler: [21 Ekim sayfa sorumlulukları](page-responsibilities.md). Pilot dışı rotalara verilen görevler, envanterdeki rota/başlık ve grup bağlamına dayanan öneridir; tam metin yeniden yazımı değildir.
- Menüler, rol yolları, Profesyonel Hizmetler ve teknik kabuk: [22 Ekim kaynak incelemesi](00-inventory/global-state-source-review-2026-10-22.md).
- Son kullanıcı kararları: [karar kaydı](00-inventory/user-decisions.md); Eğitim tek giriş, periyodik webinar/video arşivi ve özel talep; eksik hedefler ertelenmiş karar kuyruğudur.
- Her satırın `mapping_basis` alanı kaynak ailesini belirtir; satır bazında yeni canlı doğrulama tarihi değildir.

**Tamlık iddiası yalnız bu 131 URL girdisine ilişkindir.** Harici CTA, Microsoft form dalları, PDF/video/görsel dosyaları ve sayfa içi anchorlar bu CSV'nin URL evrenine dahil değildir. Bu kayıt, mevcut medya ve etkileşim envanterlerinin yerine geçmez. Yalnız yerelde bulunan kayıtlar ayrı inceleme/onay durumunu korur; bu dosya onları canlı kabul ederek eklemez. Mevcut rota için yeni IA görevi atanması içerik-parite kontrolünü tamamlamaz.

## Gruplar

| Kod | Satır | Menü / görev yorumu |
|---|---:|---|
| `products` | 16 | Çok markalı ürün girişi, ALLPLAN, paketler, uzman seçenekler, kalıcı bulut hizmetleri |
| `solutions` | 56 | İş ihtiyacı, disiplin, eklenti ve ürüne bağlı uzman iş akışları; eski redirect girişleri de sayıya dahil |
| `resources` | 6 | Yıllık sürüm anlatımları, paket belgesi, ürüne bağlı belge/video kaynakları |
| `education-support` | 28 | Eğitim, video arşivi, webinar, kullanıcı/lisans yardım kaynakları |
| `corporate` | 7 | Ana sayfa, Hakkımızda, Referanslar, İletişim ve üç yasal sayfa |
| `utility` | 4 | Arama, health, robots ve sitemap; son üçü pazarlama sayfası değildir |
| `assets` | 1 | Open Graph görseli; sayfa/menü maddesi değildir |
| `review` | 13 | 11 eksik hedef + iki demo/teknik deneme rotası |
| **Toplam** | **131** | Menü öğesi sayısı değildir |

Gruplar editoryal keşif katmanıdır. `/solutions-v2/training` Eğitim ve Destek altında sunulabilir; yolu değiştirmek gerekmez. Kaynaklar altında sürüm sayfası gösterilmesi `/products/allplan-2026` URL'sini değiştirmez. Bir sayfa ana kategoriye ek olarak ilgili ürün/çözümden çapraz bağlantı alabilir; matriste tek ana görev gösterilmesi tek erişim yolu zorunluluğu değildir.

## URL davranışı ve bekleyen kararlar

| `ia_url_treatment` | Adet | Kural |
|---|---:|---|
| `preserve_same_url` | 113 | Özgün URL aynen önerilir; içerik/işlev doğruluğu veya yayın hazır oluş iddiası değildir |
| `preserve_existing_redirect` | 4 | Kaynak URL ve kaydedilmiş yönlendirme davranışı korunur; ayrı pazarlama sayfası yapılmaz |
| `preserve_alias_pending_decision` | 1 | Yazım varyantı 200 alias korunur; 301/canonical/birleştirme kararı açık |
| `review_publication_no_change` | 2 | `/hero-3d`, `/test-webgl`; silinmedi, kamuya açık yayın kapsamı ayrıca seçilir |
| `deferred_missing_target_decision` | 11 | Hedef önerisi boş; yeniden yazma, iptal veya eşdeğer hedef kararı sonra verilir |

Dört redirect girişi: `/solutions/PlanliAlanlar`, `/solutions/addons/drive-curvev`, `/solutions/extra-modules`, `/solutions/industry`. Mevcut hedef ve status alanları CSV'de özgün değerleriyle saklıdır; yeni yönlendirme önerilmedi. Alias: `/solutions/imar-yonetmliği-bim-eklentisi`. Düzeltilmiş yazımlı rota da ayrı satır olarak korunur.

Eksik hedeflerin tam listesi:

- `/allplan-2021-features`
- `/allplan-2026nin-ozellikleri`
- `/products/bimplus-signup`
- `/products/partner-solutions`
- `/products/sds2-detail`
- `/products/sds2-load`
- `/products/tim`
- `/solutions-v2`
- `/solutions/addon-channel`
- `/solutions/bimplus`
- `/try-free`

Bu liste, [URL kapanış kaydını](00-inventory/url-closure-2026-10-22.md) tamamlayan mimari görünümüdür. Benzer adlı çalışan üretici hedefi bulunması, hatalı yerel URL'yi otomatik ona yönlendirme yetkisi vermez.

## İçerik ve schema sınırları

- ALLPLAN kalıcı giriş ile AEC/Architecture anlatımları farklı görevlerdir; her URL için yeni yazılım entity'si üretilmez. Precast ayrıntı sayfası da otomatik ayrı ürün değildir.
- Basic/Concept/Professional/Ultimate paket kapsamı ortak kayıtla ilişkilendirilir. Civil/Precast bu basamakların üstü diye varsayılmaz. Fiyat yayımlanmaması kararı korunur.
- Üç 2026 konu sayfası aynı sürüme bağlı farklı konuları taşır; sonraki yıl eskisi ezilmez. Kalıcı bulut sayfası ile bulut yenilikleri ayrıdır.
- Eğitim alt URL'leri korunur; `/individual` için mevcut kayıt tutulması ayrı bir özel eğitim markası/menüsü önerisi değildir. Tek Eğitim hizmeti altında değerlendirilir. Gelecek webinar doğrulanmadan etkinlik, eski video listesi üzerinden düzenli kurs takvimi üretilmez.
- Connect/lisans kaynakları, Teams destek kanalı ve mevcut ticket platformu farklı erişim görevleridir. Bu route map yalnız yerel URL'leri kapsadığı için iki harici destek kanalı matriste yeni yerel sayfa olarak uydurulmaz.
- Teknik uçlar ve görsel dosyaları ürün/hizmet sayfası gibi işaretlenmez. Menü grubu ataması schema türü, canonical veya `@id` kararı değildir.
- Yeni kısa form girişleri bu çalışma ile yeni URL kazanmaz. `primary_next_step` bir hedef deneyimdir; çalışan mevcut bağlantı veya yeni rota ilanı değildir. Mevcut CTA → yeni niyet/form eşlemesi uygulamadan önce ayrı kaydedilir.

Bu tur schema uygulaması veya yeni Google kural araştırması yapılmadı; mevcut schema planının entity/sayfa ayrımı korunarak IA etkisi sınırlandı.

## Doğrulama

CSV tekrar okunarak 131 satır ve sıra eşliği, özgün 12 sütunun tüm değerlerinin birebir korunması, bütün satırlarda görev/grup bulunması ve 11 eksik hedef dışındaki 120 girdinin `ia_proposed_url` değerinin özgün URL ile eşitliği kontrol edildi. HTTP, tarayıcı, uygulama veya schema testi çalıştırılmadı; bunlar belge bütünlüğü kontrolleridir.
