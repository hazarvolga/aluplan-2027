import Link from 'next/link';
import type { SectionLink } from '@/lib/site-data';
import { AluIcon } from '@/components/ui/AluIcon';

interface SectionCardLinkProps {
  link: SectionLink;
  heading: string;
}

export function SectionCardLink({ link, heading }: SectionCardLinkProps) {
  return (
    <Link href={link.href} className="alu-link alu-link--standalone" aria-label={`${link.label}: ${heading}`}>
      <span>{link.label}</span>
      <AluIcon name="arrow-right" size="sm" />
    </Link>
  );
}

export function withoutLinkLabel(items: string[], link?: SectionLink): string[] {
  return link ? items.filter((item) => item !== link.label) : items;
}
