import { NextResponse } from 'next/server';
import { getHomepageData, SITE_ORIGIN } from '@/lib/site-data';
import { isAkademiEnabled, isReleaseContentEnabled } from '@/lib/release-flags';
import { listAkademiPages } from '@/lib/akademi-pages';
import { PUBLISHED_RELEASE_2027_ROUTES } from '@/lib/release-2027-routes';

const homepageData = getHomepageData();
const release2027Section = isReleaseContentEnabled()
  ? `
## 2027 Sürümleri (/2027)
${PUBLISHED_RELEASE_2027_ROUTES.map((route) => `- [${route.name}](${SITE_ORIGIN}${route.path}): ${route.description}`).join('\n')}
`
  : '';
// Akademi: overview, levels and series (lessons are reachable from the series pages).
const akademiSection = isAkademiEnabled()
  ? `
## Aluplan Akademi (/akademi): ücretsiz ALLPLAN Türkçe eğitim programı
${listAkademiPages()
    .filter((page) => page.kind === 'overview' || page.kind === 'level' || page.kind === 'series')
    .map((page) => `- [${page.title}](${SITE_ORIGIN}${page.path}): ${page.description}`)
    .join('\n')}
`
  : '';
const packageMatrixPeriod = homepageData.packageMatrixLabel.replace(' MATRİSİ', '');
const packageComparisonLine = isReleaseContentEnabled()
  ? `- [Paket Karşılaştırma](${SITE_ORIGIN}/paket-karsilastirma): Basic, Concept, Professional ve Ultimate sürümlerinin özellik karşılaştırması.`
  : `- [Paket Karşılaştırma Rehberi (${packageMatrixPeriod} PDF)](${SITE_ORIGIN}/paket-karsilastirma): Paketlerin teknik özellik karşılaştırması.`;

