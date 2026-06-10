import React, { useState } from 'react';

interface OccupancyHeatmapProps {
  data: number[];
}

export default function OccupancyHeatmap({ data }: OccupancyHeatmapProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const today = new Date('2026-06-07');

  const getColor = (val: number) => {
    if (val >= 80) return 'var(--color-accent-positive)';
    if (val >= 50) return 'var(--color-ink-secondary)';
    return 'var(--color-border-medium)';
  };

  const getDate = (index: number) => {
    const d = new Date(today);
    d.setDate(d.getDate() + index);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.5625rem', fontWeight: 500, letterSpacing: '0.32em', textTransform: 'uppercase', color: 'var(--color-ink-secondary)', margin: 0 }}>
          NEXT 30 DAYS
        </p>
        {hoveredIndex !== null && (
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.5625rem', fontWeight: 400, color: 'var(--color-ink-secondary)', margin: 0 }}>
            {getDate(hoveredIndex)} · {data[hoveredIndex]}% occupied
          </p>
        )}
      </div>
      <div style={{ display: 'flex', gap: '3px', alignItems: 'flex-end' }}>
        {data.map((val, i) => (
          <div
            key={i}
            style={{
              width: '6px',
              height: `${Math.max(val * 0.4, 4)}px`,
              background: getColor(val),
              borderRadius: '1px',
              opacity: hoveredIndex === i ? 1 : 0.8,
              transition: 'opacity 0.15s ease',
              cursor: 'pointer',
            }}
            onMouseEnter={() => setHoveredIndex(i)}
            onMouseLeave={() => setHoveredIndex(null)}
            title={`${getDate(i)}: ${val}% occupied`}
          />
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.5rem', fontWeight: 400, color: 'var(--color-ink-muted)', margin: 0 }}>
          {getDate(0)}
        </p>
        <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.5rem', fontWeight: 400, color: 'var(--color-ink-muted)', margin: 0 }}>
          {getDate(data.length - 1)}
        </p>
      </div>
    </div>
  );
}
