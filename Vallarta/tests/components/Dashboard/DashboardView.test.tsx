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
});
