// src/components/CalendarView.tsx
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ScreenType } from '../types';
import {
  Booking,
  SEED_BOOKINGS,
  buildCalendarDays,
} from './calendar/bookingUtils';
import CalendarGrid from './calendar/CalendarGrid';
import WeekGrid from './calendar/WeekGrid';
import TriMonthGrid from './calendar/TriMonthGrid';
import BookingList from './calendar/BookingList';
import BookingPanel, { PanelMode } from './calendar/BookingPanel';
import { useCalendarView, startOfWeek, CalendarViewMode } from './calendar/useCalendarView';

interface CalendarViewProps {
  onNavigate: (screen: ScreenType, transitionStyle: 'push' | 'push_back' | 'slide_up') => void;
  onNotify?: (message: string) => void;
}

const EASE = [0.32, 0.72, 0, 1] as const;

const JANUARY = 0;
const DECEMBER = 11;

export default function CalendarView({ onNavigate, onNotify }: CalendarViewProps) {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth()); // 0-indexed
  const [weekStart, setWeekStart] = useState<Date>(() => startOfWeek(today));

  const [bookings, setBookings] = useState<Booking[]>(SEED_BOOKINGS);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showPanel, setShowPanel] = useState(false);
  const [panelMode, setPanelMode] = useState<PanelMode>('view');
  const [slideDir, setSlideDir] = useState<'next' | 'prev'>('next');
  const [preselectedRange, setPreselectedRange] = useState<{checkIn: string, checkOut: string} | null>(null);

  const { view, setView } = useCalendarView();

  const calendarDays = useMemo(
    () => buildCalendarDays(currentYear, currentMonth, bookings),
    [currentYear, currentMonth, bookings],
  );

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

  const handlePrevWeek = () => {
    const next = new Date(weekStart);
    next.setDate(weekStart.getDate() - 7);
    setWeekStart(next);
  };

  const handleNextWeek = () => {
    const next = new Date(weekStart);
    next.setDate(weekStart.getDate() + 7);
    setWeekStart(next);
  };

  const handlePrevTriMonth = () => {
    setSlideDir('prev');
    if (currentMonth === JANUARY) {
      setCurrentMonth(DECEMBER);
      setCurrentYear(y => y - 1);
    } else {
      setCurrentMonth(prev => prev - 1);
    }
  };

  const handleNextTriMonth = () => {
    setSlideDir('next');
    if (currentMonth === DECEMBER) {
      setCurrentMonth(JANUARY);
      setCurrentYear(y => y + 1);
    } else {
      setCurrentMonth(prev => prev + 1);
    }
  };

  const handleJumpToToday = () => {
    const now = new Date();
    setCurrentYear(now.getFullYear());
    setCurrentMonth(now.getMonth());
    setWeekStart(startOfWeek(now));
  };

  const handleSelectBooking = (booking: Booking) => {
    setSelectedBooking(booking);
    setPreselectedRange(null);
    setPanelMode('view');
    setShowPanel(true);
  };

  const handleAddBooking = useCallback(() => {
    setSelectedBooking(null);
    setPreselectedRange(null);
    setPanelMode('add');
    setShowPanel(true);
  }, []);

  const handleClosePanel = () => {
    setShowPanel(false);
  };

  const handleConfirmBooking = (id: string) => {
    setBookings(prev =>
      prev.map(b => (b.id === id ? { ...b, status: 'Confirmed' } : b)),
    );
    notify('Reservation confirmed.');
    setShowPanel(false);
  };

  const handleCancelBooking = (id: string) => {
    setBookings(prev =>
      prev.map(b => (b.id === id ? { ...b, status: 'Cancelled' } : b)),
    );
    notify('Reservation cancelled.');
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
    notify(
      panelMode === 'add'
        ? `Booking added for ${saved.guest}.`
        : `Booking updated for ${saved.guest}.`,
    );
    setShowPanel(false);
  };

  const handleEdit = () => {
    setPanelMode('edit');
  };

  const handleDateRangeSelected = (startDay: { date: string }, endDay: { date: string }) => {
    setPreselectedRange({
      checkIn: startDay.date,
      checkOut: endDay.date,
    });
    setSelectedBooking(null);
    setPanelMode('add');
    setShowPanel(true);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.metaKey ||
        e.ctrlKey ||
        e.altKey
      ) {
        return;
      }
      if (e.key === 'Escape' && showPanel) {
        handleClosePanel();
        return;
      }
      if (showPanel) return;

      const key = e.key.toLowerCase();
      if (key === 'n') {
        handleAddBooking();
      } else if (key === 't') {
        handleJumpToToday();
      } else if (key === '1') {
        setView('month');
      } else if (key === '2') {
        setView('week');
      } else if (key === '3') {
        setView('trimonth');
      } else if (e.key === 'ArrowLeft') {
        if (view === 'month') handlePrevMonth();
        else if (view === 'week') handlePrevWeek();
        else handlePrevTriMonth();
      } else if (e.key === 'ArrowRight') {
        if (view === 'month') handleNextMonth();
        else if (view === 'week') handleNextWeek();
        else handleNextTriMonth();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showPanel, handleAddBooking, view, setView]);

  return (
    <div className="cal-screen">
      {/* ─── Cinematic background (extracted for Ken Burns) ─── */}
      <div aria-hidden="true" className="cal-bg" />

      {/* ─── Dark base overlay ─── */}
      <div aria-hidden="true" className="cal-base-overlay" />

      {/* ─── Asymmetric overlay ─── */}
      <div aria-hidden="true" className="cal-overlay" />

      {/* ─── Film-grain texture overlay ─── */}
      <div className="nav-grain" aria-hidden="true" />

      {/* ─── Main Content Wrapper ─── */}
      {/* Panel overlays on top (z-50); this wrapper stays full-width. */}
      <div
        className="cal-content-wrapper"
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

        {/* ─── Split-field layout (calendar left, bookings right) ─── */}
        <div className="cal-split-layout">
          <div className="cal-split-layout__left">
            {view === 'month' && (
              <CalendarGrid
                days={calendarDays}
                year={currentYear}
                month={currentMonth}
                onPrevMonth={handlePrevMonth}
                onNextMonth={handleNextMonth}
                slideDir={slideDir}
                onDateRangeSelected={handleDateRangeSelected}
                selectedBooking={selectedBooking}
                loading={false}
                error={null}
                onRetry={() => {}}
              />
            )}
            {view === 'week' && (
              <WeekGrid
                weekStart={weekStart}
                bookings={bookings}
                onPrevWeek={handlePrevWeek}
                onNextWeek={handleNextWeek}
                onDateRangeSelected={handleDateRangeSelected}
                onJumpToToday={handleJumpToToday}
                selectedBooking={selectedBooking}
              />
            )}
            {view === 'trimonth' && (
              <TriMonthGrid
                baseMonthStart={new Date(currentYear, currentMonth, 1)}
                bookings={bookings}
                onPrevMonth={handlePrevTriMonth}
                onNextMonth={handleNextTriMonth}
                onDateRangeSelected={handleDateRangeSelected}
                selectedBooking={selectedBooking}
              />
            )}
          </div>

          <div className="cal-split-layout__right">
            <BookingList
              bookings={bookings}
              onSelect={handleSelectBooking}
              onAdd={handleAddBooking}
              loading={false}
              viewToggle={
                <div className="cal-view-toggle" role="group" aria-label="Calendar view">
                  <button
                    type="button"
                    className={`cal-view-toggle__btn${view === 'month' ? ' cal-view-toggle__btn--active' : ''}`}
                    onClick={() => setView('month')}
                    aria-pressed={view === 'month'}
                  >
                    Month
                  </button>
                  <button
                    type="button"
                    className={`cal-view-toggle__btn${view === 'week' ? ' cal-view-toggle__btn--active' : ''}`}
                    onClick={() => setView('week')}
                    aria-pressed={view === 'week'}
                  >
                    Week
                  </button>
                  <button
                    type="button"
                    className={`cal-view-toggle__btn cal-view-toggle__btn--trimonth${view === 'trimonth' ? ' cal-view-toggle__btn--active' : ''}`}
                    onClick={() => setView('trimonth')}
                    aria-pressed={view === 'trimonth'}
                  >
                    3-Mo
                  </button>
                </div>
              }
            />
          </div>
        </div>
      </div>

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

      {/* ─── Toast (always-fires post-action feedback) ─── */}
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
