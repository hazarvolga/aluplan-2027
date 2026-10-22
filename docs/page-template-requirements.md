# Sayfa şablonları ve içerik blokları sözleşmesi

22.10.2026 — Planlama taslağı. Kullanıcının “ok go” yanıtı bilgi mimarisinden sayfa şablonu/blok planına ilerleme iznidir; tüm açık ticari seçenekleri veya yayın metinlerini onayladığı varsayılmaz. Görsel tasarım, bileşen kodu ve JSON-LD üretilmedi.

## Dayanak ve çalışma sınırı

[Bilgi mimarisi](site-information-architecture.md), [131 URL eşlemesi](site-architecture-route-map.csv), [içerik kayıt sözleşmesi](content-record-contract.md), [form sözleşmesi](request-forms-contract.md) ve [22 Ekim schema incelemesi](form-schema-review-2026-10-22.md) esas alınır. Ana sayfanın kaynak bileşenlerine dayanan ayrıntısı [blok planındadır](homepage-block-plan.md). Bu tur canlı veya Google kuralları yeniden taranmadı; schema notları mevcut incelemenin tasarıma aktarımıdır.

Şablon, içerik alanlarının ve görevlerinin tekrar kullanılan düzenidir; her sayfayı aynı uzunlukta metne indirme yöntemi değildir. Kaynakta bulunan ek tablo, video, dosya ve etkileşim ilgili şablona ek blok olarak taşınır. İçerik ve URL koruma kuralları geçerlidir.

## 1. Katman sınırları

| Katman | Sorumluluk | İçermemesi gerekenler |
|---|---|---|
| İçerik kayıtları | Ürün, edition, release, kapsam iddiası, kaynak revizyonu, hizmet, kanal, belge; kararlı kimlik ve tam kaynak içerik | Tema renkleri, komponent sınıfları, kişisel talepler |
| Sayfa bileşimi | Mevcut URL, sayfa görevi, blok sırası, kayıt referansları, kaynak blok eşlemesi | Ürün bilgisinin bağımsız ve zamanla çelişen ikinci kopyası |
| Sunum / design tokens | Antrasit/açık tema, yüzeyler, yazı, boşluk, köşe, gölge, hareket | Ürün hakkı, sürüm seçimi, URL, schema türü |
| Schema adaptörü | Görünür/doğrulanmış içerikten sayfa amacına uygun kamusal varlık ilişkisi | CSS'den türetilmiş anlam, sahte fiyat, form girdisi, rich result garantisi |
| Talep işlemleri | Kullanıcı niyeti, açık seçimler, kaynak bağlamı, kayıt ve takip durumu | Kamusal katalog/schema içine kişisel veri |

Bir ürünün adı değişirse tek kaydı güncellenir; bir tema değişirse ürün kaydı değişmez. Yeni yıl geldiğinde release ve ilgili kaynak eklenir; bütün şablonlar kopyalanmaz. İşlev değişikliği token değişikliği sayılmaz.

## 2. Ortak blok sözleşmesi

Her blok için `blockId`, `blockType`, `sourceBlockRefs`, `recordRefs`, `originalContentRef`, `entryPointRefs`, `verificationStatus` ve `decisionStatus` planlanır. Bunlar kavramsal alanlardır, uygulanmış TypeScript şeması değildir.

- Kaynak metin, tablo satırı, dosya, görsel/video ve CTA tam haliyle referanslanır. Bu belgedeki kısa açıklamalar yayın metni yerine geçmez.
- Blok türleri: giriş, rol/iş akışı seçimi, ürün listesi, özellik açıklaması, kapsam tablosu, sürüm yeniliği, belge listesi, hizmet/kanal erişimi, video listesi, iletişim/talep girişi, ilgili içerik.
- Tekrar kullanılan CTA aynı hedef kaydını kullanır. Eski hedef ile önerilen hedef ayrı tutulur; form geçişi uygulanana kadar yeni hedef çalışıyormuş gibi gösterilmez.
- Gerekli kaynak eksikse üretim kabulü açık kalır. Boş veri örnek başarı sayısı, uydurma tarih veya sahte içerikle doldurulmaz.
- Bir blok gösterilmediğinde kaynak içeriğin kaybolmaması için eşleme kaydı ve karar gerekir. Kaynakta bulunmayan yeni bir blok açıkça öneri olarak etiketlenir.

## 3. Sayfa şablonları

Aşağıdaki sıra mantıksaldır; görsel yerleşim henüz tasarlanmadı. Her şablonda ortak header/footer, mevcut metadata ve URL kayıtları ayrıca korunur. Bütün route'ların şablon uygulama eşliği henüz test edilmiş değildir.

