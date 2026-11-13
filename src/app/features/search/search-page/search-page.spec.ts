import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, ParamMap, Router } from '@angular/router';
import { BehaviorSubject, of } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { SearchPage } from './search-page';
import { MovieApiService } from '../../../core/services/movie-api.service';

describe('SearchPage', () => {
  let movieApiService: {
    searchMulti: ReturnType<typeof vi.fn>;
  };

  let queryParamMap: BehaviorSubject<ParamMap>;

  beforeEach(() => {
    movieApiService = {
      searchMulti: vi.fn().mockReturnValue(
        of({
          movies: [],
          tvShows: [],
          totalResults: 0,
        }),
      ),
    };

    queryParamMap = new BehaviorSubject<ParamMap>(convertToParamMap({}));

    TestBed.configureTestingModule({
      imports: [SearchPage],
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
            queryParamMap: queryParamMap.asObservable(),
            snapshot: {
              queryParamMap: convertToParamMap({}),
            },
          },
        },
      ],
    });
  });

  it('should create the search page', () => {
    const fixture = TestBed.createComponent(SearchPage);

    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should start with empty results when the URL has no search query', () => {
    const fixture = TestBed.createComponent(SearchPage);
    const component = fixture.componentInstance;

    fixture.detectChanges();

    expect(movieApiService.searchMulti).not.toHaveBeenCalled();
    expect(component.hasSearched()).toBe(false);
  });

  it('should search when a query parameter exists in the URL', () => {
    const fixture = TestBed.createComponent(SearchPage);
    const component = fixture.componentInstance;

    queryParamMap.next(convertToParamMap({ q: 'Batman' }));

    expect(movieApiService.searchMulti).toHaveBeenCalledOnce();
    expect(movieApiService.searchMulti).toHaveBeenCalledWith('Batman');
    expect(component.searchQuery()).toBe('Batman');
    expect(component.hasSearched()).toBe(true);
    expect(component.isLoading()).toBe(false);
  });

  it('should clear search state when the URL query parameter is removed', () => {
    const fixture = TestBed.createComponent(SearchPage);
    const component = fixture.componentInstance;

    queryParamMap.next(convertToParamMap({ q: 'Batman' }));

    expect(component.hasSearched()).toBe(true);

    queryParamMap.next(convertToParamMap({}));

    expect(component.searchQuery()).toBe('');
    expect(component.movies()).toEqual([]);
    expect(component.tvShows()).toEqual([]);
    expect(component.hasSearched()).toBe(false);
    expect(component.isLoading()).toBe(false);
    expect(component.errorMessage()).toBe('');
  });
});
