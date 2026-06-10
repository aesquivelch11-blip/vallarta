import React from 'react';

type OccupancyStatus = 'available' | 'occupied' | 'maintenance' | 'reserved';

interface StatusAccentProps {
  status: OccupancyStatus;
}

export default function StatusAccent({ status }: StatusAccentProps) {
  return (
    <div className={`ps-status-accent ps-status-accent--${status}`} />
  );
}