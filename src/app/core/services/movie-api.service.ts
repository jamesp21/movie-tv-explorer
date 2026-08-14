import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import { environment } from '../../../environments/environment';

import { Movie } from '../models/movie.model';
import {
  MovieApiResponse,
  MovieApiResult
} from '../models/movie-api-response.model';

import { TVShow } from '../models/tv-show.model';
import {
  TvApiResponse,
  TvApiResult
} from '../models/tv-api-response.model';

import { MediaDetails } from '../models/media-details.model';
import { ApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class MovieApiService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = environment.tmdb.apiUrl;

  getPopularMovies(): Observable<ApiResponse<Movie>> {
    return this.http
      .get<MovieApiResponse>(`${this.apiUrl}/movie/popular`)
      .pipe(
        map(response => ({
          page: response.page,
          results: response.results.map(movie => this.mapMovie(movie)),
          totalPages: response.total_pages,
          totalResults: response.total_results
        }))
      );
  }

  getPopularTvShows(): Observable<ApiResponse<TVShow>> {
    return this.http
      .get<TvApiResponse>(`${this.apiUrl}/tv/popular`)
      .pipe(
        map(response => ({
          page: response.page,
          results: response.results.map(show => this.mapTvShow(show)),
          totalPages: response.total_pages,
          totalResults: response.total_results
        }))
      );
  }

  searchMovies(query: string): Observable<ApiResponse<Movie>> {
    return this.http
      .get<MovieApiResponse>(`${this.apiUrl}/search/movie`, {
        params: {
          query
        }
      })
      .pipe(
        map(response => ({
          page: response.page,
          results: response.results.map(movie => this.mapMovie(movie)),
          totalPages: response.total_pages,
          totalResults: response.total_results
        }))
      );
  }

  searchTvShows(query: string): Observable<ApiResponse<TVShow>> {
    return this.http
      .get<TvApiResponse>(`${this.apiUrl}/search/tv`, {
        params: {
          query
        }
      })
      .pipe(
        map(response => ({
          page: response.page,
          results: response.results.map(show => this.mapTvShow(show)),
          totalPages: response.total_pages,
          totalResults: response.total_results
        }))
      );
  }

  getMovieDetails(id: number): Observable<MediaDetails> {
    return this.http.get<MediaDetails>(
      `${this.apiUrl}/movie/${id}`
    );
  }

  getTvDetails(id: number): Observable<MediaDetails> {
    return this.http.get<MediaDetails>(
      `${this.apiUrl}/tv/${id}`
    );
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
      originalLanguage: movie.original_language
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
      originalLanguage: show.original_language
    };
  }
}