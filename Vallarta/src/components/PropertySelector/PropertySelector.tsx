import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ScreenType } from '../../types';
import { sampleProperties } from './propertyData';
import DiagonalSlide from './DiagonalSlide';
import SlideshowPagination from './SlideshowPagination';

interface PropertySelectorProps {
  onNavigate: (screen: ScreenType, transitionStyle: 'push' | 'slide_up') => void;
  onSelectProperty: (propertyId: string) => void;
  onNotify?: (message: string) => void;
}

export default function PropertySelector({ onNavigate, onSelectProperty, onNotify }: PropertySelectorProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isContentOpen, setIsContentOpen] = useState(false);

  const total = sampleProperties.length;
  const prevIndex = (currentIndex - 1 + total) % total;
  const nextIndex = (currentIndex + 1) % total;

  const prevCurrentRef = useRef(sampleProperties[currentIndex].id);

  useEffect(() => {
    prevCurrentRef.current = sampleProperties[currentIndex].id;
  }, [currentIndex]);

  const goNext = useCallback(() => {
    setCurrentIndex(prev => (prev + 1) % total);
    setIsContentOpen(false);
  }, [total]);

  const goPrev = useCallback(() => {
    setCurrentIndex(prev => (prev - 1 + total) % total);
    setIsContentOpen(false);
  }, [total]);

  const goTo = useCallback((index: number) => {
    // Fade transition used when jumping >2 slides (AnimatePresence key change naturally crossfades)
    setCurrentIndex(index);
    setIsContentOpen(false);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goPrev();
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        goNext();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [goNext, goPrev]);

  const handleSlideClick = useCallback((position: 'prev' | 'current' | 'next') => {
    if (position === 'current') {
      setIsContentOpen(true);
    } else if (position === 'next') {
      goNext();
    } else if (position === 'prev') {
      goPrev();
    }
  }, [goNext, goPrev]);

  const getDisplayIndex = (propertyId: string): string => {
    const idx = sampleProperties.findIndex(p => p.id === propertyId);
    return String(idx + 1).padStart(2, '0');
  };

  const visibleSlides = [
    { property: sampleProperties[prevIndex], position: 'prev' as const },
    { property: sampleProperties[currentIndex], position: 'current' as const },
    { property: sampleProperties[nextIndex], position: 'next' as const },
  ];

  const wasCurrent = (id: string) => id === prevCurrentRef.current;

  return (
    <div className="w-full h-[100dvh] bg-[#0c0c0c] relative overflow-hidden">
      <div className="grid grid-cols-1 grid-rows-1 place-items-center w-full h-full">
        <AnimatePresence>
          {visibleSlides.map(({ property, position }) => (
            <motion.div
              key={property.id}
              className="col-start-1 row-start-1"
              initial={{ opacity: 0 }}
              animate={{
                x: position === 'prev' ? '-50%' : position === 'next' ? '50%' : 0,
                y: position === 'prev' ? '-50%' : position === 'next' ? '50%' : 0,
                rotate: position === 'prev' ? -30 : position === 'next' ? 30 : 0,
                opacity: position === 'current' ? 1 : 0.6,
              }}
              exit={{ opacity: 0, scale: 0.85 }}
              transition={{
                duration: 0.8,
                ease: [0.16, 1, 0.3, 1],
                delay: wasCurrent(property.id) ? 0 : 0.14,
              }}
              onClick={() => handleSlideClick(position)}
              style={{ cursor: position === 'current' ? 'pointer' : 'default' }}
            >
              <DiagonalSlide
                property={property}
                position={position}
                isActive={position === 'current'}
                displayIndex={getDisplayIndex(property.id)}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <SlideshowPagination
        total={total}
        currentIndex={currentIndex}
        onJump={goTo}
      />
    </div>
  );
}
