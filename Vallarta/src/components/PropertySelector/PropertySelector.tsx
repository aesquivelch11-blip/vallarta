import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import Lenis from 'lenis';
import { ScreenType } from '../../types';
import { sampleProperties } from './propertyData';
import PropertyCard, { isTallCard } from './PropertyCard';
import PropertySkeleton from './PropertySkeleton';
import StickyHeader, { TierLevel } from './StickyHeader';

interface PropertySelectorProps {
  onNavigate: (screen: ScreenType, transitionStyle: 'push' | 'push_back' | 'slide_up') => void;
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

export default function PropertySelector({ onNavigate, onSelectProperty }: PropertySelectorProps) {
  const [phase, setPhase] = useState<'wordmark' | 'grid' | 'ready'>('wordmark');
  const [tier, setTier] = useState<TierLevel>(getInitialTier);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

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

    let rafId: number;

    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
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

      <AnimatePresence>
        {phase === 'wordmark' && (
          <motion.div
            key="hero-wordmark"
            className="ps-hero"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
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
            <StickyHeader tier={tier} onTierChange={handleTierChange} onSearch={handleSearch} onNavigate={onNavigate} />
          </motion.div>

          {filteredProperties.length > 0 && (
            <div className="ps-section-banner" aria-hidden="true">
              <span className="ps-section-banner__rule" />
              <span className="ps-section-banner__label">
                {filteredProperties.length} Estate{filteredProperties.length !== 1 ? 's' : ''} · Banderas Bay
              </span>
              <span className="ps-section-banner__rule" />
            </div>
          )}

          {filteredProperties.length === 0 ? (
            <div className="ps-empty">
              <p className="ps-empty__text">No properties match your search.</p>
              <p className="ps-empty__subtext">Try adjusting your search terms.</p>
              <button className="ps-empty__cta" onClick={() => handleSearch('')}>
                Clear search
              </button>
            </div>
          ) : (
            <div className={gridClass}>
              <AnimatePresence mode="sync">
                {filteredProperties.map((property, i) => {
                  const tall = isTallCard(i, tier);
                  return (
                    <motion.div
                      key={property.id}
                      className={`ps-grid-cell${tall ? ' ps-grid-cell--tall' : ''}`}
                      layout
                      initial={{ opacity: 0, y: 16 }}
                      animate={
                        selectedId === null
                          ? { opacity: 1, y: 0 }
                          : selectedId === property.id
                            ? { opacity: 1, y: 0 }
                            : { opacity: 0.4, filter: 'blur(4px)', y: 4 }
                      }
                      exit={{ opacity: 0, scale: 0.97 }}
                      transition={{
                        layout: { duration: 0.5, ease: [0.23, 1, 0.32, 1] },
                        opacity: {
                          duration: shouldReduceMotion ? 0 : 0.6,
                          ease: [0.23, 1, 0.32, 1],
                          delay: shouldReduceMotion ? 0 : (selectedId === null ? i * 0.06 : 0),
                        },
                        y: {
                          duration: shouldReduceMotion ? 0 : 0.6,
                          ease: [0.23, 1, 0.32, 1],
                          delay: shouldReduceMotion ? 0 : (selectedId === null ? i * 0.06 : 0),
                        },
                        filter: {
                          duration: shouldReduceMotion ? 0 : 0.6,
                          ease: [0.23, 1, 0.32, 1],
                        },
                      }}
                    >
                      <PropertyCard
                        property={property}
                        onSelect={handleSelect}
                        index={i}
                        tier={tier}
                        tall={tall}
                      />
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </>
      )}
    </div>
  );
}
