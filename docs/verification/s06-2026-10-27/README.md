# S06-A — Kanonik stil hattı ve ilk bileşen ayrımı

27.10.2026. Kullanıcı S06'ya devam onayı verdi. Yeni tasarım üretilmedi; içerik/schema/veri ve canlı site değiştirilmedi. **S06 devam ediyor; bu kayıt temel adımı kapatır.**

## Önceki sorun ve çözüm

Uygulama globals.css içinde design-system tokenları, bileşenCSS'leri ve önizlemeCSS'lerinin kopyasını taşıyordu. Token derleyicisi bu uygulama kopyasını kontrol etmiyordu. Bu nedenle tokens.json doğru üretilse bile Next.js başka bir kopyayı gösterebilirdi.

scripts/build_app_styles.py artık17kanonik girdiyi önceki cascade sırasıyla birleştirir. globals.css üretilmiş çıktıdır; elle düzenlenmez. Design-system kaynaklarının sırası aynen korunur. Selfhostedfont tanımları kanonik fonts.css'den okunur; Next.jspublic için URL'ler /assets/fonts/ olarak dönüştürülür. Uygulamaya özgü eski kurallar src/styles/application.css içinde tutulur.

- Token/palet kaynağı: design-system/tokens/tokens.json.
- KanonikDSbileşen kuralları: design-system/components/.
- Henüz taşınmamış uygulama kuralları: src/styles/application.css.
- Uygulama çıktısı: src/styles/globals.css.
- Üretim: pnpm styles:generate (önce tokenlar, sonra appCSS).
- Saltokunur kontrol: pnpm styles:check. Test ve build bu kontrolü zorunlu çalıştırır.
- Token testleri: pnpm test:tokens; pnpm test içine de bağlıdır.

Üretim önce bütünCSSgirdilerini okur; eksikgirdide mevcut çıktıya yazmaz. Tekrar üretim aynı baytlarda dosyayı yeniden yazmaz. --check çıktıyı değiştirmez ve drift olduğunda başarısız olur. Bu compositor uygulamaCSS'sinin tamamının tokenlaştırıldığı anlamına gelmez.

## İlk token ve bileşen dönüşümü

Mimar/mühendis/prekast renkleri JSXHEXsabitlerinden çıkarıldı. Üçprimitive rolrengi ve her tema/mod için semantic --role-architect/engineer/fabricator eklendi. Önceki mavi/zümrüt/kehribar değerler aynen korunur. Homepage sadece buCSSdeğişkenlerini seçer;23CSSfallback de aynı rol tokenını kullanır. Testler belirli paleti kilitlemez: geçerli primitive çözümlemesi denetlenir; in-memory tema mutasyonu aluplan/darkrolünü değiştirirken diğer mod/temaların değişmediğini doğrular. Bu, appCSS'deki tüm renklerin aynı şekilde davrandığı kanıtı değildir.

WorkflowSection, SubpageView içinden mevcutJSX ve seçimstate'iyle çıkarıldı. Modalların state'i parentta kaldı; callbackleronVideo/onImage üzerinden aynı değerleri taşır. Workflow/FAQklavye yardımcısı ortak structured-tab-key.ts oldu. Parent2972satırdan2738satıra indi; hâlâ büyüktür. Bu adım tüm bileşen ayrımını tamamlamaz.

## Doğrulama

-64Pythonbirim testi,36parite ve29token testi geçti.
-Productionbuild/TypeScript ve188kontrast çifti geçti.
-110rotaHTTP200/tekH1;0boşyapısalbölüm; ilkHTML16rota/303aday sayısı değişmedi.
-CSSyorum/boşluk ve aynı değere çözülen ekroltanımları/fallbackler dışarıda normalize edildiğinde öncekiCSSile birebir aynı SHA: css-equivalence.json.
-WorkflowJSX yalnız callbackadları/boşluk normalize edilerek öncekiJSXile aynı: component-extraction.json.
-Kod incelemesinde paleti kilitleyen ilk test önerisi düzeltildi; son incelemede önemli bulgu yok.
-Tarayıcı kullanımı bu tur Workayarlarında kapalıydı. Ekrangörüntüsü/piksel eşliği veya yeni bileşen etkileşimi tarayıcıda doğrulandı denmez. ÖncekiS05tarayıcıkanıtı bu yeni sürümün kabulü değildir. HTTPve kaynak kanıtları ayrı tutulur.

