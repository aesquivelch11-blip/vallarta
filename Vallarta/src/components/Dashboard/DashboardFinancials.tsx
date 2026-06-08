import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { ScreenType } from '../../types';
import { DashboardData, formatCurrency } from './dashboardData';

interface DashboardFinancialsProps {
  data: DashboardData;
  onNavigate: (screen: ScreenType, style: 'push' | 'push_back' | 'slide_up') => void;
}

export default function DashboardFinancials({ data, onNavigate }: DashboardFinancialsProps) {
  const [selectedPeriodIndex, setSelectedPeriodIndex] = useState(0);

  const { periods } = data;
  const period = periods[selectedPeriodIndex];
  const net = period.revenue - period.expenses;
  const isNegative = net < 0;

  const goPrevPeriod = () => {
    setSelectedPeriodIndex(prev => Math.min(prev + 1, periods.length - 1));
  };

  const goNextPeriod = () => {
    setSelectedPeriodIndex(prev => Math.max(prev - 1, 0));
  };

  const labelStyle: React.CSSProperties = {
    fontFamily: 'var(--font-ui)',
    fontSize: '0.5625rem',
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
          marginBottom: 'clamp(2rem, 4vw, 3rem)',
        }}
      >
        <button
          className="dashboard-focus"
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
          className="dashboard-focus"
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
          <ChevronRight size={14} strokeWidth={1.5} />
        </button>
      </div>

      {/* Revenue — supporting */}
      <div style={{ marginBottom: '16px' }}>
        <p style={labelStyle}>REVENUE</p>
        <p style={{ ...figureStyle, fontSize: 'clamp(1.25rem, 2.5vw, 1.75rem)', marginTop: '6px' }}>
          {formatCurrency(period.revenue)}
        </p>
      </div>

      {/* Expenses — subordinate (smaller + reduced opacity) */}
      <div style={{ marginBottom: 'clamp(1.5rem, 3vw, 2.5rem)' }}>
        <p style={{ ...labelStyle, opacity: 0.7 }}>EXPENSES</p>
        <p
          style={{
            ...figureStyle,
            fontSize: 'clamp(1rem, 2vw, 1.375rem)',
            marginTop: '6px',
            opacity: 0.75,
          }}
        >
          {formatCurrency(period.expenses)}
        </p>
      </div>

      {/* Divider */}
      <div style={{ height: '1px', background: 'var(--color-border-subtle)', marginBottom: 'clamp(1.5rem, 3vw, 2.5rem)' }} />

      {/* Net — dominant */}
      <div style={{ marginBottom: 'auto' }}>
        <p
          style={{
            ...labelStyle,
            fontSize: '0.625rem',
            letterSpacing: '0.32em',
          }}
        >
          NET
        </p>
        <p
          style={{
            ...figureStyle,
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            marginTop: '10px',
            color: isNegative ? 'oklch(53% 0.12 25)' : 'var(--color-ink)',
          }}
        >
          {formatCurrency(net)}
        </p>
      </div>

      {/* Nav link */}
      <button
        className="dashboard-link"
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
