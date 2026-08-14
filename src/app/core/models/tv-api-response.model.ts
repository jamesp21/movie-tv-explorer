export interface TvApiResult {
  id: number;
  name: string;
  original_name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  first_air_date: string;
  popularity: number;
  vote_average: number;
  vote_count: number;
  original_language: string;
}

export interface TvApiResponse {
  page: number;
  results: TvApiResult[];
  total_pages: number;
  total_results: number;
}