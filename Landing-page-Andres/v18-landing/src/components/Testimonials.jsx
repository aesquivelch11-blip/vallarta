import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const testimonials = [
  {
    quote: "V18 didn't just optimize our sales process — they rebuilt our entire infrastructure. Revenue doubled in 90 days.",
    author: 'Sarah Chen',
    role: 'CEO, ScaleUp SaaS',
  },
  {
    quote: "We went from chaos to clarity. KPIs, coaching, CRM — everything finally works together.",
    author: 'Marcus Rivera',
    role: 'Founder, HighTicket Co',
  },
];

export default function Testimonials() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const quotes = sectionRef.current.querySelectorAll('.testimonial-quote');
      const authors = sectionRef.current.querySelectorAll('.testimonial-author');

      quotes.forEach((quote, i) => {
        gsap.from(quote, {
          scrollTrigger: {
            trigger: quote,
            start: 'top 80%',
          },
          opacity: 0,
          y: 30,
          duration: 0.7,
          ease: 'power3.out',
        });

        gsap.from(authors[i], {
          scrollTrigger: {
            trigger: quote,
            start: 'top 80%',
          },
          opacity: 0,
          duration: 0.5,
          delay: 0.3,
          ease: 'power3.out',
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 px-6">
      <div className="max-w-4xl mx-auto space-y-24">
        {testimonials.map((t, i) => (
          <div key={i} className="text-center">
            <div className="testimonial-quote">
              <span className="display-serif italic text-accent text-6xl leading-none">&ldquo;</span>
              <p className="text-xl md:text-2xl text-text leading-relaxed -mt-4">
                {t.quote}
              </p>
            </div>
            <div className="testimonial-author mt-6">
              <p className="font-semibold text-text">{t.author}</p>
              <p className="text-text-muted text-sm">{t.role}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
