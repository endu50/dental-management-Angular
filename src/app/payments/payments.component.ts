import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { PaymentService } from '../payment.service';
import { Patient, PatientService } from '../patient.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-payments',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './payments.component.html',
  styleUrl: './payments.component.css'
})
export class PaymentsComponent implements OnInit {
  form: FormGroup;
patient: Patient | null = null;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private payments: PaymentService,
    private patientser: PatientService,
    private roue: Router
  ) {
 this.form = this.fb.group({
  amount: [null, Validators.required],
  patientId: ['', Validators.required],
  datePayment: ['', Validators.required],
  method: ['online', Validators.required],
  paymentDescription: ['', Validators.required],
  paymentStatus: ['', Validators.required]
});
  }
  ngOnInit(): void {
  
 this.form.patchValue({ datePayment: new Date().toLocaleDateString('en-CA') });
  }

  get PatientId() {
    return this.form.get('PatientId');
    
  }

  resetForm()
  {
    this.form.reset();
      this.patient = null;
       this.form.patchValue({ datePayment: new Date().toLocaleDateString('en-CA') });
  }
printReciept(){
 
  this.roue.navigate(['/reciept']);

}
onChangeHandler(event: Event) {
  const inputValue = Number((event.target as HTMLInputElement).value);
   this.patientser.getPatientId(inputValue).subscribe({  
    next: (data) => {
      if (data ) {
      
        this.patient=data;
      }
      },
      error : ()=> {}
    });
}
submit() {
  const payment = this.form.value;

  const idToMatch = payment.patientId;  // ✅ correct key
  console.log('Patient ID entered:', idToMatch);

  this.patientser.getPatientId(idToMatch).subscribe({
    next: (data) => {
      if (data) {
      
        alert('Patient ID is matched!');
        //  this.patient = data;
 
 this.payments.createPayment(payment).subscribe({
    next: (res: any) => {
      alert(res.message || 'Payment Success');
      console.log(this.form.value);
       this.resetForm();
    },
    error: (err) => {
      console.error('Error:', err);
       console.log(this.form.value);
      alert('Error: ' + (err.error?.message || 'Payment failed Check the Form Input'));
    }
  });

      } else {
        alert('Patient ID not found.');
      }
    },
    error: () => alert('Error fetching patient by ID-> Payment Failed')
  });

 
}

}
