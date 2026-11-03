import { PageEndConversion } from './PageEndConversion';

export type PreviewClosingItem = {
  title?: string;
  paragraphs: readonly string[];
  action?: { label: string; href: string };
};

export function PreviewClosingSection({ id, title, kicker, items }: {
  id: string;
  title: string;
  kicker?: string;
  items: readonly PreviewClosingItem[];
}) {
  return <PageEndConversion model={{
    kind: 'commercial', kicker: kicker ?? '', title, description: '', actions: [],
    preview: { headingId: id, items },
  }} />;
}
