import { MAIN_QUOTE_FORM_URL } from '@/lib/site-shared';
import { AluIcon } from '@/components/ui/AluIcon';
import styles from './HomepageMaxPreviewHero.module.css';
import { HeroBottomLine } from './HeroBottomLine';
export function HomepageMaxPreviewHero() {
  return (
    <section className="alu-hero-stage alu-max-preview-hero" aria-labelledby="hero-title">
      <picture className="alu-hero-stage__backdrop" aria-hidden="true">
        <source type="image/webp" srcSet="/assets/previews/home-2027/allplan-max-ai-concept.webp" />
        <img className={`alu-max-preview-hero__image ${styles.imageMotion}`} src="/assets/previews/home-2027/allplan-max-ai-concept.jpg" alt="" fetchPriority="high" />
      </picture>
      <div className="alu-hero-stage__scrim" aria-hidden="true" />
      <div className="alu-container alu-hero-stage__inner">
        <div className="alu-stack" style={{ gap: 'var(--space-stack-lg)' }}>
          <p className="alu-max-preview-hero__eyebrow">2027 ÇIKTI · ALLPLAN'IN EN GÜÇLÜ SÜRÜMÜ</p>
          <h1 id="hero-title" className="alu-h2 alu-hero-stage__title alu-max-preview-hero__title">Mühendislik yeniden tanımlanıyor</h1>
          <p className="alu-body-lg alu-hero-stage__lead">Yapay zekâ, parametrik tasarım ve çoklu disiplin desteğiyle donatılmış ALLPLAN 2027 artık kullanıma hazır. Yeni dönemi başlatın.</p>
          <div className="alu-cluster" role="group" aria-label="Ana eylemler">
            <a className="alu-button alu-button--primary alu-button--md" href="#solutions">
              <span>Çözümleri keşfedin</span><AluIcon name="arrow-right" size="sm" />
            </a>
            <a className="alu-button alu-button--secondary alu-button--md" href="#products">
              <span>Ürünleri keşfedin</span><AluIcon name="arrow-right" size="sm" />
            </a>
            <a className="alu-button alu-button--secondary alu-button--md" href={MAIN_QUOTE_FORM_URL} target="_blank" rel="noopener noreferrer">
              <span>Teklif İste</span><AluIcon name="external-link" size="sm" />
            </a>
          </div>
        </div>
      </div>
      <HeroBottomLine />
    </section>
  );
}
