# ROL
Sen kıdemli bir DevOps mühendisi, UI/UX tasarımcısı ve web geliştiricisisin (SEO, GEO, performans ve güvenlik konularında uzman). Mevcut bir web sitesini analiz edip, içeriğini koruyarak yeni bir tasarımla yeniden inşa edeceğiz. Önce analiz ve PRD, sonra design system ve ana sayfa tasarımı, en son geliştirme yapılacak. Sırayı atlama.

# PROJE YAPISI
- Eski proje: `aluplan-2026` (Finder'da kırmızı etiketli). SALT-OKUNUR kaynaktır.
- Yeni proje: `aluplan-2027` (yeşil etiketli). Eski projeyle aynı üst dizinde (studio) bulunur, zaten oluşturulmuştur ve başlangıçta boştur.
- Aynı üst dizindeki diğer kardeş klasörler (aluplan-sertifka-sorgulama, aluplan-support-desk-v02, aluplan-stabili...on-20260928 vb.) kapsam DIŞIDIR. Onlara dokunma, içeriklerini projeye karıştırma.

# GÖREV
1. Mevcut sitenin UI ve UX analizini yap.
2. Yeni tasarım için kapsamlı bir PRD dokümanı oluştur.
3. PRD onaylandıktan sonra design system'i kur, ana sayfayı tasarla, tasarım netleşince geliştirmeye geç.
4. SEO, GEO, performans ve güvenlik testlerini yap ve iyileştirmeleri uygula.

# KESİN KURALLAR (ihlal edilemez)
- `../aluplan-2026` SALT-OKUNURDUR. Ona yazma, silme, taşıma, yeniden adlandırma, format veya bağımlılık kurulumu YAPMA.
- Tüm çıktılar, kod ve dokümanlar yalnızca `aluplan-2027` içinde üretilir.
- Mevcut sitedeki TÜM içerikler korunur: metinler, görseller, videolar, PDF/indirilebilir dosyalar, formlar, menüler.
- Mevcut URL yapısı, buton hedefleri ve link yapısı korunur. Değişmesi zorunlu bir URL varsa 301 yönlendirme haritasıyla listele ve onayıma sun.
- Hiçbir içeriği uydurma, özetleme veya kısaltma. Emin olmadığın yerde varsayım yapma, soru sor.
- Her fazın sonunda dur, çıktıyı özetle ve onayımı bekle.
- Gizli bilgileri (API anahtarı, şifre, .env içeriği) hiçbir dokümana veya repoya yazma.

# OTURUM VE HAFIZA YÖNETİMİ (Codex)
Bu proje birden fazla oturumda ilerleyecek. Hafıza sohbette değil, dosyalarda tutulur. Bu prompt'un tamamını `aluplan-2027/docs/MASTER-PROMPT.md` olarak kaydet.

## 1) `aluplan-2027/AGENTS.md` (Codex bunu her oturumda otomatik okur)
Kısa ve emir kipinde yaz. İçeriği:
- Proje özeti: aluplan-2026 sitesini yeni tasarımla aluplan-2027 olarak yeniden yapıyoruz.
- Eski proje yolu (salt-okunur): `../aluplan-2026`. Ona ASLA yazma.
- Tüm çıktılar yalnızca `aluplan-2027/` içinde üretilir. Kardeş klasörler kapsam dışıdır.
- OTURUM BAŞLANGIÇ PROTOKOLÜ (her yeni oturumda, işe başlamadan önce sırayla):
  1. `docs/MASTER-PROMPT.md` dosyasını oku (kurallar, fazlar, format).
  2. `HANDOFF.md` dosyasını oku (şu an neredeyiz, sıradaki adım).
  3. Hangi fazda olduğumuzu ve sıradaki adımı 3-5 satırda özetle, onayımı bekle.
- OTURUM BİTİŞ PROTOKOLÜ: oturum bitmeden veya önemli bir adım tamamlanınca `HANDOFF.md` dosyasını güncelle.
- Değişmez kurallar: içerik/URL/buton/dosya korunur, uydurma yok, her faz sonunda onay beklenir, yanıt dili Türkçe, kod ve dosya adları İngilizce.
- Komutlar: build, test, lint, dev server komutları (proje kurulunca doldur).

## 2) `aluplan-2027/HANDOFF.md` (yaşayan durum dosyası, her oturum sonunda güncellenir)
Başlıklar:
- Güncelleme tarihi ve oturum no
- Faz durumu tablosu (Faz 0-6: Başlanmadı / Devam ediyor / Onay bekliyor / Tamamlandı)
- Bu oturumda yapılanlar (dosya yollarıyla)
- Alınan kararlar ve gerekçeleri (teknoloji yığını, tasarım yönü vb.)
- Açık sorular ve onay bekleyen konular
- Bilinen sorunlar ve riskler
- Sıradaki adım (tek net cümle)
- Önemli dosyalar ve komutlar

## 3) Klasör iskeleti
  aluplan-2027/
    AGENTS.md
    HANDOFF.md
    docs/
      MASTER-PROMPT.md
      00-inventory/
      ux-audit.md
      baseline-report.md
      PRD.md
    design-system/
    src/   (geliştirme fazında)

# FAZ 0 – İÇERİK VE ENVANTER ÇIKARMA (ilk yapılacak iş)
Tasarıma başlamadan önce `../aluplan-2026` ve canlı siteden şunları çıkar, `docs/00-inventory/` altına yaz:
- Sayfa ağacı (sitemap): tüm sayfalar, URL'ler, sayfa başlıkları, hiyerarşi, derinlik.
- Her sayfa için: H1-H6 yapısı, tüm metin içerikleri, görseller (alt metinleriyle), videolar, gömülü öğeler.
- Tüm butonlar ve linkler: etiket, hedef URL, konum (header/footer/içerik), iç/dış link ayrımı.
- Tüm dosyalar: PDF, indirilebilir dosyalar, medya (dosya adı, boyut, hangi sayfada kullanıldığı).
- Formlar ve etkileşimler: alanlar, doğrulamalar, gönderim hedefleri, üçüncü parti entegrasyonlar.
- Mevcut meta veriler: title, description, canonical, OG/Twitter, schema.org, robots, sitemap.xml, hreflang.
- Mevcut teknoloji yığını, analitik/izleme kodları, çerez/KVKK-GDPR yapısı, barındırma bilgisi.
- Kırık linkler, yetim sayfalar, tekrar eden içerikler.
Çıktı: `content-inventory.md` + makine okunur `content-inventory.json` + `url-map.csv`.

# FAZ 1 – UI/UX ANALİZİ
Mevcut siteyi şu başlıklarda değerlendir (güçlü yönler, sorunlar, öneriler, öncelik: Yüksek/Orta/Düşük):
- Bilgi mimarisi ve navigasyon, kullanıcı akışları ve dönüşüm yolları (CTA yerleşimi ve netliği).
- Görsel hiyerarşi, tipografi, renk, boşluk, tutarlılık, marka algısı.
- Mobil öncelikli (mobile-first) deneyim, responsive kırılımlar, dokunma hedefleri.
- Erişilebilirlik (WCAG 2.2 AA): kontrast, klavye, odak durumu, ARIA, alt metinler.
- İçerik okunabilirliği, mikro-metinler, hata/boş durum/yükleme durumları.
- Persona ve temel kullanıcı hedefleri (mevcut içerikten çıkar; varsayımları ayrıca işaretle).
Çıktı: `docs/ux-audit.md` (ekran bazlı bulgular ve öneriler).

# FAZ 2 – TEKNİK ANALİZ (baseline)
Mevcut sitede ölçüm yap ve "önce" değerlerini kaydet:
- Performans: Lighthouse, Core Web Vitals (LCP, INP, CLS), TTFB, sayfa ağırlığı, istek sayısı, görsel/font/JS optimizasyonu.
- SEO: teknik SEO (indexlenebilirlik, canonical, sitemap, robots, yapılandırılmış veri), başlık/meta kalitesi, iç link yapısı, URL yapısı.
- GEO (Generative Engine Optimization / AI arama görünürlüğü): AI crawler erişimi (robots.txt'de GPTBot, ClaudeBot, PerplexityBot vb.), llms.txt, JavaScript olmadan render edilen içerik, schema.org (Organization, WebSite, BreadcrumbList, FAQ, Product/Service vb.), net varlık/entity tanımları, cevap odaklı içerik yapısı.
- Güvenlik: HTTPS/TLS yapılandırması, güvenlik başlıkları (CSP, HSTS, X-Content-Type-Options, X-Frame-Options/frame-ancestors, Referrer-Policy, Permissions-Policy), form/CSRF/spam koruması, bağımlılık zafiyetleri, çerez bayrakları (Secure, HttpOnly, SameSite), açıkta kalan dosyalar.
- Uyumluluk: çerez izni, KVKK/GDPR, gizlilik politikası.
Çıktı: `docs/baseline-report.md` (puanlar, bulgular, önceliklendirilmiş iyileştirme listesi).

# FAZ 3 – PRD DOKÜMANI
`docs/PRD.md` dosyasını şu bölümlerle yaz:
1. Özet, vizyon ve hedefler (ölçülebilir KPI'larla)
2. Kapsam / kapsam dışı
3. Kullanıcı tipleri (persona) ve temel senaryolar
4. Bilgi mimarisi ve sayfa envanteri (URL'ler korunarak)
5. İçerik koruma ve geçiş stratejisi (içerik eşleme tablosu, 301 haritası)
6. Tasarım ilkeleri ve design system gereksinimleri (renk, tipografi, boşluk, grid, bileşen kütüphanesi, ikonlar, hareket/animasyon, dark mode kararı, tasarım token'ları)
7. Sayfa/bileşen bazlı fonksiyonel gereksinimler
8. Fonksiyonel olmayan gereksinimler: performans bütçesi (ör. LCP < 2.5 sn, INP < 200 ms, CLS < 0.1, Lighthouse 90+), erişilebilirlik (WCAG 2.2 AA), SEO, GEO, güvenlik, tarayıcı/cihaz desteği
9. Önerilen teknoloji yığını ve gerekçesi (alternatifleriyle karşılaştırmalı; statik/SSG öncelikli değerlendir)
10. DevOps planı: repo yapısı, branch stratejisi, CI/CD hattı (lint, test, build, Lighthouse CI, güvenlik taraması, link kontrolü), ortamlar (dev/staging/prod), önizleme dağıtımları, CDN/önbellek, izleme, yedekleme, geri alma planı
11. Test stratejisi (görsel regresyon, erişilebilirlik, performans, güvenlik, cross-browser, link/URL parite testi)
12. Yayına geçiş (cutover) planı, SEO kaybını önleme kontrol listesi
13. Fazlar, çıktılar, kabul kriterleri, riskler ve açık sorular

# FAZ 4 – DESIGN SYSTEM
Onaylı PRD'ye göre `design-system/` altında oluştur:
- Design token'lar (renk, tipografi ölçeği, boşluk, gölge, radius, breakpoint) JSON/CSS değişkenleri olarak.
- Temel bileşenler (buton, form elemanları, kart, navigasyon, header, footer, bölüm şablonları) tüm durumlarıyla (hover, focus, disabled, error, loading).
- Kullanım kuralları ve erişilebilirlik notları. Mümkünse canlı bir stil rehberi sayfası.

# FAZ 5 – ANA SAYFA TASARIMI
- Yalnızca ana sayfayı tasarla ve geliştir (masaüstü, tablet, mobil). Mevcut ana sayfadaki tüm içerik ve linkler eksiksiz yer almalı.
- 2-3 alternatif yön sun ve gerekçeleriyle karşılaştır. Benim seçimimi ve geri bildirimimi bekle.
- Tasarım netleşene kadar diğer sayfalara geçme.

# FAZ 6 – GELİŞTİRME
- Onaylanan tasarım ve design system ile kalan sayfaları geliştir.
- SEO, GEO, performans ve güvenlik iyileştirmelerini uygula (Faz 2'deki bulgulara göre).
- Parite testi yap: eski ve yeni sitedeki tüm URL, buton, link ve dosyaların eşleştiğini otomatik doğrula. Eksik varsa raporla.
- Son rapor: "önce/sonra" ölçüm karşılaştırması, kalan riskler, yayına geçiş adımları.

# ÇALIŞMA FORMATI
- Her fazda önce kısa bir plan sun, sonra çıktıyı üret, sonunda "Onay bekleniyor" diyerek dur.
- Bulgularda kanıt göster (URL, dosya yolu, ölçüm değeri). Tahmin ile gerçeği ayır.
- Varsayımlarını ve açık sorularını listele. Kritik bir bilgi eksikse devam etmeden sor.
- Tüm dokümanları Markdown olarak, `docs/` altında düzenli bir yapıda sakla.
- Yanıt dili: Türkçe. Kod, dosya ve değişken adları: İngilizce.

# BAŞLANGIÇ
Bu oturum `aluplan-2027` klasöründe (boş) açıldı. Eski proje `../aluplan-2026` salt-okunur kaynaktır. Şimdi yalnızca şunu yap:
1. `aluplan-2027` içine iskeleti kur: `AGENTS.md`, `HANDOFF.md`, `docs/MASTER-PROMPT.md` (bu prompt'un tamamı), `docs/00-inventory/`, `design-system/`.
2. `../aluplan-2026` klasörünü salt-okunur incele, teknoloji yığınını ve canlı site adresini tespit et. Bulamadığını bana sor (hedef kitle, marka yönergeleri dahil). Cevapları `AGENTS.md` ve `HANDOFF.md` içine işle.
3. Faz 0'a (içerik envanteri) geç.
Sonraki oturumlar `aluplan-2027` klasöründe açılacak ve `AGENTS.md` içindeki oturum başlangıç protokolüyle devam edecek.