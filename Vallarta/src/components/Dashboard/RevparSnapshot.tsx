import React from 'react';

interface RevparSnapshotProps {
  revenue: number;
  daysInPeriod?: number;
  sparklineData: number[];
  trend: string;
  trendDirection: 'up' | 'down' | 'stable';
}

export default function RevparSnapshot({
  revenue,
  daysInPeriod = 30,
  sparklineData,
  trend,
  trendDirection,
}: RevparSnapshotProps) {
  const revpar = Math.round(revenue / daysInPeriod);

  const w = 80, h = 28, pad = 2;
  const max = Math.max(...sparklineData);
  const min = Math.min(...sparklineData);
  const range = max - min || 1;
  const points = sparklineData
    .map((val, i) => {
      const x = pad + (i / (sparklineData.length - 1)) * (w - 2 * pad);
      const y = h - pad - ((val - min) / range) * (h - 2 * pad);
      return `${x},${y}`;
    })
    .join(' ');

  const trendColor =
    trendDirection === 'up'
      ? 'var(--color-accent-positive)'
      : trendDirection === 'down'
      ? 'var(--color-accent-negative)'
      : 'var(--color-ink-muted)';

  const labelStyle: React.CSSProperties = {
    fontFamily: 'var(--font-ui)',
    fontSize: '0.5625rem',
    fontWeight: 500,
    letterSpacing: '0.28em',
    textTransform: 'uppercase',
    color: 'var(--color-ink-secondary)',
    margin: 0,
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      <p style={labelStyle}>REVPAR</p>
      <p
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(1.25rem, 2.5vw, 1.75rem)',
          fontWeight: 400,
          letterSpacing: '-0.01em',
          color: 'var(--color-ink)',
          margin: 0,
          lineHeight: 1,
        }}
      >
        ${revpar.toLocaleString()}
      </p>
      <p
        style={{
          fontFamily: 'var(--font-ui)',
          fontSize: '0.5rem',
          fontWeight: 400,
          letterSpacing: '0.10em',
          textTransform: 'uppercase',
          color: trendColor,
          margin: '2px 0 0',
        }}
      >
        {trend}
      </p>
      <svg
        width={w}
        height={h}
        viewBox={`0 0 ${w} ${h}`}
        style={{ marginTop: '8px' }}
        aria-hidden="true"
      >
        <polyline
          points={points}
          fill="none"
          stroke="var(--color-ink-secondary)"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.35"
        />
      </svg>
      <p
        style={{
          fontFamily: 'var(--font-ui)',
          fontSize: '0.4375rem',
          fontWeight: 400,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: 'var(--color-ink-muted)',
          margin: 0,
        }}
      >
        30-day occupancy
      </p>
    </div>
  );
}
