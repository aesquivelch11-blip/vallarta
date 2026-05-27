import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Menu, ArrowUpRight, ArrowDownRight, FileText, Download, LayoutDashboard, Briefcase, FileBarChart, Settings, Search, X } from 'lucide-react';
import { ScreenType } from '../types';

interface FinancialDeepDiveViewProps {
  onNavigate: (screen: ScreenType, transitionStyle: 'push' | 'slide_up') => void;
  onNotify?: (message: string) => void;
}

interface ExpenseItem {
  id: string;
  category: string;
  amount: string;
  amountValue: number;
  change: string;
  changeValue: number;
  date: string;
  formattedDate: string;
  trend: 'up' | 'down' | 'stable';
}

const EXPENSES_DATA: ExpenseItem[] = [
  { id: 'management', category: 'Estate Management', amount: '$45,200', amountValue: 45200, change: '-2.1%', changeValue: -2.1, date: '2024-10-25', formattedDate: 'OCT 25, 2024', trend: 'down' },
  { id: 'maintenance', category: 'Maintenance & Upkeep', amount: '$28,500', amountValue: 28500, change: '+4.5%', changeValue: 4.5, date: '2024-10-26', formattedDate: 'OCT 26, 2024', trend: 'up' },
  { id: 'utilities', category: 'Utilities & Infrastructure', amount: '$18,900', amountValue: 18900, change: '-0.8%', changeValue: -0.8, date: '2024-10-22', formattedDate: 'OCT 22, 2024', trend: 'down' },
];

