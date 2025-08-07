// auth.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { BehaviorSubject, Observable } from 'rxjs';


export interface Account {
  id:number;
  fullName: string,
  email  : string,
  role: string
}

@Injectable({ providedIn: 'root' })
export class AuthService {
    private tokenKey = 'token';
  private userRoleSubject = new BehaviorSubject<string | null>(null);
  private logoutTimer: any;
 //public userRoleSubject = new BehaviorSubject<string | null>(this.getDecodedUserRole());
 //private userRole = new BehaviorSubject<string | null>(null);

   private baseUrl = 'http://localhost:5139/api/auth/get';
     private baseUrl2 = 'http://localhost:5139/api/auth';
     private baseUrlReg= 'http://localhost:5139/api/auth/register';
         private baseUrlReset= 'http://localhost:5139/api/auth/request-reset';
  constructor(private router: Router, private http: HttpClient ) {
  // const roleFromToken = this.getDecodedUserRole();
  // console.log('Role Restored from Token on Service Init:', roleFromToken);
  // this.userRoleSubject.next(roleFromToken);
  }

getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
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


 updateUserRole(roleFromAPI?: string) {
  let role = roleFromAPI || this.getDecodedUserRole();
  console.log('Updated Role:', role);
  this.userRoleSubject.next(role);
}


  getUserRole(): Observable<string | null> {
    return this.userRoleSubject.asObservable();
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
 


  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  logout() {
  localStorage.removeItem(this.tokenKey);
    this.userRoleSubject.next(null);
     localStorage.removeItem('token_expiry');
    this.router.navigate(['/login']);
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

isTokenExpired(): boolean {
  const token = localStorage.getItem('token');
  if (!token) return true;

  const decoded: any = jwtDecode(token);
  const now = Math.floor(Date.now() / 1000); // current time in seconds

  return decoded.exp < now;
}

startLogoutTimer(expInSec: number) {
  const expiresInMs = expInSec * 1000 - Date.now();

  if (this.logoutTimer) clearTimeout(this.logoutTimer);

  if (expiresInMs <= 0) {
    // Token already expired
    alert("Session expired. You will be logged out.");
    this.logout();
    return;
  }

  this.logoutTimer = setTimeout(() => {
    alert("Session expired. You will be logged out.");
    this.logout();
  }, expiresInMs);
}

  clearLogoutTimer() {
    if (this.logoutTimer) {
      clearTimeout(this.logoutTimer);
    }
  }

}
