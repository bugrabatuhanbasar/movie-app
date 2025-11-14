// Client-side utilities (no API key needed)

export const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

export function getImageUrl(path: string | null, size: string = 'w500'): string {
  if (!path) {
    return '/placeholder.jpg'; // You can add a placeholder image
  }
  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
}

export function getYear(dateString: string): string {
  if (!dateString) return '';
  return new Date(dateString).getFullYear().toString();
}

export function formatRuntime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}s ${mins}dk`;
}
