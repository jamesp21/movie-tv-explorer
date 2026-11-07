import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { catchError, map, merge, of, Subject, switchMap } from 'rxjs';

import { MovieApiService } from '../../../core/services/movie-api.service';
import { MediaDetails } from '../../../core/models/media-details.model';
import { PosterUrlPipe } from '../../../shared/pipes/poster-url.pipe';
import { LoadingSpinner } from '../../../shared/components/loading-spinner/loading-spinner';
import { ErrorMessage } from '../../../shared/components/error-message/error-message';

@Component({
  selector: 'app-details-page',
  standalone: true,
  imports: [PosterUrlPipe, LoadingSpinner, ErrorMessage],
  templateUrl: './details-page.html',
  styleUrl: './details-page.scss',
})
export class DetailsPage {
  private readonly route = inject(ActivatedRoute);
  private readonly location = inject(Location);
  private readonly movieApiService = inject(MovieApiService);
  private readonly destroyRef = inject(DestroyRef);

  private readonly retry$ = new Subject<void>();

  readonly details = signal<MediaDetails | null>(null);
  readonly isLoading = signal(true);
  readonly errorMessage = signal('');

  readonly mediaType = signal<'movie' | 'tv'>('movie');

  readonly displayTitle = computed(() => {
    const item = this.details();
    return item?.title || item?.name || 'Untitled';
  });

  constructor() {
    merge(this.route.paramMap, this.retry$.pipe(map(() => this.route.snapshot.paramMap)))
      .pipe(
        map((params) => ({
          type: params.get('type'),
          id: Number(params.get('id')),
        })),
        switchMap(({ type, id }) => {
          this.isLoading.set(true);
          this.errorMessage.set('');
          this.details.set(null);

          if ((type !== 'movie' && type !== 'tv') || !Number.isInteger(id) || id <= 0) {
            return of({
              details: null,
              error: 'Invalid movie or TV show URL.',
            });
          }

          this.mediaType.set(type);

          const request =
            type === 'movie'
              ? this.movieApiService.getMovieDetails(id)
              : this.movieApiService.getTvDetails(id);

          return request.pipe(
            map((details) => ({
              details,
              error: '',
            })),
            catchError((error) => {
              console.error('FAILED TO LOAD DETAILS:', error);

              return of({
                details: null,
                error: 'Unable to load details. Please try again.',
              });
            }),
          );
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((result) => {
        this.details.set(result.details);
        this.errorMessage.set(result.error);
        this.isLoading.set(false);
      });
  }

  loadDetails(): void {
    this.retry$.next();
  }

  goBack(): void {
    this.location.back();
  }
}
