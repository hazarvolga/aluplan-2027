import {
  JOB_TITLES,
  REQUEST_TYPES,
  SCALYPSO_MODES,
  STUDENT_DEPARTMENTS,
  STUDENT_INVALID_DOCUMENTS,
  STUDENT_VALID_DOCUMENTS,
  hasExtra,
  isSingleProductLine,
  type QuoteLine,
} from '@/lib/quote-catalog';
import { AluIcon } from '@/components/ui/AluIcon';
import type { QuoteErrors } from '@/lib/quote-validation';
import { ChoiceGroup, FieldError, TextField, errorId, fieldId } from './QuoteFields';
import type { QuoteFormState } from './QuoteForm';
import styles from './page.module.css';

interface QuoteLineFieldsProps {
  line: QuoteLine;
  form: QuoteFormState;
  errors: QuoteErrors;
  onChange: (patch: Partial<QuoteFormState>) => void;
}

/** The questions that depend on the chosen product line; everything here comes from the catalog. */
export function QuoteLineFields({ line, form, errors, onChange }: QuoteLineFieldsProps) {
  return (
    <>
      {!isSingleProductLine(line) && (
        <ChoiceGroup field="products" legend={line.productsLegend} options={line.products} selected={form.products} multiple layout="columns" error={errors.products} onChange={(products) => onChange({ products })} />
      )}

      {hasExtra(line, 'requestType') && (
        <ChoiceGroup field="requestTypes" legend="Talep türü" options={REQUEST_TYPES} selected={form.requestTypes} multiple error={errors.requestTypes} onChange={(requestTypes) => onChange({ requestTypes })} />
      )}

      {hasExtra(line, 'scalypsoMode') && (
        <ChoiceGroup field="scalypsoMode" legend="Scalypso için talebiniz" options={SCALYPSO_MODES} selected={form.scalypsoMode ? [form.scalypsoMode] : []} multiple={false} error={errors.scalypsoMode} onChange={([scalypsoMode]) => onChange({ scalypsoMode })} />
      )}

      {hasExtra(line, 'jobTitle') && (
        <div className="alu-field" data-field="jobTitle">
          <label className="alu-label" htmlFor={fieldId('jobTitle')}>
            İş tanımınız
          </label>
          <select
            className="alu-select"
            id={fieldId('jobTitle')}
            name="jobTitle"
            value={form.jobTitle}
            aria-invalid={errors.jobTitle ? 'true' : 'false'}
            aria-describedby={errors.jobTitle ? errorId('jobTitle') : undefined}
            onChange={(event) => onChange({ jobTitle: event.target.value })}
          >
            <option value="">Seçiniz (isteğe bağlı)</option>
            {JOB_TITLES.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
          <FieldError field="jobTitle" message={errors.jobTitle} />
        </div>
      )}

      {hasExtra(line, 'customerNumber') && (
        <TextField field="customerNumber" label="Müşteri numaranız" value={form.customerNumber} error={errors.customerNumber} isIdentifier autoComplete="off" hint="Allmenu > Bilgi > Müşteri Numarası. Örnek: C300 000 000 0" onChange={(customerNumber) => onChange({ customerNumber })} />
      )}

      {hasExtra(line, 'student') && (
        <>
          <div className={styles.documents}>
            <div className={styles.documentsValid}>
              <p className={styles.documentsTitle}>
                <AluIcon name="circle-check" size="sm" />
                Geçerli öğrenci belgesi
              </p>
              <ul>
                {STUDENT_VALID_DOCUMENTS.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div className={styles.documentsInvalid}>
              <p className={styles.documentsTitle}>
                <AluIcon name="circle-x" size="sm" />
                Bu belgeler kabul edilmez
              </p>
              <ul>
                {STUDENT_INVALID_DOCUMENTS.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <p className={styles.documentsNote}>Bu belgelerle yapılan başvurular onaylanmaz.</p>
            </div>
          </div>
          <div className={styles.consent} data-field="documentAck">
            <label className={styles.choice}>
              <input type="checkbox" name="documentAck" checked={form.documentAck} required aria-invalid={errors.documentAck ? 'true' : 'false'} aria-describedby={errors.documentAck ? errorId('documentAck') : undefined} onChange={(event) => onChange({ documentAck: event.target.checked })} />
              <span>
                Güncel tarihli, aktif öğrenci durumunu gösteren YÖK e-Devlet öğrenci belgem var.
                <span className="alu-label__req" aria-hidden="true">
                  *
                </span>
              </span>
            </label>
            <FieldError field="documentAck" message={errors.documentAck} />
          </div>
          <ChoiceGroup field="department" legend="Bölümünüz" options={STUDENT_DEPARTMENTS} selected={form.department ? [form.department] : []} multiple={false} error={errors.department} onChange={([department]) => onChange({ department })} />
        </>
      )}
    </>
  );
}
