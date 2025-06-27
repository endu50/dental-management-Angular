// auth.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

export interface Account {
  id: number;
  fullName: string,
  email  : string,
}

@Injectable({ providedIn: 'root' })
export class AuthService {
   private baseUrl = 'http://localhost:5139/api/auth/get';
     private baseUrl2 = 'http://localhost:5139/api/auth';
  constructor(private router: Router, private http: HttpClient ) {}

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
  getAccount():Observable<Account[]>{
    return this.http.get<Account[]>(this.baseUrl)
  }
 
  deleteAccount(id: number):Observable<void> {
     const url = `${this.baseUrl2}/${id}`
    return this.http.delete<void>(url);
  }
}