## Kalan S06 işleri

1. application.css içinde99hamrenk kullanımı var. Tema bağlamını koruyarak yüzey, overlay, kenarlık, gölge ve vurgu anlamlarına taşınmalı. Lightheader/footer override'ları hâlâ uygulamaCSS'sinde; tokenkaynağı tam otorite olabilmek için bunlar da taşınmalı.
2. Spacing/radius/type/motion ve responsive literals ile inline ölçüler henüz bütünüyle merkezileşmedi. Yapısal yüzde/sıfır/gridoranlarıyla tasarım kararlarını ayır; sayısalherdeğeri rastgele tokenlaştırma.
3. BüyükSubpageViewveHomepagebileşen ayrımı devam etmeli. Mevcutmetin/URL/medya eşliği korunmalı.
4. Açık/koyu tema ve mobildesktop gerçek tarayıcı kontrolü erişim olduğunda yapılmalı; kontrollütema değişiminin uygulamada yayılması gösterilmeli. Mutation testi bu görsel kabulün yerini tutmaz.

S07'ye geçilmedi, push/deploy yok. Pazarlamamateryalleri kullanılmadı. Kaynak2026'ya dokunulmadı.

## S06-B — Uygulama renklerinin merkezileştirilmesi

27.10.2026. `application.css` içindeki99hamHEX/RGBrenk kullanımı0'a indirildi. Mevcut renklerin65semantikvisualrolü ve8chrome(header/footer/hover)rolü tokens.json'a taşındı. Palet üretici logolarına veya medya dosyalarına uygulanmaz; dosyalar değişmedi.

- Yüzey/gölge/scrim/modal/YouTubevurgu/kenarlık renkleri artık `--visual-*` değişkenleri kullanır.
- Header/footercomponentalias'ları `semantic.chrome` üzerinden dört tema/moda göre çözülür; yedi eski açık-tema yerel alias değeri kaldırıldı.
- Eski `--action-on-brand-bg-hover` davranışı için yalnız modebağımsız token→tokenuyumlulukalias'ı kaldı. Gerçek renk değeri `chrome.onBrandHover` içinde. Selector-specificity, theme+mode semantic tanımını aşacak şekilde korunur. Bu aliasın önceki açık-temada beyazfgile kullanılma ihtimalindeki düşük kontrast riski çözülmedi; görünüm korunurken kanonik actionkontrast kontrolü gevşetilmedi.188tokençiftinin geçmesi bu uyumlulukaliasının her render kombinasyonunu kapsamaz.
- `build_app_styles.py` uygulamaCSS'sine HEX/RGB/HSL/HWB/Lab/LCH/OKLab/OKLCH/color() literal yazılmasını reddeder; karşılaştırma büyük/küçük harf bağımsızdır. `color-mix()` içindeki tokenreferansları korunur. Bu kontrol tam birCSSparser/linter değildir; namedcolorve yapısal transparent/currentColor kuralları için geniş kabul iddia edilmez.
- Yeni in-memory mutationtesti modaloverlay ve headerbgtokenlarını farklı modlarda değiştirerek componentaliasın doğru kapsama aktığını ve diğer tema/modların değişmediğini doğrular. Kalıcı testler belirli paleti kilitlemez.

Kanıt `color-migration.json`:99kaynakrenkkaydının literal→semanticrole→primitive çözümü; dört kapsamın her birinde65visualdeğer ve8chromealias eski etkin değerlerle eşit. Eski açık-tema override bloğu tersine eklendiğinde uygulamaCSS'sinin normalize hashleri eşittir. Bu kaynak/resolution/cascade kanıtıdır, tarayıcı/piksel kabulü değildir.

