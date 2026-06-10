import { render, cleanup } from '@testing-library/react';
import { describe, it, expect, afterEach } from 'vitest';
import TaskList from '../../../src/components/Dashboard/TaskList';
import { DashboardTask } from '../../../src/components/Dashboard/dashboardData';

afterEach(cleanup);

const mockTasks: DashboardTask[] = [
  { id: 't1', description: 'Replace pool filter cartridge', status: 'urgent', category: 'maintenance', assignee: 'Carlos', dueDate: '2026-06-05' },
  { id: 't2', description: 'Deep clean terrace', status: 'pending', category: 'housekeeping', assignee: 'Ana', dueDate: '2026-06-12' },
  { id: 't3', description: 'Refill propane', status: 'scheduled', category: 'amenities', assignee: 'Ana', dueDate: '2026-06-18' },
];

describe('TaskList', () => {
  it('renders open tasks count', () => {
    const { container } = render(<TaskList tasks={mockTasks} />);
    expect(container.textContent).toContain('3 OPEN TASKS');
  });

  it('shows ALL CLEAR when no tasks', () => {
    const { container } = render(<TaskList tasks={[]} />);
    expect(container.textContent).toContain('ALL CLEAR');
  });

  it('renders task descriptions', () => {
    const { container } = render(<TaskList tasks={mockTasks} />);
    expect(container.textContent).toContain('Replace pool filter cartridge');
    expect(container.textContent).toContain('Deep clean terrace');
  });

  it('renders task status labels', () => {
    const { container } = render(<TaskList tasks={mockTasks} />);
    expect(container.textContent).toContain('Urgent');
    expect(container.textContent).toContain('Pending');
    expect(container.textContent).toContain('Scheduled');
  });

  it('renders assignee names', () => {
    const { container } = render(<TaskList tasks={mockTasks} />);
    expect(container.textContent).toContain('Carlos');
    expect(container.textContent).toContain('Ana');
  });

  it('limits visible tasks to 5', () => {
    const manyTasks: DashboardTask[] = Array.from({ length: 7 }, (_, i) => ({
      id: `t${i}`, description: `Task ${i + 1}`, status: 'pending' as const,
      category: 'maintenance' as const, assignee: 'Carlos', dueDate: '2026-06-10',
    }));
    const { container } = render(<TaskList tasks={manyTasks} />);
    expect(container.textContent).toContain('7 OPEN TASKS');
    const items = container.querySelectorAll('ol li');
    expect(items.length).toBe(5);
  });

  it('renders numeral anchors', () => {
    const { container } = render(<TaskList tasks={mockTasks} />);
    expect(container.textContent).toContain('1');
    expect(container.textContent).toContain('2');
    expect(container.textContent).toContain('3');
  });

  it('renders due dates', () => {
    const { container } = render(<TaskList tasks={mockTasks} />);
    const dueText = container.textContent || '';
    expect(dueText).toContain('2d overdue');
  });
});
