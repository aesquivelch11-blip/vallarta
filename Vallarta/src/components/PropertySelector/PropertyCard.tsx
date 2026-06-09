import { Property } from '../../types';
import StatusAccent from './StatusAccent';

interface PropertyCardProps {
  property: Property;
  onSelect: (propertyId: string) => void;
  index: number;
}

export default function PropertyCard({ property, onSelect, index }: PropertyCardProps) {
  return (
    <button
      onClick={() => onSelect(property.id)}
      className="ps-card"
      style={{ '--i': index } as React.CSSProperties}
      aria-label={`View ${property.name}, ${property.occupancyStatus}`}
    >
      <StatusAccent status={property.occupancyStatus} />

      <div className="ps-card__image-wrapper">
        <picture>
          {property.imageWebp && <source srcSet={property.imageWebp} type="image/webp" />}
          <img
            src={property.imageUrl}
            alt={property.name}
            className="ps-card__image cinematic-grade"
            loading="lazy"
          />
        </picture>
      </div>

      <div className="ps-card__gradient" />

      <div className="ps-card__content">
        <h3 className="ps-card__name">{property.name}</h3>
        <span className="ps-card__location">{property.location}</span>
      </div>
    </button>
  );
}
