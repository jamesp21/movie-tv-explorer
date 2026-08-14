import { HttpInterceptorFn } from '@angular/common/http';

import { environment } from '../../../environments/environment';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${environment.tmdb.accessToken}`
    }
  });

  return next(authReq);
};