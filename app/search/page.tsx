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
    <div className="min-h-screen pt-20">
      {/* Hero Search Section */}
      <div className="relative bg-gradient-to-b from-zinc-900 via-zinc-900/80 to-zinc-950 border-b border-zinc-800/50 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-red-900/20 via-zinc-900/50 to-zinc-950" />

        <div className="relative container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl font-black text-white">
                Arama
              </h1>
              <p className="text-xl text-zinc-400">
                Binlerce film ve dizi arasından arayın
              </p>
            </div>

            <form onSubmit={handleSubmit} className="relative">
              <div className="relative group">
                <input
                  type="text"
                  placeholder="Film veya dizi adı girin..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full px-6 py-5 pl-14 rounded-2xl bg-zinc-800/50 backdrop-blur-sm border-2 border-zinc-700/50 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 transition-all text-lg group-hover:border-zinc-600"
                />
                <svg className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-8 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold transition-all hover:scale-105 shadow-lg shadow-red-600/50"
                >
                  Ara
                </button>
              </div>
            </form>

            {searchTerm && (
              <div className="inline-block px-6 py-2 bg-zinc-800/50 backdrop-blur-sm rounded-full border border-zinc-700/50">
                <span className="text-zinc-400">Arama: </span>
                <span className="text-white font-semibold">&quot;{searchTerm}&quot;</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="container mx-auto px-4 py-12">
        {isLoading && (
          <div className="flex flex-col justify-center items-center py-20 space-y-4">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-red-600"></div>
            <p className="text-zinc-400 animate-pulse">Aranıyor...</p>
          </div>
        )}

        {error && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-red-900/20 backdrop-blur-sm border border-red-900/50 rounded-2xl p-8 text-center">
              <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-400 text-lg">{error}</p>
            </div>
          </div>
        )}

        {!isLoading && !error && searchTerm && movies.length === 0 && (
          <div className="text-center py-20">
            <svg className="w-24 h-24 text-zinc-700 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-2xl font-bold text-white mb-2">
              Sonuç Bulunamadı
            </h2>
            <p className="text-xl text-zinc-400">
              &quot;{searchTerm}&quot; için sonuç bulunamadı
            </p>
            <p className="text-zinc-500 mt-2">
              Farklı bir anahtar kelime deneyin
            </p>
          </div>
        )}

        {!isLoading && !error && !searchTerm && (
          <div className="text-center py-20">
            <svg className="w-24 h-24 text-zinc-700 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <h2 className="text-2xl font-bold text-white mb-2">
              Arama Yapın
            </h2>
            <p className="text-xl text-zinc-400">
              Film veya dizi aramak için yukarıdaki arama çubuğunu kullanın
            </p>
          </div>
        )}

        {!isLoading && !error && movies.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">
                <span className="text-red-600">{movies.length}</span> sonuç bulundu
              </h2>
            </div>
            <MovieGrid movies={movies} />
          </div>
        )}
      </div>
    </div>
  );
}
