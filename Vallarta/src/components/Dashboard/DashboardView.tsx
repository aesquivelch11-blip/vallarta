import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ScreenType } from '../../types';
import { sampleProperties } from '../PropertySelector/propertyData';
import { getDashboardData } from './dashboardData';
import DashboardGallery from './DashboardGallery';
import DashboardDomainNav, { Domain } from './DashboardDomainNav';
import DashboardToday from './DashboardToday';
import DashboardFinancials from './DashboardFinancials';
import DashboardOperations from './DashboardOperations';
import DashboardPerformance from './DashboardPerformance';
import DashboardErrorBoundary from './DashboardErrorBoundary';
import DarkModeToggle from './DarkModeToggle';
import { AmbientProvider } from './AmbientColorProvider';
import { motion } from 'motion/react';

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
        return <DashboardToday data={data} propertyName={property.name} propertyLocation={property.location} onNavigate={onNavigate} onDomainChange={setActiveDomain} />;
      case 'financials':
        return <DashboardFinancials data={data} onNavigate={onNavigate} />;
      case 'tasks':
        return <DashboardOperations data={data} onNavigate={onNavigate} />;
      case 'performance':
        return <DashboardPerformance data={data} />;
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
        <DashboardGallery images={property.images} propertyId={property.id} propertyName={property.name} />
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
          {/* Dashboard header — back + toggle + menu */}
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

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <DarkModeToggle />
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
          </div>

          {/* Mobile: domain pill above content */}
          <div className="lg:hidden">
            <DashboardDomainNav active={activeDomain} onChange={setActiveDomain} />
          </div>

          {/* Domain content + vertical strip (desktop wraps both) */}
          <div
            style={{
              display: 'flex',
              flex: 1,
              overflow: 'hidden',
            }}
          >
            {/* Desktop vertical domain strip */}
            <div className="hidden lg:block">
              <DashboardDomainNav active={activeDomain} onChange={setActiveDomain} />
            </div>

            {/* Domain content */}
            <div style={{ flex: 1, overflowY: activeDomain === 'today' ? 'hidden' : 'auto', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
              <DashboardErrorBoundary>
                <motion.div
                  key={activeDomain}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1], staggerChildren: 0.03 }}
                >
                  <AmbientProvider value={data.ambientColors}>
                    {renderDomain()}
                  </AmbientProvider>
                </motion.div>
              </DashboardErrorBoundary>
            </div>
          </div>
        </div>

        {/* Right panel — gallery, desktop only */}
        <div
          className="hidden lg:flex lg:flex-col"
          style={{ height: '100dvh', position: 'sticky', top: 0 }}
        >
          {/* Gallery — now fills full height with property name overlay */}
          <div style={{ flex: 1, minHeight: 0 }}>
            <DashboardGallery images={property.images} propertyId={property.id} propertyName={property.name} />
          </div>
        </div>
      </div>
    </div>
  );
}
