import React, { useEffect, useState } from 'react';

interface PreloaderProps {
  onComplete: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const [letters, setLetters] = useState<string[]>([]);
  const [animationStarted, setAnimationStarted] = useState(false);

  useEffect(() => {
    const text = 'VALLARTA ESTATES';
    setLetters(text.split(''));
    setAnimationStarted(true);

    // The lineGrow animation takes 2.2 seconds and starts at 0.9s delay (total 3.1s).
    // Let's trigger onComplete after the preloader finishes (e.g. 3.2 seconds total).
    const timer = setTimeout(() => {
      onComplete();
    }, 3200);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: '#0c0c0c',
        color: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 99999,
        fontFamily: "'Inter', sans-serif",
        WebkitFontSmoothing: 'antialiased',
        overflow: 'hidden',
      }}
      id="site-preloader"
    >
      {/* Noise background overlay */}
      <div
        style={{
          content: "''",
          position: 'absolute',
          inset: 0,
          opacity: 0.035,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            fontSize: '14px',
            fontWeight: 500,
            letterSpacing: '0.4em',
            textTransform: 'uppercase',
            display: 'flex',
            gap: '0.25em',
            marginBottom: '32px',
          }}
          id="brand"
        >
          {animationStarted &&
            letters.map((char, i) => (
              <span
                key={i}
                style={{
                  display: 'inline-block',
                  opacity: 0,
                  transform: 'translateY(12px)',
                  animation: 'letterIn 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards',
                  animationDelay: `${200 + i * 70}ms`,
                }}
              >
                {char === ' ' ? '\u00A0' : char}
              </span>
            ))}
        </div>

        <div
          style={{
            width: '120px',
            height: '1px',
            background: 'rgba(255, 255, 255, 0.08)',
            position: 'relative',
            overflow: 'hidden',
            borderRadius: '1px',
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: '#ffffff',
              transform: 'scaleX(0)',
              transformOrigin: 'left',
              animation: 'lineGrow 2.2s cubic-bezier(0.22, 1, 0.36, 1) forwards',
              animationDelay: '0.9s',
            }}
          />
        </div>
      </div>

      <style>{`
        @keyframes letterIn {
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes lineGrow {
          0%   { transform: scaleX(0); transform-origin: left; }
          50%  { transform: scaleX(1); transform-origin: left; }
          51%  { transform-origin: right; }
          100% { transform: scaleX(0); transform-origin: right; }
        }
      `}</style>
    </div>
  );
}
