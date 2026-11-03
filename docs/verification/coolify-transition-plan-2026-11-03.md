# Coolify: Aluplan 2026 → 2027 geçiş planı — 03.11.2026

## Salt okunur mevcut durum

- Coolify `Aluplan 2026 Web / production` uygulaması `Running`; kaynak Public GitHub `hazarvolga/aluplan-2026`, branch `main`, commit ayarı `HEAD`. Panelin çalışan sürüm bağlantısı `a958c9d8e379e573ae8402ab2cfe13a60cf5fc28` gösteriyor; bu gerçek alan adındaki her yanıtın hash ile doğrulandığı anlamına gelmez.
- Yapılandırma build pack `Dockerfile`, `/Dockerfile`, base directory `/`, container port 3000, `https://aluplan.com.tr` ve `https://www.aluplan.com.tr`; www/non-www ikisine izin veriliyor. Panel Healthcheck ekranında `Enable Healthcheck` sunuluyor, yapılandırılmış kontrol etkin görünmüyor; Docker image HEALTHCHECK durumu ayrıca doğrulanmalı.
- Rollback ekranında iki yerel image gösteriliyor: `a958c9d8...` ve `36f79aa...`; 2 image saklama ayarı var. Bunun çalışır ve sonraki deploy sonrası korunur olduğu test edilmedi.
- 2027 uzak `main` `2589a9a...`, çalışma `codex/design-phase-4` `586c44c...` ve main'in 5 commit ilerisinde. Yeni repo main seçilirse bu çalışma otomatik gelmez; strateji ayrıca onaylanmalı.
- 2027 Node 24, pnpm 10.24.0; Git'te Dockerfile yok. `pnpm start` 127.0.0.1:3000 dinler, konteyner proxy için 0.0.0.0 gerektiğinden uygun runtime hazırlanmalı. Önceki 2026 Dockerfile Node 22 ve `.next/standalone` kullanır; aynen kopyalamak yeni projede doğrulanmış bir çözüm değildir.
- Uygulama bayrakları `ALUPLAN_SHOW_2027=1`, `ALUPLAN_BLOCK_INDEXING=1` önizleme için; üretim için `ALUPLAN_SHOW_2027=1`, `ALUPLAN_BLOCK_INDEXING=0` build/runtime davranışı doğrulanmalı. Gizli değişken değerleri incelenmedi.

## Önerilen aşamalar

1. Mevcut uygulamanın source/build/port/domain/health/rollback ve mevcut canlı commit envanterini, varsa secret **değerlerini kaydetmeden**, operasyonel olarak doğrula. Server kapasitesi/disk, image retention, git auto-deploy/webhook, DNS/TLS ve geri dönüş bağımlılıklarını gözden geçir.
2. 2027 repo için Node 24/pnpm lockfile ve uygun container runtime (0.0.0.0:3000) ile Dockerfile oluştur; gerçek deploy kararı öncesi repo içinde test et. `ALUPLAN_SHOW_2027` build ve runtime'da geçerli mi, legacy bayrak guard'ı ve bağımlı build girdileri incelensin. Gereken app health endpoint ve hazır olma koşulu tasarlansın.
3. Mevcut production uygulamasına dokunmadan ayrı staging uygulaması ve ayrı önizleme alan adı kur. Erişim koruması ve noindex kullan; mevcut canonical'ın aluplan.com.tr'ye işaret etmesi önizlemede yanlış indeksleme riskidir. Etkili indeksleme davranışını doğrula. Staging için önceden uygun kaynak kapasitesini kontrol et.
4. Tam revizyona sabitlenmiş build ve staging içinde port/health, eski URL→yeni 301/308, self-canonical/sitemap/robots, tüm kritik içerik/menü/form/video, 355px mobil, görseller, aydınlık/koyu, erişilebilirlik, performans, RSS erişimi, güvenlik header'larını doğrula. Video küçük resim izin öncesi istekleri ve görsel hakları açık konu.
5. Önce sürüm stratejisini (gözden geçirilmiş 2027 main veya sabitlenmiş release commit/branch), ardından DNS/domain/proxy cutover yöntemini ve zamanı onaylat. Canlı domaini birden fazla uygulamaya aynı anda bağlamadan proxy davranışını ve iki sürümün eşzamanlılığını staging'de kanıtla.
6. Gerçek cutover öncesi eski image'ın ve eski repo/branch/commit/build/port/domain ayarlarının korunmasını doğrula; retention veya temizleme nedeniyle kaybolabilecek image'a tek güvenme. Eski uygulamayı geri açma, source yeniden build ve domain/proxy geri bağlama adımlarını prova et. Beklenen etki ve bakım penceresi için açık onay al.
7. Onaylı kesim sonrası ilgili production release hash, health, domain/TLS, www yönlendirmesi, header/noindex, 301/308, form/video ve logları doğrula; Search Console sitemap ve hata/performans izlemesini başlat. Başarısızlıkta önceden doğrulanmış geri dönüş planını uygula.

## Dikkat ve sınırlar

Coolify rolling update kesintisizliği garanti etmez; readiness, proxy ve mevcut image healthcheck'i doğrulanmalıdır. https://coolify.io/docs/applications/deployments/rolling-updates
Dockerfile uygulamasında process 0.0.0.0'a bağlanmalıdır. https://coolify.io/docs/applications/builds/dockerfile
Sağlık kontrolü yalnız gerçekten ölçtüğü durumu kanıtlar. https://coolify.io/docs/applications/configuration/health-checks
Rapor yalnız gözlem ve plandır; Coolify ayarı, repo, DNS veya canlı site değiştirilmedi; deployment yapılmadı.
