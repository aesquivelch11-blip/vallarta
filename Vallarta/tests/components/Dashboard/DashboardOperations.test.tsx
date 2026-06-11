import { render, cleanup } from '@testing-library/react';
import { describe, it, expect, afterEach, vi } from 'vitest';
import DashboardOperations from '../../../src/components/Dashboard/DashboardOperations';
import { DashboardData, getDashboardData } from '../../../src/components/Dashboard/dashboardData';

vi.mock('../../../src/components/Dashboard/AmbientColorProvider', () => ({
  useAmbient: () => ({ canvas: '#faf6f0', accent: '#d4a76a', surface: '#fdf8f2' }),
}));

afterEach(cleanup);

const mockData = getDashboardData('casa-palmeras');

describe('DashboardOperations', () => {
  it('does not render OPEN TASKS label', () => {
    const { container } = render(<DashboardOperations data={mockData} onNavigate={vi.fn()} />);
    expect(container.textContent).not.toContain('OPEN TASKS');
  });

  it('does not render CHRONICLE heading', () => {
    const { container } = render(<DashboardOperations data={mockData} onNavigate={vi.fn()} />);
    expect(container.textContent).not.toContain('CHRONICLE');
  });

  it('renders guest log event descriptions', () => {
    const { container } = render(<DashboardOperations data={mockData} onNavigate={vi.fn()} />);
    expect(container.textContent).toContain('Elena Rosenthal checked in');
  });

  it('renders task descriptions', () => {
    const { container } = render(<DashboardOperations data={mockData} onNavigate={vi.fn()} />);
    expect(container.textContent).toContain('Replace pool filter cartridge');
  });

  it('has two distinct layout zones', () => {
    const { container } = render(<DashboardOperations data={mockData} onNavigate={vi.fn()} />);
    const outerDiv = container.firstChild as HTMLElement;
    expect(outerDiv.childNodes.length).toBe(2);
  });

  it('chronicle zone has tinted background', () => {
    const { container } = render(<DashboardOperations data={mockData} onNavigate={vi.fn()} />);
    const outerDiv = container.firstChild as HTMLElement;
    const chronicleZone = outerDiv.childNodes[1] as HTMLElement;
    expect(chronicleZone.style.background).toBeTruthy();
  });

  it('renders "All clear." when no tasks', () => {
    const emptyData: DashboardData = { ...mockData, tasks: [], guestLog: [] };
    const { container } = render(<DashboardOperations data={emptyData} onNavigate={vi.fn()} />);
    expect(container.textContent).toContain('All clear.');
  });
});
