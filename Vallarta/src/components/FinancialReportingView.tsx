import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, ArrowRight } from 'lucide-react';
import { ScreenType } from '../types';
import Apt1 from '../assets/Apt1.jpeg';
import Apt2 from '../assets/Apt2.jpeg';
import Apt3 from '../assets/Apt3.jpeg';
import W1 from '../assets/WhatsApp Image 2026-05-29 at 2.00.25 PM.jpeg';
import W2 from '../assets/WhatsApp Image 2026-05-29 at 2.00.27 PM.jpeg';
import W3 from '../assets/WhatsApp Image 2026-05-29 at 2.00.27 PM (1).jpeg';
import W4 from '../assets/WhatsApp Image 2026-05-29 at 2.00.27 PM (2).jpeg';
import W5 from '../assets/WhatsApp Image 2026-05-29 at 2.00.27 PM (3).jpeg';
import W6 from '../assets/WhatsApp Image 2026-05-29 at 2.00.28 PM.jpeg';

const HERO_SLIDES = [
  { src: Apt1, alt: 'Apartment 1 Interior' },
  { src: Apt2, alt: 'Apartment 2 Interior' },
  { src: Apt3, alt: 'Apartment 3 Interior' },
  { src: W1, alt: 'Exterior View 1' },
  { src: W2, alt: 'Exterior View 2' },
  { src: W3, alt: 'Exterior View 3' },
  { src: W4, alt: 'Exterior View 4' },
  { src: W5, alt: 'Exterior View 5' },
  { src: W6, alt: 'Exterior View 6' },
];

interface FinancialReportingViewProps {
  onNavigate: (screen: ScreenType, transitionStyle: 'push' | 'slide_up') => void;
  onNotify?: (message: string) => void;
}

const arrivals = [
  { num: '01', name: 'The Sinclair Family', dates: 'Oct 12 — 19', nights: '7 nights', type: 'OWNER USE' },
  { num: '02', name: 'M. Dubois', dates: 'Oct 18 — 21', nights: '3 nights', type: 'ACCEPTED GUEST' },
  { num: '03', name: 'The Al-Sayed Party', dates: 'Oct 24 — Nov 02', nights: '9 nights', type: 'OWNER USE' },
];

