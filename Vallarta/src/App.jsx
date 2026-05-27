import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import './App.css';

// Mock Data
const metrics = {
  revenue: { current: "$42,500", prev: "$38,200", revPAR: "$450" },
  occupancy: { current: "82%", upcoming: 14 },
  satisfaction: { score: "4.9", total: 128 },
  operations: { maintenance: 0, pendingRequests: 2 }
};

const bookings = [
  { id: 1, guest: "The Harrison Family", dates: "Oct 12 - Oct 18", status: "Confirmed" },
  { id: 2, guest: "M. Chen", dates: "Oct 22 - Oct 29", status: "Upcoming" },
  { id: 3, guest: "J. & S. Davis", dates: "Nov 02 - Nov 09", status: "Upcoming" }
];

function App() {
  const containerRef = useRef(null);

  useEffect(() => {
    // GSAP Responsive Motion for staggering entrance
    const ctx = gsap.context(() => {
      gsap.from(".animate-in", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
        delay: 0.2
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="container" ref={containerRef}>
      <section className="hero-drenched animate-in">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className="metric-label" style={{ color: 'rgba(249, 248, 246, 0.7)' }}>Monthly Yield</span>
          <span style={{ fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Villa Horizonte</span>
        </div>
        <div className="metric-massive">{metrics.revenue.current}</div>
        <div className="metric-sub" style={{ color: 'rgba(249, 248, 246, 0.7)' }}>
          Per-Room Yield: {metrics.revenue.revPAR} &mdash; The estate is in perfect order.
        </div>
      </section>

      <section className="metrics-secondary-grid animate-in">
        <div className="surface-borderless">
          <span className="metric-label">Occupancy</span>
          <div className="display-text" style={{ fontSize: '3rem', margin: 'var(--space-sm) 0', color: 'var(--color-primary)' }}>{metrics.occupancy.current}</div>
          <div className="metric-sub">Next 30 Days</div>
        </div>

        <div className="surface-borderless">
          <span className="metric-label">Guest Satisfaction</span>
          <div className="display-text" style={{ fontSize: '3rem', margin: 'var(--space-sm) 0', color: 'var(--color-primary)' }}>{metrics.satisfaction.score}</div>
          <div className="metric-sub">Based on {metrics.satisfaction.total} reviews</div>
        </div>
      </section>

      <section className="timeline-grid">
        <div className="surface animate-in">
          <h2 className="display-text" style={{ fontSize: '1.5rem', marginBottom: 'var(--space-md)' }}>Upcoming Stays</h2>
          <div className="booking-list">
            {bookings.map((booking) => (
              <div key={booking.id} className="booking-item">
                <div>
                  <div style={{ fontWeight: 500, color: 'var(--color-text)' }}>{booking.guest}</div>
                  <div className="metric-sub">{booking.dates}</div>
                </div>
                <div style={{ 
                  padding: '4px 12px', 
                  borderRadius: '100px', 
                  backgroundColor: 'var(--color-bg)',
                  fontSize: '0.875rem',
                  color: 'var(--color-primary)'
                }}>
                  {booking.status}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="surface animate-in" style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-surface)' }}>
          <h2 className="display-text" style={{ fontSize: '1.5rem', marginBottom: 'var(--space-md)' }}>Operations</h2>
          
          <div style={{ marginBottom: 'var(--space-lg)' }}>
            <div className="metric-label" style={{ color: 'rgba(255,255,255,0.7)' }}>Property Upkeep</div>
            <div className="display-text" style={{ fontSize: '2rem', margin: 'var(--space-sm) 0' }}>{metrics.operations.maintenance}</div>
            <div style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.8)' }}>No critical issues reported.</div>
          </div>

          <div>
            <div className="metric-label" style={{ color: 'rgba(255,255,255,0.7)' }}>Guest Requests</div>
            <div className="display-text" style={{ fontSize: '2rem', margin: 'var(--space-sm) 0' }}>{metrics.operations.pendingRequests}</div>
            <div style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.8)' }}>Concierge team is handling.</div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;
