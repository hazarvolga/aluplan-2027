// Builds the two mails sent for a quote request: one for the sales team, one for the requester.
// Pure functions: no sending, no environment access. Mail clients ignore stylesheets and
// CSS variables, so the markup is table-based with literal inline styles.
import {
  HEARD_FROM,
  JOB_TITLES,
  REQUEST_TYPES,
  SCALYPSO_MODES,
  STUDENT_DEPARTMENTS,
  STUDENT_DOWNLOAD_URL,
  STUDENT_INVALID_DOCUMENTS,
  STUDENT_VALID_DOCUMENTS,
  WORK_AREAS,
  findQuoteLine,
  hasExtra,
  type QuoteOption,
} from './quote-catalog';
import type { QuoteRequest } from './quote-validation';

export interface MailMessage {
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
}

export interface QuoteMailMeta {
  receivedAt: string;
  sourcePath?: string;
}

type Row = readonly [label: string, value: string];

const DATA_OPEN = '[[ALUPLAN-TALEP]]';
const DATA_CLOSE = '[[/ALUPLAN-TALEP]]';
const SITE_URL = 'https://aluplan.com.tr';
const CONTACT_PHONE = '(+90) 216 225 84 41';
const CONTACT_EMAIL = 'info@aluplan.com.tr';
const CONTACT_ADDRESS = 'Quick Tower – Workinton, İçerenköy Mah. Topçu İbrahim Sok. 8/10D No: 5, 34752 Ataşehir / İstanbul';

const COLOR = {
  page: '#F5F7FA',
  card: '#FFFFFF',
  band: '#181A1B',
  bandText: '#F5F7FA',
  bandMuted: '#B8C0CC',
  text: '#181A1B',
  muted: '#5B6470',
  border: '#D3D9E2',
  successBg: '#EAF6EE',
  successText: '#1B6B3A',
  dangerBg: '#FDECEC',
  dangerText: '#B42318',
} as const;
const FONT = "font-family:'Segoe UI',Helvetica,Arial,sans-serif";

const escapeHtml = (value: string): string =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const multiline = (value: string): string => escapeHtml(value).replace(/\r?\n/g, '<br>');
// A subject is a mail header: a line break in user text must never start a new header.
const headerSafe = (value: string): string => value.replace(/[\r\n]+/g, ' ').trim();
const labelOf = (options: readonly QuoteOption[], id: string): string =>
  options.find((option) => option.id === id)?.label ?? id;
const labelsOf = (options: readonly QuoteOption[], ids: readonly string[]): string =>
  ids.map((id) => labelOf(options, id)).join(', ');
// Shown to people in Turkish local time; the data row keeps the exact ISO timestamp.
function formatDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat('tr-TR', { dateStyle: 'long', timeStyle: 'short', timeZone: 'Europe/Istanbul' }).format(date);
}
const filled = (rows: readonly Row[]): Row[] => rows.filter(([, value]) => value !== '');

function describe(request: QuoteRequest) {
  const line = findQuoteLine(request.line);
  return {
    isStudent: hasExtra(line, 'student'),
    lineLabel: line?.label ?? request.line,
    products: labelsOf(line?.products ?? [], request.products),
    requestTypes: labelsOf(REQUEST_TYPES, request.requestTypes),
    jobTitle: request.jobTitle ? labelOf(JOB_TITLES, request.jobTitle) : '',
    scalypsoMode: request.scalypsoMode ? labelOf(SCALYPSO_MODES, request.scalypsoMode) : '',
    department: request.department ? labelOf(STUDENT_DEPARTMENTS, request.department) : '',
    workArea: labelOf(WORK_AREAS, request.workArea),
    heardFrom: labelsOf(HEARD_FROM, request.heardFrom),
  };
}

