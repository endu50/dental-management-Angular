import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Validator } from '@angular/forms';
import { AuthService } from '../auth-service.service';
import { Account } from '../auth-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-change-password',
  imports: [ReactiveFormsModule,FormsModule,CommonModule],  
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css'
})
export class ChangePasswordComponent implements OnInit {

  changeForm!: FormGroup;
  Accounts: Account | null = null; 
  serverErrors: string [] =[];
  isWorking: boolean = false;
   Role: any ;
   Email: any;

  constructor(private fb:FormBuilder,private auth: AuthService, private route :Router){}

  ngOnInit(): void {

   this.changeForm = this.fb.group({
     email:['',[Validators.required,Validators.email]],
     role:['',Validators.required],
     password:['',Validators.required],
      newPassword:['',[Validators.required,Validators.minLength(6),Validators.pattern('^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@#$%^&+=!.,*()_\\-])[A-Za-z\\d@#$%^&+=!.,*()_\\-]{6,}$')]],
      conNewPassword:['',Validators.required]

   }, {validator:this.passwordMatch})
    
     this.auth.currentUserRole$.subscribe(role=>{
    this.Role= role;
  
   });
     // Set Email
  this.auth.currentUserEmail$.subscribe(email => {
    this.Email = email;

  });
      this.changeForm.patchValue({ email: this.Email });
     this.changeForm.patchValue({role : this.Role})
  }
  get F(){
    return this.changeForm.controls;
  }
 


//   passwordMatch(changeForm: FormGroup) {
//   const newPassword = changeForm.get('newPassword')?.value;
//   const conNewPassword = changeForm.get('conNewPassword')?.value;

//   if (newPassword !== conNewPassword) {
//     changeForm.get('conNewPassword')?.setErrors({ mismatch: true });
//   } else {
//     changeForm.get('conNewPassword')?.setErrors(null);
//   }
//   return null;
// }
passwordMatch(changeForm: FormGroup) {
  const newPassword = changeForm.get('newPassword')?.value;
  const conNewPasswordCtrl = changeForm.get('conNewPassword');

  if (!conNewPasswordCtrl) return null;

  // Keep existing errors (like required)
  const errors = conNewPasswordCtrl.errors || {};

  if (conNewPasswordCtrl.value && newPassword !== conNewPasswordCtrl.value) {
    errors['mismatch'] = true;
  } else {
    delete errors['mismatch'];
  }

  // If there are no errors left, set to null
  conNewPasswordCtrl.setErrors(Object.keys(errors).length ? errors : null);

  return null;
}


  onChangePassword(){
      // First: verify current password on server
      const currentPassword = this.changeForm.get('password')!.value;
       const newPassword = this.changeForm.get('newPassword')!.value;
          this.isWorking = true;
     // First: verify current password on server
    this.auth.verifyCurrentPassword(currentPassword).subscribe(isValid => {
      if (!isValid) {
        this.isWorking = false;
        // set form error on password control
        this.changeForm.get('password')?.setErrors({ invalid: true });
        this.serverErrors = ['Current password is incorrect.'];
        return;
      }

      // If valid, request change
      this.auth.changePassword(currentPassword, newPassword).subscribe(res => {
        this.isWorking = false;
        if (res?.ok) {
          alert(res.message || 'Password changed successfully. Login To Continue ');
          this.auth.logout();
          //this.route.navigate(['/login']);
          
          //this.resetForm();

        } else {
          // show server-side errors
          this.serverErrors = res?.errors ?? ['Unable to change password'];
        // this.serverErrors = (res as any)?.errors ?? ['Unable to change password'];

          // if server included message(s), mark controls as invalid if appropriate
          this.changeForm.get('newPassword')?.setErrors({ server: true });
        }
      }, err => {
        this.isWorking = false;
        console.error('changePassword request failed', err);
        this.serverErrors = ['Unable to change password — try again later.'];
      });
    }, err => {
      this.isWorking = false;
      console.error('verifyCurrentPassword failed', err);
      this.serverErrors = ['Unable to verify current password — try again later.'];
    });
    
} 

  resetForm(){
    this.changeForm.reset();
   this.serverErrors=[];
   this.isWorking = false;
     this.changeForm.patchValue({ email: this.Email });
     this.changeForm.patchValue({role : this.Role})
  }

}
