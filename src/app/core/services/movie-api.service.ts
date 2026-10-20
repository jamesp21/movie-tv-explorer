import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import { environment } from '../../../environments/environment';

import { Movie } from '../models/movie.model';
import { MovieApiResponse, MovieApiResult } from '../models/movie-api-response.model';
import {
  MultiSearchApiResponse,
  MultiSearchMovieResult,
  MultiSearchTvResult,
} from '../models/multi-search-response.model';

import { TVShow } from '../models/tv-show.model';
import { TvApiResponse, TvApiResult } from '../models/tv-api-response.model';

import { MediaDetails } from '../models/media-details.model';
import { ApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root',
})
export class MovieApiService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = environment.tmdb.apiUrl;

  getPopularMovies(): Observable<ApiResponse<Movie>> {
    return this.http.get<MovieApiResponse>(`${this.apiUrl}/movie/popular`).pipe(
      map((response) => ({
        page: response.page,
        results: response.results.map((movie) => this.mapMovie(movie)),
        totalPages: response.total_pages,
        totalResults: response.total_results,
      })),
    );
  }

  getPopularTvShows(): Observable<ApiResponse<TVShow>> {
    return this.http.get<TvApiResponse>(`${this.apiUrl}/tv/popular`).pipe(
      map((response) => ({
        page: response.page,
        results: response.results.map((show) => this.mapTvShow(show)),
        totalPages: response.total_pages,
        totalResults: response.total_results,
      })),
    );
  }

  searchMovies(query: string): Observable<ApiResponse<Movie>> {
    return this.http
      .get<MovieApiResponse>(`${this.apiUrl}/search/movie`, {
        params: {
          query,
        },
      })
      .pipe(
        map((response) => ({
          page: response.page,
          results: response.results.map((movie) => this.mapMovie(movie)),
          totalPages: response.total_pages,
          totalResults: response.total_results,
        })),
      );
  }

  searchTvShows(query: string): Observable<ApiResponse<TVShow>> {
    return this.http
      .get<TvApiResponse>(`${this.apiUrl}/search/tv`, {
        params: {
          query,
        },
      })
      .pipe(
        map((response) => ({
          page: response.page,
          results: response.results.map((show) => this.mapTvShow(show)),
          totalPages: response.total_pages,
          totalResults: response.total_results,
        })),
      );
  }

  searchMulti(query: string): Observable<{
    movies: Movie[];
    tvShows: TVShow[];
    totalResults: number;
  }> {
    return this.http
      .get<MultiSearchApiResponse>(`${this.apiUrl}/search/multi`, {
        params: {
          query: query.trim(),
          include_adult: false,
          language: 'en-US',
          page: 1,
        },
      })
      .pipe(
        map((response) => {
          const movieResults = response.results.filter(
            (item): item is MultiSearchMovieResult => item.media_type === 'movie',
          );

          const tvResults = response.results.filter(
            (item): item is MultiSearchTvResult => item.media_type === 'tv',
          );

          return {
            movies: movieResults.map((movie) => this.mapMovie(movie)),
            tvShows: tvResults.map((show) => this.mapTvShow(show)),
            totalResults: response.total_results,
          };
        }),
      );
  }

  getMovieDetails(id: number): Observable<MediaDetails> {
    return this.http
      .get<TmdbMediaDetailsResponse>(`${this.apiUrl}/movie/${id}`)
      .pipe(map((response) => this.mapMediaDetails(response)));
  }

  getTvDetails(id: number): Observable<MediaDetails> {
    return this.http
      .get<TmdbMediaDetailsResponse>(`${this.apiUrl}/tv/${id}`)
      .pipe(map((response) => this.mapMediaDetails(response)));
  }

  private mapMovie(movie: MovieApiResult): Movie {
    return {
      id: movie.id,
      title: movie.title,
      originalTitle: movie.original_title,
      overview: movie.overview,
      posterPath: movie.poster_path,
      backdropPath: movie.backdrop_path,
      releaseDate: movie.release_date,
      popularity: movie.popularity,
      voteAverage: movie.vote_average,
      voteCount: movie.vote_count,
      adult: movie.adult,
      originalLanguage: movie.original_language,
    };
  }

  private mapTvShow(show: TvApiResult): TVShow {
    return {
      id: show.id,
      name: show.name,
      originalName: show.original_name,
      overview: show.overview,
      posterPath: show.poster_path,
      backdropPath: show.backdrop_path,
      firstAirDate: show.first_air_date,
      popularity: show.popularity,
      voteAverage: show.vote_average,
      voteCount: show.vote_count,
      originalLanguage: show.original_language,
    };
  }

  private mapMediaDetails(response: TmdbMediaDetailsResponse): MediaDetails {
    return {
      id: response.id,
      title: response.title,
      name: response.name,
      originalTitle: response.original_title,
      originalName: response.original_name,
      overview: response.overview ?? '',
      posterPath: response.poster_path,
      backdropPath: response.backdrop_path,
      releaseDate: response.release_date,
      firstAirDate: response.first_air_date,
      popularity: response.popularity ?? 0,
      voteAverage: response.vote_average ?? 0,
      voteCount: response.vote_count ?? 0,
      originalLanguage: response.original_language ?? '',
      genres: response.genres ?? [],
      runtime: response.runtime,
      numberOfSeasons: response.number_of_seasons,
      numberOfEpisodes: response.number_of_episodes,
      productionCompanies: (response.production_companies ?? []).map((company) => ({
        id: company.id,
        name: company.name,
        logoPath: company.logo_path,
        originCountry: company.origin_country,
      })),
    };
  }
}

interface TmdbMediaDetailsResponse {
  id: number;
  title?: string;
  name?: string;
  original_title?: string;
  original_name?: string;
  overview?: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date?: string;
  first_air_date?: string;
  popularity?: number;
  vote_average?: number;
  vote_count?: number;
  original_language?: string;
  genres?: { id: number; name: string }[];
  runtime?: number;
  number_of_seasons?: number;
  number_of_episodes?: number;
  production_companies?: {
    id: number;
    name: string;
    logo_path: string | null;
    origin_country: string;
  }[];
}
