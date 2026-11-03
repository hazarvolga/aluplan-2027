# Aluplan 2027 — yayın öncesi kontrol, 03.11.2026

## Kapsam ve durum

Bu belge yerel çalışma ağacına ve 03.11.2026 tarihli okuma amaçlı incelemeye dayanır. **Canlıya dağıtım, DNS değişimi ve üretim kabulü yapılmadı.** Son kaynak durumu commit edilmemiştir; bu nedenle yayın adayı olarak bir Git revizyonuna sabitlenmiş değildir. Kaynak site `aluplan-2026` salt okunur incelenmiştir. Kullanıcının paylaştığı eski site puanları ve sentetik LCP 2,88 sn ölçümü kaynak, tarih, ağ/CPU koşulları ve test sayfası tekrar doğrulanmadığından yeni siteyle doğrudan karşılaştırılamaz.

## Bulgu ve karar tablosu

| Öncelik | Konu | Kanıt / durum | Yayından önce gerekli adım |
|---|---|---|---|
| P1 | Dizinleme ve ortam bayrakları | Önizleme için `ALUPLAN_SHOW_2027=1`, `ALUPLAN_BLOCK_INDEXING=1` kullanıldı. Indexleme engeli `robots` ve `X-Robots-Tag` davranışını etkiler. | Asıl üretimde doğru build/runtime bayraklarını, gerçek alan adında robots, meta ve X-Robots başlıklarını doğrula; önizlemeyi korumak için erişim kontrolünü değerlendir. |
| P1 | URL taşıma | Beş eski `/solutions-v2/` merkez adresi yerelde 301 ile eşdeğer yeni hedefe yönlenir; Search Console ve gerçek dış bağlantı trafiği incelenmedi. | Canlı envanter/arama verisi ve tüm yönlendirmeleri tek atlama, sorgu ve hedef 200 ile test et; en az bir yıl veya mümkünse daha uzun süre koru. |
| P1 | Mobil performans | Bayraklı local production build ve 355 CSS pikselde `/`, `/products/allplan-professional`, `/solutions/road-railway`, `/video-kutuphanesi/ax3000` taşmasız; tamamlanmış kırık görsel 0; tek H1. Bu LCP/INP/CLS veya Lighthouse ölçümü değildir. | Aynı ağ/CPU/cihaz koşullarıyla eski ve yeni üretim örneğinde tekrarlı Lighthouse/WebPageTest ölç; Search Console/CrUX mevcutsa 75. yüzdelik saha verisini karşılaştır. |
| P1 | İzin ve üçüncü taraf video görselleri | Eski video listeleri ve bazı medya alanları iframe izninden önce `img.youtube.com` görsellerini isteyebilir. Yeni üç kanal listesinde görseller kapalı. | Tarayıcı ağ kaydıyla izin öncesi istekleri doğrula; geçerli gizlilik politikasına göre yerel görsel/izin sonrası yükleme çözümünü ve KVKK metinlerini değerlendir. |
| P1 | Dağıtım, sağlık ve geri dönüş | Projede Dockerfile/Compose yok; `pnpm start` 127.0.0.1'e bağlı. `/health` statik HTML 200, bağımlılıkların hazır olduğunu göstermez. Hedef sunucu/reverse proxy/health/rollback provası kanıtlanmadı. | Hedefi netleştir; Coolify ise bind, Node 24, build/run ayrımı, sağlık kontrolleri, kaynak limiti, TLS, log/uyarı, yedek ve geri dönüş provasını doğrula. |
| P1 | Kaynak paritesi ve haklar | Veri paritesi testleri ve URL haritası var; tüm gerçek kullanıcı yolculukları, medya kullanım hakları ve Search Console'daki mevcut trafik kanıtlanmış değil. | Canlı-kaynak/yeni karşılaştırmasını form, indirme, video, menü, eski rotalar, medya ve lisanslar için kapat; kullanıcı kabulü al. |
| P2 | Video schema | `VideoObject` yayın tarihi verisi eksik; tarih doğrulanmadan uydurulmamalı ve Google video rich-result uygunluğu garanti edilmemeli. | Güvenilir uploadDate ve diğer zorunlu alanları kaynakla, Rich Results Test ile doğrula. |
| P2 | Video kaynak sayfaları | Dört yeni YouTube kaynak sayfası yerel noindex ve sitemap dışında. Üç kanal resmî RSS'inin en fazla 15 videosu gösterilir; 2026 listesi YouTube iframe kullanır. | Ürün/SEO indeksleme kararını ver; üretimde RSS erişimini, iframe iznini ve yedek bağlantıları test et. |
| P2 | SEO metinleri ve iddialar | Bazı meta/hero açıklamaları kelime ortasında kesilmiş; CDS TBDY 2018 iddiası, mevcut sayısal şirket iddiaları ve diğer ürün beyanları doğrulanmadı. | Kaynak metin, kanıt ve editoryal onayla düzelt; bilinmeyen tarih, yetki veya sayıları uydurma. |
| P2 | Güvenlik katmanları | Prod bağımlılık auditinde bilinen high güvenlik açığı raporlanmadı. CSP'de `unsafe-inline` var; bu tek başına XSS bulgusu değildir. Üç eski POST endpoint 410 döner. | Gerçek production header/cookie/TLS, dependency/SBOM, CSP sıkılaştırma, abuse/logging ve form sağlayıcısı ayarlarını kontrol et. Bu denetim penetration testi değildir. |
| P2 | Erişilebilirlik | Dört sayfada tek H1 ve dar ekran kontrol edildi; tam klavye, ekran okuyucu, odak, reduced motion ve WCAG 2.2 AA denetimi tamamlanmadı. | Kritik akışları klavye/ekran okuyucuyla test et; kontrast, erişilebilir ad, video izin ve modal davranışlarını doğrula. |
| P2 | AI / GEO | Makine tarafından okunabilir doğru içerik, iç linkler ve schema SEO için destekleyicidir; `llms.txt` tek başına AI görünürlüğü garantisi değildir. | Şirket ve ürün iddialarını kaynakla, yönlendirme ve içerik tutarlılığını doğrula; örnek sorularla tekrar edilebilir görünürlük ölçümü yap, sonucu garanti gibi sunma. |

