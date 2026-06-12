import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface TrendBadgeProps {
  value: string;
  direction: 'up' | 'down' | 'stable';
}

const trendColors: Record<string, string> = {
  up: 'var(--color-accent-positive)',
  down: 'var(--color-accent-negative)',
  stable: 'var(--color-ink-muted)',
};

export default function TrendBadge({ value, direction }: TrendBadgeProps) {
  const Icon = direction === 'up' ? TrendingUp : direction === 'down' ? TrendingDown : Minus;
  const iconSize = 10;

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '3px',
        fontFamily: 'var(--font-ui)',
        fontSize: '0.6875rem',
        fontWeight: 500,
        letterSpacing: '0.10em',
        color: trendColors[direction],
        lineHeight: 1,
      }}
    >
      <Icon size={iconSize} strokeWidth={2} />
      {value}
    </span>
  );
}
