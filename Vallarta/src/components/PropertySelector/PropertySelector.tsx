import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ScreenType } from '../../types';
import { sampleProperties } from './propertyData';
import DiagonalSlide from './DiagonalSlide';
import SlideshowPagination from './SlideshowPagination';
import PropertyContent from './PropertyContent';

interface PropertySelectorProps {
  onNavigate: (screen: ScreenType, transitionStyle: 'push' | 'slide_up') => void;
  onSelectProperty: (propertyId: string) => void;
  onNotify?: (message: string) => void;
}

export default function PropertySelector({ onNavigate, onSelectProperty, onNotify }: PropertySelectorProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isContentOpen, setIsContentOpen] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0, rotX: 0, rotY: 0 });
  const [isDesktop, setIsDesktop] = useState(false);
  const tiltFrameRef = useRef(0);

  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 1024);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    return () => cancelAnimationFrame(tiltFrameRef.current);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isContentOpen || !isDesktop) {
      setTilt({ x: 0, y: 0, rotX: 0, rotY: 0 });
      return;
    }
    cancelAnimationFrame(tiltFrameRef.current);
    tiltFrameRef.current = requestAnimationFrame(() => {
      const { clientX, clientY } = e;
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      setTilt({
        x: ((clientX - cx) / cx) * 10,
        y: ((clientY - cy) / cy) * 10,
        rotX: ((clientY - cy) / cy) * 5,
        rotY: ((clientX - cx) / cx) * 5,
      });
    });
  }, [isContentOpen, isDesktop]);

  const total = sampleProperties.length;

  const prevIndex = total > 0 ? (currentIndex - 1 + total) % total : 0;
  const nextIndex = total > 0 ? (currentIndex + 1) % total : 0;

  const goNext = useCallback(() => {
    setCurrentIndex(prev => (prev + 1) % total);
    setIsContentOpen(false);
  }, [total]);

  const goPrev = useCallback(() => {
    setCurrentIndex(prev => (prev - 1 + total) % total);
    setIsContentOpen(false);
  }, [total]);

  const goTo = useCallback((index: number) => {
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
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setIsContentOpen(true);
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

  const handleSlideKeyDown = (e: React.KeyboardEvent, position: 'prev' | 'current' | 'next') => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleSlideClick(position);
    }
  };

  const getDisplayIndex = (index: number): string => {
    return String(index + 1).padStart(2, '0');
  };

  const visibleSlides = [
    { property: sampleProperties[prevIndex], position: 'prev' as const, index: prevIndex },
    { property: sampleProperties[currentIndex], position: 'current' as const, index: currentIndex },
    { property: sampleProperties[nextIndex], position: 'next' as const, index: nextIndex },
  ];

  if (total === 0) {
    return (
      <div className="w-full h-[100dvh] bg-[#0c0c0c] flex items-center justify-center">
        <p className="text-[#C9B8A0]/60 font-sans text-sm tracking-wide">No properties available</p>
      </div>
    );
  }

  const liveAnnouncement = `${sampleProperties[currentIndex].name}, property ${currentIndex + 1} of ${total}`;

  return (
    <div className="w-full h-[100dvh] bg-[#0c0c0c] relative overflow-hidden" onMouseMove={handleMouseMove}>
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {liveAnnouncement}
      </div>

      <div className="grid grid-cols-1 grid-rows-1 place-items-center w-full h-full">
        <AnimatePresence>
          {visibleSlides.map(({ property, position, index }) => (
            <motion.div
              key={property.id}
              className="col-start-1 row-start-1"
              initial={{ opacity: 0 }}
              animate={
                isContentOpen
                  ? {
                      x: position === 'current' ? '-30%' : position === 'prev' ? '-80%' : '80%',
                      y: position === 'prev' ? '-50%' : position === 'next' ? '50%' : 0,
                      rotate: 0,
                      opacity: position === 'current' ? 1 : 0,
                      scale: position !== 'current' ? 0.85 : 1,
                    }
                  : {
                      x: position === 'prev' ? '-50%' : position === 'next' ? '50%' : 0,
                      y: position === 'prev' ? '-50%' : position === 'next' ? '50%' : 0,
                      rotate: position === 'prev' ? -30 : position === 'next' ? 30 : 0,
                      opacity: position === 'current' ? 1 : 0.6,
                    }
              }
              exit={{ opacity: 0, scale: 0.85 }}
              transition={{
                duration: 0.8,
                ease: [0.16, 1, 0.3, 1],
                delay: position === 'current' ? 0 : 0.14,
              }}
              onClick={() => handleSlideClick(position)}
              onKeyDown={(e) => handleSlideKeyDown(e, position)}
              role={position === 'current' ? 'button' : undefined}
              tabIndex={position === 'current' ? 0 : undefined}
              aria-label={position === 'current' ? `View ${property.name} details` : undefined}
              style={{ perspective: '1200px', transformStyle: 'preserve-3d', cursor: position === 'current' ? 'pointer' : 'default' }}
            >
              <DiagonalSlide
                property={property}
                position={position}
                isActive={position === 'current'}
                displayIndex={getDisplayIndex(index)}
                tiltX={position === 'current' ? tilt.x : 0}
                tiltY={position === 'current' ? tilt.y : 0}
                rotX={position === 'current' ? tilt.rotX : 0}
                rotY={position === 'current' ? tilt.rotY : 0}
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

      <PropertyContent
        property={sampleProperties[currentIndex]}
        isOpen={isContentOpen}
        onClose={() => setIsContentOpen(false)}
        onSelect={() => onSelectProperty(sampleProperties[currentIndex].id)}
      />
    </div>
  );
}
