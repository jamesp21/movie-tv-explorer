import { Component, input } from '@angular/core';

import { Movie } from '../../../core/models/movie.model';
import { PosterUrlPipe } from '../../pipes/poster-url.pipe';

@Component({
  selector: 'app-media-card',
  standalone: true,
  imports: [PosterUrlPipe],
  templateUrl: './media-card.html',
  styleUrl: './media-card.scss'
})
export class MediaCard {
  readonly movie = input.required<Movie>();
}