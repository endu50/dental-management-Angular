import { Component, OnInit } from '@angular/core';
import { payment, PaymentService } from '../payment.service';
import { FormGroup, ReactiveFormsModule,FormBuilder, Validators, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-payment-detail',
  imports: [ReactiveFormsModule,CommonModule,FormsModule],
  templateUrl: './payment-detail.component.html',
  styleUrl: './payment-detail.component.css'
})
export class PaymentDetailComponent implements OnInit{

formPayment! : FormGroup;
payments : payment [] = [];
searchText : string= "";
searchDate : string="";

searchDateFirst : string="";
searchDateEnd : string="";

  constructor(private paymentser: PaymentService, private fb: FormBuilder) {

  }


 ngOnInit(): void {

 this.formPayment=this.fb.group({
  paymentId: ['',Validators.required],

     });
   this.getPayments();
   
  } 

get filteredPayments(): payment[] {
  return this.payments.filter(p => {
    const matchText = this.searchText
      ? p.patientId?.toLowerCase().includes(this.searchText.toLowerCase()) ||
        p.method?.toLowerCase().includes(this.searchText.toLowerCase())
      : true;

     const matchDate = this.searchDate
     ? new Date(p.datePayment).toISOString().slice(0, 10).includes(this.searchDate)
      : true;

      
      const paymentDate = new Date(p.datePayment);
    const startDate = this.searchDateFirst ? new Date(this.searchDateFirst) : null;
    const endDate = this.searchDateEnd ? new Date(this.searchDateEnd) : null;

    const matchDateRange =
      (!startDate || paymentDate >= startDate) &&
      (!endDate || paymentDate <= endDate);
    return matchText && matchDate && matchDateRange;
  });
}

 getPayments()
 {
        this.paymentser.getPayment().subscribe({
      next: (data)=> {
         if(data.length > 0){

          this.payments=data;
      } 
    },
      error : ()=>{}
      
    })
 }

}
