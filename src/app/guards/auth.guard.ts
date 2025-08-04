import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthService } from '../auth-service.service';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> {

    const expectedRoles = route.data['roles'] as Array<string>;

    return this.authService.getUserRole().pipe(
      take(1),  // Complete after first emission
      map(role => {
        if (role && expectedRoles.includes(role)) {
          return true;
        } else {
          return this.router.createUrlTree(['/unauthorized']);
        }
      })
    );
  }
}
