import React, { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Menu, ArrowUpRight, ArrowDownRight, Download, Search, X } from 'lucide-react';
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

function FastReveal({ children, className, style }: { children: React.ReactNode, className?: string, style?: React.CSSProperties }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      style={style}
      initial={reduce ? false : { opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.05 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

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
    <div className="min-h-[100dvh] flex flex-col" style={{ background: 'var(--color-canvas)', color: 'var(--color-ink)', fontFamily: 'var(--font-ui)' }} id="deep-dive-container">
      
      {/* Top Bar Logo & Menu */}
      <header
        className="sticky top-0 z-40 px-8 py-5 flex justify-between items-center"
        style={{
          background: 'color-mix(in srgb, var(--color-canvas) 90%, transparent)',
          borderBottom: '1px solid var(--color-border-subtle)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        }}
        id="deep-dive-header"
      >
        <h1 className="text-xl md:text-2xl font-serif cursor-pointer" style={{ color: 'var(--color-ink)' }} onClick={() => onNavigate('nav_menu', 'push')}>
          Vallarta Estates
        </h1>
        <button 
          aria-label="Menu"
          id="deep-dive-menu-btn"
          onClick={() => onNavigate('nav_menu', 'slide_up')}
          className="p-2 cursor-pointer deep-dive-menu-btn"
        >
          <Menu className="w-5 h-5" />
        </button>
      </header>

      {/* Main Analysis Section - Split Layout */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 w-full max-w-[1800px] mx-auto" id="deep-dive-main-section">
        
        {/* Left Column: Dense Editorial Data */}
        <div className="lg:col-span-8 xl:col-span-8 p-8 md:p-12 lg:p-16 flex flex-col gap-16 lg:gap-24">
          
          {/* Hero Metrics (Unboxed) */}
          <FastReveal className="space-y-12">
            <div className="space-y-6">
              <h2 className="text-5xl md:text-7xl lg:text-[6rem] font-serif leading-[0.9] tracking-tighter" style={{ color: 'var(--color-ink)' }} id="deep-dive-header-title">
                Portfolio<br/>Yield.
              </h2>
              <p className="text-lg max-w-[40ch] leading-relaxed" style={{ color: 'var(--color-ink-secondary)' }}>
                Year-to-date fiscal performance, measured against internal forecasts and market baseline.
              </p>
            </div>

            <div className="flex flex-wrap gap-x-16 gap-y-8 pt-8 border-t" style={{ borderColor: 'var(--color-border-subtle)' }} id="deep-dive-top-metrics">
              <div>
                <span className="text-[10px] uppercase tracking-widest font-semibold block mb-2" style={{ color: 'var(--color-ink-secondary)' }}>Q4 Yield</span>
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl lg:text-5xl font-serif tabular-nums" style={{ color: 'var(--color-ink)' }}>8.4%</span>
                  <span className="text-sm flex items-center" style={{ color: 'var(--color-accent-positive)' }}>
                    <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
                    1.2%
                  </span>
                </div>
              </div>

              <div>
                <span className="text-[10px] uppercase tracking-widest font-semibold block mb-2" style={{ color: 'var(--color-ink-secondary)' }}>YTD Revenue</span>
                <span className="text-4xl lg:text-5xl font-serif tabular-nums block" style={{ color: 'var(--color-ink)' }}>$1.24M</span>
              </div>
              
              <div>
                <span className="text-[10px] uppercase tracking-widest font-semibold block mb-2" style={{ color: 'var(--color-ink-secondary)' }}>Premium</span>
                <span className="text-4xl lg:text-5xl font-serif tabular-nums block" style={{ color: 'var(--color-ink)' }}>+14%</span>
              </div>
            </div>
          </FastReveal>

          {/* Operational Expenses (Print Ledger Style) */}
          <FastReveal className="space-y-8" id="deep-dive-opex-section">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b pb-6" style={{ borderColor: 'var(--color-border-subtle)' }}>
              <h3 className="text-3xl font-serif tracking-tight" style={{ color: 'var(--color-ink)' }}>
                Operational Expenses
              </h3>
              
              {/* Editorial Search and Sort */}
              <div className="flex flex-col sm:flex-row gap-6 w-full lg:w-auto">
                <div className="relative flex items-center w-full sm:w-48 border-b group" style={{ borderColor: 'var(--color-border-medium)' }}>
                  <Search className="w-3.5 h-3.5 absolute left-0" style={{ color: 'var(--color-ink-secondary)' }} />
                  <input
                    type="text"
                    placeholder="Search ledger..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-6 pr-6 py-2 bg-transparent border-none text-sm focus:outline-none focus:ring-0 deep-dive-search" style={{ color: 'var(--color-ink)' }}
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-0 p-1 transition-colors cursor-pointer deep-dive-search-clear" style={{ color: 'var(--color-ink-secondary)' }}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>

                <div className="relative flex items-center w-full sm:w-32 border-b" style={{ borderColor: 'var(--color-border-medium)' }}>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as 'highest' | 'newest')}
                    className="w-full py-2 bg-transparent border-none text-sm focus:outline-none focus:ring-0 appearance-none cursor-pointer"
                    style={{ color: 'var(--color-ink)' }}
                  >
                    <option value="highest">Value (High)</option>
                    <option value="newest">Recent</option>
                  </select>
                  <div className="absolute right-0 pointer-events-none" style={{ color: 'var(--color-ink)' }}>
                    <ArrowDownRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col">
              {sortedExpenses.length > 0 ? (
                sortedExpenses.map((expense) => {
                  const isDown = expense.trend === 'down';
                  const trendStyle = isDown
                    ? { color: 'var(--color-accent-positive)' }
                    : { color: 'var(--color-accent-warning)' };

                  return (
                    <div key={expense.id} className="py-5 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 group border-b last:border-b-0" style={{ borderColor: 'var(--color-border-subtle)' }}>
                      <div className="flex items-baseline gap-4 w-full sm:w-1/2">
                        <span className="text-lg font-serif" style={{ color: 'var(--color-ink)' }}>{expense.category}</span>
                      </div>
                      <div className="flex items-baseline justify-between sm:justify-end gap-8 w-full sm:w-1/2">
                        <span className="text-[10px] uppercase tracking-widest" style={{ color: 'var(--color-ink-secondary)' }}>
                          {expense.formattedDate}
                        </span>
                        <div className="flex items-baseline gap-4 w-32 justify-end">
                          <span className="text-xs flex items-center" style={trendStyle}>
                            {isDown ? <ArrowDownRight className="w-3 h-3 mr-0.5" /> : <ArrowUpRight className="w-3 h-3 mr-0.5" />}
                            {expense.change}
                          </span>
                          <span className="text-xl font-serif tabular-nums" style={{ color: 'var(--color-ink)' }}>{expense.amount}</span>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="py-12 text-sm" style={{ color: 'var(--color-ink-secondary)' }}>
                  No expense records found.
                </div>
              )}
            </div>
          </FastReveal>

          {/* Action Link replacing heavy button */}
          <FastReveal className="pt-8 border-t" style={{ borderColor: 'var(--color-border-subtle)' }}>
            <button
              onClick={startDownload}
              disabled={downloading}
              className="group text-xs font-semibold tracking-widest uppercase flex items-center gap-3 cursor-pointer transition-opacity hover:opacity-60 disabled:opacity-40"
              style={{ color: 'var(--color-ink)' }}
            >
              <Download className="w-4 h-4" />
              {downloading ? 'Compiling Document...' : 'Export Fiscal PDF'}
            </button>
          </FastReveal>
        </div>

        {/* Right Column: Decorative Image Placeholder */}
        <div className="hidden lg:flex lg:col-span-4 xl:col-span-4 relative min-h-[500px]" style={{ background: 'var(--color-surface-solid)' }} id="decorative-image-placeholder">
          {/* Subtle noise/texture overlay placeholder */}
          <div className="absolute inset-0 opacity-20 mix-blend-multiply" style={{ backgroundImage: 'radial-gradient(var(--color-ink) 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
          
          <div className="absolute inset-x-0 bottom-0 p-8 flex justify-between items-end">
            <span className="text-[10px] font-semibold tracking-widest uppercase" style={{ color: 'var(--color-ink-muted)' }}>
              Fig. 01
            </span>
            <span className="text-[10px] font-semibold tracking-widest uppercase text-right max-w-[150px]" style={{ color: 'var(--color-ink-muted)' }}>
              Estate Visual Documentation
            </span>
          </div>
        </div>

      </main>
    </div>
  );
}
