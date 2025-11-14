import { NextRequest, NextResponse } from 'next/server';
import { tmdbFetch } from '@/lib/tmdb';
import { TMDbResponse, TVShow } from '@/types/tmdb';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json(
      { error: 'TV ID is required' },
      { status: 400 }
    );
  }

  try {
    const data = await tmdbFetch<TMDbResponse<TVShow>>({
      endpoint: `/tv/${id}/similar`,
      params: { page: 1 },
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching similar TV shows');
    return NextResponse.json(
      { error: 'Failed to fetch similar TV shows' },
      { status: 500 }
    );
  }
}
