import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ScreenType, OccupancyStatus } from '../../types';
import { sampleProperties } from './propertyData';
import PropertyCard from './PropertyCard';
import PropertyFilters from './PropertyFilters';

interface PropertySelectorProps {
  onNavigate: (screen: ScreenType, transitionStyle: 'push' | 'slide_up' | 'morph') => void;
  onSelectProperty: (propertyId: string) => void;
  onNotify?: (message: string) => void;
}

export default function PropertySelector({ onSelectProperty }: PropertySelectorProps) {
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
      className="w-full min-h-[100dvh] relative overflow-hidden"
      style={{ background: 'var(--color-canvas, #0c0c0c)' }}
    >
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {liveAnnouncement}
      </div>

      {/* Header */}
      <header
        className="sticky top-0 z-40 flex items-center justify-between"
        style={{
          height: '48px',
          padding: '0 24px',
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
      <div style={{ padding: '0 24px 24px' }}>
        <PropertyFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          activeStatus={activeStatus}
          onStatusChange={setActiveStatus}
        />
      </div>

      {/* Grid */}
      <div style={{ padding: '0 0 0' }}>
        {filteredProperties.length > 0 ? (
          <div
            className="grid"
            style={{
              gridTemplateColumns: '2fr 2fr 1fr',
              gridTemplateRows: '1fr 1fr',
              gap: '1px',
              height: 'calc(100dvh - 48px)',
              width: '100%',
              background: 'var(--color-canvas, #0c0c0c)',
            }}
          >
            <AnimatePresence mode="popLayout">
              {filteredProperties.map((property, i) => (
                  <motion.div
                    key={property.id}
                    layoutId={`container-${property.id}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ 
                      opacity: 1,
                      y: 0,
                    }}
                    exit={{ opacity: 0 }}
                    transition={{
                      duration: 0.5,
                      ease: [0.16, 1, 0.3, 1],
                      delay: i * 0.08,
                    }}
                    style={{
                      gridColumn: i === 3 ? 'span 2' : undefined,
                    }}
                    className="relative overflow-hidden"
                  >
                    <PropertyCard 
                      property={property} 
                      onSelect={handleSelect} 
                    />
                  </motion.div>
                ))
              }
            </AnimatePresence>
          </div>
        ) : (
          <motion.div
            className="flex flex-col items-center justify-center"
            style={{ height: 'calc(100dvh - 48px)' }}
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
