import { useState, useEffect } from 'react';
import { Terminal } from 'lucide-react';

const messages = [
  'Building offer structure...',
  'Pricing strategy deployed.',
  'Positioning locked.',
  'Go-to-market sequence active.',
  'Commission framework designed.',
];

export default function TelemetryTypewriter() {
  const [msgIndex, setMsgIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const current = messages[msgIndex];
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (charIndex < current.length) {
          setCharIndex((c) => c + 1);
        } else {
          setTimeout(() => setIsDeleting(true), 1500);
        }
      } else {
        if (charIndex > 0) {
          setCharIndex((c) => c - 1);
        } else {
          setIsDeleting(false);
          setMsgIndex((m) => (m + 1) % messages.length);
        }
      }
    }, isDeleting ? 30 : 60);

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, msgIndex]);

  return (
    <div className="bg-[#0A1628] border border-[#1A3D4A]/30 rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <Terminal size={14} className="text-[#B87333]" />
        <span className="mono-data text-xs text-[#EDE8DF]/60">Live Feed</span>
        <span className="w-2 h-2 bg-[#B87333] rounded-full animate-pulse ml-auto" />
      </div>
      <div className="mono-data text-sm min-h-[60px]">
        <span className="text-[#B87333]">→ </span>
        <span>{messages[msgIndex].slice(0, charIndex)}</span>
        <span className="inline-block w-2 h-4 bg-[#B87333] ml-0.5 animate-pulse" />
      </div>
    </div>
  );
}
