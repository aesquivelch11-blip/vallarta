import { render, cleanup, fireEvent } from '@testing-library/react';
import { describe, it, expect, afterEach, vi } from 'vitest';
import DashboardFinancials from '../../../src/components/Dashboard/DashboardFinancials';
import { getDashboardData } from '../../../src/components/Dashboard/dashboardData';

const mockNavigate = vi.fn();
const data = getDashboardData('casa-palmeras');

afterEach(cleanup);

describe('DashboardFinancials', () => {
  it('renders current period label', () => {
    const { container } = render(<DashboardFinancials data={data} onNavigate={mockNavigate} />);
    expect(container.textContent).toContain('June 2026');
  });

  it('renders Revenue, Expenses, Net labels', () => {
    const { container } = render(<DashboardFinancials data={data} onNavigate={mockNavigate} />);
    expect(container.textContent).toContain('REVENUE');
    expect(container.textContent).toContain('EXPENSES');
    expect(container.textContent).toContain('NET');
  });

  it('renders correct Revenue figure', () => {
    const { container } = render(<DashboardFinancials data={data} onNavigate={mockNavigate} />);
    expect(container.textContent).toContain('$12,400');
  });

  it('renders correct Expenses figure', () => {
    const { container } = render(<DashboardFinancials data={data} onNavigate={mockNavigate} />);
    expect(container.textContent).toContain('$3,200');
  });

  it('renders correct Net figure', () => {
    const { container } = render(<DashboardFinancials data={data} onNavigate={mockNavigate} />);
    // 12400 - 3200 = 9200
    expect(container.textContent).toContain('$9,200');
  });

  it('does not render Expense Breakdown, Revenue Trajectory, or Occupancy', () => {
    const { container } = render(<DashboardFinancials data={data} onNavigate={mockNavigate} />);
    expect(container.textContent).not.toContain('EXPENSE BREAKDOWN');
    expect(container.textContent).not.toContain('REVENUE TRAJECTORY');
    expect(container.textContent).not.toContain('30-DAY OCCUPANCY');
  });

  it('period navigation works — left arrow goes to older period', () => {
    const { container } = render(<DashboardFinancials data={data} onNavigate={mockNavigate} />);
    const buttons = container.querySelectorAll('button[aria-label]');
    const leftBtn = Array.from(buttons).find(
      b => b.getAttribute('aria-label') === 'Previous period'
    ) as HTMLButtonElement;
    fireEvent.click(leftBtn);
    expect(container.textContent).toContain('May 2026');
  });

  it('period navigation works — right arrow goes back to newer period', () => {
    const { container } = render(<DashboardFinancials data={data} onNavigate={mockNavigate} />);
    const buttons = container.querySelectorAll('button[aria-label]');
    const leftBtn = Array.from(buttons).find(
      b => b.getAttribute('aria-label') === 'Previous period'
    ) as HTMLButtonElement;
    fireEvent.click(leftBtn);
    expect(container.textContent).toContain('May 2026');

    const rightBtn = Array.from(buttons).find(
      b => b.getAttribute('aria-label') === 'Next period'
    ) as HTMLButtonElement;
    fireEvent.click(rightBtn);
    expect(container.textContent).toContain('June 2026');
  });

  it('left arrow disables on oldest period', () => {
    const { container } = render(<DashboardFinancials data={data} onNavigate={mockNavigate} />);
    const buttons = container.querySelectorAll('button[aria-label]');
    const leftBtn = Array.from(buttons).find(
      b => b.getAttribute('aria-label') === 'Previous period'
    ) as HTMLButtonElement;
    for (let i = 0; i < 5; i++) {
      fireEvent.click(leftBtn);
    }
    expect(leftBtn).toBeDisabled();
  });

  it('right arrow disables on most recent period', () => {
    const { container } = render(<DashboardFinancials data={data} onNavigate={mockNavigate} />);
    const buttons = container.querySelectorAll('button[aria-label]');
    const rightBtn = Array.from(buttons).find(
      b => b.getAttribute('aria-label') === 'Next period'
    ) as HTMLButtonElement;
    expect(rightBtn).toBeDisabled();
  });
});