| ID / şablon | Gerekli bloklar | Kayıtlar ve mevcut örnekler | Ana eylem / kabul sınırı |
|---|---|---|---|
| T01 Ana sayfa | Mevcut hero ve hızlı bağlantılar; rol/ürün keşfi; BIMFlex; yenilikler; teknik bilgiler; hizmetler | `/`; ayrıntılı kaynak eşleme ayrı blok planında | İş ihtiyacını keşfet veya Eğitim/Destek'e eriş; hiçbir mevcut bileşen unutulmaz |
| T02 Katalog | Ürün/çözüm kapsam açıklaması; mevcut kategoriler ve listeler; ilgili kaynaklar | `/products`, `/solutions`, `/solutions-v2`; kaynak grupları ayrı korunur | Ayrıntıya geç; ürün ile çözüm aynı kayıt türü sayılmaz |
| T03 Çözüm / iş akışı | Mevcut problem/iş akışı anlatımı; özellik/medya; ilgili ürünler; yerel yardım | `/solutions/architecture`, `/solutions/infrastructure`, `/solutions/precast` | Ürünü incele veya seçim yardımı; segment sırası ticari öncelik iddiası değildir |
| T04 Kalıcı ürün ve uzman ayrıntısı | Ürün/üretici kimliği; hedef kullanım; tam özellik/medya; ilgili paketler; güncel ve tarihsel sürüm bağlantıları; belgeler | `/products/allplan`, `/products/allplan-aec`, Civil/Precast; diğer markalar kendi kayıtları | Teklif veya doğrulanmış deneme hedefi; bütün ürünlere aynı süre/indirme linki atanmaz |
| T05 Paket ayrıntısı | Paket adı; bağlı ürün; kanıtlı kapsam; sürüm/pazar/lisans koşulları; ilgili karşılaştırma/belge | Basic, Concept, Professional, Ultimate sayfaları | Teklif; paket bilmeyen için yardım. Civil/Precast sınıfı kesinleşmeden aynı edition mantığına zorlanmaz |
| T06 İşlev karşılaştırması | Bağlam seçimi/açıklaması; kaynaklı özellik satırları; dahil/opsiyon/önkoşul/bilinmeyen ayrımı; belge erişimi | `/package-overview` planı, ScopeClaim + SourceRevision | Fiyatsız karşılaştırma; mevcut placeholder'ın tamamlanmış işlev olduğu söylenmez |
| T07 Sürüm / yenilik | Sürüm ve ürün bağı; tam yenilik bölümleri/medya; kaynak revizyonları; kalıcı ürün ve diğer sürümler | `/products/allplan-2026`, `...-yenilikler`, ilgili bulut yenilikleri | Sürüm bağlamlı bilgi/teklif; 2026 metni 2027 diye yeniden etiketlenmez |
| T08 Belge / kaynak | Belge adı; dosya/harici hedef; doğrulanmış tarih/sürüm/dil; ilgili ürün; mevcut açıklamalar | `/paket-karsilastirma`, AX3000 belgeleri, mevcut rehberler | İndir/aç; dosya revizyonu yazılım sürümü değildir |
| T09 Eğitim | Mevcut eğitim açıklamaları; webinar duyurusu varsa; video arşivi; eğitim talebi; mevcut alt kaynaklar | `/solutions-v2/training`, tek Service kimliği | İzle veya ihtiyaç bildir; sürekli kurs takvimi/sertifika vaadi eklenmez |
| T10 Video listesi / ayrıntısı | Liste: mevcut konu/sürüm/dil bilgisiyle kayıtlar; ayrıntı: tam başlık/açıklama/video ve ilgili kaynaklar | Video-library ve mevcut alt sayfaları | Form doldurmadan izle; olmayan tarih/dil/süre tahmin edilmez |
| T11 Kullanıcı işlemi / yardım | İşlemin amacı; mevcut adımlar ve dosyalar; ilgili Connect/lisans/hedef bağlantıları | FAQ, Connect, aktivasyon, lisans atama sayfaları | İlgili işlemi tamamla; eğitim/satış/support kanalından ayrı görev |
| T12 Kurumsal / referans / iletişim / yasal | Her alt türün tam kaynak bölümleri; iletişimde numaralar/adres/harita; yasalda tam metin | `/about`, `/references`, `/contact`, üç yasal sayfa | Kaynak amacına uygun erişim. Tek şablon ailesi içerikleri birbirinin yerine koymaz |

T01 satırındaki liste kapsam listesidir; ana sayfa için önerilen sıra blok planındaki H01–H08 sırasıdır.

Teknik health/robots/sitemap/OG görseli bu pazarlama şablonlarına girmez. Demo rotaları ve 11 eksik hedef karar kuyruğunda kalır. Var olmayan destek ana sayfası uydurulmaz; destek kanal erişimi ortak blok olarak kullanılabilir.

## 4. Kullanıcı eylemleri ve durumlar

