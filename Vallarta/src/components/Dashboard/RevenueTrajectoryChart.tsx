import React from 'react';

interface RevenueTrajectoryChartProps {
  data: number[];
  labels?: string[];
}

export default function RevenueTrajectoryChart({ data, labels }: RevenueTrajectoryChartProps) {
  const width = 400;
  const height = 150;
  const padding = 20;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  const points = data.map((val, i) => {
    const x = padding + (i / (data.length - 1)) * (width - 2 * padding);
    const y = height - padding - ((val - min) / range) * (height - 2 * padding);
    return `${x},${y}`;
  }).join(' ');

  const areaPoints = `${points} ${width - padding},${height - padding} ${padding},${height - padding}`;

  return (
    <div style={{ width: '100%', maxWidth: '400px' }}>
      <svg width="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(43, 59, 50, 0.06)" />
            <stop offset="100%" stopColor="rgba(43, 59, 50, 0)" />
          </linearGradient>
        </defs>
        <polygon points={areaPoints} fill="url(#revenueGradient)" />
        <polyline
          points={points}
          fill="none"
          stroke="var(--color-accent-positive)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {labels && (
          <>
            <text x={padding} y={height - 4} style={{ fontFamily: 'var(--font-display)', fontSize: '10px', fill: 'var(--color-ink-secondary)' }}>{labels[0]}</text>
            <text x={width - padding - 30} y={height - 4} style={{ fontFamily: 'var(--font-display)', fontSize: '10px', fill: 'var(--color-ink-secondary)' }}>{labels[labels.length - 1]}</text>
          </>
        )}
      </svg>
    </div>
  );
}
