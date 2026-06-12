import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';

interface DashboardGalleryProps {
  images: string[];
  propertyId: string;
  propertyName: string;
  propertyLocation: string;
}

export default function DashboardGallery({
  images,
  propertyId,
  propertyName,
  propertyLocation,
}: DashboardGalleryProps) {
  const shouldReduceMotion = useReducedMotion();
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);

  const total = images.length;

  const goNext = useCallback(() => {
    if (total <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);

  const goPrev = useCallback(() => {
    if (total <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  const handleFrameClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (total <= 1) return;
    const { left, width } = e.currentTarget.getBoundingClientRect();
    if (e.clientX - left >= width / 2) goNext();
    else goPrev();
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

  const imageVariants = shouldReduceMotion
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1, transition: { duration: 0.25 } },
        exit: { opacity: 0, transition: { duration: 0.2 } },
      }
    : {
        initial: { opacity: 0, scale: 1.04 },
        animate: {
          opacity: 1,
          scale: 1,
          transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
        },
        exit: {
          opacity: 0,
          scale: 0.98,
          transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const },
        },
      };

  const counterCurrent = String(currentIndex + 1).padStart(2, '0');
  const counterTotal = String(total).padStart(2, '0');

  return (
    <div
      className="w-full h-full"
      role="region"
      aria-label={`${propertyName} gallery`}
      style={{
        position: 'relative',
        overflow: 'hidden',
        touchAction: 'pan-y',
        cursor: total > 1 ? 'pointer' : 'default',
        background: '#111',
      }}
      onClick={handleFrameClick}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <AnimatePresence mode="sync">
        <motion.img
          key={`${propertyId}-${currentIndex}`}
          src={images[currentIndex]}
          alt=""
          className="cinematic-grade"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
          }}
          variants={imageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        />
      </AnimatePresence>

      <div className="hero__gradient" aria-hidden="true" />

      <div className="hero__identity" aria-hidden="true">
        <p className="hero__property-name">{propertyName}</p>
        <p className="hero__property-location">{propertyLocation}</p>
      </div>

      {total > 1 && (
        <div className="hero__counter" aria-hidden="true">
          <span className="hero__counter-current">{counterCurrent}</span>
          <span className="hero__counter-sep">/</span>
          <span className="hero__counter-total">{counterTotal}</span>
        </div>
      )}
    </div>
  );
}
