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
