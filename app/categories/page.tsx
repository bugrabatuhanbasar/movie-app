'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Genre, Movie, TVShow } from '@/types/tmdb';
import MovieCard from '@/components/MovieCard';

interface GenreWithContent {
  genre: Genre;
  content: (Movie | TVShow)[];
  isLoading: boolean;
}

export default function CategoriesPage() {
  const [activeTab, setActiveTab] = useState<'movie' | 'tv'>('movie');
  const [movieGenres, setMovieGenres] = useState<Genre[]>([]);
  const [tvGenres, setTvGenres] = useState<Genre[]>([]);
  const [genresWithContent, setGenresWithContent] = useState<GenreWithContent[]>([]);
  const [isLoadingGenres, setIsLoadingGenres] = useState(true);

  useEffect(() => {
    loadGenres();
  }, []);

  useEffect(() => {
    if (movieGenres.length > 0 || tvGenres.length > 0) {
      loadGenresContent();
    }
  }, [activeTab, movieGenres, tvGenres]);

  const loadGenres = async () => {
    setIsLoadingGenres(true);
    try {
      const [movieRes, tvRes] = await Promise.all([
        fetch('/api/tmdb/genres'),
        fetch('/api/tmdb/tv/genres'),
      ]);

      const movieData = await movieRes.json();
      const tvData = await tvRes.json();

      setMovieGenres(movieData.genres || []);
      setTvGenres(tvData.genres || []);
    } catch (error) {
      console.error('Error loading genres');
    } finally {
      setIsLoadingGenres(false);
    }
  };

  const loadGenresContent = async () => {
    const currentGenres = activeTab === 'movie' ? movieGenres : tvGenres;

    // Initialize with loading state
    const initialState: GenreWithContent[] = currentGenres.map(genre => ({
      genre,
      content: [],
      isLoading: true,
    }));
    setGenresWithContent(initialState);

    // Load content for each genre
    currentGenres.forEach(async (genre, index) => {
      try {
        const res = await fetch(`/api/tmdb/discover/${activeTab}?genre=${genre.id}&page=1`);
        const data = await res.json();

        setGenresWithContent(prev => {
          const newState = [...prev];
          newState[index] = {
            genre,
            content: data.results?.slice(0, 6) || [],
            isLoading: false,
          };
          return newState;
        });
      } catch (error) {
        console.error(`Error loading content for genre ${genre.name}`);
        setGenresWithContent(prev => {
          const newState = [...prev];
          newState[index] = {
            genre,
            content: [],
            isLoading: false,
          };
          return newState;
        });
      }
    });
  };

  return (
    <div className="min-h-screen pt-16">
      <div className="relative h-48 sm:h-56 md:h-64 bg-gradient-to-b from-zinc-900 via-zinc-900/50 to-zinc-950 flex items-center">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-red-900/20 via-zinc-900/50 to-zinc-950" />

        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-3 sm:mb-4">
            Kategoriler
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-zinc-400">
            İlginizi çeken kategoriye göre film ve dizileri keşfedin
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 sm:py-8">
        {/* Tabs */}
        <div className="flex gap-2 sm:gap-3 md:gap-4 mb-8 sm:mb-12 sticky top-16 sm:top-20 z-40 bg-zinc-950/95 backdrop-blur-md py-3 sm:py-4 -mx-4 px-4 border-b border-zinc-800/50">
          <button
            onClick={() => setActiveTab('movie')}
            className={`relative flex-1 sm:flex-none px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base md:text-lg transition-all ${
              activeTab === 'movie'
                ? 'bg-red-600 text-white shadow-lg shadow-red-600/50'
                : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white'
            }`}
          >
            <span className="flex items-center justify-center gap-1.5 sm:gap-2">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
              </svg>
              Filmler
            </span>
          </button>

          <button
            onClick={() => setActiveTab('tv')}
            className={`relative flex-1 sm:flex-none px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base md:text-lg transition-all ${
              activeTab === 'tv'
                ? 'bg-red-600 text-white shadow-lg shadow-red-600/50'
                : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white'
            }`}
          >
            <span className="flex items-center justify-center gap-1.5 sm:gap-2">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
              </svg>
              Diziler
            </span>
          </button>
        </div>

        {/* Content */}
        {isLoadingGenres ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
          </div>
        ) : genresWithContent.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-zinc-400">Kategoriler yüklenemedi</p>
          </div>
        ) : (
          <div className="space-y-8 sm:space-y-10 md:space-y-12">
            {genresWithContent.map(({ genre, content, isLoading }) => (
              <section key={genre.id} className="space-y-3 sm:space-y-4">
                {/* Genre Header */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-1 h-6 sm:h-8 bg-gradient-to-b from-red-600 to-red-500 rounded-full" />
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">{genre.name}</h2>
                  </div>
                  <Link
                    href={`/categories/${activeTab}/${genre.id}`}
                    className="px-3 py-1.5 sm:px-4 sm:py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg font-medium transition-colors flex items-center gap-1.5 sm:gap-2 group text-xs sm:text-sm"
                  >
                    <span className="hidden sm:inline">Tümünü Gör</span>
                    <span className="sm:hidden">Tümü</span>
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>

                {/* Content Grid */}
                {isLoading ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
                  </div>
                ) : content.length === 0 ? (
                  <div className="text-center py-12 text-zinc-500 text-sm sm:text-base">
                    Bu kategoride içerik bulunamadı
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
                    {content.map((item) => (
                      <MovieCard key={item.id} movie={item} mediaType={activeTab} />
                    ))}
                  </div>
                )}
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
