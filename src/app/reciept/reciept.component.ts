import { Component, OnInit } from '@angular/core';
import { FormGroup,FormBuilder,ReactiveFormsModule,Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { payment, PaymentService } from '../payment.service';
import { Patient, PatientService } from '../patient.service';
@Component({
  selector: 'app-reciept',
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './reciept.component.html',
  styleUrl: './reciept.component.css'
})
export class RecieptComponent implements OnInit {

receiptForm: FormGroup;
  generatedReceipt: payment | null = null;
  payments : payment []=[];
  patients : Patient | null =null;

  constructor(private fb: FormBuilder, private receiptService: PaymentService,private patientSer :PatientService) {
    this.receiptForm = this.fb.group({
      patientId: ['', Validators.required],
      patientName: ['',Validators.required],
       paymentDescription: ['', Validators.required],
      amount: ['',Validators.required],
       datePayment: ['', Validators.required],
      method: ['',Validators.required],
      issuedDate: ['',Validators.required]

  
    });
  }
  ngOnInit(): void {

  this.receiptForm.patchValue({ issuedDate: new Date().toISOString().substring(0, 16) });
    
  }
    

  getPatiendId()
  {
    
    this.receiptForm.value['patientId'];
  }
  getPatintName()
  {
    const patient= Number(this.receiptForm.get('patientId')?.value);
  this.patientSer.getPatientId(patient).subscribe({
    next: (data)=> {
      if(data){
        console.log("patientname:"+ data)
        this.patients=data;
      }
    },
  error : (err)=> { console.log("error on patientName" + err?.error?.errors);}
  })
  }
filterPayment(event: Event){
  const patientId= Number(this.receiptForm.get('patientId')?.value);

 this.receiptService.getPaymentById(patientId).subscribe({
  next: (data)=> {
    if(data.length > 0 ){
      this.getPatintName();
      this.payments = data;
    }
  },
  error : (err)=> { console.log("error on change" + err?.error?.errors);}
})
}

  submit() {
    if (this.receiptForm.valid) {
      this.receiptService.generateReceipt(this.receiptForm.value).subscribe({
        next: (res) => this.generatedReceipt = res,
        error: (err) => alert('Error: ' + err.message)
      });
    }
  }
}

