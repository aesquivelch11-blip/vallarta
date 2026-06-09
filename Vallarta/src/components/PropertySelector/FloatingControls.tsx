import { useState } from 'react';
import { OccupancyStatus } from '../../types';

interface FloatingControlsProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activeStatus: OccupancyStatus | 'all';
  onStatusChange: (status: OccupancyStatus | 'all') => void;
  isVisible: boolean;
}

const STATUS_OPTIONS: { value: OccupancyStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'available', label: 'Available' },
  { value: 'occupied', label: 'Occupied' },
  { value: 'maintenance', label: 'Maintenance' },
  { value: 'reserved', label: 'Reserved' },
];

export default function FloatingControls({
  searchQuery,
  onSearchChange,
  activeStatus,
  onStatusChange,
  isVisible,
}: FloatingControlsProps) {
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [filtersExpanded, setFiltersExpanded] = useState(false);

  return (
    <div className={`ps-floating-controls ${isVisible ? 'ps-floating-controls--visible' : ''}`}>
      <div style={{ position: 'relative', display: 'flex', gap: '12px', alignItems: 'center' }}>
        {searchExpanded && (
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search..."
            className="ps-search-input ps-search-input--expanded"
            aria-label="Search properties"
            autoFocus
          />
        )}
        <button
          onClick={() => setSearchExpanded(!searchExpanded)}
          className="ps-search-toggle"
          aria-label="Toggle search"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
        </button>
      </div>

      <div style={{ position: 'relative' }}>
        <button
          onClick={() => setFiltersExpanded(!filtersExpanded)}
          className="ps-filter-toggle"
          aria-label="Filter by status"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="4" y1="21" x2="4" y2="14" />
            <line x1="4" y1="10" x2="4" y2="3" />
            <line x1="12" y1="21" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12" y2="3" />
            <line x1="20" y1="21" x2="20" y2="16" />
            <line x1="20" y1="12" x2="20" y2="3" />
            <line x1="1" y1="14" x2="7" y2="14" />
            <line x1="9" y1="8" x2="15" y2="8" />
            <line x1="17" y1="16" x2="23" y2="16" />
          </svg>
        </button>

        <div className={`ps-filter-pills ${filtersExpanded ? 'ps-filter-pills--visible' : ''}`}>
          {STATUS_OPTIONS.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => {
                onStatusChange(value);
                setFiltersExpanded(false);
              }}
              className={`ps-filter-pill ${activeStatus === value ? 'ps-filter-pill--active' : ''}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
