import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ScreenType, OccupancyStatus } from '../../types';
import { sampleProperties } from './propertyData';
import PropertyCard from './PropertyCard';
import PropertyFilters from './PropertyFilters';
import { ArrowLeft } from 'lucide-react';

interface PropertySelectorProps {
  onNavigate: (screen: ScreenType, transitionStyle: 'push' | 'slide_up') => void;
  onSelectProperty: (propertyId: string) => void;
  onNotify?: (message: string) => void;
}

const GRID_PLACEMENTS = [
  { c: 1, r: 1 },
  { c: 3, r: 1 },
  { c: 4, r: 1 },
  { c: 1, r: 2 },
  { c: 2, r: 2 },
  { c: 3, r: 2 },
  { c: 4, r: 2 },
  { c: 2, r: 3 },
  { c: 4, r: 3 },
  { c: 1, r: 4 },
];

export default function PropertySelector({ onNavigate, onSelectProperty, onNotify }: PropertySelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeStatus, setActiveStatus] = useState<OccupancyStatus | 'all'>('all');
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);

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
      setSelectedPropertyId(propertyId);
    },
    [],
  );
  
  const handleViewDashboard = useCallback(
    (propertyId: string) => {
      onSelectProperty(propertyId);
    },
    [onSelectProperty],
  );

  const liveAnnouncement = `${filteredProperties.length} ${filteredProperties.length === 1 ? 'property' : 'properties'} shown`;

  const selectedProperty = useMemo(() => 
    filteredProperties.find(p => p.id === selectedPropertyId), 
  [selectedPropertyId, filteredProperties]);

  return (
    <div
      className="w-full min-h-[100dvh] relative overflow-hidden"
      style={{ background: 'var(--color-canvas, #0c0c0c)' }}
    >
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {liveAnnouncement}
      </div>

      <motion.div 
        animate={{ 
          opacity: selectedPropertyId ? 0 : 1, 
          scale: selectedPropertyId ? 0.95 : 1,
          pointerEvents: selectedPropertyId ? 'none' : 'auto' 
        }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="h-[100dvh] overflow-y-auto"
      >
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
            className="grid gap-4 md:gap-8 max-w-[1600px] mx-auto"
            style={{
              gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
              gridAutoRows: '28vmin',
            }}
            layout
          >
            <AnimatePresence mode="popLayout">
              {filteredProperties.map((property, i) => {
                const placement = GRID_PLACEMENTS[i % GRID_PLACEMENTS.length];
                const baseRow = Math.floor(i / GRID_PLACEMENTS.length) * 4;
                const gridColumn = placement.c;
                const gridRow = placement.r + baseRow;

                return (
                  <motion.div
                    key={property.id}
                    layoutId={`container-${property.id}`}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{
                      duration: 0.6,
                      delay: i * 0.05,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    style={{ gridColumn, gridRow }}
                    className="flex flex-col justify-end w-full h-full"
                  >
                    <PropertyCard 
                      property={property} 
                      onSelect={handleSelect} 
                      isActive={false}
                    />
                  </motion.div>
                );
              })}
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
      </motion.div>

      {/* Detail Overlay */}
      <AnimatePresence>
        {selectedProperty && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="fixed inset-0 z-50 flex items-center justify-between p-8 md:p-16 lg:p-24 bg-[var(--color-canvas)]"
            style={{ pointerEvents: 'auto' }}
          >
            {/* Left Content */}
            <motion.div 
              className="w-full md:w-2/5 flex flex-col justify-between h-full relative z-10"
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <div>
                <span className="font-sans uppercase text-[var(--color-ink-secondary, rgba(201,184,160,0.6))] text-sm tracking-widest block mb-4">
                  {String(filteredProperties.findIndex(p => p.id === selectedProperty.id) + 1).padStart(2, '0')}
                </span>
                <h2 
                  className="font-serif italic leading-[1.1] text-[var(--color-ink, #F5F1E8)] mb-6"
                  style={{ fontSize: 'clamp(3.5rem, 6vw, 6rem)' }}
                >
                  {selectedProperty.name}
                </h2>
                <p className="font-sans text-[var(--color-ink-secondary, rgba(201,184,160,0.8))] max-w-sm mb-12 leading-relaxed text-lg">
                  Located in the prestigious {selectedProperty.location}, this property currently maintains a {selectedProperty.occupancyStatus} status with outstanding YTD performance.
                </p>
                <button
                  onClick={() => handleViewDashboard(selectedProperty.id)}
                  className="font-sans uppercase text-[var(--color-ink, #F5F1E8)] tracking-[0.2em] text-[0.6875rem] border-b border-[var(--color-ink, #F5F1E8)] pb-2 hover:opacity-70 transition-opacity"
                >
                  View Dashboard
                </button>
              </div>

              <button
                onClick={() => setSelectedPropertyId(null)}
                className="flex items-center gap-3 font-sans uppercase tracking-[0.2em] text-[0.6875rem] text-[var(--color-ink-secondary, rgba(201,184,160,0.6))] hover:text-[var(--color-ink, #F5F1E8)] transition-colors mt-auto w-fit"
              >
                <ArrowLeft size={16} />
                Back to Grid
              </button>
            </motion.div>

            {/* Right Side Zoomed Image */}
            <motion.div
              layoutId={`container-${selectedProperty.id}`}
              className="absolute right-[5%] w-[55%] h-[70vh] rounded-2xl overflow-hidden shadow-2xl"
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <PropertyCard 
                property={selectedProperty} 
                onSelect={() => {}} 
                isActive={true}
              />
            </motion.div>

            {/* Mini Grid Navigation */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              transition={{ delay: 0.4, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="absolute bottom-8 right-8 w-[280px] h-[240px] grid gap-2"
              style={{
                gridTemplateColumns: 'repeat(4, 1fr)',
                gridAutoRows: '1fr',
              }}
            >
              {filteredProperties.slice(0, 10).map((property, i) => {
                const placement = GRID_PLACEMENTS[i % GRID_PLACEMENTS.length];
                const baseRow = Math.floor(i / GRID_PLACEMENTS.length) * 4;
                return (
                  <button
                    key={property.id}
                    onClick={() => setSelectedPropertyId(property.id)}
                    className="relative overflow-hidden rounded-md hover:opacity-80 transition-opacity"
                    style={{
                      gridColumn: placement.c,
                      gridRow: placement.r + baseRow,
                      opacity: property.id === selectedProperty.id ? 0.3 : 1
                    }}
                  >
                    <img 
                      src={property.imageUrl} 
                      alt="" 
                      className="w-full h-full object-cover" 
                    />
                  </button>
                );
              })}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
