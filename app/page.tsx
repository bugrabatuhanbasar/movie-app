import { tmdbFetch } from '@/lib/tmdb';
import { TMDbResponse, Movie } from '@/types/tmdb';
import Hero from '@/components/Hero';
import MovieGrid from '@/components/MovieGrid';

async function getPopularMovies() {
  try {
    const data = await tmdbFetch<TMDbResponse<Movie>>({
      endpoint: '/movie/popular',
      params: { page: 1 },
    });
    return data.results;
  } catch (error) {
    console.error('Error fetching popular movies');
    return [];
  }
}

async function getNowPlayingMovies() {
  try {
    const data = await tmdbFetch<TMDbResponse<Movie>>({
      endpoint: '/movie/now_playing',
      params: { page: 1 },
    });
    return data.results;
  } catch (error) {
    console.error('Error fetching now playing movies');
    return [];
  }
}

async function getTopRatedMovies() {
  try {
    const data = await tmdbFetch<TMDbResponse<Movie>>({
      endpoint: '/movie/top_rated',
      params: { page: 1 },
    });
    return data.results;
  } catch (error) {
    console.error('Error fetching top rated movies');
    return [];
  }
}

export default async function HomePage() {
  const [popularMovies, nowPlayingMovies, topRatedMovies] = await Promise.all([
    getPopularMovies(),
    getNowPlayingMovies(),
    getTopRatedMovies(),
  ]);

  // Combine movies for hero selection
  const allMovies = [...popularMovies.slice(0, 10), ...nowPlayingMovies.slice(0, 5)];
  const randomMovie = allMovies[Math.floor(Math.random() * allMovies.length)];

  const heroMovie = randomMovie ? {
    id: randomMovie.id,
    backdropPath: randomMovie.backdrop_path,
    title: randomMovie.title,
    overview: randomMovie.overview,
    voteAverage: randomMovie.vote_average,
    releaseDate: randomMovie.release_date,
    mediaType: 'movie' as const,
  } : null;

  return (
    <div className="min-h-screen">
      {heroMovie && <Hero movie={heroMovie} />}

      <div className="container mx-auto px-4 py-8 space-y-12">
        <MovieGrid movies={popularMovies.slice(0, 12)} title="Popüler Filmler" />
        <MovieGrid movies={nowPlayingMovies.slice(0, 12)} title="Şu An Gösterimde" />
        <MovieGrid movies={topRatedMovies.slice(0, 12)} title="En Çok Oy Alanlar" />
      </div>
    </div>
  );
}