66Pythonbirimtesti,36parite,30token testi, styles:check, productionbuild/TypeScript ve188kontrast kontrolü geçti. Son HTTPtarama110/110200/tekH1,0boşyapısalbölüm; ilkHTML16rota/303aday aynı. Yeni kaynakveri/schema/TSXdeğişikliği yok. Tarayıcı erişimi Workayarlarında kapalıydı; yeni görsel kabul yapılmadı. İnceleme önemli bulgu vermedi; büyükharfcolorfonksiyonkoruması önerisi testle eklendi.

S06-Brenkadımı tamamlandı. S06tamamlanmadı: sabit spacing/size/radius/type/motion değerlerinin anlamlıtokenlara taşınması ve büyükbileşen ayrımı sürüyor. Önceki S06-Akalanlar listesindeki99renk ve açıktema header/footer maddeleri bu adımla aşılmıştır. Hoverkontrast riski ve tarayıcıgörselkabulü açık kalır. Push/deploy yok.

## S06-C — Tipografi, boşluk, köşe ve hareket ölçüleri

27.10.2026.445uygulamaCSSdeklarasyonu semantic tokenlara taşındı;120yeni semanticmetrik rolü eklendi. Hedefler: font-size/font-weight/line-height/letter-spacing/border-radius, gap/padding aileleri, transition/animation süre/gecikme/easingdeğerleri. Hedeflenen ham metrikler445→0. Yapısal0/yüzde/gridoranı/mediaquerysınırı rastgele tokenlaştırılmadı. Sabitgenişlik/yükseklik/margin/transform ölçüleri veTSXinline ölçüler bu adımın tamamlanmış kapsamı değildir.

Mevcutsemantic tokenlar yalnız dört tema/modda da eski literal değeri sağlıyorsa tekrar kullanıldı; fieldtemasının farklı spacing/radius değerleri korunur. Yeni roller type.application.*, space.application.*, font.letterSpacing.application*, radius.application*, motion.duration.* ve motion.easing.* altında. Süre ve animasyonstaggergecikmeleri semantic.motion.duration altında bulunduğu için derleyici reduced-motionüretiminde hepsini0msyapar. Normalhareket değerleri aynı; reduced-motionkullanıcıları için önceden sabitkalan süre/gecikmelerin kapanması kasıtlı erişilebilirlik iyileştirmesidir.

metrics-migration.json her deklarasyonun önceki/sonraki değerini ve tokenını listeler. Dört tema/modda445/445eşleşme,0fark; tersCSSnormalizehash eşliği. Bu tarayıcı/pikselkabulü değildir. Modeizolasyonve reduced-motion testleri eklendi. Compositor hedeflenmişhammetriklerin geri gelmesini reddeder; hata halinde mevcutçıktıya yazmaz. Bu kontrol tamCSSparserdeğildir.

67Pythonbirimtesti,36parite,32token testi, styles:check, pnpmtypecheck, productionbuild ve188kontrast kontrolü geçti. SonHTTP110/110200/tekH1/0boşyapısalbölüm;16rota/303ilkHTMLadayı değişmedi. Bağımsız inceleme445deklarasyonun dört kapsam çözümünü tekrar kontrol etti; önemli bulgu yok. BrowserWorkayarlarında kapalı: yeni görsel ve gerçek etkileşim kabulü bekler. İçerik/schema/data/TSXbuadımda değişmedi.

### Git ve kullanıcı dosyaları

GitHubrepo https://github.com/hazarvolga/aluplan-2027 kullanıcı tarafından bildirildi. GitHubconnectorüzerinden public/defaultbranchmain/size0 doğrulandı; gitls-remoteheads0sonuç verdi. Yerelorigin buadrese eklendi. Yeni çalışma branch'i codex/s06-metrics-tokens; mainüzerine yeni geliştirme commiti yapılmadı.

