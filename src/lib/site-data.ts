import pagesJson from '@/data/pages.json';
import playlistsJson from '@/data/playlists.json';
import navigationJson from '@/data/navigation.json';
import homepageJson from '@/data/homepage.json';
import searchIndexJson from '@/data/search-index.json';

export const SITE_ORIGIN = 'https://aluplan.com.tr';
export const TRIAL_CTA_URL = 'https://www.allplan.com/trial-or-subscription/';
export const MAIN_QUOTE_FORM_URL = 'https://forms.office.com/r/hXhnKAG912';
export const SUPPORT_PORTAL_URL = 'https://allplan.net.tr/tr';

export interface BreadcrumbItem {
  label: string;
  href: string;
}

export interface PageHeading {
  level: number;
  text: string;
}

export interface PageSection {
  heading: string;
  level: number;
  items: string[];
  iconSrc?: string;
  image?: ContentImage;
  statValue?: string;
}

export interface ContentLink {
  href: string;
  text: string;
  external: boolean;
}

export interface ContentImage {
  src: string;
  alt: string;
  isIcon?: boolean;
}

export interface ContentVideo {
  src: string;
  poster?: string | null;
  title?: string;
  controls?: boolean;
  autoplay?: boolean;
}

export interface ContentEmbed {
  src: string;
  title: string;
}

export interface InteractiveState {
  label: string;
  texts: string[];
}

export interface StructuredIntro {
  kicker?: string;
  title: string;
  bullets: string[];
  videoEmbedUrl?: string | null;
}

export interface StructuredWorkflowLink {
  text: string;
  href: string;
  external?: boolean;
  color?: string;
}

export interface StructuredStatItem {
  value: string;
  label: string;
  description: string;
}

export interface StructuredBenefitItem {
  iconSrc?: string;
  subtitle?: string | null;
  title: string;
  description: string;
}

export interface StructuredMediaCardItem {
  title: string;
  subtitle?: string | null;
  badge?: string | null;
  description: string;
  bullets?: string[];
  imageSrc?: string | null;
  youtubeId?: string | null;
  href?: string | null;
  ctaText?: string | null;
  external?: boolean;
}

export interface StructuredMediaGridSection {
  kicker?: string;
  title: string;
  subtitle?: string;
  columns?: number;
  items: StructuredMediaCardItem[];
}

export interface StructuredWorkflowTabCategory {
  key: string;
  label: string;
  items: StructuredMediaCardItem[];
}

export interface StructuredWorkflowTabsSection {
  kicker?: string;
  title: string;
  subtitle?: string;
  categories: StructuredWorkflowTabCategory[];
}

export interface StructuredSplitCallout {
  kicker?: string;
  title: string;
  lead?: string;
  subheading?: string;
  description: string;
  imageSrc: string;
  ctaText?: string;
  ctaHref?: string;
  external?: boolean;
}

export interface StructuredFaqItem {
  question: string;
  answer: string;
  bullets?: string[];
  note?: string;
  table?: {
    headers: string[];
    rows: string[][];
  };
}

export interface StructuredFaqCategory {
  id: string;
  label: string;
  iconName?: string;
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaHref?: string;
  items: StructuredFaqItem[];
}

export interface StructuredFaqDirectory {
  kicker?: string;
  title: string;
  subtitle?: string;
  categories: StructuredFaqCategory[];
}

export interface StructuredReferenceCategory {
  id: string;
  label: string;
  iconName: string;
  count: number;
}

export interface StructuredReferenceItem {
  name: string;
  category: string;
  iconName: string;
}

export interface StructuredReferencesDirectory {
  kicker?: string;
  title: string;
  subtitle?: string;
  categories: StructuredReferenceCategory[];
  items: StructuredReferenceItem[];
}

export interface StructuredPageLayout {
  intro?: StructuredIntro;
  workflowLinks?: StructuredWorkflowLink[] | null;
  stats?: StructuredStatItem[];
  challenges?: string[];
  benefits?: {
    kicker?: string;
    title: string;
    items: StructuredBenefitItem[];
  };
  coreFeatures?: StructuredMediaGridSection;
  workflowTabs?: StructuredWorkflowTabsSection;
  splitCallouts?: StructuredSplitCallout[];
  extraGrids?: StructuredMediaGridSection[];
  faq?: {
    title: string;
    items: StructuredFaqItem[];
  } | null;
  referencesDirectory?: StructuredReferencesDirectory;
  faqDirectory?: StructuredFaqDirectory;
}

export interface PageRecord {
  path: string;
  section: string;
  title: string;
  description: string;
  canonical: string;
  h1: string;
  eyebrow: string;
  breadcrumbs: BreadcrumbItem[];
  headings: PageHeading[];
  bodyNodes: string[];
  sections: PageSection[];
  contentLinks: ContentLink[];
  buttons: string[];
  images: ContentImage[];
  videos?: ContentVideo[];
  embeds: ContentEmbed[];
  playlistId: string | null;
  interactiveStates: InteractiveState[];
  schemaType: string;
  structuredLayout?: StructuredPageLayout | null;
}

export interface PlaylistVideo {
  id: string;
  title: string;
  description?: string;
  duration?: string;
  category?: string;
}

export interface PlaylistRecord {
  id: string;
  url: string;
  key: string;
  title: string;
  subtitle?: string;
  count: number;
  videos: PlaylistVideo[];
}

export interface SearchEntry {
  path: string;
  title: string;
  seoTitle: string;
  section: string;
  description: string;
  keywords: string;
}

const pagesMap = pagesJson as unknown as Record<string, PageRecord>;
const playlistsMap = playlistsJson as unknown as Record<string, PlaylistRecord>;

export function normalizeLookupPath(pathname: string): string {
  if (!pathname || pathname === '/') return '/';
  const decoded = decodeURIComponent(pathname).replace(/\/+$/, '') || '/';
  if (decoded === '/solutions/imar-yonetmliği-bim-eklentisi') {
    return '/solutions/imar-yonetmeligi-bim-eklentisi';
  }
  return decoded;
}

export function getPageData(pathname: string): PageRecord | null {
  const key = normalizeLookupPath(pathname);
  return pagesMap[key] || null;
}

export function getAllPagePaths(): string[] {
  return Object.keys(pagesMap);
}

export function getAllPages(): PageRecord[] {
  return Object.values(pagesMap);
}

export function getPlaylistData(playlistId: string): PlaylistRecord | null {
  return playlistsMap[playlistId] || null;
}

export function getAllPlaylists(): PlaylistRecord[] {
  return Object.values(playlistsMap);
}

export function getNavigationData() {
  return navigationJson;
}

export function getHomepageData() {
  return homepageJson;
}

export function getSearchIndex(): SearchEntry[] {
  return searchIndexJson as SearchEntry[];
}
