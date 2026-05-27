import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Menu, TrendingUp, Calendar, AlertCircle, ArrowUpRight, ArrowRight, Shield, Settings, Eye, Info } from 'lucide-react';
import { ScreenType } from '../types';

interface FinancialReportingViewProps {
  onNavigate: (screen: ScreenType, transitionStyle: 'push' | 'slide_up') => void;
  onNotify?: (message: string) => void;
}

export default function FinancialReportingView({ onNavigate, onNotify }: FinancialReportingViewProps) {
  const [activeTab, setActiveTab] = useState<'timeline' | 'calendar'>('timeline');
  const [hoveredMetric, setHoveredMetric] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-stone-50 text-neutral-900 font-sans flex flex-col justify-between" id="reporting-view-wrapper">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 bg-stone-50/90 z-40 border-b border-stone-200/60 px-6 py-4 flex justify-between items-center" id="reporting-header">
        <h1 className="text-xl md:text-2xl font-serif tracking-[0.2em] text-neutral-900 font-light cursor-pointer" onClick={() => onNavigate('reporting', 'push')}>
          VALLARTA
        </h1>
        
        {/* Menu button explicitly triggering transition to Navigation Menu */}
        <button 
          aria-label="Menu"
          id="reporting-menu-btn"
          onClick={() => onNavigate('nav_menu', 'slide_up')}
          className="p-2 text-neutral-800 hover:text-neutral-500 transition-colors duration-200 cursor-pointer"
        >
          <Menu className="w-6 h-6" />
        </button>
      </header>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto px-6 py-8 space-y-12 w-full" id="reporting-main-content">
        
        {/* Part 1: Casa Obsidiana Hero Card */}
        <motion.section 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative h-[250px] md:h-[350px] overflow-hidden bg-stone-900 group"
          id="casa-obsidiana-hero"
        >
          <img 
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
            alt="Casa Obsidiana Estate"
            className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700 ease-out"
            referrerPolicy="no-referrer"
          />
          {/* Ambient vignette gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20" />
          
          {/* Overlaid details */}
          <div className="absolute bottom-6 left-6 right-6 text-white flex flex-col justify-end">
            <span className="text-[10px] tracking-[0.3em] uppercase text-amber-200 font-light">
              PUERTO VALLARTA, MEXICO — ESTATE 04
            </span>
            <div className="flex flex-col md:flex-row md:justify-between md:items-end mt-1">
              <div>
                <h2 className="text-3xl md:text-4xl font-serif tracking-wider" id="hero-estate-title">
                  CASA OBSIDIANA
                </h2>
              </div>
              <p className="text-xs text-stone-300 font-light max-w-xs mt-2 md:mt-0 md:text-right">
                Architectural oversight and integrated property intelligence console.
              </p>
            </div>
          </div>
        </motion.section>

        {/* Part 2: Metrics */}
        <section className="space-y-4" id="reporting-metrics-section">
          <div className="flex items-center gap-4">
            <h3 className="text-2xl font-serif tracking-wide text-neutral-800">METRICS</h3>
            <div className="flex-1 h-[1px] bg-neutral-200" />
          </div>
          <p className="text-xs text-neutral-500 font-light">
            Operational and financial performance for the current fiscal period.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-4" id="metrics-grid">
            {/* REVENUE */}
            <div 
              className="border-b border-stone-200 pb-4 flex flex-col justify-between h-24 hover:border-neutral-900 transition-all duration-300 pointer-events-auto cursor-help"
              onMouseEnter={() => setHoveredMetric('revenue')}
              onMouseLeave={() => setHoveredMetric(null)}
              id="metric-revenue-card"
            >
              <span className="text-[10px] tracking-[0.2em] text-neutral-400 font-medium">REVENUE</span>
              <div className="my-1">
                <span className="text-xl md:text-2xl font-serif text-neutral-900">$124,500</span>
              </div>
              <div className="flex items-center gap-1 text-[10px] uppercase font-mono tracking-wider text-green-700">
                <TrendingUp className="w-3 h-3 shrink-0" />
                <span>+14%</span>
              </div>
            </div>

            {/* YIELD */}
            <div 
              className="border-b border-stone-200 pb-4 flex flex-col justify-between h-24 hover:border-neutral-900 transition-all duration-300 cursor-pointer"
              onClick={() => onNavigate('deep_dive', 'push')}
              id="metric-yield-card"
            >
              <span className="text-[10px] tracking-[0.2em] text-neutral-400 font-medium">YIELD</span>
              <div className="my-1">
                <span className="text-xl md:text-2xl font-serif text-neutral-900">$1,450</span>
              </div>
              <span className="text-[9px] uppercase font-mono tracking-wider text-neutral-400">
                — STABLE
              </span>
            </div>

            {/* OCCUPANCY */}
            <div 
              className="border-b border-stone-200 pb-4 flex flex-col justify-between h-24 hover:border-neutral-900 transition-all duration-300 cursor-pointer"
              onClick={() => onNavigate('calendar', 'push')}
              id="metric-occupancy-card"
            >
              <span className="text-[10px] tracking-[0.2em] text-neutral-400 font-medium font-semibold">OCCUPANCY</span>
              <div className="my-1">
                <span className="text-xl md:text-2xl font-serif text-neutral-900">88%</span>
              </div>
              <span className="text-[9px] uppercase font-mono tracking-wider text-green-700/80">
                +3% VS PREV. MONTH
              </span>
            </div>

            {/* SENTIMENT */}
            <div 
              className="border-b border-stone-200 pb-4 flex flex-col justify-between h-24 hover:border-neutral-900 transition-all duration-300 pointer-events-auto"
              id="metric-sentiment-card"
            >
              <span className="text-[10px] tracking-[0.2em] text-neutral-400 font-medium">SENTIMENT</span>
              <div className="my-1">
                <span className="text-xl md:text-2xl font-serif text-neutral-900">4.9<span className="text-xs text-neutral-400 font-sans">/5</span></span>
              </div>
              <span className="text-[9px] uppercase font-mono tracking-wider text-neutral-500">
                TOP 5% IN REGION
              </span>
            </div>
          </div>
        </section>

        {/* Part 3: Supervision */}
        <section className="space-y-4" id="reporting-supervision-section">
          <div className="flex items-center gap-4">
            <h3 className="text-2xl font-serif tracking-wide text-neutral-800">SUPERVISION</h3>
            <div className="flex-1 h-[1px] bg-neutral-200" />
          </div>

          <div className="grid grid-cols-3 gap-4 pt-2 text-center text-stone-800" id="supervision-stats">
            <div className="bg-stone-100 p-4 border border-stone-200/60" id="supervision-security">
              <span className="block text-[9px] tracking-[0.2em] uppercase text-neutral-400 mb-1">SECURITY</span>
              <div className="flex items-center justify-center gap-1.5 font-serif text-sm">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse inline-block" />
                <span>Active</span>
              </div>
            </div>

            <div className="bg-stone-100 p-4 border border-stone-200/60" id="supervision-maintenance">
              <span className="block text-[9px] tracking-[0.2em] uppercase text-neutral-400 mb-1">MAINTENANCE</span>
              <span className="font-serif text-sm">On Schedule</span>
            </div>

            <div className="bg-stone-100 p-4 border border-stone-200/60" id="supervision-staff">
              <span className="block text-[9px] tracking-[0.2em] uppercase text-neutral-400 mb-1">STAFF</span>
              <span className="font-serif text-sm">4 On-Site</span>
            </div>
          </div>

          {/* Camera Card */}
          <div 
            onClick={() => onNavigate('camera_expanded', 'push')}
            className="group relative h-[180px] overflow-hidden cursor-pointer border border-stone-200"
            id="supervision-camera-card"
          >
            <img 
              src="https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=800&q=80"
              alt="Pool camera feed preview"
              className="w-full h-full object-cover transition duration-500 group-hover:scale-[1.03]"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />

            {/* Badges */}
            <span className="absolute top-4 left-4 bg-red-600 text-white text-[9px] tracking-widest uppercase font-semibold px-2 py-1 flex items-center gap-1.5" id="camera-live-badge">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              LIVE
            </span>

            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end text-white">
              <div>
                <p className="text-[10px] tracking-wider text-stone-300 uppercase">CAM 02 : POOL TERRACE</p>
                <h4 className="text-lg font-serif">OBSIDIANA MAIN SUITE VIEW</h4>
              </div>
              <button 
                id="view-cameras-btn"
                className="bg-white/10 hover:bg-white text-white hover:text-black border border-white/30 hover:border-white px-4 py-2 text-[10px] uppercase tracking-[0.2em] font-medium transition-all duration-300 cursor-pointer"
              >
                VIEW CAMERAS
              </button>
            </div>
          </div>
        </section>

        {/* Part 4: Reporting & Profit Breakdown */}
        <section className="space-y-4" id="reporting-analysis-section">
          <div className="flex items-center gap-4">
            <h3 className="text-2xl font-serif tracking-wide text-neutral-800">REPORTING</h3>
            <div className="flex-1 h-[1px] bg-neutral-200" />
          </div>
          <p className="text-xs text-neutral-500 font-light">
            Detailed analysis of revenue streams, operational expenses, and seasonal trends.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-stone-800" id="financial-reports-summary">
            <div className="border border-stone-200 p-6 flex flex-col justify-between" id="report-net-profit">
              <span className="text-[9px] tracking-[0.2em] text-neutral-400 font-medium">NET PROFIT</span>
              <div className="my-2 flex items-baseline justify-between">
                <span className="text-2xl font-serif text-neutral-900">$84,200</span>
                <span className="text-xs text-green-700 font-mono">+8%</span>
              </div>
              <span className="text-[8px] text-stone-400">POST TAXES & MANAGEMENT COMMISSION</span>
            </div>

            <div className="border border-stone-200 p-6 flex flex-col justify-between" id="report-opex">
              <span className="text-[9px] tracking-[0.2em] text-neutral-400 font-medium">OPEX</span>
              <div className="my-2 flex items-baseline justify-between">
                <span className="text-2xl font-serif text-neutral-900">$40,300</span>
                <span className="text-xs text-stone-400 font-mono">STABLE</span>
              </div>
              <span className="text-[8px] text-stone-400">MAINTENANCE, TELEMETRY & SECURITY OVERHEAD</span>
            </div>
          </div>

          <button
            onClick={() => onNavigate('deep_dive', 'push')}
            id="view-financial-reports-btn"
            className="w-full bg-transparent text-neutral-900 hover:bg-neutral-900 hover:text-stone-50 border border-neutral-300 hover:border-neutral-900 py-3.5 text-xs font-semibold tracking-[0.2em] uppercase transition-all duration-300 cursor-pointer"
          >
            VIEW FINANCIAL REPORTS
          </button>
        </section>

        {/* Part 5: Arrival Timeline & Tabs */}
        <section className="space-y-4" id="reporting-timeline-section">
          <div className="flex justify-between items-end border-b border-stone-200 pb-3">
            <span className="text-[10px] tracking-[0.3em] uppercase text-neutral-400 font-bold block">
              ARRIVAL TIMELINE
            </span>
            <div className="flex gap-4 text-xs tracking-widest font-light" id="timeline-tabs">
              <button 
                id="timeline-tab-btn"
                onClick={() => {
                  setActiveTab('timeline');
                }}
                className={`uppercase cursor-pointer pb-1 transition-all ${
                  activeTab === 'timeline' ? 'font-medium border-b border-black text-black' : 'text-stone-400 hover:text-black'
                }`}
              >
                TIMELINE
              </button>
              <button 
                id="calendar-tab-btn"
                onClick={() => {
                  onNavigate('calendar', 'push');
                }}
                className="uppercase text-stone-400 hover:text-black transition-all cursor-pointer pb-1"
              >
                CALENDAR
              </button>
            </div>
          </div>

          {/* List group */}
          <div className="space-y-4" id="arrival-timeline-list">
            <div className="flex justify-between items-start border-b border-stone-200/50 pb-3" id="arrival-1">
              <div>
                <h5 className="font-serif text-[15px] text-neutral-800">The Sinclair Family</h5>
                <p className="text-[10px] uppercase font-mono tracking-wider text-neutral-400 mt-0.5">
                  OCT 12 — 19 • 7 NIGHTS
                </p>
              </div>
              <span className="bg-amber-100 text-amber-900 text-[8px] tracking-[0.15em] font-mono uppercase px-2 py-0.5">
                OWNER USE
              </span>
            </div>

            <div className="flex justify-between items-start border-b border-stone-200/50 pb-3" id="arrival-2">
              <div>
                <h5 className="font-serif text-[15px] text-neutral-800">M. Dubois</h5>
                <p className="text-[10px] uppercase font-mono tracking-wider text-neutral-400 mt-0.5">
                  OCT 18 — 21 • 3 NIGHTS
                </p>
              </div>
              <span className="bg-stone-200 text-stone-800 text-[8px] tracking-[0.15em] font-mono uppercase px-2 py-0.5">
                ACCEPTED GUEST
              </span>
            </div>

            <div className="flex justify-between items-start pb-2" id="arrival-3">
              <div>
                <h5 className="font-serif text-[15px] text-neutral-800">The Al-Sayed Party</h5>
                <p className="text-[10px] uppercase font-mono tracking-wider text-neutral-400 mt-0.5">
                  OCT 24 — NOV 02 • 9 NIGHTS
                </p>
              </div>
              <span className="bg-amber-100 text-amber-900 text-[8px] tracking-[0.15em] font-mono uppercase px-2 py-0.5">
                OWNER USE
              </span>
            </div>
          </div>
        </section>

        {/* Part 6: Custom SVG Line/Area Chart */}
        <section className="border border-stone-200 p-6 space-y-4 bg-white/40" id="reporting-chart-card">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-semibold tracking-[0.25em] text-neutral-400 uppercase">
              YIELD PERFORMANCE
            </span>
            <div className="bg-neutral-900 text-white text-[10px] font-mono tracking-widest uppercase py-1 px-3" id="chart-latest-tooltip">
              $1,450
            </div>
          </div>

          <div className="relative h-[120px] w-full mt-4" id="reporting-chart-canvas">
            {/* SVG custom area chart */}
            <svg viewBox="0 0 500 100" className="w-full h-full text-stone-300 fill-current overflow-visible">
              <defs>
                <linearGradient id="gradient-area" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgb(220, 220, 215)" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="rgb(250, 250, 250)" stopOpacity="0" />
                </linearGradient>
              </defs>
              
              {/* Grid Lines */}
              <line x1="0" y1="20" x2="500" y2="20" stroke="#f1f1ee" strokeWidth="1" />
              <line x1="0" y1="50" x2="500" y2="50" stroke="#f1f1ee" strokeWidth="1" />
              <line x1="0" y1="80" x2="500" y2="80" stroke="#f1f1ee" strokeWidth="1" strokeDasharray="2,2" />

              {/* Area path */}
              <path 
                d="M 0 90 Q 50 60 100 80 T 200 40 T 300 70 T 400 35 T 500 10 L 500 100 L 0 100 Z" 
                fill="url(#gradient-area)" 
              />
              
              {/* Line path */}
              <path 
                d="M 0 90 Q 50 60 100 80 T 200 40 T 300 70 T 400 35 T 500 10" 
                fill="none" 
                stroke="#1c1917" 
                strokeWidth="1.5" 
              />

              {/* End dot */}
              <circle cx="500" cy="10" r="3.5" fill="#1c1917" />
              <circle cx="500" cy="10" r="6" fill="transparent" stroke="#1c1917" strokeWidth="1" className="animate-ping" />
            </svg>

            {/* Labels overlay */}
            <div className="flex justify-between text-[9px] font-mono text-neutral-400 mt-2 uppercase tracking-widest">
              <span>MAY</span>
              <span>JUN</span>
              <span>JUL</span>
              <span>AUG</span>
              <span>SEP</span>
              <span>OCT</span>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="bg-neutral-900 text-stone-400 py-12 px-6 border-t border-white/5 mt-16 text-center" id="reporting-footer">
        <h4 className="text-xl font-serif text-white tracking-[0.2em] mb-4">VALLARTA</h4>
        <div className="flex justify-center gap-6 text-[9px] uppercase tracking-[0.2em] mb-6 text-stone-400">
          <button onClick={() => onNotify ? onNotify('Secure privacy guidelines.') : alert('Secure privacy guidelines.')} className="hover:text-white cursor-pointer transition-colors">PRIVACY</button>
          <button onClick={() => onNotify ? onNotify('Accepting terms of use.') : alert('Accepting terms of use.')} className="hover:text-white cursor-pointer transition-colors">TERMS</button>
          <button onClick={() => onNotify ? onNotify('Media kits.') : alert('Media kits.')} className="hover:text-white cursor-pointer transition-colors">PRESS</button>
          <button onClick={() => onNotify ? onNotify('Call primary concierge at +52 (322) 849-0122.') : alert('Call primary concierge at +52 (322) 849-0122.')} className="hover:text-white cursor-pointer transition-colors">CONTACT</button>
        </div>
        <p className="text-[10px] text-stone-500 tracking-[0.15em] max-w-sm mx-auto leading-relaxed uppercase">
          © 2024 VALLARTA PROPERTY MANAGEMENT. ARCHITECTURAL PRECISION IN HOSPITALITY.
        </p>
      </footer>
    </div>
  );
}
