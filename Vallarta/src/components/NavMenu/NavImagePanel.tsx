import React, { useState, useEffect, useRef } from 'react';

interface NavImageItem {
  id: string;
  image: string;
  imageWebp: string;
  label: string;
}

interface NavImagePanelProps {
  items: NavImageItem[];
  activeIndex: number;
  direction?: 'next' | 'prev';
}

export default function NavImagePanel({ items, activeIndex, direction = 'next' }: NavImagePanelProps) {
  const [loadedIds, setLoadedIds] = useState<Record<string, boolean>>({});
  const [currentLayer, setCurrentLayer] = useState(activeIndex);
  const [prevLayer, setPrevLayer] = useState<number | null>(null);
  const [phase, setPhase] = useState<'idle' | 'exiting' | 'entering' | 'enter-done'>('idle');
  const [transitionDirection, setTransitionDirection] = useState<'next' | 'prev'>('next');
  const timers = useRef<number[]>([]);
  const rafId = useRef(0);
  const prefersReduced = useRef(
    typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  ).current;

  const handleLoad = (id: string) => {
    setLoadedIds(prev => ({ ...prev, [id]: true }));
  };

  useEffect(() => {
    if (activeIndex === currentLayer) return;

    timers.current.forEach(clearTimeout);
    timers.current = [];
    cancelAnimationFrame(rafId.current);

    if (prefersReduced) {
      setCurrentLayer(activeIndex);
      setPrevLayer(null);
      setPhase('idle');
      return;
    }

    const dir = direction || (activeIndex > currentLayer ? 'next' : 'prev');
    setTransitionDirection(dir);
    setPrevLayer(currentLayer);
    setPhase('exiting');

    // First RAF: paint the layer at its clipped "from" position
    rafId.current = requestAnimationFrame(() => {
      setCurrentLayer(activeIndex);
      setPhase('entering');

      // Second RAF: browser has now committed the entering (clipped) frame.
      // Setting enter-done here gives the CSS transition a real start state
      // to interpolate from — without this, both state changes collapse into
      // one render and the clip-path snaps instead of wiping.
      rafId.current = requestAnimationFrame(() => {
        setPhase('enter-done');

        timers.current.push(
          window.setTimeout(() => {
            setPrevLayer(null);
            setPhase('idle');
          }, 300), // 250ms transition + 50ms buffer
        );
      });
    });

    return () => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
      cancelAnimationFrame(rafId.current);
    };
  }, [activeIndex]); // eslint-disable-line react-hooks/exhaustive-deps

  const renderLayer = (index: number, layer: 'current' | 'prev') => {
    const item = items[index];
    if (!item) return null;

    const isCurrent = layer === 'current';
    const isPrev = layer === 'prev';

    let layerClass = 'nav-image-layer';
    // Apply exiting to the CURRENT element during exiting phase so React reuses
    // the existing DOM node (same key) instead of mounting a fresh node — this
    // is what allows the idle→exiting transition to fire.
    if (isCurrent && phase === 'exiting') {
      layerClass += ' nav-image-exiting';
    }
    if (isPrev && (phase === 'entering' || phase === 'enter-done')) {
      layerClass += ' nav-image-exiting';
    }
    if (isCurrent && phase === 'entering') {
      layerClass += ' nav-image-entering';
    }
    if (isCurrent && phase === 'enter-done') {
      layerClass += ' nav-image-enter-done';
    }

    return (
      <div
        key={index}
        className={layerClass}
        data-direction={transitionDirection}
        // Explicit z-index keeps stacking order unambiguous inside the
        // will-change compositing context: prev stays below current
        // so the wipe reveals the new image on top.
        style={{ zIndex: isCurrent ? 2 : 1 }}
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
      </div>
    );
  };

  const activeItem = items[activeIndex];
  if (!activeItem) return null;

  return (
    <div
      aria-hidden="true"
      style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}
    >
      <div className={`nav-img-skeleton${loadedIds[activeItem.id] ? ' hidden' : ''}`} />

      {prevLayer !== null && renderLayer(prevLayer, 'prev')}
      {renderLayer(currentLayer, 'current')}

      {items.map((it, i) =>
        i !== activeIndex && i !== prevLayer ? (
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

      <div className="nav-scrim" />
    </div>
  );
}
