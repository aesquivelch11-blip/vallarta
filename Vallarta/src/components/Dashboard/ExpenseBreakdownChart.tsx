import React, { useEffect, useState } from 'react';
import { ExpenseCategory } from './dashboardData';

interface ExpenseBreakdownChartProps {
  data: ExpenseCategory[];
}

export default function ExpenseBreakdownChart({ data }: ExpenseBreakdownChartProps) {
  const [animatedWidths, setAnimatedWidths] = useState<number[]>(data.map(() => 0));
  const maxAmount = Math.max(...data.map(d => d.amount));

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedWidths(data.map(d => (d.amount / maxAmount) * 100));
    }, 200);
    return () => clearTimeout(timer);
  }, [data, maxAmount]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {data.map((item, i) => (
        <div key={item.label} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.625rem', fontWeight: 500, letterSpacing: '0.20em', textTransform: 'uppercase', color: 'var(--color-ink-secondary)', margin: 0 }}>
              {item.label}
            </p>
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.625rem', fontWeight: 400, letterSpacing: '0.10em', color: 'var(--color-ink-muted)', margin: 0 }}>
              ${item.amount.toLocaleString()}
            </p>
          </div>
          <div style={{ width: '100%', height: '6px', background: 'var(--color-border-subtle)', borderRadius: '2px', overflow: 'hidden' }}>
            <div
              style={{
                width: `${animatedWidths[i]}%`,
                height: '100%',
                background: 'var(--color-accent-positive)',
                borderRadius: '2px',
                transition: 'width 0.6s var(--ease-out-expo)',
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
