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
}

export default function NavImagePanel({ items, activeIndex }: NavImagePanelProps) {
  const [loadedIds, setLoadedIds] = useState<Record<string, boolean>>({});
  const [currentLayer, setCurrentLayer] = useState(activeIndex);
  const [prevLayer, setPrevLayer] = useState<number | null>(null);
  const [phase, setPhase] = useState<'idle' | 'exiting' | 'entering' | 'enter-done'>('idle');
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

    setPrevLayer(currentLayer);
    setPhase('exiting');

    rafId.current = requestAnimationFrame(() => {
      setCurrentLayer(activeIndex);
      setPhase('entering');

      timers.current.push(
        window.setTimeout(() => {
          setPhase('enter-done');
          timers.current.push(
            window.setTimeout(() => {
              setPrevLayer(null);
              setPhase('idle');
            }, 250),
          );
        }, 310),
      );
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
    if (isPrev && (phase === 'exiting' || phase === 'entering' || phase === 'enter-done')) {
      layerClass += ' nav-image-exiting';
    }
    if (isCurrent && phase === 'entering') {
      layerClass += ' nav-image-entering';
    }
    if (isCurrent && phase === 'enter-done') {
      layerClass += ' nav-image-enter-done';
    }

    return (
      <div key={`${layer}-${index}`} className={layerClass}>
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
