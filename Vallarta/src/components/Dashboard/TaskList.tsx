import React from 'react';
import { motion } from 'motion/react';
import { DashboardTask, formatDueDate } from './dashboardData';

interface TaskListProps {
  tasks: DashboardTask[];
}

const labelStyle: React.CSSProperties = {
  fontFamily: 'var(--font-ui)',
  fontSize: '0.5625rem',
  fontWeight: 500,
  letterSpacing: '0.28em',
  textTransform: 'uppercase',
  color: 'var(--color-ink-secondary)',
  margin: 0,
  lineHeight: 1,
};

// Status drives opacity only — no badges, no border accents
const opacityByStatus: Record<DashboardTask['status'], number> = {
  urgent: 1,
  pending: 0.6,
  scheduled: 0.4,
};

export default function TaskList({ tasks }: TaskListProps) {
  const visible = tasks.slice(0, 5);

  if (tasks.length === 0) {
    return (
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
        style={{
          fontFamily: 'var(--font-display)',
          fontStyle: 'italic',
          fontSize: 'clamp(1rem, 2vw, 1.25rem)',
          fontWeight: 400,
          color: 'var(--color-ink-secondary)',
          margin: 0,
        }}
      >
        All clear.
      </motion.p>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      {/* Anchor count — matches Today tab's occupancy number register */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
      >
        <p
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(3rem, 6vw, 4.5rem)',
            fontWeight: 400,
            letterSpacing: '-0.02em',
            color: 'var(--color-ink)',
            margin: 0,
            lineHeight: 0.95,
          }}
        >
          {tasks.length}
        </p>
        <p style={{ ...labelStyle, marginTop: '8px' }}>outstanding</p>
      </motion.div>

      <ol
        style={{
          margin: '20px 0 0',
          padding: 0,
          listStyle: 'none',
          display: 'flex',
          flexDirection: 'column',
          gap: 0,
        }}
      >
        {visible.map((task, i) => (
          <motion.li
            key={task.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: opacityByStatus[task.status], y: 0 }}
            transition={{
              duration: 0.28,
              delay: i * 0.055,
              ease: [0.16, 1, 0.3, 1] as const,
            }}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              paddingTop: i === 0 ? 0 : '16px',
              paddingBottom: '16px',
              borderBottom:
                i < visible.length - 1
                  ? '1px solid var(--color-border-subtle)'
                  : 'none',
            }}
          >
            {/* Left: description + assignee */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
              <p
                style={{
                  fontFamily: 'var(--font-ui)',
                  fontSize: '0.9375rem',
                  fontWeight: 400,
                  color: 'var(--color-ink)',
                  margin: 0,
                  lineHeight: 1.3,
                }}
              >
                {task.description}
              </p>
              <p
                style={{
                  fontFamily: 'var(--font-ui)',
                  fontSize: '0.625rem',
                  fontWeight: 400,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: 'var(--color-ink-muted)',
                  margin: 0,
                }}
              >
                {task.assignee}
              </p>
            </div>

            {/* Right: date info — urgent uses warning color, scheduled uses muted */}
            {(task.status === 'urgent' || task.status === 'scheduled') && (
              <p
                style={{
                  fontFamily: 'var(--font-ui)',
                  fontSize: '0.625rem',
                  fontWeight: task.status === 'urgent' ? 500 : 400,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color:
                    task.status === 'urgent'
                      ? 'var(--color-task-urgent)'
                      : 'var(--color-ink-muted)',
                  margin: 0,
                  flexShrink: 0,
                  paddingLeft: '16px',
                }}
              >
                {formatDueDate(task.dueDate)}
              </p>
            )}
          </motion.li>
        ))}
      </ol>
    </div>
  );
}
