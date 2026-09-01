import { Pipe, PipeTransform } from '@angular/core';

import { environment } from '../../../environments/environment';

@Pipe({
  name: 'posterUrl',
  standalone: true
})
export class PosterUrlPipe implements PipeTransform {
  transform(
    posterPath: string | null,
    size: string = 'w500'
  ): string {
    if (!posterPath) {
      return 'assets/images/no-poster.jpg';
    }

    return `${environment.tmdb.imageUrl}/${size}${posterPath}`;
  }
}