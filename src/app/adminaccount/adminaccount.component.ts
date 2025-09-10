import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Account } from '../auth-service.service';
import { AuthService } from '../auth-service.service';



@Component({
  standalone: true,
  selector: 'app-adminaccount',
  imports: [CommonModule,ReactiveFormsModule,FormsModule],
  templateUrl: './adminaccount.component.html',
  styleUrl: './adminaccount.component.css'
})
export class AdminaccountComponent implements OnInit {

  form! : FormGroup;
  serarchText: string ="";
  account : Account[]=[];
  userName: string= ""; 

  constructor( private fb :FormBuilder,private auth: AuthService) {
    
  }

  ngOnInit(): void {
    
    this.form = this.fb.group({
      
      fullName: ['',Validators.required],  
      email: ['',Validators.required],
       role:['',Validators.required],
        newPassword: ['',Validators.required],
        conPassword: ['',Validators.required]
     

 
    },{validator : this.passwordValidator});
  this.loadContent();
  console.log(this.account);
   this.auth.getAccount().subscribe({
      next:(data)=>{

    this.account =data;
      this.form.get('email')?.valueChanges.subscribe(selectedUser =>  {
     const matched =  this.account.find(a=> 
      a.email === selectedUser

      )
         if(matched){
          this.form.patchValue({fullName: matched.fullName })
          this.form.patchValue({role: matched.role })
        }
      

      }) } ,
    
      error:(err)=>{}
       })
  }
passwordValidator(form : AbstractControl){
  const pass=form.get('newPassword')?.value;

  const  conPassControl= form.get('conPassword');

  if(!conPassControl) return;

  const conPassValue= conPassControl.value;
 
  if(conPassControl.errors && !conPassControl.errors['mismatch']) {
    return null;
  }

  if(pass !== conPassValue){
    conPassControl.setErrors({...conPassControl.errors, mismatch:true})
  }

  else {
    const errors = conPassControl.errors;
    if(errors) {
      delete errors ['mismatch']
    if(Object.keys(errors).length===0) {
      conPassControl.setErrors(null);
    }
    else{
conPassControl?.setErrors(errors)
    }
  }
  }
    
    return null;

}
  get f(){
    return this.form.controls;
  }

  getFilteredAccount() :Account[]{
 return this.account.filter(a=>
  a.fullName?.toLowerCase().includes(this.serarchText.toLowerCase()) ||
  a.email?.toLowerCase().includes(this.serarchText.toLowerCase()) ||
  a.role?.toLowerCase().includes(this.serarchText.toLowerCase()) 
 ) 
  }
  loadContent(){
    this.auth.getAccount().subscribe({
      next : (data)=> { 
        console.log('Loaded accounts:', data); 
        this.account=data
       },
      error :()=> {
        alert("failed to load data");
      }
    })
  }
  deleteAccount(id : number) {
   
    if(confirm('Are You Sure to Delete The Account?'))
   this.auth.deleteAccount(id).subscribe({
    next: (data) => {
      alert("the Account is deleted successfully!")
        this.loadContent();
    },
    error : ()=> { alert("unable to delete the Account")}
   })

  }
  onResetPassword(){
   let formValue:Account=this.form.value;
    this.auth.resetPasswordAdmin(formValue).subscribe({
     next:(data)=>{
       alert("The Password Rest successfully!");
       this.form.reset();
       this.form.patchValue({email: ""})
     },
     error:(err)=> {
       console.log("ExactError"+ err.error.errors);
       console.error(err);
      alert("Failed to Reset Password");
    }
    })
  }

}

