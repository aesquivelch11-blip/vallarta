// src/components/calendar/BookingDrawer.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
  bookings: Booking[]; // full list for overlap detection
  onSave: (booking: Booking) => void;
  onConfirm: (id: string) => void;
  onCancelBooking: (id: string) => void;
  onEdit: () => void; // switches parent mode to 'edit'
  onClose: () => void;
}

const EASE = [0.22, 1, 0.36, 1] as const;

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
  const [formGuest, setFormGuest] = useState('');
  const [formType, setFormType] = useState<BookingType>('guest');
  const [formCheckIn, setFormCheckIn] = useState('');
  const [formCheckOut, setFormCheckOut] = useState('');
  const [dateError, setDateError] = useState('');
  const [overlapWarning, setOverlapWarning] = useState('');

  // Populate form when switching to edit mode or opening add mode
  useEffect(() => {
    if (!open) return;
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
  }, [open, mode, booking]);

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
    const overlap = findOverlap(formCheckIn, formCheckOut, bookings, booking?.id);
    setOverlapWarning(overlap ? `Dates overlap with ${overlap.guest}` : '');
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
            transition={{ duration: 0.3 }}
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
            className="fixed bottom-0 left-0 right-0 z-50 bg-[#242424] border-t border-[#C9B8A0]/30 rounded-t-[2rem] px-6 pt-4 pb-10 flex flex-col gap-5"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ duration: 0.45, ease: EASE }}
          >
            {/* Drag handle */}
            <div className="w-10 h-1 bg-white/20 rounded-full mx-auto" aria-hidden="true" />

            {mode === 'view' && booking ? (
              /* ── View Mode ── */
              <>
                <div className="flex flex-col gap-1">
                  <span className="cal-drawer-label">Guest</span>
                  <span className="cal-drawer-value">{booking.guest}</span>
                  {booking.type === 'owner' && (
                    <span className="cal-booking-row__chip cal-booking-row__chip--owner self-start mt-1">
                      Owner Stay
                    </span>
                  )}
                </div>

                <div className="flex gap-6">
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

                <div className="flex gap-3 pt-1">
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
                  {booking.status !== 'Cancelled' && (
                    <button
                      className="cal-drawer-btn cal-drawer-btn--cancel"
                      onClick={() => onCancelBooking(booking.id)}
                    >
                      Cancel
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
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <span className="cal-drawer-label">Booking Type</span>
                  <div className="cal-drawer-toggle">
                    <button
                      type="button"
                      className={`cal-drawer-toggle__option${formType === 'guest' ? ' cal-drawer-toggle__option--active' : ''}`}
                      onClick={() => setFormType('guest')}
                    >
                      Guest
                    </button>
                    <button
                      type="button"
                      className={`cal-drawer-toggle__option${formType === 'owner' ? ' cal-drawer-toggle__option--active' : ''}`}
                      onClick={() => setFormType('owner')}
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
                      onChange={e => setFormCheckOut(e.target.value)}
                    />
                  </div>
                </div>

                {formCheckIn && formCheckOut && derivedNights > 0 && (
                  <span className="cal-drawer-nights">{derivedNights} nights</span>
                )}
                {dateError && <span className="cal-drawer-error">{dateError}</span>}
                {overlapWarning && !dateError && (
                  <span className="cal-drawer-warning">⚠ {overlapWarning}</span>
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
