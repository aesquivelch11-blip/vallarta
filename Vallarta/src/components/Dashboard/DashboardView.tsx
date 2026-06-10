import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ScreenType } from '../../types';
import { sampleProperties } from '../PropertySelector/propertyData';
import { getDashboardData } from './dashboardData';
import DashboardGallery from './DashboardGallery';
import DashboardDomainNav, { Domain } from './DashboardDomainNav';
import DashboardToday from './DashboardToday';
import DashboardFinancials from './DashboardFinancials';
import DashboardTasks from './DashboardTasks';
import DashboardErrorBoundary from './DashboardErrorBoundary';

interface DashboardViewProps {
  propertyId: string | null;
  onNavigate: (screen: ScreenType, style: 'push' | 'push_back' | 'slide_up') => void;
  onNotify?: (message: string) => void;
}

export default function DashboardView({ propertyId, onNavigate, onNotify }: DashboardViewProps) {
  const [activeDomain, setActiveDomain] = useState<Domain>('today');
  const [isLoading, setIsLoading] = useState(true);

  const headerBtnStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '5px',
    background: 'none',
    border: 'none',
    padding: '8px 0',
    cursor: 'pointer',
    fontFamily: 'var(--font-ui)',
    fontSize: '0.5625rem',
    fontWeight: 500,
    letterSpacing: '0.22em',
    textTransform: 'uppercase',
    color: 'var(--color-ink-secondary)',
  };

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  const property = sampleProperties.find(p => p.id === propertyId) ?? sampleProperties[0];
  const data = getDashboardData(property.id);

  const renderDomain = () => {
    switch (activeDomain) {
      case 'today':
        return <DashboardToday data={data} onNavigate={onNavigate} onDomainChange={setActiveDomain} />;
      case 'financials':
        return <DashboardFinancials data={data} onNavigate={onNavigate} />;
      case 'tasks':
        return <DashboardTasks data={data} onNavigate={onNavigate} />;
    }
  };

  if (isLoading) {
    return (
      <div
        className="w-full"
        style={{
          minHeight: '100dvh',
          background: 'var(--color-canvas)',
          display: 'grid',
          gridTemplateColumns: '1fr',
          gridTemplateRows: 'auto 1fr',
        }}
      >
        {/* Mobile skeleton */}
        <div
          className="lg:hidden"
          style={{
            height: 'clamp(180px, 30vw, 220px)',
            background: 'var(--color-border-subtle)',
            opacity: 0.5,
          }}
        />
        <div
          style={{
            display: 'grid',
            gridTemplateRows: 'auto 1fr',
          }}
          className="grid-cols-1 lg:grid-cols-[58fr_42fr] lg:h-[100dvh]"
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              padding: 'clamp(2rem, 4vw, 3rem) clamp(1.5rem, 3vw, 2.5rem)',
              gap: '16px',
            }}
          >
            {/* Skeleton lines */}
            <div style={{
              width: '40%',
              height: 'clamp(2rem, 4vw, 3rem)',
              background: 'var(--color-border-subtle)',
              borderRadius: '4px',
              opacity: 0.6,
            }} />
            <div style={{
              width: '60%',
              height: '1rem',
              background: 'var(--color-border-subtle)',
              borderRadius: '4px',
              opacity: 0.4,
            }} />
            <div style={{
              width: '50%',
              height: '1rem',
              background: 'var(--color-border-subtle)',
              borderRadius: '4px',
              opacity: 0.4,
            }} />
            <div style={{
              width: '30%',
              height: '0.75rem',
              background: 'var(--color-border-subtle)',
              borderRadius: '4px',
              opacity: 0.3,
              marginTop: '16px',
            }} />
          </div>
          <div
            className="hidden lg:block"
            style={{
              height: '100dvh',
              background: 'var(--color-border-subtle)',
              opacity: 0.3,
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div
      className="w-full"
      style={{
        minHeight: '100dvh',
        background: 'var(--color-canvas)',
        display: 'grid',
        gridTemplateColumns: '1fr',
        gridTemplateRows: 'auto 1fr',
      }}
    >
      {/* Mobile/Tablet gallery strip — visible below lg */}
      <div
        className="lg:hidden"
        style={{ height: 'clamp(180px, 30vw, 220px)' }}
      >
        <DashboardGallery images={property.images} />
      </div>

      {/* Mobile property name — visible below lg, above domain pill */}
      <div
        className="lg:hidden"
        style={{
          padding: 'clamp(1rem, 2vw, 1.5rem) clamp(1.5rem, 3vw, 2.5rem) 0',
        }}
      >
        <p
          style={{
            fontFamily: 'var(--font-display)',
            fontStyle: 'italic',
            fontWeight: 400,
            fontSize: 'clamp(1.125rem, 2.5vw, 1.375rem)',
            letterSpacing: '-0.01em',
            color: 'var(--color-ink)',
            margin: 0,
            lineHeight: 1.2,
          }}
        >
          {property.name}
        </p>
      </div>

      {/* Main area — on desktop becomes a two-column grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateRows: 'auto 1fr',
        }}
        className="grid-cols-1 lg:grid-cols-[58fr_42fr] lg:h-[100dvh]"
      >
        {/* Left panel */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          {/* Dashboard header — back + menu */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 clamp(1.5rem, 3vw, 2.5rem)',
              height: '52px',
              borderBottom: '1px solid var(--color-border-subtle)',
              flexShrink: 0,
            }}
          >
            <button
              className="dashboard-focus"
              onClick={() => onNavigate('property_selector', 'push_back')}
              style={headerBtnStyle}
              aria-label="Back to property selector"
            >
              <ChevronLeft size={12} strokeWidth={1.5} />
              Back
            </button>

            <button
              className="dashboard-focus"
              onClick={() => onNavigate('nav_menu', 'push')}
              style={headerBtnStyle}
              aria-label="Open navigation menu"
            >
              Menu
              <ChevronRight size={12} strokeWidth={1.5} />
            </button>
          </div>

          {/* Mobile: domain pill above content */}
          <DashboardDomainNav active={activeDomain} onChange={setActiveDomain} />

          {/* Domain content + vertical strip (desktop wraps both) */}
          <div
            style={{
              display: 'flex',
              flex: 1,
              overflow: 'hidden',
            }}
          >
            {/* Desktop vertical domain strip */}
            <DashboardDomainNav active={activeDomain} onChange={setActiveDomain} />

            {/* Domain content */}
            <div style={{ flex: 1, overflowY: activeDomain === 'today' ? 'hidden' : 'auto', display: 'flex', flexDirection: 'column' }}>
              <DashboardErrorBoundary>
                {renderDomain()}
              </DashboardErrorBoundary>
            </div>
          </div>
        </div>

        {/* Right panel — gallery, desktop only */}
        <div
          className="hidden lg:flex lg:flex-col"
          style={{ height: '100dvh', position: 'sticky', top: 0 }}
        >
          {/* Property name */}
          <div
            style={{
              padding: 'clamp(1.5rem, 3vw, 2.5rem) clamp(1.5rem, 3vw, 2.5rem) 0 clamp(1rem, 2vw, 1.75rem)',
            }}
          >
            <p
              style={{
                fontFamily: 'var(--font-display)',
                fontStyle: 'italic',
                fontWeight: 400,
                fontSize: 'clamp(1.25rem, 2vw, 1.625rem)',
                letterSpacing: '-0.01em',
                color: 'var(--color-ink)',
                margin: 0,
                lineHeight: 1.2,
              }}
            >
              {property.name}
            </p>
            <p
              style={{
                fontFamily: 'var(--font-ui)',
                fontWeight: 500,
                fontSize: '0.5625rem',
                letterSpacing: '0.25em',
                textTransform: 'uppercase',
                color: 'var(--color-ink-secondary)',
                margin: '6px 0 0',
                lineHeight: 1,
              }}
            >
              {property.location}
            </p>
          </div>

          {/* Gallery */}
          <div style={{ flex: 1, minHeight: 0 }}>
            <DashboardGallery images={property.images} />
          </div>
        </div>
      </div>
    </div>
  );
}
