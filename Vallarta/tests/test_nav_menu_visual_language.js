import fs from 'fs';
import assert from 'assert';

const css = fs.readFileSync('src/design-tokens.css', 'utf-8');

assert.strictEqual(
  css.includes('--nav-shell-bg: #0d1c24;'),
  false,
  'Nav menu should not keep the old dark-blue shell token',
);

assert.strictEqual(
  css.includes('--nav-gold:'),
  false,
  'Nav menu should not keep the old gold accent token',
);

assert.strictEqual(
  css.includes('--nav-accent: oklch(78% 0.03 72);'),
  true,
  'Nav menu should define a restrained sand accent token',
);

assert.strictEqual(
  css.includes('--nav-shell-bg: oklch(23% 0.008 60);'),
  true,
  'Nav menu should use a warm charcoal shell instead of navy',
);

const lineStart = css.indexOf('.nav-portal-line {');
const lineEnd = css.indexOf('\n}', lineStart) + 2;
const lineBlock = css.slice(lineStart, lineEnd);

assert.strictEqual(
  lineBlock.includes('height: 1px;'),
  true,
  'Nav portal line should slim down to 1px',
);

assert.strictEqual(
  lineBlock.includes('background: var(--nav-accent);'),
  true,
  'Nav portal line should use the restrained accent token',
);

const collapsedLineStart = css.indexOf('.nav-panel--collapsed .nav-portal-line {');
const collapsedLineEnd = css.indexOf('\n}', collapsedLineStart) + 2;
const collapsedLineBlock = css.slice(collapsedLineStart, collapsedLineEnd);

assert.strictEqual(
  collapsedLineBlock.includes('transform: scaleX(0.08);'),
  true,
  'Collapsed panels should keep only a faint accent trace',
);

assert.strictEqual(
  collapsedLineBlock.includes('opacity: 0.22;'),
  true,
  'Collapsed panel accent trace should be quiet',
);

const indexStart = css.indexOf('.nav-portal__index {');
const indexEnd = css.indexOf('\n}', indexStart) + 2;
const indexBlock = css.slice(indexStart, indexEnd);

assert.strictEqual(
  indexBlock.includes('color: var(--nav-accent);'),
  true,
  'Panel index should use the new accent token',
);

assert.strictEqual(
  indexBlock.includes('font-weight: 400;'),
  true,
  'Panel index should no longer look hairline-delicate',
);

const collapsedTitleStart = css.indexOf('.nav-panel-collapsed-title {');
const collapsedTitleEnd = css.indexOf('\n}', collapsedTitleStart) + 2;
const collapsedTitleBlock = css.slice(collapsedTitleStart, collapsedTitleEnd);

assert.strictEqual(
  collapsedTitleBlock.includes('color: rgba(255, 255, 255, 0.46);'),
  true,
  'Collapsed titles should step back visually',
);

console.log('PASS: nav menu visual language uses restrained tokens and quieter chrome');
