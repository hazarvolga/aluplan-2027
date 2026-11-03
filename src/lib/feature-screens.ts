import { editionScreens, featureScreens, screens } from '@/data/allplan-2027-screens';
import type { AllplanEdition2027 } from '@/data/allplan-2027-editions';
import type { ProductEditionContent } from '@/data/product-edition-content';
import type { StructuredMediaCardItem } from '@/lib/site-data';

/** Feature cards per group; a feature with a screenshot shows it in the same card as its text. */
export function productFeatureGroups(content: ProductEditionContent): { label: string; items: StructuredMediaCardItem[] }[] {
  return content.featureGroups.map(group => ({
    label: group.label,
    items: group.items.map(item => ({
      title: item.title,
      description: item.text,
      imageSrc: featureScreens[item.title] ? screens[featureScreens[item.title]].src : null
    }))
  }));
}

/** Feature cards (label, text, screenshot) of an Allplan 2027 news page. */
export function editionNewsItems(edition: AllplanEdition2027): StructuredMediaCardItem[] {
  return edition.features.map(feature => ({
    title: feature.label,
    description: feature.text,
    imageSrc: screens[editionScreens[feature.label]].src
  }));
}
