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
    <div className="min-h-screen bg-transparent text-[#242424] font-sans flex flex-col justify-between pb-16 md:pb-20" id="deep-dive-container">
      
      {/* Top Bar Logo & Menu */}
      <header className="sticky top-0 bg-[#FAF8F5]/90 z-40 border-b border-[#7E7A74]/30 px-6 py-4 flex justify-between items-center backdrop-blur-xl" id="deep-dive-header">
        <h1 className="text-2xl md:text-3xl font-serif tracking-[0.1em] text-[#242424] cursor-pointer" onClick={() => onNavigate('reporting', 'push')}>
          Vallarta Estates
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
          <span className="text-[10px] tracking-[0.3em] font-medium text-[#242424]/50 block uppercase">
            Financial Analysis
          </span>
          <h2 className="text-4xl md:text-5xl font-serif tracking-wide text-[#242424]" id="deep-dive-header-title">
            Total Portfolio Yield
          </h2>
        </div>

        {/* Top Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="deep-dive-top-metrics">
          <div className="border border-[#7E7A74]/30 rounded-[2rem] p-6 bg-[#FAF8F5]" id="deep-dive-yield-box">
            <span className="text-[10px] tracking-[0.2em] text-[#242424]/50 font-medium block mb-1 uppercase">CURRENT QUARTER YIELD</span>
            <div className="flex justify-between items-baseline">
              <span className="text-4xl font-serif font-normal text-[#242424] tabular-nums">8.4%</span>
              <span className="text-xs text-green-700 font-sans flex items-center gap-1">
                <ArrowUpRight className="w-3.5 h-3.5" />
                +1.2% VS PREV. QUARTER
              </span>
            </div>
          </div>

          <div className="border border-[#7E7A74]/30 rounded-[2rem] p-6 bg-[#FAF8F5]" id="deep-dive-ytd-box">
            <span className="text-[10px] tracking-[0.2em] text-[#242424]/50 font-medium block mb-1 uppercase">YEAR-TO-DATE REVENUE</span>
            <div className="flex justify-between items-baseline">
              <span className="text-3xl font-serif font-normal text-[#242424] tabular-nums">$1,245,000</span>
              <span className="text-xs text-[#242424]/50 font-sans">
                Projected EOY: $1.8M
              </span>
            </div>
          </div>
        </div>

        {/* Revenue Velocity Chart */}
        <section className="space-y-4" id="deep-dive-velocity-section">
          <div className="flex justify-between items-center">
            <span className="text-3xl font-serif text-[#242424]">
              Revenue Velocity
            </span>
            <span className="text-[9px] font-sans tracking-widest text-[#242424]/60 border border-[#7E7A74]/30 rounded-full px-3 py-1 uppercase bg-[#FAF8F5]">
              YTD 2024
            </span>
          </div>

          <div className="border border-[#7E7A74]/30 rounded-[3rem] p-6 bg-white/20 backdrop-blur-md relative h-[220px]" id="revenue-velocity-canvas">
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
            <div className="flex justify-between text-[9px] font-sans text-neutral-400 mt-4 uppercase tracking-widest">
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
            <span className="text-3xl font-serif text-[#242424] block">
              Operational Expenses
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
                  className="w-full pl-9 pr-8 py-2 bg-[#FAF8F5] border border-[#7E7A74]/30 rounded-full text-xs focus:outline-none focus:border-[#242424] transition-colors font-sans tracking-wide"
                />
                {searchQuery && (
                  <button
                    type="button"
                    id="opex-search-clear-btn"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 p-1 text-neutral-400 hover:text-black transition-colors cursor-pointer"
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
                  className="w-full pl-4 pr-8 py-2 bg-[#FAF8F5] border border-[#7E7A74]/30 rounded-full text-xs focus:outline-none focus:border-[#242424] transition-colors font-sans tracking-wide appearance-none cursor-pointer"
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

          <div className="bg-[#FAF8F5] border border-[#7E7A74]/30 rounded-[2rem] divide-y divide-[#7E7A74]/20 overflow-hidden" id="opex-detail-table">
            {sortedExpenses.length > 0 ? (
              sortedExpenses.map((expense) => {
                const changeColor = expense.trend === 'down' ? 'text-green-700 font-sans' : 'text-amber-700 font-sans';
                return (
                  <div className="p-5 flex justify-between items-center hover:bg-[#7E7A74]/10 transition" id={`opex-row-${expense.id}`} key={expense.id}>
                    <div>
                      <span className="text-[#242424] font-serif text-lg block">{expense.category}</span>
                      <span className="text-[10px] text-[#242424]/50 font-sans uppercase tracking-wider block mt-0.5">
                        Modified: {expense.formattedDate}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="font-sans text-[#242424] font-light text-lg">{expense.amount}</p>
                      <span className={`text-[10px] ${changeColor}`}>{expense.change}</span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-8 text-center text-[#242424]/50 text-xs font-light" id="opex-empty-state">
                No expense category matched "{searchQuery}"
              </div>
            )}
          </div>
        </section>

        {/* Yield Correlation Panel matching fifth section */}
        <section className="border border-[#7E7A74]/30 rounded-[3rem] p-8 space-y-6 bg-white/20 backdrop-blur-md" id="deep-dive-correlation-card">
          <div className="space-y-2">
            <h4 className="text-2xl font-serif text-[#242424]">
              Yield Correlation
            </h4>
            <p className="text-xs text-[#242424]/60 font-light leading-relaxed">
              Analysis indicates a direct correlation between guest sentiment scores and sustained rental yield optimization.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4" id="correlation-boxes-row">
            <div className="bg-[#242424] text-[#FAF8F5] rounded-[2rem] p-6 text-center flex flex-col justify-between h-40 shadow-xl" id="box-avg-sentiment">
              <span className="text-4xl md:text-5xl font-serif font-normal text-amber-200 mt-2 tabular-nums">4.9</span>
              <div>
                <span className="block text-[9px] tracking-[0.2em] text-[#FAF8F5]/50 uppercase font-semibold">AVG SENTIMENT SCORE</span>
                <span className="text-[8px] font-sans tracking-widest text-[#FAF8F5]/40 uppercase mt-1 block">Top 5% Portfolio Tier</span>
              </div>
            </div>

            <div className="bg-[#242424] text-[#FAF8F5] rounded-[2rem] p-6 text-center flex flex-col justify-between h-40 shadow-xl" id="box-premium-capture">
              <span className="text-4xl md:text-5xl font-serif font-normal text-amber-200 mt-2 tabular-nums">+14%</span>
              <div>
                <span className="block text-[9px] tracking-[0.2em] text-[#FAF8F5]/50 uppercase font-semibold">PREMIUM CAPTURE</span>
                <span className="text-[8px] font-sans tracking-widest text-[#FAF8F5]/40 uppercase mt-1 block">% Above Market Baseline</span>
              </div>
            </div>
          </div>
        </section>

        {/* Action PDF button */}
        <button
          onClick={startDownload}
          disabled={downloading}
          id="download-full-fiscal-report-btn"
          className="w-full bg-[#242424] hover:bg-[#242424]/80 text-[#FAF8F5] py-4 text-xs font-semibold tracking-[0.25em] uppercase flex items-center justify-center gap-2 cursor-pointer shadow-lg transition-all disabled:opacity-80 rounded-full magnetic-btn"
        >
          <Download className="w-4 h-4 shrink-0" />
          {downloading ? 'PREPARING DOCUMENT...' : 'DOWNLOAD FULL FISCAL REPORT (PDF)'}
        </button>

      </main>

      {/* Floating Bottom Menu Bar matching page 4 mockup design */}
      <footer className="fixed bottom-0 left-0 right-0 border-t border-[#7E7A74]/30 bg-[#FAF8F5]/95 backdrop-blur-xl px-4 py-3 flex justify-around items-center z-50 text-[#242424] shadow-[0_-10px_40px_rgba(28,25,23,0.05)] rounded-t-[2rem]" id="deep-dive-bottom-bar">
        <button 
          onClick={() => onNavigate('reporting', 'push')}
          className="flex flex-col items-center justify-center p-1.5 hover:text-[#242424] transition text-[#242424]/50 cursor-pointer"
          id="tab-btn-dashboard"
        >
          <LayoutDashboard className="w-5 h-5 mb-1" />
          <span className="text-[8px] tracking-[0.1em] font-semibold uppercase">Dashboard</span>
        </button>

        <button 
          onClick={() => onNavigate('reporting', 'push')}
          className="flex flex-col items-center justify-center p-1.5 hover:text-[#242424] transition text-[#242424]/50 cursor-pointer"
          id="tab-btn-portfolio"
        >
          <Briefcase className="w-5 h-5 mb-1" />
          <span className="text-[8px] tracking-[0.1em] font-semibold uppercase">Portfolio</span>
        </button>

        <button 
          onClick={() => onNavigate('deep_dive', 'push')}
          className="flex flex-col items-center justify-center p-1.5 text-[#242424] transition cursor-pointer"
          id="tab-btn-reports"
        >
          <FileBarChart className="w-5 h-5 mb-1 text-[#242424]" />
          <span className="text-[8px] tracking-[0.1em] font-bold uppercase text-[#242424]">Reports</span>
        </button>

        <button 
          onClick={() => onNavigate('nav_menu', 'slide_up')}
          className="flex flex-col items-center justify-center p-1.5 hover:text-[#242424] transition text-[#242424]/50 cursor-pointer"
          id="tab-btn-settings"
        >
          <Settings className="w-5 h-5 mb-1" />
          <span className="text-[8px] tracking-[0.1em] font-semibold uppercase">Settings</span>
        </button>
      </footer>

    </div>
  );
}
