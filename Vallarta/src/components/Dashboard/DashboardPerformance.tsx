import React from 'react';
import { DashboardData } from './dashboardData';
import RevenueTrajectoryChart from './RevenueTrajectoryChart';
import OccupancyHeatmap from './OccupancyHeatmap';

interface DashboardPerformanceProps {
  data: DashboardData;
}

export default function DashboardPerformance({ data }: DashboardPerformanceProps) {
  const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

  const occupancy30Day = Array.from({ length: 30 }, (_, i) => {
    const base = data.occupancy;
    const variance = Math.sin(i * 0.3) * 15;
    return Math.max(0, Math.min(100, Math.round(base + variance)));
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: 'clamp(2rem, 4vw, 3rem) clamp(1.5rem, 3vw, 2.5rem)', gap: 'clamp(2rem, 4vw, 3rem)', overflow: 'hidden' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.5625rem', fontWeight: 500, letterSpacing: '0.32em', textTransform: 'uppercase', color: 'var(--color-ink-secondary)', margin: 0 }}>
          REVENUE TREND
        </p>
        <RevenueTrajectoryChart data={data.revenueHistory} labels={labels} />
      </div>
      <div style={{ marginTop: 'auto' }}>
        <OccupancyHeatmap data={occupancy30Day} />
      </div>
    </div>
  );
}
