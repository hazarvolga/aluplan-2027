import type { PageRecord } from '@/lib/site-data';
import { MAIN_QUOTE_FORM_URL, SUPPORT_PORTAL_URL, TRIAL_CTA_URL } from '@/lib/site-shared';

export type PageEndConversionKind = 'commercial' | 'training' | 'support' | 'corporate';

export interface PageEndConversionAction {
  label: string;
  href: string;
  emphasis: 'primary' | 'secondary';
}

export interface PageEndConversionModel {
  kind: PageEndConversionKind;
  kicker: string;
  title: string;
  description: string;
  actions: PageEndConversionAction[];
}

type PageEndConversionInput = Pick<PageRecord, 'path' | 'section'>;

const HIDDEN_PATHS = [
  '/',
  '/contact',
  '/search',
  '/health',
] as const;

const SUPPORT_PATHS = [
  '/solutions-v2/connect-login',
  '/solutions-v2/faq',
] as const;

function commercialConversion(): PageEndConversionModel {
  return {
    kind: 'commercial',
    kicker: 'BİR SONRAKİ ADIM',
    title: 'ALLPLAN çözümünüzü birlikte planlayalım',
    description: 'İhtiyaçlarınıza uygun ürün ve paket seçenekleri için teklif isteyin veya ALLPLAN’ı ücretsiz deneyin.',
    actions: [
      { label: 'Teklif İste', href: MAIN_QUOTE_FORM_URL, emphasis: 'primary' },
      { label: 'Ücretsiz Deneme', href: TRIAL_CTA_URL, emphasis: 'secondary' },
    ],
  };
}

function trainingConversion(): PageEndConversionModel {
  return {
    kind: 'training',
    kicker: 'EĞİTİM VE DANIŞMANLIK',
    title: 'Ekibiniz için doğru eğitim yolunu belirleyelim',
    description: 'Özel eğitim ihtiyacınızı iletin veya ALLPLAN çözümleri için teklif talep edin.',
    actions: [
      { label: 'Eğitim Talebi', href: MAIN_QUOTE_FORM_URL, emphasis: 'primary' },
      { label: 'Teklif İste', href: MAIN_QUOTE_FORM_URL, emphasis: 'secondary' },
    ],
  };
}

function supportConversion(): PageEndConversionModel {
  return {
    kind: 'support',
    kicker: 'TEKNİK DESTEK',
    title: 'Destek talebinizi doğrudan uzman ekibe iletin',
    description: 'Lisans, kurulum ve teknik sorunlarınız için Aluplan Destek Platformu’nu kullanın.',
    actions: [
      { label: 'Destek Platformuna Git', href: SUPPORT_PORTAL_URL, emphasis: 'primary' },
    ],
  };
}

function corporateConversion(): PageEndConversionModel {
  return {
    kind: 'corporate',
    kicker: 'ALUPLAN İLE ÇALIŞIN',
    title: 'Projeniz için doğru ALLPLAN çözümünü konuşalım',
    description: 'İhtiyacınızı paylaşın; ürün, paket ve hizmet seçeneklerini birlikte değerlendirelim.',
    actions: [
      { label: 'Teklif İste', href: MAIN_QUOTE_FORM_URL, emphasis: 'primary' },
    ],
  };
}

export function getPageEndConversion(page: PageEndConversionInput): PageEndConversionModel | null {
  if (page.section === 'legal' || HIDDEN_PATHS.some((path) => path === page.path)) {
    return null;
  }

  if (page.path.startsWith('/solutions-v2/training')) {
    return trainingConversion();
  }

  if (
    page.path.startsWith('/solutions-v2/connect-license')
    || SUPPORT_PATHS.some((path) => path === page.path)
  ) {
    return supportConversion();
  }

  if (page.path === '/about' || page.path === '/references') {
    return corporateConversion();
  }

  if (
    page.section === 'products'
    || page.section === 'solutions'
    || page.section === 'solutions-v2'
    || page.path === '/package-overview'
    || page.path === '/paket-karsilastirma'
  ) {
    return commercialConversion();
  }

  return null;
}
