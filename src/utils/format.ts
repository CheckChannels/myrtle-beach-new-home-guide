export function formatPrice(price: number | undefined, label?: string): string {
  if (!price) return label || 'Price TBD';
  return `Estimated from $${price.toLocaleString()}`;
}

export function formatPriceShort(price: number): string {
  if (price >= 1000000) return `$${(price / 1000000).toFixed(1)}M`;
  if (price >= 1000) return `$${Math.round(price / 1000)}K`;
  return `$${price.toLocaleString()}`;
}

export function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  } catch {
    return dateStr;
  }
}

export function getBedBathLabel(
  minBeds?: number,
  maxBeds?: number,
  minBaths?: number,
  maxBaths?: number
): string {
  const beds = minBeds === maxBeds ? `${minBeds}` : `${minBeds}–${maxBeds}`;
  const baths = minBaths === maxBaths ? `${minBaths}` : `${minBaths}–${maxBaths}`;
  const parts = [];
  if (minBeds) parts.push(`${beds} bd`);
  if (minBaths) parts.push(`${baths} ba`);
  return parts.join(' · ');
}

export function getSqftLabel(min?: number, max?: number): string {
  if (!min && !max) return '';
  if (min === max) return `${min?.toLocaleString()} sq ft`;
  return `${min?.toLocaleString()}–${max?.toLocaleString()} sq ft`;
}
