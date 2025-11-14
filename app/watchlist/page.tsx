'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getImageUrl, getYear } from '@/lib/tmdb-client';

interface WatchlistMovie {
  id: number;
  title: string;
  poster_path: string | null;
  vote_average: number;
  release_date: string;
}

export default function WatchlistPage() {
  const [watchlist, setWatchlist] = useState<WatchlistMovie[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadWatchlist();
  }, []);

  const loadWatchlist = () => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('watchlist');
      if (stored) {
        setWatchlist(JSON.parse(stored));
      }
      setIsLoading(false);
    }
  };

  const removeFromWatchlist = (id: number) => {
    const updated = watchlist.filter((movie) => movie.id !== id);
    setWatchlist(updated);
    localStorage.setItem('watchlist', JSON.stringify(updated));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Header */}
      <div className="relative bg-gradient-to-b from-zinc-900 via-zinc-900/80 to-zinc-950 border-b border-zinc-800/50 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-red-900/20 via-zinc-900/50 to-zinc-950" />

        <div className="relative container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-red-600/20 backdrop-blur-sm rounded-full border border-red-600/30">
              <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
              <span className="text-red-400 font-semibold">Favorilerim</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-black text-white">
              İzleme Listem
            </h1>

            <p className="text-xl text-zinc-400">
              {watchlist.length > 0
                ? `${watchlist.length} film ve dizi listenizde`
                : 'Listeniz henüz boş'}
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {watchlist.length === 0 ? (
          <div className="max-w-2xl mx-auto text-center py-20">
            <div className="relative inline-block mb-8">
              <svg
                className="w-32 h-32 text-zinc-800 relative z-10"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
              <div className="absolute inset-0 blur-3xl bg-red-600/10 rounded-full" />
            </div>

            <h2 className="text-3xl font-bold text-white mb-4">
              İzleme Listeniz Boş
            </h2>
            <p className="text-lg text-zinc-400 mb-8 max-w-md mx-auto">
              Beğendiğiniz film ve dizileri izleme listenize ekleyerek daha sonra kolayca ulaşabilirsiniz
            </p>

            <Link
              href="/"
              className="inline-flex items-center gap-2 px-8 py-4 bg-red-600 hover:bg-red-700 rounded-xl text-white font-bold transition-all hover:scale-105 shadow-xl shadow-red-600/50"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Film ve Dizi Keşfet
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {watchlist.map((movie) => (
              <div key={movie.id} className="group relative">
                <Link href={`/movie/${movie.id}`}>
                  <div className="cursor-pointer">
                    <div className="relative aspect-[2/3] overflow-hidden rounded-lg bg-zinc-800">
                      {movie.poster_path ? (
                        <Image
                          src={getImageUrl(movie.poster_path, 'w500')}
                          alt={movie.title}
                          fill
                          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                          className="object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-zinc-600">
                          Poster yok
                        </div>
                      )}

                      <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-md">
                        <div className="flex items-center gap-1">
                          <svg
                            className="w-4 h-4 text-yellow-500"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span className="text-sm font-semibold text-white">
                            {movie.vote_average.toFixed(1)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-2 space-y-1">
                      <h3 className="font-semibold text-white line-clamp-1 group-hover:text-red-500 transition-colors">
                        {movie.title}
                      </h3>
                      <p className="text-sm text-zinc-400">
                        {getYear(movie.release_date)}
                      </p>
                    </div>
                  </div>
                </Link>

                <button
                  onClick={() => removeFromWatchlist(movie.id)}
                  className="absolute top-2 left-2 p-2 bg-red-600 hover:bg-red-700 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                  title="Listeden çıkar"
                >
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
