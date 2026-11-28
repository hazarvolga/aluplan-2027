'use client';

import { useRef, useState, type FormEvent } from 'react';
import { AluIcon } from '@/components/ui/AluIcon';
import {
  HEARD_FROM,
  QUOTE_GROUPS,
  QUOTE_LINES,
  WORK_AREAS,
  findQuoteLine,
  hasExtra,
  isSingleProductLine,
  type QuotePreselection,
} from '@/lib/quote-catalog';
import { validateQuoteRequest, type QuoteErrors, type QuoteField, type QuoteRequest } from '@/lib/quote-validation';
import { ChoiceGroup, FieldError, TextField, errorId, fieldId } from './QuoteFields';
import { QuoteLineFields } from './QuoteLineFields';
import { QuoteSummary } from './QuoteSummary';
import styles from './page.module.css';

export type QuoteFormState = Omit<QuoteRequest, 'line'> & { line: string; website: string };

// Same order as the fields appear, so focus lands on the first invalid one.
const FIELD_ORDER: readonly QuoteField[] = [
  'line', 'products', 'requestTypes', 'jobTitle', 'scalypsoMode', 'customerNumber', 'documentAck', 'department',
  'fullName', 'email', 'phone', 'company', 'city', 'workArea', 'heardFrom', 'notes', 'consent',
];

const buildInitialState = (preselection: QuotePreselection): QuoteFormState => ({
  line: preselection.line ?? '',
  products: preselection.products,
  requestTypes: [],
  jobTitle: '',
  scalypsoMode: '',
  customerNumber: '',
  department: '',
  documentAck: false,
  fullName: '',
  email: '',
  phone: '',
  company: '',
  city: '',
  workArea: '',
  heardFrom: [],
  notes: '',
  consent: false,
  website: '',
});

type SubmitState = 'idle' | 'sending' | 'rate_limited' | 'failed';

const SUBMIT_MESSAGES: Record<'rate_limited' | 'failed', string> = {
  rate_limited: 'Kısa sürede çok fazla talep gönderildi. Lütfen birkaç dakika sonra yeniden deneyin.',
  failed: 'Talebiniz şu anda gönderilemedi. Bilgileriniz silinmedi; yeniden deneyebilir veya aşağıdaki kanallardan bize ulaşabilirsiniz.',
};

interface QuoteFormProps {
  preselection: QuotePreselection;
  fallbackFormUrl: string;
}

