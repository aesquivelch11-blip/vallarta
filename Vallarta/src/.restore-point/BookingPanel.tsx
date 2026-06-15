// src/components/calendar/BookingPanel.tsx
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion, LayoutGroup } from 'motion/react';
import {
  Booking,
  BookingType,
  calcNights,
  findOverlap,
  formatDisplayDates,
} from './bookingUtils';
import DatePicker from './DatePicker';

export type PanelMode = 'view' | 'edit' | 'add';

interface BookingPanelProps {
  open: boolean;
  booking: Booking | null;
  mode: PanelMode;
  preselectedRange?: { checkIn: string; checkOut: string } | null;
  bookings: Booking[];
  onSave: (booking: Booking) => void;
  onConfirm: (id: string) => void;
  onCancelBooking: (id: string) => void;
  onEdit: () => void;
  onClose: () => void;
}

const EASE = [0.32, 0.72, 0, 1] as const;

const CANCELLATION_TIMEOUT_MS = 3000;

export default function BookingPanel({
  open,
  booking,
  mode,
  preselectedRange,
  bookings,
  onSave,
  onConfirm,
  onCancelBooking,
  onEdit,
  onClose,
}: BookingPanelProps) {
  const prefersReduced = useReducedMotion();

  const [formGuest, setFormGuest] = useState('');
  const [formType, setFormType] = useState<BookingType>('guest');
  const [formCheckIn, setFormCheckIn] = useState('');
  const [formCheckOut, setFormCheckOut] = useState('');
  const [dateError, setDateError] = useState('');
  const [overlapWarning, setOverlapWarning] = useState('');
  const [overrideOverlap, setOverrideOverlap] = useState(false);
  const [cancelArmed, setCancelArmed] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const cancelTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Reset form state when panel opens or mode changes
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
      setFormCheckIn(preselectedRange?.checkIn || '');
      setFormCheckOut(preselectedRange?.checkOut || '');
    }
    setDateError('');
    setOverlapWarning('');
    setOverrideOverlap(false);
  }, [open, mode, booking, preselectedRange]);

  useEffect(() => {
    return () => {
      if (cancelTimerRef.current) clearTimeout(cancelTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

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
    if (formCheckOut <= formCheckIn) {
      setDateError('Check-out must be after check-in.');
      return false;
    }
    if (overlapWarning && !overrideOverlap) {
      setDateError('Must check override box to allow overlapping dates.');
      return false;
    }
    setDateError('');
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
      setCancelArmed(true);
      cancelTimerRef.current = setTimeout(() => setCancelArmed(false), CANCELLATION_TIMEOUT_MS);
    } else {
      if (cancelTimerRef.current) clearTimeout(cancelTimerRef.current);
      setCancelArmed(false);
      onCancelBooking(id);
    }
  };

  const panelTransition = prefersReduced
    ? { duration: 0.01 }
    : { duration: 0.2, ease: EASE };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="cal-panel-sheet"
          role="complementary"
          aria-label={
            mode === 'add'
              ? 'New booking'
              : `Booking for ${booking?.guest ?? 'guest'}`
          }
          className="cal-panel cal-drawer-sheet fixed top-0 right-0 bottom-0 w-[420px] max-w-[100vw] z-50 px-8 pt-8 pb-10 flex flex-col gap-6 overflow-y-auto rounded-l-[0.25rem]"
          initial={{ x: prefersReduced ? 0 : '100%' }}
          animate={{ x: 0 }}
          exit={{ x: prefersReduced ? 0 : '100%' }}
          transition={panelTransition}
        >
          {/* Close Button top right */}
          <div className="flex justify-end">
              <button
                onClick={onClose}
                aria-label="Close booking panel"
                className="cal-drawer-close w-[44px] h-[44px] rounded-full bg-transparent transition-colors duration-200 flex items-center justify-center cursor-pointer"
              >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M1 1L13 13M1 13L13 1" />
              </svg>
            </button>
          </div>

          {mode === 'view' && booking ? (
            /* ── View Mode ── */
            <>
              <motion.div
                className="flex flex-col gap-1.5"
                initial={prefersReduced ? false : { opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.3, ease: EASE }}
              >
                <span className="cal-drawer-label">Guest</span>
                <span className="cal-drawer-guest-name">{booking.guest}</span>
                {booking.type === 'owner' && (
                  <span className="cal-booking-row__chip cal-booking-row__chip--owner self-start mt-0.5">
                    Owner Stay
                  </span>
                )}
              </motion.div>

              <motion.div
                className="flex flex-col gap-6"
                initial={prefersReduced ? false : { opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.26, duration: 0.3, ease: EASE }}
              >
                <div className="flex flex-col gap-1">
                  <span className="cal-drawer-label">Dates</span>
                  <span className="cal-drawer-value">
                    {formatDisplayDates(booking.checkIn, booking.checkOut)}
                  </span>
                </div>
                <div className="flex gap-6">
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
              </motion.div>

              <motion.div
                className="flex gap-3 pt-4 items-center mt-auto"
                initial={prefersReduced ? false : { opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.34, duration: 0.28, ease: EASE }}
              >
                {booking.status !== 'Confirmed' && (
                  <button
                    className="cal-drawer-btn cal-drawer-btn--confirm flex-1"
                    onClick={() => onConfirm(booking.id)}
                  >
                    Confirm
                  </button>
                )}
                <button
                  className="cal-drawer-btn cal-drawer-btn--edit flex-1"
                  onClick={onEdit}
                >
                  Edit
                </button>
              </motion.div>
              
              <motion.div 
                className="flex justify-center pt-2"
                initial={prefersReduced ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.28, ease: EASE }}
              >
                {booking.status !== 'Cancelled' && (
                  <button
                    className={`cal-drawer-btn--cancel-link${cancelArmed ? ' cal-drawer-btn--cancel-link--armed' : ''}`}
                    onClick={() => handleCancelTap(booking.id)}
                    aria-label={cancelArmed ? 'Tap again to confirm cancellation' : `Cancel reservation for ${booking.guest}`}
                  >
                    {cancelArmed ? 'Confirm cancel?' : 'Cancel reservation'}
                  </button>
                )}
              </motion.div>
            </>
          ) : (
            /* ── Add / Edit Mode ── */
            <div className="flex flex-col gap-6 flex-1">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="drawer-guest" className="cal-drawer-label">
                  Guest
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

              <div className="flex flex-col gap-2 mt-4">
                <span className="cal-drawer-label">Reservation Profile</span>
                <LayoutGroup id="booking-type-toggle">
                  <div className="cal-drawer-toggle" role="group" aria-label="Booking type">
                    {(['guest', 'owner'] as BookingType[]).map((type) => (
                      <button
                        key={type}
                        type="button"
                        className={`cal-drawer-toggle__option${formType === type ? ' cal-drawer-toggle__option--active' : ''}`}
                        onClick={() => setFormType(type)}
                        aria-pressed={formType === type}
                      >
                        {formType === type && (
                          <motion.span
                            layoutId="toggle-pill"
                            className="cal-drawer-toggle__pill"
                            aria-hidden="true"
                            transition={
                              prefersReduced
                                ? { duration: 0 }
                                : { type: 'spring', stiffness: 500, damping: 38, mass: 0.8 }
                            }
                          />
                        )}
                        <span className="cal-drawer-toggle__label">
                          {type === 'guest' ? 'Guest' : 'Owner Stay'}
                        </span>
                      </button>
                    ))}
                  </div>
                </LayoutGroup>
              </div>

              <div className="relative mt-4">
                <span className="cal-drawer-label block mb-2">Dates</span>
                
                <div className="flex gap-4">
                  <div className="flex flex-col gap-1.5 flex-1">
                    <span className="cal-drawer-label text-[#242424]/50">Arrival</span>
                    <button
                      type="button"
                      onClick={() => setPickerOpen(true)}
                      className={`cal-drawer-input text-left cursor-pointer flex items-center justify-between ${formCheckIn ? 'text-[#242424]' : 'text-[#242424]/40'}`}
                      aria-label="Select arrival date"
                    >
                      <span>
                        {formCheckIn
                          ? new Date(formCheckIn + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                          : 'Select date'}
                      </span>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="opacity-60 text-[#242424]">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                      </svg>
                    </button>
                  </div>
                  
                  <div className="flex flex-col gap-1.5 flex-1">
                    <span className="cal-drawer-label text-[#242424]/50">Departure</span>
                    <button
                      type="button"
                      onClick={() => setPickerOpen(true)}
                      className={`cal-drawer-input text-left cursor-pointer flex items-center justify-between ${formCheckOut ? 'text-[#242424]' : 'text-[#242424]/40'}`}
                      aria-label="Select departure date"
                      disabled={!formCheckIn}
                    >
                      <span>
                        {formCheckOut
                          ? new Date(formCheckOut + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                          : 'Select date'}
                      </span>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="opacity-60 text-[#242424]">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                      </svg>
                    </button>
                  </div>
                </div>

                <DatePicker
                  isOpen={pickerOpen}
                  onClose={() => setPickerOpen(false)}
                  checkIn={formCheckIn}
                  checkOut={formCheckOut}
                  bookings={bookings}
                  excludeBookingId={booking?.id}
                  onSelectRange={(checkInDate, checkOutDate) => {
                    setFormCheckIn(checkInDate);
                    setFormCheckOut(checkOutDate);
                  }}
                />
              </div>

              {formCheckIn && formCheckOut && derivedNights > 0 && (
                <span className="cal-drawer-nights">{derivedNights} nights</span>
              )}
              {dateError && <span className="cal-drawer-error" role="alert">{dateError}</span>}
              {overlapWarning && !dateError && (
                <div className="cal-drawer-warning flex items-start gap-2" role="status">
                  <input 
                    type="checkbox" 
                    id="override-overlap" 
                    checked={overrideOverlap} 
                    onChange={e => setOverrideOverlap(e.target.checked)} 
                    className="mt-1"
                  />
                  <label htmlFor="override-overlap">
                    {overlapWarning}. Check to allow saving anyway.
                  </label>
                </div>
              )}

              <div className="flex flex-col items-center gap-3 pt-4 mt-auto">
                <button
                  className="cal-drawer-btn cal-drawer-btn--save disabled:opacity-35 disabled:cursor-not-allowed disabled:transform-none"
                  onClick={handleSave}
                  disabled={!formGuest.trim() || !formCheckIn || !formCheckOut}
                >
                  Confirm Reservation
                </button>
                <button
                  className="cal-drawer-btn--close text-white/40 hover:text-white/60 transition-colors bg-transparent border-none py-2 cursor-pointer self-center"
                  onClick={onClose}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
