import React from 'react';
import { ArrowRight } from 'lucide-react';
import { ScreenType } from '../../types';
import { DashboardData, GuestEvent, formatTrendPercent, getTrendDirection } from './dashboardData';

interface DashboardTodayProps {
  data: DashboardData;
  onNavigate: (screen: ScreenType, style: 'push' | 'push_back' | 'slide_up') => void;
}

function GuestList({ guests, italic }: { guests: GuestEvent[]; italic: boolean }) {
  if (guests.length === 0) return null;
  return (
    <ul style={{ margin: '6px 0 0', padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '2px' }}>
      {guests.map(g => (
        <li
          key={g.id}
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(0.875rem, 1.5vw, 1.0625rem)',
            fontStyle: italic ? 'italic' : 'normal',
            fontWeight: 400,
            color: 'var(--color-ink)',
            lineHeight: 1.3,
          }}
        >
          {g.name}
          <span
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '0.625rem',
              fontStyle: 'normal',
              fontWeight: 400,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--color-ink-secondary)',
              marginLeft: '8px',
            }}
          >
            {g.nights}n
          </span>
        </li>
      ))}
    </ul>
  );
}

function EmptyGuests({ label }: { label: string }) {
  return (
    <p
      style={{
        fontFamily: 'var(--font-ui)',
        fontSize: '0.75rem',
        fontWeight: 400,
        color: 'var(--color-ink-secondary)',
        margin: '6px 0 0',
        fontStyle: 'normal',
      }}
    >
      {label}
    </p>
  );
}

export default function DashboardToday({ data, onNavigate }: DashboardTodayProps) {
  const { occupancy, arrivalsToday, departuresToday, arrivalsTomorrow, departuresTomorrow } = data;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        padding: 'clamp(2rem, 4vw, 3rem) clamp(1.5rem, 3vw, 2.5rem)',
        gap: 0,
      }}
    >
      {/* Occupancy — dominant */}
      <div style={{ marginBottom: 'clamp(2rem, 4vw, 3rem)' }}>
        <p
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
            fontWeight: 400,
            letterSpacing: '-0.01em',
            color: 'var(--color-ink)',
            margin: 0,
            lineHeight: 1,
          }}
        >
          {occupancy}%
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '8px' }}>
          <p
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '0.625rem',
              fontWeight: 500,
              letterSpacing: '0.30em',
              textTransform: 'uppercase',
              color: 'var(--color-ink-secondary)',
              margin: 0,
            }}
          >
            OCCUPANCY
          </p>
          <p
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '0.5625rem',
              fontWeight: 500,
              letterSpacing: '0.10em',
              textTransform: 'uppercase',
              color: (() => {
                const dir = getTrendDirection(occupancy, data.occupancyPrev);
                if (dir === 'up') return 'var(--color-accent-positive)';
                if (dir === 'down') return 'var(--color-accent-negative)';
                return 'var(--color-ink-muted)';
              })(),
              margin: 0,
              opacity: 0.85,
            }}
          >
            {formatTrendPercent(occupancy, data.occupancyPrev)}
          </p>
        </div>
      </div>

      {/* Arrivals — more visual weight */}
      <div style={{ marginBottom: 'clamp(1.5rem, 3vw, 2rem)' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
          <p
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.5rem, 3vw, 2rem)',
              fontWeight: 400,
              color: 'var(--color-ink)',
              margin: 0,
              lineHeight: 1,
            }}
          >
            {arrivalsToday.length}
          </p>
          <p
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '0.625rem',
              fontWeight: 500,
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              color: 'var(--color-ink-secondary)',
              margin: 0,
            }}
          >
            Arriving today
          </p>
        </div>
        {arrivalsToday.length > 0
          ? <GuestList guests={arrivalsToday} italic={true} />
          : <EmptyGuests label="No arrivals" />
        }
        {arrivalsTomorrow.length > 0 && (
          <p
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '0.625rem',
              fontWeight: 400,
              letterSpacing: '0.10em',
              textTransform: 'uppercase',
              color: 'var(--color-ink-muted)',
              margin: '10px 0 0',
              opacity: 0.7,
            }}
          >
            {arrivalsTomorrow.length} tomorrow
          </p>
        )}
      </div>

      {/* Departures — subordinate */}
      <div style={{ marginBottom: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
          <p
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1rem, 2vw, 1.375rem)',
              fontWeight: 400,
              color: 'var(--color-ink-secondary)',
              margin: 0,
              lineHeight: 1,
            }}
          >
            {departuresToday.length}
          </p>
          <p
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '0.5625rem',
              fontWeight: 500,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: 'var(--color-ink-secondary)',
              margin: 0,
              opacity: 0.75,
            }}
          >
            Departing today
          </p>
        </div>
        {departuresToday.length > 0
          ? <GuestList guests={departuresToday} italic={false} />
          : <EmptyGuests label="No departures" />
        }
        {departuresTomorrow.length > 0 && (
          <p
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '0.5625rem',
              fontWeight: 400,
              letterSpacing: '0.10em',
              textTransform: 'uppercase',
              color: 'var(--color-ink-muted)',
              margin: '8px 0 0',
              opacity: 0.6,
            }}
          >
            {departuresTomorrow.length} tomorrow
          </p>
        )}
            </div>

      {/* Quiet day message */}
      {arrivalsToday.length === 0 && departuresToday.length === 0 && (
        <div
          style={{
            marginTop: 'clamp(1rem, 2vw, 1.5rem)',
            paddingTop: 'clamp(1rem, 2vw, 1.5rem)',
            borderTop: '1px solid var(--color-border-subtle)',
          }}
        >
          <p
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '0.75rem',
              fontWeight: 400,
              color: 'var(--color-ink-secondary)',
              margin: 0,
              lineHeight: 1.5,
            }}
          >
            Quiet day — no arrivals or departures scheduled.
          </p>
          {arrivalsTomorrow.length > 0 && (
            <p
              style={{
                fontFamily: 'var(--font-ui)',
                fontSize: '0.625rem',
                fontWeight: 400,
                letterSpacing: '0.06em',
                color: 'var(--color-ink-muted)',
                margin: '8px 0 0',
                lineHeight: 1.4,
              }}
            >
              {arrivalsTomorrow.length} {arrivalsTomorrow.length === 1 ? 'guest arrives' : 'guests arrive'} tomorrow.
            </p>
          )}
        </div>
      )}

      {/* Nav link */
}
      <button
        className="dashboard-link"
        onClick={() => onNavigate('calendar', 'push')}
        style={{
          marginTop: 'clamp(1.5rem, 3vw, 2rem)',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          fontFamily: 'var(--font-ui)',
          fontSize: '0.625rem',
          fontWeight: 500,
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color: 'var(--color-ink-secondary)',
          background: 'none',
          border: 'none',
          padding: 0,
          cursor: 'pointer',
          alignSelf: 'flex-start',
        }}
      >
        VIEW CALENDAR
        <ArrowRight size={11} strokeWidth={1.5} />
      </button>
    </div>
  );
}
