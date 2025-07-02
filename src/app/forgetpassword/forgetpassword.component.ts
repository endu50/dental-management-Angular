import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Account, AuthService } from '../auth-service.service';

@Component({
  standalone:true,
  selector: 'app-forgetpassword',
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './forgetpassword.component.html',
  styleUrl: './forgetpassword.component.css'
})
export class ForgetpasswordComponent implements OnInit {
  formreset! : FormGroup;
  account : Account[]=[];

  constructor(private fb: FormBuilder, private auth: AuthService) {

  }

  ngOnInit(): void {

    this.formreset= this.fb.group({
      emailform : ['',Validators.required]
    });
  }
    get emailform() {
    return this.formreset.get('emailform');
  }
  // get f()
  // {
  //   return this.formreset.value.controls;
  // }
 onSubmit() {
  const useremail = this.formreset.value.emailform?.toLowerCase(); 
  console.log("Entered email:", useremail);

  if (this.formreset.valid) {
    this.auth.getAccount().subscribe({
      next: (res) => {
        res.forEach(a => {
          if (a.email) {
            console.log("Email from DB (lowercase):", a.email.toLowerCase());
          } else {
            console.warn("Missing email in account:", a);
          }
        });

        const matchedAccount = res.find(a => 
          a.email && a.email.toLowerCase() === useremail
        );

          if(matchedAccount){
            alert('email is matched for reset ppassword');
            this.auth.resetLink(useremail).subscribe({
              next:()=>{
                alert("Password Rest Link send to your email");
              },
              error:()=>{ 
                alert("faile to send the reset link");
              }

            })

          }
          else {
            alert("email Not Matched") 
          }
        },
        error : ()=> {alert("Failed to load account")}
      })
       
  
    }
  }

}
