
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/home/home-page/home-page')
        .then(m => m.HomePage)
  },
  {
    path: 'search',
    loadComponent: () =>
      import('./features/search/search-page/search-page')
        .then(m => m.SearchPage)
  },
  {
    path: 'details/:type/:id',
    loadComponent: () =>
      import('./features/details/details-page/details-page')
        .then(m => m.DetailsPage)
  }
];