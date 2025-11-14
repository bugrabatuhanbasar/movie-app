import { tmdbFetch } from '@/lib/tmdb';
import { TMDbResponse, Movie } from '@/types/tmdb';
import HomeContent from '@/components/HomeContent';

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

async function getTrendingMovies() {
  try {
    const data = await tmdbFetch<TMDbResponse<Movie>>({
      endpoint: '/trending/movie/week',
      params: { page: 1 },
    });
    return data.results;
  } catch (error) {
    console.error('Error fetching trending movies');
    return [];
  }
}

export default async function HomePage() {
  const [popularMovies, nowPlayingMovies, topRatedMovies, trendingMovies] = await Promise.all([
    getPopularMovies(),
    getNowPlayingMovies(),
    getTopRatedMovies(),
    getTrendingMovies(),
  ]);

  // Get random movies for banner (from popular and trending)
  const allMovies = [...popularMovies.slice(0, 10), ...trendingMovies.slice(0, 5)];
  const randomBannerMovies = allMovies
    .sort(() => 0.5 - Math.random())
    .slice(0, 5)
    .map(movie => ({
      id: movie.id,
      backdropPath: movie.backdrop_path,
      posterPath: movie.poster_path,
      title: movie.title,
      overview: movie.overview,
      voteAverage: movie.vote_average,
      releaseDate: movie.release_date,
      mediaType: 'movie' as const,
    }));

  return (
    <HomeContent
      trendingMovies={trendingMovies}
      popularMovies={popularMovies}
      nowPlayingMovies={nowPlayingMovies}
      topRatedMovies={topRatedMovies}
      bannerMovies={randomBannerMovies}
    />
  );
}
