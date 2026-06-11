import React from 'react';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { describe, it, expect, afterEach, vi, beforeEach } from 'vitest';
import NavMenuView from '../../src/components/NavMenuView';

// Mock motion/react so tests don't depend on animation
vi.mock('motion/react', () => ({
  motion: {
    div: ({ children, className, style, ...rest }: React.HTMLAttributes<HTMLDivElement> & { children?: React.ReactNode }) =>
      <div className={className} style={style}>{children}</div>,
    button: ({ children, className, style, onClick, ...rest }: React.ButtonHTMLAttributes<HTMLButtonElement> & { children?: React.ReactNode }) =>
      <button className={className} style={style} onClick={onClick} {...rest}>{children}</button>,
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useReducedMotion: () => false,
}));

// Mock webp image imports
vi.mock('../../src/assets/Menu/menu-1.webp', () => ({ default: 'menu-1.webp' }));
vi.mock('../../src/assets/Menu/menu-2.webp', () => ({ default: 'menu-2.webp' }));
vi.mock('../../src/assets/Menu/menu-3.webp', () => ({ default: 'menu-3.webp' }));
vi.mock('../../src/assets/Menu/menu-4.webp', () => ({ default: 'menu-4.webp' }));

const mockNavigate = vi.fn();
const mockClose = vi.fn();

function renderNav(previousScreen?: string) {
  return render(
    <NavMenuView
      onNavigate={mockNavigate}
      onClose={mockClose}
      previousScreen={previousScreen as any}
    />
  );
}

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
  sessionStorage.clear();
});

describe('NavMenuView — Bottom Bar', () => {
  it('renders all 5 tab labels', () => {
    const { container } = renderNav();
    expect(container.textContent).toContain('Overview');
    expect(container.textContent).toContain('Revenue');
    expect(container.textContent).toContain('Operations');
    expect(container.textContent).toContain('Calendar');
    expect(container.textContent).toContain('Properties');
  });

  it('Escape key calls onClose', () => {
    renderNav();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(mockClose).toHaveBeenCalledTimes(1);
  });

  it('clicking the close button calls onClose', () => {
    const { getByLabelText } = renderNav();
    fireEvent.click(getByLabelText('Close menu'));
    expect(mockClose).toHaveBeenCalledTimes(1);
  });

  it('clicking a tab calls onNavigate with the correct screen', () => {
    const { getByLabelText } = renderNav();
    fireEvent.click(getByLabelText('Navigate to Revenue'));
    expect(mockNavigate).toHaveBeenCalledWith('deep_dive', 'push');
  });

  it('ArrowRight key navigates to next tab and updates aria-selected', () => {
    const { getAllByRole } = renderNav();
    const tabs = getAllByRole('tab');
    expect(tabs[0].getAttribute('aria-selected')).toBe('true');
    fireEvent.keyDown(document, { key: 'ArrowRight' });
    expect(tabs[1].getAttribute('aria-selected')).toBe('true');
  });

  it('ArrowLeft key wraps from first tab to last', () => {
    const { getAllByRole } = renderNav();
    fireEvent.keyDown(document, { key: 'ArrowLeft' });
    const tabs = getAllByRole('tab');
    expect(tabs[4].getAttribute('aria-selected')).toBe('true');
  });

  it('number key 2 activates the second tab (Revenue)', () => {
    const { getAllByRole } = renderNav();
    fireEvent.keyDown(document, { key: '2' });
    const tabs = getAllByRole('tab');
    expect(tabs[1].getAttribute('aria-selected')).toBe('true');
  });

  it('shows "you are here" marker on tab matching previousScreen', () => {
    const { container } = renderNav('deep_dive');
    expect(container.textContent).toContain('Revenue');
    const revenueTab = container.querySelector('[data-current="true"]');
    expect(revenueTab).not.toBeNull();
    expect(revenueTab?.textContent).toContain('Revenue');
  });
});
