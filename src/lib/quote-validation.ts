// Shared by the form (user feedback) and the server route (data integrity).
import {
  HEARD_FROM,
  JOB_TITLES,
  REQUEST_TYPES,
  SCALYPSO_MODES,
  STUDENT_DEPARTMENTS,
  STUDENT_WORK_AREA_ID,
  WORK_AREAS,
  findQuoteLine,
  hasExtra,
  isSingleProductLine,
  type QuoteLine,
  type QuoteOption,
} from './quote-catalog';

export interface QuoteRequest {
  line: string;
  products: string[];
  requestTypes: string[];
  jobTitle: string;
  scalypsoMode: string;
  customerNumber: string;
  department: string;
  documentAck: boolean;
  fullName: string;
  email: string;
  phone: string;
  company: string;
  city: string;
  workArea: string;
  heardFrom: string[];
  notes: string;
  consent: boolean;
}

export type QuoteField = keyof QuoteRequest | 'form';
export type QuoteErrors = Partial<Record<QuoteField, string>>;

export type QuoteValidationResult =
  | { ok: true; value: QuoteRequest }
  | { ok: false; errors: QuoteErrors };

const MAX_SHORT_TEXT = 120;
const MAX_NOTES = 2000;
const MIN_NAME_LENGTH = 2;
const MIN_PHONE_DIGITS = 10;
const MAX_PHONE_DIGITS = 15;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_ALLOWED_PATTERN = /^[\d\s()+-]+$/;

const text = (value: unknown): string => (typeof value === 'string' ? value.trim() : '');
const list = (value: unknown): string[] =>
  Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : [];
const isOption = (options: readonly QuoteOption[], id: string): boolean => options.some((option) => option.id === id);
const allOptions = (options: readonly QuoteOption[], ids: readonly string[]): boolean =>
  ids.every((id) => isOption(options, id));

function requiredText(value: string, label: string): string | undefined {
  if (value === '') return `${label} alanını doldurun.`;
  if (value.length > MAX_SHORT_TEXT) return `${label} en fazla ${MAX_SHORT_TEXT} karakter olabilir.`;
  return undefined;
}

function resolveProducts(line: QuoteLine, selected: readonly string[]): { products: string[]; error?: string } {
  if (isSingleProductLine(line)) return { products: [line.products[0].id] };
  if (!allOptions(line.products, selected)) return { products: [], error: 'Seçilen ürün bu ürün ailesine ait değil.' };
  if (selected.length === 0) return { products: [], error: 'En az bir ürün seçin.' };
  return { products: [...new Set(selected)] };
}

function validateLineFields(line: QuoteLine, input: Record<string, unknown>): { errors: QuoteErrors; fields: Partial<QuoteRequest> } {
  const selection = resolveProducts(line, list(input.products));
  const requestTypes = hasExtra(line, 'requestType') ? list(input.requestTypes) : [];
  const jobTitle = hasExtra(line, 'jobTitle') ? text(input.jobTitle) : '';
  const scalypsoMode = hasExtra(line, 'scalypsoMode') ? text(input.scalypsoMode) : '';
  const customerNumber = hasExtra(line, 'customerNumber') ? text(input.customerNumber) : '';
  const isStudent = hasExtra(line, 'student');
  const department = isStudent ? text(input.department) : '';
  const documentAck = isStudent && input.documentAck === true;

  const errors: QuoteErrors = {
    ...(selection.error ? { products: selection.error } : {}),
    ...(hasExtra(line, 'requestType') && (requestTypes.length === 0 || !allOptions(REQUEST_TYPES, requestTypes))
      ? { requestTypes: 'Talep türünü seçin.' }
      : {}),
    ...(jobTitle !== '' && !isOption(JOB_TITLES, jobTitle) ? { jobTitle: 'Listeden bir iş tanımı seçin.' } : {}),
    ...(hasExtra(line, 'scalypsoMode') && !isOption(SCALYPSO_MODES, scalypsoMode)
      ? { scalypsoMode: 'Deneme veya teklif seçeneklerinden birini seçin.' }
      : {}),
    ...(hasExtra(line, 'customerNumber') && requiredText(customerNumber, 'Müşteri numarası')
      ? { customerNumber: requiredText(customerNumber, 'Müşteri numarası') }
      : {}),
    ...(isStudent && !isOption(STUDENT_DEPARTMENTS, department) ? { department: 'Bölümünüzü seçin.' } : {}),
    ...(isStudent && !documentAck ? { documentAck: 'Geçerli öğrenci belgeniz olduğunu onaylayın.' } : {}),
  };

  return {
    errors,
    fields: { products: selection.products, requestTypes, jobTitle, scalypsoMode, customerNumber, department, documentAck },
  };
}

