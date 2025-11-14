'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Genre } from '@/types/tmdb';

export default function CategoriesPage() {
  const [activeTab, setActiveTab] = useState<'movie' | 'tv'>('movie');
  const [movieGenres, setMovieGenres] = useState<Genre[]>([]);
  const [tvGenres, setTvGenres] = useState<Genre[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadGenres();
  }, []);

  const loadGenres = async () => {
    setIsLoading(true);
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
      setIsLoading(false);
    }
  };

  const currentGenres = activeTab === 'movie' ? movieGenres : tvGenres;

  return (
    <div className="min-h-screen pt-16">
      <div className="relative h-64 bg-gradient-to-b from-zinc-900 via-zinc-900/50 to-zinc-950 flex items-center">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-red-900/20 via-zinc-900/50 to-zinc-950" />

        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            Kategoriler
          </h1>
          <p className="text-xl text-zinc-400">
            İlginizi çeken kategoriye göre film ve dizileri keşfedin
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab('movie')}
            className={`relative px-8 py-4 rounded-xl font-semibold text-lg transition-all ${
              activeTab === 'movie'
                ? 'bg-red-600 text-white shadow-lg shadow-red-600/50'
                : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white'
            }`}
          >
            <span className="flex items-center gap-2">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
              </svg>
              Filmler
            </span>
          </button>

          <button
            onClick={() => setActiveTab('tv')}
            className={`relative px-8 py-4 rounded-xl font-semibold text-lg transition-all ${
              activeTab === 'tv'
                ? 'bg-red-600 text-white shadow-lg shadow-red-600/50'
                : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white'
            }`}
          >
            <span className="flex items-center gap-2">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
              </svg>
              Diziler
            </span>
          </button>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
          </div>
        ) : currentGenres.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-zinc-400">Kategoriler yüklenemedi</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {currentGenres.map((genre) => (
              <Link
                key={genre.id}
                href={`/categories/${activeTab}/${genre.id}`}
                className="group"
              >
                <div className="relative overflow-hidden rounded-xl bg-zinc-800/50 backdrop-blur-sm border border-zinc-700/50 p-6 h-32 flex items-center justify-center transition-all duration-300 hover:bg-zinc-700/50 hover:border-red-600/50 hover:scale-105 hover:shadow-xl hover:shadow-red-600/20">
                  <h3 className="text-lg font-semibold text-white text-center group-hover:text-red-400 transition-colors">
                    {genre.name}
                  </h3>

                  {/* Decorative elements */}
                  <div className="absolute top-0 right-0 w-20 h-20 bg-red-600/5 rounded-full blur-2xl group-hover:bg-red-600/10 transition-colors" />
                  <div className="absolute bottom-0 left-0 w-16 h-16 bg-red-600/5 rounded-full blur-xl group-hover:bg-red-600/10 transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
