import React from 'react';
import { motion } from 'motion/react';
import { Property } from '../../types';

interface PropertyCardProps {
  property: Property;
  onSelect: (propertyId: string) => void;
}

const STATUS_LABELS: Record<string, string> = {
  available: 'Available',
  occupied: 'Occupied',
  maintenance: 'Maintenance',
  reserved: 'Reserved',
};

export default function PropertyCard({ property, onSelect }: PropertyCardProps) {
  return (
    <motion.button
      onClick={() => onSelect(property.id)}
      className="group relative w-full h-full text-left cursor-pointer overflow-hidden"
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      aria-label={`View ${property.name}`}
    >
      <div className="relative w-full h-full overflow-hidden bg-[var(--color-canvas-elevated,#141414)]">
        <picture>
          <source srcSet={property.imageWebp} type="image/webp" />
          <img
            src={property.imageUrl}
            alt={property.name}
            className="w-full h-full object-cover"
          />
        </picture>

        {/* Bottom gradient overlay */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300"
          style={{
            background: 'linear-gradient(to top, rgba(12,12,12,0.75) 0%, rgba(12,12,12,0.2) 40%, transparent 60%)',
          }}
        />

        {/* Text overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <h3
            className="font-serif italic"
            style={{
              fontSize: 'clamp(1.25rem, 2.5vw, 1.75rem)',
              color: 'rgba(255,255,255,0.9)',
              lineHeight: 1.2,
            }}
          >
            {property.name}
          </h3>
          <div className="flex items-end justify-between mt-1">
            <span
              className="font-sans uppercase"
              style={{
                fontSize: '0.625rem',
                letterSpacing: '0.25em',
                color: 'rgba(255,255,255,0.5)',
              }}
            >
              {property.location}
            </span>
            <span
              className="font-sans uppercase"
              style={{
                fontSize: '0.5625rem',
                letterSpacing: '0.15em',
                color: 'rgba(255,255,255,0.4)',
              }}
            >
              {STATUS_LABELS[property.occupancyStatus] ?? property.occupancyStatus}
            </span>
          </div>
        </div>
      </div>
    </motion.button>
  );
}
