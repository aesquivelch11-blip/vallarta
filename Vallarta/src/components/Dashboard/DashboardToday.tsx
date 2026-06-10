import React from 'react';
import { ArrowRight } from 'lucide-react';
import { ScreenType } from '../../types';
import { Domain } from './DashboardDomainNav';
import { DashboardData, formatCurrency, formatTrendPercent, getTrendDirection } from './dashboardData';
import PropertyTitleCard from './PropertyTitleCard';
import PropertyHealthScore from './PropertyHealthScore';
import MetricGrid from './MetricGrid';
import GuestFlowStrip from './GuestFlowStrip';
import UrgentAlert from './UrgentAlert';

interface DashboardTodayProps {
  data: DashboardData;
  propertyName: string;
  propertyLocation: string;
  onNavigate: (screen: ScreenType, style: 'push' | 'push_back' | 'slide_up') => void;
  onDomainChange?: (domain: Domain) => void;
}

export default function DashboardToday({ data, propertyName, propertyLocation, onNavigate, onDomainChange }: DashboardTodayProps) {
  const currentPeriod = data.periods[0];
  const prevPeriod = data.periods[1];
  const netIncome = currentPeriod.revenue - currentPeriod.expenses;
  const revTrend = formatTrendPercent(currentPeriod.revenue, prevPeriod?.revenue ?? currentPeriod.revenue);
  const revDirection = getTrendDirection(currentPeriod.revenue, prevPeriod?.revenue ?? currentPeriod.revenue);
  const occTrend = formatTrendPercent(data.occupancy, data.occupancyPrev);
  const occDirection = getTrendDirection(data.occupancy, data.occupancyPrev);
  const urgentTask = data.tasks.find(t => t.status === 'urgent') ?? null;

  const healthScore = Math.round(
    (data.occupancy * 0.4) + (data.guestSatisfaction.score * 10 * 0.3) + (Math.min(currentPeriod.revenue / data.budgetTarget, 1) * 100 * 0.3)
  );

  const metrics = [
    {
      label: 'Revenue MTD',
      value: currentPeriod.revenue,
      formatter: formatCurrency,
      trend: revTrend,
      trendDirection: revDirection,
      sparklineData: data.revenueHistory,
    },
    {
      label: 'Occupancy',
      value: data.occupancy,
      formatter: (n: number) => `${Math.round(n)}%`,
      trend: occTrend,
      trendDirection: occDirection,
      sparklineData: data.occupancyHistory,
    },
    {
      label: 'Satisfaction',
      value: data.guestSatisfaction.score,
      formatter: (n: number) => n.toFixed(1),
      sparklineData: [4.2, 4.4, 4.5, 4.6, 4.7, data.guestSatisfaction.score],
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '0 clamp(1.5rem, 3vw, 2.5rem) clamp(1.5rem, 3vw, 2rem)', gap: 'clamp(1rem, 2vw, 1.5rem)', overflow: 'hidden', justifyContent: 'flex-start' }}>
      {/* Zone A: Hero Snapshot - 40% */}
      <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 'clamp(1.5rem, 3vw, 2.5rem)', minHeight: 0 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <PropertyTitleCard name={propertyName} location={propertyLocation} />
          <PropertyHealthScore score={healthScore} />
        </div>
        <MetricGrid metrics={metrics} />
      </div>

      {/* Divider */}
      <div style={{ height: '1px', background: 'var(--color-border-subtle)', flexShrink: 0 }} />

      {/* Zone B: Guest Flow - 25% */}
      <GuestFlowStrip
        arrivals={data.arrivalsToday}
        departures={data.departuresToday}
        arrivalsTomorrow={data.arrivalsTomorrow}
        departuresTomorrow={data.departuresTomorrow}
      />

      {/* Divider */}
      <div style={{ height: '1px', background: 'var(--color-border-subtle)', flexShrink: 0 }} />

      {/* Zone C: Urgent + Nav - 20% */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: 'auto' }}>
        <UrgentAlert task={urgentTask} />
        <div style={{ display: 'flex', gap: '24px' }}>
          <button className="dashboard-link" onClick={() => onNavigate('calendar', 'push')} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontFamily: 'var(--font-ui)', fontSize: '0.5625rem', fontWeight: 500, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--color-ink-secondary)', background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}>
            Calendar <ArrowRight size={10} strokeWidth={1.5} />
          </button>
          {onDomainChange && (
            <button className="dashboard-link" onClick={() => onDomainChange('financials')} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontFamily: 'var(--font-ui)', fontSize: '0.5625rem', fontWeight: 500, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--color-ink-secondary)', background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}>
              Financials <ArrowRight size={10} strokeWidth={1.5} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
