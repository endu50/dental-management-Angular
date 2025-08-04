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
}

@Injectable({ providedIn: 'root' })
export class AuthService {
    private tokenKey = 'token';
 public userRoleSubject = new BehaviorSubject<string | null>(this.getDecodedUserRole());
 private userRole = new BehaviorSubject<string | null>(null);

   private baseUrl = 'http://localhost:5139/api/auth/get';
     private baseUrl2 = 'http://localhost:5139/api/auth';
     private baseUrlReg= 'http://localhost:5139/api/auth/register';
         private baseUrlReset= 'http://localhost:5139/api/auth/request-reset';
  constructor(private router: Router, private http: HttpClient ) {}

  setRole(role: string) {
  this.userRole.next(role);
}
getRole() {
  return this.userRole.asObservable();
}

 private getDecodedUserRole(): string | null {
    const token = this.getToken();
    if (!token) return null;

    const decodedToken: any = jwtDecode(token);
    return decodedToken.role || null;
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

    getUserRole(): Observable<string | null> {
    return this.userRoleSubject.asObservable();
  }


  isAuthenticated(): boolean {
    return !!this.getToken();
  }
    updateUserRole() {
    const role = this.getDecodedUserRole();
    this.userRoleSubject.next(role);
  }


  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  logout() {
  localStorage.removeItem(this.tokenKey);
    this.userRoleSubject.next(null);
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


}
