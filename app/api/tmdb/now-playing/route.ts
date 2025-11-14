import { NextResponse } from 'next/server';
import { tmdbFetch } from '@/lib/tmdb';
import { TMDbResponse, Movie } from '@/types/tmdb';

export async function GET() {
  try {
    const data = await tmdbFetch<TMDbResponse<Movie>>({
      endpoint: '/movie/now_playing',
      params: { page: 1 },
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching now playing movies');
    return NextResponse.json(
      { error: 'Failed to fetch now playing movies' },
      { status: 500 }
    );
  }
}
