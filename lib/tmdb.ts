// Server-side only - for TMDb API requests
const TMDB_BASE_URL = process.env.TMDB_BASE_URL || 'https://api.themoviedb.org/3';

interface FetchOptions {
  endpoint: string;
  params?: Record<string, string | number>;
}

export async function tmdbFetch<T>({ endpoint, params = {} }: FetchOptions): Promise<T> {
  const TMDB_API_KEY = process.env.TMDB_API_KEY;

  if (!TMDB_API_KEY) {
    throw new Error('TMDB_API_KEY is not defined in environment variables');
  }

  const url = new URL(`${TMDB_BASE_URL}${endpoint}`);

  // Add API key and default parameters
  url.searchParams.append('api_key', TMDB_API_KEY);
  url.searchParams.append('language', 'tr-TR');
  url.searchParams.append('region', 'TR');

  // Add additional parameters
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, String(value));
  });

  try {
    const response = await fetch(url.toString(), {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      throw new Error(`TMDb API error: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error('TMDb fetch error:', error);
    throw error;
  }
}

// Re-export client utilities for convenience
export { getImageUrl, getYear, formatRuntime } from './tmdb-client';
