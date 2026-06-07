export interface Property {
  id: string;
  name: string;
  location: string;
  tagline: string;
  imageUrl: string;
  imageWebp?: string;
  images: string[];
  metrics?: {
    bedrooms: number;
    occupancy: string;
    revenue: string;
  };
}

export const sampleProperties: Property[] = [
  {
    id: 'villa-almara',
    name: 'Villa Almara',
    location: 'Zona Romantica',
    tagline: 'Oceanfront luxury with private infinity pool',
    imageUrl: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&q=80',
    images: ['https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&q=80'],
    metrics: { bedrooms: 4, occupancy: '78%', revenue: '$12,400' },
  },
  {
    id: 'casa-marena',
    name: 'Casa Marena',
    location: 'Marina Vallarta',
    tagline: 'Modern waterfront living with panoramic bay views',
    imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80',
    images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80'],
    metrics: { bedrooms: 3, occupancy: '82%', revenue: '$9,800' },
  },
  {
    id: 'residencia-coral',
    name: 'Residencia Coral',
    location: 'Conchas Chinas',
    tagline: 'Hillside estate with private beach access',
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80',
    images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80'],
    metrics: { bedrooms: 5, occupancy: '65%', revenue: '$15,200' },
  },
  {
    id: 'penthouse-brisa',
    name: 'Penthouse Brisa',
    location: 'Zona Romantica',
    tagline: 'Rooftop terrace above the cobblestone streets',
    imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80',
    images: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80'],
    metrics: { bedrooms: 2, occupancy: '91%', revenue: '$7,600' },
  },
  {
    id: 'hacienda-luna',
    name: 'Hacienda Luna',
    location: 'Fluvial Vallarta',
    tagline: 'Tropical retreat nestled along the river',
    imageUrl: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80',
    images: ['https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80'],
    metrics: { bedrooms: 6, occupancy: '58%', revenue: '$18,100' },
  },
];
