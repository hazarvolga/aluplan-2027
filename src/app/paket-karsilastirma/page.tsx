import { DebugComponentLabel } from '@/components/sections/DebugComponentLabel';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ComparisonTable } from './ComparisonTable';
import styles from './page.module.css';
import { isReleaseContentEnabled } from '@/lib/release-flags';
import { buildRelease2027JsonLd, buildRelease2027Metadata } from '@/lib/release-2027-routes';
import { buildPageJsonLd, serializeJsonLd } from '@/lib/schema';
import { buildPageMetadata } from '@/lib/metadata';
import { getPageData, getPlaylistData } from '@/lib/site-data';
import { SubpageView } from '@/components/sections/SubpageView';
import { CompactPageHero } from '@/components/sections/CompactPageHero';
import { SectionHeader } from '@/components/sections/SectionHeader';
import { AluIcon } from '@/components/ui/AluIcon';

export function generateMetadata(): Metadata {
  return isReleaseContentEnabled() ? buildRelease2027Metadata('/paket-karsilastirma') : buildPageMetadata('/paket-karsilastirma');
}
const editions = [
 {name:'Basic',description:'Çizimler ve basit 3B modeller oluşturmak için yalnızca sektör bağımsız işlevleri içeren başlangıç çözümüdür. Sonrasında sektöre özel bir çözüme yükseltme önerilir.',href:'/products/allplan-basic'},
 {name:'Concept',description:'Mimarlık ofisleri ve gayrimenkul geliştiricileri için bina tasarımında gerekli işlevleri içerir; kamu kurumları ve MEP mühendisleri için platform olarak da uygundur.',href:'/products/allplan-concept'},
 {name:'Professional',description:'Mühendislik ve mimarlık ofisleri, yapı detaylandırmacıları ve yükleniciler için bina, yol ve altyapı yapılarının tasarım ve detaylandırmasında gerekli tüm işlevleri içerir. Kamu kurumları ve MEP mühendisleri için platform olarak da uygundur.',href:'/products/allplan-professional'},
 {name:'Ultimate',description:'Çok disiplinli tasarım ofisleri, tasarla-yap inşaat şirketleri ve kamu kurumları için bina, yol ve altyapı yapılarının tasarım, detaylandırma ve inşaatına yönelik tüm ilgili işlevleri içeren eksiksiz çözümdür. Kamu kurumları ve MEP mühendisleri için platform olarak da uygundur.',href:'/products/allplan-ultimate'}
];
function Compare2027(){
 return <div className={styles.page}><DebugComponentLabel name="CompactPageHero"><CompactPageHero kicker="ALLPLAN · 2027" title="ALLPLAN sürümlerini karşılaştırın" lead="Basic, Concept, Professional ve Ultimate sürümlerinin özelliklerini karşılaştırın."><p className={styles.notice}>Sürüm bağlantıları mevcut yerel ürün sayfalarına gider.</p></CompactPageHero></DebugComponentLabel>
 <section className={styles.docDownload} aria-label="Paket karşılaştırma tablosu (PDF)"><div className="alu-container"><a className={styles.docCard} href="/docs/V2026_paket-karsilastirma-Q3-2026_R01.pdf" download><span className={styles.docIcon} aria-hidden="true"><AluIcon name="file-text" /></span><span className={styles.docBody}><strong className={styles.docTitle}>ALLPLAN 2026 Paket Karşılaştırma Tablosu</strong><span className={styles.docMeta}>PDF · Q3 2026 · R01 · ~270 KB · Basic · Concept · Professional · Ultimate</span></span><span className={styles.docCta}><AluIcon name="download" size="sm" /><span>PDF İndir</span></span></a></div></section>
 <div className="alu-container">
 <p className={styles.footnote}>✓ Dâhil · — Kaynakta dâhil olarak işaretlenmemiş · İsteğe bağlı. Mobilde tabloyu yatay kaydırabilirsiniz.</p>
 <DebugComponentLabel name="ComparisonTable"><ComparisonTable editions={editions} /></DebugComponentLabel><p className={styles.footnote}>** ALLPLAN abonelik lisanslarına dâhildir. *** ALLPLAN Model Viewer, ALLPLAN aboneliği veya Bimplus Professional satın alımıyla kullanılabilir.</p>
 <DebugComponentLabel name="editionLinks (özel)"><section className={styles.editions}><SectionHeader kicker="/ SÜRÜMLER" title="İhtiyacınıza uygun sürümü keşfedin" /><div>{editions.map(e=><article key={e.name}><h3>ALLPLAN {e.name}</h3><p>{e.description}</p><a href={e.href} aria-label={`Sürümü incele: ALLPLAN ${e.name}`}>Sürümü incele ↗</a></article>)}</div></section></DebugComponentLabel></div></div>;
}

// With the 2027 release off, this URL keeps serving the existing package comparison page.
function LegacyPackageComparison() {
  const page = getPageData('/paket-karsilastirma');
  if (!page) notFound();
  const playlist = page.playlistId ? getPlaylistData(page.playlistId) : null;
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(buildPageJsonLd(page, playlist)) }} />
      <SubpageView page={page} playlist={playlist} />
    </>
  );
}

export default function PackageComparisonPage() {
  if (!isReleaseContentEnabled()) return <LegacyPackageComparison />;
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(buildRelease2027JsonLd('/paket-karsilastirma')) }} />
      <Compare2027 />
    </>
  );
}
