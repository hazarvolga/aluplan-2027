import { DebugComponentLabel } from '@/components/sections/DebugComponentLabel';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ProjectCarousel } from '@/components/sections/ProjectCarousel';
import { CapabilityAccordion } from '@/components/sections/CapabilityAccordion';
import { ProductHero } from '@/components/sections/ProductHero';
import { PreviewClosingSection } from '@/components/sections/PreviewClosingSection';
import { MAIN_QUOTE_FORM_URL } from '@/lib/site-data';
import { ProductContentSection, ProductEditionsBand, ProductFaq, ProductTabNav } from '@/components/sections/ProductPageParts';
import { isReleaseContentEnabled } from '@/lib/release-flags';
import { buildRelease2027JsonLd, buildRelease2027Metadata } from '@/lib/release-2027-routes';
import { serializeJsonLd } from '@/lib/schema';

export function generateMetadata(): Metadata {
  return buildRelease2027Metadata('/products/scia');
}
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
function SciaPage(){
 if(!isReleaseContentEnabled()) notFound();
 return <div><div id="scia-top"><DebugComponentLabel name="ProductHero"><ProductHero eyebrow="SCIA" title="Yapı analizi ve tasarım" description="SCIA, bina, altyapı ve karmaşık taşıyıcı sistemler üzerinde çalışan mühendisler için yapı analizi ve tasarım araçları sunar." image="/assets/previews/frilo/frilo-hero.jpg" actions={[{label:'Teklif isteyin ↗',href:MAIN_QUOTE_FORM_URL,variant:'primary'}]} /></DebugComponentLabel></div>
 <DebugComponentLabel name="ProductEditionsBand"><ProductEditionsBand title="SCIA sürümleri" editions={editions}/></DebugComponentLabel>
 <DebugComponentLabel name="ProductTabNav"><ProductTabNav label="SCIA sayfa bölümleri" links={[{href:'#scia-top',label:'SCIA'},{href:'#scia-capabilities',label:'Yetenekler'},{href:'#scia-stories',label:'Başarı hikâyeleri'},{href:'#scia-faq',label:'Sık sorulan sorular'}]} /></DebugComponentLabel>
 <div className="alu-container alu-stack"><DebugComponentLabel name="ProductContentSection"><ProductContentSection id="scia-capabilities" kicker="SCIA · YETENEKLER" title="Öne çıkan yetenekler"><CapabilityAccordion items={capabilities.map(([title, description], index) => ({ title, description, image: `/assets/previews/scia/capability-${index + 1}.jpg`, alt: `SCIA arayüzü: ${title}` }))} /></ProductContentSection></DebugComponentLabel>
 </div><DebugComponentLabel name="ProjectCarousel"><ProjectCarousel id="scia-stories" eyebrow="SCIA · PROJELER" title="Müşteri projeleri" projects={[['Sky Park Residence','Bratislava, Slovakya','sky-park-residence'],['Demiryolu sahası üzerindeki yaya köprüsü','Çekya','pedestrian-bridge-over-railway-yard'],['Albert Square cam kubbesi','Belçika','showcase-project-glass-dome-albert-square-knokke'],['Palais Garnier','Fransa','palais-garnier-where-culture-and-technology-meet'],['Teleferik kafes kulesi','Avusturya','ropeway-lattice-tower'],['Çok amaçlı spor salonu','Çekya','multi-functional-sports-hall']].map(([title, location, slug], index) => ({title, location, href: `https://www.scia.net/en/user-stories/${slug}`, image: `/assets/previews/scia/story-${index + 1}.jpg`, alt: `${title} projesi`}))} /></DebugComponentLabel>
 <div className="alu-container alu-stack"> <DebugComponentLabel name="ProductFaq"><ProductFaq id="scia-faq" kicker="SCIA · SSS" items={faq} /></DebugComponentLabel></div>
 <DebugComponentLabel name="PreviewClosingSection"><PreviewClosingSection id="scia-closing" title="SCIA hakkında görüşelim" items={[{title:'Uzmanla görüşün',paragraphs:['Projelerinize ve ekibinize uygun SCIA sürümü hakkında bilgi alın.'],action:{label:'Teklif isteyin',href:MAIN_QUOTE_FORM_URL}},{title:'SCIA’yı deneyin',paragraphs:['SCIA’yı 30 gün ücretsiz deneyin. Deneme, değerlendirme ve ticari olmayan kullanım içindir; iptal gerektirmez.'],action:{label:'Ücretsiz deneme',href:'https://www.scia.net/en/forms/scia-engineer-trial-request'}}]} /></DebugComponentLabel>
 </div>;
}

export default function Release2027Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(buildRelease2027JsonLd('/products/scia')) }} />
      <SciaPage />
    </>
  );
}
