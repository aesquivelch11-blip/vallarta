import React from 'react';
import { motion } from 'motion/react';
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      {events.map((event, i) => (
        <motion.div
          key={event.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.25,
            delay: i * 0.045,
            ease: [0.16, 1, 0.3, 1] as const,
          }}
          style={{
            display: 'grid',
            gridTemplateColumns: '72px 1fr',
            gap: '0 14px',
            alignItems: 'baseline',
            padding: '9px 0',
            borderBottom:
              i < events.length - 1
                ? '1px solid var(--color-border-subtle)'
                : 'none',
          }}
        >
          {/* Time column: fixed-width tabular mono */}
          <p
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '0.6875rem',
              fontWeight: 400,
              letterSpacing: '0.06em',
              color: 'var(--color-ink-muted)',
              fontVariantNumeric: 'tabular-nums',
              margin: 0,
              lineHeight: 1.5,
            }}
          >
            {formatTime(event.timestamp)}
          </p>

          {/* Description column */}
          <p
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '0.75rem',
              fontWeight: 400,
              color: 'var(--color-ink)',
              margin: 0,
              lineHeight: 1.4,
            }}
          >
            {event.description}
          </p>
        </motion.div>
      ))}
    </div>
  );
}
