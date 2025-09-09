import { Component, OnInit } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { ReactiveFormsModule,FormGroup,FormBuilder,Validators, AbstractControl } from '@angular/forms';
import { Account, AuthService } from '../auth-service.service';
import { finalize } from 'rxjs';


@Component({
  selector: 'app-registeraccount',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './registeraccount.component.html',
  styleUrl: './registeraccount.component.css'
})
export class RegisteraccountComponent implements OnInit {
  form: FormGroup;
  account: Account[]=[];
  acc:Account | null= null;
  emaildb:string="";
 loading = false;
  constructor(private fb: FormBuilder, private auth: AuthService) {
    this.form = this.fb.group({
      fullName: ['', [Validators.required,Validators.minLength(5)]],
      email: ['', [Validators.required, Validators.email]],
      PhoneNumber: ['',[Validators.required,Validators.pattern(/^\d{10}$/)]],
      password: ['', [Validators.required, Validators.minLength(6),Validators.pattern('^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@#$%^&+=!.,*()_\\-])[A-Za-z\\d@#$%^&+=!.,*()_\\-]{6,}$')]],
      confirmpassword: ['', Validators.required],
      OtpCode:[''],
      Role: ['',Validators.required]
    },{validator : this.passwordmatchvalidator});
    
  }
  ngOnInit(): void {
    this.form.patchValue({OtpCode : "1212"});
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
      const email= this.form.get('email')?.value;
      this.auth.getAccount().subscribe({
        next:(data)=>{
      const matched=  data.find(a=> a.email  && a.email.toLowerCase()=== email);
       if(!matched) {

                this.auth.registerAccount(accounts).subscribe({
        next: (data) => {
        //console.log('Registered:', data);
        alert("The Account Registered successfully");
        this.form.reset();
        this.form.patchValue({Role: ""});
           this.form.patchValue({OtpCode : "1212"});
      },
      error : (err) => {
          if(err==500 && err?.error?.errors)
         console.log("registration failed"+ err.error.errors)
        alert("registration failed");
        }
      });

        }

        else {
          alert ("Email Already Exist Try another!!!");
        }


          
        },
        error:(err)=>  {

        } 
         });

    }
    else {
      alert("Invalid Form");
    }
  }
  resetForm(){
    this.form.reset();
      this.form.patchValue({Role: ""});
         this.form.patchValue({OtpCode : "1212"});
  }
}
