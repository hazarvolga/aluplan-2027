import { akademiProgram } from '@/data/akademi-content';

const akademiLevels = akademiProgram.levels;

export interface SidebarLevel {
  number: number;
  slug: string;
  title: string;
  codes: readonly string[];
}

/** Flattens each level (and L3 track modules) into a sidebar entry with its module codes. */
export function buildSidebarLevels(): SidebarLevel[] {
  return akademiLevels.map((level) => {
    const codes = level.modules
      ? level.modules.map((module) => module.code)
      : (level.tracks ?? []).flatMap((track) => track.modules.map((module) => module.code));
    return { number: level.number, slug: level.slug, title: level.title, codes };
  });
}

/** Pure wayfinding predicate: is the current path exactly this level's detail page? */
export function isAkademiLevelActive(pathname: string, slug: string): boolean {
  return pathname === `/akademi/${slug}`;
}
