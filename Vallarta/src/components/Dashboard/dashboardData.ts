export interface GuestEvent {
  id: string;
  name: string;
  nights: number;
}

export interface DashboardTask {
  id: string;
  description: string;
  status: 'urgent' | 'pending' | 'scheduled';
}

export interface PeriodFinancials {
  label: string;
  revenue: number;
  expenses: number;
}

export interface DashboardData {
  occupancy: number;
  arrivalsToday: GuestEvent[];
  departuresToday: GuestEvent[];
  arrivalsTomorrow: GuestEvent[];
  departuresTomorrow: GuestEvent[];
  tasks: DashboardTask[];
  periods: PeriodFinancials[];
}

const mockData: Record<string, DashboardData> = {
  'casa-palmeras': {
    occupancy: 78,
    arrivalsToday: [
      { id: 'a1', name: 'Elena Rosenthal', nights: 5 },
      { id: 'a2', name: 'Marco & Lucia Ferrara', nights: 3 },
    ],
    departuresToday: [
      { id: 'd1', name: 'James Whitfield', nights: 7 },
    ],
    arrivalsTomorrow: [{ id: 'a3', name: 'Camille Devereux', nights: 4 }],
    departuresTomorrow: [{ id: 'd2', name: 'Sofía Méndez', nights: 4 }],
    tasks: [
      { id: 't1', description: 'Replace pool filter cartridge', status: 'urgent' },
      { id: 't2', description: 'AC unit inspection — unit 2', status: 'pending' },
      { id: 't3', description: 'Touch-up paint on terrace railing', status: 'scheduled' },
    ],
    periods: [
      { label: 'June 2026', revenue: 12400, expenses: 3200 },
      { label: 'May 2026', revenue: 10800, expenses: 2950 },
      { label: 'April 2026', revenue: 9600, expenses: 2800 },
    ],
  },
  'villa-luna': {
    occupancy: 92,
    arrivalsToday: [{ id: 'a1', name: 'Valentina Cruz', nights: 6 }],
    departuresToday: [],
    arrivalsTomorrow: [],
    departuresTomorrow: [{ id: 'd1', name: 'Henrik Larsen', nights: 5 }],
    tasks: [
      { id: 't1', description: 'Restock amenity kit — master suite', status: 'urgent' },
      { id: 't2', description: 'Garden irrigation check', status: 'scheduled' },
    ],
    periods: [
      { label: 'June 2026', revenue: 9800, expenses: 2100 },
      { label: 'May 2026', revenue: 11200, expenses: 2400 },
      { label: 'April 2026', revenue: 8900, expenses: 1950 },
    ],
  },
  'casa-sol': {
    occupancy: 65,
    arrivalsToday: [],
    departuresToday: [{ id: 'd1', name: 'The Okafor Family', nights: 10 }],
    arrivalsTomorrow: [
      { id: 'a1', name: 'Rebecca & Tom Harrington', nights: 7 },
    ],
    departuresTomorrow: [],
    tasks: [
      { id: 't1', description: 'Dock safety inspection due', status: 'urgent' },
      { id: 't2', description: 'Deep clean — beach-level terrace', status: 'pending' },
      { id: 't3', description: 'Replace outdoor shower head', status: 'pending' },
      { id: 't4', description: 'Refill propane for grill', status: 'scheduled' },
    ],
    periods: [
      { label: 'June 2026', revenue: 18200, expenses: 4800 },
      { label: 'May 2026', revenue: 15600, expenses: 4200 },
      { label: 'April 2026', revenue: 14100, expenses: 3900 },
    ],
  },
  'vista-al-mar': {
    occupancy: 85,
    arrivalsToday: [{ id: 'a1', name: 'Isabelle & Jean-Paul Moreau', nights: 9 }],
    departuresToday: [{ id: 'd1', name: 'Dr. Amara Nwosu', nights: 4 }],
    arrivalsTomorrow: [],
    departuresTomorrow: [],
    tasks: [
      { id: 't1', description: 'Sunset terrace lighting repair', status: 'urgent' },
      { id: 't2', description: 'Guest welcome basket preparation', status: 'pending' },
    ],
    periods: [
      { label: 'June 2026', revenue: 21500, expenses: 5600 },
      { label: 'May 2026', revenue: 19800, expenses: 5200 },
      { label: 'April 2026', revenue: 17400, expenses: 4700 },
    ],
  },
  'casa-brisa': {
    occupancy: 71,
    arrivalsToday: [],
    departuresToday: [{ id: 'd1', name: 'Lucas Mendes', nights: 3 }],
    arrivalsTomorrow: [{ id: 'a1', name: 'Priya Sharma', nights: 5 }],
    departuresTomorrow: [],
    tasks: [
      { id: 't1', description: 'Replace bedroom ceiling fan', status: 'pending' },
    ],
    periods: [
      { label: 'June 2026', revenue: 6100, expenses: 1400 },
      { label: 'May 2026', revenue: 5800, expenses: 1350 },
      { label: 'April 2026', revenue: 5200, expenses: 1200 },
    ],
  },
};

const fallback = mockData['casa-palmeras'];

export function getDashboardData(propertyId: string): DashboardData {
  return mockData[propertyId] ?? fallback;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
}
