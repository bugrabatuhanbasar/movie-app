import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { tmdbFetch, getImageUrl, getYear, formatRuntime } from '@/lib/tmdb';
import { MovieDetails, Credits, TMDbResponse, Movie } from '@/types/tmdb';
import WatchlistButton from '@/components/WatchlistButton';
import MovieCard from '@/components/MovieCard';

interface MoviePageProps {
  params: { id: string };
}

async function getMovieDetails(id: string) {
  try {
    return await tmdbFetch<MovieDetails>({
      endpoint: `/movie/${id}`,
    });
  } catch (error) {
    console.error('Error fetching movie details');
    return null;
  }
}

async function getMovieCredits(id: string) {
  try {
    return await tmdbFetch<Credits>({
      endpoint: `/movie/${id}/credits`,
    });
  } catch (error) {
    console.error('Error fetching credits');
    return null;
  }
}

async function getSimilarMovies(id: string) {
  try {
    const data = await tmdbFetch<TMDbResponse<Movie>>({
      endpoint: `/movie/${id}/similar`,
      params: { page: 1 },
    });
    return data.results;
  } catch (error) {
    console.error('Error fetching similar movies');
    return [];
  }
}

export async function generateMetadata({ params }: MoviePageProps): Promise<Metadata> {
  const movie = await getMovieDetails(params.id);

  if (!movie) {
    return {
      title: 'Film Bulunamadı',
    };
  }

  return {
    title: `${movie.title} - My Movies`,
    description: movie.overview || `${movie.title} hakkında detaylı bilgi`,
  };
}

export default async function MoviePage({ params }: MoviePageProps) {
  const [movie, credits, similarMovies] = await Promise.all([
    getMovieDetails(params.id),
    getMovieCredits(params.id),
    getSimilarMovies(params.id),
  ]);

  if (!movie) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Film Bulunamadı</h1>
          <p className="text-zinc-400 mb-6">Aradığınız film bulunamadı veya kaldırılmış olabilir.</p>
          <Link href="/" className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg text-white font-medium transition-colors">
            Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    );
  }

  const cast = credits?.cast.slice(0, 10) || [];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[500px] md:h-[600px] w-full overflow-hidden">
        {movie.backdrop_path && (
          <>
            <Image
              src={getImageUrl(movie.backdrop_path, 'original')}
              alt={movie.title}
              fill
              priority
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/50 to-transparent" />
          </>
        )}

        <div className="relative h-full container mx-auto px-4 flex items-end pb-12">
          <div className="flex flex-col md:flex-row gap-8 w-full">
            {/* Poster */}
            {movie.poster_path && (
              <div className="flex-shrink-0">
                <div className="relative w-48 md:w-64 aspect-[2/3] rounded-lg overflow-hidden shadow-2xl">
                  <Image
                    src={getImageUrl(movie.poster_path, 'w500')}
                    alt={movie.title}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            )}

            {/* Info */}
            <div className="flex-1 space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                {movie.title}
              </h1>

              {movie.tagline && (
                <p className="text-lg italic text-zinc-300">{movie.tagline}</p>
              )}

              <div className="flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center gap-1 bg-yellow-500/20 px-3 py-1 rounded-full">
                  <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="font-semibold text-yellow-500">
                    {movie.vote_average.toFixed(1)}/10
                  </span>
                  <span className="text-zinc-400">({movie.vote_count} oy)</span>
                </div>

                {movie.release_date && (
                  <span className="text-zinc-300">{getYear(movie.release_date)}</span>
                )}

                {movie.runtime > 0 && (
                  <span className="text-zinc-300">{formatRuntime(movie.runtime)}</span>
                )}
              </div>

              {movie.genres.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {movie.genres.map((genre) => (
                    <span
                      key={genre.id}
                      className="px-3 py-1 bg-zinc-800/80 backdrop-blur-sm rounded-full text-sm text-zinc-300"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              )}

              <WatchlistButton
                movie={{
                  id: movie.id,
                  title: movie.title,
                  poster_path: movie.poster_path,
                  vote_average: movie.vote_average,
                  release_date: movie.release_date,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12 space-y-12">
        {/* Overview */}
        {movie.overview && (
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Özet</h2>
            <p className="text-lg text-zinc-300 leading-relaxed max-w-4xl">
              {movie.overview}
            </p>
          </section>
        )}

        {/* Cast */}
        {cast.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-white mb-6">Oyuncular</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {cast.map((person) => (
                <div key={person.id} className="space-y-2">
                  <div className="relative aspect-[2/3] bg-zinc-800 rounded-lg overflow-hidden">
                    {person.profile_path ? (
                      <Image
                        src={getImageUrl(person.profile_path, 'w185')}
                        alt={person.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-600">
                        <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-white text-sm">{person.name}</p>
                    <p className="text-zinc-400 text-sm">{person.character}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Similar Movies */}
        {similarMovies.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-white mb-6">Benzer Filmler</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {similarMovies.slice(0, 12).map((similarMovie) => (
                <MovieCard key={similarMovie.id} movie={similarMovie} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
