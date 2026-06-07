import { Property } from '../../types';
import propImg1 from '../../assets/Menu/menu-1.jpg';
import propImg1Webp from '../../assets/Menu/menu-1.webp';
import propImg2 from '../../assets/Menu/menu-2.jpg';
import propImg2Webp from '../../assets/Menu/menu-2.webp';
import propImg3 from '../../assets/Menu/menu-3.jpg';
import propImg3Webp from '../../assets/Menu/menu-3.webp';
import propImg4 from '../../assets/Menu/menu-4.jpg';
import propImg4Webp from '../../assets/Menu/menu-4.webp';
import propImg5 from '../../assets/Menu/menu-1.jpg';
import propImg5Webp from '../../assets/Menu/menu-1.webp';

export const sampleProperties: Property[] = [
  {
    id: 'casa-palmeras',
    name: 'Casa Palmeras',
    location: 'Zona Romántica',
    tagline: 'Oceanfront luxury with private infinity pool',
    imageUrl: propImg1,
    imageWebp: propImg1Webp,
    images: [propImg1, propImg2, propImg3],
    metrics: { bedrooms: 4, occupancy: '78%', revenue: '$12,400' },
  },
  {
    id: 'villa-luna',
    name: 'Villa Luna',
    location: 'Conchas Chinas',
    tagline: 'Contemporary hillside retreat with panoramic views',
    imageUrl: propImg2,
    imageWebp: propImg2Webp,
    images: [propImg2, propImg3, propImg4],
    metrics: { bedrooms: 3, occupancy: '92%', revenue: '$9,800' },
  },
  {
    id: 'casa-sol',
    name: 'Casa del Sol',
    location: 'Marina Vallarta',
    tagline: 'Beachfront estate with private dock',
    imageUrl: propImg3,
    imageWebp: propImg3Webp,
    images: [propImg3, propImg4, propImg1],
    metrics: { bedrooms: 5, occupancy: '65%', revenue: '$18,200' },
  },
  {
    id: 'vista-al-mar',
    name: 'Vista al Mar',
    location: 'Punta Mita',
    tagline: 'Cliffside villa with sunset terrace',
    imageUrl: propImg4,
    imageWebp: propImg4Webp,
    images: [propImg4, propImg1, propImg2],
    metrics: { bedrooms: 6, occupancy: '85%', revenue: '$21,500' },
  },
  {
    id: 'casa-brisa',
    name: 'Casa Brisa',
    location: 'Bucerías',
    tagline: 'Boutique casita steps from the sand',
    imageUrl: propImg5,
    imageWebp: propImg5Webp,
    images: [propImg5, propImg3],
    metrics: { bedrooms: 2, occupancy: '71%', revenue: '$6,100' },
  },
];
