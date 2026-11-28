import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { buildCustomerMail, buildStaffMail, type MailMessage } from '@/lib/quote-mail';
import type { QuoteRequest } from '@/lib/quote-validation';
import { isLocalPreviewEnabled } from '@/lib/release-flags';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Teklif Mailleri | Yerel Önizleme',
  robots: { index: false, follow: false, nocache: true },
};

// Sample data only: nothing here is sent or stored.
const SAMPLE_CONTACT = {
  jobTitle: '',
  scalypsoMode: '',
  customerNumber: '',
  department: '',
  documentAck: false,
  fullName: 'Deneme Kullanıcı',
  email: 'deneme@example.com',
  phone: '05320000000',
  company: 'Örnek Mimarlık',
  city: 'İstanbul',
  workArea: 'ozel',
  heardFrom: ['google', 'referans'],
  notes: 'Üç kullanıcılı ofisimiz için abonelik seçeneklerini öğrenmek istiyoruz.',
  consent: true,
};

const SAMPLES: Record<string, { label: string; request: QuoteRequest }> = {
  teklif: {
    label: 'Teklif talebi (ALLPLAN)',
    request: { ...SAMPLE_CONTACT, line: 'allplan', products: ['allplan-max', 'allplan-civil'], requestTypes: ['teknik-bilgi', 'fiyat-teklifi'] },
  },
  ogrenci: {
    label: 'Öğrenci başvurusu',
    request: {
      ...SAMPLE_CONTACT,
      line: 'ogrenci',
      products: ['allplan-ogrenci-surumu'],
      requestTypes: [],
      department: 'mimarlik',
      documentAck: true,
      company: 'Örnek Üniversitesi',
      workArea: 'ogrenci',
      notes: '',
    },
  },
};

const SAMPLE_META = { receivedAt: '2026-11-28T09:30:00.000Z', sourcePath: '/teklif?urun=allplan-max' };

interface MailFrameProps {
  heading: string;
  mail: MailMessage;
  narrow?: boolean;
}

function MailFrame({ heading, mail, narrow = false }: MailFrameProps) {
  return (
    <article className={styles.mail}>
      <h2 className={styles.mailTitle}>{heading}</h2>
      <dl className={styles.mailMeta}>
        <div>
          <dt>Konu</dt>
          <dd>{mail.subject}</dd>
        </div>
        {mail.replyTo && (
          <div>
            <dt>Yanıt adresi</dt>
            <dd>{mail.replyTo}</dd>
          </div>
        )}
      </dl>
      <iframe className={narrow ? styles.frameNarrow : styles.frame} title={heading} srcDoc={mail.html} sandbox="" />
    </article>
  );
}

interface PreviewPageProps {
  searchParams: Promise<{ ornek?: string | string[] }>;
}

export default async function QuoteMailPreviewPage({ searchParams }: PreviewPageProps) {
  if (!isLocalPreviewEnabled()) notFound();
  const { ornek } = await searchParams;
  const key = typeof ornek === 'string' && ornek in SAMPLES ? ornek : 'teklif';
  const sample = SAMPLES[key];
  const staff = buildStaffMail(sample.request, SAMPLE_META);
  const customer = buildCustomerMail(sample.request);

  return (
    <div className={styles.page}>
      <div className="alu-container">
        <h1 className={styles.title}>Teklif mailleri önizlemesi</h1>
        <p className={styles.lead}>Örnek veriyle üretilir. Bu sayfa yalnızca yerelde açılır; mail gönderilmez.</p>
        <nav className={styles.tabs} aria-label="Örnek seçimi">
          {Object.entries(SAMPLES).map(([id, item]) => (
            <a key={id} href={`/preview/teklif-mail?ornek=${id}`} aria-current={id === key ? 'page' : undefined}>
              {item.label}
            </a>
          ))}
        </nav>
        <div className={styles.grid}>
          <MailFrame heading="Firma yetkililerine giden mail" mail={staff} />
          <MailFrame heading="Kullanıcıya giden mail" mail={customer} />
          <MailFrame heading="Kullanıcıya giden mail (telefon)" mail={customer} narrow />
        </div>
      </div>
    </div>
  );
}
