'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Movie, Genre } from '@/types/tmdb';
import MovieCard from '@/components/MovieCard';

export default function CategoryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const type = params.type as 'movie' | 'tv';
  const genreId = params.id as string;

  const [movies, setMovies] = useState<Movie[]>([]);
  const [genre, setGenre] = useState<Genre | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadGenreInfo();
  }, [type, genreId]);

  useEffect(() => {
    loadMovies();
  }, [type, genreId, page]);

  const loadGenreInfo = async () => {
    try {
      const endpoint = type === 'movie' ? '/api/tmdb/genres' : '/api/tmdb/tv/genres';
      const res = await fetch(endpoint);
      const data = await res.json();
      const foundGenre = data.genres?.find((g: Genre) => g.id.toString() === genreId);
      setGenre(foundGenre || null);
    } catch (error) {
      console.error('Error loading genre info');
    }
  };

  const loadMovies = async () => {
    setIsLoading(true);
    try {
      const endpoint = type === 'movie'
        ? `https://api.themoviedb.org/3/discover/movie`
        : `https://api.themoviedb.org/3/discover/tv`;

      // Client-side'dan TMDb'ye direkt gitmemek için kendi API'mizi kullanmalıyız
      // Ama şimdilik discover endpoint'ini güncelleyelim
      const res = await fetch(`/api/tmdb/discover/${type}?genre=${genreId}&page=${page}`);
      const data = await res.json();

      setMovies(data.results || []);
      setTotalPages(Math.min(data.total_pages || 1, 500)); // TMDb max 500 sayfa
    } catch (error) {
      console.error('Error loading movies');
      setMovies([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (!genre && !isLoading) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Kategori Bulunamadı</h1>
          <p className="text-zinc-400 mb-6">Aradığınız kategori bulunamadı.</p>
          <Link
            href="/categories"
            className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg text-white font-medium transition-colors inline-block"
          >
            Kategorilere Dön
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16">
      <div className="relative h-64 bg-gradient-to-b from-zinc-900 via-zinc-900/50 to-zinc-950 flex items-center">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-red-900/20 via-zinc-900/50 to-zinc-950" />

        <div className="container mx-auto px-4 relative z-10">
          <Link
            href="/categories"
            className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-6"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Kategorilere Dön
          </Link>

          <div className="flex items-center gap-4 mb-4">
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              {genre?.name || 'Yükleniyor...'}
            </h1>
            <span className="px-4 py-2 bg-red-600/20 border border-red-600/50 rounded-full text-red-400 font-medium">
              {type === 'movie' ? 'Film' : 'Dizi'}
            </span>
          </div>

          {!isLoading && (
            <p className="text-lg text-zinc-400">
              Sayfa {page} / {totalPages}
            </p>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
          </div>
        ) : movies.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-zinc-400">
              Bu kategoride {type === 'movie' ? 'film' : 'dizi'} bulunamadı
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {movies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} mediaType={type} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 mt-12">
                <button
                  onClick={handlePreviousPage}
                  disabled={page === 1}
                  className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 disabled:bg-zinc-900 disabled:text-zinc-600 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Önceki
                </button>

                <div className="px-6 py-3 bg-zinc-800 rounded-lg">
                  <span className="text-white font-medium">
                    {page} / {totalPages}
                  </span>
                </div>

                <button
                  onClick={handleNextPage}
                  disabled={page === totalPages}
                  className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 disabled:bg-zinc-900 disabled:text-zinc-600 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  Sonraki
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
