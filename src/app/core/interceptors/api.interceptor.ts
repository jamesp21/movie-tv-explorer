import { HttpInterceptorFn } from '@angular/common/http';

import { environment } from '../../../environments/environment';

const TMDB_API_URL = new URL(environment.tmdb.apiUrl);

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  const requestUrl = new URL(req.url, TMDB_API_URL);

  const isTmdbApiRequest =
    requestUrl.origin === TMDB_API_URL.origin &&
    (requestUrl.pathname === TMDB_API_URL.pathname ||
      requestUrl.pathname.startsWith(`${TMDB_API_URL.pathname.replace(/\/$/, '')}/`));

  if (!isTmdbApiRequest) {
    return next(req);
  }

  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${environment.tmdb.accessToken}`,
    },
  });

  return next(authReq);
};
