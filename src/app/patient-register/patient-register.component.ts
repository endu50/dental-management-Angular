import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PatientService, Patient } from '../patient.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-patient-register',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './patient-register.component.html',
  styleUrl: './patient-register.component.css'
})
export class PatientRegisterComponent implements OnInit {
  patientForm!: FormGroup;
  submitted = false;
  patientIdAfterSubmit: number | null = null; // 👈 store the patientId

  constructor(private fb: FormBuilder, public patientService: PatientService) {}

  ngOnInit(): void {
    this.patientForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(5)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      gender: ['', Validators.required],
      dateOfBirth: ['', Validators.required]
    });
  }

  get f() { return this.patientForm.controls; }

  onSubmit(): void {
    this.submitted = true;
    if (this.patientForm.invalid) return;

    const patient: Patient = this.patientForm.value;
    this.patientService.registerPatient(patient).subscribe({
      next: (data)=> {
      console.log("the form value",this.patientForm.value);
      alert('Patient registered successfully');
       this.patientIdAfterSubmit=data.id;
       this.patientForm.reset();
      this.submitted = false;
      },
      error : ()=>{}
    });
  }

}
