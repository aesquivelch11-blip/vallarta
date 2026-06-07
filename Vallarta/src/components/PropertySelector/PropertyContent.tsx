import { motion, AnimatePresence } from 'motion/react';
import React, { useEffect, useRef } from 'react';
import { Property } from '../../types';

interface PropertyContentProps {
  property: Property;
  isOpen: boolean;
  onClose: () => void;
  onSelect: () => void;
}

const stagger = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.4,
    },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function PropertyContent({ property, isOpen, onClose, onSelect }: PropertyContentProps) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      closeRef.current?.focus();
    } else if (previousFocusRef.current) {
      previousFocusRef.current.focus();
      previousFocusRef.current = null;
    }
  }, [isOpen]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== 'Tab') return;
    const focusable = panelRef.current?.querySelectorAll<HTMLElement>(
      'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (!focusable || focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Property details"
          className="fixed inset-0 z-50 flex justify-end"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          onKeyDown={handleKeyDown}
        >
          <motion.div
            className="absolute inset-0 bg-black/40"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          />

          <motion.div
            ref={panelRef}
            className="relative h-full bg-[rgba(12,12,12,0.95)] overflow-y-auto w-full lg:w-1/2"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%', transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <button
              ref={closeRef}
              onClick={onClose}
              className="absolute top-8 left-8 z-10 text-[#C9B8A0] cursor-pointer group"
              aria-label="Close"
            >
              <svg width="36" height="18" viewBox="0 0 36 18" fill="none">
                <path d="M17 9H31" stroke="currentColor" strokeWidth="1.5" />
                <path d="M17 9L11 3" stroke="currentColor" strokeWidth="1.5" />
                <path d="M17 9L11 15" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </button>

            <motion.div
              className="px-12 pt-28 pb-12 flex flex-col gap-5"
              variants={stagger}
              initial="hidden"
              animate="visible"
            >
              <motion.h2
                className="font-serif italic leading-none text-white"
                style={{ fontSize: 'clamp(2.75rem, 5.5vw, 4.5rem)' }}
                variants={fadeUp}
              >
                {property.name}
              </motion.h2>

              <motion.p
                className="font-sans text-[0.75rem] uppercase tracking-[0.35em] text-[#C9B8A0]/80"
                variants={fadeUp}
              >
                {property.location}
              </motion.p>

              <motion.p
                className="font-sans text-base font-light text-[#C9B8A0]/60 leading-relaxed"
                variants={fadeUp}
              >
                {property.tagline}
              </motion.p>

              {property.metrics && (
                <motion.div className="flex gap-8 mt-4" variants={fadeUp}>
                  <div>
                    <p className="font-sans text-[0.65rem] uppercase tracking-[0.15em] text-[#C9B8A0]/50 mb-1">Bedrooms</p>
                    <p className="font-sans text-lg text-[#F5F1E8]">{property.metrics.bedrooms}</p>
                  </div>
                  <div>
                    <p className="font-sans text-[0.65rem] uppercase tracking-[0.15em] text-[#C9B8A0]/50 mb-1">Occupancy</p>
                    <p className="font-sans text-lg text-[#F5F1E8]">{property.metrics.occupancy}</p>
                  </div>
                  <div>
                    <p className="font-sans text-[0.65rem] uppercase tracking-[0.15em] text-[#C9B8A0]/50 mb-1">Revenue</p>
                    <p className="font-sans text-lg text-[#F5F1E8]">{property.metrics.revenue}</p>
                  </div>
                </motion.div>
              )}

              <motion.div variants={fadeUp}>
                <button
                  onClick={onSelect}
                  className="mt-6 px-10 py-3.5 bg-[#C9B8A0] text-[#0c0c0c] font-sans text-xs uppercase tracking-[0.2em] cursor-pointer"
                >
                  Enter Estate
                </button>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
