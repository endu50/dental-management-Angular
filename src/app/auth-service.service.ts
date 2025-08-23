// auth.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { BehaviorSubject, Observable,throwError } from 'rxjs';
import { environment } from '../environments/environment/environment.component'; // keep your existing pat
import { HttpHeaders } from '@angular/common/http';
import { tap, catchError,map } from 'rxjs/operators';
import { of } from 'rxjs';

export interface Account {
  id: number;
  fullName: string;
  email: string;
  role: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private tokenKey = 'token';

  // Subjects (private to prevent accidental external .next())
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  public isLoggedIn$ = this.isLoggedInSubject.asObservable();

  private userRoleSubject = new BehaviorSubject<string | null>(null);
  public currentUserRole$ = this.userRoleSubject.asObservable();

 private userEmail = new BehaviorSubject<string | null>(localStorage.getItem('email'));
  public currentUserEmail$ = this.userEmail.asObservable();


  private logoutTimer: any = null;
  private lastActivityMs: number = Date.now();

  private baseUrl = 'http://localhost:5139/api/auth/get';
  private baseUrl2 = 'http://localhost:5139/api/auth';
  private baseUrlReg = 'http://localhost:5139/api/auth/register';
  private baseUrlReset = 'http://localhost:5139/api/auth/request-reset';
  private baseUrlRefresh = 'http://localhost:5139/api/auth/';

