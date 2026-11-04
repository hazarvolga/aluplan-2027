// Token system test suite. Positive + negative cases on IN-MEMORY clones; never mutates tokens.json on disk.
//   node scripts/token-tests.mjs
// The same runTokenTests() is executed by tests/index.html in the browser.
import { buildTokens, lintComponentCss, GENERATED } from './build-tokens.mjs';

export function runTokenTests({ build = buildTokens, lint = lintComponentCss, T, template, cssFiles, onDisk, generatedList = GENERATED }) {
  const results = [];
  const clone = () => JSON.parse(JSON.stringify(T));
  const test = (name, fn) => { try { const r = fn(); results.push({ name, pass: r === true, detail: r === true ? '' : String(r) }); } catch (e) { results.push({ name, pass: false, detail: 'threw: ' + e.message }); } };
  const run = (t, tpl = template) => build(t, { responsiveTemplate: tpl });
  const has = (arr, re) => arr.some(e => re.test(e));

  const base = run(T);
  test('baseline: tokens.json builds with 0 errors', () => base.errors.length === 0 || base.errors.join(' | '));
  test('baseline: 0 contrast failures', () => base.stats.contrastFails === 0 || base.stats.contrastFails + ' fails');
  test('baseline: component CSS lint clean', () => { const l = lint(cssFiles, base.definedVars); return l.errors.length === 0 || l.errors.join(' | '); });

  test('breakpoint lg 64rem -> 70rem is reflected in generated media queries', () => {
    const t = clone(); t.buildTime.breakpoint.lg.$value = '70rem';
    const r = run(t); const css = r.files['components/responsive.generated.css'];
    if (r.errors.length) return r.errors.join(' | ');
    if (!css.includes('@media (min-width: 70rem)')) return 'missing 70rem';
    if (css.includes('@media (min-width: 64rem)')) return 'stale 64rem still present';
    if (JSON.parse(r.files['tokens/build/breakpoints.json']).breakpoint.lg !== '70rem') return 'breakpoints.json not updated';
    return true;
  });
  test('breakpoint change did not mutate the shipped token object', () => T.buildTime.breakpoint.lg.$value === '64rem' || 'shipped value changed to ' + T.buildTime.breakpoint.lg.$value);
  test('breakpoint md change only affects md rules', () => {
    const t = clone(); t.buildTime.breakpoint.md.$value = '50rem';
    const css = run(t).files['components/responsive.generated.css'];
    return (css.includes('(min-width: 50rem)') && css.includes('(min-width: 64rem)') && !css.includes('(min-width: 48rem)')) || css;
  });
  test('max breakpoint placeholders compile from build-time tokens', () => {
    const css = run(T, '@media (--max-lg){.x{display:none}}\n@media (--max-preview-compact){.y{display:none}}').files['components/responsive.generated.css'];
    return (css.includes('@media (max-width: 64rem)') && css.includes('@media (max-width: 40rem)')) || css;
  });
  test('negative: unknown custom media in template is an error', () => has(run(T, template + '\n@media (--huge){.x{display:none}}').errors, /unknown custom media --huge/) || 'not detected');
  test('negative: literal width media query in template is an error', () => has(run(T, template + '\n@media (min-width: 40rem){.x{display:none}}').errors, /literal min\/max-width/) || 'not detected');

  test('negative: broken component alias', () => { const t = clone(); t.component.button.primary.bg.$value = '{semantic.action.primary.doesNotExist}'; return has(run(t).errors, /broken reference: semantic\.action\.primary\.doesNotExist/) || run(t).errors.join(' | '); });
  test('negative: broken semantic -> primitive reference', () => { const t = clone(); t.semantic.space.section.$value = '{primitive.space.999}'; return has(run(t).errors, /broken reference/) || 'not detected'; });
  test('negative: alias cycle is detected', () => { const t = clone(); t.component.cycle = { a: { $value: '{component.cycle.b}' }, b: { $value: '{component.cycle.a}' } }; return has(run(t).errors, /^Cycle: /) || run(t).errors.join(' | '); });
  test('negative: semantic referencing semantic violates layering', () => { const t = clone(); t.semantic.grid.gap.$value = '{semantic.space.section}'; return has(run(t).errors, /semantic tokens may only reference primitives/) || 'not detected'; });
  test('negative: missing theme key (field/dark text.link)', () => { const t = clone(); delete t.themes.field.modes.dark.text.link; return has(run(t).errors, /field\.dark: color token set differs\. Missing: semantic\.text\.link/) || run(t).errors.join(' | '); });
  test('negative: theme adding a non-existent semantic token', () => { const t = clone(); t.themes.field.base.space.extra = { $value: '{primitive.space.4}' }; return has(run(t).errors, /may only override existing/) || 'not detected'; });
  test('negative: contrast failure is an error', () => { const t = clone(); t.themes.aluplan.modes.light.text.secondary.$value = '{primitive.color.silver.300}'; return has(run(t).errors, /Contrast FAIL \[aluplan\/light\] text\.secondary/) || 'not detected'; });
  test('contrast decision uses unrounded ratio (4.4953 displays 4.50 but fails)', () => {
    const t = clone();
    t.primitive.color.testEdge = { $value: '#417A86' };
    t.primitive.color.testEdgeSurface = { $value: '#F5F7FA' };
    t.themes.aluplan.modes.light.text.secondary.$value = '{primitive.color.testEdge}';
    t.themes.aluplan.modes.light.surface.page.$value = '{primitive.color.testEdgeSurface}';
    const r = run(t); const c = r.contrast.find(c => c.theme === 'aluplan' && c.mode === 'light' && c.fg === 'text.secondary' && c.bg === 'surface.page');
    return (c && c.display === '4.50' && c.pass === false && has(r.errors, /text\.secondary on surface\.page: 4\.4953/)) || JSON.stringify(c);
  });

  test('logo size change does not affect icon sizes', () => {
    const t = clone(); t.semantic.logo.height.sm.$value = '{primitive.size.12}';
    const a = base.resolved.aluplan.light, b = run(t).resolved.aluplan.light;
    const icon = ['--icon-size-sm', '--icon-size-md', '--icon-size-lg'].every(k => a[k] === b[k]);
    return (icon && a['--logo-height-sm'] !== b['--logo-height-sm']) || 'coupled';
  });
  test('icon size change does not affect logo sizes', () => {
    const t = clone(); t.semantic.icon.size.lg.$value = '{primitive.size.8}';
    const a = base.resolved.aluplan.light, b = run(t).resolved.aluplan.light;
    return (['--logo-height-sm', '--logo-height-md', '--logo-height-lg'].every(k => a[k] === b[k]) && a['--icon-size-lg'] !== b['--icon-size-lg']) || 'coupled';
  });
  test('base.css: .alu-icon* uses only --icon-* sizes, .alu-brand-logo* img only --logo-* sizes', () => {
    const css = cssFiles['components/base.css'] || '';
    const bad = [];
    for (const m of css.matchAll(/(\.[\w-]+[^{]*)\{([^}]*)\}/g)) {
      const sel = m[1], body = m[2];
      const sizes = [...body.matchAll(/(?:^|;)\s*(width|height)\s*:\s*var\((--[\w-]+)\)/g)].map(x => x[2]);
      if (/^\.alu-icon/.test(sel.trim())) sizes.forEach(v => { if (!v.startsWith('--icon-size-')) bad.push(sel + ' -> ' + v); });
      if (/\.alu-brand-logo[^{]*img/.test(sel)) sizes.forEach(v => { if (!v.startsWith('--logo-height-')) bad.push(sel + ' -> ' + v); });
    }
    return bad.length === 0 || bad.join(' | ');
  });

  test('lint: min-width declaration is NOT classified as a media query', () => { const l = lint({ 'x.css': '.a{min-width:var(--layout-table-min)}' }, base.definedVars); return l.errors.length === 0 || l.errors.join(' | '); });
  test('lint: width media query in component CSS is an error', () => has(lint({ 'x.css': '@media (min-width:48rem){.a{display:none}}' }, base.definedVars).errors, /width media query/) || 'not detected');
  test('lint: prefers-reduced-motion media query is allowed', () => lint({ 'x.css': '@media (prefers-reduced-motion: reduce){.a{transition:none}}' }, base.definedVars).errors.length === 0 || 'false positive');
  test('lint: undefined variable is an error', () => has(lint({ 'x.css': '.a{color:var(--text-nope)}' }, base.definedVars).errors, /undefined variable --text-nope/) || 'not detected');
  test('lint: raw hex / rgba / rem / stroke-width are errors', () => {
    const e = lint({ 'x.css': '.a{color:#fff}.b{background:rgba(0,0,0,.5)}.c{width:16rem}.d{stroke-width:3}' }, base.definedVars).errors;
    return (e.length === 4) || e.join(' | ');
  });
  test('lint: raw-ok marker and em units are allowed', () => lint({ 'x.css': '.a{width:1px; /* raw-ok: a11y */\n}.b{width:1.25em;text-underline-offset:0.2em}' }, base.definedVars).errors.length === 0 || 'false positive');
  test('lint: --ref-* primitive use in component CSS is an error', () => has(lint({ 'x.css': '.a{color:var(--ref-color-ink-950)}' }, base.definedVars).errors, /primitive --ref-/) || 'not detected');

  if (onDisk) {
    test('drift: every generated file on disk equals fresh build output', () => {
      const diff = generatedList.filter(p => onDisk[p] !== base.files[p]);
      return diff.length === 0 || 'drift in ' + diff.join(', ');
    });
    test('negative: drift is detected when a generated file is edited by hand', () => {
      const tampered = { ...onDisk, 'tokens/semantic.css': (onDisk['tokens/semantic.css'] || '') + '\n/* hand edit */' };
      return generatedList.some(p => tampered[p] !== base.files[p]) || 'not detected';
    });
  }
  test('role palette can vary in one theme without changing another theme or shipped tokens', () => {
    const t = clone();
    t.themes.aluplan.modes.dark.role.architect.$value = '{primitive.color.role.engineer}';
    const changed = run(t);
    if (changed.errors.length) return changed.errors.join(' | ');
    return (changed.resolved.aluplan.dark['--role-architect'] === base.resolved.aluplan.dark['--role-engineer'] &&
      changed.resolved.aluplan.light['--role-architect'] === base.resolved.aluplan.light['--role-architect'] &&
      changed.resolved.field.dark['--role-architect'] === base.resolved.field.dark['--role-architect'] &&
      T.themes.aluplan.modes.dark.role.architect.$value !== t.themes.aluplan.modes.dark.role.architect.$value) || 'theme scope leaked';
  });
  test('changing the teal palette updates Aluplan accent, buttons and media badge in both modes only', () => {
    const t = clone();
    t.primitive.color.teal['300'].$value = '#2CD3BE';
    t.primitive.color.teal['700'].$value = '#0F756D';
    const changed = run(t);
    if (changed.errors.length) return changed.errors.join(' | ');
    const keys = ['--accent-fg', '--action-primary-bg', '--visual-media-badge-text'];
    for (const mode of ['light', 'dark']) {
      for (const key of keys) {
        if (changed.resolved.aluplan[mode][key] === base.resolved.aluplan[mode][key]) return `aluplan/${mode} ${key} did not follow teal`;
        if (changed.resolved.field[mode][key] !== base.resolved.field[mode][key]) return `field/${mode} ${key} changed with teal`;
      }
      if (changed.resolved.aluplan[mode]['--visual-media-badge-text'] !== t.primitive.color.teal['300'].$value) return `aluplan/${mode} media badge did not use teal 300`;
    }
    return true;
  });
  test('media badge text has readable contrast over a white image in every theme and mode', () => {
    const parse = value => {
      const hex = value.match(/^#([\da-f]{6})$/i);
      if (hex) return [0, 2, 4].map(i => parseInt(hex[1].slice(i, i + 2), 16)).concat(1);
      const rgba = value.match(/^rgba?\(([^)]+)\)$/i);
      if (!rgba) throw new Error(`Unsupported badge color: ${value}`);
      const parts = rgba[1].split(',').map(Number);
      if ((parts.length !== 3 && parts.length !== 4) || parts.some(n => !Number.isFinite(n))) throw new Error(`Invalid badge color: ${value}`);
      return [parts[0], parts[1], parts[2], parts[3] ?? 1];
    };
    const composite = (fg, bg) => fg.slice(0, 3).map((c, i) => c * fg[3] + bg[i] * (1 - fg[3]));
    const luminance = rgb => rgb.map(v => v / 255).map(v => v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4).reduce((s, v, i) => s + v * [0.2126, 0.7152, 0.0722][i], 0);
    for (const [theme, modes] of Object.entries(base.resolved)) for (const [mode, values] of Object.entries(modes)) {
      const surface = composite(parse(values['--visual-media-badge-surface']), [255, 255, 255]);
      const text = composite(parse(values['--visual-media-badge-text']), surface);
      const [high, low] = [luminance(surface), luminance(text)].sort((a, b) => b - a);
      const contrast = (high + 0.05) / (low + 0.05);
      if (contrast < 4.5) return `${theme}/${mode} media badge contrast ${contrast.toFixed(3)} < 4.5`;
    }
    return true;
  });
  test('application overlay and chrome tokens support isolated mode edits', () => {
    const t = clone();
    t.themes.aluplan.modes.dark.visual.modalBackdrop.$value = '{primitive.color.role.engineer}';
    t.themes.aluplan.modes.light.chrome.headerBg.$value = '{primitive.color.role.architect}';
    const changed = run(t);
    if (changed.errors.length) return changed.errors.join(' | ');
    return (changed.resolved.aluplan.dark['--visual-modal-backdrop'] === base.resolved.aluplan.dark['--role-engineer'] &&
      changed.resolved.aluplan.light['--site-header-bg'] === base.resolved.aluplan.light['--role-architect'] &&
      changed.resolved.aluplan.dark['--site-header-bg'] === base.resolved.aluplan.dark['--site-header-bg'] &&
      changed.resolved.field.light['--site-header-bg'] === base.resolved.field.light['--site-header-bg']) || 'application theme scope leaked';
  });
  test('application spacing and radius support theme-local overrides', () => {
    const t = clone();
    t.themes.field.base.space.application = {
      ...(t.themes.field.base.space.application || {}),
      panelInset: { $value: '{primitive.space.8}' }
    };
    t.themes.aluplan.base.radius.applicationMediaBadge = { $value: '{primitive.radius.8}' };
    const changed = run(t);
    if (changed.errors.length) return changed.errors.join(' | ');
    return (changed.resolved.field.dark['--space-application-panel-inset'] !== base.resolved.field.dark['--space-application-panel-inset'] &&
      changed.resolved.aluplan.dark['--space-application-panel-inset'] === base.resolved.aluplan.dark['--space-application-panel-inset'] &&
      changed.resolved.aluplan.light['--radius-application-media-badge'] !== base.resolved.aluplan.light['--radius-application-media-badge'] &&
      changed.resolved.field.light['--radius-application-media-badge'] === base.resolved.field.light['--radius-application-media-badge']) || 'metric theme scope leaked';
  });
  test('application JSX sizing tokens preserve their four-mode baseline values', () => {
    const expected = {
      '--space-application-jsx-tight': '0.25rem',
      '--space-application-jsx-offset': '0.35rem',
      '--space-application-jsx-compact': '0.375rem',
      '--space-application-jsx-regular': '0.5rem',
      '--space-application-jsx-dense': '0.625rem',
      '--space-application-jsx-comfortable': '0.75rem',
      '--space-application-jsx-wide': '0.875rem',
      '--space-application-jsx-section': '1rem',
      '--space-application-jsx-section-wide': '1.25rem',
      '--space-application-jsx-section-inset': '1.5rem',
      '--space-application-jsx-empty-state-block': '3rem',
      '--container-application-prose-narrow': '42ch',
      '--container-application-prose-compact': '48ch',
      '--container-application-meta': '58ch',
      '--container-prose': '68ch',
      '--container-application-prose-wide': '72ch',
      '--layout-application-utility-panel-max-height': '22rem',
      '--layout-application-content-column-min-width': '22rem',
      '--layout-application-training-image-max-width': '32rem',
      '--type-application-about-editorial': '1.65',
      '--icon-directory-category': '1.85',
      '--icon-directory-category-size': '18px'
    };
    for (const [theme, modes] of Object.entries(base.resolved)) for (const [mode, values] of Object.entries(modes)) {
      for (const [name, value] of Object.entries(expected)) if (values[name] !== value) return `${theme}/${mode} ${name}: expected ${value}, got ${values[name]}`;
    }
    return true;
  });
  test('all application motion durations and delays collapse under reduced motion', () => {
    const css = base.files['tokens/semantic.css'];
    const reduced = css.slice(css.indexOf('@media (prefers-reduced-motion: reduce)'));
    for (const key of Object.keys(T.semantic.motion.duration)) {
      const name = key.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
      if (!reduced.includes('--motion-duration-' + name + ': 0ms;')) return 'missing reduced-motion duration: ' + key;
    }
    return true;
  });
  test('homepage feature stagger tokens preserve the four original 85ms steps', () => {
    const expected = ['0ms', '85ms', '170ms', '255ms'];
    for (const [theme, modes] of Object.entries(base.resolved)) for (const [mode, values] of Object.entries(modes)) {
      const actual = ['first', 'second', 'third', 'fourth'].map(step => values[`--motion-duration-feature-stagger-${step}`]);
      if (JSON.stringify(actual) !== JSON.stringify(expected)) return `${theme}/${mode}: ${JSON.stringify(actual)}`;
    }
    const css = base.files['tokens/semantic.css'];
    const reduced = css.slice(css.indexOf('@media (prefers-reduced-motion: reduce)'));
    for (const step of ['first', 'second', 'third', 'fourth']) {
      if (!reduced.includes(`--motion-duration-feature-stagger-${step}: 0ms;`)) return `reduced motion missing ${step} stagger`;
    }
    return true;
  });
  test('application border-width tokens preserve the four original weights', () => {
    const expected = {
      '--border-width-default': '1px',
      '--border-width-strong': '2px',
      '--border-width-accent': '3px',
      '--border-width-heavy': '4px'
    };
    for (const [theme, modes] of Object.entries(base.resolved)) for (const [mode, values] of Object.entries(modes)) {
      for (const [name, value] of Object.entries(expected)) if (values[name] !== value) return `${theme}/${mode} ${name}: expected ${value}, got ${values[name]}`;
    }
    return true;
  });
  test('application inset and sticky-offset tokens preserve their original positions', () => {
    const expected = {
      '--space-application-media-control-inset': '0.65rem',
      '--space-application-icon-optical-offset': '0.2rem',
      '--space-application-small-optical-offset': '0.15rem',
      '--space-application-playlist-sticky-offset': '5.5rem',
      '--space-application-references-sticky-offset': '4.5rem',
      '--space-application-story-sticky-offset': '6.5rem',
      '--space-application-jsx-comfortable': '0.75rem',
      '--space-application-jsx-section-wide': '1.25rem',
      '--space-application-jsx-section': '1rem',
      '--space-application-jsx-section-inset': '1.5rem'
    };
    for (const [theme, modes] of Object.entries(base.resolved)) for (const [mode, values] of Object.entries(modes)) {
      for (const [name, value] of Object.entries(expected)) if (values[name] !== value) return `${theme}/${mode} ${name}: expected ${value}, got ${values[name]}`;
    }
    return true;
  });
  test('application component-size tokens preserve their original dimensions', () => {
    const expected = {
      '--size-application-video-play-badge': '3rem',
      '--size-application-partner-item-height': '3.25rem',
      '--size-application-partner-logo-max-height': '2rem',
      '--size-application-monitor-dot': '0.5rem',
      '--size-application-pathway-tab-icon': '2.5rem',
      '--size-application-pathway-dot': '0.55rem',
      '--size-application-pathway-feature-icon': '1.75rem',
      '--size-application-product-pulse-dot': '0.45rem',
      '--size-application-product-box-icon': '2.5rem',
      '--size-application-product-status-dot': '0.55rem',
      '--size-application-benefit-icon': '3.25rem',
      '--size-application-benefit-image': '2rem',
      '--size-application-youtube-banner-icon': '2rem',
      '--size-application-youtube-card-icon': '3.5rem',
      '--size-application-playlist-playing-badge': '2rem',
      '--size-application-bullet-icon': '1.5rem',
      '--size-application-workflow-dot': '0.6rem',
      '--size-application-media-play-control': '3.5rem',
      '--size-application-media-zoom-control': '2rem',
      '--size-application-modal-close-control': '2.25rem',
      '--size-application-reference-icon': '2.75rem',
      '--size-application-about-value-icon': '2.5rem'
    };
    for (const [theme, modes] of Object.entries(base.resolved)) for (const [mode, values] of Object.entries(modes)) {
      for (const [name, value] of Object.entries(expected)) if (values[name] !== value) return `${theme}/${mode} ${name}: expected ${value}, got ${values[name]}`;
    }
    return true;
  });
  test('application content-width tokens preserve their original measures', () => {
    const expected = {
      '--container-application-modal': '42rem',
      '--container-application-cookie-banner': '44rem',
      '--container-application-youtube-banner': '44rem',
      '--container-application-hero-title': '14ch',
      '--container-application-hero-lead': '58ch',
      '--container-application-pathway-description': '52ch',
      '--container-application-bento-copy': '40ch',
      '--container-application-pathway-tab': '14rem',
      '--container-application-playlist-thumbnail': '7.5rem',
      '--container-application-intro-single': '58rem',
      '--container-application-faq-list': '58rem',
      '--container-application-video-dialog': '64rem',
      '--container-application-image-dialog': '72rem',
      '--container-application-reference-search': '32rem',
      '--container-application-faq-stage': '62rem',
      '--container-application-contact-label': '8.5rem'
    };
    for (const [theme, modes] of Object.entries(base.resolved)) for (const [mode, values] of Object.entries(modes)) {
      for (const [name, value] of Object.entries(expected)) if (values[name] !== value) return `${theme}/${mode} ${name}: expected ${value}, got ${values[name]}`;
    }
    return true;
  });
  test('application structural-layout tokens preserve desktop and responsive dimensions', () => {
    const expected = {
      '--layout-application-header-min-height': '4.5rem',
      '--layout-application-modal-max-height': '90vh',
      '--layout-application-bento-feature-min-height': '32rem',
      '--layout-application-service-pill-min-height': '2.75rem',
      '--layout-application-feature-media-min-height': '20rem',
      '--layout-application-playlist-height': '46rem',
      '--layout-application-playlist-height-compact': '32rem',
      '--layout-application-video-dialog-max-height': 'calc(100dvh - 2 * clamp(1rem, 3vw, 2.5rem))',
      '--layout-application-image-viewport-max-height': '80vh',
      '--layout-application-image-max-height': '78vh',
      '--layout-application-bento-responsive-min-height': '18rem',
      '--layout-application-reference-count-min-width': '1.65rem',
      '--layout-application-reference-count-height': '1.35rem',
      '--layout-application-map-min-height': '26rem'
    };
    for (const [theme, modes] of Object.entries(base.resolved)) for (const [mode, values] of Object.entries(modes)) {
      for (const [name, value] of Object.entries(expected)) if (values[name] !== value) return `${theme}/${mode} ${name}: expected ${value}, got ${values[name]}`;
    }
    return true;
  });
  test('application decorative-size tokens preserve their original dimensions', () => {
    const expected = {
      '--size-application-metric-rule-width': '2.5rem',
      '--size-application-metric-rule-height': '2px',
      '--size-application-pathway-glow': '52rem',
      '--size-application-office-divider': '1px'
    };
    for (const [theme, modes] of Object.entries(base.resolved)) for (const [mode, values] of Object.entries(modes)) {
      for (const [name, value] of Object.entries(expected)) if (values[name] !== value) return `${theme}/${mode} ${name}: expected ${value}, got ${values[name]}`;
    }
    return true;
  });
  test('application interaction-transform tokens preserve the original lift and nudge values', () => {
    const expected = {
      '--motion-transform-lift-subtle': 'translateY(-2px)',
      '--motion-transform-lift-moderate': 'translateY(-3px)',
      '--motion-transform-lift-strong': 'translateY(-4px)',
      '--motion-transform-nudge-subtle': 'translateX(3px)',
      '--motion-transform-nudge-strong': 'translateX(5px)'
    };
    for (const [theme, modes] of Object.entries(base.resolved)) for (const [mode, values] of Object.entries(modes)) {
      for (const [name, value] of Object.entries(expected)) if (values[name] !== value) return `${theme}/${mode} ${name}: expected ${value}, got ${values[name]}`;
    }
    return true;
  });
  test('application state, media, keyframe and decorative transforms preserve their original values', () => {
    const expected = {
      '--motion-transform-media-generic-zoom': 'scale(1.02)',
      '--motion-transform-media-detail-zoom': 'scale(1.04)',
      '--motion-transform-card-media-zoom': 'scale(1.05)',
      '--motion-transform-media-showcase-zoom': 'scale(1.06)',
      '--motion-transform-video-badge-zoom': 'scale(1.08)',
      '--motion-transform-play-control-zoom': 'scale(1.12)',
      '--motion-transform-pathway-tab-active': 'scale(1.05)',
      '--motion-transform-product-highlighted': 'scale(1) translateY(0)',
      '--motion-transform-product-dimmed': 'scale(0.975)',
      '--motion-transform-product-dimmed-hover': 'scale(0.99)',
      '--motion-transform-product-cta-rest': 'translateY(2px)',
      '--motion-transform-product-cta-hover': 'translateY(0) translateX(3px)',
      '--motion-transform-pathway-slide-from': 'translateX(-22px)',
      '--motion-transform-pathway-slide-to': 'translateX(0)',
      '--motion-transform-pathway-feature-from': 'scale(0.92) translateY(10px)',
      '--motion-transform-pathway-feature-to': 'scale(1) translateY(0)',
      '--transform-decorative-subpage-hero-overscan': 'scale(1.06)',
      '--transform-decorative-youtube-banner-watermark': 'scale(6.5)',
      '--transform-decorative-youtube-card-watermark': 'scale(1.6)'
    };
    for (const [theme, modes] of Object.entries(base.resolved)) for (const [mode, values] of Object.entries(modes)) {
      for (const [name, value] of Object.entries(expected)) if (values[name] !== value) return `${theme}/${mode} ${name}: expected ${value}, got ${values[name]}`;
    }
    return true;
  });
  test('application filter and backdrop-filter tokens preserve their original values', () => {
    const expected = {
      '--filter-application-hero-video': 'contrast(1.1) saturate(0.85)',
      '--filter-application-pathway-glow': 'blur(130px)',
      '--filter-application-product-highlighted': 'grayscale(0)',
      '--filter-application-product-dimmed': 'grayscale(100%)',
      '--filter-application-product-dimmed-hover': 'grayscale(20%)',
      '--filter-application-bento-media-default': 'brightness(0.75) contrast(1.08)',
      '--filter-application-bento-media-hover': 'brightness(0.85) contrast(1.1)',
      '--filter-application-subpage-hero-background': 'blur(8px) saturate(0.8)',
      '--filter-backdrop-header': 'blur(16px)',
      '--filter-backdrop-media-badge': 'blur(6px)',
      '--filter-backdrop-modal': 'blur(10px)'
    };
    for (const [theme, modes] of Object.entries(base.resolved)) for (const [mode, values] of Object.entries(modes)) {
      for (const [name, value] of Object.entries(expected)) if (values[name] !== value) return `${theme}/${mode} ${name}: expected ${value}, got ${values[name]}`;
    }
    return true;
  });
  test('application shadow tokens preserve their original compositions', () => {
    const expected = {
      '--shadow-application-role-selected-ring': 'inset 0 0 0 1px var(--accent-border)',
      '--shadow-application-header': '0 8px 32px var(--visual-shadow-header)',
      '--shadow-application-mega-menu': '0 24px 64px var(--visual-shadow-strong)',
      '--shadow-application-header-light': '0 4px 20px var(--visual-shadow-header-light)',
      '--shadow-application-mega-menu-light': '0 18px 42px var(--visual-shadow-menu-light)',
      '--shadow-application-hero-monitor': '0 24px 64px var(--visual-shadow-monitor)',
      '--shadow-application-monitor-status-glow': '0 0 10px var(--accent-fg)',
      '--shadow-application-pathway-tab-active': '0 18px 40px -12px var(--visual-shadow-media), 0 0 0 1px var(--tab-accent, var(--accent-border))',
      '--shadow-application-pathway-dot-glow': '0 0 12px var(--tab-accent, var(--role-architect))',
      '--shadow-application-pathway-cta-hover': '0 10px 28px -8px color-mix(in srgb, var(--role-accent, var(--role-architect)) 45%, transparent)',
      '--shadow-application-product-highlighted': '0 20px 44px -15px var(--visual-shadow-strong)',
      '--shadow-application-product-highlighted-hover': '0 24px 52px -12px var(--visual-shadow-product-hover), 0 0 24px -8px color-mix(in srgb, var(--role-accent, var(--role-architect)) 40%, transparent)',
      '--shadow-application-product-dimmed': 'none',
      '--shadow-application-product-pulse-glow': '0 0 8px var(--role-accent, var(--role-architect))',
      '--shadow-application-product-status-glow': '0 0 10px var(--role-accent, var(--role-architect))',
      '--shadow-application-youtube-subscribe': '0 14px 32px -8px var(--visual-youtube-action-shadow)',
      '--shadow-application-youtube-subscribe-hover': '0 18px 38px -8px var(--visual-youtube-action-hover-shadow)',
      '--shadow-application-media-play-control': '0 12px 28px var(--visual-shadow-media)',
      '--shadow-application-modal-dialog': '0 32px 80px var(--visual-shadow-modal)',
      '--shadow-application-reference-tab-active': '0 4px 16px var(--visual-reference-active-shadow)'
    };
    for (const [theme, modes] of Object.entries(base.resolved)) for (const [mode, values] of Object.entries(modes)) {
      for (const [name, value] of Object.entries(expected)) if (values[name] !== value) return `${theme}/${mode} ${name}: expected ${value}, got ${values[name]}`;
    }
    return true;
  });
  return { results, passed: results.filter(r => r.pass).length, failed: results.filter(r => !r.pass).length };
}

// --- CLI ---
async function main() {
  const fs = await import('node:' + 'fs'); const path = await import('node:' + 'path');
  const root = path.resolve(path.dirname(process.argv[1]), '..');
  const read = p => fs.readFileSync(path.join(root, p), 'utf8');
  const cssFiles = {};
  for (const f of fs.readdirSync(path.join(root, 'components'), { recursive: true }).map(String).filter(f => f.endsWith('.css'))) cssFiles['components/' + f.replace(/\\/g, '/')] = read('components/' + f);
  const onDisk = {}; for (const p of GENERATED) { try { onDisk[p] = read(p); } catch (e) { onDisk[p] = null; } }
  const r = runTokenTests({ T: JSON.parse(read('tokens/tokens.json')), template: read('components/responsive.template.css'), cssFiles, onDisk });
  for (const t of r.results) console.log((t.pass ? 'PASS ' : 'FAIL ') + t.name + (t.detail ? ' — ' + t.detail : ''));
  console.log(`${r.passed} passed, ${r.failed} failed`);
  if (r.failed) process.exit(1);
}
if (typeof process !== 'undefined' && process.versions && process.versions.node && /token-tests/.test(process.argv[1] || '')) main();
