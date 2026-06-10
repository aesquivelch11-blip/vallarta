import { render, cleanup, act } from '@testing-library/react';
import { describe, it, expect, afterEach, vi, beforeEach } from 'vitest';
import DashboardView from '../../../src/components/Dashboard/DashboardView';

const mockNavigate = vi.fn();
const mockNotify = vi.fn();

vi.mock('../../../src/components/Dashboard/AmbientColorProvider', () => ({
  AmbientProvider: ({ children }: { children: React.ReactNode }) => <div data-testid="ambient-provider">{children}</div>,
  useAmbient: () => ({ canvas: '#faf6f0', accent: '#d4a76a', surface: '#fdf8f2' }),
}));

afterEach(cleanup);

describe('DashboardView', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it('renders Back and Menu buttons after loading completes', () => {
    const { container } = render(
      <DashboardView propertyId="casa-del-sol" onNavigate={mockNavigate} onNotify={mockNotify} />
    );
    act(() => { vi.advanceTimersByTime(400); });
    expect(container.textContent).toContain('Back');
    expect(container.textContent).toContain('Menu');
  });

  it('renders domain content after loading completes', () => {
    const { container } = render(
      <DashboardView propertyId="casa-del-sol" onNavigate={mockNavigate} onNotify={mockNotify} />
    );
    act(() => { vi.advanceTimersByTime(400); });
    const ambientProvider = container.querySelector('[data-testid="ambient-provider"]');
    expect(ambientProvider).toBeInTheDocument();
  });

  it('renders DarkModeToggle in the header', () => {
    const { container } = render(
      <DashboardView propertyId="casa-del-sol" onNavigate={mockNavigate} onNotify={mockNotify} />
    );
    act(() => { vi.advanceTimersByTime(400); });
    const toggle = container.querySelector('[aria-label="Toggle dark mode"]');
    expect(toggle).toBeInTheDocument();
  });

  it('renders only 3 domain tabs (Today, Financials, Tasks)', () => {
    const { container } = render(
      <DashboardView propertyId="casa-del-sol" onNavigate={mockNavigate} onNotify={mockNotify} />
    );
    act(() => { vi.advanceTimersByTime(400); });
    // Each nav section should have 3 buttons (one per domain)
    const navSections = container.querySelectorAll('nav[aria-label="Dashboard sections"]');
    navSections.forEach(section => {
      expect(section.querySelectorAll('button').length).toBe(3);
    });
    // Verify unique domain labels and no Performance
    const allLabels = Array.from(container.querySelectorAll('button[aria-pressed]'))
      .map(b => b.getAttribute('aria-label'))
      .filter(Boolean);
    const unique = new Set(allLabels);
    expect(unique.size).toBe(3);
    expect(unique.has('Today')).toBe(true);
    expect(unique.has('Financials')).toBe(true);
    expect(unique.has('Tasks')).toBe(true);
  });

  it('does not render a Performance tab', () => {
    const { container } = render(
      <DashboardView propertyId="casa-del-sol" onNavigate={mockNavigate} onNotify={mockNotify} />
    );
    act(() => { vi.advanceTimersByTime(400); });
    expect(container.textContent).not.toContain('Performance');
  });

  it('DarkModeToggle shows Moon icon in light mode (action target convention)', () => {
    localStorage.setItem('theme', 'light');
    const { container } = render(
      <DashboardView propertyId="casa-del-sol" onNavigate={mockNavigate} onNotify={mockNotify} />
    );
    act(() => { vi.advanceTimersByTime(400); });
    const toggle = container.querySelector('[aria-label="Toggle dark mode"]');
    expect(toggle).toBeInTheDocument();
    const svgChildren = toggle?.querySelectorAll('svg > *');
    expect(svgChildren?.length).toBe(1);
  });
});
