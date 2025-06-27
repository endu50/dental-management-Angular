import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RegisteraccountComponent } from '../registeraccount/registeraccount.component';
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

  constructor( private fb :FormBuilder,private auth: AuthService) {
    
  }

  ngOnInit(): void {
    
    this.form = this.fb.group({
      
      fullName: [],
      email: [],
      password: []

 
    });
  this.loadContent();
  console.log(this.account);
  }

  getFilteredAccount() :Account[]{
 return this.account.filter(a=>
  a.fullName?.toLowerCase().includes(this.serarchText.toLowerCase()) ||
  a.email?.toLowerCase().includes(this.serarchText.toLowerCase())
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
   
   this.auth.deleteAccount(id).subscribe({
    next: (data) => {
      alert("the Account is deleted successfully!")
        this.loadContent();
    },
    error : ()=> { alert("unable to delete the Account")}
   })

  }


}

