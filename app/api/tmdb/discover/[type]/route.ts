import { NextRequest, NextResponse } from 'next/server';
import { tmdbFetch } from '@/lib/tmdb';
import { TMDbResponse, Movie } from '@/types/tmdb';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ type: string }> }
) {
  const { type } = await params;
  const searchParams = request.nextUrl.searchParams;
  const genreId = searchParams.get('genre');
  const page = searchParams.get('page') || '1';

  if (!genreId) {
    return NextResponse.json(
      { error: 'Genre ID is required' },
      { status: 400 }
    );
  }

  if (type !== 'movie' && type !== 'tv') {
    return NextResponse.json(
      { error: 'Type must be either "movie" or "tv"' },
      { status: 400 }
    );
  }

  try {
    const data = await tmdbFetch<TMDbResponse<Movie>>({
      endpoint: `/discover/${type}`,
      params: {
        with_genres: genreId,
        page: parseInt(page),
        sort_by: 'popularity.desc'
      },
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error(`Error discovering ${type}s by genre`);
    return NextResponse.json(
      { error: `Failed to discover ${type}s` },
      { status: 500 }
    );
  }
}
