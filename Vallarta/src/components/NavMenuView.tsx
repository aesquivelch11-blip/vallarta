import React from 'react';
import { ScreenType } from '../types';
import menuImg1 from '../assets/Menu/menu-1.jpg';
import menuImg2 from '../assets/Menu/menu-2.jpg';
import menuImg3 from '../assets/Menu/menu-3.jpg';
import menuImg4 from '../assets/Menu/menu-4.jpg';

interface NavMenuViewProps {
  onNavigate: (screen: ScreenType, transitionStyle: 'push' | 'slide_up') => void;
  onClose: () => void;
  onNotify?: (message: string) => void;
}

const menuItems = [
  { id: 'estates',   label: 'The Estates',          subtitle: 'Portfolio Overview', screen: 'reporting'        as ScreenType, index: '01', image: menuImg1 },
  { id: 'financial', label: 'Financial Performance', subtitle: 'Yield & Revenue',   screen: 'deep_dive'        as ScreenType, index: '02', image: menuImg2 },
  { id: 'operations',label: 'Operations',            subtitle: 'Live Supervision',  screen: 'camera_expanded'  as ScreenType, index: '03', image: menuImg3 },
  { id: 'calendar',  label: 'Calendar',              subtitle: 'Scheduling',        screen: 'calendar'         as ScreenType, index: '04', image: menuImg4 },
];

export default function NavMenuView({ onNavigate, onClose }: NavMenuViewProps) {
  return (
    <div
      className="relative w-full h-[100dvh] overflow-hidden"
      style={{ background: '#090806' }}
    >
      {/* ── Header ── */}
      <header
        className="nav-header absolute top-0 left-0 right-0 z-[100] flex items-center justify-between"
        style={{ height: '80px', padding: '0 44px' }}
      >
        <span
          style={{
            fontFamily: 'var(--nav-font-label)',
            fontSize: '10px',
            fontWeight: 300,
            letterSpacing: '5px',
            color: 'rgba(255,255,255,0.5)',
            textTransform: 'uppercase',
          }}
        >
          Vallarta Estates
        </span>

        <button
          aria-label="Close menu"
          onClick={onClose}
          className="nav-close-btn"
        >
          ✕
        </button>
      </header>

      {/* ── 4-panel grid ── */}
      <div className="nav-card-grid absolute inset-0 flex flex-row">
        {menuItems.map((item) => (
          <div
            key={item.id}
            className="nav-panel relative h-full overflow-hidden border-r last:border-r-0 outline-none"
            style={{ borderColor: 'rgba(255,255,255,0.05)' }}
          >
            {/* Full-bleed photo */}
            <img
              src={item.image}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            />

            {/* Dark vignette — top and bottom */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                zIndex: 2,
                background: `
                  linear-gradient(to bottom, rgba(5,4,3,0.35) 0%, transparent 20%),
                  linear-gradient(to top, rgba(5,4,3,0.88) 0%, rgba(5,4,3,0.42) 36%, rgba(5,4,3,0.08) 65%, transparent 100%)
                `,
              }}
            />

            {/* Veil — dims on sibling hover */}
            <div className="nav-card-veil" />

            {/* Gold bottom sweep line */}
            <div className="nav-card-line" />

            {/* Full-panel click target */}
            <button
              className="absolute inset-0 w-full h-full bg-transparent border-none outline-none focus-visible:ring-inset focus-visible:ring-2 focus-visible:ring-white/40 cursor-pointer"
              style={{ zIndex: 5 }}
              onClick={() => onNavigate(item.screen, 'push')}
              aria-label={`Navigate to ${item.label}`}
              tabIndex={0}
            />

            {/* Bottom-anchored content */}
            <div className="nav-card-content">
              <span
                style={{
                  display: 'block',
                  fontFamily: 'var(--nav-font-label)',
                  fontSize: '9px',
                  fontWeight: 300,
                  letterSpacing: '4px',
                  color: '#c9a96e',
                  marginBottom: '14px',
                }}
              >
                {item.index}
              </span>

              <span
                style={{
                  display: 'block',
                  fontFamily: 'var(--nav-font-display)',
                  fontSize: 'clamp(22px, 2.5vw, 42px)',
                  fontWeight: 300,
                  color: '#fff',
                  lineHeight: 1,
                  letterSpacing: '0.3px',
                  marginBottom: '11px',
                  textWrap: 'pretty' as React.CSSProperties['textWrap'],
                }}
              >
                {item.label}
              </span>

              <span className="nav-panel__subtitle">
                {item.subtitle}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
