import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Footer() {
  const footerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.footer-link', {
        scrollTrigger: {
          trigger: footerRef.current,
          start: 'top 90%',
        },
        opacity: 0,
        y: 15,
        stagger: 0.08,
        duration: 0.5,
        ease: 'power3.out',
      });
    }, footerRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer ref={footerRef} className="px-6 py-16 border-t border-border">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          <div>
            <h3 className="text-xl font-bold tracking-tight mb-2">V18 Sales Consulting</h3>
            <p className="text-text-muted max-w-sm">
              Embedded sales leadership for high-ticket businesses ready to scale past $300K/month.
            </p>
          </div>

          <div>
            <h4 className="mono-label text-sm tracking-wider uppercase mb-4 text-text-muted">
              Navigation
            </h4>
            <ul className="space-y-2">
              {['Services', 'Philosophy', 'Contact'].map((item) => (
                <li key={item}>
                  <a
                    href={`#${item.toLowerCase()}`}
                    className="footer-link text-sm text-text-muted hover:text-text transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mono-label text-sm tracking-wider uppercase mb-4 text-text-muted">
              Contact
            </h4>
            <p className="footer-link text-sm text-text-muted mb-2">
              mihaelvsbusiness@gmail.com
            </p>
            <a
              href="#consultation"
              className="footer-link inline-flex items-center px-6 py-3 bg-accent text-bg font-semibold rounded-full hover:bg-accent-hover transition-colors mt-2"
            >
              Book a Consultation
            </a>
          </div>
        </div>

        <div className="border-t border-border pt-8 flex justify-between items-center">
          <p className="text-xs text-text-muted/50">
            © 2026 V18 Sales Consulting. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="mono-label text-xs text-text-muted/60">
              System Operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
