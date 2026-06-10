import React, { useEffect, useState } from 'react';

const CIRCUMFERENCE = 2 * Math.PI * 45;

interface PropertyHealthScoreProps {
  score: number;
}

export default function PropertyHealthScore({ score }: PropertyHealthScoreProps) {
  const clampedScore = Math.min(100, Math.max(0, score));
  const [animatedScore, setAnimatedScore] = useState(0);
  const [strokeOffset, setStrokeOffset] = useState(CIRCUMFERENCE);

  const targetOffset = CIRCUMFERENCE - (clampedScore / 100) * CIRCUMFERENCE;

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedScore(clampedScore);
      setStrokeOffset(targetOffset);
    }, 100);
    return () => clearTimeout(timer);
  }, [clampedScore, targetOffset]);

  const getColor = (s: number) => {
    if (s >= 80) return 'var(--color-accent-positive)';
    if (s >= 60) return 'var(--color-accent-warning)';
    return 'var(--color-accent-negative)';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
      <div style={{ position: 'relative', width: '120px', height: '120px' }}>
        <svg width="120" height="120" viewBox="0 0 120 120" aria-hidden="true">
          <circle cx="60" cy="60" r="45" fill="none" stroke="var(--color-border-subtle)" strokeWidth="4" />
          <circle
            cx="60" cy="60" r="45" fill="none" stroke={getColor(score)}
            strokeWidth="4" strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE} strokeDashoffset={strokeOffset}
            transform="rotate(-90 60 60)"
            style={{ transition: 'stroke-dashoffset 0.8s var(--ease-out-expo)' }}
          />
        </svg>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem, 2.5vw, 2rem)', fontWeight: 400, color: 'var(--color-ink)', margin: 0, lineHeight: 1 }}>
            {animatedScore}
          </p>
        </div>
      </div>
      <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.5625rem', fontWeight: 500, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--color-ink-secondary)', margin: 0 }}>
        Property Health
      </p>
    </div>
  );
}
