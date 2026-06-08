import React from 'react';
import { motion } from 'motion/react';
import { Property } from '../../types';

interface PropertyCardProps {
  property: Property;
  onSelect: (propertyId: string) => void;
  isActive?: boolean;
}

const STATUS_LABELS: Record<string, string> = {
  available: 'Available',
  occupied: 'Occupied',
  maintenance: 'Maintenance',
  reserved: 'Reserved',
};

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  available: { bg: 'rgba(74, 222, 128, 0.12)', text: '#4ade80' },
  occupied: { bg: 'rgba(251, 191, 36, 0.12)', text: '#fbbf24' },
  maintenance: { bg: 'rgba(148, 163, 184, 0.12)', text: '#94a3b8' },
  reserved: { bg: 'rgba(96, 165, 250, 0.12)', text: '#60a5fa' },
};

export default function PropertyCard({ property, onSelect, isActive = false }: PropertyCardProps) {
  const status = STATUS_COLORS[property.occupancyStatus] ?? STATUS_COLORS.available;

  if (isActive) {
    return (
      <div className="w-full h-full relative">
        <picture>
          <source srcSet={property.imageWebp} type="image/webp" />
          <img
            src={property.imageUrl}
            alt=""
            className="w-full h-full object-cover"
          />
        </picture>
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(to top, rgba(20,20,20,0.4) 0%, transparent 40%)',
          }}
        />
      </div>
    );
  }

  return (
    <motion.button
      onClick={() => onSelect(property.id)}
      className="group relative flex flex-col w-full text-left cursor-pointer overflow-hidden h-full rounded-xl"
      whileHover={{ scale: 0.95 }}
      whileTap={{ scale: 0.92 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      aria-label={`View ${property.name}`}
    >
      <div className="relative w-full h-full overflow-hidden rounded-xl bg-[var(--color-canvas-elevated,#141414)]">
        <picture>
          <source srcSet={property.imageWebp} type="image/webp" />
          <img
            src={property.imageUrl}
            alt=""
            className="w-full h-full object-cover transition-transform duration-1000 ease-[0.16,1,0.3,1] group-hover:scale-125"
          />
        </picture>
        
        {/* Status badge */}
        <span
          className="absolute top-3 right-3 font-sans uppercase z-10"
          style={{
            fontSize: '0.5625rem',
            fontWeight: 500,
            letterSpacing: '0.15em',
            padding: '4px 10px',
            borderRadius: '999px',
            background: status.bg,
            color: status.text,
          }}
        >
          {STATUS_LABELS[property.occupancyStatus] ?? property.occupancyStatus}
        </span>
      </div>
    </motion.button>
  );
}
