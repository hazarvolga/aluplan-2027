/**
 * Sections whose routes render their OWN chrome (own layout/shell) instead of the
 * site-wide SiteShell. Add a prefix here to give a new standalone area its own shell.
 */
export const OWN_CHROME_PREFIXES = ['/akademi'] as const;

/** True when the path is, or is nested under, a section that supplies its own chrome. */
export function hasOwnChrome(pathname: string): boolean {
  return OWN_CHROME_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}
