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
  patientName: [''],
  paymentDescription: [''],
  amount: [''],
  datePayment: [''],
  method: [''],
  issuedDate: ['', Validators.required],
  startDate: [''],   // ✅ new
  endDate: ['']      // ✅ new
});
;
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
filterPayment(event: Event) {
  const patientId = Number(this.receiptForm.get('patientId')?.value);
  const startDateStr = this.receiptForm.get('startDate')?.value;
  const endDateStr = this.receiptForm.get('endDate')?.value;

  if (!patientId) {
    alert('Please enter a valid Patient ID.');
    return;
  }

  const startDate = startDateStr ? new Date(startDateStr) : null;
  const endDate = endDateStr ? new Date(endDateStr) : null;

  // Get Patient Info
  this.patientSer.getPatientId(patientId).subscribe({
    next: (patient) => {
      if (patient) {
        this.patients = patient;
        this.receiptForm.patchValue({ patientName: patient.fullName });
      } 
      else {
        alert('Patient not found');
        this.patients = null;
      }
    },
    error: (err) => {
      console.error('Error fetching patient:', err);
      alert('Error fetching patient information.');
    }
  });

  // Get Payments and Filter by Date Range
  this.receiptService.getPaymentById(patientId).subscribe({
    next: (data) => {
      if (data && data.length > 0) {
        this.payments = data.filter(payment => {
          const paymentDate = new Date(payment.datePayment);
          const isAfterStart = startDate ? paymentDate >= startDate : true;
          const isBeforeEnd = endDate ? paymentDate <= endDate : true;
          return isAfterStart && isBeforeEnd;
        });

        if (this.payments.length === 0) {
          alert('No payments found in selected date range.');
        }

        const firstPayment = this.payments[0];
        if (firstPayment) {
          this.receiptForm.patchValue({
            paymentDescription: firstPayment.paymentDescription,
            amount: firstPayment.amount,
            method: firstPayment.method,
            datePayment: firstPayment.datePayment
          });
        }

      } else {
        alert('No payments found for this patient.');
        this.payments = [];
      }
    },
    error: (err) => {
      console.error('Error fetching payments:', err);
      alert('Error retrieving payment data.');
    }
  });
}
  filterDate() {
  const patientId = Number(this.receiptForm.get('patientId')?.value);
  const startDateStr = this.receiptForm.get('datePayment')?.value;

  if (!patientId) {
    alert('Please enter a valid Patient ID.');
    return;
  }

  const startDate = startDateStr ? new Date(startDateStr) : null;

  this.receiptService.getPaymentById(patientId).subscribe({
    next: (data) => {
      if (data && data.length > 0) {
        this.payments = data.filter(payment => {
          const paymentDate = new Date(payment.datePayment);
          const isSameDate = startDate
            ? paymentDate.toISOString().split('T')[0] === startDate.toISOString().split('T')[0]
            : true;

          return isSameDate;
        });

        if (this.payments.length === 0) {
          alert('No payments found on selected date.');
        }

        const firstPayment = this.payments[0];
        if (firstPayment) {
          this.receiptForm.patchValue({
            paymentDescription: firstPayment.paymentDescription,
            amount: firstPayment.amount,
            method: firstPayment.method,
            datePayment: firstPayment.datePayment
          });
        }

      } else {
        alert('No payments found for this patient.');
        this.payments = [];
      }
    },
    error: (err) => {
      console.error('Error fetching payments:', err);
      alert('Error retrieving payment data.');
    }
  });
}


onPaymentSelect(event: Event) {
  const selectedDate = (event.target as HTMLSelectElement).value;

  const found = this.payments.find(p =>
    new Date(p.datePayment).toISOString().slice(0, 10) ===
    new Date(selectedDate).toISOString().slice(0, 10)
  );

  if (found) {
    this.receiptForm.patchValue({
      paymentDescription: found.paymentDescription,
      amount: found.amount,
      method: found.method,
      datePayment: found.datePayment
    });
  } else {
    alert('No payment matched the selected date');
  }
}

onClear()
{
  this.receiptForm.reset();
  this.patients = null;
  this.payments = [];
   this.receiptForm.patchValue({
    issuedDate: new Date().toISOString().substring(0, 16)});
  
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

