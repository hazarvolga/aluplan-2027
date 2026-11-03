// Images-for-web screenshots of the FRILO 2027 launch kit: frilo-geo-<edition>-feature-N belongs to feature N of that edition's news.
// Web derivatives live in public/assets/previews/frilo/2027/ (1200 px JPEG).
const EDITION_SLUGS: Record<string, string> = {
  'FRILO Geotechnics Concept': 'concept',
  'FRILO Geotechnics Professional Pit': 'professional-pit',
  'FRILO Geotechnics Professional Retaining': 'professional-retaining',
  'FRILO Geotechnics Ultimate': 'ultimate',
};

export function friloGeoNewsImage(editionName: string, featureIndex: number): string | undefined {
  const slug = EDITION_SLUGS[editionName];
  return slug ? `/assets/previews/frilo/2027/geo-${slug}-feature-${featureIndex + 1}.jpg` : undefined;
}
