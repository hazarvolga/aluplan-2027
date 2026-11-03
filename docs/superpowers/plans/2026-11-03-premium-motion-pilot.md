# Premium Motion Pilot Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans to implement task-by-task. Steps use checkbox syntax.

**Goal:** Denenen C hareket karakterini yalnızca ana sayfa hero görseli ve `/products` üzerindeki ilk büyük ürün kartı için yerel pilotta uygulamak.

**Architecture:** Hero dekoratif görseline CSS modülüyle tek açılış hareketi eklenir; içerik her zaman görünür. Ürün kartı yalnız ilk görünür oluşunda, istemci tarafındaki küçük bir IntersectionObserver yardımıyla bir kez hareket eder; gözlemci yoksa veya JavaScript çalışmazsa kart statik görünür. İki sahne mevcut sayfa düzeni ve verileriyle çalışır.

**Tech Stack:** Next.js 16, React 19, TypeScript, CSS Modules, mevcut Python unittest ve tarayıcı doğrulaması; yeni bağımlılık yok.

**Spec:** `docs/superpowers/specs/2026-11-03-premium-motion-design.md`

## Global Constraints

- Mevcut metin, görsel, URL ve CTA hedefleri korunur; önceki kaydedilmemiş değişiklikler korunur.
- Ana sayfada C yönündeki görsel hareket yaklaşık 1,2 saniye; metin ve CTA gecikmeden görünür.
- İlk ürün kartı aynı sayfa ziyaretinde en fazla bir kez animasyon yapar; diğer ürün ve çözüm kartlarına giriş animasyonu eklenmez.
- `prefers-reduced-motion: reduce` dekoratif hareketi kapatır; JavaScript veya IntersectionObserver yoksa içerik görünür ve işlevsel kalır.
- Lenis, React Bits veya GSAP kurulumu bu pilotun parçası değildir; mevcut CSS yeterliliği pilotta değerlendirilir.
- Mobil, masaüstü, açık/koyu tema ve klavye test edilir; önce/sonra LCP, CLS, INP ve JS aktarımı aynı koşullarda ölçülür. Laboratuvar verisi saha verisi olarak sunulmaz.

## Review Focus

1. Görsel ilk yüklemede görünür: Task 1, CSS/JS devre dışı tarayıcı kontrolü.
2. Azaltılmış hareket veya tercih değişimi: Task 1 ve 2, tarayıcıda hareket yokluğu kontrolü.
3. Kart zaten görünür, sonra kaydırılıp geri dönülür: Task 2, tek tetiklenme kontrolü.
4. Observer yok veya rota değişimiyle bileşen kaldırılır: Task 2, statik geri dönüş ve gözlemci temizliği kontrolü.
5. Mobilde kırpılan görselin anlaşılması ve odak: Task 3, temsilî ekranlar ve klavye testi.

## File Structure

- Modify `src/components/sections/HomepageMaxPreviewHero.tsx`: dekoratif sahneye yerel CSS sınıfları bağlanır.
- Create `src/components/sections/HomepageMaxPreviewHero.module.css`: yalnız dekoratif hero görsel ve çizgi hareketi.
- Modify `src/components/sections/ProductsOverview.tsx`: ilk ürün kartına tek seferlik görünürlük işareti bağlanır.
- Modify `src/components/sections/ProductsOverview.module.css`: yalnız işaretli ilk kart için görsel hareketi ve mevcut etkileşim durumları.
- Create `src/components/sections/useFirstVisible.ts`: `useFirstVisible(): { ref: RefObject<HTMLElement | null>; hasAppeared: boolean }`; observer desteklenmiyorsa `hasAppeared` false kalır ve içerik statik görünür. Observer ilk görünürlükte ayrılır, unmount'ta temizlenir.
- Test `tests/test_home_slides.py` ve `tests/test_products_overview.py`: mevcut davranış sözleşmelerine uygun anlamlı kapsam.
- Update `HANDOFF.md`: ölçüm, kontrol ve kullanıcı kabulü durumunu kaydet.

