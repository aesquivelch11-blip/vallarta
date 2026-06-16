import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ScreenType } from '../../types';
import { DashboardData, formatCurrency, formatTrendPercent } from './dashboardData';

interface DashboardFinancialsProps {
  data: DashboardData;
  onNavigate: (screen: ScreenType, style: 'push' | 'push_back' | 'slide_up') => void;
}

const sectionVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      delay: i * 0.08,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  }),
};

const labelStyle: React.CSSProperties = {
  fontFamily: 'var(--font-ui)',
  fontSize: '0.6875rem',
  fontWeight: 500,
  letterSpacing: '0.28em',
  textTransform: 'uppercase',
  color: 'var(--color-ink-secondary)',
  margin: 0,
};

const figureStyle: React.CSSProperties = {
  fontFamily: 'var(--font-display)',
  fontWeight: 400,
  letterSpacing: '-0.01em',
  color: 'var(--color-ink)',
  margin: 0,
  lineHeight: 1,
};

export default function DashboardFinancials({ data, onNavigate }: DashboardFinancialsProps) {
  const [selectedPeriodIndex, setSelectedPeriodIndex] = useState(0);
  const { periods } = data;
  const period = periods[selectedPeriodIndex];
  const net = period.revenue - period.expenses;
  const isNegative = net < 0;

  const goPrevPeriod = () =>
    setSelectedPeriodIndex((prev) => Math.min(prev + 1, periods.length - 1));
  const goNextPeriod = () =>
    setSelectedPeriodIndex((prev) => Math.max(prev - 1, 0));

  const atFirst = selectedPeriodIndex <= 0;
  const atLast = selectedPeriodIndex >= periods.length - 1;

  const chevronBtnStyle = (disabled: boolean): React.CSSProperties => ({
    background: 'none',
    border: 'none',
    padding: '2px',
    cursor: disabled ? 'default' : 'pointer',
    color: 'var(--color-ink-secondary)',
    display: 'flex',
    alignItems: 'center',
    opacity: disabled ? 0.3 : 1,
    transition: 'opacity 0.15s ease',
  });

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        padding:
          'clamp(1.25rem, 2.5vw, 2rem) clamp(1.5rem, 3vw, 2.5rem) clamp(2rem, 4vw, 3rem)',
        gap: 'clamp(2rem, 4vw, 3rem)',
      }}
    >
      {/* Period selector */}
      <motion.div variants={sectionVariants} initial="hidden" animate="visible" custom={0}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <button
            className="dashboard-focus"
            onClick={goPrevPeriod}
            disabled={atLast}
            aria-label="Previous period"
            style={chevronBtnStyle(atLast)}
          >
            <ChevronLeft size={12} strokeWidth={1.5} />
          </button>
          <span
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '0.6875rem',
              fontWeight: 500,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: 'var(--color-ink)',
              userSelect: 'none',
            }}
          >
            {period.label}
          </span>
          <button
            className="dashboard-focus"
            onClick={goNextPeriod}
            disabled={atFirst}
            aria-label="Next period"
            style={chevronBtnStyle(atFirst)}
          >
            <ChevronRight size={12} strokeWidth={1.5} />
          </button>
        </div>
      </motion.div>

      {/* NET — dominant, shown first */}
      <motion.div variants={sectionVariants} initial="hidden" animate="visible" custom={1}>
        <p style={labelStyle}>NET</p>
        <p
          style={{
            ...figureStyle,
            fontSize: 'clamp(3.5rem, 7vw, 5rem)',
            marginTop: '8px',
            color: isNegative ? 'var(--color-accent-negative)' : 'var(--color-ink)',
          }}
        >
          {formatCurrency(net)}
        </p>
      </motion.div>

      {/* Revenue + Expenses — two-column grid, subordinate to NET */}
      <motion.div variants={sectionVariants} initial="hidden" animate="visible" custom={2}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 'clamp(1rem, 2vw, 1.5rem)',
            paddingTop: 'clamp(1rem, 2vw, 1.5rem)',
            borderTop: '1px solid var(--color-border-subtle)',
          }}
        >
          {/* Revenue — left column */}
          <div>
            <p style={labelStyle}>REVENUE</p>
            <p
              style={{
                ...figureStyle,
                fontSize: 'clamp(1.25rem, 2vw, 1.5rem)',
                marginTop: '6px',
              }}
            >
              {formatCurrency(period.revenue)}
            </p>
            {data.revenueHistory[selectedPeriodIndex] !== undefined && (
              <p
                style={{
                  fontFamily: 'var(--font-ui)',
  fontSize: '0.6875rem',
                  fontWeight: 400,
                  letterSpacing: '0.10em',
                  textTransform: 'uppercase',
                  color: 'var(--color-ink-muted)',
                  margin: '4px 0 0',
                }}
              >
                {formatTrendPercent(
                  period.revenue,
                  data.revenueHistory[selectedPeriodIndex] || period.revenue
                )}{' '}
                vs prior
              </p>
            )}
          </div>

          {/* Expenses — right column, recessive */}
          <div style={{ opacity: 0.65 }}>
            <p style={labelStyle}>EXPENSES</p>
            <p
              style={{
                ...figureStyle,
                fontSize: 'clamp(1rem, 1.75vw, 1.25rem)',
                marginTop: '6px',
                color: 'var(--color-ink-secondary)',
              }}
            >
              {formatCurrency(period.expenses)}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
