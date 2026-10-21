# Profesyonel Hizmetler: ayrı değerlendirme ve konumlandırma notu

21.10.2026 — Planlama notu; uygulama, içerik, sekme sırası veya bağlantı hedefi değiştirilmedi.

## İşletim bağlamı

Kullanıcı, ana sayfanın alt bölümündeki **Profesyonel Hizmetler** alanının Aluplan yetkilileri için önemli olduğunu, mevcut yapıyı yıllar içinde geliştirdiğini ve henüz optimum olmadığını belirtti. Özelleştirilmiş eğitim, destek ve benzeri hizmetlerin güçlü konumlandırılması isteniyor. Bu önem ve gelişim geçmişi kullanıcı beyanıdır; ölçülmüş kullanım/dönüşüm verisi değildir.

Bu alan yalnız bir bağlantı koleksiyonu veya ürün sayfalarının alt uzantısı olarak ele alınmayacak. Aluplan'ın yerel hizmet değerini anlatması ve mevcut müşterinin işini sürdürmesini kolaylaştırması ayrı bir strateji başlığıdır. Bu karar, mevcut yapıyı yeniden tasarlama veya içerik azaltma izni değildir.

## Kaynak ve doğrulama sınırı

- 21 Ekim salt-okunur kaynak: `../aluplan-2026/components/homepage-v2/ServicesV2.tsx`.
- 19 Ekim tarayıcı kayıtları: [varsayılan Hizmetler](00-inventory/browser-home-default.txt), [Allplan Connect](00-inventory/browser-home-connect.txt), [Bilgi Merkezi](00-inventory/browser-home-resources.txt).
- Eğitim ayrıntı kaynağı: `../aluplan-2026/app/solutions-v2/training/page.tsx`.
- Bu not için yeni canlı tarama veya mobil/klavye/gönderim testi yapılmadı. Kaynak ve eski tarayıcı gözlemi ayrı kanıt seviyeleridir; erişim hedeflerinin bugün çalıştığı veya hizmetin ticari olarak sağlandığı iddia edilmez.

## Mevcut yapı: üç sekme, 20 öğe

Bölüm `/#professional-services` hedefiyle erişilebilir. Ana menüdeki **Kaynaklar** bağlantısı bu bölüme gider. Varsayılan sekme `Hizmetler`; diğerleri `Allplan Connect` ve `Bilgi Merkezi`. Kaynak filtreleri sırasıyla 6, 4 ve 10 öğe seçer. Kartların tamamı kaynakta active olarak işaretlidir; bu işaret hizmet sürekliliği veya ticari uygunluk kanıtı değildir.

| Sekme | Mevcut başlık | Mevcut CTA | Çözümlenen hedef / kaynak kaydı |
|---|---|---|---|
| Hizmetler | Eğitim | Eğitim Takvimi | `/solutions-v2/training` |
| Hizmetler | Teknik Destek | Destek Al | Kaynak/ana envanterdeki mevcut Teams toplantı hedefi; bu notta erişim parametresi tekrar edilmez |
| Hizmetler | Danışmanlık | İletişim | `/contact` |
| Hizmetler | Sertifika | Görüntüle | `https://aluplan.info/` |
| Hizmetler | Destek Platformu | Talep Oluştur | `https://aluplan.net.tr` |
| Hizmetler | Partner | Başvuru Yap | `https://www.allplan.com/allplan-partner-solutions/` |
| Allplan Connect | Download | İndir | `https://connect2.allplan.com/` |
| Allplan Connect | Connect: Giriş | Giriş Yap | `/solutions-v2/connect-login` |
| Allplan Connect | Admin Lisans : Lisans Yöneticisi Bilgi Formu | Yönet | `/solutions-v2/connect-license` |
| Allplan Connect | Tüm Gereksinimler | Listele | `https://connect.allplan.com/support/sysinfo/2025.html` |
| Bilgi Merkezi | ALLPLAN FAQ | İncele | `/solutions-v2/faq` |
| Bilgi Merkezi | Blog Global | Okumaya Başla | `https://www.allplan.com/blog/` |
| Bilgi Merkezi | Canlı Webinarlar | Kayıt Ol | `https://www.allplan.com/events/events/?` |
| Bilgi Merkezi | BIM Rehberi | İncele | `https://www.allplan.com/bim/bim-guides/` |
| Bilgi Merkezi | OPENBIM | Keşfet | `https://www.allplan.com/us_en/bim/openbim/` |
| Bilgi Merkezi | Sistem Gereksinimleri | Kontrol Et | `https://www.allplan.com/us_en/system/system-requirements/` |
| Bilgi Merkezi | Sürüm Notları | Oku | `https://www.allplan.com/tr/system/releasenotes/?no_cache=1` |
| Bilgi Merkezi | IFC Export El Kitabı | İndir | `/docs/ifc_aktarim_el_kitabi_ifc_4.0_ifc_4.3_2026.pdf` |
| Bilgi Merkezi | CodeMeter WebDepot | Lisansları Aktar | `https://lc.codemeter.com/59885/depot/index.php` |
| Bilgi Merkezi | Deklarasyon Formu | Görüntüle | `/solutions-v2/connect-license/activation` |

