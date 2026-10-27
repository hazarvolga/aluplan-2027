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
