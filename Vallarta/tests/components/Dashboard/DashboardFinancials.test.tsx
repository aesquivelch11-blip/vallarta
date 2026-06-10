import { render, cleanup, fireEvent } from '@testing-library/react';
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

  it('left arrow button has aria-label "Previous period"', () => {
    const { container } = render(<DashboardFinancials data={mockData} onNavigate={vi.fn()} />);
    const navButtons = container.querySelectorAll('.dashboard-focus');
    expect(navButtons[0].getAttribute('aria-label')).toBe('Previous period');
    expect(navButtons[1].getAttribute('aria-label')).toBe('Next period');
  });

  it('first button (ChevronLeft) navigates to an older period (increases index)', () => {
    const { container } = render(
      <DashboardFinancials data={mockData} onNavigate={vi.fn()} />
    );
    expect(container.textContent).toContain('June 2026');

    const navButtons = container.querySelectorAll('.dashboard-focus');
    fireEvent.click(navButtons[0]);

    expect(container.textContent).toContain('May 2026');
  });

  it('second button (ChevronRight) navigates to a newer period (decreases index)', () => {
    const { container } = render(
      <DashboardFinancials data={mockData} onNavigate={vi.fn()} />
    );
    const navButtons = container.querySelectorAll('.dashboard-focus');
    fireEvent.click(navButtons[0]);
    expect(container.textContent).toContain('May 2026');

    fireEvent.click(navButtons[1]);
    expect(container.textContent).toContain('June 2026');
  });

  it('first button is disabled on oldest period', () => {
    const { container } = render(
      <DashboardFinancials data={mockData} onNavigate={vi.fn()} />
    );
    const navButtons = container.querySelectorAll('.dashboard-focus');
    for (let i = 0; i < mockData.periods.length - 1; i++) {
      fireEvent.click(navButtons[0]);
    }
    expect(navButtons[0]).toBeDisabled();
  });

  it('second button is disabled on most recent period', () => {
    const { container } = render(
      <DashboardFinancials data={mockData} onNavigate={vi.fn()} />
    );
    const navButtons = container.querySelectorAll('.dashboard-focus');
    expect(navButtons[1]).toBeDisabled();
  });
});
