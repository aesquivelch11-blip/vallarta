import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Tension() {
  const sectionRef = useRef(null);
  const textRef = useRef(null);
  const ruleRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
        },
      });

      tl.from(textRef.current, {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
      })
      .from(ruleRef.current, {
        scaleX: 0,
        transformOrigin: 'left center',
        duration: 0.6,
        ease: 'power2.out',
      }, '-=0.3');
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="min-h-[80dvh] flex items-center px-6 py-32">
      <div className="max-w-4xl mx-auto w-full">
        <div ref={textRef}>
          <p className="text-text-muted text-xl md:text-2xl leading-relaxed mb-8">
            Most sales consulting focuses on tactics, scripts, and quick fixes.
          </p>
          <h2 className="text-3xl md:text-5xl font-bold leading-tight">
            We focus on{' '}
            <span className="display-serif italic text-accent">complete infrastructure</span>{' '}
            — embedded as your leadership team, operational from{' '}
            <span className="mono-label text-accent">Day 1</span>.
          </h2>
        </div>
        <div ref={ruleRef} className="mt-12 h-px bg-accent/30 w-full" />
      </div>
    </section>
  );
}
