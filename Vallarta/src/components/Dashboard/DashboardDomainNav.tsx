import React from 'react';
import { motion } from 'motion/react';

export type Domain = 'today' | 'financials' | 'tasks';

interface DashboardDomainNavProps {
  active: Domain;
  onChange: (domain: Domain) => void;
}

const domains: { id: Domain; label: string }[] = [
  { id: 'today', label: 'Today' },
  { id: 'financials', label: 'Financials' },
  { id: 'tasks', label: 'Tasks' },
];

export default function DashboardDomainNav({ active, onChange }: DashboardDomainNavProps) {
  return (
    <nav
      aria-label="Dashboard sections"
      style={{
        display: 'flex',
        alignItems: 'stretch',
        height: '40px',
        flexShrink: 0,
        borderBottom: '1px solid var(--color-border-subtle)',
        padding: '0 clamp(1.5rem, 3vw, 2.5rem)',
        gap: 'clamp(1.25rem, 2.5vw, 2rem)',
      }}
    >
      {domains.map(({ id, label }) => {
        const isActive = active === id;
        return (
          <div
            key={id}
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {isActive && (
              <motion.div
                layoutId="domain-indicator"
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: '1px',
                  background: 'var(--color-ink)',
                  borderRadius: 0,
                }}
                transition={{ type: 'spring', bounce: 0.1, duration: 0.35 }}
              />
            )}
            <button
              onClick={() => onChange(id)}
              aria-pressed={isActive}
              aria-label={`Switch to ${label} view`}
              style={{
                fontFamily: 'var(--font-ui)',
                fontSize: '0.6875rem',
                fontWeight: isActive ? 500 : 400,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: isActive ? 'var(--color-ink)' : 'var(--color-ink-secondary)',
                background: 'none',
                border: 'none',
                padding: 0,
                height: '100%',
                cursor: 'pointer',
                transition: 'color 0.18s ease',
                whiteSpace: 'nowrap',
                lineHeight: 1,
              }}
            >
              {label}
            </button>
          </div>
        );
      })}
    </nav>
  );
}
