import { render, cleanup } from '@testing-library/react';
import { describe, it, expect, afterEach } from 'vitest';
import ExpenseBreakdownChart from '../../../src/components/Dashboard/ExpenseBreakdownChart';

afterEach(cleanup);

const mockData = [
  { label: 'Housekeeping', amount: 14500 },
  { label: 'Maintenance', amount: 8900 },
  { label: 'Utilities', amount: 6200 },
  { label: 'Staffing', amount: 22100 },
  { label: 'Amenities', amount: 4100 },
];

describe('ExpenseBreakdownChart', () => {
  it('starts bars at zero width before animation', () => {
    const { container } = render(<ExpenseBreakdownChart data={mockData} />);
    const bars = container.querySelectorAll('[style*="width: 0%"]');
    expect(bars.length).toBe(5);
  });

  it('renders a bar container for each item', () => {
    const { container } = render(<ExpenseBreakdownChart data={mockData} />);
    const barContainers = container.querySelectorAll('[style*="height: 6px"][style*="overflow: hidden"]');
    expect(barContainers.length).toBe(5);
  });

  it('renders all expense labels', () => {
    const { container } = render(<ExpenseBreakdownChart data={mockData} />);
    expect(container.textContent).toContain('Housekeeping');
    expect(container.textContent).toContain('Staffing');
    expect(container.textContent).toContain('Utilities');
  });

  it('renders amounts formatted with dollar sign', () => {
    const { container } = render(<ExpenseBreakdownChart data={mockData} />);
    expect(container.textContent).toContain('$14,500');
    expect(container.textContent).toContain('$22,100');
  });

  it('renders inner bar divs with green background', () => {
    const { container } = render(<ExpenseBreakdownChart data={mockData} />);
    const innerBars = container.querySelectorAll('[style*="background: var(--color-accent-positive)"]');
    expect(innerBars.length).toBe(5);
  });
});
