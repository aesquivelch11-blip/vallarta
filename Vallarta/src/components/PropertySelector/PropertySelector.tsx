import { useState, useMemo, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ScreenType, OccupancyStatus } from '../../types';
import { sampleProperties } from './propertyData';
import PropertyCard from './PropertyCard';
import PropertyFilters from './PropertyFilters';
import PropertySkeleton from './PropertySkeleton';

interface PropertySelectorProps {
  onNavigate: (screen: ScreenType, transitionStyle: 'push' | 'slide_up' | 'morph') => void;
  onSelectProperty: (propertyId: string) => void;
  onNotify?: (message: string) => void;
}

const PARALLAX_CLASSES = [
  'ew-parallax-fast',
  '',
  'ew-parallax-slow',
  '',
  'ew-parallax-fast',
];

export default function PropertySelector({ onSelectProperty }: PropertySelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeStatus, setActiveStatus] = useState<OccupancyStatus | 'all'>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

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
    <div className="w-full ew-canvas relative">
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {liveAnnouncement}
      </div>

      {/* Floating header — inside canvas frame, top-left */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="flex items-baseline justify-between"
        style={{
          marginBottom: 'clamp(16px, 2vw, 28px)',
          padding: '0',
        }}
      >
        <h1
          className="uppercase"
          style={{
            fontFamily: 'var(--font-ui)',
            fontSize: 'var(--ew-header-size)',
            fontWeight: 500,
            letterSpacing: 'var(--ew-header-tracking)',
            color: 'rgba(255,255,255,0.5)',
          }}
        >
          Properties
        </h1>
        <span
          style={{
            fontFamily: 'var(--font-ui)',
            fontSize: '0.5625rem',
            fontWeight: 400,
            letterSpacing: '0.15em',
            color: 'rgba(255,255,255,0.3)',
          }}
        >
          {filteredProperties.length} of {sampleProperties.length}
        </span>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
        style={{ marginBottom: 'clamp(12px, 1.5vw, 20px)' }}
      >
        <PropertyFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          activeStatus={activeStatus}
          onStatusChange={setActiveStatus}
        />
      </motion.div>

      {/* Editorial Wall Grid */}
      {isLoading ? (
        <div className="ew-grid">
          {[1, 2, 3, 4, 5].map((i) => (
            <PropertySkeleton key={i} />
          ))}
        </div>
      ) : (
        <div>
          {filteredProperties.length > 0 ? (
            <div className="ew-grid">
              <AnimatePresence mode="sync">
                {filteredProperties.map((property, i) => (
                  <motion.div
                    key={property.id}
                    className="relative overflow-hidden"
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{
                      duration: 0.5,
                      ease: [0.16, 1, 0.3, 1],
                      delay: i * 0.07,
                    }}
                  >
                    <div className="ew-card-hover-target">
                      <PropertyCard
                        property={property}
                        onSelect={handleSelect}
                        parallaxClass={PARALLAX_CLASSES[i] || ''}
                      />
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <motion.div
              className="flex flex-col items-center justify-center"
              style={{ height: 'calc(100dvh - var(--ew-frame) * 2 - 120px)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              <p
                className="font-sans text-center"
                style={{
                  fontSize: '0.8125rem',
                  color: 'rgba(255,255,255,0.35)',
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
                  color: 'rgba(255,255,255,0.7)',
                  background: 'none',
                  border: 'none',
                  padding: '8px 0',
                  borderBottom: '1px solid rgba(255,255,255,0.3)',
                }}
              >
                Clear filters
              </button>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}
