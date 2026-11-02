import content from '@/data/homepage-2027-preview.json';
import { ProductTabs } from './ProductTabs';

const images: Record<string, string> = {
  'ALLPLAN Max': '/assets/previews/home-2027/allplan-max-generated-v2.jpg',
  ALLPLAN: '/assets/heroes/families/vf-07-allplan-product-platform.jpg',
  'ALLPLAN Civil': '/assets/previews/allplan-civil-2027/civil-hero.jpg',
  FRILO: '/assets/previews/frilo/frilo-hero.jpg',
  SCIA: '/assets/previews/scia/capability-1.jpg',
  SDS2: '/assets/heroes/families/vf-03-construction-fabrication.jpg',
};

export function HomepageProductPreviewTabs() {
  return <ProductTabs items={content.productLinks.map(item => ({ ...item, image: images[item.name] }))} />;
}
