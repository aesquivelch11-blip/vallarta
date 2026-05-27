import React from 'react';
import { motion } from 'motion/react';
import { X, Menu, Phone, Sliders, Globe, LogOut } from 'lucide-react';
import { ScreenType } from '../types';
import bgImage from '../assets/Vallarta-coast.jpeg';

interface NavMenuViewProps {
  onNavigate: (screen: ScreenType, transitionStyle: 'push' | 'slide_up') => void;
  onClose: () => void;
  onNotify?: (message: string) => void;
}

interface MenuItem {
  id: string;
  label: string;
  subtitle: string;
  screen: ScreenType;
}

const menuItems: MenuItem[] = [
  {
    id: 'estates',
    label: 'THE ESTATES',
    subtitle: 'PORTFOLIO OVERVIEW & ASSET VALUATION',
    screen: 'reporting',
  },
  {
    id: 'performance',
    label: 'FINANCIAL PERFORMANCE',
    subtitle: 'YIELD & REVENUE VELOCITY',
    screen: 'deep_dive',
  },
  {
    id: 'operations',
    label: 'OPERATIONS',
    subtitle: 'OCCUPANCY & LIVE SUPERVISION',
    screen: 'camera_expanded',
  },
  {
    id: 'calendar',
    label: 'CALENDAR',
    subtitle: 'RESERVATIONS & TIMELINE',
    screen: 'calendar',
  },
];

export default function NavMenuView({ onNavigate, onClose, onNotify }: NavMenuViewProps) {
  return (
    <div className="relative w-full min-h-[100dvh] overflow-hidden font-sans" id="nav-menu-container">
      {/* Background Image */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${bgImage})` }}
      />

      {/* Uniform dark overlay — raised to 50% for WCAG AA compliance */}
      <div className="absolute inset-0 z-10 pointer-events-none bg-black/50" />

      {/* Gradient scrim — heavier at left where text lives */}
      <div
        className="absolute inset-0 z-20 pointer-events-none"
        style={{
          background:
            'linear-gradient(to right, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.10) 60%, transparent 100%)',
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
      <div className="relative z-30 w-full min-h-[100dvh] flex flex-col">
        {/* Top bar */}
        <header className="flex items-center justify-between px-8 md:px-14 pt-8 md:pt-12 shrink-0">
          {/* Hamburger — decorative, not interactive */}
          <div
            className="w-10 h-10 flex items-center justify-center rounded-full bg-black/30 backdrop-blur-md border border-white/20"
            aria-hidden="true"
          >
            <Menu className="w-5 h-5 text-white" strokeWidth={1.5} />
          </div>
          <h2
            className="text-[10px] md:text-[11px] tracking-[0.35em] text-white uppercase font-medium"
            id="nav-menu-brand"
            style={{ textShadow: '0 1px 4px rgba(0,0,0,0.6)' }}
          >
            Vallarta Estates
          </h2>
          <button
            aria-label="Close menu"
            id="nav-menu-close-btn"
            onClick={onClose}
            className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-black/30 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-black/45 transition-colors duration-300 cursor-pointer"
          >
            <X className="w-4 h-4 text-white" strokeWidth={1.5} />
          </button>
        </header>

        {/* Menu items — flex column, spacious */}
        <main className="flex-1 flex flex-col justify-center px-8 md:px-14" id="nav-menu-links-list">
          <div className="max-w-2xl space-y-14 md:space-y-16">
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
              >
                <motion.a
                  href="#"
                  id={`nav-link-${item.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate(item.screen, 'push');
                  }}
                  whileHover={{ x: 8 }}
                  transition={{ type: 'spring', stiffness: 280, damping: 22 }}
                  className="group block"
                >
                  <span
                    className="text-3xl md:text-4xl lg:text-5xl font-serif font-normal text-white group-hover:text-white/90 transition-colors duration-300 leading-[1.15]"
                    style={{ textShadow: '0 2px 8px rgba(0,0,0,0.55)' }}
                  >
                    {item.label}
                  </span>
                  <span
                    className="text-[11px] md:text-[12px] tracking-[0.25em] text-white/90 font-mono block mt-2.5 uppercase"
                    style={{ textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}
                  >
                    {item.subtitle}
                  </span>
                </motion.a>
              </motion.div>
            ))}
          </div>
        </main>

        {/* Bottom bar */}
        <footer className="shrink-0 px-8 md:px-14 pb-8 md:pb-10">
          <div className="flex items-end justify-between">
            <div className="space-y-4">
              <p
                className="text-[9px] tracking-[0.3em] text-white/80 uppercase font-medium"
                style={{ textShadow: '0 1px 3px rgba(0,0,0,0.4)' }}
              >
                Property Management
              </p>
              <div className="flex flex-wrap gap-x-6 gap-y-3 text-[11px] tracking-[0.15em] text-white/95">
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
                  onClick={() => onNavigate('login', 'push')}
                  className="flex items-center gap-2 py-1 hover:text-white transition-colors duration-200 cursor-pointer uppercase"
                  id="nav-foo-logout"
                >
                  <LogOut className="w-4 h-4 shrink-0" strokeWidth={1.5} />
                  Logout
                </button>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-3 text-white/90">
              <span className="text-sm font-serif">01</span>
              <div className="w-8 h-px bg-white/50" />
              <span className="text-sm font-serif">04</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
