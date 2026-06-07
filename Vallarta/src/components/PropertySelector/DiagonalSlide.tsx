import { motion } from 'motion/react';
import { Property } from '../../types';

interface DiagonalSlideProps {
  property: Property;
  position: 'prev' | 'current' | 'next';
  isActive: boolean;
  displayIndex: string;
}

export default function DiagonalSlide({ property, position, isActive, displayIndex }: DiagonalSlideProps) {
  return (
    <div
      className="relative select-none"
      style={{ width: 'clamp(280px, 48vw, 560px)' }}
    >
      {position === 'current' && (
        <div className="absolute -inset-3 bg-[#141414] -z-10" />
      )}

      <div className="flex flex-col w-full" style={{ aspectRatio: '3/4' }}>
        <div className="relative overflow-hidden flex-[8] min-h-0">
          <picture className="absolute inset-0">
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
              background:
                'linear-gradient(to bottom, rgba(12,12,12,0.4) 0%, transparent 20%), linear-gradient(to top, rgba(12,12,12,0.8) 0%, rgba(12,12,12,0.5) 36%, transparent 100%)',
            }}
          />
        </div>

        <div className="flex-[2] flex items-end justify-between px-1 pb-3 min-h-0">
          <div>
            <motion.span
              className="block font-sans text-[0.6875rem] uppercase tracking-[0.35em] text-[#C9B8A0]/80"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
            >
              {displayIndex}
            </motion.span>
            <motion.h2
              className="font-serif italic leading-none text-white"
              style={{ fontSize: 'clamp(2.75rem, 5.5vw, 4.5rem)' }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            >
              {property.name}
            </motion.h2>
          </div>
          <motion.span
            className="font-sans text-[0.75rem] uppercase tracking-[0.20em] text-[#C9B8A0]/60 shrink-0"
            style={{ writingMode: 'vertical-rl' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
          >
            {property.location}
          </motion.span>
        </div>
      </div>
    </div>
  );
}
