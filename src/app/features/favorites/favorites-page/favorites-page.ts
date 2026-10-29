import { Component, inject } from '@angular/core';
import { FavoritesService } from '../../../core/services/favorites.service';
import { MediaCard } from '../../../shared/components/media-card/media-card';
import { TvShowCard } from '../../../shared/components/tv-show-card/tv-show-card';

@Component({
  selector: 'app-favorites-page',
  imports: [MediaCard, TvShowCard],
  templateUrl: './favorites-page.html',
  styleUrl: './favorites-page.scss',
})
export class FavoritesPage {
  readonly favoritesService = inject(FavoritesService);
}
