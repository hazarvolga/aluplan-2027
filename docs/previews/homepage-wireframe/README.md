# Ana sayfa yerleşim önizlemesi

22.10.2026 — Ayrı statik önizleme; Next.js uygulaması veya design system entegrasyonu değildir. JSON-LD, form gönderimi, takip çerezi yok. Kaynak URL'ler yeni sekmede canlıya gider; bağlantı tıklaması gerçek dış sayfayı açar.

- `data.js`: kaynak snapshotlarından çıkarılan roller, ürünler, paketler, çözümler, yenilikler ve20hizmet. Kaynak color/colSpan alanları alınmaz.
- `tokens.css`: yalnız önizleme tema değerleri; antrasit yüzeyler.
- `style.css`: yerleşim ve responsive davranışlar.
- `app.js`: kaçış uygulanmış içerik sunumu ve rol seçimi;6ürün her rolde görünür.
- `index.html`: sayfa bileşimi ve sabit kaynak anlatımları. Kalıcı içerik mimarisi uygulanmış değildir; bazı metinler HTML içinde bulunur.
- `build_data.py`: repo kökünden çalıştırılır, yalnız bu klasörde data.js üretir. Girdi: docs/00-inventory/interaction-source-evidence/components/homepage-v2.

8ana bölüm,20hizmet,5hızlı bağlantı,3rol,6ürün ve6PDFkartı kapsamı. Eğitim çözümlenmiş hedefi `/solutions-v2/training` olarak alınır. Teknik özellik kartları aynı PDF'ye, son yenilik CTA'sı kaynak gibi `/products` adresine gider. Hero video ve BIMFlex medya için etiketli alan ayrılır; mevcut logo ve eşleşen bina/prekast resimleri kullanılır. Mevcut metin iddiaları yeni doğrulanmış vaat değildir; tam üretim paritesi veya nihai marka kabulü sayılmaz.

Bu önizlemede arama, çerez paneli, tam mega menü, hero video oynatma, tema seçimi, global trial widget ve copy protection uygulanmadı. Menü sayfa içi görev bölgelerine erişir; eski navigasyonun tüm etkileşim paritesi iddia edilmez. Alt linkler doğrudan kaynak adreslerine gider. Görünür Eğitim Takvimi eski etikettir; kalıcı Eğitim stratejisine göre yeniden yazım onayı ayrı tutulur.

Doğrulama: data çıkarım sayıları assertion, Node syntax kontrolü. Tarayıcı/responsive kontrolü ebeveyn görevde yapılır.

Tarayıcı kontrolü: 8 bölüm/20 hizmet DOMda görüldü; Mühendis rolü ve altı ürünün korunması kontrol edildi. Antrasit görünüm incelendi, console error kaydı boş. Code-review kritik/yüksek bulgu yok. Tam cihaz/erişilebilirlik testi değildir. Yerel sunucu8770 proje kökünden sunar.
