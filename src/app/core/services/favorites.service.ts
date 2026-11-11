import { Injectable, ApplicationRef, computed, inject, signal } from '@angular/core';

import { filter, take } from 'rxjs';

import { Movie } from '../models/movie.model';
import { TVShow } from '../models/tv-show.model';

export type FavoriteMedia = (Movie & { mediaType: 'movie' }) | (TVShow & { mediaType: 'tv' });

const STORAGE_KEY = 'movie-tv-explorer-favorites';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isValidMovieFavorite(item: Record<string, unknown>): boolean {
  return (
    item['mediaType'] === 'movie' &&
    typeof item['id'] === 'number' &&
    Number.isSafeInteger(item['id']) &&
    item['id'] > 0 &&
    typeof item['title'] === 'string' &&
    typeof item['originalTitle'] === 'string' &&
    typeof item['overview'] === 'string' &&
    (typeof item['posterPath'] === 'string' || item['posterPath'] === null) &&
    (typeof item['backdropPath'] === 'string' || item['backdropPath'] === null) &&
    typeof item['releaseDate'] === 'string' &&
    typeof item['popularity'] === 'number' &&
    Number.isFinite(item['popularity']) &&
    typeof item['voteAverage'] === 'number' &&
    Number.isFinite(item['voteAverage']) &&
    typeof item['voteCount'] === 'number' &&
    Number.isSafeInteger(item['voteCount']) &&
    item['voteCount'] >= 0 &&
    typeof item['adult'] === 'boolean' &&
    typeof item['originalLanguage'] === 'string'
  );
}

function isValidTvFavorite(item: Record<string, unknown>): boolean {
  return (
    item['mediaType'] === 'tv' &&
    typeof item['id'] === 'number' &&
    Number.isSafeInteger(item['id']) &&
    item['id'] > 0 &&
    typeof item['name'] === 'string' &&
    typeof item['originalName'] === 'string' &&
    typeof item['overview'] === 'string' &&
    (typeof item['posterPath'] === 'string' || item['posterPath'] === null) &&
    (typeof item['backdropPath'] === 'string' || item['backdropPath'] === null) &&
    typeof item['firstAirDate'] === 'string' &&
    typeof item['popularity'] === 'number' &&
    Number.isFinite(item['popularity']) &&
    typeof item['voteAverage'] === 'number' &&
    Number.isFinite(item['voteAverage']) &&
    typeof item['voteCount'] === 'number' &&
    Number.isSafeInteger(item['voteCount']) &&
    item['voteCount'] >= 0 &&
    typeof item['originalLanguage'] === 'string'
  );
}

function isFavoriteMedia(item: unknown): item is FavoriteMedia {
  if (!isRecord(item)) {
    return false;
  }

  return isValidMovieFavorite(item) || isValidTvFavorite(item);
}

@Injectable({
  providedIn: 'root',
})
export class FavoritesService {
  private readonly favoritesState = signal<FavoriteMedia[]>([]);

  readonly favorites = this.favoritesState.asReadonly();

  readonly favoriteCount = computed(() => this.favoritesState().length);

  constructor() {
    inject(ApplicationRef)
      .isStable.pipe(
        filter((isStable) => isStable),
        take(1),
      )
      .subscribe(() => {
        this.favoritesState.set(this.loadFavorites());
      });
  }

  isFavorite(id: number, mediaType: 'movie' | 'tv'): boolean {
    return this.favoritesState().some((item) => item.id === id && item.mediaType === mediaType);
  }

  toggleFavorite(movie: Movie): void {
    this.toggle({
      ...movie,
      mediaType: 'movie',
    });
  }

  toggleFavoriteTv(show: TVShow): void {
    this.toggle({
      ...show,
      mediaType: 'tv',
    });
  }

  private toggle(item: FavoriteMedia): void {
    const exists = this.isFavorite(item.id, item.mediaType);

    const updated = exists
      ? this.favoritesState().filter(
          (favorite) => favorite.id !== item.id || favorite.mediaType !== item.mediaType,
        )
      : [...this.favoritesState(), item];

    this.favoritesState.set(updated);
    this.saveFavorites(updated);
  }

  private loadFavorites(): FavoriteMedia[] {
    try {
      if (typeof localStorage === 'undefined') {
        return [];
      }

      const stored = localStorage.getItem(STORAGE_KEY);

      if (!stored) {
        return [];
      }

      const parsed: unknown = JSON.parse(stored);

      if (!Array.isArray(parsed)) {
        return [];
      }

      return parsed.filter(isFavoriteMedia);
    } catch {
      return [];
    }
  }

  private saveFavorites(favorites: FavoriteMedia[]): void {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
      }
    } catch (error) {
      console.error('Unable to save favorites:', error);
    }
  }
}
