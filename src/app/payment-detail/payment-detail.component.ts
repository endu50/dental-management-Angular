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
payment! : payment;
// originalPaymentStatus! :payment;

searchDateFirst : string="";
searchDateEnd : string="";

page: number = 1;
pageSize: number = 7;
totalSummery: number=0;

  constructor(private paymentser: PaymentService, private fb: FormBuilder) {

  }


 ngOnInit(): void {

 this.formPayment=this.fb.group({
  paymentId: ['',Validators.required],
    datePayment: ['',Validators.required],
      datePaymentFirst: ['',Validators.required],
        datePaymentEnd: ['',Validators.required],
        paymentStatus: ['']


     });
   this.getPayments();

//      this.payment = { paymentStatus: 'Paid' };
//  this.formPayment.patchValue({ paymentStatus: payment.paymentStatus });

   
  } 

get filteredPayments(): payment[] {
  this.searchText= this.formPayment.get('paymentId')?.value;
  this.searchDate = this.formPayment.get('datePayment')?.value;
  this.searchDateFirst = this.formPayment.get('datePaymentFirst')?.value;
  this.searchDateEnd = this.formPayment.get('datePaymentEnd')?.value;
  return this.payments.filter(p => {
    const matchText = this.searchText
      ? p.patientId?.toLowerCase().includes(this.searchText.toLowerCase()) ||
        p.method?.toLowerCase().includes(this.searchText.toLowerCase())
      : true;

    //  const matchDate = this.searchDate
    //  ? new Date(p.datePayment).toISOString().slice(0, 10).includes(this.searchDate.toLowerCase())
    //   : true;


      const paymentDate = new Date(p.datePayment);
    const startDate = this.searchDateFirst ? new Date(this.searchDateFirst) : null;
    const endDate = this.searchDateEnd ? new Date(this.searchDateEnd) : null;

    const matchDateRange =
      (!startDate || paymentDate >= startDate) &&
      (!endDate || paymentDate <= endDate);
    return matchText  && matchDateRange;
  });

 
}
get totalSummeryValue(): number {
  return  this.totalSummery = this.filteredPayments.reduce((sum, payment) => sum + payment.amount,0)
}
get formControl()
{
  return {
   patientId: this.formPayment.get('patientId'),
   datePayment:  this.formPayment.get('datePayment')
  }; 
  
}
clearInput(){
this.formPayment.reset();
}

getPayments() {
  this.paymentser.getPayment().subscribe({
    next: (data) => {
      if (data.length > 0) {
        // Add originalPaymentStatus to track initial status
        this.payments = data.map(p => ({
          ...p,
          originalPaymentStatus: p.paymentStatus
        }));
      }
    },
    error: () => { alert("failed to load data"); }
  });
}

 updatePaymentStatus(payment : payment)
 {
  const updatePayment= {
  ...payment, paymentStatus:payment.paymentStatus
  };
   this.paymentser.updatePaymentStatus(updatePayment).subscribe({
    next:(data)=> {
      // this.payment = data;
       alert('Payment status updated successfully');
    }
    
    ,
    error:err => {
      console.log("error update payment status"+ err);
      console.error(err);
    }


   })

   
 }

 getPage(){
    const start = (this.page - 1) * this.pageSize;
    return this.filteredPayments.slice(start, start + this.pageSize);
 }
   get totalPages() {
    return Math.ceil(this.filteredPayments.length / this.pageSize);
  }

}
