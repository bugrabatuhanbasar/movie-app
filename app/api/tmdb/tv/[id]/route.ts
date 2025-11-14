import { NextRequest, NextResponse } from 'next/server';
import { tmdbFetch } from '@/lib/tmdb';
import { TVShowDetails } from '@/types/tmdb';

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
    const data = await tmdbFetch<TVShowDetails>({
      endpoint: `/tv/${id}`,
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching TV details');
    return NextResponse.json(
      { error: 'Failed to fetch TV details' },
      { status: 500 }
    );
  }
}
