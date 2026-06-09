import { useState, useMemo, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ScreenType, OccupancyStatus } from '../../types';
import { sampleProperties } from './propertyData';
import PropertyCard from './PropertyCard';
import PropertySkeleton from './PropertySkeleton';

interface PropertySelectorProps {
  onNavigate: (screen: ScreenType, transitionStyle: 'push' | 'slide_up' | 'morph') => void;
  onSelectProperty: (propertyId: string) => void;
  onNotify?: (message: string) => void;
}

export default function PropertySelector({ onSelectProperty }: PropertySelectorProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const handleSelect = useCallback(
    (propertyId: string) => {
      onSelectProperty(propertyId);
    },
    [onSelectProperty],
  );

  const liveAnnouncement = `${sampleProperties.length} properties shown`;

  return (
    <div className="ps-canvas">
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {liveAnnouncement}
      </div>

      <header className="ps-header">
        <div className="ps-header__wordmark">Vallarta // Mita</div>
        <button className="ps-header__criteria" aria-label="Open criteria filters">
          Criteria [+]
        </button>
      </header>

      {isLoading ? (
        <div className="ps-grid">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <PropertySkeleton key={i} index={i - 1} />
          ))}
        </div>
      ) : (
        <div className="ps-grid">
          <AnimatePresence mode="sync">
            {sampleProperties.map((property, i) => (
              <motion.div
                key={property.id}
                className="ps-grid-cell"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{
                  duration: 0.5,
                  ease: [0.16, 1, 0.3, 1],
                  delay: i * 0.06,
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
      )}
    </div>
  );
}
