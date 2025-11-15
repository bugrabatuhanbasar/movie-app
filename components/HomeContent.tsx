'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Movie } from '@/types/tmdb';
import { getImageUrl, getYear } from '@/lib/tmdb-client';
import MovieCard from './MovieCard';

interface BannerMovie {
  id: number;
  backdropPath: string | null;
  posterPath: string | null;
  title: string;
  overview: string;
  voteAverage: number;
  releaseDate: string;
  mediaType: 'movie' | 'tv';
}

interface HomeContentProps {
  trendingMovies: Movie[];
  popularMovies: Movie[];
  nowPlayingMovies: Movie[];
  topRatedMovies: Movie[];
  bannerMovies: BannerMovie[];
}

type TabType = 'trending' | 'popular' | 'nowPlaying' | 'topRated';

export default function HomeContent({
  trendingMovies,
  popularMovies,
  nowPlayingMovies,
  topRatedMovies,
  bannerMovies,
}: HomeContentProps) {
  const [activeTab, setActiveTab] = useState<TabType>('trending');
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  // Bottom banner - fixed on page load (doesn't auto-rotate)
  const [bottomBannerMovie] = useState(() =>
    bannerMovies.length > 0 ? bannerMovies[Math.floor(Math.random() * bannerMovies.length)] : null
  );

  // Auto-rotate banner every 8 seconds
  useEffect(() => {
    if (bannerMovies.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentBannerIndex((prev) => (prev + 1) % bannerMovies.length);
    }, 8000);

    return () => clearInterval(interval);
  }, [bannerMovies.length]);

  const tabs = [
    { id: 'trending' as const, label: 'Trendler', icon: '📈' },
    { id: 'popular' as const, label: 'Popüler', icon: '🔥' },
    { id: 'nowPlaying' as const, label: 'Gösterimdekiler', icon: '🎬' },
    { id: 'topRated' as const, label: 'En Yüksek Puan', icon: '⭐' },
  ];

  const getMoviesForTab = (tab: TabType): Movie[] => {
    switch (tab) {
      case 'trending':
        return trendingMovies;
      case 'popular':
        return popularMovies;
      case 'nowPlaying':
        return nowPlayingMovies;
      case 'topRated':
        return topRatedMovies;
      default:
        return [];
    }
  };

  const currentMovies = getMoviesForTab(activeTab);
  const currentBanner = bannerMovies[currentBannerIndex];

  return (
    <div className="min-h-screen">
      {/* Banner Section */}
      {currentBanner && (
        <div className="relative h-[500px] sm:h-[550px] md:h-[600px] w-full overflow-hidden">
          {/* Background */}
          {currentBanner.backdropPath && (
            <>
              <Image
                src={getImageUrl(currentBanner.backdropPath, 'original')}
                alt={currentBanner.title}
                fill
                priority
                className="object-cover transition-opacity duration-1000"
                key={currentBannerIndex}
              />
              {/* Gradient Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/90 via-zinc-950/40 to-transparent" />
            </>
          )}

          {/* Content */}
          <div className="relative h-full container mx-auto px-4 flex items-end pb-12 sm:pb-16 pt-20 sm:pt-24">
            <div className="flex flex-col md:flex-row gap-4 sm:gap-6 md:gap-8 items-end max-w-6xl w-full">
              {/* Poster */}
              {currentBanner.posterPath && (
                <div className="flex-shrink-0 hidden sm:block">
                  <div className="relative w-40 sm:w-48 md:w-56 aspect-[2/3] rounded-xl overflow-hidden shadow-2xl">
                    <Image
                      src={getImageUrl(currentBanner.posterPath, 'w500')}
                      alt={currentBanner.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              )}

              {/* Info */}
              <div className="flex-1 space-y-3 sm:space-y-4 pb-4">
                <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                  <span className="px-2 py-0.5 sm:px-3 sm:py-1 bg-red-600/20 border border-red-600/50 rounded-full text-red-400 text-xs sm:text-sm font-semibold">
                    18+
                  </span>
                  <span className="text-zinc-300 font-medium text-sm sm:text-base">{getYear(currentBanner.releaseDate)}</span>
                  {currentBanner.voteAverage > 0 && (
                    <div className="flex items-center gap-0.5 sm:gap-1">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-3 h-3 sm:w-4 sm:h-4 ${
                            i < Math.round(currentBanner.voteAverage / 2)
                              ? 'text-yellow-500'
                              : 'text-zinc-600'
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  )}
                </div>

                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
                  {currentBanner.title}
                </h1>

                <p className="text-sm sm:text-base text-zinc-300 line-clamp-2 sm:line-clamp-3 max-w-2xl drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                  {currentBanner.overview}
                </p>

                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2">
                  <Link
                    href={`/${currentBanner.mediaType}/${currentBanner.id}`}
                    className="px-6 py-2.5 sm:px-8 sm:py-3 bg-white hover:bg-zinc-200 text-black rounded-lg font-bold transition-all flex items-center justify-center gap-2 shadow-xl text-sm sm:text-base"
                  >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                    </svg>
                    İzle
                  </Link>
                  <button className="px-4 py-2.5 sm:px-6 sm:py-3 bg-zinc-800/80 hover:bg-zinc-700 backdrop-blur-sm text-white rounded-lg font-medium transition-all flex items-center justify-center gap-2 text-sm sm:text-base">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Listem
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Banner Indicators */}
          {bannerMovies.length > 1 && (
            <div className="absolute bottom-6 right-6 flex gap-2">
              {bannerMovies.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentBannerIndex(index)}
                  className={`h-1 rounded-full transition-all ${
                    index === currentBannerIndex
                      ? 'w-8 bg-white'
                      : 'w-4 bg-white/40 hover:bg-white/60'
                  }`}
                  aria-label={`Banner ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tabs Section */}
      <div className="container mx-auto px-4 py-12">
        {/* Tabs */}
        <div className="flex gap-6 mb-8 overflow-x-auto scrollbar-hide pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative px-6 py-3 rounded-xl font-semibold whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'text-white'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <span className="flex items-center gap-2">
                <span className="text-xl">{tab.icon}</span>
                {tab.label}
              </span>
              {activeTab === tab.id && (
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-2 h-2 bg-red-600 rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* Movies Grid - 3 rows */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {currentMovies.slice(0, 18).map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>

        {/* View All Link */}
        <div className="flex justify-center mt-8">
          <Link
            href="/categories"
            className="px-8 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl font-semibold transition-all flex items-center gap-2 group"
          >
            Tümünü Gör
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Bottom Banner - Before Footer */}
      {bottomBannerMovie && (
        <div className="container mx-auto px-4 mb-0">
          <BottomBanner movie={bottomBannerMovie} />
        </div>
      )}
    </div>
  );
}

// Bottom Banner Component
function BottomBanner({ movie }: { movie: BannerMovie }) {
  const [isInWatchlist, setIsInWatchlist] = useState(false);

  useEffect(() => {
    checkWatchlist();
  }, [movie.id]);

  const checkWatchlist = () => {
    if (typeof window !== 'undefined') {
      const watchlist = JSON.parse(localStorage.getItem('watchlist') || '[]');
      setIsInWatchlist(watchlist.some((item: any) => item.id === movie.id));
    }
  };

  const toggleWatchlist = () => {
    if (typeof window !== 'undefined') {
      const watchlist = JSON.parse(localStorage.getItem('watchlist') || '[]');

      if (isInWatchlist) {
        const updated = watchlist.filter((item: any) => item.id !== movie.id);
        localStorage.setItem('watchlist', JSON.stringify(updated));
        setIsInWatchlist(false);
      } else {
        watchlist.push({
          id: movie.id,
          title: movie.title,
          poster_path: movie.posterPath,
          vote_average: movie.voteAverage,
          release_date: movie.releaseDate,
        });
        localStorage.setItem('watchlist', JSON.stringify(watchlist));
        setIsInWatchlist(true);
      }
    }
  };

  return (
    <div className="relative h-[250px] sm:h-[280px] md:h-[300px] rounded-2xl overflow-hidden group">
      {/* Background */}
      {movie.backdropPath && (
        <>
          <Image
            src={getImageUrl(movie.backdropPath, 'original')}
            alt={movie.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
        </>
      )}

      {/* Content */}
      <div className="relative h-full flex items-center">
        <div className="px-4 sm:px-6 md:px-8 lg:px-12 space-y-2 sm:space-y-3 md:space-y-4 max-w-2xl">
          {/* Meta Info */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap text-xs sm:text-sm">
            <span className="px-2 py-0.5 sm:px-3 sm:py-1 bg-red-600 rounded text-white text-xs sm:text-sm font-bold">
              18+
            </span>
            <span className="text-zinc-300 font-medium">{getYear(movie.releaseDate)}</span>
            <span className="text-zinc-400 hidden sm:inline">•</span>
            <span className="text-zinc-300 hidden sm:inline">2 Sezon</span>
            {movie.voteAverage > 0 && (
              <>
                <span className="text-zinc-400 hidden md:inline">•</span>
                <div className="flex items-center gap-0.5 sm:gap-1">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-3 h-3 sm:w-4 sm:h-4 ${
                        i < Math.round(movie.voteAverage / 2)
                          ? 'text-yellow-500'
                          : 'text-zinc-600'
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Title */}
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white drop-shadow-lg">
            {movie.title}
          </h2>

          {/* Description */}
          <p className="text-zinc-300 text-xs sm:text-sm line-clamp-2 max-w-xl drop-shadow-lg hidden sm:block">
            {movie.overview}
          </p>

          {/* Tab - Only Bilgiler */}
          <div className="flex gap-4 text-xs sm:text-sm hidden md:flex">
            <span className="text-white font-medium border-b-2 border-white pb-1">
              Bilgiler
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-1 sm:pt-2">
            <Link
              href={`/${movie.mediaType}/${movie.id}`}
              className="px-4 py-2 sm:px-6 sm:py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all flex items-center justify-center gap-2 shadow-lg text-xs sm:text-sm"
            >
              <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
              </svg>
              İzle
            </Link>
            <button
              onClick={toggleWatchlist}
              className={`px-4 py-2 sm:px-6 sm:py-2.5 backdrop-blur-sm text-white rounded-lg font-semibold transition-all flex items-center justify-center gap-2 text-xs sm:text-sm ${
                isInWatchlist
                  ? 'bg-red-600/80 hover:bg-red-700'
                  : 'bg-zinc-800/80 hover:bg-zinc-700'
              }`}
            >
              {isInWatchlist ? (
                <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              )}
              Listem
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
