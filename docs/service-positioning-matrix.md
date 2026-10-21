# Aluplan hizmet matrisi — Eğitim odaklı ilk taslak

21.10.2026 — Analiz ve planlama; site metni, URL, form veya uygulama değiştirilmedi.

## Karar ve kapsam

Kullanıcı hizmet matrisini kabul etti; inceleme sırasında **“Bireysel & Kurumsal Özel Eğitim sayfasını göz ardı et, Eğitim olarak sadeleştir”** dedi. Bu nedenle önerilen hizmet adı yalnız **Eğitim**. Ayrı kurumsal/özel eğitim hizmeti veya sayfası önerilmiyor. Özelleştirme, talep sahibinin ihtiyacını açıklayan bir ayrıntı olabilir; doğrulanmış ticari kapsam sayılmaz. Mevcut individual sayfası bu stratejinin dayanağı değildir. Silme, yönlendirme veya yayındaki içeriği değiştirme kararı verilmedi.

Bu matris mevcut içerik envanterinin yerine geçmez. Metinlerin tamamı envanterde korunur; aşağıdaki ihtiyaç ifadeleri planlama içindir, yayımlanacak kopya değildir. Faz 0 sürüyor.

## Kaynaklar ve kanıt sınırı

- S1: `../aluplan-2026/components/homepage-v2/ServicesV2.tsx`, hizmet kayıtları ve `resolvedHref`; 21.10.2026 salt-okunur inceleme.
- S2: `../aluplan-2026/app/solutions-v2/training/page.tsx`, `trainingCategories`, `formats` ve modal bağlantısı; aynı tarih salt-okunur inceleme.
- S3: `../aluplan-2026/components/layout-v2/ContactModal.tsx`, `handleSubmit`; aynı tarih salt-okunur inceleme.
- W1: [Eğitim sayfası](https://aluplan.com.tr/solutions-v2/training), 21.10.2026 web aracıyla okundu. Araç üç hafta önceki tarama kaydını döndürdü; bugünkü canlı DOM veya tüm sekmelerin etkileşim kanıtı değildir.
- Önceki sekme/URL kanıtları: [Profesyonel Hizmetler notu](professional-services-positioning.md). Diğer hizmetlerin güncel ticari kapsamı bu tur yeniden doğrulanmadı.

## Hizmet matrisi

| Hizmet / kayıt | Müşterinin ihtiyacı (öneri) | Mevcut kanıt | Önerilen sınır ve konum | Korunacak sonraki adım | Açık bilgi |
|---|---|---|---|---|---|
| **Eğitim** | Programı öğrenmek veya mevcut bilgiyi geliştirmek | S1 Eğitim kartı; S2 öğrenme kategorileri ve formatlar | Ana sayfada tek Eğitim girişi; eğitim sayfasında ihtiyaç/seviye ve format ayrımı; ilgili ürün sayfasından aynı kayda bağlantı önerisi | `/solutions-v2/training`; mevcut kategori eylemleri ayrı korunur | Gerçek sunulan konular, formatlar, tarihler, sorumlu, ücret ve katılım koşulları |
| Teknik Destek | Kullanırken karşılaşılan teknik sorunu çözmek | S1 Teknik Destek kartı / Teams hedefi | Eğitimden ayrı sorun çözme yolu; mevcut müşterinin hızlı erişimi | Envanterde kayıtlı mevcut Teams hedefi | Kimler kullanabilir, görüşme düzeni, çalışma saatleri ve ticket ile ilişkisi |
| Destek Platformu | Sorunu kayda geçirmek ve takibini yapmak | S1 Talep Oluştur / aluplan.net.tr | Ayrı satılabilir hizmet diye çoğaltmadan destek kanalı olarak modelle | Kullanıcının düzelttiği hedef: `https://allplan.net.tr`; kaynak farkı uygulamada ayrıca ele alınacak | Kayıt gereksinimi ve operasyon sorumlusu |
| Danışmanlık | İş akışı veya proje ihtiyacını uzmanla değerlendirmek | S1 Danışmanlık / İletişim kartı | Eğitimden ayrımı görev ve teslimatla tanımlanmalı; kapsam henüz kesin değil | `/contact` | Sunulan somut iş, teslimat, sorumluluk sınırı, ücretlendirme |
| Sertifika | Mevcut sertifikayı görüntülemek | S1 Sertifika / Görüntüle | Yeni hizmet satışı veya her eğitim için sertifika garantisi değil, mevcut işlem erişimi | `https://aluplan.info/` | Hangi eğitim/kurum belgeleri, sorgulama koşulları |
| Partner | Üretici partner programını incelemek | S1 üreticinin başvuru bağlantısı | Aluplan hizmeti gibi anlatılmaz; sağlayıcısı belirtilen dış başvuru | `https://www.allplan.com/allplan-partner-solutions/` | Üreticinin güncel bölgesel uygunluk koşulları |

Bu satırlar mevcut sekmelerin yeni sırası değildir. Diğer Connect/Bilgi Merkezi kayıtları önceki 20 öğelik envanterde korunur.

## Eğitim: tek hizmet, farklı ihtiyaçlar

**Önerilen kullanıcı sorusu:** “Ne öğrenmek veya geliştirmek istiyorsunuz?” Önce ihtiyaç anlaşılır, sonra uygun içerik ve iletişim yolu gösterilir. Bu soru form değişikliği değil, bilgi mimarisi önerisidir.

| İhtiyaç | Mevcut kaynak karşılığı | Önerilen sunum | Sınır |
|---|---|---|---|
| ALLPLAN'ı tanımak | İlgi Duyanlar / Hızlı Başlangıç | Eğitim içindeki başlangıç yolu | Satın alma veya eğitim kaydı zorunluluğu varsayılmaz |
| Temelleri öğrenmek | Temel kategorisi | Mevcut seviye açıklaması korunur | Kaynaktaki birkaç gün ifadesi kesin takvim/süre taahhüdüne çevrilmez |
| Bildiğim konularda ilerlemek | İleri Seviye ve Özel kategorileri | Eğitim içindeki konu/seviye seçenekleri | Özel konu eğitimi ile kişiye özel müfredat eşitlenmez |
| BIM bilgisini geliştirmek | BIM kategorisi | Eğitim içindeki öğrenme konusu | Sertifika olanağı tüm eğitimlere genellenmez |
| Kendi hızımda öğrenmek | Video Kütüphanesi / E-Learning | Kaynak erişimi ve eğitim hizmeti ilişkisi görünür olur | Ücretsiz, Türkçe veya tüm sürümlere uygun olduğu varsayılmaz |
| Ekibime uygun eğitim aramak | Kullanıcının özelleştirme ihtiyacı notu | Eğitim talebinin açıklama bağlamı | Ayrı hizmet adı, özel müfredat/yer/süre veya garanti vaadi oluşturulmaz |

S2 toplam altı kategori ve altı format içerir. Seviye/konu, sunum formatı ve katılımcı bağlamı farklı alanlardır; tek kategori listesinde çoğaltılmamalıdır. Kaynaktaki formatlar Online, Webinar, Yüz Yüze, Etkinlik/Fuar, Bireysel ve E-Learning olarak korunur. Bunların güncel yerel sunumu ayrıca doğrulanır. Kullanıcının sadeleştirme kararı bu kaynak etiketlerini bugün silme izni değildir.

## Sayfa ve CTA görevleri

1. **Ana sayfa:** Eğitim hizmetini keşfetme. Mevcut Eğitim kartı ve gerçek hedefi `/solutions-v2/training` korunur. “Eğitim Takvimi” yerine “Eğitimleri İncele” önceki taslak öneridir; uygulanmadı.
2. **Eğitim sayfası:** İhtiyacı/seviyeyi anlama, mevcut içerikleri inceleme, formatları öğrenme, uygun talep eylemine ilerleme. Tek Eğitim başlığı yeterlidir; ayrı özel eğitim pazarlama dalı önerilmez.
3. **Ürün/paket sayfası:** İlgili eğitim kaydına bağlanma önerisi. Yazılım paketinin eğitim içerdiği ancak ticari kanıt varsa söylenebilir; tüm paketlere otomatik eğitim hakkı eklenmez.
4. **Destek yolu:** Sorun çözme talebi satış veya eğitim formuna zorlanmaz. Mevcut kanallar korunur, hangisinin ne zaman kullanılacağı işletim bilgisiyle açıklanır.

S2 içinde Temel, İleri Seviye, Özel ve BIM eylemleri modal açar; Hızlı Başlangıç ve Video Kütüphanesi linktir. URL ile modal eylemi aynı kayıt türü değildir. S1'de Eğitim ham href değeri `/contact` olsa da render edilen hedef eğitim sayfasıdır.

## Dönüşüm ve form riski

S3 `handleSubmit`, form verisini konsola yazıp gecikme sonrasında başarı durumunu gösteriyor; gerçek gönderim/persist çağrısı bu fonksiyonda yok. Bu **kaynak bulgusudur**; canlıda talep kaybı yaşandığı kanıtlanmış değildir. Canlı gönderim yapılmadı, kişisel veri girilmedi. Mevcut Microsoft Forms satış formu ayrı akıştır; bu bulgu ona genellenmez.

Yayına geçiş kabul koşulu: eğitim talebi, sorumlu kişiye/operasyon sistemine ulaştığı ve hata halinde doğru mesaj gösterildiği uçtan uca doğrulanmadan “talep başarıyla alındı” kabulü verilmez. Bu tur backend/form düzeltmesi yapılmadı.

Gelecekte kısa eğitim talebi için önerilen bağlam: öğrenilmek istenen konu, mevcut seviye ve isteğe bağlı ekip/format bilgisi. İletişim alanları mevcut formlarla birlikte ayrıca tasarlanacak; şu anda yeni zorunlu alan, müşteri verisi toplama veya form hedefi kararı yok.

## Karar ve doğrulama tablosu

| Konu | Durum | Sorumlu rol / gereken kanıt |
|---|---|---|
| Tek Eğitim hizmet adı | Kullanıcı kararı; planlamada kabul | Proje ekibi; bu talep |
| Ayrı bireysel/kurumsal özel eğitim konumlandırması | Bu çalışmanın kapsamı dışında | Mevcut URL'nin geleceği ayrı geçiş kararı |
| İhtiyaç, seviye, format ayrımı | Taslak IA önerisi | Proje ekibi; kullanıcı görevi kontrolü |
| Temel/ileri/özel/BIM eğitimlerinin fiili kapsamı | Doğrulama gerekli | Eğitim sorumlusu; güncel program |
| Tarih, süre, ücret, kişi sınırı, eğitmen ve sertifika | Doğrulama gerekli | Eğitim/operasyon sorumlusu; onaylı hizmet bilgisi |
| Teams ve ticket kanalları | Kullanıcı: Teams bağlantısı üzerinden destek ve ayrı çalışan ticket sistemi mevcut | Yeni altyapı gerekmiyor; randevu, SLA veya zorunlu kanal sırası belirtilmedi |
| Eğitim–danışmanlık sınırı | Doğrulama gerekli | Hizmet sorumlusu; örnek teslimat ve kapsam |
| Eğitim formunun gerçek teslimi | Kaynak riski; canlı test açık | Teknik ekip + operasyon; sonraki yetkili test |

İlk bilgi toplama seti: Bugün hangi eğitim konuları ve formatları gerçekten sunuluyor? Talepleri kim değerlendiriyor? Destek ile eğitim ayrımı nasıl yapılıyor? Hangi eğitimlerde belge veriliyor? Mevcut takvim/ücret/program kaynağı nerede tutuluyor? Sorular kullanıcıya şimdi cevap zorunluluğu oluşturmaz; doğrulama listesi olarak saklanır.

## İçerik modeli ve yıllık bakım

[İçerik sözleşmesindeki](content-record-contract.md) Service kaydı altında tek Eğitim kimliği önerilir. Konu/seviye/format/ürün ilişkileri içerik alanlarıdır; renk, font ve kart düzeni içerik kaydına girmez. Her yıl yeni Eğitim sayfası açmak yerine sürüme bağlı materyal ve program kayıtları güncellenir; uygunluk bilinmiyorsa tüm sürümlerle ilişkili sayılmaz.

Schema üretimi bu aşamada yok. Hizmet kapsamı, sağlayıcı ve program doğrulanmadan yeni Course/Event/Offer veya fiyat/sertifika bilgisi üretilmez. Mevcut schema stratejisi geçerlidir; bu tur yeni Google uygunluk iddiası veya rich result hedefi eklenmedi.

## Sonraki kabul adımı

Kullanıcı matrisi değerlendirdikten sonra Eğitim için eksik işletim bilgileri tamamlanmalı ve destek kanallarının görev ayrımı netleştirilmeli. Tasarım, yeni sayfa, URL değişikliği ve uygulama ayrı faz onayına bağlıdır.

## 21.10.2026 — Destek kanalı düzeltmesi

Kullanıcı Teams bağlantısının mevcut destek kanalı olduğunu, ayrı ticket sisteminin de çalıştığını bildirdi ve adresi **allplan.net.tr** olarak düzeltti. S1/önceki envanterdeki `aluplan.net.tr` tarihsel kaynak bulgusu olarak korunur; planlamada kullanıcı tarafından bildirilen hedef `https://allplan.net.tr` olur. Erişim, protokol ve yönlendirme bu tur bağımsız doğrulanmadı; sitenin mevcut bağlantısı değiştirilmedi. Yeni destek sistemi kurulması önerilmiyor.
