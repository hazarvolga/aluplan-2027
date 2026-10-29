export type SubpageHeroPresentation = 'framed' | 'background-only';

export interface SubpageHeroPresentationPolicy {
  presentation: SubpageHeroPresentation;
  backgroundSrc: string | null;
}

const BACKGROUND_ONLY_HEROES: Readonly<
  Record<string, Omit<SubpageHeroPresentationPolicy, 'presentation'>>
> = {
  '/solutions/architecture': {
    backgroundSrc: '/assets/solutions/architecture-hero-v2.jpg'
  }
};

export function getSubpageHeroPresentation(
  path: string,
  fallbackBackgroundSrc: string | null
): SubpageHeroPresentationPolicy {
  const backgroundOnlyHero = BACKGROUND_ONLY_HEROES[path];

  if (backgroundOnlyHero) {
    return {
      presentation: 'background-only',
      backgroundSrc: backgroundOnlyHero.backgroundSrc
    };
  }

  return {
    presentation: 'framed',
    backgroundSrc: fallbackBackgroundSrc
  };
}
