// src/components/CalendarView.tsx
import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { ScreenType } from '../types';
import {
  Booking,
  SEED_BOOKINGS,
  buildCalendarDays,
} from './calendar/bookingUtils';
import CalendarGrid from './calendar/CalendarGrid';
import BookingList from './calendar/BookingList';
import BookingDrawer, { DrawerMode } from './calendar/BookingDrawer';

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
  const [showDrawer, setShowDrawer] = useState(false);
  const [drawerMode, setDrawerMode] = useState<DrawerMode>('view');

  const calendarDays = useMemo(
    () => buildCalendarDays(currentYear, currentMonth, bookings),
    [currentYear, currentMonth, bookings],
  );

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(y => y - 1);
    } else {
      setCurrentMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(y => y + 1);
    } else {
      setCurrentMonth(prev => prev + 1);
    }
  };

  const handleSelectBooking = (booking: Booking) => {
    setSelectedBooking(booking);
    setDrawerMode('view');
    setShowDrawer(true);
  };

  const handleAddBooking = () => {
    setSelectedBooking(null);
    setDrawerMode('add');
    setShowDrawer(true);
  };

  const handleCloseDrawer = () => {
    setShowDrawer(false);
  };

  const handleConfirmBooking = (id: string) => {
    setBookings(prev =>
      prev.map(b => (b.id === id ? { ...b, status: 'Confirmed' } : b)),
    );
    onNotify?.('Reservation confirmed.');
    setShowDrawer(false);
  };

  const handleCancelBooking = (id: string) => {
    setBookings(prev =>
      prev.map(b => (b.id === id ? { ...b, status: 'Cancelled' } : b)),
    );
    onNotify?.('Reservation cancelled.');
    setShowDrawer(false);
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
      drawerMode === 'add'
        ? `Booking added for ${saved.guest}.`
        : `Booking updated for ${saved.guest}.`,
    );
    setShowDrawer(false);
  };

  const handleEdit = () => {
    setDrawerMode('edit');
  };

  return (
    <div className="cal-screen">
      {/* ─── Dark base overlay ─── */}
      <div aria-hidden="true" className="cal-base-overlay" />

      {/* ─── Asymmetric overlay ─── */}
      <div aria-hidden="true" className="cal-overlay" />

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

      {/* ─── Booking Drawer ─── */}
      <BookingDrawer
        open={showDrawer}
        booking={selectedBooking}
        mode={drawerMode}
        bookings={bookings}
        onSave={handleSaveBooking}
        onConfirm={handleConfirmBooking}
        onCancelBooking={handleCancelBooking}
        onEdit={handleEdit}
        onClose={handleCloseDrawer}
      />
    </div>
  );
}
