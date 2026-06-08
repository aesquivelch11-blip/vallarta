import React from 'react';
import { ArrowRight } from 'lucide-react';
import { ScreenType } from '../../types';
import { DashboardData, DashboardTask } from './dashboardData';

interface DashboardTasksProps {
  data: DashboardData;
  onNavigate: (screen: ScreenType, style: 'push' | 'push_back' | 'slide_up') => void;
}

const statusLabel: Record<DashboardTask['status'], string> = {
  urgent: 'Urgent',
  pending: 'Pending',
  scheduled: 'Scheduled',
};

const statusColor: Record<DashboardTask['status'], string> = {
  urgent: 'oklch(53% 0.12 25)',
  pending: 'var(--color-ink-secondary)',
  scheduled: 'var(--color-ink-muted)',
};

export default function DashboardTasks({ data, onNavigate }: DashboardTasksProps) {
  const { tasks } = data;
  const visible = tasks.slice(0, 5);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        padding: 'clamp(2rem, 4vw, 3rem) clamp(1.5rem, 3vw, 2.5rem)',
      }}
    >
      {/* Count */}
      <div style={{ marginBottom: 'clamp(2rem, 4vw, 3rem)' }}>
        <p
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: 400,
            letterSpacing: '-0.01em',
            color: 'var(--color-ink)',
            margin: 0,
            lineHeight: 1,
          }}
        >
          {tasks.length > 0 ? `${tasks.length} open` : 'All clear'}
        </p>
      </div>

      {/* Numbered list */}
      {visible.length > 0 && (
        <ol
          style={{
            margin: 0,
            padding: 0,
            listStyle: 'none',
            display: 'flex',
            flexDirection: 'column',
            gap: 0,
            flex: 1,
          }}
        >
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
              }}
            >
              {/* EB Garamond numeral anchor */}
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(1rem, 2vw, 1.25rem)',
                  fontWeight: 400,
                  color: 'var(--color-ink-secondary)',
                  lineHeight: 1.2,
                  minWidth: '18px',
                  flexShrink: 0,
                  opacity: 0.6,
                }}
              >
                {i + 1}
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                <p
                  style={{
                    fontFamily: 'var(--font-ui)',
                    fontSize: '0.8125rem',
                    fontWeight: 400,
                    color: 'var(--color-ink)',
                    margin: 0,
                    lineHeight: 1.35,
                  }}
                >
                  {task.description}
                </p>
                <p
                  style={{
                    fontFamily: 'var(--font-ui)',
                    fontSize: '0.5625rem',
                    fontWeight: task.status === 'urgent' ? 600 : 400,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: statusColor[task.status],
                    margin: 0,
                    opacity: task.status === 'urgent' ? 1 : 0.7,
                  }}
                >
                  {statusLabel[task.status]}
                </p>
              </div>
            </li>
          ))}
        </ol>
      )}

    </div>
  );
}
