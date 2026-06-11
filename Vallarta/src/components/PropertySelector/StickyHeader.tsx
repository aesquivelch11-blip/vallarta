import { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';

export type TierLevel = 'gallery' | 'collection' | 'catalog';

interface StickyHeaderProps {
  tier: TierLevel;
  onTierChange: (tier: TierLevel) => void;
  onSearch: (query: string) => void;
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

export default function StickyHeader({ tier, onTierChange, onSearch }: StickyHeaderProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const inputRef = useRef<HTMLInputElement>(null);
  const tierContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (searchOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [searchOpen]);

  useEffect(() => {
    if (!tierContainerRef.current) return;

    const activeBtn = tierContainerRef.current.querySelector('.ps-header__tier-btn--active') as HTMLElement | null;
    if (activeBtn) {
      const { offsetLeft, offsetWidth } = activeBtn;
      setIndicatorStyle({ left: offsetLeft, width: offsetWidth });
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
      <div className="ps-header__wordmark">Vallarta // Mita</div>

      <div className="ps-header__controls">
        {searchOpen ? (
          <div className="ps-header__search">
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
          </div>
        ) : (
          <button
            onClick={() => setSearchOpen(true)}
            className="ps-header__search-toggle"
            aria-label="Open search"
          >
            <Search size={16} />
          </button>
        )}

        <div className="ps-header__tier" ref={tierContainerRef} role="radiogroup" aria-label="Card size">
          {TIERS.map((t) => (
            <button
              key={t.id}
              onClick={() => onTierChange(t.id)}
              className={`ps-header__tier-btn ${tier === t.id ? 'ps-header__tier-btn--active' : ''}`}
              role="radio"
              aria-checked={tier === t.id}
            >
              <span className="ps-header__tier-btn-icon">{t.icon}</span>
              <span className="ps-header__tier-btn-label">{t.label}</span>
            </button>
          ))}
          <div
            className="ps-header__tier-indicator"
            style={{
              transform: `translateX(${indicatorStyle.left}px)`,
              width: `${indicatorStyle.width}px`,
            }}
          />
        </div>
      </div>
    </header>
  );
}