export default function FinancialReportingView({ onNavigate, onNotify }: FinancialReportingViewProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <div className="min-h-screen" id="reporting-view-wrapper">

      {/* ── Header ── */}
      <header className="sticky top-0 z-40 bg-[#F7F5F2]/95 backdrop-blur-sm px-6 py-3 flex justify-between items-center border-b border-[rgba(28,25,23,0.06)]">
        <h1
          className="t-wordmark cursor-pointer"
          onClick={() => onNavigate('reporting', 'push')}
        >
          Vallarta Estates
        </h1>
        <button
          aria-label="Menu"
          id="reporting-menu-btn"
          onClick={() => onNavigate('nav_menu', 'slide_up')}
          className="p-2 text-[#78716C] hover:text-[#1C1917] transition-colors cursor-pointer"
        >
          <Menu className="w-5 h-5" strokeWidth={1.5} />
        </button>
      </header>

      {/* ── Hero Carousel ── */}
      <section className="hero" id="casa-obsidiana-hero">
        <div className="hero__media">
          <AnimatePresence mode="wait">
            <motion.img
              key={currentSlide}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              src={HERO_SLIDES[currentSlide].src}
              alt={HERO_SLIDES[currentSlide].alt}
              className="hero__slide-img"
              referrerPolicy="no-referrer"
            />
          </AnimatePresence>
          <div className="hero__gradient" />
          <button
            onClick={() => setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)}
            className="hero__arrow hero__arrow--prev"
            aria-label="Previous slide"
          >
            &#8249;
          </button>
          <button
            onClick={() => setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length)}
            className="hero__arrow hero__arrow--next"
            aria-label="Next slide"
          >
            &#8250;
          </button>
          <div className="hero__dots">
            {HERO_SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => goToSlide(i)}
                className={`hero__dot ${i === currentSlide ? 'hero__dot--active' : ''}`}
                aria-label={`View slide ${i + 1}`}
              />
            ))}
          </div>
        </div>

        <div className="hero__stats">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="hero-stat"
          >
            <span className="hero-stat__label">Revenue</span>
            <span className="hero-stat__value">$124,500</span>
            <span className="hero-stat__delta hero-stat__delta--positive">+14% · vs Sep</span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="hero-stat"
            onClick={() => onNavigate('deep_dive', 'push')}
            role="button"
            tabIndex={0}
            aria-label="View yield deep dive"
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onNavigate('deep_dive', 'push')}
          >
            <span className="hero-stat__label">Avg. Nightly Rate</span>
            <span className="hero-stat__value">$1,450</span>
            <span className="hero-stat__delta hero-stat__delta--neutral">Stable · Q4</span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="hero-stat"
            onClick={() => onNavigate('calendar', 'push')}
            role="button"
            tabIndex={0}
            aria-label="View occupancy calendar"
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onNavigate('calendar', 'push')}
          >
            <span className="hero-stat__label">Occupancy</span>
            <span className="hero-stat__value">88%</span>
            <span className="hero-stat__delta hero-stat__delta--positive">+3% · vs Sep</span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="hero-stat"
          >
            <span className="hero-stat__label">Sentiment</span>
            <span className="hero-stat__value">4.9</span>
            <span className="hero-stat__delta hero-stat__delta--positive">Top 5% · 47 reviews</span>
          </motion.div>
        </div>
      </section>

      {/* ── Hero Metric Beam ── */}
      <section className="hero-metric-beam" id="hero-metric-beam">
        <motion.span
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="hero-metric-beam__text"
        >
          <span className="hero-metric-beam__serif">Casa</span>
          <span className="hero-metric-beam__sans">Obsidiana</span>
        </motion.span>
      </section>

      {/* ── Dashboard Body ── */}
      <div className="dashboard__body">

        {/* Chart Panel */}
        <section className="chart-panel" id="reporting-chart-card">
          <div className="flex justify-between items-baseline mb-7">
            <span className="t-section-header">Performance Overview</span>
            <span className="t-mono text-[#A8A29E]" id="chart-latest-tooltip">$1,450 yield</span>
          </div>

          <div className="flex gap-6 mb-6">
            <div className="flex items-center gap-2">
              <span className="w-4 h-0.5 rounded-sm bg-[#B45309]" />
              <span className="t-metric-label" style={{ fontSize: '0.75rem' }}>Revenue</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-0.5 rounded-sm bg-[#15803D]" />
              <span className="t-metric-label" style={{ fontSize: '0.75rem' }}>Net Yield</span>
            </div>
          </div>

          <div className="relative h-[280px] w-full" id="reporting-chart-canvas">
            <svg viewBox="0 0 500 140" className="w-full h-full overflow-visible" preserveAspectRatio="none">

              <line x1="0" y1="30" x2="500" y2="30" stroke="rgba(28,25,23,0.04)" strokeWidth="1" />
              <line x1="0" y1="75" x2="500" y2="75" stroke="rgba(28,25,23,0.04)" strokeWidth="1" />
              <line x1="0" y1="120" x2="500" y2="120" stroke="rgba(28,25,23,0.04)" strokeWidth="1" />

              <motion.path
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 2.7 }}
                d="M 0 130 C 40 115 70 100 130 108 S 220 75 290 85 S 380 45 500 20 L 500 140 L 0 140 Z"
                fill="none"
              />
              <motion.path
                initial={{ strokeDasharray: 820, strokeDashoffset: 820 }}
                animate={{ strokeDashoffset: 0 }}
                transition={{ duration: 1.8, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
                d="M 0 130 C 40 115 70 100 130 108 S 220 75 290 85 S 380 45 500 20"
                fill="none"
                stroke="#B45309"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <circle cx="500" cy="20" r="3" fill="#B45309" />

              <motion.path
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 2.7 }}
                d="M 0 140 C 80 136 120 130 200 133 S 310 118 400 122 S 460 110 500 98 L 500 140 L 0 140 Z"
                fill="none"
              />
              <motion.path
                initial={{ strokeDasharray: 560, strokeDashoffset: 560 }}
                animate={{ strokeDashoffset: 0 }}
                transition={{ duration: 1.8, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
                d="M 0 140 C 80 136 120 130 200 133 S 310 118 400 122 S 460 110 500 98"
                fill="none"
                stroke="#15803D"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>

            <div className="flex justify-between mt-2">
              <span className="t-caption" style={{ color: 'var(--color-ink-muted)' }}>May</span>
              <span className="t-caption" style={{ color: 'var(--color-ink-muted)' }}>Jun</span>
              <span className="t-caption" style={{ color: 'var(--color-ink-muted)' }}>Jul</span>
              <span className="t-caption" style={{ color: 'var(--color-ink-muted)' }}>Aug</span>
              <span className="t-caption" style={{ color: 'var(--color-ink-muted)' }}>Sep</span>
              <span className="t-caption" style={{ color: 'var(--color-ink-muted)' }}>Oct</span>
            </div>
          </div>
        </section>

        {/* Sidebar */}
        <aside className="sidebar">

          {/* Arrivals */}
          <div className="sidebar__section" id="reporting-timeline-section">
            <span className="t-metric-label" style={{ marginBottom: '24px', display: 'block' }}>
              Upcoming Arrivals
            </span>
            <div id="arrival-timeline-list">
              {arrivals.map((a, i) => (
                <motion.div
                  key={a.num}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 1.1 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className="arrival-row"
                  id={`arrival-${a.num}`}
                  onClick={() => onNavigate('calendar', 'push')}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && onNavigate('calendar', 'push')}
                >
                  <div>
                    <h4 className="arrival-row__name">{a.name}</h4>
                    <div className="arrival-row__meta">
                      {a.dates} · {a.nights}
                    </div>
                  </div>
                  <span className={`arrival-row__type ${a.type === 'OWNER USE' ? 'arrival-row__type--owner' : ''}`}>
                    {a.type}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Financial Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.3, ease: [0.16, 1, 0.3, 1] }}
            className="sidebar__section"
            id="reporting-analysis-section"
          >
            <span className="t-metric-label" style={{ marginBottom: '20px', display: 'block' }}>
              Financial Summary
            </span>
            <div id="financial-reports-summary">
              <div className="flex justify-between items-baseline py-4 border-b border-[rgba(28,25,23,0.06)]" id="report-net-profit">
                <span className="t-mono" style={{ color: 'var(--color-ink-secondary)', fontSize: '0.625rem' }}>
                  Net Profit
                </span>
                <div>
                  <span className="t-body" style={{ fontSize: '1rem', fontWeight: 500, fontVariantNumeric: 'tabular-nums' }}>
                    $84,200
                  </span>
                  <span className="t-mono text-[#15803D]" style={{ fontSize: '0.625rem', marginLeft: '8px' }}>
                    +8%
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-baseline py-4" id="report-opex">
                <span className="t-mono" style={{ color: 'var(--color-ink-secondary)', fontSize: '0.625rem' }}>
                  Operating Expenses
                </span>
                <div>
                  <span className="t-body" style={{ fontSize: '1rem', fontWeight: 500, fontVariantNumeric: 'tabular-nums' }}>
                    $40,300
                  </span>
                  <span className="t-mono text-[#A8A29E]" style={{ fontSize: '0.625rem', marginLeft: '8px' }}>
                    Stable
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => onNavigate('deep_dive', 'push')}
              id="view-financial-reports-btn"
              className="btn"
              style={{ marginTop: '24px', width: '100%' }}
            >
              View Full Financial Report
            </button>
          </motion.div>

        </aside>
      </div>

      {/* ── Status Band + Camera ── */}
      <section className="supervision-section" id="reporting-supervision-section">
        <div className="supervision-grid">
          {/* Property Status */}
          <div className="supervision-status">
            <span className="t-metric-label">Property Status</span>
            <div className="status-band" id="supervision-stats">
              <div id="supervision-security">
                <span className="status-item__label">Security</span>
                <div className="status-item__value">
                  <span className="status-dot status-dot--active" />
                  <span>Active</span>
                </div>
              </div>
              <div id="supervision-maintenance">
                <span className="status-item__label">Maintenance</span>
                <div className="status-item__value">
                  <span className="status-dot status-dot--active" />
                  <span>On Schedule</span>
                </div>
              </div>
              <div id="supervision-staff">
                <span className="status-item__label">Staff</span>
                <div className="status-item__value">
                  <span className="status-dot status-dot--active" />
                  <span>4 On-Site</span>
                </div>
              </div>
            </div>
          </div>

          {/* Camera Feed */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.5, ease: [0.16, 1, 0.3, 1] }}
            className="camera-feed"
            style={{ height: '200px' }}
            onClick={() => onNavigate('camera_expanded', 'push')}
            id="supervision-camera-card"
          >
            <img
              src="https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=800&q=80"
              alt="Pool camera feed preview"
              className="cinematic-grade"
              loading="lazy"
              referrerPolicy="no-referrer"
            />
            <div className="camera-feed__overlay">
              <p className="camera-feed__label">CAM 02 · POOL TERRACE</p>
              <h4 className="camera-feed__title">Obsidiana Main Suite View</h4>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="site-footer" id="reporting-footer">
        <div className="site-footer__inner">
          <h4 className="site-footer__wordmark">
            Vallarta Estates
          </h4>
          <div className="site-footer__links">
            <button onClick={() => onNotify?.('Secure privacy guidelines.')}>
              Privacy
            </button>
            <button onClick={() => onNotify?.('Accepting terms of use.')}>
              Terms
            </button>
            <button onClick={() => onNotify?.('Media kits.')}>
              Press
            </button>
          </div>
          <button onClick={() => onNotify?.('Call primary concierge at +52 (322) 849-0122.')}>
            Contact Concierge
          </button>
        </div>
      </footer>

    </div>
  );
}
