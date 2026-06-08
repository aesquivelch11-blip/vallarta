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

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  available: { bg: 'rgba(74, 222, 128, 0.12)', text: '#4ade80' },
  occupied: { bg: 'rgba(251, 191, 36, 0.12)', text: '#fbbf24' },
  maintenance: { bg: 'rgba(148, 163, 184, 0.12)', text: '#94a3b8' },
  reserved: { bg: 'rgba(96, 165, 250, 0.12)', text: '#60a5fa' },
};

export default function PropertyCard({ property, onSelect }: PropertyCardProps) {
  const status = STATUS_COLORS[property.occupancyStatus] ?? STATUS_COLORS.available;

  return (
    <motion.button
      onClick={() => onSelect(property.id)}
      className="group relative flex flex-col w-full text-left cursor-pointer overflow-hidden"
      style={{
        background: 'var(--color-canvas-elevated, #141414)',
        borderRadius: '12px',
        border: '1px solid var(--color-border-subtle, rgba(255,255,255,0.06))',
      }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      aria-label={`View ${property.name} dashboard`}
    >
      {/* Image */}
      <div className="relative w-full overflow-hidden" style={{ aspectRatio: '16/10' }}>
        <picture>
          <source srcSet={property.imageWebp} type="image/webp" />
          <img
            src={property.imageUrl}
            alt=""
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        </picture>
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(to top, rgba(20,20,20,0.6) 0%, transparent 50%)',
          }}
        />
        {/* Status badge */}
        <span
          className="absolute top-3 right-3 font-sans uppercase"
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

      {/* Content */}
      <div className="flex flex-col gap-1 px-4 py-3">
        <span
          className="font-sans uppercase text-[var(--color-ink-secondary, rgba(201,184,160,0.6))]"
          style={{
            fontSize: '0.5625rem',
            fontWeight: 500,
            letterSpacing: '0.30em',
          }}
        >
          {property.location}
        </span>
        <h3
          className="font-serif italic leading-tight text-[var(--color-ink, #F5F1E8)]"
          style={{ fontSize: 'clamp(1.125rem, 2vw, 1.375rem)' }}
        >
          {property.name}
        </h3>
        <div className="flex items-baseline gap-3 mt-1">
          <span
            className="font-sans text-[var(--color-ink-secondary, rgba(201,184,160,0.6))]"
            style={{ fontSize: '0.625rem', letterSpacing: '0.10em', textTransform: 'uppercase' }}
          >
            YTD Revenue
          </span>
          <span
            className="font-serif text-[var(--color-ink, #F5F1E8)]"
            style={{ fontSize: '0.875rem' }}
          >
            {property.metrics?.revenue ?? '—'}
          </span>
        </div>
      </div>
    </motion.button>
  );
}
