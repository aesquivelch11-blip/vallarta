import { useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Check, Save } from 'lucide-react';

const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export default function CursorScheduler() {
  const controls = useAnimation();
  const containerRef = useRef(null);

  useEffect(() => {
    const sequence = async () => {
      await controls.start({ x: 0, y: 0, opacity: 1 });
      await controls.start({ x: 60, y: 0, transition: { duration: 0.5 } });
      await controls.start({ scale: 0.95, transition: { duration: 0.1 } });
      await controls.start({ scale: 1, transition: { duration: 0.1 } });
      await controls.start({ x: 120, y: 0, transition: { duration: 0.5 } });
      await controls.start({ x: 180, y: 0, transition: { duration: 0.5 } });
      await controls.start({ opacity: 0, transition: { duration: 0.3 } });
    };
    sequence();
  }, [controls]);

  return (
    <div ref={containerRef} className="bg-[#0A1628] border border-[#1A3D4A]/30 rounded-2xl p-5">
      <p className="text-sm font-semibold mb-3">Protocol Schedule</p>
      <div className="flex gap-2 mb-4">
        {days.map((d, i) => (
          <div
            key={i}
            className={`flex-1 text-center py-2 text-xs rounded-lg transition-colors ${
              i === 2 ? 'bg-[#B87333]/20 text-[#B87333]' : 'text-[#EDE8DF]/50'
            }`}
          >
            {d}
          </div>
        ))}
      </div>
      <div className="relative h-8">
        <motion.div
          animate={controls}
          initial={{ opacity: 0 }}
          className="absolute w-4 h-4 bg-[#B87333] rounded-full flex items-center justify-center"
        >
          <Check size={10} className="text-[#0A1628]" />
        </motion.div>
      </div>
      <div className="flex items-center gap-2 mt-4 text-xs text-[#EDE8DF]/60">
        <Save size={12} />
        <span>Changes saved</span>
      </div>
    </div>
  );
}
