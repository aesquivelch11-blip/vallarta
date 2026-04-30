import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function CTA() {
  const sectionRef = useRef(null);
  const contentRef = useRef(null);
  const btnRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(contentRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
        },
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
      });

      // Magnetic button effect
      const btn = btnRef.current;
      if (btn) {
        btn.addEventListener('mousemove', (e) => {
          const rect = btn.getBoundingClientRect();
          const x = e.clientX - rect.left - rect.width / 2;
          const y = e.clientY - rect.top - rect.height / 2;
          btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
        });

        btn.addEventListener('mouseleave', () => {
          btn.style.transform = 'translate(0, 0)';
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="consultation"
      className="min-h-[80dvh] flex items-center justify-center px-6 py-32 bg-bg-elevated"
    >
      <div ref={contentRef} className="max-w-3xl mx-auto text-center">
        <p className="mono-label text-accent text-sm tracking-[0.3em] uppercase mb-6">
          Ready to Scale
        </p>
        <h2 className="text-3xl md:text-5xl font-bold mb-6">
          Let&apos;s build your{' '}
          <span className="display-serif italic text-accent">sales infrastructure</span>
        </h2>
        <p className="text-text-muted text-lg mb-12 max-w-xl mx-auto">
          One conversation. No pitch. Just clarity on what&apos;s broken and how to fix it.
        </p>
        <a
          ref={btnRef}
          href="mailto:mihaelvsbusiness@gmail.com"
          className="magnetic-btn inline-flex items-center px-10 py-5 bg-accent text-bg font-semibold rounded-full hover:bg-accent-hover transition-colors duration-300"
        >
          Book a Consultation
        </a>
      </div>
    </section>
  );
}
