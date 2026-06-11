import { render, cleanup } from '@testing-library/react';
import { describe, it, expect, afterEach } from 'vitest';
import TaskList from '../../../src/components/Dashboard/TaskList';
import { DashboardTask } from '../../../src/components/Dashboard/dashboardData';

afterEach(cleanup);

const mockTasks: DashboardTask[] = [
  {
    id: 't1', description: 'Replace pool filter cartridge', status: 'urgent',
    category: 'maintenance', assignee: 'Carlos', dueDate: '2026-06-05',
  },
  {
    id: 't2', description: 'Deep clean terrace', status: 'pending',
    category: 'housekeeping', assignee: 'Ana', dueDate: '2026-06-12',
  },
  {
    id: 't3', description: 'Refill propane', status: 'scheduled',
    category: 'amenities', assignee: 'Ana', dueDate: '2026-06-18',
  },
];

describe('TaskList', () => {
  it('renders task count as display anchor number, not as label', () => {
    const { container } = render(<TaskList tasks={mockTasks} />);
    expect(container.textContent).toContain('3');
    expect(container.textContent).not.toContain('OPEN TASKS');
  });

  it('renders "All clear." when no tasks', () => {
    const { container } = render(<TaskList tasks={[]} />);
    expect(container.textContent).toContain('All clear.');
    expect(container.querySelector('ol')).toBeNull();
  });

  it('renders task descriptions', () => {
    const { container } = render(<TaskList tasks={mockTasks} />);
    expect(container.textContent).toContain('Replace pool filter cartridge');
    expect(container.textContent).toContain('Deep clean terrace');
    expect(container.textContent).toContain('Refill propane');
  });

  it('does not render status badge labels', () => {
    const { container } = render(<TaskList tasks={mockTasks} />);
    ['Urgent', 'Pending', 'Scheduled', 'URGENT', 'PENDING', 'SCHEDULED'].forEach(label => {
      expect(container.textContent).not.toContain(label);
    });
  });

  it('does not render numbered row indices', () => {
    const { container } = render(<TaskList tasks={mockTasks} />);
    const listItems = container.querySelectorAll('ol li');
    listItems.forEach(item => {
      const spans = item.querySelectorAll('span');
      spans.forEach(span => {
        expect(['1', '2', '3']).not.toContain(span.textContent?.trim());
      });
    });
  });

  it('shows overdue duration for urgent tasks', () => {
    const { container } = render(<TaskList tasks={mockTasks} />);
    expect(container.textContent).toContain('2d overdue');
  });

  it('shows scheduled date for scheduled tasks', () => {
    const { container } = render(<TaskList tasks={mockTasks} />);
    expect(container.textContent).toContain('Jun 18');
  });

  it('does not show due-date for pending tasks', () => {
    const pendingOnly: DashboardTask[] = [mockTasks[1]];
    const { container } = render(<TaskList tasks={pendingOnly} />);
    expect(container.textContent).toContain('Ana');
    expect(container.textContent).not.toContain('Jun 12');
    expect(container.textContent).not.toContain('5d');
  });

  it('renders assignee names in task rows', () => {
    const { container } = render(<TaskList tasks={mockTasks} />);
    expect(container.textContent).toContain('Carlos');
    expect(container.textContent).toContain('Ana');
  });

  it('limits visible rows to 5 even when more tasks exist', () => {
    const manyTasks: DashboardTask[] = Array.from({ length: 7 }, (_, i) => ({
      id: `t${i}`, description: `Task ${i + 1}`, status: 'pending' as const,
      category: 'maintenance' as const, assignee: 'Carlos', dueDate: '2026-06-10',
    }));
    const { container } = render(<TaskList tasks={manyTasks} />);
    expect(container.textContent).toContain('7');
    const items = container.querySelectorAll('ol li');
    expect(items.length).toBe(5);
  });
});
