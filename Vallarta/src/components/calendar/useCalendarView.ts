// src/components/calendar/useCalendarView.ts
import { useState, useCallback, useEffect } from 'react';

export type CalendarViewMode = 'month' | 'week' | 'trimonth';

const STORAGE_KEY = 'vallarta.calendarView';
const VALID_MODES: CalendarViewMode[] = ['month', 'week', 'trimonth'];

function loadStoredMode(): CalendarViewMode {
  if (typeof window === 'undefined') return 'month';
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (raw && (VALID_MODES as string[]).includes(raw)) {
    return raw as CalendarViewMode;
  }
  return 'month';
}

export function useCalendarView() {
  const [view, setViewState] = useState<CalendarViewMode>(loadStoredMode);

  const setView = useCallback((next: CalendarViewMode) => {
    setViewState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // localStorage unavailable — non-blocking
    }
  }, []);

  return { view, setView };
}

/** Computes the Monday-anchored start of the week containing `date`. */
export function startOfWeek(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const day = d.getDay(); // 0 = Sunday
  const offset = (day + 6) % 7; // shift so Monday = 0
  d.setDate(d.getDate() - offset);
  return d;
}

/** YYYY-MM-DD for a given Date. */
export function toDateStr(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