Kullanıcı önce kurallarıAGENTS.md'ye ekledi, sonra kendisi eskiAGENTS.md'ye dönüp aynıworkflow'u kökte DEVOPS MASTER WORKFLOW.md konumuna taşıdı. SonAGENTS46satır/HEADileaynı; yeni1131satırworkflowdosyası kullanıcıyaait ve buS06commitinden ayrı/untrackedkorunur. Yeniworkflowokundu;43.bölüm açıkpush/merge/deploy talebinin ayrıca ele alınabileceğini belirtir. Öncekipush/deployyok sınırı korunur: push/PR/CI/merge buadımda yapılmadı, localbaşarıremote başarı değildir. Repo adresinin paylaşılmasıpublicilkpush teslimatı yapıldığı anlamına gelmez.

S06-D'de çok kategorili SSS dizini, kategori state'iyle birlikte `FAQSection` bileşenine çıkarıldı. `DirectoryCategoryIcon` referans ve SSS alanlarında ortak kullanılıyor. İçerik ve sekme/aria davranışları korundu; önceki ve yeni FAQ JSX ağacı biçim boşlukları normalize edildiğinde birebir eşleşti. 67 Python birim testi, 36 faz parite kontrolü, 32 token testi, styles:check, typecheck ve production build geçti. Kod incelemesinde engelleyici bulgu yok. Build kaynaklı `next-env.d.ts` değişikliği geri alındı. Tarayıcı erişimi Work ayarlarında kapalıydı; görsel kabul yapılmadı.

S06devam ediyor. SıradaTSXinline tasarımölçülerinin ve geriyekalanlayoutölçülerinin elealınması, büyükbileşen ayrımı ve tarayıcıaçıldığındagörselkarşılaştırma var. S07'yegeçilmedi. Kaynak2026ve pazarlamaklasörü kullanılmadı/değişmedi; hiçbircanlıortam değiştirilmedi.

S06-E'de sabit inline gap/inset/margin, max-width/height, metin genişliği, satır yüksekliği, directory ikon boyutu/çizgi kalınlığı ve özellik kartı stagger adımları token kaynağına bağlandı. `0/85/170/255ms` süreleri dört ayrı `nth-child` tokenıyla korunur; reduced-motion bunları da 0ms yapar. Yüzde, auto, aspect ratio ve içerik kaynaklı layout değerleri tokenlaştırılmadı. `inline-style-migration.json`, 162 kalan JSX style nesnesinin eski/yeni çözümünü aluplan/field × light/dark için kıyaslar; stagger indeksleri ayrıca doğrulanır. Token testinde 22 ölçü/layout/ikon rolü ve 4 stagger adımı tüm kapsamlarla kontrol edilir. 67 Python birim testi, 36 faz parite kontrolü, 34 token testi, typecheck ve production build geçti; 188 kontrast çifti kontrol edildi. Tarayıcı erişimi Work ayarlarında kapalı olduğundan görsel kabul yoktur. S06 sürüyor.

S06-F'de uygulama CSS'indeki 125 sabit border kalınlığı `1/2/3/4px` dört semantik tokena taşındı. Border shorthand, fiziksel ve mantıksal border kalınlıkları raw-value korumasına eklendi; sıra/unit varyasyonları yakalanırken sıfır/reset durumları ve renk fonksiyonu içindeki yüzdeler geçerli kalır. Negatif testler `1px`, `solid 1px`, mantıksal border-width ve `1pt` biçimlerini kapsar. `pnpm test` (68 Python + 36 faz parite + 35 token), `pnpm typecheck`, `pnpm build` geçti; 188 kontrast kontrolünde hata yok. Boyut/offset/transform/shadow adayları henüz ayrıştırılmadı; S06 sürüyor.

