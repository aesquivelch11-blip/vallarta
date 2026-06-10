export interface GuestEvent {
  id: string;
  name: string;
  nights: number;
}

export type TaskCategory = 'maintenance' | 'housekeeping' | 'amenities' | 'inspection';
export type TaskStatus = 'urgent' | 'pending' | 'scheduled';

export interface DashboardTask {
  id: string;
  description: string;
  status: TaskStatus;
  category: TaskCategory;
  assignee: string;
  dueDate: string;
}

export interface PeriodFinancials {
  label: string;
  revenue: number;
  expenses: number;
}

export interface LengthOfStay {
  average: number;
  distribution: {
    short: number;
    medium: number;
    long: number;
  };
}

export interface GuestSatisfaction {
  score: number;
  reviewCount: number;
}

export interface ExpenseCategory {
  label: string;
  amount: number;
}

export interface AmbientColors {
  canvas: string;
  accent: string;
  surface: string;
}

export interface GuestLogEntry {
  id: string;
  timestamp: string;
  type: 'arrival' | 'departure' | 'task_completed' | 'maintenance' | 'note';
  description: string;
  guestName?: string;
  nights?: number;
  assignee?: string;
}

export interface DashboardData {
  occupancy: number;
  occupancyPrev: number;
  occupancyHistory: number[];
  arrivalsToday: GuestEvent[];
  departuresToday: GuestEvent[];
  arrivalsTomorrow: GuestEvent[];
  departuresTomorrow: GuestEvent[];
  lengthOfStay: LengthOfStay;
  guestSatisfaction: GuestSatisfaction;
  tasks: DashboardTask[];
  periods: PeriodFinancials[];
  expenseBreakdown: ExpenseCategory[];
  ambientColors: AmbientColors;
  revenueHistory: number[];
  budgetTarget: number;
  guestLog: GuestLogEntry[];
}

