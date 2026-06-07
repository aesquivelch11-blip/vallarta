import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';

interface DashboardGalleryProps {
  images: string[];
}

export default function DashboardGallery({ images }: DashboardGalleryProps) {
  const shouldReduceMotion = useReducedMotion();
  const [currentIndex, setCurrentIndex] = useState(0);
  const directionRef = useRef(0);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);

  const total = images.length;

  const goNext = useCallback(() => {
    if (total <= 1) return;
    directionRef.current = 1;
    setCurrentIndex(prev => (prev + 1) % total);
  }, [total]);

  const goPrev = useCallback(() => {
    if (total <= 1) return;
    directionRef.current = -1;
    setCurrentIndex(prev => (prev - 1 + total) % total);
  }, [total]);

  const handleFrameClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (total <= 1) return;
    const { left, width } = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - left;
    if (clickX >= width / 2) {
      goNext();
    } else {
      goPrev();
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const deltaY = e.changedTouches[0].clientY - touchStartY.current;
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
      if (deltaX > 0) goPrev();
      else goNext();
    }
  };

  if (total === 0) {
    return (
      <div
        className="w-full h-full"
        style={{ background: 'var(--color-canvas)' }}
        aria-hidden="true"
      />
    );
  }

  const slideVariants = shouldReduceMotion
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
      }
    : {
        initial: (dir: number) => ({ x: `${dir * 100}%`, opacity: 0 }),
        animate: { x: '0%', opacity: 1 },
        exit: (dir: number) => ({ x: `${dir * -100}%`, opacity: 0 }),
      };

  const counter = `${String(currentIndex + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}`;

  return (
    <div
      className="w-full h-full flex items-stretch"
      style={{
        background: 'var(--color-canvas)',
        padding: 'clamp(1.5rem, 3vw, 2.5rem) clamp(1.5rem, 3vw, 2.5rem) 0.75rem clamp(1rem, 2vw, 1.75rem)',
        touchAction: 'pan-y',
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      aria-hidden="true"
    >
      <div
        className="relative w-full h-full overflow-hidden"
        onClick={handleFrameClick}
        style={{ cursor: total > 1 ? 'pointer' : 'default', borderRadius: '4px' }}
      >
        <AnimatePresence custom={directionRef.current} mode="wait">
          <motion.img
            key={currentIndex}
            src={images[currentIndex]}
            alt=""
            className="absolute inset-0 w-full h-full"
            style={{ objectFit: 'cover', objectPosition: 'center' }}
            custom={directionRef.current}
            variants={slideVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={
              shouldReduceMotion
                ? { duration: 0.2 }
                : { duration: 0.28, ease: [0.16, 1, 0.3, 1] }
            }
          />
        </AnimatePresence>

        {total > 1 && (
          <span
            className="absolute bottom-3 right-4"
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '0.625rem',
              fontWeight: 500,
              letterSpacing: '0.20em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.55)',
              pointerEvents: 'none',
              userSelect: 'none',
            }}
          >
            {counter}
          </span>
        )}
      </div>
    </div>
  );
}
