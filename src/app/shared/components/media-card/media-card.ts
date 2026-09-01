import { Component, input } from '@angular/core';

import { Movie } from '../../../core/models/movie.model';
import { TVShow } from '../../../core/models/tv-show.model';

@Component({
  selector: 'app-media-card',
  standalone: true,
  imports: [],
  templateUrl: './media-card.html',
  styleUrl: './media-card.scss'
})
export class MediaCard {
  readonly movie = input<Movie | null>(null);
  readonly tvShow = input<TVShow | null>(null);
}