S06-G'de sabit rem/px konumları kullanan ürün rozeti, özellik satırı indeksi, YouTube watermark'ı, playlist sidebar'ı, video badge/zoom kontrolü, referans filtreleri ve hakkımızda hikâye sidebar'ı mevcut space tokenları veya yeni role dayalı tokenlara bağlandı. Ayrıca 15 sabit margin/optik hizalama ölçüsü tokenlara taşındı. Yeni offset/optik tokenlar her tema/modda kaynak değerlerle eşleşir. `%` ile konumlandırma, sıfır/auto margin'ler ve `.alu-skip-link` için `left:-9999px` yapısal/erişilebilirlik istisnalarıdır; guard istisnası yalnız bu seçicide geçerlidir. Uygulama style guard'ı yeni ham sabit inset/margin değerlerini yakalar. `pnpm test` (70 Python + 36 faz parite + 36 token), `pnpm typecheck` ve `pnpm build` geçti; 188 kontrast kontrolünde hata yok. Browser görsel kabulü yapılmadı.

S06-H1'de 22 sabit görsel bileşen ölçüsü semantic `size.application.*` rollerine taşındı. Altı yeni primitive yalnız mevcut size skalasında bulunmayan `.45/.5/.55/.6/1.75/3.5rem` değerlerini temsil eder. Token testi bütün rollerin dört tema/modda eski ölçüleri verdiğini; repository testi hedeflenen seçicilerde ham px/rem/em width-height kalmadığını doğrular. Prose/container ölçüleri ile viewport/responsive yerleşim ölçüleri kapsam dışında bırakıldı ve S06-H2 olarak izlenecek. RED aşamasında token testi `undefined`, seçici testi 22 ham ölçü buldu; GREEN sonrasında ikisi geçti. `pnpm test` (71 Python + 36 faz parite + 37 token), `pnpm typecheck` ve `pnpm build` geçti; 118 rota ve 188 kontrast kontrolü doğrulandı.

S06-H2'de 16 semantic container rolü 16 selector üzerindeki sabit içerik ölçülerini yönetir. Aynı değerdeki cookie/YouTube banner'ları ile intro/FAQ kolonları gelecekte bağımsız değişebilmesi için ayrı semantic rollere sahiptir. Modal genişlikleri `min(100%, token)` formunu, metin alanları `ch` ölçülerini, diğer alanlar özgün min/max-width davranışını korur. Yedi eksik rem değeri primitive `size.measure` skalasına eklendi. Token testi bütün ölçüleri dört tema/modda doğrular; repository testi her selector/property için doğru semantic rolü tam eşleştirir. Viewport ve responsive yükseklikleri ile dekoratif boyutlar kapsam dışında bırakıldı. RED aşamasında tokenlar `undefined`, 16 selector eşleşmesi başarısızdı; GREEN sonrasında testler geçti. `pnpm test` (72 Python + 36 faz parite + 38 token), `pnpm typecheck` ve `pnpm build` geçti; 118 rota ve 188 kontrast kontrolü doğrulandı.

S06-H3'te header, modal, bento, servis pill, feature media, playlist, video/görsel viewport, referans sayacı ve harita için 14 bağımsız layout rolü tanımlandı. Desktop/compact playlist yükseklikleri iki ayrı tokenla ve mevcut responsive sıra ile korunur; bento responsive rolü 64rem altında beş kartın tamamını kapsar. `dvh/vh/calc` sınırları değiştirilmeden semantic katmana taşındı; dört eksik rem ölçüsü primitive measure skalasına eklendi. Token testi dört tema/mod eşliğini, repository testi selector/property/token sözleşmesini, aynı property için yanlış/hardcoded tekrar bulunmadığını ve 64rem media bağlamını doğrular. Dekoratif glow/rule/divider ölçüleri H4'e bırakıldı. `pnpm test` (73 Python + 36 faz parite + 39 token), `pnpm typecheck` ve `pnpm build` geçti; 118 rota ve 188 kontrast kontrolü doğrulandı.

