/**
 * Aluplan Akademi — "Temel Modelleme Eğitimi" series.
 *
 * A 16-lesson, Turkish, hands-on beginner series: modelling basic
 * architectural and structural elements in ALLPLAN alongside the core CAD
 * commands. Lesson content is generated from the source training book into
 * committed JSON (scripts/build_temel_modelleme is run manually). Videos are
 * placeholders (the ALLPLAN Vimeo originals are domain-locked); the embedded
 * screenshots are the real, Turkish-interface teaching visuals.
 */
import l01 from './temel-modelleme/01.json';
import l02 from './temel-modelleme/02.json';
import l03 from './temel-modelleme/03.json';
import l04 from './temel-modelleme/04.json';
import l05 from './temel-modelleme/05.json';
import l06 from './temel-modelleme/06.json';
import l07 from './temel-modelleme/07.json';
import l08 from './temel-modelleme/08.json';
import l09 from './temel-modelleme/09.json';
import l10 from './temel-modelleme/10.json';
import l11 from './temel-modelleme/11.json';
import l12 from './temel-modelleme/12.json';
import l13 from './temel-modelleme/13.json';
import l14 from './temel-modelleme/14.json';
import l15 from './temel-modelleme/15.json';
import l16 from './temel-modelleme/16.json';
import l17 from './temel-modelleme/17.json';
import l18 from './temel-modelleme/18.json';
import l19 from './temel-modelleme/19.json';
import l20 from './temel-modelleme/20.json';
import l21 from './temel-modelleme/21.json';
import l22 from './temel-modelleme/22.json';
import type { QuizQuestion } from './akademi-content';

export interface TmCommand {
  name: string;
  menu: string;
  shortcut: string;
  desc: string;
}

export interface TmStep {
  time: string;
  heading: string;
  body: string;
  figures: readonly string[];
}

export interface TmArticle {
  id: string;
  title: string;
  body: string;
  figures: readonly string[];
}

/** A known mistake surfaced as a prominent "DİKKAT" callout, not buried in an accordion. */
export interface TmPitfall {
  title: string;
  body: string;
}

/** One block of the deep-dive: a subheading, a prose paragraph, or an inline image. */
export type TmDeepBlock =
  | { type: 'heading'; text: string }
  | { type: 'text'; text: string }
  | { type: 'image'; src: string; caption?: string };

/**
 * "Derinlemesine": valuable source Q&A rewritten in the lesson's own "siz" voice,
 * with screenshots interleaved inline next to the passage they illustrate. Shown
 * as its own section after the lesson ends; when present, it replaces the raw
 * "Derinleşmek için" article accordion for that lesson.
 */
export interface TmDeepDive {
  blocks: readonly TmDeepBlock[];
}

export interface TmVideo {
  title: string;
  file: string;
  vimeoId: string;
  /**
   * Public YouTube id, set only for videos sourced from a public youtube.com
   * link (e.g. ALLPLAN's own channel). These are embeddable; domain-locked
   * ALLPLAN Vimeo videos (vimeoId only, no youtubeId) are not rendered.
   */
  youtubeId?: string;
  /** Optional note shown with the embed, e.g. language / channel. */
  note?: string;
  sizeMB: number;
}

export interface TmMedia {
  videos: readonly TmVideo[];
  pdfs: readonly string[];
  samples: readonly string[];
}

export interface TmLesson {
  no: number;
  slug: string;
  title: string;
  duration: string;
  sourceModule: string;
  /** Optional 1-2 sentence conceptual framing shown before the objectives. */
  intro?: string;
  objectives: readonly string[];
  steps: readonly TmStep[];
  /** Optional "DİKKAT" callouts — known mistakes surfaced, not accordion-buried. */
  pitfalls?: readonly TmPitfall[];
  /** Optional "Doğru yaptıysanız" verification shown after the steps. */
  checkpoint?: string;
  commands: readonly TmCommand[];
  media: TmMedia;
  articles: readonly TmArticle[];
  /** Optional rewritten, image-interleaved deep-dive shown after the lesson. */
  deepDive?: TmDeepDive;
  /** Optional self-assessment: outcome-linked multiple-choice questions. */
  quiz?: readonly QuizQuestion[];
}

export const temelModellemeHero = {
  kicker: 'ALUPLAN AKADEMİ · TEMEL MODELLEME',
  title: 'Temel Modelleme Eğitimi',
  lead:
    'BIM yazılımı ALLPLAN ile temel mimari ve yapısal elemanları, temel CAD komutlarıyla ' +
    'birlikte sıfırdan modellersiniz. On altı uygulamalı derste bir binayı aks, duvar, ' +
    'kapı/pencere, kolon/kiriş, döşeme, merdiven, temel ve çatıya kadar adım adım kurarsınız.',
} as const;

export const temelModellemeLessons: readonly TmLesson[] = [
  l01, l02, l03, l04, l05, l06, l07, l08, l09, l10, l11, l12, l13, l14, l15, l16,
  l17, l18, l19, l20, l21, l22,
].map((raw) => raw as TmLesson);

export function getTmLesson(slug: string): TmLesson | undefined {
  return temelModellemeLessons.find((lesson) => lesson.slug === slug);
}

/** Route params for generateStaticParams (one per lesson). */
export function tmRouteParams(): Array<{ ders: string }> {
  return temelModellemeLessons.map((lesson) => ({ ders: lesson.slug }));
}
