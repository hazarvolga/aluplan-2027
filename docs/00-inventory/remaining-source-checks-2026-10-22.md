# Kalan kaynak envanteri: koşullu dallar ve medya adayları — 22.10.2026

Bu inceleme yalnız kaynak/prop çözümlemesidir; canlı gözlem yerine geçmez. 2026 kaynağı değiştirilmedi, çalıştırılmadı. Ayrıntılı satır ve hedef kanıtları aynı adlı JSON içindedir.

## Sonuç

- 65 etkileşim adayı rota yeniden sınıflandırıldı: **22 rotada gizli içerik dalı yok**, 1 rota yalnız harici eğitim CTA'sı, 42 rotada gerçek içerik etkileşimi var. Bu sayılar başarılı tarayıcı testi sayısı değildir.
- `SolutionHero` içindeki `isMounted`/reduced-motion durumu dekoratif parçacıkları yönetiyor; kendi başına ayrı içerik paneli değildir. Statik iframe de dialog sayılmadı.
- `ProductPageTemplate` import edilmesi bütün isteğe bağlı modalların kullanıldığı anlamına gelmiyor. `workflowCategories`, `benefitsItems.videoUrl` ve `benefitsVariant` gerçek çağrı verisiyle değerlendirildi.
- `SideImageSection` video koşulu **ctaButton metni veya video alan adı**dır. OSKA bu koşulu sağlamaz; sürüm yenilikleri sayfasında 16 CTA sağlar.
- 376 medya yolu korunacak kayıt olarak tek tek sınıflandırıldı: 345 önceki tarama kapsamında referanssız; 26 önceki basename eşleşmesi farklı dosyaya ait; 4 eski harici/text referansı byte eşliği sağlamıyor; 1 BRC anahtarı farklı ve eksik `src/assets` yoluna bağlı.
- Bu 376 yolun hiçbiri 1364 dosyalık kayıtta önceden canlı hash eşliği veya tam kaynak referansı bulunan başka dosyayla aynı SHA'ya sahip değil. Kendi aralarındaki aynı hashli yollar JSON'da listelendi; bu durum canlı kullanım kanıtı sayılmadı.
- Bu sınıflandırma **silme, yeni içerik yayımlama veya envanterin tamamını kapatma kararı değildir**. Teknik arşivde tutulmaları kullanıcıdan tek tek 376 karar gerektirmez. Yayın kapsamına alınması önerilen somut içerik varsa ayrıca karar sunulur.

## Gizli içerik dalı bulunmayan rotalar

| Rota | Kaynak gerekçesi |
|---|---|
| `/products/allplan` | ProductPageTemplate: no workflowCategories, benefitsItems video, or dialog props. Static packages and 30-day trial claim retained. |
| `/products/architecture` | ProductPageTemplate: no workflowCategories or video props; static features. |
| `/products/ax3000` | ClientPage: static cards/links; shared template dialog branches not activated. |
| `/products/sds2-home` | whatIsInfoMedia video is inline iframe, not modal; no workflowCategories. |
| `/solutions-v2/training/e-learning` | TrainingDetailTemplate CTA uses external LearnNow href; ContactModal import does not activate inquiry dialog. |
| `/solutions/addons` | SolutionHero useState controls mount/reduced-motion decoration; supplied secondaryButton uses href, not hidden content callback. |
| `/solutions/allplan-industry` | SideImageSection imported but no JSX instance; SolutionHero mount state is decorative. |
| `/solutions/bimx5` | SolutionHero useState controls mount/reduced-motion decoration; supplied secondaryButton uses href, not hidden content callback. |
| `/solutions/bridge-design` | SolutionHero useState controls mount/reduced-motion decoration; supplied secondaryButton uses href, not hidden content callback. |
| `/solutions/features-allplan-bridge` | SolutionHero useState controls mount/reduced-motion decoration; supplied secondaryButton uses href, not hidden content callback. |
| `/solutions/imar-yonetmeligi-bim-eklentisi` | SolutionHero useState controls mount/reduced-motion decoration; supplied secondaryButton uses href, not hidden content callback. |
| `/solutions/modeling-of-precast-girder-bridges` | SolutionHero useState controls mount/reduced-motion decoration; supplied secondaryButton uses href, not hidden content callback. |
| `/solutions/oska` | SideImageSection CTA hrefs are bimx5.aluplan.com.tr and allplan-2021-features; no video-domain or Videoyu İzle condition. |
| `/solutions/precast` | SolutionHero useState controls mount/reduced-motion decoration; supplied secondaryButton uses href, not hidden content callback. |
| `/solutions/pythonpart` | SolutionHero useState controls mount/reduced-motion decoration; supplied secondaryButton uses href, not hidden content callback. |
| `/solutions/rebar-engineering` | SolutionHero useState controls mount/reduced-motion decoration; supplied secondaryButton uses href, not hidden content callback. |
| `/solutions/scalypso/converter` | SolutionHero useState controls mount/reduced-motion decoration; supplied secondaryButton uses href, not hidden content callback. |
| `/solutions/scalypso/mobile` | SolutionHero useState controls mount/reduced-motion decoration; supplied secondaryButton uses href, not hidden content callback. |
| `/solutions/scalypso/modeler` | SolutionHero useState controls mount/reduced-motion decoration; supplied secondaryButton uses href, not hidden content callback. |
| `/solutions/scalypso` | PremiumModuleGrid modules all link to child routes, none supplies videoUrl; inline videos remain static iframe inventory. |
| `/solutions/scalypso/videos` | SolutionHero useState controls mount/reduced-motion decoration; supplied secondaryButton uses href, not hidden content callback. |
| `/solutions/scalypso/viewer` | SolutionHero useState controls mount/reduced-motion decoration; supplied secondaryButton uses href, not hidden content callback. |
| `/solutions/steel` | SolutionHero useState controls mount/reduced-motion decoration; supplied secondaryButton uses href, not hidden content callback. |

