import type { PageRecord } from './site-data';

export function relatedBridgeLinks(page: Pick<PageRecord, 'path' | 'contentLinks'>) {
  const paths = page.path === '/solutions/bridge-design'
    ? ['/solutions/modeling-of-precast-girder-bridges', '/solutions/features-allplan-bridge']
    : page.path === '/products/civil' ? ['/solutions/modeling-of-precast-girder-bridges'] : [];
  return page.contentLinks.filter((link) => paths.includes(link.href));
}
