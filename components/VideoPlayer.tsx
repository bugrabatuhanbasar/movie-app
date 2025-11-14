'use client';

import { useState, useEffect } from 'react';
import { Video } from '@/types/tmdb';

interface VideoPlayerProps {
  movieId: number;
  type?: 'movie' | 'tv';
}

export default function VideoPlayer({ movieId, type = 'movie' }: VideoPlayerProps) {
  const [videos, setVideos] = useState<Video[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showPlayer, setShowPlayer] = useState(false);

  useEffect(() => {
    loadVideos();
  }, [movieId, type]);

  const loadVideos = async () => {
    setIsLoading(true);
    try {
      const endpoint = type === 'movie'
        ? `/api/tmdb/movie/${movieId}/videos`
        : `/api/tmdb/tv/${movieId}/videos`;

      const res = await fetch(endpoint);
      const data = await res.json();

      // Filter for YouTube videos - prioritize trailers but include all types
      const allYoutubeVideos = (data.results || []).filter(
        (v: Video) => v.site === 'YouTube'
      );

      // Sort by type priority: Trailer > Teaser > Clip > others
      const sortedVideos = allYoutubeVideos.sort((a, b) => {
        const priority: { [key: string]: number } = {
          'Trailer': 1,
          'Teaser': 2,
          'Clip': 3,
        };
        return (priority[a.type] || 999) - (priority[b.type] || 999);
      });

      setVideos(sortedVideos);

      // Auto-select first video
      if (sortedVideos.length > 0) {
        setSelectedVideo(sortedVideos[0]);
      }
    } catch (error) {
      console.error('Error loading videos');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (videos.length === 0) {
    return null;
  }

  return (
    <section>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-1 h-8 bg-gradient-to-b from-red-600 to-red-500 rounded-full" />
        <h2 className="text-3xl font-bold text-white">Fragmanlar</h2>
      </div>

      <div className="space-y-4">
        {/* Video Player */}
        {selectedVideo && showPlayer && (
          <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden shadow-2xl">
            <iframe
              src={`https://www.youtube.com/embed/${selectedVideo.key}?autoplay=1`}
              title={selectedVideo.name}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
          </div>
        )}

        {/* Thumbnail Preview (when not playing) */}
        {selectedVideo && !showPlayer && (
          <div
            className="relative w-full aspect-video bg-zinc-900 rounded-xl overflow-hidden shadow-2xl cursor-pointer group"
            onClick={() => setShowPlayer(true)}
          >
            <img
              src={`https://img.youtube.com/vi/${selectedVideo.key}/maxresdefault.jpg`}
              alt={selectedVideo.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback to hqdefault if maxresdefault doesn't exist
                e.currentTarget.src = `https://img.youtube.com/vi/${selectedVideo.key}/hqdefault.jpg`;
              }}
            />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
              <div className="w-20 h-20 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center transition-all group-hover:scale-110 shadow-xl">
                <svg className="w-10 h-10 text-white ml-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                </svg>
              </div>
            </div>
          </div>
        )}

        {/* Video List */}
        {videos.length > 1 && (
          <div className="relative">
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
              {videos.map((video) => (
                <div
                  key={video.id}
                  onClick={() => {
                    setSelectedVideo(video);
                    setShowPlayer(false);
                  }}
                  className={`flex-shrink-0 w-64 snap-start cursor-pointer group ${
                    selectedVideo?.id === video.id ? 'ring-2 ring-red-600 rounded-lg' : ''
                  }`}
                >
                  <div className="relative aspect-video bg-zinc-800 rounded-lg overflow-hidden">
                    <img
                      src={`https://img.youtube.com/vi/${video.key}/mqdefault.jpg`}
                      alt={video.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                      <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-black ml-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-white font-medium line-clamp-2">
                    {video.name}
                  </p>
                  <p className="text-xs text-zinc-500">{video.type}</p>
                </div>
              ))}
            </div>

            {/* Scroll Indicators */}
            <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-zinc-950 to-transparent pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-zinc-950 to-transparent pointer-events-none" />
          </div>
        )}
      </div>
    </section>
  );
}
