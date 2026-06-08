import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ScreenType, OccupancyStatus } from '../../types';
import { sampleProperties } from './propertyData';
import PropertyCard from './PropertyCard';
import PropertyFilters from './PropertyFilters';

interface PropertySelectorProps {
  onNavigate: (screen: ScreenType, transitionStyle: 'push' | 'slide_up') => void;
  onSelectProperty: (propertyId: string) => void;
  onNotify?: (message: string) => void;
}

export default function PropertySelector({ onNavigate, onSelectProperty, onNotify }: PropertySelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeStatus, setActiveStatus] = useState<OccupancyStatus | 'all'>('all');

  const filteredProperties = useMemo(() => {
    return sampleProperties.filter((property) => {
      const matchesSearch =
        searchQuery === '' ||
        property.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.location.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        activeStatus === 'all' || property.occupancyStatus === activeStatus;

      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, activeStatus]);

  const handleSelect = useCallback(
    (propertyId: string) => {
      onSelectProperty(propertyId);
    },
    [onSelectProperty],
  );

  const liveAnnouncement = `${filteredProperties.length} ${filteredProperties.length === 1 ? 'property' : 'properties'} shown`;

  return (
    <div
      className="w-full min-h-[100dvh] relative overflow-y-auto"
      style={{ background: 'var(--color-canvas, #0c0c0c)' }}
    >
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {liveAnnouncement}
      </div>

      {/* Header */}
      <header
        className="sticky top-0 z-40 flex items-center justify-between"
        style={{
          padding: '20px 32px',
          background: 'var(--color-canvas, #0c0c0c)',
        }}
      >
        <h1
          className="font-sans uppercase"
          style={{
            fontSize: '0.6875rem',
            fontWeight: 500,
            letterSpacing: '0.35em',
            color: 'var(--color-ink, #F5F1E8)',
          }}
        >
          Properties
        </h1>
        <span
          className="font-sans"
          style={{
            fontSize: '0.625rem',
            letterSpacing: '0.10em',
            color: 'var(--color-ink-secondary, rgba(201,184,160,0.5))',
          }}
        >
          {filteredProperties.length} of {sampleProperties.length}
        </span>
      </header>

      {/* Filters */}
      <div style={{ padding: '0 32px 24px' }}>
        <PropertyFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          activeStatus={activeStatus}
          onStatusChange={setActiveStatus}
        />
      </div>

      {/* Grid */}
      <div style={{ padding: '0 32px 48px' }}>
        <motion.div
          className="grid gap-5"
          style={{
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          }}
          layout
        >
          <AnimatePresence mode="popLayout">
            {filteredProperties.map((property, i) => (
              <motion.div
                key={property.id}
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{
                  duration: 0.4,
                  delay: i * 0.05,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <PropertyCard property={property} onSelect={handleSelect} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty state */}
        {filteredProperties.length === 0 && (
          <motion.div
            className="flex flex-col items-center justify-center py-24"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <p
              className="font-sans text-center"
              style={{
                fontSize: '0.8125rem',
                color: 'var(--color-ink-secondary, rgba(201,184,160,0.4))',
                letterSpacing: '0.02em',
              }}
            >
              No properties match your search.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveStatus('all');
              }}
              className="mt-3 font-sans uppercase cursor-pointer"
              style={{
                fontSize: '0.5625rem',
                fontWeight: 500,
                letterSpacing: '0.20em',
                color: 'var(--color-ink, #F5F1E8)',
                background: 'none',
                border: 'none',
                padding: '8px 0',
                borderBottom: '1px solid var(--color-ink, #F5F1E8)',
              }}
            >
              Clear filters
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
