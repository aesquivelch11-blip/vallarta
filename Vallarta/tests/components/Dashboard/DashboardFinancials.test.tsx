import { render, cleanup } from '@testing-library/react';
import { describe, it, expect, afterEach, vi } from 'vitest';
import DashboardFinancials from '../../../src/components/Dashboard/DashboardFinancials';
import { getDashboardData } from '../../../src/components/Dashboard/dashboardData';

vi.mock('../../../src/components/Dashboard/AmbientColorProvider', () => ({
  useAmbient: () => ({ canvas: '#faf6f0', accent: '#d4a76a', surface: '#fdf8f2' }),
}));

afterEach(cleanup);

const mockData = getDashboardData('villa_selva');

describe('DashboardFinancials', () => {
  it('renders period selector with label', () => {
    const { container } = render(<DashboardFinancials data={mockData} onNavigate={vi.fn()} />);
    expect(container.textContent).toContain('June 2026');
  });

  it('renders Revenue figure', () => {
    const { container } = render(<DashboardFinancials data={mockData} onNavigate={vi.fn()} />);
    expect(container.textContent).toContain('REVENUE');
  });

  it('renders Expenses figure', () => {
    const { container } = render(<DashboardFinancials data={mockData} onNavigate={vi.fn()} />);
    expect(container.textContent).toContain('EXPENSES');
  });

  it('renders Net figure', () => {
    const { container } = render(<DashboardFinancials data={mockData} onNavigate={vi.fn()} />);
    expect(container.textContent).toContain('NET');
  });

  it('renders expense breakdown section', () => {
    const { container } = render(<DashboardFinancials data={mockData} onNavigate={vi.fn()} />);
    expect(container.textContent).toContain('EXPENSE BREAKDOWN');
  });

  it('renders revenue trajectory section', () => {
    const { container } = render(<DashboardFinancials data={mockData} onNavigate={vi.fn()} />);
    expect(container.textContent).toContain('REVENUE TRAJECTORY');
  });

  it('renders VIEW FINANCIALS button', () => {
    const { container } = render(<DashboardFinancials data={mockData} onNavigate={vi.fn()} />);
    const btn = container.querySelector('.dashboard-link');
    expect(btn).not.toBeNull();
    expect(btn?.textContent).toContain('VIEW FINANCIALS');
  });

  it('renders budget progress bar', () => {
    const { container } = render(<DashboardFinancials data={mockData} onNavigate={vi.fn()} />);
    expect(container.textContent).toContain('% of $');
  });

  it('period navigation buttons are present', () => {
    const { container } = render(<DashboardFinancials data={mockData} onNavigate={vi.fn()} />);
    const leftChevron = container.querySelector('[aria-label="Next period"]');
    const rightChevron = container.querySelector('[aria-label="Previous period"]');
    expect(leftChevron).not.toBeNull();
    expect(rightChevron).not.toBeNull();
  });
});
