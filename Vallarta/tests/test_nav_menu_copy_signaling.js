import fs from 'fs';
import assert from 'assert';

const component = fs.readFileSync('src/components/NavMenuView.tsx', 'utf-8');
const css = fs.readFileSync('src/design-tokens.css', 'utf-8');

assert.strictEqual(
  component.includes('Use arrows or swipe to preview. Choose Open to enter.'),
  true,
  'Nav menu should use the shorter helper hint',
);

assert.strictEqual(
  component.includes('Use arrow keys or swipe to preview, then open the active panel'),
  false,
  'Nav menu should remove the old narrated helper hint',
);

assert.strictEqual(
  component.includes('subtitle: "Overview"'),
  true,
  'Estates subtitle should become more direct',
);

assert.strictEqual(
  component.includes('subtitle: "Monthly performance"'),
  true,
  'Revenue subtitle should become more direct',
);

assert.strictEqual(
  component.includes('subtitle: "Cameras and systems"'),
  true,
  'Property subtitle should avoid ornamental punctuation',
);

assert.strictEqual(
  component.includes('subtitle: "Arrivals and departures"'),
  true,
  'Calendar subtitle should become more direct',
);

assert.strictEqual(
  component.includes('At a glance'),
  false,
  'Nav menu should remove the old ornamental estates subtitle',
);

assert.strictEqual(
  component.includes('This month'),
  false,
  'Nav menu should remove the old ornamental revenue subtitle',
);

assert.strictEqual(
  component.includes('Who\'s arriving'),
  false,
  'Nav menu should remove the old ornamental calendar subtitle',
);

assert.strictEqual(
  component.includes('nav-panel__status'),
  false,
  'Nav menu should remove the Selected status badge',
);

assert.strictEqual(
  component.includes('nav-panel-cta-arrow'),
  false,
  'Nav menu should remove the decorative CTA arrow',
);

assert.strictEqual(
  component.includes('Selected'),
  false,
  'Nav menu should not narrate the obvious selected state',
);

assert.match(
  component,
  /className="nav-panel__cta"[\s\S]*>\s*Open\s*<\/button>/,
  'Nav CTA should use the short visible label Open',
);

assert.strictEqual(
  component.includes('Open {item.label}'),
  false,
  'Visible CTA text should not repeat the panel label',
);

const ctaStart = css.indexOf('.nav-panel__cta {');
const ctaEnd = css.indexOf('\n}', ctaStart) + 2;
const ctaBlock = css.slice(ctaStart, ctaEnd);

assert.strictEqual(
  ctaBlock.includes('border-radius: 999px;'),
  false,
  'CTA should no longer use a pill treatment',
);

assert.strictEqual(
  ctaBlock.includes('border-bottom: 1px solid currentColor;'),
  true,
  'CTA should become a quieter text action',
);

assert.strictEqual(
  css.includes('.nav-panel__status {'),
  false,
  'Status badge CSS should be removed',
);

assert.strictEqual(
  css.includes('.nav-panel-cta-arrow {'),
  false,
  'CTA arrow CSS should be removed',
);

console.log('PASS: nav menu copy/signaling is concise and non-redundant');
