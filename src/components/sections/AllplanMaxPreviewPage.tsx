import content from '@/data/allplan-max-preview.json';
import { MAIN_QUOTE_FORM_URL, TRIAL_CTA_URL } from '@/lib/site-shared';
import styles from './AllplanMaxPreviewPage.module.css';
import { AllplanMaxVideo } from './AllplanMaxVideo';
import { PreviewClosingSection } from './PreviewClosingSection';
import { AllplanMaxFeatureClip } from './AllplanMaxFeatureClip';
import { IntroSplitSection } from './IntroSplitSection';
import { CustomerTestimonials } from './CustomerTestimonials';
import { ProductHero } from './ProductHero';

const records: Record<string, { en: string; tr: string }> = content;
const text = (key: string) => records[`live.max.${key}`]?.tr ?? '';
const mainFeatures = [
  { key: 'fb', video: 'ARHTE2-CaWk', clip: 'AI-Feature-Builder_08Cut.mp4' },
  { key: 'wb', video: '8ROtkolkemM', clip: 'AI-Workflow-Builder_09cut.mp4' },
  { key: 'bim', video: 'RSwNnc8XvbQ', clip: 'AI-Bim-Analyst_02Cut.mp4' }
];
const moreFeatures = [
  { key: 'fw', video: 'L2YcuH3PQWw', image: 'csm_AI_Formula_Writer_-_Best_Example_a1d355686c.png' },
  { key: 'sa', video: 'CIgKvrD7QhQ', image: 'csm_AI_StructuralAnalyst_83493afb3c.png' },
  { key: 'dr', video: 'zQDWJh9rCsA', image: 'csm_AI_Drafter_Final_a89c4205be.png' },
  { key: 'bm', video: 'kNxP71mPnFM', image: 'csm_AI_BIM_Modeler4_4a3a8d2e3f.png' },
  { key: 'vz', video: 'ypS7tjRB6rs', image: 'csm_AI_Visualizer_Before_and_After_384986ee1d.png' },
  { key: 'co', video: 'vFk7oUru2bg', image: 'csm_AI_Coach_final_0bd4132638.png' }
];

export function AllplanMaxPreviewPage() {
  return <main id="main-content" className={styles.page}>
    <ProductHero eyebrow="Allplan Max" title={text('hero.title')} description={text('hero.body')} image="/assets/previews/home-2027/allplan-max-generated-v2.jpg" actions={[{ label: 'Demo talep edin ↗', href: MAIN_QUOTE_FORM_URL, variant: 'primary' }, { label: 'Ücretsiz deneme ↗', href: TRIAL_CTA_URL, variant: 'secondary' }]} />
    <IntroSplitSection eyebrow="ALLPLAN MAX" title={text('detail.title')} description={text('detail.body')}
      factsTitle={text('detail.list-title')} facts={[text('detail.bullet-1'), text('detail.bullet-2')]}
      action={{ label: 'Ücretsiz deneme ↗', href: TRIAL_CTA_URL }} />
    <section className={`alu-container ${styles.videoSection}`}><video controls preload="none" poster="/assets/previews/home-2027/allplan-max-generated-v2.jpg" playsInline aria-label="ALLPLAN Max tanıtım videosu"><source src="/assets/previews/allplan-max/Allplan_Max_2027_FINAL_1080p.mp4" type="video/mp4" />Tarayıcınız video oynatmayı desteklemiyor. <a href="/assets/previews/allplan-max/Allplan_Max_2027_FINAL_1080p.mp4">Videoyu indirin</a>.</video></section>
    <section className={styles.band}><div className={`alu-container ${styles.section}`}><h2 className={styles.eyebrow}>ALLPLAN · {text('survey.title')}</h2><div className={`alu-hero-metrics ${styles.surveyMetrics}`}>{[1,2,3].map(n => {
      const stat = text(`pillar-${n}.stat`);
      const match = stat.match(/^(%\d+)\s+(.+)$/);
      return <article className="alu-hero-metrics__item" key={n}>
        <span className="alu-hero-metrics__value">{match ? match[1] : stat}</span>
        {match && <span className="alu-hero-metrics__label">{match[2]}</span>}
        <h3 className={styles.surveyHeading}>{text(`pillar-${n}.heading`)}</h3>
        <p className="alu-hero-metrics__note">{text(`pillar-${n}.body`)}</p>
      </article>;
    })}</div></div></section>
    <section className={`alu-container ${styles.section}`}><p className={styles.eyebrow}>ÖNE ÇIKAN ÖZELLİKLER</p><h2>{text('3feat.title')}</h2><div className={styles.featureList}>{mainFeatures.map(({key,video,clip}) => <article className={styles.feature} key={key}><div className={styles.featureText}><p className={styles.eyebrow}>{text(`3feat.${key}.included`)}</p><h3>{text(`3feat.${key}.title`)}</h3><p>{text(`3feat.${key}.body`)}</p><div className={styles.featureActions}><AllplanMaxVideo id={video} title={text(`3feat.${key}.title`)} /><a href={MAIN_QUOTE_FORM_URL} aria-label={`Demo talep edin: ${text(`3feat.${key}.title`)}`}>Demo talep edin ↗</a></div></div><AllplanMaxFeatureClip src={`/assets/previews/allplan-max/${clip}`} title={text(`3feat.${key}.title`)} /></article>)}</div></section>
    <CustomerTestimonials title={text('quotes.title')} items={[1, 2, 3].map(n => {
      const [name, role] = text(`quote-${n}.attribution`).split(' — ');
      return { name, role, quote: text(`quote-${n}`), source: 'Kaynak: ALLPLAN' };
    })} />
    <section className={`alu-container ${styles.section}`}><p className={styles.eyebrow}>YAPAY ZEKÂ ARAÇLARI</p><h2>{text('more.title')}</h2><div className={styles.cards}>{moreFeatures.map(({key,video,image}) => <article className={styles.card} key={key}><img className={styles.featureImage} src={`/assets/previews/allplan-max/${image}`} alt={`${text(`more.${key}.title`)} — ALLPLAN ürün görseli`} loading="lazy" /><h3>{text(`more.${key}.title`)}</h3><p>{text(`more.${key}.body`)}</p>{video && <AllplanMaxVideo id={video} title={text(`more.${key}.title`)} />}<p className={styles.productRibbon}>{text(`more.${key}.included`)}</p></article>)}</div></section>
    <PreviewClosingSection id="max-closing-title" title={text('cta.title')} items={['expert', 'trial'].map(key => ({
      title: text(`cta.${key}.title`), paragraphs: [text(`cta.${key}.body`)],
      action: { href: key === 'trial' ? TRIAL_CTA_URL : MAIN_QUOTE_FORM_URL, label: text(`cta.${key}.cta`) }
    }))} />
  </main>;
}
