'use client';

import { useEffect, useRef } from 'react';
import { AluIcon } from '@/components/ui/AluIcon';
import {
  HEARD_FROM,
  JOB_TITLES,
  REQUEST_TYPES,
  SCALYPSO_MODES,
  STUDENT_DEPARTMENTS,
  STUDENT_DOWNLOAD_URL,
  WORK_AREAS,
  findQuoteLine,
  hasExtra,
  type QuoteOption,
} from '@/lib/quote-catalog';
import type { QuoteRequest } from '@/lib/quote-validation';
import styles from './page.module.css';

const labelOf = (options: readonly QuoteOption[], id: string): string =>
  options.find((option) => option.id === id)?.label ?? id;
const labelsOf = (options: readonly QuoteOption[], ids: readonly string[]): string =>
  ids.map((id) => labelOf(options, id)).join(', ');

interface QuoteSummaryProps {
  request: QuoteRequest;
}

/** Shown only after the server has accepted the request. */
export function QuoteSummary({ request }: QuoteSummaryProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const line = findQuoteLine(request.line);
  const isStudent = hasExtra(line, 'student');

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  const rows: ReadonlyArray<readonly [string, string]> = [
    ['Ürün ailesi', line?.label ?? request.line],
    ['Ürünler', labelsOf(line?.products ?? [], request.products)],
    ['Talep türü', labelsOf(REQUEST_TYPES, request.requestTypes)],
    ['Scalypso talebi', request.scalypsoMode ? labelOf(SCALYPSO_MODES, request.scalypsoMode) : ''],
    ['İş tanımı', request.jobTitle ? labelOf(JOB_TITLES, request.jobTitle) : ''],
    ['Müşteri numarası', request.customerNumber],
    ['Bölüm', request.department ? labelOf(STUDENT_DEPARTMENTS, request.department) : ''],
    ['Ad Soyad', request.fullName],
    ['E-posta', request.email],
    ['GSM', request.phone],
    [isStudent ? 'Üniversite' : 'Firma', request.company],
    ['Şehir', request.city],
    ['Çalışma alanı', labelOf(WORK_AREAS, request.workArea)],
    ['Bizi nereden duydunuz', labelsOf(HEARD_FROM, request.heardFrom)],
    ['Notlar', request.notes],
  ].filter((row): row is [string, string] => row[1] !== '');

  return (
    <section className={styles.summary} aria-labelledby="quote-summary-title">
      <div className="alu-alert alu-alert--success" role="status">
        <AluIcon name="circle-check" />
        <div className="alu-alert__body">
          <h2 className="alu-alert__title" id="quote-summary-title" ref={headingRef} tabIndex={-1}>
            {isStudent ? 'Başvurunuz bize ulaştı' : 'Talebiniz bize ulaştı'}
          </h2>
          <p className="alu-alert__content">
            {isStudent
              ? 'Allplan Öğrenci Sürümünü aşağıdaki bağlantıdan indirebilirsiniz. Lisansın etkinleşmesi için geçerli öğrenci belgeniz gerekir.'
              : 'Ekibimiz talebinizi inceleyip en kısa sürede sizinle iletişime geçecek.'}
          </p>
        </div>
      </div>

      {isStudent && (
        <a className={`alu-btn alu-btn--primary alu-btn--lg ${styles.downloadButton}`} href={STUDENT_DOWNLOAD_URL} target="_blank" rel="noopener noreferrer">
          <AluIcon name="download" size="sm" />
          Allplan Öğrenci Sürümünü indir
        </a>
      )}

      <dl className={styles.summaryList}>
        {rows.map(([label, value]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
