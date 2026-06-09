import { useRef, useEffect, useState } from 'react';
import { Property } from '../../types';

interface PropertyCardProps {
  property: Property;
  onSelect: (propertyId: string) => void;
  index: number;
}

export default function PropertyCard({ property, onSelect, index }: PropertyCardProps) {
  const isTall = index % 3 === 0;
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
      className={`ps-card ${isTall ? 'ps-card--tall' : 'ps-card--short'}`}
      style={{ '--i': index } as React.CSSProperties}
      aria-label={`View ${property.name}, ${property.location}`}
    >
      <div
        ref={imageRef}
        className="ps-card__image-wrap"
        style={{
          clipPath: revealed ? 'inset(0 0 0 0)' : 'inset(100% 0 0 0)',
          transition: revealed ? `clip-path var(--ps-duration-base) var(--ps-ease-out)` : 'none',
        }}
      >
        <picture>
          {property.imageWebp && <source srcSet={property.imageWebp} type="image/webp" />}
          <img
            src={property.imageUrl}
            alt={property.name}
            className="ps-card__image"
            loading="lazy"
          />
        </picture>
        <div className="ps-card__gradient" />
        <div className={`ps-card__status ps-card__status--${property.occupancyStatus}`} />
        <div className="ps-card__overlay">
          <h3 className="ps-card__name">{property.name}</h3>
          <p className="ps-card__location">{property.location}</p>
          <p className="ps-card__tagline">{property.tagline}</p>
        </div>
      </div>
    </button>
  );
}
