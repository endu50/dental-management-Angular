import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../auth-service.service';

@Injectable({
  providedIn: 'root'  // <-- This makes sure it's globally available
})
export class AuthInterceptor implements HttpInterceptor {

  constructor(private router: Router, private tokenService: AuthService) {} 

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('token');

    let authReq = req;
    if (token) {
      authReq = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
      });
    }

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 || error.status === 403) {
          console.warn('Unauthorized - Token might have expired.');
          this.tokenService.logout();  // Auto logout if unauthorized
        }
        return throwError(() => error);
      })
    );
  }
}
