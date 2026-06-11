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
    const paragraphs = Array.from(container.querySelectorAll('p'));
    const italicTimestamps = paragraphs.filter(el => el.style.fontStyle === 'italic');
    expect(italicTimestamps.length).toBe(0);
  });

  it('does not render bullet dot elements', () => {
    const { container } = render(<ChronicleTimeline events={mockEvents} />);
    const dots = Array.from(container.querySelectorAll('span')).filter(
      el => el.style.borderRadius === '50%'
    );
    expect(dots.length).toBe(0);
  });

  it('renders one grid row per event', () => {
    const { container } = render(<ChronicleTimeline events={mockEvents} />);
    const rows = container.firstChild?.childNodes;
    expect(rows?.length).toBe(3);
  });

  it('renders timestamps as separate column from descriptions', () => {
    const { container } = render(<ChronicleTimeline events={mockEvents} />);
    expect(container.textContent).toContain('3:14 PM');
    expect(container.textContent).toContain('Elena Rosenthal checked in');
  });

  it('renders no content when events array is empty', () => {
    const { container } = render(<ChronicleTimeline events={[]} />);
    expect(container.textContent).toBe('');
  });

  it('renders last event without bottom border', () => {
    const { container } = render(<ChronicleTimeline events={mockEvents} />);
    const rows = container.querySelectorAll('[style*="border-bottom"]');
    const lastRow = rows[rows.length - 1] as HTMLElement;
    expect(lastRow.style.borderBottomStyle).toBe('none');
  });
});
