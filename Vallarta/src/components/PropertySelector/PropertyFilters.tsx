import React from 'react';
import { motion } from 'motion/react';
import { OccupancyStatus } from '../../types';

interface PropertyFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activeStatus: OccupancyStatus | 'all';
  onStatusChange: (status: OccupancyStatus | 'all') => void;
}

const STATUS_OPTIONS: { value: OccupancyStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'available', label: 'Available' },
  { value: 'occupied', label: 'Occupied' },
  { value: 'maintenance', label: 'Maintenance' },
  { value: 'reserved', label: 'Reserved' },
];

export default function PropertyFilters({
  searchQuery,
  onSearchChange,
  activeStatus,
  onStatusChange,
}: PropertyFiltersProps) {
  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Search */}
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search..."
          className="w-full bg-transparent outline-none"
          style={{
            fontFamily: 'var(--font-ui)',
            fontSize: '0.8125rem',
            fontWeight: 400,
            letterSpacing: '0.02em',
            padding: '8px 0',
            color: 'rgba(255,255,255,0.9)',
            borderBottom: '1px solid rgba(255,255,255,0.12)',
          }}
          aria-label="Search properties"
        />
      </div>

      {/* Status filter */}
      <div
        className="flex items-center gap-1 flex-wrap"
        role="group"
        aria-label="Filter by occupancy status"
      >
        {STATUS_OPTIONS.map(({ value, label }, index) => {
          const isActive = activeStatus === value;
          return (
            <React.Fragment key={value}>
              {index > 0 && (
                <span
                  aria-hidden="true"
                  className="font-sans"
                  style={{
                    fontSize: '0.5625rem',
                    color: 'rgba(255,255,255,0.2)',
                    margin: '0 4px',
                  }}
                >
                  ·
                </span>
              )}
              <motion.button
                type="button"
                onClick={() => onStatusChange(value)}
                className="cursor-pointer uppercase focus-visible:outline-none"
                style={{
                  fontFamily: 'var(--font-ui)',
                  fontSize: '0.5625rem',
                  fontWeight: isActive ? 500 : 400,
                  letterSpacing: '0.20em',
                  padding: '4px 0',
                  background: 'none',
                  border: 'none',
                  borderBottom: isActive ? '1px solid var(--color-dark-accent, #d49a55)' : '1px solid transparent',
                  color: isActive
                    ? 'rgba(255,255,255,0.9)'
                    : 'rgba(255,255,255,0.4)',
                  transition: 'color 0.2s ease, border-color 0.2s ease',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderBottomColor = 'var(--color-dark-accent, #d49a55)';
                }}
                onBlur={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.borderBottomColor = 'transparent';
                  }
                }}
                aria-pressed={isActive}
              >
                {label}
              </motion.button>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
