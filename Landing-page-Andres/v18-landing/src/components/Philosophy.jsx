import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const mantras = [
  'Capital is cultural',
  'Capital is intellectual',
  'Capital is human',
  'Infrastructure is everything',
];

export default function Philosophy() {
  const sectionRef = useRef(null);
  const linesRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const lines = linesRef.current.children;

      gsap.from(lines, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 60%',
          end: 'bottom 40%',
          scrub: 1,
        },
        opacity: 0.15,
        y: 20,
        stagger: 0.1,
        ease: 'none',
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="min-h-[90dvh] flex items-center justify-center px-6 py-32 bg-bg-elevated">
      <div className="max-w-4xl mx-auto text-center">
        <div ref={linesRef} className="space-y-6">
          {mantras.map((line) => (
            <p
              key={line}
              className="text-3xl md:text-5xl font-bold leading-tight text-text-muted"
            >
              {line}
            </p>
          ))}
        </div>
        <p className="mt-12 text-text-muted text-lg">
          At V18, we embed as your{' '}
          <span className="display-serif italic text-accent">complete leadership team</span>
          — not consultants, but operators.
        </p>
      </div>
    </section>
  );
}
