import { OccupancyStatus } from '../../types';

interface StatusAccentProps {
  status: OccupancyStatus;
}

export default function StatusAccent({ status }: StatusAccentProps) {
  return (
    <div
      className={`ps-status-accent ps-status-accent--${status}`}
      role="presentation"
      aria-hidden="true"
    />
  );
}