### Task 1: Ana sayfa hero pilotu

**Files:** `HomepageMaxPreviewHero.tsx`, `HomepageMaxPreviewHero.module.css`, `tests/test_home_slides.py`.

- [ ] Mevcut test yapısında, hero başlığı ve CTA'ların animasyonla gizlenmediğini; hareket sınıfının yalnız dekoratif görsele uygulandığını doğrulayan test ekle. Testi çalıştır ve yeni sınıf eklenmeden başarısız olduğunu doğrula.
- [ ] `HomepageMaxPreviewHero.module.css` içinde `imageMotion` ve `accentLine` sınıflarını oluştur. `prefers-reduced-motion: no-preference` altında dekoratif görsel için C seçeneğine yakın yaklaşık 1,2 saniyelik, ölçek ve opaklıkla sınırlı açılış; çizgi için uyumlu bir açılış kullan. Başlık, CTA ve içerik üzerinde gizleme veya gecikme kullanma.
- [ ] `HomepageMaxPreviewHero.tsx` içinde bu sınıfları yalnız dekoratif öğelere bağla; çizgiyi `aria-hidden` olarak ekle. Metin ve bağlantı hedeflerini değiştirme.
- [ ] `python3 -m unittest tests.test_home_slides` ve `pnpm styles:check` çalıştır; ikisi de geçmeli. Tarayıcıda normal ve azaltılmış hareketle içerik ve CTA'nın başlangıçta görünürlüğünü, JS kapalı halde erişilebilirliğini kontrol et.

### Task 2: Tek öne çıkan ürün kartı

**Files:** `useFirstVisible.ts`, `ProductsOverview.tsx`, `ProductsOverview.module.css`, `tests/test_products_overview.py`.

- [ ] Test ekle: `/products` ilk kartı gözlemciye bağlanır; diğer kartlarda giriş işareti yoktur; hedefler ve içerik korunur. Testi uygulamadan önce çalıştırıp başarısız olduğunu doğrula.
- [ ] `useFirstVisible()` kancasını yukarıdaki arayüzle uygula; `IntersectionObserver` ilk kesişim sonrası disconnect olur, unmount temizliği yapılır. API yokluğunda hiçbir içerik gizlenmez.
- [ ] İlk kartın article öğesine `ref` bağla ve yalnız `hasAppeared` true iken animasyon sınıfını ekle. Görselin kendisini animasyonla; başlık veya bağlantıyı gizleme. Azaltılmış hareketle animasyonu çalıştırma ve mevcut hover/focus davranışını koru.
- [ ] `python3 -m unittest tests.test_products_overview tests.test_solution_directory`, `pnpm typecheck` ve `pnpm styles:check` çalıştır; geçmeli. Tarayıcıda ilk görünüm, kaydırıp geri dönüş, mevcut görünürlük ve observer yokluğu durumlarında tek veya sıfır tetiklemeyi doğrula; `/solutions` büyük kartlarında yeni giriş hareketi olmadığını kontrol et.

### Task 3: Kullanıcı kabulü ve ölçüm

**Files:** `HANDOFF.md`.

- [ ] Pilot öncesi ve sonrası aynı tarayıcı, viewport, ağ ve build koşullarında LCP, CLS ve aktarılmış JS ölç. INP ancak destekleyen gerçek etkileşim ölçümü varsa kaydet; yoksa ölçülmedi olarak belirt. Tek laboratuvar ölçümünü saha sonucu olarak adlandırma.
- [ ] Masaüstü ve mobilde iki tema, klavye odakları, `prefers-reduced-motion`, JS kapalı görünüm ve 5:2 görsel kırpmayı kontrol et; gözlenmeyen durumları açıkça kaydet.
- [ ] `HANDOFF.md` dosyasına sonuçları, pilotun yerel kaldığını, riskleri ve görsel kabul durumunu işle. Kullanıcıya değişikliği göster; tüm siteye yayılım için ayrı karar bekle.
