import { Component, inject, OnInit, signal } from '@angular/core';

import { MovieApiService } from '../../../core/services/movie-api.service';
import { Movie } from '../../../core/models/movie.model';

import { MediaCard } from '../../../shared/components/media-card/media-card';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [MediaCard],
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

  private loadPopularMovies(): void {
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