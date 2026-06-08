import React, { useState } from 'react';
import { ScreenType } from '../../types';
import { sampleProperties } from '../PropertySelector/propertyData';
import { getDashboardData } from './dashboardData';
import DashboardGallery from './DashboardGallery';
import DashboardDomainNav, { Domain } from './DashboardDomainNav';
import DashboardToday from './DashboardToday';
import DashboardFinancials from './DashboardFinancials';
import DashboardTasks from './DashboardTasks';

interface DashboardViewProps {
  propertyId: string | null;
  onNavigate: (screen: ScreenType, style: 'push' | 'push_back' | 'slide_up') => void;
  onNotify?: (message: string) => void;
}

export default function DashboardView({ propertyId, onNavigate, onNotify }: DashboardViewProps) {
  const [activeDomain, setActiveDomain] = useState<Domain>('today');

  const property = sampleProperties.find(p => p.id === propertyId) ?? sampleProperties[0];
  const data = getDashboardData(property.id);

  const renderDomain = () => {
    switch (activeDomain) {
      case 'today':
        return <DashboardToday data={data} onNavigate={onNavigate} />;
      case 'financials':
        return <DashboardFinancials data={data} onNavigate={onNavigate} />;
      case 'tasks':
        return <DashboardTasks data={data} onNavigate={onNavigate} onNotify={onNotify} />;
    }
  };

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
            <div style={{ flex: 1, overflowY: 'auto' }}>
              {renderDomain()}
            </div>
          </div>
        </div>

        {/* Right panel — gallery, desktop only */}
        <div
          className="hidden lg:block"
          style={{ height: '100dvh', position: 'sticky', top: 0 }}
        >
          <DashboardGallery images={property.images} />
        </div>
      </div>
    </div>
  );
}
