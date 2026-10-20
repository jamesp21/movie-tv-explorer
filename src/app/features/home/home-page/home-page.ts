import { Component, inject, OnInit, signal } from '@angular/core';

import { MovieApiService } from '../../../core/services/movie-api.service';
import { Movie } from '../../../core/models/movie.model';

import { MediaCard } from '../../../shared/components/media-card/media-card';
import { LoadingSpinner } from '../../../shared/components/loading-spinner/loading-spinner';
import { ErrorMessage } from '../../../shared/components/error-message/error-message';

import { SearchBar } from '../../../shared/components/search-bar/search-bar';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    MediaCard,
    LoadingSpinner,
    ErrorMessage,
    SearchBar
  ],
  templateUrl: './home-page.html',
  styleUrl: './home-page.scss'
})
export class HomePage implements OnInit {
  private readonly movieApiService = inject(MovieApiService);

  readonly movies = signal<Movie[]>([]);
  readonly isLoading = signal(true);
  readonly errorMessage = signal('');

  ngOnInit(): void {
    this.loadPopularMovies();
  }

  onSearch(query: string): void {
  console.log('SEARCH QUERY:', query);
}


   loadPopularMovies(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.movieApiService.getPopularMovies().subscribe({
      next: response => {
        this.movies.set(response.results);
        this.isLoading.set(false);
      },

      error: error => {
        console.error('FAILED TO LOAD MOVIES:', error);

        this.errorMessage.set(
          'Unable to load movies. Please try again.'
        );

        this.isLoading.set(false);
      }
    });
  }
}