const mockData: Record<string, DashboardData> = {
  'casa-palmeras': {
    occupancy: 78,
    occupancyPrev: 74,
    occupancyHistory: [68, 71, 73, 74, 76, 78],
    arrivalsToday: [
      { id: 'a1', name: 'Elena Rosenthal', nights: 5 },
      { id: 'a2', name: 'Marco & Lucia Ferrara', nights: 3 },
    ],
    departuresToday: [
      { id: 'd1', name: 'James Whitfield', nights: 7 },
    ],
    arrivalsTomorrow: [{ id: 'a3', name: 'Camille Devereux', nights: 4 }],
    departuresTomorrow: [{ id: 'd2', name: 'Sofía Méndez', nights: 4 }],
    lengthOfStay: { average: 4.2, distribution: { short: 35, medium: 45, long: 20 } },
    guestSatisfaction: { score: 4.8, reviewCount: 47 },
    tasks: [
      { id: 't1', description: 'Replace pool filter cartridge', status: 'urgent', category: 'maintenance', assignee: 'Carlos', dueDate: '2026-06-05' },
      { id: 't2', description: 'AC unit inspection — unit 2', status: 'pending', category: 'maintenance', assignee: 'Miguel', dueDate: '2026-06-10' },
      { id: 't3', description: 'Touch-up paint on terrace railing', status: 'scheduled', category: 'maintenance', assignee: 'Carlos', dueDate: '2026-06-20' },
    ],
    periods: [
      { label: 'June 2026', revenue: 12400, expenses: 3200 },
      { label: 'May 2026', revenue: 10800, expenses: 2950 },
      { label: 'April 2026', revenue: 9600, expenses: 2800 },
      { label: 'March 2026', revenue: 11200, expenses: 3100 },
      { label: 'February 2026', revenue: 8900, expenses: 2600 },
      { label: 'January 2026', revenue: 10100, expenses: 2750 },
    ],
    expenseBreakdown: [
      { label: 'Maintenance', amount: 1200 },
      { label: 'Utilities', amount: 850 },
      { label: 'Staff', amount: 680 },
      { label: 'Supplies', amount: 320 },
      { label: 'Other', amount: 150 },
    ],
    ambientColors: {
      canvas: '#faf6f0',
      accent: '#d4a76a',
      surface: '#fdf8f2',
    },
    revenueHistory: [10100, 8900, 11200, 9600, 10800, 12400],
    budgetTarget: 15000,
    guestLog: [
      { id: 'g1', timestamp: '2026-06-07T15:14:00', type: 'arrival', description: 'Elena Rosenthal checked in', guestName: 'Elena Rosenthal', nights: 5 },
      { id: 'g2', timestamp: '2026-06-07T15:14:00', type: 'arrival', description: 'Marco & Lucia Ferrara checked in', guestName: 'Marco & Lucia Ferrara', nights: 3 },
      { id: 'g3', timestamp: '2026-06-07T11:00:00', type: 'task_completed', description: 'Pool filter cartridge replaced', assignee: 'Carlos' },
    ],
  },
  'villa-luna': {
    occupancy: 92,
    occupancyPrev: 88,
    occupancyHistory: [82, 85, 87, 88, 90, 92],
    arrivalsToday: [{ id: 'a1', name: 'Valentina Cruz', nights: 6 }],
    departuresToday: [],
    arrivalsTomorrow: [],
    departuresTomorrow: [{ id: 'd1', name: 'Henrik Larsen', nights: 5 }],
    lengthOfStay: { average: 5.6, distribution: { short: 20, medium: 50, long: 30 } },
    guestSatisfaction: { score: 4.9, reviewCount: 63 },
    tasks: [
      { id: 't1', description: 'Restock amenity kit — master suite', status: 'urgent', category: 'amenities', assignee: 'Ana', dueDate: '2026-06-07' },
      { id: 't2', description: 'Garden irrigation check', status: 'scheduled', category: 'maintenance', assignee: 'Carlos', dueDate: '2026-06-15' },
    ],
    periods: [
      { label: 'June 2026', revenue: 9800, expenses: 2100 },
      { label: 'May 2026', revenue: 11200, expenses: 2400 },
      { label: 'April 2026', revenue: 8900, expenses: 1950 },
      { label: 'March 2026', revenue: 10500, expenses: 2200 },
      { label: 'February 2026', revenue: 8200, expenses: 1800 },
      { label: 'January 2026', revenue: 9400, expenses: 2050 },
    ],
    expenseBreakdown: [
      { label: 'Maintenance', amount: 680 },
      { label: 'Utilities', amount: 520 },
      { label: 'Staff', amount: 480 },
      { label: 'Supplies', amount: 280 },
      { label: 'Other', amount: 140 },
    ],
    ambientColors: {
      canvas: '#f5f8f5',
      accent: '#5a8a7a',
      surface: '#f0f5f2',
    },
    revenueHistory: [9400, 8200, 10500, 8900, 11200, 9800],
    budgetTarget: 12000,
    guestLog: [
      { id: 'g1', timestamp: '2026-06-07T16:00:00', type: 'arrival', description: 'Valentina Cruz checked in', guestName: 'Valentina Cruz', nights: 6 },
    ],
  },
  'casa-sol': {
    occupancy: 65,
    occupancyPrev: 72,
    occupancyHistory: [78, 76, 74, 72, 68, 65],
    arrivalsToday: [],
    departuresToday: [{ id: 'd1', name: 'The Okafor Family', nights: 10 }],
    arrivalsTomorrow: [{ id: 'a1', name: 'Rebecca & Tom Harrington', nights: 7 }],
    departuresTomorrow: [],
    lengthOfStay: { average: 6.1, distribution: { short: 15, medium: 40, long: 45 } },
    guestSatisfaction: { score: 4.7, reviewCount: 38 },
    tasks: [
      { id: 't1', description: 'Dock safety inspection due', status: 'urgent', category: 'inspection', assignee: 'Miguel', dueDate: '2026-06-06' },
      { id: 't2', description: 'Deep clean — beach-level terrace', status: 'pending', category: 'housekeeping', assignee: 'Ana', dueDate: '2026-06-12' },
      { id: 't3', description: 'Replace outdoor shower head', status: 'pending', category: 'maintenance', assignee: 'Carlos', dueDate: '2026-06-14' },
      { id: 't4', description: 'Refill propane for grill', status: 'scheduled', category: 'amenities', assignee: 'Ana', dueDate: '2026-06-18' },
    ],
    periods: [
      { label: 'June 2026', revenue: 18200, expenses: 4800 },
      { label: 'May 2026', revenue: 15600, expenses: 4200 },
      { label: 'April 2026', revenue: 14100, expenses: 3900 },
      { label: 'March 2026', revenue: 16800, expenses: 4500 },
      { label: 'February 2026', revenue: 12400, expenses: 3600 },
      { label: 'January 2026', revenue: 14900, expenses: 4100 },
    ],
    expenseBreakdown: [
      { label: 'Maintenance', amount: 1800 },
      { label: 'Utilities', amount: 1200 },
      { label: 'Staff', amount: 950 },
      { label: 'Supplies', amount: 520 },
      { label: 'Other', amount: 330 },
    ],
    ambientColors: {
      canvas: '#f8f5f0',
      accent: '#b8a07a',
      surface: '#f5f0e8',
    },
    revenueHistory: [14900, 12400, 16800, 14100, 15600, 18200],
    budgetTarget: 20000,
    guestLog: [
      { id: 'g1', timestamp: '2026-06-07T10:30:00', type: 'departure', description: 'The Okafor Family checked out', guestName: 'The Okafor Family', nights: 10 },
      { id: 'g2', timestamp: '2026-06-07T09:00:00', type: 'task_completed', description: 'Dock safety inspection completed', assignee: 'Miguel' },
    ],
  },
  'vista-al-mar': {
    occupancy: 85,
    occupancyPrev: 82,
    occupancyHistory: [75, 78, 80, 82, 83, 85],
    arrivalsToday: [{ id: 'a1', name: 'Isabelle & Jean-Paul Moreau', nights: 9 }],
    departuresToday: [{ id: 'd1', name: 'Dr. Amara Nwosu', nights: 4 }],
    arrivalsTomorrow: [],
    departuresTomorrow: [],
    lengthOfStay: { average: 5.1, distribution: { short: 25, medium: 50, long: 25 } },
    guestSatisfaction: { score: 4.8, reviewCount: 82 },
    tasks: [
      { id: 't1', description: 'Sunset terrace lighting repair', status: 'urgent', category: 'maintenance', assignee: 'Miguel', dueDate: '2026-06-08' },
      { id: 't2', description: 'Guest welcome basket preparation', status: 'pending', category: 'amenities', assignee: 'Ana', dueDate: '2026-06-09' },
    ],
    periods: [
      { label: 'June 2026', revenue: 21500, expenses: 5600 },
      { label: 'May 2026', revenue: 19800, expenses: 5200 },
      { label: 'April 2026', revenue: 17400, expenses: 4700 },
      { label: 'March 2026', revenue: 20100, expenses: 5400 },
      { label: 'February 2026', revenue: 15600, expenses: 4300 },
      { label: 'January 2026', revenue: 18200, expenses: 4900 },
    ],
    expenseBreakdown: [
      { label: 'Maintenance', amount: 2100 },
      { label: 'Utilities', amount: 1400 },
      { label: 'Staff', amount: 1100 },
      { label: 'Supplies', amount: 620 },
      { label: 'Other', amount: 380 },
    ],
    ambientColors: {
      canvas: '#f0f5f8',
      accent: '#6a8a9a',
      surface: '#e8f0f5',
    },
    revenueHistory: [18200, 15600, 20100, 17400, 19800, 21500],
    budgetTarget: 25000,
    guestLog: [
      { id: 'g1', timestamp: '2026-06-07T14:00:00', type: 'arrival', description: 'Isabelle & Jean-Paul Moreau checked in', guestName: 'Isabelle & Jean-Paul Moreau', nights: 9 },
      { id: 'g2', timestamp: '2026-06-07T11:00:00', type: 'departure', description: 'Dr. Amara Nwosu checked out', guestName: 'Dr. Amara Nwosu', nights: 4 },
    ],
  },
  'casa-brisa': {
    occupancy: 71,
    occupancyPrev: 68,
    occupancyHistory: [60, 63, 65, 68, 70, 71],
    arrivalsToday: [],
    departuresToday: [{ id: 'd1', name: 'Lucas Mendes', nights: 3 }],
    arrivalsTomorrow: [{ id: 'a1', name: 'Priya Sharma', nights: 5 }],
    departuresTomorrow: [],
    lengthOfStay: { average: 3.8, distribution: { short: 50, medium: 35, long: 15 } },
    guestSatisfaction: { score: 4.6, reviewCount: 29 },
    tasks: [
      { id: 't1', description: 'Replace bedroom ceiling fan', status: 'pending', category: 'maintenance', assignee: 'Carlos', dueDate: '2026-06-11' },
    ],
    periods: [
      { label: 'June 2026', revenue: 6100, expenses: 1400 },
      { label: 'May 2026', revenue: 5800, expenses: 1350 },
      { label: 'April 2026', revenue: 5200, expenses: 1200 },
      { label: 'March 2026', revenue: 5900, expenses: 1380 },
      { label: 'February 2026', revenue: 4800, expenses: 1100 },
      { label: 'January 2026', revenue: 5500, expenses: 1250 },
    ],
    expenseBreakdown: [
      { label: 'Maintenance', amount: 480 },
      { label: 'Utilities', amount: 380 },
      { label: 'Staff', amount: 300 },
      { label: 'Supplies', amount: 150 },
      { label: 'Other', amount: 90 },
    ],
    ambientColors: {
      canvas: '#f8f8f5',
      accent: '#8a8a7a',
      surface: '#f2f2e8',
    },
    revenueHistory: [5500, 4800, 5900, 5200, 5800, 6100],
    budgetTarget: 8000,
    guestLog: [
      { id: 'g1', timestamp: '2026-06-07T12:00:00', type: 'departure', description: 'Lucas Mendes checked out', guestName: 'Lucas Mendes', nights: 3 },
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

export function formatTrendPercent(current: number, previous: number): string {
  if (previous === 0) return '+0%';
  const pct = ((current - previous) / previous) * 100;
  const sign = pct >= 0 ? '+' : '';
  return `${sign}${pct.toFixed(0)}%`;
}

export function getTrendDirection(current: number, previous: number): 'up' | 'down' | 'stable' {
  const diff = current - previous;
  if (Math.abs(diff) < 1) return 'stable';
  return diff > 0 ? 'up' : 'down';
}

export const categoryLabels: Record<TaskCategory, string> = {
  maintenance: 'Maintenance',
  housekeeping: 'Housekeeping',
  amenities: 'Amenities',
  inspection: 'Inspection',
};

export function formatDueDate(dateStr: string): string {
  const today = new Date('2026-06-07');
  const due = new Date(dateStr + 'T00:00:00');
  const diffDays = Math.round((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays < 0) return `${Math.abs(diffDays)}d overdue`;
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays <= 6) return `${diffDays}d`;
  return due.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