const LLMS_TXT_CONTENT = `# Aluplan Program Sistemleri — ALLPLAN Türkiye

> 1995'ten beri Türkiye'nin yetkili ALLPLAN distribütörü ve mühendislik çözüm ortağı. Mimari, inşaat mühendisliği (betonarme/çelik), köprü/altyapı, prekast beton üretimi ve MEP/enerji simülasyonu alanlarında BIM yazılımları, teknik destek ve eğitim hizmetleri sunar.

## Kurumsal Özet
- **Kuruluş:** 1995
- **Resmî Web Sitesi:** https://aluplan.com.tr
- **Merkez Ofis:** Quick Tower – Workinton, İçerenköy Mah. Topçu İbrahim Sok. 8/10D No: 5, 34752 Ataşehir / İstanbul
- **Telefonlar:** (+90) 216 225 84 41 | (+90) 543 211 94 42 | (+90) 549 499 73 79
- **E-posta:** info@aluplan.com.tr
- **Teknik Destek Portalı:** https://allplan.net.tr/tr
- **Resmî ALLPLAN Ücretsiz Deneme & Abonelik:** https://www.allplan.com/trial-or-subscription/
- **Teklif & Talep Formu:** https://forms.office.com/r/hXhnKAG912

## Ana Ürün Ailesi (/products)
- [ALLPLAN Ürün Ailesi](https://aluplan.com.tr/products): Tüm BIM ve CAD paketlerine genel bakış.
- [ALLPLAN Basic](https://aluplan.com.tr/products/allplan-basic): Temel 2B/3B tasarım, görüntüleme ve OpenBIM iş birliği.
- [ALLPLAN Concept](https://aluplan.com.tr/products/allplan-concept): 3B bina modelleme, pafta üretimi ve metraj.
- [ALLPLAN Professional](https://aluplan.com.tr/products/allplan-professional): Kapsamlı mimari ve strüktürel BIM, 3B betonarme donatı detaylandırma.
- [ALLPLAN Ultimate](https://aluplan.com.tr/products/allplan-ultimate): Çok disiplinli ileri seviye mühendislik, çelik, prekast ve zemin entegrasyonu.
- [ALLPLAN Civil](https://aluplan.com.tr/products/civil): Altyapı, karayolu ve parametrik köprü mühendisliği paketi.
- [ALLPLAN Precast](https://aluplan.com.tr/products/precast): Prefabrik beton eleman tasarımı, otomatik kalıp/donatı paftası ve ERP/MES üretimi.
- [ALLPLAN Cloud Services & Bimplus](https://aluplan.com.tr/products/allplan-cloud-services): Bulut tabanlı OpenBIM (IFC 4.3, BCF) ortak veri ortamı.
- [AX3000 MEP & Enerji](https://aluplan.com.tr/products/ax3000): ALLPLAN entegre mekanik tesisat (HVAC, sıhhi tesisat, ısıtma, elektrik, sprinkler) ve yapı fiziği/enerji simülasyonu.
- [SDS2 Çelik Detaylandırma](https://aluplan.com.tr/products/sds2-home): Çelik yapı detaylandırma, otomatik birleşim hesabı ve CNC/imalat.
${packageComparisonLine}

## Uzmanlık Çözümleri ve Eklentiler (/solutions)
- [Bina Tasarımı](https://aluplan.com.tr/cozumler/bina-tasarimi): Mimari (/solutions/architecture), Strüktürel (/solutions/structural), MEP (/solutions/mep) ve Endüstriyel tesis (/solutions/allplan-industry).
- [Altyapı Tasarımı](https://aluplan.com.tr/cozumler/altyapi-tasarimi): Altyapı (/solutions/infrastructure), Yol ve Demiryolu (/solutions/road-railway), ALLPLAN Bridge Köprü Tasarımı (/solutions/bridge-design).
- [İnşaat Planlaması](https://aluplan.com.tr/cozumler/insaat-planlamasi): Prekast Üretimi (/solutions/precast), Çelik (/solutions/steel), Şantiye Planlaması (/solutions/site-planning).
- [BIMFlex Otomatik Donatı Paketi](https://aluplan.com.tr/solutions/bimflex): FlexSoft AR-GE x Aluplan iş birliğiyle kolon, kiriş, perde, döşeme ve temel donatı otomasyonu.
- [İmar Yönetmeliği BIM Eklentisi](https://aluplan.com.tr/solutions/imar-yonetmeligi-bim-eklentisi): Planlı Alanlar İmar Yönetmeliği uyumlu otomatik BIM denetimi.
- [CDS Eklentileri](https://aluplan.com.tr/solutions/addons): 2B DWG Converter, Drive Curve, Parametric Terrain, Ramp ve Steel Components.
- [Allto PythonPart](https://aluplan.com.tr/solutions/pythonpart): ALLPLAN için PythonPart eklentileri.
- [Scalypso](https://aluplan.com.tr/solutions/scalypso): 3B lazer tarama ve nokta bulutu araçları.
- [BIMX5, Oska e-Hakediş & Poz Kataloğu](https://aluplan.com.tr/solutions/oska): 5B BIM metraj, yaklaşık maliyet ve Çevre Şehircilik poz entegrasyonu.

## Eğitim, Teknik Destek ve Kaynaklar
- [ALLPLAN QuickStart: Buildings](https://aluplan.com.tr/video-kutuphanesi/quickstart-buildings): Bina modelleme için hızlı başlangıç videoları.
- [Kaynaklar](https://aluplan.com.tr/kaynaklar): Eğitim, teknik destek ve lisans kaynakları.
- [Video Kütüphanesi (14 Seri / 216 Video)](https://aluplan.com.tr/video-kutuphanesi): Hello ALLPLAN 2024, Otomatik Donatı, Köprü İş Akışları, Yol Tasarımı, AX3000, Prekast ve SDS2 eğitim videoları.
- [Sıkça Sorulan Sorular (SSS)](https://aluplan.com.tr/faq): Lisans, kurulum, sistem gereksinimleri ve OpenBIM veri değişimi.
- [Referanslar](https://aluplan.com.tr/references): Kamu kurumları, belediyeler, üniversiteler ve mühendislik/mimarlık ofisleri.
${akademiSection}${release2027Section}`;

export async function GET() {
  return new NextResponse(LLMS_TXT_CONTENT, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600'
    }
  });
}
