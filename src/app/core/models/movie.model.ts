export interface Movie {
  id: number;
  title: string;
  originalTitle: string;
  overview: string;
  posterPath: string | null;
  backdropPath: string | null;
  releaseDate: string;
  popularity: number;
  voteAverage: number;
  voteCount: number;
  adult: boolean;
  originalLanguage: string;
}