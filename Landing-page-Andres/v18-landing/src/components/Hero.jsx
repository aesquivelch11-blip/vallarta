import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function Hero() {
  const heroRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(contentRef.current.children, {
        y: 40,
        opacity: 0,
        duration: 1,
        stagger: 0.08,
        ease: 'power3.out',
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={heroRef} className="relative min-h-[100dvh] flex items-end overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=80"
          alt="Architectural interior"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A1628] via-[#0A1628]/80 to-[#0A1628]/40" />
      </div>

      {/* Content */}
      <div ref={contentRef} className="relative z-10 max-w-6xl mx-auto px-6 pb-24 md:pb-32">
        <p className="mono-data text-[#B87333] text-sm tracking-widest uppercase mb-4">
          Embedded Sales Leadership
        </p>
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1]">
          <span className="block">Revenue is coming in.</span>
          <span className="block drama-serif text-5xl md:text-7xl lg:text-8xl text-[#B87333] mt-2">
            Your infrastructure isn't.
          </span>
        </h1>
        <p className="mt-6 text-[#EDE8DF]/70 text-lg max-w-xl leading-relaxed">
          You've proven the offer. The leads are flowing. But your sales team can't carry the growth. 
          V18 embeds as your complete outsourced sales leadership — operational from Day 1.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <a
            href="#consultation"
            className="magnetic-btn inline-flex items-center px-8 py-4 bg-[#B87333] text-[#0A1628] font-semibold rounded-full overflow-hidden relative group"
          >
            <span className="relative z-10">Book a Consultation</span>
            <span className="absolute inset-0 bg-[#C98540] translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          </a>
          <a
            href="#services"
            className="magnetic-btn inline-flex items-center px-8 py-4 border border-[#1A3D4A] text-[#EDE8DF] font-semibold rounded-full hover:bg-[#1A3D4A]/30 transition-colors"
          >
            See How It Works
          </a>
        </div>
      </div>
    </section>
  );
}
