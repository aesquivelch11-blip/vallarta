import React from 'react';

export default function PropertySkeleton() {
  return (
    <div className="relative w-full h-full overflow-hidden bg-[rgba(255,255,255,0.04)]">
      <div className="absolute bottom-0 left-0 right-0 p-5">
        <div
          className="h-6 bg-[rgba(255,255,255,0.08)] animate-pulse"
          style={{ width: '60%', borderRadius: '2px' }}
        />
        <div className="flex items-end justify-between mt-2">
          <div
            className="h-3 bg-[rgba(255,255,255,0.06)] animate-pulse"
            style={{ width: '40%', borderRadius: '2px' }}
          />
          <div
            className="h-3 bg-[rgba(255,255,255,0.06)] animate-pulse"
            style={{ width: '20%', borderRadius: '2px' }}
          />
        </div>
      </div>
    </div>
  );
}