function shell(title: string, preheader: string, body: string): string {
  return `<!DOCTYPE html>
<html lang="tr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light">
<title>${escapeHtml(title)}</title>
</head>
<body style="margin:0;padding:0;background:${COLOR.page};${FONT};color:${COLOR.text};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${COLOR.page};">
<tr><td align="center" style="padding:24px 12px;">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;background:${COLOR.card};border:1px solid ${COLOR.border};">
<tr><td style="background:${COLOR.band};padding:20px 28px;">
<div style="${FONT};font-size:22px;letter-spacing:6px;color:${COLOR.bandText};">ALUPLAN</div>
<div style="${FONT};font-size:10px;letter-spacing:2px;color:${COLOR.bandMuted};padding-top:4px;">ALLPLAN TÜRKİYE DİSTRİBÜTÖRÜ</div>
</td></tr>
${body}
<tr><td style="padding:18px 28px;border-top:1px solid ${COLOR.border};${FONT};font-size:12px;line-height:18px;color:${COLOR.muted};">
Aluplan Program Sistemleri · ${escapeHtml(CONTACT_PHONE)} · <a href="mailto:${CONTACT_EMAIL}" style="color:${COLOR.muted};">${CONTACT_EMAIL}</a><br>
${escapeHtml(CONTACT_ADDRESS)}<br>
<a href="${SITE_URL}" style="color:${COLOR.muted};">aluplan.com.tr</a>
</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;
}

const heading = (title: string, lead: string): string =>
  `<tr><td style="padding:28px 28px 8px;">
<h1 style="margin:0;${FONT};font-size:22px;line-height:28px;font-weight:600;color:${COLOR.text};">${escapeHtml(title)}</h1>
<p style="margin:10px 0 0;${FONT};font-size:15px;line-height:22px;color:${COLOR.muted};">${lead}</p>
</td></tr>`;

function rowsTable(title: string, rows: readonly Row[]): string {
  const cells = rows
    .map(
      ([label, value]) => `<tr>
<td width="38%" valign="top" style="padding:9px 12px;border-bottom:1px solid ${COLOR.border};${FONT};font-size:13px;line-height:19px;color:${COLOR.muted};">${escapeHtml(label)}</td>
<td valign="top" style="padding:9px 12px;border-bottom:1px solid ${COLOR.border};${FONT};font-size:14px;line-height:20px;color:${COLOR.text};">${multiline(value)}</td>
</tr>`,
    )
    .join('\n');
  return `<tr><td style="padding:16px 28px 4px;">
<div style="${FONT};font-size:11px;letter-spacing:1.5px;font-weight:600;color:${COLOR.muted};padding-bottom:6px;">${escapeHtml(title)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid ${COLOR.border};border-bottom:0;">
${cells}
</table>
</td></tr>`;
}

const textRows = (rows: readonly Row[]): string => rows.map(([label, value]) => `${label}: ${value}`).join('\n');

export function buildStaffMail(request: QuoteRequest, meta: QuoteMailMeta): MailMessage {
  const info = describe(request);
  const companyLabel = info.isStudent ? 'Üniversite' : 'Firma';
  const requestRows = filled([
    ['Ürün ailesi', info.lineLabel],
    ['Ürünler', info.products],
    ['Talep türü', info.requestTypes],
    ['Scalypso talebi', info.scalypsoMode],
    ['İş tanımı', info.jobTitle],
    ['Müşteri numarası', request.customerNumber],
    ['Bölüm', info.department],
    ['Notlar', request.notes],
  ]);
  const contactRows = filled([
    ['Ad Soyad', request.fullName],
    [companyLabel, request.company],
    ['E-posta', request.email],
    ['GSM', request.phone],
    ['Şehir', request.city],
    ['Çalışma alanı', info.workArea],
    ['Bizi nereden duydu', info.heardFrom],
  ]);
  const metaRows = filled([
    ['Tarih', formatDate(meta.receivedAt)],
    ['Kaynak sayfa', meta.sourcePath ?? ''],
  ]);
  // One flat row for the spreadsheet flow; keys are the spreadsheet column names.
  const dataRow = JSON.stringify({
    tarih: meta.receivedAt,
    kaynak: meta.sourcePath ?? '',
    urunAilesi: info.lineLabel,
    urunler: info.products,
    talepTuru: info.requestTypes,
    scalypso: info.scalypsoMode,
    isTanimi: info.jobTitle,
    musteriNo: request.customerNumber,
    bolum: info.department,
    adSoyad: request.fullName,
    firma: request.company,
    eposta: request.email,
    gsm: request.phone,
    sehir: request.city,
    calismaAlani: info.workArea,
    neredenDuydu: info.heardFrom,
    notlar: request.notes,
  });

  const title = info.isStudent ? 'Yeni öğrenci indirme başvurusu' : 'Yeni teklif talebi';
  // Requested by the sales team: who is asking, then what for, readable in the inbox list.
  const subject = `${request.fullName} / ${info.products}`;
  const lead = `<strong style="color:${COLOR.text};">${escapeHtml(request.fullName)}</strong>, ${escapeHtml(request.company)} · ${escapeHtml(info.lineLabel)}. Bu maili yanıtladığınızda yanıtınız doğrudan talep sahibine gider.`;
  const body = [
    heading(title, lead),
    rowsTable('TALEP', requestRows),
    rowsTable('İLETİŞİM', contactRows),
    rowsTable('KAYIT', metaRows),
    `<tr><td style="padding:0 28px 20px;"><div style="display:none;max-height:0;overflow:hidden;font-size:1px;color:${COLOR.card};">${DATA_OPEN}${escapeHtml(dataRow)}${DATA_CLOSE}</div></td></tr>`,
  ].join('\n');

  return {
    subject: headerSafe(subject),
    replyTo: request.email,
    html: shell(title, `${info.lineLabel} · ${request.company}`, body),
    text: [title, '', textRows(requestRows), '', textRows(contactRows), '', textRows(metaRows), '', `${DATA_OPEN}${dataRow}${DATA_CLOSE}`].join('\n'),
  };
}

function studentBlock(): string {
  const list = (items: readonly string[]): string =>
    items.map((item) => `<li style="margin:0 0 3px;">${escapeHtml(item)}</li>`).join('');
  return `<tr><td style="padding:16px 28px 4px;">
<table role="presentation" cellpadding="0" cellspacing="0"><tr><td style="background:${COLOR.band};">
<a href="${STUDENT_DOWNLOAD_URL}" style="display:inline-block;padding:13px 24px;${FONT};font-size:15px;font-weight:600;color:${COLOR.bandText};text-decoration:none;">Allplan Öğrenci Sürümünü indir</a>
</td></tr></table>
</td></tr>
<tr><td style="padding:14px 28px 4px;">
<div style="background:${COLOR.successBg};border:1px solid ${COLOR.successText};padding:12px 16px;${FONT};font-size:13px;line-height:19px;color:${COLOR.text};">
<strong style="color:${COLOR.successText};">Geçerli öğrenci belgesi</strong>
<ul style="margin:6px 0 0;padding-left:18px;">${list(STUDENT_VALID_DOCUMENTS)}</ul>
</div>
</td></tr>
<tr><td style="padding:10px 28px 4px;">
<div style="background:${COLOR.dangerBg};border:2px solid ${COLOR.dangerText};padding:12px 16px;${FONT};font-size:13px;line-height:19px;color:${COLOR.text};">
<strong style="font-size:15px;color:${COLOR.dangerText};">Bu belgeler kabul edilmez</strong>
<ul style="margin:6px 0 0;padding-left:18px;font-weight:600;">${list(STUDENT_INVALID_DOCUMENTS)}</ul>
</div>
</td></tr>`;
}

export function buildCustomerMail(request: QuoteRequest): MailMessage {
  const info = describe(request);
  const summaryRows = filled([
    ['Ürün ailesi', info.lineLabel],
    ['Ürünler', info.products],
    ['Talep türü', info.requestTypes],
    ['Scalypso talebi', info.scalypsoMode],
    ['Bölüm', info.department],
  ]);
  const title = info.isStudent ? 'Başvurunuz bize ulaştı' : 'Talebiniz bize ulaştı';
  const followUp = info.isStudent
    ? 'Allplan Öğrenci Sürümünü aşağıdaki bağlantıdan indirebilirsiniz. Lisansın etkinleşmesi için geçerli öğrenci belgeniz gerekir.'
    : 'Ekibimiz talebinizi inceleyip en kısa sürede sizinle iletişime geçecek.';
  const lead = `Merhaba ${escapeHtml(request.fullName)}, ${escapeHtml(followUp)}`;
  const closing = `<tr><td style="padding:16px 28px 24px;${FONT};font-size:14px;line-height:21px;color:${COLOR.muted};">Sorularınız için bu maili yanıtlayabilir veya ${escapeHtml(CONTACT_PHONE)} numaralı telefondan bize ulaşabilirsiniz.</td></tr>`;
  const body = [
    heading(title, lead),
    info.isStudent ? studentBlock() : '',
    rowsTable(info.isStudent ? 'BAŞVURU ÖZETİ' : 'TALEP ÖZETİ', summaryRows),
    closing,
  ].join('\n');
  const studentText = info.isStudent
    ? ['', `İndirme bağlantısı: ${STUDENT_DOWNLOAD_URL}`, '', 'Bu belgeler kabul edilmez:', ...STUDENT_INVALID_DOCUMENTS.map((item) => `- ${item}`)]
    : [];

  return {
    subject: headerSafe(`${title} | Aluplan`),
    html: shell(title, followUp, body),
    text: [`Merhaba ${request.fullName},`, '', followUp, ...studentText, '', textRows(summaryRows), '', `Aluplan Program Sistemleri · ${CONTACT_PHONE} · ${CONTACT_EMAIL}`].join('\n'),
  };
}
