import React from 'react';

export default function PropertySkeleton() {
  return (
    <div className="relative w-full h-full overflow-hidden bg-[rgba(255,255,255,0.04)]">
      {/* Fake status dot */}
      <div
        className="absolute animate-pulse"
        style={{
          top: 'var(--ew-card-pad-y)',
          right: 'var(--ew-card-pad-x)',
          width: 'var(--ew-status-dot-size)',
          height: 'var(--ew-status-dot-size)',
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.1)',
        }}
      />
      {/* Fake text — bottom left, asymmetric */}
      <div
        className="absolute bottom-0 left-0"
        style={{
          padding: '0 var(--ew-card-pad-x) var(--ew-card-pad-bottom)',
        }}
      >
        <div
          className="animate-pulse"
          style={{
            height: 'clamp(2rem, 4.5vw, 3.5rem)',
            width: '60%',
            background: 'rgba(255,255,255,0.08)',
            borderRadius: '2px',
          }}
        />
        <div
          className="animate-pulse"
          style={{
            height: '9px',
            width: '35%',
            background: 'rgba(255,255,255,0.06)',
            borderRadius: '2px',
            marginTop: '8px',
          }}
        />
      </div>
    </div>
  );
}
