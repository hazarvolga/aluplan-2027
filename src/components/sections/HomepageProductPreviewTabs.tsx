import content from '@/data/homepage-2027-preview.json';
import { ProductTabs } from './ProductTabs';

export function HomepageProductPreviewTabs() {
  return <ProductTabs items={content.productLinks} />;
}