S06-H4'te hero metric rule, pathway glow ve office divider için dört bağımsız semantic size rolü tanımlandı. `52rem` primitive measure eklendi; 1/2px kalınlıklar mevcut border-width primitive'lerini kullanır. Üç selector için property/token sözleşmesi ve application.css genelinde ham sayısal width/height/min/max kalmaması test edilir. RED aşamasında dört token `undefined`, selectorlar ham ölçülerle eşleşmedi ve genel tarama altı deklarasyon buldu; GREEN sonrasında testler geçti. Width/height literal sınıfı kapanmıştır. `pnpm test` (74 Python + 36 faz parite + 40 token), `pnpm typecheck` ve `pnpm build` geçti; 118 rota ve 188 kontrast kontrolü doğrulandı. Transform, shadow/blur ve büyük bileşen ayrımı sürer.

S06-I1'de 15 tekrarlanan hover lift/nudge dönüşümü beş semantic motion rolüne taşındı. Ortak roller component bağımlılığı değil, site genelinde birlikte ayarlanabilir etkileşim yoğunluğu pattern'leridir. Primitive→semantic→application katmanı korunur ve dört tema/modda eski `translateY(-2/-3/-4px)` ile `translateX(3/5px)` değerleri aynen çözülür. RED aşamasında 15 selector ham değerle kaldığı ve beş token `undefined` olduğu için testler kırıldı; GREEN sonrasında exact-selector ve dört-mod testleri geçti. Merkezleme, disclosure dönüşü, keyframe, component-state, medya zoom ve dekoratif scale değerleri bilinçli olarak sonraki alt adımlara bırakıldı. `pnpm test` (75 Python + 36 faz parite + 41 token), `pnpm typecheck` ve `pnpm build` geçti; 118 rota ve 188 kontrast kontrolü doğrulandı. Bağımsız review bulgusuz onayladı; canlı/push/deploy yok.

S06-I2'de kalan 23 görsel transform 19 semantic role taşındı: medya/control zoom, component state, pathway keyframe ve statik dekoratif scale. Dekoratif roller motion ailesinden ayrıldı; aynı primitive değeri paylaşan farklı anlamlar semantic seviyede bağımsız kaldı. Yalnız pathway merkezleme ve FAQ disclosure dönüşü exact selector/value sözleşmesiyle literal kalır. Guard tam semantic `var()` dışında kalan transformları, mixed raw+var dahil reddeder. RED aşamasında 23 ham değer ve 19 `undefined` token görüldü; GREEN sonrasında exact selector, grouped selector, keyframe ve dört-mod testleri geçti. İlk review'ın üç orta bulgusu kapatıldı ve delta review bulgusuz onaylandı. `pnpm test` (77 Python + 36 faz parite + 42 token), `pnpm typecheck` ve `pnpm build` geçti; 118 rota ve 188 kontrast kontrolü doğrulandı. Transform sınıfı kapanmıştır; canlı/push/deploy yok.

S06-J1'de 12 filter/backdrop-filter deklarasyonu 11 role taşındı. Hero, pathway, ürün state'leri, bento state'leri, alt sayfa atmosferi ve üç backdrop blur kullanımı semantic olarak ayrıldı; standart/WebKit header yolları aynı tokenı kullanır. Compositor yalnız tam `var(--filter-*)` kabul eder ve raw, yanlış namespace ile iki yönlü mixed değerleri reddeder. RED aşamasında 12 raw deklarasyon ve 11 eksik token görüldü; GREEN sonrasında exact selector, guard ve dört-mod testleri geçti. İlk review'ın namespace bulgusu kapatıldı, delta review bulgusuz onaylandı. `pnpm test` (79 Python + 36 faz parite + 43 token), `pnpm typecheck` ve `pnpm build` geçti; 118 rota ve 188 kontrast kontrolü doğrulandı. J2 shadow geometrileri açık; canlı/push/deploy yok.

