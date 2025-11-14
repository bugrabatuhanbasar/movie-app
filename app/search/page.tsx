'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Movie } from '@/types/tmdb';
import MovieGrid from '@/components/MovieGrid';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [query, setQuery] = useState(initialQuery);
  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (searchTerm) {
      searchMovies(searchTerm);
    }
  }, [searchTerm]);

  const searchMovies = async (term: string) => {
    if (!term.trim()) {
      setMovies([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/tmdb/search?query=${encodeURIComponent(term)}`);

      if (!response.ok) {
        throw new Error('Arama sırasında bir hata oluştu');
      }

      const data = await response.json();
      setMovies(data.results || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu');
      setMovies([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchTerm(query);
  };

  return (
    <div className="min-h-screen">
      <div className="bg-zinc-900 border-b border-zinc-800">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Film Ara
          </h1>

          <form onSubmit={handleSubmit} className="relative max-w-2xl">
            <input
              type="text"
              placeholder="Film adı girin..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full px-6 py-4 rounded-lg bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
            >
              Ara
            </button>
          </form>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-900/20 border border-red-900 rounded-lg p-6 text-center">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {!isLoading && !error && searchTerm && movies.length === 0 && (
          <div className="text-center py-20">
            <p className="text-xl text-zinc-400">
              &quot;{searchTerm}&quot; için sonuç bulunamadı.
            </p>
          </div>
        )}

        {!isLoading && !error && !searchTerm && (
          <div className="text-center py-20">
            <p className="text-xl text-zinc-400">
              Arama yapmak için bir kelime yazın
            </p>
          </div>
        )}

        {!isLoading && !error && movies.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-zinc-300">
              {movies.length} sonuç bulundu
            </h2>
            <MovieGrid movies={movies} />
          </div>
        )}
      </div>
    </div>
  );
}
