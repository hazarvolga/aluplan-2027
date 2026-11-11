/** Akademi search index: one entry per lesson, module, level and series page (lesson-level search). */
import fs from 'node:fs';
import path from 'node:path';

const output = 'src/data/search-akademi-index.json';
const SECTION = 'Akademi';
const KEYWORD_LIMIT = 1500;

const LEVELS = {
  temel: { title: 'Temeller', summary: 'Arayüz, proje yapısı ve parametrik mimari elemanlarla ilk modelinizi kurarsınız.' },
  orta: { title: 'Üretim ve Dokümantasyon', summary: 'Modelden kesit, görünüş, pafta ve metraj üretirsiniz.' },
  ileri: { title: 'Disiplin Uzmanlığı', summary: 'Dört eşit süreli koldan birini seçip mesleğinize göre derinleşirsiniz.' },
  uzman: { title: 'BIM Yönetimi ve Otomasyon', summary: 'openBIM ile disiplinler arası çalışır, tekrar eden işleri otomatikleştirirsiniz.' },
};

// Same titles and levels as the Akademi sidebar (AKADEMI_SERIES).
const SERIES = [
  { slug: 'temel-modelleme', title: 'Temel Modelleme Eğitimi', level: 'temel' },
  { slug: 'arazi-modelleme', title: 'Arazi Modelleme Eğitimi', level: 'temel' },
  { slug: 'lejant', title: 'Lejant Oluşturma Eğitimi', level: 'orta' },
  { slug: 'donati-detaylandirma', title: 'Donatı Detaylandırma', level: 'ileri' },
  { slug: 'celik-yapi', title: 'Çelik Yapı ve SDS2', level: 'ileri' },
  { slug: 'prekast', title: 'Prekast Yapı Elemanları', level: 'ileri' },
  { slug: 'otomasyon-scripting', title: 'Otomasyon ve Visual Scripting', level: 'uzman' },
  { slug: 'openbim-ifc', title: 'OpenBIM ve IFC', level: 'uzman' },
];

const readJson = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const clean = (text) => String(text ?? '').replace(/\*\*/g, '').replace(/`/g, '').replace(/\s+/g, ' ').trim();

function keywords(parts) {
  const seen = new Set();
  const kept = [];
  let length = 0;
  for (const part of parts.map(clean).filter(Boolean)) {
    const key = part.toLocaleLowerCase('tr-TR');
    if (seen.has(key)) continue;
    if (length + part.length + 1 > KEYWORD_LIMIT) break;
    seen.add(key);
    kept.push(part);
    length += part.length + 1;
  }
  return kept.join(' ');
}

function entry(pathname, title, description, keywordParts) {
  return { path: pathname, title: clean(title), seoTitle: `${clean(title)} | Aluplan Akademi`, section: SECTION, description: clean(description), keywords: keywords(keywordParts) };
}

function lessonEntry(series, lesson) {
  const level = LEVELS[series.level].title;
  const [first = '', ...rest] = lesson.objectives ?? [];
  const commands = (lesson.commands ?? []).flatMap((command) => [command.name, command.menu]);
  const steps = (lesson.steps ?? []).map((step) => step.heading);
  const deep = (lesson.deepDive?.blocks ?? []).filter((block) => block.type === 'heading').map((block) => block.text);
  return entry(`/akademi/${series.slug}/${lesson.slug}`, lesson.title, first, [series.title, level, ...rest, ...commands, ...steps, ...deep]);
}

function seriesEntries() {
  return SERIES.flatMap((series) => {
    const index = readJson(path.join('src/data', series.slug, '_index.json'));
    const lessons = index.map(({ no }) => readJson(path.join('src/data', series.slug, `${String(no).padStart(2, '0')}.json`)));
    const level = LEVELS[series.level].title;
    const landing = entry(`/akademi/${series.slug}`, series.title, `${lessons.length} uygulamalı ders · ${level}`, [level, ...lessons.map((lesson) => lesson.title)]);
    return [landing, ...lessons.map((lesson) => lessonEntry(series, lesson))];
  });
}

function moduleEntries() {
  const dir = 'src/data/akademi-content';
  return fs.readdirSync(dir).filter((file) => /^M.*\.json$/.test(file)).sort().map((file) => {
    const module = readJson(path.join(dir, file));
    const level = LEVELS[module.levelSlug]?.title ?? '';
    const sections = (module.lesson?.sections ?? []).map((section) => section.heading);
    const outcomes = (module.outcomes ?? []).map((outcome) => outcome.text);
    return entry(`/akademi/${module.levelSlug}/${module.slug}`, module.title, module.summary, [module.code, level, module.trackTitle, ...outcomes, ...sections]);
  });
}

function levelEntries() {
  return Object.entries(LEVELS).map(([slug, level], i) => entry(`/akademi/${slug}`, `Seviye ${i + 1} · ${level.title}`, level.summary, [level.title]));
}

const overview = entry('/akademi', 'Aluplan Akademi', 'ALLPLAN’ı Türkçe, seviye seviye öğrenin: ücretsiz, herkese açık eğitim programı.', ['ALLPLAN eğitim', 'Türkçe ders', 'BIM eğitimi', 'katalog']);
const result = [overview, ...levelEntries(), ...moduleEntries(), ...seriesEntries()];
const out = JSON.stringify(result, null, 2) + '\n';

if (process.argv.includes('--check')) {
  if (!fs.existsSync(output) || fs.readFileSync(output, 'utf8') !== out) {
    console.error(`${output} is out of date; run node scripts/build_akademi_search_index.mjs`);
    process.exitCode = 1;
  }
} else {
  fs.writeFileSync(output, out);
  console.log(`Generated ${result.length} Akademi search entries`);
}
