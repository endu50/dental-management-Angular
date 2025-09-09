// login.component.ts
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
  standalone: true,
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

    this.http.post<{ token: string; role?: string; email?: string  }>(
      `${environment.apiUrl}/auth/login`,
      payload,
      { withCredentials: true } // send/receive the cookie
    ).subscribe({
      next: (res) => {
        if (!res?.token) { alert('Login failed: token missing'); return; }

        // persist access token & role
        localStorage.setItem('token', res.token);
        if (res.role) localStorage.setItem('role', res.role);
           if (res.email) localStorage.setItem('email', res.email);

        // update role through service (avoid touching subjects directly)
        let roleToSet: string | null = null;
        if (res.role) {
          roleToSet = res.role;
        } else {
          try {
            const decoded: any = jwtDecode(res.token);
            roleToSet = decoded?.role || decoded?.['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || null;
          } catch (e) {
            console.error('Failed to decode token after login', e);
            this.forgetpassowrd=true;

          }
        }

        this.authService.updateUserRole(roleToSet);
        this.authService.updateLoginState(true);

        // start timers based on token
        try {
          const decoded: any = jwtDecode(res.token);
          if (decoded?.exp) this.authService.startLogoutTimer(decoded.exp);
        } catch (e) {
          console.error('Bad token.', e);
          this.authService.logout();
        }
        this.authService.setAuthState(res.token, res.role, res.email);

        // navigate based on role
        if (roleToSet === 'User') {
          this.router.navigate(['/home']);
        } else if (roleToSet === 'Admin') {
          this.router.navigate(['/dashboard']);
        } else {
          // default
          this.router.navigate(['/login']);
          this.forgetpassowrd=true;
        }
      },
      error: (err) => {
        console.error('Login failed', err);
         this.forgetpassowrd=true;
       
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
