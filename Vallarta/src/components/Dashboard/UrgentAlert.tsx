import React from 'react';
import { DashboardTask, formatDueDate } from './dashboardData';

interface UrgentAlertProps {
  task: DashboardTask | null;
}

export default function UrgentAlert({ task }: UrgentAlertProps) {
  if (!task) return null;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '8px 12px',
        borderLeft: '2px solid var(--color-accent-warning)',
        background: 'var(--color-accent-warning-bg)',
        borderRadius: '0 4px 4px 0',
      }}
    >
      <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'var(--color-task-urgent)', flexShrink: 0 }} aria-hidden="true" />
      <p
        style={{
          fontFamily: 'var(--font-ui)',
          fontSize: '0.6875rem',
          fontWeight: 400,
          color: 'var(--color-ink-secondary)',
          margin: 0,
          lineHeight: 1.3,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {task.description}
        <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.5625rem', letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--color-ink-muted)', marginLeft: '8px' }}>
          {task.assignee} · {formatDueDate(task.dueDate)}
        </span>
      </p>
    </div>
  );
}
