import React from 'react';
import { motion } from 'motion/react';
import { Menu, ArrowRight } from 'lucide-react';
import { ScreenType } from '../types';

interface FinancialReportingViewProps {
  onNavigate: (screen: ScreenType, transitionStyle: 'push' | 'slide_up') => void;
  onNotify?: (message: string) => void;
}

const arrivals = [
  {
    num: '01',
    name: 'The Sinclair Family',
    dates: 'Oct 12 — 19',
    nights: '7 nights',
    type: 'OWNER USE',
    typeStyle: 'text-amber-700',
  },
  {
    num: '02',
    name: 'M. Dubois',
    dates: 'Oct 18 — 21',
    nights: '3 nights',
    type: 'ACCEPTED GUEST',
    typeStyle: 'text-[#1C1917]/40',
  },
  {
    num: '03',
    name: 'The Al-Sayed Party',
    dates: 'Oct 24 — Nov 02',
    nights: '9 nights',
    type: 'OWNER USE',
    typeStyle: 'text-amber-700',
  },
];

export default function FinancialReportingView({ onNavigate, onNotify }: FinancialReportingViewProps) {
  return (
    <div className="min-h-screen bg-[#F2EDE7] text-[#1C1917] font-sans" id="reporting-view-wrapper">

      {/* ── Header ── */}
      <header
        className="sticky top-0 z-40 bg-[#F2EDE7]/95 backdrop-blur-sm border-b border-[#C9B8A0]/20 px-6 py-3 flex justify-between items-center"
        id="reporting-header"
      >
        <h1
          className="text-xl font-serif italic tracking-[0.08em] text-[#1C1917] cursor-pointer"
          onClick={() => onNavigate('reporting', 'push')}
        >
          Vallarta Estates
        </h1>
        <button
          aria-label="Menu"
          id="reporting-menu-btn"
          onClick={() => onNavigate('nav_menu', 'slide_up')}
          className="p-2 text-[#1C1917]/50 hover:text-[#1C1917] transition-colors cursor-pointer"
        >
          <Menu className="w-5 h-5" strokeWidth={1.5} />
        </button>
      </header>

      {/* ── Hero — full-bleed, no border-radius ── */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative h-[45vh] md:h-[62vh] overflow-hidden"
        id="casa-obsidiana-hero"
      >
        <img
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
          alt="Casa Obsidiana Estate"
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent md:bg-[linear-gradient(to_top,rgba(0,0,0,0.75)_0%,rgba(0,0,0,0.2)_50%,transparent_100%),linear-gradient(to_right,rgba(0,0,0,0.35)_0%,transparent_55%)]" />
        <div className="absolute bottom-0 left-0 right-0 px-6 md:px-10 pb-6 md:pb-10">
          <span className="block text-[8px] md:text-[9px] tracking-[0.35em] uppercase text-white/55 font-mono mb-1.5">
            Estate 04 · Puerto Vallarta, Mexico
          </span>
          <h2 className="text-3xl md:text-5xl font-serif italic tracking-wide text-white" id="hero-estate-title">
            Casa Obsidiana
          </h2>
        </div>
      </motion.section>

      {/* ── Responsive two-column grid (desktop) ── */}
      <div className="md:grid md:grid-cols-[1fr_360px] md:divide-x md:divide-[#C9B8A0]/25">

        {/* Left column: metrics + chart */}
        <div>
          {/* ── Metrics strip — inline, hairline dividers, no cards ── */}
          <section className="border-b border-[#C9B8A0]/25" id="reporting-metrics-section">
            <div className="flex divide-x divide-[#C9B8A0]/25">
              <div className="flex-1 px-4 py-5 pl-6 md:py-7" id="metric-revenue-card">
                <span className="block text-[8px] tracking-[0.22em] uppercase text-[#1C1917]/40 mb-2">Revenue</span>
                <span className="block text-lg md:text-2xl font-mono text-[#1C1917]">$124,500</span>
                <span className="block text-[9px] font-mono text-green-700 mt-1">+14%</span>
              </div>
              <div
                className="flex-1 px-4 py-5 md:py-7 cursor-pointer"
                onClick={() => onNavigate('deep_dive', 'push')}
                id="metric-yield-card"
              >
                <span className="block text-[8px] tracking-[0.22em] uppercase text-[#1C1917]/40 mb-2">Yield</span>
                <span className="block text-lg md:text-2xl font-mono text-[#1C1917]">$1,450</span>
                <span className="block text-[9px] font-mono text-[#1C1917]/35 mt-1">Stable</span>
              </div>
              <div
                className="flex-1 px-4 py-5 md:py-7 cursor-pointer"
                onClick={() => onNavigate('calendar', 'push')}
                id="metric-occupancy-card"
              >
                <span className="block text-[8px] tracking-[0.22em] uppercase text-[#1C1917]/40 mb-2">Occupancy</span>
                <span className="block text-lg md:text-2xl font-mono text-[#1C1917]">88%</span>
                <span className="block text-[9px] font-mono text-green-700 mt-1">+3%</span>
              </div>
              <div className="flex-1 px-4 py-5 md:py-7 pr-6" id="metric-sentiment-card">
                <span className="block text-[8px] tracking-[0.22em] uppercase text-[#1C1917]/40 mb-2">Sentiment</span>
                <span className="block text-lg md:text-2xl font-mono text-[#1C1917]">4.9</span>
                <span className="block text-[9px] font-mono text-[#1C1917]/35 mt-1">Top 5%</span>
              </div>
            </div>
          </section>

          {/* Chart section placeholder — replaced in Task 2 */}
          <section className="px-6 py-8 border-b border-[#C9B8A0]/25 md:border-b-0" id="reporting-chart-card">
        <div className="flex justify-between items-baseline mb-5 md:mb-7">
          <span className="text-[9px] tracking-[0.28em] uppercase text-[#1C1917]/40">Performance Overview</span>
          <span className="font-mono text-sm text-[#1C1917]" id="chart-latest-tooltip">$1,450 yield</span>
        </div>

        {/* Desktop legend */}
        <div className="hidden md:flex gap-6 mb-5">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[oklch(58%_0.09_48)] opacity-70" />
            <span className="text-[8px] font-mono uppercase tracking-[0.2em] text-[#1C1917]/45">Revenue</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[oklch(70%_0.04_60)] opacity-70" />
            <span className="text-[8px] font-mono uppercase tracking-[0.2em] text-[#1C1917]/45">Expenses</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[oklch(60%_0.06_155)] opacity-70" />
            <span className="text-[8px] font-mono uppercase tracking-[0.2em] text-[#1C1917]/45">Net Yield</span>
          </div>
        </div>

        <div className="relative h-[150px] md:h-[280px] w-full" id="reporting-chart-canvas">
          <svg viewBox="0 0 500 140" className="w-full h-full overflow-visible" preserveAspectRatio="none">
            <defs>
              {/* Terracotta — Revenue (largest) */}
              <linearGradient id="wave-fill-revenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="oklch(58% 0.09 48)" stopOpacity="0.40" />
                <stop offset="100%" stopColor="oklch(58% 0.09 48)" stopOpacity="0.05" />
              </linearGradient>
              {/* Warm stone — Expenses (medium) */}
              <linearGradient id="wave-fill-opex" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="oklch(70% 0.04 60)" stopOpacity="0.50" />
                <stop offset="100%" stopColor="oklch(70% 0.04 60)" stopOpacity="0.05" />
              </linearGradient>
              {/* Sage — Net Yield (smallest, foreground) */}
              <linearGradient id="wave-fill-yield" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="oklch(60% 0.06 155)" stopOpacity="0.45" />
                <stop offset="100%" stopColor="oklch(60% 0.06 155)" stopOpacity="0.05" />
              </linearGradient>
            </defs>

            {/* Grid lines */}
            <line x1="0" y1="30" x2="500" y2="30" stroke="#DDD5C8" strokeWidth="0.5" />
            <line x1="0" y1="75" x2="500" y2="75" stroke="#DDD5C8" strokeWidth="0.5" />
            <line x1="0" y1="120" x2="500" y2="120" stroke="#DDD5C8" strokeWidth="0.5" />

            {/* Revenue — terracotta, tallest wave */}
            <path
              d="M 0 130 C 40 115 70 100 130 108 S 220 75 290 85 S 380 45 500 20 L 500 140 L 0 140 Z"
              fill="url(#wave-fill-revenue)"
            />
            <path
              d="M 0 130 C 40 115 70 100 130 108 S 220 75 290 85 S 380 45 500 20"
              fill="none"
              stroke="oklch(42% 0.09 48)"
              strokeWidth="1.2"
              strokeLinecap="round"
            />

            {/* Expenses — warm stone, medium height, starts slightly right */}
            <path
              d="M 0 140 C 60 128 100 118 170 122 S 270 98 360 105 S 440 80 500 60 L 500 140 L 0 140 Z"
              fill="url(#wave-fill-opex)"
            />

            {/* Net Yield — sage, shortest wave, foreground */}
            <path
              d="M 0 140 C 80 136 120 130 200 133 S 310 118 400 122 S 460 110 500 98 L 500 140 L 0 140 Z"
              fill="url(#wave-fill-yield)"
            />
            <path
              d="M 0 140 C 80 136 120 130 200 133 S 310 118 400 122 S 460 110 500 98"
              fill="none"
              stroke="oklch(44% 0.06 155)"
              strokeWidth="1.2"
              strokeLinecap="round"
            />

            {/* End dot on revenue (primary series) */}
            <circle cx="500" cy="20" r="3" fill="oklch(42% 0.09 48)" />
          </svg>

          <div className="flex justify-between text-[8px] font-mono text-[#1C1917]/35 mt-2 uppercase tracking-widest">
            <span>May</span><span>Jun</span><span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span>
          </div>
        </div>
          </section>
        </div>

        {/* Right column: arrivals + financial summary (desktop briefing panel) */}
        <div className="md:flex md:flex-col">
          {/* ── Arrivals — numbered editorial list ── */}
          <section className="px-6 py-8 border-b border-[#C9B8A0]/25" id="reporting-timeline-section">
            <span className="block text-[8px] tracking-[0.3em] uppercase text-[#1C1917]/40 mb-6">
              Upcoming Arrivals
            </span>
            <div id="arrival-timeline-list">
              {arrivals.map((a) => (
                <div
                  key={a.num}
                  id={`arrival-${a.num}`}
                  className="flex items-start gap-4 py-4 border-b border-[#C9B8A0]/20 last:border-0 cursor-pointer group"
                  onClick={() => onNavigate('calendar', 'push')}
                >
                  <span className="text-[10px] font-mono text-[#1C1917]/25 mt-0.5 w-5 shrink-0">{a.num}</span>
                  <div className="flex-1 flex justify-between items-start gap-3">
                    <div>
                      <h5 className="font-serif text-[15px] text-[#1C1917] group-hover:text-[#1C1917]/55 transition-colors duration-200">
                        {a.name}
                      </h5>
                      <p className="text-[9px] uppercase font-mono tracking-wider text-[#1C1917]/40 mt-0.5">
                        {a.dates} · {a.nights}
                      </p>
                    </div>
                    <span className={`text-[8px] tracking-[0.15em] font-mono uppercase mt-0.5 shrink-0 ${a.typeStyle}`}>
                      {a.type}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── Financial Summary ── */}
          <section className="px-6 py-8 border-b border-[#C9B8A0]/25 md:flex-1" id="reporting-analysis-section">
            <span className="block text-[8px] tracking-[0.3em] uppercase text-[#1C1917]/40 mb-5">
              Financial Summary
            </span>
            <div id="financial-reports-summary">
              <div
                className="flex justify-between items-baseline py-4 border-b border-[#C9B8A0]/20"
                id="report-net-profit"
              >
                <span className="text-[9px] tracking-[0.2em] uppercase text-[#1C1917]/45">Net Profit</span>
                <div>
                  <span className="font-mono text-base text-[#1C1917]">$84,200</span>
                  <span className="text-[9px] text-green-700 font-mono ml-2">+8%</span>
                </div>
              </div>
              <div className="flex justify-between items-baseline py-4" id="report-opex">
                <span className="text-[9px] tracking-[0.2em] uppercase text-[#1C1917]/45">
                  Operating Expenses
                </span>
                <div>
                  <span className="font-mono text-base text-[#1C1917]">$40,300</span>
                  <span className="text-[9px] text-[#1C1917]/35 font-mono ml-2">Stable</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => onNavigate('deep_dive', 'push')}
              id="view-financial-reports-btn"
              className="mt-6 w-full py-3.5 border border-[#1C1917]/15 text-[9px] uppercase tracking-[0.25em] font-mono text-[#1C1917]/50 hover:text-[#1C1917] hover:border-[#1C1917]/40 transition-all duration-300 cursor-pointer"
            >
              View Full Financial Report
            </button>
          </section>
        </div>

      </div>{/* end responsive grid */}

      {/* ── Supervision — inline status strip + camera ── */}
      <section className="border-b border-[#C9B8A0]/25" id="reporting-supervision-section">
        <div className="md:grid md:grid-cols-[1fr_1fr] md:divide-x md:divide-[#C9B8A0]/25">

          {/* Status strip */}
          <div className="px-6 py-8">
            <span className="block text-[8px] tracking-[0.3em] uppercase text-[#1C1917]/40 mb-5">
              Property Status
            </span>
            <div className="flex gap-8 md:gap-12" id="supervision-stats">
              <div id="supervision-security">
                <span className="block text-[8px] tracking-[0.22em] uppercase text-[#1C1917]/40 mb-1.5">Security</span>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  <span className="font-mono text-xs text-[#1C1917]">Active</span>
                </div>
              </div>
              <div id="supervision-maintenance">
                <span className="block text-[8px] tracking-[0.22em] uppercase text-[#1C1917]/40 mb-1.5">
                  Maintenance
                </span>
                <span className="font-mono text-xs text-[#1C1917]">On Schedule</span>
              </div>
              <div id="supervision-staff">
                <span className="block text-[8px] tracking-[0.22em] uppercase text-[#1C1917]/40 mb-1.5">Staff</span>
                <span className="font-mono text-xs text-[#1C1917]">4 On-Site</span>
              </div>
            </div>
          </div>

          {/* Camera feed */}
          <div
            className="relative h-[180px] md:h-[200px] overflow-hidden cursor-pointer group"
            onClick={() => onNavigate('camera_expanded', 'push')}
            id="supervision-camera-card"
          >
            <img
              src="https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=800&q=80"
              alt="Pool camera feed preview"
              className="w-full h-full object-cover transition duration-500 group-hover:scale-[1.02]"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-black/35 group-hover:bg-black/45 transition-colors" />
            <span
              className="absolute top-4 left-4 bg-red-600 text-white text-[8px] tracking-widest uppercase font-mono px-2.5 py-1 flex items-center gap-1.5 rounded-full"
              id="camera-live-badge"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              LIVE
            </span>
            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end text-white">
              <div>
                <p className="text-[9px] tracking-wider text-white/55 uppercase font-mono">
                  CAM 02 · POOL TERRACE
                </p>
                <h4 className="text-lg font-serif italic tracking-wide mt-0.5">
                  Obsidiana Main Suite View
                </h4>
              </div>
              <button
                id="view-cameras-btn"
                className="text-[9px] uppercase tracking-[0.2em] font-mono text-white/65 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
              >
                VIEW <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* ── Footer ── */}
      <footer
        className="bg-[#1C1917] text-[#F5F1E8] py-10 px-6 md:px-10 text-center md:text-left"
        id="reporting-footer"
      >
        <div className="md:flex md:items-start md:justify-between md:gap-8 md:max-w-5xl md:mx-auto">
          {/* Brand */}
          <h4 className="text-xl font-serif italic tracking-[0.1em] text-[#F5F1E8] mb-5 md:mb-0 md:shrink-0">
            Vallarta Estates
          </h4>

          {/* Legal links */}
          <div className="flex justify-center md:justify-start gap-6 text-[8px] uppercase tracking-[0.2em] mb-5 md:mb-0 text-[#F5F1E8]/40">
            <button
              onClick={() => onNotify?.('Secure privacy guidelines.')}
              className="hover:text-[#C9B8A0] cursor-pointer transition-colors"
            >
              Privacy
            </button>
            <button
              onClick={() => onNotify?.('Accepting terms of use.')}
              className="hover:text-[#C9B8A0] cursor-pointer transition-colors"
            >
              Terms
            </button>
            <button
              onClick={() => onNotify?.('Media kits.')}
              className="hover:text-[#C9B8A0] cursor-pointer transition-colors"
            >
              Press
            </button>
          </div>

          {/* Concierge contact */}
          <button
            onClick={() => onNotify?.('Call primary concierge at +52 (322) 849-0122.')}
            className="block text-[8px] uppercase tracking-[0.2em] text-[#F5F1E8]/40 hover:text-[#C9B8A0] cursor-pointer transition-colors md:shrink-0"
          >
            Contact Concierge
          </button>
        </div>

        <p className="text-[9px] text-[#F5F1E8]/20 tracking-[0.12em] max-w-sm mx-auto md:mx-0 md:max-w-none leading-relaxed uppercase mt-6 md:mt-8 md:max-w-5xl md:mx-auto">
          © 2024 Vallarta Property Management. Architectural Precision in Hospitality.
        </p>
      </footer>

    </div>
  );
}
