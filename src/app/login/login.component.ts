import { Component } from '@angular/core';
import { FormGroup,FormBuilder,Validators, AbstractControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  form: FormGroup;
   forgetpassowrd = false; 

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }
  get f() { return this.form.controls; }

  

  onSubmit() {
    if (this.form.valid) {
      this.http.post<any>('http://localhost:5139/api/auth/login', this.form.value)
        .subscribe({ next:(res) => {
          if(res.token) { 
          localStorage.setItem('token', res.token); // Store JWT
          if (localStorage.getItem('token')===res.token) {
          console.log("Successfllly Login!!!");
          this.router.navigate(['/home']);
          this.forgetpassowrd = false;
          }
          else {
            alert('Incorrect Email Or Password');
             this.forgetpassowrd=true;
                
            this.form.addControl
            
          }
        }
        else {
             alert("Invalid login attempt - token missing.");
                 this.forgetpassowrd=true;
            
        }
      },
        error: (err) => {
          // This block runs when login fails (wrong password, server error, etc.)
          alert("connection refused Or check your email and password.");
              this.forgetpassowrd=true;
          console.error("Login failed:", err);
        }
       
        });
    }

  }

  GoToRegisterPage()
  {
    this.router.navigate(['/registeraccount']);
  }

  resetPassword(){

    this.router.navigate(['/resetpassword']);

  }
  
}
