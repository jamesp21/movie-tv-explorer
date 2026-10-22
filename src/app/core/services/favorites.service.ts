import { Injectable, computed, signal } from '@angular/core';
import { Movie } from '../models/movie.model';
import { TVShow } from '../models/tv-show.model';

export type FavoriteMedia = (Movie & { mediaType: 'movie' }) | (TVShow & { mediaType: 'tv' });

const STORAGE_KEY = 'movie-tv-explorer-favorites';

@Injectable({
  providedIn: 'root',
})
export class FavoritesService {
  private readonly favoritesState = signal<FavoriteMedia[]>(this.loadFavorites());

  readonly favorites = this.favoritesState.asReadonly();

  readonly favoriteCount = computed(() => this.favoritesState().length);

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

      return stored ? (JSON.parse(stored) as FavoriteMedia[]) : [];
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
