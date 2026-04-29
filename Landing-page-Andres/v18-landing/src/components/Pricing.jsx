import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Check } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const tiers = [
  {
    name: 'Foundation',
    price: '$8,000',
    period: '/month',
    features: ['CRM setup & optimization', 'Basic KPI tracking', 'Script templates', 'Monthly reviews'],
    cta: 'Get Started',
  },
  {
    name: 'Performance',
    price: '$12,000',
    period: '/month',
    features: ['Full KPI architecture', 'Live call coaching', 'Offer building', 'Content strategy', 'Weekly reports', 'Commission design'],
    highlighted: true,
    cta: 'Book a Call',
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    features: ['Multi-team deployment', 'Advanced analytics', 'Dedicated leadership', 'VSL production', 'Full GTM strategy'],
    cta: 'Contact Us',
  },
];

export default function Pricing() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.pricing-card', {
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
    <section ref={sectionRef} id="results" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <p className="mono-data text-[#B87333] text-sm tracking-widest uppercase mb-3 text-center">Investment</p>
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-center">
          Built for <span className="drama-serif text-[#B87333]">scale</span>
        </h2>
        <p className="text-[#EDE8DF]/60 text-center max-w-xl mx-auto mb-16">
          Replaces $200K–$310K/year in-house team. One engagement. All roles covered.
        </p>

        <div className="grid md:grid-cols-3 gap-6 items-start">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`pricing-card rounded-[2rem] p-8 ${
                tier.highlighted
                  ? 'bg-[#1A3D4A] border-2 border-[#B87333] scale-105 shadow-xl'
                  : 'bg-[#1A3D4A]/20 border border-[#1A3D4A]/30'
              }`}
            >
              <h3 className="text-lg font-bold mb-2">{tier.name}</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-3xl font-bold">{tier.price}</span>
                <span className="text-[#EDE8DF]/60 text-sm">{tier.period}</span>
              </div>
              <ul className="space-y-3 mb-8">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check size={16} className="text-[#B87333] flex-shrink-0 mt-0.5" />
                    <span className="text-[#EDE8DF]/80">{f}</span>
                  </li>
                ))}
              </ul>
              <a
                href="#consultation"
                className={`magnetic-btn block text-center py-3 px-6 rounded-full font-semibold overflow-hidden relative group ${
                  tier.highlighted
                    ? 'bg-[#B87333] text-[#0A1628]'
                    : 'border border-[#1A3D4A] text-[#EDE8DF] hover:bg-[#1A3D4A]/30'
                }`}
              >
                <span className="relative z-10">{tier.cta}</span>
                {tier.highlighted && (
                  <span className="absolute inset-0 bg-[#C98540] translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                )}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
