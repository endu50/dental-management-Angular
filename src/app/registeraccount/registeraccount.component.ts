import { Component } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { ReactiveFormsModule,FormGroup,FormBuilder,Validators, AbstractControl } from '@angular/forms';
import { Account, AuthService } from '../auth-service.service';


@Component({
  selector: 'app-registeraccount',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './registeraccount.component.html',
  styleUrl: './registeraccount.component.css'
})
export class RegisteraccountComponent {
  form: FormGroup;
  account: Account[]=[];

  constructor(private fb: FormBuilder, private auth: AuthService) {
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
      const accounts = this.form.value;
      this.auth.registerAccount(accounts).subscribe({
        next: (data) => {
        console.log('Registered:', data);
        alert("The Account Registered successfully");
        this.form.reset();
      },
      error : (err) => {
          if(err==500 && err?.error?.errors)
         console.log("registration failed"+ err.error.errors)
        }
      })
    }
  }
}
