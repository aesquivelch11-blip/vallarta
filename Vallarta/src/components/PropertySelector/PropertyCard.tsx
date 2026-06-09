import React from 'react';
import { motion } from 'motion/react';
import { Property } from '../../types';

interface PropertyCardProps {
  property: Property;
  onSelect: (propertyId: string) => void;
  parallaxClass?: string;
}

export default function PropertyCard({ property, onSelect, parallaxClass }: PropertyCardProps) {
  return (
    <motion.button
      onClick={() => onSelect(property.id)}
      className="group relative w-full h-full text-left cursor-pointer overflow-hidden focus-visible:outline-none"
      onFocus={(e) => {
        e.currentTarget.style.boxShadow = 'inset 0 0 0 2px var(--color-dark-accent, #d49a55)';
      }}
      onBlur={(e) => {
        e.currentTarget.style.boxShadow = 'none';
      }}
      aria-label={`View ${property.name} — ${property.occupancyStatus}`}
    >
      {/* Status micro-dot — top right */}
      <div
        className={`ew-status-dot ew-status-dot--${property.occupancyStatus}`}
        aria-hidden="true"
      />

      <div className="relative w-full h-full overflow-hidden bg-[var(--color-canvas-elevated,#141414)]">
        {/* Image with parallax */}
        <div className={`absolute inset-0 ${parallaxClass || ''}`}>
          <picture>
            {property.imageWebp && <source srcSet={property.imageWebp} type="image/webp" />}
            <img
              src={property.imageUrl}
              alt={property.name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </picture>
        </div>

        {/* Bottom gradient — tighter, asymmetric */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(to top, rgba(12,12,12,0.82) 0%, rgba(12,12,12,0.15) 35%, transparent 55%)',
            transition: 'opacity 0.3s cubic-bezier(0.25, 1, 0.5, 1)',
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100"
          style={{
            background: 'linear-gradient(to top, rgba(12,12,12,0.88) 0%, rgba(12,12,12,0.25) 35%, transparent 55%)',
            transition: 'opacity 0.3s cubic-bezier(0.25, 1, 0.5, 1)',
          }}
        />

        {/* Text overlay — asymmetric padding, bottom-left anchored */}
        <div
          className="absolute bottom-0 left-0"
          style={{
            padding: `0 var(--ew-card-pad-x) var(--ew-card-pad-bottom)`,
          }}
        >
          <h3
            className="italic"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'var(--ew-name-size)',
              fontWeight: 400,
              color: 'rgba(255,255,255,0.94)',
              lineHeight: 0.95,
              letterSpacing: '-0.02em',
            }}
          >
            {property.name}
          </h3>
          <span
            className="uppercase block"
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: 'var(--ew-location-size)',
              fontWeight: 400,
              letterSpacing: 'var(--ew-location-tracking)',
              color: 'rgba(255,255,255,0.4)',
              marginTop: '8px',
            }}
          >
            {property.location}
          </span>
        </div>
      </div>
    </motion.button>
  );
}
