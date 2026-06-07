import fs from 'fs';
import assert from 'assert';

const component = fs.readFileSync('src/components/NavMenuView.tsx', 'utf-8');
const css = fs.readFileSync('src/design-tokens.css', 'utf-8');

assert.strictEqual(
  component.includes('Use arrows or swipe to preview. Choose Open to enter.'),
  true,
  'NavMenuView should include the preview/open helper hint',
);

assert.strictEqual(
  component.includes('className="nav-menu-hint"'),
  true,
  'NavMenuView should render the nav-menu-hint element',
);

assert.strictEqual(
  css.includes('.nav-portal__pagination'),
  false,
  'Dead pagination styles should be removed',
);

assert.strictEqual(
  css.includes('.nav-portal__dot'),
  false,
  'Dead pagination dot styles should be removed',
);

assert.strictEqual(
  css.includes('.nav-panel__button'),
  false,
  'Dead nav-panel__button styles should be removed',
);

console.log('PASS: nav menu hint is present and dead CSS has been removed');
