import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { describe, expect, it, beforeEach, afterEach } from 'vitest';

import { MovieApiService } from './movie-api.service';
import { environment } from '../../../environments/environment';

describe('MovieApiService', () => {
  let service: MovieApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(MovieApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve popular movies and map the response', () => {
    const mockResponse = {
      page: 1,
      results: [
        {
          id: 123,
          title: 'Test Movie',
          original_title: 'Test Movie',
          overview: 'A test movie overview.',
          poster_path: '/poster.jpg',
          backdrop_path: '/backdrop.jpg',
          release_date: '2026-01-01',
          popularity: 100,
          vote_average: 8.5,
          vote_count: 500,
          adult: false,
          original_language: 'en',
        },
      ],
      total_pages: 10,
      total_results: 200,
    };

    service.getPopularMovies().subscribe((response) => {
      expect(response.page).toBe(1);
      expect(response.totalPages).toBe(10);
      expect(response.totalResults).toBe(200);

      expect(response.results[0]).toEqual({
        id: 123,
        title: 'Test Movie',
        originalTitle: 'Test Movie',
        overview: 'A test movie overview.',
        posterPath: '/poster.jpg',
        backdropPath: '/backdrop.jpg',
        releaseDate: '2026-01-01',
        popularity: 100,
        voteAverage: 8.5,
        voteCount: 500,
        adult: false,
        originalLanguage: 'en',
      });
    });

    const request = httpMock.expectOne(`${environment.tmdb.apiUrl}/movie/popular`);

    expect(request.request.method).toBe('GET');

    request.flush(mockResponse);
  });

  it('should retrieve popular TV shows and map the response', () => {
    const mockResponse = {
      page: 1,
      results: [
        {
          id: 456,
          name: 'Test TV Show',
          original_name: 'Test TV Show',
          overview: 'A test TV show overview.',
          poster_path: '/tv-poster.jpg',
          backdrop_path: '/tv-backdrop.jpg',
          first_air_date: '2026-02-01',
          popularity: 80,
          vote_average: 9,
          vote_count: 300,
          original_language: 'en',
        },
      ],
      total_pages: 5,
      total_results: 100,
    };

    service.getPopularTvShows().subscribe((response) => {
      expect(response.page).toBe(1);
      expect(response.totalPages).toBe(5);
      expect(response.totalResults).toBe(100);

      expect(response.results[0]).toEqual({
        id: 456,
        name: 'Test TV Show',
        originalName: 'Test TV Show',
        overview: 'A test TV show overview.',
        posterPath: '/tv-poster.jpg',
        backdropPath: '/tv-backdrop.jpg',
        firstAirDate: '2026-02-01',
        popularity: 80,
        voteAverage: 9,
        voteCount: 300,
        originalLanguage: 'en',
      });
    });

    const request = httpMock.expectOne(`${environment.tmdb.apiUrl}/tv/popular`);

    expect(request.request.method).toBe('GET');

    request.flush(mockResponse);
  });

  it('should search movies and map the response', () => {
    const mockResponse = {
      page: 1,
      results: [
        {
          id: 789,
          title: 'Batman',
          original_title: 'Batman',
          overview: 'A test Batman overview.',
          poster_path: '/batman-poster.jpg',
          backdrop_path: '/batman-backdrop.jpg',
          release_date: '2026-03-01',
          popularity: 95,
          vote_average: 8.2,
          vote_count: 400,
          adult: false,
          original_language: 'en',
        },
      ],
      total_pages: 3,
      total_results: 50,
    };

    service.searchMovies('Batman').subscribe((response) => {
      expect(response.page).toBe(1);
      expect(response.totalPages).toBe(3);
      expect(response.totalResults).toBe(50);

      expect(response.results[0]).toEqual({
        id: 789,
        title: 'Batman',
        originalTitle: 'Batman',
        overview: 'A test Batman overview.',
        posterPath: '/batman-poster.jpg',
        backdropPath: '/batman-backdrop.jpg',
        releaseDate: '2026-03-01',
        popularity: 95,
        voteAverage: 8.2,
        voteCount: 400,
        adult: false,
        originalLanguage: 'en',
      });
    });

    const request = httpMock.expectOne(
      (request) =>
        request.url === `${environment.tmdb.apiUrl}/search/movie` &&
        request.params.get('query') === 'Batman',
    );

    expect(request.request.method).toBe('GET');

    request.flush(mockResponse);
  });

  it('should return an empty array when movie search has no results', () => {
    const mockResponse = {
      page: 1,
      results: [],
      total_pages: 0,
      total_results: 0,
    };

    service.searchMovies('NonexistentMovie').subscribe((response) => {
      expect(response.results).toEqual([]);
      expect(response.totalResults).toBe(0);
      expect(response.totalPages).toBe(0);
    });

    const request = httpMock.expectOne(
      (request) =>
        request.url === `${environment.tmdb.apiUrl}/search/movie` &&
        request.params.get('query') === 'NonexistentMovie',
    );

    expect(request.request.method).toBe('GET');

    request.flush(mockResponse);
  });

  it('should propagate errors when movie search fails', () => {
    let receivedError: unknown;

    service.searchMovies('Batman').subscribe({
      error: (error) => {
        receivedError = error;
      },
    });

    const request = httpMock.expectOne(
      (request) =>
        request.url === `${environment.tmdb.apiUrl}/search/movie` &&
        request.params.get('query') === 'Batman',
    );

    request.flush('Server error', {
      status: 500,
      statusText: 'Internal Server Error',
    });

    expect(receivedError).toBeTruthy();
    expect((receivedError as { status: number }).status).toBe(500);
  });

  it('should search TV shows and map the response', () => {
    const mockResponse = {
      page: 1,
      results: [
        {
          id: 321,
          name: 'Breaking Bad',
          original_name: 'Breaking Bad',
          overview: 'A test TV show overview.',
          poster_path: '/breaking-bad-poster.jpg',
          backdrop_path: '/breaking-bad-backdrop.jpg',
          first_air_date: '2008-01-20',
          popularity: 90,
          vote_average: 9.5,
          vote_count: 1000,
          original_language: 'en',
        },
      ],
      total_pages: 4,
      total_results: 75,
    };

    service.searchTvShows('Breaking Bad').subscribe((response) => {
      expect(response.page).toBe(1);
      expect(response.totalPages).toBe(4);
      expect(response.totalResults).toBe(75);

      expect(response.results[0]).toEqual({
        id: 321,
        name: 'Breaking Bad',
        originalName: 'Breaking Bad',
        overview: 'A test TV show overview.',
        posterPath: '/breaking-bad-poster.jpg',
        backdropPath: '/breaking-bad-backdrop.jpg',
        firstAirDate: '2008-01-20',
        popularity: 90,
        voteAverage: 9.5,
        voteCount: 1000,
        originalLanguage: 'en',
      });
    });

    const request = httpMock.expectOne(
      (request) =>
        request.url === `${environment.tmdb.apiUrl}/search/tv` &&
        request.params.get('query') === 'Breaking Bad',
    );

    expect(request.request.method).toBe('GET');

    request.flush(mockResponse);
  });

  it('should return an empty array when TV show search has no results', () => {
    const mockResponse = {
      page: 1,
      results: [],
      total_pages: 0,
      total_results: 0,
    };

    service.searchTvShows('NonexistentShow').subscribe((response) => {
      expect(response.results).toEqual([]);
      expect(response.totalResults).toBe(0);
      expect(response.totalPages).toBe(0);
    });

    const request = httpMock.expectOne(
      (request) =>
        request.url === `${environment.tmdb.apiUrl}/search/tv` &&
        request.params.get('query') === 'NonexistentShow',
    );

    expect(request.request.method).toBe('GET');

    request.flush(mockResponse);
  });

  it('should propagate errors when TV show search fails', () => {
    let receivedError: unknown;

    service.searchTvShows('Breaking Bad').subscribe({
      error: (error) => {
        receivedError = error;
      },
    });

    const request = httpMock.expectOne(
      (request) =>
        request.url === `${environment.tmdb.apiUrl}/search/tv` &&
        request.params.get('query') === 'Breaking Bad',
    );

    request.flush('Server error', {
      status: 500,
      statusText: 'Internal Server Error',
    });

    expect(receivedError).toBeTruthy();
    expect((receivedError as { status: number }).status).toBe(500);
  });

  it('should search movies and TV shows together', () => {
    const mockResponse = {
      page: 1,
      results: [
        {
          id: 111,
          media_type: 'movie',
          title: 'Test Movie',
          original_title: 'Test Movie',
          overview: 'A movie overview.',
          poster_path: '/movie.jpg',
          backdrop_path: '/movie-backdrop.jpg',
          release_date: '2026-01-01',
          popularity: 80,
          vote_average: 8,
          vote_count: 200,
          adult: false,
          original_language: 'en',
        },
        {
          id: 222,
          media_type: 'tv',
          name: 'Test Show',
          original_name: 'Test Show',
          overview: 'A TV show overview.',
          poster_path: '/show.jpg',
          backdrop_path: '/show-backdrop.jpg',
          first_air_date: '2026-02-01',
          popularity: 90,
          vote_average: 9,
          vote_count: 300,
          original_language: 'en',
        },
        {
          id: 333,
          media_type: 'person',
        },
      ],
      total_pages: 2,
      total_results: 20,
    };

    service.searchMulti('  Batman  ').subscribe((response) => {
      expect(response.totalResults).toBe(20);

      expect(response.movies).toHaveLength(1);
      expect(response.tvShows).toHaveLength(1);

      expect(response.movies[0].title).toBe('Test Movie');
      expect(response.tvShows[0].name).toBe('Test Show');
    });

    const request = httpMock.expectOne(
      (request) =>
        request.url === `${environment.tmdb.apiUrl}/search/multi` &&
        request.params.get('query') === 'Batman',
    );

    expect(request.request.method).toBe('GET');
    expect(request.request.params.get('include_adult')).toBe('false');
    expect(request.request.params.get('language')).toBe('en-US');
    expect(request.request.params.get('page')).toBe('1');

    request.flush(mockResponse);
  });

  it('should return empty results without making a request for a blank multi-search query', () => {
    service.searchMulti('   ').subscribe((response) => {
      expect(response).toEqual({
        movies: [],
        tvShows: [],
        totalResults: 0,
      });
    });

    httpMock.expectNone(`${environment.tmdb.apiUrl}/search/multi`);
  });

  it('should propagate errors when multi-search request fails', () => {
    let errorResponse: unknown;

    service.searchMulti('batman').subscribe({
      error: (error) => {
        errorResponse = error;
      },
    });

    const req = httpMock.expectOne(
      `${environment.tmdb.apiUrl}/search/multi?query=batman&include_adult=false&language=en-US&page=1`,
    );

    req.flush('Server error', {
      status: 500,
      statusText: 'Internal Server Error',
    });

    expect(errorResponse).toBeTruthy();
    expect((errorResponse as { status: number }).status).toBe(500);
  });

  it('should retrieve movie details and map the response', () => {
    const mockResponse = {
      id: 123,
      title: 'Test Movie',
      original_title: 'Test Movie',
      overview: 'A detailed movie overview.',
      poster_path: '/poster.jpg',
      backdrop_path: '/backdrop.jpg',
      release_date: '2026-01-01',
      popularity: 100,
      vote_average: 8.5,
      vote_count: 500,
      adult: false,
      original_language: 'en',
      runtime: 120,
      genres: [
        { id: 1, name: 'Action' },
        { id: 2, name: 'Adventure' },
      ],
      production_companies: [
        {
          id: 10,
          name: 'Test Studios',
          logo_path: null,
          origin_country: 'US',
        },
      ],
    };

    service.getMovieDetails(123).subscribe((movie) => {
      expect(movie.id).toBe(123);
      expect(movie.title).toBe('Test Movie');
      expect(movie.runtime).toBe(120);
      expect(movie.genres).toEqual([
        { id: 1, name: 'Action' },
        { id: 2, name: 'Adventure' },
      ]);
      expect(movie.productionCompanies).toEqual([
        {
          id: 10,
          name: 'Test Studios',
          logoPath: null,
          originCountry: 'US',
        },
      ]);
    });

    const request = httpMock.expectOne(`${environment.tmdb.apiUrl}/movie/123`);

    expect(request.request.method).toBe('GET');

    request.flush(mockResponse);
  });

  it('should use default values when optional movie details are missing', () => {
    const mockResponse = {
      id: 789,
      title: 'Minimal Movie',
      poster_path: null,
      backdrop_path: null,
    };

    service.getMovieDetails(789).subscribe((movie) => {
      expect(movie.id).toBe(789);
      expect(movie.overview).toBe('');
      expect(movie.popularity).toBe(0);
      expect(movie.voteAverage).toBe(0);
      expect(movie.voteCount).toBe(0);
      expect(movie.originalLanguage).toBe('');
      expect(movie.genres).toEqual([]);
      expect(movie.productionCompanies).toEqual([]);
    });

    const request = httpMock.expectOne(`${environment.tmdb.apiUrl}/movie/789`);

    expect(request.request.method).toBe('GET');

    request.flush(mockResponse);
  });

  it('should propagate errors when retrieving movie details fails', () => {
    let receivedError: unknown;

    service.getMovieDetails(123).subscribe({
      error: (error) => {
        receivedError = error;
      },
    });

    const request = httpMock.expectOne(`${environment.tmdb.apiUrl}/movie/123`);

    request.flush('Server error', {
      status: 500,
      statusText: 'Internal Server Error',
    });

    expect(receivedError).toBeTruthy();
    expect((receivedError as { status: number }).status).toBe(500);
  });

  it('should retrieve TV show details and map the response', () => {
    const mockResponse = {
      id: 456,
      name: 'Test TV Show',
      original_name: 'Test TV Show',
      overview: 'A detailed TV show overview.',
      poster_path: '/tv-poster.jpg',
      backdrop_path: '/tv-backdrop.jpg',
      first_air_date: '2026-02-01',
      popularity: 80,
      vote_average: 9,
      vote_count: 300,
      original_language: 'en',
      number_of_seasons: 3,
      number_of_episodes: 30,
      episode_run_time: [45, 50],
      genres: [
        { id: 3, name: 'Drama' },
        { id: 4, name: 'Crime' },
      ],
      production_companies: [
        {
          id: 20,
          name: 'TV Test Studios',
          logo_path: null,
          origin_country: 'US',
        },
      ],
    };

    service.getTvDetails(456).subscribe((show) => {
      expect(show.id).toBe(456);
      expect(show.name).toBe('Test TV Show');
      expect(show.numberOfSeasons).toBe(3);
      expect(show.numberOfEpisodes).toBe(30);

      expect(show.genres).toEqual([
        { id: 3, name: 'Drama' },
        { id: 4, name: 'Crime' },
      ]);

      expect(show.productionCompanies).toEqual([
        {
          id: 20,
          name: 'TV Test Studios',
          logoPath: null,
          originCountry: 'US',
        },
      ]);
    });

    const request = httpMock.expectOne(`${environment.tmdb.apiUrl}/tv/456`);

    expect(request.request.method).toBe('GET');

    request.flush(mockResponse);
  });

  it('should use default values when optional TV show details are missing', () => {
    const mockResponse = {
      id: 789,
      name: 'Minimal TV Show',
      poster_path: null,
      backdrop_path: null,
    };

    service.getTvDetails(789).subscribe((show) => {
      expect(show.id).toBe(789);
      expect(show.overview).toBe('');
      expect(show.popularity).toBe(0);
      expect(show.voteAverage).toBe(0);
      expect(show.voteCount).toBe(0);
      expect(show.originalLanguage).toBe('');
      expect(show.genres).toEqual([]);
      expect(show.productionCompanies).toEqual([]);
    });

    const request = httpMock.expectOne(`${environment.tmdb.apiUrl}/tv/789`);

    expect(request.request.method).toBe('GET');

    request.flush(mockResponse);
  });

  it('should propagate errors when retrieving TV show details fails', () => {
    let receivedError: unknown;

    service.getTvDetails(456).subscribe({
      error: (error) => {
        receivedError = error;
      },
    });

    const request = httpMock.expectOne(`${environment.tmdb.apiUrl}/tv/456`);

    request.flush('Server error', {
      status: 500,
      statusText: 'Internal Server Error',
    });

    expect(receivedError).toBeTruthy();
    expect((receivedError as { status: number }).status).toBe(500);
  });

  it('should propagate errors when retrieving popular movies fails', () => {
    let receivedError: unknown;

    service.getPopularMovies().subscribe({
      next: () => {
        throw new Error('Expected the request to fail');
      },
      error: (error) => {
        receivedError = error;
      },
    });

    const request = httpMock.expectOne(`${environment.tmdb.apiUrl}/movie/popular`);

    request.flush('Server error', {
      status: 500,
      statusText: 'Internal Server Error',
    });

    expect(receivedError).toBeTruthy();
    expect((receivedError as { status: number }).status).toBe(500);
  });

  it('should propagate errors when retrieving popular TV shows fails', () => {
    let receivedError: unknown;

    service.getPopularTvShows().subscribe({
      error: (error) => {
        receivedError = error;
      },
    });

    const request = httpMock.expectOne(`${environment.tmdb.apiUrl}/tv/popular`);

    request.flush('Server error', {
      status: 500,
      statusText: 'Internal Server Error',
    });

    expect(receivedError).toBeTruthy();
    expect((receivedError as { status: number }).status).toBe(500);
  });
});
