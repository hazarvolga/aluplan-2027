export interface ProductEditionContent {
  path: string;
  name: string;
  tagline: string;
  lead: string;
  tags: readonly string[];
  overviewTitle: string;
  overview: readonly { label: string; title: string; text: string }[];
  benefitsTitle: string;
  benefits: readonly { title: string; text: string }[];
  featuresTitle: string;
  featureGroups: readonly { label: string; items: readonly { title: string; text: string }[] }[];
}
