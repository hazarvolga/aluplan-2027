# Yayın öncesi engeller (E1–E5) — kabul kaydı, 02.11.2026

Plan: `docs/superpowers/plans/2026-11-02-prelaunch-blockers.md`. Dal: `codex/prelaunch-blockers`, `615eeb9..25b23b2`. Push, merge, deploy ve Vercel ortam değişkeni değişikliği yapılmadı.

## Kapanan engeller

| Engel | Commit | Kanıt |
|---|---|---|
| E1 — bayrak ikilemi | `3445b44` | `ALUPLAN_SHOW_2027` ve `ALUPLAN_BLOCK_INDEXING` ayrıldı; ortam yalnız `src/lib/release-flags.ts` ve `next.config.mjs` içinden okunuyor. `/2027/*` kendi sayfalarına sahip, `/preview/*` production'da 404. |
| E2 — 2027 SEO | `25b23b2` | Altı rota için canonical, OG, Twitter, JSON-LD (`WebPage`, `BreadcrumbList`, `SoftwareApplication` — `compare` hariç) ve sitemap kaydı eklendi; "Yerel inceleme" etiketleri kaldırıldı. Tüm JSON-LD `<` kaçışlı. 2027 ana sayfa varyantı da JSON-LD basıyor. `llms.txt` 2027 bölümü eklendi. |
| E3 — kart bağlantıları | `d8cf355` | `/products` 7, `/solutions/addons` 9, `/solutions/cds-addon` 9, `/solutions-v2/training` 6, `/solutions/ax3000-mekanik-tesisat` 6 kart bağlantısı kaynaktan geri geldi. |
| E4 — AX3000 dokümanları | `1f07293` | 6 indirme kaynak `documentGroups` dizisinden; 6/6 dosya 200 dönüyor. |
| E5 — lisans bağlantıları | `52459ad` | `connect2.allplan.com`, `how-to-assign` ve `forms.office.com/r/HSrhvAkYmb` geri geldi. 6 AX3000 alt sayfasına modül gezinmesi (7 bağlantı) ve mekanik tesisat EKB/doküman CTA'ları eklendi. |

## Komutlar ve sonuçlar

| Komut | Sonuç |
|---|---|
| `pnpm test` | 224 unit test, 36/36 faz paritesi, 45/45 token testi geçti |
| `pnpm typecheck` | Hatasız |
| `ALUPLAN_SHOW_2027=1 ALUPLAN_BLOCK_INDEXING=1 pnpm build` | Geçti |
| `ALUPLAN_SHOW_2027=1 ALUPLAN_BLOCK_INDEXING=0 pnpm build` | Geçti |
| `pnpm audit --prod` | Bilinen güvenlik açığı yok |
| `pnpm data:generate` (2 kez) | `src/data/*.json` bayt bazında aynı; değişen veriler yalnız eklenen `link`, `actions` ve `documentGroups` alanları |

## Yerel production kabulü

**İnceleme ortamı (`SHOW=1`, `BLOCK=1`):**
- `/` → `X-Robots-Tag: noindex, nofollow`, `robots.txt` `Disallow: /`, meta `noindex, nofollow`.
- `/2027/*` 6 rota → 200 ve meta `noindex, nofollow`.
- E3–E5 kapsamındaki 9 rota → 200.

**Gerçek alan adı ayarı (`SHOW=1`, `BLOCK=0`):**
- `/2027/max`, `/2027/features`, `/2027/compare` → `x-robots-tag` yok, meta `index, follow`, canonical `https://aluplan.com.tr/2027/*`, rotaya özgü `og:image`.
- Sitemap 6 2027 rotasını içeriyor; `/preview/*` 404 dönüyor.

**Geri dönüş ayarı (`SHOW=0`):** runtime testiyle doğrulandı. Eski ana sayfa varyantı dönüyor ve sitemap'te `/2027/` kaydı yok.

**Gerçek tarayıcı kabulü (yerleşik tarayıcı, `SHOW=1`, `BLOCK=1`):**
- Masaüstünde `/products` → "Detayları Görüntüle: ALLPLAN Civil" tıklaması `/products/civil` sayfasını açtı.
- `/solutions-v2/connect-license` sayfasında Tab ile odaklanan "Allplan Connect'e Git" bağlantısında `:focus-visible` görünür (2 px solid).
- 375 px görünümde `/products`, `/solutions/addons`, `/solutions-v2/training`, `/products/ax3000/dokumanlar`, `/solutions-v2/connect-license` ve `/solutions/ax3000/sprinkler` sayfalarında yatay taşma yok.
- Konsol hatası yok.

## Açık kalanlar (kullanıcı kararı)

- **K3 metinleri:** 2027 sayfalarının başlıkları "ürün adı | Aluplan" biçiminde; açıklamalar sayfada yayında olan hero paragrafından birebir alındı. Yeni metin yazılmadı. Onay bekleniyor (`src/lib/release-2027-routes.ts`).
- **`/2027/features` H1'i:** ana sayfa H1'iyle aynı; farklı bir H1 yeni metin gerektiriyor.
- **`/preview/product-lifecycle`:** 2027 ana sayfası bu adrese bağlantı veriyor, bu yüzden yayın bayrağıyla açık. Kalıcı URL ve "Yerel Önizleme" başlığı için karar gerekiyor.
- **Bağlantı farkları:** `docs/verification/main-link-gap-2026-11-02.md` D bölümündeki farklar sınıflandırılmalı.
- **OG görselleri:** `/2027/max` OG görseli AI üretimi hero, `/2027/scia` OG görseli FRILO hero'su. Marka ve hak onayı açık.
- **Vercel ortam değişkenleri (K2):** `ALUPLAN_2027_PREVIEW` kaldırılıp yerine Preview ve Production için `ALUPLAN_SHOW_2027=1`, `ALUPLAN_BLOCK_INDEXING=1` tanımlanmalı. **Bu yapılmadan bu dal deploy edilirse inceleme sitesi eski ana sayfaya döner ve indeks engeli kalkar.**

## Kapsam dışı gözlemler

- `/products` kartlarında kaynak veriden gelen "İncele" ve bir sonraki kartın rozet metni (ör. "PROFESYONEL") düz metin olarak görünüyor. Bu durum değişiklikten önce de vardı.
- İnceleme modunda alt sayfaların meta etiketi `index, follow` kalıyor. Sayfaları `X-Robots-Tag` header'ı ve `robots.txt` engelliyor; bu da değişiklikten önceki davranışla aynı.
