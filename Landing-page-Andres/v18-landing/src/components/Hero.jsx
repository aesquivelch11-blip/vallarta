import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const containerRef = useRef(null);
  const linesRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Cinematic text stagger reveal
      gsap.from(linesRef.current.children, {
        y: 80,
        opacity: 0,
        duration: 1.2,
        stagger: 0.15,
        ease: 'power3.out',
        delay: 0.3,
      });

      // Background slow parallax
      gsap.to('.hero-bg', {
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
        y: '-20%',
        ease: 'none',
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden"
    >
      {/* Background with parallax */}
      <div className="hero-bg absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-bg/80 via-bg/60 to-bg" />
      </div>

      {/* Manifesto text */}
      <div ref={linesRef} className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <p className="mono-label text-accent text-sm tracking-[0.3em] uppercase mb-8">
          Embedded Sales Leadership
        </p>

        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.08]">
          <span className="block">Revenue is coming in.</span>
          <span className="block display-serif italic text-accent text-5xl md:text-7xl lg:text-8xl mt-3">
            Your infrastructure isn&apos;t.
          </span>
        </h1>

        <p className="mt-8 text-text-muted text-lg max-w-xl mx-auto leading-relaxed">
          You&apos;ve proven the offer. The leads are flowing. But your sales team
          can&apos;t carry the growth. V18 embeds as your complete outsourced sales
          leadership.
        </p>

        <a
          href="#consultation"
          className="magnetic-btn inline-flex items-center mt-12 px-8 py-4 border border-accent text-accent font-semibold rounded-full hover:bg-accent hover:text-bg transition-colors duration-300"
        >
          Book a Consultation
        </a>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
        <svg
          className="w-6 h-6 text-text-muted animate-pulse"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </div>
    </section>
  );
}
