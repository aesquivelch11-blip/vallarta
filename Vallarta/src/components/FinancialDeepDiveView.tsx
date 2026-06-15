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

function FastReveal({ children, className }: { children: React.ReactNode, className?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
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
    <div className="min-h-[100dvh] bg-[#FAF8F5] text-[#242424] font-sans flex flex-col" id="deep-dive-container">
      
      {/* Top Bar Logo & Menu */}
      <header className="sticky top-0 bg-[#FAF8F5]/90 z-40 border-b border-[#242424]/10 px-8 py-5 flex justify-between items-center backdrop-blur-xl" id="deep-dive-header">
        <h1 className="text-xl md:text-2xl font-serif text-[#242424] cursor-pointer" onClick={() => onNavigate('nav_menu', 'push')}>
          Vallarta Estates
        </h1>
        <button 
          aria-label="Menu"
          id="deep-dive-menu-btn"
          onClick={() => onNavigate('nav_menu', 'slide_up')}
          className="p-2 text-[#242424] hover:text-[#7E7A74] transition-colors duration-200 cursor-pointer"
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
              <h2 className="text-5xl md:text-7xl lg:text-[7rem] font-serif text-[#242424] leading-[0.9] tracking-tighter" id="deep-dive-header-title">
                Portfolio<br/>Yield.
              </h2>
              <p className="text-[#7E7A74] text-lg max-w-[40ch] leading-relaxed">
                Year-to-date fiscal performance, measured against internal forecasts and market baseline.
              </p>
            </div>

            <div className="flex flex-wrap gap-x-16 gap-y-8 pt-8 border-t border-[#242424]/10" id="deep-dive-top-metrics">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#7E7A74] font-semibold block mb-2">Q4 Yield</span>
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl lg:text-5xl font-serif text-[#242424] tabular-nums">8.4%</span>
                  <span className="text-sm text-[#2B3B32] flex items-center">
                    <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
                    1.2%
                  </span>
                </div>
              </div>

              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#7E7A74] font-semibold block mb-2">YTD Revenue</span>
                <span className="text-4xl lg:text-5xl font-serif text-[#242424] tabular-nums block">$1.24M</span>
              </div>
              
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#7E7A74] font-semibold block mb-2">Premium</span>
                <span className="text-4xl lg:text-5xl font-serif text-[#242424] tabular-nums block">+14%</span>
              </div>
            </div>
          </FastReveal>

          {/* Operational Expenses (Print Ledger Style) */}
          <FastReveal className="space-y-8" id="deep-dive-opex-section">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-[#242424]/10 pb-6">
              <h3 className="text-3xl font-serif text-[#242424] tracking-tight">
                Operational Expenses
              </h3>
              
              {/* Editorial Search and Sort */}
              <div className="flex flex-col sm:flex-row gap-6 w-full lg:w-auto">
                <div className="relative flex items-center w-full sm:w-48 border-b border-[#242424]/20 group">
                  <Search className="w-3.5 h-3.5 text-[#7E7A74] absolute left-0" />
                  <input
                    type="text"
                    placeholder="Search ledger..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-6 pr-6 py-2 bg-transparent border-none text-sm focus:outline-none focus:ring-0 text-[#242424] placeholder:text-[#7E7A74]"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-0 p-1 text-[#7E7A74] hover:text-[#242424] transition-colors cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>

                <div className="relative flex items-center w-full sm:w-32 border-b border-[#242424]/20">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as 'highest' | 'newest')}
                    className="w-full py-2 bg-transparent border-none text-sm focus:outline-none focus:ring-0 text-[#242424] appearance-none cursor-pointer"
                  >
                    <option value="highest">Value (High)</option>
                    <option value="newest">Recent</option>
                  </select>
                  <div className="absolute right-0 pointer-events-none text-[#242424]">
                    <ArrowDownRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col divide-y divide-[#242424]/5">
              {sortedExpenses.length > 0 ? (
                sortedExpenses.map((expense) => {
                  const isDown = expense.trend === 'down';
                  const trendColor = isDown ? 'text-[#2B3B32]' : 'text-[#D49A55]';
                  
                  return (
                    <div key={expense.id} className="py-5 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 group">
                      <div className="flex items-baseline gap-4 w-full sm:w-1/2">
                        <span className="text-lg font-serif text-[#242424]">{expense.category}</span>
                      </div>
                      <div className="flex items-baseline justify-between sm:justify-end gap-8 w-full sm:w-1/2">
                        <span className="text-[10px] uppercase tracking-widest text-[#7E7A74]">
                          {expense.formattedDate}
                        </span>
                        <div className="flex items-baseline gap-4 w-32 justify-end">
                          <span className={`text-xs flex items-center ${trendColor}`}>
                            {isDown ? <ArrowDownRight className="w-3 h-3 mr-0.5" /> : <ArrowUpRight className="w-3 h-3 mr-0.5" />}
                            {expense.change}
                          </span>
                          <span className="text-xl font-serif text-[#242424] tabular-nums">{expense.amount}</span>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="py-12 text-[#7E7A74] text-sm">
                  No expense records found.
                </div>
              )}
            </div>
          </FastReveal>

          {/* Action Link replacing heavy button */}
          <FastReveal className="pt-8 border-t border-[#242424]/10">
            <button
              onClick={startDownload}
              disabled={downloading}
              className="group text-[#242424] text-xs font-semibold tracking-widest uppercase flex items-center gap-3 cursor-pointer transition-opacity hover:opacity-60 disabled:opacity-40"
            >
              <Download className="w-4 h-4" />
              {downloading ? 'Compiling Document...' : 'Export Fiscal PDF'}
            </button>
          </FastReveal>
        </div>

        {/* Right Column: Decorative Image Placeholder */}
        <div className="hidden lg:flex lg:col-span-4 xl:col-span-4 bg-[#EAE2D6] relative min-h-[500px]" id="decorative-image-placeholder">
          {/* Subtle noise/texture overlay placeholder */}
          <div className="absolute inset-0 opacity-20 mix-blend-multiply" style={{ backgroundImage: 'radial-gradient(#242424 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
          
          <div className="absolute inset-x-0 bottom-0 p-8 flex justify-between items-end">
            <span className="text-[10px] font-semibold tracking-widest uppercase text-[#242424]/60">
              Fig. 01
            </span>
            <span className="text-[10px] font-semibold tracking-widest uppercase text-[#242424]/60 text-right max-w-[150px]">
              Estate Visual Documentation
            </span>
          </div>
        </div>

      </main>
    </div>
  );
}