export default function FinancialDeepDiveView({ onNavigate, onNotify }: FinancialDeepDiveViewProps) {
  const [downloading, setDownloading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'highest' | 'newest'>('highest');

  const filteredExpenses = EXPENSES_DATA.filter((item) =>
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedExpenses = [...filteredExpenses].sort((a, b) => {
    if (sortBy === 'highest') {
      return b.amountValue - a.amountValue;
    } else {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
  });

  const startDownload = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      if (onNotify) {
        onNotify('Your fiscal PDF report has been prepared and downloaded successfully.');
      } else {
        alert('Your fiscal PDF report has been prepared and downloaded successfully.');
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-stone-50 text-neutral-900 font-sans flex flex-col justify-between pb-16 md:pb-20" id="deep-dive-container">
      
      {/* Top Bar Logo & Menu */}
      <header className="sticky top-0 bg-stone-50/90 z-40 border-b border-stone-200/60 px-6 py-4 flex justify-between items-center" id="deep-dive-header">
        <h1 className="text-xl md:text-2xl font-serif tracking-[0.2em] text-neutral-900 font-light cursor-pointer" onClick={() => onNavigate('reporting', 'push')}>
          VALLARTA
        </h1>
        
        {/* Menu button specifically mapped to open Navigation Menu */}
        <button 
          aria-label="Menu"
          id="deep-dive-menu-btn"
          onClick={() => onNavigate('nav_menu', 'slide_up')}
          className="p-2 text-neutral-800 hover:text-neutral-500 transition-colors duration-200 cursor-pointer"
        >
          <Menu className="w-6 h-6" />
        </button>
      </header>

      {/* Main Analysis Section */}
      <main className="max-w-4xl mx-auto px-6 py-8 space-y-10 w-full" id="deep-dive-main-section">
        
        {/* Page title */}
        <div className="space-y-1" id="deep-dive-title-group">
          <span className="text-[10px] tracking-[0.3em] font-medium text-neutral-400 block uppercase">
            FINANCIAL ANALYSIS
          </span>
          <h2 className="text-3xl font-serif tracking-wide text-neutral-900" id="deep-dive-header-title">
            TOTAL PORTFOLIO YIELD
          </h2>
        </div>

        {/* Top Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="deep-dive-top-metrics">
          <div className="border border-stone-200 p-6 bg-white/50" id="deep-dive-yield-box">
            <span className="text-[10px] tracking-[0.2em] text-neutral-400 font-medium block mb-1">CURRENT QUARTER YIELD</span>
            <div className="flex justify-between items-baseline">
              <span className="text-4xl font-serif text-neutral-900">8.4%</span>
              <span className="text-xs text-green-700 font-mono flex items-center gap-1">
                <ArrowUpRight className="w-3.5 h-3.5" />
                +1.2% VS PREV. QUARTER
              </span>
            </div>
          </div>

          <div className="border border-stone-200 p-6 bg-white/50" id="deep-dive-ytd-box">
            <span className="text-[10px] tracking-[0.2em] text-neutral-400 font-medium block mb-1">YEAR-TO-DATE REVENUE</span>
            <div className="flex justify-between items-baseline">
              <span className="text-3xl font-serif text-neutral-900">$1,245,000</span>
              <span className="text-xs text-neutral-500 font-mono">
                Projected EOY: $1.8M
              </span>
            </div>
          </div>
        </div>

        {/* Revenue Velocity Chart */}
        <section className="space-y-4" id="deep-dive-velocity-section">
          <div className="flex justify-between items-center">
            <span className="text-xs tracking-[0.25em] text-neutral-800 font-medium uppercase font-serif">
              REVENUE VELOCITY
            </span>
            <span className="text-[9px] font-mono tracking-widest text-neutral-400 border border-neutral-200 px-2 py-1 uppercase bg-white">
              YTD 2024
            </span>
          </div>

          <div className="border border-stone-200 p-6 bg-white/60 relative h-[220px]" id="revenue-velocity-canvas">
            {/* Elegant SVG filling most of the space */}
            <svg viewBox="0 0 500 150" className="w-full h-full text-stone-200 fill-current overflow-visible">
              <defs>
                <linearGradient id="gradient-velocity" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgb(229, 229, 224)" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="rgb(250, 250, 250)" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* Horizontal Help lines */}
              <line x1="0" y1="30" x2="500" y2="30" stroke="#eeeeea" strokeWidth="1" />
              <line x1="0" y1="75" x2="500" y2="75" stroke="#eeeeea" strokeWidth="1" />
              <line x1="0" y1="120" x2="500" y2="120" stroke="#eeeeea" strokeWidth="1" />

              {/* Styled Area wave */}
              <path 
                d="M 0 140 Q 50 110 100 130 T 150 90 T 200 100 T 250 60 T 300 70 T 350 45 T 400 55 T 450 30 T 500 20 L 500 150 L 0 150 Z" 
                fill="url(#gradient-velocity)" 
              />
              {/* Stroke */}
              <path 
                d="M 0 140 Q 50 110 100 130 T 150 90 T 200 100 T 250 60 T 300 70 T 350 45 T 400 55 T 450 30 T 500 20" 
                fill="none" 
                stroke="#1c1917" 
                strokeWidth="1.5" 
              />

              {/* Peak pointer circles */}
              <circle cx="500" cy="20" r="3" fill="#1c1917" />
            </svg>

            {/* Labels aligned */}
            <div className="flex justify-between text-[9px] font-mono text-neutral-400 mt-4 uppercase tracking-widest">
              <span>JAN</span>
              <span>FEB</span>
              <span>MAR</span>
              <span>APR</span>
              <span>MAY</span>
              <span>JUN</span>
              <span>JUL</span>
              <span>AUG</span>
              <span>SEP</span>
            </div>
          </div>
        </section>

        {/* Operational Expenses */}
        <section className="space-y-4" id="deep-dive-opex-section">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <span className="text-xs tracking-[0.25em] text-neutral-800 font-medium uppercase font-serif block">
              OPERATIONAL EXPENSES
            </span>
            
            {/* Search and Sort Filter Group */}
            <div className="flex flex-col sm:flex-row gap-3 items-center w-full sm:w-auto" id="opex-filters-group">
              {/* Search Input Bar */}
              <div className="relative flex items-center w-full sm:w-56" id="opex-search-wrapper">
                <Search className="absolute left-3 w-4 h-4 text-neutral-400" />
                <input
                  type="text"
                  id="opex-search-input"
                  placeholder="Search expense category..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-8 py-1.5 bg-white border border-stone-200 text-xs focus:outline-none focus:border-neutral-900 transition-colors font-sans tracking-wide"
                />
                {searchQuery && (
                  <button
                    type="button"
                    id="opex-search-clear-btn"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 p-1 text-neutral-400 hover:text-black transition-colors cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* Sort Dropdown Selector */}
              <div className="relative flex items-center w-full sm:w-48" id="opex-sort-wrapper">
                <select
                  id="opex-sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'highest' | 'newest')}
                  className="w-full pl-3 pr-8 py-1.5 bg-white border border-stone-200 text-xs focus:outline-none focus:border-neutral-900 transition-colors font-sans tracking-wide appearance-none cursor-pointer"
                >
                  <option value="highest">SORT: HIGHEST COST</option>
                  <option value="newest">SORT: NEWEST CHANGE</option>
                </select>
                <div className="absolute right-3 pointer-events-none text-neutral-400">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-stone-200 divide-y divide-stone-100" id="opex-detail-table">
            {sortedExpenses.length > 0 ? (
              sortedExpenses.map((expense) => {
                const changeColor = expense.trend === 'down' ? 'text-green-700 font-mono' : 'text-amber-700 font-mono';
                return (
                  <div className="p-4 flex justify-between items-center hover:bg-stone-50 transition" id={`opex-row-${expense.id}`} key={expense.id}>
                    <div>
                      <span className="text-stone-800 font-serif text-sm block">{expense.category}</span>
                      <span className="text-[10px] text-neutral-400 font-mono uppercase tracking-wider block mt-0.5">
                        Modified: {expense.formattedDate}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="font-serif text-stone-900 font-light">{expense.amount}</p>
                      <span className={`text-[10px] ${changeColor}`}>{expense.change}</span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-8 text-center text-neutral-400 text-xs font-light" id="opex-empty-state">
                No expense category matched "{searchQuery}"
              </div>
            )}
          </div>
        </section>

        {/* Yield Correlation Panel matching fifth section */}
        <section className="border border-stone-200 p-6 space-y-6 bg-white/40" id="deep-dive-correlation-card">
          <div className="space-y-2">
            <h4 className="text-sm font-semibold tracking-wider text-stone-800 font-serif">
              YIELD CORRELATION
            </h4>
            <p className="text-xs text-neutral-500 font-light leading-relaxed">
              Analysis indicates a direct correlation between guest sentiment scores and sustained rental yield optimization.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4" id="correlation-boxes-row">
            <div className="bg-stone-950 text-white p-5 text-center flex flex-col justify-between h-32" id="box-avg-sentiment">
              <span className="text-3xl md:text-4xl font-serif text-amber-200 font-light mt-2">4.9</span>
              <div>
                <span className="block text-[8px] tracking-[0.2em] text-neutral-400 uppercase font-semibold">AVG SENTIMENT SCORE</span>
                <span className="text-[7.5px] font-mono tracking-widest text-neutral-500 uppercase">Top 5% Portfolio Tier</span>
              </div>
            </div>

            <div className="bg-stone-950 text-white p-5 text-center flex flex-col justify-between h-32" id="box-premium-capture">
              <span className="text-3xl md:text-4xl font-serif text-amber-200 font-light mt-2">+14%</span>
              <div>
                <span className="block text-[8px] tracking-[0.2em] text-neutral-400 uppercase font-semibold">PREMIUM CAPTURE</span>
                <span className="text-[7.5px] font-mono tracking-widest text-neutral-500 uppercase">% Above Market Baseline</span>
              </div>
            </div>
          </div>
        </section>

        {/* Action PDF button */}
        <button
          onClick={startDownload}
          disabled={downloading}
          id="download-full-fiscal-report-btn"
          className="w-full bg-neutral-900 hover:bg-neutral-800 text-stone-50 py-4 text-xs font-semibold tracking-[0.25em] uppercase flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-[0.99] transition-all disabled:opacity-80"
        >
          <Download className={`w-4 h-4 shrink-0 ${downloading ? 'animate-bounce' : ''}`} />
          {downloading ? 'PREPARING DOCUMENT...' : 'DOWNLOAD FULL FISCAL REPORT (PDF)'}
        </button>

      </main>

      {/* Floating Bottom Menu Bar matching page 4 mockup design */}
      <footer className="fixed bottom-0 left-0 right-0 border-t border-stone-200 bg-white/95 px-4 py-2 flex justify-around items-center z-50 text-stone-600 shadow-md" id="deep-dive-bottom-bar">
        <button 
          onClick={() => onNavigate('reporting', 'push')}
          className="flex flex-col items-center justify-center p-1.5 hover:text-neutral-900 transition text-stone-400 cursor-pointer"
          id="tab-btn-dashboard"
        >
          <LayoutDashboard className="w-4 h-4 md:w-5 h-5 mb-0.5" />
          <span className="text-[8px] tracking-[0.1em] font-semibold uppercase">Dashboard</span>
        </button>

        <button 
          onClick={() => onNavigate('reporting', 'push')}
          className="flex flex-col items-center justify-center p-1.5 hover:text-neutral-900 transition text-stone-400 cursor-pointer"
          id="tab-btn-portfolio"
        >
          <Briefcase className="w-4 h-4 md:w-5 h-5 mb-0.5" />
          <span className="text-[8px] tracking-[0.1em] font-semibold uppercase">Portfolio</span>
        </button>

        <button 
          onClick={() => onNavigate('deep_dive', 'push')}
          className="flex flex-col items-center justify-center p-1.5 text-neutral-950 transition cursor-pointer"
          id="tab-btn-reports"
        >
          <FileBarChart className="w-4 h-4 md:w-5 h-5 mb-0.5 text-neutral-900" />
          <span className="text-[8px] tracking-[0.1em] font-bold uppercase text-neutral-900">Reports</span>
        </button>

        <button 
          onClick={() => onNavigate('nav_menu', 'slide_up')}
          className="flex flex-col items-center justify-center p-1.5 hover:text-neutral-900 transition text-stone-400 cursor-pointer"
          id="tab-btn-settings"
        >
          <Settings className="w-4 h-4 md:w-5 h-5 mb-0.5" />
          <span className="text-[8px] tracking-[0.1em] font-semibold uppercase">Settings</span>
        </button>
      </footer>

    </div>
  );
}
