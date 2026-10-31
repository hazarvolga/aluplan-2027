import Link from 'next/link';
import { AluIcon } from '@/components/ui/AluIcon';

type InnovationCard = {
  id: string;
  title: string;
  description: string;
  image?: string | null;
  badge: string;
  href: string;
  linkLabel?: string;
};

type InnovationsSectionProps = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  cta: { label: string; href: string };
  cards: readonly InnovationCard[];
};

export function InnovationsSection({ id, eyebrow, title, description, cta, cards }: InnovationsSectionProps) {
  return (
    <section id={id} className="preview-section preview-section--subtle" aria-labelledby={`${id}-heading`}>
      <div className="alu-container alu-stack" style={{ gap: 'var(--space-stack-xl)' }}>
        <div className="preview-section-heading">
          <div className="alu-stack">
            <span className="preview-kicker">{eyebrow}</span>
            <h2 id={`${id}-heading`} className="alu-h1">{title}</h2>
            <p className="alu-body preview-meta">{description}</p>
          </div>
          <Link className="alu-button alu-button--primary alu-button--md" href={cta.href}>
            <span>{cta.label}</span><AluIcon name="arrow-right" size="sm" />
          </Link>
        </div>
        <div className="alu-innovations-showcase">
          {cards.map((card, index) => (
            <article key={card.id} className="alu-innovation-card">
              {card.image && <div className="alu-innovation-card__media">
                <img src={card.image} alt={card.title} loading="lazy" />
                <div className="alu-innovation-card__overlay">
                  <span className="alu-badge alu-badge--accent"><AluIcon name="sparkles" size="sm" /><span>{card.badge}</span></span>
                  <span className="alu-innovation-card__num">{String(index + 1).padStart(2, '0')}</span>
                </div>
              </div>}
              <div className="alu-innovation-card__body">
                <h3 className="alu-card__title">{card.title}</h3>
                <p className="alu-body">{card.description}</p>
                <Link className="alu-link alu-link--standalone" href={card.href} style={{ marginTop: 'auto' }}>
                  <span>{card.linkLabel ?? 'Özelliği İncele'}</span><AluIcon name="arrow-right" size="sm" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
