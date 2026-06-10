import { render, cleanup, fireEvent } from '@testing-library/react';
import { describe, it, expect, afterEach } from 'vitest';
import OccupancyHeatmap from '../../../src/components/Dashboard/OccupancyHeatmap';

afterEach(cleanup);

const mockData = [80, 65, 90, 45, 70, 55, 85, 75, 60, 95, 50, 40, 88, 72, 68, 82, 78, 62, 92, 48, 77, 83, 67, 71, 58, 91, 69, 63, 87, 73];

describe('OccupancyHeatmap', () => {
  it('renders NEXT 30 DAYS heading', () => {
    const { container } = render(<OccupancyHeatmap data={mockData} />);
    expect(container.textContent).toContain('NEXT 30 DAYS');
  });

  it('renders 30 bars', () => {
    const { container } = render(<OccupancyHeatmap data={mockData} />);
    const bars = container.querySelectorAll('div[style*="cursor: pointer"]');
    expect(bars.length).toBe(30);
  });

  it('renders start and end date labels', () => {
    const { container } = render(<OccupancyHeatmap data={mockData} />);
    expect(container.textContent).toContain('Jun');
  });

  it('shows hover tooltip on mouse enter', () => {
    const { container } = render(<OccupancyHeatmap data={mockData} />);
    const firstBar = container.querySelector('div[title]') as HTMLElement;
    expect(firstBar).toBeTruthy();
    fireEvent.mouseEnter(firstBar);
    expect(container.textContent).toContain('% occupied');
  });
});
