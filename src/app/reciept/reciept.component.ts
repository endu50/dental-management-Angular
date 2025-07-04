import { Component } from '@angular/core';
import { FormGroup,FormBuilder,ReactiveFormsModule,Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { payment, PaymentService } from '../payment.service';
@Component({
  selector: 'app-reciept',
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './reciept.component.html',
  styleUrl: './reciept.component.css'
})
export class RecieptComponent {

receiptForm: FormGroup;
  generatedReceipt: payment | null = null;

  constructor(private fb: FormBuilder, private receiptService: PaymentService) {
    this.receiptForm = this.fb.group({
      patientId: ['', Validators.required],
      paymentStatus: ['', Validators.required],
      amount: [0, Validators.required],
      method: ['', Validators.required],
    });
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

