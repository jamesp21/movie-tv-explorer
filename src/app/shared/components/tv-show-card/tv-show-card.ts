import { Component, input, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TVShow } from '../../../core/models/tv-show.model';
import { FavoritesService } from '../../../core/services/favorites.service';
import { PosterUrlPipe } from '../../pipes/poster-url.pipe';

@Component({
  selector: 'app-tv-show-card',
  standalone: true,
  imports: [PosterUrlPipe, RouterLink],
  templateUrl: './tv-show-card.html',
  styleUrl: './tv-show-card.scss',
})
export class TvShowCard {
  readonly tvShow = input.required<TVShow>();
  readonly favoritesService = inject(FavoritesService);

  isFavorite(): boolean {
    return this.favoritesService.isFavorite(this.tvShow().id, 'tv');
  }

  toggleFavorite(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.favoritesService.toggleFavoriteTv(this.tvShow());
  }
}
