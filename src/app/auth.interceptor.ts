// auth.interceptor.ts
import { Injectable } from '@angular/core';
import {  HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpErrorResponse} from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { catchError, filter, switchMap, take, finalize } from 'rxjs/operators';
import { AuthService } from './auth-service.service';
import { Pipe } from '@angular/core';
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private refreshInProgress = false;
  private refreshSubject = new BehaviorSubject<string | null>(null);

  constructor(private auth: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // 1) Don't add Authorization header to refresh endpoint itself (avoid infinite loops)
    const isRefreshRequest = req.url.includes('/auth/refresh');
    if (isRefreshRequest) {
      return next.handle(req);
    }

    // 2) Attach current access token if exists
    const token = this.auth.getToken();
    console.log('AuthInterceptor token:', token);
    const authReq = token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;

    // 3) Handle request & catch 401s
    return next.handle(authReq).pipe(
      catchError(err => {
        if (err instanceof HttpErrorResponse && err.status === 401) {
          // If a refresh is already happening, wait for it
          if (this.refreshInProgress) {
            return this.refreshSubject.pipe(
              filter(t => t !== null),
              take(1),
              switchMap((newToken) => {
                const retryReq = req.clone({ setHeaders: { Authorization: `Bearer ${newToken}` } });
                return next.handle(retryReq);
              })
            );
          }

          // Start refresh
          this.refreshInProgress = true;
          this.refreshSubject.next(null);

          return this.auth.refreshToken().pipe(
            switchMap(res => {
              // refreshToken() should return { token, role?, email? }
              if (!res?.token) {
                this.auth.logout();
                return throwError(() => err);
              }

              // Broadcast new token for queued requests
              this.refreshSubject.next(res.token);

              // Retry original request with new token
              const retryReq = req.clone({ setHeaders: { Authorization: `Bearer ${res.token}` } });
              return next.handle(retryReq);
            }),
            catchError(refreshErr => {
              // Refresh failed -> logout (clear local state) and bubble error
              this.auth.logout();
              return throwError(() => refreshErr);
            }),
            finalize(() => {
              this.refreshInProgress = false;
            })
          );
        }

        // Not a 401 or other error -> rethrow
        return throwError(() => err);
      })
    );
  }
}
