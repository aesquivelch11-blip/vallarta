import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { ScreenType } from '../../types';
import { DashboardData, DashboardTask, TaskCategory, categoryLabels, formatDueDate } from './dashboardData';

interface DashboardTasksProps {
  data: DashboardData;
  onNavigate: (screen: ScreenType, style: 'push' | 'push_back' | 'slide_up') => void;
  onNotify?: (message: string) => void;
}

const statusColor: Record<DashboardTask['status'], string> = {
  urgent: 'var(--color-accent-negative)',
  pending: 'var(--color-ink-secondary)',
  scheduled: 'var(--color-ink-muted)',
};

const categoryColor: Record<TaskCategory, string> = {
  maintenance: 'oklch(55% 0.08 250)',
  housekeeping: 'oklch(55% 0.10 150)',
  amenities: 'oklch(60% 0.10 70)',
  inspection: 'oklch(55% 0.08 320)',
};

export default function DashboardTasks({ data, onNavigate, onNotify }: DashboardTasksProps) {
  const { tasks } = data;
  const visible = tasks.slice(0, 6);
  const hasMore = tasks.length > 6;

  const [completed, setCompleted] = useState<Set<string>>(new Set());

  const toggleComplete = (id: string) => {
    setCompleted(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const completedCount = completed.size;
  const totalCount = tasks.length;
  const progressPct = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        padding: 'clamp(2rem, 4vw, 3rem) clamp(1.5rem, 3vw, 2.5rem)',
      }}
    >
      {/* Completion summary */}
      <div style={{ marginBottom: 'clamp(1.5rem, 3vw, 2.5rem)' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '10px' }}>
          <p
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.5rem, 3vw, 2rem)',
              fontWeight: 400,
              letterSpacing: '-0.01em',
              color: 'var(--color-ink)',
              margin: 0,
              lineHeight: 1,
            }}
          >
            {completedCount} of {totalCount}
          </p>
          <p
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '0.5625rem',
              fontWeight: 500,
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              color: 'var(--color-ink-secondary)',
              margin: 0,
            }}
          >
            completed
          </p>
        </div>

        {/* Progress bar */}
        <div
          style={{
            height: '4px',
            background: 'var(--color-border-subtle)',
            borderRadius: '2px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${progressPct}%`,
              background: progressPct === 100
                ? 'var(--color-accent-positive)'
                : 'var(--color-ink-secondary)',
              borderRadius: '2px',
              opacity: progressPct === 100 ? 1 : 0.5,
              transition: 'width 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          />
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: '1px', background: 'var(--color-border-subtle)', marginBottom: 'clamp(1rem, 2vw, 1.5rem)' }} />

      {/* Task list */}
      {visible.length > 0 && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
          }}
        >
          {visible.map((task, i) => {
            const isDone = completed.has(task.id);
            const isOverdue = !isDone && task.status === 'urgent';

            return (
              <div
                key={task.id}
                style={{
                  display: 'flex',
                  gap: '14px',
                  alignItems: 'flex-start',
                  paddingTop: i === 0 ? 0 : '14px',
                  paddingBottom: '14px',
                  borderBottom: i < visible.length - 1 ? '1px solid var(--color-border-subtle)' : 'none',
                  opacity: isDone ? 0.5 : 1,
                  transition: 'opacity 0.2s ease',
                }}
              >
                {/* Checkbox */}
                <button
                  onClick={() => toggleComplete(task.id)}
                  aria-label={isDone ? `Mark "${task.description}" incomplete` : `Mark "${task.description}" complete`}
                  style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    border: `1.5px solid ${isDone ? 'var(--color-accent-positive)' : 'var(--color-border-medium)'}`,
                    background: isDone ? 'var(--color-accent-positive)' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    flexShrink: 0,
                    marginTop: '1px',
                    padding: 0,
                    transition: 'all 0.15s ease',
                  }}
                >
                  {isDone && <Check size={10} strokeWidth={2.5} color="var(--color-canvas)" />}
                </button>

                {/* Task content */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', flex: 1, minWidth: 0 }}>
                  <p
                    style={{
                      fontFamily: 'var(--font-ui)',
                      fontSize: '0.8125rem',
                      fontWeight: 400,
                      color: 'var(--color-ink)',
                      margin: 0,
                      lineHeight: 1.35,
                      textDecoration: isDone ? 'line-through' : 'none',
                    }}
                  >
                    {task.description}
                  </p>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      flexWrap: 'wrap',
                    }}
                  >
                    {/* Category badge */}
                    <span
                      style={{
                        fontFamily: 'var(--font-ui)',
                        fontSize: '0.5rem',
                        fontWeight: 500,
                        letterSpacing: '0.14em',
                        textTransform: 'uppercase',
                        color: categoryColor[task.category],
                        lineHeight: 1,
                      }}
                    >
                      {categoryLabels[task.category]}
                    </span>

                    <span
                      style={{
                        width: '2px',
                        height: '2px',
                        borderRadius: '50%',
                        background: 'var(--color-border-medium)',
                        flexShrink: 0,
                      }}
                    />

                    {/* Assignee */}
                    <span
                      style={{
                        fontFamily: 'var(--font-ui)',
                        fontSize: '0.5625rem',
                        fontWeight: 400,
                        color: 'var(--color-ink-secondary)',
                        lineHeight: 1,
                      }}
                    >
                      {task.assignee}
                    </span>

                    <span
                      style={{
                        width: '2px',
                        height: '2px',
                        borderRadius: '50%',
                        background: 'var(--color-border-medium)',
                        flexShrink: 0,
                      }}
                    />

                    {/* Due date */}
                    <span
                      style={{
                        fontFamily: 'var(--font-ui)',
                        fontSize: '0.5625rem',
                        fontWeight: isOverdue ? 600 : 400,
                        color: isOverdue ? 'var(--color-accent-negative)' : 'var(--color-ink-muted)',
                        lineHeight: 1,
                      }}
                    >
                      {formatDueDate(task.dueDate)}
                    </span>
                  </div>
                </div>

                {/* Urgent status dot */}
                {task.status === 'urgent' && !isDone && (
                  <span
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: statusColor[task.status],
                      flexShrink: 0,
                      marginTop: '6px',
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* View all */}
      {tasks.length > 0 && (
        <button
          onClick={() => onNotify?.('Tasks screen coming soon')}
          style={{
            marginTop: 'clamp(1.5rem, 3vw, 2rem)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontFamily: 'var(--font-ui)',
            fontSize: '0.625rem',
            fontWeight: 500,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: 'var(--color-ink-secondary)',
            background: 'none',
            border: 'none',
            padding: 0,
            cursor: 'pointer',
            opacity: 0.6,
            alignSelf: 'flex-start',
          }}
        >
          VIEW ALL TASKS {hasMore && `(${tasks.length})`}
        </button>
      )}
    </div>
  );
}
