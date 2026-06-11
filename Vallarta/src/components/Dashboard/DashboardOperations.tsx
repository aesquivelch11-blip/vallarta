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
