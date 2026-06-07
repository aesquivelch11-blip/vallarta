import { motion, useReducedMotion } from 'motion/react';

interface SlideshowPaginationProps {
  total: number;
  currentIndex: number;
  onJump: (index: number) => void;
}

export default function SlideshowPagination({ total, currentIndex, onJump }: SlideshowPaginationProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div
      role="tablist"
      aria-label="Property slides"
      className="absolute bottom-8 right-8 max-md:bottom-6 max-md:left-1/2 max-md:-translate-x-1/2 max-md:right-auto flex items-center gap-3 z-20"
    >
      {Array.from({ length: total }, (_, i) => (
        <button
          key={i}
          role="tab"
          aria-selected={i === currentIndex}
          aria-label={`Property ${i + 1}`}
          onClick={() => onJump(i)}
          className="cursor-pointer"
        >
          <motion.span
            className="block rounded-full"
            style={{
              width: i === currentIndex ? 8 : 6,
              height: i === currentIndex ? 8 : 6,
              backgroundColor: i === currentIndex ? '#C9B8A0' : 'rgba(255,255,255,0.3)',
            }}
            animate={i === currentIndex ? { scale: 1.3 } : { scale: 1 }}
            transition={
              shouldReduceMotion
                ? { duration: 0.2 }
                : {
                    type: 'spring',
                    stiffness: 300,
                    damping: 15,
                  }
            }
          />
        </button>
      ))}
    </div>
  );
}
