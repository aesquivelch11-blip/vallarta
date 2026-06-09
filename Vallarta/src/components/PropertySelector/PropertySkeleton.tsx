interface PropertySkeletonProps {
  index: number;
}

export default function PropertySkeleton({ index }: PropertySkeletonProps) {
  const isTall = index % 3 === 0;

  return (
    <div className={`ps-card ps-skeleton ${isTall ? 'ps-card--tall' : 'ps-card--short'}`}>
      <div className="ps-skeleton__image" />
      <div className="ps-skeleton__body">
        <div className="ps-skeleton__name" />
        <div className="ps-skeleton__meta" />
      </div>
    </div>
  );
}
