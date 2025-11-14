'use client';

import { useState, useEffect } from 'react';
import { Movie } from '@/types/tmdb';

interface WatchlistButtonProps {
  movie: {
    id: number;
    title: string;
    poster_path: string | null;
    vote_average: number;
    release_date: string;
  };
}

export default function WatchlistButton({ movie }: WatchlistButtonProps) {
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
        // Remove from watchlist
        const updated = watchlist.filter((item: any) => item.id !== movie.id);
        localStorage.setItem('watchlist', JSON.stringify(updated));
        setIsInWatchlist(false);
      } else {
        // Add to watchlist
        watchlist.push({
          id: movie.id,
          title: movie.title,
          poster_path: movie.poster_path,
          vote_average: movie.vote_average,
          release_date: movie.release_date,
        });
        localStorage.setItem('watchlist', JSON.stringify(watchlist));
        setIsInWatchlist(true);
      }
    }
  };

  return (
    <button
      onClick={toggleWatchlist}
      className={`px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2 ${
        isInWatchlist
          ? 'bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700'
          : 'bg-red-600 hover:bg-red-700 text-white'
      }`}
    >
      {isInWatchlist ? (
        <>
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 3.22l-.61-.6a5.5 5.5 0 0 0-7.78 7.77L10 18.78l8.39-8.4a5.5 5.5 0 0 0-7.78-7.77l-.61.61z" />
          </svg>
          İzleme Listemde
        </>
      ) : (
        <>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          İzleme Listeme Ekle
        </>
      )}
    </button>
  );
}
