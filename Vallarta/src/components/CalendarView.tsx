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

const EASE = [0.32, 0.72, 0, 1] as const;

const SIDE_PANEL_WIDTH = '420px';
const JANUARY = 0;
const DECEMBER = 11;

export default function CalendarView({ onNavigate, onNotify }: CalendarViewProps) {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth()); // 0-indexed

  const [bookings, setBookings] = useState<Booking[]>(SEED_BOOKINGS);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showPanel, setShowPanel] = useState(false);
  const [panelMode, setPanelMode] = useState<PanelMode>('view');
  const [slideDir, setSlideDir] = useState<'next' | 'prev'>('next');
  const [preselectedRange, setPreselectedRange] = useState<{checkIn: string, checkOut: string} | null>(null);

  const calendarDays = useMemo(
    () => buildCalendarDays(currentYear, currentMonth, bookings),
    [currentYear, currentMonth, bookings],
  );

  const handlePrevMonth = () => {
    setSlideDir('prev');
    if (currentMonth === JANUARY) {
      setCurrentMonth(DECEMBER);
      setCurrentYear(y => y - 1);
    } else {
      setCurrentMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    setSlideDir('next');
    if (currentMonth === DECEMBER) {
      setCurrentMonth(JANUARY);
      setCurrentYear(y => y + 1);
    } else {
      setCurrentMonth(prev => prev + 1);
    }
  };

  const handleSelectBooking = (booking: Booking) => {
    setSelectedBooking(booking);
    setPreselectedRange(null);
    setPanelMode('view');
    setShowPanel(true);
  };

  const handleAddBooking = () => {
    setSelectedBooking(null);
    setPreselectedRange(null);
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

  const handleDateRangeSelected = (startDay: { day: number }, endDay: { day: number }) => {
    const formatDate = (day: number) => 
      `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    
    setPreselectedRange({ 
      checkIn: formatDate(startDay.day), 
      checkOut: formatDate(endDay.day) 
    });
    setSelectedBooking(null);
    setPanelMode('add');
    setShowPanel(true);
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

      {/* ─── Film-grain texture overlay ─── */}
      <div className="nav-grain" aria-hidden="true" />

      {/* ─── Main Content Wrapper ─── */}
      {/* The panel slides in from the right as a sibling; this wrapper
          shrinks its right edge so nothing hides underneath the panel. */}
      <motion.div
        className="cal-content-wrapper"
        initial={{ right: 0 }}
        animate={{ right: showPanel ? SIDE_PANEL_WIDTH : '0px' }}
        transition={{ duration: 0.2, ease: EASE }}
      >
        {/* ─── Top Navigation (absolute within wrapper so it overlays the bg) ─── */}
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

        {/* ─── Scrollable column (calendar + bookings in document flow) ─── */}
        <div className="cal-scroll-column">
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
              onDateRangeSelected={handleDateRangeSelected}
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
        </div>
      </motion.div>

      {/* ─── Booking Panel ─── */}
      <BookingPanel
        open={showPanel}
        booking={selectedBooking}
        mode={panelMode}
        preselectedRange={preselectedRange}
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
