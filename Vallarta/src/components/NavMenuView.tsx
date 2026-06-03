import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { X, LogOut } from 'lucide-react';
import { ScreenType } from '../types';

interface NavMenuViewProps {
  onNavigate: (screen: ScreenType, transitionStyle: 'push' | 'slide_up') => void;
  onClose: () => void;
  onNotify?: (message: string) => void;
}

interface MenuItem {
  id: string;
  label: string;
  subtitle: string;
  dataValue: string;
  screen: ScreenType;
  bgVar: string;
  glowVar: string;
  index: string;
}

const menuItems: MenuItem[] = [
  {
    id: 'estates',
    label: 'The Estates',
    subtitle: 'Portfolio Overview',
    dataValue: '4 Active Stays',
    screen: 'reporting',
    bgVar: '--nav-card-estates-bg',
    glowVar: '--nav-card-estates-glow',
    index: '01',
  },
  {
    id: 'financial',
    label: 'Financial',
    subtitle: 'Yield Revenue',
    dataValue: '$12.4K MTD',
    screen: 'deep_dive',
    bgVar: '--nav-card-financial-bg',
    glowVar: '--nav-card-financial-glow',
    index: '02',
  },
  {
    id: 'operations',
    label: 'Operations',
    subtitle: 'Live Supervision',
    dataValue: '2 Cameras Online',
    screen: 'camera_expanded',
    bgVar: '--nav-card-operations-bg',
    glowVar: '--nav-card-operations-glow',
    index: '03',
  },
  {
    id: 'calendar',
    label: 'Calendar',
    subtitle: 'Reservations',
    dataValue: '3 Arrivals This Week',
    screen: 'calendar',
    bgVar: '--nav-card-calendar-bg',
    glowVar: '--nav-card-calendar-glow',
    index: '04',
  },
];

export default function NavMenuView({ onNavigate, onClose, onNotify }: NavMenuViewProps) {
  const [logoutPending, setLogoutPending] = useState(false);
  const logoutTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);
    };
  }, []);

  const handleLogoutClick = () => {
    if (logoutPending) {
      if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);
      setLogoutPending(false);
      onNavigate('login', 'push');
    } else {
      setLogoutPending(true);
      onNotify?.('Tap again to confirm logout');
      logoutTimerRef.current = setTimeout(() => setLogoutPending(false), 3000);
    }
  };

  return (
    <div className="relative w-full h-[100dvh] overflow-hidden">
      {/* Header — floats above all panels */}
      <header className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-6 md:px-16 pt-10 md:pt-16">
        <p
          className="text-[0.6875rem] font-medium tracking-[0.35em] text-white/90 uppercase"
          style={{ fontFamily: 'var(--font-ui)', textShadow: 'var(--nav-text-shadow-base)' }}
        >
          Vallarta Estates
        </p>
        <div className="flex items-center gap-6">
          <button
            onClick={handleLogoutClick}
            className={`flex items-center gap-2 text-[0.6875rem] tracking-[0.15em] uppercase transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-white/40 rounded-sm cursor-pointer ${
              logoutPending ? 'text-white' : 'text-white/50 hover:text-white'
            }`}
            style={{ fontFamily: 'var(--font-ui)', textShadow: 'var(--nav-text-shadow-base)' }}
            aria-label={logoutPending ? 'Confirm logout' : 'Logout'}
          >
            <LogOut className="w-3.5 h-3.5 shrink-0" strokeWidth={1.5} />
            {logoutPending ? 'Confirm?' : 'Logout'}
          </button>
          <button
            aria-label="Close menu"
            onClick={onClose}
            className="nav-close-btn w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
          >
            <X className="w-4 h-4 text-white" strokeWidth={1.5} />
          </button>
        </div>
      </header>

      {/* 4-panel grid — flex expansion handled entirely by CSS hover */}
      <div className="nav-card-grid flex w-full h-full">
        {menuItems.map((item, index) => (
          <div
            key={item.id}
            className="nav-panel relative h-full overflow-hidden cursor-pointer border-r border-white/[0.06] last:border-r-0 outline-none focus-within:ring-inset focus-within:ring-2 focus-within:ring-white/40"
            style={{
              flex: 1,
              background: `var(${item.bgVar})`,
            }}
          >
            {/* Ambient glow */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `radial-gradient(ellipse 120% 45% at 50% 0%, var(${item.glowVar}) 0%, transparent 70%)`,
              }}
            />

            {/* Clickable / focusable button covers the full panel */}
            <button
              className="absolute inset-0 w-full h-full bg-transparent border-none outline-none focus-visible:ring-inset focus-visible:ring-2 focus-visible:ring-white/40 cursor-pointer"
              onClick={() => onNavigate(item.screen, 'push')}
              aria-label={item.label}
              tabIndex={0}
            />

            {/* Mount stagger animation */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: 0.08 * index,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              {/* Bottom-anchored content */}
              <div className="absolute bottom-0 left-0 right-0 p-[clamp(1.5rem,5vh,3.5rem)]">
                <span
                  className="block text-[0.625rem] tracking-[0.3em] text-white/40 mb-3"
                  style={{ fontFamily: 'var(--font-ui)', textShadow: 'var(--nav-text-shadow-base)' }}
                >
                  {item.index}
                </span>

                <span
                  className="nav-panel__title text-[clamp(1.75rem,3vw,3.5rem)] font-light leading-[1.1] text-white/90 mb-4"
                  style={{
                    fontFamily: 'var(--font-display)',
                    textShadow: 'var(--nav-card-text-shadow)',
                  }}
                >
                  {item.label}
                </span>

                {/* Subtitle / dataValue crossfade */}
                <div className="relative h-[1.4em] mt-4">
                  <span
                    className="nav-panel__subtitle absolute inset-0 text-[0.6875rem] tracking-[0.2em] text-white/60 uppercase leading-none"
                    style={{ fontFamily: 'var(--font-ui)' }}
                  >
                    {item.subtitle}
                  </span>
                  <span
                    className="nav-panel__data absolute inset-0 text-[0.6875rem] tracking-[0.2em] text-white/60 uppercase leading-none"
                    style={{ fontFamily: 'var(--font-ui)' }}
                  >
                    {item.dataValue}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        ))}
      </div>
    </div>
  );
}
