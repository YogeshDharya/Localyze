export const ROLES = {
  USER: 'USER',
  SELLER: 'SELLER',
  ADMIN: 'ADMIN',
};

export const BOOKING_STATUSES = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
};

export const SERVICE_STATUSES = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  PENDING: 'PENDING',
  REJECTED: 'REJECTED',
};

export const PAYMENT_STATUSES = {
  CREATED: 'CREATED',
  PAID: 'PAID',
  FAILED: 'FAILED',
  REFUNDED: 'REFUNDED',
};

export const RADIUS_OPTIONS = [
  { label: '0.5 km', value: 0.5 },
  { label: '1 km', value: 1 },
  { label: '2 km', value: 2 },
  { label: '5 km', value: 5 },
  { label: '10 km', value: 10 },
];

export const PRICE_UNITS = [
  { label: 'Fixed', value: 'fixed' },
  { label: 'Per Hour', value: 'per_hour' },
  { label: 'Per Visit', value: 'per_visit' },
];

export const DEFAULT_CENTER = { lat: 18.5204, lng: 73.8567 }; // Pune, India

export const ITEMS_PER_PAGE = 12;

export const BOOKING_STATUS_COLORS = {
  PENDING: 'warning',
  CONFIRMED: 'info',
  IN_PROGRESS: 'info',
  COMPLETED: 'success',
  CANCELLED: 'error',
};

export const CATEGORY_ICONS = {
  'Plumber': '🔧',
  'Electrician': '⚡',
  'Carpenter': '🪚',
  'RO Service': '💧',
  'Tiffin Service': '🍱',
  'House Help': '🏠',
  'Laundry': '👔',
  'Tailor': '✂️',
  'Ration Shop': '🛒',
  'Painter': '🎨',
  'AC Service': '❄️',
  'Pest Control': '🐛',
  'Movers & Packers': '📦',
  'Tutor': '📚',
  'Beauty & Salon': '💇',
};
