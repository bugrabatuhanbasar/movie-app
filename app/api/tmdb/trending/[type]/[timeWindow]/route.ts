import { NextRequest, NextResponse } from 'next/server';
import { tmdbFetch } from '@/lib/tmdb';
import { TMDbResponse, Movie } from '@/types/tmdb';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ type: string; timeWindow: string }> }
) {
  const { type, timeWindow } = await params;

  if (!['movie', 'tv', 'all'].includes(type)) {
    return NextResponse.json(
      { error: 'Type must be "movie", "tv", or "all"' },
      { status: 400 }
    );
  }

  if (!['day', 'week'].includes(timeWindow)) {
    return NextResponse.json(
      { error: 'Time window must be "day" or "week"' },
      { status: 400 }
    );
  }

  try {
    const data = await tmdbFetch<TMDbResponse<Movie>>({
      endpoint: `/trending/${type}/${timeWindow}`,
      params: { page: 1 },
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching trending');
    return NextResponse.json(
      { error: 'Failed to fetch trending' },
      { status: 500 }
    );
  }
}
