import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BarChart3, Users, Target } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const services = [
  {
    icon: BarChart3,
    title: 'Sales Team Optimization',
    desc: 'KPI architecture, live coaching, CRM setup, script building — full infrastructure build.',
    align: 'left',
  },
  {
    icon: Users,
    title: 'Online Offer Building',
    desc: 'Pricing strategy, positioning, financing integration, go-to-market sequencing.',
    align: 'right',
  },
  {
    icon: Target,
    title: 'Lead Gen & Content',
    desc: 'VSL scripts, setter frameworks, email campaigns, organic content strategy.',
    align: 'left',
  },
];

export default function Services() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      services.forEach((_, i) => {
        const service = sectionRef.current.querySelector(`[data-service="${i}"]`);
        const image = service.querySelector('.service-image');
        const text = service.querySelector('.service-text');

        gsap.from(image, {
          scrollTrigger: {
            trigger: service,
            start: 'top 80%',
          },
          x: i % 2 === 0 ? -60 : 60,
          opacity: 0,
          duration: 0.9,
          ease: 'power3.out',
        });

        gsap.from(text, {
          scrollTrigger: {
            trigger: service,
            start: 'top 80%',
          },
          x: i % 2 === 0 ? 60 : -60,
          opacity: 0,
          duration: 0.9,
          ease: 'power3.out',
          delay: 0.15,
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="services" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        {services.map((s, i) => {
          const Icon = s.icon;
          const isRight = s.align === 'right';
          return (
            <div
              key={s.title}
              data-service={i}
              className={`min-h-[70dvh] flex items-center py-24 ${i > 0 ? 'border-t border-border' : ''}`}
            >
              <div className={`w-full grid md:grid-cols-2 gap-12 items-center ${isRight ? 'md:flex-row-reverse' : ''}`}>
                {/* Image/visual side */}
                <div className={`service-image ${isRight ? 'md:order-2' : ''}`}>
                  <div className="aspect-[4/3] bg-bg-elevated rounded-2xl flex items-center justify-center">
                    <Icon size={48} className="text-accent/40" />
                  </div>
                </div>

                {/* Text side */}
                <div className={`service-text ${isRight ? 'md:order-1' : ''}`}>
                  <p className="mono-label text-accent text-sm tracking-[0.3em] uppercase mb-4">
                    {String(i + 1).padStart(2, '0')}
                  </p>
                  <h3 className="text-2xl md:text-4xl font-bold mb-4">{s.title}</h3>
                  <p className="text-text-muted text-lg leading-relaxed">{s.desc}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
