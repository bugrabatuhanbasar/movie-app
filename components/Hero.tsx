'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getImageUrl } from '@/lib/tmdb-client';

interface HeroProps {
  movie: {
    id: number;
    backdropPath: string | null;
    title: string;
    overview: string;
    voteAverage: number;
    releaseDate: string;
    mediaType: 'movie' | 'tv';
  };
}

export default function Hero({ movie }: HeroProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const year = movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : '';

  return (
    <div className="relative h-[600px] sm:h-[700px] md:h-[800px] w-full overflow-hidden">
      {/* Background Image */}
      {movie.backdropPath && (
        <>
          <Image
            src={getImageUrl(movie.backdropPath, 'original')}
            alt={movie.title}
            fill
            priority
            className="object-cover"
          />
          {/* Multi-layer Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/70 to-zinc-950/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/95 via-zinc-950/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-zinc-950" />
        </>
      )}

      {/* Content */}
      <div className="relative h-full container mx-auto px-4 flex flex-col justify-center pt-16 sm:pt-20">
        <div className="max-w-3xl space-y-4 sm:space-y-6 md:space-y-8">
          {/* Badge */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <span className="px-3 py-1.5 sm:px-4 sm:py-2 bg-red-600/90 backdrop-blur-sm rounded-full text-white font-semibold text-xs sm:text-sm uppercase shadow-lg">
              {movie.mediaType === 'tv' ? 'Popüler Dizi' : 'Popüler Film'}
            </span>
            {movie.voteAverage > 0 && (
              <div className="flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-yellow-500/20 backdrop-blur-sm rounded-full border border-yellow-500/30">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-yellow-500 font-bold text-sm sm:text-base">{movie.voteAverage.toFixed(1)}</span>
              </div>
            )}
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-white leading-tight drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
            {movie.title}
          </h1>

          {/* Meta Info */}
          {year && (
            <p className="text-lg sm:text-xl text-zinc-300 font-medium drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
              {year}
            </p>
          )}

          {/* Overview */}
          {movie.overview && (
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-zinc-200 leading-relaxed line-clamp-2 sm:line-clamp-3 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] max-w-2xl">
              {movie.overview}
            </p>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Link
              href={`/${movie.mediaType}/${movie.id}`}
              className="group relative px-6 py-3 sm:px-8 sm:py-4 bg-red-600 hover:bg-red-700 rounded-xl font-bold text-white text-base sm:text-lg shadow-xl shadow-red-600/50 transition-all hover:scale-105 flex items-center justify-center gap-2 sm:gap-3"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
              </svg>
              Detayları Gör
            </Link>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="relative flex-1 min-w-full sm:min-w-[250px]">
              <input
                type="text"
                placeholder="Film, dizi ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 sm:px-6 sm:py-4 pr-12 sm:pr-14 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all shadow-xl text-sm sm:text-base"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-2 sm:px-4 sm:py-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg font-medium transition-colors flex items-center gap-1 sm:gap-2"
                aria-label="Search"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <svg className="w-6 h-6 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </div>
  );
}
