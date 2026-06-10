import React from 'react';
import { ScreenType } from '../../types';
import { DashboardData } from './dashboardData';
import TaskList from './TaskList';
import ChronicleTimeline from './ChronicleTimeline';

interface DashboardOperationsProps {
  data: DashboardData;
  onNavigate: (screen: ScreenType, style: 'push' | 'push_back' | 'slide_up') => void;
}

export default function DashboardOperations({ data, onNavigate }: DashboardOperationsProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: 'clamp(2rem, 4vw, 3rem) clamp(1.5rem, 3vw, 2.5rem)', gap: 'clamp(1.5rem, 3vw, 2rem)', overflow: 'hidden' }}>
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
        <TaskList tasks={data.tasks} />
      </div>
      <ChronicleTimeline events={data.guestLog} />
    </div>
  );
}
