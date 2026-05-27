import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import './App.css';

// Mock Data
const metrics = {
  revenue: { current: "$42,500", prev: "$38,200", revPAR: "$450" },
  occupancy: { current: "82%", upcoming: 14 },
  satisfaction: { score: "4.9", total: 128 }
};

function App() {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".animate-in", {
        y: 40,
        scale: 0.95,
        opacity: 0,
        duration: 1.2,
        stagger: 0.1,
        ease: "power3.out",
        delay: 0.1
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div className="container" ref={containerRef}>
      <header className="animate-in" style={{ padding: 'var(--space-xl) 0', borderBottom: '1px solid var(--color-border)' }}>
        <h1 className="luxury-label">Villa Horizonte / Estate Overview</h1>
      </header>

      <section className="bento-grid">
        <div className="bento-card card-hero animate-in">
          <div className="luxury-label">Monthly Yield</div>
          <div className="luxury-value">{metrics.revenue.current}</div>
          <div className="progressive-data">
            <span style={{ color: 'var(--color-primary)' }}>+11% vs last month</span><br/>
            Per-Room Yield: {metrics.revenue.revPAR}
          </div>
        </div>

        <div className="bento-card card-side animate-in">
          <div className="luxury-label">Occupancy</div>
          <div className="display-text" style={{ fontSize: '3rem', margin: 'var(--space-sm) 0' }}>{metrics.occupancy.current}</div>
          <div className="progressive-data metric-sub">Next 30 Days</div>
        </div>

        <div className="bento-card card-side animate-in">
          <div className="luxury-label">Guest Satisfaction</div>
          <div className="display-text" style={{ fontSize: '3rem', margin: 'var(--space-sm) 0' }}>{metrics.satisfaction.score}</div>
          <div className="progressive-data metric-sub">Based on {metrics.satisfaction.total} reviews</div>
        </div>
      </section>
    </div>
  );
}

export default App;
