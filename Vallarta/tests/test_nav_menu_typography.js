import fs from 'fs';
import assert from 'assert';

const css = fs.readFileSync('src/design-tokens.css', 'utf-8');

const collapsedStart = css.indexOf('.nav-panel-collapsed-title {');
const collapsedEnd = css.indexOf('.nav-panel--collapsed:hover .nav-panel-collapsed-title {');
const collapsedBlock = css.slice(collapsedStart, collapsedEnd);

const labelStart = css.indexOf('.nav-portal__label {');
const labelEnd = css.indexOf('/* ── Nav Menu — card subtitle color on hover ── */');
const labelBlock = css.slice(labelStart, labelEnd);

assert.strictEqual(
  collapsedBlock.includes('font-family: var(--font-ui);'),
  true,
  'Collapsed nav titles should use the UI font',
);

assert.strictEqual(
  labelBlock.includes('font-family: var(--font-ui);'),
  true,
  'Active nav labels should use the UI font',
);

assert.strictEqual(
  labelBlock.includes('font-family: var(--font-display);'),
  false,
  'Active nav labels should not use the display font',
);

console.log('PASS: nav menu typography matches DESIGN.md UI font rules');
