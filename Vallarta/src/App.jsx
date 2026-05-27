import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Calendar, DollarSign, Users, Wrench } from 'lucide-react';
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
      <header className="header animate-in">
        <h1 className="display-text">Villa Horizonte</h1>
        <p className="metric-sub" style={{ marginTop: 'var(--space-sm)' }}>
          <span className="status-indicator"></span>
          The estate is in perfect order.
        </p>
      </header>

      <section className="dashboard-grid">
        <div className="surface interactive animate-in">
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span className="metric-label">Monthly Yield</span>
            <DollarSign size={20} color="var(--color-primary-light)" />
          </div>
          <div className="display-text metric-value">{metrics.revenue.current}</div>
          <div className="metric-sub">Per-Room Yield: {metrics.revenue.revPAR}</div>
        </div>

        <div className="surface interactive animate-in">
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span className="metric-label">Occupancy</span>
            <Calendar size={20} color="var(--color-primary-light)" />
          </div>
          <div className="display-text metric-value">{metrics.occupancy.current}</div>
          <div className="metric-sub">Next 30 Days</div>
        </div>

        <div className="surface interactive animate-in">
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span className="metric-label">Guest Satisfaction</span>
            <Users size={20} color="var(--color-primary-light)" />
          </div>
          <div className="display-text metric-value">{metrics.satisfaction.score}</div>
          <div className="metric-sub">Based on {metrics.satisfaction.total} reviews</div>
        </div>
      </section>

      <section className="timeline-grid">
        <div className="surface interactive animate-in">
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

        <div className="surface interactive animate-in" style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-surface)' }}>
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
