import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

const cssPath = path.resolve(__dirname, '../src/design-tokens.css');
const css = fs.readFileSync(cssPath, 'utf-8');

describe('design-tokens.css', () => {
  it('contains dashboard-link active press state', () => {
    expect(css).toContain('.dashboard-link:active');
    expect(css).toContain('transform: scale(0.98)');
  });

  it('contains dashboard-focus active press state', () => {
    expect(css).toContain('.dashboard-focus:active');
  });

  it('contains metric-card active press state', () => {
    expect(css).toContain('.metric-card:active');
  });

  it('contains metric-card hover lift state', () => {
    expect(css).toContain('.metric-card:hover');
    expect(css).toContain('transform: translateY(-2px)');
    expect(css).toContain('var(--shadow-lift)');
  });

  it('uses ease-out-quart for metric-card hover', () => {
    expect(css).toContain('var(--ease-out-quart)');
  });
});
