import fs from 'fs';
import assert from 'assert';

const content = fs.readFileSync('src/components/NavMenuView.tsx', 'utf-8');

assert.strictEqual(
  content.includes('if (e.key === "Enter") {'),
  false,
  'NavMenuView should not globally intercept Enter',
);

assert.strictEqual(
  content.includes('role="button"'),
  false,
  'NavMenuView should not use role="button" panels',
);

assert.strictEqual(
  content.includes('className="nav-panel__preview"'),
  true,
  'NavMenuView should render preview buttons',
);

assert.strictEqual(
  content.includes('aria-label={`Open ${item.label}`}'),
  true,
  'NavMenuView should render explicit open buttons',
);

console.log('PASS: nav menu separates preview from explicit open');
