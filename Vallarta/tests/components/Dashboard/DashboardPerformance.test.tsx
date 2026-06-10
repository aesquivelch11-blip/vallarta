import { render, cleanup } from '@testing-library/react';
import { describe, it, expect, afterEach, vi } from 'vitest';
import DashboardPerformance from '../../../src/components/Dashboard/DashboardPerformance';
import { getDashboardData } from '../../../src/components/Dashboard/dashboardData';

vi.mock('../../../src/components/Dashboard/AmbientColorProvider', () => ({
  useAmbient: () => ({ canvas: '#faf6f0', accent: '#d4a76a', surface: '#fdf8f2' }),
}));

afterEach(cleanup);

const mockData = getDashboardData('casa-palmeras');

describe('DashboardPerformance', () => {
  it('renders REVENUE TREND heading', () => {
    const { container } = render(<DashboardPerformance data={mockData} />);
    expect(container.textContent).toContain('REVENUE TREND');
  });

  it('renders NEXT 30 DAYS heading', () => {
    const { container } = render(<DashboardPerformance data={mockData} />);
    expect(container.textContent).toContain('NEXT 30 DAYS');
  });

  it('renders an SVG chart', () => {
    const { container } = render(<DashboardPerformance data={mockData} />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('renders 30 occupancy bars', () => {
    const { container } = render(<DashboardPerformance data={mockData} />);
    const bars = container.querySelectorAll('div[style*="cursor: pointer"]');
    expect(bars.length).toBe(30);
  });
});
