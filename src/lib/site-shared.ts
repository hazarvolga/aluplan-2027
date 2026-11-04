// Client-safe site data: constants, navigation, homepage and search index, without the full page dataset.
import navigationJson from '@/data/navigation.json';
import homepageJson from '@/data/homepage.json';
import type {
  NavigationData,
  SiteIdentity,
  SolutionDirectory,
  SolutionDirectoryGroup
} from './site-data';

export const SITE_ORIGIN = 'https://aluplan.com.tr';
export const TRIAL_CTA_URL = 'https://www.allplan.com/trial-or-subscription/';
export const MAIN_QUOTE_FORM_URL = 'https://forms.office.com/r/hXhnKAG912';
export const SUPPORT_PORTAL_URL = 'https://allplan.net.tr/tr';

const navigationData = navigationJson as unknown as NavigationData;

export function normalizeLookupPath(pathname: string): string {
  if (!pathname || pathname === '/') return '/';
  const decoded = decodeURIComponent(pathname).replace(/\/+$/, '') || '/';
  if (decoded === '/solutions/imar-yonetmliği-bim-eklentisi') {
    return '/solutions/imar-yonetmeligi-bim-eklentisi';
  }
  return decoded;
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
