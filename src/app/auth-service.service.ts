// auth.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../environments/environment/environment.component';


export interface Account {
  id:number;
  fullName: string,
  email  : string,
  role: string
}

@Injectable({ providedIn: 'root' })
export class AuthService {
    private tokenKey = 'token';
  public userRoleSubject = new BehaviorSubject<string | null>(null);
    currentUserRole$ = this.userRoleSubject.asObservable();
  private logoutTimer: any;
 private lastActivityMs: number = Date.now();
 //public userRoleSubject = new BehaviorSubject<string | null>(this.getDecodedUserRole());
 //private userRole = new BehaviorSubject<string | null>(null);

   private baseUrl = 'http://localhost:5139/api/auth/get';
     private baseUrl2 = 'http://localhost:5139/api/auth';
     private baseUrlReg= 'http://localhost:5139/api/auth/register';
         private baseUrlReset= 'http://localhost:5139/api/auth/request-reset';

         private baseUrlRefresh = 'http://localhost:5139/api/auth/';
  constructor(private router: Router, private http: HttpClient ) {
     this.loadUserFromStorage();
  // const roleFromToken = this.getDecodedUserRole();
  // console.log('Role Restored from Token on Service Init:', roleFromToken);
  // this.userRoleSubject.next(roleFromToken);
  }


getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }
  private loadUserFromStorage() {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded: any = jwtDecode(token);
      const role = decoded.role || decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
      this.userRoleSubject.next(role);
      this.startLogoutTimer(decoded.exp);
    }
  }
   updateUserRole(role: string | null) {
    this.userRoleSubject.next(role);
  }
public getDecodedUserRole(): string | null {
  const token = this.getToken();
  if (!token) return null;

  try {
    const decodedToken: any = jwtDecode(token);
    // Adjust key lookup to match your token structure
    return decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || null;
  } catch (e) {
    console.error("Invalid Token", e);
    return null;
  }
}


//  updateUserRole(roleFromAPI?: string) {
//   let role = roleFromAPI || this.getDecodedUserRole();
//   console.log('Updated Role:', role);
//   this.userRoleSubject.next(role);
// }


  getUserRole(): Observable<string | null> {
    return this.userRoleSubject.asObservable();
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
 


  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }


  registerAccount(account :Account):Observable<any>{
    return this.http.post<Account[]>(this.baseUrlReg,account);
  }
  getAccount():Observable<Account[]>{
    return this.http.get<Account[]>(this.baseUrl)
  }
 
  deleteAccount(id: number):Observable<void> {
     const url = `${this.baseUrl2}/${id}`
    return this.http.delete<void>(url);
  }
  resetLink(email :string):Observable<any>{

    return this.http.post<Account>(this.baseUrlReset,{email})
  }
  resetPassword(token: string, newPassword: string): Observable<any> {
  return this.http.post('http://localhost:5139/api/auth/reset-password', {
    token, newPassword
  });
}
// sendOtp(PhoneNumber: string): Observable<any> {
//   return this.http.post('http://localhost:5139/api/auth/send-otp', { PhoneNumber });
// }
sendOtp(phoneNumber: string) {
  return this.http.post('http://localhost:5139/api/auth/send-otp', phoneNumber, {
    headers: { 'Content-Type': 'application/json' },
    responseType: 'text'
  });
}

verifyOtp(PhoneNumber: string, otp: string): Observable<any> {
  return this.http.post('http://localhost:5139/api/auth/verify-otp', { PhoneNumber, otp });
}

// isTokenExpired(): boolean {
//   const token = localStorage.getItem('token');
//   if (!token) return true;

//   const decoded: any = jwtDecode(token);
//   const now = Math.floor(Date.now() / 1000); // current time in seconds

//   return decoded.exp < now;
// }

// startLogoutTimer(expInSec: number) {
//   const nowMs = Date.now();
//   const expMs = expInSec * 1000;
//   const expiresInMs = expMs - nowMs;

//   console.log(`Token expires at: ${new Date(expMs).toLocaleTimeString()}`);
//   console.log(`Current time: ${new Date(nowMs).toLocaleTimeString()}`);
//   console.log(`Milliseconds until expiry: ${expiresInMs}`);

//   if (this.logoutTimer) clearTimeout(this.logoutTimer);

//   if (expiresInMs <= 0) {
//     alert("Session expired. You will be logged out.");
//     this.logout();
//     return;
//   }

//   const refreshBuffer = 1 * 60 * 1000; // 2 minutes
//   const refreshTime = expiresInMs - refreshBuffer;
// if (refreshTime > 0) {
//   console.log(`Scheduling token refresh in ${refreshTime} ms`);
//   this.logoutTimer = setTimeout(() => {
//     console.log('Refreshing token now...');
//     const decoded=localStorage.getItem('token');
//        console.log("The token is:"+ decoded);
//     this.refreshToken();
//   }, refreshTime);
// } else {
//   console.log('Refresh time already passed, refreshing immediately');
//   this.logout();
// }
// }

