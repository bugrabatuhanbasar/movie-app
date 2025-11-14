import { NextRequest, NextResponse } from 'next/server';
import { tmdbFetch } from '@/lib/tmdb';
import { VideosResponse } from '@/types/tmdb';

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
    // Fetch videos without language filter to get all available trailers
    const data = await tmdbFetch<VideosResponse>({
      endpoint: `/tv/${id}/videos`,
      params: {
        include_video_language: 'en,tr,null'  // Include English, Turkish and no language
      },
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching TV videos');
    return NextResponse.json(
      { error: 'Failed to fetch TV videos' },
      { status: 500 }
    );
  }
}
