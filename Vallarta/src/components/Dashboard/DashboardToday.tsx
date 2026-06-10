import React from 'react';
import { ArrowRight } from 'lucide-react';
import { ScreenType } from '../../types';
import { Domain } from './DashboardDomainNav';
import {
  DashboardData,
  GuestEvent,
  formatCurrency,
  formatTrendPercent,
  getTrendDirection,
  formatDueDate,
} from './dashboardData';
import TrendBadge from './TrendBadge';
import Sparkline from './Sparkline';

interface DashboardTodayProps {
  data: DashboardData;
  onNavigate: (screen: ScreenType, style: 'push' | 'push_back' | 'slide_up') => void;
  onDomainChange?: (domain: Domain) => void;
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

export default function DashboardToday({ data, onNavigate, onDomainChange }: DashboardTodayProps) {
  const { occupancy, arrivalsToday, departuresToday, arrivalsTomorrow, departuresTomorrow } = data;

  const currentPeriod = data.periods[0];
  const prevPeriod = data.periods[1];
  const netIncome = currentPeriod.revenue - currentPeriod.expenses;
  const revTrend = formatTrendPercent(currentPeriod.revenue, prevPeriod?.revenue ?? currentPeriod.revenue);
  const revDirection = getTrendDirection(currentPeriod.revenue, prevPeriod?.revenue ?? currentPeriod.revenue);
  const urgentTask = data.tasks.find(t => t.status === 'urgent') ?? null;

  const labelStyle: React.CSSProperties = {
    fontFamily: 'var(--font-ui)',
    fontSize: '0.5625rem',
    fontWeight: 500,
    letterSpacing: '0.28em',
    textTransform: 'uppercase' as const,
    color: 'var(--color-ink-secondary)',
    margin: 0,
    lineHeight: 1,
  };

  const divider = (
    <div style={{ height: '1px', background: 'var(--color-border-subtle)', flexShrink: 0 }} />
  );

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        padding: 'clamp(1.5rem, 3vw, 2rem) clamp(1.5rem, 3vw, 2.5rem)',
        gap: 'clamp(1.25rem, 2.5vw, 1.75rem)',
      }}
    >
      {/* Zone 1 — Financial Snapshot */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 'clamp(1rem, 2vw, 1.5rem)',
          flexShrink: 0,
        }}
      >
        {/* Revenue MTD */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <p style={labelStyle}>Revenue MTD</p>
          <p
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.25rem, 2.2vw, 1.625rem)',
              fontWeight: 400,
              letterSpacing: '-0.01em',
              color: 'var(--color-ink)',
              margin: 0,
              lineHeight: 1,
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {formatCurrency(currentPeriod.revenue)}
          </p>
          <TrendBadge value={revTrend} direction={revDirection} />
        </div>

        {/* Net Income MTD */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <p style={labelStyle}>Net Income</p>
          <p
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.25rem, 2.2vw, 1.625rem)',
              fontWeight: 400,
              letterSpacing: '-0.01em',
              color: netIncome >= 0 ? 'var(--color-ink)' : 'oklch(53% 0.12 25)',
              margin: 0,
              lineHeight: 1,
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {formatCurrency(netIncome)}
          </p>
          <p
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '0.5625rem',
              fontWeight: 400,
              letterSpacing: '0.10em',
              textTransform: 'uppercase',
              color: 'var(--color-ink-muted)',
              margin: 0,
              lineHeight: 1,
            }}
          >
            {currentPeriod.label}
          </p>
        </div>
      </div>

      {divider}

      {/* Zone 2 — Occupancy */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flexShrink: 0 }}>
        {/* Occupancy figure + sparkline */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <p
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2.25rem, 4.5vw, 3.25rem)',
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
              <p style={labelStyle}>Occupancy</p>
              <TrendBadge
                value={formatTrendPercent(occupancy, data.occupancyPrev)}
                direction={getTrendDirection(occupancy, data.occupancyPrev)}
              />
            </div>
          </div>
          <Sparkline
            data={data.occupancyHistory}
            width={120}
            height={40}
            color="var(--color-ink-secondary)"
            strokeWidth={1.25}
          />
        </div>

        {/* Satellite metrics row */}
        <div
          style={{
            display: 'flex',
            gap: '20px',
            alignItems: 'center',
            marginTop: '4px',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '0.5625rem',
              fontWeight: 400,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--color-ink-muted)',
              lineHeight: 1,
            }}
          >
            {data.guestSatisfaction.score.toFixed(1)}★
          </span>
          <span
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '0.5625rem',
              fontWeight: 400,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--color-ink-muted)',
              lineHeight: 1,
            }}
          >
            {data.guestSatisfaction.reviewCount} reviews
          </span>
          <span
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '0.5625rem',
              fontWeight: 400,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--color-ink-muted)',
              lineHeight: 1,
            }}
          >
            {data.lengthOfStay.average.toFixed(1)}n avg stay
          </span>
        </div>
      </div>

      {divider}

      {/* Zone 3 — Today's Activity */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(1rem, 2vw, 1.5rem)', minHeight: 0 }}>
        {/* Arrivals */}
        <div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
            <p
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.375rem, 2.5vw, 1.875rem)',
                fontWeight: 400,
                color: 'var(--color-ink)',
                margin: 0,
                lineHeight: 1,
              }}
            >
              {arrivalsToday.length}
            </p>
            <p style={labelStyle}>Arriving today</p>
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
                margin: '8px 0 0',
                opacity: 0.7,
              }}
            >
              {arrivalsTomorrow.length} tomorrow
            </p>
          )}
        </div>

        {/* Departures */}
        <div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
            <p
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1rem, 2vw, 1.25rem)',
                fontWeight: 400,
                color: 'var(--color-ink-secondary)',
                margin: 0,
                lineHeight: 1,
              }}
            >
              {departuresToday.length}
            </p>
            <p style={{ ...labelStyle, fontSize: '0.5rem', opacity: 0.75 }}>Departing today</p>
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
      </div>

      {/* Zone 4 — Urgent Task Alert */}
      {urgentTask && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            flexShrink: 0,
          }}
        >
          <span
            style={{
              width: '5px',
              height: '5px',
              borderRadius: '50%',
              background: 'var(--color-task-urgent)',
              flexShrink: 0,
            }}
            aria-hidden="true"
          />
          <p
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '0.6875rem',
              fontWeight: 400,
              color: 'var(--color-ink-secondary)',
              margin: 0,
              lineHeight: 1.3,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {urgentTask.description}
            <span
              style={{
                fontFamily: 'var(--font-ui)',
                fontSize: '0.5625rem',
                letterSpacing: '0.10em',
                textTransform: 'uppercase',
                color: 'var(--color-ink-muted)',
                marginLeft: '8px',
              }}
            >
              {urgentTask.assignee} · {formatDueDate(urgentTask.dueDate)}
            </span>
          </p>
        </div>
      )}

      {/* Zone 5 — Navigation Row */}
      <div
        style={{
          display: 'flex',
          gap: '24px',
          flexShrink: 0,
        }}
      >
        <button
          className="dashboard-link"
          onClick={() => onNavigate('calendar', 'push')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontFamily: 'var(--font-ui)',
            fontSize: '0.5625rem',
            fontWeight: 500,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: 'var(--color-ink-secondary)',
            background: 'none',
            border: 'none',
            padding: 0,
            cursor: 'pointer',
          }}
        >
          Calendar
          <ArrowRight size={10} strokeWidth={1.5} />
        </button>

        {onDomainChange && (
          <button
            className="dashboard-link"
            onClick={() => onDomainChange('financials')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontFamily: 'var(--font-ui)',
              fontSize: '0.5625rem',
              fontWeight: 500,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: 'var(--color-ink-secondary)',
              background: 'none',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
            }}
          >
            Financials
            <ArrowRight size={10} strokeWidth={1.5} />
          </button>
        )}
      </div>
    </div>
  );
}
