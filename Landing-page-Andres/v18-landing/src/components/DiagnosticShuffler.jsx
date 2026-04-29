import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart3, Users, Target } from 'lucide-react';

const cards = [
  { icon: BarChart3, label: 'KPI Architecture', value: 'Live dashboards, rep-level tracking, weekly reports' },
  { icon: Users, label: 'Team Accountability', value: 'Call reviews, coaching, script optimization' },
  { icon: Target, label: 'Pipeline Management', value: 'CRM setup, forecasting, conversion tracking' },
];

export default function DiagnosticShuffler() {
  const [items, setItems] = useState(cards);

  useEffect(() => {
    const interval = setInterval(() => {
      setItems((prev) => {
        const next = [...prev];
        next.unshift(next.pop());
        return next;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-48">
      <AnimatePresence>
        {items.slice(0, 3).map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.label}
              initial={{ y: 20, opacity: 0, scale: 0.95 }}
              animate={{ y: i * 28, opacity: 1 - i * 0.25, scale: 1 - i * 0.03 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="absolute inset-0 flex items-center gap-4 px-5 py-3 bg-[#0A1628] border border-[#1A3D4A]/30 rounded-2xl"
            >
              <Icon size={18} className="text-[#B87333] flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold">{card.label}</p>
                <p className="text-xs text-[#EDE8DF]/60">{card.value}</p>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
