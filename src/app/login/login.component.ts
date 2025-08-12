import { Component } from '@angular/core';
import { FormGroup,FormBuilder,Validators, AbstractControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { AuthService } from '../auth-service.service';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-login',
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './login.component.html',
 styleUrls: ['./login.component.css']

})
export class LoginComponent {
  form: FormGroup;
   forgetpassowrd = false; 

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router, private authService:AuthService) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }
  get f() { return this.form.controls; }

  
onSubmit() {
  if (this.form.invalid) return;

  this.http.post<any>('http://localhost:5139/api/auth/login', this.form.value).subscribe({
    next: (res) => {
      if (!res?.token) {
        alert("Invalid login attempt - token missing.");
        this.forgetpassowrd = true;
        return;
      }

      // decode token
      const decoded: any = jwtDecode(res.token);
      // try to get role from response or token claims (common claim names)
      const roleFromResponse: string | undefined = res.role;
      const roleFromToken: string | undefined =
        decoded.role ||
        decoded['role'] ||
        decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];

      const role = roleFromResponse || roleFromToken || null;

      // store tokens and role (only store refreshToken if backend actually returned it)
      localStorage.setItem('token', res.token);
      if (res?.refreshToken) {
        localStorage.setItem('refreshToken', res.refreshToken);
      } else {
        console.warn('Login response did not include refreshToken.');
      }
      if (role) localStorage.setItem('role', role);

      console.log("Successfully Logged In, Role:", role);
   // in your login success handler after storing tokens
       this.authService.updateLastActivity();

      // update in-memory state and timer
      this.authService.updateUserRole(role);
      if (decoded?.exp) {
        this.authService.startLogoutTimer(decoded.exp); // exp is seconds since epoch
      } else {
        console.warn('Decoded token missing exp claim.');
      }

      // navigate
      if (role === 'Admin') {
        this.router.navigate(['/dashboard']);
      } else if (role === 'User') {
        this.router.navigate(['/home']);
      } else {
        this.router.navigate(['/home']); // fallback
      }

      this.forgetpassowrd = false;
    },
    error: (err) => {
      alert("Connection refused or check your email and password.");
      this.forgetpassowrd = true;
      console.error("Login failed:", err);
    }
  });
}


  GoToRegisterPage()
  {
    this.router.navigate(['/registeraccount']);
  }

  resetPassword(){

    this.router.navigate(['/resetpassword']);

  }
  
}
