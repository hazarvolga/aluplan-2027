// Images-for-web screenshots of the FRILO 2027 launch kit: frilo-<edition>-feature-N belongs to feature N of that edition's news.
// Web derivatives live in public/assets/previews/frilo/2027/ (1200 px JPEG). Professional Steel's source files are misnumbered
// (feture-1, feature-1, feture-3); their derivatives are renamed to the feature order checked against the image content.
const GEO_SLUGS: Record<string, string> = {
  'FRILO Geotechnics Concept': 'concept',
  'FRILO Geotechnics Professional Pit': 'professional-pit',
  'FRILO Geotechnics Professional Retaining': 'professional-retaining',
  'FRILO Geotechnics Ultimate': 'ultimate',
};

const EDITION_SLUGS: Record<string, string> = {
  'FRILO Concept': 'concept',
  'FRILO Professional Concrete': 'professional-concrete',
  'FRILO Professional Steel': 'professional-steel',
  'FRILO Professional Timber': 'professional-timber',
  'FRILO Ultimate': 'ultimate',
};

export function friloGeoNewsImage(editionName: string, featureIndex: number): string | undefined {
  const slug = GEO_SLUGS[editionName];
  return slug ? `/assets/previews/frilo/2027/geo-${slug}-feature-${featureIndex + 1}.jpg` : undefined;
}

export function friloNewsImage(editionName: string, featureIndex: number): string | undefined {
  const slug = EDITION_SLUGS[editionName];
  return slug ? `/assets/previews/frilo/2027/${slug}-feature-${featureIndex + 1}.jpg` : undefined;
}
