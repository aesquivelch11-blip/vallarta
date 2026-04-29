export default function Footer() {
  return (
    <footer id="consultation" className="bg-[#0C1B2A] rounded-t-[4rem] px-6 py-16">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-2">
            <h3 className="text-2xl font-bold tracking-tight mb-2">V18 Sales Consulting</h3>
            <p className="text-[#EDE8DF]/60 max-w-sm">
              Embedded sales leadership for high-ticket businesses ready to scale past $300K/month.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">Navigation</h4>
            <ul className="space-y-2">
              {['Services', 'Process', 'Results'].map((item) => (
                <li key={item}>
                  <a href={`#${item.toLowerCase()}`} className="text-sm text-[#EDE8DF]/60 hover:text-[#EDE8DF] transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">Contact</h4>
            <p className="text-sm text-[#EDE8DF]/60 mb-2">mihaelvsbusiness@gmail.com</p>
            <a
              href="https://calendly.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="magnetic-btn inline-flex items-center px-6 py-3 bg-[#B87333] text-[#0A1628] font-semibold rounded-full overflow-hidden relative group mt-2"
            >
              <span className="relative z-10">Book a Consultation</span>
              <span className="absolute inset-0 bg-[#C98540] translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </a>
          </div>
        </div>

        <div className="border-t border-[#1A3D4A]/30 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-[#EDE8DF]/40">
            © 2026 V18 Sales Consulting. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="mono-data text-xs text-[#EDE8DF]/50">System Operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