**Eğitim hedefi için önemli ayrıntı:** services dizisindeki ham href `/contact`; renderGrid içindeki `resolvedHref` Eğitim başlığında bunu `/solutions-v2/training` olarak değiştiriyor. Tarayıcı kaydı da eğitim sayfasını gösteriyor. Taşıma envanterinde ham alanı kopyalamak yerine gerçek çözümlenen hedef korunmalı. Bu, uygulamaya müdahale gerektirmeden içerik kayıt sözleşmesine yazılacak bir kuraldır.

## Somut bulgular ve öneriler

| Bulgu | Kullanıcı açısından değerlendirme | Öneri / doğrulama |
|---|---|---|
| Kaynaklar menüsü Profesyonel Hizmetler başlığına gider | Hizmet isteyenle belge arayanın beklentileri aynı girişte birleşiyor | Başlık/giriş tutarlılığı ayrı kullanıcı göreviyle değerlendirilsin; mevcut anchor korunacak |
| Hizmetler sekmesinde yerel eğitim/danışmanlık yanında üretici partner başvurusu da var | Hizmeti sunan kuruluş ve sonraki işlem her kartta aynı değil | Her kayıtta provider ve hedef türü ayrı tutulmalı; kart taşınması/silinmesi henüz karar değil |
| Teknik Destek ve Destek Platformu farklı hedefler | Acil yardım ile kayıt açma arasındaki tercih açıklanmazsa belirsizlik doğabilir | İki kanalın kullanım amacı ve uygunluk koşulları Aluplan'dan doğrulansın; SLA veya 7/24 vaat üretilmesin |
| “Eğitim Takvimi” eğitim giriş sayfasına gider | Etiket bir takvim beklentisi yaratabilir | Hedefte gerçekten takvim/planlı etkinlik gösterimi olup olmadığı ayrı kabul senaryosu olsun |
| “Tüm Gereksinimler” 2025 yoluna gider; Sistem Gereksinimleri başka sekmede | Güncel gereksinim ve sürüme bağlı arşiv kavramı net olmayabilir | Hedef sürüm/yerel dil/güncellik kaydı tutulmalı; URL'den sitenin kapsamı kesin çıkarılmasın |
| CodeMeter ve Deklarasyon Bilgi Merkezi içinde | Lisans işlemleri okuma/öğrenme kaynaklarıyla aynı grupta | “Hesap ve lisans işlemi” içerik türü ayrı kaydedilsin; gelecekte konumlama kullanıcı testiyle seçilsin |
| Deklarasyon açıklaması 2023/2024 sürümlerini belirtir | Kullanıcı bunu tüm sürümler için güncel işlem sanabilir | Sürüm uygunluğu görünür kalmalı; daha yeni sürüme otomatik genişletme yapılmaz |
| İngilizce/ABD kaynakları ve Türkçe hedefler birlikte sunulur | Dil/bölge farkı kullanıcı için önceden anlaşılmayabilir | Hedef dil, bölge ve sağlayıcı metadatası kayda alınmalı; mevcut linkler korunmalı |

