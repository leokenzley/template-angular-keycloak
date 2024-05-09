import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideOAuthClient } from 'angular-oauth2-oidc';
import { HTTP_INTERCEPTORS, provideHttpClient } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CustomAuthServiceService } from './security/services/custom-auth-service.service';
import { provideAnimations } from '@angular/platform-browser/animations';
import { KeycloakBearerInterceptor } from './interceptors/keycloak-bearer.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes), 
    provideClientHydration(),     
    provideHttpClient(),
    provideOAuthClient(),
    importProvidersFrom(HttpClientModule),
    provideOAuthClient(),
    provideAnimations(),
    CustomAuthServiceService,
    { provide: HTTP_INTERCEPTORS, useClass: KeycloakBearerInterceptor, multi: true }
  ]
};
