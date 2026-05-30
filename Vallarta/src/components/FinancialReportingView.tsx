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

const MONTHLY_DATA = [
  { month: 'May', revenue: 89200 },
  { month: 'Jun', revenue: 94500 },
  { month: 'Jul', revenue: 108000 },
  { month: 'Aug', revenue: 115300 },
  { month: 'Sep', revenue: 109200 },
  { month: 'Oct', revenue: 124500 },
] as const;

const MONTHLY_MAX = Math.max(...MONTHLY_DATA.map((d) => d.revenue));

export default function FinancialReportingView({ onNavigate, onNotify }: FinancialReportingViewProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <div className="min-h-screen" id="reporting-view-wrapper">

      {/* ── Header ── */}
      <header
        className={`sticky top-0 z-40 px-6 py-3 flex justify-between items-center transition-all duration-500 ${
          scrolled
            ? 'bg-[#F7F5F2]/95 backdrop-blur-sm border-b border-[rgba(28,25,23,0.06)]'
            : 'bg-transparent border-b border-transparent'
        }`}
      >
        <h1
          className={`t-wordmark cursor-pointer transition-colors duration-500 ${scrolled ? 'text-[#1C1917]' : 'text-white'}`}
          onClick={() => onNavigate('reporting', 'push')}
        >
          Vallarta Estates
        </h1>
        <button
          aria-label="Menu"
          id="reporting-menu-btn"
          onClick={() => onNavigate('nav_menu', 'slide_up')}
          className={`p-2 transition-colors duration-500 cursor-pointer ${
            scrolled ? 'text-[#78716C] hover:text-[#1C1917]' : 'text-white/70 hover:text-white'
          }`}
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

        {/* Hero metrics overlay — key data visible above the fold */}
        <div className="hero__metrics" aria-label="Property metrics summary">
          <div className="hero__metric">
            <span className="hero__metric-label">Revenue</span>
            <span className="hero__metric-value">$124,500</span>
            <span className="hero__metric-delta">+14% · Oct vs Sep</span>
          </div>

          <div
            className="hero__metric hero__metric--interactive"
            role="button"
            tabIndex={0}
            aria-label="View yield analysis"
            onClick={() => onNavigate('deep_dive', 'push')}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onNavigate('deep_dive', 'push');
              }
            }}
          >
            <span className="hero__metric-label">Avg. Nightly Rate</span>
            <span className="hero__metric-value">$1,450</span>
            <span className="hero__metric-delta">Stable · Q4</span>
          </div>

          <div
            className="hero__metric hero__metric--interactive"
            role="button"
            tabIndex={0}
            aria-label="View occupancy calendar"
            onClick={() => onNavigate('calendar', 'push')}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onNavigate('calendar', 'push');
              }
            }}
          >
            <span className="hero__metric-label">Occupancy</span>
            <span className="hero__metric-value">88%</span>
            <span className="hero__metric-delta">+3% · vs Sep</span>
          </div>

          <div className="hero__metric">
            <span className="hero__metric-label">Sentiment</span>
            <span className="hero__metric-value">4.9 / 5</span>
            <span className="hero__metric-delta">Top 5% · 47 reviews</span>
          </div>
        </div>
        </div>
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
          <div className="monthly-table" id="reporting-chart-canvas">
            {MONTHLY_DATA.map((item, i) => {
              const prev = i > 0 ? MONTHLY_DATA[i - 1].revenue : null;
              const delta = prev !== null
                ? ((item.revenue - prev) / prev * 100).toFixed(0)
                : null;
              const isCurrent = i === MONTHLY_DATA.length - 1;
              const barWidth = (item.revenue / MONTHLY_MAX) * 100;

              return (
                <motion.div
                  key={item.month}
                  className={`monthly-table__row${isCurrent ? ' monthly-table__row--current' : ''}`}
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                >
                  <span className="monthly-table__month">{item.month}</span>
                  <span className="monthly-table__revenue">
                    ${item.revenue.toLocaleString()}
                  </span>
                  {delta !== null ? (
                    <span className={`monthly-table__delta${Number(delta) >= 0 ? ' monthly-table__delta--up' : ' monthly-table__delta--down'}`}>
                      {Number(delta) >= 0 ? '+' : ''}{delta}%
                    </span>
                  ) : (
                    <span className="monthly-table__delta" />
                  )}
                  <motion.div
                    className="monthly-table__bar"
                    initial={{ width: 0 }}
                    whileInView={{ width: `${barWidth}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.9, delay: i * 0.06 + 0.2, ease: [0.16, 1, 0.3, 1] }}
                  />
                </motion.div>
              );
            })}
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

      {/* ── Property Vitals ── */}
      <section className="vitals-ops" id="reporting-supervision-section">
        <div className="vitals-ops__inner">
          {/* Status column */}
          <div className="vitals-ops__status">
            <div className="vitals-ops__status-header">
              <span className="vitals-ops__status-label">Property Status</span>
              <div className="vitals-ops__status-rule" />
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="vitals-ops__status-item" id="supervision-security">
                <span className="vitals-ops__status-item-label">Security</span>
                <span className="vitals-ops__status-item-value">Active</span>
                <span className="vitals-ops__status-item-sub">All perimeter sensors nominal</span>
              </div>

              <div className="vitals-ops__status-item" id="supervision-maintenance">
                <span className="vitals-ops__status-item-label">Maintenance</span>
                <span className="vitals-ops__status-item-value">On Schedule</span>
                <span className="vitals-ops__status-item-sub">Next service Nov 8</span>
              </div>

              <div className="vitals-ops__status-item" id="supervision-staff">
                <span className="vitals-ops__status-item-label">Staff</span>
                <span className="vitals-ops__status-item-value">4 On-Site</span>
                <span className="vitals-ops__status-item-sub">2 interior · 2 grounds</span>
              </div>
            </motion.div>
          </div>

          {/* Camera feed */}
          <motion.div
            className="vitals-ops__camera"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            onClick={() => onNavigate('camera_expanded', 'push')}
            id="supervision-camera-card"
            role="button"
            tabIndex={0}
            aria-label="Expand camera feed"
            onKeyDown={(e) => e.key === 'Enter' && onNavigate('camera_expanded', 'push')}
          >
            <img
              src="https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=1200&q=80"
              alt="Pool camera feed preview"
              className="cinematic-grade"
              loading="lazy"
              referrerPolicy="no-referrer"
            />
            <div className="vitals-ops__camera-overlay">
              <span className="vitals-ops__camera-id">CAM 02 · POOL TERRACE</span>
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
          <button
            onClick={() => onNotify?.('Call primary concierge at +52 (322) 849-0122.')}
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '0.5625rem',
              letterSpacing: '0.20em',
              textTransform: 'uppercase' as const,
              color: 'var(--color-dark-ink-muted)',
              background: 'none',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
              transition: 'color 0.35s ease',
            }}
          >
            Concierge →
          </button>
        </div>
      </footer>

    </div>
  );
}