updateLastActivity() {
  this.lastActivityMs = Date.now();
  // optional: persist so reloads have a notion of last activity
  // localStorage.setItem('lastActivityMs', String(this.lastActivityMs));
}

getLastActivity(): number {
  // optional: try to read persisted value
  // const v = localStorage.getItem('lastActivityMs');
  // return v ? Number(v) : this.lastActivityMs;
  return this.lastActivityMs;
}
startLogoutTimer(expInSec: number) {
  const nowMs = Date.now();
  const expMs = expInSec * 1000;
  const expiresInMs = expMs - nowMs;

  console.log(`Token expires at: ${new Date(expMs).toLocaleTimeString()}`);
  console.log(`Current time: ${new Date(nowMs).toLocaleTimeString()}`);
  console.log(`Milliseconds until expiry: ${expiresInMs}`);

  if (this.logoutTimer) clearTimeout(this.logoutTimer);

  if (expiresInMs <= 0) {
    alert("Session expired. You will be logged out.");
    this.logout();
    return;
  }

  const refreshBuffer = 60 * 1000; // refresh 60s before expiry
  const refreshTime = expiresInMs - refreshBuffer;

  // idle threshold: if user inactive longer than this, do not refresh
  const idleThresholdMs = 2 * 60 * 1000; // 2 minutes, tune as needed

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
    // if within buffer, do immediate check
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


//  refreshToken() {
//     const refreshToken = localStorage.getItem('refreshToken');
//     if (!refreshToken) {
//       this.logout();
//       return;
//     }

//   console.log('Starting token refresh');

//  this.http.post<{ token: string; refreshToken: string }>(`${this.baseUrlRefresh}/refresh`, { refreshToken }).subscribe({
//   next: res => {
//     console.log('Token refreshed successfully', res);
//     localStorage.setItem('token', res.token);
//     localStorage.setItem('refreshToken', res.refreshToken);
//  const decoded: any = jwtDecode(res.token);
//   console.log('Decoded token after refresh:', decoded);
//   const role = decoded.role || decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
//   console.log('Extracted role after refresh:', role);
//   this.updateUserRole(role);
//   this.startLogoutTimer(decoded.exp);
//   },
// error: err => {
//   console.error('Refresh token failed', err);
//   console.log('Current refreshToken:', refreshToken);
//   alert('Session expired. You will be logged out.');
//   this.logout();
// }
// });
//   }
// refreshToken() {
//   this.http.post<{ token: string }>('http://localhost:5139/api/auth/refresh', {}).subscribe({
//     next: (res) => {
//       localStorage.setItem('token', res.token);
      
//       // Decode token to extract role and update BehaviorSubject
//       const decoded: any = jwtDecode(res.token);
//       const role = decoded.role || null;
//       console.log('Role from refreshed token:', role);
//       this.userRoleSubject.next(role);

//       this.startLogoutTimer(decoded.exp); // reset timer
//     },
//     error: () => {
//       this.logout();
//     }
//   });
// }
refreshToken() {
  // We do NOT read any refresh token; cookie is HttpOnly and sent automatically.
  console.log('Refreshing token (cookie-based)…');

  this.http.post<{ token: string; role?: string }>(
    `${environment.apiUrl}/auth/refresh`,
    null,                    // empty body
    { withCredentials: true }
  ).subscribe({
    next: (res) => {
      console.log('Token refreshed', res);
      if (!res?.token) { throw new Error('No token in refresh response'); }

      // store new access token only
      localStorage.setItem('token', res.token);
      if (res.role) localStorage.setItem('role', res.role);

      // update role & timers
      try {
        const decoded: any = jwtDecode(res.token);
        const role = res.role || decoded?.role || decoded?.['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || null;
        this.userRoleSubject.next(role);
        if (decoded?.exp) this.startLogoutTimer(decoded.exp);
      } catch (e) {
        console.error('Failed to decode refreshed token', e);
        this.logout();
      }
    },
    error: (err) => {
      console.error('Refresh failed', err);
      const serverMsg = err?.error?.message;
      if (serverMsg) console.error('Server:', serverMsg);
      alert('Session expired. You will be logged out.');
      this.logout();
    }
  });
}


logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    this.updateUserRole(null);
     this.router.navigate(['/login']);
    // redirect or any other cleanup
  }
  //   logout() {
  // localStorage.removeItem(this.tokenKey);
  //   this.userRoleSubject.next(null);
  //    localStorage.removeItem('token_expiry');
  //   this.router.navigate(['/login']);
  //}
}
