import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, ParamMap, Router } from '@angular/router';
import { BehaviorSubject, of, Subject, throwError } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { SearchPage } from './search-page';
import { MovieApiService } from '../../../core/services/movie-api.service';

import { Movie } from '../../../core/models/movie.model';
import { TVShow } from '../../../core/models/tv-show.model';

describe('SearchPage', () => {
  let movieApiService: {
    searchMulti: ReturnType<typeof vi.fn>;
  };

  let queryParamMap: BehaviorSubject<ParamMap>;

  let routerNavigate: ReturnType<typeof vi.fn>;

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

    routerNavigate = vi.fn();

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
            navigate: routerNavigate,
          },
        },
        {
          provide: ActivatedRoute,
          useValue: {
            queryParamMap: queryParamMap.asObservable(),
            snapshot: {
              get queryParamMap() {
                return queryParamMap.value;
              },
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

  it('should trim the search query before updating the URL', () => {
    const fixture = TestBed.createComponent(SearchPage);
    const component = fixture.componentInstance;

    component.onSearch('  Batman  ');

    expect(routerNavigate).toHaveBeenCalledOnce();
    expect(routerNavigate).toHaveBeenCalledWith([], {
      relativeTo: TestBed.inject(ActivatedRoute),
      queryParams: { q: 'Batman' },
      queryParamsHandling: 'merge',
    });
  });

  it('should clear the URL query when the submitted search is empty', () => {
    const fixture = TestBed.createComponent(SearchPage);
    const component = fixture.componentInstance;

    component.onSearch('   ');

    expect(routerNavigate).toHaveBeenCalledOnce();
    expect(routerNavigate).toHaveBeenCalledWith([], {
      relativeTo: TestBed.inject(ActivatedRoute),
      queryParams: { q: null },
      queryParamsHandling: 'merge',
    });

    expect(movieApiService.searchMulti).not.toHaveBeenCalled();
  });

  it('should not navigate when submitting the current search query again', () => {
    const fixture = TestBed.createComponent(SearchPage);
    const component = fixture.componentInstance;

    queryParamMap.next(convertToParamMap({ q: 'Batman' }));

    routerNavigate.mockClear();

    component.onSearch('Batman');

    expect(routerNavigate).not.toHaveBeenCalled();
    expect(movieApiService.searchMulti).toHaveBeenCalledOnce();
  });

  it('should retry the search when the current query has an error', () => {
    const fixture = TestBed.createComponent(SearchPage);
    const component = fixture.componentInstance;

    movieApiService.searchMulti.mockReturnValueOnce(throwError(() => new Error('API failure')));

    queryParamMap.next(convertToParamMap({ q: 'Batman' }));

    expect(component.errorMessage()).toBe('Unable to search right now. Please try again.');

    movieApiService.searchMulti.mockReturnValue(
      of({
        movies: [],
        tvShows: [],
        totalResults: 0,
      }),
    );

    component.onSearch('Batman');

    expect(movieApiService.searchMulti).toHaveBeenCalledTimes(2);
    expect(routerNavigate).not.toHaveBeenCalled();
    expect(component.errorMessage()).toBe('');
  });

  it('should retry the current search when retrySearch is called', () => {
    const fixture = TestBed.createComponent(SearchPage);
    const component = fixture.componentInstance;

    queryParamMap.next(convertToParamMap({ q: 'Batman' }));

    movieApiService.searchMulti.mockClear();

    component.retrySearch();

    expect(movieApiService.searchMulti).toHaveBeenCalledOnce();
    expect(movieApiService.searchMulti).toHaveBeenCalledWith('Batman');
  });

  it('should not retry when there is no search query', () => {
    const fixture = TestBed.createComponent(SearchPage);
    const component = fixture.componentInstance;

    component.retrySearch();

    expect(movieApiService.searchMulti).not.toHaveBeenCalled();
  });

  it('should clear previous results and errors when performing a new search', () => {
    const fixture = TestBed.createComponent(SearchPage);
    const component = fixture.componentInstance;

    component.movies.set([
      {
        id: 1,
        title: 'Old Movie',
        originalTitle: 'Old Movie',
        overview: '',
        posterPath: null,
        backdropPath: null,
        releaseDate: '',
        popularity: 0,
        voteAverage: 0,
        voteCount: 0,
        adult: false,
        originalLanguage: 'en',
      },
    ]);

    component.errorMessage.set('Previous search failed');

    queryParamMap.next(convertToParamMap({ q: 'Batman' }));

    expect(component.movies()).toEqual([]);
    expect(component.tvShows()).toEqual([]);
    expect(component.errorMessage()).toBe('');
    expect(component.hasSearched()).toBe(true);
  });

  it('should display an error message when the search API fails', () => {
    const fixture = TestBed.createComponent(SearchPage);
    const component = fixture.componentInstance;

    movieApiService.searchMulti.mockReturnValue(throwError(() => new Error('API failure')));

    queryParamMap.next(convertToParamMap({ q: 'Batman' }));

    expect(component.errorMessage()).toBe('Unable to search right now. Please try again.');
    expect(component.isLoading()).toBe(false);
    expect(component.hasSearched()).toBe(true);
  });

  it('should update movies and TV shows when the search succeeds', () => {
    const fixture = TestBed.createComponent(SearchPage);
    const component = fixture.componentInstance;

    const mockMovie = {
      id: 1,
      title: 'Batman',
      originalTitle: 'Batman',
      overview: 'A superhero movie.',
      posterPath: null,
      backdropPath: null,
      releaseDate: '2022-03-04',
      popularity: 100,
      voteAverage: 8,
      voteCount: 1000,
      adult: false,
      originalLanguage: 'en',
    };

    const mockTVShow = {
      id: 2,
      name: 'Batman: The Animated Series',
      originalName: 'Batman: The Animated Series',
      overview: 'An animated superhero series.',
      posterPath: null,
      backdropPath: null,
      firstAirDate: '1992-09-05',
      popularity: 90,
      voteAverage: 9,
      voteCount: 500,
      originalLanguage: 'en',
    };

    movieApiService.searchMulti.mockReturnValue(
      of({
        movies: [mockMovie],
        tvShows: [mockTVShow],
        totalResults: 2,
      }),
    );

    queryParamMap.next(convertToParamMap({ q: 'Batman' }));

    expect(component.movies()).toEqual([mockMovie]);
    expect(component.tvShows()).toEqual([mockTVShow]);
    expect(component.errorMessage()).toBe('');
    expect(component.isLoading()).toBe(false);
    expect(component.hasSearched()).toBe(true);
  });

  it('should handle a successful search with no results', () => {
    const fixture = TestBed.createComponent(SearchPage);
    const component = fixture.componentInstance;

    queryParamMap.next(convertToParamMap({ q: 'Unknown Title' }));

    expect(component.movies()).toEqual([]);
    expect(component.tvShows()).toEqual([]);
    expect(component.hasSearched()).toBe(true);
    expect(component.errorMessage()).toBe('');
    expect(component.isLoading()).toBe(false);
  });

  it('should cancel the previous search when a new query arrives', () => {
    const fixture = TestBed.createComponent(SearchPage);
    const component = fixture.componentInstance;

    const firstSearch = new Subject<{
      movies: Movie[];
      tvShows: TVShow[];
      totalResults: number;
    }>();

    movieApiService.searchMulti.mockReturnValueOnce(firstSearch);

    queryParamMap.next(convertToParamMap({ q: 'Batman' }));

    expect(component.isLoading()).toBe(true);
    expect(firstSearch.observed).toBe(true);

    queryParamMap.next(convertToParamMap({ q: 'Superman' }));

    expect(firstSearch.observed).toBe(false);
    expect(movieApiService.searchMulti).toHaveBeenLastCalledWith('Superman');
    expect(component.searchQuery()).toBe('Superman');
    expect(component.isLoading()).toBe(false);
  });

  it('should remain loading while the search request is pending', () => {
    const fixture = TestBed.createComponent(SearchPage);
    const component = fixture.componentInstance;

    const pendingSearch = new Subject<{
      movies: Movie[];
      tvShows: TVShow[];
      totalResults: number;
    }>();

    movieApiService.searchMulti.mockReturnValueOnce(pendingSearch);

    queryParamMap.next(convertToParamMap({ q: 'Batman' }));

    expect(component.isLoading()).toBe(true);
    expect(component.searchQuery()).toBe('Batman');

    pendingSearch.next({
      movies: [],
      tvShows: [],
      totalResults: 0,
    });

    expect(component.isLoading()).toBe(true);

    pendingSearch.complete();

    expect(component.isLoading()).toBe(false);
  });

  it('should ignore invalid search input', () => {
    const fixture = TestBed.createComponent(SearchPage);
    const component = fixture.componentInstance;
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    component.onSearch(123 as unknown as string);

    expect(consoleErrorSpy).toHaveBeenCalledOnce();
    expect(routerNavigate).not.toHaveBeenCalled();
    expect(movieApiService.searchMulti).not.toHaveBeenCalled();

    consoleErrorSpy.mockRestore();
  });
});
