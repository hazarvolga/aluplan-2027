import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ComparisonTable } from './ComparisonTable';
import styles from './page.module.css';
export const metadata: Metadata = {title:'ALLPLAN 2027 sürüm karşılaştırması | Yerel inceleme',robots:{index:false,follow:false,nocache:true}};
const editions = [
 {name:'Basic',description:'Çizimler ve basit 3B modeller oluşturmak için yalnızca sektör bağımsız işlevleri içeren başlangıç çözümüdür. Sonrasında sektöre özel bir çözüme yükseltme önerilir.',href:'/products/allplan-basic'},
 {name:'Concept',description:'Mimarlık ofisleri ve gayrimenkul geliştiricileri için bina tasarımında gerekli işlevleri içerir; kamu kurumları ve MEP mühendisleri için platform olarak da uygundur.',href:'/products/allplan-concept'},
 {name:'Professional',description:'Mühendislik ve mimarlık ofisleri, yapı detaylandırmacıları ve yükleniciler için bina, yol ve altyapı yapılarının tasarım ve detaylandırmasında gerekli tüm işlevleri içerir. Kamu kurumları ve MEP mühendisleri için platform olarak da uygundur.',href:'/products/allplan-professional'},
 {name:'Ultimate',description:'Çok disiplinli tasarım ofisleri, tasarla-yap inşaat şirketleri ve kamu kurumları için bina, yol ve altyapı yapılarının tasarım, detaylandırma ve inşaatına yönelik tüm ilgili işlevleri içeren eksiksiz çözümdür. Kamu kurumları ve MEP mühendisleri için platform olarak da uygundur.',href:'/products/allplan-ultimate'}
];
export default function Compare2027(){
 if(process.env.NODE_ENV === 'production') notFound();
 return <div className={styles.page}><div className="alu-container"><header className={styles.hero}><p className="preview-kicker">ALLPLAN · 2027</p><h1>ALLPLAN sürümlerini karşılaştırın</h1><p>Basic, Concept, Professional ve Ultimate sürümlerinin özelliklerini karşılaştırın.</p><p className={styles.notice}>Bu yerel inceleme, uluslararası üretici sayfasına dayanır. Türkiye paket kapsamı ve koşulları doğrulanmalıdır. Sürüm bağlantıları mevcut yerel ürün sayfalarına gider.</p></header>
 <p className={styles.footnote}>✓ Dâhil · — Kaynakta dâhil olarak işaretlenmemiş · İsteğe bağlı. Mobilde tabloyu yatay kaydırabilirsiniz.</p>
 <ComparisonTable editions={editions} /><p className={styles.footnote}>** ALLPLAN abonelik lisanslarına dâhildir. *** ALLPLAN Model Viewer, ALLPLAN aboneliği veya Bimplus Professional satın alımıyla kullanılabilir.</p>
 <section className={styles.editions}><p className="preview-kicker">/ SÜRÜMLER</p><h2>İhtiyacınıza uygun sürümü keşfedin</h2><div>{editions.map(e=><article key={e.name}><h3>ALLPLAN {e.name}</h3><p>{e.description}</p><a href={e.href}>Sürümü incele ↗</a></article>)}</div></section></div></div>;
}
