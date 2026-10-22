import { Component, input, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Movie } from '../../../core/models/movie.model';
import { FavoritesService } from '../../../core/services/favorites.service';
import { PosterUrlPipe } from '../../pipes/poster-url.pipe';

@Component({
  selector: 'app-media-card',
  standalone: true,
  imports: [PosterUrlPipe, RouterLink],
  templateUrl: './media-card.html',
  styleUrl: './media-card.scss',
})
export class MediaCard {
  readonly movie = input.required<Movie>();

  readonly favoritesService = inject(FavoritesService);

  isFavorite(): boolean {
    return this.favoritesService.isFavorite(this.movie().id, 'movie');
  }

  toggleFavorite(event: Event): void {
    event.preventDefault();
    event.stopPropagation();

    this.favoritesService.toggleFavorite(this.movie());
  }
}
