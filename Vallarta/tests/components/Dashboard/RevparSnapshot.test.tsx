import { render, cleanup } from '@testing-library/react';
import { describe, it, expect, afterEach } from 'vitest';
import RevparSnapshot from '../../../src/components/Dashboard/RevparSnapshot';

afterEach(cleanup);

const mockSparkline = [68, 71, 73, 74, 76, 78];

describe('RevparSnapshot', () => {
  it('renders REVPAR label', () => {
    const { container } = render(
      <RevparSnapshot revenue={12400} daysInPeriod={30} sparklineData={mockSparkline} trend="+5%" trendDirection="up" />
    );
    expect(container.textContent).toContain('REVPAR');
  });

  it('displays correct RevPAR value (revenue / daysInPeriod)', () => {
    const { container } = render(
      <RevparSnapshot revenue={12400} daysInPeriod={30} sparklineData={mockSparkline} trend="+5%" trendDirection="up" />
    );
    // 12400 / 30 = 413.33 → rounds to 413
    expect(container.textContent).toContain('413');
  });

  it('defaults to 30 days when daysInPeriod is omitted', () => {
    const { container } = render(
      <RevparSnapshot revenue={9000} sparklineData={mockSparkline} trend="+2%" trendDirection="up" />
    );
    // 9000 / 30 = 300
    expect(container.textContent).toContain('300');
  });

  it('renders an SVG sparkline', () => {
    const { container } = render(
      <RevparSnapshot revenue={12400} sparklineData={mockSparkline} trend="+5%" trendDirection="up" />
    );
    expect(container.querySelector('svg')).toBeInTheDocument();
    expect(container.querySelector('polyline')).toBeInTheDocument();
  });

  it('renders trend value', () => {
    const { container } = render(
      <RevparSnapshot revenue={12400} sparklineData={mockSparkline} trend="+14%" trendDirection="up" />
    );
    expect(container.textContent).toContain('+14%');
  });
});
