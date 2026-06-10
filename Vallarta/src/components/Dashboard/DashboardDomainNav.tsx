import React from 'react';
import { Sun, TrendingUp, ClipboardList } from 'lucide-react';

export type Domain = 'today' | 'financials' | 'tasks';

interface DashboardDomainNavProps {
  active: Domain;
  onChange: (domain: Domain) => void;
}

const domains: { id: Domain; label: string; Icon: React.FC<{ size?: number; strokeWidth?: number; style?: React.CSSProperties }> }[] = [
  { id: 'today', label: 'Today', Icon: Sun },
  { id: 'financials', label: 'Financials', Icon: TrendingUp },
  { id: 'tasks', label: 'Tasks', Icon: ClipboardList },
];

export default function DashboardDomainNav({ active, onChange }: DashboardDomainNavProps) {
  return (
    <>
      {/* Desktop: vertical strip */}
      <nav
        className="hidden lg:flex flex-col items-center gap-1 py-10"
        style={{
          width: '72px',
          borderRight: '1px solid var(--color-border-subtle)',
        }}
        aria-label="Dashboard sections"
      >
        {domains.map(({ id, label, Icon }, i) => {
          const isActive = active === id;
          const isFirst = i === 0;
          return (
            <button
              key={id}
              onClick={() => onChange(id)}
              aria-pressed={isActive}
              aria-label={label}
              style={{
                marginTop: isFirst ? 0 : '4px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '5px',
                padding: '10px 8px',
                borderRadius: '8px',
                background: isActive ? 'var(--color-border-subtle)' : 'transparent',
                border: 'none',
                cursor: 'pointer',
                width: '56px',
                transition: 'background 0.2s ease',
              }}
            >
              <Icon
                size={isFirst ? 17 : 15}
                strokeWidth={isActive ? 2 : 1.5}
                style={{ color: isActive ? 'var(--color-ink)' : 'var(--color-ink-secondary)' }}
              />
              <span
                style={{
                  fontFamily: 'var(--font-ui)',
                  fontSize: isFirst ? '0.5625rem' : '0.5rem',
                  fontWeight: isActive ? 600 : 400,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: isActive ? 'var(--color-ink)' : 'var(--color-ink-secondary)',
                  lineHeight: 1,
                }}
              >
                {label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Mobile/Tablet: horizontal segmented pill */}
      <nav
        className="flex lg:hidden"
        style={{ padding: '12px 20px 0' }}
        aria-label="Dashboard sections"
      >
        <div
          style={{
            display: 'inline-flex',
            gap: '2px',
            background: 'var(--color-border-subtle)',
            borderRadius: '999px',
            padding: '3px',
          }}
          role="group"
        >
          {domains.map(({ id, label }) => {
            const isActive = active === id;
            return (
              <button
                key={id}
                onClick={() => onChange(id)}
                aria-pressed={isActive}
                style={{
                  fontFamily: 'var(--font-ui)',
                  fontSize: '0.625rem',
                  fontWeight: isActive ? 600 : 400,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: isActive ? 'var(--color-ink)' : 'var(--color-ink-secondary)',
                  background: isActive ? 'var(--color-canvas)' : 'transparent',
                  border: 'none',
                  borderRadius: '999px',
                  padding: '5px 14px',
                  cursor: 'pointer',
                  transition: 'background 0.2s ease, color 0.2s ease',
                  whiteSpace: 'nowrap',
                }}
              >
                {label}
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}