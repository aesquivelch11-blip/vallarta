import React from 'react';
import { ArrowRight, Star } from 'lucide-react';
import { ScreenType } from '../../types';
import { DashboardData, GuestEvent, formatTrendPercent, getTrendDirection } from './dashboardData';
import MetricCard from './MetricCard';

interface DashboardTodayProps {
  data: DashboardData;
  onNavigate: (screen: ScreenType, style: 'push' | 'push_back' | 'slide_up') => void;
}

function GuestList({ guests, italic }: { guests: GuestEvent[]; italic: boolean }) {
  if (guests.length === 0) return null;
  return (
    <ul style={{ margin: '8px 0 0', padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '4px' }}>
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
            display: 'flex',
            alignItems: 'baseline',
            gap: '8px',
          }}
        >
          <span>{g.name}</span>
          <span
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '0.5625rem',
              fontStyle: 'normal',
              fontWeight: 400,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--color-ink-secondary)',
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
        margin: '8px 0 0',
      }}
    >
      {label}
    </p>
  );
}

export default function DashboardToday({ data, onNavigate }: DashboardTodayProps) {
  const {
    occupancy,
    occupancyPrev,
    occupancyHistory,
    arrivalsToday,
    departuresToday,
    arrivalsTomorrow,
    departuresTomorrow,
    lengthOfStay,
    guestSatisfaction,
  } = data;

  const occupancyDir = getTrendDirection(occupancy, occupancyPrev);
  const losPrev = 3.8;
  const losTrendValue = formatTrendPercent(lengthOfStay.average, losPrev);
  const losTrendDir = getTrendDirection(lengthOfStay.average, losPrev);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        padding: 'clamp(2rem, 4vw, 3rem) clamp(1.5rem, 3vw, 2.5rem)',
      }}
    >
      {/* Metric grid: occupancy + LOS + satisfaction */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 'clamp(24px, 4vw, 48px)',
          marginBottom: 'clamp(2rem, 4vw, 3rem)',
        }}
      >
        <MetricCard
          label="Occupancy"
          value={`${occupancy}%`}
          trend={{
            value: formatTrendPercent(occupancy, occupancyPrev),
            direction: occupancyDir,
          }}
          sparkline={occupancyHistory}
          sparklineColor={
            occupancyDir === 'up'
              ? 'var(--color-accent-positive)'
              : occupancyDir === 'down'
                ? 'var(--color-accent-negative)'
                : 'var(--color-ink-muted)'
          }
          valueSize="clamp(1.75rem, 3.5vw, 2.5rem)"
        />

        <MetricCard
          label="Avg Stay"
          value={`${lengthOfStay.average} nights`}
          trend={{ value: losTrendValue, direction: losTrendDir }}
          valueFont="ui"
          valueSize="clamp(1.25rem, 2.5vw, 1.75rem)"
        />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <p
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '0.5625rem',
              fontWeight: 500,
              letterSpacing: '0.28em',
              textTransform: 'uppercase',
              color: 'var(--color-ink-secondary)',
              margin: 0,
              lineHeight: 1,
            }}
          >
            Guest Rating
          </p>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
            <p
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)',
                fontWeight: 400,
                letterSpacing: '-0.01em',
                color: 'var(--color-ink)',
                margin: 0,
                lineHeight: 1,
              }}
            >
              {guestSatisfaction.score}
            </p>
            <Star
              size={14}
              strokeWidth={1.5}
              fill="var(--color-accent-warning)"
              color="var(--color-accent-warning)"
              style={{ opacity: 0.7 }}
            />
          </div>
          <p
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '0.5625rem',
              fontWeight: 400,
              letterSpacing: '0.10em',
              color: 'var(--color-ink-muted)',
              margin: '2px 0 0',
              lineHeight: 1,
            }}
          >
            {guestSatisfaction.reviewCount} reviews
          </p>
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: '1px', background: 'var(--color-border-subtle)', marginBottom: 'clamp(1.5rem, 3vw, 2rem)' }} />

      {/* Arrivals */}
      <div style={{ marginBottom: 'clamp(1.25rem, 2.5vw, 1.75rem)' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
          <p
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.25rem, 2.5vw, 1.75rem)',
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
              fontSize: '0.5625rem',
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
              fontSize: '0.5625rem',
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

      {/* Departures */}
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

      {/* Nav link */}
      <button
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
