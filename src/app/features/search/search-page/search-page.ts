
import { Component, inject, signal } from '@angular/core';

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
  imports: [
    SearchBar,
    MediaCard,
    TvShowCard,
    LoadingSpinner,
    ErrorMessage
  ],
  templateUrl: './search-page.html',
  styleUrl: './search-page.scss'
})
export class SearchPage {
  private readonly movieApiService = inject(MovieApiService);

  readonly movies = signal<Movie[]>([]);
  readonly tvShows = signal<TVShow[]>([]);
  readonly isLoading = signal(false);
  readonly errorMessage = signal('');
  readonly hasSearched = signal(false);
  readonly searchQuery = signal('');

  
onSearch(query: string): void {
  if (typeof query !== 'string') {
    console.error('Expected a search string, received:', query);
    return;
  }

  const trimmedQuery = query.trim();

  if (!trimmedQuery) {
    return;
  }

  this.searchQuery.set(trimmedQuery);
  this.hasSearched.set(true);
  this.isLoading.set(true);
  this.errorMessage.set('');
  this.movies.set([]);
  this.tvShows.set([]);

  this.movieApiService.searchMulti(trimmedQuery).subscribe({
    next: response => {
      this.movies.set(response.movies);
      this.tvShows.set(response.tvShows);
      this.isLoading.set(false);
    },
    error: error => {
      console.error('SEARCH FAILED:', error);
      this.errorMessage.set(
        'Unable to search right now. Please try again.'
      );
      this.isLoading.set(false);
    }
  });
}
}