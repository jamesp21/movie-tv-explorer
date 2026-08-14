import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

import { Movie } from '../models/movie.model';
import { TVShow } from '../models/tv-show.model';
import { MediaDetails } from '../models/media-details.model';
import { ApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class MovieApiService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = environment.tmdb.apiUrl;

  getPopularMovies(): Observable<ApiResponse<Movie>> {
    return this.http.get<ApiResponse<Movie>>(
      `${this.apiUrl}/movie/popular`
    );
  }

  getPopularTvShows(): Observable<ApiResponse<TVShow>> {
    return this.http.get<ApiResponse<TVShow>>(
      `${this.apiUrl}/tv/popular`
    );
  }

  searchMovies(query: string): Observable<ApiResponse<Movie>> {
    return this.http.get<ApiResponse<Movie>>(
      `${this.apiUrl}/search/movie`,
      {
        params: {
          query
        }
      }
    );
  }

  searchTvShows(query: string): Observable<ApiResponse<TVShow>> {
    return this.http.get<ApiResponse<TVShow>>(
      `${this.apiUrl}/search/tv`,
      {
        params: {
          query
        }
      }
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
}