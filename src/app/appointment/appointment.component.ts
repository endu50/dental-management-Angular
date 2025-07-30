import { Component, OnInit } from '@angular/core';
import { Appoint, AppointService } from '../appoint.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-appointment',
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './appointment.component.html'
})
export class AppointmentComponent implements OnInit {
  
  appointForm!: FormGroup;
  appointments: Appoint[] = [];
  selectedAppoint?: Appoint;
  errorMessage: string = '';

  constructor(private fb: FormBuilder, private appointService: AppointService) {}

  ngOnInit(): void {
    this.appointForm = this.fb.group({
      patientName: ['', [Validators.required,Validators.minLength(5)]],
      appointmentDate: ['', Validators.required],
      treatmentType: ['', Validators.required],
      dentistName: ['', Validators.required],
      status:['Pending']
    });



    // this.loadAppointments();
  }
  get f(){
   return this.appointForm.controls;
 }
  // loadAppointments() {
  //   this.appointService.getAllAppointments().subscribe(data => {
  //     this.appointments = data;
  //   });
  // }

  onSubmit() {
    if (this.appointForm.valid) {
      this.appointService.createAppointment(this.appointForm.value).subscribe(() => {
        alert('Successfully registered the Appointment');
        this.appointForm.reset();
        
      });
    }
  }


}
