import { render, cleanup } from '@testing-library/react';
import { describe, it, expect, afterEach } from 'vitest';
import RevenueTrajectoryChart from '../../../src/components/Dashboard/RevenueTrajectoryChart';

afterEach(cleanup);

const mockData = [450000, 478000, 512000, 498000, 534000, 561000];
const mockLabels = ['Jan 2026', 'Feb 2026', 'Mar 2026', 'Apr 2026', 'May 2026', 'Jun 2026'];

describe('RevenueTrajectoryChart', () => {
  it('renders an SVG element', () => {
    const { container } = render(<RevenueTrajectoryChart data={mockData} />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('renders correct viewBox dimensions', () => {
    const { container } = render(<RevenueTrajectoryChart data={mockData} />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('viewBox', '0 0 400 150');
  });

  it('renders a gradient defs element', () => {
    const { container } = render(<RevenueTrajectoryChart data={mockData} />);
    const gradient = container.querySelector('defs linearGradient');
    expect(gradient).toBeInTheDocument();
  });

  it('renders area fill polygon', () => {
    const { container } = render(<RevenueTrajectoryChart data={mockData} />);
    const polygon = container.querySelector('polygon');
    expect(polygon).toBeInTheDocument();
  });

  it('renders a polyline for the data line', () => {
    const { container } = render(<RevenueTrajectoryChart data={mockData} />);
    const polyline = container.querySelector('polyline');
    expect(polyline).toBeInTheDocument();
    expect(polyline).toHaveAttribute('stroke', 'var(--color-accent-positive)');
  });

  it('renders start and end labels when provided', () => {
    const { container } = render(<RevenueTrajectoryChart data={mockData} labels={mockLabels} />);
    const texts = container.querySelectorAll('text');
    expect(texts.length).toBe(2);
    expect(texts[0].textContent).toBe('Jan 2026');
    expect(texts[1].textContent).toBe('Jun 2026');
  });

  it('does not render labels when not provided', () => {
    const { container } = render(<RevenueTrajectoryChart data={mockData} />);
    const texts = container.querySelectorAll('text');
    expect(texts.length).toBe(0);
  });
});