function validateContact(input: Record<string, unknown>, isStudent: boolean): { errors: QuoteErrors; fields: Partial<QuoteRequest> } {
  const fullName = text(input.fullName);
  const email = text(input.email);
  const rawPhone = text(input.phone);
  const phone = rawPhone.replace(/\D/g, '');
  const company = text(input.company);
  const city = text(input.city);
  const workArea = isStudent ? STUDENT_WORK_AREA_ID : text(input.workArea);
  const heardFrom = list(input.heardFrom);
  const notes = text(input.notes);
  const consent = input.consent === true;
  const companyLabel = isStudent ? 'Üniversite' : 'Firma';
  const phoneIsValid =
    PHONE_ALLOWED_PATTERN.test(rawPhone) && phone.length >= MIN_PHONE_DIGITS && phone.length <= MAX_PHONE_DIGITS;

  const errors: QuoteErrors = {
    ...(fullName.length < MIN_NAME_LENGTH || fullName.length > MAX_SHORT_TEXT ? { fullName: 'Adınızı ve soyadınızı yazın.' } : {}),
    ...(!EMAIL_PATTERN.test(email) || email.length > MAX_SHORT_TEXT
      ? { email: 'Geçerli bir e-posta adresi yazın. Örnek: ad@firma.com' }
      : {}),
    ...(!phoneIsValid ? { phone: 'Telefon numaranızı rakamlarla yazın. Örnek: 0532 000 00 00' } : {}),
    ...(requiredText(company, companyLabel) ? { company: requiredText(company, companyLabel) } : {}),
    ...(requiredText(city, 'Şehir') ? { city: requiredText(city, 'Şehir') } : {}),
    ...(!isOption(WORK_AREAS, workArea) ? { workArea: 'Çalışma alanınızı seçin.' } : {}),
    ...(heardFrom.length === 0 || !allOptions(HEARD_FROM, heardFrom)
      ? { heardFrom: 'Bizi nereden duyduğunuzu seçin.' }
      : {}),
    ...(notes.length > MAX_NOTES ? { notes: `Notlar en fazla ${MAX_NOTES} karakter olabilir.` } : {}),
    ...(!consent ? { consent: 'Devam etmek için aydınlatma metnini onaylayın.' } : {}),
  };

  return { errors, fields: { fullName, email, phone, company, city, workArea, heardFrom: [...new Set(heardFrom)], notes, consent } };
}

export function validateQuoteRequest(raw: unknown): QuoteValidationResult {
  const input: Record<string, unknown> = raw !== null && typeof raw === 'object' ? (raw as Record<string, unknown>) : {};

  // The honeypot is invisible to people; a filled value means an automated submission.
  if (text(input.website) !== '') return { ok: false, errors: { form: 'spam' } };

  const line = findQuoteLine(input.line);
  const lineResult = line ? validateLineFields(line, input) : { errors: { line: 'Bir ürün ailesi seçin.' } as QuoteErrors, fields: {} };
  const contactResult = validateContact(input, hasExtra(line, 'student'));
  const errors: QuoteErrors = { ...lineResult.errors, ...contactResult.errors };

  if (!line || Object.keys(errors).length > 0) return { ok: false, errors };
  return { ok: true, value: { line: line.id, ...lineResult.fields, ...contactResult.fields } as QuoteRequest };
}
