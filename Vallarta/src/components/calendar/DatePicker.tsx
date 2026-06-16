// src/components/calendar/DatePicker.tsx
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Booking,
  buildCalendarDays,
  CalendarDay,
  MONTH_NAMES
} from './bookingUtils';

interface DatePickerProps {
  isOpen: boolean;
  onClose: () => void;
  checkIn: string; // "YYYY-MM-DD"
  checkOut: string; // "YYYY-MM-DD"
  bookings: Booking[];
  excludeBookingId?: string;
  onSelectRange: (checkIn: string, checkOut: string) => void;
}

const EASE = [0.32, 0.72, 0, 1] as const;
const DAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

// Helper to convert date components to "YYYY-MM-DD"
function toDateString(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

export default function DatePicker({
  isOpen,
  onClose,
  checkIn,
  checkOut,
  bookings,
  excludeBookingId,
  onSelectRange,
}: DatePickerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize display month based on check-in date or current date
  const [currentYear, setCurrentYear] = useState(() => {
    if (checkIn) return new Date(checkIn + 'T00:00:00').getFullYear();
    return new Date().getFullYear();
  });
  const [currentMonth, setCurrentMonth] = useState(() => {
    if (checkIn) return new Date(checkIn + 'T00:00:00').getMonth();
    return new Date().getMonth();
  });

  // Keep track of which date is being hovered during range selection
  const [hoveredDate, setHoveredDate] = useState<string | null>(null);

  // Focus mode: 'checkIn' | 'checkOut'
  // If checkIn is empty or we just opened, we target checkIn. If checkIn is set, we target checkOut.
  const [activeStep, setActiveStep] = useState<'checkIn' | 'checkOut'>('checkIn');

  useEffect(() => {
    if (isOpen) {
      if (!checkIn) {
        setActiveStep('checkIn');
      } else if (checkIn && !checkOut) {
        setActiveStep('checkOut');
      } else {
        setActiveStep('checkIn');
      }
    }
  }, [isOpen, checkIn, checkOut]);

  // Click outside to close
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  // Build the list of active bookings to display
  const activeBookings = bookings.filter(b => b.id !== excludeBookingId && b.status !== 'Cancelled');
  const days = buildCalendarDays(currentYear, currentMonth, activeBookings);

  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(prev => prev - 1);
    } else {
      setCurrentMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(prev => prev + 1);
    } else {
      setCurrentMonth(prev => prev + 1);
    }
  };

  const handleDayClick = (dayVal: number) => {
    const day = days.find(d => d.day === dayVal);
    if (!day || day.empty || day.past) return;
    const clickedDateStr = day.date;

    if (activeStep === 'checkIn') {
      onSelectRange(clickedDateStr, '');
      setActiveStep('checkOut');
    } else {
      // Selecting checkout
      if (clickedDateStr <= checkIn) {
        // If checkout is before or equal to checkin, reset checkin to this date
        onSelectRange(clickedDateStr, '');
        setActiveStep('checkOut');
      } else {
        onSelectRange(checkIn, clickedDateStr);
        onClose(); // Automatically close when a valid range is selected
      }
    }
  };

  // Helper to determine cell classes and selections
  const getDayStatus = (dayVal: number) => {
    if (dayVal === 0) return { isEmpty: true };
    const dateStr = toDateString(currentYear, currentMonth, dayVal);
    const isCheckIn = dateStr === checkIn;
    const isCheckOut = dateStr === checkOut;

    let inRange = false;
    if (checkIn && checkOut && dateStr > checkIn && dateStr < checkOut) {
      inRange = true;
    } else if (checkIn && !checkOut && hoveredDate && dateStr > checkIn && dateStr <= hoveredDate) {
      inRange = true;
    }

    return {
      isEmpty: false,
      isCheckIn,
      isCheckOut,
      inRange,
      dateStr,
    };
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={containerRef}
          initial={{ opacity: 0, y: 12, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.98 }}
          transition={{ duration: 0.28, ease: EASE }}
          className="relative z-10 left-0 right-0 mt-2 p-1 rounded-lg cal-date-picker-outer"
        >
          {/* Double-Bezel nested architecture */}
          <div className="cal-date-picker-inner p-4 rounded-md">
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-4">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="w-8 h-8 rounded-full flex items-center justify-center cal-picker-arrow transition-colors cursor-pointer"
                aria-label="Previous month"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              <div className="text-center">
                <span className="block font-serif text-lg cal-picker-month font-medium leading-none">
                  {MONTH_NAMES[currentMonth]}
                </span>
                <span className="text-[10px] font-sans tracking-[0.2em] cal-picker-year font-semibold uppercase mt-1 block">
                  {currentYear}
                </span>
              </div>

              <button
                type="button"
                onClick={handleNextMonth}
                className="w-8 h-8 rounded-full flex items-center justify-center cal-picker-arrow transition-colors cursor-pointer"
                aria-label="Next month"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>

            {/* Instruction bar */}
            <div className="text-center text-[10px] uppercase tracking-wider cal-picker-instruction mb-3 font-semibold">
              {activeStep === 'checkIn' ? 'Select Check-in Date' : 'Select Check-out Date'}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-7 gap-1 text-center text-xs">
              {/* Day Labels */}
              {DAY_LABELS.map((lbl, idx) => (
                <div key={`lbl-${idx}`} className="text-[10px] font-bold cal-picker-day-label uppercase py-1">
                  {lbl}
                </div>
              ))}

              {/* Day Cells */}
              {days.map((d, idx) => {
                const { isEmpty, isCheckIn, isCheckOut, inRange, dateStr } = getDayStatus(d.day);

                if (isEmpty) {
                  return <div key={`empty-${idx}`} className="h-9" />;
                }

                // Check if this day is booked from active bookings (for dot display)
                const isBooked = d.booked;
                const isOwner = d.ownerStay;
                const isPending = d.pending;

                return (
                  <button
                    key={`day-${idx}`}
                    type="button"
                    onClick={() => handleDayClick(d.day)}
                    disabled={d.past}
                    aria-disabled={d.past}
                    onMouseEnter={() => dateStr && setHoveredDate(dateStr)}
                    onMouseLeave={() => setHoveredDate(null)}
                    className={`
                      relative h-9 rounded flex flex-col items-center justify-center transition-all duration-150 cal-picker-day
                      ${isCheckIn || isCheckOut ? 'cal-picker-day--selected' : ''}
                      ${inRange && !isCheckIn && !isCheckOut ? 'cal-picker-day--range' : ''}
                      ${!isCheckIn && !isCheckOut && !inRange && !d.past ? 'cal-picker-day--hover' : ''}
                      ${d.past ? 'cal-picker-day--past' : ''}
                    `}
                  >
                    <span className="font-sans text-xs">{d.day}</span>
                    {/* Tiny status indicator dot if booked */}
                    {(isBooked || isOwner || isPending) && !isCheckIn && !isCheckOut && (
                      <span className={`
                        absolute bottom-1 w-1.5 h-1.5 rounded-full cal-picker-dot
                        ${isOwner ? 'cal-picker-dot--owner' : isPending ? 'cal-picker-dot--pending' : 'cal-picker-dot--confirmed'}
                      `} />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
