import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { tmdbFetch, getImageUrl, getYear } from '@/lib/tmdb';
import { TVShowDetails, Credits, TMDbResponse, TVShow } from '@/types/tmdb';
import WatchlistButton from '@/components/WatchlistButton';
import MovieCard from '@/components/MovieCard';
import VideoPlayer from '@/components/VideoPlayer';

interface TVPageProps {
  params: Promise<{ id: string }>;
}

async function getTVDetails(id: string) {
  try {
    return await tmdbFetch<TVShowDetails>({
      endpoint: `/tv/${id}`,
    });
  } catch (error) {
    console.error('Error fetching TV details');
    return null;
  }
}

async function getTVCredits(id: string) {
  try {
    return await tmdbFetch<Credits>({
      endpoint: `/tv/${id}/credits`,
    });
  } catch (error) {
    console.error('Error fetching credits');
    return null;
  }
}

async function getSimilarTVShows(id: string) {
  try {
    const data = await tmdbFetch<TMDbResponse<TVShow>>({
      endpoint: `/tv/${id}/similar`,
      params: { page: 1 },
    });
    return data.results;
  } catch (error) {
    console.error('Error fetching similar TV shows');
    return [];
  }
}

export async function generateMetadata({ params }: TVPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const tvShow = await getTVDetails(resolvedParams.id);

  if (!tvShow) {
    return {
      title: 'Dizi Bulunamadı',
    };
  }

  return {
    title: `${tvShow.name} - My Movies`,
    description: tvShow.overview || `${tvShow.name} hakkında detaylı bilgi`,
  };
}

export default async function TVPage({ params }: TVPageProps) {
  const resolvedParams = await params;
  const [tvShow, credits, similarShows] = await Promise.all([
    getTVDetails(resolvedParams.id),
    getTVCredits(resolvedParams.id),
    getSimilarTVShows(resolvedParams.id),
  ]);

  if (!tvShow) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Dizi Bulunamadı</h1>
          <p className="text-zinc-400 mb-6">Aradığınız dizi bulunamadı veya kaldırılmış olabilir.</p>
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
      <div className="relative h-[450px] sm:h-[500px] md:h-[600px] w-full overflow-hidden">
        {tvShow.backdrop_path && (
          <>
            <Image
              src={getImageUrl(tvShow.backdrop_path, 'original')}
              alt={tvShow.name}
              fill
              priority
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/50 to-transparent" />
          </>
        )}

        <div className="relative h-full container mx-auto px-4 flex items-end pb-8 sm:pb-12 pt-20">
          <div className="flex flex-col md:flex-row gap-4 sm:gap-6 md:gap-8 w-full">
            {/* Poster */}
            {tvShow.poster_path && (
              <div className="flex-shrink-0 hidden sm:block">
                <div className="relative w-40 sm:w-48 md:w-64 aspect-[2/3] rounded-lg overflow-hidden shadow-2xl">
                  <Image
                    src={getImageUrl(tvShow.poster_path, 'w500')}
                    alt={tvShow.name}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            )}

            {/* Info */}
            <div className="flex-1 space-y-3 sm:space-y-4">
              <div className="inline-block px-2 py-0.5 sm:px-3 sm:py-1 bg-red-600/20 border border-red-600/50 rounded-full text-red-400 font-medium text-xs sm:text-sm mb-2">
                Dizi
              </div>

              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white">
                {tvShow.name}
              </h1>

              {tvShow.tagline && (
                <p className="text-sm sm:text-base md:text-lg italic text-zinc-300">{tvShow.tagline}</p>
              )}

              <div className="flex flex-wrap items-center gap-2 sm:gap-3 md:gap-4 text-xs sm:text-sm">
                <div className="flex items-center gap-1 bg-yellow-500/20 px-2 py-1 sm:px-3 rounded-full">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="font-semibold text-yellow-500">
                    {tvShow.vote_average.toFixed(1)}/10
                  </span>
                  <span className="text-zinc-400 hidden sm:inline">({tvShow.vote_count} oy)</span>
                </div>

                {tvShow.first_air_date && (
                  <span className="text-zinc-300">{getYear(tvShow.first_air_date)}</span>
                )}

                {tvShow.number_of_seasons > 0 && (
                  <span className="text-zinc-300">{tvShow.number_of_seasons} Sezon</span>
                )}

                {tvShow.number_of_episodes > 0 && (
                  <span className="text-zinc-300 hidden sm:inline">{tvShow.number_of_episodes} Bölüm</span>
                )}
              </div>

              {tvShow.genres.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tvShow.genres.map((genre) => (
                    <span
                      key={genre.id}
                      className="px-2 py-1 sm:px-3 bg-zinc-800/80 backdrop-blur-sm rounded-full text-xs sm:text-sm text-zinc-300"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              )}

              <WatchlistButton
                movie={{
                  id: tvShow.id,
                  title: tvShow.name,
                  poster_path: tvShow.poster_path,
                  vote_average: tvShow.vote_average,
                  release_date: tvShow.first_air_date,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8 sm:py-12 space-y-8 sm:space-y-12">
        {/* Overview */}
        {tvShow.overview && (
          <section>
            <div className="bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 backdrop-blur-sm border border-zinc-800/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 shadow-xl">
              <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                <div className="w-1 h-6 sm:h-8 bg-gradient-to-b from-red-600 to-red-500 rounded-full" />
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">Hikaye</h2>
              </div>
              <p className="text-sm sm:text-base md:text-lg text-zinc-300 leading-relaxed">
                {tvShow.overview}
              </p>
            </div>
          </section>
        )}

        {/* Trailers */}
        <VideoPlayer movieId={tvShow.id} type="tv" />

        {/* Cast */}
        {cast.length > 0 && (
          <section>
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <div className="w-1 h-6 sm:h-8 bg-gradient-to-b from-red-600 to-red-500 rounded-full" />
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">Oyuncular</h2>
            </div>

            <div className="relative">
              <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
                {cast.map((person) => (
                  <div key={person.id} className="flex-shrink-0 w-24 sm:w-28 md:w-32 snap-start group">
                    <div className="relative aspect-[2/3] bg-zinc-800 rounded-xl overflow-hidden shadow-lg transition-transform duration-300 group-hover:scale-105">
                      {person.profile_path ? (
                        <Image
                          src={getImageUrl(person.profile_path, 'w185')}
                          alt={person.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-zinc-600 bg-zinc-900">
                          <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="mt-3 space-y-1">
                      <p className="font-semibold text-white text-sm line-clamp-2">{person.name}</p>
                      <p className="text-zinc-500 text-xs line-clamp-2">{person.character}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Scroll Indicators */}
              <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-zinc-950 to-transparent pointer-events-none" />
              <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-zinc-950 to-transparent pointer-events-none" />
            </div>
          </section>
        )}

        {/* Similar Shows */}
        {similarShows.length > 0 && (
          <section>
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <div className="w-1 h-6 sm:h-8 bg-gradient-to-b from-red-600 to-red-500 rounded-full" />
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">Benzer Diziler</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
              {similarShows.slice(0, 12).map((similarShow) => (
                <MovieCard key={similarShow.id} movie={similarShow} mediaType="tv" />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
