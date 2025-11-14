import { NextRequest, NextResponse } from 'next/server';
import { tmdbFetch } from '@/lib/tmdb';
import { Credits } from '@/types/tmdb';

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
    const data = await tmdbFetch<Credits>({
      endpoint: `/movie/${id}/credits`,
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching movie credits');
    return NextResponse.json(
      { error: 'Failed to fetch movie credits' },
      { status: 500 }
    );
  }
}
