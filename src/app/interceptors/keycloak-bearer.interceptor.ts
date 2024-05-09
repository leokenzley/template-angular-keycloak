import { Observable, catchError, throwError, switchMap, BehaviorSubject, filter, take } from 'rxjs';
import { Inject, Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { CustomAuthServiceService } from '../security/services/custom-auth-service.service';
import { RefreshTokenResponse } from '../security/model/refresh-token-response.model';

@Injectable()
export class KeycloakBearerInterceptor implements HttpInterceptor {  
  constructor(private _authService: CustomAuthServiceService) {}  
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let authReq = req;
    const token = this._authService.getAccessToken();
    if (token != null) {
      authReq = this._addTokenHandler(req, token);
    }

    return next.handle(authReq).pipe(catchError(error => {
      if (error instanceof HttpErrorResponse && error.status === 401) {
        return this.handle401Error(authReq, next);
      }

      return throwError(error);
    }));
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      const token = this._authService.getRefreshToken();

      if (token)
        return this._authService.refreshToken().pipe(
          switchMap((token: any) => {
            this.isRefreshing = false;

            this._authService.saveTokens(token.access_token, token.refresh_token);
            this.refreshTokenSubject.next(token.access_token);
            
            return next.handle(this._addTokenHandler(request, token.access_token));
          }),
          catchError((err) => {
            this.isRefreshing = false;
            this._authService.logout();
            return throwError(err);
          })
        );
    }

    return this.refreshTokenSubject.pipe(
      filter(token => token !== null),
      take(1),
      switchMap((token) => next.handle(this._addTokenHandler(request, token)))
    );
  }




  /** Adiciona o access token */
  private _addTokenHandler(request: HttpRequest<any>, token: any){
    return request.clone({headers:request.headers.set('Authorization', `Bearer ${token}`)})
  }

  private _handlerRefreshToken(request: HttpRequest<any>, next: HttpHandler){
      return this._authService.refreshToken().pipe(
        switchMap((data:RefreshTokenResponse)=>{
          this._saveNewTokens(data);
          return next.handle(this._addTokenHandler(request, data.access_token));
        }), catchError(errorData => {
          this._authService.logout();
          return throwError(errorData)
        })
      );
  }

  private _saveNewTokens(res: RefreshTokenResponse){
    if(res.access_token && res.refresh_token){
      sessionStorage.setItem('access_token', res.access_token) 
      sessionStorage.setItem('refresh_token', res.refresh_token) 
    }
  }
}

