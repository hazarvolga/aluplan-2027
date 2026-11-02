# `<main>` iç bağlantı farkı — 02.11.2026

## Yöntem

Canlı `https://aluplan.com.tr` sayfalarının `<main>` içindeki iç bağlantıları, yerel production build çıktısı (`.next/server/app/*.html`, `ALUPLAN_SHOW_2027=1`) ile karşılaştırıldı. Build, Task 3'teki kart bağlantısı düzeltmesinden sonra alındı. Tüm 110 rota canlıda 200 döndü. `#` parçaları ve sondaki `/` normalize edildi; `mailto:` ve `tel:` hariç tutuldu.

**Sonuç:** 45 rotada toplam 129 iç hedef yeni yapının `<main>` alanında yok. Task 3 öncesinde Vercel'e karşı yapılan taramada bu sayı 132 idi; o tarama farklı bir ortamı ölçtüğü için iki sayı doğrudan karşılaştırılamaz.

Bu belge düzeltme önermez; her satırın durumunu sınıflandırır. **“Karar bekliyor”** satırları kullanıcı onayı gerektirir.

## A. Bu plan içinde kapanacaklar

| Rota | Eksik hedef | Kapsayan task |
|---|---|---|
| `/products/ax3000/dokumanlar` | 6 doküman indirmesi (canlıda `/_next/static/chunks/...` adresleri, yenide `/docs/ax3000/*`) | Task 4 |
| `/solutions-v2/connect-license` | `/solutions-v2/connect-license/how-to-assign` | Task 5 |
| `/solutions/ax3000/{elektrik,havalandirma,isitma,konut-havalandirma,sihhi-tesisat,sprinkler}` | 6 modül arası gezinme bağlantısı + `/products/ax3000/dokumanlar` (her sayfada 7) | Task 5 (eylem bağlantıları) |
| `/solutions/ax3000-mekanik-tesisat` | `/products/ax3000/dokumanlar`, `/solutions/ax3000-yapi-fizigi` | Task 5 (eylem bağlantıları) |

## B. Gerçek fark değil

| Rota | Hedef | Neden |
|---|---|---|
| `/about`, `/contact`, `/kullanim-sartlari`, `/kvkk`, `/solutions-v2/connect-license`, `/solutions-v2/training` | `/cdn-cgi/l/email-protection` | Cloudflare'in e-posta gizleme bağlantısı; kaynakta `mailto:` olarak duruyor |
| `/products/ax3000/dokumanlar` | `/_next/static/chunks/assets/documents/...` | 2026 build'inin dosya karma adresleri; yeni yapıda `/docs/ax3000/*` ve `next.config.mjs` rewrite'ları var |
| `/solutions` | `/solutions/bimplus`, `/solutions/industry` | `next.config.mjs` 308 yönlendirmeleri; hedefler katalogda kanonik adresleriyle duruyor |
| `/solutions/allplan-bulut-hizmetleri`, `/solutions/oska`, `/products/allplan-2026` | `/allplan-2026nin-ozellikleri`, `/allplan-2021-features`, `/try-free` | Yönlendirme adresleri; kanonik hedefler korunuyor |

## C. Onaylı kararlarla açıklananlar

| Rota | Hedef | Karar |
|---|---|---|
| `/`, `/paket-karsilastirma`, `/products/allplan-cloud-services` | `/docs/V2026_paket-karsilastirme-Q3-2026_R01.pdf`, `/docs/V2026_Paket_Karsilastirma-Q4-2025_R01.pdf` | Eski karşılaştırma PDF'leri `/2027/compare`'e taşındı |
| `/products/allplan-{basic,concept,professional,ultimate}`, `/products/civil`, `/products/precast` | `/package-overview` | “Sürümleri Görüntüle” hedefi `allplan.com/system/releasenotes/` (commit `567843c`) |
| `/` | Ürün ve hizmet bağlantıları (`/products/allplan-professional` vb.) | 2027 ana sayfa önizlemesi yeni ürün sekmeleri ve hero ile değiştirildi |

## D. Karar bekliyor

| Rota | Eksik hedef | Not |
|---|---|---|
| 17 ürün ve çözüm sayfası | `/solutions-v2/faq` | Canlıda sayfa sonunda SSS bağlantısı vardı; 27.10 sayfa sonu dönüşüm politikası bu bağlantıyı kaldırmış olabilir. Doğrulanmalı. |
| `/products/allplan-{aec,basic,concept,professional,ultimate}`, `/products/{ax3000,civil,precast,precast-detail}`, `/solutions/{architecture,bridge-design}` | `/paket-karsilastirma` | Karşılaştırma bağlantıları `/2027/compare`'e taşındıysa C'ye geçer; `/paket-karsilastirma` sayfası hâlâ 200 dönüyor |
| `/paket-karsilastirma` | 6 ürün sayfası bağlantısı | Tablo içi ürün bağlantıları |
| `/products` | `/products/allplan-2026`, `/products/allplan-2026-yenilikler`, `/solutions/allplan-bulut-hizmetleri` | “Ürün Ailesindeki Yenilikler” ve bulut bölümü CTA'ları |
| `/products/civil` | `/products/allplan-ultimate`, `/solutions/bridge-design`, `/solutions/modeling-of-precast-girder-bridges` | Bölüm içi bağlantılar |
| `/solutions/bridge-design` | `/solutions/features-allplan-bridge`, `/solutions/modeling-of-precast-girder-bridges` | Bölüm içi bağlantılar |
| `/products/allplan-professional` | `/products/allplan` | |
| `/products/ax3000` | `/products/ax3000/dokumanlar` | |
| `/solutions/mep` | `/products/ax3000`, `/products/ax3000/dokumanlar` | |
| `/solutions/bimx5` | `/solutions/imar-yonetmeligi-bim-eklentisi` | |
| `/solutions-v2/connect-license/how-to-assign`, `/solutions/allplan-industry`, `/solutions/imar-yonetmeligi-bim-eklentisi` | `/contact` | |
| `/gizlilik-politikasi` | `/kvkk` | Yasal sayfalar arası bağlantı |
| `/references` | `/` | |

Ham veri ve betik oturum scratchpad'inde tutuldu; repoya alınmadı.
