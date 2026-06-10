import { render, cleanup } from '@testing-library/react';
import { describe, it, expect, afterEach } from 'vitest';
import ChronicleTimeline from '../../../src/components/Dashboard/ChronicleTimeline';
import { GuestLogEntry } from '../../../src/components/Dashboard/dashboardData';

afterEach(cleanup);

const mockEvents: GuestLogEntry[] = [
  { id: 'g1', timestamp: '2026-06-07T15:14:00', type: 'arrival', description: 'Elena Rosenthal checked in', guestName: 'Elena Rosenthal', nights: 5 },
  { id: 'g2', timestamp: '2026-06-07T11:00:00', type: 'task_completed', description: 'Pool filter cartridge replaced', assignee: 'Carlos' },
  { id: 'g3', timestamp: '2026-06-07T09:30:00', type: 'departure', description: 'James Whitfield checked out', guestName: 'James Whitfield', nights: 7 },
];

describe('ChronicleTimeline', () => {
  it('renders CHRONICLE heading', () => {
    const { container } = render(<ChronicleTimeline events={mockEvents} />);
    expect(container.textContent).toContain('CHRONICLE');
  });

  it('renders event descriptions', () => {
    const { container } = render(<ChronicleTimeline events={mockEvents} />);
    expect(container.textContent).toContain('Elena Rosenthal checked in');
    expect(container.textContent).toContain('Pool filter cartridge replaced');
    expect(container.textContent).toContain('James Whitfield checked out');
  });

  it('renders timestamps in italic style', () => {
    const { container } = render(<ChronicleTimeline events={mockEvents} />);
    const italicElements = container.querySelectorAll('p');
    const italicTexts = Array.from(italicElements)
      .filter(el => el.style.fontStyle === 'italic')
      .map(el => el.textContent);
    expect(italicTexts.length).toBe(3);
  });

  it('renders connecting dots for each event', () => {
    const { container } = render(<ChronicleTimeline events={mockEvents} />);
    const dots = container.querySelectorAll('span');
    expect(dots.length).toBe(3);
  });

  it('shows nothing when events array is empty', () => {
    const { container } = render(<ChronicleTimeline events={[]} />);
    expect(container.textContent).not.toContain('Elena');
  });

  it('has maxHeight and scroll set', () => {
    const { container } = render(<ChronicleTimeline events={mockEvents} />);
    const outerDiv = container.firstChild as HTMLElement;
    expect(outerDiv).toHaveStyle('max-height: 200px');
    expect(outerDiv).toHaveStyle('overflow-y: auto');
  });

  it('renders single event without border on last item', () => {
    const singleEvent: GuestLogEntry[] = [
      { id: 'g1', timestamp: '2026-06-07T15:14:00', type: 'arrival', description: 'Solo guest', guestName: 'Solo', nights: 2 },
    ];
    const { container } = render(<ChronicleTimeline events={singleEvent} />);
    expect(container.textContent).toContain('Solo guest');
  });
});
