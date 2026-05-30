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

const TIMELINE_START = new Date('2026-10-10');
const TIMELINE_END   = new Date('2026-11-04');
const TIMELINE_DAYS  = Math.round(
  (TIMELINE_END.getTime() - TIMELINE_START.getTime()) / 86400000
);

function stayToPercent(startIso: string, endIso: string) {
  const start = new Date(startIso);
  const end   = new Date(endIso);
  const left  = Math.round(
    (start.getTime() - TIMELINE_START.getTime()) / 86400000
  ) / TIMELINE_DAYS * 100;
  const width = Math.round(
    (end.getTime() - start.getTime()) / 86400000
  ) / TIMELINE_DAYS * 100;
  return { left, width };
}

const arrivals = [
  {
    num: '01',
    name: 'The Sinclair Family',
    dates: 'Oct 12 – 19',
    nights: '7 nights',
    type: 'OWNER USE' as const,
    startDate: '2026-10-12',
    endDate:   '2026-10-19',
  },
  {
    num: '02',
    name: 'M. Dubois',
    dates: 'Oct 18 – 21',
    nights: '3 nights',
    type: 'GUEST' as const,
    startDate: '2026-10-18',
    endDate:   '2026-10-21',
  },
  {
    num: '03',
    name: 'The Al-Sayed Party',
    dates: 'Oct 24 – Nov 2',
    nights: '9 nights',
    type: 'OWNER USE' as const,
    startDate: '2026-10-24',
    endDate:   '2026-11-02',
  },
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
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              src={HERO_SLIDES[currentSlide].src}
              alt={HERO_SLIDES[currentSlide].alt}
              className="hero__slide-img cinematic-grade"
              referrerPolicy="no-referrer"
            />
          </AnimatePresence>
          <div className="hero__gradient" />

          {/* Property Identity */}
          <div className="hero__identity">
            <motion.span
              className="hero__property-name"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.0, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              Casa Obsidiana
            </motion.span>
            <motion.span
              className="hero__property-location"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              Puerto Vallarta · October 2026
            </motion.span>
          </div>

          {/* Slide counter */}
          <div
            className="hero__counter"
            aria-live="polite"
            aria-label={`Slide ${currentSlide + 1} of ${HERO_SLIDES.length}`}
          >
            <span className="hero__counter-current">
              {String(currentSlide + 1).padStart(2, '0')}
            </span>
            <span className="hero__counter-sep">/</span>
            <span className="hero__counter-total">
              {String(HERO_SLIDES.length).padStart(2, '0')}
            </span>
          </div>

          {/* Navigation arrows */}
          <button
            onClick={() => setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)}
            className="hero__arrow hero__arrow--prev"
            aria-label="Previous slide"
          >
            <svg width="20" height="12" viewBox="0 0 20 12" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <line x1="20" y1="6" x2="1" y2="6" stroke="currentColor" strokeWidth="1"/>
              <polyline points="7,1 1,6 7,11" fill="none" stroke="currentColor" strokeWidth="1" strokeLinejoin="round" strokeLinecap="round"/>
            </svg>
          </button>
          <button
            onClick={() => setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length)}
            className="hero__arrow hero__arrow--next"
            aria-label="Next slide"
          >
            <svg width="20" height="12" viewBox="0 0 20 12" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <line x1="0" y1="6" x2="19" y2="6" stroke="currentColor" strokeWidth="1"/>
              <polyline points="13,1 19,6 13,11" fill="none" stroke="currentColor" strokeWidth="1" strokeLinejoin="round" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      </section>

      {/* ── Estate Vitals Band ── */}
      <section className="vitals-band" id="estate-vitals-band">
        <motion.div
          className="vitals-band__cell"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.0, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="vitals-band__label">Revenue</span>
          <span className="vitals-band__value">$124,500</span>
          <span className="vitals-band__delta">+14% · Oct vs Sep</span>
        </motion.div>

        <motion.div
          className="vitals-band__cell"
          role="button"
          tabIndex={0}
          aria-label="View yield analysis"
          onClick={() => onNavigate('deep_dive', 'push')}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onNavigate('deep_dive', 'push')}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="vitals-band__label">Avg. Nightly Rate</span>
          <span className="vitals-band__value">$1,450</span>
          <span className="vitals-band__delta">Stable · Q4</span>
        </motion.div>

        <motion.div
          className="vitals-band__cell"
          role="button"
          tabIndex={0}
          aria-label="View occupancy calendar"
          onClick={() => onNavigate('calendar', 'push')}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onNavigate('calendar', 'push')}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="vitals-band__label">Occupancy</span>
          <span className="vitals-band__value">88%</span>
          <span className="vitals-band__delta">+3% · vs Sep</span>
        </motion.div>

        <motion.div
          className="vitals-band__cell"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.24, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="vitals-band__label">Sentiment</span>
          <span className="vitals-band__value">4.9</span>
          <span className="vitals-band__delta">Top 5% · 47 reviews</span>
        </motion.div>
      </section>

      {/* ── Performance Section ── */}
      <section className="performance-section" id="reporting-chart-card">
        {/* Section label */}
        <div className="performance-section__label">
          <span className="performance-section__label-text">Performance Overview</span>
          <div className="performance-section__label-rule" />
        </div>

        {/* Chart */}
        <div className="performance-section__chart">
          <div className="relative h-[280px] w-full" id="reporting-chart-canvas">
            <svg viewBox="0 0 500 140" className="w-full h-full overflow-visible" preserveAspectRatio="none">
              <motion.path
                initial={{ strokeDasharray: 820, strokeDashoffset: 820 }}
                whileInView={{ strokeDashoffset: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 2.0, ease: [0.16, 1, 0.3, 1] }}
                d="M 0 130 C 40 115 70 100 130 108 S 220 75 290 85 S 380 45 500 20"
                fill="none"
                stroke="#B45309"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <circle cx="500" cy="20" r="3" fill="#B45309" />
              <text
                x="492"
                y="14"
                textAnchor="end"
                fontFamily="'JetBrains Mono', monospace"
                fontSize="8"
                fill="rgba(28,25,23,0.45)"
                letterSpacing="0.08em"
              >
                $124,500 · OCT
              </text>
            </svg>

            <div className="performance-chart__axis-labels">
              {['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'].map((month) => (
                <span
                  key={month}
                  style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', letterSpacing: '0.12em', color: 'var(--color-ink-muted)', textTransform: 'uppercase' }}
                >
                  {month}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Editorial aside — replaces legend */}
        <motion.div
          className="performance-section__aside"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="performance-section__aside-quote">
            Revenue grew 14% against September, driven by extended owner-use weeks and above-target weekend rates.
          </p>
          <button
            className="performance-section__aside-cta"
            onClick={() => onNavigate('deep_dive', 'push')}
            id="view-financial-reports-btn"
          >
            View full report →
          </button>
        </motion.div>
      </section>

      {/* ── Guest Chronicle ── */}
      <section className="chronicle-section" id="reporting-timeline-section">
        <div className="chronicle-section__header">
          <span className="chronicle-section__label">Guest Chronicle</span>
          <div className="chronicle-section__rule" />
        </div>

        <div className="chronicle-timeline">
          <div className="chronicle-timeline__stays">
            {arrivals.map((arrival, i) => {
              const { left, width } = stayToPercent(arrival.startDate, arrival.endDate);
              const topOffset = i * 56;
              return (
                <motion.div
                  key={arrival.num}
                  className={`chronicle-stay chronicle-stay--${arrival.type === 'OWNER USE' ? 'owner' : 'guest'}`}
                  style={{
                    left: `${left}%`,
                    width: `${width}%`,
                    top: `${topOffset}px`,
                    transformOrigin: 'left center',
                  }}
                  initial={{ opacity: 0, scaleX: 0 }}
                  whileInView={{ opacity: 1, scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.9, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                  onClick={() => onNavigate('calendar', 'push')}
                  role="button"
                  tabIndex={0}
                  aria-label={`View ${arrival.name} booking`}
                  onKeyDown={(e) => e.key === 'Enter' && onNavigate('calendar', 'push')}
                >
                  <div className="chronicle-stay__bar" />
                  <span className="chronicle-stay__name">{arrival.name}</span>
                  <span className="chronicle-stay__meta">{arrival.dates} · {arrival.nights}</span>
                </motion.div>
              );
            })}
          </div>

          <div className="chronicle-timeline__axis" />
          <div className="chronicle-timeline__axis-labels">
            {['Oct 10', 'Oct 14', 'Oct 18', 'Oct 22', 'Oct 26', 'Oct 30', 'Nov 3'].map((label) => (
              <span key={label} className="chronicle-timeline__axis-label">{label}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Financial Brief ── */}
      <section className="financial-brief" id="reporting-analysis-section">
        <div className="financial-brief__header">
          <span className="financial-brief__label">Financial Summary</span>
          <div className="financial-brief__rule" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          id="financial-reports-summary"
        >
          <div className="financial-brief__row" id="report-net-revenue">
            <span className="financial-brief__row-label">Net Revenue</span>
            <div className="financial-brief__row-right">
              <span className="financial-brief__row-value">$124,500</span>
              <span className="financial-brief__row-delta">Up 14% from September</span>
            </div>
          </div>

          <div className="financial-brief__row" id="report-net-profit">
            <span className="financial-brief__row-label">Net Profit</span>
            <div className="financial-brief__row-right">
              <span className="financial-brief__row-value">$84,200</span>
              <span className="financial-brief__row-delta">Up 8% from September</span>
            </div>
          </div>

          <div className="financial-brief__row" id="report-opex">
            <span className="financial-brief__row-label">Operating Expenses</span>
            <div className="financial-brief__row-right">
              <span className="financial-brief__row-value">$40,300</span>
              <span className="financial-brief__row-delta">Stable · Q4</span>
            </div>
          </div>

          <div className="financial-brief__cta-row">
            <button
              className="financial-brief__cta"
              onClick={() => onNavigate('deep_dive', 'push')}
            >
              View full financial report →
            </button>
          </div>
        </motion.div>
      </section>

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