S06-J2'de 19 ham shadow ve bir `none` reset 20 semantic role taşındı. Geometry primitive katmanda; component anlamı ile dinamik tema/rol renkleri semantic katmanda kaldı. Guard yalnız canonical semantic/component-alias çıktılarında tanımlı shadow/elevation tokenlarını kabul eder; raw, mixed, yorumlu bypass, undefined ve component-local tokenlar reddedilir. Duplicate selectorlarda beklenen rolün son/effective değer olması test edilir. RED aşamasında 20 ham/reset değer ve 20 eksik token görüldü; GREEN sonrasında exact selector, dört-mod ve guard testleri geçti. Review'daki bir yüksek ve dört orta bulgunun tamamı kapatıldı; final review bulgusuz onaylandı. `pnpm test` (81 Python + 36 faz parite + 44 token), `pnpm typecheck` ve `pnpm build` geçti; 118 rota ve 188 kontrast kontrolü doğrulandı. Filter/shadow literal sınıfı kapanmıştır; canlı/push/deploy yok.

## S06-K — `/about` editoryal bileşen ayrımı

27.10.2026. `/about` rotasının kurumsal editoryal görünümü stateless `AboutEditorialSection` bileşenine çıkarıldı. Koşullu render parentta kalır; yeni bileşen yalnız `page: PageRecord` alır ve gereksiz client boundary oluşturmaz. JSX içeriği, sınıflar, bölüm sırası, metrikler, link hedefleri ve iframe erişilebilirlik/güvenlik özellikleri korunur. `SubpageView` 2402→2167 satıra indi.

Yeni kaynak-sözleşme testi önce dosya olmadığı için RED, extraction sonrası GREEN oldu. Yerel `/about` çıktısında önce/sonra 126 görünür metin düğümü, 15 başlık ve 43 link birebir eşleşir; iki HTML de 59.733 bayttır. Development chunk kimliği değiştiğinden tam HTML hash eşitliği beklenmez. `pnpm test` (82 Python + 36 parite + 44 token), `pnpm typecheck`, `pnpm build`, 118 rota ve 188 kontrast kontrolü geçti. Bağımsız review önemli bulgu vermedi. Yerel tarayıcı Work ayarlarında kapalı kaldığı için screenshot, responsive ve console kabulü yapılmadı; S06 kapanışında hâlâ gereklidir. İçerik/schema/veri/URL ve canlı sistem değişmedi.

## S06-L — Benefits bileşen ayrımı

27.10.2026. Yapılandırılmış sayfalardaki ortak benefits kart alanı stateless `BenefitsSection` bileşenine çıkarıldı. Parent veri koruması ve 8/12+ öğe için dört kolon, diğerleri için üç kolon mantığı değişmedi. Tip doğrudan `StructuredPageLayout['benefits']` sözleşmesinden türetilir; yeni client boundary yoktur. `SubpageView` 2167→2130 satıra indi.

Extraction testi RED→GREEN çalıştı. Veri testi benefits içeren 28 rotada bölüm/öğe metinlerini ve yerel ikon varlığını doğrular. `/products/allplan-ultimate` için önce/sonra sabit HTML ağacı birebir eşit; 12 kart ve kart başlığı aynı sıradadır. `pnpm test` (84 Python + 36 parite + 44 token), `pnpm typecheck`, `pnpm build`, 118 rota ve 188 kontrast kontrolü geçti. Bağımsız review önemli bulgu vermedi. Gerçek tarayıcı görsel/console kabulü Work ayarı nedeniyle açık kalır; içerik/schema/veri/URL ve canlı sistem değişmedi.

## S06-M — Media grid bileşen ayrımı

27.10.2026. Ortak media grid renderer etkileşimli `MediaGridSection` bileşenine çıkarıldı. Grid ve kart key kimlikleri ayrı korunur; kolon, thumbnail, video/görsel modal callbackleri, klavye, aria, internal/external link ve lazy image davranışı değiştirilmedi. Explicit client sınırı parentın mevcut sınırını genişletmez; lazy/Suspense eklenmedi. `SubpageView` 2130→1987 satıra indi.

