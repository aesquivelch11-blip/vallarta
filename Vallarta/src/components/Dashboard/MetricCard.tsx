import React from 'react';
import TrendBadge from './TrendBadge';
import Sparkline from './Sparkline';

interface MetricCardProps {
  label: string;
  value: string;
  trend?: { value: string; direction: 'up' | 'down' | 'stable' };
  sparkline?: number[];
  sparklineColor?: string;
  valueFont?: 'display' | 'ui';
  valueSize?: string;
}

export default function MetricCard({
  label,
  value,
  trend,
  sparkline,
  sparklineColor,
  valueFont = 'display',
  valueSize = 'clamp(1.5rem, 3vw, 2rem)',
}: MetricCardProps) {
  const hasFooter = trend || sparkline;

  return (
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
        {label}
      </p>

      <p
        style={{
          fontFamily: valueFont === 'display' ? 'var(--font-display)' : 'var(--font-ui)',
          fontSize: valueSize,
          fontWeight: 400,
          letterSpacing: '-0.01em',
          color: 'var(--color-ink)',
          margin: 0,
          lineHeight: 1,
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {value}
      </p>

      {hasFooter && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginTop: '2px',
          }}
        >
          {trend && <TrendBadge value={trend.value} direction={trend.direction} />}
          {sparkline && (
            <Sparkline
              data={sparkline}
              width={64}
              height={20}
              color={sparklineColor || 'var(--color-ink-muted)'}
              strokeWidth={1.25}
            />
          )}
        </div>
      )}
    </div>
  );
}
