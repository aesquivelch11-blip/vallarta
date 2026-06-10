import React from 'react';
import { DashboardTask, TaskCategory, categoryLabels } from './dashboardData';

interface StatusCardsProps {
  tasks: DashboardTask[];
}

export default function StatusCards({ tasks }: StatusCardsProps) {
  const categories: TaskCategory[] = ['maintenance', 'housekeeping', 'amenities', 'inspection'];

  const getStatus = (cat: TaskCategory) => {
    const catTasks = tasks.filter(t => t.category === cat);
    const urgent = catTasks.filter(t => t.status === 'urgent').length;
    const pending = catTasks.filter(t => t.status === 'pending').length;
    if (urgent > 0) return { text: `${urgent} urgent`, color: 'var(--color-accent-warning)' };
    if (pending > 0) return { text: `${pending} pending`, color: 'var(--color-ink-secondary)' };
    return { text: 'All clear', color: 'var(--color-accent-positive)' };
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(0.75rem, 1.5vw, 1rem)' }}>
      {categories.map(cat => {
        const status = getStatus(cat);
        return (
          <div key={cat} style={{ display: 'flex', flexDirection: 'column', gap: '6px', padding: 'clamp(0.75rem, 1.5vw, 1rem)', background: 'var(--color-surface)', border: '1px solid var(--color-border-subtle)', borderRadius: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: status.color, flexShrink: 0 }} />
              <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.5625rem', fontWeight: 500, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--color-ink-secondary)', margin: 0 }}>
                {categoryLabels[cat]}
              </p>
            </div>
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.75rem', fontWeight: 400, color: 'var(--color-ink)', margin: 0 }}>
              {status.text}
            </p>
          </div>
        );
      })}
    </div>
  );
}
