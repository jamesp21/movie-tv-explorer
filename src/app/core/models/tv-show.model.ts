export interface TVShow {
  id: number;
  name: string;
  originalName: string;
  overview: string;
  posterPath: string | null;
  backdropPath: string | null;
  firstAirDate: string;
  popularity: number;
  voteAverage: number;
  voteCount: number;
  originalLanguage: string;
}