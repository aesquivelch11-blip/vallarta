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
    <div className="flex flex-col gap-4 w-full max-w-3xl mx-auto">
      {/* Search */}
      <div
        className="relative"
        style={{
          background: 'var(--color-canvas-elevated, #141414)',
          borderRadius: '8px',
          border: '1px solid var(--color-border-subtle, rgba(255,255,255,0.06))',
        }}
      >
        <svg
          className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ color: 'var(--color-ink-secondary, rgba(201,184,160,0.4))' }}
        >
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" />
        </svg>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search properties..."
          className="w-full bg-transparent text-[var(--color-ink, #F5F1E8)] placeholder:text-[var(--color-ink-secondary, rgba(201,184,160,0.3))] font-sans outline-none"
          style={{
            fontSize: '0.8125rem',
            letterSpacing: '0.02em',
            padding: '12px 16px 12px 40px',
          }}
          aria-label="Search properties by name"
        />
      </div>

      {/* Status filter */}
      <div
        className="flex items-center gap-2 flex-wrap"
        role="group"
        aria-label="Filter by occupancy status"
      >
        {STATUS_OPTIONS.map(({ value, label }) => {
          const isActive = activeStatus === value;
          return (
            <motion.button
              key={value}
              onClick={() => onStatusChange(value)}
              className="cursor-pointer font-sans uppercase"
              style={{
                fontSize: '0.5625rem',
                fontWeight: isActive ? 600 : 400,
                letterSpacing: '0.20em',
                padding: '8px 16px',
                borderRadius: '6px',
                border: '1px solid',
                borderColor: isActive
                  ? 'var(--color-ink, #F5F1E8)'
                  : 'var(--color-border-subtle, rgba(255,255,255,0.06))',
                background: isActive
                  ? 'var(--color-ink, #F5F1E8)'
                  : 'transparent',
                color: isActive
                  ? 'var(--color-canvas, #0c0c0c)'
                  : 'var(--color-ink-secondary, rgba(201,184,160,0.6))',
                transition: 'background 0.2s ease, color 0.2s ease, border-color 0.2s ease',
              }}
              whileTap={{ scale: 0.97 }}
              aria-pressed={isActive}
            >
              {label}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
