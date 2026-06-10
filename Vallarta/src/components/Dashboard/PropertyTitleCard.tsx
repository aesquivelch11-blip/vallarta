import React from 'react';
import { useAmbient } from './AmbientColorProvider';

interface PropertyTitleCardProps {
  name: string;
  location: string;
}

export default function PropertyTitleCard({ name, location }: PropertyTitleCardProps) {
  const ambient = useAmbient();

  return (
    <article
      aria-label={`Property: ${name}`}
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        gap: '4px',
        padding: 'clamp(0.75rem, 1.5vw, 1.25rem) clamp(1rem, 2vw, 1.5rem)',
        background: ambient.surface,
        border: '1px solid var(--color-border-subtle)',
        borderRadius: '12px',
        transition: 'background-color 0.4s ease, border-color 0.4s ease',
      }}
    >
      <h2
        style={{
          fontFamily: 'var(--font-display)',
          fontStyle: 'italic',
          fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
          fontWeight: 400,
          letterSpacing: '-0.02em',
          color: 'var(--color-ink)',
          margin: 0,
          lineHeight: 1.1,
        }}
      >
        {name}
      </h2>
      <div
        style={{
          width: '40px',
          height: '2px',
          background: ambient.accent,
          borderRadius: '2px',
          transition: 'width 0.8s var(--ease-out-expo)',
        }}
      />
      <p
        style={{
          fontFamily: 'var(--font-ui)',
          fontSize: '0.5625rem',
          fontWeight: 500,
          letterSpacing: '0.28em',
          textTransform: 'uppercase',
          color: 'var(--color-ink-secondary)',
          margin: 0,
        }}
      >
        {location}
      </p>
    </article>
  );
}
