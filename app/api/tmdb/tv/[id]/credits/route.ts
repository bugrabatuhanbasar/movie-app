import { NextRequest, NextResponse } from 'next/server';
import { tmdbFetch } from '@/lib/tmdb';
import { Credits } from '@/types/tmdb';

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
    const data = await tmdbFetch<Credits>({
      endpoint: `/tv/${id}/credits`,
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching TV credits');
    return NextResponse.json(
      { error: 'Failed to fetch TV credits' },
      { status: 500 }
    );
  }
}
