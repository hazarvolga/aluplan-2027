# Oturum devri

## 08.11.2026 — Akademi yeniden tasarımı: kendi kabuğu + mimari dil (main'e birleşti)
- Akademi'ye kendi odaklı kabuğu verildi (SiteShell yok). main HEAD `9cd94bc` (merge), restore tag `restore/pre-akademi-redesign-20261108` (114288c). Dal `codex/akademi-redesign-20261108` birleşti ve silindi. 11 görev commit'i + merge; her şey hâlâ `ALUPLAN_SHOW_AKADEMI` arkasında, noindex, üretimde seviye HTML'i üretilmiyor.
- **Büyük mimari karar (kullanıcı bana bıraktı):** Route-group `(site)` taşıması TERK edildi; yerine `SiteShell`'de `hasOwnChrome` guard'ı (`src/lib/chrome-routes.ts`, `OWN_CHROME_PREFIXES=['/akademi']`). Gerekçe: taşıma, projenin flat-path tooling'ine (~30 test + 4 veri-hattı script'i: search-index, parity, structured-pages, source-card-links) grup-farkındalığı retrofit'i gerektiriyordu; URL türeten script'lere `(site)` sızma riski production-kritik. Guard: dosya taşıması yok, veri hattına dokunmaz, geri alınabilir. Taşıma `reset --hard` KULLANILMADAN `git mv` ile geri alındı.
- **Yapılanlar:** (1) `ThemeModeProvider` tema state'i köke; (2) `ConsentBanner` çerez onayı köke (akademi'de de görünür); (3) chrome guard; (4) `AkademiShell` (ince header: logo→`/`, "ALLPLAN'ı keşfet"→`/products`, tema toggle; minimal footer); (5) `AkademiSidebar` (sticky rail + mobil çekmece, aktif seviye wayfinding aksanı `--action-primary-bg`, odak yönetimi: inert/focus/Esc); (6) `src/components/akademi/kit/` token-only bileşen kiti (ModuleCard/LevelCard/MetaRow/SectionRule/Callout); (7) overview LevelCard grid'iyle; (8) seviye sayfaları kitle + **saat tekrarı giderildi** (tek-modüllü kolda `showHours={!single}`); (9) lazy GSAP imza reveal (ayrı chunk, reduced-motion'da kapalı; `gsap` dependency eklendi); (10) `AkademiJsonLd` Course/ItemList yapısal verisi.
- **Doğrulama:** Taze production build (ayrı worktree, ALUPLAN_SHOW_2027=1): BUILD OK, seviye HTML'i yok, `pnpm test` = 651 unittest + parity 52/52 + token 47 + renk guard 191 dosya YEŞİL. Dark+light + mobil + a11y canlı doğrulandı. Taze reviewer (opus) APPROVE (CRITICAL/HIGH yok); tek MEDIUM (mobil sidebar odak) merge öncesi düzeltildi.
- **Ertelenen minörler (ledger'da):** GSAP reveal'de kısa ilk-render sıçraması (reduced-motion güvenliği için bilinçli); `AkademiJsonLd` SITE sabiti `SITE_ORIGIN` ile aynı değer (launch'ta import edilmeli); `LevelCard` "/ 04" + istatistik 4-seviye varsayımı hardcode. **Sonraki fazlar:** ders sayfaları (DistributionBar+Timeline kiti o zaman), bilgi bankası, hesap/bülten.

## 08.11.2026 — Aluplan Akademi: tam müfredat + seviye sayfaları (taslak, canlıda gizli)
- Kullanıcı onayıyla Akademi taslağı genişletildi; hepsi `ALUPLAN_SHOW_AKADEMI` flag'i arkasında, production'da gizli (flag set değilse `notFound()`; `generateStaticParams` üretimde `[]` döndürür, `dynamicParams=false`). main HEAD `12ac88d`. Önceki durma noktası tag: `restore/pre-akademi-full-20261108` (9f31626). Diğer tag: `restore/pre-akademi-20261108` (d8d9e8b).
- **Müfredat** (`docs/curriculum/`): `bim-egitim-mufredati` skill'iyle üretildi. 00-program-kimliği, 01-kazanımlar-ve-hizalama (Bloom kodlu K-kodları), 02-program-mimarisi (seviye/modül/saat, 98 saatlik tam yol), 03-ders-planlari/ (12 modül: M1-M10 + M4B, M3B; Seviye 2-4 paralel subagent ile yazıldı, yapı/tutarlılık incelendi), 04-ölçme, 05-soru-bankası, 06-bitirme-projesi, 07-sertifikasyon, 08-eğitmen-rehberi, 09-kaynaklar, 10-kalite. Web quizleri öz değerlendirme; sertifika yalnızca eğitmenli eğitimde. ALLPLAN'a özgü araç adları `[sürüme göre doğrula]` ile işaretli.
- **Sayfalar**: `/akademi` (genel bakış, mevcuttu) + yeni `/akademi/seviye-1..4` dinamik detay sayfaları (`AkademiLevelDetail`). Her seviye: modüller + kazanımlar; Seviye 3 dört eşit süreli disiplin kolu; önceki/sonraki navigasyon. `akademi.ts`'e seviye `slug` ve modül `outcomes` eklendi; genel bakış kartları detay sayfalarına linkli. Hepsi token-only CSS, noindex, sitemap/menü/arama dışında.
- Doğrulama: 620 unittest (4 atlama) + 47 token/parity testi + typecheck + renk kontrolü + production build `.worktrees/akademi-verify`'da geçti; üretim çıktısında seviye HTML'i YOK (yalnızca `akademi.html` = 404, landmark testinde hariç tutulu). Dev server (`http://127.0.0.1:3002/akademi`) ile görsel doğrulandı. CI henüz izlenmedi.
- Açık uçlar: ALLPLAN güncel sürüm arayüz terimleri doğrulanacak; resmî ALLPLAN sertifika adı doğrulanacak; M6/M7 (8+8) ve M8 (16) saatleri eşit-kol kuralıyla PRD'den (10+10, 14) farklı tutuldu. Sonraki fazlar: bilgi bankası, hesap/bülten (KVKK + Coolify bakımı sonrası).

## 08.11.2026 — Mobil menü, Max klipleri, Bridge Türkçesi ve metrik grid canlıda
- Kullanıcı onayıyla dört özellik `origin/main`'e `4b0645a..d8d9e8b` olarak gönderildi: `6c5d09e` Bridge Türkçesi, `254f698` Max klip posterleri ve görünürlükle yükleme, `d8d9e8b` gruplu mobil menü ve `--hero-metric-columns` metrik grid. Yayın, `.worktrees/ui-release` (dal `codex/ui-release-20261108`) izole kopyasından yapıldı; bu klasördeki commitlenmemiş değişiklikler yayınlanmadı ve bu klasör main'in 5 commit gerisinde. Bu klasörden doğrudan yayın yapılmamalı: canlıdaki Cloud bağlantısı kaldırması ve Rebar/Parametric metadata düzeltmesi bu dalda yok. Bu klasördeki bu dört özelliğe ait değişiklikler artık main'de; yeniden yayınlanmamalı.
- Doğrulama: GitHub CI 42487759413 başarılı; 610 unittest (51 atlama, kaynak yok), 47 token testi, typecheck, üretim build, `pnpm audit` temiz. Bağımsız incelemede kritik/yüksek bulgu yok. Başsız Chromium'da Max klipleri: mobilde poster ve kontrol, otomatik oynatma yok; masaüstünde üç klip otomatik oynuyor.
- Coolify `Aluplan 2027 Production (Private Git)` Git Source SHA `d8d9e8b26b231ffa4ea310ad23edb73b77a04fb9` yapıldı ve Redeploy ile dağıtıldı (2 dk 19 sn, healthy). Canlı: `/`, `/health`, `/robots.txt`, `/sitemap.xml`, `/products/frilo`, `/products/allplan-max`, Bridge sayfası 200, www 308; Bridge Türkçe, ana sayfada Cloud bağlantısı yok, Rebar/Parametric 404/noindex ve gövdede ürün adı yok. Geri dönüş: Git Source SHA `4b0645a24e87b6e2ba6aa0ee5cbc4d202e32e7a2`, ardından yeniden dağıtım.
- Açık: gerçek iPhone/Safari'de mobil menü ve Max klip testi yapılmadı. İncelemenin orta bulguları uygulanmadı: menü Geri/İleri veya logo ile sayfa değişince açık kalabilir, Esc sonrası odak düğmeye dönmüyor, `div role="navigation"` yerine `nav` önerildi, `summary` odak stili ve "Tüm Çözümler/Ürünler" etiketinin başlık metnine bağlı seçimi. Coolify oturumu HTTP (`167.86.84.107:8000`) üzerinden yapıldı; güvenlik bakımı yarın gece, plan `docs/operations/coolify-server-handoff-2026-11-04.md`.

## 04.11.2026 — Sunucu bakımı yarın geceye planlandı
- Kullanıcı sunucu güvenliği, yedek ve otomatik yayın işlerini bugün uygulamamak; 5 Kasım 2026 gecesine planlamak istedi. Türkiye saatiyle bakım aralığı henüz belirlenmedi. Kullanıcı sunucu dışı yedek alanını ve geri dönüş koşullarını netleştirecek.
- Ayrı sunucu devir ve bakım planı: `docs/operations/coolify-server-handoff-2026-11-04.md`. Plan uygulanmadı; sunucu/servis ayarı, güncelleme, firewall veya dağıtım yapılmadı. Kritik güvenlik riski bakım beklerken devam eder.

## 04.11.2026 — Coolify kritik güvenlik ve otomatik dağıtım incelemesi
- Kullanıcı özel imaj ve otomatik dağıtımın güvenle kurulmasını, ardından sunucu güvenlik değerlendirmesini istedi. HTTPS panelde kurulu `v4.0.0-beta.462` teyit edildi: GHSA-qqrq-r9h4-x6wp (<=beta.462; application write ile RCE/sır sızdırma), GHSA-652w-qv22-2r7c (<=beta.470; düşük yetkili oturumla terminal yetki aşımı) ve üreticinin PHP2Shell v4 beta duyurusunun etkilenen sürüm sınıfında. İstismar edildiğine dair kanıt yok. Üretici beta'dan önce 4.0.1 sonra 4.4.7 güncellemesini öneriyor; diğer servislerle paylaşılan kontrol düzlemi olduğu ve geri dönüş hazır olmadığı için güncelleme yapılmadı.
- Dışarıdan 80, 443, 8000, 6001, 6002 TCP erişimi gözlendi; HTTP 8000 üzerinden Coolify paneline erişim var. Varsayılan SSH kimliğiyle ilk deneme başarısızdı; kullanıcı onayıyla mevcut Aluplan bakım anahtarı kullanılarak strict host key doğrulamasıyla salt okunur SSH bağlantısı başarılı ve hostname `vmi3049865` doğrulandı. Anahtar içeriği okunmadı veya değiştirilmedi. Bu nedenle firewall veya panel kapatılmadı. HTTPS tek başına HTTP erişimini kapatmıyor.
- Coolify DB yerel günlük yedekleme açık, S3 kapalı. Kullanıcı işi kapsamında Backup Now ile yeni yedek başarılı, sadece local storage; sunucu dışı kopya, APP_KEY'in ayrı güvenli kopyası ve restore provası doğrulanmadı; kullanıcıya soruldu. APP_KEY/sırlar okunmadı.
- Güvenlik açığı ve geniş yetki nedeniyle yeni registry veya Coolify API kimliği oluşturulmadı, otomatik dağıtım etkin değil. GHCR private pull classic `read:packages` gerektiriyor; ayrı yalnız hedef pakete erişebilen hesap önerilir, Docker credential storage kodlanmış/şifresiz. beta.462 image SHA ayarı API write erişimi takım genelinde olabilir; uygulama düzeyinde sınırlandırma kanıtlanmadı. Güvenli yayıma geçmeden yazılım güncellemesi, doğrulanmış yedek/rollback, özel paket ve en az yetkili deploy yolunun testi gerekir.

## 04.11.2026 — Ana sayfadaki Cloud bağlantısı kaldırıldı
- Kullanıcının canlı sayfa bildirimi üzerine `ALLPLAN CLOUD Hizmetleri` bağlantısı ana sayfa ürün başlığı altından kaldırıldı; ürün sayfası ve diğer kullanımlar korundu. İzole `.worktrees/codex-auto-deploy` çalışmasında `4b0645a24e87b6e2ba6aa0ee5cbc4d202e32e7a2` commit main'e gönderildi; GitHub CI 41888812269 başarılı, 5 ilgili test ve typecheck başarılı, bağımsız kod incelemesinde kritik/yüksek bulgu yok. Coolify üzerinden HTTPS ile canlıya dağıtıldı; logda doğru commit, rolling update ve healthy doğrulandı. Tarayıcıda ana sayfada bağlantı yok, `/health` ve Cloud ürün sayfası 200, bekletilen iki ürün 404.
- Otomatik dağıtım hâlâ aktif değil; Coolify SHA override bug'ı nedeniyle manuel dağıtım öncesi main HEAD ve CI kontrol edilmeli. Otomasyon aday taslağı `.worktrees/codex-auto-deploy/` içinde commit edilmemiştir; üretime bağlanmamıştır. Kullanıcının Coolify sunucusu güvenlik incelemesi talebi otomasyon tamamlandıktan sonraya ayrıldı.

## 04.11.2026 — Otomatik dağıtım ve Coolify HTTPS çalışması
- Kullanıcı CI başarılıysa test edilmiş commit'in otomatik ve güvenli dağıtımını, Coolify HTTPS'i ve iş bitiminde sunucu güvenlik değerlendirmesini onayladı. `coolify.aluplan.com.tr` Cloudflare proxied A kaydı ve Coolify instance HTTPS alan adı kuruldu; 1.1.1.1 DNS ile kayıt çözülüyor, Cloudflare edge ve origin HTTPS üzerinden sertifika doğrulamalı 302 `/login`, canlı `/health` 200. DNS yayıldı; tarayıcı HTTPS giriş sayfasına sertifika uyarısı olmadan ulaştı, HTTPS kullanıcı oturumu tarayıcıda doğrulandı; 8000 doğrudan erişim kapatılmadı. Kullanıcı güvenlik değerlendirmesini otomasyon işinden sonra istiyor.
- KRİTİK: Coolify beta.462 `ApplicationDeploymentJob::check_git_if_build_needed` deploy kuyruk SHA'sını dal HEAD'i ile değiştiriyor. Alan adı olmayan `Aluplan Commit Pin Regression Test` (`ncgkc880g0kww80kok4808k0`) ile eski 23dcc81 sabitliyken deployment 07031962 HEAD çekti; dağıtım build öncesinde iptal edildi. Önceki 'üretim commit'e sabit' ifadesi güvence DEĞİLDİR; üretimde manuel yeniden dağıtım bile HEAD'i yayınlayabilir. Üretimde auto webhook yok, otomasyon etkinleştirilmedi.
- Alternatif Docker image digest deneniyor; alan adı olmayan `Digest Pull Regression Test` (`ag4soo80s44socs4g80w004g`). Coolify yeni image oluşturma formu digest'i yanlış biçimde `nginx@sha256@sha256:...` oluşturdu ve ilk test başarısız; kaynak adı elle `nginx` yapıldığında nginx imajı digest ile çekilip dağıtıldı; izole test Docker cleanup yapılmadan durduruldu. Registry erişimi, SHA eşlemesi, deployment izleme ve güvenilir rollback henüz tamamlanmadı. Kullanıcı projede gizli değerlerin okunmamasını istiyor; yeni geniş kapsamlı registry veya Coolify token erişimi kurmadan yetki kapsamı doğrulanmalı.

## 04.11.2026 — Özel Git kaynaklı üretim geçişi
- Kullanıcı isteğiyle üretim, deploy key kullanan `Aluplan 2027 Production (Private Git)` (`fk00cs848w08owswsc4o0gss`) uygulamasına geçirildi. Repo `hazarvolga/aluplan-2027` private; anahtar yalnız bu depoya salt okunur, GitHub ID 168788476. Kaynak `main`, SHA `07031962cb61b53fb223fc99127bdd028bdc61c1` sabit; yeni uygulama `/health` ile healthy. Ortam bayrakları üretim `ALUPLAN_SHOW_2027=1`, `ALUPLAN_BLOCK_INDEXING=0`, build/runtime; önizleme indeksleme engeli 1; canlı ileri ayarları ve limitleri eşleşiyor, eski uygulamada kalıcı volume/görev yok.
- `aluplan.com.tr` ve `www` alan adları yeni uygulamada; eski `eko8c80g0cso4w844swcko4k` yapılandırmasından çıkarıldı ve eski konteyner `eko8c80g0cso4w844swcko4k-180201436191` Docker ile silinmeden durduruldu. Coolify Stop konteyneri siler, eski uygulamada özel Git erişimi yok: rollback için önce yeni konteyneri durdurup eski konteyneri Docker ile başlatma provası yalnız ayrı test konteynerinde yapıldı; gerçek canlı rollback denenmedi. Eski container cleanup ile silinmemeli.
- Geçiş sonrası `/`, `/health`, `/robots.txt`, `/sitemap.xml`, `/products/frilo` 200, www health ana domaine yönlenerek 200; iki bekletilen ürün 404/noindex ve HTML isim sızıntısı yok. Üretim uygulamasında özel SSH anahtarıyla ikinci manuel dağıtım tamamlandı, rolling update ve health geçti; dağıtım sonrası aynı canlı kontroller yeniden başarılı. GitHub depo webhook listesi boş; otomatik push dağıtımı doğrulanmadı, SHA sabitli olduğu için sonraki sürüm bilinçli olarak Git Source SHA güncellenerek manuel dağıtılmalı.

## 04.11.2026 — Önceki durum: depo private, Coolify bağlantısı bekliyordu
- Kullanıcı talebiyle `hazarvolga/aluplan-2027` GitHub deposu PUBLIC → PRIVATE yapıldı; anonim raw ürün kaynak isteği 404, çalışan canlı `/health` 200 ve Coolify `07031962cb61b53fb223fc99127bdd028bdc61c1` healthy. Ürün içeriği ve commit geçmişi korundu; önceki dış kopyalar/önbellek geri alınamaz.
- Üretim uygulamasının Git Source'u hâlâ `Public GitHub`; özel kaynak geçişi henüz yapılmadı ve bu nedenle sonraki yeniden derlemeler başarısız olabilir. Üretim uygulamasını redeploy/stop ETME. Coolify Sources'ta mevcut Git app yok; kurulu beta.462 arayüzünde mevcut public uygulamaya ilk deploy key ataması görünmüyor. Dokümante edilen yol yeni `Private Repository (with Deploy Key)` uygulaması; domainsiz test, salt okunur anahtar, sonra kontrollü kaynak/domain geçişi gerekiyor. Depoya özel `aluplan-2027-coolify-readonly` deploy key (GitHub ID 168788476, read_only=true) ve Coolify anahtarı oluşturuldu; alan adı olmayan `Aluplan 2027 Private Git Test` (`fk00cs848w08owswsc4o0gss`) private SSH üzerinden `07031962cb61b53fb223fc99127bdd028bdc61c1` commitini başarıyla çekti; Docker derlemesi ve dağıtımı tamamlandı, Coolify durumu Running (health bilinmiyor). Mevcut uygulamaya anahtar ataması beta.462 UI veya API PATCH ile desteklenmiyor; canlı geçişten önce güvenli yapılandırma aktarımı, sağlık, indeksleme, domain, webhook ve rollback doğrulaması gerekli. Ortamı topluca klonlama diğer servisleri etkileyebilir. Git görünürlüğünü public'e geri çevirmek ürünleri tekrar ifşa eder.

## 04.11.2026 — Yayınlanmamış ürünlerin korunması
- Kullanıcı, henüz çıkmamış ürünlerin Şubat'a kadar gizli kalmasını istedi; mevcut 03.11 kararında Rebar ve Parametric açıkça bekletiliyor, başka ürün kapsamı kullanıcıdan soruldu. Canlı sitemap'teki 112 sayfada iki ürünün tam adı veya adresi yok; menü, arama, sitemap, llms.txt dışındalar.
- Önemli sızıntı düzeltildi: her iki 404 yanıtının ham HTML/RSC metadata'sı önceden ürün adını, açıklamasını, canonical ve index/follow değerini veriyordu. `07031962cb61b53fb223fc99127bdd028bdc61c1` canlıya dağıtıldı; iki URL 404/noindex, ham gövdede ürün adları/canonical/index-follow yok, FRILO ve health 200. Lokal preview korunuyor. 605 test/4 atlama, üretim build ve bağımsız kod/güvenlik incelemesi başarılı; CI 41883325856 son kontrolde çalışıyordu. Geri dönüş `23dcc81c65ff6964cafb05fda2c5314a1e58da11` ancak bu metadata sızıntısını geri getirir.
- KRİTİK AÇIK KONU: GitHub `hazarvolga/aluplan-2027` deposu PUBLIC; her iki ürünün metin kaynak dosyaları ve commit geçmişi anonim okunabiliyor. Canlı metadata düzeltmesi bunu gizlemez. Depoyu private yapmak mevcut çalışan siteyi hemen durdurmaz ancak Coolify `Public GitHub` kaynak kullanıyor ve özel erişim kurulmazsa sonraki build/deploy başarısız olur. Özel depo erişimi ve repository görünürlüğü için kullanıcı onayı ve uygun yetkilendirme gerekli; eski kopya/önbellek geri alınamaz.

## 04.11.2026 — FRILO ve Basic görselleri canlıda
- `23dcc81c65ff6964cafb05fda2c5314a1e58da11` main/production'a dağıtıldı; önceki `d340356a0f34199155bd6980bfd9967490e95a5f` geri dönüş noktası. CI 41881649569 başarılı, `/health` 200; yeni FRILO WebP ve Basic AVIF 200/uygun MIME. FRILO 10 sürüm kartı responsive WebP/JPEG fallback; hero mobil ~43 KiB/masaüstü ~141 KiB, önceki JPEG ~371 KiB. Basic mobil AVIF ve bir kart WebP/PNG fallback; başka kullanıcı içeriği korunur.
- Search Console mobil/masaüstü CrUX son 90 günde yetersiz (02.11 verisi). 7 Eki–3 Kas GA4: 19 etkin kullanıcı ve Basic 28, FRILO 21 görüntüleme; küçük/onay seçilimli örnek. Mobil PSI tek örnek karşılaştırması: FRILO https://pagespeed.web.dev/analysis/https-aluplan-com-tr-products-frilo/gais71p34f?form_factor=mobile 84/LCP 4,65 sn/tahmini görsel tasarruf 2063 KiB → https://pagespeed.web.dev/analysis/https-aluplan-com-tr-products-frilo/e4f25aidu5?form_factor=mobile 95/LCP 3,0 sn/356 KiB. Basic https://pagespeed.web.dev/analysis/https-aluplan-com-tr-products-allplan-basic/vpsntw0s82?form_factor=mobile 87/LCP 4,07 sn/130 KiB → https://pagespeed.web.dev/analysis/https-aluplan-com-tr-products-allplan-basic/1xskav91cs?form_factor=mobile 82/LCP 4,35 sn/92 KiB; skor değişimi tek ölçümle nedensel sayılmaz. Temiz bağımsız tekrar ve gerçek iOS/Safari görsel netliği henüz yok.

## 04.11.2026 — Mobil alan verisi ve popüler sayfa görselleri
- Search Console `sc-domain:aluplan.com.tr` Core Web Vitals (son güncelleme 02.11.2026): mobil ve masaüstü için son 90 günde yeterli Chrome UX kullanımı yok; gerçek mobil LCP sonucu bulunmuyor. GA4 Sayfalar ve ekranlar, 07.10–03.11 dönemi: `/` 110, `/kaynaklar` 38, `/products/allplan-basic` 28, `/kaydedilmis-webinarlar` 26, `/products/frilo` 21 görüntüleme; toplam 19 etkin kullanıcı, küçük/onaylı örneklem ve iç test etkisi olası.
- Önceki canlı PageSpeed mobil FRILO: 84, LCP 4,65 sn, görsel dağıtımında tahmini 2063 KiB fırsat; Basic: 87, LCP 4,07 sn, görselde tahmini 130 KiB fırsat. Tek laboratuvar ölçümüdür; FRILO kart görselleri ve Basic kaynakları yerelde inceleniyor.
- Analytics'te geçmiş görüntülemesi bulunan `/products/allplan-rebar` canlıda 404; `heldUntilManufacturerRelease` nedeniyle üretici yayınına kadar kasten kapalıdır ve son görsel dağıtımının regresyonu değildir. Bu rota yetkisiz açılmamalı. PageSpeed'in 404 hata sayfasına verdiği 100 puan ürün performansı olarak değerlendirilmemeli.

## 04.11.2026 — Mobil performans tekrar incelemesi
- Canlı `d340356` için GitHub CI 41877262241 başarılı. Mobil PageSpeed'de 20:40 raporu 83/LCP 4,35 sn; kısa aralıklı tekrar aynı değerleri verdi ve bağımsız sayılmadı. 20:41 raporu https://pagespeed.web.dev/analysis/https-aluplan-com-tr/czecjrj14v?form_factor=mobile 94/LCP 3,0 sn; farklı ölçümlerde belirgin değişkenlik sürüyor, CrUX verisi yok.
- CSS incelemesinde desteklenen field temasını kaldırmadan sayfaya özel stillerin yaklaşık 1,8 KB gzip teorik üst sınırı bulundu; ortak seçici/cascade riski nedeniyle ölçülmemiş refactor yapılmadı. Mobil raporda hero indirme ~120 ms, render gecikmesi ~2,06 sn; kaynağı belirsiz forced reflow ~101 ms. Kalıcı kök neden henüz doğrulanmadı.
- Canlı Lighthouse trace'te ana thread ~629 ms, paint/composite ~44 ms; maskeyi tek başına kök neden gösteren kanıt yok. Yalnız teşhis amacıyla maskeli/maskesiz iki yerel production build'de dönüşümlü 3+3 mobil test LCP medyanı 3685→3686 ms, skor 90→90 gösterdi; tasarımı değiştiren bu aday uygulanmadı. Lokal test gerçek CDN/ağ/GPU koşullarını temsil etmez.

## 04.11.2026 — Görsel performans paketi canlıda
- Kullanıcı onayıyla izole görsel performans paketi `d340356a0f34199155bd6980bfd9967490e95a5f` olarak main'e gönderildi ve Coolify production'a dağıtıldı. Önceki çalışan SHA `da2143058cd98e58256f8b23bda54b52cbb6d291` geri dönüş noktası. Canlı `/health` 200; WebP 200/image-webp; mobilde hero yeni 1280px kaynağı seçiyor. CI 41877262241 hâlen sırada (son kontrol).
- Yeni mobil PageSpeed https://pagespeed.web.dev/analysis/https-aluplan-com-tr/i3syle82px?form_factor=mobile: performans 83, LCP 4,4 sn, FCP 1,1 sn; görsel tasarruf fırsatı 560→175 KiB, LCP render gecikmesi 1,92 sn. Sonraki ayrı rapor https://pagespeed.web.dev/analysis/https-aluplan-com-tr/71szmhrizc?form_factor=mobile performans 94, LCP 3,0 sn verdi; sonuçlar değişken. Mobil hero animasyonu yok; render gecikmesi sebebi henüz kanıtlanmadı. Küresel CSS yaklaşık 43,5 KiB gzip; CSS ayırma/mask katmanları kontrollü izleme ve regresyon testi gerektirir. 100 puan doğrulanmadı.
- `.worktrees/performance-release` içinde commitlenmemiş mobil WebP hero preload deneyi: build/typecheck geçti; Chromium mobilde bir istek, masaüstünde mobil kaynağa sıfır istek gösterdi. Lighthouse 13.6 localhost aynı mobil profilde dönüşümlü 3+3 üretim build ölçümünde LCP medyanı 3685→3684 ms, puan medyanı 90→90; anlamlı iyileşme görülmedi. Yerel test canlı ağ/CDN'i temsil etmez, Safari denenmedi. Kullanıcının koşulu gereği deney canlıya alınmadı.

## 04.11.2026 — Ana sayfa görsel performansı (yerel)
- Paylaşılan mobil Lighthouse raporu: performans 93, LCP 3,2 sn, FCP 1,1 sn, TBT 10 ms, CLS 0,026; gerçek kullanıcı verisi yok. Ana sayfa çözüm/iş akışı/BIMFlex kartları için responsive WebP varyantları; mobil hero için 1280×640 WebP yerelde eklendi. Bina 480w ~25 KiB (JPEG ~223 KiB), hero ~43 KiB (önce ~72 KiB). Kaynak görseller korundu; yüksek çözünürlüklü ekran varyantları mevcut.
- Mobil tarayıcı 355px'de hero kaynak seçimi, iş akışı sekmesi ve yatay taşmama kontrol edildi; bağımsız incelemede kritik/yüksek bulgu yok. `pnpm typecheck`, `pnpm test` (608 başarılı, 4 atlandı), üretim build başarılı; arama ek indeksi güncellendi. `da21430` tabanlı izole `.worktrees/performance-release` yayın kopyasında da typecheck, test ve build başarılı (603 testten 51'i kaynak/ortam yokluğunda atlandı). Henüz commit/yayın yapılmadı; yayın sonrası canlı PageSpeed yeniden ölçülmeli.

## 04.11.2026 — Mobil ana sayfa yayını ve görsel denetimi
- Kullanıcı onayıyla yalnız ProductTabs mobil görsel gizleme düzeltmesi `da2143058cd98e58256f8b23bda54b52cbb6d291` olarak main'e gönderilip Coolify production'a dağıtıldı. CI başarılı; canlı `/health` 200, mobil 390px tarayıcıda ilgili görsel `display:none`, sekmeler görünür. Önceki production SHA `3dc8e079954fb234cae2cafe2e8fee28bfed844d` geri dönüş noktasıdır. Diğer yerel değişiklikler yayınlanmadı.
- Önceki `curl: not found` mesajının yanlış pozitif olduğu iddiası kanıtlanmadı: Coolify belgelerine göre `wget` yedeği var. Canlı container içinde `/usr/bin/wget` mevcut, `/health` için 0 ve olmayan rota için 1 çıkışı doğrulandı. Oluşturulan tam Docker healthcheck komutu ve hata koşulunun uçtan uca testi ayrıca incelenebilir; dışarıdan `/health` 200.
- Kullanıcının telefonunda Max videoları Cloudflare bypass kuralıyla çalıştı. Kural etkin; origin trafik yükü izlenmeli.
- PageSpeed desktop raporu görsel dağıtımında tahmini 2331 KiB tasarruf gösteriyor. `building-web.jpg` ve `architecture-web.jpg` modern Accept ile dahi JPEG dönüyor; tüm görseller WebP/AVIF değil ve responsive srcset kullanımı eksik. Public envanteri aktif kullanım sayısı değildir. Görsel dönüşüm uygulanmadı.

## 04.11.2026 — ALLPLAN Max canlı video önbelleği denemesi
- Kullanıcı onayıyla Cloudflare'da yalnız `aluplan.com.tr/assets/previews/allplan-max/` altındaki `.mp4` dosyaları için `ALLPLAN Max video range test` cache bypass kuralı etkinleştirildi. Dört MP4 için `Range: bytes=0-1023` istekleri Cloudflare üzerinden 206 ve 1024 bayt döndürdü (önce 200/tam dosya); gerçek telefon/Safari oynatımı henüz doğrulanmadı. Kural geçici, origin trafik yükünü artırabilir; test başarısızsa Cloudflare Cache Rules ekranından devre dışı bırakılmalı. Uygulama dağıtımı yapılmadı.

## 04.11.2026 — Mobil menü, Bridge ve video incelemesi
- Ana sayfa ProductTabs arka plan görseli 767px altında gizlendi; mobil menü mevcut çözüm/ürün verilerinden açılır gruplar ve kaydırılabilir drawer ile düzenlendi. Bridge'in `/solutions/modeling-of-precast-girder-bridges` sayfası jeneratörde Türkçeleştirildi, sekiz adım ve yedi video korundu. Ortak metrik grid mobil/tablet/masaüstünde 1/2/4 sütun olarak kontrol edildi.
- Yerel tarayıcıda mobil menü, Bridge Türkçesi, metrik düzeni ve bir Bridge YouTube oynatıcısının açılması kontrol edildi; 607 test başarılı, 4 atlama; typecheck ve üretim build başarılı. Gerçek iPhone/Safari oynatma testi yapılmadı. Değişiklikler commitlenmedi ve canlıya dağıtılmadı.
- ALLPLAN Max üç özellik klibi için yerelde gerçek karelerden posterler, görünürlük yakınında yükleme ve mobilde oynatma kontrolleri eklendi; mobil Chromium'da üç video oynadı, gerçek cihaz/Safari doğrulanmadı. İlgili beş test ve typecheck başarılı; değişiklikler canlıya dağıtılmadı.
- Canlı MP4 Range isteği origin'de 206/1024 byte, Cloudflare üzerinden 200/tam dosya verdi; origin TLS yolunda gzip gözlendi. Safari oynatma sorununa olası neden; yalnız Max MP4 yollarını kapsayan Cloudflare cache bypass kuralı uygulanırsa 206 ve gerçek cihaz test edilmeli, başarısızsa geri alınmalı. Bypass origin trafiğini artırabilir; canlı ayar değiştirilmedi. Bridge kaynak sayfasının 5. adım başlığı kiriş yerleşimi, açıklaması tabliye geometrisi hakkındadır; kaynak tutarsızlığı korunmuştur.

## 04.11.2026 — Staging durduruldu
- Kullanıcı, Coolify'ın staging uygulamasının kalıcı olmayan verilerinin silineceği uyarısını açıkça onayladı; onay öncesinde Docker temizliği seçeneği kapatılmıştı. Staging Coolify'da `exited`, uygulama ve yapılandırması mevcut; `preview.aluplan.com.tr` durdurma sonrası HTTP 503. Production `running`, canlı ana sayfa ve `/health` HTTP 200. Staging gerektiğinde Coolify'daki Deploy ile yeniden başlatılabilir; önceden `0eee22e` sürümüne sabitli olduğu için test edilecek sürüm ayrıca kontrol edilmeli.

## 04.11.2026 — Analytics onayı ve canlı yayın
- Kullanıcı talebiyle `3dc8e079954fb234cae2cafe2e8fee28bfed844d` origin/main'e gönderildi ve Coolify production bu SHA'ya sabitlenerek yeniden dağıtıldı; Coolify durumu healthy, `/health` HTTP 200. Geri dönüş: production Git Source SHA `0eee22e5ce68eac8fb9bdaa4efde90b6de7b564f`, ardından yeniden dağıtım.
- Canlı tarayıcıda çerez reddinden sonra temiz yüklemede Google betiği/isteği yok; kabul sonrası G-DQYT0D9MQ5 için iki collect yanıtı 204; geri çekme ve SPA geçişinde, ayrıca diğer sekmenin geçişinde yeni collect gözlenmedi. Önceden gönderilmiş istekler geri alınamaz; depolama ve sekmeler arası iletişimin birlikte engellenmesi istisnası sürer.
- `pnpm test` 603 başarılı/4 atlama, typecheck, üretim bayraklı build, `pnpm audit --prod --audit-level high` ve veri üretimi başarılı. GitHub CI run 41863295089 yayın sırasında queued durumundaydı; sonucu yeniden kontrol edilmeli. Canlı HTTP denemelerinde bazı paralel istekler zaman aşımına uğradı; `/faq` tekrar denemede 200 döndü, durum izlenmeli. Cloudflare Web Analytics otomatik eklemesi kapalıdır ve site kimliği build'e eklenmedi.

## 04.11.2026 — Google Analytics ve Search Console
- Kullanıcı isteğiyle Google Analytics Aluplan mülkündeki web akışı (G-DQYT0D9MQ5), Search Console `aluplan.com.tr` alan adı mülküyle canlı panelde ilişkilendirildi; bağlantı listesi başarılı gösterdi. Analytics Search Console Sorgular raporu açıldı ve veri gösterdi. Bağlantı geri alınabilir: Analytics > Yönetici > Ürün bağlantıları > Search Console bağlantıları.
- Canlıda ret sonrası temiz sayfa yüklemesinde Google betiği/isteği gözlenmedi; kabul sonrası ölçüm isteği gönderildi. Geri çekme sırasında GA opt-out React effect'ini beklediğinden yerelde eşzamanlı durdurma ve sekmeler arası testler hazırlandı; kod canlıya dağıtılmadı. Yerel tarayıcıda kabul→geri çekme→ret→yeniden kabul ve SPA geçişinden sonra Google collect 204 gözlendi. Önceden kuyruğa alınan istekler geri alınamaz.

## 04.11.2026 — Cloudflare Analytics onay testi
- Yerelde manuel beacon entegrasyonu hazırlandı: `NEXT_PUBLIC_CLOUDFLARE_ANALYTICS_TOKEN` build sırasında verilirse yalnız geçerli kimlik, kayıtlı açık onay ve yazılabilir depolamayla yüklenir. Docker build ARG olarak tanımlandı; site kimliği repoya eklenmedi. CSP gerekli iki Cloudflare originine izin verir. Canlıya dağıtılmadı; Cloudflare otomatik enjeksiyonu kapalı kaldığından canlı Web Analytics şu anda ölçüm yapmıyor.
- Geri çekmede sonraki bağlantılar belge CSP'siyle engellenir ve tercih kaydedilebilirse sayfa yenilenir. Çok sekmeli onay ve depolama hatası için sessionStorage/BroadcastChannel ve kullanıcı uyarısı eklendi. Her iki depolama alanı ya da sekmeler arası iletişim kullanılamazsa geri çekmenin başka veya gelecekteki sekmelerde kalıcılığı garanti edilemez; zaten gönderilen istekler geri alınamaz. Bu koşullar çözülmeden canlıda güvenli ve eksiksiz kurulum iddia edilmemeli.
- İzole yerel Chromium testinde örnek kimlikle kabul öncesi/ret sonrası betik yok, kabul sonrası var, geri çekme sonrası yok; normal iki sekmede geri çekme ikinci sekmedeki betiği kaldırdı. Gerçek Cloudflare betiğiyle ayrı deneyde geri çekme sonrası RUM isteği CSP tarafından engellendi. Bu deney gerçek site kimliği ve üretim raporuna veri ulaşmasını doğrulamaz. İlgili 11 test ve typecheck başarılı.

## 04.11.2026 — SEO/performance, Cloudflare ve onay tercihleri
- Cloudflare'da `Canonical HTTPS apex` 308 kuralı etkinleştirildi; www ve HTTP varyantları yol/sorguyu koruyarak HTTPS apex'e yönleniyor, `/.well-known/` hariç. Üç varyant ve apex HTTP 200 doğrulandı. Geri alma: Redirect Rules içinde bu kuralı devre dışı bırak.
- Cloudflare bot ayarları kullanıcı tercihiyle zaten uyumlu: Training Disallow, Search ve Agents Allow, Bot Preference Sync açık. Yerel robots.ts GPTBot/ClaudeBot/Google-Extended engeli ile arama ajanlarını ayırır; canlıya dağıtılıncaya kadar origin Allow çelişkisi sürer. Google-Extended kapalıyken Gemini grounding kısıtı kullanıcı tarafından kabul edildi.
- Cloudflare Web Analytics otomatik enjeksiyonu kullanıcı isteğiyle manuel moda alındı. Kullanıcı güvenli kararı bize bıraktı: onay geri çekilince beacon'ın güvenilir durdurulması doğrulanmadan manuel script eklenmeyecek. Web Analytics geçici olarak veri toplamıyor; onay kontrollü Google Analytics ve Cloudflare edge trafik analitiği ayrıdır. Yönetim panelinde manuel moddan önceki seçenek `Enable, excluding visitor data in the EU` idi.
- Mobil 390×844, DPR1, 150 ms / 1.6 Mbps / 4× CPU, soğuk önbellek yerel laboratuvar ölçümleri: önce 2,59/3,32 sn, sonra 2,31/2,36 sn LCP; CrUX veya Lighthouse değildir. Hero ve ürün görselleri aynı çözünürlükte %30/%69 küçültüldü, aynı baytlı IBM Plex Sans fontlarının tekrar indirilmesi önlendi. Canlı/yerel sürümler farklı; değişiklikler henüz canlıya dağıtılmadı.
- Kullanıcı kararıyla kurumsal rakamlar bölümü ve Hakkımızda'daki ayrı 50+ ifadesi kaldırıldı; llms ve arama verileri güncellendi. Cloud Services bağlantısı geri gösterildi, KVKK meta açıklaması tamamlandı, ürün şemasındaki genelleştirilmiş Windows alanı kaldırıldı. Yerel değişiklikler henüz commitlenmedi.

## 04.11.2026 — SEO denetiminden yerel iyileştirmeler
- Arama, footer ve paket yönlendirmesi be023bf commitine alındı. Sonrasında kaynak metniyle doğrulanabilen eski metadata kesimleri tam kaynak paragrafına tamamlandı; meta, sosyal paylaşım ve JSON-LD açıklamaları eşleştirildi, ekranda görünen metinler değiştirilmedi.
- Köprü Tasarımı ve Civil sayfalarında kaynakta mevcut üç iç bağlantı görünür hale getirildi. Yerelde her iki hedef 200 döndü. Mobil hero LCP için animasyonu kaldırma veya düşük çözünürlük seçme uygulanmadı: mobilde animasyon yok, mevcut cover kırpması küçük görsellerde kalite kaybına yol açabilir; gerçek LCP izi ve alan verisi bekleniyor.
- Cloudflare yönlendirme, bot politikası ve CSP kararları, kurumsal sayıların kaynak doğrulaması ile görsel alt metinlerinin kapsamlı incelemesi yapılmadı. Yerel SEO iyileştirmeleri canlıya dağıtılmadı.

## 04.11.2026 — Footer, paket yönlendirmesi ve arama kapsamı
- Footer telif yılı 2027 yapıldı, geliştirici kredisi yeni sekmede hazarvolga.com.tr bağlantısıdır. /package-overview 301 ile /paket-karsilastirma adresine yönlenir ve site haritasından ve arama verisinden çıkarıldı. Yerelde HTTP ve üretilen HTML doğrulandı.
- Arama Türkçe/aksan duyarsız ve çok kelimeli eşleştirme kullanır. Site haritasındaki 112 sayfa, 2027 sayfaları, yapılandırılmış sekmeler ve SSS, oynatma listeleri ve özel içerik kaynakları indekslendi; 12 sonuç sınırı kaldırıldı. İndeks arama açılınca yüklenir; 2027 kapalıyken yayınlanmayan rotalar gösterilmez. Üretim/güncellik: `pnpm search:index` ve `pnpm search:check`.
- Video kaynaklarındaki YouTube kanal akışı başlıkları ayrı API ile alınır; akış erişilemezse eksik arama uyarısı ve tekrar deneme gösterilir. YouTube'a gömülü 2026 oynatma listesinin iframe içi başlıkları ve video/PDF dosyalarının içeriği bu kapsamda indekslenmez. Özel içerik kaynakları açık haritaya bağlıdır; yeni içerik bileşenleri eklenirken kapsama eklenmelidir.

## 04.11.2026 — SEO, GEO ve performans raporu değerlendirmesi
- Önceki çalışma bb173e9 commitine alındı; restore/pre-seo-geo-review-20261104 etiketi aynı noktayı gösterir. Kullanıcıya ait takip edilmeyen yerel dosyalar korunmuştur.
- Kullanıcının belirttiği denetim raporu değerlendirildi; canlı www adresi 200, HTTP adresleri 307 döndürüyor ve /package-overview hazırlık içeriğiyle erişilebilir. Cloudflare robots yönergeleri ve mobil LCP nedeni ayrıca doğrulanmalı; yerel ana sayfa giriş animasyonu 768 px altına uygulanmıyor.
- Rapor önerileri uygulanmadı. Sayfa yönlendirme kararı, bot politikası ve gerçek dağıtım üzerinde LCP izi öncelikli değerlendirme konuları; sayısal iddialar ve ürün üreticileri kaynaklarıyla doğrulanmalı.

## 04.11.2026 — Yaşam döngüsü içeriği tek sayfada
- Kullanıcı kararıyla /product-lifecycle ve ana sayfa bağlantısı korundu, SSS'deki yinelenen yaşam döngüsü sekmesi kaldırıldı. Karşılaştırmada altı sorunun anlamı ve iki hizmet tablosu ayrı sayfada mevcut; bu sayfa ayrıca bakım aşamalarını, ürün tarihlerini ve hizmetlerin daha ayrıntılı kapsamını içerir. SSS'de dört kategori ve 19 soru kalır.
- Kaynak ve üretilmiş veriler, SEO şeması ve parite kontrolleri güncellendi. 582 test (4 atlama), 102/102 kaynak paritesi ve 2027 build başarılı. Yeni yönlendirme eklenmedi; önceki yönlendirme önerisi kullanıcı tarafından değiştirilmiştir.

## 04.11.2026 — Footer menüsü ve logo
- Footer Ürünler ve Çözümler bağlantılarındaki oklar kaldırıldı; iletişim/sosyal ikonlar ve bağlantılar korundu. Footer logosu bulunduğu sütunun genişliğine uyacak şekilde büyütüldü, başlık logosu değişmedi.
- Yerel masaüstünde 6 ürün/5 çözüm bağlantısı oksuz, logo 257 px sütun genişliğinde; mobilde 309 px sütuna uyum ve taşmasız görünüm doğrulandı. Typecheck, 6 ilgili test ve styles:check başarılı. Değişiklikler commitlenmedi.

## 04.11.2026 — FeaturedSupportCards butonları
- FeaturedSupportCards butonları kartların iç genişliğine yayıldı, alt çizgiye bitiştirildi ve masaüstünde 36 px'e inceltildi; mobilde 44 px hedef korundu. Hover arka planı açık ve koyu temada belirginleştirildi; diğer kartlar etkilenmez.
- Kaynaklar sayfasındaki üç grupta buton genişliği ve sıfır alt padding, mobilde boyut ve taşma tarayıcıda doğrulandı. 20 kaynak testi, typecheck ve styles:check başarılı; hover kontrastı dört tema/modda incelendi. Değişiklikler commitlenmedi.

## 04.11.2026 — Seçilen nötr palet
- Kullanıcı dark.ase tabanlı nötr palet ile beyaz açık sayfa ve #F5F5F5 kart yüzeyini beğendi; deneme ana çalışma dalıyla birleştirilmek üzere hazırlanıyor. Koyu tema ve durum/rol renkleri ayrı rollerle çalışır. ASE dosyaları yerel kullanıcı girdisi olarak bırakıldı.
- Önceki site için restore/pre-adobe-palette-20261104, mavi-gri deneme için restore/adobe-palette-preview-20261104 etiketleri korunuyor. Sıradaki iş: kullanıcının bildireceği küçük düzenlemeler.

## 04.11.2026 — Açık tema gri kart yüzeyleri
- Açık tema sayfa zemini #FFFFFF korunurken ortak varsayılan/yükseltilmiş kart yüzeyi #F5F5F5 yapıldı; bu yüzeyleri kullanan diğer alanlar da etkilenir. Koyu tema değişmedi.
- Kaynaklar sayfasında beyaz zemin ve gri kartlar yerelde doğrulandı; 208 kontrast kontrolü ve 47 token testi başarılı. Deneme commitlenmedi.

## 04.11.2026 — dark.ase beyaz yüzey denemesi
- Kullanıcı isteğiyle #F2F2F2 olan açık tema sayfa ve accent zeminleri #FFFFFF olarak denendi. Açık sayfa ve kart zeminleri aynı beyaz; ayrım çizgi ve diğer tonlarla sağlanır. Önceki restore etiketleri korunur; değişiklik commitlenmedi.
- Ana sayfada açık tema tarayıcıda incelendi; 208 kontrast kontrolü ve 47 token testi başarılı. Kullanıcı görsel değerlendirmesi bekleniyor.

## 04.11.2026 — dark.ase palet denemesi
- Kullanıcı isteğiyle dark.ase (#A5A6A4, #F2F2F2, #D9D9D9, #262626, #0D0D0D) ve gerekli nötr ara tonlar mevcut deneme dalındaki Aluplan yüzey/vurgu rollerine uygulandı. Önceki Adobe palet denemesi restore/adobe-palette-preview-20261104 etiketli snapshot olarak korundu; özgün site geri dönüş etiketi de duruyor. İki ASE ve diğer kişisel yerel dosyalar korunuyor.
- /solutions üzerinde açık/koyu tema değerleri yerelde doğrulandı; 208 kontrast kontrolü, 47 token testi ve 51 ilgili test başarılı. Deneme commitlenmedi; kullanıcı görsel değerlendirmesi bekleniyor.

## 04.11.2026 — Adobe paleti yerel denemesi
- Palet öncesi değişiklikler e13d5eb commitine alındı; restore/pre-adobe-palette-20261104 etiketi o committe. Deneme codex/adobe-palette-preview-20261104 dalında, commitlenmemiş olarak çalışıyor. ASE dosyası ve kişisel yerel dosyalar korunuyor.
- ASE renkleri ve türetilmiş tonlar Aluplan vurgu, sayfa, kart, alt yüzey, header ve footer tokenlarına uygulandı. Açık ve koyu tema yerel Kaynaklar sayfasında incelendi; 208 kontrast kontrolü, 47 token testi ve 51 ilgili test başarılı. Rol/durum renkleri ve görsellere işlenmiş renkler bağımsızdır; kullanıcının görsel kararı bekleniyor.

## 04.11.2026 — Palet denemesi öncesi geri dönüş noktası
- Kullanıcı isteğiyle mevcut ortak bileşen ve tema değişiklikleri commitlenerek palet denemesi öncesi geri dönüş noktası hazırlanıyor. ASE dosyası ve kişisel yerel dosyalar çalışma ağacında korunur.

## 04.11.2026 — Adobe Color ASE palet testi
- Kök `AdobeColor My Color Theme.ase` geçerli: #586E8C, #21313F, #455D72, #728DA5, #D8D4D2. Dosya değiştirilmedi, palet siteye uygulanmadı.
- Mevcut vurgu rollerine birebir aday eşlemede dört kontrast kontrolü başarısız; türetilmiş #F0EEED ve #9CB1C3 ile örnek eşlemede 192 kontrol başarılı, açık renkli görsel üstündeki yarı saydam video rozeti kontrastı 6,00:1. Bu, örnek rol eşlemesidir; nihai tasarım/görsel kabulü yapılmadı.

## 04.11.2026 — Merkezi tema paleti güvencesi
- Tema paletinin kanonik kaynağı design-system/tokens/tokens.json olarak belgelendi; bağımsız video rozeti metni Aluplan teal / Field moss paletinin açık tonuna bağlandı. Varsayılan Aluplan rozeti aynı rengi korur; Field rozeti kendi paletine uyarlanır. Paket karşılaştırma gölgesi tema elevation tokenına taşındı.
- Bileşen ve app CSS modülleri ile statik JSX renkleri için dar istisnalı guard styles:check/build hattına eklendi; dinamik JS ve görsellere gömülü renkler kapsam dışıdır. Kart zemininde aksan kontrastı, palet mutasyonu ve yarı saydam medya rozeti kontrastı test edilir. Yeni palet uygulama adımları design-system/README.md'de.
- 578 test başarılı (4 atlama), 47 token testi, 192 kontrast kontrolü ve 2027 bayraklı build başarılı. Kaynaklar koyu temada yerelde doğrulandı; bağımsız inceleme bulguları giderildi. Değişiklikler commit edilmedi.

## 04.11.2026 — Kaynaklar ortak ara başlıkları
- Kaynaklar sayfasının üç bölüm başlığı ortak SectionHeader bileşenine taşındı; başlık hiyerarşisi, bölüm ID'leri ve aria-labelledby ilişkileri korundu, turuncu etiketler eklendi.
- Üç etiket ve başlık tarayıcıda doğrulandı; 27 ilgili test, typecheck ve styles:check başarılı. Teal paleti merkezi tokenlara bağlı, ancak farklı açık/koyu tonlar ve bağımsız medya rozeti/görsel renkleri tek değer değiştirilince otomatik güncellenmez. Değişiklik commit edilmedi.

## 04.11.2026 — SupportGridCards bağlantı rengi
- Normal SupportGridCards bağlantıları genel mavi yerine tema uyumlu vurgu rengini kullanır; hover'da ana metin rengi ve alt çizgi gösterilir. FeaturedSupportCards düğmeleri etkilenmez.
- Açık ve koyu temada tarayıcıdan renkler doğrulandı; kart zemininde kontrast sırasıyla 5,47:1 ve 6,75:1. 19 kaynak testi ve styles:check başarılı; kod incelemesinde somut regresyon bulunmadı. Değişiklik commit edilmedi.

## 04.11.2026 — Lisans kaynakları kart düzeni
- Yazılım ve lisans işlemleri aynı kart düzenine taşındı: Connect: Giriş ve Deklarasyon Formu FeaturedSupportCards, kalan üç kaynak SupportGridCards içinde. İçerikler ve bağlantılar korundu.
- Masaüstü ve mobil görünümde iki etiket ve 2/3 kart doğrulandı. 19 kaynak testi, typecheck ve styles:check başarılı; kod incelemesinde somut regresyon yok. Değişiklikler commit edilmedi.

## 04.11.2026 — Bilgi ve güncellemeler öne çıkan kartları
- ALLPLAN FAQ ve Sistem Gereksinimleri FeaturedSupportCards ile bölümün başına taşındı; kalan yedi kart SupportGridCards olarak sırasını koruyor. Metinler, ikonlar ve bağlantı hedefleri korunuyor.
- Masaüstü ve mobilde iki ayrı turuncu etiket ve kart grupları doğrulandı; 19 kaynak testi, typecheck ve styles:check başarılı. Kod incelemesinde somut regresyon bulunmadı. Değişiklikler commit edilmedi.

## 04.11.2026 — Destek kartlarının ayrılması
- Büyük Teknik Destek ve Destek Platformu kartları ayrı FeaturedSupportCards bileşenine çıkarıldı; iki gruptaki normal kartlar aynı SupportGridCards bileşenini kullanıyor. Her bileşenin kendi turuncu etiketi yalnız kendi kartlarını sarıyor. Temel ikon/bağlantı yardımcıları ve bazı CSS sınıfları paylaşılmaya devam ediyor.
- Masaüstü ve mobilde etiket sınırları ve 2/5/9 kart kontrol edildi; 19 kaynak testi, typecheck ve styles:check başarılı. İncelemede somut regresyon bulunmadı. Değişiklikler commit edilmedi.

## 04.11.2026 — Ortak SupportGridCards
- Kaynaklar sayfasının öne çıkan destek kartları ve normal kart grubu bağımsız SupportGridCards bileşenine taşındı; Öğren ve yardım al ile Bilgi ve güncellemeler aynı bileşeni ve turuncu etiketi kullanır. 2 öne çıkan, 5 normal ve 9 bilgi kartının içeriği, sıralaması, ikonları ve bağlantıları korundu.
- Tarayıcıda iki etiket, kartlar ve mobil taşma kontrol edildi. Gerçek verilerle 18 kaynak testi, typecheck ve styles:check başarılı; kod incelemesinde somut regresyon bulunmadı. Değişiklikler commit edilmedi.

## 04.11.2026 — Alt menü kompakt düzen
- Ürünler ve Çözümler alt menü bağlantılarındaki oklar masaüstü ve mobilde kaldırıldı. Satır yüksekliği hafif azaltıldı; masaüstü bağlantıların dikey boşluğu 6 px'den 4 px'e düşürüldü, mobil iç boşluk korundu.
- Masaüstünde iki menü ve mobil çekmecede okların kaldırıldığı tarayıcıda doğrulandı. 29 ilgili test ve styles:check başarılı; kod incelemesinde somut regresyon yok. Değişiklikler commit edilmedi.

## 04.11.2026 — Ana menü düzeni ve geçişi
- Ürünler menüsündeki Allplan Ortak Çözümleri bağlantısı, URL ve dış bağlantı niteliği korunarak İşbirliği Yazılımı sütununa taşındı; Ortak Çözümler sütunu kaldırıldı. Veri jeneratörü ve navigation.json birlikte güncellendi.
- Masaüstü Çözümler ve Ürünler panellerine 200 ms yumuşak görünme geçişi eklendi; hareket azaltma tercihi desteklenir. Yerel tarayıcıda iki panel ve yeni menü düzeni doğrulandı. 29 ilgili test, typecheck ve styles:check başarılı; bağımsız incelemelerde somut regresyon bulunmadı. Değişiklikler commit edilmedi.

## 04.11.2026 — SDS2 kategori ikonları
- SDS2 Ultimate Fonksiyonellik Hızlı Bakış alanındaki beş kategoriye AluIcon kütüphanesinden farklı ikonlar eklendi. BenefitIconCards kategori varyantı isteğe bağlı kütüphane ikonu destekler; içerikler ve diğer sayfaların mevcut ikonları korundu.
- SDS2 sayfasında beş ikon ve liste içerikleri tarayıcıda doğrulandı; 25 ilgili test, typecheck ve styles:check başarılı. Kod incelemesindeki eski kaynak-kalıbı testi güncellendi ve beş kategori eşlemesi için test eklendi. Değişiklikler commit edilmedi.

## 04.11.2026 — EditionCards liste tipografisi
- Ortak EditionCards liste metinleri 16 px'den 15,2 px'e, satır yüksekliği 25,6 px'den 22,8 px'e düşürüldü. Liste kullanan tüm varyantları etkiler; başlıklar ve açıklama paragrafları değişmez.
- FRILO'da hesaplanan ölçüler ve beş liste öğesi tarayıcıda doğrulandı; styles:check ve 16 ilgili test başarılı (1 atlama). Kod incelemesinde somut regresyon bulunmadı. Değişiklik commit edilmedi.

## 04.11.2026 — Ortak WorkFlowTabs ve sol hizalama
- WorkflowSection başlığı korundu; kategori sekmeleri ve altındaki etkileşimli içerik, turuncu etiketi olan ortak WorkFlowTabs bileşenine çıkarıldı. Kategori butonları bileşenin kullanıldığı tüm sayfalarda sola hizalanır; FAQ etkilenmez.
- AEC ve BIMPLUS sayfalarında etiket ve hizalama, AEC'de klavye ile sekme geçişi doğrulandı. 2027 bayraklarıyla build ve tam test paketi başarılı: 566 test, 4 atlama; bağımsız incelemede somut regresyon bulunmadı. Değişiklikler commit edilmedi.
- FRILO sürüm kartları zaten ortak EditionCards bileşeninin cards varyantını kullanır; FRILO Geotechnics de aynı varyantı kullanır. SCIA ve diğer sayfalar aynı bileşenin farklı varyantlarını kullanabilir.

## 04.11.2026 — Ortak fayda kart grubu
- `BenefitsSection` içindeki kart grubu bağımsız `BenefitIconCards` bileşenine çıkarıldı ve turuncu etiketi eklendi. Ultimate'taki 12 kartın içeriği ve ikonları, diğer sayfalardaki kullanım ve SDS2 liste varyantı korundu.
- Ultimate sayfasında 12 kart, 12 ikon ve etiket yerelde kontrol edildi. 2027 bayraklarıyla build ve tam test paketi başarılı: 563 test, 4 atlama; bağımsız incelemede somut regresyon yok. Değişiklikler önceki yerel çalışmalarla birlikte commit edilmedi.

## 04.11.2026 — WorkflowRibbon tipografi ve oklar
- Ortak `WorkflowRibbon` bağlantı metinleri 14 px/700'den 13,6 px/500'e düşürüldü. Renkli noktalar kaldırıldı; oklar sağ üste dönük `arrow-up-right` olarak değiştirildi. Tüm kullanan sayfalara yansır, bağlantı verileri korunur.
- Civil'de yerel görünüm ve mobil genişlikte taşma/bağlantı boyutları kontrol edildi; 28 ilgili test, typecheck ve styles:check başarılı. Değişiklikler önceki yerel çalışmalarla birlikte commit edilmedi.

## 04.11.2026 — WorkflowRibbon düz şerit
- Ortak WorkflowRibbon bölümünün üst/alt paddingi ve bağlantılar arasındaki boşluk kaldırıldı; bağlantılar düz, tek çizgilerle ayrılmış bitişik hücrelere dönüştürüldü. Hover yükselmesi/gölgesi kaldırıldı; klavye odağı ve iç dokunma alanları korundu.
- Yerel masaüstü ve mobil genişlikte boşluk, taşma ve hedef yükseklikleri kontrol edildi. İlgili 28 test, typecheck ve styles:check başarılı; bağımsız incelemede somut regresyon yok. Değişiklikler önceki yerel çalışmalarla birlikte commit edilmedi.

## 04.11.2026 — Ortak hızlı iş akışı şeridi
- Hızlı İş Akışı Bağlantıları alanı bağımsız `WorkflowRibbon` bileşenine çıkarıldı; turuncu etiket gerçek bileşen adını gösteriyor. Basic, Concept, Professional, Ultimate, Civil ve Precast sayfaları aynı bileşeni kullanır. Metinler, hedefler, renkler, sıralama ve dış bağlantı davranışı korundu.
- Civil sayfasında etiket ve bağlantılar yerelde doğrulandı. 2027 bayraklarıyla build ve tam test paketi başarılı: 559 test, 4 atlama; bağımsız incelemede somut regresyon yok. Değişiklikler önceki yerel çalışmalarla birlikte commit edilmedi.

## 04.11.2026 — Ortak paket giriş alanı
- Legacy giriş alanı `StructuredIntroSection` adlı ortak bileşene taşındı ve aynı adlı turuncu etiket eklendi. Basic, Concept, Professional, Ultimate ve Civil aynı kompakt liste stilini kullanıyor; dairesiz tikler ve yazı ayarı ortak bileşen stilinden geliyor. Diğer legacy giriş sayfalarının önceki liste stili korunuyor.
- Beş sayfada liste sayıları ve ortak stil yerelde kontrol edildi; paket içerik ve video verileri test edildi. 2027 bayraklarıyla build ve tam test paketi başarılı: 557 test, 4 atlama. Değişiklikler önceki yerel çalışmalarla birlikte commit edilmedi.

## 04.11.2026 — Civil giriş listesi
- `/products/civil` “ALLPLAN Civil Nedir?” listesindeki daireli tikler daha küçük, dairesiz simgelere dönüştürüldü; yazı 15,6 px'den yaklaşık 15,2 px'e düşürüldü. Stil yalnız bu listenin kapsamına alındı.
- Yerel masaüstü ve mobil genişlikte görünüm/taşma, typecheck ve styles:check doğrulandı; bağımsız inceleme somut regresyon bulmadı. Değişiklikler önceki yerel çalışmalarla birlikte commit edilmedi.

## 04.11.2026 — Video kartı sadeleştirme
- `FuncsGridCars` video kartlarında yalnız görselin ortasındaki oynat simgesi bırakıldı; üstteki video rozeti ve alttaki yinelenen düğme kaldırıldı. Görselin fare, Enter ve Space ile video açma davranışı ve erişilebilir adı korundu. Bu ortak bileşenin kullanıldığı tüm sayfalara yansır.
- Basic sayfasında görünüm ve klavyeyle video açma doğrulandı; 2027 bayraklarıyla build ve tam test paketi başarılı: 554 test, 4 atlama. Değişiklikler önceki yerel çalışmalarla birlikte commit edilmedi.

## 04.11.2026 — Kart grubu adı
- Kullanıcı isteğiyle `MediaGridCards` bileşeni ve turuncu etiketi `FuncsGridCars` olarak yeniden adlandırıldı. Basic sayfasında etiket doğrulandı; ilgili 24 test ve typecheck başarılı. Yerel değişiklikler commit edilmedi.

## 04.11.2026 — Ortak medya kart grubu
- `MediaGridSection` içindeki kart grubu ayrı `MediaGridCards` bileşenine çıkarıldı ve kendi turuncu etiketi eklendi. Böylece ALLPLAN Basic “Fonksiyonellik Hızlı Bakış” dahil bu bölümün kullanıldığı sayfalarda kart grubu ayrıca görülebilir.
- Basic'te altı kart, görsel büyütme ve video penceresi yerelde doğrulandı. 2027 bayraklarıyla build ve tam test paketi başarılı: 553 test, 4 atlama; parite ve token kontrolleri başarılı. Değişiklikler önceki yerel çalışmalarla birlikte commit edilmedi.

## 04.11.2026 — Endüstri ürün paketleri ortak kartları
- `/solutions/allplan-industry` “ALLPLAN ÜRÜN PAKETLERİ” alanı `ProductsOverview` kullanıyor. ALLPLAN Ultimate ilk sırada 1:1 büyük görselle sunuldu; diğer beş paketin göreli sırası, verileri, bağlantıları, görselleri ve CTA metinleri korundu. Görsel büyütme ayrı bir düğmeyle mevcut dialogu açar.
- Yerelde büyütme dialogu, mobil kare oranı ve taşma kontrol edildi. 2027 bayraklarıyla build ve tam test paketi başarılı: 551 test, 4 atlama; sonraki erişilebilir ad düzeltmesinde 16 ilgili test ve typecheck başarılı. Değişiklikler önceki yerel çalışmalarla birlikte commit edilmedi.

## 04.11.2026 — Bina Tasarımı ortak kartları
- `/solutions` sayfasında yalnız Bina Tasarımı grubundaki dört kart `ProductsOverview` ile gösteriliyor ve turuncu etiket taşıyor. Diğer dört grup mevcut bileşenini koruyor. Kart verileri ve hedefleri korunurken eylem yazısı ortak bileşendeki “İncele ↗” oldu; ortak bileşene dış bağlantılar için güvenli yeni sekme desteği eklendi.
- Yerel masaüstü ve mobil genişlik kontrolü, 2027 bayraklarıyla build, 26 ilgili test ve 51 parite kontrolü başarılı. Değişiklikler önceki yerel çalışmalarla birlikte commit edilmedi.

## 04.11.2026 — Scalypso modüllerinde ortak ürün kartları
- `ProductsOverview` veriyle yeniden kullanılabilir hale getirildi ve Scalypso Modülleri alanında uygulandı. Beş modülün sırası, adları, açıklamaları, görsel/alt metinleri, hedefleri ve bölüm açıklaması korundu; `ProductsOverview` debug etiketi eklendi. Modül görsellerinde Next.js optimizasyonu devam ediyor.
- Yerelde masaüstü ve mobil genişlik, beş hedef ve görsel doğrulandı. 2027 bayraklarıyla build ve `pnpm test` başarılı: 545 test, 4 atlama; parite ve token kontrolleri başarılı. Kullanıcının önceki `ProductsInnovations` ve kart metni değişiklikleriyle birlikte commit edilmedi.

## 04.11.2026 — Ürün kartı eylem metni
- `ProductsOverview` ürün kartlarından görünür “Detayları Görüntüle ↗” metni kaldırıldı. Görsel üzerindeki “İncele ↗” ve kart bağlantıları korundu; erişilebilir bağlantı adı `İncele: ürün adı` olarak sadeleştirildi.
- Yerel `/products` görünümü ve ALLPLAN AEC bağlantı hedefi kontrol edildi; ilgili 8 test ve typecheck başarılı. Bağımsız inceleme somut regresyon bulmadı. Değişiklikler önceki `ProductsInnovations` ayrımıyla birlikte commit edilmedi; kullanıcı bileşenin kullanılacağı diğer sayfaları bildirecek.

## 04.11.2026 — Ürün yenilikleri bileşeni
- Ürünler sayfasındaki “Ürün Ailesindeki Yenilikler” alanı `ProductsInnovations` bileşenine ayrıldı ve `ProductsOverview` ile kardeş olarak ayrı turuncu etiket aldı. İçerik, bağlantılar, sekme ve klavye davranışı korundu.
- Yerel `/products` sayfasında iki etiket, sekme tıklaması ve ok tuşuyla geçiş doğrulandı. 2027 bayraklarıyla build, 32 ilgili test ve 51 parite kontrolü başarılı; bağımsız inceleme somut regresyon bulmadı. Değişiklikler commit edilmedi.

## 04.11.2026 — Debug sistemi test düzeltmeleri
- Scalypso Modeler modül bağlantılarının erişilebilir adları modül adına göre ayrıştırıldı; görünür metin ve hedefler korundu. Eski hero, breadcrumb, bileşen sınırı ve başlık hiyerarşisi testleri mevcut davranışı doğrulayacak şekilde güncellendi.
- `ALUPLAN_SHOW_2027=1 ALUPLAN_BLOCK_INDEXING=1 pnpm build` başarılı. Ardından `pnpm test`: 542 test başarılı, 4 atlandı; kaynak sözleşmesi, 51 parite ve 45 token kontrolü başarılı. Yerel Modeler sayfasında dört bağlantının ayrı erişilebilir adı doğrulandı. Bağımsız incelemede kritik/yüksek bulgu yok.

## 04.11.2026 — Site geneli bileşen etiketleri
- `window.__debugOverlay()` kök yerleşimde her sayfada kullanılabilir; `true`/`false` ile açıkça ayarlanır. Durum localStorage ile saklanır ve aynı origin üzerindeki açık sekmeler arasında eşitlenir. Bileşen ağacı aç/kapat sırasında yeniden oluşturulmaz; etiketler erişilebilirlik ağacından gizlenir ve metinleri HTML gövdesine eklenmez.
- Ana sayfa, doğrudan ürün/kaynak sayfaları, yapılandırılmış içerik ve ortak `SectionHeader`, `GroupHeader`, `FeatureRow`, `FeatureRowList`, `EditionCards`, `MetricCards`, `ChallengesBand`, `CompactSpecList` etiketlendi. Özel bölümler `(özel)` olarak belirtilir. Her küçük UI öğesi için kapsam iddiası yok; sonraki sayfa incelemelerinde eksikler tamamlanabilir.
- Yerel ana sayfa, çözümler, iletişim ve FRILO örnekleri; sekmeler arası eşitleme, yenileme ve seçili ürün sekmesinin korunması kontrol edildi. Overlay açık bırakıldı. 2027 bayraklarıyla build, typecheck, 3 debug testi, 51 parite ve 45 token testi başarılı. Tam Python testinde 542 testten 11 başarısızlık, 4 atlama kaldı: eski hero/breadcrumb/sınır beklentileri, Scalypso başlık beklentisi ve Scalypso Modeler belirsiz bağlantı adı ayrıca incelenmeli. Değişiklikler commit edilmedi.

## 04.11.2026 — Eksik debug overlay etiketleri
- `SubpageView` içindeki `ContactMap` ve genel gömülü medya bloğu `DebugComponentLabel` ile etiketlendi. `pnpm typecheck` ve `git diff --check` başarılı; bağımsız incelemede kritik/yüksek bulgu yok.
- Yerel `/contact` sayfasında etiketin açılması, yenileme ve sayfa geçişi sonrası kalması ve kapatılması doğrulandı. Genel gömülü medya dalı mevcut sayfa verileri ve alternatif sayfa düzenleri nedeniyle örnek bir canlı sayfada görüntülenemedi; kod yolu etiketlendi. Overlay değişiminde mevcut bileşen davranışı nedeniyle gömüler yeniden oluşturulabilir.
- Değişiklikler commit edilmedi. Yerel debug overlay doğrulama sonunda kapatıldı.

## 04.11.2026 — Yerel geliştirme sunucusu
- Kullanıcı isteğiyle `pnpm dev` başlatıldı: `http://127.0.0.1:3000/`; ana sayfa HTTP 200 döndürdü. Sunucu bu oturumdaki süreç çalıştığı sürece erişilebilir.
- Mevcut dal `codex/coolify-staging-20261103`, HEAD `f08bb19` ve uzak daldan bir commit ileride. Aşağıdaki standardizasyon kaydındaki “commit yapılmadı” ifadesi bu nedenle güncel değil. `.claude/`, `.superpowers/` ve `premium-audit.json` takip edilmeyen dosyalar olarak korundu.

## 04.11.2026 — Site geneli tasarım standardizasyonu ve debug overlay
- Breadcrumb layout seviyesine taşındı: `PageBreadcrumb` bileşeni oluşturuldu, `SubpageView` içinde tüm sayfalar için render ediliyor. `CompactPageHero`'dan crumbs prop'u ve `SubpageHeroSection`'dan breadcrumb nav bloğu kaldırıldı. 11 dosyadan crumbs prop temizlendi.
- Debug overlay sistemi: `DebugComponentLabel` bileşeni `window.__debugOverlay()` ile açılıp kapanıyor, localStorage ile sayfalar arası kalıcı. SubpageView'daki tüm ana section'lar (hero, stats, video, search, contact, about, activation, solution catalog/hub, structured layout, CDS addon, AX3000, spec grid, feature rows, tabs, gallery, PageEndConversion, ProductsOverview) sarıldı. Scalypso ailesinde zaten mevcuttu.
- Scalypso "Hakkında" bölümündeki özel `aboutGrid` ortak `FeatureRow` bileşeniyle değiştirildi; `alu-container` içinde boxed. Tüm metin ve görsel verileri korundu.
- `EditionCards` grid variant'ı güncellendi: yapışık border-tablo yerine gap'li ayrık kartlar, sol accent border. Bu değişiklik `ProductEditionsBand` kullanan tüm sayfalara yansır.
- **Yarım kalan iş**: SubpageView'daki embedded media section'ları (`ContactMap`, genel embeds) henüz DebugComponentLabel ile sarılmadı. TypeScript temiz. Commit yapılmadı, kullanıcı commit talimatı verdi.
- Tüm değişiklikler `codex/coolify-staging-20261103` dalında, henüz commit edilmedi.

## 03.11.2026 — Main ve canlı sürüm hizalandı
- Kullanıcı onaylı yerel gelişmelerin canlıyla ve ana dal ile hizalanmasını istedi. Uzak `main`, canlıda zaten çalışan `0eee22e5ce68eac8fb9bdaa4efde90b6de7b564f` commitine fast-forward ile taşındı. GitHub CI başarılı: run 41697228603; 539 yerel test başarılı (4 atlama), veri üretiminde temiz worktree farkı yok. Canlı ana sayfa HTTP 200 ve Coolify çalışan sürüm aynı commit.
- Coolify production Git kaynağı `main` olarak kaydedildi; commit SHA aynı sürüme sabit kalıyor. Böylece daha sonraki kullanıcı onaylı değişiklikler `main`e alındığında canlıya çıkmaları için Coolify SHA güncellenip deployment yapılması gerekir. Bu ayar değişikliği için mevcut çalışan konteyner yeniden başlatılmadı; sonraki yayın sırasında uygulanacak. Korunan yerel HANDOFF ve diğer kullanıcı dosyaları bu commit kapsamına alınmadı.

## 03.11.2026 — GitHub dal durumu
- Kullanıcı GitHub ana sayfasında eski commit gördüğünü ve birleşmemiş dalları sordu. Uzak `main` `2589a9a`, canlıda kullanılan uzak `codex/coolify-staging-20261103` `0eee22e`; `main`e göre 6 commit ileride, 0 geride. Bu altı commit henüz `main`e birleşmedi; canlı Coolify belirli SHA'ya sabit ve `main` güncellense bile otomatik değişmez. Daha önceki dal/PR'ların içerik kapsamı ayrıca kontrol edilmeden tümü birleşmiş sayılmamalı.
- `main` üzerindeki CI başarısız: `Verify generated data is current` adımında durmuş, test/typecheck/build adımları çalışmamış (run 41626932235). Canlı yayın dalı için GitHub Actions CI çalışması listelenmedi; yalnız Vercel Preview Comments check-run başarılı bulundu. Yerel test ve Coolify build sonuçları önceki kayıtlardadır. Sabah `main`e entegrasyon öncesi CI, diğer dallar ve üretim deploy ayarları gözden geçirilmeli; kullanıcı uyumaya geçtiğinden bu turda merge/push yapılmadı.

## 03.11.2026 — PageSpeed ve hero: sabah devam
- Kullanıcının 03.11.2026 hız testi ekran görüntüsü: indirme 77,72 Mbps, yükleme 8,68 Mbps; boşta gecikme 15 ms, indirme yükü altında 128 ms, yükleme yükü altında 573 ms. Bu tek test bağlantının o andaki durumudur; Civil görselinin gecikmesini açıklamaya veya bağlantıyı dışlamaya yetmez. Sabah karşılaştırmalı ölçümde bu bağlamı dikkate al.
- Kullanıcı yorulduğunu belirterek performans/hero işini durdurup sabah devam etmek istedi; siteye veya koda düzeltme uygulanmadı. Canlı üretim commit `0eee22e5ce68eac8fb9bdaa4efde90b6de7b564f` olarak sabit; yeni değişikliklerin canlıya çıkması için ayrı commit/push ve Coolify SHA/deploy gerekir. Mevcut `HANDOFF.md`, `next-env.d.ts`, `.claude/`, `.superpowers/`, `premium-audit.json` kullanıcı/çalışma durumu korunmalı.
- Kullanıcının PageSpeed raporu `https://pagespeed.web.dev/analysis/https-aluplan-com-tr/5umqdkbk07`: mobil performans 74, FCP 1,1 sn, LCP 7,1 sn, TBT 0 ms, CLS 0, SI 4,4 sn; masaüstü performans 100, FCP 0,3 sn, LCP 0,8 sn, TBT 0 ms, CLS 0,005, SI 0,6 sn. Her ikisinde erişilebilirlik, en iyi uygulamalar ve SEO 100; gerçek kullanıcı verisi yok. Tek Lighthouse laboratuvar raporu; skor ve önerilen tasarruflar garanti değil.
- Mobil rapor görsel tesliminde tahmini 851 KiB: ilk ürün sekmesi `allplan-max-generated-v2.jpg` 373,5 KiB, altyapı 261,2 KiB, bina 222,5 KiB; hero WebP 103,3 KiB ve yüksek öncelikli. Hero LCP görseli; rapor 2.050 ms render delay gösteriyor, 7,1 sn toplam LCP ile alt parçalar doğrudan eşitlenmemeli. CSS render-blocking tahmini 450 ms; kullanılmayan JS 64 KiB, CSS 21 KiB tahmini. Masaüstü toplam yük 3.927 KiB, görsellerde tahmini 2.591 KiB tasarruf. Etkiler üst üste toplanmamalı.
- Kullanıcı SCIA hero geçişinin keskin ve Civil hero görselinin çok yavaş olduğunu tekrar bildirdi. Civil `civil-hero.jpg` 348 KiB, CSS pseudo-element background ile yükleniyor; sayfaya özgü zamanlama veya kullanıcı bağlantı kalitesi ölçülmedi. Canlı dosya Cloudflare HIT, max-age 604800 yanıtı verdi; bu tek gözlem, soğuk önbellek veya ağ sorunlarını dışlamaz. Firefox ekranında görseller kısmen yüklenmiş görüldü; kök neden henüz doğrulanmadı.
- Sabah: (1) canlı ve yerelde aynı sayfa/tema/viewport/ağ koşullarında tekrarlı soğuk-sıcak yükleme, waterfall ve Civil hero JPEG/keşif zamanını ölç; kullanıcı ağını varsayma. (2) ProductHero geçişini görselin kendi kenarında yumuşat; farklı hero aileleri, açık/koyu, Firefox/Chromium, geniş ekran ve mobil doğrula. `/2027/features` kompakt hero'da görsel tanımlı değil; uygun mevcut görsel veya tasarım seçimiyle ekleme değerlendir. (3) Ana sayfadaki büyük JPEG'leri responsive WebP/AVIF ve uygun boyutlarla değerlendir; hero önceliğini koru, LCP/CLS ve kaliteyi ölç. (4) CSS/JS ve önbellek kararlarını profille; sonraki testte önce/sonra birden çok koşuda kıyasla. Daha önce bulunan 320 px menü taşması ve Cloudflare AI politikası ayrı açık işlerdir.

## 03.11.2026 — Canlı hero geçişleri analizi
- Kullanıcı açık temada Max, Civil, FRILO ve SCIA hero görselinde keskin sınır; `/2027/features` hero görselinin yokluğunu bildirdi, diğer sayfaların da incelenmesini istedi. `ProductHero.module.css` görseli sağa `auto 100%` konumlarken maskeyi tüm hero genişliğine göre uygular; geniş ekranda görselin sol kenarı maskenin kısmen opak bölgesinde başlayabilir. Ortak ProductHero kullanan diğer sayfalarda da risk vardır.
- `/2027/features` `CompactPageHero` kullanıyor ve hero görseli tanımlı değil. Bu dosyalar mevcut çalışma ağacında canlı `0eee22e` commit ile aynı; Civil görselinin yerel/canlı SHA-256 özeti aynı ve yerel/canlı Civil hesaplanan maske/boyut stilleri eşleşti. Geçmiş yerel görünümün neden farklı algılandığı kesin doğrulanmadı. Görsel düzeltme ve yayın yapılmadı; farklı viewport, tema ve tarayıcılarda ortak çözüm doğrulanmalı.

## 03.11.2026 — Canlı SEO, mobil ve performans kontrolü
- Canlı `/`, `/products`, `/solutions`, `/kaynaklar`, lisans aktivasyon sayfalarında tek H1, canonical ve index/follow gözlendi; beş eski çözüm hub adresi yeni karşılıklarına 301 verdi. Sitemap 113 URL içeriyor. Bu kontrol arama sırası veya gerçek indekslenme kanıtı değildir.
- 375×812 emülasyonda ana sayfa, ürünler, çözümler ve ürün detayında örnek gezinti kontrol edildi. 320 px genişlikte ortak mobil menü sağa 11 px taşıyor; ana sayfa ve ürün detayında doğrulandı, henüz düzeltilmedi.
- Mobil sentetik ana sayfa (375×812, DPR 2, 4× CPU, 150 ms, 1,6 Mbit/sn, önbellek kapalı): iki yüklemede LCP 2,25/4,24 sn, CLS 0,00020/0; TTFB 0,183/3,390 sn. İki örnek gerçek kullanıcı verisi veya INP değildir; PageSpeed API 429 verdi.
- Cloudflare AI politikaları Search Allow, Agents Allow, Training Disallow, Bot Preference Sync açık. Cloudflare robots başına GPTBot/ClaudeBot dahil training engeli eklerken origin bu botlara Allow döndürüyor; gerçek erişim edge kuralına da bağlı. Panelde OAI-SearchBot ve Claude-SearchBot özel blok kapalı, GPTBot ve ClaudeBot bloklu görünüyor. Politika değişikliği yapılmadı; Google/OAI/Claude bot isteklerinde unsuccessful sayıları 7 günlük toplam olduğundan neden ve dönem ayrıca incelenmeli.

## 03.11.2026 — Aluplan 2027 canlıya alındı
- Kullanıcı onayıyla canlı alan adları ayrı `Aluplan 2027 Production` uygulamasına aktarıldı. Coolify running/healthy, commit `0eee22e5ce68eac8fb9bdaa4efde90b6de7b564f` sabit; sonraki güncellemeler bu SHA değiştirilip yeniden dağıtılmadıkça otomatik yansımaz. Önizleme ayrı ve parolalı kaldı.
- HTTPS apex/www, `/health`, `/sitemap.xml`, `/products`, lisans aktivasyon ve AX3000 video sayfası 200; eski bina tasarımı hub adresi 301; ana sayfa canonical `https://aluplan.com.tr/`, noindex görülmedi. Canlı ana sayfa tarayıcıda yeni tasarımla görüntülendi. Eski uygulama durduruldu, domain alanı boşaltıldı, temizlik yapılmadı; geri dönüşte yeni uygulama durdurulup eski uygulamanın iki domaini geri kaydedilmeli ve eski sürüm tekrar çalıştırılmalı. Geri dönüş provası yapılmadı.
- Geçişte domain çakışması ve konfigürasyonun henüz uygulanmaması nedeniyle geçici 503 oluştu; yeni alan adı ayarlarıyla redeploy sonrası HTTP 200 doğrulandı. Cloudflare yönetimli robots yanıtında GPTBot, ClaudeBot ve Google-Extended için Disallow var; uygulama robots ayarından farklıdır ve GEO tercihi ayrıca incelenmelidir. Form gönderimi, gerçek mobil performans ve geniş kapsamlı yayın sonrası testler henüz doğrulanmadı.
- Tasarım tutarlılığı adayları: kullanıcının işaret ettiği `/solutions-v2/connect-license/activation`; kaynaklar, Scalypso modül sayfaları, AX3000 mekanik tesisat, kaydedilmiş webinarlar ve eğitim merkezleri. Bunlar sonraki görsel/mobil inceleme konularıdır.

## 03.11.2026 — Üretim geçişi hazırlığı
- Kullanıcı mevcut önizlemeyi canlıya alma talimatı verdi; alt sayfaların görsel revizyonu sonraya bırakıldı. Ayrı `Aluplan 2027 Production` uygulaması (`eko8c80g0cso4w844swcko4k`) `0eee22e5ce68eac8fb9bdaa4efde90b6de7b564f` ile, `ALUPLAN_SHOW_2027=1` ve `ALUPLAN_BLOCK_INDEXING=0` build/runtime ayarlarıyla derlenip alan adı olmadan başlatıldı; Coolify health healthy. Yerel üretim imajında robots Allow ve örnek çözüm 301 doğrulandı.
- Canlı alan adı henüz eski 2026 uygulamasına bağlı. Durdurma penceresi, konteynerin kalıcı olmayan verilerinin silineceğini bildiriyor; temizleme kutusu kapalı ve kullanıcıya bu adım için onay soruldu. Onay gelmeden son Confirm yapılmadı. Eski canlı commit `a958c9d8e379e573ae8402ab2cfe13a60cf5fc28`. Yeni uygulamaya alan adı devri, canlı HTTPS/robots/canonical/yönlendirme ve geri dönüş kontrolü henüz yapılmadı.

## 03.11.2026 — Coolify korumalı önizleme
- Ayrı `Aluplan 2027 Staging` uygulaması `codex/coolify-staging-20261103` dalının `0eee22e5ce68eac8fb9bdaa4efde90b6de7b564f` commitinden dağıtıldı; Coolify durumu running/healthy. Sağlık kontrolü `http://127.0.0.1:3000/health`; `localhost` konteynerde IPv6 nedeniyle başarısız oldu. İlk kısa SHA ile dağıtım da başarısızdı, tam SHA düzeltmesiyle tamamlandı.
- `preview.aluplan.com.tr` DNS A kaydı sunucuya yöneliyor. HTTPS sertifika doğrulaması başarılı, kimliksiz istek 401 Basic yanıtı ve HTTP isteği HTTPS yönlendirmesi alıyor. Kullanıcının tarayıcıdan giriş yapması sonrası içerik, noindex ve yönlendirmelerin staging üzerinde kontrolü bekliyor. Kimlik bilgilerini kaydetme.
- `aluplan.com.tr` kontrol sırasında HTTP 200 verdi; canlı uygulama ve Microsoft e-posta DNS kayıtları değiştirilmedi. Üretim geçişi ayrıca planlanacak; eski Plesk DNS envanteri kullanıcı isteğiyle ertelendi.

## 03.11.2026 — Yerel teslim durumu
- Ana sayfa, ürün/çözüm kartları, hero alt çizgisi ve görsel performans değişiklikleri bu kayıtla birlikte `codex/design-phase-4` üzerinde yerel commit kapsamına alındı. Push, merge veya yayın yapılmadı. Önceki kayıtların “commit edilmedi” ifadeleri tarihsel durumdur; güncel durumu bu bölüm belirtir.
- Commit öncesi `pnpm test`: 505 test başarılı, 4 atlama; 46/46 parite ve token/stil kontrolleri geçti. `pnpm typecheck` başarılı. Son ürün CTA düzeltmesi yedi kartta tarayıcıda ve bağımsız incelemede doğrulandı. Gerçek mobil cihaz/saha performansı, WebP desteklemeyen tarayıcıda fallback ve yayın/medya izinleri hâlâ açık.
- Sonraki önerilen adım: beş çözüm hub sayfasında içerik ve hedef paritesini inceleyip yeniden tasarım önerisiyle birlikte olası adresler ve 301 haritasını kullanıcı onayına sunmak; onay gelmeden URL değiştirme.

## 03.11.2026 — Çözüm hub sayfaları ve yerel commit hazırlığı
- Kullanıcı mevcut çalışmanın commit edilmesini ve ana sayfadaki beş çözüm kartının hedeflerinin yeni tasarımla değerlendirilmesini istedi. Kartlar `/solutions-v2/building-design`, `/infrastructure`, `/construction`, `/addons`, `/other` hub'larına gider; ortak `SolutionHubSection` ve `SolutionDirectoryCard` kullanırlar. Hero ve sayfa sonu zaten ortaktır. Tasarım ve rota değişikliği henüz uygulanmadı.
- Dikkat: genel `/solutions-v2/addons` ile mevcut `/solutions/addons` aynı kapsam değildir; ikincisi CDS eklentileri sayfasıdır. Hub ve `/solutions` kataloğu arasında BIMPLUS ve AX3000 hedefleri dahil farklılıklar vardır; içerik/bağlantı haritası çıkarılmadan birleştirilmemeli. Türkçe URL örnekleri yalnız öneri; değişiklik için eksiksiz 301 haritası ve kullanıcı onayı gerekli. Next.js mevcut permanent redirects 308 verdiğinden 301 uygulama yöntemi ayrıca doğrulanmalı.
- Commit öncesi ürün kartlarında kaynak “Detayları Görüntüle” etiketinin görünmediği tespit edildi; görünür metin ve erişilebilir bağlantı adına geri eklendi. Yedi kart tarayıcıda kontrol edildi. `next-env.d.ts`, `.claude/`, `.superpowers/` ve `premium-audit.json` yerel/üretilmiş durum olarak teslim kapsamı dışında korunur. Commit yalnız yereldir; push veya yayın isteği verilmedi.

## 03.11.2026 — Hero çizgisi inceltme
- Ortak hero alt çizgisi kullanıcı isteğiyle 2 px'den 1 px'e indirildi. Kaynaklar sayfasında yerel tarayıcıda görsel ve hesaplanan kalınlık kontrol edildi; styles:check geçti. Değişiklik yerel, commit edilmedi.

## 03.11.2026 — Hero alt çizgisi
- Kullanıcı isteğiyle üstteki kısa `PageEntrance` ve ana sayfa içindeki yinelenen kısa çizgi kaldırıldı. Ortak `HeroBottomLine` ana sayfa, ortak alt sayfa, ürün, kompakt ve Scalypso hero ailelerinin alt kenarında soldan sağa tam genişlikte 1 sn'de çizilir ve kalır. Mobilde/reduced-motion'da animasyonsuz statik çizgi görünür; içerik ve linkler etkilenmez.
- Yerel üretim derlemesi başarılı, `pages.json` içindeki 102 rotadan 101'inde bir çizgi, hero'suz `/references` üzerinde sıfır çizgi doğrulandı. Masaüstü ana sayfa, Yol ve Demiryolu, FRILO, Kaynaklar, Scalypso Modeler; 355px mobil ve 773px reduced-motion kontrol edildi. 504 test (4 atlama), 46 parite, typecheck ve styles:check geçti; bağımsız incelemede kritik/yüksek bulgu yok. Gerçek cihaz/açık tema görsel kabulü bekliyor; commit edilmedi.

## 03.11.2026 — Eklentiler sayfası: sonraki iş
- Kullanıcı `/solutions-v2/addons` sayfasının animasyon çalışmaları bittikten sonra yeniden tasarlanmasını ve önerilen `/eklentiler` adresinin değerlendirilmesini istedi. Önce `/solutions/addons`, mevcut `/solutions-v2/addons` ve olası `/eklentiler`/`/addon` rotaları içerik, hedef ve kapsam bakımından karşılaştırılacak; URL değişikliği için 301 haritası hazırlanıp kullanıcı onayına sunulacak.
- Ekranda işaretlenen sayfa sonu alanı ortak bileşen olarak kullanılmalı: mevcut `PageEndConversion` ve politikasının gerçekten hangi rotalarda kullanıldığı bu sonraki işte doğrulanacak. Şimdilik sayfa/URL değişikliği yapılmadı.

## 03.11.2026 — Tüm sayfalarda dekoratif giriş
- Kullanıcının onayladığı hafif giriş `PageEntrance` ile ortak `SiteShell` içine eklendi: çizgi 600 ms, kare 180 ms sonra 300 ms; ana sayfa mevcut çizgisi 180 ms gecikir. İçerik/CTA beklemez; 768 px altında ve reduced-motion'da gizli; rota değişiminde yalnız işaret yenilenir, hash'te aynı kalır. Yeni bağımlılık veya genel sayfa geçişi yok.
- Üretim build ve 102 doğrudan sayfanın server HTML işareti kontrol edildi; Eklentiler/Kaynaklar masaüstü, Kaynaklar 355 px mobil, reduced-motion, JS kapalı ve rota/hash davranışı kontrol edildi. Bağımsız incelemenin main konumlandırma riski, sıfır yükseklikli dekorasyonla giderildi. Tüm rotalar ayrı ayrı görsel incelenmedi.
- Mobil ağ benzetiminde Eklentiler LCP 3.108/3.116→3.144/3.132 ms, CLS her ölçümde 0,000286, script +157 bayt. Ölçümden sonra işaret konumu görünürlük için 2 px ayarlandı ve görsel kontrol edildi; bu son CSS düzeltmesi yeniden ölçülmedi. İkişer ölçüm gerçek saha/INP değildir; ayrıntı `docs/verification/motion-pilot-performance-2026-11-03.md`. 504 test geçti (4 atlama); kullanıcının görsel kabulü bekleniyor, commit edilmedi.

## 03.11.2026 — SCIA yükleme ve tüm sayfalarda hareket isteği
- Kullanıcı görsel yükleme sırası/zamanlaması ve ardından bütün sayfalarda hafif giriş hareketi istedi. `/products/scia` alt bölümlerindeki yetenek ve proje görselleri lazy yapıldı, mevcut boyutları korundu. Üçer yerel mobil benzetim ölçümünde medyan LCP 6.076→4.764 ms, CLS 0; normal ağda akordeon ve galeri görselleri kontrol edildi. 501 test (4 atlama), parite ve tip/stil kontrolleri geçti. Yavaş ağda hızlı galeri seçimi ve gerçek cihaz doğrulaması açık; bağımsız incelemede kritik/yüksek sorun yok. Yerel, commit edilmedi.
- `/solutions-v2/addons` kartlarında otomatik giriş animasyonu bulunmadığı, ortak hero'nun optimize/öncelikli olduğu görüldü. Tüm sayfa giriş hareketi için `docs/superpowers/specs/2026-11-03-premium-motion-design.md` içine yeni taslak eklendi; kullanıcının tasarım onayı bekleniyor, site geneline hareket uygulanmadı. Mobilde kapatma tercihi korunmalı.

## 03.11.2026 — Ana sayfa hero yükleme iyileştirmesi
- Yavaş mobil ağ izinde hero ile yarışan üç alt bölüm görselinin erken preload edildiği görüldü. `ProductTabs`, `DisciplineWorkflowSection` ve FlexSoft logosu lazy yapıldı; logoya 512×512 doğal ölçü eklendi. Aynı hero JPEG'den tam çözünürlüklü 105.794 bayt WebP üretildi (JPEG 268.054 bayt fallback olarak kaldı); lisans kaydı güncellendi.
- Ayrı üretim derlemeleri, 355 CSS px / 4× CPU / 150 ms / 1,6 Mbit/sn ve üçer dönüşümlü yükleme ile: medyan LCP 7.844→3.040 ms; CLS her ölçümde 0,000016. Gerçek cihaz/saha ve INP değil; JPEG fallback WebP desteklemeyen gerçek tarayıcıda ayrıca denenmedi. Mobil/masaüstü hero, normal ağda Civil/rol sekme görselleri doğrulandı; yavaş bağlantıda sekme ve uzun gezinme CLS kontrolü açık. Ayrıntı `docs/verification/motion-pilot-performance-2026-11-03.md`.
- Tam test geçti: 500 Python testi (4 atlama), parite 46/46, stil/token; typecheck ve üretim derlemeleri başarılı. Bağımsız incelemede logo alanı ve test kapsamı bulguları düzeltildi. Değişiklikler yerel ve commit edilmedi; kullanıcı görsel kabulü bekliyor.

## 03.11.2026 — Mobil hareket ve yavaş ağ ölçümü
- Kullanıcı önerisiyle yeni hero ve öne çıkan ürün kartı giriş animasyonları 768 CSS px altında kapatıldı, tablet/masaüstü ve azaltılmış hareket koşulu korundu. Önceden mevcut sekme/smooth-scroll hareketleri bu kapsam dışında. 27 ilgili test, typecheck ve styles:check geçti; bağımsız incelemede kritik/yüksek bulgu yok. Mobil 355 px hero ve kart `animation:none`, tablet 773 px hero animasyonu etkin doğrulandı.
- İki yerel üretim derlemesi, 4× CPU, 150 ms gecikme, yaklaşık 1,6 Mbit/sn, 355 px ve önbellek kapalı olarak ikişer kez ölçüldü: ana sayfa LCP öncesi 7,10/7,86 sn, sonrası 7,11/7,11 sn; `/products` öncesi 2,58/2,63 sn, sonrası 2,55/2,61 sn. CLS düşük; INP ve gerçek cihaz ölçülmedi. Ayrıntılar `docs/verification/motion-pilot-performance-2026-11-03.md` içinde. Ana sayfa hero görseli LCP adayı; neden ve iyileştirme ayrıca araştırılmalı. Genel sayfa geçişi eklenmedi.

## 03.11.2026 — Hareket pilotu performans karşılaştırması
- Pilotlu ve pilotsuz ayrı yerel üretim derlemeleri 355 CSS px, önbellek kapalı ve üçer yüklemeyle karşılaştırıldı. Ana sayfa medyan LCP 100→108 ms, ürünler 92→96 ms; script aktarımı yaklaşık +376/377 bayt. CLS ölçümleri çok düşük ve benzer aralıkta. Ham değerler ve sınırlar `docs/verification/motion-pilot-performance-2026-11-03.md` içinde.
- Bunlar localhost laboratuvarı; gerçek mobil cihaz, yavaş ağ, saha LCP/CLS ve INP doğrulaması değildir. Kart animasyonu kaydırma sırasında ayrıca performans ölçümüne girmedi. Genel sayfa geçişi eklenmedi; kaynaklar ara başlıkları sonraki iş olarak bekliyor.

## 03.11.2026 — Sayfa geçişi ve kaynak ara başlıkları
- Kullanıcı sayfa geçişi kararını performans gözetilerek Codex'e bıraktı. Karar: mevcut hero/kart pilotunun üretim koşullarında performansı ölçülene kadar genel sayfa geçişi eklenmez; sonrasında yalnız kısa View Transition denemesi, azaltılmış hareket ve tarayıcı geri dönüşüyle değerlendirilebilir. Kurulu Next.js rehberi App Router desteğini belgeliyor; henüz ölçüm veya uygulama yok.
- Kullanıcı `/kaynaklar` sayfasındaki “Öğren ve yardım al” ve diğer ara başlıkların daha önce kullanılan ortak başlık örnekleriyle daha sonra düzeltilmesini istedi. İlgili bileşen `src/components/sections/ResourcesDirectory.tsx`; bu isteğe şimdi dokunulmadı.

## 03.11.2026 — Premium hareket pilotu
- Onaylı pilot yerelde uygulandı: ana sayfa hero dekoratif görseli ve çizgisi ile `/products` ilk büyük kartı animasyonlu; kart ilk görünümde bir kez çalışır. Yeni bağımlılık eklenmedi. Kullanıcının mevcut düzenlemeleriyle aynı çalışma dalında, commit edilmeden duruyor.
- Bağımsız inceleme tercih değişince kart animasyonunun tekrarlanması sorununu buldu; hareket bitiminde/azaltılmış hareket durumunda animasyon sınıfı kaldırılarak düzeltildi. Mobil 355 CSS pikselde koyu tema, yatay taşma, ilk/tekrar görünüm, azaltılmış hareket ve tercih değişimi; `/products` JS kapalı içerik kontrol edildi. Açık tema, gerçek cihaz ve tüm mobil kırpmalar henüz ayrıca görsel doğrulanmadı.
- Typecheck, styles:check ve tam `pnpm test` geçti: 498 Python testi (4 atlama), 46 parite, token kontrolleri. Kaynak testi runtime davranışını tek başına kanıtlamaz. Önce/sonra güvenilir LCP, CLS, INP ve JS aktarımı ölçülemedi; hero hareketinin LCP etkisi belirsiz. Kullanıcı görsel kabulü ve performans karşılaştırması bekleniyor.
- Kullanıcı sayfa geçişlerini sordu; yerel Next.js rehberi View Transitions yaklaşımını belgeliyor. Bu özellik pilot kapsamında uygulanmadı; ayrı tasarım/değerlendirme gerekir.

## 03.11.2026 — Hareket tasarımı onayı ve pilot planı
- Kullanıcı premium hareket dili tasarımını onayladı. İlk pilot planı `docs/superpowers/plans/2026-11-03-premium-motion-pilot.md`: ana sayfa hero ve `/products` ilk büyük kart, yeni bağımlılık olmadan; tüm siteye yayılım ve Lenis ayrı karar. Pilot planı ve yürütme yöntemi kullanıcı incelemesini bekliyor; uygulama yapılmadı.

## 03.11.2026 — Kart hareketi kararı
- Kullanıcının yorucu olmayan hareket talebi üzerine tasarım taslağına pilotta yalnız öne çıkan kartın görselinin ziyaret başına bir kez hareket etmesi, diğer kartların girişte sabit kalması işlendi. Tasarım onayı bekleniyor; uygulama yapılmadı.

## 03.11.2026 — Premium hareket dili taslağı
- Kullanıcı geçici karşılaştırmada C · Etkileyici seçeneğini seçti. Tasarım ve önceki çoklu inceleme kararları `docs/superpowers/specs/2026-11-03-premium-motion-design.md` içinde; uygulama veya bağımlılık onayı değil. Bağımsız belge kontrolünde kart görselinin sayfada görünürken de hareket edip etmeyeceği açık soru olarak belirlendi. Tasarım onayı ve sonraki planlama bekleniyor; belge commit edilmedi.

## 03.11.2026 — Hareket dili geçici önizlemesi
- Kullanıcının onayıyla ana sayfa ve kart için A sakin / B dengeli / C etkileyici hareket seçeneklerini karşılaştıran bağımsız geçici önizleme `.superpowers/brainstorm/62752-1793709852/content/motion-options.html` içinde hazırlandı. Ürün koduna uygulanmadı; CSS ile fikir deneniyor, GSAP/Lenis/React Bits kurulmadı. Kullanıcının görsel değerlendirmesi bekleniyor.

## 03.11.2026 — Ürünler ve çözümler mobil kontrolü
- Kullanıcı büyük görsellerin yüksekliğini uygun buldu. Yerel tarayıcıda 355 CSS piksel genişliğinde `/products` ve `/solutions` kontrol edildi: yatay taşma ve kontrol anında kırık görsel yok; kartlar tek sütuna geçiyor. Ürün kartları ile Mimari ve Altyapı grupları görsel incelendi; diğer büyük çözüm kartlarında 5:2 oranı doğrulandı. Diğer kartların tamamı tek tek görsel incelenmedi. Kod değişmedi.

## 03.11.2026 — Büyük kart görseli daha yatay
- Ortak büyük kart görsel oranı kullanıcı isteğiyle 2:1'den 5:2'ye değiştirildi; aynı genişlikte yükseklik %20 daha az. `/solutions` beş büyük kart ve `/products` ilk büyük kart oranı tarayıcıda doğrulandı. 16 ilgili test ve styles:check geçti; görsel kabul bekliyor, commit edilmedi.

## 03.11.2026 — Büyük kart görsel yüksekliği
- Kullanıcı isteğiyle `/solutions` ve `/products` ortak büyük kart görselleri 16:10'dan 2:1'e indirildi; görsel `cover` ile kırpılıyor. Tarayıcıda beş çözüm kartı ve ilk ürün kartı oranı doğrulandı, Mimari kartın masaüstü görünümü kontrol edildi. 16 ilgili test ve styles:check geçti; commit edilmedi, diğer kırpmaların görsel kabulü bekleniyor.

## 03.11.2026 — Büyük kart metin hizası
- `/products` ve `/solutions` ortak büyük kart stilinde metin görselin üstüne hizalandı. Yerel tarayıcıda beş çözüm grubunda görsel ve metin başlangıçları arasındaki fark 0 px ölçüldü. 16 ilgili test ve styles:check geçti; değişiklik commit edilmedi.

## 03.11.2026 — Çözüm grubu başlık aralıkları
- `/solutions` üzerindeki beş ara başlık ortak `SectionHeader` kullanmayı sürdürüyor. Tanımsız boşluk token'ı kaldırıldı; her grup öncesine `--space-stack-xl` üst boşluğu eklendi. Tarayıcıda masaüstünde beş grubun 40 px boşluğu doğrulandı.
- 12 çözüm dizini testi, typecheck ve styles:check geçti; kod incelemesinde kritik/yüksek bulgu yok. Mobil görsel kontrol ve kullanıcı kabulü bekliyor; commit edilmedi.

## 03.11.2026 — Çözümler sayfasında ürün düzeni
- Kullanıcı isteğiyle `/solutions` katalog grupları `/products` ile aynı CSS düzenine taşındı: her grubun ilk öğesi geniş, diğerleri iki sütunlu; tüm kart bağlantılı. Mevcut 22 öğenin metinleri, görselleri ve hedefleri korunur; harici bağlantının yeni sekme davranışı sürer.
- 11 çözüm dizini testi, typecheck ve styles:check geçti. Yerel tarayıcıda masaüstü koyu tema ve bağlantılar kontrol edildi; mobil ve ekran okuyucu deneyimi ayrıca doğrulanmadı. İncelemede görünür CTA metni korunacak şekilde düzeltildi. Değişiklik commit edilmedi; kullanıcının görsel değerlendirmesi bekleniyor.

## 03.11.2026 — Ürün başlığı kare ölçüsü
- Ana sayfa ürün başlığındaki kare 1cap ile başlığın büyük harf yüksekliğine bağlandı; desteklenmeyen tarayıcılar için em fallback var. Typecheck ve styles:check geçti, incelemede kritik/yüksek bulgu yok. Optik hizalamanın tarayıcıda kullanıcı tarafından kontrolü bekliyor; commit edilmedi.

## 03.11.2026 — Ana sayfaya özel ürün başlığı
- Ürün ara başlığı bağımsız HomepageProductHeading bileşenine ayrıldı: solda dekoratif kare, sağda 2027; diğer GroupHeader kullanımları korunuyor. İlgili 16 testten biri build eksikliğiyle atlandı, kalanları, typecheck ve styles:check geçti; incelemede kritik/yüksek bulgu yok. Görsel kabul bekliyor; commit edilmedi.

## 03.11.2026 — Ana sayfa ürün ara başlığı: FRILO grup dili
- Ürün sekmeleri üstündeki başlık ortak GroupHeader ile FRILO'daki numara/çizgi/sayı düzenine taşındı; h2 semantiği ve veri kaynağından ürün sayısı kullanılır. Diğer GroupHeader kullanımında h3 varsayılanı korunur.
- İlgili 16 testten biri build eksikliği nedeniyle atlandı, diğerleri; typecheck ve styles:check geçti. İncelemede kritik/yüksek bulgu yok. Tarayıcı otomasyonu kapalı; görsel kabul bekliyor. Commit edilmedi.

## 03.11.2026 — Ürün sekmeleri ara başlığı
- Ürün sekmeleri öncesindeki ara başlık ortak SectionHeader tipografisiyle “ÜRÜN EKOSİSTEMİ / Her iş akışı için doğru araç” olarak güncellendi. Sekiz ilgili test, typecheck ve styles:check geçti; incelemede kritik/yüksek bulgu yok. Yerel tarayıcı otomasyonu kapalı, görsel kabul bekliyor. Commit edilmedi.

## 03.11.2026 — Ana sayfa hero ve bölüm bağlantıları
- Taslaktaki genel hero metni uygulandı. Çözümleri keşfedin `#solutions` bölümüne, Ürünleri keşfedin `#products` rol/paket alanına gider; hareket tercihine göre yumuşak/anlık kaydırma ve header boşluğu eklendi. Teklif hedefi korunur.
- Ürün sekmelerinin önüne bölüm başlığı eklendi; 2026 yenilikleri bandı ana sayfadan kaldırıldı, sayfalar korunuyor. Önceki 2027 hero metni veri kaynağında duruyor. Önceki alt sayfa maskesi test beklentisi güncellendi.
- Sekiz hedefli test, typecheck, styles:check geçti; CTA eklenmeden önce tam test 488 testte 4 atlama ile geçti. Tarayıcı otomasyonu Work ayarında kapalı olduğundan kaydırma ve header boşluğunun görsel kontrolü bekliyor. Değişiklikler commit edilmedi.

## 03.11.2026 — Ana sayfa yerleşim taslağı ve restore point
- Önceki uygulama değişiklikleri `d4ecd12` commit'iyle kaydedildi; yerel `restore/homepage-before-solutions-layout-20261103` etiketi bu commit'i işaret eder. Push yapılmadı. `next-env.d.ts` ve `.claude/` yerel durumları korunuyor.
- Çözüm alanları öncelikli ayrı statik yerleşim taslağı `docs/previews/homepage-solutions-wireframe/` içinde; uygulama ana sayfası bu taslakla değiştirilmedi. Önizleme 127.0.0.1:8771 üzerinde sunuldu. Taslaktaki yeni metinler/gruplamalar öneridir, içerik ve URL eşlemesi ile kullanıcı kabulü gerektirir.
- Typecheck, styles:check ve beş ana sayfa testi geçti; mevcut hero kırpılması ve mobil görünümün görsel kabulü açık. Tarayıcı otomasyonu Work ayarında kapalıdır.

## 03.11.2026 — Ana sayfa hero üst boşluğu
- Yalnız ana sayfa `.alu-max-preview-hero` üst padding değeri `--space-stack-md` kadar azaltıldı (masaüstünde 16 px); alt padding ve diğer hero’lar korunuyor. styles:check geçti, incelemede kritik/yüksek bulgu yok. Tarayıcı erişimi Work ayarında kapalı olduğundan görsel kontrol bekliyor; commit edilmedi.

## 03.11.2026 — Ürün sekmeleri sabit yükseklik
- Sekme panelleri aynı grid alanında ölçülüyor; en uzun içerik ortak yüksekliği belirlediğinden sekme değişiminde alan yüksekliği değişmez. Pasif paneller gizli ve etkileşim dışıdır; içerik sabit piksel sınırıyla kesilmez.
- Typecheck ve beş ilgili test geçti; kod incelemesinde kritik/yüksek bulgu yok. Tarayıcı erişimi Work ayarında kapalı olduğundan farklı ekran ve zoom seviyelerinde görsel doğrulama bekliyor. Commit edilmedi.

## 03.11.2026 — Ürün sekmesi görsel geçişleri
- Ürün sekmesi görselleri eşit yükseklikte, sağa hizalı ve gerektiğinde kırpılarak gösteriliyor; masaüstünde sola, mobilde aşağı yumuşak geçiş uygulanıyor. Sekme metinlerinin okunması için ızgarada opak tema yüzeyi var.
- Beş ilgili test, typecheck ve styles:check geçti. Yerel tarayıcı Work ayarında kapalı olduğundan açık/koyu ve mobil görsel kontrolü bekliyor; değişiklikler commit edilmedi.

## 03.11.2026 — SCIA görseli ve ürün sekmesi yerleşimi
- SCIA sekmesi için yapısal analiz konsepti üretildi ve uygulandı; optimize JPEG `public/assets/previews/home-2027/scia-analysis-concept.jpg`, kaynak PNG ve kullanım kaydı projede. Bu görsel gerçek SCIA analiz çıktısı değildir.
- Ürün görselleri masaüstünde sağa hizalı ve contain ile, metin ayrı alanda; mobilde görsel ayrı satırda gösterilir. Mobilde görsel sekmelerin üzerinde yer alır, kullanıcı görsel değerlendirmesi gerekir.
- İlgili beş test, typecheck ve styles:check geçti; incelemede kritik/yüksek bulgu yok. Yerel tarayıcı Work ayarı nedeniyle otomasyonla görsel kontrol yapılamadı. Değişiklikler commit edilmedi.

## 03.11.2026 — Ürün sekmeleri bölüm arka planı
- Seçili ürünün görseli tüm Ürünleri keşfedin bölümü arka planına taşındı ve sekme değişiminde güncelleniyor; yinelenen panel görseli kaldırıldı. Tema yüzeyi, seçili sekme vurgusu ve reduced-motion korundu.
- Typecheck, dört ilgili test ve styles:check geçti; incelemede kritik/yüksek bulgu yok. Tarayıcı Work ayarında kapalı olduğundan açık/koyu ve mobil görsel kabulü bekliyor. Değişiklikler commit edilmedi.

## 03.11.2026 — ALLPLAN Max hero konsepti ve genel hero geçişleri
- Kullanıcının seçtiği yapay zekâ konsepti ana sayfa hero görseline uygulandı; JPEG türevi `public/assets/previews/home-2027/allplan-max-ai-concept.jpg`, kaynak PNG ve kullanım kaydı saklandı. Konsept gerçek ürün çıktısı değildir.
- Alt sayfa hero görsellerinin maskesi gerçek görsel kenarına taşındı; ProductHero'da sert sınır için `cover` kullanıldı. Stil/token kontrolü ve typecheck geçti; incelemede kritik/yüksek bulgu yok.
- Yerel tarayıcı Work ayarında kapalı olduğu için açık/koyu ve mobil görsel kontrol yapılamadı. Özellikle ProductHero `cover` geniş ekranlarda görseli kırpabilir; kullanıcı kontrolü gerekli. Değişiklikler commit edilmedi.

## 03.11.2026 — Ana sayfa hero geçişi
- Ana sayfa hero görselindeki sert sol kenar giderilmek üzere maske görselin gerçek sınırına bağlandı; mobil dikey maske korundu. Stil/token kontrolü geçti, kod incelemesinde kritik/yüksek bulgu yok.
- Bu ortamda yerel tarayıcı kullanımı Work ayarlarıyla kapalı olduğundan açık/koyu tema ve mobil görsel kabulü kullanıcı kontrolünü bekliyor. Değişiklik henüz commit edilmedi.

## 03.11.2026 — Header sadeleştirme ve teslim
- Header arama ve açık/koyu tema düğmelerinde yalnız ikon gösteriliyor; ekran okuyucu adları korunuyor. Masaüstü yerel görünümü ve typecheck doğrulandı; bağımsız incelemede kritik/yüksek bulgu yok.
- Kullanıcı tüm geliştirmelerin main ile birleştirilip gönderilmesini istedi. Çalışma dalı `codex/design-phase-4`; yerel `next-env.d.ts` ve `.claude/` teslim kapsamı dışında korunur. Önizleme/yayın koşulları ve üretici görsel izinleri için önceki kayıtlar geçerlidir.

## 03.11.2026 — FRILO ana menüye eklendi
- FRILO, Ürünler > Bina ve Altyapı grubuna `/products/frilo` hedefiyle eklendi. Masaüstü ve mobil menü ortak navigasyon verisini kullanır; sayfa kapalıysa bağlantı da yayın koşuluyla gizlenir.
- Menü üreticisi ve `src/data/navigation.json` güncellendi. Üç hedefli test ve typecheck geçti; masaüstünde bağlantı ve hedef tarayıcıda doğrulandı. Kod incelemesi orta veya yüksek öncelikli sorun bulmadı.
- Yerel geliştirme sunucusu 127.0.0.1:3001 üzerinde açık; diğer kullanıcı revizeleri bekleniyor.

## 03.11.2026 — FRILO sürüm kartı görselleri tamamlandı
- FRILO ve FRILO Geotechnics kartlarına üretici mağazasından on görsel eklendi; 1200 px JPEG türevleri `public/assets/previews/frilo/editions/` altında. Kaynak ve kullanıcı kararı `docs/brand/assets-license-log.md` dosyasına işlendi; üreticinin ayrıca verdiği kullanım izni henüz doğrulanmış değil.
- `EditionCards` görselleri 16:9 gösterir; ürün arayüzünü korumak için kırpma aşağı odaklanır. Geotechnics kartlarına yeni mağaza bağlantıları eklenmedi; bu karar açık.
- Bayraklı build, typecheck, 484 Python testi (4 gerekçeli atlama) ve 46/46 parite geçti. Tarayıcıda on görselin yüklenmesi ve oranı, açık/koyu tema incelendi. Kod incelemesinde kritik/yüksek bulgu yok; görseller toplam yaklaşık 3,7 MB, sonraki optimizasyon adayı.
- Yerel sunucu `http://127.0.0.1:3001/products/frilo` adresinde açıldı. Kullanıcının diğer revizeleri bekleniyor; ardından Faz 4 PR'ı planlanıyor. `next-env.d.ts` ve `.claude/` yerel değişiklikleri korunuyor.

## 03.11.2026 — Önceki devir: FRILO mağaza hero görselleri planı (yukarıda tamamlandı)
- **Durum:** Dalda 15+ commit var; son commit `90bb398` (FRILO sürüm yenilikleri ve mağaza bağlantıları). Push yok, PR yok. Kullanıcı "Önce revizelerim" dedi; revizeler sürüyor. `next-env.d.ts` build değişikliği, commit edilmez.
- **Kullanıcı onayı (03.11.2026):** "FRILO sürümleri" (5) ve "FRILO Geotechnics sürümleri" (5) kartlarına allplan.com mağaza sayfalarındaki hero görselleri alınacak ("Evet, al" + "Bu kartlarda da görsel kullanabilsek iyi olur").
- **Bulunanlar (doğrulandı):** On mağaza sayfası 200 dönüyor: `https://www.allplan.com/en-US/shop/products/frilo/<slug>`; slug'lar `frilo-concept`, `frilo-professional-concrete`, `frilo-professional-steel`, `frilo-professional-timber`, `frilo-ultimate`, `frilo-geotechnics-concept`, `frilo-geotechnics-professional-pit`, `frilo-geotechnics-professional-retaining`, `frilo-geotechnics-ultimate`, `frilo-geotechnics-soil-mechanics`. Hero dosyaları (1200×1200 JPEG): `header_frilo-concept`, `header_frilo-prof-concrete`, `header_frilo-prof-steel`, `header_frilo-prof-timber`, `header_frilo-ultimate`, `header_frilo-geotechnics-concept`, `header_frilo-geotechnics-prof-pit`, `header_frilo-geotechnics-prof-retaining`, `header_frilo-geotechnics-ultimate`, `header_frilo-geotechnics-soil-mechanics` (+ `-1200x1200.jpg`). İndirme adresi: `https://typo3-parser-dev.vercel.app/api/images/fileadmin/user_upload/shared-files/shop/header/frilo/<dosya>` (200, ~250 KB); `www.allplan.com/fileadmin/...` 403 döner.
- **Kalan adımlar:** (1) 10 görseli ayrı boş bir klasöre indir, `sips` ile 1200 px JPEG q75 türev üret → `public/assets/previews/frilo/editions/<slug>.jpg`; kare görsel, kartta 16:9 `object-fit:cover` ile kırpılacaksa görsel kontrol et. (2) `EditionCards` `Edition` tipine `image?: { src: string; alt: string }` ekle, `cards` varyantında kartın üstünde göster. (3) `src/app/products/frilo/page.tsx` iki banda görselleri ver (Geotechnics kartlarına da aynı kalıpla mağaza bağlantısı eklemek kullanıcıya sorulmalı/önerilmeli). (4) Test-önce: türevler var/≤450 KB, sayfa her kartta görsel kullanıyor, render testi. (5) `docs/brand/assets-license-log.md`'ye `FRILO-shop-<slug>` satırları (kaynak: allplan.com mağaza sayfası URL'si, üretici görseli, kullanıcı kararı 03.11.2026 soru 5). (6) `ALUPLAN_SHOW_2027=1 ALUPLAN_BLOCK_INDEXING=1 pnpm build`, tüm testler (`python3 -m unittest discover -s tests -p "test_*.py"`, şu an 480 test, 4 gerekçeli atlama), parite, tarayıcıda koyu mod kontrolü, commit.
- **Sonrası:** kullanıcının diğer revizeleri; ardından Faz 4 PR'ı (`codex/design-phase-4` → `main`).

## 03.11.2026 — Rebar ve Parametric bekletildi; FRILO sürüm kartları (dal `codex/design-phase-4`, commitlendi)
- **Karar:** Allplan Rebar ve Allplan Parametric allplan.com'da yayınlanana kadar yayınlanmaz. Menüden kaldırıldı (`scripts/generate_site_data.py` → `navigation.json`), sitemap ve `llms.txt` dışında (`PUBLISHED_RELEASE_2027_ROUTES`), canlıda 404 (`heldUntilManufacturerRelease: true` + `isLocalPreviewEnabled()`); yerel `pnpm dev`'de açık. Sayfa, veri ve testler korunuyor; içerik render testleri bekletme süresince gerekçeyle atlanıyor. Yayına alma adımları: `docs/00-inventory/user-decisions.md` (03.11.2026 — Allplan Rebar ve Allplan Parametric bekletilir).
- **FRILO:** "FRILO sürümleri" ve "FRILO Geotechnics sürümleri" bantları yeni `EditionCards` `cards` varyantında (2 sütun, aralıklı, sol kalın vurgu çizgisi).
- **FRILO görselleri:** Geotechnics 2027 yenilik kartları (Concept, Professional Pit, Professional Retaining, Ultimate × 3) artık üreticinin `Screenshots/Images-for-web/frilo-geo-*-feature-N` görselleriyle, sayfadaki "2027 yenilikleri" kart düzeninde (`updateCard`). Görsel N → metin N eşlemesi görsel içerikle doğrulandı (1 AI Structural Analyst, 2 EN 1992:2023 / EN 1997-1:2024, 3 sondajdan zemin katmanı). Türevler `public/assets/previews/frilo/2027/` (1200 px JPEG q75, `sips`), eşleme `src/lib/frilo-geo-images.ts`, kayıt `docs/brand/assets-license-log.md`. Kullanılmayan aday görseller: ana FRILO sürümlerinin (Concept, Professional Concrete/Steel/Timber, Ultimate) yenilik görselleri (15 adet) ve `Whats New 2027/` klasörleri; bu sürümlerin yenilik metinleri sayfada yok.
- **FRILO sürüm yenilikleri:** "2027 yenilikleri" bölümünün altına beş ana sürümün (Concept, Professional Concrete/Steel/Timber, Ultimate) yenilikleri numaralı grup etiketleri ve görselli kartlarla eklendi. Metin `src/data/frilo-editions-2027.ts` (envanter taslaklarıyla birebir, `tests/test_frilo_edition_news.py`), görseller `Images-for-web/frilo-<sürüm>-feature-N` → `public/assets/previews/frilo/2027/<sürüm>-feature-N.jpg`. Professional Steel kaynak dosyaları yanlış numaralı (`feture-1` bağlantı, `feature-1` AI, `feture-3` Eurocode); içerikten eşlendi.
- **FRILO sürüm kartı bağlantıları:** beş "FRILO sürümleri" kartında allplan.com en-US mağaza sürüm sayfasına "Sürümü inceleyin ↗" bağlantısı; yeni sekmede (`target="_blank" rel="noopener noreferrer"`), ekran okuyucu etiketi sürüm adı ve "yeni sekmede açılır" içerir.
- **Sürüm kartı görselleri analizi:** kitte sürüme özel görsel yok (web belgesindeki sürüm giriş bölümlerinde görsel alanı yok; Sales Enablement/Messaging/sunumlarda kutu veya banner görseli yok). allplan.com mağaza sayfalarında her sürümün hero görseli var; kullanıcı onayıyla oradan alınabilir.
- **Doğrulama:** 480 test (4 gerekçeli atlama), 46/46 parite, bayraklı build; build'de sitemap ve ana sayfa menüsünde iki rota yok, sayfaları 404.

## 03.11.2026 — Tasarım standardizasyonu, Faz 4 (dal `codex/design-phase-4`, commitlendi, onay bekliyor)
- **Kart varyantları:** `EditionCards` artık `grid | steps | icons` alıyor. Rebar ve Parametric sayfalarında "Genel bakış" bandı `steps`: 2×2, kartlar arası boşluk, solda kalın vurgu çizgisi, sağ üst köşede 01–04 numarası (dekoratif, `aria-hidden`), etiket ayrı satırda. "Avantajlar" bandı `icons`: aynı kart dili (2×2, boşluklu, sol kalın vurgu çizgisi), `AluIcon` sağ üst köşede, zeminsiz ve çerçevesiz (büyük boy). İkonlar `src/lib/product-icons.ts` içinde, metinler değişmedi. `AluIcon`'a `zap` eklendi. Yeni bağımlılık yok.
- **FeatureRow:** alt sayfa vitrin satırları (`alu-feature-row`), FRILO yetenekleri ve Max ana özellikleri tek `FeatureRow`/`FeatureRowList` bileşeninde (kart token'ları, dönüşümlü yön, numara rozeti). Eski kurallar silindi. `alu-wf-detail` etkileşimli sekme detayı olduğu için ayrı kaldı.
- **SectionHeader:** Hakkımızda (3), Max (3: anket, özellikler, AI araçları), iletişim haritası, Yenilikler, Hizmetler, Oynatma listesi, Disiplin iş akışı, çözüm kataloğu grupları, SDS2 ve alt sayfa video/galeri/sekme başlıkları ortak başlığa taşındı. Hakkımızda h2'leri 48 px'ten, Max h2'leri 56 px'ten 32 px'e indi. Kart içi başlıklar, bölünmüş intro'lar ve ana sayfa bilerek dokunulmadı.
- **CSS budama:** `application.css` içindeki 21 sınıfın kuralları silindi (hiçbir bileşen, veri veya script'te geçmiyor: partner strip, page hero, role selector, video grid/badge, pathway feature card vb.; dinamik `preview-bimflex__figure--N` korundu). Max modülündeki ölü hero/quote/testimonial/sütun kuralları silindi; `.section h3` yalnız AI araç kartlarına daraltıldı. Toplam yaklaşık 435 satır silindi.
- **Grup etiketleri (`GroupHeader`):** bir bölüm başlığı altındaki alt gruplar artık bölüm ölçüsünde h2 değil, numaralı küçük h3 etiketi (numara, başlık, ince çizgi, öğe sayısı, isteğe bağlı açıklama). Rebar/Parametric özellik grupları ("Detaylandır", "Dokümante Et"…), Bimplus'un beş video ızgarası (tek üst başlık: "Bimplus uygulama videoları", `src/lib/grid-groups.ts`) ve FRILO Geotechnics 2027 yenilikleri (tek üst başlık: "FRILO Geotechnics 2027 yenilikleri") bu yapıda. İki üst başlık kullanıcı onayıyla eklenen tek yeni metin; grup başlıkları ve açıklamaları kaynaktaki gibi kısaltılmadan duruyor. Analizde diğer çoklu ızgaralı sayfalar (Basic/Concept/Professional/Ultimate, Civil, PythonParts, BIMFlex, yasal metinler, AX3000, Scalypso) bağımsız bölüm olduğu için bilerek dokunulmadı; ALLPLAN 2026 (iki grup) isteğe bağlı aday.
- **Doğrulama:** 460 test (bayraklı build ile render testleri dahil), 46/46 parite, token kontrolü, typecheck, `ALUPLAN_SHOW_2027=1 ALUPLAN_BLOCK_INDEXING=1 pnpm build`. Koyu modda Rebar, FRILO, Oska, Max ve Hakkımızda sayfalarına bakıldı. Açık mod ve mobil tek tek bakılmadı.
- **Not:** render testleri 2027 bayrakları olmadan alınan build'de düşer; build'i bayraklarla alın.
- **Sıradaki:** kullanıcı onayı, ardından PR. Açık adaylar: diğer ürün sayfalarının (Basic/Concept/Professional/Ultimate, Civil) benzer bantları; etkileşimli parçalar için Radix (henüz eklenmedi).

## 03.11.2026 — PR #3, #4, #5 main'e birleştirildi ve production'a çıktı
- Sıra: #3 (db37a1e) → #4 (0db2648) → #5 (5e810e5); her biri merge commit ile, dallar silinmedi.
- Vercel env: `ALUPLAN_SHOW_2027=1`, `ALUPLAN_BLOCK_INDEXING=1` (Production + Preview); eski `ALUPLAN_2027_PREVIEW` kaldırıldı.
- https://aluplan-2027.vercel.app doğrulandı: `/`, `/paket-karsilastirma`, `/product-lifecycle`, `/products/allplan-rebar`, `/2027/*` 200; `/preview/product-lifecycle` ve eski karşılaştırma PDF'leri 308; `x-robots-tag: noindex, nofollow`, meta robots noindex, robots.txt `Disallow: /`.
- Sıradaki: kullanıcının küçük revizeleri; Faz 4 (feature row bileşeni, SectionHeader, CSS budama) + önerilen ikonlu `FeatureCard`/bölüm varyantları/Radix primitives (onay bekliyor); yeni sayfa Türkçe metin kaynak kontrolü.

## 03.11.2026 — Mobil header sıkıştırması (commitlendi, onay bekliyor)

- **Sorun (tarama gözlemi):** 375 px'te üst çubuk 113 px + header 149 px; sayfa h1'i y=381'de (ekranın ~%47'si) başlıyordu.
- **Yapılan:** 40 rem ve altında üst çubuk gizlendi; sosyal ikonlar, e-posta ve "Hızlı Talep Oluştur" mobil menü çekmecesinin altına taşındı (`alu-mobile-drawer__contact`). Header tek satır, arama/tema/menü düğmeleri yalnız ikon (44×44, `aria-label`'lı). Tablet ve masaüstü değişmedi.
- **Ölçüm (375×812, /products/allplan-basic, dev):** üst çubuk 0, header 73 px, h1 y=192, yatay taşma yok. Çekmece açıldı: 5 sosyal bağlantı, e-posta ve teklif formu bağlantısı görünür ve doğru hedefli.
- **Testler:** `tests/test_mobile_header.py` (5 test); `test_tab_accessibility_contract.py` sosyal bağlantı sayısı 3 (çekmece kopyası dahil). 437 test, 46/46 parite, 45/45 token, typecheck, build.
- **Sınırlar:** açık mod mobil ve gerçek cihazda bakılmadı; çekmece içeriği yalnız koyu modda gözle kontrol edildi.

## 03.11.2026 — Tüm sayfaların gözden geçirilmesi (tarama + düzeltmeler; commitlendi, onay bekliyor)

- **Yöntem:** her sayfada çalışan bir ölçüm betiği (tarayıcıda `main` içindeki metinler için WCAG kontrastı, yatay taşma, h1 sayısı, ortalı h2, kırık görsel, eksik alt, yinelenen id, 12 px altı metin, `href="#"`). **Masaüstünde 116 sayfanın tamamı, koyu ve açık modda** (232 ölçüm); **mobilde (375 px, koyu mod) 40 sayfa** (tüm şablon ailelerinin temsilcileri + tüm bileşen türleri) tarandı; 4 temsilî sayfa mobilde, 6 sayfa açık/koyu masaüstünde gözle bakıldı.
- **Temiz çıkanlar (116 sayfa):** yatay taşma yok (masaüstü ve mobil), her sayfada tek h1, ortalı bölüm başlığı yok, kırık görsel yok, eksik `alt` yok, `href="#"` yok. Mobilde taranan 40 sayfada taşma yok.
- **Bulunup düzeltilenler:**
  1. **Video rozeti ("VİDEO"), açık modda kontrast 3.52:1 (≈35 sayfa):** rozet her iki temada koyu zemin üzerinde, ama metin `--accent-fg` (açık temada koyu teal) idi. Yeni sabit token `--visual-media-badge-text` (`#2DD4BF`) eklendi (4 tema-mod bloğu + primitif).
  2. **Referanslar etkin sekmesi koyu modda 1.86:1** (parlak teal üstünde beyaz metin): `--action-primary-bg`/`--action-primary-fg` çiftine alındı (kontrast testli çift; hover ve sayı rozeti dahil).
  3. **Ana sayfa rol rozeti ("MİMAR İŞ AKIŞI") açık modda 2.49:1:** rozet metni rol renginin %45'i + `--text-primary` karışımı oldu.
  4. **Allplan Max sayfasında iç içe iki `<main>` ve yinelenen `id="main-content"`:** Max bileşeninin kök `<main>`'i `<div>` yapıldı.
  5. **12 px altı metin (70'ten fazla sayfa; Referanslar'da 235 öğe):** `applicationMicroLabel` 0.72→0.75 rem, `applicationMicroCompact` 0.68→0.75 rem, `applicationMicro` 0.7→0.75 rem (hepsi 12 px).
- **Ölçüm hatası düzeltmesi (dürüstlük):** betik `color-mix` sonucunu (`color(srgb 0–1)`) başta 0–255 sanıyordu; bu, ana sayfa rozetinde yanlış bir koyu mod alarmı üretti ve açık mod için yanlış "geçti" verebilirdi. Ayrıştırıcı düzeltildi; `color-mix` kullanan tüm bileşenlerin sayfaları (ana sayfa, ürün/çözüm sayfaları) yeniden taranıp temiz çıktı.
- **Testler:** `tests/test_review_findings.py` (rozet token'ı, referans sekmesi çifti, rol rozeti karışımı, mikro boyutlar ≥ 12 px, Max'te `<main>` yok, derlenmiş her sayfada tam bir `<main>`; yerel `preview/` ve `archive/` hariç). 432 test, 46/46 parite, 45/45 token, typecheck, build.
- **Ölçülmeyenler / sınırlar:** betik görsel veya gradyan zemin üzerindeki metni atlıyor (hero ve kart görselleri üstündeki metin kontrastı ölçülmedi); hover, odak ve etkinleştirilmiş durumlar, klavye gezinmesi, formlar (iletişim, lisans etkinleştirme), video açılır penceresi, çerez bandı ve arama sonuçları etkileşimi test edilmedi; mobilde 76 sayfa taranmadı (şablon aileleri kapsandığı için örnekleme; açık mod mobilde taranmadı); gerçek cihaz ve Lighthouse/CrUX ölçümü yok; dev sunucusunda ölçüldü.
- **Gözlem (düzeltilmedi, karar gerekir):** mobilde sayfa içeriği ekranın yaklaşık %35'inden başlıyor (üst çubuk: sosyal ikonlar, e-posta, "Hızlı Talep Oluştur", logo, arama, tema, menü). Kabuk (header) mobilde ilk ekranı büyük ölçüde dolduruyor.
- **Karar bekleyen:** mobil header yoğunluğu; kalan Faz 3/4 işleri (özellik satırları, kalan başlık kopyaları, global CSS budama).

## 03.11.2026 — Tasarım standardizasyonu, Faz 3: kart sistemi (commitlendi, onay bekliyor)

- **Bulgu:** tasarım sisteminde zaten kanonik bir kart var (`design-system/components/surfaces/surfaces.css` `.alu-card` + `--card-bg/-border/-radius/-shadow/-shadow-hover/-padding` token'ları); uygulama kartları bunu kullanmıyor, her biri kendi değerlerini taşıyordu. Ölçüm (faz öncesi): kart başlığı 15.7 / 16 / 17.3 / 18 / 20 / 21.6 / 22.4 px (yedi boyut), iç boşluk 20 / 22 / 24 / 26 / 36 px, kenarlık 0–3 px, üst vurgu çizgisi üç farklı biçimde, hover kaldırması üç seviye (subtle/moderate/strong).
- **Yapılan (sınıf adları ve işaretleme değişmedi, değerler tek kaynağa bağlandı):** `alu-benefit-card`, `alu-media-card`, `alu-spec-card`, `alu-service-card`, `alu-ref-card`, `alu-about-value-item` zemin/kenarlık/yarıçap/gölge için `--card-*` token'larını (gölge: `--elevation-raised`/`--elevation-hover`, `--card-shadow`'un değeri; uygulama stil denetleyicisi yalnız `--elevation-*` adlarına izin veriyor) kullanıyor. Metin kartları (benefit, spec, service, about) tek iç boşluk `--card-padding` (24 px; spec 26→24, about 36→24). Rehber/dizin kartları (spec, service, about) tek vurgu çizgisi: üst kenar `--border-width-strong` + `--accent-border` (service `--border-strong`'tan, about 3 px'ten geldi). Hover: tek kaldırma `--motion-transform-lift-subtle` + vurgu kenarı (benefit/media `strong`, about `moderate` idi) ve hover gölgesi `--elevation-hover`. Kart başlığı tek ölçü: `--type-application-body-intro-size`/700 (17.28 px; benefit ve media zaten buydu): spec (20→17.28), about (21.6→17.28), `EditionCards` (16/600→17.28/700), FRILO `updateCard` (16→17.28; gölge eklendi, zemin/kenarlık token'a bağlandı). `ref-card` yoğun varyant olarak kendi dolgusunu ve başlık boyutunu korudu.
- **Ölçüm (faz sonrası, dev):** tüm kart ailelerinde zemin `rgb(48,52,54)` (`anthracite.800`); metin kartlarında dolgu 24 px, başlık 17.28 px/700; spec ve about üst vurgu 2 px. Görsel kontrol: Allplan Basic (benefit/media), Hakkımızda (değerler), Çözümler (spec) sayfaları koyu modda bakıldı; açık mod ve diğer sayfalar bu fazda tek tek bakılmadı.
- **Testler:** `tests/test_card_system.py` (token bağları, tek dolgu, tek vurgu çizgisi, tek hover kaldırma, tek başlık ölçüsü, modül kartları); `tests/test_app_styles.py` hover beklentileri yeni standarda göre güncellendi (about/benefit/media → `lift-subtle`). 426 test, 46/46 parite, 45/45 token, typecheck, build.
- **Dürüst sınır:** 16 kart ailesi sınıf adı olarak hâlâ ayrı; "üç ilkel"e (bilgi, medya, istatistik) *görsel* olarak yaklaştırıldı, işaretleme tek bileşene birleştirilmedi. Bilerek dokunulmayanlar: özellik satırları (`alu-feature-row`, `alu-wf-detail`, FRILO `capability`, Max özellik listesi: aynı kalıbın dört uygulaması), Max AI araç kartları (zemin/kenarlıksız), istatistik öğeleri (`alu-hero-metrics__item`), kapanış seçenekleri, `alu-bento-card`, ürün kartları. Bunlar Faz 4 adayı.
- **Karar bekleyen:** kart görünümü uygun mu? Sonraki: Faz 4 (özellik satırlarının tek bileşene alınması, kalan başlık kopyaları, global CSS'in budanması) veya durup tüm sayfaların görsel gözden geçirmesi.

## 03.11.2026 — Faz 2 devamı: bölüm başlıkları sola hizalı (commitlendi, onay bekliyor)

- **Karar (kullanıcı):** bölüm başlıkları hepsi sola hizalı.
- **Yapılan:** `SectionHeader` sola hizalı oldu (`alu-section-header`: `align-items: flex-start`, `text-align: left`); ortalı varyant (`alu-section-header-center`) CSS'ten, bileşenlerden ve derlenmiş sayfalardan tamamen kalktı. `SectionHeader` iki yeni özellik aldı: `id` (aria-labelledby için) ve `as="h1"` (sayfa başlığı bloğu için).
- **Kopya başlık işaretlemesi tek bileşene toplandı:** `EditionCards` (kicker+başlık+lead), `ProductPageParts` (`ProductContentSection`, `ProductFaq`), `ProductEditionView` özellik başlığı, `PreviewClosingSection`, `ReferencesDirectorySection` (h1, ortalıydı, sola hizalandı), Ürün Yaşam Döngüsü (6 bölüm), Paket Karşılaştırma sürüm başlığı, FRILO (genel bakış ve müşteri projeleri). İlgili modül CSS kuralları (kicker/başlık/lead) silindi; bölüm başlığı ile içerik arası boşluk `sectionHead`/`head` sınıflarıyla korundu.
- **Ölçüm (dev, 1280 px):** Allplan Basic, FRILO ve Rebar'da tüm bölüm `<h2>`'leri 32 px ve container'ın sol kenarında (x=278), `text-align: left`; derlenmiş hiçbir sayfada `alu-section-header-center` yok.
- **Testler:** `tests/test_section_header.py` (sola hizalı kural, ortalı varyant yok, benimseyen bileşenler, EditionCards kendi başlık CSS'ini taşımıyor, derlenmiş sayfalarda ortalı başlık yok). 420 test, 46/46 parite, 45/45 token, typecheck, build.
- **Hâlâ kendi başlık stilini kullananlar (Faz 3 adayı):** Max (kendi 56 px/eyebrow başlıkları), Scalypso sayfaları, `Allplan2027FeaturesPreview` grup başlıkları, ana sayfa ve Hakkımızda (`alu-h1` h2'ler), `RecordedWebinars`/`ResourcesDirectory`/`EducationPartners`/`VideoLibraryHubSection` grup başlıkları (`groupTitle`), `ProjectCarousel`, `CustomerTestimonials`, `IntroSplitSection`, `Release2027Band` (18 px) ve `PageEndConversion` (20 px). Bunlar zaten sola hizalı; yalnızca işaretleme/ölçek kopyaları.
- **Karar bekleyen:** görünüm uygun mu? Sonraki: Faz 3 (kart sistemi: 16 kart ailesini üçe indirme) ve yukarıdaki kalan başlıkların `SectionHeader`'a alınması.

## 03.11.2026 — Tasarım standardizasyonu, Faz 2: hero birleştirme ve SectionHeader (commitlendi, onay bekliyor)

- **Kapsam (kullanıcı onayı: "Uygun, Faz 2'ye geç"):** hero ailelerinin birleştirilmesi ve tek bölüm başlığı bileşeni. İçerik değişmedi.
- **`SectionHeader`** (`src/components/sections/SectionHeader.tsx`): kicker + h2 (`alu-h2`) + isteğe bağlı lead; aynı işaretlemeyi taşıyan 6 yerde (MediaGridSection, BenefitsSection, FAQSection, LinkGroupGridSection, WorkflowSection, StructuredPageLayoutSection SSS başlığı) kullanıma alındı. Doğrulama: 8 temsilî sayfanın derlenmiş HTML'i öncesi/sonrası karşılaştırıldı; hero dışında DOM farkı yok.
- **Alt sayfa hero'su (93 sayfa, `SubpageHeroSection`):** h1 `alu-display` (56 px/800) → `alu-h1` (48 px/700); dikey boşluk `--space-application-subpage-hero-padding` (80 px) → `--space-stack-lg` / `--space-stack-xl` (CompactPageHero ile aynı); üç buton `lg` → `md`; hero lead'i başlığı tekrar etmiyor: yeni `src/lib/hero-lead.ts` (`heroLead`) kaynak açıklamadaki "Başlık: açıklama" önekini yalnız gösterimde kırpar (Türkçe büyük/küçük harf duyarlı; veri `pages.json` aynen duruyor). Önceden 62 sayfada tekrar vardı, şimdi 0. Kalan not: bazı kaynak açıklamalar başlığın kısaltılmış halini tekrar ediyor (ör. Allplan Basic: "…İÇİN • Geniş kapsamlı…"); bu kaynak metnin kendisi, dokunulmadı.
- **`ProductHero`** yeniden yazıldı, sabit renk/boyutlar token'a taşındı: `compact` (varsayılan; h1 48 px, min 18 rem yükseklik, görsel sağda maske ile) ve `showcase` (Max; h1 `--type-display-size` 56 px, 34 rem). İsteğe bağlı `highlights` listesi. SCIA, Rebar, Parametric, Allplan 2027 sayfaları, Civil 2027 ve FRILO `compact`. **FRILO'nun kendi hero'su kaldırıldı** (CSS'i `ProductPage.module.css`'ten silindi), `ProductHero` + `highlights` kullanıyor. h1 80 px artık hiçbir sayfada yok.
- **`CompactPageHero`'ya geçenler:** Paket Karşılaştırma, Ürün Yaşam Döngüsü (kendi kopya hero CSS'leri silindi; yaşam döngüsünde 4–7 rem'lik boşluk gitti) ve `/2027/features` (başlık, ardından slogan lead olarak, sonra açıklama ve butonlar).
- **Ölçüm (dev, 1280 px):** tüm bu sayfalarda h1 48 px/700 (Max 56 px/700). Hero yüksekliği: Webinarlar 247 px, Ürün Yaşam Döngüsü 247, SCIA 288, Paket Karşılaştırma 330, 2027 Allplan Basic 370, FRILO 399, Allplan Basic (alt sayfa, rozet+buton satırıyla) 417, 2027 Özellikler 413, Max 544 (vitrin). Koyu ve açık modda Allplan Basic, SCIA, FRILO, 2027 Özellikler görsel olarak kontrol edildi.
- **Testler:** `tests/test_hero_standard.py` (heroLead birim testleri, h1 sınıfı, buton boyutu, hero boşluğu, derlenmiş hiçbir sayfada başlık tekrarı yok); `tests/test_prelaunch_decisions.py` ve `tests/test_subpage_component_boundaries.py` yeni yapıya göre güncellendi. 415 test, 46/46 parite, 45/45 token, typecheck, build.
- **Bilerek yapılmayanlar (Faz 3 adayı):** (1) sol hizalı ürün sayfası başlıkları (`EditionCards`, `ProductContentSection`, `ProductEditionView` özellik başlığı) hâlâ kendi başlık işaretlemesini kullanıyor; `SectionHeader` ortalı, bunlar sola hizalı: hizalama kararı gerekiyor (öneri: tek hizalama). (2) Scalypso (5 sayfa), AX3000 Mekanik Tesisat, Referanslar, ana sayfa ve Hakkımızda'nın kendi hero/başlıkları. (3) Sayfa sonu dönüşüm bandı başlığı (20 px). (4) Kart aileleri (16 aile → 3). (5) Alt sayfaların büyük harfli kaynak başlıkları (30 sayfa; kaynak metin olduğu için korundu).
- **Karar bekleyen:** Faz 2 görünümü uygun mu? Başlık hizalaması: tüm bölümlerde ortalı mı, sola hizalı mı? Onaydan sonra Faz 3 (kart sistemi) planlanır.

## 03.11.2026 — Tasarım standardizasyonu, Faz 1: yüzey merdiveni ve başlık ölçeği (commitlendi, onay bekliyor)

- **Kapsam (kullanıcı: "Önerilen sıra"):** önce token düzeyinde tonal yüzey merdiveni ve tek bölüm başlığı ölçeği. Sayfa içeriği değişmedi. Geri dönüş: `restore/pre-design-standardization-20261103`.
- **Koyu tema (`aluplan`):** `surface.subtle` (alternatif bant) `anthracite.900` → `850`; `surface.default` (kart/girdi) `900` → `800`; `surface.raised` `850` → `800`; `surface.muted` `800` → `700`; `surface.page` `950` aynı. Sayfaya kontrast: bant 1.21:1 (önce 1.10), kart 1.39:1 (önce 1.10), muted 1.86:1. Eskiden `subtle` ile `default` aynı renkti (kartlar bantta yalnız çerçeveyle ayrışıyordu); artık kart bandın üstünde ayrı bir kütle.
- **Erişilebilirlik uyarlamaları (kontrast testi 0 hata, 188 kontrol):** koyu temada `border.control` ve `action.secondary.border` `silver.500` → `silver.400` (kart yüzeyi 800 olduğu için 3:1 koşulu); `action.secondary` ve `action.ghost` hover/aktif `800/700` → `700/600` (hover kart yüzeyiyle aynı renge düşmesin).
- **Açık tema (`aluplan`):** `surface.page` beyaz → `silver.50` (`#F5F7FA`), `surface.subtle` `silver.50` → `silver.100`, `surface.muted` `silver.100` aynı; kartlar (`default`/`raised`) beyaz kaldı, böylece kartlar sayfadan ve banttan ayrışıyor (önceden page/default/raised aynı beyazdı). Bant üzerinde bağlantı kontrastı için `text.link` `blueprint.600` → `blueprint.700` (silver.100 üzerinde 4.28 → 5.55:1). `field` teması değişmedi.
- **Başlık ölçeği:** bölüm başlığı (`<h2>`) tek ölçüye çekildi: `--type-h2-size` (1.5–2 rem, 1280 px'te 32 px). `alu-h1` ile çizilen section `<h2>`'ler `alu-h2` oldu (13 bileşen: MediaGridSection, BenefitsSection, StructuredPageLayoutSection, StructuredContentBlocks, WorkflowSection, FAQSection, VideoPlaylistSection, SolutionCatalogSection, LinkGroupGridSection, DisciplineWorkflowSection, ProfessionalServicesSection, InnovationsSection, SubpageView); `EditionCards`, `ProductPage` (SCIA/FRILO bölümleri) ve `ProductEditionView` başlık CSS'i `--type-h3-size` (20 px) → `--type-h2-size`. Bilerek dokunulmayanlar: ana sayfa (`HomepageView`) ve Hakkımızda editoryal başlıkları, Max (56 px kendi stili), sayfa sonu dönüşüm bandı başlığı (`PageEndConversion`, 20 px) — bunlar şablon fazında (Faz 2/3) ele alınacak.
- **Test:** `design-system/scripts/token-tests.mjs` içindeki "contrast decision uses unrounded ratio" testi açık tema sayfa rengi değiştiği için yeni kenar değeri (`#417A86`, 4.4953) kullanıyor.
- **Doğrulama:** 408 test, 46/46 parite, 45/45 token (0 kontrast hatası), typecheck, build. Tarayıcıda dark ve light modda Allplan Basic, SCIA ve Kaydedilmiş Webinarlar bakıldı: kartlar sayfadan ve banttan ayrışıyor, bantlar belirgin. Ölçülmeyenler: tüm 116 sayfanın görsel karşılaştırması ve mobil; hover/odak durumları yalnız birkaç bileşende denendi.
- **Etki uyarısı:** yüzey değişikliği her sayfayı etkiler (sistem geneli). Beğenilmeyen bir değer `tokens.json` içindeki 8 satırdan geri alınır; `pnpm styles:generate` yeniden üretir.
- **Karar bekleyen:** Faz 1'in görünümü uygun mu? Onaydan sonra Faz 2 (hero birleştirme + tek bölüm başlığı bileşeni; 93 alt sayfa şablonu).

## 03.11.2026 — Tasarım tam röntgeni: 116 sayfanın tamamı (analiz; uygulama onay bekliyor)

- **Kapsam ve yöntem:** derlenmiş (`.next/server/app`) 125 HTML'in 116'sı (102 veri güdümlü + 14 rota sayfası; `/preview/*`, `/archive`, `/health`, hata sayfaları hariç) ayrıştırıldı; sayfa başına hero ailesi, h1/h2 stil sınıfları, kart aileleri, görsel/video/tablo sayısı, HTML boyutu ve hero lead tekrarı çıkarıldı. Ham veri: `docs/verification/design-xray-2026-11-03.csv` (sayfa başına bir satır). Sınıf bazlı boyutlar tarayıcıda hesaplanmış stille doğrulandı; hem koyu hem açık tema yüzey değerleri okundu. Sınırlar: dev sunucusunda 1280 px'te ölçüldü; mobil ve gerçek kullanıcı performansı (Lighthouse/CrUX) ölçülmedi.
- **1) Sayfaların %80'i eski "alt sayfa" şablonunda:** 93/116 sayfa `SubpageHero` (h1 `alu-display` 56 px/800) kullanıyor: 49'u `structured-page` düzeniyle (ürün/çözüm sayfaları: 14 ürün, 34 çözüm...), 44'ü genel `preview-section` bölümleriyle (14 video oynatma listesi, 19 çözüm, yasal/iletişim/hakkımızda/arama, ürün kataloğu). Kullanıcının beğendiği `CompactPageHero` ailesi yalnızca 4 sayfa (Kaynaklar, Kaydedilmiş Webinarlar, Video Kütüphanesi, Eğitim Merkezleri). ProductHero (h1 80 px) 9 sayfa; FRILO kendi hero'suyla 1; tekil düzen 9 (ana sayfa, `/2027/features`, paket karşılaştırma, ürün yaşam döngüsü, referanslar, 4 Scalypso). Not: Paket Karşılaştırma ve Ürün Yaşam Döngüsü kompakt görünümü kendi CSS'iyle (CompactPageHero kullanmadan) taklit ediyor.
- **2) Başlık ölçeği tutarsız ve h2'ler boyut sınıfıyla seçiliyor:** bölüm başlıkları (`<h2>`) `alu-h1` (48 px, 171 başlık/69 sayfa), `alu-h2` (32 px, 99/46), `alu-h3` (20 px, 82/28), düz h2 (55/13) ve modül sınıfları (SCIA/FRILO/Rebar'da 20 px, Max'te 56 px) ile çiziliyor; yani aynı anlamsal düzey 18–56 px arasında beş boyutta. h1: 56 px/800 (93 sayfa), 48/700, 80/700, 32/700 (ana sayfa, `/2027/features`).
- **3) Alt sayfa hero metni başlığı tekrarlıyor:** 94 alt sayfa lead'inin 62'si "Başlık: açıklama" biçiminde başlığı yeniden yazıyor (ör. KVKK, Gizlilik, Hakkımızda, Ürünler, Allplan Basic); 30 sayfada h1 BÜYÜK HARFLİ kaynak başlığı. En uzun h1 86 karakter (hello-allplan-2024). Lead medyanı 158 karakter.
- **4) Kart aileleri:** 16 `article` ailesi: `alu-benefit-card` (313 kart/29 sayfa), `alu-media-card` (448/24), `alu-ref-card` (228/1), `alu-spec-card` (107/22), `alu-service-card` (102/1), `EditionCards` (40/4), `alu-feature-row`, `alu-wf-detail`, FRILO `capability`/`updateCard`, Max `card`, hakkımızda değer öğesi, hero metrik öğesi vb.
- **5) Leke / tonal yapı (en önemli bulgu, tüm sayfalar):** koyu temada sayfa `#181a1b`, `surface-default` `#202324` (sayfaya kontrast 1.10:1), `surface-raised` `#272a2c` (1.21:1), `surface-muted` `#303436` (1.39:1), çerçeve `#414749` (1.85:1); metin ve vurgu 9.5:1. Yani yüzeyler tek bir koyu kütlenin içinde; bölümler arası tonal ritim çok zayıf, hiyerarşi neredeyse yalnız çerçeve ve boşlukla kuruluyor. Açık temada `page`, `default` ve `raised` yüzeylerinin üçü de `#fff` (hiç ayrışma); yalnızca `muted` `#e6eaf0`. Hero koyu kalıyor. (WCAG 1.4.11 notu: çerçeveler 3:1'in altında; kart sınırı anlamı taşıyorsa ayrıca değerlendirilmeli.)
- **6) Dikey ritim:** bölüm üst boşluğu 0, 24, 28, 32, 40, 80, 96, 112 px.
- **7) Token ihlali:** `ProductHero.module.css` sabit değer taşıyor (`#151718`, `clamp(2.6rem,5vw,5rem)`, `540px`, `1.2rem`).
- **8) Performans (üretim derlemesi):** paylaşılan tek CSS 290 KB ham (~39 KB gzip; tüm sayfalarda aynı 329 KB/43 KB gz); JS 680–830 KB ham (205–244 KB gz), büyük kısmı çerçeve; sayfa verisi istemci paketinde değil. En ağır sayfalar: `/references` 204 KB HTML (görselsiz), `/search` 98 KB, `/products/civil` 98 KB/51 görsel, `/products/allplan-ultimate` 94 KB/52 görsel, `/solutions/addons/steel-components` 94 KB/40 görsel, video oynatma listeleri 33–63 KB/8–78 görsel. Ortak bileşenler aktarım boyutunu tek başına çok azaltmaz (CSS zaten tek dosya); asıl kazanç: global CSS'in (342 KB + 122 KB kaynak, 755 `.alu-` kuralı) bölünmesi/budanması, kart ve hero ailelerinin azalması ve ağır sayfaların hafifletilmesi.
- **Sonuç:** sorun "birkaç sayfa" değil sistemik: kullanıcının beğendiği kompakt düzen sitenin %3'ünde; asıl kitle (%80) eski alt sayfa şablonunda. Tutarlılık işi bu yüzden önce şablon düzeyinde (SubpageHero + structured/preview bölümleri) çözülmeli; tek tek sayfa düzeltmeleri etkisiz kalır. Karar bekleyen seçenekler ve önerilen yol önceki analiz kaydında; hedef görünüm teyidi sürüyor.

## 03.11.2026 — Restore point ve sayfalar arası tasarım analizi (analiz; uygulama onay bekliyor)

- **Restore point:** `restore/pre-design-standardization-20261103` (annotated tag, `3442712`, `origin`'e push edildi). Geri dönüş: `git checkout restore/pre-design-standardization-20261103` veya `git reset --hard <tag>` (önce mevcut işi yedekleyin). Çalışma ağacı temizdi, ek commit gerekmedi.
- **Kullanıcı gözlemi:** bazı sayfalar tam istenen biçimde (kompakt, sade, okunur); bazılarında denge, leke ve tipografi sorunu var. Hedef: mevcut içeriği koruyarak tasarımı standartlaştırmak; performans için ortak bileşenler.
- **Ölçüm (ilk tur: yalnızca 17 sayfa; "20 sayfa" ifadesi hatalıydı — tam röntgen yukarıdaki yeni kayıtta) (dev sunucusu, 1280 px, hesaplanmış stil):**
  - **Hero aileleri:** CompactPageHero (Kaynaklar, Kaydedilmiş Webinarlar, Video Kütüphanesi, Paket Karşılaştırma, Ürün Yaşam Döngüsü, Eğitim Merkezleri): h1 48 px/700, içerik ilk ekranda başlar (ekran görüntüsünden; yükseklik ölçülmedi). SubpageHero (Allplan Basic, Civil, SDS2…): h1 56 px/800, kaynak başlığı büyük harf. ProductHero (SCIA, Max, Rebar, Allplan 2027 sayfası, Civil 2027 ölçüldü; Parametric aynı bileşen): h1 80 px/700, CSS'te 540 px minimum yükseklik. FRILO: kendi hero'su 48 px/700. Ana sayfa ve `/2027/features`: 32 px.
  - **Bölüm başlığı (h2) ölçeği:** sayfalara göre 18, 20, 32, 48 ve 56 px (beş ayrı boyut). Kompakt sayfalarda h1 de h2 de 48 px olduğunda (Webinarlar) hiyerarşi düz; SCIA/FRILO/Rebar'da h1 80 px iken h2 20 px (sıçrama çok büyük). Nedeni: `MediaGridSection` h2'ye `alu-h1` sınıfı veriyor; `EditionCards` ve `ProductContentSection` `--type-h3-size` kullanıyor; Max kendi 56 px'ini taşıyor.
  - **Bölüm dikey boşluğu:** 0, 24, 28, 32, 40, 80, 96 ve 112 px.
  - **Kart aileleri:** `alu-media-card`, `alu-benefit-card`, `EditionCards`, FRILO `capability` ve `updateCard`, Max `card`, `alu-hero-metrics__item`, `Allplan2027FeaturesPreview` kartları: yaklaşık sekiz aile, üç iş yapıyor (görsel+metin, yalnız metin, istatistik).
  - **Token ihlali:** `ProductHero.module.css` sabit değerler taşıyor (`#151718`, `clamp(2.6rem,5vw,5rem)`, `540px`, `1.2rem`); mimari kural "bileşenler yalnız token kullanır".
  - **Leke (görsel yargı, ekran görüntüleri):** ProductHero sayfalarında büyük koyu görselli hero sonrası bantların tamamı aynı koyu değerde, çerçeveli kartlar; bölümler arası tonal ritim zayıf. Kompakt sayfalarda içerik hemen başlıyor ve kartlar zeminden ayrışıyor.
- **Performans (üretim derlemesi):** tüm sayfalar tek paylaşılan CSS dosyası kullanıyor (290 KB ham, yaklaşık 39 KB gzip; toplam CSS 329 KB / 43 KB gz); JS 680–830 KB ham (205–244 KB gz), büyük kısmı çerçeve; sayfa verisi istemci paketinde değil. Yani ortak bileşenlerin tek başına aktarım boyutunu azaltması sınırlı; asıl kazanç bakım/tutarlılık. Gerçek performans kaldıraçları: (1) global CSS'in (`globals.css` 342 KB + `application.css` 122 KB kaynak, 755 `.alu-` kuralı) sayfa başına gerekenle sınırlanması, (2) ağır sayfalar: `/products/civil` 170 KB HTML ve 53 görsel, Allplan Basic 24 görsel, (3) kart/hero aile sayısının azalması CSS'i de küçültür.
- **Önerilen yol (içerik değişmeden):** (0) restore point (yapıldı); (1) sayfa arketipleri: Kaynak/Hub (kompakt), Ürün, 2027 yenilik, Yasal/uzun metin, Ana sayfa; her rota bir arketipe atanır; (2) tek tipografi ölçeği (h1 48, h2 32, h3 20) ve iki bölüm boşluğu değeri, bantlar için yüzey ritmi kuralı (default/raised dönüşümü); (3) hero birleştirme: CompactPageHero varsayılan, ProductHero "kompakt + görsel" varyantı (48 px h1, görsel sağda, sabit değerler token'a), SubpageHero boyut/ağırlık normalizasyonu (kaynak metin korunur); (4) kart sistemi: sekiz aileyi MediaCard, InfoCard (EditionCards) ve StatCard'a indir; (5) tek `SectionHeader` (kicker + h2 + lead), `alu-h1`'in h2'de kullanımı bırakılır; (6) doğrulama: rota başına öncesi/sonrası ekran görüntüsü (3 genişlik), içerik parite testleri değişmez, token/kontrast testleri; sıra: önce 2027 ve yeni sayfalar, sonra alt sayfa ailesi, en son canlıya onaylı SCIA/FRILO/Max (görsel fark onayıyla).
- **Karar bekleyen:** hedef görünümün kompakt sayfalar olduğu teyidi; Ana sayfa ve Max için tek bir "vitrin" hero (80 px) korunsun mu; alt sayfalarda büyük harfli kaynak başlıklarının (ör. "TASARIM, GÖRÜNTÜLEME VE İŞ BİRLİĞİ İÇİN TEMEL ÇÖZÜM") ve hero'da tekrar eden lead metninin ele alınışı (içerik korunur, yalnız biçim); faz sırası onayı. Her faz sonunda kullanıcı onayı beklenir (AGENTS.md).

## 03.11.2026 — E1: ortak ürün sayfası bileşenleri (commitlendi)

- **Karar (kullanıcı):** E1 = SCIA, FRILO ve Max'i `ProductEditionView` / `EditionCards` şablonuna taşımak; uygulama biçimi bana bırakıldı.
- **Yapılan:** `src/components/sections/ProductPageParts.tsx` içinde dört ortak blok: `ProductTabNav` (sekme şeridi), `ProductEditionsBand` (EditionCards bandı), `ProductContentSection` (kicker + başlık bölümü) ve `ProductFaq` (SSS listesi; FRILO'nun `alu-accordion__*` sınıfları için `accordionClasses`). SCIA, FRILO ve `ProductEditionView` bu bloklara geçti; satır içi tekrarlanan işaretleme kalktı. `ProductEditionView` (Rebar, Parametric) ve SCIA/FRILO artık aynı sekme şeridi ve sürüm bandı koduyla çiziliyor. Test: `tests/test_product_page_parts.py`.
- **Doğrulama:** davranış korunarak yapılan bir yeniden düzenleme olduğu için `/products/scia`, `/products/frilo`, `/products/allplan-max`, `/products/allplan-rebar` ve `/products/allplan-parametric` derlenmiş HTML'i değişiklikten önce ve sonra alınıp (öznitelik sırası ve derleme karmaları normalize edilerek) karşılaştırıldı: beşi de **birebir aynı** çıktı. (Sonradan, kullanıcı isteğiyle Rebar ve Parametric özellik kartları metin+görsel tek kart olacak şekilde bilerek değiştirildi; SCIA, FRILO ve Max çıktısı yine birebir aynı doğrulandı.)
- **Max neden taşınmadı:** Max sayfası zaten `ProductHero`, `PreviewClosingSection`, `IntroSplitSection`, `CustomerTestimonials` ortak bileşenlerini kullanıyor ve farklı bir sayfa yapısı taşıyor (video, anket metrikleri, öne çıkan özellik klipleri, referanslar). Sürüm/özellik kartı şablonuna zorlamak sayfanın içeriğini ve görünümünü değiştirirdi; bu yüzden dokunulmadı. Max'in "sürüm" kartı yok, EditionCards uygun değil.
- **Bilerek bırakılanlar:** FRILO hero'su kendi işaretlemesini koruyor (hero altı madde listesi `heroBenefits` ve kendi arka plan stili var; `ProductHero` ile değiştirmek görünümü değiştirirdi). SCIA ve FRILO'nun yetenek/proje bölümleri (CapabilityAccordion, ProjectCarousel, kendi liste/ızgara) sayfa özelinde kaldı. Ortak şablona tam taşıma (veri güdümlü sayfa) ayrı bir iş olur ve görsel karşılaştırma gerektirir.
- Kapılar: 408 test, 46/46 parite, 45/45 token, typecheck, build.

## 03.11.2026 — Rebar, Parametric ve Allplan 2027 sayfalarına ekran görüntüleri (commitlendi)

- **Eklendi:** `Allplan 2027 Marketing Materials/ALLPLAN 2027 Launch…/Screenshots` klasöründen seçilen 21 ürün ekran görüntüsü web JPEG'ine çevrildi (en fazla 1600 px genişlik, 410 KB altı; `public/assets/previews/allplan-2027-screens/`). Mümkün olduğunda klasördeki hazır `_edited` / `Final` sürümleri seçildi.
- **Rebar ve Parametric (kullanıcı kararı: metin ve ekran görüntüsü aynı kartta):** özellikler grup başına bir kart ızgarasında (`MediaGridWithViewer`, 3 sütun); ekran görüntüsü olan özellikte görsel ve metin aynı kartta (tıklayınca büyür), görseli olmayan özellik yalnızca metin kartı. Ayrı "Ekran görüntüleri" galerisi yok. Her sayfada 30 özellik kartı; Rebar'da 18'i, Parametric'te 18'i görselli. **Allplan 2027 yenilik sayfaları:** kartlar görselli ve metinle aynı kartta (`MediaGridWithViewer`, `EditionCards` yerine); özellik başına eşleme `editionScreens`. **Kural:** yeni sayfalarda metin ve ilgili görsel aynı kartta olur.
- **Kaynak/test:** eşlemeler `src/data/allplan-2027-screens.ts`, yardımcılar `src/lib/feature-screens.ts`. `tests/test_feature_screens.py`: her görsel web boyutlu JPEG, her görsel için lisans günlüğünde "Manufacturer image / Pending" satırı, eşlemelerdeki özellik başlıkları gerçek, derlenmiş sayfalarda her görsel kendi özelliğinin metniyle aynı kartta. Lisans günlüğüne 21 `SCREEN-2027-*` satırı eklendi (izin teyidi yayından önce gerekli).
- **Eşleme notu:** "Allplan Max" özelliği için `Engineering Max - AI BIM Analyst.png`, "Donatı iş akışı otomasyonu" için duvar donatısı görüntüsü seçildi; "Cloud BIM Manager ve Mark Numbering 2.0" kartı Cloud BIM Manager görselini kullanıyor (Cloud BIM Manager kartıyla aynı). Beğenilmeyen eşleme `build_screens` mantığıyla değil doğrudan `allplan-2027-screens.ts` içinden değiştirilebilir.
- Kapılar: 405 test, 46/46 parite, 45/45 token, typecheck, build; sayfalar tarayıcıda doğrulandı (görseller yüklendi, yatay taşma yok).

## 03.11.2026 — Kalan işlerin güncel listesi ve ertelenen karşılaştırma (commitlendi)

- **Ertelenen karşılaştırma (kullanıcı kararı):** `/products/allplan-max`, `/products/scia` ve `/products/frilo` sayfaları da `/2027/civil` gibi canlı sayfalardan (envanter) üretilmiş olabilir; pazarlama klasöründeki Web Pages belgeleriyle (Max: `Allplan Max Web Page.docx`; SCIA: `New Text and Images – SCIA Pages.docx`; FRILO: `New Text and Images – FRILO - Edition Pages Copy.docx` ve Excel metinleri) satır satır karşılaştırılıp eksik içerik çıkarılabilir. Bu sayfalar canlıya onaylanarak çıktığı için şimdilik sorun yok; gerekirse yapılacak. (Civil'de bu karşılaştırma yapıldı ve eksik çıktı; sayfa sonra yalnızca yeniliklere indirildi.)
- **Henüz yapılmayanlar (bu oturumdan):**
  - `/products/allplan` ürün sayfasına "Allplan 2027" ana metni (`allplan.home.whats-new`: "Allplan 2027, mühendislik ekiplerine daha fazla kontrol veriyor…") hiçbir yere konmadı; sayfa 2026 anlatımıyla duruyor (envanterdeki açık soru: korunsun mu, 2027 hero ile mi değişsin).
  - Pazarlama klasöründeki `Messaging`, `Sales Enablement Assets` (31/25/8/14/36/25 dosya), `Videos` (63/6/29/3/32/31) ve `Screenshots` (139/26/45/105/92/17) klasörleri ve üç `Launch 2027 - Intro text edition pages shop EN.xlsx` dosyası okunmadı/işlenmedi.
  - Rebar ve Parametric sayfalarında özellik görseli yok (hero'da mevcut görseller); Allplan 2027 yenilik sayfalarında da aynı. Ekran görüntüleri `Screenshots` klasöründe.
  - Civil "Home Page Slides" belgesindeki görsel (Lammschlucht Köprüsü) ve altyazısı kullanılmadı; `/2027/features` Civil kartları canlıdan indirilmiş yinelenen görselleri kullanıyor.
  - SDS2 ana banner görseli: kullanıcı üretip verecek (şimdilik üretilmiş hero ailesi görseli).
  - Üretici görsellerinin izin kaydı hep "Pending" (`docs/brand/assets-license-log.md`); yayından önce Allplan teyidi gerekir.
  - Yeni sayfaların Türkçe metni projenin envanter taslağıdır; kullanıcı onayı sürüyor (özellikle yeni sayfa adresleri `/products/allplan-rebar`, `/products/allplan-parametric`, `/2027/allplan-*`).
  - Sürüm bayrağı kapalıyken (üretim derlemesi) bantların, menü öğelerinin ve 404'lerin davranışı test ve kodla doğrulandı ama bayrağı kapatarak ayrı bir üretim derlemesiyle denenmedi.
- **Mevcut açık maddeler değişmedi:** yukarıdaki "Açık maddeler" bölümü (kayıtsız 4 webinar, tarih teyitleri, geçici Kaynaklar kart metinleri, B3 BIMFlex videosunu sahibine açtırma, C1, B5, `youtube*` jetonları, E1–E3, yayın adımları). C1 için not: kullanıcı sayısal iddiaların (5×, %20–50, %50) doğru olduğunu ve kullanılabileceğini söyledi; kalan C1 maddeleri üreticiden bilgi bekliyor.

## 03.11.2026 — `/2027/civil` yalnızca yenilikleri gösteriyor (commitlendi)

- **Karar (kullanıcı):** `/2027/civil` sayfasında yalnızca Civil 2027 yenilikleri olur; Civil'in tam ürün anlatımı (nedir, zorluklar, metrikler, avantajlar, özellikler, bulut hizmetleri, seçenekler, SSS, uzman videoları, müşteri projeleri) `/products/civil` (2026 sayfası) üzerinde kalır.
- **Yeni yapı:** hero (SÜRÜM 2027, ALLPLAN Civil, Civil slayt gövde metni, "Teklif isteyin" ve "ALLPLAN Civil sayfasına dön" → `/products/civil`), 3 yenilik bölümü (görselli), kapanışta teklif. Bileşen `CivilNewsView`; metin envanter taslağından (`src/data/allplan-civil-2027-news.ts`, `civilNews2027` + `civilNewsHero`); `tests/test_civil_2027_news.py` hem birebir eşitliği hem eski bölüm başlıklarının sayfada olmadığını denetler.
- **Silindi (ölü kod):** `AllplanCivilPreview.tsx/.module.css`, `CivilFeatureGrid.tsx`, `allplan-civil-2027-preview.ts` ve yalnızca bunların kullandığı 64 görsel (`public/assets/previews/allplan-civil-2027/` altında yalnızca `civil-hero.jpg` ve üç yenilik görseli kaldı; 6,0 MB → 1,6 MB). Silinen içerik git geçmişinde ve `docs/content-2027/allplan-canlı/` arşivinde duruyor.
- Kapılar: 400 test, 46/46 parite, 45/45 token, typecheck, build; sayfa tarayıcıda doğrulandı (h1 + 2 h2, 3 yenilik kartı).

## 03.11.2026 — Civil 2027 yenilikleri `/2027/civil` sayfasına eklendi (commitlendi)

- **Bulgu:** `/2027/civil` sayfası pazarlama klasöründen değil, 29.10.2026'da envanterlenen canlı Allplan Civil sayfasından (`docs/content-2027/allplan-canlı/allplan-civil.md`) üretilmişti; "New Text and Images – Civil Page" belgesindeki yeni özellikler sayfada yoktu.
- **Eklendi:** "ALLPLAN Civil nedir?" bölümünün hemen altına "Allplan Civil'deki Yenilikler" bölümü: giriş paragrafı ve 3 yenilik (Otomatik Parametrik Eksen Gridi, Esnek Dağıtım ve İstasyonlama, Yeniden Kullanılabilir Seri Elemanlar), paylaşılan `MediaGridWithViewer` ile. Metin envanter taslağından (`src/data/allplan-civil-2027-news.ts`; `tests/test_civil_2027_news.py` birebir eşitliği korur). Görseller belgedeki üç dosyadır (`public/assets/previews/allplan-civil-2027/new-2027-*.png`, değiştirilmeden kopyalandı); `docs/brand/assets-license-log.md` içine üç "Manufacturer image / Pending" satırı eklendi ve `test_asset_license_log.py` kapsamına alındı.
- **Not:** `/2027/features` sayfasındaki Civil kartları aynı görsellerin canlı siteden indirilmiş kopyalarını kullanıyor (yinelenen iki dosya); ikinci yenilik (istasyonlama) orada `Editable_Stationing.mp4` videosu, bu sayfada belgedeki görsel. Civil "Home Page Slides" belgesindeki görsel (Lammschlucht Köprüsü) ve altyazısı henüz kullanılmadı.
- Kapılar: 398 test, 46/46 parite, 45/45 token, typecheck, build; bölüm tarayıcıda doğrulandı.

## 03.11.2026 — Rota taşıma, menü, ana sayfa başlıkları ve Allplan 2027 yenilik sayfaları (commitlendi)

- **Rotalar taşındı (kullanıcı kararı, tutarlılık):** `/2027/max` → `/products/allplan-max`, `/2027/frilo` → `/products/frilo`, `/2027/scia` → `/products/scia`. Bu adresler hiç yayımlanmadığı için yönlendirme eklenmedi (eski adresler 404). Ortak sekme stili `ProductPage.module.css` olarak `src/components/sections/` altına alındı.
- **Sapma (Civil):** `/2027/civil` yerinde bırakıldı, çünkü `/products/civil` canlı 2026 ürün sayfası olarak zaten var; yeni sayfayı oraya koymak iki Civil ürün sayfası ve karışıklık yaratırdı. Civil 2027 sayfası, Allplan sürümleriyle aynı mantıkla "2027 yenilikleri" ailesinde (`/2027/`) duruyor. Kullanıcı isterse başka bir ad (ör. `/products/allplan-civil`) seçilebilir.
- **Menü:** "ALLPLAN" ürün grubuna Ultimate'ten sonra "ALLPLAN Rebar" ve "ALLPLAN Parametric" eklendi (üreteç: `releaseOnly: True`). `SiteShell` bu öğeleri yalnızca sürüm içeriği açıkken gösterir (masaüstü ve mobil menü). Test: `tests/test_release_menu.py`.
- **Ana sayfa slaytları:** SDS2, Allplan, Civil ve Max kartlarının slayt gövde metinleri envanter taslağıyla zaten aynıydı; eksik olan slayt başlıkları eklendi (`headline`/`headlineSourceId`: Allplan "Gücü ve kontrolü mühendislerin eline vermek", Max "Mühendisler için yapay zekâ. Sadece otomatikleştirmeyin. Yenilik üretin.", Civil "Altyapı projelerini %50'ye kadar daha hızlı teslim edin", SDS2 "Zaman Kazanın, Daha Fazla İş Yapın"). Panel başlığı slayt başlığını gösterir, yoksa ürün adını (FRILO ve SCIA'da slayt belgesi yok). Test: `tests/test_home_slides.py`.
- **Allplan 2027 yenilik sayfaları (kullanıcı kararı):** mevcut Basic/Concept/Professional/Ultimate sayfaları birebir korundu; hero altına, yalnızca sürüm içeriği açıkken görünen "SÜRÜM 2027 / … Yenilikler / 2027 yeniliklerini inceleyin" bandı eklendi (`Release2027Band`, `SubpageView`'da hero ile yapılandırılmış yerleşim arasında). Aynı bant `/products/civil` için de eklendi (hedef `/2027/civil`). Yeni sayfalar: `/2027/allplan-basic`, `/2027/allplan-concept`, `/2027/allplan-professional`, `/2027/allplan-ultimate` (hero: ürün adı + giriş metni, kartlar: 3 yenilik, kapanış: teklif). Metin envanter taslağından (`src/data/allplan-2027-editions.ts`, `tests/test_allplan_2027_pages.py` birebir eşitliği korur). Özellik kartı başlıkları (Allplan Max, BIM'e hazır ipuçları, Mark Numbering 2.0, Cloud BIM Manager, Donatı iş akışı otomasyonu, Cloud BIM Manager ve Mark Numbering 2.0) kaynak cümlelerin başındaki ürün adlarıdır; belgede özellik görseli yok, hero için mevcut Allplan platform görseli kullanıldı.
- **Düzeltme (Bimplus):** Bimplus metni de önce envanter taslağına bakılmadan yazılmıştı; "2027'de Yeni:", "BCF 3.0 alışverişi", "Kaplamaları kırpın" biçimine getirildi ve test envanterle eşitlendi.
- Kapılar: 394 test, 46/46 parite, 45/45 token, typecheck, build; yeni sayfalar, bantlar ve menü tarayıcıda doğrulandı.

## 03.11.2026 — FRILO Geotechnics bölümleri (commitlendi)

- **Eklendi:** `/2027/frilo` sayfasına FRILO Geotechnics: (1) 5 sürüm kartı (Concept, Professional Pit, Professional Retaining, Ultimate, Soil Mechanics) ve belgedeki geoteknik "what's new" paragrafı; (2) her geoteknik sürüm için kendi yenilikler bölümü (Entegre Yapay Zekâ Desteği, 2. nesil Eurocode'lara hazır olun, Entegre zemin katmanı modelleme); (3) sekme şeridine "Geoteknik" bağlantısı. Geoteknik sürümler yapısal sürümlerle aynı sayfada, çünkü kaynak belge de FRILO'yu tek ürün sayfası olarak veriyor.
- **Kaynak ve test:** metin `scripts/inventory_units/frilo.py` Türkçe taslaklarından üretildi (`src/data/frilo-geotechnics-2027.ts`); `tests/test_frilo_geotechnics.py` aynı kalmasını zorunlu kılar. `EditionCards` iki isteğe bağlı özellik kazandı: `lead`, `itemsLabel` (mevcut kullanımlar değişmedi).
- **Karar (kullanıcı): özellikler sürüm başına ayrı gösterilir.** Concept, Professional Pit, Professional Retaining ve Ultimate için dörder ayrı "… Yenilikler" bölümü (her biri 3 kart); Soil Mechanics'te belgede özellik olmadığı için bölümü yok. Bölüm başlıkları envanter taslağından; belgedeki Ultimate başlık hatası (Retaining metni taşınmış) taslakta amaçlanan Ultimate başlığına göre düzeltilmiş, üreticiye sorulması gerekmedi.
- **Açık:** FRILO sayfası hâlâ `/2027/frilo`. Rebar/Parametric `/products/` altında olduğu için FRILO, SCIA, Civil ve Max'in de `/products/` altına taşınıp taşınmayacağı ayrı karar.
- Kapılar: 382 test, 46/46 parite, 45/45 token, typecheck, build; sayfa tarayıcıda doğrulandı.

## 03.11.2026 — Rebar/Parametric adres kararı, sayısal iddialar ve SDS2 görseli (commitlendi)

- **Taşındı:** `/2027/rebar` → `/products/allplan-rebar`, `/2027/parametric` → `/products/allplan-parametric` (diğer sürüm sayfalarıyla tutarlı, envanter taslağının önerdiği adresler). Bu iki adres hiç yayımlanmadığı (dal push edilmedi) için eski adreslere yönlendirme eklenmedi; `/2027/rebar` ve `/2027/parametric` artık 404 verir. Sürüm bayrağı kapalıyken iki sayfa 404 verir ve sitemap'ten çıkar (yeni test).
- **Kullanıcı kararı — sayısal iddialar:** "5 kata kadar daha hızlı", "%20–50", "%50'ye kadar daha hızlı" gibi üretici iddiaları doğru kabul edildi, olduğu gibi kullanılır (envanterdeki "yayın izni" açık soruları kapandı).
- **Kullanıcı kararı — SDS2 ana banner görseli:** Kullanıcı uygun görseli üretecek ve verecek. O zamana kadar SDS2 ana sayfa kartı mevcut üretilmiş hero ailesi görselini (`vf-03-construction-fabrication.jpg`) kullanır; yeni görsel gelince `HomepageProductPreviewTabs.tsx` içindeki `images.SDS2` değiştirilir. Kaynak belgedeki `Keyvisual2027_RelatedContent_SDS2.jpg` kullanılmaz (proje adı ve firma bilgisi maskeli).
- Kapılar: 379 test, 46/46 parite, 45/45 token, typecheck, build; yeni adresler tarayıcıda 200, sitemap'te var.

## 03.11.2026 — SDS2 kapsamı netleşti; Rebar/Parametric metinleri envanter taslağına bağlandı (commitlendi)

- **SDS2:** Yeni sayfa gerekmedi. `SDS2 … Web Pages` klasöründeki iki belge zaten karşılandı: "New Text and Images – SDS2 Page" (3 yenilik: AI BIM Analyst, Model Synced Erection Drawings, Advanced Connection Group Reporting) `/products/sds2-home` sayfasında yayında (`src/data/sds2-2027-features.ts`, görseller mevcut); "2027 Home Page Information" ana sayfa SDS2 kartına işlendi (`src/data/homepage-2027-preview.json`: "SDS2 2027, ekibinize her iş akışında üretkenliği artıran, zaman kazandıran ve elle yapılan işi azaltan güçlü araçlar verir."). Önceki "SDS2 2027 sayfası yok" tespiti hatalıydı; düzeltildi.
- **Düzeltme (Rebar/Parametric):** Projede pazarlama belgeleri için zaten Türkçe taslaklar var (`scripts/inventory_units/*.py`, ör. `allplan_rebar.py`, `allplan_parametric.py`). İlk sürümde bunlara bakmadan kendi çevirimi yazmıştım; "altyapı/inşaat mühendisliği" gibi terimler tutarsızdı. İki veri dosyası artık bu taslaklardan üretildi ve `tests/test_rebar_parametric_pages.py` aynı olmalarını zorunlu kılıyor. Taslakta bir hata düzeltildi: "Kilit Allplan ve proje olaylarında…" → "Önemli Allplan ve proje olaylarında…" (key = önemli).
- **Açık:** envanter taslağı bu iki sayfa için `/products/allplan-rebar` ve `/products/allplan-parametric` rotalarını soruyordu (ya da `/solutions/rebar-engineering` ve `/solutions/features-allplan-bridge` genişletilsin). Şu an `/2027/rebar` ve `/2027/parametric` yayında; rota kararı kullanıcıda. Envanterdeki diğer açık sorular: 5×, 20–50%, %50 gibi sayısal iddiaların Türkiye'de yayın izni; SDS2 ana banner görseli (`Keyvisual2027_RelatedContent_SDS2.jpg`, kaynakta proje adı/firma maskeli).
- Kapılar: 378 test, 46/46 parite, 45/45 token, typecheck, build.

## 03.11.2026 — Rebar/Parametric sayfaları ortak kart kalıbına hizalandı (commitlendi)

- Tasarım tutarlılığı için `ProductEditionView` artık SCIA/FRILO'nun kullandığı `EditionCards` (bitişik çerçeveli ızgara, `+` maddeler) ve aynı sekme şeridiyle çizilir; kendi kart stili silindi. `EditionCards` iki isteğe bağlı özellik kazandı: `kicker` (varsayılan "SÜRÜMLER") ve kart içinde açıklama paragrafı veya {başlık, metin} maddeleri; mevcut SCIA/FRILO kullanımı değişmedi.
- Sayfa sırası SCIA ile aynı: hero, konu etiketleri, genel bakış kartları, sekme şeridi, avantajlar, özellikler, kapanış.
- **Kural (yeni sayfalar için):** yeni 2027 ürün sayfaları `ProductEditionView` + `EditionCards` kullanır; SDS2 ve FRILO Geotechnics aynı bileşenle yapılacak. SCIA/FRILO/Civil sayfalarının ortak şablona taşınması ayrı bir iştir (şu an her biri kendi kodunu taşıyor).
- Kapılar: 377 test, 46/46 parite, 45/45 token, typecheck, build; Rebar tarayıcıda SCIA ile karşılaştırıldı.

## 03.11.2026 — Bimplus 2027 maddeleri (commitlendi)

- **Değişti:** `/products/allplan-bimplus` sayfasındaki "BIMPLUS Nedir?" bölümünde, pazarlama klasöründeki `New Text BIMPLUS Page.docx` talimatı uygulandı: giriş cümlesi kaldı, eski 3 madde silindi, yerine "2027’de yeni:" başlığı ve 3 yeni madde (BCF 3.0 değişimi, odaklı model incelemeleri, Excel destekli BIM verisi) konuldu. Kaynak: `scripts/extract_structured_pages.py` (`parse_allplan_bimplus`); `pages.json` yeniden üretildi. Test: `tests/test_bimplus_page.py`.
- **Not:** Silinen üç madde ("Proje verilerine her yerden…", "Herhangi bir inşaat sektörü yazılımından…", "Tüm aşamalarda BIM tabanlı projeleri…") canlı sitedeki özgün maddelerdi; belge değiştirilmelerini açıkça istediği için kaldırıldı. Türkçe metin benim çevirim, onay bekliyor.
- Kapılar: 377 test, 46/46 parite, 45/45 token, typecheck, build; sayfa tarayıcıda doğrulandı.

## 03.11.2026 — Allplan Rebar ve Allplan Parametric sayfaları (commitlendi)

- **Eklendi:** `/2027/rebar` ve `/2027/parametric`. Kaynak: `Allplan 2027 Marketing Materials/ALLPLAN 2027 Launch…/Web Pages/` altındaki iki "Edition Web Page" belgesi (Git dışı). Metinler belgeden Türkçeye çevrildi (taslak çeviri; ürün ve özellik adları İngilizce bırakıldı). Yapı: hero, konu etiketleri, genel bakış kartları, avantajlar, 6 gruplu özellik listesi (her biri 30 özellik), kapanışta teklif butonu (Microsoft Forms). Paylaşılan bileşen `ProductEditionView`, içerik `src/data/allplan-{rebar,parametric}-2027.ts`.
- **Kayıt:** `RELEASE_2027_ROUTES` (metadata, JSON-LD, sitemap, llms.txt) ve `tests/test_release_2027_routes.py` güncellendi; yeni test `tests/test_rebar_parametric_pages.py`. Sürüm kapalıyken iki sayfa 404 verir (diğer 2027 sayfalarıyla aynı).
- **Açık:** (1) `/2027/rebar` ve `/2027/parametric` adresleri öneridir, onay bekliyor. (2) Belgelerde görsel yok; hero için mevcut görseller kullanıldı (Rebar: grup donatı görseli, Parametric: Civil hero). Özellik görselleri verilirse eklenir. (3) Belgedeki "Try Allplan Parametric" / "Talk to an Expert" butonları yerine yalnızca "Teklif isteyin" kondu (karar: tek hedef teklif). (4) Menü ve ana sayfadan bağlantı henüz yok. (5) İngilizce hero etiketleri ve Türkçe çeviri metinleri kullanıcı onayı bekliyor.
- Kapılar: 374 test, 46/46 parite, 45/45 token, typecheck, build; iki sayfa tarayıcıda açıldı, hata yok.

## 03.11.2026 — Teknik borç temizliği ve eğitim sayfalarının tamamen kaldırılması (commitlendi)

- **Kaldırıldı:** `/solutions-v2/training` altındaki kalan 4 sayfa (events, individual, e-learning, quick-start). Hepsi 308 ile `/kaynaklar`'a yönlenir (sürüm kapalıyken `/`); `removedRoutes` ve `REMOVED_ROUTES` kaydı güncel. Artık `/solutions-v2/training` altında yayımlanan sayfa yok; sayfa sonu bileşeni yalnızca `/video-kutuphanesi` önekini eğitim dönüşümüyle eşler. Üretilen sayfa sayısı 102.
- **Küçük düzeltmeler:** SSS kırıntısı "Ana Sayfa > Sıkça Sorulan Sorular"; kullanılmayan `directLinks` verisi üreteçten ve `navigation.json`'dan silindi; `llms.txt` paket karşılaştırma satırı sürüme göre ("PDF" yalnızca sürüm kapalıyken); üreteç çıktısındaki "Unique titles/descriptions" sayaçları kaldırılan sayfalardan sonra doğru sayıyı yazar; hiçbir sayfada kullanılmayan `Service` şeması (`schema.ts` dalı, üreteç kuralı, test) silindi.
- **D6 (bağlantı adları):** derlenmiş 119 sayfa tarandı; aynı adı taşıyıp farklı yere giden bağlantılar bulundu (Kaynaklar, arama sonuçları, ortak `MediaGridSection`, Scalypso, Civil ve FRILO sayfaları) ve hepsine ayırt edici `aria-label` eklendi. Kalıcı koruma: `tests/test_link_names.py`.
- **D7 (AX3000 doküman başlıkları):** 2026 kaynağı `documents.ts` ile üretilen 6 doküman 8 alan üzerinden karşılaştırıldı, fark yok; düzeltme gerekmedi.
- **D8 (harita/türev betiği):** `build_web_derivatives.py --check` geçiyor; harita onay kapılı ve başlıklı; düzeltme gerekmedi.
- **CSS borcu:** kullanılmayan `alu-yt-*` stilleri `application.css` ve üretilen `globals.css`'ten silindi (`test_app_styles.py` ve `--z-foreground` kullanım testi buna göre güncellendi); ilgili jetonlar için yukarıdaki açık maddeye bakın.
- Kapılar: 370 unit test, 46/46 parite, 45/45 token, typecheck, `styles:check`, build. Tarayıcı doğrulaması yapıldı (dev sunucusu yeniden başlatıldı): 4 kaldırılan sayfa ve webinar yönlendirmesi çalışıyor, SSS kırıntısı, Kaynaklar kart aria-label (21), video kütüphanesi alu-yt CSS içermiyor, arama 200, sunucu hatası yok.

## 03.11.2026 — Bim1Sohbet kayıtları eklendi (yerel, commitlenmedi)

- `@bim1sohbet65` kanalındaki Melih Dinekli yayınları tarandı: "BIMX5 Nedir" Bimfili kartına bağlandı, "Allplan Akıllı BIM Eklentisi ile İmar Yönetmeliği Uygulaması" (20 Ağustos 2022) ve "ALLPLAN ile Her Yerde ve Her Zaman Çalışma" (17 Ağustos 2022) yeni kart olarak eklendi; kartlarda kanal adı (Bim1Sohbet) alt başlık olarak görünür (`source` alanı). Kanalın diğer ~90 videosu genel BIM yayınları olduğu için eklenmedi.
- Kapılar: 364 unit test, 42/42 parite, 45/45 token, typecheck, build; tarayıcıda 17 kart, 13 video ve "BIMX5 Nedir" penceresi doğrulandı.

## 03.11.2026 — Webinar kayıtları YouTube'a bağlandı, classroom sayfası kaldırıldı (yerel, commitlenmedi)

- **YouTube:** Allplan Türkiye kanalı (`@AllplanTurkey`, 210 video) tarandı; 20 dakikadan uzun 12 video listelendi. 8 mevcut webinar kartı başlık ve tarihle eşleştirilip `youtubeId` ile bağlandı, kanalda olup kartlarımızda bulunmayan iki webinar eklendi: "Allplan Bridge 2022 Webinar" (19 Nisan 2022) ve "BIMX5 Kurum Rapor Eklentisi" (9 Temmuz 2021). Bu ikisi yerel poster yerine YouTube küçük resmini kullanır. Kartlar ortak `MediaGridSection`; videoya tıklayınca onay kapılı açılır pencere.
- **Kaldırıldı:** `/solutions-v2/training/classroom`; 308 ile `/kaynaklar`'a (sürüm kapalıyken `/`) yönlenir.
- Kapılar: 363 unit test, 42/42 parite, 45/45 token, typecheck, build; tarayıcıda video penceresi ve yönlendirme doğrulandı.

## 03.11.2026 — Webinar kartları ortak bileşene geçti, online eğitim sayfası kaldırıldı (yerel, commitlenmedi)

- **Webinar arşivi:** kendi satır tasarımım kaldırıldı; sayfa artık ortak `MediaGridSection` (`alu-media-card`) kartlarını kullanır. Video/görsel pencereleri `SubpageView` içinden ortak `MediaViewerDialogs` bileşenine çıkarıldı; `MediaGridWithViewer` bunu `SubpageView` dışındaki sayfalara taşır. "Arşivde" etiketi kalktı. Sayfa başlığı kaynaktaki gibi "Webinarlar", arşiv bölümü "Kaydedilmiş Webinarlar".
- **Kaldırıldı:** `/solutions-v2/training/online` üretilen veriden silindi; 308 ile `/kaynaklar`'a (sürüm kapalıyken `/`) yönlenir. `removedRoutes` bunu da kapsar.
- Kapılar: 361 unit test, 41/41 parite, 45/45 token, typecheck, build; tarayıcıda kartlar, görsel büyütme penceresi ve yönlendirme doğrulandı.

## 03.11.2026 — Video Kütüphanesi ve Kaydedilmiş Webinarlar kompakt tasarımı (yerel, commitlenmedi)

- **`/video-kutuphanesi`:** `VideoLibraryHubSection` yeniden yazıldı (ortak `CompactPageHero`, resmi kanal şeridi, 22 kartlık kompakt ızgara; iç listelerde "N Video" sayacı). Hero metinleri üreteçten (`video-library.json` içindeki `hero`). Hub artık genel alt sayfa hero'sunu göstermez (`SubpageView`). Kaynakta bağlantısı `#` olan 4 kart tıklanabilir değil, gri ikonlu ve eylemsiz.
- **`/kaydedilmis-webinarlar`:** webinarlar iri 16:9 kartlar yerine 2 sütunlu kompakt satırlar (144×81 küçük resim).
- **Hata düzeltmesi:** adres taşımasından sonra hub iç listeleri `'/solutions-v2'` önekiyle tanıdığı için iç bağlantı sanmıyordu; `startsWith('/')` ile düzeltildi ve teste bağlandı.
- **Kalan borç:** eski `alu-yt-*` CSS kuralları ve tokenları artık kullanılmıyor ama `test_app_styles.py` tarafından doğrulandığı için silinmedi; temizlik ayrı iş.
- Kapılar: 359 unit test, 40/40 parite, 45/45 token, typecheck, build; masaüstü ve 375 px tarayıcı doğrulaması.

## 03.11.2026 — Eğitim sayfaları yeniden düzenlendi (yerel, commitlenmedi)

- **Kaldırıldı:** `/solutions-v2/training` (eğitim ana sayfası) ve `/solutions-v2/training/webinar` üretilen veriden silindi (`REMOVED_ROUTES`, `scripts/generate_site_data.py`). Eski adresler 308 ile yönlenir: eğitim ana sayfası `/kaynaklar`, webinar sayfası `/kaydedilmis-webinarlar`; 2027 sürümü kapalıyken (geri alma) ikisi de `/`'a gider. Kaynaklar'daki "Eğitim" kartı ve mobil menüdeki "Eğitim & Webinar" bağlantısı kaldırıldı; yalnız eğitim ana sayfasına özel `TrainingTabs` bileşeni silindi. Parite araçları `removedRoutes` ile bunları tanır.
- **Eklendi:** `/egitim-merkezlerimiz` (Eğitim İş Ortaklarımız: 5 üniversite, IMO Ankara ve LGN Proje Akademi; içerik `src/data/education-partners.ts`) ve `/kaydedilmis-webinarlar` (13 kayıtlı webinar, genel bakış, kazanımlar, hedef kitle, çağrı; içerik `src/data/recorded-webinars.ts`, eski sayfanın 2026 kaynağından). İkisi de 2027 sürümüne bağlı rotalar (metadata, JSON-LD, sitemap). Ortak `CompactPageHero` Kaynaklar sayfasıyla paylaşılır.
- **E-posta düzeltmesi:** LGN'in e-postası `info@lgnprojeakademi.com` (2026 kaynağı ve kullanıcı teyidi). Eski eğitim sayfası verisindeki `info@aluplan.com.tr` yanlış dönüşmüştü; sayfa silindi.
- Kapılar: 350 unit test, 40/40 parite, 45/45 token, typecheck, build, production sunucu yoklaması ve tarayıcı doğrulaması.

## 03.11.2026 — Video kütüphanesi SEO uyumlu adrese taşındı (yerel, commitlenmedi)

- `/solutions-v2/training/video-library` ve altındaki 14 oynatma listesi `/video-kutuphanesi` ve `/video-kutuphanesi/<liste>` adreslerine taşındı; eski adresler `:path*` ile 308 yönlenir (`next.config.mjs`). Taşıma üreteçteki `ROUTE_PREFIX_RENAMES` ile üretim sonrası uygulanır; kaynak envanter eşleşmesi `tests/fixtures/sitewide_parity_policy.json` içindeki `routePrefixRenames` ile yapılır (doğrulayıcılar ve parite betiği önek kuralını bilir).
- Sayfa sonu bileşeni, taşınan sayfalar için eğitim dönüşümünü korur (`/video-kutuphanesi` öneki). Sitemap, canonical, arama dizini, kırıntı ve `llms.txt` yeni adresi kullanır.
- Kapılar: 326 unit test, 38/38 parite, 45/45 token, typecheck, build ve production sunucu yoklaması (yeni adresler 200, eski adresler 308).

## 03.11.2026 — Açık maddeler (kullanıcı: "sonra bakacağız")

- **Kaynaklar sayfası:** mobil menüye "Kaynaklar" eklendi; Öğren/Bilgi kartlarında ikonlar sağ üst köşede, zeminsiz (lisans satırlarındaki kutulu ikonlar aynen kaldı). `/kaynaklar` adresi öneridir, onay bekliyor.
- **Kaynaklar yeni kartlar:** "Video Kütüphanesi" (`/video-kutuphanesi`), "Kaydedilmiş Webinarlar" (`/kaydedilmis-webinarlar`) ve "Eğitim Merkezleri" (`/egitim-merkezlerimiz`) bağlantıları kesin. Video Kütüphanesi ve Eğitim Merkezleri kartlarının açıklama/buton metni hâlâ geçici (Kaydedilmiş Webinarlar açıklaması eski sayfanın kendi metninden). Kaynak: `scripts/generate_site_data.py` içindeki `ADDED_SERVICES`. Sürüm kapalıyken eski ana sayfa bölümü de bu üç kartı gösterir (sayı 22).
- **Kayıtlı webinarlar:** 19 karttan 15'inin YouTube kaydı bağlı: Allplan Türkiye kanalı (`@AllplanTurkey`) ve Bim1Sohbet kanalı (`@bim1sohbet65`, Ahmet Melih Dinekli yayınları). "BIMX5 Nedir?" kaydı, kartımızın açıklamasıyla birebir aynı olduğu için Bimfili kartına bağlandı. Kaydı bulunamayan 4 webinar: IMO / ALLPLAN BRIDGE 2022, IMO / ALLPLAN ENGINEERING 2022, BIMX5 - Genel, Görsel Komut Dosyaları (Visual Scripting; kanalda yalnızca 2,5 dakikalık bir klip var). Bağlantı verilirse `youtubeId` alanı yeterli. Teyit gerektirenler: "2B DWG Converter" kartı 6 Temmuz 2021, kayıt başlığı 8 Temmuz; "BIMX5 Kurum Rapor Eklentisi" (9 Temmuz) "BIMX5 - Genel" ile aynı etkinlik olabilir; Bim1Sohbet'ten eklenen iki kartın tarihi YouTube yükleme tarihidir (gerçek yayın tarihi bilinmiyor). SCIA Engineer (Nisan 2026) ve Bridge Conference 2026 (Temmuz 2026) videoları webinar değil, ama kullanıcı isteğiyle arşivin başına eklendi (tarihleri yalnızca ay düzeyinde).
- **LGN logosu:** karar: logosuz kalır (sayfada yalnızca metin kartı; dosya gelirse eklenir).
- **AX3000 Mekanik Tesisat:** karar: "Modüller" başlığı kaldırıldı (bölüm erişilebilirlik için `aria-label` taşır), kartlar kaldı.
- **BIMFlex özel video (B3):** karar: kart `/solutions/bimflex` sayfasında kalır; videoyu (`Qyy_hRNkOtY`) herkese açması için video sahibine söylenecek (kullanıcı).
- **Doğrulanmamış iddialar (C1):** üreticiden bilgi bekleniyor.
- **Bağlantı farkları D bölümü (B5):** `docs/verification/main-link-gap-2026-11-02.md` kullanıcıyla tek tek gözden geçirilecek.
- **Kullanılmayan YouTube jetonları:** eski `alu-yt-*` stilleri silindi; `design-system/tokens/tokens.json` içindeki `youtube*` görsel/boyut/gölge/dönüşüm jetonları (ve onlardan üretilen CSS değişkenleri) artık hiçbir stilde kullanılmıyor. Canonical tasarım sistemi dosyası olduğu için silinmedi; temizlik ayrı ve onaylı bir iş.
- **Sonraki fazlar (E1–E3):** ortak bileşen taşıması, premium hareket, mobil video.
- **Yayın:** `codex/prelaunch-decisions` kullanıcının açık izniyle 03.11.2026'da `origin`'e push edildi (yeni dal; Vercel'in otomatik dal dağıtımına bırakıldı, deploy sonucu kullanıcı tarafından kontrol edilecek); PR açılmadı, PR #3 ile ilişkisi, Vercel ortam değişkenleri (`ALUPLAN_SHOW_2027`, `ALUPLAN_BLOCK_INDEXING`; eski `ALUPLAN_2027_PREVIEW` kaldırılmalı), Vercel Analytics ve deploy kullanıcıda.

## 03.11.2026 — Kaynaklar sayfası yayında (yerel, commitlenmedi)

- Kaynaklar sayfası kalıcı olarak `/kaynaklar` adresinde (`ResourcesDirectory`, içerik `homepage.json` hizmet verisinden; Partner gizli, 19 kaynak, üç kategori). Geçici `/preview/kaynaklar` rotası kaldırıldı.
- 2027 sürümü açıkken: ana menüdeki "Kaynaklar" `/kaynaklar`'a gider, ana sayfadaki "Profesyonel Hizmetler" bölümü gösterilmez, sayfa sitemap'e ve release metadata/JSON-LD kaydına girer. Sürüm kapalıyken (geri alma): menü `/#professional-services`'e döner, ana sayfa bölümü geri gelir, `/kaynaklar` 404 verir.
- Mobil çekmecede "Kaynaklar" bağlantısı yok (daha önce de yoktu); eklemek ayrı karar. `navigation.json` içindeki `directLinks` verisi arayüzde kullanılmadığı için dokunulmadı.
- Test: `tests/test_resources_page.py`. Kapılar: 317 unit test, 37/37 parite, 45/45 token, typecheck, iki sürüm ayarında production build ve sunucu yoklaması.

## 03.11.2026 — AX3000 Mekanik Tesisat kompakt tasarımı (yerel, commitlenmedi)

- `/solutions/ax3000-mekanik-tesisat` için kullanıcı onaylı kompakt tasarım uygulandı: `Ax3000MechanicalContent` (+ CSS modülü) sayfa verisinden render eder; 28 kartlık ızgara yerine genel bakış, hızlı hesaplama, veri arayüzü şeridi, modül ızgarası ve Enerji Kimlik Belgesi/Dokümanlar çifti. Hero, kırıntı, bağlantı ve sayfa sonu bileşenleri ortak olanlardır. Sayfa verisi, URL ve bağlantılar değişmedi.
- Gösterilmeyenler: H1'i tekrarlayan ilk kart, "AX3000 Doküman Merkezi" artığı ve liste işaretleri. "Modüller" başlığı kaynakta yok, tasarım eklemesidir (kullanıcı onayı bekliyor).
- Test: `tests/test_ax3000_mechanical_layout.py` kaynak metin ve bağlantıların tamamının sayfada kaldığını doğrular. Kapılar: 308 unit test, 37/37 parite, 45/45 token, typecheck, build. Dev sunucusunda masaüstü ve 375 px doğrulandı.

## 03.11.2026 — Rota adları, S.S.S. menüsü ve AX3000 dokümanları (yerel, commitlenmedi)

- `/paket-karsilastirma` artık 2027 karşılaştırma sayfası (`src/app/paket-karsilastirma/`). `/2027/compare` ve PDF adresleri 308 ile buraya gider. Sürüm bayrağı kapalıyken aynı adres eski sayfayı sunar; sitemap'te tek kayıt var.
- `/solutions-v2/faq` → `/faq` (308). Yeniden adlandırma `scripts/generate_site_data.py` içindeki `ROUTE_RENAMES` ile üretim sonrası uygulanır; kaynak envanter karşılaştırmaları `tests/fixtures/sitewide_parity_policy.json` içindeki `routeRenames` ile eşlenir. Menüde "S.S.S." Hakkımızda ile İletişim arasında (`SiteShell.tsx`, masaüstü ve mobil).
- AX3000 dokümanları sayfasında hero altındaki iki kart gizlendi; Yapı Fiziği ve Virtual Reality sayfalarına doküman bağlantısı eklendi (`SubpageView.tsx`).
- Kapılar: `pnpm test` (302 unit test, 37/37 parite, 45/45 token), typecheck, iki bayrak ayarında build. Dev sunucusunda tüm sayfalar ve mobil menü doğrulandı.
- Açık: FAQ sayfasının kırıntısı hâlâ "Ana Sayfa > Çözümler > SSS"; `llms.txt` karşılaştırma satırı hâlâ "PDF" diyor.

## 03.11.2026 — D4: istemci paketinden sayfa verisinin çıkarılması (yerel, commitlenmedi)

- `codex/prelaunch-decisions` dalında yarım kalan D4 tamamlandı. İstemci bileşenleri ve onların içe aktardığı yardımcı modüller artık `@/lib/site-data`'yı yalnız tip için içe aktarıyor. Sabitler, navigasyon, ana sayfa ve arama dizini `src/lib/site-shared.ts` modülünden; oynatma listeleri ve video kütüphanesi `src/lib/playlist-data.ts` modülünden geliyor. `site-data.ts` hepsini aynı adlarla dışa aktarmayı sürdürüyor; sunucu tarafı değişmedi.
- Sonuç: en büyük istemci chunk'ı 1,73 MB'tan 229 KB'a indi; istemci chunk'larında `bodyNodes` (sayfa gövdesi) kalmadı.
- Test: `tests/test_client_bundle_data.py`; artık `src/components` altındaki direktifsiz bileşenleri ve `.ts` yardımcılarını da tarıyor. `tests/site_data_runtime_loader.mjs`, `schema_runtime.mjs` ve `page_end_conversion_runtime.mjs` harness'larının ortak yükleyicisi oldu. `test_forms_transition.py`, form adresini yeni konumunda (`site-shared.ts`) doğruluyor; adres değişmedi.
- Kapılar: `pnpm test` (292 unit test, kaynak sözleşmesi, 36/36 parite, stil kontrolü, 45/45 token), typecheck ve bayraklı production build geçti. Dev sunucusunda ana sayfa, video kütüphanesi, arama ve SSS sayfaları konsol hatası olmadan render edildi.
- Commit ve push kullanıcı onayı bekliyor.

## 03.11.2026 — Yayın öncesi sağlamlaştırma (16 geliştirme maddesi)

- `codex/prelaunch-hardening` dalında (PR #3 dalının üzerinde) kullanıcının onayladığı H1–H8 kararlarıyla 16 madde ele alındı.
  - Ana sayfanın referans verdiği toplam boyut 20,1 MB'tan 5,6 MB'a indi.
  - `/2027/max` sayfasında mobilde video indirmesi 0'a indi.
  - GA4, Vercel ölçümleri ve YouTube/Maps gömmeleri çerez onayına bağlandı. CSP, GA4 veri gönderimine izin verecek şekilde düzeltildi.
  - Kırık YouTube kanal bağlantısı, allplan.com'un verdiği adresle değiştirildi.
  - Statik dosyalara 7 gün önbellek eklendi; Node sürümü her yerde 24.
  - Erişilebilirlik düzeltmeleri: kontrast, tablo ARIA, iletişim başlığı.
- Plan: `docs/superpowers/plans/2026-11-03-prelaunch-hardening.md`. Kanıt: `docs/verification/prelaunch-hardening-2026-11-03.md`.
- D2 (CSP `unsafe-inline`) ve D3 (`access-control-allow-origin: *`) kod değişmeden kabul edilen risk olarak belgelendi.
- **Kullanıcı kararı bekleyenler:**
  - BIMFlex videosu YouTube'da özel; kart kaldırılsın mı?
  - YouTube kartının metni.
  - Onayı geri çekme arayüzü.
  - AI görsellerinin hakları.
  - Vercel Analytics'in panelden etkinleştirilmesi.
- Push, PR ve deploy kullanıcı onayı bekliyor.

## 02.11.2026 — Yayın öncesi engeller E1–E5 kapatıldı (yerel)

- Bağımsız inceleme raporundaki beş yayın engeli `codex/prelaunch-blockers` dalında kapatıldı: önizleme bayrağı `ALUPLAN_SHOW_2027` ve `ALUPLAN_BLOCK_INDEXING` olarak ayrıldı; 2027 rotalarına canonical, OG ve JSON-LD eklendi, rotalar sitemap'e girdi; ürün, eklenti, eğitim ve AX3000 kart bağlantıları, AX3000 doküman indirmeleri ve lisans operasyon bağlantıları kaynaktan geri getirildi.
- Plan: `docs/superpowers/plans/2026-11-02-prelaunch-blockers.md`. Kanıt: `docs/verification/prelaunch-blockers-2026-11-02.md`. Kalan bağlantı farkları: `docs/verification/main-link-gap-2026-11-02.md`.
- Kapılar: 224 unit test, 36/36 parite, 45/45 token, typecheck, iki bayrak ayarında production build ve `pnpm audit --prod` geçti. Yerel production'da masaüstü ve 375 px tarayıcı kabulü yapıldı.
- **Deploy öncesi zorunlu:** Vercel'de Preview ve Production için `ALUPLAN_SHOW_2027=1` ve `ALUPLAN_BLOCK_INDEXING=1` tanımlanmalı, ardından `ALUPLAN_2027_PREVIEW` kaldırılmalı. Eski değişken tek başına kalırsa `next.config.mjs` build'i bilerek durdurur. Vercel'de Preview ortamında bayrak tanımlı olmadığı için PR önizlemesi eski ana sayfayı gösteriyor (Vercel önizlemeyi kendi `noindex` başlığı ve kimlik doğrulamasıyla koruyor).
- 03.11.2026: PR https://github.com/hazarvolga/aluplan-2027/pull/3 açıldı (`main` hedefli, 3/3 kontrol geçti, birleştirilebilir). Merge, deploy ve Vercel ortam değişikliği kullanıcıda.
- 03.11.2026: kullanıcı kararıyla `/2027/compare` sayfasındaki "Bu yerel inceleme… doğrulanmalıdır." notu kaldırıldı; "Sürüm bağlantıları mevcut yerel ürün sayfalarına gider." cümlesi kullanıcı kararıyla korundu.
- 03.11.2026: kullanıcı kararıyla ürün yaşam döngüsü sayfası `/product-lifecycle` adresine taşındı (eski `/preview/product-lifecycle` 308 yönleniyor); indekslenebilir metadata, JSON-LD ve sitemap kaydı eklendi.
- Açık kararlar: 2027 başlık/açıklama metinleri (K3), `/2027/features` H1'i, bağlantı farkı D bölümü, AI/FRILO OG görselleri.

## 02.11.2026 — Ara verme ve bağımsız yayın öncesi inceleme

- Proje, Vercel üzerinde firma içerik incelemesine açıktır: https://aluplan-2027.vercel.app/. Bu adres gerçek alan adına geçiş anlamına gelmez; 02.11.2026 kontrolünde ana sayfa HTTP 200 ve `X-Robots-Tag: noindex, nofollow` döndürdü. `aluplan.com.tr` üzerinde yeni sürümün yayına alındığı doğrulanmadı.
- Yerel çalışma dalı `codex/page-end-conversion-design` son commit `2103e3b`; yerel `origin/main` referansı `04680a4` ve bu commit çalışma dalını içeriyor. Bu tespit yerel Git referansına aittir; bu oturumda uzak sunucudan fetch ve Vercel deployment–commit eşlemesi yapılmadı.
- Ana sayfa hero ve ALLPLAN ürün sekmesi `/2027/features` hedefine yönelir; mevcut `/products/allplan` rotası korunmuştur. Önceki tarihli, sekmenin başka hedefe gittiğini söyleyen notlar tarihsel kayıttır. Karşılaştırma butonları ve üretim bayrağı dahil tüm hedefler bağımsız olarak yeniden taranmalıdır.
- Vercel'de ana sayfanın altı ürün sekmesinin görselleri masaüstü tarayıcıda yüklendi ve sekme geçişleri gözlendi. Bu, tüm cihazlarda görsel kabul veya bütün sayfaların kaynakla eşleştiği anlamına gelmez.
- Son kayıtlara göre 189 test, typecheck ve bayraklı build geçti; bunlar önceki oturumun sonuçlarıdır, bu dokümantasyon güncellemesinde yeniden çalıştırılmadı. Max videolarının tamamının oynatılması, kaynak içerik/medya eşleşmesi ve kullanım hakları, form ve CTA hedefleri, SEO/indexleme ve gerçek alan adı yayın planı ayrıca doğrulanmalı.
- Çalışma ağacında daha önceden var olan `next-env.d.ts` değişikliği ve takip edilmeyen `.claude/` bulunuyor; inceleyen ajan bunları korumalı. Bu oturumda handoff ve inceleme istemi dışında kod değişikliği yapılmadı. Bu belge güncellemeleri henüz commitlenmedi veya push edilmedi.
- Sıradaki adım: `docs/verification/prelaunch-independent-review-prompt.md` istemiyle salt-okunur bağımsız inceleme yaptırmak; bulguları değerlendirip düzeltmeleri ve gerçek yayın adımlarını ayrıca planlamak.

## 29.10.2026 — ALLPLAN Max hero önizleme taslağı

- Partner kategorisi kaldırılırken hot reload ile eski seçili sekme indeksi korunabildiği için oluşan `serviceTitles` runtime hatası giderildi: geçersiz seçim ilk görünür gruba güvenle düşer ve boş grup durumu kontrol edilir.
- Kullanıcı isteğiyle Profesyonel Hizmetler alanında Partner erişimi kategorisi ve tek listedeki Partner kaydı yalnız 2027 önizlemesinde kaldırıldı; kalan 19 kaynağın sayacı güncellendi, mevcut ana sayfa korunur.
- Kullanıcının isteğiyle 2027 ana sayfa önizlemesindeki “Teknik Özellikler / Q3 2026 Matrisi” bölümü gizlendi. Mevcut ana sayfadaki bölüm, kaynak veriler ve PDF dosyası korunuyor.
- Kullanıcı yuvarlatılmış buton istemediğini tüm site için netleştirdi. `semantic.radius.button` sıfır değerli bağımsız token olarak tanımlandı; ortak buton aliası ve uygulamadaki buton kontrolleri bunu kullanır. Form input radiusu ve dekoratif noktalar ayrı kalır.
- Kullanıcı isteğiyle 2027 hero butonları daha kompakt ölçüye alındı, köşeleri sıfırlandı; asgari etkileşim hedefi korunur. Değişiklik yalnız önizleme hero'sunu etkiler.
- Kullanıcının isteğiyle 2027 hero'nun en üstündeki “2027 YENİLİKLERİ” ve “ALLPLAN 2027” kutulu etiketleri kaldırıldı; üst başlık ve ana başlık korunur.
- Kullanıcı tekrarlanan MAX odağı yerine genel ALLPLAN 2027 yeniliklerinin hero'da anlatılmasını onayladı. Başlık ve açıklama `allplan-2027-features.md` giriş bandındaki TR taslaktan alınarak önizlemeye taşındı; FRILO kullanıcı kapsamı gereği çıkarıldı. MAX alt sekmede varsayılan açık kalır; yenilikler CTA'sı yerel sayfa hazır olana kadar kullanıcının verdiği üretici URL'sine yönlenir.
- Hero altındaki beş ürün bandı sekmelere dönüştürüldü; ALLPLAN Max varsayılan açık, panel içinde envanter kaynak ID'li açıklamalar ve geçerli keşif bağlantıları bulunur. Klavye ile sekme geçişi ve hareket azaltma desteği eklenmiştir. Yalnız önizleme varyantında çalışır.
- Kullanıcının verdiği ALLPLAN hero altı bant örneği, FRILO hariç beş ürün ve Türkçe açıklamalarıyla yalnız önizlemede uygulandı. ALLPLAN, Civil ve SDS2 mevcut yerel rotalara; Max ve SCIA yerel sayfaları hazır olana kadar mevcut resmî üretici adreslerine gider. Ürün rota/IA kararları hâlen açıktır.
- MAX önizleme başlığı daha küçük `--type-h2-size` ölçeğine alındı ve mevcut hero'nun 14ch genişlik sınırı önizlemede genişletildi; masaüstünde iki satır hedeflenir, dar ekranlarda metin doğal kırılır.
- Kullanıcı ilk üretilen görseli yoğun buldu; daha sade bina/dijital ikiz görseli üretildi. Yeni orijinal `assets/source/generated/heroes/max/allplan-max-hero-v2-original.png`, web türevi `public/assets/previews/home-2027/allplan-max-generated-v2.jpg`. Hero sağa yaslanıp sola maskeyle karışır; üst satır büyütüldü, H1 küçültülüp iki satıra ayrıldı. İlk görsel korunuyor, görsel/mobil kabul bekliyor.
- Kullanıcı hero metnini ikiye ayırdı: üst satır “Mühendislik için yapay zekâ”, H1 “Sadece otomatikleştirmeyin, yenilik geliştirin”. Önizlemeye özel yeni köprü/dijital ikiz görseli built-in imagegen ile üretildi; yüksek çözünürlüklü orijinal `assets/source/generated/heroes/max/allplan-max-hero-v1-original.png`, web türevi `public/assets/previews/home-2027/allplan-max-generated-v1.jpg`. Önceki üretici dosyaları silinmedi. Görsel tasarım onayı bekler; AI görseli gerçek proje veya mühendislik doğruluğu iddiası değildir.
- Kullanıcının 29.10.2026'da paylaştığı ALLPLAN ana sayfa MAX hero ekran görüntüsündeki başlık ve açıklama, mühendislik terminolojisiyle Türkçeye çevrilerek önizlemeye işlendi. Kaynak, ürün detay sayfasındaki hero metninden farklıdır; CTA hedefleri korunmuştur.
- Kullanıcı, 2027 ana sayfasında altı slayt yerine tek Allplan Max hero yönünü seçti. Başlık ve açıklama `docs/content-2027/allplan-canlı/allplan-max.md` dosyasındaki `live.max.hero.*` TR taslak satırlarından alınarak `src/data/homepage-2027-preview.json` içinde tutuldu.
- `Homepage2027PreviewView` yalnız önizlemeye özel hero varyantını açar; ana `/` mevcut hero'yu korur. MAX keşif CTA'sı yerel ürün sayfası hazır olana kadar üreticinin `https://www.allplan.com/allplan-max/` sayfasına, teklif CTA'sı mevcut Microsoft Forms hedefine gider.
- Üretici envanterindeki masaüstü ve mobil hero görselleri yerel önizlemede kullanıldı; SHA-256 ve izin durumu `docs/brand/assets-license-log.md` içinde kayıtlı. Yayın izni doğrulanmadı. "Her 2027 ürününe dahildir" üreticinin envanterdeki iddiasıdır; Türkiye'deki ticari kapsam yayın öncesi doğrulanmalıdır.
- Kullanıcının tespit ettiği hero katman sorunu, önizleme içeriği `--z-content` ve dekoratif karartma `--z-scrim` seviyesine açıkça yerleştirilerek düzeltildi; karartma işaretçi olaylarını da almıyor.
- Sıradaki adım kullanıcıyla yerel hero görseli ve metnini gözden geçirmek; MAX detay sayfası henüz oluşturulmadı.

## 29.10.2026 — Yerel 2027 ana sayfa önizleme rotası

- Mevcut `/` ana sayfası değiştirilmeden restore ref oluşturuldu: `restore/pre-home-2027-preview-20261029` → `77bfccf`.
- Yeni yerel önizleme rotası `src/app/preview/home-2027/page.tsx` altında kuruldu. Rota, sonraki 2027 değişikliklerini public görünümden ayıran `Homepage2027PreviewView` giriş noktasını kullanır; bu sınır şimdilik mevcut `HomepageView` bileşenini ve mevcut tek veri kaynağını yeniden kullanır. JSX, homepage verisi veya JSON-LD kopyası üretmez.
- `/preview/home-2027` geliştirme ortamında ana sayfayla aynı 8 bölüm, aynı H1 ve aynı 97 bağlantıyı render eder. Metadata `noindex, nofollow, nocache`; rota navigation, `pages.json` ve sitemap dışında tutulur.
- Production ortamında rota `notFound()` ile içerik sunmaz. Yerel production server kabulünde `/` → HTTP 200, `/preview/home-2027` → HTTP 404 ve preview HTML içinde ana sayfa H1'i yoktur.
- TDD sözleşmesi `tests/test_home_2027_preview.py`: önizleme izolasyonu, noindex/production guard, sitemap/navigation/data dışılığı ve ana `/` otoritesinin korunmasını doğrular.
- Tam kapılar: 186 unit test, 4 kaynak sözleşmesi, 36/36 faz paritesi, 45 token testi, 188 kontrast kontrolü, typecheck ve 119 sayfalık production build geçti. In-app browser Work ayarlarında devre dışı olduğundan görsel tarayıcı otomasyonu kullanılamadı; çalışan dev HTML paritesi gerçek HTTP yanıtları üzerinden doğrulandı.
- Önizleme adresi: `http://127.0.0.1:3001/preview/home-2027`. Kullanıcı değişiklik listesini iletene kadar içerik, bölüm sırası ve tasarım değiştirilmemiştir. Push/deploy/canlı değişikliği yoktur.

## 29.10.2026 — Hero aileleri 99 route üzerinde yerel olarak entegre edildi

- Kullanıcının temas sayfasında onayladığı `VF-00`–`VF-08` görsel ailesi, içerik ve schema katmanlarından bağımsız `src/components/sections/subpage-hero-presentation.ts` politikasıyla uygulandı. Kapsamdaki **99/99** route açıkça eşlenir; yinelenen route modül yüklenirken hata verir ve bağımsız fixture uygulamadaki route haritasıyla birebir karşılaştırılır.
- `VF-00`–`VF-07` için masaüstü ve mobil türevler responsive `<picture>` ile seçilir. `VF-08` yıllık sürüm rotaları mevcut resmî/kaynak görsellerini korur. Kapsam dışındaki Hakkımızda ve yasal sayfalar framed fallback sunumunu sürdürür.
- Hero bileşeninde yalnız sunum değişti; H1, breadcrumb, açıklama, CTA hedefleri, kaynak içerik kaydı, URL ve JSON-LD/schema verisi değiştirilmedi. Eski kaynak hero, background-only rotalarda ikinci ağ isteği oluşturmaması için DOM'a gizli `<img>` olarak basılmaz; parite veri/test katmanında korunur. Responsive aile görselleri Next.js `getImageProps()` ile optimize `srcSet` üretir.
- Yerel CDP taraması 99 masaüstü + 99 mobil görünümde aile kimliği, doğru `currentSrc`, tek H1, kırık görsel yokluğu ve yatay taşma yokluğunu doğruladı; hata `0`. Temsilî masaüstü görsel kontrolü Mimari, Altyapı, Diğer Çözümler ve Eğitim rotalarında; mobil kontrol Mimari rotasında yapıldı. Kanıt: `docs/verification/hero-family-browser-audit-2026-10-29.json`.
- Tam kapılar: 182 unit test, 4 kaynak sözleşmesi, 36/36 faz paritesi, 45 token testi, 188 kontrast kontrolü, typecheck ve 118 sayfalık production build geçti. Build canlıya alınmadı; push/deploy/canlı değişikliği yoktur.
- Code/security re-review blocking bulgu vermedi. Non-blocking bakım notu: interaktif 99×2 CDP kabul döngüsünü ileride repo-owned script haline getirmek ve uzun route dizilerini yalnız okunabilirlik amacıyla çok satırlı biçime taşımak.
- Sıradaki insan kabulü, yerel sitede aile bazlı görsel dilin son kontrolüdür. Yeni istisna görsel yalnız semantik temsil, responsive kırpma, erişilebilirlik veya dönüşüm gerekçesi belgelenirse açılmalıdır.

## 29.10.2026 — Hero aile görselleri üretildi; rota entegrasyonu onay bekliyor

- Onaylanan aile planındaki yedi eksik görsel (`VF-00`, `VF-02`–`VF-07`) built-in `image_gen` ile aile başına tek çağrıda üretildi. Mevcut onaylı mimari prototip `VF-01` olarak aynı arşiv yapısına kopyalandı; toplam sekiz aile adayı hazırdır.
- Yüksek çözünürlüklü PNG orijinaller `assets/source/generated/heroes/families/`, masaüstü ve deterministik sağa yaslı `4:5` mobil JPEG türevleri `public/assets/heroes/families/` altında saklanır. Orijinaller başka işlerde yeniden üretim gerektirmeden kullanılabilir.
- Boyut, dosya büyüklüğü ve SHA-256 kayıtları `assets/source/generated/heroes/families/manifest.md`; sağlayıcı, kullanım amacı, hak/lisans dayanağı ve yayın durumu `docs/brand/assets-license-log.md` içinde tutulur. Hak/şart doğrulaması ve site geneli yayın onayı beklemededir.
- Karşılaştırmalı masaüstü/mobil önizleme `docs/previews/hero-family-contact-sheet/index.html` altında hazırlandı. `VF-05` teknik olarak geçerli olmakla birlikte bina-merkezli kompozisyonu nedeniyle `VF-07` ile görsel ayrışma kontrolüne açık bırakıldı; otomatik ikinci üretim yapılmadı.
- Asset sözleşmesi sekiz PNG orijinali, on altı JPEG türevi, dosya imzalarını, responsive en-boy oranlarını, manifest hash eşliğini, temas sayfası kapsamını ve Git takibini doğrular (`tests/test_hero_family_assets.py`).
- Makine-okunur `crop-recipes.json`, her türevin kaynak-piksel koordinatını ve JPEG kalite ayarını kaydeder; test mobil kırpmaların tam yükseklik ve sağa yaslı olduğunu doğrular. Son kontrol: 177 unit test, 36 faz paritesi, 45 token testi, 188 kontrast kontrolü ve typecheck geçti. Code/security re-review Critical/High/Medium bulgu vermedi.
- Bu fazda route eşleme, içerik, schema veya hero bileşeni değiştirilmedi. Sıradaki karar temas sayfasındaki sekiz ailenin görsel onayıdır; onaydan sonra aile–route sunum politikası ayrı fazda uygulanacaktır.

## 29.10.2026 — Yedi hero ailesi için prompt briefleri

- Kullanıcı route–görsel ailesi tablosunu onayladı; sonraki adım olarak yalnız prompt-brief fazına geçildi. `imagegen` skillinin prompt sözleşmesine göre `docs/hero-visual-prompt-briefs.md` hazırlandı.
- Ortak sanat yönetimi: 16:9 geniş kadraj, solda %45 sakin/koyu metin güvenli alanı, sağda ana konu, antrasit/graphite temel, kontrollü teal-cyan teknik vurgu, gerçekçi AEC malzemeleri ve sahte UI/logo/metin yasağı.
- Art-direction review sonrası responsive sözleşme somutlaştırıldı: masaüstü `1440×520` mevcut `contain/right` sunumu ve `0/28/82/100%` maskeyi; tablet `1024×520` focal-X kontrollü `cover` sunumunu; mobil `390×640` ise aynı orijinalden tam yükseklik ve sağa yaslı `x=55–100%, y=0–100%` kırpma ile üretilen deterministik `4:5` türevi ve CSS-owned dikey fade'i test eder. Mobil türev başarısızsa ayrı üretim otomatik yapılmaz, yeniden onay gerekir.
- Her yedi prompt bloğu artık tek başına çalışacak şekilde logo/trademark/UI/metin ve baked gradient/scrim/vignette yasağını tekrarlar. Fade yalnız CSS katmanında üretilir.
- Marka kılavuzundaki kaynak/lisans izi için `docs/brand/assets-license-log.md` oluşturuldu ve mevcut `VF-01` prototipi ilk kayıt olarak işlendi; kaynak/provider alanlarından ayrı hak/lisans dayanağı ve doğrulama durumu tutulur. Yeni ailelerde manifest ile birlikte bu kayıt zorunludur.
- Yedi eksik aile için ayrı üretim promptu ve kabul sinyali tanımlandı: `VF-00`, `VF-02`, `VF-03`, `VF-04`, `VF-05`, `VF-06`, `VF-07`. Mevcut onaylı `VF-01` görsel kalite ve kompozisyon referansıdır.
- Üretim sırası maliyet ve tekrar azaltacak şekilde aile başına tek built-in `image_gen` çağrısıdır; başarısız aile yalnız hedefli tek değişiklikle yeniden denenir. CLI/API fallback planlanmadı.
- Henüz yeni görsel üretilmedi, asset taşınmadı ve site geneli route eşleme kodu yazılmadı. Sıradaki karar prompt setinin görsel üretim için onayıdır.

## 29.10.2026 — Hero görsel aile planı

- Kullanıcı, her route için ayrı görsel yerine üst çözüm ve ürün aileleri altında ortak hero görselleri kullanılmasını onayladı. Plan `docs/hero-visual-family-plan.md` dosyasına kaydedildi.
- Güncel `src/data/pages.json` içinde `section` değeri `products`, `solutions`, `solutions-v2`, `training` veya `video-library` olan rotaların **99/99** adedi ortak görsel ailesine açıkça atandı; eksik rota `0`.
- İlk varlık kapsamı sekiz ortak görsel ailesidir: ekosistem, bina tasarımı, altyapı/Civil, inşaat/imalat, eklentiler/teknik araçlar, tamamlayıcı/bulut hizmetleri, eğitim/destek ve ALLPLAN ürün platformu. Bina tasarımı için onaylı prototip hazırdır; bu nedenle **1 mevcut + 7 yeni üretim** planlanır. Yıllık sürüm ailesi resmî/onaylı 2027 materyali gelene kadar mevcut kaynak medyayı korur.
- Bridge, AX3000, Scalypso ve benzeri rotalar başlangıçta üst aile görselini kullanır; yalnız semantik temsil, responsive kırpma, erişilebilirlik veya dönüşüm gerekçesi kanıtlanırsa özel görsel istisnası açılır.
- Video playlist rotaları da varsayılan Eğitim/Destek ailesine dahildir; gövde içindeki playlist thumbnail'ları korunur, özel hero kararı otomatik verilmez.
- Hero aile planının onayından sonra yedi eksik aile için henüz üretim yapılmadı; mevcut onaylı `VF-01` mimari prototipi başlangıç varlığıdır. Rota eşleme kodu henüz yazılmadı. Sıradaki adım yedi eksik aile için ortak sanat yönetimiyle prompt brieflerini hazırlayıp görsel üretimine geçmektir.

## 29.10.2026 — Mimari hero background-only prototipi

- Kullanıcı isteğiyle yalnız `/solutions/architecture` rotasında sağdaki tekrarlı hero görsel kartı kaldırıldı; diğer rotalar `framed` sunumu korur. Sunum kararı içerik/schema katmanından ayrı `subpage-hero-presentation.ts` politikasındadır.
- Yeni hero, `Architecture & Space` stil kütüphanesiyle built-in `image_gen` üzerinden üretildi. Web türevi `/assets/solutions/architecture-hero-v2.jpg`; 1672×941 yüksek çözünürlüklü PNG orijinali ve tam promptu `assets/source/generated/heroes/` altında arşivlendi.
- Kullanıcı görsel geri bildirimiyle metin alanındaki çizgi, arka plan ve padding tamamen kaldırıldı. Görsel `contain`, sağ-orta konum ve tekrarsız sunumla küçültülerek mimari/dijital ikiz anlatımı okunur hale getirildi. İlk maskenin gerçek görsel başlangıcında kısa kalması üzerine rota kapsamlı geçiş hero genişliğinin `%28–%82` aralığına yayıldı; sol taraf transparanlaşarak antrasit zeminle yumuşak birleşiyor, sağdaki mimari odak tam görünür kalıyor.
- H1, breadcrumb, açıklama, CTA hedefleri, schema ve generated content değişmedi. Mimari hero’da görünür media kartı `0`; kontrol rotası `/solutions/structural` kartlı düzeni `1` olarak koruyor.
- Yeni dosya sözleşmesi JPEG/PNG imzası, boyut, 1672×941 kaynak ölçüsü ve Git takibini test eder. Son doğrulama: 172 test, 36 faz paritesi, 45 token, 188 kontrast, typecheck ve 110 rota render audit; hata `0`. Code/security review Critical/High/Medium bulgu olmadan onaylandı.
- Bu prototip diğer hero rotalarına yayılmadı. Site geneline uygulama, kullanıcı görsel onayından sonra ayrı fazdır. Push/deploy/canlı değişiklik yoktur.

## 29.10.2026 — Üç ürün sayfasının canlı envanteri (features / civil / SDS2) tamamlandı

- **Yeni envanter dosyaları** (`docs/content-2027/allplan-canlı/`): `allplan-2027-features.md` (121 görünür + 55 gizli karusel bloğu), `allplan-civil.md` (203 blok + zorluk/müşteri sözü/başarı hikâyesi kartları), `allplan-sds2-detailing-fabrication.md` (hero "SOLUTIONFOR" dahil tüm bantlar; VERSION 2027 üç yenilik; 3 söz; Deloitte/Dow/Winter Olympic hikâyeleri; explore/training/partner). EN birebir (kaynak hatalı birleşik yazımlar "Kaynak notları"nda), TR taslak.
- **Medya:** her sayfaya ayrı klasör, toplam **94 görsel (~9,8 MB)** indirildi ve `file` tipi denetimi temiz: features 16 (2,8 MB), civil 58 (~3,7 MB), sds2 20 (~3,3 MB). `media/manifest.md` artık dört sayfayı kapsar (SHA-256 ilk 16 hane + boyut + görev).
- **Bozuk kaynak:** features sayfasındaki gizli Civil slayt videosu `Editable_Stationing.mp4` canlı sunucuda **HTTP 404** — image ve video başlıklarıyla iki kez denendi, indirilemedi; manifest ve envanterde notlu.
- **Video/embed politikası:** YouTube gömeleri yalnız referans (civil 18 benzersiz göme, features hiç yok, sds2 hiç yok); civil müşteri sözü videoları `event.allplanplus.com` oturum bağlantıları (base64 encoded) olarak kayıtlı. Takip pikselleri (bat.bing/adsct) indirilmedi.
- **Kaynak quirks envanterde belgelendi:** SDS2 İtalalyan URL'leri (`/it/soluzioni-per-settore/…`, "Steel Fabrication" `it/it` çift kodu), Civil `7xzpEhLQhEI??rel=0` çift soru işareti, "Success StoriesCUSTOMER", "Midlands, Michigan" (doğrusu Midland), "View all training" href artık `?`, boşluksuz stat/benefit etiketleri, sözlerde ad/unvan yok.
- **Commit:** `7f1a69d` — 99 dosya (3 envanter + manifest + README tablosu + 94 görsel). Push/merge/deploy yok.
- **Sıradaki adım:** kullanıcı onayıyla dört canlı envanter Aşama C'ye (02-inventory sayfaları) işlenecek; öncelikle features sayfasındaki gizli karusel içeriklerinin C katmanına nasıl bağlanacağı kararı.
- **Kullanıcı kararı (29.10.2026):** canlı envanter ve üretim yalnız **EN + TR**; SDS2 İtalyan URL'leri gibi diğer dil kaçışları envanterde kayıtlı kalır ama üretimde EN/TR karşılıklarıyla çözülür (`docs/00-inventory/user-decisions.md` eki).
- **Geçici çınlar:** `/tmp/acookies.txt`, `/tmp/dl_urls.txt` vs. envanter dalında kalıcı değildir; DOM'dan yeniden üretilebilir.

## 29.10.2026 — Canlı Allplan Max sayfa envanteri ve medya arşivi (allplan-canlı/)

- **Yeni klasör:** `docs/content-2027/allplan-canlı/`. Canlı `https://www.allplan.com/allplan-max/` sayfasının render edilmiş DOM'undan içerik envanteri çıkarıldı: görsel sıra (y konumu) ile tüm metin blokları; EN **birebir** (kaynaktaki yazım hataları dahil, "Kaynak notları" bölümlerinde belgelendi), ayrı TR **taslak** kolonu.
- **Medya:** `media/` altına 13 varlık indirildi — 9 görsel (~1,4 MB) + 4 video (~37 MB: hero tanıtım 25,4 MB ve 3 özellik videosu). `media/manifest.md` SHA-256, boyut ve canlı konum içerir. Takip istekleri (bat.bing, adsct) indirilmedi; 7 YouTube gömesi yalnız referans olarak envanterde kayıtlı (`[in Beta]` AI BIM Modeler dahil).
- **Yöntem notu:** Akamai bot koruması, curl'a gezgin başlık seti (UA, Accept, Accept-Language, Referer, Sec-Fetch-*) + sayfa çerezleri verilerek aşıldı; çerez dosyası geçici, DOM'dan yeniden üretilebilir.
- **Canlı–docx farkları ve 5 açık soru** envanterin sonunda kayıtlı (alıntı öznitelikleri boş, "Video ansehen" Almanca kaçışı, AI BIM Modeler eksik `Included in` etiketi, %18/%21/%24 yayın izni, kaynak metin tekrarları).
- **Kullanıcı kararı:** canlı envanter Aşama C/D makine katmanına (`content-records.json`) bağlanmadı; üretici referansı olarak ayrı durur.
- **Commit:** canlı envanter klasörü tek committe kayıt altına alındı; push/merge/deploy yok.

## 28.10.2026 — Sitewide kaynak/veri/render ve tarayıcı paritesi kapandı

- Bridge ve AEC sayfalarına kaynakta bulunmadığı halde eklenen genel MP4 fallback kaldırıldı; Bridge `SeA6ncaqUhY`, AEC `tFnwOyX7ncI` üretici YouTube içeriği korundu (`83ec79e`). `/solutions/allplan-industry` içindeki altı ürün kartı, Professional ve Ultimate dahil, ana içerikte doğrulandı.
- Kaynak → generated data sözleşmesi 110/110 route için başlık, metin, link, görsel rolü/SHA-256, video/embed ve yerel dosya paritesini doğruluyor; onaysız fark yok (`2396e88`).
- Generated data → yalnız `<main>` render sözleşmesi 110/110 HTTP 200, 110/110 tek H1, 94 tam geçiş, 16 exact-policy etkileşim farkı ve `0` failure verdi (`0d806e4`). 16 fark, varsayılan olmayan tab/FAQ kategorilerindeki 303 metindir; route + sayı + pointer/metin digest değişirse denetim fail olur.
- Gerçek headless browser kabulünde 110 route × masaüstü/mobil = 220 kontrol yapıldı: navigasyon, H1, yatay taşma ve yüklenemeyen görünür görsel hatalarının tümü `0`. Workflow klavye seçimi, mobil menü, tema, lightbox, FAQ, eğitim tabı, referans filtre/arama ve playlist seçimi ayrıca gerçek tarayıcıda çalıştı; sekiz sonucun rota/eylem/beklenen/gözlenen kaydı `browser-interaction-audit.json` içinde tutulur.
- Tam doğrulama: `pnpm test` 170 test, 36 faz paritesi, 45 token, 188 kontrast; `pnpm typecheck`; 118 route production build; production dependency audit bulgusuz. Bağımsız code ve security review Critical/High/Medium bulgu vermedi.
- Kanıtlar `docs/verification/sitewide-parity-2026-10-28/` altındadır. Otomatik kontroller statik içerik/kart/medya/link kaybı için sayfa sayfa manuel karşılaştırma gereksinimini ortadan kaldırır. Etkileşim kabulü sekiz temsilî akışla sınırlıdır; tüm etkileşimlerin editoryal, görsel ve davranışsal son onayı insan kontrolüdür.
- Canlı sistem, kaynak 2026 ve deploy durumu değiştirilmedi; push/deploy yapılmadı. Yerel `:3001` geliştirme sunucusu kullanıcı incelemesi için açık bırakıldı.

## 28.10.2026 — Aşama C onayı ve Aşama D tamamlandı (makine okunur içerik katmanı)

- **Onay:** kullanıcı Aşama C çıktılarını onayladı; FRILO/SCIA/Max rota yapısı, sayısal iddia yayın izinleri ve görsel atamaları hâlâ `02-inventory/open-decisions.md`'de bekliyor.
- **Yeni betik:** `scripts/build_content_records.py`. Envanter birimlerini aynı çözümleyici ile makine okunur kayıtlara döker ve `docs/content-2027/03-data/content-records.json` yazır. Deterministik (`--check` bayt eşliği doğrular), üçüncü parti bağımlılık yok.
- **Çıktı:** 394 kayıt / 10 sayfa; alanlar `id`, `page`, `role*`, `sourceFile`, `sourceLocator` (`slug#bN[@part]`), `sourceHash` (SHA-256), `bodyEn` (birebir), `bodyTr` (taslak), `trStatus: draft`, `note`. Sözleşme: `03-data/README.md`.
- **Commitler:** Aşama A/B/C çıktıları ve hattın betikleri farklı commitlerde kayıt altına alındı; push/merge/deploy yok.

## Oturum kapanışı — 28.10.2026

- Kullanıcı: "böylece kalsın sonra devam ederiz". Genel durum: Aşama A–D tamamlandı ve commit'li; statik durum/to-do sayfası `docs/content-2027/status.html` yayında önizlenebilir (Review pane).
- **Sıradaki oturum açılışı:** `docs/MASTER-PROMPT.md` → bu dosyanın üst kayıtları → `docs/content-2027/02-inventory/open-decisions.md` (15 açık karar) → kullanıcı kararları.
- **Bekleyen:** B3 (14 İngilizce brief indirme, kullanıcı), B4 (pptx kapsam kararı, kullanıcı), TR taslak editör turu, FRILO/SCIA/Max/Parametric/Rebar rota kararları, görsel atamaları, yayın izinleri.
- Push/merge/deploy yok; çalışmada önceki oturuma ait parite dosyaları (sitewide parity) bilinçli olarak dokunulmadan bırakıldı.

## Güncelleme tarihi ve oturum no
28.10.2026 — 2027 içerik envanteri Aşama A–C, B5, B6 ve D tamamlandı: 10 sayfa / 394 içerik birimi, `content-records.json` üretildi ve check temiz. B3 (İngilizce brief indirme) ve B4 (pptx kapsamı) karar bekliyor.

## 28.10.2026 — 2027 içerik envanteri, Aşama C (web içeriği envanteri + TR taslak)

- **Kapsam:** tüm kök klasörlerden 10 hedef sayfa × 394 içerik birimi; her kayıt `slug#bN` blok adresi + birebir EN metin + ayrı TR **taslak** kolonu. Kişisel veri, görüntü kredisi ve maskeli satırlar envantere girmedi.
- **Yeni betikler:** `scripts/source_blocks.py` (Stage B yüzeyinden blok adresleri üretir; 20 belge / 775 blok), `scripts/build_web_inventory.py` (satır çözümü, Markdown render, `--check` kapsama/TR/ID denetimi), `scripts/inventory_units/` (sayfa bazlı içerik birimi modülleri: allplan, allplan-parametric, allplan-rebar, allplan-max, allplan-civil, frilo, scia, sds2).
- **Çıktılar:** `docs/content-2027/02-inventory/pages/*.md` (10 dosya), `README.md`, `routes.md` (110 mevcut rota + 5 yeni rota önerisi), `open-decisions.md` (15 açık karar), `source-coverage.md` (13 web docx / 761 blok kapsama tablosu).
- **Bire birlik garantisi:** EN hücresi elle yazılmaz; betik Stage B çıktısındaki bloktan kopyalar. Tekrar eden metinler (FRILO/SCIA özellikleri, sürüm `VERSION 2027` etiketleri, Max anket etiketi) bir kez tanımlanıp `ref()` ile referanslanır; `--check` aynı metnin ikinci tekrarını kapsamış sayar.
- **Denetim:** `build_web_inventory.py --check` → "Sorun yok. 10 sayfa, 394 içerik birimi". Kapsam kuralı: web sayfası olmayan belgeler (7 sales PDF/cheat sheet web sürümü) kapsam dışı; NON_CONTENT desenleri satış notlarını saymaz.
- **Açık sorunlar 02-inventory/open-decisions.md içinde:** FRILO/SCIA rota yapısı, Max ile sürüm sayfaları çakışması, Parametric/Rebar yeni rotaların kararı, sayısal iddia yayın izinleri, SDS2/Max ana görselleri, Bimplus değişiklik hedefi ve kaynak metin hataları (Max pillar-2 tekrarı, FRILO Geotechnics Ultimate başlığı).
- **Bekleyen girdiler:** B3 (14 İngilizce messaging brief, SharePoint indirilmesi) ve B4 (pptx kapsam kararı). Aşama D (makine okunur `content-records.json`) onay sonrası.
- Push/merge/deploy/canlı değişiklik yapılmadı.

## 28.10.2026 — Header/footer sosyal bağlantıları ikon-only

- Header topbar ve footer sosyal bağlantılarındaki görünür kanal adları kaldırıldı; Facebook, Twitter/X, LinkedIn, Instagram ve YouTube yalnız ikonla gösteriliyor.
- `aria-label`, hedef URL, yeni sekme davranışı ve `noopener noreferrer` korundu. DOM kabulünde 10 bağlantının görünür metni boş, erişilebilir adı ve tek ikonu mevcut.
- Erişilebilirlik regresyon testi eklendi; `pnpm test` toplam 147 birim testi, 36 parite ve 45 token testiyle geçti. Push/deploy/canlı değişikliği yapılmadı.

## 28.10.2026 — 2027 içerik envanteri, Aşama B1–B2 (metin çıkarımı)

- **Yeni betik:** `scripts/extract_source_text.py`. Yalnız `docs/content-2027/01-source-text/` altına yazar, stdlib dışında bağımlılık yok, deterministik (iki çalıştırmada bayt-eş çıktı doğrulandı).
- **Çıktı:** 13 dosya `01-source-text/web-pages/`, 1 dosya `01-source-text/editions/editions-2027.md`, indeks `01-source-text/README.md`. Toplam 49.070 karakter kaynak metin.
- **Birebirlik kanıtı:** her docx için `verify_docx()` kaynaktaki her paragrafın çıktıda aynen bulunduğunu doğrular — 13/13 dosyada kayıp paragraf 0. Edition sayfasında kaynak `# characters:` kolonu gerçek uzunlukla karşılaştırılır — 18/18 eşleşiyor.
- **Biçim kararı:** 2027 docx'lerinde başlık stili yok (yalnız `Normal`); yapı doğrudan kalın biçimlendirmeyle taşınıyor. Bu yüzden tamamen kalın paragraflar `**…**` olarak yazılır. `Home Page Slides`, `FRILO Edition Pages` gibi başlık stili olan dosyalarda `#`/`##`/`###` kullanılır.
- **Düzeltilen varsayım:** üç `Launch 2027 - Intro text edition pages shop EN*.xlsx` **bayt düzeyinde farklı** (Office metadata) ama **içerik birebir aynı**. Eşitlik SHA-256 ile değil, çıkarılan hücrelerle karşılaştırılır. Kanonik kaynak: FRILO kopyası (`Copy1` işareti olmayan ilk dosya).
- **Yeni bulgular:**
  1. `Allplan Max Web Page.docx` tablosunda 9 özellik satırının görsel adı **`XXXXX`** — yer tutucu, yayına çıkmadan çözülmeli.
  2. FRILO ve Civil docx'lerinde yazar notları metnin içinde: `<237 characters>`, `<image – GEO / CLT preferably>` (toplam 42 not). Bunlar kaynakta korunur, sitede yayımlanmaz.
  3. `Allplan Max Web Page` 9 AI özelliğini tek tabloda veriyor: Feature Builder (MCP), Workflow Builder (MCP), AI Formula Writer, AI BIM Analyst, AI Structural Analyst, AI Drafter, AI BIM Modeler (Beta), AI Visualizer, AI Coach.
  4. **3 maskeleme yapıldı** (kişisel veri kuralı): SDS2 home page'de referans proje adı ve müşteri firma adı (2), Civil home page slide'da görsel kredisi — mimar firma + fotoğrafçı adı (1). Maskelenen değerler repoya yazılmadı; yayın öncesi ayrı onay gerekiyor.
- **Yapılmayanlar:** messaging brief çıkarımı (B3, İngilizce kaynak yok), pptx metni (B4, kapsam kararı bekliyor), PDF metni, proof points, TR çeviri, rota/URL önerisi. Push/merge/deploy yok.

## 28.10.2026 — 2027 içerik envanteri, Aşama A (dosya envanteri)

- **Kapsam kararı (kullanıcı):** envanter yalnız pazarlama paketini değil **tüm kök klasörleri** kapsar; belgelerden **tam metin** çıkarılır; içerik **EN kaynak aynen + ayrı TR taslak** kolonuyla tutulur.
- **Yeni betik:** `scripts/build_content_inventory.py`. Yalnız `docs/content-2027/00-census/` altına yazar, üçüncü parti bağımlılık yok, deterministik. Çalıştırma: `python3 scripts/build_content_inventory.py`.
- **Çıktılar:** `root-folder-census.md` (klasör/tür/dil/otorite özeti), `file-index.csv` (3.965 satır; yol, tür, boyut, SHA-256, ürün, dil, rol, otorite), `duplicates.md` (birebir kopya, çevrilmemiş dil varyantı, dil/sürüm grupları), `authority-map.md` (sınıflandırma + çakışma kararları + eksik kaynak listesi). Kapsam ve ilkeler: `docs/content-2027/README.md`.
- **Doğrulanan sayılar:** pazarlama paketi 916 dosya / 8,0 GB (Git dışı); 232 içerik belgesi (84 docx, 138 pptx, 5 xlsx, 8 pdf); 496 görsel, 174 video/gif. Depo toplamı 3.965 dosya / 8,3 GB.
- **Kritik bulgular:**
  1. İngilizce messaging brief'ler ve `ALLPLAN Edition Table - ALL FEATURES.xlsx` yalnız SharePoint `.url` kısayolu (14 dosya); yerel kaynak yok.
  2. FRILO (cs/es/fr/it), SDS2 (de/es/fr) ve SCIA (de/it) messaging brief'leri birebir aynı dosya — çevrilmemiş, yalnız yeniden adlandırılmış.
  3. `Aluplan Design System/` klasörü `design-system/`'in ikinci kopyası; 24 dosyada fark var. Otorite `design-system/`.
  4. `Proof Points and Usable Quotes.xlsx` kişisel veri ve `Consent: None` satırları içeriyor; envantere yalnız anonim yüzdeler alınacak.
  5. 2027'de yeni ürünler var ve mevcut IA'da rota yok: ALLPLAN Parametric, ALLPLAN Rebar, Allplan Max.
- **Yapılmayanlar:** metin çıkarımı, TR çeviri, yeni rota/URL önerisi, `HANDOFF.md` dışında mevcut doküman değişikliği. Push/merge/deploy yok.

## 28.10.2026 — Yapılandırılmış sayfa kaynak/render paritesi

- **Kök neden:** eski düz veri alanları sayfa içindeki kaynak sırasını ve iç içe bağlantı gruplarını temsil edemiyordu; bu nedenle canlıda bulunan kartlar veri üretiminde kayboluyor veya render edilmeden kalıyordu.
- **Çözüm:** sıralı ve tipli `contentBlocks` modeli ile tek renderer eklendi. Eski rotalar için geriye uyumlu fallback korunurken `/solutions/allplan-industry`, `/solutions/ax3000`, `/products/ax3000` ve `/solutions/ax3000-virtual-reality` kaynak blok düzenine geçirildi.
- **Geri yüklenen kritik içerik:** Endüstri sayfasında 3 keşif kartı / 10 alt bağlantı, 6 özellik kartı, Design-to-Build bölümü ve 6 ürün kartı; AX3000 giriş/özellik/modül ilişkileri; VR sayfasında kaynak metinleri, 5 avantaj ve 6 galeri görseli. Endüstri kartlarındaki 9 eski ve artık 404 dönen WordPress görsel URL'si, depoda bulunan semantik yerel asset karşılıklarıyla değiştirildi ve regresyon testiyle korumaya alındı.
- **Otomatik koruma:** kaynak dosya hash'i, tam `contentBlocks` hash'i, blok sırası, kaynak birim kimlikleri ve render edilmiş metin/link/görseller için sözleşme fixture'ı ve doğrulayıcı eklendi. `pnpm test` bu sözleşmeyi zorunlu olarak çalıştırır.
- **Doğrulama:** 145 birim testi, 4 rota kaynak sözleşmesi, 36 Faz 6 parite kontrolü, 45 token testi, 188 kontrast kontrolü, tip kontrolü, 118 sayfalık production build ve loopback production HTML denetimi geçti. Dört rota 390 px mobilde yatay taşma ve console/hydration hatası olmadan doğrulandı.
- **Sınır:** yalnız bu dört yüksek riskli rota sıralı modele taşındı; diğer rotalar mevcut fallback ile çalışıyor. Push/deploy/canlı değişikliği yapılmadı.

## 28.10.2026 — Çözüm katalog/hub navigasyonu düzeltmesi

- Beş footer hub'ı ile header mega menüsünü aynı açık tipli `solutionDirectory` sözleşmesi besliyor. Hub'larda 21/21 kanonik detay hedefi; `/solutions` kataloğunda kaynakta bulunan 22 kart ve iki bilinçli hedef istisnası (BIMPLUS, AX3000) korunuyor.
- Generic `sections + contentLinks` metin benzerliği eşleştirmesi yapılmadı. `SolutionHubSection`, `SolutionCatalogSection` ve tam kartı tek bağlantı yapan `SolutionDirectoryCard` eklendi; iç hedefler Next.js `Link`, tek harici AllplanTools hedefi güvenli yeni sekme davranışını kullanıyor.
- Kod incelemesinde özel katalog render yolunun kaynak giriş bloğunu ve görselleri atladığı HIGH bulgusu yakalandı. Generator artık `/solutions` kaynak `sections` verisinden giriş metnini, kart açıklamalarını ve 22 kart görselini sözleşmeye taşıyor; ikinci `catalogDescription` içerik otoritesi kaldırıldı.
- Related-links alanı geri getirilmedi. Sayfa ailesine göre çalışan tek sayfa-sonu dönüşüm bandı korundu; schema üretimi, canonical/URL sözleşmesi ve CTA hedefleri değiştirilmedi.
- TDD: `tests/test_solution_directory.py` beş hub'ın 21 kartını, katalogdaki 22 kartı, header/footer türetimini, kaynak metin-görsel paritesini, iç hedef varlığını ve harici link güvenliğini doğruluyor.
- Yerel kapılar geçti: 138 unit test, 36 parite kontrolü, 188 kontrast kontrolü, 45 token testi, `pnpm typecheck`, `pnpm build` (118 statik rota) ve production audit (bilinen güvenlik açığı yok). `next-env.d.ts` build sonrası zorunlu `.next/dev/types` biçimine geri alındı.
- Gerçek tarayıcı kabulü: `/solutions` üzerinde 22 kart/22 görsel, kaynak giriş paragrafı, tek dönüşüm bandı ve sıfır related-links; beş hub'da sırasıyla 4/3/3/5/6 kart ve tek dönüşüm bandı doğrulandı. 390×844 emülasyonda yatay taşma yok (`scrollWidth = clientWidth = 390`); konsol warning/error kaydı yok.
- Push, merge, deploy veya canlı değişikliği yapılmadı.

## 27.10.2026 — Sayfa sonu dönüşüm alanı

- Restore point: `restore/pre-page-end-conversion-20261027` → `862ebb15e328c6eee47755d6070f8d333a4125b9`.
- Tasarım ve plan: `docs/superpowers/specs/2026-10-27-page-end-conversion-design.md` ve `docs/superpowers/plans/2026-10-27-page-end-conversion.md` kullanıcı tarafından onaylandı.
- Politika commit'i: `d68ac09` (`feat: define page-end conversion policy`). Bileşen commit'i: `81847a1` (`feat: add contextual page-end conversion`).
- Yeni tek sınır `PageEndConversion`: ürün/paket/ticari çözüm sayfalarında **Teklif İste + Ücretsiz Deneme**; eğitim/webinar/video kütüphanesinde **Eğitim Talebi + Teklif İste**; lisans/destek/SSS sayfalarında **Destek Platformuna Git**; Hakkımızda/Referanslar'da **Teklif İste**. Ana sayfa, İletişim, Arama, Sağlık ve yasal sayfalarda ek bant yok.
- `contentLinks` kaynak verisi ve schema üretimi korunuyor; yalnız otomatik UI render yolları kaldırıldı. Eski iki related-links bölümü, eğitim kökündeki mükerrer talep bölümü ve genel deneme bandı artık render edilmiyor.
- Tam yerel kapı: `pnpm data:generate` ile 110 rota/14 playlist deterministik; `src/data` değişmedi. `pnpm test`: 128 unit test, 36 parite kontrolü, 188 kontrast kontrolü ve 45 token testi geçti. `pnpm typecheck`, `pnpm build` ve `pnpm audit --prod --audit-level high` geçti; bilinen güvenlik açığı yok.
- `next-env.d.ts` build sonrası proje kuralındaki iki `.next/dev/types` importuna geri alındı ve diff temizliği doğrulandı.
- Gerçek tarayıcı kabulü: sekiz temsilî rota (`/products/allplan-professional`, `/solutions/road-railway`, eğitim kökü ve playlist, `/solutions-v2/connect-license`, `/about`, `/contact`, `/kvkk`) doğru 0/1 bant, CTA sırası/hedefi, related-links yokluğu ve footer komşuluğu açısından geçti. Konsol/hydration hatası görülmedi.
- Mobil Chrome 390×844 emülasyonunda ürün ve eğitim bantları yatay taşmasız (`documentWidth = viewportWidth = 390`) ve CTA'lar viewport içinde doğrulandı. Klavye Tab kontrolünde CTA `:focus-visible` halkası solid olarak göründü.
- Yerel önizleme `http://127.0.0.1:3001/` üzerinde açık bırakıldı. Push, merge, deploy veya canlı değişikliği yapılmadı.

## 27.10.2026 — Çözüm katalog/hub navigasyonu regresyonu (tarihsel tespit kaydı)

- **Durum:** Bu bölüm 27.10.2026 tarihli tespit kaydıdır. Regresyon 28.10.2026 tarihinde üstteki kabul paketiyle giderildi. Çalışma dalı `codex/page-end-conversion-design`; push, merge, deploy veya canlı değişikliği yapılmadı.
- **Belirti ve bilgi mimarisi:** Header mega menüsü 21 doğrudan `/solutions/*` detayına, footer ise beş `/solutions-v2/*` kategori hub'ına gidiyor. Bu farklı rol uygundur; hata, `/solutions` kataloğu ile hub kartlarının hedef detay URL'lerine bağlı olmamasıdır.
- **Doğrulanmış kapsam:** `/solutions`, `/solutions-v2/building-design`, `/solutions-v2/infrastructure`, `/solutions-v2/construction`, `/solutions-v2/addons` ve `/solutions-v2/other`.
- **Veri kanıtı:** Beş hub'da tanımlı toplam 21 hedef, header `solutionsMenu` içindeki 21 hedefle 21/21 eşleşiyor. Yirmi yerel hedef mevcut; bir hedef `https://allplantools.com/`. URL veya içerik eksik değil, render ilişkisi eksik.
- **Runtime kanıtı:** Yerel `/solutions-v2/other` sayfasındaki çözüm kartlarında bağlantı sayısı `0`; `/solutions` kataloğunda `/solutions/*` ayrıntı bağlantısı yok. Bu yerel tarayıcı kanıtıdır, canlı davranış iddiası değildir.
- **Kök neden:** `scripts/generate_site_data.py` kart metinlerini `sections`, hedefleri ayrı `contentLinks` koleksiyonunda üretir. Generic `src/components/sections/SubpageView.tsx`, `specSections` öğelerini bağlantısız `<article>` olarak render eder ve bu iki veri koleksiyonunu ilişkilendirmez.
- **Kaynak paritesi:** Salt-okunur 2026 kaynağındaki `app/solutions-v2/construction/page.tsx`, `solutionsMenu` öğelerini `CardV2 href={item.href}` ile üretir; `components/layout-v2/CardV2.tsx` kartın tamamını `Link` ile sarar. Mevcut 2027 davranışı kaynak paritesi regresyonudur.
- **Son değişiklik ilişkisi:** Related-links alanının kaldırılması kart bağlantısı kusurunu oluşturmadı; önceden var olan kusurun sayfa sonundaki dolaylı/yedek hedef görünümünü kaldırdı. Kullanıcının kaldırma kararı korunacak; generic related-links alanı geri getirilmeyecek.
- **Risk:** UX/bilgi mimarisi riski yüksek, SEO bağlamsal iç bağlantı riski orta. Hedef URL'ler kırık değil; navigasyon ilişkileri eksik.
- **Onaylanan çözüm yönü:** Tek kanonik `solutionsMenu` kaynağından açık tipli `solutionHub.items` veya eşdeğer `directoryItems` üretilecek. Beş hub için özel `SolutionHubSection`, genel katalog için `SolutionCatalogSection` kullanılacak. Metin benzerliğiyle `sections + contentLinks` heuristic join yapılmayacak.
- **Ayrı IA kararı:** Masaüstü header'a “Tüm Çözümler” bağlantısı eklenmesi otomatik düzeltme kapsamına alınmayacak; ayrıca değerlendirilecek.

### Yarınki düzeltmenin kabul ölçütleri

1. Beş hub'daki 21 kart hedefi header `solutionsMenu` ile 21/21 eşleşir.
2. `/solutions` kataloğundaki çözüm kartları gerçek detay hedeflerine bağlanır.
3. Her kart tek, erişilebilir bağlantıdır; klavye odağı ve `:focus-visible` durumu doğrulanır.
4. İç hedefler Next.js `Link`; harici hedef `target="_blank"` ve `rel="noopener noreferrer"` kullanır.
5. Related-links alanı geri dönmez; sayfa sonu dönüşüm bandı ve sayfa ailesi politikası korunur.
6. Generated data deterministik kalır; içerik, schema, URL ve görünür metinler değiştirilmez.
7. Unit/parite testleri, typecheck ve build yanında gerçek tarayıcıda masaüstü/mobil tıklama, klavye ve console/hydration kabulü tamamlanır.

**Tamamlanan güvenli adım (28.10.2026):** Kanonik, açık tipli hub/katalog veri kontratı test-first yazıldı; özel render bileşenleriyle kart bağlantıları geri getirildi ve yukarıdaki kabul paketi çalıştırıldı.

## Güncel öncelik — 26.10.2026 sağlamlaştırma planı

Kullanıcı aşağıdaki yol haritasını onayladı ve önce kayda alınıp çalışmaya başlanmasını istedi. Önceki “Faz 6 tamamlandı / %100 parite” ifadeleri geliştirme kaydıdır; yayın kabulü değildir. Form teslimatı, gerçek belge paritesi, üretim hattı ve token bütünlüğü açık olduğu için güncel durum **Faz 6 — sağlamlaştırma ve kabul doğrulaması devam ediyor** olarak ele alınır.

### Kabul edilen kararlar
- `Allplan 2027 Marketing Materials/` Git'e alınmaz; sonraki yıl içerik çalışmasına ayrılır, bu denetimin kaynak kümesine karıştırılmaz.
- Şimdilik talepler mevcut tek Microsoft Forms (`https://forms.office.com/r/hXhnKAG912`) üzerinden alınır. Niyete özel Next.js form geliştirme planı ertelenmiştir; sahte kayıt/teslim başarısı gösteren yerel akış korunmaz.
- Deneme indirme hedefi ALLPLAN resmî sayfasıdır; destek Teams/ticket kanalları korunur. İletişim ve lisans deklarasyonu satış formuna otomatik bağlanmaz; mevcut görev/hedef eşlemesi ayrıca doğrulanır.
- Görünüm korunarak token bütünlüğü ve büyük bileşenlerin bakım yapısı düzeltilebilir. Yeni görsel tasarım veya ticari iddia üretimi bu çalışma kapsamında değildir.
- Kaynak odaklı denetim: güncel `../aluplan-2026` salt-okunur içerik/etkileşim kaynağı, yerel 2027 render doğrulama hedefi; canlı site yayın farkı/gerçek URL/hedef doğrulaması için kullanılır. Çelişkide canlı esas. Snapshot eşliği doğrulanmadan güncel kaynak diye kabul edilmez.

### Sıralı yol haritası
| Adım | Kapsam | Kabul ölçütü | Durum |
|---|---|---|---|
| S01 | Güvenli başlangıç kaydı ve pazarlama klasörünü hariç tutma | HEAD, üretilmiş veri, gerçek dosya türleri, belge hashleri ve kaynak snapshot eşliği kayıtlı; materyal klasörü ignored | Tamamlandı |
| S02 | Tek yetkili veri üretim hattı | Güncel Python hattı tek giriş; pnpm komutları doğru; eski JS üretici devre dışı; tekrar üretim deterministik, veri kaybı yok | Tamamlandı |
| S03 | PDF/DOCX kaynak paritesi | Temsili PDF üretimi kaldırılır; orijinal belgeler kaynak/URL eşlemesi, SHA-256 ve tür kontrolüyle korunur | Tamamlandı |
| S04 | Microsoft Forms yönlendirmesi | Talep CTA'ları ortak forma bağlı; sahte yerel başarı yok; destek/deneme/özel lisans görevleri karıştırılmaz | Tamamlandı |
| S05 | İçerik/etkileşim paritesi | Kaynak→veri→render bazında eksik/fazla/değişmiş/yanlış eşleşmiş kayıtlar; hedefli canlı doğrulama | Yerel teknik kontrol tamamlandı; kayıtlı istisnalar ve nihai görsel kabul ayrı |
| S06 | Token ve bileşen sağlamlaştırma | Sabit görsel kararlar tokenlara taşınır; büyük bileşenler ayrılır; görsel karşılaştırma görünümü korur | Devam ediyor — S06-A/B/C token katmanları, S06-D SSS ayrımı, S06-E JSX ölçüleri, S06-F kenarlıklar, S06-G konum/margin, S06-H1–H4 width/height, S06-I1–I2 transform ve S06-J1–J2 filter/shadow tamamlandı |
| S07 | Yayın öncesi kabul | Çalışan test komutları, typecheck/build, tarayıcı etkileşimleri, schema/performance doğrulaması ve açık riskler | Bekliyor |

S02 ve S03 bağımlıdır: iki mevcut üretici de gerçek belge adlarına temsili PDF yazar. Başlangıç kaydı alınmadan üretici çalıştırma. Tekleştirme sırasında belge yazma güvenliği sağlanmadan yeni üretim komutunu kullanım için serbest bırakma. Her adım dar kapsamlı commit ve devir kaydıyla kapanır; faz geçişinde kullanıcı onayı beklenir. Push/deploy/canlı değişikliği yetkisi verilmedi.

## Faz durumu tablosu
| Faz | Durum |
|---|---|
| 0 — İçerik envanteri | Tamamlandı (25.10.2026 kullanıcı onayıyla) |
| 1 — UI/UX analizi | Tamamlandı (25.10.2026 kullanıcı onayıyla — `docs/ux-audit.md`) |
| 2 — Teknik baseline | Tamamlandı (25.10.2026 kullanıcı onayıyla — `docs/baseline-report.md`) |
| 3 — PRD | Tamamlandı (25.10.2026 kullanıcı onayıyla — `docs/PRD.md`) |
| 4 — Design system | Tamamlandı (25.10.2026 kullanıcı onayıyla — `design-system/`) |
| 5 — Ana sayfa tasarımı | Tamamlandı (25.10.2026 kullanıcı onayıyla — `design-system/ui_kits/homepage/` ve `docs/homepage-design-proposal.md`) |
| 6 — Geliştirme | Sağlamlaştırma/kabul doğrulaması devam ediyor — önceki aktarım kaydı: 110 rota, 1.298 medya varlığı, 52 yapılandırılmış ürün/çözüm/eklenti sayfası, eşleştirilmiş pop-up video modalları, `/references` (228 firma), `/about` kurumsal profil ve 404 link onarımları doğrulandı (`36/36 PASS`) |

## Tasarım beklerken envanter ve içerik modeli — 21.10.2026
- Kullanıcı envanter kapanışı, ALLPLAN içerik eşlemesi, müşteri yolları ve yıllık güncelleme planını kabul etti. Uygulama/entegrasyon izni değil, analiz kapsamıdır.
- `docs/00-inventory/closure-review-2026-10-21.md`: 180 hedef HEAD kontrolü ve seçili GET kontrolleri; altı PDF'nin canlı/yerel SHA-256 eşliği doğrulandı. AX3000 klasöründeki dört PDF zaten canlı içerikle aynı; iki DOCX kullanım kararı açık.
- `link-recheck-2026-10-21.json` ve `fragment-recheck-2026-10-21.json` yeni kanıtlardır; önceki tarama dosyaları üzerine yazılmadı. 112 HTML/123 fragment çiftinde 118 eşleşme, beş trailing-space adayı; tarayıcı davranışı ayrıca kontrol edilmeli.
- Ana teklif formunun ALLPLAN dalı kişisel veri/gönderim olmadan incelendi; `form-observation-2026-10-21.md`. Kullanıcı form karmaşasının bilinen işletim sorunu olduğunu bildirdi. Niyete göre kısa girişler/tek operasyon merkezi önerisi kaydedildi; mevcut hedef korunur.
- `docs/allplan-content-mapping.md`: gerçek URL'lerle ürün/paket/sürüm/dosya eşlemesi, müşteri yolları ve yıllık kontrol listesi. Üçlü/altılı paket listesi, sürüm/paket etiketi ve deneme süresi açık kararlar.
- Faz 0 kısmi; tüm dinamik durumlar, diğer form dalları, medya ve paket kapsamı henüz kapanmadı. Kaynak ve indirilen design system paketleri değiştirilmedi.

## Paket PDF/web karşılaştırması — 21.10.2026
- `docs/package-comparison-decisions.md`: iki tek sayfalı PDF görsel/koordinat incelemesi, güncel 10 web sayfası kanıtı, 14 karar satırı ve schema etkisi. Kanıt görselleri/metinleri `docs/00-inventory/pdf-evidence/` içinde.
- Aynı 2026 için 23.10.2025 ve 1.7.2026 katalogları; 8→6 sütun, farklı lisans lejantı, SCIA/BIM²form satırlarının yokluğu ve TIM ön koşulu belge farkıdır, otomatik ticari kaldırılma değildir.
- Resmî ALLPLAN 2026 genel/Civil/Precast HTML karşılaştırmaları bulundu. Güncel resmî karşılaştırma PDF'si doğrulanamadı; eski PDF güncel diye kullanılmadı.
- Schema skilli ve güncel Google/Schema.org/Next.js belgeleri okundu. İç model sourceRevision ve licenseModel ile genişletildi; JSON-LD/kod yok.
- Canlı CTA14 gün; kaynakta kullanılmayan30 gün prop'u var. Q3 PDF doğru yazımı karsilastirme; önceki dokümanlardaki a/e aktarım hatası düzeltildi, URL değişikliği değil.
- Kullanıcı stratejik kararları ekibin üstlenebileceğini belirtti. Karar yetkisi ve kanıt temelli ikna sunumu omurgası kaydedildi; final sunum henüz yok. Faz geçişi ve entegrasyon yapılmadı.

## Yönetim sunumu taslağı — 21.10.2026
- Kullanıcı kanıtları yetkililere sunulabilecek strateji taslağına dönüştürmeyi istedi; uygulama yok.
- `docs/presentations/aluplan-strategy/aluplan-web-strategy-draft.pptx`: 13 düzenlenebilir slayt, her slaytta konuşmacı notu. PDF önizlemesi ve `companion.md` konuşmacı/kaynak rehberi birlikte hazırlandı.
- Anlatı: gözlenen sorunlar → kaynak revizyonu → müşteri akışı → tek katalog → yıllık süreç → içerik/tema/schema → karar yetkisi → pilot ve ölçüm → toplantı kararları.
- PPTX yapı doğrulaması geçti, PDF13 sayfa ve PPTX13 not kontrol edildi. Sunum görsel dili marka onayı değildir; final sunum kullanıcı geri bildirimini bekliyor.
- Sıradaki sunum adımı: kullanıcının hedef toplantı ve ton geri bildirimine göre taslağı sonlandırmak. Faz0 açıkları, ticari doğrulama ve design system incelemesi ayrı işlerdir.

## Sayfa görevleri ve üreticiye hizalama — 21.10.2026
- Kullanıcı sunum taslağını uygun buldu; uygulama izni verilmedi. Sonrasında sayfa görev tablosunu ve ALLPLAN referansı/Aluplan ek değeri ayrımını kabul etti.
- `docs/page-responsibilities.md`: 23 mevcut URL için görev, ana kayıt, üretici referansı, yerel değer, sonraki adım ve koru/hizala/yerelleştir/tarihsel tut sınıfları.
- Kararlar: kalıcı ALLPLAN girişi ile AEC iş akışı anlatımı; paket karşılaştırması ile belge indirme; kalıcı bulut hizmetleri ile 2026 bulut yenilikleri ayrı görevler. Yeni URL/canonical/redirect kararı yok.
- Kaynaklar 19/21 Ekim araştırma kayıtlarıdır; bu tur canlı tarama yenilenmedi. Resmî sürüm notu satır eşliği ve TR ticari kapsamı açık.
- İçerik koruma ile hizalama için eski metin/dayanak/öneri fark kaydı tanımlandı; site metni, kod ve schema çıktısı değiştirilmedi.
- Bir sonraki öneri: kayıt şablonları ve iki gerçek içerik üzerinde fark kaydı. Faz0 tamamlandı sayılmaz.

## İçerik sözleşmesi ve hizmet alanı notu — 21.10.2026
- Kullanıcı kayıt şablonları ve iki gerçek fark örneğini kabul etti. Ana sayfa Profesyonel Hizmetler sekmelerinin yetkililer için önemli, yıllar içinde geliştirilmiş ama iyileştirmeye açık olduğunu özellikle belirtti. Özelleştirilmiş eğitim/destek konumlandırması ayrı değerlendirme başlığıdır.
- `docs/content-record-contract.md`: ürün, edition, release, kapsam iddiası, kaynak revizyonu, hizmet, kaynak/hedef ve sayfa kayıtları için kavramsal alanlar; uygulama şeması değildir.
- `docs/content-change-examples.md`: Ultimate–SCIA ticari doğrulaması ve Eğitim Takvimi→Eğitimleri İncele CTA önerisi. Mevcut metinler/CTA'lar uygulanarak değiştirilmedi.
- `docs/professional-services-positioning.md`: hizmet sekmeleri için ayrı kanıt/konumlandırma değerlendirmesi. Eğitim kartında ham /contact hedefi render koşuluyla /solutions-v2/training olur; taşımada gerçek hedef korunmalı.
- Kaynak salt-okunur; bu tur yeni canlı tarama, schema üretimi, tasarım entegrasyonu veya uygulama yok. Faz0 ve hizmet alanının tam etkileşim kabulü açık.

## Eğitim odaklı hizmet matrisi — 21.10.2026
- `docs/service-positioning-matrix.md` oluşturuldu: Eğitim, destek kanalları, danışmanlık, sertifika ve partner için ihtiyaç/kanıt/konum/hedef/açık bilgi ayrımı.
- Kullanıcı bireysel/kurumsal özel eğitim sayfasını konumlandırmada göz ardı edip tek **Eğitim** başlığıyla sadeleştirmeyi istedi. Bu planlama kararı; mevcut sayfa/URL silme veya değiştirme yok.
- Eğitim sayfası kaynak kategorileri ve formatları ayrı boyutlar olarak ele alındı. Web aracı eğitim ana sayfasında üç hafta önceki tarama kaydını döndürdü; güncel etkileşim doğrulaması sayılmadı.
- ContactModal kaynakta simülasyon/console kaydı sonrası başarı gösteriyor. Canlı teslim testi yapılmadı; satış Microsoft Forms akışına genellenmez.
- Kod, schema, canlı site ve design ZIP değişmedi. Matris kullanıcı değerlendirmesini; hizmet koşulları işletim doğrulamasını bekliyor.

## Bu oturumda yapılanlar
- `AGENTS.md` oturum/koruma kuralları ve `docs/MASTER-PROMPT.md` eksiksiz başlangıç talimatı oluşturuldu.
- `docs/00-inventory/content-inventory.md/json` ve `url-map.csv` üretildi: 103 yerel app rotası, 125 canlı URL, 112 HTTP 200 / 11 HTTP 404 / 2 HTTP 308.
- `asset-inventory.json`: 2701 dosya (1364 kök kaynak, 1337 live-versiyon arşivi), byte/SHA-256/referans adayları. Bunlar 2701 yayında kullanılan dosya anlamına gelmez.
- `source-content-texts.json`: 49 tam metin; `page-content.md`: taranan HTML metinlerinin kısaltılmamış dökümü.
- `source-findings.md`: form alanları/entegrasyonlar/çerez/analitik/hosting kaynak kanıtları.
- `browser-home-*.txt`: ana sayfa rol seçenekleri, Connect/Bilgi Merkezi, ürün/çözüm menüleri tarayıcı gözlemleri. Form gönderilmedi.
- `existing-design-tokens.md/json`: mevcut font ve renkler kaynaktan çıkarıldı.
- Kullanıcının `docs/BRAND-GUIDELINES.md` dosyası okundu; değiştirilmedi. `docs/brand/current-identity.md` mevcut/taslak farklarını ve açık kararları kaydeder.
- `collect_inventory.py` salt-okunur envanter aracı gözden geçirildi; form değerleri/script içerikleri dışarıda bırakıldı, gövde sınırı işaretlendi, sitemap ve hassas içerik dışlama durumları görünür kaydedildi. Sentetik form ayrıştırma testi geçti. Bu uygulama testi değildir.
- Canlı/yerel URL parite katmanı `scripts/url_parity.py` ve `tests/test_url_parity.py` ile yeniden üretilebilir hale getirildi. 131 gözlemlenen yol içinde 116 doğrudan 2xx, 4 başarılı 308 yönlendirme, 7 sitemap 404 ve 4 bağlantı kaynaklı 404 bulundu. 14 somut video URL'si dinamik şablon kaynak dosyasına bağlandı. Ayrıntı: `docs/00-inventory/url-parity.md/json/csv` ve yetkili migration tablosu `url-map.csv`.

## Alınan kararlar ve gerekçeleri
- Kullanıcı: canlı ile yerel kökü biraz önce aynı sürüme güncelledi; canlı site esas, yalnız yerel içerik ayrı onaya sunulur. Çalışan SHA bağımsız doğrulanmadı.
- Hedef teknoloji Next.js; kesin sürüm ve tasarım kararları açık. Kaynak Next.js 14/React 18/TypeScript/Tailwind 3 sürüm aralıkları içerir. Docker/Coolify belgesi mevcut; üretim sağlayıcısı bağımsız doğrulanmadı.
- Kılavuz v1.0 TASLAK / ONAY BEKLİYOR. Aluplan ayrı distribütör/çözüm ortağı kimliğiyle ele alınacak; yeni palet/font/slogan henüz uygulanmaz.
- 29+/500+/50+/10K+ metinleri, mevcut CTA hedefleri, üretici logoları, hero video, PDF'ler ve geliştirici kredisi korunur. İnceleme notları değiştirme izni değildir.
- Eski projede build/dev/install çalıştırılmadı, yazma yapılmadı. Kardeş projeler incelenmedi. `.env` içerikleri okunmadı/kopyalanmadı.
- Kullanıcı hedef teknoloji olarak Next.js'i seçti. Kesin sürüm geliştirme başlangıcında güncel kararlı sürümden doğrulanıp kilitlenecek; mevcut fazda scaffold kurulmayacak.
- İçerik, bileşen ve tema ayrı katmanlar olacak. Tüm görsel değerler semantik design token sözleşmesinden beslenecek; yalnız token seti değiştirilerek sitenin tamamı yeniden temalanabilir olacak. Bu gereksinim PRD ve Faz 4 kabul kriterlerine bağlanacak.
- `../aluplan-2026` kaynak Git HEAD'i URL parite çalışması başında `d126e901b1f641b394a1725c50f031914da10307`, dalı `main` idi. Kaynakta izlenmeyen `AX3000_For Hazar/` klasörü bulundu; canlı/kök eşitliği iddiasına otomatik dahil edilmeyecek ve ayrı yerel içerik adayı olarak tutulacak.

## Açık sorular ve onay bekleyen konular
- Segmentlerin ticari önceliği ve karar vericiler.
- Tek birincil dönüşüm: teklif/deneme ağırlığı; teklif için Next.js kısa form sözleşmesi onaylandı (`docs/request-forms-contract.md`), gerçek teslimat/operasyon hedefi açık.
- Antrasit koyu tema onaylı; marka kılavuzunun kalan açık tema/font/logo/slogan kararları; ALLPLAN üretici kullanım kuralları ve dosya bazında izinler; title/hero/sosyal kimlik onayı.
- **Kapatıldı (25.10.2026):** 14 gün / 30 gün ücretsiz deneme süresi çelişkisi kullanıcı kararıyla kapatıldı. Yeni sitede ücretsiz deneme bağlantıları doğrudan `https://www.allplan.com/trial-or-subscription/` adresine yönlendirilecek.
- PRD henüz yazılmadı; kalan açık sorular Faz 3 Açık Sorular bölümüne taşınacak. Yeni tasarımı bu cevaplar varsayılarak kurma.

## Bilinen sorunlar ve riskler
- **Faz 0 Envanteri tamamlandı (25.10.2026):** Alt sayfa dinamik durumları, harici form alanları (14 bölüm/24 soru), dış link/dosya erişimleri, fragmentler ve hashli medya eşlemesi tamamlanıp `docs/00-inventory/content-inventory.md` ve `docs/00-inventory/inventory-coverage-2026-10-22.md` altında kapatıldı. 11 benzersiz 404 ve eksik hedeflerin onarımı (`url-closure-2026-10-22.md`) kullanıcı kararıyla uygulama/geçiş aşamasına ertelendi.
- Güncel URL parite aracı aynı-origin 308 hedeflerini izler ve yalnız 2xx hedefe ulaşan yönlendirmeleri geçerli migration girdisi sayar. Harici hedefler otomatik GET edilmez. Bulgular tek tarama anı kanıtıdır.
- URL keşfi sitemap, yerel rotalar, kaynak yönlendirmeleri ve HTML bağlantılarıyla; 8 tur/400 yol sınırıyla çalışır.
- /about canlı canonical ana sayfaya işaret ediyor; meta kayıtlarında kanıt var. Teknik etkisi Faz 2'de analiz edilecek.
- Kaynakta bazı form akışları simülasyon; canlı gönderim/kalıcılık testi yapılmadı. Güvenlik ve çerez bulguları kod kanıtı, canlı/hukuki uygunluk kararı değil.
- Asset basename eşlemeleri aday; kesin kullanım kanıtı değil. `live-versiyon` arşivi güncel içeriğe karıştırılmaz.
- Marka kılavuzunun üretici izinleri hakkındaki ifadeleri resmî izin belgesi yerine geçmez; benzerlik kontrolü henüz yapılmadı.

## Sıradaki adım
`design-system/ui_kits/homepage/` ve `docs/homepage-design-proposal.md` (Faz 5 — Ana Sayfa Tasarımı) için kullanıcı onayını beklemek; onay sonrası **Faz 6 — Geliştirme (`src/`)** aşamasına geçmek.

Claude v3 indirildi ve ayrı antrasit önizleme kullanıcı tarafından uygun bulundu. Teknik entegrasyon kabulü değildir; aşağıdaki eski Claude durum kayıtları tarihsel notlardır.

## Claude Design paket incelemesi — 21.10.2026
- Son tarayıcı kontrolünde Claude kullanım sınırında durmuş; v3 ZIP henüz üretilmemiş. Yeni indirme veya yeniden paket kabulü yapılmadı. Kısmi düzeltme beyanları ve kalan işler inceleme raporunun son bölümünde kayıtlı; bunlar bağımsız doğrulama değildir.
- Kullanıcı ayrı beyaz dolgulu logo varyantına açık onay verdi ve talimat Claude'a gönderildi: orijinal korunacak, geometri/oranlar değişmeyecek. Bu izin yeniden logo tasarımı veya site entegrasyonu değildir.
- Kullanıcı Claude Design taslağını oluşturmayı yönettirdi; ardından ZIP'i proje köküne indirip yenisiyle değiştirdi. Son ZIP SHA-256: `af116303f7cbfd7d0ec7a0e6bc6c74565efa98f518b37813fe1bf2ec2825b4c0`; açılmış klasör ZIP ile aynı.
- Rapor: `docs/design-system-package-review.md`. Son key düzeltmeleri var. Node --check geçti, 188 kontrast kontrolünde eşik altı yok; iki yanlış sınıflandırılmış min-width uyarısı var.
- Responsive token üretimi, sürüm/bölge kapsam modeli, görsel sabitler, ikon/logo token eşlemesi, Tabs kenar durumu, güncel sürüm varsayımı, font lisansları açık.
- Yerel katalog 8768'de açıldı (server session 56227). Bir tema/mod geçişinde metin ve linkler korundu, font değişti. Tam E2E/Next build yapılmadı.
- ZIP ve açılmış kaynaklar kullanıcı dosyalarıdır; değiştirilmedi, commit'e alınmadı. Yalnız inceleme dokümanları kaydedildi. Bu taslak Faz 4 veya site entegrasyonu onayı değildir.

## Schema stratejisi ve CMS kararı — 21.10.2026
- CMS kullanıcı kararıyla şimdilik ertelendi. Sağlam design system gereksinimi yinelendi; henüz kurulum onayı yok.
- Schema skilli yeniden okundu; Google SoftwareApplication, Product snippet, Product variants, genel kurallar, Organization, Article ve Breadcrumb belgeleri; Schema.org alanları ve Next.js JSON-LD rehberi canlı doğrulandı.
- Strateji bölüm 10: ürün/paket/sürüm ve bölgesel kapsam kayıtları, kararlı kimlikler, sayfa–varlık ayrımı, semantik türler ve zengin sonuç şartları eklendi. Yazılım paketleri/yılları otomatik ProductGroup varyantı sayılmaz; fiyat veya değerlendirme uydurulmaz.
- Önceki ALLPLAN analizi yeniden tarama olarak sunulmadı; yeni plan o belgeye bağlandı. Önceki diğer türlerin araştırma tarihi korunur.
- Yalnız dokümanlar değişti; kod, schema çıktısı, design system veya yayın yok. Uygulama testleri, Rich Results Test ve URL Inspection çalıştırılmadı.

## Uzun vadeli web stratejisi — 21.10.2026
- Kullanıcı yıllık yeniden yapım yükünü ve ürünlerin doğru anlatılmasını temel sorunlar olarak belirtti; kalıcı içerik, yıllık sürümler ve müşteri kazanımını birlikte planlamayı istedi.
- `docs/long-term-web-strategy.md` v0.1 taslağı oluşturuldu: kalıcı ürün/çözüm kayıtları, ayrı paket/sürüm ilişkileri, yıllık yayın süreci, mevcut CTA'larla müşteri yolları, CMS'siz içerik işletimi ve ölçüm önerileri.
- Tek devam eden kod tabanı ve içerik güncellemeleri önerildi. Ürün/segment pilotu, ticari hedefler, sorumlular ve sayısal başarı hedefleri kullanıcı değerlendirmesine açık.
- Google'ın URL taşıma ve kullanıcı odaklı içerik belgeleri incelendi ve taslakta kaynak gösterildi. Canlı site yeniden taranmadı; envanter sayıları önceki tarihli gözlemlerdir.
- Yalnız dokümantasyon değişti. Tasarım, uygulama, schema, içerik/URL değişikliği veya yayın yapılmadı; Faz 0 sürüyor.

## Kullanıcı isteğiyle bağımsız ALLPLAN referans araştırması
- 19.10.2026: `docs/allplan-information-architecture.md` oluşturuldu. International görünümde ürün/çözüm/paket ayrımı, sayfa sunum desenleri, kullanıcı yolları ve dokuz sayfanın ilk HTML schema işaretleri incelendi; ABD bölgesel farkları ayrıca belirtildi.
- İlk altı HTML örneğinde TYPO3 kaynak işareti doğrulandı. Aluplan CMS kullanmıyor; Next.js içerik, ilişkiler, navigasyon, tema ve SEO katmanları için dosya tabanlı model yalnız aday olarak belgelendi. CMS kurulumu kararlaştırılmadı.
- Dokuz örneğin ilk HTML'sinde JSON-LD/itemtype bulunmadı; JS sonrası DOM, mağaza ve site geneli için yokluk iddiası yapılmadı. İç CMS veri modeli bilinmiyor.
- Aluplan karşılaştırması henüz yapılmadı; referans araştırması faz geçişi veya tasarım/URL/içerik değişikliği onayı değildir.
- Schema skillinin kullanıcı tarafından istenmesi üzerine `docs/allplan-information-architecture.md` bölüm 6.C, 19.10.2026 tarihinde Google Search Central ve Next.js resmî belgeleriyle doğrulandı. FAQ rich result'ın Mayıs 2026'da kaldırılması, HowTo/search-box desteğinin kaldırılması ve skilldeki zorunlu alan özetlerinin düzeltmeleri kaydedildi. CMS'siz Next.js için tür/uygunluk matrisi eklendi; kod veya JSON-LD uygulanmadı, ALLPLAN yeniden taranmadı, Rich Results Test çalıştırılmadı.

## Önemli dosyalar ve komutlar
- Başlangıç sırası: `docs/MASTER-PROMPT.md` → `HANDOFF.md` → `docs/BRAND-GUIDELINES.md` → 3–5 satır özet ve kullanıcı onayı.
- Kullanıcı kararları: `docs/00-inventory/user-decisions.md`.
- Envanter: `docs/00-inventory/content-inventory.md`, `.json`, `url-map.csv`.
- URL doğrulama: `python3 scripts/url_parity.py`; birim test: `python3 -m unittest tests/test_url_parity.py`.
- Kaynak marka farkları: `docs/brand/current-identity.md`.
- Envanter aracını yeniden çalıştırma: `python3 docs/00-inventory/collect_inventory.py` (canlı GET trafiği üretir; otomatik JSON/CSV'yi yeniler; elle eklenen public_url/live_pages_exact eşlemelerini yeniden eklemek gerekir).
- Yeni uygulama kurulmadı: build/test/lint/dev komutları tanımlı değil. `design-system/` boş; `src/` geliştirme fazından önce oluşturulmadı.

## Aynı oturum ek işi — Kullanıcı isteğiyle HTML örneği
- Kullanıcı açıkça HTML tasarım örneği istedi; yalnız bu önizleme için `docs/previews/index.html` ve yerel assets oluşturuldu. Tam site/design system geliştirmesine geçilmedi; Faz 0 devam ediyor.
- Önizleme: http://127.0.0.1:8767/ (yalnız loopback, Python static server; terminal oturumu 92812).
- Kaynak görseller/logolar değiştirilmeden yeni projeye kopyalandı. Fontlar yerel, lisans metinleri kayıtlı. Kapsam ve font formatı sınırı `docs/previews/README.md` içinde.
- Tarayıcıda rol metni/URL değişimi ve tema geçişi doğrulandı; `docs/previews/preview.png` kaydedildi. Statik kod incelemesinde kritik/yüksek bulgu yok. Tam mobil/E2E veya içerik paritesi kabulü yapılmadı.
- Tasarım örneği kullanıcı geri bildirimini bekler; PRD veya marka kılavuzu onayı verilmiş sayılmaz.

## 21.10.2026 — Destek adresi kullanıcı düzeltmesi

Kullanıcı Teams üzerinden desteğin ve ayrı ticket sisteminin çalıştığını teyit etti. Ticket adresini **allplan.net.tr** olarak düzeltti; önceki kaynak/envanterde `aluplan.net.tr` bulunuyor. Kullanıcının bildirdiği adres planlama için esas alınır; eski gözlem kaydı silinmez. Bu tur bağlantı erişimi bağımsız doğrulanmadı ve site değiştirilmedi. Yeni destek altyapısı gerekmiyor; çalışma saati, SLA veya kanal sırası varsayılmıyor.

## 22.10.2026 — V3 kontrolü ve antrasit önizleme

- Claude tamamladı; eski bundle uyarısı nedeniyle ZIP yeniletildi ve `Aluplan Design System-reviewed-v3-refreshed.zip` indirildi.
- Rapor: `docs/reviews/design-v3-review/README.md`; yeniden üretilebilir patch ve verification.json yanında.
- Kullanıcı yalnız ana BG isteğini header/kartlar dahil tüm koyu yüzeylere genişletti. `docs/previews/anthracite-demo/` ayrı yerel kopyada aluplan/dark antrasit yapıldı; açık tema, içerik, bileşen ve logolar aynı.
- Orijinal ZIP token drift nedeniyle 27/28; türetilmiş önizlemede üreticiyle giderildi, 28/28 token +13/13 içerik +188 kontrast başarılı. Logo paket içi eşliği var; kullanıcının güncel Documents SVG'siyle bayt eşliği yok.
- Önizleme: http://127.0.0.1:8769/ui_kits/website/index.html?theme=aluplan&mode=dark#product — loopback sunucu, session 93934. Ekran görüntüsü docs/previews/anthracite-demo-preview.png.
- ZIP/açılmış paketler yerel ve untracked; yalnız değişiklik patch'i, rapor ve ekran görüntüsü commit edilir. Kullanıcı görsel değerlendirmesi sıradaki adım; siteye entegrasyon yok.

## 22.10.2026 — Antrasit kabulü ve schema son kontrol

Kullanıcı antrasit temayı uygun buldu; schema skilliyle ürün/paket/sürüm ve Eğitim/Destek ilişkilerinin son belge kontrolünü istedi. `docs/schema-final-review-2026-10-22.md` (proje köküne göre) güncel resmî kaynakları, karar matrisini ve eksikleri içerir. Tek Eğitim, tek destek hizmeti/iki kanal, Course list–Course Info ayrımı netleştirildi; eski ayrı özel eğitim aday notu kaldırıldı. Fiyat/yorum, TR lisans kapsamı, müşteri destek giriş URL'si ve hizmet koşulları açık. Kod/schema/site/tema değiştirilmedi; Rich Results Test ve URL Inspection yapılmadı. Sıradaki adım raporun kullanıcı değerlendirmesi ve uygulama öncesi kanıt açıklarının kapanmasıdır.

## 22.10.2026 — Üç eşikli kapanış tablosu

`docs/phase-closure-gates.md` tasarım (D01–D09), uygulama (U01–U08) ve yayın (Y01–Y07) öncesi açıkları kanıt, sorumlu rol, ekibin karar yetkisi ve kapanış ölçütleriyle toplar. Schema U05–U07/Y02 ve ticari kanıt Y05 içinde izlenir. Rol sahipleri öneridir, kişi ataması yapılmadı. Yeni tarama/test, kod, JSON-LD veya entegrasyon yok; Faz 0 tamamlandı sayılmaz. Eski sıradaki adım ve 14/30 gün notu güncel kanıtla düzeltildi.

## 22.10.2026 — D01–D03 hedefli kanıt ve onarım erteleme kararı

- `docs/00-inventory/closure-review-2026-10-22.md` sonuç dizini; dinamik, medya, URL raporları ve JSON kanıtları yanında.
- Altı sayfada 57 canlı durum kaydedildi. Eğitim/SSS/Referanslar/rehber/Civil/Ultimate kapsamı raporda; kalan ortak şablonlar ve form/video dalları açık. Aktivasyon İleri gerçek POST yapıyor; gönderimsiz gözlem sınırı korunur.
- İki AX3000 DOCX canlıda bulundu, kaynakla hash eşit; artık local-only aday değil. 86 görsel+2DOCX eşliği doğrulandı. Medya kullanım grafiği ve kalan dosyalar tamamlanmadı.
- 11 benzersiz404, dört sağlam308, 2021 slash→404; beş fragment'ten yalnız interface hedefi eksik. Destek canlı/kaynak bağlantısı artık allplan.net.tr, root→/tr200; özel müşteri akışı denenmedi.
- Kullanıcı eksik hedeflerin listelenmesini ve onarımın sonraya bırakılmasını istedi. Yeniden oluştur/uygun hedefe bağla/kaldır seçenekleri açık; satır bazında karar yok. Bu, toplu silme veya uygulama izni değil.
- Kaynak, canlı, içerik/schema ve tasarım paketi değiştirilmedi. Eski snapshot'lar korunur. Faz0 sürüyor; uygulama build/test komutları henüz yok. İndirilen ZIP/açılmış paket ve ayrı antrasit demo untracked olarak korunuyor; yalnız yeni rapor/kanıt ve devir belgeleri commit kapsamındadır.

## 22.10.2026 — Genişletilmiş içerik ve medya kontrolü

- Kullanıcı kalan envanter işlerini onayladı ve teknik kontrolleri sonunda kendisinin tek tek yapmak zorunda kalmamasını istedi. Teknik kanıt/kabul sorumluluğu ekipte; kullanıcıya yalnız gerçek içerik/ticari/faz kararları sunulacak.
- `docs/00-inventory/inventory-coverage-2026-10-22.md/json` güncel kapsam dizini. Önceki57+yen179=236 canlı durum;65kaynak aday rotası için kanıt durumu. Sayılar tam runtime kabulü değildir.
- `media-complete-2026-10-22.md/json`:503bilinen hashli görselin tamamı200/SHA eşit;1364kaynak dosya yeniden hash edildi.31aday ve345referansı kanıtlanmayan yol korunur. Yeni218dış görselden217HTTP200, biri tekrarlananDNS hatası;404 olarak sayılmadı.
- `interaction-register-2026-10-22.md/json` ve `interaction-source-evidence/`:100page girişi,65aday rota,161public kaynak snapshotı;14playlist/13koleksiyonun tüm216video kaydı saklandı (slug tekrarlarıyla242). Kaynak kaydı canlı eşlik kanıtı değildir.
- `form-state-register-2026-10-22.md/json`:harici lisans/CDS formları, ana teklif dalları ve eğitim konu varyasyonları canlıda veri/gönderim olmadan incelendi. Ana form8gözlenmedi,14kişisel alanlardan dolayı açılmadı. Aktivasyon POST/teslim/simülasyon ve güvenlik açıkları belgeli.
- Yeni hedef adayları: eğitim kütüphanesinin dört#kartı; yanlış niyetli CDS başvuru hedefleri; webinar placeholder iframe; DNS hatalı lisans görseli. Onarım ertelenmiş; hiçbir hedef değiştirilmedi.
- Kalan iş: koşullu canlı durum/medya eşleşmeleri, harici formun erişilemeyen bölümleri ve ayrı yetkili teslim/runtime testleri. Faz0 kapanışı veya sonraki faz onayı yok. Kullanıcıya teknik listeyi elle doğrulama görevi verilmez.
- Tarayıcıda iki toplu işlem zaman aşımına uğradı; diske kaydedilmeyen ara sonuçlar kabul sayılmadı. Üçüncü taraf YouTube frame alt içerikleri çıkarıldı; host içerik ve frame kimliği korundu.
- Çıktılar doküman/kanıt kapsamındadır;2026kaynağa, canlıya, tasarım paketine, içerik/schema uygulamasına dokunulmadı. Untracked design paketleri/demo commit dışında kalır.

## 22.10.2026 — Kaynak odaklı son envanter kontrolü

- Kullanıcı tekrarlı canlı kontroller yerine güncel aluplan-2026 kodunun kullanılmasını istedi. Kalan içerik/durum/hedef çözümlemesi kaynak üzerinden; canlı yalnız yayın farkları ve belirsiz hedefler için. Kaynak kanıtı canlı çalışma kabulü değildir.
- remaining-source-checks-2026-10-22.md/json:65aday rota sınıflandı,22gizli dal yok,1harici CTA,42etkileşimli.376medya yolu ayrıldı ve korunuyor; yayın/silme kararı verilmedi. global-state-source-review-2026-10-22.md ortak bileşen kaynak kayıtlarını tamamlar.
- browser-final90 + browser-modules-final31 ek durum; önceki236ile357gözlem. Tekrarlı canlı tarama durduruldu, geçici sekmeler kapatıldı. Bu sayı başarılı test veya tam runtime kapsamı değildir.
- schema skilliyle güncel resmî kurallar yeniden doğrulandı: docs/schema-inventory-impact-2026-10-22.md stratejiye bağlandı. Webinar Event rich result, video yayın tarihi/üretici ve formdan hak türetmeme sınırları eklendi. /products/allplan kaynağındaki30gün iddiası ortak çelişki kaydına bağlandı.
- docs/00-inventory/inventory-decision-brief-2026-10-22.md yalnız dört operasyon/ticari kararı ayırır.404onarımı zaten erteli. Harici Forms8/14içeriği yetkili yapı olmadan hâlâ bilinmiyor; bunu kaynak kontrolüyle kapatmadık. Faz0tam kapanışı/sonraki faz/uygulama onayı yok.
- Önce sonraki faza geçmeden dış form kanıtını veya açık istisna kararını ele al; sonra faz kapanışını sun. Teknik testleri kullanıcıya tek tek devretme. Kaynak/site/tasarım/schema uygulaması değişmedi; yalnız kanıt/doküman. İndirilen design paketleri/demo commit dışında korunur.

## 22.10.2026 — Kullanıcının Forms yönetici bağlantısı

Kullanıcı düzenleme bağlantısını paylaştı; mevcut oturumla yalnız alanlar ve dallanma görüntülendi. docs/00-inventory/form-admin-2026-10-22.md/json14bölüm/24soruyu ve13dal gözlemini kaydeder. Önceki8/14içerik açığı kapandı:8Scalypso deneme onayı,14gizlilik/kullanım onayı. Scalypso seçimi8i atlayıp13e gidiyor. Yanıtlar okunmadı, form değiştirilmedi veya gönderilmedi. Yönetici URLsi rapora alınmadı. İçerik/schema/site kodu değişmedi. Önceki form yapısı bekleme adımı artık gerekli değil; sonraki adım kalan operasyon kararlarıyla faz kapanışını değerlendirmek. Faz geçişi otomatik değil.

## 22.10.2026 — Kullanıcının form, eğitim ve deneme açıklaması

- Mevcut site işletiminin kullanıcı açıklamasına göre hedefi ana Aluplan Teklif & Talep Formu: `https://forms.office.com/r/hXhnKAG912`. Kullanıcı tüm sitede bu tek forma geçildiğini, Pythonpart/Scalypso'nun ayrı CDS formuna gitmesinin hatalı olduğunu teyit etti. Yanlış hedefler düzeltme listesinde; bu tur link değiştirilmedi. Bu geçmiş/mevcut kullanım bilgisidir; 2027 için tek form mimarisi kararı değildir. Destek ticket/Teams, üretici indirme ve mevcut lisans işlemleri bu açıklamayla satış formuna yönlendirilmez.
- Eğitim fiilen dönemsel webinarlar ve YouTube üzerinden yayımlanan geçmiş webinar listesidir. Düzenli eğitim takvimi veya sürekli kurs kataloğu varsayılmayacak. Özel eğitim talepleri de alınabilmeli; tek Eğitim başlığı korunur, ayrı hizmet sayfası oluşturma kararı yok. Fiyat, sertifika, süre veya kesin program taahhüdü eklenmez.
- Paket hakları ve deneme koşullarını Aluplan yetkilileri takip ediyor; belirli kişi adı bildirilmedi. Türkiye koşulları ve14/30gün çelişkisi bu sorumluluk açıklamasıyla doğrulanmış sayılmaz.
- Deneme indirmesi Almanya/ALLPLAN'ın resmî sayfasında gerçekleşir. Türkiye'den yönlendirilen talepleri kısa bilgilendirme/lead formuyla toplamak ayrı ticari amaçtır; ana formun Bölüm11 Download Formları bu niyeti taşır. Lead kaydı indirme, lisans aktivasyonu veya satın alma tamamlandı anlamına gelmez.
- Henüz açık uygulama tercihi: lead adımı indirme öncesinde zorunlu mu, isteğe bağlı mı olacak? Kullanıcı bu sırayı/zorunluluğu belirtmedi. Öneri: indirmeyi engellemeyen kısa bilgi/takip talebi; henüz kabul edilmiş karar değildir. Özel eğitim niyetinin seçilecek form yapısında nasıl kaydedileceği ve teslimat sorumlusu da planlamada belirlenir; mevcut formda özel eğitim alanı varmış gibi davranılmaz.

Güncel kısa karar özeti: docs/00-inventory/inventory-decision-brief-2026-10-22.md. Önceki açık soruların tekrar sorulması yerine bu açıklama esas alınır. Uygulamaya geçilmedi.

### 22.10.2026 — Form mimarisi kararının düzeltilmesi

Kullanıcı yeni site için tek teklif formu kullanma kararının henüz verilmediğini açıkça belirtti. Tek form, niyete özel birden fazla form veya ortak veri/operasyon merkezine bağlı farklı girişler ayrıntılı olarak karşılaştırılıp planlanacak. Mevcut ana form ve yanlış CDS hedefleri envanter gerçeğidir; gelecekte aynı formu kullanma zorunluluğu değildir. Form sayısı, arayüz, altyapı, teslimat ve indirme öncesi lead zorunluluğu henüz açık. Uygulama veya hedef değişikliği yapılmadı.

## 22.10.2026 — Üç kullanıcı yolunun yeniden planlanması

[Teklif, deneme ve eğitim planı](docs/customer-request-journeys.md) tek koşullu form, bağımsız kısa formlar ve ortak kayıt sözleşmesine bağlı niyet girişlerini karşılaştırır. Öneri: niyete özel kısa girişler, isteğe bağlı deneme yardımı, formsuz webinar arşivi ve özel eğitim talebi. Bunlar kullanıcı kararı değildir; form sayısı/araç/altyapı henüz seçilmedi. Alanlar, teslimat-hata davranışı, ölçüm sınırları ve schema ilişkileri belgelendi. Kullanıcı mevcut yapının doğruluğunu varsaymadan yeniden planlama istedi; bu hedefli UX çalışması bütün Faz1'in tamamlandığı anlamına gelmez. Kod/form/URL/schema uygulaması yok. Sıradaki adım önerilen üç akışın kullanıcı değerlendirmesi; ardından araç/maliyet ve hedef geçiş planı.

## 22.10.2026 — Form platformu karşılaştırması

Kullanıcı niyete özel kısa girişler/ortak takibi mantıklı buldu ve Forms–Next.js karşılaştırmasını istedi. [Platform değerlendirmesi](docs/form-platform-comparison.md) kurulum, lisans/altyapı, bakım, kayıt/teslimat, ölçüm ve schema etkisini aynı kapsamla karşılaştırır. Uzun vadeli aday Next.js + mevcut uygun operasyon hedefi; teknik bakım ayrılmayacaksa Forms daha sürdürülebilir alternatif. Bu bir seçim değildir. Tahmini iş yükleri planlama aralığıdır; mevcut Microsoft lisansı, connector hakları, takip hedefi ve kapasite bilinmeden kesin ücret yok. Yeni CRM/Forms'a gizli POST/uygulama kurulumu önerilmiyor. Sıradaki adım mevcut haklar, takip hedefi ve bakım sorumluluğuyla platform seçimini netleştirmek. Kod, canlı form veya JSON-LD değiştirilmedi.

## 22.10.2026 — Next.js yönü kabul edildi; seçenek kapsamı korunuyor

Kullanıcı Next.js içinde kısa formlarla ilerlemeyi onayladı; henüz kod yazılmayacak. Önceki platform seçimi açık notları tarihsel olarak aşıldı. [Alan, takip ve schema sözleşmesi](docs/request-forms-contract.md) güncel plandır. Kullanıcı mevcut formun üç kategorisi altında çok sayıda seçenek olduğunu hatırlattı: üç çekirdek niyet ürün/eklenti seçeneklerini azaltmaz veya ekran sayısını dondurmaz. Bölüm1–14kapsam eşlemesi eklendi; öğrenci lisansı ve mevcut müşteri eklenti temini ayrı alt yol olarak korunur. Çoklu ürün/modül ilgisi kaybolmaz. Deneme formunun zorunluluğu, gerçek takip hedefi/sorumluları ve hukuki metinler henüz açık; yeni CRM veya site/form/schema uygulaması yok.

## 22.10.2026 — Yeni form sözleşmesi schema kontrolü

Schema v2.0.0 skill okundu, Google ürün varyantları/yazılım/ürün snippet/kurs/genel kurallar ve softwareVersion yeniden doğrulandı. docs/form-schema-review-2026-10-22.md raporu: doğrudan ihlal yok; otomatik ProductGroup, kaynak sürümü–açık sürüm tercihi ve Eğitim hizmeti–arşiv sayfa amacı ayrımı netleştirildi. docs/request-forms-contract.md açıklamaları güncellendi. Fiyat/yorum olmadan rich result uygunluğu yok; semantik tür geçerliliği ayrı. Kod, schema veya canlı form değişmedi; Validator/RRT/Search Console çalıştırılmadı. Önceki operasyon kararları açık; bu inceleme yeni ticari karar gerektirmiyor.

## 22.10.2026 — Kalıcı bilgi mimarisi taslağı

[Menü, sayfa görevleri ve kullanıcı yolları](docs/site-information-architecture.md) hazırlandı. Öneri: altı ana menüyü koruyup Eğitim ve Destek için görünür yardımcı giriş; kalıcı ürün/paket ile yıllık yenilikleri ayırmak; fiyat yayımlamadan kapsam karşılaştırması ve teklif yolu. 131 satırlık route eşlemesi özgün URL kanıtını korur; eksik hedefler ertelenen karar listesinde kalır. Eğitim önceki “takvim” adaylarından farklı olarak dönemsel webinar, video arşivi ve eğitim talebi üzerinden planlanır. Bu hedefli analiz Faz0/1 kapanışı veya uygulama onayı değildir. Yeni canlı tarama, kod, JSON-LD ya da tasarım entegrasyonu yok. Sıradaki adım: navigasyon ve kullanıcı yollarını kullanıcı değerlendirmesine sunmak; onay sonrası sayfa şablonu/blok gereksinimlerini hazırlamak.

## 22.10.2026 — Sayfa şablonları ve gerçek ana sayfa blokları

Kullanıcı bilgi mimarisi sonrasında şablon/blok planına ilerlemeyi kabul etti. `docs/page-template-requirements.md`: 12 şablon ailesi, ortak blok sözleşmesi, veri/sunum/schema/talep sınırı, durumlar, yıllık bakım ve kabul kriterleri. `docs/homepage-block-plan.md`: kaynakta aktif sekiz gövde bileşeninin 8/8 eşlemesi, 20/20 hizmet kaydı ve global kabuk. Referans bloğu kaynakta yok; yeni öneri olarak ayrıldı. TechSpecs altı kartın aynı PDF hedefi, InnovationsTeaser /products hedefi ve Eğitim render hedefi kaydedildi; değiştirilmedi. Tam metin/UI paritesi veya erişilebilirlik testi tamamlandı iddiası yok. Kod, canlı site, form, schema ve design system entegrasyonu yapılmadı. Sıradaki adım: blok planını kullanıcıya sunmak; kabul sonrası mevcut içerikle düşük ayrıntılı ana sayfa yerleşim önizlemesi için ilerlemek. Faz0/PRD/uygulama sınırları korunur.

## 22.10.2026 — Bağımsız ana sayfa yerleşim önizlemesi

Kullanıcının “ok görelim” talebiyle `docs/previews/homepage-wireframe/` altında kaynak içerikle bağımsız statik önizleme hazırlanıyor. Antrasit sunum; içerik verisi, tema tokenları ve yerleşim ayrı dosyalarda. Aktif uygulama/Next.js, schema veya form altyapısına entegre edilmez. Yerel sunucu: proje kökünden `python3 -m http.server 8770 --bind 127.0.0.1`; önizleme `/docs/previews/homepage-wireframe/`. Bu izin görsel yerleşimi görmek içindir; ürün iddiaları ve tüm fazların kabulü değildir. Sonuç: rol değişimi tarayıcıda doğrulandı; Mühendis seçilince ilgili içerik/hedef değişiyor ve altı ürün erişilebilir kalıyor. Sekiz bölüm ve20hizmet erişilebilirlik ağacında görüldü; antrasit görünüm kontrol edildi, tarayıcı error logu boş. Bağımsız code-review kritik/yüksek sorun bulmadı. Tam mobil/erişilebilirlik veya içerik paritesi kabulü değildir. Hero/BIMFlex medya alanları temsilidir; bazı sabit metinler HTML içindedir. Sıradaki adım kullanıcıdan bölüm sırası ve hizmet görünürlüğü geri bildirimi.

## 22.10.2026 — Ana sayfa yerleşiminin geçici kabulü

Kullanıcı bağımsız ana sayfa önizlemesini “şu an için uygun” buldu; daha sonra değişiklik yapılabileceğini belirtti. `docs/previews/homepage-wireframe/` içindeki mevcut bölüm sırası ve sunum, sonraki çalışmalara geçici yerleşim referansıdır. Bu karar nihai görsel tasarım, tam içerik paritesi, ticari iddialar, form zorunluluğu, PRD/faz kapanışı veya üretim entegrasyonu onayı değildir. Bu tur önizleme değiştirilmedi. Sıradaki öneri: kabul edilen yerleşimin tasarım sistemi bileşenleriyle eşlemesini planlamak; yeni uygulama çalışması için kullanıcı yönlendirmesini beklemek.

## 22.10.2026 — Tasarım sistemi bileşen eşlemesi

Kullanıcı devam talebiyle kabul edilen yerleşimi tasarım sistemi bileşenlerine eşleme planı hazırlandı: `docs/design-system-component-mapping.md`. H01–H08, kabuk, token zinciri, veri/schema ayrımı ve uyarlama sırası kaydedildi. Kaynak incelemesi: RoleSelector kullanılabilir fakat demo ürün filtresi altı kartı koruyan homepage davranışıyla aynı değil; Header düz menü, çok seviyeli gezinme/arama/tema uyarlaması gerekiyor; demo içerik sözleşmesi proje sözleşmesinin yerine geçmez. Tabs/ReleaseTag eski bulguları güncel kaynakta düzelmiş; runtime kabulü ayrı. İndirilen paket, antrasit kopya, wireframe ve uygulama değiştirilmedi. Sıradaki öneri: ayrı görsel önizlemede header/hero/rol-ürün/hizmet bloklarını gerçek design system ile hazırlamak; entegrasyon yapılmadı.

## 22.10.2026 — Gerçek tasarım sistemiyle ana sayfa kesiti

Kullanıcının “ok go” talebiyle `docs/previews/anthracite-demo/ui_kits/homepage/` altında ayrı prototip hazırlandı; kontrol özeti `docs/design-system-homepage-preview-review.md`. Gerçek paket bileşenleri ve antrasit tokenlarıyla header temsili, hero, hızlı erişimler, rol/altı ürün, çözümler ve 20 hizmet gösterildi. Rol değişimi ve altı ürünün korunması tarayıcıda doğrulandı; console error yok. Code review kritik/yüksek bulgu vermedi. Mega menü/arama/tema bu kesitte yok; hero medya alanı temsilî. Form, backend, izleme, schema ve Next.js entegrasyonu yok. Türetilmiş antrasit paket önceki karar gereği Git dışında; rapor/devir commit kapsamındadır. Sıradaki adım kullanıcı görsel değerlendirmesi; kabul edilirse aynı dilin H05/H07/H08 ayrıntılarına genişletilmesi.

## 22.10.2026 — Header eylemleri sadeleştirildi

Kullanıcı `Teklif İste` etiketini kabul etti; teklif ve ücretsiz deneme zaten hero'da bulunduğu için ikisinin de header'dan kaldırılmasını istedi. Ayrı tasarım sistemi önizlemesi buna göre güncellendi: header gezinme odaklı, hero `Teklif İste` + `Ücretsiz Deneme`. Canlı site/Next.js/form hedefi değiştirilmedi. Sıradaki adım güncel önizlemenin görsel kontrolü ve kullanıcı değerlendirmesi.

## 22.10.2026 — Keskin kart dili ve padding normalizasyonu

Kullanıcı yuvarlatılmış kartları reddetti ve önceki keskin, ince çizgili kart dilini seçti. Önizlemede `aluplan` semantic tema tokenı `radius.surface = 0` yapıldı; ürün, çözüm, hizmet, rol ve hero medya panelleri 0 px köşe ve mevcut 1 px sınır tokenını kullanır. Kontroller 4 px, rozetler kendi pill anatomisinde kalır. Yoğunluk semantic tokenlardan 16 px kompakt / 24 px standart / 32 px büyük panel olarak üretilir; dar görünüm 16 px'tir. Ürün kartları aynı satırda eşit yüksekliğe bağlandı.

İlk kod incelemesi primitive tokenların önizleme CSS'inde doğrudan kullanılmasını yüksek öncelikli buldu; değerler `tokens/tokens.json` içindeki tema semantic override'larına taşındı ve engel kapandı. Son incelemedeki 6/8 px uyarısı, kullanıcının daha sonraki açık 0 px tercihiyle geçersizdir. `build-tokens --check`, 28/28 token, 13/13 içerik ve 188/188 kontrast kontrolü geçti; patch temiz kaynakta `git apply --check` ile doğrulandı. Tarayıcıda 0/16, 0/24 ve 0/32 ölçüleri ile 228/228/228 ürün kartı yüksekliği doğrulandı. İçerik, URL, schema, form, canlı site ve Next.js değiştirilmedi. Sıradaki adım bu keskin kart dilinin kullanıcı görsel değerlendirmesi; kabul edilmeden H05/H07/H08 ayrıntılarına veya entegrasyona geçme.

## 22.10.2026 — Kalan ana sayfa blokları önizlemede tamamlandı

Kullanıcı keskin `radius: 0` kart dilini kabul edip devam etti. Ayrı antrasit tasarım sistemi önizlemesine H05 paket/PDF erişimi, H07 BIMFlex ortaklık alanı ve H08 ALLPLAN 2026 yenilikleri eklendi. Sıra H04 çözümler → H05 paketler → H06 profesyonel hizmetler → H07 BIMFlex → H08 yeniliklerdir. `docs/previews/homepage-wireframe/data.js` içerik katmanıdır; görünüm ayrı paket kopyasındadır. Form, schema/JSON-LD, Next.js ve canlı siteye dokunulmadı.

H05'te altı kart ve bölüm CTA'sı aynı mevcut PDF hedefine gider; fiyat yoktur. BIMFlex, FlexSoft çözümü/Aluplan satış ortaklığı olarak tutulur; dört kaynak medya varlığı patch'e ikili olarak eklendi. Kaynaktaki kanıtsız `saatlerden saniyelere` iddiası güçlendirilmedi ve yayın öncesi doğrulama bekler. H08 üç kaynak kartı ve mevcut `/products` hedefini korur; 2026 için güncel sürüm statüsü üretilmez.

Testler: homepage sözleşmesi 9/9, token 28/28, içerik 13/13, kontrast 188/188; temiz kaynakta patch apply check geçti. Tarayıcı kabulü: yedi PDF bağlantısı tek hedef, dört BIMFlex görseli yüklü/doğru alt, üç yenilik kartı, tek `h1`, radius `0px`, 390 px yatay taşma `0`, console error `0`. Code review'un bulduğu tanımsız spacing tokenı ve Badge/figcaption uyarıları düzeltildi; ikinci inceleme onaylandı. Kanıt: `docs/previews/anthracite-homepage-complete.png`; ayrıntı: `docs/design-system-homepage-preview-review.md`; patch: `docs/reviews/design-v3-review/anthracite-preview.patch`.

Bu tamamlanma yalnız görsel önizleme kapsamındadır. Türetilmiş paket Git dışında kalır. Sıradaki adım kullanıcı görsel değerlendirmesidir; yeni uygulama kurulumu, entegrasyon veya faz geçişi için ayrıca onay gerekir.

## 22.10.2026 — Ayrı mimari pafta konsepti, aşama 1

Kullanıcı mevcut önizlemenin korunmasını ve kökte ayrı klasörde ek prompta göre yeni örnek hazırlanmasını istedi. `architectural-sheet-concept/` oluşturuldu; özgün talimat `USER-PROMPT.md`, tasarım gerekçesi/kompozisyon/token önerisi `README.md` içinde. Prompt çalışma sırası 1 açıkça koddan önce onay beklemeyi istediği için bu adımda uygulama kurulmadı. Sonraki adım kompozisyon ve konsepte özel turuncu token eklerinin kullanıcı onayı; sonra token/pafta bileşenleri. Önceki önizleme değiştirilmedi. Public URL ve schema stratejisi korunur; prompttaki otomatik Türkçe rota ve toplu schema adayları uygulama kararı sayılmaz. Performans hedefleri ölçülmüş sonuç değildir.

## 22.10.2026 — Mimari pafta konsepti aşama 2

Kullanıcı aşama 1 kompozisyon/turuncu yönünü `uyguun` ile onayladı. Ayrı `architectural-sheet-concept/` içinde Next.js 16.4.2/React19.3.1/TypeScript strict temel, sheet token teması ve server-rendered pafta bileşen kataloğu oluşturuldu; önceki antrasit önizleme korunur. Yerel production preview http://127.0.0.1:8771/ (session 66247). Ana sayfa henüz yapılmadı; `/` bileşen kataloğu. Komutlar ve dosya ayrımı klasör README'sinde.

Kontroller: 6/6 test, TypeScript/production build, 282 kontrast çiftinde 0 hata; fonts58.728bayt; masaüstü ve390CSSpx yatay taşma0; native details JS kapalı çalıştı; reduced-motion scroll auto/animation none; font semantic override runtime doğrulandı; konsol0hata/uyarı. Kod incelemesi semantic font bypass/root scope ve accessible heading/motion uyarılarını kapattı, onaylandı. Kanıt `architectural-sheet-concept/evidence/verification.json` ve `components-preview.png`.

Açık performans kabulü: framework dahil ilk HTML'nin harici script gzip toplamı179.860bayt; <90KB hedefi sağlanmadı (inline hariç alt sınır, gerçek transfer ölçümü değildir). Lighthouse/CWV/INP ve turuncu oranı ölçülmedi. Ana sayfa/ürün detayı/tablar/schema henüz yok. Promptun her adım sonu değerlendirme kuralına göre sıradaki adım kullanıcı bileşen yönünü değerlendirdikten sonra aşama3 ana sayfa örneğidir. Mevcut ana site entegrasyonu veya yayın yapılmadı.

## 22.10.2026 — Kullanıcı isteğiyle ara / tasarım değerlendirmesi açık

**Güncel durum: çalışma duraklatıldı.** Kullanıcı mimari pafta önizlemesinin tasarım olarak içine sinmediğini, eksik bir şeyler hissettiğini belirtti ve ara verilmesini istedi. Bileşenlerin teknik kontrolü görsel tasarım kabulü değildir. Önceki kompozisyon onayı son render'ın kabul edildiği şeklinde yorumlanmaz. Ana sayfa/ürün detayına otomatik ilerleme.

Son uygulama commit'i `0659d86` (mimari pafta bileşen sistemi); önceki antrasit ana sayfa `a1f0025`, yeni konsept brifi `a72876b`. İki alternatif de korunur: eski önizleme http://127.0.0.1:8770/docs/previews/anthracite-demo/ui_kits/homepage/?v=6 ; ayrı pafta kataloğu http://127.0.0.1:8771/ . Portlar yerel süreçlere bağlıdır; sonraki oturumda erişim yeniden doğrulanır. Uygulama kurulumu/komutları `architectural-sheet-concept/README.md` içindedir.

Son doğrulama: 6/6 test, TypeScript ve build geçti; 282 kontrast çifti, mobil/JS kapalı/native details/reduced-motion kontrolleri kayıtlı. Bu ara turunda yalnız dokümantasyon değişti, testler yeniden çalıştırılmadı. Açık teknik konu: framework dahil ilk harici JS gzip179.860bayt,90KB hedefinin üstünde; Lighthouse/CWV ölçülmedi. Görsel yön kabul bekliyor; eksiklikler kullanıcı tarafından henüz tek tek tarif edilmedi.

Git dışında kullanıcı ZIP'i, `Aluplan Design System/`, `docs/previews/anthracite-demo/`, `docs/reviews/design-v3-initial/` ve `docs/reviews/design-v3-refreshed/` korunur. Önceki karar gereği bu paketler commit'e eklenmedi; antrasit değişiklikleri yeniden üretilebilir patch'te, yeni pafta kodu ve varlıkları ise `0659d86` içinde takip edilir. Kaynak2026/canlı site değiştirilmedi; push veya deploy yapılmadı.

**Güvenli devam sırası:** başlangıç belgelerini oku → Git ve mevcut önizlemeleri doğrula → kullanıcının tasarımda eksik bulduğu noktaları ve beğendiği referansları konuş → görsel yönü yeniden netleştir → ancak sonra yeni tasarım revizyonuna ilerle. Sıradaki adım kod yazmak değil, tasarım yönünü kullanıcıyla yeniden değerlendirmektir.

## 25.10.2026 — Faz 0 (İçerik Envanteri) kapanışı ve ücretsiz deneme hedefi kararı

- Kullanıcı **Faz 0 — İçerik Envanteri** aşamasının kapatılmasını onayladı.
- Eski kaynaklarda yer alan **14 gün / 30 gün ücretsiz deneme süresi çelişkisi** kullanıcı kararıyla kapatıldı: Yeni sitede tüm ücretsiz deneme CTA'ları doğrudan ALLPLAN resmî sayfasına (**`https://www.allplan.com/trial-or-subscription/`**) yönlendirilecek ve süre/koşul üretici sayfasında yönetileceği için sitede çelişkili gün sayısı vaadi yer almayacak.
- Güncellenen dosyalar: `HANDOFF.md`, `docs/00-inventory/user-decisions.md`, `docs/00-inventory/content-inventory.md`, `docs/00-inventory/inventory-coverage-2026-10-22.md`, `docs/00-inventory/inventory-decision-brief-2026-10-22.md`, `docs/phase-closure-gates.md`, `docs/request-forms-contract.md`, `docs/customer-request-journeys.md`.
- **Sıradaki adım:** Faz 0 tamamlandığı için kullanıcı onayıyla **Faz 1 — UI/UX Analizi (`docs/ux-audit.md`)** aşamasına geçmek.

## 25.10.2026 — Faz 1 (UI/UX Analizi) tamamlandı (`docs/ux-audit.md`)

- Kullanıcı onayıyla Faz 1 çalışması yürütüldü ve `docs/ux-audit.md` oluşturuldu.
- Rapor; bilgi mimarisi ve dönüşüm (`IA-01`..`IA-07`), görsel hiyerarşi ve marka algısı (`VH-01`..`VH-04`), mobil deneyim ve dokunma hedefleri (`MB-01`..`MB-04`), WCAG 2.2 AA erişilebilirlik borcu (`A11Y-01`..`A11Y-05`), mikro-metin ve durum yönetimi (`CR-01`..`CR-04`), 5 temel persona (`P1–P5`) ve ekran bazlı bulgu/öneri matrisini dosya/satır kanıtlarıyla kapsar.
- **Sıradaki adım:** `docs/ux-audit.md` (Faz 1) için kullanıcı onayı; onaylandıktan sonra **Faz 2 — Teknik Analiz (`docs/baseline-report.md`)** aşamasına geçmek.

## 25.10.2026 — Faz 1 onayı, ayrı commitler ve Faz 2 (`docs/baseline-report.md`) tamamlanması

- Kullanıcı Faz 1 (`docs/ux-audit.md`) raporunu onayladı ve her faz/bulgu adımının kaybolmaması için ayrı ayrı commitlenmesini istedi.
- Commitler: `7daf574` (`docs: close phase 0 inventory and resolve trial CTA target`) ve `d3cf14e` (`docs: complete phase 1 ux audit report`).
- Faz 2 çalışması yürütülerek `docs/baseline-report.md` üretildi:
  - **Performans:** Medyan TTFB 541 ms (maks 869 ms), maks HTML 306 KB (`/references`), 19,81 MiB hero video (`hero-bim.mp4`), çift kopyalı 12,03 MiB MP4 varlıkları, 23 script chunk'ı, render-blocking Google Fonts CSS `@import`, gereksiz `three`/`r3f`/`gsap` bağımlılıkları.
  - **SEO:** 112 HTTP 200 sayfasının yalnızca **4 tanesinde (%3,6)** self-referencing canonical doğru (92 sayfa `/` köküne, 16 ürün sayfası `/products`'a işaret ediyor); **58 sayfada (%51,8)** aynı varsayılan `<title>` ve **59 sayfada** aynı `<meta name="description">`; `sitemap.ts` içinde 7 adet 404 URL + `/health` varken `/references` ve `/solutions-v2/training` eksik; 14 video sayfasında çift `<h1>`, 4 sayfada `<h1>` yok.
  - **GEO:** `/llms.txt` yok; 111 sayfada yalnız `BreadcrumbList` JSON-LD var (`Organization`, `WebSite`, `SoftwareApplication`, `Product`, `Service`, `VideoObject` 0 adet).
  - **Güvenlik & Uyumluluk:** `next.config.js` ve `middleware.ts` arasında çakışan çift CSP (`'unsafe-inline'` / `'unsafe-eval'`), `/api/send-activation-email` içinde HTML injection + `SSLv3` + `rejectUnauthorized: false` + rate-limit/CSRF eksikliği, açık kalan `/hero-3d` ve `/test-webgl` rotaları, rıza tercihini okumadan yüklenen Google Analytics (`GT-5TQ6VQ4` / `G-DQYT0D9MQ5`).
- **Sıradaki adım:** `docs/baseline-report.md` (Faz 2) için kullanıcı onayı; onaylandıktan sonra **Faz 3 — PRD Dokümanı (`docs/PRD.md`)** aşamasına geçmek.

## 25.10.2026 — Faz 2 onayı ve Faz 3 (`docs/PRD.md`) tamamlanması

- Kullanıcı Faz 2 (`docs/baseline-report.md` — commit `b377f6c`) raporunu onayladı.
- Faz 3 çalışması yürütülerek 13 bölümlü kapsamlı `docs/PRD.md` oluşturuldu:
  1. Vizyon ve ölçülebilir KPI hedefleri (%100 içerik/URL paritesi, %100 doğru canonical/title, LCP < 2.5s, INP < 200ms, CLS < 0.1, TTFB < 200ms, Lighthouse 90+, WCAG 2.2 AA).
  2. Kapsam içi / kapsam dışı sınırları.
  3. 5 temel persona (`P1–P5`) ve kullanıcı senaryoları.
  4. Bilgi mimarisi (131 rota, kalıcı ürün/paket/sürüm ayrımı, gezinme odaklı Header).
  5. İçerik koruma, fark kaydı ilkesi ve 308/301 yönlendirme + 11 adet ertelenmiş 404 haritası.
  6. Semantik token zinciri (`Primitive → Semantic → Component`), keskin kart dili (`radius.surface = 0px`), Antrasit koyu & açık tema ve yerel WOFF2 fontlar (`Manrope`, `IBM Plex Sans`, `IBM Plex Mono`).
  7. Ana sayfa `H01–H08` blokları, `T01–T12` sayfa şablonları ve Next.js kısa talep formları + doğrudan `https://www.allplan.com/trial-or-subscription/` deneme hedefi.
  8. NFR (Performans, WCAG 2.2 AA, SEO, GEO `/llms.txt` + `@id` JSON-LD, güvenlik ve KVKK rıza yönetimi).
  9. Next.js (App Router, SSG öncelikli Server Components) teknoloji yığını ve alternatif karşılaştırması.
  10. DevOps planı, CI/CD kalite kapıları, Docker/Coolify dağıtımı ve < 2 dk geri alma (rollback) planı.
  11. Otomatik parite, SEO, kontrast, erişilebilirlik ve güvenlik test stratejisi.
  12. Yayına geçiş (cutover) adımları ve SEO kaybını önleme kontrol listesi.
  13. Faz kabul kriterleri, riskler ve açık kararların durumu.
- **Sıradaki adım:** `docs/PRD.md` (Faz 3) için kullanıcı onayı; onaylandıktan sonra **Faz 4 — Design System (`design-system/`)** aşamasına geçmek.

## 25.10.2026 — Faz 3 (PRD) onayı ve Faz 4 (`design-system/` — Antrasit Tasarım Sistemi) kurulumu

- Kullanıcı Faz 3 (`docs/PRD.md` — commit `ffead59`) dokümanını onayladı ve **Antrasit tasarım sistemi** üzerinden ilerlenmesini kararlaştırdı.
- `design-system/` dizini altında resmi Faz 4 çıktı yapısı oluşturuldu:
  - `design-system/tokens/`: `tokens.json` (171 primitive, 161 semantic, 66 component alias token), üretilmiş `primitives.css`, `semantic.css`, `component-aliases.css`, `fonts.css` ve `tokens/build/` (`CONTRAST-REPORT.md` — 188/188 WCAG 2.2 AA kontrast doğrulaması, 0 hata; `breakpoints.json|mjs`).
  - `design-system/components/`: Temel ve Aluplan kalıp bileşenleri (`actions`, `brand`, `disclosure`, `feedback`, `forms`, `layout`, `navigation`, `patterns`, `surfaces`, `typography`) + `base.css` ve `responsive.template.css` / `responsive.generated.css`.
  - `design-system/assets/`: Yerel WOFF2 fontlar (`Manrope`, `IBM Plex Sans`, `IBM Plex Mono` + OFL lisansları), logolar (`aluplan-logo-white.svg`, `aluplan-logo-white-filled.svg`, `aluplan-logo-black.svg`) ve 31 ikonluk Lucide alt kümesi.
  - `design-system/catalog/index.html`: Canlı etkileşimli stil rehberi.
  - `design-system/ui_kits/homepage/index.html` + `design-system/data/homepage-data.js`: Keskin kart dili (`radius.surface = 0px`, `16/24/32 px` yoğunluk) ve `H01–H08` ana sayfa kesiti.
  - Doğrulama: `node design-system/scripts/build-tokens.mjs --check` → `0 errors` (`contrastChecks: 188, contrastFails: 0`).
- **Sıradaki adım:** `design-system/` (Faz 4) için kullanıcı onayı; onaylandıktan sonra **Faz 5 — Ana Sayfa Tasarımı** aşamasına geçmek.

## 25.10.2026 — Faz 4 onayı ve Faz 5 (Ana Sayfa Tasarımı) tamamlanması

- Kullanıcı Faz 4 (`design-system/` — commit `bdcacda`) çalışmasını onayladı.
- Faz 5 kapsamında:
  - `design-system/ui_kits/homepage/HomepagePreview.jsx` ve `preview.css` üzerinde tam içerik paritesi tamamlandı: Hero 14 teknik etiketi, Koyu/Açık (`dark`/`light`) mod geçiş kontrolü, `H01–H08` sekiz ana sayfa bloğu, 20 profesyonel hizmet kaydı, 6 ürün ve 5 çözüm bağlantısı, Ataşehir/İstanbul adresi, 3 telefon numarası, `info@aluplan.com.tr`, 5 sosyal medya hesabı, 3 yasal sayfa bağlantısı ve `"Design & Develop by Hazar Volga Ekiz"` geliştirici kredisi eksiksiz yer alıyor.
  - `docs/homepage-design-proposal.md` oluşturularak 3 ana sayfa tasarım yönü (*Yön 1: Keskin Hatlı Antrasit Mühendislik Sistemi [Seçilen]*, *Yön 2: Yapısal İndeks / Wireframe*, *Yön 3: Mimari Pafta Konsepti*) karşılaştırıldı ve `H01–H08` blok eşlemesi ile responsive kırılımlar belgelendi.
  - Doğrulama: `homepage-preview-tests.mjs` (9/9), `token-tests.mjs` (28/28, 188/188 kontrast), `content-tests.mjs` (13/13) eksiksiz geçti.
- **Sıradaki adım:** Faz 5 (`docs/homepage-design-proposal.md` ve `design-system/ui_kits/homepage/index.html`) için kullanıcı onayı; onaylandıktan sonra **Faz 6 — Geliştirme (`src/`)** aşamasına geçmek.

## 25.10.2026 — Faz 5 onayı ve Faz 6 (`src/` Next.js Uygulaması & `docs/final-comparison-report.md`) tamamlanması

- Kullanıcı Faz 5 (`f7c7a21`) çalışmasını onayladı.
- Faz 6 kapsamında (`../aluplan-2026` klasörüne hiçbir şekilde dokunulmadan ve yalnızca `aluplan-2027/docs/00-inventory/` içindeki yerel envanter kullanılarak):
  - **Veri ve İçerik Katmanı (`src/data/` & `scripts/generate_site_data.py`):** 110 aktif HTTP 200 rotasının tamamı (`src/data/pages.json`), 14 eğitim video oynatma listesi / 216 tekil video (`src/data/playlists.json`), gezinme menüleri (`src/data/navigation.json`), `H01–H08` ana sayfa verisi (`src/data/homepage.json`), arama dizini (`src/data/search-index.json`) ve 10 indirilebilir PDF/DOCX belgesi (`public/docs/`) üretildi.
  - **Next.js App Router Uygulaması (`src/app/`, `src/components/`, `src/lib/`):**
    - Onaylı Antrasit tasarım sistemi (`src/styles/globals.css`, `radius.surface = 0px`, `1px` sınır, Koyu/Açık mod, yerel WOFF2 fontlar) entegre edildi.
    - Gezinme odaklı Header (`MegaMenu`, `CommandMenu` arama `Ctrl+K`, Koyu/Açık mod geçişi), niyete özel kısa Next.js talep modalı (`quote` / `trial_assistance` / `training_request`), KVKK çerez rıza banner'ı (`CookieConsent`) ve `"Design & Develop by Hazar Volga Ekiz"` kredili Footer (`SiteShell.tsx`) kuruldu.
    - Tüm 110 rotada %100 self-referencing canonical, %100 benzersiz `<title>` ve `<meta name="description">`, %100 tekil `<h1>`, `@id` bağlantılı JSON-LD (`Organization`, `WebSite`, `BreadcrumbList`, `SoftwareApplication`, `Service`, `FAQPage`, `VideoObject`), temiz `sitemap.ts`, AI bot uyumlu `robots.ts` ve GEO `/llms.txt` (`src/app/llms.txt/route.ts`) sağlandı.
    - 4 kalıcı `308` yönlendirme ve `/solutions/imar-yonetmliği-bim-eklentisi` alias'ı `next.config.mjs` içine tanımlandı; `/api/request`, `/api/contact` ve `/api/send-activation-email` uç noktaları `escapeHtml()`, IP rate-limit ve `TLSv1.2+` ile güçlendirildi.
  - **Doğrulama:** `python3 scripts/verify_phase6_parity.py` (**27/27 PASS, 0 hata**) ve `python3 -m unittest tests/test_url_parity.py` (**5/5 OK**) geçti.
  - **Final Raporu:** `docs/final-comparison-report.md` içinde Faz 2 baseline ile Faz 6 son durumunun Önce/Sonra karşılaştırması belgelendi.
- **Sıradaki adım:** Faz 6 çıktılarının ve `docs/final-comparison-report.md` raporunun kullanıcı tarafından son onayı.

## 25.10.2026 — Faz 6 Görsel, Video, İkon ve CSP/CSS Tamamlaması

- Kullanıcının yerel önizleme (`http://localhost:3000`) geri bildirimi üzerine:
  1. **CSP `eval()` ve CSS/Font eşleme düzeltmesi (`next.config.mjs`, `src/styles/globals.css`):**
     - `next.config.mjs` içinde `script-src` yalnız geliştirme ortamında (`NODE_ENV !== 'production'`) React/Turbopack hata yığını için `'unsafe-eval'` içerecek şekilde koşullandırıldı; üretim derlemesinde kapalı tutuldu.
     - `src/styles/globals.css` içindeki WOFF2 `@font-face` dosya adları (`Manrope-400_800-normal-latin.woff2` vb.) ve `.alu-button`, `.alu-cluster`, `.alu-display`/`.alu-h1`..`.alu-h4`, `.alu-site-header__inner`, `.alu-site-nav__link`, `.alu-card__media` sınıfları eksiksiz eşlendi.
  2. **Tüm Görsel ve Video Varlıklarının Aktarımı (`scripts/sync_media_assets.py` → `public/`):**
     - `../aluplan-2026` klasörüne hiçbir şekilde yazma/değişiklik yapılmadan (salt-okunur kopyalama ile) **1.298 adet görsel ve video dosyası (159,74 MB)** `aluplan-2027/public/` altına aktarıldı (`/videos/hero-bim.mp4`, `/images/hero-poster.jpg`, 5 adet ALLPLAN Bridge `.mp4` özellik videosu, 2 adet `2024-header.mp4`, 9 adet OpenBIM partner logosu ve tüm ürün/çözüm/eklenti ekran görüntüleri).
  3. **Veri Katmanı ve Görsel/Video Eşlemesi (`scripts/generate_site_data.py`, `src/data/`):**
     - 110 sayfadaki **975 içerik görselinin tamamı (`0` eksik dosya)** ve **8 yerel `.mp4` videosu** `src/data/pages.json` içinde yerel `public/` yollarına çözümlendi.
     - `src/data/homepage.json` içine Hero video/poster, 3 rol ikonu ve görseli, 6 ürün görseli, 5 Bento çözüm görseli, 3 yenilik görseli ve 9 OpenBIM partner logosu eklendi.
  4. **Vektörel SVG İkon Sistemi (`src/components/ui/AluIcon.tsx`) ve Bileşen Entegrasyonu:**
     - Lucide tasarım sistemi ikonları ve sosyal medya/hizmet SVG ikonlarını içeren `AluIcon.tsx` oluşturularak `SiteShell.tsx`, `HomepageView.tsx` ve `SubpageView.tsx` bileşenlerine entegre edildi.
     - Alt sayfalarda (`SubpageView.tsx`) sayfa başlığı yanına Hero görseli, yerel `.mp4` video oynatıcıları, bölüm görselleri, tüm kalan ekran görüntüleri için Görsel Galeri ızgarası ve 14 eğitim serisindeki 216 video kartına YouTube küçük resimleri (`hqdefault.jpg`) + oynatma ikonu eklendi.
  5. **Doğrulama:** `python3 scripts/verify_phase6_parity.py` (**31/31 PASS, 0 hata**) ve `python3 -m unittest tests/test_url_parity.py` (**23/23 OK**) geçti.

## 25.10.2026 — Destek Portalı Hizalaması, Amiral Gemisi UI Sahnesi ve İkon/İstatistik Düzeltmesi

- Kullanıcının geri bildirimleri doğrultusunda 3 kritik iyileştirme tamamlandı:
  1. **Destek Merkezi Bağlantılarının `https://allplan.net.tr/tr` Adresine Hizalanması (Commit `c5a338f`):**
     - `scripts/generate_site_data.py`, `src/lib/site-data.ts`, `src/components/sections/SubpageView.tsx`, `src/app/llms.txt/route.ts`, `src/data/pages.json`, `src/data/homepage.json` ve `design-system/data/homepage-data.js` içinde kalan tüm eski `aluplan.net.tr` bağlantıları `https://allplan.net.tr/tr` olarak normalize edildi; `scripts/verify_phase6_parity.py` içine kalıcı kontrol (#12) eklendi (**32/32 PASS**).
  2. **Wireframe Hissinin Kaldırılması — Amiral Gemisi (Flagship) Üretim Görsel Sahnesi (Commit `4c0d1df`):**
     - `HomepageView.tsx`, `SubpageView.tsx` ve `src/styles/globals.css` güncellenerek: tam genişlikli atmosferik BIM video sahnesi (`.alu-hero-stage`), canlı BIM monitörü (`.alu-hero-monitor`), anıtsal 4'lü istatistik bandı (`.alu-hero-metrics`), hızlı komut şeridi (`.alu-quick-ribbon`), bölünmüş etkileşimli rol vitrini (`.alu-role-stage`), 12 sütunlu asimetrik Bento çözüm ızgarası (`.alu-bento-grid`), alt sayfalarda sağ/sol dönüşümlü vitrin satırları (`.alu-feature-rows`), numaralı mimari şartname kartları (`.alu-spec-grid`) ve etkileşimli modül sekmeleri (`.alu-module-tabs`) devreye alındı.
  3. **Alt Sayfa İkonlarının Büyütülme Sorunu ve Sayaç İstatistiklerinin Düzeltilmesi:**
     - `scripts/generate_site_data.py` içine PNG/JPEG piksel boyutu okuma (`get_image_dimensions` ve `is_icon_image`) eklendi: `width <= 260` veya `height <= 260` olan ya da `/icons/`, `/reasons/`, `/benefits/`, `/partners/` dizinlerindeki **76 adet küçük PNG ikon (`52×48`, `52×52`, `128×128` px)** `isIcon: true` olarak işaretlendi ve başlıkla birebir eşleşen ikonlar `sec.iconSrc` alanına, yalnızca yüksek çözünürlüklü gerçek fotoğraflar `sec.image` alanına atandı.
     - `SubpageView.tsx` içinde `heroImage`, `.alu-feature-row` (büyük sol/sağ görsel vitrinleri) ve `.alu-gallery-grid` yalnızca `isIcon: false` olan yüksek çözünürlüklü ekran görüntülerini/fotoğrafları kullanacak şekilde filtrelendi; küçük ikonlar ise `.alu-spec-card__header` içinde `52×52px` `.alu-benefit-icon` rozeti (`32×32px` `object-fit: contain`) olarak kendi doğal boyutunda ve netliğinde gösterildi.
     - Kaynak şablonlarda `statsVariant="animated"` nedeniyle SSR'da `"0"` ve `"%"` olarak yakalanan sayaç yer tutucuları temizlendi ve `docs/00-inventory/interaction-source-evidence/app/**/*.tsx` kaynaklarından gerçek istatistik değerleri (`50% DAHA KESİN`, `70% DAHA VERİMLİ`, `30% DAHA ÜRETKEN`, `93% ZAMAN TASARRUFU`, `100% TUTARLI VERİ` vb.) çekilerek `.alu-hero-metrics` performans bandında gösterildi.
  4. **Canlı Sitedeki `ROLÜNÜZÜ SEÇİN` (`PathwayProductSystem`) Sekme, Koşullu Vurgulama ve Akıcı Geçiş Efektlerinin Uygulanması:**
     - `HomepageView.tsx` (`H03 — Disiplininize Özel BIM İş Akışı`) ve `src/styles/globals.css` içine canlı sitedeki `PathwayProductSystem.tsx` etkileşim mimarisi birebir uygulandı:
       - Rol bazlı dinamik vurgu renkleri (`MİMAR`: `#3B82F6` Mavi, `MÜHENDİS`: `#10B981` Zümrüt Yeşili, `PREKAST`: `#F59E0B` Kehribar) ve arka planda `700ms` akıcı renk geçişli `.alu-pathway-glow` ambiyans ışığı.
       - Aktif sekmede büyüyen (`scale(1.05)`), rol renginde ışıldayan nokta ve ikon rozetine sahip `.alu-pathway-tabs` (`MİMAR`, `MÜHENDİS`, `PREKAST`).
       - Sekme değiştiğinde soldan kayarak beliren (`aluPathwaySlideIn 420ms`) rol başlığı (`Özgür Tasarım` / `Hassas Analiz` / `Akıllı Üretim`) ve sağda kademeli gecikmeyle (`0ms`, `85ms`, `170ms`, `255ms` — `aluPathwayFeatureIn`) açılan 4 özellik kartı + disiplin görseli.
       - 6 adet `ALLPLAN` ürün kartında (`Basic`, `Concept`, `Professional`, `Ultimate`, `Civil`, `Precast`) koşullu vurgulama ve sönümleme: seçili role ait paketler (`.alu-product-card--highlighted`) tam opaklık (`opacity: 1`), `scale(1)`, tam renk, rol renginde aktif durum noktası ve `"ÖNERİLEN"` rozetiyle öne çıkarken; diğer paketler (`.alu-product-card--dimmed`) `450ms cubic-bezier(0.22, 1, 0.36, 1)` geçişle `opacity: 0.3`, `scale(0.975)` ve `grayscale(100%)` olarak geri plana çekilir (üzerine gelindiğinde ise anında netleşerek erişilebilir kalır).
  5. **Ana Sayfa Hero Bölümünden `29+ / 500+ / 50+ / 10K+` Kartlarının Kaldırılması:**
     - Kullanıcı talebi doğrultusunda ana sayfa Hero alanındaki 4'lü istatistik kartları (`29+ Yıllık Tecrübe`, `500+ Aktif Müşteri`, `50+ Uzman Kadro`, `10K+ Tamamlanan Proje`) `HomepageView.tsx` içerisinden tamamen kaldırıldı.
  6. **Video Kütüphanesi (`/solutions-v2/training/video-library` ve `[playlistId]`) Canlı Site Hizalaması:**
     - Canlı sitedeki `video-library/page.tsx` ve `video-library/[playlistId]/page.tsx` yapısı `SubpageView.tsx` ve `src/styles/globals.css` içine birebir uygulandı:
       - `/solutions-v2/training/video-library` sayfasına kırmızı/koyu geçişli **YouTube Abone Ol Banner'ı (`.alu-yt-banner`)** (`Resmi Kanal`, `Allplan Türkiye YouTube Kanalına Abone Olun`, filigran YouTube ikonu ve `ABONE OL` butonu) ve canlıdaki **22 adet Oynatma Listesi & Kanal Kartı (`.alu-yt-grid`)** (kırmızı YouTube rozeti, hover'da kırmızı dolgu ve sağ üstte beliren oynat ikonu, `İzleme Listesini İncele` bağlantısı) eklendi; alt kısımda oluşan mükerrer düz metin kartları kaldırıldı.
       - 14 adet oynatma listesi detay sayfasına (`/solutions-v2/training/video-library/[playlistId]`) canlı sitedeki **2/3 Ana Video Oynatıcı + 1/3 Sabit Kaydırılabilir Oynatma Listesi Kenar Çubuğu (`.alu-playlist-stage`)** mimarisi (`Oynatma Listesi 1 / N` sayacı, küçük resimli ve aktif oynatma işaretli ders satırları) entegre edildi.
  7. **Doğrulama:** `python3 scripts/verify_phase6_parity.py` (**32/32 PASS**) ve `python3 -m unittest tests/test_url_parity.py` (**23/23 OK**) geçti.

## 26.10.2026 — Tüm Ürün/Çözüm Yapısal Sayfaları, `/references`, `/about`, Açık Tema Header/Footer ve Mobil Menü Düzeltmesi

- Kullanıcının geri bildirimleri doğrultusunda tamamlanan ve atomik olarak commit edilen geliştirmeler:
  1. **30 Ürün, Çözüm, Eklenti ve Destek Sayfasının Yapısal Bileşen Mimarisi (`7927be1`, `ba1f9ce`):**
     - `scripts/extract_structured_pages.py` ile 30 zengin şablonlu sayfa (`ProductPageTemplate`, `SolutionHero`, `BenefitsGrid`, `WorkflowLinks`, `ChallengerSection`, `RegulatedIndustryTemplate`, `/references`, `/solutions-v2/faq`, `/solutions-v2/connect-license/how-to-assign`, `/solutions/sketchup-converter`, `/solutions-v2/training/quick-start`) yapısal olarak `structuredLayout` şemasına aktarıldı.
     - 91+ YouTube video kartı için sinema modunda açılan **Global Video Popup Modal (`.alu-video-modal`)** ve yüksek çözünürlüklü ekran görüntüleri için **Global Image Lightbox Modal** eklendi.
     - `/references` sayfasına canlı sitedeki **10 Sekmeli Kategori Filtresi (`Tümü (228)`, `Kamu (59)`, `Üniversiteler (13)`, `Üstyapı (32)`, `İnşaat (29)`, `Mimari (24)`, `Yol - Köprü (52)` vb.)**, anlık arama kutusu ve 3 sütunlu **228 Kurum/Firma Referans Kartı Izgarası (`.alu-ref-grid`)** uygulandı.
     - `/solutions-v2/faq` sayfasına 5 sekmeli (`Sistem Gereksinimleri`, `Kurulum & Aktivasyon`, `Lisans Yönetimi`, `Sürüm Karşılaştırma Tablosu`, `Sorun Giderme`) etkileşimli SSS dizini eklendi.
  2. **Eski Siteden Kalan Kırık (404) Buton ve Link Hedeflerinin Onarımı (`3be57da`):**
     - `scripts/generate_site_data.py` içinde eski sitede 404 veren 6 adet iç link (`/solutions/bimplus` → `/products/allplan-bimplus`, `/allplan-2026nin-ozellikleri` → `/products/allplan-2026-yenilikler`, `/solutions/scalys` → `/solutions/addons/scalypso`, `/solutions/ax3000` → `/products/ax3000`, `/downloads#...` → `/solutions-v2/other` / `/products/allplan-bimplus`) canlı karşılıklarına yönlendirildi.
  3. **Açık Tema (Light Mode) Header, Topbar, MegaMenu ve Footer Uyumlaması (`5f88fce`):**
     - `src/styles/globals.css` içine `[data-mode="light"]` ve `[data-theme="aluplan"][data-mode="light"]` token ve bileşen kuralları eklendi; `SiteShell.tsx` içinde Footer logosunun da Header logosu gibi açık temada siyah logoya (`/assets/logo/aluplan-logo-black.svg`) geçmesi sağlandı.
  4. **Hakkımızda (`/about`) Sayfası İçin Kurumsal Editöryal Profil Yerleşimi (`1f5cd09`):**
     - `/about` sayfası ürün/çözüm şartname kartları (`01..09`) yerine; üstte **4'lü Kurumsal Gösterge Bandı (`29+ Yıllık Tecrübe`, `500+ Aktif Müşteri`, `50+ Uzman Kadro`, `10K+ Tamamlanan Proje`)**, asimetrik **Hikayemiz & Kronoloji** anlatısı, Romen rakamlı **2×2 Kurumsal Değerlerimiz Manifestosu (`Misyonumuz`, `Müşteri Odaklılık`, `Kalite ve Uzmanlık`, `Sürekli İnovasyon`)** ve **Ataşehir Merkez Ofis + Etkileşimli Google Harita** bölümüyle kurumsal kimlik sayfası olarak yeniden tasarlandı.
  5. **Header Masaüstü Navigasyon ve Mobil Hamburger Menü Ayrımı (`d3d8810`):**
     - Masaüstü görünümde (`> 64rem` / `1024px`) normal navigasyon (`.alu-site-nav`) açıkken yanında ikinci bir `Menü` (hamburger) butonunun görünmesi engellendi (`.alu-mobile-menu-toggle { display: none }`). `<= 64rem` mobil/tablet görünümde ise normal navigasyon gizlenip yalnızca hamburger menü butonu gösterilecek şekilde duyarlı (responsive) hale getirildi.
  6. **Doğrulama:** `./node_modules/.bin/tsc --noEmit` (`0` hata) ve `python3 scripts/verify_phase6_parity.py` (**36/36 PASS, 0 hata**) geçti.
  7. **`/about` Kurumsal Profil İyileştirmesi ve CSP Google Maps İzni (`ffdb894`):**
     - `src/styles/globals.css` içine eksik semantik CSS değişken takma adları (`--font-display`, `--font-sans`, `--accent-primary`, `--accent-subtle`, `--accent-soft`, `--text-muted`, `--surface-overlay`) eklendi; `.alu-about-values` 2×2 editöryal kart ızgarasına dönüştürüldü; `/about` Hero bölümünden yazılım ürün CTA butonları (`Teklif Talep Formu` / `Ücretsiz Deneme`) kaldırıldı; `next.config.mjs` CSP `frame-src` yönergesine `https://www.google.com https://maps.google.com` eklenerek Google Maps haritasının sorunsuz yüklenmesi sağlandı.
  8. **`/solutions/modeling-of-precast-girder-bridges` ve 21 Çözüm/Eklenti Sayfasında Eşleştirilmiş Metin + Popup Video Modal Mimarisi (`4c53d2b`):**
     - Canlı sitedeki `InfoMediaTwoColumn` (metin ve ilgili videonun yan yana eşleştiği iki sütunlu yapı) ve video kartı şablonları taranarak `/solutions/modeling-of-precast-girder-bridges` (8 YouTube videosu: 3 akış + 5 teknik özellik adımı), `/solutions/features-allplan-bridge` (7 YouTube + 5 yerel `.mp4` videosu), `/solutions/bimx5`, `/solutions/imar-yonetmeligi-bim-eklentisi`, `/solutions/rebar-engineering`, `/solutions/pythonpart`, `/solutions/bimflex`, `/solutions/poz-catalog`, `/solutions/scalypso/videos`, `/solutions/scalypso/converter`, 8 adet CDS eklenti sayfası (`/solutions/addons/2d-dwg-converter`, `drive-curve`, `geometry-tools`, `graphical-text`, `parametric-terrain`, `ramp`, `steel-components`, `three-dimensioning`), 3 adet AX3000 çözüm sayfası ve `/solutions/allplan-industry` dahil toplam **52 yapısal rota** `structuredLayout` şemasına bağlandı.
     - Tüm videolar (hem YouTube hem yerel `.mp4` videoları) kendi başlık ve açıklamalarının tam yanında konumlandırıldı ve tıklandığında **Sinema Video Popup Modal (`.alu-video-modal`)** içinde otomatik oynatılacak şekilde entegre edildi.


## 26.10.2026 — S01 başlangıç kaydı tamamlandı

Plan önce `91f6da7` ile commit edildi. `docs/verification/stabilization-2026-10-26/baseline.json` beş üretilmiş JSON'un ve10belgenin SHA-256/boyut/tür kaydını içerir.10/10orijinal belge 2026kaynağında bulundu; mevcut hedeflerde0/10hash eşliği ve ikiDOCX'tePDF imzası doğrulandı.161TSX snapshotının güncel2026kaynağıyla161/161bayt eşliği var; önceki snapshot eskimesi şüphesi bu kümede giderildi. Tüm kaynak/render/canlı paritesi henüz kanıtlanmadı.

`/Allplan 2027 Marketing Materials/` .gitignore'a eklendi, git check-ignore ile doğrulandı; klasör içeriği açılmadı/değiştirilmedi. Kaynak/veri/belgeler değiştirilmedi, üreticiler çalıştırılmadı. S01 yalnız doküman/Git ignore adımıdır; uygulama testleri tekrarlanmadı. Sıradaki adım S02 tek veri üreticisi ve komut sözleşmesi; belge yazma güvenliği sağlanmadan üreticiyi çalıştırma. Bu aşama sonunda kullanıcıya kanıt özeti sunulur.


## 26.10.2026 — S02/S03 tek veri hattı ve gerçek belge kopyaları tamamlandı

Kullanıcı PDF/diğer dosyaların mutlaka2027'ye kopyalanmasını ve kırık link kabul edilmemesini istedi. `scripts/generate_site_data.py` tek üretici yapıldı; pnpm veri/test komutları düzeltildi, eski JS üretici aynı Python girişine yönlendiren sarmalayıcıya dönüştürüldü. Temsili PDF üretimi kaldırıldı; `scripts/document_assets.py` 10özgün PDF/DOCX'i salt-okunur2026kaynağından2027public/docs'a kopyalıyor. Ana sayfanın yazım farklı PDF hedefini koruyan11.adres de aynı özgün dosyayı sunar. Kaynak/hedef/tür/SHAmanifesti `src/data/documents-manifest.json` içinde; parite artık dosya varlığı yerine tür/boyut/hash kontrol eder. Eksik/bozuk kaynak ve path/symlink kaçışları önkontrolde durdurulur.

34birim testi +36parite kontrolü, typecheck/build ve188kontrast çifti geçti.11/11belge URL'si yerel productionHTTP200 ve orijinal gövde hash eşliğiyle doğrulandı. Veri içindeki10benzersiz yerel indirme hedefi geçerli dosya döndürdü. Beş mevcut içerikJSON'u S01ile aynı; altıJSON tekrarlı üretimde aynı.161kaynak snapshotı değişmedi. İnceleme kritik/yüksek bulgu vermedi; manifest şekil kontrolü önerisi testle kapandı. Kanıt/komutlar `docs/verification/stabilization-2026-10-26/README.md` ve `documents-after.json` içinde.

Bu adım form/tasarım/schema içeriğini değiştirmedi, canlıya yayın yapılmadı. Kaynak2026salt-okunur kaldı, pazarlama materyalleri ignored. Sıradaki adım S04Microsoft Forms tek talep kanalı ve sahte yerel başarı akışlarının kaldırılması; özel lisans/iletişim akışını satış formuna otomatik karıştırma. S05tam içerik/etkileşim paritesi veS06token refaktörü hâlâ açıktır.


## 26.10.2026 — S04 mevcut Microsoft Forms talep kanalı tamamlandı

`SiteShell` yerel kısa form modalı ve /api/request çağrısı kaldırıldı; Hızlı Talep Oluştur gerçek harici link olarak ortak `https://forms.office.com/r/hXhnKAG912` hedefini açar. İletişimde ortak talep formu + mevcut e-posta/telefon, Eğitim ana sayfasında doğrudan eğitim talep linki sunuldu. PythonPart/Scalypso ailesindeki kullanıcı tarafından hatalı olduğu teyit edilen XLQm9JPTSR CDS hedefi yalnız tam URL eşleşmesiyle içerik ve structuredLayout katmanında ortak forma hizalandı. HSrhvAkYmb lisans yöneticisi formu, Teams/ticket ve resmî deneme URL'si korunur.

Lisans aktivasyonu bölümünde çalışmayan ürün anahtarı/kişisel veri toplama alanları yerine çevrimiçi gönderim yapılmadığı açıklandı; özgün deklarasyon PDF'si, ticket ve info e-postası korunur. Lisans işlemi satış formuna bağlanmadı. Üç eski POST endpoint'i gövdeyi okumadan, saklamadan veya yönlendirmeden410/error/no-store döndürür; sahte başarı/başvuru no üretilmez. Bu, gerçek bir SMTP/aktivasyon teslimatı kurulduğu anlamına gelmez; mevcut uygulamada bu teslimat desteklenmiyor. Eski alanlar kaynak snapshotlarında korunur, yeni çalışan form varmış gibi sunulmaz.

43birim testi +36parite, typecheck ve production build geçti; yerel üretim tarayıcısında iletişimde0form, güvenli ortak form linki; eğitim talep hedefi doğru; aktivasyon bölümünde0kişisel alan ve yalnız PDF/ticket/mail doğrulandı. ÜçPOST'a bozukJSON ile yerel test410döndürdü; gerçek form gönderimi/kişisel veri iletimi yapılmadı. Kod ve güvenlik incelemelerinde kritik/yüksek bulgu yok. Kanıt `forms-after.json` / `forms-contact.png`; `docs/request-forms-contract.md` başına erteleme kararı eklendi. Form testleri mevcut URL politikası ve sahte başarı regresyonunu kapsar; tüm uygulama kabulü değildir.

S05notu: tarayıcıda /contact kaynak gövdesinde hâlâ30gün deneme ifadesi var. Önceki rapordaki süre çelişkisinin tamamen kapandığı iddiası doğrulanmıyor; içerik denetiminde kanıt/karar farkı olarak ele alınacak, bu tur metin değiştirilmedi. Sıradaki adım S05kaynak→veri→render içerik/etkileşim karşılaştırması. Canlı siteye deploy/push yok,2026kaynağı değişmedi,2027materyalleri ignored.


## 26.10.2026 — S05 ilk içerik denetimi; kabul henüz açık

110 yerel üretim rotası HTTP200/tekH1; erişim hatası ve yönlendirme yok. Bu kontrol tam içerik paritesi değildir. 16 rotadaki303 uzun yapısal kayıt ilk HTML'de yok; iki Yenilikler sekmesi tarayıcıda açıldığında metinleri görüldü. Aday kayıtlar otomatik kayıp sayılmaz. Altı boş bölümün dört bulut listesinde yanlış kaynak değişkeni nedeniyle gerçek çıkarım hatası bulundu; iki video galerisi ayrıca teyit bekliyor.

Dört somut açık: Basic/Concept/Professional/Civil bulut kartları; Eğitim'in varsayılan dışı sekme metinleri; Yenilikler genel bakış paragrafları; BIMFlex Aluplan ortaklık cümlesi. Son iki metin flat veride var fakat structured gösterimde yok. Canlı Contact doğrudan kontrolünde14/30gün çelişkisi doğrulandı; süreyi Aluplan ürün/satış yetkilisi doğrulamadan değiştirme. Yenilikler sekmelerinde panel rolü eksikliği uygulama kabulüne not edildi.

Kanıt ve sorumlular `docs/verification/stabilization-2026-10-26/S05-content-findings.md`, `render-audit.json`, `historical-text-candidates.json`, `targeted-live-check.json` içindedir. Yeni tarama aracı yalnız loopback HTTP(S) adreslerine izin verir, dış yönlendirmeyi reddeder, erişim/parse hatasında başarısız çıkar; script/style/RSC içeriğini gösterilen metin saymaz. Kod incelemesinin iki orta önerisi (yönlendirme sınırı ve hata özeti) eklendi. Bu tur app/veri/schema/tasarım değiştirilmedi; kaynak2026salt-okunur, canlıya push/deploy yok. S05tamamlandı işaretlenmedi. Sıradaki adım rapordaki C01–C04 kaynak sadakati düzeltmeleri ve etkileşimlerin genişletilmiş doğrulaması; S06henüz başlamadı.

S05 denetim aracının 5 testi dahil toplam48 birim testi ve36 mevcut parite kontrolü geçti; bu başarı rapordaki içerik açıklarını kapatmaz. Uygulama değişmediği için build tekrarlanmadı; S04 başarılı üretim derlemesi denetlendi. Geçici3001 sunucusu ve denetim sekmesi kapatıldı.


## 26.10.2026 — Deneme süresi kararı kapandı

Kullanıcı geçerli ALLPLAN ücretsiz deneme süresini14gün olarak kesinleştirdi ve resmî https://www.allplan.com/trial-or-subscription/ kaynağını verdi. Aynı gün sayfada “14 DAY FREE TRIAL” / “Limited to 14 days only.” doğrulandı. S05 C05 için ek firma onayı beklenmez; Contact'taki30gün ifadesi2027üretim/gösterim hattında14güne düzeltilecek, kaynak2026ve tarihsel kanıtlar korunacak. user-decisions.md ve S05raporu güncellendi; bu commit doküman kararıdır, uygulama değişmedi. Sıradaki adım C01–C04 içerik geri kazanımı ile C05 süre düzeltmesini test ederek tamamlamak.


## 26.10.2026 — S05 kaynak sadakati düzeltmeleri uygulandı

Kullanıcı onayıyla C01–C05ve ek C06kapandı: dört ürünün9'ar bulut kartı, Eğitim6sekmesi, Yenilikler2paragrafı, BIMFlex ortaklık paragrafı, Geometry Tools17/Steel Components26video galerisi geri yüklendi. Contact30gün cümlesi yalnız bu rota/tam metin için üretim politikasında14güne çevrildi; tarihsel veri ve kaynak2026değişmedi. Schema/fiyat/deneme hedefi değiştirilmedi. Eğitim modal talepleri mevcut ortakMSForms'a gider; genel eğitim gövdesi korunur.

56birim testi +36parite kontrolü; typecheck/build ve188kontrast kontrolü geçti. ProductionHTML110/110HTTP200/tekH1,0boş yapısal bölüm;11hedefli rota testi geri yüklenen metin/kart/video başlıklarını doğruladı. Yeni Eğitim6tab/6panelSSR'de mevcut. Kanıt render-after-s05.json/s05-targeted-after.json. Tarayıcı Work ayarlarında kapalı: yeni görsel/klavye kabulü bekliyor. Kod inceleme ajanı politika değişikliğinde sorun bulmadı; bütün diffin son ajan incelemesi kullanım limitiyle tamamlanamadı, ana ajan diffi ayrıca inceledi; tam bağımsız inceleme iddiası yok.

Kalanlar: kaynakta da olmayan5traininggörseli (sourceImageSrc kaydı, imageSrc:null; kırık istek yok),16rotadaki303ilkHTML adayının etkileşim denetimi, kırpılmış Yenilikler SEO/hero açıklaması ve diğer sekmelerin panel erişilebilirliği. Bunlar kapanmadan S05tamamlandı sayılmayacak. S06henüz başlamadı. Push/deploy yok. Sonraki oturumda tarayıcı erişimi varsa yeni Eğitim sekmelerini gerçek etkileşimle doğrula; kalan adayları kaynak eşliğiyle ayır.

Ek kapsam doğrulaması: ortak bulut düzeltmesi Ultimate rotasına da yansır; mevcut ek kartıyla10bulut kartı korunur. Böylece5ürün rotası etkilenir. Son bağımsız kod incelemesi yeniden denendi ve tamamlandı: kritik/yüksek/orta bulgu yok; kaynak eşliği ve genel Eğitim gövdesinin korunması doğrulandı. Önceki kullanım limiti nedeniyle eksik inceleme notu bu sonuçla aşılmıştır.

Geçici3001üretim sunucusu kapatıldı; kullanıcının mevcut geliştirme sunucusuna müdahale edilmedi.

## 27.10.2026 — S05 kalan303aday ve tarayıcı kontrolü

Tarayıcı erişimi yeniden çalıştı.303ilkHTMLadayı statik incelemede35workflowaltöğe+227workflowkategori+41FAQkategori olarak sınıflandırıldı; hiç render edilmeyen alan bulunmadı. Tarayıcıda15rotanın195workflowdurumu veFAQ5kategori/25yanıtı seçilerek metin eşliği doğrulandı,0hata. Eğitim6sekmesi veHome/Endkontrolü geçti. Workflow/FAQklavye, rovingtabIndex, aria-controls/tabpanels eklendi; yeni buildsonrası YeniliklerEnd/FAQHomekontrolü geçti. Yeni panel değişikliği içerik veya görsel karar değiştirmiyor.

YeniliklerSEO/hero'nun kesilmiş açıklaması, kaynak genel bakış paragrafının ilk tam cümlesine hizalandı; yalnız bu rota ve arama kaydı değişti.57birim testi+36parite, productionbuild/tip/188kontrast kontrolü geçti; bağımsız kod incelemesi önemli bulgu vermedi. Dar Eğitimekranında gözlenen354CSSpx genişlikte yatay taşma yok; screenshot ve browser-checks.json kanıtları docs/verification/s05-closure-2026-10-27/ altında.

303aday için etkileşim doğrulaması kapandı. S05genel kabulü hâlâ açık: kaynakta olmayan5traininggörseli temin/nihai görselsiz kabul bekliyor; uzaktanvideo/galerimodal akışlarının tümü ve sitegeneli görsel kabul tamamlanmadı. Seçili olmayanworkflow/FAQiçeriğinin ilkHTMLerişimi SEOyayın kabulünde ayrıca değerlendirilecek. S06başlamadı. Kaynak2026salt-okunur kaldı, pazarlama klasörü kullanılmadı, push/deploy yok. Sıradaki adım eksikvarlık ve medyamodal/görsel kabul tablosunu kapatmak; tokenrefaktörüne atlama.


## 27.10.2026 — Yayınsız yerel medya ve responsive kapanışı

Kullanıcı açıkça canlıya alınmayacağını belirtti; tüm çalışma yerel2027'de kaldı. S05kalan yerel kontroller tamamlandı:110masaüstü+110dar ekranrotası tarayıcıda açıldı; son durumda yataytaşma0, o anda yüklenen görselhatası0. Contactgridindeki22remminimumun354CSSpxekranda368pxtaşırdığı tespit edilip min(100%,22rem)ile düzeltildi. Bu mekanik kontrol bütün lazygörsellerin yüklendiği veya editöryal görsel tasarımın kabul edildiği anlamına gelmez.

53yapısalrotada69video/görselmodal örneği açılıp kapandı; hepsinde medyaURL'si ve scrollkilidi doğrulandı. Her rotanın varsa1video+1görsel türü seçildi; tüm kartların ve hariciYouTubeoynatımının tektek testi değildir. YerelMP4örneği readyState4/pausedfalse/time7.69sile oynadı. MediaDialog native showModalile medya ve arama odağı/arka plan izolasyonu/scrollkilidi/geri dönüşünü ortaklaştırır. MedyaCtrlK ikinciarama çakışması engellendi. TekdüğmeliTab/ShiftTabkenarında odak dışarı gittiği tarayıcıda yakalandı, açıkTabdöngüsü eklenip iki yöndeodak içeride kaldığı doğrulandı. AramadanBIMFlexnavigasyonu0dialog/normaloverflowile geçti. Uzunbaşlık/yataymobil örneğinde kapatma düğmesi ekran içindeydi.

57birimtesti+36parite, productionbuild/TypeScript ve188kontrast kontrolü geçti. Bağımsız kod incelemesi tamamlandı; sonTabdöngüsü ekince yeniden inceleme istendi. Kanıtlar docs/verification/s05-closure-2026-10-27/ altındaki responsive-*-after.json, media-route-samples.json, modal-behavior.json, local-video-check.json ve screenshotlar. Geçici3001sunucusu kapatıldı, kullanıcının sunucusuna dokunulmadı.

Beş kaynakTraininggörseli hâlâ fiziksel olarak yoktur; mevcut çalışma kararı görselsizpanelleri kullanmaktır. Metin/CTA'lar tam, sourceImageSrcizleri kayıtlı, kırıkistek yok. Eksikdosyaları geri kazanmış gibi sunma. Kaynaktemini ileride yapılabilir; bu durum yerel teknik çalışmayı durdurmaz. S05yerel teknik adımı bu sınırlı kapsam ve açıkistisnalarla tamamlandı; tüm kaynak içeriğin yüzde100paritesi, tümharicivideoların kullanılabilirliği veya nihai tasarımkabulü iddia edilmez. SSR/SEOsekmeleri ve genel görsel kabul sonrakiS06/S07çalışmasında ele alınır. S06token/bileşen sağlamlaştırma henüz başlamadı; fazonayı olmadan atlama. Push/deploy yok.

Son bağımsız inceleme de tamamlandı: önemli bulgu yok. Yerel media/iframe odaktayken özel Tab sarması uygulanmaz; tarayıcının oynatıcı iç kontrol sırası korunur. Bu son değişiklik sonrası production build ve TypeScript tekrar geçti.


## 27.10.2026 — S06-A kanonik stil hattı ve ilk ayrım

Kullanıcı S06devamını onayladı. globals.css içindeki kanonikDSkopyaları scripts/build_app_styles.py ile17girdiden üretilen tekçıktı yapıldı; uygulamaözelkuralları src/styles/application.css içinde. pnpm styles:generate önce tokenlarısonraCSS'yi üretir; styles:check saltokunurdrift kontrolüdür, test/buildiçinde zorunlu. globals.csselle değiştirilmez. KanonikfontsCSS'si publicURL'lere dönüştürülür. Mimar/mühendis/prekast3renk tokena taşındı; önceki değerler aynı, JSXrenksabitleri ve23fallback kaldırıldı. Palettestleri gelecekteki geçerli tokeneditlerini kilitlemez; pertheme/mode mutationtesti eklendi.

WorkflowSection ve structured-tab-key parenttan çıkarıldı; SubpageView2972→2738satır. JSXnormalize eşliği/callbacks aynı.64Python+36parite+29token testi, build/TypeScript/188kontrast geçti.110yerelrota200/tekH1,0boşyapısalbölüm;303aday değişmedi. CSSnormalize(rol eklerini geri çevirerek)HEADile aynı. Kanıt docs/verification/s06-2026-10-27/ altında. Yeni kod incelemesi önemli bulgu vermedi; ilk paletkilitleme önerisi düzeltildi.

Tarayıcı bu tur Workayarlarında kapalı: yeni görsel/etkileşim kabulü yapılmadı. HTTPvekaynak eşliği bunu ikame etmez. BuS06-Atemeladımıdır, S06tamamlanmadı. Sonraki adım application.css99hamrenkkullanımının anlamlıtema tokenlarına taşınması, lightheader/footer overrideların tokenkatmanına alınması; ölçü/tipografi/hareket ve büyükbileşen ayrımı devamı. İçerik/schema/dataJSONdeğişmedi, kaynak2026saltokunur, pazarlamaklasörü kullanılmadı, push/deploy yok. S07'ye atlama.


## 27.10.2026 — S06-B renk ve tema override katmanı

Kullanıcıdevam onayıyla application.css99hamrenk0'a indirildi.65visualrolü+8chrome değeri tokens.json'a taşındı; dört tema/modda önceki değerler korunur. Header/footer7alias artık component→semanticchrome; hover için yalnız modebağımsıztoken→tokencompatibilityalias kaldı. Renk değeri CSS'de değil tokens.json'dadır. Eski lightonbrandhover/beyazfg kombinasyonunun olası düşük kontrastı korunup riskolarak kaydedildi;188kanoniktokenkontrastını geçmesi bu renderaliasını doğrulamaz. Yeni tasarım/renkdeğişikliği yapılmadı.

Üretim application.css içindeki doğrudanHEX/RGB/HSL/HWB/Lab/LCH/OKLab/OKLCH/color()yazımını büyük/küçükharf bağımsız reddeder; negatif testler mevcutçıktının hatahalinde korunmasını doğrular. Overlay/header modeizolasyonu mutationtesti eklendi.66Python+36parite+30token testi, stylescheck, build/TypeScript/188kontrast geçti.110HTTProta200/tekH1/0boşyapısalbölüm;303aday değişmedi. color-migration.json65×4visual+8×4chrome eşliği ve tersCSSnormalizehash eşliğini kayıtlar. Kodincelemesi önemli bulguvermedi; case-insensitiveguardönerisi kapatıldı.

TarayıcıWorkayarında kapalı; yeni görsel/piksel kabulü yok. İçerik/schema/data/TSXdeğişmedi, kaynak2026saltokunur, pazarlamaklasörü kullanılmadı, push/deploy yok. Geçici3001sunucusu kapatıldı. S06devam ediyor: ölçü/boşluk/köşe/tipografi/hareket değerleri ve büyükbileşen ayrımı sıradakiadım; tarayıcıerişimi açıldığında yeni temakatmanı görselkontrolü yapılmalı. S07'yegeçilmedi.


## 27.10.2026 — GitHub repo ve workflow konumu

Kullanıcıboşrepo https://github.com/hazarvolga/aluplan-2027 adresini bildirdi. Connectorpublic/defaultmain/size0vegitls-remoteheadsboşsonuç doğruladı. Önceorigin yoktu, yereloriginbuHTTPSadreseeklendi. AGENTSkurallarıyenidenokunup mainüzerindeçalışmayıengelleyen yeniworkflowgereği codex/s06-metrics-tokensbranch'iaçıldı. KullanıcısonraAGENTS'eskihalinegetirdi; yenikurallar kökte DEVOPS MASTER WORKFLOW.md(1131satır)dosyasında. Bu dosyayı sonrakioturumlardaAGENTSilebirlikteoku. Dosya kullanıcıyaait, değiştirilmedi veS06commitinedahiledilmedi; untrackedkorunuyor. AGENTSşuanki46satırlıkhaliHEADileaynı. Push/PR/CI/mergeyapılmadı; canlıyayınzatenyasak. KullanıcıaçıkuzakteslimtalebivermedenyerelbaşarıyıGitHubbaşarısıdiyeanlatma.

## 27.10.2026 — S06-C445metrikdeklarasyonu

445applicationCSSdeklarasyonu semanticmetriklerebağlandı;120yenirol, dört tema/moddanormalharekette445/445eşlik ve0fark. Hedefhammetrik445→0:font-size/weight/line-height/letter-spacing/radius/gap/paddingve transition/animation süre/gecikme/easing. Varolanscalereuseyalnız4kapsamdaeşiolduğunda; fielddeğerlerikorundu. motion.durationaltındakiyenisüre/gecikmelerreducedmotionüretiminde0msolur; buöncedenrawsürelerikapanmayanreducekullanıcılarıiçinkasıtlıiyileştirme, tümpreferencespikseleşliğideğil.

Compositormetrikguard/negatiftestler eklendi.32token testi tema-yerelmetrikoverride ve reducedmotionsüre/gecikme kapanmasınıtesteder.67Python+36parite+32token, stylescheck, typecheck/build/188kontrastgeçti.110yerelrota200/tekH1,0boşyapısalbölüm,303adaydeğişmedi. Kodincelemesibağımsız4scopeçözümüteyitetti, önemlibulguyok. Kanıtmetrics-migration.json/render-after-metrics.jsonvedocs/verification/s06-2026-10-27/README.md. TarayıcıWorkayarlarındakapalı; yenigörsel/etkileşimkabulüyok. İçerik/schema/data/TSXdeğişmedi. Geçici3001sunucusukapatıldı.

S06tamamlanmadı: TSXinlineölçüler, diğerwidth/height/margin/transformtasarımdeğerleri ve büyükbileşenayrımıdevamedecek. S07'yeatlama. Kaynak2026saltokunurkaldı; push/deploy/remoteCIyok. Lint: DS/tokenlintPASS; ESLintkomuturepodayok(N/A). Gitdurumundakullanıcıworkflowdosyasınınuntrackedolmasıbeklenir; workingtreetümüylenettemizdiyeiddiaetme.

## 27.10.2026 — S06-D SSS dizini bileşen ayrımı

`SubpageView` içindeki çok kategorili SSS dizini `FAQSection` bileşenine çıkarıldı; kategori seçimi state'i bu bileşene taşındı. `DirectoryCategoryIcon` ayrı ortak dosyaya alındı ve referans/SSS alanları tarafından kullanılıyor. `StructuredFaqDirectory` sözleşmesi değişmedi; soru-yanıt, maddeler, tablolar, notlar ve dış CTA aynı kayıtlardan gösteriliyor. Sekme klavye davranışı, roving tabindex, aria bağlantıları ve ilk SSS öğesinin açık gelmesi korundu.

`pnpm typecheck`, 67 Python birim testi, 36 faz parite kontrolü, 32 token testi, `pnpm styles:check` ve `pnpm build` geçti. Önceki commit ile yeni bileşen arasındaki FAQ JSX ağacı biçim boşlukları normalize edilerek birebir eşleşti. Bağımsız kod incelemesinde kritik/yüksek/orta bulgu yok. Build'in değiştirdiği `next-env.d.ts` geri alınıp commit dışında tutuldu. Tarayıcı erişimi Work ayarlarında kapalı olduğundan yeni görsel/etkileşim kabulü yapılamadı. S06 devam ediyor: TSX inline ölçüler ve kalan büyük bileşen ayrımları sırada. İçerik/schema/URL/veri ve kaynak 2026 değiştirilmedi. Kullanıcıya ait `DEVOPS MASTER WORKFLOW.md` untracked kalacak ve commit kapsamına alınmayacak. Push/PR/deploy/canlı değişikliği yok.

## 27.10.2026 — S06-E inline ölçülerin token kaynağına alınması

Altı ana uygulama bileşenindeki sabit inline gap/padding/margin, metin genişliği, özel panel/görsel ölçüsü ve About satır aralığı değerleri semantik tokenlara taşındı. Directory kategori ikonunun çizgi kalınlığı ve özellik kartlarının `0/85/170/255ms` stagger adımları da token oldu; stagger `nth-child` CSS kurallarıyla uygulanıyor, reduced-motion'da tüm adımlar kapanıyor. Yüzde, `auto`, aspect ratio ve veri kaynaklı yerleşimler yapısal/dinamik bırakıldı.

`docs/verification/s06-2026-10-27/inline-style-migration.json`, önceki commit `8f50d5e31e6970725abde512831343c2d688c381` ile yeni JSX stil ağacını token değerleri aluplan/field × light/dark için çözerek karşılaştırır: 162/162 kalan stil nesnesi dört kapsamda aynı değeri verir. Eski dinamik stagger formülünün dört indeksi ayrıca yeni token karşılıklarıyla eşleştirildi. Token testine de yeni ölçü rollerinin tüm kapsamlar için eşit çözülmesi ve stagger/reduced-motion kontrolü eklendi.

`pnpm test` (67 Python + 36 faz parite + 34 token), `pnpm typecheck` ve `pnpm build` geçti. DS doğrulaması 188 kontrast çiftini geçti. Bağımsız incelemede kritik/yüksek/orta bulgu yok. `next-env.d.ts` build değişikliği geri alındı. Tarayıcı kullanımı Work ayarlarında kapalı olduğundan görsel kabul yapılmadı. S06 sürüyor: kalan görsel literal adayları, büyük bileşen ayrımı ve tarayıcı karşılaştırması. İçerik/schema/veri/URL ve kaynak 2026 değişmedi. Push/deploy/canlı işlem yok.

## 27.10.2026 — S06-F kenarlık kalınlığı tokenları

Uygulama stilindeki 125 sabit border shorthand kalınlığı (`1–4px`) `border.width.default/strong/accent/heavy` semantik tokenlarına taşındı. Görsel çizgiler aynı kalınlıkta; uygulama CSS üreticisi artık `border`, yönlü ve mantıksal border özelliklerindeki sayısal kalınlıkları (sıra ve CSS biriminden bağımsız) reddediyor. Sıfır/reset durumları ve renk fonksiyonları içindeki yüzdeler kabul edilir; `border-image-width` için yüzde kalınlıkları da ölçü olarak yakalanır.

Test öncelikle kırmızıya dönerek eski korumanın border genişliklerini yakalamadığını gösterdi; ardından sıra/unit varyasyonları ve mantıksal özellikler için negatif fixture'lar, dört kalınlık sınıfı için token kapsam testi eklendi. Güncel doğrulama: 68 Python birim testi, 36 faz parite kontrolü, 35 token testi, typecheck ve production build geçti; 188 kontrast kontrolünde hata yok. Build kaynaklı `next-env.d.ts` değişikliği geri alındı. Yeni browser kontrolü yapılmadı. S06 devam ediyor; boyut, offset, transform ve shadow sayılarını kullanım bağlamına göre inceleyeceğiz. İçerik/schema/veri/URL, kaynak 2026, canlı ve remote repo değişmedi.

## 27.10.2026 — S06-G sabit konum tokenları

Uygulama CSS'inde sabit konum rolüne sahip kart rozetleri, medya kontrolü, üç sticky alan ve 15 margin ölçüsü semantic space tokenlarına bağlandı. Var olan değerler korunur; offset ve optik hizalama tokenları dört tema/modda aynı sonucu verir. Yüzde tabanlı merkezleme ve sıfır/auto margin'ler yapısal olarak kaldı; klavye skip-link için `left:-9999px` istisnası yalnız `.alu-skip-link` seçicisine tanındı. Negatif testler token dışı `rem/px/em` konum ve margin değerlerini reddeder.

Güncel doğrulama: 70 Python birim testi, 36 faz parite kontrolü, 36 token testi, typecheck ve production build geçti; 188 kontrast kontrolünde hata yok. `next-env.d.ts` build değişikliği geri alındı. Tarayıcıda görsel kabul yapılmadı. S06 sürüyor; kalan width/height, transform, shadow ve blur adayları içerik yapısı ile etkileşim davranışından ayrıştırılarak ele alınacak. İçerik/schema/veri/URL, kaynak 2026, canlı ve remote repo değişmedi.

## 27.10.2026 — S06-H1 bileşen ölçüsü tokenları

Uygulama CSS'indeki 22 görsel bileşenin sabit width/height ölçüleri ayrı semantic rollerle tokenlaştırıldı: oynatma/zoom/kapatma kontrolleri, partner öğesi/logo yüksekliği, durum noktaları, pathway/product ikonları, benefit ve YouTube ikonları, playlist rozeti, workflow noktası, referans ve hakkımızda ikonları. Aynı sayısal değeri kullanan farklı bileşenler bağımsız semantic rollerde tutuldu; böylece gelecekte tek bir bileşenin ölçüsü diğerlerini etkilemeden değiştirilebilir. Altı yeni primitive yalnız mevcut ölçü skalasında karşılığı olmayan değerleri taşır.

TDD kaydı: tokenlar eklenmeden önce 22 rol dört tema/modda `undefined` döndü ve seçici testi 22 ham ölçüyü yakaladı; uygulama sonrasında ikisi de geçti. İçerik genişlikleri (`ch`), modal/viewport sınırları ve responsive minimum yükseklikler bu committe değiştirilmedi; bunlar H2 yerleşim sınıflandırmasına aittir. `pnpm test` (71 Python + 36 faz parite + 37 token), `pnpm typecheck` ve `pnpm build` geçti; 118 rota üretildi ve 188 kontrast kontrolünde hata yok. Tarayıcı görsel kabulü hâlâ açık; içerik/schema/veri/URL ve canlı sistem değişmedi.

## 27.10.2026 — S06-H2 içerik ve container ölçüleri

On altı semantic container rolü oluşturuldu ve 16 seçicideki içerik genişlikleri bunlara bağlandı: standart modal, cookie/YouTube banner'ları, hero başlık/açıklama satır uzunluğu, pathway sekmesi/açıklaması, bento metni, playlist thumbnail, intro/FAQ içerik kolonları, video/görsel modalı, referans araması, SSS sahnesi ve iletişim etiketi. Aynı ölçüyü paylaşan ama bağımsız değişmesi gereken cookie/YouTube ve intro/FAQ alanları ayrı semantic rollerde tutuldu. `min(100%, …)`, `min-width` ve `max-width` davranışları aynen korundu. Eksik rem ölçüleri primitive `size.measure` skalasına eklendi; okuma uzunlukları semantic `ch` kararları olarak tutuldu.

TDD kaydı: uygulamadan önce container tokenları dört tema/modda `undefined` döndü ve 16 seçici eski ham değerlerle testi kırdı; token bağlantılarından sonra iki test de geçti. Viewport yükseklikleri, responsive min-height değerleri, dekoratif glow ve çizgi ölçüleri bu adımın parçası değildir. `pnpm test` (72 Python + 36 faz parite + 38 token), `pnpm typecheck` ve `pnpm build` geçti; 118 rota üretildi ve 188 kontrast kontrolünde hata yok. Bağımsız review'da engelleyici bulgu çıkmadı; ortak semantic rol notu alanları ayırarak kapatıldı. İçerik/schema/veri/URL ve canlı sistem değişmedi.

## 27.10.2026 — S06-H3 yapısal layout ölçüleri

Header minimum yüksekliği, modal viewport sınırı, bento/servis/özellik medya minimum yükseklikleri, playlist desktop ve compact yükseklikleri, video/görsel modal viewport sınırları, referans sayacı ve harita yüksekliği 14 bağımsız `layout.application.*` rolüne taşındı. Desktop/mobile playlist değerleri ayrı tokenlarla aynı media-query davranışını korur. Tüm bento kartlarında 64rem altında kullanılan değer `bentoResponsiveMinHeight` adıyla gerçek kapsamını açıkça belirtir. `calc(100dvh...)` formülü token içinde aynen tutulur; responsive kural veya viewport mantığı değiştirilmedi.

TDD kaydı: uygulamadan önce 14 token dört tema/modda `undefined` ve selector sözleşmeleri ham değerler nedeniyle kırmızıydı; uygulama sonrasında desktop/mobile tekrarları dahil geçti. Dekoratif glow, metric rule ve divider ölçüleri H4 için kapsam dışında kaldı. `pnpm test` (73 Python + 36 faz parite + 39 token), `pnpm typecheck` ve `pnpm build` geçti; 118 rota üretildi ve 188 kontrast kontrolünde hata yok. Bağımsız review'daki bento rol adı ve media-context test boşlukları kapatıldı; son review engelleyici bulgu olmadan onaylandı. İçerik/schema/veri/URL ve canlı sistem değişmedi.

## 27.10.2026 — S06-H4 dekoratif ölçüler ve width/height kapanışı

Hero metric çizgisi, pathway glow ve ofis ayırıcısının altı width/height deklarasyonu dört bağımsız semantic size rolüne bağlandı. Glow için eksik `52rem` primitive measure eklendi; çizgi/ayırıcı kalınlıkları mevcut border-width primitive'lerinden beslenir. Repository testi artık `application.css` genelinde ham sayısal `width/height/min/max` deklarasyonu kalmadığını ve üç seçicide doğru property→token bağlantısını doğrular.

TDD kaydı: tokenlar eklenmeden önce dört rol `undefined`, üç seçici eski ölçülerle kırmızı ve genel tarama altı ham deklarasyon buluyordu; uygulama sonrasında testler geçti. Bu adımla width/height literal sınıfı kapanır. `pnpm test` (74 Python + 36 faz parite + 40 token), `pnpm typecheck` ve `pnpm build` geçti; 118 rota üretildi ve 188 kontrast kontrolünde hata yok. Bağımsız review'daki selector override ve CSS unit tarama açıkları kapatıldı; son review bulgusuz onaylandı. S06'da transform, shadow/blur ile büyük bileşen ayrımı ve tarayıcı görsel kabulü devam eder. İçerik/schema/veri/URL ve canlı sistem değişmedi.

## 27.10.2026 — S06-I1 ortak etkileşim transformları

On beş tekrarlanan hover hareketi beş ortak motion rolüne taşındı: `liftSubtle/Moderate/Strong` ile `nudgeSubtle/Strong`. Bunlar bileşen ölçüsü değil, site genelinde birlikte ayarlanması amaçlanan etkileşim yoğunluğu kararlarıdır. Eski `translateY(-2/-3/-4px)` ve `translateX(3/5px)` değerleri dört tema/modda aynen korunur. Pathway merkezleme geometrisi, FAQ chevron dönüşü, keyframe girişleri, component-state dönüşümleri, medya zoom ve statik dekoratif scale değerleri bu küçük commitin dışında bırakıldı.

TDD kaydı: uygulamadan önce repository testi 15 selectorın ham transform değerini, token testi ise beş rolü `undefined` olarak raporladı; uygulama sonrasında iki test de geçti. Exact-selector koruması aynı selectorın birden fazla blokta bulunmasını destekler, tüm bloklardaki transformları toplar ve prefixed selectorları yanlış eşleştirmez. `pnpm test` (75 Python + 36 faz parite + 41 token), `pnpm typecheck` ve `pnpm build` geçti; 118 rota üretildi ve 188 kontrast kontrolünde hata yok. Bağımsız code review kritik/yüksek/orta bulgu olmadan onayladı. S06-I sonraki küçük commitlerde medya zoom, component state, keyframe ve dekoratif transformları ayrı anlamlarla ele alacak; ardından kontrollü raw-transform guard kapanışı değerlendirilecek. İçerik/schema/veri/URL, kaynak 2026 ve canlı sistem değişmedi; push/deploy yapılmadı.

## 27.10.2026 — S06-I2 transform sınıfı kapanışı

Kalan 23 görsel transform 19 role ayrıldı: altı medya/control zoom pattern'i, altı bağımsız component state'i, dört pathway keyframe adımı ve üç statik dekoratif scale. Dekoratif değerler `semantic.transform.decorative` altında motion davranışından ayrıldı. Aynı sayısal scale değerleri primitive seviyede tekrar kullanılabilirken pathway active state, card media ve subpage overscan ayrı semantic rollerle yönetilir. Pathway merkezleme geometrisi ile FAQ disclosure chevron dönüşü işlevsel literal olarak bırakıldı.

Raw-transform guard yalnız tam `var(--semantic-token)` kullanımını kabul eder; mixed literal+var bileşimlerini reddeder. İki işlevsel literal hem toplam sayı hem exact selector/value sözleşmesiyle korunur; `transform-origin` guard kapsamına girmez. İlk bağımsız review üç orta bulgu verdi: mixed bypass, selector-bağımsız whitelist ve pathway/product primitive coupling. Üçü kapatıldı; delta review kritik/yüksek/orta bulgu olmadan onaylandı. `pnpm test` (77 Python + 36 faz parite + 42 token), `pnpm typecheck` ve `pnpm build` geçti; 118 rota ve 188 kontrast kontrolü doğrulandı. Transform literal sınıfı kapanmıştır. S06'da shadow/blur sınıfları, büyük bileşen ayrımı ve tarayıcı görsel kabulü devam eder. İçerik/schema/veri/URL, kaynak 2026 ve canlı sistem değişmedi; push/deploy yapılmadı.

## 27.10.2026 — S06-J1 filter ve backdrop blur tokenları

Sekiz `filter` ve dört standart/WebKit `backdrop-filter` deklarasyonu 11 bağımsız semantic role taşındı. Hero video tonu, pathway glow, üç ürün state'i, iki bento medya state'i, alt sayfa atmosferi ile header/media badge/modal backdrop blur değerleri ayrı tutuldu. Header ve WebKit yolu aynı semantic role bağlıdır; mevcut görsel değerler dört tema/modda aynen korunur. Blur veya filter yoğunluğu değiştirilmedi.

Compositor artık `filter`, `backdrop-filter` ve `-webkit-backdrop-filter` için yalnız tam `var(--filter-*)` kabul eder; raw değer, yanlış namespace ve raw+var/var+raw bileşimleri reddedilir. Transition içindeki `filter` kelimesi ve diğer property'ler etkilenmez. RED aşamasında 12 raw deklarasyon ve 11 `undefined` token yakalandı; GREEN sonrasında exact selector ve dört-mod testleri geçti. İlk review yanlış token namespace'inin kabul edildiğini buldu; guard ve negatif testler daraltıldı, delta review bulgusuz onaylandı. `pnpm test` (79 Python + 36 faz parite + 43 token), `pnpm typecheck` ve `pnpm build` geçti; 118 rota ve 188 kontrast kontrolü doğrulandı. S06-J2'de 19 ham shadow geometrisi ve `none` reset ele alınacak. İçerik/schema/veri/URL, kaynak 2026 ve canlı sistem değişmedi; push/deploy yapılmadı.

## 27.10.2026 — S06-J2 shadow tokenları

On dokuz ham `box-shadow` kompozisyonu ve ürün dimmed state'indeki `none` reset, 20 bağımsız `shadow.application.*` rolüne taşındı. Gölge ölçüleri `primitive.shadowGeometry` altında, bileşen anlamı ve dinamik tema/rol renkleri semantic katmanda tutulur. Aynı `0 24px 64px` geometrisini kullanan mega menu ile hero monitor farklı semantic rollere sahiptir. Selected-role ring kalınlığı doğrudan `primitive.borderWidth.1` bağıntısını korur; mevcut `elevation` token kullanımları değiştirilmedi.

Compositor yalnız kanonik `semantic.css`/`component-aliases.css` içinde tanımlı `--shadow-*` veya `--elevation-*` değişkenlerini tam değer olarak kabul eder. Raw, `none`, yanlış namespace, undefined token, mixed değer, yorumlu bypass ve component-local custom property reddedilir. Multiline shadowlar tek semantic değişkene indirildi; duplicate selector testleri beklenen rolün tek olmasını ve cascade'deki son/effective değer olmasını zorunlu tutar. İlk review bir yüksek ve üç orta, ilk delta bir orta bulgu verdi; tümü kapatıldı ve final review bulgusuz onaylandı. `pnpm test` (81 Python + 36 faz parite + 44 token), `pnpm typecheck` ve `pnpm build` geçti; 118 rota ve 188 kontrast kontrolü doğrulandı. Filter/shadow literal sınıfı kapanmıştır. S06'da büyük bileşen ayrımı ve tarayıcı görsel kabulü devam eder. İçerik/schema/veri/URL, kaynak 2026 ve canlı sistem değişmedi; push/deploy yapılmadı.

## 27.10.2026 — S06-K `/about` editoryal bileşen ayrımı

`SubpageView` içindeki yalnız `/about` rotasına ait 237 satırlık kurumsal editoryal görünüm `AboutEditorialSection` bileşenine çıkarıldı. Parent koşulu ve `PageRecord` veri sözleşmesi aynı kaldı; yeni bileşen hook, browser API veya yeni `'use client'` sınırı eklemez. Kurumsal metrikler, hikâye, değerler, ofis, bağlantılar, harita iframe özellikleri, DOM sırası ve CSS sınıfları korunur. `SubpageView` 2402 satırdan 2167 satıra indi.

TDD kaydı: extraction sözleşmesi önce yeni dosya bulunmadığı için RED verdi; uygulama sonrasında kritik içerik/URL/iframe işaretleri, parent importu ve tek `/about` render sınırı GREEN oldu. Dev sunucusundan alınan önce/sonra `/about` HTML çıktıları aynı 59.733 bayttır; görünür 126 metin düğümü, 15 başlık ve 43 link birebir eşleşir. Tam dosya hash'i Turbopack modül/chunk kimliği değiştiği için farklıdır ve görsel eşlik kanıtı olarak kullanılmaz.

`pnpm test` (82 Python + 36 faz parite + 44 token), `pnpm typecheck` ve `pnpm build` geçti; 118 rota üretildi ve 188 kontrast kontrolünde hata yok. Bağımsız inceleme kritik/yüksek/orta bulgu olmadan onayladı. Work ayarlarında yerel tarayıcı erişimi kapalı olduğundan gerçek masaüstü/mobil görsel kabul ve console/hydration kontrolü yapılmadı; bu açık kapı olarak kalır. İçerik/schema/veri/URL, kaynak 2026, canlı ve remote repo değişmedi. Kullanıcıya ait `DEVOPS MASTER WORKFLOW.md` untracked bırakıldı; push/deploy yok. S06 devam ediyor: kalan büyük `SubpageView`/`HomepageView` ayrımları ve tarayıcı kabulü sıradadır.

## 27.10.2026 — S06-L Benefits bileşen ayrımı

Yapılandırılmış ürün/çözüm sayfalarının ortak benefits kart alanı `BenefitsSection` bileşenine çıkarıldı. Parenttaki `benefits && items.length > 0` koruması, 8 veya 12+ öğede dört kolon ve diğer durumda üç kolon seçimi, DOM sırası, sınıflar, başlıklar, dekoratif ikon özellikleri ve lazy loading aynen korunur. Bileşen `StructuredPageLayout['benefits']` tipinden türetilir; yeni veri kopyası, hook veya `'use client'` sınırı eklenmedi. `SubpageView` 2167 satırdan 2130 satıra indi.

TDD'de yeni bileşen bulunmadığı için extraction testi önce RED verdi; uygulama sonrası GREEN oldu. Ek veri sözleşmesi 28 benefits rotasında bölüm başlığı, en az bir öğe, öğe başlık/açıklaması ve yerel ikon dosyalarını doğrular. `/products/allplan-ultimate` önce/sonra çıktısı 178.111 bayt; script/RSC ayrıntıları çıkarıldığında HTML birebir aynıdır. 263 görünür metin düğümü, 59 link, 12 benefit kartı ve 12 kart başlığı/sırası eşleşir.

`pnpm test` (84 Python + 36 faz parite + 44 token), `pnpm typecheck` ve `pnpm build` geçti; 118 rota ve 188 kontrast kontrolü doğrulandı. Bağımsız review önemli bulgu vermedi. Work ayarlarında tarayıcı erişimi kapalı olduğundan gerçek responsive/screenshot/console kabulü yapılmadı. İçerik/schema/veri/URL, kaynak 2026, canlı ve remote repo değişmedi; push/deploy yok. S06 devam ediyor.

## 27.10.2026 — S06-M Media grid bileşen ayrımı

`SubpageView` içindeki ortak `renderMediaGrid` fonksiyonu etkileşimli `MediaGridSection` bileşenine çıkarıldı. Parent yalnız grid verisini, kart key prefix'ini ve video/görsel modal callbacklerini geçirir. Extra-grid React `key` değeri component üzerinde; kart anahtarındaki önceki prefix ayrı `itemKeyPrefix` propuyla korunur. Default kolon, YouTube thumbnail fallback, badge/subtitle/açıklama/bullet sırası, video ve görsel aria metinleri, Enter/Space, `preventDefault`, internal `Link`, external `_blank`/`noopener noreferrer`, footer CTA ve lazy image davranışı aynıdır. Component açık `'use client'` sınırına sahiptir; parent zaten client olduğu için bundle sınırı genişlemez. Lazy/Suspense eklenmedi ve ilk HTML/SEO davranışı değiştirilmedi. `SubpageView` 2130 satırdan 1987 satıra indi.

TDD'de component dosyası bulunmadığı için mimari test RED, uygulama sonrasında GREEN oldu. Veri sözleşmesi 29 rotada 8 core + 46 extra = 54 grid, 362 kart, zorunlu başlık/açıklamalar ve yerel görsel dosyalarını doğrular. `/products/allplan-ultimate` önce/sonra çıktısı 178.111 bayt; script/RSC ayrıntıları çıkarıldığında HTML birebir aynıdır. 263 görünür metin düğümü, 59 link, 3 grid, 38 kart, 38 etkileşimli thumbnail, aria sözleşmesi ve kart başlık sırası eşleşir.

`pnpm test` (86 Python + 36 faz parite + 44 token), `pnpm typecheck` ve `pnpm build` geçti; 118 rota ve 188 kontrast kontrolü doğrulandı. Bağımsız review kritik/yüksek/orta bulgu olmadan onayladı. Work tarayıcı erişimi kapalı olduğu için gerçek click/Enter/Space modal, responsive screenshot ve console/hydration kabulü yapılmadı; kaynak/HTML kanıtı bunların yerine geçmez. İçerik/schema/veri/URL, kaynak 2026, canlı ve remote repo değişmedi; push/deploy yok. S06 devam ediyor.

## 27.10.2026 — S06-N Split callout bileşen ayrımı

Primary ve bottom konumlarında iki kez yinelenen split-callout JSX'i ortak `SplitCalloutSection` client bileşenine çıkarıldı. İki filtre ve bölüm sırası parentta ayrı konumlarda kaldı: `Lisans ve Gereksinimler`/`SCIA Engineer` bottom, diğerleri primary. Bileşen filtrelenmiş diziyi map ettiği için `reverse ?? index % 2` alternasyonu ve `callout-top`/`callout-bottom` key prefix'leri aynı kaldı. YouTube→thumbnail fallback, yerel MP4/poster/muted/playsInline/preload, image lightbox, click/Enter/Space, `preventDefault`, aria/role/tabIndex, paragraph fallback, bullet temizliği, video CTA ve external link güvenlik özellikleri korundu. Lazy/Suspense veya CTA `Link` dönüşümü yapılmadı. `SubpageView` 1987 satırdan 1626 satıra indi.

TDD'de component dosyası bulunmadığı için mimari test RED, extraction sonrası GREEN oldu. Veri testi 22 rota, 62 callout, 52 primary, 10 bottom, 27 YouTube, 5 MP4, 30 image ve tüm yerel dosyaları doğrular. Önce/sonra sabit HTML üç rotada birebir aynıdır: `/solutions/addons/geometry-tools` 2 callout ve primary+bottom; `/solutions/features-allplan-bridge` 12 callout/5 native video; `/products/allplan-ultimate` 1 bottom callout. Görünür metin, link hedef/target/rel sırası, reverse dizisi, media aria sözleşmesi ve video attributeları eşleşir.

`pnpm test` (88 Python + 36 faz parite + 44 token), `pnpm typecheck` ve `pnpm build` geçti; 118 rota ve 188 kontrast kontrolü doğrulandı. Bağımsız review kritik/yüksek/orta bulgu olmadan onayladı. Gerçek tarayıcı click/Enter/Space modal, responsive screenshot ve console/hydration kabulü Work ayarı nedeniyle açık kalır. İçerik/schema/veri/URL, kaynak 2026, canlı ve remote repo değişmedi; push/deploy yok. S06 devam ediyor.

## 27.10.2026 — S06-O Video Library Hub bileşen ayrımı

Video kütüphanesi ana görünümü stateless `VideoLibraryHubSection` bileşenine çıkarıldı. 22 kaynak kartı, sıraları, açıklamaları, hedefleri ve playlist video sayısı eşlemesi aynı kaldı: 14 yerel playlist, 4 dış kanal ve daha sonra karara bağlanacak 4 adet `#` hedef. Abonelik banner'ı, internal/external link davranışı ve güvenlik attributeları değiştirilmedi. Yeni client boundary, lazy veya Suspense eklenmedi. `SubpageView` 1626→1405 satıra indi.

Extraction kontratları önce dosya bulunmadığı için RED, uygulama sonrasında GREEN oldu. Yerel video hub `<main>` çıktısı önce/sonra 42.221 bayt ve SHA-256 `a0e340ad055b577e0746f4f13b51354f8779c2d415ea61edb7115231fe8306f5` ile birebir aynıdır; 22 kart, 1 banner ve 23 ilgili hedef aynı sıradadır. Bağımsız review'ın tam URL sırası bulgusu 22 başlık–URL çiftini kilitleyen testle kapatıldı. `pnpm test` (90 Python + 36 parite + 44 token), `pnpm typecheck`, `pnpm build`, 118 rota ve 188 kontrast kontrolü geçti. Gerçek tarayıcı etkileşim/görsel/console kabulü Work ayarı nedeniyle açık kalır. İçerik/schema/veri/URL ve canlı sistem değişmedi; `#` hedefler önceki açık karar listesinde kalır. Push/deploy yok; S06 devam ediyor.

## 27.10.2026 — S06-P Referans dizini bileşen ayrımı

`/references` sayfasındaki 10 kategorili filtre, canlı arama, sayaç, 228 kart ve boş durum görünümü `ReferencesDirectorySection` client bileşenine çıkarıldı. Catch-all rota geçişlerinde mevcut filtre/arama state'inin korunması için iki state parentta bırakıldı ve bileşen kontrollü props/callbacklerle bağlandı. Arama `trim().toLowerCase()` davranışı, kategori+arama birleşimi, `✕` ile yalnız arama temizliği ve boş durum düğmesiyle iki state'in sıfırlanması aynıdır. Yeni debounce, locale dönüşümü veya klavye davranışı eklenmedi. `SubpageView` 1405→1266 satıra indi.

Mimari kontrat dosya yokken RED, extraction sonrası GREEN oldu. Veri testi 10 kategori, 228 benzersiz kategori–isim çifti ve `228/59/13/32/29/24/52/3/9/7` sayaçlarını hem bildirim hem gerçek veri üzerinden doğrular. Yerel `/references` `<main>` çıktısı önce/sonra 198.256 bayt ve SHA-256 `6ae415f04c01e26bcc245a8b56e491a9f0dd39f8b7902633fce9c1a6663473fd` ile birebir aynıdır; 10 sekme, 228 kart, başlangıç seçimi ve kart sırası değişmedi. `pnpm test` (92 Python + 36 parite + 44 token), `pnpm typecheck`, `pnpm build`, 118 rota ve 188 kontrast kontrolü geçti; bağımsız review engelleyici bulgu vermedi. Work tarayıcı ayarı kapalı olduğu için kategori/arama/temizleme/boş durum gerçek tıklama E2E kabulü açık kalır. İçerik/schema/veri/URL ve canlı sistem değişmedi; push/deploy yok, S06 devam ediyor.

## 27.10.2026 — S06-Q Video playlist bileşen ayrımı

14 eğitim playlist rotasının oynatıcı, bilgi alanı ve video listesi `VideoPlaylistSection` client bileşenine çıkarıldı. `activeVideoId` parentta bırakıldı ve controlled prop/callback ile bağlandı; böylece ortak video ID'lerine sahip playlistler arasındaki mevcut catch-all rota geçiş davranışı değişmedi. İlk video fallback'i, indeks hesabı, iframe ve YouTube hedefi, açıklama fallback'i, iki sayaç, aktif kart/playing badge, thumbnail alt/lazy özellikleri korunur. Lazy, Suspense veya `key={playlist.id}` eklenmedi. `SubpageView` 1266→1147 satıra indi.

Boundary kontratı bileşen dosyası yokken RED, uygulama sonrasında GREEN oldu. Veri testi 14 playlist, 242 kayıt, 216 benzersiz global video ID'si, playlist içi benzersizlik, rota ilişkileri, tam playlist sayıları ve 14 ilk-video ID sırasını doğrular. `hello-allplan-2024` yerel `<main>` çıktısı önce/sonra 59.854 bayt ve SHA-256 `a5d0111757ec46680f4600e530fbf976c8cfa7553c0a51a8010e4ebe65e90695` ile birebir aynıdır; 39 öğe, tek aktif kart ve ilk iframe korunur. `pnpm test` (94 Python + 36 parite + 44 token), `pnpm typecheck`, `pnpm build`, 118 rota ve 188 kontrast kontrolü geçti; bağımsız review engelleyici bulgu vermedi. Work tarayıcı ayarı kapalı olduğundan video seçimi sonrası iframe/link/sayaç/aktif sınıf gerçek tıklama E2E kabulü açık kalır. İçerik/schema/veri/URL ve canlı sistem değişmedi; push/deploy yok, S06 devam ediyor.

## 27.10.2026 — S06-R Arama sayfası bileşen ayrımı

`/search` görünümü ve beş alanlı filtreleme `SearchPageSection` controlled client bileşenine çıkarıldı. `searchQuery` parentta bırakıldı; catch-all navigasyon/geri dönüşte mevcut state yaşam döngüsü korunur. Statik 110 kayıtlı indeks child modülünde okunur. `query.trim()` yalnız filtreyi açan koşuldur; eşleşme değeri mevcut davranış gibi trim edilmeden `toLowerCase()` uygulanır. Title/SEO title/description/path/keywords OR sırası, kaynak sırası, kart/link markup'ı ve anlık filtreleme değişmedi; debounce/lazy/Suspense eklenmedi. `SubpageView` 1147→1104 satıra indi.

Boundary kontratı dosya yokken RED, veri kontratı baştan GREEN ve extraction sonrası tümü GREEN oldu. Veri testi 110 benzersiz path'i `pages.json` sırasıyla, içerik alanlarıyla ve temsili sorgularla doğrular: boş/boşluk 110, `allplan` 79, `BIMFlex` 2, `Köprü` 9, `Prekast` 4, eşleşmeyen 0 ve mevcut trim edilmeyen ` bimflex ` davranışı 1 sonuç. Yerel `/search` `<main>` çıktısı önce/sonra 86.909 bayt ve SHA-256 `64f0a28ae881dbe891285f46e074049dfc64825c5a1e6bf7251107341437efb5` ile birebir aynıdır; 110 kart, başlık ve ilk/son rota korunur. `pnpm test` (96 Python + 36 parite + 44 token), `pnpm typecheck`, `pnpm build`, 118 rota ve 188 kontrast kontrolü geçti; bağımsız review engelleyici bulgu vermedi. Input'un önceden var olan görünür label/aria-label eksikliği erişilebilirlik iyileştirme maddesi olarak açık, bu extraction regresyonu değildir. Work tarayıcı ayarı kapalı olduğundan gerçek yazma/sonuç/link/Back E2E kabulü açık kalır. İçerik/schema/veri/URL ve canlı sistem değişmedi; push/deploy yok, S06 devam ediyor.

## 27.10.2026 — S06-S Alt sayfa hero bileşen ayrımı

Ortak breadcrumb, bölüm badge'i, H1/açıklama, teklif/deneme/PDF CTA'ları ve opsiyonel hero görseli stateless `SubpageHeroSection` bileşenine çıkarıldı. `isLegalPage`, dedupe edilmiş `photoImages`, `heroImage` ve `sectionBadgeLabel` parentta kaldı; bunlar galeri/spec akışıyla ortak kullanıldığı için yeniden türetilmedi. Yeni client boundary, wrapper, Next Image, lazy veya Suspense eklenmedi. Legal ve `/about` CTA istisnası, 18 `/products*` rotasındaki PDF koşulu, breadcrumb son öğe `aria-current` davranışı ve figcaption koşulu korunur. `SubpageView` 1104→1013 satıra indi.

Boundary kontratı bileşen yokken RED, veri dal testi baştan GREEN ve extraction sonrası tümü GREEN oldu. Veri testi 109 alt sayfa, 69 hero görselli rota, dört CTA'sız rota (`/about` + üç legal), 18 ürün rotası ve kaynak PDF dosyasını doğrular. İlk temsilî parity kontrolü iki benzer PDF adı nedeniyle `karsilastirma`/kaynak `karsilastirme` farkını yakaladı; component ve test kaynak hedefe geri döndürüldü. Son durumda ürün, about, legal, search ve playlist olmak üzere beş hero `outerHTML` çıktısı byte/hash düzeyinde aynıdır; link, görsel ve CTA dalları değişmedi. `pnpm test` (98 Python + 36 parite + 44 token), `pnpm typecheck`, `pnpm build`, 118 rota ve 188 kontrast kontrolü geçti. Work tarayıcı ayarı kapalı olduğundan responsive görsel/console kabulü açık kalır. İçerik/schema/veri/URL ve canlı sistem değişmedi; push/deploy yok, S06 devam ediyor.


## 27.10.2026 — S06 yerel teknik kapanış

Kullanıcının ara onay beklemeden kalan yerel adımları tamamlama talebiyle `docs/verification/s06-2026-10-27/closure-plan.md` uygulandı. S06'nın kod-kontrollü işleri tamamlandı; S07 tarayıcı/operatör kabulü ve yayın hazırlığına otomatik geçilmedi.

- Schema/veri: görünür 25 SSS kaydı `FAQPage` ile; sekiz eğitim hizmeti canonical benzersiz `Service.@id` ile eşleşir. Contact ve Organization aynı generated `siteIdentity` kaynağını kullanır.
- İçerik/presentation: homepage yıllık etiketleri, hero, hizmet grupları/ikon anahtarları ve video kataloğu generated data katmanındadır. `ProfessionalServicesSection` ayrıldı; yıllık Search/llms metinleri merkezi veriye bağlandı.
- Design system: workflow renkleri semantic accent key, bütün application z-index değerleri semantic token oldu. Üretim `preview.css` girdisindeki renk/ölçü/z-index kararları semantic tokenlara, 40/64rem responsive sınırları build-time breakpoint üretimine taşındı. Yapısal literal allowlist ve negatif guard `raw-literal-audit.json`/`test_design_literal_contract.py` içinde.
- Component mimarisi: 52 structured rota `StructuredPageLayoutSection` tarafından controlled props ile render edilir; `SubpageView` 723 satırdır. 273 related content link ve bütün bölüm sayıları testle kilitlidir.
- Erişilebilirlik: beş tab ailesinde ortak Arrow/Home/End, roving focus, kalıcı tab/panel ilişkisi; Search accessible name. Klavye helper'ı gerçek runtime testinde wrap/select/focus davranışıyla çalıştırılır.
- Yerel kabul: final tam paket 117 Python birim testi, typecheck, build, 36 parite, 45 token, 188 kontrast ve 118 build rotasıyla başarılıdır. `render-final.json` 110/110 HTTP 200, 110/110 tek H1, 0 fetch hatası, 0 bozuk yerel hedef, 0 boş structured section gösterir. İlk HTML'de görünmeyen 16 rota/303 etkileşim metni önceki baseline ile aynıdır.
- İnceleme: whole-branch review'ın bulduğu tek HIGH (`preview.css` token kapsamı) test-first kapatıldı. Son code review ve ayrı güvenlik review'u Critical/High/Medium bulgu olmadan onayladı.
- Browser kabulü açık: Codex yüzeyi `Browsers: Error: Local browser use is disabled in Work settings` verdi. Click/type, responsive, console/hydration ve dört tema/mod screenshot kabulü yapılmış sayılmaz; S07/operator kapısıdır.
- Kaynak 2026 salt-okunur kaldı; marketing materials, canlı sistem ve remote değiştirilmedi. Push/PR/merge/deploy yok. Kullanıcıya ait izlenmeyen `DEVOPS MASTER WORKFLOW.md` korunur.

Sıradaki güvenli adım: browser erişimi açıldığında S07 gerçek etkileşim + responsive + theme/console kabulü; ardından kullanıcı kararıyla branch push/PR veya yerel merge. Canlı yayın ayrıca açık onay gerektirir.

## 27.10.2026 — GitHub teslim hazırlığı

Kullanıcı boş `hazarvolga/aluplan-2027` remote'una tam GitHub teslim zincirini uygulama onayı verdi. Kök `DEVOPS MASTER WORKFLOW.md` takip altına alındı (`597b65d`). PR ve `main` pushlarında generated-data drift, 117 test, 36 parite, 45 token testi, typecheck, production build ve production dependency audit çalıştıran minimum `contents: read` yetkili CI eklendi (`ea87df7`). Action bağımlılıkları tam commit SHA ile sabittir; Node `20.20.2`, pnpm `10.24.0` kullanılır. Yerel doğrulama ve bağımsız code review başarılıdır.

Public-repo güvenlik incelemesinin üçüncü taraf ALLPLAN/AX3000 varlıkları için açtığı durdurma kapısı kullanıcı kararıyla private repository üzerinden kapatıldı; GitHub repository görünürlüğü `PRIVATE` olarak doğrulandı. İlk push öncesinde tüm `main` ve çalışma dalı commitlerinin author/committer e-postası GitHub noreply adresine çevrildi, izlenen dokümanlardaki mutlak kullanıcı yolları göreli veya taşınabilir referanslarla değiştirildi. Geçmiş yeniden yazımı öncesi doğrulanmış bundle `/tmp/aluplan-2027-pre-github-rewrite-20261027.bundle` altında yalnız yerel kurtarma amacıyla tutulur; repoya eklenmez. İlk push öncesi remote boştu; aşağıdaki kayıt teslim zincirinin kapanış durumunu verir. Canlı deploy yoktur.

İlk GitHub Actions çalışması `40526513349`, bağımsız runner'da `../aluplan-2026` checkout'u bulunmadığı için belge hazırlama adımında fail-fast oldu. Veri üretim ön kontrolü TDD ile taşınabilir hale getirildi: salt-okunur kaynak checkout mevcutsa önceki sıkı kaynak doğrulama/senkronizasyonu korunur; checkout yoksa commitlenmiş manifest ve belge kopyaları allowlist, boyut, SHA-256, dosya yapısı ve symlink/path güvenliğiyle doğrulanır, kopyalama veya sentetik belge üretimi yapılmaz. İki fallback testi eklendi. Yerel tekrar doğrulamada 119 test, 36 parite, 45 token ve 188 kontrast kontrolü, typecheck, 118 rota production build'i ve production dependency audit geçti. Bağımsız code/security review engelleyici bulgu bildirmedi. PR CI tekrarının başarılı olması hâlâ merge kapısıdır.

İkinci GitHub Actions çalışması `40527172999`, belge ön kontrolünü geçti ancak macOS global `Icon?` ignore kuralının yerelde 45 adet `icons/` PNG dosyasını sessizce Git dışında bırakması nedeniyle generated-data drift kapısında durdu. Temiz Linux clone aynı adlı tracked fallback dosyalarını seçerken yerel üretim kaynak-faithful fakat untracked yolları kullanıyordu. Repo `.gitignore` kuralı yalnız `public/assets/**/icons/*.png` kapsamını açıkça geri dahil edecek biçimde daraltıldı; kaynak 2026 ile SHA-256 eşleşmesi doğrulanan 45 küçük PNG takip altına alındı. Yeni guard testi render edilen generated-data asset URL'lerinin hem mevcut hem Git tracked olmasını zorunlu kılar; eksik olduğu zaten envanterde korunan `sourceImageSrc` provenance değerleri render hedefi sayılmaz. `pages.json` içeriği ve SHA-256 değeri değişmedi. PR CI başarılı olmadan merge yoktur.

Teslim kapandı: [PR #1](https://github.com/hazarvolga/aluplan-2027/pull/1) başarılı üçüncü PR CI çalışması `40528881783` sonrasında merge commit `136e0c2c4d16b59789126083e538014696ceb83a` ile `main` dalına alındı. `main` push CI çalışması `40529150402` da generated-data, 120 test, parite, token/kontrast, typecheck, production build ve dependency audit adımlarının tamamında başarılı oldu. Yerel `main` bu merge commitine fast-forward edildi; post-merge `pnpm test`, `pnpm typecheck` ve `pnpm build` tekrar geçti. GitHub Actions, Node 20 tabanlı action runtime'larını runner üzerinde Node 24'e zorladığına dair engelleyici olmayan bir deprecation uyarısı veriyor; action sürüm yükseltmesi ayrı bakım işi olarak izlenmelidir. Canlıya yayın yapılmadı; S07 browser kabulü ve ayrı deployment onayı açık kalır.

## 27.10.2026 — Sayfa sonu dönüşüm alanı tasarım kararı

Kullanıcı otomatik “İlgili Bağlantılar, Modüller ve Dokümanlar” bölümünün sayfa mesajını böldüğünü belirtti; sayfa sonunun önceliğini teklif/deneme dönüşümü olarak seçti. Mevcut temiz `main` (`862ebb15e328c6eee47755d6070f8d333a4125b9`) için `restore/pre-page-end-conversion-20261027` annotated tag'i oluşturulup GitHub'a gönderildi. Seçilen yaklaşım tek bileşenin sayfa ailesine göre CTA üretmesidir: ürün/çözüm teklif + deneme, eğitim eğitim talebi + teklif, destek destek platformu, legal hiçbir band. Kısa tasarım `docs/superpowers/specs/2026-10-27-page-end-conversion-design.md` ile onaylandı; test-first uygulama planı `docs/superpowers/plans/2026-10-27-page-end-conversion.md` içinde son kullanıcı kontrolünü bekler. Ürün kodu, veri, schema ve canlı site henüz değiştirilmedi.

## 29.10.2026 — ALLPLAN Max yerel önizleme

Kullanıcı 2027 ana sayfasını şimdilik yeterli bulup ALLPLAN Max sayfasını istedi. `/preview/allplan-max` yalnız geliştirmede çalışan, noindex yerel taslaktır; ana sayfa 2027 önizlemesindeki MAX bağlantısı buraya gider. İçerik `docs/content-2027/allplan-canlı/allplan-max.md` envanterinden EN/TR veri olarak ayrıldı; kaynak video ve özellik görselleri yerel preview varlıklarına kopyalandı. Üretim URL'si, schema, sitemap ve yayın güncellenmedi. Typecheck ve HTTP 200/noindex kontrolü geçti; tarayıcıda görsel ve etkileşim kabulü henüz yapılmadı. Üretici medyasının yayın kullanım izni, 2027 ürün kapsamı, 2026 sınırsız kullanım ifadesinin geçerliliği ve anket iddialarının kullanım koşulları yayın öncesi doğrulanmalı. YouTube iframe'leri kapalı details içinde de oluşturuluyor; etkileşim öncesi ağ isteği kontrolü ve gerekiyorsa tıklamayla yükleme tamamlanmalı. Çalışma ağacındaki önceki taslaklar korunmuştur; commit/push/deploy yapılmadı.

29.10.2026: Kullanıcı isteğiyle ALLPLAN Max anket bandı, Mimari sayfasındaki ortak `alu-hero-metrics` kart düzenine uyarlandı; üç anket metni ve değerleri korundu. Typecheck ve yerel sayfada üç kartın render kontrolü yapıldı. Taslak için kullanıcı görsel değerlendirmesi bekleniyor.

29.10.2026: ALLPLAN Max video düğmeleri mevcut MediaDialog ile açılan pencerelere taşındı; iframe yalnız pencere açıldığında yüklenir ve kapanınca kaldırılır. ALLPLAN canlı sayfası yeniden kontrol edilerek dokuz güncel video ID'si kullanıldı; Formula Writer ve BIM Modeler video bağlantıları eklendi. Typecheck ve Feature Builder modal açma/Escape/odak dönüşü tarayıcıda doğrulandı; video oynatma ve diğer sekiz modal ayrı ayrı doğrulanmadı. Ana özellik satırlarının görsel düzeni kullanıcı incelemesine açıktır. Yayın ve commit yapılmadı.

29.10.2026: ALLPLAN Max canlı sayfası tekrar incelendi; önceki envanter ile son gözlem farkları `docs/content-2027/allplan-canlı/allplan-max.md` sonuna tarihsel kayıt korunarak eklendi. Preview'da AI BIM Modeler Allplan kapsamı ve üç görüşün canlıda görülen isim/meslekleri gösteriliyor; dokuz video hedefinin veri kayıtları canlı gözleme hizalandı. Farkların üretici güncellemesi veya önceki DOM görünürlüğünden hangisi nedeniyle oluştuğu bilinmiyor. Diğer üretici dokümanları bu turda yeniden incelenmedi. Typecheck ve sayfa HTML içerik kontrolü yapıldı; ticari koşullar ve medya kullanım izni yayın öncesi açık.

29.10.2026: Kullanıcının bildirdiği ALLPLAN Max video görünümü incelendi. Marketing Materials içindeki dosya ile preview varlığının SHA-256 değerleri aynı; dosya zaten yerel asset altında mevcut. `preload="none"` ve ayrılmış en-boy oranı bulunmaması nedeniyle oynatıcı başlangıçta ince, boş şerit halinde görünüyordu. Önizlemede metadata ön yükleme ve 16:9 alan eklendi. Tarayıcıda video 1920×1080, 60,01 sn olarak yüklendi ve oynatma doğrulandı; typecheck geçti. Canlıya yayın yapılmadı.

29.10.2026: ALLPLAN Max ana özelliklerinin canlı sayfadaki sunumu yeniden incelendi: üç bölümde açıklama yanında sessiz döngülü kaynak klip, metinde tam videoyu modal açan bağlantı bulunuyor. Preview'a üç yerel üretici klibi ve dönüşümlü iki sütun düzeni eklendi; bağlantı modal açıyor, reduced-motion seçeneği ve mobil düzen dikkate alındı. Typecheck, yerel medya yüklemesi ve Feature Builder modal açma/Escape doğrulandı; üç klibin eşzamanlı yükleme maliyeti ve üretici medya izni yayın öncesi değerlendirilmeli.

29.10.2026: ALLPLAN Max diğer özellikler kartlarında ürün kapsamı metinleri token tabanlı şerit olarak düzenlendi. Kullanıcının Marketing Materials klasörüne indirdiği Feature Builder, Workflow Builder ve BIM Analyst önizleme klipleri ile mevcut preview assetleri SHA-256 bakımından birebir eşleşiyor; tekrarlı kopya oluşturulmadı. Typecheck ve önizleme içerik kontrolü yapıldı.

29.10.2026: Kullanıcı isteğiyle ALLPLAN Max diğer özellik kartlarında video bağlantıları kapsam şeridinin üstüne taşındı, şeritler flex düzeniyle kartların altına hizalandı. Typecheck geçti; tarayıcıda altı şeridin kart altına aynı uzaklıkta olduğu doğrulandı.

29.10.2026: Kullanıcı, video izleme gibi metin biçimindeki bağlantılarda alt çizgi istemediğini belirtti. ALLPLAN Max önizlemesindeki ortak video tetikleyicisinin normal ve hover durumlarından alt çizgi kaldırıldı; klavye odağı göstergesi korunuyor. Bu tercih benzer bağlantı tasarımlarında da dikkate alınacak.

29.10.2026: ALLPLAN Max müşteri görüşleri kullanıcı isteğiyle daha kompakt, ince ayraçlı bir düzene alındı; yorum, isim, meslek ve kaynak bilgisi ayrıştırıldı. Geniş ekranda başlığın tek satır olduğu ve üç atfın render edildiği yerel tarayıcıda kontrol edildi; typecheck geçti. Kullanıcı görsel değerlendirmesi bekleniyor.

29.10.2026: Kullanıcı isteğiyle ALLPLAN Max giriş alanı ayrı, kompakt ince çizgili bölüme dönüştürüldü ve yorum başlığı yanındaki ALLPLAN etiketi kaldırıldı. Site genelinde URL bağlantılarının normal ve hover alt çizgileri kaynak stillerden kaldırıldı; görünür klavye odağı korundu, paragraf içi bağlantılar kalınlıkla ayrıştırıldı. Link design-system notu güncellendi. Typecheck, stil üretimi ve 188 kontrast kontrolü geçti; tüm sayfalarda görsel/erişilebilirlik kabulü henüz yapılmadı.

29.10.2026: ALLPLAN Max ana video bölümünde görünür kaynak etiketi kullanıcı isteğiyle kaldırıldı ve üst/alt padding sıfırlandı; kaynak bilgisi envanterde korunuyor. Typecheck ve tarayıcıda hesaplanan padding değerleri doğrulandı.

29.10.2026: ALLPLAN Max kapanış CTA alanı kullanıcının isteğiyle daha kompakt ve ince ayraçlı iki sütun olarak yeniden düzenlendi; demo ve deneme bağlantıları ve içerik korundu. Typecheck ve yerel tarayıcıda tek satırlı başlık ile CTA içerikleri kontrol edildi; kullanıcı görsel değerlendirmesi bekleniyor.

29.10.2026: Kullanıcı ALLPLAN 2027 yenilikler sayfasının önceki envantere dayanılmadan doğrudan canlı üretici sayfasından hazırlanmasını istedi. `/preview/allplan-2027-features` geliştirme-only noindex taslağı beş ürün grubu, 15 ana özellik ve 34 detay (31 ALLPLAN + 3 SCIA) içerir; kaynak görsellerinin 14 yerel kopyası ile Civil videosu eklendi. Ana sayfa 2027 önizlemesinin yenilikler CTA'sı bu taslağa bağlandı. Kaynakta sekmeler vardır; taslakta bölüm içi bağlantılar kullanıldı, tasarım kabulü açık. FRILO yalnız ana sayfa bandından çıkarıldığı için kaynak sayfa kapsamında tutuldu. Üreticinin Buy Now CTA'sı Türkiye satış hedefi kararı olmadığı için kullanılmadı; mevcut teklif ve deneme bağlantıları korundu. IFC4 için buildingSMART sertifikasyonunun incelemede olduğu bilgisi korunur. Typecheck, dört homepage preview testi, noindex/HTTP ve DOM'da kapsam/IFC açılır açıklaması doğrulandı. Ana özelliklerin İngilizce kaynak metninin veri katmanında kaydı, teknik çeviri/editoryal inceleme, medya hakları ve mobil/video kabulü açık; canlı yayın yok.

29.10.2026: Kullanıcı ALLPLAN 2027 yeniliklerinin uzun tek liste halinde incelenmesinin zor olduğunu belirtti; önizleme beş ürün sekmesine çevrildi. Varsayılan ALLPLAN, diğer paneller seçildiğinde yalnız seçilen içerik render edilir; mevcut klavye helper'ı ve mobil yatay kaydırma kullanılır. Typecheck ve HTTP/SSR kontrolünde beş tab/panel ve tek seçili tab doğrulandı. Work tarayıcı erişimi bu turda kapalı olduğundan etkileşim ve mobil görsel kontrolü yapılamadı.

29.10.2026: ALLPLAN 2027 önizleme özellik satırları kullanıcı isteğiyle kompakt, ince çizgili, kapsam şeritli ve dönüşümlü görselli düzene güncellendi. İçerikler ve sekmeler korundu; tip kontrolü ve HTTP 200 geçti. Görsel/mobil kullanıcı kabulü bekleniyor.

29.10.2026: ALLPLAN 2027 önizlemesindeki diğer iyileştirmeler akordiyonları ince çizgili kompakt satırlara dönüştürüldü; açık/kapalı göstergesi ve klavye odak stili eklendi, içerikler ile native details/summary korundu. Typecheck ve HTTP 200 kontrolü geçti; mobil ve tarayıcı etkileşim incelemesi açık.

29.10.2026: ALLPLAN 2027 önizlemesindeki sekme paneli ve akordiyonlara mevcut motion tokenlarıyla hafif giriş/geçiş efektleri eklendi; reduced-motion tercihinde animasyon kapalı. Native details korundu; akordiyon yüksekliği/kapanışı animasyonlu değildir. Typecheck ve HTTP geçti, tarayıcı görsel/azaltılmış hareket testi açık. Site geneline yaygınlaştırma bu turda yapılmadı; önizleme kullanıcı değerlendirmesinde.

29.10.2026: 2027 yenilikler kapanış alanı kompakt ince çizgili düzene taşındı. İki önizlemenin daha önce ayrı kapanış markup'ı `PreviewClosingSection` sunum bileşeninde birleştirildi; içerik ve CTA hedefleri ayrı veriliyor. Mevcut üretim `PageEndConversion` ve politikası değiştirilmedi. Typecheck, iki önizlemede HTTP 200 ve code review geçti; mobil/görsel kabul açık.

29.10.2026 — Tasarım kararı: Kullanıcı kompakt, ince çizgili, keskin köşeli ve ortak şablon kullanan tasarım dilinin yeni sayfalarda varsayılan uygulanmasını onayladı. Önceden oluşturulan sayfalardaki tekrarlanan ortak alanlar da sonradan aynı dilde değerlendirilecek; kapsam/sayfa ve görsel kabul ayrı takip edilecek, bu not toplu değişikliğin tamamlandığı anlamına gelmez.

29.10.2026: Kullanıcı kompakt tasarımın yeni sayfalarda varsayılan olması ve eski ortak alanların daha sonra değerlendirilmesi kararını verdi. `/preview/allplan-civil-2027` yalnız geliştirmede/noindex yerel taslak açıldı; güncel https://www.allplan.com/products/allplan-civil/ kaynak alındı. 28 özellik, 9 cloud, 4 opsiyon, 2 SSS, 3 uzman/3 referans, kaynak video hedefleri ve kapanış CTA yer alıyor. Üç kapsam ve üç referans görseli dosya adı eşleştirilerek eklendi (uzak dosya hash doğrulaması yok); hero, katalog ve diğer kaynak görselleri eksik. Bazı çeviriler kısaltılmış/parafraz; kaynakla eksiksiz eşleşme iddia edilmez ve satır bazlı editoryal inceleme gereklidir. Abonelik/ref bağlantıları ve üst video eklendi. Türkiye paket koşulları, nicel iddialar ve medya hakları doğrulanmalı. Typecheck, HTTP 200 ve noindex kontrolü geçti; tarayıcı/mobil/video oynatma kabulü yapılmadı, yayın yok.

29.10.2026: ALLPLAN Civil metrikleri, diğer sayfalarda kullanılan ortak alu-hero-metrics düzenine geçirildi; dört değer ve açıklamaları korundu. Typecheck ve sunulan HTML'de dört metrik doğrulandı; tarayıcı erişimi devre dışı olduğundan görsel/mobil kabul açık.

29.10.2026: Civil önizleme hero'su kullanıcı isteğiyle yeni üretilen altyapı/köprü görseli ve sola doğru yüzey rengine karışan arka planla güncellendi. Yüksek çözünürlüklü orijinal assets/source/generated/heroes/civil/allplan-civil-hero-original.png, web kopyası public/assets/previews/allplan-civil-2027/civil-hero.jpg. Typecheck ve görsel HTTP 200 geçti; tarayıcıda açık/koyu ve mobil görsel kabul henüz yapılmadı.

29.10.2026: Kullanıcı Civil sayfasının tümünde kompakt tasarımın tutarlı uygulanmasını ve hero metninin görselle çakışmamasını istedi. Civil preview CSS'de hero başlığı sınırlandırıldı, görsele soldan maske eklendi; zorluklar, katalog, kapsam, referans ve SSS alanları token tabanlı ince çizgili kompakt düzene taşındı. Metrikler mevcut alu-hero-metrics ve kapanış PreviewClosingSection kullanıyor; diğer kataloglar henüz ortak React bileşenlerine taşınmadı. Typecheck ve HTTP 200 başarılı; tarayıcı/mobil/tema görsel kontrolü açık. Kaynak içerik ve medya eksikleri önceki notlarda devam ediyor.

29.10.2026: Kullanıcı Mimari sayfasındaki giriş ve sektörel zorluk düzenlerini Civil için örnek gösterdi. Civil girişinde metin ve kapsam solda, video sağda olacak biçimde ortak alu-intro-split sınıfları kullanıldı. Dört zorluk ortak alu-challenges-band/grid/card stillerine geçirildi; Civil içeriği ve bağlantıları korundu. Typecheck ve HTTP 200 doğrulandı; tarayıcıda görsel ve responsive kabul açık.

29.10.2026: Kullanıcı site genelinde tasarım tutarlılığı ve ortak bileşen envanteri istedi; Civil avantajları önceki yetkili düzeltme olarak BenefitsSection'a taşındı (8 metin ve bağlantılar korundu). Statik rota/bileşen denetimi docs/verification/design-consistency-audit-2026-10-29.md içinde; 110 veri kaydı/53 structuredLayout incelendi, tüm rotalarda görsel tarayıcı kabulü yapılmadı. Özellikler için MediaGridSection ile Civil Catalogue farkı ve eksik kaynak görselleri, ortaklaştırma planının ilk maddesidir. Analiz aşamasında site genelinde toplu tasarım değişikliğine gidilmedi.

29.10.2026: Kullanıcının onayıyla Civil özellik kataloğu için kaynak–yerel medya fark kaydı docs/verification/civil-feature-media-audit-2026-10-29.md oluşturuldu. Preview'da CivilFeatureGrid adaptörü mevcut MediaGridSection'ı ve MediaDialog'u kullanıyor: 28 kart ve 14 video düğmesi HTML'de doğrulandı, typecheck ve HTTP 200 geçti. Videolu kartların küçük görseli YouTube kaynağından otomatik gelir; kaynağın özgün görsel eşleşmesi değildir. Kaynak görselleri, bazı kısaltılmış Türkçe metinler, medya izinleri ve 14 videonun gerçek oynatımı açık; tarayıcı etkileşim/mobil kabul yapılmadı. Shared production MediaGridSection değiştirilmedi.

30.10.2026: Civil önizlemesinde sekiz avantaj ikonu ve 28 özellik görseli, mevcut ALLPLAN Civil medya envanterindeki yerel dosyalardan asset dizinine alınıp ortak bileşenlere bağlandı. Görselsiz/video olmayan kartlar için görsel modalı eklendi, videolu kartlarda mevcut video modalı korunuyor; dört sütun kullanıldı. Kaynak URL/dosya hash karşılaştırması ve görsel uygunluğu tüm 28 öğede henüz doğrulanmadı; kaynak medya yayın izinleri açık. Typecheck ve yerel asset dosya kontrolü yapıldı; tarayıcı etkileşim/mobil kabul açık.

30.10.2026: Civil satın alınabilir seçenekler alanı mevcut MediaGridSection ve CivilFeatureGrid adaptörünün options varyantıyla dört sütunlu medya kartlarına geçirildi; dört metin, BIM²form video hedefi ve yerel envanter görselleri korundu. Typecheck ve HTTP kontrolü geçti. Üretici medya hakları, bölgesel ticari uygunluk ve tarayıcıda etkileşim/görsel kabul açık.

30.10.2026: Civil uzman görüşleri alanı kullanıcı isteğiyle ALLPLAN Max yorum bölümünün mevcut CSS düzenini kullanacak şekilde yenilendi; üç uzman adı, görevi, alıntısı ve video URL'si korundu. Typecheck ve HTTP 200 geçti; görsel/mobil tarayıcı kabulü açık. Paylaşılan React bileşeni değil, ortak CSS modülü kullanılıyor.

30.10.2026: Civil uzmanlar bölümü ALLPLAN Max yorum düzeninin CSS modülüyle; Cloud Services ise mevcut MediaGridSection adaptörüyle yeniden düzenlendi. Dokuz hizmetin metinleri, video hedefleri ve yerel envanter görselleri ile Cloud Services bağlantısı korundu. Typecheck ve HTTP 200 geçti; tarayıcıda görsel/etkileşim kabulü ve medya hakları açık.

30.10.2026: Kullanıcı firma geri bildirimiyle FRILO'nun kapsamda olduğunu bildirdi; önceki ana sayfa bandından dışlama kararı güncellenmeli. Üreticinin https://www.allplan.com/shop/products/frilo sayfasından /preview/frilo dev-only noindex ilk taslak oluşturuldu. Beş paket ve temel özellikler özet düzeydedir; kaynak sayfadaki tüm paket detayları, capability, referans, SSS ve görseller henüz aktarılmadı. Türkiye ürün/paket koşulları ve 14 gün FRILO denemesi için bölgesel geçerlilik doğrulanmalı; FRILO deneme CTA üreticiye işaret eder. Ana sayfa bandına FRILO henüz eklenmedi. Typecheck/HTTP 200 doğrulandı; yayın ve görsel kabul yapılmadı.

30.10.2026: Kullanıcı FRILO sayfasında fiyat gösterilmeyeceğini teyit etti. /preview/frilo taslağına canlı üretici sayfasındaki beş yetenek, iki proje ve beş SSS'nin Türkçe özetleri eklendi; fiyat eklenmedi. Typecheck ve HTTP 200 geçti. Sayfa hâlâ eksik: beş paketin tüm ayrıntılı maddeleri ve kaynak proje bağlantıları/görselleri aktarılmadı, 2027 ana sayfa bandında FRILO yok, tüm çeviriler ve Türkiye kapsam koşulları doğrulanmadı; bu durum tamamlanmış kaynak paritesi sayılmaz.

30.10.2026: FRILO preview için yapı mühendisliği temalı üretilmiş hero eklendi. Orijinal assets/source/generated/heroes/frilo/frilo-hero-original.png; optimize web kopyası public/assets/previews/frilo/frilo-hero.jpg. Metin solda, görsel sağda ve soldan maskeli. Typecheck/HTTP 200 geçti; açık/koyu ve mobil görsel kabul yapılmadı. FRILO içerik eksikleri önceki notta açık.

30.10.2026: Kullanıcı gelecek sayfalarda ortak bileşen ve kompakt tasarım denetimini istedi. FRILO preview hero dışındaki gereksiz kapsayıcı boşluğu kaldırıldı, metin genişliği sınırlandı, yinelenen FRILO ile çalışın alanı kaldırıldı, beş sürüm duyarlı ızgaraya alındı ve iki gerçek ALLPLAN proje bağlantısı eklendi; kapanış ortak bileşeni tam genişliğe taşındı. Typecheck ve HTTP 200 geçti. Bu bir kısmi iyileştirmedir: paketlerin ayrıntılı kaynak maddeleri, proje görselleri, SSS ortaklaştırması, mobil/tema görsel kontrolü ve içerik/medya hakları doğrulaması açık. Yeni sayfada başlamadan tasarım bileşeni, içerik/URL/medya paritesi, mobil ve erişilebilirlik kontrolü yapılmalıdır.

### 30.10.2026 — FRILO kaynak sayfası içerik kontrolü
- Kaynak: https://www.allplan.com/shop/products/frilo ; yerel hedef `/preview/frilo`. Beş sürümün her birindeki beş kapsam maddesi Türkçe olarak eklendi; genel bakış, beş yetenek açıklaması, proje ve 14 günlük deneme koşulları kaynakla karşılaştırılarak genişletildi. Fiyat ve sepet eklenmedi.
- Kaynak sayfadaki bölüm gezinmesi, ürün/kabiliyet ve proje görselleri ile pakete özel detay sayfası bağlantıları henüz uygulanmadı; paket bağlantıları fiyat gösteren mağazaya gider. Kaynakta pazara özgü satış/ödeme ve destek vaatleri Türkiye için doğrulanmadan aktarılmadı. Kaynak metin web aracıyla görüldü; kaynak görsel ve etkileşimlerinin tarayıcı doğrulaması yapılamadı.
- `pnpm typecheck` başarılı; yerel önizleme HTTP 200 ve seçili içerik sunucu çıktısında doğrulandı. Görsel kabul ve teknik terimlerin nihai kontrolü açık.

- FRILO önizlemesine dört sekmeli gezinme eklendi: Genel bakış, Yetenekler, Başarı hikâyeleri ve Sık sorulan sorular. Mevcut klavye sekme yardımcısı kullanıldı; `pnpm typecheck` ve sunucu çıktısında 4 sekme/4 panel kontrolü başarılı. Tarayıcı erişimi olmadığından tıklama, klavye ve görsel davranış henüz tarayıcıda doğrulanmadı.

- FRILO gezinmesi kullanıcı düzeltmesine göre gizleyen sekmelerden dört sayfa içi bağlantıya dönüştürüldü; tüm bölümler görünür. Sürüm kartları yeniden kullanılabilir EditionCards bileşenine taşındı ve FAQ kompakt akordeon stiline uyarlandı. Typecheck ve dört bağlantı hedefinin sunucu çıktısı doğrulandı; tarayıcıda görsel/etkileşim kontrolü henüz yapılmadı.

- FRILO önizlemesinde sürüm kartları, FRILO’ya genel bakış ve sayfa içi gezinme ayrı bölümlere ayrıldı. Mevcut metinler ve bağlantı hedefleri korundu. Typecheck ve yerel HTTP 200 / bölüm sıralaması doğrulandı; tarayıcıda görsel kontrol yapılmadı.

- FRILO preview 30.10.2026: yetenekler kompakt numaralı satırlara, başlıklar token tabanlı dile güncellendi; kullanıcının kaynak ekranında görülen FRILO Connections, CLT+ ve AI Coach 2027 özetleri eklendi; mevcut 2027 önizleme envanterindeki üç ilgili görsel yeniden kullanıldı. Kaynak web aracı önbelleği eski metin döndürüyor; doğrudan ALLPLAN kaynak ve görsel isteği HTTP 403. Bu yüzden istenen özgün FRILO overview/yetenek/proje görselleri indirilemedi; tüm güncel içeriğin eksiksizliği ve medya hakları doğrulanmadı. Fiyat eklenmedi. `pnpm typecheck` ve HTTP 200 başarılı; görsel/etkileşim tarayıcı kabulü açık.


### 30.10.2026 — FRILO kaynak envanteri (Ego Lite)
- Kullanıcı isteğiyle ALLPLAN FRILO mağaza sayfası Ego Lite üzerinden incelendi. Ana içerik metni, DOM metni, 22 başlık, 18 bağlantı ve 10 görsel kaynağı `docs/content-2027/allplan-canlı/frilo-shop-source-2026-10-30.json` dosyasına kaydedildi. Kaynak uluslararası/ABD mağaza görünümüdür; fiyatlar yalnız kaynak kaydındadır ve Türkiye fiyatı değildir.
- Sayfadaki 10 görsel `docs/content-2027/allplan-canlı/media/frilo-shop/images/` içine indirildi; kaynak adresleri ve SHA-256 değerleri aynı dizindeki `manifest.json` dosyasında. Yayın/kullanım izinleri doğrulanmadı.
- Bu bir kaynak envanteridir; FRILO önizlemesine içerik veya görsel aktarımı yapılmadı. Dinamik varyantlar ve bağlantılı ürün detay sayfaları bu tek sayfa kaydının kapsamı dışındadır.

- FRILO kaynak kontrolü genişletildi: `docs/content-2027/allplan-canlı/frilo-shop-structured-2026-10-30.json` sayfa sıralı 150 öğe ve tüm 5 yetenek + 5 SSS akordeonunun tam metnini içerir; 10 yanıtın boş olmadığı kontrol edildi. Tam sayfa ekran görüntüsü `docs/content-2027/allplan-canlı/media/frilo-shop/frilo-source-full-page.png`. Bu kayıt ABD/uluslararası görünümün o andaki durumudur; diğer ülke/süre varyantları ve bağlantılı sayfalar incelenmedi. Görsel hakları ve Türkiye ticari şartları açık; önizleme güncellenmedi.


### 30.10.2026 — FRILO önizleme içerik ve tasarım güncellemesi
- Kaynak genel bakış, dört hero faydası, beş yetenek ve beş SSS açıklaması genişletildi; genel bakış, beş yetenek ve iki proje için kaynak görselleri eklendi. Proje anlatımları genişletildi, Connections raporlama bilgisi eklendi. Çeviri ve ticari kapsam doğrulaması açık.
- Ortak `EditionCards` ve `PreviewClosingSection` korundu. Görsel/metin düzeni, sade proje kartları ve azaltılmış hareket tercihine saygılı hover geçişleri uygulandı. Fiyat ve sepet yok; fiyat gösteren kaynak sürüm detay bağlantıları eklenmedi.
- `python3 -m unittest tests/test_frilo_preview.py`, `pnpm typecheck` geçti. Ego Lite ile masaüstü ve 390px yatay taşma kontrolü, dört bölüm hedefi, iki proje görselinin yüklenmesi ve SSS klavye açılması doğrulandı. Kullanıcı görsel kabulü, diğer tema ve kapsamlı erişilebilirlik kontrolleri açık. Medya izni doğrulanmadı; yalnız dev önizleme.

- Kullanıcı geri bildirimiyle FRILO sayfa içi gezinmesi genel bakış bölümünün önüne taşındı. İçerik ve bağlantı hedefleri korundu; typecheck ve tarayıcıda bölüm sırası kontrolü geçti.


### 30.10.2026 — Yerel 2027 site gezintisi
- Kullanıcının isteğiyle geliştirme ortamında `/` 2027 ana sayfasını gösterir; üretimde önceki ana sayfa ve metadata/schema korunur. Eski ana sayfa geliştirme ortamında `/archive/home` rotasında, noindex olarak erişilebilir.
- Ana ürün bandına FRILO eklendi; Max, Civil, FRILO ve 2027 yenilikleri sırasıyla `/2027/max`, `/2027/civil`, `/2027/frilo`, `/2027/features` üzerinden bağlandı. Eski preview rotaları uyumluluk için duruyor. Bu yeni rotalar üretimde 404 ve noindex; canlı dağıtım yapılmadı. Mevcut `/products/civil` değiştirilmedi.
- Typecheck ve 7 ilgili birim kontrolü geçti. Ego Lite ile ana sayfadan üç ürün sekmesi, 2027 yenilikleri ve arşiv kontrol edildi. Teknik matris ve Partner erişimi yeni ana sayfa varyantında gizli; içerik, URL, lisans ve Türkiye koşullarının yayın onayı açık. Production build ve HTTP kabulü bu adımda çalıştırılmadı.

- Kullanıcı isteğiyle 2027 ana sayfasındaki altı ürün sekmesi üç sütun ve iki satır olarak düzenlendi; diğer hızlı bağlantı alanları etkilenmedi. Stil kaynakları yeniden üretildi; `pnpm styles:check` ve Ego Lite üzerinden masaüstü/390 px üç sütun, iki satır ve yatay taşma kontrolü geçti.
- Mobil okunabilirlik için 480 px ve altında ürün bandı iki sütuna geçer; masaüstünde üçe üç düzen korunur. 320 px kontrolde ürün bandı taşmaz; sayfanın mevcut yenilik kartlarında bağımsız 16 px yatay taşma gözlendi.

- ALLPLAN Max giriş bölümü yeniden kullanılabilir `src/components/sections/IntroSplitSection.tsx` bileşenine taşındı; içerik ve stil korunarak başlık, açıklama, bilgi satırları ve isteğe bağlı bağlantı parametreleştirildi. Typecheck ve Ego Lite masaüstü/390 px bölüm yerleşimi doğrulandı.

- ALLPLAN Max müşteri yorumları `CustomerTestimonials`, hero bölümü `ProductHero` ortak bileşenlerine taşındı. İçerik ve bağlantılar korundu; typecheck ve tarayıcıda başlık, üç yorum ve iki hero bağlantısı doğrulandı. Civil mevcut yorum stillerini kullanmaya devam ediyor.

- Ana sayfa ürün sekmeleri veriyle beslenen `ProductTabs` ortak bileşenine ayrıldı; ana sayfa adaptörü mevcut içeriği sağlar. Varsayılan Max seçimi, FRILO bağlantısı ve sekme-panel ilişkisi tarayıcıda; tip kontrolü pnpm ile doğrulandı.

- FRILO sayfa içi bağlantılarına yumuşak kaydırma eklendi; azaltılmış hareket tercihinde normal kaydırma korunur. Tarayıcıda smooth/auto ve bağlantı hedefi, typecheck doğrulandı.

- SCIA için `/2027/scia` dev-only noindex ilk taslak oluşturuldu; ana sayfa SCIA sekmesi yerel sayfaya bağlandı. Üç sürüm, dört yetenek, altı proje bağlantısı ve dört SSS eklendi. Kaynak envanteri `docs/content-2027/allplan-canlı/scia-shop-source.json`. Kaynak görselleri, hero fayda maddeleri, bölüm navigasyonu ve tam çeviri/kaynak paritesi açık; hero geçici FRILO görseli kullanır. Türkiye deneme koşulları ve medya hakları doğrulanmadı. Typecheck, tarayıcıda ana sayfa bağlantısı ve 390 px taşma kontrolü geçti.

- SCIA sayfasına FRILO ile aynı sayfa içi gezinme düzeni eklendi: Yetenekler, Başarı hikâyeleri, SSS. Bağlantılar yumuşak kaydırır ve azaltılmış hareket tercihine uyar; üç hedef ve 390 px genişlik tarayıcıda, typecheck doğrulandı. Kaynak görselleri ve tam içerik paritesi hâlâ açık.

- SCIA sayfa içi gezinmenin başına kullanıcı düzeltmesiyle SCIA bağlantısı eklendi; sayfa girişine kaydırır. Typecheck ve tarayıcıda hedef doğrulandı.

- SCIA yetenekleri kullanıcı düzeltmesiyle ortak `CapabilityAccordion` bileşenine taşındı: solda tek açık açıklama, sağda seçime bağlı dört kaynak görseli. Kaynak adresleri `docs/content-2027/allplan-canlı/scia-capability-media.json`; yayın izinleri doğrulanmadı. Typecheck, seçim/görsel değişimi ve 390 px taşma kontrolü geçti.

- SCIA proje alanı tam genişlikte, altı görselli ve manuel kontrollü ortak `ProjectCarousel` bileşenine taşındı. Altı görsel kaynak ve SHA-256 kaydı `docs/content-2027/allplan-canlı/scia-story-media.json` içinde; yayın izni doğrulanmadı. Typecheck, önceki/sonraki ve gösterge seçimi, görsel yükleme ve 390 px taşma kontrolü yapıldı.

- ProjectCarousel yüksekliği azaltıldı; görseller oranlarını koruyan contain ile gösterilir. Proje değişiminde fade uygulanır, azaltılmış hareket tercihinde animasyon kapalıdır. Typecheck ve tarayıcıda seçim/animasyon kontrolleri geçti.

- ProjectCarousel daha kompakt yapıldı; görseller üst üste kalıcı katmanlarla 600 ms opacity geçişi yapar, reduced-motion kapatır. Önceki hydration uyarısı eski istemci ve yeni sunucu rol metinlerinin uyuşmazlığına işaret ediyor; yeni oturumda davranış kontrol edildi, mevcut metinler sabit. Typecheck ve geçiş/reduced-motion tarayıcı kontrolü geçti.

- ProjectCarousel görselleri oranları korunarak sağa hizalandı; tarayıcıda object-position doğrulandı.

- ProjectCarousel görsel alanı bölümün içerik genişliği içine alındı; masaüstünde sağa hizalı %65 genişlikte, mobilde tam genişlikte. Tarayıcı ve typecheck kontrolü geçti.

- ProjectCarousel bilgi kartı kullanıcı isteğiyle sağa genişletildi; masaüstünde görselin üzerine taşar, metin genişliği sınırlandı. 390 px yatay taşma kontrolü ve typecheck geçti.

- Kullanıcının verdiği 2027 SDS2 metni Türkçeye çevrilerek giriş paragrafı ve üç madde olarak veri üretim kaynağına işlendi; hero etiketi SDS2 by ALLPLAN ve başlığı çelik detaylandırma/imalat BIM çözümü olarak güncellendi. Eski içerik envanteri korunur. Üretici kaynaklı “piyasadaki tek” iddiası yayın öncesi doğrulanmalı. Typecheck, structured source contract ve tarayıcı metin kontrolü yapıldı.

- SDS2 hero açıklamasındaki İngilizce kaynak meta metni, kullanıcı geri bildirimiyle “Otomatik çelik detaylandırma yazılımı” olarak çevrildi; veri üretimi, typecheck ve tarayıcı kontrolü geçti.

- SDS2 girişinden sonra üretici 2027 kaynağındaki üç zorluk Türkçe taslakla eklendi; mimari sayfasındaki zorluk kartları `ChallengesBand` ortak bileşenine taşındı. Tarayıcıda SDS2 bölüm sırası ve mimari sayfasında üç kart, typecheck doğrulandı.

- SDS2 zorlukların ardından 2021 SDS2 ROI anketindeki %93/%86/%71 bulguları, tam kaynak notuyla eklendi. Mimari istatistik kartı `MetricCards` ortak bileşenine ayrıldı; bölüm sırası, 390 px ve typecheck kontrol edildi. Üretici anket iddiaları bağımsız doğrulanmadı.

- SDS2 istatistik başlığı etiket, h2 ölçeği ve kartlardan ayrılan boşlukla güçlendirildi; masaüstü ve 390 px kontrolü ile typecheck geçti.

- SDS2 istatistik bandının altına üretici 2027 envanterindeki altı fayda, `BenefitsSection` ve eşleşen kaynak ikonlarla eklendi. Kaynak ikonların yayın izni doğrulanmadı; çeviriler taslaktır. Typecheck, sıralama, altı ikon ve 390 px taşma kontrolü geçti.

- SDS2 fayda kartları incelemesi tamamlandı; “tam doğrulanmış” ifadesi düzeltildi, altı ikon için kaynak/SHA-256 ve izin durumu kaydedildi. Typecheck geçti. Bu bölüm mevcut SDS2 rotasında üretim derlemesine dahil olur; yayın izni doğrulanmadan dağıtılmadı.

- Kullanıcı 30.10.2026 tarihinde altı SDS2 fayda ikonunun kullanım iznini teyit etti. Dosyalar `public/assets/previews/sds2/icons/` altında projede bulunuyor; kaynak ve SHA-256 envanteri güncellendi.

- SDS2 fayda ikonlarında koyu tema kontrastı ve opak beyaz zeminli `icon-02.png` için tema uyumlu gösterim düzeltildi; kaynak dosyaları korunur. Açık/koyu CSS davranışı, styles:check ve typecheck doğrulandı.

- SDS2 Fonksiyonellik Hızlı Bakış kartlarında ikonlar ve yinelenen beyaz başlıklar kaldırıldı; turkuaz kategori başlıkları korundu, içerikler semantik liste olarak gösterildi. Ortak BenefitsSection için SDS2’ye özel varyant kullanıldı; typecheck ve beş kart/listenin tarayıcı kontrolü geçti.

- SDS2 hero hemen altına 2027 kaynağındaki üç yenilik, ortak MediaGridSection ile eklendi; envanterdeki metin ve daha önce yerel olan görseller kullanıldı. Typecheck, bölüm sırası ve 390px taşma kontrolü geçti. 5 kat ve %20–50 iddiaları üretici kaynaklı, bağımsız doğrulanmadı; medya izinleri yayın öncesi kontrol edilmeli.

- Kullanıcı isteğiyle SDS2 2027 yenilikleri hero altından SDS2 tanıtımının hemen sonrasına taşındı; tarayıcıda bölüm sırası ve typecheck doğrulandı.


### 31.10.2026 — ALLPLAN 2027 sürüm karşılaştırma taslağı
- Kullanıcı isteğiyle `/2027/compare` dev-only noindex sayfası hazırlandı; Basic, Concept, Professional, Ultimate için üreticinin uluslararası sayfasındaki 48 özellik/seçenek satırı ve durumları Türkçeye çevrildi. Kaynak: https://www.allplan.com/package-overview/compare-allplan-features-2027/ (31.10.2026 tarayıcı karşılaştırması). Türkiye ticari kapsamı doğrulanmadı.
- Üretici özellik bilgi balonlarının açıklamaları henüz aktarılmadı; mevcut yerel ürün sayfaları 2027 kapsamını doğrulamaz. Sayfa paritesi tamamlanmış sayılmaz, yayın yapılmadı. Typecheck ve kullanıcı arayüzü tarayıcıda kontrol edildi; mobil yatay kaydırma alanı doğrulandı.

- ALLPLAN 2027 karşılaştırmasında 48 özellik için üretici data-hover açıklamaları Türkçeye çevrilerek klavye/tıklama ile açılan bilgi alanlarına eklendi; 48 alan ve boş açıklama yokluğu, klavye açma ve 390 px kontrolü doğrulandı. Çeviriler ve Türkiye paket kapsamı yayın öncesi gözden geçirilmeli.

- Karşılaştırma bilgi ikonları 18 px görsel/44 px etkileşim alanına alındı; aynı grupta tek açık açıklama ve azaltılmış hareket tercihini gözeten 220 ms fade eklendi. Tarayıcıda iki ardışık seçim, ikon alanı ve reduced-motion doğrulandı.

- 2027 karşılaştırmada bilgi ikonlarına fareyle gelince açıklama görünür; tıklama/klavye ve dokunmatik kullanım korunur. Başka açık bilgi üzerine hover durumunda yalnız ilgili balon görünür; fade reduced-motion ile uyumludur. Tarayıcıda hover doğrulandı.

- Karşılaştırma bilgi ikonu projenin ortak AluIcon info SVG’siyle değiştirildi; tablo satırları sıklaştırıldı. Masaüstü 49 px satır/16 px ikon, mobil 44 px hedef ve hover tarayıcıda doğrulandı; typecheck geçti.

- Karşılaştırma bilgi alanı React durumu ile gerçek hover, klavye ve dokunmaya uyarlandı; aynı anda tek açıklama, fade ve Escape desteği var. Ego tarayıcısında hover, başka ikona geçiş, açıklamanın üzerine gelme, Escape ve 390 px dokunmatik aç/kapat doğrulandı; typecheck geçti. Çeviri ve paket kapsamı yayın öncesi gözden geçirilmeli.

### Yayına hazırlık — rota değerlendirmesi (31.10.2026)
- `/2027/max`, `/2027/civil`, `/2027/frilo`, `/2027/scia`, `/2027/features`, `/2027/compare` üretimde kapalı ve noindex. Ana sayfa geliştirmede yeni, üretimde mevcut eski görünümü kullanıyor.
- `/products/civil`, `/products/sds2-home` ve `/paket-karsilastirma` mevcut URL'lerdir; eski adresleri koruma ve yeni slug/olası 301 eşlemeleri kullanıcı onayı gerektirir. SDS2 değişiklikleri mevcut üretim rotasındadır.
- Yayına geçişte rota kararlarının yanında üretim korumaları, dahili bağlantılar, canonical metadata, sitemap ve mevcut URL paritesi birlikte ele alınmalı; içerik/çeviri, medya ve Türkiye paket kapsamı doğrulanmalı. Kirli çalışma ağacının yayın kapsamı belirlenmeli; derleme ve üretim modunda kontrol ile tarayıcı kabulü tamamlanmadan yayın hazır sayılmaz. Canlıya dağıtım yapılmadı.

### 31.10.2026 — Ürün yaşam döngüsü önizlemesi
- Kullanıcı isteğiyle ALLPLAN ürün yaşam döngüsü politikası `/preview/product-lifecycle` altında Türkçe yerel önizleme olarak hazırlandı. Kaynak: https://www.allplan.com/product-lifecycle/ (31.10.2026). Politika kapsamı, bakım/sürüm aşamaları, Kasım 2024 örneği, tarih tablosu ve sekiz SSS ile hizmet tabloları içerilir. Kaynağın tarihli örneği güncel sürüm tablosu olarak sunulmaz.
- Rota production'da kapalı ve noindex; kaynak hero ve grafik görselleri izin teyidi olmadığından alınmadı. Yerel tarayıcıda SSS ve 390 px taşma kontrolü, typecheck ve içerik incelemesi yapıldı. Türkçe metinler ve güncel üretici politikası yayımlamadan önce doğrulanmalı; kalıcı URL ve navigasyon onayı bekler.

- Kullanıcı isteğiyle ana sayfadaki OpenBIM ve teknoloji iş ortakları şeridi kaldırıldı; 2027 ana sayfa önizlemesinin footer öncesine ürün yaşam döngüsü önizleme bağlantısı eklendi. Typecheck, bağlantı hedefi ve 390 px taşma tarayıcıda doğrulandı. Bağlantı üretimde kapalı önizlemeye gittiğinden yalnız geliştirme görünümünde yer alır.

- Kullanıcı açıklamasıyla, 2027 ana sayfa önizlemesinde footer öncesine mevcut `/products/allplan-2026-yenilikler` sayfasına ayrı bir butonlu bölüm eklendi; `/products/allplan-2026` farklı sayfa olarak korundu. Yerel tarayıcıda hedef ve 390 px taşma kontrolü ile typecheck geçti.

- Ana sayfa önizlemesindeki 2026 yenilikler bölümüne kullanıcı isteğiyle `/products/allplan-2026` için ayrı buton eklendi; mevcut yenilikler bağlantısı korundu. Tarayıcıda hedef ve mobil taşma, typecheck ile kontrol edildi.

- Ana sayfadaki eski `#innovations` kart bölümü kullanıcı isteğiyle gösterimden kaldırıldı; tasarımı ve kart yapısı yeniden kullanılabilir `InnovationsSection` bileşenine aktarıldı. İçerik verisi ve stiller korundu; 2026 sayfalarına footer öncesindeki ayrı bağlantılar yerinde. Typecheck ve ana sayfa kontrolü yapıldı.

### Devam durumu
- 2026 bağlantı bandı ürün sekmeleri sonrasına taşındı, yüzeyi hafifçe ayrıldı; BIMFlex medya boyutları küçültülüp dış kartın arka planı ve çerçevesi kaldırıldı. Typecheck ve styles:check geçti.
- Açık işler: disiplin iş akışı bölümünü ortak ve kompakt bileşene dönüştürme isteği önceki oturumda kesildi; tamamlanmadı. `/products` sayfasını canlı kaynakla karşılaştırıp eksikleri giderme isteği de bekliyor. Önceki incelemedeki bağlantı kayıpları ile test başarısızlıkları çözülmedi.

- Disipline özel BIM iş akışı `DisciplineWorkflowSection` ortak bileşenine taşındı; rol sekmeleri ve ürün bağlantıları korunarak kompakt sekme, şeffaf kart ve yüzey düzeni uygulandı. Typecheck, rol geçişi, klavye ve 390 px taşma yerel tarayıcıda kontrol edildi.

- Disiplin iş akışı özellikleri kullanıcı isteğiyle kartlardan kompakt semantik listeye dönüştürüldü; rol değişimi ve mobil taşma tarayıcıda, typecheck doğrulandı.

- Disiplin iş akışı bölümünün başlığı ve açıklaması diğer sayfa başlıklarıyla uyumlu biçimde sola hizalandı; tarayıcı hizası ve typecheck doğrulandı.

- Disiplin seçimi butonları başlığın sağına dikey üç satır olarak taşındı; mobilde başlığın altında sıralanır. Dikey klavye gezinmesi, masaüstü konumu, mobil taşma ve typecheck doğrulandı.

- Disiplin iş akışı başlık ve rol seçimi satırına üst boşluk eklendi.

- Disiplin iş akışı ürün kartlarının görselleri kaldırıldı; rol seçimine göre vurgu ve önerilen etiketi korundu. Tarayıcıda farklı rol seçimi ve typecheck kontrol edildi.

- Disiplin seçimi ürün kartları yalnız seçili role ait ürünleri gösterir; masaüstünde aynı satırda, dar ekranda uyarlanır. Üç rol ve 390px tarayıcıda, typecheck kontrol edildi.

- Mimar, mühendis ve prekast iş akışları için AI ile üç yeni illüstratif görsel üretildi; orijinal PNG dosyaları `public/assets/previews/workflow/` altında saklandı ve yalnız 2027 ana sayfa önizlemesine bağlandı. Üç rol için görsel yüklenmesi ve typecheck doğrulandı.

- Kullanıcı isteğiyle “Sürümleri Görüntüle” bağlantıları ALLPLAN sürüm notlarına (`https://www.allplan.com/system/releasenotes/`) yönlendirildi; veri üretim kuralı da güncellendi. İlgili altı ürün sayfası ve typecheck kontrol edildi.

- Çözüm ekosisteminin beş kartı için konuya uygun AI görselleri üretildi; orijinal PNG'ler `public/assets/previews/solutions/` altında saklandı ve 2027 ana sayfa önizlemesine bağlandı. 110 sayfalık veri envanterinde “Sürümleri Görüntüle” bağlantıları tarandı; eşleşmeler altı ürün sayfasında sürüm notlarını gösteriyor. Typecheck, görsel yükleme ve mobil taşma kontrol edildi.

- Ürün hero alanındaki “Paket Karşılaştırma PDF” bağlantısı geliştirme görünümünde “Paketleri karşılaştırın” etiketiyle `/2027/compare` sayfasına bağlandı. Karşılaştırma rotası production'da kapalı olduğundan üretim görünümünde mevcut PDF bağlantısı korunur; rota yayınlandığında geçiş tamamlanmalı. PDF ve diğer doğrudan indirme bağlantıları saklandı. Typecheck ve üç ürün hero kontrol edildi.

- Ortak `PageEndConversion` bölümü tüm kullanım yerleri için kompakt, çerçevesiz yerleşime dönüştürüldü; ticari, eğitim, destek ve kurumsal içerik/eylem politikası korundu. Typecheck ve 7 dönüşüm testi geçti; ticari, destek ve eğitim sayfaları ve mobil taşma tarayıcıda kontrol edildi.

- İletişim sayfasındaki Google Maps gömüsü video alanından ayrılarak `ContactMap` ile tam konteyner genişliğinde ve kompakt yükseklikte sunuldu; mevcut Google Maps adresi korundu. Typecheck, boyut ve 390 px taşma kontrol edildi.

- Scalypso ana sayfası canlı kaynaktaki başlık sırası, beş modül bağlantısı, beş uygulama alanı ve 11 görselle yeniden düzenlendi. Önceden onaylanmış form yönlendirme politikası gereği yerel başvuru bağlantısı ana talep formunu kullanır; canlı kaynak eski formu kullanmaktadır. Typecheck, başlık/bağlantı/görsel sayısı ve 390px taşma kontrol edildi.

- Scalypso Modeler/Mobile/Viewer alt sayfaları kaynak sıralamasına yaklaştırıldı; Scalypso ana sayfa ve Microsoft Forms başvuru bağlantıları, Modeler'ın dört modül bağlantısı gösterildi. Converter ve videolar sayfalarına da aynı gezinme/form bağlantıları eklendi. Beş rota ve 390px taşma, typecheck kontrol edildi; önceden onaylı ana talep formu kullanılır.

- Scalypso Modeler sayfası kompakt hero, iki sütunlu giriş, CAD listesi ve dört modül kartıyla yeniden düzenlendi. Kaynak metinler, modül bağlantıları ve onaylı Microsoft Forms hedefi korundu. Tarayıcı ve 390px taşma, typecheck kontrol edildi.

- Referanslar sayfasında tekrarlanan ve kesilmiş genel hero kaldırıldı; tam başlık ve açıklama referans dizininde tek H1 olarak korundu. 228 referans listesi ve filtreler korunur; typecheck ve tarayıcı kontrolü yapıldı.

### Ara verme durumu — 31.10.2026
- Dal `codex/page-end-conversion-design`; 494f6dc sonrasındaki işler konu bazlı ayrı yerel commitlere ayrıldı: 4f89ade yaşam döngüsü, 1a0fe62 ana sayfa bağlantıları, a4cee39 BIMFlex, f43f21c kapanış, 567843c sürüm notları, d93e2a4 karşılaştırma linki, 81a6c9e ana sayfa iş akışı/görseller, 77bebc5 harita, 9eefe41 Scalypso, 7cf65e8 referanslar. Bu commitler henüz push edilmedi.
- Doğrulama: `pnpm typecheck`, `pnpm styles:check` ve `python3 -m unittest tests/test_page_end_conversion.py` geçti. `pnpm test` 189 testte 11 başarısızlıkla duruyor: token ölçümleri, kaynak link/içerik paritesi, sayfa sonu render sınırı, benefits sınırı, taşınan rol sekmesi sözleşmesi ve tema kontratı. Tam test yeşil değil; failures test beklentisi veya gerçek regresyon açısından ayrı ayrı incelenmeli.
- Açık işler: `/products` sayfası canlı kaynakla eksik içerik karşılaştırması; Scalypso video oynatımının doğrulanması; önceden raporlanan connect-login ve SketchUp Converter bağlantı kayıpları; 2027 sayfalarının üretim rotaları/noindex/sitemap kararı. Karşılaştırma bağlantısı yalnız geliştirmede 2027 tablosuna gider; üretimde PDF korunur. Yayın yapılmadı.
- `.claude/launch.json` yerel, izlenmeyen geliştirme ayarı olarak bırakıldı. Mevcut eski siteden ve geçmişteki onaylı form yönlendirmesinden sapmalar ayrıca incelenmeli.

### 02.11.2026 — Testler ve GitHub düzeni
- `architectural-sheet-concept/` GitHub main dalından kaldırıldı (d7fa308); yerel dosyalar korundu ve .gitignore ile yerel tutuluyor. Çalışma dalında da takipten çıkarıldı (3864aa7).
- 189 Python testi, kaynak sözleşmesi, parite, stil ve token kontrolleri ile `pnpm build` ve typecheck geçti. Yetkilendirilmiş sürüm notu ve SDS2 başlık değişiklikleri parite politikasına yol bazında işlendi; rol sekmesi testleri ortak bileşene uyarlandı.
- `next-env.d.ts` Next build tarafından üretim route tipleri için değiştirildi; kullanıcı dosyası korunarak commit dışı bırakıldı. `.claude/launch.json` da yerel izlenmeyen ayar olarak kalır. Dev server 127.0.0.1:3001 üzerinde çalışıyor.
- Karşılaştırma ve diğer 2027 önizlemeleri production guard altında kalıyor; testlerin geçmesi yayın/kaynak-medya kabulünün tamamlandığı anlamına gelmez. Scalypso video oynatımı ve önceki kayıp bağlantı bulguları ayrıca incelenmeli.

### 02.11.2026 — Vercel inceleme yayını hazırlığı
- `ALUPLAN_2027_PREVIEW=1` yalnız Vercel projesi production ayarında kullanıldığında 2027 ana sayfası ve önizleme rotaları görünür; `X-Robots-Tag: noindex, nofollow` ve robots disallow uygulanır. Bayrak yokken mevcut production davranışı korunur. 189 test ve bayraklı production build, 8 rota ve header yerel doğrulandı.
- Bu bir inceleme yayınıdır; gerçek alan adına geçişten önce bayrak, indexleme, kalıcı adresler, sitemap ve içerik kabulü tekrar değerlendirilmeli.

### 02.11.2026 — Ürün sekmeleri, Max denetimi ve karşılaştırma bağlantısı
- Ana sayfa ürün sekmelerine seçilen ürüne göre sağdan görseller yerel olarak eklendi; altı görsel/sekme ve mobil taşma kontrol edildi. Vercel'e henüz gönderilmedi.
- ALLPLAN Max kaynak sayfa ile Vercel ve yerel karşılaştırıldı: ana bölümler, 3 özellik, 3 yorum ve 6 diğer özellik mevcut; yerel ve Vercel metni eşleşiyor ve 494f6dc commitinde. 4 yerel MP4 HTTP 206; ilk video düğmesi YouTube iframe açtı, gerçek oynatma ve diğer videolar henüz doğrulanmadı. Kaynaktaki video indirme bağlantısı eksik; anket başlığı yerelde h2 yerine etiket. İçerik tercümesi ve üretici medya hakları yayın öncesi kontrol edilmeli.
- Vercel'de PDF bağlantısının kalmasının nedeni preview environment değişkeninin client bundle'da bulunmamasıydı; next.config içinde yalnız gizli olmayan ALUPLAN_2027_PREVIEW değeri build'e aktarıldı. Bayraklı production build ve tarayıcıda `/products/allplan-basic` hedefi `/2027/compare` doğrulandı; değişiklik henüz deploy edilmedi. 189 test geçti.
- `/products/allplan` mevcut ürün sayfasıdır; üreticinin 2027 yenilikler sayfası için yerel `/2027/features` hazırlanmıştır. Ürün sekmesi mevcutta `/products/allplan` adresine, hero butonu `/2027/features` adresine gider; rota kararı kullanıcıyla netleştirilmeli.
- Max denetimindeki video indirme yedeği ve anket başlığının h2 semantiği yerelde eklendi; güncel 189 test ve typecheck geçti. Bu düzeltmeler henüz Vercel'de değil.

- 02.11.2026 hizalama: kullanıcı isteğiyle Connect parola sıfırlama ve SketchUp Converter kurulum kılavuzu bağlantıları geri getirildi; Setup bağlantısı zaten mevcuttu. Altı ürün sekmesi görseli yerel tarayıcıda; Max ilk video modalı ve 4 MP4 erişimi kontrol edildi. Tüm videoların tam oynatılması, 2027 içerik/doğruluk ve kaynak medya izinleri hâlâ yayın öncesi inceleme gerektirir. Önizleme bayrağı client bundle'a iletilerek PDF sorunu düzeltildi; typecheck, 189 test ve bayraklı build geçti.

- Ana sayfadaki ALLPLAN ürün sekmesinin bağlantısı kullanıcı düzeltmesiyle `/2027/features` olarak değiştirildi; hero ile aynı 2027 yenilik sayfasına gider. Önceki `/products/allplan` mevcut URL korunur. Navigasyon testi ve tarayıcıda sekme/hedef kontrol edildi.

## 03.11.2026 — Bina Tasarımı merkez örneği ve taşıma taslağı

- Kullanıcı talebiyle yalnız `/solutions-v2/building-design` için `/solutions` katalog düzeni ortak `SolutionOverviewCards` bileşeni üzerinden uygulandı. Dört hub kartının özgün başlığı, açıklaması ve hedefi korunur; görseller aynı hedefe sahip katalog kayıtlarından alınır. Diğer dört merkez değiştirilmedi.
- Beş merkez için içerik/hedef/görsel envanteri, katalog farkları, ayrı CDS koleksiyonu ve onaya sunulacak beş 301 önerisi `docs/00-inventory/solution-hubs-migration-proposal-2026-11-03.md` dosyasındadır. Ana sayfa kaynak ve gerçek gösterilen görselleri ayrı kaydedildi.
- URL, canonical, sitemap veya yönlendirme değiştirilmedi. Önerilen adresler ve 301 haritası kullanıcı onayı, canlı rota/indeks ve çakışma kontrolü bekler. `/solutions/addons` ayrı CDS koleksiyonudur; BIMPLUS ve AX3000 farkları çözülmeden birleştirilmemelidir. Next.js kalıcı yönlendirme davranışında 308/301 ayrımı doğrulanmalıdır.
- Yerel masaüstü ve 355px mobil örnek incelendi; dört kart hedefi ve metni kontrol edildi, mobilde yatay taşma görülmedi. Bağımsız incelemede derleme artığı düzeltildi ve görsel envanteri tamamlandı. Tür kontrolü, stil kontrolü ve ilgili 13 test geçti. `pnpm test`: 506 test başarılı (4 atlandı), kaynak sözleşmesi, 46 parite kontrolü ve 45 token testi başarılı.

### 03.11.2026 — Çözüm merkezleri adres taşıması
- Taşıma öncesi geri dönüş noktası: `a48713fc140250fa9efe509b1893c2554f2f8c59` (yerel commit; mevcut çalışma ağacındaki `next-env.d.ts` ve izlenmeyen yerel dosyalar dışında). Değişiklikler yayınlanmadı.
- Kullanıcı onayıyla beş merkez `/cozumler/bina-tasarimi`, `/cozumler/altyapi-tasarimi`, `/cozumler/insaat-planlamasi`, `/eklentiler`, `/cozumler/diger-urunler` adreslerine taşındı; eski beş URL doğrudan HTTP 301 ile yönlenir ve query korunur. Veri üreticisi, canonical, sitemap, arama, ana sayfa, footer ve hero görsel aileleri uyarlandı.
- Ortak kart düzeni beş merkezde uygulanır; mevcut 21 kartın metinleri, sıralaması ve hedefleri korunur. AX3000 görseli katalog kaydından seçilir ama hub linki değiştirilmez. `/solutions/addons` ve CDS alt rotaları ayrıdır; BIMPLUS ve AX3000 kaynak farkları birleştirilmedi.
- Canlı sitede yeni beş adres HTTP 404 olarak görüldü (03.11.2026); trafik, arama indeksi ve üretim altyapısı yayın öncesi doğrulanmalı. Yerel HTTP'de beş 301, query, beş 200, canonical ve sitemap kontrol edildi; 355px eklentiler sayfasında yatay taşma gözlenmedi. Bağımsız kod incelemesinde kritik/yüksek bulgu yok; design-system tarihsel önizleme dosyalarındaki eski linkler yönlendirme üzerinden çalışır.
- Üretim derlemesi `ALUPLAN_SHOW_2027=1 ALUPLAN_BLOCK_INDEXING=1 pnpm build` başarılı. `pnpm test`: 512 test başarılı (4 atlandı); 51 parite ve 45 token kontrolü başarılı.

### 03.11.2026 — Ortak kapanış ve Scalypso deneme bağlantısı
- `PreviewClosingSection`, `PageEndConversion` ortak görünümünü kullanır; Ultimate ve diğer önizlemelerde mevcut başlık, açıklama, seçenekler ve buton hedefleri korunur.
- Scalypso ana sayfasındaki yinelenen deneme lisansı bölümü kaldırıldı. Ortak kapanışta Scalypso başlığı ve deneme talebi metni gösterilir; teklif ve deneme düğmeleri önceden onaylı genel talep formuna gider. Scalypso alt sayfalarındaki genel hero deneme bağlantısı da aynı talep yoluna uyarlandı; ALLPLAN trial hedefi kullanılmaz. Genel formun Scalypso/deneme talebini ayrı sınıflandırdığı doğrulanmadı.
- Canlı sitede beş eski solution-v2 hub adresi 200 verdi; eski bağlantılar ve yer imleri için yerel 301 yönlendirmeleri korunmalı. Yerel Ultimate ve Scalypso kapanışları, Scalypso bağlantı hedefleri ve mobil yatay genişlik kontrol edildi. Bağımsız incelemede kritik/yüksek bulgu yok. `pnpm typecheck` ve `pnpm test` geçti: 513 test, 4 atlandı; parite ve token kontrolleri başarılı. Henüz yayınlanmadı.

### 03.11.2026 — Scalypso ortak başlıklar ve CAD listesi
- Scalypso ana sayfasındaki altı bölüm başlığı ortak `SectionHeader` bileşenine bağlandı; CAD yazılımları ve gereksinimler semantik listeleri mevcut tema tokenlarıyla kompakt ve vurgulu düzenlendi. İçerik, sıra ve bağlantılar korundu.
- Deneme lisansı ve teklif düğmeleri önceden onaylanan Microsoft Forms ana talep formuna gider. Formun talep türünü ayrı sınıflandırması doğrulanmadı.
- Yerel tarayıcıda başlıklar, 12 CAD yazılımı, üç gereksinim, form hedefleri ve 355px yatay taşma kontrol edildi; bağımsız inceleme kritik/yüksek bulgu göstermedi. `pnpm typecheck`, `pnpm styles:check` ve 15 ilgili test başarılı. Yayın yapılmadı.

### 03.11.2026 — Scalypso modülleri ve tarayıcı listesi
- Scalypso'nun beş modülü mevcut ortak `SolutionOverviewCards` sunumuna bağlandı; bütün açıklama paragrafları, beş görsel, `Detaylı Bilgi` ve hedefler korunur. Ortak bileşenin diğer kullanımları varsayılan davranışını korur.
- Tarayıcı, CAD ve gereksinim listeleri ortak `CompactSpecList` bileşeniyle sunulur; sekiz tarayıcı ve diğer liste öğeleri/sırası korunur. Erişilebilir liste semantiği için role=list eklendi.
- Yerel masaüstü ve 355px görünümde modül bağlantıları, liste sayıları ve yatay taşma kontrol edildi; bağımsız incelemede kritik/yüksek bulgu yok. Typecheck, stil kontrolü ve 28 ilgili test geçti. Yayın yapılmadı.

### 03.11.2026 — CDS Add-On sayfası
- `/solutions/cds-addon` gövdesi ortak `SectionHeader` ve `SolutionOverviewCards` kullanır. İki kaynak giriş bölümü ve dokuz kartın başlık, açıklama, görsel ve `/solutions/addons/*` hedefleri korunur; genel hero ve PageEndConversion korunur. CDS ikonları sayfaya özel `object-fit: contain` ile kırpılmaz; diğer ortak kartlar etkilenmez.
- Mevcut TBDY 2018 betonarme uyumluluk metni ile genel CDS eklentilerinin kapsam ilişkisi doğrulanmadı; mevcut metin aynen korundu, ürün doğrulaması gerekir. Kaynak 2026 sayfasında hero ve CTA butonları kapalı iken mevcut yerel genel CTA'lar gösteriliyor; ALLPLAN trial hedefinin CDS için uygunluğu ayrıca değerlendirilmeli.
- Masaüstü görünümü, 355px yatay taşma ve dokuz görsel/hedef kontrol edildi. 13 gerçek render/ilgili test, typecheck ve styles:check geçti; bağımsız incelemede kritik/yüksek bulgu yok. Ortak kartların aria-label uygulamasıyla ekran okuyucu başlık/açıklama sunumu ayrıca doğrulanmalı. Yayın yapılmadı.

### 03.11.2026 — Kompakt ortak alt başlık
- Ortak `SectionHeader` bileşenine `as="h3"` seçeneği eklendi; `alu-h3` kullanır ve h1/h2 davranışları korunur. Scalypso CAD bölümündeki Gereksinimler alt başlığı bu bileşene taşındı.
- Yerel tarayıcıda gerçek h3 semantiği, bölüm içi görünüm ve 355px taşma kontrol edildi; bağımsız inceleme kritik/yüksek bulgu göstermedi. Typecheck, styles:check ve 9 ilgili test başarılı. Yayın yapılmadı.

### 03.11.2026 — Görünür kompakt h3 ve bağımsız sektörel zorluklar
- Ortak SectionHeader `h3` varyantına ince vurgu çizgisi ve üst boşluk eklendi; gerçek h3 semantiği ve h1/h2 davranışı korunur. Scalypso Gereksinimler başlığında masaüstü görünüm doğrulandı.
- `StructuredPageLayoutSection` içindeki dokuz çözüm sayfası Sektörel Zorluklar alanı metrikler bölümünden ayrılarak mevcut `ChallengesBand` ile bağımsız section oldu. İçerik ve sırası korunur, metrik yoksa da zorluklar görünür; Industry ve SDS2 alanları çiftlenmez.
- Road-railway yerel DOM'da metriklerden sonra beş madde, 355px genişlikte taşmasız düzen doğrulandı. 32 ilgili test, typecheck, styles:check başarılı; bağımsız incelemede kritik/yüksek bulgu yok. Yayın yapılmadı.

### 03.11.2026 — Commit öncesi doğrulama
- Çözüm merkezleri adres taşıması, Scalypso/CDS ortak bileşenleri, ortak alt başlık ve bağımsız sektörel zorluk bölümleri için `pnpm typecheck` ve `pnpm test` başarılı: 521 test, 4 atlandı; parite, stil ve token kontrolleri başarılı. Değişiklik kapsamıyla sınırlı güvenlik incelemesinde kritik/yüksek bulgu yok. Yayın yapılmadı.
- `next-env.d.ts` üretim/dev tip yolu değişikliği ve `.claude/`, `.superpowers/`, `premium-audit.json` yerel dosyaları önceki durumlarıyla commit dışında tutuldu.

### 03.11.2026 — Video listeleri ve site içi kaynaklar
- 14 yerel oynatma listesinde otomatik eklenen genel teknik görsel galerisi kaldırıldı; oyuncu ve 216 benzersiz video/242 liste kaydı korundu. Diğer sayfalardaki genel galeriler korunur.
- Video kütüphanesindeki Allplan 2026 oynatma listesi ile English, International ve Precast kanalları `/video-kutuphanesi/kaynak/*` yerel sayfalarına bağlandı. Kaynak YouTube bağlantıları kütüphane kartında ve yeni sayfada da korunur. 2026 oynatma listesi kullanıcı etkinleştirmeli YouTube nocookie playlist iframe'i kullanır; gerçek oynatma yerelde görüldü.
- Üç kanal resmî YouTube RSS akışından en fazla son 15 videoyu çeker; bu tüm kanal arşivi değildir. Sabit kanal kimlikleri, beş saniyelik zaman aşımı ve saatlik yenileme vardır; hata/boş akışta dürüst bilgilendirme ve YouTube bağlantısı sunulur. Yeni kanal listeleri, onay öncesinde üçüncü taraf video küçük resmi yüklemez. Dört kaynak sayfası noindex'tir ve sitemap'e eklenmemiştir; kaynak veri/generator değişmemiştir.
- Yerel kontrolde 2026 listesi oynatıldı, English, International ve Precast akışlarında 15 video, video seçimi ve 355px yatay taşmama kontrol edildi. Kaynak, galeri, video kütüphanesi ve rota testleri 39/39; typecheck, styles:check ve `ALUPLAN_SHOW_2027=1 ALUPLAN_BLOCK_INDEXING=1 pnpm build` başarılı. Yayın yapılmadı. Akışın hedef üretim sunucusundan erişimi yayın öncesi ayrıca doğrulanmalıdır.

### 03.11.2026 — Alt sayfa hero görselleri
- Ortak `SubpageHeroSection` arka planında aşırı büyütme kaldırıldı, görseller sağa hizalı `contain` ile ve soldan daha erken açılan gradientle gösterilir. Ürün önizleme `ProductHero` görselleri de sağa konumlandı; mobilde yüksek hero nedeniyle büyüme önlenerek görsel genişliğe sığdırıldı. Görselsiz özel hero'lara görsel eklenmedi.
- Endüstri, yol-demiryolu, MEP, prekast, Scalypso Converter, BIMFlex ve Ultimate üzerinden hero görsel ailesi/masaüstü örnekleri ile 355px mobil taşma incelendi. Bağımsız incelemede kritik sorun yok; solda odaklanan görsellerin gradient altında görünürlüğü görsel bazında daha sonra değerlendirilmelidir.
- `pnpm typecheck`, stil kontrolü ve tam `pnpm test` başarılı: 528 test, 4 atlandı; parite/token kontrolleri geçti. Video çalışması paralel yapıldı; ilgili ayrıntılar aynı handoff'ta. Yerel değişiklikler yayınlanmadı.

### 03.11.2026 — Endüstri sıralaması, kartlar ve 2026 hero
- Endüstri dahil zorluk içeren çözüm sayfalarında metrikler Sektörel Zorluklar'dan önce gösterilir; özgün metrik/zorluk verileri ve diğer bloklar korunur. Endüstri ALLPLAN'I KEŞFEDİN bölümündeki üç kategori ve 10 alt bağlantı ortak LinkGroupGridSection ile ProductsOverview tasarımına taşındı.
- Alt sayfa hero fotoğrafı gerçek resim kutusunda maskelenerek dikey keskin sınır giderildi; açık/koyu ve mobil kontrol edildi. Ana sayfa Max maskesi bağımsız incelemede yanlışlıkla değişmiş bulundu ve eski değerine döndürüldü.
- `/products/allplan-2026-yenilikler` için kullanıcı isteğiyle üretilmiş konsept görsel `public/assets/heroes/allplan-2026-innovations-generated.jpg` (356 KB); bu görsel resmî ALLPLAN ürün ekranı veya gerçek proje değildir. Diğer VF-08 sayfasının kaynak görseli korunur.
- Yerel Endüstri sayfasında metrik→zorluk sırası, 10 bağlantı ve 355px taşma; 2026 hero masaüstü görünümü doğrulandı. `pnpm test`: 530 test başarılı, 4 atlandı; bağımsız incelemenin bulgusu olan Max maskesi sonrasında geri alındı. Yayın yapılmadı.
- Video isteği incelemesi: 14 playlist ve üç yeni kanal zaten `VideoPlaylistSection` (sol oynatıcı/sağ liste) kullanıyor. 2026 YouTube listesi doğrulanmış tam video listesi yokluğunda resmî iframe ile sunuluyor; tam liste gibi uydurulmamalı. Yeni video kaynakları ve galerilerle ilgili önceki kayıtlar ayrıca geçerlidir.

### 03.11.2026 — Yayın öncesi bağımsız ilk denetim
- SEO/GEO, güvenlik/DevOps ve mobil/performans kontrolleri paralel yapıldı; kanıt, açıklar, risk ve cutover sırası `docs/verification/release-readiness-2026-11-03.md` içinde. Canlıya yayın veya sunucu değişikliği yapılmadı.
- `robots.txt` üretimde /_next/ JS/CSS kaynaklarını engellemeyecek şekilde düzeltildi; preview engeli korundu. `llms.txt` CDS/Allto/Scalypso ve QuickStart hedefleri düzeltildi. Video schema yanlış contentUrl kaldırıldı, doğrulanmamış tarih uydurulmadı.
- `pnpm typecheck`, 534 test (4 atlandı), 51 parite ve 45 token testi başarılı. SEO düzeltmeleri sonrası `ALUPLAN_SHOW_2027=1 ALUPLAN_BLOCK_INDEXING=1 pnpm build` başarılı (135 statik sayfa); indexlenebilir üretim modu ve gerçek host ayrıca doğrulanmalı. Dört production sayfasında 355px yatay taşma/kırık görsel yok; güvenilir Lighthouse/CrUX ölçümü ortamda yapılamadı. Gerçek deploy, hedef platform/bağımlılık, izin öncesi YouTube görselleri, indeksleme ve rollback öncesi kararlar raporda açık.

### 03.11.2026 — Yayın öncesi güvenli düzeltmeler
- Kullanıcı video oynatma davranışının performans açısından mevcut hâliyle kalmasını istedi; genel çerez kabulü video oynatmak için zorunlu değil, oynat düğmesi ilgili gömüyü yükler. Sağ listeden ilk seçimde ikinci oynat tıklaması gerekebilir; davranış değiştirilmedi.
- CDS Add-On, ALLPLAN Industry ve Civil kesilmiş meta/hero açıklamaları mevcut bodyNodes içindeki tam cümlelerden düzeltildi, arama verisi/generator politikası eşitlendi; CDS TBDY iddiası doğrulanmış sayılmaz. Tam veri üretiminin gerçek kaynakla tekrarı ayrıca doğrulanmalı.
- YouTube RSS yanıtı 256 KiB ile sınırlandı; zaman aşımı, cache ve boş sonuç fallback'i korunarak hassas veri içermeyen hata sinyali eklendi. Bağımsız inceleme kritik/yüksek bulgu göstermedi.
- `pnpm typecheck` ve `pnpm test` başarılı: 536 test (4 atlandı), parite/stil/token kontrolleri başarılı. Gerçek mobil LCP ve dağıtım/geri dönüş kontrolleri hâlâ açık; yayın yapılmadı.

### 03.11.2026 — Coolify canlı geçiş incelemesi
- Kullanıcı isteğiyle mevcut Coolify uygulaması salt okunur incelendi; durum/commit, Dockerfile/port/domain, healthcheck ve rollback görüntüsü ile 2027 repo dalı/Node/flag farkları `docs/verification/coolify-transition-plan-2026-11-03.md` dosyasına kaydedildi. Kullanıcı oturum açtı; gizli değerler okunmadı.
- Çalışan uygulama 2026 main `a958c9d8...`, yeni repo aktif aday `codex/design-phase-4` `586c44c...`, 2027 main ayrı. Mevcut build Dockerfile, 2027'de Dockerfile yok; port ve bağımsız staging/rollback provası gerekir. Canlı ayar, DNS ve deployment değiştirilmedi.

### 03.11.2026 — Coolify staging hazırlığı
- Kullanıcı planı onayladı; `preview.aluplan.com.tr` staging hostname olarak seçildi. Cloudflare'da yalnız `preview` A kaydı `167.86.84.107` (DNS only) eklendi; mevcut kayıtlar, Microsoft 365 MX ve autodiscover değiştirilmedi. Eski Plesk kayıtları envanteri/kullanım doğrulaması sonraya bırakıldı.
- Node 24/pnpm 10.24 çok aşamalı Dockerfile, hassas/gereksiz dosyaları dışarıda tutan .dockerignore, Next standalone ve dinamik no-store `/health` eklendi. Yerel Docker build ve non-root 0.0.0.0 runtime başarılı; `/health` 200, preview robots noindex ve eski rota 301 doğrulandı. Health yalnız HTTP yaşam kontrolüdür.
- Bağımsız kod/güvenlik incelemesinde kritik/yüksek bulgu yok; typecheck ve 539 test (4 atlandı) başarılı. Build/runtime preview bayrakları staging'de tekrar HTTP üzerinden doğrulanmalı. Canlı domain ve mevcut üretim uygulaması değiştirilmedi.