## Özelleştirilmiş eğitim: kaynağı doğru yerde tanımlama

Ana sayfada ayrı bir “Özelleştirilmiş Eğitim” kartı gözlenmedi; genel **Eğitim** kartı bulunuyor. Eğitim sayfası kaynağında Temel, İleri Seviye, Özel ve BIM kategorileri var. Özel kategorisinin başlığı “Özel Konularda Derin Bilgi!”; açıklaması belirli program alanı veya özel uygulama konusunu ele alıyor. İleri Seviye açıklamasında da alana özel seminerlerden söz ediliyor.

Bu kanıt, kullanıcının vurguladığı özelleştirilmiş eğitim ihtiyacına başlangıç sağlar; kurum özelinde müfredat, ücret, süre, eğitmen veya hizmet garantisi kendiliğinden doğrulanmış sayılmaz. Önerilen hizmet kaydı eğitim türü, hedef kitle, öğrenme amacı, format, kapsam, sağlayıcı, uygun ürün/sürüm ve mevcut talep hedefini ayrı tutmalı. Bilinmeyen ticari alanlar açık bırakılmalı.

## Konumlandırma çerçevesi — tasarım kararı değil

1. **Aluplan'dan hizmet almak:** Eğitim, özel ihtiyaç danışmanlığı ve doğrulanmış yerel destek. Aluplan'ın üretici sitesinin ötesinde sağladığı değer burada anlatılır.
2. **Mevcut yazılımı işletmek:** Hesap, lisans, indirme, destek kaydı ve sürüme uygun işlemler. Hızlı ve doğru hedefe ulaşmak önemlidir.
3. **Bilgi edinmek:** Rehber, FAQ, sürüm notu, webinar ve teknik kaynak. Sağlayıcı, dil ve güncellik bağlamı korunur.

Bunlar içerik sınıflarıdır; üç mevcut sekmenin yeni adları veya zorunlu yerleşim tasarımı olarak kabul edilmez. Aynı içerik farklı kullanıcı yollarından erişilebilir; kaydı ve hedefi tek yerde yönetilebilir. Hizmet keşfi ile mevcut müşteri desteği aynı satış formuna zorlanmamalı; ancak mevcut form/kanal hedefleri değiştirilmedi.

## Sonraki değerlendirme için kabul soruları

- Yeni bir ofis, standart eğitim ile özel ihtiyaca yönelik eğitim arasındaki farkı ve mevcut iletişim yolunu bulabiliyor mu?
- Mevcut müşteri Teams yardımı ile ticket açmanın hangi durumda uygun olduğunu anlayabiliyor mu?
- Kullanıcı lisans işlemini, sistem gereksinimini ve eğitim videosunu doğru sekmede bulabiliyor mu?
- Yalnız klavye ve dar ekranla üç sekme ve tüm kartlar erişilebilir mi? Sekme dışındaki içerik keşfedilebilir mi?
- Kullanıcı dış siteye gideceğini, sağlayıcıyı, dili ve sürüm uygunluğunu anlayabiliyor mu?
- Tema değişiminde `professional-services` anchor'ı, 20 içerik kaydı, tam metinler ve hedefler korunuyor mu?

Bu sorular henüz çalıştırılmış test değildir. Hizmetlerin ticari önceliği, sorumlusu, yanıt beklentisi ve gerçek kullanım verisi daha sonra değerlendirilir. Kullanıcının bu alanın önemine ilişkin notu içerik modeli ve PRD için açık bir gereksinimdir; bu aşamada kod, yeni kart, yeni URL veya yeni hizmet vaadi oluşturulmadı.
