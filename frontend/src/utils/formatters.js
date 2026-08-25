export const formatPrice = (price, unit) => {
  if (price == null) return '';
  const formattedPrice = `₹${price}`;
  if (!unit || unit === 'fixed') return `${formattedPrice} fixed`;
  if (unit === 'per_hour') return `${formattedPrice} / hr`;
  if (unit === 'per_visit') return `${formattedPrice} / visit`;
  if (unit === 'per_day') return `${formattedPrice} / day`;
  return `${formattedPrice} ${unit}`;
};

export const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

export const formatDateTime = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' });
};

export const truncate = (str, len = 100) => {
  if (!str) return '';
  if (str.length <= len) return str;
  return str.substring(0, len) + '...';
};

export const getInitials = (name) => {
  if (!name) return '';
  const parts = name.trim().split(' ').filter(Boolean);
  if (parts.length === 0) return '';
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
};
