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
  it('renders StatusCards section', () => {
    const { container } = render(<DashboardOperations data={mockData} onNavigate={vi.fn()} />);
    expect(container.textContent).toContain('Maintenance');
    expect(container.textContent).toContain('Housekeeping');
    expect(container.textContent).toContain('Amenities');
    expect(container.textContent).toContain('Inspection');
  });

  it('renders TaskList with open tasks count', () => {
    const { container } = render(<DashboardOperations data={mockData} onNavigate={vi.fn()} />);
    expect(container.textContent).toContain('OPEN TASKS');
  });

  it('renders Chronicle Timeline', () => {
    const { container } = render(<DashboardOperations data={mockData} onNavigate={vi.fn()} />);
    expect(container.textContent).toContain('CHRONICLE');
  });

  it('renders guest log events from data', () => {
    const { container } = render(<DashboardOperations data={mockData} onNavigate={vi.fn()} />);
    expect(container.textContent).toContain('Elena Rosenthal checked in');
  });

  it('renders task descriptions from data', () => {
    const { container } = render(<DashboardOperations data={mockData} onNavigate={vi.fn()} />);
    expect(container.textContent).toContain('Replace pool filter cartridge');
  });

  it('renders with empty data gracefully', () => {
    const emptyData: DashboardData = {
      ...mockData,
      tasks: [],
      guestLog: [],
    };
    const { container } = render(<DashboardOperations data={emptyData} onNavigate={vi.fn()} />);
    expect(container.textContent).toContain('ALL CLEAR');
  });
});
