import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-[#0A1628]/60 backdrop-blur-xl border border-[#1A3D4A]/30'
          : 'bg-transparent'
      } rounded-full px-6 py-3`}
    >
      <div className="flex items-center gap-8">
        <a href="#" className="text-lg font-bold tracking-tight text-[#EDE8DF]">
          V18
        </a>

        <div className="hidden md:flex items-center gap-6">
          {['Services', 'Process', 'Results'].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-sm text-[#EDE8DF]/70 hover:text-[#EDE8DF] transition-colors hover-lift"
            >
              {item}
            </a>
          ))}
        </div>

        <a
          href="#consultation"
          className="magnetic-btn hidden md:inline-flex items-center px-5 py-2 bg-[#B87333] text-[#0A1628] text-sm font-semibold rounded-full overflow-hidden relative group"
        >
          <span className="relative z-10">Book a Call</span>
          <span className="absolute inset-0 bg-[#C98540] translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
        </a>

        <button
          className="md:hidden text-[#EDE8DF]"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden mt-4 pt-4 border-t border-[#1A3D4A]/30 flex flex-col gap-4">
          {['Services', 'Process', 'Results'].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-sm text-[#EDE8DF]/70 hover:text-[#EDE8DF]"
              onClick={() => setMenuOpen(false)}
            >
              {item}
            </a>
          ))}
          <a
            href="#consultation"
            className="magnetic-btn inline-flex items-center justify-center px-5 py-2 bg-[#B87333] text-[#0A1628] text-sm font-semibold rounded-full"
          >
            Book a Call
          </a>
        </div>
      )}
    </nav>
  );
}
