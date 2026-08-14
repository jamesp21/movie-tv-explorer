export interface Genre {
  id: number;
  name: string;
}

export interface ProductionCompany {
  id: number;
  name: string;
  logoPath: string | null;
  originCountry: string;
}

export interface MediaDetails {
  id: number;

  title?: string;
  name?: string;

  originalTitle?: string;
  originalName?: string;

  overview: string;

  posterPath: string | null;
  backdropPath: string | null;

  releaseDate?: string;
  firstAirDate?: string;

  popularity: number;
  voteAverage: number;
  voteCount: number;

  originalLanguage: string;

  genres: Genre[];

  runtime?: number;
  numberOfSeasons?: number;
  numberOfEpisodes?: number;

  productionCompanies: ProductionCompany[];
}