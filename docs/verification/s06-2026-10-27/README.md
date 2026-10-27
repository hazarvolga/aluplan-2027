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
