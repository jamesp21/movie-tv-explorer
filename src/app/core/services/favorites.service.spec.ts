import { ApplicationRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { beforeEach, describe, expect, it } from 'vitest';

import { FavoritesService } from './favorites.service';
import { Movie } from '../models/movie.model';
import { TVShow } from '../models/tv-show.model';

describe('FavoritesService', () => {
  let service: FavoritesService;

  const movie = {
    id: 123,
    title: 'Test Movie',
    originalTitle: 'Test Movie',
    overview: 'A test movie.',
    posterPath: null,
    backdropPath: null,
    releaseDate: '2026-01-01',
    popularity: 10,
    voteAverage: 8,
    voteCount: 100,
    adult: false,
    originalLanguage: 'en',
  } as Movie;

  const tvShow = {
    id: 123,
    name: 'Test Show',
    originalName: 'Test Show',
    overview: 'A test TV show.',
    posterPath: null,
    backdropPath: null,
    firstAirDate: '2026-01-01',
    popularity: 10,
    voteAverage: 8,
    voteCount: 100,
    originalLanguage: 'en',
  } as TVShow;

  beforeEach(() => {
    localStorage.clear();

    TestBed.configureTestingModule({
      providers: [
        FavoritesService,
        {
          provide: ApplicationRef,
          useValue: { isStable: of(true) },
        },
      ],
    });

    service = TestBed.inject(FavoritesService);
  });

  it('should start with no favorites', () => {
    expect(service.favorites()).toEqual([]);
    expect(service.favoriteCount()).toBe(0);
  });

  it('should add a movie to favorites', () => {
    service.toggleFavorite(movie);

    expect(service.isFavorite(movie.id, 'movie')).toBe(true);
    expect(service.favoriteCount()).toBe(1);
  });

  it('should remove a movie when it is already a favorite', () => {
    service.toggleFavorite(movie);
    service.toggleFavorite(movie);

    expect(service.isFavorite(movie.id, 'movie')).toBe(false);
    expect(service.favoriteCount()).toBe(0);
  });

  it('should treat a movie and TV show with the same ID as separate favorites', () => {
    service.toggleFavorite(movie);
    service.toggleFavoriteTv(tvShow);

    expect(service.isFavorite(123, 'movie')).toBe(true);
    expect(service.isFavorite(123, 'tv')).toBe(true);
    expect(service.favoriteCount()).toBe(2);
  });

  it('should save favorites to localStorage', () => {
    service.toggleFavorite(movie);

    const savedFavorites = localStorage.getItem('movie-tv-explorer-favorites');

    expect(savedFavorites).not.toBeNull();
    expect(savedFavorites).toContain('"mediaType":"movie"');
  });

  it('should restore favorites from localStorage when initialized', () => {
    const savedMovie = {
      ...movie,
      mediaType: 'movie',
    };

    localStorage.setItem('movie-tv-explorer-favorites', JSON.stringify([savedMovie]));

    // Reset the testing module so the service is initialized again.
    TestBed.resetTestingModule();

    TestBed.configureTestingModule({
      providers: [
        FavoritesService,
        {
          provide: ApplicationRef,
          useValue: { isStable: of(true) },
        },
      ],
    });

    service = TestBed.inject(FavoritesService);

    expect(service.favorites()).toHaveLength(1);
    expect(service.isFavorite(movie.id, 'movie')).toBe(true);
    expect(service.favoriteCount()).toBe(1);
  });

  it('should ignore invalid favorites stored in localStorage', () => {
    localStorage.setItem(
      'movie-tv-explorer-favorites',
      JSON.stringify([
        { id: 123, mediaType: 'movie', title: 'Incomplete Movie' },
        { id: 456, mediaType: 'unknown' },
      ]),
    );

    TestBed.resetTestingModule();

    TestBed.configureTestingModule({
      providers: [
        FavoritesService,
        {
          provide: ApplicationRef,
          useValue: { isStable: of(true) },
        },
      ],
    });

    service = TestBed.inject(FavoritesService);

    expect(service.favorites()).toEqual([]);
    expect(service.favoriteCount()).toBe(0);
  });

  it('should handle corrupted JSON in localStorage', () => {
    localStorage.setItem('movie-tv-explorer-favorites', '{invalid json');

    TestBed.resetTestingModule();

    TestBed.configureTestingModule({
      providers: [
        FavoritesService,
        {
          provide: ApplicationRef,
          useValue: { isStable: of(true) },
        },
      ],
    });

    service = TestBed.inject(FavoritesService);

    expect(service.favorites()).toEqual([]);
    expect(service.favoriteCount()).toBe(0);
  });

  it('should remove a TV show when it is already a favorite', () => {
    service.toggleFavoriteTv(tvShow);
    service.toggleFavoriteTv(tvShow);

    expect(service.isFavorite(tvShow.id, 'tv')).toBe(false);
    expect(service.favoriteCount()).toBe(0);
  });

  it('should keep favorites in memory if localStorage fails', () => {
    const storageSpy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('Storage unavailable');
    });

    service.toggleFavorite(movie);

    expect(service.isFavorite(movie.id, 'movie')).toBe(true);
    expect(service.favoriteCount()).toBe(1);

    storageSpy.mockRestore();
  });

  it('should keep valid favorites and ignore invalid entries', () => {
    localStorage.setItem(
      'movie-tv-explorer-favorites',
      JSON.stringify([
        { ...movie, mediaType: 'movie' },
        { id: 456, mediaType: 'movie', title: 'Incomplete Movie' },
        { ...tvShow, mediaType: 'tv' },
      ]),
    );

    TestBed.resetTestingModule();

    TestBed.configureTestingModule({
      providers: [
        FavoritesService,
        {
          provide: ApplicationRef,
          useValue: { isStable: of(true) },
        },
      ],
    });

    service = TestBed.inject(FavoritesService);

    expect(service.favoriteCount()).toBe(2);
    expect(service.isFavorite(movie.id, 'movie')).toBe(true);
    expect(service.isFavorite(tvShow.id, 'tv')).toBe(true);
  });

  it('should handle localStorage read failures', () => {
    TestBed.resetTestingModule();

    const storageSpy = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('Storage unavailable');
    });

    TestBed.configureTestingModule({
      providers: [
        FavoritesService,
        {
          provide: ApplicationRef,
          useValue: { isStable: of(true) },
        },
      ],
    });

    service = TestBed.inject(FavoritesService);

    expect(service.favorites()).toEqual([]);
    expect(service.favoriteCount()).toBe(0);

    storageSpy.mockRestore();
  });
});
