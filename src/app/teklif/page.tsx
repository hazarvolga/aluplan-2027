import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CompactPageHero } from '@/components/sections/CompactPageHero';
import { resolvePreselection } from '@/lib/quote-catalog';
import { isQuoteFormEnabled } from '@/lib/release-flags';
import { MAIN_QUOTE_FORM_URL } from '@/lib/site-data';
import { QuoteForm } from './QuoteForm';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Teklif ve Talep Formu | Aluplan',
  description:
    'ALLPLAN, FRILO, SCIA, SDS2, AX3000, BIMX5, BIMFlex ve eklentiler için teklif veya teknik bilgi talebinizi tek formdan iletin.',
  // The form stays out of search results until it replaces the current request channel.
  robots: { index: false, follow: true },
};

interface QuotePageProps {
  searchParams: Promise<{ urun?: string | string[] }>;
}

export default async function QuotePage({ searchParams }: QuotePageProps) {
  if (!isQuoteFormEnabled()) notFound();
  const { urun } = await searchParams;
  const preselection = resolvePreselection(Array.isArray(urun) ? urun[0] : urun);

  return (
    <div className={styles.page}>
      <CompactPageHero
        kicker="TEKLİF VE TALEP"
        title="Teklif ve talep formu"
        lead="İlgilendiğiniz ürünü seçin, iletişim bilgilerinizi bırakın. Ekibimiz talebinizi inceleyip size dönüş yapar."
      />
      <div className="alu-container alu-container--md">
        <QuoteForm preselection={preselection} fallbackFormUrl={MAIN_QUOTE_FORM_URL} />
      </div>
    </div>
  );
}
