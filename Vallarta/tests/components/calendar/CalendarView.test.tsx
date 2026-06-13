import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import CalendarView from '../../../src/components/CalendarView';

vi.mock('motion/react', () => ({
  motion: {
    nav: ({ children, className, ...rest }: React.HTMLAttributes<HTMLElement> & { children?: React.ReactNode }) =>
      <nav className={className} {...rest}>{children}</nav>,
    div: ({ children, className, ...rest }: React.HTMLAttributes<HTMLDivElement> & { children?: React.ReactNode }) =>
      <div className={className} {...rest}>{children}</div>,
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useReducedMotion: () => false,
}));

const mockNavigate = vi.fn();

function renderCalendar() {
  return render(
    <CalendarView onNavigate={mockNavigate} />
  );
}

describe('CalendarView DOM structure', () => {
  it('does not render the drag-hint paragraph in the DOM', () => {
    renderCalendar();
    expect(
      screen.queryByText(/click and drag dates to create/i)
    ).toBeNull();
  });

  it('calendar grid has drag instruction in accessible label', () => {
    renderCalendar();
    const grids = screen.getAllByRole('grid', { name: /click and drag/i });
    expect(grids.length).toBeGreaterThanOrEqual(1);
  });

  it('booking nights are rendered without n suffix', () => {
    renderCalendar();
    const nightsCells = document.querySelectorAll('.cal-booking-row__nights');
    nightsCells.forEach((cell) => {
      expect(cell.textContent).toMatch(/^\d+$/);
    });
  });

  it('nav right cluster contains no cal-pill element', () => {
    renderCalendar();
    expect(document.querySelector('.cal-pill')).toBeNull();
  });

  it('nav right cluster contains no cal-avatar element', () => {
    renderCalendar();
    expect(document.querySelector('.cal-avatar')).toBeNull();
  });
});
