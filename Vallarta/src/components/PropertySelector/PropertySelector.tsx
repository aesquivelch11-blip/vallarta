import { useState, useMemo, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ScreenType, OccupancyStatus } from '../../types';
import { sampleProperties } from './propertyData';
import PropertyCard from './PropertyCard';
import PropertySkeleton from './PropertySkeleton';
import FloatingControls from './FloatingControls';

interface PropertySelectorProps {
  onNavigate: (screen: ScreenType, transitionStyle: 'push' | 'slide_up' | 'morph') => void;
  onSelectProperty: (propertyId: string) => void;
  onNotify?: (message: string) => void;
}

export default function PropertySelector({ onSelectProperty }: PropertySelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeStatus, setActiveStatus] = useState<OccupancyStatus | 'all'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [controlsVisible, setControlsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setControlsVisible(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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
    <div className="ps-canvas">
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {liveAnnouncement}
      </div>

      <FloatingControls
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeStatus={activeStatus}
        onStatusChange={setActiveStatus}
        isVisible={controlsVisible || searchQuery !== '' || activeStatus !== 'all'}
      />

      {isLoading ? (
        <div className="ps-grid">
          {[1, 2, 3, 4, 5].map((i) => (
            <PropertySkeleton key={i} />
          ))}
        </div>
      ) : (
        <div>
          {filteredProperties.length > 0 ? (
            <div className="ps-grid">
              <AnimatePresence mode="sync">
                {filteredProperties.map((property, i) => (
                  <motion.div
                    key={property.id}
                    className="ps-grid-cell"
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{
                      duration: 0.5,
                      ease: [0.16, 1, 0.3, 1],
                      delay: i * 0.07,
                    }}
                  >
                    <PropertyCard
                      property={property}
                      onSelect={handleSelect}
                      index={i}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <motion.div
              className="ps-empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              <p className="ps-empty__text">No properties match your search.</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveStatus('all');
                }}
                className="ps-empty__cta"
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
