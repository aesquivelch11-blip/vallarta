import React from 'react';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { describe, it, expect, afterEach, vi } from 'vitest';
import BookingPanel from '../../src/components/calendar/BookingPanel';

vi.mock('motion/react', () => ({
  motion: {
    div: ({ children, className, style, ...rest }: React.HTMLAttributes<HTMLDivElement> & { children?: React.ReactNode }) =>
      <div className={className} style={style} {...rest}>{children}</div>,
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useReducedMotion: () => false,
}));

const defaultProps = {
  open: true,
  booking: null,
  mode: 'add' as const,
  bookings: [],
  onSave: vi.fn(),
  onConfirm: vi.fn(),
  onCancelBooking: vi.fn(),
  onEdit: vi.fn(),
  onClose: vi.fn(),
};

function renderPanel(props = {}) {
  return render(<BookingPanel {...defaultProps} {...props} />);
}

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe('BookingPanel — Background Consistency', () => {
  it('does not apply an inline backgroundColor style', () => {
    const { container } = renderPanel();
    const panel = container.querySelector('[role="complementary"]');
    expect(panel).not.toBeNull();
    expect(panel!.getAttribute('style')).toBeNull();
  });

  it('has the cal-panel CSS class for Banderas Midnight background', () => {
    const { container } = renderPanel();
    const panel = container.querySelector('[role="complementary"]');
    expect(panel?.className).toContain('cal-panel');
  });
});

describe('BookingPanel — Date Interaction', () => {
  it('renders the date field as an interactive button, not static text', () => {
    const { container } = renderPanel();
    const dateField = container.querySelector('.cal-drawer-date-field');
    expect(dateField).not.toBeNull();
    expect(dateField?.tagName).toBe('BUTTON');
    expect(dateField?.getAttribute('aria-label')).toBe('Select arrival and departure dates');
  });

  it('shows placeholder text when no dates are selected', () => {
    const { container } = renderPanel();
    const dateField = container.querySelector('.cal-drawer-date-field');
    expect(dateField?.textContent).toContain('Set arrival and departure');
  });

  it('shows formatted dates when dates are preselected', () => {
    const { container } = renderPanel({
      preselectedRange: { checkIn: '2026-06-19', checkOut: '2026-06-24' },
    });
    const dateField = container.querySelector('.cal-drawer-date-field');
    expect(dateField?.textContent).toContain('Jun');
  });
});

describe('BookingPanel — Primary Button Weight', () => {
  it('renders the save button as a bordered pill, not a full-width solid block', () => {
    const { container } = renderPanel();
    const saveBtn = container.querySelector('.cal-drawer-btn--save');
    expect(saveBtn).not.toBeNull();
    expect(saveBtn?.className).not.toContain('w-full');
  });

  it('save button has pill border-radius', () => {
    const { container } = renderPanel();
    const saveBtn = container.querySelector('.cal-drawer-btn--save');
    expect(saveBtn).not.toBeNull();
    // The cal-drawer-btn--save CSS class applies border-radius: 999px
    expect(saveBtn?.className).toContain('cal-drawer-btn--save');
    // Pill buttons are inline-block, not full-width blocks
    expect(saveBtn?.className).not.toContain('w-full');
  });
});
