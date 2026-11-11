import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { HomePage } from './home-page';
import { MovieApiService } from '../../../core/services/movie-api.service';
import { Movie } from '../../../core/models/movie.model';

describe('HomePage', () => {
  let movieApiService: {
    getPopularMovies: ReturnType<typeof vi.fn>;
  };

  const mockMovie: Movie = {
    id: 123,
    title: 'Test Movie',
    originalTitle: 'Test Movie',
    overview: 'A test movie overview.',
    posterPath: '/poster.jpg',
    backdropPath: '/backdrop.jpg',
    releaseDate: '2026-01-01',
    popularity: 100,
    voteAverage: 8.5,
    voteCount: 500,
    adult: false,
    originalLanguage: 'en',
  };

  beforeEach(() => {
    movieApiService = {
      getPopularMovies: vi.fn().mockReturnValue(
        of({
          page: 1,
          results: [mockMovie],
          totalPages: 1,
          totalResults: 1,
        }),
      ),
    };

    TestBed.configureTestingModule({
      imports: [HomePage],
      providers: [
        {
          provide: MovieApiService,
          useValue: movieApiService,
        },
        {
          provide: Router,
          useValue: {
            navigate: vi.fn(),
          },
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              queryParamMap: {
                get: vi.fn().mockReturnValue(null),
              },
            },
          },
        },
      ],
    });
  });

  it('should load popular movies when the page initializes', () => {
    const fixture = TestBed.createComponent(HomePage);
    const component = fixture.componentInstance;

    fixture.detectChanges();

    expect(movieApiService.getPopularMovies).toHaveBeenCalledOnce();
    expect(component.movies()).toEqual([mockMovie]);
    expect(component.isLoading()).toBe(false);
    expect(component.errorMessage()).toBe('');
  });

  it('should display an error message when loading popular movies fails', () => {
    movieApiService.getPopularMovies.mockReturnValue(throwError(() => new Error('API failed')));

    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const fixture = TestBed.createComponent(HomePage);
    const component = fixture.componentInstance;

    fixture.detectChanges();

    expect(component.movies()).toEqual([]);
    expect(component.errorMessage()).toBe('Unable to load movies. Please try again.');
    expect(component.isLoading()).toBe(false);

    consoleErrorSpy.mockRestore();
  });

  it('should navigate to the search page with a trimmed query', () => {
    const fixture = TestBed.createComponent(HomePage);
    const component = fixture.componentInstance;

    fixture.detectChanges();

    component.onSearch('  Batman  ');

    const router = TestBed.inject(Router);

    expect(router.navigate).toHaveBeenCalledWith(['/search'], {
      queryParams: { q: 'Batman' },
    });
  });

  it('should not navigate when the search query is empty', () => {
    const fixture = TestBed.createComponent(HomePage);
    const component = fixture.componentInstance;

    fixture.detectChanges();

    component.onSearch('   ');

    const router = TestBed.inject(Router);

    expect(router.navigate).not.toHaveBeenCalled();
  });
});
