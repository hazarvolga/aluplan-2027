// Single source of truth for the on-site quote form: the form, the notification mail
// and the spreadsheet columns all read this catalog. Adding a product is one line here.

export type QuoteExtra = 'requestType' | 'jobTitle' | 'scalypsoMode' | 'customerNumber' | 'student';

export interface QuoteOption {
  id: string;
  label: string;
}

export interface QuoteLine {
  id: string;
  group: string;
  label: string;
  hint: string;
  productsLegend: string;
  products: readonly QuoteOption[];
  extras: readonly QuoteExtra[];
}

export interface QuotePreselection {
  line: string | null;
  products: string[];
}

export const STUDENT_DOWNLOAD_URL = 'https://info.allplan.com/en/demo-download/cad-software-v2.html';
export const STUDENT_LINE_ID = 'ogrenci';
export const STUDENT_WORK_AREA_ID = 'ogrenci';

export const QUOTE_GROUPS: readonly QuoteOption[] = [
  { id: 'allplan-ve-yapisal', label: 'ALLPLAN ve yapısal çözümler' },
  { id: 'tesisat-ve-diger', label: 'Tesisat ve diğer ürünler' },
  { id: 'eklentiler', label: 'Eklentiler' },
  { id: 'ogrenci', label: 'Öğrenciler' },
];

export const REQUEST_TYPES: readonly QuoteOption[] = [
  { id: 'teknik-bilgi', label: 'Teknik bilgi talep ediyorum' },
  { id: 'fiyat-teklifi', label: 'Fiyat teklifi talep ediyorum' },
];

export const SCALYPSO_MODES: readonly QuoteOption[] = [
  { id: 'deneme', label: 'Denemek istiyorum' },
  { id: 'teklif', label: 'Fiyat teklifi istiyorum' },
];

export const JOB_TITLES: readonly QuoteOption[] = [
  { id: 'steel-detailer', label: 'Steel Detailer' },
  { id: 'senior-steel-detailer', label: 'Senior Steel Detailer' },
  { id: 'owner-operator', label: 'Owner/Operator' },
  { id: 'project-manager', label: 'Project Manager' },
  { id: 'structural-engineer', label: 'Structural Engineer' },
  { id: 'bim-coordinator', label: 'BIM Coordinator' },
  { id: 'cad-designer', label: 'CAD Designer' },
  { id: 'fabrication-manager', label: 'Fabrication Manager' },
];

export const STUDENT_DEPARTMENTS: readonly QuoteOption[] = [
  { id: 'mimarlik', label: 'Mimarlık' },
  { id: 'insaat-muhendisligi', label: 'İnşaat Mühendisliği' },
  { id: 'yapi-isletmesi', label: 'Yapı İşletmesi' },
  { id: 'insaat-teknolojisi', label: 'İnşaat Teknolojisi' },
  { id: 'ic-mimarlik', label: 'İç Mimarlık' },
];

export const WORK_AREAS: readonly QuoteOption[] = [
  { id: 'ozel', label: 'Özel' },
  { id: 'kurum-belediye', label: 'Kurum / Belediye' },
  { id: 'universite', label: 'Üniversite' },
  { id: STUDENT_WORK_AREA_ID, label: 'Öğrenci' },
];

export const HEARD_FROM: readonly QuoteOption[] = [
  { id: 'instagram', label: 'Instagram' },
  { id: 'facebook', label: 'Facebook' },
  { id: 'google', label: 'Google' },
  { id: 'linkedin', label: 'LinkedIn' },
  { id: 'twitter', label: 'Twitter' },
  { id: 'referans', label: 'Referans' },
  { id: 'aluplan-com-tr', label: 'aluplan.com.tr' },
];

export const STUDENT_VALID_DOCUMENTS: readonly string[] = [
  'YÖK e-Devlet öğrenci belgesi',
  'Güncel tarihli',
  'Öğrencilik durumu: Aktif Öğrenci',
];

export const STUDENT_INVALID_DOCUMENTS: readonly string[] = [
  'Öğrenci Kimlik Kartı',
  'Not Döküm Belgesi (Transcript)',
  'ÖSYM Sonuç Belgesi',
  'Öğrenci Not Belgesi',
  'Öğrenci Not Durum Belgesi',
  'Tarihi 1 haftadan eski olan YÖK e-Devlet Öğrenci Belgesi',
  'Başarı Durum Belgesi',
  'Öğrenci Sertifikası',
  'Mezun Belgesi',
  'Açık Öğretim Öğrenci Belgesi',
];

