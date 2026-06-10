import React, { useEffect, useState } from 'react';

interface AnimatedFigureProps {
  value: number;
  formatter: (n: number) => string;
  duration?: number;
  style?: React.CSSProperties;
}

export default function AnimatedFigure({ value, formatter, duration = 800, style }: AnimatedFigureProps) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const start = performance.now();
    const startVal = 0;
    const endVal = value;
    let rafId: number;

    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = startVal + (endVal - startVal) * eased;
      setDisplay(current);
      if (progress < 1) rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [value, duration]);

  return (
    <span style={style}>
      {formatter(display)}
    </span>
  );
}
