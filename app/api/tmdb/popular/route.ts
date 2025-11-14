import { NextResponse } from 'next/server';
import { tmdbFetch } from '@/lib/tmdb';
import { TMDbResponse, Movie } from '@/types/tmdb';

export async function GET() {
  try {
    const data = await tmdbFetch<TMDbResponse<Movie>>({
      endpoint: '/movie/popular',
      params: { page: 1 },
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching popular movies');
    return NextResponse.json(
      { error: 'Failed to fetch popular movies' },
      { status: 500 }
    );
  }
}
