export default function PropertySkeleton() {
  return (
    <div className="ps-card ps-skeleton">
      <div className="ps-skeleton__image" />
      <div className="ps-skeleton__content">
        <div className="ps-skeleton__name" />
        <div className="ps-skeleton__location" />
      </div>
    </div>
  );
}
