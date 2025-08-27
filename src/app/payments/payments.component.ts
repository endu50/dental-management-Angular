import { Component, OnInit,OnDestroy } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { PaymentService } from '../payment.service';
import { Patient, PatientService } from '../patient.service';
import { Router } from '@angular/router';
import { interval, Subscription } from 'rxjs';


@Component({
  selector: 'app-payments',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './payments.component.html',
  styleUrl: './payments.component.css'
})
export class PaymentsComponent implements OnInit {
  form!: FormGroup;
patient: Patient | null = null;
private clockSub?: Subscription;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private payments: PaymentService,
    private patientser: PatientService,
    private route: Router) {}
  ngOnInit(): void {
  
    this.form = this.fb.group({
  amount: [null, Validators.required],
  patientId: ['', Validators.required],
  datePayment: ['', Validators.required],
  method: ['', Validators.required],
  paymentDescription: ['', Validators.required],
  paymentStatus: ['', Validators.required]
});
 this.form.patchValue({ datePayment: this.toDateTimeLocalString(new Date()) });

  // compute milliseconds until next minute to align ticks nicely
  const msUntilNextMinute = (60 - new Date().getSeconds()) * 1000;
  // first update at start of next minute, then every 60s
  setTimeout(() => {
    if (!this.form.get('datePayment')?.dirty) {
      this.form.get('datePayment')?.patchValue(this.toDateTimeLocalString(new Date()), { emitEvent: false });
    }
    this.clockSub = interval(60000).subscribe(() => {
      const control = this.form.get('datePayment');
      if (!control) return;
      if (control.dirty) {
        this.clockSub?.unsubscribe();
        this.clockSub = undefined;
        return;
      }
      control.patchValue(this.toDateTimeLocalString(new Date()), { emitEvent: false });
    });
  }, msUntilNextMinute);
}

ngOnDestroy(): void {
  this.clockSub?.unsubscribe();
}
  private toDateTimeLocalString(d: Date): string {
  const pad = (n: number) => n.toString().padStart(2, '0');

  const year = d.getFullYear();
  const month = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  const hours = pad(d.getHours());
  const minutes = pad(d.getMinutes());
  // include seconds if you want: const seconds = pad(d.getSeconds());

  return `${year}-${month}-${day}T${hours}:${minutes}`; // "2025-08-25T14:30"
  }

  get f(){
    return this.form.controls;
  }

  get PatientId() {
    return this.form.get('PatientId');
    
  }

  resetForm()
  {
    this.form.reset();
      this.patient = null;
       this.form.patchValue({ datePayment: new Date().toLocaleDateString('en-CA') });
 const nowLocal = this.toDateTimeLocalString(new Date());
  this.form.patchValue({ datePayment: nowLocal });
        this.form.patchValue({method:""});
      this.form.patchValue({paymentStatus:""});
    
  }
printReciept(){
 
  this.route.navigate(['/reciept']);

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
  if(this.form.invalid){
    alert("P/s chek the Form correctly");
    this.form.markAllAsTouched();
    return;
  }
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
      this.form.patchValue({method:""});
      this.form.patchValue({paymentStatus:""});

    },
    error: (err) => {
      console.error('Error:', err);
      //  console.log(this.form.value);
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
