# Coolify sunucu bakımı ve güvenli dağıtım devri

**Hazırlanma:** 4 Kasım 2026  
**Hedef bakım:** 5 Kasım 2026 gecesi, Türkiye saatiyle; saat aralığı henüz belirlenmedi.  
**Durum:** Planlama. Bu belge bakım, güncelleme, port kapatma veya üretim dağıtımı yapıldığını göstermez.

## Amaç ve kapsam

Aluplan ve aynı sunucudaki diğer servislerin devamlılığını koruyarak Coolify güvenlik açıklarını gidermek, geri dönüşü doğrulamak ve yalnız test edilmiş sürümün otomatik yayınlanmasını sağlamak. Sunucu başka uygulamalar, e-posta servisleri, veritabanları ve ters vekil de barındırır; bakım yalnız web sitesini etkileyen bir işlem olarak değerlendirilmemelidir.

## Son doğrulanan durum — 4 Kasım 2026

- Sunucuya mevcut Aluplan bakım anahtarıyla, host anahtarı doğrulanarak salt okunur SSH bağlantısı kuruldu; makine adı `vmi3049865`. Anahtar içeriği okunmadı veya belgeye kaydedilmedi.
- Canlı site ve `/health` 200; bekletilen `/products/allplan-rebar` ve `/products/allplan-parametric` 404. Depo private, `main` commit `4b0645a24e87b6e2ba6aa0ee5cbc4d202e32e7a2`, ilgili CI başarılı. Bunlar bakım öncesinde tekrar doğrulanmalı.
- Coolify `v4.0.0-beta.462`; üreticinin kritik [komut çalıştırma](https://github.com/coollabsio/coolify/security/advisories/GHSA-qqrq-r9h4-x6wp), [terminal yetki aşımı](https://github.com/coollabsio/coolify/security/advisories/GHSA-652w-qv22-2r7c) ve [PHP güvenlik](https://coolify.io/docs/knowledge-base/php-security-advisory-2026) duyurularındaki etkilenen sürüm aralığına giriyor. Bu tespit bir istismar kanıtı değildir.
- `https://coolify.aluplan.com.tr` çalışıyor; doğrudan HTTP 8000 erişimi de açık. 6001/6002 bağlantı kabul ediyordu. SSH sunucu ayarlarında root ve parola girişi açık; UFW ve Fail2ban etkin değildi. Sağlayıcı firewall'ı veya başka korumalar ayrıca doğrulanmadı.
- Coolify kontrol veritabanının günlük ve son manuel yedeği başarılı görünüyor; son kopya sunucuda, S3 kapalı. Sunucu dışı yedek alanı, `APP_KEY`'in ayrı güvenli kopyası ve geri yükleme provası doğrulanmış değil. Coolify DB yedeği, diğer uygulamaların verilerini veya volume'lerini kapsamaz.
- Eski site konteyneri `eko8c80g0cso4w844swcko4k-180201436191` durdurulmuş ama mevcuttu. Gerçek canlı geri dönüş denenmedi; yalnız ayrı test konteynerinde durdurma/başlatma denendi. Docker cleanup bu konteyneri silebilir. Eski `23dcc81` sürümüne dönmek bekletilen ürün metadata sızıntısını geri getirir.
- Otomatik yayın kapalı. Coolify beta.462'de izole test, seçilen commit yerine `main` HEAD'in çekilebildiğini gösterdi; manuel redeploy da etkilenebilir. Özel registry, sınırlandırılmış yayın yetkisi ve uçtan uca otomasyon henüz kurulmadı.

## Kullanıcının bakım öncesi netleştireceği konular

1. Yedek için ayrılan sunucu dışı alanın konumu, erişim yöntemi ve yeterli kapasitesi; kopyaların şifrelenmesi ve erişim yetkilileri.
2. Coolify `APP_KEY` ve gerekli SSH kurtarma materyalinin bu sunucudan bağımsız, güvenli kopyası. Değerler sohbet, repo veya bu belgeye yazılmamalı.
3. Diğer uygulamalar, veritabanları, e-posta verileri ve volume'ler için ayrı yedek/geri yükleme kapsamı; yedek penceresi ve sorumlu kişi.
4. 5 Kasım gecesi bakım saatleri, kabul edilebilir kesinti ve gerektiğinde iletişim yolu.

## Bakım öncesi giriş koşulları

- Canlı servislerin, alan adlarının, bağımlı portların ve mevcut sürümlerin güncel envanteri çıkarılsın; kullanıcı işlemleri ve e-posta etkisi belirlensin.
- Bağımsız SSH erişimi ve HTTPS panelin terminal/realtime işlevleri yeniden doğrulansın. Yönetim portları kısıtlanmadan önce alternatif erişim ve kilitlenme halinde kurtarma yolu kanıtlansın.
- Coolify DB ve kapsam dahilindeki ayrı uygulama verilerinin güncel yedekleri oluşturulsun; sunucu dışı kopyalar ve şifreleme anahtarı doğrulansın. Ayrı ortamda geri yükleme provası yapılmadan yedek geri kazanılabilir sayılmasın.
- Önceki çalışan imajlar, yapılandırma ve geri dönüş adımları kaydedilsin; yedeklenen üretim verisi üzerinde restore provası yapılmasın.
- Bakım penceresi, kesinti ve geri alma eşiği netleştirilip uygulamaya geçiş için kullanıcı kararı alınsın.

## Önerilen bakım sırası

1. **Geçici erişim koruması:** SSH erişimi ve geri dönüş kanıtlandıktan sonra Coolify yönetimini güvenli bir yolla sınırla. 8000/6001/6002 dahil kuralların gerçek bağımlılıklarını ve sağlayıcı firewall'ını önce kontrol et. Web, e-posta ve diğer servislerin portlarını gelişigüzel kapatma.
2. **Coolify güncellemesi:** Üreticinin beta sürümler için [önerdiği yolu](https://coolify.io/docs/knowledge-base/php-security-advisory-2026) ve bakım anındaki güncel sürüm notlarını değerlendir. Duyurudaki yol önce `4.0.1`, ardından yamalı güncel sürüme geçiştir. Diğer uygulamaların devamlılığı, panel, SSH, proxy ve sağlık kontrolleri her aşamada doğrulansın. Kesintisizlik garanti edilmez.
3. **Sunucu güvenliği:** Yönetim yüzeyini ve SSH erişimini daralt; ikinci erişim/kurtarma yolu test edilmeden root veya parola girişini kapatma. Sağlayıcı firewall'ı, brute-force koruması, Coolify MFA ve bekleyen yeniden başlatma ihtiyacını ayrıca değerlendir.
4. **İzole yayın hattı:** CI'da doğrulanmış commit'ten private OCI imajı üret. Production imajında build ve runtime için `ALUPLAN_SHOW_2027=1` ve `ALUPLAN_BLOCK_INDEXING=0`; önizleme için indeksleme engeli kullanılmalı. Aynı imajın digest'i üzerinde sağlık, indeksleme ve bekletilen ürün testleri çalıştırılsın.
5. **Yetki ve test:** Private registry için yalnız gerekli pull erişimi ve Coolify'da mümkün olan en dar dağıtım yetkisi seçilsin. İmaj digest'i, commit/CI kaydı ve gerçek çalışan imaj eşleştirilsin. Art arda commit, başarısız imaj/health, yeniden deneme, sıra ve önceki güvenli digest'e geri dönüş testleri canlı dışında yapılsın.
6. **Canlıya geçiş:** Yalnız izole testler ve sağlık/geri dönüş kapıları geçince kontrollü üretim yayını yap; sonrasında ana sayfa, `/health`, sitemap, www yönlendirmesi, bekletilen ürünler ve ilgili servisler kontrol edilsin. Hata durumunda tanımlanmış geri dönüş planı uygulansın.

## Açık teknik kararlar

- GitHub private depo CI branch protection erişimi plan kısıtına takıldı; hesap özellikleri ve `main`e doğrudan yazma sınırı doğrulanmalı.
- GHCR private pull için ayrı, yalnız ilgili pakete erişen hizmet hesabı ve `read:packages` yaklaşımı değerlendirilmeli; Docker'ın sunucudaki registry kimlik bilgilerini şifreli sakladığı varsayılmamalı. [GitHub registry kimlik doğrulaması](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry), [Coolify registry rehberi](https://coolify.io/docs/applications/builds/docker-registries).
- Coolify beta.462'de digest güncellemesi için gereken API `write` yetkisi takım genelinde geniş olabilir; doğrudan CI'a bu yetki verilmeden, yamalı sürümde kaynak bazlı yetki veya güvenli bir aracı tekrar değerlendirilmeli.
- `.worktrees/codex-auto-deploy/` içindeki release-candidate taslağı etkin değildir; anlık HEAD karşılaştırması tek başına yarış koşulunu çözmez ve dağıtım yetkisiyle etkinleştirilmemelidir.

## Bakım öncesi durma koşulları

Sunucu dışı kurtarma materyali veya izole restore kanıtı yoksa; erişim kısıtlaması SSH/paneli kilitleyebilecekse; başka servisin etkisi belirsizse; üretilecek imaj/commit eşleşmesi doğrulanamıyorsa veya sağlıklı geri dönüş yolu yoksa **işlemi durdur ve mevcut çalışan sistemi koru**. Kritik açıklar için üreticinin geçici izolasyon önerisi bu durma koşullarıyla birlikte ayrıca değerlendirilmelidir; bakımın ertelenmesi güvenlik riskini ortadan kaldırmaz.
