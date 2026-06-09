interface PropertySkeletonProps {
  index: number;
}

export default function PropertySkeleton({ index }: PropertySkeletonProps) {
  const isTall = index % 3 === 0;

  return (
    <div
      className={`ps-card ${isTall ? 'ps-card--tall' : 'ps-card--short'}`}
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