Extraction testi RED→GREEN çalıştı. Veri testi 29 rota, 54 grid ve 362 kart ile yerel görselleri doğrular. `/products/allplan-ultimate` sabit HTML'i önce/sonra birebir eşit; 3 grid, 38 kart ve 38 etkileşimli thumbnail sözleşmesi korunur. `pnpm test` (86 Python + 36 parite + 44 token), `pnpm typecheck`, `pnpm build`, 118 rota ve 188 kontrast kontrolü geçti. Bağımsız review önemli bulgu vermedi. Gerçek tarayıcı etkileşim/görsel/console kabulü Work ayarı nedeniyle açık kalır; içerik/schema/veri/URL ve canlı sistem değişmedi.

## S06-N — Split callout bileşen ayrımı

27.10.2026. İki yinelenen split-callout renderer ortak `SplitCalloutSection` bileşenine çıkarıldı. Primary/bottom filtreleri ve konumları parentta kaldı; filtered index alternasyonu, key prefix, YouTube/MP4/image davranışı, klavye/aria, içerik fallbackleri ve CTA güvenlik attributeları korundu. Lazy/Suspense eklenmedi. `SubpageView` 1987→1626 satıra indi.

Extraction testi RED→GREEN çalıştı. Veri testi 22 rota ve 62 callout'ı 52 primary/10 bottom, 27 YouTube/5 MP4/30 image olarak doğrular. Geometry Tools, Allplan Bridge ve Ultimate rotalarının script dışı HTML'i, reverse dizileri, medya attributeları ve link sözleşmeleri önce/sonra birebir eşittir. `pnpm test` (88 Python + 36 parite + 44 token), `pnpm typecheck`, `pnpm build`, 118 rota ve 188 kontrast kontrolü geçti. Bağımsız review önemli bulgu vermedi. Gerçek tarayıcı etkileşim/görsel/console kabulü Work ayarı nedeniyle açık kalır; içerik/schema/veri/URL ve canlı sistem değişmedi.

## S06-O — Video Library Hub bileşen ayrımı

27.10.2026. Video kütüphanesi ana görünümündeki statik veri ve render ağacı `VideoLibraryHubSection` bileşenine çıkarıldı. Yeni bileşen state veya prop taşımaz; `getAllPlaylists()` eşlemesiyle yerel playlist video sayılarını göstermeye devam eder. Parent yalnız rota koşulunu korur. `SubpageView` 1626→1405 satıra indi.

TDD kontratları yeni bileşen yokken iki hata ile RED, extraction sonrasında 9/9 GREEN oldu. Kaynak sözleşmesi sıralı 22 başlık–URL çiftini kilitler: 14 yerel playlist, 4 dış kanal ve korunmuş 4 `#` hedef. Yerel `/solutions-v2/training/video-library` rotasının `<main>` ağacı önce ve sonra 42.221 bayt; SHA-256 iki durumda da `a0e340ad055b577e0746f4f13b51354f8779c2d415ea61edb7115231fe8306f5`. 22 kart, 1 abonelik banner'ı ve 23 ilgili href aynı sıradadır.

`pnpm test` 90 Python testi, 36 faz parite kontrolü ve 44 token testini geçirdi. `pnpm typecheck` ve `pnpm build` başarılı; 118 rota üretildi, 188 kontrast çiftinde hata yok. Bağımsız review'ın exact URL parite önerisi başlık–URL listesiyle kapatıldı; uygulama tarafında kritik/yüksek/orta bulgu kalmadı. Build'in `next-env.d.ts` değişikliği geri alındı. Work ortamında gerçek tarayıcı otomasyonu kapalı olduğundan screenshot, hydration/console ve responsive etkileşim kabulü hâlâ açıktır. İçerik/schema/veri/URL, kaynak 2026 ve canlı sistem değiştirilmedi; `#` hedefler yeni üretilmedi ve karar envanterindeki statülerini korur.
