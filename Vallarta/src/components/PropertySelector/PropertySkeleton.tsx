import { TierLevel } from './StickyHeader';

interface PropertySkeletonProps {
  index: number;
  tier: TierLevel;
}

function isTallCard(index: number, tier: TierLevel): boolean {
  if (tier === 'catalog') return false;
  if (tier === 'gallery') return index % 3 === 0;
  return index % 5 === 0 || index % 5 === 3;
}

export default function PropertySkeleton({ index, tier }: PropertySkeletonProps) {
  const tall = isTallCard(index, tier);

  return (
    <div
      className={`ps-card ${tall ? 'ps-card--tall' : 'ps-card--short'}`}
      style={{ '--i': index } as React.CSSProperties}
      aria-hidden="true"
    >
      <div className="ps-card__image-wrap">
        <div className="ps-skeleton__image" />
      </div>
      <div className="ps-skeleton__name" />
      <div className="ps-skeleton__location" />
    </div>
  );
}
