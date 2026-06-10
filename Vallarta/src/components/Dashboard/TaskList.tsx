import React from 'react';
import { DashboardTask, formatDueDate } from './dashboardData';

interface TaskListProps {
  tasks: DashboardTask[];
}

const statusLabel: Record<DashboardTask['status'], string> = {
  urgent: 'Urgent',
  pending: 'Pending',
  scheduled: 'Scheduled',
};

const statusColor: Record<DashboardTask['status'], string> = {
  urgent: 'var(--color-task-urgent)',
  pending: 'var(--color-task-pending)',
  scheduled: 'var(--color-task-scheduled)',
};

export default function TaskList({ tasks }: TaskListProps) {
  const visible = tasks.slice(0, 5);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
      <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.5625rem', fontWeight: 500, letterSpacing: '0.32em', textTransform: 'uppercase', color: 'var(--color-ink-secondary)', margin: '0 0 12px' }}>
        {tasks.length > 0 ? `${tasks.length} OPEN TASKS` : 'ALL CLEAR'}
      </p>
      {visible.length > 0 && (
        <ol style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 0 }}>
          {visible.map((task, i) => (
            <li
              key={task.id}
              style={{
                display: 'flex',
                gap: '16px',
                alignItems: 'flex-start',
                paddingTop: i === 0 ? 0 : '14px',
                paddingBottom: '14px',
                borderBottom: i < visible.length - 1 ? '1px solid var(--color-border-subtle)' : 'none',
                borderLeft: task.status === 'urgent' ? '2px solid var(--color-accent-warning)' : '2px solid transparent',
                paddingLeft: task.status === 'urgent' ? '12px' : '14px',
                background: task.status === 'urgent' ? 'var(--color-accent-warning-bg)' : 'transparent',
                marginLeft: task.status === 'urgent' ? '-2px' : '0',
                borderRadius: task.status === 'urgent' ? '0 4px 4px 0' : '0',
              }}
            >
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1rem, 2vw, 1.25rem)', fontWeight: 400, color: 'var(--color-ink-secondary)', lineHeight: 1.2, minWidth: '18px', flexShrink: 0, opacity: 0.6 }}>
                {i + 1}
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', flex: 1 }}>
                <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.8125rem', fontWeight: 400, color: 'var(--color-ink)', margin: 0, lineHeight: 1.35 }}>
                  {task.description}
                </p>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.5625rem', fontWeight: task.status === 'urgent' ? 600 : 400, letterSpacing: '0.14em', textTransform: 'uppercase', color: statusColor[task.status], margin: 0, opacity: task.status === 'urgent' ? 1 : 0.7 }}>
                    {statusLabel[task.status]}
                  </p>
                  <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.5625rem', fontWeight: 400, letterSpacing: '0.10em', color: 'var(--color-ink-muted)', margin: 0 }}>
                    {task.assignee} · {formatDueDate(task.dueDate)}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
