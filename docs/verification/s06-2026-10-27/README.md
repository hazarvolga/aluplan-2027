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