## Kaynaktan belirlenen runtime adayları — envanter için tekrar tıklama şartı değil

Kayıt aşağıdaki davranışları kaynakta saptar. İngilizce kontrol tarifleri sonraki runtime incelemesinin adaylarıdır; hepsinin canlıda tekrar açılması kalan envanter işi olarak istenmez. Gerçekte gözlenenler ek JSONlarda ayrıdır.

| Rota/grup | Runtime kontrol adayı | Kaynak sınırı |
|---|---|---|
| `/products/allplan-aec` | Open each nested workflow panel and image lightbox | 28 5+5+5+4+5+4; tabFeatures first two groups reused, not a second independent set; info video inline |
| `/products/allplan-bimplus` | Open each workflow panel and image lightbox | 12 2+3+2+2+3; 15 VideoGridSection videos + hero/posthero inline, no separate dialogs |
| `/products/allplan-2026` | Open six distinct video targets; both trigger styles share target | 6  |
| `/products/allplan-2026-yenilikler` | Four tabs already observed; open 16 SideImageSection CTA video dialogs | 16 Condition tests CTA text/domain, not nonexistent SideImageSection videoUrl prop |
| `/products/allplan-cloud-services` | Open Autoconverter and AI Visualization ModuleCard dialogs | 2  |
| `/solutions/allplan-bulut-hizmetleri` | Open four video targets and image enlargements where offered | 4  |
| `/products/{allplan-basic,allplan-concept,allplan-professional,allplan-ultimate,civil}` | Open all feature/option VideoModal triggers plus CloudServicesSection video triggers; source lines retained in routes |  Default/civil CloudServicesSection each has three video cards. Do not count inline iframes as dialogs. |
| `WorkflowTabsTemplate consumers` | Record image src and any videoUrl from each observed panel, enlarge images; text-only prior evidence does not prove media mapping |   |
| `ImageGallery consumers` | Open gallery lightbox and record original image src/alt/title/description; category filters only where passed |   |
| `/` | Role selectors MİMAR/MÜHENDİS/PREKAST and ServicesV2 three tabs; global header mobile/search and cookie choice UI |   |
| `/solutions-v2/connect-license/activation` | Only blank first step; step advance sends email and requires separate authorized delivery test |   |

## Kaynakla saptanan ek içerik riski

`app/products/allplan/page.tsx` de 30 günlük deneme iddiası taşıyor; daha önce `/contact` için kaydedilen 14/30 günlük çelişki tek sayfaya özgü değil. Mevcut metin korunur, birincil üretici kanıtıyla çözülecek ortak ticari iddia kaydına bağlanır. Bu sayfanın paket listesinde destek/eğitim vaatleri de bulunduğundan bunlar paket hakkı veya Offer olarak otomatik schema'ya geçirilmez.

## Kanıt ve sınır

- [Ayrıntılı kaynak matrisi](remaining-source-checks-2026-10-22.json): 65 rota, video kaynak satırları, 376 medya yolu ve aday eşleşmenin tam satırları.
- [Önceki kaynak snapshotları](interaction-register-2026-10-22.md), [medya envanteri](media-complete-2026-10-22.md).
- Açık harici form sayfaları veya gerçek gönderim bu kaynak incelemesiyle doğrulanmış sayılmaz.
- Kaynaktaki `.env`, gizli dosyalar veya kullanıcı verileri okunmadı; kaynak içerikler yalnız public sayfa/bileşen ve mevcut envanter kayıtlarıyla sınırlı.

## Kaynak envanteri kapanışı ve tarayıcı sınırı

Kullanıcının güncel kaynak/canlı eşliği teyidi doğrultusunda her tekrar eden video penceresini açmak envanter kapanış koşulu değildir. **65 aday rotanın kaynak kontrol/veri kaydı tamamlandı**; tüm metin ve prop verisi önceki 161 tam kaynak snapshotında korunuyor. Aşağıdaki tablo sonlu video hedef kaydını netleştirir. Tarayıcıda gözlenmemiş davranışlar uygulama kabulünde ayrıca doğrulanır; kaynak kaydı canlı oynatma başarısı olarak sunulmaz.

| Paket rotası | Sayfa tanımlı video | Paylaşılan bulut videosu | Toplam kontrol |
|---|---:|---:|---:|
| `/products/allplan-basic` | 3 | 3 | 6 |
| `/products/allplan-concept` | 7 | 3 | 10 |
| `/products/allplan-professional` | 9 | 3 | 12 |
| `/products/allplan-ultimate` | 11 | 3 | 14 |
| `/products/civil` | 14 | 3 | 17 |

`browser-modules-final-2026-10-22.json` içinde 31 ek canlı durum kaydedildi: bulut ürün sayfası ve iki dialog; bulut çözüm sayfası, dört video ve 12 görsel dialogu; Scalypso ana/5alt sayfa; yenilikler Architecture paneli ve dört video dialogu. İnceleme sırasında kullanıcı tekrarlı canlı kontrol yerine kaynak odaklı ilerlenmesini istediğinde tarayıcı turu durduruldu ve yalnız açılan geçici sekme kapatıldı. Diğer 12 yenilik video hedefi kaynakta kayıtlı; oynatma doğrulandı denmez.

Geri kalan gerçek dış kanıt sınırı: teklif formunun görülmeyen/girişle kapanan sayfaları ve ticari iddiaların yetkili kaynağı. Arşivde kalan medya dosyaları teknik olarak kayıtlıdır; kullanıcıdan tek tek dosya onayı istenmez.
