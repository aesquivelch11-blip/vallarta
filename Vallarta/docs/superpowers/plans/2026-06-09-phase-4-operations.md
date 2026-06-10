# Phase 4: Operations — Chronicle + Tasks

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans.

**Goal:** Transform the Tasks domain into a comprehensive Operations view with status cards, visual task priority, and a living Chronicle timeline.

**Architecture:** Create 3 new components. Rebuild `DashboardTasks.tsx` to include status overview, priority task list, and editorial timeline.

**Tech Stack:** React 19, TypeScript

---

## File Structure

| File | Responsibility |
|---|---|
| `src/components/Dashboard/StatusCards.tsx` | 3-column status overview cards |
| `src/components/Dashboard/ChronicleTimeline.tsx` | Vertical editorial event timeline |
| `src/components/Dashboard/TaskList.tsx` | Enhanced task list with visual priority |
| `src/components/Dashboard/DashboardOperations.tsx` | Main layout (renamed from Tasks) |

---

### Task 1: Create StatusCards Component

**Files:**
- Create: `src/components/Dashboard/StatusCards.tsx`

**Code:**
```typescript
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
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'clamp(0.75rem, 1.5vw, 1rem)' }}>
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
```

**Verification:** 3 cards render. Status dots match task counts.

---

### Task 2: Create ChronicleTimeline Component

**Files:**
- Create: `src/components/Dashboard/ChronicleTimeline.tsx`

**Code:**
```typescript
import React from 'react';
import { GuestLogEntry } from './dashboardData';

interface ChronicleTimelineProps {
  events: GuestLogEntry[];
}

export default function ChronicleTimeline({ events }: ChronicleTimelineProps) {
  const formatTime = (ts: string) => {
    const d = new Date(ts);
    return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0', maxHeight: '200px', overflowY: 'auto' }}>
      <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.5625rem', fontWeight: 500, letterSpacing: '0.32em', textTransform: 'uppercase', color: 'var(--color-ink-secondary)', margin: '0 0 12px' }}>
        CHRONICLE
      </p>
      {events.map((event, i) => (
        <div key={event.id} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', padding: '8px 0', borderBottom: i < events.length - 1 ? '1px solid var(--color-border-subtle)' : 'none' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
            <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'var(--color-ink-secondary)', opacity: 0.5 }} />
            {i < events.length - 1 && <div style={{ width: '1px', flex: 1, background: 'var(--color-border-subtle)', marginTop: '4px' }} />}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <p style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: '0.625rem', fontWeight: 400, color: 'var(--color-ink-secondary)', margin: 0, lineHeight: 1.2 }}>
              {formatTime(event.timestamp)}
            </p>
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.75rem', fontWeight: 400, color: 'var(--color-ink)', margin: 0, lineHeight: 1.4 }}>
              {event.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
```

**Verification:** Events render chronologically. Timestamps are italic. Connecting line between dots.

---

### Task 3: Create TaskList Component

**Files:**
- Create: `src/components/Dashboard/TaskList.tsx`

**Code:**
```typescript
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
```

**Verification:** Urgent tasks have left border and warm background. Assignee and due date visible.

---

### Task 4: Rebuild DashboardTasks.tsx → DashboardOperations.tsx

**Files:**
- Rename: `src/components/Dashboard/DashboardTasks.tsx` to `src/components/Dashboard/DashboardOperations.tsx`

**Code:**
```typescript
import React from 'react';
import { ScreenType } from '../../types';
import { DashboardData } from './dashboardData';
import StatusCards from './StatusCards';
import TaskList from './TaskList';
import ChronicleTimeline from './ChronicleTimeline';

interface DashboardOperationsProps {
  data: DashboardData;
  onNavigate: (screen: ScreenType, style: 'push' | 'push_back' | 'slide_up') => void;
}

export default function DashboardOperations({ data, onNavigate }: DashboardOperationsProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: 'clamp(2rem, 4vw, 3rem) clamp(1.5rem, 3vw, 2.5rem)', gap: 'clamp(1.5rem, 3vw, 2rem)', overflow: 'hidden' }}>
      {/* Status Cards */}
      <StatusCards tasks={data.tasks} />

      {/* Task List */}
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
        <TaskList tasks={data.tasks} />
      </div>

      {/* Chronicle Timeline */}
      <ChronicleTimeline events={data.guestLog} />
    </div>
  );
}
```

**Verification:** All 3 sections fit. Task list scrollable. Chronicle scrollable.

---

### Task 5: Update DashboardView.tsx to use DashboardOperations

**Files:**
- Modify: `src/components/Dashboard/DashboardView.tsx`

**Change:** Import `DashboardOperations` instead of `DashboardTasks` and rename usage in `renderDomain()`.

```typescript
import DashboardOperations from './DashboardOperations'; // instead of DashboardTasks

// In renderDomain():
case 'tasks':
  return <DashboardOperations data={data} onNavigate={onNavigate} />;
```

---

### Task 6: Commit

```bash
git add -A
git commit -m "feat: transform Tasks into Operations with Status Cards, Chronicle Timeline"
```

---

## Self-Review

- [x] Status Cards show 3 categories with colored dots
- [x] TaskList has visual priority (left border, background)
- [x] Assignee and due date visible on each task
- [x] Chronicle Timeline is editorial with italic timestamps
- [x] All sections fit within viewport
- [x] No placeholders in any task
