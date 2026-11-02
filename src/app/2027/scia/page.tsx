import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ProjectCarousel } from '@/components/sections/ProjectCarousel';
import { CapabilityAccordion } from '@/components/sections/CapabilityAccordion';
import { ProductHero } from '@/components/sections/ProductHero';
import { EditionCards } from '@/components/sections/EditionCards';
import { PreviewClosingSection } from '@/components/sections/PreviewClosingSection';
import { MAIN_QUOTE_FORM_URL } from '@/lib/site-data';
import styles from '@/app/preview/frilo/hero.module.css';

export const metadata: Metadata = { title: 'SCIA | Yerel inceleme', robots: { index: false, follow: false, nocache: true } };
const editions = [
 {title:'SCIA Concept', items:['Yapısal modelleme ve analiz','Beton, çelik ve ahşap için temel tasarım iş akışları','Stabilite ve dinamik analiz araçları','BIM uyumlu model alışverişi','Gelişmiş doğrusal olmayan analiz']},
 {title:'SCIA Professional', items:['Çok malzemeli tasarım iş akışları','Parametrik modelleme araçları','Gelişmiş yük oluşturma','Zemin–yapı etkileşimi analizi','Genişletilmiş BIM entegrasyonları']},
 {title:'SCIA Ultimate', items:['Gelişmiş doğrusal olmayan yapı analizi','Akıllı ağ oluşturma ve yüksek performanslı analiz','İnşaat aşaması simülasyonu','Yapısal tasarım için optimizasyon araçları','Genişletilmiş mühendislik entegrasyonları']},
];
const capabilities = [
 ['Doğru yapısal modeller','Yapı analizi modellerini doğrudan oluşturun veya BIM modellerini analize hazır geometriye dönüştürün. Çerçeveler, yüzeyler ve gerçek yapı davranışını yansıtan taşıyıcı sistemler tanımlayın.'],
 ['Güvenilir mühendislik analizi','Yapıların yükler ve tasarım koşulları altındaki davranışını anlamak için doğrusal, doğrusal olmayan, stabilite ve dinamik analiz araçlarını kullanın.'],
 ['Otomatik proje çıktıları ve yönetmeliklere uygun tasarım','Betonarme, çelik, ahşap ve diğer yapı malzemelerini uluslararası mühendislik standartlarına uygun entegre tasarım kontrolleri ve hesap araçlarıyla tasarlayın.'],
 ['Birden fazla malzemeyle tasarım','Beton, çelik, ahşap, alüminyum, yığma ve kompozit yapıları tek bir mühendislik ortamında analiz edin ve tasarlayın.'],
];
const faq = [
 ['Sürümler arasındaki fark nedir?','Concept günlük projeler için temel yapısal modelleme ve analize odaklanır. Professional gelişmiş iş akışları, çok malzemeli tasarım ve genişletilmiş analiz sunar. Ultimate karmaşık yapılar için en kapsamlı analiz araçlarını içerir.'],
 ['BIM iş akışlarını destekler mi?','Evet. SCIA, openBIM iş akışlarını ve Allplan, SDS2, Revit ve Tekla gibi platformlarla entegrasyonu destekler. Modeller IFC ve SAF biçimlerinde paylaşılabilir.'],
 ['Hangi sektörlerde kullanılır?','Yapı mühendisliği ofisleri, altyapı tasarımcıları, endüstriyel mühendislik ekipleri ve çok disiplinli AEC kuruluşları tarafından bina, köprü, endüstriyel tesis ve karmaşık yapı projelerinde kullanılır.'],
 ['Sürümler arasında yükseltme yapılabilir mi?','Evet. Ekipler, projeleri karmaşıklaştıkça veya gelişmiş analiz ihtiyaçları arttıkça daha üst sürümlere geçebilir.'],
];
export default function SciaPage(){
 if(process.env.NODE_ENV === 'production' && process.env.ALUPLAN_2027_PREVIEW !== '1') notFound();
 return <div><div id="scia-top"><ProductHero eyebrow="SCIA" title="Yapı analizi ve tasarım" description="SCIA, bina, altyapı ve karmaşık taşıyıcı sistemler üzerinde çalışan mühendisler için yapı analizi ve tasarım araçları sunar." image="/assets/previews/frilo/frilo-hero.jpg" actions={[{label:'Teklif isteyin ↗',href:MAIN_QUOTE_FORM_URL,variant:'primary'}]} /></div>
 <div className={styles.editionsSection}><div className="alu-container"><EditionCards title="SCIA sürümleri" editions={editions}/></div></div>
 <div className={styles.navigationSection}><nav className={`alu-container ${styles.tabList}`} aria-label="SCIA sayfa bölümleri"><a href="#scia-top">SCIA</a><a href="#scia-capabilities">Yetenekler</a><a href="#scia-stories">Başarı hikâyeleri</a><a href="#scia-faq">Sık sorulan sorular</a></nav></div>
 <div className="alu-container alu-stack"><section id="scia-capabilities" className={styles.contentSection}><p className={styles.kicker}>SCIA · YETENEKLER</p><h2>Öne çıkan yetenekler</h2><CapabilityAccordion items={capabilities.map(([title, description], index) => ({ title, description, image: `/assets/previews/scia/capability-${index + 1}.jpg`, alt: `SCIA arayüzü: ${title}` }))} /></section>
 </div><ProjectCarousel id="scia-stories" eyebrow="SCIA · PROJELER" title="Müşteri projeleri" projects={[['Sky Park Residence','Bratislava, Slovakya','sky-park-residence'],['Demiryolu sahası üzerindeki yaya köprüsü','Çekya','pedestrian-bridge-over-railway-yard'],['Albert Square cam kubbesi','Belçika','showcase-project-glass-dome-albert-square-knokke'],['Palais Garnier','Fransa','palais-garnier-where-culture-and-technology-meet'],['Teleferik kafes kulesi','Avusturya','ropeway-lattice-tower'],['Çok amaçlı spor salonu','Çekya','multi-functional-sports-hall']].map(([title, location, slug], index) => ({title, location, href: `https://www.scia.net/en/user-stories/${slug}`, image: `/assets/previews/scia/story-${index + 1}.jpg`, alt: `${title} projesi`}))} />
 <div className="alu-container alu-stack"> <section id="scia-faq" className={`${styles.contentSection} ${styles.faq}`}><p className={styles.kicker}>SCIA · SSS</p><h2>Sık sorulan sorular</h2>{faq.map(([q,a])=><details key={q}><summary>{q}</summary><p>{a}</p></details>)}</section></div>
 <PreviewClosingSection id="scia-closing" title="SCIA hakkında görüşelim" items={[{title:'Uzmanla görüşün',paragraphs:['Projelerinize ve ekibinize uygun SCIA sürümü hakkında bilgi alın.'],action:{label:'Teklif isteyin',href:MAIN_QUOTE_FORM_URL}},{title:'SCIA’yı deneyin',paragraphs:['SCIA’yı 30 gün ücretsiz deneyin. Deneme, değerlendirme ve ticari olmayan kullanım içindir; iptal gerektirmez.'],action:{label:'Ücretsiz deneme',href:'https://www.scia.net/en/forms/scia-engineer-trial-request'}}]} />
 </div>;
}
