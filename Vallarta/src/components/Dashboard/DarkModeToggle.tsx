import React, { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

export default function DarkModeToggle() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark';
    }
    return false;
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  return (
    <button
      onClick={() => setIsDark(!isDark)}
      style={{
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        color: 'var(--color-ink-secondary)',
        padding: '4px',
        minWidth: '44px',
        minHeight: '44px',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      aria-label="Toggle dark mode"
      className="dashboard-focus"
    >
      {isDark ? <Sun size={16} strokeWidth={1.5} /> : <Moon size={16} strokeWidth={1.5} />}
    </button>
  );
}
