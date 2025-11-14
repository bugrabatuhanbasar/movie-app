import { NextRequest, NextResponse } from 'next/server';
import { tmdbFetch } from '@/lib/tmdb';
import { TMDbResponse, Movie } from '@/types/tmdb';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  if (!id) {
    return NextResponse.json(
      { error: 'Movie ID is required' },
      { status: 400 }
    );
  }

  try {
    const data = await tmdbFetch<TMDbResponse<Movie>>({
      endpoint: `/movie/${id}/similar`,
      params: { page: 1 },
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching similar movies');
    return NextResponse.json(
      { error: 'Failed to fetch similar movies' },
      { status: 500 }
    );
  }
}
