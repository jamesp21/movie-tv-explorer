
import { Component, input } from '@angular/core';

import { TVShow } from '../../../core/models/tv-show.model';
import { PosterUrlPipe } from '../../pipes/poster-url.pipe';

@Component({
  selector: 'app-tv-show-card',
  standalone: true,
  imports: [PosterUrlPipe],
  templateUrl: './tv-show-card.html',
  styleUrl: './tv-show-card.scss'
})
export class TvShowCard {
  readonly tvShow = input.required<TVShow>();
}