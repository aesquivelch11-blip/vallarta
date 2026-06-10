import { render, cleanup } from '@testing-library/react';
import { describe, it, expect, afterEach } from 'vitest';
import ExpenseBreakdownChart from '../../../src/components/Dashboard/ExpenseBreakdownChart';

afterEach(cleanup);

const mockData = [
  { label: 'Maintenance', amount: 1200 },
  { label: 'Utilities', amount: 850 },
  { label: 'Staff', amount: 680 },
  { label: 'Supplies', amount: 320 },
  { label: 'Other', amount: 150 },
];

describe('ExpenseBreakdownChart', () => {
  it('renders all category labels', () => {
    const { container } = render(<ExpenseBreakdownChart data={mockData} />);
    expect(container.textContent).toContain('Maintenance');
    expect(container.textContent).toContain('Utilities');
    expect(container.textContent).toContain('Staff');
    expect(container.textContent).toContain('Supplies');
    expect(container.textContent).toContain('Other');
  });

  it('bar fill elements have distinct colors (no two adjacent bars same background)', () => {
    const { container } = render(<ExpenseBreakdownChart data={mockData} />);
    // Find all bar fill divs by their transform-origin style
    const bars = container.querySelectorAll('[style*="transform-origin: left center"]');
    expect(bars.length).toBe(5);

    const colors = Array.from(bars).map(b => (b as HTMLElement).style.background);
    // All 5 colors should be distinct
    const uniqueColors = new Set(colors);
    expect(uniqueColors.size).toBe(5);
  });

  it('renders dollar amounts for each category', () => {
    const { container } = render(<ExpenseBreakdownChart data={mockData} />);
    expect(container.textContent).toContain('$1,200');
    expect(container.textContent).toContain('$850');
  });
});
