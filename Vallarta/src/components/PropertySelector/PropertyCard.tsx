import { Property } from '../../types';

interface PropertyCardProps {
  property: Property;
  onSelect: (propertyId: string) => void;
  index: number;
}

export default function PropertyCard({ property, onSelect, index }: PropertyCardProps) {
  const bedrooms = property.metrics?.bedrooms ?? 0;
  const isTall = index % 3 === 0;

  return (
    <button
      onClick={() => onSelect(property.id)}
      className={`ps-card ${isTall ? 'ps-card--tall' : 'ps-card--short'}`}
      style={{ '--i': index } as React.CSSProperties}
      aria-label={`View ${property.name}, ${property.propertyType}, $${property.pricePerNight.toLocaleString()} per night`}
    >
      <div className="ps-card__image-wrap">
        <picture>
          {property.imageWebp && <source srcSet={property.imageWebp} type="image/webp" />}
          <img
            src={property.imageUrl}
            alt={property.name}
            className="ps-card__image"
            loading="lazy"
          />
        </picture>
      </div>

      <div className="ps-card__body">
        <h3 className="ps-card__name">{property.name}</h3>
        <p className="ps-card__meta">
          <span className="ps-card__price">${property.pricePerNight.toLocaleString()} / night</span>
          <span className="ps-card__meta-sep">|</span>
          <span className="ps-card__beds">{bedrooms} bed{bedrooms !== 1 ? 's' : ''}</span>
          <span className="ps-card__meta-sep">|</span>
          <span className="ps-card__type">{property.propertyType}</span>
        </p>
      </div>
    </button>
  );
}
