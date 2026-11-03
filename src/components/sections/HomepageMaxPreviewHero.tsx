import { MAIN_QUOTE_FORM_URL } from '@/lib/site-shared';
import { AluIcon } from '@/components/ui/AluIcon';
import content from '@/data/homepage-2027-preview.json';

// Source and translation status are recorded in the preview content data.
export function HomepageMaxPreviewHero() {
  return (
    <section className="alu-hero-stage alu-max-preview-hero" aria-labelledby="hero-title">
      <picture className="alu-hero-stage__backdrop" aria-hidden="true">
        <img className="alu-max-preview-hero__image" src="/assets/previews/home-2027/allplan-max-ai-concept.jpg" alt="" fetchPriority="high" />
      </picture>
      <div className="alu-hero-stage__scrim" aria-hidden="true" />
      <div className="alu-container alu-hero-stage__inner">
        <div className="alu-stack" style={{ gap: 'var(--space-stack-lg)' }}>
          <p className="alu-max-preview-hero__eyebrow">{content.eyebrow}</p>
          <h1 id="hero-title" className="alu-h2 alu-hero-stage__title alu-max-preview-hero__title">{content.titleLines.map((line, index) => <span key={line}>{index > 0 && <br />}{line}</span>)}</h1>
          <p className="alu-body-lg alu-hero-stage__lead">{content.description}</p>
          <div className="alu-cluster" role="group" aria-label="Ana eylemler">
            <a className="alu-button alu-button--primary alu-button--md" href={content.primaryHref}>
              <span>{content.primaryLabel}</span><AluIcon name="arrow-right" size="sm" />
            </a>
            <a className="alu-button alu-button--secondary alu-button--md" href={MAIN_QUOTE_FORM_URL} target="_blank" rel="noopener noreferrer">
              <span>{content.secondaryLabel}</span><AluIcon name="external-link" size="sm" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
