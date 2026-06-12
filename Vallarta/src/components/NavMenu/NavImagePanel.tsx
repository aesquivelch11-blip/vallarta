import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';

interface NavImageItem {
  id: string;
  image: string;
  imageWebp: string;
  label: string;
}

interface NavImagePanelProps {
  items: NavImageItem[];
  activeIndex: number;
}

export default function NavImagePanel({ items, activeIndex }: NavImagePanelProps) {
  const [loadedIds, setLoadedIds] = useState<Record<string, boolean>>({});
  const shouldReduce = useReducedMotion();

  const handleLoad = (id: string) => {
    setLoadedIds(prev => ({ ...prev, [id]: true }));
  };

  const item = items[activeIndex];
  if (!item) return null;

  return (
    <div
      aria-hidden="true"
      style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}
    >
      {/* Skeleton shown until first image loads */}
      <div
        className={`nav-img-skeleton${loadedIds[item.id] ? ' hidden' : ''}`}
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={activeIndex}
          className="nav-image-layer"
          initial={
            shouldReduce
              ? false
              : { filter: 'blur(8px)', scale: 0.98 }
          }
          animate={
            shouldReduce
              ? { opacity: 1 }
              : { filter: 'blur(0px)', scale: 1 }
          }
          exit={
            shouldReduce
              ? { opacity: 0, transition: { duration: 0 } }
              : { filter: 'blur(8px)', scale: 0.98, transition: { duration: 0.15, ease: 'easeOut' } }
          }
          transition={
            shouldReduce
              ? { duration: 0 }
              : { duration: 0.25, ease: 'easeOut' }
          }
        >
          <picture>
            <source srcSet={item.imageWebp} type="image/webp" />
            <img
              src={item.image}
              alt=""
              className={`cinematic-grade${loadedIds[item.id] ? ' loaded' : ''}`}
              onLoad={() => handleLoad(item.id)}
            />
          </picture>
        </motion.div>
      </AnimatePresence>

      {/* Preload remaining images silently */}
      {items.map((it, i) =>
        i !== activeIndex ? (
          <img
            key={it.id}
            src={it.image}
            alt=""
            aria-hidden="true"
            onLoad={() => handleLoad(it.id)}
            style={{ position: 'absolute', width: 0, height: 0, opacity: 0, pointerEvents: 'none' }}
          />
        ) : null,
      )}

      {/* Scrim overlay */}
      <div className="nav-scrim" />
    </div>
  );
}
