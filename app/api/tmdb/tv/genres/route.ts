import { NextResponse } from 'next/server';
import { tmdbFetch } from '@/lib/tmdb';
import { Genre } from '@/types/tmdb';

interface GenresResponse {
  genres: Genre[];
}

export async function GET() {
  try {
    const data = await tmdbFetch<GenresResponse>({
      endpoint: '/genre/tv/list',
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching TV genres');
    return NextResponse.json(
      { error: 'Failed to fetch TV genres' },
      { status: 500 }
    );
  }
}