  constructor(private router: Router, private http: HttpClient) {
    this.loadUserFromStorage();
    // Debug: log email/role changes and localStorage
this.currentUserEmail$.subscribe(email => {
  console.debug('[DEBUG][AuthService] currentUserEmail$ ->', email);
  console.debug('[DEBUG][AuthService] localStorage.email ->', localStorage.getItem('email'));
});
// Also log role changes (optional)
this.currentUserRole$.subscribe(role => {
  console.debug('[DEBUG][AuthService] currentUserRole$ ->', role);
});

  }
/** Call this once after login or refresh to apply new access token, role & email */
public setAuthState(token: string, role?: string | null, email?: string | null) {
  if (!token) {
    this.clearLocalAuth();
    return;
  }

  // save token locally
  this.saveAccessToken(token);

  // store user metadata if provided
  if (role) {
    this.userRoleSubject.next(role);
    localStorage.setItem('role', role);
  } else {
    // try decode fallback
    try {
      const decoded: any = jwtDecode(token);
      const r = decoded?.role || decoded?.['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || null;
      this.userRoleSubject.next(r);
      if (r) localStorage.setItem('role', r);
    } catch { this.userRoleSubject.next(null); }
  }

  if (email) {
    this.userEmail.next(email);
    localStorage.setItem('email', email);
  } else {
    try {
      const decoded: any = jwtDecode(token);
      const e = decoded?.email ?? null;
      this.userEmail.next(e);
      if (e) localStorage.setItem('email', e);
    } catch { this.userEmail.next(null); }
  }

  this.isLoggedInSubject.next(true);

  // start token expiry timer from token exp if present
  try {
    const decoded: any = jwtDecode(token);
    if (decoded?.exp) this.startLogoutTimer(decoded.exp);
  } catch (e) {
    // no exp - do nothing
  }
}

  // --- Storage helpers ---
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  private saveAccessToken(token: string) {
    localStorage.setItem(this.tokenKey, token);
  }

  private removeAccessToken() {
    localStorage.removeItem(this.tokenKey);
  }

  // --- Init on startup ---
  private loadUserFromStorage() {
    const token = this.getToken();
    if (!token) {
      this.userRoleSubject.next(null);
        this.userEmail.next(null);
      this.isLoggedInSubject.next(false);
      return;
    }

    try {
      const decoded: any = jwtDecode(token);
      const role = decoded?.role || decoded?.['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || null;
      const emailToken = decoded?.email || null;

      this.userRoleSubject.next(role);
      const emailFromStorage = localStorage.getItem('email');
      const email = emailToken ?? emailFromStorage ?? null;
        this.userEmail.next(email);
        console.log("load form storage:"+ email + role)
      this.isLoggedInSubject.next(true);

      if (decoded?.exp) {
        this.startLogoutTimer(decoded.exp);
      }
    } catch (err) {
      console.warn('Invalid token in storage, clearing auth state', err);
      this.clearLocalAuth();
    }
  }

  // --- Public state helpers ---
  public updateUserRole(role: string| null) {
    this.userRoleSubject.next(role);
    if (role) localStorage.setItem('role', role);
    else localStorage.removeItem('role');
  }
   public updateUserEmail(email: string | null) {
      this.userEmail.next(email);
    if (email) localStorage.setItem('email', email);
    else localStorage.removeItem('email');
  }

  public updateLoginState(isLoggedIn: boolean) {
    this.isLoggedInSubject.next(isLoggedIn);
    if (!isLoggedIn) {
      // Clear local tokens/role when logging out locally
      this.clearLocalAuth();
    }
  }

  public getUserRole(): Observable<string | null> {
    return this.currentUserRole$;
  }
  setUserEmail(email: string) {
    this.userEmail.next(email);
  }
public getCurrentUserEmail(): Observable< string | null >{
    return this.currentUserEmail$;
  }

  public isAuthenticated(): boolean {
    return !!this.getToken();
  }

  // Optional convenience: check token validity and update subjects
  public isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) {
      this.userRoleSubject.next(null);
      this.userEmail.next(null);
      this.isLoggedInSubject.next(false);
      return false;
    }

    try {
      const decoded: any = jwtDecode(token);
      const exp = decoded?.exp;
      if (typeof exp === 'number') {
        const now = Math.floor(Date.now() / 1000);
        if (exp <= now) {
          this.userRoleSubject.next(null);
           this.userEmail.next(null);
          this.isLoggedInSubject.next(false);
          return false;
        }
      }

      const role =
        decoded?.role ||
        decoded?.['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ||
        null;
            const email =
        decoded?.email  ||
        null;

      this.userRoleSubject.next(role);
      this.userEmail.next(email);
      this.isLoggedInSubject.next(true);
      return true;
    } catch (err) {
      console.warn('Failed to decode token in isLoggedIn()', err);
      this.userRoleSubject.next(null);
       this.userEmail.next(null);
      this.isLoggedInSubject.next(false);
      return false;
    }
  }

  // --- Activity tracking ---
  updateLastActivity() {
    this.lastActivityMs = Date.now();
  }

  getLastActivity(): number {
    return this.lastActivityMs;
  }

  // --- Timers ---
  public startLogoutTimer(expInSec: number) {
    const nowMs = Date.now();
    const expMs = expInSec * 1000;
    const expiresInMs = expMs - nowMs;

    console.log(`Token expires at: ${new Date(expMs).toLocaleTimeString()}`);
    console.log(`Current time: ${new Date(nowMs).toLocaleTimeString()}`);
    console.log(`Milliseconds until expiry: ${expiresInMs}`);

    if (this.logoutTimer) clearTimeout(this.logoutTimer);

    if (expiresInMs <= 0) {
      alert('Session expired. You will be logged out.');
      this.logout();
      return;
    }

    const refreshBuffer = 60 * 1000; // refresh 60s before expiry
    const refreshTime = expiresInMs - refreshBuffer;
    const idleThresholdMs = 3 * 60 * 1000; // 3 minutes

    if (refreshTime > 0) {
      console.log(`Scheduling token refresh in ${refreshTime} ms`);
      this.logoutTimer = setTimeout(() => {
        console.log('Refresh timer triggered — checking user activity...');
        const lastActivity = this.getLastActivity();
        const idleMs = Date.now() - lastActivity;
        console.log(`Idle time (ms): ${idleMs}`);

        if (idleMs < idleThresholdMs) {
          console.log('User active recently — refreshing token');
          this.refreshToken();
        } else {
          console.log('User idle — logging out instead of refreshing');
          this.logout();
        }
      }, refreshTime);
    } else {
      const lastActivity = this.getLastActivity();
      const idleMs = Date.now() - lastActivity;
      if (idleMs < idleThresholdMs) {
        console.log('Within buffer and user active — refreshing now');
        this.refreshToken();
      } else {
        console.log('Within buffer and user idle — logging out');
        this.logout();
      }
    }
  }

  // --- Refresh token flow (cookie-based) ---
refreshToken(): Observable<{ token: string; role?: string; email?: string }> {
  return this.http.post<{ token: string; role?: string; email?: string }>(
    `${environment.apiUrl}/auth/refresh`,
    null,
    { withCredentials: true }
  ).pipe(
    tap(res => {
      if (!res?.token) {
        // no valid token -> force logout
        this.clearLocalAuth();
        throw new Error('No token in refresh response');
      }
      // update local state via your helper
      this.setAuthState(res.token, res.role ?? null, res.email ?? null);
    }),
    catchError(err => {
      // keep the error for interceptor to handle
      return throwError(() => err);
    })
  );
}
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    this.updateUserRole(null);
     this.updateUserEmail(null);
     this.router.navigate(['/login']);
    // redirect or any other cleanup
  }

