# Sitewide Motion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans. Steps use checkbox syntax.

**Goal:** Onaylı hafif dekoratif girişi tüm sayfalarda masaüstü/tablet kullanıcılarına sunmak; ana ve ikincil işaretleri sıralamak.

**Architecture:** Ortak SiteShell ana içerik alanına `PageEntrance` dekoratif bileşeni eklenir. Next.js pathname ile ana içerik yeniden bağlanmadan yalnız işaret pathname değişiminde yeniden oluşturulur; yalnız CSS animasyonu kullanılır. Ana sayfanın mevcut hero dekoratif çizgisi 180 ms gecikmeyle gösterilir.

**Tech Stack:** Next.js 16, React 19, TypeScript, CSS Modules, mevcut Python unittest; yeni bağımlılık yok.

**Spec:** `docs/superpowers/specs/2026-11-03-premium-motion-design.md` — “Tüm sayfalar için hafif giriş”.

## Global Constraints

- Metin, buton, görsel ve gezinme beklemez; JS kapalıyken ana içerik erişilebilir.
- Dekoratif işaret `aria-hidden` ve etkileşimsizdir; `min-width: 768px` ve `prefers-reduced-motion: no-preference` dışında gizlidir.
- Sayfalar arası geçiş veya liste kartlarına kademeli açılış eklenmez; tüm içerik ve hedefler korunur.
- Önceki yerel değişiklikleri koru, üretime dağıtma, commit yapma.

## Review Focus

1. İstemci gezinmesi/geri: işaret yeni pathname'de yeniden oynar, içerik kaybolmaz — Task 2 tarayıcı testi.
2. Mobil/reduced motion: işaret gizli ve hero animasyonu kapalı — Task 2 tarayıcı testi.
3. Erişilebilirlik: ana içerik sırası, odak ve tıklama etkilenmez — Task 2 kontrolleri.
4. Rewrites/hydration: pathname değişimi yalnız key için kullanılır, HTML metni ona bağlı değildir — Task 2 build ve rota testi.
5. Performans: yalnız küçük CSS/markup; yerel üretim ölçümü önce/sonra karşılaştır ve saha sonucu gibi sunma — Task 3.

### Task 1: Ortak dekoratif hareket

**Files:** create `src/components/shell/PageEntrance.tsx`, `src/components/shell/PageEntrance.module.css`, `tests/test_page_entrance.py`; modify `src/components/shell/SiteShell.tsx` and `src/components/sections/HomepageMaxPreviewHero.module.css`.

- [ ] `tests/test_page_entrance.py` içinde ortak shell'de dekoratif `PageEntrance` ve key ile pathname kullanımını, CSS'in yalnız desktop/no-preference koşulu ve pointer-events none özelliğini, ana sayfa çizgisinin gecikmesini doğrulayan testleri ekle; önce başarısız olduklarını gör.
- [ ] `PageEntrance` React bileşeni `usePathname` ile sadece dekoratif düğümün `key` değerini üretir; tek `aria-hidden` wrapper içinde çizgi ve küçük kare render eder; kullanıcıya görünür metin veya bağlantı üretmez.
- [x] CSS işareti içerik akışına alan eklemeden `main` içinde üste yerleştirir; 768px+ ve normal hareket tercihinde çizgiyi 600ms, kareyi 180ms gecikmeyle 300ms canlandırır; varsayılan gizlidir ve `pointer-events:none` kullanır. Sayfa içeriğini maskelemez.
- [x] SiteShell içindeki `main` çocuklarından önce PageEntrance ekle; main veya sayfa çocuklarını key ile yeniden oluşturma. Hero çizgisinin mevcut animasyonuna 180ms gecikme ekle. İnceleme sonucunda `main` konumu değiştirilmedi; sıfır yükseklikli işaret kullanıldı.
- [ ] `python3 -m unittest tests.test_page_entrance tests.test_home_slides`, `pnpm typecheck`, `pnpm styles:check` çalıştır; başarılı olmalı.

### Task 2: Görsel ve etkileşim doğrulama

- [ ] Üretim derlemesi al; ana sayfa, `/solutions-v2/addons`, `/products`, `/kaynaklar`, `/contact` rotalarını masaüstü ve 355px mobilde kontrol et; ana görsel/başlık/bağlantı görünür, yatay taşma yok, mobil işaret gizli.
- [ ] Masaüstünde istemci iç bağlantısı ve geri/ileriyle işaretin yeniden oynadığını, hash bağlantısında gereksiz yeniden başlamadığını kontrol et. Erişilebilirlik ağacında işaret bulunmadığını ve odak/tıklamaya engel olmadığını doğrula.
- [ ] `prefers-reduced-motion` altında işaretin gizli ve hero dekoratif animasyonunun kapalı olduğunu, JS kapalıyken içerik ve bağlantıların erişilebilir kaldığını doğrula.

### Task 3: Performans ve teslim

- [ ] Önce/sonra üretim derlemelerini aynı düşük mobil ağ/işlemci koşullarında temsilî sayfada karşılaştır. Ölçülemeyen veya saha olmayan ölçümleri açıkça belirt; CLS/LCP bozulması görülürse değişikliği gözden geçir.
- [ ] Bağımsız kod incelemesi yaptır, kritik/önemli sorunları düzelt. `pnpm test` çalıştır ve `HANDOFF.md` içine ölçüm, sınırlamalar ve kullanıcı görsel kabul durumunu kaydet.
