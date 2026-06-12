import { render, cleanup } from '@testing-library/react';
import { describe, it, expect, afterEach, vi } from 'vitest';
import DashboardToday from '../../../src/components/Dashboard/DashboardToday';
import { getDashboardData } from '../../../src/components/Dashboard/dashboardData';

const mockNavigate = vi.fn();
const mockDomainChange = vi.fn();
const data = getDashboardData('casa-palmeras');

afterEach(cleanup);

describe('DashboardToday', () => {
  it('renders occupancy as dominant figure', () => {
    const { container } = render(
      <DashboardToday data={data} propertyName="Casa Palmeras" propertyLocation="PV" onNavigate={mockNavigate} />
    );
    expect(container.textContent).toContain('78%');
    expect(container.textContent).toContain('OCCUPANCY');
  });

  it('renders occupancy trend', () => {
    const { container } = render(
      <DashboardToday data={data} propertyName="Casa Palmeras" propertyLocation="PV" onNavigate={mockNavigate} />
    );
    expect(container.textContent).toContain('+5%');
  });

  it('renders arrivals with guest names in italic', () => {
    const { container } = render(
      <DashboardToday data={data} propertyName="Casa Palmeras" propertyLocation="PV" onNavigate={mockNavigate} />
    );
    expect(container.textContent).toContain('Elena Rosenthal');
    expect(container.textContent).toContain('2');
    expect(container.textContent).toContain('Arriving');
  });

  it('renders departures with upright names', () => {
    const { container } = render(
      <DashboardToday data={data} propertyName="Casa Palmeras" propertyLocation="PV" onNavigate={mockNavigate} />
    );
    expect(container.textContent).toContain('James Whitfield');
    expect(container.textContent).toContain('Departing');
  });

  it('renders tomorrow hints', () => {
    const { container } = render(
      <DashboardToday data={data} propertyName="Casa Palmeras" propertyLocation="PV" onNavigate={mockNavigate} />
    );
    expect(container.textContent).toContain('guest arrives tomorrow');
  });

  it('does not render any cards or borders', () => {
    const { container } = render(
      <DashboardToday data={data} propertyName="Casa Palmeras" propertyLocation="PV" onNavigate={mockNavigate} />
    );
    const cards = container.querySelectorAll('[style*="border-radius: 8px"]');
    expect(cards.length).toBe(0);
  });

  it('does not render metric cards, sparklines, or badges', () => {
    const { container } = render(
      <DashboardToday data={data} propertyName="Casa Palmeras" propertyLocation="PV" onNavigate={mockNavigate} />
    );
    expect(container.textContent).not.toContain('Revenue MTD');
    expect(container.textContent).not.toContain('Satisfaction');
  });

  it('renders quiet day message when no activity', () => {
    const quietData = { ...data, arrivalsToday: [], departuresToday: [] };
    const { container } = render(
      <DashboardToday data={quietData} propertyName="Casa Palmeras" propertyLocation="PV" onNavigate={mockNavigate} />
    );
    expect(container.textContent).toContain('A quiet day.');
  });
});