  // --- Logout (client + server) ---
  logout1() {
    // optional: notify backend to revoke refresh token & clear cookies
    this.http.post(`${environment.apiUrl}/auth/logout`, {}, { withCredentials: true })
      .subscribe({
        next: () => {
          this.clearLocalAuth();
          this.router.navigate(['/login']);
        },
        error: () => {
          // always clear local state even on failure
          this.clearLocalAuth();
          this.router.navigate(['/login']);
        }
      });
  }

  private clearLocalAuth() {
    this.removeAccessToken();
    localStorage.removeItem('role');
    this.userRoleSubject.next(null);
     this.userEmail.next(null);
    this.isLoggedInSubject.next(false);

    if (this.logoutTimer) {
      clearTimeout(this.logoutTimer);
      this.logoutTimer = null;
    }
  }

  // --- Misc API helpers ---
  registerAccount(account: Account): Observable<any> {
    return this.http.post<Account[]>(this.baseUrlReg, account);
  }

  getAccount(): Observable<Account[]> {
    return this.http.get<Account[]>(this.baseUrl);
  }
   getAccountById(email : string): Observable<Account[]> {
        const url = `${this.baseUrl}/${email}`;
    return this.http.get<Account[]>(url);
  }
  // auth-service.service.ts (add)
// in auth-service.service.ts
// verifyCurrentPassword(currentPassword: string) {
//   return this.http.post<{ ok: boolean }>(
//     `${environment.apiUrl}/auth/verify-current`,
//     { currentPassword },
//     { withCredentials: true }
//   );
// }

verifyCurrentPassword(currentPassword: string) {
  return this.http.post<{ ok: boolean }>(
    `${environment.apiUrl}/auth/verify-current`,
    { currentPassword }
    // no custom options needed if interceptor attaches Authorization header
  ).pipe(
    map(r => !!r?.ok),
    catchError(err => {
      console.error('verifyCurrentPassword failed', err);
      return of(false);
    })
  );
}

// auth.service.ts
changePassword(currentPassword: string, newPassword: string)
  : Observable<{ ok?: boolean; message?: string; errors?: string[] }> {
  return this.http.post<{ ok?: boolean; message?: string; errors?: string[] }>(
    `${environment.apiUrl}/auth/change-password`,
    { currentPassword, newPassword },
    { withCredentials: true }
  );
}



  deleteAccount(id: number): Observable<void> {
    const url = `${this.baseUrl2}/${id}`;
    return this.http.delete<void>(url);
  }

  resetLink(email: string): Observable<any> {
    return this.http.post<Account>(this.baseUrlReset, { email });
  }

  resetPassword(token: string, newPassword: string): Observable<any> {
    return this.http.post('http://localhost:5139/api/auth/reset-password', {
      token, newPassword
    });
  }

  sendOtp(phoneNumber: string) {
    return this.http.post('http://localhost:5139/api/auth/send-otp', phoneNumber, {
      headers: { 'Content-Type': 'application/json' },
      responseType: 'text'
    });
  }

  verifyOtp(PhoneNumber: string, otp: string): Observable<any> {
    return this.http.post('http://localhost:5139/api/auth/verify-otp', { PhoneNumber, otp });
  }
}
