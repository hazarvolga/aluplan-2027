import { akademiProgram } from '@/data/akademi-content';

const akademiLevels = akademiProgram.levels;

export interface SidebarModule {
  code: string;
  title: string;
  slug: string;
  levelSlug: string;
}

export interface SidebarLevel {
  number: number;
  slug: string;
  title: string;
  modules: readonly SidebarModule[];
}

/** Flattens each level (and L3 track modules) into a sidebar entry with its modules. */
export function buildSidebarLevels(): SidebarLevel[] {
  return akademiLevels.map((level) => {
    const source = level.modules
      ? level.modules
      : (level.tracks ?? []).flatMap((track) => track.modules);
    const modules: SidebarModule[] = source.map((module) => ({
      code: module.code,
      title: module.title,
      slug: module.slug,
      levelSlug: module.levelSlug,
    }));
    return { number: level.number, slug: level.slug, title: level.title, modules };
  });
}

/** Pure wayfinding predicate: is the current path exactly this module's detail page? */
export function isAkademiModuleActive(pathname: string, module: SidebarModule): boolean {
  return pathname === `/akademi/${module.levelSlug}/${module.slug}`;
}

/** Pure wayfinding predicate: is the current path exactly this level's detail page? */
export function isAkademiLevelActive(pathname: string, slug: string): boolean {
  return pathname === `/akademi/${slug}`;
}
