import { HttpInterceptorFn } from '@angular/common/http';

export const authorizationInterceptor: HttpInterceptorFn = (req, next) => {
  let token = localStorage.getItem('token');
  token = token ? token.replace('"', '') : '';
  if (token) {
    const requestWithAuthorization = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`),
    });
    return next(requestWithAuthorization);
  }
  return next(req);
};
