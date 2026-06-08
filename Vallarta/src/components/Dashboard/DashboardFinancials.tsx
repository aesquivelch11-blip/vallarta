import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { ScreenType } from '../../types';
import { DashboardData, formatCurrency, formatTrendPercent, getTrendDirection } from './dashboardData';
import MetricCard from './MetricCard';

interface DashboardFinancialsProps {
  data: DashboardData;
  onNavigate: (screen: ScreenType, style: 'push' | 'push_back' | 'slide_up') => void;
}

export default function DashboardFinancials({ data, onNavigate }: DashboardFinancialsProps) {
  const [selectedPeriodIndex, setSelectedPeriodIndex] = useState(0);

  const { periods, expenseBreakdown } = data;
  const period = periods[selectedPeriodIndex];
  const prevPeriod = periods[selectedPeriodIndex + 1];
  const net = period.revenue - period.expenses;

  const prevNet = prevPeriod
    ? prevPeriod.revenue - prevPeriod.expenses
    : net;

  const revenueTrend = prevPeriod
    ? { value: formatTrendPercent(period.revenue, prevPeriod.revenue), direction: getTrendDirection(period.revenue, prevPeriod.revenue) }
    : undefined;

  const expenseTrend = prevPeriod
    ? { value: formatTrendPercent(period.expenses, prevPeriod.expenses), direction: getTrendDirection(period.expenses, prevPeriod.expenses) }
    : undefined;

  const netTrend = prevPeriod
    ? { value: formatTrendPercent(net, prevNet), direction: getTrendDirection(net, prevNet) }
    : undefined;

  const revenueHistory = [...periods].reverse().map(p => p.revenue);
  const expenseHistory = [...periods].reverse().map(p => p.expenses);

  const totalExpenses = expenseBreakdown.reduce((sum, e) => sum + e.amount, 0);
  const maxExpense = Math.max(...expenseBreakdown.map(e => e.amount));

  const goPrevPeriod = () => {
    setSelectedPeriodIndex(prev => Math.min(prev + 1, periods.length - 1));
  };

  const goNextPeriod = () => {
    setSelectedPeriodIndex(prev => Math.max(prev - 1, 0));
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        padding: 'clamp(2rem, 4vw, 3rem) clamp(1.5rem, 3vw, 2.5rem)',
      }}
    >
      {/* Period selector */}
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: 'clamp(1.5rem, 3vw, 2.5rem)',
        }}
      >
        <button
          onClick={goPrevPeriod}
          disabled={selectedPeriodIndex >= periods.length - 1}
          aria-label="Previous period"
          style={{
            background: 'none',
            border: 'none',
            padding: '2px',
            cursor: selectedPeriodIndex >= periods.length - 1 ? 'default' : 'pointer',
            color: selectedPeriodIndex >= periods.length - 1 ? 'var(--color-border-medium)' : 'var(--color-ink-secondary)',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <ChevronLeft size={14} strokeWidth={1.5} />
        </button>
        <span
          style={{
            fontFamily: 'var(--font-ui)',
            fontSize: '0.75rem',
            fontWeight: 400,
            color: 'var(--color-ink)',
            letterSpacing: '0.02em',
            userSelect: 'none',
          }}
        >
          {period.label}
        </span>
        <button
          onClick={goNextPeriod}
          disabled={selectedPeriodIndex <= 0}
          aria-label="Next period"
          style={{
            background: 'none',
            border: 'none',
            padding: '2px',
            cursor: selectedPeriodIndex <= 0 ? 'default' : 'pointer',
            color: selectedPeriodIndex <= 0 ? 'var(--color-border-medium)' : 'var(--color-ink-secondary)',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <ChevronRight size={14} strokeWidth={1.5} />
        </button>
      </div>

      {/* Metric grid: revenue + expenses + net */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 'clamp(16px, 3vw, 32px)',
          marginBottom: 'clamp(2rem, 4vw, 3rem)',
        }}
      >
        <MetricCard
          label="Revenue"
          value={formatCurrency(period.revenue)}
          trend={revenueTrend}
          sparkline={revenueHistory}
          sparklineColor="var(--color-accent-positive)"
          valueSize="clamp(1.25rem, 2.5vw, 1.75rem)"
        />
        <MetricCard
          label="Expenses"
          value={formatCurrency(period.expenses)}
          trend={expenseTrend}
          sparkline={expenseHistory}
          sparklineColor="var(--color-ink-muted)"
          valueFont="ui"
          valueSize="clamp(1rem, 2vw, 1.375rem)"
        />
        <MetricCard
          label="Net"
          value={formatCurrency(net)}
          trend={netTrend}
          valueSize="clamp(1.5rem, 3vw, 2.25rem)"
        />
      </div>

      {/* Divider */}
      <div style={{ height: '1px', background: 'var(--color-border-subtle)', marginBottom: 'clamp(1.5rem, 3vw, 2rem)' }} />

      {/* Expense breakdown */}
      <div style={{ marginBottom: 'auto' }}>
        <p
          style={{
            fontFamily: 'var(--font-ui)',
            fontSize: '0.5625rem',
            fontWeight: 500,
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            color: 'var(--color-ink-secondary)',
            margin: '0 0 16px',
          }}
        >
          Expense Breakdown
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {expenseBreakdown.map((item) => {
            const pct = totalExpenses > 0 ? (item.amount / totalExpenses) * 100 : 0;
            const barWidth = maxExpense > 0 ? (item.amount / maxExpense) * 100 : 0;

            return (
              <div
                key={item.label}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '90px 1fr auto',
                  alignItems: 'center',
                  gap: '12px',
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-ui)',
                    fontSize: '0.6875rem',
                    fontWeight: 400,
                    color: 'var(--color-ink)',
                    lineHeight: 1,
                  }}
                >
                  {item.label}
                </span>

                <div
                  style={{
                    height: '6px',
                    background: 'var(--color-border-subtle)',
                    borderRadius: '3px',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: `${barWidth}%`,
                      background: 'var(--color-ink-secondary)',
                      borderRadius: '3px',
                      opacity: 0.4,
                      transition: 'width 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                    }}
                  />
                </div>

                <span
                  style={{
                    fontFamily: 'var(--font-ui)',
                    fontSize: '0.625rem',
                    fontWeight: 400,
                    color: 'var(--color-ink-secondary)',
                    letterSpacing: '0.06em',
                    textAlign: 'right',
                    fontVariantNumeric: 'tabular-nums',
                    lineHeight: 1,
                  }}
                >
                  {formatCurrency(item.amount)}
                  <span style={{ opacity: 0.6, marginLeft: '4px' }}>
                    {pct.toFixed(0)}%
                  </span>
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Nav link */}
      <button
        onClick={() => onNavigate('reporting', 'push')}
        style={{
          marginTop: 'clamp(1.5rem, 3vw, 2rem)',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          fontFamily: 'var(--font-ui)',
          fontSize: '0.625rem',
          fontWeight: 500,
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color: 'var(--color-ink-secondary)',
          background: 'none',
          border: 'none',
          padding: 0,
          cursor: 'pointer',
          alignSelf: 'flex-start',
        }}
      >
        VIEW FINANCIALS
        <ArrowRight size={11} strokeWidth={1.5} />
      </button>
    </div>
  );
}
