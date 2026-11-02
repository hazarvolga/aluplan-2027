import pagesJson from '@/data/pages.json';
import playlistsJson from '@/data/playlists.json';
import navigationJson from '@/data/navigation.json';
import homepageJson from '@/data/homepage.json';
import searchIndexJson from '@/data/search-index.json';
import videoLibraryJson from '@/data/video-library.json';

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

export interface SectionLink {
  href: string;
  label: string;
}

export interface PageSection {
  heading: string;
  level: number;
  items: string[];
  iconSrc?: string;
  image?: ContentImage;
  statValue?: string;
  link?: SectionLink;
}

export interface ContentLink {
  href: string;
  text: string;
  external: boolean;
}

export interface SolutionDirectoryItem {
  title: string;
  href: string;
  description: string;
  external: boolean;
  image?: ContentImage;
}

export interface SolutionDirectoryGroup {
  title: string;
  hubPath: string;
  hubItems: SolutionDirectoryItem[];
  catalogItems: SolutionDirectoryItem[];
}

export interface SolutionDirectory {
  catalogIntro: {
    kicker: string;
    title: string;
    description: string;
  };
  groups: SolutionDirectoryGroup[];
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

export interface StructuredAction {
  sourceId: string;
  text: string;
  href: string;
  external?: boolean;
}

export interface StructuredIntro {
  paragraphs?: string[];
  kicker?: string;
  title?: string;
  bullets: string[];
  videoEmbedUrl?: string | null;
  imageSrc?: string | null;
  imageAlt?: string | null;
  actions?: StructuredAction[];
}

export interface StructuredWorkflowLink {
  text: string;
  href: string;
  external?: boolean;
  accentKey: 'package' | 'architect' | 'engineer' | 'fabricator';
}

export interface StructuredStatItem {
  value: string;
  label: string;
  description: string;
}

export interface StructuredBenefitItem {
  sourceId?: string;
  iconSrc?: string;
  subtitle?: string | null;
  title: string;
  description: string;
}

export interface StructuredMediaCardItem {
  sourceId?: string;
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
  sourceId?: string;
  kicker?: string;
  title: string;
  lead?: string;
  subheading?: string;
  description?: string;
  paragraphs?: string[];
  bullets?: string[];
  imageSrc?: string;
  youtubeId?: string | null;
  videoSrc?: string | null;
  reverse?: boolean;
  ctaText?: string;
  ctaHref?: string;
  external?: boolean;
}

export interface StructuredBenefitsSection {
  kicker?: string;
  title: string;
  items: StructuredBenefitItem[];
}

export interface StructuredLinkGroupItem {
  text: string;
  href: string;
  external?: boolean;
}

export interface StructuredLinkGroupCard {
  sourceId: string;
  title: string;
  imageSrc: string;
  links: StructuredLinkGroupItem[];
}

export interface StructuredLinkGroupGridSection {
  kicker?: string;
  title: string;
  subtitle?: string;
  columns?: number;
  items: StructuredLinkGroupCard[];
}

export type StructuredContentBlock =
  | { sourceId: string; kind: 'intro'; content: StructuredIntro }
  | { sourceId: string; kind: 'challenges'; items: string[]; title?: string }
  | { sourceId: string; kind: 'stats'; items: StructuredStatItem[] }
  | { sourceId: string; kind: 'linkGroupGrid'; content: StructuredLinkGroupGridSection }
  | { sourceId: string; kind: 'benefits'; content: StructuredBenefitsSection }
  | { sourceId: string; kind: 'mediaGrid'; content: StructuredMediaGridSection }
  | { sourceId: string; kind: 'splitCallouts'; items: StructuredSplitCallout[] };

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

export interface StructuredTrainingTabs {
  title: string;
  tabs: {
    key: string;
    label: string;
    title: string;
    paragraphs: string[];
    features: string[];
    href: string;
    linkLabel: string;
    imageSrc?: string;
  }[];
}

export interface StructuredPageLayout {
  contentBlocks?: StructuredContentBlock[];
  trainingTabs?: StructuredTrainingTabs;
  intro?: StructuredIntro;
  workflowLinks?: StructuredWorkflowLink[] | null;
  stats?: StructuredStatItem[];
  challenges?: string[];
  benefits?: StructuredBenefitsSection;
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

export interface SiteIdentity {
  name: string;
  alternateName: string;
  description: string;
  foundingDate: string;
  email: string;
  telephone: string;
  displayPhones: string[];
  phoneLinks: string[];
  address: {
    '@type': 'PostalAddress';
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry: string;
  };
  displayAddress: string;
  sameAs: string[];
}

interface NavigationData {
  siteIdentity: SiteIdentity;
  solutionDirectory: SolutionDirectory;
  [key: string]: unknown;
}

const pagesMap = pagesJson as unknown as Record<string, PageRecord>;
const playlistsMap = playlistsJson as unknown as Record<string, PlaylistRecord>;
const navigationData = navigationJson as unknown as NavigationData;

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

export function getSolutionDirectory(): SolutionDirectory {
  return navigationData.solutionDirectory;
}

export function getSolutionHub(pathname: string): SolutionDirectoryGroup | null {
  const key = normalizeLookupPath(pathname);
  return navigationData.solutionDirectory.groups.find((group) => group.hubPath === key) || null;
}

export function getSolutionCatalog(): SolutionDirectory {
  return navigationData.solutionDirectory;
}

export function getSiteIdentity(): SiteIdentity {
  return navigationData.siteIdentity;
}

export function getHomepageData() {
  return homepageJson;
}

export function getVideoLibraryData() {
  return videoLibraryJson;
}

export function getSearchIndex(): SearchEntry[] {
  return searchIndexJson as SearchEntry[];
}
