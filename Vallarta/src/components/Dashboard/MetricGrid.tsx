import React from 'react';
import AnimatedFigure from './AnimatedFigure';
import TrendBadge from './TrendBadge';
import Sparkline from './Sparkline';

interface Metric {
  label: string;
  value: number;
  formatter: (n: number) => string;
  trend?: string;
  trendDirection?: 'up' | 'down' | 'stable';
  sparklineData?: number[];
}

interface MetricGridProps {
  metrics: Metric[];
}

export default function MetricGrid({ metrics }: MetricGridProps) {
  if (metrics.length === 0) return null;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'clamp(1rem, 2vw, 1.5rem)' }}>
      {metrics.map((metric, i) => (
        <div key={metric.label} style={{ display: 'flex', flexDirection: 'column', gap: '6px', padding: 'clamp(0.5rem, 1vw, 1rem)', borderLeft: i > 0 ? '1px solid var(--color-border-subtle)' : 'none' }}>
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.5625rem', fontWeight: 500, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--color-ink-secondary)', margin: 0, lineHeight: 1 }}>
            {metric.label}
          </p>
          <AnimatedFigure
            value={metric.value}
            formatter={metric.formatter}
            style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 400, letterSpacing: '-0.01em', color: 'var(--color-ink)', lineHeight: 1, margin: '4px 0 0' }}
          />
          {metric.trend && metric.trendDirection && (
            <TrendBadge value={metric.trend} direction={metric.trendDirection} />
          )}
          {metric.sparklineData && (
            <Sparkline data={metric.sparklineData} width={140} height={48} color="var(--color-ink-secondary)" strokeWidth={1.25} />
          )}
        </div>
      ))}
    </div>
  );
}
