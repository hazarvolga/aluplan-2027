'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CompactPageHero } from './CompactPageHero';
import { FeatureRow, FeatureRowList } from './FeatureRow';
import { PreviewClosingSection } from './PreviewClosingSection';
import { SectionHeader } from './SectionHeader';
import { handleStructuredTabKey } from './structured-tab-key';
import { AluIcon } from '@/components/ui/AluIcon';
import { TRIAL_CTA_URL } from '@/lib/site-shared';
import {
  RELEASE_NOTES_2027,
  type ReleaseNoteItem,
  type ReleaseNoteSection,
  type ReleaseNoteVersion
} from '@/data/release-notes-2027';
import styles from './ReleaseNotes2027View.module.css';

interface FlatReleaseItem extends ReleaseNoteItem {
  categoryLabel: string;
}

function flattenSectionItems(section: ReleaseNoteSection): FlatReleaseItem[] {
  const items: FlatReleaseItem[] = [];
  for (const sub of section.subsections) {
    const fallbackLabel = sub.groupLabel || sub.heading || section.tabLabel;
    for (const item of sub.items) {
      items.push({
        ...item,
        categoryLabel: item.ribbon || fallbackLabel
      });
    }
  }
  return items;
}

function ReleaseSectionBlock({ section }: { section: ReleaseNoteSection }) {
  const allItems = flattenSectionItems(section);
  const featuredItems = allItems.filter((item) => Boolean(item.image || item.video));
  const additionalItems = allItems.filter((item) => !item.image && !item.video);

  return (
    <div className={styles.group}>
      <SectionHeader
        id={`heading-${section.id}`}
        kicker={section.tabSubtitle}
        title={section.heading}
        lead={section.intro}
      />

      {featuredItems.length > 0 && (
        <div className={styles.featureListWrap}>
          <FeatureRowList>
            {featuredItems.map((item, itemIndex) => (
              <FeatureRow
                key={`${section.id}-feat-${itemIndex}`}
                index={itemIndex}
                kicker={item.categoryLabel}
                title={item.title || section.tabLabel}
                mediaFit="contain"
                media={
                  item.video ? (
                    <video
                      controls
                      preload="metadata"
                      playsInline
                      poster={item.poster}
                      aria-label={`${item.title || section.tabLabel} önizleme videosu`}
                    >
                      <source src={item.video} type="video/mp4" />
                      Tarayıcınız video oynatmayı desteklemiyor.
                    </video>
                  ) : (
                    <img
                      src={item.image}
                      alt={`${item.title || section.tabLabel} — ALLPLAN 2027 ekran görüntüsü`}
                      loading="lazy"
                    />
                  )
                }
              >
                <p>{item.body}</p>
                {item.extraParagraphs?.map((paragraph, pIndex) => (
                  <p key={pIndex}>{paragraph}</p>
                ))}
                {item.notice && (
                  <div className={styles.notice} role="note">
                    <p className={styles.noticeLabel}>{item.notice.label}</p>
                    <p className={styles.noticeBody}>{item.notice.body}</p>
                  </div>
                )}
              </FeatureRow>
            ))}
          </FeatureRowList>
        </div>
      )}

      {additionalItems.length > 0 && (
        <div className={styles.improvements}>
          <SectionHeader as="h3" title={`Diğer iyileştirmeler (${additionalItems.length})`} />
          <div className={styles.detailsGroup}>
            {additionalItems.map((item, itemIndex) => (
              <details key={`${section.id}-add-${itemIndex}`} open={Boolean(item.notice)}>
                <summary>
                  <span className={styles.detailsSummaryText}>
                    <span>{item.title || item.categoryLabel}</span>
                    {item.title && <span className={styles.detailsTag}>{item.categoryLabel}</span>}
                  </span>
                </summary>
                <div className={styles.detailsBody}>
                  <p>{item.body}</p>
                  {item.extraParagraphs?.map((paragraph, pIndex) => (
                    <p key={pIndex}>{paragraph}</p>
                  ))}
                  {item.notice && (
                    <div className={styles.notice} role="note">
                      <p className={styles.noticeLabel}>{item.notice.label}</p>
                      <p className={styles.noticeBody}>{item.notice.body}</p>
                    </div>
                  )}
                </div>
              </details>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function ReleaseNotes2027DetailView({ release }: { release: ReleaseNoteVersion }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const tabs = [
    { id: 'tumu', label: 'Tümü', subtitle: `${release.sections.length} Kategori` },
    ...release.sections.map((section) => ({
      id: section.id,
      label: section.tabLabel,
      subtitle: section.tabSubtitle
    }))
  ];
  const visibleSections = activeIndex === 0 ? release.sections : [release.sections[activeIndex - 1]];
  const activeTab = tabs[activeIndex];

  return (
    <div className={styles.page}>
      <CompactPageHero title={release.title} lead={release.tagline}>
        <div className={styles.heroMeta}>
          <span className={styles.versionBadge}>{release.label}</span>
          <span className={styles.releaseDate}>Yayın tarihi: {release.releaseDate}</span>
        </div>
        <p className={styles.heroText}>{release.subtitle}</p>
        <p className={styles.heroText}>{release.intro}</p>
        <div className={styles.actions}>
          <a className="alu-button alu-button--primary alu-button--md" href={TRIAL_CTA_URL} target="_blank" rel="noopener noreferrer">
            <span>Ücretsiz deneme</span>
            <AluIcon name="external-link" size="sm" />
          </a>
          <Link className="alu-button alu-button--secondary alu-button--md" href="/2027/features">
            <span>ALLPLAN 2027 Yenilikleri</span>
            <AluIcon name="arrow-right" size="sm" />
          </Link>
        </div>
      </CompactPageHero>

      <section className={`alu-container ${styles.section}`} aria-labelledby="release-notes-sections-title">
        <div className={styles.highlights} aria-labelledby="release-highlights-heading">
          <h2 id="release-highlights-heading" className={styles.highlightsTitle}>
            {release.highlightsHeading}
          </h2>
          <ul className={styles.highlightsList}>
            {release.highlights.map((highlight) => (
              <li key={highlight}>{highlight}</li>
            ))}
          </ul>
        </div>

        <SectionHeader
          id="release-notes-sections-title"
          kicker={release.label}
          title={`${release.label} yeniliklerini kategoriye göre inceleyin`}
        />

        <div className={styles.navigation} role="tablist" aria-label="Sürüm notu kategorileri">
          {tabs.map((tab, index) => (
            <button
              type="button"
              role="tab"
              id={`release-tab-${tab.id}`}
              aria-controls={`release-panel-${tab.id}`}
              aria-selected={index === activeIndex}
              tabIndex={index === activeIndex ? 0 : -1}
              key={tab.id}
              onClick={() => setActiveIndex(index)}
              onKeyDown={(event) => handleStructuredTabKey(event, index, tabs.length, setActiveIndex)}
            >
              <span>{tab.label}</span>
              <span className={styles.tabSubtitle}>{tab.subtitle}</span>
            </button>
          ))}
        </div>

        <section
          id={`release-panel-${activeTab.id}`}
          role="tabpanel"
          aria-labelledby={`release-tab-${activeTab.id}`}
          tabIndex={0}
        >
          {visibleSections.map((section) => (
            <ReleaseSectionBlock key={section.id} section={section} />
          ))}
        </section>

        <div className={styles.footerNav}>
          <Link className="alu-button alu-button--secondary alu-button--md" href="/2027/surum-notlari">
            <span>Sürüm notlarına genel bakış</span>
            <AluIcon name="arrow-right" size="sm" />
          </Link>
          <Link className="alu-button alu-button--primary alu-button--md" href="/2027/features">
            <span>ALLPLAN 2027 Yeniliklerini İncele</span>
            <AluIcon name="arrow-right" size="sm" />
          </Link>
        </div>
      </section>

      <PreviewClosingSection
        id="release-notes-closing-title"
        kicker="ALLPLAN 2027"
        title="Daha iyi bir yarın inşa etmek için tasarlayın"
        items={[
          { paragraphs: ['Daha üretken, iş birlikçi ve gelişmiş iş akışları'] },
          {
            title: 'ALLPLAN’ı ücretsiz deneyin',
            paragraphs: [
              'Tek bir platformda disiplinler arası AEC ekip çalışması; malzeme ve inşaat yöntemlerinde üstün koordinasyon; gelişmiş BIM iş akışları ve gerçek zamanlı iş birliği.',
              'ALLPLAN’ın tam sürümünü 14 gün boyunca ücretsiz ve yükümlülük olmadan deneyin. Yazılımı indirerek tüm avantajları kendiniz keşfedin.'
            ],
            action: { label: 'Şimdi indirin', href: TRIAL_CTA_URL }
          }
        ]}
      />
    </div>
  );
}

export function ReleaseNotes2027IndexView() {
  return (
    <div className={styles.page}>
      <CompactPageHero
        title="ALLPLAN 2027 Sürüm Notları"
        lead="Allplan 2027 sürüm ailesindeki tüm teknik yenilikleri, geliştirmeleri ve güncellemeleri sürüm bazında takip edin."
      >
        <div className={styles.actions}>
          <Link className="alu-button alu-button--primary alu-button--md" href="/2027/features">
            <span>ALLPLAN 2027 Yenilikleri</span>
            <AluIcon name="arrow-right" size="sm" />
          </Link>
        </div>
      </CompactPageHero>

      <div className={`alu-container ${styles.section}`}>
        <div className={styles.archiveGrid}>
          {RELEASE_NOTES_2027.map((release) => (
            <Link
              key={release.version}
              className={styles.archiveCard}
              href={`/2027/surum-notlari/${release.version}`}
            >
              <div className={styles.heroMeta}>
                <span className={styles.versionBadge}>{release.label}</span>
                <span className={styles.releaseDate}>{release.releaseDate}</span>
              </div>
              <h2 className={styles.archiveTitle}>
                {release.title} — {release.tagline}
              </h2>
              <p className={styles.archiveSummary}>{release.subtitle}</p>
              <span className={styles.archiveCta}>
                <span>Sürüm notlarını oku</span>
                <AluIcon name="arrow-right" size="sm" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
