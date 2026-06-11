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

  return (
    <div
      aria-hidden="true"
      style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}
    >
      {/* Skeleton shown until first image loads */}
      <div
        className={`nav-img-skeleton${loadedIds[item.id] ? ' hidden' : ''}`}
      />

      <AnimatePresence mode="sync">
        <motion.div
          key={activeIndex}
          className="nav-image-layer"
          initial={shouldReduce ? false : { clipPath: 'inset(0 100% 0 0)' }}
          animate={{ clipPath: 'inset(0 0% 0 0)' }}
          exit={
            shouldReduce
              ? { opacity: 0, transition: { duration: 0 } }
              : { opacity: 0, transition: { duration: 0.18, ease: [0.23, 1, 0.32, 1] } }
          }
          transition={
            shouldReduce
              ? { duration: 0 }
              : { duration: 0.45, ease: [0.23, 1, 0.32, 1] }
          }
        >
          <picture>
            <source srcSet={item.imageWebp} type="image/webp" />
            <img
              src={item.image}
              alt=""
              className={loadedIds[item.id] ? 'loaded' : ''}
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
