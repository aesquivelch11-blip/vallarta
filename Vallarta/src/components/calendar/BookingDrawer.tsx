// src/components/calendar/BookingDrawer.tsx
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import {
  Booking,
  BookingType,
  calcNights,
  findOverlap,
  formatDisplayDates,
} from './bookingUtils';

export type DrawerMode = 'view' | 'edit' | 'add';

interface BookingDrawerProps {
  open: boolean;
  booking: Booking | null;
  mode: DrawerMode;
  bookings: Booking[];
  onSave: (booking: Booking) => void;
  onConfirm: (id: string) => void;
  onCancelBooking: (id: string) => void;
  onEdit: () => void;
  onClose: () => void;
}

const EASE = [0.22, 1, 0.36, 1] as const;

function todayStr(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export default function BookingDrawer({
  open,
  booking,
  mode,
  bookings,
  onSave,
  onConfirm,
  onCancelBooking,
  onEdit,
  onClose,
}: BookingDrawerProps) {
  const prefersReduced = useReducedMotion();

  const [formGuest, setFormGuest] = useState('');
  const [formType, setFormType] = useState<BookingType>('guest');
  const [formCheckIn, setFormCheckIn] = useState('');
  const [formCheckOut, setFormCheckOut] = useState('');
  const [dateError, setDateError] = useState('');
  const [overlapWarning, setOverlapWarning] = useState('');
  const [cancelArmed, setCancelArmed] = useState(false);
  const cancelTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Reset form state when drawer opens or mode changes
  useEffect(() => {
    if (!open) {
      setCancelArmed(false);
      if (cancelTimerRef.current) clearTimeout(cancelTimerRef.current);
      return;
    }
    if (mode === 'edit' && booking) {
      setFormGuest(booking.guest);
      setFormType(booking.type);
      setFormCheckIn(booking.checkIn);
      setFormCheckOut(booking.checkOut);
    } else if (mode === 'add') {
      setFormGuest('');
      setFormType('guest');
      setFormCheckIn('');
      setFormCheckOut('');
    }
    setDateError('');
    setOverlapWarning('');
  }, [open, mode, booking?.id]);

  // Cleanup cancel timer on unmount
  useEffect(() => {
    return () => {
      if (cancelTimerRef.current) clearTimeout(cancelTimerRef.current);
    };
  }, []);

  // Live overlap check as dates change
  useEffect(() => {
    if (!formCheckIn || !formCheckOut || formCheckOut <= formCheckIn) {
      setOverlapWarning('');
      return;
    }
    const overlap = findOverlap(formCheckIn, formCheckOut, bookings, booking?.id);
    setOverlapWarning(overlap ? `Overlaps with ${overlap.guest}` : '');
  }, [formCheckIn, formCheckOut, bookings, booking?.id]);

  const derivedNights = calcNights(formCheckIn, formCheckOut);

  const validate = (): boolean => {
    if (!formGuest.trim()) {
      setDateError('Guest name is required.');
      return false;
    }
    if (!formCheckIn || !formCheckOut) {
      setDateError('Both dates are required.');
      return false;
    }
    if (formCheckOut <= formCheckIn) {
      setDateError('Check-out must be after check-in.');
      return false;
    }
    setDateError('');
    // Overlap warns but does NOT block save — manager may intend it
    return true;
  };

  const handleSave = () => {
    if (!validate()) return;
    const saved: Booking = {
      id: booking?.id ?? crypto.randomUUID(),
      guest: formGuest.trim(),
      type: formType,
      checkIn: formCheckIn,
      checkOut: formCheckOut,
      nights: derivedNights,
      status: booking?.status ?? 'Confirmed',
    };
    onSave(saved);
  };

  const handleCancelTap = (id: string) => {
    if (!cancelArmed) {
      // First tap: arm the confirmation
      setCancelArmed(true);
      cancelTimerRef.current = setTimeout(() => setCancelArmed(false), 3000);
    } else {
      // Second tap: execute
      if (cancelTimerRef.current) clearTimeout(cancelTimerRef.current);
      setCancelArmed(false);
      onCancelBooking(id);
    }
  };

  const sheetTransition = prefersReduced
    ? { duration: 0.01 }
    : { duration: 0.45, ease: EASE };

  const backdropTransition = prefersReduced
    ? { duration: 0.01 }
    : { duration: 0.3 };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="cal-drawer-backdrop"
            className="fixed inset-0 bg-black/40 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={backdropTransition}
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Sheet */}
          <motion.div
            key="cal-drawer-sheet"
            role="dialog"
            aria-modal="true"
            aria-label={
              mode === 'add'
                ? 'New booking'
                : `Booking for ${booking?.guest ?? 'guest'}`
            }
            className="cal-drawer-sheet fixed bottom-0 left-0 right-0 z-50 px-6 pt-4 pb-10 flex flex-col gap-5"
            initial={{ y: prefersReduced ? 0 : '100%' }}
            animate={{ y: 0 }}
            exit={{ y: prefersReduced ? 0 : '100%' }}
            transition={sheetTransition}
            onKeyDown={e => { if (e.key === 'Escape') onClose(); }}
          >
            {/* Drag handle — tappable to close */}
            <button
              onClick={onClose}
              aria-label="Close booking panel"
              className="w-10 h-1 bg-white/20 rounded-full mx-auto hover:bg-white/35 transition-colors cursor-pointer border-none"
            />

            {mode === 'view' && booking ? (
              /* ── View Mode ── */
              <>
                <div className="flex flex-col gap-1.5">
                  <span className="cal-drawer-label">Guest</span>
                  <span className="cal-drawer-guest-name">{booking.guest}</span>
                  {booking.type === 'owner' && (
                    <span className="cal-booking-row__chip cal-booking-row__chip--owner self-start mt-0.5">
                      Owner Stay
                    </span>
                  )}
                </div>

                <div className="flex gap-6 flex-wrap">
                  <div className="flex flex-col gap-1">
                    <span className="cal-drawer-label">Dates</span>
                    <span className="cal-drawer-value">
                      {formatDisplayDates(booking.checkIn, booking.checkOut)}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="cal-drawer-label">Nights</span>
                    <span className="cal-drawer-value">{booking.nights}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="cal-drawer-label">Status</span>
                    <span
                      className={`cal-booking-row__status cal-booking-row__status--${booking.status.toLowerCase()}`}
                    >
                      {booking.status}
                    </span>
                  </div>
                </div>

                {/* CTA row: Confirm (primary fill) + Edit (ghost) — horizontal */}
                <div className="flex gap-3 pt-1 items-center">
                  {booking.status !== 'Confirmed' && (
                    <button
                      className="cal-drawer-btn cal-drawer-btn--confirm"
                      onClick={() => onConfirm(booking.id)}
                    >
                      Confirm
                    </button>
                  )}
                  <button
                    className="cal-drawer-btn cal-drawer-btn--edit"
                    onClick={onEdit}
                  >
                    Edit
                  </button>
                  {/* Cancel is a text link, separated from primary actions */}
                  <span className="flex-1" />
                  {booking.status !== 'Cancelled' && (
                    <button
                      className={`cal-drawer-btn--cancel-link${cancelArmed ? ' cal-drawer-btn--cancel-link--armed' : ''}`}
                      onClick={() => handleCancelTap(booking.id)}
                      aria-label={cancelArmed ? 'Tap again to confirm cancellation' : `Cancel reservation for ${booking.guest}`}
                    >
                      {cancelArmed ? 'Confirm cancel?' : 'Cancel reservation'}
                    </button>
                  )}
                </div>
              </>
            ) : (
              /* ── Add / Edit Mode ── */
              <>
                <div className="flex flex-col gap-1">
                  <label htmlFor="drawer-guest" className="cal-drawer-label">
                    Guest Name
                  </label>
                  <input
                    id="drawer-guest"
                    className="cal-drawer-input"
                    placeholder="Full name"
                    value={formGuest}
                    onChange={e => setFormGuest(e.target.value)}
                    autoComplete="name"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <span className="cal-drawer-label">Booking Type</span>
                  <div className="cal-drawer-toggle" role="group" aria-label="Booking type">
                    <button
                      type="button"
                      className={`cal-drawer-toggle__option${formType === 'guest' ? ' cal-drawer-toggle__option--active' : ''}`}
                      onClick={() => setFormType('guest')}
                      aria-pressed={formType === 'guest'}
                    >
                      Guest
                    </button>
                    <button
                      type="button"
                      className={`cal-drawer-toggle__option${formType === 'owner' ? ' cal-drawer-toggle__option--active' : ''}`}
                      onClick={() => setFormType('owner')}
                      aria-pressed={formType === 'owner'}
                    >
                      Owner Stay
                    </button>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex flex-col gap-1 flex-1">
                    <label htmlFor="drawer-checkin" className="cal-drawer-label">
                      Check-in
                    </label>
                    <input
                      id="drawer-checkin"
                      type="date"
                      className="cal-drawer-input"
                      value={formCheckIn}
                      min={todayStr()}
                      onChange={e => setFormCheckIn(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col gap-1 flex-1">
                    <label htmlFor="drawer-checkout" className="cal-drawer-label">
                      Check-out
                    </label>
                    <input
                      id="drawer-checkout"
                      type="date"
                      className="cal-drawer-input"
                      value={formCheckOut}
                      min={formCheckIn || todayStr()}
                      onChange={e => setFormCheckOut(e.target.value)}
                    />
                  </div>
                </div>

                {formCheckIn && formCheckOut && derivedNights > 0 && (
                  <span className="cal-drawer-nights">{derivedNights} nights</span>
                )}
                {dateError && <span className="cal-drawer-error" role="alert">{dateError}</span>}
                {overlapWarning && !dateError && (
                  <span className="cal-drawer-warning" role="status">
                    {overlapWarning} — saving anyway is allowed.
                  </span>
                )}

                <div className="flex gap-3 pt-1">
                  <button className="cal-drawer-btn cal-drawer-btn--save" onClick={handleSave}>
                    Save
                  </button>
                  <button className="cal-drawer-btn cal-drawer-btn--close" onClick={onClose}>
                    Discard
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
