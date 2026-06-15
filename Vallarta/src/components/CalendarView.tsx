// src/components/CalendarView.tsx
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { ScreenType } from '../types';
import {
  Booking,
  SEED_BOOKINGS,
  formatDisplayDates,
  calcNights,
} from './calendar/bookingUtils';
import TriMonthGrid from './calendar/TriMonthGrid';
import BookingPanel, { PanelMode } from './calendar/BookingPanel';

interface CalendarViewProps {
  onNavigate: (screen: ScreenType, transitionStyle: 'push' | 'push_back' | 'slide_up') => void;
  onNotify?: (message: string) => void;
}

const EASE = [0.32, 0.72, 0, 1] as const;

function toDateStr(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function daysUntil(dateStr: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateStr + 'T00:00:00');
  return Math.round((target.getTime() - today.getTime()) / 86_400_000);
}

function formatShort(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function CalendarView({ onNavigate, onNotify }: CalendarViewProps) {
  const today = new Date();
  const prefersReduced = useReducedMotion();

  const [baseMonth, setBaseMonth] = useState(
    () => new Date(today.getFullYear(), today.getMonth(), 1)
  );
  const [bookings, setBookings] = useState<Booking[]>(SEED_BOOKINGS);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showPanel, setShowPanel] = useState(false);
  const [panelMode, setPanelMode] = useState<PanelMode>('view');
  const [panelInitialType, setPanelInitialType] = useState<'guest' | 'owner'>('guest');
  const [preselectedRange, setPreselectedRange] = useState<{ checkIn: string; checkOut: string } | null>(null);

  const [toast, setToast] = useState<string | null>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const notify = useCallback((message: string) => {
    if (onNotify) onNotify(message);
    setToast(message);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setToast(null), 3000);
  }, [onNotify]);

  useEffect(() => () => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
  }, []);

  // Upcoming: future bookings sorted by check-in, non-cancelled
  const upcoming = useMemo(() => {
    const todayStr = toDateStr(today);
    return [...bookings]
      .filter(b => b.status !== 'Cancelled' && b.checkOut >= todayStr)
      .sort((a, b) => a.checkIn.localeCompare(b.checkIn));
  }, [bookings]);

  // Next arrival
  const nextArrival = useMemo(() => {
    const todayStr = toDateStr(today);
    return upcoming.find(b => b.checkIn >= todayStr) ?? null;
  }, [upcoming]);

  // Quarter occupancy: count booked nights in next 90 days
  const quarterOccupancy = useMemo(() => {
    const todayStr = toDateStr(today);
    const endDate = new Date(today);
    endDate.setDate(today.getDate() + 90);
    const endStr = toDateStr(endDate);

    let bookedNights = 0;
    for (const b of bookings) {
      if (b.status === 'Cancelled') continue;
      const start = b.checkIn > todayStr ? b.checkIn : todayStr;
      const end = b.checkOut < endStr ? b.checkOut : endStr;
      if (start < end) {
        bookedNights += Math.round((new Date(end).getTime() - new Date(start).getTime()) / 86_400_000);
      }
    }
    return Math.round((bookedNights / 90) * 100);
  }, [bookings]);

  const handlePrevMonth = () => {
    setBaseMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setBaseMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const handleSelectBooking = (booking: Booking) => {
    setSelectedBooking(booking);
    setPreselectedRange(null);
    setPanelMode('view');
    setShowPanel(true);
  };

  const handleAddBooking = useCallback((ownerStay = false) => {
    setSelectedBooking(null);
    setPreselectedRange(null);
    setPanelInitialType(ownerStay ? 'owner' : 'guest');
    setPanelMode('add');
    setShowPanel(true);
  }, []);

  const handleClosePanel = () => setShowPanel(false);

  const handleConfirmBooking = (id: string) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'Confirmed' } : b));
    notify('Reservation confirmed.');
    setShowPanel(false);
  };

  const handleCancelBooking = (id: string) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'Cancelled' } : b));
    notify('Reservation cancelled.');
    setShowPanel(false);
  };

  const handleSaveBooking = (saved: Booking) => {
    setBookings(prev => {
      const exists = prev.find(b => b.id === saved.id);
      return exists ? prev.map(b => b.id === saved.id ? saved : b) : [...prev, saved];
    });
    notify(panelMode === 'add' ? `Booking added for ${saved.guest}.` : `Booking updated for ${saved.guest}.`);
    setShowPanel(false);
  };

  const handleDateRangeSelected = (startDay: { date: string }, endDay: { date: string }) => {
    setPreselectedRange({ checkIn: startDay.date, checkOut: endDay.date });
    setSelectedBooking(null);
    setPanelMode('add');
    setShowPanel(true);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || e.metaKey || e.ctrlKey) return;
      if (e.key === 'Escape' && showPanel) { handleClosePanel(); return; }
      if (showPanel) return;
      if (e.key.toLowerCase() === 'n') handleAddBooking();
      if (e.key === 'ArrowLeft') handlePrevMonth();
      if (e.key === 'ArrowRight') handleNextMonth();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showPanel, handleAddBooking]);

  return (
    <div className="cal-screen">
      {/* Cinematic background */}
      <div aria-hidden="true" className="cal-bg" />
      <div aria-hidden="true" className="cal-base-overlay" />
      <div aria-hidden="true" className="cal-overlay" />
      <div className="nav-grain" aria-hidden="true" />

      <div className="cal-content-wrapper" style={{ overflow: 'hidden' }}>

        {/* Nav */}
        <motion.nav
          role="navigation"
          aria-label="Main navigation"
          className="cal-nav"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.2 }}
        >
          <button
            onClick={() => onNavigate('nav_menu', 'push')}
            aria-label="Go to Vallarta Estates dashboard"
            className="cal-nav__brand"
          >
            Vallarta Estates
          </button>
          <div className="cal-nav__right">
            <span className="cal-nav__role">Estate Supervisor</span>
          </div>
        </motion.nav>

        {/* Page body */}
        <div className="cv2-layout">

          {/* 3-Month Calendar */}
          <motion.section
            initial={prefersReduced ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.35 }}
            aria-label="3-month calendar overview"
          >
            <TriMonthGrid
              baseMonthStart={baseMonth}
              bookings={bookings}
              onPrevMonth={handlePrevMonth}
              onNextMonth={handleNextMonth}
              onDateRangeSelected={handleDateRangeSelected}
              selectedBooking={selectedBooking}
            />
          </motion.section>

          {/* Stats + Reservations */}
          <motion.section
            className="cv2-lower"
            initial={prefersReduced ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.5 }}
          >

            {/* At a Glance strip */}
            <div className="cv2-glance" role="region" aria-label="At a glance">
              <div className="cv2-glance__stat">
                <span className="cv2-glance__label">Next Arrival</span>
                <span className="cv2-glance__value">
                  {nextArrival
                    ? daysUntil(nextArrival.checkIn) === 0
                      ? 'Today'
                      : daysUntil(nextArrival.checkIn) === 1
                        ? 'Tomorrow'
                        : `${formatShort(nextArrival.checkIn)}`
                    : 'None'}
                </span>
                {nextArrival && (
                  <span className="cv2-glance__sub">{nextArrival.guest}</span>
                )}
              </div>
              <div className="cv2-glance__divider" aria-hidden="true" />
              <div className="cv2-glance__stat">
                <span className="cv2-glance__label">90-Day Occupancy</span>
                <span className="cv2-glance__value">{quarterOccupancy}%</span>
                <span className="cv2-glance__sub">next 3 months</span>
              </div>
              <div className="cv2-glance__divider" aria-hidden="true" />
              <div className="cv2-glance__stat">
                <span className="cv2-glance__label">Active Reservations</span>
                <span className="cv2-glance__value">
                  {bookings.filter(b => b.status !== 'Cancelled').length}
                </span>
                <span className="cv2-glance__sub">
                  {bookings.filter(b => b.status === 'Pending').length > 0
                    ? `${bookings.filter(b => b.status === 'Pending').length} pending`
                    : 'all confirmed'}
                </span>
              </div>
              <div className="cv2-glance__actions">
                <button
                  className="cv2-btn-primary"
                  onClick={() => handleAddBooking(false)}
                  aria-label="Add new reservation"
                >
                  New Reservation
                </button>
                <button
                  className="cv2-btn-owner"
                  onClick={() => handleAddBooking(true)}
                  aria-label="Add owner stay"
                >
                  Owner Stay
                </button>
              </div>
            </div>

            {/* Reservations List */}
            <div className="cv2-reservations" role="region" aria-label="Upcoming reservations">
              <div className="cv2-reservations__header">
                <h2 className="cv2-reservations__title">Upcoming</h2>
                <span className="cv2-reservations__count">{upcoming.length} reservations</span>
              </div>

              {upcoming.length === 0 ? (
                <div className="cv2-reservations__empty">
                  <p>No upcoming reservations.</p>
                  <button className="cv2-btn-primary" onClick={() => handleAddBooking(false)}>
                    Add reservation
                  </button>
                </div>
              ) : (
                <motion.ul
                  className="cv2-list"
                  role="list"
                  initial="hidden"
                  animate="visible"
                  variants={{
                    hidden: {},
                    visible: {
                      transition: prefersReduced
                        ? { staggerChildren: 0 }
                        : { staggerChildren: 0.055, delayChildren: 0.1 },
                    },
                  }}
                >
                  {upcoming.map(b => {
                    const nights = calcNights(b.checkIn, b.checkOut);
                    const daysAway = daysUntil(b.checkIn);
                    return (
                      <motion.li
                        key={b.id}
                        className={['cv2-row', b.type === 'owner' ? 'cv2-row--owner' : ''].filter(Boolean).join(' ')}
                        role="button"
                        tabIndex={0}
                        onClick={() => handleSelectBooking(b)}
                        onKeyDown={e => {
                          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleSelectBooking(b); }
                        }}
                        aria-label={`${b.guest}, ${formatDisplayDates(b.checkIn, b.checkOut)}, ${nights} nights, ${b.status}`}
                        variants={{
                          hidden: { opacity: 0, y: 6 },
                          visible: {
                            opacity: 1,
                            y: 0,
                            transition: prefersReduced ? { duration: 0 } : { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
                          },
                        }}
                      >
                        <div className="cv2-row__dates">
                          <time dateTime={b.checkIn} className="cv2-row__date-range">
                            {formatDisplayDates(b.checkIn, b.checkOut)}
                          </time>
                          <span className="cv2-row__countdown">
                            {daysAway === 0 ? 'Today' : daysAway === 1 ? 'Tomorrow' : daysAway > 0 ? `in ${daysAway}d` : 'Past'}
                          </span>
                        </div>
                        <div className="cv2-row__guest-cell">
                          <span className="cv2-row__guest">{b.guest}</span>
                          {b.type === 'owner' && (
                            <span className="cv2-row__chip cv2-row__chip--owner">Owner</span>
                          )}
                        </div>
                        <span className={`cv2-row__status cv2-row__status--${b.status.toLowerCase()}`}>
                          {b.status}
                        </span>
                        <span className="cv2-row__nights" aria-label={`${nights} nights`}>
                          <span className="cv2-row__nights-val">{nights}</span>
                          <span className="cv2-row__nights-label" aria-hidden="true">n</span>
                        </span>
                      </motion.li>
                    );
                  })}
                </motion.ul>
              )}
            </div>

          </motion.section>
        </div>
      </div>

      {/* Booking Panel */}
      <BookingPanel
        open={showPanel}
        booking={selectedBooking}
        mode={panelMode}
        initialType={panelInitialType}
        preselectedRange={preselectedRange}
        bookings={bookings}
        onSave={handleSaveBooking}
        onConfirm={handleConfirmBooking}
        onCancelBooking={handleCancelBooking}
        onEdit={() => setPanelMode('edit')}
        onClose={handleClosePanel}
      />

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            key="cal-toast"
            role="status"
            aria-live="polite"
            className="cal-toast"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.28, ease: EASE }}
          >
            <span className="cal-toast__dot" aria-hidden="true" />
            <span className="cal-toast__msg">{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