## Yayın sırası

1. Açık ürün/içerik kararlarını, indeksleme kapsamını, form ve medya haklarını kapat; değişiklikleri gözden geçirip yayın adayını commit ile sabitle.
2. Hedef platformda ayrı korumalı staging kur; aynı commit ve gerçek production ayarlarıyla build, sağlık ve geri dönüş provası yap. İzinsiz kişisel veriyle form denemesi yapma.
3. Staging'de 301/200 zinciri, tüm canonical/sitemap/robots/header davranışı, arama, formlar, medya, mobil ve erişilebilirlik testlerini çalıştır. Önizlemenin indekslenmediğini doğrula.
4. Eski/yeni sayfaları aynı sentetik koşullarda mobil ölç; gerçek kullanıcı verisi varsa ayrı göster. İndeksleme ve gizlilik kararlarını onaylat.
5. Yayın için ayrı zamanlama ve onayla cutover; ardından health, hata/log, analitik, Search Console, sitemap ve eski URL'leri izle. Sorun olursa önceden prova edilen geri dönüşü uygula.

## Kaynaklar ve ölçüm sınırları

- Google Core Web Vitals: iyi hedefler LCP ≤2,5 sn, INP ≤200 ms ve CLS ≤0,1; gerçek kullanıcı deneyimiyle ilişkilidir: https://developers.google.com/search/docs/appearance/core-web-vitals
- Google AI arama özellikleri: özel schema ya da `llms.txt` zorunlu değildir; taranabilirlik ve yararlı, güvenilir içerik temel oluşturur: https://developers.google.com/search/docs/appearance/ai-features
- Google site taşıma: eşdeğer hedefe sunucu taraflı kalıcı yönlendirmeler ve yönlendirmeleri uzun süre koruma: https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes
- Google video structured data gereklilikleri: https://developers.google.com/search/docs/appearance/structured-data/video
- OWASP Top 10:2025: https://top10.owasp.org/2025/

## Denetim sırasında yerelde düzeltilenler

- İndeksleme açıkken `robots.txt` artık tüm `/_next/` yolunu engellemiyor; böylece gerekli CSS/JS/görsel kaynakları taranabilir. İnceleme ortamındaki `Disallow: /` davranışı korundu. SEO düzeltmeleri sonrası bayraklı yerel production derlemesi başarılı; dağıtım yapılmadığından canlı davranış sayılmaz.
- `llms.txt` içinde CDS, Allto ve Scalypso hedefleri ayrıldı; kaldırılmış Quick Start yoluna atıf mevcut ilgili hedefe düzeltildi. Şirketin sayısal iddiaları doğrulanmayı bekler.
- Video JSON-LD'deki YouTube izleme sayfasını dosya adresi gibi gösteren `contentUrl` kaldırıldı; `embedUrl` korundu. Eksik doğrulanmış yayın tarihleri hâlâ video zengin sonuç kontrolünü engeller.
- Bu değişikliklerle `pnpm typecheck`, `pnpm test` başarılı: 534 test, 4 atlandı; kaynak sözleşmesi, 51 parite, stil ve 45 token testi başarılı. Bu bir erişilebilirlik sertifikası, sızma testi veya gerçek kullanıcı performans ölçümü değildir.
- Sonraki güvenli iyileştirmeler: CDS Add-On, Industry ve Civil'in üç kesilmiş meta/hero açıklaması mevcut tam kaynak cümleleriyle düzeltildi; tüm veri üretiminin tekrar çalıştırılması henüz doğrulanmadı. RSS okumada 256 KiB sınırı ve genel hata sinyali uygulandı. 536 test (4 atlandı) ve tür kontrolü başarılı.
- Kullanıcı video oynatma davranışını mevcut hâliyle tutmayı seçti. Oynat düğmesi genel çerez kabulünü zorunlu tutmadan ilgili gömüyü yükler; önceden üçüncü taraf küçük görsel istekleri konusu hâlâ ayrı ağ/gizlilik kontrolüdür.
