import { editionScreens, featureScreens, screens } from '@/data/allplan-2027-screens';
import type { AllplanEdition2027 } from '@/data/allplan-2027-editions';
import type { ProductEditionContent } from '@/data/product-edition-content';
import type { StructuredMediaCardItem } from '@/lib/site-data';

/** Screenshot cards for the features of an edition page that have a screen, in feature order. */
export function productScreenItems(content: ProductEditionContent): StructuredMediaCardItem[] {
  return content.featureGroups
    .flatMap(group => group.items)
    .filter(item => featureScreens[item.title])
    .map(item => ({ title: item.title, description: '', imageSrc: screens[featureScreens[item.title]].src }));
}

/** Feature cards (label, text, screenshot) of an Allplan 2027 news page. */
export function editionNewsItems(edition: AllplanEdition2027): StructuredMediaCardItem[] {
  return edition.features.map(feature => ({
    title: feature.label,
    description: feature.text,
    imageSrc: screens[editionScreens[feature.label]].src
  }));
}
