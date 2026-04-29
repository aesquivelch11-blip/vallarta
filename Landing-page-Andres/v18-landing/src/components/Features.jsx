import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import DiagnosticShuffler from './DiagnosticShuffler';
import TelemetryTypewriter from './TelemetryTypewriter';
import CursorScheduler from './CursorScheduler';

gsap.registerPlugin(ScrollTrigger);

const cards = [
  {
    title: 'Sales Team Optimization',
    desc: 'KPI architecture, live coaching, CRM setup, script building — full infrastructure build.',
    component: DiagnosticShuffler,
  },
  {
    title: 'Online Offer Building',
    desc: 'Pricing strategy, positioning, financing integration, go-to-market sequencing.',
    component: TelemetryTypewriter,
  },
  {
    title: 'Lead Gen & Content',
    desc: 'VSL scripts, setter frameworks, email campaigns, organic content strategy.',
    component: CursorScheduler,
  },
];

export default function Features() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.feature-card', {
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="services" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <p className="mono-data text-[#B87333] text-sm tracking-widest uppercase mb-3">What We Do</p>
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-16">
          Three pillars. <span className="drama-serif text-[#B87333]">One system.</span>
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {cards.map((card, i) => {
            const Component = card.component;
            return (
              <div
                key={card.title}
                className="feature-card bg-[#1A3D4A]/20 border border-[#1A3D4A]/30 rounded-[2rem] p-6 shadow-lg"
              >
                <h3 className="text-lg font-bold mb-2">{card.title}</h3>
                <p className="text-sm text-[#EDE8DF]/60 mb-6">{card.desc}</p>
                <Component />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
