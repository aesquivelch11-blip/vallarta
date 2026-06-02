import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { X, Phone, Sliders, Globe, LogOut } from 'lucide-react';
import { ScreenType } from '../types';
import bgImage from '../assets/Vallarta-coast-2.jpeg';

interface NavMenuViewProps {
  onNavigate: (screen: ScreenType, transitionStyle: 'push' | 'slide_up') => void;
  onClose: () => void;
  onNotify?: (message: string) => void;
  originScreen?: ScreenType;
}

interface MenuItem {
  id: string;
  label: string;
  subtitle: string;
  dataValue: string;
  screen: ScreenType;
  weight: 'primary' | 'secondary';
}

const menuItems: MenuItem[] = [
  {
    id: 'estates',
    label: 'The Estates',
    subtitle: 'Portfolio Overview',
    dataValue: '4 Active Stays',
    screen: 'reporting',
    weight: 'primary',
  },
  {
    id: 'performance',
    label: 'Financial Performance',
    subtitle: 'Yield Revenue',
    dataValue: '$12.4K MTD',
    screen: 'deep_dive',
    weight: 'secondary',
  },
  {
    id: 'operations',
    label: 'Operations',
    subtitle: 'Live Supervision',
    dataValue: '2 Cameras Online',
    screen: 'camera_expanded',
    weight: 'secondary',
  },
  {
    id: 'calendar',
    label: 'Calendar',
    subtitle: 'Reservations',
    dataValue: '3 Arrivals This Week',
    screen: 'calendar',
    weight: 'primary',
  },
];

