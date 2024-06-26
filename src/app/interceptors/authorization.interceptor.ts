import { HttpInterceptorFn } from '@angular/common/http';

export const authorizationInterceptor: HttpInterceptorFn = (req, next) => {
  let token = localStorage.getItem('jwt.saved.token');
  token = token ? token.replace('"', '') : '';
  console.log(token);
  if (token) {
    const requestWithAuthorization = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`),
    });
    return next(requestWithAuthorization);
  }
  return next(req);
};
