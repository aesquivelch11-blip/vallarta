import { render, cleanup } from '@testing-library/react';
import { describe, it, expect, afterEach } from 'vitest';
import StatusCards from '../../../src/components/Dashboard/StatusCards';
import { DashboardTask } from '../../../src/components/Dashboard/dashboardData';

afterEach(cleanup);

const emptyTasks: DashboardTask[] = [];

const mixedTasks: DashboardTask[] = [
  { id: 't1', description: 'Pool filter', status: 'urgent', category: 'maintenance', assignee: 'Carlos', dueDate: '2026-06-05' },
  { id: 't2', description: 'Deep clean', status: 'pending', category: 'housekeeping', assignee: 'Ana', dueDate: '2026-06-12' },
  { id: 't3', description: 'Restock amenities', status: 'scheduled', category: 'amenities', assignee: 'Ana', dueDate: '2026-06-07' },
];

const urgentTasks: DashboardTask[] = [
  { id: 't1', description: 'Pool filter', status: 'urgent', category: 'maintenance', assignee: 'Carlos', dueDate: '2026-06-05' },
  { id: 't2', description: 'Dock inspection', status: 'urgent', category: 'inspection', assignee: 'Miguel', dueDate: '2026-06-06' },
];

describe('StatusCards', () => {
  it('renders all 4 category cards', () => {
    const { container } = render(<StatusCards tasks={emptyTasks} />);
    const cards = container.querySelectorAll('div > div');
    expect(cards.length).toBeGreaterThanOrEqual(4);
  });

  it('shows All clear when no tasks exist', () => {
    const { container } = render(<StatusCards tasks={emptyTasks} />);
    expect(container.textContent).toContain('All clear');
  });

  it('shows urgent count for categories with urgent tasks', () => {
    const { container } = render(<StatusCards tasks={urgentTasks} />);
    expect(container.textContent).toContain('1 urgent');
  });

  it('shows pending count when no urgent but has pending', () => {
    const { container } = render(<StatusCards tasks={mixedTasks} />);
    expect(container.textContent).toContain('1 pending');
  });

  it('renders category labels', () => {
    const { container } = render(<StatusCards tasks={emptyTasks} />);
    expect(container.textContent).toContain('Maintenance');
    expect(container.textContent).toContain('Housekeeping');
    expect(container.textContent).toContain('Amenities');
    expect(container.textContent).toContain('Inspection');
  });

  it('uses grid layout with 3 columns', () => {
    const { container } = render(<StatusCards tasks={emptyTasks} />);
    const grid = container.firstChild as HTMLElement;
    expect(grid).toHaveStyle('display: grid');
    expect(grid).toHaveStyle('grid-template-columns: 1fr 1fr 1fr');
  });

  it('renders status dot indicators', () => {
    const { container } = render(<StatusCards tasks={emptyTasks} />);
    const dots = container.querySelectorAll('span');
    expect(dots.length).toBe(4);
  });
});