| Yüzey | Planlanacak durumlar | Kabul ölçütü |
|---|---|---|
| Rol / kategori / sekme | Varsayılan, seçili, klavye odağı, mobil görünüm | Kartlar sadece soluklaştığı için erişilemez yapılmaz; seçimin anlamı açık |
| Kaynak/video listesi | Kayıt var, boş, hedef erişilemiyor | Tarihsel içerik sessizce silinmez; bozuk hedef takip listesine bağlanır |
| Paket tablosu | Doğrulanmış, koşullu, kaynaklar çelişkili, bilgi yok | Bilgi yok = hariç değildir. Mobilde başlık-hücre ilişkisi kaybolmaz |
| Teklif/deneme/eğitim girişleri | İlk durum, koşullu alanlar, hatalı giriş, gönderiliyor, kayıt başarısı, kayıt hatası | Başarı yalnız kayıt oluşunca; bildirim hatası kaydı yok saymaz; aynı isteği tekrar gönderme riski ele alınır |
| Destek/Connect dış bağlantıları | Kanal adı, sağlayıcı/hedef açıklığı | Yönetici dashboard'u müşteri giriş adresi diye kopyalanmaz; SLA uydurulmaz |

Talep alanları ve koşullu ürün/modül seçimleri [form sözleşmesinden](request-forms-contract.md) gelir. Üç niyet üç sabit ekran anlamına gelmez; öğrenci lisansı ve mevcut müşterinin eklenti temini ayrı alt yollarını korur. Deneme öncesi lead zorunluluğu hâlâ açık karardır.

## 5. Schema bakımından şablon sınırları

Bu bölüm yeni Google doğrulaması değil, önceki raporun uygulama şartlarına aktarımıdır:
- Ürün/paket/yıllık sayfalar aynı ürünle ilişkili olsa da sayfa amaçları ayrıdır; otomatik ortak canonical veya ProductGroup üretilmez.
- Katalog/listeler listelenen varlıklara referans verir; her kart yeni bir ürün kimliği yaratmaz.
- Eğitim hizmet anlatımı, webinar kaydı, video arşivi ve tek video ayrı amaçlardır. Webinar arşivi gelecekte gerçekleşecek Event veya otomatik Course kataloğu yapılmaz.
- Aluplan hizmet sağlayıcı, ALLPLAN üretici olarak ayrılır; Teams ve ticket aynı destek hizmetinin erişim kanallarıdır.
- Fiyat yayımlanmayan ürün için sıfır fiyat, stok veya yorum üretilmez. Rich result elde etmek içerik doğruluğunun önüne geçmez.
- Tema veya blok sırası değişimi varlık kimliğini değiştirmez; görünür içerik kaldırılırsa schema görünür içerikle yeniden uzlaştırılır.

## 6. Yıllık bakım ve sahiplik

| Değişiklik | Güncellenen alan | Tekrar yapılmayan iş | Sorumlu rol |
|---|---|---|---|
| Yeni ALLPLAN sürümü | Release, kaynaklar, ilgili yetenek/kapsam kayıtları, yenilik sayfa bileşimi | Bütün sitenin tasarımı ve kalıcı ürün kimliği | İçerik ekibi + Aluplan ticari doğrulama |
| Paket hakkı değişikliği | Bağlamlı ScopeClaim ve tarihli kanıt | Elle ayrı ayrı tüm paket tablolarını yazmak | Aluplan doğrulama + teknik ekip |
| Yeni webinar/video | Tarihli kaynak kaydı ve ilgili liste | Eğitim ana sayfasını yeniden kurmak | Aluplan içerik sorumlusu |
| Yeni tema | Sunum tokenları ve gerekli görsel kabul testleri | Ürün verisini, URL veya schema kimliğini değiştirmek | Tasarım + teknik ekip |
| Bozuk hedef | Hedef kaydı, karar ve gerekiyorsa onaylı geçiş haritası | Eski kanıtı silmek | Teknik ekip; kapsam kararında kullanıcı |

Rol tanımları atanmış kişi veya kabul edilmiş SLA değildir. CMS olmadan kayıtlar proje içinde sürümlenir; sonraki CMS geçişinde aynı kimlik ve ilişkiler taşınabilir. Veri dosya biçimi/validation araçları henüz seçilmiş uygulama değildir.

## 7. Tasarıma hazırlık kabul listesi

- Her kaynak blok/CTA/medya için hedef blok veya açık karar bulunur; tam içerik paritesi uygulamada ayrıca ölçülür.
- Ana sayfada sekmeye bağımlı olmayan Eğitim/Destek erişimi; 20 hizmet kaydının görünür keşif yolu bulunur.
- Kalıcı ürün, paket, sürüm, dosya ve eğitim/destek görevleri karışmaz.
- Mobil/klavye/odak, hata/boş/yükleme durumları tasarım kapsamına girer; henüz erişilebilirlik testi yapıldığı iddia edilmez.
- Eski fiyat yokluğu, gerçek deneme hedefleri, çoklu ürün ilgisi ve bilinmeyen paket seçeneği korunur.
- Kaynak eksikleri teknik ekipçe kapatılır; yalnız ticari gerçekler ve tercih kararları kullanıcıya taşınır.

Sonraki adım önerisi: bu blok planını değerlendirdikten sonra mevcut içerikle düşük ayrıntılı ana sayfa yerleşim önizlemesi. Önizleme izni otomatik üretim entegrasyonu veya tüm PRD/fazların kapanışı sayılmaz.
