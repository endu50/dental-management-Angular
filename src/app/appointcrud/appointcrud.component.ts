import { Component, OnInit } from '@angular/core';
import { AppointService, Appoint } from '../appoint.service';
import { CommonModule } from '@angular/common';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-appointcrud',
  standalone: true,
  imports: [CommonModule,FormsModule, ReactiveFormsModule],
  templateUrl: './appointcrud.component.html',
  styleUrls: ['./appointcrud.component.css']
})
export class AppointcrudComponent implements OnInit {
  appointForm!: FormGroup;
  isEditMode: boolean = false;
  appointments: Appoint[] = [];
  selectedAppoint?: Appoint;
  errorMessage: string = '';
  searchText: string = '';
  page: number = 1;
  pageSize: number = 7;

  constructor(private appointService: AppointService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
    this.loadAllAppointments();
  }
  

  initForm() {
    this.appointForm = this.fb.group({
      appointId: [null],
      patientName: ['', [Validators.required, Validators.minLength(3)]],
      appointmentDate: ['', Validators.required],
      treatmentType: ['', Validators.required],
      dentistName: ['', Validators.required]
    });
  }
  get f() {
    return this.appointForm.controls;
  }


  loadAllAppointments() {
    this.appointService.getAllAppointments().subscribe({
      next: (data) => (this.appointments = data),
      error: () => (this.errorMessage = 'Failed to load appointments')
    });
  }

  onSubmit() {
    if (this.appointForm.invalid) return;
  
    let formValue: Appoint = this.appointForm.value;
  
    // Format date to ISO string (only if needed by backend)
    formValue = {
      ...formValue,
      appointmentDate: new Date(formValue.appointmentDate)
    };
  
    if (this.isEditMode) {
      this.appointService.updateAppoint(formValue).subscribe({
        next: () => {
          this.loadAllAppointments();
          alert('The Appointment is Updated Successfully');
          this.resetForm();
        },
        error: err => console.error('Update error:', err)
      });
    } else {
      delete formValue.appointId;
      console.log('Creating appointment with:', formValue);
      this.appointService.createAppointment(formValue).subscribe({
        next: () => {
          this.loadAllAppointments();
          this.resetForm();
        },
        error: err => {
          console.error('Create error:', err);
          console.error('Validation errors:', err.error?.errors);
        }
      });
    }
  }
  

  editAppointment(appoint: Appoint) {
    const formattedDate = appoint.appointmentDate
      ? new Date(appoint.appointmentDate).toISOString().split('T')[0]
      : '';
  
    this.appointForm.patchValue({
      ...appoint,
      appointmentDate: formattedDate
    });
  
    this.isEditMode = true;
  }
  

  resetForm() {
    this.appointForm.reset();
    this.isEditMode = false;
  }

  getAppointmentById(id: number) {
    this.appointService.getAppointById(id).subscribe({
      next: (data) => {
        this.selectedAppoint = data;
        this.errorMessage = '';
      },
      error: () => {
        this.selectedAppoint = undefined;
        this.errorMessage = 'Appointment not found';
      }
    });
  }

  deleteAppointment(id: number) {
    if (confirm('Are you sure to delete this appointment?')) {
      this.appointService.deleteAppoint(id).subscribe({
        next: () => {
          this.loadAllAppointments();
          alert('Appointment deleted.');
        },
        error: () => alert('Failed to delete appointment')
      });
    }
  }

  get filteredAppointments() {
    return this.appointments.filter(a =>
      a.patientName.toLowerCase().includes(this.searchText.toLowerCase()) ||
      a.treatmentType.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  get paginatedAppointments() {
    const start = (this.page - 1) * this.pageSize;
    return this.filteredAppointments.slice(start, start + this.pageSize);
  }

  get totalPages() {
    return Math.ceil(this.filteredAppointments.length / this.pageSize);
  }

}