const PRODUCTS_LEGEND = 'İlgilendiğiniz ürünler';
const MODULES_LEGEND = 'İlgilendiğiniz modüller';

export const QUOTE_LINES: readonly QuoteLine[] = [
  {
    id: 'allplan',
    group: 'allplan-ve-yapisal',
    label: 'ALLPLAN',
    hint: 'Basic, Concept, Professional, Ultimate, Civil, Precast, Max',
    productsLegend: PRODUCTS_LEGEND,
    extras: ['requestType'],
    products: [
      { id: 'allplan-basic', label: 'ALLPLAN Basic' },
      { id: 'allplan-concept', label: 'ALLPLAN Concept' },
      { id: 'allplan-professional', label: 'ALLPLAN Professional' },
      { id: 'allplan-ultimate', label: 'ALLPLAN Ultimate' },
      { id: 'allplan-civil', label: 'ALLPLAN Civil' },
      { id: 'allplan-precast', label: 'ALLPLAN Precast' },
      { id: 'allplan-max', label: 'ALLPLAN Max' },
      { id: 'allplan-license-server', label: 'ALLPLAN License Server' },
      { id: 'bimplus', label: 'Allplan Bimplus' },
    ],
  },
  {
    id: 'frilo-scia',
    group: 'allplan-ve-yapisal',
    label: 'FRILO ve SCIA',
    hint: 'Yapısal analiz ve tasarım',
    productsLegend: PRODUCTS_LEGEND,
    extras: ['requestType'],
    products: [
      { id: 'frilo-editions', label: 'FRILO Editions' },
      { id: 'frilo-geotechnics', label: 'FRILO Geotechnics' },
      { id: 'scia-engineer', label: 'SCIA Engineer Editions' },
    ],
  },
  {
    id: 'sds2',
    group: 'allplan-ve-yapisal',
    label: 'SDS2',
    hint: 'Çelik detaylandırma',
    productsLegend: PRODUCTS_LEGEND,
    extras: ['requestType', 'jobTitle'],
    products: [{ id: 'sds2', label: 'SDS2 | Steel Detailing Software' }],
  },
  {
    id: 'ax3000',
    group: 'tesisat-ve-diger',
    label: 'AX3000 MEP',
    hint: 'Mekanik ve elektrik tesisat',
    productsLegend: MODULES_LEGEND,
    extras: ['requestType'],
    products: [
      { id: 'ax3000-havalandirma', label: 'Havalandırma (akustik hesaplama ve konut havalandırma dahil)' },
      { id: 'ax3000-isitma', label: 'Isıtma (döşemeden ısıtma ve TS825 ısı kaybı hesabı dahil)' },
      { id: 'ax3000-sogutma', label: 'Soğutma' },
      { id: 'ax3000-sihhi-tesisat', label: 'Sıhhi Tesisat (grafiksel sprinkler ve yağmur suyu dahil)' },
      { id: 'ax3000-elektrik', label: 'Elektrik' },
    ],
  },
  {
    id: 'bimx5',
    group: 'tesisat-ve-diger',
    label: 'BIMX5',
    hint: 'Hakediş, imar ve kurum raporları',
    productsLegend: PRODUCTS_LEGEND,
    extras: ['requestType'],
    products: [
      { id: 'bimx5-oska-e-hakedis-pro', label: 'Oska e-Hakediş Pro' },
      { id: 'bimx5-2b-dwg-converter', label: '2B DWG Converter' },
      { id: 'bimx5-imar-yonetmeligi', label: 'İmar Yönetmeliği Eklentisi' },
      { id: 'bimx5-kurumlar-raporlari', label: 'Kurumlar Raporları Eklentisi' },
    ],
  },
  {
    id: 'bimflex',
    group: 'tesisat-ve-diger',
    label: 'BIMFlex',
    hint: 'FlexSoft donatı otomasyonu',
    productsLegend: PRODUCTS_LEGEND,
    extras: ['requestType'],
    products: [{ id: 'bimflex', label: 'FlexSoft BIMFlex' }],
  },
  {
    id: 'cds-addon',
    group: 'eklentiler',
    label: 'CDS Allplan Add-On',
    hint: 'Dokuz modüllü eklenti paketi',
    productsLegend: MODULES_LEGEND,
    extras: ['requestType'],
    products: [
      { id: 'cds-surus-egrisi', label: 'Sürüş Eğrisi' },
      { id: 'cds-rampa', label: 'Rampa' },
      { id: 'cds-geometri-araclari', label: 'Geometri Araçları' },
      { id: 'cds-parametrik-arazi', label: 'Parametrik Arazi' },
      { id: 'cds-celik-profil-bilesenleri', label: 'Çelik Profil Bileşenleri' },
      { id: 'cds-3b-olculendirme', label: '3B Ölçülendirme' },
      { id: 'cds-2b-dwg-converter', label: '2B DWG Converter' },
      { id: 'cds-sketchup-donusturucu', label: 'SketchUp Dönüştürücü' },
      { id: 'cds-grafiksel-yazi', label: 'Grafiksel Yazı' },
    ],
  },
  {
    id: 'pythonpart',
    group: 'eklentiler',
    label: 'Allto PythonPart',
    hint: 'Donatı ve modelleme PythonPart araçları',
    productsLegend: MODULES_LEGEND,
    extras: ['requestType'],
    products: [
      { id: 'pythonpart-wall-reinforcement', label: 'Wall Reinforcement' },
      { id: 'pythonpart-wall-opening-edge', label: 'Wall Opening and Wall Edge Reinforcement' },
      { id: 'pythonpart-beam-reinforcement', label: 'Beam Reinforcement' },
      { id: 'pythonpart-column-reinforcement', label: 'Column Reinforcement' },
      { id: 'pythonpart-single-footing', label: 'Single Footing Reinforcement' },
      { id: 'pythonpart-strip-footing', label: 'Strip Footing Reinforcement' },
      { id: 'pythonpart-ifc-model-changes', label: 'Detecting IFC Model Changes' },
      { id: 'pythonpart-slab-with-opening', label: 'Slab With Opening' },
      { id: 'pythonpart-slab-main-rebar', label: 'Slab Main Rebar' },
      { id: 'pythonpart-column-dowels', label: 'Column dowels' },
      { id: 'pythonpart-layout-service', label: 'Layout Service' },
      { id: 'pythonpart-2d-axis-grid', label: '2D Axis Grid in ALLPLAN Engineering' },
    ],
  },
  {
    id: 'scalypso',
    group: 'eklentiler',
    label: 'Scalypso',
    hint: 'Nokta bulutu eklentisi',
    productsLegend: PRODUCTS_LEGEND,
    extras: ['scalypsoMode'],
    products: [{ id: 'scalypso', label: 'Scalypso Eklentisi' }],
  },
  {
    id: 'aluplan-bim-eklentisi',
    group: 'eklentiler',
    label: 'Aluplan BIM Eklentisi',
    hint: 'BIM kütüphanesi ve poz katalogları',
    productsLegend: PRODUCTS_LEGEND,
    extras: ['customerNumber'],
    products: [{ id: 'aluplan-bim-eklentisi', label: 'Aluplan BIM Eklentisi' }],
  },
  {
    id: STUDENT_LINE_ID,
    group: 'ogrenci',
    label: 'Allplan Öğrenci Sürümü',
    hint: 'Öğrenciler için ücretsiz indirme',
    productsLegend: PRODUCTS_LEGEND,
    extras: ['student'],
    products: [{ id: 'allplan-ogrenci-surumu', label: 'Allplan Öğrenci Versiyonu' }],
  },
];

export function findQuoteLine(lineId: unknown): QuoteLine | null {
  return QUOTE_LINES.find((line) => line.id === lineId) ?? null;
}

export function hasExtra(line: QuoteLine | null, extra: QuoteExtra): boolean {
  return line !== null && line.extras.includes(extra);
}

/** A line with one product needs no product question: that product is the request. */
export function isSingleProductLine(line: QuoteLine): boolean {
  return line.products.length === 1;
}

/** Maps a `?urun=` slug (a line id or a product id) to the form's starting selection. */
export function resolvePreselection(slug: unknown): QuotePreselection {
  if (typeof slug !== 'string' || slug === '') return { line: null, products: [] };
  const line = findQuoteLine(slug);
  if (line) return { line: line.id, products: isSingleProductLine(line) ? [line.products[0].id] : [] };
  const owner = QUOTE_LINES.find((candidate) => candidate.products.some((product) => product.id === slug));
  return owner ? { line: owner.id, products: [slug] } : { line: null, products: [] };
}
