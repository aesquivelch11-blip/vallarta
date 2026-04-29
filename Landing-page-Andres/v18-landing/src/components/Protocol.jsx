import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    num: '01',
    title: 'Diagnose Infrastructure Gaps',
    desc: 'We audit your current sales stack — CRM, scripts, KPIs, team structure. Every gap mapped. Every bottleneck identified.',
    animation: 'helix',
  },
  {
    num: '02',
    title: 'Build KPI Architecture',
    desc: 'Custom dashboards, rep-level tracking, weekly reporting cadence. You see everything. No more blind spots.',
    animation: 'laser',
  },
  {
    num: '03',
    title: 'Deploy & Coach',
    desc: 'Scripts deployed. Coaching begins. Live call reviews. Continuous optimization. Your team levels up in real time.',
    animation: 'waveform',
  },
];

function HelixSVG() {
  const svgRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(svgRef.current, {
        rotation: 360,
        duration: 20,
        repeat: -1,
        ease: 'none',
      });
    }, svgRef);
    return () => ctx.revert();
  }, []);

  return (
    <svg ref={svgRef} viewBox="0 0 200 200" className="w-48 h-48 opacity-30">
      {[...Array(12)].map((_, i) => (
        <circle
          key={i}
          cx="100"
          cy="100"
          r={20 + i * 7}
          fill="none"
          stroke="#B87333"
          strokeWidth="0.5"
          strokeDasharray={`${4 + i} ${8 - i % 4}`}
        />
      ))}
    </svg>
  );
}

function LaserSVG() {
  const lineRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(lineRef.current, {
        x: 160,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'power2.inOut',
      });
    }, lineRef);
    return () => ctx.revert();
  }, []);

  return (
    <svg viewBox="0 0 200 100" className="w-48 h-24 opacity-30">
      {[...Array(5)].map((_, y) =>
        [...Array(10)].map((_, x) => (
          <circle key={`${x}-${y}`} cx={20 + x * 18} cy={20 + y * 18} r="2" fill="#1A3D4A" />
        ))
      )}
      <rect ref={lineRef} x="0" y="10" width="2" height="80" fill="#B87333" />
    </svg>
  );
}

function WaveformSVG() {
  const pathRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(pathRef.current, {
        strokeDashoffset: 0,
        duration: 2,
        repeat: -1,
        ease: 'power2.inOut',
      });
    }, pathRef);
    return () => ctx.revert();
  }, []);

  return (
    <svg viewBox="0 0 200 60" className="w-48 h-16 opacity-30">
      <path
        ref={pathRef}
        d="M0 30 Q25 0 50 30 T100 30 T150 30 T200 30"
        fill="none"
        stroke="#B87333"
        strokeWidth="2"
        strokeDasharray="200"
        strokeDashoffset="200"
      />
    </svg>
  );
}

export default function Protocol() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray('.protocol-card');
      cards.forEach((card, i) => {
        ScrollTrigger.create({
          trigger: card,
          start: 'top top',
          end: '+=100%',
          pin: true,
          pinSpacing: false,
          onUpdate: (self) => {
            if (self.progress > 0.7) {
              gsap.to(card, { scale: 0.9, filter: 'blur(20px)', opacity: 0.5, duration: 0.3 });
            }
          },
        });
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const animations = [HelixSVG, LaserSVG, WaveformSVG];

  return (
    <section ref={sectionRef} id="process" className="relative">
      {steps.map((step, i) => {
        const Animation = animations[i];
        return (
          <div
            key={step.num}
            className="protocol-card min-h-[100dvh] flex items-center justify-center px-6"
          >
            <div className="bg-[#1A3D4A]/20 border border-[#1A3D4A]/30 rounded-[3rem] p-10 md:p-16 max-w-2xl w-full">
              <p className="mono-data text-[#B87333] text-sm mb-4">{step.num}</p>
              <h3 className="text-2xl md:text-4xl font-bold tracking-tight mb-4">{step.title}</h3>
              <p className="text-[#EDE8DF]/70 text-lg leading-relaxed mb-8">{step.desc}</p>
              <div className="flex justify-center">
                <Animation />
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
}
