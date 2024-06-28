import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { NgSelectModule } from '@ng-select/ng-select';
import { routes } from './app.routes';
import { authorizationInterceptor } from './interceptors/authorization.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(NgSelectModule),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authorizationInterceptor])),
  ],
};
