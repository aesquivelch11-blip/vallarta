import fs from 'fs';
import assert from 'assert';

const css = fs.readFileSync('src/design-tokens.css', 'utf-8');
const view = fs.readFileSync('src/components/FinancialReportingView.tsx', 'utf-8');

// ── Anti-pattern removals ──────────────────────────────────────────────────

assert.strictEqual(
  css.includes('.stat-card'),
  false,
  'FAIL: design-tokens.css still defines .stat-card (identical card grids ban)'
);

assert.strictEqual(
  css.includes('.stats-band'),
  false,
  'FAIL: design-tokens.css still defines .stats-band'
);

assert.strictEqual(
  css.includes('arrival-item::before'),
  false,
  'FAIL: design-tokens.css still has side-stripe border on arrival-item::before'
);

assert.strictEqual(
  view.includes('StatCard'),
  false,
  'FAIL: FinancialReportingView.tsx still uses StatCard component'
);

assert.strictEqual(
  view.includes('arrival-item'),
  false,
  'FAIL: FinancialReportingView.tsx still uses arrival-item className'
);

assert.strictEqual(
  view.includes('arrival-avatar'),
  false,
  'FAIL: FinancialReportingView.tsx still uses arrival-avatar className'
);

assert.strictEqual(
  view.includes('getInitials'),
  false,
  'FAIL: FinancialReportingView.tsx still uses getInitials helper'
);

assert.strictEqual(
  view.includes('ArrivalAvatar'),
  false,
  'FAIL: FinancialReportingView.tsx still uses ArrivalAvatar component'
);

// ── New primitive introductions ────────────────────────────────────────────

assert.ok(
  css.includes('.metrics-rail'),
  'FAIL: design-tokens.css missing .metrics-rail'
);

assert.ok(
  css.includes('.metrics-rail__item'),
  'FAIL: design-tokens.css missing .metrics-rail__item'
);

assert.ok(
  css.includes('.metrics-rail__value'),
  'FAIL: design-tokens.css missing .metrics-rail__value'
);

assert.ok(
  css.includes('.arrival-row'),
  'FAIL: design-tokens.css missing .arrival-row'
);

assert.ok(
  view.includes('MetricItem'),
  'FAIL: FinancialReportingView.tsx missing MetricItem component'
);

assert.ok(
  view.includes('metrics-rail'),
  'FAIL: FinancialReportingView.tsx missing metrics-rail section'
);

assert.ok(
  view.includes('arrival-row'),
  'FAIL: FinancialReportingView.tsx missing arrival-row rows'
);

// ── Chart fill areas removed ───────────────────────────────────────────────

assert.strictEqual(
  view.includes('line-fill-revenue'),
  false,
  'FAIL: FinancialReportingView.tsx still has chart fill area (line-fill-revenue)'
);

assert.strictEqual(
  view.includes('line-fill-yield'),
  false,
  'FAIL: FinancialReportingView.tsx still has chart fill area (line-fill-yield)'
);

console.log('PASS: Dashboard premium elevation assertions passed');
