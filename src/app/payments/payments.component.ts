import { Component } from '@angular/core';
import { FormBuilder,ReactiveFormsModule,FormGroup,Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-payments',
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './payments.component.html',
  styleUrl: './payments.component.css'
})
export class PaymentsComponent {
  form: FormGroup;

constructor(private fb: FormBuilder, private http: HttpClient) {
  this.form = this.fb.group({
    amount: [null, Validators.required],
    patientid:[],
    datePayemnt: [],

    paymentMethod: ['online', Validators.required]
  });
}

submit() {
  const payment = this.form.value;

  this.http.post('http://localhost:5139/api/payment/make-payment', payment).subscribe({
    next: (res: any) => alert(res.message || 'Payment Success'),
    error: err => alert('Error: ' + (err.error?.message || 'Payment failed'))
  });
}
}