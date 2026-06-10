import React from 'react';
import { GuestLogEntry } from './dashboardData';

interface ChronicleTimelineProps {
  events: GuestLogEntry[];
}

export default function ChronicleTimeline({ events }: ChronicleTimelineProps) {
  const formatTime = (ts: string) => {
    const d = new Date(ts);
    return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0', maxHeight: '200px', overflowY: 'auto' }}>
      <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.5625rem', fontWeight: 500, letterSpacing: '0.32em', textTransform: 'uppercase', color: 'var(--color-ink-secondary)', margin: '0 0 12px' }}>
        CHRONICLE
      </p>
      {events.map((event, i) => (
        <div key={event.id} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', padding: '8px 0', borderBottom: i < events.length - 1 ? '1px solid var(--color-border-subtle)' : 'none' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
            <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'var(--color-ink-secondary)', opacity: 0.5 }} />
            {i < events.length - 1 && <div style={{ width: '1px', flex: 1, background: 'var(--color-border-subtle)', marginTop: '4px' }} />}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <p style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: '0.625rem', fontWeight: 400, color: 'var(--color-ink-secondary)', margin: 0, lineHeight: 1.2 }}>
              {formatTime(event.timestamp)}
            </p>
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.75rem', fontWeight: 400, color: 'var(--color-ink)', margin: 0, lineHeight: 1.4 }}>
              {event.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
