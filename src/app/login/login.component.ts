import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../auth-service.service';
import { jwtDecode } from 'jwt-decode';
import { environment } from '../../environments/environment/environment.component';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  form: FormGroup;
  forgetpassowrd = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  get f() { return this.form.controls; }

onSubmit() {
  if (this.form.invalid) return;
  const payload = { email: this.form.value.email, password: this.form.value.password };

  this.http.post<{ token: string; role?: string }>(
    `${environment.apiUrl}/auth/login`,
    payload,
    { withCredentials: true } // send/receive the cookie
  ).subscribe({
    next: (res) => {
      if (!res?.token) { alert('Login failed: token missing'); return; }

      localStorage.setItem('token', res.token);
      if (res.role) localStorage.setItem('role', res.role);

      try {
        const decoded: any = jwtDecode(res.token);
        const role = res.role || decoded?.role || decoded?.['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || null;
        this.authService.userRoleSubject.next(role);
        if (decoded?.exp) this.authService.startLogoutTimer(decoded.exp);
         // Redirect based on role
  if (role === 'User') {
    this.router.navigate(['/home']);
  } else if(role === 'Admin') {
    this.router.navigate(['/dashboard']);
  }
      } 
      catch (e) {
        console.error('Bad token.', e);
        this.authService.logout();
      }

      
    },
    error: (err) => {
      console.error('Login failed', err);
      alert('Invalid credentials');
    }
  });
}


  GoToRegisterPage() {
    this.router.navigate(['/registeraccount']);
  }

  resetPassword() {
    this.router.navigate(['/resetpassword']);
  }
}
