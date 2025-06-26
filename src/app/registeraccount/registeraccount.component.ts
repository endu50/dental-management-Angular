import { Component } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { ReactiveFormsModule,FormGroup,FormBuilder,Validators, AbstractControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-registeraccount',
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './registeraccount.component.html',
  styleUrl: './registeraccount.component.css'
})
export class RegisteraccountComponent {
  form: FormGroup;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.form = this.fb.group({
      fullName: ['', [Validators.required,Validators.minLength(5)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6),Validators.pattern('^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@#$%^&+=!.,*()_\\-])[A-Za-z\\d@#$%^&+=!.,*()_\\-]{6,}$')]],
      confirmpassword: ['', Validators.required]
    },{validator : this.passwordmatchvalidator});
    
  }
  get f() { return this.form.controls; }
  
  passwordmatchvalidator(form: AbstractControl) {
    const password = form.get('password')?.value;
    const confirmPasswordControl = form.get('confirmpassword');
  
    if (!confirmPasswordControl) return null;
  
    const confirmPassword = confirmPasswordControl.value;
  
    if (confirmPasswordControl.errors && !confirmPasswordControl.errors['mismatch']) {
      // Don't overwrite other errors like 'required'
      return null;
    }
  
    if (password !== confirmPassword) {
      confirmPasswordControl.setErrors({ ...confirmPasswordControl.errors, mismatch: true });
    } else {
      const errors = confirmPasswordControl.errors;
      if (errors) {
        delete errors['mismatch'];
        if (Object.keys(errors).length === 0) {
          confirmPasswordControl.setErrors(null);
        } else {
          confirmPasswordControl.setErrors(errors);
        }
      }
    }
  
    return null;
  }
  

  onSubmit() {
    if (this.form.valid) {
      this.http.post('http://localhost:5139/api/auth/register', this.form.value)
        .subscribe(res => console.log('Registered:', res));
        alert("The Account Registered successfully");
        this.form.reset();
    }
  }
}
