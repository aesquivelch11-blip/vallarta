import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Philosophy() {
  const sectionRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(textRef.current.children, {
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-32 px-6 overflow-hidden">
      {/* Background texture */}
      <div className="absolute inset-0 opacity-10">
        <img
          src="https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=1920&q=80"
          alt="Organic texture"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="absolute inset-0 bg-[#1C1C1C]/90" />

      <div ref={textRef} className="relative z-10 max-w-4xl mx-auto text-center">
        <p className="text-xl md:text-2xl text-[#EDE8DF]/60 leading-relaxed mb-8">
          Most sales consulting focuses on tactics, scripts, and quick fixes.
        </p>
        <p className="text-3xl md:text-5xl font-bold leading-tight">
          We focus on{' '}
          <span className="drama-serif text-[#B87333]">complete infrastructure</span> —
          embedded as your leadership team, operational from{' '}
          <span className="mono-data text-[#B87333]">Day 1</span>.
        </p>
      </div>
    </section>
  );
}
