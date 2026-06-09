import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import Lenis from 'lenis';
import { ScreenType } from '../../types';
import { sampleProperties } from './propertyData';
import PropertyCard from './PropertyCard';
import PropertySkeleton from './PropertySkeleton';
import StickyHeader, { TierLevel } from './StickyHeader';

interface PropertySelectorProps {
  onNavigate: (screen: ScreenType, transitionStyle: 'push' | 'slide_up' | 'morph') => void;
  onSelectProperty: (propertyId: string) => void;
  onNotify?: (message: string) => void;
}

const STORAGE_KEY = 'ps-tier-preference';

function getInitialTier(): TierLevel {
  if (typeof window === 'undefined') return 'collection';
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'gallery' || stored === 'collection' || stored === 'catalog') return stored;
  return 'collection';
}

export default function PropertySelector({ onSelectProperty }: PropertySelectorProps) {
  const [phase, setPhase] = useState<'wordmark' | 'grid' | 'ready'>('wordmark');
  const [tier, setTier] = useState<TierLevel>(getInitialTier);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const lenisRef = useRef<Lenis | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setPhase('ready');
      return;
    }

    const t1 = setTimeout(() => setPhase('grid'), 400);
    const t2 = setTimeout(() => setPhase('ready'), 1000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  useEffect(() => {
    if (phase !== 'ready') return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    lenisRef.current = lenis;

    function onScroll({ progress }: { progress: number }) {
      setScrollProgress(progress * 100);
    }

    lenis.on('scroll', onScroll);

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [phase]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, tier);
  }, [tier]);

  const handleTierChange = useCallback((newTier: TierLevel) => {
    setTier(newTier);
  }, []);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleSelect = useCallback(
    (propertyId: string) => {
      setSelectedId(propertyId);
      setTimeout(() => {
        onSelectProperty(propertyId);
      }, 800);
    },
    [onSelectProperty],
  );

  const filteredProperties = useMemo(() => {
    if (!searchQuery.trim()) return sampleProperties;
    const q = searchQuery.toLowerCase();
    return sampleProperties.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q) ||
        p.tagline.toLowerCase().includes(q),
    );
  }, [searchQuery]);

  const gridClass = `ps-grid ps-grid--${tier}`;
  const liveAnnouncement = `${filteredProperties.length} properties shown`;

  return (
    <div className="ps-canvas" ref={canvasRef}>
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {liveAnnouncement}
      </div>

      <div className="ps-progress" style={{ width: `${scrollProgress}%` }} />

      <AnimatePresence>
        {phase === 'wordmark' && (
          <motion.div
            key="hero-wordmark"
            className="ps-hero"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.5, ease: [0.0, 0.0, 0.2, 1] }}
          >
            <div className="ps-hero__wordmark">Vallarta</div>
          </motion.div>
        )}
      </AnimatePresence>

      {(phase === 'grid' || phase === 'ready') && (
        <>
          <motion.div
            initial={{ opacity: 0, y: -56 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.0, 0.0, 0.2, 1] }}
          >
            <StickyHeader tier={tier} onTierChange={handleTierChange} onSearch={handleSearch} />
          </motion.div>

          {filteredProperties.length === 0 ? (
            <div className="ps-empty">
              <p className="ps-empty__text">No properties match your search.</p>
              <button className="ps-empty__cta" onClick={() => handleSearch('')}>
                Clear search
              </button>
            </div>
          ) : (
            <div className={gridClass}>
              <AnimatePresence mode="sync">
                {filteredProperties.map((property, i) => (
                  <motion.div
                    key={property.id}
                    className="ps-grid-cell"
                    initial={{ opacity: 0, y: 16 }}
                    animate={
                      selectedId === null
                        ? { opacity: 1, y: 0 }
                        : selectedId === property.id
                          ? { opacity: 1, y: 0, scale: 1.05 }
                          : { opacity: 0, filter: 'blur(8px)' }
                    }
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{
                      duration: 0.8,
                      ease: [0.4, 0.0, 0.2, 1],
                      delay: selectedId === null ? i * 0.08 : 0,
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
        </>
      )}
    </div>
  );
}
