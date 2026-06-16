import React from 'react';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { describe, it, expect, afterEach, vi } from 'vitest';
import BookingPanel from '../../src/components/calendar/BookingPanel';

vi.mock('motion/react', () => ({
  motion: {
    div: ({ children, className, style, ...rest }: React.HTMLAttributes<HTMLDivElement> & { children?: React.ReactNode }) =>
      <div className={className} style={style} {...rest}>{children}</div>,
    span: ({ children, className, ...rest }: React.HTMLAttributes<HTMLSpanElement> & { children?: React.ReactNode }) =>
      <span className={className} {...rest}>{children}</span>,
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  LayoutGroup: ({ children }: { children: React.ReactNode }) => <>{children}</>,
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
    const style = panel!.getAttribute('style') ?? '';
    expect(style).not.toContain('background-color');
    expect(style).not.toMatch(/background\s*:/);
  });

  it('has the cal-panel CSS class for Banderas Midnight background', () => {
    const { container } = renderPanel();
    const panel = container.querySelector('[role="complementary"]');
    expect(panel?.className).toContain('cal-panel');
  });
});

describe('BookingPanel — Date Interaction', () => {
  it('renders date fields as interactive buttons', () => {
    const { container } = renderPanel();
    const dateFields = container.querySelectorAll('.cal-drawer-date-field');
    expect(dateFields.length).toBe(2);
    const arrivalBtn = dateFields[0].querySelector('button');
    expect(arrivalBtn).not.toBeNull();
    expect(arrivalBtn?.getAttribute('aria-label')).toBe('Select arrival date');
  });

  it('shows placeholder text when no dates are selected', () => {
    const { container } = renderPanel();
    const arrivalBtn = container.querySelector('[aria-label="Select arrival date"]');
    expect(arrivalBtn?.textContent).toContain('Select date');
  });

  it('shows formatted dates when dates are preselected', () => {
    const { container } = renderPanel({
      preselectedRange: { checkIn: '2026-06-19', checkOut: '2026-06-24' },
    });
    const arrivalBtn = container.querySelector('[aria-label="Select arrival date"]');
    expect(arrivalBtn?.textContent).toContain('Jun');
  });
});

describe('BookingPanel — Primary Button', () => {
  it('renders the confirm reservation button', () => {
    const { container } = renderPanel();
    const saveBtn = container.querySelector('.cal-btn--primary');
    expect(saveBtn).not.toBeNull();
  });

  it('confirm button has primary class', () => {
    const { container } = renderPanel();
    const saveBtn = container.querySelector('.cal-btn.cal-btn--primary');
    expect(saveBtn).not.toBeNull();
    expect(saveBtn?.textContent).toContain('Confirm Reservation');
  });
});

describe('BookingPanel — Keyboard Support', () => {
  it('closes the panel when Escape is pressed', () => {
    const onClose = vi.fn();
    renderPanel({ onClose });
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not call onClose on Escape when panel is not open', () => {
    const onClose = vi.fn();
    renderPanel({ open: false, onClose });
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).not.toHaveBeenCalled();
  });

  it('cleans up the keyboard listener on unmount', () => {
    const onClose = vi.fn();
    const { unmount } = renderPanel({ onClose });
    unmount();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).not.toHaveBeenCalled();
  });
});

describe('BookingPanel — Segmented Control', () => {
  it('renders Guest and Owner Stay options', () => {
    const { container } = renderPanel();
    const options = container.querySelectorAll('.cal-drawer-toggle__option');
    expect(options).toHaveLength(2);
    expect(options[0].textContent).toBe('Guest');
    expect(options[1].textContent).toBe('Owner Stay');
  });

  it('marks the active option with aria-pressed', () => {
    const { container } = renderPanel();
    const options = container.querySelectorAll('.cal-drawer-toggle__option');
    expect(options[0].getAttribute('aria-pressed')).toBe('true');
    expect(options[1].getAttribute('aria-pressed')).toBe('false');
  });

  it('switches active option when clicked', () => {
    const { container } = renderPanel();
    const options = container.querySelectorAll('.cal-drawer-toggle__option');
    fireEvent.click(options[1]);
    expect(options[0].getAttribute('aria-pressed')).toBe('false');
    expect(options[1].getAttribute('aria-pressed')).toBe('true');
  });
});
