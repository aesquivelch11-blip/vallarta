// src/components/CalendarView.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import { ScreenType } from '../types';
import {
  Booking,
  SEED_BOOKINGS,
  buildCalendarDays,
} from './calendar/bookingUtils';
import CalendarGrid from './calendar/CalendarGrid';
import BookingList from './calendar/BookingList';
import BookingPanel, { PanelMode } from './calendar/BookingPanel';

interface CalendarViewProps {
  onNavigate: (screen: ScreenType, transitionStyle: 'push' | 'push_back' | 'slide_up') => void;
  onNotify?: (message: string) => void;
}

const EASE = [0.22, 1, 0.36, 1] as const;

export default function CalendarView({ onNavigate, onNotify }: CalendarViewProps) {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth()); // 0-indexed

  const [bookings, setBookings] = useState<Booking[]>(SEED_BOOKINGS);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showPanel, setShowPanel] = useState(false);
  const [panelMode, setPanelMode] = useState<PanelMode>('view');
  const [slideDir, setSlideDir] = useState<'next' | 'prev'>('next');

  const calendarDays = useMemo(
    () => buildCalendarDays(currentYear, currentMonth, bookings),
    [currentYear, currentMonth, bookings],
  );

  const handlePrevMonth = () => {
    setSlideDir('prev');
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(y => y - 1);
    } else {
      setCurrentMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    setSlideDir('next');
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(y => y + 1);
    } else {
      setCurrentMonth(prev => prev + 1);
    }
  };

  const handleSelectBooking = (booking: Booking) => {
    setSelectedBooking(booking);
    setPanelMode('view');
    setShowPanel(true);
  };

  const handleAddBooking = () => {
    setSelectedBooking(null);
    setPanelMode('add');
    setShowPanel(true);
  };

  const handleClosePanel = () => {
    setShowPanel(false);
  };

  const handleConfirmBooking = (id: string) => {
    setBookings(prev =>
      prev.map(b => (b.id === id ? { ...b, status: 'Confirmed' } : b)),
    );
    onNotify?.('Reservation confirmed.');
    setShowPanel(false);
  };

  const handleCancelBooking = (id: string) => {
    setBookings(prev =>
      prev.map(b => (b.id === id ? { ...b, status: 'Cancelled' } : b)),
    );
    onNotify?.('Reservation cancelled.');
    setShowPanel(false);
  };

  const handleSaveBooking = (saved: Booking) => {
    setBookings(prev => {
      const exists = prev.find(b => b.id === saved.id);
      if (exists) {
        return prev.map(b => (b.id === saved.id ? saved : b));
      }
      return [...prev, saved];
    });
    onNotify?.(
      panelMode === 'add'
        ? `Booking added for ${saved.guest}.`
        : `Booking updated for ${saved.guest}.`,
    );
    setShowPanel(false);
  };

  const handleEdit = () => {
    setPanelMode('edit');
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }
      if (e.key === 'Escape' && showPanel) {
        handleClosePanel();
      } else if (e.key.toLowerCase() === 'n' && !showPanel) {
        handleAddBooking();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showPanel]);

  return (
    <div className="cal-screen">
      {/* ─── Dark base overlay ─── */}
      <div aria-hidden="true" className="cal-base-overlay" />

      {/* ─── Asymmetric overlay ─── */}
      <div aria-hidden="true" className="cal-overlay" />

      {/* ─── Main Content Wrapper (Shrinks when panel is open) ─── */}
      <motion.div
        className="absolute top-0 bottom-0 left-0 overflow-x-hidden overflow-y-auto"
        initial={{ right: 0 }}
        animate={{ right: showPanel ? '420px' : '0px' }}
        transition={{ duration: 0.45, ease: EASE }}
      >
        {/* ─── Top Navigation ─── */}
        <motion.nav
          role="navigation"
          aria-label="Main navigation"
          className="cal-nav"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: EASE, delay: 0.3 }}
        >
          <button
            onClick={() => onNavigate('reporting', 'push')}
            aria-label="Go to Vallarta Estates dashboard"
            className="cal-nav__brand"
          >
            Vallarta Estates
          </button>
          <div className="cal-nav__right">
            <span className="cal-pill">Estate Supervisor</span>
            <div aria-hidden="true" className="cal-avatar">JD</div>
          </div>
        </motion.nav>

        {/* ─── Calendar Grid ─── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, ease: EASE, delay: 0.6 }}
        >
          <CalendarGrid
            days={calendarDays}
            year={currentYear}
            month={currentMonth}
            onPrevMonth={handlePrevMonth}
            onNextMonth={handleNextMonth}
            slideDir={slideDir}
          />
        </motion.div>

        {/* ─── Booking List ─── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: EASE, delay: 0.9 }}
        >
          <BookingList
            bookings={bookings}
            onSelect={handleSelectBooking}
            onAdd={handleAddBooking}
          />
        </motion.div>
      </motion.div>

      {/* ─── Booking Panel ─── */}
      <BookingPanel
        open={showPanel}
        booking={selectedBooking}
        mode={panelMode}
        bookings={bookings}
        onSave={handleSaveBooking}
        onConfirm={handleConfirmBooking}
        onCancelBooking={handleCancelBooking}
        onEdit={handleEdit}
        onClose={handleClosePanel}
      />
    </div>
  );
}
