'use client';

import type { CSSProperties, ReactElement } from 'react';

import type { StructuredPageLayout } from '@/lib/site-data';
import { AluIcon, type AluIconName } from '@/components/ui/AluIcon';
import { MetricCards } from './MetricCards';
import { ChallengesBand } from './ChallengesBand';
import { BenefitsSection } from './BenefitsSection';
import { FAQSection } from './FAQSection';
import { MediaGridSection } from './MediaGridSection';
import { sds2Features2027 } from '@/data/sds2-2027-features';
import { ReferencesDirectorySection } from './ReferencesDirectorySection';
import { SplitCalloutSection } from './SplitCalloutSection';
import { StructuredContentBlocks } from './StructuredContentBlocks';
import { WorkflowSection } from './WorkflowSection';
import { SectionHeader } from './SectionHeader';
import { gridGroupFor } from '@/lib/grid-groups';
import { DebugComponentLabel } from './DebugComponentLabel';
import { StructuredIntroSection } from './StructuredIntroSection';
import { WorkflowRibbon } from './WorkflowRibbon';

interface StructuredVideoRequest {
  youtubeId?: string;
  videoSrc?: string;
  title: string;
}

interface StructuredImageRequest {
  src: string;
  title: string;
}

interface StructuredPageLayoutSectionProps {
  layout: StructuredPageLayout;
  pagePath: string;
  activeReferenceCategoryId: string;
  referenceSearchQuery: string;
  onReferenceCategoryChange: (categoryId: string) => void;
  onReferenceSearchQueryChange: (query: string) => void;
  onVideo: (video: StructuredVideoRequest) => void;
  onImage: (image: StructuredImageRequest) => void;
}

const PACKAGE_INTRO_PATHS = new Set(['/products/allplan-basic', '/products/allplan-concept', '/products/allplan-professional', '/products/allplan-ultimate', '/products/civil']);

const SDS2_SURVEY_SOURCE = 'Kaynak: 2021’de SDS2 müşterileri arasında yapılan SDS2 ROI Anketi. Katılımcıların diğer çelik detaylandırma yazılımlarıyla deneyimleri farklılık göstermiştir.';
const SDS2_CATEGORY_ICONS: Readonly<Record<string, AluIconName>> = {
  MODELLEME: 'boxes',
  PLANLAMA: 'ruler',
  'BİRLİKTE ÇALIŞABİLİRLİK': 'layers',
  TESLİMATLAR: 'file-text',
  EKLENTİLER: 'cpu',
};

