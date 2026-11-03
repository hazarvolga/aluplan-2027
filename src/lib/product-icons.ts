import type { AluIconName } from '@/components/ui/AluIcon';

// One icon per benefit card, in the order of the page's `benefits` list. Icons are presentation only; the text stays in src/data.
const BENEFIT_ICONS: Record<string, readonly AluIconName[]> = {
  '/products/allplan-rebar': ['zap', 'layers', 'file-text', 'globe'],
  '/products/allplan-parametric': ['boxes', 'zap', 'layers', 'globe'],
};

export function productBenefitIcons(path: string): readonly (AluIconName | undefined)[] {
  return BENEFIT_ICONS[path] ?? [];
}
