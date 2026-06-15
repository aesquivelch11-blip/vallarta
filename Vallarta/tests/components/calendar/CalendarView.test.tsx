import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import CalendarView from '../../../src/components/CalendarView';

vi.mock('../../../src/hooks/useBookings', () => ({
  useBookings: () => ({ data: [], isLoading: false }),
  useCreateBooking: () => ({ mutate: vi.fn() }),
  useUpdateBooking: () => ({ mutate: vi.fn() }),
  useCancelBooking: () => ({ mutate: vi.fn() }),
}));

vi.mock('motion/react', () => ({
  motion: {
    nav: ({ children, className, ...rest }: React.HTMLAttributes<HTMLElement> & { children?: React.ReactNode }) =>
      <nav className={className} {...rest}>{children}</nav>,
    div: ({ children, className, ...rest }: React.HTMLAttributes<HTMLDivElement> & { children?: React.ReactNode }) =>
      <div className={className} {...rest}>{children}</div>,
    ul: ({ children, className, ...rest }: React.HTMLAttributes<HTMLUListElement> & { children?: React.ReactNode }) =>
      <ul className={className} {...rest}>{children}</ul>,
    li: ({ children, className, ...rest }: React.HTMLAttributes<HTMLLIElement> & { children?: React.ReactNode }) =>
      <li className={className} {...rest}>{children}</li>,
    button: ({ children, className, onClick, ...rest }: React.ButtonHTMLAttributes<HTMLButtonElement> & { children?: React.ReactNode }) =>
      <button className={className} onClick={onClick} {...rest}>{children}</button>,
    span: ({ children, className, ...rest }: React.HTMLAttributes<HTMLSpanElement> & { children?: React.ReactNode }) =>
      <span className={className} {...rest}>{children}</span>,
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  LayoutGroup: ({ children }: { children: React.ReactNode }) => <>{children}</>,
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

  it('booking nights value contains only digits', () => {
    renderCalendar();
    const nightsValues = document.querySelectorAll('.cal-booking-row__nights-value');
    nightsValues.forEach((el) => {
      expect(el.textContent).toMatch(/^\d+$/);
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
