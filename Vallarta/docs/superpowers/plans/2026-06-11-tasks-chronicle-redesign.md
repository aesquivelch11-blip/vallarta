# Tasks & Chronicle Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace generic AI-dashboard patterns in the Tasks/Chronicle tab with an editorial, typography-driven design that matches the app's existing hospitality aesthetic.

**Architecture:** Three components change. `TaskList` drops status badges, numbered row indices, and left-border urgency highlights in favour of a display-size anchor count (matching the Today tab's register), opacity-gradient status signalling, and right-aligned overdue/date info. `ChronicleTimeline` replaces the dot-and-connecting-line timeline with a two-column CSS Grid ledger (time left, description right) and no section label. `DashboardOperations` wraps the two sections in visually distinct zones: tasks = open canvas with consistent padding, chronicle = tinted surface (`var(--color-surface-solid)`) separated by a `border-top`.

**Tech Stack:** React, Motion (`motion/react`), CSS custom properties (design tokens), Vitest + React Testing Library

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `src/components/Dashboard/TaskList.tsx` | Rewrite | Display anchor count, opacity-gradient rows, overdue info, no badges |
| `src/components/Dashboard/ChronicleTimeline.tsx` | Rewrite | Two-column grid ledger, no heading, no dots |
| `src/components/Dashboard/DashboardOperations.tsx` | Rewrite | Two visual zones with distinct backgrounds |
| `tests/components/Dashboard/TaskList.test.tsx` | Rewrite | Tests for new spec (TDD baseline) |
| `tests/components/Dashboard/ChronicleTimeline.test.tsx` | Rewrite | Tests for new spec (TDD baseline) |
| `tests/components/Dashboard/DashboardOperations.test.tsx` | Update | Remove stale assertions for CHRONICLE/OPEN TASKS labels |

---

## Task 1: Update TaskList tests to new spec

**Files:**
- Rewrite: `tests/components/Dashboard/TaskList.test.tsx`

- [ ] **Step 1: Rewrite the test file**

Replace the entire file with tests that describe the new design contract:

```tsx
import { render, cleanup } from '@testing-library/react';
import { describe, it, expect, afterEach } from 'vitest';
import TaskList from '../../../src/components/Dashboard/TaskList';
import { DashboardTask } from '../../../src/components/Dashboard/dashboardData';

afterEach(cleanup);

const mockTasks: DashboardTask[] = [
  {
    id: 't1', description: 'Replace pool filter cartridge', status: 'urgent',
    category: 'maintenance', assignee: 'Carlos', dueDate: '2026-06-05',
  },
  {
    id: 't2', description: 'Deep clean terrace', status: 'pending',
    category: 'housekeeping', assignee: 'Ana', dueDate: '2026-06-12',
  },
  {
    id: 't3', description: 'Refill propane', status: 'scheduled',
    category: 'amenities', assignee: 'Ana', dueDate: '2026-06-18',
  },
];

describe('TaskList', () => {
  it('renders task count as display anchor number, not as label', () => {
    const { container } = render(<TaskList tasks={mockTasks} />);
    expect(container.textContent).toContain('3');
    expect(container.textContent).not.toContain('OPEN TASKS');
  });

  it('renders "All clear." in italic when no tasks', () => {
    const { container } = render(<TaskList tasks={[]} />);
    expect(container.textContent).toContain('All clear.');
    expect(container.querySelector('ol')).toBeNull();
  });

  it('renders task descriptions', () => {
    const { container } = render(<TaskList tasks={mockTasks} />);
    expect(container.textContent).toContain('Replace pool filter cartridge');
    expect(container.textContent).toContain('Deep clean terrace');
    expect(container.textContent).toContain('Refill propane');
  });

  it('does not render status badge labels', () => {
    const { container } = render(<TaskList tasks={mockTasks} />);
    // No colored status words — urgency signalled by opacity only
    ['Urgent', 'Pending', 'Scheduled', 'URGENT', 'PENDING', 'SCHEDULED'].forEach(label => {
      expect(container.textContent).not.toContain(label);
    });
  });

  it('does not render numbered row indices', () => {
    const { container } = render(<TaskList tasks={mockTasks} />);
    // Old design: each li had a <span>{i + 1}</span> index child
    // New design: no such spans — the only number visible is the anchor count
    const listItems = container.querySelectorAll('ol li');
    listItems.forEach(item => {
      const spans = item.querySelectorAll('span');
      // No bare-digit spans inside task rows
      spans.forEach(span => {
        expect(['1', '2', '3']).not.toContain(span.textContent?.trim());
      });
    });
  });

  it('shows overdue duration right-aligned for urgent tasks', () => {
    const { container } = render(<TaskList tasks={mockTasks} />);
    // formatDueDate('2026-06-05') against hardcoded today 2026-06-07 = '2d overdue'
    expect(container.textContent).toContain('2d overdue');
  });

  it('shows scheduled date right-aligned for scheduled tasks', () => {
    const { container } = render(<TaskList tasks={mockTasks} />);
    // formatDueDate('2026-06-18') against hardcoded today 2026-06-07 = 'Jun 18'
    expect(container.textContent).toContain('Jun 18');
  });

  it('does not show due-date for pending tasks', () => {
    const pendingOnly: DashboardTask[] = [mockTasks[1]];
    const { container } = render(<TaskList tasks={pendingOnly} />);
    // Pending rows show assignee only — no date displayed
    expect(container.textContent).toContain('Ana');
    expect(container.textContent).not.toContain('Jun 12');
    expect(container.textContent).not.toContain('5d');
  });

  it('renders assignee names in task rows', () => {
    const { container } = render(<TaskList tasks={mockTasks} />);
    expect(container.textContent).toContain('Carlos');
    expect(container.textContent).toContain('Ana');
  });

  it('limits visible rows to 5 even when more tasks exist', () => {
    const manyTasks: DashboardTask[] = Array.from({ length: 7 }, (_, i) => ({
      id: `t${i}`, description: `Task ${i + 1}`, status: 'pending' as const,
      category: 'maintenance' as const, assignee: 'Carlos', dueDate: '2026-06-10',
    }));
    const { container } = render(<TaskList tasks={manyTasks} />);
    expect(container.textContent).toContain('7'); // anchor shows real count
    const items = container.querySelectorAll('ol li');
    expect(items.length).toBe(5);
  });
});
```

- [ ] **Step 2: Run tests — verify they fail for the right reasons**

```bash
rtk vitest run tests/components/Dashboard/TaskList.test.tsx
```

Expected failures:
- `renders task count as display anchor number` — current renders "3 OPEN TASKS"
- `does not render status badge labels` — current renders "Urgent", "Pending", "Scheduled"
- `does not render numbered row indices` — current renders `<span>1</span>` etc.
- `shows overdue duration right-aligned` — current shows date inline in meta strip only
- `shows scheduled date right-aligned` — passes (date appears in current meta strip) — OK
- `does not show due-date for pending tasks` — may pass already, check
- `renders "All clear."` — current renders "ALL CLEAR"

- [ ] **Step 3: Commit failing tests**

```bash
rtk git add tests/components/Dashboard/TaskList.test.tsx
rtk git commit -m "test(TaskList): rewrite tests to new editorial design spec"
```

---

## Task 2: Implement TaskList redesign

**Files:**
- Rewrite: `src/components/Dashboard/TaskList.tsx`

- [ ] **Step 1: Replace the entire component**

```tsx
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
```

- [ ] **Step 2: Run tests — verify they pass**

```bash
rtk vitest run tests/components/Dashboard/TaskList.test.tsx
```

Expected: all 10 tests PASS.

If `does not render numbered row indices` fails: verify no `<span>{i + 1}</span>` exists anywhere in the new component — the old component had this in the `<ol>` list items.

- [ ] **Step 3: Commit**

```bash
rtk git add src/components/Dashboard/TaskList.tsx
rtk git commit -m "feat(TaskList): editorial redesign — anchor count, opacity-gradient status, no badges"
```

---

## Task 3: Update ChronicleTimeline tests to new spec

**Files:**
- Rewrite: `tests/components/Dashboard/ChronicleTimeline.test.tsx`

- [ ] **Step 1: Rewrite the test file**

```tsx
import { render, cleanup } from '@testing-library/react';
import { describe, it, expect, afterEach } from 'vitest';
import ChronicleTimeline from '../../../src/components/Dashboard/ChronicleTimeline';
import { GuestLogEntry } from '../../../src/components/Dashboard/dashboardData';

afterEach(cleanup);

const mockEvents: GuestLogEntry[] = [
  {
    id: 'g1', timestamp: '2026-06-07T15:14:00', type: 'arrival',
    description: 'Elena Rosenthal checked in', guestName: 'Elena Rosenthal', nights: 5,
  },
  {
    id: 'g2', timestamp: '2026-06-07T11:00:00', type: 'task_completed',
    description: 'Pool filter cartridge replaced', assignee: 'Carlos',
  },
  {
    id: 'g3', timestamp: '2026-06-07T09:30:00', type: 'departure',
    description: 'James Whitfield checked out', guestName: 'James Whitfield', nights: 7,
  },
];

describe('ChronicleTimeline', () => {
  it('does not render a CHRONICLE section heading', () => {
    const { container } = render(<ChronicleTimeline events={mockEvents} />);
    expect(container.textContent).not.toContain('CHRONICLE');
  });

  it('renders all event descriptions', () => {
    const { container } = render(<ChronicleTimeline events={mockEvents} />);
    expect(container.textContent).toContain('Elena Rosenthal checked in');
    expect(container.textContent).toContain('Pool filter cartridge replaced');
    expect(container.textContent).toContain('James Whitfield checked out');
  });

  it('renders timestamps as non-italic tabular text', () => {
    const { container } = render(<ChronicleTimeline events={mockEvents} />);
    // Old design: timestamps used font-style italic
    // New design: plain upright Instrument Sans
    const paragraphs = Array.from(container.querySelectorAll('p'));
    const italicTimestamps = paragraphs.filter(el => el.style.fontStyle === 'italic');
    expect(italicTimestamps.length).toBe(0);
  });

  it('does not render bullet dot elements', () => {
    const { container } = render(<ChronicleTimeline events={mockEvents} />);
    // Old design: a <span> with borderRadius 50% per event as the dot marker
    const dots = Array.from(container.querySelectorAll('span')).filter(
      el => el.style.borderRadius === '50%'
    );
    expect(dots.length).toBe(0);
  });

  it('renders one grid row per event', () => {
    const { container } = render(<ChronicleTimeline events={mockEvents} />);
    // Outer div > one motion.div per event
    const rows = container.firstChild?.childNodes;
    expect(rows?.length).toBe(3);
  });

  it('renders timestamps as separate column from descriptions', () => {
    const { container } = render(<ChronicleTimeline events={mockEvents} />);
    // Both time and description text are present but structurally separate
    expect(container.textContent).toContain('3:14 PM');
    expect(container.textContent).toContain('Elena Rosenthal checked in');
  });

  it('renders no content when events array is empty', () => {
    const { container } = render(<ChronicleTimeline events={[]} />);
    expect(container.textContent).toBe('');
  });

  it('renders last event without bottom border', () => {
    const { container } = render(<ChronicleTimeline events={mockEvents} />);
    // Last row should have borderBottom: 'none'
    const rows = Array.from(container.querySelectorAll('[style]')) as HTMLElement[];
    const lastRow = rows[rows.length - 1];
    // border-bottom: none means no divider after last item
    expect(lastRow.style.borderBottom).toBe('none');
  });
});
```

- [ ] **Step 2: Run tests — verify they fail for the right reasons**

```bash
rtk vitest run tests/components/Dashboard/ChronicleTimeline.test.tsx
```

Expected failures:
- `does not render a CHRONICLE section heading` — current renders "CHRONICLE"
- `renders timestamps as non-italic tabular text` — current uses `fontStyle: 'italic'`
- `does not render bullet dot elements` — current has `<span>` with `borderRadius: '50%'`
- `renders one grid row per event` — current structure is different

- [ ] **Step 3: Commit failing tests**

```bash
rtk git add tests/components/Dashboard/ChronicleTimeline.test.tsx
rtk git commit -m "test(ChronicleTimeline): rewrite tests to ledger design spec"
```

---

## Task 4: Implement ChronicleTimeline ledger redesign

**Files:**
- Rewrite: `src/components/Dashboard/ChronicleTimeline.tsx`

- [ ] **Step 1: Replace the entire component**

```tsx
import React from 'react';
import { motion } from 'motion/react';
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      {events.map((event, i) => (
        <motion.div
          key={event.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.25,
            delay: i * 0.045,
            ease: [0.16, 1, 0.3, 1] as const,
          }}
          style={{
            display: 'grid',
            gridTemplateColumns: '72px 1fr',
            gap: '0 14px',
            alignItems: 'baseline',
            padding: '9px 0',
            borderBottom:
              i < events.length - 1
                ? '1px solid var(--color-border-subtle)'
                : 'none',
          }}
        >
          {/* Time column: fixed-width tabular mono */}
          <p
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '0.5625rem',
              fontWeight: 400,
              letterSpacing: '0.06em',
              color: 'var(--color-ink-muted)',
              fontVariantNumeric: 'tabular-nums',
              margin: 0,
              lineHeight: 1.5,
            }}
          >
            {formatTime(event.timestamp)}
          </p>

          {/* Description column */}
          <p
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '0.75rem',
              fontWeight: 400,
              color: 'var(--color-ink)',
              margin: 0,
              lineHeight: 1.4,
            }}
          >
            {event.description}
          </p>
        </motion.div>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Run tests — verify they pass**

```bash
rtk vitest run tests/components/Dashboard/ChronicleTimeline.test.tsx
```

Expected: all 8 tests PASS.

If `renders last event without bottom border` fails: confirm the `borderBottom` condition uses `i < events.length - 1`. The last item (index 2, length 3) should produce `borderBottom: 'none'`.

- [ ] **Step 3: Commit**

```bash
rtk git add src/components/Dashboard/ChronicleTimeline.tsx
rtk git commit -m "feat(ChronicleTimeline): replace dot-line timeline with two-column ledger"
```

---

## Task 5: DashboardOperations — zone differentiation + update integration tests

**Files:**
- Rewrite: `src/components/Dashboard/DashboardOperations.tsx`
- Update: `tests/components/Dashboard/DashboardOperations.test.tsx`

- [ ] **Step 1: Update the integration tests first**

Replace the contents of `tests/components/Dashboard/DashboardOperations.test.tsx`:

```tsx
import { render, cleanup } from '@testing-library/react';
import { describe, it, expect, afterEach, vi } from 'vitest';
import DashboardOperations from '../../../src/components/Dashboard/DashboardOperations';
import { DashboardData, getDashboardData } from '../../../src/components/Dashboard/dashboardData';

vi.mock('../../../src/components/Dashboard/AmbientColorProvider', () => ({
  useAmbient: () => ({ canvas: '#faf6f0', accent: '#d4a76a', surface: '#fdf8f2' }),
}));

afterEach(cleanup);

const mockData = getDashboardData('casa-palmeras');

describe('DashboardOperations', () => {
  it('does not render OPEN TASKS label', () => {
    const { container } = render(<DashboardOperations data={mockData} onNavigate={vi.fn()} />);
    expect(container.textContent).not.toContain('OPEN TASKS');
  });

  it('does not render CHRONICLE heading', () => {
    const { container } = render(<DashboardOperations data={mockData} onNavigate={vi.fn()} />);
    expect(container.textContent).not.toContain('CHRONICLE');
  });

  it('renders guest log event descriptions', () => {
    const { container } = render(<DashboardOperations data={mockData} onNavigate={vi.fn()} />);
    expect(container.textContent).toContain('Elena Rosenthal checked in');
  });

  it('renders task descriptions', () => {
    const { container } = render(<DashboardOperations data={mockData} onNavigate={vi.fn()} />);
    expect(container.textContent).toContain('Replace pool filter cartridge');
  });

  it('has two distinct layout zones', () => {
    const { container } = render(<DashboardOperations data={mockData} onNavigate={vi.fn()} />);
    // Outer wrapper has exactly two children: task zone and chronicle zone
    const outerDiv = container.firstChild as HTMLElement;
    expect(outerDiv.childNodes.length).toBe(2);
  });

  it('chronicle zone has tinted background', () => {
    const { container } = render(<DashboardOperations data={mockData} onNavigate={vi.fn()} />);
    const outerDiv = container.firstChild as HTMLElement;
    const chronicleZone = outerDiv.childNodes[1] as HTMLElement;
    // Background set to var(--color-surface-solid) inline
    expect(chronicleZone.style.background).toBeTruthy();
  });

  it('renders "All clear." when no tasks', () => {
    const emptyData: DashboardData = { ...mockData, tasks: [], guestLog: [] };
    const { container } = render(<DashboardOperations data={emptyData} onNavigate={vi.fn()} />);
    expect(container.textContent).toContain('All clear.');
  });
});
```

- [ ] **Step 2: Run tests — verify the integration tests fail**

```bash
rtk vitest run tests/components/Dashboard/DashboardOperations.test.tsx
```

Expected failures:
- `does not render OPEN TASKS label` — current renders "OPEN TASKS"
- `does not render CHRONICLE heading` — current renders "CHRONICLE"
- `has two distinct layout zones` — current wraps both in a single gap container

- [ ] **Step 3: Rewrite DashboardOperations**

```tsx
import React from 'react';
import { ScreenType } from '../../types';
import { DashboardData } from './dashboardData';
import TaskList from './TaskList';
import ChronicleTimeline from './ChronicleTimeline';

interface DashboardOperationsProps {
  data: DashboardData;
  onNavigate: (screen: ScreenType, style: 'push' | 'push_back' | 'slide_up') => void;
}

export default function DashboardOperations({ data }: DashboardOperationsProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {/* Task zone: open canvas, consistent padding with other domain views */}
      <div
        style={{
          padding:
            'clamp(1.25rem, 2.5vw, 2rem) clamp(1.5rem, 3vw, 2.5rem) clamp(2rem, 4vw, 3rem)',
        }}
      >
        <TaskList tasks={data.tasks} />
      </div>

      {/* Chronicle zone: tinted surface signals "past / historical" register */}
      <div
        style={{
          borderTop: '1px solid var(--color-border-medium)',
          background: 'var(--color-surface-solid)',
          padding:
            'clamp(1.25rem, 2.5vw, 1.75rem) clamp(1.5rem, 3vw, 2.5rem) clamp(1.5rem, 3vw, 2rem)',
        }}
      >
        <ChronicleTimeline events={data.guestLog} />
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Run all three test files**

```bash
rtk vitest run tests/components/Dashboard/DashboardOperations.test.tsx tests/components/Dashboard/TaskList.test.tsx tests/components/Dashboard/ChronicleTimeline.test.tsx
```

Expected: all tests PASS.

- [ ] **Step 5: Run the full test suite to confirm no regressions**

```bash
rtk vitest run
```

Expected: all tests PASS. If `DashboardView.test.tsx` fails, check whether it asserts on "OPEN TASKS", "CHRONICLE", or task status labels — update those assertions to match the new content.

- [ ] **Step 6: Commit**

```bash
rtk git add src/components/Dashboard/DashboardOperations.tsx tests/components/Dashboard/DashboardOperations.test.tsx
rtk git commit -m "feat(DashboardOperations): two visual zones — task canvas + tinted chronicle ledger"
```

---

## Task 6: Visual verification

- [ ] **Step 1: Start dev server**

```bash
npm run dev
```

- [ ] **Step 2: Navigate to Tasks tab — check these against the design spec**

Open the dashboard and switch to the TASKS tab. Verify visually:

| Check | Expected |
|---|---|
| Entry point | Large EB Garamond display number (e.g. "3") with "outstanding" micro-label below — matches Today tab's occupancy number register |
| Task text | ~15px Instrument Sans, comfortably readable |
| Urgent row | Full opacity, right-aligned overdue text in warm amber (var(--color-task-urgent)) |
| Pending row | ~60% opacity, assignee only, no date |
| Scheduled row | ~40% opacity, right-aligned future date in muted color |
| No badges | Zero status label text anywhere (no URGENT / PENDING / SCHEDULED words) |
| No row numbers | No 1, 2, 3 indices on left of rows |
| No left border | No accent border on urgent row, no tinted background |
| Chronicle zone | Visible background color change (travertine cream) below a hairline border |
| Chronicle rows | Time on left (fixed-width, upright, muted), description on right — no dots, no connecting lines |
| No CHRONICLE heading | Section heading completely absent |
| Entry animations | Items slide up and fade in smoothly, stagger feels crisp (not sluggish) |
| Empty state | Navigate to a property with 0 tasks → "All clear." in italic Garamond |

- [ ] **Step 3: Check dark mode**

Toggle dark mode (the moon icon). Verify:
- Task text remains readable at reduced opacities
- Chronicle zone tinted background is visible (not identical to canvas)
- Overdue color is the dark-mode variant (`var(--color-task-urgent)` = `#c45a5a` in dark mode)

- [ ] **Step 4: Final commit if any visual tweaks were made during verification**

```bash
rtk git add -p
rtk git commit -m "fix: visual polish after Tasks/Chronicle redesign verification"
```

---

## Self-Review

**Spec coverage:**
- [x] Anchor count number replacing "OPEN TASKS" eyebrow → Task 2
- [x] Status expressed by opacity (urgent=1, pending=0.6, scheduled=0.4) → Task 2
- [x] No status badge labels → Task 2 + tested in Task 1
- [x] No numbered row indices → Task 2 + tested in Task 1
- [x] Overdue info right-aligned in warning color for urgent tasks → Task 2
- [x] Scheduled date right-aligned in muted color → Task 2
- [x] No date for pending tasks → Task 2 + tested in Task 1
- [x] "All clear." empty state in italic Garamond → Task 2
- [x] Faster entry animations (0.28s duration, 55ms stagger) → Task 2
- [x] Chronicle: no "CHRONICLE" heading → Task 4
- [x] Chronicle: no dot+line pattern → Task 4
- [x] Chronicle: two-column grid ledger (time left, description right) → Task 4
- [x] Chronicle: timestamps upright tabular, not italic → Task 4
- [x] Chronicle: tighter stagger (45ms) → Task 4
- [x] DashboardOperations: two visual zones with tinted background on chronicle → Task 5
- [x] DashboardOperations: border-top between zones → Task 5
- [x] No regressions in full suite → Task 5, Step 5

**Placeholder scan:** No TBDs, no "similar to Task N" references, all code blocks are complete.

**Type consistency:** `DashboardTask` and `GuestLogEntry` types are imported from `./dashboardData` consistently across all tasks. `formatDueDate` signature unchanged. `DashboardOperationsProps` interface preserved with same `onNavigate` signature (destructured but not used, consistent with original).
