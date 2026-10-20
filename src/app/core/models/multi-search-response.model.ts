
import {
  MovieApiResult,
  MovieApiResponse
} from './movie-api-response.model';

import {
  TvApiResult,
  TvApiResponse
} from './tv-api-response.model';

export interface MultiSearchMovieResult extends MovieApiResult {
  media_type: 'movie';
}

export interface MultiSearchTvResult extends TvApiResult {
  media_type: 'tv';
}

export interface MultiSearchPersonResult {
  id: number;
  media_type: 'person';
}

export type MultiSearchItem =
  | MultiSearchMovieResult
  | MultiSearchTvResult
  | MultiSearchPersonResult;

export interface MultiSearchApiResponse {
  page: number;
  results: MultiSearchItem[];
  total_pages: number;
  total_results: number;
}