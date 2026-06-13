import { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { motion } from 'motion/react';
import { ScreenType } from '../../types';

export type TierLevel = 'gallery' | 'collection' | 'catalog';

interface StickyHeaderProps {
  tier: TierLevel;
  onTierChange: (tier: TierLevel) => void;
  onSearch: (query: string) => void;
  onNavigate?: (screen: ScreenType, transitionStyle: 'push' | 'push_back' | 'slide_up') => void;
}

const TIERS: { id: TierLevel; label: string; icon: React.ReactNode }[] = [
  {
    id: 'gallery',
    label: 'Large',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="1" y="1" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.2" />
        <rect x="9" y="1" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.2" />
        <rect x="1" y="9" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.2" />
        <rect x="9" y="9" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.2" />
      </svg>
    ),
  },
  {
    id: 'collection',
    label: 'Medium',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="1" y="1" width="4" height="4" rx="0.8" stroke="currentColor" strokeWidth="1.2" />
        <rect x="6" y="1" width="4" height="4" rx="0.8" stroke="currentColor" strokeWidth="1.2" />
        <rect x="11" y="1" width="4" height="4" rx="0.8" stroke="currentColor" strokeWidth="1.2" />
        <rect x="1" y="6" width="4" height="4" rx="0.8" stroke="currentColor" strokeWidth="1.2" />
        <rect x="6" y="6" width="4" height="4" rx="0.8" stroke="currentColor" strokeWidth="1.2" />
        <rect x="11" y="6" width="4" height="4" rx="0.8" stroke="currentColor" strokeWidth="1.2" />
      </svg>
    ),
  },
  {
    id: 'catalog',
    label: 'Compact',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="1" y="1" width="3" height="3" rx="0.6" stroke="currentColor" strokeWidth="1" />
        <rect x="5" y="1" width="3" height="3" rx="0.6" stroke="currentColor" strokeWidth="1" />
        <rect x="9" y="1" width="3" height="3" rx="0.6" stroke="currentColor" strokeWidth="1" />
        <rect x="13" y="1" width="2" height="3" rx="0.6" stroke="currentColor" strokeWidth="1" />
        <rect x="1" y="5" width="3" height="3" rx="0.6" stroke="currentColor" strokeWidth="1" />
        <rect x="5" y="5" width="3" height="3" rx="0.6" stroke="currentColor" strokeWidth="1" />
        <rect x="9" y="5" width="3" height="3" rx="0.6" stroke="currentColor" strokeWidth="1" />
        <rect x="13" y="5" width="2" height="3" rx="0.6" stroke="currentColor" strokeWidth="1" />
      </svg>
    ),
  },
];

export default function StickyHeader({ tier, onTierChange, onSearch, onNavigate }: StickyHeaderProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeRect, setActiveRect] = useState<{ left: number; width: number } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const tierContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (searchOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [searchOpen]);

  useEffect(() => {
    if (!tierContainerRef.current) return;

    const activeBtn = tierContainerRef.current.querySelector('[data-active="true"]') as HTMLElement | null;
    if (activeBtn) {
      const { offsetLeft, offsetWidth } = activeBtn;
      setActiveRect({ left: offsetLeft, width: offsetWidth });
    }
  }, [tier]);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    onSearch(value);
  };

  const handleSearchClose = () => {
    setSearchOpen(false);
    setSearchQuery('');
    onSearch('');
  };

  return (
    <header className="ps-header">
      <button
        className="ps-header__wordmark"
        onClick={() => onNavigate?.('nav_menu', 'push_back')}
        aria-label="Back to menu"
      >
        Vallarta Estates
      </button>

      <div className="ps-header__controls">
        {searchOpen ? (
          <motion.div
            className="ps-header__search"
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
          >
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search properties..."
              className="ps-header__search-input"
              aria-label="Search properties"
            />
            <button
              onClick={handleSearchClose}
              className="ps-header__search-close"
              aria-label="Close search"
            >
              <X size={16} />
            </button>
          </motion.div>
        ) : (
          <button
            onClick={() => setSearchOpen(true)}
            className="ps-header__search-toggle"
            aria-label="Open search"
          >
            <Search size={16} />
          </button>
        )}

        <div className="ps-header__tier" role="radiogroup" aria-label="Card size" ref={tierContainerRef}>
          {TIERS.map((t) => (
            <button
              key={t.id}
              onClick={() => onTierChange(t.id)}
              className={`ps-header__tier-btn ${tier === t.id ? 'ps-header__tier-btn--active' : ''}`}
              role="radio"
              aria-checked={tier === t.id}
              data-active={tier === t.id}
            >
              <span className="ps-header__tier-btn-icon">{t.icon}</span>
              <span className="ps-header__tier-btn-label">{t.label}</span>
            </button>
          ))}
          {activeRect && (
            <motion.div
              className="ps-header__tier-indicator"
              initial={false}
              animate={{
                transform: `translateX(${activeRect.left}px)`,
                width: activeRect.width,
              }}
              transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
            />
          )}
        </div>
      </div>
    </header>
  );
}