export function QuoteForm({ preselection, fallbackFormUrl }: QuoteFormProps) {
  const [form, setForm] = useState<QuoteFormState>(() => buildInitialState(preselection));
  const [errors, setErrors] = useState<QuoteErrors>({});
  const [submitted, setSubmitted] = useState<QuoteRequest | null>(null);
  const [submitState, setSubmitState] = useState<SubmitState>('idle');
  const formRef = useRef<HTMLFormElement>(null);

  const line = findQuoteLine(form.line);
  const isStudent = hasExtra(line, 'student');
  const errorCount = Object.keys(errors).length;

  // Editing a field clears its own error; the rest stay until the next submit.
  const update = (patch: Partial<QuoteFormState>): void => {
    setForm((current) => ({ ...current, ...patch }));
    setErrors((current) =>
      Object.fromEntries(Object.entries(current).filter(([field]) => !(field in patch))) as QuoteErrors,
    );
  };

  const selectLine = (lineId: string): void => {
    const next = findQuoteLine(lineId);
    update({ line: lineId, products: next && isSingleProductLine(next) ? [next.products[0].id] : [] });
  };

  const focusFirstInvalid = (found: QuoteErrors): void => {
    const first = FIELD_ORDER.find((field) => found[field]);
    if (!first) return;
    const target = formRef.current?.querySelector<HTMLElement>(
      `[data-field="${first}"] input, [data-field="${first}"] select, [data-field="${first}"] textarea`,
    );
    target?.focus();
  };

  const showErrors = (found: QuoteErrors): void => {
    setErrors(found);
    focusFirstInvalid(found);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    if (submitState === 'sending') return;
    const result = validateQuoteRequest(form);
    if (!result.ok) return showErrors(result.errors);

    setErrors({});
    setSubmitState('sending');
    try {
      const response = await fetch('/api/teklif', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, sourcePath: `${window.location.pathname}${window.location.search}` }),
      });
      if (response.ok) {
        setSubmitState('idle');
        setSubmitted(result.value);
        return;
      }
      if (response.status === 422) {
        const body = (await response.json()) as { errors?: QuoteErrors };
        setSubmitState('idle');
        return showErrors(body.errors ?? {});
      }
      setSubmitState(response.status === 429 ? 'rate_limited' : 'failed');
    } catch {
      setSubmitState('failed');
    }
  };

  if (submitted) return <QuoteSummary request={submitted} />;

  return (
    <form ref={formRef} className={styles.form} onSubmit={handleSubmit} noValidate aria-labelledby="quote-form-title">
      <h2 id="quote-form-title" className={styles.srOnly}>
        Teklif ve talep formu
      </h2>
      <p className={styles.requiredNote}>
        <span aria-hidden="true">*</span> ile işaretli alanlar zorunludur.
      </p>

      <section className={styles.step} aria-labelledby="quote-step-line">
        <h3 id="quote-step-line" className={styles.stepTitle}>
          <span className={styles.stepNumber}>1</span> Hangi ürünle ilgileniyorsunuz?
        </h3>
        <div data-field="line" role="radiogroup" aria-labelledby="quote-step-line" aria-describedby={errors.line ? errorId('line') : undefined}>
          {QUOTE_GROUPS.map((group) => (
            <div className={styles.lineGroup} key={group.id}>
              <p className={styles.lineGroupLabel}>{group.label}</p>
              <div className={styles.lineGrid}>
                {QUOTE_LINES.filter((item) => item.group === group.id).map((item) => (
                  <label className={styles.lineCard} key={item.id}>
                    <input type="radio" name="line" value={item.id} checked={form.line === item.id} onChange={() => selectLine(item.id)} />
                    <span className={styles.lineCardText} title={item.hint}>
                      <strong>{item.label}</strong>
                    </span>
                  </label>
                ))}
              </div>
            </div>
          ))}
          <FieldError field="line" message={errors.line} />
        </div>
      </section>

      {line && (
        <section className={styles.step} aria-labelledby="quote-step-details">
          <h3 id="quote-step-details" className={styles.stepTitle}>
            <span className={styles.stepNumber}>2</span> {line.label} talebiniz
          </h3>
          <QuoteLineFields line={line} form={form} errors={errors} onChange={update} />
        </section>
      )}

      {line && (
        <section className={styles.step} aria-labelledby="quote-step-contact">
          <h3 id="quote-step-contact" className={styles.stepTitle}>
            <span className={styles.stepNumber}>3</span> İletişim bilgileriniz
          </h3>
          <div className={styles.fieldGrid}>
            <TextField field="fullName" label="Adınız Soyadınız" value={form.fullName} error={errors.fullName} autoComplete="name" onChange={(fullName) => update({ fullName })} />
            <TextField field="email" label="E-posta" type="email" value={form.email} error={errors.email} autoComplete="email" inputMode="email" isIdentifier onChange={(email) => update({ email })} />
            <TextField field="phone" label="GSM" type="tel" value={form.phone} error={errors.phone} autoComplete="tel" inputMode="tel" isIdentifier hint="Örnek: 0532 000 00 00" onChange={(phone) => update({ phone })} />
            <TextField field="company" label={isStudent ? 'Üniversite' : 'Firma'} value={form.company} error={errors.company} autoComplete="organization" onChange={(company) => update({ company })} />
            <TextField field="city" label="Şehir" value={form.city} error={errors.city} autoComplete="address-level1" onChange={(city) => update({ city })} />
          </div>

          {!isStudent && (
            <ChoiceGroup field="workArea" legend="Çalışma alanı" options={WORK_AREAS} selected={form.workArea ? [form.workArea] : []} multiple={false} error={errors.workArea} onChange={([workArea]) => update({ workArea })} />
          )}
          <ChoiceGroup field="heardFrom" legend="Bizi nereden duydunuz?" options={HEARD_FROM} selected={form.heardFrom} multiple error={errors.heardFrom} onChange={(heardFrom) => update({ heardFrom })} />

          <div className="alu-field" data-field="notes">
            <label className="alu-label" htmlFor={fieldId('notes')}>
              Notlar
            </label>
            <textarea
              className={`alu-input ${styles.textarea}`}
              id={fieldId('notes')}
              name="notes"
              rows={4}
              maxLength={2000}
              value={form.notes}
              aria-invalid={errors.notes ? 'true' : 'false'}
              aria-describedby={errors.notes ? errorId('notes') : undefined}
              onChange={(event) => update({ notes: event.target.value })}
            />
            <FieldError field="notes" message={errors.notes} />
          </div>

          <div className={styles.consent} data-field="consent">
            <label className={styles.choice}>
              <input type="checkbox" name="consent" checked={form.consent} required aria-invalid={errors.consent ? 'true' : 'false'} aria-describedby={errors.consent ? errorId('consent') : undefined} onChange={(event) => update({ consent: event.target.checked })} />
              <span>
                <a href="/kvkk">Kişisel verilerin işlenmesine ilişkin aydınlatma metnini</a> ve{' '}
                <a href="/gizlilik-politikasi">gizlilik politikasını</a> okudum, onaylıyorum.
                <span className="alu-label__req" aria-hidden="true">
                  *
                </span>
              </span>
            </label>
            <FieldError field="consent" message={errors.consent} />
          </div>

          {/* Honeypot: hidden from people and assistive tech; only automated submissions fill it. */}
          <div className={styles.srOnly} aria-hidden="true">
            <label htmlFor="quote-website">Web siteniz</label>
            <input id="quote-website" name="website" type="text" tabIndex={-1} autoComplete="off" value={form.website} onChange={(event) => update({ website: event.target.value })} />
          </div>

          <p className={styles.formStatus} role="status">
            {errorCount > 0 ? `Formda düzeltilmesi gereken ${errorCount} alan var.` : ''}
          </p>
          {(submitState === 'rate_limited' || submitState === 'failed') && (
            <div className="alu-alert alu-alert--danger" role="alert">
              <AluIcon name="circle-alert" />
              <div className="alu-alert__body">
                <p className="alu-alert__title">Talep gönderilemedi</p>
                <p className="alu-alert__content">
                  {SUBMIT_MESSAGES[submitState]}{' '}
                  {submitState === 'failed' && (
                    <>
                      <a href={fallbackFormUrl} target="_blank" rel="noopener noreferrer">
                        Yedek talep formu
                      </a>
                      {' · '}
                      <a href="mailto:info@aluplan.com.tr">info@aluplan.com.tr</a>
                      {' · '}
                      <a href="tel:+902162258441">(+90) 216 225 84 41</a>
                    </>
                  )}
                </p>
              </div>
            </div>
          )}
          <button type="submit" className="alu-btn alu-btn--primary alu-btn--lg" aria-disabled={submitState === 'sending'}>
            {submitState === 'sending' ? 'Gönderiliyor…' : isStudent ? 'Başvuruyu gönder' : 'Talebi gönder'}
          </button>
        </section>
      )}
    </form>
  );
}
