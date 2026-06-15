import { useRef, useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Property } from '../../types';
import { TierLevel } from './StickyHeader';

interface PropertyCardProps {
  property: Property;
  onSelect: (propertyId: string) => void;
  index: number;
  tier: TierLevel;
  tall: boolean;
}

export function isTallCard(index: number, tier: TierLevel): boolean {
  if (tier === 'catalog') return false;
  if (tier === 'gallery') return index % 3 === 0;
  return index % 5 === 0 || index % 5 === 3;
}

const STATUS_LABELS: Record<string, string> = {
  available: 'Open',
  occupied: 'In Residence',
  maintenance: 'On Hold',
  reserved: 'Reserved',
};

export default function PropertyCard({ property, onSelect, index, tall }: PropertyCardProps) {
  const imageRef = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setRevealed(true);
      return;
    }

    const el = imageRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <button
      onClick={() => onSelect(property.id)}
      className={`ps-card dashboard-focus ${tall ? 'ps-card--tall' : 'ps-card--short'}`}
      style={{ '--i': index } as React.CSSProperties}
      aria-label={`View ${property.name}, ${property.location}`}
    >
      <div
        ref={imageRef}
        className="ps-card__image-wrap"
        style={{
          clipPath: revealed ? 'inset(0 0 0 0)' : 'inset(100% 0 0 0)',
          transition: revealed
            ? `clip-path var(--ps-duration-base) var(--ps-ease-out), aspect-ratio var(--ps-duration-base) var(--ps-ease-out)`
            : 'none',
        }}
      >
        <picture>
          {property.imageWebp && <source srcSet={property.imageWebp} type="image/webp" />}
          <motion.img
            layoutId={`property-image-${property.id}`}
            src={property.imageUrl}
            alt={property.name}
            className="ps-card__image"
            loading="lazy"
          />
        </picture>
        <div className="ps-card__gradient" />
        <div className={`ps-card__status ps-card__status--${property.occupancyStatus}`}>
          {STATUS_LABELS[property.occupancyStatus]}
        </div>
        <div className="ps-card__overlay">
          <div className="ps-card__name-rule" aria-hidden="true" />
          <motion.h3 className="ps-card__name" layoutId={`property-title-${property.id}`}>
            {property.name}
          </motion.h3>
          <p className="ps-card__location">{property.location}</p>
        </div>
      </div>
    </button>
  );
}
