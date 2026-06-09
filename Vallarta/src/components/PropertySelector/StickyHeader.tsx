import { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';

export type TierLevel = 'gallery' | 'collection' | 'catalog';

interface StickyHeaderProps {
  tier: TierLevel;
  onTierChange: (tier: TierLevel) => void;
  onSearch: (query: string) => void;
}

const TIERS: { id: TierLevel; label: string }[] = [
  { id: 'gallery', label: 'Gallery' },
  { id: 'collection', label: 'Collection' },
  { id: 'catalog', label: 'Catalog' },
];

export default function StickyHeader({ tier, onTierChange, onSearch }: StickyHeaderProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [searchOpen]);

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

        <div className="ps-header__tier" role="radiogroup" aria-label="Card size">
          {TIERS.map((t) => (
            <button
              key={t.id}
              onClick={() => onTierChange(t.id)}
              className={`ps-header__tier-btn ${tier === t.id ? 'ps-header__tier-btn--active' : ''}`}
              role="radio"
              aria-checked={tier === t.id}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
