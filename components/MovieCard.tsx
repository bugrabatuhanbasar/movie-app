import Link from 'next/link';
import Image from 'next/image';
import { Movie } from '@/types/tmdb';
import { getImageUrl, getYear } from '@/lib/tmdb-client';

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  return (
    <Link href={`/movie/${movie.id}`}>
      <div className="group cursor-pointer">
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
              <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
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
  );
}