export default function NavMenuView({ onNavigate, onClose, onNotify, originScreen }: NavMenuViewProps) {
  const [logoutPending, setLogoutPending] = useState(false);
  const logoutTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleLogoutClick = () => {
    if (logoutPending) {
      if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);
      setLogoutPending(false);
      onNavigate('login', 'push');
    } else {
      setLogoutPending(true);
      onNotify?.('Tap again to confirm logout');
      logoutTimerRef.current = setTimeout(() => {
        setLogoutPending(false);
      }, 3000);
    }
  };

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    return () => {
      if (logoutTimerRef.current) {
        clearTimeout(logoutTimerRef.current);
      }
    };
  }, []);

  return (
    <div className="relative w-full min-h-[100dvh] overflow-hidden font-sans" id="nav-menu-container">
      {/* Background Image */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${bgImage})` }}
      />

      {/* Uniform dark overlay — WCAG AA compliant, warm-tinted OKLCH */}
      <div className="absolute inset-0 z-10 pointer-events-none" style={{ background: 'var(--nav-overlay-base)' }} />

      {/* Gradient scrim — heavier at right where text lives */}
      <div
        className="absolute inset-0 z-20 pointer-events-none"
        style={{
          background:
            'linear-gradient(to left, var(--nav-scrim-dark) 0%, var(--nav-scrim-mid) 60%, transparent 100%)',
        }}
      />

      {/* Grain texture */}
      <div
        className="absolute inset-0 z-30 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Full-height flex column */}
      <div className="relative z-30 w-full h-[100dvh] flex flex-col">
        {/* Top bar */}
        <header className="flex items-center justify-end gap-8 px-6 md:px-16 lg:px-24 pt-10 md:pt-16 shrink-0">
          <p
            className="text-[10px] md:text-[11px] tracking-[0.35em] text-white uppercase font-medium"
            id="nav-menu-brand"
            style={{ textShadow: 'var(--nav-text-shadow-base)' }}
          >
            Vallarta Estates
          </p>
          <button
            aria-label="Close menu"
            id="nav-menu-close-btn"
            onClick={onClose}
            className="nav-close-btn w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4 text-white" strokeWidth={1.5} />
          </button>
        </header>

        {/* Menu items — flex column, spacious */}
        <main className="flex-1 flex flex-col items-center md:items-end px-10 md:px-20 lg:px-28 md:pr-24 pt-6 md:pt-12" id="nav-menu-links-list">
          <div className="max-w-2xl space-y-16 md:space-y-20 text-center md:text-right">
            {menuItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: 0.08 * index,
                  ease: [0.16, 1, 0.3, 1],
                }}
                onHoverStart={() => setHoveredIndex(index)}
                onHoverEnd={() => setHoveredIndex(null)}
              >
                <motion.button
                  id={`nav-link-${item.id}`}
                  onClick={() => {
                    if (item.screen !== originScreen) onNavigate(item.screen, 'push');
                  }}
                  whileHover={item.screen !== originScreen ? { x: -8 } : {}}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className={`group block w-full bg-transparent border-none p-0 cursor-pointer ${
                    item.screen === originScreen ? 'opacity-40 pointer-events-none cursor-default' : ''
                  }`}
                >
                    <span
                     className={`font-sans font-light text-white group-hover:text-white/90 transition-colors duration-300 leading-[1.15] tracking-[0.02em] ${item.weight === 'primary' ? 'text-[2.25rem] md:text-[3.5rem] lg:text-[4.5rem]' : 'text-[1.75rem] md:text-[2.75rem] lg:text-[3.5rem] opacity-75'}`}
                    style={{ textShadow: 'var(--nav-text-shadow-strong)' }}
                  >
                    {item.label}
                  </span>
                  <div className={`relative h-[1.2em] ${item.weight === 'primary' ? 'mt-4' : 'mt-3'}`}>
                    <span
                      className="absolute inset-0 text-[11px] md:text-[12px] tracking-[0.25em] text-white/90 font-sans uppercase leading-none transition-opacity duration-300"
                      style={{ textShadow: 'var(--nav-text-shadow-base)', opacity: hoveredIndex === index ? 0 : 1 }}
                    >
                      {item.subtitle}
                    </span>
                    <span
                      className="absolute inset-0 text-[11px] md:text-[12px] tracking-[0.25em] text-white/90 font-sans uppercase leading-none transition-opacity duration-300"
                      style={{ textShadow: 'var(--nav-text-shadow-base)', opacity: hoveredIndex === index ? 1 : 0 }}
                    >
                      {item.dataValue}
                    </span>
                  </div>
                </motion.button>
              </motion.div>
            ))}
          </div>
        </main>

        {/* Bottom bar */}
        <footer className="shrink-0 px-6 md:px-16 lg:px-24 pb-10 md:pb-16">
          <div className="flex items-end justify-center md:justify-end gap-8">
            <div className="space-y-6">
              <p
                className="text-[10px] tracking-[0.3em] text-white/80 uppercase font-medium"
                style={{ textShadow: 'var(--nav-text-shadow-base)' }}
              >
                Property Management
              </p>
              <div className="flex flex-wrap gap-x-8 gap-y-4 text-[11px] tracking-[0.15em] text-white/95">
                <button
                  onClick={() =>
                    onNotify
                      ? onNotify('Support concierge: concierge@vallarta-estates.com')
                      : alert('Support concierge: concierge@vallarta-estates.com')
                  }
                  className="flex items-center gap-2 py-1 hover:text-white transition-colors duration-200 cursor-pointer uppercase"
                  id="nav-foo-contact"
                >
                  <Phone className="w-4 h-4 shrink-0" strokeWidth={1.5} />
                  Contact
                </button>
                <button
                  onClick={() =>
                    onNotify
                      ? onNotify('System telemetry functioning securely.')
                      : alert('System telemetry functioning securely.')
                  }
                  className="flex items-center gap-2 py-1 hover:text-white transition-colors duration-200 cursor-pointer uppercase"
                  id="nav-foo-settings"
                >
                  <Sliders className="w-4 h-4 shrink-0" strokeWidth={1.5} />
                  Settings
                </button>
                <a
                  href="https://images.unsplash.com/photo-1613977257363-707ba9348227"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 py-1 hover:text-white transition-colors duration-200 uppercase"
                  id="nav-foo-website"
                >
                  <Globe className="w-4 h-4 shrink-0" strokeWidth={1.5} />
                  Website
                </a>
                <button
                  onClick={handleLogoutClick}
                  className={`flex items-center gap-2 py-1 transition-colors duration-200 cursor-pointer uppercase ${
                    logoutPending ? 'text-white' : 'hover:text-white'
                  }`}
                  id="nav-foo-logout"
                >
                  <LogOut className="w-4 h-4 shrink-0" strokeWidth={1.5} />
                  {logoutPending ? 'Confirm?' : 'Logout'}
                </button>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-3 text-white/90 transition-opacity duration-200">
              <span className="text-sm font-sans tabular-nums">
                {hoveredIndex !== null ? String(hoveredIndex + 1).padStart(2, '0') : '—'}
              </span>
              <div className="w-8 h-px bg-white/50" />
              <span className="text-sm font-sans tabular-nums">{String(menuItems.length).padStart(2, '0')}</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
