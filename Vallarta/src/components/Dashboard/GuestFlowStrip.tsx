import React from 'react';
import { GuestEvent } from './dashboardData';

interface GuestFlowStripProps {
  arrivals: GuestEvent[];
  departures: GuestEvent[];
  arrivalsTomorrow: GuestEvent[];
  departuresTomorrow: GuestEvent[];
}

export default function GuestFlowStrip({ arrivals, departures, arrivalsTomorrow, departuresTomorrow }: GuestFlowStripProps) {
  const labelStyle = {
    fontFamily: 'var(--font-ui)',
    fontSize: '0.5625rem',
    fontWeight: 500,
    letterSpacing: '0.28em',
    textTransform: 'uppercase' as const,
    color: 'var(--color-ink-secondary)',
    margin: 0,
  };

  return (
    <div role="region" aria-label="Guest flow today" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'clamp(1rem, 2vw, 1.5rem)', alignItems: 'start' }}>
      {/* Arrivals */}
      <div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.375rem, 2.5vw, 1.875rem)', fontWeight: 400, color: 'var(--color-ink)', margin: 0, lineHeight: 1 }}>
            {arrivals.length}
          </p>
          <p style={labelStyle}>Arriving</p>
        </div>
        {arrivals.length > 0 && (
          <ul style={{ margin: '6px 0 0', padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {arrivals.slice(0, 3).map(g => (
              <li key={g.id} style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(0.875rem, 1.5vw, 1.0625rem)', fontStyle: 'italic', fontWeight: 400, color: 'var(--color-ink)', lineHeight: 1.3 }}>
                {g.name}
                <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.625rem', fontStyle: 'normal', fontWeight: 400, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-ink-secondary)', marginLeft: '8px' }}>
                  {g.nights}n
                </span>
              </li>
            ))}
          </ul>
        )}
        {arrivals.length === 0 && (
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.75rem', fontWeight: 400, color: 'var(--color-ink-secondary)', margin: '6px 0 0' }}>No arrivals</p>
        )}
      </div>

      {/* Departures */}
      <div style={{ opacity: 0.75 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.25rem, 2vw, 1.5rem)', fontWeight: 400, color: 'var(--color-ink-secondary)', margin: 0, lineHeight: 1 }}>
            {departures.length}
          </p>
          <p style={{ ...labelStyle, fontSize: '0.5rem', opacity: 0.75 }}>Departing</p>
        </div>
        {departures.length > 0 && (
          <ul style={{ margin: '6px 0 0', padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {departures.slice(0, 3).map(g => (
              <li key={g.id} style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(0.875rem, 1.5vw, 1.0625rem)', fontStyle: 'normal', fontWeight: 400, color: 'var(--color-ink-secondary)', lineHeight: 1.3 }}>
                {g.name}
                <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.625rem', fontWeight: 400, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-ink-secondary)', marginLeft: '8px' }}>
                  {g.nights}n
                </span>
              </li>
            ))}
          </ul>
        )}
        {departures.length === 0 && (
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.75rem', fontWeight: 400, color: 'var(--color-ink-secondary)', margin: '6px 0 0' }}>No departures</p>
        )}
      </div>

      {/* Tomorrow */}
      <div>
        <p style={{ ...labelStyle, opacity: 0.6 }}>Tomorrow</p>
        <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.75rem', fontWeight: 400, color: 'var(--color-ink-muted)', margin: '6px 0 0', lineHeight: 1.4 }}>
          {arrivalsTomorrow.length > 0 && `${arrivalsTomorrow.length} arriving`}
          {arrivalsTomorrow.length > 0 && departuresTomorrow.length > 0 && ' · '}
          {departuresTomorrow.length > 0 && `${departuresTomorrow.length} departing`}
          {arrivalsTomorrow.length === 0 && departuresTomorrow.length === 0 && 'Quiet day'}
        </p>
      </div>
    </div>
  );
}