export function StructuredPageLayoutSection({
  layout,
  pagePath,
  activeReferenceCategoryId,
  referenceSearchQuery,
  onReferenceCategoryChange,
  onReferenceSearchQueryChange,
  onVideo,
  onImage
}: StructuredPageLayoutSectionProps): ReactElement {
  const gridGroup = gridGroupFor(pagePath);
  if (layout.contentBlocks && layout.contentBlocks.length > 0) {
    return (
      <div className="alu-structured-page">
        <StructuredContentBlocks
          blocks={layout.contentBlocks}
          onVideo={onVideo}
          onImage={onImage}
        />
        {layout.faqDirectory && layout.faqDirectory.categories.length > 0 && <DebugComponentLabel name="FAQSection"><FAQSection faqDirectory={layout.faqDirectory} /></DebugComponentLabel>}
      </div>
    );
  }

  return (
    <div className="alu-structured-page">
      {layout.intro && <StructuredIntroSection intro={layout.intro} compactBullets={PACKAGE_INTRO_PATHS.has(pagePath)} />}

      {layout.workflowLinks && <WorkflowRibbon links={layout.workflowLinks} />}

      {layout.stats && layout.stats.length > 0 && (
        <DebugComponentLabel name="metricsBand (özel)"><section className="preview-section preview-section--subtle" aria-label="Performans Göstergeleri">
          <div className="alu-container alu-stack" style={{ gap: 'var(--space-stack-xl)' }}>
            <div
              className="alu-hero-metrics"
              style={{ '--hero-metric-columns': Math.min(layout.stats.length, 4) } as CSSProperties}
            >
              {layout.stats.map((stat, statIndex) => (
                <div key={`${stat.label}-${statIndex}`} className="alu-hero-metrics__item">
                  <span className="alu-hero-metrics__value">{stat.value}</span>
                  <h3 className="alu-hero-metrics__label" style={{ margin: 0 }}>
                    {stat.label}
                  </h3>
                  <p className="alu-body-sm" style={{ margin: 'var(--space-application-jsx-tight) 0 0 0' }}>
                    {stat.description}
                  </p>
                </div>
              ))}
            </div>

          </div>
        </section></DebugComponentLabel>
      )}

      {layout.challenges && layout.challenges.length > 0 && (
        <DebugComponentLabel name="challengesSection (özel)"><section className="preview-section preview-section--subtle" aria-label="Sektörel Zorluklar">
          <div className="alu-container">
            <ChallengesBand
              title="Günümüz Projelerinde Karşılaşılan Temel Zorluklar"
              items={layout.challenges}
            />
          </div>
        </section></DebugComponentLabel>
      )}

      {layout.splitCallouts?.some((callout) => callout.title !== 'Lisans ve Gereksinimler' && !callout.title.includes('SCIA Engineer')) && (
        <DebugComponentLabel name="SplitCalloutSection"><SplitCalloutSection
          callouts={layout.splitCallouts.filter(
            (callout) =>
              callout.title !== 'Lisans ve Gereksinimler' &&
              !callout.title.includes('SCIA Engineer')
          )}
          itemKeyPrefix="callout-top"
          onVideo={onVideo}
          onImage={onImage}
        /></DebugComponentLabel>
      )}

      {pagePath === '/products/sds2-home' && <DebugComponentLabel name="MediaGridSection"><MediaGridSection grid={sds2Features2027} itemKeyPrefix="sds2-2027" onVideo={onVideo} onImage={onImage} /></DebugComponentLabel>}

      {pagePath === '/products/sds2-home' && <DebugComponentLabel name="challengesSection (özel)"><section className="preview-section preview-section--subtle"><div className="alu-container"><ChallengesBand title="Bu zorluklarla sık sık karşılaşıyor musunuz?" items={["Genel geçer birleşimler ek iş gücü, maliyet ve zaman alan bilgi talepleri (RFI) yaratır.", "Projeleri daha hızlı ve daha düşük maliyetle teslim etme baskısı artar.", "Hatalı maliyet tahminleri, gecikmeler ve artan proje maliyetleri kârı azaltır."]} /></div></section></DebugComponentLabel>}

      {pagePath === '/products/sds2-home' && <DebugComponentLabel name="metricsSection (özel)"><section className="preview-section"><div className="alu-container"><div style={{marginBottom:"var(--space-stack-lg)"}}><SectionHeader kicker="/ SDS2 · İŞİNİZE KATKISI" title="SDS2 by ALLPLAN işinize nasıl fayda sağlar?" /></div><MetricCards items={[
        {value:'%93', label:'ZAMAN TASARRUFU', description:'Kullanıcıların %93’ü, SDS2 by ALLPLAN ile projeleri en az %25 daha hızlı tamamladığını bildiriyor.', source: SDS2_SURVEY_SOURCE},
        {value:'%86', label:'DAHA FAZLA VERİMLİLİK', description:'Kullanıcıların %86’sı, SDS2 by ALLPLAN’ın imalat verimliliğini artırmaya yardımcı olduğunu söylüyor.', source: SDS2_SURVEY_SOURCE},
        {value:'%71', label:'DAHA ÜRETKEN', description:'Kullanıcıların %71’i, kullanmaya başladıktan sonraki bir yıl içinde üretkenlik artışı gördü.', source: SDS2_SURVEY_SOURCE},
      ]} /></div></section></DebugComponentLabel>}

      {pagePath === '/products/sds2-home' && <DebugComponentLabel name="BenefitsSection"><BenefitsSection benefits={{kicker:'/ SDS2 BY ALLPLAN', title:'Çelik detaylandırmada öne çıkan yetenekler', items:[
        {sourceId:'live.sds.ben.connections',title:'Akıllı birleşimleri otomatik tasarlayın',description:'Modelleme sırasında tam doğrulanmış birleşimler oluşturarak zaman kazanın; hataları ve bilgi taleplerini (RFI) azaltın.',iconSrc:'/assets/previews/sds2/icons/automated_workflows.png'},
        {sourceId:'live.sds.ben.customized',title:'Özelleştirilmiş tasarım otomasyonu',description:'Modelinizi imalatçının ve montajcının güçlü yönlerine ve tercihlerine kolayca uyarlayın.',iconSrc:'/assets/previews/sds2/icons/icon-02.png'},
        {sourceId:'live.sds.ben.multiuser',title:'Canlı çok kullanıcılı modelleme',description:'Diğer kullanıcılarla aynı model üzerinde aynı anda, veri hataları olmadan çalışın.',iconSrc:'/assets/previews/sds2/icons/productive_collab.png'},
        {sourceId:'live.sds.ben.rfi',title:'Bilgi taleplerinde zaman kazanın',description:'Etkileşimli raporlar ve basit model inceleme iş akışlarıyla tasarım niyetini kolayca iletin.',iconSrc:'/assets/previews/sds2/icons/more_accurate_deliverables.png'},
        {sourceId:'live.sds.ben.production',title:'Doğru üretim verileri',description:'İmalatı kolaylaştırmak için sektörün önde gelen otomatik ekipman çözümleriyle entegrasyon sağlayın.',iconSrc:'/assets/previews/sds2/icons/accurate_production_data.png'},
        {sourceId:'live.sds.ben.bim',title:'Kesintisiz BIM iş akışları',description:'Verileri tasarımdan inşaata BIM döngüsü boyunca kullanın.',iconSrc:'/assets/previews/sds2/icons/import_bim_models.png'},
      ]}} /></DebugComponentLabel>}

      {layout.benefits && layout.benefits.items.length > 0 && (
        <DebugComponentLabel name="BenefitsSection"><BenefitsSection benefits={pagePath === '/products/sds2-home' ? { ...layout.benefits, items: layout.benefits.items.map(item => ({ ...item, iconName: SDS2_CATEGORY_ICONS[item.title] })) } : layout.benefits} variant={pagePath === "/products/sds2-home" ? "category-list" : "default"} /></DebugComponentLabel>
      )}

      {layout.coreFeatures && layout.coreFeatures.items.length > 0 && (
        <DebugComponentLabel name="MediaGridSection"><MediaGridSection
          grid={layout.coreFeatures}
          itemKeyPrefix="core-features"
          onVideo={onVideo}
          onImage={onImage}
        /></DebugComponentLabel>
      )}

      {layout.workflowTabs && (
        <DebugComponentLabel name="WorkflowSection"><WorkflowSection
          content={layout.workflowTabs}
          onVideo={onVideo}
          onImage={onImage}
        /></DebugComponentLabel>
      )}

      {gridGroup && layout.extraGrids && layout.extraGrids.length > 0 && (
        <div className="preview-section preview-section--group-parent">
          <div className="alu-container">
            <SectionHeader kicker={layout.extraGrids[0].kicker} title={gridGroup.title} />
          </div>
        </div>
      )}
      {layout.extraGrids?.map((grid, gridIndex) => (
        <DebugComponentLabel key={`extra-grid-${gridIndex}`} name="MediaGridSection"><MediaGridSection
          grid={grid}
          itemKeyPrefix={`extra-grid-${gridIndex}`}
          onVideo={onVideo}
          onImage={onImage}
          group={gridGroup ? { index: gridIndex, unit: gridGroup.unit } : undefined}
        /></DebugComponentLabel>
      ))}

      {layout.splitCallouts?.some((callout) => callout.title === 'Lisans ve Gereksinimler' || callout.title.includes('SCIA Engineer')) && (
        <DebugComponentLabel name="SplitCalloutSection"><SplitCalloutSection
          callouts={layout.splitCallouts.filter(
            (callout) =>
              callout.title === 'Lisans ve Gereksinimler' ||
              callout.title.includes('SCIA Engineer')
          )}
          itemKeyPrefix="callout-bottom"
          onVideo={onVideo}
          onImage={onImage}
        /></DebugComponentLabel>
      )}

      {layout.faq && layout.faq.items.length > 0 && (
        <DebugComponentLabel name="faqList (özel)"><section className="preview-section preview-section--subtle" aria-label={layout.faq.title}>
          <div className="alu-container alu-stack" style={{ gap: 'var(--space-stack-xl)' }}>
            <SectionHeader kicker="/ SIKÇA SORULAN SORULAR" title={layout.faq.title} />
            <div className="alu-faq-list">
              {layout.faq.items.map((faqItem, faqIndex) => (
                <details
                  key={`${faqItem.question}-${faqIndex}`}
                  className="alu-faq-item"
                  open={faqIndex === 0}
                >
                  <summary className="alu-faq-item__summary">
                    <span>{faqItem.question}</span>
                    <span className="alu-faq-item__chevron" aria-hidden="true">
                      <AluIcon name="chevron-down" size="sm" />
                    </span>
                  </summary>
                  <div className="alu-faq-item__answer">
                    {faqItem.answer.split('\n\n').map((paragraph, paragraphIndex) => (
                      <p key={paragraphIndex}>{paragraph}</p>
                    ))}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section></DebugComponentLabel>
      )}

      {layout.referencesDirectory && (
        <DebugComponentLabel name="ReferencesDirectorySection"><ReferencesDirectorySection
          directory={layout.referencesDirectory}
          activeCategoryId={activeReferenceCategoryId}
          searchQuery={referenceSearchQuery}
          onCategoryChange={onReferenceCategoryChange}
          onSearchQueryChange={onReferenceSearchQueryChange}
        /></DebugComponentLabel>
      )}

      {layout.faqDirectory && layout.faqDirectory.categories.length > 0 && <DebugComponentLabel name="FAQSection"><FAQSection faqDirectory={layout.faqDirectory} /></DebugComponentLabel>}
    </div>
  );
}
