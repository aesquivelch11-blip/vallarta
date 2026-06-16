import { Property } from '../../types';
import marival01 from '../../assets/marival/marival-01.jpeg';
import marival02 from '../../assets/marival/marival-02.jpeg';
import marival03 from '../../assets/marival/marival-03.jpeg';
import marival04 from '../../assets/marival/marival-04.jpeg';
import marival05 from '../../assets/marival/marival-05.jpeg';
import marival06 from '../../assets/marival/marival-06.jpeg';
import marival07 from '../../assets/marival/marival-07.jpeg';
import marival08 from '../../assets/marival/marival-08.jpeg';
import marival09 from '../../assets/marival/marival-09.jpeg';

export const sampleProperties: Property[] = [
  {
    id: 'marival-penthouse',
    name: 'Marival Penthouse',
    location: 'Puerto Vallarta',
    tagline: 'Rooftop penthouse above the Banderas Bay',
    occupancyStatus: 'available',
    pricePerNight: 0,
    propertyType: 'Penthouse',
    imageUrl: marival01,
    imageWebp: marival01,
    images: [
      marival01,
      marival02,
      marival03,
      marival04,
      marival05,
      marival06,
      marival07,
      marival08,
      marival09,
    ],
    metrics: { bedrooms: 0, occupancy: '—', revenue: '—' },
  },
];
