import { Component, DestroyRef, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize, Subscription } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { MovieApiService } from '../../../core/services/movie-api.service';
import { Movie } from '../../../core/models/movie.model';
import { TVShow } from '../../../core/models/tv-show.model';

import { SearchBar } from '../../../shared/components/search-bar/search-bar';
import { MediaCard } from '../../../shared/components/media-card/media-card';
import { LoadingSpinner } from '../../../shared/components/loading-spinner/loading-spinner';
import { ErrorMessage } from '../../../shared/components/error-message/error-message';
import { TvShowCard } from '../../../shared/components/tv-show-card/tv-show-card';

@Component({
  selector: 'app-search-page',
  standalone: true,
  imports: [SearchBar, MediaCard, TvShowCard, LoadingSpinner, ErrorMessage],
  templateUrl: './search-page.html',
  styleUrl: './search-page.scss',
})
export class SearchPage {
  private readonly movieApiService = inject(MovieApiService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  private searchSubscription?: Subscription;

  readonly movies = signal<Movie[]>([]);
  readonly tvShows = signal<TVShow[]>([]);
  readonly isLoading = signal(false);
  readonly errorMessage = signal('');
  readonly hasSearched = signal(false);
  readonly searchQuery = signal('');

  constructor() {
    this.route.queryParamMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      const query = params.get('q');

      if (query?.trim()) {
        this.performSearch(query.trim());
      } else {
        this.searchSubscription?.unsubscribe();
        this.searchQuery.set('');
        this.movies.set([]);
        this.tvShows.set([]);
        this.hasSearched.set(false);
        this.isLoading.set(false);
        this.errorMessage.set('');
      }
    });
  }

  onSearch(query: string): void {
    if (typeof query !== 'string') {
      console.error('Expected a search string, received:', query);
      return;
    }

    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      return;
    }

    if (trimmedQuery === this.searchQuery()) {
      return;
    }

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { q: trimmedQuery },
      queryParamsHandling: 'merge',
    });
  }

  private performSearch(query: string): void {
    this.searchSubscription?.unsubscribe();

    this.searchQuery.set(query);
    this.hasSearched.set(true);
    this.isLoading.set(true);
    this.errorMessage.set('');
    this.movies.set([]);
    this.tvShows.set([]);

    this.searchSubscription = this.movieApiService
      .searchMulti(query)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.isLoading.set(false);
        }),
      )
      .subscribe({
        next: (response) => {
          this.movies.set(response.movies);
          this.tvShows.set(response.tvShows);
        },

        error: (error) => {
          console.error('SEARCH FAILED:', error);
          this.errorMessage.set('Unable to search right now. Please try again.');
        },
      });
  }
}
